// Draws the mask of the netrunner (J-07) into a grid of "density levels" for glyphs. Run by hand when the drawing changes:
// `bun run build:mask`. The result is committed (src/data/matrix/mask.json); nothing here runs at build time or in the
// browser. `bun run build:mask -- --preview` also prints the grid as text.
//
// The drawing is ours: a hooded figure in a stylised mask in the spirit of the hackers' one (long face, arched brows, a
// moustache with curled ends, a smile, a small beard) with digital eyes and traces of circuits. It is a vector drawing
// (below); it is rasterised with sharp and every cell of the grid takes the share of the cell that is covered.
//
// Three layers, one character per cell:
//   0       empty
//   1 … 4   the mask itself (pale), the density of the glyph grows with the number
//   6 … 9   the digital parts (cyan): the eyes and the circuits
//   a … d   the hood (red)
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../src/data/matrix/mask.json', import.meta.url));
const PREVIEW = process.argv.includes('--preview');

// Every grid has the same picture; a cell is taller than wide (a glyph is about 0.6 × 1), so the picture is drawn
// stretched, and it is un-stretched when it is shown.
const GRIDS = { desktop: { cols: 68, rows: 50 }, mobile: { cols: 46, rows: 34 } };
const SAMPLES = 4; // the raster has this many pixels per cell on a side
// The part of the drawing that is shown: the face with the edge of the hood around it.
const VIEW = { x: 46, y: 34, width: 168, height: 212 };
const LINE = 1.7; // the lines are drawn thicker than they look: a thin line is only a few dots in a grid of glyphs

const svg = body =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const path = (d, { w = 3, fill = 'none', opacity = 1, stroke = true } = {}) =>
  `<path d="${d}" stroke-width="${w * LINE}" fill="${fill === 'none' ? 'none' : '#000'}" fill-opacity="${fill === 'none' ? 0 : fill}" stroke-opacity="${stroke ? opacity : 0}"/>`;

// ── the hood (red) ──
const HOOD = 'M30 300C26 190 50 110 66 86C84 44 106 22 130 20C154 22 176 44 194 86C210 110 234 190 230 300';
const hood = svg(
  [
    path(`${HOOD}Z`, { fill: 0.16, stroke: false }),
    path(HOOD, { w: 4 }),
    path('M66 134C68 82 98 46 130 44C162 46 192 82 194 134', { w: 3 }),
    path('M44 300C58 250 96 226 130 222C164 226 202 250 216 300', { w: 3 }),
    path('M116 228V262M144 228V256', { w: 3 }),
    path('M56 160C60 200 56 250 50 290M204 160C200 200 204 250 210 290', { w: 2.5 }),
  ].join('')
);

// ── the mask (pale) ──
const FACE = 'M92 112C90 80 108 62 130 62C152 62 170 80 168 112C168 152 154 190 130 216C106 190 92 152 92 112Z';
const MOUSTACHE =
  'M96 168C106 158 120 158 130 164C140 158 154 158 164 168C156 170 150 176 142 172C136 170 134 170 130 172C126 170 124 170 118 172C110 176 104 170 96 168Z';
// The face is a bright plane; its features are carved out of it as dark gaps, which reads much better in glyphs than lines do.
const face = svg(path(FACE, { fill: 1, w: 3 }));
const carve = svg(
  [
    path('M98 100C106 88 120 88 126 98M134 98C140 88 154 88 162 100', { w: 3 }),
    path('M98 134C104 144 114 148 122 146M162 134C156 144 146 148 138 146', { w: 2 }),
    path('M130 118L126 146C128 150 132 150 134 146', { w: 2.2 }),
    path(MOUSTACHE, { fill: 1, w: 1 }),
    path('M96 168C90 164 90 156 96 152M164 168C170 164 170 156 164 152', { w: 2.4 }),
    path('M104 182C116 194 144 194 156 182', { w: 3 }),
    path('M100 178C97 182 99 187 104 189M160 178C163 182 161 187 156 189', { w: 2 }),
    path('M122 196C126 208 134 208 138 196', { w: 3 }),
  ].join('')
);

// ── the digital parts (cyan): the eyes and the traces of circuits, on the mask and across the hood ──
const node = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#000" stroke="none"/>`;
const digital = svg(
  [
    path(
      'M100 112C106 106 118 106 124 114C118 120 106 120 100 112ZM136 114C142 106 154 106 160 112C154 120 142 120 136 114Z',
      {
        fill: 1,
        w: 2,
      }
    ),
    path('M118 72H130V84H146L152 78M108 92H98V100', { w: 2.5 }),
    path('M94 140H86L80 148M166 140H174L180 148', { w: 2.5 }),
    path('M130 218V232H116', { w: 2.5 }),
    path('M30 256H72L82 246H96', { w: 2.5 }),
    path('M230 256H188L178 246H164', { w: 2.5 }),
    path('M40 214H64L72 206M220 214H196L188 206', { w: 2.5 }),
    node(98, 100),
    node(152, 78),
    node(96, 246),
    node(164, 246),
    node(72, 206),
    node(188, 206),
    node(116, 232),
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

const render = async grid => {
  const [hoodCover, faceCover, carveCover, digitalCover] = await Promise.all(
    [hood, face, carve, digital].map(layer => coverage(layer, grid))
  );
  const levels = [];
  for (let y = 0; y < grid.rows; y++) {
    let line = '';
    for (let x = 0; x < grid.cols; x++) {
      const i = y * grid.cols + x;
      const cyan = level(digitalCover[i] * 1.4); // thin lines need a little help to show
      const pale = level(faceCover[i] * Math.max(0, 1 - carveCover[i] * 1.4));
      const red = level(hoodCover[i]);
      if (cyan > 0) line += String(5 + cyan);
      else if (pale > 0) line += String(pale);
      else if (red > 0) line += 'abcd'[red - 1];
      else line += '0';
    }
    levels.push(line);
  }
  return { ...grid, levels };
};

const result = { ratio: (VIEW.width / VIEW.height).toFixed(4) };
for (const [name, grid] of Object.entries(GRIDS)) result[name] = await render(grid);
result.ratio = Number(result.ratio);

await writeFile(OUT, `${JSON.stringify(result)}\n`);
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
