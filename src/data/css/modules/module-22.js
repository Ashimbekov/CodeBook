export default {
  id: 22,
  title: 'Вёрстка компонентов',
  description: 'Card, navbar, modal, form, sidebar — вёрстка типовых UI-компонентов.',
  lessons: [
    {
      id: 1,
      title: 'Навигация (Navbar)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Навигация — центральный компонент любого сайта. Рассмотрим responsive navbar с логотипом, ссылками, кнопкой и мобильным меню.' },
        { type: 'heading', value: 'Навигация на Tailwind' },
        { type: 'code', language: 'html', value: '<nav class="bg-white border-b border-gray-200">\n  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n    <div class="flex items-center justify-between h-16">\n      \n      <!-- Лого -->\n      <a href="/" class="text-xl font-bold text-gray-900">Brand</a>\n      \n      <!-- Ссылки (десктоп) -->\n      <div class="hidden md:flex items-center gap-8">\n        <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Продукт</a>\n        <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Цены</a>\n        <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Документация</a>\n      </div>\n      \n      <!-- Кнопки (десктоп) -->\n      <div class="hidden md:flex items-center gap-3">\n        <a href="#" class="text-sm font-medium text-gray-600 hover:text-gray-900">Войти</a>\n        <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Регистрация</a>\n      </div>\n      \n      <!-- Бургер (мобильный) -->\n      <button class="md:hidden p-2 rounded-lg hover:bg-gray-100">\n        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</nav>' },
        { type: 'tip', value: 'Навигация строится на flex с justify-between для трёх зон: лого, ссылки, действия. На мобильных скрываем ссылки (hidden md:flex) и показываем бургер (md:hidden).' }
      ]
    },
    {
      id: 2,
      title: 'Карточка (Card)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Карточка — универсальный компонент для отображения контента. Рассмотрим варианты: с изображением, горизонтальная, с бейджем, интерактивная.' },
        { type: 'heading', value: 'Варианты карточек' },
        { type: 'code', language: 'html', value: '<!-- Базовая карточка -->\n<div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">\n  <img class="w-full h-48 object-cover" src="image.jpg" alt="">\n  <div class="p-5">\n    <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Категория</span>\n    <h3 class="text-lg font-semibold mt-3 mb-1">Заголовок карточки</h3>\n    <p class="text-gray-500 text-sm line-clamp-2">Описание с обрезкой до двух строк текста для превью</p>\n    <div class="flex items-center justify-between mt-4">\n      <span class="text-sm text-gray-400">5 мин чтения</span>\n      <button class="text-blue-500 hover:text-blue-700 text-sm font-medium">Читать →</button>\n    </div>\n  </div>\n</div>\n\n<!-- Горизонтальная карточка -->\n<div class="flex bg-white rounded-xl border border-gray-200 overflow-hidden">\n  <img class="w-48 object-cover flex-shrink-0" src="image.jpg" alt="">\n  <div class="p-5 flex flex-col justify-between">\n    <div>\n      <h3 class="font-semibold mb-1">Заголовок</h3>\n      <p class="text-gray-500 text-sm line-clamp-3">Описание</p>\n    </div>\n    <div class="flex items-center gap-2 mt-3">\n      <img class="w-8 h-8 rounded-full" src="avatar.jpg" alt="">\n      <span class="text-sm text-gray-600">Автор</span>\n    </div>\n  </div>\n</div>' },
        { type: 'heading', value: 'Карточка с hover-эффектом' },
        { type: 'code', language: 'html', value: '<!-- Интерактивная карточка (group) -->\n<a href="#" class="group block bg-white rounded-xl border border-gray-200 p-6\n  hover:border-blue-500 hover:shadow-lg transition-all">\n  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center\n    group-hover:bg-blue-500 transition-colors mb-4">\n    <svg class="w-6 h-6 text-blue-500 group-hover:text-white transition-colors">...</svg>\n  </div>\n  <h3 class="font-semibold mb-1 group-hover:text-blue-500 transition-colors">Функция</h3>\n  <p class="text-gray-500 text-sm">Описание функциональности</p>\n</a>' },
        { type: 'note', value: 'Для карточек-ссылок оборачивайте всю карточку в <a> с class="group block". Это делает всю карточку кликабельной с единым hover-эффектом.' }
      ]
    },
    {
      id: 3,
      title: 'Модальное окно (Modal)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модальное окно состоит из backdrop (затемнение), контейнера (центрирование) и самого окна. В CSS это fixed + flex center.' },
        { type: 'heading', value: 'Модальное окно на Tailwind' },
        { type: 'code', language: 'html', value: '<!-- Backdrop + Modal -->\n<div class="fixed inset-0 z-50 flex items-center justify-center p-4">\n  <!-- Backdrop -->\n  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>\n  \n  <!-- Modal -->\n  <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">\n    <!-- Header -->\n    <div class="flex items-center justify-between p-6 border-b border-gray-100">\n      <h2 class="text-lg font-semibold">Заголовок</h2>\n      <button class="p-1 rounded-lg hover:bg-gray-100 transition-colors">\n        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>\n        </svg>\n      </button>\n    </div>\n    \n    <!-- Body -->\n    <div class="p-6 overflow-y-auto">\n      <p class="text-gray-600">Содержимое модального окна.</p>\n    </div>\n    \n    <!-- Footer -->\n    <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-100">\n      <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Отмена</button>\n      <button class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">Подтвердить</button>\n    </div>\n  </div>\n</div>' },
        { type: 'heading', value: 'Нативный dialog' },
        { type: 'code', language: 'html', value: '<!-- HTML <dialog> — нативный модал -->\n<dialog class="rounded-2xl shadow-xl max-w-md w-full p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm">\n  <div class="p-6">\n    <h2 class="text-lg font-semibold mb-4">Нативный Dialog</h2>\n    <p class="text-gray-600 mb-6">Нативный элемент с встроенной доступностью.</p>\n    <div class="flex justify-end gap-3">\n      <button onclick="this.closest(\'dialog\').close()" class="px-4 py-2 text-sm rounded-lg hover:bg-gray-100">Закрыть</button>\n    </div>\n  </div>\n</dialog>\n\n<script>\n// Открытие: document.querySelector("dialog").showModal()\n</script>' },
        { type: 'tip', value: 'Используйте нативный <dialog> когда возможно. Он обрабатывает Escape, focus trap, ARIA-роли и backdrop автоматически. Стилизуйте через Tailwind.' }
      ]
    },
    {
      id: 4,
      title: 'Формы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Формы — один из самых частых компонентов. Рассмотрим стилизацию полей, лейблов, кнопок, чекбоксов и групп полей.' },
        { type: 'heading', value: 'Стилизованная форма' },
        { type: 'code', language: 'html', value: '<form class="max-w-md mx-auto space-y-5">\n  <!-- Text input -->\n  <div>\n    <label class="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>\n    <input type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg\n      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition\n      placeholder:text-gray-400" placeholder="Введите имя">\n  </div>\n\n  <!-- Email с ошибкой -->\n  <div>\n    <label class="block text-sm font-medium text-red-600 mb-1.5">Email</label>\n    <input type="email" class="w-full px-4 py-2.5 border-2 border-red-500 rounded-lg\n      bg-red-50 focus:ring-2 focus:ring-red-200 outline-none" value="неверный">\n    <p class="text-red-500 text-xs mt-1.5">Введите корректный email</p>\n  </div>\n\n  <!-- Select -->\n  <div>\n    <label class="block text-sm font-medium text-gray-700 mb-1.5">Роль</label>\n    <select class="w-full px-4 py-2.5 border border-gray-300 rounded-lg\n      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white">\n      <option>Разработчик</option>\n      <option>Дизайнер</option>\n    </select>\n  </div>\n\n  <!-- Checkbox -->\n  <label class="flex items-center gap-3 cursor-pointer">\n    <input type="checkbox" class="w-4 h-4 rounded border-gray-300\n      text-blue-500 focus:ring-blue-200 focus:ring-2">\n    <span class="text-sm text-gray-700">Согласен с условиями</span>\n  </label>\n\n  <!-- Submit -->\n  <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600\n    text-white font-medium py-2.5 rounded-lg transition-colors">Отправить</button>\n</form>' },
        { type: 'tip', value: 'space-y-5 на форме создаёт равные промежутки между полями без ручного margin. Это чище, чем mb-5 на каждом поле.' }
      ]
    },
    {
      id: 5,
      title: 'Sidebar',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sidebar — боковая панель с навигацией. На десктопе — фиксированная, на мобильных — выдвижная или скрытая.' },
        { type: 'heading', value: 'Sidebar на Tailwind' },
        { type: 'code', language: 'html', value: '<div class="flex min-h-screen">\n  <!-- Sidebar -->\n  <aside class="w-64 bg-gray-900 text-white flex-shrink-0 hidden lg:block">\n    <div class="p-6">\n      <h2 class="text-lg font-bold mb-6">Dashboard</h2>\n      \n      <nav class="space-y-1">\n        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg\n          bg-gray-800 text-white text-sm font-medium">\n          <svg class="w-5 h-5">...</svg>\n          Главная\n        </a>\n        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg\n          text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">\n          <svg class="w-5 h-5">...</svg>\n          Проекты\n        </a>\n        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg\n          text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">\n          <svg class="w-5 h-5">...</svg>\n          Настройки\n        </a>\n      </nav>\n      \n      <!-- Группа ссылок -->\n      <div class="mt-8">\n        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Проекты</h3>\n        <nav class="space-y-1">\n          <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white text-sm">Проект A</a>\n          <a href="#" class="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white text-sm">Проект B</a>\n        </nav>\n      </div>\n    </div>\n  </aside>\n  \n  <!-- Main content -->\n  <main class="flex-1 bg-gray-50 p-6 lg:p-8">\n    <h1 class="text-2xl font-bold mb-6">Контент</h1>\n  </main>\n</div>' },
        { type: 'note', value: 'Sidebar скрывается на мобильных через hidden lg:block. Для мобильного меню добавьте overlay-sidebar с fixed + translate-x, переключаемый через JavaScript.' }
      ]
    },
    {
      id: 6,
      title: 'Таблица данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Таблицы данных требуют особого подхода: полосатые строки, hover, адаптивность и стилизация ячеек.' },
        { type: 'heading', value: 'Стилизованная таблица' },
        { type: 'code', language: 'html', value: '<div class="overflow-x-auto rounded-xl border border-gray-200">\n  <table class="w-full text-sm">\n    <thead>\n      <tr class="bg-gray-50 border-b border-gray-200">\n        <th class="text-left py-3 px-4 font-medium text-gray-500">Имя</th>\n        <th class="text-left py-3 px-4 font-medium text-gray-500">Email</th>\n        <th class="text-left py-3 px-4 font-medium text-gray-500">Роль</th>\n        <th class="text-right py-3 px-4 font-medium text-gray-500">Действия</th>\n      </tr>\n    </thead>\n    <tbody class="divide-y divide-gray-100">\n      <tr class="hover:bg-gray-50 transition-colors">\n        <td class="py-3 px-4">\n          <div class="flex items-center gap-3">\n            <img class="w-8 h-8 rounded-full" src="avatar.jpg" alt="">\n            <span class="font-medium text-gray-900">Иван Иванов</span>\n          </div>\n        </td>\n        <td class="py-3 px-4 text-gray-500">ivan@example.com</td>\n        <td class="py-3 px-4">\n          <span class="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">Admin</span>\n        </td>\n        <td class="py-3 px-4 text-right">\n          <button class="text-blue-500 hover:text-blue-700 text-sm font-medium">Редактировать</button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>' },
        { type: 'tip', value: 'overflow-x-auto + rounded-xl на обёртке создаёт горизонтальную прокрутку на мобильных с красивыми скруглёнными углами. divide-y заменяет border-bottom на каждом tr.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Dashboard-страница',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полную страницу Dashboard: sidebar, header, карточки статистики, таблица данных.',
      requirements: [
        'Sidebar с навигацией и группами ссылок (hidden на мобильных)',
        'Header с поиском и профилем пользователя',
        'Сетка из 4 карточек статистики (grid-cols-1 sm:grid-cols-2 xl:grid-cols-4)',
        'Таблица данных с полосатыми строками и hover',
        'Модальное окно (визуальная структура)',
        'Тёмная тема через dark: стили'
      ],
      hint: 'Структура: flex min-h-screen → aside (w-64) + main (flex-1). Main: header + content. Content: stat cards + table.',
      expectedOutput: 'Полноценный dashboard с sidebar, шапкой, статистикой и таблицей — адаптивный и с поддержкой тёмной темы.',
      solution: '<div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">\n  <aside class="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white">\n    <div class="p-6">\n      <h2 class="text-lg font-bold">Dashboard</h2>\n    </div>\n    <nav class="flex-1 px-4 space-y-1">\n      <a class="flex items-center gap-3 px-3 py-2.5 bg-gray-800 rounded-lg text-sm font-medium">Главная</a>\n      <a class="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition">Аналитика</a>\n      <a class="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition">Пользователи</a>\n    </nav>\n  </aside>\n\n  <div class="flex-1 flex flex-col min-w-0">\n    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">\n      <input class="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-blue-200" placeholder="Поиск...">\n      <div class="flex items-center gap-3">\n        <img class="w-8 h-8 rounded-full" src="avatar.jpg" alt="">\n        <span class="text-sm font-medium dark:text-white">Админ</span>\n      </div>\n    </header>\n\n    <main class="flex-1 p-6">\n      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">\n        <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">\n          <p class="text-sm text-gray-500 dark:text-gray-400">Пользователи</p>\n          <p class="text-2xl font-bold mt-1 dark:text-white">12,345</p>\n          <p class="text-sm text-green-500 mt-2">+12% за месяц</p>\n        </div>\n      </div>\n\n      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">\n        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">\n          <h3 class="font-semibold dark:text-white">Последние пользователи</h3>\n        </div>\n        <table class="w-full text-sm">\n          <thead>\n            <tr class="bg-gray-50 dark:bg-gray-800/50">\n              <th class="text-left py-3 px-6 font-medium text-gray-500 dark:text-gray-400">Имя</th>\n              <th class="text-left py-3 px-6 font-medium text-gray-500 dark:text-gray-400">Email</th>\n              <th class="text-left py-3 px-6 font-medium text-gray-500 dark:text-gray-400">Статус</th>\n            </tr>\n          </thead>\n          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">\n            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">\n              <td class="py-3 px-6 font-medium dark:text-white">Иван Иванов</td>\n              <td class="py-3 px-6 text-gray-500 dark:text-gray-400">ivan@mail.com</td>\n              <td class="py-3 px-6"><span class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">Активен</span></td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </main>\n  </div>\n</div>',
      explanation: 'Layout: flex с sidebar (w-64) и flex-1 для контента. Sidebar скрыт на мобильных (hidden lg:flex). Header с поиском и профилем. Карточки статистики в адаптивном grid. Таблица с divide-y и hover. Все элементы с dark: вариантами.'
    }
  ]
}
