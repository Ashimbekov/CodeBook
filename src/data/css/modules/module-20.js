export default {
  id: 20,
  title: 'Tailwind CSS: кастомизация',
  description: 'Конфигурация Tailwind: цвета, шрифты, spacing, plugins и расширение дизайн-системы.',
  lessons: [
    {
      id: 1,
      title: 'Конфигурация через CSS (Tailwind v4)',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Tailwind v4 конфигурация происходит через CSS с помощью @theme. Это заменяет tailwind.config.js из v3, делая настройку проще и нативнее.' },
        { type: 'heading', value: '@theme — кастомизация дизайн-системы' },
        { type: 'code', language: 'css', value: '/* app.css */\n@import "tailwindcss";\n\n@theme {\n  /* Кастомные цвета */\n  --color-brand: #6366f1;\n  --color-brand-light: #818cf8;\n  --color-brand-dark: #4f46e5;\n\n  /* Шрифты */\n  --font-sans: "Inter", system-ui, sans-serif;\n  --font-mono: "JetBrains Mono", monospace;\n\n  /* Расширение spacing */\n  --spacing-18: 4.5rem;\n  --spacing-128: 32rem;\n\n  /* Кастомные breakpoints */\n  --breakpoint-xs: 480px;\n  --breakpoint-3xl: 1920px;\n\n  /* Border radius */\n  --radius-4xl: 2rem;\n\n  /* Тени */\n  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);\n}\n\n/* Использование */\n/* class="bg-brand text-brand-light font-sans" */\n/* class="p-18 max-w-128 rounded-4xl shadow-glow" */\n/* class="xs:block 3xl:text-lg" */' },
        { type: 'tip', value: 'В Tailwind v4 конфигурация через CSS стала стандартом. Это позволяет IDE лучше поддерживать автодополнение и работает быстрее, чем JS-конфиг.' }
      ]
    },
    {
      id: 2,
      title: 'Кастомные цветовые палитры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создание собственной цветовой палитры — главная задача кастомизации. Tailwind позволяет добавить брендовые цвета с оттенками.' },
        { type: 'heading', value: 'Палитра брендовых цветов' },
        { type: 'code', language: 'css', value: '@theme {\n  /* Полная палитра бренда */\n  --color-brand-50: #eef2ff;\n  --color-brand-100: #e0e7ff;\n  --color-brand-200: #c7d2fe;\n  --color-brand-300: #a5b4fc;\n  --color-brand-400: #818cf8;\n  --color-brand-500: #6366f1;\n  --color-brand-600: #4f46e5;\n  --color-brand-700: #4338ca;\n  --color-brand-800: #3730a3;\n  --color-brand-900: #312e81;\n  --color-brand-950: #1e1b4b;\n\n  /* Семантические цвета */\n  --color-accent: #f59e0b;\n  --color-surface: #ffffff;\n  --color-surface-secondary: #f8fafc;\n}\n\n/* Использование:\n   class="bg-brand-500 hover:bg-brand-600"\n   class="text-brand-100 bg-brand-900"\n   class="border-brand-200"\n*/' },
        { type: 'heading', value: 'Tailwind v3: tailwind.config.js' },
        { type: 'code', language: 'html', value: '<script>\n// tailwind.config.js (Tailwind v3)\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          50: \'#eef2ff\',\n          100: \'#e0e7ff\',\n          500: \'#6366f1\',\n          600: \'#4f46e5\',\n          900: \'#312e81\',\n        },\n        accent: \'#f59e0b\',\n      },\n    },\n  },\n};\n</script>' },
        { type: 'note', value: 'Инструменты для генерации палитр: UI Colors (uicolors.app), Tailwind Color Generator, oklch-палитры. Создайте палитру из одного базового цвета.' }
      ]
    },
    {
      id: 3,
      title: 'Кастомные шрифты, spacing и screens',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо цветов, Tailwind позволяет кастомизировать шрифты, отступы, breakpoints и другие параметры дизайн-системы.' },
        { type: 'heading', value: 'Шрифты и типографика' },
        { type: 'code', language: 'css', value: '@theme {\n  /* Шрифты */\n  --font-heading: "Cal Sans", "Inter", sans-serif;\n  --font-body: "Inter", system-ui, sans-serif;\n  --font-code: "Fira Code", monospace;\n\n  /* Размеры шрифтов с line-height */\n  --text-hero: 4rem;\n  --text-hero--line-height: 1.1;\n  --text-hero--letter-spacing: -0.02em;\n}\n\n/* Использование:\n   class="font-heading text-hero"\n   class="font-body"\n   class="font-code"\n*/' },
        { type: 'heading', value: 'Spacing и sizing' },
        { type: 'code', language: 'css', value: '@theme {\n  /* Дополнительные spacing значения */\n  --spacing-4.5: 1.125rem;\n  --spacing-13: 3.25rem;\n  --spacing-15: 3.75rem;\n  --spacing-128: 32rem;\n  --spacing-144: 36rem;\n\n  /* Кастомные max-width */\n  --container-8xl: 88rem;   /* 1408px */\n  --container-prose: 65ch;  /* для текста */\n}\n\n/* class="p-4.5 mt-13 max-w-prose" */' },
        { type: 'heading', value: 'Анимации' },
        { type: 'code', language: 'css', value: '/* Кастомные анимации */\n@theme {\n  --animate-slide-up: slide-up 0.3s ease-out;\n  --animate-fade-in: fade-in 0.5s ease forwards;\n}\n\n@keyframes slide-up {\n  from { opacity: 0; transform: translateY(10px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n/* class="animate-slide-up"\n   class="animate-fade-in" */' },
        { type: 'tip', value: 'Расширяйте тему через @theme вместо замены. Так вы сохраняете все стандартные значения Tailwind и добавляете свои.' }
      ]
    },
    {
      id: 4,
      title: 'Tailwind plugins',
      type: 'theory',
      content: [
        { type: 'text', value: 'Плагины расширяют Tailwind новыми утилитами, компонентами и вариантами. Существуют официальные плагины и возможность создания своих.' },
        { type: 'heading', value: 'Официальные плагины' },
        { type: 'code', language: 'bash', value: '# Typography — стили для markdown/HTML контента\nnpm install @tailwindcss/typography\n\n# Forms — стили для нативных form-элементов\nnpm install @tailwindcss/forms\n\n# Container queries\nnpm install @tailwindcss/container-queries\n\n# Aspect ratio (встроен в v3.3+)\n# Line clamp (встроен в v3.3+)' },
        { type: 'heading', value: '@tailwindcss/typography' },
        { type: 'code', language: 'html', value: '<!-- Плагин typography: class="prose" стилизует HTML-контент -->\n<article class="prose prose-lg prose-blue max-w-none">\n  <h1>Заголовок статьи</h1>\n  <p>Обычный параграф с <a href="#">ссылкой</a> и <strong>жирным</strong> текстом.</p>\n  <pre><code>console.log("Hello")</code></pre>\n  <ul>\n    <li>Пункт списка</li>\n    <li>Ещё пункт</li>\n  </ul>\n</article>\n\n<!-- Модификаторы prose:\n  prose-sm, prose-base, prose-lg, prose-xl — размеры\n  prose-blue, prose-green — цвет акцента\n  prose-invert — для тёмного фона\n-->' },
        { type: 'heading', value: '@tailwindcss/forms' },
        { type: 'code', language: 'html', value: '<!-- Плагин forms: красивые нативные элементы из коробки -->\n<input type="text" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">\n<select class="rounded-md border-gray-300">\n  <option>Вариант 1</option>\n</select>\n<input type="checkbox" class="rounded text-blue-500 focus:ring-blue-500">\n<textarea class="rounded-md border-gray-300 focus:border-blue-500"></textarea>' },
        { type: 'tip', value: '@tailwindcss/typography — must-have для блогов и CMS. Один класс prose стилизует весь HTML-контент: заголовки, списки, таблицы, код, цитаты.' }
      ]
    },
    {
      id: 5,
      title: 'Создание своих утилит',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind позволяет добавлять кастомные утилиты, компоненты и варианты через CSS или plugin API.' },
        { type: 'heading', value: 'Кастомные утилиты через CSS' },
        { type: 'code', language: 'css', value: '/* Добавление утилит через @utility (Tailwind v4) */\n@utility text-balance {\n  text-wrap: balance;\n}\n\n@utility text-pretty {\n  text-wrap: pretty;\n}\n\n@utility scrollbar-hide {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n  &::-webkit-scrollbar {\n    display: none;\n  }\n}\n\n@utility glass {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n}\n\n/* Использование:\n   class="text-balance scrollbar-hide glass"\n   class="hover:glass"\n*/' },
        { type: 'heading', value: 'Базовые стили и компоненты' },
        { type: 'code', language: 'css', value: '@import "tailwindcss";\n\n/* Базовые стили (аналог @layer base в v3) */\n@layer base {\n  html {\n    scroll-behavior: smooth;\n  }\n\n  body {\n    @apply bg-white text-gray-900 antialiased;\n  }\n\n  h1, h2, h3 {\n    @apply font-heading;\n  }\n}\n\n/* Компоненты */\n@layer components {\n  .btn {\n    @apply inline-flex items-center justify-center\n           font-medium rounded-lg transition-colors;\n  }\n\n  .card {\n    @apply bg-white rounded-xl border border-gray-200\n           shadow-sm hover:shadow-md transition-shadow;\n  }\n\n  .input {\n    @apply w-full rounded-lg border border-gray-300 px-4 py-2\n           focus:border-blue-500 focus:ring-2 focus:ring-blue-200\n           outline-none transition;\n  }\n}' },
        { type: 'note', value: '@layer base — для глобальных стилей элементов. @layer components — для компонентных классов. @layer utilities — для утилит (самый высокий приоритет).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Кастомная тема',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Tailwind для проекта: кастомные цвета, шрифты, анимации и утилиты.',
      requirements: [
        'Добавьте брендовую палитру (brand-50 до brand-900) через @theme',
        'Кастомные шрифты: heading и body',
        'Кастомная анимация slide-up через @keyframes',
        'Утилита .glass для glassmorphism эффекта',
        'Компоненты .btn и .card через @layer components',
        'Базовые стили body и заголовков через @layer base'
      ],
      hint: 'Используйте @theme для токенов, @keyframes для анимаций, @utility для утилит и @layer для организации.',
      expectedOutput: 'Полностью настроенная тема Tailwind с брендовыми цветами, шрифтами, анимациями и готовыми компонентами.',
      solution: '@import "tailwindcss";\n\n@theme {\n  --color-brand-50: #eef2ff;\n  --color-brand-100: #e0e7ff;\n  --color-brand-200: #c7d2fe;\n  --color-brand-300: #a5b4fc;\n  --color-brand-400: #818cf8;\n  --color-brand-500: #6366f1;\n  --color-brand-600: #4f46e5;\n  --color-brand-700: #4338ca;\n  --color-brand-800: #3730a3;\n  --color-brand-900: #312e81;\n\n  --font-heading: "Cal Sans", "Inter", sans-serif;\n  --font-body: "Inter", system-ui, sans-serif;\n\n  --animate-slide-up: slide-up 0.4s ease-out;\n}\n\n@keyframes slide-up {\n  from { opacity: 0; transform: translateY(10px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n@utility glass {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(12px) saturate(180%);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n\n@layer base {\n  body {\n    @apply font-body bg-white text-gray-900 antialiased;\n  }\n  h1, h2, h3, h4 {\n    @apply font-heading tracking-tight;\n  }\n}\n\n@layer components {\n  .btn {\n    @apply inline-flex items-center justify-center font-medium rounded-lg transition-colors text-sm py-2 px-4;\n  }\n  .btn-brand {\n    @apply bg-brand-500 hover:bg-brand-600 text-white;\n  }\n  .card {\n    @apply bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6;\n  }\n}',
      explanation: '@theme добавляет брендовые цвета и шрифты в систему Tailwind. @keyframes определяет анимацию. @utility создаёт утилиту glass. @layer base задаёт глобальные стили. @layer components — переиспользуемые компоненты.'
    }
  ]
}
