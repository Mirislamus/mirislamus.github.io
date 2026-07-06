import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

export const useClickOutside = (refs: Array<RefObject<HTMLElement | null>>, callback: () => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      const isInsideSomeRef = refs.some(ref => ref.current?.contains(target));

      if (!isInsideSomeRef) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs]);
};
