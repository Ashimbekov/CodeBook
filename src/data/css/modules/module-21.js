export default {
  id: 21,
  title: 'Tailwind CSS: адаптив и тёмная тема',
  description: 'Dark mode, responsive prefixes, group-, peer- и продвинутые состояния в Tailwind.',
  lessons: [
    {
      id: 1,
      title: 'Тёмная тема в Tailwind',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind поддерживает тёмную тему из коробки через префикс dark:. Два режима: media (по системным настройкам) и selector (ручное переключение).' },
        { type: 'heading', value: 'dark: префикс' },
        { type: 'code', language: 'html', value: '<!-- Светлая тема по умолчанию, тёмная через dark: -->\n<div class="bg-white dark:bg-gray-900">\n  <h1 class="text-gray-900 dark:text-white">Заголовок</h1>\n  <p class="text-gray-600 dark:text-gray-400">Текст</p>\n  <button class="bg-blue-500 dark:bg-blue-400 text-white">\n    Кнопка\n  </button>\n</div>\n\n<!-- Карточка с тёмной темой -->\n<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-gray-900/20">\n  <h3 class="text-gray-900 dark:text-gray-100 font-semibold">Карточка</h3>\n  <p class="text-gray-500 dark:text-gray-400 mt-2">Описание</p>\n</div>' },
        { type: 'heading', value: 'Режимы dark mode' },
        { type: 'code', language: 'css', value: '/* Tailwind v4: по умолчанию media (системные настройки) */\n/* Для ручного переключения через класс: */\n@import "tailwindcss";\n\n@custom-variant dark (&:where(.dark, .dark *));\n\n/* Теперь dark: работает при class="dark" на <html> */\n\n/* Tailwind v3: в tailwind.config.js */\n/* darkMode: "class"  — через класс */\n/* darkMode: "media"  — по системе (по умолчанию) */' },
        { type: 'heading', value: 'Переключатель темы (JavaScript)' },
        { type: 'code', language: 'html', value: '<script>\n// Переключатель тёмной темы\nfunction toggleDarkMode() {\n  document.documentElement.classList.toggle("dark");\n  const isDark = document.documentElement.classList.contains("dark");\n  localStorage.setItem("theme", isDark ? "dark" : "light");\n}\n\n// При загрузке: проверить сохранённую тему\nconst saved = localStorage.getItem("theme");\nif (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {\n  document.documentElement.classList.add("dark");\n}\n</script>' },
        { type: 'tip', value: 'Для тёмной темы используйте оттенки: светлая bg-white/text-gray-900, тёмная dark:bg-gray-900/dark:text-gray-100. Средние серые (400-600) хорошо работают в обеих темах.' }
      ]
    },
    {
      id: 2,
      title: 'Продвинутые responsive-паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо базовых sm:/md:/lg: Tailwind предлагает max-*, min-* и range breakpoints для точного контроля адаптивности.' },
        { type: 'heading', value: 'Max-width breakpoints' },
        { type: 'code', language: 'html', value: '<!-- max-*: стили ДО указанного breakpoint -->\n<div class="max-md:flex-col flex">Колонка до md, строка после</div>\n<div class="max-lg:hidden">Скрыто до lg</div>\n<div class="max-sm:text-sm">Мелкий текст только на мобильных</div>\n\n<!-- Диапазон: md до lg -->\n<div class="md:max-lg:bg-blue-100">Синий фон только на планшетах</div>' },
        { type: 'heading', value: 'Адаптивные паттерны' },
        { type: 'code', language: 'html', value: '<!-- Адаптивная навигация -->\n<header class="flex items-center justify-between p-4">\n  <a class="text-xl font-bold">Лого</a>\n  \n  <!-- Мобильное меню-бургер -->\n  <button class="md:hidden p-2">\n    <svg class="w-6 h-6"><!-- бургер иконка --></svg>\n  </button>\n  \n  <!-- Десктопная навигация -->\n  <nav class="hidden md:flex items-center gap-6">\n    <a class="text-gray-600 hover:text-gray-900">Главная</a>\n    <a class="text-gray-600 hover:text-gray-900">О нас</a>\n    <a class="text-gray-600 hover:text-gray-900">Контакты</a>\n  </nav>\n</header>\n\n<!-- Адаптивный sidebar layout -->\n<div class="flex flex-col lg:flex-row">\n  <aside class="w-full lg:w-64 lg:min-h-screen p-4 bg-gray-50">\n    Sidebar\n  </aside>\n  <main class="flex-1 p-4 lg:p-8">\n    Контент\n  </main>\n</div>' },
        { type: 'note', value: 'Container queries в Tailwind: используйте плагин @tailwindcss/container-queries. Класс @container на родителе, @sm:, @md:, @lg: на дочерних.' }
      ]
    },
    {
      id: 3,
      title: 'Group и peer: стилизация связанных элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'group позволяет стилизовать потомков на основе состояния родителя. peer — стилизовать соседние элементы. Это замена JS для многих интерактивных паттернов.' },
        { type: 'heading', value: 'group — стили по состоянию родителя' },
        { type: 'code', language: 'html', value: '<!-- Карточка: при hover меняются стили потомков -->\n<div class="group p-6 rounded-xl bg-white hover:bg-blue-500 transition-colors">\n  <h3 class="text-gray-900 group-hover:text-white transition-colors">\n    Заголовок\n  </h3>\n  <p class="text-gray-500 group-hover:text-blue-100 transition-colors">\n    Описание\n  </p>\n  <span class="text-blue-500 group-hover:text-white transition-colors">\n    Читать далее →\n  </span>\n</div>\n\n<!-- Именованные группы -->\n<div class="group/card p-4">\n  <div class="group/button">\n    <button class="group-hover/button:bg-blue-600">\n      Кнопка\n    </button>\n  </div>\n  <p class="group-hover/card:text-blue-500">Текст карточки</p>\n</div>' },
        { type: 'heading', value: 'peer — стили соседнего элемента' },
        { type: 'code', language: 'html', value: '<!-- Валидация без JS: показать ошибку если input невалиден -->\n<div>\n  <input type="email" required class="peer border rounded px-3 py-2\n    invalid:border-red-500 valid:border-green-500" placeholder="Email">\n  \n  <p class="hidden peer-invalid:block text-red-500 text-sm mt-1">\n    Введите корректный email\n  </p>\n  <p class="hidden peer-valid:block text-green-500 text-sm mt-1">\n    Email корректен ✓\n  </p>\n</div>\n\n<!-- Floating label -->\n<div class="relative">\n  <input type="text" class="peer w-full border rounded px-3 pt-5 pb-2\n    placeholder-transparent focus:border-blue-500 outline-none" placeholder="Имя">\n  <label class="absolute left-3 top-1 text-xs text-gray-400\n    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base\n    peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500\n    transition-all">\n    Имя\n  </label>\n</div>' },
        { type: 'tip', value: 'peer работает только для СЛЕДУЮЩИХ соседних элементов (peer должен быть ПЕРЕД стилизуемым элементом в HTML). Это ограничение CSS-селектора ~.' }
      ]
    },
    {
      id: 4,
      title: 'Другие состояния и варианты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind поддерживает десятки вариантов: from data-attributes, aria-states, print, landscape/portrait и другие.' },
        { type: 'heading', value: 'Data-атрибуты и ARIA' },
        { type: 'code', language: 'html', value: '<!-- Data-атрибуты -->\n<div data-active="true" class="data-[active=true]:bg-blue-500 data-[active=true]:text-white p-4 rounded">\n  Активный элемент\n</div>\n\n<div data-state="open" class="data-[state=open]:block data-[state=closed]:hidden">\n  Выпадающее меню\n</div>\n\n<!-- ARIA-состояния -->\n<button aria-expanded="true" class="aria-expanded:bg-gray-100 aria-expanded:rotate-180 transition">\n  Развернуть\n</button>\n\n<div aria-selected="true" class="aria-selected:bg-blue-50 aria-selected:border-blue-500 border p-3 rounded">\n  Выбранный элемент\n</div>\n\n<!-- Open/Closed (для details/dialog) -->\n<details class="group">\n  <summary class="cursor-pointer">Вопрос</summary>\n  <p class="group-open:animate-slide-up mt-2">Ответ</p>\n</details>' },
        { type: 'heading', value: 'Print, landscape, motion' },
        { type: 'code', language: 'html', value: '<!-- Print — стили для печати -->\n<nav class="print:hidden">Навигация (скрыта при печати)</nav>\n<article class="print:text-black print:bg-white">Контент</article>\n\n<!-- Landscape/Portrait -->\n<div class="portrait:flex-col landscape:flex-row flex">\n  Ориентация\n</div>\n\n<!-- Motion preferences -->\n<div class="motion-safe:animate-bounce motion-reduce:animate-none">\n  Анимация только если пользователь не отключил\n</div>\n\n<!-- Supports -->\n<div class="supports-[backdrop-filter]:backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">\n  Glassmorphism только если поддерживается\n</div>' },
        { type: 'note', value: 'motion-safe: и motion-reduce: — важные варианты для доступности. Всегда используйте их с анимациями, чтобы уважать настройки prefers-reduced-motion.' }
      ]
    },
    {
      id: 5,
      title: 'Организация Tailwind-проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший Tailwind-проект требует организации: clsx/cn для условных классов, продуманной структуры компонентов и единообразия.' },
        { type: 'heading', value: 'clsx/cn — условные классы' },
        { type: 'code', language: 'html', value: '<script>\nimport { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\n// cn — объединяет clsx + tailwind-merge\nfunction cn(...inputs) {\n  return twMerge(clsx(inputs));\n}\n\n// Использование\nfunction Button({ variant, size, className, children }) {\n  return (\n    <button\n      className={cn(\n        "font-medium rounded-lg transition-colors",\n        {\n          "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",\n          "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",\n        },\n        {\n          "text-sm py-2 px-4": size === "md",\n          "text-xs py-1.5 px-3": size === "sm",\n        },\n        className  // позволяет переопределить стили\n      )}\n    >\n      {children}\n    </button>\n  );\n}\n\n// <Button variant="primary" className="mt-4">Кнопка</Button>\n</script>' },
        { type: 'heading', value: 'Tailwind-merge' },
        { type: 'code', language: 'html', value: '<script>\nimport { twMerge } from "tailwind-merge";\n\n// Без merge: "px-4 px-6" → применяются оба (конфликт)\n// С merge: twMerge("px-4 px-6") → "px-6" (последний побеждает)\n\ntwMerge("text-red-500 text-blue-500");  // → "text-blue-500"\ntwMerge("p-4 px-6");                    // → "p-4 px-6" (не конфликтуют)\ntwMerge("rounded-lg rounded-xl");       // → "rounded-xl"\n</script>' },
        { type: 'tip', value: 'cn() (clsx + tailwind-merge) — стандарт в React/Tailwind проектах. Установите: npm install clsx tailwind-merge. Это позволяет компонентам принимать className для кастомизации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Страница с тёмной темой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полную страницу с поддержкой тёмной темы: навигация, карточки, формы — с dark: стилями.',
      requirements: [
        'Навигация с переключателем тёмной темы',
        'Hero-секция с адаптивными стилями (dark: фоны и тексты)',
        'Карточки с group-hover и dark: стилями',
        'Форма с peer-валидацией (peer-invalid: показ ошибки)',
        'Responsive: мобильная и десктопная версия',
        'motion-safe: для анимаций'
      ],
      hint: 'Добавьте dark: вариант для каждого цвета: bg-white dark:bg-gray-900, text-gray-900 dark:text-white. Используйте group для hover на карточках.',
      expectedOutput: 'Страница, красиво выглядящая в светлой и тёмной теме, с адаптивностью и hover-эффектами.',
      solution: '<div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">\n\n  <nav class="flex items-center justify-between px-4 md:px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">\n    <span class="text-xl font-bold">Лого</span>\n    <div class="hidden md:flex gap-6">\n      <a class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Главная</a>\n      <a class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">О нас</a>\n    </div>\n    <button onclick="document.documentElement.classList.toggle(\'dark\')" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Тема</button>\n  </nav>\n\n  <section class="px-4 md:px-8 py-12 md:py-20 text-center">\n    <h1 class="text-3xl md:text-5xl font-bold mb-4 motion-safe:animate-fade-in">Заголовок</h1>\n    <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Описание проекта</p>\n  </section>\n\n  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 max-w-6xl mx-auto">\n    <div class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all motion-safe:hover:-translate-y-1">\n      <h3 class="font-semibold mb-2 group-hover:text-blue-500 transition-colors">Карточка</h3>\n      <p class="text-gray-500 dark:text-gray-400 text-sm">Описание карточки</p>\n    </div>\n  </div>\n\n  <div class="max-w-md mx-auto px-4 py-12">\n    <div class="mb-4">\n      <input type="email" required placeholder="Email" class="peer w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition">\n      <p class="hidden peer-invalid:block text-red-500 text-sm mt-1">Введите корректный email</p>\n    </div>\n  </div>\n\n</div>',
      explanation: 'Каждый цвет имеет dark: вариант. Навигация и карточки адаптируются к теме. group-hover меняет стили при наведении. peer-invalid показывает ошибку валидации. motion-safe: добавляет анимации только для пользователей без ограничений.'
    }
  ]
}
