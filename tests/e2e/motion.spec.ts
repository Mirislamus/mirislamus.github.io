import { expect, test, type Page } from '@playwright/test';

// The browser serializes custom property values in its own way (".15s", "cubic-bezier(.16,1,.3,1)").
const ms = (page: Page, name: string) =>
  page.evaluate(property => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    const match = /^(\d*\.?\d+)(ms|s)$/.exec(value);
    return match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : NaN;
  }, name);

test('motion tokens have their design values', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  expect(await ms(page, '--dur-fast')).toBe(150);
  expect(await ms(page, '--dur-base')).toBe(250);
  expect(await ms(page, '--dur-slow')).toBe(400);
  expect(await ms(page, '--dur-intro')).toBe(800);
  expect(await ms(page, '--stagger')).toBe(60);
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ease-out').replace(/\s/g, '')
    )
  ).toBe('cubic-bezier(.16,1,.3,1)');
});

test('reduced motion turns every token duration into zero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  for (const name of ['--dur-fast', '--dur-base', '--dur-slow', '--dur-intro', '--dur-ripple', '--stagger']) {
    expect(await ms(page, name)).toBe(0);
  }
});

test('components transition with the token durations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const button = page.getByRole('link', { name: 'Discuss a project' });

  expect(await button.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0.25s');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await button.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});
