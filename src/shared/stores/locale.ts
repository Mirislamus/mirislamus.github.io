import { atom } from 'nanostores';
import type { Locale } from '@typings/global';

export const localeAtom = atom<Locale>('en');

export const setLocale = (locale: Locale): void => {
  localeAtom.set(locale);
};
