import { at, pick } from '@/utils/list';

import { createScoreRng, noteToFrequency } from '../matrix/sound-score';

export { createScoreRng, noteToFrequency };

export const BPM = 128;
export const BEAT = 60 / BPM;
export const STEP = BEAT / 4;
export const BARS = 8;
const STEPS_PER_BAR = 16;

const CHORDS = [
  { root: 'C2', tones: ['C', 'D#', 'G'] },
  { root: 'G#1', tones: ['G#', 'C', 'D#'] },
  { root: 'D#2', tones: ['D#', 'G', 'A#'] },
  { root: 'A#1', tones: ['A#', 'D', 'F'] },
] as const;

export const barOf = (step: number) => Math.floor(step / STEPS_PER_BAR) % BARS;
export const chordOf = (step: number) => at(CHORDS, barOf(step) % CHORDS.length);

const raise = (note: string, octaves: number) => note.replace(/\d$/, digit => String(Number(digit) + octaves));

export const bassNote = (step: number): string => {
  const root = chordOf(step).root;
  const inBar = step % STEPS_PER_BAR;
  return inBar === 3 || inBar === 6 || inBar === 11 || inBar === 14 ? raise(root, 1) : root;
};

export const bassFrequency = (step: number) => noteToFrequency(bassNote(step));

export const bassCutoff = (step: number): number => (barOf(step) % 2 === 1 ? 1600 : 600);

export const kickAt = (step: number) => step % 4 === 0;
export const duckAt = kickAt;
export const snareAt = (step: number) => step % 16 === 4 || step % 16 === 12;
export type Hat = 'open' | 'closed' | null;
export const hatAt = (step: number): Hat => (step % 4 === 2 ? 'open' : step % 2 === 1 ? 'closed' : null);

export const padAt = (step: number) => step % STEPS_PER_BAR === 0;
export const padNotes = (step: number): string[] => chordOf(step).tones.map(tone => `${tone}3`);

const ARP_SHAPE = [0, 1, 2, 3, 2, 1, 2, 1] as const;
export const arpNote = (step: number): string => {
  const tones = chordOf(step).tones;
  const index = at(ARP_SHAPE, step % ARP_SHAPE.length);
  return index === 3 ? `${at(tones, 0)}5` : `${at(tones, index)}4`;
};
export const arpVelocity = (step: number): number => (step % 4 === 0 ? 1 : step % 2 === 0 ? 0.7 : 0.5);
export const arpCutoff = (step: number): number => 700 + (barOf(step) % BARS) * 380;

const LEAD_NOTES = ['C5', 'D#5', 'F5', 'G5', 'A#5', 'C6'] as const;

export interface LeadStep {
  note: string | null;
  length: number;
}

export const leadStep = (step: number, rng: () => number): LeadStep => {
  if (barOf(step) < BARS / 2 || step % 2 !== 0) return { note: null, length: 0 };
  if (rng() > 0.3) return { note: null, length: 0 };
  return { note: pick(LEAD_NOTES, rng()), length: 2 + Math.floor(rng() * 3) };
};

export const blipAt = (step: number, rng: () => number): number | null => {
  if (step % 4 === 0 || rng() > 0.07) return null;
  return 1200 + Math.floor(rng() * 6) * 400;
};

export interface RelicMood {
  volume: number;
  brightness: number;
}

export const relicMoodFor = (light: boolean): RelicMood =>
  light ? { volume: 0.8, brightness: 1.25 } : { volume: 1, brightness: 1 };
