import { getMotion } from './matrix/motion';

// The email and Telegram buttons of the footer lean towards the cursor (A-11): up to 6 px when the cursor is closer
// than 60 px, the text inside a little further (2 px more). One delegated listener on the whole block; the frame
// loop only runs while the cursor is near. When it goes away the transform is removed completely and the button
// springs back (the transition in the CSS). A mouse only, and never with reduced motion or pause.
const REACH = 60; // px from the button
const PULL = 6; // px
const EXTRA = 2; // px more for the text

export const initMagnetic = (block: HTMLElement) => {
  const motion = getMotion();
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const buttons = [...block.querySelectorAll<HTMLElement>('[data-magnet]')];
  let pointer: { x: number; y: number } | null = null;
  let frame = 0;

  const lean = (button: HTMLElement) => {
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = pointer ? pointer.x - Math.max(rect.left, Math.min(pointer.x, rect.right)) : Infinity;
    const dy = pointer ? pointer.y - Math.max(rect.top, Math.min(pointer.y, rect.bottom)) : Infinity;
    const distance = Math.hypot(dx, dy);
    const text = button.querySelector<HTMLElement>('[data-magnet-text]');

    if (!pointer || distance >= REACH || !motion.allowed) {
      if (button.hasAttribute('data-follow')) {
        button.removeAttribute('data-follow');
        button.style.translate = '';
        if (text) text.style.translate = '';
      }
      return false;
    }

    const toward = Math.hypot(pointer.x - cx, pointer.y - cy) || 1;
    const strength = 1 - distance / REACH;
    const x = ((pointer.x - cx) / toward) * PULL * strength;
    const y = ((pointer.y - cy) / toward) * PULL * strength;
    button.setAttribute('data-follow', '');
    button.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    if (text) text.style.translate = `${((x / PULL) * EXTRA).toFixed(2)}px ${((y / PULL) * EXTRA).toFixed(2)}px`;
    return true;
  };

  const tick = () => {
    frame = 0;
    // The loop goes on only while some button is leaning.
    if (buttons.map(lean).some(Boolean)) frame = requestAnimationFrame(tick);
  };

  document.addEventListener(
    'pointermove',
    event => {
      if (event.pointerType !== 'mouse' || !fine.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: true }
  );
  document.documentElement.addEventListener('pointerleave', () => {
    pointer = null;
    if (!frame) frame = requestAnimationFrame(tick);
  });
};
