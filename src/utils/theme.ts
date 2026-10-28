import { THEME_COLORS, THEME_STORAGE_KEY, type Theme, type ThemeMode } from './theme-bootstrap';

export type { Theme, ThemeMode };

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
  } catch {}
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

const readTokenMs = (name: string, fallback: number) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const match = /^(\d*\.?\d+)(ms|s)$/.exec(value);
  return match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : fallback;
};

let transitionId = 0;

export const setThemeMode = (mode: ThemeMode, origin?: ThemeOrigin) => {
  const root = document.documentElement;
  const willChange = resolve(mode) !== root.getAttribute('data-theme');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!origin || !willChange || reduceMotion || typeof document.startViewTransition !== 'function') {
    commit(mode);
    return;
  }

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
        },
      );
    })
    .catch(() => {});

  void transition.finished.finally(() => {
    if (id === transitionId) root.classList.remove('theme-transition');
  });
};

export const initTheme = () => {
  currentMode = readStoredMode();
  apply();
  notify();

  systemQuery().addEventListener('change', () => {
    if (getThemeMode() !== 'system') return;
    apply();
    notify();
  });

  window.addEventListener('storage', event => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    currentMode = readStoredMode();
    apply();
    notify();
  });
};
