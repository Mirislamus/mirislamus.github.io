import handsJson from '@/data/matrix/hands.json';
import { at, pick } from '@/utils/list';

import { parseColor, type Rgb } from './accent';
import { GLYPHS, createRng } from './glyphs';
import { handsGap } from './hands-layout';
import { getMotion } from './motion';

const POOLS: readonly (readonly string[])[] = [[], [...'.:·'], [...'+*<>-='], [...'{}/#$;'], GLYPHS];
const ALPHA = [0, 0.32, 0.55, 0.78, 1];
const ALPHA_ON_LIGHT = [0, 0.42, 0.66, 0.86, 1];
const PILL: Record<'blue' | 'red', Rgb> = { blue: [62, 123, 250], red: [229, 72, 77] };
const FONT = 'ui-monospace, Consolas, monospace';

const ASSEMBLE_COLUMN_DELAY = 700;
const ASSEMBLE_ROW_DELAY = 150;
const ASSEMBLE_MIN = 500;
const ASSEMBLE_SPREAD = 400;
const FLIP_MS = 60;
const FLICKER_EVERY_MS = 110;
const FLICKER_MS = 140;
const FLICKERS = 4;
const TILT_DEG = 6;

type Side = 'blue' | 'red';
interface Cell {
  x: number;
  y: number;
  level: number;
  side: Side | null;
  glyph: string;
}
interface Grid {
  cols: number;
  rows: number;
  levels: string[];
}

const hash = (x: number, y: number, salt: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const toward = (rgb: readonly number[], target: number, amount: number) =>
  rgb.map(value => Math.round(value + (target - value) * amount));

export const createHands = (root: HTMLElement) => {
  const canvas = root.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return undefined;
  const ctx = context;

  const motion = getMotion();
  const base = document.createElement('canvas');
  const baseCtx = base.getContext('2d');
  if (!baseCtx) throw new Error('2D canvas is not available');
  let ink: Rgb = [255, 255, 255];
  let light = false;
  let cells: Cell[] = [];
  let rows = 0;
  let cols = 0;
  let cellW = 0;
  let cellH = 0;
  let assembleStart = -1;
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
        const glyphFor = () => pick(at(POOLS, level), rng());
        cells.push({ x, y, level, side: pill ? 'red' : null, glyph: glyphFor() });
        cells.push({
          x: grid.cols + gap + (grid.cols - 1 - x),
          y,
          level,
          side: pill ? 'blue' : null,
          glyph: glyphFor(),
        });
      }),
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
      target.fillStyle = `rgba(${ink.join(',')},${at(light ? ALPHA_ON_LIGHT : ALPHA, cell.level) * alpha})`;
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
    const grid: Grid = rect.width < 520 ? handsJson.mobile : handsJson.desktop;
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
      const pool = at(POOLS, cell.level);
      const falling = progress < 1;
      const glyph = falling
        ? at(pool, Math.floor(t / FLIP_MS + hash(cell.x, cell.y, 6) * 10) % pool.length)
        : cell.glyph;
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
        const cell = pick(cells, Math.random());
        if (cell.level < 2) continue;
        flickers.push({ cell, glyph: pick(GLYPHS, Math.random()), until: now + FLICKER_MS });
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
    open() {
      if (!layout()) return;
      flickers = [];
      if (motion.allowed) assembleStart = performance.now();
      else present();
    },
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
