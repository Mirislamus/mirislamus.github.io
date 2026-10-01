import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const dialog = (page: Page) => page.locator('dialog[data-pills]');

const openScene = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.locator('[data-rabbit]').click();
  await expect(dialog(page)).toHaveAttribute('open', '');
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the rabbit opens the scene: a modal dialog with two named pills', async ({ page }) => {
    await openScene(page);
    await expect(page.getByRole('dialog', { name: 'Last chance' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Blue pill' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Red pill' })).toBeVisible();
    // Modal: the focus is inside, the page behind is not reachable.
    expect(await page.evaluate(() => document.querySelector('dialog')!.contains(document.activeElement))).toBe(true);
  });

  test('Escape closes it and the focus goes back to the rabbit', async ({ page }) => {
    await openScene(page);
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
    await expect(page.locator('[data-rabbit]')).toBeFocused();
  });

  test('the close button and a click on the dark area close it too', async ({ page }) => {
    await openScene(page);
    await page.locator('[data-pills-close]').click();
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 2000 });

    await page.locator('[data-rabbit]').click();
    await expect(dialog(page)).toHaveAttribute('open', '');
    await dialog(page).click({ position: { x: 10, y: 400 } });
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
  });

  test('the blue pill ends the story and takes the page back to the top', async ({ page }) => {
    await openScene(page);
    await page.getByRole('button', { name: 'Blue pill' }).click();
    await expect(dialog(page).locator('[data-pills-result]')).toHaveText('The story ends. You wake up in your bed.');
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 6000 });
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 6000 }).toBeLessThan(5);
  });

  test('the red pill floods the screen with glyphs and the page glitches', async ({ page }) => {
    await openScene(page);
    await page.getByRole('button', { name: 'Red pill' }).click();
    await expect(dialog(page).locator('[data-pills-result]')).toHaveText('Welcome to the real world.');
    await expect(page.locator('html')).toHaveAttribute('data-glitch', '', { timeout: 5000 });
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 6000 });
    await expect(page.locator('html')).not.toHaveAttribute('data-glitch', /.*/, { timeout: 3000 });
    // It can be opened again and starts from the beginning.
    await page.locator('[data-rabbit]').click();
    await expect(dialog(page).locator('[data-pills-result]')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Red pill' })).toBeVisible();
  });

  test('the texts follow the page language', async ({ page }) => {
    await openScene(page, '/ru/');
    await expect(page.getByRole('dialog', { name: 'Последний шанс' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Красная таблетка' })).toBeVisible();
  });

  test('has no accessibility violations while open', async ({ page }) => {
    await openScene(page);
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page })
      .include('dialog[data-pills]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations.map(violation => violation.id)).toEqual([]);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the scene works without any effect: no glitch, text only', async ({ page }) => {
    await openScene(page);
    await page.getByRole('button', { name: 'Red pill' }).click();
    await expect(dialog(page).locator('[data-pills-result]')).toHaveText('Welcome to the real world.');
    await page.waitForTimeout(1500);
    await expect(page.locator('html')).not.toHaveAttribute('data-glitch', /.*/);
  });
});

test('the rabbit is a quiet button with a name, and without JavaScript it simply does nothing', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-rabbit]')).toHaveAttribute('aria-label', 'Follow the white rabbit');
  await expect(dialog(page)).not.toHaveAttribute('open', /.*/);
  await context.close();
});
