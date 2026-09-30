import { useSyncExternalStore } from 'react';
import { getTheme, subscribeTheme, type Theme } from '@utils/theme';

// On the server (and during hydration) the answer is a neutral default; the real value arrives right after.
export const useTheme = (): Theme => useSyncExternalStore(subscribeTheme, getTheme, () => 'dark');
