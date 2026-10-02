import { cssDuration, getMotion, onMotionChange } from './matrix/motion';

// The conversation in the first Approach card (A-03) plays once per load, when the card is half on screen:
// before every message "typing…" shows for a moment, then the bubble rises into place.
//
// Everything is Web Animations. Without this chunk (no JS, reduced motion, a deep link, pause) all three
// messages are simply there: the natural styles are the final state, and the place is reserved from the start.
const TYPING = 700; // ms of "typing…" before a message
const STEP = 1000; // ms between the starts of two messages

const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const initChatDemo = (root: HTMLElement) => {
  const motion = getMotion();
  const messages = [...root.querySelectorAll<HTMLElement>('li')];
  if (messages.length === 0 || root.hasAttribute('data-chat')) return;
  if (!motion.allowed || window.location.hash === '#approach') return;

  const easeOut = token('--ease-out', 'cubic-bezier(0.16, 1, 0.3, 1)');
  const rise = cssDuration('--dur-slow', 400);
  const animations: Animation[] = [];

  const animate = (element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = element.animate(keyframes, { fill: 'both', easing: 'linear', ...options });
    animation.pause(); // shows the hidden first frame now, plays when the card is seen
    animations.push(animation);
  };

  messages.forEach((message, i) => {
    const start = i * STEP;
    const typing = message.querySelector('[data-chat-typing]');

    if (typing) {
      animate(typing, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }], {
        duration: TYPING,
        delay: start,
      });
      typing.querySelectorAll('i').forEach((dot, k) =>
        animate(dot, [{ opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }], {
          duration: 500,
          delay: start + k * 120,
          iterations: 1,
        })
      );
    }

    animate(
      message,
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: rise, delay: start + TYPING, easing: easeOut }
    );
  });

  root.setAttribute('data-chat', 'pending');

  const cleanup = () => {
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
      void Promise.all(animations.map(animation => animation.finished)).then(cleanup, cleanup);
    },
    { threshold: 0.5 }
  );
  observer.observe(root.closest('article') ?? root);
};
