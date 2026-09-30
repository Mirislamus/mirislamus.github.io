// The intro styles live under html[data-intro]; once the choreography is over the attribute goes away
// so nothing keeps holding the final animation state.
const INTRO_DURATION_MS = 1600;
const root = document.documentElement;

if (root.hasAttribute('data-intro')) {
  window.setTimeout(() => root.removeAttribute('data-intro'), INTRO_DURATION_MS);
}

export {};
