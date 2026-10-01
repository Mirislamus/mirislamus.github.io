import { expect, test } from '@playwright/test';

const rain = (page: import('@playwright/test').Page) => page.locator('canvas[data-rain]');

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the rain runs, is decorative and does not shift the layout', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    await expect(rain(page)).toHaveAttribute('aria-hidden', 'true');

    const box = await rain(page).boundingBox();
    const hero = await page.locator('#about').boundingBox();
    expect(box?.width).toBeCloseTo(hero!.width, 0);
    expect(box?.height).toBeCloseTo(hero!.height, 0);

    // The canvas actually has painted glyphs.
    const painted = await rain(page).evaluate(canvas => {
      const element = canvas as HTMLCanvasElement;
      const data = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
      return data.some((value, index) => index % 4 === 3 && value > 0);
    });
    expect(painted).toBe(true);
  });

  test('goes idle when the Hero is off screen and resumes when it is back', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');

    await page.locator('#contacts').scrollIntoViewIfNeeded();
    await expect(rain(page)).toHaveAttribute('data-state', 'idle');

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
  });

  test('a stored pause shows a still frame', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('motion-paused', '1'));
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');
  });

  test('the rain follows the accent color of the theme', async ({ page }) => {
    const dominant = () =>
      rain(page).evaluate(canvas => {
        const element = canvas as HTMLCanvasElement;
        const data = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
        let red = 0;
        let green = 0;
        for (let i = 0; i < data.length; i += 4) {
          red += data[i] * data[i + 3];
          green += data[i + 1] * data[i + 3];
        }
        return red > green ? 'orange' : 'green';
      });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    await expect.poll(dominant).toBe('green');

    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(dominant).toBe('orange');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
  });

  test('the words for the rain come from the data: the stack and, while open, the call to action', async ({ page }) => {
    await page.goto('/');
    const words = JSON.parse((await rain(page).getAttribute('data-words')) ?? '[]') as string[];
    expect(words).toContain('REACT');
    expect(words).toContain('HIRE ME');
  });
});

test.describe('when motion is reduced', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows one still frame and never animates', async ({ page }) => {
    await page.goto('/#about');
    await expect(rain(page)).toHaveAttribute('data-state', 'static');
  });

  test('the still frame is the same on every load', async ({ page }) => {
    const grab = async () => {
      await page.goto('/#about');
      await expect(rain(page)).toHaveAttribute('data-state', 'static');
      return rain(page).evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
    };
    const first = await grab();
    const second = await grab();
    expect(second).toBe(first);
  });
});

test('without JavaScript the Hero is as before and the canvas stays empty', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(rain(page)).not.toHaveAttribute('data-state', /.*/);
  await context.close();
});
