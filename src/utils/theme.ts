export type Theme = 'dark' | 'light' | 'system';

export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getCurrentTheme = (): Theme => {
  if (typeof localStorage === 'undefined') return 'system';

  const storedTheme = localStorage.getItem('theme');

  return storedTheme as Theme;
};

export const resolveTheme = (theme: Theme) => {
  return theme === 'system' ? getSystemTheme() : theme;
};

export const applyTheme = (resolvedTheme: Theme) => {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', resolvedTheme);

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolvedTheme === 'dark' ? '#121212' : '#ffffff');
};

export const updateTheme = (theme: Theme) => {
  const resolved = resolveTheme(theme);

  applyTheme(resolved);
  localStorage.setItem('theme', theme);

  window.dispatchEvent(new CustomEvent('themechange', { detail: resolved }));
};

export const subscribeToSystemThemeChange = (onChange: (theme: Theme) => void) => {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (event: MediaQueryListEvent) => {
    onChange(event.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
};
