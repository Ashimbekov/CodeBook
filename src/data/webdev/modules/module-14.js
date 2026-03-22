export default {
  id: 14,
  title: 'JavaScript: основы',
  description: 'Переменные let/const, типы данных, операторы — фундамент JavaScript',
  lessons: [
    {
      id: 1,
      title: 'Что такое JavaScript?',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript — язык программирования, который добавляет интерактивность на веб-страницы. Без JS сайт статичен, с JS — динамичен: кнопки реагируют, данные загружаются, формы проверяются.' },
        { type: 'code', language: 'html', value: '<!-- JS в HTML: подключение -->\n\n<!-- Внешний файл (рекомендуется) -->\n<script src="app.js" defer></script>\n\n<!-- Инлайн-скрипт -->\n<script>\n  console.log("Привет, мир!");\n</script>' },
        { type: 'heading', value: 'Что можно делать с JS?' },
        { type: 'list', items: [
          'Изменять HTML и CSS в реальном времени',
          'Реагировать на действия пользователя (клики, ввод)',
          'Загружать данные с сервера без перезагрузки (AJAX/Fetch)',
          'Хранить данные в браузере (LocalStorage)',
          'Создавать игры, анимации, визуализации'
        ]},
        { type: 'tip', value: 'Открой DevTools (F12) → Console и начни писать JS прямо там! console.log(2 + 2) выведет 4. Это отличный способ экспериментировать.' }
      ]
    },
    {
      id: 2,
      title: 'Переменные: let, const, var',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменные хранят данные. В современном JS используют let и const. var устарел и создаёт проблемы.' },
        { type: 'code', language: 'javascript', value: '// const — константа, нельзя переназначить\nconst name = "Нурдаулет";\nconst age = 20;\nconst PI = 3.14159;\n\n// let — переменная, можно переназначить\nlet score = 0;\nscore = 10;   // OK\nscore += 5;   // score = 15\n\n// var — устаревший, не использовать!\nvar oldWay = "не делай так";\n\n// Нельзя с const\nconst x = 5;\n// x = 10;  // Ошибка: Assignment to constant variable\n\n// Объявление без значения\nlet result;      // undefined\nresult = 42;     // OK' },
        { type: 'tip', value: 'Правило: всегда используй const. Если нужно переназначить — меняй на let. var не использовать никогда.' }
      ]
    },
    {
      id: 3,
      title: 'Типы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'В JavaScript есть 8 типов данных. Первые 7 — примитивы, последний — объект.' },
        { type: 'code', language: 'javascript', value: '// 1. Number — числа\nconst age = 25;\nconst price = 9.99;\nconst infinity = Infinity;\nconst notNumber = NaN; // Not a Number\n\n// 2. String — строки\nconst name = "Алина";\nconst greeting = \'Привет\';\nconst template = `Привет, ${name}!`; // шаблонная строка\n\n// 3. Boolean — логический\nconst isActive = true;\nconst isEmpty = false;\n\n// 4. null — намеренное отсутствие значения\nconst user = null;\n\n// 5. undefined — переменная не задана\nlet score;\nconsole.log(score); // undefined\n\n// 6. Symbol — уникальный идентификатор\nconst id = Symbol("id");\n\n// 7. BigInt — большие целые числа\nconst bigNum = 9007199254740991n;\n\n// 8. Object — объект (включает массивы, функции)\nconst person = { name: "Берик", age: 30 };\nconst nums = [1, 2, 3];\n\n// Проверка типа\nconsole.log(typeof 42);       // "number"\nconsole.log(typeof "hello");  // "string"\nconsole.log(typeof true);     // "boolean"\nconsole.log(typeof null);     // "object" (историческая ошибка JS)' }
      ]
    },
    {
      id: 4,
      title: 'Операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы выполняют операции над значениями.' },
        { type: 'code', language: 'javascript', value: '// Арифметические\nconsole.log(10 + 3);  // 13\nconsole.log(10 - 3);  // 7\nconsole.log(10 * 3);  // 30\nconsole.log(10 / 3);  // 3.333...\nconsole.log(10 % 3);  // 1 (остаток)\nconsole.log(2 ** 10); // 1024 (степень)\n\n// Строковая конкатенация\nconsole.log("Привет, " + "мир!"); // "Привет, мир!"\n\n// Операторы сравнения\nconsole.log(5 > 3);   // true\nconsole.log(5 < 3);   // false\nconsole.log(5 >= 5);  // true\nconsole.log(5 === 5); // true (строгое равенство)\nconsole.log(5 !== 3); // true (строгое неравенство)\nconsole.log(5 == "5"); // true (нестрогое, с преобразованием)\nconsole.log(5 === "5"); // false (строгое, без преобразования)\n\n// Логические\nconsole.log(true && false); // false (И)\nconsole.log(true || false); // true  (ИЛИ)\nconsole.log(!true);         // false (НЕ)\n\n// Присваивание\nlet x = 10;\nx += 5;  // x = 15\nx -= 3;  // x = 12\nx *= 2;  // x = 24\nx /= 4;  // x = 6\nx++;     // x = 7\nx--;     // x = 6' },
        { type: 'warning', value: 'Всегда используй === (строгое равенство) вместо == (нестрогое). == делает автоматическое приведение типов, что часто приводит к неожиданным результатам.' }
      ]
    },
    {
      id: 5,
      title: 'Условные операторы if/else',
      type: 'theory',
      content: [
        { type: 'text', value: 'if/else позволяет выполнять разный код в зависимости от условия.' },
        { type: 'code', language: 'javascript', value: 'const age = 18;\n\n// Простой if\nif (age >= 18) {\n  console.log("Доступ разрешён");\n}\n\n// if/else\nif (age >= 18) {\n  console.log("Взрослый");\n} else {\n  console.log("Несовершеннолетний");\n}\n\n// if/else if/else\nconst score = 75;\nif (score >= 90) {\n  console.log("Отлично");\n} else if (score >= 75) {\n  console.log("Хорошо");\n} else if (score >= 60) {\n  console.log("Удовлетворительно");\n} else {\n  console.log("Неудовлетворительно");\n}\n\n// Тернарный оператор (короткий if/else)\nconst status = age >= 18 ? "Взрослый" : "Ребёнок";\nconsole.log(status); // "Взрослый"\n\n// Switch\nconst day = "понедельник";\nswitch (day) {\n  case "понедельник":\n  case "вторник":\n    console.log("Начало недели");\n    break;\n  case "пятница":\n    console.log("Почти выходные!");\n    break;\n  default:\n    console.log("Будний день");\n}' }
      ]
    },
    {
      id: 6,
      title: 'Циклы: for, while',
      type: 'theory',
      content: [
        { type: 'text', value: 'Циклы позволяют выполнять код повторно.' },
        { type: 'code', language: 'javascript', value: '// for — когда знаем количество итераций\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n\n// while — пока условие истинно\nlet count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}\n\n// do/while — выполнится хотя бы раз\ndo {\n  console.log("Привет");\n  count++;\n} while (count < 3);\n\n// for...of — перебор элементов массива\nconst fruits = ["яблоко", "груша", "банан"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// for...in — перебор ключей объекта\nconst person = { name: "Айгерим", age: 25 };\nfor (const key in person) {\n  console.log(`${key}: ${person[key]}`);\n}\n\n// break и continue\nfor (let i = 0; i < 10; i++) {\n  if (i === 7) break;      // выйти из цикла\n  if (i % 2 === 0) continue; // пропустить чётные\n  console.log(i); // 1, 3, 5\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Калькулятор оценки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию, которая принимает число (0-100) и возвращает оценку.',
      requirements: [
        '90-100 → "Отлично"',
        '75-89 → "Хорошо"',
        '60-74 → "Удовлетворительно"',
        '0-59 → "Неудовлетворительно"',
        'Неверное значение → "Некорректный балл"',
        'Проверь функцию с несколькими значениями через console.log'
      ],
      expectedOutput: 'getGrade(95) → "Отлично"\ngetGrade(80) → "Хорошо"\ngetGrade(55) → "Неудовлетворительно"\ngetGrade(110) → "Некорректный балл"',
      hint: 'Используй if/else if/else. Сначала проверь, что балл в диапазоне 0-100, иначе — некорректный.',
      solution: 'function getGrade(score) {\n  if (typeof score !== "number" || score < 0 || score > 100) {\n    return "Некорректный балл";\n  }\n  if (score >= 90) return "Отлично";\n  if (score >= 75) return "Хорошо";\n  if (score >= 60) return "Удовлетворительно";\n  return "Неудовлетворительно";\n}\n\nconsole.log(getGrade(95));  // Отлично\nconsole.log(getGrade(80));  // Хорошо\nconsole.log(getGrade(65));  // Удовлетворительно\nconsole.log(getGrade(55));  // Неудовлетворительно\nconsole.log(getGrade(110)); // Некорректный балл',
      explanation: 'Проверка on typeof и диапазона идёт первой. Потом if-if-if-return — без else if, потому что каждый return прерывает функцию. Это называется "ранний возврат" (early return) и делает код чище.'
    },
    {
      id: 8,
      title: 'Практика: FizzBuzz',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классическая задача: выведи числа от 1 до 30. Для кратных 3 — "Fizz", для кратных 5 — "Buzz", для кратных и 3 и 5 — "FizzBuzz".',
      requirements: [
        'Цикл от 1 до 30',
        'Кратное 15 → "FizzBuzz" (проверяй первым!)',
        'Кратное 3 → "Fizz"',
        'Кратное 5 → "Buzz"',
        'Остальные — само число',
        'Вывести через console.log'
      ],
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n...\nFizzBuzz\n...',
      hint: 'Для проверки кратности используй оператор % (остаток от деления). i % 3 === 0 — кратно 3. Сначала проверяй i % 15, потом i % 3 и i % 5.',
      solution: 'for (let i = 1; i <= 30; i++) {\n  if (i % 15 === 0) {\n    console.log("FizzBuzz");\n  } else if (i % 3 === 0) {\n    console.log("Fizz");\n  } else if (i % 5 === 0) {\n    console.log("Buzz");\n  } else {\n    console.log(i);\n  }\n}',
      explanation: 'FizzBuzz проверяем первым (i % 15 === 0 или i % 3 === 0 && i % 5 === 0), иначе "FizzBuzz" никогда не сработает. % — оператор остатка от деления: 15 % 3 = 0, 10 % 5 = 0.'
    }
  ]
}
