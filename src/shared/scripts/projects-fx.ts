import { GLYPHS } from './matrix/glyphs';
import { getMotion } from './matrix/motion';

const DURATION = 420;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export const initProjectNames = (root: HTMLElement) => {
  const motion = getMotion();
  const running = new WeakSet<HTMLElement>();
  root.setAttribute('data-names', 'ready');

  const play = (name: HTMLElement) => {
    if (!motion.allowed || running.has(name)) return;
    running.add(name);

    const original = name.dataset.original ?? (name.dataset.original = (name.textContent ?? '').trim());
    const chars = [...original];
    name.style.inlineSize = `${name.getBoundingClientRect().width}px`;
    let start: number | undefined;

    const frame = (now: number) => {
      start ??= now;
      const q = Math.min(1, (now - start) / DURATION);
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
