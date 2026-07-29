import { atom } from 'nanostores';
import type { Locale } from '@typings/global';

const supportedLocales: Locale[] = ['en', 'ru', 'uz'];

const getInitialLocale = (): Locale => {
  if (typeof document === 'undefined') return 'en';

  const { lang } = document.documentElement;
  return supportedLocales.includes(lang as Locale) ? (lang as Locale) : 'en';
};

export const localeAtom = atom<Locale>(getInitialLocale());

export const setLocale = (locale: Locale): void => {
  localeAtom.set(locale);
};
