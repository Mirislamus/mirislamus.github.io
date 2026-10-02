import { expect, test, type Page } from '@playwright/test';

const card = (page: Page) => page.locator('#approach article').nth(4);
const files = (page: Page) => card(page).locator('[data-file]');
const status = (page: Page) => card(page).getByRole('status');
const stored = (page: Page) => page.evaluate(() => JSON.stringify([{ ...localStorage }, { ...sessionStorage }]));
const meterScale = (page: Page, index = 0) =>
  card(page)
    .locator('[data-meter]')
    .nth(index)
    .evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a);

// The play lives in a chunk that loads when the card is near: bring it into view and wait for the listeners.
const open = async (page: Page, path = '/') => {
  await page.goto(path);
  await card(page).scrollIntoViewIfNeeded();
  await expect(page.locator('#approach secret-card')).toHaveAttribute('data-secret', 'ready');
};

test.describe('what is on the page', () => {
  test('the bars are only blocks: no project names or descriptions at all', async ({ page }) => {
    await page.goto('/');
    await expect(files(page)).toHaveCount(2);
    const redacted = await card(page).locator('[data-file] > div:nth-child(2)').allTextContents();
    for (const text of redacted) expect(text.replace(/\s/g, '')).toMatch(/^█+$/);

    // Apart from the bars there is only the code name and the percent of each file.
    const headers = await card(page).locator('[data-file] > div:first-child').allTextContents();
    expect(headers.map(text => text.replace(/\s+/g, ' ').trim())).toEqual(['PROJECT KS 70%', 'PROJECT IE 45%']);
  });

  test('a screen reader gets one sentence per file', async ({ page }) => {
    await page.goto('/');
    await expect(card(page).getByRole('group', { name: 'PROJECT KS: classified, 70% ready' })).toBeVisible();
    await expect(card(page).getByRole('group', { name: 'PROJECT IE: classified, 45% ready' })).toBeVisible();
    await expect(card(page).getByRole('button', { name: 'Enter' })).toBeVisible();
  });

  test('is translated', async ({ page }) => {
    await page.goto('/ru/');
    await expect(card(page)).toContainText('Совершенно секретно');
    await expect(card(page).getByRole('group', { name: 'PROJECT KS: засекречено, готово на 70 %' })).toBeVisible();
    await page.goto('/uz/');
    await expect(card(page)).toContainText('Mutlaqo maxfiy');
  });

  test('"I want an invite" leads to Telegram with a ready message', async ({ page }) => {
    await page.goto('/');
    const link = card(page).getByRole('link', { name: 'I want an invite' });
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.origin + url.pathname).toBe('https://t.me/mirislamus');
    expect(url.searchParams.get('text')).toBe('Hi! I want an invite to your new service.');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('the invite field', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('refuses any code, glitches once and sends nothing', async ({ page }) => {
    await open(page);
    const storedBefore = await stored(page);
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));

    await card(page).getByRole('textbox', { name: 'Invite code' }).fill('LET-ME-IN');
    await card(page).getByRole('button', { name: 'Enter' }).click();

    await expect(card(page)).toHaveAttribute('data-glitch', /.*/);
    await expect(status(page)).toHaveText('Access denied. Invites coming soon.');
    await expect(card(page)).not.toHaveAttribute('data-glitch', '', { timeout: 2000 });
    expect(requests, requests.join(', ')).toEqual([]);
    expect(page.url()).not.toContain('?');
    expect(await stored(page)).toEqual(storedBefore);
  });

  test('an empty field asks for a code', async ({ page }) => {
    await open(page);
    await card(page).getByRole('button', { name: 'Enter' }).click();
    await expect(status(page)).toHaveText('Enter a code');
    await expect(card(page)).not.toHaveAttribute('data-glitch', /.*/);
  });

  test('Enter in the field submits too', async ({ page }) => {
    await open(page);
    await card(page).getByRole('textbox', { name: 'Invite code' }).fill('abc');
    await page.keyboard.press('Enter');
    await expect(status(page)).toHaveText('Access denied. Invites coming soon.');
  });
});

test.describe('decrypting a bar', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('turns the blocks into glyphs under the mouse and covers them again', async ({ page }) => {
    await open(page);
    // Let the chunk load and the readiness bars finish.
    await expect.poll(() => meterScale(page), { timeout: 5000 }).toBeCloseTo(0.7, 1);

    const blocks = files(page).first().locator('[data-ch]');
    const count = await blocks.count();
    await files(page).first().hover();
    await expect(files(page).first().locator('[data-glyph]').first()).toBeAttached({ timeout: 1000 });
    // The width does not change while it plays.
    const widths = await blocks.evaluateAll(all => all.map(element => element.getBoundingClientRect().width));
    expect(new Set(widths.map(width => Math.round(width))).size).toBe(1);

    await expect(files(page).first().locator('[data-glyph]')).toHaveCount(0, { timeout: 3000 });
    const texts = await blocks.allTextContents();
    expect(texts).toHaveLength(count);
    expect(texts.every(text => text.trim() === '█')).toBe(true);
  });

  test('also on keyboard focus', async ({ page }) => {
    await open(page);
    await expect.poll(() => meterScale(page), { timeout: 5000 }).toBeCloseTo(0.7, 1);
    // Walk back from the link over the button and the field to the last file, so the focus is a keyboard one.
    await card(page).getByRole('link', { name: 'I want an invite' }).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(files(page).last()).toBeFocused();
    await expect(files(page).last().locator('[data-glyph]').first()).toBeAttached({ timeout: 1000 });
  });
});

test.describe('readiness bars', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('are empty until the card is seen, then fill once to the value', async ({ page }) => {
    await page.goto('/');
    const top = await card(page).evaluate(element => element.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => scrollTo(0, y - innerHeight - 150), top);
    await expect.poll(() => meterScale(page), { timeout: 5000 }).toBe(0);

    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect.poll(() => meterScale(page), { timeout: 5000 }).toBeCloseTo(0.7, 2);
    await expect.poll(() => meterScale(page, 1), { timeout: 5000 }).toBeCloseTo(0.45, 2);
  });
});

test.describe('when nothing should move', () => {
  test('with reduced motion: full bars, no decrypting, no glitch, the refusal at once', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await open(page);
    expect(await meterScale(page)).toBeCloseTo(0.7, 2);

    await files(page).first().hover();
    await page.waitForTimeout(300);
    await expect(files(page).first().locator('[data-glyph]')).toHaveCount(0);

    await card(page).getByRole('textbox', { name: 'Invite code' }).fill('x');
    await card(page).getByRole('button', { name: 'Enter' }).click();
    await expect(card(page)).not.toHaveAttribute('data-glitch', /.*/);
    await expect(status(page)).toHaveText('Access denied. Invites coming soon.');
    await context.close();
  });

  test('without JavaScript: bars are full, the form does nothing, the link works', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4399/');
    expect(await meterScale(page)).toBeCloseTo(0.7, 2);
    expect(await meterScale(page, 1)).toBeCloseTo(0.45, 2);
    await card(page).getByRole('textbox', { name: 'Invite code' }).fill('x');
    await card(page).getByRole('button', { name: 'Enter' }).click();
    await expect(page).toHaveURL(/#approach$/);
    await expect(card(page).getByRole('link', { name: 'I want an invite' })).toBeVisible();
    await context.close();
  });
});

test('the card fits at every width', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await card(page).evaluate(element => ({
      x: element.scrollWidth > element.clientWidth,
      children: [...element.querySelectorAll('secret-card *')].some(child => {
        const box = child.getBoundingClientRect();
        const outer = element.getBoundingClientRect();
        return box.width > 0 && (box.left < outer.left - 1 || box.right > outer.right + 1);
      }),
    }));
    expect(overflow, `at ${width}px`).toEqual({ x: false, children: false });
  }
});
