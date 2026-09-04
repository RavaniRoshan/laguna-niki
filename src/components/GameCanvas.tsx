import { useEffect, useRef, useState, useCallback } from 'react';
import { LEVELS, LEVEL_TINTS } from '../data/levels';
import { playSfx } from '../utils/sfx';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

const GRID_W = 20;
const GRID_H = 36;
const PLAYER_W = 0.72;
const PLAYER_H = 0.9;

// Physics constants verbatim from §6.2
const GRAVITY = 0.055; // l4
const TERMINAL_FALL = 0.62; // _g
const WALK_SPEED = 0.18; // Sg
const JUMP_IMPULSE = -0.80; // Tg
const DOUBLE_JUMP_IMPULSE = -0.52; // o4
const WALL_SLIDE_MAX = 0.11; // Mg
const WALL_JUMP_KICK = 0.27; // r4
const COYOTE_TICKS = 6;
const JUMP_BUFFER_TICKS = 6;

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gemsGot, setGemsGot] = useState(0);
  const [totalGems, setTotalGems] = useState(15);
  const [hasKey, setHasKey] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Game state held in refs for 60fps loop
  const gameStateRef = useRef({
    currentLevelIdx: 0,
    playerX: 1,
    playerY: 34,
    vx: 0,
    vy: 0,
    face: 1,
    onGround: false,
    canDouble: true,
    coyote: 0,
    jumpBuffer: 0,
    wall: 0, // -1: wall on left, 1: wall on right, 0: no wall
    hasKey: false,
    gemsGot: 0,
    totalGems: 15,
    score: 0,
    grid: [] as number[][], // 0: empty, 1: solid, 2: spike, 3: door, 4: gem, 5: key
    spawnX: 1,
    spawnY: 34,
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    camY: 30,
    camReady: false,
    keysDown: {
      left: false,
      right: false,
      jump: false,
    },
    tick: 0,
    levelTint: 'sand',
    levelName: 'Foothills',
    isMuted: false,
  });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 1200);
  }, []);

  const loadLevel = useCallback((lvlIndex: number, keepScore = false) => {
    const idx = (lvlIndex + LEVELS.length) % LEVELS.length;
    const lvl = LEVELS[idx];
    const s = gameStateRef.current;

    s.currentLevelIdx = idx;
    s.levelTint = lvl.tint;
    s.levelName = lvl.name;
    s.hasKey = false;
    s.gemsGot = 0;
    if (!keepScore) s.score = 0;

    const lines = lvl.map.trim().split('\n');
    const newGrid: number[][] = [];
    let countGems = 0;
    let sX = 1;
    let sY = 34;

    for (let y = 0; y < GRID_H; y++) {
      const row: number[] = [];
      const line = lines[y] || '';
      for (let x = 0; x < GRID_W; x++) {
        const ch = line[x] || '.';
        if (ch === 'P') {
          sX = x;
          sY = y;
          row.push(0);
        } else if (ch === '#') {
          row.push(1);
        } else if (ch === '^') {
          row.push(2);
        } else if (ch === 'D') {
          row.push(3);
        } else if (ch === 'o') {
          row.push(4);
          countGems++;
        } else if (ch === 'K') {
          row.push(5);
        } else {
          row.push(0);
        }
      }
      newGrid.push(row);
    }

    s.grid = newGrid;
    s.spawnX = sX;
    s.spawnY = sY;
    s.playerX = sX;
    s.playerY = sY;
    s.vx = 0;
    s.vy = 0;
    s.onGround = true;
    s.canDouble = true;
    s.coyote = 0;
    s.jumpBuffer = 0;
    s.wall = 0;
    s.camY = sY;
    s.camReady = true;
    s.totalGems = countGems;

    setCurrentLevelIdx(idx);
    setHasKey(false);
    setGemsGot(0);
    setTotalGems(countGems);
  }, []);

  const respawn = useCallback(() => {
    const s = gameStateRef.current;
    playSfx('hurt', s.isMuted);

    // Spawn 14 death particles
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5);
      const spd = 0.1 + Math.random() * 0.16;
      s.particles.push({
        x: s.playerX + PLAYER_W / 2,
        y: s.playerY + PLAYER_H / 2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 3,
        color: '#E8642C',
      });
    }

    s.playerX = s.spawnX;
    s.playerY = s.spawnY;
    s.vx = 0;
    s.vy = 0;
    s.onGround = true;
    s.canDouble = true;
    s.coyote = 0;
    s.jumpBuffer = 0;
    s.wall = 0;
    s.camReady = false;

    showToast('Respawned');
  }, [showToast]);

  // Handle Mute toggle
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      gameStateRef.current.isMuted = next;
      return next;
    });
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = gameStateRef.current;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        s.keysDown.jump = true;
        s.jumpBuffer = JUMP_BUFFER_TICKS;
        // prevent page scroll on game controls if inside canvas
        if (['ArrowUp', 'Space'].includes(e.code)) {
          e.preventDefault();
        }
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        s.keysDown.left = true;
        e.preventDefault();
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        s.keysDown.right = true;
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const s = gameStateRef.current;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        s.keysDown.jump = false;
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        s.keysDown.left = false;
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        s.keysDown.right = false;
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main game loop (60 FPS)
  useEffect(() => {
    loadLevel(0);

    let animationFrameId: number;
    let lastTime = performance.now();
    const tickInterval = 1000 / 60; // 60 Hz (El = 1000/60)
    let accumulator = 0;

    const gameTick = () => {
      const s = gameStateRef.current;
      s.tick++;

      // Horizontal target velocity
      let targetVx = 0;
      if (s.keysDown.left) {
        targetVx -= WALK_SPEED;
        s.face = -1;
      }
      if (s.keysDown.right) {
        targetVx += WALK_SPEED;
        s.face = 1;
      }
      s.vx = targetVx;

      // Jump resolution order (production bt spec):
      // 1. If onGround -> coyote = 6, else decrement coyote.
      if (s.onGround) {
        s.coyote = COYOTE_TICKS;
      } else if (s.coyote > 0) {
        s.coyote--;
      }

      // 2. Jump buffer handling
      if (s.jumpBuffer > 0) {
        if (s.onGround || s.coyote > 0) {
          s.vy = JUMP_IMPULSE;
          s.canDouble = true;
          s.onGround = false;
          s.coyote = 0;
          s.jumpBuffer = 0;
          playSfx('jump', s.isMuted);
        } else if (s.wall !== 0) {
          s.vy = JUMP_IMPULSE;
          s.vx = -s.wall * WALL_JUMP_KICK;
          s.face = -s.wall;
          s.canDouble = true;
          s.jumpBuffer = 0;
          playSfx('jump', s.isMuted);
        } else if (s.canDouble) {
          s.vy = DOUBLE_JUMP_IMPULSE;
          s.canDouble = false;
          s.jumpBuffer = 0;
          playSfx('double', s.isMuted);

          // double jump visual ring particles
          for (let p = 0; p < 6; p++) {
            s.particles.push({
              x: s.playerX + PLAYER_W / 2,
              y: s.playerY + PLAYER_H,
              vx: (Math.random() - 0.5) * 0.12,
              vy: Math.random() * 0.08,
              life: 1,
              maxLife: 1,
              size: 2,
              color: '#FAF8F5',
            });
          }
        } else {
          s.jumpBuffer--;
        }
      }

      // Gravity & wall slide
      s.vy += GRAVITY;
      if (s.vy > TERMINAL_FALL) {
        s.vy = TERMINAL_FALL;
      }

      // Check if wall-sliding
      const isWallSliding = s.wall !== 0 && !s.onGround && ((s.wall === -1 && s.keysDown.left) || (s.wall === 1 && s.keysDown.right));
      if (isWallSliding && s.vy > WALL_SLIDE_MAX) {
        s.vy = WALL_SLIDE_MAX;
      }

      // Substep movement: n = ceil(max(|vx|,|vy|) / 0.22)
      const maxSpd = Math.max(Math.abs(s.vx), Math.abs(s.vy));
      const substeps = Math.max(1, Math.ceil(maxSpd / 0.22));
      const dtVx = s.vx / substeps;
      const dtVy = s.vy / substeps;

      let detectedWall = 0;
      let landedThisFrame = false;

      for (let step = 0; step < substeps; step++) {
        // Horizontal step
        s.playerX += dtVx;

        // Clamp to screen bounds [0, GRID_W - PLAYER_W]
        if (s.playerX < 0) {
          s.playerX = 0;
          detectedWall = -1;
        } else if (s.playerX > GRID_W - PLAYER_W) {
          s.playerX = GRID_W - PLAYER_W;
          detectedWall = 1;
        }

        // Horizontal collision against '#'
        const startTileY = Math.floor(s.playerY);
        const endTileY = Math.floor(s.playerY + PLAYER_H - 0.001);

        if (dtVx > 0) {
          const checkX = Math.floor(s.playerX + PLAYER_W);
          for (let ty = startTileY; ty <= endTileY; ty++) {
            if (ty >= 0 && ty < GRID_H && checkX >= 0 && checkX < GRID_W) {
              if (s.grid[ty][checkX] === 1) {
                s.playerX = checkX - PLAYER_W;
                detectedWall = 1;
                break;
              }
            }
          }
        } else if (dtVx < 0) {
          const checkX = Math.floor(s.playerX);
          for (let ty = startTileY; ty <= endTileY; ty++) {
            if (ty >= 0 && ty < GRID_H && checkX >= 0 && checkX < GRID_W) {
              if (s.grid[ty][checkX] === 1) {
                s.playerX = checkX + 1;
                detectedWall = -1;
                break;
              }
            }
          }
        }

        // Vertical step
        s.playerY += dtVy;

        const startTileX = Math.floor(s.playerX);
        const endTileX = Math.floor(s.playerX + PLAYER_W - 0.001);

        if (dtVy > 0) {
          const checkY = Math.floor(s.playerY + PLAYER_H);
          let groundHit = false;
          for (let tx = startTileX; tx <= endTileX; tx++) {
            if (checkY >= 0 && checkY < GRID_H && tx >= 0 && tx < GRID_W) {
              if (s.grid[checkY][tx] === 1) {
                s.playerY = checkY - PLAYER_H;
                groundHit = true;
                break;
              }
            }
          }
          if (groundHit) {
            if (s.vy > 0.35) {
              // 4 dust particles on hard landing
              for (let d = 0; d < 4; d++) {
                s.particles.push({
                  x: s.playerX + (d / 3) * PLAYER_W,
                  y: s.playerY + PLAYER_H,
                  vx: (Math.random() - 0.5) * 0.08,
                  vy: -Math.random() * 0.06,
                  life: 1,
                  maxLife: 1,
                  size: 2.5,
                  color: '#FAF8F5',
                });
              }
            }
            s.vy = 0;
            s.onGround = true;
            s.canDouble = true;
            landedThisFrame = true;
          }
        } else if (dtVy < 0) {
          const checkY = Math.floor(s.playerY);
          for (let tx = startTileX; tx <= endTileX; tx++) {
            if (checkY >= 0 && checkY < GRID_H && tx >= 0 && tx < GRID_W) {
              if (s.grid[checkY][tx] === 1) {
                s.playerY = checkY + 1;
                s.vy = 0;
                break;
              }
            }
          }
        }
      }

      s.wall = detectedWall;
      if (!landedThisFrame && dtVy > 0) {
        // check 1 pixel below feet
        const checkBelowY = Math.floor(s.playerY + PLAYER_H + 0.04);
        let on = false;
        const startTileX = Math.floor(s.playerX);
        const endTileX = Math.floor(s.playerX + PLAYER_W - 0.001);
        for (let tx = startTileX; tx <= endTileX; tx++) {
          if (checkBelowY >= 0 && checkBelowY < GRID_H && tx >= 0 && tx < GRID_W) {
            if (s.grid[checkBelowY][tx] === 1) {
              on = true;
              break;
            }
          }
        }
        s.onGround = on;
      }

      // Check item collisions & hazards
      const pCenterX = s.playerX + PLAYER_W / 2;
      const pCenterY = s.playerY + PLAYER_H / 2;

      const pTileX = Math.floor(pCenterX);
      const pTileY = Math.floor(pCenterY);

      // Check surrounding tiles for spike/crush or items
      const checkRange = [
        [0, 0],
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];

      for (const [ox, oy] of checkRange) {
        const tx = pTileX + ox;
        const ty = pTileY + oy;
        if (tx >= 0 && tx < GRID_W && ty >= 0 && ty < GRID_H) {
          const tile = s.grid[ty][tx];

          // Check overlap with tile box
          const overlap =
            s.playerX < tx + 1 &&
            s.playerX + PLAYER_W > tx &&
            s.playerY < ty + 1 &&
            s.playerY + PLAYER_H > ty;

          if (overlap) {
            if (tile === 2) {
              // Spike kill
              respawn();
              return;
            } else if (tile === 4) {
              // Gem collected!
              s.grid[ty][tx] = 0;
              s.gemsGot++;
              s.score += 50;
              setGemsGot(s.gemsGot);
              playSfx('gem', s.isMuted);

              // Burst particles
              for (let i = 0; i < 6; i++) {
                s.particles.push({
                  x: tx + 0.5,
                  y: ty + 0.5,
                  vx: (Math.random() - 0.5) * 0.14,
                  vy: (Math.random() - 0.5) * 0.14,
                  life: 1,
                  maxLife: 1,
                  size: 2.5,
                  color: '#E8642C',
                });
              }

              // Floating +50 text
              s.floatingTexts.push({
                x: tx + 0.5,
                y: ty + 0.2,
                text: '+50',
                life: 1,
                maxLife: 1,
              });
            } else if (tile === 5) {
              // Key collected!
              s.grid[ty][tx] = 0;
              s.hasKey = true;
              setHasKey(true);
              playSfx('key', s.isMuted);
              showToast('Key Collected! Door Unlocked');
            } else if (tile === 3) {
              // Door reached
              if (s.hasKey) {
                playSfx('door', s.isMuted);
                showToast('Level Complete!');
                setTimeout(() => {
                  loadLevel(s.currentLevelIdx + 1, true);
                }, 400);
                return;
              }
            }
          }
        }
      }

      // If fallen out of level bottom
      if (s.playerY > GRID_H + 2) {
        respawn();
        return;
      }

      // Camera lerp
      const targetCamY = Math.max(9, Math.min(GRID_H - 9, s.playerY));
      if (!s.camReady) {
        s.camY = targetCamY;
        s.camReady = true;
      } else {
        s.camY += (targetCamY - s.camY) * 0.12;
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.008; // particle gravity
        p.life -= 0.028;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.02;
        ft.life -= 0.025;
        if (ft.life <= 0) {
          s.floatingTexts.splice(i, 1);
        }
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const s = gameStateRef.current;
      const tint = LEVEL_TINTS[s.levelTint] || LEVEL_TINTS.sand;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const targetWidth = Math.floor(rect.width * dpr);
      const targetHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const viewW = rect.width;
      const viewH = rect.height;

      // Tile sizing: width fit 20 tiles
      const tileSize = viewW / GRID_W;
      const visibleRows = viewH / tileSize;

      // Camera viewport offset
      const viewTopTile = s.camY - visibleRows / 2;
      const offsetY = -viewTopTile * tileSize;

      // 1. Background
      ctx.fillStyle = tint.bg;
      ctx.fillRect(0, 0, viewW, viewH);

      // Background dot grid
      ctx.fillStyle = tint.grid;
      const dotSpacing = tileSize;
      const startX = (0 % dotSpacing);
      const startY = (offsetY % dotSpacing + dotSpacing) % dotSpacing;

      for (let x = startX; x < viewW; x += dotSpacing) {
        for (let y = startY; y < viewH; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x + dotSpacing / 2, y + dotSpacing / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Render tiles
      for (let y = 0; y < GRID_H; y++) {
        const screenY = y * tileSize + offsetY;
        if (screenY + tileSize < -20 || screenY > viewH + 20) continue;

        for (let x = 0; x < GRID_W; x++) {
          const screenX = x * tileSize;
          const tile = s.grid[y] ? s.grid[y][x] : 0;

          if (tile === 1) {
            // Solid block '#'
            ctx.fillStyle = tint.block;
            ctx.fillRect(screenX, screenY, tileSize, tileSize);

            // Hatch lines
            ctx.save();
            ctx.beginPath();
            ctx.rect(screenX, screenY, tileSize, tileSize);
            ctx.clip();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            for (let d = -tileSize; d < tileSize * 2; d += 4) {
              ctx.beginPath();
              ctx.moveTo(screenX + d, screenY);
              ctx.lineTo(screenX + d + tileSize, screenY + tileSize);
              ctx.stroke();
            }
            ctx.restore();

            // Subtle border
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(screenX, screenY, tileSize, tileSize);
          } else if (tile === 2) {
            // Spike '^'
            ctx.fillStyle = '#D62828';
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + tileSize);
            ctx.lineTo(screenX + tileSize / 2, screenY + tileSize * 0.2);
            ctx.lineTo(screenX + tileSize, screenY + tileSize);
            ctx.closePath();
            ctx.fill();

            // Spike tip highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.moveTo(screenX + tileSize / 2, screenY + tileSize * 0.2);
            ctx.lineTo(screenX + tileSize * 0.35, screenY + tileSize * 0.5);
            ctx.lineTo(screenX + tileSize * 0.65, screenY + tileSize * 0.5);
            ctx.closePath();
            ctx.fill();
          } else if (tile === 3) {
            // Door 'D'
            const doorActive = s.hasKey;
            ctx.fillStyle = doorActive ? tint.accent : 'rgba(100, 100, 100, 0.4)';
            ctx.fillRect(screenX + tileSize * 0.15, screenY + tileSize * 0.05, tileSize * 0.7, tileSize * 0.95);

            // Door frame & arch
            ctx.strokeStyle = doorActive ? '#FAF8F5' : 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(screenX + tileSize * 0.15, screenY + tileSize * 0.05, tileSize * 0.7, tileSize * 0.95);

            // Doorknob
            ctx.fillStyle = '#FAF8F5';
            ctx.beginPath();
            ctx.arc(screenX + tileSize * 0.3, screenY + tileSize * 0.55, tileSize * 0.08, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 4) {
            // Gem 'o' (small circle, bobbing)
            const bob = Math.sin((s.tick + x * 5 + y * 8) * 0.1) * 2;
            const gemX = screenX + tileSize / 2;
            const gemY = screenY + tileSize / 2 + bob;
            const r = tileSize * 0.28;

            ctx.fillStyle = '#E8642C';
            ctx.beginPath();
            ctx.arc(gemX, gemY, r, 0, Math.PI * 2);
            ctx.fill();

            // Inner shine
            ctx.fillStyle = '#FFD166';
            ctx.beginPath();
            ctx.arc(gemX - r * 0.25, gemY - r * 0.25, r * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 5) {
            // Key 'K'
            const bob = Math.cos((s.tick + 10) * 0.1) * 2.5;
            const keyX = screenX + tileSize / 2;
            const keyY = screenY + tileSize / 2 + bob;

            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.arc(keyX - tileSize * 0.15, keyY, tileSize * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(keyX - tileSize * 0.05, keyY - tileSize * 0.06, tileSize * 0.35, tileSize * 0.12);
            ctx.fillRect(keyX + tileSize * 0.15, keyY, tileSize * 0.1, tileSize * 0.16);

            // Key hole
            ctx.fillStyle = tint.bg;
            ctx.beginPath();
            ctx.arc(keyX - tileSize * 0.15, keyY, tileSize * 0.08, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3. Particles
      for (const p of s.particles) {
        const px = p.x * tileSize;
        const py = p.y * tileSize + offsetY;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      // 4. Render Player
      const px = s.playerX * tileSize;
      const py = s.playerY * tileSize + offsetY;
      const pw = PLAYER_W * tileSize;
      const ph = PLAYER_H * tileSize;

      // Squash and stretch
      let squashX = 1;
      let squashY = 1;
      if (Math.abs(s.vy) > 0.3) {
        squashX = 0.88;
        squashY = 1.12;
      }

      ctx.save();
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.scale(squashX, squashY);

      // Player body (rounded rect)
      ctx.fillStyle = '#E8642C';
      const rad = 4;
      const hPw = pw / 2;
      const hPh = ph / 2;

      ctx.beginPath();
      ctx.moveTo(-hPw + rad, -hPh);
      ctx.lineTo(hPw - rad, -hPh);
      ctx.quadraticCurveTo(hPw, -hPh, hPw, -hPh + rad);
      ctx.lineTo(hPw, hPh - rad);
      ctx.quadraticCurveTo(hPw, hPh, hPw - rad, hPh);
      ctx.lineTo(-hPw + rad, hPh);
      ctx.quadraticCurveTo(-hPw, hPh, -hPw, hPh - rad);
      ctx.lineTo(-hPw, -hPh + rad);
      ctx.quadraticCurveTo(-hPw, -hPh, -hPw + rad, -hPh);
      ctx.closePath();
      ctx.fill();

      // Eye looking in face direction
      ctx.fillStyle = '#FAF8F5';
      const eyeOffsetX = s.face * pw * 0.18;
      ctx.fillRect(eyeOffsetX - 1.5, -ph * 0.15, 4, 4);

      // Wall slide particle sweat
      if (s.wall !== 0 && !s.onGround) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(-s.wall * pw * 0.45, -ph * 0.35, 2, 2);
      }

      ctx.restore();

      // 5. Floating texts (+50 in Pixelify Sans)
      ctx.font = '600 13px "Pixelify Sans", sans-serif';
      ctx.textAlign = 'center';
      for (const ft of s.floatingTexts) {
        const ftx = ft.x * tileSize;
        const fty = ft.y * tileSize + offsetY;
        ctx.fillStyle = `rgba(232, 100, 44, ${Math.max(0, ft.life)})`;
        ctx.fillText(ft.text, ftx, fty);
      }

      ctx.restore();
    };

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      accumulator += dt;

      // Cap accumulator to avoid spiral of death
      if (accumulator > 200) accumulator = 200;

      while (accumulator >= tickInterval) {
        gameTick();
        accumulator -= tickInterval;
      }

      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loadLevel, respawn]);

  // Touch control handlers for mobile
  const handleTouchLeftStart = () => {
    gameStateRef.current.keysDown.left = true;
  };
  const handleTouchLeftEnd = () => {
    gameStateRef.current.keysDown.left = false;
  };
  const handleTouchRightStart = () => {
    gameStateRef.current.keysDown.right = true;
  };
  const handleTouchRightEnd = () => {
    gameStateRef.current.keysDown.right = false;
  };
  const handleTouchJump = () => {
    gameStateRef.current.keysDown.jump = true;
    gameStateRef.current.jumpBuffer = JUMP_BUFFER_TICKS;
    setTimeout(() => {
      gameStateRef.current.keysDown.jump = false;
    }, 150);
  };

  const levelInfo = LEVELS[currentLevelIdx] || LEVELS[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border border-dotted border-[var(--st)] bg-[var(--paper)]"
      style={{ height: 'min(480px, 80vh)' }}
    >
      {/* HUD in Pixelify Sans */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-[var(--sf)]/85 backdrop-blur-xs border-b border-dotted border-[var(--st)] font-pixel text-xs text-[var(--tx)] select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--accent-orange)]">
            Lv {currentLevelIdx + 1}
          </span>
          <span className="text-[var(--tx-secondary)]">·</span>
          <span>{levelInfo.name}</span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          {/* Gem count ◆ got/total */}
          <div className="flex items-center gap-1 text-[var(--accent-orange)]">
            <span>◆</span>
            <span>
              {gemsGot}/{totalGems}
            </span>
          </div>

          {/* Key indicator */}
          <div
            className={`px-1.5 py-0.5 rounded text-[10px] tracking-wide transition-opacity ${
              hasKey
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                : 'opacity-25'
            }`}
          >
            {hasKey ? '🔑 KEY' : '🔑'}
          </div>

          {/* Mute button */}
          <button
            type="button"
            onClick={toggleMute}
            className="cursor-pointer hover:opacity-80 transition-opacity p-0.5"
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block focus:outline-none"
        tabIndex={0}
      />

      {/* Toast popup */}
      {toastMsg && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-2.5 py-1 bg-[var(--tx)] text-[var(--tx-inverse)] font-pixel text-xs shadow-md pointer-events-none animate-fadeIn">
          {toastMsg}
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-3 py-1.5 bg-[var(--sf)]/90 backdrop-blur-xs border-t border-dotted border-[var(--st)] font-sans text-[11px] text-[var(--tx-secondary)]">
        <div className="hidden sm:block">
          Use arrow keys or WASD · ↑ jumps · double-jump & wall-jump
        </div>
        <div className="sm:hidden font-pixel text-[10px]">
          Tap controls below to play
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadLevel(currentLevelIdx - 1)}
            className="hover:text-[var(--tx)] cursor-pointer text-xs"
            title="Previous level"
          >
            «
          </button>
          <span className="font-pixel text-[10px] text-[var(--tx)]">
            {currentLevelIdx + 1}/20
          </span>
          <button
            type="button"
            onClick={() => loadLevel(currentLevelIdx + 1)}
            className="hover:text-[var(--tx)] cursor-pointer text-xs"
            title="Next level"
          >
            »
          </button>
        </div>
      </div>

      {/* Mobile On-Screen Controls */}
      <div className="sm:hidden absolute bottom-8 inset-x-0 z-20 flex items-center justify-between px-4 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            className="w-10 h-10 bg-[var(--sf)]/90 border border-dotted border-[var(--st)] text-[var(--tx)] text-base font-bold flex items-center justify-center active:bg-[var(--accent-orange)] active:text-white"
            aria-label="Move left"
          >
            ←
          </button>
          <button
            type="button"
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            className="w-10 h-10 bg-[var(--sf)]/90 border border-dotted border-[var(--st)] text-[var(--tx)] text-base font-bold flex items-center justify-center active:bg-[var(--accent-orange)] active:text-white"
            aria-label="Move right"
          >
            →
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            type="button"
            onTouchStart={handleTouchJump}
            onClick={handleTouchJump}
            className="w-12 h-12 rounded-full bg-[var(--accent-orange)] text-white text-base font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="Jump"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
