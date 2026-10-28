import { watchColors } from './accent';
import { createLiquid } from './liquid';
import { getMotion, onMotionChange } from './motion';
import { DESKTOP_RAIN, TOUCH_RAIN, createRain } from './rain';
import { getTicker } from './ticker';

const INTRO_BURST_DEADLINE_MS = 600;

export const initHeroFx = (section: HTMLElement) => {
  const canvas = section.querySelector<HTMLCanvasElement>('canvas[data-rain]');
  const content = section.querySelector<HTMLElement>('[data-hero-content]');
  if (!canvas || canvas.dataset.state) return;

  const motion = getMotion();
  const ticker = getTicker();
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  const rain = createRain(canvas, coarse ? TOUCH_RAIN : DESKTOP_RAIN);
  const avatar = section.querySelector<SVGSVGElement>('[data-avatar]');
  const liquid = avatar ? createLiquid(avatar) : null;

  try {
    rain.setWords(JSON.parse(canvas.dataset.words ?? '[]') as string[]);
  } catch {}

  let visible = true;
  let stop: (() => void) | undefined;
  let state = '';

  const setState = (next: string) => {
    if (state === next) return;
    state = next;
    canvas.dataset.state = next;
  };

  const measure = () => {
    section.style.setProperty(
      '--rain-bleed',
      `${Math.max(0, Math.round(section.getBoundingClientRect().top + window.scrollY))}px`,
    );
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
      liquid?.still();
      setState('static');
    } else if (visible && !document.hidden) {
      stop = ticker.subscribe(dt => {
        rain.tick(dt);
        liquid?.tick(dt);
        if (canvas.hasAttribute('data-burst') && !rain.bursting) canvas.removeAttribute('data-burst');
      });
      setState('running');
    } else {
      setState('idle');
    }
  };

  measure();

  const introPlaying = document.documentElement.hasAttribute('data-intro');
  if (introPlaying && motion.allowed && performance.now() < INTRO_BURST_DEADLINE_MS) {
    rain.burst();
    canvas.setAttribute('data-burst', '');
  }

  watchColors(colors => rain.setColors(colors));

  new ResizeObserver(measure).observe(section);
  if (content) new ResizeObserver(measure).observe(content);

  new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (!visible) {
      rain.setPointer(null);
      liquid?.aim(null);
    }
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
      liquid?.aim({ x: event.clientX, y: event.clientY }, section.getBoundingClientRect());
    },
    { passive: true },
  );
  section.addEventListener('pointerleave', () => {
    rain.setPointer(null);
    liquid?.aim(null);
  });

  avatar?.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' && motion.allowed) liquid?.tap(event.clientX, event.clientY);
  });

  sync();
};
