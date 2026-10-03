import { subscribeTheme } from '@utils/theme';

export type Rgb = [number, number, number];

// Reads the colors a browser reports for custom properties: "#44ff62", "rgb(68, 255, 98)" or "rgb(68 255 98 / 35%)".
export const parseColor = (value: string): Rgb | null => {
  const text = value.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map(c => c + c).join('') : hex[1];
    return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as Rgb;
  }

  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(text);
  return rgb ? ([rgb[1], rgb[2], rgb[3]].map(Number) as Rgb) : null;
};

export const mix = (a: Rgb, b: Rgb, amount: number): Rgb =>
  a.map((channel, i) => Math.round(channel * (1 - amount) + b[i] * amount)) as Rgb;

export interface MatrixColors {
  accent: Rgb;
  head: Rgb;
  /** The page background, for glyphs drawn on an accent fill. */
  background: Rgb;
}

const FALLBACK: MatrixColors = { accent: [68, 255, 98], head: [225, 255, 230], background: [18, 18, 18] };

// The accent of the current theme and the brighter color of a column head (accent mixed 55/45 with the text color).
const readColors = (root: HTMLElement = document.documentElement): MatrixColors => {
  const style = getComputedStyle(root);
  const accent = parseColor(style.getPropertyValue('--accent-text'));
  const text = parseColor(style.getPropertyValue('--text'));
  if (!accent) return FALLBACK;
  const background = parseColor(style.getPropertyValue('--background')) ?? FALLBACK.background;
  return { accent, head: text ? mix(accent, text, 0.45) : accent, background };
};

// Calls `listener` with fresh colors now and after every theme change.
// The takeover of Johnny Silverhand (`data-relic` on the root, J-03) repaints the accent as well, so it counts as a change.
export const watchColors = (listener: (colors: MatrixColors) => void) => {
  const update = () => listener(readColors());
  update();
  const unsubscribe = subscribeTheme(update);
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-relic'] });
  return () => {
    unsubscribe();
    observer.disconnect();
  };
};
