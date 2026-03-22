export default {
  id: 10,
  title: 'CSS: позиционирование',
  description: 'Свойство position: static, relative, absolute, fixed, sticky — управление расположением элементов',
  lessons: [
    {
      id: 1,
      title: 'static и relative',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию все элементы имеют position: static — они располагаются в нормальном потоке документа. relative позволяет сместить элемент без извлечения из потока.' },
        { type: 'code', language: 'css', value: '/* static: нормальный поток (по умолчанию) */\n.normal {\n  position: static;\n  /* top, right, bottom, left — НЕ работают */\n}\n\n/* relative: смещение относительно нормального места */\n.shifted {\n  position: relative;\n  top: 10px;   /* сместить вниз на 10px */\n  left: 20px;  /* сместить вправо на 20px */\n  /* Место в потоке СОХРАНЯЕТСЯ */\n}\n\n/* Главное использование relative — создать контекст для absolute */\n.parent {\n  position: relative; /* теперь absolute-дочерний отсчитывается от этого блока */\n}' },
        { type: 'tip', value: 'position: relative чаще используют не для смещения, а как "якорь" для дочерних absolute-элементов. Это очень распространённый паттерн.' }
      ]
    },
    {
      id: 2,
      title: 'absolute: абсолютное позиционирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'position: absolute вырывает элемент из нормального потока. Он позиционируется относительно ближайшего предка с position != static.' },
        { type: 'code', language: 'css', value: '.parent {\n  position: relative; /* создаёт контекст */\n  width: 300px;\n  height: 200px;\n  background: lightblue;\n}\n\n.child {\n  position: absolute;\n  top: 10px;    /* 10px от верхнего края parent */\n  right: 10px;  /* 10px от правого края parent */\n  /* bottom и left тоже можно */\n}\n\n/* Если нет relative-предка — позиционируется от <html> */\n\n/* Частый паттерн: бейдж на карточке */\n.card {\n  position: relative;\n}\n.badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  background: red;\n  color: white;\n  border-radius: 50%;\n  width: 20px;\n  height: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}' },
        { type: 'note', value: 'Элемент с position: absolute не занимает место в потоке — остальные элементы его не "видят". Это его главное отличие от relative.' }
      ]
    },
    {
      id: 3,
      title: 'fixed: фиксированное позиционирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'position: fixed позиционирует элемент относительно окна браузера. Он остаётся на месте при прокрутке страницы.' },
        { type: 'code', language: 'css', value: '/* Навбар, который остаётся сверху при скролле */\n.navbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;   /* или width: 100% */\n  height: 60px;\n  background: white;\n  z-index: 100; /* поверх остального контента */\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\n\n/* Чтобы контент не скрывался под фиксированным навбаром */\nbody {\n  padding-top: 60px; /* высота = высоте navbar */\n}\n\n/* Кнопка "вверх" в правом нижнем углу */\n.back-to-top {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 99;\n}' }
      ]
    },
    {
      id: 4,
      title: 'sticky: липкое позиционирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'position: sticky — гибрид relative и fixed. Элемент ведёт себя как relative, пока не достигнет заданного порога, а потом "прилипает".' },
        { type: 'code', language: 'css', value: '/* Заголовок секции, который прилипает при скролле */\n.section-header {\n  position: sticky;\n  top: 0;  /* прилипнуть к верху при достижении */\n  background: white;\n  z-index: 10;\n  padding: 12px 0;\n  border-bottom: 1px solid #eee;\n}\n\n/* Боковая панель, которая следует за скроллом */\n.sidebar {\n  position: sticky;\n  top: 80px; /* 80px от верха (учитываем navbар) */\n  height: fit-content;\n  max-height: calc(100vh - 80px);\n  overflow-y: auto;\n}\n\n/* Важно: родитель должен быть достаточно высоким */\n/* sticky работает в пределах своего scroll-контейнера */' },
        { type: 'tip', value: 'sticky очень удобен для: фиксированных шапок таблиц, боковых панелей, заголовков секций. В отличие от fixed, не нужно добавлять padding к body.' }
      ]
    },
    {
      id: 5,
      title: 'z-index и контексты наложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'z-index управляет порядком наложения позиционированных элементов. Элемент с большим z-index рисуется поверх.' },
        { type: 'code', language: 'css', value: '/* z-index работает только для positioned элементов */\n/* (relative, absolute, fixed, sticky) */\n\n.modal-overlay {\n  position: fixed;\n  inset: 0;  /* = top:0; right:0; bottom:0; left:0 */\n  background: rgba(0,0,0,0.5);\n  z-index: 1000;\n}\n\n.modal {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1001; /* поверх overlay */\n  background: white;\n  padding: 24px;\n  border-radius: 12px;\n}\n\n/* Стратегия z-index */\n/* 1-9: обычные элементы */\n/* 10-99: выпадающие меню */\n/* 100-999: модальные окна */\n/* 1000+: уведомления/toast */' },
        { type: 'warning', value: 'Не злоупотребляй z-index: 9999! Определи заранее "слои" своего интерфейса и присвой им осмысленные значения. Хаотичные z-index создают трудноразрешимые конфликты.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модальное окно и tooltip',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай модальное окно с затемнённым фоном и tooltip при наведении, используя позиционирование.',
      requirements: [
        'Кнопка, при нажатии на которую появляется модальное окно',
        'Оверлей (затемнение) на position: fixed с z-index: 100',
        'Само модальное окно по центру экрана (fixed + transform: translate(-50%, -50%))',
        'Tooltip на кнопке: при :hover показывать подсказку (position: absolute)',
        'Фиксированный навбар сверху'
      ],
      expectedOutput: 'Страница с фикс. навбаром, кнопкой с tooltip и модальным окном',
      hint: 'Для центрирования модала: position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%). Для tooltip: родитель position: relative, подсказка — position: absolute.',
      solution: '/* CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: Arial, sans-serif; padding-top: 70px; }\n\n.navbar {\n  position: fixed;\n  top: 0; left: 0; right: 0;\n  height: 64px;\n  background: #1a1a2e;\n  color: white;\n  display: flex;\n  align-items: center;\n  padding: 0 24px;\n  z-index: 50;\n}\n\n.tooltip-wrapper {\n  position: relative;\n  display: inline-block;\n  margin: 40px;\n}\n\n.tooltip {\n  position: absolute;\n  bottom: calc(100% + 8px);\n  left: 50%;\n  transform: translateX(-50%);\n  background: #333;\n  color: white;\n  padding: 6px 12px;\n  border-radius: 4px;\n  font-size: 13px;\n  white-space: nowrap;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.2s;\n}\n\n.tooltip-wrapper:hover .tooltip { opacity: 1; }\n\n.modal-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.5);\n  z-index: 100;\n}\n\n.modal-overlay.active { display: block; }\n\n.modal {\n  position: fixed;\n  top: 50%; left: 50%;\n  transform: translate(-50%, -50%);\n  background: white;\n  border-radius: 12px;\n  padding: 32px;\n  width: min(500px, 90vw);\n  z-index: 101;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n}',
      explanation: 'position: fixed + inset: 0 создаёт полноэкранный оверлей. Центрирование через top/left: 50% + transform: translate(-50%,-50%) — универсальный способ, работает при любых размерах. Tooltip использует position: absolute относительно своего обёртки (position: relative).'
    }
  ]
}
