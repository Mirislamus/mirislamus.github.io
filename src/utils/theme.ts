import { THEME_COLORS, THEME_STORAGE_KEY, type Theme, type ThemeMode } from './theme-bootstrap';

export type { Theme, ThemeMode };

// A tiny external store for the theme: the DOM (`data-theme`) is the source of truth for styles,
// this module keeps the chosen mode and tells subscribers (React islands, buttons) when it changes.
const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const readStoredMode = (): ThemeMode => {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
};

const writeStoredMode = (mode: ThemeMode) => {
  try {
    if (mode === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage is blocked: the choice still applies to this page view.
  }
};

const resolve = (mode: ThemeMode): Theme => (mode === 'system' ? (systemQuery().matches ? 'dark' : 'light') : mode);

let currentMode: ThemeMode | undefined;
const listeners = new Set<() => void>();

const apply = () => {
  const theme = resolve(getThemeMode());
  document.documentElement.setAttribute('data-theme', theme);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach(meta => meta.setAttribute('content', THEME_COLORS[theme]));
};

const notify = () => listeners.forEach(listener => listener());

export const getThemeMode = (): ThemeMode => (currentMode ??= readStoredMode());

export const subscribeTheme = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export interface ThemeOrigin {
  x: number;
  y: number;
}

const commit = (mode: ThemeMode) => {
  currentMode = mode;
  writeStoredMode(mode);
  apply();
  notify();
};

// Reads a duration token such as "400ms" from CSS, so the wave uses the same timing as the rest of the site.
const readTokenMs = (name: string, fallback: number) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = /^(\d*\.?\d+)(ms|s)$/.exec(value);
  return match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : fallback;
};

let transitionId = 0;

// Switches the theme. With an origin (the clicked button) the new theme spreads from that point as a
// circle, using the View Transitions API; without support, without an origin, when motion is reduced
// or when the theme would not visibly change, it switches at once.
export const setThemeMode = (mode: ThemeMode, origin?: ThemeOrigin) => {
  const root = document.documentElement;
  const willChange = resolve(mode) !== root.getAttribute('data-theme');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!origin || !willChange || reduceMotion || typeof document.startViewTransition !== 'function') {
    commit(mode);
    return;
  }

  // The header and the content have their own transition names for language changes; during the
  // wave they must be part of the one root snapshot, or they would not be clipped by the circle.
  const id = ++transitionId;
  root.classList.add('theme-transition');

  const transition = document.startViewTransition(() => commit(mode));

  transition.ready
    .then(() => {
      const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: readTokenMs('--dur-slow', 400),
          easing: getComputedStyle(root).getPropertyValue('--ease-in-out').trim() || 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {
      // The transition was skipped (for example by a newer one): the theme is already applied.
    });

  void transition.finished.finally(() => {
    if (id === transitionId) root.classList.remove('theme-transition');
  });
};

// Called once per page load from Layout.astro.
export const initTheme = () => {
  currentMode = readStoredMode();
  apply();
  notify();

  // Follow the system theme while the mode is "system".
  systemQuery().addEventListener('change', () => {
    if (getThemeMode() !== 'system') return;
    apply();
    notify();
  });

  // Another tab changed the theme.
  window.addEventListener('storage', event => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    currentMode = readStoredMode();
    apply();
    notify();
  });
};
