import { describe, expect, it } from 'vitest';
import { mix, parseColor } from './accent';

describe('parseColor', () => {
  it('reads hex and rgb notations', () => {
    expect(parseColor('#44ff62')).toEqual([68, 255, 98]);
    expect(parseColor(' #fff ')).toEqual([255, 255, 255]);
    expect(parseColor('rgb(68, 255, 98)')).toEqual([68, 255, 98]);
    expect(parseColor('rgb(68 255 98 / 35%)')).toEqual([68, 255, 98]);
  });

  it('returns null for anything else', () => {
    expect(parseColor('var(--green)')).toBeNull();
    expect(parseColor('')).toBeNull();
  });
});

describe('mix', () => {
  it('blends two colors', () => {
    expect(mix([0, 0, 0], [100, 200, 50], 0.5)).toEqual([50, 100, 25]);
    expect(mix([10, 20, 30], [200, 200, 200], 0)).toEqual([10, 20, 30]);
  });
});
