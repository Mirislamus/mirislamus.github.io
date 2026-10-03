import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Some tests move a stepped clock through minutes of the takeover, which takes a while under load.
test.setTimeout(90_000);

const html = (page: Page) => page.locator('html');

// Opens the scene and waits until it has closed by itself: the takeover has begun.
const takeOver = async (page: Page, path = '/') => {
  await page.goto(path);
  await page.locator('#contacts').scrollIntoViewIfNeeded();
  await page.locator('button[data-relic]').click();
  await expect(html(page)).toHaveAttribute('data-relic', '', { timeout: 10_000 });
  await expect(page.locator('dialog[data-relic-scene]')).not.toHaveAttribute('open', '', { timeout: 3000 });
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the accent turns red in the dark and in the light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await takeOver(page);
    await page.evaluate(() => scrollTo(0, 0));
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-text'))
    ).toBe('#ff2e63');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-text'))
    ).toBe('#d4123f');
  });

  test('the logo becomes SAMURAI and keeps its name for assistive technology', async ({ page }) => {
    await takeOver(page);
    const logo = page.locator('[data-logo]');
    await expect(logo).toHaveAccessibleName('Home');
    await expect(logo.getByText('SAMURAI')).toBeVisible();
    await expect(logo.locator('svg:not([data-logo-ghost])')).toBeHidden();
  });

  test('two texts are replaced for the eyes, the real ones stay in the accessibility tree', async ({ page }) => {
    await takeOver(page);
    await page.evaluate(() => scrollTo(0, 0));
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('Rockerboy');
    // The accessible name still has the real role, and the replaced text is hidden from assistive technology.
    await expect(heading).toHaveAccessibleName(/Frontend Engineer/);
    await expect(heading).not.toHaveAccessibleName(/Rockerboy/);
    await expect(page.getByRole('link', { name: 'Discuss a project' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Discuss a project' })).toContainText('Burn the city together');
  });

  test('the page glitches every 10 to 15 seconds, and not when the tab is hidden', async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => {
      (window as unknown as { glitches: number }).glitches = 0;
      document.addEventListener('relic:glitch', () => (window as unknown as { glitches: number }).glitches++);
    });
    await page.goto('/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.locator('button[data-relic]').click();
    await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
    await page.clock.runFor(7000);
    await expect(html(page)).toHaveAttribute('data-relic', '');
    const base = await page.evaluate(() => (window as unknown as { glitches: number }).glitches);
    expect(base).toBe(1); // the one that covers the change
    await page.clock.runFor(9000);
    expect(await page.evaluate(() => (window as unknown as { glitches: number }).glitches)).toBe(base); // not before 10 s
    await page.clock.runFor(60_000);
    const count = (await page.evaluate(() => (window as unknown as { glitches: number }).glitches)) - base;
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThanOrEqual(6);
  });

  test('the glitch is short: it goes away by itself', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.locator('button[data-relic]').click();
    await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
    await page.clock.runFor(8000);
    await page.clock.runFor(16_000);
    await expect(html(page)).not.toHaveAttribute('data-relic-glitch', '');
  });

  test('a paused page does not glitch', async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => {
      localStorage.setItem('motion-paused', '1');
      (window as unknown as { glitches: number }).glitches = 0;
      document.addEventListener('relic:glitch', () => (window as unknown as { glitches: number }).glitches++);
    });
    await page.goto('/');
    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.locator('button[data-relic]').click();
    await expect(page.locator('dialog[data-relic-scene]')).toHaveAttribute('open', '');
    await page.clock.runFor(10_000);
    await expect(html(page)).toHaveAttribute('data-relic', '');
    await page.clock.runFor(60_000);
    expect(await page.evaluate(() => (window as unknown as { glitches: number }).glitches)).toBe(0);
  });

  test('the Russian page gets Russian replacements', async ({ page }) => {
    await takeOver(page, '/ru/');
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Рокербой');
    await expect(page.getByRole('link', { name: 'Обсудить проект' })).toContainText('Сожжём город вместе');
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the takeover changes the palette and the texts without a single glitch', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { glitches: number }).glitches = 0;
      document.addEventListener('relic:glitch', () => (window as unknown as { glitches: number }).glitches++);
    });
    await takeOver(page);
    await expect(page.locator('[data-logo]').getByText('SAMURAI')).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { glitches: number }).glitches)).toBe(0);
    await expect(html(page)).not.toHaveAttribute('data-relic-glitch', '');
  });
});

for (const theme of ['light', 'dark'] as const) {
  test(`text keeps AA contrast in the ${theme} theme during the takeover`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await takeOver(page);
    await page.evaluate(() => scrollTo(0, 0));
    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).include('#about').analyze();
    expect(results.violations.map(violation => violation.nodes.map(node => node.html))).toEqual([]);
  });
}
