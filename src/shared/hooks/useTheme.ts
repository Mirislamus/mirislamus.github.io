import { useSyncExternalStore } from 'react';
import { getTheme, getThemeMode, subscribeTheme, type Theme, type ThemeMode } from '@utils/theme';

// On the server (and during hydration) the answer is a neutral default; the real value arrives right after.
export const useThemeMode = (): ThemeMode => useSyncExternalStore(subscribeTheme, getThemeMode, () => 'system');

export const useTheme = (): Theme => useSyncExternalStore(subscribeTheme, getTheme, () => 'dark');
