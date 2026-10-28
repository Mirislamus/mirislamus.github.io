import { getMotion } from './matrix/motion';

const REACH = 60;
const PULL = 6;
const EXTRA = 2;

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
    if (buttons.map(lean).some(Boolean)) frame = requestAnimationFrame(tick);
  };

  document.addEventListener(
    'pointermove',
    event => {
      if (event.pointerType !== 'mouse' || !fine.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    pointer = null;
    if (!frame) frame = requestAnimationFrame(tick);
  });
};
