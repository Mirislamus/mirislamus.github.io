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

export const setThemeMode = (mode: ThemeMode) => {
  currentMode = mode;
  writeStoredMode(mode);
  apply();
  notify();
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
