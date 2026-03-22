export default {
  id: 23,
  title: 'Инструменты: DevTools',
  description: 'Эффективная работа в DevTools — Elements, Console, Network, Sources для отладки',
  lessons: [
    {
      id: 1,
      title: 'DevTools: обзор панелей',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevTools — мощный набор инструментов разработчика, встроенный в Chrome, Firefox и другие браузеры. Открывается по F12 или Ctrl+Shift+I.' },
        { type: 'heading', value: 'Основные панели' },
        { type: 'list', items: [
          'Elements — просмотр и редактирование HTML/CSS в реальном времени',
          'Console — вывод логов, запуск JS, просмотр ошибок',
          'Network — все HTTP-запросы, их время и размер',
          'Sources — просмотр исходников и отладка (breakpoints)',
          'Performance — анализ производительности',
          'Memory — утечки памяти',
          'Application — LocalStorage, Cookies, Cache, Service Workers'
        ]},
        { type: 'tip', value: 'Выучи горячие клавиши DevTools: F12 открыть/закрыть, Ctrl+Shift+C — режим инспектора, Ctrl+P — быстрый поиск файла в Sources.' }
      ]
    },
    {
      id: 2,
      title: 'Панель Elements',
      type: 'theory',
      content: [
        { type: 'text', value: 'Elements позволяет исследовать и изменять HTML и CSS страницы в реальном времени.' },
        { type: 'list', items: [
          'Инспектор: кликни на элемент в браузере и он выделится в DevTools',
          'Редактирование HTML: двойной клик на элементе, или F2',
          'Панель Styles: видны все CSS-правила, применённые к элементу',
          'Зачёркнутые правила — проиграли в каскаде',
          'Computed: итоговые значения всех CSS-свойств',
          'Box Model: визуализация margin/border/padding/content',
          'Добавление CSS: кликни + в Styles для нового правила'
        ]},
        { type: 'code', language: 'javascript', value: '// Выбор элемента для DevTools через консоль\nconst el = document.querySelector(".card");\nel; // введи в Console для инспекции' },
        { type: 'tip', value: '$0 в Console всегда ссылается на последний выбранный элемент в Elements. Очень удобно для проверки свойств.' }
      ]
    },
    {
      id: 3,
      title: 'Панель Console',
      type: 'theory',
      content: [
        { type: 'text', value: 'Console — интерактивная JS-консоль. Здесь видны ошибки, можно запускать код и использовать специальные методы логирования.' },
        { type: 'code', language: 'javascript', value: '// Методы console\nconsole.log("Обычный лог");\nconsole.info("Информация");\nconsole.warn("Предупреждение — жёлтый");\nconsole.error("Ошибка — красный");\n\n// Форматирование\nconsole.log("Привет, %s! Тебе %d лет.", "Алина", 25);\nconsole.log("%cЦветной текст", "color: red; font-size: 20px");\n\n// Объекты и массивы\nconsole.log({ name: "Берик", age: 30 }); // интерактивный объект\nconsole.table([{a: 1}, {a: 2}]);          // таблица!\n\n// Группировка\nconsole.group("Пользователи");\nconsole.log("Алина");\nconsole.log("Берик");\nconsole.groupEnd();\n\n// Замер времени\nconsole.time("Загрузка");\nawait loadData();\nconsole.timeEnd("Загрузка"); // Загрузка: 234ms\n\n// Счётчик\nconsole.count("Клик"); // Клик: 1\nconsole.count("Клик"); // Клик: 2\n\n// Стек вызовов\nconsole.trace("Откуда вызвана функция");' },
        { type: 'heading', value: 'Специальные переменные в Console' },
        { type: 'list', items: [
          '$0 — последний выбранный элемент в панели Elements',
          '$_ — результат последнего вычисленного выражения',
          '$(selector) — аналог document.querySelector в Console',
          '$$(selector) — аналог document.querySelectorAll в Console',
          'copy(obj) — скопировать объект в буфер обмена',
          'clear() — очистить консоль, или Ctrl+L'
        ]},
        { type: 'tip', value: 'console.table() — одна из самых недооценённых функций. Вместо console.log(users) пиши console.table(users) и увидишь красивую таблицу с колонками. Идеально для массивов объектов.' }
      ]
    },
    {
      id: 4,
      title: 'Панель Network',
      type: 'theory',
      content: [
        { type: 'text', value: 'Network показывает все HTTP-запросы страницы: время загрузки, размеры, статусы.' },
        { type: 'list', items: [
          'Включи "Preserve log" — сохранять логи при переходе по страницам',
          'Фильтры: Fetch/XHR — только AJAX-запросы, Doc — HTML, JS, CSS, Img — картинки',
          'Waterfall — визуализация времени загрузки ресурсов',
          'Throttling — симуляция медленного интернета (Slow 3G)',
          'Disable cache — отключить кеш для тестирования'
        ]},
        { type: 'heading', value: 'Инспекция запроса' },
        { type: 'list', items: [
          'Headers — заголовки запроса и ответа',
          'Preview — форматированный ответ (JSON, HTML)',
          'Response — сырой ответ',
          'Timing — сколько времени заняли разные фазы запроса'
        ]},
        { type: 'tip', value: 'Правый клик → "Copy as fetch" — скопирует запрос в виде кода fetch(). Можно вставить в Console и повторить запрос или изменить.' }
      ]
    },
    {
      id: 5,
      title: 'Sources и отладка (Debugging)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sources позволяет ставить breakpoints и шагать по коду для поиска ошибок.' },
        { type: 'code', language: 'javascript', value: '// Программный breakpoint\nfunction buggyFunction(data) {\n  debugger; // остановится здесь в DevTools\n  const result = data.map(x => x * 2);\n  return result;\n}\n\n// Условный breakpoint\n// Правый клик на номер строки → Add conditional breakpoint\n// i === 5 — остановится только при i=5\n\n// Logpoint\n// Правый клик → Add logpoint\n// Введи выражение: "data:", data — выведет без остановки' },
        { type: 'list', items: [
          'F8 / Resume — продолжить выполнение',
          'F10 / Step over — шаг вперёд (не заходить в функцию)',
          'F11 / Step into — шаг вперёд (зайти в функцию)',
          'Shift+F11 / Step out — выйти из функции',
          'Scope — видны все доступные переменные в текущем контексте',
          'Call Stack — стек вызовов, откуда мы сюда попали'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Практика: Отладка приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй DevTools для нахождения и исправления ошибок в коде.',
      requirements: [
        'Открой DevTools и найди ошибки в Console',
        'Используй Network для проверки API-запроса',
        'Поставь breakpoint и изучи значения переменных',
        'В Elements измени CSS и посмотри результат',
        'Проверь LocalStorage через Application > Local Storage'
      ],
      expectedOutput: 'Навыки работы с DevTools на практике',
      hint: 'В Console: красное — ошибка (кликни чтобы перейти к строке). В Sources поставь breakpoint кликом на номер строки. Hover на переменную при паузе — увидишь значение.',
      solution: '// Пример кода с намеренными ошибками для отладки\n\nfunction calculateTotal(items) {\n  debugger; // Точка останова для изучения\n  \n  // Ошибка 1: items может быть undefined\n  if (!items || !Array.isArray(items)) {\n    console.error("items должен быть массивом");\n    return 0;\n  }\n  \n  const total = items.reduce((sum, item) => {\n    // Ошибка 2: item.price может отсутствовать\n    if (typeof item.price !== "number") {\n      console.warn("Некорректная цена:", item);\n      return sum;\n    }\n    return sum + item.price * (item.qty || 1);\n  }, 0);\n  \n  console.log("Итого:", total);\n  return total;\n}\n\n// Тестовые данные с ошибками\nconst testItems = [\n  { name: "Книга", price: 1500, qty: 2 },\n  { name: "Ручка", price: "двести" }, // ошибка!\n  { name: "Тетрадь", price: 200 }\n];\n\nconsole.table(testItems); // удобно смотреть данные\nconsole.time("calculate");\nconst result = calculateTotal(testItems);\nconsole.timeEnd("calculate");',
      explanation: 'DevTools — это твой главный инструмент при разработке. debugger даёт ту же функциональность что и breakpoint в интерфейсе. console.table удобен для данных. Изучение DevTools сэкономит часы на отладке.'
    }
  ]
}
