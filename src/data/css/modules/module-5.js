export default {
  id: 5,
  title: 'Flexbox: продвинутый',
  description: 'flex-grow, flex-shrink, flex-basis, order и реальные лейауты на Flexbox.',
  lessons: [
    {
      id: 1,
      title: 'flex-grow — растягивание элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'flex-grow определяет, как элемент растёт, чтобы занять свободное пространство в контейнере. По умолчанию flex-grow: 0 — элементы не растут.' },
        { type: 'heading', value: 'Как работает flex-grow' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  width: 600px;\n}\n\n/* Все элементы по 100px — осталось 300px свободного места */\n.item { width: 100px; }\n\n/* flex-grow: 0 (по умолчанию) — не растут */\n/* [100px][100px][100px]     300px свободно     */\n\n/* flex-grow: 1 у всех — делят поровну */\n.item { flex-grow: 1; }\n/* [200px][200px][200px] — каждый получил +100px */\n\n/* Разные значения flex-grow */\n.item-a { flex-grow: 1; }  /* получит 1/4 от 300px = 75px */\n.item-b { flex-grow: 2; }  /* получит 2/4 от 300px = 150px */\n.item-c { flex-grow: 1; }  /* получит 1/4 от 300px = 75px */\n/* Итого: 175px + 250px + 175px = 600px */' },
        { type: 'heading', value: 'Практический пример' },
        { type: 'code', language: 'css', value: '/* Поле поиска: иконка + инпут + кнопка */\n.search {\n  display: flex;\n  gap: 0;\n}\n\n.search-icon {\n  flex-grow: 0;  /* не растёт — фиксированный размер */\n  width: 40px;\n}\n\n.search-input {\n  flex-grow: 1;  /* занимает всё свободное место */\n}\n\n.search-btn {\n  flex-grow: 0;  /* не растёт */\n  width: 100px;\n}' },
        { type: 'tip', value: 'flex-grow: 1 на одном элементе — он займёт ВСЁ свободное пространство. Это идеально для «основного контента» рядом с фиксированным sidebar.' }
      ]
    },
    {
      id: 2,
      title: 'flex-shrink и flex-basis',
      type: 'theory',
      content: [
        { type: 'text', value: 'flex-shrink определяет, как элемент сжимается при нехватке места (по умолчанию 1). flex-basis задаёт начальный размер элемента до распределения пространства.' },
        { type: 'heading', value: 'flex-shrink — сжатие' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  width: 400px;\n}\n\n/* Три элемента по 200px = 600px, но контейнер 400px */\n/* Нехватка: 200px — распределяется через flex-shrink */\n\n.item { width: 200px; }\n\n/* flex-shrink: 1 (по умолчанию) — все сжимаются одинаково */\n/* Каждый теряет ~67px: [133px][133px][133px] */\n\n/* flex-shrink: 0 — запрет сжатия */\n.sidebar {\n  flex-shrink: 0;  /* никогда не сжимается */\n  width: 250px;\n}\n\n.content {\n  flex-shrink: 1;  /* сжимается при нехватке места */\n}' },
        { type: 'heading', value: 'flex-basis — начальный размер' },
        { type: 'code', language: 'css', value: '/* flex-basis vs width */\n.item {\n  flex-basis: 200px;  /* начальный размер по главной оси */\n  /* Если flex-direction: row — это ширина */\n  /* Если flex-direction: column — это высота */\n}\n\n/* Приоритет: flex-basis > width (для flex-элементов) */\n.item {\n  width: 100px;\n  flex-basis: 200px;  /* побеждает — элемент будет 200px */\n}\n\n/* Специальные значения */\n.item {\n  flex-basis: auto;    /* использует width/height (по умолчанию) */\n  flex-basis: 0;       /* начальный размер 0, всё через grow */\n  flex-basis: content;  /* по размеру контента */\n}' },
        { type: 'note', value: 'flex-basis: 0 + flex-grow: 1 означает, что все элементы будут точно одинаковой ширины, независимо от содержимого. С flex-basis: auto ширина зависит от контента.' }
      ]
    },
    {
      id: 3,
      title: 'Сокращение flex',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство flex — сокращение для flex-grow, flex-shrink и flex-basis. Рекомендуется всегда использовать сокращённую запись.' },
        { type: 'heading', value: 'Синтаксис flex' },
        { type: 'code', language: 'css', value: '/* flex: grow shrink basis */\n.item {\n  flex: 0 1 auto;   /* значение по умолчанию */\n  /* grow: 0 — не растёт */\n  /* shrink: 1 — сжимается */\n  /* basis: auto — размер по контенту/width */\n}\n\n/* Одно число = flex-grow (shrink=1, basis=0) */\n.item { flex: 1; }     /* flex: 1 1 0 */\n.item { flex: 2; }     /* flex: 2 1 0 */\n\n/* Два числа = grow basis */\n.item { flex: 1 300px; }  /* flex: 1 1 300px */\n\n/* Ключевые слова */\n.item { flex: auto; }     /* flex: 1 1 auto — растёт и сжимается */\n.item { flex: none; }     /* flex: 0 0 auto — фиксированный размер */\n.item { flex: initial; }  /* flex: 0 1 auto — по умолчанию */' },
        { type: 'heading', value: 'Типичные паттерны' },
        { type: 'code', language: 'css', value: '/* Sidebar + контент */\n.layout {\n  display: flex;\n}\n.sidebar {\n  flex: none;       /* фиксированная ширина */\n  width: 250px;\n}\n.content {\n  flex: 1;          /* занимает остальное */\n}\n\n/* Три равные колонки */\n.columns {\n  display: flex;\n  gap: 1rem;\n}\n.col { flex: 1; }    /* все одинаковые, basis: 0 */\n\n/* Три колонки по контенту, растущие пропорционально */\n.col { flex: auto; }  /* basis: auto, растут пропорционально контенту */' },
        { type: 'tip', value: 'Используйте flex: 1 для «занимай всё свободное место», flex: none для «фиксированный размер» и flex: auto для «расти пропорционально контенту».' }
      ]
    },
    {
      id: 4,
      title: 'order и визуальный порядок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство order позволяет менять визуальный порядок элементов без изменения HTML. По умолчанию order: 0 у всех элементов.' },
        { type: 'heading', value: 'Как работает order' },
        { type: 'code', language: 'css', value: '/* По умолчанию: order: 0 — порядок из HTML */\n\n/* Меньший order — раньше в визуальном порядке */\n.first  { order: -1; }  /* будет первым */\n.normal { order: 0; }   /* обычный порядок */\n.last   { order: 1; }   /* будет последним */\n\n/* Пример: мобильная навигация */\n/* HTML: <logo> <nav> <burger> */\n.logo   { order: 2; }  /* по центру */\n.nav    { order: 3; }  /* скрыта / справа */\n.burger { order: 1; }  /* слева */\n\n/* На десктопе вернём обычный порядок */\n@media (min-width: 768px) {\n  .logo, .nav, .burger {\n    order: 0;\n  }\n}' },
        { type: 'note', value: 'order меняет только ВИЗУАЛЬНЫЙ порядок. В DOM и для скринридеров порядок остаётся прежним. Не злоупотребляйте — это может нарушить доступность.' }
      ]
    },
    {
      id: 5,
      title: 'Реальные лейауты на Flexbox',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flexbox идеален для одномерных лейаутов: шапка, sidebar + контент, футер, карточки, формы. Рассмотрим готовые решения для типовых задач.' },
        { type: 'heading', value: 'Holy Grail Layout' },
        { type: 'code', language: 'css', value: '/* Header + (Sidebar + Main + Aside) + Footer */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.header, .footer {\n  flex: none;  /* фиксированная высота */\n}\n\n.body {\n  display: flex;\n  flex: 1;     /* занимает оставшуюся высоту */\n}\n\n.sidebar {\n  flex: none;\n  width: 200px;\n}\n\n.main {\n  flex: 1;     /* основной контент растягивается */\n}\n\n.aside {\n  flex: none;\n  width: 200px;\n}' },
        { type: 'heading', value: 'Sticky footer' },
        { type: 'code', language: 'css', value: '/* Футер всегда внизу, даже если контента мало */\n.page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n\n.main {\n  flex: 1;  /* растягивается, толкая footer вниз */\n}\n\n.footer {\n  flex: none;\n}' },
        { type: 'heading', value: 'Карточка с footer внизу' },
        { type: 'code', language: 'css', value: '/* Кнопка/цена всегда внизу карточки */\n.card {\n  display: flex;\n  flex-direction: column;\n  height: 100%;  /* или min-height */\n}\n\n.card-body {\n  flex: 1;  /* контент растягивается */\n}\n\n.card-footer {\n  flex: none;  /* footer всегда внизу */\n  margin-top: auto;  /* альтернатива: толкает вниз */\n}' },
        { type: 'heading', value: 'Медиа-объект' },
        { type: 'code', language: 'css', value: '/* Картинка + текст (комментарий, пост) */\n.media {\n  display: flex;\n  gap: 1rem;\n  align-items: flex-start;\n}\n\n.media-image {\n  flex: none;  /* фиксированный размер */\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n}\n\n.media-body {\n  flex: 1;     /* текст занимает остальное */\n  min-width: 0;  /* ВАЖНО: позволяет тексту сжиматься */\n}' },
        { type: 'tip', value: 'min-width: 0 на flex-элементе — часто забываемый но критичный момент. Без него длинный текст может выйти за пределы контейнера, потому что по умолчанию min-width: auto.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Dashboard layout',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте layout дашборда: фиксированный sidebar, шапка, основной контент со статистикой и sticky footer.',
      requirements: [
        'Sidebar фиксированной ширины (250px) слева, flex: none',
        'Правая часть: шапка + контент + footer в column',
        'Контент занимает всё свободное место (flex: 1)',
        'Sticky footer (footer всегда внизу страницы)',
        'Карточки статистики в ряд с flex-wrap и gap',
        'Каждая карточка — flex: 1 1 200px'
      ],
      hint: 'Внешний контейнер — flex row (sidebar + правая часть). Правая часть — flex column (header + main + footer) с flex: 1.',
      expectedOutput: 'Полноэкранный дашборд с sidebar слева, шапкой сверху, сеткой карточек в центре и footer внизу.',
      solution: '.dashboard {\n  display: flex;\n  min-height: 100vh;\n}\n\n.sidebar {\n  flex: none;\n  width: 250px;\n  background: #1e293b;\n  color: white;\n  padding: 1.5rem;\n}\n\n.main-area {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.header {\n  flex: none;\n  padding: 1rem 2rem;\n  background: white;\n  border-bottom: 1px solid #e5e7eb;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.content {\n  flex: 1;\n  padding: 2rem;\n  background: #f1f5f9;\n}\n\n.stats {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n  margin-bottom: 2rem;\n}\n\n.stat-card {\n  flex: 1 1 200px;\n  background: white;\n  padding: 1.5rem;\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n.footer {\n  flex: none;\n  padding: 1rem 2rem;\n  background: white;\n  border-top: 1px solid #e5e7eb;\n  text-align: center;\n  color: #6b7280;\n}',
      explanation: 'Внешний flex row разделяет sidebar и основную область. Основная область — flex column для вертикальной компоновки. flex: 1 на .content заполняет пространство между header и footer, создавая sticky footer. Карточки используют flex-wrap для адаптивности.'
    }
  ]
}
