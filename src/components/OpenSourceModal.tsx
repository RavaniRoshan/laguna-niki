interface OpenSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OpenSourceModal({ isOpen, onClose }: OpenSourceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="cmmnts open source"
    >
      <div
        className="w-full max-w-xl border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="joint-corner joint-tl" />
        <div className="joint-corner joint-tr" />
        <div className="joint-corner joint-bl" />
        <div className="joint-corner joint-br" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
          <div>
            <span className="font-mono text-[10px] text-[var(--accent-orange)] uppercase tracking-wider font-semibold">
              Open Source
            </span>
            <h3 className="font-sans font-bold text-lg sm:text-xl text-[var(--tx)]">
              cmmnts is 100% Free & Open Source
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[var(--tx-secondary)] hover:text-[var(--tx)] p-1 cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[var(--tx-secondary)] leading-relaxed">
          <p>
            No hidden enterprise paywalls for the core engine. You can self-host the complete cmmnts suite (widget, API, and admin console) on your own infrastructure with a single Docker command.
          </p>

          <div className="border border-dotted border-[var(--st)] bg-[var(--sf)] p-3.5 space-y-2 font-mono text-xs">
            <div className="text-[var(--tx)] font-semibold flex items-center justify-between">
              <span>Docker Self-Hosting</span>
              <span className="text-[var(--accent-orange)]">PostgreSQL</span>
            </div>
            <pre className="text-[11px] sm:text-[12px] text-[var(--tx)] overflow-x-auto p-1 select-all bg-[var(--sf-secondary)]">
              <code>docker run -d -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@host:5432/cmmnts \
  cmmnts/cmmnts:latest</code>
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 border border-dotted border-[var(--st-secondary)] bg-[var(--sf)]">
              <span className="font-mono font-bold text-[var(--tx)] block text-xs mb-1">
                Zero Framework Dependency
              </span>
              <span className="text-[11px] text-[var(--tx-tertiary)]">
                Compiled directly to Web Components (Shadow DOM). 38 KB total transfer size.
              </span>
            </div>

            <div className="p-3 border border-dotted border-[var(--st-secondary)] bg-[var(--sf)]">
              <span className="font-mono font-bold text-[var(--tx)] block text-xs mb-1">
                MIT Licensed
              </span>
              <span className="text-[11px] text-[var(--tx-tertiary)]">
                Commercial and personal projects welcome. Freedom to modify and distribute.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dotted border-[var(--st-secondary)] flex items-center justify-between">
          <a
            href="https://github.com/cmmnts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[var(--accent-orange)] hover:underline flex items-center gap-1.5"
          >
            <span>★ Star on GitHub</span>
            <span>→</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="outline-btn py-1 px-3 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
