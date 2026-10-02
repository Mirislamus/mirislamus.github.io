import { BEAT, STEP, arpStep, createScoreRng, moodFor, noteToFrequency, type Mood } from './sound-score';

// The sound of the pill scene (S-02): everything is synthesized with Web Audio, no file is downloaded.
//   - a drone: two detuned saw waves on A1 and a sine on A0 under a low-pass filter that "breathes";
//   - a pulse like a heartbeat, every fourth beat a little stronger;
//   - a sparse arpeggio in A minor through a delay and a synthetic reverb;
//   - short bursts of filtered noise, like the rain of glyphs.
// The audio context lives only while the scene is open: it is created by the click on the rabbit (a user gesture, so
// the browser lets it play) and closed after the scene fades out. The only JavaScript that runs meanwhile is one timer
// every 25 ms that puts the next notes on the audio clock a little ahead of time.
const LOOKAHEAD = 0.12; // seconds of notes put on the clock in advance
const TICK = 25; // ms between two looks at the clock
const MASTER = 0.25; // the ceiling of the volume: nothing is ever loud
const FADE_IN = 1.2; // seconds

export interface SoundEnv {
  createContext: () => AudioContext;
}

export const defaultEnv: SoundEnv = { createContext: () => new AudioContext() };

export interface Sound {
  /** Starts the music (fades in). The context is made here, so call it from a click. */
  start: (light: boolean) => void;
  /** Fades out over `seconds` and then closes the context. */
  stop: (seconds: number) => void;
  /** Moves the volume of everything to `ratio` of the normal level over `seconds`, after `delay` seconds. */
  ramp: (ratio: number, seconds: number, delay?: number) => void;
  /** Moves the music to the mood of another theme. */
  setTheme: (light: boolean) => void;
  readonly playing: boolean;
  /** The audio context while it exists (the effects of S-03 use it). */
  readonly context: AudioContext | null;
  /** The node that the effects connect to, in front of the master volume. */
  readonly bus: AudioNode | null;
}

const impulse = (ctx: BaseAudioContext, seconds: number) => {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.4;
  }
  return buffer;
};

export const createSound = (env: SoundEnv = defaultEnv): Sound => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null;
  let droneFilter: BiquadFilterNode | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let closing: ReturnType<typeof setTimeout> | undefined;
  let mood: Mood = moodFor(false);
  let nextBeat = 0;
  let nextStep = 0;
  let beatIndex = 0;
  let stepIndex = 0;
  let noiseBuffer: AudioBuffer | null = null;
  let arpSend: AudioNode | null = null;
  const rng = createScoreRng();
  const nodes: (AudioScheduledSourceNode | { stop: () => void })[] = [];

  const visibility = () => {
    if (!ctx) return;
    if (globalThis.document?.hidden) void ctx.suspend();
    else void ctx.resume();
  };

  const level = () => MASTER * mood.volume;

  // ── the notes ──
  const pulse = (time: number, strong: boolean) => {
    if (!ctx || !bus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(58, time);
    osc.frequency.exponentialRampToValueAtTime(34, time + 0.32);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(strong ? 0.85 : 0.55, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
    osc.connect(gain).connect(bus);
    osc.start(time);
    osc.stop(time + 0.45);
  };

  const pluck = (time: number, note: string, velocity: number) => {
    if (!ctx || !arpSend) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteToFrequency(note) * 2 ** mood.arpOctaves, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.2 * velocity, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);
    osc.connect(gain).connect(arpSend);
    osc.start(time);
    osc.stop(time + 0.75);
  };

  const glyphNoise = (time: number) => {
    if (!ctx || !bus || !noiseBuffer) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 2200 + rng() * 4200;
    filter.Q.value = 6;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.05, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    source.connect(filter).connect(gain).connect(bus);
    source.start(time, rng() * 0.5);
    source.stop(time + 0.12);
  };

  const schedule = () => {
    if (!ctx) return;
    const until = ctx.currentTime + LOOKAHEAD;
    while (nextBeat < until) {
      pulse(nextBeat, beatIndex % 4 === 0);
      if (beatIndex % 3 === 1 && rng() < 0.7) glyphNoise(nextBeat + 0.1 + rng() * 0.3);
      nextBeat += BEAT;
      beatIndex++;
    }
    while (nextStep < until) {
      const step = arpStep(stepIndex, rng);
      if (step.note) pluck(nextStep, step.note, step.velocity);
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
    compressor.threshold.value = -18;
    compressor.ratio.value = 4;
    master.connect(compressor).connect(context.destination);

    bus = context.createGain(); // everything but the arpeggio goes here
    bus.connect(master);

    // The reverb and the echo of the arpeggio.
    const reverb = context.createConvolver();
    reverb.buffer = impulse(context, 2.2);
    const wet = context.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet).connect(master);
    const delay = context.createDelay(1);
    delay.delayTime.value = 0.375;
    const feedback = context.createGain();
    feedback.gain.value = 0.35;
    delay.connect(feedback).connect(delay);
    const send = context.createGain();
    send.connect(master);
    send.connect(delay);
    send.connect(reverb);
    delay.connect(reverb);
    delay.connect(master);
    arpSend = send;

    // The drone.
    droneFilter = context.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = mood.droneCutoff;
    droneFilter.Q.value = 3;
    const drone = context.createGain();
    drone.gain.value = 0.28;
    droneFilter.connect(drone).connect(bus);
    for (const [type, frequency, detune] of [
      ['sawtooth', 55, 0],
      ['sawtooth', 55, 12],
      ['sine', 27.5, 0],
    ] as const) {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      osc.connect(droneFilter);
      osc.start();
      nodes.push(osc);
    }
    // The filter breathes: a very slow LFO moves its cutoff.
    const lfo = context.createOscillator();
    const depth = context.createGain();
    lfo.frequency.value = 0.07;
    depth.gain.value = 70;
    lfo.connect(depth).connect(droneFilter.frequency);
    lfo.start();
    nodes.push(lfo);

    const length = context.sampleRate;
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  };

  const release = () => {
    clearTimeout(timer);
    clearTimeout(closing);
    closing = undefined;
    globalThis.document?.removeEventListener('visibilitychange', visibility);
    for (const node of nodes.splice(0)) {
      try {
        node.stop();
      } catch {
        // already stopped
      }
    }
    const old = ctx;
    ctx = master = bus = droneFilter = arpSend = null;
    noiseBuffer = null;
    if (old) void old.close().catch(() => {});
  };

  return {
    start(light) {
      // Opened again while the last fade is still going: the old context goes at once.
      if (ctx && closing) release();
      if (ctx) return;
      mood = moodFor(light);
      ctx = env.createContext();
      void ctx.resume();
      build(ctx);
      nextBeat = nextStep = ctx.currentTime + 0.1;
      beatIndex = stepIndex = 0;
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
      // A first ramp starts from where the volume is; one that follows another continues after its end.
      if (delay === 0) {
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
      }
      master.gain.linearRampToValueAtTime(level() * ratio, now + delay + seconds);
    },

    setTheme(light) {
      mood = moodFor(light);
      if (!ctx || !master || !droneFilter) return;
      const now = ctx.currentTime;
      droneFilter.frequency.linearRampToValueAtTime(mood.droneCutoff, now + 0.5);
      master.gain.linearRampToValueAtTime(level(), now + 0.5);
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
