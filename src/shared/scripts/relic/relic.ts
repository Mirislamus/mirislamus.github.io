import { getMotion } from '../matrix/motion';
import { hit, riser, startMusic, stopMusic } from './audio';
import { TAKEOVER_EVENT } from './events';
import { isTakenOver, startTakeover } from './takeover';

// The Johnny Silverhand scene (wave 9, J-02), loaded when the Relic chip in the footer is clicked. A native modal
// <dialog> (focus trapped, page behind inert, Escape closes and the focus goes back to the chip), always dark.
//   0 s     the relic glitches (the dialog opens with a red and cyan split)
//   0.4 s   the figure of Johnny is drawn, line by line
//   1.4 s   "Wake the f▓▒░ up, Samurai." is typed; the profanity is eaten by noise and never shows
//   3 s     "We have a city to burn.", then the subtitle in the language of the page
//   5.6 s   the scene closes by itself and the takeover begins (takeover.ts; also a `relic:takeover` event).
// Escape, the close button and a click on the dark area leave the scene without the takeover.
export { TAKEOVER_EVENT };

const LINES = ['Wake the f▓▒░ up, Samurai.', 'We have a city to burn.'];
const NOISE = '▓▒░█▌▐';
const TYPE_MS = 35;
const START_MS = { figure: 400, line1: 1400, line2: 3000, subtitle: 3900, end: 5600 };
const NOISE_MS = 90;
const RISER_MS = 1200; // the rise of the sound ends a little after the scene does, at the moment of the hit
const READ_MS = 4500; // without motion everything is there at once; this is the time to read it

let dialog: HTMLDialogElement | undefined;

const setup = (root: HTMLDialogElement) => {
  const motion = getMotion();
  const figure = root.querySelector<SVGElement>('[data-johnny]')!;
  const lines = LINES.map((_, index) => root.querySelector<HTMLElement>(`[data-relic-line="${index + 1}"]`)!);
  const subtitle = root.querySelector<HTMLElement>('[data-relic-subtitle]');
  const timers: number[] = [];
  let noise: number | undefined;

  const later = (callback: () => void, ms: number) => timers.push(window.setTimeout(callback, ms));
  const randomBlock = () => NOISE[Math.floor(Math.random() * NOISE.length)];

  // The part of a line that is shown; the three blocks of line 1 are shown as noise that keeps changing.
  const show = (index: number, count: number) => {
    const text = LINES[index].slice(0, count);
    lines[index].textContent = index === 0 ? text.replace(/[▓▒░]/g, randomBlock) : text;
  };

  const type = (index: number, from: number) => {
    const length = LINES[index].length;
    for (let count = 1; count <= length; count++) later(() => show(index, count), from + count * TYPE_MS);
  };

  const reset = () => {
    timers.splice(0).forEach(window.clearTimeout);
    window.clearInterval(noise);
    noise = undefined;
    figure.removeAttribute('data-drawn');
    lines.forEach(line => (line.textContent = ''));
    if (subtitle) subtitle.hidden = true;
    root.removeAttribute('data-closing');
  };

  const close = (takeover: boolean) => {
    if (!root.open || root.hasAttribute('data-closing')) return;
    root.setAttribute('data-closing', '');
    window.clearInterval(noise);
    if (!takeover) stopMusic(0.4);
    const fade = Number.parseFloat(getComputedStyle(root).animationDuration) * 1000 || 0;
    later(() => {
      reset();
      root.close();
      if (takeover) {
        hit();
        startTakeover();
        document.dispatchEvent(new Event(TAKEOVER_EVENT));
      }
    }, fade);
  };

  const run = () => {
    startMusic();
    if (!motion.allowed) {
      // Everything at once, no strokes and no typing; the visitor has time to read it.
      figure.setAttribute('data-drawn', '');
      lines.forEach((_, index) => show(index, LINES[index].length));
      if (subtitle) subtitle.hidden = false;
      later(() => close(true), READ_MS);
      return;
    }
    later(() => figure.setAttribute('data-drawn', ''), START_MS.figure);
    type(0, START_MS.line1);
    type(1, START_MS.line2);
    // The blocks keep changing while the first line is on the screen.
    later(
      () => {
        noise = window.setInterval(() => show(0, LINES[0].length), NOISE_MS);
      },
      START_MS.line1 + LINES[0].length * TYPE_MS
    );
    if (subtitle) later(() => (subtitle.hidden = false), START_MS.subtitle);
    later(() => riser(RISER_MS / 1000), START_MS.end - RISER_MS + 400);
    later(() => close(true), START_MS.end);
  };

  root.querySelector('[data-relic-close]')?.addEventListener('click', () => close(false));
  root.addEventListener('cancel', event => {
    event.preventDefault();
    close(false);
  });
  root.addEventListener('click', event => {
    if (event.target === root) close(false);
  });

  return () => {
    reset();
    root.showModal();
    run();
  };
};

let open: (() => void) | undefined;

export const openRelic = (): void => {
  dialog ??= document.querySelector<HTMLDialogElement>('[data-relic-scene]') ?? undefined;
  if (!dialog || dialog.open || isTakenOver()) return;
  open ??= setup(dialog);
  open();
};
