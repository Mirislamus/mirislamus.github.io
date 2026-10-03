import { createScoreRng, noteToFrequency } from '../matrix/sound-score';

// The score of the takeover (J-05): which notes and when. Pure functions only, so it is tested without any audio.
// Our own darksynth in the manner of the genre, not a melody of any game: E minor, 112 bpm, a driving bass in sixteenth
// notes, a four-on-the-floor kick, a snare on 2 and 4, a gated pad and a rare lead. One round is eight bars (Em–C–G–D, twice).
export { createScoreRng, noteToFrequency };

export const BPM = 112;
export const BEAT = 60 / BPM; // seconds
export const STEP = BEAT / 4; // the music moves in sixteenth notes
export const BARS = 8; // the loop
const STEPS_PER_BAR = 16;

// The chords of the loop: the root (for the bass) and the notes of the pad.
const CHORDS = [
  { root: 'E1', pad: ['E3', 'G3', 'B3'] }, // Em
  { root: 'C2', pad: ['C3', 'E3', 'G3'] }, // C
  { root: 'G1', pad: ['G3', 'B3', 'D4'] }, // G
  { root: 'D2', pad: ['D3', 'F#3', 'A3'] }, // D
] as const;

export const barOf = (step: number) => Math.floor(step / STEPS_PER_BAR) % BARS;
export const chordOf = (step: number) => CHORDS[barOf(step) % CHORDS.length];

// The bass: the root of the chord on every sixteenth, an octave higher on the "and" of the beat and on the last note of
// a half bar, which gives the push of the genre.
export const bassNote = (step: number): string => {
  const root = chordOf(step).root;
  const inBar = step % STEPS_PER_BAR;
  const up = inBar % 4 === 3 || inBar === 14;
  if (!up) return root;
  return root.replace(/\d/, digit => String(Number(digit) + 1));
};

export const bassFrequency = (step: number) => noteToFrequency(bassNote(step));

export const kickAt = (step: number) => step % 4 === 0;
export const snareAt = (step: number) => step % 16 === 4 || step % 16 === 12;
export const hatAt = (step: number) => step % 4 === 2;

// The pad plays gated: a chord on every eighth note, so it pumps with the kick.
export const padAt = (step: number) => step % 2 === 0;
export const padNotes = (step: number): readonly string[] => chordOf(step).pad;

// The cutoff of the bass filter: closed on the odd bars and open on the even ones, so the sound opens every second bar.
export const bassCutoff = (step: number): number => (barOf(step) % 2 === 1 ? 1500 : 520);

// The lead plays only in the second half of the loop: a few notes of the E minor pentatonic, picked by the generator.
export const LEAD_NOTES = ['E4', 'G4', 'A4', 'B4', 'D5', 'E5'] as const;

export interface LeadStep {
  note: string | null;
  /** In sixteenth notes: how long it rings. */
  length: number;
}

export const leadStep = (step: number, rng: () => number): LeadStep => {
  if (barOf(step) < BARS / 2 || step % 2 !== 0) return { note: null, length: 0 };
  if (rng() > 0.3) return { note: null, length: 0 };
  return { note: LEAD_NOTES[Math.floor(rng() * LEAD_NOTES.length)], length: 1 + Math.floor(rng() * 3) };
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
