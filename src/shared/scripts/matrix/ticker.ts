export type TickCallback = (dt: number, now: number) => void;

export interface TickerEnv {
  raf: (callback: (now: number) => void) => number;
  cancel: (id: number) => void;
  isHidden: () => boolean;
  onVisibilityChange: (listener: () => void) => void;
}

export interface Ticker {
  subscribe: (callback: TickCallback) => () => void;
  setMaxFps: (fps: number) => void;
  readonly running: boolean;
}

export const MAX_DT = 0.05;

export const createTicker = (env: TickerEnv, initialMaxFps = 60): Ticker => {
  const callbacks = new Set<TickCallback>();
  let minInterval = 1000 / initialMaxFps;
  let frame = 0;
  let last = 0;

  const loop = (now: number) => {
    frame = 0;
    if (callbacks.size === 0 || env.isHidden()) return;
    frame = env.raf(loop);

    const elapsed = now - last;
    if (last !== 0 && elapsed < minInterval - 2) return;

    const dt = last === 0 ? 0 : Math.min(MAX_DT, elapsed / 1000);
    last = now;
    for (const callback of [...callbacks]) callback(dt, now);
  };

  const start = () => {
    if (frame || callbacks.size === 0 || env.isHidden()) return;
    last = 0;
    frame = env.raf(loop);
  };

  const stop = () => {
    if (frame) env.cancel(frame);
    frame = 0;
  };

  env.onVisibilityChange(() => (env.isHidden() ? stop() : start()));

  return {
    subscribe(callback) {
      callbacks.add(callback);
      start();
      return () => {
        callbacks.delete(callback);
        if (callbacks.size === 0) stop();
      };
    },
    setMaxFps(fps) {
      minInterval = 1000 / fps;
    },
    get running() {
      return frame !== 0;
    },
  };
};

let shared: Ticker | undefined;

export const getTicker = (): Ticker =>
  (shared ??= (() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    return createTicker(
      {
        raf: callback => requestAnimationFrame(callback),
        cancel: id => cancelAnimationFrame(id),
        isHidden: () => document.hidden,
        onVisibilityChange: listener => document.addEventListener('visibilitychange', listener),
      },
      coarse ? 30 : 60,
    );
  })());
