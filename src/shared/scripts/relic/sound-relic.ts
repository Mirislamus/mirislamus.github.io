import type { Sound, SoundEnv } from '../matrix/sound';
import {
  STEP,
  bassCutoff,
  bassFrequency,
  createScoreRng,
  hatAt,
  kickAt,
  leadStep,
  noteToFrequency,
  padAt,
  padNotes,
  relicMoodFor,
  snareAt,
  type RelicMood,
} from './relic-score';

// The sound of the takeover (J-05): our own darksynth, synthesized with Web Audio, nothing is downloaded.
//   - a bass of saw waves in sixteenth notes through a low-pass filter and a soft distortion, the filter opens every second bar;
//   - a kick on every beat (a sine that falls), a snare on 2 and 4 (noise and a short tone), hats between the kicks;
//   - a gated pad on the chords Em–C–G–D, and in the second half of the loop a rare lead through a dotted echo.
// Like the sound of the pills it lives only while the takeover does: the context is made by the click on the chip (a
// gesture, so the browser lets it play), the only code that runs meanwhile is one timer every 25 ms that puts the next
// notes on the audio clock a little ahead, and the context is closed when the sound stops.
const LOOKAHEAD = 0.12; // seconds of notes put on the clock in advance
const TICK = 25; // ms between two looks at the clock
const MASTER = 0.25; // the ceiling of the volume
const FADE_IN = 1.5; // seconds

const defaultEnv: SoundEnv = { createContext: () => new AudioContext() };

export interface RelicSound extends Sound {
  /** A rise of noise and pitch over `seconds`, up to the moment of the hit. */
  riser: (seconds: number) => void;
  /** The blow that starts the takeover: a deep boom and a crash. */
  hit: () => void;
  /** A short digital crunch for a glitch of the page. */
  crunch: () => void;
  /** The music collapses downwards in pitch and fades out over `seconds`; the context closes afterwards. */
  collapse: (seconds: number) => void;
}

// A soft clipping curve: the more `amount`, the more the sound bites.
const distortionCurve = (amount: number) => {
  const samples = 1024;
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) curve[i] = Math.tanh(((i * 2) / samples - 1) * amount);
  return curve;
};

export const createRelicSound = (env: SoundEnv = defaultEnv): RelicSound => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null;
  let bassFilter: BiquadFilterNode | null = null;
  let padFilter: BiquadFilterNode | null = null;
  let leadFilter: BiquadFilterNode | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let closing: ReturnType<typeof setTimeout> | undefined;
  let mood: RelicMood = relicMoodFor(false);
  let nextStep = 0;
  let stepIndex = 0;
  const rng = createScoreRng(112);

  const visibility = () => {
    if (!ctx) return;
    if (globalThis.document?.hidden) void ctx.suspend();
    else void ctx.resume();
  };

  const level = () => MASTER * mood.volume;

  // One short sound: a tone that decays.
  const tone = (
    type: OscillatorType,
    from: number,
    to: number,
    time: number,
    length: number,
    peak: number,
    target: AudioNode
  ) => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, time);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, time + length);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peak, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(gain).connect(target);
    osc.start(time);
    osc.stop(time + length + 0.05);
  };

  // A burst of noise through a filter.
  const burst = (
    type: BiquadFilterType,
    frequency: number,
    q: number,
    time: number,
    length: number,
    peak: number,
    target: AudioNode
  ) => {
    if (!ctx || !noiseBuffer) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer;
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peak, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    source.connect(filter).connect(gain).connect(target);
    source.start(time, rng() * 0.5);
    source.stop(time + length + 0.05);
  };

  // ── the notes ──
  const bass = (time: number, step: number) => {
    if (!ctx || !bassFilter) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(bassFrequency(step), time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.9, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.35, time + STEP * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 0.98);
    osc.connect(gain).connect(bassFilter);
    osc.start(time);
    osc.stop(time + STEP);
  };

  const pad = (time: number, step: number) => {
    if (!ctx || !padFilter) return;
    for (const [index, note] of padNotes(step).entries()) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteToFrequency(note), time);
      osc.detune.value = (index - 1) * 9;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.5, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 1.7);
      osc.connect(gain).connect(padFilter);
      osc.start(time);
      osc.stop(time + STEP * 1.8);
    }
  };

  const lead = (time: number, note: string, length: number) => {
    if (!ctx || !leadFilter) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const long = STEP * length;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(noteToFrequency(note), time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.6, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + long + 0.12);
    osc.connect(gain).connect(leadFilter);
    osc.start(time);
    osc.stop(time + long + 0.15);
  };

  const schedule = () => {
    if (!ctx || !bus) return;
    const until = ctx.currentTime + LOOKAHEAD;
    while (nextStep < until) {
      const time = nextStep;
      const step = stepIndex;
      if (step % 16 === 0 && bassFilter) {
        // The filter opens on every second bar, with a short glide.
        bassFilter.frequency.setTargetAtTime(bassCutoff(step) * mood.brightness, time, 0.25);
      }
      bass(time, step);
      if (kickAt(step)) tone('sine', 120, 42, time, 0.32, 1, bus);
      if (snareAt(step)) {
        burst('bandpass', 1900, 0.8, time, 0.18, 0.4, bus);
        tone('triangle', 190, 150, time, 0.1, 0.3, bus);
      }
      if (hatAt(step)) burst('highpass', 7500, 0.7, time, 0.05, 0.1, bus);
      if (padAt(step)) pad(time, step);
      const lift = leadStep(step, rng);
      if (lift.note) lead(time, lift.note, lift.length);
      nextStep += STEP;
      stepIndex++;
    }
    timer = setTimeout(schedule, TICK);
  };

  // ── the graph ──
  const build = (context: AudioContext) => {
    master = context.createGain();
    master.gain.value = 0;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 5;
    master.connect(compressor).connect(context.destination);

    bus = context.createGain();
    bus.connect(master);

    const length = context.sampleRate;
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    // The bass: a filter that opens, then the distortion.
    bassFilter = context.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = bassCutoff(0) * mood.brightness;
    bassFilter.Q.value = 6;
    const shaper = context.createWaveShaper();
    shaper.curve = distortionCurve(5);
    const bassGain = context.createGain();
    bassGain.gain.value = 0.32;
    bassFilter.connect(shaper).connect(bassGain).connect(bus);

    // The pad.
    padFilter = context.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 1100;
    const padGain = context.createGain();
    padGain.gain.value = 0.07;
    padFilter.connect(padGain).connect(bus);

    // The lead and its dotted echo.
    leadFilter = context.createBiquadFilter();
    leadFilter.type = 'lowpass';
    leadFilter.frequency.value = 2600;
    const leadGain = context.createGain();
    leadGain.gain.value = 0.1;
    const delay = context.createDelay(1);
    delay.delayTime.value = (60 / 112) * 0.75;
    const feedback = context.createGain();
    feedback.gain.value = 0.3;
    delay.connect(feedback).connect(delay);
    leadFilter.connect(leadGain);
    leadGain.connect(bus);
    leadGain.connect(delay);
    delay.connect(bus);
  };

  const release = () => {
    clearTimeout(timer);
    clearTimeout(closing);
    closing = undefined;
    globalThis.document?.removeEventListener('visibilitychange', visibility);
    const old = ctx;
    ctx = master = bus = bassFilter = padFilter = leadFilter = null;
    noiseBuffer = null;
    if (old) void old.close().catch(() => {});
  };

  return {
    start(light) {
      // Started again while the last fade is still going: the old context goes at once.
      if (ctx && closing) release();
      if (ctx) return;
      mood = relicMoodFor(light);
      ctx = env.createContext();
      void ctx.resume();
      build(ctx);
      nextStep = ctx.currentTime + 0.1;
      stepIndex = 0;
      master?.gain.setValueAtTime(0, ctx.currentTime);
      master?.gain.linearRampToValueAtTime(level(), ctx.currentTime + FADE_IN);
      globalThis.document?.addEventListener('visibilitychange', visibility);
      schedule();
    },

    stop(seconds) {
      if (!ctx || !master) return;
      clearTimeout(timer); // no new notes
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + seconds);
      clearTimeout(closing);
      closing = setTimeout(release, seconds * 1000 + 100);
    },

    ramp(ratio, seconds, delay = 0) {
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      if (delay === 0) {
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
      }
      master.gain.linearRampToValueAtTime(level() * ratio, now + delay + seconds);
    },

    setTheme(light) {
      mood = relicMoodFor(light);
      if (!ctx || !master) return;
      master.gain.linearRampToValueAtTime(level(), ctx.currentTime + 0.5);
    },

    riser(seconds) {
      if (!ctx || !bus || !noiseBuffer) return;
      const now = ctx.currentTime;
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      source.buffer = noiseBuffer;
      source.loop = true;
      filter.type = 'bandpass';
      filter.Q.value = 2;
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(6000, now + seconds);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + seconds);
      source.connect(filter).connect(gain).connect(bus);
      source.start(now);
      source.stop(now + seconds + 0.05);
      tone('sawtooth', 110, 880, now, seconds, 0.12, bus);
    },

    hit() {
      if (!ctx || !bus) return;
      const now = ctx.currentTime;
      tone('sine', 80, 28, now, 1.1, 1.1, bus);
      burst('highpass', 4000, 0.7, now, 0.9, 0.3, bus);
    },

    crunch() {
      if (!ctx || !bus) return;
      const now = ctx.currentTime;
      burst('bandpass', 3000, 2, now, 0.12, 0.3, bus);
      tone('square', 220, 90, now, 0.1, 0.2, bus);
    },

    collapse(seconds) {
      if (!ctx || !bus) return;
      tone('sawtooth', 220, 30, ctx.currentTime, seconds, 0.35, bus);
      this.stop(seconds);
    },

    get playing() {
      return ctx !== null;
    },
    get context() {
      return ctx;
    },
    get bus() {
      return bus;
    },
  };
};
