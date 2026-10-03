import { createScoreRng, noteToFrequency } from '../matrix/sound-score';

// The score of the takeover (J-05, remade as synthwave in J-08): which notes and when. Pure functions only, so it is tested
// without any audio. Our own cyberpunk synthwave, not a melody of any game or film: C minor, 128 bpm, a rolling bass in
// sixteenth notes, a four-on-the-floor kick that ducks the synths (the "pump"), a snare with a long reverb, a running
// arpeggio through an echo, a supersaw pad and, in the second half of the loop, a lead. One round is eight bars of
// Cm–Ab–Eb–Bb, twice.
export { createScoreRng, noteToFrequency };

export const BPM = 128;
export const BEAT = 60 / BPM; // seconds
export const STEP = BEAT / 4; // the music moves in sixteenth notes
export const BARS = 8; // the loop
const STEPS_PER_BAR = 16;

// The chords of the loop (sharps stand for flats: D# is E flat): the root for the bass and the notes of the pad and arpeggio.
const CHORDS = [
  { root: 'C2', tones: ['C', 'D#', 'G'] }, // Cm
  { root: 'G#1', tones: ['G#', 'C', 'D#'] }, // Ab
  { root: 'D#2', tones: ['D#', 'G', 'A#'] }, // Eb
  { root: 'A#1', tones: ['A#', 'D', 'F'] }, // Bb
] as const;

export const barOf = (step: number) => Math.floor(step / STEPS_PER_BAR) % BARS;
export const chordOf = (step: number) => CHORDS[barOf(step) % CHORDS.length];

const raise = (note: string, octaves: number) => note.replace(/\d$/, digit => String(Number(digit) + octaves));

// The bass: the root of the chord on every sixteenth, an octave higher on the pushes (the gallop of the genre).
export const bassNote = (step: number): string => {
  const root = chordOf(step).root;
  const inBar = step % STEPS_PER_BAR;
  return inBar === 3 || inBar === 6 || inBar === 11 || inBar === 14 ? raise(root, 1) : root;
};

export const bassFrequency = (step: number) => noteToFrequency(bassNote(step));

// The cutoff of the bass filter: it closes on the odd bars and opens on the even ones.
export const bassCutoff = (step: number): number => (barOf(step) % 2 === 1 ? 1600 : 600);

export const kickAt = (step: number) => step % 4 === 0;
// The synths duck on every kick (the pump), so the kick and the pads breathe together.
export const duckAt = kickAt;
export const snareAt = (step: number) => step % 16 === 4 || step % 16 === 12;
// Hats: an open one between the kicks, a quiet closed one on the odd sixteenths.
export type Hat = 'open' | 'closed' | null;
export const hatAt = (step: number): Hat => (step % 4 === 2 ? 'open' : step % 2 === 1 ? 'closed' : null);

// The pad: a long supersaw chord that is struck once a bar.
export const padAt = (step: number) => step % STEPS_PER_BAR === 0;
export const padNotes = (step: number): string[] => chordOf(step).tones.map(tone => `${tone}3`);

// The arpeggio runs on every sixteenth over the tones of the chord, up to the octave above: root, third, fifth, octave, fifth, third…
const ARP_SHAPE = [0, 1, 2, 3, 2, 1, 2, 1] as const;
export const arpNote = (step: number): string => {
  const tones = chordOf(step).tones;
  const index = ARP_SHAPE[step % ARP_SHAPE.length];
  return index === 3 ? `${tones[0]}5` : `${tones[index]}4`;
};
// A little louder on the beat, and louder over the loop: the filter opens bar by bar and falls back at the end of the round.
export const arpVelocity = (step: number): number => (step % 4 === 0 ? 1 : step % 2 === 0 ? 0.7 : 0.5);
export const arpCutoff = (step: number): number => 700 + (barOf(step) % BARS) * 380;

// The lead plays only in the second half of the loop: a few notes of the C minor pentatonic, picked by the generator.
export const LEAD_NOTES = ['C5', 'D#5', 'F5', 'G5', 'A#5', 'C6'] as const;

export interface LeadStep {
  note: string | null;
  /** In sixteenth notes: how long it rings. */
  length: number;
}

export const leadStep = (step: number, rng: () => number): LeadStep => {
  if (barOf(step) < BARS / 2 || step % 2 !== 0) return { note: null, length: 0 };
  if (rng() > 0.3) return { note: null, length: 0 };
  return { note: LEAD_NOTES[Math.floor(rng() * LEAD_NOTES.length)], length: 2 + Math.floor(rng() * 3) };
};

// Data blips: now and then a very short high tone between the beats, like a terminal answering. Returns Hz, or null.
export const blipAt = (step: number, rng: () => number): number | null => {
  if (step % 4 === 0 || rng() > 0.07) return null;
  return 1200 + Math.floor(rng() * 6) * 400;
};

// How loud and how bright the music is on a light page and on a dark one.
export interface RelicMood {
  /** The share of the maximum volume. */
  volume: number;
  /** Multiplies the cutoff of the bass filter. */
  brightness: number;
}

export const relicMoodFor = (light: boolean): RelicMood =>
  light ? { volume: 0.8, brightness: 1.25 } : { volume: 1, brightness: 1 };
