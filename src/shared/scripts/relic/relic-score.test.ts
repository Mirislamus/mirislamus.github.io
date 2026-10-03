import { describe, expect, it } from 'vitest';
import {
  BARS,
  BEAT,
  BPM,
  STEP,
  barOf,
  bassCutoff,
  bassFrequency,
  bassNote,
  chordOf,
  createScoreRng,
  hatAt,
  kickAt,
  leadStep,
  padAt,
  padNotes,
  relicMoodFor,
  snareAt,
} from './relic-score';

const BAR = 16;

describe('the tempo', () => {
  it('is 112 bpm, sixteenth notes', () => {
    expect(BPM).toBe(112);
    expect(BEAT).toBeCloseTo(0.5357, 3);
    expect(STEP * 4).toBeCloseTo(BEAT, 10);
  });
});

describe('the loop', () => {
  it('is eight bars of Em, C, G, D twice, and then starts again', () => {
    const roots = Array.from({ length: BARS * 2 }, (_, bar) => chordOf(bar * BAR).root);
    expect(roots).toEqual([
      'E1',
      'C2',
      'G1',
      'D2',
      'E1',
      'C2',
      'G1',
      'D2',
      'E1',
      'C2',
      'G1',
      'D2',
      'E1',
      'C2',
      'G1',
      'D2',
    ]);
    expect(barOf(BARS * BAR)).toBe(0);
    expect(barOf(BARS * BAR - 1)).toBe(BARS - 1);
  });
});

describe('the bass', () => {
  it('plays the root of the chord and goes an octave up on the pushes', () => {
    expect(bassNote(0)).toBe('E1');
    expect(bassNote(3)).toBe('E2');
    expect(bassNote(14)).toBe('E2');
    expect(bassNote(BAR)).toBe('C2'); // the second bar is C
    expect(bassNote(BAR + 3)).toBe('C3');
  });

  it('turns notes into frequencies', () => {
    expect(bassFrequency(0)).toBeCloseTo(41.2, 1); // E1
    expect(bassFrequency(3)).toBeCloseTo(82.41, 1); // E2
  });

  it('opens the filter every second bar', () => {
    expect(bassCutoff(0)).toBeLessThan(bassCutoff(BAR));
    expect(bassCutoff(BAR * 2)).toBe(bassCutoff(0));
  });
});

describe('the drums', () => {
  it('has a kick on every beat and a snare on 2 and 4', () => {
    const kicks = Array.from({ length: BAR }, (_, step) => kickAt(step));
    expect(kicks.filter(Boolean)).toHaveLength(4);
    expect([0, 4, 8, 12].every(step => kicks[step])).toBe(true);
    expect(Array.from({ length: BAR }, (_, step) => snareAt(step)).flatMap((on, step) => (on ? [step] : []))).toEqual([
      4, 12,
    ]);
  });

  it('puts the hats between the kicks', () => {
    expect(Array.from({ length: BAR }, (_, step) => hatAt(step)).flatMap((on, step) => (on ? [step] : []))).toEqual([
      2, 6, 10, 14,
    ]);
  });
});

describe('the pad', () => {
  it('pumps on every eighth note with the notes of the chord', () => {
    expect(padAt(0)).toBe(true);
    expect(padAt(1)).toBe(false);
    expect(padNotes(0)).toEqual(['E3', 'G3', 'B3']);
    expect(padNotes(BAR * 3)).toEqual(['D3', 'F#3', 'A3']);
  });
});

describe('the lead', () => {
  it('is silent in the first half of the loop and on the odd sixteenths', () => {
    const rng = createScoreRng(1);
    for (let step = 0; step < (BARS / 2) * BAR; step++) expect(leadStep(step, rng).note).toBeNull();
    for (let step = (BARS / 2) * BAR + 1; step < BARS * BAR; step += 2) expect(leadStep(step, rng).note).toBeNull();
  });

  it('plays a few notes of the pentatonic in the second half, the same every time for the same seed', () => {
    const play = () => {
      const rng = createScoreRng(7);
      return Array.from({ length: BARS * BAR }, (_, step) => leadStep(step, rng).note).filter(Boolean);
    };
    const notes = play();
    expect(notes.length).toBeGreaterThan(3);
    expect(notes.length).toBeLessThan(BAR * 3);
    expect(notes).toEqual(play());
    for (const note of notes) expect(['E4', 'G4', 'A4', 'B4', 'D5', 'E5']).toContain(note);
  });
});

describe('the mood', () => {
  it('is quieter and brighter on a light page', () => {
    expect(relicMoodFor(true).volume).toBeLessThan(relicMoodFor(false).volume);
    expect(relicMoodFor(true).brightness).toBeGreaterThan(relicMoodFor(false).brightness);
  });
});
