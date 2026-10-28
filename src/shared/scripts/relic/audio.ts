import { watchColors } from '../matrix/accent';
import { getMotion } from '../matrix/motion';
import { GLITCH_EVENT } from './events';
import type { RelicSound } from './sound-relic';

const SOUND_KEY = 'relic-sound';

let sound: RelicSound | undefined;
let wanted = false;
let light = false;
let unwatch: (() => void) | undefined;

const stored = () => {
  try {
    return localStorage.getItem(SOUND_KEY);
  } catch {
    return null;
  }
};

let chosen: boolean | undefined;
export const soundWanted = () => {
  if (chosen !== undefined) return chosen;
  const choice = stored();
  return choice === null ? getMotion().allowed : choice === '1';
};

export const setSoundWanted = (on: boolean) => {
  chosen = on;
  try {
    localStorage.setItem(SOUND_KEY, on ? '1' : '0');
  } catch {}
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
    if (!wanted) return;
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

export const riser = (seconds: number) => sound?.riser(seconds);

export const hit = () => sound?.hit();

export const stopMusic = (seconds: number) => {
  sound?.stop(seconds);
  forget();
};

export const collapseMusic = (seconds: number) => {
  sound?.collapse(seconds);
  forget();
};
