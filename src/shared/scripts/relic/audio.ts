import { watchColors } from '../matrix/accent';
import { getMotion } from '../matrix/motion';
import { GLITCH_EVENT } from './events';
import type { RelicSound } from './sound-relic';

// The music of the takeover (J-05) as the rest of the code sees it: a few calls that do nothing if the sound is off or
// not loaded yet. The engine itself (sound-relic.ts, a chunk of its own) is loaded the first time the music is wanted.
//   scene opens: music fades in → a riser before the end of the scene → the hit when Johnny takes the site over →
//   a crunch for every glitch of the page → on leaving the music collapses and fades out.
const SOUND_KEY = 'relic-sound'; // '1' on, '0' off: what the visitor chose last time

let sound: RelicSound | undefined;
let wanted = false;
let light = false;
let unwatch: (() => void) | undefined;

const stored = () => {
  try {
    return localStorage.getItem(SOUND_KEY);
  } catch {
    return null; // blocked: the choice only lives while the page does
  }
};

// On by default; off by default when something is asked to stand still. A choice of the visitor beats the default.
export const soundWanted = () => {
  const choice = stored();
  return choice === null ? getMotion().allowed : choice === '1';
};

const crunch = () => sound?.crunch();

export const startMusic = () => {
  if (wanted || !soundWanted() || typeof AudioContext === 'undefined') return;
  wanted = true;
  document.addEventListener(GLITCH_EVENT, crunch);
  unwatch = watchColors(colors => {
    light = (colors.background[0] + colors.background[1] + colors.background[2]) / 3 > 128;
    sound?.setTheme(light);
  });
  void import('./sound-relic').then(({ createRelicSound }) => {
    if (!wanted) return; // left before the engine arrived
    sound ??= createRelicSound();
    sound.start(light);
  });
};

const forget = () => {
  wanted = false;
  document.removeEventListener(GLITCH_EVENT, crunch);
  unwatch?.();
  unwatch = undefined;
};

/** A rise before the hit. */
export const riser = (seconds: number) => sound?.riser(seconds);

/** The blow that opens the takeover. */
export const hit = () => sound?.hit();

/** Fades out and closes the context (the scene was left without the takeover, or the sound was switched off). */
export const stopMusic = (seconds: number) => {
  sound?.stop(seconds);
  forget();
};

/** Leaving the takeover: the music collapses downwards and fades out. */
export const collapseMusic = (seconds: number) => {
  sound?.collapse(seconds);
  forget();
};
