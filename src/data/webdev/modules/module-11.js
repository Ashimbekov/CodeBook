export default {
  id: 11,
  title: 'CSS: анимации и переходы',
  description: 'Оживи сайт с помощью transition, animation и @keyframes',
  lessons: [
    {
      id: 1,
      title: 'Transition: плавные переходы',
      type: 'theory',
      content: [
        { type: 'text', value: 'transition делает изменение CSS-свойств плавным вместо мгновенного скачка. Идеально для hover-эффектов и интерактивных элементов.' },
        { type: 'code', language: 'css', value: '.button {\n  background: blue;\n  color: white;\n  padding: 12px 24px;\n  border-radius: 6px;\n  transition: background 0.3s ease;\n  /* transition: свойство длительность функция задержка */\n}\n\n.button:hover {\n  background: darkblue;\n}\n\n/* Несколько свойств */\n.card {\n  transform: translateY(0);\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 24px rgba(0,0,0,0.2);\n}\n\n/* Все свойства (не злоупотребляй) */\n.element {\n  transition: all 0.3s ease;\n}' }
      ]
    },
    {
      id: 2,
      title: 'Функции плавности (easing)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция плавности определяет скорость изменения во времени — ускорение, замедление или равномерное движение.' },
        { type: 'code', language: 'css', value: '.box {\n  transition: transform 0.5s ease;          /* медленно, быстро, медленно */\n  transition: transform 0.5s linear;        /* равномерно */\n  transition: transform 0.5s ease-in;       /* медленно → быстро */\n  transition: transform 0.5s ease-out;      /* быстро → медленно */\n  transition: transform 0.5s ease-in-out;   /* медленно → быстро → медленно */\n  \n  /* cubic-bezier: полный контроль */\n  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);\n  /* Bouncy эффект */\n  \n  /* steps: пошагово */\n  transition: transform 0.5s steps(4);\n  /* 4 шага, как анимация кадр за кадром */\n  \n  /* Задержка */\n  transition: opacity 0.3s ease 0.1s; /* задержка 0.1s */\n}' },
        { type: 'tip', value: 'ease-out создаёт самое "живое" ощущение для большинства интерфейсных переходов. ease-in — для элементов, которые "уходят" с экрана.' }
      ]
    },
    {
      id: 3,
      title: 'Transform: трансформации',
      type: 'theory',
      content: [
        { type: 'text', value: 'transform позволяет перемещать, масштабировать, поворачивать и наклонять элементы без изменения потока документа.' },
        { type: 'code', language: 'css', value: '.box {\n  /* Перемещение */\n  transform: translateX(50px);           /* вправо */\n  transform: translateY(-20px);          /* вверх */\n  transform: translate(50px, -20px);     /* вправо и вверх */\n  transform: translate(50%, 0);          /* 50% от своего размера */\n  \n  /* Масштабирование */\n  transform: scale(1.5);                 /* увеличить в 1.5 */\n  transform: scale(0.8);                 /* уменьшить */\n  transform: scaleX(2);                  /* только по X */\n  \n  /* Поворот */\n  transform: rotate(45deg);              /* по часовой */\n  transform: rotate(-90deg);             /* против часовой */\n  \n  /* Наклон */\n  transform: skewX(15deg);\n  \n  /* Комбинация */\n  transform: translateY(-4px) scale(1.02) rotate(3deg);\n}\n\n/* transform не влияет на поток — другие элементы не двигаются */\n/* Анимация transform быстрее, чем изменение top/left! */' },
        { type: 'tip', value: 'Для производительных анимаций используй только transform и opacity. Они анимируются на GPU и не вызывают reflow страницы.' }
      ]
    },
    {
      id: 4,
      title: '@keyframes и animation',
      type: 'theory',
      content: [
        { type: 'text', value: '@keyframes определяет шаги анимации. Свойство animation применяет её к элементу.' },
        { type: 'code', language: 'css', value: '/* Определяем анимацию */\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes spin {\n  0%   { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%       { transform: scale(1.05); }\n}\n\n/* Применяем анимацию */\n.element {\n  animation: fadeIn 0.5s ease forwards;\n  /* имя длительность функция режим-заполнения */\n}\n\n.spinner {\n  animation: spin 1s linear infinite;\n  /* бесконечное вращение */\n}\n\n/* Все параметры */\n.box {\n  animation-name: slideUp;\n  animation-duration: 0.6s;\n  animation-timing-function: ease-out;\n  animation-delay: 0.2s;\n  animation-iteration-count: 1; /* или infinite */\n  animation-direction: normal;  /* или reverse, alternate */\n  animation-fill-mode: forwards; /* сохранить состояние */\n}' }
      ]
    },
    {
      id: 5,
      title: 'Производительность анимаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все CSS-свойства анимируются одинаково быстро. Важно знать, какие свойства вызывают перерасчёт макета.' },
        { type: 'heading', value: 'Дорогие свойства (вызывают reflow)' },
        { type: 'list', items: [
          'width, height — пересчитывает весь макет',
          'top, left, margin, padding — тоже reflow',
          'font-size — меняет размеры текста и блоков'
        ]},
        { type: 'heading', value: 'Дешёвые свойства (только repaint или composite)' },
        { type: 'list', items: [
          'transform: translate/scale/rotate — только composite',
          'opacity — только composite',
          'color, background-color — только repaint'
        ]},
        { type: 'code', language: 'css', value: '/* Плохо: вызывает reflow */\n.bad {\n  transition: width 0.3s, margin-left 0.3s;\n}\n\n/* Хорошо: только composite */\n.good {\n  transition: transform 0.3s, opacity 0.3s;\n}\n\n/* will-change: подсказка браузеру */\n.animated {\n  will-change: transform, opacity;\n  /* Браузер заранее создаст отдельный слой */\n}' }
      ]
    },
    {
      id: 6,
      title: 'prefers-reduced-motion',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые пользователи настраивают систему так, чтобы анимации были минимальными (эпилепсия, укачивание). Уважай это!' },
        { type: 'code', language: 'css', value: '/* Обычные анимации */\n.button {\n  transition: transform 0.3s ease;\n}\n\n.loader {\n  animation: spin 1s linear infinite;\n}\n\n/* Отключаем анимации по настройке системы */\n@media (prefers-reduced-motion: reduce) {\n  .button {\n    transition: none;\n  }\n  \n  .loader {\n    animation: none;\n  }\n  \n  /* Или глобально */\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}' },
        { type: 'tip', value: 'prefers-reduced-motion — небольшое изменение кода, которое значительно улучшает опыт людей с вестибулярными расстройствами. Это хорошая практика доступности.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Анимированный UI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай набор UI-компонентов с красивыми анимациями: кнопки, карточки, лоадер.',
      requirements: [
        'Кнопка с transition на :hover (цвет, тень, сдвиг)',
        'Карточка с hover-эффектом подъёма (translateY)',
        'Лоадер — вращающийся круг (@keyframes spin)',
        'Анимация появления блока (@keyframes fadeInUp)',
        'Пульсирующий бейдж (@keyframes pulse)',
        'Поддержка prefers-reduced-motion'
      ],
      expectedOutput: 'Набор анимированных UI-компонентов',
      hint: 'Для лоадера: border-radius: 50%; border: 4px solid #eee; border-top-color: blue; + spin. Для fadeInUp: from {opacity:0; translateY(20px)} to {opacity:1; translateY(0)}.',
      solution: '/* Анимации */\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n@keyframes fadeInUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50%       { transform: scale(1.1); opacity: 0.8; }\n}\n\n/* Кнопка */\n.btn {\n  padding: 12px 28px;\n  background: #4f46e5;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 15px;\n  cursor: pointer;\n  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;\n}\n.btn:hover {\n  background: #4338ca;\n  transform: translateY(-2px);\n  box-shadow: 0 4px 16px rgba(79,70,229,0.4);\n}\n.btn:active { transform: translateY(0); }\n\n/* Карточка */\n.card {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n  animation: fadeInUp 0.5s ease forwards;\n}\n.card:hover {\n  transform: translateY(-6px);\n  box-shadow: 0 12px 32px rgba(0,0,0,0.15);\n}\n\n/* Лоадер */\n.loader {\n  width: 40px; height: 40px;\n  border-radius: 50%;\n  border: 4px solid #e0e0e0;\n  border-top-color: #4f46e5;\n  animation: spin 0.8s linear infinite;\n}\n\n/* Бейдж */\n.badge {\n  display: inline-block;\n  background: red;\n  color: white;\n  border-radius: 50%;\n  width: 10px; height: 10px;\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}',
      explanation: 'GPU-friendly анимации (transform, opacity) работают плавно даже на мобильных. fill-mode: forwards сохраняет финальное состояние анимации. prefers-reduced-motion делает сайт доступным для всех.'
    }
  ]
}
