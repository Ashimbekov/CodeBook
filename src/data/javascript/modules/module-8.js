export default {
  id: 8,
  title: 'Стрелочные функции',
  description: 'Синтаксис стрелочных функций, this, implicit return и отличия от обычных функций',
  lessons: [
    {
      id: 1,
      title: 'Синтаксис стрелочных функций',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Стрелочные функции (arrow functions) — краткий синтаксис функций введённый в ES6. Они имеют неявный возврат для однострочных выражений.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Полный синтаксис\nconst add = (a, b) => {\n  return a + b;\n};\n\n// Неявный возврат (implicit return) — без {} и return\nconst multiply = (a, b) => a * b;\n\n// Один параметр — скобки опциональны\nconst double = n => n * 2;\nconst square = n => n * n;\n\n// Без параметров — скобки обязательны\nconst getTime = () => Date.now();\nconst getHello = () => "Hello!";\n\n// Возврат объекта — нужны скобки!\nconst makeUser = (name, age) => ({ name, age });\n// Без скобок {} воспринималось бы как тело функции!\nconsole.log(makeUser("Alice", 30)); // {name:"Alice", age:30}\n\n// Многострочная стрелочная функция\nconst processData = (data) => {\n  const filtered = data.filter(x => x > 0);\n  const doubled = filtered.map(x => x * 2);\n  return doubled;\n};\nconsole.log(processData([-1, 2, -3, 4, 5])); // [4, 8, 10]\n\n// В методах массивов — лаконично\nconst nums = [1, 2, 3, 4, 5];\nconst evens = nums.filter(n => n % 2 === 0);\nconst doubled = nums.map(n => n * 2);\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(evens, doubled, sum); // [2,4] [2,4,6,8,10] 15'
        },
        {
          type: 'tip',
          value: 'При возврате объекта литерала в неявном возврате ОБЯЗАТЕЛЬНО оберните его в скобки: () => ({ key: value }). Иначе {} будет интерпретирован как тело функции.'
        }
      ]
    },
    {
      id: 2,
      title: 'this в стрелочных функциях',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Ключевое отличие стрелочных функций: они НЕ имеют собственного this. this берётся из окружающего лексического контекста (lexical this).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Обычная функция — this зависит от вызова\nconst obj1 = {\n  name: "Alice",\n  greet: function() {\n    console.log("Привет от", this.name); // this = obj1\n  },\n  greetLater: function() {\n    setTimeout(function() {\n      // this.name === undefined! В setTimeout this = window/undefined\n      console.log("Позже от", this?.name);\n    }, 100);\n  }\n};\nobj1.greet(); // "Привет от Alice"\n\n// Стрелочная функция — this из лексического контекста\nconst obj2 = {\n  name: "Bob",\n  greet: () => {\n    // this НЕ obj2! this = внешний контекст (module scope = undefined)\n    console.log("Привет от", this?.name);\n  },\n  greetLater() {\n    setTimeout(() => {\n      // this = obj2 (из метода greetLater)\n      console.log("Позже от", this.name); // "Bob"\n    }, 100);\n  }\n};\nobj2.greetLater();\n\n// Правило: стрелочные функции в методах объекта\nclass Timer {\n  constructor() {\n    this.ticks = 0;\n  }\n  start() {\n    // стрелочная функция захватывает this из start()\n    this.interval = setInterval(() => {\n      this.ticks++; // this = Timer экземпляр\n      console.log("Tick:", this.ticks);\n    }, 1000);\n  }\n  stop() {\n    clearInterval(this.interval);\n  }\n}'
        },
        {
          type: 'warning',
          value: 'НЕ используйте стрелочные функции для методов объектов (они не имеют собственного this). Используйте их для callbacks и вложенных функций где нужен this родительского контекста.'
        }
      ]
    },
    {
      id: 3,
      title: 'Отличия от обычных функций',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Стрелочные функции отличаются от обычных не только синтаксисом, но и поведением.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// 1. Нет собственного this (уже разобрали)\n\n// 2. Нет arguments объекта\nconst arrowArgs = (...args) => args; // используйте rest!\nconst regularArgs = function() {\n  return Array.from(arguments);\n};\nconsole.log(regularArgs(1, 2, 3)); // [1, 2, 3]\nconsole.log(arrowArgs(1, 2, 3));   // [1, 2, 3]\n\n// 3. Нельзя использовать как конструктор\nconst ArrowClass = () => {};\n// const obj = new ArrowClass(); // TypeError!\n\nconst RegularClass = function() {\n  this.value = 42;\n};\nconst obj = new RegularClass(); // OK\n\n// 4. Нет prototype свойства\nconsole.log(typeof ArrowClass.prototype); // undefined\nconsole.log(typeof RegularClass.prototype); // "object"\n\n// 5. Нельзя использовать как генераторы\n// const gen = *() => {}; // SyntaxError!\n\n// 6. Нет hoisting (как function expression)\n// console.log(arrowFn()); // ReferenceError\nconst arrowFn = () => "hello";\n\n// Когда использовать что\n// Стрелочные: callbacks, higher-order functions, короткие функции\nconst evens = [1,2,3,4].filter(n => n % 2 === 0);\n\n// Обычные: методы объектов, конструкторы, генераторы\nconst obj2 = {\n  value: 10,\n  getValue() { return this.value; } // метод объекта\n};'
        },
        {
          type: 'heading',
          value: 'Итог: когда использовать'
        },
        {
          type: 'text',
          value: 'Стрелочные функции: callbacks, методы массивов (map/filter), вложенные функции нуждающиеся в this родителя.\nОбычные функции: методы объектов/классов, конструкторы (function/class), когда нужен arguments, генераторы.'
        }
      ]
    },
    {
      id: 4,
      title: 'Implicit return и продвинутые паттерны',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Неявный возврат делает код лаконичным. Продвинутые паттерны с стрелочными функциями.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Цепочки методов с стрелочными функциями\nconst result = [1, -2, 3, -4, 5]\n  .filter(n => n > 0)        // [1, 3, 5]\n  .map(n => n * n)            // [1, 9, 25]\n  .reduce((sum, n) => sum + n, 0); // 35\nconsole.log(result);\n\n// Каррирование\nconst add = a => b => a + b;\nconst add5 = add(5);\nconsole.log(add5(3)); // 8\nconsole.log(add(10)(20)); // 30\n\n// Точечный стиль (point-free)\nconst isPositive = n => n > 0;\nconst double = n => n * 2;\nconst positiveDoubles = arr => arr.filter(isPositive).map(double);\nconsole.log(positiveDoubles([-1, 2, -3, 4])); // [4, 8]\n\n// Условие как выражение\nconst clamp = (value, min, max) =>\n  Math.min(Math.max(value, min), max);\nconsole.log(clamp(15, 0, 10)); // 10\nconsole.log(clamp(-5, 0, 10)); // 0\nconsole.log(clamp(5, 0, 10));  // 5\n\n// Пайплайн данных\nconst pipeline = (...fns) => (x) => fns.reduce((v, fn) => fn(v), x);\nconst process = pipeline(\n  x => x.trim(),\n  x => x.toLowerCase(),\n  x => x.replace(/\\s+/g, "-")\n);\nconsole.log(process("  Hello World  ")); // "hello-world"'
        },
        { type: 'list', items: [
          'Implicit return: однострочная стрелочная функция возвращает выражение без return',
          'Для возврата объекта оберни в скобки: n => ({ id: n }) — иначе {} трактуется как блок',
          'Каррирование: a => b => a + b — цепочка стрелочных функций, каждая принимает 1 аргумент',
          'Точечный стиль (point-free) передаёт функции без явных аргументов: .map(double)',
          'Пайплайн: последовательное применение функций — функциональная альтернатива цепочкам методов'
        ]},
        { type: 'tip', value: 'Когда implicit return работает: n => n * 2, arr => arr.filter(Boolean). Когда нужны скобки: n => ({ id: n }) для объекта, n => { const x = n * 2; return x; } для многострочной логики.' }
      ]
    },
    {
      id: 5,
      title: 'this и bind/call/apply',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'call, apply, bind — методы для явного указания this при вызове функции.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// call — вызов с конкретным this и аргументами\nfunction greet(greeting, punctuation) {\n  return `${greeting}, ${this.name}${punctuation}`;\n}\nconst user = { name: "Alice" };\nconsole.log(greet.call(user, "Привет", "!")); // "Привет, Alice!"\n\n// apply — как call, но аргументы массивом\nconsole.log(greet.apply(user, ["Здравствуйте", "."]));\n\n// bind — создаёт новую функцию с привязанным this\nconst greetAlice = greet.bind(user, "Добрый день");\nconsole.log(greetAlice("!")); // "Добрый день, Alice!"\nconsole.log(greetAlice("?")); // "Добрый день, Alice?"\n\n// Практический пример\nconst button = {\n  text: "Click me",\n  onClick() {\n    console.log("Кнопка:", this.text);\n  }\n};\n\n// Потеря this\nconst handler = button.onClick;\n// handler(); // TypeError или undefined: this не button!\n\n// Решения:\nconst boundHandler = button.onClick.bind(button);\nboundHandler(); // работает!\n\n// Или стрелочная функция\nconst arrowHandler = () => button.onClick();\narrowHandler(); // тоже работает'
        },
        {
          type: 'note',
          value: 'call и apply вызывают функцию сразу с конкретным this. bind создаёт новую функцию с привязанным this (вызывается позже). Для стрелочных функций bind не влияет на this — они используют лексический this.'
        }
      ]
    },
    {
      id: 6,
      title: 'Стрелочные функции: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте стрелочные функции и неявный возврат для лаконичного кода.',
      requirements: [
        'Перепишите следующие функции в виде стрелочных с неявным возвратом:\n  - function square(n) { return n * n; }\n  - function toUpper(str) { return str.toUpperCase(); }\n  - function makePoint(x, y) { return { x, y }; }\n  - function getFirst(arr) { return arr[0]; }',
        'Реализуйте функцию createMultiplier(factor) — возвращает стрелочную функцию умножающую на factor',
        'Реализуйте функцию pipeline(...transforms) — применяет преобразования к строке последовательно',
        'pipeline(s=>s.trim(), s=>s.toLowerCase(), s=>s.replace(/ /g,"-"))("  Hello World  ") -> "hello-world"'
      ],
      expectedOutput: 'square(5) -> 25\nmakePoint(1,2) -> {x:1, y:2}\ncreateMultiplier(3)(7) -> 21\npipeline(trim, lower, slugify)(" Hello World ") -> "hello-world"',
      hint: 'Однострочные без return: const square = n => n * n;\nОбъект: const makePoint = (x, y) => ({ x, y });\ncreateMult: factor => n => n * factor\npipeline: (...fns) => (input) => fns.reduce((v, fn) => fn(v), input)',
      solution: '// Переписанные функции\nconst square = n => n * n;\nconst toUpper = str => str.toUpperCase();\nconst makePoint = (x, y) => ({ x, y });\nconst getFirst = arr => arr[0];\n\n// createMultiplier\nconst createMultiplier = factor => n => n * factor;\n\nconst double = createMultiplier(2);\nconst triple = createMultiplier(3);\nconst byTen = createMultiplier(10);\n\n// pipeline\nconst pipeline = (...transforms) => input =>\n  transforms.reduce((value, fn) => fn(value), input);\n\n// Тесты\nconsole.log(square(5));      // 25\nconsole.log(square(12));     // 144\nconsole.log(toUpper("hello")); // "HELLO"\nconsole.log(makePoint(3, 4)); // {x:3, y:4}\nconsole.log(getFirst([1,2,3])); // 1\n\nconsole.log(double(5));  // 10\nconsole.log(triple(4)); // 12\nconsole.log(byTen(7));  // 70\nconsole.log(createMultiplier(3)(7)); // 21\n\nconst slugify = pipeline(\n  s => s.trim(),\n  s => s.toLowerCase(),\n  s => s.replace(/\\s+/g, "-"),\n  s => s.replace(/[^a-z0-9-]/g, "")\n);\nconsole.log(slugify("  Hello World! "));  // "hello-world"\nconsole.log(slugify("  Привет Мир! "));   // "-"\n\n// Работа с данными\nconst users = [\n  { name: "Alice", age: 30, active: true },\n  { name: "Bob", age: 25, active: false },\n  { name: "Charlie", age: 35, active: true }\n];\nconst activeNames = users\n  .filter(u => u.active)\n  .map(u => u.name)\n  .sort();\nconsole.log(activeNames); // ["Alice", "Charlie"]',
      explanation: 'Неявный возврат убирает ключевое слово return для однострочных выражений. Объектный литерал в неявном возврате требует скобок: (x, y) => ({ x, y }). createMultiplier — пример каррирования с двумя стрелочными функциями: factor => n => n * factor. pipeline — функциональная композиция: reduce применяет каждую трансформацию к результату предыдущей.'
    }
  ]
};
