import handsJson from '@data/matrix/hands.json';
import { parseColor, type Rgb } from './accent';
import { GLYPHS, createRng } from './glyphs';
import { handsGap } from './hands-layout';
import { getMotion } from './motion';

// The glyph hands of the pill scene (A-06). A grid of density levels made by scripts/build-hands.mjs (a hand lit
// and traced with rays) is drawn with glyphs: the density of the glyph and its opacity show the light, the cells
// of the capsule are painted blue (right hand) and red (left hand, as in the film, the mirror image).
//   - when the scene opens the hands assemble out of falling glyphs, like the wordmark in the footer;
//   - now and then a single glyph flickers;
//   - the whole scene leans a little after the cursor (a mouse only).
// The hands take the colour of the text of the page, so on a light page they are dark on white.
// With reduced motion or pause the hands are a still picture: no assembly, no flicker, no lean.
const POOLS: readonly (readonly string[])[] = [[], [...'.:·'], [...'+*<>-='], [...'{}/#$;'], GLYPHS];
const ALPHA = [0, 0.32, 0.55, 0.78, 1];
const ALPHA_ON_LIGHT = [0, 0.42, 0.66, 0.86, 1]; // dark glyphs on white need a little more
const PILL: Record<'blue' | 'red', Rgb> = { blue: [62, 123, 250], red: [229, 72, 77] }; // until the tokens are read
const FONT = 'ui-monospace, Consolas, monospace';

const ASSEMBLE_COLUMN_DELAY = 700; // ms, by column
const ASSEMBLE_ROW_DELAY = 150; // ms, by row
const ASSEMBLE_MIN = 500; // ms a glyph needs to land
const ASSEMBLE_SPREAD = 400;
const FLIP_MS = 60; // while falling, a glyph changes this often
const FLICKER_EVERY_MS = 110;
const FLICKER_MS = 140;
const FLICKERS = 4; // glyphs flickering at a time
const TILT_DEG = 6;

type Side = 'blue' | 'red';
interface Cell {
  x: number; // column in the whole scene
  y: number;
  level: number;
  side: Side | null; // the capsule
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

// The pill glyphs are lighter than the capsule on a dark page and darker on a light one.
const toward = (rgb: readonly number[], target: number, amount: number) =>
  rgb.map(value => Math.round(value + (target - value) * amount));

export const createHands = (root: HTMLElement) => {
  const canvas = root.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return undefined;
  const ctx = context;

  const motion = getMotion();
  const base = document.createElement('canvas');
  const baseCtx = base.getContext('2d')!;
  let ink: Rgb = [255, 255, 255]; // the colour of the hands: the text colour of the page, so they follow the theme
  let light = false; // a light page
  let cells: Cell[] = [];
  let rows = 0;
  let cols = 0;
  let cellW = 0;
  let cellH = 0;
  let assembleStart = -1; // ms; -1 when it is not playing
  let flickers: { cell: Cell; glyph: string; until: number }[] = [];
  let lastFlicker = 0;
  const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };

  const build = (grid: Grid) => {
    const gap = handsGap(grid.cols);
    cols = grid.cols * 2 + gap;
    rows = grid.rows;
    const rng = createRng(11);
    cells = [];
    grid.levels.forEach((line, y) =>
      [...line].forEach((char, x) => {
        const digit = Number(char);
        if (digit === 0) return;
        const pill = digit >= 6;
        const level = pill ? digit - 5 : digit;
        const pick = () => POOLS[level][Math.floor(rng() * POOLS[level].length)];
        cells.push({ x, y, level, side: pill ? 'red' : null, glyph: pick() });
        cells.push({ x: grid.cols + gap + (grid.cols - 1 - x), y, level, side: pill ? 'blue' : null, glyph: pick() });
      })
    );
  };

  const paint = (target: CanvasRenderingContext2D, cell: Cell, offset = 0, alpha = 1, glyph = cell.glyph) => {
    const px = cell.x * cellW;
    const py = (cell.y - offset) * cellH;
    if (cell.side) {
      const color = PILL[cell.side];
      target.fillStyle = `rgba(${color.join(',')},${0.2 + cell.level * 0.07})`;
      target.fillRect(px, py, cellW, cellH);
      target.fillStyle = `rgba(${toward(color, light ? 0 : 255, light ? 0.3 : 0.35).join(',')},${alpha})`;
    } else {
      target.fillStyle = `rgba(${ink.join(',')},${(light ? ALPHA_ON_LIGHT : ALPHA)[cell.level] * alpha})`;
    }
    target.fillText(glyph, px + cellW / 2, py + cellH / 2);
  };

  const setFont = (target: CanvasRenderingContext2D) => {
    target.font = `${cellH}px ${FONT}`;
    target.textAlign = 'center';
    target.textBaseline = 'middle';
  };

  const drawBase = () => {
    baseCtx.clearRect(0, 0, base.width, base.height);
    setFont(baseCtx);
    for (const cell of cells) paint(baseCtx, cell);
  };

  const present = () => {
    // Pixel for pixel: the canvas has the scale of the screen set for drawing glyphs, the picture must not get it too.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    ctx.restore();
  };

  const readTheme = () => {
    const style = getComputedStyle(root);
    ink = parseColor(style.getPropertyValue('--text')) ?? [255, 255, 255];
    const background = parseColor(style.getPropertyValue('--background')) ?? [0, 0, 0];
    light = (background[0] + background[1] + background[2]) / 3 > 128;
    PILL.blue = parseColor(style.getPropertyValue('--pill-blue')) ?? PILL.blue;
    PILL.red = parseColor(style.getPropertyValue('--pill-red')) ?? PILL.red;
  };

  const layout = () => {
    readTheme();
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return false;
    const grid = (rect.width < 520 ? handsJson.mobile : handsJson.desktop) as Grid;
    build(grid);
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
      const pool = POOLS[cell.level];
      const falling = progress < 1;
      const glyph = falling ? pool[Math.floor(t / FLIP_MS + hash(cell.x, cell.y, 6) * 10) % pool.length] : cell.glyph;
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

  const applyTilt = (dt: number) => {
    const k = Math.min(1, dt * 6);
    tilt.x += (tilt.targetX - tilt.x) * k;
    tilt.y += (tilt.targetY - tilt.y) * k;
    const still = Math.abs(tilt.x) < 0.01 && Math.abs(tilt.y) < 0.01 && tilt.targetX === 0 && tilt.targetY === 0;
    root.style.transform = still ? '' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
  };

  return {
    // The scene opens: the hands assemble, or just stand there when nothing may move.
    open() {
      if (!layout()) return;
      flickers = [];
      if (motion.allowed) assembleStart = performance.now();
      else present();
    },
    // The theme was switched while the scene is open: the same hands in the colours of the new theme.
    retheme() {
      if (cells.length === 0) return;
      readTheme();
      drawBase();
      if (assembleStart < 0) present();
    },
    resize() {
      const playing = assembleStart >= 0;
      if (!layout()) return;
      if (!playing) present();
    },
    tick(dt: number, now: number) {
      if (!motion.allowed || cells.length === 0) return;
      if (assembleStart >= 0) assemble(now);
      else flicker(now);
      applyTilt(dt);
    },
    // A mouse leans the scene; the touch and the keyboard do not.
    pointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      tilt.targetY = (event.clientX / window.innerWidth - 0.5) * 2 * TILT_DEG;
      tilt.targetX = -(event.clientY / window.innerHeight - 0.5) * 2 * TILT_DEG;
    },
    close() {
      assembleStart = -1;
      flickers = [];
      Object.assign(tilt, { x: 0, y: 0, targetX: 0, targetY: 0 });
      root.style.transform = '';
    },
  };
};
