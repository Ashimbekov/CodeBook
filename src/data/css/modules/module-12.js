export default {
  id: 12,
  title: 'Трансформации',
  description: 'Transform, translate, rotate, scale, perspective и 3D-трансформации в CSS.',
  lessons: [
    {
      id: 1,
      title: '2D-трансформации: translate, rotate, scale',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS transform изменяет визуальное представление элемента без влияния на layout. Элемент может быть сдвинут, повёрнут и масштабирован, оставаясь в потоке на прежнем месте.' },
        { type: 'heading', value: 'Основные трансформации' },
        { type: 'code', language: 'css', value: '/* translate — перемещение */\n.move {\n  transform: translateX(50px);        /* вправо на 50px */\n  transform: translateY(-20px);       /* вверх на 20px */\n  transform: translate(50px, -20px);  /* оба сразу */\n  transform: translate(50%, 0);       /* % от СВОЕГО размера */\n}\n\n/* rotate — вращение */\n.spin {\n  transform: rotate(45deg);           /* по часовой на 45° */\n  transform: rotate(-90deg);          /* против часовой */\n  transform: rotate(0.5turn);         /* пол-оборота */\n}\n\n/* scale — масштабирование */\n.grow {\n  transform: scale(1.2);              /* увеличение на 20% */\n  transform: scale(0.8);              /* уменьшение на 20% */\n  transform: scaleX(1.5);             /* только по X */\n  transform: scale(1.5, 0.8);         /* X и Y отдельно */\n}\n\n/* skew — наклон */\n.tilt {\n  transform: skewX(10deg);            /* наклон по X */\n  transform: skew(10deg, 5deg);       /* X и Y */\n}' },
        { type: 'heading', value: 'Комбинирование трансформаций' },
        { type: 'code', language: 'css', value: '/* Несколько трансформаций в одном правиле */\n.element {\n  transform: translateX(100px) rotate(45deg) scale(1.2);\n  /* Порядок ВАЖЕН! Трансформации применяются справа налево */\n}\n\n/* Центрирование через translate */\n.centered {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  /* -50% от СВОЕГО размера — точное центрирование */\n}' },
        { type: 'tip', value: 'translate(50%) перемещает на 50% от размера САМОГО элемента, а не родителя. Это ключ к центрированию: top: 50% + translateY(-50%) ставит элемент точно по центру.' }
      ]
    },
    {
      id: 2,
      title: 'transform-origin — точка трансформации',
      type: 'theory',
      content: [
        { type: 'text', value: 'transform-origin задаёт точку, относительно которой происходят трансформации. По умолчанию — центр элемента (50% 50%).' },
        { type: 'heading', value: 'Примеры transform-origin' },
        { type: 'code', language: 'css', value: '/* По умолчанию: центр */\n.default { transform-origin: center; }  /* 50% 50% */\n\n/* Углы */\n.top-left     { transform-origin: top left; }      /* 0% 0% */\n.top-right    { transform-origin: top right; }     /* 100% 0% */\n.bottom-left  { transform-origin: bottom left; }   /* 0% 100% */\n.bottom-right { transform-origin: bottom right; }  /* 100% 100% */\n\n/* Произвольные значения */\n.custom { transform-origin: 20% 80%; }\n\n/* Практика: вращение иконки из центра нижней стороны */\n.pendulum {\n  transform-origin: top center;\n  animation: swing 2s ease-in-out infinite;\n}\n\n@keyframes swing {\n  0%, 100% { transform: rotate(15deg); }\n  50%      { transform: rotate(-15deg); }\n}' },
        { type: 'heading', value: 'Практические примеры' },
        { type: 'code', language: 'css', value: '/* Раскрытие меню сверху */\n.dropdown {\n  transform-origin: top;\n  transform: scaleY(0);  /* свёрнуто */\n  transition: transform 0.2s ease;\n}\n\n.dropdown.open {\n  transform: scaleY(1);  /* раскрыто */\n}\n\n/* Зум фото от курсора (нужен JS для позиции) */\n.zoomable {\n  transition: transform 0.3s ease;\n}\n\n.zoomable:hover {\n  transform: scale(1.5);\n  /* transform-origin задаётся через JS по позиции курсора */\n}' },
        { type: 'note', value: 'При hover-анимациях меню/dropdown всегда задавайте transform-origin. Меню должно раскрываться ОТ кнопки, а не из центра.' }
      ]
    },
    {
      id: 3,
      title: '3D-трансформации',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS поддерживает 3D-трансформации: вращение вокруг осей X и Y, перемещение по Z и управление перспективой.' },
        { type: 'heading', value: '3D-трансформации' },
        { type: 'code', language: 'css', value: '/* Вращение вокруг осей */\n.rotateX { transform: rotateX(45deg); }  /* вокруг горизонтальной оси */\n.rotateY { transform: rotateY(45deg); }  /* вокруг вертикальной оси */\n.rotateZ { transform: rotateZ(45deg); }  /* = обычный rotate() */\n\n/* 3D-перемещение */\n.move3d { transform: translateZ(50px); }  /* ближе к зрителю */\n.move3d { transform: translate3d(10px, 20px, 50px); }  /* X, Y, Z */\n\n/* scale3d */\n.scale3d { transform: scaleZ(2); }  /* эффект виден только с perspective */\n\n/* Произвольная ось вращения */\n.custom {\n  transform: rotate3d(1, 1, 0, 45deg);  /* вращение вокруг диагонали */\n}' },
        { type: 'heading', value: 'Perspective — глубина 3D' },
        { type: 'code', language: 'css', value: '/* perspective — расстояние от зрителя до элемента */\n\n/* На родителе (общая перспектива для всех детей) */\n.container {\n  perspective: 1000px;  /* 800-1200px — естественно */\n  /* Маленькое значение = сильный эффект */\n  /* Большое значение = слабый эффект */\n}\n\n.card {\n  transform: rotateY(30deg);  /* выглядит объёмно */\n}\n\n/* На самом элементе */\n.element {\n  transform: perspective(1000px) rotateY(30deg);\n  /* Каждый элемент имеет свою перспективу */\n}\n\n/* perspective-origin — точка схода */\n.container {\n  perspective: 1000px;\n  perspective-origin: center;  /* по умолчанию */\n  perspective-origin: left top; /* точка схода — левый верхний угол */\n}' },
        { type: 'tip', value: 'perspective: 800-1200px даёт реалистичный 3D-эффект. Значения < 500px создают искажённый, «рыбий глаз» эффект.' }
      ]
    },
    {
      id: 4,
      title: '3D-эффект переворота карточки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flip card — классический 3D-эффект: при наведении карточка переворачивается, показывая обратную сторону. Это одна из самых популярных CSS-анимаций.' },
        { type: 'heading', value: 'Flip Card' },
        { type: 'code', language: 'css', value: '/* Контейнер для 3D-эффекта */\n.flip-card {\n  width: 300px;\n  height: 200px;\n  perspective: 1000px;  /* 3D-пространство */\n}\n\n/* Внутренний контейнер — вращается */\n.flip-card-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transition: transform 0.6s ease;\n  transform-style: preserve-3d;  /* ОБЯЗАТЕЛЬНО для 3D */\n}\n\n/* При наведении — переворот */\n.flip-card:hover .flip-card-inner {\n  transform: rotateY(180deg);\n}\n\n/* Лицевая и обратная стороны */\n.flip-front,\n.flip-back {\n  position: absolute;\n  inset: 0;\n  backface-visibility: hidden;  /* скрывает обратную сторону */\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.flip-front {\n  background: #3b82f6;\n  color: white;\n}\n\n.flip-back {\n  background: #8b5cf6;\n  color: white;\n  transform: rotateY(180deg);  /* изначально перевёрнута */\n}' },
        { type: 'heading', value: 'Ключевые свойства 3D' },
        { type: 'code', language: 'css', value: '/* transform-style: preserve-3d */\n/* Дочерние элементы остаются в 3D-пространстве */\n.container3d {\n  transform-style: preserve-3d;\n  /* Без этого дети будут плоскими */\n}\n\n/* backface-visibility */\n/* Скрывает обратную сторону при вращении */\n.card-face {\n  backface-visibility: hidden;\n  /* Без этого текст виден зеркально через обратную сторону */\n}' },
        { type: 'note', value: 'transform-style: preserve-3d «ломается» при overflow: hidden на родителе. Если 3D-эффект не работает — проверьте overflow на всех предках.' }
      ]
    },
    {
      id: 5,
      title: 'Индивидуальные transform-свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современный CSS позволяет задавать translate, rotate и scale как отдельные свойства. Это упрощает анимации и устраняет проблему переопределения transform.' },
        { type: 'heading', value: 'Новые свойства (Chrome 104+, Safari 14.1+)' },
        { type: 'code', language: 'css', value: '/* Старый подход — всё в одном transform */\n.old {\n  transform: translateX(100px) rotate(45deg) scale(1.2);\n}\n\n/* При hover нужно повторить ВСЕ значения! */\n.old:hover {\n  transform: translateX(100px) rotate(45deg) scale(1.3);\n  /* Если забыть translate — элемент прыгнет */\n}\n\n/* Новый подход — отдельные свойства */\n.new {\n  translate: 100px 0;\n  rotate: 45deg;\n  scale: 1.2;\n}\n\n.new:hover {\n  scale: 1.3;  /* Другие трансформации не затронуты! */\n}' },
        { type: 'heading', value: 'Анимация отдельных свойств' },
        { type: 'code', language: 'css', value: '/* Разные transition для разных трансформаций */\n.card {\n  translate: 0 0;\n  rotate: 0deg;\n  scale: 1;\n  transition:\n    translate 0.3s ease,\n    rotate 0.5s ease-out,\n    scale 0.2s ease;\n}\n\n.card:hover {\n  translate: 0 -10px;\n  rotate: 2deg;\n  scale: 1.02;\n}\n\n/* Каждая трансформация анимируется независимо */\n@keyframes complex {\n  50% {\n    translate: 100px 0;\n    rotate: 180deg;  /* scale не указан — остаётся прежним */\n  }\n}' },
        { type: 'tip', value: 'Индивидуальные translate, rotate, scale — будущее CSS. Они решают главную боль: больше не нужно дублировать весь transform при изменении одного значения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: 3D-карточка профиля',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте интерактивную 3D-карточку профиля с flip-эффектом, hover-трансформациями и перспективой.',
      requirements: [
        'Flip card: при наведении карточка переворачивается на 180°',
        'Лицевая сторона: фото, имя, должность',
        'Обратная сторона: контактная информация и ссылки',
        'transform-style: preserve-3d и backface-visibility: hidden',
        'Плавный transition 0.6s',
        'Эффект перспективы на контейнере (perspective: 1000px)'
      ],
      hint: 'Структура: .flip-card > .flip-inner > (.flip-front + .flip-back). Обе стороны — absolute, inset: 0. Обратная сторона: transform: rotateY(180deg).',
      expectedOutput: '3D-карточка профиля, которая плавно переворачивается при наведении, показывая контактную информацию на обратной стороне.',
      solution: '.flip-card {\n  width: 320px;\n  height: 400px;\n  perspective: 1000px;\n  cursor: pointer;\n}\n\n.flip-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transition: transform 0.6s ease;\n  transform-style: preserve-3d;\n}\n\n.flip-card:hover .flip-inner {\n  transform: rotateY(180deg);\n}\n\n.flip-front,\n.flip-back {\n  position: absolute;\n  inset: 0;\n  backface-visibility: hidden;\n  border-radius: 16px;\n  box-shadow: 0 8px 30px rgba(0,0,0,0.12);\n  overflow: hidden;\n}\n\n.flip-front {\n  background: white;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  padding: 2rem;\n}\n\n.flip-front .avatar {\n  width: 120px;\n  height: 120px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n\n.flip-front h2 {\n  font-size: 1.5rem;\n  margin: 0;\n}\n\n.flip-front p {\n  color: #64748b;\n  margin: 0;\n}\n\n.flip-back {\n  background: linear-gradient(135deg, #3b82f6, #8b5cf6);\n  color: white;\n  transform: rotateY(180deg);\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  padding: 2rem;\n  gap: 1.5rem;\n}\n\n.flip-back a {\n  color: white;\n  text-decoration: none;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}',
      explanation: 'perspective на контейнере создаёт 3D-пространство. transform-style: preserve-3d позволяет дочерним элементам существовать в 3D. backface-visibility скрывает обратную сторону каждой грани. Обратная сторона заранее повёрнута на 180° и становится видна при перевороте.'
    }
  ]
}
