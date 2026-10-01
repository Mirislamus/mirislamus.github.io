import { describe, expect, it } from 'vitest';
import { ASCII_POOLS, levelOfChar, levelsToText } from './wordmark';

describe('levelsToText', () => {
  const levels = ['0124', '4310'];

  it('keeps the shape: empty cells are spaces, every other cell is a glyph of its level', () => {
    const text = levelsToText(levels, 1);
    const rows = text.split('\n');
    expect(rows).toHaveLength(2);
    rows.forEach((row, y) => {
      expect(row).toHaveLength(4);
      [...row].forEach((char, x) => expect(levelOfChar(char)).toBe(Number(levels[y][x])));
    });
  });

  it('is the same for the same seed and differs for another', () => {
    const big = Array.from({ length: 6 }, () => '4'.repeat(40));
    expect(levelsToText(big, 7)).toBe(levelsToText(big, 7));
    expect(levelsToText(big, 7)).not.toBe(levelsToText(big, 8));
  });
});

describe('ASCII_POOLS', () => {
  it('do not share characters, so a level can be read back', () => {
    const all = ASCII_POOLS.join('');
    expect(new Set(all).size).toBe(all.length);
  });
});
