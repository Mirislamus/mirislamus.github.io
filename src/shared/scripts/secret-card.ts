import { GLYPHS } from './matrix/glyphs';
import { cssDuration, getMotion, onMotionChange } from './matrix/motion';

// The "Top secret" card (A-05). The names and descriptions of the two projects are not on the page at all:
// the black bars are only `█`, and the lengths come from the data. This chunk adds the play:
//  - the readiness bars fill once when the card is half on screen;
//  - a bar "decrypts" under the cursor or focus: the blocks turn into random glyphs left to right and grow
//    over again. The glyphs never make up any text;
//  - a code in the invite field is always refused, nothing is sent or stored anywhere.
//
// Without this chunk (no JS, reduced motion, pause) the bars are in their final state and nothing moves.
const COVER = '█';
const DECODE = 900; // ms for the blocks to turn into glyphs
const COVER_UP = 300; // ms for them to grow over again
const FLICKER = 60; // ms between two sets of glyphs

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export const initSecretCard = (root: HTMLElement) => {
  const motion = getMotion();
  const card = root.closest<HTMLElement>('article') ?? root;
  const running = new WeakSet<HTMLElement>();
  root.setAttribute('data-secret', 'ready'); // the listeners below are in place

  // The readiness bars, once.
  const meters = [...root.querySelectorAll<HTMLElement>('[data-meter]')];
  if (meters.length > 0 && motion.allowed && window.location.hash !== '#approach') {
    const animations = meters.map(meter => {
      const value = Number(meter.style.getPropertyValue('--p'));
      const animation = meter.animate([{ transform: 'scaleX(0)' }, { transform: `scaleX(${value})` }], {
        duration: cssDuration('--dur-intro', 800),
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      });
      animation.pause(); // the first frame (empty) now, the fill when the card is seen
      return animation;
    });
    const settle = () => {
      for (const animation of animations) animation.cancel(); // the natural style is the final state
      observer.disconnect();
      stopMotion();
    };
    const stopMotion = onMotionChange(() => {
      if (!motion.allowed) settle();
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        for (const animation of animations) animation.play();
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
