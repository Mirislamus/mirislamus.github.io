import { watchColors } from './accent';
import { createHands } from './hands-fx';
import { getMotion } from './motion';
import { DESKTOP_RAIN, createRain, type RainOptions } from './rain';
import type { Sound } from './sound';
import type { Effects } from './sound-fx';
import { getTicker } from './ticker';

const CALM: RainOptions = { ...DESKTOP_RAIN, flashlight: 0, evaporate: 0, density: 0.55, brightness: 0.2, speed: 8 };
const END_MS = { blue: 2600, red: 3800 };
const GLITCH_MS = 1300;
const SOUND_KEY = 'pills-sound';
const SOUND_FADE = 0.3;
const GLITCH_BEFORE_END_MS = 700;

let dialog: HTMLDialogElement | undefined;

const setup = (root: HTMLDialogElement) => {
  const motion = getMotion();
  const ticker = getTicker();
  const canvas = root.querySelector<HTMLCanvasElement>('[data-pills-rain]');
  const result = root.querySelector<HTMLElement>('[data-pills-result]');
  const handsRoot = root.querySelector<HTMLElement>('[data-pills-hands]');
  if (!canvas || !result || !handsRoot) return undefined;
  const options = { ...CALM };
  const hands = createHands(handsRoot);
  const rain = createRain(canvas, options);
  const timers: number[] = [];
  let sound: Sound | undefined;
  let effects: Effects | undefined;
  let light = false;
  let stop: (() => void) | undefined;
  let unwatch: (() => void) | undefined;

  const isLight = (colors: { background: number[] }) =>
    (colors.background[0] + colors.background[1] + colors.background[2]) / 3 > 128;

  const soundButton = root.querySelector<HTMLButtonElement>('[data-pills-sound]');
  const stored = () => {
    try {
      return localStorage.getItem(SOUND_KEY);
    } catch {
      return null;
    }
  };
  let chosen: boolean | undefined;
  const soundWanted = () => chosen ?? (stored() === null ? motion.allowed : stored() === '1');

  const showSoundState = () => {
    if (!soundButton) return;
    const on = soundWanted();
    soundButton.setAttribute('aria-pressed', String(on));
    soundButton.setAttribute('aria-label', (on ? soundButton.dataset.off : soundButton.dataset.on) ?? '');
  };

  const startSound = () => {
    if (!soundWanted()) return;
    void Promise.all([import('./sound'), import('./sound-fx')]).then(([{ createSound }, { createEffects }]) => {
      if (!root.open) return;
      sound ??= createSound();
      effects ??= createEffects(sound);
      sound.start(light);
      effects.open();
    });
  };

  const later = (callback: () => void, ms: number) => timers.push(window.setTimeout(callback, ms));

  const reset = () => {
    timers.splice(0).forEach(window.clearTimeout);
    Object.assign(options, CALM);
    root.removeAttribute('data-chosen');
    root.removeAttribute('data-closing');
    result.hidden = true;
    document.documentElement.removeAttribute('data-glitch');
  };

  const run = () => {
    rain.resize();
    hands?.open();
    if (motion.allowed) {
      stop = ticker.subscribe((dt, now) => {
        rain.tick(dt);
        hands?.tick(dt, now);
      });
    } else rain.still();
  };

  const close = () => {
    if (!root.open || root.hasAttribute('data-closing')) return;
    root.setAttribute('data-closing', '');
    sound?.stop(0.4);
    const done = () => {
      stop?.();
      stop = undefined;
      unwatch?.();
      unwatch = undefined;
      hands?.close();
      reset();
      root.close();
    };
    const fade = Number.parseFloat(getComputedStyle(root).animationDuration) * 1000 || 0;
    later(done, fade);
  };

  const choose = (pill: 'blue' | 'red') => {
    if (root.hasAttribute('data-chosen')) return;
    root.setAttribute('data-chosen', '');
    effects?.choose(pill);
    result.textContent = root.dataset[pill === 'blue' ? 'endBlue' : 'endRed'] ?? '';
    result.hidden = false;

    if (pill === 'red' && motion.allowed) {
      Object.assign(options, { brightness: 0.75, speed: 18, density: 1 });
      rain.burst();
      later(() => {
        document.documentElement.setAttribute('data-glitch', '');
        later(() => document.documentElement.removeAttribute('data-glitch'), GLITCH_MS);
      }, END_MS.red - GLITCH_BEFORE_END_MS);
    }

    later(() => {
      close();
      if (pill === 'blue') window.scrollTo({ top: 0, behavior: motion.reduced ? 'auto' : 'smooth' });
    }, END_MS[pill]);
  };

  root
    .querySelectorAll<HTMLButtonElement>('[data-pill]')
    .forEach(button => button.addEventListener('click', () => choose(button.dataset.pill === 'red' ? 'red' : 'blue')));
  root.querySelector('[data-pills-close]')?.addEventListener('click', close);
  if (soundButton && typeof AudioContext !== 'undefined') {
    soundButton.hidden = false;
    soundButton.addEventListener('click', () => {
      chosen = !soundWanted();
      try {
        localStorage.setItem(SOUND_KEY, chosen ? '1' : '0');
      } catch {}
      showSoundState();
      if (chosen) startSound();
      else sound?.stop(SOUND_FADE);
    });
  }
  root.querySelectorAll<HTMLButtonElement>('[data-pill]').forEach(button => {
    const pill = button.dataset.pill === 'red' ? 'red' : 'blue';
    button.addEventListener('pointerenter', event => event.pointerType === 'mouse' && effects?.blip(pill));
    button.addEventListener('focus', () => button.matches(':focus-visible') && effects?.blip(pill));
  });
  root.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  root.addEventListener('click', event => {
    if (event.target === root) close();
  });
  root.addEventListener('pointermove', event => hands?.pointer(event), { passive: true });
  window.addEventListener('resize', () => {
    if (!root.open) return;
    rain.resize();
    hands?.resize();
  });

  return () => {
    reset();
    chosen = undefined;
    showSoundState();
    root.showModal();
    unwatch = watchColors(colors => {
      rain.setColors(colors);
      hands?.retheme();
      light = isLight(colors);
      sound?.setTheme(light);
    });
    run();
    startSound();
  };
};

let open: (() => void) | undefined;

export const openPills = () => {
  dialog ??= document.querySelector<HTMLDialogElement>('[data-pills]') ?? undefined;
  if (!dialog) return;
  if (dialog.open) return;
  open ??= setup(dialog);
  open?.();
};
