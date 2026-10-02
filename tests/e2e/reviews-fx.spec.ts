import { expect, test, type Page } from '@playwright/test';

const quotes = (page: Page) => page.locator('#reviews [data-quote]');

const open = async (page: Page) => {
  await page.goto('/');
  await expect(page.locator('#reviews'))
    .toHaveAttribute('data-quote-fx', 'ready', { timeout: 15000 })
    .catch(() => {});
};

test('every review has a decorative quotation mark that assistive technology does not see', async ({ page }) => {
  await page.goto('/');
  await expect(quotes(page)).toHaveCount(8);
  await expect(quotes(page).first()).toHaveAttribute('aria-hidden', 'true');
  await expect(quotes(page).first()).toHaveText('“');
});

test('the cards come in with a cascade driven by the scroll (no JavaScript)', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  if (supported) {
    const names = await page.evaluate(() =>
      [...document.querySelectorAll('#reviews article')].slice(0, 3).map(card => getComputedStyle(card).animationName)
    );
    for (const name of names) expect(name).toContain('reviews-in');
  }
  await context.close();
});

test.describe('the quotation mark decrypts once', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('other glyphs for half a second, then the mark again', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const mark = window as unknown as { marks: string[] };
      mark.marks = [];
      const quote = document.querySelector('#reviews [data-quote]')!;
      new MutationObserver(() => mark.marks.push(quote.textContent ?? '')).observe(quote, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
    await page.locator('#reviews').evaluate(element => element.scrollIntoView({ block: 'center' }));
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { marks: string[] }).marks.length), { timeout: 5000 })
      .toBeGreaterThan(2);
    await expect(quotes(page).first()).toHaveText('“', { timeout: 3000 });

    const marks = await page.evaluate(() => (window as unknown as { marks: string[] }).marks);
    expect(marks.slice(0, -1).some(glyph => glyph.trim() !== '“')).toBe(true);
    expect(marks.at(-1)?.trim()).toBe('“');
  });
});

test('with reduced motion the mark is never replaced', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page);
  await page.locator('#reviews').evaluate(element => element.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(900);
  await expect(quotes(page).first()).toHaveText('“');
  await context.close();
});
