import { expect, test, type Page } from '@playwright/test';

const card = (page: Page, index = 0) => page.locator('#projects article').nth(index);
const name = (page: Page, index = 0) => card(page, index).locator('[data-name]');

// The effect lives in a chunk that loads when the list is near: bring the first card into view and wait for the listeners.
const open = async (page: Page) => {
  await page.goto('/');
  await card(page).scrollIntoViewIfNeeded();
  await expect(page.locator('#projects projects-list')).toHaveAttribute('data-names', 'ready');
};

test('there is no filter: no chips, no counter, but "Show more" is still there', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#projects [data-filter]')).toHaveCount(0);
  await expect(page.locator('#projects [data-count]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Show more' })).toBeVisible();
});

test('the screenshot is drawn open by a curtain as the card comes into view', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const names = await page.evaluate(() => {
    const picture = document.querySelector('#projects article picture')!;
    const image = picture.querySelector('img')!;
    return [getComputedStyle(picture).animationName, getComputedStyle(image).animationName];
  });
  // Browsers without scroll-driven animations just show the picture.
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  if (supported) {
    expect(names[0]).toContain('curtain');
    expect(names[1]).toContain('settle');
  }
  await context.close();
});

test.describe('the name decrypts', () => {
  test.use({ reducedMotion: 'no-preference' });

  // The effect is short: what the name looked like is recorded in the page, not polled.
  const record = (page: Page) =>
    name(page).evaluate(element => {
      const seen: { text: string; width: number }[] = [];
      new MutationObserver(() =>
        seen.push({ text: (element.textContent ?? '').trim(), width: (element as HTMLElement).offsetWidth })
      ).observe(element, { childList: true, characterData: true, subtree: true });
      (window as unknown as { seen: typeof seen }).seen = seen;
    });
  const recorded = (page: Page) =>
    page.evaluate(() => (window as unknown as { seen: { text: string; width: number }[] }).seen);

  test('under the mouse: other characters for a moment, then the same name, the width never changes', async ({
    page,
  }) => {
    await open(page);
    const link = card(page).getByRole('link');
    const before = await name(page).evaluate(element => (element as HTMLElement).offsetWidth);
    await record(page);

    await card(page).hover();
    await expect.poll(async () => (await recorded(page)).at(-1)?.text, { timeout: 4000 }).toBe('Dafna');
    const seen = await recorded(page);
    expect(seen.some(step => step.text !== 'Dafna')).toBe(true);
    for (const step of seen) expect(Math.abs(step.width - before)).toBeLessThan(1);
    // The name of the link is the real one all the time.
    await expect(link).toHaveAccessibleName('Dafna');
    expect(await name(page).evaluate(element => element.style.inlineSize)).toBe('');
  });

  test('also on keyboard focus', async ({ page }) => {
    await open(page);
    await record(page);
    await page.keyboard.press('Tab'); // some earlier link; walk to the card by focusing it
    await card(page).getByRole('link').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect.poll(async () => (await recorded(page)).length, { timeout: 4000 }).toBeGreaterThan(2);
    await expect.poll(async () => (await recorded(page)).at(-1)?.text, { timeout: 4000 }).toBe('Dafna');
  });

  test('the letters are hidden from assistive technology', async ({ page }) => {
    await page.goto('/');
    await expect(name(page)).toHaveAttribute('aria-hidden', 'true');
    await expect(card(page).getByRole('link')).toHaveAttribute('aria-label', 'Dafna');
  });
});

test('with reduced motion the name never changes', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page);
  await card(page).hover();
  await page.waitForTimeout(300);
  await expect(name(page)).toHaveText('Dafna');
  await context.close();
});

test('a touch does not decrypt', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference', hasTouch: true });
  const page = await context.newPage();
  await open(page);
  await card(page).dispatchEvent('pointerover', { pointerType: 'touch', bubbles: true });
  await page.waitForTimeout(200);
  await expect(name(page)).toHaveText('Dafna');
  await context.close();
});
