export type Theme = 'light' | 'dark';
export type ThemeMode = Theme | 'system';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#121212' };

export function bootstrapTheme(storageKey: string, colors: Record<string, string>): void {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {}

  const dark = stored === 'dark' || (stored !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = dark ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', theme);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach(meta => meta.setAttribute('content', colors[theme] ?? ''));
}
