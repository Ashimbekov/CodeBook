export default {
  id: 16,
  title: 'CSS Architecture',
  description: 'BEM, OOCSS, SMACSS, CSS Modules — методологии организации CSS-кода.',
  lessons: [
    {
      id: 1,
      title: 'Проблемы масштабирования CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'В больших проектах CSS становится хаосом: конфликты имён, неожиданные переопределения, мёртвый код, нарастающая сложность. Методологии решают эти проблемы.' },
        { type: 'heading', value: 'Типичные проблемы' },
        { type: 'code', language: 'css', value: '/* ❌ Проблема 1: Глобальные имена конфликтуют */\n.title { font-size: 2rem; }  /* главная страница */\n.title { font-size: 1.2rem; }  /* карточка — перебивает! */\n\n/* ❌ Проблема 2: Каскад ломает стили */\n.sidebar .menu .item a { color: blue; }\n/* Новый разработчик добавляет: */\n.item a { color: red; }  /* не работает — меньше специфичность */\n\n/* ❌ Проблема 3: Никто не удаляет старые стили */\n.old-header { ... }  /* не используется, но боимся удалить */\n\n/* ❌ Проблема 4: Зависимость от структуры HTML */\n.sidebar > ul > li > a { }  /* сломается при изменении разметки */' },
        { type: 'heading', value: 'Принципы хорошей CSS-архитектуры' },
        { type: 'list', value: [
          'Предсказуемость — изменение одного стиля не ломает другие',
          'Переиспользуемость — компоненты работают в любом контексте',
          'Поддерживаемость — легко найти и изменить нужный стиль',
          'Масштабируемость — добавление нового не увеличивает сложность',
          'Изолированность — стили компонента не влияют на другие'
        ]},
        { type: 'note', value: 'Нет «лучшей» методологии — есть подходящая для вашего проекта. Главное — выбрать одну и следовать ей последовательно.' }
      ]
    },
    {
      id: 2,
      title: 'BEM — Block Element Modifier',
      type: 'theory',
      content: [
        { type: 'text', value: 'BEM — самая популярная методология именования классов. Каждое имя состоит из трёх частей: Блок (компонент), Элемент (часть блока), Модификатор (вариант).' },
        { type: 'heading', value: 'Синтаксис BEM' },
        { type: 'code', language: 'css', value: '/* Блок — самостоятельный компонент */\n.card { }\n.button { }\n.menu { }\n\n/* Элемент — часть блока, отделяется __ */\n.card__title { }\n.card__image { }\n.card__body { }\n.menu__item { }\n\n/* Модификатор — вариант, отделяется -- */\n.card--featured { }\n.button--primary { }\n.button--large { }\n.menu__item--active { }' },
        { type: 'heading', value: 'Пример: Карточка в BEM' },
        { type: 'code', language: 'html', value: '<div class="card card--featured">\n  <img class="card__image" src="..." alt="...">\n  <div class="card__body">\n    <h3 class="card__title">Заголовок</h3>\n    <p class="card__text">Описание карточки</p>\n    <button class="card__button button button--primary">Подробнее</button>\n  </div>\n</div>' },
        { type: 'code', language: 'css', value: '.card {\n  background: white;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n.card--featured {\n  border: 2px solid #3b82f6;\n}\n\n.card__image {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;\n}\n\n.card__body {\n  padding: 1.5rem;\n}\n\n.card__title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n\n.card__text {\n  color: #64748b;\n  margin-bottom: 1rem;\n}' },
        { type: 'heading', value: 'Правила BEM' },
        { type: 'list', value: [
          'Не вкладывайте элементы: card__body__title — НЕПРАВИЛЬНО. Используйте card__title',
          'Модификатор не существует без блока: <div class="card--featured"> — НЕПРАВИЛЬНО',
          'Не привязывайте стили к тегам: .card p — НЕПРАВИЛЬНО, .card__text — ПРАВИЛЬНО',
          'Один блок = один компонент. Блоки независимы друг от друга'
        ]},
        { type: 'tip', value: 'BEM выглядит длинно, но это его сила: card__title однозначно указывает, что это заголовок карточки. Нет конфликтов, нет сюрпризов.' }
      ]
    },
    {
      id: 3,
      title: 'OOCSS и SMACSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'OOCSS (Object-Oriented CSS) — разделение структуры и оформления. SMACSS (Scalable and Modular Architecture for CSS) — категоризация стилей по типам.' },
        { type: 'heading', value: 'OOCSS — объектно-ориентированный CSS' },
        { type: 'code', language: 'css', value: '/* Принцип 1: Отделение структуры от оформления */\n/* Структура (layout) */\n.media {\n  display: flex;\n  gap: 1rem;\n}\n\n.media__image {\n  flex-shrink: 0;\n}\n\n.media__body {\n  flex: 1;\n}\n\n/* Оформление (skin) — отдельно */\n.theme-light {\n  background: white;\n  border: 1px solid #e5e7eb;\n}\n\n.theme-dark {\n  background: #1e293b;\n  color: white;\n}\n\n/* Принцип 2: Отделение контейнера от контента */\n/* ❌ Плохо — привязка к контейнеру */\n.sidebar h2 { font-size: 1.2rem; }\n\n/* ✅ Хорошо — независимый компонент */\n.section-title { font-size: 1.2rem; }' },
        { type: 'heading', value: 'SMACSS — категории стилей' },
        { type: 'code', language: 'css', value: '/* 1. Base — базовые стили (reset, элементы) */\nhtml { box-sizing: border-box; }\nbody { font-family: sans-serif; }\na { color: #3b82f6; }\n\n/* 2. Layout — основные структурные блоки (префикс l-) */\n.l-header { position: sticky; top: 0; }\n.l-sidebar { width: 250px; }\n.l-main { flex: 1; }\n.l-footer { padding: 2rem; }\n\n/* 3. Module — переиспользуемые компоненты */\n.card { }\n.button { }\n.alert { }\n\n/* 4. State — состояния (префикс is-) */\n.is-active { }\n.is-hidden { display: none; }\n.is-loading { opacity: 0.5; }\n.is-error { border-color: red; }\n\n/* 5. Theme — темы */\n.theme-dark .card { background: #1e293b; }' },
        { type: 'note', value: 'OOCSS и SMACSS часто комбинируют. OOCSS — принципы проектирования, SMACSS — организация файлов. BEM можно использовать для именования внутри модулей SMACSS.' }
      ]
    },
    {
      id: 4,
      title: 'CSS Modules',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS Modules — подход, где каждый CSS-файл привязан к компоненту. Имена классов автоматически становятся уникальными, исключая конфликты.' },
        { type: 'heading', value: 'Как работают CSS Modules' },
        { type: 'code', language: 'css', value: '/* Card.module.css */\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 1.5rem;\n}\n\n.title {\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n\n.description {\n  color: #64748b;\n}\n\n/* Компилятор превращает в: */\n/* .Card_card_a1b2c { ... } */\n/* .Card_title_d3e4f { ... } */\n/* .Card_description_g5h6i { ... } */' },
        { type: 'heading', value: 'Использование в React' },
        { type: 'code', language: 'html', value: '<!-- Card.jsx -->\n<script>\nimport styles from \'./Card.module.css\';\n\nfunction Card({ title, text }) {\n  return (\n    <div className={styles.card}>\n      <h3 className={styles.title}>{title}</h3>\n      <p className={styles.description}>{text}</p>\n    </div>\n  );\n}\n</script>' },
        { type: 'heading', value: 'Composing (наследование) в CSS Modules' },
        { type: 'code', language: 'css', value: '/* Button.module.css */\n.base {\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n\n.primary {\n  composes: base;  /* наследует .base */\n  background: #3b82f6;\n  color: white;\n}\n\n.secondary {\n  composes: base;\n  background: #6b7280;\n  color: white;\n}\n\n.outline {\n  composes: base;\n  background: transparent;\n  border: 2px solid #3b82f6;\n  color: #3b82f6;\n}' },
        { type: 'tip', value: 'CSS Modules — стандарт в React-проектах (Vite, Next.js). Они обеспечивают изоляцию стилей без дополнительных библиотек.' }
      ]
    },
    {
      id: 5,
      title: 'Utility-first и Atomic CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Utility-first (Atomic CSS) — подход, где каждый класс делает одну вещь. Стили собираются в HTML, а не в CSS-файлах. Tailwind CSS — главный представитель.' },
        { type: 'heading', value: 'Atomic CSS' },
        { type: 'code', language: 'css', value: '/* Каждый класс = одно свойство */\n.flex { display: flex; }\n.items-center { align-items: center; }\n.gap-4 { gap: 1rem; }\n.p-4 { padding: 1rem; }\n.bg-white { background: white; }\n.rounded-lg { border-radius: 0.5rem; }\n.shadow { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\n.text-lg { font-size: 1.125rem; }\n.font-bold { font-weight: 700; }\n.text-gray-600 { color: #4b5563; }' },
        { type: 'heading', value: 'Использование' },
        { type: 'code', language: 'html', value: '<!-- Стили собираются в HTML -->\n<div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">\n  <img class="w-12 h-12 rounded-full" src="..." alt="...">\n  <div>\n    <h3 class="text-lg font-bold">Имя пользователя</h3>\n    <p class="text-gray-600">Описание</p>\n  </div>\n</div>' },
        { type: 'heading', value: 'Utility-first vs Component-first' },
        { type: 'list', value: [
          'BEM: .card__title { font-size: 1.25rem; font-weight: 600; }',
          'Utility: class="text-xl font-semibold" — стили в HTML',
          'BEM: хорошо для статических сайтов с отделённым CSS',
          'Utility: идеален для компонентных фреймворков (React, Vue)',
          'BEM: нужно придумывать имена (.card__subtitle-wrapper)',
          'Utility: нет имён — только свойства',
          'BEM: мёртвый CSS трудно удалить',
          'Utility: только используемые классы попадают в сборку'
        ]},
        { type: 'note', value: 'Utility-first не означает отказ от компонентов. В React/Vue компоненты содержат utility-классы. Извлекайте повторяющиеся паттерны в компоненты, а не в CSS-классы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Рефакторинг в BEM',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепишите «грязный» CSS в методологию BEM: выделите блоки, элементы и модификаторы.',
      requirements: [
        'Выделите блоки: card, nav, button',
        'Назовите элементы по BEM: card__title, card__image и т.д.',
        'Создайте модификаторы: card--featured, button--primary, button--large',
        'Уберите вложенные селекторы (.sidebar .card .title → .card__title)',
        'Каждый блок — плоская структура без вложенности',
        'Не используйте селекторы тегов (h2, p) — только классы'
      ],
      hint: 'Определите независимые компоненты (блоки). Каждая часть блока — элемент с __. Варианты — модификаторы с --.',
      expectedOutput: 'Чистый CSS с BEM-именованием: плоские селекторы, без конфликтов, без зависимости от структуры HTML.',
      solution: '/* Блок: навигация */\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: white;\n}\n\n.nav__logo {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.nav__links {\n  display: flex;\n  gap: 1.5rem;\n  list-style: none;\n}\n\n.nav__link {\n  color: #374151;\n  text-decoration: none;\n}\n\n.nav__link--active {\n  color: #3b82f6;\n  font-weight: 600;\n}\n\n/* Блок: карточка */\n.card {\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  overflow: hidden;\n}\n\n.card--featured {\n  border-color: #3b82f6;\n  box-shadow: 0 4px 6px rgba(59,130,246,0.1);\n}\n\n.card__image {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;\n}\n\n.card__body {\n  padding: 1.5rem;\n}\n\n.card__title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n}\n\n.card__text {\n  color: #64748b;\n  margin-bottom: 1rem;\n}\n\n/* Блок: кнопка */\n.button {\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n\n.button--primary {\n  background: #3b82f6;\n  color: white;\n}\n\n.button--large {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.125rem;\n}',
      explanation: 'Каждый блок (nav, card, button) — независимый компонент. Элементы (nav__logo, card__title) — части блока с __. Модификаторы (card--featured, button--primary) — варианты с --. Нет вложенных селекторов — каждый класс самодостаточен.'
    }
  ]
}
