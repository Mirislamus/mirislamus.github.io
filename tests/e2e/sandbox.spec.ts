import { expect, test } from '@playwright/test';

const stand = (page: import('@playwright/test').Page) => page.locator('ui-sandbox');

test('the switch is a real switch that lights up the stand', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('switch', { name: 'Highlight' });
  await expect(toggle).not.toBeChecked();
  const before = await stand(page).evaluate(element => getComputedStyle(element).boxShadow);
  expect(before).toBe('none');

  await toggle.check();
  await expect(toggle).toBeChecked();
  await expect.poll(() => stand(page).evaluate(element => getComputedStyle(element).boxShadow)).not.toBe('none');
});

test('the slider moves the number and the bar and works with the keyboard', async ({ page }) => {
  await page.goto('/');
  const range = page.getByRole('slider', { name: 'Progress' });
  const value = page.locator('ui-sandbox output');

  await expect(value).toHaveText('65%');
  await range.focus();
  await page.keyboard.press('ArrowRight');
  await expect(value).toHaveText('66%');
  await page.keyboard.press('End');
  await expect(value).toHaveText('100%');
  expect(await stand(page).evaluate(element => element.style.getPropertyValue('--value'))).toBe('100');

  const scale = await page
    .locator('ui-sandbox [aria-hidden="true"]')
    .last()
    .evaluate(element => {
      const after = getComputedStyle(element, '::after').transform;
      return new DOMMatrix(after).a;
    });
  expect(scale).toBeGreaterThan(0.99);
});

test('the switch can be toggled with the keyboard', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('switch', { name: 'Highlight' });
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toBeChecked();
});

test('labels are translated', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.getByRole('switch', { name: 'Подсветка' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Прогресс' })).toBeVisible();
  await expect(page.getByText('Сборка · ок')).toBeVisible();
});

for (const [width, height] of [
  [1440, 900],
  [1024, 800],
  [390, 844],
] as const) {
  test(`the stand stays inside its card at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const fits = await page
      .locator('#approach article')
      .nth(2)
      .evaluate(card => {
        const cardRect = card.getBoundingClientRect();
        const standRect = card.querySelector('ui-sandbox')!.getBoundingClientRect();
        const heading = card.querySelector('h3')!.getBoundingClientRect();
        return {
          insideHorizontally: standRect.left >= cardRect.left && standRect.right <= cardRect.right,
          below: standRect.top >= heading.bottom - 2 || standRect.left >= heading.right,
        };
      });
    expect(fits.insideHorizontally).toBe(true);
    expect(fits.below).toBe(true);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the switch still works and the number stays at its default', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('switch', { name: 'Highlight' });
    await toggle.check();
    await expect(toggle).toBeChecked();
    await expect(page.locator('ui-sandbox output')).toHaveText('65%');
  });
});
