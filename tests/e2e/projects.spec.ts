import { expect, test } from '@playwright/test';

test('all eight projects are in the HTML, four of them collapsed', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#projects article');
  await expect(cards).toHaveCount(8);
  await expect(page.locator('#projects article:visible')).toHaveCount(4);
});

test('Show more reveals the rest at once, hides the button and moves focus to the fifth project', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Show more' });
  await button.click();

  await expect(page.locator('#projects article:visible')).toHaveCount(8);
  await expect(button).toBeHidden();
  await expect(page.locator('#projects article').nth(4).getByRole('link')).toBeFocused();
});

test('each card has one link named after the project and a decorative image', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show more' }).click();

  const links = page.locator('#projects article').getByRole('link');
  await expect(links).toHaveCount(8);
  await expect(links.first()).toHaveAccessibleName('Dafna');
  await expect(links.first()).toHaveAttribute('target', '_blank');
  await expect(links.first()).toHaveAttribute('rel', 'noopener noreferrer');

  const alts = await page
    .locator('#projects img')
    .evaluateAll(images => images.map(image => image.getAttribute('alt')));
  expect(alts).toEqual(Array(8).fill(''));
});

test('the whole card is clickable through the title link', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#projects article').first();
  await card.scrollIntoViewIfNeeded();

  const target = await card.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + 12, rect.bottom - 12);
    return hit?.closest('a')?.getAttribute('href') ?? null;
  });
  expect(target).toBe('https://dafna.uz');
});

test('the card shows a focus ring for keyboard users', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects article').first().getByRole('link').focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('#projects article').first()).toHaveCSS('box-shadow', /rgb/);
});

test('the highlight follows the mouse', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.locator('#projects article').first();
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;

  await page.mouse.move(box.x + 100, box.y + 80);
  await page.mouse.move(box.x + 120, box.y + 90);
  // The card leans a little, which shifts its bounding box by a fraction of a pixel.
  await expect
    .poll(() => card.evaluate(element => parseFloat(element.style.getPropertyValue('--mouse-x'))))
    .toBeCloseTo(120, 0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows every project and no button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#projects article:visible')).toHaveCount(8);
    await expect(page.locator('#projects [data-more-wrap]')).toBeHidden();
  });
});
