# SEO: структурированные данные, мета-теги, индексация

Задачи `SEO-01…SEO-09`. Выполняются в ветке `refactor/site-v2` так же, как RF и F: одна задача → коммит → отчёт → «дальше». Прогресс ведётся в [`tasks.md`](./tasks.md), раздел «SEO».

## Цель и рамки

Сайт должен находиться по имени (первое место и карточка с фото и ссылками), а также по профессиональным запросам трёх аудиторий:

| Аудитория                          | Версия | Примеры запросов                                                 |
| ---------------------------------- | ------ | ---------------------------------------------------------------- |
| Рекрутеры и компании по всему миру | EN     | `Mirislam Usmanov`, `frontend engineer React Next.js TypeScript` |
| Клиенты в Узбекистане              | RU, UZ | `frontend разработчик Ташкент`, `frontend dasturchi Toshkent`    |
| Удалённые заказчики из СНГ         | RU     | `frontend разработчик React фриланс`                             |

**Решения владельца (2026-09-30):**

- Домен остаётся `mirislamus.github.io`.
- Новых страниц нет: ни кейсов, ни раздела «Услуги». Работаем только с техникой и текстами.
- В разметку schema.org идут: расширенный `Person` (город, email, образование, языки), проекты, карьера, отзывы.
- Отзывы размечаются текстом на языке страницы, без рейтингов. Источник — Хабр Фриланс (площадка закрыта, поэтому без ссылки).
- Title и description: роль + стек + город. В RU/UZ title используется поисковая форма «Frontend-разработчик» / «Frontend dasturchi»; должность в Hero и в JSON-LD остаётся `Frontend Engineer` (решение из `tz.md`, RF-21 п. 9).
- OG-картинка своя для каждого языка, генерируется при сборке.
- **Не делаем:** IndexNow, Bing Webmaster Tools, `llms.txt`, блокировку AI-краулеров, узбекский в списке языков резюме, рейтинги и `AggregateRating`.

## Аудит текущего состояния

Уже есть: canonical и `hreflang` без редиректов, `og:*` и `twitter:*`, sitemap с языковыми альтернативами, JSON-LD `ProfilePage` + `Person`, верификация Google и Яндекса, `noindex` у `/cv/*` и 404, `lang` у `<html>`, один `h1`, заголовки без пропусков.

| # | Проблема | Где |
| --- | --- | --- |
| S1 | Нет `robots.txt`: `/robots.txt` отдаёт 404, sitemap нигде не объявлен (Яндекс и прочие роботы узнают о нём только из Вебмастера). | `public/` |
| S2 | В sitemap нет `x-default` и `lastmod`. | `astro.config.ts` |
| S3 | Нет `favicon.ico`, `apple-touch-icon`, web manifest. Поисковики берут фавиконку для выдачи из `/favicon.ico` или из первой `<link rel="icon">`; у нас две SVG с `media`, которые роботы не учитывают. | `Head.astro`, `public/` |
| S4 | `Person` минимальный: нет альтернативных написаний имени, города, email, места работы, образования, языков. `knowsAbout` — захардкоженный список из 8 пунктов, расходится с 26 навыками в данных. `image` указывает на баннер 1200×630, а не на фото. | `Head.astro:22-40` |
| S5 | Нет узла `WebSite` (Google берёт из него название сайта для выдачи); у `ProfilePage` нет `dateCreated`/`dateModified`. Проекты, карьера и отзывы в разметке не описаны. | `Head.astro` |
| S6 | OG-картинка одна на все языки и устарела: подпись «Front-end developer» зелёным, а сейчас роль `Frontend Engineer` и акцент `#ff6433`. Нет `og:site_name`, `og:locale:alternate`; `og:type` = `website` вместо `profile`. | `public/opengraph.jpg`, `Head.astro` |
| S7 | Title — только имя и роль, description без стека и города: по профессиональным и локальным запросам страница почти не ранжируется. | `meta.json` |
| S8 | В `h1` только имя, роль — соседний `<strong>`. | `Hero.astro:36-37` |
| S9 | Нет автоматических проверок SEO: мета-теги и JSON-LD не тестируются, цель Lighthouse SEO = 100 из `tz.md` не замерялась. | `tests/`, CI |
| S10 | Нет `<meta name="robots" content="max-image-preview:large">`: Google может показывать в выдаче только маленькое превью картинки. | `Head.astro` |

## Задачи

### SEO-01. Индексация: robots.txt, sitemap, meta robots

- **Приоритет:** P0 (закрывает S1, S2, S10). **Оценка:** 1,5 ч.
- **Файлы:** `public/robots.txt`, `astro.config.ts`, `src/seo/last-modified.ts`, `Head.astro`.
- **Что сделать:**
  1. `robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://mirislamus.github.io/sitemap-index.xml`. `/cv/` не закрываем: HTML-страницы CV уже `noindex` (робот должен их прочитать, чтобы увидеть это), а PDF-резюме в выдаче по имени — плюс. Адрес сайта берётся из `site` (генерировать файл при сборке, а не хардкодить).
  2. `src/seo/last-modified.ts` — дата последнего коммита (`git log -1 --format=%cI`); если git недоступен — время сборки. Одна функция для sitemap и JSON-LD (SEO-03).
  3. Sitemap: `lastmod` из п. 2; через `serialize` добавить `x-default` → `/` к альтернативам каждого URL.
  4. `Head.astro`: `<meta name="robots" content="max-image-preview:large">` на основных страницах; у CV и 404 остаётся `noindex`.
- **Приёмка:** `/robots.txt` отдаёт 200 со строкой `Sitemap`; у каждого `<url>` в `sitemap-0.xml` есть `lastmod` и четыре `xhtml:link` (en, ru, uz, x-default); `/cv/` и `/404` в sitemap по-прежнему нет.

### SEO-02. Иконки и web manifest

- **Приоритет:** P2 (закрывает S3). **Оценка:** 1,5 ч.
- **Файлы:** `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png`, `public/manifest.webmanifest`, `scripts/icons.mjs`, `Head.astro`.
- **Что сделать:**
  1. `scripts/icons.mjs` — одноразовый генератор PNG/ICO из существующего логотипа (через `sharp`, который уже есть в зависимостях Astro). Результат коммитится в `public/`; скрипт остаётся в репозитории для пересборки.
  2. `favicon.ico` (16, 32, 48) — нейтральный вариант, читаемый и на светлом, и на тёмном фоне (для выдачи поисковиков). SVG-фавиконки с `media` для браузеров остаются.
  3. `manifest.webmanifest`: `name`, `short_name`, `icons` (192, 512, maskable), `theme_color`/`background_color` из `THEME_COLORS`, `start_url: "/"`, `display: "browser"` (сайт не PWA, сервис-воркера нет).
  4. `Head.astro`: `<link rel="icon" href="/favicon.ico" sizes="48x48">` (первым), `apple-touch-icon`, `manifest`.
- **Приёмка:** все файлы отдают 200; manifest валиден (DevTools → Application без ошибок); вкладка браузера в обеих темах показывает прежнюю SVG-иконку.

### SEO-03. Модуль структурированных данных

- **Приоритет:** P1 (закрывает S5, основа для SEO-04/05). **Оценка:** 3 ч.
- **Файлы:** `src/seo/structured-data.ts`, `src/seo/structured-data.test.ts`, `Head.astro`, `package.json` (devDependency `schema-dts`).
- **Что сделать:**
  1. Вынести JSON-LD из `Head.astro` в чистую функцию `buildStructuredData(locale, site)`: на вход — локаль и `SiteData`, на выход — один объект `{ '@context', '@graph': [...] }`. Типизация через `schema-dts` (только типы, в сборку не попадают).
  2. Узлы и стабильные `@id` (одинаковые на всех языках, чтобы поисковик склеил их в одну сущность):
     - `WebSite` — `https://mirislamus.github.io/#website`: `url`, `name` = «Mirislam Usmanov», `alternateName` = имена на RU/UZ и `mirislamus`, `inLanguage` = все локали, `publisher` → `#person`.
     - `ProfilePage` — `{canonical}#profile-page`: `url`, `name`, `description`, `inLanguage`, `isPartOf` → `#website`, `mainEntity` → `#person`, `dateCreated` = `2025-03-26` (первый коммит репозитория; владелец может поправить), `dateModified` из SEO-01 п. 2.
     - `Person` — `https://mirislamus.github.io/#person`: пока текущие поля; расширяется в SEO-04.
  3. Никаких строк вне данных: имя, описание, должность берутся из `SiteData`; плейсхолдеры (`{{years}}`) подставлены, разметка rich-text (`|…|`, `||…||`) снята через `toPlainText`.
  4. Unit-тесты: валидный JSON, нет `{{` и `|`, `@id` одинаковые во всех локалях, все ссылки `{ '@id' }` указывают на существующие узлы графа.
- **Приёмка:** HTML страниц отличается от прежнего только содержимым `<script type="application/ld+json">`; тесты проходят; Rich Results Test на локальном HTML (вставка кода) — 0 ошибок, распознан «Profile page».

### SEO-04. Person: данные о человеке

- **Приоритет:** P1 (закрывает S4). **Оценка:** 2,5 ч.
- **Файлы:** `src/seo/structured-data.ts`, `src/data/cv/cv.json`, `src/data/schemas.ts`, `src/utils/images.ts`.
- **Что сделать:** у `Person` появляются поля (все из существующих данных сайта):

  | Поле | Источник |
  | --- | --- |
  | `name` | `meta.name` текущей локали |
  | `alternateName` | имена двух других локалей + `mirislamus` |
  | `jobTitle` | `hero.role` (`Frontend Engineer`) |
  | `description` | текст Hero с подставленным стажем |
  | `image` | `ImageObject` с фото из `avatar.png` (абсолютный URL собранного файла, `width`, `height`) |
  | `email` | `mailto:` из `global.ts` |
  | `address` | `PostalAddress`: `addressLocality` = `status.city` текущей локали, `addressCountry` = `UZ` |
  | `knowsAbout` | названия всех навыков из `skills.base.json` (вместо захардкоженного списка) |
  | `knowsLanguage` | `Language` из `cv.json → languages`; в элементы добавляется поле `code` (`ru`, `en`), схема проверяет одинаковые коды во всех локалях |
  | `alumniOf` | `EducationalOrganization` из `cv.json → education` (`name` = `institution`) |
  | `sameAs` | Telegram, GitHub, LinkedIn (как сейчас) |

- **Приёмка:** unit-тест проверяет каждое поле по данным; при добавлении навыка в `skills.base.json` он появляется в `knowsAbout` без правок кода; телефон и дата рождения в разметку не попадают.

### SEO-05. Карьера, проекты и отзывы в разметке

- **Приоритет:** P1 (закрывает S5). **Оценка:** 4 ч.
- **Файлы:** `src/seo/structured-data.ts`, `src/data/career/career.base.json`, `src/data/career/career.json`, `src/data/schemas.ts`, `Career.astro`, `Cv.astro`.
- **Что сделать:**
  1. **Данные карьеры.** Сейчас годы — свободный текст в каждой локали (`"2024 — Present"`). В `career.base.json` добавить `start` (год), `end` (год или `null` для текущего места) и необязательный `url` компании; в `career.json` поле `year` заменить одной строкой `present` на локаль. Видимая подпись собирается из этих полей и остаётся прежней (у прошлых мест — год начала, у текущего — «2024 — Present»). Годы окончания по умолчанию — год начала следующего места; **владелец проверяет их перед коммитом**.
  2. **Карьера.** `Person.worksFor` — массив `EmployeeRole` (новое сверху): `roleName` = должность, `startDate`, `endDate` (у текущего места нет), `worksFor` = `Organization` (`name`, `url`, если есть).
  3. **Проекты.** Узел `ItemList` — `{canonical}#projects`: `name` = заголовок секции, `itemListElement` = `ListItem` → `WebSite` (`@id` = `https://mirislamus.github.io/#project-{id}`, `name`, `url`, `description` на языке страницы, `image` = абсолютный URL скриншота, `keywords` = стек, `creator` → `#person`). Порядок как на странице.
  4. **Отзывы.** Узлы `Review` (`@id` = `https://mirislamus.github.io/#review-{id}`): `itemReviewed` → `#person`, `author` = `Person` (`name`), `reviewBody` = текст на языке страницы, `inLanguage`, `publisher` = `Organization` «Habr Freelance» / «Хабр Фриланс» (по локали, без `url`). Без `reviewRating`: рейтингов на сайте нет, выдумывать их нельзя. Звёзд в выдаче не будет — Google не показывает review-сниппеты для `Person`; цель — связать отзывы с сущностью.
- **Приёмка:** видимая карьера на трёх языках и в PDF-резюме не изменилась (визуальная регрессия проходит); количество и порядок проектов и отзывов в разметке совпадают со страницей; validator.schema.org — 0 ошибок и 0 предупреждений на всех трёх локалях (вставка HTML).

### SEO-06. Title, description, h1

- **Приоритет:** P1 (закрывает S7, S8). **Оценка:** 1,5 ч.
- **Файлы:** `src/data/meta/meta.json`, `Hero.astro`, `Hero.module.scss`, `src/shared/scripts/intro.ts`.
- **Что сделать:**
  1. Title и description (черновик; **владелец утверждает формулировки, UZ стоит показать носителю**). Длина после подстановки стажа: title ≤ 70 символов, description ≤ 160.

     |  | Title | Description |
     | --- | --- | --- |
     | EN | Mirislam Usmanov — Frontend Engineer \| React, Next.js, TypeScript (65) | Frontend Engineer in Tashkent with {{years}}+ years of experience building fast, accessible websites and web apps with React, Next.js and TypeScript. (≈140) |
     | RU | Мирислам Усманов — Frontend-разработчик в Ташкенте \| React, Next.js (67) | Frontend-разработчик в Ташкенте, опыт более {{years}} лет: быстрые и доступные сайты и веб-приложения на React, Next.js и TypeScript. Проекты, отзывы, контакты. (≈152) |
     | UZ | Mirislam Usmonov — Frontend dasturchi, Toshkent \| React, Next.js (64) | Toshkentdagi Frontend dasturchi, {{years}}+ yillik tajriba: React, Next.js va TypeScript’da tezkor va qulay veb-saytlar hamda ilovalar. Loyihalar, fikrlar, aloqa. (≈154) |

  2. `meta.imageAlt` не меняется: он описывает картинку, а не страницу.
  3. `h1`: роль переносится внутрь заголовка отдельным блоком — `<h1><span>Mirislam Usmanov</span> <span class="role">Frontend Engineer</span></h1>`. Внешний вид, интро-анимация по словам (только имя) и размеры не меняются. Скрытого текста не добавляем.
- **Приёмка:** визуальная регрессия проходит без обновления эталонов; `h1` на странице один и содержит имя и роль; длины в пределах (проверяется тестом в SEO-08).

### SEO-07. OG-картинки по языкам и OG-теги

- **Приоритет:** P2 (закрывает S6). **Оценка:** 4 ч.
- **Файлы:** `src/pages/og/[lang].astro`, `scripts/render.mjs` (общий механизм рендера CV и OG), `scripts/build-media.mjs`, `astro.config.ts`, `Head.astro`, `public/opengraph.jpg` (удалить).
- **Что сделать:**
  1. Страница-шаблон `/og/{en,ru,uz}/` (`noindex`, вне sitemap, как CV): 1200×630, тёмная тема сайта, логотип, фото из `avatar.png`, имя на языке страницы, роль `Frontend Engineer` акцентом `#ff6433`, строка «{{years}}+ лет опыта · Ташкент» на языке страницы, адрес сайта. Шрифт Inter из сайта. Важное держать в центральной зоне (≈ 630×630): Telegram и WhatsApp обрезают картинку до квадрата.
  2. Рендер при сборке тем же механизмом, что PDF резюме (Playwright, `astro:build:done`; в dev — middleware): скриншот в `dist/og/mirislam-usmanov-{lang}.jpg`, JPEG, ≤ 300 КБ (ограничение WhatsApp). Общий код CV и OG вынести, а не копировать. Ежемесячная пересборка из RF-19 обновляет стаж на картинке.
  3. `Head.astro`: `og:image`/`twitter:image` → картинка текущей локали, `og:image:type`, `og:site_name` = «Mirislam Usmanov», `og:locale:alternate` для двух других локалей, `og:type` = `profile` + `profile:first_name`, `profile:last_name`, `profile:username` = `mirislamus`.
  4. `public/opengraph.jpg` удалить (после SEO-04 на него ничего не ссылается).
- **Приёмка:** три JPEG 1200×630 ≤ 300 КБ в `dist/og/`; у каждой локали свой `og:image`, ответ 200; без Chromium сборка предупреждает, а CI падает на тесте SEO-08; превью в Telegram (через @WebpageBot) и LinkedIn Post Inspector проверяет владелец после деплоя (SEO-09).

### SEO-08. Автотесты SEO и Lighthouse в CI

- **Приоритет:** P1 (закрывает S9). **Оценка:** 3 ч.
- **Файлы:** `tests/e2e/seo.spec.ts`, `scripts/lighthouse.mjs`, `package.json`, `.github/workflows/deploy.yml`.
- **Что сделать:**
  1. e2e `tests/e2e/seo.spec.ts` для `/`, `/ru/`, `/uz/`:
     - title ≤ 70 и description ≤ 160 символов, без `{{`; один `h1` с именем и ролью;
     - canonical = URL страницы; `hreflang` для всех локалей + `x-default`, все отвечают 200;
     - `og:*`: `og:url` = canonical, `og:image` своей локали отвечает 200 и имеет размер 1200×630, есть `og:locale:alternate`;
     - JSON-LD: парсится, в `@graph` есть `WebSite`, `ProfilePage`, `Person`, `ItemList`, `Review`; `@id` у `#person` одинаковый во всех локалях; число проектов и отзывов совпадает с DOM;
     - `robots.txt`, `sitemap-index.xml`, `favicon.ico`, `manifest.webmanifest` отвечают 200; URL в sitemap побайтно совпадают с canonical.
  2. Lighthouse (devDependency `lighthouse` с точной версией, Chromium из Playwright): `bun run check:lighthouse` проверяет SEO, Best Practices и Accessibility на трёх локалях на собранном сайте. Порог: SEO = 100, остальные категории выводятся в отчёт. Шаг в CI после e2e.
- **Приёмка:** тесты и Lighthouse проходят в CI; если сломать canonical, title или JSON-LD, падает понятный тест (проверено вручную).

### SEO-09. После деплоя (владелец) ⏸

Выполняется после мёржа в `master` и деплоя. Делает владелец, мне — отметить результаты в `tasks.md`.

- [ ] Rich Results Test и validator.schema.org для `/`, `/ru/`, `/uz/`: 0 ошибок.
- [ ] Google Search Console: отправить `sitemap-index.xml` заново; «Проверить URL» → «Запросить индексирование» для трёх страниц.
- [ ] Яндекс Вебмастер: sitemap, «Переобход страниц» для трёх URL, «Региональность» → Ташкент.
- [ ] Превью ссылок: Telegram (@WebpageBot сбрасывает кэш), LinkedIn Post Inspector, WhatsApp.
- [ ] Через 4–6 недель: в Search Console в отчёте «Страница профиля» нет ошибок; по запросу «Mirislam Usmanov» сайт на первом месте, а в выдаче показывается название сайта «Mirislam Usmanov», а не `mirislamus.github.io`.

## Порядок и зависимости

SEO-01 → SEO-02 → SEO-03 → SEO-04 → SEO-05 → SEO-06 → SEO-07 → SEO-08 → SEO-09. SEO-04 и SEO-05 опираются на модуль из SEO-03; тесты SEO-08 проверяют результат всех предыдущих задач, поэтому идут последними. Итого ≈ 21 ч.

## Вне рамок

Свой домен, страницы кейсов, раздел «Услуги», блог, IndexNow, Bing Webmaster Tools, `llms.txt`, блокировка AI-краулеров, рейтинги в отзывах, Google Business Profile. Производительность (Core Web Vitals) уже закрыта в `tz.md`.
