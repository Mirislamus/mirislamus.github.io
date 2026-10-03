import { createRng } from '../matrix/glyphs';
import { getMotion } from '../matrix/motion';
import { collapseMusic } from './audio';
import { GLITCH_EVENT } from './events';
import { hidePlate, showPlate } from './plate';
import { startRemarks, stopRemarks } from './remarks';

// The takeover of the site by Johnny Silverhand (J-03). `data-relic` on the root turns on everything that is CSS:
// the red palette (_variables.scss), the word SAMURAI instead of the logo (Header) and the replaced texts (data-swap, see swapTexts).
// This module adds the glitches: now and then the page breaks up for a moment, and one heading with it.
//   - 150–300 ms each, every 10–15 s, in a fixed order (seeded), never in a way that needs a loop of frames;
//   - not while the visitor types, while a dialog is open, while the tab is hidden, or when motion is not allowed.
export { GLITCH_EVENT };

const ATTRIBUTE = 'data-relic';
const GLITCH = 'data-relic-glitch';
const SWAPPING = 'data-relic-swapping';
const HIT = 'data-relic-hit';
const GLITCH_MS: [number, number] = [150, 300];
const INTERVAL_MS: [number, number] = [10_000, 15_000];
const SWAP_AT_MS = 120; // the palette and the texts change in the middle of the first glitch, under its cover
const SWAP_MS = 300;
const EXIT_MS = 400; // the glitch of the way out; the things change back in the middle of it

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

// The replacement texts (data-swap="the other text") are put into the page only now, so before the takeover the page
// holds nothing but its real text: the real one is wrapped, the other one sits next to it, hidden from assistive technology.
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

// One glitch of the page: a shift with a split into red and cyan, and the same on one heading that is on the screen.
export const glitch = (ms = between(GLITCH_MS)) => {
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
    // The first glitch hides the change; the logo plays its own glitch as it turns into a word.
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
  startRemarks();
  showPlate(exitTakeover);
};

// Everything is back as it was.
export const stopTakeover = () => {
  window.clearTimeout(timer);
  pending.splice(0).forEach(window.clearTimeout);
  collapseMusic(0.6);
  hidePlate();
  stopRemarks();
  unswapTexts();
  [GLITCH, SWAPPING, ATTRIBUTE].forEach(name => root().removeAttribute(name));
  document.querySelectorAll(`[${HIT}]`).forEach(element => element.removeAttribute(HIT));
};

// The way out (the button "Eject the chip" or Escape, J-06): a glitch that covers the change back, then the palette, the
// logo, the texts, the remarks and the music are as they were and the focus is on the chip in the footer.
let leaving = false;

export function exitTakeover() {
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
