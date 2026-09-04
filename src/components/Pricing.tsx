import { motion } from 'motion/react';
import NoiseButton from './NoiseButton';

const PLANS = [
  {
    num: '01',
    name: 'Open Source CLI',
    price: '$0',
    period: 'forever',
    badge: null,
    popular: false,
    features: [
      '100% Free & Open Source',
      'Local Podman & Docker sandboxes',
      'BYOK: Claude 3.7, GPT-4o, Gemini, Ollama',
      'Zero host tree mutations',
      'Automated test generation & validation',
      'Clean niki/<id> git branches',
      'JSON execution & audit artifacts',
    ],
    ctaText: 'Install CLI free',
    ctaHref: 'https://github.com/RavaniRoshan/niki#installation',
    isPrimary: false,
    isButton: false,
  },
  {
    num: '02',
    name: 'Team Daemon',
    price: '$24',
    period: '/dev /mo',
    badge: 'Popular for Teams',
    popular: true,
    features: [
      'Everything in Open Source',
      'Shared remote sandbox daemon',
      'Automated GitHub PR bot integration',
      'Cross-developer AST cache',
      'Slack & Discord run notifications',
      'Team security review policies',
      'Persistent test container pools',
    ],
    ctaText: 'View on GitHub',
    ctaHref: 'https://github.com/RavaniRoshan/niki',
    isPrimary: true,
    isButton: false,
  },
  {
    num: '03',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    badge: null,
    popular: false,
    features: [
      'Air-gapped VPC sandbox deployment',
      'Private internal LLM gateway routing',
      'Strict Zero-Data-Retention guarantees',
      'Custom AST security linting gates',
      'SOC2 / ISO compliance audit export',
      'Custom OCI container rootfs images',
      'Direct engineering support',
    ],
    ctaText: 'Contact Creator',
    ctaHref: 'https://github.com/RavaniRoshan/niki/issues',
    isPrimary: false,
    isButton: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 border-t border-dotted border-[var(--st)] bg-[var(--sf)]">
      <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
            Licensing & Deployment
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--tx)] mb-3">
            Open Source by Default. Scale When Ready.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[var(--tx-secondary)] max-w-xl mx-auto leading-relaxed">
            Run Niki completely free on your laptop with Podman or Docker. Scale to team daemons and VPC air-gapped clusters when you need shared runners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`border border-dotted ${
                plan.popular
                  ? 'border-[var(--accent-orange)] bg-[var(--sf-raised)] shadow-sm'
                  : 'border-[var(--st)] bg-[var(--sf-raised)]'
              } p-6 sm:p-8 flex flex-col justify-between relative`}
            >
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />

              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-dotted border-[var(--st-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                      {plan.num}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--tx)]">
                      {plan.name}
                    </span>
                  </div>
                  {plan.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-[var(--accent-orange)]/15 text-[var(--accent-orange)] border border-dotted border-[var(--accent-orange)]/40">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price block */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-editorial text-4xl sm:text-5xl font-medium text-[var(--tx)]">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="font-mono text-xs text-[var(--tx-tertiary)]">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--tx-secondary)] mt-1">
                    BYOK · Bring Your Own API Keys
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-sans text-[var(--tx)]">
                      <span className="text-[var(--accent-orange)] font-bold text-xs mt-0.5">✔</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-dotted border-[var(--st-secondary)]">
                <NoiseButton
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  className="w-full justify-center"
                >
                  {plan.ctaText}
                </NoiseButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
