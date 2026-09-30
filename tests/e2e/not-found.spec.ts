import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('an unknown URL shows the site 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');

  const links = await page.locator('main a').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
  expect(links).toEqual(['/', '/ru/', '/uz/']);
  await expect(page.locator('section[lang="ru"] h2')).toHaveText('Страница не найдена');
  await expect(page.locator('section[lang="uz"] h2')).toHaveText('Sahifa topilmadi');
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
