import { getCurrentTheme, type Theme } from '@utils/theme';
import { useEffect, useState } from 'react';

export const useThemeWatcher = () => {
  const [theme, setTheme] = useState(() => getCurrentTheme() as Theme);

  useEffect(() => {
    const handler = (e: Event) => {
      const newTheme = (e as CustomEvent).detail as Theme;
      setTheme(newTheme);
    };

    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);

  return theme;
};
