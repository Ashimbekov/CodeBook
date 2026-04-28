export default {
  id: 14,
  title: 'CSS переменные',
  description: 'Custom properties, тематизация, тёмная тема и динамические стили.',
  lessons: [
    {
      id: 1,
      title: 'Основы CSS-переменных',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные (custom properties) позволяют хранить значения и переиспользовать их по всему стилевому файлу. Они каскадируются и наследуются, как обычные свойства.' },
        { type: 'heading', value: 'Объявление и использование' },
        { type: 'code', language: 'css', value: '/* Объявление: имя начинается с -- */\n:root {\n  --color-primary: #3b82f6;\n  --color-secondary: #8b5cf6;\n  --spacing-sm: 0.5rem;\n  --spacing-md: 1rem;\n  --spacing-lg: 2rem;\n  --radius: 8px;\n  --shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n/* Использование: var(--name) */\n.button {\n  background: var(--color-primary);\n  padding: var(--spacing-sm) var(--spacing-md);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n}\n\n/* Значение по умолчанию (fallback) */\n.card {\n  color: var(--card-color, #333);  /* если --card-color не задана */\n  padding: var(--card-padding, 1rem);\n}' },
        { type: 'heading', value: 'Каскадирование и переопределение' },
        { type: 'code', language: 'css', value: '/* Переменные каскадируются! */\n:root {\n  --color-primary: #3b82f6;\n}\n\n.dark-section {\n  --color-primary: #60a5fa;  /* переопределяем для секции */\n}\n\n/* Все элементы внутри .dark-section используют новый цвет */\n.button {\n  background: var(--color-primary);  /* #3b82f6 или #60a5fa */\n}\n\n/* Переменные на уровне компонента */\n.card {\n  --card-bg: white;\n  --card-padding: 1.5rem;\n  background: var(--card-bg);\n  padding: var(--card-padding);\n}\n\n.card.compact {\n  --card-padding: 0.75rem;  /* компактная версия */\n}' },
        { type: 'tip', value: 'Определяйте переменные в :root для глобальных значений. Для компонентных — на самом компоненте. Это создаёт чистую архитектуру стилей.' }
      ]
    },
    {
      id: 2,
      title: 'Дизайн-токены через переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дизайн-токены — это «язык» дизайн-системы: цвета, отступы, шрифты, тени, скругления. CSS-переменные идеально подходят для их реализации.' },
        { type: 'heading', value: 'Полная система токенов' },
        { type: 'code', language: 'css', value: ':root {\n  /* Цвета */\n  --color-blue-50: #eff6ff;\n  --color-blue-100: #dbeafe;\n  --color-blue-500: #3b82f6;\n  --color-blue-600: #2563eb;\n  --color-blue-900: #1e3a8a;\n\n  /* Семантические цвета */\n  --color-primary: var(--color-blue-500);\n  --color-primary-hover: var(--color-blue-600);\n  --color-success: #22c55e;\n  --color-error: #ef4444;\n  --color-warning: #f59e0b;\n\n  /* Текст */\n  --color-text: #1e293b;\n  --color-text-secondary: #64748b;\n  --color-text-muted: #94a3b8;\n\n  /* Фоны */\n  --color-bg: #ffffff;\n  --color-bg-secondary: #f8fafc;\n  --color-bg-tertiary: #f1f5f9;\n  --color-border: #e2e8f0;\n\n  /* Отступы */\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n  --space-12: 3rem;\n\n  /* Скругления */\n  --radius-sm: 4px;\n  --radius-md: 8px;\n  --radius-lg: 12px;\n  --radius-full: 9999px;\n\n  /* Тени */\n  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);\n  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);\n  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);\n}' },
        { type: 'heading', value: 'Использование токенов' },
        { type: 'code', language: 'css', value: '.card {\n  background: var(--color-bg);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-lg);\n  padding: var(--space-6);\n  box-shadow: var(--shadow-sm);\n}\n\n.card:hover {\n  box-shadow: var(--shadow-md);\n}\n\n.card-title {\n  color: var(--color-text);\n  margin-bottom: var(--space-2);\n}\n\n.card-description {\n  color: var(--color-text-secondary);\n}' },
        { type: 'note', value: 'Двухуровневая система: примитивные токены (blue-500) и семантические (color-primary). Это позволяет легко менять палитру, не трогая компоненты.' }
      ]
    },
    {
      id: 3,
      title: 'Тёмная тема',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные делают переключение темы тривиальным: достаточно переопределить переменные, и вся страница изменится.' },
        { type: 'heading', value: 'Тёмная тема через media query' },
        { type: 'code', language: 'css', value: '/* Светлая тема (по умолчанию) */\n:root {\n  --color-bg: #ffffff;\n  --color-bg-secondary: #f8fafc;\n  --color-text: #1e293b;\n  --color-text-secondary: #64748b;\n  --color-border: #e2e8f0;\n  --color-primary: #3b82f6;\n  --shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n/* Тёмная тема — автоматически по системным настройкам */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --color-bg: #0f172a;\n    --color-bg-secondary: #1e293b;\n    --color-text: #e2e8f0;\n    --color-text-secondary: #94a3b8;\n    --color-border: #334155;\n    --color-primary: #60a5fa;\n    --shadow: 0 1px 3px rgba(0,0,0,0.3);\n  }\n}\n\n/* Все компоненты автоматически обновятся! */\n.card {\n  background: var(--color-bg);\n  color: var(--color-text);\n  border: 1px solid var(--color-border);\n}' },
        { type: 'heading', value: 'Тёмная тема через CSS-класс (переключатель)' },
        { type: 'code', language: 'css', value: '/* Класс .dark на <html> или <body> */\n:root {\n  --color-bg: #ffffff;\n  --color-text: #1e293b;\n}\n\n.dark {\n  --color-bg: #0f172a;\n  --color-text: #e2e8f0;\n}\n\n/* Или через data-атрибут */\n[data-theme="dark"] {\n  --color-bg: #0f172a;\n  --color-text: #e2e8f0;\n}\n\n/* Комбинация: авто + ручное переключение */\n:root {\n  --color-bg: #ffffff;\n  --color-text: #1e293b;\n  color-scheme: light dark;  /* поддержка нативных элементов */\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not(.light) {\n    --color-bg: #0f172a;\n    --color-text: #e2e8f0;\n  }\n}\n\n.dark {\n  --color-bg: #0f172a;\n  --color-text: #e2e8f0;\n}' },
        { type: 'tip', value: 'Используйте color-scheme: light dark — это автоматически стилизует нативные элементы (scrollbar, input, select) под тёмную тему.' }
      ]
    },
    {
      id: 4,
      title: 'Вычисления и динамика',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные можно использовать в calc(), менять через JavaScript и создавать динамические стили, реагирующие на действия пользователя.' },
        { type: 'heading', value: 'Переменные в вычислениях' },
        { type: 'code', language: 'css', value: '/* calc() с переменными */\n:root {\n  --header-height: 64px;\n  --sidebar-width: 250px;\n}\n\n.main {\n  height: calc(100vh - var(--header-height));\n  width: calc(100% - var(--sidebar-width));\n  margin-left: var(--sidebar-width);\n}\n\n/* Адаптивный spacing */\n:root {\n  --base-spacing: 1rem;\n}\n\n.card {\n  padding: var(--base-spacing);\n  margin-bottom: calc(var(--base-spacing) * 1.5);\n  gap: calc(var(--base-spacing) * 0.5);\n}\n\n/* Цветовые вариации через HSL */\n:root {\n  --hue: 217;\n  --sat: 91%;\n}\n\n.primary { background: hsl(var(--hue) var(--sat) 60%); }\n.light   { background: hsl(var(--hue) var(--sat) 95%); }\n.dark    { background: hsl(var(--hue) var(--sat) 20%); }' },
        { type: 'heading', value: 'Управление через JavaScript' },
        { type: 'code', language: 'html', value: '<script>\n// Установить переменную\ndocument.documentElement.style.setProperty(\'--color-primary\', \'#ef4444\');\n\n// Прочитать переменную\nconst primary = getComputedStyle(document.documentElement)\n  .getPropertyValue(\'--color-primary\');\n\n// Динамическая тема\nfunction setTheme(hue) {\n  document.documentElement.style.setProperty(\'--hue\', hue);\n}\n\n// Следование за курсором\ndocument.addEventListener(\'mousemove\', (e) => {\n  const x = e.clientX / window.innerWidth;\n  const y = e.clientY / window.innerHeight;\n  document.documentElement.style.setProperty(\'--mouse-x\', x);\n  document.documentElement.style.setProperty(\'--mouse-y\', y);\n});\n</script>' },
        { type: 'tip', value: 'CSS-переменные + JavaScript — мощная комбинация. Задайте динамические значения через JS (позиция мыши, скролл), а CSS позаботится об анимациях и стилях.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны компонентного CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные позволяют создавать гибкие компоненты с внутренним API. Вместо множества классов-модификаторов используйте переменные.' },
        { type: 'heading', value: 'Компонент с API через переменные' },
        { type: 'code', language: 'css', value: '/* Кнопка с кастомизируемым API */\n.btn {\n  --btn-bg: #3b82f6;\n  --btn-color: white;\n  --btn-padding: 0.5rem 1rem;\n  --btn-radius: 6px;\n  --btn-size: 1rem;\n\n  background: var(--btn-bg);\n  color: var(--btn-color);\n  padding: var(--btn-padding);\n  border-radius: var(--btn-radius);\n  font-size: var(--btn-size);\n  border: none;\n  cursor: pointer;\n  transition: filter 0.2s;\n}\n\n.btn:hover { filter: brightness(0.9); }\n\n/* Варианты — просто переопределяем переменные */\n.btn-secondary {\n  --btn-bg: #6b7280;\n}\n\n.btn-danger {\n  --btn-bg: #ef4444;\n}\n\n.btn-outline {\n  --btn-bg: transparent;\n  --btn-color: #3b82f6;\n  border: 2px solid currentColor;\n}\n\n.btn-lg {\n  --btn-padding: 0.75rem 1.5rem;\n  --btn-size: 1.125rem;\n}\n\n.btn-sm {\n  --btn-padding: 0.25rem 0.75rem;\n  --btn-size: 0.875rem;\n}' },
        { type: 'heading', value: 'Inline-кастомизация' },
        { type: 'code', language: 'html', value: '<!-- Кастомизация через style -->\n<button class="btn" style="--btn-bg: #8b5cf6;">Фиолетовая</button>\n<button class="btn" style="--btn-radius: 9999px;">Круглая</button>\n\n<!-- Stagger-анимация -->\n<div class="card" style="--i: 0">Карта 1</div>\n<div class="card" style="--i: 1">Карта 2</div>\n<div class="card" style="--i: 2">Карта 3</div>' },
        { type: 'code', language: 'css', value: '.card {\n  animation: fadeIn 0.3s ease forwards;\n  animation-delay: calc(var(--i, 0) * 100ms);\n}' },
        { type: 'tip', value: 'Компонентный подход через CSS-переменные — альтернатива BEM-модификаторам. Вместо .btn--large, .btn--small задайте --btn-padding, --btn-size на компоненте.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тематизируемый UI Kit',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте мини UI-kit с CSS-переменными: кнопки, карточки, inputs — с поддержкой тёмной темы и кастомных цветов.',
      requirements: [
        'Система дизайн-токенов в :root (цвета, spacing, radius, shadows)',
        'Тёмная тема через @media (prefers-color-scheme: dark)',
        'Класс .dark для ручного переключения',
        'Кнопки с вариантами через переменные (primary, secondary, danger)',
        'Карточка с --card-bg, --card-padding переменными',
        'Input с фокусным стилем через переменные'
      ],
      hint: 'Создайте два слоя: примитивные токены (--blue-500) и семантические (--color-primary). Темизация меняет только семантические.',
      expectedOutput: 'UI-kit с кнопками, карточками и полями ввода, автоматически переключающийся на тёмную тему.',
      solution: ':root {\n  --blue-500: #3b82f6;\n  --blue-600: #2563eb;\n  --red-500: #ef4444;\n  --gray-500: #6b7280;\n\n  --color-primary: var(--blue-500);\n  --color-primary-hover: var(--blue-600);\n  --color-danger: var(--red-500);\n  --color-bg: #ffffff;\n  --color-bg-card: #ffffff;\n  --color-bg-input: #ffffff;\n  --color-text: #1e293b;\n  --color-text-secondary: #64748b;\n  --color-border: #e2e8f0;\n  --shadow: 0 1px 3px rgba(0,0,0,0.1);\n  --radius: 8px;\n  --space: 1rem;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not(.light) {\n    --color-bg: #0f172a;\n    --color-bg-card: #1e293b;\n    --color-bg-input: #1e293b;\n    --color-text: #e2e8f0;\n    --color-text-secondary: #94a3b8;\n    --color-border: #334155;\n    --shadow: 0 1px 3px rgba(0,0,0,0.3);\n  }\n}\n\n.dark {\n  --color-bg: #0f172a;\n  --color-bg-card: #1e293b;\n  --color-bg-input: #1e293b;\n  --color-text: #e2e8f0;\n  --color-text-secondary: #94a3b8;\n  --color-border: #334155;\n}\n\nbody {\n  background: var(--color-bg);\n  color: var(--color-text);\n}\n\n.btn {\n  --btn-bg: var(--color-primary);\n  --btn-color: white;\n  background: var(--btn-bg);\n  color: var(--btn-color);\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: var(--radius);\n  cursor: pointer;\n  transition: filter 0.2s;\n}\n\n.btn:hover { filter: brightness(0.9); }\n.btn-danger { --btn-bg: var(--color-danger); }\n.btn-secondary { --btn-bg: var(--gray-500); }\n\n.card {\n  background: var(--color-bg-card);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius);\n  padding: var(--space);\n  box-shadow: var(--shadow);\n}\n\n.input {\n  width: 100%;\n  padding: 0.5rem 1rem;\n  background: var(--color-bg-input);\n  color: var(--color-text);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius);\n}\n\n.input:focus {\n  border-color: var(--color-primary);\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);\n}',
      explanation: 'Примитивные токены (blue-500) не меняются. Семантические (color-primary, color-bg) переопределяются в тёмной теме. Компоненты используют только семантические токены, поэтому автоматически адаптируются к теме.'
    }
  ]
}
