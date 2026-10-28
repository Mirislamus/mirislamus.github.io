import { at } from '@/utils/list';
const BPM = 72;
export const BEAT = 60 / BPM;
export const STEP = BEAT / 2;

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};

export const noteToFrequency = (note: string): number => {
  const match = /^([A-G]#?)(-?\d)$/.exec(note);
  if (!match) throw new Error(`Not a note: ${note}`);
  const index = NOTE_INDEX[at(match, 1)];
  if (index === undefined) throw new Error(`Not a note: ${note}`);
  const semitones = index + (Number(match[2]) + 1) * 12 - 69;
  return 440 * 2 ** (semitones / 12);
};

export const ARP_NOTES = ['A3', 'C4', 'E4', 'G4', 'B3', 'E4', 'A4', 'C5', 'G3', 'D4', 'E4', 'B4'] as const;
const REST_CHANCE = 0.55;

export const createScoreRng = (seed = 20) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export interface ArpStep {
  note: string | null;
  velocity: number;
}

export const arpStep = (index: number, rng: () => number): ArpStep => {
  const rest = rng() < REST_CHANCE && index % 8 !== 0;
  if (rest) return { note: null, velocity: 0 };
  const walk = Math.floor(rng() * 3);
  const note = at(ARP_NOTES, (index + walk) % ARP_NOTES.length);
  return { note, velocity: index % 8 === 0 ? 1 : 0.6 + 0.25 * rng() };
};

export interface Mood {
  arpOctaves: number;
  droneCutoff: number;
  volume: number;
}

export const moodFor = (light: boolean): Mood =>
  light ? { arpOctaves: 1, droneCutoff: 320, volume: 0.8 } : { arpOctaves: 0, droneCutoff: 190, volume: 1 };
