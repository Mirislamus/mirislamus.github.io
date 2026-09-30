import { expect, test, type Page } from '@playwright/test';

const background = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

// The header is a React island: clicks before it hydrates would do nothing.
const headerReady = (page: Page) =>
  expect(page.locator('astro-island[component-export="Header"]:not([ssr])')).toHaveCount(1);

const LIGHT = 'rgb(255, 255, 255)';
const DARK = 'rgb(18, 18, 18)';

test('sets the theme before the first paint', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { themeAtDomReady: string | null }).themeAtDomReady =
        document.documentElement.getAttribute('data-theme');
    });
  });
  await page.goto('/');

  expect(await page.evaluate(() => (window as unknown as { themeAtDomReady: string }).themeAtDomReady)).toBe('dark');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('follows a dark system theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
    expect(await background(page)).toBe(DARK);
  });

  test('follows a light system theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    expect(await background(page)).toBe(LIGHT);
  });

  test('shows only the icons of the active theme in Skills', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const visible = await page
      .locator('#skills img[src*="next-"]')
      .evaluateAll(images =>
        images.filter(image => image.getClientRects().length > 0).map(image => image.getAttribute('src'))
      );
    expect(visible).toHaveLength(1);
    expect(visible[0]).toContain('next-dark');
  });
});

test('works when localStorage is blocked', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
  });

  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await headerReady(page);
  await page.getByRole('button', { name: 'Light theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(errors).toEqual([]);
});

test('follows the system theme without reloading in system mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', '#121212');
});

test('keeps an explicit choice across reloads and ignores the system theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await headerReady(page);
  await page.getByRole('button', { name: 'Dark theme' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('updates every theme-color meta tag and the pressed state of the buttons', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await headerReady(page);
  await page.getByRole('button', { name: 'Dark theme' }).first().click();

  const colors = await page
    .locator('meta[name="theme-color"]')
    .evaluateAll(metas => metas.map(meta => meta.getAttribute('content')));
  expect(colors.length).toBeGreaterThan(0);
  expect(new Set(colors)).toEqual(new Set(['#121212']));
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
});
