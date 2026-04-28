export default {
  id: 3,
  title: 'Позиционирование',
  description: 'Static, relative, absolute, fixed, sticky и z-index — управление расположением элементов.',
  lessons: [
    {
      id: 1,
      title: 'Нормальный поток и position: static',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию все элементы находятся в нормальном потоке документа. Блочные элементы идут вертикально сверху вниз, строчные — горизонтально слева направо. position: static — значение по умолчанию.' },
        { type: 'heading', value: 'Нормальный поток' },
        { type: 'code', language: 'css', value: '/* position: static — значение по умолчанию */\n.element {\n  position: static;\n  /* top, right, bottom, left — НЕ РАБОТАЮТ */\n  /* z-index — НЕ РАБОТАЕТ */\n}\n\n/* Элементы идут в порядке HTML-разметки */\n/* Блочные элементы: div, p, h1, section */\n/*   ┌─────────────────────┐\n     │      <header>       │\n     ├─────────────────────┤\n     │       <main>        │\n     ├─────────────────────┤\n     │      <footer>       │\n     └─────────────────────┘  */\n\n/* Строчные элементы: span, a, strong */\n/* [span][a][strong] — в одну строку */' },
        { type: 'note', value: 'Для большинства элементов position: static достаточно. Меняйте позиционирование только когда нужно вывести элемент из потока или закрепить его.' }
      ]
    },
    {
      id: 2,
      title: 'position: relative и absolute',
      type: 'theory',
      content: [
        { type: 'text', value: 'relative — элемент остаётся в потоке, но сдвигается визуально. absolute — элемент выходит из потока и позиционируется относительно ближайшего предка с position != static.' },
        { type: 'heading', value: 'relative — сдвиг от своего места' },
        { type: 'code', language: 'css', value: '.shifted {\n  position: relative;\n  top: 10px;     /* сдвиг вниз на 10px от исходной позиции */\n  left: 20px;    /* сдвиг вправо на 20px */\n  /* Место в потоке СОХРАНЯЕТСЯ — другие элементы НЕ сдвигаются */\n}\n\n/* Главное применение relative — контекст для absolute потомков */' },
        { type: 'heading', value: 'absolute — относительно предка' },
        { type: 'code', language: 'css', value: '/* Классический паттерн: родитель relative, потомок absolute */\n.card {\n  position: relative;  /* создаём контекст */\n  padding: 1rem;\n}\n\n.badge {\n  position: absolute;\n  top: -8px;           /* относительно .card */\n  right: -8px;\n  background: #ef4444;\n  color: white;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.75rem;\n}\n\n/* Центрирование через absolute */\n.centered {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);  /* сдвиг на половину своих размеров */\n}' },
        { type: 'heading', value: 'Растягивание через absolute' },
        { type: 'code', language: 'css', value: '/* Оверлей на всю площадь родителя */\n.overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  /* Сокращённая запись: */\n  /* inset: 0; */\n  background: rgba(0, 0, 0, 0.5);\n}' },
        { type: 'tip', value: 'Если absolute-элемент не находит предка с position, он позиционируется относительно viewport. Всегда ставьте position: relative на нужного предка.' }
      ]
    },
    {
      id: 3,
      title: 'position: fixed и sticky',
      type: 'theory',
      content: [
        { type: 'text', value: 'fixed — элемент привязан к viewport и не двигается при скролле. sticky — гибрид: ведёт себя как relative, пока не достигнет порога, затем «прилипает» как fixed.' },
        { type: 'heading', value: 'fixed — фиксация к экрану' },
        { type: 'code', language: 'css', value: '/* Фиксированная шапка */\n.header {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  /* или: inset: 0 0 auto 0; */\n  height: 64px;\n  background: white;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  z-index: 100;\n}\n\n/* Не забудьте добавить отступ для контента! */\nmain {\n  padding-top: 64px;  /* высота fixed header */\n}\n\n/* Кнопка «Наверх» в углу */\n.back-to-top {\n  position: fixed;\n  bottom: 2rem;\n  right: 2rem;\n  z-index: 50;\n}' },
        { type: 'heading', value: 'sticky — прилипание при скролле' },
        { type: 'code', language: 'css', value: '/* Прилипающая навигация */\n.nav {\n  position: sticky;\n  top: 0;          /* «прилипнет» когда достигнет top: 0 */\n  background: white;\n  z-index: 10;\n}\n\n/* Прилипающий sidebar */\n.sidebar {\n  position: sticky;\n  top: 80px;       /* учитываем высоту шапки */\n  align-self: start;  /* важно в flex/grid контейнере */\n}\n\n/* sticky-заголовки в списке */\n.list-section h3 {\n  position: sticky;\n  top: 0;\n  background: #f3f4f6;\n  padding: 0.5rem 1rem;\n  margin: 0;\n}' },
        { type: 'note', value: 'sticky не работает, если у любого предка есть overflow: hidden, overflow: auto или overflow: scroll. Также sticky работает только в пределах своего родителя.' }
      ]
    },
    {
      id: 4,
      title: 'z-index и контексты наложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'z-index управляет порядком наложения элементов по оси Z (глубина). Работает только для элементов с position != static (а также flex/grid дочерних).' },
        { type: 'heading', value: 'Основы z-index' },
        { type: 'code', language: 'css', value: '/* z-index — целое число (может быть отрицательным) */\n.dropdown {\n  position: absolute;\n  z-index: 10;\n}\n\n.modal-overlay {\n  position: fixed;\n  z-index: 100;\n}\n\n.modal {\n  position: fixed;\n  z-index: 101;  /* выше overlay */\n}\n\n.tooltip {\n  position: absolute;\n  z-index: 200;  /* выше модалки */\n}' },
        { type: 'heading', value: 'Система z-index (best practice)' },
        { type: 'code', language: 'css', value: '/* Используйте шкалу с запасом */\n:root {\n  --z-dropdown: 10;\n  --z-sticky: 20;\n  --z-fixed: 30;\n  --z-modal-backdrop: 40;\n  --z-modal: 50;\n  --z-popover: 60;\n  --z-tooltip: 70;\n}\n\n.dropdown { z-index: var(--z-dropdown); }\n.header   { z-index: var(--z-sticky); }\n.modal    { z-index: var(--z-modal); }' },
        { type: 'heading', value: 'Контекст наложения (stacking context)' },
        { type: 'code', language: 'css', value: '/* Новый контекст наложения создаётся при: */\n.new-context {\n  position: relative;\n  z-index: 1;           /* position + z-index */\n}\n\n.also-new-context {\n  opacity: 0.99;        /* opacity < 1 */\n  transform: scale(1);  /* любой transform */\n  isolation: isolate;   /* явное создание контекста */\n}\n\n/* Проблема: z-index: 9999 внутри контекста с z-index: 1\n   НИКОГДА не перекроет элемент с z-index: 2 ВНЕ этого контекста */\n\n/* Решение: используйте isolation: isolate для явного контроля */\n.card {\n  isolation: isolate;  /* создаёт контекст без побочных эффектов */\n}' },
        { type: 'tip', value: 'Избегайте z-index: 9999. Вместо этого создайте систему переменных с логичной шкалой. Если z-index не работает — проверьте контексты наложения.' }
      ]
    },
    {
      id: 5,
      title: 'Свойство inset и современный CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство inset — сокращение для top, right, bottom, left. Работает по аналогии с margin/padding. Поддерживается всеми современными браузерами.' },
        { type: 'heading', value: 'Свойство inset' },
        { type: 'code', language: 'css', value: '/* inset — shorthand для top/right/bottom/left */\n.overlay {\n  position: absolute;\n  inset: 0;  /* top: 0; right: 0; bottom: 0; left: 0; */\n}\n\n/* Два значения: вертикаль горизонталь */\n.centered {\n  position: absolute;\n  inset: 10% 20%;  /* top/bottom: 10%, left/right: 20% */\n}\n\n/* Четыре значения: top right bottom left */\n.panel {\n  position: fixed;\n  inset: 0 0 0 300px;  /* слева 300px — оставляем место для sidebar */\n}' },
        { type: 'heading', value: 'Практические паттерны' },
        { type: 'code', language: 'css', value: '/* Полноэкранное модальное окно */\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n/* Декоративная линия сверху карточки */\n.card {\n  position: relative;\n}\n\n.card::before {\n  content: "";\n  position: absolute;\n  inset: 0 0 auto 0;  /* top: 0, right: 0, bottom: auto, left: 0 */\n  height: 4px;\n  background: linear-gradient(to right, #3b82f6, #8b5cf6);\n  border-radius: 4px 4px 0 0;\n}' },
        { type: 'tip', value: 'inset: 0 — это идиоматичный способ растянуть абсолютно позиционированный элемент на всю площадь родителя. Используйте его вместо top/right/bottom/left: 0.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модальное окно и шапка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте фиксированную шапку сайта и модальное окно с overlay, используя различные типы позиционирования.',
      requirements: [
        'Фиксированная шапка (fixed) с z-index и тенью',
        'Sticky sidebar, который прилипает при скролле',
        'Модальное окно: backdrop (fixed, inset: 0) и центрированный контент',
        'Бейдж уведомления на кнопке через absolute',
        'Кнопка «Наверх» в правом нижнем углу (fixed)',
        'Правильная система z-index через CSS-переменные'
      ],
      hint: 'Начните с шапки (fixed, top: 0), не забудьте padding-top на main. Для модалки используйте fixed + inset: 0 для backdrop и absolute + translate для центрирования.',
      expectedOutput: 'Страница с фиксированной шапкой, прилипающим sidebar, модальным окном с затемнённым фоном и кнопкой наверх.',
      solution: ':root {\n  --z-sticky: 20;\n  --z-fixed: 30;\n  --z-modal-backdrop: 40;\n  --z-modal: 50;\n}\n\n.header {\n  position: fixed;\n  inset: 0 0 auto 0;\n  height: 64px;\n  background: white;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  z-index: var(--z-fixed);\n  display: flex;\n  align-items: center;\n  padding: 0 2rem;\n}\n\nmain {\n  padding-top: 80px;\n  display: flex;\n  gap: 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.sidebar {\n  position: sticky;\n  top: 80px;\n  width: 250px;\n  align-self: start;\n  z-index: var(--z-sticky);\n}\n\n.notification-btn {\n  position: relative;\n}\n\n.notification-btn .badge {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  background: #ef4444;\n  color: white;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  font-size: 0.7rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.5);\n  z-index: var(--z-modal-backdrop);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.modal {\n  background: white;\n  border-radius: 12px;\n  padding: 2rem;\n  max-width: 500px;\n  width: 90%;\n  z-index: var(--z-modal);\n}\n\n.back-to-top {\n  position: fixed;\n  bottom: 2rem;\n  right: 2rem;\n  z-index: var(--z-fixed);\n}',
      explanation: 'Шапка fixed с inset: 0 0 auto 0 растягивается на всю ширину. Sidebar sticky прилипает при скролле. Бейдж absolute позиционируется относительно кнопки (relative). Модалка использует fixed backdrop + flex для центрирования. z-index контролируется через CSS-переменные.'
    }
  ]
}
