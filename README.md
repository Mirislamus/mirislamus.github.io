# mirislamus.github.io

Личный сайт‑портфолио Мирислама Усманова на EN, RU и UZ. Статический сайт на [Astro](https://astro.build) без UI‑фреймворка: весь контент собирается на сервере, клиентский JS занимает около 7 КБ gzip (плюс отложенная карусель ≈7 КБ).

## Стек

- **Astro 7**, TypeScript (strict), SCSS‑модули, `@lucide/astro` (иконки), `embla-carousel` (карусели).
- **Проверки:** ESLint (`jsx-a11y-strict`), Stylelint, Prettier, `astro check`, Knip, Vitest, Playwright (e2e, axe, visual).
- **Деплой:** GitHub Pages из ветки `master` (GitHub Actions).

## Быстрый старт

```bash
bun install
bun run dev        # http://localhost:3000
```

Нужен [Bun](https://bun.sh) (версия указана в `packageManager` в `package.json`).

| Команда                           | Что делает                                                         |
| --------------------------------- | ------------------------------------------------------------------ |
| `bun run dev`                     | dev‑сервер                                                         |
| `bun run build`                   | production‑сборка в `dist/`                                        |
| `bun run preview`                 | локальный просмотр сборки                                          |
| `bun run check`                   | типы (`astro check`)                                               |
| `bun run lint` / `lint:styles`    | ESLint / Stylelint                                                 |
| `bun run format` / `format:check` | Prettier (записать / проверить)                                    |
| `bun run knip`                    | неиспользуемые файлы, экспорты и зависимости                       |
| `bun run test`                    | юнит‑тесты (Vitest)                                                |
| `bun run test:e2e`                | e2e и axe (Playwright; нужен `bunx playwright install chromium`)   |
| `bun run test:visual`             | сценарии скриншотов; сравнение с эталоном — только в CI (см. ниже) |
| `bun run check:bundle`            | бюджет JS: 15 КБ gzip сразу, 10 КБ на чанк                         |
| `bun run check:links`             | проверка внешних ссылок (в CI раз в неделю)                        |

## Структура

```text
src/
  assets/            исходники картинок (проекты, аватар) → astro:assets
  data/              весь контент в JSON + схемы (schemas.ts) и сборка данных (site.ts)
  i18n/              единственный список локалей и хелперы ссылок
  layouts/           Layout.astro, Head.astro
  pages/             [...lang]/index.astro (главная на 3 языках), 404.astro
  shared/            общие компоненты (ui), клиентские скрипты (scripts), иконки
  styles/            токены, темы, типографика, утилиты
  utils/             тема, rich text, стаж, картинки
  widgets/components секции страницы (Header, Hero, Approach, Career, Projects, Skills, Reviews, Footer)
tests/
  e2e/               Playwright + axe
  visual/            скриншоты (эталон в tests/visual/__screenshots__)
docs/                ТЗ, план фич, чеклист задач
```

Как устроен клиентский код: страницы рендерятся на сервере, поведение — маленькие скрипты и custom elements (`<site-header>`, `<copy-button>`, `<embla-carousel-root>`, `<projects-list>`). Без JS страница читается целиком (тема следует системной, карусели листаются нативно, все проекты видны).

## Как изменить контент

Тексты лежат в `src/data/<раздел>/`:

- `<name>.json` — тексты по локалям (ключи `en`, `ru`, `uz`);
- `<name>.base.json` — то, что не зависит от языка (id, ссылки, цвета, стек, авторы).

Данные проверяются при сборке (`src/data/schemas.ts`, `src/data/site.ts`): пропущенный ключ в одной локали, опечатка в id технологии или расхождение списков между локалями роняют `bun run build` с понятным сообщением.

Разметка внутри строк JSON: `|акцент|` — выделенное слово, `||site.com/path||` — внешняя ссылка, `{{years}}` — переменная.

### Добавить проект

1. Положить обложку `src/assets/projects/<id>.jpg` (1200×630).
2. Добавить запись в `src/data/projects/projects.base.json` (`id`, `name`, `link`, `color`, `stack` — id из `technologies.json`).
3. Добавить `{ "id", "text" }` в **каждую** локаль `src/data/projects/projects.json` в том же порядке.
4. Новую технологию сначала добавить в `src/data/technologies.json`.

Карточки после четвёртой сворачиваются под кнопку «Показать ещё» автоматически.

### Добавить навык

1. Иконка `public/images/skills/<id>.svg` (для тёмной/светлой темы — `<id>-light.svg` и `<id>-dark.svg` и `"hasTheme": true`).
2. Запись в `src/data/skills/skills.base.json` с полем `group` (`core`, `data`, `ui`, `tooling`).

### Добавить отзыв

Автор — в `reviews.base.json` (`id`, `author`), текст — в каждую локаль `reviews.json`. Имена не переводятся.

### Добавить язык

1. Добавить код в `src/i18n/locales.ts` (`LOCALES`, `LOCALE_META`).
2. Добавить ключ новой локали во все JSON с текстами. Сборка подскажет, что пропущено.

## Темы и доступность

- Токены светлой темы на `:root`, тёмной — в `[data-theme='dark']` и в `prefers-color-scheme: dark` без атрибута (тема работает без JS). Стили под тёмную тему в компонентах — миксин `@include on-dark`.
- Тема применяется инлайн‑скриптом в `<head>` до первой отрисовки (`src/utils/theme-bootstrap.ts`).
- Акцентный цвет текста `#ff6433` в светлой теме имеет низкий контраст: это принятое владельцем исключение, оно закодировано в `tests/e2e/a11y.spec.ts`.
- Анимации при `prefers-reduced-motion: reduce` отключены.

## Скриншоты (visual regression)

Эталонные скриншоты снимаются только в GitHub Actions на `ubuntu-latest` (шрифты на Windows и macOS рендерятся иначе; Docker не используется).

- Сравнение: workflow **Visual regression** запускается на PR и на ветках.
- Обновить эталон: **Actions → Visual regression → Run workflow** с галочкой `update`; workflow закоммитит `tests/visual/__screenshots__` в выбранную ветку.
- Локально `bun run test:visual` только проверяет, что сценарии проходят.

## CI и деплой

`.github/workflows/deploy.yml`: job `verify` (формат, ESLint, Stylelint, Knip, юнит‑тесты, типы, сборка, бюджет бандла, e2e) и job `deploy` (только `master`). По расписанию раз в месяц сайт пересобирается, чтобы стаж и год в копирайте обновлялись без коммитов. Внешние ссылки проверяет отдельный workflow `links.yml` раз в неделю.

## Документация

- [`docs/tz.md`](docs/tz.md) — ТЗ и разбор решений;
- [`docs/features.md`](docs/features.md) — анимации и новые фичи (в планах);
- [`docs/tasks.md`](docs/tasks.md) — чеклист задач и прогресс.
