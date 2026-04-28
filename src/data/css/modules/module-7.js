export default {
  id: 7,
  title: 'CSS Grid: продвинутый',
  description: 'auto-fit/auto-fill, minmax(), subgrid, named lines и продвинутые паттерны Grid.',
  lessons: [
    {
      id: 1,
      title: 'auto-fit и auto-fill',
      type: 'theory',
      content: [
        { type: 'text', value: 'auto-fit и auto-fill автоматически определяют количество колонок, основываясь на доступном пространстве. Это ключ к адаптивным сеткам без media queries.' },
        { type: 'heading', value: 'auto-fill — заполняет треками' },
        { type: 'code', language: 'css', value: '/* auto-fill создаёт столько колонок, сколько поместится */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, 200px);\n  gap: 1rem;\n}\n/* Контейнер 900px → 4 колонки по 200px + 3 gap\n   Контейнер 500px → 2 колонки по 200px + 1 gap\n   Оставшееся место — пустое */' },
        { type: 'heading', value: 'auto-fit — схлопывает пустые треки' },
        { type: 'code', language: 'css', value: '/* auto-fit то же самое, но пустые колонки схлопываются */\n.grid {\n  grid-template-columns: repeat(auto-fit, 200px);\n}\n/* Если элементов 2, а место есть на 4 колонки:\n   auto-fill: [item][item][    ][    ]  — 4 колонки, 2 пустые\n   auto-fit:  [item][item]              — 2 колонки, пустые схлопнулись */\n\n/* Разница видна с minmax! */\n.grid-fill {\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  /* Элементы НЕ растягиваются на пустые колонки */\n}\n\n.grid-fit {\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  /* Элементы РАСТЯГИВАЮТСЯ, заполняя всё пространство */\n}' },
        { type: 'tip', value: 'В 95% случаев вам нужен auto-fit с minmax(). auto-fill нужен только когда вы хотите сохранить пустые колонки (например, для позиционирования).' }
      ]
    },
    {
      id: 2,
      title: 'minmax() и адаптивные сетки',
      type: 'theory',
      content: [
        { type: 'text', value: 'minmax(min, max) задаёт трек с минимальным и максимальным размером. В комбинации с auto-fit/auto-fill создаёт идеально адаптивные сетки.' },
        { type: 'heading', value: 'Магическая формула адаптивной сетки' },
        { type: 'code', language: 'css', value: '/* Адаптивная сетка БЕЗ media queries */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.5rem;\n}\n\n/*\n  minmax(250px, 1fr):\n  - Минимум: 250px — колонка не уже этого\n  - Максимум: 1fr — растягивается равномерно\n\n  auto-fit:\n  - Столько колонок, сколько влезет с учётом минимума\n  - Пустые колонки схлопываются\n\n  Результат:\n  1920px → 6 колонок\n  1200px → 4 колонки\n  768px  → 2 колонки\n  375px  → 1 колонка\n*/' },
        { type: 'heading', value: 'Варианты minmax()' },
        { type: 'code', language: 'css', value: '/* Фиксированный минимум, гибкий максимум */\n.grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }\n\n/* Минимум по контенту */\n.grid { grid-template-columns: repeat(3, minmax(min-content, 1fr)); }\n\n/* Максимум по контенту */\n.grid { grid-template-columns: repeat(3, minmax(100px, max-content)); }\n\n/* Sidebar с ограничением */\n.layout {\n  grid-template-columns: minmax(200px, 300px) 1fr;\n  /* Sidebar: от 200px до 300px */\n}' },
        { type: 'note', value: 'minmax() с auto-fit/auto-fill не работает, если минимум указан в fr. Используйте px, rem, %, min-content, max-content.' }
      ]
    },
    {
      id: 3,
      title: 'Именованные линии',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вместо номеров линий можно использовать имена. Это делает код более читаемым, особенно в сложных лейаутах.' },
        { type: 'heading', value: 'Определение именованных линий' },
        { type: 'code', language: 'css', value: '.grid {\n  display: grid;\n  grid-template-columns:\n    [sidebar-start] 250px\n    [sidebar-end content-start] 1fr\n    [content-end aside-start] 250px\n    [aside-end];\n  grid-template-rows:\n    [header-start] 64px\n    [header-end main-start] 1fr\n    [main-end footer-start] 48px\n    [footer-end];\n}\n\n/* Использование имён вместо номеров */\n.header {\n  grid-column: sidebar-start / aside-end;  /* на всю ширину */\n  grid-row: header-start / header-end;\n}\n\n.sidebar {\n  grid-column: sidebar-start / sidebar-end;\n  grid-row: main-start / main-end;\n}' },
        { type: 'heading', value: 'Автоименование через areas' },
        { type: 'code', language: 'css', value: '/* grid-template-areas автоматически создаёт линии */\n.grid {\n  grid-template-areas:\n    "header header"\n    "sidebar main";\n}\n\n/* Автоматически создаются линии:\n   header-start, header-end\n   sidebar-start, sidebar-end\n   main-start, main-end */\n\n.element {\n  grid-column: sidebar-start / main-end;  /* на 2 колонки */\n}' },
        { type: 'tip', value: 'Именованные линии особенно полезны в дизайн-системах, где layout переиспользуется. Они делают код самодокументируемым.' }
      ]
    },
    {
      id: 4,
      title: 'Неявные треки и auto-placement',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда элементов больше, чем ячеек в явной сетке, Grid автоматически создаёт дополнительные строки (или колонки). Это неявные треки.' },
        { type: 'heading', value: 'grid-auto-rows и grid-auto-columns' },
        { type: 'code', language: 'css', value: '/* Явная сетка: 3 колонки, строки не определены */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  /* Строки создадутся автоматически */\n  grid-auto-rows: 200px;  /* все авто-строки будут 200px */\n}\n\n/* minmax для автоматических строк */\n.grid {\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: minmax(100px, auto);\n  /* Минимум 100px, но растёт по контенту */\n}\n\n/* Автоматические колонки */\n.horizontal-grid {\n  grid-auto-flow: column;        /* элементы идут по колонкам */\n  grid-auto-columns: 200px;      /* ширина автоколонок */\n  grid-template-rows: repeat(3, 1fr);  /* 3 явные строки */\n}' },
        { type: 'heading', value: 'grid-auto-flow — направление размещения' },
        { type: 'code', language: 'css', value: '/* row (по умолчанию) — заполнение по строкам */\n.grid {\n  grid-auto-flow: row;\n  /* [1][2][3]\n     [4][5][6] */\n}\n\n/* column — заполнение по колонкам */\n.grid {\n  grid-auto-flow: column;\n  /* [1][3][5]\n     [2][4][6] */\n}\n\n/* dense — заполняет пропуски */\n.grid {\n  grid-auto-flow: row dense;\n  /* Если элемент не помещается, Grid ищет место для \n     следующего элемента, заполняя дыры */\n}' },
        { type: 'note', value: 'grid-auto-flow: dense может менять визуальный порядок элементов, что плохо для доступности. Используйте его только для галерей и декоративных сеток.' }
      ]
    },
    {
      id: 5,
      title: 'Subgrid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Subgrid позволяет дочерним grid-контейнерам наследовать треки родительского grid. Это решает проблему выравнивания вложенных сеток.' },
        { type: 'heading', value: 'Проблема без subgrid' },
        { type: 'code', language: 'css', value: '/* Без subgrid — заголовки карточек не выровнены */\n.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n\n.card {\n  /* Каждая карточка — отдельная сетка */\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  /* Строки РАЗНЫХ карточек НЕ синхронизированы */\n  /* Если заголовок длинный — высоты строк будут разные */\n}' },
        { type: 'heading', value: 'Решение с subgrid' },
        { type: 'code', language: 'css', value: '.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  /* Каждая карточка займёт 3 строки в родительском grid */\n  grid-auto-rows: auto;  /* или определите явно */\n  gap: 1rem;\n}\n\n.card {\n  display: grid;\n  grid-row: span 3;            /* карточка занимает 3 строки */\n  grid-template-rows: subgrid; /* наследует строки родителя */\n  gap: 0.5rem;\n}\n\n/* Теперь заголовки всех карточек выровнены!\n   [Title A ]  [Title B - longer title]  [Title C  ]\n   [Body... ]  [Body...               ]  [Body...  ]\n   [Button  ]  [Button                ]  [Button   ]\n*/' },
        { type: 'heading', value: 'Subgrid для колонок' },
        { type: 'code', language: 'css', value: '/* Subgrid работает и для колонок */\n.parent {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n}\n\n.child {\n  grid-column: span 4;\n  display: grid;\n  grid-template-columns: subgrid;  /* наследует 4 колонки */\n}\n\n/* Можно subgrid по обеим осям */\n.nested {\n  grid-column: span 3;\n  grid-row: span 2;\n  display: grid;\n  grid-template-columns: subgrid;\n  grid-template-rows: subgrid;\n}' },
        { type: 'tip', value: 'Subgrid поддерживается всеми современными браузерами (Chrome 117+, Firefox 71+, Safari 16+). Это мощнейший инструмент для синхронизации вложенных сеток.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Адаптивная галерея',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте адаптивную галерею изображений с auto-fit, minmax и элементами разных размеров.',
      requirements: [
        'Базовая сетка: repeat(auto-fit, minmax(200px, 1fr)) — без media queries',
        'Некоторые элементы занимают 2 колонки (grid-column: span 2)',
        'Некоторые элементы занимают 2 строки (grid-row: span 2)',
        'grid-auto-flow: dense для заполнения пропусков',
        'grid-auto-rows: 200px для фиксированной высоты строк',
        'Изображения заполняют ячейки через object-fit: cover'
      ],
      hint: 'Используйте repeat(auto-fit, minmax(200px, 1fr)) для основной сетки. Добавьте классы .wide (span 2 columns) и .tall (span 2 rows).',
      expectedOutput: 'Адаптивная галерея с карточками разных размеров, автоматически заполняющая пропуски и подстраивающаяся под ширину экрана.',
      solution: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  grid-auto-rows: 200px;\n  grid-auto-flow: dense;\n  gap: 0.5rem;\n  padding: 1rem;\n}\n\n.gallery-item {\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n\n.gallery-item:hover img {\n  transform: scale(1.05);\n}\n\n.gallery-item.wide {\n  grid-column: span 2;\n}\n\n.gallery-item.tall {\n  grid-row: span 2;\n}\n\n.gallery-item.featured {\n  grid-column: span 2;\n  grid-row: span 2;\n}',
      explanation: 'auto-fit + minmax обеспечивают адаптивность без media queries. dense заполняет пропуски, когда wide/tall элементы оставляют дыры. object-fit: cover обрезает изображения без искажения.'
    }
  ]
}
