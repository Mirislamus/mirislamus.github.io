import { describe, expect, it } from 'vitest';
import { getExperienceYears } from './experience';

describe('getExperienceYears', () => {
  it('counts full years since June 2018', () => {
    expect(getExperienceYears(new Date(2026, 8, 30))).toBe(8);
  });

  it('does not add the year before the anniversary month', () => {
    expect(getExperienceYears(new Date(2027, 4, 31))).toBe(8);
  });

  it('adds the year in June', () => {
    expect(getExperienceYears(new Date(2027, 5, 1))).toBe(9);
  });

  it('is 0 in the first months after the start', () => {
    expect(getExperienceYears(new Date(2018, 6, 1))).toBe(0);
  });
});
