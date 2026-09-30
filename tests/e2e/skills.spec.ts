import { expect, test } from '@playwright/test';

test('skills are split into four named groups with all 26 skills', async ({ page }) => {
  await page.goto('/');
  const groups = page.locator('#skills section');
  await expect(groups).toHaveCount(4);
  await expect(page.locator('#skills h3')).toHaveText(['Core', 'Data & Quality', 'UI & Motion', 'Tooling']);
  await expect(page.locator('#skills a')).toHaveCount(26);
});

test('each group is a labelled region and the headings do not skip a level', async ({ page }) => {
  await page.goto('/');
  for (const id of ['core', 'data', 'ui', 'tooling']) {
    const group = page.locator(`#skills section[aria-labelledby="skills-${id}"]`);
    await expect(group).toHaveCount(1);
    await expect(group.locator('h3')).toHaveAttribute('id', `skills-${id}`);
  }
  const levels = await page
    .locator('#skills h2, #skills h3')
    .evaluateAll(all => all.map(heading => Number(heading.tagName[1])));
  expect(levels).toEqual([2, 3, 3, 3, 3]);
});

test('skills sit in the intended group', async ({ page }) => {
  await page.goto('/');
  const names = (id: string) =>
    page
      .locator(`#skills section[aria-labelledby="skills-${id}"] a`)
      .evaluateAll(all => all.map(a => a.getAttribute('aria-label')));
  expect(await names('core')).toEqual([
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'React',
    'Next.js',
    'Astro',
    'Gatsby',
    'React Router',
  ]);
  expect(await names('data')).toEqual(['TanStack Query', 'Redux', 'Zustand', 'Vitest', 'Storybook']);
  expect(await names('ui')).toEqual(['Sass', 'Tailwind CSS', 'Chakra UI', 'GSAP', 'Motion', 'Figma']);
  expect(await names('tooling')).toEqual(['Vite', 'Bun', 'Git', 'ESLint', 'Prettier', 'PWA']);
});

test('group names are translated', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.locator('#skills h3')).toHaveText([
    'Основа',
    'Данные и качество',
    'Интерфейсы и анимации',
    'Инструменты',
  ]);
  await page.goto('/uz/');
  await expect(page.locator('#skills h3')).toHaveText([
    'Asosiy',
    'Ma’lumotlar va sifat',
    'Interfeys va animatsiya',
    'Vositalar',
  ]);
});

test.describe('layout', () => {
  test('two columns on a wide screen, one column on narrower ones', async ({ page }) => {
    const columns = () =>
      page
        .locator('#skills section')
        .evaluateAll(all => new Set(all.map(section => Math.round(section.getBoundingClientRect().left))).size);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    expect(await columns()).toBe(2);

    await page.setViewportSize({ width: 800, height: 900 });
    await expect.poll(columns).toBe(1);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(columns).toBe(1);
  });

  test('no horizontal scrolling on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
