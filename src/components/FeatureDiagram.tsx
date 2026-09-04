import { useState, useEffect, useRef } from 'react';

interface AgentStep {
  id: string;
  name: string;
  role: string;
  color: string;
  badge: string;
  description: string;
  detail: string;
}

const AGENTS: AgentStep[] = [
  {
    id: 'planner',
    name: '1. Planner Agent',
    role: 'AST & Workspace Mapping',
    color: '#a855f7',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    description:
      'Inspects codebase symbols and dependency graphs over a read-only mount without mutating files. Establishes a minimal, deterministic execution contract.',
    detail: 'Output: Ordered touchlist & task AST',
  },
  {
    id: 'coder',
    name: '2. Coder Agent',
    role: 'Sandboxed Diff Generation',
    color: '#f59e0b',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    description:
      'Applies surgical unified diffs strictly within the isolated Podman/Docker container sandbox. Never writes unvetted files to your local host filesystem.',
    detail: 'Output: Sandboxed unified diff',
  },
  {
    id: 'tester',
    name: '3. Tester Agent',
    role: 'Autonomous Test Verification',
    color: '#10b981',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    description:
      'Generates reproduction tests and runs your actual project test suite inside the container. If tests fail, it guides the Coder to self-correct before review.',
    detail: 'Output: Passing test execution log',
  },
  {
    id: 'reviewer',
    name: '4. Reviewer Agent',
    role: 'Security & Quality Audit Gate',
    color: '#3b82f6',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    description:
      'Acts as an impartial senior engineer. Checks for memory safety, lock contention, timing attacks, and project conventions before approving the git branch.',
    detail: 'Output: Verified reviewable git branch',
  },
];

export default function FeatureDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Left Zone: Host (Read-Only)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.fillRect(12, 12, 120, h - 24);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.strokeRect(12, 12, 120, h - 24);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('HOST REPO', 22, 34);
      ctx.fillStyle = 'rgba(150, 150, 150, 0.85)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('[Read-Only]', 22, 50);
      ctx.fillText('• 0 host writes', 22, 78);
      ctx.fillText('• Uncommitted safe', 22, 98);
      ctx.fillText('• Sealed disk', 22, 118);

      // Hermetic Firewall Boundary
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -t * 6;
      ctx.strokeStyle = '#e8642c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(142, 12);
      ctx.lineTo(142, h - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right Zone: Podman Sandbox (Ephemeral)
      ctx.fillStyle = 'rgba(232, 100, 44, 0.05)';
      ctx.fillRect(152, 12, w - 164, h - 24);
      ctx.strokeStyle = 'rgba(232, 100, 44, 0.25)';
      ctx.strokeRect(152, 12, w - 164, h - 24);

      ctx.fillStyle = '#e8642c';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('CONTAINER SANDBOX', 165, 34);

      // 4 Agents
      const yCoords = [64, 108, 152, 196];
      AGENTS.forEach((ag, idx) => {
        const y = yCoords[idx];
        const isSelected = activeAgentIndex === idx;
        const pulse = isSelected ? Math.sin(t * 3) * 2 : 0;

        ctx.fillStyle = ag.color;
        ctx.beginPath();
        ctx.arc(175, y, 6 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = isSelected ? 'bold 10px "JetBrains Mono", monospace' : '10px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? ag.color : 'rgba(160, 160, 160, 0.9)';
        ctx.fillText(ag.name.replace(/^\d+\.\s*/, ''), 190, y + 3.5);

        if (idx < AGENTS.length - 1) {
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.25)';
          ctx.beginPath();
          ctx.moveTo(175, y + 8);
          ctx.lineTo(175, yCoords[idx + 1] - 8);
          ctx.stroke();
        }
      });

      // Output Branch Pill
      ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.fillRect(165, 224, w - 185, 28);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.strokeRect(165, 224, w - 185, 28);
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText('→ git branch: niki/task-c892', 174, 241);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeAgentIndex]);

  return (
    <section
      id="features"
      className="relative w-full border-t border-[var(--st)] bg-[var(--sf)] py-16 sm:py-24"
    >
      <div className="section-container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--accent-orange)] mb-2">
            The 4-Agent Pipeline
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--tx)] m-0">
            Isolated by design. Tested before merge.
          </h2>
          <p className="text-base text-[var(--tx-secondary)] mt-2 max-w-2xl font-sans m-0">
            Niki divides autonomous coding into four strictly scoped agents running inside an isolated Podman or Docker sandbox.
          </p>
        </div>

        {/* 2-Column Grid: Visual Perimeter + Agent Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Containment Blueprint */}
          <div className="lg:col-span-5 border border-[var(--st)] bg-[var(--sf-raised)] p-5 rounded-md shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--tx-secondary)] pb-3 mb-4 border-b border-[var(--st-secondary)]">
              <span className="font-semibold text-[var(--tx)]">Hermetic Isolation Boundary</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={270}
                className="max-w-full h-auto border border-[var(--st-secondary)] rounded-sm bg-[var(--sf)]"
              />
            </div>

            <div className="text-[11px] font-mono text-[var(--tx-tertiary)] flex items-center justify-between pt-3 mt-4 border-t border-[var(--st-secondary)]">
              <span>Host tree: sealed read-only</span>
              <span className="text-[var(--accent-orange)] font-medium">Podman / Docker OCI</span>
            </div>
          </div>

          {/* Right: 4 Clean Agent Step Cards */}
          <div className="lg:col-span-7 space-y-3">
            {AGENTS.map((agent, idx) => {
              const isSelected = activeAgentIndex === idx;
              return (
                <div
                  key={agent.id}
                  onClick={() => setActiveAgentIndex(idx)}
                  className={`p-4 rounded-md border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent-orange)] bg-[var(--sf-raised)] shadow-xs'
                      : 'border-[var(--st)] bg-[var(--sf-raised)]/60 hover:border-[var(--tx-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-xs border ${agent.badge}`}>
                        {agent.name}
                      </span>
                      <span className="text-sm font-sans font-medium text-[var(--tx)]">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-sans text-[var(--tx-secondary)] leading-relaxed m-0 mt-1">
                    {agent.description}
                  </p>

                  <div className="text-[11px] font-mono text-[var(--tx-tertiary)] mt-2 pt-2 border-t border-[var(--st-secondary)]">
                    {agent.detail}
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
