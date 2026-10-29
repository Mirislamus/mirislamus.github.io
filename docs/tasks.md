# Журнал задач (docs/tasks.md)

Индекс задач проекта. Уровни, процесс и карточки — [docs/workflow.md](workflow.md). Уровень ставится, когда задача берется в работу; для бэклога указан предварительный. Карточка `tasks/NNN-slug.md` создается для уровня Medium и выше.

Работа идет в отдельной ветке; пуш в `master` деплоит сайт, поэтому пуш и мерж — только с разрешения владельца. История задач до внедрения шаблона (RF, F, M, A, J) — в git-истории файлов `docs/tz.md`, `docs/features.md`, `docs/tasks.md`.

| № | Задача | Уровень | Статус | Карточка |
| --- | --- | --- | --- | --- |
| 001 | Внедрение шаблона ai-template и аудит расхождений | Medium | готово | [001](tasks/001-ai-template-adoption.md) |
| 002 | Единая команда `bun run check` (Prettier, ESLint, Stylelint, типы) и `--max-warnings 0` | Low | готово (`e0dd467`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 003 | ESLint: правила ADR 0009 §2 (`any`, `!`, `import type`, промисы, `no-console`, порядок импортов, `eslint-config-prettier`) | Medium | готово (`14d4839`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 004 | Stylelint: правила ADR 0009 §3 (порядок свойств, запрет `rem`/`em`, ID-селекторов, именованных цветов, вложенность ≤ 3) | Medium | готово (`e0325ad, bf3ef75, 4485803`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 005 | `html-validate`: команда `validate:html` и шаг в CI | Low | готово (`11b3997`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 006 | `package.json`: `engines`, `test:watch`, `build:analyze`; `chunkSizeWarningLimit: 250` | Low | готово (`7e74e4e`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 007 | Lighthouse в CI: пороги Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100 | Medium | готово (`8ec6e45`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 008 | e2e: мобильный профиль WebKit и общая проверка ошибок консоли | Medium | готово (`54cd975`) | [001 §1](tasks/001-ai-template-adoption.md#1-инструменты-и-проверки) |
| 009 | Состояния элементов: `:hover` через миксин `hover`, `:focus-visible`, disabled без `pointer-events: none` | Medium | готово (`bbcbcde`) | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 010 | Брейкпоинты: единая шкала 576/768/1024/1280/1440 через миксины `up()`/`down()`; порядок desktop-first сохранен (ADR 0024 §5) | High | готово (`790ceae`) | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 011 | `rem`/`em` в стилях → `px` и токены | Low | готово (`a667392`) | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 012 | `<head>`: preload критического шрифта и `format-detection` | Low | готово (`f887489`) | [001 §2](tasks/001-ai-template-adoption.md#2-стили-и-вёрстка) |
| 013 | `tsconfig.json`: `noUncheckedIndexedAccess: true` | Medium | готово (`a9f1e42`) | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 014 | Приведения типов `as` → сужение типов и `satisfies` | Medium | готово (`9c2dfa9`) | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 015 | `.then()` → `async/await`, мутирующие методы массивов, поиск DOM по `data-*` | Low | готово (`fd6c1ef`) | [001 §3](tasks/001-ai-template-adoption.md#3-typescript) |
| 016 | Паспорта страниц в `docs/pages/`: главная, CV, OG | Medium | готово (`779c480`) | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 017 | Пост-деплой проверка: Rich Results Test, Schema.org Validator, W3C Nu HTML Checker | Low | готово (`9770b9d`) | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 018 | Допрос владельца по пустым разделам PRODUCT.md: цель, метрика, аудитория, регион | Low | готово (`1c9fe58`) | [001 §4](tasks/001-ai-template-adoption.md#4-документация-и-приемка) |
| 019 | Решение владельца: единый алиас `@/*` вместо 12 алиасов | Medium | готово (`f41c6b8`) | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 020 | Решение владельца: структура `src/` остается своей (ADR 0024 §5) | XHigh | готово (`1c9fe58`) | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 021 | Решение владельца: `trailingSlash: 'always'` остается (ADR 0024 §5) | High | готово (`1c9fe58`) | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 022 | Решение владельца: анти-шаблоны docs/design.md §9 и 404 без шапки и подвала — исключения (ADR 0024 §4) | Low | готово (`1c9fe58`) | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 023 | Решение владельца: Prettier `trailingComma: 'all'` | Low | готово (`f5187c8`) | [001 §5](tasks/001-ai-template-adoption.md#5-требуют-решения-владельца) |
| 024 | Комментарии в коде удалены, правило «без комментариев» в AGENTS.md и ADR 0024 §9 (решение владельца) | Medium | готово (`c604c89`) | — |

Статусы: бэклог, в работе, готово.
