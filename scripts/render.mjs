// Turns pages of a finished build into files: the CV pages into PDFs (dist/cv/mirislam-usmanov-<locale>.pdf)
// and the OG pages into share pictures (dist/og/mirislam-usmanov-<locale>.jpg). Chromium (Playwright) does the
// rendering. Used by the Astro integration in astro.config.ts, which runs it after every build and answers the same
// addresses in the dev server, and by scripts/build-media.mjs.
import { createServer } from 'node:http';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from '@playwright/test';

const MAX_PDF_BYTES = 300 * 1024;
// WhatsApp ignores share pictures over 300 KB.
const MAX_OG_BYTES = 300 * 1024;
const OG_QUALITIES = [90, 82, 74, 66];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

export const pdfName = locale => `mirislam-usmanov-${locale}.pdf`;
export const ogName = locale => `mirislam-usmanov-${locale}.jpg`;

const render = async (browser, url, options, capture) => {
  const page = await browser.newPage(options);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate('document.fonts.ready');
    return await capture(page);
  } finally {
    await page.close();
  }
};

// One page of the running site -> PDF bytes.
export const printPdf = (browser, url) =>
  render(browser, url, undefined, page => page.pdf({ preferCSSPageSize: true, printBackground: true }));

// One page of the running site -> JPEG bytes (1200×630), as good as it gets under the size limit.
export const screenshotOg = (browser, url) =>
  render(browser, url, { viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 }, async page => {
    for (const quality of OG_QUALITIES) {
      const image = await page.screenshot({ type: 'jpeg', quality });
      if (image.length <= MAX_OG_BYTES) return image;
    }
    throw new Error(`${url} does not fit ${MAX_OG_BYTES} bytes even at quality ${OG_QUALITIES.at(-1)}`);
  });

// `site`: the public address of the site. When given, it is replaced with the address of this server in text
// files, so that canonical, hreflang and the sitemap point at the page that is being tested.
const serve = (dist, site) =>
  createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const file = normalize(join(dist, path.endsWith('/') ? `${path}index.html` : path));
      if (!file.startsWith(dist)) throw new Error('outside of dist');

      const type = TYPES[extname(file)] ?? 'application/octet-stream';
      let body = await readFile(file);
      if (site && /^text\/|xml/.test(type))
        body = Buffer.from(body.toString().replaceAll(site, `http://${request.headers.host}`));

      response.writeHead(200, { 'content-type': type });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });

const localesOf = async (dist, folder) => {
  const locales = (await readdir(join(dist, folder), { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (locales.length === 0) throw new Error(`dist/${folder} has no pages: run "astro build" first`);
  return locales;
};

// A static server over `dist` and a browser for the time of `task`. `launch` are the browser options, `site` see `serve`.
export const withSite = async (dist, task, { launch, site } = {}) => {
  const server = serve(dist, site);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch(launch);

  try {
    return await task(browser, `http://127.0.0.1:${port}`);
  } finally {
    await browser.close();
    server.close();
  }
};

const write = async (output, bytes, limit, log, label) => {
  await writeFile(output, bytes);
  const { size } = await stat(output);
  if (size > limit) throw new Error(`${output} is ${size} bytes, the limit is ${limit}`);
  log(`${label}: ${(size / 1024).toFixed(0)} KB`);
};

// dist/cv/<locale>/ -> dist/cv/mirislam-usmanov-<locale>.pdf, dist/og/<locale>/ -> dist/og/mirislam-usmanov-<locale>.jpg.
export const buildMedia = async (dist, log = console.log) => {
  const cv = await localesOf(dist, 'cv');
  const og = await localesOf(dist, 'og');

  await withSite(dist, async (browser, origin) => {
    for (const locale of cv) {
      const bytes = await printPdf(browser, `${origin}/cv/${locale}/`);
      await write(join(dist, 'cv', pdfName(locale)), bytes, MAX_PDF_BYTES, log, `cv/${locale}`);
    }
    for (const locale of og) {
      const bytes = await screenshotOg(browser, `${origin}/og/${locale}/`);
      await write(join(dist, 'og', ogName(locale)), bytes, MAX_OG_BYTES, log, `og/${locale}`);
    }
  });
};
