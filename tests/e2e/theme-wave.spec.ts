import { expect, test, type Page } from '@playwright/test';

// Counts calls of the View Transitions API so tests can tell whether the wave was used.
const spyOnTransitions = (page: Page) =>
  page.addInitScript(() => {
    const original = document.startViewTransition?.bind(document);
    (window as unknown as { transitions: number }).transitions = 0;
    if (original) {
      document.startViewTransition = ((callback: () => void) => {
        (window as unknown as { transitions: number }).transitions += 1;
        return original(callback);
      }) as typeof document.startViewTransition;
    }
  });

const transitions = (page: Page) => page.evaluate(() => (window as unknown as { transitions: number }).transitions);

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference', colorScheme: 'light' });

  test('the new theme spreads as a circle from the clicked button and cleans up', async ({ page }) => {
    test.skip(!(await page.evaluate(() => 'startViewTransition' in document)), 'View Transitions are not supported');
    await page.goto('/#about');
    await page.waitForFunction(() => customElements.get('site-header') !== undefined);

    const midWave = await page.evaluate(async () => {
      document.querySelector<HTMLElement>('[data-theme-mode="dark"]:not([aria-hidden])')?.click();
      await new Promise(resolve => setTimeout(resolve, 120));
      return {
        marked: document.documentElement.classList.contains('theme-transition'),
        clip: document
          .getAnimations()
          .some(
            animation => (animation.effect as KeyframeEffect | null)?.pseudoElement === '::view-transition-new(root)'
          ),
      };
    });
    expect(midWave).toEqual({ marked: true, clip: true });

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).not.toHaveClass(/theme-transition/);
  });

  test('choosing the theme that is already shown does not animate', async ({ page }) => {
    await spyOnTransitions(page);
    await page.goto('/');
    await page.waitForFunction(() => customElements.get('site-header') !== undefined);
    await page.locator('[data-theme-mode="light"]').first().dispatchEvent('click');
    expect(await transitions(page)).toBe(0);
  });

  test('the mobile menu buttons start the wave too', async ({ page }) => {
    await spyOnTransitions(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-menu-button]').click();
    await page.locator('#main-navigation').getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await transitions(page)).toBe(1);
  });

  test('without the View Transitions API the theme still changes at once', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, 'startViewTransition', { value: undefined });
    });
    await page.goto('/');
    await page.waitForFunction(() => customElements.get('site-header') !== undefined);
    await page.getByRole('button', { name: 'Dark theme' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('a system theme change does not use the wave', async ({ page }) => {
    await spyOnTransitions(page);
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await transitions(page)).toBe(0);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce', colorScheme: 'light' });

  test('the theme switches at once without a transition', async ({ page }) => {
    await spyOnTransitions(page);
    await page.goto('/');
    await page.waitForFunction(() => customElements.get('site-header') !== undefined);
    await page.getByRole('button', { name: 'Dark theme' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await transitions(page)).toBe(0);
  });
});
