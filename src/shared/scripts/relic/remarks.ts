import { getMotion } from '../matrix/motion';

// What the netrunner says about the section that comes into view (J-04), while he is in the site.
//   - one remark per section for one takeover; never more often than one in 8 s (the next one waits its turn);
//   - the text is typed in about a second, stays for 6 s and leaves with a short glitch; while the mouse is over it or
//     the focus is in it, it stays (WCAG 2.2.1);
//   - a remark whose section is no longer on the screen when its turn comes is dropped;
//   - with reduced motion or a pause it simply appears and disappears.
// The box is a polite live region (role="status") in Relic.astro; it is filled only here.
const SECTIONS = ['about', 'approach', 'projects', 'skills', 'career', 'reviews', 'contacts'] as const;
type Section = (typeof SECTIONS)[number];

const VISIBLE = 0.4;
const GAP_MS = 8000;
const STAY_MS = 6000;
const TYPE_MS = 18;
const LEAVE_MS = 300;
const RETRY_MS = 500;

let observer: IntersectionObserver | undefined;
let timer: number | undefined;
let spoken = new Set<Section>();
let queue: Section[] = [];
let visible = new Set<Section>();
let lastEnd = -Infinity;
let showing = false;
let hovered = false;
let box: HTMLElement | undefined;

const pending: number[] = [];
const after = (callback: () => void, ms: number) => pending.push(window.setTimeout(callback, ms));

const isSection = (id: string): id is Section => (SECTIONS as readonly string[]).includes(id);

const textOf = () => box!.querySelector<HTMLElement>('[data-relic-remark-text]')!;

function hide() {
  if (!box) return;
  const done = () => {
    if (!box) return;
    box.hidden = true;
    box.removeAttribute('data-leaving');
    textOf().textContent = '';
    showing = false;
    lastEnd = Date.now();
    pump();
  };
  if (getMotion().allowed) {
    box.setAttribute('data-leaving', '');
    after(done, LEAVE_MS);
  } else done();
}

function leaveWhenFree() {
  if (hovered || box?.contains(document.activeElement)) after(leaveWhenFree, RETRY_MS);
  else hide();
}

function say(section: Section) {
  if (!box) return;
  const texts = JSON.parse(box.dataset.remarks ?? '{}') as Record<Section, string>;
  const text = texts[section];
  const target = textOf();
  showing = true;
  spoken.add(section);
  box.hidden = false;
  if (getMotion().allowed) {
    // The live region announces the change when the whole text is there, not letter by letter.
    target.setAttribute('aria-hidden', 'true');
    for (let count = 1; count <= text.length; count++)
      after(() => (target.textContent = text.slice(0, count)), count * TYPE_MS);
    after(
      () => {
        target.removeAttribute('aria-hidden');
        target.textContent = text;
      },
      text.length * TYPE_MS + 1
    );
    after(leaveWhenFree, text.length * TYPE_MS + STAY_MS);
  } else {
    target.textContent = text;
    after(leaveWhenFree, STAY_MS);
  }
}

function pump() {
  window.clearTimeout(timer);
  if (showing || !box) return;
  queue = queue.filter(section => visible.has(section) && !spoken.has(section));
  if (queue.length === 0) return;
  const wait = lastEnd + GAP_MS - Date.now();
  if (wait > 0 || document.querySelector('dialog[open]') || document.hidden) {
    timer = window.setTimeout(pump, Math.max(wait, RETRY_MS));
    return;
  }
  say(queue.shift()!);
}

export const startRemarks = () => {
  box = document.querySelector<HTMLElement>('[data-relic-remark]') ?? undefined;
  if (!box || observer) return;
  spoken = new Set();
  queue = [];
  visible = new Set();
  lastEnd = -Infinity;
  box.addEventListener('pointerenter', () => (hovered = true));
  box.addEventListener('pointerleave', () => (hovered = false));
  observer = new IntersectionObserver(
    entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isSection(target.id)) continue;
        if (isIntersecting) {
          visible.add(target.id);
          if (!spoken.has(target.id) && !queue.includes(target.id)) queue.push(target.id);
        } else visible.delete(target.id);
      }
      pump();
    },
    { threshold: VISIBLE }
  );
  SECTIONS.forEach(id => {
    const element = document.getElementById(id);
    if (element) observer!.observe(element);
  });
};

export const stopRemarks = () => {
  observer?.disconnect();
  observer = undefined;
  window.clearTimeout(timer);
  pending.splice(0).forEach(window.clearTimeout);
  showing = false;
  hovered = false;
  if (box) {
    box.hidden = true;
    box.removeAttribute('data-leaving');
    textOf().textContent = '';
  }
};
