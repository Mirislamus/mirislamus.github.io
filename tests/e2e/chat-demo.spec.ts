import { expect, test, type Page } from '@playwright/test';

const chat = (page: Page) => page.locator('#approach chat-demo');
const opacities = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('#approach chat-demo [data-chat-list] > li')].map(item =>
      Number(getComputedStyle(item).opacity)
    )
  );

// Brings the card to 300 px below the fold, waits until the scene is set up, then scrolls it into view.
const scrollTowards = async (page: Page) => {
  await page.goto('/');
  const top = await page.evaluate(
    () => document.querySelector('#approach article')!.getBoundingClientRect().top + scrollY
  );
  await page.evaluate(y => scrollTo(0, y - innerHeight - 300), top);
  await expect(chat(page)).toHaveAttribute('data-chat', 'pending');
  return top;
};

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('hidden at first, the messages appear one after another and stay, once', async ({ page }) => {
    const top = await scrollTowards(page);
    expect(await opacities(page)).toEqual([0, 0, 0, 0, 0]);

    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(chat(page)).toHaveAttribute('data-chat', 'playing');

    // The typing indicator comes first, then the first bubble, and the others are still hidden.
    await expect.poll(async () => (await opacities(page))[0], { timeout: 3000 }).toBeGreaterThan(0.5);
    expect((await opacities(page))[4]).toBe(0);

    await expect(chat(page)).not.toHaveAttribute('data-chat', /.*/, { timeout: 10000 });
    expect(await opacities(page)).toEqual([1, 1, 1, 1, 1]);

    // Back and forth: it does not play again.
    await page.evaluate(y => scrollTo(0, y - 2000), top);
    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(chat(page)).not.toHaveAttribute('data-chat', /.*/);
    expect(await opacities(page)).toEqual([1, 1, 1, 1, 1]);
  });

  test('the place is reserved: the card does not change size while it plays', async ({ page }) => {
    const top = await scrollTowards(page);
    const height = () =>
      page
        .locator('#approach article')
        .first()
        .evaluate(card => card.getBoundingClientRect().height);
    const before = await height();
    await page.evaluate(y => scrollTo(0, y - 100), top);
    await expect(chat(page)).not.toHaveAttribute('data-chat', /.*/, { timeout: 10000 });
    expect(await height()).toBe(before);
  });
});

test.describe('when nothing should move', () => {
  test('with reduced motion all the messages are there at once', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(chat(page)).not.toHaveAttribute('data-chat', /.*/);
    expect(await opacities(page)).toEqual([1, 1, 1, 1, 1]);
    await context.close();
  });

  test('works without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4399/');
    expect(await opacities(page)).toEqual([1, 1, 1, 1, 1]);
    await context.close();
  });
});

test('is a list with named senders and the typing indicator is hidden from screen readers', async ({ page }) => {
  await page.goto('/');
  const list = page.getByRole('list', { name: 'Example of a conversation' });
  await expect(list.getByRole('listitem')).toHaveCount(5);
  await expect(list.getByRole('listitem').nth(1)).toContainText('Mirislam: Done.');
  await expect(list.getByRole('listitem').first()).toContainText('Client: Can we move the form');
  await expect(chat(page).locator('[data-chat-typing]')).toHaveCount(5);
  for (const typing of await chat(page).locator('[data-chat-typing]').all()) {
    await expect(typing).toHaveAttribute('aria-hidden', 'true');
  }
});

test('the bubbles stay inside the card on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const fits = await page.evaluate(() => {
    const card = document.querySelector('#approach article')!.getBoundingClientRect();
    return [...document.querySelectorAll('#approach chat-demo li')].every(item => {
      const box = item.getBoundingClientRect();
      return box.left >= card.left && box.right <= card.right;
    });
  });
  expect(fits).toBe(true);
});
