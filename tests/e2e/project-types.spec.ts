import { expect, test, type Page } from '@playwright/test';

const card = (page: Page) => page.locator('#approach article').nth(1);
const group = (page: Page) => page.getByRole('radiogroup', { name: 'Project type' });
const panel = (page: Page, type: string) => card(page).locator(`[data-type="${type}"]`);

test('shows the landing panel by default', async ({ page }) => {
  await page.goto('/');
  await expect(group(page).getByRole('radio', { name: 'Landing' })).toBeChecked();
  await expect(panel(page, 'landing')).toBeVisible();
  await expect(panel(page, 'landing')).toContainText('Astro');
  await expect(panel(page, 'landing')).toContainText('Launch');
  await expect(panel(page, 'store')).toBeHidden();
  await expect(panel(page, 'service')).toBeHidden();
});

test('switching changes the stack and the stages', async ({ page }) => {
  await page.goto('/');
  await group(page).getByText('Store').click();
  await expect(panel(page, 'store')).toBeVisible();
  await expect(panel(page, 'store')).toContainText('Next.js');
  await expect(panel(page, 'store')).toContainText('Payment');
  await expect(panel(page, 'landing')).toBeHidden();

  await group(page).getByText('Service').click();
  await expect(panel(page, 'service')).toContainText('TanStack Query');
  await expect(panel(page, 'service')).toContainText('Tests');
});

test('arrow keys move inside the group', async ({ page }) => {
  await page.goto('/');
  await group(page).getByRole('radio', { name: 'Landing' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(group(page).getByRole('radio', { name: 'Store' })).toBeChecked();
  await expect(panel(page, 'store')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(panel(page, 'service')).toBeVisible();
});

test('the card does not change its height when switching', async ({ page }) => {
  await page.goto('/');
  const height = () => card(page).evaluate(element => element.getBoundingClientRect().height);
  const before = await height();
  for (const name of ['Store', 'Service', 'Landing']) {
    await group(page).getByText(name).click();
    expect(await height()).toBe(before);
  }
});

test.describe('without JavaScript', () => {
  test('the switcher still works', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4399/');
    await expect(panel(page, 'landing')).toBeVisible();
    await group(page).getByText('Service').click();
    await expect(panel(page, 'service')).toBeVisible();
    await expect(panel(page, 'landing')).toBeHidden();
    await context.close();
  });
});

test.describe('motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the stages appear one after another when a type is picked', async ({ page }) => {
    await page.goto('/');
    await group(page).getByText('Store').click();
    const stages = panel(page, 'store').locator('ol li');
    const first = () => stages.first().evaluate(item => Number(getComputedStyle(item).opacity));
    const last = () => stages.last().evaluate(item => Number(getComputedStyle(item).opacity));
    await expect.poll(first, { timeout: 2000 }).toBe(1);
    await expect.poll(last, { timeout: 2000 }).toBe(1);
  });
});

test('with reduced motion the new panel is in its final state at once', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await group(page).getByText('Store').click();
  const opacity = await panel(page, 'store')
    .locator('ol li')
    .last()
    .evaluate(item => getComputedStyle(item).opacity);
  expect(opacity).toBe('1');
  await context.close();
});
