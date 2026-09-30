// Prints the CV pages to PDF with Chromium (Playwright). Used by the Astro integration (astro.config.ts),
// which runs it after every build and answers /cv/*.pdf in the dev server, and by scripts/build-cv.mjs.
import { createServer } from 'node:http';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from '@playwright/test';

const MAX_SIZE_BYTES = 300 * 1024;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

export const pdfName = locale => `mirislam-usmanov-${locale}.pdf`;

// One page of the running site -> PDF bytes.
export const printPdf = async (browser, url) => {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate('document.fonts.ready');
    return await page.pdf({ preferCSSPageSize: true, printBackground: true });
  } finally {
    await page.close();
  }
};

const serve = dist =>
  createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const file = normalize(join(dist, path.endsWith('/') ? `${path}index.html` : path));
      if (!file.startsWith(dist)) throw new Error('outside of dist');

      response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  });

// Turns dist/cv/<locale>/ of a finished build into dist/cv/mirislam-usmanov-<locale>.pdf.
export const buildCvPdfs = async (dist, log = console.log) => {
  const locales = (await readdir(join(dist, 'cv'), { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (locales.length === 0) throw new Error('dist/cv has no pages: run `astro build` first');

  const server = serve(dist);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch();

  try {
    for (const locale of locales) {
      const output = join(dist, 'cv', pdfName(locale));
      await writeFile(output, await printPdf(browser, `http://127.0.0.1:${port}/cv/${locale}/`));

      const { size } = await stat(output);
      if (size > MAX_SIZE_BYTES) throw new Error(`${output} is ${size} bytes, the limit is ${MAX_SIZE_BYTES}`);
      log(`cv/${locale}: ${(size / 1024).toFixed(0)} KB`);
    }
  } finally {
    await browser.close();
    server.close();
  }
};
