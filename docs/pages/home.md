# Главная страница (docs/pages/home.md)

Функционально-технический паспорт главной страницы: структура секций, контракты данных, типы компонентов и чеклист приемки. Реализация — `src/pages/[...lang]/index.astro`.

---

## 1. Паспорт страницы и метаданные

- **URL маршрута:** `/` (EN), `/ru/`, `/uz/`.
- **Назначение страницы:** показать уровень, опыт и подход Frontend Engineer и привести рекрутера или заказчика к обращению в Telegram или LinkedIn ([PRODUCT.md](../../PRODUCT.md)).
- **Тип рендеринга:** SSG, Astro без UI-фреймворка ([ADR 0024](../decisions/frontend/0024-site-deviations.md) §1).
- **SEO-метаданные ([docs/seo.md](../seo.md)), источник — `src/data/meta/meta.json`:**
  - `<title>`: «Mirislam Usmanov — Frontend Engineer | React, Next.js, TypeScript» и переводы.
  - `<meta name="description">`: стаж, город, стек; стаж подставляется при сборке.
  - `<h1>`: имя в Hero.
  - `<link rel="canonical">`: абсолютный адрес языковой версии со слэшем на конце ([ADR 0024](../decisions/frontend/0024-site-deviations.md) §5); `hreflang` для трех языков и `x-default`.
  - `og:image`: `/og/mirislam-usmanov-<locale>.jpg`, 1200×630, снимается со страницы [OG](og.md).
  - JSON-LD: `Person`, `WebSite`, `ItemList` проектов, `Review` (`src/seo/structured-data.ts`).

---

## 2. Структура секций страницы (сверху вниз)

Каркас — `src/layouts/Layout.astro`: ссылка «к содержимому», `Header`, `main`, `Footer`, `Toast`, `BackToTop`.

### Шапка

1. **Виджет:** `src/widgets/components/Header/Header.astro`, поведение — `header.ts` (`<site-header>`).
2. **Уровень заголовка:** нет.
3. **Тип компонента:** `.astro` и custom element.
4. **Источник данных:** `src/data/menu/menu.json`, языки — `src/i18n/`.
5. **Интерактив:** якорная навигация с подсветкой текущей секции, выбор языка, выбор темы (светлая, темная, системная) с волной View Transitions, мобильное меню от `< 1024px` с ловушкой фокуса.

### Секция 1: Hero (`#about`)

1. **Виджет:** `src/widgets/components/Hero/Hero.astro`, эффекты — `src/shared/scripts/matrix/hero-fx.ts`.
2. **Уровень заголовка:** `<h1>` — имя.
3. **Тип компонента:** `.astro`; эффекты Matrix (дождь глифов, «жидкий» аватар) загружаются динамическим импортом в простое браузера.
4. **Источник данных:** `src/data/hero/hero.json`, аватар — `src/assets/avatar.png`.
5. **Интерактив:** кнопки «Обсудить проект» и «Скачать резюме» (PDF со страницы [CV](cv.md)), пауза анимаций (`MotionToggle`).

### Секция 2: Approach (`#approach`)

1. **Виджет:** `src/widgets/components/Approach/Approach.astro`.
2. **Уровень заголовка:** `<h2>`, карточки — `<h3>`.
3. **Тип компонента:** `.astro`; демо-чат (`chat-demo.ts`) и карточка «Top secret» (`secret-card.ts`) загружаются при приближении к экрану.
4. **Источник данных:** `src/data/approach/`.
5. **Интерактив:** переключатель типа проекта, копирование email с тостом, появление при прокрутке (`data-reveal`).

### Секция 3: Career (`#career`)

1. **Виджет:** `src/widgets/components/Career/Career.astro`, анимация линии — `career-reveal.ts`.
2. **Уровень заголовка:** `<h2>`, места работы — `<h3>`.
3. **Тип компонента:** `.astro` и карусель `embla-carousel`.
4. **Источник данных:** `src/data/career/`, технологии — `src/data/technologies.json`.
5. **Интерактив:** карусель со стрелками и клавиатурой; область прокрутки получает фокус.

### Секция 4: Projects (`#projects`)

1. **Виджет:** `src/widgets/components/Projects/Projects.astro` (`<projects-list>`), эффекты названий — `projects-fx.ts`.
2. **Уровень заголовка:** `<h2>`, проекты — `<h3>`.
3. **Тип компонента:** `.astro` и custom element.
4. **Источник данных:** `src/data/projects/`, обложки — `src/assets/projects/` (AVIF и WebP, `loading="lazy"`).
5. **Интерактив:** четыре проекта сразу, остальные — по кнопке «Показать ещё»; без JavaScript видны все.

### Секция 5: Skills (`#skills`)

1. **Виджет:** `src/widgets/components/Skills/Skills.astro`.
2. **Уровень заголовка:** `<h2>`, группы — `<h3>`.
3. **Тип компонента:** `.astro`, иконки Simple Icons встраиваются при сборке.
4. **Источник данных:** `src/data/skills/`, число проектов на навык — `src/utils/skill-usage.ts`.
5. **Интерактив:** подсказка «в N проектах» по наведению и по первому тапу.

### Секция 6: Reviews (`#reviews`)

1. **Виджет:** `src/widgets/components/Reviews/Reviews.astro`, расшифровка кавычки — `quote-decode.ts`.
2. **Уровень заголовка:** `<h2>`.
3. **Тип компонента:** `.astro` и бесконечная карусель `embla-carousel`.
4. **Источник данных:** `src/data/reviews/`.
5. **Интерактив:** карусель со стрелками и пагинацией.

### Подвал (`#contacts`)

1. **Виджет:** `src/widgets/components/Footer/Footer.astro`.
2. **Уровень заголовка:** `<h2>` — призыв написать.
3. **Тип компонента:** `.astro`; магнитные кнопки, «кролик» (сцена с таблетками) и чип Relic загружаются по событию.
4. **Источник данных:** `src/data/footer/`, контакты — `src/data/global.ts`, статус и местное время — `src/data/status/`.
5. **Интерактив:** email, Telegram, GitHub, LinkedIn; wordmark из глифов; режим Relic с чатом ([ADR 0024](../decisions/frontend/0024-site-deviations.md) §4).

---

## 3. Модальные окна страницы

- **Сцена с таблетками** (`Pills`) и **сцена Relic** (`Relic`): нативный `<dialog>` с `.showModal()`, Escape и кнопкой закрытия; фокус возвращается на кнопку, открывшую сцену.

---

## 4. Чеклист приемки страницы (Definition of Done)

- [x] Метаданные (`<title>`, `description`, `canonical`, `og:image`) у каждой языковой версии свои (`tests/e2e/seo.spec.ts`).
- [x] Ровно один `<h1>`, иерархия `<h2>`–`<h3>` без пропусков (`tests/e2e/a11y.spec.ts`).
- [x] Секции — `.astro`, клиентский JS в бюджете 15 КБ gzip сразу (`bun run check:bundle`).
- [x] Обложки проектов — AVIF и WebP с явными `width` и `height`.
- [ ] На первом экране нет растрового изображения с `fetchpriority="high"`: аватар рисуется SVG, LCP — текст Hero.
- [x] Нет горизонтального скролла на 390 px (`tests/e2e/smoke.spec.ts`); диапазон 360–1920 px автотестом не проверяется.
- [x] Форм и аналитики нет: пункты шаблона о `trackEvent`, состояниях форм и согласии не применяются.
- [x] `bun run check` проходит без ошибок и предупреждений.
