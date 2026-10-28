import { at, pick } from '@/utils/list';

import { getMotion } from '../matrix/motion';
import { getTicker } from '../matrix/ticker';
import { hit, riser, startMusic, stopMusic } from './audio';
import { TAKEOVER_EVENT } from './events';
import { createMask } from './mask-fx';
import { isTakenOver, startTakeover } from './takeover';

const LINES = ['Wake the f▓▒░ up, Samurai.', 'We have a city to burn.'];
const NOISE = '▓▒░█▌▐';
const TYPE_MS = 35;
const START_MS = { figure: 400, line1: 1400, line2: 3000, subtitle: 3900, end: 5600 };
const NOISE_MS = 90;
const RISER_MS = 1200;
const READ_MS = 4500;

let dialog: HTMLDialogElement | undefined;

const setup = (root: HTMLDialogElement) => {
  const motion = getMotion();
  const maskCanvas = root.querySelector<HTMLCanvasElement>('[data-relic-mask]');
  const lines = LINES.flatMap((_, index) => root.querySelector<HTMLElement>(`[data-relic-line="${index + 1}"]`) ?? []);
  if (!maskCanvas || lines.length !== LINES.length) return undefined;
  const mask = createMask(maskCanvas);
  const ticker = getTicker();
  let stopTicker: (() => void) | undefined;
  const subtitle = root.querySelector<HTMLElement>('[data-relic-subtitle]');
  const timers: number[] = [];
  let noise: number | undefined;

  const later = (callback: () => void, ms: number) => timers.push(window.setTimeout(callback, ms));
  const randomBlock = () => pick(NOISE, Math.random());

  const show = (index: number, count: number) => {
    const text = at(LINES, index).slice(0, count);
    at(lines, index).textContent = index === 0 ? text.replace(/[▓▒░]/g, randomBlock) : text;
  };

  const type = (index: number, from: number) => {
    const length = at(LINES, index).length;
    for (let count = 1; count <= length; count++) later(() => show(index, count), from + count * TYPE_MS);
  };

  const reset = () => {
    timers.forEach(window.clearTimeout);
    timers.length = 0;
    window.clearInterval(noise);
    noise = undefined;
    stopTicker?.();
    stopTicker = undefined;
    mask?.close();
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
      mask?.open();
      lines.forEach((_, index) => show(index, at(LINES, index).length));
      if (subtitle) subtitle.hidden = false;
      later(() => close(true), READ_MS);
      return;
    }
    later(() => {
      mask?.open();
      stopTicker = ticker.subscribe((dt, now) => mask?.tick(dt, now));
    }, START_MS.figure);
    type(0, START_MS.line1);
    type(1, START_MS.line2);
    later(
      () => {
        noise = window.setInterval(() => show(0, at(LINES, 0).length), NOISE_MS);
      },
      START_MS.line1 + at(LINES, 0).length * TYPE_MS,
    );
    if (subtitle) later(() => (subtitle.hidden = false), START_MS.subtitle);
    later(() => riser(RISER_MS / 1000), START_MS.end - RISER_MS + 400);
    later(() => close(true), START_MS.end);
  };

  window.addEventListener('resize', () => root.open && mask?.resize());
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
  open?.();
};
