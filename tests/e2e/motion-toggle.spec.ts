import { expect, test } from '@playwright/test';

const toggle = (page: import('@playwright/test').Page) => page.locator('motion-toggle button');
const rain = (page: import('@playwright/test').Page) => page.locator('canvas[data-rain]');

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the button stops and restarts the Hero effects and remembers the choice', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle(page)).toHaveAccessibleName('Pause animation');

    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle(page)).toHaveAccessibleName('Play animation');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');
    await expect(page.locator('[data-avatar-shape]')).toHaveAttribute('d', /^M130 10C190/);

    await page.reload();
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');

    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
  });

  test('works from the keyboard', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    await toggle(page).focus();
    await page.keyboard.press('Enter');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');
    await page.keyboard.press('Space');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
  });

  test('its name follows the language', async ({ page }) => {
    await page.goto('/ru/#about');
    await expect(toggle(page)).toHaveAccessibleName('Остановить анимацию');
  });

  test('sits in the bottom right corner of the Hero', async ({ page }) => {
    await page.goto('/#about');
    const hero = (await page.locator('#about').boundingBox())!;
    const box = (await toggle(page).boundingBox())!;
    expect(box.x + box.width).toBeGreaterThan(hero.x + hero.width - 40);
    expect(box.y + box.height).toBeGreaterThan(hero.y + hero.height - 40);
    expect(box.width).toBeCloseTo(36, 0);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is nothing to pause, so there is no button', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');
    await expect(page.locator('motion-toggle')).toBeHidden();
  });
});

test('without JavaScript the button is not there', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('motion-toggle')).toBeHidden();
  await context.close();
});
