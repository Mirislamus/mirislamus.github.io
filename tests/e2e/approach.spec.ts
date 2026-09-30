import { expect, test } from '@playwright/test';

const EMAIL = 'mirislamus@gmail.com';

test.describe('copy email', () => {
  test('copies with the Clipboard API, announces it and keeps focus on the button', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    const button = page.getByRole('button', { name: 'Copy email address' });
    await button.focus();
    await button.press('Enter');

    const region = page.getByRole('status');
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

    await expect(page.getByRole('status')).toContainText('Email copied');
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
    await expect(page.getByRole('status')).toContainText("Couldn't copy the email");
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

test.describe('code preview', () => {
  test('is in the initial HTML and only the current theme variant is visible', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const images = page.locator('#approach img[width="510"]');
    await expect(images).toHaveCount(2);
    const visible = await images.evaluateAll(all => all.filter(image => image.getClientRects().length > 0).length);
    expect(visible).toBe(1);

    await page.getByRole('button', { name: 'Light theme' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const src = await page.locator('#approach img[width="510"]:visible').getAttribute('src');
    expect(src).toContain('light');
  });

  test('works without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4399/');
    const visible = await page
      .locator('#approach img[width="510"]')
      .evaluateAll(all =>
        all.filter(image => image.getClientRects().length > 0).map(image => image.getAttribute('src'))
      );
    expect(visible).toHaveLength(1);
    expect(visible[0]).toContain('dark');
    await context.close();
  });
});
