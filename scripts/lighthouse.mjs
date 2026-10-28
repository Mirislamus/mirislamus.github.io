// Runs Lighthouse (mobile) on the three language versions of a finished build and fails below the thresholds of
// docs/quality.md §2. The site is served from `dist` with its public address replaced by the local one, so canonical
// and hreflang are judged as they would be on the real domain.
import lighthouse from 'lighthouse';
import { fileURLToPath } from 'node:url';

import { withSite } from './render.mjs';

const SITE = 'https://mirislamus.github.io';
const PAGES = ['/', '/ru/', '/uz/'];
const MIN_SCORES = { performance: 90, accessibility: 95, 'best-practices': 100, seo: 100 };
const CATEGORIES = Object.keys(MIN_SCORES);
const PORT = 9333;

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const failures = [];

await withSite(
  dist,
  async (_browser, origin) => {
    for (const path of PAGES) {
      const result = await lighthouse(`${origin}${path}`, {
        port: PORT,
        logLevel: 'error',
        output: 'json',
        onlyCategories: CATEGORIES,
      });
      const { categories, audits } = result.lhr;
      const score = id => Math.round((categories[id].score ?? 0) * 100);

      console.log(`${path.padEnd(5)} ${CATEGORIES.map(id => `${id} ${score(id)}`).join(' · ')}`);

      for (const id of CATEGORIES) {
        if (score(id) >= MIN_SCORES[id]) continue;
        const failed = categories[id].auditRefs
          .map(ref => audits[ref.id])
          .filter(audit => audit.score !== null && audit.score < 1)
          .map(audit => `${audit.id}: ${audit.title}`);
        failures.push(`${path} ${id} ${score(id)} < ${MIN_SCORES[id]}: ${failed.join('; ')}`);
      }
    }
  },
  { launch: { args: [`--remote-debugging-port=${PORT}`] }, site: SITE },
);

if (failures.length > 0) {
  console.error(`\nLighthouse is below the thresholds:\n${failures.join('\n')}`);
  process.exit(1);
}
