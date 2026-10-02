import { expect, test } from '@playwright/test';

const EMAIL = 'mirislamus@gmail.com';

test.describe('copy email', () => {
  test('copies with the Clipboard API, announces it and keeps focus on the button', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    const button = page.getByRole('button', { name: 'Copy email address' });
    await button.focus();
    await button.press('Enter');

    const region = page.locator('#toast-region');
    await expect(region).toContainText('Email copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
    await expect(button).toBeFocused();
  });

  test('falls back to selection copy when the Clipboard API is denied', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new DOMException('denied', 'NotAllowedError')) },
      });
      (window as unknown as { copied: string }).copied = '';
      document.execCommand = (command: string) => {
        if (command !== 'copy') return false;
        (window as unknown as { copied: string }).copied = (document.activeElement as HTMLTextAreaElement).value;
        return true;
      };
    });
    await page.goto('/');

    const button = page.getByRole('button', { name: 'Copy email address' });
    await button.focus();
    await button.press('Enter');

    await expect(page.locator('#toast-region')).toContainText('Email copied');
    expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(EMAIL);
    await expect(button).toBeFocused();
  });

  test('shows an error when nothing can copy', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined });
      document.execCommand = () => false;
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Copy email address' }).click();
    await expect(page.locator('#toast-region')).toContainText("Couldn't copy the email");
  });

  test('shows one toast at a time', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Copy email address' });
    await button.click();
    await button.click();
    await expect(page.locator('#toast-region .toast')).toHaveCount(1);
  });
});

test.describe('card texts', () => {
  test('the first three cards have a statement and a line of facts under it', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#approach article');
    for (const index of [0, 1, 2]) {
      const card = cards.nth(index);
      await expect(card.locator('h3')).not.toBeEmpty();
      await expect(card.locator('h3 + p')).not.toBeEmpty();
    }
  });

  test('is translated and does not mention reviews', async ({ page }) => {
    await page.goto('/ru/');
    const section = page.locator('#approach');
    await expect(section).toContainText('Вы всегда знаете, что происходит с проектом');
    await expect(section).not.toContainText(/отзыв|review/i);
  });
});
