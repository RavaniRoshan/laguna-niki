interface Pillar {
  number: string;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Zero Host Tree Mutation',
    description:
      'Your working tree, uncommitted edits, and local environment remain 100% untouched. Operations execute in ephemeral container sandboxes against read-only mounts.',
  },
  {
    number: '02',
    title: '4-Agent Separation of Concerns',
    description:
      'Eliminates the single-prompt hallucination loop. Responsibilities are strictly partitioned between Planner, Coder, Tester, and Reviewer.',
  },
  {
    number: '03',
    title: 'Automated Test Verification',
    description:
      'The Tester agent synthesizes reproduction tests and executes your real project test suite inside the container before code is signed off.',
  },
  {
    number: '04',
    title: 'Native Rust Engine & BYOK',
    description:
      'Engineered in Rust for instant CLI invocation. Supports Claude 3.7 Sonnet, OpenAI GPT-4o, Gemini 2.0, or local offline Ollama models.',
  },
];

export default function WhatIs() {
  return (
    <section
      id="containment"
      className="border-t border-[var(--st)] bg-[var(--sf)] py-16 sm:py-24"
    >
      <div className="section-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--accent-orange)]">
              Architecture & Safety
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl font-medium leading-tight text-[var(--tx)] m-0">
              Deterministic coding sandboxes, not uncontrolled shell access.
            </h2>

            <p className="font-sans text-base leading-relaxed text-[var(--tx-secondary)] m-0">
              Traditional AI coding assistants run unvetted scripts directly against your local workspace—risking deleted stashes, corrupted configs, or rogue execution.
            </p>

            <p className="font-sans text-base leading-relaxed text-[var(--tx-secondary)] m-0">
              <strong className="text-[var(--tx)] font-semibold">Niki</strong> isolates every file mutation and test run within an ephemeral Podman or Docker container. Once verified by automated tests and security audits, it outputs a clean, reviewable git branch ready for human review.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[var(--tx-tertiary)]">
              <span>Created by Ravani Roshan</span>
              <span>·</span>
              <a
                href="https://github.com/RavaniRoshan/niki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-orange)] hover:underline font-medium no-underline"
              >
                Inspect Source Code ↗
              </a>
            </div>
          </div>

          {/* Right Column: 4 Clean Architecture Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="p-5 rounded-md border border-[var(--st)] bg-[var(--sf-raised)] hover:border-[var(--tx-secondary)] transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--accent-orange)] mb-2">
                    {pillar.number}
                  </div>
                  <h3 className="text-base font-sans font-semibold text-[var(--tx)] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-sans text-[var(--tx-secondary)] leading-relaxed m-0">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
