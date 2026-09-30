// Runs inline in <head>/<body> of the 404 page (see 404.astro), so it must not use anything from this
// module's scope: it is serialized with toString(). Shows the section that fits the visitor.
export const pickLanguage = (locales: readonly string[], fallback: string) => {
  const fromPath = location.pathname.split('/')[1];
  const preferred = navigator.languages.map(language => language.slice(0, 2));
  const lang = [fromPath, ...preferred].find(code => locales.includes(code)) ?? fallback;

  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('main section').forEach(section => {
    section.hidden = section.lang !== lang;
  });
};
