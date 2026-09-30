import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const ORIGIN = 'https://mirislamus.github.io';
const PAGES = [
  { locale: 'en', path: '/', canonical: `${ORIGIN}/`, ogLocale: 'en_US', alternates: ['ru_RU', 'uz_UZ'] },
  { locale: 'ru', path: '/ru/', canonical: `${ORIGIN}/ru/`, ogLocale: 'ru_RU', alternates: ['en_US', 'uz_UZ'] },
  { locale: 'uz', path: '/uz/', canonical: `${ORIGIN}/uz/`, ogLocale: 'uz_UZ', alternates: ['en_US', 'ru_RU'] },
];

// The address of a public page on the site under test (the tests run against the local preview).
const local = (url: string) => url.replace(ORIGIN, '');

const meta = (page: Page, selector: string) => page.locator(`head > ${selector}`).getAttribute('content');
const graph = async (page: Page): Promise<Record<string, unknown>[]> => {
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  return JSON.parse(json ?? '{}')['@graph'];
};
const ok = async (request: APIRequestContext, url: string) => {
  const response = await request.get(local(url));
  expect(response.status(), url).toBe(200);
  return response;
};

for (const { locale, path, canonical, ogLocale, alternates } of PAGES) {
  test.describe(`SEO of /${locale === 'en' ? '' : `${locale}/`}`, () => {
    test('title, description and the heading', async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      const description = await meta(page, 'meta[name="description"]');

      expect(title.length).toBeLessThanOrEqual(70);
      expect(description?.length).toBeLessThanOrEqual(160);
      for (const text of [title, description ?? '']) expect(text).not.toMatch(/\{\{|\|\|/);
      expect(title).toContain('React');
      expect(description).toMatch(/\d/);

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toHaveCount(1);
      await expect(heading).toContainText('Frontend Engineer');
      expect(title).toContain((await heading.locator('span').first().innerText()).trim());
    });

    test('canonical and language alternates answer without a redirect', async ({ page, request }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);

      const alternate = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll(links => links.map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]));
      expect(alternate).toEqual([
        ['en', `${ORIGIN}/`],
        ['ru', `${ORIGIN}/ru/`],
        ['uz', `${ORIGIN}/uz/`],
        ['x-default', `${ORIGIN}/`],
      ]);
      for (const [, href] of alternate) await ok(request, href as string);
    });

    test('Open Graph and Twitter tags', async ({ page, request }) => {
      await page.goto(path);
      const image = `${ORIGIN}/og/mirislam-usmanov-${locale}.jpg`;

      expect(await meta(page, 'meta[property="og:url"]')).toBe(canonical);
      expect(await meta(page, 'meta[property="og:image"]')).toBe(image);
      expect(await meta(page, 'meta[name="twitter:image"]')).toBe(image);
      expect(await meta(page, 'meta[property="og:locale"]')).toBe(ogLocale);
      expect(await meta(page, 'meta[property="og:type"]')).toBe('profile');
      expect(await meta(page, 'meta[property="og:title"]')).toBe(await page.title());

      const others = await page
        .locator('meta[property="og:locale:alternate"]')
        .evaluateAll(tags => tags.map(tag => tag.getAttribute('content')));
      expect(others).toEqual(alternates);

      const response = await ok(request, image);
      expect(response.headers()['content-type']).toBe('image/jpeg');
      const bytes = await response.body();
      expect(bytes.length).toBeLessThanOrEqual(300 * 1024);
      // The size of a JPEG is in its SOF0/SOF2 marker: height, then width.
      const marker = bytes.findIndex((byte, index) => byte === 0xff && [0xc0, 0xc2].includes(bytes[index + 1]));
      expect([bytes.readUInt16BE(marker + 7), bytes.readUInt16BE(marker + 5)]).toEqual([1200, 630]);
    });

    test('the structured data describes the page', async ({ page }) => {
      await page.goto(path);
      const nodes = await graph(page);
      const type = (name: string) => nodes.filter(node => node['@type'] === name);

      expect(type('WebSite')).toHaveLength(1);
      expect(type('Person')).toHaveLength(1);
      expect(type('ProfilePage')).toMatchObject([{ url: canonical, inLanguage: locale }]);
      expect(type('Person')[0]['@id']).toBe(`${ORIGIN}/#person`);

      const projects = await page.locator('#projects article').count();
      const [list] = type('ItemList') as { itemListElement: unknown[] }[];
      expect(list.itemListElement.length).toBeGreaterThan(0);
      expect(list.itemListElement).toHaveLength(projects);

      const reviews = type('Review');
      expect(reviews.length).toBeGreaterThan(0);
      // Every review text of the graph is on the page, in the language of the page.
      const text = (await page.locator('#reviews').textContent()) ?? '';
      const flat = (value: string) => value.replace(/\s+/g, ' ').trim();
      for (const review of reviews) expect(flat(text)).toContain(flat(review.reviewBody as string));
    });
  });
}

test('the same person in every language', async ({ page }) => {
  const ids = new Set<string>();
  for (const { path } of PAGES) {
    await page.goto(path);
    const person = (await graph(page)).find(node => node['@type'] === 'Person');
    ids.add(person?.['@id'] as string);
  }
  expect([...ids]).toEqual([`${ORIGIN}/#person`]);
});

test.describe('files for crawlers', () => {
  test('robots.txt points at the sitemap', async ({ request }) => {
    const body = await (await ok(request, `${ORIGIN}/robots.txt`)).text();
    expect(body).toContain(`Sitemap: ${ORIGIN}/sitemap-index.xml`);
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
  });

  test('the sitemap lists exactly the canonical addresses, each with its alternates', async ({ request }) => {
    const index = await (await ok(request, `${ORIGIN}/sitemap-index.xml`)).text();
    const sitemap = await (await ok(request, index.match(/<loc>([^<]+)<\/loc>/)![1])).text();

    expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])).toEqual(
      PAGES.map(page => page.canonical)
    );
    expect(sitemap.match(/<lastmod>/g)).toHaveLength(PAGES.length);
    expect(sitemap.match(/hreflang="x-default"/g)).toHaveLength(PAGES.length);
    expect(sitemap.match(/<xhtml:link/g)).toHaveLength(PAGES.length * 4);
    expect(sitemap).not.toMatch(/\/(cv|og)\//);
  });

  test('icons and the manifest exist', async ({ request, page }) => {
    for (const file of [
      'favicon.ico',
      'apple-touch-icon.png',
      'icon-192.png',
      'icon-512.png',
      'icon-maskable-512.png',
    ]) {
      await ok(request, `${ORIGIN}/${file}`);
    }

    const manifest = await (await ok(request, `${ORIGIN}/manifest.webmanifest`)).json();
    expect(manifest.icons.map((icon: { purpose?: string }) => icon.purpose ?? 'any')).toEqual([
      'any',
      'any',
      'maskable',
    ]);
    for (const icon of manifest.icons) await ok(request, ORIGIN + icon.src);

    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute('href', '/favicon.ico');
  });

  test('pages that exist only to be printed or photographed stay out of the search', async ({ page }) => {
    for (const url of ['/cv/en/', '/og/en/', '/does-not-exist/']) {
      await page.goto(url);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
    await page.goto('/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'max-image-preview:large');
  });
});
