import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NoiseButton from '../components/NoiseButton';

const NIKI_CONFIG_TOML = `# niki.toml - Configuration for Niki Hermetic Multi-Agent System
# Place this in your repository root or ~/.config/niki/config.toml

[sandbox]
# Supported runtimes: "podman" (recommended rootless), "docker", or "worktree"
runtime = "podman"
# Network isolation during Coder and Tester phase
network = "none"
max_memory = "4GB"
tmpfs_mounts = ["/tmp", "/build"]

[models]
# BYOK: Specify any supported provider or local endpoint
planner = "anthropic/claude-3-7-sonnet"
coder = "anthropic/claude-3-7-sonnet"
tester = "google/gemini-2.0-flash"
reviewer = "openai/o3-mini"

[agents.tester]
# Auto-detects test frameworks: cargo test, npm test, pytest, go test
auto_detect = true
max_retry_loops = 3
fail_fast = true

[agents.reviewer]
strict_mode = true
max_diff_lines = 1200
prohibit_unsafe = true

[git]
auto_branch = true
branch_prefix = "niki/"
require_passing_tests = true
export_audit_json = true`;

export default function OpenSourcePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(NIKI_CONFIG_TOML).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)] flex flex-col">
      <Header />

      <main className="flex-1 pt-[56px]">
        <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb & Hero */}
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
              Architecture & Source Code · RavaniRoshan/niki
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[var(--tx)] mb-4">
              Open Source Hermetic Coding
            </h1>
            <p className="font-sans text-base sm:text-lg text-[var(--tx-secondary)] leading-relaxed">
              Niki was created by <strong>Ravani Roshan</strong> to solve the core danger of generative AI coding assistants: unchecked host file mutations, broken git trees, and rogue command execution.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />
              <div className="font-mono text-xs font-bold text-[var(--accent-orange)] mb-2">01</div>
              <h3 className="font-sans font-bold text-lg text-[var(--tx)] mb-2">
                100% Hermetic Isolation
              </h3>
              <p className="text-xs sm:text-sm text-[var(--tx-secondary)] leading-relaxed">
                Your host working tree is mounted strictly read-only. Sandboxed agents generate unified diffs inside temporary OCI containers, preventing dirty state or stolen credentials.
              </p>
            </div>

            <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />
              <div className="font-mono text-xs font-bold text-[var(--accent-orange)] mb-2">02</div>
              <h3 className="font-sans font-bold text-lg text-[var(--tx)] mb-2">
                Specialized 4-Agent Pipeline
              </h3>
              <p className="text-xs sm:text-sm text-[var(--tx-secondary)] leading-relaxed">
                Rather than relying on a single chat window, Niki assigns discrete responsibilities: Planner maps AST, Coder writes unified diffs, Tester executes test suites, and Reviewer audits.
              </p>
            </div>

            <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />
              <div className="font-mono text-xs font-bold text-[var(--accent-orange)] mb-2">03</div>
              <h3 className="font-sans font-bold text-lg text-[var(--tx)] mb-2">
                Blazing Native Rust
              </h3>
              <p className="text-xs sm:text-sm text-[var(--tx-secondary)] leading-relaxed">
                Engineered from the ground up in Rust. Instantaneous startup, rock-solid sub-process orchestration, zero Node/Python runtime overhead, and low memory consumption.
              </p>
            </div>
          </div>

          {/* Config spec codeblock */}
          <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 mb-16 relative">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-dotted border-[var(--st-secondary)] gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--accent-orange)] block">
                  DECLARATIVE CONFIGURATION
                </span>
                <span className="font-sans text-sm text-[var(--tx)]">
                  Example <code className="text-[var(--accent-orange)]">niki.toml</code> specification
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 font-mono text-xs border border-dotted border-[var(--st-secondary)] bg-[var(--sf)] hover:bg-[var(--hover)] text-[var(--tx)] cursor-pointer"
              >
                {copied ? '✔ Copied to clipboard' : 'Copy niki.toml'}
              </button>
            </div>

            <pre className="p-4 bg-[var(--paper)] border border-dotted border-[var(--st-secondary)] font-mono text-xs text-[var(--tx)] overflow-x-auto leading-relaxed">
              <code>{NIKI_CONFIG_TOML}</code>
            </pre>
          </div>

          {/* Callout to GitHub */}
          <div className="border border-dotted border-[var(--accent-orange)]/60 bg-[var(--accent-orange)]/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[var(--tx)] mb-2">
                Contribute & Star Niki on GitHub
              </h2>
              <p className="font-sans text-sm text-[var(--tx-secondary)] max-w-xl">
                Explore the open source Rust codebase, submit feature requests, or help build runners for new container backends.
              </p>
            </div>

            <NoiseButton
              href="https://github.com/RavaniRoshan/niki"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Open GitHub Repo ↗
            </NoiseButton>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
