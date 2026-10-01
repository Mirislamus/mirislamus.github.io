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

// A chunk is "deferred" when it is loaded by import() or when everything that imports it is deferred itself
// (a module shared by two lazy chunks gets a chunk of its own, but it is still not part of the first load).
const importsOf = (source, pattern) => [...source.matchAll(pattern)].map(m => m[1]);
const dynamicImports = source => importsOf(source, /import\(\s*["']\.\/([^"']+\.js)["']\s*\)/g);
const staticImports = source => importsOf(source, /(?:from|import)\s*["']\.\/([^"']+\.js)["']/g);

const files = (await readdir(ASTRO_DIR)).filter(file => file.endsWith('.js'));
const sources = new Map(
  await Promise.all(files.map(async file => [file, await readFile(join(ASTRO_DIR, file), 'utf8')]))
);

const deferredSet = new Set([...sources.values()].flatMap(dynamicImports));
const importers = new Map(files.map(file => [file, []]));
for (const [file, source] of sources) {
  for (const target of staticImports(source)) importers.get(target)?.push(file);
}
for (let changed = true; changed;) {
  changed = false;
  for (const file of files) {
    const from = importers.get(file);
    if (!deferredSet.has(file) && from.length > 0 && from.every(importer => deferredSet.has(importer))) {
      deferredSet.add(file);
      changed = true;
    }
  }
}

const sizes = new Map(await Promise.all(files.map(async file => [file, await chunkSize(file)])));
const initial = files.filter(file => !deferredSet.has(file));
const deferred = files.filter(file => deferredSet.has(file));

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
