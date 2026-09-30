import { describe, expect, it } from 'vitest';
import { isWithinWorkHours, type WorkHours } from './work-hours';

// Tashkent is UTC+5 all year, so 10:00 there is 05:00 UTC.
const hours: WorkHours = { timezone: 'Asia/Tashkent', days: [1, 2, 3, 4, 5], from: '10:00', to: '19:00' };
const at = (iso: string) => new Date(iso);

describe('isWithinWorkHours', () => {
  it('is false one minute before the start', () => {
    expect(isWithinWorkHours(at('2026-09-30T04:59:00Z'), hours)).toBe(false); // Wed 09:59
  });

  it('includes the start', () => {
    expect(isWithinWorkHours(at('2026-09-30T05:00:00Z'), hours)).toBe(true); // Wed 10:00
  });

  it('is true at the last minute', () => {
    expect(isWithinWorkHours(at('2026-09-30T13:59:00Z'), hours)).toBe(true); // Wed 18:59
  });

  it('excludes the end', () => {
    expect(isWithinWorkHours(at('2026-09-30T14:00:00Z'), hours)).toBe(false); // Wed 19:00
  });

  it('is false on weekends', () => {
    expect(isWithinWorkHours(at('2026-10-03T08:00:00Z'), hours)).toBe(false); // Sat 13:00
    expect(isWithinWorkHours(at('2026-10-04T08:00:00Z'), hours)).toBe(false); // Sun 13:00
  });

  it('uses the weekday of the work time zone, not UTC', () => {
    // Fri 23:30 UTC is already Sat 04:30 in Tashkent
    expect(isWithinWorkHours(at('2026-10-02T23:30:00Z'), hours)).toBe(false);
    // Sun 22:00 UTC is Mon 03:00 in Tashkent: still before the start
    expect(isWithinWorkHours(at('2026-10-04T22:00:00Z'), hours)).toBe(false);
    // Mon 05:00 UTC is Mon 10:00 in Tashkent
    expect(isWithinWorkHours(at('2026-10-05T05:00:00Z'), hours)).toBe(true);
  });
});
