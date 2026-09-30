import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_ROOT = fileURLToPath(new URL('../src/', import.meta.url));
const SOURCE_EXTENSIONS = new Set(['.astro', '.js', '.json', '.jsx', '.ts', '.tsx']);
const REQUEST_TIMEOUT_MS = 12_000;
const CONCURRENCY = 6;
const NON_NAVIGATIONAL_ORIGINS = new Set(['https://fonts.googleapis.com', 'https://fonts.gstatic.com']);

const collectFiles = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
    })
  );

  return files.flat();
};

const extractUrls = source => {
  const urls = source.match(/https?:\/\/[^\s"'`<>{}\\]+/g) ?? [];
  const inlineDomains = [...source.matchAll(/\|\|([^|\s]+)\|\|/g)].map(match => `https://${match[1]}`);

  return [...urls, ...inlineDomains]
    .map(url => url.replace(/[),.;]+$/, ''))
    .filter(url => {
      try {
        return !new URL(url).hostname.includes('$') && !NON_NAVIGATIONAL_ORIGINS.has(url);
      } catch {
        return false;
      }
    });
};

const request = async (url, method) =>
  fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; mirislamus-link-check/1.0)',
    },
  });

const checkUrl = async url => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      let response = await request(url, 'HEAD');

      if (response.status < 200 || response.status >= 400) {
        response = await request(url, 'GET');
      }

      return { ok: response.status >= 200 && response.status < 400, status: response.status, url };
    } catch (error) {
      if (attempt === 1) {
        return { ok: false, error: error instanceof Error ? error.message : String(error), url };
      }
    }
  }
};

const files = await collectFiles(SOURCE_ROOT);
const sources = await Promise.all(files.map(file => readFile(file, 'utf8')));
const urls = [...new Set(sources.flatMap(extractUrls))].sort();
const results = [];

for (let index = 0; index < urls.length; index += CONCURRENCY) {
  results.push(...(await Promise.all(urls.slice(index, index + CONCURRENCY).map(checkUrl))));
}

const failures = results.filter(result => !result.ok);

for (const result of results) {
  console.log(`${result.ok ? 'OK' : 'FAIL'} ${result.status ?? result.error} ${result.url}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${results.length} external links failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${results.length} external links passed.`);
}
