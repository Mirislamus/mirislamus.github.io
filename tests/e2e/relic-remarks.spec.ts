import { expect, test, type Page } from '@playwright/test';

// The scenes run on stepped timers but the sections are found on real frames, so these tests are slow under load.
test.setTimeout(90_000);

const box = (page: Page) => page.locator('[data-relic-remark]');
const text = (page: Page) => page.locator('[data-relic-remark-text]');

const ABOUT = 'Frontend Engineer. Sounds like a job title in a megacorp. Fine, I’m listening.';
const APPROACH = 'Process, approach... I just grabbed a guitar and walked on stage.';

// Starts the takeover on a page whose timers are under the test's control.
const takeOver = async (page: Page, path = '/') => {
  await page.clock.install();
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.locator('button[data-relic]').click();
  await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
  await page.clock.runFor(7000);
  await expect(page.locator('html')).toHaveAttribute('data-relic', '');
  // The chip is in the footer, so the footer speaks first; let it finish and let the pause pass.
  await page.clock.runFor(20_000);
  await expect(box(page)).toBeHidden();
};

// Moves to a section; the observer works on real frames, so a short real pause lets it see the change.
const goTo = async (page: Page, id: string) => {
  await page.evaluate(selector => document.getElementById(selector)!.scrollIntoView({ behavior: 'instant' }), id);
  await page.waitForTimeout(400);
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('Johnny stays quiet until he is in the site', async ({ page }) => {
    await page.goto('/');
    await expect(box(page)).toBeHidden();
    await expect(box(page)).toHaveAttribute('role', 'status');
    await expect(box(page)).toHaveAttribute('aria-live', 'polite');
    await expect(text(page)).toHaveText('');
  });

  test('a section that comes into view gets its remark, typed, and it leaves after a while', async ({ page }) => {
    await takeOver(page);
    await goTo(page, 'about');
    await page.clock.runFor(500);
    await expect(box(page)).toBeVisible();
    await page.clock.runFor(2500);
    await expect(text(page)).toHaveText(ABOUT);
    await page.clock.runFor(8000);
    await expect(box(page)).toBeHidden();
  });

  test('one remark per section, and the next one waits at least 8 seconds', async ({ page }) => {
    await takeOver(page);
    await goTo(page, 'about');
    await page.clock.runFor(3000);
    await expect(text(page)).toHaveText(ABOUT);
    await page.clock.runFor(7000); // it has left by now
    await expect(box(page)).toBeHidden();
    await goTo(page, 'approach');
    await page.clock.runFor(1000);
    await expect(box(page)).toBeHidden(); // less than 8 s since the last one
    await page.clock.runFor(8000);
    await expect(text(page)).toHaveText(APPROACH);
    await page.clock.runFor(10_000);
    await expect(box(page)).toBeHidden();
    // Back to a section that has spoken: not a second time.
    await goTo(page, 'about');
    await page.clock.runFor(20_000);
    await expect(box(page)).toBeHidden();
  });

  test('a remark whose section is gone from the screen is dropped', async ({ page }) => {
    await takeOver(page);
    await goTo(page, 'about');
    await page.clock.runFor(10_000); // spoken, gone
    await goTo(page, 'approach');
    await goTo(page, 'skills'); // the visitor moves on within the wait
    await page.clock.runFor(1000);
    await goTo(page, 'about');
    await page.clock.runFor(20_000);
    await expect(text(page)).not.toHaveText(APPROACH);
  });

  test('the remark stays while the mouse is over it', async ({ page }) => {
    await takeOver(page);
    await goTo(page, 'about');
    await page.clock.runFor(3000);
    await box(page).hover();
    await page.clock.runFor(15_000);
    await expect(box(page)).toBeVisible();
    await page.mouse.move(700, 100);
    await page.clock.runFor(3000);
    await expect(box(page)).toBeHidden();
  });

  test('the Russian page gets Russian remarks and the box is a live region with a language', async ({ page }) => {
    await takeOver(page, '/ru/');
    await goTo(page, 'about');
    await page.clock.runFor(3000);
    await expect(text(page)).toHaveText('Фронтенд-инженер. Звучит как должность в мегакорпорации. Ладно, послушаем.');
    await expect(text(page)).toHaveAttribute('lang', 'ru');
  });

  test('on a phone it does not cover the button that takes the visitor to the top', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await takeOver(page);
    await goTo(page, 'projects');
    await page.clock.runFor(10_000);
    await goTo(page, 'skills');
    await page.clock.runFor(10_000);
    await expect(box(page)).toBeVisible();
    const remark = (await box(page).boundingBox())!;
    const top = page.locator('[data-back-to-top], button[aria-label*="top" i]').first();
    if (await top.isVisible()) {
      const button = (await top.boundingBox())!;
      const overlap =
        remark.x < button.x + button.width &&
        remark.x + remark.width > button.x &&
        remark.y < button.y + button.height &&
        remark.y + remark.height > button.y;
      expect(overlap).toBe(false);
    }
    expect(remark.x).toBeGreaterThanOrEqual(0);
    expect(remark.x + remark.width).toBeLessThanOrEqual(390);
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the remark simply appears with its whole text', async ({ page }) => {
    await takeOver(page);
    await goTo(page, 'about');
    await page.clock.runFor(100);
    await expect(text(page)).toHaveText(ABOUT);
    await expect(box(page)).not.toHaveAttribute('data-leaving', '');
    await page.clock.runFor(7000);
    await expect(box(page)).toBeHidden();
  });
});
