# 001 — Внедрение шаблона ai-template и аудит расхождений

- **Уровень:** Medium
- **Статус:** готово
- **Источники:** запрос владельца; шаблон ai-template (AGENTS.md, docs/, ADR 0001–0018, `.claude/`); код сайта на коммите `824a6c9`
- **Цель:** правила работы агентов и инженерные стандарты шаблона действуют в репозитории сайта; расхождения кода с шаблоном собраны в бэклог.
- **Обоснование оценки:** только документация и конфиг Claude Code, больше 5 файлов, есть решения владельца ([docs/workflow.md](../workflow.md) §1).

## Решения владельца

- Перенос адаптированный: AGENTS.md, субагенты, workflow, skills, PRODUCT/ARCHITECTURE/STATE по фактам сайта, стандарты (design, quality, content, seo), ADR common и frontend, эталонные конфиги `docs/setup/common.md` и `frontend.md`. Не перенесены: бэкенд-ADR и `setup/backend.md`, бэкенд-субагенты, PROMPT.md, USAGE.md, TEMPLATE_STRUCTURE.md, паспорта юридических страниц; ссылки на них в перенесенных документах заменены текстом.
- При противоречии действуют решения сайта; они зафиксированы в [ADR 0024](../decisions/frontend/0024-site-deviations.md).
- Старые `docs/tz.md`, `docs/features.md`, `docs/tasks.md`, `docs/seo.md` и `docs/README.md` удалены (остаются в git-истории); `docs/seo.md` теперь SEO-стандарт шаблона.
- Коммиты и PR — без подписи AI (`.claude/settings.json`, ADR 0011 §1).

## Критерии готовности

- [x] AGENTS.md, CLAUDE.md, `.claude/` (настройки и 6 субагентов) в репозитории.
- [x] PRODUCT.md, ARCHITECTURE.md, STATE.md описывают сайт по фактам из кода.
- [x] ADR 0024 перечисляет принятые отступления.
- [x] Расхождения собраны ниже и внесены в [docs/tasks.md](../tasks.md) задачами 002–023.
- [x] Относительные ссылки в Markdown работают.
- [x] `bun run format:check` проходит.

## Найденные расхождения

Принятые отступления (React, формы, аналитика, JSON-контент, свои токены, стилистика Matrix и Relic, GitHub Pages) в список не входят — они в ADR 0024.

### 1. Инструменты и проверки

- **002.** `bun run check` в сайте — только `astro check` (`package.json`); по шаблону это единая команда: `format:check` + ESLint + Stylelint + типы с `--max-warnings 0` ([ADR 0009](../decisions/common/0009-tooling-and-linting.md) §4, [quality.md](../quality.md) §5). Предложение: `typecheck` = `astro check`, `check` — конвейер; CI и README обновить.
- **003.** `eslint.config.js` подключает только рекомендованные наборы. Нет правил ADR 0009 §2: `no-explicit-any`, `no-non-null-assertion`, `consistent-type-imports`, `no-floating-promises` (с типами), `no-console`, `perfectionist/sort-imports`, `eslint-config-prettier`. Нужны новые dev-зависимости (`eslint-plugin-perfectionist`, `eslint-config-prettier`) — по разрешению владельца.
- **004.** `stylelint.config.mjs` не содержит правил ADR 0009 §3: порядок свойств (`stylelint-order`), `unit-disallowed-list: ['rem', 'em']`, `selector-max-id: 0`, `selector-no-qualifying-type`, `max-nesting-depth: 3`, `color-named: 'never'`, запрет `transition: all`. Свои правила сайта (z-index и тайминги из токенов) сохраняются. Автоисправление порядка затронет почти все `.module.scss` — отдельный коммит `style:`.
- **005.** Нет `html-validate` и команды `validate:html` для `dist/**/*.html` ([ADR 0014](../decisions/common/0014-testing-and-qa.md) §1, §4; [ADR 0002](../decisions/frontend/0002-html-standards.md) §9).
- **006.** В `package.json` нет `engines` ([ADR 0012](../decisions/common/0012-build-and-package-manager.md) §4), `test:watch` (ADR 0014 §2), `build:analyze` с `rollup-plugin-visualizer` (ADR 0012 §3); в `astro.config.ts` нет `chunkSizeWarningLimit: 250` (ADR 0012 §2).
- **007.** `scripts/lighthouse.mjs` роняет CI только при SEO < 100, остальные категории печатаются. Шаблон требует Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100 ([quality.md](../quality.md) §2). Accessibility нужно сверить с исключением по контрасту акцента (ADR 0024 §4).
- **008.** e2e идут только в Chromium 1440×900 (`playwright.config.ts`, проект `e2e`). Шаблон требует второй профиль — мобильный WebKit 390 px (ADR 0014 §3). Ошибки консоли собирают 5 из 38 спецификаций; по ADR 0014 §3 нужна общая проверка в smoke-сценарии.

### 2. Стили и вёрстка

- **009.** Состояния элементов ([design.md](../design.md) §7, [ADR 0003](../decisions/frontend/0003-scss-standards.md) §5):
  - 27 из 30 `&:hover` написаны без миксина `hover` (`src/styles/helpers/_mixins.scss:1`) — на тач-экранах hover залипает после тапа. Пример: `src/shared/ui/Button/Button.module.scss:27`.
  - В `Button`, `ActionButton`, `MotionToggle`, `Pills`, `Relic` стили фокуса висят на `:focus`, а не на `:focus-visible`.
  - 20 мест с `pointer-events: none`, в том числе у неактивной кнопки (`Button.module.scss:19`) — курсор `not-allowed` при этом не виден.
  - Нажатие `scale: 0.97` (`Button.module.scss:32`), по шаблону `0.98` или `translateY(1px)`.
- **010.** Брейкпоинты desktop-first: `@media (width <= 767px)` встречается 28 раз; есть значения вне шкалы — 991, 992, 1199 px (`_typography.scss`, `_container.scss`, Approach, Footer, Header, Skills). Шаблон: mobile-first, шкала 576/768/1024/1280/1440 и миксины `up()`/`down()` ([design.md](../design.md) §2, ADR 0003 §1). Затрагивает все секции; проверка — visual regression в CI.
- **011.** `rem`/`em` в 15 местах (7 файлов: Relic, Approach, Career, Cv, Footer, Header, Hero), в основном `letter-spacing` и `min-height` в `em` (ADR 0003 §2).
- **012.** В `src/layouts/Head.astro` нет `<link rel="preload">` для основного начертания Inter ([ADR 0007](../decisions/frontend/0007-assets-and-media.md) §3) и `<meta name="format-detection" content="telephone=no">` (ADR 0002 §14).

### 3. TypeScript

- **013.** `tsconfig.json`: `noUncheckedIndexedAccess: false`; эталон шаблона — `true` ([setup/frontend.md](../setup/frontend.md) §2.1). Включение даст ошибки типов, которые исправляются в той же задаче.
- **014.** 42 приведения `as` (36 вне тестов): `HTMLElement`, `Record`, `Node`, `unknown` и др. ([ADR 0004](../decisions/common/0004-ts-js-standards.md) §1). Пример: `src/data/schemas.ts:87`.
- **015.** Мелкие правила ADR 0004:
  - 18 вызовов `.then()` (§9), например `src/shared/scripts/career-reveal.ts:151`;
  - мутирующие `.sort()`, `.reverse()`, `.splice()` (§12): `src/data/site.ts:79`, `src/seo/structured-data.ts:62`, `src/shared/scripts/matrix/pills.ts:75`;
  - поиск по `id` вместо `data-*` (§10): `src/shared/scripts/toast.ts:10`, `src/shared/ui/BackToTop/BackToTop.astro:26`; переходы по якорям (`relic/chat.ts`, `Header/header.ts`) — допустимы.

### 4. Документация и приемка

- **016.** В `docs/pages/` только шаблон паспорта; паспортов главной, 404, `/cv/` и `/og/` нет ([workflow.md](../workflow.md) §3: критерии готовности берутся из паспорта).
- **017.** Пост-деплой проверка ADR 0014 §4.6 (Rich Results Test, Schema.org Validator, W3C Nu HTML Checker) не зафиксирована.
- **018.** В PRODUCT.md нет фактов о цели, метрике, аудитории и регионе — их знает только владелец.

### 5. Требуют решения владельца

- **019.** 12 алиасов (`@shared/*`, `@widgets/*`, `@data/*` …) продублированы в `tsconfig.json`, `astro.config.ts` и частично в `vitest.config.ts`; шаблон — один алиас `@/*` ([ADR 0001](../decisions/frontend/0001-project-architecture.md) §3). Алиасы `@typings` и `@hooks` указывают на несуществующие папки и не используются — их стоит удалить при любом решении.
- **020.** Структура `src/` не FSD-Lite: `widgets/components/<Name>/` вместо `widgets/<name>/`, `styles/` и `utils/` вне `shared/`, папки компонентов в PascalCase вместо kebab-case (ADR 0001 §2, ADR 0004 §7). Перенос затрагивает все импорты; польза — только соответствие шаблону. Рекомендация: не переносить и записать отступление в ADR 0024.
- **021.** `trailingSlash: 'always'` (`astro.config.ts`), шаблон — `'never'` (ADR 0013 §1). Смена меняет канонические URL, hreflang и sitemap. Рекомендация: оставить и записать в ADR 0024.
- **022.** Анти-шаблоны [design.md](../design.md) §9: служебные строки через «·» (п. 12, например `imageLine` в `src/data/meta/meta.json`), почти черный фон с красно-оранжевым акцентом (п. 16). Стилистика принята владельцем; нужно решение, записать ли п. 12 и 16 в ADR 0024.
- **023.** `.prettierrc`: `trailingComma: 'es5'`, шаблон — `'all'` (ADR 0009 §1). Смена переформатирует большую часть файлов отдельным коммитом `style:`.

## Подзадачи

| # | Подзадача | Уровень | Исполнитель | Зависит от | Статус |
| --- | --- | --- | --- | --- | --- |
| 1 | Перенос файлов шаблона, удаление старых планов, ссылки | Low | основной агент | — | ☑ |
| 2 | PRODUCT.md, ARCHITECTURE.md, STATE.md, ADR 0024 по фактам сайта | Medium | основной агент | 1 | ☑ |
| 3 | Адаптация AGENTS.md, workflow, skills, tech, субагентов, README | Low | основной агент | 1 | ☑ |
| 4 | Аудит расхождений и бэклог 002–023 | Medium | основной агент | 2 | ☑ |

## Проверки

- Проверка относительных ссылок во всех `*.md` репозитория.
- `bun run format:check`.
- Код сайта не менялся, поэтому линтеры, тесты и сборка не запускались.

## Итог

Шаблон внедрен адаптированно, расхождения — задачи 002–023 в [docs/tasks.md](../tasks.md).
