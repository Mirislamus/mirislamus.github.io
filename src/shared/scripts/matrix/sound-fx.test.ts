import { describe, expect, it, vi } from 'vitest';
import type { Sound } from './sound';
import { RED_GLITCH_AT, createEffects } from './sound-fx';
import { noteToFrequency } from './sound-score';

// A context that records the oscillators (type, first frequency, start time) and the noise sweeps.
const fake = () => {
  const oscillators: { type: string; frequency: number; start: number; gains: number[] }[] = [];
  let sweeps = 0;
  const param = (onSet?: (value: number, time: number) => void) => ({
    value: 0,
    setValueAtTime: (value: number, time: number) => onSet?.(value, time),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  });
  const node = (extra: Record<string, unknown> = {}) => {
    const self: Record<string, unknown> = {
      connect: (target: unknown) => target ?? self,
      start: vi.fn(),
      stop: vi.fn(),
      ...extra,
    };
    return self;
  };
  const context = {
    currentTime: 10,
    sampleRate: 8000,
    createGain: () => node({ gain: param() }),
    createOscillator: () => {
      const record = { type: '', frequency: 0, start: 0, gains: [] as number[] };
      oscillators.push(record);
      const osc = node({
        frequency: param((value, time) => {
          if (!record.frequency) {
            record.frequency = value;
            record.start = time;
          }
        }),
        start: (time: number) => (record.start = time),
      });
      // A real node has the type as a property; the record learns it from there.
      Object.defineProperty(osc, 'type', { get: () => record.type, set: (value: string) => (record.type = value) });
      return osc;
    },
    createBiquadFilter: () => node({ frequency: param(), Q: { value: 0 }, type: 'bandpass' }),
    createBufferSource: () => {
      sweeps++;
      return node({ buffer: null });
    },
    createBuffer: (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) }),
  };
  const sound = { context, bus: {}, ramp: vi.fn() } as unknown as Sound;
  return { sound, oscillators, sweeps: () => sweeps, ramp: sound.ramp as unknown as ReturnType<typeof vi.fn> };
};

describe('the effects of the scene', () => {
  it('do nothing without a context', () => {
    const effects = createEffects({ context: null, bus: null, ramp: vi.fn() } as unknown as Sound);
    expect(() => {
      effects.open();
      effects.blip('blue');
      effects.choose('red');
    }).not.toThrow();
  });

  it('open: a whoosh of noise and a low boom', () => {
    const { sound, oscillators, sweeps } = fake();
    createEffects(sound).open();
    expect(sweeps()).toBe(1);
    expect(oscillators).toHaveLength(1);
    expect(oscillators[0].type).toBe('sine');
    expect(oscillators[0].frequency).toBeLessThan(100);
  });

  it('blip: the blue pill is higher than the red one', () => {
    const blue = fake();
    createEffects(blue.sound, () => 0).blip('blue');
    const red = fake();
    createEffects(red.sound, () => 0).blip('red');

    expect(blue.oscillators[0].frequency).toBeCloseTo(noteToFrequency('E5'), 3);
    expect(red.oscillators[0].frequency).toBeCloseTo(noteToFrequency('A4'), 3);
    expect(blue.oscillators[0].frequency).toBeGreaterThan(red.oscillators[0].frequency);
  });

  it('blip: not more than one in 120 ms', () => {
    const { sound, oscillators } = fake();
    let time = 0;
    const effects = createEffects(sound, () => time);
    effects.blip('blue'); // t = 0
    time = 0.05;
    effects.blip('red'); // too soon
    time = 0.13;
    effects.blip('red'); // fine
    // Every blip is two oscillators (the tone and its octave).
    expect(oscillators).toHaveLength(4);
  });

  it('blue: a falling chord and the music goes quiet in about two seconds', () => {
    const { sound, oscillators, ramp } = fake();
    createEffects(sound).choose('blue');
    expect(oscillators.map(osc => osc.type)).toEqual(['sine', 'sine', 'sine']);
    expect(ramp).toHaveBeenCalledWith(0, 1.8);
  });

  it('red: a riser, three glitches at the moment of the glitch of the page, a swell and a fade', () => {
    const { sound, oscillators, ramp, sweeps } = fake();
    createEffects(sound).choose('red');

    expect(oscillators.filter(osc => osc.type === 'sawtooth')).toHaveLength(1);
    const glitches = oscillators.filter(osc => osc.type === 'square');
    expect(glitches).toHaveLength(3);
    for (const glitch of glitches) expect(glitch.start).toBeGreaterThanOrEqual(10 + RED_GLITCH_AT);
    expect(sweeps()).toBe(4); // the riser noise and a burst with every glitch
    expect(ramp).toHaveBeenNthCalledWith(1, 1.4, RED_GLITCH_AT);
    expect(ramp).toHaveBeenNthCalledWith(2, 0, 1.4, RED_GLITCH_AT);
  });

  it('red is timed to the glitch of the page: 3.1 s after the choice', () => {
    expect(RED_GLITCH_AT).toBe(3.1);
  });
});
