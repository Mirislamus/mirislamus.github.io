export type Theme = 'light' | 'dark';
export type ThemeMode = Theme | 'system';

export const THEME_STORAGE_KEY = 'theme';

// Values for <meta name="theme-color">: the browser UI takes the color of the page background.
export const THEME_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#121212' };

// Runs inline in <head> (see Head.astro) before the first paint, so the page never flashes the wrong
// theme. It must stay self-contained: it is serialized with `toString()` and cannot use imports.
export function bootstrapTheme(storageKey: string, colors: Record<string, string>): void {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    // Storage can be blocked (privacy settings, some in-app browsers); fall back to the system theme.
  }

  const dark = stored === 'dark' || (stored !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = dark ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute('content', colors[theme]));
}
