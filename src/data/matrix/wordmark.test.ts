import { describe, expect, it } from 'vitest';
import { wordmarkSchema, wordmarks } from './wordmark';

describe('wordmark data', () => {
  it('passes its schema and has both words in both sizes', () => {
    expect(Object.keys(wordmarks).sort()).toEqual(['404', 'mirislamus']);
    expect(wordmarks.mirislamus.desktop.cols).toBeGreaterThan(wordmarks.mirislamus.mobile.cols);
  });

  it('draws something in every grid', () => {
    for (const variants of Object.values(wordmarks)) {
      for (const grid of Object.values(variants)) {
        expect(grid.levels.join('')).toMatch(/[1-4]/);
      }
    }
  });

  it('rejects a grid whose rows have the wrong width or digits', () => {
    const broken = structuredClone(wordmarks);
    broken.mirislamus.desktop.levels[0] = '0';
    expect(wordmarkSchema.safeParse(broken).success).toBe(false);

    const badDigit = structuredClone(wordmarks);
    badDigit['404'].mobile.levels[0] = '9'.repeat(badDigit['404'].mobile.cols);
    expect(wordmarkSchema.safeParse(badDigit).success).toBe(false);
  });

  it('rejects a missing word', () => {
    expect(wordmarkSchema.safeParse({ mirislamus: wordmarks.mirislamus }).success).toBe(false);
  });
});
