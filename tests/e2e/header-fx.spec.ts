import { expect, test, type Page } from '@playwright/test';

const scrollTo = (page: Page, id: string) =>
  page.evaluate(target => document.getElementById(target)?.scrollIntoView(), id);
const hidden = (page: Page) =>
  page
    .locator('header')
    .first()
    .evaluate(element => element.hasAttribute('data-hidden'));

test.describe('sliding pill', () => {
  test('sits behind the active link, has round ends and appears without sliding in', async ({ page }) => {
    await page.goto('/#projects');
    const line = page.locator('[data-line]');
    await expect(line).toHaveAttribute('data-ready', '');

    const info = await line.evaluate(element => {
      const style = getComputedStyle(element);
      const before = getComputedStyle(element, '::before');
      return {
        background: style.backgroundColor,
        opacity: style.opacity,
        capWidth: before.width,
        capRadius: before.borderRadius,
      };
    });
    expect(info.background).not.toBe('rgba(0, 0, 0, 0)');
    expect(info.opacity).toBe('1');
    expect(info.capWidth).toBe('36px');
    expect(info.capRadius).toBe('50%');
  });

  test('follows the active section and stays as wide as the link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-line]')).toHaveAttribute('data-ready', '');

    const geometry = () =>
      page.evaluate(() => {
        const link = document.querySelector<HTMLElement>('[data-link][aria-current="true"]')!.getBoundingClientRect();
        const line = document.querySelector<HTMLElement>('[data-line]')!;
        const before = line.getBoundingClientRect();
        const caps = 36; // both round ends, in px
        return {
          href: document.querySelector('[data-link][aria-current="true"]')!.getAttribute('href'),
          center: before.left + before.width / 2,
          linkCenter: link.left + link.width / 2,
          width: before.width + caps,
          linkWidth: link.width,
        };
      });

    for (const section of ['about', 'career', 'skills']) {
      await scrollTo(page, section);
      await expect(page.locator(`[data-link][aria-current="true"][href="#${section}"]`)).toHaveCount(1);
      await page.waitForTimeout(400);
      const g = await geometry();
      expect(Math.abs(g.center - g.linkCenter)).toBeLessThan(2);
      expect(Math.abs(g.width - (g.linkWidth + 16))).toBeLessThan(2);
    }
  });
});

test.describe('smart hide', () => {
  test('hides while scrolling down, returns on any upward scroll, never near the top', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(900); // the bar ignores scrolling right after the page loads
    await page.mouse.wheel(0, 60);
    await page.waitForTimeout(150);
    expect(await hidden(page)).toBe(false);

    await page.mouse.wheel(0, 900);
    await expect.poll(() => hidden(page)).toBe(true);
    await expect
      .poll(() =>
        page
          .locator('header')
          .first()
          .evaluate(element => element.getBoundingClientRect().bottom)
      )
      .toBeLessThanOrEqual(0);

    await page.mouse.wheel(0, -20);
    await expect.poll(() => hidden(page)).toBe(false);

    await page.mouse.wheel(0, 600);
    await expect.poll(() => hidden(page)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => hidden(page)).toBe(false);
  });

  test('stays visible while a header control has keyboard focus or the language list is open', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(900); // the bar ignores scrolling right after the page loads
    await page.mouse.wheel(0, 900);
    await expect.poll(() => hidden(page)).toBe(true);

    await page.locator('[data-link]').first().focus();
    await expect.poll(() => hidden(page)).toBe(false);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(200);
    expect(await hidden(page)).toBe(false);
  });

  test('does not hide on a deep link', async ({ page }) => {
    await page.goto('/#projects');
    await page.waitForTimeout(500);
    expect(await hidden(page)).toBe(false);
  });
});

test.describe('mobile drawer', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('slides in from the right at full height over a blurred page', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#main-navigation');

    // Fixed elements end where the viewport ends (a classic scrollbar gutter is not part of it).
    const edge = await page.locator('[data-overlay]').evaluate(element => element.getBoundingClientRect().right);
    const closed = await nav.evaluate(element => element.getBoundingClientRect().left);
    expect(closed).toBeGreaterThanOrEqual(edge);

    await page.locator('[data-menu-button]').click();
    await expect(nav).toBeVisible();
    const open = await nav.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, height: rect.height };
    });
    expect(open.right).toBe(edge);
    expect(open.top).toBe(0);
    expect(open.height).toBe(844);
    expect(edge - open.left).toBeLessThanOrEqual(360);

    const blur = await page.locator('[data-overlay]').evaluate(element => getComputedStyle(element).backdropFilter);
    expect(blur).toContain('blur(8px)');
  });

  test('only the close button stays in the top right corner while it is open', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-menu-button]').click();
    await expect(page.locator('[data-langs-button]')).toBeHidden();
    await expect(page.locator('[data-menu-button]')).toBeVisible();
    await page.locator('[data-menu-button]').click();
    await expect(page.locator('#main-navigation')).toBeHidden();
    await expect(page.locator('[data-langs-button]')).toBeVisible();
  });
});

test.describe('reading progress line', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('grows with the scroll position', async ({ page }) => {
    await page.goto('/#about');
    const supported = await page.evaluate(() => CSS.supports('animation-timeline: scroll()'));
    test.skip(!supported, 'scroll timelines are not supported in this browser');

    const scale = () =>
      page.locator('[data-progress]').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a);

    expect(await scale()).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }));
    await expect.poll(scale).toBeGreaterThan(0.3);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect.poll(scale).toBeGreaterThan(0.95);
  });
});

test.describe('reading progress with reduced motion', () => {
  test('is not shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-progress]')).toBeHidden();
  });
});

test.describe('back to top', () => {
  test('appears after the first screen, shows progress and returns to the top with focus on the logo', async ({
    page,
  }) => {
    await page.goto('/');
    const wrapper = page.locator('back-to-top');
    const button = wrapper.getByRole('button', { name: 'Back to top' });

    await expect(button).toBeHidden();
    await scrollTo(page, 'skills');
    await expect(button).toBeVisible();

    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('[data-logo]')).toBeFocused();
    await expect(button).toBeHidden();
  });

  test('has a localized name', async ({ page }) => {
    await page.goto('/ru/');
    await scrollTo(page, 'skills');
    await expect(page.locator('back-to-top').getByRole('button', { name: 'Наверх' })).toBeVisible();
  });

  test.describe('with motion', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('the ring fills as the page scrolls', async ({ page }) => {
      await page.goto('/#about');
      const supported = await page.evaluate(() => CSS.supports('animation-timeline: scroll()'));
      test.skip(!supported, 'scroll timelines are not supported in this browser');

      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      const offset = () =>
        page
          .locator('back-to-top circle')
          .last()
          .evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset));
      await expect.poll(offset).toBeLessThan(0.05);
    });
  });
});
