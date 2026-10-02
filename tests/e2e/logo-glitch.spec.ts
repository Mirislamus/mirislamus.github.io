import { expect, test } from '@playwright/test';

const logo = (page: import('@playwright/test').Page) => page.locator('[data-logo]');
const ghosts = (page: import('@playwright/test').Page) => page.locator('[data-logo-ghost]');

test('the link keeps its name and the copies are hidden from assistive technology', async ({ page }) => {
  await page.goto('/');
  await expect(logo(page)).toHaveAttribute('aria-label', 'Home');
  await expect(logo(page)).toHaveAccessibleName('Home');
  await expect(ghosts(page)).toHaveCount(2);
  for (const ghost of await ghosts(page).all()) await expect(ghost).toHaveAttribute('aria-hidden', 'true');
});

test('the copies do not change the layout and cannot be clicked', async ({ page }) => {
  await page.goto('/');
  const box = await logo(page).boundingBox();
  expect(box!.width).toBeLessThanOrEqual(42);
  expect(box!.height).toBeLessThanOrEqual(42);
  await expect(ghosts(page).first()).toHaveCSS('pointer-events', 'none');
  await expect(ghosts(page).first()).toHaveCSS('opacity', '0');
});

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('hovering plays the glitch once: about 300 ms, one iteration, red and cyan', async ({ page }) => {
    await page.goto('/');
    await logo(page).hover();
    await expect
      .poll(() =>
        ghosts(page)
          .first()
          .evaluate(element => getComputedStyle(element).animationName)
      )
      .toContain('logo-glitch');
    const timing = await ghosts(page)
      .first()
      .evaluate(element => {
        const style = getComputedStyle(element);
        return [style.animationDuration, style.animationIterationCount];
      });
    expect(timing).toEqual(['0.3s', '1']);

    const colors = await ghosts(page).evaluateAll(all => all.map(element => getComputedStyle(element).color));
    expect(colors).toEqual(['rgb(255, 46, 99)', 'rgb(0, 229, 209)']);
  });

  test('the keyboard focus plays it too, and it ends', async ({ page }) => {
    await page.goto('/');
    await logo(page).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(logo(page)).toBeFocused();
    await expect
      .poll(() =>
        ghosts(page)
          .first()
          .evaluate(element => getComputedStyle(element).animationName)
      )
      .toContain('logo-glitch');
    // It is over after a moment: the copies are invisible again.
    await expect(ghosts(page).first()).toHaveCSS('opacity', '0', { timeout: 2000 });
  });
});

test('with reduced motion there is no animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await logo(page).hover();
  await page.waitForTimeout(200);
  expect(
    await ghosts(page)
      .first()
      .evaluate(element => getComputedStyle(element).animationName)
  ).toBe('none');
  await expect(ghosts(page).first()).toHaveCSS('opacity', '0');
  await context.close();
});
