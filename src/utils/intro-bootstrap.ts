export const INTRO_STORAGE_KEY = 'intro-played';

// Runs inline in <head> before the first paint (see Head.astro). The Hero intro plays once per browser
// tab session; the flag is written right away, so a language switch or reload never replays it.
// Without an attribute the page is simply static. Must stay self-contained: it is serialized with toString().
export function bootstrapIntro(storageKey: string): void {
  try {
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || // motion is not wanted
      window.location.hash !== '' || // a deep link: the visitor is not looking at the top
      window.sessionStorage.getItem(storageKey) !== null; // already played in this tab

    if (skip) return;

    window.sessionStorage.setItem(storageKey, '1');
    document.documentElement.setAttribute('data-intro', '');
  } catch {
    // Storage is blocked: no intro rather than an intro on every navigation.
  }
}
