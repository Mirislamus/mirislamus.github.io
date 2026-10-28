import { createRng } from '@/shared/scripts/matrix/glyphs';
import { at, pick } from '@/utils/list';

export const ASCII_POOLS = [' ', '.:', '+*-=', '#$%&', '@7490'] as const;

export const levelOfChar = (char: string): number => {
  const level = ASCII_POOLS.findIndex(pool => pool.includes(char));
  return level < 0 ? 0 : level;
};

export const levelsToText = (levels: readonly string[], seed: number): string => {
  const rng = createRng(seed);
  return levels
    .map(row =>
      [...row]
        .map(digit => {
          const pool = at(ASCII_POOLS, Number(digit));
          return pool.length === 1 ? pool : pick(pool, rng());
        })
        .join(''),
    )
    .join('\n');
};
