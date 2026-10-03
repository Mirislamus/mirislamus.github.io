import { GLYPHS } from './matrix/glyphs';
import { cssDuration, getMotion, onMotionChange } from './matrix/motion';

// The "Top secret" card (A-05). The names and descriptions of the two projects are not on the page at all:
// the black bars are only `█`, and the lengths come from the data. This chunk adds the play:
//  - the readiness rings are drawn and counted once when the card is half on screen;
//  - a bar "decrypts" under the cursor or focus: the blocks turn into random glyphs left to right and grow
//    over again. The glyphs never make up any text. Without a cursor (a touch screen) the bars take turns on
//    their own, on an interval, while the card is on screen;
//  - a code in the invite field is always refused, nothing is sent or stored anywhere.
//
// Without this chunk (no JS, reduced motion, pause) the bars are in their final state and nothing moves.
const COVER = '█';
const DECODE = 900; // ms for the blocks to turn into glyphs
const COVER_UP = 300; // ms for them to grow over again
const FLICKER = 60; // ms between two sets of glyphs
const TURN = 3000; // ms between two bars decrypting by themselves on a touch screen

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export const initSecretCard = (root: HTMLElement) => {
  const motion = getMotion();
  const card = root.closest<HTMLElement>('article') ?? root;
  const running = new WeakSet<HTMLElement>();
  root.setAttribute('data-secret', 'ready'); // the listeners below are in place

  // The readiness rings, once: each ring is drawn round, its bright head runs ahead of it and the number counts up.
  const rings = [...root.querySelectorAll<SVGElement>('[data-ring]')];
  if (rings.length > 0 && motion.allowed && window.location.hash !== '#approach') {
    const duration = cssDuration('--dur-intro', 800) * 1.6;
    const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const animations: Animation[] = [];
    const counters: { element: HTMLElement; value: number }[] = [];

    for (const ring of rings) {
      const value = Number(ring.style.getPropertyValue('--p'));
      const holder = ring.closest('[data-file]');
      const tip = holder?.querySelector('[data-tip]');
      const count = holder?.querySelector<HTMLElement>('[data-count]');
      const draw = ring.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 100 - value * 100 }], {
        duration,
        easing,
        fill: 'both',
      });
      draw.pause(); // the first frame (an empty ring) now, the drawing when the card is seen
      animations.push(draw);
      if (tip) {
        const run = tip.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${value * 360}deg)` }], {
          duration,
          easing,
          fill: 'both',
        });
        run.pause();
        animations.push(run);
      }
      if (count) {
        counters.push({ element: count, value: Number(count.dataset.count) });
        count.textContent = '0%';
      }
    }

    let frame = 0;
    const settle = () => {
      cancelAnimationFrame(frame);
      for (const animation of animations) animation.cancel(); // the natural style is the final state
      for (const { element, value } of counters) element.textContent = `${value}%`;
      observer.disconnect();
      stopMotion();
    };
    const stopMotion = onMotionChange(() => {
      if (!motion.allowed) settle();
    });
    const count = (start: number) => {
      const progress = Math.min(1, (performance.now() - start) / duration);
      const eased = 1 - (1 - progress) ** 4;
      for (const { element, value } of counters) element.textContent = `${Math.round(value * eased)}%`;
      frame = progress < 1 ? requestAnimationFrame(() => count(start)) : 0;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        for (const animation of animations) animation.play();
        count(performance.now());
        void Promise.all(animations.map(animation => animation.finished)).then(settle, settle);
      },
      { threshold: 0.5 }
    );
    observer.observe(card);
  }

  // "Decrypting" a black bar.
  const decrypt = (file: HTMLElement) => {
    const chars = [...file.querySelectorAll<HTMLElement>('[data-ch]')];
    if (!motion.allowed || chars.length === 0 || running.has(file)) return;
    running.add(file);

    const start = performance.now();
    let lastSet = -FLICKER;
    let frame = 0;

    const finish = () => {
      cancelAnimationFrame(frame);
      for (const char of chars) {
        char.textContent = COVER;
        char.removeAttribute('data-glyph');
      }
      running.delete(file);
    };

    const tick = (now: number) => {
      if (!motion.allowed) return finish();
      const elapsed = now - start;
      if (elapsed >= DECODE + COVER_UP) return finish();

      const shown = Math.floor((Math.min(elapsed, DECODE) / DECODE) * chars.length);
      const covered = elapsed > DECODE ? Math.floor(((elapsed - DECODE) / COVER_UP) * chars.length) : 0;
      const refresh = now - lastSet >= FLICKER;
      if (refresh) lastSet = now;

      chars.forEach((char, i) => {
        if (i >= covered && i < shown) {
          if (refresh || !char.hasAttribute('data-glyph')) char.textContent = randomGlyph();
          char.setAttribute('data-glyph', '');
        } else {
          char.textContent = COVER;
          char.removeAttribute('data-glyph');
        }
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  // A touch screen has no cursor to hover with, so while the card is on screen the bars take turns on their own.
  if (window.matchMedia('(hover: none)').matches) {
    const bars = [...root.querySelectorAll<HTMLElement>('[data-file]')];
    let next = 0;
    let timer = 0;
    const turn = () => {
      if (!motion.allowed) return;
      decrypt(bars[next++ % bars.length]);
    };
    const stop = () => {
      clearInterval(timer);
      timer = 0;
    };
    new IntersectionObserver(
      ([entry]) => {
        stop();
        if (!entry.isIntersecting || bars.length === 0) return;
        timer = window.setInterval(turn, TURN);
        window.setTimeout(turn, TURN / 3); // the first one soon after the card appears
      },
      { threshold: 0.5 }
    ).observe(card);
  }

  // Only a mouse and the keyboard, not a touch. One listener for both bars.
  const fileOf = (target: EventTarget | null) => (target as HTMLElement | null)?.closest<HTMLElement>('[data-file]');
  root.addEventListener('pointerover', event => {
    const file = fileOf(event.target);
    if (file && event.pointerType === 'mouse' && !file.contains(event.relatedTarget as Node | null)) decrypt(file);
  });
  root.addEventListener('focusin', event => {
    const file = fileOf(event.target);
    if (
      file &&
      !file.contains(event.relatedTarget as Node | null) &&
      (event.target as HTMLElement).matches(':focus-visible')
    ) {
      decrypt(file);
    }
  });

  // The invite field: every code is refused, an empty one asks for a code.
  const form = root.querySelector<HTMLFormElement>('[data-invite]');
  const input = form?.querySelector<HTMLInputElement>('input');
  const status = form?.querySelector<HTMLElement>('[data-invite-status]');
  if (!form || !input || !status) return;

  let glitchTimer = 0;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value.trim() ? form.dataset.denied : form.dataset.empty;

    if (input.value.trim() && motion.allowed) {
      card.setAttribute('data-glitch', '');
      clearTimeout(glitchTimer);
      glitchTimer = window.setTimeout(() => card.removeAttribute('data-glitch'), cssDuration('--dur-glitch', 450));
    }

    // Emptied first so the same message is announced again.
    status.textContent = '';
    window.setTimeout(() => (status.textContent = message ?? ''), 50);
  });
};
