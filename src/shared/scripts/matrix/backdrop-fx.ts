import { watchColors } from './accent';
import { getMotion, onMotionChange } from './motion';
import { DESKTOP_RAIN, TOUCH_RAIN, createRain } from './rain';
import { getTicker } from './ticker';

// Rain behind a whole page (the 404): the same engine as the Hero, but no flashlight, no hidden words and
// no evaporation at the bottom, because the canvas covers the screen. `data-state` as in the Hero:
// running, idle (the tab is hidden) or static (one still frame).
export const initBackdrop = (canvas: HTMLCanvasElement, content: HTMLElement | null) => {
  if (canvas.dataset.state) return;

  const motion = getMotion();
  const ticker = getTicker();
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const rain = createRain(canvas, { ...(coarse ? TOUCH_RAIN : DESKTOP_RAIN), flashlight: 0, evaporate: 0 });

  let stop: (() => void) | undefined;
  let state = '';

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

    let next = 'idle';
    if (!motion.allowed) {
      rain.still();
      next = 'static';
    } else if (!document.hidden) {
      stop = ticker.subscribe(dt => rain.tick(dt));
      next = 'running';
    }
    if (next !== state) {
      state = next;
      canvas.dataset.state = next;
    }
  };

  measure();
  watchColors(colors => rain.setColors(colors));
  new ResizeObserver(measure).observe(canvas);
  if (content) new ResizeObserver(measure).observe(content);
  onMotionChange(sync);
  document.addEventListener('visibilitychange', sync);
  sync();
};
