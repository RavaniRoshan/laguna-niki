import CommentsWidget, { TRY_INITIAL_COMMENTS } from './CommentsWidget';

export default function TryItOutSection() {
  return (
    <section className="py-16 md:py-24 border-t border-dotted border-[var(--st)] bg-[var(--sf)]">
      <div className="newspaper-column px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-xs font-mono tracking-wider text-[var(--accent-orange)] uppercase font-semibold mb-2">
              Live Demo
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[var(--tx)] mb-3">
              Try it out
            </h2>
            <p className="text-sm sm:text-base text-[var(--tx-secondary)]">
              This is the real widget. Leave feedback, a question, or anything else on your mind.
            </p>
          </div>

          {/* Embedded widget */}
          <div className="shadow-xs">
            <CommentsWidget
              siteKey="homepage"
              pageId="try-it-out"
              title="Discussion Board"
              subtitle="Test out markdown, emoji, and instant replies."
              initialComments={TRY_INITIAL_COMMENTS}
              allowAnonymous={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
