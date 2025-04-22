import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (refs: Array<RefObject<HTMLElement | null>>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      const isInsideSomeRef = refs.some(ref => ref.current?.contains(target));

      if (!isInsideSomeRef) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, callback]);
};
