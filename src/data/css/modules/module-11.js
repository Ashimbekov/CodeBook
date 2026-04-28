export default {
  id: 11,
  title: 'Переходы и анимации',
  description: 'Transition, animation, @keyframes, производительность анимаций и практические примеры.',
  lessons: [
    {
      id: 1,
      title: 'CSS Transitions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Transition создаёт плавный переход между двумя состояниями CSS-свойства. Это самый простой способ добавить анимацию: задайте свойство, длительность и кривую.' },
        { type: 'heading', value: 'Синтаксис transition' },
        { type: 'code', language: 'css', value: '/* transition: property duration timing-function delay */\n.button {\n  background: #3b82f6;\n  color: white;\n  padding: 0.5rem 1rem;\n  border-radius: 6px;\n  transition: background 0.2s ease;\n}\n\n.button:hover {\n  background: #2563eb;\n}\n\n/* Несколько свойств */\n.card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 10px 25px rgba(0,0,0,0.15);\n}\n\n/* Все свойства */\n.element {\n  transition: all 0.3s ease;  /* анимирует ВСЕ изменения */\n  /* ⚠️ Осторожно: может анимировать нежелательные свойства */\n}' },
        { type: 'heading', value: 'Отдельные свойства' },
        { type: 'code', language: 'css', value: '.element {\n  transition-property: transform, opacity;  /* что анимировать */\n  transition-duration: 0.3s, 0.5s;          /* длительность каждого */\n  transition-timing-function: ease, linear;  /* кривая каждого */\n  transition-delay: 0s, 0.1s;               /* задержка каждого */\n}' },
        { type: 'tip', value: 'Никогда не анимируйте width, height, top, left, margin — это вызывает Layout и медленно. Используйте transform и opacity — они работают на GPU и не затрагивают layout.' }
      ]
    },
    {
      id: 2,
      title: 'Timing functions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Timing function определяет «характер» анимации: плавная, упругая, резкая. Правильная кривая делает интерфейс живым и естественным.' },
        { type: 'heading', value: 'Встроенные кривые' },
        { type: 'code', language: 'css', value: '/* Встроенные timing functions */\n.ease       { transition-timing-function: ease; }        /* медленно-быстро-медленно (по умолчанию) */\n.linear     { transition-timing-function: linear; }      /* постоянная скорость */\n.ease-in    { transition-timing-function: ease-in; }     /* медленное начало */\n.ease-out   { transition-timing-function: ease-out; }    /* медленный конец */\n.ease-in-out { transition-timing-function: ease-in-out; } /* медленное начало и конец */' },
        { type: 'heading', value: 'cubic-bezier — кастомные кривые' },
        { type: 'code', language: 'css', value: '/* cubic-bezier(x1, y1, x2, y2) */\n.snappy {\n  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  /* Material Design стандарт */\n}\n\n.bouncy {\n  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n  /* Упругий эффект — y выходит за пределы 0-1 */\n}\n\n.smooth {\n  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);\n  /* Плавная кривая */\n}\n\n/* steps() — пошаговая анимация */\n.typewriter {\n  animation: typing 2s steps(20) forwards;\n  /* 20 дискретных шагов — эффект печатной машинки */\n}' },
        { type: 'tip', value: 'Для UI-анимаций используйте cubic-bezier(0.4, 0, 0.2, 1) — это стандарт Material Design. Для появления — ease-out (0, 0, 0.2, 1). Для исчезновения — ease-in (0.4, 0, 1, 1).' }
      ]
    },
    {
      id: 3,
      title: '@keyframes и animation',
      type: 'theory',
      content: [
        { type: 'text', value: '@keyframes описывают последовательность состояний анимации. В отличие от transition, animation может запускаться автоматически, повторяться и иметь сложные сценарии.' },
        { type: 'heading', value: '@keyframes и animation' },
        { type: 'code', language: 'css', value: '/* Определение анимации */\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n/* Применение */\n.element {\n  animation: fadeIn 0.5s ease forwards;\n}\n\n/* Полный синтаксис */\n.element {\n  animation-name: fadeIn;\n  animation-duration: 0.5s;\n  animation-timing-function: ease;\n  animation-delay: 0s;\n  animation-iteration-count: 1;        /* infinite для цикла */\n  animation-direction: normal;         /* reverse, alternate */\n  animation-fill-mode: forwards;       /* сохранить конечное состояние */\n  animation-play-state: running;       /* paused для паузы */\n}' },
        { type: 'heading', value: 'Множественные ключевые кадры' },
        { type: 'code', language: 'css', value: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  25%      { transform: translateY(-10px); }\n  50%      { transform: translateY(0); }\n  75%      { transform: translateY(-5px); }\n}\n\n.bounce {\n  animation: bounce 0.6s ease;\n}\n\n/* Пульсация */\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%      { transform: scale(1.05); }\n}\n\n.pulse {\n  animation: pulse 2s ease-in-out infinite;\n}\n\n/* Вращение (спиннер) */\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n.spinner {\n  width: 32px;\n  height: 32px;\n  border: 3px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}' },
        { type: 'note', value: 'animation-fill-mode: forwards сохраняет конечное состояние. Без него элемент вернётся к исходному виду после окончания анимации.' }
      ]
    },
    {
      id: 4,
      title: 'Анимации появления и исчезновения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Анимации появления (entrance) и исчезновения (exit) — основа UI-анимаций. Правильные паттерны: fade, slide, scale, и их комбинации.' },
        { type: 'heading', value: 'Базовые анимации появления' },
        { type: 'code', language: 'css', value: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}\n\n@keyframes slideUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes slideDown {\n  from { opacity: 0; transform: translateY(-20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes scaleIn {\n  from { opacity: 0; transform: scale(0.9); }\n  to   { opacity: 1; transform: scale(1); }\n}\n\n@keyframes slideInRight {\n  from { opacity: 0; transform: translateX(30px); }\n  to   { opacity: 1; transform: translateX(0); }\n}' },
        { type: 'heading', value: 'Каскадные задержки (stagger)' },
        { type: 'code', language: 'css', value: '/* Элементы появляются один за другим */\n.card {\n  animation: slideUp 0.5s ease forwards;\n  opacity: 0;  /* начальное состояние */\n}\n\n.card:nth-child(1) { animation-delay: 0.0s; }\n.card:nth-child(2) { animation-delay: 0.1s; }\n.card:nth-child(3) { animation-delay: 0.2s; }\n.card:nth-child(4) { animation-delay: 0.3s; }\n\n/* Через CSS-переменные (удобнее) */\n.card {\n  animation: slideUp 0.5s ease forwards;\n  animation-delay: calc(var(--i, 0) * 0.1s);\n  opacity: 0;\n}\n/* В HTML: style="--i: 0", style="--i: 1", ... */' },
        { type: 'tip', value: 'Стандартная длительность для UI: 150-300ms. Появление: 200-500ms. Исчезновение: 150-300ms (быстрее, чем появление). Бесконечные анимации: 1-3s.' }
      ]
    },
    {
      id: 5,
      title: 'Производительность анимаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все CSS-свойства одинаково быстро анимируются. Анимация layout-свойств (width, height) заставляет браузер пересчитывать всю страницу.' },
        { type: 'heading', value: 'Быстрые vs медленные свойства' },
        { type: 'code', language: 'css', value: '/* ✅ БЫСТРЫЕ — работают на GPU (compositor) */\n.fast {\n  transform: translateX(100px);  /* позиция */\n  transform: scale(1.1);          /* размер */\n  transform: rotate(45deg);       /* вращение */\n  opacity: 0.5;                   /* прозрачность */\n}\n\n/* ❌ МЕДЛЕННЫЕ — вызывают Layout + Paint */\n.slow {\n  width: 200px;        /* пересчёт layout */\n  height: 100px;       /* пересчёт layout */\n  top: 50px;           /* пересчёт layout */\n  left: 100px;         /* пересчёт layout */\n  margin-left: 20px;   /* пересчёт layout */\n  padding: 1rem;       /* пересчёт layout */\n  border-width: 2px;   /* пересчёт layout */\n}\n\n/* ⚠️ СРЕДНИЕ — вызывают Paint (без Layout) */\n.medium {\n  background-color: red;  /* перерисовка */\n  color: blue;            /* перерисовка */\n  box-shadow: ...;        /* перерисовка */\n}' },
        { type: 'heading', value: 'will-change и contain' },
        { type: 'code', language: 'css', value: '/* will-change — подсказка браузеру о будущей анимации */\n.animated {\n  will-change: transform, opacity;\n  /* Браузер заранее создаст отдельный слой */\n}\n\n/* ⚠️ Не ставьте will-change на всё подряд! */\n/* Каждый слой потребляет память GPU */\n\n/* Лучше добавлять при hover/focus: */\n.card:hover {\n  will-change: transform;\n}\n\n/* Или через JS перед анимацией */\n\n/* contain — ограничивает область перерисовки */\n.card {\n  contain: layout paint;  /* изменения внутри не влияют на внешние элементы */\n}' },
        { type: 'heading', value: 'prefers-reduced-motion' },
        { type: 'code', language: 'css', value: '/* Уважайте настройки пользователя! */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}\n\n/* Или задавайте анимации только для тех, кто не отключил */\n@media (prefers-reduced-motion: no-preference) {\n  .card {\n    transition: transform 0.3s ease;\n  }\n  .card:hover {\n    transform: translateY(-4px);\n  }\n}' },
        { type: 'note', value: 'Всегда добавляйте prefers-reduced-motion в проект. Некоторые пользователи испытывают дискомфорт от анимаций (вестибулярные нарушения).' }
      ]
    },
    {
      id: 6,
      title: 'Анимация скелетона загрузки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Skeleton loader — анимированный заполнитель, показывающий структуру контента во время загрузки. Улучшает воспринимаемую производительность.' },
        { type: 'heading', value: 'Skeleton loader' },
        { type: 'code', language: 'css', value: '/* Скелетон с анимацией мерцания */\n@keyframes shimmer {\n  0% { background-position: -200% 0; }\n  100% { background-position: 200% 0; }\n}\n\n.skeleton {\n  background: linear-gradient(\n    90deg,\n    #e2e8f0 25%,\n    #f1f5f9 50%,\n    #e2e8f0 75%\n  );\n  background-size: 200% 100%;\n  animation: shimmer 1.5s ease-in-out infinite;\n  border-radius: 4px;\n}\n\n.skeleton-title {\n  height: 24px;\n  width: 60%;\n  margin-bottom: 0.75rem;\n}\n\n.skeleton-text {\n  height: 16px;\n  width: 100%;\n  margin-bottom: 0.5rem;\n}\n\n.skeleton-text:last-child {\n  width: 80%;\n}\n\n.skeleton-avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n}' },
        { type: 'heading', value: 'Пульсирующий скелетон' },
        { type: 'code', language: 'css', value: '/* Альтернатива: пульсация вместо мерцания */\n@keyframes skeleton-pulse {\n  0%, 100% { opacity: 1; }\n  50%      { opacity: 0.5; }\n}\n\n.skeleton-pulse {\n  background: #e2e8f0;\n  animation: skeleton-pulse 1.5s ease-in-out infinite;\n  border-radius: 4px;\n}' },
        { type: 'tip', value: 'Skeleton loader лучше спиннера: он показывает пользователю структуру контента и создаёт ощущение, что загрузка почти завершена.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Анимированные карточки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте набор карточек с анимациями: плавное появление, hover-эффекты, анимированные кнопки и skeleton loader.',
      requirements: [
        'Карточки появляются с анимацией slideUp и каскадной задержкой',
        'Hover на карточке: подъём (translateY) + усиление тени',
        'Кнопка с transition на background и transform',
        'Спиннер загрузки (spin анимация)',
        'Skeleton loader с shimmer-анимацией',
        'prefers-reduced-motion для отключения анимаций'
      ],
      hint: 'Определите @keyframes для slideUp, spin, shimmer. Используйте animation-delay через nth-child для stagger-эффекта.',
      expectedOutput: 'Карточки плавно появляются одна за другой, при наведении поднимаются с тенью, кнопки плавно меняют цвет, есть спиннер и скелетон.',
      solution: '@keyframes slideUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n@keyframes shimmer {\n  0% { background-position: -200% 0; }\n  100% { background-position: 200% 0; }\n}\n\n.card {\n  opacity: 0;\n  animation: slideUp 0.5s ease forwards;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:nth-child(1) { animation-delay: 0s; }\n.card:nth-child(2) { animation-delay: 0.1s; }\n.card:nth-child(3) { animation-delay: 0.2s; }\n\n.card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 12px 30px rgba(0,0,0,0.15);\n}\n\n.btn {\n  background: #3b82f6;\n  color: white;\n  padding: 0.5rem 1.5rem;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: background 0.2s ease, transform 0.1s ease;\n}\n\n.btn:hover { background: #2563eb; }\n.btn:active { transform: scale(0.97); }\n\n.spinner {\n  width: 32px;\n  height: 32px;\n  border: 3px solid #e2e8f0;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}\n\n.skeleton {\n  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);\n  background-size: 200% 100%;\n  animation: shimmer 1.5s ease-in-out infinite;\n  border-radius: 4px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}',
      explanation: 'slideUp с animation-delay создаёт каскадное появление. Hover использует transform и box-shadow (оба быстрые). Кнопка анимирует background и scale при нажатии. Skeleton использует движущийся gradient. prefers-reduced-motion отключает анимации для пользователей с чувствительностью.'
    }
  ]
}
