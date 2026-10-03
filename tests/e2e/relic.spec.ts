import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const chip = (page: Page) => page.locator('[data-relic]');

const showFooter = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
};

test('the chip is named on every language', async ({ page }) => {
  await showFooter(page);
  await expect(chip(page)).toHaveAccessibleName('Insert the Relic chip');
  await showFooter(page, '/ru/');
  await expect(chip(page)).toHaveAccessibleName('Вставить чип «Реликт»');
  await showFooter(page, '/uz/');
  await expect(chip(page)).toHaveAccessibleName('«Relikt» chipini kiritish');
});

test('the touch target is at least 24 px and the glitch copies stay out of the way', async ({ page }) => {
  await showFooter(page);
  const box = await chip(page).boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(24);
  expect(box!.height).toBeGreaterThanOrEqual(24);
  const ghosts = page.locator('[data-relic-ghost]');
  await expect(ghosts).toHaveCount(2);
  for (const ghost of await ghosts.all()) {
    await expect(ghost).toHaveAttribute('aria-hidden', 'true');
    await expect(ghost).toHaveCSS('pointer-events', 'none');
  }
});

test('the chunk loads only after the click', async ({ page }) => {
  const chunks: string[] = [];
  page.on('request', request => {
    if (/relic/i.test(request.url()) && request.url().endsWith('.js')) chunks.push(request.url());
  });
  await showFooter(page);
  await page.waitForLoadState('networkidle');
  expect(chunks).toHaveLength(0);
  await chip(page).click();
  await expect.poll(() => chunks.length).toBeGreaterThan(0);
});

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('hovering plays the glitch once on the red and cyan copies', async ({ page }) => {
    await showFooter(page);
    await chip(page).hover();
    await expect
      .poll(() =>
        page
          .locator('[data-relic-ghost]')
          .first()
          .evaluate(element => getComputedStyle(element).animationName)
      )
      .toContain('chip-glitch');
    const count = await page
      .locator('[data-relic-ghost]')
      .first()
      .evaluate(element => getComputedStyle(element).animationIterationCount);
    expect(count).toBe('1');
  });
});

test('with reduced motion nothing glitches', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await showFooter(page);
  await chip(page).hover();
  await expect(page.locator('[data-relic-ghost]').first()).toHaveCSS('animation-name', 'none');
});

test('axe finds no violations on the chip', async ({ page }) => {
  await showFooter(page);
  const results = await new AxeBuilder({ page }).include('[data-relic]').analyze();
  expect(results.violations).toEqual([]);
});
