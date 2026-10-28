import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/data/matrix/wordmark.json', import.meta.url));
const FONT = fileURLToPath(new URL('../public/fonts/inter/inter-latin.woff2', import.meta.url));

const GLYPH_ASPECT = 0.6;
const THRESHOLDS = [0.12, 0.35, 0.6, 0.82];

const TARGETS = {
  mirislamus: {
    desktop: { lines: ['MIRISLAMUS'], cols: 180 },
    mobile: { lines: ['MIRISLAMUS'], cols: 100 },
  },
  404: {
    desktop: { lines: ['404'], cols: 64 },
    mobile: { lines: ['404'], cols: 44 },
  },
};

const fontBase64 = (await readFile(FONT)).toString('base64');
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  const result = await page.evaluate(
    async ({ fontBase64, targets, glyphAspect, thresholds }) => {
      const face = new FontFace('InterWordmark', `url(data:font/woff2;base64,${fontBase64})`, { weight: '400 700' });
      await face.load();
      document.fonts.add(face);

      const FONT_PX = 320;
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const rasterize = lines => {
        ctx.font = `700 ${FONT_PX}px InterWordmark`;
        const cap = ctx.measureText('M').actualBoundingBoxAscent;
        const widest = Math.max(...lines.map(line => ctx.measureText(line).width));
        const lineStep = cap * 1.28;

        canvas.width = Math.ceil(widest + FONT_PX * 0.4);
        canvas.height = Math.ceil(cap + lineStep * (lines.length - 1) + FONT_PX * 0.4);
        ctx.font = `700 ${FONT_PX}px InterWordmark`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineJoin = 'round';
        ctx.lineWidth = FONT_PX * 0.035;

        lines.forEach((line, i) => {
          const x = (canvas.width - ctx.measureText(line).width) / 2;
          const y = FONT_PX * 0.2 + cap + lineStep * i;
          ctx.fillText(line, x, y);
          ctx.strokeText(line, x, y);
        });

        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let minX = canvas.width;
        let maxX = 0;
        let minY = canvas.height;
        let maxY = 0;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 127) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          }
        }
        return { data, width: canvas.width, box: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } };
      };

      const toLevels = ({ lines, cols }) => {
        const { data, width, box } = rasterize(lines);
        const cellW = box.w / cols;
        const rows = Math.max(1, Math.round(box.h / (cellW / glyphAspect)));
        const cellH = box.h / rows;

        const levels = [];
        for (let row = 0; row < rows; row++) {
          let text = '';
          for (let col = 0; col < cols; col++) {
            const x0 = Math.floor(box.x + col * cellW);
            const x1 = Math.max(x0 + 1, Math.floor(box.x + (col + 1) * cellW));
            const y0 = Math.floor(box.y + row * cellH);
            const y1 = Math.max(y0 + 1, Math.floor(box.y + (row + 1) * cellH));
            let sum = 0;
            let count = 0;
            for (let y = y0; y < y1; y++) {
              for (let x = x0; x < x1; x++) {
                sum += data[(y * width + x) * 4 + 3] / 255;
                count++;
              }
            }
            const coverage = sum / count;
            text += thresholds.filter(limit => coverage >= limit).length;
          }
          levels.push(text);
        }
        return { cols, rows, levels };
      };

      return Object.fromEntries(
        Object.entries(targets).map(([key, variants]) => [
          key,
          Object.fromEntries(Object.entries(variants).map(([name, config]) => [name, toLevels(config)])),
        ]),
      );
    },
    { fontBase64, targets: TARGETS, glyphAspect: GLYPH_ASPECT, thresholds: THRESHOLDS },
  );

  await writeFile(OUT, `${JSON.stringify(result, null, 2)}\n`);

  for (const [key, variants] of Object.entries(result)) {
    for (const [name, grid] of Object.entries(variants)) {
      console.log(`${key} / ${name}: ${grid.cols} × ${grid.rows}`);
    }
  }
} finally {
  await browser.close();
}
