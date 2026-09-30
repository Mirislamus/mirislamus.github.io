import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const openTerminal = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#about h1').waitFor();
  // The key listener is attached by a module script: wait until it answers.
  await expect(async () => {
    await page.keyboard.press('Backquote');
    await expect(page.locator('#terminal')).toHaveAttribute('open', '', { timeout: 500 });
  }).toPass();
};

const run = async (page: Page, command: string) => {
  await page.keyboard.type(command);
  await page.keyboard.press('Enter');
};

test.describe('terminal', () => {
  test('is not downloaded until it is opened', async ({ page }) => {
    const chunks: string[] = [];
    page.on('request', request => {
      if (/terminal\.[\w-]+\.js/.test(request.url())) chunks.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(chunks).toHaveLength(0);

    await openTerminal(page);
    expect(chunks).toHaveLength(1);
  });

  test('opens with the backquote key, runs commands and closes with Escape', async ({ page }) => {
    await openTerminal(page);
    const input = page.getByRole('textbox', { name: 'Terminal' });
    const log = page.getByRole('log');

    await expect(input).toBeFocused();
    await expect(log).toContainText('Type "help"');

    await run(page, 'projects');
    await expect(log).toContainText('Dafna  https://dafna.uz');

    await run(page, 'theme dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(log).toContainText('theme: dark');

    await page.keyboard.press('Escape');
    await expect(page.locator('#terminal')).not.toHaveAttribute('open', '');
  });

  test('completes with Tab, walks the history and suggests a command', async ({ page }) => {
    await openTerminal(page);
    const input = page.getByRole('textbox', { name: 'Terminal' });

    await page.keyboard.type('exper');
    await page.keyboard.press('Tab');
    await expect(input).toHaveValue('experience ');
    await page.keyboard.press('Enter');

    await run(page, 'projcts');
    await expect(page.getByRole('log')).toContainText('Did you mean "projects"?');

    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveValue('projcts');
    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveValue('experience');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveValue('');
  });

  test('clear empties the screen; goto scrolls and closes', async ({ page }) => {
    await openTerminal(page);
    await run(page, 'help');
    await expect(page.getByRole('log')).toContainText('Available commands');

    await run(page, 'clear');
    await expect(page.getByRole('log').locator('p')).toHaveCount(0);

    await run(page, 'goto skills');
    await expect(page.locator('#terminal')).not.toHaveAttribute('open', '');
    await expect(page).toHaveURL(/#skills$/);
  });

  test('sudo hire-me copies the email', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openTerminal(page);
    await run(page, 'sudo hire-me');

    await expect(page.getByRole('log')).toContainText('Permission granted');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('mirislamus@gmail.com');
  });

  test('speaks the language of the page', async ({ page }) => {
    await openTerminal(page, '/ru/');
    await run(page, 'help');
    await expect(page.getByRole('log')).toContainText('Доступные команды');
  });

  test('is opened from the command palette', async ({ page }) => {
    await page.goto('/');
    await page.locator('#about h1').waitFor();
    await expect(async () => {
      await page.keyboard.press('Control+k');
      await expect(page.locator('#command-palette')).toHaveAttribute('open', '', { timeout: 500 });
    }).toPass();
    await page.keyboard.type('terminal');
    await page.keyboard.press('Enter');

    await expect(page.locator('#terminal')).toHaveAttribute('open', '');
    await expect(page.getByRole('textbox', { name: 'Terminal' })).toBeFocused();
  });

  test('ignores the backquote key while typing in a field', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const field = document.createElement('input');
      document.body.prepend(field);
      field.focus();
    });
    await page.locator('#about h1').waitFor();
    await page.keyboard.type('`');
    await page.waitForTimeout(300);
    await expect(page.locator('#terminal')).not.toHaveAttribute('open', '');
  });

  test('has no accessibility violations while open', async ({ page }) => {
    for (const path of ['/', '/ru/', '/uz/']) {
      await openTerminal(page, path);
      await run(page, 'help');
      const results = await new AxeBuilder({ page })
        .include('#terminal')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});
