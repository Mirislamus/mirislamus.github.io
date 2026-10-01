import { levelOfChar } from '@utils/wordmark';
import { watchColors, type MatrixColors, type Rgb } from './accent';
import { GLYPHS, createRng } from './glyphs';
import { getMotion } from './motion';
import { getTicker } from './ticker';

// The glyph wordmark (M-05): the name made of glyphs, drawn on a canvas over its text version.
// Once per page load it assembles itself out of falling glyphs; under the cursor (or a finger) the glyphs
// flash and flip, like on lukebaffait.fr. Without this chunk the text version (ASCII) stays visible.
const POOLS: readonly (readonly string[])[] = [
  [],
  [...'.:·'],
  [...'+*<>-='],
  [...'{}/#$;'],
  GLYPHS, // level 4: katakana, code, digits
];
const LEVEL_ALPHA = [0, 0.35, 0.55, 0.75, 0.9];

const ASSEMBLE_COLUMN_DELAY = 300; // ms, by column
const ASSEMBLE_ROW_DELAY = 80; // ms, by row
const ASSEMBLE_MIN = 600; // ms a glyph needs to land
const ASSEMBLE_SPREAD = 400;
const ASSEMBLE_FROM_MIN = 3; // rows above its place a glyph starts
const ASSEMBLE_FROM_SPREAD = 9;
const FLIP_MS = 60; // while falling, a glyph changes this often

const FLASH_RADIUS_PX = 40;
const FLASH_SHORT_MS = 100;
const FLASH_LONG_MS = 200;
const FONT = 'ui-monospace, Consolas, monospace';

// A stable pseudo-random number in [0, 1) for a cell, so every cell keeps its own timing and flash noise.
const hash = (x: number, y: number, salt: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const css = (rgb: Rgb, alpha = 1) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;

export const initWordmark = (root: HTMLElement) => {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas[data-wordmark-canvas]');
  const pres = [...root.querySelectorAll<HTMLPreElement>('pre[data-variant]')];
  const context = canvas?.getContext('2d');
  if (!canvas || !context || pres.length === 0 || root.hasAttribute('data-ready')) return;
  const ctx = context;

  const motion = getMotion();
  const ticker = getTicker();

  let colors: MatrixColors | undefined;
  let levels: number[][] = [];
  let glyphs: string[][] = [];
  let cols = 0;
  let rows = 0;
  let cellW = 0;
  let cellH = 0;
  let flashes = new Float64Array(0);
  let assembleStart = -1; // ms, -1 while it has not started
  let assembled = false;
  let waiting = false; // visible on the page but not yet scrolled into view enough to assemble
  let stop: (() => void) | undefined;

  // Reads the grid from the visible text version: its characters carry the density level.
  const readGrid = () => {
    const pre = pres.find(candidate => getComputedStyle(candidate).display !== 'none') ?? pres[0];
    const lines = (pre.textContent ?? '').split('\n').filter(line => line.trim() !== '');
    cols = Math.max(0, ...lines.map(line => line.length));
    levels = lines.map(line => Array.from({ length: cols }, (_, x) => levelOfChar(line[x] ?? ' ')));
    rows = levels.length;
    // The same seed every time, so a resize does not reshuffle the glyphs.
    const rng = createRng(7);
    glyphs = levels.map(row =>
      row.map(level => (level > 0 ? POOLS[level][Math.floor(rng() * POOLS[level].length)] : ''))
    );
    flashes = new Float64Array(cols * rows);
    return pre;
  };

  const measure = () => {
    const pre = readGrid();
    const rect = pre.getBoundingClientRect();
    if (!rect.width || !rect.height || !cols) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellW = rect.width / cols;
    cellH = rect.height / rows;
    return true;
  };

  const alphaOf = (level: number, x: number, y: number) => LEVEL_ALPHA[level] * (0.85 + 0.15 * hash(x, y, 1));

  const draw = (now: number) => {
    if (!colors) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${cellH}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const t = assembleStart < 0 ? 0 : now - assembleStart;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const level = levels[y][x];
        if (level === 0) continue;

        let glyph = glyphs[y][x];
        let alpha = alphaOf(level, x, y);
        let offset = 0; // rows above its place

        if (!assembled) {
          if (assembleStart < 0) continue; // nothing has fallen yet
          const delay = hash(x, 0, 2) * ASSEMBLE_COLUMN_DELAY + hash(0, y, 3) * ASSEMBLE_ROW_DELAY;
          const duration = ASSEMBLE_MIN + hash(x, y, 4) * ASSEMBLE_SPREAD;
          const progress = Math.min(1, Math.max(0, (t - delay) / duration));
          if (progress === 0) continue;
          offset = (ASSEMBLE_FROM_MIN + hash(x, y, 5) * ASSEMBLE_FROM_SPREAD) * (1 - progress) ** 4;
          alpha *= Math.min(1, progress * 3);
          if (progress < 1) glyph = POOLS[level][Math.floor(t / FLIP_MS + hash(x, y, 6) * 10) % POOLS[level].length];
        }

        const flashAge = now - flashes[y * cols + x];
        const flashing = flashes[y * cols + x] > 0 && flashAge < (hash(x, y, 7) > 0.5 ? FLASH_LONG_MS : FLASH_SHORT_MS);
        const px = x * cellW + cellW / 2;
        const py = (y - offset) * cellH + cellH / 2;

        if (flashing) {
          ctx.fillStyle = css(colors.accent);
          ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
          ctx.fillStyle = css(colors.background);
          // The "opposite" density: dense cells flash with light glyphs and the other way round.
          const pool = POOLS[5 - level];
          ctx.fillText(pool[Math.floor(Math.random() * pool.length)], px, py);
        } else {
          ctx.fillStyle = css(colors.accent, alpha);
          ctx.fillText(glyph, px, py);
        }
      }
    }
  };

  const stillFlashing = (now: number) => flashes.some(time => time > 0 && now - time < FLASH_LONG_MS);

  const frame = (_dt: number, now: number) => {
    draw(now);
    if (
      !assembled &&
      assembleStart >= 0 &&
      now - assembleStart > ASSEMBLE_COLUMN_DELAY + ASSEMBLE_ROW_DELAY + ASSEMBLE_MIN + ASSEMBLE_SPREAD
    ) {
      assembled = true;
    }
    if (assembled && !stillFlashing(now)) {
      stop?.();
      stop = undefined;
      draw(now);
    }
  };

  const run = () => {
    if (!stop) stop = ticker.subscribe(frame);
  };

  const startAssembling = () => {
    assembleStart = performance.now();
    waiting = false;
    run();
  };

  const showAtOnce = () => {
    assembled = true;
    draw(performance.now());
  };

  if (!measure()) return;
  root.setAttribute('data-ready', '');

  watchColors(next => {
    colors = next;
    if (assembled && !stop) draw(performance.now());
  });

  // Assemble once, when about a third of the wordmark is on screen; with no motion it just appears.
  if (motion.allowed) {
    waiting = true;
    new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting || !waiting) return;
        observer.disconnect();
        if (motion.allowed) startAssembling();
        else showAtOnce();
      },
      { threshold: 0.3 }
    ).observe(root);
  } else {
    showAtOnce();
  }

  const flash = (event: PointerEvent) => {
    if (motion.reduced || (!assembled && assembleStart < 0)) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (event.clientX - rect.left) / cellW;
    const cy = (event.clientY - rect.top) / cellH;
    const radius = FLASH_RADIUS_PX / cellW;
    const now = performance.now();
    for (
      let y = Math.max(0, Math.floor(cy - radius * 1.8));
      y <= Math.min(rows - 1, Math.ceil(cy + radius * 1.8));
      y++
    ) {
      for (
        let x = Math.max(0, Math.floor(cx - radius * 1.4));
        x <= Math.min(cols - 1, Math.ceil(cx + radius * 1.4));
        x++
      ) {
        const reach = radius * (1 + (hash(x, y, 8) - 0.5) * 0.8);
        const dx = x - cx;
        const dy = (y - cy) * (cellH / cellW);
        if (dx * dx + dy * dy < reach * reach) flashes[y * cols + x] = now;
      }
    }
    run();
  };

  root.addEventListener('pointermove', flash, { passive: true });
  root.addEventListener('pointerdown', flash, { passive: true });

  // A new size or the other variant (phone / desktop) means a new grid.
  const relayout = () => {
    if (!measure()) return;
    if (assembled) draw(performance.now());
  };
  new ResizeObserver(relayout).observe(root);
};
