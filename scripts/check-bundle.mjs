import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// Budgets are in gzip KB of JS in dist/_astro (docs/tz.md, section 7).
const BUDGETS = {
  // everything that is not behind a dynamic import()
  initial: 15,
  // any single chunk, including the ones loaded on demand
  perChunk: 10,
};

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const ASTRO_DIR = join(DIST, '_astro');
const limits = BUDGETS;

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
console.log(`\nInitial total: ${initialTotal.toFixed(1)} KB gzip (limit ${limits.initial} KB)`);

if (failures.length > 0) {
  console.error(`\nBundle budget exceeded:\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
}
