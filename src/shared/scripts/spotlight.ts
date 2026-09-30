// One delegated pointer listener for every `[data-spotlight]` card:
//  - the highlight follows the cursor (--mouse-x / --mouse-y);
//  - cards that also have `data-tilt` lean a few degrees towards the cursor and settle back.
// Only for a real mouse, and never when the user prefers reduced motion.
const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const MAX_TILT = 4; // degrees
const LERP = 0.12;
const SETTLED = 0.01;

interface TiltState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  frame: number;
}

const tilts = new WeakMap<HTMLElement, TiltState>();

const render = (card: HTMLElement, state: TiltState) => {
  state.x += (state.targetX - state.x) * LERP;
  state.y += (state.targetY - state.y) * LERP;

  const settled = Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) < SETTLED;
  const resting = settled && state.targetX === 0 && state.targetY === 0;

  // At rest the transform is removed completely, so text is never left slightly blurred.
  card.style.transform = resting
    ? ''
    : `perspective(1000px) rotateX(${(state.y * -MAX_TILT).toFixed(2)}deg) rotateY(${(state.x * MAX_TILT).toFixed(2)}deg)`;
  state.frame = settled ? 0 : requestAnimationFrame(() => render(card, state));
};

const tiltTo = (card: HTMLElement, x: number, y: number) => {
  const state = tilts.get(card) ?? { x: 0, y: 0, targetX: 0, targetY: 0, frame: 0 };
  tilts.set(card, state);
  state.targetX = x;
  state.targetY = y;
  if (!state.frame) state.frame = requestAnimationFrame(() => render(card, state));
};

const allowed = (event: PointerEvent) => event.pointerType === 'mouse' && fineMouse.matches && !reduceMotion.matches;

document.addEventListener(
  'pointermove',
  event => {
    if (!allowed(event) || !(event.target instanceof Element)) return;

    const card = event.target.closest<HTMLElement>('[data-spotlight]');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);

    if (card.hasAttribute('data-tilt')) {
      tiltTo(
        card,
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1
      );
    }
  },
  { passive: true }
);

// Leaving a card lets it settle back.
document.addEventListener(
  'pointerout',
  event => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest<HTMLElement>('[data-spotlight][data-tilt]');
    if (card && !card.contains(event.relatedTarget as Node | null)) tiltTo(card, 0, 0);
  },
  { passive: true }
);

export {};
