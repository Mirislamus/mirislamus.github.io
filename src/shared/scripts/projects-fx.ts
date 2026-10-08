import { GLYPHS } from './matrix/glyphs';
import { getMotion } from './matrix/motion';

// The name of a project "decrypts" under the mouse or on keyboard focus (A-07): for about 400 ms its letters are
// swapped for Matrix glyphs from left to right and then restored in the same order. Every glyph goes into the same
// position and the width of the name is fixed, so nothing around it moves. Screen readers get the real name from the
// aria-label of the link; the letters here are aria-hidden.
//
// Without this chunk (no JS, reduced motion, pause, touch) the name is just the name.
const DURATION = 420; // ms

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export const initProjectNames = (root: HTMLElement) => {
  const motion = getMotion();
  const running = new WeakSet<HTMLElement>();
  root.setAttribute('data-names', 'ready'); // the listeners below are in place

  const play = (name: HTMLElement) => {
    if (!motion.allowed || running.has(name)) return;
    running.add(name);

    const original = name.dataset.original ?? (name.dataset.original = (name.textContent ?? '').trim());
    const chars = [...original];
    name.style.inlineSize = `${name.getBoundingClientRect().width}px`;
    // The time counts from the first frame, not from the event: on a busy page that frame can come late, and the
    // effect would end before it is seen. The first frame already has a glyph in it.
    let start: number | undefined;

    const frame = (now: number) => {
      start ??= now;
      const q = Math.min(1, (now - start) / DURATION);
      // First the glyphs run to the right end, then the real letters come back from the left.
      const glyphs = Math.min(chars.length, Math.max(1, Math.ceil(q * 2 * chars.length)));
      const restored = Math.max(0, Math.floor((q * 2 - 1) * chars.length));
      name.textContent = chars
        .map((char, i) => (char === ' ' || i < restored || i >= glyphs ? char : randomGlyph()))
        .join('');

      if (q < 1 && motion.allowed) {
        requestAnimationFrame(frame);
        return;
      }
      name.textContent = original;
      name.style.inlineSize = '';
      running.delete(name);
    };
    requestAnimationFrame(frame);
  };

  const nameOf = (target: EventTarget | null) =>
    (target as HTMLElement | null)?.closest('article')?.querySelector<HTMLElement>('[data-name]');

  // Only a mouse and the keyboard, not a touch; one listener for every card.
  root.addEventListener('pointerover', event => {
    const card = (event.target as HTMLElement).closest('article');
    if (!card || event.pointerType !== 'mouse' || card.contains(event.relatedTarget as Node | null)) return;
    const name = nameOf(card);
    if (name) play(name);
  });
  root.addEventListener('focusin', event => {
    const card = (event.target as HTMLElement).closest('article');
    if (!card || card.contains(event.relatedTarget as Node | null)) return;
    if (!(event.target as HTMLElement).matches(':focus-visible')) return;
    const name = nameOf(card);
    if (name) play(name);
  });
};
