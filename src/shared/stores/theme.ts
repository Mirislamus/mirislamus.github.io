import { atom } from 'nanostores';
import type { Theme, ThemeMode } from '@utils/theme';

export const modeAtom = atom<ThemeMode>('system');

export const themeAtom = atom<Theme>('dark');

export const mountedAtom = atom<boolean>(false);
