import maskJson from '@data/matrix/mask.json';
import { GLYPHS, createRng } from '../matrix/glyphs';
import { getMotion } from '../matrix/motion';

// The glyph mask of the netrunner (J-07). A grid made by scripts/build-mask.mjs is drawn with glyphs, like the rain: the
// density of the glyph and its opacity show the shape. The suit and the respirator are pale, the visor is cyan,
// the cables are red.
//   - when the scene opens the mask assembles out of falling glyphs, like the hands of the pills and the wordmark;
//   - now and then a few glyphs flicker, and for a moment a band of rows slips sideways (a glitch);
//   - with reduced motion or a pause it is a still picture.
// The scene is always dark, so the colours are fixed.
type Layer = 'pale' | 'cyan' | 'red';
const COLORS: Record<Layer, readonly [number, number, number]> = {
  pale: [244, 238, 242],
  cyan: [0, 229, 209],
  red: [255, 46, 99], // the cables
};
const POOLS: readonly (readonly string[])[] = [[], [...'.:·'], [...'+*<>-='], [...'{}/#$;'], GLYPHS];
// The suit and the respirator are drawn with dense, similar-looking glyphs so that their shape reads; the visor and the
// cables get the rain-like mix.
const PALE_POOLS: readonly (readonly string[])[] = [[], [...'.:·'], [...'+=*x'], [...'#%$&'], [...'@8#%&$']];
const ALPHA = [0, 0.5, 0.74, 0.9, 1];
const FONT = 'ui-monospace, Consolas, monospace';

const ASSEMBLE_COLUMN_DELAY = 800; // ms, by column
const ASSEMBLE_ROW_DELAY = 200; // ms, by row
const ASSEMBLE_MIN = 500; // ms a glyph needs to land
const ASSEMBLE_SPREAD = 400;
const FLIP_MS = 60; // while falling, a glyph changes this often
const FLICKER_EVERY_MS = 110;
const FLICKER_MS = 140;
const FLICKERS = 5; // glyphs flickering at a time
const GLITCH_EVERY_MS = 2600; // a band of rows slips sideways this often…
const GLITCH_MS = 170; // …for this long

interface Cell {
  x: number;
  y: number;
  level: number;
  layer: Layer;
  glyph: string;
}
interface Grid {
  cols: number;
  rows: number;
  levels: string[];
}

// A stable pseudo-random number in [0, 1) for a cell.
const hash = (x: number, y: number, salt: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const poolOf = (layer: Layer, level: number) => (layer === 'pale' ? PALE_POOLS : POOLS)[level];

const decode = (char: string): { level: number; layer: Layer } | null => {
  if (char === '0') return null;
  if (char >= 'a' && char <= 'd') return { level: char.charCodeAt(0) - 96, layer: 'red' };
  const digit = Number(char);
  return digit >= 6 ? { level: digit - 5, layer: 'cyan' } : { level: digit, layer: 'pale' };
};

export const createMask = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) return undefined;
  const ctx = context;

  const motion = getMotion();
  const base = document.createElement('canvas');
  const baseCtx = base.getContext('2d')!;
  let cells: Cell[] = [];
  let rows = 0;
  let cols = 0;
  let cellW = 0;
  let cellH = 0;
  let assembleStart = -1; // ms; -1 when it is not playing
  let flickers: { cell: Cell; glyph: string; until: number }[] = [];
  let lastFlicker = 0;
  let lastGlitch = 0;
  let glitch: { from: number; to: number; shift: number; until: number } | null = null;

  const build = (grid: Grid) => {
    cols = grid.cols;
    rows = grid.rows;
    const rng = createRng(77);
    cells = [];
    grid.levels.forEach((line, y) =>
      [...line].forEach((char, x) => {
        const cell = decode(char);
        if (!cell) return;
        cells.push({
          x,
          y,
          ...cell,
          glyph: poolOf(cell.layer, cell.level)[Math.floor(rng() * poolOf(cell.layer, cell.level).length)],
        });
      })
    );
  };

  const paint = (target: CanvasRenderingContext2D, cell: Cell, offset = 0, alpha = 1, glyph = cell.glyph) => {
    target.fillStyle = `rgba(${COLORS[cell.layer].join(',')},${ALPHA[cell.level] * alpha})`;
    target.fillText(glyph, cell.x * cellW + cellW / 2, (cell.y - offset) * cellH + cellH / 2);
  };

  const setFont = (target: CanvasRenderingContext2D) => {
    target.font = `${cellH * 0.95}px ${FONT}`;
    target.textAlign = 'center';
    target.textBaseline = 'middle';
  };

  const drawBase = () => {
    baseCtx.clearRect(0, 0, base.width, base.height);
    setFont(baseCtx);
    for (const cell of cells) paint(baseCtx, cell);
  };

  // The picture as it stands: the still one, with the band of the glitch moved when there is one.
  const present = () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    if (glitch) {
      const scale = base.height / rows;
      const top = glitch.from * scale;
      const height = (glitch.to - glitch.from) * scale;
      const shift = glitch.shift * (base.width / cols);
      ctx.clearRect(0, top, canvas.width, height);
      ctx.drawImage(base, 0, top, base.width, height, shift, top, base.width, height);
    }
    ctx.restore();
  };

  const layout = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return false;
    build((rect.width < 340 ? maskJson.mobile : maskJson.desktop) as Grid);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const target of [canvas, base]) {
      target.width = Math.round(rect.width * dpr);
      target.height = Math.round(rect.height * dpr);
    }
    cellW = rect.width / cols;
    cellH = rect.height / rows;
    for (const target of [ctx, baseCtx]) target.setTransform(dpr, 0, 0, dpr, 0, 0);
    setFont(ctx);
    drawBase();
    return true;
  };

  const assemble = (now: number) => {
    const t = now - assembleStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFont(ctx);
    let done = true;

    for (const cell of cells) {
      const delay = hash(cell.x, 0, 2) * ASSEMBLE_COLUMN_DELAY + hash(0, cell.y, 3) * ASSEMBLE_ROW_DELAY;
      const duration = ASSEMBLE_MIN + hash(cell.x, cell.y, 4) * ASSEMBLE_SPREAD;
      const progress = Math.min(1, Math.max(0, (t - delay) / duration));
      if (progress < 1) done = false;
      if (progress === 0) continue;
      const offset = (3 + hash(cell.x, cell.y, 5) * 9) * (1 - progress) ** 4;
      const pool = poolOf(cell.layer, cell.level);
      const glyph =
        progress < 1 ? pool[Math.floor(t / FLIP_MS + hash(cell.x, cell.y, 6) * 10) % pool.length] : cell.glyph;
      paint(ctx, cell, offset, Math.min(1, progress * 3), glyph);
    }

    if (done) {
      assembleStart = -1;
      present();
    }
  };

  const flicker = (now: number) => {
    const before = flickers.length;
    flickers = flickers.filter(item => item.until > now);
    let changed = flickers.length !== before;

    if (glitch && glitch.until <= now) {
      glitch = null;
      changed = true;
    } else if (!glitch && now - lastGlitch >= GLITCH_EVERY_MS) {
      lastGlitch = now;
      const from = Math.floor(Math.random() * (rows - 8));
      glitch = {
        from,
        to: from + 3 + Math.floor(Math.random() * 5),
        shift: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3)),
        until: now + GLITCH_MS,
      };
      changed = true;
    }

    if (now - lastFlicker >= FLICKER_EVERY_MS) {
      lastFlicker = now;
      while (flickers.length < FLICKERS) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        if (cell.level < 2) continue;
        flickers.push({ cell, glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], until: now + FLICKER_MS });
        changed = true;
      }
    }
    if (!changed) return;

    present();
    setFont(ctx);
    for (const { cell, glyph } of flickers) {
      ctx.clearRect(cell.x * cellW, cell.y * cellH, cellW, cellH);
      paint(ctx, { ...cell, level: 4 }, 0, 1, glyph);
    }
  };

  return {
    // The scene shows the mask: it assembles, or just stands there when nothing may move.
    open() {
      if (!layout()) return;
      flickers = [];
      glitch = null;
      lastGlitch = performance.now();
      if (motion.allowed) assembleStart = performance.now();
      else present();
    },
    resize() {
      const playing = assembleStart >= 0;
      if (!layout()) return;
      if (!playing) present();
    },
    tick(_dt: number, now: number) {
      if (!motion.allowed || cells.length === 0) return;
      if (assembleStart >= 0) assemble(now);
      else flicker(now);
    },
    close() {
      assembleStart = -1;
      flickers = [];
      glitch = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
};
