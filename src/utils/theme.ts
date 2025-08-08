export type Theme = 'dark' | 'light' | 'system';

export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getCurrentTheme = () => {
  if (typeof document === 'undefined') return 'system';
  return document.documentElement.getAttribute('data-theme') ?? 'system';
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
  const resolvedTheme = resolveTheme(theme);
  applyTheme(resolvedTheme);

  if (typeof localStorage === 'undefined') return;

  if (theme === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', theme);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themechange', { detail: resolvedTheme }));
  }
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
