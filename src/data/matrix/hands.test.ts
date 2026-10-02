import { describe, expect, it } from 'vitest';
import { handsGap } from '@shared/scripts/matrix/hands-layout';
import { hands, handsSchema } from './hands';

describe('hands data', () => {
  it('passes its schema and has both sizes', () => {
    expect(hands.desktop.cols).toBeGreaterThan(hands.mobile.cols);
  });

  it('has a hand and a capsule in every grid, with the capsule inside the grid', () => {
    for (const grid of Object.values(hands)) {
      expect(grid.levels.join('')).toMatch(/[1-4]/);
      expect(grid.levels.join('')).toMatch(/[6-9]/);
      expect(grid.pill.x).toBeLessThan(grid.cols);
      expect(grid.pill.y).toBeLessThan(grid.rows);
    }
  });

  it('keeps the same proportions in both sizes, so the scene only scales', () => {
    const shape = (grid: (typeof hands)['desktop']) => (grid.cols * 2 + handsGap(grid.cols)) / grid.rows;
    expect(Math.abs(shape(hands.desktop) - shape(hands.mobile))).toBeLessThan(0.15);
  });

  it('rejects a grid whose rows have the wrong width or digits', () => {
    const broken = structuredClone(hands);
    broken.desktop.levels[0] = '0';
    expect(handsSchema.safeParse(broken).success).toBe(false);

    const unused = structuredClone(hands);
    unused.mobile.levels[0] = '5'.repeat(unused.mobile.cols);
    expect(handsSchema.safeParse(unused).success).toBe(false);
  });
});
