export default {
  id: 2,
  title: 'Блочная модель',
  description: 'Box model, margin, padding, border, box-sizing — как браузер рассчитывает размеры элементов.',
  lessons: [
    {
      id: 1,
      title: 'Что такое блочная модель',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый элемент в CSS представляет собой прямоугольный блок. Блочная модель (Box Model) описывает, из чего этот блок состоит: контент, padding, border и margin.' },
        { type: 'heading', value: 'Слои блочной модели' },
        { type: 'code', language: 'css', value: '/*\n  ┌─────────────── margin ───────────────┐\n  │  ┌─────────── border ──────────────┐  │\n  │  │  ┌──────── padding ──────────┐  │  │\n  │  │  │  ┌───── content ───────┐  │  │  │\n  │  │  │  │                     │  │  │  │\n  │  │  │  │   200px × 100px     │  │  │  │\n  │  │  │  │                     │  │  │  │\n  │  │  │  └─────────────────────┘  │  │  │\n  │  │  └───────────────────────────┘  │  │\n  │  └─────────────────────────────────┘  │\n  └───────────────────────────────────────┘\n*/\n\n.box {\n  width: 200px;           /* ширина контента */\n  height: 100px;          /* высота контента */\n  padding: 20px;          /* внутренний отступ */\n  border: 2px solid #333; /* рамка */\n  margin: 16px;           /* внешний отступ */\n}\n\n/* Реальная ширина (по умолчанию):\n   200 + 20*2 + 2*2 = 244px\n   Margin НЕ входит в размер элемента, но занимает место */\n' },
        { type: 'note', value: 'Откройте DevTools (F12) → вкладка Elements → раздел Box Model. Там наглядно видно все слои блочной модели любого элемента.' }
      ]
    },
    {
      id: 2,
      title: 'box-sizing: border-box',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию width/height задают размер только контента (content-box). Это неудобно, потому что padding и border увеличивают реальный размер. border-box решает эту проблему.' },
        { type: 'heading', value: 'content-box vs border-box' },
        { type: 'code', language: 'css', value: '/* content-box (по умолчанию) — width = только контент */\n.content-box {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 2px solid;\n  /* Реальная ширина: 200 + 20*2 + 2*2 = 244px */\n}\n\n/* border-box — width = контент + padding + border */\n.border-box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 2px solid;\n  /* Реальная ширина: 200px (контент сожмётся до 156px) */\n}' },
        { type: 'heading', value: 'Глобальный reset (обязательно!)' },
        { type: 'code', language: 'css', value: '/* Устанавливаем border-box для ВСЕХ элементов */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* Теперь width всегда = реальная ширина элемента */\n.sidebar {\n  width: 300px;    /* ровно 300px, включая padding и border */\n  padding: 1rem;\n  border: 1px solid #ddd;\n}' },
        { type: 'tip', value: 'border-box — это стандарт в современной вёрстке. Все CSS-фреймворки (Tailwind, Bootstrap) включают его по умолчанию. Всегда добавляйте этот reset в начало вашего CSS.' }
      ]
    },
    {
      id: 3,
      title: 'Padding и Margin',
      type: 'theory',
      content: [
        { type: 'text', value: 'Padding — внутренний отступ (между контентом и border). Margin — внешний отступ (между элементами). Оба принимают от 1 до 4 значений.' },
        { type: 'heading', value: 'Сокращённая запись' },
        { type: 'code', language: 'css', value: '/* Одно значение — все стороны */\n.box { padding: 1rem; }          /* top right bottom left = 1rem */\n\n/* Два значения — вертикаль горизонталь */\n.box { padding: 1rem 2rem; }     /* top/bottom = 1rem, left/right = 2rem */\n\n/* Три значения — top горизонталь bottom */\n.box { padding: 1rem 2rem 0.5rem; }\n\n/* Четыре значения — по часовой стрелке */\n.box { padding: 1rem 2rem 0.5rem 1.5rem; } /* top right bottom left */\n\n/* Отдельные стороны */\n.box {\n  padding-top: 1rem;\n  padding-right: 2rem;\n  padding-bottom: 0.5rem;\n  padding-left: 1.5rem;\n}' },
        { type: 'heading', value: 'Схлопывание margin (margin collapsing)' },
        { type: 'code', language: 'css', value: '/* Вертикальные margin схлопываются! */\n.block-a { margin-bottom: 20px; }\n.block-b { margin-top: 30px; }\n/* Расстояние между ними = 30px (не 50px!) */\n/* Берётся БОЛЬШИЙ из двух margin */\n\n/* Горизонтальные margin НЕ схлопываются */\n.inline-a { margin-right: 20px; }\n.inline-b { margin-left: 30px; }\n/* Расстояние = 50px */\n\n/* Как избежать схлопывания: */\n.parent {\n  /* Любой из вариантов: */\n  overflow: hidden;\n  display: flex;\n  display: grid;\n  padding-top: 1px;\n  border-top: 1px solid transparent;\n}' },
        { type: 'heading', value: 'Центрирование через margin' },
        { type: 'code', language: 'css', value: '/* Горизонтальное центрирование блока */\n.container {\n  max-width: 1200px;\n  margin: 0 auto;  /* auto = равные отступы слева и справа */\n}\n\n/* margin: auto работает только для блочных элементов с заданной шириной */\n.card {\n  width: 400px;\n  margin-left: auto;\n  margin-right: auto;\n}' },
        { type: 'note', value: 'Padding не может быть отрицательным, а margin — может. Отрицательные margin сдвигают элемент или вытягивают его за границы родителя.' }
      ]
    },
    {
      id: 4,
      title: 'Border и Outline',
      type: 'theory',
      content: [
        { type: 'text', value: 'Border — часть блочной модели, влияет на размер. Outline — визуальная обводка поверх элемента, НЕ влияет на размер и компоновку.' },
        { type: 'heading', value: 'Border' },
        { type: 'code', language: 'css', value: '/* Сокращённая запись */\n.card {\n  border: 1px solid #e2e8f0;\n}\n\n/* Отдельные свойства */\n.card {\n  border-width: 1px 2px 1px 0;  /* top right bottom left */\n  border-style: solid;\n  border-color: #e2e8f0;\n}\n\n/* Отдельные стороны */\n.card {\n  border-bottom: 3px solid #3b82f6;\n  border-left: none;\n}\n\n/* Скругление углов */\n.card {\n  border-radius: 8px;          /* все углы */\n  border-radius: 8px 0 0 8px;  /* top-left top-right bottom-right bottom-left */\n}\n\n.avatar {\n  border-radius: 50%;  /* круг */\n  width: 64px;\n  height: 64px;\n}' },
        { type: 'heading', value: 'Outline' },
        { type: 'code', language: 'css', value: '/* Outline НЕ влияет на размер и layout */\n.button:focus {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;  /* отступ от border */\n}\n\n/* Не убирайте outline у интерактивных элементов! */\n/* Это плохо для доступности: */\n/* button:focus { outline: none; } — НЕ ДЕЛАЙТЕ ТАК */\n\n/* Вместо этого стилизуйте outline: */\nbutton:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n  border-radius: 4px;\n}' },
        { type: 'tip', value: 'Используйте :focus-visible вместо :focus для outline — он срабатывает только при навигации клавиатурой, не при клике мышью.' }
      ]
    },
    {
      id: 5,
      title: 'Display и типы элементов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Свойство display определяет, как элемент участвует в потоке документа. Это самое фундаментальное свойство для управления layout.' },
        { type: 'heading', value: 'Основные значения display' },
        { type: 'code', language: 'css', value: '/* block — занимает всю ширину, новая строка */\ndiv, p, h1, section { display: block; }\n.block {\n  display: block;\n  width: 300px;   /* можно задать ширину */\n  height: 200px;  /* и высоту */\n  margin: auto;   /* и центрировать */\n}\n\n/* inline — по ширине контента, в строке */\nspan, a, strong { display: inline; }\n.inline {\n  display: inline;\n  /* width, height — ИГНОРИРУЮТСЯ */\n  /* margin-top, margin-bottom — ИГНОРИРУЮТСЯ */\n  padding: 0.25rem 0.5rem;  /* работает, но может наложиться */\n}\n\n/* inline-block — в строке, но с размерами блока */\n.tag {\n  display: inline-block;\n  width: auto;    /* можно задать */\n  height: auto;   /* можно задать */\n  padding: 0.25rem 0.75rem;\n  margin: 0.25rem;\n  vertical-align: middle;\n}' },
        { type: 'heading', value: 'none vs visibility' },
        { type: 'code', language: 'css', value: '/* display: none — убирает элемент из потока полностью */\n.hidden {\n  display: none;\n  /* Не занимает место, не виден */\n}\n\n/* visibility: hidden — скрывает, но место остаётся */\n.invisible {\n  visibility: hidden;\n  /* Занимает место, но не виден */\n}\n\n/* opacity: 0 — прозрачный, но кликабельный */\n.transparent {\n  opacity: 0;\n  /* Занимает место, невидим, но реагирует на клики */\n}' },
        { type: 'note', value: 'display: flex и display: grid — это тоже значения display. Они делают элемент блочным, но меняют способ компоновки дочерних элементов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Карточки товаров',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте набор карточек товаров, используя блочную модель: padding, margin, border, border-radius.',
      requirements: [
        'Установите глобальный box-sizing: border-box',
        'Создайте .card с border, padding, border-radius и тенью',
        'Добавьте .card-header с border-bottom и padding',
        'Создайте .price как inline-block с фоном и скруглением',
        'Используйте margin для расстояния между карточками',
        'Центрируйте контейнер с карточками через margin: 0 auto'
      ],
      hint: 'Используйте display: inline-block для карточек, чтобы они стояли в ряд, или оберните в flex-контейнер.',
      expectedOutput: 'Ряд из карточек товаров с аккуратными отступами, рамками, скруглёнными углами и ценой в цветном бейдже.',
      solution: '*, *::before, *::after {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: "Inter", sans-serif;\n  background: #f3f4f6;\n  padding: 2rem;\n}\n\n.cards {\n  max-width: 900px;\n  margin: 0 auto;\n  display: flex;\n  gap: 1.5rem;\n}\n\n.card {\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 0;\n  overflow: hidden;\n  width: 280px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n.card-header {\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid #e5e7eb;\n  font-weight: 600;\n  font-size: 1.125rem;\n}\n\n.card-body {\n  padding: 1.5rem;\n}\n\n.price {\n  display: inline-block;\n  background: #dbeafe;\n  color: #1d4ed8;\n  padding: 0.25rem 0.75rem;\n  border-radius: 9999px;\n  font-weight: 600;\n  font-size: 0.875rem;\n}',
      explanation: 'Глобальный border-box упрощает расчёт размеров. Карточки используют flex для расположения в ряд. Padding создаёт внутренние отступы, border-radius скругляет углы, а box-shadow добавляет глубину. Цена оформлена как inline-block бейдж.'
    }
  ]
}
