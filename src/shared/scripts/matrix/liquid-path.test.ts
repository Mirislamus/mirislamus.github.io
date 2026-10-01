import { describe, expect, it } from 'vitest';
import { LIQUID_POINTS, blobPath } from './liquid-path';

const flat = Array.from({ length: LIQUID_POINTS }, () => 0);

describe('blobPath', () => {
  it('is a closed path of one move and N curves', () => {
    const path = blobPath(flat, 120, 130, 130);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.match(/C/g)).toHaveLength(LIQUID_POINTS);
    expect(path.match(/M/g)).toHaveLength(1);
  });

  it('never produces NaN, also for large offsets', () => {
    const offsets = flat.map((_, i) => (i % 2 ? 90 : -20));
    expect(blobPath(offsets, 120, 130, 130)).not.toMatch(/NaN|Infinity/);
  });

  it('starts at the right of the center with the radius plus the offset', () => {
    expect(blobPath(flat, 120, 130, 130).startsWith('M250.0 130.0')).toBe(true);
    const moved = [...flat];
    moved[0] = 30;
    expect(blobPath(moved, 120, 130, 130).startsWith('M280.0 130.0')).toBe(true);
  });
});
