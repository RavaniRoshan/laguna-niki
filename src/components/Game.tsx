import { useEffect, useRef, useState } from 'react';
import {
  GRAVITY,
  TERMINAL_FALL,
  WALK_SPEED,
  JUMP_IMPULSE,
  DOUBLE_JUMP_IMPULSE,
  WALL_SLIDE_MAX,
  WALL_KICK_IMPULSE,
  COYOTE_TICKS,
  SUBSTEP_THRESHOLD,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GRID_COLS,
  GRID_ROWS,
} from '../game/physics';
import { LEVELS } from '../game/levels';
import { getEffectivePalette } from '../game/palette';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
}

// Synthesized Web Audio
class SoundManager {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playJump() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playDoubleJump() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.14);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playGem() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(587, now);
    osc.frequency.setValueAtTime(880, now + 0.06);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playKey() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.08);
    osc.frequency.setValueAtTime(880, now + 0.16);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playHurt() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playClear() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.18);
    });
  }
}

const sfx = new SoundManager();

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [totalGems, setTotalGems] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Watch document data-theme attribute
  useEffect(() => {
    const updateTheme = () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') setTheme('dark');
      else if (current === 'light') setTheme('light');
      else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.muted = next;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentLvl = levelIndex;

    // Keys state
    const keys = {
      left: false,
      right: false,
      up: false,
    };

    let jumpBuffer = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Never intercept when user is typing in form inputs, textareas, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input, textarea, [contenteditable="true"]'))
      ) {
        return;
      }

      // Check if user is focusing the game canvas container
      const isFocused =
        document.activeElement === canvas ||
        canvas?.parentElement?.contains(document.activeElement);

      const isGameKey =
        e.code === 'ArrowLeft' ||
        e.code === 'KeyA' ||
        e.code === 'ArrowRight' ||
        e.code === 'KeyD' ||
        e.code === 'ArrowUp' ||
        e.code === 'KeyW' ||
        e.code === 'Space';

      if (isGameKey && isFocused) {
        // Only prevent default scrolling when canvas is intentionally focused
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (!keys.up) {
          jumpBuffer = 1;
        }
        keys.up = true;
      }
      if (e.code === 'KeyM' && isFocused) {
        toggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    // Level state
    let mapData: string[][] = [];
    let spawnX = 1;
    let spawnY = 34;
    let playerX = 1;
    let playerY = 34;
    let playerVx = 0;
    let playerVy = 0;
    let playerFace = 1; // 1 = right, -1 = left
    let onGround = false;
    let canDouble = true;
    let coyote = 0;
    let levelGems = 0;
    let collectedInLevel = 0;
    let holdingKey = false;

    // Camera
    const camera = {
      x: 0,
      y: 0,
      ready: false,
    };

    const particles: Particle[] = [];
    const popups: ScorePopup[] = [];

    const loadLevel = (idx: number) => {
      currentLvl = ((idx % LEVELS.length) + LEVELS.length) % LEVELS.length;
      setLevelIndex(currentLvl);
      const lvl = LEVELS[currentLvl];

      mapData = lvl.grid.map((r) => r.split(''));
      holdingKey = false;
      setHasKey(false);
      collectedInLevel = 0;
      setGemsCollected(0);

      // Count gems and find spawn
      let gemsCount = 0;
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const char = mapData[r][c];
          if (char === 'P') {
            spawnX = c;
            spawnY = r;
            mapData[r][c] = '.';
          } else if (char === 'o') {
            gemsCount++;
          }
        }
      }

      levelGems = gemsCount;
      setTotalGems(gemsCount);

      playerX = spawnX;
      playerY = spawnY;
      playerVx = 0;
      playerVy = 0;
      onGround = false;
      canDouble = true;
      coyote = 0;
      jumpBuffer = 0;
      camera.ready = false;
    };

    loadLevel(levelIndex);

    const spawnDeathParticles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.05 + Math.random() * 0.18;
        particles.push({
          x: x + PLAYER_WIDTH / 2,
          y: y + PLAYER_HEIGHT / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: 2 + Math.random() * 2,
          life: 0,
          maxLife: 20 + Math.floor(Math.random() * 20),
        });
      }
    };

    const spawnLandingDust = (x: number, y: number, color: string) => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: x + Math.random() * PLAYER_WIDTH,
          y: y + PLAYER_HEIGHT,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -Math.random() * 0.06,
          color,
          size: 2,
          life: 0,
          maxLife: 15,
        });
      }
    };

    // AABB check against solid '#'
    const isSolid = (col: number, row: number) => {
      if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return true;
      const t = mapData[row]?.[col];
      return t === '#';
    };

    const checkOverlapTile = (
      px: number,
      py: number,
      pw: number,
      ph: number,
      targetChar: string
    ): { c: number; r: number } | null => {
      const minC = Math.max(0, Math.floor(px));
      const maxC = Math.min(GRID_COLS - 1, Math.floor(px + pw - 0.001));
      const minR = Math.max(0, Math.floor(py));
      const maxR = Math.min(GRID_ROWS - 1, Math.floor(py + ph - 0.001));

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          if (mapData[r]?.[c] === targetChar) {
            return { c, r };
          }
        }
      }
      return null;
    };

    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      animId = requestAnimationFrame(loop);

      // Frame time cap
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      if (dt > 100) return;

      const palette = getEffectivePalette(theme, LEVELS[currentLvl]?.tint);

      // 1. Horizontal movement
      playerVx = 0;
      if (keys.left && !keys.right) {
        playerVx = -WALK_SPEED;
        playerFace = -1;
      } else if (keys.right && !keys.left) {
        playerVx = WALK_SPEED;
        playerFace = 1;
      }

      // 2. Coyote time update
      if (onGround) {
        coyote = COYOTE_TICKS;
      } else {
        if (coyote > 0) coyote--;
      }

      // Check wall touching for wall-slide / wall-jump
      // Left wall: x-0.05, Right wall: x+w+0.05
      let touchingWall = 0; // -1 left, 1 right
      const checkRMin = Math.max(0, Math.floor(playerY + 0.1));
      const checkRMax = Math.min(GRID_ROWS - 1, Math.floor(playerY + PLAYER_HEIGHT - 0.1));

      const leftCol = Math.floor(playerX - 0.06);
      const rightCol = Math.floor(playerX + PLAYER_WIDTH + 0.06);

      for (let r = checkRMin; r <= checkRMax; r++) {
        if (isSolid(leftCol, r)) touchingWall = -1;
        if (isSolid(rightCol, r)) touchingWall = 1;
      }

      // 3. Jump logic (Order from production bt())
      if (jumpBuffer > 0) {
        if (onGround || coyote > 0) {
          playerVy = JUMP_IMPULSE;
          canDouble = true;
          coyote = 0;
          sfx.playJump();
          jumpBuffer = 0;
        } else if (touchingWall !== 0) {
          playerVy = JUMP_IMPULSE;
          playerVx = -touchingWall * WALL_KICK_IMPULSE;
          playerFace = -touchingWall;
          canDouble = true;
          sfx.playJump();
          jumpBuffer = 0;
        } else if (canDouble) {
          playerVy = DOUBLE_JUMP_IMPULSE;
          canDouble = false;
          sfx.playDoubleJump();
          jumpBuffer = 0;
        } else {
          jumpBuffer--;
        }
      }

      // 4. Gravity & Wall-slide
      playerVy += GRAVITY;
      if (playerVy > TERMINAL_FALL) playerVy = TERMINAL_FALL;
      if (touchingWall !== 0 && !onGround && playerVy > WALL_SLIDE_MAX) {
        playerVy = WALL_SLIDE_MAX;
      }

      // 5. Substep integration
      const maxVel = Math.max(Math.abs(playerVx), Math.abs(playerVy));
      const substeps = Math.max(1, Math.ceil(maxVel / SUBSTEP_THRESHOLD));
      const stepVx = playerVx / substeps;
      const stepVy = playerVy / substeps;

      let prevVy = playerVy;
      onGround = false;

      for (let s = 0; s < substeps; s++) {
        // Horizontal step
        const nextX = playerX + stepVx;
        const testMinY = Math.max(0, Math.floor(playerY + 0.01));
        const testMaxY = Math.min(GRID_ROWS - 1, Math.floor(playerY + PLAYER_HEIGHT - 0.01));

        if (stepVx > 0) {
          const rightEdge = nextX + PLAYER_WIDTH;
          const col = Math.floor(rightEdge);
          let collided = false;
          for (let r = testMinY; r <= testMaxY; r++) {
            if (isSolid(col, r)) {
              collided = true;
              break;
            }
          }
          if (collided) {
            playerX = col - PLAYER_WIDTH;
            playerVx = 0;
          } else {
            playerX = nextX;
          }
        } else if (stepVx < 0) {
          const col = Math.floor(nextX);
          let collided = false;
          for (let r = testMinY; r <= testMaxY; r++) {
            if (isSolid(col, r)) {
              collided = true;
              break;
            }
          }
          if (collided) {
            playerX = col + 1;
            playerVx = 0;
          } else {
            playerX = nextX;
          }
        }

        // Vertical step
        const nextY = playerY + stepVy;
        const testMinX = Math.max(0, Math.floor(playerX + 0.01));
        const testMaxX = Math.min(GRID_COLS - 1, Math.floor(playerX + PLAYER_WIDTH - 0.01));

        if (stepVy > 0) {
          const bottomEdge = nextY + PLAYER_HEIGHT;
          const row = Math.floor(bottomEdge);
          let collided = false;
          for (let c = testMinX; c <= testMaxX; c++) {
            if (isSolid(c, row)) {
              collided = true;
              break;
            }
          }
          if (collided) {
            playerY = row - PLAYER_HEIGHT;
            onGround = true;
            canDouble = true;
            if (prevVy > 0.35) {
              spawnLandingDust(playerX, playerY, palette.blockEdge);
            }
            playerVy = 0;
          } else {
            playerY = nextY;
          }
        } else if (stepVy < 0) {
          const row = Math.floor(nextY);
          let collided = false;
          for (let c = testMinX; c <= testMaxX; c++) {
            if (isSolid(c, row)) {
              collided = true;
              break;
            }
          }
          if (collided) {
            playerY = row + 1;
            playerVy = 0;
          } else {
            playerY = nextY;
          }
        }
      }

      // Check Spikes '^'
      const spikeHit = checkOverlapTile(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, '^');
      if (spikeHit) {
        sfx.playHurt();
        spawnDeathParticles(playerX, playerY, palette.player);
        playerX = spawnX;
        playerY = spawnY;
        playerVx = 0;
        playerVy = 0;
        onGround = false;
        canDouble = true;
        coyote = 0;
        camera.ready = false;
      }

      // Check Gems 'o'
      const gemHit = checkOverlapTile(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, 'o');
      if (gemHit) {
        mapData[gemHit.r][gemHit.c] = '.';
        collectedInLevel++;
        setGemsCollected(collectedInLevel);
        sfx.playGem();
        popups.push({
          x: gemHit.c + 0.5,
          y: gemHit.r,
          text: '+50',
          life: 0,
          maxLife: 30,
        });
      }

      // Check Key 'K'
      const keyHit = checkOverlapTile(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, 'K');
      if (keyHit) {
        mapData[keyHit.r][keyHit.c] = '.';
        holdingKey = true;
        setHasKey(true);
        sfx.playKey();
      }

      // Check Door 'D'
      const doorHit = checkOverlapTile(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, 'D');
      if (doorHit && holdingKey) {
        sfx.playClear();
        loadLevel(currentLvl + 1);
      }

      // Update camera lerp
      const targetCamX = playerX + PLAYER_WIDTH / 2;
      const targetCamY = playerY + PLAYER_HEIGHT / 2;
      if (!camera.ready) {
        camera.x = targetCamX;
        camera.y = targetCamY;
        camera.ready = true;
      } else {
        camera.x += (targetCamX - camera.x) * 0.12;
        camera.y += (targetCamY - camera.y) * 0.12;
      }

      // 6. Render
      const w = canvas.width;
      const h = canvas.height;

      // Fill canvas background
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, w, h);

      // Tile size in pixels based on canvas width
      const tileSize = w / GRID_COLS;
      const viewOffsetC = 0;
      const viewOffsetR = 0;

      // Draw paper dotted grid
      ctx.fillStyle = palette.grid;
      const dotSpacing = 8;
      for (let px = 0; px < w; px += dotSpacing) {
        for (let py = 0; py < h; py += dotSpacing) {
          ctx.fillRect(px, py, 1, 1);
        }
      }

      // Draw Tiles
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const char = mapData[r]?.[c];
          if (!char || char === '.') continue;

          const tx = c * tileSize;
          const ty = r * tileSize;

          if (char === '#') {
            // 4-shade block based on coordinate hash
            const shadeIdx = (c * 7 + r * 13) % 4;
            ctx.fillStyle = palette.blocks[shadeIdx];
            ctx.fillRect(tx, ty, tileSize, tileSize);

            // Block top highlight
            ctx.fillStyle = palette.blockTop;
            ctx.fillRect(tx, ty, tileSize, 1.5);

            // Block dark edge
            ctx.strokeStyle = palette.blockEdge;
            ctx.lineWidth = 0.75;
            ctx.strokeRect(tx, ty, tileSize, tileSize);

            // Diagonal hatch
            ctx.fillStyle = palette.hatch;
            ctx.beginPath();
            ctx.moveTo(tx, ty + tileSize);
            ctx.lineTo(tx + tileSize, ty);
            ctx.lineTo(tx + tileSize, ty + 2);
            ctx.lineTo(tx + 2, ty + tileSize);
            ctx.closePath();
            ctx.fill();
          } else if (char === '^') {
            // Spikes: sharp triangle
            ctx.fillStyle = palette.spike;
            ctx.beginPath();
            ctx.moveTo(tx, ty + tileSize);
            ctx.lineTo(tx + tileSize / 2, ty + 2);
            ctx.lineTo(tx + tileSize, ty + tileSize);
            ctx.closePath();
            ctx.fill();
          } else if (char === 'o') {
            // Gem: small circle with 1px idle bob
            const bob = Math.sin(timestamp * 0.005 + c * 2) * 1.5;
            ctx.fillStyle = palette.gem;
            ctx.beginPath();
            ctx.arc(tx + tileSize / 2, ty + tileSize / 2 + bob, tileSize * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = palette.blockEdge;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (char === 'K') {
            // Key
            ctx.fillStyle = palette.key;
            ctx.fillRect(tx + tileSize * 0.3, ty + tileSize * 0.2, tileSize * 0.4, tileSize * 0.6);
            ctx.strokeStyle = palette.blockEdge;
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + tileSize * 0.3, ty + tileSize * 0.2, tileSize * 0.4, tileSize * 0.6);
          } else if (char === 'D') {
            // Door
            ctx.fillStyle = holdingKey ? palette.doorOpen : palette.doorLocked;
            ctx.fillRect(tx + tileSize * 0.15, ty + tileSize * 0.1, tileSize * 0.7, tileSize * 0.9);
            ctx.strokeStyle = palette.blockEdge;
            ctx.lineWidth = 1;
            ctx.strokeRect(tx + tileSize * 0.15, ty + tileSize * 0.1, tileSize * 0.7, tileSize * 0.9);
          }
        }
      }

      // Draw Player: rounded rect 0.72 x 0.9 tiles
      const pPx = playerX * tileSize;
      const pPy = playerY * tileSize;
      const pPw = PLAYER_WIDTH * tileSize;
      const pPh = PLAYER_HEIGHT * tileSize;

      ctx.fillStyle = palette.player;
      const rad = 2;
      ctx.beginPath();
      ctx.roundRect(pPx, pPy, pPw, pPh, rad);
      ctx.fill();

      // Eye pixel facing direction
      ctx.fillStyle = palette.playerEye;
      const eyeX = playerFace === 1 ? pPx + pPw - 4 : pPx + 2;
      const eyeY = pPy + 4;
      ctx.fillRect(eyeX, eyeY, 2.5, 2.5);

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x * tileSize, p.y * tileSize, p.size, p.size);
      }

      // Draw Score Popups ("+50")
      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.y -= 0.02;
        pop.life++;
        if (pop.life >= pop.maxLife) {
          popups.splice(i, 1);
          continue;
        }
        const alpha = 1 - pop.life / pop.maxLife;
        ctx.fillStyle = `rgba(232, 100, 44, ${alpha})`;
        ctx.font = 'bold 12px "Pixelify Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x * tileSize, pop.y * tileSize);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [levelIndex, isMuted, theme]);

  const currentLevelDef = LEVELS[levelIndex] || LEVELS[0];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Canvas Wrapper */}
      <div className="relative w-full border border-dotted border-[var(--st)] bg-[var(--paper)] shadow-xs">
        {/* HUD overlay: Pixelify Sans 600 */}
        <div className="absolute top-2 inset-x-3 flex items-center justify-between font-pixel text-xs font-semibold text-[var(--tx)] z-10 pointer-events-auto">
          <div className="flex items-center gap-2 bg-[var(--sf)]/80 px-2 py-0.5 border border-dotted border-[var(--st-secondary)]">
            <span>Lv {levelIndex + 1}</span>
            <span>·</span>
            <span>{currentLevelDef.name}</span>
          </div>

          <div className="flex items-center gap-3 bg-[var(--sf)]/80 px-2 py-0.5 border border-dotted border-[var(--st-secondary)]">
            <span>
              ◆ {gemsCollected}/{totalGems}
            </span>

            {hasKey && (
              <span className="px-1 bg-[var(--accent-orange)] text-white text-[10px] rounded-[1px]">
                KEY
              </span>
            )}

            <button
              type="button"
              onClick={toggleMute}
              className="text-xs hover:text-[var(--accent-orange)] cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* 20 cols x 36 rows aspect ratio canvas */}
        <canvas
          ref={canvasRef}
          tabIndex={0}
          width={400}
          height={720}
          className="w-full h-auto block aspect-[20/36] outline-none cursor-pointer focus:ring-2 focus:ring-[var(--accent-orange)]/40 transition-all"
        />
      </div>

      {/* Control Hint under canvas */}
      <div className="mt-2 text-center text-[11px] font-mono text-[var(--tx-tertiary)] tracking-wide">
        Click game to focus · Arrow keys / WASD to move · ↑ jumps · M mutes
      </div>
    </div>
  );
}
