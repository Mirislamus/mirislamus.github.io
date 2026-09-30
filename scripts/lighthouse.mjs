// Runs Lighthouse (mobile) on the three language versions of a finished build. The SEO category must be 100;
// the other categories are only reported. The site is served from `dist` with its public address replaced by the
// local one, so canonical and hreflang are judged as they would be on the real domain.
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import { withSite } from './render.mjs';

const SITE = 'https://mirislamus.github.io';
const PAGES = ['/', '/ru/', '/uz/'];
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
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

      const scores = CATEGORIES.map(id => `${id} ${Math.round((categories[id].score ?? 0) * 100)}`);
      console.log(`${path.padEnd(5)} ${scores.join(' · ')}`);

      if (categories.seo.score !== 1) {
        const failed = categories.seo.auditRefs
          .map(ref => audits[ref.id])
          .filter(audit => audit.score !== null && audit.score < 1)
          .map(audit => `${audit.id}: ${audit.title}`);
        failures.push(`${path} SEO ${Math.round((categories.seo.score ?? 0) * 100)}: ${failed.join('; ')}`);
      }
    }
  },
  { launch: { args: [`--remote-debugging-port=${PORT}`] }, site: SITE }
);

if (failures.length > 0) {
  console.error(`\nLighthouse SEO must be 100:\n${failures.join('\n')}`);
  process.exit(1);
}
