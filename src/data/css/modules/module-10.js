export default {
  id: 10,
  title: 'Цвета и фоны',
  description: 'Цветовые модели, градиенты, background свойства и blend modes в CSS.',
  lessons: [
    {
      id: 1,
      title: 'Цветовые модели в CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS поддерживает множество цветовых моделей: HEX, RGB, HSL, а также современные oklch и color(). Выбор модели влияет на удобство работы с цветами.' },
        { type: 'heading', value: 'HEX, RGB, HSL' },
        { type: 'code', language: 'css', value: '/* HEX — шестнадцатеричные */\n.hex {\n  color: #3b82f6;          /* 6 символов: RRGGBB */\n  color: #38f;             /* 3 символа: сокращение #3388ff */\n  color: #3b82f680;        /* 8 символов: с альфа-каналом */\n}\n\n/* RGB — красный, зелёный, синий */\n.rgb {\n  color: rgb(59, 130, 246);         /* 0-255 */\n  color: rgb(59 130 246);           /* без запятых (современный) */\n  color: rgb(59 130 246 / 0.5);     /* с прозрачностью */\n}\n\n/* HSL — тон, насыщенность, яркость (удобнее для дизайна!) */\n.hsl {\n  color: hsl(217, 91%, 60%);       /* тон 0-360, насыщ %, ярк % */\n  color: hsl(217 91% 60%);         /* без запятых */\n  color: hsl(217 91% 60% / 0.5);   /* с прозрачностью */\n}\n\n/* HSL удобнее для создания палитр:\n   Один тон — разная яркость */\n.blue-100 { background: hsl(217 91% 95%); }  /* очень светлый */\n.blue-500 { background: hsl(217 91% 60%); }  /* базовый */\n.blue-900 { background: hsl(217 91% 20%); }  /* тёмный */' },
        { type: 'tip', value: 'HSL — лучшая модель для ручной работы с цветами. Меняйте яркость (L) для создания оттенков, тон (H) для смены цвета, насыщенность (S) для контроля яркости.' }
      ]
    },
    {
      id: 2,
      title: 'Современные цвета: oklch и относительные цвета',
      type: 'theory',
      content: [
        { type: 'text', value: 'oklch — новая перцептивно однородная цветовая модель. В ней изменение яркости действительно выглядит равномерным, в отличие от HSL.' },
        { type: 'heading', value: 'oklch — перцептивно однородные цвета' },
        { type: 'code', language: 'css', value: '/* oklch(lightness chroma hue) */\n.modern {\n  color: oklch(0.6 0.2 250);     /* яркость 0-1, хрома 0-0.4, тон 0-360 */\n  color: oklch(0.6 0.2 250 / 0.5); /* с прозрачностью */\n}\n\n/* Преимущество: равномерная яркость */\n/* В HSL: hsl(60, 100%, 50%) выглядит ярче hsl(240, 100%, 50%) */\n/* В oklch: oklch(0.7 0.2 90) и oklch(0.7 0.2 260) — одинаковой яркости */' },
        { type: 'heading', value: 'Относительные цвета (Relative Color Syntax)' },
        { type: 'code', language: 'css', value: '/* Создание оттенков из базового цвета */\n:root {\n  --primary: oklch(0.6 0.2 250);\n}\n\n.lighter {\n  /* Берём --primary и увеличиваем яркость */\n  background: oklch(from var(--primary) calc(l + 0.2) c h);\n}\n\n.darker {\n  background: oklch(from var(--primary) calc(l - 0.2) c h);\n}\n\n.muted {\n  /* Уменьшаем насыщенность */\n  background: oklch(from var(--primary) l calc(c - 0.1) h);\n}\n\n.transparent {\n  background: oklch(from var(--primary) l c h / 0.5);\n}' },
        { type: 'note', value: 'oklch и относительные цвета поддерживаются в Chrome 111+ и Safari 16.4+. Для старых браузеров используйте HSL с CSS-переменными как fallback.' }
      ]
    },
    {
      id: 3,
      title: 'Градиенты',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-градиенты — это изображения, созданные кодом. Они бесконечно масштабируются и не требуют загрузки файлов.' },
        { type: 'heading', value: 'Линейные градиенты' },
        { type: 'code', language: 'css', value: '/* Линейный градиент */\n.bg {\n  background: linear-gradient(to right, #3b82f6, #8b5cf6);\n  /* Направление: to right, to bottom, 45deg, 135deg */\n}\n\n/* Несколько цветов */\n.rainbow {\n  background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6);\n}\n\n/* Управление позициями */\n.precise {\n  background: linear-gradient(to right,\n    #3b82f6 0%,\n    #3b82f6 50%,    /* синий занимает 50% */\n    #8b5cf6 50%,    /* резкий переход */\n    #8b5cf6 100%\n  );\n}\n\n/* Градиент текста */\n.gradient-text {\n  background: linear-gradient(to right, #3b82f6, #8b5cf6);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n}' },
        { type: 'heading', value: 'Радиальные и конические градиенты' },
        { type: 'code', language: 'css', value: '/* Радиальный градиент (из центра) */\n.radial {\n  background: radial-gradient(circle, #3b82f6, #1e3a8a);\n  /* circle — круг, ellipse — эллипс (по умолчанию) */\n}\n\n.radial-pos {\n  background: radial-gradient(circle at top left, #3b82f6, transparent);\n}\n\n/* Конический градиент (по кругу) */\n.conic {\n  background: conic-gradient(#ef4444, #f59e0b, #22c55e, #3b82f6, #ef4444);\n  border-radius: 50%;\n  /* Создаёт цветовой круг */\n}\n\n/* Конический для pie-chart */\n.pie {\n  background: conic-gradient(\n    #3b82f6 0% 40%,    /* 40% синий */\n    #22c55e 40% 70%,   /* 30% зелёный */\n    #f59e0b 70% 100%   /* 30% жёлтый */\n  );\n  border-radius: 50%;\n}' },
        { type: 'tip', value: 'Градиент текста (.gradient-text) — популярный эффект. Но помните: background-clip: text ломает выделение текста в некоторых браузерах. Используйте для декоративных заголовков.' }
      ]
    },
    {
      id: 4,
      title: 'Background свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство background — одно из самых многогранных в CSS. Оно управляет цветом, изображением, размером, позицией и повторением фона.' },
        { type: 'heading', value: 'Основные background свойства' },
        { type: 'code', language: 'css', value: '.hero {\n  background-color: #1e293b;\n  background-image: url("hero.jpg");\n  background-size: cover;         /* заполняет контейнер */\n  background-position: center;    /* фокус по центру */\n  background-repeat: no-repeat;   /* без повторения */\n  background-attachment: fixed;    /* параллакс эффект */\n}\n\n/* Сокращённая запись */\n.hero {\n  background: #1e293b url("hero.jpg") center / cover no-repeat fixed;\n  /* color image position / size repeat attachment */\n}\n\n/* background-size */\n.cover   { background-size: cover; }     /* заполняет, обрезая */\n.contain { background-size: contain; }   /* вписывает полностью */\n.exact   { background-size: 200px 100px; } /* точный размер */' },
        { type: 'heading', value: 'Множественные фоны' },
        { type: 'code', language: 'css', value: '/* Несколько фонов (первый — сверху) */\n.multi {\n  background:\n    linear-gradient(to bottom, transparent, rgba(0,0,0,0.7)),  /* оверлей */\n    url("hero.jpg") center / cover no-repeat;                   /* фото */\n}\n\n/* Декоративный паттерн + цвет */\n.pattern {\n  background:\n    radial-gradient(circle, #3b82f6 1px, transparent 1px),\n    #f8fafc;\n  background-size: 20px 20px;  /* размер паттерна */\n}\n\n/* Точки */\n.dots {\n  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);\n  background-size: 16px 16px;\n}' },
        { type: 'tip', value: 'Оверлей поверх изображения (gradient + image) — классический паттерн для hero-секций. Это позволяет читать текст поверх любого фото.' }
      ]
    },
    {
      id: 5,
      title: 'Blend modes и фильтры',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS blend modes и фильтры позволяют создавать фотоэффекты без графического редактора. mix-blend-mode смешивает элемент с фоном, filter применяет эффекты к элементу.' },
        { type: 'heading', value: 'mix-blend-mode' },
        { type: 'code', language: 'css', value: '/* mix-blend-mode — смешивание с тем, что ПОД элементом */\n.overlay-text {\n  mix-blend-mode: multiply;     /* затемнение */\n  /* mix-blend-mode: screen;    — осветление */\n  /* mix-blend-mode: overlay;   — контраст */\n  /* mix-blend-mode: difference; — инверсия */\n}\n\n/* background-blend-mode — смешивание фонов между собой */\n.hero {\n  background:\n    linear-gradient(#3b82f6, #8b5cf6),\n    url("photo.jpg") center / cover;\n  background-blend-mode: overlay;\n}' },
        { type: 'heading', value: 'CSS filter' },
        { type: 'code', language: 'css', value: '/* Фильтры изображений */\n.img-blur    { filter: blur(4px); }\n.img-bright  { filter: brightness(1.2); }    /* 1 = нормально */\n.img-contrast { filter: contrast(1.3); }\n.img-gray    { filter: grayscale(100%); }    /* чёрно-белое */\n.img-sepia   { filter: sepia(80%); }         /* сепия */\n.img-saturate { filter: saturate(1.5); }     /* насыщенность */\n.img-invert  { filter: invert(100%); }       /* инверсия */\n\n/* Комбинация фильтров */\n.vintage {\n  filter: sepia(30%) contrast(1.1) brightness(1.05);\n}\n\n/* backdrop-filter — фильтр для фона ЗА элементом */\n.glass {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  /* Эффект матового стекла */\n}\n\n/* Полупрозрачная навигация */\n.nav {\n  background: rgba(255, 255, 255, 0.8);\n  backdrop-filter: blur(12px) saturate(180%);\n}' },
        { type: 'tip', value: 'backdrop-filter: blur() — это тот самый «стеклянный» эффект (glassmorphism), популярный в macOS и iOS интерфейсах. Работает во всех современных браузерах.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Hero-секция с эффектами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте hero-секцию с фоновым изображением, градиентным оверлеем, эффектом стекла и градиентным текстом.',
      requirements: [
        'Фоновое изображение с cover и центрированием',
        'Градиентный оверлей поверх изображения (multiple backgrounds)',
        'Полупрозрачная навигация с backdrop-filter: blur',
        'Градиентный текст заголовка (background-clip: text)',
        'Кнопка с градиентным фоном',
        'Hover-эффект с filter: brightness на карточке'
      ],
      hint: 'Используйте multiple backgrounds: gradient + image. Для стеклянного эффекта — backdrop-filter: blur(). Для градиентного текста — background-clip: text.',
      expectedOutput: 'Красивая hero-секция с затемнённым фото, стеклянной навигацией, градиентным заголовком и эффектными кнопками.',
      solution: '.hero {\n  position: relative;\n  min-height: 100vh;\n  background:\n    linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(15,23,42,0.8)),\n    url("hero.jpg") center / cover no-repeat;\n  display: flex;\n  flex-direction: column;\n}\n\n.nav {\n  position: sticky;\n  top: 0;\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(12px) saturate(180%);\n  padding: 1rem 2rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.nav a { color: white; text-decoration: none; }\n\n.hero-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 2rem;\n}\n\n.gradient-title {\n  font-size: clamp(2.5rem, 6vw, 5rem);\n  font-weight: 800;\n  background: linear-gradient(to right, #60a5fa, #a78bfa, #f472b6);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\n.btn-gradient {\n  background: linear-gradient(135deg, #3b82f6, #8b5cf6);\n  color: white;\n  border: none;\n  padding: 0.75rem 2rem;\n  border-radius: 8px;\n  font-size: 1.125rem;\n  cursor: pointer;\n  transition: filter 0.2s;\n}\n\n.btn-gradient:hover {\n  filter: brightness(1.15);\n}\n\n.card:hover img {\n  filter: brightness(1.1) contrast(1.05);\n}',
      explanation: 'Multiple backgrounds создают оверлей поверх фото. backdrop-filter на навигации даёт эффект матового стекла. background-clip: text делает градиентный заголовок. filter: brightness на hover добавляет интерактивность.'
    }
  ]
}
