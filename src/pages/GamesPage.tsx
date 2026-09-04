import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Game from '../components/Game';
import { LEVELS } from '../game/levels';

export default function GamesPage() {
  const [selectedLevel, setSelectedLevel] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)] flex flex-col">
      <Header />

      <main className="flex-1 pt-[56px]">
        <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mb-10">
            <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
              Chambers 01–20
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[var(--tx)] mb-3">
              The Platformer Chambers
            </h1>
            <p className="font-sans text-base text-[var(--tx-secondary)] leading-relaxed">
              20 intricate tilemaps handcrafted directly inside cmmnts. Collect gems, unlock the brass key, and reach the exit portal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Active Game Canvas */}
            <div className="lg:col-span-5 border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-5 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
                <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                  Chamber {selectedLevel + 1} of 20
                </span>
                <span className="font-sans font-semibold text-xs text-[var(--tx)]">
                  {LEVELS[selectedLevel]?.name} ({LEVELS[selectedLevel]?.tint})
                </span>
              </div>

              <Game />
            </div>

            {/* Right: Level Grid Selector */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-dotted border-[var(--st-secondary)] text-xs font-mono">
                <span className="font-bold text-[var(--tx)]">All 20 Levels</span>
                <span className="text-[var(--tx-secondary)]">Click any chamber to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEVELS.map((lvl, idx) => {
                  const isSelected = selectedLevel === idx;
                  const gemCount = lvl.grid.reduce(
                    (acc, row) => acc + (row.match(/o/g) || []).length,
                    0
                  );
                  const spikeCount = lvl.grid.reduce(
                    (acc, row) => acc + (row.match(/\^/g) || []).length,
                    0
                  );

                  return (
                    <button
                      key={lvl.name}
                      type="button"
                      onClick={() => setSelectedLevel(idx)}
                      className={`text-left p-3.5 border border-dotted transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[var(--accent-orange)] bg-[var(--sf-raised)] shadow-xs'
                          : 'border-[var(--st)] bg-[var(--sf)] hover:border-[var(--tx)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 uppercase rounded-[1px] bg-[var(--sf-tertiary)] text-[var(--tx-secondary)]">
                          {lvl.tint}
                        </span>
                      </div>

                      <div className="font-sans font-bold text-sm text-[var(--tx)] mb-2">
                        {lvl.name}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--tx-secondary)]">
                        <span>◆ {gemCount} gems</span>
                        <span>▲ {spikeCount} spikes</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
