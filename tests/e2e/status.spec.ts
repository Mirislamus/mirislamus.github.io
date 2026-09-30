import { expect, test } from '@playwright/test';

// Tashkent is UTC+5: 06:00 UTC is 11:00 there on a Wednesday.
const WORKING = new Date('2026-09-30T06:00:00Z');
const EVENING = new Date('2026-09-30T15:00:00Z'); // 20:00
const SATURDAY = new Date('2026-10-03T08:00:00Z'); // 13:00

test.describe('hero badge', () => {
  test('sits between the avatar and the name and is decorative-dot only', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('#about p').filter({ hasText: 'Open to new projects' });
    await expect(badge).toBeVisible();
    await expect(badge.locator('span[aria-hidden="true"]')).toHaveCount(1);

    const order = await page.locator('#about').evaluate(section => {
      const items = [...section.querySelectorAll('[data-avatar], p, h1')];
      const badgeIndex = items.findIndex(element => element.textContent?.includes('Open to new projects'));
      const headingIndex = items.findIndex(element => element.tagName === 'H1');
      return badgeIndex < headingIndex && badgeIndex > 0;
    });
    expect(order).toBe(true);
  });

  test('is translated', async ({ page }) => {
    await page.goto('/ru/');
    await expect(page.getByText('Открыт к предложениям')).toBeVisible();
    await page.goto('/uz/');
    await expect(page.getByText('Yangi loyihalarga ochiqman')).toBeVisible();
  });
});

test.describe('local time widget', () => {
  test('shows Tashkent time with the offset and "online" during working hours', async ({ page }) => {
    await page.clock.setFixedTime(WORKING);
    await page.goto('/');
    const widget = page.locator('local-time');
    await expect(widget).toContainText('Tashkent');
    await expect(widget.locator('time')).toHaveText('11:00 AM (UTC+5)');
    await expect(widget.locator('time')).toHaveAttribute('datetime', '11:00');
    await expect(widget).toContainText('Online now');
    await expect(widget.locator('[data-status]')).toHaveAttribute('data-online', '');
  });

  test('shows the work time zone, not the visitor time zone', async ({ browser }) => {
    const context = await browser.newContext({ timezoneId: 'America/New_York', reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.clock.setFixedTime(WORKING);
    await page.goto('http://127.0.0.1:4399/');
    await expect(page.locator('local-time time')).toHaveText('11:00 AM (UTC+5)');
    await context.close();
  });

  test('says the reply comes during working hours in the evening and on weekends', async ({ page }) => {
    await page.clock.setFixedTime(EVENING);
    await page.goto('/');
    await expect(page.locator('local-time')).toContainText('Will reply during working hours');
    await expect(page.locator('local-time [data-status]')).not.toHaveAttribute('data-online', '');

    await page.clock.setFixedTime(SATURDAY);
    await page.reload();
    await expect(page.locator('local-time')).toContainText('Will reply during working hours');
  });

  test('uses the 24-hour format and translated status in Russian', async ({ page }) => {
    await page.clock.setFixedTime(WORKING);
    await page.goto('/ru/');
    await expect(page.locator('local-time')).toContainText('Ташкент');
    await expect(page.locator('local-time time')).toHaveText('11:00 (UTC+5)');
    await expect(page.locator('local-time')).toContainText('На связи');
  });

  test('updates on the next minute boundary', async ({ page }) => {
    await page.clock.install({ time: WORKING });
    await page.goto('/');
    await expect(page.locator('local-time time')).toHaveText('11:00 AM (UTC+5)');
    await page.clock.fastForward('01:05');
    await expect(page.locator('local-time time')).toHaveText('11:01 AM (UTC+5)');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('only the city is shown', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('local-time')).toContainText('Tashkent');
      await expect(page.locator('local-time time')).toBeHidden();
      await expect(page.locator('local-time [data-status]')).toBeHidden();
    });
  });
});
