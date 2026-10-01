// The glyph set of the Matrix effects: half-width katakana (twice as likely), code symbols and digits.
const KATAKANA = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
const CODE = '{}<>/=;()[]$#*+';
const DIGITS = '0123456789';

export const GLYPHS: readonly string[] = [...KATAKANA, ...KATAKANA, ...CODE, ...DIGITS];

export type Rng = () => number;

// mulberry32: a tiny seeded generator. Every still frame (reduced motion, pause, screenshots) is the same on each run.
export const createRng = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const pickGlyph = (rng: Rng): string => GLYPHS[Math.floor(rng() * GLYPHS.length)];
