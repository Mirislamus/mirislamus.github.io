# Текущее состояние проекта (STATE.md)

## Текущий статус

- **Фаза:** сайт опубликован; шаблон ai-template внедрен ([задача 001](docs/tasks/001-ai-template-adoption.md)), бэклог расхождений 002–024 выполнен в ветке `chore/ai-template` ([docs/tasks.md](docs/tasks.md)).
- **Текущая цель:** владелец смотрит ветку и решает, пушить ли ее и вливать в `master`.
- **Блокеры:** отсутствуют.

## Проверки

- Локально на ветке: `bun run check`, `bun run knip`, `bun run test` (156), `bun run test:e2e` (362 в Chromium и WebKit), `bun run check:bundle` (14,6 из 15 КБ), `bun run validate:html`, `bun run check:lighthouse` (Performance 95–97, Accessibility 97–100, Best Practices и SEO 100) — проходят.
- Не проверено: visual regression (эталон снимается только в CI, после правок стилей его нужно обновить workflow «Visual regression» с `update`), job `production` (запустится после деплоя), Rich Results Test и Schema.org Validator (вручную после деплоя).

## Следующий шаг

- Пуш ветки, прогон CI и обновление эталонных скриншотов; затем мерж в `master` с разрешения владельца.
