export default {
  id: 1,
  title: 'Введение в CSS',
  description: 'Селекторы, каскад, специфичность и наследование — фундамент работы со стилями.',
  lessons: [
    {
      id: 1,
      title: 'Что такое CSS и как подключать стили',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS (Cascading Style Sheets) — язык для описания внешнего вида HTML-документа. CSS отделяет оформление от структуры, что делает код чище и удобнее в поддержке.' },
        { type: 'heading', value: 'Три способа подключения CSS' },
        { type: 'code', language: 'html', value: '<!-- 1. Внешний файл (рекомендуется) -->\n<link rel="stylesheet" href="styles.css">\n\n<!-- 2. Тег <style> в <head> -->\n<style>\n  body {\n    margin: 0;\n    font-family: sans-serif;\n  }\n</style>\n\n<!-- 3. Инлайн-стили (избегайте) -->\n<p style="color: red; font-size: 16px;">Текст</p>' },
        { type: 'text', value: 'Внешний файл — лучший способ: стили кешируются браузером, переиспользуются на всех страницах и легко поддерживаются.' },
        { type: 'heading', value: 'Анатомия CSS-правила' },
        { type: 'code', language: 'css', value: '/* Селектор { свойство: значение; } */\nh1 {\n  color: #333;          /* цвет текста */\n  font-size: 2rem;      /* размер шрифта */\n  margin-bottom: 1rem;  /* отступ снизу */\n}' },
        { type: 'tip', value: 'Всегда подключайте CSS через внешний файл. Инлайн-стили используйте только для динамических значений в JavaScript.' }
      ]
    },
    {
      id: 2,
      title: 'Селекторы CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Селекторы определяют, к каким элементам применяются стили. В CSS существует множество типов селекторов — от простых до сложных комбинаций.' },
        { type: 'heading', value: 'Базовые селекторы' },
        { type: 'code', language: 'css', value: '/* Селектор элемента (тега) */\np { color: #333; }\n\n/* Селектор класса — начинается с точки */\n.card { border: 1px solid #ddd; }\n\n/* Селектор идентификатора — начинается с # */\n#header { background: #fff; }\n\n/* Универсальный селектор — все элементы */\n* { box-sizing: border-box; }\n\n/* Селектор атрибута */\ninput[type="email"] { border-color: blue; }\na[href^="https"] { color: green; }  /* начинается с https */\na[href$=".pdf"] { color: red; }     /* заканчивается на .pdf */\na[href*="example"] { color: orange; } /* содержит example */' },
        { type: 'heading', value: 'Комбинаторы' },
        { type: 'code', language: 'css', value: '/* Потомок (любая вложенность) */\n.card p { margin: 0; }\n\n/* Дочерний элемент (прямой потомок) */\n.card > p { font-weight: bold; }\n\n/* Соседний элемент (сразу после) */\nh2 + p { margin-top: 0; }\n\n/* Все последующие соседи */\nh2 ~ p { color: gray; }' },
        { type: 'heading', value: 'Группировка селекторов' },
        { type: 'code', language: 'css', value: '/* Одинаковые стили для нескольких селекторов */\nh1, h2, h3 {\n  font-family: "Georgia", serif;\n  line-height: 1.3;\n}\n\n.btn-primary,\n.btn-secondary {\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  cursor: pointer;\n}' },
        { type: 'tip', value: 'Используйте классы (.class) как основной способ выбора элементов. Избегайте #id для стилизации — у них слишком высокая специфичность.' }
      ]
    },
    {
      id: 3,
      title: 'Каскад и специфичность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каскад — алгоритм, по которому браузер решает, какие стили применить, когда несколько правил конфликтуют. Три главных фактора: важность, специфичность, порядок.' },
        { type: 'heading', value: 'Специфичность селекторов' },
        { type: 'code', language: 'css', value: '/* Специфичность считается как (a, b, c):\n   a — количество #id\n   b — количество .class, [attr], :pseudo-class\n   c — количество element, ::pseudo-element\n*/\n\np { }                    /* (0, 0, 1) */\n.card { }                /* (0, 1, 0) */\n#header { }              /* (1, 0, 0) */\np.card { }               /* (0, 1, 1) */\n#header .nav a { }       /* (1, 1, 1) */\n#header .nav a.active { } /* (1, 2, 1) */\n\n/* Inline-стиль:           (1, 0, 0, 0) — выше любого селектора */\n/* !important — перекрывает всё (избегайте!) */' },
        { type: 'heading', value: 'Пример конфликта' },
        { type: 'code', language: 'css', value: '/* Кто победит? */\n.card p { color: blue; }       /* (0, 1, 1) */\np.highlight { color: red; }     /* (0, 1, 1) — равны! */\n/* При равной специфичности побеждает правило, которое написано позже */\n\n/* А тут? */\n#main p { color: green; }       /* (1, 0, 1) — побеждает! */\n.card .text { color: purple; }  /* (0, 2, 1) */\n/* #id (1,0,1) > два класса (0,2,1) */' },
        { type: 'heading', value: 'Порядок приоритетов каскада' },
        { type: 'list', value: [
          '1. !important (избегайте)',
          '2. Инлайн-стили (style="")',
          '3. #id селекторы',
          '4. .class, [attr], :pseudo-class',
          '5. element, ::pseudo-element',
          '6. Универсальный * и комбинаторы (не влияют)',
          '7. При равной специфичности — побеждает последнее правило'
        ]},
        { type: 'note', value: '!important ломает каскад и делает код непредсказуемым. Единственное оправданное применение — переопределение стилей сторонних библиотек.' }
      ]
    },
    {
      id: 4,
      title: 'Наследование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые CSS-свойства автоматически передаются от родителя к потомкам. Это называется наследованием. Понимание наследования помогает писать меньше кода.' },
        { type: 'heading', value: 'Наследуемые свойства' },
        { type: 'code', language: 'css', value: '/* Наследуются (связаны с текстом): */\nbody {\n  font-family: "Inter", sans-serif;  /* ✅ наследуется */\n  font-size: 16px;                   /* ✅ наследуется */\n  line-height: 1.6;                  /* ✅ наследуется */\n  color: #333;                       /* ✅ наследуется */\n  letter-spacing: 0.01em;            /* ✅ наследуется */\n}\n\n/* НЕ наследуются (связаны с блоком): */\n.card {\n  margin: 1rem;       /* ❌ не наследуется */\n  padding: 1rem;      /* ❌ не наследуется */\n  border: 1px solid;  /* ❌ не наследуется */\n  background: white;  /* ❌ не наследуется */\n  width: 300px;       /* ❌ не наследуется */\n}' },
        { type: 'heading', value: 'Управление наследованием' },
        { type: 'code', language: 'css', value: '/* inherit — принудительное наследование */\na {\n  color: inherit;  /* берёт цвет от родителя */\n}\n\n/* initial — начальное значение по спецификации */\np {\n  margin: initial;  /* обнуляет margin */\n}\n\n/* unset — inherit для наследуемых, initial для остальных */\n.reset {\n  all: unset;  /* сбросит ВСЕ стили элемента */\n}\n\n/* revert — возвращает стиль браузера по умолчанию */\nbutton {\n  all: revert;  /* вернёт дефолтный вид кнопки */\n}' },
        { type: 'tip', value: 'Задавайте font-family, color, line-height на body — они унаследуются всеми элементами, и вам не придётся повторять их.' }
      ]
    },
    {
      id: 5,
      title: 'Единицы измерения',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS предлагает множество единиц измерения. Выбор правильной единицы зависит от контекста: размер текста, ширина блока, отступы.' },
        { type: 'heading', value: 'Абсолютные и относительные единицы' },
        { type: 'code', language: 'css', value: '/* Абсолютные (фиксированные) */\n.box { width: 300px; }    /* пиксели — самая распространённая */\n\n/* Относительные (зависят от контекста) */\n.text { font-size: 1.5rem; }   /* rem = относительно корневого font-size (16px) */\n.child { font-size: 1.2em; }   /* em = относительно font-size родителя */\n.container { width: 80%; }     /* % = относительно родителя */\n.hero { height: 100vh; }       /* vh = 1% высоты viewport */\n.banner { width: 50vw; }       /* vw = 1% ширины viewport */\n\n/* Новые единицы viewport (учитывают мобильные панели) */\n.section {\n  min-height: 100dvh;  /* dynamic vh — реальная высота */\n  /* svh — smallest, lvh — largest */\n}' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: [
          'rem — размеры шрифта, отступы, все типографические размеры',
          'px — border, box-shadow, мелкие точные значения',
          '% — ширина контейнеров, ширина колонок',
          'vh/vw — полноэкранные секции, герои',
          'em — внутренние отступы относительно шрифта элемента',
          'ch — ширина контейнера для текста (60ch ≈ оптимальная ширина строки)'
        ]},
        { type: 'code', language: 'css', value: '/* Практический пример */\n:root {\n  font-size: 16px;  /* база для rem */\n}\n\n.container {\n  max-width: 75rem;    /* 1200px при font-size: 16px */\n  margin: 0 auto;\n  padding: 0 1rem;\n}\n\n.article {\n  max-width: 65ch;    /* оптимальная ширина для чтения */\n  font-size: 1.125rem; /* 18px */\n  line-height: 1.6;\n}' },
        { type: 'tip', value: 'Используйте rem для большинства размеров. Это обеспечивает масштабируемость — при изменении корневого font-size весь интерфейс пропорционально изменится.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Стилизация статьи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Стилизуйте HTML-статью, используя селекторы, наследование и правильные единицы измерения.',
      requirements: [
        'Задайте базовые стили на body: font-family, color, line-height',
        'Стилизуйте заголовки h1, h2 с разными размерами через rem',
        'Используйте селектор потомка для стилизации ссылок внутри .article',
        'Добавьте стили для .highlight класса с фоновым цветом',
        'Ограничьте ширину текста через max-width с единицей ch',
        'Используйте селектор атрибута для внешних ссылок a[target="_blank"]'
      ],
      hint: 'Начните с body для наследуемых свойств, затем добавьте специфические стили для классов и элементов.',
      expectedOutput: 'Страница со стилизованной статьёй: читаемый текст, красивые заголовки, выделенные ссылки и подсветка важных фрагментов.',
      solution: 'body {\n  font-family: "Georgia", serif;\n  color: #333;\n  line-height: 1.7;\n  margin: 0;\n  padding: 2rem;\n  background: #fafafa;\n}\n\n.article {\n  max-width: 65ch;\n  margin: 0 auto;\n}\n\nh1 {\n  font-size: 2.5rem;\n  color: #111;\n  margin-bottom: 0.5rem;\n}\n\nh2 {\n  font-size: 1.75rem;\n  color: #222;\n  margin-top: 2rem;\n}\n\n.article a {\n  color: #2563eb;\n  text-decoration: underline;\n  text-underline-offset: 3px;\n}\n\n.article a:hover {\n  color: #1d4ed8;\n}\n\na[target="_blank"]::after {\n  content: " ↗";\n  font-size: 0.8em;\n}\n\n.highlight {\n  background: #fef3c7;\n  padding: 0.1em 0.3em;\n  border-radius: 3px;\n}',
      explanation: 'Мы задали наследуемые стили на body (font-family, color, line-height). Для заголовков использовали rem. Ширина текста ограничена через ch для оптимального чтения. Селектор атрибута стилизует внешние ссылки с иконкой через псевдоэлемент ::after.'
    }
  ]
}
