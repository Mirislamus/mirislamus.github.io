export const updateTheme = (theme: string) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isSystem = theme === 'system';
  const resolvedTheme = isSystem ? (prefersDark.matches ? 'dark' : 'light') : theme;

  document.documentElement.setAttribute('data-theme', resolvedTheme);

  if (isSystem) {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', theme);
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolvedTheme === 'dark' ? '#121212' : '#ffffff');
};
