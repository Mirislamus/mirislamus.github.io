import { expect, test, type Page } from '@playwright/test';

const button = (page: Page, index = 0) => page.locator('#contacts [data-magnet]').nth(index);

// Moves of the mouse count only once the chunk has loaded: bring the footer into view first.
const open = async (page: Page) => {
  await page.goto('/');
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    performance.getEntriesByType('resource').some(entry => entry.name.includes('magnetic'))
  );
  await page.waitForTimeout(200);
};

const shift = (page: Page, index = 0) =>
  button(page, index).evaluate(element => {
    const [x = 0, y = 0] = getComputedStyle(element)
      .translate.split(' ')
      .map(part => parseFloat(part) || 0);
    return { x, y };
  });

test.describe('with a mouse', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('a button leans towards the cursor, by at most 6 px, and the text leans a little more', async ({ page }) => {
    await open(page);
    const box = (await button(page).boundingBox())!;

    // 20 px to the right of the button, in the middle of its height.
    await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2);
    await expect.poll(async () => (await shift(page)).x, { timeout: 2000 }).toBeGreaterThan(1);
    const { x, y } = await shift(page);
    expect(x).toBeLessThanOrEqual(6.01);
    expect(Math.abs(y)).toBeLessThan(1);

    const text = await button(page)
      .locator('[data-magnet-text]')
      .evaluate(element => parseFloat(getComputedStyle(element).translate.split(' ')[0]) || 0);
    expect(text).toBeGreaterThan(0);
    expect(text).toBeLessThanOrEqual(2.01);
  });

  test('nothing happens farther than 60 px, and the transform is removed completely at rest', async ({ page }) => {
    await open(page);
    const box = (await button(page).boundingBox())!;
    await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2);
    await expect.poll(async () => (await shift(page)).x, { timeout: 2000 }).toBeGreaterThan(1);

    await page.mouse.move(box.x + box.width + 200, box.y - 200);
    await expect.poll(async () => (await shift(page)).x, { timeout: 3000 }).toBe(0);
    expect(await button(page).evaluate(element => element.style.translate)).toBe('');
    expect(await button(page).evaluate(element => getComputedStyle(element).translate)).toBe('none');
    await expect(button(page)).not.toHaveAttribute('data-follow', /.*/);
  });

  test('clicks and focus work as before', async ({ page }) => {
    await open(page);
    await expect(button(page)).toHaveAttribute('href', 'mailto:mirislamus@gmail.com');
    await expect(button(page, 1)).toHaveAttribute('href', 'https://t.me/mirislamus');
    await button(page).focus();
    await expect(button(page)).toBeFocused();
    const box = (await button(page).boundingBox())!;
    await page.mouse.move(box.x + 10, box.y + box.height / 2);
    await expect(button(page)).toBeVisible();
  });
});

test('with reduced motion nothing leans', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page);
  const box = (await button(page).boundingBox())!;
  await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2);
  await page.waitForTimeout(300);
  expect(await shift(page)).toEqual({ x: 0, y: 0 });
  await context.close();
});

test('a touch does not lean the buttons', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference', hasTouch: true });
  const page = await context.newPage();
  await open(page);
  await button(page).dispatchEvent('pointermove', { pointerType: 'touch', clientX: 10, clientY: 10, bubbles: true });
  await page.waitForTimeout(300);
  expect(await shift(page)).toEqual({ x: 0, y: 0 });
  await context.close();
});
