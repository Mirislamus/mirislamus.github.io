import { expect, test, type Locator, type Page } from '@playwright/test';

const ready = (page: Page, section: string) =>
  expect(page.locator(`#${section} embla-carousel-root[data-ready]`)).toHaveCount(1);

const track = (section: Locator) => section.locator('[data-embla-container]');
const offset = (section: Locator) =>
  track(section).evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);

test.describe('career carousel', () => {
  test('is a labelled carousel with described slides', async ({ page }) => {
    await page.goto('/');
    const career = page.locator('#career');
    const root = career.locator('embla-carousel-root');

    await expect(root).toHaveAttribute('role', 'region');
    await expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(root).toHaveAttribute('aria-labelledby', 'career-title');

    const slides = career.locator('[data-embla-slide]');
    await expect(slides).toHaveCount(5);
    await expect(slides.first()).toHaveAttribute('aria-roledescription', 'slide');
    await expect(slides.first()).toHaveAttribute('aria-label', '1 of 5');
    await expect(slides.last()).toHaveAttribute('aria-label', '5 of 5');
  });

  test('buttons scroll the timeline and are disabled at the ends', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.getElementById('career')?.scrollIntoView());
    await ready(page, 'career');

    const career = page.locator('#career');
    const previous = career.locator('[data-embla-prev]');
    const next = career.locator('[data-embla-next]');

    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();
    expect(await offset(career)).toBe(0);

    for (let step = 0; step < 6 && (await next.isEnabled()); step += 1) await next.click();

    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();
    expect(await offset(career)).toBeLessThan(0);
  });

  test('slides that are off screen cannot be reached with Tab', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.getElementById('career')?.scrollIntoView());
    await ready(page, 'career');

    const inert = await page
      .locator('#career [data-embla-slide]')
      .evaluateAll(slides => slides.map(slide => slide.hasAttribute('inert')));
    expect(inert[0]).toBe(false);
    expect(inert.at(-1)).toBe(true);
  });

  test('the arrow keys move the carousel when focus is inside it', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.getElementById('career')?.scrollIntoView());
    await ready(page, 'career');

    const career = page.locator('#career');
    await career.locator('[data-embla-next]').focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => offset(career)).toBeLessThan(0);
  });

  test('scrolls natively without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 600, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4399/');
    const scrollable = await page
      .locator('#career [data-embla-viewport]')
      .evaluate(element => element.scrollWidth > element.clientWidth);
    expect(scrollable).toBe(true);
    await context.close();
  });
});

test.describe('reviews carousel', () => {
  test('loops without duplicating slides, with dots for every review', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView());
    await ready(page, 'reviews');

    const reviews = page.locator('#reviews');
    await expect(reviews.locator('[data-embla-slide]')).toHaveCount(8);
    await expect(reviews.locator('[data-embla-dots] button')).toHaveCount(8);
    await expect(reviews.locator('[data-embla-dots] button[aria-current="true"]')).toHaveCount(1);

    // Both arrows stay enabled: it is an endless loop.
    await expect(reviews.locator('[data-embla-prev]')).toBeEnabled();
    await expect(reviews.locator('[data-embla-next]')).toBeEnabled();
  });

  test('arrows and dots change the selected review', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView());
    await ready(page, 'reviews');

    const reviews = page.locator('#reviews');
    const dots = reviews.locator('[data-embla-dots] button');

    await reviews.locator('[data-embla-next]').click();
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');

    await dots.nth(4).click();
    await expect(dots.nth(4)).toHaveAttribute('aria-current', 'true');

    await reviews.locator('[data-embla-prev]').click();
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  });

  test('going back from the first review wraps to the last one', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView());
    await ready(page, 'reviews');

    const reviews = page.locator('#reviews');
    await reviews.locator('[data-embla-prev]').click();
    await expect(reviews.locator('[data-embla-dots] button').last()).toHaveAttribute('aria-current', 'true');
  });

  test('dots have localized names', async ({ page }) => {
    await page.goto('/ru/');
    await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView());
    await ready(page, 'reviews');
    await expect(page.locator('#reviews [data-embla-dots] button').first()).toHaveAttribute(
      'aria-label',
      'Перейти к отзыву 1'
    );
    await expect(page.locator('#reviews [data-embla-slide]').first()).toHaveAttribute('aria-label', '1 из 8');
  });

  test('shows 1, 2 or 3 reviews depending on the width', async ({ page }) => {
    const visibleCount = () =>
      page.locator('#reviews [data-embla-slide]').evaluateAll(slides => {
        const viewport = document.querySelector('#reviews [data-embla-viewport]')!.getBoundingClientRect();
        return slides.filter(slide => {
          const rect = slide.firstElementChild!.getBoundingClientRect();
          return rect.left >= viewport.left - 1 && rect.right <= viewport.right + 1;
        }).length;
      });

    await page.goto('/');
    await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView());
    await ready(page, 'reviews');

    for (const [width, expected] of [
      [1440, 3],
      [800, 2],
      [390, 1],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(visibleCount).toBe(expected);
    }
  });
});

test.describe('review dots', () => {
  for (const width of [1440, 390]) {
    test(`sit below the cards, centered, at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/#reviews');
      const reviews = page.locator('#reviews');
      await expect(reviews.locator('[data-embla-dots] button')).toHaveCount(8);
      const cards = (await reviews.locator('[data-embla-viewport]').boundingBox())!;
      const dots = (await reviews.locator('[data-embla-dots]').boundingBox())!;
      expect(dots.y).toBeGreaterThanOrEqual(cards.y + cards.height);
      expect(Math.abs(dots.x + dots.width / 2 - (cards.x + cards.width / 2))).toBeLessThan(6);
    });
  }
});

test.describe('career carousel, how far the arrows go', () => {
  test('one click on next brings the last card fully into view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#career');
    const next = page.locator('#career [data-embla-next]');
    await expect(next).toBeEnabled();
    await next.click();
    await expect(next).toBeDisabled();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const slides = [...document.querySelectorAll('#career [data-embla-slide]')];
          return slides[slides.length - 1].getBoundingClientRect().right <= innerWidth;
        })
      )
      .toBe(true);
    await page.locator('#career [data-embla-prev]').click();
    await expect(page.locator('#career [data-embla-prev]')).toBeDisabled();
  });

  test('when every card fits on the screen there are no arrows and no scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 2400, height: 900 });
    await page.goto('/#career');
    await expect(page.locator('#career embla-carousel-root')).toHaveAttribute('data-static', '');
    await expect(page.locator('#career [data-embla-next]')).toBeHidden();
    const slides = page.locator('#career [data-embla-slide]');
    const last = (await slides.last().boundingBox())!;
    expect(last.x + last.width).toBeLessThanOrEqual(2400);

    // Back to a narrow window: the arrows are back.
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(page.locator('#career [data-embla-next]')).toBeVisible();
    await expect(page.locator('#career embla-carousel-root')).not.toHaveAttribute('data-static', /.*/);
  });
});
