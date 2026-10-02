// Renders the two hands of the pill scene (A-06) into a grid of "density levels" for glyphs. Run by hand when the
// shape or the light changes: `bun run build:hands`. The result is committed (src/data/matrix/hands.json), nothing
// here runs at build time or in the browser. `bun run build:hands -- --preview` also prints the grid as text.
//
// No models and no libraries: the hand is described with signed distance fields (a palm, rounded fingers that are
// bent a little towards the viewer, a thumb, a wrist) and traced with rays, one set per cell. The light is a key light
// from above and the side, a weaker fill light, soft shadows and a darkening in the folds. The result is the
// brightness of every cell; a cell on the capsule is told apart so the browser can paint it blue or red.
//
// Only one hand is stored: the other one is its mirror image.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/data/matrix/hands.json', import.meta.url));
const PREVIEW = process.argv.includes('--preview');

// ── vectors ────────────────────────────────────────────────────────────────────────────────────────────────────
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = a => Math.hypot(a[0], a[1], a[2]);
const norm = a => mul(a, 1 / (len(a) || 1));
const rad = degrees => (degrees * Math.PI) / 180;

const rotX = (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
const rotY = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
const rotZ = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];

// ── distance fields ────────────────────────────────────────────────────────────────────────────────────────────
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

const roundBox = (p, c, half, r) => {
  const q = [Math.abs(p[0] - c[0]) - half[0], Math.abs(p[1] - c[1]) - half[1], Math.abs(p[2] - c[2]) - half[2]];
  return len([Math.max(q[0], 0), Math.max(q[1], 0), Math.max(q[2], 0)]) + Math.min(Math.max(q[0], q[1], q[2]), 0) - r;
};

// A capsule whose radius changes from r1 at a to r2 at b.
const cone = (p, a, b, r1, r2) => {
  const pa = sub(p, a);
  const ba = sub(b, a);
  const h = Math.min(1, Math.max(0, dot(pa, ba) / dot(ba, ba)));
  return len(sub(pa, mul(ba, h))) - (r1 + (r2 - r1) * h);
};

// ── the hand (units are about a centimetre; x to the right, y up, z to the viewer; the thumb is on the +x side) ──
// Fingers: base x, length, fan (degrees away from the middle), and how much each joint bends towards the viewer.
const FINGERS = [
  // x and y: where the finger starts (the knuckles lie on an arc, the middle finger is the highest)
  { x: -3.1, y: 2.7, length: 6.8, fan: 13, bend: [16, 30, 24] }, // little finger
  { x: -1.05, y: 3.5, length: 8.5, fan: 5, bend: [14, 28, 22] }, // ring
  { x: 1.0, y: 3.8, length: 9.3, fan: -1, bend: [12, 26, 20] }, // middle
  { x: 3.0, y: 3.6, length: 8.4, fan: -9, bend: [10, 24, 18] }, // index, next to the thumb
];
const SEGMENT_SHARE = [0.44, 0.31, 0.25];

const chain = (base, length, fan, bends, r1, r2) => {
  const segments = [];
  let from = base;
  let angle = 0;
  for (let i = 0; i < 3; i++) {
    angle += rad(bends[i]);
    const step = length * SEGMENT_SHARE[i];
    const direction = rotZ(rotX([0, 1, 0], angle), rad(fan));
    const to = add(from, mul(direction, step));
    const t0 = i / 3;
    const t1 = (i + 1) / 3;
    segments.push({ from, to, r1: r1 + (r2 - r1) * t0, r2: r1 + (r2 - r1) * t1 });
    from = to;
  }
  return segments;
};

const fingers = FINGERS.flatMap(finger =>
  chain([finger.x, finger.y, 0], finger.length, finger.fan, finger.bend, 0.76, 0.54)
);
// The thumb: three bones, starting low on the palm, with the muscle at its base (the thenar) in handDistance.
const thumb = [
  { from: [2.9, -4.2, 0.5], to: [5.2, -2.3, 1.0], r1: 1.1, r2: 0.95 },
  { from: [5.2, -2.3, 1.0], to: [6.9, -0.9, 1.6], r1: 0.95, r2: 0.84 },
  { from: [6.9, -0.9, 1.6], to: [7.9, 0.3, 2.0], r1: 0.84, r2: 0.7 },
];

// The world is the hand turned a little: the palm looks a bit towards the middle of the scene and the top leans back.
// Palms up, held out to the viewer, like Morpheus in the film: the hand is turned so that the fingers point at the viewer
// and the palm looks up, and the camera is above and in front, so the palm is seen at a slant. Each hand also turns
// a little towards the middle of the scene.
const CAMERA = rad(-52); // how far above the hands the camera is
const YAW = rad(0);
const ROLL = rad(17); // the hand is turned in the picture plane: the fingers point down and to the middle
const toLocal = p => rotY(rotX(rotY(rotX(rotZ(p, ROLL), CAMERA), YAW), -rad(90)), -rad(180));
const pillAxis = norm(toLocal([1, 0, 0]));
const pillCentre = [0, -0.6, 1.9];
const pill = { from: sub(pillCentre, mul(pillAxis, 1.25)), to: add(pillCentre, mul(pillAxis, 1.25)), r: 0.72 };

const handDistance = q => {
  // The palm is narrower at the wrist than at the knuckles.
  const taper = 0.8 + 0.2 * Math.min(1, Math.max(0, (q[1] + 5) / 9));
  const palm = roundBox([q[0] / taper, q[1], q[2]], [0, -1.0, 0], [3.05, 4.0, 0.35], 0.8) * taper;
  const thenar = cone(q, [2.4, -1.2, 0.6], [2.0, -4.4, 0.5], 1.3, 1.1);
  const wristP = [q[0], q[1], q[2] * 1.45];
  const wrist = cone(wristP, [0, -5.5, 0], [0, -17, -1.2], 2.4, 2.1);
  let fingerDistance = Infinity;
  for (const segment of fingers)
    fingerDistance = Math.min(fingerDistance, cone(q, segment.from, segment.to, segment.r1, segment.r2));
  let thumbDistance = Infinity;
  for (const segment of thumb)
    thumbDistance = Math.min(thumbDistance, cone(q, segment.from, segment.to, segment.r1, segment.r2));
  return smin(smin(smin(smin(palm, thenar, 1.2), wrist, 1.4), fingerDistance, 0.7), thumbDistance, 1.0);
};
const pillDistance = q => cone(q, pill.from, pill.to, pill.r, pill.r);

const scene = p => {
  const q = toLocal(p);
  const hand = handDistance(q);
  const capsule = pillDistance(q);
  return capsule < hand ? { d: capsule, material: 1 } : { d: hand, material: 0 };
};
const distance = p => scene(p).d;

const normalAt = p => {
  const e = 0.02;
  return norm([
    distance([p[0] + e, p[1], p[2]]) - distance([p[0] - e, p[1], p[2]]),
    distance([p[0], p[1] + e, p[2]]) - distance([p[0], p[1] - e, p[2]]),
    distance([p[0], p[1], p[2] + e]) - distance([p[0], p[1], p[2] - e]),
  ]);
};

const softShadow = (origin, light) => {
  let result = 1;
  let t = 0.15;
  for (let i = 0; i < 40 && t < 14; i++) {
    const h = distance(add(origin, mul(light, t)));
    if (h < 0.001) return 0;
    result = Math.min(result, (7 * h) / t);
    t += Math.max(h, 0.06);
  }
  return Math.max(0, Math.min(1, result));
};

const occlusion = (p, n) => {
  let sum = 0;
  let weight = 1;
  for (let i = 1; i <= 5; i++) {
    const h = 0.18 * i;
    sum += weight * (h - distance(add(p, mul(n, h))));
    weight *= 0.6;
  }
  return Math.max(0, Math.min(1, 1 - 1.6 * sum));
};

// ── light ──────────────────────────────────────────────────────────────────────────────────────────────────────
const KEY = norm([0.8, 0.55, 0.5]);
const FILL = norm([-0.7, -0.2, 0.6]);
const VIEW = [0, 0, 1];

// Brightness 0..1 of the surface point, and whether it is on the capsule.
const shade = hit => {
  const { p, material } = hit;
  const n = normalAt(p);
  const key = Math.max(0, dot(n, KEY)) * softShadow(add(p, mul(n, 0.05)), KEY);
  const fill = Math.max(0, dot(n, FILL)) * 0.16;
  const ao = occlusion(p, n);
  const rim = Math.pow(1 - Math.max(0, dot(n, VIEW)), 2) * 0.22;
  let light = (0.04 + 1.0 * key + fill + rim) * (0.35 + 0.65 * ao);
  if (material === 1) {
    const half = norm(add(KEY, VIEW));
    light += 0.9 * Math.pow(Math.max(0, dot(n, half)), 24);
    light = 0.25 + light * 0.9;
  }
  return { light: Math.min(1.2, light), material, up: toLocal(p)[1] };
};

const trace = (x, y) => {
  let t = 0;
  for (let i = 0; i < 80 && t < 60; i++) {
    const p = [x, y, 30 - t];
    const { d, material } = scene(p);
    if (d < 0.004) return { p, material };
    t += d * 0.85;
  }
  return null;
};

// ── the grid ───────────────────────────────────────────────────────────────────────────────────────────────────
const GLYPH_ASPECT = 0.6; // a monospace glyph is this much wider than ... tall
// The part of the world shown, the same for every size: the box around the hand with a margin.
const WINDOW = { x: [-8, 8], y: [8, -8] };
const fitWindow = () => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let y = -16; y <= 16; y += 0.35) {
    for (let x = -16; x <= 16; x += 0.35) {
      const hit = trace(x, y);
      if (!hit || toLocal(hit.p)[1] < -9) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const margin = 0.6;
  WINDOW.x = [minX - margin, maxX + margin];
  WINDOW.y = [maxY + margin, minY - margin];
};
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const SAMPLES = 3;

const render = cols => {
  const width = WINDOW.x[1] - WINDOW.x[0];
  const cellWidth = width / cols;
  const cellHeight = cellWidth / GLYPH_ASPECT;
  const rows = Math.round((WINDOW.y[0] - WINDOW.y[1]) / cellHeight);

  // Pass 1: the brightness of every cell, and what it is made of.
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let light = 0;
      let up = 0;
      let hits = 0;
      let onCapsule = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = WINDOW.x[0] + (col + (sx + 0.5) / SAMPLES) * cellWidth;
          const y = WINDOW.y[0] - (row + (sy + 0.5) / SAMPLES) * cellHeight;
          const hit = trace(x, y);
          if (!hit) continue;
          const shaded = shade(hit);
          light += shaded.light;
          up += shaded.up;
          hits += 1;
          onCapsule += shaded.material;
        }
      }

      // The wrist dissolves along the arm.
      const fade = hits ? Math.min(1, Math.max(0, (up / hits + 9) / 3.5)) : 0;
      if (hits / (SAMPLES * SAMPLES) < 0.4 || fade <= 0) {
        cells.push(null);
        continue;
      }
      const dither = (BAYER[row % 4][col % 4] / 16 - 0.5) * 0.08;
      cells.push({ brightness: (light / hits) * (0.3 + 0.7 * fade) + dither, fade, capsule: onCapsule / hits > 0.5 });
    }
  }

  // Pass 2: levels 1..4 by quantiles of the hand, so the whole range of glyph densities shows the form.
  const handValues = cells
    .filter(cell => cell && !cell.capsule)
    .map(cell => cell.brightness)
    .sort((x, y) => x - y);
  const at = share => handValues[Math.min(handValues.length - 1, Math.floor(handValues.length * share))];
  const cuts = [at(0.2), at(0.45), at(0.72)];
  const pillValues = cells
    .filter(cell => cell?.capsule)
    .map(cell => cell.brightness)
    .sort((x, y) => x - y);
  const pillCuts = [pillValues[Math.floor(pillValues.length * 0.35)], pillValues[Math.floor(pillValues.length * 0.75)]];

  const lines = [];
  const capsuleCells = [];
  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      const cell = cells[row * cols + col];
      if (!cell) {
        line += '0';
        continue;
      }
      if (cell.capsule) {
        const level = cell.brightness < pillCuts[0] ? 2 : cell.brightness < pillCuts[1] ? 3 : 4;
        line += String(5 + level);
        capsuleCells.push([col, row]);
        continue;
      }
      let level = cell.brightness < cuts[0] ? 1 : cell.brightness < cuts[1] ? 2 : cell.brightness < cuts[2] ? 3 : 4;
      // The outline: a cell next to an empty one is never faint, so the silhouette (and the gaps between the
      // fingers) can always be read, even on the dark side.
      const empty = (dx, dy) => {
        const x = col + dx;
        const y = row + dy;
        return x < 0 || y < 0 || x >= cols || y >= rows || !cells[y * cols + x];
      };
      if (cell.fade >= 0.55 && (empty(-1, 0) || empty(1, 0) || empty(0, -1) || empty(0, 1))) level = Math.max(level, 3);
      if (cell.fade < 0.55) level = Math.min(level, cell.fade < 0.25 ? 1 : 2);
      line += String(level);
    }
    lines.push(line);
  }

  // The middle of the capsule, in cells, for the button that lies over it.
  const centre = capsuleCells
    .reduce((sum, [c, r]) => [sum[0] + c + 0.5, sum[1] + r + 0.5], [0, 0])
    .map(value => value / capsuleCells.length);
  const radius = Math.sqrt(capsuleCells.length / Math.PI);
  return {
    cols,
    rows,
    levels: lines,
    pill: { x: +centre[0].toFixed(1), y: +centre[1].toFixed(1), r: +radius.toFixed(1) },
  };
};

fitWindow();
const result = { desktop: render(80), mobile: render(44) };
await writeFile(OUT, JSON.stringify(result) + '\n');

if (PREVIEW) {
  const ramp = ' .:+#';
  for (const name of ['desktop', 'mobile']) {
    console.log(`\n${name}: ${result[name].cols} × ${result[name].rows}, pill`, result[name].pill);
    for (const line of result[name].levels) {
      console.log([...line].map(ch => (Number(ch) >= 5 ? 'o@%&B'[Number(ch) - 5] : ramp[Number(ch)])).join(''));
    }
  }
}
console.log(`Wrote ${OUT}`);
