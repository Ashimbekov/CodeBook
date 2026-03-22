export default {
  id: 6,
  title: 'CSS: основы',
  description: 'Селекторы, свойства, каскад и специфичность — фундамент работы со стилями в CSS',
  lessons: [
    {
      id: 1,
      title: 'Что такое CSS и как его подключить',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSS (Cascading Style Sheets) — язык стилей, который описывает внешний вид HTML-элементов: цвета, размеры, шрифты, отступы, расположение.' },
        { type: 'heading', value: 'Три способа добавить CSS' },
        { type: 'code', language: 'html', value: '<!-- 1. Внешний файл (рекомендуется) -->\n<link rel="stylesheet" href="style.css">\n\n<!-- 2. Внутри тега style -->\n<style>\n  p { color: red; }\n</style>\n\n<!-- 3. Инлайн-стиль (не рекомендуется) -->\n<p style="color: red; font-size: 16px;">Текст</p>' },
        { type: 'tip', value: 'Всегда используй внешний CSS-файл. Это позволяет переиспользовать стили на всём сайте, кешировать файл браузером и легко поддерживать код.' },
        { type: 'heading', value: 'Синтаксис CSS' },
        { type: 'code', language: 'css', value: '/* Это комментарий в CSS */\n\nселектор {\n  свойство: значение;\n  другое-свойство: другое-значение;\n}\n\n/* Пример: */\np {\n  color: #333333;\n  font-size: 16px;\n  line-height: 1.5;\n}' }
      ]
    },
    {
      id: 2,
      title: 'Простые селекторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Селектор указывает, к каким HTML-элементам применить стили.' },
        { type: 'code', language: 'css', value: '/* Селектор тега */\np { color: gray; }\nh1 { font-size: 32px; }\n\n/* Селектор класса (начинается с точки) */\n.button { background: blue; }\n.card { border: 1px solid #ccc; }\n\n/* Селектор id (начинается с #) */\n#header { background: black; }\n#main-content { padding: 20px; }\n\n/* Универсальный селектор */\n* { box-sizing: border-box; }\n\n/* Группировка (через запятую) */\nh1, h2, h3 { font-family: Arial, sans-serif; }' },
        { type: 'tip', value: 'Используй классы (.) для стилизации большинства элементов. id (#) оставь для якорей и JavaScript. Стилизация по id — плохая практика из-за высокой специфичности.' }
      ]
    },
    {
      id: 3,
      title: 'Комбинаторы и псевдоклассы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Комбинаторы позволяют выбирать элементы по их положению в DOM. Псевдоклассы — по состоянию.' },
        { type: 'code', language: 'css', value: '/* Потомок (пробел) - любой уровень вложенности */\n.nav a { color: white; }\n\n/* Дочерний (>) - только прямые дети */\n.nav > li { display: inline; }\n\n/* Соседний (+) - следующий элемент */\nh2 + p { font-size: 18px; }\n\n/* Братья (~) - все следующие братья */\nh2 ~ p { color: gray; }\n\n/* Псевдоклассы */\na:hover { color: red; }           /* при наведении мыши */\na:visited { color: purple; }      /* посещённая ссылка */\na:focus { outline: 2px solid blue; } /* при фокусе */\nbutton:active { opacity: 0.8; }   /* при нажатии */\n\n/* Структурные псевдоклассы */\nli:first-child { font-weight: bold; }\nli:last-child { margin-bottom: 0; }\nli:nth-child(2n) { background: #f0f0f0; } /* чётные строки */\nli:nth-child(odd) { background: white; }  /* нечётные */\np:not(.special) { color: gray; }' },
        { type: 'heading', value: 'Псевдоэлементы' },
        { type: 'code', language: 'css', value: '/* ::before и ::after — добавляют контент до/после элемента */\n.button::before {\n  content: ">> ";\n}\n\n/* ::first-line — первая строка текста */\np::first-line {\n  font-weight: bold;\n}\n\n/* ::placeholder — стиль подсказки в input */\ninput::placeholder {\n  color: #aaa;\n  font-style: italic;\n}' },
        { type: 'tip', value: 'Используй > (дочерний) вместо пробела (потомок) когда нужно стилизовать только прямые дочерние элементы. Это ограничивает область применения стилей и предотвращает непреднамеренные эффекты на вложенные элементы.' }
      ]
    },
    {
      id: 4,
      title: 'Каскад в CSS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каскад — это механизм, по которому браузер решает, какой стиль применить, когда на один элемент действуют несколько правил.' },
        { type: 'heading', value: 'Порядок приоритета (от низкого к высокому)' },
        { type: 'list', items: [
          '1. Стили браузера по умолчанию (User Agent Stylesheet)',
          '2. Стили пользователя (настройки браузера)',
          '3. Стили разработчика (твой CSS)',
          '4. !important (экстренный перегруз)',
          '5. Инлайн-стили style="..." с !important'
        ]},
        { type: 'code', language: 'css', value: '/* Чем позже написан стиль — тем выше приоритет */\np { color: red; }\np { color: blue; }  /* синий победит */\n\n/* !important перебивает всё (используй редко!) */\np { color: red !important; }\np { color: blue; }  /* красный победит из-за !important */\n\n/* Порядок подключения файлов важен */\n/* style1.css подключён до style2.css */\n/* стили из style2.css имеют больший приоритет */' },
        { type: 'warning', value: '!important — крайняя мера. Если ты часто используешь !important, это признак плохой архитектуры CSS. Реши проблему специфичностью, а не !important.' }
      ]
    },
    {
      id: 5,
      title: 'Специфичность (Specificity)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Специфичность — это вес (приоритет) CSS-правила. Чем специфичнее селектор, тем выше его приоритет.' },
        { type: 'heading', value: 'Как считается специфичность' },
        { type: 'list', items: [
          'Инлайн style="" — 1,0,0,0 (самый высокий)',
          '#id — 0,1,0,0',
          '.class, :pseudo-class, [attr] — 0,0,1,0',
          'тег, ::pseudo-element — 0,0,0,1'
        ]},
        { type: 'code', language: 'css', value: '/* Специфичность: (0,0,0,1) */\np { color: black; }\n\n/* Специфичность: (0,0,1,0) */\n.text { color: blue; }\n\n/* Специфичность: (0,1,0,0) */\n#main { color: green; }\n\n/* Специфичность: (0,0,1,1) — класс + тег */\ndiv.text { color: red; }\n\n/* Специфичность: (0,1,1,1) — id + класс + тег */\n#main .text p { color: orange; }' },
        { type: 'tip', value: 'Думай о специфичности как о числе 0-0-0-0. id добавляет 0-1-0-0. Класс — 0-0-1-0. Тег — 0-0-0-1. Победит тот, у кого число больше.' }
      ]
    },
    {
      id: 6,
      title: 'Наследование свойств',
      type: 'theory',
      content: [
        { type: 'text', value: 'Некоторые CSS-свойства наследуются дочерними элементами от родителей. Другие — нет.' },
        { type: 'code', language: 'css', value: '/* Наследуемые свойства (можно задавать на родителе) */\nbody {\n  font-family: Arial, sans-serif; /* все элементы унаследуют */\n  font-size: 16px;                /* все элементы унаследуют */\n  color: #333;                    /* все элементы унаследуют */\n  line-height: 1.5;               /* все элементы унаследуют */\n}\n\n/* Ненаследуемые свойства */\n/* background, border, margin, padding,\n   width, height, display, position — НЕ наследуются */\n\n/* Принудительное наследование */\n.child {\n  border: inherit;    /* наследует border родителя */\n  background: inherit;\n}\n\n/* Начальное значение */\n.reset {\n  color: initial;    /* возвращает значение по умолчанию браузера */\n}' },
        { type: 'tip', value: 'Используй наследование. Задай font-family, font-size и color на body — и всё наследует эти значения. Это сэкономит много строк CSS.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Стилизация страницы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай CSS-файл для стилизации HTML-страницы с использованием разных типов селекторов.',
      requirements: [
        'Задай font-family и color на body',
        'Стилизуй заголовки h1, h2 (размер, цвет, отступы)',
        'Добавь стиль для .card (рамка, фон, отступ)',
        'Используй псевдокласс :hover для ссылок',
        'Используй li:nth-child(odd) для чередования фона в списке',
        'Продемонстрируй разницу между .red и #main в специфичности'
      ],
      expectedOutput: 'CSS-файл с разными типами селекторов',
      hint: 'Начни с глобальных стилей (body, *), потом добавляй более специфичные. :hover работает для любого элемента, не только ссылок.',
      solution: '/* style.css */\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  color: #333;\n  line-height: 1.6;\n  background-color: #f5f5f5;\n  padding: 20px;\n}\n\nh1 {\n  font-size: 36px;\n  color: #222;\n  margin-bottom: 16px;\n}\n\nh2 {\n  font-size: 24px;\n  color: #444;\n  margin-bottom: 12px;\n}\n\na {\n  color: #0077cc;\n  text-decoration: none;\n}\n\na:hover {\n  color: #ff4400;\n  text-decoration: underline;\n}\n\n.card {\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  padding: 20px;\n  margin-bottom: 16px;\n}\n\nul li:nth-child(odd) {\n  background-color: #f0f8ff;\n}\n\nul li {\n  padding: 8px 16px;\n}\n\n#main {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.red { color: red; }\n/* Если применить оба к одному элементу <p id="main" class="red"> */\n/* #main выиграет у .red по специфичности */',
      explanation: 'Мы использовали разные типы селекторов: теговые (body, h1), классы (.card), id (#main), псевдоклассы (:hover), структурные псевдоклассы (:nth-child). Порядок от общего к частному — хорошая практика CSS.'
    },
    {
      id: 8,
      title: 'Практика: Понимание специфичности',
      type: 'practice',
      difficulty: 'medium',
      description: 'Предскажи и проверь, какой цвет получит каждый элемент с учётом специфичности.',
      requirements: [
        'Создай HTML с элементами, к которым применяются конкурирующие стили',
        'Объясни, почему победил тот или иной стиль',
        'Использй минимум 5 разных комбинаций селекторов',
        'Проверь в браузере через DevTools'
      ],
      expectedOutput: 'Правильные предсказания цветов с объяснениями',
      hint: 'Открой DevTools > Elements > Styles, чтобы увидеть зачёркнутые (проигравшие) стили.',
      solution: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <style>\n    /* Специфичность теста */\n    p { color: black; }               /* 0-0-0-1 */\n    .blue { color: blue; }            /* 0-0-1-0 */\n    p.blue { color: green; }          /* 0-0-1-1 */\n    #special { color: red; }          /* 0-1-0-0 */\n    div p { color: gray; }            /* 0-0-0-2 */\n  </style>\n</head>\n<body>\n  <div>\n    <!-- Какой цвет? gray (0-0-0-2) > black (0-0-0-1) -->\n    <p>Я буду серым</p>\n    <!-- Какой цвет? green (0-0-1-1) > blue (0-0-1-0) > gray (0-0-0-2) -->\n    <p class="blue">Я буду зелёным</p>\n    <!-- Какой цвет? red (0-1-0-0) > green (0-0-1-1) -->\n    <p id="special" class="blue">Я буду красным</p>\n  </div>\n</body>\n</html>',
      explanation: 'Специфичность работает как многозначное число: (id, классы, теги). Тег — (0,0,1), класс — (0,1,0), id — (1,0,0). Сравниваем слева направо: 0-1-0-0 > 0-0-1-1 > 0-0-1-0 > 0-0-0-2 > 0-0-0-1.'
    }
  ]
}
