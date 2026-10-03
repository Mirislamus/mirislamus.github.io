import { describe, expect, it } from 'vitest';
import {
  BARS,
  BEAT,
  BPM,
  STEP,
  arpCutoff,
  arpNote,
  arpVelocity,
  barOf,
  bassCutoff,
  bassFrequency,
  bassNote,
  blipAt,
  chordOf,
  createScoreRng,
  duckAt,
  hatAt,
  kickAt,
  leadStep,
  padAt,
  padNotes,
  relicMoodFor,
  snareAt,
} from './relic-score';

const BAR = 16;
const steps = (test: (step: number) => unknown) =>
  Array.from({ length: BAR }, (_, step) => step).filter(step => test(step));

describe('the tempo', () => {
  it('is 128 bpm, sixteenth notes', () => {
    expect(BPM).toBe(128);
    expect(BEAT).toBeCloseTo(0.46875, 5);
    expect(STEP * 4).toBeCloseTo(BEAT, 10);
  });
});

describe('the loop', () => {
  it('is eight bars of Cm, Ab, Eb, Bb twice, and then starts again', () => {
    const roots = Array.from({ length: BARS }, (_, bar) => chordOf(bar * BAR).root);
    expect(roots).toEqual(['C2', 'G#1', 'D#2', 'A#1', 'C2', 'G#1', 'D#2', 'A#1']);
    expect(chordOf(BARS * BAR).root).toBe('C2');
    expect(barOf(BARS * BAR)).toBe(0);
    expect(barOf(BARS * BAR - 1)).toBe(BARS - 1);
  });
});

describe('the bass', () => {
  it('plays the root of the chord and goes an octave up on the pushes', () => {
    expect(bassNote(0)).toBe('C2');
    expect(bassNote(3)).toBe('C3');
    expect(bassNote(6)).toBe('C3');
    expect(bassNote(11)).toBe('C3');
    expect(bassNote(14)).toBe('C3');
    expect(bassNote(4)).toBe('C2');
    expect(bassNote(BAR)).toBe('G#1'); // the second bar is Ab
    expect(bassNote(BAR + 3)).toBe('G#2');
  });

  it('turns notes into frequencies', () => {
    expect(bassFrequency(0)).toBeCloseTo(65.41, 1); // C2
    expect(bassFrequency(3)).toBeCloseTo(130.81, 1); // C3
  });

  it('opens the filter every second bar', () => {
    expect(bassCutoff(0)).toBeLessThan(bassCutoff(BAR));
    expect(bassCutoff(BAR * 2)).toBe(bassCutoff(0));
  });
});

describe('the drums', () => {
  it('has a kick on every beat, a snare on 2 and 4, and the synths duck with the kick', () => {
    expect(steps(kickAt)).toEqual([0, 4, 8, 12]);
    expect(steps(snareAt)).toEqual([4, 12]);
    expect(steps(duckAt)).toEqual(steps(kickAt));
  });

  it('puts an open hat between the kicks and a closed one on the odd sixteenths', () => {
    expect(steps(step => hatAt(step) === 'open')).toEqual([2, 6, 10, 14]);
    expect(steps(step => hatAt(step) === 'closed')).toEqual([1, 3, 5, 7, 9, 11, 13, 15]);
    expect(hatAt(0)).toBeNull();
  });
});

describe('the pad', () => {
  it('strikes once a bar with the notes of the chord', () => {
    expect(steps(padAt)).toEqual([0]);
    expect(padNotes(0)).toEqual(['C3', 'D#3', 'G3']);
    expect(padNotes(BAR * 3)).toEqual(['A#3', 'D3', 'F3']);
  });
});

describe('the arpeggio', () => {
  it('runs over the chord on every sixteenth: root, third, fifth, octave, fifth, third…', () => {
    const bar = Array.from({ length: 8 }, (_, step) => arpNote(step));
    expect(bar).toEqual(['C4', 'D#4', 'G4', 'C5', 'G4', 'D#4', 'G4', 'D#4']);
    expect(arpNote(BAR)).toBe('G#4'); // Ab
  });

  it('is louder on the beat', () => {
    expect(arpVelocity(0)).toBeGreaterThan(arpVelocity(2));
    expect(arpVelocity(2)).toBeGreaterThan(arpVelocity(1));
  });

  it('opens its filter bar by bar and falls back at the start of the next round', () => {
    expect(arpCutoff(BAR)).toBeGreaterThan(arpCutoff(0));
    expect(arpCutoff((BARS - 1) * BAR)).toBeGreaterThan(arpCutoff(BAR));
    expect(arpCutoff(BARS * BAR)).toBe(arpCutoff(0));
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
    for (const note of notes) expect(['C5', 'D#5', 'F5', 'G5', 'A#5', 'C6']).toContain(note);
  });
});

describe('the data blips', () => {
  it('never fall on a beat, are rare, high, and the same for the same seed', () => {
    const rng = createScoreRng(3);
    const found = Array.from({ length: BARS * BAR }, (_, step) => [step, blipAt(step, rng)] as const).filter(
      ([, hz]) => hz !== null
    );
    expect(found.length).toBeGreaterThan(0);
    expect(found.length).toBeLessThan(BARS * BAR * 0.2);
    for (const [step, hz] of found) {
      expect(step % 4).not.toBe(0);
      expect(hz).toBeGreaterThanOrEqual(1200);
      expect(hz).toBeLessThanOrEqual(3200);
    }
  });
});

describe('the mood', () => {
  it('is quieter and brighter on a light page', () => {
    expect(relicMoodFor(true).volume).toBeLessThan(relicMoodFor(false).volume);
    expect(relicMoodFor(true).brightness).toBeGreaterThan(relicMoodFor(false).brightness);
  });
});
