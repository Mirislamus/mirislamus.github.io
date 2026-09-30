import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// Budgets are in gzip KB of JS in dist/_astro. They ratchet down as the React -> Astro migration
// (docs/tz.md, RF-08..RF-14) lands; the final targets are `initial` 15 and `perChunk` 10 (docs/tz.md, section 7).
const BUDGETS = {
  initial: 15,
  perChunk: 10,
};
// Temporary ceilings for the current React build. Lower them whenever a task shrinks the bundle;
// remove them once the final budgets above pass.
const CURRENT_CEILINGS = {
  initial: 140,
  perChunk: 70,
};

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const ASTRO_DIR = join(DIST, '_astro');
const useCeilings = !process.argv.includes('--strict');
const limits = useCeilings ? CURRENT_CEILINGS : BUDGETS;

const kb = bytes => bytes / 1024;
const chunkSize = async file => gzipSync(await readFile(join(ASTRO_DIR, file)), { level: 9 }).length;

// Chunks that are only pulled in by dynamic import() are "deferred"; everything else is loaded up front.
const dynamicImports = source => [...source.matchAll(/import\(\s*["']\.\/([^"']+\.js)["']\s*\)/g)].map(m => m[1]);

const files = (await readdir(ASTRO_DIR)).filter(file => file.endsWith('.js'));
const sources = new Map(
  await Promise.all(files.map(async file => [file, await readFile(join(ASTRO_DIR, file), 'utf8')]))
);

const dynamicTargets = new Set([...sources.values()].flatMap(dynamicImports));

const sizes = new Map(await Promise.all(files.map(async file => [file, await chunkSize(file)])));
const initial = files.filter(file => !dynamicTargets.has(file));
const deferred = files.filter(file => dynamicTargets.has(file));

const initialTotal = kb(initial.reduce((sum, file) => sum + sizes.get(file), 0));
const failures = [];

if (initialTotal > limits.initial) {
  failures.push(`initial JS is ${initialTotal.toFixed(1)} KB gzip, budget ${limits.initial} KB`);
}

for (const file of files) {
  if (kb(sizes.get(file)) > limits.perChunk) {
    failures.push(`${file} is ${kb(sizes.get(file)).toFixed(1)} KB gzip, budget ${limits.perChunk} KB per chunk`);
  }
}

const print = (title, list) => {
  console.log(`\n${title}`);
  for (const file of list.toSorted((a, b) => sizes.get(b) - sizes.get(a))) {
    console.log(`  ${kb(sizes.get(file)).toFixed(1).padStart(7)} KB  ${file}`);
  }
};

print('Loaded up front (not behind dynamic import):', initial);
print('Deferred (dynamic import):', deferred);
console.log(
  `\nInitial total: ${initialTotal.toFixed(1)} KB gzip (limit ${limits.initial} KB, ${useCeilings ? 'current ceiling' : 'final budget'})`
);
console.log('Note: island chunks loaded by client:visible are counted as initial.');

if (failures.length > 0) {
  console.error(`\nBundle budget exceeded:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
}
