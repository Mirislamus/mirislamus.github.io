// Turns the printable CV pages of a finished build (dist/cv/<locale>/) into PDF files next to them:
// dist/cv/mirislam-usmanov-<locale>.pdf. Run it after `astro build`; it needs Chromium from Playwright.
import { createServer } from 'node:http';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MAX_SIZE_BYTES = 300 * 1024;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

const serve = () =>
  createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const file = normalize(join(DIST, path.endsWith('/') ? `${path}index.html` : path));
      if (!file.startsWith(DIST)) throw new Error('outside of dist');

      response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });

const locales = (await readdir(join(DIST, 'cv'), { withFileTypes: true }))
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

if (locales.length === 0) throw new Error('dist/cv has no pages: run `astro build` first');

const server = serve();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch();

try {
  for (const locale of locales) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/cv/${locale}/`);
    await page.evaluate('document.fonts.ready');

    const output = join(DIST, 'cv', `mirislam-usmanov-${locale}.pdf`);
    await writeFile(output, await page.pdf({ preferCSSPageSize: true, printBackground: true }));
    await page.close();

    const { size } = await stat(output);
    if (size > MAX_SIZE_BYTES) throw new Error(`${output} is ${size} bytes, the limit is ${MAX_SIZE_BYTES}`);
    console.log(`cv/${locale}: ${(size / 1024).toFixed(0)} KB`);
  }
} finally {
  await browser.close();
  server.close();
}
