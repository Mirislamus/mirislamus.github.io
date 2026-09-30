import { expect, test, type Page } from '@playwright/test';

const KEY = 'intro-played';

const introAtDomReady = async (page: Page) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { introAtDomReady: boolean }).introAtDomReady =
        document.documentElement.hasAttribute('data-intro');
    });
  });
};

const readIntro = (page: Page) =>
  page.evaluate(() => (window as unknown as { introAtDomReady: boolean }).introAtDomReady);

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('plays on the first visit, before the first paint, and cleans up afterwards', async ({ page }) => {
    await introAtDomReady(page);
    await page.goto('/');

    expect(await readIntro(page)).toBe(true);
    expect(await page.evaluate(k => sessionStorage.getItem(k), KEY)).toBe('1');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/, { timeout: 4000 });
  });

  test('does not replay on reload or when switching language in the same tab', async ({ page }) => {
    await page.goto('/');
    await page.reload();
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);

    await page.goto('/ru/');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
  });

  test('is skipped for a deep link', async ({ page }) => {
    await page.goto('/#projects');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
  });

  test('is skipped, without errors, when storage is blocked', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', /.*/);
    expect(errors).toEqual([]);
  });

  test('never hides the heading text behind opacity while it plays', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-intro', '');
    const opacity = await page.locator('h1').evaluate(element => getComputedStyle(element).opacity);
    expect(opacity).toBe('1');
  });

  test('the avatar tilts and the photo drifts with the cursor, then settles back', async ({ page }) => {
    await page.goto('/#about');
    const svg = page.locator('[data-avatar]');
    const photo = page.locator('[data-photo]');

    await page.mouse.move(2, 200);
    await expect
      .poll(() => photo.evaluate(element => (element as HTMLElement).style.transform))
      .toMatch(/translate\(-[1-9]/);
    expect(await svg.evaluate(element => (element as unknown as HTMLElement).style.transform)).toContain('rotateY(-');

    const viewport = page.viewportSize()!;
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await expect
      .poll(() =>
        photo.evaluate(element =>
          Math.abs(parseFloat((element as HTMLElement).style.transform.replace('translate(', '')))
        )
      )
      .toBeLessThan(1);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('there is no intro and no cursor effect', async ({ page }) => {
    await introAtDomReady(page);
    await page.goto('/#about');
    expect(await readIntro(page)).toBe(false);
    expect(await page.evaluate(k => sessionStorage.getItem(k), KEY)).toBeNull();

    await page.mouse.move(2, 200);
    await page.waitForTimeout(300);
    expect(await page.locator('[data-photo]').evaluate(element => (element as HTMLElement).style.transform)).toBe('');
  });
});

test('the heading is split into words but keeps its text and accessible name', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveText('Mirislam Usmanov Frontend Engineer');
  await expect(heading.locator('span > span')).toHaveCount(2);
});
