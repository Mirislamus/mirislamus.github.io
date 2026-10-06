import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The chat runs on real timers (each message after "… is typing"), so these tests wait for messages, not for frames.
test.setTimeout(90_000);

const chat = (page: Page) => page.locator('[data-relic-chat]');
const log = (page: Page) => page.locator('[data-relic-chat-log]');
const messages = (page: Page) => log(page).locator('li');
const toggle = (page: Page) => page.locator('[data-relic-chat-toggle]');

const takeOver = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.locator('button[data-relic]').click();
  await expect(page.locator('html')).toHaveAttribute('data-relic', '', { timeout: 10_000 });
};

const goTo = (page: Page, id: string) =>
  page.evaluate(section => document.getElementById(section)!.scrollIntoView({ behavior: 'instant' }), id);

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });

  test('the channel is not there before the takeover', async ({ page }) => {
    await page.goto('/');
    await expect(chat(page)).toBeHidden();
    await expect(log(page)).toHaveAttribute('role', 'log');
    await expect(log(page)).toHaveAttribute('aria-live', 'polite');
  });

  test('the talk opens with the gig: fixer, netrunner, fixer, one after another, with "typing" between', async ({
    page,
  }) => {
    await takeOver(page);
    await expect(chat(page)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Secure channel' })).toBeVisible();
    await expect(page.locator('[data-relic-chat-typing]')).toHaveText('Fixer is typing…', { timeout: 3000 });
    await expect(messages(page)).toHaveCount(3, { timeout: 10_000 });
    await expect(messages(page).nth(0)).toHaveAttribute('data-from', 'fixer');
    await expect(messages(page).nth(0)).toContainText('Fixer');
    await expect(messages(page).nth(0)).toContainText('Got a gig.');
    await expect(messages(page).nth(1)).toHaveAttribute('data-from', 'runner');
    await expect(messages(page).nth(1)).toContainText('Copy. Jacking into the network.');
    await expect(messages(page).nth(2)).toHaveAttribute('data-from', 'fixer');
    // The avatars and the typing line are for the eyes only.
    await expect(messages(page).nth(0).locator('[data-avatar]')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('[data-relic-chat-typing]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('a section has its turn once; the contacts wait for the reviews', async ({ page }) => {
    await takeOver(page); // the visitor is at the contacts: they must not speak yet
    await expect(messages(page)).toHaveCount(3, { timeout: 10_000 });
    await page.waitForTimeout(1500);
    await expect(log(page)).not.toContainText('Channel is open.');
    await goTo(page, 'approach');
    await expect(log(page)).toContainText('the process bends to the task', { timeout: 6000 });
    await goTo(page, 'about');
    await page.waitForTimeout(400); // the observer sees the section on a real frame
    await goTo(page, 'approach');
    await expect(log(page)).toContainText('Don’t relax.', { timeout: 6000 });
    await page.waitForTimeout(2500);
    await expect(log(page).getByText('the process bends to the task')).toHaveCount(1);
    await goTo(page, 'reviews');
    await expect(log(page)).toContainText('Settled. We’re hiring.', { timeout: 8000 });
    await goTo(page, 'contacts');
    await expect(log(page)).toContainText('Jacking out. Good luck, choom.', { timeout: 8000 });
  });

  test('a quick reply: the visitor sends it, someone answers, the page goes to the section', async ({ page }) => {
    await takeOver(page);
    const reply = page.getByRole('button', { name: 'Show the projects' });
    await expect(reply).toBeVisible({ timeout: 10_000 });
    await reply.click();
    await expect(reply).toHaveCount(0);
    await expect(log(page).locator('li[data-from="you"]')).toContainText('Show the projects');
    await expect(log(page)).toContainText('On it.', { timeout: 5000 });
    await expect
      .poll(() => page.evaluate(() => document.getElementById('projects')!.getBoundingClientRect().top), {
        timeout: 5000,
      })
      .toBeLessThan(200);
  });

  test('folds into its header, counts what came meanwhile, and opens again', async ({ page }) => {
    await takeOver(page);
    await expect(messages(page)).toHaveCount(3, { timeout: 10_000 });
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle(page)).toHaveAccessibleName('Fold the chat');
    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(log(page)).toBeHidden();
    await goTo(page, 'about');
    await expect(page.locator('[data-relic-chat-badge]')).toHaveText('2', { timeout: 8000 });
    await expect(toggle(page)).toHaveAccessibleName('Open the chat. New messages: 2');
    await toggle(page).click();
    await expect(log(page)).toBeVisible();
    await expect(page.locator('[data-relic-chat-badge]')).toBeHidden();
    await expect(toggle(page)).toHaveAccessibleName('Fold the chat');
  });

  test('the Russian page talks in Russian', async ({ page }) => {
    await takeOver(page, '/ru/');
    await expect(page.getByRole('region', { name: 'Защищённый канал' })).toBeVisible();
    await expect(log(page)).toContainText('Есть заказ.', { timeout: 6000 });
    await expect(messages(page).first()).toContainText('Фиксер');
    await expect(page.getByRole('button', { name: 'Покажи проекты' })).toBeVisible({ timeout: 10_000 });
  });

  test('axe finds no violations in the chat', async ({ page }) => {
    await takeOver(page);
    await expect(page.getByRole('button', { name: 'Show the projects' })).toBeVisible({ timeout: 10_000 });
    const results = await new AxeBuilder({ page }).include('[data-relic-chat]').analyze();
    expect(results.violations).toEqual([]);
  });

  test('the exit clears the chat', async ({ page }) => {
    await takeOver(page);
    await expect(messages(page)).not.toHaveCount(0, { timeout: 6000 });
    await page.locator('[data-relic-eject]').click();
    await expect(chat(page)).toBeHidden({ timeout: 3000 });
    await expect(messages(page)).toHaveCount(0);
  });
});

test.describe('on a phone', () => {
  test.use({ reducedMotion: 'no-preference', viewport: { width: 390, height: 844 } });

  test('the chat starts folded, fits the screen and stays clear of the button to the top', async ({ page }) => {
    await takeOver(page);
    await expect(chat(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-relic-chat-badge]')).not.toBeHidden({ timeout: 10_000 });
    const box = (await chat(page).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    const top = page.locator('button[aria-label*="top" i]').first();
    if (await top.isVisible()) {
      const other = (await top.boundingBox())!;
      const overlap =
        box.x < other.x + other.width &&
        box.x + box.width > other.x &&
        box.y < other.y + other.height &&
        box.y + box.height > other.y;
      expect(overlap).toBe(false);
    }
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

  test('the messages still come, without the long typing', async ({ page }) => {
    await takeOver(page);
    await expect(messages(page)).toHaveCount(3, { timeout: 4000 });
  });
});
