import { describe, expect, it } from 'vitest';
import { GLYPHS, createRng, pickGlyph } from './glyphs';

describe('createRng', () => {
  it('gives the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect(Array.from({ length: 20 }, a)).toEqual(Array.from({ length: 20 }, b));
  });

  it('gives different sequences for different seeds and stays in [0, 1)', () => {
    const a = Array.from({ length: 50 }, createRng(1));
    const b = Array.from({ length: 50 }, createRng(2));
    expect(a).not.toEqual(b);
    expect(a.every(value => value >= 0 && value < 1)).toBe(true);
  });
});

describe('pickGlyph', () => {
  it('picks only glyphs from the set, reproducibly', () => {
    const picked = Array.from({ length: 200 }, (_, i) => pickGlyph(createRng(i)));
    expect(picked.every(glyph => GLYPHS.includes(glyph))).toBe(true);
    expect(Array.from({ length: 30 }, createRng(7)).map(() => pickGlyph(createRng(7)))).toHaveLength(30);
  });

  it('mixes katakana, code symbols and digits', () => {
    expect(GLYPHS).toContain('ｱ');
    expect(GLYPHS).toContain('{');
    expect(GLYPHS).toContain('7');
  });
});
