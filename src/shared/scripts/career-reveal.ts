import { getMotion, onMotionChange } from './matrix/motion';

// The Career section draws itself once (F-17): the accent line runs through the pill, and when it reaches
// a card's dot the dot lights up, the dashed line grows down, and the text appears layer by layer. The
// current place also pulses and the line goes on, dashed, into the future.
//
// Everything is Web Animations: the whole scene can be finished at once. Without this chunk (no JS, reduced
// motion, a deep link, pause) nothing is hidden: the natural styles already are the final state.
const SPEED = 0.55; // px per ms
const DOT_RADIUS = 9;

const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const initCareerReveal = (section: HTMLElement) => {
  const motion = getMotion();
  const track = section.querySelector<HTMLElement>('[data-embla-container]');
  const items = [...section.querySelectorAll<HTMLElement>('[data-career-item]')];
  if (!track || items.length === 0 || section.hasAttribute('data-career-reveal')) return;

  // Already on screen (loaded there, or scrolled fast), opened by a link or no motion wanted: leave it as it is.
  const rect = section.getBoundingClientRect();
  if (!motion.allowed || window.location.hash === '#career' || rect.top < window.innerHeight * 0.7) return;

  const easeOut = token('--ease-out', 'cubic-bezier(0.16, 1, 0.3, 1)');
  const easeSpring = token('--ease-spring', 'cubic-bezier(0.34, 1.56, 0.64, 1)');
  const animations: Animation[] = [];

  const animate = (
    element: Element | null,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions & { pseudoElement?: string }
  ) => {
    if (!element) return;
    const animation = element.animate(keyframes, { fill: 'both', easing: easeOut, ...options });
    animation.pause(); // shows the hidden first frame now, plays when the section is seen
    animations.push(animation);
  };

  const fadeUp: Keyframe[] = [
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ];

  const lastIndex = items.length - 1;
  const dotX = items.map(item => item.offsetLeft + DOT_RADIUS);
  const lineEnd = dotX[lastIndex];

  // The line of the path travelled.
  animate(track, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
    duration: (lineEnd - DOT_RADIUS) / SPEED,
    easing: 'linear',
    pseudoElement: '::after',
  });

  items.forEach((item, i) => {
    const t = (dotX[i] - DOT_RADIUS) / SPEED; // the moment the line reaches the dot
    const current = item.hasAttribute('data-current');
    const circle = item.querySelector('[data-career-circle]');

    animate(
      circle,
      [
        { transform: 'scale(0.6)', borderColor: 'var(--tertiary)' },
        { transform: 'scale(1)', borderColor: 'var(--accent)' },
      ],
      { duration: 400, delay: t, easing: easeSpring }
    );
    animate(
      item.querySelector('[data-career-ping]'),
      [
        { transform: 'scale(1)', opacity: 0.6 },
        { transform: 'scale(2.6)', opacity: 0 },
      ],
      current ? { duration: 1600, delay: t, iterations: 3 } : { duration: 600, delay: t }
    );
    animate(item.querySelector('[data-career-content]'), [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
      duration: 400,
      delay: t + 100,
      pseudoElement: '::before',
    });
    animate(
      item.querySelector('[data-career-name]'),
      [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
      { duration: 500, delay: t + 50 }
    );
    animate(item.querySelector('[data-career-meta]'), fadeUp, { duration: 400, delay: t + 150 });
    animate(item.querySelector('[data-career-text]'), fadeUp, { duration: 400, delay: t + 250 });

    // "Technologies:" (first card only) and the tags, one after another.
    const tags = [...item.querySelectorAll('[data-career-tech] > span, [data-career-stack] > *')];
    tags.forEach((tag, j) =>
      animate(
        tag,
        [
          { opacity: 0, transform: 'scale(0.9)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 250, delay: t + 350 + j * 30 }
      )
    );

    // The line goes on into the future from the current place.
    if (current) {
      animate(
        circle,
        [
          { transform: 'scaleX(0)', opacity: 0 },
          { transform: 'scaleX(1)', opacity: 1 },
        ],
        { duration: 600, delay: t + 200, pseudoElement: '::after' }
      );
    }
  });

  section.setAttribute('data-career-reveal', 'pending');

  const cleanup = () => {
    for (const animation of animations) animation.cancel(); // the natural styles are the final state
    animations.length = 0;
    section.removeAttribute('data-career-reveal');
    stop();
  };

  // The visitor takes over (a swipe, an arrow, the keyboard) or motion is switched off: the scene ends at once.
  // Cancelling is enough, the natural styles are the final state.
  const interrupt = () => cleanup();
  const sideways = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) cleanup(); // a vertical wheel is just scrolling the page
  };
  const stopMotion = onMotionChange(() => {
    if (!motion.allowed) cleanup();
  });
  const events = ['pointerdown', 'keydown', 'focusin'] as const;
  events.forEach(name => section.addEventListener(name, interrupt, { passive: true }));
  section.addEventListener('wheel', sideways, { passive: true });

  const stop = () => {
    events.forEach(name => section.removeEventListener(name, interrupt));
    section.removeEventListener('wheel', sideways);
    observer.disconnect();
    stopMotion();
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      section.setAttribute('data-career-reveal', 'playing');
      for (const animation of animations) animation.play();
      void Promise.all(animations.map(animation => animation.finished)).then(cleanup, cleanup);
    },
    { threshold: 0.3 }
  );
  observer.observe(section);
};
