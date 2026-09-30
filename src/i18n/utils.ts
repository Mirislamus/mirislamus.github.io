import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, type Locale } from './locales';

// Server-side only: imported from .astro frontmatter.
export const getLocale = (astro: { currentLocale?: string }): Locale =>
  isLocale(astro.currentLocale) ? astro.currentLocale : DEFAULT_LOCALE;

export const localeUrl = (locale: Locale): string => getRelativeLocaleUrl(locale);

export const absoluteLocaleUrl = (locale: Locale): string => getAbsoluteLocaleUrl(locale);

export interface LanguageLink {
  code: Locale;
  label: string;
  name: string;
  href: string;
}

export const getLanguageLinks = (current: Locale): LanguageLink[] => {
  const names = new Intl.DisplayNames([current], { type: 'language' });

  return LOCALES.map(code => ({
    code,
    label: LOCALE_META[code].label,
    name: names.of(code) ?? code,
    href: localeUrl(code),
  }));
};

export const staticLocalePaths = () =>
  LOCALES.map(code => ({ params: { lang: code === DEFAULT_LOCALE ? undefined : code } }));
