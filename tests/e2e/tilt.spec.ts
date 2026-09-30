import { expect, test, type Locator, type Page } from '@playwright/test';

const angles = (card: Locator) =>
  card.evaluate(element => {
    const match = /rotateX\((-?[\d.]+)deg\) rotateY\((-?[\d.]+)deg\)/.exec(element.style.transform);
    return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
  });

const openProjects = async (page: Page) => {
  await page.goto('/');
  const card = page.locator('#projects article').first();
  await card.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  return { card, box: (await card.boundingBox())! };
};

test.describe('with a mouse and motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('a project card leans towards the cursor by at most 4 degrees', async ({ page }) => {
    const { card, box } = await openProjects(page);

    // Near the top left corner (inside the rounded shape): the card leans up-left.
    // Keep moving until the page script is ready (under load it can start after the first move).
    await expect
      .poll(async () => {
        await page.mouse.move(box.x + 36, box.y + 36);
        await page.mouse.move(box.x + 30, box.y + 30);
        return (await angles(card)) !== null;
      })
      .toBe(true);
    await page.waitForTimeout(600);
    const tilt = (await angles(card))!;

    expect(tilt.x).toBeGreaterThan(1); // rotateX > 0: the top edge leans back
    expect(tilt.y).toBeLessThan(-1); // rotateY < 0: the left edge leans back
    expect(Math.abs(tilt.x)).toBeLessThanOrEqual(4.01);
    expect(Math.abs(tilt.y)).toBeLessThanOrEqual(4.01);
  });

  test('leaving the card settles it and removes the transform completely', async ({ page }) => {
    const { card, box } = await openProjects(page);
    await expect
      .poll(async () => {
        await page.mouse.move(box.x + box.width - 36, box.y + box.height - 36);
        await page.mouse.move(box.x + box.width - 40, box.y + box.height - 40);
        return (await angles(card)) !== null;
      })
      .toBe(true);

    await page.mouse.move(2, 2);
    await expect.poll(() => card.evaluate(element => element.style.transform), { timeout: 4000 }).toBe('');
  });

  test('Approach cards lean too, except the interactive UI card', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#approach article');
    await expect(cards.nth(0)).toHaveAttribute('data-tilt', '');
    await expect(cards.nth(2)).not.toHaveAttribute('data-tilt', /.*/);

    await cards.nth(2).evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const box = (await cards.nth(2).boundingBox())!;
    await page.mouse.move(box.x + 30, box.y + 30);
    await page.mouse.move(box.x + 40, box.y + 40);
    await page.waitForTimeout(400);
    expect(await cards.nth(2).evaluate(element => element.style.transform)).toBe('');
    expect(await cards.nth(2).evaluate(element => element.style.getPropertyValue('--mouse-x'))).not.toBe('');
  });

  test('touch pointers do not move the highlight or tilt the card', async ({ page }) => {
    const { card } = await openProjects(page);
    await card.evaluate(element => {
      element.dispatchEvent(
        new PointerEvent('pointermove', { pointerType: 'touch', clientX: 50, clientY: 50, bubbles: true })
      );
    });
    await page.waitForTimeout(200);
    expect(await card.evaluate(element => element.style.transform)).toBe('');
    expect(await card.evaluate(element => element.style.getPropertyValue('--mouse-x'))).toBe('');
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing follows the cursor', async ({ page }) => {
    const { card, box } = await openProjects(page);
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.move(box.x + 30, box.y + 30);
    await page.waitForTimeout(300);
    expect(await card.evaluate(element => element.style.transform)).toBe('');
    expect(await card.evaluate(element => element.style.getPropertyValue('--mouse-x'))).toBe('');
  });
});
