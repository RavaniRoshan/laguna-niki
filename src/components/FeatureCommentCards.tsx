import { useState } from 'react';

const FEATURE_COMMENTS = [
  {
    num: '01',
    author: 'cmmnts',
    time: '4 days ago',
    likes: 20,
    body: 'Sign in with Google, GitHub or Microsoft — whichever your readers already use.',
  },
  {
    num: '02',
    author: 'cmmnts',
    time: '4 days ago',
    likes: 20,
    body: 'GIFs, images, code blocks and markdown, right in the composer.',
  },
  {
    num: '03',
    author: 'cmmnts',
    time: '4 days ago',
    likes: 20,
    body: 'Or let people comment anonymously — no account needed.',
  },
  {
    num: '04',
    author: 'cmmnts',
    time: '4 days ago',
    likes: 20,
    body: 'Anyone can edit or delete their own comments at any time.',
  },
  {
    num: '05',
    author: 'cmmnts',
    time: '4 days ago',
    likes: 20,
    body: 'Report a comment in one tap.',
  },
];

export default function FeatureCommentCards() {
  const [visibilityState, setVisibilityState] = useState<'visible' | 'hidden'>('visible');
  const [enabledState, setEnabledState] = useState<'enabled' | 'disabled'>('enabled');

  // 28x24 pixel-comment diagram matrix (Wa=28, vb=24)
  // Let's render a crisp interactive SVG/canvas schematic representing the comment widget layout
  const cols = 28;
  const rows = 24;

  return (
    <section className="py-14 border-t border-dotted border-[var(--st)] bg-[var(--sf)]">
      <div className="newspaper-column px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-dotted border-[var(--st-secondary)] gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-1">
              Core Capabilities · 01–05
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--tx)]">
              Engineered for conversation, not clutter
            </h2>
          </div>

          {/* Interactive Toggle Demo: Comment section is visible | hidden | enabled | disabled */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[var(--tx-secondary)]">Comment section is</span>

              {/* Visible / Hidden Toggle */}
              <div className="inline-flex border border-dotted border-[var(--st)] bg-[var(--sf-secondary)] p-0.5">
                <button
                  type="button"
                  onClick={() => setVisibilityState('visible')}
                  className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                    visibilityState === 'visible'
                      ? 'bg-[var(--tx)] text-[var(--tx-inverse)] font-medium'
                      : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                  }`}
                >
                  visible
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityState('hidden')}
                  className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                    visibilityState === 'hidden'
                      ? 'bg-[var(--tx)] text-[var(--tx-inverse)] font-medium'
                      : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                  }`}
                >
                  hidden
                </button>
              </div>

              {/* Enabled / Disabled Toggle */}
              <div className="inline-flex border border-dotted border-[var(--st)] bg-[var(--sf-secondary)] p-0.5">
                <button
                  type="button"
                  onClick={() => setEnabledState('enabled')}
                  className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                    enabledState === 'enabled'
                      ? 'bg-[var(--tx)] text-[var(--tx-inverse)] font-medium'
                      : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                  }`}
                >
                  enabled
                </button>
                <button
                  type="button"
                  onClick={() => setEnabledState('disabled')}
                  className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                    enabledState === 'disabled'
                      ? 'bg-[var(--tx)] text-[var(--tx-inverse)] font-medium'
                      : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                  }`}
                >
                  disabled
                </button>
              </div>
            </div>

            <span className="text-[11px] text-[var(--tx-tertiary)] italic">
              *Every one of these is a switch in the admin console.
            </span>
          </div>
        </div>

        {/* 2-Column Presentation: 5 Editorial Comment Cards + 28x24 Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 5 Fake Comment Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            {FEATURE_COMMENTS.map((item) => (
              <div
                key={item.num}
                className={`border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-4 relative transition-all duration-200 ${
                  visibilityState === 'hidden' ? 'opacity-25 grayscale' : ''
                }`}
              >
                {/* Numbered badge on top-left joint */}
                <div className="joint-corner joint-tl" />
                <div className="joint-corner joint-tr" />
                <div className="joint-corner joint-bl" />
                <div className="joint-corner joint-br" />

                <div className="flex items-center justify-between text-xs text-[var(--tx-secondary)] mb-2 pb-1.5 border-b border-dotted border-[var(--st-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[var(--accent-orange)]">
                      {item.num}
                    </span>
                    <span className="font-medium text-[var(--tx)]">{item.author}</span>
                    <span className="text-[var(--tx-tertiary)]">·</span>
                    <span className="text-[var(--tx-tertiary)]">{item.time}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3 h-3 text-[var(--accent-orange)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      <span>{item.likes}</span>
                    </span>
                    <span className="underline cursor-pointer hover:text-[var(--tx)]">Reply</span>
                  </div>
                </div>

                <p className="text-sm text-[var(--tx)] font-sans leading-relaxed">
                  {item.body}
                </p>

                {enabledState === 'disabled' && (
                  <div className="mt-2 text-[11px] text-[var(--accent-red)] font-mono">
                    [Posting disabled by site administrator]
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: 28x24 Cell Pixel-Comment Diagram */}
          <div className="lg:col-span-5 border border-dotted border-[var(--st)] bg-[var(--paper)] p-4 sm:p-5 relative">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            <div className="flex items-center justify-between pb-2 mb-3 border-b border-dotted border-[var(--st)] text-xs font-mono">
              <span className="font-bold text-[var(--tx)]">Widget Architecture</span>
              <span className="text-[var(--tx-secondary)]">28 × 24 Blueprint</span>
            </div>

            {/* Render 28x24 grid blueprint */}
            <div className="w-full aspect-[28/24] relative border border-dotted border-[var(--st-secondary)] bg-[var(--sf-secondary)] p-2 flex flex-col justify-between overflow-hidden">
              {/* Header bar representation */}
              <div className="h-6 border border-dotted border-[var(--st)] bg-[var(--sf-raised)] flex items-center justify-between px-2 text-[10px] font-mono">
                <span className="text-[var(--accent-orange)] font-bold">cmmnts-widget</span>
                <span className="text-[var(--tx-secondary)]">38 KB</span>
              </div>

              {/* Composer schematic */}
              <div className="h-10 border border-dotted border-[var(--st)] bg-[var(--sf)] p-1.5 flex flex-col justify-between">
                <div className="w-2/3 h-1.5 bg-[var(--st-secondary)]" />
                <div className="flex justify-between items-center">
                  <div className="w-12 h-2 bg-[var(--st-secondary)]" />
                  <div className="w-10 h-3 bg-[var(--tx)] text-[var(--tx-inverse)] text-[8px] font-mono flex items-center justify-center">
                    POST
                  </div>
                </div>
              </div>

              {/* Comment row schematics */}
              <div className="space-y-1.5">
                {[1, 2, 3].map((r) => (
                  <div key={r} className="p-1.5 border border-dotted border-[var(--st-secondary)] bg-[var(--sf-raised)] flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[var(--accent-orange)] shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2">
                        <div className="w-12 h-1.5 bg-[var(--tx)]" />
                        <div className="w-8 h-1.5 bg-[var(--st-secondary)]" />
                      </div>
                      <div className="w-full h-1 bg-[var(--st-secondary)]" />
                      <div className="w-3/4 h-1 bg-[var(--st-secondary)]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[var(--tx-tertiary)] pt-1 border-t border-dotted border-[var(--st-secondary)]">
                <span>Shadow DOM · Zero Iframe</span>
                <span>PKCE Auth</span>
              </div>
            </div>

            <div className="mt-4 text-xs font-sans text-[var(--tx-secondary)] leading-relaxed">
              <p>
                Renders into a clean Shadow DOM custom element with zero CSS leakage into your parent layout. Configurable directly via HTML attributes:
              </p>
              <div className="mt-2 p-2 bg-[var(--sf)] font-mono text-[11px] text-[var(--tx)] border border-dotted border-[var(--st-secondary)]">
                <code>&lt;cmmnts-widget site-key="..." page-id="..."&gt;</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
