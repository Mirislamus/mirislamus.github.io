import { expect, test } from '@playwright/test';

test('skills are split into four named groups with 32 skills, eight in each', async ({ page }) => {
  await page.goto('/');
  const groups = page.locator('#skills section');
  await expect(groups).toHaveCount(4);
  await expect(page.locator('#skills h3')).toHaveText(['Core', 'Data & Quality', 'UI & Motion', 'Tooling & AI']);
  await expect(page.locator('#skills a')).toHaveCount(32);
  for (const id of ['core', 'data', 'ui', 'tooling']) {
    await expect(page.locator(`#skills section[aria-labelledby="skills-${id}"] a`)).toHaveCount(8);
  }
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
    'React Router',
  ]);
  expect(await names('data')).toEqual([
    'TanStack Query',
    'Zustand',
    'Zod',
    'Axios',
    'React Hook Form',
    'Vitest',
    'Playwright',
    'Storybook',
  ]);
  expect(await names('ui')).toEqual([
    'Sass',
    'Tailwind CSS',
    'Chakra UI',
    'GSAP',
    'Motion',
    'Lottie',
    'Embla Carousel',
    'Figma',
  ]);
  expect(await names('tooling')).toEqual(['Vite', 'Bun', 'Git', 'ESLint', 'Prettier', 'PWA', 'Claude Code', 'Codex']);
});

test('group names are translated', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.locator('#skills h3')).toHaveText([
    'Основа',
    'Данные и качество',
    'Интерфейсы и анимации',
    'Инструменты и AI',
  ]);
  await page.goto('/uz/');
  await expect(page.locator('#skills h3')).toHaveText([
    'Asosiy',
    'Ma’lumotlar va sifat',
    'Interfeys va animatsiya',
    'Vositalar va AI',
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

test.describe('icons', () => {
  test('are inline SVG from the page itself: no icon file is requested', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('/');
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    expect(requests.filter(url => url.includes('/images/skills/'))).toEqual([]);
    await expect(page.locator('#skills a svg')).toHaveCount(32);
  });

  test('are hidden from assistive technology and every tile is named by its text', async ({ page }) => {
    await page.goto('/');
    const hidden = await page
      .locator('#skills a svg')
      .evaluateAll(all => all.every(svg => svg.getAttribute('aria-hidden') === 'true'));
    expect(hidden).toBe(true);
    await expect(page.locator('#skills a[aria-label="Zustand"]')).toBeVisible();
  });

  test('a brand that Simple Icons does not have gets a monogram in the same frame', async ({ page }) => {
    await page.goto('/');
    const tile = page.locator('#skills a[aria-label="Embla Carousel"]');
    await expect(tile.locator('svg rect')).toHaveCount(1);
    await expect(tile.locator('svg text')).toHaveText('EC');
    await expect(page.locator('#skills svg text')).toHaveCount(5);
  });

  test('take the colour of the brand under the cursor', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const tile = page.locator('#skills a[aria-label="TypeScript"]');
    await tile.scrollIntoViewIfNeeded();
    const icon = tile.locator('svg');
    const before = await icon.evaluate(svg => getComputedStyle(svg).color);
    await tile.hover();
    await expect.poll(() => icon.evaluate(svg => getComputedStyle(svg).color)).toBe('rgb(49, 120, 198)');
    expect(before).not.toBe('rgb(49, 120, 198)');
  });

  test('a colour that would be lost on the page is replaced by the accent', async ({ page }) => {
    // Next.js is black: it is the brand on a light page, but on a dark page the accent takes its place.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const tile = page.locator('#skills a[aria-label="Next.js"]');
    await tile.scrollIntoViewIfNeeded();
    await tile.hover();
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-text').trim()
    );
    await expect.poll(() => tile.locator('svg').evaluate(svg => getComputedStyle(svg).color)).not.toBe('rgb(0, 0, 0)');
    expect(accent.length).toBeGreaterThan(0);
  });
});
