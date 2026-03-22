export default {
  id: 8,
  title: 'CSS: Flexbox',
  description: 'Гибкая разметка с Flexbox — justify-content, align-items, flex-wrap и другие свойства',
  lessons: [
    {
      id: 1,
      title: 'Что такое Flexbox?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flexbox (Flexible Box Layout) — это модель CSS для создания гибких одномерных макетов. Идеален для навигации, карточек в ряд, центрирования элементов.' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;  /* включает Flexbox */\n}\n\n/* Все прямые дети становятся flex-items */\n/* flex-контейнер задаёт правила расположения */\n/* flex-элементы выстраиваются в ряд по умолчанию */' },
        { type: 'heading', value: 'Основные оси Flexbox' },
        { type: 'list', items: [
          'Главная ось (main axis) — направление flex-direction (по умолчанию горизонталь)',
          'Поперечная ось (cross axis) — перпендикулярно главной',
          'justify-content — выравнивание по ГЛАВНОЙ оси',
          'align-items — выравнивание по ПОПЕРЕЧНОЙ оси'
        ]},
        { type: 'tip', value: 'Запомни: justify-content — горизонталь (main axis), align-items — вертикаль (cross axis). Это работает при flex-direction: row (по умолчанию).' }
      ]
    },
    {
      id: 2,
      title: 'flex-direction и flex-wrap',
      type: 'theory',
      content: [
        { type: 'text', value: 'flex-direction задаёт направление главной оси. flex-wrap определяет, переносятся ли элементы на следующую строку.' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  \n  /* Направление */\n  flex-direction: row;            /* лево→право (по умолчанию) */\n  flex-direction: row-reverse;    /* право→лево */\n  flex-direction: column;         /* сверху→вниз */\n  flex-direction: column-reverse; /* снизу→вверх */\n  \n  /* Перенос */\n  flex-wrap: nowrap;   /* не переносить (по умолчанию) */\n  flex-wrap: wrap;     /* переносить при нехватке места */\n  flex-wrap: wrap-reverse;\n  \n  /* Сокращение: flex-flow = direction + wrap */\n  flex-flow: row wrap;\n}' },
        { type: 'tip', value: 'flex-direction: column превращает flex в вертикальный контейнер. Теперь justify-content управляет ВЕРТИКАЛЬНЫМ выравниванием, а align-items — ГОРИЗОНТАЛЬНЫМ. Оси меняются местами!' }
      ]
    },
    {
      id: 3,
      title: 'justify-content: выравнивание по главной оси',
      type: 'theory',
      content: [
        { type: 'text', value: 'justify-content управляет распределением элементов вдоль главной оси (по горизонтали при row).' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  \n  justify-content: flex-start;    /* начало (по умолчанию) */\n  justify-content: flex-end;      /* конец */\n  justify-content: center;        /* по центру */\n  justify-content: space-between; /* равные пробелы между */\n  justify-content: space-around;  /* равные пробелы вокруг */\n  justify-content: space-evenly;  /* строго равные пробелы */\n}' },
        { type: 'heading', value: 'Визуализация' },
        { type: 'list', items: [
          'flex-start:    [A][B][C]          ]',
          'flex-end:      [          [A][B][C]]',
          'center:        [    [A][B][C]      ]',
          'space-between: [A]     [B]     [C]',
          'space-around:  [ A ]  [ B ]  [ C ]',
          'space-evenly:  [  A  ][  B  ][  C  ]'
        ]}
      ]
    },
    {
      id: 4,
      title: 'align-items и align-content',
      type: 'theory',
      content: [
        { type: 'text', value: 'align-items управляет выравниванием элементов по поперечной оси. align-content — при многострочном flex.' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  height: 200px;\n  \n  align-items: stretch;     /* растянуть (по умолчанию) */\n  align-items: flex-start;  /* к началу поперечной оси */\n  align-items: flex-end;    /* к концу */\n  align-items: center;      /* по центру */\n  align-items: baseline;    /* по базовой линии текста */\n}\n\n/* Идеальное центрирование */\n.perfect-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* align-content — для многострочного flex */\n.multi-line {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: space-between;\n}' },
        { type: 'tip', value: 'Центрировать элемент по вертикали и горизонтали теперь просто: display: flex; justify-content: center; align-items: center; — это работает для любого содержимого!' }
      ]
    },
    {
      id: 5,
      title: 'Свойства flex-элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме свойств контейнера, у каждого flex-элемента есть свои свойства для управления размером и порядком.' },
        { type: 'code', language: 'css', value: '.item {\n  /* flex-grow: как быстро расти при свободном месте */\n  flex-grow: 0;  /* не расти (по умолчанию) */\n  flex-grow: 1;  /* занять всё свободное место */\n  \n  /* flex-shrink: как быстро сжиматься при нехватке */\n  flex-shrink: 1; /* сжиматься (по умолчанию) */\n  flex-shrink: 0; /* не сжиматься */\n  \n  /* flex-basis: базовый размер до применения grow/shrink */\n  flex-basis: auto;  /* по содержимому (по умолчанию) */\n  flex-basis: 200px;\n  flex-basis: 33%;   /* треть контейнера */\n  \n  /* Сокращение flex = grow shrink basis */\n  flex: 0 1 auto;  /* по умолчанию */\n  flex: 1;         /* = 1 1 0 — занять всё место */\n  flex: auto;      /* = 1 1 auto */\n  flex: none;      /* = 0 0 auto — не гибкий */\n  \n  /* Порядок */\n  order: 0;   /* по умолчанию */\n  order: -1;  /* переместить в начало */\n  order: 2;   /* переместить в конец */\n  \n  /* Индивидуальное выравнивание */\n  align-self: center;  /* перебить align-items */\n}' }
      ]
    },
    {
      id: 6,
      title: 'Gap в Flexbox',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство gap позволяет задавать отступы между flex-элементами без использования margin.' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  flex-wrap: wrap;\n  \n  gap: 16px;            /* одинаковые отступы */\n  gap: 16px 24px;       /* строки | колонки */\n  row-gap: 16px;        /* только между строками */\n  column-gap: 24px;     /* только между колонками */\n}\n\n/* Пример: навигация с gap */\n.navbar {\n  display: flex;\n  align-items: center;\n  gap: 24px;\n}\n\n/* Пример: карточки */\n.cards {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n}\n\n.card {\n  flex: 1 1 280px; /* минимум 280px, потом растягивается */\n}' },
        { type: 'tip', value: 'gap — это более удобная альтернатива margin между flex-элементами. Он не добавляет отступ по краям контейнера (в отличие от margin).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Навигационное меню',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай горизонтальную навигацию с лого слева и ссылками справа, используя Flexbox.',
      requirements: [
        'Контейнер nav с display: flex',
        'Логотип слева, меню справа (используй margin: auto или justify-content)',
        'Ссылки в ряд с gap между ними',
        'Вертикальное выравнивание по центру (align-items)',
        'Hover-эффект для ссылок',
        'Мобильная версия: flex-direction: column при ширине < 600px'
      ],
      expectedOutput: 'Горизонтальное навбар-меню с Flexbox',
      hint: 'Для разделения лого и меню используй margin-left: auto на элементе меню. Это "съедает" всё свободное место слева от меню.',
      solution: '/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nnav {\n  display: flex;\n  align-items: center;\n  padding: 0 24px;\n  height: 64px;\n  background: #1a1a2e;\n}\n\n.logo {\n  font-size: 22px;\n  font-weight: bold;\n  color: white;\n  text-decoration: none;\n}\n\n.nav-links {\n  display: flex;\n  list-style: none;\n  gap: 24px;\n  margin-left: auto;\n}\n\n.nav-links a {\n  color: #ccc;\n  text-decoration: none;\n  font-size: 15px;\n  transition: color 0.2s;\n}\n\n.nav-links a:hover {\n  color: white;\n}\n\n@media (max-width: 600px) {\n  nav {\n    flex-direction: column;\n    height: auto;\n    padding: 16px;\n    gap: 16px;\n  }\n  .nav-links {\n    margin-left: 0;\n    flex-wrap: wrap;\n    justify-content: center;\n  }\n}',
      explanation: 'margin-left: auto на .nav-links "съедает" всё свободное пространство между лого и ссылками. gap создаёт ровные отступы между ссылками. align-items: center вертикально центрирует всё внутри nav.'
    },
    {
      id: 8,
      title: 'Практика: Сетка карточек',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай адаптивную сетку карточек с помощью Flexbox.',
      requirements: [
        'Контейнер с display: flex, flex-wrap: wrap, gap',
        'Карточки с flex: 1 1 280px — минимум 280px, потом растягиваются',
        'На широком экране — 3 карточки в ряд',
        'На планшете — 2 карточки',
        'На мобильном — 1 карточка',
        'Одинаковая высота карточек внутри строки'
      ],
      expectedOutput: 'Адаптивная сетка карточек на Flexbox',
      hint: 'flex: 1 1 280px означает: может расти (1), может сжиматься (1), базовая ширина 280px. flex-wrap: wrap перенесёт карточки на следующую строку когда не хватает места.',
      solution: '/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }\n\n.cards-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 20px;\n}\n\n.card {\n  flex: 1 1 280px;\n  background: white;\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  display: flex;\n  flex-direction: column;\n}\n\n.card-image {\n  width: 100%;\n  height: 180px;\n  background: #dde;\n  object-fit: cover;\n}\n\n.card-body {\n  padding: 16px;\n  flex: 1; /* занимает всё оставшееся место */\n  display: flex;\n  flex-direction: column;\n}\n\n.card-body h3 { margin-bottom: 8px; }\n.card-body p { color: #666; flex: 1; }\n\n.card-btn {\n  margin-top: 16px;\n  padding: 10px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  text-align: center;\n}',
      explanation: 'flex: 1 1 280px делает карточки автоматически адаптивными без media queries. display: flex; flex-direction: column на .card позволяет прижать кнопку к низу с помощью flex: 1 на описании.'
    }
  ]
}
