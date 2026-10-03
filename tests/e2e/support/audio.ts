import type { Page } from '@playwright/test';

// A stand-in for AudioContext that only counts what is done with it: the tests listen to the code, not to the sound.
export const installFakeAudio = (page: Page) =>
  page.addInitScript(() => {
    const log = {
      contexts: 0,
      oscillators: 0,
      closed: 0,
      resumed: 0,
      tones: [] as { type: string; freq: number }[],
      ramps: [] as number[],
    };
    const param = () => ({
      value: 0,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setValueAtTime(_value?: number) {},
      linearRampToValueAtTime(value: number) {
        log.ramps.push(value);
      },
      exponentialRampToValueAtTime() {},
      setTargetAtTime() {},
      cancelScheduledValues() {},
    });
    const node = (extra: Record<string, unknown> = {}) => {
      const self: Record<string, unknown> = {
        connect: (target: unknown) => target ?? self,
        start() {},
        stop() {},
        ...extra,
      };
      return self;
    };
    class FakeAudioContext {
      currentTime = 0;
      sampleRate = 8000;
      destination = {};
      state = 'running';
      constructor() {
        log.contexts++;
        const tick = () => {
          this.currentTime += 0.025;
        };
        setInterval(tick, 25);
      }
      createGain = () => node({ gain: param() });
      createOscillator = () => {
        log.oscillators++;
        const osc: Record<string, unknown> = { type: 'sine' };
        const frequency = param();
        let first = true;
        frequency.setValueAtTime = (value: number) => {
          if (first) log.tones.push({ type: String(osc.type), freq: value });
          first = false;
        };
        const self = node({ frequency, detune: param() });
        Object.defineProperty(self, 'type', { get: () => osc.type, set: (value: string) => (osc.type = value) });
        return self;
      };
      createWaveShaper = () => node({ curve: null });
      createBiquadFilter = () => node({ frequency: param(), Q: param(), type: 'lowpass' });
      createBufferSource = () => node({ buffer: null });
      createBuffer = (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) });
      createConvolver = () => node({ buffer: null });
      createDelay = () => node({ delayTime: param() });
      createDynamicsCompressor = () => node({ threshold: param(), ratio: param() });
      resume = () => {
        log.resumed++;
        return Promise.resolve();
      };
      suspend = () => Promise.resolve();
      close = () => {
        log.closed++;
        return Promise.resolve();
      };
    }
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    (window as unknown as { audioLog: typeof log }).audioLog = log;
  });

export const audioLog = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { audioLog: { contexts: number; oscillators: number; closed: number; resumed: number } })
        .audioLog
  );
