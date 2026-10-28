import { createRng } from '../matrix/glyphs';
import { getMotion } from '../matrix/motion';
import { collapseMusic } from './audio';
import { startChat, stopChat } from './chat';
import { GLITCH_EVENT } from './events';
import { hidePlate, showPlate } from './plate';

const ATTRIBUTE = 'data-relic';
const GLITCH = 'data-relic-glitch';
const SWAPPING = 'data-relic-swapping';
const HIT = 'data-relic-hit';
const GLITCH_MS: [number, number] = [150, 300];
const INTERVAL_MS: [number, number] = [10_000, 15_000];
const SWAP_AT_MS = 120;
const SWAP_MS = 300;
const EXIT_MS = 400;

const root = () => document.documentElement;
const rng = createRng(2077);
const between = ([from, to]: [number, number]) => from + rng() * (to - from);

let timer: number | undefined;
const pending: number[] = [];

export const isTakenOver = () => root().hasAttribute(ATTRIBUTE);

const typing = () => {
  const element = document.activeElement;
  return (
    element instanceof HTMLElement && (element.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName))
  );
};

const busy = () => document.hidden || typing() || document.querySelector('dialog[open]') !== null;

const visibleHeadings = () =>
  [...document.querySelectorAll<HTMLElement>('main h2')].filter(heading => {
    const { top, bottom } = heading.getBoundingClientRect();
    return bottom > 0 && top < window.innerHeight;
  });

const swapTexts = () =>
  document.querySelectorAll<HTMLElement>('[data-swap]').forEach(element => {
    if (element.querySelector(':scope > [data-swap-real]')) return;
    const real = document.createElement('span');
    real.setAttribute('data-swap-real', '');
    real.append(...element.childNodes);
    const fake = document.createElement('span');
    fake.setAttribute('data-swap-fake', '');
    fake.setAttribute('aria-hidden', 'true');
    fake.textContent = element.dataset.swap ?? '';
    element.append(real, fake);
  });

const unswapTexts = () =>
  document.querySelectorAll<HTMLElement>('[data-swap]').forEach(element => {
    const real = element.querySelector(':scope > [data-swap-real]');
    if (real) element.replaceChildren(...real.childNodes);
  });

const after = (callback: () => void, ms: number) => pending.push(window.setTimeout(callback, ms));

const glitch = (ms = between(GLITCH_MS)) => {
  const headings = visibleHeadings();
  const heading = headings[Math.floor(rng() * headings.length)];
  root().setAttribute(GLITCH, '');
  heading?.setAttribute(HIT, '');
  document.dispatchEvent(new Event(GLITCH_EVENT));
  after(() => {
    root().removeAttribute(GLITCH);
    heading?.removeAttribute(HIT);
  }, ms);
};

const schedule = () => {
  timer = window.setTimeout(() => {
    if (getMotion().allowed && !busy()) glitch();
    schedule();
  }, between(INTERVAL_MS));
};

export const startTakeover = () => {
  if (isTakenOver()) return;
  if (getMotion().allowed) {
    root().setAttribute(SWAPPING, '');
    glitch(SWAP_AT_MS * 2);
    after(() => {
      swapTexts();
      root().setAttribute(ATTRIBUTE, '');
    }, SWAP_AT_MS);
    after(() => root().removeAttribute(SWAPPING), SWAP_MS);
  } else {
    swapTexts();
    root().setAttribute(ATTRIBUTE, '');
  }
  schedule();
  startChat();
  showPlate(exitTakeover);
};

const stopTakeover = () => {
  window.clearTimeout(timer);
  pending.forEach(window.clearTimeout);
  pending.length = 0;
  collapseMusic(0.6);
  hidePlate();
  stopChat();
  unswapTexts();
  [GLITCH, SWAPPING, ATTRIBUTE].forEach(name => root().removeAttribute(name));
  document.querySelectorAll(`[${HIT}]`).forEach(element => element.removeAttribute(HIT));
};

let leaving = false;

function exitTakeover() {
  if (!isTakenOver() || leaving) return;
  leaving = true;
  const finish = () => {
    leaving = false;
    stopTakeover();
    document.querySelector<HTMLElement>('button[data-relic]')?.focus();
  };
  window.clearTimeout(timer);
  if (getMotion().allowed) {
    root().setAttribute(SWAPPING, '');
    glitch(EXIT_MS);
    after(finish, EXIT_MS / 2);
  } else finish();
}
