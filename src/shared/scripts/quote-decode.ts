import { pick } from '@/utils/list';

import { GLYPHS } from './matrix/glyphs';
import { getMotion } from './matrix/motion';

const STEPS = [0, 170, 340];
const END = 520;

export const initQuoteDecode = (root: HTMLElement) => {
  const quotes = [...root.querySelectorAll<HTMLElement>('[data-quote]')];
  root.setAttribute('data-quote-fx', 'ready');
  if (!getMotion().allowed) return;

  const observer = new IntersectionObserver(
    entries => {
      const seen = entries.find(entry => entry.isIntersecting);
      if (!seen) return;
      observer.disconnect();
      const quote = seen.target.querySelector<HTMLElement>('[data-quote]');
      if (!quote) return;
      const mark = quote.textContent?.trim() ?? '“';
      for (const step of STEPS) setTimeout(() => (quote.textContent = pick(GLYPHS, Math.random())), step);
      setTimeout(() => (quote.textContent = mark), END);
    },
    { threshold: 0.9 },
  );
  quotes.forEach(quote => observer.observe(quote.closest('article') ?? quote));
};
