import { LIQUID_POINTS, blobPath } from './liquid-path';

// The liquid avatar (M-03): the outline is a ring of springs. At rest it slowly "breathes"; the edge
// nearest to the cursor stretches towards it like a drop and springs back with a wobble when the
// cursor leaves; a tap on touch screens dents the edge. The photo also drifts a few pixels with the cursor.
const CENTER = 130; // viewBox is 260 × 260
const RADIUS = 120;
const STIFFNESS = 180;
const DAMPING = 9;
const REACH_PX = 120; // the cursor starts to pull when it is closer than this to the edge
const PULL = 0.5; // × RADIUS at the edge
const DENT = 0.06; // × RADIUS with the cursor inside
const TAP_IMPULSE = 5; // × RADIUS per second
const PHOTO_SHIFT_PX = 6;
// The photo ends at y = 295 (and drifts by a few px): the outline must never go lower than this, or the cut
// bottom edge of the photo would show. Below the center the edge may only move as far as this allows.
const LOWEST_EDGE = 285;
const PHOTO_LERP = 0.12; // per frame at 60 fps
const SWAY = 0.6; // rad: how far the gradient turns each way (blue and red slowly trade places)
const SWAY_SPEED = 0.35; // rad per second of the phase
const GRADIENT_REACH = 110;

export interface Liquid {
  tick: (dt: number) => void;
  /** Back to the static outline and a still photo. */
  still: () => void;
  /** Cursor in client px with the Hero rect for the photo drift; null when it is gone. */
  aim: (pointer: { x: number; y: number } | null, hero?: DOMRect) => void;
  tap: (clientX: number, clientY: number) => void;
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const createLiquid = (svg: SVGSVGElement): Liquid | null => {
  const shape = svg.querySelector<SVGPathElement>('[data-avatar-shape]');
  const photo = svg.querySelector<SVGGElement>('[data-photo]');
  if (!shape) return null;
  const staticShape = shape.dataset.shapeA ?? shape.getAttribute('d') ?? '';
  const gradient = svg.querySelector<SVGLinearGradientElement>('#avatar-gradient');
  const gradientAttrs = ['x1', 'y1', 'x2', 'y2'].map(name => [name, gradient?.getAttribute(name) ?? ''] as const);

  const offsets = new Array<number>(LIQUID_POINTS).fill(0);
  const velocities = new Array<number>(LIQUID_POINTS).fill(0);
  let time = 0;
  let pointer: { x: number; y: number } | null = null;
  let photoX = 0;
  let photoY = 0;
  let photoTargetX = 0;
  let photoTargetY = 0;

  const weight = (pointAngle: number, aimAngle: number) => Math.max(0, Math.cos(pointAngle - aimAngle)) ** 6;

  // How far each point may move outwards: only the points that face down are limited.
  const reach = Array.from({ length: LIQUID_POINTS }, (_, i) => {
    const down = Math.sin((i / LIQUID_POINTS) * Math.PI * 2);
    return down > 0.05 ? (LOWEST_EDGE - CENTER) / down - RADIUS : Infinity;
  });

  return {
    tick(dt) {
      time += dt;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / (CENTER * 2);

      let aimAngle = 0;
      let edge = Infinity;
      if (pointer) {
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        aimAngle = Math.atan2(dy, dx);
        edge = Math.hypot(dx, dy) - RADIUS * scale;
      }

      for (let i = 0; i < LIQUID_POINTS; i++) {
        const angle = (i / LIQUID_POINTS) * Math.PI * 2;
        let target = RADIUS * (0.045 * Math.sin(1.6 * time + 1.3 * i) + 0.03 * Math.sin(0.9 * time - 2.1 * i)); // breathing

        if (pointer) {
          if (edge > 0 && edge < REACH_PX) target += PULL * RADIUS * (1 - edge / REACH_PX) * weight(angle, aimAngle);
          else if (edge <= 0) target -= DENT * RADIUS * weight(angle, aimAngle);
        }

        target = Math.min(target, reach[i]);

        velocities[i] += (STIFFNESS * (target - offsets[i]) - DAMPING * velocities[i]) * dt;
        offsets[i] += velocities[i] * dt;
        if (offsets[i] > reach[i]) {
          offsets[i] = reach[i];
          velocities[i] = Math.min(velocities[i], 0);
        }
      }
      shape.setAttribute('d', blobPath(offsets, RADIUS, CENTER, CENTER));

      if (gradient) {
        const turn = SWAY * Math.sin(SWAY_SPEED * time);
        const dx = GRADIENT_REACH * Math.cos(turn);
        const dy = GRADIENT_REACH * Math.sin(turn);
        gradient.setAttribute('x1', (CENTER - dx).toFixed(1));
        gradient.setAttribute('y1', (CENTER - dy).toFixed(1));
        gradient.setAttribute('x2', (CENTER + dx).toFixed(1));
        gradient.setAttribute('y2', (CENTER + dy).toFixed(1));
      }

      if (photo) {
        const follow = 1 - (1 - PHOTO_LERP) ** (dt * 60);
        photoX += (photoTargetX - photoX) * follow;
        photoY += (photoTargetY - photoY) * follow;
        photo.style.transform = `translate(${(photoX * PHOTO_SHIFT_PX).toFixed(2)}px, ${(photoY * PHOTO_SHIFT_PX).toFixed(2)}px)`;
      }
    },

    still() {
      offsets.fill(0);
      velocities.fill(0);
      photoX = photoY = photoTargetX = photoTargetY = 0;
      pointer = null;
      shape.setAttribute('d', staticShape);
      for (const [name, value] of gradientAttrs) gradient?.setAttribute(name, value);
      if (photo) photo.style.transform = '';
    },

    aim(next, hero) {
      pointer = next;
      if (next && hero) {
        photoTargetX = clamp(((next.x - hero.left) / hero.width) * 2 - 1);
        photoTargetY = clamp(((next.y - hero.top) / hero.height) * 2 - 1);
      } else {
        photoTargetX = 0;
        photoTargetY = 0;
      }
    },

    tap(clientX, clientY) {
      const rect = svg.getBoundingClientRect();
      const aimAngle = Math.atan2(clientY - (rect.top + rect.height / 2), clientX - (rect.left + rect.width / 2));
      for (let i = 0; i < LIQUID_POINTS; i++) {
        velocities[i] -= TAP_IMPULSE * RADIUS * weight((i / LIQUID_POINTS) * Math.PI * 2, aimAngle);
      }
    },
  };
};
