import { describe, expect, it } from 'vitest';
import { buildRainWords } from './rain-words';

describe('buildRainWords', () => {
  it('adds the call to action only when open to work', () => {
    expect(buildRainWords(true, ['React'])).toEqual(['HIRE ME', 'OPEN TO WORK', 'REACT']);
    expect(buildRainWords(false, ['React'])).toEqual(['REACT']);
  });

  it('upper-cases the stack and keeps its order', () => {
    expect(buildRainWords(false, ['TypeScript', 'Next.js'])).toEqual(['TYPESCRIPT', 'NEXT.JS']);
  });
});
