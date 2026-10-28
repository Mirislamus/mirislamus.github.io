import * as simpleIcons from 'simple-icons';

interface SimpleIcon {
  slug: string;
  path: string;
  hex: string;
}

const bySlug = new Map(
  Object.values(simpleIcons as Record<string, unknown>)
    .filter((value): value is SimpleIcon => typeof value === 'object' && value !== null && 'slug' in value)
    .map(icon => [icon.slug, icon]),
);

const luminance = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (channel: number) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

export const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const LIGHT_PAGE = 'ffffff';
const DARK_PAGE = '121212';
const MIN_CONTRAST = 3;

export interface SkillIcon {
  path: string;
  brandLight: string | null;
  brandDark: string | null;
}

export const getSkillIcon = (slug: string): SkillIcon => {
  const icon = bySlug.get(slug);
  if (!icon) throw new Error(`[skills] Simple Icons has no icon "${slug}"`);
  return {
    path: icon.path,
    brandLight: contrast(icon.hex, LIGHT_PAGE) >= MIN_CONTRAST ? `#${icon.hex}` : null,
    brandDark: contrast(icon.hex, DARK_PAGE) >= MIN_CONTRAST ? `#${icon.hex}` : null,
  };
};

export const monogramOf = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words.map(word => word[0]).join('') : name.slice(0, 2);
  return letters.slice(0, 2).replace(/^./, first => first.toUpperCase());
};
