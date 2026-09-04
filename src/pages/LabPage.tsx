import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LabPage() {
  // Audio synthesizer tester
  const [synthType, setSynthType] = useState<OscillatorType>('sine');
  const [synthFreq, setSynthFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);

  // Robot customizer
  const [antennaAngle, setAntennaAngle] = useState(15);
  const [eyeShape, setEyeShape] = useState<'circle' | 'square' | 'line'>('circle');
  const [glitchIntensity, setGlitchIntensity] = useState(3);

  const playTone = (freq: number, type: OscillatorType = synthType, duration: number = 0.2) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)] flex flex-col">
      <Header />

      <main className="flex-1 pt-[56px]">
        <div className="section-container border-l border-r border-dotted border-[var(--st-secondary)] px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent-orange)] font-semibold mb-2">
              cmmnts research · experimental
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-[var(--tx)] mb-3">
              The Laboratory
            </h1>
            <p className="font-sans text-base text-[var(--tx-secondary)] leading-relaxed">
              Interactive sandbox featuring real physics engine substeps, procedural audio synthesis, and the glitching robotics behind cmmnts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Experiment 1: Web Audio Synthesis Workbench */}
            <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
                <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                  EXP-01 · Procedural WebAudio
                </span>
                <span className="font-mono text-[11px] text-[var(--tx-tertiary)]">
                  Zero Audio Files
                </span>
              </div>

              <h2 className="font-sans font-bold text-lg text-[var(--tx)] mb-2">
                SFX Oscillator Workbench
              </h2>
              <p className="text-xs text-[var(--tx-secondary)] mb-6 leading-relaxed">
                All platformer audio is synthesized via mathematical waveforms at runtime with no MP3 or WAV downloads.
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => playTone(320, 'sine', 0.15)}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Jump</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">320Hz</span>
                </button>
                <button
                  type="button"
                  onClick={() => playTone(540, 'triangle', 0.18)}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Double Jump</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">540Hz</span>
                </button>
                <button
                  type="button"
                  onClick={() => playTone(880, 'sine', 0.25)}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Collect Gem</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">880Hz</span>
                </button>
                <button
                  type="button"
                  onClick={() => playTone(660, 'square', 0.28)}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Pick Key</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">660Hz</span>
                </button>
                <button
                  type="button"
                  onClick={() => playTone(80, 'sawtooth', 0.22)}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Spike Hit</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">80Hz</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    [440, 554, 659, 880].forEach((f, i) =>
                      setTimeout(() => playTone(f, 'sine', 0.18), i * 80)
                    );
                  }}
                  className="outline-btn text-xs py-2 px-3 flex items-center justify-between"
                >
                  <span>Door Clear</span>
                  <span className="text-[10px] text-[var(--accent-orange)]">Chime</span>
                </button>
              </div>

              {/* Manual frequency slider */}
              <div className="p-4 bg-[var(--sf-secondary)] border border-dotted border-[var(--st-secondary)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--tx)]">Manual Frequency:</span>
                  <span className="text-[var(--accent-orange)] font-bold">{synthFreq} Hz</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="1400"
                  step="10"
                  value={synthFreq}
                  onChange={(e) => setSynthFreq(Number(e.target.value))}
                  className="w-full accent-[var(--accent-orange)]"
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    {(['sine', 'triangle', 'square', 'sawtooth'] as OscillatorType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSynthType(t)}
                        className={`text-[10px] font-mono px-2 py-0.5 border border-dotted border-[var(--st)] ${
                          synthType === t
                            ? 'bg-[var(--tx)] text-[var(--tx-inverse)]'
                            : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => playTone(synthFreq, synthType, 0.4)}
                    className="outline-btn text-xs py-1 px-3"
                  >
                    Play Wave
                  </button>
                </div>
              </div>
            </div>

            {/* Experiment 2: Glitch Bot Avatar Factory */}
            <div className="border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-6 relative">
              <div className="joint-corner joint-tl" />
              <div className="joint-corner joint-tr" />
              <div className="joint-corner joint-bl" />
              <div className="joint-corner joint-br" />

              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
                <span className="font-mono text-xs font-bold text-[var(--accent-orange)]">
                  EXP-02 · Robot Mechanics
                </span>
                <span className="font-mono text-[11px] text-[var(--tx-tertiary)]">
                  Chromatic Shaders
                </span>
              </div>

              <h2 className="font-sans font-bold text-lg text-[var(--tx)] mb-2">
                Header Glitch Bot Architecture
              </h2>
              <p className="text-xs text-[var(--tx-secondary)] mb-6 leading-relaxed">
                The Lab avatar in the navigation bar runs 400ms chromatic shifts and an idle antenna bob.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[var(--sf-secondary)] border border-dotted border-[var(--st-secondary)] mb-6">
                <div
                  className="w-24 h-24 flex items-center justify-center border border-dotted border-[var(--st)] bg-[var(--sf)] relative cursor-pointer"
                  style={{
                    filter: `drop-shadow(${glitchIntensity}px 0 rgba(232,100,44,0.5)) drop-shadow(-${glitchIntensity}px 0 rgba(47,158,91,0.5))`,
                  }}
                  onClick={() => playTone(600, 'square', 0.15)}
                >
                  <svg
                    className="w-14 h-14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line
                      x1={10 - antennaAngle / 10}
                      y1="2"
                      x2="10"
                      y2="7"
                      className="lab-antenna-l"
                    />
                    <line
                      x1={14 + antennaAngle / 10}
                      y1="2"
                      x2="14"
                      y2="7"
                      className="lab-antenna-r"
                    />
                    <rect x="4" y="7" width="16" height="14" rx="2" />
                    {eyeShape === 'circle' && (
                      <>
                        <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                      </>
                    )}
                    {eyeShape === 'square' && (
                      <>
                        <rect x="7.5" y="10.5" width="3" height="3" fill="currentColor" />
                        <rect x="13.5" y="10.5" width="3" height="3" fill="currentColor" />
                      </>
                    )}
                    {eyeShape === 'line' && (
                      <>
                        <line x1="7.5" y1="12" x2="10.5" y2="12" strokeWidth="2" />
                        <line x1="13.5" y1="12" x2="16.5" y2="12" strokeWidth="2" />
                      </>
                    )}
                    <line x1="9" y1="17" x2="15" y2="17" strokeDasharray="1 1" />
                  </svg>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Chromatic Glitch Offset</span>
                      <span className="text-[var(--accent-orange)] font-bold">{glitchIntensity}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={glitchIntensity}
                      onChange={(e) => setGlitchIntensity(Number(e.target.value))}
                      className="w-full accent-[var(--accent-orange)]"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-mono block mb-1.5">Sensor Array Shape:</span>
                    <div className="flex gap-2">
                      {(['circle', 'square', 'line'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEyeShape(s)}
                          className={`text-xs font-mono px-3 py-1 border border-dotted border-[var(--st)] ${
                            eyeShape === s
                              ? 'bg-[var(--tx)] text-[var(--tx-inverse)]'
                              : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
