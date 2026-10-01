import { expect, test, type Page } from '@playwright/test';

const career = (page: Page) => page.locator('#career');

// Brings the section to 300 px below the fold, waits until the reveal is set up, then scrolls it into view.
const scrollTowards = async (page: Page) => {
  await page.goto('/');
  const top = await page.evaluate(() => document.querySelector('#career')!.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => scrollTo(0, y - innerHeight - 300), top);
  await expect(career(page)).toHaveAttribute('data-career-reveal', 'pending');
  return top;
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('draws the line, lights the dots and shows the text, once', async ({ page }) => {
    const top = await scrollTowards(page);
    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(career(page)).toHaveAttribute('data-career-reveal', 'playing');
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/, { timeout: 8000 });

    // The final look is the natural one: everything visible, the dots in the accent color.
    await expect(page.locator('[data-career-name]').first()).toBeVisible();
    const state = await page.evaluate(() => ({
      text: getComputedStyle(document.querySelector('[data-career-text]')!).opacity,
      dot: getComputedStyle(document.querySelector('[data-career-circle]')!).borderTopColor,
      line: getComputedStyle(document.querySelector('[data-embla-container]')!, '::after').transform,
    }));
    expect(state.text).toBe('1');
    expect(state.dot).not.toBe('rgba(0, 0, 0, 0)');
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(state.line);

    // Back and forth: it does not play again.
    await page.evaluate(y => scrollTo(0, y - 2000), top);
    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/);
  });

  test('the first frames are hidden, so nothing flashes in before it plays', async ({ page }) => {
    await scrollTowards(page);
    const hidden = await page.evaluate(() => ({
      text: getComputedStyle(document.querySelector('[data-career-text]')!).opacity,
      line: getComputedStyle(document.querySelector('[data-embla-container]')!, '::after').transform,
    }));
    expect(hidden.text).toBe('0');
    expect(hidden.line).toMatch(/matrix\(0,/);
  });

  test('a click on an arrow ends the scene at once', async ({ page }) => {
    const top = await scrollTowards(page);
    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(career(page)).toHaveAttribute('data-career-reveal', 'playing');
    await page.locator('#career [data-embla-next]').click();
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/, { timeout: 1000 });
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('[data-career-text]')!).opacity)).toBe(
      '1'
    );
  });

  test('is skipped for a link to the section and while paused', async ({ page }) => {
    await page.goto('/#career');
    await page.waitForTimeout(800);
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/);

    await page.addInitScript(() => localStorage.setItem('motion-paused', '1'));
    await page.goto('/');
    const top = await page.evaluate(() => document.querySelector('#career')!.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => scrollTo(0, y - innerHeight - 300), top);
    await page.waitForTimeout(800);
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/);
  });

  test('the current place goes on as a dashed line into the future', async ({ page }) => {
    await page.goto('/#career');
    const dashed = await page.evaluate(() => {
      const style = getComputedStyle(document.querySelector('[data-current] [data-career-circle]')!, '::after');
      return { border: style.borderTopStyle, width: style.width };
    });
    expect(dashed.border).toBe('dashed');
    expect(parseFloat(dashed.width)).toBeGreaterThan(300);
    expect(await page.locator('[data-current]').count()).toBe(1);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('everything is in its final place and nothing is set up', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.querySelector('#career')!.scrollIntoView());
    await page.waitForTimeout(800);
    await expect(career(page)).not.toHaveAttribute('data-career-reveal', /.*/);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('[data-career-text]')!).opacity)).toBe(
      '1'
    );
  });
});

test('without JavaScript the section is complete', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('[data-career-name]').first()).toBeVisible();
  expect(await page.locator('[data-career-item]').count()).toBe(5);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('[data-career-text]')!).opacity)).toBe('1');
  await context.close();
});
