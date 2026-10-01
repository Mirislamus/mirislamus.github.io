// "May things move?" for the Matrix effects: false when the system asks for reduced motion or when the
// visitor pressed the pause button (remembered in localStorage). Changes are announced as a
// `motionchange` event on the document.
export const MOTION_STORAGE_KEY = 'motion-paused';
const MOTION_EVENT = 'motionchange';

export interface MotionEnv {
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  reducedQuery: { matches: boolean; addEventListener: (type: 'change', listener: () => void) => void };
  emit: () => void;
}

export interface Motion {
  readonly reduced: boolean;
  readonly paused: boolean;
  readonly allowed: boolean;
  setPaused: (paused: boolean) => void;
}

export const createMotion = (env: MotionEnv): Motion => {
  const read = () => {
    try {
      return env.storage?.getItem(MOTION_STORAGE_KEY) === '1';
    } catch {
      return false; // storage is blocked: the choice still applies to this page view
    }
  };

  let paused = read();
  env.reducedQuery.addEventListener('change', env.emit);

  return {
    get reduced() {
      return env.reducedQuery.matches;
    },
    get paused() {
      return paused;
    },
    get allowed() {
      return !env.reducedQuery.matches && !paused;
    },
    setPaused(next) {
      if (next === paused) return;
      paused = next;
      try {
        if (next) env.storage?.setItem(MOTION_STORAGE_KEY, '1');
        else env.storage?.removeItem(MOTION_STORAGE_KEY);
      } catch {
        // Not remembered, but applied now.
      }
      env.emit();
    },
  };
};

let shared: Motion | undefined;

export const getMotion = (): Motion =>
  (shared ??= (() => {
    let storage: MotionEnv['storage'] = null;
    try {
      storage = window.localStorage;
    } catch {
      // Accessing localStorage can throw when site data is blocked.
    }
    return createMotion({
      storage,
      reducedQuery: window.matchMedia('(prefers-reduced-motion: reduce)'),
      emit: () => document.dispatchEvent(new Event(MOTION_EVENT)),
    });
  })());

export const onMotionChange = (listener: () => void) => {
  document.addEventListener(MOTION_EVENT, listener);
  return () => document.removeEventListener(MOTION_EVENT, listener);
};
