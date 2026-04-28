export default {
  id: 15,
  title: 'Современный CSS',
  description: ':has(), container queries, CSS nesting, :is(), :where() и другие новые возможности.',
  lessons: [
    {
      id: 1,
      title: ':is() и :where()',
      type: 'theory',
      content: [
        { type: 'text', value: ':is() и :where() упрощают сложные селекторы, принимая список аргументов. Разница — в специфичности: :is() наследует максимальную, :where() имеет нулевую.' },
        { type: 'heading', value: ':is() — группировка с сохранением специфичности' },
        { type: 'code', language: 'css', value: '/* Без :is() — длинный список */\nheader a:hover,\nnav a:hover,\nfooter a:hover {\n  color: #3b82f6;\n}\n\n/* С :is() — компактно */\n:is(header, nav, footer) a:hover {\n  color: #3b82f6;\n}\n\n/* Вложенные :is() */\n:is(h1, h2, h3):is(:first-child, .highlight) {\n  color: #2563eb;\n}\n\n/* Специфичность :is() = максимальная из аргументов */\n:is(.card, #main) p { }  /* специфичность = (1,0,1) как у #main p */\n' },
        { type: 'heading', value: ':where() — нулевая специфичность' },
        { type: 'code', language: 'css', value: '/* :where() — те же возможности, но специфичность = 0 */\n:where(header, nav, footer) a {\n  color: #3b82f6;\n  /* Легко переопределить любым селектором */\n}\n\n/* Идеально для базовых стилей / reset */\n:where(h1, h2, h3, h4, h5, h6) {\n  margin: 0;\n  font-weight: 600;\n}\n\n:where(ul, ol) {\n  padding-left: 1.5rem;\n}\n\n/* Легко переопределить: */\nh1 { margin: 2rem 0; }  /* перебьёт :where(h1,...) */\n\n/* Нулевая специфичность — идеально для defaults */\n:where(article, section) :where(h1, h2, h3) {\n  line-height: 1.2;\n}' },
        { type: 'tip', value: ':where() идеален для CSS-reset и базовых стилей: они легко переопределяются. :is() — для группировки селекторов в компонентах.' }
      ]
    },
    {
      id: 2,
      title: ':has() — родительский селектор',
      type: 'theory',
      content: [
        { type: 'text', value: ':has() — долгожданный «родительский селектор». Он позволяет стилизовать элемент на основе его содержимого или состояния потомков.' },
        { type: 'heading', value: 'Основы :has()' },
        { type: 'code', language: 'css', value: '/* Карточка, содержащая изображение */\n.card:has(img) {\n  padding: 0;\n}\n\n/* Карточка БЕЗ изображения */\n.card:not(:has(img)) {\n  padding: 2rem;\n}\n\n/* Form, содержащая невалидный input */\nform:has(input:invalid) {\n  border: 2px solid #ef4444;\n}\n\n/* Форма, если чекбокс выбран */\nform:has(input[type="checkbox"]:checked) .submit-btn {\n  background: #22c55e;\n}\n\n/* Навигация, если есть поиск */\nnav:has(.search-input:focus) {\n  background: white;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}' },
        { type: 'heading', value: 'Продвинутые паттерны :has()' },
        { type: 'code', language: 'css', value: '/* Количественные запросы (quantity queries) */\n\n/* Если элементов больше 3 — grid */\n.list:has(:nth-child(4)) {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n}\n\n/* Если элементов больше 6 — 3 колонки */\n.list:has(:nth-child(7)) {\n  grid-template-columns: repeat(3, 1fr);\n}\n\n/* Предыдущий соседний элемент (нет previous sibling selector, но) */\n/* Стилизовать label если СЛЕДУЮЩИЙ input в фокусе */\n.field:has(input:focus) label {\n  color: #3b82f6;\n}\n\n/* Тёмная тема через :has на html */\nhtml:has(#dark-toggle:checked) {\n  --color-bg: #0f172a;\n  --color-text: #e2e8f0;\n}' },
        { type: 'note', value: ':has() поддерживается в Chrome 105+, Safari 15.4+, Firefox 121+. Это уже можно использовать в продакшене.' }
      ]
    },
    {
      id: 3,
      title: 'Container queries',
      type: 'theory',
      content: [
        { type: 'text', value: 'Container queries позволяют стилизовать элемент в зависимости от размера его КОНТЕЙНЕРА, а не viewport. Это революция для компонентного подхода.' },
        { type: 'heading', value: 'Основы container queries' },
        { type: 'code', language: 'css', value: '/* 1. Определяем контейнер */\n.card-wrapper {\n  container-type: inline-size;  /* отслеживаем ширину */\n  container-name: card;         /* необязательное имя */\n}\n\n/* Сокращённая запись */\n.card-wrapper {\n  container: card / inline-size;\n}\n\n/* 2. Используем @container вместо @media */\n@container card (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 1rem;\n  }\n\n  .card-image {\n    width: 200px;\n    flex-shrink: 0;\n  }\n}\n\n@container card (min-width: 600px) {\n  .card {\n    font-size: 1.125rem;\n  }\n}' },
        { type: 'heading', value: 'Container query units' },
        { type: 'code', language: 'css', value: '/* Единицы относительно контейнера */\n.card-title {\n  font-size: clamp(1rem, 3cqi, 1.5rem);\n  /* cqi = 1% от inline-size контейнера */\n}\n\n/*\n  cqw — 1% ширины контейнера\n  cqh — 1% высоты контейнера\n  cqi — 1% inline-size\n  cqb — 1% block-size\n  cqmin — min(cqi, cqb)\n  cqmax — max(cqi, cqb)\n*/\n\n/* Без имени — ближайший контейнер */\n@container (min-width: 300px) {\n  .content { padding: 2rem; }\n}' },
        { type: 'tip', value: 'Container queries — это компонентный responsive design. Карточка адаптируется к СВОЕМУ контейнеру, а не к viewport. Идеально для переиспользуемых компонентов.' }
      ]
    },
    {
      id: 4,
      title: 'CSS Nesting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нативный CSS nesting позволяет вкладывать правила друг в друга, как в Sass. Это встроено в CSS — без препроцессора!' },
        { type: 'heading', value: 'CSS Nesting' },
        { type: 'code', language: 'css', value: '/* Нативная вложенность в CSS */\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 1rem;\n\n  /* Вложенный селектор */\n  .title {\n    font-size: 1.25rem;\n    font-weight: 600;\n  }\n\n  .description {\n    color: #64748b;\n    margin-top: 0.5rem;\n  }\n\n  /* & для привязки к родителю */\n  &:hover {\n    box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  }\n\n  /* Модификатор */\n  &.featured {\n    border: 2px solid #3b82f6;\n  }\n\n  /* Медиа-запросы внутри */\n  @media (min-width: 768px) {\n    display: flex;\n    gap: 1rem;\n  }\n}' },
        { type: 'heading', value: 'Вложенность с & (ampersand)' },
        { type: 'code', language: 'css', value: '/* & представляет родительский селектор */\n.btn {\n  background: #3b82f6;\n  \n  &:hover { background: #2563eb; }  /* .btn:hover */\n  &:active { transform: scale(0.98); }  /* .btn:active */\n  &.large { padding: 1rem 2rem; }  /* .btn.large */\n  \n  /* & в конце — для стилизации при родителе */\n  .dark & { background: #60a5fa; }  /* .dark .btn */\n  \n  /* Вложенная вложенность */\n  .icon {\n    width: 1em;\n    height: 1em;\n    \n    &.spin {\n      animation: spin 1s linear infinite;  /* .btn .icon.spin */\n    }\n  }\n}' },
        { type: 'note', value: 'CSS nesting поддерживается в Chrome 120+, Firefox 117+, Safari 17.2+. Для старых браузеров используйте PostCSS nesting plugin или Sass.' }
      ]
    },
    {
      id: 5,
      title: '@layer — каскадные слои',
      type: 'theory',
      content: [
        { type: 'text', value: '@layer позволяет контролировать приоритет стилей через именованные слои. Стили в более позднем слое имеют приоритет, независимо от специфичности.' },
        { type: 'heading', value: 'Каскадные слои' },
        { type: 'code', language: 'css', value: '/* Определяем порядок слоёв */\n@layer reset, base, components, utilities;\n\n/* Стили в reset — самый низкий приоритет */\n@layer reset {\n  * { margin: 0; padding: 0; box-sizing: border-box; }\n  img { max-width: 100%; display: block; }\n}\n\n@layer base {\n  body { font-family: system-ui; line-height: 1.6; }\n  h1 { font-size: 2rem; }\n}\n\n@layer components {\n  .card {\n    background: white;\n    border: 1px solid #e5e7eb;\n    border-radius: 8px;\n  }\n  \n  .btn {\n    padding: 0.5rem 1rem;\n    background: #3b82f6;\n    color: white;\n  }\n}\n\n/* utilities — самый высокий приоритет */\n@layer utilities {\n  .mt-4 { margin-top: 1rem !important; }\n  .hidden { display: none !important; }\n}' },
        { type: 'heading', value: 'Импорт в слои' },
        { type: 'code', language: 'css', value: '/* Импорт библиотек в свой слой */\n@import url("reset.css") layer(reset);\n@import url("bootstrap.css") layer(vendor);\n\n/* Ваши стили в более приоритетном слое */\n@layer vendor, custom;\n\n@layer custom {\n  .btn { background: #3b82f6; }  /* перекрывает vendor .btn */\n}\n\n/* Стили БЕЗ слоя имеют наивысший приоритет */\n.override { color: red; }  /* выше любого @layer */\n' },
        { type: 'tip', value: '@layer решает проблему «войны специфичностей» с CSS-библиотеками. Поместите чужой CSS в layer(vendor), а свой — в более приоритетный слой.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Адаптивная карточка с :has() и @container',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте карточку, которая адаптируется к размеру контейнера через @container и меняет стили на основе содержимого через :has().',
      requirements: [
        'Container query: при ширине < 300px — вертикальный layout, >= 400px — горизонтальный',
        ':has(img) — карточка с изображением убирает верхний padding',
        ':has(.badge) — карточка с бейджем получает цветную полоску сверху',
        'CSS nesting для стилей карточки',
        'Container query units (cqi) для адаптивного font-size',
        '@layer для организации стилей (base, components)'
      ],
      hint: 'Оберните карточку в container с container-type: inline-size. Используйте @container для адаптации layout и :has() для условных стилей.',
      expectedOutput: 'Карточка, автоматически меняющая layout и стили в зависимости от размера контейнера и содержимого.',
      solution: '@layer base, components;\n\n@layer base {\n  * { box-sizing: border-box; margin: 0; }\n  body { font-family: system-ui; padding: 2rem; }\n}\n\n@layer components {\n  .card-wrapper {\n    container: card / inline-size;\n  }\n\n  .card {\n    background: white;\n    border: 1px solid #e2e8f0;\n    border-radius: 12px;\n    overflow: hidden;\n\n    .card-body {\n      padding: 1.5rem;\n    }\n\n    .card-title {\n      font-size: clamp(1rem, 3cqi, 1.5rem);\n      font-weight: 600;\n      margin-bottom: 0.5rem;\n    }\n\n    .card-text {\n      color: #64748b;\n      line-height: 1.6;\n    }\n\n    &:has(img) {\n      .card-body { padding-top: 1rem; }\n    }\n\n    &:has(.badge) {\n      border-top: 3px solid #3b82f6;\n    }\n\n    &:hover {\n      box-shadow: 0 8px 25px rgba(0,0,0,0.1);\n    }\n\n    img {\n      width: 100%;\n      aspect-ratio: 16/9;\n      object-fit: cover;\n    }\n\n    .badge {\n      display: inline-block;\n      background: #dbeafe;\n      color: #1d4ed8;\n      padding: 0.25rem 0.75rem;\n      border-radius: 9999px;\n      font-size: 0.75rem;\n      font-weight: 600;\n    }\n  }\n\n  @container card (min-width: 400px) {\n    .card {\n      display: flex;\n\n      img {\n        width: 200px;\n        height: auto;\n        aspect-ratio: auto;\n      }\n    }\n  }\n}',
      explanation: 'container-type: inline-size на обёртке включает отслеживание ширины. @container переключает layout на горизонтальный при 400px. :has(img) и :has(.badge) условно стилизуют карточку. CSS nesting делает код компактным. cqi в font-size масштабирует текст по контейнеру.'
    }
  ]
}
