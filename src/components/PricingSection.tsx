interface PricingSectionProps {
  onOpenLeaveNote?: () => void;
}

export default function PricingSection({ onOpenLeaveNote }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 border-t border-dotted border-[var(--st)] bg-[var(--sf)]"
    >
      <div className="newspaper-column px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono tracking-wider text-[var(--accent-orange)] uppercase font-semibold mb-2">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[var(--tx)] mb-3">
            Predictable, transparent plans
          </h2>
          <p className="text-sm sm:text-base text-[var(--tx-secondary)]">
            Start on the free plan. Move up when your comments outgrow it.
          </p>
        </div>

        {/* 3-up Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* 01: Free Plan */}
          <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative flex flex-col justify-between">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx-secondary)]">
                <span>01</span>
                <span>Community</span>
              </div>

              <h3 className="text-xl font-sans font-bold text-[var(--tx)]">Free</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-sans font-bold text-[var(--tx)]">Free</span>
                <span className="text-xs text-[var(--tx-secondary)] ml-1.5 font-mono">forever</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[var(--tx-secondary)]">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>1 organization</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>1 site</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>5 pages per site</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>500 comments per page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>1 moderator</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-dotted border-[var(--st-secondary)]">
              <a
                href="https://console.cmmnts.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn w-full text-center"
              >
                Start free
              </a>
            </div>
          </div>

          {/* 02: Pro Plan (Featured) */}
          <div className="border-2 border-dotted border-[var(--accent-orange)] bg-[var(--sf-raised)] p-6 relative flex flex-col justify-between shadow-sm">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            {/* Most popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[var(--accent-orange)] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-xs">
              Most popular
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--accent-orange)] font-semibold">
                <span>02</span>
                <span>Professional</span>
              </div>

              <h3 className="text-xl font-sans font-bold text-[var(--tx)]">Pro</h3>
              <div className="mt-2 mb-6 flex items-baseline">
                <span className="text-3xl font-sans font-bold text-[var(--tx)]">$19</span>
                <span className="text-xs text-[var(--tx-secondary)] ml-1 font-mono">/ mo</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[var(--tx)]">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-orange)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span className="font-medium">5 organizations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-orange)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span className="font-medium">10 sites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-orange)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span className="font-medium">10 pages per site</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-orange)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span className="font-medium">20,000 comments per page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-orange)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span className="font-medium">10 moderators</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-[var(--tx-secondary)] pt-1 border-t border-dotted border-[var(--st-secondary)]">
                  <span className="text-[var(--accent-orange)]">★</span>
                  <span>Remove branding · Custom domain · Priority support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-dotted border-[var(--st-secondary)]">
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-4 bg-[var(--sf-secondary)] border border-dotted border-[var(--st)] text-xs font-mono text-[var(--tx-secondary)] cursor-not-allowed text-center uppercase tracking-wider"
              >
                Coming soon
              </button>
            </div>
          </div>

          {/* 03: Enterprise Plan */}
          <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative flex flex-col justify-between">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx-secondary)]">
                <span>03</span>
                <span>Scale</span>
              </div>

              <h3 className="text-xl font-sans font-bold text-[var(--tx)]">Enterprise</h3>
              <div className="mt-2 mb-6">
                <span className="text-3xl font-sans font-bold text-[var(--tx)]">Custom</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[var(--tx-secondary)]">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>Unlimited organizations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>Unlimited sites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>Unlimited pages</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>Unlimited comments</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[var(--accent-green)] shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 10.5l3.6 3.6L15.5 6.7" />
                  </svg>
                  <span>Unlimited moderators</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-[var(--tx-secondary)] pt-1 border-t border-dotted border-[var(--st-secondary)]">
                  <span className="text-[var(--accent-green)]">★</span>
                  <span>Dedicated SLA, custom SSO & on-prem deployment</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-dotted border-[var(--st-secondary)]">
              <button
                type="button"
                onClick={onOpenLeaveNote}
                className="outline-btn w-full text-center cursor-pointer"
              >
                Talk to us
              </button>
            </div>
          </div>
        </div>

        {/* Footnote statement */}
        <div className="mt-8 text-center text-xs text-[var(--tx-tertiary)] max-w-xl mx-auto font-sans">
          Every plan includes the whole widget — moderation, sign-in, themes, all of it. The plan only changes how much you can use.
        </div>
      </div>
    </section>
  );
}
