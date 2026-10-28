import { describe, expect, it } from 'vitest';

import { isWithinWorkHours, type WorkHours } from './work-hours';

const hours: WorkHours = { timezone: 'Asia/Tashkent', days: [1, 2, 3, 4, 5], from: '10:00', to: '19:00' };
const at = (iso: string) => new Date(iso);

describe('isWithinWorkHours', () => {
  it('is false one minute before the start', () => {
    expect(isWithinWorkHours(at('2026-09-30T04:59:00Z'), hours)).toBe(false);
  });

  it('includes the start', () => {
    expect(isWithinWorkHours(at('2026-09-30T05:00:00Z'), hours)).toBe(true);
  });

  it('is true at the last minute', () => {
    expect(isWithinWorkHours(at('2026-09-30T13:59:00Z'), hours)).toBe(true);
  });

  it('excludes the end', () => {
    expect(isWithinWorkHours(at('2026-09-30T14:00:00Z'), hours)).toBe(false);
  });

  it('is false on weekends', () => {
    expect(isWithinWorkHours(at('2026-10-03T08:00:00Z'), hours)).toBe(false);
    expect(isWithinWorkHours(at('2026-10-04T08:00:00Z'), hours)).toBe(false);
  });

  it('uses the weekday of the work time zone, not UTC', () => {
    expect(isWithinWorkHours(at('2026-10-02T23:30:00Z'), hours)).toBe(false);
    expect(isWithinWorkHours(at('2026-10-04T22:00:00Z'), hours)).toBe(false);
    expect(isWithinWorkHours(at('2026-10-05T05:00:00Z'), hours)).toBe(true);
  });
});
