export default {
  id: 25,
  title: 'Best Practices',
  description: 'Доступность (accessibility), производительность и SEO — делаем сайты правильно',
  lessons: [
    {
      id: 1,
      title: 'Доступность (Accessibility / a11y)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Доступность — создание сайтов, которыми могут пользоваться все люди, включая тех с ограниченными возможностями (слепые, слабовидящие, люди с нарушениями моторики).' },
        { type: 'heading', value: 'Основные принципы (WCAG)' },
        { type: 'list', items: [
          'Воспринимаемость — контент воспринимается разными способами (alt для изображений)',
          'Управляемость — навигация с клавиатуры, достаточно времени',
          'Понятность — понятный язык, предсказуемое поведение',
          'Надёжность — работает в разных браузерах и с ассистивными технологиями'
        ]},
        { type: 'code', language: 'html', value: '<!-- Правильные alt для изображений -->\n<img src="chart.png" alt="График роста продаж за 2024 год">\n<img src="decorative.png" alt="">  <!-- Декоративное — пустой alt -->\n\n<!-- ARIA-роли и атрибуты -->\n<button aria-label="Закрыть" aria-expanded="false">\n  <svg>...</svg>\n</button>\n\n<!-- Структура с правильными заголовками -->\n<main>\n  <h1>Главный заголовок</h1>\n  <section aria-labelledby="section-title">\n    <h2 id="section-title">Раздел</h2>\n  </section>\n</main>\n\n<!-- Skip-ссылка для клавиатурной навигации -->\n<a href="#main-content" class="skip-link">Перейти к содержимому</a>' }
      ]
    },
    {
      id: 2,
      title: 'Доступность: цвет, фокус, клавиатура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цветовой контраст, видимость фокуса и поддержка клавиатуры — три важнейших аспекта доступности.' },
        { type: 'code', language: 'css', value: '/* Контраст: минимум 4.5:1 для обычного текста */\n/* Используй инструменты: WebAIM Contrast Checker */\n\n.good-contrast {\n  color: #333333;           /* тёмный текст */\n  background: #ffffff;      /* белый фон */\n  /* Контраст: 12.63:1 — отлично */\n}\n\n/* Видимый фокус — ОБЯЗАТЕЛЬНО! */\n:focus-visible {\n  outline: 3px solid #005fcc;\n  outline-offset: 2px;\n  border-radius: 2px;\n}\n\n/* Никогда не делай это без замены! */\n/* :focus { outline: none; } — ломает доступность */\n\n/* Достаточный размер кликабельного элемента (44x44px min) */\n.touch-target {\n  min-width: 44px;\n  min-height: 44px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Hover ≠ Focus: оба состояния важны */\n.link:hover, .link:focus-visible {\n  text-decoration: underline;\n}' }
      ]
    },
    {
      id: 3,
      title: 'SEO: оптимизация для поисковиков',
      type: 'theory',
      content: [
        { type: 'text', value: 'SEO (Search Engine Optimization) — оптимизация сайта для высоких позиций в поисковых системах.' },
        { type: 'code', language: 'html', value: '<!-- Базовые мета-теги -->\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  \n  <!-- Описание для поисковиков -->\n  <title>Купить ноутбук в Алматы | Магазин TechShop</title>\n  <meta name="description" content="Большой выбор ноутбуков в Алматы. Доставка 1-2 дня. Гарантия 2 года.">\n  \n  <!-- Open Graph для социальных сетей -->\n  <meta property="og:title" content="TechShop — ноутбуки">\n  <meta property="og:description" content="Лучшие цены на ноутбуки">\n  <meta property="og:image" content="https://example.com/og-image.jpg">\n  <meta property="og:url" content="https://example.com">\n  <meta property="og:type" content="website">\n  \n  <!-- Canonical URL -->\n  <link rel="canonical" href="https://example.com/laptops">\n</head>\n\n<!-- Структурированные данные JSON-LD -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Ноутбук Apple MacBook Pro",\n  "price": "450000"\n}\n</script>' }
      ]
    },
    {
      id: 4,
      title: 'Производительность: основные принципы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Быстрые сайты — лучший UX и лучший SEO. Google использует скорость как сигнал ранжирования.' },
        { type: 'heading', value: 'Core Web Vitals' },
        { type: 'list', items: [
          'LCP (Largest Contentful Paint) — когда виден главный контент. Цель: < 2.5 сек',
          'FID (First Input Delay) — время отклика на первое действие. Цель: < 100 мс',
          'CLS (Cumulative Layout Shift) — смещение макета. Цель: < 0.1'
        ]},
        { type: 'code', language: 'html', value: '<!-- Оптимизация изображений -->\n<img src="hero.webp" alt="..." loading="lazy" decoding="async"\n     width="800" height="400">\n<!-- width/height предотвращают CLS -->\n<!-- loading="lazy" откладывает загрузку вне экрана -->\n\n<!-- Предзагрузка критичных ресурсов -->\n<link rel="preload" href="font.woff2" as="font" crossorigin>\n<link rel="preload" href="hero.webp" as="image">\n\n<!-- defer/async для JS -->\n<script src="app.js" defer></script>  <!-- после парсинга HTML -->\n<script src="analytics.js" async></script>  <!-- не блокирует' }
      ]
    },
    {
      id: 5,
      title: 'Чистый код и конвенции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Читаемый код — залог поддерживаемого проекта. Соблюдай конвенции и пиши код для людей, а не только для машин.' },
        { type: 'code', language: 'javascript', value: '// Понятные имена переменных\n// Плохо:\nconst d = new Date();\nconst arr = users.filter(u => u.a);\n\n// Хорошо:\nconst currentDate = new Date();\nconst activeUsers = users.filter(user => user.isActive);\n\n// Функции делают одно дело\n// Плохо:\nfunction processUserData(user) {\n  // валидирует + сохраняет + шлёт email\n}\n\n// Хорошо:\nfunction validateUser(user) { ... }\nfunction saveUser(user) { ... }\nfunction sendWelcomeEmail(user) { ... }\n\n// DRY (Don\'t Repeat Yourself)\n// Выноси повторяющийся код в функции\n\n// Magic numbers — плохо\nif (age > 18) { ... }\n// Именованные константы — хорошо\nconst LEGAL_AGE = 18;\nif (age > LEGAL_AGE) { ... }' },
        { type: 'list', items: [
          'Используй ESLint для автоматической проверки кода',
          'Используй Prettier для форматирования',
          'Camelcase для JS, kebab-case для CSS-классов',
          'Комментируй "почему", а не "что" — код говорит сам'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Безопасность: основы для фронтенда',
      type: 'theory',
      content: [
        { type: 'text', value: 'Даже на фронтенде нужно думать о безопасности.' },
        { type: 'code', language: 'javascript', value: '// XSS (Cross-Site Scripting) — вставка вредоносного JS\n// Плохо — innerHTML с пользовательским вводом\nelement.innerHTML = userInput; // ОПАСНО!\n\n// Хорошо\nelement.textContent = userInput; // безопасно\n\n// Для HTML — используй DOMPurify\nimport DOMPurify from "dompurify";\nelement.innerHTML = DOMPurify.sanitize(userInput);\n\n// CSRF защита: токены в формах\n<input type="hidden" name="csrf_token" value="...токен...">\n\n// Content Security Policy в заголовках\n// Content-Security-Policy: default-src "self"; script-src "self"\n\n// Не хранить секреты на фронтенде!\n// API ключи в .env (не в репо!)\n// Секреты только на сервере\n\n// HTTPS везде\n// Ссылки rel="noopener noreferrer" для внешних\n<a href="https://external.com" rel="noopener noreferrer" target="_blank">...' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Аудит сайта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведи аудит существующей страницы на доступность, производительность и SEO.',
      requirements: [
        'Открой Lighthouse в DevTools (вкладка Lighthouse, нажми Analyze)',
        'Проверь scores по Performance, Accessibility, Best Practices, SEO',
        'Найди минимум 3 проблемы с доступностью (alt, contrast, labels)',
        'Добавь мета-теги description и og:title',
        'Проверь наличие visible focus для клавиатурной навигации',
        'Добавь loading="lazy" к изображениям вне экрана'
      ],
      expectedOutput: 'Отчёт по аудиту с исправлениями',
      hint: 'Lighthouse в DevTools → Generate report. Красные пункты — критичные. Нажми на пункт — получишь объяснение и решение.',
      solution: '<!-- Пример исправлений после аудита Lighthouse -->\n\n<!-- Было: без meta description -->\n<!-- Стало: -->\n<meta name="description" content="Краткое описание страницы для поисковиков (150-160 символов)">\n<meta property="og:title" content="Название для соцсетей">\n\n<!-- Было: img без alt -->\n<img src="photo.jpg">\n<!-- Стало: -->\n<img src="photo.jpg" alt="Описание содержимого фотографии">\n\n<!-- Было: input без label -->\n<input type="text" placeholder="Ваше имя">\n<!-- Стало: -->\n<label for="name">Ваше имя</label>\n<input type="text" id="name" placeholder="Алина">\n\n<!-- Было: изображения без lazy loading -->\n<img src="below-fold.jpg">\n<!-- Стало: -->\n<img src="below-fold.jpg" loading="lazy" width="800" height="400" alt="...">\n\n/* CSS: видимый focus */\n:focus-visible {\n  outline: 3px solid #0055cc;\n  outline-offset: 2px;\n}',
      explanation: 'Lighthouse — встроенный инструмент Google для комплексного аудита. Score 90+ по всем категориям — хорошая цель. Доступность и SEO напрямую влияют на бизнес-результаты: больше пользователей, лучше ранжирование.'
    }
  ]
}
