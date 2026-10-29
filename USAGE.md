# Руководство по использованию шаблона (USAGE.md)

Инструкция для разработчиков и AI-агентов: как сайт mirislamus.github.io ведется по шаблону ai-template.

---

## 1. Концепция шаблона

`ai-template` — архитектурно-документационный стартовый комплект (meta-template). Сайт создан раньше шаблона, шаблон внедрен в работающий проект ([задача 001](docs/tasks/001-ai-template-adoption.md)). Он дает:

1. **Инженерные стандарты:** реестр архитектурных решений в `docs/decisions/` (перечень — [ARCHITECTURE.md](ARCHITECTURE.md)); отступления сайта — [ADR 0024](docs/decisions/frontend/0024-site-deviations.md).
2. **Оперативные руководства:** дизайн-система, SEO, качество, типографика, регламент навыков.
3. **Эталонные конфиги** ([docs/setup/](docs/setup/common.md): общие настройки, фронтенд, бэкенд) — образец для сверки инструментов сайта (задачи 002–006 в [docs/tasks.md](docs/tasks.md)).

> **Быстрый старт:** откройте чат с AI-агентом в репозитории; правила агент берет из [AGENTS.md](AGENTS.md), текущую цель — из [STATE.md](STATE.md), задачи — из [docs/tasks.md](docs/tasks.md). Для допроса по продукту — промпт из [PROMPT.md](PROMPT.md).

---

## 2. Сценарий работы

```text
[Шаг 1: Паспорт продукта] ➔ [Шаг 2: Выбор стека] ➔ [Шаг 3: Инициализация] ➔ [Шаг 4: Разработка] ➔ [Шаг 5: Приемка]
       PRODUCT.md                 ADR 0001              docs/setup/               docs/pages/*.md        docs/quality.md
```

Шаги 1–3 пройдены до внедрения шаблона; дальше работа идет по шагам 4–5.

### Шаг 1: Паспорт продукта (`PRODUCT.md`)

[PRODUCT.md](PRODUCT.md) заполнен по фактам из кода. Разделы с пометкой «не зафиксирован» закрываются допросом ([PROMPT.md](PROMPT.md), задача 018); крупная новая функция (форма, аналитика, кейсы) — тоже через допрос.

### Шаг 2: Выбор технологического профиля

Профиль — Astro (SSG) без React ([ADR 0001](docs/decisions/frontend/0001-project-architecture.md), [ADR 0024](docs/decisions/frontend/0024-site-deviations.md) §1). Отдельный бэкенд не нужен ([ADR 0019](docs/decisions/backend/0019-backend-architecture.md) §1): форм, БД и авторизации нет.

### Шаг 3: Инициализация кодовой базы

Выполнена. Команды и окружение — [README.md](README.md). Расхождения конфигов сайта с эталоном [docs/setup/frontend.md](docs/setup/frontend.md) — задачи 002–006 и 013. Переменных окружения нет ([.env.example](.env.example)).

### Шаг 4: Верстка страниц

Верстка идет по паспортам страниц в `docs/pages/` (копия [docs/pages/page-template.md](docs/pages/page-template.md) с метаданными по [docs/seo.md](docs/seo.md), секциями, типами компонентов и источниками данных). Паспорта есть у всех страниц сайта: [главная](docs/pages/home.md), [404](docs/pages/404.md), [CV](docs/pages/cv.md), [OG](docs/pages/og.md).

1. Новую страницу без паспорта не верстать: сначала паспорт.
2. Структура кода — [ARCHITECTURE.md](ARCHITECTURE.md).
3. Соблюдайте стандарты: разметка и a11y — [ADR 0002](docs/decisions/frontend/0002-html-standards.md); стили — [docs/design.md](docs/design.md) и [ADR 0003](docs/decisions/frontend/0003-scss-standards.md) с отступлениями из ADR 0024 §4; типографика и тексты — [docs/content.md](docs/content.md).

### Шаг 5: Проверка качества и приемка

Перед сдачей задачи или релизом выполняется Definition of Done из [ADR 0014](docs/decisions/common/0014-testing-and-qa.md) §4:

1. Команды из [AGENTS.md](AGENTS.md) «Команды проекта»; `validate:html` в сайте пока нет (задача 005).
2. Чеклист геометрии и пороги Lighthouse — [docs/quality.md](docs/quality.md); в CI сейчас блокирует только SEO (задача 007).
3. Мобильная верстка 360–390 px без горизонтального скролла; форм на сайте нет.
4. Пост-деплой проверка живого сайта ([ADR 0013](docs/decisions/frontend/0013-seo-standards.md) §4): W3C Nu HTML Checker — `bun run check:production`, сам запускается в CI после деплоя (job `production`); Google Rich Results Test и Schema.org Validator — вручную по тем же страницам.

---

## 3. Работа агента: навыки, задачи и отчет

- Перед стартом задачи агент объявляет применяемые навыки из [docs/skills.md](docs/skills.md) (или пишет «Скилы не требуются»); в итоговом отчете указывает «Использованные скилы».
- Агент оценивает уровень задачи (Low / Medium / High / XHigh); от уровня зависят порядок работы, карточка в `docs/tasks/` и исполнитель. Крупные задачи и целые этапы разбивает `planner`, подзадачи выполняют субагенты из `.claude/agents/` — [docs/workflow.md](docs/workflow.md).
- Регламент поведения агента — [AGENTS.md](AGENTS.md).

---

## 4. Фиксация прогресса и Git

- **Статус:** после каждого этапа обновляются [STATE.md](STATE.md) и [docs/tasks.md](docs/tasks.md).
- **Коммиты ([ADR 0011](docs/decisions/common/0011-git-workflow-and-commits.md)):** Conventional Commits на английском (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`). Пример: `feat(projects): add clip-path reveal to project cards`.
- **Ветки:** работа идет в отдельной ветке; пуш в `master` деплоит сайт на GitHub Pages, поэтому пуш и мерж — только с разрешения владельца.
- **Безопасность:** `git push --force` в `master` и деструктивные сбросы без бэкапа запрещены.
