// The single source of truth for supported locales. Everything else (Astro config, routes,
// <head> tags, the language switcher, data typing) derives from this list.
export const LOCALES = ['en', 'ru', 'uz'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_META: Record<Locale, { label: string; ogLocale: string }> = {
  en: { label: 'EN', ogLocale: 'en_US' },
  ru: { label: 'RU', ogLocale: 'ru_RU' },
  uz: { label: 'UZ', ogLocale: 'uz_UZ' },
};

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);
