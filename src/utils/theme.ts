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

export const subscribeToSystemThemeChange = (onChange: (theme: Theme) => void) => {
  if (typeof window === 'undefined') return;

  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    const stored = getStoredThemeMode();

    if (!stored || stored === 'system') {
      onChange(e.matches ? 'dark' : 'light');
    }
  };

  media.addEventListener('change', handler);
  return () => media.removeEventListener('change', handler);
};
