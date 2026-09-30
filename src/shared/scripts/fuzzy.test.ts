import { describe, expect, it } from 'vitest';
import { fuzzyMatch, highlightRuns } from './fuzzy';

describe('fuzzyMatch', () => {
  it('matches everything for an empty query', () => {
    expect(fuzzyMatch('  ', 'Anything')).toEqual({ score: 0, positions: [] });
  });

  it('finds a run of characters regardless of case and reports where', () => {
    expect(fuzzyMatch('hub', 'GitHub')).toEqual({ score: 3, positions: [3, 4, 5] });
  });

  it('finds a subsequence and ranks it below any substring', () => {
    const scattered = fuzzyMatch('gb', 'GitHub');
    expect(scattered?.positions).toEqual([0, 5]);
    expect(scattered!.score).toBeGreaterThan(fuzzyMatch('hub', 'GitHub')!.score);
  });

  it('returns null when a character is missing or out of order', () => {
    expect(fuzzyMatch('xyz', 'GitHub')).toBeNull();
    expect(fuzzyMatch('bh', 'GitHub')).toBeNull();
  });

  it('works with Cyrillic', () => {
    expect(fuzzyMatch('тем', 'Тёмная тема')?.positions).toEqual([7, 8, 9]);
  });
});

describe('highlightRuns', () => {
  it('splits the text into matched and unmatched runs', () => {
    expect(highlightRuns('GitHub', [3, 4, 5])).toEqual([
      { text: 'Git', match: false },
      { text: 'Hub', match: true },
    ]);
  });

  it('returns a single run when nothing matches', () => {
    expect(highlightRuns('Home', [])).toEqual([{ text: 'Home', match: false }]);
  });
});
