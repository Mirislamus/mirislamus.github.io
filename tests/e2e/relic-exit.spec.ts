import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { audioLog, installFakeAudio } from './support/audio';

// The scene takes about six seconds and some tests move a stepped clock, so these tests are slow under load.
test.setTimeout(90_000);

const html = (page: Page) => page.locator('html');
const plate = (page: Page) => page.locator('[data-relic-plate]');
const eject = (page: Page) => page.locator('[data-relic-eject]');
const sound = (page: Page) => page.locator('[data-relic-sound]');
const chip = (page: Page) => page.locator('button[data-relic]');

// The scene runs about 6 seconds; the tests wait for the takeover to begin.
const takeOver = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await chip(page).click();
  await expect(html(page)).toHaveAttribute('data-relic', '', { timeout: 10_000 });
  await expect(plate(page)).toBeVisible();
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the plate is not there before Johnny, and the focus goes to the button when he arrives', async ({ page }) => {
    await page.goto('/');
    await expect(plate(page)).toBeHidden();
    await takeOver(page);
    await expect(eject(page)).toBeFocused();
    await expect(eject(page)).toHaveText('Eject the chip');
  });

  test('the buttons are at least 44 px and the plate stays clear of the button to the top on a phone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await installFakeAudio(page);
    await takeOver(page);
    for (const button of [eject(page), sound(page)]) {
      const box = (await button.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    const mine = (await plate(page).boundingBox())!;
    const top = page.locator('button[aria-label*="top" i]').first();
    if (await top.isVisible()) {
      const other = (await top.boundingBox())!;
      const overlap =
        mine.x < other.x + other.width &&
        mine.x + mine.width > other.x &&
        mine.y < other.y + other.height &&
        mine.y + mine.height > other.y;
      expect(overlap).toBe(false);
    }
    expect(mine.x + mine.width).toBeLessThanOrEqual(390);
  });

  test('"Eject the chip" brings everything back: palette, logo, texts, plate, and the focus is on the chip', async ({
    page,
  }) => {
    await takeOver(page);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Rockerboy');
    await eject(page).click();
    await expect(html(page)).not.toHaveAttribute('data-relic', '', { timeout: 3000 });
    await expect(plate(page)).toBeHidden();
    await expect(page.locator('[data-logo]').getByText('SAMURAI')).toBeHidden();
    await expect(page.locator('[data-logo] svg:not([data-logo-ghost])')).toBeVisible();
    // The texts are exactly as before: nothing of the replacement is left in the page.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mirislam Usmanov Frontend Engineer');
    await expect(page.locator('[data-swap-real], [data-swap-fake]')).toHaveCount(0);
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-text'))
    ).not.toBe('#ff2e63');
    await expect(html(page)).not.toHaveAttribute('data-relic-glitch', '');
    await expect(html(page)).not.toHaveAttribute('data-relic-swapping', '');
    await expect(chip(page)).toBeFocused();
  });

  test('nothing keeps running after the exit: no glitches, no remarks, the context is closed', async ({ page }) => {
    await installFakeAudio(page);
    await page.clock.install();
    await page.addInitScript(() => {
      (window as unknown as { glitches: number }).glitches = 0;
      document.addEventListener('relic:glitch', () => (window as unknown as { glitches: number }).glitches++);
    });
    await page.goto('/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await chip(page).click();
    await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
    await page.clock.runFor(7000);
    await expect(plate(page)).toBeVisible();
    await eject(page).click();
    await page.clock.runFor(2000);
    await expect(html(page)).not.toHaveAttribute('data-relic', '');
    const glitches = await page.evaluate(() => (window as unknown as { glitches: number }).glitches);
    await page.clock.runFor(60_000);
    expect(await page.evaluate(() => (window as unknown as { glitches: number }).glitches)).toBe(glitches);
    await expect(page.locator('[data-relic-remark]')).toBeHidden();
    expect((await audioLog(page)).closed).toBe(1);
  });

  test('Escape takes the chip out too', async ({ page }) => {
    await takeOver(page);
    await page.keyboard.press('Escape');
    await expect(html(page)).not.toHaveAttribute('data-relic', '', { timeout: 3000 });
  });

  test('Escape in another dialog only closes that dialog: Johnny stays', async ({ page }) => {
    await takeOver(page);
    await page.locator('[data-rabbit]').click();
    await expect(page.locator('dialog[data-pills]')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[data-pills]')).not.toHaveAttribute('open', '', { timeout: 3000 });
    await expect(html(page)).toHaveAttribute('data-relic', '');
    await expect(plate(page)).toBeVisible();
  });

  test('after a reload the site is the usual one, and Johnny can come again', async ({ page }) => {
    await takeOver(page);
    await page.reload();
    await expect(html(page)).not.toHaveAttribute('data-relic', '');
    await expect(plate(page)).toBeHidden();
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await chip(page).click();
    await expect(html(page)).toHaveAttribute('data-relic', '', { timeout: 10_000 });
  });

  test('while Johnny is in, the chip does not start another scene', async ({ page }) => {
    await takeOver(page);
    await chip(page).click();
    await page.waitForTimeout(500);
    await expect(page.locator('dialog[data-relic-scene]')).not.toHaveAttribute('open', '');
  });

  test('he can come again after the exit', async ({ page }) => {
    await takeOver(page);
    await eject(page).click();
    await expect(html(page)).not.toHaveAttribute('data-relic', '', { timeout: 3000 });
    await chip(page).click();
    await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
    await expect(html(page)).toHaveAttribute('data-relic', '', { timeout: 10_000 });
  });

  test('the texts follow the language', async ({ page }) => {
    await takeOver(page, '/ru/');
    await expect(eject(page)).toHaveText('Вынуть чип');
    await expect(sound(page)).toHaveAccessibleName(/звук/);
    await page.goto('/uz/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await chip(page).click();
    await expect(eject(page)).toHaveText('Chipni chiqarish', { timeout: 10_000 });
  });

  test('axe finds no violations on the plate', async ({ page }) => {
    await installFakeAudio(page);
    await takeOver(page);
    const results = await new AxeBuilder({ page }).include('[data-relic-plate]').analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('the sound button', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('is pressed while the music plays, named by what it does, and switching it off closes the context', async ({
    page,
  }) => {
    await installFakeAudio(page);
    await takeOver(page);
    await expect(sound(page)).toBeVisible();
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(sound(page)).toHaveAccessibleName('Turn sound off');
    await expect.poll(async () => (await audioLog(page)).contexts).toBe(1);
    await sound(page).click();
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(sound(page)).toHaveAccessibleName('Turn sound on');
    await expect.poll(async () => (await audioLog(page)).closed, { timeout: 3000 }).toBe(1);
    await sound(page).click();
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 3000 }).toBe(2);
  });

  test('the choice is remembered: after a reload the next takeover is silent', async ({ page }) => {
    await installFakeAudio(page);
    await takeOver(page);
    await sound(page).click();
    expect(await page.evaluate(() => localStorage.getItem('relic-sound'))).toBe('0');
    await page.reload();
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await chip(page).click();
    await expect(html(page)).toHaveAttribute('data-relic', '', { timeout: 10_000 });
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'false');
    expect((await audioLog(page)).contexts).toBe(0);
  });

  test('works when the storage is blocked', async ({ page }) => {
    await installFakeAudio(page);
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await takeOver(page);
    await sound(page).click();
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'false');
    expect(errors).toEqual([]);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the sound is off but can be switched on, and the exit works without a glitch', async ({ page }) => {
    await installFakeAudio(page);
    await takeOver(page);
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'false');
    expect((await audioLog(page)).contexts).toBe(0);
    await sound(page).click();
    await expect(sound(page)).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await audioLog(page)).contexts, { timeout: 3000 }).toBe(1);
    await eject(page).click();
    await expect(html(page)).not.toHaveAttribute('data-relic', '', { timeout: 1000 });
    await expect(chip(page)).toBeFocused();
  });
});
