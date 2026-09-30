// One delegated listener for every `[data-ripple]` element (replaces the per-button React hook).
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', event => {
  if (reduceMotion.matches || !(event.target instanceof Element)) return;

  const element = event.target.closest<HTMLElement>('[data-ripple]');
  if (!element || element.matches(':disabled, [aria-disabled="true"]')) return;

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');

  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px`;
  element.append(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

export {};
