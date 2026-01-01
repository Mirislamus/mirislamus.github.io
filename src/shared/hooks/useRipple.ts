import { type MouseEvent, useCallback } from 'react';

interface RippleOptions {
  duration?: number;
}

export const useRipple = ({ duration = 600 }: RippleOptions = {}) => {
  return useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${e.clientX - rect.left - size / 2}px`,
        top: `${e.clientY - rect.top - size / 2}px`,
      });

      el.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    },
    [duration]
  );
};
