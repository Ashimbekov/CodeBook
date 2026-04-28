export default {
  id: 4,
  title: 'Flexbox: основы',
  description: 'Flex-контейнер, flex-элементы, направление, перенос, выравнивание — базовые концепции Flexbox.',
  lessons: [
    {
      id: 1,
      title: 'Основные концепции Flexbox',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flexbox — одномерная система компоновки. Она работает вдоль одной оси (главной или поперечной). Flex-контейнер управляет расположением дочерних flex-элементов.' },
        { type: 'heading', value: 'Flex-контейнер и оси' },
        { type: 'code', language: 'css', value: '/* Создание flex-контейнера */\n.container {\n  display: flex;         /* блочный flex-контейнер */\n  /* display: inline-flex; — строчный flex-контейнер */\n}\n\n/*\n  Главная ось (main axis):  →→→→→→→→→→\n  ┌──────────────────────────────────────┐\n  │  [item 1]  [item 2]  [item 3]       │\n  └──────────────────────────────────────┘\n  Поперечная ось (cross axis):  ↓\n\n  По умолчанию:\n  - Главная ось: слева направо (row)\n  - Поперечная: сверху вниз\n*/' },
        { type: 'heading', value: 'flex-direction — направление главной оси' },
        { type: 'code', language: 'css', value: '.row         { flex-direction: row; }           /* → по умолчанию */\n.row-reverse { flex-direction: row-reverse; }    /* ← справа налево */\n.col         { flex-direction: column; }          /* ↓ сверху вниз */\n.col-reverse { flex-direction: column-reverse; }  /* ↑ снизу вверх */' },
        { type: 'note', value: 'При flex-direction: column главная ось становится вертикальной. Это значит, что justify-content будет работать по вертикали, а align-items — по горизонтали.' }
      ]
    },
    {
      id: 2,
      title: 'justify-content — выравнивание по главной оси',
      type: 'theory',
      content: [
        { type: 'text', value: 'justify-content управляет распределением свободного пространства вдоль главной оси (по умолчанию — горизонтально).' },
        { type: 'heading', value: 'Значения justify-content' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n}\n\n/* flex-start (по умолчанию) — элементы в начале */\n.start { justify-content: flex-start; }\n/* [A][B][C]                     */\n\n/* flex-end — элементы в конце */\n.end { justify-content: flex-end; }\n/*                     [A][B][C] */\n\n/* center — элементы по центру */\n.center { justify-content: center; }\n/*          [A][B][C]            */\n\n/* space-between — равные промежутки между элементами */\n.between { justify-content: space-between; }\n/* [A]        [B]        [C] */\n\n/* space-around — равные промежутки вокруг элементов */\n.around { justify-content: space-around; }\n/*   [A]     [B]     [C]   */\n\n/* space-evenly — абсолютно равные промежутки */\n.evenly { justify-content: space-evenly; }\n/*    [A]    [B]    [C]    */' },
        { type: 'heading', value: 'Типичные применения' },
        { type: 'code', language: 'css', value: '/* Навигация: лого слева, ссылки справа */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 2rem;\n}\n\n/* Кнопки формы справа */\n.form-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}' },
        { type: 'tip', value: 'space-between идеален для навигации (лого + меню). space-evenly — для равномерных сеток иконок. center — для центрирования.' }
      ]
    },
    {
      id: 3,
      title: 'align-items — выравнивание по поперечной оси',
      type: 'theory',
      content: [
        { type: 'text', value: 'align-items управляет расположением элементов вдоль поперечной оси (по умолчанию — вертикально). Это свойство контейнера, которое действует на ВСЕ дочерние элементы.' },
        { type: 'heading', value: 'Значения align-items' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  height: 200px;  /* Нужна высота, чтобы увидеть эффект */\n}\n\n/* stretch (по умолчанию) — растягивает на всю высоту */\n.stretch { align-items: stretch; }\n/* ┌──────────┐┌──────────┐\n   │  item A  ││  item B  │  <- оба на всю высоту\n   └──────────┘└──────────┘ */\n\n/* flex-start — элементы вверху */\n.start { align-items: flex-start; }\n\n/* flex-end — элементы внизу */\n.end { align-items: flex-end; }\n\n/* center — элементы по центру вертикально */\n.center { align-items: center; }\n\n/* baseline — выравнивание по базовой линии текста */\n.base { align-items: baseline; }' },
        { type: 'heading', value: 'Идеальное центрирование' },
        { type: 'code', language: 'css', value: '/* Центрирование по обеим осям */\n.perfect-center {\n  display: flex;\n  justify-content: center;  /* горизонтально */\n  align-items: center;      /* вертикально */\n  min-height: 100vh;\n}\n\n/* Сокращённая запись через place-items (только для Grid/Flex) */\n.perfect-center {\n  display: flex;\n  place-content: center;  /* justify-content + align-content */\n}' },
        { type: 'heading', value: 'align-self — индивидуальное выравнивание' },
        { type: 'code', language: 'css', value: '.container {\n  display: flex;\n  align-items: flex-start;  /* все вверху */\n}\n\n.special-item {\n  align-self: flex-end;     /* этот элемент внизу */\n}\n\n.centered-item {\n  align-self: center;       /* этот — по центру */\n}' },
        { type: 'tip', value: 'Если align-items: stretch не работает, проверьте — возможно, у дочерних элементов задана фиксированная высота (height). Stretch не может растянуть элемент с фиксированной высотой.' }
      ]
    },
    {
      id: 4,
      title: 'flex-wrap и gap',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию flex-элементы пытаются уместиться в одну строку, сжимаясь при необходимости. flex-wrap позволяет переносить элементы на новые строки.' },
        { type: 'heading', value: 'flex-wrap' },
        { type: 'code', language: 'css', value: '/* По умолчанию — без переноса */\n.no-wrap { flex-wrap: nowrap; }\n/* [A][B][C][D][E] — все в одну строку, могут сжиматься */\n\n/* С переносом */\n.wrap { flex-wrap: wrap; }\n/* [A][B][C]\n   [D][E]     — переносятся на новую строку */\n\n/* Обратный перенос */\n.wrap-reverse { flex-wrap: wrap-reverse; }\n/* [D][E]\n   [A][B][C]  — новые строки идут вверх */' },
        { type: 'heading', value: 'gap — промежутки между элементами' },
        { type: 'code', language: 'css', value: '/* gap заменяет margin для промежутков */\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;           /* одинаковый промежуток */\n  gap: 1rem 2rem;      /* row-gap column-gap */\n  row-gap: 1rem;       /* только между строками */\n  column-gap: 2rem;    /* только между колонками */\n}\n\n/* Преимущество gap перед margin:\n   - Нет лишних отступов по краям\n   - Не нужно убирать margin у последнего элемента\n   - Работает одинаково для flex и grid */\n\n/* Старый способ (не рекомендуется): */\n.item {\n  margin: 0.5rem;  /* создаёт отступ по краям контейнера */\n}\n/* Новый способ: */\n.container {\n  gap: 1rem;       /* только между элементами! */\n}' },
        { type: 'heading', value: 'Сетка карточек через flex-wrap' },
        { type: 'code', language: 'css', value: '.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n}\n\n.card {\n  flex: 1 1 300px;  /* grow shrink basis */\n  /* Минимальная ширина 300px, растёт чтобы заполнить строку */\n  max-width: 400px;  /* ограничиваем максимум */\n}' },
        { type: 'tip', value: 'gap поддерживается всеми современными браузерами (включая Safari 14.1+). Используйте его вместо margin для промежутков в flex и grid.' }
      ]
    },
    {
      id: 5,
      title: 'Сокращение flex-flow и align-content',
      type: 'theory',
      content: [
        { type: 'text', value: 'flex-flow — сокращение для flex-direction + flex-wrap. align-content управляет распределением строк при flex-wrap (аналогично justify-content, но для поперечной оси).' },
        { type: 'heading', value: 'flex-flow' },
        { type: 'code', language: 'css', value: '/* flex-flow: direction wrap */\n.container {\n  display: flex;\n  flex-flow: row wrap;          /* по умолчанию */\n  flex-flow: column nowrap;\n  flex-flow: row-reverse wrap;  /* справа налево с переносом */\n}' },
        { type: 'heading', value: 'align-content — распределение строк' },
        { type: 'code', language: 'css', value: '/* align-content работает только при flex-wrap: wrap */\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  height: 500px;  /* нужна фиксированная высота */\n  \n  /* Те же значения, что у justify-content */\n  align-content: flex-start;     /* строки вверху */\n  align-content: flex-end;       /* строки внизу */\n  align-content: center;         /* строки по центру */\n  align-content: space-between;  /* строки с промежутками */\n  align-content: stretch;        /* строки растягиваются */\n}' },
        { type: 'heading', value: 'Отличие align-items от align-content' },
        { type: 'code', language: 'css', value: '/*\n  align-items — выравнивает ЭЛЕМЕНТЫ внутри одной строки\n  align-content — распределяет СТРОКИ внутри контейнера\n\n  align-items: center;\n  ┌─────────────────────────┐\n  │                         │\n  │   [A]  [B]  [C]        │  <- элементы по центру строки\n  │   [D]  [E]             │  <- элементы по центру строки\n  │                         │\n  └─────────────────────────┘\n\n  align-content: center;\n  ┌─────────────────────────┐\n  │                         │\n  │   [A]  [B]  [C]        │  <- строки сгруппированы\n  │   [D]  [E]             │  <- по центру контейнера\n  │                         │\n  └─────────────────────────┘\n*/' },
        { type: 'note', value: 'align-content не имеет эффекта, если есть только одна строка (flex-wrap: nowrap или элементы помещаются в одну строку).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Навигация и карточки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте адаптивную навигацию и сетку карточек, используя flexbox.',
      requirements: [
        'Навигация: лого слева, ссылки по центру, кнопка справа (space-between)',
        'Ссылки навигации с gap между ними',
        'Вертикальное центрирование всех элементов навигации (align-items)',
        'Сетка из 6 карточек с flex-wrap и gap',
        'Карточки с минимальной шириной 250px, растягиваются по строке',
        'Центрирование контента внутри карточки (flex + center)'
      ],
      hint: 'Для навигации используйте justify-content: space-between. Для карточек — flex-wrap: wrap с flex: 1 1 250px.',
      expectedOutput: 'Страница с навигационной панелью (лого/ссылки/кнопка) и адаптивной сеткой из 6 карточек, которые переносятся на новые строки.',
      solution: '.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: white;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n.nav-links {\n  display: flex;\n  gap: 2rem;\n  list-style: none;\n}\n\n.nav-links a {\n  text-decoration: none;\n  color: #374151;\n}\n\n.nav-links a:hover {\n  color: #3b82f6;\n}\n\n.btn {\n  padding: 0.5rem 1rem;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\n\n.card-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.5rem;\n  padding: 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.card {\n  flex: 1 1 250px;\n  max-width: 380px;\n  background: white;\n  border-radius: 12px;\n  padding: 1.5rem;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 0.75rem;\n}',
      explanation: 'Навигация использует space-between для трёх групп и align-items: center для вертикального выравнивания. Карточки используют flex-wrap для переноса и flex: 1 1 250px для адаптивной ширины с минимумом 250px.'
    }
  ]
}
