import type { Sound, SoundEnv } from '../matrix/sound';
import {
  STEP,
  arpCutoff,
  arpNote,
  arpVelocity,
  bassCutoff,
  bassFrequency,
  blipAt,
  createScoreRng,
  duckAt,
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

const LOOKAHEAD = 0.12;
const TICK = 25;
const MASTER = 0.25;
const FADE_IN = 1.5;
const DUCK = 0.25;
const DUCK_BACK = 0.2;

const defaultEnv: SoundEnv = { createContext: () => new AudioContext() };

export interface RelicSound extends Sound {
  riser: (seconds: number) => void;
  hit: () => void;
  crunch: () => void;
  collapse: (seconds: number) => void;
}

const distortionCurve = (amount: number) => {
  const samples = 1024;
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) curve[i] = Math.tanh(((i * 2) / samples - 1) * amount);
  return curve;
};

const impulse = (ctx: BaseAudioContext, seconds: number) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.2;
  }
  return buffer;
};

export const createRelicSound = (env: SoundEnv = defaultEnv): RelicSound => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null;
  let synths: GainNode | null = null;
  let bassFilter: BiquadFilterNode | null = null;
  let arpFilter: BiquadFilterNode | null = null;
  let padFilter: BiquadFilterNode | null = null;
  let leadFilter: BiquadFilterNode | null = null;
  let reverb: GainNode | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let closing: ReturnType<typeof setTimeout> | undefined;
  let mood: RelicMood = relicMoodFor(false);
  let nextStep = 0;
  let stepIndex = 0;
  const rng = createScoreRng(128);

  const visibility = () => {
    if (!ctx) return;
    if (globalThis.document?.hidden) void ctx.suspend();
    else void ctx.resume();
  };

  const level = () => MASTER * mood.volume;

  const tone = (
    type: OscillatorType,
    from: number,
    to: number,
    time: number,
    length: number,
    peak: number,
    target: AudioNode,
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

  const burst = (
    type: BiquadFilterType,
    frequency: number,
    q: number,
    time: number,
    length: number,
    peak: number,
    target: AudioNode,
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

  const supersaw = (
    frequency: number,
    time: number,
    peak: number,
    attack: number,
    length: number,
    target: AudioNode,
  ) => {
    if (!ctx) return;
    for (const detune of [-13, 0, 13]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, time);
      osc.detune.value = detune;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(peak, time + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
      osc.connect(gain).connect(target);
      osc.start(time);
      osc.stop(time + length + 0.05);
    }
  };

  const bass = (time: number, step: number) => {
    if (!ctx || !bassFilter || !bus) return;
    const frequency = bassFrequency(step);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.9, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.4, time + STEP * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 0.98);
    osc.connect(gain).connect(bassFilter);
    osc.start(time);
    osc.stop(time + STEP);
    tone('sine', frequency / 2, frequency / 2, time, STEP * 0.95, 0.35, bus);
  };

  const pad = (time: number, step: number) => {
    if (!padFilter) return;
    for (const note of padNotes(step)) supersaw(noteToFrequency(note), time, 0.5, 0.35, STEP * 15, padFilter);
  };

  const arp = (time: number, step: number) => {
    if (!ctx || !arpFilter) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(noteToFrequency(arpNote(step)), time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.7 * arpVelocity(step), time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 1.5);
    osc.connect(gain).connect(arpFilter);
    osc.start(time);
    osc.stop(time + STEP * 1.6);
  };

  const lead = (time: number, note: string, length: number) => {
    if (!leadFilter) return;
    supersaw(noteToFrequency(note), time, 0.55, 0.012, STEP * length + 0.12, leadFilter);
  };

  const schedule = () => {
    if (!ctx || !bus || !synths || !reverb) return;
    const until = ctx.currentTime + LOOKAHEAD;
    while (nextStep < until) {
      const time = nextStep;
      const step = stepIndex;
      if (step % 16 === 0) {
        bassFilter?.frequency.setTargetAtTime(bassCutoff(step) * mood.brightness, time, 0.25);
        arpFilter?.frequency.setTargetAtTime(arpCutoff(step) * mood.brightness, time, 0.4);
      }
      bass(time, step);
      if (kickAt(step)) tone('sine', 120, 42, time, 0.32, 1, bus);
      if (duckAt(step)) {
        synths.gain.setValueAtTime(DUCK, time);
        synths.gain.linearRampToValueAtTime(1, time + DUCK_BACK);
      }
      if (snareAt(step)) {
        burst('bandpass', 2100, 0.8, time, 0.2, 0.4, bus);
        burst('bandpass', 2100, 0.8, time, 0.9, 0.22, reverb);
        tone('triangle', 190, 150, time, 0.1, 0.3, bus);
      }
      const hat = hatAt(step);
      if (hat === 'open') burst('highpass', 7500, 0.7, time, 0.16, 0.1, bus);
      else if (hat === 'closed') burst('highpass', 8500, 0.7, time, 0.03, 0.06, bus);
      if (padAt(step)) pad(time, step);
      arp(time, step);
      const lift = leadStep(step, rng);
      if (lift.note) lead(time, lift.note, lift.length);
      const blip = blipAt(step, rng);
      if (blip) tone('square', blip, blip * 0.7, time + STEP * 0.5, 0.05, 0.05, reverb);
      nextStep += STEP;
      stepIndex++;
    }
    timer = setTimeout(schedule, TICK);
  };

  const build = (context: AudioContext) => {
    master = context.createGain();
    master.gain.value = 0;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 5;
    master.connect(compressor).connect(context.destination);

    bus = context.createGain();
    bus.connect(master);

    const room = context.createConvolver();
    room.buffer = impulse(context, 2.4);
    reverb = context.createGain();
    reverb.gain.value = 0.7;
    const roomOut = context.createGain();
    roomOut.gain.value = 0.5;
    reverb.connect(room).connect(roomOut).connect(master);

    const length = context.sampleRate;
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    bassFilter = context.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = bassCutoff(0) * mood.brightness;
    bassFilter.Q.value = 6;
    const shaper = context.createWaveShaper();
    shaper.curve = distortionCurve(5);
    const bassGain = context.createGain();
    bassGain.gain.value = 0.32;
    bassFilter.connect(shaper).connect(bassGain).connect(bus);

    synths = context.createGain();
    synths.connect(bus);

    padFilter = context.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 1500;
    const padGain = context.createGain();
    padGain.gain.value = 0.06;
    padFilter.connect(padGain).connect(synths);

    const delay = context.createDelay(1);
    delay.delayTime.value = (60 / 128) * 0.75;
    const feedback = context.createGain();
    feedback.gain.value = 0.38;
    delay.connect(feedback).connect(delay);
    delay.connect(synths);
    delay.connect(reverb);

    arpFilter = context.createBiquadFilter();
    arpFilter.type = 'lowpass';
    arpFilter.frequency.value = arpCutoff(0) * mood.brightness;
    arpFilter.Q.value = 5;
    const arpGain = context.createGain();
    arpGain.gain.value = 0.2;
    arpFilter.connect(arpGain);
    arpGain.connect(synths);
    arpGain.connect(delay);

    leadFilter = context.createBiquadFilter();
    leadFilter.type = 'lowpass';
    leadFilter.frequency.value = 3200;
    const leadGain = context.createGain();
    leadGain.gain.value = 0.12;
    leadFilter.connect(leadGain);
    leadGain.connect(synths);
    leadGain.connect(delay);
    leadGain.connect(reverb);
  };

  const release = () => {
    clearTimeout(timer);
    clearTimeout(closing);
    closing = undefined;
    globalThis.document?.removeEventListener('visibilitychange', visibility);
    const old = ctx;
    ctx = master = bus = synths = bassFilter = arpFilter = padFilter = leadFilter = reverb = null;
    noiseBuffer = null;
    if (old) void old.close().catch(() => {});
  };

  return {
    start(light) {
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
      clearTimeout(timer);
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
