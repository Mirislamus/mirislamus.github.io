import { expect, test, type Page } from '@playwright/test';

const opacity = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate(element => Number(getComputedStyle(element).opacity));

test('content below the fold settles in as it scrolls into view', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  test.skip(!supported, 'scroll-driven animations are not supported in this browser');

  expect(await opacity(page, '#skills h2')).toBeLessThan(1);

  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView({ block: 'center' }));
  await expect.poll(() => opacity(page, '#skills h2')).toBe(1);
});

test('reduced motion shows everything at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await opacity(page, '#skills h2')).toBe(1);
  expect(await opacity(page, '#approach article')).toBe(1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the reveal is pure CSS and never hides content that is in view', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await opacity(page, '#projects h2')).toBe(1);
  });
});

test('the hero and the collapsed projects are not part of the reveal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about [data-reveal]')).toHaveCount(0);
  await expect(page.locator('#projects article[data-extra][data-reveal]')).toHaveCount(0);
  await expect(page.locator('#projects article[data-reveal]')).toHaveCount(4);
});
