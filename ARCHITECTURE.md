# Архитектура системы

## Обзор

Статический сайт на Astro без UI-фреймворка: страницы рендерятся при сборке, поведение — небольшие скрипты на TypeScript и custom elements. Этот файл — единственный источник структуры `src/`; остальные документы ссылаются на него.

Шаблон ai-template задает структуру FSD-Lite. Сайт ее не повторяет: отличия перечислены в [ADR 0024](docs/decisions/frontend/0024-site-deviations.md), вопрос о переходе — [задача 020](docs/tasks.md).

## Структура `src/`

```text
src/
├── pages/                 # [...lang]/index.astro (главная на 3 языках), 404.astro, cv/[lang].astro, og/[lang].astro, robots.txt.ts
├── layouts/               # Layout.astro, Head.astro
├── widgets/components/    # Секции страницы: Header, Hero, Approach, Career, Projects, Skills, Reviews, Footer, Cv
├── shared/
│   ├── ui/                # Атомарные компоненты: Button, Tag, Switcher, Toast, Relic и др.
│   ├── scripts/           # Клиентские скрипты и custom elements; matrix/ — эффекты Matrix, relic/ — режим Relic
│   └── icons/             # Logo.astro
├── data/                  # Контент в JSON по разделам, схемы (schemas.ts) и сборка данных (site.ts); matrix/ — сгенерированные глифы
├── i18n/                  # Список локалей и хелперы ссылок
├── seo/                   # JSON-LD и дата последнего изменения
├── styles/                # Токены, темы, типографика, миксины, утилиты (global.scss)
├── utils/                 # Чистые утилиты: тема, rich text, стаж, картинки, иконки навыков
└── assets/                # Исходники растров для astro:assets (проекты, аватар)
```

Вне `src/`:

- `scripts/` — сборочные скрипты: медиа (CV в PDF, OG-картинки), глифы для эффектов, бюджет бандла, ссылки, Lighthouse.
- `tests/e2e/` — Playwright и axe; `tests/visual/` — скриншоты, эталон снимается только в CI.
- `public/` — шрифты Inter, фавиконки.

## Правило импортов

Импорты идут сверху вниз: `pages` → `layouts` → `widgets` → `shared`. Модули `data`, `i18n`, `seo`, `utils`, `styles` — нижний уровень, наравне с `shared`.

- Секции в `widgets/components/` не импортируют друг друга.
- `shared`, `data`, `utils` не импортируют `widgets`, `layouts` и `pages`.
- Пути — алиасы из `tsconfig.json` (`@shared/*`, `@widgets/*`, `@data/*` и др.); относительные пути — только внутри папки компонента.

## Данные и состояние

- Контент — JSON в `src/data/<раздел>/`: `<name>.json` — тексты по локалям, `<name>.base.json` — данные без языка. Схемы проверяются при сборке, ошибка в данных роняет `bun run build`.
- Состояние UI хранится в DOM (`data-*` атрибуты) и в скриптах компонента; глобальных сторов нет.
- Тема, пауза анимаций и выбор звука сохраняются в `localStorage`; тема применяется инлайн-скриптом до первой отрисовки.

## Реестр архитектурных решений

Каталог `docs/decisions/` — реестр ADR шаблона ai-template. Нумерация сквозная.

**Фронтенд (`docs/decisions/frontend/`):**

- `0001-project-architecture.md` — профили Astro и Next.js, FSD-Lite, гидратация, рендеринг, контент.
- `0002-html-standards.md` — семантика HTML5, доступность, нативный `<dialog>`, Skip Link.
- `0003-scss-standards.md` — SCSS Modules, токены, z-index, миксины, брейкпоинты.
- `0005-react-standards.md` — React 19, хуки, мемоизация (в сайте не применяется: React нет).
- `0006-state-management.md` — уровни состояния, Nano Stores, Zustand, URL.
- `0007-assets-and-media.md` — изображения, шрифты, иконки, фавиконки.
- `0008-forms-and-api.md` — `ky`, TanStack Query, формы, антиспам (в сайте не применяется: форм нет).
- `0013-seo-standards.md` — канонические URL, sitemap, JSON-LD, валидация.
- `0015-analytics-and-tracking.md` — отложенная аналитика, `trackEvent`, cookie (в сайте не применяется: счетчиков нет).
- `0016-i18n-standards.md` — словари, `astro:i18n`, `Intl`.
- `0017-motion-and-animations.md` — GPU-анимации, `prefers-reduced-motion`, Scroll Reveal.
- `0024-site-deviations.md` — принятые отступления сайта от шаблона.

**Бэкенд (`docs/decisions/backend/`, в сайте не применяются: бэкенда нет):**

- `0019-backend-architecture.md` — когда нужен бэкенд, монорепо, модули по фичам, очередь задач.
- `0020-api-contract-and-errors.md` — Eden Treaty, адреса и формат данных, пагинация, ошибки RFC 9457.
- `0021-database-and-migrations.md` — PostgreSQL, Drizzle, соглашения схемы, миграции, бэкапы.
- `0022-auth-and-access.md` — Better Auth, сессии, способы входа, роли, проверка владельца, 2FA.
- `0023-security-logging-and-config.md` — валидация, лимиты запросов, секреты, логи, алерты, файлы.

**Общие (`docs/decisions/common/`):**

- `0004-ts-js-standards.md` — строгий TypeScript и JavaScript, именование, импорты.
- `0009-tooling-and-linting.md` — Prettier, ESLint, Stylelint.
- `0010-third-party-libraries-policy.md` — политика версий, черный и белый списки.
- `0011-git-workflow-and-commits.md` — Conventional Commits, ветки, безопасность Git.
- `0012-build-and-package-manager.md` — Bun, бюджет бандла, окружение.
- `0014-testing-and-qa.md` — пирамида тестов, Definition of Done.
- `0018-deployment-and-caching.md` — кеширование, деплой, CI/CD.

Новый ADR получает следующий свободный номер (0025) и кладется в папку своей области. При расхождении ADR шаблона и ADR 0024 действует ADR 0024.
