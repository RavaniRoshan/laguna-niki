import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenLeaveNote?: () => void;
}

export default function Footer({ onOpenLeaveNote }: FooterProps) {
  return (
    <footer className="border-t border-dotted border-[var(--st)] bg-[var(--sf)] py-12">
      <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-dotted border-[var(--st-secondary)]">
          {/* Brand col */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <Link
                to="/"
                className="font-pixel text-2xl font-semibold tracking-[0.04em] text-[var(--tx)] no-underline select-none"
              >
                niki
              </Link>
              <span className="text-[11px] font-mono text-[var(--tx-tertiary)]">
                v0.4.0 · Rust CLI
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--tx-secondary)]">
              <span>Created by</span>
              <a
                href="https://github.com/RavaniRoshan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-orange)] hover:underline font-semibold"
              >
                Ravani Roshan
              </a>
              <span>·</span>
              <button
                type="button"
                onClick={onOpenLeaveNote}
                className="text-[var(--tx-tertiary)] hover:text-[var(--tx)] hover:underline cursor-pointer bg-transparent border-0 p-0 font-mono"
              >
                Leave feedback note
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[var(--tx-secondary)]">
            <Link to="/" className="hover:text-[var(--tx)] no-underline">
              Overview
            </Link>
            <a href="/#features" className="hover:text-[var(--tx)] no-underline">
              4-Agent Engine
            </a>
            <a href="/#features-deep-dive" className="hover:text-[var(--tx)] no-underline">
              Containment
            </a>
            <a href="/#try-it-out" className="hover:text-[var(--tx)] no-underline">
              Workbench
            </a>
            <a href="/#pricing" className="hover:text-[var(--tx)] no-underline">
              Deployment
            </a>
            <a href="/#faq" className="hover:text-[var(--tx)] no-underline">
              FAQ
            </a>
            <Link to="/opensource" className="hover:text-[var(--tx)] no-underline">
              Architecture Docs
            </Link>
            <Link to="/lab" className="hover:text-[var(--accent-orange)] no-underline font-semibold">
              Lab
            </Link>
            <a
              href="https://github.com/RavaniRoshan/niki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-orange)] hover:underline no-underline font-bold"
            >
              GitHub Repo ↗
            </a>
          </div>
        </div>

        {/* Bottom copyright & metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[var(--tx-tertiary)] gap-4">
          <div>
            © {new Date().getFullYear()} Niki by Ravani Roshan. Released under Open Source License.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400">● 0 Host Mutations</span>
            <span>·</span>
            <span>Podman / Docker OCI</span>
            <span>·</span>
            <span>Native Rust Binary</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
