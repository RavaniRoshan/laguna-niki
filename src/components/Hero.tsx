import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import TypewriterPitch from './TypewriterPitch';
import EmbedSnippet from './EmbedSnippet';
import AgentSandboxVisualizer from './AgentSandboxVisualizer';
import NoiseButton from './NoiseButton';

export default function Hero() {
  return (
    <section className="hero">
      <div className="stage">
        <div className="inner">
          {/* LEFT 45% (md): Wordmark, Tagline, Typewriter H1, Sub, Embed, CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[45%] p-6 md:p-10 flex flex-col justify-start border-b md:border-b-0 md:border-r border-[var(--st)] bg-[var(--sf)] md:sticky md:top-[56px] md:self-start"
          >
            <div>
              {/* Wordmark & Version Badge */}
              <div className="flex items-baseline gap-3">
                <div className="font-pixel text-[40px] md:text-[54px] font-semibold tracking-[0.02em] text-[var(--tx)] leading-none select-none">
                  niki
                </div>
                <span className="px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] border border-[var(--accent-orange)]/30 rounded-xs font-semibold">
                  v0.4 · hermetic CLI
                </span>
              </div>

              {/* Tagline */}
              <div className="mt-2.5 text-[11px] md:text-[12px] font-mono font-semibold uppercase tracking-[0.08em] text-[var(--tx-secondary)]">
                HERMETIC MULTI-AGENT CODING SYSTEM
              </div>

              {/* Typewriter H1 + Sub */}
              <div className="mt-5">
                <TypewriterPitch />
              </div>

              {/* Quickstart snippet */}
              <div className="mt-4 mb-6">
                <EmbedSnippet />
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <NoiseButton
                  href="https://github.com/RavaniRoshan/niki"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>View on GitHub</span>
                  </span>
                </NoiseButton>

                <Link
                  to="/opensource"
                  className="text-sm font-sans font-medium text-[var(--tx-secondary)] hover:text-[var(--tx)] transition-colors no-underline px-2 py-1"
                >
                  Architecture & Docs →
                </Link>
              </div>

              {/* Creator credit notice */}
              <div className="mt-6 pt-4 border-t border-[var(--st)] flex items-center gap-2 text-xs font-mono text-[var(--tx-tertiary)]">
                <span>Created by</span>
                <a
                  href="https://github.com/RavaniRoshan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--tx)] hover:text-[var(--accent-orange)] font-semibold transition-colors no-underline"
                >
                  Ravani Roshan
                </a>
                <span>·</span>
                <span>Open Source</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT 55% (md): Live Hermetic Agent Sandbox Simulation */}
          <div className="w-full md:w-[55%] flex flex-col p-4 md:p-8 bg-[var(--paper)]">
            <div className="w-full max-w-[560px] mx-auto">
              {/* Agent Visualizer */}
              <AgentSandboxVisualizer />

              {/* Technical Value Metrics Below Sandbox */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                <div className="p-3 border border-[var(--st)] bg-[var(--sf)] rounded-xs shadow-xs">
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">0 Writes</div>
                  <div className="text-[10px] text-[var(--tx-tertiary)] uppercase mt-0.5">Host Working Tree</div>
                </div>
                <div className="p-3 border border-[var(--st)] bg-[var(--sf)] rounded-xs shadow-xs">
                  <div className="text-base font-bold text-[var(--accent-orange)]">4 Agents</div>
                  <div className="text-[10px] text-[var(--tx-tertiary)] uppercase mt-0.5">Plan/Code/Test/Rev</div>
                </div>
                <div className="p-3 border border-[var(--st)] bg-[var(--sf)] rounded-xs shadow-xs">
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400">Podman/OCI</div>
                  <div className="text-[10px] text-[var(--tx-tertiary)] uppercase mt-0.5">Container Isolation</div>
                </div>
                <div className="p-3 border border-[var(--st)] bg-[var(--sf)] rounded-xs shadow-xs">
                  <div className="text-base font-bold text-[var(--tx)]">Rust 1.84</div>
                  <div className="text-[10px] text-[var(--tx-tertiary)] uppercase mt-0.5">Native Static Binary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
