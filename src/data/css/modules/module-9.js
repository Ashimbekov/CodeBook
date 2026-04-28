export default {
  id: 9,
  title: 'Типографика',
  description: 'Font-family, web fonts, line-height, rem/em, clamp() — создание красивого и читаемого текста.',
  lessons: [
    {
      id: 1,
      title: 'Font-family и системные шрифты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор шрифта — одно из главных решений в дизайне. CSS предлагает системные шрифты (бесплатно, быстро) и веб-шрифты (красиво, но загружаются).' },
        { type: 'heading', value: 'Стек шрифтов (font stack)' },
        { type: 'code', language: 'css', value: '/* Стек шрифтов: браузер берёт первый доступный */\nbody {\n  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;\n  /* 1. Inter (если загружен)\n     2. Helvetica Neue (macOS)\n     3. Arial (Windows)\n     4. sans-serif (системный fallback) */\n}\n\n/* Системный стек (без загрузки шрифтов!) */\nbody {\n  font-family: system-ui, -apple-system, "Segoe UI", Roboto, \n               "Helvetica Neue", Arial, sans-serif;\n}\n\n/* Моноширинный (для кода) */\ncode, pre {\n  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code",\n               ui-monospace, monospace;\n}\n\n/* Родовые семейства (generic families) */\n/* serif — с засечками: Georgia, Times New Roman */\n/* sans-serif — без засечек: Arial, Helvetica */\n/* monospace — моноширинный: Courier, Consolas */\n/* cursive — рукописный */\n/* fantasy — декоративный */' },
        { type: 'tip', value: 'system-ui использует нативный шрифт ОС: San Francisco на macOS, Segoe UI на Windows, Roboto на Android. Это даёт нулевое время загрузки и знакомый пользователю вид.' }
      ]
    },
    {
      id: 2,
      title: 'Подключение веб-шрифтов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Веб-шрифты загружаются с сервера. Google Fonts — самый популярный бесплатный источник. Для производительности лучше самостоятельно хостить шрифты.' },
        { type: 'heading', value: 'Google Fonts' },
        { type: 'code', language: 'html', value: '<!-- Подключение в HTML -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' },
        { type: 'heading', value: '@font-face — локальные шрифты' },
        { type: 'code', language: 'css', value: '/* Самостоятельный хостинг (лучше для производительности) */\n@font-face {\n  font-family: "Inter";\n  src: url("/fonts/Inter-Regular.woff2") format("woff2"),\n       url("/fonts/Inter-Regular.woff") format("woff");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;  /* показывает системный шрифт, пока грузится */\n}\n\n@font-face {\n  font-family: "Inter";\n  src: url("/fonts/Inter-Bold.woff2") format("woff2");\n  font-weight: 700;\n  font-style: normal;\n  font-display: swap;\n}\n\n/* Использование */\nbody {\n  font-family: "Inter", sans-serif;\n}' },
        { type: 'heading', value: 'font-display' },
        { type: 'code', language: 'css', value: '@font-face {\n  font-family: "Inter";\n  src: url("...") format("woff2");\n  \n  font-display: swap;      /* ✅ Рекомендуется: показывает fallback, потом заменяет */\n  /* font-display: block;   — невидимый текст 3с, потом шрифт */\n  /* font-display: fallback; — компромисс: 100ms невидимо, потом fallback */\n  /* font-display: optional; — шрифт применяется только если загружен мгновенно */\n}' },
        { type: 'note', value: 'woff2 — оптимальный формат. Он поддерживается всеми браузерами и сжимает шрифт на 30% лучше, чем woff. Достаточно только woff2.' }
      ]
    },
    {
      id: 3,
      title: 'Размеры шрифта и масштаб',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типографический масштаб (type scale) создаёт гармоничную иерархию размеров. Используйте rem для размеров и математические пропорции.' },
        { type: 'heading', value: 'Типографический масштаб' },
        { type: 'code', language: 'css', value: '/* Базовый масштаб (пропорция 1.25 — Major Third) */\n:root {\n  font-size: 16px;  /* 1rem = 16px */\n}\n\n/* Масштаб: каждый уровень × 1.25 */\n.text-xs   { font-size: 0.75rem; }    /* 12px */\n.text-sm   { font-size: 0.875rem; }   /* 14px */\n.text-base { font-size: 1rem; }       /* 16px */\n.text-lg   { font-size: 1.125rem; }   /* 18px */\n.text-xl   { font-size: 1.25rem; }    /* 20px */\n.text-2xl  { font-size: 1.5rem; }     /* 24px */\n.text-3xl  { font-size: 1.875rem; }   /* 30px */\n.text-4xl  { font-size: 2.25rem; }    /* 36px */\n.text-5xl  { font-size: 3rem; }       /* 48px */' },
        { type: 'heading', value: 'Адаптивный размер с clamp()' },
        { type: 'code', language: 'css', value: '/* Размеры плавно масштабируются от мобильных до десктопа */\nh1 {\n  font-size: clamp(2rem, 5vw + 1rem, 4rem);\n  /* 32px → плавно → 64px */\n}\n\nh2 {\n  font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);\n}\n\nh3 {\n  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);\n}\n\np {\n  font-size: clamp(1rem, 1vw + 0.5rem, 1.125rem);\n}' },
        { type: 'tip', value: 'rem лучше em для размеров шрифта: rem всегда относительно корневого элемента, и вы избегаете «каскадного умножения» (1.2em × 1.2em = 1.44em во вложенных элементах).' }
      ]
    },
    {
      id: 4,
      title: 'Line-height, spacing и читаемость',
      type: 'theory',
      content: [
        { type: 'text', value: 'Межстрочный интервал (line-height), расстояние между буквами (letter-spacing) и ширина строки — критически важны для читаемости текста.' },
        { type: 'heading', value: 'line-height' },
        { type: 'code', language: 'css', value: '/* line-height — множитель (без единиц!) */\nbody {\n  line-height: 1.6;    /* ✅ 1.6 × font-size */\n  /* line-height: 24px; — ❌ не масштабируется */\n  /* line-height: 1.6em; — ⚠️ работает, но множитель лучше */\n}\n\n/* Разный line-height для разных размеров */\nh1 { font-size: 3rem; line-height: 1.1; }  /* крупный текст — плотнее */\nh2 { font-size: 2rem; line-height: 1.2; }\nh3 { font-size: 1.5rem; line-height: 1.3; }\np  { font-size: 1rem; line-height: 1.6; }  /* основной текст — свободнее */\n\n/* Правило: чем крупнее шрифт, тем меньше line-height */\n/* Заголовки: 1.1–1.3 */\n/* Основной текст: 1.5–1.8 */\n/* Мелкий текст: 1.4–1.6 */' },
        { type: 'heading', value: 'letter-spacing и word-spacing' },
        { type: 'code', language: 'css', value: '/* letter-spacing — расстояние между буквами */\n.uppercase-heading {\n  text-transform: uppercase;\n  letter-spacing: 0.05em;   /* слегка раздвигаем */\n  /* Uppercase без letter-spacing выглядит тесно */\n}\n\n.tight { letter-spacing: -0.02em; }  /* для крупных заголовков */\n.normal { letter-spacing: 0; }\n.wide { letter-spacing: 0.1em; }     /* для мелкого текста */\n\n/* Оптимальная ширина строки для чтения */\n.article {\n  max-width: 65ch;  /* 65 символов — идеальная ширина */\n  /* 45ch — минимум, 75ch — максимум */\n}' },
        { type: 'note', value: '65ch — это не 65 пикселей. ch равен ширине символа "0" текущего шрифта. 65ch ≈ 45-75 символов в строке — оптимально для чтения.' }
      ]
    },
    {
      id: 5,
      title: 'Стилизация текста',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS предоставляет множество свойств для стилизации текста: жирность, курсив, трансформация, выравнивание, декорации.' },
        { type: 'heading', value: 'Свойства текста' },
        { type: 'code', language: 'css', value: '/* font-weight */\n.light { font-weight: 300; }\n.regular { font-weight: 400; }   /* normal */\n.medium { font-weight: 500; }\n.semibold { font-weight: 600; }\n.bold { font-weight: 700; }      /* bold */\n\n/* font-style */\n.italic { font-style: italic; }\n\n/* text-transform */\n.uppercase { text-transform: uppercase; }\n.lowercase { text-transform: lowercase; }\n.capitalize { text-transform: capitalize; }  /* Первая Буква Каждого Слова */\n\n/* text-align */\n.left { text-align: left; }\n.center { text-align: center; }\n.right { text-align: right; }\n.justify { text-align: justify; }  /* по ширине — осторожно с рваными пробелами */\n\n/* text-decoration */\na {\n  text-decoration: underline;\n  text-decoration-color: #3b82f6;\n  text-decoration-thickness: 2px;\n  text-underline-offset: 3px;  /* отступ подчёркивания от текста */\n}' },
        { type: 'heading', value: 'Обрезка текста' },
        { type: 'code', language: 'css', value: '/* Одна строка с многоточием */\n.truncate {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* Многострочное обрезание (2 строки) */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n/* word-break — перенос длинных слов */\n.break-words {\n  overflow-wrap: break-word;  /* переносит длинные слова */\n  word-break: break-word;\n}\n\n.break-all {\n  word-break: break-all;  /* ломает слова в любом месте */\n}' },
        { type: 'tip', value: 'text-underline-offset — незаметное, но мощное свойство. Подчёркивание на 2-3px ниже текста выглядит гораздо аккуратнее стандартного.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Типографическая система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте типографическую систему для блога: масштаб шрифтов, адаптивные размеры, стилизация статьи.',
      requirements: [
        'Подключите шрифт Inter через @font-face или Google Fonts',
        'Создайте масштаб размеров (text-xs до text-5xl) на CSS-переменных',
        'Адаптивные заголовки h1-h3 через clamp()',
        'Оптимальная ширина текста статьи (max-width: 65ch)',
        'Стилизованные ссылки с text-underline-offset',
        'Обрезка длинного текста в карточке (line-clamp: 3)'
      ],
      hint: 'Начните с :root и CSS-переменных для шрифтов. Используйте clamp() для заголовков. Добавьте .article для стиля статьи.',
      expectedOutput: 'Страница блога с гармоничной типографикой: заголовки разных уровней, основной текст, карточки с обрезанным текстом.',
      solution: ':root {\n  --font-sans: "Inter", system-ui, sans-serif;\n  --font-mono: "JetBrains Mono", monospace;\n  --text-xs: 0.75rem;\n  --text-sm: 0.875rem;\n  --text-base: 1rem;\n  --text-lg: 1.125rem;\n  --text-xl: 1.25rem;\n  --text-2xl: 1.5rem;\n  --text-3xl: 1.875rem;\n  --text-4xl: 2.25rem;\n}\n\nbody {\n  font-family: var(--font-sans);\n  font-size: var(--text-base);\n  line-height: 1.6;\n  color: #1e293b;\n}\n\nh1 {\n  font-size: clamp(2rem, 5vw, var(--text-4xl));\n  line-height: 1.1;\n  letter-spacing: -0.02em;\n  font-weight: 700;\n}\n\nh2 {\n  font-size: clamp(1.5rem, 3vw, var(--text-3xl));\n  line-height: 1.2;\n  font-weight: 600;\n}\n\nh3 {\n  font-size: clamp(1.25rem, 2vw, var(--text-2xl));\n  line-height: 1.3;\n  font-weight: 600;\n}\n\n.article {\n  max-width: 65ch;\n  margin: 0 auto;\n  padding: 2rem 1rem;\n}\n\n.article a {\n  color: #2563eb;\n  text-decoration: underline;\n  text-underline-offset: 3px;\n  text-decoration-thickness: 1px;\n}\n\n.article a:hover {\n  text-decoration-thickness: 2px;\n}\n\n.card-text {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  font-size: var(--text-sm);\n  color: #64748b;\n}\n\ncode {\n  font-family: var(--font-mono);\n  font-size: 0.9em;\n  background: #f1f5f9;\n  padding: 0.1em 0.3em;\n  border-radius: 4px;\n}',
      explanation: 'CSS-переменные создают переиспользуемый масштаб. clamp() обеспечивает плавный адаптив заголовков. max-width: 65ch оптимизирует ширину для чтения. line-clamp обрезает текст в карточках.'
    }
  ]
}
