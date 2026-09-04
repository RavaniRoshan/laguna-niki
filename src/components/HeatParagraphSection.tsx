import { useEffect, useRef, useState } from 'react';

const HEAT_PARAGRAPH_COPY =
  'cmmnts is an open-source comment section and comments library that runs on any site — React, Next.js, Vue, Angular, or whatever you already build with — in about two lines of HTML. Create a site in the admin console, copy the embed snippet for a page, and paste it in. Sign-in, theme, moderation and the rest are settings you change afterwards. The free plan is enough to start on, and since it is open source you can host the whole thing yourself instead.';

const WORDS = HEAT_PARAGRAPH_COPY.split(' ');

// 7 numbered feature points (verbatim §5.4)
const SEVEN_POINTS = [
  {
    num: '01',
    title: 'Drops into anything',
    body: 'Two lines of markup on a React, Next.js, Vue or Angular page — or anything else that renders HTML. No build step, no framework to match.',
    bitmap: [
      1, 1, 1, 1,
      1, 0, 0, 1,
      1, 0, 0, 1,
      1, 1, 1, 1,
    ],
  },
  {
    num: '02',
    title: 'Moderate, or don’t',
    body: 'Hold comments for approval before they go public, or switch that off and let people post straight away. Spam gets flagged either way.',
    bitmap: [
      1, 0, 0, 1,
      0, 1, 1, 0,
      0, 1, 1, 0,
      1, 0, 0, 1,
    ],
  },
  {
    num: '03',
    title: 'Threaded replies',
    body: 'A reply attaches to the comment it answers, not to the page — so a long thread still reads like a conversation.',
    bitmap: [
      1, 1, 0, 0,
      1, 0, 1, 0,
      1, 0, 0, 1,
      1, 1, 1, 1,
    ],
  },
  {
    num: '04',
    title: 'Sign in, or don’t',
    body: 'Google, Microsoft or GitHub, whichever your readers already use. Anonymous comments stay an option too.',
    bitmap: [
      0, 1, 1, 0,
      1, 0, 0, 1,
      1, 1, 1, 1,
      1, 0, 0, 1,
    ],
  },
  {
    num: '05',
    title: 'A composer worth typing in',
    body: 'Bold, italic, strikethrough and code, written as plain markdown — no toolbar to hunt through. Plus @mentions, emoji and Giphy search.',
    bitmap: [
      1, 1, 1, 0,
      1, 0, 0, 1,
      1, 1, 1, 0,
      1, 0, 0, 0,
    ],
  },
  {
    num: '06',
    title: 'One site, every page',
    body: 'Add a site once, then give each page its own comment section. blog-post-1, blog-post-2 and the rest all live under it, kept apart.',
    bitmap: [
      1, 1, 1, 1,
      0, 1, 1, 0,
      0, 1, 1, 0,
      1, 1, 1, 1,
    ],
  },
  {
    num: '07',
    title: 'You stay in control',
    body: 'Hide the comment section, switch off the composer, or block one person — from the admin console, whenever you need to.',
    bitmap: [
      0, 1, 1, 0,
      1, 1, 1, 1,
      1, 1, 1, 1,
      0, 1, 1, 0,
    ],
  },
];

function interpolate(x: number, inRange: number[], outRange: number[]): number {
  if (x <= inRange[0]) return outRange[0];
  if (x >= inRange[inRange.length - 1]) return outRange[outRange.length - 1];
  for (let i = 0; i < inRange.length - 1; i++) {
    if (x >= inRange[i] && x <= inRange[i + 1]) {
      const span = inRange[i + 1] - inRange[i];
      if (span === 0) return outRange[i];
      const t = (x - inRange[i]) / span;
      return outRange[i] + t * (outRange[i + 1] - outRange[i]);
    }
  }
  return outRange[outRange.length - 1];
}

export default function HeatParagraphSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [strikeProgress, setStrikeProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!paragraphRef.current || !sectionRef.current) return;

      // Calculate progress of heat paragraph across viewport
      const rect = paragraphRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || 800;

      // Start heating when top of paragraph enters 80% from top, finishes when leaves 20%
      const startY = windowH * 0.85;
      const endY = windowH * 0.15;
      const currentY = rect.top;

      let p = (startY - currentY) / (startY - endY);
      p = Math.max(0, Math.min(1, p));
      setScrollProgress(p);

      // Calculate strikethrough progress for "showing off"
      const secRect = sectionRef.current.getBoundingClientRect();
      let s = (windowH * 0.8 - secRect.top) / (windowH * 0.4);
      s = Math.max(0, Math.min(1, s));
      setStrikeProgress(s);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Constants verbatim from §5.4:
  // qg = 0.08, Wj = 0.74, Yg = 5, c = Wj - qg
  // h(p) = qg + p / wordCount * c
  // baseOpacity = interpolate(i, [0, h(index-0.5), h(index+1.2), 1], [.24, .24, 1, 1])
  // heatOpacity = interpolate(i, [0, h(index), h(index+0.6), h(index+Yg-1), h(index+Yg), 1], [0,0,1,1,0,0])
  const wordCount = WORDS.length;
  const qg = 0.08;
  const Wj = 0.74;
  const Yg = 5;
  const c = Wj - qg;
  const h = (p: number) => qg + (p / wordCount) * c;

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-16 md:py-24 border-t border-dotted border-[var(--st)] bg-[var(--sf)]"
    >
      <div className="newspaper-column px-4 sm:px-6 lg:px-8">
        {/* Section 5.3: H2 with strikethrough animation */}
        <div className="mb-12">
          <div className="text-xs font-mono tracking-wider text-[var(--accent-orange)] uppercase font-semibold mb-2">
            Why cmmnts
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[var(--tx)] leading-tight">
            <span>Enough </span>
            <span className="relative inline-block text-[var(--tx-secondary)]">
              <span>showing off</span>
              {/* Animated orange strikethrough bar */}
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-[var(--accent-orange)] origin-left transition-transform duration-75"
                style={{
                  width: '100%',
                  transform: `scaleX(${strikeProgress})`,
                }}
              />
            </span>
            <span>. Let’s get to the point.</span>
          </h2>
        </div>

        {/* Section 5.4: What is cmmnts? (scroll-heat body) */}
        <div
          ref={paragraphRef}
          className="mb-16 p-6 sm:p-8 border border-dotted border-[var(--st)] bg-[var(--sf-raised)] relative"
        >
          <div className="joint-corner joint-tl" />
          <div className="joint-corner joint-tr" />
          <div className="joint-corner joint-bl" />
          <div className="joint-corner joint-br" />

          <div className="text-xs font-mono text-[var(--tx-tertiary)] uppercase tracking-wider mb-4 pb-2 border-b border-dotted border-[var(--st-secondary)]">
            What is cmmnts?
          </div>

          <div className="text-lg sm:text-xl lg:text-2xl font-editorial leading-[1.6] select-none">
            {WORDS.map((word, idx) => {
              const baseOpacity = interpolate(
                scrollProgress,
                [0, h(idx - 0.5), h(idx + 1.2), 1],
                [0.24, 0.24, 1, 1]
              );

              const heatOpacity = interpolate(
                scrollProgress,
                [0, h(idx), h(idx + 0.6), h(idx + Yg - 1), h(idx + Yg), 1],
                [0, 0, 1, 1, 0, 0]
              );

              return (
                <span key={idx} className="heat-word-wrapper">
                  <span
                    className="heat-word-base"
                    style={{ opacity: baseOpacity }}
                  >
                    {word}
                  </span>
                  <span
                    className="heat-word-overlay"
                    style={{ opacity: heatOpacity }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* 7 Numbered Feature Points (01–07) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {SEVEN_POINTS.map((point) => (
            <div
              key={point.num}
              className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-5 relative flex flex-col justify-between"
            >
              {/* Hatch-corner joints */}
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />

              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-dotted border-[var(--st-secondary)]">
                  <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                    {point.num}
                  </span>

                  {/* 4x4 pixel icon from bitmap Lh */}
                  <div className="grid grid-cols-4 gap-[2px] w-4 h-4">
                    {point.bitmap.map((cell, cIdx) => (
                      <div
                        key={cIdx}
                        className={`w-full h-full ${
                          cell ? 'bg-[var(--accent-orange)]' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-sans font-bold text-base text-[var(--tx)] mb-2">
                  {point.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--tx-secondary)] leading-relaxed">
                  {point.body}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-dotted border-[var(--st-secondary)] flex justify-end">
                <span className="text-[10px] font-mono text-[var(--tx-tertiary)]">
                  cmmnts · feature
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
