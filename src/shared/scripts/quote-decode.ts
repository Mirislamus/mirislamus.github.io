import { GLYPHS } from './matrix/glyphs';
import { getMotion } from './matrix/motion';

// The quotation mark in the corner of the first review that is seen is, for about half a second, two or three glyphs
// of the Matrix and then the mark itself (A-10). Once per page load. Without this chunk (or with reduced motion and
// pause) it is simply the mark.
const STEPS = [0, 170, 340]; // ms at which a new glyph is shown
const END = 520; // ms: the real mark is back

export const initQuoteDecode = (root: HTMLElement) => {
  const quotes = [...root.querySelectorAll<HTMLElement>('[data-quote]')];
  root.setAttribute('data-quote-fx', 'ready');
  if (!getMotion().allowed) return;

  const observer = new IntersectionObserver(
    entries => {
      const seen = entries.find(entry => entry.isIntersecting);
      if (!seen) return;
      observer.disconnect();
      const quote = (seen.target as HTMLElement).querySelector<HTMLElement>('[data-quote]');
      if (!quote) return;
      const mark = quote.textContent?.trim() ?? '“';
      for (const step of STEPS)
        setTimeout(() => (quote.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]), step);
      setTimeout(() => (quote.textContent = mark), END);
    },
    { threshold: 0.9 }
  );
  quotes.forEach(quote => observer.observe(quote.closest('article') ?? quote));
};
