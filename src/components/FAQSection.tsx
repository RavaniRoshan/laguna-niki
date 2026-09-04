import { useState } from 'react';
import { FaqItem } from '../types';

const FAQS: FaqItem[] = [
  {
    question: 'What is cmmnts?',
    answer:
      'cmmnts is an open-source comment section and embeddable comments library. It allows developers to add a full-featured, lightweight comment section to any website or application with just a script tag.',
  },
  {
    question: 'Is the free plan really free?',
    answer:
      'Yes, and it stays free — 1 site, 5 pages, 500 comments per page, 1 moderator. Move to Pro at $19/mo when you outgrow that, or talk to us about Enterprise.',
  },
  {
    question: 'Do I have to self-host it?',
    answer:
      'No. cmmnts is hosted, so pasting the snippet is the whole setup. If you would rather run it yourself, it ships as a single Docker image with the admin console, widget and API inside — point it at any Postgres you run.',
  },
  {
    question: 'Will it slow my page down?',
    answer:
      'No. The widget is 38KB with no framework behind it, and renders as one custom element inside a Shadow DOM. There is no iframe, and its styles cannot leak in or out of your page.',
  },
  {
    question: 'Can people comment without an account?',
    answer:
      'Yes, and you decide that per site. You can also require sign-in with Google, GitHub or Microsoft Entra ID, over a cookie-free PKCE flow written for embedding.',
  },
  {
    question: 'How do you deal with spam?',
    answer:
      'Every site gets a moderation queue — pending, approved, rejected — with hide, unhide and soft delete. Readers can flag comments too, and anything flagged enough times is hidden automatically.',
  },
  {
    question: 'Is security different on the free plan?',
    answer:
      'No. HTML sanitising, origin-locked requests, rate limiting by both IP and fingerprint, and magic-byte checks on uploads run on every plan, free included.',
  },
];

export default function FAQSection() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="py-16 md:py-24 border-t border-dotted border-[var(--st)] bg-[var(--sf)]"
    >
      <div className="newspaper-column px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <div className="mb-10 text-center">
            <div className="text-xs font-mono tracking-wider text-[var(--accent-orange)] uppercase font-semibold mb-2">
              Questions & Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[var(--tx)]">
              Frequently asked questions
            </h2>
          </div>

          {/* Accordion List */}
          <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] divide-y divide-dotted divide-[var(--st-secondary)] relative">
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans font-semibold text-sm sm:text-base text-[var(--tx)] group-hover:text-[var(--accent-orange)] transition-colors">
                      {faq.question}
                    </span>

                    <span
                      className={`text-[var(--tx-secondary)] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[var(--accent-orange)]' : ''
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {/* Accordion body with smooth height transition */}
                  <div
                    className={`grid transition-all duration-250 ease-in-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-dotted border-[var(--st-secondary)]'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-[var(--tx-secondary)] font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
