export type Theme = 'light' | 'dark';
export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

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
