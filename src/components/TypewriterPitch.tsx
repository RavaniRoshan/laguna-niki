import { useState, useEffect } from 'react';

export default function TypewriterPitch() {
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const [showC, setShowC] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [showSubline, setShowSubline] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShowA(true);
      setShowB(true);
      setShowC(true);
      setShowDot(true);
      setShowSubline(true);
      return;
    }

    const tA = setTimeout(() => setShowA(true), 100);
    const tB = setTimeout(() => setShowB(true), 180);
    const tC = setTimeout(() => {
      setShowC(true);
      setShowDot(true);
    }, 240);
    const tSub = setTimeout(() => setShowSubline(true), 320);

    return () => {
      clearTimeout(tA);
      clearTimeout(tB);
      clearTimeout(tC);
      clearTimeout(tSub);
    };
  }, []);

  return (
    <div className="select-none">
      {/* H1: Newsreader 18px / md 30px / 1.22 / 500 */}
      <h1
        className="font-editorial text-[20px] md:text-[30px] font-medium leading-[1.25] text-[var(--tx)] m-0 min-h-[3em] md:min-h-[2.5em]"
        style={{
          fontFamily: '"Newsreader", Georgia, "Times New Roman", serif',
          fontOpticalSizing: 'auto',
        }}
      >
        {/* Run A */}
        <span
          className="transition-opacity duration-200"
          style={{ opacity: showA ? 1 : 0 }}
        >
          Deploy isolated{' '}
        </span>

        {/* Run B: multi-agent coders */}
        <span
          className={`relative inline-block transition-opacity duration-200 ${
            showB ? 'markWord markWordOn' : 'opacity-0'
          }`}
          style={{ opacity: showB ? 1 : 0 }}
        >
          <span className="relative z-10">multi-agent coders</span>
          {showB && (
            <svg
              className="markIcon w-[14px] h-[14px] inline-block ml-[3px] align-middle -mt-[2px] text-[var(--accent-orange)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M15 9h6" />
              <path d="M15 15h6" />
            </svg>
          )}
        </span>

        {/* Run C */}
        <span
          className="transition-opacity duration-200"
          style={{ opacity: showC ? 1 : 0 }}
        >
          {' '}without risking your working tree
        </span>

        {/* Caret */}
        {!showC && (
          <span
            className="inline-block w-[2px] h-[1em] bg-[var(--accent-orange)] ml-[1px] align-baseline animate-pulse"
          />
        )}

        {/* End dot */}
        {showDot && <span className="pitchDot" />}
      </h1>

      {/* Subline */}
      <p
        className="font-sans text-[var(--tx-secondary)] text-[0.95rem] md:text-[1.05rem] leading-[1.65] max-w-[36rem] my-4 transition-all duration-[420ms] ease-out"
        style={{
          opacity: showSubline ? 1 : 0,
          transform: showSubline ? 'translateY(0)' : 'translateY(4px)',
        }}
      >
        A hermetic multi-agent coding system built in Rust. Dedicated agents independently <strong className="text-[var(--tx)] font-medium">plan</strong>, <strong className="text-[var(--tx)] font-medium">code</strong>, <strong className="text-[var(--tx)] font-medium">test</strong>, and <strong className="text-[var(--tx)] font-medium">review</strong> inside isolated Docker or Podman sandboxes—delivering a clean, verified git branch.
      </p>
    </div>
  );
}
