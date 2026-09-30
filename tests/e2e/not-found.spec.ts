import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('an unknown URL shows the site 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');

  // Exactly one language is visible: English for a browser in English.
  await expect(page.locator('main section:not([hidden])')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
});

test('the 404 page follows the theme and has no accessibility violations', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/nope/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map(violation => violation.id)).toEqual([]);
});

test('the 404 page is not in the sitemap', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).not.toContain('404');
});

test.describe('the language of the 404 page', () => {
  test('follows the language in the URL', async ({ page }) => {
    await page.goto('/ru/nope/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Страница не найдена');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/ru/');

    await page.goto('/uz/nope/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sahifa topilmadi');
    await expect(page.getByRole('link', { name: 'Bosh sahifaga' })).toHaveAttribute('href', '/uz/');
  });

  test('falls back to the browser language', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'ru-RU' });
    const page = await context.newPage();
    await page.goto('/nope/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Страница не найдена');
    await context.close();
  });
});
