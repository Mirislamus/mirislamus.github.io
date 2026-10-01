import { expect, test, type Page } from '@playwright/test';

const root = (page: Page) => page.locator('glyph-wordmark');
const canvas = (page: Page) => page.locator('glyph-wordmark canvas');

const opaqueAccentPixels = (page: Page) =>
  canvas(page).evaluate(element => {
    const c = element as HTMLCanvasElement;
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    let count = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] === 255) count++;
    return count;
  });

const painted = (page: Page) =>
  canvas(page).evaluate(element => {
    const c = element as HTMLCanvasElement;
    const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
    return data.some((value, index) => index % 4 === 3 && value > 0);
  });

const toFooter = async (page: Page) => {
  await page.goto('/');
  await page.locator('#contacts').scrollIntoViewIfNeeded();
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('assembles out of falling glyphs, then the canvas replaces the text version', async ({ page }) => {
    await toFooter(page);
    await expect(root(page)).toHaveAttribute('data-ready', '');
    await expect(root(page)).toHaveAttribute('aria-hidden', 'true');
    await expect.poll(() => painted(page)).toBe(true);
    await expect(root(page).locator('pre[data-variant="desktop"]')).toHaveCSS('visibility', 'hidden');
  });

  test('glyphs flash under the cursor and settle again', async ({ page }) => {
    await toFooter(page);
    await expect.poll(() => painted(page)).toBe(true);
    await page.waitForTimeout(2000); // the assembly takes about 1.4 s

    expect(await opaqueAccentPixels(page)).toBe(0);
    const box = (await canvas(page).boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
    await page.mouse.move(box.x + box.width * 0.34, box.y + box.height / 2, { steps: 4 });
    await expect.poll(() => opaqueAccentPixels(page), { timeout: 1000 }).toBeGreaterThan(50);
    await expect.poll(() => opaqueAccentPixels(page), { timeout: 2000 }).toBe(0);
  });

  test('fills the width of the page container', async ({ page }) => {
    await toFooter(page);
    const box = (await canvas(page).boundingBox())!;
    const container = (await page.locator('#contacts .container').boundingBox())!;
    expect(box.width).toBeCloseTo(container.width - 24, 0);
  });
});

test.describe('on a phone', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('uses the two-line version and fits the screen', async ({ page }) => {
    await toFooter(page);
    await expect(root(page).locator('pre[data-variant="mobile"]')).toHaveCSS('display', 'block');
    await expect(root(page).locator('pre[data-variant="desktop"]')).toHaveCSS('display', 'none');
    await expect.poll(() => painted(page)).toBe(true);
    const box = (await canvas(page).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the word is there at once, without any assembly or flashing', async ({ page }) => {
    await toFooter(page);
    await expect.poll(() => painted(page)).toBe(true);
    const box = (await canvas(page).boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
    await page.mouse.move(box.x + box.width * 0.34, box.y + box.height / 2, { steps: 4 });
    await page.waitForTimeout(300);
    expect(await opaqueAccentPixels(page)).toBe(0);
  });
});

test('without JavaScript the word is plain text in the page', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  const text = await root(page).locator('pre[data-variant="desktop"]').textContent();
  expect(text!.split('\n').length).toBeGreaterThan(8);
  expect(text).toMatch(/[@#]/);
  await expect(root(page)).not.toHaveAttribute('data-ready', /.*/);
  await context.close();
});

test('the glyph canvas never covers the page: the Hero links can be clicked', async ({ page }) => {
  await page.goto('/');
  const hit = await page.evaluate(() => {
    const point = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return point?.tagName;
  });
  expect(hit).not.toBe('CANVAS');
  await page.getByRole('link', { name: 'Discuss a project' }).click();
  await expect(page).toHaveURL(/#contacts$/);
});
