import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSound } from './sound';

// A context that only records what is made of it: no audio, and the clock is ours.
const fakeContext = () => {
  const log = { oscillators: 0, gains: 0, started: 0, closed: 0, suspended: 0, resumed: 0 };
  const param = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
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
    state: 'running',
    createGain: () => {
      log.gains++;
      return node({ gain: param() });
    },
    createOscillator: () => {
      log.oscillators++;
      return node({ frequency: param(), detune: param(), type: 'sine' });
    },
    createBiquadFilter: () => node({ frequency: param(), Q: param(), type: 'lowpass' }),
    createBufferSource: () => node({ buffer: null }),
    createBuffer: (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) }),
    createConvolver: () => node({ buffer: null }),
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

describe('the sound of the scene', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('makes no context until it is started', () => {
    const create = vi.fn();
    const sound = createSound({ createContext: create });
    expect(create).not.toHaveBeenCalled();
    expect(sound.playing).toBe(false);
    expect(sound.context).toBeNull();
  });

  it('starts the drone and resumes the context', () => {
    const fake = fakeContext();
    const sound = createSound({ createContext: () => fake.context });
    sound.start(false);

    expect(sound.playing).toBe(true);
    // Three drone waves and the filter breathing.
    expect(fake.log.oscillators).toBeGreaterThanOrEqual(4);
    expect(fake.log.resumed).toBe(1);
    expect(sound.bus).toBeTruthy();
  });

  it('puts the heartbeat on the clock only a little ahead, and goes on while the clock moves', () => {
    const fake = fakeContext();
    const sound = createSound({ createContext: () => fake.context });
    sound.start(false);
    const first = fake.log.oscillators;

    // Time passes on the audio clock; the timer looks at it every 25 ms.
    for (let i = 0; i < 80; i++) {
      fake.raw.currentTime += 0.025;
      vi.advanceTimersByTime(25);
    }
    expect(fake.log.oscillators).toBeGreaterThan(first + 2); // beats and plucks were scheduled
    // Never far ahead: after 2 s of music the notes are scheduled up to about 2 s, not 20.
    expect(fake.log.oscillators).toBeLessThan(first + 40);
  });

  it('fades out and then closes the context, and nothing keeps running', () => {
    const fake = fakeContext();
    const sound = createSound({ createContext: () => fake.context });
    sound.start(false);
    sound.stop(0.4);
    expect(fake.log.closed).toBe(0); // still fading
    vi.advanceTimersByTime(600);
    expect(fake.log.closed).toBe(1);
    expect(sound.playing).toBe(false);

    const scheduled = fake.log.oscillators;
    vi.advanceTimersByTime(2000);
    expect(fake.log.oscillators).toBe(scheduled); // the scheduler is gone
    expect(vi.getTimerCount()).toBe(0);
  });

  it('can be opened again at once: the old context goes and a new one starts', () => {
    const contexts = [fakeContext(), fakeContext()];
    let n = 0;
    const sound = createSound({ createContext: () => contexts[n++].context });
    sound.start(false);
    sound.stop(0.4);
    sound.start(true);
    expect(contexts[0].log.closed).toBe(1);
    expect(n).toBe(2);
    expect(sound.playing).toBe(true);
  });

  it('ignores a second start while it plays', () => {
    const create = vi.fn(() => fakeContext().context);
    const sound = createSound({ createContext: create });
    sound.start(false);
    sound.start(false);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
