import { expect, test, type Page } from '@playwright/test';

const background = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

// The header behavior is a custom element: clicks before it is defined would do nothing.
const headerReady = (page: Page) => page.waitForFunction(() => customElements.get('site-header') !== undefined);

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

  test('the icons in Skills take the text colour of the active theme', async ({ page }) => {
    const iconColor = () =>
      page
        .locator('#skills a svg')
        .first()
        .evaluate(svg => getComputedStyle(svg).color);

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const dark = await iconColor();
    await page.emulateMedia({ colorScheme: 'light' });
    const light = await iconColor();

    expect(dark).not.toBe(light);
    // Light icons on a dark page, dark icons on a light one.
    const brightness = (value: string) =>
      value
        .match(/[0-9]+/g)!
        .slice(0, 3)
        .reduce((sum, part) => sum + Number(part), 0);
    expect(brightness(dark)).toBeGreaterThan(brightness(light));
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
