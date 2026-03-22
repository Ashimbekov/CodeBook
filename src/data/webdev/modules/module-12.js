export default {
  id: 12,
  title: 'Адаптивный дизайн',
  description: 'Media queries, mobile-first подход, относительные единицы — создание сайтов для любых экранов',
  lessons: [
    {
      id: 1,
      title: 'Что такое адаптивный дизайн?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Адаптивный (responsive) дизайн — это подход, при котором сайт корректно отображается на любом устройстве: телефоне, планшете, ноутбуке, телевизоре.' },
        { type: 'heading', value: 'Три кита адаптивного дизайна' },
        { type: 'list', items: [
          'Гибкая сетка (fluid grid) — ширины в %, fr, а не px',
          'Гибкие изображения — max-width: 100%',
          'Media queries — разные стили для разных экранов'
        ]},
        { type: 'code', language: 'html', value: '<!-- Обязательно в <head>! Без этого мобильный браузер\n     масштабирует страницу как десктопную -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
        { type: 'tip', value: 'Более 60% трафика в интернете — с мобильных. Адаптивный дизайн — это не опция, это необходимость.' }
      ]
    },
    {
      id: 2,
      title: 'Media Queries',
      type: 'theory',
      content: [
        { type: 'text', value: '@media — правило CSS, которое применяет стили только при определённых условиях (ширина экрана, ориентация, цветовая схема).' },
        { type: 'code', language: 'css', value: '/* Применять стили только при ширине <= 768px */\n@media (max-width: 768px) {\n  .sidebar { display: none; }\n  .content { width: 100%; }\n}\n\n/* Ширина >= 1200px */\n@media (min-width: 1200px) {\n  .container { max-width: 1200px; }\n}\n\n/* Диапазон */\n@media (min-width: 768px) and (max-width: 1024px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n/* Ориентация */\n@media (orientation: landscape) { ... }\n@media (orientation: portrait) { ... }\n\n/* Тёмная тема */\n@media (prefers-color-scheme: dark) {\n  body { background: #111; color: #eee; }\n}\n\n/* Печать */\n@media print {\n  .no-print { display: none; }\n}' },
        { type: 'heading', value: 'Операторы media queries' },
        { type: 'list', items: [
          'and — условие И: @media (min-width: 768px) and (orientation: landscape)',
          'not — инверсия: @media not (prefers-color-scheme: dark)',
          ',  — условие ИЛИ: @media (max-width: 480px), (orientation: portrait)',
          'only — предотвращает применение в старых браузерах (устарел, но встречается)'
        ]},
        { type: 'tip', value: 'Современный синтаксис range queries (Level 4): @media (width >= 768px) и @media (768px <= width <= 1024px). Более читаемо и уже поддерживается в большинстве браузеров.' }
      ]
    },
    {
      id: 3,
      title: 'Mobile-first подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mobile-first — стратегия разработки, при которой сначала пишут стили для мобильного, а потом расширяют для больших экранов с помощью min-width.' },
        { type: 'code', language: 'css', value: '/* Mobile-first (рекомендуется) */\n/* Базовые стили — для мобильного */\n.container {\n  padding: 0 16px;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: 1fr; /* 1 колонка на мобильном */\n  gap: 16px;\n}\n\n/* Планшет: 1 колонка → 2 колонки */\n@media (min-width: 768px) {\n  .container { padding: 0 32px; }\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n/* Десктоп: 2 → 3 колонки */\n@media (min-width: 1024px) {\n  .container { padding: 0 48px; max-width: 1200px; margin: 0 auto; }\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}' },
        { type: 'list', items: [
          'Desktop-first: начинаем с max-width (устаревший подход)',
          'Mobile-first: начинаем с min-width (современный подход)',
          'Mobile-first = меньше кода перегрузки, лучше производительность'
        ]}
      ]
    },
    {
      id: 4,
      title: 'Точки переключения (breakpoints)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Breakpoints — точки, в которых меняется дизайн. Не привязывайся к конкретным устройствам, ориентируйся на контент.' },
        { type: 'code', language: 'css', value: '/* Популярные breakpoints */\n\n/* Мобильный — базовые стили (до 768px) */\n/* Планшет */\n@media (min-width: 768px) { ... }\n\n/* Маленький десктоп */\n@media (min-width: 1024px) { ... }\n\n/* Широкий десктоп */\n@media (min-width: 1280px) { ... }\n\n/* Сверхширокий */\n@media (min-width: 1536px) { ... }\n\n/* Лайфхак: именованные переменные (нельзя в media, но полезно знать) */\n/* :root { --tablet: 768px; } */\n\n/* CSS пока не поддерживает переменные в @media */\n/* Но Sass позволяет: @media (min-width: #{$tablet}) */' },
        { type: 'tip', value: 'Добавляй breakpoints там, где дизайн "ломается", а не по размерам конкретных устройств. Открой браузер, сужай и расширяй окно — места, где дизайн выглядит плохо, и есть твои breakpoints.' }
      ]
    },
    {
      id: 5,
      title: 'Относительные единицы и fluid typography',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные единицы измерения делают дизайн адаптивным без media queries.' },
        { type: 'code', language: 'css', value: '/* Fluid typography с clamp() */\n.heading {\n  /* clamp(минимум, идеальный, максимум) */\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  /* На 300px: 1.5rem, на 750px: ~3rem, на 1500px: 3rem */\n}\n\n/* Fluid spacing */\n.section {\n  padding: clamp(24px, 5vw, 80px);\n}\n\n/* vw и vh */\n.hero {\n  height: 100vh;    /* 100% высоты окна */\n  width: 100vw;     /* 100% ширины окна */\n}\n\n/* Современные единицы (для мобильных) */\n.full-screen {\n  height: 100dvh; /* dynamic viewport height — учитывает мобильный UI */\n  height: 100svh; /* small viewport height — минимальная высота */\n  height: 100lvh; /* large viewport height — максимальная высота */\n}\n\n/* Контейнерные единицы */\n.card-title {\n  font-size: 5cqi; /* 5% от ширины контейнера (inline) */\n}' },
        { type: 'heading', value: 'Таблица единиц измерения' },
        { type: 'list', items: [
          'px — абсолютные пиксели, не адаптируются',
          'rem — относительно размера шрифта корневого элемента (html), 1rem = 16px',
          'em — относительно размера шрифта родителя (каскадируется)',
          'vw / vh — процент от ширины / высоты viewport',
          '% — процент от размера родительского элемента',
          'ch — ширина символа "0" текущего шрифта (удобно для ограничения ширины текста)'
        ]},
        { type: 'tip', value: 'Используй rem для размеров шрифтов и отступов — это позволяет пользователю изменять базовый размер в настройках браузера. Используй px только для border, border-radius и теней.' }
      ]
    },
    {
      id: 6,
      title: 'Адаптивные изображения и типографика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Изображения и текст требуют особого внимания при адаптивной вёрстке.' },
        { type: 'code', language: 'css', value: '/* Базовое правило для всех изображений */\nimg, video {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Адаптивный фон */\n.hero {\n  background-image: url("hero-mobile.jpg");\n  background-size: cover;\n  background-position: center;\n}\n\n@media (min-width: 768px) {\n  .hero {\n    background-image: url("hero-desktop.jpg");\n  }\n}\n\n/* Адаптивный текст */\nbody {\n  font-size: 16px;       /* базовый */\n  line-height: 1.5;\n}\n\nh1 { font-size: clamp(1.75rem, 5vw, 3rem); }\nh2 { font-size: clamp(1.5rem, 3.5vw, 2.25rem); }\np  { max-width: 65ch; }  /* оптимальная длина строки */\n\n/* Скрытие элементов на мобильном */\n.desktop-only { display: none; }\n\n@media (min-width: 1024px) {\n  .desktop-only { display: block; }\n  .mobile-only  { display: none; }\n}' },
        { type: 'tip', value: 'Тег picture даёт полный контроль над адаптивными изображениями: разные форматы (WebP/JPEG) и разные размеры для разных экранов. Браузер сам выберет наилучший вариант.' },
        { type: 'code', language: 'html', value: '<!-- Адаптивные изображения с picture -->\n<picture>\n  <source media="(min-width: 768px)" srcset="hero-desktop.webp" type="image/webp">\n  <source media="(min-width: 768px)" srcset="hero-desktop.jpg">\n  <source srcset="hero-mobile.webp" type="image/webp">\n  <img src="hero-mobile.jpg" alt="Hero" loading="lazy">\n</picture>' },
        { type: 'note', value: 'loading="lazy" откладывает загрузку изображений вне viewport — ускоряет первоначальную загрузку страницы. Используй для всех изображений ниже первого экрана. Для изображений в первом экране используй loading="eager" или не указывай атрибут.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Адаптивная страница портфолио',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай мобильную и десктопную версию страницы портфолио с mobile-first подходом.',
      requirements: [
        'Mobile-first: базовые стили для мобильного (<768px)',
        'На мобильном: навигация — вертикальный список, одна колонка',
        'На планшете (768px+): навигация — горизонтальная, 2 колонки карточек',
        'На десктопе (1024px+): навигация со ссылками справа, 3 колонки карточек',
        'Fluid typography с clamp()',
        'Viewport-тег в HTML'
      ],
      expectedOutput: 'Адаптивная страница портфолио',
      hint: 'Начни с HTML. Потом пиши CSS для мобильного. Потом добавляй @media (min-width: 768px) и @media (min-width: 1024px).',
      solution: '/* Mobile-first CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  color: #333;\n  line-height: 1.6;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n\n/* Навигация — мобильная */\nnav {\n  background: #1a1a2e;\n  padding: 16px;\n}\n\n.nav-links {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.nav-links a {\n  color: white;\n  text-decoration: none;\n  padding: 8px;\n  display: block;\n}\n\n.hero {\n  padding: 40px 16px;\n  text-align: center;\n}\n\n.hero h1 {\n  font-size: clamp(1.75rem, 8vw, 3rem);\n  margin-bottom: 16px;\n}\n\n.hero p {\n  font-size: clamp(1rem, 3vw, 1.25rem);\n  color: #666;\n}\n\n.projects-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 20px;\n  padding: 40px 16px;\n}\n\n/* Планшет */\n@media (min-width: 768px) {\n  .container { padding: 0 32px; }\n\n  nav { padding: 16px 32px; }\n  .nav-links {\n    flex-direction: row;\n    gap: 24px;\n  }\n\n  .hero { padding: 80px 32px; }\n\n  .projects-grid {\n    grid-template-columns: repeat(2, 1fr);\n    padding: 40px 32px;\n  }\n}\n\n/* Десктоп */\n@media (min-width: 1024px) {\n  nav {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 0 48px;\n    height: 64px;\n  }\n\n  .projects-grid {\n    grid-template-columns: repeat(3, 1fr);\n    padding: 60px 48px;\n  }\n}',
      explanation: 'Mobile-first: пишем базовый CSS для мобильного, а @media (min-width: N) расширяет дизайн для больших экранов. clamp() делает размеры плавными. Главное правило: min-width для mobile-first, max-width для desktop-first.'
    },
    {
      id: 8,
      title: 'Практика: Адаптивное меню-гамбургер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай навигацию, которая на мобильном скрывается за кнопкой-гамбургером.',
      requirements: [
        'На мобильном: только кнопка ☰, меню скрыто',
        'При нажатии на кнопку: меню показывается/скрывается',
        'На десктопе (768px+): меню всегда видно, кнопка скрыта',
        'Анимация открытия/закрытия',
        'JavaScript для переключения класса'
      ],
      expectedOutput: 'Адаптивное меню с гамбургером',
      hint: 'Кнопка переключает класс .open на nav. В CSS: .nav-links скрыт по умолчанию, .nav.open .nav-links — виден.',
      solution: '/* CSS */\n.nav-links {\n  display: none;\n  flex-direction: column;\n  gap: 8px;\n  padding: 16px;\n}\n\n.nav.open .nav-links {\n  display: flex;\n}\n\n.hamburger {\n  background: none;\n  border: none;\n  color: white;\n  font-size: 24px;\n  cursor: pointer;\n  padding: 8px;\n}\n\n@media (min-width: 768px) {\n  .hamburger { display: none; }\n  .nav-links {\n    display: flex !important;\n    flex-direction: row;\n    padding: 0;\n  }\n}\n\n/* JavaScript */\n// const hamburger = document.querySelector(".hamburger");\n// const nav = document.querySelector("nav");\n// hamburger.addEventListener("click", () => {\n//   nav.classList.toggle("open");\n// });',
      explanation: 'Классический паттерн адаптивного меню: скрываем список на мобильном, показываем при добавлении класса через JS. На десктопе display: flex !important перебивает inline-стили от JS. Просто и надёжно.'
    }
  ]
}
