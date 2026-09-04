import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CommandTab {
  id: string;
  label: string;
  cmd: string;
  comment: string;
}

const TABS: CommandTab[] = [
  {
    id: 'cargo',
    label: 'Cargo Install',
    cmd: 'cargo install --git https://github.com/RavaniRoshan/niki',
    comment: '# Install high-performance native Rust CLI',
  },
  {
    id: 'run',
    label: 'Run Task',
    cmd: 'niki run "Add sliding-window rate limiting to /api/checkout"',
    comment: '# Auto-spawns Planner -> Coder -> Tester -> Reviewer',
  },
  {
    id: 'sandbox',
    label: 'Podman Sandbox',
    cmd: 'niki run --sandbox=podman --model=claude-3-7-sonnet "Refactor db pool"',
    comment: '# Zero host mutation — runs in ephemeral container',
  },
];

export default function EmbedSnippet() {
  const [activeTab, setActiveTab] = useState<string>('cargo');
  const [copied, setCopied] = useState(false);

  const currentTabObj = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTabObj.cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="relative max-w-xl w-full">
      <div className="border border-[var(--st)] bg-[var(--sf-raised)] rounded-md overflow-hidden shadow-xs">
        {/* Header tabs */}
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--sf-secondary)] border-b border-[var(--st)] text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent-orange)] mr-1" />
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--sf-raised)] text-[var(--accent-orange)] font-semibold shadow-xs'
                    : 'text-[var(--tx-tertiary)] hover:text-[var(--tx)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[var(--accent-green)] hidden sm:inline font-mono">
            rust v1.80+
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 font-mono text-xs text-[var(--tx)] bg-[var(--sf-raised)] flex items-center justify-between gap-3">
          <div className="overflow-x-auto select-all leading-relaxed">
            <div className="text-[11px] text-[var(--tx-tertiary)] select-none">
              {currentTabObj.comment}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[var(--accent-orange)] font-bold select-none">$</span>
              <span className="text-[var(--tx)] whitespace-nowrap font-medium">{currentTabObj.cmd}</span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 px-3 py-1.5 text-xs font-mono rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-[var(--sf)] text-[var(--tx-secondary)] hover:text-[var(--tx)] border-[var(--st)] hover:border-[var(--tx-secondary)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
