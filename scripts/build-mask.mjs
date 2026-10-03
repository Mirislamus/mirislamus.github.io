// Draws the mask of the netrunner (J-07) into a grid of "density levels" for glyphs. Run by hand when the drawing changes:
// `bun run build:mask`. The result is committed (src/data/matrix/mask.json); nothing here runs at build time or in the
// browser. `bun run build:mask -- --preview` also prints the grid as text.
//
// The drawing is ours, a stylised mask in the spirit of the hackers' one, whole, with a margin around it: a broad brow
// and cheekbones narrowing to a pointed chin, thin high-arched brows, narrow slanted eyes (glowing cyan here), rosy
// cheeks, a long nose, a thin moustache with ends curled up, a wide smile with its folds and a narrow strip of a beard
// down to the chin. The face is a bright plane and its features are carved out of it as dark gaps, which reads much
// better in glyphs than thin lines do. It is rasterised with sharp and every cell takes the share of it that is covered.
//
// Three layers, one character per cell:
//   0       empty
//   1 … 4   the mask itself (pale), the density of the glyph grows with the number
//   6 … 9   the eyes (cyan)
//   a … d   the rosy cheeks (red)
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../src/data/matrix/mask.json', import.meta.url));
const PREVIEW = process.argv.includes('--preview');

// Every grid has the same picture; a cell is taller than wide (a glyph is about 0.6 × 1), so the picture is drawn
// stretched, and it is un-stretched when it is shown.
const GRIDS = { desktop: { cols: 66, rows: 52 }, mobile: { cols: 44, rows: 34 } };
const SAMPLES = 4; // the raster has this many pixels per cell on a side
const VIEW = { width: 200, height: 260 }; // the whole mask, with a margin
const LINE = 1.7; // the lines are drawn thicker than they look: a thin line is only a few dots in a grid of glyphs

const svg = body =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const path = (d, { w = 3, fill = 'none' } = {}) =>
  `<path d="${d}" stroke-width="${w * LINE}" fill="${fill === 'none' ? 'none' : '#000'}" fill-opacity="${fill === 'none' ? 0 : fill}"/>`;

// A shape and its mirror image across the middle of the mask (x = 100).
const MIDDLE = 100;
const mirrored = (d, options) =>
  path(d, options) + `<g transform="translate(${MIDDLE * 2} 0) scale(-1 1)">${path(d, options)}</g>`;

// ── the face (pale) ──
const FACE =
  'M100 14C142 14 170 34 176 66C182 94 181 120 172 144C161 180 138 214 100 248C62 214 39 180 28 144C19 120 18 94 24 66C30 34 58 14 100 14Z';
const face = svg(path(FACE, { fill: 1, w: 2 }));

// ── what is carved out of it (dark) ──
const carve = svg(
  [
    // the brows: thin, high, arched, lower towards the nose
    mirrored('M88 76C82 62 68 56 54 62C49 65 46 69 44 74', { w: 3.4 }),
    // the rims of the eyes, so the slits read even where the cyan is thin
    mirrored('M52 94C61 85 78 85 89 93C78 100 61 100 52 94Z', { w: 2.4 }),
    // the nose: a long ridge and its tip
    path('M100 86L95 134C95 140 100 143 106 141', { w: 2.4 }),
    // the folds of the smile
    mirrored('M68 142C61 157 62 171 73 182', { w: 2.6 }),
    // the moustache: thin, with the ends curled up
    mirrored(
      'M100 149C90 145 77 147 67 154C59 160 51 158 49 150C48 144 52 139 57 139C54 143 55 149 61 150C71 152 82 149 93 153C97 154 99 155 100 157Z',
      { fill: 1, w: 1.8 }
    ),
    // the smile and the lower lip
    path('M74 168C88 180 112 180 126 168', { w: 3.2 }),
    path('M89 182C96 186 104 186 111 182', { w: 2 }),
    // the narrow strip of a beard down to the chin
    path('M95 189L105 189L102.5 240L97.5 240Z', { fill: 1, w: 1.2 }),
  ].join('')
);

// ── the rosy cheeks (red) ──
const cheeks = svg(mirrored('M58 128m-17 0a17 12 0 1 0 34 0a17 12 0 1 0 -34 0', { fill: 0.55, w: 0 }));

// ── the eyes (cyan): narrow slits, slanted up to the temples ──
const eyes = svg(mirrored('M54 94C62 87 77 87 87 93C77 99 62 99 54 94Z', { fill: 1, w: 1 }));

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

// The face is lit from the front: full in the middle, a little less towards its edges, so it has some volume.
const shade = (x, y, { cols, rows }) => {
  const dx = (x + 0.5) / cols - 0.5;
  const dy = (y + 0.5) / rows - 0.42;
  return Math.max(0.5, 1 - (dx * dx * 2.2 + dy * dy * 1.2));
};

const level = share => (share < 0.05 ? 0 : share < 0.16 ? 1 : share < 0.34 ? 2 : share < 0.6 ? 3 : 4);

const render = async grid => {
  const [faceCover, carveCover, cheekCover, eyeCover] = await Promise.all(
    [face, carve, cheeks, eyes].map(layer => coverage(layer, grid))
  );
  const levels = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = '';
    for (let x = 0; x < grid.cols; x++) {
      const i = y * grid.cols + x;
      const cyan = level(eyeCover[i] * 1.3);
      const pale = level(faceCover[i] * Math.max(0, 1 - carveCover[i] * 1.6) * shade(x, y, grid));
      const rosy = cheekCover[i] > 0.2 && pale > 0;
      if (cyan > 0) line += String(5 + cyan);
      else if (rosy) line += 'abcd'[pale - 1];
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
