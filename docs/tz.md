# ТЗ: mirislamus.github.io — финальная версия

Дата: 30 сентября 2026 Объект: репозиторий `mirislamus.github.io` (ветка `master`, коммит `ebb971b`) Тип работ: рефакторинг архитектуры, производительности, доступности и инфраструктуры; согласованные правки контента. Визуальный дизайн в рамках этого ТЗ не меняется.

Это единственное актуальное ТЗ. Оно объединяет инженерный аудит и инженерную часть бывшего плана /boost (`boost-tz.md`, `tasks.md`) и заменяет его, а также `SITE_AUDIT_TZ.md`; старые файлы удалены (остались в git-истории). Разбор /boost — в разделе 10.

Анимации, редизайн отдельных блоков и новые фичи вынесены в [`features.md`](./features.md) и начинаются после фазы 2 этого ТЗ.

---

## 1. Цели

1. **Убрать React полностью.** Сайт становится чистым Astro с минимальными клиентскими скриптами на TypeScript. Из зависимостей уходят `react`, `react-dom`, `@astrojs/react`, `swiper` (заменяется на ванильный `embla-carousel`), `sonner`, `lucide-react`, `nanostores`, `@nanostores/react`, `gsap`, `@gsap/react`, `motion`, `clsx`.
2. **Исправить подтверждённые дефекты:** надёжность темы, SEO-URL, контраст, поведение и доступность компонентов.
3. **Навести порядок в коде:** мёртвый код, дублирование, типизация и валидация данных, единый i18n-слой.
4. **Настроить инфраструктуру качества:** воспроизводимая сборка, quality gates в CI, e2e-тесты с axe, бюджет бандла.
5. **Сохранить внешний вид.** Отличия от текущей версии допустимы только там, где это прямо указано в ТЗ (контраст, фокус, reduced motion).

## 2. Текущее состояние (замеры)

### 2.1. Проверки

| Команда         | Результат                                                        |
| --------------- | ---------------------------------------------------------------- |
| `bun run lint`  | exit 0                                                           |
| `bun run check` | 0 errors, 0 warnings, 1 hint (deprecated `document.execCommand`) |
| `astro build`   | сборка проходит                                                  |

### 2.2. Клиентский JavaScript (production build, gzip)

| Чанк | raw | gzip | Когда грузится |
| --- | --: | --: | --- |
| `client.*.js` (React DOM) | 210.6 КБ | 66.7 КБ | при загрузке |
| `gsap.*.js` | 70.5 КБ | 27.9 КБ | сразу после гидратации Avatar |
| `swiper.*.js` | 87.5 КБ | 27.5 КБ | при появлении Career/Reviews |
| `dist.*.js` (вероятно, sonner) | 34.5 КБ | 9.8 КБ | при загрузке (`ToastProvider client:load`) |
| `MorphSVGPlugin.*.js` | 20.2 КБ | 9.4 КБ | сразу после гидратации Avatar |
| Острова (Reviews, Header, Career, Approach, Projects, Avatar) | ≈58 КБ | ≈23 КБ | по видимости |
| Прочее (lucide, stores, хуки, runtime) | ≈25 КБ | ≈11 КБ | вместе с островами |
| **Итого** | **≈507 КБ** | **≈176 КБ** |  |

На первый экран приходится около 125 КБ gzip (React, Header, sonner, Avatar с GSAP). Функционально весь этот JS обслуживает: меню, переключатель темы и языка, две карусели, копирование email, кнопку «Показать ещё» и морфинг аватара.

### 2.3. Размер деплоя

`dist/` весит **9.7 МБ**. Из них **7.8 МБ** занимают JPG-оригиналы проектов (`public/images/projects/*.jpg`, 0.3–1.3 МБ каждый). Их получает только браузер без поддержки WebP, то есть на практике никто.

### 2.4. Что уже сделано хорошо

- Строгий TypeScript (`astro/tsconfigs/strict`), lint и check зелёные.
- Skip-link, focus trap в мобильном меню, закрытие по `Escape`, `inert` на фоне, взаимоисключение меню и списка языков.
- Самостоятельно размещённый Inter с сабсетами по `unicode-range`.
- Canonical, `hreflang`, Open Graph, JSON-LD `ProfilePage`/`Person`, sitemap.
- Скрипт проверки внешних ссылок `scripts/check-links.mjs`.
- Cross-document View Transitions при смене языка с учётом `prefers-reduced-motion`.
- Аватар не запускает анимацию при `prefers-reduced-motion: reduce`.

---

## 3. Найденные проблемы

Приоритеты: **P0** — дефект, видимый пользователю или поисковику; **P1** — существенный технический долг или риск; **P2** — качество кода и гигиена.

### 3.1. P0: дефекты

| # | Проблема | Где | Последствие |
| --- | --- | --- | --- |
| D1 | Все цветовые токены (`--background`, `--text`, `--accent`…) объявлены **только** внутри `[data-theme='light' | 'dark']`. Атрибут ставит инлайн-скрипт, который читает `localStorage`без`try/catch`. | `src/styles/helpers/_variables.scss:64-94`, `src/layouts/Head.astro:80-90` | Если JS выключен или `localStorage` бросает `SecurityError` (заблокированные cookies, некоторые приватные режимы), `data-theme` не ставится, и страница рендерится без цветов. |
| D2 | Canonical, `hreflang`, `og:url` и ссылки переключателя языка указывают на `/ru` и `/uz` без завершающего слэша. Физически страницы лежат в `/ru/index.html`. | `src/layouts/Head.astro:14`, `src/widgets/components/Header/Header.tsx:146-165` | GitHub Pages отвечает 301 на `/ru/`: canonical указывает на редирект, а sitemap, скорее всего, содержит URL со слэшем (проверить `dist/sitemap-0.xml`). Лишний редирект при каждой смене языка. |
| D3 | `--accent-text: #ff6433` в светлой теме даёт контраст ≈2.95:1 на белом (норма WCAG AA для текста — 4.5:1). | `src/styles/helpers/_variables.scss:73` | Не проходят AA: роль в Hero, выделенные слова в заголовках секций, активный и hover-пункт меню, hover outline-кнопки. **Принято владельцем как исключение, цвет не меняется** (раздел 9). |
| D4 | Индикатор активного пункта меню (`.line`) пересчитывается только при смене `activeId`. | `src/widgets/components/Header/Header.tsx:46-56` | После ресайза окна или подгрузки шрифта (`font-display: swap` меняет ширину ссылок) полоска стоит не на своём месте и не той ширины, пока пользователь не проскроллит в другую секцию. |
| D5 | Кнопка «Показать ещё» в Projects добавляет искусственную задержку `setTimeout(500)` со скелетонами. Проекты 5–8 отсутствуют в HTML. | `src/widgets/components/Projects/Projects.tsx:28-34` | Пользователь ждёт без причины, поисковик и пользователь без JS видят только 4 проекта из 8. |
| D6 | Картинка кода в Approach рендерится только после гидратации (`isHydrated && <img …>`). | `src/widgets/components/Approach/Approach.tsx:98` | Картинки нет в HTML, она «выпрыгивает» после загрузки React. |
| D7 | Копирование email сначала вызывает устаревший `document.execCommand('copy')` через скрытую `textarea` с `focus()` и только при неудаче пробует Clipboard API. | `src/shared/hooks/useCopyToClipboard.ts:17,61-63` | Порядок перевёрнут: основной путь — deprecated API. `textarea.focus()` уводит фокус с кнопки, и клавиатурный пользователь теряет позицию. |
| D8 | Footer передаёт `isExternal` для `mailto:`, и ссылка получает `target="_blank"`. | `src/widgets/components/Footer/Footer.astro:21` | При клике по email открывается пустая вкладка. |

### 3.2. P1: архитектура и производительность

| # | Проблема | Где |
| --- | --- | --- |
| A1 | Около 176 КБ gzip JS ради простых взаимодействий (см. 2.2). React-рантайм (67 КБ) нужен шести островам, из которых Approach и Projects фактически статичны. | `src/pages/[...lang]/index.astro:17-21`, `src/layouts/Layout.astro:26,30` |
| A2 | Локаль для React-островов передаётся через **глобальный мутируемый атом**: `localeAtom.set(locale)` во frontmatter Layout на сервере. Это работает только потому, что страницы собираются последовательно. При `build.concurrency > 1` или при рендере по запросу локали перемешаются. | `src/layouts/Layout.astro:14`, `src/shared/stores/locale.ts` |
| A3 | GSAP (28 КБ) и MorphSVGPlugin (9 КБ) грузятся ради одной декоративной анимации. Обе формы (`shape1`, `shape2`) имеют одинаковую структуру команд (`M` + 4×`C` + `Z`), поэтому их можно морфить нативно (SMIL `<animate attributeName="d">`) без библиотек. | `src/shared/ui/Avatar/Avatar.tsx:20-31,63-75` |
| A4 | Список локалей захардкожен в шести местах: `astro.config.ts`, `typings/global.ts`, `stores/locale.ts`, `Head.astro` (`localePaths`, `ogLocales`), `Header.tsx` (`langsData`), `index.astro` (`getStaticPaths`). Добавление языка требует правок во всех. | перечисленные файлы |
| A5 | Данные не валидируются. JSON приводится через `as Record<string, X>`, паритет ключей между `en`/`ru`/`uz` никто не проверяет, а часть файлов (`approach`, `hero`, `a11y`) вообще не типизирована. | `src/typings/data.ts`, `src/data/**` |
| A6 | В JSON три самодельных мини-DSL с тремя разными парсерами: ` | выделение | ` (`useTextHighlight`, а в `Skills.astro`отдельный`split(' | ')`, который ломается при двух выделениях), ` |  | domain |  | ` (`parseLinks`), `{{var}}` (`applyVariable`). | `src/shared/hooks/useTextHighlight.tsx`, `src/utils/text.tsx`, `src/widgets/components/Skills/Skills.astro:8` |
| A7 | Логика темы продублирована: инлайн-скрипт в `Head.astro` и `src/utils/theme.ts`. Ключ `'theme'` и цвета `#121212`/`#ffffff` захардкожены в обоих местах. `themeAtom` по умолчанию `'dark'`, что расходится с фактической темой до инициализации. | `src/layouts/Head.astro:80-90`, `src/utils/theme.ts`, `src/shared/stores/theme.ts:6` |
| A8 | Изображения проектов конвертируются самописным `convert.mjs`. Скрипт глотает ошибки (exit 0), решает о пересборке по `mtime` (после `git clone` поведение непредсказуемо), а результаты (`*.webp`) коммитятся в git рядом с исходниками. Astro умеет это из коробки (`astro:assets`, `<Picture>`). | `convert.mjs:26,58-60`, `package.json:6-9` |
| A9 | Стаж («8+ лет») и год в копирайте вычисляются во время сборки, а в `meta.json` число «8+» захардкожено. После июня 2027 Hero покажет «9», а meta — «8+». Без пуша сайт не пересобирается. | `src/widgets/components/Hero/Hero.astro:11-12`, `src/data/meta/meta.json:5,12,19`, `Footer.astro:30` |
| A10 | CI деплоит без каких-либо проверок. Используется `bun-version: 'latest'` и `bun install` без `--frozen-lockfile`, в репозитории два lock-файла (`bun.lock` и `package-lock.json`). Сборка невоспроизводима. | `.github/workflows/deploy.yml:31,38,42` |

### 3.3. P1: ассеты

| # | Проблема | Размер |
| --- | --- | --: |
| S1 | JPG-оригиналы проектов в `public/` попадают в деплой | 7.8 МБ |
| S2 | Неиспользуемые шрифты `public/fonts/SFProDisplay-*.woff2` (в коде нет ни одной ссылки) | 388 КБ |
| S3 | `public/images/skills/zustand.svg` (иконка 72×72) | 137 КБ |
| S4 | `public/images/avatar.png` (показывается в 260×260) | 120 КБ |
| S5 | Неиспользуемые `public/images/ui.svg`, `ui-light.svg`, `ui-dark.svg` и, вероятно, `public/icons/logo.svg` | 8 КБ |
| S6 | У темозависимых иконок Skills в DOM лежат оба `<img>`, и браузер качает оба (12 лишних запросов). У иконок и SVG в Approach нет `loading="lazy"`. | `Skills.astro:20-35`, `Approach.tsx:40,44` |

### 3.4. P1: доступность

| # | Проблема | Где |
| --- | --- | --- |
| X1 | Контраст `--accent-text` (см. D3). | `_variables.scss:73` |
| X2 | Фокус-кольцо сделано через `box-shadow` без `outline`. В режиме Windows High Contrast / `forced-colors` box-shadow не рисуется, и фокус невидим. | `src/styles/base/_all.scss:63-65`, `Button.module.scss:12-14` |
| X3 | Карточка проекта целиком обёрнута в `<a>`, а `alt` у картинки дублирует `h3`. Скринридер зачитывает название дважды плюс описание и все теги как имя ссылки. | `Projects.tsx:47-65` |
| X4 | Бесконечная анимация `StarBorder` не отключается при `prefers-reduced-motion`. | `StarBorder.module.scss:15,26` |
| X5 | `aria-label="Mirislam Usmanov"` у аватара захардкожен на английском (в RU и UZ имя пишется иначе) и дублирует `h1` рядом. | `Avatar.tsx:41` |
| X6 | Анимация появления текста в футере срабатывает при загрузке страницы, когда футер за экраном. Пользователь её никогда не видит. | `Footer.module.scss:13` |
| X7 | Reviews: Swiper с `loop` клонирует слайды, и скринридер встречает дубликаты. | `Reviews.tsx:59` |

### 3.5. P2: качество кода

| # | Проблема | Где |
| --- | --- | --- |
| C1 | Мёртвый код: barrel-файлы `shared/ui/index.ts`, `shared/hooks/index.ts`, `widgets/components/index.ts` (нигде не импортируются); `LazyMotionWrapper.tsx`; `RotatingText/*`; `initTheme()`; `setLocale()`; default-экспорты `Projects` и `ProjectSkeleton`; параметр `duration` в `useRipple`; ключи `footer.json → talk`, `meta.json → link`. Зависимости `motion` и `@gsap/react` используются только мёртвым кодом. | указанные файлы |
| C2 | `useClickOutside` получает новый массив `refs` на каждом рендере, поэтому эффект переподписывает listeners при каждом рендере Header. Слушатели висят, даже когда список закрыт. | `Header.tsx:44`, `useClickOutside.ts:26` |
| C3 | `Button` импортируется в Astro-компоненты (Hero, Footer) без директивы гидратации: `onClick` и ripple там молча не работают, а в React-островах работают. Поведение одной кнопки разное. | `Hero.astro:23`, `Footer.astro:21-26`, `Button.tsx` |
| C4 | Hero-типографика и размеры считаются через `vh()`, то есть `max(x/800 × 100vh, x px)`. Размер шрифта зависит от **высоты** окна: на вертикальном мониторе 2160 px высотой `h1` получается ≈150 px. | `Hero.module.scss`, `_functions.scss:7-9` |
| C5 | Магические числа, которые ломаются при длинных переводах: мобильное меню `height: 383px`, `.line { bottom: -21px }`, фиксированные высоты строк грида Approach в px при `overflow: hidden` у карточек (длинный RU/UZ-текст обрежется). | `Header.module.scss:43,118`, `Approach.module.scss:10,22,140,164,205` |
| C6 | Reviews: пагинация Swiper переопределяется через `!important`, `onBeforeInit` с non-null assertions. | `Reviews.module.scss:48-53,92`, `Reviews.tsx:42-46` |
| C7 | Импорты в `Career.tsx` идут после объявления константы. Подпись «Технологии» выводится только у первой карточки (`index === 0`). | `Career.tsx:10-15,80` |
| C8 | Стек в данных записан в разных форматах: в Career `"ts"`, `"chakra.ui"`, `"next.js"`, `"tailwind"`, в Projects `"TypeScript"`, `"Chakra UI"`, `"Next.js"`. | `career.json`, `projects.json` |
| C9 | CSS: два токена перехода с разными кривыми (`--transition: ease-in`, `--transition-ease: ease`) используются вперемешку; миксин `sr-only`, миксин `visually-hidden` и утилита `.visually-hidden` дублируют друг друга; `_variables.scss` делает ненужный `@use mixins`; сломан отступ в `_variables.scss:73`. | `src/styles/**` |
| C10 | PostCSS: `autoprefixer` дублирует `postcss-preset-env` (он уже включает autoprefixer); `cssnano` работает поверх минификации Vite (двойная минификация); `browserslist` не задан, поэтому цели сборки неявные. | `postcss.config.js`, `package.json` |
| C11 | ESLint не подключает правила a11y (`eslint-plugin-astro` → `jsx-a11y-*`) и правила хуков. Скрипт `lint` использует флаг `--ext`, лишний для flat config. | `eslint.config.js`, `package.json:16` |
| C12 | `astro.config.ts`: workaround `createRequire` помечен как временный, но без ссылки на issue и условия удаления; `vite.build.minify: 'esbuild'` явно задан для Vite 8, где минификатор по умолчанию другой (проверить актуальность); `server.host: true` открывает dev-сервер в локальную сеть. | `astro.config.ts:4-9,17,35` |
| C13 | `clsx` лежит в `devDependencies`, хотя используется в рантайме (после удаления React не нужен, в Astro есть `class:list`). | `package.json:40` |
| C14 | `README.md` — стандартная заглушка Astro, описания архитектуры и процессов (как добавить проект, локаль, навык) нет. | `README.md` |

---

## 4. Целевая архитектура

### 4.1. Принципы

1. **HTML собирается на сервере целиком.** Весь контент, включая все 8 проектов, все слайды и картинку кода, есть в статическом HTML.
2. **Клиентский JS — только поведение**, не рендер. Скрипты подключаются через `<script>` в Astro-компонентах (Astro бандлит и дедуплицирует их). Изолированное поведение оформляется как custom elements (`<site-header>`, `<embla-carousel-root>`, `<copy-button>`), чтобы оно переживало навигацию и не требовало ручной инициализации.
3. **Прогрессивное улучшение.** Без JS страница читается полностью, тема берётся из `prefers-color-scheme`, карусели листаются нативным скроллом.
4. **Одна точка правды** для локалей, темы, формата rich text и схем данных.

### 4.2. Карта миграции компонентов

| Сейчас | Станет | Клиентское поведение |
| --- | --- | --- |
| `Header.tsx` + `useActiveSection`, `useClickOutside`, nanostores | `Header.astro` + `header.ts` (custom element `<site-header>`) | меню (focus trap, Esc, `inert`, scroll lock), список языков, активный пункт через `IntersectionObserver`, пересчёт индикатора через `ResizeObserver` и `document.fonts.ready` |
| `Switcher.tsx` (тема) | `ThemeSwitcher.astro` + `theme.ts` | `aria-pressed` у кнопок режима, синхронизация с системной темой |
| `Approach.tsx` + sonner | `Approach.astro` + `<copy-button>` | Clipboard API с fallback, статус через `aria-live` |
| `ToastProvider.tsx` (sonner) | общий live-region `Toast.astro` + `toast.ts` (~40 строк) | показ и скрытие, `role="status"` |
| `Career.tsx`, `Reviews.tsx` + Swiper | `Career.astro`, `Reviews.astro` + общий `Carousel.astro` на ванильном `embla-carousel` (ленивая загрузка) | кнопки prev/next, `disabled` на краях, цикл и точки пагинации для Reviews, клавиатура, `inert` у невидимых слайдов |
| `Projects.tsx` + `ProjectSkeleton` | `Projects.astro` | «Показать ещё» снимает `hidden` с карточек 5–8 и переносит фокус на 5-ю; без JS показываются все |
| `Avatar.tsx` + GSAP MorphSVG | `Avatar.astro` с SMIL-анимацией `d` | ~10 строк: `svg.pauseAnimations()` при reduced motion и вне viewport |
| `Button.tsx`, `ActionButton.tsx`, `Tag.tsx`, `ArrowControls.tsx`, `Spotlight.tsx`, `StarBorder.tsx` | Astro-компоненты с теми же props | ripple и spotlight — один делегированный listener на `document` для `[data-ripple]` и `[data-spotlight]` |
| `lucide-react` | `@lucide/astro` или инлайн-SVG в `src/shared/icons/` | нет |

### 4.3. Структура `src/` после рефакторинга

```text
src/
  content.config.ts          # коллекции и zod-схемы (см. RF-05)
  data/                      # JSON-данные (как сейчас)
  i18n/
    locales.ts               # единственный список локалей и их метаданные
    utils.ts                 # getLocale(Astro), localizedPath(), t()
  layouts/
    Layout.astro
    Head.astro
    ThemeScript.astro        # блокирующий инлайн-скрипт темы
  pages/[...lang]/index.astro
  shared/
    icons/                   # Astro-иконки
    ui/                      # Button.astro, Tag.astro, ArrowControls.astro, RichText.astro …
    scripts/                 # клиентские модули: theme.ts, toast.ts, ripple.ts, carousel.ts …
  styles/
  utils/
    rich-text.ts             # единый парсер |выделения|, ||ссылок||, {{переменных}}
    experience.ts            # расчёт стажа, одна точка правды
  widgets/components/<Section>/<Section>.astro (+ .module.scss, + .ts при необходимости)
```

Существующие названия папок (`shared`, `widgets`) и алиасы сохраняются, чтобы не раздувать diff.

---

## 5. Задачи

Формат: ID, приоритет, оценка, файлы, что сделать, критерии приёмки.

### Фаза 0. Страховка и фундамент

#### RF-00. Эталонные скриншоты до рефакторинга

- **Приоритет:** P0, выполняется первой. **Оценка:** 3 ч.
- **Что сделать:** поднять Playwright и снять скриншоты текущей версии: 3 локали × 2 темы × 4 viewport (390, 768, 1024, 1440), полная страница, плюс состояния (открытое мобильное меню, открытый список языков, раскрытые проекты, hover карточки проекта). Сохранить как baseline для visual regression **в git** (решение владельца). Docker не используется (решение владельца). Baseline снимается и сравнивается только в GitHub Actions на `ubuntu-latest` с зафиксированной версией `@playwright/test` и браузерами, установленными через `playwright install --with-deps chromium`, чтобы рендер шрифтов всегда совпадал. Обновление baseline — отдельный workflow с ручным запуском (`workflow_dispatch`), который снимает скриншоты и коммитит их в текущую ветку. Локально visual-тесты не сравниваются с baseline (другая ОС — другой рендер); локальный прогон проверяет только, что сценарии проходят.
- **Приёмка:** локально `bun run test:visual` проходит все сценарии без сравнения; в CI сравнение с baseline проходит на текущем коде; baseline лежит в `tests/visual/__screenshots__/`, порог расхождения `maxDiffPixelRatio` 0.01.
- **Исключение:** кадры, которые меняются намеренно (фокус-кольцо RF-15, контент RF-21), обновляются через workflow обновления baseline в той же задаче, с пометкой в сообщении коммита.
- **Зависимость от владельца:** чтобы снять baseline, ветку нужно запушить на GitHub (пуш не-`master` ветки не деплоит сайт) и запустить workflow; делается только с разрешения владельца.

#### RF-01. Воспроизводимая сборка и quality gates в CI

- **Приоритет:** P0. **Оценка:** 3 ч.
- **Файлы:** `.github/workflows/deploy.yml`, `package.json`, `package-lock.json`.
- **Что сделать:**
  1. Удалить `package-lock.json`, в `package.json` зафиксировать `"packageManager": "bun@<версия>"`, в CI брать эту же версию.
  2. `bun install --frozen-lockfile`.
  3. Разделить workflow на jobs `verify` (format check, lint, check, unit, build, bundle budget, e2e) и `deploy` (`needs: verify`, только для `master`). На pull request запускается только `verify`.
  4. Добавить `scripts/check-bundle.mjs`: суммирует gzip-размер `dist/_astro/*.js` и падает при превышении бюджета (раздел 7).
  5. `check:links` запускать отдельным workflow по расписанию (раз в неделю) и не блокировать им деплой: внешние сайты нестабильны.
- **Приёмка:** PR с ошибкой lint, type-check или превышением бюджета не мёржится (красный CI); деплой происходит только после зелёного `verify`; два прогона CI на одном коммите дают одинаковые артефакты.

#### RF-02. Удаление мёртвого кода и неиспользуемых зависимостей

- **Приоритет:** P1. **Оценка:** 1 ч.
- **Что сделать:** удалить всё из C1; удалить `motion`, `@gsap/react`. Проверить отсутствие импортов через `grep` и `knip` (разово или в CI).
- **Приёмка:** `lint`, `check`, `build` зелёные; `knip` не находит неиспользуемых файлов и экспортов в `src/`.

#### RF-03. Ассеты и конвейер изображений

- **Приоритет:** P1. **Оценка:** 4 ч.
- **Файлы:** `public/**`, `convert.mjs`, `src/assets/**` (новая папка), компоненты Projects, Hero/Avatar, Approach, Skills.
- **Что сделать:**
  1. Удалить S2 и S5 (для `icons/logo.svg` сначала убедиться, что на него нет внешних ссылок).
  2. Перенести исходники проектов (`*.jpg`), `avatar.png`, `code-*.png` в `src/assets/` и выводить через `astro:assets` (`<Picture formats={['avif','webp']}>`, для аватара `getImage()` в `href` SVG-`<image>`). Удалить `convert.mjs`, скрипты `convert:projects`, `predev`, `prebuild` и закоммиченные `*.webp`.
  3. JPG-fallback не генерировать: только AVIF и WebP (решение владельца).
  4. `zustand.svg` и остальные SVG прогнать через SVGO; можно добавить скрипт `optimize:svg` для ручного запуска.
  5. Иконки Skills: одна `<img>` на навык; темозависимые варианты переключать через CSS (инлайн-SVG с `currentColor` или `<svg><use>`), всем иконкам ниже первого экрана — `loading="lazy" decoding="async"`.
- **Приёмка:** `dist/` ≤ 2 МБ; в `dist/` нет SF Pro, JPG проектов и неиспользуемых SVG; `zustand` ≤ 12 КБ (факт: трассированная иллюстрация из 234 контуров не сжимается векторно ниже ~45 КБ, поэтому заменена на растровый WebP 144×144, 8 КБ); на странице нет двойных загрузок иконок; визуальная регрессия RF-00 проходит.

### Фаза 1. Инфраструктура приложения

#### RF-04. Единый i18n-слой и политика URL

- **Приоритет:** P0 (закрывает D2, A2, A4). **Оценка:** 4 ч.
- **Файлы:** `astro.config.ts`, `src/i18n/*`, `Head.astro`, Header, `index.astro`, `typings/global.ts`, `stores/locale.ts`.
- **Что сделать:**
  1. `src/i18n/locales.ts` — единственный источник: `code`, `ogLocale`, `label`, `name` для каждой локали. Тип `Locale` выводится из него, `astro.config.ts` импортирует этот список.
  2. `trailingSlash: 'always'`. Все внутренние ссылки, canonical, `hreflang`, `og:url` строятся через `getRelativeLocaleUrl`/`getAbsoluteLocaleUrl` из `astro:i18n`.
  3. `getStaticPaths` генерируется из списка локалей.
  4. Локаль передаётся компонентам явно через `getLocale(Astro)`; глобальный атом удаляется.
  5. Переключатель языка сохраняет текущий якорь секции (`#projects` → `/ru/#projects`).
  6. Включить `i18n` в `@astrojs/sitemap`, чтобы sitemap содержал альтернативные языковые версии.
- **Приёмка:** добавление тестовой четвёртой локали требует правки только `locales.ts` и JSON-данных; canonical каждой страницы отвечает 200 без редиректа; URL в sitemap совпадают с canonical побайтно.

#### RF-05. Content collections и валидация данных

- **Приоритет:** P1 (закрывает A5, C8, часть C1). **Оценка:** 5 ч.
- **Файлы:** `src/data/schemas.ts`, `src/data/site.ts`, `src/data/**`.
- **Реализация (фактическая):** вместо `astro:content`-коллекций выбран отдельный модуль валидации при сборке (вариант, разрешённый в ТЗ): хранилище `file()`-коллекций сортирует записи по `id`, а порядок в сетках проектов, навыков и Career важен.
  1. `schemas.ts` — zod-схемы (`strictObject`, лишние ключи запрещены) для всех файлов; `site.ts` читает JSON, валидирует и собирает готовый объект для локали (`getSiteData(locale)`); тип `SiteData` выводится из результата. `typings/data.ts` и приведения `as Record<…>` удалены; острова получают данные пропсами, JSON больше не попадает в клиентский JS (−7.5 КБ gzip).
  2. Паритет при сборке: все локали присутствуют и нет лишних; во всех локалях одинаковые `id` списков в одинаковом порядке (projects, career, reviews); ошибка называет файл, локаль и поле.
  3. Справочник `technologies.json` (`id → название`); Career и Projects хранят только `id`; неизвестный `id` роняет сборку. Названия в Career стали едиными с Projects (HTML, TypeScript, Next.js, Chakra UI…): согласованное владельцем видимое изменение (закрывает C8).
  4. Данные разделены: `*.base.json` — то, что не зависит от локали (`id`, `name`, `link`, `color`, `stack`, компания и должность, авторы отзывов, навыки); `<name>.json` — тексты по локалям. Порядок списка задаёт base-файл.
- **Приёмка:** удаление ключа из одной локали, опечатка в `id` технологии и пропавший отзыв в одной локали роняют `bun run build` с понятным сообщением (проверено вручную); в коде нет `as Record<string, …>` для данных; HTML всех трёх локалей отличается от прежнего только названиями тегов Career (проверено сравнением).

#### RF-06. Единый rich-text парсер

- **Приоритет:** P1 (закрывает A6). **Оценка:** 2 ч.
- **Что сделать:** `src/utils/rich-text.ts` → `parseRichText(input, vars) : Token[]` (text, highlight, link, variable) и компонент `RichText.astro`. Удалить `useTextHighlight`, `parseLinks`, `applyVariable`, ручной `split('|')` в Skills. Формат разметки в JSON не меняется, данные не переписываются.
- **Приёмка:** unit-тесты покрывают несколько выделений в строке, ссылку с путём, переменную, пустую строку и незакрытый маркер; заголовки всех секций рендерятся как раньше (визуальная регрессия).

#### RF-07. Надёжная тема

- **Приоритет:** P0 (закрывает D1, A7). **Оценка:** 3 ч.
- **Файлы:** `_variables.scss`, `Head.astro` → `ThemeScript.astro`, `src/shared/scripts/theme.ts`.
- **Что сделать:**
  1. Токены светлой темы объявить на `:root`, тёмной — в `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) {…} }` и `[data-theme='dark']`. Без JS тема следует системе.
  2. Константы (`STORAGE_KEY`, цвета `theme-color`) — в одном модуле; инлайн-скрипт генерируется из них, а не копируется руками.
  3. Любой доступ к `localStorage` — в `try/catch`.
  4. `theme.ts` — единственная клиентская логика: `setMode`, подписка на системную тему, состояние кнопок (`aria-pressed`). Nanostores не нужны.
- **Приёмка:** e2e: при заблокированном `localStorage` и при выключенном JS страница имеет корректные цвета; смена системной темы без перезагрузки обновляет страницу в режиме system; на первом кадре нет вспышки неверной темы.

### Фаза 2. Миграция с React на Astro

Общие требования к фазе: каждый компонент мигрируется отдельным PR; visual regression RF-00 и e2e зелёные после каждого PR.

#### RF-08. UI-примитивы и иконки

- **Оценка:** 4 ч.
- **Что сделать:** Astro-версии `Button` (варианты `fill`/`outline`, размеры, `href` → `<a>`, внешние ссылки получают `target="_blank"` только для `http(s)`), `Tag`, `ArrowControls`, `StarBorder` (чистый CSS), `Spotlight` (CSS-переменные и делегированный `pointermove`, только при `(hover: hover) and (pointer: fine)`), иконки. Ripple сохраняется (решение владельца): один делегированный listener на `document` для `[data-ripple]`, ≤ 0.5 КБ, не срабатывает при reduced motion; визуально как сейчас (600 мс, `scale(4)`, opacity 0.15).
- **Приёмка:** поведение кнопки одинаково во всех секциях (закрывает C3); `mailto:` не открывает новую вкладку (закрывает D8).

#### RF-09. Header

- **Оценка:** 6 ч.
- **Что сделать:** перенести разметку в `Header.astro`, поведение — в `<site-header>`. Сохранить всё, что уже работает (focus trap, Esc с возвратом фокуса, `inert`, взаимоисключение, закрытие по клику вне). Добавить: навигацию стрелками `↑`/`↓`/`Home`/`End` в списке языков, восстановление `body.overflow` при уходе со страницы, пересчёт индикатора через `ResizeObserver` и `document.fonts.ready` (закрывает D4), активную секцию через `IntersectionObserver` вместо чтения `offsetTop` на каждом кадре скролла. Высоту мобильного меню убрать (`height: 383px`) — по контенту.
- **Приёмка:** e2e-сценарии меню и языка (раздел 6) проходят; индикатор стоит на месте после ресайза с 1440 до 1024 и обратно; мобильное меню не обрезает пункты при системном увеличении шрифта 200%.

#### RF-10. Avatar без GSAP

- **Оценка:** 3 ч.
- **Что сделать:** `Avatar.astro`: `<animate attributeName="d" values="A;B;A" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1">` на пути маски (кривая ≈ `power1.inOut`). Скрипт ставит анимацию на паузу при `prefers-reduced-motion: reduce` и вне viewport. `aria-label` убрать, аватар сделать декоративным (`aria-hidden="true"`), потому что имя уже есть в `h1` (закрывает X5). Удалить `gsap`.
- **Приёмка:** морфинг визуально совпадает с текущим (запись экрана до и после); при reduced motion форма статична; в бандле нет GSAP.

#### RF-11. Approach, копирование email и уведомления

- **Оценка:** 4 ч.
- **Что сделать:** `Approach.astro`; картинка кода — две `<img>` (light/dark), переключаемые CSS по `[data-theme]` (закрывает D6). `<copy-button>`: сначала `navigator.clipboard.writeText`, при ошибке — fallback с `textarea` **без** потери фокуса (вернуть фокус на кнопку) (закрывает D7). Уведомление через live-region `Toast.astro` (`role="status"`), визуально как текущий `.toast`. Удалить `sonner`.
- **Приёмка:** e2e: копирование при разрешённом и при запрещённом clipboard показывает соответствующее сообщение, фокус остаётся на кнопке; картинка кода есть в исходном HTML.

#### RF-12. Карусели Career и Reviews на Embla

- **Оценка:** 6 ч.
- **Решение владельца:** Swiper заменяется на [Embla Carousel](https://www.embla-carousel.com/) — ванильное ядро `embla-carousel` (стабильная ветка 8.x, на 30.09.2026 — `8.6.0`), без React-обёртки и без плагинов. Официальный плагин доступности есть только в 9.x RC, поэтому доступность реализуется вручную. Прокрутка колесом и тачпадом не добавляется (плагин `embla-carousel-wheel-gestures` не подключаем), как и сейчас со Swiper.
- **Что сделать:**
  1. **Общий компонент** `Carousel.astro` + custom element `<embla-carousel-root>` (`src/shared/scripts/carousel.ts`): разметка `viewport > container > slide`, все слайды рендерятся на сервере. Ширина слайдов и отступы задаются в CSS (`flex: 0 0 …`), а не в опциях JS.
  2. **Ленивая инициализация:** `import('embla-carousel')` выполняется, когда карусель приближается к viewport (`IntersectionObserver`, `rootMargin: 200px`). До инициализации и без JS контейнер прокручивается нативно (`overflow-x: auto` + `scroll-snap`), контент доступен.
  3. **Career:** `{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }` — аналог текущего FreeMode, без цикла. Кнопки ←/→ — `scrollPrev()`/`scrollNext()`, `disabled` по `canScrollPrev()`/`canScrollNext()` на событиях `select` и `reInit`.
  4. **Reviews:** `{ align: 'start', loop: true }`, 1/2/3 слайда на брейкпоинтах 0/768/1024 (через CSS-ширину слайдов). Цикл сохраняется (решение владельца): Embla реализует его сдвигом слайдов без клонирования, поэтому дублей в DOM и в скринридере нет (закрывает X7). Точки пагинации строятся из `scrollSnapList()`, активная — по `selectedScrollSnap()`, клик — `scrollTo(i)`; точки — `<button>` с локализованным `aria-label` «Перейти к отзыву N» и `aria-current` у активной. Стили точек — свои, без `!important` (закрывает C6).
  5. **Доступность (вручную):** корень `role="region"` + `aria-roledescription="carousel"` + локализованный `aria-label`; слайды `role="group"` + `aria-roledescription="slide"` + `aria-label` «N из M»; невидимые слайды получают `inert`, чтобы Tab не уходил в скрытые карточки (обновлять на `select`/`settle`); стрелки ←/→ листают при фокусе внутри карусели; живой регион не используется (не объявлять каждую прокрутку).
  6. **Reduced motion:** при `prefers-reduced-motion: reduce` — `duration` минимальная, `dragFree` отключён.
  7. **Career:** подпись «Технологии» выводить у всех карточек либо визуально скрыть у всех, кроме первой (закрывает C7).
  8. Удалить `swiper`, добавить `embla-carousel` в `dependencies`.
- **Бюджет:** Embla грузится отложенным чанком и не входит в JS первого экрана; размер чанка (ядро + `carousel.ts`) ≤ 10 КБ gzip — фактический размер зафиксировать при сборке в отчёте `check-bundle.mjs`.
- **Приёмка:** drag мышью, свайп на touch, кнопки и клавиатура работают в обеих каруселях; в Reviews цикл без дублей слайдов в DOM; Tab не попадает в невидимые слайды; без JS обе карусели прокручиваются нативно; визуальная регрессия проходит (допустимо отличие в точках пагинации, согласовать по скриншотам).

#### RF-13. Projects

- **Оценка:** 3 ч.
- **Что сделать:** рендерить все 8 карточек; карточки 5–8 получают `hidden` (снимается скриптом по кнопке, фокус переходит на 5-ю). Без JS кнопка не показывается, видны все. Удалить `ProjectSkeleton` и задержку (закрывает D5). Карточка: ссылка на заголовке с растягиванием кликабельной области на карточку через `::after` (stretched link), у изображения `alt=""` (закрывает X3). Картинки — `<Picture>` из RF-03 с `sizes`.
- **Приёмка:** все 8 проектов есть в исходном HTML; имя ссылки в accessibility tree равно названию проекта; клик по любому месту карточки открывает проект.

#### RF-14. Удаление React-инфраструктуры

- **Оценка:** 1 ч.
- **Что сделать:** удалить `@astrojs/react`, `react`, `react-dom`, `@types/react*`, `eslint-plugin-react`, `nanostores`, `@nanostores/react`, `lucide-react`, `clsx`; убрать `jsx`/`jsxImportSource` из `tsconfig.json`, React-блоки из `eslint.config.js`, `useIsHydrated` и прочие хуки. Если workaround `createRequire` больше не нужен (его причиной были CJS-зависимости интеграций), убрать и его (C12).
- **Приёмка:** в `package.json` нет React-зависимостей; в `dist/_astro` нет React; бюджет раздела 7 выполнен.

### Фаза 3. Качество

#### RF-15. Доступность

- **Оценка:** 4 ч.
- **Что сделать:**
  1. **Цвета не меняются** (решение владельца): `--accent-text: #ff6433`, `--accent`, цвета карточек проектов (`color` в `projects.json`) остаются как есть — это фирменный выбор. Контраст `#ff6433` на белом (≈2.95:1) ниже нормы AA и фиксируется как принятое исключение (D3/X1). Исполнитель только исправляет отступ в `_variables.scss:73`.
  2. Фокус: `outline: 2px solid` + `outline-offset`, box-shadow оставить как дополнительный слой; проверить в `forced-colors: active` (закрывает X2).
  3. `StarBorder`, spotlight, ripple, hover-зум картинок проектов — отключить или сделать статичными при reduced motion (закрывает X4).
  4. Анимацию футера запускать при появлении в viewport (`animation-timeline: view()` с fallback без анимации) или удалить (закрывает X6).
  5. Включить axe-проверку в e2e (RF-18). Правило `color-contrast` для элементов с акцентным текстом (`.accent`, активный и hover-пункт меню, роль в Hero, hover outline-кнопки) исключается точечно, по селекторам, с комментарием-ссылкой на решение владельца; для остальных элементов правило остаётся включённым.
- **Приёмка:** axe: 0 нарушений уровня A/AA на всех локалях в обеих темах, кроме задокументированного исключения по акцентному цвету; навигация с клавиатуры проходит всю страницу с видимым фокусом, в том числе в режиме forced-colors.

#### RF-16. Стили

- **Оценка:** 4 ч.
- **Что сделать:**
  1. Hero: заменить `vh()` на `clamp()` по ширине и с ограничением сверху (закрывает C4). На 1440×900 визуально как сейчас.
  2. Убрать магические числа из C5: грид Approach — `minmax(<текущая высота>, auto)` вместо фиксированных строк, чтобы длинный текст не обрезался; `.line` позиционировать от высоты `.wrap`.
  3. Токены движения: одна пара `--ease-*`/`--duration-*` вместо `--transition`/`--transition-ease` (значения подобрать так, чтобы визуально ничего не изменилось); глобальный блок `prefers-reduced-motion`.
  4. Удалить дубли `sr-only`/`visually-hidden`, лишний `@use` в `_variables.scss`, `!important` из Reviews.
  5. PostCSS: оставить `postcss-preset-env` (без отдельного `autoprefixer`), убрать `cssnano` (минифицирует Vite); добавить `browserslist` в `package.json` (например, `> 0.5%, last 2 versions, not dead`).
- **Приёмка:** визуальная регрессия проходит; тексты RU/UZ при 200% масштабе не обрезаются в Approach; размер CSS не вырос.

#### RF-17. Линтинг и форматирование

- **Оценка:** 3 ч.
- **Что сделать:** подключить `pluginAstro.configs['jsx-a11y-strict']` (или `-recommended`); убрать `--ext` и `bunx` из скриптов; добавить `format:check` (`prettier --check .`) в CI; добавить `stylelint` с `stylelint-config-standard-scss` (решение владельца), правила: запрет `!important` (`declaration-no-important`), `z-index` только через токены `--z-*`, `selector-class-pattern` под camelCase CSS-модулей; скрипт `lint:styles` в CI.
- **Приёмка:** CI падает на нарушениях a11y-правил, stylelint и неотформатированном коде.

#### RF-18. Автотесты

- **Оценка:** 6 ч.
- **Что сделать:**
  1. **Unit (vitest):** `rich-text.ts`, `experience.ts`, i18n-утилиты, схемы данных (валидный и невалидный пример).
  2. **E2E (Playwright + `@axe-core/playwright`)** против `astro preview`, матрица: EN/RU/UZ × light/dark, viewport 390 и 1440. Сценарии — раздел 6.
  3. Visual regression из RF-00 остаётся в наборе.
- **Приёмка:** `bun run test` (unit) и `bun run test:e2e` зелёные локально и в CI; время e2e в CI ≤ 5 минут.

#### RF-19. Актуальность данных, зависящих от даты

- **Оценка:** 1 ч.
- **Что сделать:** `src/utils/experience.ts` — единственный расчёт стажа от константы даты начала карьеры; использовать его в Hero **и** в `meta.json`/JSON-LD (плейсхолдер `{{years}}` вместо «8+»). Добавить в deploy workflow `schedule` (раз в месяц), чтобы стаж и год копирайта обновлялись без коммитов (закрывает A9).
- **Приёмка:** стаж в Hero, meta description и JSON-LD совпадает; workflow по расписанию успешно деплоит.

#### RF-20. Документация разработчика

- **Оценка:** 2 ч.
- **Что сделать:** переписать `README.md`: стек, структура `src/`, команды, как добавить проект, навык, отзыв или локаль, как обновить baseline скриншотов, бюджеты. Зафиксировать в `astro.config.ts` ссылку на upstream-issue для оставшихся workaround-ов (C12).
- **Приёмка:** новый разработчик добавляет проект по README без чтения кода компонентов.

#### RF-21. Правки контента, согласованные владельцем

- **Приоритет:** P2. **Оценка:** 2 ч. **Зависит от:** RF-05 (справочник технологий).
- **Что сделать:**
  1. **Skills — убрать** пункты, не относящиеся к профессиональному стеку (владелец делегировал выбор):
     - браузеры: Google Chrome, Firefox, Safari;
     - мессенджеры: Telegram, Slack, Discord;
     - общие инструменты и приложения: ChatGPT, Postman, VS Code, npm, Bash.
  2. **Skills — добавить** Vitest (есть в резюме): иконка из официального бренд-пакета Vitest, ссылка `https://vitest.dev`.
  3. «Framer Motion» переименовать в «Motion» (библиотека переименована), ссылку заменить на `https://motion.dev`.
  4. Итого 26 навыков: TypeScript, React, Next.js, Astro, JavaScript, HTML, CSS, TanStack Query, Git, Sass, Redux, Zustand, React Router, Vite, Vitest, Tailwind CSS, Chakra UI, Storybook, Gatsby, GSAP, Motion, PWA, Bun, ESLint, Prettier, Figma. В схеме навыка сразу предусмотреть поле `group` (значения — в `features.md`, F-09), визуально группы включаются в F-09.
  5. Удалить из `public/images/skills/` иконки убранных навыков (≈80 КБ, из них `firefox.svg` 20 КБ, `safari.svg` 21 КБ).
  6. **Career:** тексты не менять (решение владельца). Единственное исключение: `hit-proxy.net` сейчас не резолвится (нет DNS-записи) — упоминание оставить обычным текстом без ссылки во всех локалях, из `ALLOWED_UNAVAILABLE_URLS` в `scripts/check-links.mjs` его убрать. Когда сайт заработает, вернуть ссылку.
  7. **Reviews:** все 8 отзывов без изменений, без подписей должностей.
  8. **Projects:** состав не меняется, новые проекты из резюме не добавляются.
  9. **Титул:** везде `Frontend Engineer` (Hero, meta, JSON-LD) — как сейчас.
- **Приёмка:** в Skills 26 навыков во всех локалях; в `dist/` нет иконок удалённых навыков; в Career нет ссылки на `hit-proxy.net`; `check:links` проходит без исключений.

#### RF-22. Страница 404

- **Приоритет:** P2. **Оценка:** 1.5 ч.
- **Проблема:** в `src/pages` нет `404.astro`, GitHub Pages показывает свою стандартную страницу без навигации и темы.
- **Что сделать:** `src/pages/404.astro` в общем Layout: короткий текст на трёх языках (язык выбирается по `navigator.language` маленьким скриптом, без JS — английский), ссылки на главную каждой локали, `noindex`.
- **Приёмка:** `/nonexistent` отдаёт страницу сайта с работающими темой и ссылками на `/`, `/ru/`, `/uz/`; страница не попадает в sitemap.

---

## 6. E2E-сценарии (минимальный набор)

1. Первый `Tab` показывает skip-link, `Enter` переносит фокус на `main`.
2. Мобильное меню: открытие кнопкой, мышью и клавиатурой; `Tab` не выходит за пределы меню; `Esc` закрывает и возвращает фокус на кнопку; скролл фона заблокирован и восстанавливается.
3. Список языков: открытие, выбор, стрелки `↑`/`↓`, `Esc`; при открытии закрывается меню и наоборот; после смены языка URL со слэшем и сохранённым якорем.
4. Тема: три режима, перезагрузка сохраняет выбор, эмуляция смены системной темы в режиме system.
5. Копирование email: успех и отказ clipboard; сообщение в live-region; фокус на кнопке.
6. Карусели: кнопки, `disabled` на краях в Career, цикл в Reviews, точки пагинации, клавиатура, Tab не попадает в невидимые слайды.
7. «Показать ещё»: видно 8 проектов, фокус на 5-м, кнопка скрыта.
8. Все навигационные якоря ведут к существующим секциям; активный пункт меню меняется при скролле.
9. Axe: 0 нарушений A/AA на каждой комбинации матрицы (с учётом исключения по акцентному цвету).
10. В консоли нет ошибок, нет упавших same-origin запросов.
11. `/nonexistent` показывает страницу 404 сайта.

## 7. Бюджеты и целевые метрики

| Метрика | Сейчас | Цель |
| --- | --: | --: |
| Клиентский JS, загружаемый сразу (gzip) | ≈176 КБ | ≤ 15 КБ |
| Клиентский JS на первом экране (gzip) | ≈125 КБ | ≤ 8 КБ |
| Отложенные чанки фич из `features.md` (gzip, каждый) | — | ≤ 10 КБ |
| Runtime-зависимости в `package.json` | 13 | ≤ 4 (astro, @astrojs/sitemap, embla-carousel, при необходимости @lucide/astro) |
| Размер `dist/` (без CV-файлов) | 9.7 МБ | ≤ 2 МБ |
| Axe violations A/AA | есть (контраст в light) | 0, кроме принятого исключения по акцентному цвету |
| Lighthouse mobile (Performance / A11y / BP / SEO) | не замерялось в рамках этого анализа | ≥ 95 / 100 / 100 / 100 |
| CLS | — | 0 |

Бюджеты JS проверяются в CI (RF-01): `check-bundle.mjs` различает чанки, подключаемые сразу, и чанки, загружаемые через `import()`. Этот же бюджет действует для фич из `features.md`.

## 8. Порядок работ и оценка

```text
RF-00 ─► RF-01 ─► RF-02 ─► RF-03
                     │
                     ├─► RF-04 ─► RF-05 ─► RF-06
                     └─► RF-07
                               │
   (RF-04..07 готовы) ─► RF-08 ─► RF-09, RF-10, RF-11, RF-12, RF-13 (параллельно) ─► RF-14
                                                                                        │
                                                          RF-15, RF-16, RF-17, RF-18 ◄─┘
                                                                    │
                                                    RF-19, RF-20, RF-22 ─► финальная приёмка
                                                                    │
                                                          features.md (после RF-14)

RF-05 ─► RF-21 (можно в любой момент после справочника технологий)
```

| Фаза                     | Задачи               |      Оценка |
| ------------------------ | -------------------- | ----------: |
| 0. Страховка и фундамент | RF-00 … RF-03        |        11 ч |
| 1. Инфраструктура        | RF-04 … RF-07        |        14 ч |
| 2. Миграция              | RF-08 … RF-14        |        27 ч |
| 3. Качество              | RF-15 … RF-20, RF-22 |      21.5 ч |
| Контент                  | RF-21                |         2 ч |
| **Итого**                |                      | **≈75.5 ч** |

D8 (mailto) можно поправить хотфиксом до начала фаз, прямо в текущем коде.

## 9. Решения владельца

Согласовано 30 сентября 2026:

| Вопрос | Решение | Где учтено |
| --- | --- | --- |
| Старые ТЗ (`boost-tz.md`, `tasks.md`, `SITE_AUDIT_TZ.md`) | Объединены в это ТЗ и `features.md`, старые файлы удалены | раздел 10 |
| Целевая архитектура | Полностью убрать React | раздел 4, фаза 2 |
| Автотесты | Smoke e2e + axe + visual regression в CI, unit для утилит | RF-00, RF-18 |
| Контент | В целом только структура данных; точечные правки согласованы отдельно | RF-05, RF-21 |
| Skills | Убрать непрофильные пункты, добавить Vitest; группы — в `features.md` | RF-21, F-09 |
| Career | Не трогать (кроме ссылки `hit-proxy.net`) | RF-21 |
| Reviews | Все 8, без подписей должностей | RF-21 |
| Projects | Состав не меняется, новых из резюме не добавлять | RF-21 |
| Страницы кейсов | Отложены, пока идёт работа над главной | `features.md`, идеи |
| Титул | `Frontend Engineer` | RF-21 |
| `crypto.humandone.com` | Не добавляется в проекты; ссылка в Career работает (HTTP 200 на 30.09.2026) | — |
| `hit-proxy.net` | Текст без ссылки, пока домен не заработает | RF-21 |
| Карусели | Swiper → ванильный `embla-carousel`; цикл в Reviews сохранить; колесо и тачпад не добавлять | RF-12 |
| JPG-fallback | Не нужен, только AVIF + WebP | RF-03 |
| Ripple | Сохранить | RF-08 |
| Stylelint | Добавить | RF-17 |
| Baseline скриншотов | Хранить в git, снимать в CI на `ubuntu-latest`; Docker не используется | RF-00 |
| Процесс | Одна ветка `refactor/site-v2`, задача → коммит → отчёт → ожидание «дальше»; пуш и мёрж только с разрешения | `tasks.md` |
| Акцентный цвет и цвета проектов | Оставить как есть (`#ff6433`, `color` в `projects.json`); низкий контраст акцента принят как исключение | RF-15, раздел 7 |
| Личные данные | Телефон и дата рождения из резюме на сайт и в CV не попадают | `features.md`, F-13 |

Открытых вопросов нет.

## 10. Разбор бывшего плана /boost

План /boost (`boost-tz.md` + `tasks.md`, 12 эпиков, 26 задач) смешивал три разных вида работ: инженерные, дизайнерские и контентные. Каждый пункт разобран и отнесён к одному из итоговых документов или отклонён.

### 10.1. Вошло в это ТЗ (инженерная часть)

| /boost | Здесь | Комментарий |
| --- | --- | --- |
| TASK-01.1 удаление motion, @gsap/react, мёртвых компонентов | RF-02 |  |
| TASK-01.2 Approach без React, копирование email | RF-11 |  |
| TASK-01.3 замена Swiper и Sonner | RF-11, RF-12 |  |
| TASK-03.2 тема без FOUC, `theme-color` | RF-07 | Дополнено: работа без JS и при заблокированном `localStorage` |
| TASK-04.3 (a11y-часть) меню: `aria-controls`, взаимоисключение, scroll lock | RF-09 | Большая часть уже реализована в текущем коде |
| TASK-04.4 (a11y-часть) стрелки в списке языков | RF-09 |  |
| TASK-05.2 (оптимизационная часть) аватар: пауза вне viewport и при reduced motion | RF-10 | GSAP не сохраняется, а заменяется SMIL |
| TASK-06.4 превью кода без гидратации | RF-11 |  |
| TASK-07.1, TASK-10.1 карусели без Swiper | RF-12 | На Embla вместо самописного scroll-snap (решение владельца), без визуального редизайна |
| TASK-08.2 «Показать ещё» без задержки | RF-13 |  |
| TASK-12.1 чистка ассетов | RF-03 | JPG не сжимаются, а удаляются (решение владельца) |
| TASK-12.2 клавиатура и скринридеры | RF-15, RF-18 |  |
| TASK-12.4 quality gates в CI | RF-01, RF-18 |  |

### 10.2. Перенесено в `features.md` (анимации и фичи)

| /boost                                                 | `features.md`                |
| ------------------------------------------------------ | ---------------------------- |
| TASK-02.1 токены движения                              | F-00                         |
| TASK-02.2 Spotlight и 3D-наклон                        | F-11                         |
| TASK-02.4 появление при скролле                        | F-01 (в сдержанном варианте) |
| TASK-04.1 smart-hide хедера                            | F-04                         |
| TASK-04.2 скользящая пилюля                            | F-03                         |
| TASK-04.3 (визуальная часть) шторка меню               | F-05                         |
| TASK-05.1 бейдж доступности                            | F-08 (через флаг в данных)   |
| TASK-05.2 (визуальная часть) реакция аватара на курсор | F-02                         |
| TASK-06.2 UI-песочница в Approach                      | F-10                         |
| TASK-09.1 группы навыков                               | F-09                         |
| TASK-09.2 связь навыков и проектов                     | F-12                         |
| TASK-11.2 виджет местного времени                      | F-08                         |
| TASK-11.3 кнопка «Наверх» с кольцом                    | F-07                         |

### 10.3. Отклонено

| /boost | Причина |
| --- | --- |
| TASK-03.1 `--accent-text: #c84010` | Владелец оставляет текущий акцентный цвет |
| TASK-02.3 магнитные кнопки на всех CTA | Выбран стиль «один яркий момент + сдержанно»; оставлено как идея в `features.md` |
| TASK-06.1 Bento Grid 2.0 на 12 колонках | Редизайн сетки не выбран; текущая сетка чинится в RF-16 |
| TASK-06.3 магнитная кнопка копирования | Та же причина, что у TASK-02.3; состояние «скопировано» с иконкой — в F-10 не входит, решается в RF-11 через live-region |
| TASK-07.2 светящийся таймлайн Career, буллеты | Career не трогаем; таймлайн оставлен как идея |
| TASK-08.1 превью 16:9, метки ролей, ссылки на исходники | Изображения 1200×630, переход на 16:9 обрезает их; контент проектов не меняется; исходники не публичные |
| TASK-10.2 сокращение отзывов, бейдж «Verified» | Владелец оставляет все 8 отзывов; бейдж «Verified» ничем не подтверждён и вводит в заблуждение |
| TASK-11.1 новый текст CTA в футере | Контент не меняется |
| TASK-12.3 JSON-LD, `og:image:alt` | Уже реализовано |
| Заголовок «Senior Frontend Engineer» | Владелец выбрал `Frontend Engineer` |
| Целевые метрики /boost (INP < 30 мс, LCP < 0.8 с, «23 violations», «Lighthouse ~85–92») | Не подтверждены замерами; заменены бюджетами раздела 7, которые проверяются в CI |
| Навыки «REST / GraphQL», «CSS Modules» в группах | Не выбраны владельцем для Skills |
