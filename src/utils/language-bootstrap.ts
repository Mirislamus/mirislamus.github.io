export const pickLanguage = (locales: readonly string[], fallback: string) => {
  const fromPath = location.pathname.split('/')[1];
  const preferred = navigator.languages.map(language => language.slice(0, 2));
  const lang =
    [fromPath, ...preferred].find((code): code is string => code !== undefined && locales.includes(code)) ?? fallback;

  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('main section').forEach(section => {
    section.hidden = section.lang !== lang;
  });
};
