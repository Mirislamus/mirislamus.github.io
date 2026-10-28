import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const PAGES = ['/', '/ru/', '/uz/'];

const collectErrors = (page: Page, missingPath?: string) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() !== 'error') return;
    if (missingPath && new URL(message.location().url).pathname === missingPath) return;
    errors.push(message.text());
  });
  return errors;
};

const scrollThrough = (page: Page) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });

for (const path of PAGES) {
  test(`${path} opens with 200 and no errors in the console`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });
}

test('an unknown address shows the 404 page without errors', async ({ page }) => {
  const errors = collectErrors(page, '/no-such-page/');
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1:visible')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('there is no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  await scrollThrough(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('the menu opens and a link takes the visitor to the section', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the menu button exists only on small screens');
  const errors = collectErrors(page);
  await page.goto('/');
  const button = page.locator('[data-menu-button]');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#main-navigation a[href$="#projects"]').click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
  expect(errors).toEqual([]);
});
