export default {
  id: 7,
  title: 'CSS: Box Model',
  description: 'Блочная модель CSS — margin, padding, border, content — основа любой вёрстки',
  lessons: [
    {
      id: 1,
      title: 'Что такое Box Model?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый HTML-элемент в CSS представлен как прямоугольный блок. Box Model описывает, как этот блок устроен: от контента до внешних отступов.' },
        { type: 'heading', value: 'Четыре слоя Box Model' },
        { type: 'list', items: [
          'Content — само содержимое (текст, изображение). Размеры задаёт width/height.',
          'Padding — внутренние отступы между контентом и рамкой',
          'Border — рамка вокруг элемента',
          'Margin — внешние отступы между элементами'
        ]},
        { type: 'code', language: 'css', value: '.box {\n  /* Контент */\n  width: 200px;\n  height: 100px;\n  \n  /* Внутренние отступы */\n  padding: 20px;\n  \n  /* Рамка */\n  border: 2px solid black;\n  \n  /* Внешние отступы */\n  margin: 10px;\n}\n\n/* Общая ширина без box-sizing: border-box */\n/* = 200 + 20*2 + 2*2 + 10*2 = 264px */' },
        { type: 'tip', value: 'Открой DevTools в браузере, выбери любой элемент и посмотри на вкладку "Computed" — ты увидишь визуализацию Box Model с точными значениями.' }
      ]
    },
    {
      id: 2,
      title: 'box-sizing: content-box vs border-box',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию width/height задают размер только контента (content-box). border-box — более удобный режим, где width включает padding и border.' },
        { type: 'code', language: 'css', value: '/* content-box: стандарт (неудобно) */\n.box-default {\n  box-sizing: content-box; /* по умолчанию */\n  width: 300px;\n  padding: 20px;\n  border: 2px solid black;\n  /* Реальная ширина: 300 + 20*2 + 2*2 = 344px */\n}\n\n/* border-box: удобный режим */\n.box-border {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid black;\n  /* Реальная ширина: ровно 300px */\n  /* Контент: 300 - 20*2 - 2*2 = 256px */\n}\n\n/* Рекомендуется задавать глобально */\n*, *::before, *::after {\n  box-sizing: border-box;\n}' },
        { type: 'tip', value: 'Всегда добавляй * { box-sizing: border-box; } в начало CSS — это делает вёрстку предсказуемой. Почти все CSS-фреймворки делают так.' }
      ]
    },
    {
      id: 3,
      title: 'Margin: внешние отступы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Margin задаёт пространство снаружи элемента, между ним и соседними элементами.' },
        { type: 'code', language: 'css', value: '/* Сокращённая запись */\n.box {\n  margin: 20px;             /* все стороны */\n  margin: 10px 20px;        /* сверху/снизу, лево/право */\n  margin: 10px 20px 15px;   /* верх, лево/право, низ */\n  margin: 10px 20px 15px 5px; /* верх, право, низ, лево */\n}\n\n/* Раздельно */\n.box {\n  margin-top: 10px;\n  margin-right: 20px;\n  margin-bottom: 10px;\n  margin-left: 20px;\n}\n\n/* Авто-центрирование по горизонтали */\n.centered {\n  width: 600px;\n  margin: 0 auto; /* верх/низ = 0, лево/право = auto */\n}\n\n/* Отрицательные margin */\n.overlap {\n  margin-top: -20px; /* перекрывает предыдущий элемент */\n}' },
        { type: 'warning', value: 'Схлопывание margin (margin collapse): вертикальные отступы двух соседних блоков не суммируются, а берётся наибольший. Это часто вызывает путаницу. Схлопывание НЕ происходит у flex/grid элементов.' }
      ]
    },
    {
      id: 4,
      title: 'Padding: внутренние отступы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Padding задаёт пространство между содержимым элемента и его рамкой. В отличие от margin, padding включается в фоновый цвет элемента.' },
        { type: 'code', language: 'css', value: '.button {\n  padding: 12px 24px; /* вертикальный, горизонтальный */\n  background: blue;\n  color: white;\n}\n/* Фон будет включать padding */\n\n.card {\n  padding: 20px;\n  background: white;\n}\n/* Текст внутри не прилипнет к краям */\n\n/* Отдельные стороны */\n.text {\n  padding-top: 10px;\n  padding-right: 15px;\n  padding-bottom: 10px;\n  padding-left: 15px;\n}\n\n/* Padding нельзя делать отрицательным (в отличие от margin) */\n/* padding: -5px; — не работает */' },
        { type: 'tip', value: 'Для кнопок используй padding вместо фиксированной высоты — так кнопка красиво масштабируется при изменении размера текста.' }
      ]
    },
    {
      id: 5,
      title: 'Border и outline',
      type: 'theory',
      content: [
        { type: 'text', value: 'Border — рамка вокруг элемента, часть Box Model. Outline — похож на border, но не занимает место в потоке.' },
        { type: 'code', language: 'css', value: '/* Полная запись border */\n.box {\n  border: 2px solid #333;\n  /* ширина | стиль | цвет */\n}\n\n/* Стили рамки */\n.box1 { border: 2px solid black; }   /* сплошная */\n.box2 { border: 2px dashed gray; }   /* пунктир */\n.box3 { border: 2px dotted blue; }   /* точки */\n.box4 { border: 2px double green; }  /* двойная */\n\n/* Отдельные стороны */\n.box {\n  border-top: 3px solid red;\n  border-right: none;\n  border-bottom: 1px dashed gray;\n  border-left: none;\n}\n\n/* Скруглённые углы */\n.rounded { border-radius: 8px; }\n.circle { border-radius: 50%; } /* круг */\n.pill { border-radius: 999px; } /* таблетка */\n\n/* Outline — не занимает место */\ninput:focus {\n  outline: 2px solid blue;\n  outline-offset: 2px; /* отступ от края элемента */\n}' },
        { type: 'warning', value: 'Никогда не делай outline: none; для полей ввода без замены! Это ломает доступность с клавиатуры. Замени outline на свой красивый, но не убирай совсем.' }
      ]
    },
    {
      id: 6,
      title: 'Единицы измерения в CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS поддерживает множество единиц измерения — абсолютные и относительные.' },
        { type: 'code', language: 'css', value: '/* Абсолютные единицы */\n.box {\n  width: 200px;   /* пиксели — чаще всего */\n  border: 2px solid black;\n}\n\n/* Относительные единицы */\n.text {\n  font-size: 1em;    /* относительно родителя */\n  padding: 1rem;     /* относительно root (html) */\n  width: 50%;        /* процент от родителя */\n}\n\n/* Единицы вьюпорта */\n.hero {\n  width: 100vw;   /* 100% ширины окна */\n  height: 100vh;  /* 100% высоты окна */\n}\n\n/* em vs rem */\nhtml { font-size: 16px; }\n\n.parent { font-size: 20px; }\n.child-em { font-size: 1.5em; }  /* 20 * 1.5 = 30px */\n.child-rem { font-size: 1.5rem; } /* 16 * 1.5 = 24px */\n\n/* Современные единицы */\n.container { max-width: min(800px, 90vw); }' },
        { type: 'tip', value: 'Используй rem для шрифтов (масштабируется с настройками браузера), px для бордеров и теней, % или fr для макетов, vw/vh для полноэкранных блоков.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Card-компонент',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай карточку товара, используя Box Model — правильные отступы, рамки и размеры.',
      requirements: [
        'Добавь * { box-sizing: border-box }',
        'Карточка .card: ширина 300px, белый фон, рамка, скруглённые углы, тень',
        'Изображение на всю ширину карточки (100%)',
        'Контент внутри карточки с padding 16px',
        'Заголовок h3 и описание p с правильными margin',
        'Кнопка .btn с padding, цветом и :hover-эффектом'
      ],
      expectedOutput: 'Карточка товара с правильной Box Model',
      hint: 'box-shadow создаёт тень: box-shadow: 0 2px 8px rgba(0,0,0,0.1). border-radius: 8px скругляет углы.',
      solution: '/* CSS */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  background: #f0f0f0;\n  padding: 40px;\n  font-family: Arial, sans-serif;\n}\n\n.card {\n  width: 300px;\n  background: white;\n  border: 1px solid #e0e0e0;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n\n.card img {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;\n  display: block;\n}\n\n.card-content {\n  padding: 16px;\n}\n\n.card h3 {\n  font-size: 18px;\n  margin-bottom: 8px;\n  color: #222;\n}\n\n.card p {\n  color: #666;\n  font-size: 14px;\n  line-height: 1.5;\n  margin-bottom: 16px;\n}\n\n.btn {\n  display: inline-block;\n  padding: 10px 20px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n  width: 100%;\n  text-align: center;\n}\n\n.btn:hover {\n  background: #0056b3;\n}',
      explanation: 'overflow: hidden на .card обрезает изображение по скруглённым углам. object-fit: cover сохраняет пропорции изображения. box-shadow создаёт реалистичную тень. Box Model определяет, как padding и border влияют на итоговый размер.'
    }
  ]
}
