// The score of the pill scene (S-02): which notes and when. Pure functions only, so it can be tested without any audio.
// The music is dark and slow: a drone on A, a pulse like a heartbeat and a sparse arpeggio in A minor.
const BPM = 72;
export const BEAT = 60 / BPM; // seconds
export const STEP = BEAT / 2; // the arpeggio moves in eighth notes

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

// "A4" is 440 Hz.
export const noteToFrequency = (note: string): number => {
  const match = /^([A-G]#?)(-?\d)$/.exec(note);
  if (!match) throw new Error(`Not a note: ${note}`);
  const semitones = NOTE_INDEX[match[1]] + (Number(match[2]) + 1) * 12 - 69;
  return 440 * 2 ** (semitones / 12);
};

// A minor: the notes the arpeggio walks over, in the order it plays them.
export const ARP_NOTES = ['A3', 'C4', 'E4', 'G4', 'B3', 'E4', 'A4', 'C5', 'G3', 'D4', 'E4', 'B4'] as const;
const REST_CHANCE = 0.55; // an eighth note in this share of cases is a rest

// A small seeded generator: the same seed gives the same melody on every run (tests, and no surprises).
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
  /** The note to play, or null for a rest. */
  note: string | null;
  /** 0..1: how loud (the first eighth of a bar is stronger). */
  velocity: number;
}

// The arpeggio step number `index` (0, 1, 2…): the note walks through ARP_NOTES, with rests picked by the generator.
export const arpStep = (index: number, rng: () => number): ArpStep => {
  const rest = rng() < REST_CHANCE && index % 8 !== 0; // the start of a bar always sounds
  if (rest) return { note: null, velocity: 0 };
  const walk = Math.floor(rng() * 3); // a small step back and forth, so it is not a plain loop
  const note = ARP_NOTES[(index + walk) % ARP_NOTES.length];
  return { note, velocity: index % 8 === 0 ? 1 : 0.6 + 0.25 * rng() };
};

// How loud and how high the music is on a light page and on a dark one (S-03: tuned for the theme).
export interface Mood {
  /** Octaves the arpeggio is moved up. */
  arpOctaves: number;
  /** The cutoff of the low-pass filter of the drone, Hz. */
  droneCutoff: number;
  /** The share of the maximum volume. */
  volume: number;
}

export const moodFor = (light: boolean): Mood =>
  light ? { arpOctaves: 1, droneCutoff: 320, volume: 0.8 } : { arpOctaves: 0, droneCutoff: 190, volume: 1 };
