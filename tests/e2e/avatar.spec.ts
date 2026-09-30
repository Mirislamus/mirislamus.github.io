import { expect, test, type Page } from '@playwright/test';

const time = (page: Page) =>
  page.evaluate(() => document.querySelector<SVGSVGElement>('[data-avatar]')!.getCurrentTime());

test('the avatar morph runs when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const start = await time(page);
  await page.waitForTimeout(600);
  expect(await time(page)).toBeGreaterThan(start + 0.3);
});

test('the avatar stays still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const start = await time(page);
  await page.waitForTimeout(600);
  expect(await time(page)).toBe(start);
});

test('the avatar is paused while it is off screen and resumes when visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(300);
  const paused = await time(page);
  await page.waitForTimeout(500);
  expect(await time(page)).toBe(paused);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  expect(await time(page)).toBeGreaterThan(paused);
});

test('the avatar is decorative and the heading carries the name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-avatar]')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mirislam Usmanov');
});
