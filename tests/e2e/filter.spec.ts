import { expect, test, type Page } from '@playwright/test';

const visibleNames = (page: Page) =>
  page.locator('#projects article:visible h3').evaluateAll(all => all.map(heading => heading.textContent?.trim()));

test('there is an "All" chip plus the technologies used by at least two projects', async ({ page }) => {
  await page.goto('/');
  const chips = page.locator('#projects [data-filter]');
  await expect(chips).toHaveText([
    'All',
    'React',
    'Chakra UI',
    'GSAP',
    'Nunjucks',
    'JavaScript',
    'Gulp',
    'CSS Modules',
    'Gatsby',
    'Sass',
  ]);
  await expect(chips.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('group', { name: 'Filter projects by technology' })).toBeVisible();
});

test('choosing a technology shows every matching project, even collapsed ones, and says how many', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'GSAP', exact: true }).click();

  expect((await visibleNames(page)).sort()).toEqual(['Caldera', 'Humandone', 'Oceanverse']);
  await expect(page.locator('#projects [data-count]')).toHaveText('3 projects');
  await expect(page.locator('#projects [data-count]')).toHaveAttribute('role', 'status');
  await expect(page.getByRole('button', { name: 'GSAP', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#projects [data-filter=""]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#projects [data-more-wrap]')).toBeHidden();
});

test('choosing the active chip again, or "All", clears the filter and brings back "Show more"', async ({ page }) => {
  await page.goto('/');
  const gsap = page.getByRole('button', { name: 'GSAP', exact: true });

  await gsap.click();
  await gsap.click();
  await expect(page.locator('#projects article:visible')).toHaveCount(4);
  await expect(page.locator('#projects [data-more-wrap]')).toBeVisible();
  await expect(page.locator('#projects [data-count]')).toBeHidden();

  await gsap.click();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('#projects article:visible')).toHaveCount(4);
  await expect(page.locator('#projects [data-filter=""]')).toHaveAttribute('aria-pressed', 'true');
});

test('a filter does not forget that the list was expanded', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show more' }).click();
  await expect(page.locator('#projects article:visible')).toHaveCount(8);

  await page.getByRole('button', { name: 'Sass', exact: true }).click();
  expect(await visibleNames(page)).toHaveLength(2);

  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('#projects article:visible')).toHaveCount(8);
  await expect(page.locator('#projects [data-more-wrap]')).toBeHidden();
});

test('the chips work with the keyboard and keep focus', async ({ page }) => {
  await page.goto('/');
  const react = page.getByRole('button', { name: 'React', exact: true });
  await react.focus();
  await page.keyboard.press('Enter');
  await expect(react).toHaveAttribute('aria-pressed', 'true');
  await expect(react).toBeFocused();
  await page.keyboard.press('Space');
  await expect(react).toHaveAttribute('aria-pressed', 'false');
});

test('the count uses the plural forms of the language', async ({ page }) => {
  await page.goto('/ru/');
  await page.getByRole('button', { name: 'GSAP', exact: true }).click();
  await expect(page.locator('#projects [data-count]')).toHaveText('3 проекта');
  await page.getByRole('button', { name: 'Все', exact: true }).click();

  await page.goto('/uz/');
  await page.getByRole('button', { name: 'GSAP', exact: true }).click();
  await expect(page.locator('#projects [data-count]')).toHaveText('3 ta loyiha');
});

test('the chip row is in the HTML, so nothing jumps when the script starts', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { chipsHeight: number }).chipsHeight = document
        .querySelector('#projects [data-filters]')!
        .getBoundingClientRect().height;
    });
  });
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('projects-list') !== undefined);
  const before = await page.evaluate(() => (window as unknown as { chipsHeight: number }).chipsHeight);
  const after = await page
    .locator('#projects [data-filters]')
    .evaluate(element => element.getBoundingClientRect().height);
  expect(before).toBeGreaterThan(30);
  expect(after).toBe(before);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all projects are shown and there are no dead controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#projects article:visible')).toHaveCount(8);
    await expect(page.locator('#projects [data-filters]')).toBeHidden();
  });
});
