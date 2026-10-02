import { describe, expect, it } from 'vitest';
import { ARP_NOTES, BEAT, STEP, arpStep, createScoreRng, moodFor, noteToFrequency } from './sound-score';

describe('noteToFrequency', () => {
  it('knows the notes of the score', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440, 5);
    expect(noteToFrequency('A3')).toBeCloseTo(220, 5);
    expect(noteToFrequency('A1')).toBeCloseTo(55, 5);
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 1);
    expect(noteToFrequency('E5')).toBeCloseTo(659.26, 1);
  });

  it('rejects what is not a note', () => {
    expect(() => noteToFrequency('H4')).toThrow();
    expect(() => noteToFrequency('A')).toThrow();
  });
});

describe('the tempo', () => {
  it('is 72 beats a minute, the arpeggio moves in eighth notes', () => {
    expect(BEAT).toBeCloseTo(0.8333, 3);
    expect(STEP).toBeCloseTo(BEAT / 2, 10);
  });
});

describe('arpStep', () => {
  it('is the same melody for the same seed', () => {
    const run = () => {
      const rng = createScoreRng(20);
      return Array.from({ length: 64 }, (_, i) => arpStep(i, rng));
    };
    expect(run()).toEqual(run());
  });

  it('plays the start of every bar and leaves rests between', () => {
    const rng = createScoreRng(20);
    const steps = Array.from({ length: 64 }, (_, i) => arpStep(i, rng));
    for (let i = 0; i < 64; i += 8) expect(steps[i].note).not.toBeNull();
    const rests = steps.filter(step => step.note === null).length;
    expect(rests).toBeGreaterThan(15);
    expect(rests).toBeLessThan(50);
  });

  it('uses only the notes of the arpeggio and stays within 0..1 loudness', () => {
    const rng = createScoreRng(7);
    for (let i = 0; i < 200; i++) {
      const step = arpStep(i, rng);
      if (step.note) expect(ARP_NOTES as readonly string[]).toContain(step.note);
      expect(step.velocity).toBeGreaterThanOrEqual(0);
      expect(step.velocity).toBeLessThanOrEqual(1);
    }
  });
});

describe('moodFor', () => {
  it('is higher, brighter and a little quieter on a light page', () => {
    const light = moodFor(true);
    const dark = moodFor(false);
    expect(light.arpOctaves).toBeGreaterThan(dark.arpOctaves);
    expect(light.droneCutoff).toBeGreaterThan(dark.droneCutoff);
    expect(light.volume).toBeLessThan(dark.volume);
  });
});
