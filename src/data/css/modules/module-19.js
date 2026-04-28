export default {
  id: 19,
  title: 'Tailwind CSS: компоненты',
  description: 'Извлечение компонентов, @apply, plugins и повторное использование стилей в Tailwind.',
  lessons: [
    {
      id: 1,
      title: 'Извлечение компонентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда один и тот же набор классов повторяется — извлекайте его в компонент фреймворка (React, Vue). Это основной способ переиспользования стилей в Tailwind.' },
        { type: 'heading', value: 'Компонентный подход' },
        { type: 'code', language: 'html', value: '<!-- ❌ Плохо: копипаста одинаковых классов -->\n<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">Кнопка 1</button>\n<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">Кнопка 2</button>\n<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">Кнопка 3</button>' },
        { type: 'code', language: 'html', value: '<script>\n// ✅ Хорошо: React-компонент\nfunction Button({ children, variant = "primary", size = "md", ...props }) {\n  const base = "font-medium rounded-lg transition inline-flex items-center justify-center";\n  \n  const variants = {\n    primary: "bg-blue-500 hover:bg-blue-600 text-white",\n    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",\n    danger: "bg-red-500 hover:bg-red-600 text-white",\n    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50",\n  };\n\n  const sizes = {\n    sm: "text-sm py-1.5 px-3",\n    md: "text-sm py-2 px-4",\n    lg: "text-base py-2.5 px-5",\n  };\n\n  return (\n    <button className={`${base} ${variants[variant]} ${sizes[size]}`} {...props}>\n      {children}\n    </button>\n  );\n}\n</script>' },
        { type: 'tip', value: 'В Tailwind стили переиспользуются через КОМПОНЕНТЫ, а не через CSS-классы. Это фундаментальное отличие от BEM/SCSS.' }
      ]
    },
    {
      id: 2,
      title: '@apply для переиспользования',
      type: 'theory',
      content: [
        { type: 'text', value: '@apply позволяет извлечь набор utility-классов в кастомный CSS-класс. Используйте его для глобальных элементов (кнопки в CMS, стили для markdown).' },
        { type: 'heading', value: '@apply — извлечение утилит в класс' },
        { type: 'code', language: 'css', value: '/* globals.css */\n@import "tailwindcss";\n\n/* Кнопка */\n.btn {\n  @apply inline-flex items-center justify-center\n         font-medium rounded-lg transition;\n}\n\n.btn-primary {\n  @apply bg-blue-500 hover:bg-blue-600 text-white;\n}\n\n.btn-secondary {\n  @apply bg-gray-100 hover:bg-gray-200 text-gray-900;\n}\n\n.btn-sm {\n  @apply text-sm py-1.5 px-3;\n}\n\n.btn-md {\n  @apply text-sm py-2 px-4;\n}\n\n/* Input */\n.input {\n  @apply w-full rounded-lg border border-gray-300 px-4 py-2\n         focus:border-blue-500 focus:ring-2 focus:ring-blue-200\n         outline-none transition;\n}' },
        { type: 'heading', value: 'Когда использовать @apply' },
        { type: 'list', value: [
          'Стили для контента из CMS (markdown, rich text) — .prose h1, .prose p',
          'Глобальные элементы, которые нельзя обернуть в компонент',
          'Стили для third-party библиотек (переопределение)',
          'Базовые утилиты, которые не являются компонентами'
        ]},
        { type: 'note', value: 'Авторы Tailwind не рекомендуют злоупотреблять @apply. Если вы можете извлечь React/Vue компонент — это лучше. @apply — для случаев, когда компонент невозможен.' }
      ]
    },
    {
      id: 3,
      title: 'Arbitrary values и кастомные значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда стандартной шкалы Tailwind не хватает, используйте arbitrary values — произвольные значения в квадратных скобках.' },
        { type: 'heading', value: 'Arbitrary values' },
        { type: 'code', language: 'html', value: '<!-- Произвольные значения в [] -->\n<div class="w-[300px]">ширина: 300px</div>\n<div class="h-[calc(100vh-64px)]">высота: 100vh - 64px</div>\n<div class="top-[117px]">top: 117px</div>\n<div class="bg-[#1a1a2e]">кастомный цвет</div>\n<div class="text-[22px]">нестандартный размер</div>\n<div class="grid-cols-[200px_1fr_200px]">кастомный grid</div>\n<div class="font-[\'Fira_Code\']">кастомный шрифт</div>\n\n<!-- Произвольные свойства -->\n<div class="[mask-type:luminance]">любое CSS-свойство</div>\n<div class="[--my-var:16px]">CSS-переменная</div>\n\n<!-- Hover с arbitrary -->\n<div class="hover:bg-[#2563eb]">кастомный hover цвет</div>\n\n<!-- Responsive с arbitrary -->\n<div class="w-full md:w-[720px]">кастомная ширина на md</div>' },
        { type: 'heading', value: 'Arbitrary variants' },
        { type: 'code', language: 'html', value: '<!-- Кастомные селекторы -->\n<div class="[&>*]:mb-4">все дочерние элементы с margin-bottom</div>\n<div class="[&_p]:text-gray-600">все вложенные p серые</div>\n<div class="[&:nth-child(odd)]:bg-gray-50">нечётные элементы</div>\n\n<!-- Data-атрибуты -->\n<div class="data-[active=true]:bg-blue-500">data-active стилизация</div>\n\n<!-- Поддержка @supports -->\n<div class="supports-[backdrop-filter]:backdrop-blur-sm">\n  Backdrop только если поддерживается\n</div>' },
        { type: 'tip', value: 'Arbitrary values — запасной выход, когда нет нужного класса. Но если вы часто используете один и тот же [значение], лучше добавить его в конфиг Tailwind.' }
      ]
    },
    {
      id: 4,
      title: 'Transition и animation в Tailwind',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind предоставляет готовые классы для transition и базовых анимаций. Для сложных анимаций используйте кастомные keyframes в конфиге.' },
        { type: 'heading', value: 'Transition классы' },
        { type: 'code', language: 'html', value: '<!-- Transition -->\n<div class="transition">transition: все свойства 150ms</div>\n<div class="transition-colors">только цвета</div>\n<div class="transition-transform">только transform</div>\n<div class="transition-all">все свойства</div>\n<div class="transition-none">без transition</div>\n\n<!-- Длительность -->\n<div class="transition duration-75">75ms</div>\n<div class="transition duration-150">150ms</div>\n<div class="transition duration-300">300ms</div>\n<div class="transition duration-500">500ms</div>\n\n<!-- Timing function -->\n<div class="transition ease-in">ease-in</div>\n<div class="transition ease-out">ease-out</div>\n<div class="transition ease-in-out">ease-in-out</div>\n<div class="transition ease-linear">linear</div>\n\n<!-- Delay -->\n<div class="transition delay-150">150ms задержка</div>' },
        { type: 'heading', value: 'Animation классы' },
        { type: 'code', language: 'html', value: '<!-- Встроенные анимации -->\n<div class="animate-spin">Вращение (спиннер)</div>\n<div class="animate-ping">Пульсация (уведомление)</div>\n<div class="animate-pulse">Мерцание (скелетон)</div>\n<div class="animate-bounce">Подпрыгивание</div>\n\n<!-- Спиннер загрузки -->\n<svg class="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">\n  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>\n  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>\n</svg>\n\n<!-- Пульсирующее уведомление -->\n<span class="relative flex h-3 w-3">\n  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>\n  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>\n</span>' },
        { type: 'note', value: 'Для кастомных анимаций в Tailwind v4 добавьте @keyframes в CSS и используйте animate-[name]. В v3 — через tailwind.config.js.' }
      ]
    },
    {
      id: 5,
      title: 'Decoration: тени, скругления, border',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind предоставляет утилиты для всех декоративных свойств: border, border-radius, box-shadow, opacity, ring.' },
        { type: 'heading', value: 'Border и скругления' },
        { type: 'code', language: 'html', value: '<!-- Border width -->\n<div class="border">1px</div>\n<div class="border-2">2px</div>\n<div class="border-4">4px</div>\n<div class="border-b">только нижний</div>\n<div class="border-l-4 border-blue-500">цветная линия слева</div>\n\n<!-- Border radius -->\n<div class="rounded">4px</div>\n<div class="rounded-md">6px</div>\n<div class="rounded-lg">8px</div>\n<div class="rounded-xl">12px</div>\n<div class="rounded-2xl">16px</div>\n<div class="rounded-full">9999px (круг)</div>\n<div class="rounded-t-lg">скругление сверху</div>\n\n<!-- Divide (разделители между дочерними) -->\n<div class="divide-y divide-gray-200">\n  <div class="py-4">Первый</div>\n  <div class="py-4">Второй</div>\n  <div class="py-4">Третий</div>\n</div>' },
        { type: 'heading', value: 'Тени и ring' },
        { type: 'code', language: 'html', value: '<!-- Box shadow -->\n<div class="shadow-sm">маленькая тень</div>\n<div class="shadow">стандартная тень</div>\n<div class="shadow-md">средняя</div>\n<div class="shadow-lg">большая</div>\n<div class="shadow-xl">очень большая</div>\n<div class="shadow-none">без тени</div>\n\n<!-- Ring (как outline, но лучше) -->\n<button class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">\n  Ring при фокусе\n</button>\n\n<!-- Opacity -->\n<div class="opacity-50">50% прозрачности</div>\n<div class="opacity-0">полностью прозрачный</div>' },
        { type: 'tip', value: 'ring — это Tailwind-замена для outline. Он использует box-shadow и поддерживает цвета, offset и скругление. Идеален для focus-индикаторов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: UI-компоненты на Tailwind',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте набор UI-компонентов на Tailwind: кнопку, input, alert, badge с вариантами.',
      requirements: [
        'Кнопка: primary, secondary, danger, outline варианты',
        'Кнопки: sm, md, lg размеры',
        'Input с label, focus:ring и состоянием ошибки',
        'Alert: info (синий), success (зелёный), error (красный)',
        'Badge: цветные бейджи с rounded-full',
        'Все компоненты с transition и hover-эффектами'
      ],
      hint: 'Для каждого компонента определите base-классы, затем добавьте variant-классы. Используйте group и focus: для интерактивности.',
      expectedOutput: 'Набор стилизованных компонентов: кнопки разных цветов и размеров, поля ввода, алерты и бейджи.',
      solution: '<!-- Кнопки -->\n<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">Primary</button>\n<button class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">Secondary</button>\n<button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">Danger</button>\n<button class="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors text-sm">Outline</button>\n<button class="bg-blue-500 text-white font-medium py-1.5 px-3 rounded-md text-xs">Small</button>\n<button class="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg text-base">Large</button>\n\n<!-- Input -->\n<div>\n  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>\n  <input class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="email@example.com">\n</div>\n<div>\n  <label class="block text-sm font-medium text-red-600 mb-1">Email (ошибка)</label>\n  <input class="w-full border-2 border-red-500 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-200 outline-none bg-red-50">\n  <p class="text-red-500 text-xs mt-1">Введите корректный email</p>\n</div>\n\n<!-- Alert -->\n<div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">Информация</div>\n<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">Успешно</div>\n<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">Ошибка</div>\n\n<!-- Badge -->\n<span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">CSS</span>\n<span class="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Готово</span>\n<span class="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">Важно</span>',
      explanation: 'Каждый компонент строится из utility-классов. Кнопки различаются цветами фона и текста. Input использует focus: для стилей фокуса. Alert — цветные фоны с border. Badge — маленький текст с rounded-full. Все интерактивные элементы имеют transition.'
    }
  ]
}
