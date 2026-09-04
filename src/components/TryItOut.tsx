import { useState } from 'react';
import NoiseButton from './NoiseButton';

interface SampleTask {
  name: string;
  prompt: string;
  model: string;
  runtime: string;
  files: string[];
  test: string;
}

const SAMPLES: SampleTask[] = [
  {
    name: 'Add Prometheus Telemetry',
    prompt: 'Add Prometheus metrics middleware to Axum router and export /metrics endpoint',
    model: 'claude-3-7-sonnet',
    runtime: 'podman',
    files: ['src/metrics.rs', 'src/server.rs', 'Cargo.toml'],
    test: 'cargo test --test metrics_test',
  },
  {
    name: 'JWT Auth Rate Limiting',
    prompt: 'Implement token-bucket rate limiting per IP and JWT subject with Redis backend',
    model: 'gpt-4o',
    runtime: 'podman',
    files: ['src/auth/limiter.rs', 'src/middleware.rs'],
    test: 'cargo test auth::limiter',
  },
  {
    name: 'Postgres DB Migration',
    prompt: 'Create SQL migration for tenant organizations table with cascade deletes and tests',
    model: 'gemini-2.0-flash',
    runtime: 'docker',
    files: ['migrations/20260904_tenants.sql', 'tests/db_test.rs'],
    test: 'cargo test --test db_test',
  },
];

export default function TryItOut() {
  const [selectedTask, setSelectedTask] = useState<SampleTask>(SAMPLES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>(SAMPLES[0].prompt);
  const [selectedRuntime, setSelectedRuntime] = useState<string>('podman');
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-7-sonnet');
  const [copied, setCopied] = useState(false);
  const [simulatedRun, setSimulatedRun] = useState(false);

  const command = `niki run --sandbox=${selectedRuntime} --model=${selectedModel} "${customPrompt}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const handleSelectSample = (sample: SampleTask) => {
    setSelectedTask(sample);
    setCustomPrompt(sample.prompt);
    setSelectedRuntime(sample.runtime);
    setSelectedModel(sample.model);
    setSimulatedRun(false);
  };

  return (
    <section id="try-it-out" className="py-20 border-t border-dotted border-[var(--st)] bg-[var(--sf-secondary)]">
      <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
            Interactive Command Workbench
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--tx)] mb-3">
            Build Your First Niki Run
          </h2>
          <p className="font-sans text-sm sm:text-base text-[var(--tx-secondary)] max-w-xl mx-auto leading-relaxed">
            Construct a hermetic agent task, choose your sandboxed container runtime and LLM model, and inspect the command.
          </p>
        </div>

        <div className="max-w-3xl mx-auto border border-dotted border-[var(--st)] bg-[var(--sf-raised)] shadow-xs p-6">
          {/* Quick Presets */}
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--tx-tertiary)] block mb-2">
              Preset Engineering Tasks:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`px-3 py-1.5 text-xs font-mono border border-dotted transition-all cursor-pointer ${
                    customPrompt === sample.prompt
                      ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] font-semibold'
                      : 'bg-[var(--sf)] text-[var(--tx-secondary)] hover:text-[var(--tx)] border-[var(--st-secondary)]'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="text-[11px] font-mono text-[var(--tx-secondary)] block mb-1.5">
              Task Prompt (Natural Language):
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => {
                setCustomPrompt(e.target.value);
                setSimulatedRun(false);
              }}
              className="w-full px-3.5 py-2.5 bg-[var(--sf)] border border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx)] focus:outline-none focus:border-[var(--accent-orange)] transition-colors"
              placeholder="Describe the change, feature, or bugfix..."
            />
          </div>

          {/* Configuration Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Sandbox Runtime */}
            <div>
              <label className="text-[11px] font-mono text-[var(--tx-secondary)] block mb-1.5">
                Sandbox Runtime:
              </label>
              <select
                value={selectedRuntime}
                onChange={(e) => setSelectedRuntime(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--sf)] border border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx)] focus:outline-none focus:border-[var(--accent-orange)]"
              >
                <option value="podman">Podman (Rootless OCI - Recommended)</option>
                <option value="docker">Docker Daemon</option>
                <option value="worktree">Git Worktree (Lightweight)</option>
              </select>
            </div>

            {/* Model Router */}
            <div>
              <label className="text-[11px] font-mono text-[var(--tx-secondary)] block mb-1.5">
                Frontier LLM Provider (BYOK):
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--sf)] border border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx)] focus:outline-none focus:border-[var(--accent-orange)]"
              >
                <option value="claude-3-7-sonnet">Anthropic Claude 3.7 Sonnet</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="o3-mini">OpenAI o3-mini (High Reasoning)</option>
                <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
                <option value="ollama-deepseek-r1">Ollama / DeepSeek R1 (Local)</option>
              </select>
            </div>
          </div>

          {/* Resulting CLI Command */}
          <div className="p-4 bg-[var(--sf)] border border-dotted border-[var(--st-secondary)] font-mono text-xs mb-4">
            <div className="flex items-center justify-between text-[10px] text-[var(--tx-tertiary)] pb-2 mb-2 border-b border-dotted border-[var(--st-secondary)]">
              <span>GENERATED CLI INVOCATION</span>
              <span className="text-[var(--accent-green)]">● HOST ISOLATION ENFORCED</span>
            </div>
            <div className="flex items-center justify-between gap-3 overflow-x-auto select-all">
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-orange)] font-bold select-none">$</span>
                <span className="text-[var(--tx)] break-all">{command}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border border-dotted transition-all cursor-pointer bg-[var(--sf-raised)] hover:bg-[var(--hover)] text-[var(--tx)] border-[var(--st-secondary)]"
              >
                {copied ? '✔ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSimulatedRun(true)}
              className="px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider bg-[var(--accent-orange)] text-white hover:brightness-105 border border-dotted border-[var(--accent-orange)] cursor-pointer"
            >
              Simulate Niki Pipeline
            </button>

            <span className="text-[11px] font-mono text-[var(--tx-tertiary)]">
              Produces branch: <code className="text-[var(--tx-secondary)]">niki/task-{"<hash>"}</code>
            </span>
          </div>

          {/* Simulation Output Card */}
          {simulatedRun && (
            <div className="mt-5 p-4 bg-[var(--sf)] border border-dotted border-emerald-500/40 text-xs font-mono space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold pb-2 border-b border-dotted border-emerald-500/20">
                <span>✔ SIMULATED PIPELINE VERIFICATION PASSED</span>
                <span>Branch: niki/task-8f9c</span>
              </div>
              <div className="text-[var(--tx-secondary)] space-y-1">
                <div>[1] Planner mapped 3 files: <span className="text-[var(--tx)]">{selectedTask.files.join(', ')}</span></div>
                <div>[2] Coder generated unified diff in isolated sandbox ({selectedRuntime})</div>
                <div>[3] Tester executed: <code className="text-[var(--accent-orange)]">{selectedTask.test}</code> — 100% pass</div>
                <div>[4] Reviewer signed off with 0 security warnings</div>
              </div>
              <div className="pt-2 border-t border-dotted border-[var(--st-secondary)] text-[11px] text-[var(--tx-tertiary)] flex justify-between">
                <span>To inspect: git checkout niki/task-8f9c</span>
                <span className="text-emerald-500 font-bold">Host Working Tree: 0 changes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
