import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What does "hermetic" mean in Niki?',
    a: 'In systems engineering, "hermetic" means operations are strictly isolated, repeatable, and walled off from ambient host state. Niki mounts your host directory in read-only mode inside a rootless Podman or Docker container. All file modifications occur inside an ephemeral container layer, ensuring rogue scripts or broken edits never leak to your local working tree or unstaged git index.',
  },
  {
    q: 'How is Niki different from tools like Cursor, Claude Code, or Aider?',
    a: 'Traditional coding assistants typically run with full read-write access to your local machine, frequently modifying your active branch, clobbering stash lists, or executing untrusted terminal commands on your host. Niki separates tasks across four distinct agents (Planner, Coder, Tester, Reviewer) and enforces operating-system level container containment, outputting a clean, tested git branch (niki/<id>) with zero host pollution.',
  },
  {
    q: 'Which LLM models and providers can I use?',
    a: 'Niki uses a Bring-Your-Own-Key (BYOK) architecture. You can connect Anthropic (Claude 3.7 Sonnet, 3.5 Sonnet), OpenAI (GPT-4o, o3-mini), Google (Gemini 2.0 Flash / Pro), or local offline models via Ollama (e.g., DeepSeek R1, Llama 3). You can also route different models per agent (e.g., Claude 3.7 for Planning and Review, Gemini 2.0 Flash for Coding).',
  },
  {
    q: 'Do I need Podman or Docker installed?',
    a: 'Yes. For complete hermetic isolation, Niki requires an OCI container runtime—Podman (rootless, highly recommended on Linux and macOS) or Docker. Niki also provides an isolated Git Worktree containment mode for environments where container runtimes are unavailable.',
  },
  {
    q: 'What happens if the Tester agent finds failing tests?',
    a: 'When the Tester agent executes your test suite (e.g., cargo test, npm test, pytest) inside the sandbox and encounters failures, the compiler diagnostics and stack traces are routed back to the Coder agent. The Coder iteratively refines the unified diff until all tests pass or bounded limits are reached, before the Reviewer does a final audit.',
  },
  {
    q: 'Does Niki work on large monorepos and enterprise codebases?',
    a: 'Yes. The Planner agent parses the repository topological graph and AST symbols rather than dumping the entire file tree into LLM context. Only relevant source files and interface contracts are surfaced to the Coder agent, preserving context windows and token budgets.',
  },
  {
    q: 'How do I review and merge the generated code?',
    a: 'Once Niki finishes and the Reviewer agent signs off, Niki commits the verified unified diff into a new local git branch: niki/<task_id>. You can inspect it with standard git tools (git diff main..niki/<task_id>), run your own checks, and merge it with a standard git merge or push it to a pull request.',
  },
  {
    q: 'Is Niki open source?',
    a: 'Yes, 100% open source. The project is created by Ravani Roshan and hosted at https://github.com/RavaniRoshan/niki. You can inspect the native Rust CLI orchestrator, submit issues, and participate in community discussions on GitHub.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 border-t border-dotted border-[var(--st)] bg-[var(--sf)]">
      <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
            Frequently Asked Questions
          </div>
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--tx)] mb-3"
          >
            Technical & Architecture FAQ
          </motion.h2>
          <p className="font-sans text-sm sm:text-base text-[var(--tx-secondary)] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Niki's container isolation, multi-agent protocol, and model routing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-sans font-medium text-[var(--tx)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span className="font-mono text-sm text-[var(--accent-orange)] shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-dotted border-[var(--st-secondary)] bg-[var(--sf)]"
                    >
                      <div className="px-5 py-4 text-xs sm:text-sm font-sans text-[var(--tx-secondary)] leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
