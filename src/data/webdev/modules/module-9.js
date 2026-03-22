export default {
  id: 9,
  title: 'CSS: Grid',
  description: 'Двумерная разметка с CSS Grid — grid-template, gap, areas, auto-fit и auto-fill',
  lessons: [
    {
      id: 1,
      title: 'Введение в CSS Grid',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS Grid — это двумерная система разметки. Если Flexbox работает в одном измерении (строка или столбец), то Grid управляет и строками, и столбцами одновременно.' },
        { type: 'code', language: 'css', value: '.container {\n  display: grid;\n  \n  /* Определяем столбцы */\n  grid-template-columns: 200px 1fr 200px;\n  /* 3 столбца: 200px, гибкий, 200px */\n  \n  /* Определяем строки */\n  grid-template-rows: 80px 1fr 60px;\n  /* 3 строки: 80px, гибкая, 60px */\n  \n  /* Отступы */\n  gap: 16px;\n}' },
        { type: 'heading', value: 'Единица fr (fraction)' },
        { type: 'text', value: 'fr — это доля свободного пространства. 1fr 2fr 1fr — три колонки, средняя в два раза шире.' },
        { type: 'tip', value: 'Grid — идеален для общего макета страницы (header, sidebar, content, footer). Flexbox — для компонентов внутри. Используй оба!' }
      ]
    },
    {
      id: 2,
      title: 'grid-template-columns и repeat()',
      type: 'theory',
      content: [
        { type: 'text', value: 'repeat() — удобная функция для создания одинаковых колонок. Также полезны minmax() и auto.' },
        { type: 'code', language: 'css', value: '.container {\n  display: grid;\n  \n  /* Повторение */\n  grid-template-columns: repeat(3, 1fr);    /* 3 равных колонки */\n  grid-template-columns: repeat(4, 200px);  /* 4 по 200px */\n  grid-template-columns: repeat(12, 1fr);   /* 12-колоночная сетка */\n  \n  /* minmax(min, max) */\n  grid-template-columns: repeat(3, minmax(200px, 1fr));\n  /* каждая колонка: минимум 200px, максимум 1fr */\n  \n  /* auto — размер по содержимому */\n  grid-template-columns: auto 1fr auto;\n  /* крайние — по содержимому, средняя — остаток */\n  \n  /* Смешанные значения */\n  grid-template-columns: 250px 1fr 1fr;\n  grid-template-rows: auto 1fr auto; /* header, content, footer */\n}' }
      ]
    },
    {
      id: 3,
      title: 'Размещение элементов: grid-column и grid-row',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию элементы заполняют grid ячейку за ячейкой. Но можно явно указать, какие ячейки занять.' },
        { type: 'code', language: 'css', value: '/* Линии grid нумеруются с 1 */\n.item {\n  /* grid-column: начало / конец */\n  grid-column: 1 / 3;    /* от линии 1 до линии 3 (2 колонки) */\n  grid-column: 1 / -1;   /* от начала до конца */\n  grid-column: 2 / span 3; /* начало 2, занять 3 колонки */\n  \n  /* grid-row: начало / конец */\n  grid-row: 1 / 2;\n  grid-row: 2 / span 2;\n  \n  /* Сокращение: grid-area */\n  /* grid-area: row-start / col-start / row-end / col-end */\n  grid-area: 1 / 1 / 2 / 3;\n}\n\n/* Пример: header на всю ширину */\n.header {\n  grid-column: 1 / -1; /* от первой до последней линии */\n}' },
        { type: 'tip', value: '-1 в grid означает "последняя линия". grid-column: 1 / -1 всегда растянет элемент на всю ширину, независимо от количества колонок.' }
      ]
    },
    {
      id: 4,
      title: 'Grid Template Areas',
      type: 'theory',
      content: [
        { type: 'text', value: 'grid-template-areas позволяет именовать зоны grid и расставлять элементы по именам — очень наглядно!' },
        { type: 'code', language: 'css', value: '.page {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 80px 1fr 60px;\n  grid-template-areas:\n    "header  header"\n    "sidebar content"\n    "footer  footer";\n  min-height: 100vh;\n  gap: 16px;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.content { grid-area: content; }\n.footer  { grid-area: footer; }\n\n/* Пропуск ячейки: точка */\n.layout {\n  grid-template-areas:\n    "nav  nav  nav"\n    "side main main"\n    ".    main main";\n}' },
        { type: 'note', value: 'grid-template-areas — это как визуальная схема страницы прямо в CSS. Один из самых читаемых способов описать макет.' }
      ]
    },
    {
      id: 5,
      title: 'auto-fit и auto-fill',
      type: 'theory',
      content: [
        { type: 'text', value: 'auto-fit и auto-fill в сочетании с minmax() позволяют создавать адаптивные сетки без media queries.' },
        { type: 'code', language: 'css', value: '/* auto-fill: создаёт столько колонок, сколько влезет */\n.grid-fill {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 16px;\n}\n/* При ширине 600px: 3 колонки по ~200px */\n/* При ширине 1000px: 5 колонок */\n\n/* auto-fit: то же самое, но растягивает колонки */\n.grid-fit {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n/* Разница: если 3 элемента на широком экране */\n/* auto-fill: оставит пустые колонки */\n/* auto-fit: растянет 3 элемента на всю ширину */\n\n/* "Умная" сетка без media queries */\n.responsive-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 24px;\n}' },
        { type: 'tip', value: 'repeat(auto-fit, minmax(280px, 1fr)) — это магическая строка для адаптивной сетки. Карточки сами перестраиваются под любую ширину экрана!' }
      ]
    },
    {
      id: 6,
      title: 'Выравнивание в Grid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grid предоставляет несколько свойств для выравнивания: для всей сетки и для отдельных элементов.' },
        { type: 'code', language: 'css', value: '/* Выравнивание ЭЛЕМЕНТОВ внутри ячейки */\n.container {\n  display: grid;\n  \n  /* По горизонтали (inline axis) */\n  justify-items: start | end | center | stretch;\n  \n  /* По вертикали (block axis) */\n  align-items: start | end | center | stretch;\n  \n  /* Сокращение */\n  place-items: center; /* = align-items + justify-items */\n}\n\n/* Выравнивание СЕТКИ в контейнере */\n.container {\n  justify-content: start | end | center | space-between;\n  align-content: start | end | center | space-between;\n}\n\n/* Индивидуальное выравнивание элемента */\n.item {\n  justify-self: end;\n  align-self: center;\n  place-self: center end; /* вертикаль горизонталь */\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Макет страницы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай классический макет страницы (header, sidebar, content, footer) с помощью CSS Grid.',
      requirements: [
        'Используй grid-template-areas для описания макета',
        'Header на всю ширину, высота 70px',
        'Sidebar шириной 250px слева',
        'Main content занимает оставшееся место',
        'Footer на всю ширину, высота 60px',
        'Страница занимает всю высоту окна (min-height: 100vh)'
      ],
      expectedOutput: 'Полный макет страницы с Grid Areas',
      hint: 'Задай grid-template-areas на контейнере, потом присвой grid-area каждому дочернему элементу.',
      solution: '/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody {\n  font-family: Arial, sans-serif;\n  background: #f0f2f5;\n}\n\n.page {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 70px 1fr 60px;\n  grid-template-areas:\n    "header  header"\n    "sidebar content"\n    "footer  footer";\n  min-height: 100vh;\n  gap: 0;\n}\n\n.header {\n  grid-area: header;\n  background: #1a1a2e;\n  color: white;\n  display: flex;\n  align-items: center;\n  padding: 0 24px;\n  font-size: 20px;\n  font-weight: bold;\n}\n\n.sidebar {\n  grid-area: sidebar;\n  background: #16213e;\n  color: white;\n  padding: 24px 16px;\n}\n\n.sidebar nav ul {\n  list-style: none;\n}\n\n.sidebar nav li {\n  padding: 10px 12px;\n  border-radius: 6px;\n  margin-bottom: 4px;\n  cursor: pointer;\n}\n\n.sidebar nav li:hover { background: rgba(255,255,255,0.1); }\n\n.content {\n  grid-area: content;\n  padding: 24px;\n  overflow-y: auto;\n}\n\n.footer {\n  grid-area: footer;\n  background: #1a1a2e;\n  color: #aaa;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n}',
      explanation: 'grid-template-areas делает структуру страницы визуально понятной прямо в CSS. grid-template-columns: 250px 1fr фиксирует сайдбар и отдаёт контенту всё остальное. 1fr в grid-template-rows растягивает контент до нужной высоты.'
    },
    {
      id: 8,
      title: 'Практика: Адаптивная галерея',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай адаптивную фото-галерею с помощью auto-fit и minmax.',
      requirements: [
        'Сетка галереи с repeat(auto-fit, minmax(250px, 1fr))',
        'Элементы с одинаковым соотношением сторон (aspect-ratio: 4/3)',
        'Одна карточка занимает 2 колонки (grid-column: span 2)',
        'Hover-эффект на карточках',
        'gap между элементами'
      ],
      expectedOutput: 'Адаптивная галерея без media queries',
      hint: 'aspect-ratio: 4/3 сохраняет пропорции независимо от размера. grid-column: span 2 растягивает выделенный элемент на 2 колонки.',
      solution: '/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { padding: 20px; background: #111; }\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 12px;\n}\n\n.gallery-item {\n  aspect-ratio: 4 / 3;\n  background: #333;\n  border-radius: 8px;\n  overflow: hidden;\n  position: relative;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\n.gallery-item.wide {\n  grid-column: span 2;\n  aspect-ratio: 8 / 3;\n}\n\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n\n.gallery-item:hover {\n  transform: scale(1.02);\n  z-index: 1;\n}',
      explanation: 'repeat(auto-fit, minmax(250px, 1fr)) — ключевая строка для адаптивных сеток. Браузер сам решает, сколько колонок поместится. aspect-ratio сохраняет пропорции. span 2 позволяет отдельным элементам занимать больше места.'
    }
  ]
}
