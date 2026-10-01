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

test.describe('the Matrix 404', () => {
  const rain = (page: import('@playwright/test').Page) => page.locator('canvas[data-backdrop]');

  test.describe('when motion is allowed', () => {
    test.use({ reducedMotion: 'no-preference', locale: 'en-US' });

    test('rain behind the page, 404 made of glyphs, the quote, and the page stays usable', async ({ page }) => {
      await page.goto('/nope/');
      await expect(rain(page)).toHaveAttribute('data-state', 'running');
      await expect(rain(page)).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('glyph-wordmark')).toHaveAttribute('data-ready', '');
      await expect(page.getByText('There is no spoon.')).toBeVisible();

      // The rain covers the screen and never takes a click.
      const box = (await rain(page).boundingBox())!;
      const view = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }));
      expect(box.width).toBeCloseTo(view.width, 0);
      expect(box.height).toBeCloseTo(view.height, 0);
      await page.getByRole('link', { name: 'Go to the home page' }).click();
      await expect(page).toHaveURL(/\/$/);
    });

    test('the pause button stops the rain and is named in the page language', async ({ page }) => {
      await page.goto('/nope/');
      const toggle = page.locator('section:not([hidden]) motion-toggle button');
      await expect(toggle).toHaveAccessibleName('Pause animation');
      await toggle.click();
      await expect(rain(page)).toHaveAttribute('data-state', 'static');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');

      await page.goto('/ru/nope/');
      await expect(page.locator('section:not([hidden]) motion-toggle button')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('section:not([hidden]) motion-toggle button')).toHaveAccessibleName(
        'Запустить анимацию'
      );
    });
  });

  test.describe('when motion is reduced', () => {
    test.use({ reducedMotion: 'reduce' });

    test('one still frame of rain and no pause button', async ({ page }) => {
      await page.goto('/nope/');
      await expect(rain(page)).toHaveAttribute('data-state', 'static');
      await expect(page.locator('motion-toggle:visible')).toHaveCount(0);
    });
  });
});
