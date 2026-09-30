import { expect, test, type Page } from '@playwright/test';

const LOCALES = [
  { code: 'en', path: '/' },
  { code: 'ru', path: '/ru/' },
  { code: 'uz', path: '/uz/' },
] as const;

const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

// Hidden images (the other theme variant of a skill icon) are lazy and are never fetched.
const visibleImagesLoaded = () =>
  Array.from(document.images)
    .filter(image => image.getClientRects().length > 0)
    .every(image => image.complete);

const openPage = async (page: Page, path: string, theme: Theme) => {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.addInitScript(value => window.localStorage.setItem('theme', value), theme);
  await page.goto(path);
  await settle(page);
};

// Scrolls through the whole page so that `client:visible` islands hydrate and lazy images load,
// then returns to the top. Screenshots must not depend on what happened to be in the viewport.
const settle = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });

  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  await page.waitForFunction(visibleImagesLoaded);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
};

test.describe.configure({ timeout: 90_000 });

for (const locale of LOCALES) {
  for (const theme of THEMES) {
    test(`full page ${locale.code} ${theme}`, async ({ page }) => {
      await openPage(page, locale.path, theme);
      await expect(page).toHaveScreenshot(`page-${locale.code}-${theme}.png`, { fullPage: true });
    });
  }
}

for (const theme of THEMES) {
  test.describe(`states en ${theme}`, () => {
    test('mobile menu open', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile-390', 'mobile menu exists only on narrow viewports');

      await openPage(page, '/', theme);
      await page.locator('button[aria-controls="main-navigation"]').click();
      await expect(page.locator('#main-navigation')).toBeVisible();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`state-menu-${theme}.png`);
    });

    test('language list open', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop-1440', 'checked once on desktop');

      await openPage(page, '/', theme);
      await page.locator('button[aria-controls="language-options"]').click();
      await expect(page.locator('#language-options')).toBeVisible();
      await expect(page).toHaveScreenshot(`state-languages-${theme}.png`);
    });

    test('projects expanded', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop-1440', 'checked once on desktop');

      await openPage(page, '/', theme);
      const projects = page.locator('#projects');
      await projects.locator('[data-more]').click();
      await expect(projects.getByRole('link')).toHaveCount(8);
      await page.waitForFunction(visibleImagesLoaded);
      await expect(projects).toHaveScreenshot(`state-projects-expanded-${theme}.png`);
    });

    test('project card hover', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop-1440', 'hover exists only with a fine pointer');

      await openPage(page, '/', theme);
      const card = page.locator('#projects').getByRole('link').first();
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await page.waitForTimeout(300);
      await expect(card).toHaveScreenshot(`state-project-hover-${theme}.png`);
    });
  });
}
