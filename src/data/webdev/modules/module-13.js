export default {
  id: 13,
  title: 'CSS: переменные и современный CSS',
  description: 'CSS-переменные, псевдоклассы :has() и :is(), container queries — современные возможности CSS',
  lessons: [
    {
      id: 1,
      title: 'CSS Custom Properties (переменные)',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные (Custom Properties) позволяют хранить значения и переиспользовать их. Идеальны для тем оформления.' },
        { type: 'code', language: 'css', value: '/* Объявление переменных — обычно в :root */\n:root {\n  --color-primary: #4f46e5;\n  --color-secondary: #7c3aed;\n  --color-text: #1a1a2e;\n  --color-bg: #ffffff;\n  --spacing-sm: 8px;\n  --spacing-md: 16px;\n  --spacing-lg: 32px;\n  --border-radius: 8px;\n  --font-size-base: 16px;\n  --font-family: "Inter", Arial, sans-serif;\n}\n\n/* Использование */\n.button {\n  background: var(--color-primary);\n  padding: var(--spacing-sm) var(--spacing-md);\n  border-radius: var(--border-radius);\n  font-size: var(--font-size-base);\n}\n\n/* Запасное значение */\n.box {\n  color: var(--color-accent, orange); /* если --color-accent не задан */\n}\n\n/* Тёмная тема */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --color-text: #ffffff;\n    --color-bg: #1a1a2e;\n  }\n}' },
        { type: 'tip', value: 'CSS-переменные наследуются! Задай переменные в :root для глобального эффекта, или в конкретном компоненте для локальных изменений.' }
      ]
    },
    {
      id: 2,
      title: 'Тёмная тема с CSS-переменными',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS-переменные делают реализацию тёмной темы элегантной — достаточно изменить переменные.' },
        { type: 'code', language: 'css', value: ':root {\n  --bg: #ffffff;\n  --text: #1a1a1a;\n  --card-bg: #f5f5f5;\n  --border: #e0e0e0;\n  --shadow: rgba(0, 0, 0, 0.1);\n}\n\n/* Тёмная тема по системной настройке */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: #0f0f1a;\n    --text: #e8e8f0;\n    --card-bg: #1a1a2e;\n    --border: #2d2d44;\n    --shadow: rgba(0, 0, 0, 0.4);\n  }\n}\n\n/* Тёмная тема по классу (для ручного переключения) */\n[data-theme="dark"] {\n  --bg: #0f0f1a;\n  --text: #e8e8f0;\n  --card-bg: #1a1a2e;\n}\n\n/* Применение — одинаково для светлой и тёмной */\nbody {\n  background: var(--bg);\n  color: var(--text);\n}\n\n.card {\n  background: var(--card-bg);\n  border: 1px solid var(--border);\n  box-shadow: 0 2px 8px var(--shadow);\n}' },
        { type: 'tip', value: 'Два подхода к тёмной теме: @media (prefers-color-scheme: dark) — автоматически по системным настройкам; [data-theme="dark"] — ручное переключение через JavaScript. Реализуй оба для максимального удобства пользователей.' },
        { type: 'list', items: [
          'Определи все цвета через переменные — никаких хардкодированных hex-значений',
          'Не только цвета — тени тоже должны меняться (светлые тени не работают в тёмной теме)',
          'Добавь плавный переход: body { transition: background 0.3s, color 0.3s; }',
          'Сохраняй выбор пользователя в localStorage и применяй при загрузке страницы'
        ]},
        { type: 'note', value: 'Изображения и иконки тоже нуждаются в адаптации. CSS фильтр invert(1) для иконок в тёмной теме — быстрое решение, но лучше иметь отдельные версии для каждой темы.' }
      ]
    },
    {
      id: 3,
      title: ':is() и :where() — группировка селекторов',
      type: 'theory',
      content: [
        { type: 'text', value: ':is() и :where() позволяют группировать несколько селекторов в одном правиле. :is() учитывает специфичность, :where() — нет.' },
        { type: 'code', language: 'css', value: '/* Без :is() — многословно */\nh1 a, h2 a, h3 a, h4 a {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* С :is() — элегантно */\n:is(h1, h2, h3, h4) a {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* :where() — то же самое, но специфичность = 0 */\n:where(h1, h2, h3, h4) a {\n  color: inherit; /* легко перебить без !important */\n}\n\n/* Практический пример */\n:is(button, a, input):focus-visible {\n  outline: 2px solid var(--color-primary);\n  outline-offset: 2px;\n}\n\n/* Сложные вложенные селекторы */\n:is(.card, .panel, .modal) :is(h2, h3) {\n  margin-top: 0;\n}' },
        { type: 'heading', value: 'Разница между :is() и :where()' },
        { type: 'list', items: [
          ':is(h1, .class, #id) — специфичность = максимум из списка (h1+class = 0,1,1)',
          ':where(h1, .class, #id) — специфичность всегда 0 (легко перебить)',
          ':is() — для стилей с нормальным весом',
          ':where() — для базовых стилей в CSS reset или библиотеках'
        ]},
        { type: 'tip', value: 'Используй :where() в CSS reset и базовых стилях компонентов — нулевая специфичность позволяет пользователям легко переопределять стили без !important. :is() подходит для обычного кода.' }
      ]
    },
    {
      id: 4,
      title: ':has() — родительский селектор',
      type: 'theory',
      content: [
        { type: 'text', value: ':has() — революционный псевдокласс. Позволяет стилизовать элемент на основе его содержимого. "Родительский селектор", о котором мечтали годами.' },
        { type: 'code', language: 'css', value: '/* Форма, у которой есть невалидный input */\nform:has(input:invalid) {\n  border: 2px solid red;\n}\n\n/* Карточка с изображением — другие стили */\n.card:has(img) {\n  padding: 0;\n}\n.card:not(:has(img)) {\n  padding: 24px;\n}\n\n/* Меню, которое имеет открытый подпункт */\n.nav-item:has(.submenu:hover) {\n  background: rgba(255,255,255,0.1);\n}\n\n/* Параграф, который содержит ссылку */\np:has(a) {\n  font-weight: 500;\n}\n\n/* Секция без заголовка */\nsection:not(:has(h2)) {\n  border-top: 1px solid #eee;\n}\n\n/* Применение для layout */\n.grid:has(.wide-item) {\n  grid-template-columns: repeat(3, 1fr);\n}' },
        { type: 'tip', value: ':has() поддерживается во всех современных браузерах с 2023. Это настоящий прорыв — можно стилизовать контейнер в зависимости от его содержимого.' }
      ]
    },
    {
      id: 5,
      title: 'Container Queries',
      type: 'theory',
      content: [
        { type: 'text', value: 'Container Queries позволяют стилизовать компонент в зависимости от размера его контейнера, а не окна браузера. Революция в создании компонентов!' },
        { type: 'code', language: 'css', value: '/* 1. Объявить контейнер */\n.card-wrapper {\n  container-type: inline-size;\n  container-name: card;\n}\n\n/* 2. Задать стили в зависимости от размера контейнера */\n@container card (min-width: 400px) {\n  .card {\n    display: flex;\n    flex-direction: row;\n  }\n  .card img {\n    width: 40%;\n  }\n}\n\n@container (min-width: 600px) {\n  .card h2 {\n    font-size: 1.5rem;\n  }\n}\n\n/* Единицы контейнера */\n.card-title {\n  font-size: 5cqi;  /* 5% от ширины inline-контейнера */\n  padding: 2cqb;    /* 2% от высоты контейнера */\n}' },
        { type: 'note', value: 'Разница media queries vs container queries:\n- @media — "сделай это, когда ОКНО БРАУЗЕРА имеет такую ширину"\n- @container — "сделай это, когда РОДИТЕЛЬСКИЙ БЛОК имеет такую ширину"\nContainers делают компоненты по-настоящему переиспользуемыми.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тема оформления с CSS-переменными',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему дизайна с CSS-переменными и возможностью переключения светлой/тёмной темы.',
      requirements: [
        'Задай CSS-переменные в :root для светлой темы',
        'Добавь тёмную тему через [data-theme="dark"]',
        'Кнопка переключения темы (JavaScript меняет data-theme на html)',
        'Все цвета через переменные (нет хардкода)',
        'Используй :has() хотя бы в одном месте',
        'Плавный переход между темами (transition)'
      ],
      expectedOutput: 'Страница с переключением светлой/тёмной темы',
      hint: 'document.documentElement.setAttribute("data-theme", "dark") — это способ переключить тему через JS.',
      solution: '/* CSS */\n:root {\n  --bg: #ffffff;\n  --surface: #f5f7fa;\n  --text: #1a1a2e;\n  --text-muted: #666;\n  --primary: #4f46e5;\n  --border: #e2e8f0;\n  --radius: 10px;\n}\n\n[data-theme="dark"] {\n  --bg: #0f0f1a;\n  --surface: #1a1a2e;\n  --text: #e8e8f8;\n  --text-muted: #9090a0;\n  --primary: #818cf8;\n  --border: #2d2d44;\n}\n\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: Arial, sans-serif;\n  transition: background 0.3s, color 0.3s;\n  padding: 24px;\n}\n\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 24px;\n  margin-bottom: 16px;\n}\n\n/* :has() — карточка с картинкой без padding */\n.card:has(img) {\n  padding: 0;\n  overflow: hidden;\n}\n\n.btn-theme {\n  padding: 10px 20px;\n  background: var(--primary);\n  color: white;\n  border: none;\n  border-radius: var(--radius);\n  cursor: pointer;\n  font-size: 14px;\n}\n\n/* JavaScript */\n// const btn = document.getElementById("themeBtn");\n// btn.addEventListener("click", () => {\n//   const html = document.documentElement;\n//   const isDark = html.getAttribute("data-theme") === "dark";\n//   html.setAttribute("data-theme", isDark ? "light" : "dark");\n// });',
      explanation: 'CSS-переменные — основа масштабируемых систем дизайна. Меняя несколько переменных в :root или [data-theme], мы перекрашиваем весь сайт. :has() позволяет адаптировать стили контейнера к его содержимому без JS.'
    }
  ]
}
