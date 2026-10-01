import { describe, expect, it } from 'vitest';
import { MAX_DT, createTicker, type TickerEnv } from './ticker';

const setup = (maxFps = 60) => {
  let pending: ((now: number) => void) | undefined;
  let hidden = false;
  let visibility: () => void = () => {};
  let nextId = 1;
  let activeId = 0;

  const env: TickerEnv = {
    raf: callback => {
      pending = callback;
      activeId = nextId++;
      return activeId;
    },
    cancel: id => {
      if (id === activeId) pending = undefined;
    },
    isHidden: () => hidden,
    onVisibilityChange: listener => (visibility = listener),
  };

  return {
    ticker: createTicker(env, maxFps),
    frame: (now: number) => {
      const callback = pending;
      pending = undefined;
      callback?.(now);
    },
    hasPending: () => pending !== undefined,
    setHidden: (value: boolean) => {
      hidden = value;
      visibility();
    },
  };
};

describe('ticker', () => {
  it('does not run without subscribers and stops when the last one leaves', () => {
    const { ticker, hasPending, frame } = setup();
    expect(ticker.running).toBe(false);

    const off = ticker.subscribe(() => {});
    expect(ticker.running).toBe(true);
    expect(hasPending()).toBe(true);

    off();
    expect(ticker.running).toBe(false);
    frame(16);
    expect(hasPending()).toBe(false);
  });

  it('caps the frame rate', () => {
    const { ticker, frame } = setup(30);
    const dts: number[] = [];
    ticker.subscribe(dt => dts.push(dt));

    for (let now = 1000; now <= 1200; now += 16.7) frame(now);

    // first call has dt 0, then roughly every other frame (~33 ms)
    expect(dts.length).toBeLessThanOrEqual(7);
    expect(dts.slice(1).every(dt => dt > 0.03)).toBe(true);
  });

  it('never hands out a dt above the cap, even after a long gap', () => {
    const { ticker, frame } = setup();
    const dts: number[] = [];
    ticker.subscribe(dt => dts.push(dt));

    frame(1000);
    frame(6000);

    expect(dts).toEqual([0, MAX_DT]);
  });

  it('stops while the tab is hidden and restarts without a jump', () => {
    const { ticker, frame, setHidden, hasPending } = setup();
    const dts: number[] = [];
    ticker.subscribe(dt => dts.push(dt));
    frame(1000);

    setHidden(true);
    expect(hasPending()).toBe(false);
    expect(ticker.running).toBe(false);

    setHidden(false);
    expect(ticker.running).toBe(true);
    frame(90000);
    expect(dts).toEqual([0, 0]);
  });
});
