import { useState, useEffect, useRef } from 'react';

interface TaskPreset {
  id: string;
  title: string;
  command: string;
  files: string[];
  testCommand: string;
  diffSummary: string;
  logs: {
    agent: 'PLANNER' | 'CODER' | 'TESTER' | 'REVIEWER' | 'SYSTEM';
    text: string;
    delay: number;
  }[];
  diffLines: { type: 'add' | 'del' | 'normal' | 'header'; text: string }[];
}

const PRESETS: TaskPreset[] = [
  {
    id: 'rate-limit',
    title: 'Rate-Limiting Middleware',
    command: 'niki run "Add sliding-window rate limiting to /api/checkout and tests"',
    files: ['src/middleware/rate_limit.rs', 'src/api/checkout.rs', 'tests/rate_limit_test.rs'],
    testCommand: 'cargo test --test rate_limit_test',
    diffSummary: '+114 / -6 lines across 3 files',
    logs: [
      { agent: 'SYSTEM', text: 'Spawning isolated Podman sandbox: podman://sandbox-c892f (read-only host mount)', delay: 100 },
      { agent: 'PLANNER', text: 'Inspecting workspace AST. Identified target: /api/checkout token bucket with Redis store.', delay: 500 },
      { agent: 'CODER', text: 'Emitting surgical unified diff for src/middleware/rate_limit.rs inside sandbox...', delay: 1400 },
      { agent: 'TESTER', text: 'Executing cargo test --test rate_limit_test in container... (8 passed, 0 failed)', delay: 2300 },
      { agent: 'REVIEWER', text: 'Audit passed: constant-time token checks verified. Clean branch created: niki/rate-limit-c892', delay: 3200 },
    ],
    diffLines: [
      { type: 'header', text: '--- a/src/api/checkout.rs' },
      { type: 'header', text: '+++ b/src/api/checkout.rs' },
      { type: 'normal', text: ' pub fn router() -> Router {' },
      { type: 'del', text: '-    Router::new().route("/checkout", post(handle_checkout))' },
      { type: 'add', text: '+    Router::new()' },
      { type: 'add', text: '+        .route("/checkout", post(handle_checkout))' },
      { type: 'add', text: '+        .layer(RateLimitLayer::new(100, Duration::from_secs(60)))' },
      { type: 'normal', text: ' }' },
      { type: 'header', text: '--- a/src/middleware/rate_limit.rs (NEW)' },
      { type: 'add', text: '+pub struct RateLimitLayer { capacity: u32, window: Duration }' },
    ],
  },
  {
    id: 'sql-refactor',
    title: 'Postgres Connection Pooling',
    command: 'niki run "Refactor raw SQL client to bb8 Postgres pool with health checks"',
    files: ['src/db/pool.rs', 'src/db/mod.rs', 'Cargo.toml'],
    testCommand: 'cargo test --lib db::pool',
    diffSummary: '+82 / -45 lines across 3 files',
    logs: [
      { agent: 'SYSTEM', text: 'Mounting ephemeral worktree into container sandbox (host tree sealed read-only)...', delay: 100 },
      { agent: 'PLANNER', text: 'Scanning call-sites. Found 14 unpooled client allocations. Strategy: add bb8-postgres pool.', delay: 500 },
      { agent: 'CODER', text: 'Applying diffs to Cargo.toml and implementing src/db/pool.rs Arc<DbPool> manager...', delay: 1400 },
      { agent: 'TESTER', text: 'Running test container with mock postgres socket... test_acquire_release ok.', delay: 2300 },
      { agent: 'REVIEWER', text: 'Approved: pool timeout handling on deadlock verified. Branch: niki/bb8-pool-refactor', delay: 3200 },
    ],
    diffLines: [
      { type: 'header', text: '--- a/src/db/mod.rs' },
      { type: 'header', text: '+++ b/src/db/mod.rs' },
      { type: 'del', text: '-pub async fn get_client() -> Result<tokio_postgres::Client> {' },
      { type: 'add', text: '+pub type DbPool = bb8::Pool<PostgresConnectionManager<NoTls>>;' },
      { type: 'add', text: '+pub async fn init_pool(cfg: &Config) -> Result<DbPool> {' },
      { type: 'normal', text: '     let manager = PostgresConnectionManager::new(cfg.db_url, NoTls);' },
      { type: 'add', text: '+    bb8::Pool::builder().max_size(20).build(manager).await' },
      { type: 'normal', text: ' }' },
    ],
  },
  {
    id: 'webhook-tests',
    title: 'Webhook HMAC Verification',
    command: 'niki run "Validate Stripe webhook HMAC signatures with constant-time equality"',
    files: ['src/webhooks/stripe.rs', 'tests/fuzz_webhook.rs'],
    testCommand: 'cargo test --test fuzz_webhook',
    diffSummary: '+67 / -12 lines across 2 files',
    logs: [
      { agent: 'SYSTEM', text: 'Initialized Podman sandbox. Host repo sealed (0 host mutations).', delay: 100 },
      { agent: 'PLANNER', text: 'Inspecting webhook route. Identified timing attack vulnerability on raw string equality.', delay: 500 },
      { agent: 'CODER', text: 'Refactored verification to use subtle::ConstantTimeEq over signature digest.', delay: 1400 },
      { agent: 'TESTER', text: 'Synthesized 16 fuzz test vectors in tests/fuzz_webhook.rs. Timing attack resistance pass.', delay: 2300 },
      { agent: 'REVIEWER', text: 'Security review complete. Timing leak resolved. Signed off to niki/stripe-hmac-verify.', delay: 3200 },
    ],
    diffLines: [
      { type: 'header', text: '--- a/src/webhooks/stripe.rs' },
      { type: 'header', text: '+++ b/src/webhooks/stripe.rs' },
      { type: 'del', text: '-if expected_signature == received_signature {' },
      { type: 'add', text: '+use subtle::ConstantTimeEq;' },
      { type: 'add', text: '+if expected_signature.as_bytes().ct_eq(received_signature.as_bytes()).into() {' },
    ],
  },
];

export default function AgentSandboxVisualizer() {
  const [activePreset, setActivePreset] = useState<TaskPreset>(PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'logs' | 'diff'>('logs');
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState<TaskPreset['logs']>([]);
  const [currentStep, setCurrentStep] = useState<number>(4);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  const handleSelectPreset = (preset: TaskPreset) => {
    setActivePreset(preset);
    setIsRunning(false);
    setVisibleLogs(preset.logs);
    setCurrentStep(4);
  };

  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisibleLogs([]);
    setCurrentStep(1);

    const logs = activePreset.logs;
    logs.forEach((logItem, index) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, logItem]);

        if (logItem.agent === 'PLANNER') setCurrentStep(1);
        if (logItem.agent === 'CODER') setCurrentStep(2);
        if (logItem.agent === 'TESTER') setCurrentStep(3);
        if (logItem.agent === 'REVIEWER') setCurrentStep(4);

        if (index === logs.length - 1) {
          setIsRunning(false);
        }
      }, logItem.delay);
    });
  };

  useEffect(() => {
    setVisibleLogs(activePreset.logs);
  }, []);

  const getBadgeColor = (agent: string) => {
    switch (agent) {
      case 'PLANNER':
        return 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'CODER':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'TESTER':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'REVIEWER':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/30';
    }
  };

  return (
    <div className="w-full border border-[var(--st)] bg-[var(--sf-raised)] rounded-md overflow-hidden shadow-xs flex flex-col font-sans">
      {/* Sleek Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--sf-secondary)] border-b border-[var(--st-secondary)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs font-mono font-medium text-[var(--tx-secondary)] ml-1">
            niki sandbox runtime
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-[var(--tx-tertiary)]">
            0 Host Writes
          </span>
        </div>
      </div>

      {/* Preset Task Pills */}
      <div className="px-4 py-2.5 bg-[var(--sf)] border-b border-[var(--st-secondary)] flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-colors cursor-pointer border ${
                activePreset.id === preset.id
                  ? 'bg-[var(--sf-raised)] text-[var(--tx)] font-semibold border-[var(--accent-orange)]'
                  : 'text-[var(--tx-secondary)] border-transparent hover:text-[var(--tx)] hover:bg-[var(--hover)]'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={isRunning}
          className={`shrink-0 px-3 py-1 font-mono text-xs font-semibold rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
            isRunning
              ? 'bg-[var(--sf-secondary)] text-[var(--tx-tertiary)] cursor-wait'
              : 'bg-[var(--accent-orange)] text-white hover:brightness-105 shadow-xs'
          }`}
        >
          {isRunning ? (
            <>
              <span className="animate-spin text-xs">↻</span>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span>▶ Run</span>
            </>
          )}
        </button>
      </div>

      {/* 4-Agent Pipeline Step Indicator */}
      <div className="grid grid-cols-4 border-b border-[var(--st-secondary)] bg-[var(--sf-secondary)]/50 text-[10px] font-mono text-center">
        <div
          className={`py-1.5 border-r border-[var(--st-secondary)] transition-colors ${
            currentStep >= 1 ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-500/5' : 'text-[var(--tx-tertiary)]'
          }`}
        >
          1. PLANNER
        </div>
        <div
          className={`py-1.5 border-r border-[var(--st-secondary)] transition-colors ${
            currentStep >= 2 ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5' : 'text-[var(--tx-tertiary)]'
          }`}
        >
          2. CODER
        </div>
        <div
          className={`py-1.5 border-r border-[var(--st-secondary)] transition-colors ${
            currentStep >= 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5' : 'text-[var(--tx-tertiary)]'
          }`}
        >
          3. TESTER
        </div>
        <div
          className={`py-1.5 transition-colors ${
            currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5' : 'text-[var(--tx-tertiary)]'
          }`}
        >
          4. REVIEWER
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-4 bg-[var(--sf)] border-b border-[var(--st-secondary)] text-xs font-mono">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[var(--accent-orange)] text-[var(--tx)] font-semibold'
                : 'border-transparent text-[var(--tx-tertiary)] hover:text-[var(--tx)]'
            }`}
          >
            Live Logs ({visibleLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            className={`py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'diff'
                ? 'border-[var(--accent-orange)] text-[var(--tx)] font-semibold'
                : 'border-transparent text-[var(--tx-tertiary)] hover:text-[var(--tx)]'
            }`}
          >
            Diff Output
          </button>
        </div>

        <span className="text-[11px] text-[var(--tx-tertiary)] truncate max-w-[200px]">
          {activePreset.diffSummary}
        </span>
      </div>

      {/* Stream Area */}
      <div
        className="min-h-[200px] max-h-[250px] overflow-y-auto p-4 bg-[var(--sf-raised)] font-mono text-xs leading-relaxed"
        ref={logsContainerRef}
      >
        {activeTab === 'logs' && (
          <div className="space-y-2">
            {visibleLogs.length === 0 ? (
              <div className="text-[var(--tx-tertiary)] italic text-center py-8">
                Click "Run" to trigger autonomous pipeline...
              </div>
            ) : (
              visibleLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 animate-fadeIn">
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold border rounded-xs shrink-0 ${getBadgeColor(
                      log.agent
                    )}`}
                  >
                    {log.agent}
                  </span>
                  <span className="text-[var(--tx)] text-[11px] leading-snug break-words">
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="space-y-1 text-[11px]">
            {activePreset.diffLines.map((line, idx) => {
              if (line.type === 'header') {
                return (
                  <div key={idx} className="text-blue-500 font-bold">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'add') {
                return (
                  <div key={idx} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-xs">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'del') {
                return (
                  <div key={idx} className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-xs">
                    {line.text}
                  </div>
                );
              }
              return (
                <div key={idx} className="text-[var(--tx-secondary)] px-1.5">
                  {line.text}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-[var(--sf-secondary)] border-t border-[var(--st-secondary)] flex items-center justify-between text-[11px] font-mono text-[var(--tx-tertiary)]">
        <span>Target: <strong className="text-[var(--tx)]">podman://rootless</strong></span>
        <span>Branch: <strong className="text-[var(--accent-orange)]">niki/{activePreset.id}</strong></span>
      </div>
    </div>
  );
}
