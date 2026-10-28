export const INTRO_STORAGE_KEY = 'intro-played';

export function bootstrapIntro(storageKey: string): void {
  try {
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.location.hash !== '' ||
      window.sessionStorage.getItem(storageKey) !== null;

    if (skip) return;

    window.sessionStorage.setItem(storageKey, '1');
    document.documentElement.setAttribute('data-intro', '');
  } catch {}
}
