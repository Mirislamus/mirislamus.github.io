import { expect, test, type Page } from '@playwright/test';

const tile = (page: Page, name: string) => page.locator(`#skills a[aria-label="${name}"]`);
const tip = (page: Page, name: string) => tile(page, name).locator('[role="tooltip"]');

test.describe('with a mouse', () => {
  test('the tooltip of a tool lists the projects where it is used', async ({ page }) => {
    await page.goto('/');
    await tile(page, 'React').scrollIntoViewIfNeeded();
    await expect(tip(page, 'React')).toHaveCSS('opacity', '0');

    await tile(page, 'React').hover();
    await expect(tip(page, 'React')).toHaveCSS('opacity', '1');
    await expect(tip(page, 'React')).toHaveText('In 4 projects: Dafna, Pomotomo Focus Timer, +2');
  });

  test('one or two projects are only named, three and more get a number', async ({ page }) => {
    await page.goto('/');
    await expect(tip(page, 'Next.js')).toHaveText('In 1 project: Dafna');
    await expect(tip(page, 'Astro')).toHaveText('In 1 project: Prowatt');
    await expect(tip(page, 'GSAP')).toHaveText('In 3 projects: Humandone, Caldera, +1');
    await expect(tip(page, 'Sass')).toHaveText('In 2 projects: Age Computers, Easy English School');
  });

  test('a tool that no project uses has no tooltip at all', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Claude Code', 'Codex', 'Lottie', 'Playwright']) {
      await expect(tip(page, name)).toHaveCount(0);
      await expect(tile(page, name)).not.toHaveAttribute('aria-describedby', /.*/);
    }
  });

  test('is tied to its tile for assistive technology', async ({ page }) => {
    await page.goto('/');
    const id = await tile(page, 'React').getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    await expect(page.locator(`#${id}`)).toHaveAttribute('role', 'tooltip');
    await expect(tile(page, 'React')).toHaveAccessibleName('React');
    await expect(tile(page, 'React')).toHaveAccessibleDescription('In 4 projects: Dafna, Pomotomo Focus Timer, +2');
  });

  test('is shown for the keyboard too', async ({ page }) => {
    await page.goto('/');
    await tile(page, 'React').scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    await tile(page, 'React').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(tile(page, 'React')).toBeFocused();
    await expect(tip(page, 'React')).toHaveCSS('opacity', '1');
  });

  test('the texts follow the language', async ({ page }) => {
    await page.goto('/ru/');
    await expect(tip(page, 'React')).toHaveText('В 4 проектах: Dafna, Pomotomo Focus Timer, +2');
    await expect(tip(page, 'Next.js')).toHaveText('В 1 проекте: Dafna');
    await page.goto('/uz/');
    await expect(tip(page, 'React')).toHaveText('4 ta loyihada: Dafna, Pomotomo Focus Timer, +2');
  });

  test('the names are the ones in the portfolio', async ({ page }) => {
    await page.goto('/');
    const names = await page
      .locator('#projects article h3 a')
      .evaluateAll(all => all.map(a => a.getAttribute('aria-label')));
    for (const name of ['Dafna', 'Pomotomo Focus Timer', 'Humandone', 'Caldera']) expect(names).toContain(name);
  });
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('the first tap shows the tooltip and does not leave the page, the second one opens the link', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    await tile(page, 'React').scrollIntoViewIfNeeded();

    const popups: string[] = [];
    context.on('page', opened => popups.push(opened.url()));

    await tile(page, 'React').tap();
    await expect(tile(page, 'React')).toHaveAttribute('data-open', '');
    await expect(tip(page, 'React')).toHaveCSS('opacity', '1');
    await page.waitForTimeout(400);
    expect(popups).toEqual([]);

    const popup = context.waitForEvent('page');
    await tile(page, 'React').tap();
    await popup;
    expect(popups.length).toBe(1);
  });

  test('a tool without a tooltip opens at once', async ({ page, context }) => {
    await page.goto('/');
    await tile(page, 'Codex').scrollIntoViewIfNeeded();
    const popup = context.waitForEvent('page');
    await tile(page, 'Codex').tap();
    await popup;
  });

  test('a tap elsewhere closes the tooltip', async ({ page }) => {
    await page.goto('/');
    await tile(page, 'React').scrollIntoViewIfNeeded();
    await tile(page, 'React').tap();
    await expect(tile(page, 'React')).toHaveAttribute('data-open', '');
    await page.locator('#skills h2').tap();
    await expect(tile(page, 'React')).not.toHaveAttribute('data-open', /.*/);
  });
});
