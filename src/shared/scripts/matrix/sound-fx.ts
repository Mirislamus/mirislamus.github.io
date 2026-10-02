import { noteToFrequency } from './sound-score';
import type { Sound } from './sound';

// The effects of the pill scene (S-03), all synthesized, 0.1 to 3.8 seconds long:
//   open   a rising whoosh and a low boom;
//   blip   a soft tick under a pill: the blue one higher, the red one lower;
//   blue   a calm falling chord, the music fades out to silence;
//   red    a riser, three short glitches at the moment the page breaks up, the music swells and goes.
// They go to the same bus as the music, so the master volume and the fade-out of the scene apply to them too.
const BLIP_GAP = 0.12; // seconds: not more than one blip in this time
const BLUE_FADE = 1.8; // seconds for the music to go quiet
export const RED_GLITCH_AT = 3.1; // seconds after the red pill is chosen: when the page glitches (pills.ts)
const BLIPS = { blue: 'E5', red: 'A4' } as const;

export type Pill = keyof typeof BLIPS;

const noiseBuffer = (ctx: BaseAudioContext, seconds: number) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

export interface Effects {
  open: () => void;
  blip: (pill: Pill) => void;
  choose: (pill: Pill) => void;
}

export const createEffects = (sound: Sound, now: () => number = () => performance.now() / 1000): Effects => {
  let lastBlip = -Infinity;

  const tone = (
    type: OscillatorType,
    from: number,
    to: number,
    start: number,
    length: number,
    peak: number,
    attack = 0.01
  ) => {
    const ctx = sound.context;
    const bus = sound.bus;
    if (!ctx || !bus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + length);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.connect(gain).connect(bus);
    osc.start(start);
    osc.stop(start + length + 0.05);
  };

  // Filtered noise whose pass band moves from one frequency to another.
  const sweep = (from: number, to: number, start: number, length: number, peak: number, q = 4) => {
    const ctx = sound.context;
    const bus = sound.bus;
    if (!ctx || !bus) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer(ctx, length + 0.1);
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, start);
    filter.frequency.exponentialRampToValueAtTime(to, start + length);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + length * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    source.connect(filter).connect(gain).connect(bus);
    source.start(start);
    source.stop(start + length + 0.1);
  };

  return {
    open() {
      const ctx = sound.context;
      if (!ctx) return;
      const t = ctx.currentTime + 0.05;
      sweep(300, 4200, t, 1.1, 0.3);
      tone('sine', 72, 34, t + 0.7, 1.3, 0.8, 0.02); // the boom at the end of the whoosh
    },

    blip(pill) {
      const ctx = sound.context;
      if (!ctx) return;
      const at = now();
      if (at - lastBlip < BLIP_GAP) return;
      lastBlip = at;
      const t = ctx.currentTime + 0.01;
      const frequency = noteToFrequency(BLIPS[pill]);
      tone('sine', frequency, frequency, t, 0.18, 0.2, 0.008);
      tone('sine', frequency * 2, frequency * 2, t, 0.1, 0.06, 0.008);
    },

    choose(pill) {
      const ctx = sound.context;
      if (!ctx) return;
      const t = ctx.currentTime + 0.02;

      if (pill === 'blue') {
        // A calm chord, falling a little, and the music goes quiet.
        for (const note of ['E4', 'B3', 'G3'] as const) {
          const frequency = noteToFrequency(note);
          tone('sine', frequency, frequency * 0.89, t, 1.8, 0.14, 0.05);
        }
        sound.ramp(0, BLUE_FADE);
        return;
      }

      // The riser, then the page glitches: three short bursts of a square wave and noise.
      tone('sawtooth', 80, 420, t, RED_GLITCH_AT, 0.2, RED_GLITCH_AT * 0.8);
      sweep(200, 5000, t, RED_GLITCH_AT, 0.25, 2);
      sound.ramp(1.4, RED_GLITCH_AT); // the music swells…
      for (let i = 0; i < 3; i++) {
        const at = t + RED_GLITCH_AT + i * 0.16;
        tone('square', 180 + ((i * 397) % 900), 90 + ((i * 211) % 500), at, 0.09, 0.3, 0.004);
        sweep(1500, 7000, at, 0.08, 0.2, 1);
      }
      // …and goes out with the scene (the dialog fades it away when it closes).
      sound.ramp(0, 1.4, RED_GLITCH_AT);
    },
  };
};
