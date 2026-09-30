import { expect, test } from '@playwright/test';

test('the skip link is the first focusable element and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test.describe('language list', () => {
  test('opens, moves with arrow keys, closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-langs-button]');
    const list = page.locator('#language-options');

    await button.click();
    await expect(list).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(list.getByRole('link', { name: 'English' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(list.getByRole('link', { name: 'Russian' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(list.getByRole('link', { name: 'Uzbek' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(list.getByRole('link', { name: 'English' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(list).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('closes on an outside click', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-langs-button]').click();
    await page.mouse.click(10, 400);
    await expect(page.locator('#language-options')).toBeHidden();
  });

  test('keeps the current section and uses trailing-slash URLs', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
    await expect(page.locator('[data-link][aria-current="true"]')).toHaveAttribute('href', '#projects');

    // dispatchEvent: Playwright's own click would scroll the sticky header's button into view first.
    await page.locator('[data-langs-button]').dispatchEvent('click');
    const hrefs = await page
      .locator('[data-lang-link]')
      .evaluateAll(links => links.map(link => link.getAttribute('href')));
    expect(hrefs).toEqual(['/#projects', '/ru/#projects', '/uz/#projects']);

    await page.getByRole('link', { name: 'Russian' }).dispatchEvent('click');
    await expect(page).toHaveURL(/\/ru\/#projects$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  });
});

test.describe('active section', () => {
  test('follows the scroll position and the last section wins at the bottom', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-link][aria-current="true"]')).toHaveAttribute('href', '#about');

    await page.evaluate(() => document.getElementById('career')?.scrollIntoView());
    await expect(page.locator('[data-link][aria-current="true"]')).toHaveAttribute('href', '#career');

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(page.locator('[data-link][aria-current="true"]')).toHaveAttribute('href', '#contacts');
  });

  test('the sliding line stays under the active link after a resize', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
    await expect(page.locator('[data-link][aria-current="true"]')).toHaveAttribute('href', '#projects');

    for (const width of [1100, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(300);
      const aligned = await page.evaluate(() => {
        const link = document.querySelector<HTMLElement>('[data-link][aria-current="true"]')!.getBoundingClientRect();
        const line = document.querySelector<HTMLElement>('[data-line]')!.getBoundingClientRect();
        return Math.abs(line.left + line.width / 2 - (link.left + link.width / 2)) < 2;
      });
      expect(aligned).toBe(true);
    }
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, traps focus, locks scroll, closes with Escape and restores everything', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-menu-button]');
    const nav = page.locator('#main-navigation');

    await expect(nav).toBeHidden();
    await button.click();
    await expect(nav).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveAttribute('aria-label', 'Close menu');
    await expect(page.locator('main')).toHaveJSProperty('inert', true);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(nav.getByRole('link').first()).toBeFocused();

    // Focus never leaves the menu.
    for (let index = 0; index < 14; index += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        return Boolean(active?.closest('#main-navigation') || active?.closest('[data-menu-button]'));
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute('aria-label', 'Menu');
    await expect(page.locator('main')).toHaveJSProperty('inert', false);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('closes when a link is chosen and when the overlay is tapped', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('[data-menu-button]');

    await button.click();
    await page.locator('#main-navigation').getByRole('link', { name: 'Projects' }).click();
    await expect(page.locator('#main-navigation')).toBeHidden();

    await button.click();
    // The drawer covers the right part of the screen; the blurred page is what is left of it.
    await page.mouse.click(15, 700);
    await expect(page.locator('#main-navigation')).toBeHidden();
  });

  test('the language list and the menu close each other', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-langs-button]').click();
    await expect(page.locator('#language-options')).toBeVisible();

    await page.locator('[data-menu-button]').click();
    await expect(page.locator('#language-options')).toBeHidden();
    await expect(page.locator('#main-navigation')).toBeVisible();

    await page.keyboard.press('Escape');
    await page.locator('[data-langs-button]').click();
    await expect(page.locator('#language-options')).toBeVisible();
    await expect(page.locator('#main-navigation')).toBeHidden();
  });

  test('resizing to desktop with the menu open unlocks the page', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-menu-button]').click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('main')).toHaveJSProperty('inert', false);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});

test('the bar stays at the top of the window while the page scrolls', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView());
  await page.mouse.wheel(0, -40);
  await expect
    .poll(() =>
      page
        .locator('header')
        .first()
        .evaluate(element => Math.round(element.getBoundingClientRect().top))
    )
    .toBeGreaterThanOrEqual(0);
  const top = await page
    .locator('header')
    .first()
    .evaluate(element => element.getBoundingClientRect().top);
  expect(top).toBeLessThan(40);
});
