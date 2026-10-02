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

// The glyph hands (A-06) are on a canvas: the tests read its pixels.
const tintAround = (page: Page, button: 'Blue pill' | 'Red pill') =>
  page.evaluate(name => {
    const root = document.querySelector<HTMLElement>('dialog[data-pills] [data-pills-hands]')!;
    const canvas = root.querySelector('canvas')!;
    const target = [...root.querySelectorAll('button')].find(item => item.getAttribute('aria-label') === name)!;
    const box = canvas.getBoundingClientRect();
    const spot = target.getBoundingClientRect();
    const scale = canvas.width / box.width;
    const size = Math.round(spot.width * 0.5 * scale);
    const data = canvas
      .getContext('2d')!
      .getImageData(
        Math.round((spot.left + spot.width / 2 - box.left) * scale - size / 2),
        Math.round((spot.top + spot.height / 2 - box.top) * scale - size / 2),
        size,
        size
      ).data;
    let blue = 0;
    let red = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 40) continue;
      if (data[i + 2] > data[i] + 30) blue++;
      if (data[i] > data[i + 2] + 30) red++;
    }
    return { blue, red };
  }, button);

test.describe('glyph hands', () => {
  test.use({ reducedMotion: 'reduce' });

  test('are drawn at once, and every button lies over a capsule of its colour', async ({ page }) => {
    await openScene(page);
    // As in the film: the red pill on the left hand, the blue one on the right.
    const left = await tintAround(page, 'Red pill');
    const right = await tintAround(page, 'Blue pill');
    expect(left.red).toBeGreaterThan(40);
    expect(left.blue).toBeLessThan(left.red / 4);
    expect(right.blue).toBeGreaterThan(40);
    expect(right.red).toBeLessThan(right.blue / 4);
  });

  test('stand still: no lean with the mouse', async ({ page }) => {
    await openScene(page);
    await page.mouse.move(20, 20);
    await page.waitForTimeout(400);
    expect(
      await dialog(page)
        .locator('[data-pills-hands]')
        .evaluate(element => element.style.transform)
    ).toBe('');
  });

  test('stay readable on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openScene(page);
    const left = await tintAround(page, 'Red pill');
    expect(left.red).toBeGreaterThan(15);
    const box = await dialog(page).locator('[data-pills-hands]').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});

test.describe('glyph hands in motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('assemble out of falling glyphs, then lean after the mouse', async ({ page }) => {
    await openScene(page);
    const painted = () =>
      dialog(page)
        .locator('[data-pills-hands] canvas')
        .evaluate(canvas => {
          const { data } = (canvas as HTMLCanvasElement)
            .getContext('2d')!
            .getImageData(0, 0, (canvas as HTMLCanvasElement).width, (canvas as HTMLCanvasElement).height);
          let count = 0;
          for (let i = 3; i < data.length; i += 4) if (data[i] > 40) count++;
          return count;
        });

    const early = await painted();
    await expect.poll(painted, { timeout: 5000 }).toBeGreaterThan(early * 1.5);

    await page.mouse.move(10, 10);
    await expect
      .poll(
        () =>
          dialog(page)
            .locator('[data-pills-hands]')
            .evaluate(element => element.style.transform),
        {
          timeout: 2000,
        }
      )
      .toContain('rotateY(');
  });
});

test.describe('the scene follows the theme', () => {
  test.use({ reducedMotion: 'reduce' });

  const inkOf = (page: Page) =>
    page.evaluate(() => {
      const root = document.querySelector<HTMLElement>('dialog[data-pills]')!;
      const canvas = root.querySelector<HTMLCanvasElement>('[data-pills-hands] canvas')!;
      const { data } = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
      let sum = 0;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        // The glyphs without the coloured capsules: grey ones (the channels are close).
        if (data[i + 3] > 60 && Math.abs(data[i] - data[i + 2]) < 20) {
          sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
          count++;
        }
      }
      return { brightness: count ? sum / count : -1, background: getComputedStyle(root).backgroundColor };
    });

  test('on a light page: a light scene with dark hands', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await openScene(page);
    const { brightness, background } = await inkOf(page);
    expect(background).toBe('rgb(255, 255, 255)');
    expect(brightness).toBeGreaterThanOrEqual(0);
    expect(brightness).toBeLessThan(90);
  });

  test('on a dark page: a dark scene with light hands', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await openScene(page);
    const { brightness, background } = await inkOf(page);
    expect(background).not.toBe('rgb(255, 255, 255)');
    expect(brightness).toBeGreaterThan(160);
  });
});
