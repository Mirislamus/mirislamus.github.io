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
    // The canvas also covers the strip above the Hero (up to the top edge of the page).
    expect(box?.width).toBeCloseTo(hero!.width, 0);
    expect(box!.y + box!.height).toBeCloseTo(hero!.y + hero!.height, 0);

    // The canvas actually has painted glyphs.
    const painted = await rain(page).evaluate(canvas => {
      const element = canvas as HTMLCanvasElement;
      const data = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
      return data.some((value, index) => index % 4 === 3 && value > 0);
    });
    expect(painted).toBe(true);
  });

  test('the rain reaches the very top edge of the page, behind the header', async ({ page }) => {
    await page.goto('/#');
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    const box = (await rain(page).boundingBox())!;
    expect(Math.round(box.y)).toBe(0);
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

test.describe('intro downpour', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the rain joins the intro with a downpour that calms down', async ({ page }) => {
    // The downpour is skipped when the rain is late (600 ms after navigation), which depends on how busy the
    // machine is. Freeze the page clock so the test checks the behavior, not the load.
    // The same goes for the intro itself, which ends 1.6 s after load: keep it on while the machine is busy.
    await page.addInitScript(() => {
      performance.now = () => 0;
      const setTimeoutNative = window.setTimeout.bind(window);
      window.setTimeout = ((handler: TimerHandler, ms?: number, ...args: unknown[]) =>
        setTimeoutNative(handler, ms === 1600 ? 20000 : ms, ...args)) as typeof window.setTimeout;
    });
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const watch = () => {
          const canvas = document.querySelector('canvas[data-rain]');
          if (canvas?.hasAttribute('data-burst')) (window as unknown as { sawBurst: boolean }).sawBurst = true;
          else requestAnimationFrame(watch);
        };
        watch();
      });
    });
    await page.goto('/');

    await expect.poll(() => page.evaluate(() => (window as unknown as { sawBurst?: boolean }).sawBurst)).toBe(true);
    await expect(rain(page)).not.toHaveAttribute('data-burst', /.*/, { timeout: 3000 });
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
  });

  test('there is no downpour without the intro', async ({ page }) => {
    await page.goto('/#about'); // a deep link skips the intro
    await expect(rain(page)).toHaveAttribute('data-state', 'running');
    await expect(rain(page)).not.toHaveAttribute('data-burst', /.*/);
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
