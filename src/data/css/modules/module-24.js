export default {
  id: 24,
  title: 'Производительность CSS',
  description: 'Critical CSS, contain, will-change, CSS layers, content-visibility и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Как браузер обрабатывает CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание Rendering Pipeline браузера — ключ к оптимизации CSS. Каждое изменение стиля проходит через определённые этапы, и важно минимизировать их количество.' },
        { type: 'heading', value: 'Rendering Pipeline' },
        { type: 'code', language: 'css', value: '/*\n  Этапы рендеринга:\n  \n  1. Style  — вычисление стилей для каждого элемента\n  2. Layout — расчёт размеров и позиций (reflow)\n  3. Paint  — рисование пикселей (цвет, тень, border)\n  4. Composite — склеивание слоёв (transform, opacity)\n\n  Стоимость:\n  Layout > Paint > Composite\n\n  Изменение width/height → Layout + Paint + Composite\n  Изменение color/shadow → Paint + Composite\n  Изменение transform/opacity → ТОЛЬКО Composite (GPU)\n*/\n\n/* ✅ Быстро — только Composite */\n.fast {\n  transform: translateX(100px);\n  opacity: 0.5;\n}\n\n/* ⚠️ Средне — Paint + Composite */\n.medium {\n  background-color: red;\n  box-shadow: 0 0 10px black;\n}\n\n/* ❌ Медленно — Layout + Paint + Composite */\n.slow {\n  width: 200px;\n  height: 100px;\n  top: 50px;\n  margin-left: 20px;\n}' },
        { type: 'tip', value: 'Правило производительных анимаций: анимируйте только transform и opacity. Все остальные свойства вызывают Layout или Paint, что медленнее.' }
      ]
    },
    {
      id: 2,
      title: 'will-change и слои',
      type: 'theory',
      content: [
        { type: 'text', value: 'will-change подсказывает браузеру, что свойство будет анимировано. Браузер заранее выносит элемент на отдельный GPU-слой, ускоряя анимацию.' },
        { type: 'heading', value: 'will-change' },
        { type: 'code', language: 'css', value: '/* will-change: подсказка браузеру */\n.card {\n  transition: transform 0.3s, box-shadow 0.3s;\n}\n\n.card:hover {\n  will-change: transform;\n  transform: translateY(-4px);\n  box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n}\n\n/* ⚠️ НЕ ставьте will-change на всё! */\n/* Каждый слой потребляет память GPU */\n* { will-change: transform; }  /* ❌ НИКОГДА так не делайте */\n\n/* ✅ Добавляйте перед анимацией, убирайте после */\n.card {\n  /* Нет will-change по умолчанию */\n}\n.card:hover {\n  will-change: transform;  /* Только при hover */\n}\n\n/* Или через JavaScript */\n/* element.addEventListener("mouseenter", () => {\n    element.style.willChange = "transform";\n   });\n   element.addEventListener("mouseleave", () => {\n    element.style.willChange = "auto";\n   }); */' },
        { type: 'heading', value: 'Принудительное создание слоя' },
        { type: 'code', language: 'css', value: '/* Если will-change не подходит */\n.force-layer {\n  transform: translateZ(0);  /* hack: создаёт отдельный слой */\n  /* или: */\n  backface-visibility: hidden;\n}\n\n/* Современный подход: */\n.modern-layer {\n  contain: layout paint;  /* ограничивает область перерисовки */\n  isolation: isolate;     /* создаёт stacking context */\n}' },
        { type: 'note', value: 'В DevTools: вкладка Layers показывает все GPU-слои. Performance → Paint Profiler показывает перерисовки. Зелёные прямоугольники в Rendering = перерисовки.' }
      ]
    },
    {
      id: 3,
      title: 'CSS contain и content-visibility',
      type: 'theory',
      content: [
        { type: 'text', value: 'contain ограничивает область влияния элемента. content-visibility: auto пропускает рендеринг элементов за пределами viewport. Оба свойства значительно ускоряют большие страницы.' },
        { type: 'heading', value: 'CSS contain' },
        { type: 'code', language: 'css', value: '/* contain — ограничение влияния */\n.card {\n  contain: layout;  /* изменения внутри не вызывают reflow снаружи */\n  /* contain: paint;   — рисование не выходит за границы */\n  /* contain: size;    — размер не зависит от содержимого */\n  /* contain: style;   — стили (counters) не выходят наружу */\n  /* contain: content; — layout + paint + style */\n  /* contain: strict;  — layout + paint + size + style */\n}\n\n/* Практическое применение */\n.feed-item {\n  contain: content;  /* изменения внутри карточки изолированы */\n  /* Браузеру не нужно пересчитывать всю страницу */\n}' },
        { type: 'heading', value: 'content-visibility: auto' },
        { type: 'code', language: 'css', value: '/* content-visibility: auto — ленивый рендеринг */\nsection {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 500px;\n  /* Секции за пределами viewport не рендерятся */\n  /* contain-intrinsic-size — предполагаемый размер для скролла */\n}\n\n/* Для длинных списков */\n.list-item {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 80px;\n}\n\n/* Результат:\n   Лента из 1000 карточек:\n   Без: рендерятся все 1000 → долго\n   С content-visibility: auto → рендерятся ~20 видимых\n   Ускорение: до 7× быстрее первый рендер */' },
        { type: 'tip', value: 'content-visibility: auto — одна из самых мощных CSS-оптимизаций. Добавьте на секции длинных страниц и элементы больших списков. Экономит десятки миллисекунд.' }
      ]
    },
    {
      id: 4,
      title: 'Critical CSS и загрузка стилей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Critical CSS — техника встраивания стилей «первого экрана» в HTML для мгновенного отображения. Остальной CSS загружается асинхронно.' },
        { type: 'heading', value: 'Critical CSS' },
        { type: 'code', language: 'html', value: '<!DOCTYPE html>\n<html>\n<head>\n  <!-- Critical CSS — встроен в HTML (стили первого экрана) -->\n  <style>\n    /* Минимальный набор стилей для hero + navbar */\n    body { margin: 0; font-family: system-ui; }\n    .navbar { display: flex; align-items: center; height: 64px; padding: 0 1rem; }\n    .hero { min-height: 80vh; display: flex; align-items: center; }\n    .hero h1 { font-size: 3rem; }\n  </style>\n  \n  <!-- Остальной CSS — асинхронная загрузка -->\n  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n  <noscript><link rel="stylesheet" href="styles.css"></noscript>\n</head>\n</html>' },
        { type: 'heading', value: 'Оптимизация размера CSS' },
        { type: 'code', language: 'bash', value: '# Tailwind автоматически удаляет неиспользуемые стили (tree-shaking)\n# Результат: 3-10 КБ вместо 3 МБ\n\n# PurgeCSS (для не-Tailwind проектов)\nnpm install purgecss\npurgecss --css styles.css --content index.html --output purged.css\n\n# Минификация\nnpm install cssnano\n# Или в PostCSS:\n# postcss styles.css --use cssnano -o styles.min.css\n\n# Gzip/Brotli сжатие (настраивается на сервере)\n# CSS: 50 КБ → Gzip: 8 КБ → Brotli: 6 КБ' },
        { type: 'list', value: [
          'Critical CSS: встраивайте стили первого экрана в <style> в <head>',
          'Async CSS: загружайте остальной CSS через preload + onload',
          'Tree-shaking: удаляйте неиспользуемые стили (Tailwind делает автоматически)',
          'Минификация: удаляйте пробелы и комментарии (cssnano, Lightning CSS)',
          'Сжатие: включите Brotli на сервере (лучше Gzip на 15-20%)',
          'Разделение: отдельные файлы для разных страниц (code splitting)'
        ]},
        { type: 'note', value: 'Tailwind в продакшене генерирует CSS размером 5-15 КБ (gzipped), потому что включает только используемые классы. Это меньше, чем большинство кастомных CSS-файлов.' }
      ]
    },
    {
      id: 5,
      title: 'CSS-селекторы и производительность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Производительность селекторов редко является проблемой, но в очень больших проектах (10000+ элементов) оптимизация селекторов имеет значение.' },
        { type: 'heading', value: 'Скорость селекторов' },
        { type: 'code', language: 'css', value: '/* Браузер читает селекторы СПРАВА НАЛЕВО */\n\n/* ❌ Медленно: браузер найдёт ВСЕ a, потом проверит родителей */\n.sidebar .menu .submenu li a { }\n\n/* ✅ Быстро: уникальный класс — прямое совпадение */\n.submenu-link { }\n\n/* Скорость селекторов (от быстрого к медленному): */\n/* 1. #id — самый быстрый */\n/* 2. .class — быстрый */\n/* 3. tag — средний */\n/* 4. * — медленный */\n/* 5. [attr] — медленный */\n/* 6. :nth-child() — медленный */\n\n/* Но! Разница — микросекунды. Не оптимизируйте преждевременно */\n/* BEM .card__title быстрее .card > .header > h3, но это не главное */\n/* Главное — поддерживаемость кода */' },
        { type: 'heading', value: '@layer и приоритизация' },
        { type: 'code', language: 'css', value: '/* @layer помогает браузеру быстрее определить приоритет */\n@layer reset, base, components, utilities;\n\n@layer reset {\n  /* Низкий приоритет — обрабатывается первым */\n}\n\n@layer utilities {\n  /* Высокий приоритет — перекрывает всё */\n}\n\n/* Браузер знает порядок заранее и не вычисляет специфичность */\n\n/* CSS @scope (новый!) — ограничение области селекторов */\n@scope (.card) to (.card-footer) {\n  p { color: gray; }  /* только p внутри .card, но НЕ внутри .card-footer */\n}' },
        { type: 'tip', value: 'Главные оптимизации CSS: 1) content-visibility: auto, 2) contain на компонентах, 3) анимируйте только transform/opacity, 4) минимизируйте размер файла. Селекторы — в последнюю очередь.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация страницы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Оптимизируйте CSS длинной страницы: добавьте content-visibility, contain, will-change и правильные анимации.',
      requirements: [
        'Добавьте content-visibility: auto на секции за пределами первого экрана',
        'contain-intrinsic-size для каждой секции',
        'contain: content на карточках для изоляции',
        'will-change: transform только на hover для анимируемых элементов',
        'Замените анимацию width/height на transform: scale()',
        'Добавьте prefers-reduced-motion для отключения анимаций'
      ],
      hint: 'content-visibility: auto на каждой <section> после hero. contain: content на повторяющихся карточках. will-change — только на :hover.',
      expectedOutput: 'Оптимизированная страница: секции рендерятся лениво, карточки изолированы, анимации на GPU.',
      solution: '/* Базовые оптимизации */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n\n/* content-visibility для секций */\nsection {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 600px;\n}\n\n/* Первая секция (hero) — всегда видима */\n.hero {\n  content-visibility: visible;\n}\n\n/* contain для изоляции карточек */\n.card {\n  contain: content;\n  border-radius: 12px;\n  overflow: hidden;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n/* will-change только на hover */\n.card:hover {\n  will-change: transform;\n  transform: translateY(-4px);\n  box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n}\n\n/* ✅ Правильно: анимация через transform */\n.expandable {\n  transform: scaleY(0);\n  transform-origin: top;\n  transition: transform 0.3s ease;\n}\n\n.expandable.open {\n  transform: scaleY(1);\n}\n\n/* ❌ Было: анимация height\n.expandable { height: 0; transition: height 0.3s; }\n.expandable.open { height: 300px; }\n*/\n\n/* prefers-reduced-motion */\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n\n/* Ленивые изображения */\nimg {\n  content-visibility: auto;\n  max-width: 100%;\n  height: auto;\n}',
      explanation: 'content-visibility: auto на секциях пропускает рендер невидимых блоков. contain: content изолирует карточки. will-change добавляется только при hover. Анимация height заменена на transform: scaleY. prefers-reduced-motion уважает настройки пользователя.'
    }
  ]
}
