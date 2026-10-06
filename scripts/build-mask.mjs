// Draws the netrunner of the takeover (J-07, redrawn in J-09) into a grid of "density levels" for glyphs. Run by hand when
// the drawing changes: `bun run build:mask`. The result is committed (src/data/matrix/mask.json); nothing here runs at
// build time or in the browser. `bun run build:mask -- --preview` also prints the grid as text.
//
// The drawing is ours, a netrunner as a type, not any character: a head in a close-fitting cowl of the suit with its
// seams, a glowing visor across the eyes that wraps round the head, a respirator with vents and two filters over the
// lower face, jacks on the temples, cables running down from the head, and a collar on the shoulders. It is rasterised
// with sharp and every cell takes the share of it that is covered.
//
// Three layers, one character per cell:
//   0       empty
//   1 … 4   the suit and the respirator (pale), the density of the glyph grows with the number
//   6 … 9   the visor and the lights of the jacks (cyan)
//   a … d   the cables (red)
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../src/data/matrix/mask.json', import.meta.url));
const PREVIEW = process.argv.includes('--preview');

// Every grid has the same picture; a cell is taller than wide (a glyph is about 0.6 × 1), so the picture is drawn
// stretched, and it is un-stretched when it is shown.
const GRIDS = { desktop: { cols: 66, rows: 52 }, mobile: { cols: 44, rows: 34 } };
const SAMPLES = 4; // the raster has this many pixels per cell on a side
const VIEW = { width: 200, height: 260 }; // the whole figure, with a margin
const LINE = 1.7; // the lines are drawn thicker than they look: a thin line is only a few dots in a grid of glyphs

const svg = body =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const path = (d, { w = 3, fill = 'none' } = {}) =>
  `<path d="${d}" stroke-width="${w * LINE}" fill="${fill === 'none' ? 'none' : '#000'}" fill-opacity="${fill === 'none' ? 0 : fill}"/>`;

const circle = (x, y, r, fill = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" fill-opacity="${fill}" stroke="none"/>`;

// A shape and its mirror image across the middle of the figure (x = 100).
const MIDDLE = 100;
const mirrored = (d, options) =>
  path(d, options) + `<g transform="translate(${MIDDLE * 2} 0) scale(-1 1)">${path(d, options)}</g>`;
const mirroredCircle = (x, y, r, fill) => circle(x, y, r, fill) + circle(MIDDLE * 2 - x, y, r, fill);

// ── the cowl of the suit: a plane of its own, dimmer than the respirator ──
const COWL = 'M100 18C142 18 164 50 164 96C164 140 152 170 134 188H66C48 170 36 140 36 96C36 50 58 18 100 18Z';
const suit = svg(path(COWL, { fill: 1, w: 0 }));

// ── the bright parts: the edge of the cowl, its seams, the respirator, the filters, the collar ──
const RESPIRATOR = 'M68 124C80 117 120 117 132 124L138 150C130 170 70 170 62 150Z';
const bright = svg(
  [
    path(COWL, { w: 3 }),
    path('M100 20V74', { w: 2 }),
    mirrored('M66 34C56 54 52 74 54 92', { w: 2 }),
    mirrored('M44 116C50 140 58 160 70 176', { w: 2 }),
    path(RESPIRATOR, { fill: 1, w: 2.5 }),
    mirroredCircle(56, 152, 13),
    path('M78 188C78 202 74 214 64 224M122 188C122 202 126 214 136 224', { w: 2.5 }),
    path('M60 226C82 216 118 216 140 226', { w: 3 }),
    mirrored('M60 226C42 234 26 244 14 258', { w: 3 }),
  ].join('')
);

// ── what is carved out of the bright parts: the vents of the respirator and the rings of the filters ──
const carve = svg(
  [
    path('M84 134H116M80 143H120M84 152H116', { w: 2.2 }),
    mirrored('M56 152m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', { w: 1.8 }),
    path('M100 166V178', { w: 1.6 }),
  ].join('')
);

// ── the visor (cyan): a band across the eyes that wraps round the head, brighter where the eyes are ──
const visor = svg(
  [
    path('M38 84C60 72 140 72 162 84L160 112C140 103 60 103 40 112Z', { fill: 0.5, w: 2 }),
    mirrored('M54 92C62 86 80 86 88 92C80 98 62 98 54 92Z', { fill: 1, w: 1 }),
    // the lights of the jacks on the temples and on the collar
    mirroredCircle(36, 120, 4.5),
    mirroredCircle(86, 222, 3.5),
  ].join('')
);

// ── the cables (red): from the back of the head down past the shoulders ──
const cables = svg(
  [
    mirrored('M42 128C30 156 22 194 28 256', { w: 3 }),
    mirrored('M50 150C42 178 40 216 50 256', { w: 2.6 }),
    mirrored('M36 104C24 118 16 140 12 168', { w: 2.4 }),
    mirroredCircle(42, 128, 5),
  ].join('')
);

// ── from drawing to cells ──
const coverage = async (image, { cols, rows }) => {
  const width = cols * SAMPLES;
  const height = rows * SAMPLES;
  const { data } = await sharp(Buffer.from(image))
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cells = new Float32Array(cols * rows);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      cells[Math.floor(y / SAMPLES) * cols + Math.floor(x / SAMPLES)] += data[(y * width + x) * 4 + 3] / 255;
  return cells.map(sum => sum / (SAMPLES * SAMPLES));
};

const level = share => (share < 0.05 ? 0 : share < 0.16 ? 1 : share < 0.34 ? 2 : share < 0.6 ? 3 : 4);

const SUIT = 0.3; // the cowl is a dim plane of sparse glyphs, so the bright parts stand out on it

const render = async grid => {
  const [suitCover, brightCover, carveCover, visorCover, cableCover] = await Promise.all(
    [suit, bright, carve, visor, cables].map(layer => coverage(layer, grid))
  );
  const levels = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = '';
    for (let x = 0; x < grid.cols; x++) {
      const i = y * grid.cols + x;
      const cyan = level(visorCover[i] * 1.2);
      const red = level(cableCover[i] * 1.2);
      const pale = level(Math.max(suitCover[i] * SUIT, brightCover[i]) * Math.max(0, 1 - carveCover[i] * 1.6));
      if (cyan > 0) line += String(5 + cyan);
      else if (red > 0 && red >= pale) line += 'abcd'[red - 1];
      else if (pale > 0) line += String(pale);
      else line += '0';
    }
    levels.push(line);
  }
  return { ...grid, levels };
};

const result = { ratio: Number((VIEW.width / VIEW.height).toFixed(4)) };
for (const [name, grid] of Object.entries(GRIDS)) result[name] = await render(grid);

await writeFile(OUT, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Written ${OUT}`);

if (PREVIEW) {
  const shade = {
    0: ' ',
    1: '.',
    2: ':',
    3: '+',
    4: '#',
    6: '.',
    7: ':',
    8: '*',
    9: '@',
    a: ',',
    b: ';',
    c: 'x',
    d: 'X',
  };
  for (const line of result.desktop.levels) console.log([...line].map(char => shade[char] ?? '?').join(''));
}
