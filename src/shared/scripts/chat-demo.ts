import { cssDuration, getMotion, onMotionChange } from './matrix/motion';

// The conversation in the first Approach card (A-03) plays once per load, when the card is half on screen.
// When the client writes, the header says "typing…" and three dots jump in the place of the bubble. When "I"
// answer, the text is typed into the input field letter by letter and sent. Then the list scrolls up, the bubble pops
// out of its corner with a spring and its words come one after another. Ticks of my messages turn into "read", and
// a reaction splashes under one of them.
//
// Everything is Web Animations. Without this chunk (no JS, reduced motion, a deep link, pause) all the
// messages are simply there: the natural styles are the final state, and the place is reserved from the start.
const TYPING = 1200; // ms of "typing…" before a message of the client
const PER_CHAR = 55; // ms per typed letter in my answers
const BEFORE_TYPING = 300; // ms before I start typing
const BEFORE_SEND = 350; // ms the typed text is looked at before it is sent
const AFTER = 1200; // ms after a message is shown, before the next one starts
const SCROLL = 550; // ms the list takes to move up for a new message
const WORD = 80; // ms between the words of a message

const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const initChatDemo = (root: HTMLElement) => {
  const motion = getMotion();
  const list = root.querySelector<HTMLElement>('[data-chat-list]');
  const messages = [...root.querySelectorAll<HTMLElement>('[data-chat-list] > li')];
  if (!list || messages.length === 0 || root.hasAttribute('data-chat')) return;
  if (!motion.allowed || window.location.hash === '#approach') return;

  const easeOut = token('--ease-out', 'cubic-bezier(0.16, 1, 0.3, 1)');
  const spring = token('--ease-spring', 'cubic-bezier(0.34, 1.56, 0.64, 1)');
  const pop = cssDuration('--dur-slow', 400) + 300;
  const animations: Animation[] = [];

  const animate = (element: Element | null, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    if (!element) return;
    const animation = element.animate(keyframes, { fill: 'both', easing: 'linear', ...options });
    animation.pause(); // shows the hidden first frame now, plays when the card is seen
    animations.push(animation);
  };

  // How far the list must be pushed down so that the messages from `index` on are below the window.
  const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
  const heights = messages.map(
    message => message.offsetHeight + (parseFloat(getComputedStyle(message).marginBottom) || 0) + gap
  );
  const hiddenFrom = (index: number) => heights.slice(index).reduce((sum, height) => sum + height, 0);

  const online = root.querySelector('[data-chat-online]');
  const writing = root.querySelector('[data-chat-writing]');
  const field = root.querySelector<HTMLElement>('[data-chat-input]');
  const send = root.querySelector<HTMLElement>('[data-chat-send]');
  const placeholder = field?.textContent?.trim() ?? '';

  // When every message starts and is shown: the client "types" for a moment, I type my answer into the field.
  let clock = 0;
  const slots = messages.map(message => {
    const typed = message.dataset.typed ?? null;
    const typing = typed === null ? TYPING : BEFORE_TYPING + typed.length * PER_CHAR + BEFORE_SEND;
    const slot = { start: clock, shown: clock + typing, typed };
    clock = slot.shown + AFTER;
    return slot;
  });

  messages.forEach((message, i) => {
    const { start, shown, typed } = slots[i];

    // The list moves up so that the place of this message is in the window, and the first frame is "pushed down".
    // My answer is sent from the field, so the list moves just before it appears.
    animate(
      list,
      [{ transform: `translateY(${hiddenFrom(i)}px)` }, { transform: `translateY(${hiddenFrom(i + 1)}px)` }],
      // Only the first step holds its first frame: a later step's "before" would win over the earlier ones.
      {
        duration: SCROLL,
        delay: typed === null ? start : shown - SCROLL * 0.4,
        easing: easeOut,
        fill: i === 0 ? 'both' : 'forwards',
      }
    );

    if (typed === null) {
      // "typing…" in the header and the dots in the place of the bubble.
      const typing = [{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.88 }, { opacity: 0 }];
      animate(writing, typing, { duration: TYPING, delay: start });
      animate(online, [{ opacity: 1 }, { opacity: 0, offset: 0.12 }, { opacity: 0, offset: 0.88 }, { opacity: 1 }], {
        duration: TYPING,
        delay: start,
      });
      const indicator = message.querySelector('[data-chat-typing]');
      animate(indicator, typing, { duration: TYPING, delay: start + SCROLL / 2 });
      indicator?.querySelectorAll('i').forEach((dot, k) =>
        animate(
          dot,
          [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }],
          {
            duration: 700,
            delay: start + SCROLL / 2 + k * 150,
            iterations: 1.5,
            easing: 'ease-in-out',
          }
        )
      );
    }

    // The bubble grows out of its corner with a spring.
    animate(
      message,
      [
        { opacity: 0, transform: 'scale(0.4) translateY(12px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)', offset: 1 },
      ],
      { duration: pop, delay: shown, easing: spring }
    );

    // Its words come one after another.
    message.querySelectorAll('[data-chat-word]').forEach((word, k) =>
      animate(
        word,
        [
          { opacity: 0, transform: 'translateY(5px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 320, delay: shown + 160 + k * WORD, easing: easeOut }
      )
    );

    // The second tick appears and the message is "read".
    animate(
      message.querySelector('[data-chat-read]'),
      [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 400, delay: shown + 1400, easing: spring }
    );

    // A reaction splashes.
    animate(
      message.querySelector('[data-chat-reaction]'),
      [
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1.35)', offset: 0.6 },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 600, delay: shown + 1000, easing: easeOut }
    );
  });

  root.setAttribute('data-chat', 'pending');

  // My answers are typed into the field with timers (a text cannot be animated): started with the scene and
  // cancelled with it.
  const timers: number[] = [];
  const restoreField = () => {
    if (!field) return;
    field.textContent = placeholder;
    field.removeAttribute('data-typing');
  };
  const typeAnswers = () => {
    if (!field) return;
    slots.forEach(({ start, shown, typed }) => {
      if (typed === null) return;
      timers.push(
        window.setTimeout(() => {
          field.textContent = '';
          field.setAttribute('data-typing', '');
        }, start + BEFORE_TYPING)
      );
      for (let k = 1; k <= typed.length; k++) {
        timers.push(
          window.setTimeout(() => (field.textContent = typed.slice(0, k)), start + BEFORE_TYPING + (k - 1) * PER_CHAR)
        );
      }
      // The send button presses, the field empties and the bubble appears.
      timers.push(
        window.setTimeout(() => {
          send?.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.78)' }, { transform: 'scale(1)' }], {
            duration: 260,
            easing: spring,
          });
        }, shown - 140)
      );
      timers.push(window.setTimeout(restoreField, shown));
    });
  };

  const cleanup = () => {
    for (const timer of timers) clearTimeout(timer);
    timers.length = 0;
    restoreField();
    for (const animation of animations) animation.cancel(); // the natural styles are the final state
    animations.length = 0;
    root.removeAttribute('data-chat');
    observer.disconnect();
    stopMotion();
  };

  const stopMotion = onMotionChange(() => {
    if (!motion.allowed) cleanup();
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      root.setAttribute('data-chat', 'playing');
      for (const animation of animations) animation.play();
      typeAnswers();
      void Promise.all(animations.map(animation => animation.finished)).then(cleanup, cleanup);
    },
    { threshold: 0.5 }
  );
  observer.observe(root.closest('article') ?? root);
};
