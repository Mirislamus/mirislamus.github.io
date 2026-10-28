# Журнал задач (docs/tasks.md)

Индекс задач проекта. Уровни, процесс и карточки — [docs/workflow.md](workflow.md). Уровень ставится, когда задача берется в работу; для бэклога указан предварительный. Карточка `tasks/NNN-slug.md` создается для уровня Medium и выше.

Работа идет в отдельной ветке; пуш в `master` деплоит сайт, поэтому пуш и мерж — только с разрешения владельца. История задач до внедрения шаблона (RF, F, M, A, J) — в git-истории файлов `docs/tz.md`, `docs/features.md`, `docs/tasks.md`.

| № | Задача | Уровень | Статус | Карточка |
| --- | --- | --- | --- | --- |
| 001 | Внедрение шаблона ai-template и аудит расхождений | Medium | готово | [001](tasks/001-ai-template-adoption.md) |
| 002 | Единая команда `bun run check` (Prettier, ESLint, Stylelint, типы) и `--max-warnings 0` | Low | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 003 | ESLint: правила ADR 0009 §2 (`any`, `!`, `import type`, промисы, `no-console`, порядок импортов, `eslint-config-prettier`) | Medium | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 004 | Stylelint: правила ADR 0009 §3 (порядок свойств, запрет `rem`/`em`, ID-селекторов, именованных цветов, вложенность ≤ 3) | Medium | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 005 | `html-validate`: команда `validate:html` и шаг в CI | Low | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 006 | `package.json`: `engines`, `test:watch`, `build:analyze`; `chunkSizeWarningLimit: 250` | Low | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 007 | Lighthouse в CI: пороги Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100 | Medium | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 008 | e2e: мобильный профиль WebKit и общая проверка ошибок консоли | Medium | бэклог | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 009 | Состояния элементов: `:hover` через миксин `hover`, `:focus-visible`, disabled без `pointer-events: none` | Medium | бэклог | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 010 | Брейкпоинты: mobile-first и единая шкала 576/768/1024/1280/1440 через миксины | High | бэклог | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 011 | `rem`/`em` в стилях → `px` и токены | Low | бэклог | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 012 | `<head>`: preload критического шрифта и `format-detection` | Low | бэклог | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 013 | `tsconfig.json`: `noUncheckedIndexedAccess: true` | Medium | бэклог | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 014 | Приведения типов `as` → сужение типов и `satisfies` | Medium | бэклог | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 015 | `.then()` → `async/await`, мутирующие методы массивов, поиск DOM по `data-*` | Low | бэклог | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 016 | Паспорта страниц в `docs/pages/`: главная, CV, OG | Medium | бэклог | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 017 | Пост-деплой проверка: Rich Results Test, Schema.org Validator, W3C Nu HTML Checker | Low | бэклог | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 018 | Допрос владельца по пустым разделам PRODUCT.md: цель, метрика, аудитория, регион | Low | бэклог | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 019 | Решение владельца: единый алиас `@/*` вместо 12 алиасов | Medium | бэклог | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 020 | Решение владельца: структура `src/` под FSD-Lite и kebab-case папок | XHigh | бэклог | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 021 | Решение владельца: `trailingSlash: 'always'` или `'never'` (ADR 0013 §1) | High | бэклог | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 022 | Решение владельца: анти-шаблоны docs/design.md §9 в текстах и стилистике, 404 без шапки и подвала | Low | бэклог | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 023 | Решение владельца: Prettier `trailingComma: 'all'` | Low | бэклог | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |

Статусы: бэклог, в работе, готово.
