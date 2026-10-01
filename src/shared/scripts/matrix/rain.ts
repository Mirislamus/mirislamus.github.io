import type { MatrixColors, Rgb } from './accent';
import { createRng, pickGlyph, type Rng } from './glyphs';

// The digital rain of the Hero (M-01). Smooth mode: a column slides down continuously and its glyphs
// are bound to the column, not to grid cells. The core is separate from the page so it can be reused
// (the 404 page) and so the still frame is the same every time (fixed seed).
export interface RainOptions {
  fontSize: number; // px, also the column pitch
  density: number; // share of active columns, 0..1
  speed: number; // cells per second, before the per-column multiplier
  brightness: number; // max opacity of a tail, 0..1
  seed: number;
  maxDpr: number;
  /** Radius of the cursor flashlight in px; 0 turns it off. */
  flashlight: number;
}

export const DESKTOP_RAIN: RainOptions = {
  fontSize: 18,
  density: 0.9,
  speed: 9,
  brightness: 0.3,
  seed: 42,
  maxDpr: 2,
  flashlight: 110,
};

export const TOUCH_RAIN: RainOptions = { ...DESKTOP_RAIN, density: 0.45, flashlight: 0 };

/** An ellipse (center and half-axes, in px) behind which the rain fades out so the text stays readable. */
export interface SafeZone {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface Rain {
  /** Advances the rain by `dt` seconds and draws it. */
  tick: (dt: number) => void;
  /** Draws one deterministic frame without any motion. */
  still: () => void;
  /** Re-measures the canvas; call when its box changes. */
  resize: () => void;
  setColors: (colors: MatrixColors) => void;
  setWords: (words: readonly string[]) => void;
  /** Cursor position in canvas px, or null when there is no cursor. */
  setPointer: (x: number | null, y?: number) => void;
  setSafeZone: (zone: SafeZone | null) => void;
  /** The intro downpour: every column starts above the screen and falls fast, then calms down to normal. */
  burst: () => void;
  readonly bursting: boolean;
  readonly drawn: boolean;
}

interface Column {
  x: number;
  /** Head position, in rows from the top of the canvas (fractional: the motion is smooth). */
  y: number;
  len: number;
  speed: number;
  active: boolean;
  chars: string[];
  word: string | null;
}

const TAIL_MIN = 10;
const TAIL_MAX = 26;
const CHARS_PER_COLUMN = 40;
const WORD_CHANCE = 0.06;
const WORD_SKIP = 2; // glyphs between the head and the last letter of a word
const ALPHA_STEPS = 32;
const FLASH_STEP = 0.12; // seconds between glyph flips under the flashlight
const MUTATIONS_PER_GLYPH_PER_SECOND = 0.9;
const BURST_SPEED = 3.2; // times the normal speed at the start of the downpour
const BURST_SECONDS = 0.9;

const EVAPORATE_ZONE = 0.3; // the lowest share of the canvas where the rain dissolves instead of being cut off

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// A stable pseudo-random number in [0, 1) for a pair of numbers.
const noise = (a: number, b: number) => {
  const value = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const createRain = (canvas: HTMLCanvasElement, options: RainOptions): Rain => {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is not available');
  const ctx = context;
  const rng: Rng = createRng(options.seed);

  let width = 0;
  let height = 0;
  let columns: Column[] = [];
  let words: readonly string[] = [];
  let colors: MatrixColors = { accent: [68, 255, 98], head: [225, 255, 230], background: [18, 18, 18] };
  let tailStyles: string[] = [];
  let headStyles: string[] = [];
  let zone: SafeZone | null = null;
  let pointerX = -1;
  let pointerY = -1;
  let flashTimer = 0;
  let flipNow = false;
  let isStill = false;
  let drawn = false;
  let burstLeft = 0; // seconds of the downpour that are left
  let field: string[][] = []; // static glyphs that show up under the flashlight, [column][row]

  const rows = () => Math.ceil(height / options.fontSize) + 2;

  const rgba = (rgb: Rgb, alpha: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;

  const buildStyles = () => {
    tailStyles = Array.from({ length: ALPHA_STEPS + 1 }, (_, i) => rgba(colors.accent, i / ALPHA_STEPS));
    headStyles = Array.from({ length: ALPHA_STEPS + 1 }, (_, i) => rgba(colors.head, i / ALPHA_STEPS));
  };
  const step = (alpha: number) => Math.round(clamp01(alpha) * ALPHA_STEPS);

  const restart = (column: Column, spread: boolean) => {
    const total = height / options.fontSize;
    column.len = TAIL_MIN + Math.floor(rng() * (TAIL_MAX - TAIL_MIN + 1));
    column.speed = 0.6 + rng() * 0.7;
    column.active = rng() < options.density;
    column.y = spread ? rng() * total * 1.2 - total * 0.2 : -rng() * 10;
    column.word = null;
    if (column.active && words.length > 0 && rng() < WORD_CHANCE) {
      column.word = words[Math.floor(rng() * words.length)];
      column.len = Math.max(column.len, column.word.length + WORD_SKIP + 3);
    }
  };

  const build = () => {
    const count = Math.ceil(width / options.fontSize);
    columns = Array.from({ length: count }, (_, i) => {
      const column: Column = {
        x: i * options.fontSize,
        y: 0,
        len: 0,
        speed: 1,
        active: false,
        chars: Array.from({ length: CHARS_PER_COLUMN }, () => pickGlyph(rng)),
        word: null,
      };
      restart(column, true);
      return column;
    });
    field = columns.map(() => Array.from({ length: rows() }, () => pickGlyph(rng)));
  };

  // 0.08 inside the safe zone, growing to 1 at its edge.
  const mask = (x: number, y: number) => {
    let factor = 1;
    if (zone) {
      const r = Math.hypot((x - zone.cx) / zone.rx, (y - zone.cy) / zone.ry);
      factor = Math.min(1, Math.max(0.08, (r - 0.35) / 0.75));
    }
    return factor;
  };

  // Under the flashlight the empty cells show a faint field of glyphs, so the cursor "reveals" the code.
  const drawField = (radius: number) => {
    const size = options.fontSize;
    const first = Math.max(0, Math.floor((pointerX - radius) / size));
    const last = Math.min(columns.length - 1, Math.floor((pointerX + radius) / size));
    const top = Math.max(0, Math.floor((pointerY - radius) / size));
    const bottom = Math.floor((pointerY + radius) / size);

    for (let i = first; i <= last; i++) {
      const column = columns[i];
      const cells = field[i];
      for (let row = top; row <= bottom; row++) {
        const distance = Math.hypot(column.x + size / 2 - pointerX, row * size + size / 2 - pointerY);
        if (distance > radius) continue;
        if (column.active && row <= column.y && row > column.y - column.len) continue; // the tail is drawn there
        if (!cells || row >= cells.length) continue;
        if (flipNow && rng() < 0.15) cells[row] = pickGlyph(rng);
        ctx.fillStyle = tailStyles[step((1 - distance / radius) * 0.22)];
        ctx.fillText(cells[row], column.x, row * size);
      }
    }
  };

  const draw = () => {
    const size = options.fontSize;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${size}px ui-monospace, Consolas, monospace`;
    ctx.textBaseline = 'top';

    const radius = options.flashlight;
    const hasPointer = radius > 0 && pointerX >= 0;

    for (const column of columns) {
      if (!column.active) continue;

      for (let k = 0; k <= column.len; k++) {
        let y = (column.y - k) * size;
        const t = k / column.len;
        if (y < -size || y > height) continue;

        // Near the bottom the glyphs evaporate: they thin out, drift up and fade, so the rain never ends in a cut.
        const evaporation = clamp01((y - height * (1 - EVAPORATE_ZONE)) / (height * EVAPORATE_ZONE));
        if (evaporation > 0) {
          const chance = noise(column.x, k);
          if (chance < evaporation * 0.85) continue;
          y -= evaporation * evaporation * size * 4 * (0.5 + noise(k, column.x));
        }

        let glyph = column.chars[k % column.chars.length];
        let isWord = false;
        if (column.word) {
          const index = column.word.length - 1 - (k - WORD_SKIP);
          if (k >= WORD_SKIP && index >= 0 && index < column.word.length) {
            glyph = column.word[index];
            isWord = glyph !== ' ';
          }
        }

        let light = 0;
        if (hasPointer) {
          light = Math.max(0, 1 - Math.hypot(column.x + size / 2 - pointerX, y + size / 2 - pointerY) / radius);
          if (light > 0.35 && flipNow && !isWord && rng() < 0.3) column.chars[k % column.chars.length] = pickGlyph(rng);
        }

        let alpha = ((1 - t) ** 1.6 * options.brightness * mask(column.x, y) + light * 0.65) * (1 - evaporation) ** 1.5;
        if (isWord) alpha = alpha * 1.8 + 0.15;

        ctx.fillStyle = k === 0 ? headStyles[step(alpha * 1.6 + 0.1)] : tailStyles[step(alpha)];
        ctx.fillText(glyph, column.x, y);
      }
    }

    if (hasPointer) drawField(radius);
    drawn = true;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr);
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (!nextWidth || !nextHeight) return;

    const widthChanged = nextWidth !== width;
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // A new height alone (for example the mobile address bar) must not restart the rain.
    if (widthChanged || columns.length === 0) build();
    else
      field = columns.map((_, i) =>
        field[i].concat(Array.from({ length: Math.max(0, rows() - field[i].length) }, () => pickGlyph(rng)))
      );
    if (isStill) draw();
  };

  // Falls linearly from BURST_SPEED to 1 during the downpour.
  const boost = () => 1 + (BURST_SPEED - 1) * (burstLeft / BURST_SECONDS);

  const advance = (column: Column, dt: number) => {
    column.y += column.speed * options.speed * boost() * dt;
    if (column.active) {
      // Every glyph of the tail changes about once a second.
      let budget = MUTATIONS_PER_GLYPH_PER_SECOND * column.len * dt;
      while (budget > 0) {
        if (budget >= 1 || rng() < budget) column.chars[Math.floor(rng() * column.chars.length)] = pickGlyph(rng);
        budget -= 1;
      }
    }
    // Inactive columns still "fall" unseen, so the density stays the same over time.
    if (column.y - column.len > height / options.fontSize) restart(column, false);
  };

  buildStyles();

  return {
    tick(dt) {
      isStill = false;
      flashTimer += dt;
      flipNow = flashTimer >= FLASH_STEP;
      if (flipNow) flashTimer = 0;
      for (const column of columns) advance(column, dt);
      burstLeft = Math.max(0, burstLeft - dt);
      draw();
    },
    still() {
      isStill = true;
      pointerX = -1;
      draw();
    },
    resize,
    setColors(next) {
      colors = next;
      buildStyles();
      if (isStill) draw();
    },
    setWords(next) {
      words = next;
    },
    setPointer(x, y = -1) {
      pointerX = x ?? -1;
      pointerY = x === null ? -1 : y;
    },
    setSafeZone(next) {
      zone = next;
      if (isStill) draw();
    },
    burst() {
      burstLeft = BURST_SECONDS;
      for (const column of columns) {
        restart(column, false);
        // Everyone joins the downpour; the columns the density leaves out fade as they fall out below.
        column.active = true;
      }
    },
    get bursting() {
      return burstLeft > 0;
    },
    get drawn() {
      return drawn;
    },
  };
};
