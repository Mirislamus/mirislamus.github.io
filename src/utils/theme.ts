import { modeAtom, themeAtom, mountedAtom } from '@shared/stores';

export type Theme = 'light' | 'dark';
export type ThemeMode = Theme | 'system';

const STORAGE_KEY = 'theme';

export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getStoredThemeMode = (): ThemeMode | null => {
  if (typeof localStorage === 'undefined') return null;

  const value = localStorage.getItem(STORAGE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }

  return null;
};

export const resolveTheme = (mode: ThemeMode | null): Theme => {
  if (mode === 'light' || mode === 'dark') return mode;
  return getSystemTheme();
};

export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', theme);

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
};

export const initTheme = () => {
  const mode = getStoredThemeMode();

  if (!mode || mode === 'system') {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    return;
  }

  applyTheme(mode);
};

export const setThemeMode = (mode: ThemeMode) => {
  if (mode === 'system') {
    localStorage.removeItem(STORAGE_KEY);
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);

    window.dispatchEvent(new CustomEvent('themechange', { detail: systemTheme }));

    return;
  }

  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);

  window.dispatchEvent(new CustomEvent('themechange', { detail: mode }));
};

export const initThemeStore = () => {
  const sync = () => {
    const mode = getStoredThemeMode() ?? 'system';
    const theme = resolveTheme(mode);

    modeAtom.set(mode);
    themeAtom.set(theme);
  };

  sync();
  mountedAtom.set(true);

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = () => sync();
  const onThemeChange = () => sync();

  media.addEventListener('change', onSystemChange);
  window.addEventListener('themechange', onThemeChange);

  return () => {
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('themechange', onThemeChange);
  };
};
