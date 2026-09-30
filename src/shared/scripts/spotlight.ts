// Moves the cursor-following highlight of `[data-spotlight]` cards. One delegated listener; it only
// runs for a real mouse (no touch) and does nothing when the user prefers reduced motion.
const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener(
  'pointermove',
  event => {
    if (event.pointerType !== 'mouse' || !fineMouse.matches || reduceMotion.matches) return;
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest<HTMLElement>('[data-spotlight]');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  },
  { passive: true }
);

export {};
