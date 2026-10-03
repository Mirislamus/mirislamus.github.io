import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRelicSound } from './sound-relic';

// A context that only records what is made of it: no audio, and the clock is ours.
const fakeContext = () => {
  const log = {
    oscillators: [] as { type: string; freq: number }[],
    sources: 0,
    shapers: 0,
    started: 0,
    closed: 0,
    suspended: 0,
    resumed: 0,
    targets: [] as number[],
  };
  const param = (onSet?: (value: number) => void) => ({
    value: 0,
    setValueAtTime: vi.fn((value: number) => onSet?.(value)),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn((value: number) => log.targets.push(value)),
    cancelScheduledValues: vi.fn(),
  });
  const node = (extra: Record<string, unknown> = {}) => {
    const self: Record<string, unknown> = {
      connect: (target: unknown) => target ?? self,
      start: () => log.started++,
      stop: vi.fn(),
      ...extra,
    };
    return self;
  };
  const context = {
    currentTime: 0,
    sampleRate: 8000,
    destination: {},
    createGain: () => node({ gain: param() }),
    createOscillator: () => {
      const entry = { type: 'sine', freq: 0 };
      log.oscillators.push(entry);
      const self = node({
        frequency: param(value => {
          if (!entry.freq) entry.freq = value;
        }),
        detune: param(),
      });
      Object.defineProperty(self, 'type', { get: () => entry.type, set: (value: string) => (entry.type = value) });
      return self;
    },
    createBiquadFilter: () => node({ frequency: param(), Q: param(), type: 'lowpass' }),
    createBufferSource: () => {
      log.sources++;
      return node({ buffer: null, loop: false });
    },
    createWaveShaper: () => {
      log.shapers++;
      return node({ curve: null });
    },
    createBuffer: (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) }),
    createDelay: () => node({ delayTime: param() }),
    createDynamicsCompressor: () => node({ threshold: param(), ratio: param() }),
    resume: () => {
      log.resumed++;
      return Promise.resolve();
    },
    suspend: () => {
      log.suspended++;
      return Promise.resolve();
    },
    close: () => {
      log.closed++;
      return Promise.resolve();
    },
  };
  return { context: context as unknown as AudioContext, raw: context, log };
};

// Lets the audio clock run for `seconds`, the way the timer of the engine sees it.
const play = (fake: ReturnType<typeof fakeContext>, seconds: number) => {
  for (let i = 0; i < seconds / 0.025; i++) {
    fake.raw.currentTime += 0.025;
    vi.advanceTimersByTime(25);
  }
};

describe('the sound of the takeover', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('makes no context until it is started', () => {
    const create = vi.fn();
    const sound = createRelicSound({ createContext: create });
    expect(create).not.toHaveBeenCalled();
    expect(sound.playing).toBe(false);
  });

  it('starts, resumes the context and builds a distorted bass', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    expect(sound.playing).toBe(true);
    expect(fake.log.resumed).toBe(1);
    expect(fake.log.shapers).toBe(1);
  });

  it('plays the bass in sixteenth notes at 112 bpm: the first bar has the kick on every beat and the bass on every step', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    play(fake, 2.2); // a bit more than the first bar (4 × 0.536 s)
    const saws = fake.log.oscillators.filter(osc => osc.type === 'sawtooth');
    // The bass starts on E1 (41.2 Hz) and goes up an octave on the pushes.
    const bass = saws.map(osc => osc.freq).filter(freq => freq < 100);
    expect(bass[0]).toBeCloseTo(41.2, 0);
    expect(bass).toContainEqual(expect.closeTo(82.41, 0));
    expect(bass.length).toBeGreaterThanOrEqual(15);
    // The kick: a sine that falls from 120 Hz, four times in the first bar.
    const kicks = fake.log.oscillators.filter(osc => osc.type === 'sine' && Math.round(osc.freq) === 120);
    expect(kicks.length).toBeGreaterThanOrEqual(4);
    expect(kicks.length).toBeLessThanOrEqual(5);
    // The snare has its tone, the hats and the snare their noise.
    expect(fake.log.oscillators.some(osc => osc.type === 'triangle' && osc.freq === 190)).toBe(true);
    expect(fake.log.sources).toBeGreaterThan(3);
  });

  it('opens the filter on the bars: the cutoff is set at the start of each bar', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    play(fake, 5);
    expect(fake.log.targets.length).toBeGreaterThanOrEqual(2);
    expect(new Set(fake.log.targets).size).toBeGreaterThan(1); // closed on one bar, open on the next
  });

  it('puts notes on the clock only a little ahead', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    const first = fake.log.oscillators.length;
    play(fake, 1);
    // One second of music is some forty oscillators, not hundreds.
    expect(fake.log.oscillators.length - first).toBeLessThan(120);
  });

  it('makes a crunch for a glitch, a hit, and a riser', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    const before = fake.log.oscillators.length;
    sound.crunch();
    expect(fake.log.oscillators.slice(before).some(osc => osc.type === 'square')).toBe(true);
    sound.hit();
    expect(fake.log.oscillators.some(osc => osc.type === 'sine' && osc.freq === 80)).toBe(true);
    sound.riser(1.2);
    expect(fake.log.oscillators.some(osc => osc.type === 'sawtooth' && osc.freq === 110)).toBe(true);
  });

  it('does nothing with the effects while it is not playing', () => {
    const sound = createRelicSound({ createContext: () => fakeContext().context });
    expect(() => {
      sound.crunch();
      sound.hit();
      sound.riser(1);
      sound.collapse(0.6);
    }).not.toThrow();
  });

  it('collapses: a falling tone, then the context closes and nothing keeps running', () => {
    const fake = fakeContext();
    const sound = createRelicSound({ createContext: () => fake.context });
    sound.start(false);
    sound.collapse(0.6);
    expect(fake.log.oscillators.some(osc => osc.type === 'sawtooth' && osc.freq === 220)).toBe(true);
    expect(fake.log.closed).toBe(0); // still fading
    vi.advanceTimersByTime(900);
    expect(fake.log.closed).toBe(1);
    expect(sound.playing).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('fades out and closes on a plain stop, and starts again at once', () => {
    const contexts = [fakeContext(), fakeContext()];
    let n = 0;
    const sound = createRelicSound({ createContext: () => contexts[n++].context });
    sound.start(false);
    sound.stop(0.4);
    sound.start(true);
    expect(contexts[0].log.closed).toBe(1);
    expect(sound.playing).toBe(true);
  });

  it('ignores a second start while it plays', () => {
    const create = vi.fn(() => fakeContext().context);
    const sound = createRelicSound({ createContext: create });
    sound.start(false);
    sound.start(false);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
