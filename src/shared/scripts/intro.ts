const INTRO_DURATION_MS = 1600;
const root = document.documentElement;

if (root.hasAttribute('data-intro')) {
  window.setTimeout(() => root.removeAttribute('data-intro'), INTRO_DURATION_MS);
}

export {};
