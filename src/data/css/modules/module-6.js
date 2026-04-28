export default {
  id: 6,
  title: 'CSS Grid: основы',
  description: 'Grid-контейнер, grid-template, columns, rows, gap и areas — двумерная система компоновки.',
  lessons: [
    {
      id: 1,
      title: 'Введение в CSS Grid',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS Grid — двумерная система компоновки. В отличие от Flexbox (одна ось), Grid работает одновременно с колонками и строками. Идеален для лейаутов страниц и сложных сеток.' },
        { type: 'heading', value: 'Создание Grid-контейнера' },
        { type: 'code', language: 'css', value: '.grid {\n  display: grid;         /* блочный grid-контейнер */\n  /* display: inline-grid; — строчный grid-контейнер */\n}\n\n/* Flex vs Grid:\n   Flex — одномерный: строка ИЛИ колонка\n   Grid — двумерный: строки И колонки одновременно\n\n   Flex — контент определяет layout\n   Grid — layout определяет размещение контента\n*/' },
        { type: 'heading', value: 'grid-template-columns и grid-template-rows' },
        { type: 'code', language: 'css', value: '/* Явное определение колонок и строк */\n.grid {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;  /* 3 колонки */\n  grid-template-rows: 80px 1fr 60px;       /* 3 строки */\n}\n\n/* fr — доля свободного пространства (fraction) */\n.grid {\n  grid-template-columns: 1fr 2fr 1fr;\n  /* 1-я: 25%, 2-я: 50%, 3-я: 25% */\n}\n\n/* Смешивание единиц */\n.grid {\n  grid-template-columns: 250px 1fr;  /* sidebar + контент */\n  grid-template-rows: auto 1fr auto; /* header + main + footer */\n}' },
        { type: 'tip', value: 'fr — уникальная единица Grid. 1fr означает «одна доля оставшегося пространства». Если у вас 1fr 2fr, первая колонка получит 1/3, вторая — 2/3 свободного места.' }
      ]
    },
    {
      id: 2,
      title: 'repeat(), gap и единица fr',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция repeat() упрощает создание повторяющихся колонок. gap задаёт промежутки между ячейками Grid.' },
        { type: 'heading', value: 'repeat() — повторение треков' },
        { type: 'code', language: 'css', value: '/* Вместо длинной записи */\n.grid {\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n}\n\n/* Используем repeat() */\n.grid {\n  grid-template-columns: repeat(4, 1fr);  /* 4 равные колонки */\n}\n\n/* repeat() с паттерном */\n.grid {\n  grid-template-columns: repeat(3, 100px 1fr);\n  /* = 100px 1fr 100px 1fr 100px 1fr — 6 колонок */\n}\n\n/* Комбинирование с фиксированными */\n.grid {\n  grid-template-columns: 200px repeat(3, 1fr) 200px;\n  /* sidebar + 3 равные колонки + sidebar */\n}' },
        { type: 'heading', value: 'gap — промежутки' },
        { type: 'code', language: 'css', value: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  \n  gap: 1rem;             /* row-gap + column-gap */\n  gap: 1rem 2rem;        /* row-gap column-gap */\n  row-gap: 1rem;         /* только между строками */\n  column-gap: 2rem;      /* только между колонками */\n}\n\n/* gap работает одинаково для Grid и Flex */\n/* Преимущество: не добавляет отступы по краям контейнера */' },
        { type: 'heading', value: 'Пример: Галерея изображений' },
        { type: 'code', language: 'css', value: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.5rem;\n}\n\n.gallery img {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;  /* обрезка без искажения */\n  border-radius: 8px;\n}' },
        { type: 'tip', value: 'fr учитывает gap автоматически. Если у вас repeat(3, 1fr) и gap: 1rem, каждая колонка будет ровно (100% - 2rem) / 3 — не нужно ничего вычитать.' }
      ]
    },
    {
      id: 3,
      title: 'Размещение элементов в Grid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Элементы можно размещать в конкретных ячейках через grid-column и grid-row, указывая начальную и конечную линию.' },
        { type: 'heading', value: 'Линии Grid' },
        { type: 'code', language: 'css', value: '/*\n  Линии нумеруются с 1:\n  \n  1     2     3     4     <- линии колонок\n  │     │     │     │\n  ├─────┼─────┼─────┤  1  <- линия строки\n  │  1  │  2  │  3  │\n  ├─────┼─────┼─────┤  2\n  │  4  │  5  │  6  │\n  ├─────┼─────┼─────┤  3\n*/\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 200px);\n}' },
        { type: 'heading', value: 'grid-column и grid-row' },
        { type: 'code', language: 'css', value: '/* Элемент занимает 2 колонки */\n.wide {\n  grid-column: 1 / 3;     /* от линии 1 до линии 3 */\n  /* или: */\n  grid-column: 1 / span 2; /* от линии 1, 2 колонки */\n  /* или: */\n  grid-column: span 2;     /* 2 колонки от текущей позиции */\n}\n\n/* Элемент на всю ширину */\n.full-width {\n  grid-column: 1 / -1;    /* от первой до последней линии */\n}\n\n/* Элемент в конкретной ячейке */\n.placed {\n  grid-column: 2 / 3;     /* 2-я колонка */\n  grid-row: 1 / 2;        /* 1-я строка */\n}\n\n/* Занимает область 2×2 */\n.big {\n  grid-column: 1 / 3;     /* 2 колонки */\n  grid-row: 1 / 3;        /* 2 строки */\n}' },
        { type: 'note', value: 'grid-column: 1 / -1 — элемент на всю ширину. -1 означает последнюю линию. Это работает только для явно определённых треков (grid-template-columns).' }
      ]
    },
    {
      id: 4,
      title: 'grid-template-areas',
      type: 'theory',
      content: [
        { type: 'text', value: 'grid-template-areas — самый наглядный способ описать layout. Вы буквально рисуете сетку текстом, давая имена областям.' },
        { type: 'heading', value: 'Именованные области' },
        { type: 'code', language: 'css', value: '.page {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 64px 1fr 48px;\n  grid-template-areas:\n    "header  header"\n    "sidebar main"\n    "footer  footer";\n  min-height: 100vh;\n}\n\n/* Каждый элемент привязывается к области */\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }' },
        { type: 'heading', value: 'Пустые ячейки и адаптивность' },
        { type: 'code', language: 'css', value: '/* Точка (.) — пустая ячейка */\n.grid {\n  grid-template-areas:\n    "header header  header"\n    "nav    content aside"\n    ".      footer  .";\n  /* Нижний ряд: пусто | footer | пусто */\n}\n\n/* Адаптивный layout */\n.page {\n  display: grid;\n  grid-template-areas:\n    "header"\n    "main"\n    "sidebar"\n    "footer";\n}\n\n@media (min-width: 768px) {\n  .page {\n    grid-template-columns: 250px 1fr;\n    grid-template-areas:\n      "header  header"\n      "sidebar main"\n      "footer  footer";\n  }\n}' },
        { type: 'tip', value: 'grid-template-areas — лучший способ визуализировать layout прямо в коде. Но он работает только для прямоугольных областей (нельзя сделать L-образную область).' }
      ]
    },
    {
      id: 5,
      title: 'Выравнивание в Grid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grid предоставляет полный набор свойств выравнивания: justify для горизонтали, align для вертикали. Они работают на уровне контейнера и отдельных элементов.' },
        { type: 'heading', value: 'Выравнивание элементов внутри ячеек' },
        { type: 'code', language: 'css', value: '/* На контейнере — для всех элементов */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 200px);\n  \n  justify-items: center;   /* горизонтально внутри ячейки */\n  align-items: center;     /* вертикально внутри ячейки */\n  /* Сокращение: */\n  place-items: center;     /* align-items justify-items */\n}\n\n/* На элементе — индивидуально */\n.item {\n  justify-self: end;       /* этот элемент справа в ячейке */\n  align-self: start;       /* этот элемент вверху ячейки */\n  /* Сокращение: */\n  place-self: start end;   /* align-self justify-self */\n}' },
        { type: 'heading', value: 'Выравнивание сетки в контейнере' },
        { type: 'code', language: 'css', value: '/* Когда сетка меньше контейнера */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 200px);\n  /* Сетка: 600px, контейнер может быть шире */\n  \n  justify-content: center;     /* сетка по центру горизонтально */\n  align-content: center;       /* сетка по центру вертикально */\n  /* Сокращение: */\n  place-content: center;       /* align-content justify-content */\n  \n  /* Другие значения: */\n  justify-content: space-between;  /* колонки с промежутками */\n  justify-content: space-evenly;   /* равные промежутки */\n}' },
        { type: 'list', value: [
          'justify-items / justify-self — горизонтальное выравнивание ВНУТРИ ячейки',
          'align-items / align-self — вертикальное выравнивание ВНУТРИ ячейки',
          'justify-content — горизонтальное распределение ВСЕЙ СЕТКИ',
          'align-content — вертикальное распределение ВСЕЙ СЕТКИ',
          'place-items — сокращение для align-items + justify-items',
          'place-content — сокращение для align-content + justify-content'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Практика: Лейаут блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте layout блога с header, sidebar, основным контентом, aside и footer, используя grid-template-areas.',
      requirements: [
        'Используйте grid-template-areas для визуального описания layout',
        'Header на всю ширину сверху',
        'Sidebar слева (200px), контент по центру (1fr), aside справа (200px)',
        'Footer на всю ширину снизу',
        'На мобильных — одноколоночный layout через media query',
        'gap между всеми ячейками'
      ],
      hint: 'Используйте grid-template-areas с тремя строками: header, sidebar+main+aside, footer. Для мобильных переключите на одну колонку.',
      expectedOutput: 'Трёхколоночный layout блога с шапкой и футером на полную ширину, адаптивный для мобильных устройств.',
      solution: '.blog {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n  grid-template-rows: auto 1fr auto;\n  grid-template-areas:\n    "header  header  header"\n    "sidebar content aside"\n    "footer  footer  footer";\n  gap: 1rem;\n  min-height: 100vh;\n  padding: 1rem;\n}\n\n.blog-header  { grid-area: header; background: #1e293b; color: white; padding: 1rem 2rem; border-radius: 8px; }\n.blog-sidebar { grid-area: sidebar; background: #f8fafc; padding: 1rem; border-radius: 8px; }\n.blog-content { grid-area: content; padding: 1rem; }\n.blog-aside   { grid-area: aside; background: #f8fafc; padding: 1rem; border-radius: 8px; }\n.blog-footer  { grid-area: footer; background: #1e293b; color: white; padding: 1rem 2rem; border-radius: 8px; text-align: center; }\n\n@media (max-width: 768px) {\n  .blog {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      "header"\n      "content"\n      "sidebar"\n      "aside"\n      "footer";\n  }\n}',
      explanation: 'grid-template-areas наглядно описывает layout: header и footer занимают все 3 колонки (повторение имени). На мобильных переключаем на одну колонку, меняя порядок — контент идёт перед sidebar для удобства.'
    }
  ]
}
