import { useEffect, useState } from 'react';
import type { Theme, ThemeMode } from '@utils/theme';
import {
  getStoredThemeMode,
  getSystemTheme,
} from '@utils/theme';

type UseThemeResult = {
  mode: ThemeMode;
  theme: Theme;
  mounted: boolean; 
};

export const useTheme = (): UseThemeResult => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredThemeMode();
    if (stored === 'light' || stored === 'dark') return stored;
    return getSystemTheme();
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => {
      const stored = getStoredThemeMode();

      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
        setTheme(stored);
      } else {
        setMode('system');
        setTheme(getSystemTheme());
      }
    };

    update();
    setMounted(true);

    window.addEventListener('themechange', update);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', update);

    return () => {
      window.removeEventListener('themechange', update);
      media.removeEventListener('change', update);
    };
  }, []);

  return { mode, theme, mounted };
};
