import { watchColors } from './accent';
import { getMotion, onMotionChange } from './motion';
import { DESKTOP_RAIN, TOUCH_RAIN, createRain } from './rain';
import { getTicker } from './ticker';

// The Hero effects chunk: the digital rain (M-01). Loaded with import() after the page is interactive,
// so none of it is in the main bundle. `data-state` on the canvas says what it is doing:
// running (animating), idle (not on screen or the tab is hidden) or static (one still frame).
export const initHeroFx = (section: HTMLElement) => {
  const canvas = section.querySelector<HTMLCanvasElement>('canvas[data-rain]');
  const content = section.querySelector<HTMLElement>('[data-hero-content]');
  if (!canvas || canvas.dataset.state) return;

  const motion = getMotion();
  const ticker = getTicker();
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  const rain = createRain(canvas, coarse ? TOUCH_RAIN : DESKTOP_RAIN);

  try {
    rain.setWords(JSON.parse(canvas.dataset.words ?? '[]') as string[]);
  } catch {
    // No words: plain rain.
  }

  let visible = true;
  let stop: (() => void) | undefined;
  let state = '';

  const setState = (next: string) => {
    if (state === next) return;
    state = next;
    canvas.dataset.state = next;
  };

  const measure = () => {
    rain.resize();
    if (!content) return;
    const area = canvas.getBoundingClientRect();
    const box = content.getBoundingClientRect();
    rain.setSafeZone({
      cx: box.left - area.left + box.width / 2,
      cy: box.top - area.top + box.height / 2,
      rx: box.width * 0.6,
      ry: box.height * 0.6,
    });
  };

  const sync = () => {
    stop?.();
    stop = undefined;

    if (!motion.allowed) {
      rain.still();
      setState('static');
    } else if (visible && !document.hidden) {
      stop = ticker.subscribe(dt => rain.tick(dt));
      setState('running');
    } else {
      setState('idle');
    }
  };

  measure();
  watchColors(colors => rain.setColors(colors));

  new ResizeObserver(measure).observe(section);
  if (content) new ResizeObserver(measure).observe(content);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) rain.setPointer(null);
    sync();
  }).observe(section);

  onMotionChange(sync);
  document.addEventListener('visibilitychange', sync);

  section.addEventListener(
    'pointermove',
    event => {
      if (event.pointerType !== 'mouse' || !fineMouse.matches || !motion.allowed) return;
      const area = canvas.getBoundingClientRect();
      rain.setPointer(event.clientX - area.left, event.clientY - area.top);
    },
    { passive: true }
  );
  section.addEventListener('pointerleave', () => rain.setPointer(null));

  sync();
};
