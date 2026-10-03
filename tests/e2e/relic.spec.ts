import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const chip = (page: Page) => page.locator('[data-relic]');

const showFooter = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
};

test('the chip is named on every language', async ({ page }) => {
  await showFooter(page);
  await expect(chip(page)).toHaveAccessibleName('Insert the Relic chip');
  await showFooter(page, '/ru/');
  await expect(chip(page)).toHaveAccessibleName('Вставить чип «Реликт»');
  await showFooter(page, '/uz/');
  await expect(chip(page)).toHaveAccessibleName('«Relikt» chipini kiritish');
});

test('the touch target is at least 24 px and the glitch copies stay out of the way', async ({ page }) => {
  await showFooter(page);
  const box = await chip(page).boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(24);
  expect(box!.height).toBeGreaterThanOrEqual(24);
  const ghosts = page.locator('[data-relic-ghost]');
  await expect(ghosts).toHaveCount(2);
  for (const ghost of await ghosts.all()) {
    await expect(ghost).toHaveAttribute('aria-hidden', 'true');
    await expect(ghost).toHaveCSS('pointer-events', 'none');
  }
});

test('the chunk loads only after the click', async ({ page }) => {
  const chunks: string[] = [];
  page.on('request', request => {
    if (/relic/i.test(request.url()) && request.url().endsWith('.js')) chunks.push(request.url());
  });
  await showFooter(page);
  await page.waitForLoadState('networkidle');
  expect(chunks).toHaveLength(0);
  await chip(page).click();
  await expect.poll(() => chunks.length).toBeGreaterThan(0);
});

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('hovering plays the glitch once on the red and cyan copies', async ({ page }) => {
    await showFooter(page);
    await chip(page).hover();
    await expect
      .poll(() =>
        page
          .locator('[data-relic-ghost]')
          .first()
          .evaluate(element => getComputedStyle(element).animationName)
      )
      .toContain('chip-glitch');
    const count = await page
      .locator('[data-relic-ghost]')
      .first()
      .evaluate(element => getComputedStyle(element).animationIterationCount);
    expect(count).toBe('1');
  });
});

test('with reduced motion nothing glitches', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await showFooter(page);
  await chip(page).hover();
  await expect(page.locator('[data-relic-ghost]').first()).toHaveCSS('animation-name', 'none');
});

test('axe finds no violations on the chip', async ({ page }) => {
  await showFooter(page);
  const results = await new AxeBuilder({ page }).include('[data-relic]').analyze();
  expect(results.violations).toEqual([]);
});

const scene = (page: Page) => page.locator('dialog[data-relic-scene]');

const openScene = async (page: Page, path = '/') => {
  await showFooter(page, path);
  await chip(page).click();
  await expect(scene(page)).toHaveAttribute('open', '');
};

test.describe('the scene, when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('opens as a modal dialog named after Johnny, with the quote for a screen reader', async ({ page }) => {
    await openScene(page);
    await expect(page.getByRole('dialog', { name: 'Johnny Silverhand' })).toBeVisible();
    await expect(scene(page).getByText('Wake up, Samurai. We have a city to burn.')).toBeAttached();
    expect(await page.evaluate(() => document.querySelector('dialog[open]')!.contains(document.activeElement))).toBe(
      true
    );
  });

  test('the strong word never shows: only blocks, and the lines are hidden from assistive technology', async ({
    page,
  }) => {
    await openScene(page);
    const first = scene(page).locator('[data-relic-line="1"]');
    await expect(first).toHaveAttribute('aria-hidden', 'true');
    await expect(first).toHaveText(/^Wake the f[▓▒░█▌▐]{3} up, Samurai\.$/, { timeout: 4000 });
    await expect(scene(page).locator('[data-relic-line="2"]')).toHaveText('We have a city to burn.', {
      timeout: 5000,
    });
  });

  test('the figure is drawn', async ({ page }) => {
    await openScene(page);
    await expect(scene(page).locator('[data-johnny]')).toHaveAttribute('data-drawn', '', { timeout: 2000 });
  });

  test('Escape leaves without the takeover and the focus goes back to the chip', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { took: boolean }).took = false;
      document.addEventListener('relic:takeover', () => ((window as unknown as { took: boolean }).took = true));
    });
    await openScene(page);
    await page.keyboard.press('Escape');
    await expect(scene(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
    await expect(chip(page)).toBeFocused();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => (window as unknown as { took: boolean }).took)).toBe(false);
  });

  test('the close button and a click on the dark area leave too', async ({ page }) => {
    await openScene(page);
    await page.locator('[data-relic-close]').click();
    await expect(scene(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
    await chip(page).click();
    await expect(scene(page)).toHaveAttribute('open', '');
    await scene(page).click({ position: { x: 10, y: 400 } });
    await expect(scene(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
  });

  test('left alone it closes by itself and the takeover starts', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { took: boolean }).took = false;
      document.addEventListener('relic:takeover', () => ((window as unknown as { took: boolean }).took = true));
    });
    await openScene(page);
    await expect(scene(page)).not.toHaveAttribute('open', '', { timeout: 9000 });
    expect(await page.evaluate(() => (window as unknown as { took: boolean }).took)).toBe(true);
  });

  test('axe finds no violations in the scene (the contrast of the red lines is checked on the text)', async ({
    page,
  }) => {
    await openScene(page);
    await expect(scene(page).locator('[data-relic-line="2"]')).toHaveText('We have a city to burn.', {
      timeout: 5000,
    });
    const results = await new AxeBuilder({ page }).include('dialog[data-relic-scene]').analyze();
    expect(results.violations).toEqual([]);
  });
});

test('the subtitle is in the language of the page and the quote stays English', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScene(page, '/ru/');
  await expect(scene(page).locator('[data-relic-subtitle]')).toHaveText(
    'Проснись, самурай. У нас есть город, который надо сжечь.'
  );
  await expect(page.getByRole('dialog', { name: 'Джонни Сильверхенд' })).toBeVisible();
  await expect(scene(page).locator('[data-relic-line="2"]')).toHaveText('We have a city to burn.');
});

test('the English page has no subtitle', async ({ page }) => {
  await openScene(page);
  await expect(scene(page).locator('[data-relic-subtitle]')).toHaveCount(0);
});

test('with reduced motion everything is there at once and still closes by itself', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScene(page);
  await expect(scene(page).locator('[data-johnny]')).toHaveAttribute('data-drawn', '');
  await expect(scene(page).locator('[data-relic-line="1"]')).toHaveText(/^Wake the f[▓▒░█▌▐]{3} up, Samurai\.$/);
  await expect(scene(page).locator('[data-relic-line="2"]')).toHaveText('We have a city to burn.');
  await expect(scene(page)).not.toHaveAttribute('open', '', { timeout: 8000 });
});
