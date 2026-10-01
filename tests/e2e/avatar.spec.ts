import { expect, test, type Page } from '@playwright/test';

const SHAPE_A = 'M130 10C190 0 260 70 250 130C240 200 170 250 100 240C30 230 10 170 20 100C30 30 70 20 130 10Z';

const outline = (page: Page) => page.locator('[data-avatar-shape]').getAttribute('d');
const extent = (page: Page) =>
  page.locator('[data-avatar-shape]').evaluate(path => {
    const box = (path as unknown as SVGGraphicsElement).getBBox();
    return { minX: box.x, maxX: box.x + box.width };
  });

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the outline breathes', async ({ page }) => {
    await page.goto('/#about');
    await expect.poll(async () => (await outline(page)) !== SHAPE_A).toBe(true);
    const first = await outline(page);
    await expect.poll(async () => (await outline(page)) !== first).toBe(true);
  });

  test('the outline stops while the Hero is off screen and goes on when it is back', async ({ page }) => {
    await page.goto('/#about');
    await expect.poll(async () => (await outline(page)) !== SHAPE_A).toBe(true);

    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const frozen = await outline(page);
    await page.waitForTimeout(400);
    expect(await outline(page)).toBe(frozen);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(async () => (await outline(page)) !== frozen).toBe(true);
  });

  test('the edge stretches towards the cursor like a drop and springs back', async ({ page }) => {
    await page.goto('/#about');
    await expect.poll(async () => (await outline(page)) !== SHAPE_A).toBe(true);

    const box = (await page.locator('[data-avatar]').boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width + 15, y, { steps: 6 });
    // At rest the right edge is at 250 (viewBox units); breathing moves it by about ±9.
    await expect.poll(async () => (await extent(page)).maxX).toBeGreaterThan(285);

    await page.mouse.move(8, 880, { steps: 6 });
    await expect.poll(async () => (await extent(page)).maxX, { timeout: 4000 }).toBeLessThan(275);
  });

  test('the edge never goes lower than the photo, so its cut bottom does not show', async ({ page }) => {
    await page.goto('/#about');
    await expect(page.locator('canvas[data-rain]')).toHaveAttribute('data-state', 'running');
    const box = (await page.locator('[data-avatar]').boundingBox())!;
    // The cursor right below the avatar pulls the bottom edge as far as it will go.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 20, { steps: 6 });
    await page.waitForTimeout(900);
    const lowest = await page.locator('[data-avatar-shape]').evaluate(path => {
      const rect = (path as unknown as SVGGraphicsElement).getBBox();
      return rect.y + rect.height;
    });
    expect(lowest).toBeLessThan(295);
  });

  test('the photo drifts with the cursor and nothing tilts', async ({ page }) => {
    await page.goto('/#about');
    await expect(page.locator('canvas[data-rain]')).toHaveAttribute('data-state', 'running');
    await page.mouse.move(2, 200);
    await expect
      .poll(() => page.locator('[data-photo]').evaluate(element => (element as unknown as HTMLElement).style.transform))
      .toMatch(/translate\(-[1-9]/);
    expect(await page.locator('[data-avatar]').evaluate(svg => (svg as unknown as HTMLElement).style.transform)).toBe(
      ''
    );
  });

  test('a paused animation shows the static outline', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('motion-paused', '1'));
    await page.goto('/#about');
    await expect(page.locator('canvas[data-rain]')).toHaveAttribute('data-state', 'static');
    expect(await outline(page)).toBe(SHAPE_A);
  });
});

test.describe('with a touch screen', () => {
  test.use({ reducedMotion: 'no-preference', hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('a tap dents the edge and the drop wobbles', async ({ page }) => {
    await page.goto('/#about');
    await expect(page.locator('canvas[data-rain]')).toHaveAttribute('data-state', 'running');
    await expect.poll(async () => (await outline(page)) !== SHAPE_A).toBe(true);

    const box = (await page.locator('[data-avatar]').boundingBox())!;
    // The path starts at the rightmost point: 250 in viewBox units, ±13 from breathing. A tap pushes it in by ~35.
    const rightmost = page.evaluate(
      () =>
        new Promise<number>(resolve => {
          const path = document.querySelector('[data-avatar-shape]')!;
          const end = performance.now() + 2000;
          let min = Infinity;
          const look = () => {
            min = Math.min(min, Number(/^M([0-9.]+)/.exec(path.getAttribute('d') ?? '')?.[1]));
            if (performance.now() < end) requestAnimationFrame(look);
            else resolve(min);
          };
          look();
        })
    );
    await page.touchscreen.tap(box.x + box.width - 6, box.y + box.height / 2);
    expect(await rightmost).toBeLessThan(238);
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the avatar stays still', async ({ page }) => {
    await page.goto('/#about');
    await expect(page.locator('canvas[data-rain]')).toHaveAttribute('data-state', 'static');
    expect(await outline(page)).toBe(SHAPE_A);
    await page.waitForTimeout(400);
    expect(await outline(page)).toBe(SHAPE_A);
  });
});

test('the avatar is decorative and the heading carries the name and the role', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-avatar]')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mirislam Usmanov Frontend Engineer');
});
