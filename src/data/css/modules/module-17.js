export default {
  id: 17,
  title: 'Sass/SCSS',
  description: 'Переменные, вложенность, миксины, функции и partials в препроцессоре Sass.',
  lessons: [
    {
      id: 1,
      title: 'Введение в Sass/SCSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sass — CSS-препроцессор, расширяющий возможности CSS: переменные (до CSS custom properties), вложенность, миксины, функции, циклы. SCSS — синтаксис Sass, совместимый с CSS.' },
        { type: 'heading', value: 'Установка и настройка' },
        { type: 'code', language: 'bash', value: '# Установка\nnpm install -D sass\n\n# Компиляция\nnpx sass src/styles.scss dist/styles.css\n\n# Наблюдение за изменениями\nnpx sass --watch src/styles.scss dist/styles.css\n\n# В Vite — работает из коробки\n# Просто импортируйте .scss файлы' },
        { type: 'heading', value: 'Sass vs SCSS синтаксис' },
        { type: 'code', language: 'scss', value: '// SCSS (рекомендуется) — расширенный CSS синтаксис\n.card {\n  background: white;\n  border-radius: 8px;\n\n  .title {\n    font-size: 1.25rem;\n  }\n}\n\n// Sass (отступы вместо скобок) — менее популярен\n// .card\n//   background: white\n//   border-radius: 8px\n//   .title\n//     font-size: 1.25rem' },
        { type: 'tip', value: 'SCSS полностью совместим с CSS: любой .css файл — валидный .scss файл. Можно постепенно мигрировать, просто переименовав расширение.' }
      ]
    },
    {
      id: 2,
      title: 'Переменные и вложенность',
      type: 'theory',
      content: [
        { type: 'text', value: 'SCSS-переменные начинаются с $. Вложенность позволяет писать стили иерархически. & ссылается на родительский селектор.' },
        { type: 'heading', value: 'Переменные SCSS' },
        { type: 'code', language: 'scss', value: '// Объявление переменных\n$color-primary: #3b82f6;\n$color-text: #1e293b;\n$spacing: 1rem;\n$radius: 8px;\n$font-stack: "Inter", system-ui, sans-serif;\n\n// Использование\nbody {\n  font-family: $font-stack;\n  color: $color-text;\n}\n\n.button {\n  background: $color-primary;\n  padding: $spacing;\n  border-radius: $radius;\n}\n\n// Карты (maps) — словари\n$colors: (\n  primary: #3b82f6,\n  secondary: #8b5cf6,\n  success: #22c55e,\n  danger: #ef4444,\n);\n\n.alert-primary {\n  color: map-get($colors, primary);\n}' },
        { type: 'heading', value: 'Вложенность и &' },
        { type: 'code', language: 'scss', value: '.card {\n  background: white;\n  padding: 1.5rem;\n\n  // Потомки\n  .title {\n    font-size: 1.25rem;\n  }\n\n  // & = родитель (.card)\n  &:hover {\n    box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n  }\n\n  // Модификатор BEM\n  &--featured {\n    border: 2px solid $color-primary;\n  }\n\n  // Элемент BEM\n  &__title {\n    font-size: 1.25rem;\n  }\n\n  // Медиа-запрос внутри\n  @media (min-width: 768px) {\n    display: flex;\n    gap: 1rem;\n  }\n}' },
        { type: 'note', value: 'Не вкладывайте глубже 3 уровней! Глубокая вложенность создаёт длинные селекторы и повышает специфичность. Используйте BEM для плоской структуры.' }
      ]
    },
    {
      id: 3,
      title: 'Миксины и include',
      type: 'theory',
      content: [
        { type: 'text', value: 'Миксины (mixins) — переиспользуемые блоки CSS. Они могут принимать аргументы и содержать любой CSS. Подключаются через @include.' },
        { type: 'heading', value: 'Создание и использование миксинов' },
        { type: 'code', language: 'scss', value: '// Простой миксин\n@mixin flex-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.hero {\n  @include flex-center;\n  min-height: 100vh;\n}\n\n// Миксин с аргументами\n@mixin button-variant($bg, $color: white) {\n  background: $bg;\n  color: $color;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  cursor: pointer;\n\n  &:hover {\n    filter: brightness(0.9);\n  }\n}\n\n.btn-primary { @include button-variant(#3b82f6); }\n.btn-danger  { @include button-variant(#ef4444); }\n.btn-outline { @include button-variant(transparent, #3b82f6); }' },
        { type: 'heading', value: 'Полезные миксины' },
        { type: 'code', language: 'scss', value: '// Responsive миксин\n@mixin respond-to($breakpoint) {\n  @if $breakpoint == sm { @media (min-width: 640px)  { @content; } }\n  @if $breakpoint == md { @media (min-width: 768px)  { @content; } }\n  @if $breakpoint == lg { @media (min-width: 1024px) { @content; } }\n  @if $breakpoint == xl { @media (min-width: 1280px) { @content; } }\n}\n\n.grid {\n  grid-template-columns: 1fr;\n\n  @include respond-to(md) {\n    grid-template-columns: repeat(2, 1fr);\n  }\n\n  @include respond-to(lg) {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\n// Truncate миксин\n@mixin truncate($lines: 1) {\n  @if $lines == 1 {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  } @else {\n    display: -webkit-box;\n    -webkit-line-clamp: $lines;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n}\n\n.title { @include truncate; }      // 1 строка\n.desc  { @include truncate(3); }   // 3 строки' },
        { type: 'tip', value: 'Не создавайте миксин для каждой мелочи. Если миксин используется 1-2 раза — лучше написать CSS напрямую. Миксины — для часто повторяющихся паттернов.' }
      ]
    },
    {
      id: 4,
      title: 'Функции, циклы и условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'SCSS поддерживает функции, циклы (@for, @each, @while) и условия (@if/@else). Это позволяет генерировать CSS программно.' },
        { type: 'heading', value: 'Функции' },
        { type: 'code', language: 'scss', value: '// Кастомная функция\n@function rem($px) {\n  @return calc($px / 16) * 1rem;\n}\n\nh1 { font-size: rem(32); }  // 2rem\nh2 { font-size: rem(24); }  // 1.5rem\n\n// Встроенные функции\n.lighter { color: lighten(#3b82f6, 20%); }\n.darker  { color: darken(#3b82f6, 20%); }\n.mixed   { color: mix(#3b82f6, #ef4444, 50%); }\n.faded   { color: rgba(#3b82f6, 0.5); }  // SCSS позволяет hex в rgba!' },
        { type: 'heading', value: 'Циклы' },
        { type: 'code', language: 'scss', value: '// @each — перебор списка/карты\n$sizes: (\n  sm: 0.5rem,\n  md: 1rem,\n  lg: 1.5rem,\n  xl: 2rem,\n);\n\n@each $name, $size in $sizes {\n  .p-#{$name} { padding: $size; }\n  .m-#{$name} { margin: $size; }\n}\n// Генерирует: .p-sm { padding: 0.5rem; } ...\n\n// @for — числовой цикл\n@for $i from 1 through 12 {\n  .col-#{$i} {\n    width: calc($i / 12 * 100%);\n  }\n}\n// Генерирует: .col-1 { width: 8.33% } ... .col-12 { width: 100% }\n\n// Генерация цветовых утилит\n$colors: (\n  primary: #3b82f6,\n  danger: #ef4444,\n  success: #22c55e,\n);\n\n@each $name, $color in $colors {\n  .text-#{$name} { color: $color; }\n  .bg-#{$name} { background-color: $color; }\n  .border-#{$name} { border-color: $color; }\n}' },
        { type: 'note', value: 'Циклы SCSS — мощный инструмент генерации утилит. Но не злоупотребляйте: сгенерированный CSS может быть огромным. Tailwind решает это через tree-shaking.' }
      ]
    },
    {
      id: 5,
      title: 'Partials и организация файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Partials — файлы SCSS, которые импортируются в другие файлы. Они начинаются с _ и не компилируются в отдельный CSS-файл.' },
        { type: 'heading', value: 'Структура проекта (7-1 Pattern)' },
        { type: 'code', language: 'bash', value: 'styles/\n├── abstracts/          # Переменные, миксины, функции\n│   ├── _variables.scss\n│   ├── _mixins.scss\n│   └── _functions.scss\n├── base/               # Reset, типографика, базовые стили\n│   ├── _reset.scss\n│   ├── _typography.scss\n│   └── _base.scss\n├── components/         # Компоненты\n│   ├── _button.scss\n│   ├── _card.scss\n│   └── _modal.scss\n├── layout/             # Структурные блоки\n│   ├── _header.scss\n│   ├── _footer.scss\n│   └── _sidebar.scss\n├── pages/              # Стили конкретных страниц\n│   └── _home.scss\n├── themes/             # Темы\n│   └── _dark.scss\n├── vendors/            # Сторонние стили\n│   └── _normalize.scss\n└── main.scss           # Главный файл — только @use' },
        { type: 'heading', value: '@use и @forward (современный способ)' },
        { type: 'code', language: 'scss', value: '// main.scss — главный файл\n@use "abstracts/variables" as vars;\n@use "abstracts/mixins" as mix;\n@use "base/reset";\n@use "base/typography";\n@use "components/button";\n@use "components/card";\n@use "layout/header";\n@use "layout/footer";\n\n// _variables.scss\n$color-primary: #3b82f6;\n$spacing: 1rem;\n\n// _button.scss\n@use "../abstracts/variables" as vars;\n\n.button {\n  background: vars.$color-primary;\n  padding: vars.$spacing;\n}\n\n// @forward — реэкспорт\n// abstracts/_index.scss\n@forward "variables";\n@forward "mixins";\n@forward "functions";\n\n// Теперь можно: @use "abstracts" as *;' },
        { type: 'tip', value: 'Используйте @use вместо @import — он безопаснее (не загрязняет глобальный scope, не дублирует код при множественных импортах). @import устарел и будет удалён.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система компонентов на SCSS',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте мини дизайн-систему на SCSS: переменные, миксины, компоненты button и card с вариантами.',
      requirements: [
        'Файл переменных: цвета, spacing, radius, шрифты',
        'Миксин flex-center и respond-to(breakpoint)',
        'Компонент button с вариантами через @each цикл',
        'Компонент card с BEM-именованием и вложенностью',
        'Функция rem($px) для конвертации пикселей',
        'Использование @use для импорта переменных и миксинов'
      ],
      hint: 'Создайте карту цветов $colors и сгенерируйте варианты кнопок через @each. Используйте миксин respond-to для адаптивности карточек.',
      expectedOutput: 'SCSS-система с переменными, миксинами, генерацией утилит и двумя компонентами: кнопка (4 варианта) и карточка (адаптивная).',
      solution: '// _variables.scss\n$colors: (\n  primary: #3b82f6,\n  secondary: #8b5cf6,\n  success: #22c55e,\n  danger: #ef4444,\n);\n\n$spacing: 1rem;\n$radius: 8px;\n$font-family: "Inter", system-ui, sans-serif;\n\n// _functions.scss\n@function rem($px) {\n  @return calc($px / 16) * 1rem;\n}\n\n// _mixins.scss\n@mixin flex-center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n@mixin respond-to($bp) {\n  @if $bp == sm { @media (min-width: 640px) { @content; } }\n  @if $bp == md { @media (min-width: 768px) { @content; } }\n  @if $bp == lg { @media (min-width: 1024px) { @content; } }\n}\n\n// _button.scss\n.btn {\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: $radius;\n  cursor: pointer;\n  font-family: $font-family;\n  font-size: rem(16);\n  transition: filter 0.2s;\n\n  &:hover { filter: brightness(0.9); }\n\n  @each $name, $color in $colors {\n    &--#{$name} {\n      background: $color;\n      color: white;\n    }\n  }\n\n  &--lg {\n    padding: 0.75rem 1.5rem;\n    font-size: rem(18);\n  }\n}\n\n// _card.scss\n.card {\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: $radius;\n  overflow: hidden;\n\n  &__image {\n    width: 100%;\n    height: 200px;\n    object-fit: cover;\n  }\n\n  &__body {\n    padding: $spacing * 1.5;\n  }\n\n  &__title {\n    font-size: rem(20);\n    font-weight: 600;\n    margin-bottom: $spacing * 0.5;\n  }\n\n  @include respond-to(md) {\n    display: flex;\n\n    &__image {\n      width: 250px;\n      height: auto;\n    }\n  }\n}',
      explanation: 'Переменные хранят дизайн-токены. Функция rem() упрощает конвертацию. @each генерирует варианты кнопок из карты цветов. BEM-вложенность через & создаёт чистую структуру. Миксин respond-to инкапсулирует breakpoints.'
    }
  ]
}
