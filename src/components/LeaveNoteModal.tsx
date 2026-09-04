import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LeaveNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveNoteModal({ isOpen, onClose }: LeaveNoteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
        onClose();
      }, 1600);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative shadow-2xl"
          >
            <div className="joint-corner joint-tl" />
            <div className="joint-corner joint-tr" />
            <div className="joint-corner joint-bl" />
            <div className="joint-corner joint-br" />

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--tx)]">
                <span className="text-[var(--accent-orange)]">✦</span>
                <span>Send Note to Ravani Roshan & Niki Contributors</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-[var(--tx-secondary)] hover:text-[var(--tx)] cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-2">
                <div className="text-2xl">✨</div>
                <div className="font-editorial text-xl font-medium text-[var(--tx)]">
                  Thank you for your feedback!
                </div>
                <div className="font-sans text-xs text-[var(--tx-secondary)]">
                  Your note was dispatched to the project maintainers.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs font-sans text-[var(--tx-secondary)] leading-relaxed">
                  Have a suggestion, sandbox runtime request, or question? You can also open an issue on{' '}
                  <a
                    href="https://github.com/RavaniRoshan/niki/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-orange)] hover:underline font-semibold"
                  >
                    GitHub Issues
                  </a>
                  .
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-[var(--tx-secondary)] uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Linus Torvalds"
                    className="w-full bg-[var(--sf)] border border-dotted border-[var(--st)] px-3 py-2 text-xs text-[var(--tx)] outline-none focus:border-[var(--accent-orange)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-[var(--tx-secondary)] uppercase">
                    Email (Optional, for follow-up)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="w-full bg-[var(--sf)] border border-dotted border-[var(--st)] px-3 py-2 text-xs text-[var(--tx)] outline-none focus:border-[var(--accent-orange)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-[var(--tx-secondary)] uppercase">
                    Note or Feature Request
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g., Could we add native Firecracker microVM support or Apple Silicon hypervisor backend?"
                    className="w-full bg-[var(--sf)] border border-dotted border-[var(--st)] px-3 py-2 text-xs text-[var(--tx)] outline-none focus:border-[var(--accent-orange)] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-mono text-[var(--tx-secondary)] hover:text-[var(--tx)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent-orange)] text-white hover:brightness-105 border border-dotted border-[var(--accent-orange)] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Sending...' : 'Send Note'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
