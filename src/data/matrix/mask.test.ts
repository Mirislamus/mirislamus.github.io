import { describe, expect, it } from 'vitest';
import { mask, maskSchema } from './mask';

const count = (levels: string[], test: (char: string) => boolean) =>
  levels.reduce((sum, row) => sum + [...row].filter(test).length, 0);

describe('the glyph mask of the netrunner', () => {
  it('passes its schema and has the size it says', () => {
    expect(() => maskSchema.parse(mask)).not.toThrow();
    for (const grid of [mask.desktop, mask.mobile]) {
      expect(grid.levels).toHaveLength(grid.rows);
      for (const row of grid.levels) expect(row).toHaveLength(grid.cols);
    }
  });

  it('is as wide as the drawing, with cells that are taller than wide (about 0.6 × 1)', () => {
    for (const grid of [mask.desktop, mask.mobile]) {
      const cellsRatio = (grid.cols * 0.6) / grid.rows;
      expect(Math.abs(cellsRatio - mask.ratio)).toBeLessThan(0.05);
    }
  });

  it('has all three layers: the pale mask, the cyan eyes, the rosy cheeks', () => {
    for (const grid of [mask.desktop, mask.mobile]) {
      const cells = grid.cols * grid.rows;
      expect(count(grid.levels, char => /[1-4]/.test(char))).toBeGreaterThan(cells * 0.3);
      expect(count(grid.levels, char => /[6-9]/.test(char))).toBeGreaterThan(cells * 0.005);
      expect(count(grid.levels, char => /[a-d]/.test(char))).toBeGreaterThan(cells * 0.01);
    }
  });

  it('has the eyes in the upper half, side by side, in the middle of the face', () => {
    const { levels, cols, rows } = mask.desktop;
    const cyan = levels.flatMap((row, y) => [...row].flatMap((char, x) => (/[6-9]/.test(char) ? [{ x, y }] : [])));
    const eyes = cyan.filter(({ x, y }) => y > rows * 0.25 && y < rows * 0.45 && x > cols * 0.15 && x < cols * 0.85);
    expect(eyes.length).toBeGreaterThan(10);
    expect(eyes.some(({ x }) => x < cols / 2)).toBe(true);
    expect(eyes.some(({ x }) => x >= cols / 2)).toBe(true);
  });

  it('is roughly symmetric: the two halves of the picture hold about the same number of cells', () => {
    const { levels, cols } = mask.desktop;
    const side = (from: number, to: number) =>
      levels.reduce((sum, row) => sum + [...row.slice(from, to)].filter(char => char !== '0').length, 0);
    const left = side(0, cols / 2);
    const right = side(cols / 2, cols);
    expect(Math.abs(left - right) / (left + right)).toBeLessThan(0.1);
  });
});
