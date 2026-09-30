export interface FuzzyMatch {
  // Lower is better.
  score: number;
  // Indexes of the matched characters of the text, for highlighting.
  positions: number[];
}

// Finds `query` in `text` as a run of characters or, failing that, as a subsequence ("gh" finds "GitHub").
// Case does not matter. An empty query matches everything.
export const fuzzyMatch = (query: string, text: string): FuzzyMatch | null => {
  const needle = query.trim().toLowerCase();
  if (!needle) return { score: 0, positions: [] };

  const haystack = text.toLowerCase();
  const start = haystack.indexOf(needle);
  if (start >= 0) {
    return { score: start, positions: Array.from({ length: needle.length }, (_, index) => start + index) };
  }

  const positions: number[] = [];
  let from = 0;
  for (const char of needle) {
    if (char === ' ') continue;
    const at = haystack.indexOf(char, from);
    if (at < 0) return null;
    positions.push(at);
    from = at + 1;
  }

  // A subsequence always ranks below a plain substring; a tighter one ranks above a scattered one.
  return { score: 100 + (positions.at(-1) ?? 0) - (positions[0] ?? 0), positions };
};

// Splits the text into runs so the matched characters can be wrapped: [text, highlighted, text, ...].
export const highlightRuns = (text: string, positions: number[]): { text: string; match: boolean }[] => {
  const marked = new Set(positions);
  const runs: { text: string; match: boolean }[] = [];

  [...text].forEach((char, index) => {
    const match = marked.has(index);
    const last = runs.at(-1);
    if (last?.match === match) last.text += char;
    else runs.push({ text: char, match });
  });

  return runs;
};
