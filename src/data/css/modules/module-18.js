export default {
  id: 18,
  title: 'Tailwind CSS: основы',
  description: 'Utility-first подход, основные классы, responsive и hover-состояния в Tailwind CSS.',
  lessons: [
    {
      id: 1,
      title: 'Введение в Tailwind CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind CSS — utility-first CSS-фреймворк. Вместо написания CSS-классов с несколькими свойствами, вы используете предготовые классы, каждый из которых делает одну вещь.' },
        { type: 'heading', value: 'Установка Tailwind CSS' },
        { type: 'code', language: 'bash', value: '# Создание проекта с Vite + Tailwind\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install\n\n# Установка Tailwind CSS v4\nnpm install tailwindcss @tailwindcss/vite\n\n# Добавить в vite.config.js:\n# import tailwindcss from \'@tailwindcss/vite\'\n# plugins: [tailwindcss()]\n\n# В главном CSS-файле:\n# @import "tailwindcss";' },
        { type: 'heading', value: 'Сравнение: обычный CSS vs Tailwind' },
        { type: 'code', language: 'html', value: '<!-- Обычный CSS -->\n<div class="card">\n  <h3 class="card-title">Заголовок</h3>\n  <p class="card-text">Текст</p>\n</div>\n\n<style>\n.card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\n.card-title { font-size: 1.25rem; font-weight: 600; }\n.card-text { color: #64748b; }\n</style>\n\n<!-- Tailwind CSS -->\n<div class="bg-white p-6 rounded-lg shadow">\n  <h3 class="text-xl font-semibold">Заголовок</h3>\n  <p class="text-slate-500">Текст</p>\n</div>\n\n<!-- Нет отдельного CSS! Все стили в HTML -->' },
        { type: 'tip', value: 'Tailwind может казаться «уродливым» из-за длинных className. Но в компонентном подходе (React, Vue) каждый компонент — отдельный файл, и читаемость не страдает.' }
      ]
    },
    {
      id: 2,
      title: 'Основные utility-классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind предоставляет тысячи готовых классов. Все следуют логичной системе именования: свойство-значение.' },
        { type: 'heading', value: 'Spacing (отступы)' },
        { type: 'code', language: 'html', value: '<!-- Padding -->\n<div class="p-4">padding: 1rem</div>\n<div class="px-4">padding-left/right: 1rem</div>\n<div class="py-2">padding-top/bottom: 0.5rem</div>\n<div class="pt-8">padding-top: 2rem</div>\n\n<!-- Margin -->\n<div class="m-4">margin: 1rem</div>\n<div class="mx-auto">margin: 0 auto (центрирование)</div>\n<div class="mt-6">margin-top: 1.5rem</div>\n<div class="-mt-4">margin-top: -1rem (отрицательный)</div>\n\n<!-- Шкала: 0 1 2 3 4 5 6 8 10 12 16 20 24 ... -->\n<!-- 1 = 0.25rem, 4 = 1rem, 8 = 2rem, 16 = 4rem -->\n\n<!-- Gap -->\n<div class="flex gap-4">gap: 1rem</div>\n<div class="flex gap-x-4 gap-y-2">column-gap и row-gap</div>' },
        { type: 'heading', value: 'Размеры и layout' },
        { type: 'code', language: 'html', value: '<!-- Width -->\n<div class="w-full">width: 100%</div>\n<div class="w-1/2">width: 50%</div>\n<div class="w-64">width: 16rem (256px)</div>\n<div class="max-w-lg">max-width: 32rem</div>\n<div class="min-w-0">min-width: 0</div>\n\n<!-- Height -->\n<div class="h-screen">height: 100vh</div>\n<div class="h-full">height: 100%</div>\n<div class="min-h-screen">min-height: 100vh</div>\n\n<!-- Display -->\n<div class="flex">display: flex</div>\n<div class="grid">display: grid</div>\n<div class="hidden">display: none</div>\n<div class="block">display: block</div>\n<div class="inline-block">display: inline-block</div>' },
        { type: 'note', value: 'Шкала spacing в Tailwind: 1 = 0.25rem (4px), 2 = 0.5rem (8px), 4 = 1rem (16px), 8 = 2rem (32px). Множитель всегда 0.25rem.' }
      ]
    },
    {
      id: 3,
      title: 'Типографика и цвета',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind имеет продуманную систему типографики и палитру из 22 цветов, каждый с 11 оттенками (50-950).' },
        { type: 'heading', value: 'Типографика' },
        { type: 'code', language: 'html', value: '<!-- Размер шрифта -->\n<p class="text-sm">14px</p>\n<p class="text-base">16px (по умолчанию)</p>\n<p class="text-lg">18px</p>\n<p class="text-xl">20px</p>\n<p class="text-2xl">24px</p>\n<p class="text-4xl">36px</p>\n\n<!-- Жирность -->\n<p class="font-normal">400</p>\n<p class="font-medium">500</p>\n<p class="font-semibold">600</p>\n<p class="font-bold">700</p>\n\n<!-- Выравнивание -->\n<p class="text-left">Слева</p>\n<p class="text-center">По центру</p>\n<p class="text-right">Справа</p>\n\n<!-- Line-height -->\n<p class="leading-tight">line-height: 1.25</p>\n<p class="leading-normal">line-height: 1.5</p>\n<p class="leading-relaxed">line-height: 1.625</p>\n\n<!-- Обрезка текста -->\n<p class="truncate">Одна строка с ...</p>\n<p class="line-clamp-3">Обрезка до 3 строк</p>' },
        { type: 'heading', value: 'Цвета' },
        { type: 'code', language: 'html', value: '<!-- Цвет текста -->\n<p class="text-blue-500">Синий текст</p>\n<p class="text-gray-600">Серый текст</p>\n<p class="text-red-500">Красный текст</p>\n\n<!-- Цвет фона -->\n<div class="bg-blue-500">Синий фон</div>\n<div class="bg-slate-100">Светлый фон</div>\n<div class="bg-white">Белый фон</div>\n\n<!-- Border -->\n<div class="border border-gray-200">Серая рамка</div>\n<div class="border-2 border-blue-500">Синяя жирная рамка</div>\n\n<!-- Прозрачность -->\n<div class="bg-black/50">background: rgba(0,0,0,0.5)</div>\n<div class="text-blue-500/80">color с 80% прозрачностью</div>\n\n<!-- Оттенки: 50 100 200 300 400 500 600 700 800 900 950 -->\n<!-- 50 — самый светлый, 950 — самый тёмный -->' },
        { type: 'tip', value: 'Для текста используйте 600-900 (тёмные оттенки). Для фона — 50-200 (светлые). Для акцентов — 500-600 (средние). Для border — 200-300.' }
      ]
    },
    {
      id: 4,
      title: 'Flexbox и Grid в Tailwind',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind делает Flexbox и Grid интуитивными через utility-классы. Все свойства доступны как классы.' },
        { type: 'heading', value: 'Flexbox' },
        { type: 'code', language: 'html', value: '<!-- Flex-контейнер -->\n<div class="flex items-center justify-between gap-4">\n  <span>Лого</span>\n  <nav class="flex gap-6">...</nav>\n  <button>Войти</button>\n</div>\n\n<!-- Flex-направление -->\n<div class="flex flex-col">Колонка</div>\n<div class="flex flex-row">Строка (по умолчанию)</div>\n\n<!-- Flex-wrap -->\n<div class="flex flex-wrap gap-4">Перенос</div>\n\n<!-- Flex-элементы -->\n<div class="flex-1">flex: 1 1 0%</div>\n<div class="flex-none">flex: none</div>\n<div class="flex-auto">flex: 1 1 auto</div>\n<div class="flex-shrink-0">flex-shrink: 0</div>\n<div class="grow">flex-grow: 1</div>' },
        { type: 'heading', value: 'Grid' },
        { type: 'code', language: 'html', value: '<!-- Grid-контейнер -->\n<div class="grid grid-cols-3 gap-4">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>\n\n<!-- Адаптивный grid -->\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n  <!-- 1 колонка → 2 → 3 -->\n</div>\n\n<!-- Span колонок -->\n<div class="col-span-2">Занимает 2 колонки</div>\n<div class="col-span-full">На всю ширину</div>\n\n<!-- Auto-fit (через arbitrary values) -->\n<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">\n  <!-- Адаптивная сетка без breakpoints -->\n</div>' },
        { type: 'tip', value: 'Для адаптивных сеток в Tailwind чаще используют grid-cols-1 md:grid-cols-2 lg:grid-cols-3 вместо auto-fit, так как breakpoints более предсказуемы.' }
      ]
    },
    {
      id: 5,
      title: 'Responsive design в Tailwind',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind использует mobile-first подход. Префиксы sm:, md:, lg:, xl:, 2xl: применяют стили от указанного breakpoint и выше.' },
        { type: 'heading', value: 'Responsive-префиксы' },
        { type: 'code', language: 'html', value: '<!-- Mobile-first: базовый = мобильный -->\n<div class="text-sm md:text-base lg:text-lg">\n  <!-- sm на мобильных, base на планшетах, lg на десктопе -->\n</div>\n\n<!-- Адаптивная навигация -->\n<nav class="flex flex-col md:flex-row md:items-center md:gap-6">\n  <!-- Вертикальная на мобильных, горизонтальная на md+ -->\n</nav>\n\n<!-- Скрытие/показ -->\n<button class="block md:hidden">Бургер (только мобильные)</button>\n<nav class="hidden md:flex gap-4">Ссылки (только десктоп)</nav>\n\n<!-- Адаптивные отступы -->\n<section class="px-4 md:px-8 lg:px-16 py-8 md:py-16">\n  Контент\n</section>' },
        { type: 'heading', value: 'Breakpoints' },
        { type: 'code', language: 'html', value: '<!-- Breakpoints (min-width):\n  sm:  640px\n  md:  768px\n  lg:  1024px\n  xl:  1280px\n  2xl: 1536px\n-->\n\n<!-- Пример: карточки -->\n<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\n  <div class="p-4 sm:p-6">Карточка</div>\n</div>\n\n<!-- Адаптивный контейнер -->\n<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">\n  Контейнер с адаптивными отступами\n</div>' },
        { type: 'note', value: 'Prefix без breakpoint = все экраны (mobile-first). sm: = от 640px. md: = от 768px. Стили без prefix — для мобильных, остальные — расширяют.' }
      ]
    },
    {
      id: 6,
      title: 'Hover, focus и другие состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tailwind позволяет стилизовать состояния через префиксы: hover:, focus:, active:, disabled:, group-hover: и другие.' },
        { type: 'heading', value: 'Состояния элементов' },
        { type: 'code', language: 'html', value: '<!-- Hover -->\n<button class="bg-blue-500 hover:bg-blue-600 transition-colors">\n  Наведите\n</button>\n\n<!-- Focus -->\n<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">\n\n<!-- Active -->\n<button class="bg-blue-500 active:scale-95 transition-transform">\n  Нажмите\n</button>\n\n<!-- Disabled -->\n<button class="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled>\n  Недоступна\n</button>\n\n<!-- First/Last child -->\n<li class="first:pt-0 last:pb-0 py-4 border-b last:border-b-0">' },
        { type: 'heading', value: 'Group и peer' },
        { type: 'code', language: 'html', value: '<!-- Group: стили потомка при hover на родителе -->\n<div class="group rounded-lg p-6 hover:bg-blue-500 transition">\n  <h3 class="text-gray-900 group-hover:text-white">Заголовок</h3>\n  <p class="text-gray-500 group-hover:text-blue-100">Текст</p>\n</div>\n\n<!-- Peer: стили соседнего элемента -->\n<input class="peer" placeholder="Email">\n<p class="hidden peer-invalid:block text-red-500 text-sm">\n  Введите корректный email\n</p>\n\n<!-- Комбинация состояний -->\n<button class="md:hover:bg-blue-600">\n  Hover только на десктопе\n</button>' },
        { type: 'tip', value: 'group-hover — незаменим для карточек: при наведении на карточку меняются стили заголовка, текста, иконки. Добавьте class="group" на родителя.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Карточки на Tailwind',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте адаптивную сетку карточек на Tailwind CSS с hover-эффектами и responsive layout.',
      requirements: [
        'Адаптивная сетка: 1 колонка → 2 → 3 через sm:/lg: префиксы',
        'Карточка: белый фон, скругление, тень, padding',
        'Изображение с aspect-ratio и object-cover',
        'Hover: подъём карточки (group-hover на translate) и усиление тени',
        'Бейдж категории с цветным фоном и скруглением',
        'Кнопка с hover и focus стилями'
      ],
      hint: 'Оберните карточку в class="group" для group-hover эффектов. Используйте transition и hover:-translate-y-1 для подъёма.',
      expectedOutput: 'Сетка карточек, адаптирующаяся от 1 до 3 колонок, с плавными hover-эффектами.',
      solution: '<div class="min-h-screen bg-slate-50 p-4 md:p-8">\n  <div class="mx-auto max-w-6xl">\n    <h1 class="text-2xl md:text-3xl font-bold mb-8">Статьи</h1>\n    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\n\n      <div class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">\n        <img class="w-full aspect-video object-cover" src="image.jpg" alt="">\n        <div class="p-5">\n          <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">CSS</span>\n          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">Заголовок статьи</h3>\n          <p class="text-gray-500 text-sm line-clamp-2 mb-4">Описание статьи с обрезкой до двух строк</p>\n          <button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors outline-none">Читать</button>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>',
      explanation: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 создаёт адаптивную сетку. group + group-hover: меняет стили потомков при наведении на карточку. transition-all и hover:-translate-y-1 создают плавный подъём. line-clamp-2 обрезает текст.'
    }
  ]
}
