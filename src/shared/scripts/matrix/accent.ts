import { at } from '@/utils/list';
import { subscribeTheme } from '@/utils/theme';

export type Rgb = [number, number, number];

export const parseColor = (value: string): Rgb | null => {
  const text = value.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text);
  if (hex) {
    const digits = at(hex, 1);
    const full = digits.length === 3 ? [...digits].map(c => c + c).join('') : digits;
    const channel = (start: number) => parseInt(full.slice(start, start + 2), 16);
    return [channel(0), channel(2), channel(4)];
  }

  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(text);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
};

export const mix = (a: Rgb, b: Rgb, amount: number): Rgb => {
  const blend = (i: 0 | 1 | 2) => Math.round(a[i] * (1 - amount) + b[i] * amount);
  return [blend(0), blend(1), blend(2)];
};

export interface MatrixColors {
  accent: Rgb;
  head: Rgb;
  background: Rgb;
}

const FALLBACK: MatrixColors = { accent: [68, 255, 98], head: [225, 255, 230], background: [18, 18, 18] };

const readColors = (root: HTMLElement = document.documentElement): MatrixColors => {
  const style = getComputedStyle(root);
  const accent = parseColor(style.getPropertyValue('--accent-text'));
  const text = parseColor(style.getPropertyValue('--text'));
  if (!accent) return FALLBACK;
  const background = parseColor(style.getPropertyValue('--background')) ?? FALLBACK.background;
  return { accent, head: text ? mix(accent, text, 0.45) : accent, background };
};

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
