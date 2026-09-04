import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeatureDiagram from '../components/FeatureDiagram';
import WhatIs from '../components/WhatIs';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import TryItOut from '../components/TryItOut';
import Footer from '../components/Footer';
import LeaveNoteModal from '../components/LeaveNoteModal';

export default function LandingPage() {
  const [isLeaveNoteOpen, setIsLeaveNoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)] selection:bg-[var(--accent-orange)] selection:text-white transition-colors duration-150">
      {/* 56px Fixed Header */}
      <Header />

      {/* Main Sections */}
      <main>
        {/* Section 5.1: Hero with 420svh sticky stage, Typewriter, Embed Snippet, Game & Mock Widget */}
        <Hero />

        {/* Section 5.2: 5 Editorial cards, Admin Console Switches & 28x24 Blueprint */}
        <FeatureDiagram />

        {/* Section 5.3 & 5.4: Strikethrough Title, Scroll-Heat Body & 7 Feature Points */}
        <WhatIs />

        {/* Section 5.5: Pricing Table */}
        <Pricing />

        {/* Section 5.6: FAQ Accordion */}
        <FAQ />

        {/* Section 5.7: Second Live Widget */}
        <TryItOut />
      </main>

      {/* Footer */}
      <Footer onOpenLeaveNote={() => setIsLeaveNoteOpen(true)} />

      {/* Leave a Note Modal */}
      <LeaveNoteModal
        isOpen={isLeaveNoteOpen}
        onClose={() => setIsLeaveNoteOpen(false)}
      />
    </div>
  );
}
