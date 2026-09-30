import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const open = async (page: import('@playwright/test').Page, path = '/') => {
  await page.goto(path);
  await page.locator('#about h1').waitFor();
  // The shortcut listener is attached by a module script: wait until it answers.
  await expect(async () => {
    await page.keyboard.press('Control+k');
    await expect(page.locator('#command-palette')).toHaveAttribute('open', '', { timeout: 500 });
  }).toPass();
};

test.describe('command palette', () => {
  test('is not downloaded until it is opened', async ({ page }) => {
    const chunks: string[] = [];
    page.on('request', request => {
      if (/palette\.[\w-]+\.js/.test(request.url())) chunks.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(chunks).toHaveLength(0);

    await open(page);
    expect(chunks).toHaveLength(1);
  });

  test('is a combobox controlled from the keyboard, and gives focus back', async ({ page }) => {
    await page.goto('/');
    const combobox = page.getByRole('combobox');

    const trigger = page.getByRole('button', { name: 'Open command palette' }).first();
    await page.waitForFunction(() => document.querySelector('[data-palette-key]'));
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(combobox).toBeFocused();
    await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.type('gith');
    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.getByRole('option').first()).toContainText('GitHub');
    await expect(page.getByRole('option').first().locator('mark')).toHaveText('GitH');

    await page.keyboard.press('Escape');
    await expect(page.locator('#command-palette')).not.toHaveAttribute('open', '');
    // Focus goes back to the element the palette was opened from.
    await expect(trigger).toBeFocused();
  });

  test('arrow keys move the selection and wrap around', async ({ page }) => {
    await open(page);
    const options = page.getByRole('option');
    const count = await options.count();

    await page.keyboard.press('ArrowDown');
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(options.nth(count - 1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('combobox')).toHaveAttribute('aria-activedescendant', `palette-option-${count - 1}`);
  });

  test('a navigation command scrolls to the section', async ({ page }) => {
    await open(page);
    await page.keyboard.type('skills');
    await page.keyboard.press('Enter');

    await expect(page.locator('#command-palette')).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(/#skills$/);
    await expect(page.locator('#skills')).toBeInViewport();
  });

  test('theme and language commands work', async ({ page }) => {
    await open(page);
    await page.keyboard.type('dark');
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await open(page);
    await page.keyboard.type('русский');
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('ru');
    await page.getByRole('option').filter({ hasText: 'Russian' }).click();
    await expect(page).toHaveURL(/\/ru\/$/);
  });

  test('remembers the last commands for the session', async ({ page }) => {
    await open(page);
    await page.keyboard.type('light');
    await page.keyboard.press('Enter');

    await open(page);
    await expect(page.locator('[data-heading]').first()).toHaveText('Recent');
    await expect(page.getByRole('option').first()).toContainText('Light theme');
  });

  test('shows an empty state', async ({ page }) => {
    await open(page);
    await page.keyboard.type('zzzzqq');
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.locator('[data-empty]')).toBeVisible();
  });

  test('ignores the shortcut while typing in a field', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const field = document.createElement('input');
      field.id = 'probe';
      document.body.prepend(field);
      field.focus();
    });
    await page.locator('#about h1').waitFor();
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    await expect(page.locator('#command-palette')).not.toHaveAttribute('open', '');
  });

  test('is opened from the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('button[aria-controls="main-navigation"]').click();
    await expect(page.locator('#main-navigation')).toBeVisible();
    await page.locator('#main-navigation [data-palette-open]').click();

    await expect(page.locator('#command-palette')).toHaveAttribute('open', '');
    await expect(page.getByRole('combobox')).toBeFocused();
  });

  test('has no accessibility violations while open', async ({ page }) => {
    for (const path of ['/', '/ru/', '/uz/']) {
      await open(page, path);
      const results = await new AxeBuilder({ page })
        .include('#command-palette')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});
