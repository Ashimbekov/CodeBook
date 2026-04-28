export default {
  id: 8,
  title: 'Адаптивная вёрстка',
  description: 'Media queries, mobile-first подход, breakpoints, единицы измерения и контейнерные запросы.',
  lessons: [
    {
      id: 1,
      title: 'Media queries: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Media queries позволяют применять CSS-правила в зависимости от характеристик устройства: ширины экрана, ориентации, разрешения, цветовой схемы.' },
        { type: 'heading', value: 'Синтаксис media queries' },
        { type: 'code', language: 'css', value: '/* Базовый синтаксис */\n@media (min-width: 768px) {\n  .container {\n    max-width: 720px;\n  }\n}\n\n/* Комбинация условий */\n@media (min-width: 768px) and (max-width: 1023px) {\n  /* Только планшеты */\n}\n\n/* Ориентация */\n@media (orientation: landscape) {\n  .hero { height: 50vh; }\n}\n\n@media (orientation: portrait) {\n  .hero { height: 80vh; }\n}\n\n/* Тёмная тема */\n@media (prefers-color-scheme: dark) {\n  body { background: #0f172a; color: #e2e8f0; }\n}\n\n/* Уменьшенные анимации */\n@media (prefers-reduced-motion: reduce) {\n  * { animation-duration: 0.01ms !important; }\n}' },
        { type: 'heading', value: 'Современный синтаксис (Range)' },
        { type: 'code', language: 'css', value: '/* Новый синтаксис (поддержка: Chrome 104+, Firefox 63+, Safari 16.4+) */\n@media (width >= 768px) {\n  /* планшеты и больше */\n}\n\n@media (768px <= width < 1024px) {\n  /* только планшеты */\n}\n\n@media (width < 768px) {\n  /* только мобильные */\n}' },
        { type: 'tip', value: 'Используйте min-width для mobile-first подхода: базовые стили для мобильных, затем расширяйте для больших экранов через min-width.' }
      ]
    },
    {
      id: 2,
      title: 'Mobile-first подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mobile-first — подход, где базовые стили пишутся для мобильных устройств, а затем расширяются для больших экранов через min-width. Это стандарт индустрии.' },
        { type: 'heading', value: 'Desktop-first vs Mobile-first' },
        { type: 'code', language: 'css', value: '/* ❌ Desktop-first (не рекомендуется) */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}\n\n@media (max-width: 1023px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (max-width: 767px) {\n  .grid { grid-template-columns: 1fr; }\n}\n\n/* ✅ Mobile-first (рекомендуется) */\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;  /* мобильные: 1 колонка */\n}\n\n@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }  /* планшеты */\n}\n\n@media (min-width: 1024px) {\n  .grid { grid-template-columns: repeat(4, 1fr); }  /* десктоп */\n}' },
        { type: 'heading', value: 'Преимущества mobile-first' },
        { type: 'list', value: [
          'Мобильный CSS проще и легче — быстрая загрузка на слабых устройствах',
          'Прогрессивное усложнение вместо деградации',
          'Легче поддерживать — добавляете, а не переопределяете',
          'Большинство пользователей — с мобильных устройств',
          'Tailwind CSS использует mobile-first по умолчанию'
        ]},
        { type: 'note', value: 'При mobile-first стили без media query — это стили для МОБИЛЬНЫХ. Каждый следующий breakpoint (min-width) ДОПОЛНЯЕТ базовые стили.' }
      ]
    },
    {
      id: 3,
      title: 'Breakpoints и система точек перелома',
      type: 'theory',
      content: [
        { type: 'text', value: 'Breakpoints — точки, где layout меняется. Не привязывайте их к конкретным устройствам — ориентируйтесь на контент.' },
        { type: 'heading', value: 'Стандартные breakpoints' },
        { type: 'code', language: 'css', value: '/* Система breakpoints (как в Tailwind CSS) */\n/* sm:  640px  — крупные мобильные */\n/* md:  768px  — планшеты */\n/* lg:  1024px — ноутбуки */\n/* xl:  1280px — десктопы */\n/* 2xl: 1536px — большие экраны */\n\n:root {\n  --bp-sm: 640px;\n  --bp-md: 768px;\n  --bp-lg: 1024px;\n  --bp-xl: 1280px;\n}\n\n/* Адаптивный контейнер */\n.container {\n  width: 100%;\n  margin: 0 auto;\n  padding: 0 1rem;\n}\n\n@media (min-width: 640px)  { .container { max-width: 640px; } }\n@media (min-width: 768px)  { .container { max-width: 768px; } }\n@media (min-width: 1024px) { .container { max-width: 1024px; } }\n@media (min-width: 1280px) { .container { max-width: 1280px; } }' },
        { type: 'heading', value: 'Адаптивная типографика' },
        { type: 'code', language: 'css', value: '/* Базовый размер шрифта */\nhtml {\n  font-size: 14px;  /* мобильные */\n}\n\n@media (min-width: 768px) {\n  html { font-size: 16px; }  /* планшеты */\n}\n\n@media (min-width: 1280px) {\n  html { font-size: 18px; }  /* десктопы */\n}\n\n/* Или через clamp() — без media queries! */\nhtml {\n  font-size: clamp(14px, 1vw + 10px, 18px);\n  /* min: 14px, preferred: 1vw + 10px, max: 18px */\n}' },
        { type: 'tip', value: 'Не создавайте breakpoint для каждого устройства. 3-4 точки перелома достаточно для большинства проектов. Добавляйте новые только когда контент ломается.' }
      ]
    },
    {
      id: 4,
      title: 'Адаптивные единицы и clamp()',
      type: 'theory',
      content: [
        { type: 'text', value: 'clamp(), min(), max() — CSS-функции, которые позволяют создавать адаптивные значения без media queries. Они идеальны для типографики и spacing.' },
        { type: 'heading', value: 'clamp() — ограниченное значение' },
        { type: 'code', language: 'css', value: '/* clamp(минимум, предпочтительное, максимум) */\n\n/* Адаптивный заголовок */\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  /* Минимум: 1.5rem (24px)\n     Растёт: 4vw (пропорционально ширине)\n     Максимум: 3rem (48px) */\n}\n\n/* Адаптивный контейнер */\n.container {\n  width: clamp(320px, 90%, 1200px);\n  margin: 0 auto;\n}\n\n/* Адаптивные отступы */\nsection {\n  padding: clamp(1rem, 3vw, 4rem);\n}' },
        { type: 'heading', value: 'min() и max()' },
        { type: 'code', language: 'css', value: '/* min() — выбирает МЕНЬШЕЕ из значений */\n.container {\n  width: min(1200px, 90%);  /* 90% пока не превысит 1200px */\n  /* Замена для: max-width: 1200px; width: 90%; */\n}\n\n/* max() — выбирает БОЛЬШЕЕ из значений */\n.sidebar {\n  width: max(250px, 20%);  /* минимум 250px, но 20% если больше */\n}\n\n/* Комбинирование */\n.card {\n  width: min(100%, 400px);           /* не шире 400px */\n  padding: max(1rem, 2vw);           /* минимум 1rem */\n  font-size: clamp(0.875rem, 1.5vw, 1.125rem);\n}' },
        { type: 'tip', value: 'clamp() для font-size — лучший способ адаптивной типографики. Формула: clamp(minPx/16 + rem, (minPx + maxPx) / 2 / viewportWidth * 100 + vw, maxPx/16 + rem).' }
      ]
    },
    {
      id: 5,
      title: 'Адаптивные изображения и медиа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Изображения и видео по умолчанию не адаптивны. Нужно явно указать максимальную ширину и правильное масштабирование.' },
        { type: 'heading', value: 'Адаптивные изображения' },
        { type: 'code', language: 'css', value: '/* Базовый reset для медиа */\nimg, video, svg {\n  max-width: 100%;  /* не выходит за контейнер */\n  height: auto;     /* пропорции сохраняются */\n  display: block;   /* убирает пробел под img */\n}\n\n/* object-fit — как изображение заполняет контейнер */\n.card-image {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;    /* обрезает, заполняя контейнер */\n  /* object-fit: contain; — вписывает без обрезки */\n  /* object-fit: fill;    — растягивает (искажает) */\n}\n\n/* object-position — точка фокуса */\n.avatar {\n  width: 100px;\n  height: 100px;\n  object-fit: cover;\n  object-position: top center;  /* фокус на верхнюю часть */\n  border-radius: 50%;\n}' },
        { type: 'heading', value: 'aspect-ratio' },
        { type: 'code', language: 'css', value: '/* aspect-ratio — фиксированное соотношение сторон */\n.video-wrapper {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n  background: #000;\n}\n\n.square {\n  aspect-ratio: 1;  /* 1:1 — квадрат */\n  width: 100%;\n}\n\n.card-image {\n  aspect-ratio: 3 / 2;\n  width: 100%;\n  object-fit: cover;\n}\n\n/* aspect-ratio + object-fit — идеальная комбинация для галерей */\n.gallery img {\n  aspect-ratio: 1;\n  width: 100%;\n  object-fit: cover;\n  border-radius: 8px;\n}' },
        { type: 'note', value: 'Всегда добавляйте width и height атрибуты в HTML на <img>. Это предотвращает Layout Shift (CLS) при загрузке изображений.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Адаптивная страница',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полностью адаптивную страницу с mobile-first подходом: навигация, hero-секция, сетка карточек, footer.',
      requirements: [
        'Mobile-first подход: базовые стили для мобильных',
        'Навигация: бургер на мобильных, горизонтальные ссылки на десктопе',
        'Hero-секция: полноэкранная, адаптивный шрифт через clamp()',
        'Сетка карточек: 1 колонка → 2 → 3 через breakpoints',
        'Адаптивные изображения с aspect-ratio и object-fit',
        'Footer: колонки на десктопе, стек на мобильных'
      ],
      hint: 'Начните с однокоирночного layout для мобильных. Добавьте @media (min-width: 768px) для планшетов и @media (min-width: 1024px) для десктопа.',
      expectedOutput: 'Страница, которая красиво выглядит на мобильных (375px), планшетах (768px) и десктопах (1280px).',
      solution: '*, *::before, *::after { box-sizing: border-box; margin: 0; }\n\nbody {\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n  color: #1e293b;\n}\n\n.container {\n  width: min(1200px, 90%);\n  margin: 0 auto;\n}\n\n/* Навигация */\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n}\n\n.nav-links {\n  display: none;\n  list-style: none;\n}\n\n.burger { display: block; }\n\n@media (min-width: 768px) {\n  .nav-links { display: flex; gap: 2rem; }\n  .burger { display: none; }\n}\n\n/* Hero */\n.hero {\n  padding: clamp(2rem, 8vw, 6rem) 1rem;\n  text-align: center;\n}\n\n.hero h1 {\n  font-size: clamp(2rem, 5vw, 4rem);\n  margin-bottom: 1rem;\n}\n\n/* Карточки */\n.cards {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1.5rem;\n  padding: 2rem 1rem;\n}\n\n@media (min-width: 640px) {\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 1024px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}\n\n.card img {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n  object-fit: cover;\n  border-radius: 8px 8px 0 0;\n}\n\n/* Footer */\n.footer-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 2rem;\n  padding: 3rem 1rem;\n}\n\n@media (min-width: 768px) {\n  .footer-grid { grid-template-columns: repeat(3, 1fr); }\n}',
      explanation: 'Mobile-first: базовые стили — одна колонка, скрытые ссылки навигации. С 768px появляются 2 колонки карточек и горизонтальная навигация. С 1024px — 3 колонки. clamp() делает шрифт адаптивным без media queries.'
    }
  ]
}
