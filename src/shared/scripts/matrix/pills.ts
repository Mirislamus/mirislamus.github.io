import { watchColors } from './accent';
import { getMotion } from './motion';
import { createHands } from './hands-fx';
import { DESKTOP_RAIN, createRain, type RainOptions } from './rain';
import type { Sound } from './sound';
import { getTicker } from './ticker';

// The pill scene (easter egg), loaded when the white rabbit in the footer is clicked. A native modal <dialog>
// does the heavy lifting: focus is trapped inside, the page behind is inert, Escape closes it and focus goes
// back to the rabbit.
//   blue pill: the scene ends with a line and the page scrolls back to the top;
//   red pill:  a downpour of glyphs, the page glitches for a moment, "Welcome to the real world".
const CALM: RainOptions = { ...DESKTOP_RAIN, flashlight: 0, evaporate: 0, density: 0.55, brightness: 0.2, speed: 8 };
const END_MS = { blue: 2600, red: 3800 };
const GLITCH_MS = 1300;
const GLITCH_BEFORE_END_MS = 700; // the page breaks up while the scene fades out, so it can be seen

let dialog: HTMLDialogElement | undefined;

const setup = (root: HTMLDialogElement) => {
  const motion = getMotion();
  const ticker = getTicker();
  const canvas = root.querySelector<HTMLCanvasElement>('[data-pills-rain]')!;
  const result = root.querySelector<HTMLElement>('[data-pills-result]')!;
  const options = { ...CALM };
  const hands = createHands(root.querySelector<HTMLElement>('[data-pills-hands]')!);
  const rain = createRain(canvas, options);
  const timers: number[] = [];
  let sound: Sound | undefined;
  let light = false;
  let stop: (() => void) | undefined;
  let unwatch: (() => void) | undefined;

  const isLight = (colors: { background: number[] }) =>
    (colors.background[0] + colors.background[1] + colors.background[2]) / 3 > 128;

  // The sound is a separate chunk, loaded when the scene opens; it plays only if nothing is asked to stand still.
  const startSound = () => {
    if (!motion.allowed) return;
    void import('./sound').then(({ createSound }) => {
      if (!root.open) return;
      sound ??= createSound();
      sound.start(light);
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
    // The fade takes the length of the token; with reduced motion it is 0 and the dialog closes at once.
    const fade = Number.parseFloat(getComputedStyle(root).animationDuration) * 1000 || 0;
    later(done, fade);
  };

  const choose = (pill: 'blue' | 'red') => {
    if (root.hasAttribute('data-chosen')) return;
    root.setAttribute('data-chosen', '');
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
  // Escape: fade out like every other way of leaving.
  root.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  // A click on the empty dark area (the dialog itself, not its content) closes it too.
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
  open();
};
