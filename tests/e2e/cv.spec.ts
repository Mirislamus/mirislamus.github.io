import { readFile, stat } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const LOCALES = ['en', 'ru', 'uz'] as const;
const pdfPath = (locale: string) => new URL(`../../dist/cv/mirislam-usmanov-${locale}.pdf`, import.meta.url);

test.describe('CV pages and PDF files', () => {
  for (const locale of LOCALES) {
    test(`${locale}: page is private, complete and free of personal data`, async ({ page, request }) => {
      await page.goto(`/cv/${locale}/`);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('h2')).toHaveCount(6);
      await expect(page.locator('article a[href^="mailto:"]')).toHaveCount(1);

      const text = await page.locator('article').innerText();
      expect(text).not.toMatch(/\+\d[\d\s()-]{8,}/);
      expect(text).not.toMatch(/\b(19|20)\d\d-\d\d-\d\d\b/);

      const sitemap = await (await request.get('/sitemap-0.xml')).text();
      expect(sitemap).not.toContain('/cv/');
    });

    test(`${locale}: PDF is small, has embedded Inter and real text`, async () => {
      const file = pdfPath(locale);
      const { size } = await stat(file);
      const bytes = (await readFile(file)).toString('latin1');

      expect(size).toBeLessThanOrEqual(300 * 1024);
      expect(bytes.startsWith('%PDF-')).toBe(true);
      expect(bytes).toMatch(/\/FontName\s*\/[A-Z]{6}\+Inter/);
      // A text mapping means the words can be selected and searched, not just drawn.
      expect(bytes).toContain('/ToUnicode');
    });
  }

  test('the hero link downloads the PDF of the current language', async ({ page, request }) => {
    for (const [path, locale] of [
      ['/', 'en'],
      ['/ru/', 'ru'],
      ['/uz/', 'uz'],
    ] as const) {
      await page.goto(path);
      const link = page.locator('#about a[download]');

      await expect(link).toHaveAttribute('href', `/cv/mirislam-usmanov-${locale}.pdf`);
      const response = await request.get(`/cv/mirislam-usmanov-${locale}.pdf`);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('pdf');
    }
  });
});
