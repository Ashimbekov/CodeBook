export default {
  id: 1,
  title: 'Введение в JavaScript',
  description: 'Основы JavaScript: история, особенности, первая программа, среда выполнения',
  lessons: [
    {
      id: 1,
      title: 'Что такое JavaScript',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript — это высокоуровневый, динамически типизированный язык программирования. Изначально создан для добавления интерактивности на веб-страницы, сегодня используется везде: браузер, сервер (Node.js), мобильные приложения, IoT.'
        },
        {
          type: 'heading',
          value: 'Ключевые характеристики'
        },
        {
          type: 'text',
          value: '• Интерпретируемый (JIT-компилируемый в современных движках)\n• Динамическая типизация\n• Прототипное наследование\n• Функции как объекты первого класса\n• Однопоточная модель с event loop'
        },
        {
          type: 'heading',
          value: 'История'
        },
        {
          type: 'text',
          value: '1995 — Brendan Eich создал JavaScript за 10 дней для Netscape.\n1997 — ECMAScript 1 (стандартизация).\n2009 — ES5 (строгий режим, JSON, Array методы).\n2015 — ES6/ES2015 (классы, стрелочные функции, let/const).\nС 2016 — ежегодные обновления стандарта.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Первая программа\nconsole.log("Hello, World!");\n\n// JavaScript в браузере\ndocument.getElementById("title").textContent = "Привет!";\n\n// JavaScript на сервере (Node.js)\nconst http = require("http");\nhttp.createServer((req, res) => {\n  res.end("Hello from Node!");\n}).listen(3000);'
        },
        {
          type: 'tip',
          value: 'JavaScript не связан с Java — это разные языки. Название было маркетинговым ходом для привлечения популярности Java.'
        }
      ]
    },
    {
      id: 2,
      title: 'Среда выполнения и инструменты',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript выполняется в двух основных средах: браузер и Node.js. Понимание среды выполнения важно для написания корректного кода.'
        },
        {
          type: 'heading',
          value: 'Браузер'
        },
        {
          type: 'text',
          value: '• Chrome — движок V8\n• Firefox — движок SpiderMonkey\n• Safari — движок JavaScriptCore\nДоступны: window, document, DOM, fetch, localStorage'
        },
        {
          type: 'heading',
          value: 'Node.js'
        },
        {
          type: 'text',
          value: '• Построен на движке V8\n• Доступны: fs, http, path, process\n• НЕТ: window, document, DOM'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Определение среды\nif (typeof window !== "undefined") {\n  console.log("Браузер");\n} else if (typeof process !== "undefined") {\n  console.log("Node.js");\n}\n\n// console.log — работает везде\nconsole.log("Строка");\nconsole.log(42, true, [1, 2, 3]);\nconsole.error("Ошибка!");\nconsole.warn("Предупреждение!");\nconsole.table([{a: 1}, {a: 2}]);'
        },
        {
          type: 'heading',
          value: 'Инструменты разработчика'
        },
        {
          type: 'text',
          value: '• DevTools (F12) — отладка в браузере\n• Console — выполнение JS кода\n• Sources — точки останова (breakpoints)\n• Network — анализ запросов\n• Node.js REPL — интерактивная консоль'
        },
        {
          type: 'tip',
          value: 'Используйте console.log активно при отладке. В production удаляйте отладочные вызовы или используйте специальные библиотеки логирования.'
        }
      ]
    },
    {
      id: 3,
      title: 'Переменные и типы данных (обзор)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript имеет 8 типов данных: 7 примитивных и 1 составной (объект). Переменные объявляются через let, const или var (устаревший способ).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Примитивные типы\nlet str = "строка";           // string\nlet num = 42;                 // number\nlet big = 9007199254740993n;  // bigint\nlet bool = true;             // boolean\nlet nothing = null;          // null\nlet undef;                   // undefined\nlet sym = Symbol("id");      // symbol\n\n// Составной тип\nlet obj = { name: "Alice" }; // object\nlet arr = [1, 2, 3];         // тоже object\nlet fn = () => {};           // function (тоже object)\n\n// typeof\nconsole.log(typeof str);     // "string"\nconsole.log(typeof num);     // "number"\nconsole.log(typeof null);    // "object" (историческая ошибка!)\nconsole.log(typeof undef);   // "undefined"\nconsole.log(typeof fn);      // "function"'
        },
        {
          type: 'warning',
          value: 'typeof null === "object" — известная ошибка в спецификации, сохранённая для обратной совместимости. Для проверки на null используйте строгое сравнение: value === null'
        },
        {
          type: 'heading',
          value: 'let vs const vs var'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// const — нельзя переприсвоить\nconst PI = 3.14159;\n// PI = 3; // TypeError!\n\n// Но объект const можно изменять\nconst user = { name: "Bob" };\nuser.name = "Alice"; // OK — меняем свойство\n// user = {}; // TypeError — нельзя переприсвоить\n\n// let — можно переприсвоить\nlet count = 0;\ncount = 1; // OK\n\n// var — устаревший, избегайте его\nvar x = 10; // function scope, hoisting'
        },
        {
          type: 'tip',
          value: 'Правило: всегда используйте const по умолчанию. Переходите на let только когда нужно переприсвоить. Никогда не используйте var в новом коде.'
        }
      ]
    },
    {
      id: 4,
      title: 'Операторы и выражения',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript поддерживает все стандартные операторы: арифметические, логические, операторы сравнения и специальные операторы ES6+.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Арифметические\nconsole.log(10 + 3);   // 13\nconsole.log(10 - 3);   // 7\nconsole.log(10 * 3);   // 30\nconsole.log(10 / 3);   // 3.333...\nconsole.log(10 % 3);   // 1 (остаток)\nconsole.log(2 ** 10);  // 1024 (возведение в степень)\n\n// Инкремент/декремент\nlet n = 5;\nconsole.log(n++); // 5 (возвращает, потом увеличивает)\nconsole.log(n);   // 6\nconsole.log(++n); // 7 (увеличивает, потом возвращает)\n\n// Логические\nconsole.log(true && false); // false\nconsole.log(true || false); // true\nconsole.log(!true);         // false\n\n// Специальные\nconsole.log(null ?? "default");    // "default" (nullish coalescing)\nconsole.log(undefined ?? "def");   // "def"\nconsole.log(0 ?? "def");           // 0 (не null/undefined)\n\nconst obj = null;\nconsole.log(obj?.name);            // undefined (optional chaining)'
        },
        {
          type: 'heading',
          value: 'Операторы присваивания'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'let x = 10;\nx += 5;  // x = x + 5 = 15\nx -= 3;  // x = x - 3 = 12\nx *= 2;  // x = x * 2 = 24\nx /= 4;  // x = x / 4 = 6\nx **= 2; // x = x ** 2 = 36\nx ??= "default"; // присвоить если null/undefined\n// x уже 36, поэтому не изменится\n\nlet y = null;\ny ??= "hello"; // y = "hello"'
        },
        {
          type: 'note',
          value: 'Оператор ?? (nullish coalescing) отличается от ||: он возвращает правый операнд только если левый равен null или undefined. || возвращает правый при любом ложном значении (0, "", false, NaN).'
        }
      ]
    },
    {
      id: 5,
      title: 'Строки в JavaScript',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Строки в JavaScript неизменяемы (immutable). Есть три способа записи: одинарные кавычки, двойные кавычки и шаблонные литералы (backticks).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const single = \'одинарные кавычки\';\nconst double = "двойные кавычки";\nconst template = `шаблонный литерал`;\n\n// Шаблонные литералы — интерполяция\nconst name = "Alice";\nconst age = 30;\nconst message = `Привет, ${name}! Тебе ${age} лет.`;\nconst expr = `2 + 2 = ${2 + 2}`;\n\n// Многострочные строки\nconst multi = `Строка 1\nСтрока 2\nСтрока 3`;\n\n// Методы строк\nconst str = "Hello, World!";\nconsole.log(str.length);          // 13\nconsole.log(str.toUpperCase());   // "HELLO, WORLD!"\nconsole.log(str.toLowerCase());   // "hello, world!"\nconsole.log(str.includes("World")); // true\nconsole.log(str.startsWith("He")); // true\nconsole.log(str.endsWith("!"));   // true\nconsole.log(str.slice(7, 12));    // "World"\nconsole.log(str.replace("World", "JS")); // "Hello, JS!"\nconsole.log(str.split(", "));    // ["Hello", "World!"]\nconsole.log("  trim  ".trim());  // "trim"\nconsole.log(str.indexOf("o"));   // 4\nconsole.log(str.at(-1));         // "!" (с конца)'
        },
        {
          type: 'heading',
          value: 'Экранирование'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'console.log("Новая\\nстрока");  // перенос строки\nconsole.log("Таб\\tстрока");    // табуляция\nconsole.log("Кавычка \\"");      // экранирование кавычки\nconsole.log("Слэш \\\\");         // обратный слэш\n\n// Числа в строку и обратно\nconst n = 42;\nconsole.log(String(n));       // "42"\nconsole.log(n.toString());    // "42"\nconsole.log(n.toString(2));   // "101010" (бинарное)\nconsole.log(parseInt("42"));  // 42\nconsole.log(parseFloat("3.14")); // 3.14\nconsole.log(+"42");           // 42 (унарный плюс)'
        },
        {
          type: 'tip',
          value: 'Используйте шаблонные литералы (backticks) для строк с интерполяцией. Они значительно читаемее конкатенации через +.'
        }
      ]
    },
    {
      id: 6,
      title: 'Первая программа: Практика',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию greet, которая возвращает приветственное сообщение.',
      requirements: [
        'Реализуйте функцию greet(name, age) — принимает имя и возраст',
        'Возвращает строку: "Привет, {name}! Тебе {age} лет."',
        'Если age не передан, используйте значение по умолчанию 0',
        'Если name не передан, используйте "Незнакомец"',
        'greet("Alice", 30) -> "Привет, Alice! Тебе 30 лет."'
      ],
      expectedOutput: 'greet("Alice", 30) -> "Привет, Alice! Тебе 30 лет."\ngreet("Bob") -> "Привет, Bob! Тебе 0 лет."\ngreet() -> "Привет, Незнакомец! Тебе 0 лет."',
      hint: 'Используйте параметры по умолчанию: function greet(name = "Незнакомец", age = 0)\nИспользуйте шаблонный литерал для возврата строки',
      solution: 'function greet(name = "Незнакомец", age = 0) {\n  return `Привет, ${name}! Тебе ${age} лет.`;\n}\n\nconsole.log(greet("Alice", 30));\nconsole.log(greet("Bob"));\nconsole.log(greet());\n\n// Стрелочная функция\nconst greetArrow = (name = "Незнакомец", age = 0) =>\n  `Привет, ${name}! Тебе ${age} лет.`;\n\nconsole.log(greetArrow("Charlie", 25));',
      explanation: 'Параметры по умолчанию (default parameters) появились в ES6. Они применяются когда аргумент не передан или передан undefined. Шаблонные литералы с ${} делают интерполяцию читаемой и удобной. Стрелочная функция с неявным возвратом (без {}) — лаконичный синтаксис для простых функций.'
    },
    {
      id: 7,
      title: 'Работа с числами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Исследуйте особенности числового типа в JavaScript.',
      requirements: [
        'Реализуйте функцию isInteger(n) — возвращает true если число целое',
        'Реализуйте функцию roundTo(n, decimals) — округляет до нужного количества знаков',
        'Реализуйте функцию formatNumber(n) — форматирует число с разделителями тысяч',
        'Реализуйте функцию inRange(n, min, max) — проверяет попадание в диапазон [min, max]',
        'Проверьте: isInteger(4.0) -> true, roundTo(3.14159, 2) -> 3.14'
      ],
      expectedOutput: 'isInteger(42) -> true\nisInteger(42.5) -> false\nisInteger(4.0) -> true\nroundTo(3.14159, 2) -> 3.14\nformatNumber(1234567) -> "1,234,567"\ninRange(5, 1, 10) -> true\ninRange(15, 1, 10) -> false',
      hint: 'isInteger: Number.isInteger(n) или n % 1 === 0\nroundTo: используйте Number(n.toFixed(decimals))\nformatNumber: n.toLocaleString("en-US") или Intl.NumberFormat\ninRange: n >= min && n <= max',
      solution: 'function isInteger(n) {\n  return Number.isInteger(n);\n}\n\nfunction roundTo(n, decimals) {\n  return Number(n.toFixed(decimals));\n}\n\nfunction formatNumber(n) {\n  return new Intl.NumberFormat("en-US").format(n);\n}\n\nfunction inRange(n, min, max) {\n  return n >= min && n <= max;\n}\n\n// Тесты\nconsole.log(isInteger(42));       // true\nconsole.log(isInteger(42.5));     // false\nconsole.log(isInteger(4.0));      // true\nconsole.log(roundTo(3.14159, 2)); // 3.14\nconsole.log(roundTo(3.145, 2));   // 3.15\nconsole.log(formatNumber(1234567)); // "1,234,567"\nconsole.log(inRange(5, 1, 10));   // true\nconsole.log(inRange(15, 1, 10));  // false\n\n// Особенности чисел\nconsole.log(Number.MAX_SAFE_INTEGER); // 9007199254740991\nconsole.log(0.1 + 0.2);           // 0.30000000000000004!\nconsole.log(roundTo(0.1 + 0.2, 1)); // 0.3',
      explanation: 'Number.isInteger() точнее чем n % 1 === 0 для особых значений. toFixed() возвращает строку, Number() конвертирует обратно. Intl.NumberFormat — стандартный API для локализованного форматирования чисел. Проблема с плавающей точкой (0.1 + 0.2 ≠ 0.3) — известная особенность IEEE 754, решается округлением.'
    }
  ]
};
