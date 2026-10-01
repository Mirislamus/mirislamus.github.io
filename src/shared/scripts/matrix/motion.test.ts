import { describe, expect, it } from 'vitest';
import { MOTION_STORAGE_KEY, createMotion, type MotionEnv } from './motion';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => void (data[key] = value),
    removeItem: (key: string) => void delete data[key],
  };
};

const reduced = (matches: boolean) => ({ matches, addEventListener: () => {} });

describe('motion', () => {
  it('allows motion by default', () => {
    const motion = createMotion({ storage: memoryStorage(), reducedQuery: reduced(false), emit: () => {} });
    expect(motion.allowed).toBe(true);
  });

  it('is not allowed when the system asks for reduced motion', () => {
    const motion = createMotion({ storage: memoryStorage(), reducedQuery: reduced(true), emit: () => {} });
    expect(motion.reduced).toBe(true);
    expect(motion.allowed).toBe(false);
  });

  it('is not allowed when paused, remembers the choice and announces changes', () => {
    const storage = memoryStorage();
    let emitted = 0;
    const motion = createMotion({ storage, reducedQuery: reduced(false), emit: () => emitted++ });

    motion.setPaused(true);
    expect(motion.allowed).toBe(false);
    expect(storage.data[MOTION_STORAGE_KEY]).toBe('1');

    motion.setPaused(true);
    expect(emitted).toBe(1);

    motion.setPaused(false);
    expect(motion.allowed).toBe(true);
    expect(storage.data[MOTION_STORAGE_KEY]).toBeUndefined();
    expect(emitted).toBe(2);
  });

  it('reads a stored pause on start', () => {
    const storage = memoryStorage({ [MOTION_STORAGE_KEY]: '1' });
    const motion = createMotion({ storage, reducedQuery: reduced(false), emit: () => {} });
    expect(motion.paused).toBe(true);
  });

  it('survives storage that throws or is missing', () => {
    const broken: MotionEnv['storage'] = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const motion = createMotion({ storage: broken, reducedQuery: reduced(false), emit: () => {} });
    expect(motion.allowed).toBe(true);
    motion.setPaused(true);
    expect(motion.allowed).toBe(false);

    const none = createMotion({ storage: null, reducedQuery: reduced(false), emit: () => {} });
    none.setPaused(true);
    expect(none.paused).toBe(true);
  });
});
