import { useState } from 'react';

interface LabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LabModal({ isOpen, onClose }: LabModalProps) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [hatchScale, setHatchScale] = useState(4);

  if (!isOpen) return null;

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="cmmnts Lab"
    >
      <div
        className="w-full max-w-lg border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="joint-corner joint-tl" />
        <div className="joint-corner joint-tr" />
        <div className="joint-corner joint-bl" />
        <div className="joint-corner joint-br" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className={`p-1 text-[var(--accent-orange)] ${glitchActive ? 'animate-[glitchJolt_0.4s_infinite]' : ''}`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="2" x2="10" y2="7" />
                <line x1="16" y1="2" x2="14" y2="7" />
                <rect x="4" y="7" width="16" height="14" rx="2" />
                <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                <line x1="9" y1="17" x2="15" y2="17" strokeDasharray="1 1" />
              </svg>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[var(--accent-orange)] uppercase tracking-wider font-semibold">
                Interactive Experiments
              </span>
              <h3 className="font-sans font-bold text-lg text-[var(--tx)]">cmmnts Lab</h3>
            </div>
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
            Welcome to the cmmnts R&D playground. Here we prototype canvas physics, chromatic aberration shaders, bespoke paper hatch patterns, and experimental UI mechanics.
          </p>

          <div className="p-3.5 border border-dotted border-[var(--st)] bg-[var(--sf)] space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--tx)] font-semibold">Shader Chromatic Glitch</span>
              <button
                type="button"
                onClick={triggerGlitch}
                className="px-2 py-1 bg-[var(--accent-orange)] text-white text-[11px] font-mono cursor-pointer hover:opacity-90"
              >
                Trigger Glitch
              </button>
            </div>

            <div className="pt-2 border-t border-dotted border-[var(--st-secondary)] flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--tx)]">Hatch Pattern Density: {hatchScale}px</span>
              <input
                type="range"
                min="2"
                max="10"
                value={hatchScale}
                onChange={(e) => setHatchScale(Number(e.target.value))}
                className="w-28 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 border border-dotted border-[var(--st-secondary)] bg-[var(--paper)] text-center">
            <span className="font-pixel text-sm text-[var(--accent-orange)] block mb-1">
              Secret Mini-Quest
            </span>
            <span className="text-xs text-[var(--tx-secondary)] font-sans">
              Complete Level 20 &quot;Citadel&quot; in the hero platformer to unlock the legendary golden cursor badge!
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dotted border-[var(--st-secondary)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="outline-btn py-1 px-3 text-xs"
          >
            Back to homepage
          </button>
        </div>
      </div>
    </div>
  );
}
