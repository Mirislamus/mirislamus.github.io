import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale } from './locales';

describe('locales', () => {
  it('has the default locale in the list', () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });

  it('describes every locale', () => {
    expect(Object.keys(LOCALE_META).sort()).toEqual([...LOCALES].sort());
    for (const locale of LOCALES) {
      expect(LOCALE_META[locale].label).toBe(locale.toUpperCase());
      expect(LOCALE_META[locale].ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    }
  });

  it('recognises supported locales only', () => {
    expect(isLocale('ru')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
