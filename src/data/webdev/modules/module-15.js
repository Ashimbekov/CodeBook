export default {
  id: 15,
  title: 'JavaScript: функции',
  description: 'Функции, стрелочные функции, замыкания, область видимости и коллбеки',
  lessons: [
    {
      id: 1,
      title: 'Функции: объявление и вызов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция — именованный блок кода, который можно выполнять многократно. Принимает аргументы, возвращает результат.' },
        { type: 'code', language: 'javascript', value: '// Function Declaration (поднимается, можно вызвать до объявления)\nfunction greet(name) {\n  return `Привет, ${name}!`;\n}\n\nconsole.log(greet("Айгерим")); // "Привет, Айгерим!"\n\n// Function Expression (не поднимается)\nconst add = function(a, b) {\n  return a + b;\n};\n\nconsole.log(add(3, 4)); // 7\n\n// Параметры по умолчанию\nfunction createUser(name, role = "user", active = true) {\n  return { name, role, active };\n}\n\nconsole.log(createUser("Берик"));           // { name: "Берик", role: "user", active: true }\nconsole.log(createUser("Алина", "admin"));  // { name: "Алина", role: "admin", active: true }\n\n// Возврат нескольких значений через деструктуризацию\nfunction getMinMax(arr) {\n  return { min: Math.min(...arr), max: Math.max(...arr) };\n}\n\nconst { min, max } = getMinMax([3, 1, 7, 2, 9]);\nconsole.log(min, max); // 1 9' },
        { type: 'heading', value: 'Function Declaration vs Function Expression' },
        { type: 'list', items: [
          'Function Declaration поднимается (hoisting) — можно вызвать до строки с объявлением',
          'Function Expression не поднимается — вызов до объявления вызовет ошибку',
          'Именованная Function Expression полезна для рекурсии и отладки',
          'Функции без return возвращают undefined',
          'Функции — это объекты первого класса: можно присваивать, передавать, возвращать'
        ]},
        { type: 'tip', value: 'Пиши функции, которые делают одно дело и делают это хорошо. Функция длиннее 20-30 строк — сигнал разбить её на несколько маленьких. Чистые функции (без побочных эффектов) легче тестировать и понимать.' }
      ]
    },
    {
      id: 2,
      title: 'Стрелочные функции (Arrow Functions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стрелочные функции — краткий синтаксис ES6+. Используются везде, где функция коротка или передаётся как аргумент.' },
        { type: 'code', language: 'javascript', value: '// Обычная функция\nfunction square(x) {\n  return x * x;\n}\n\n// Стрелочная функция\nconst square = (x) => {\n  return x * x;\n};\n\n// Краткий синтаксис: один параметр — скобки необязательны\nconst square = x => x * x;\n\n// Нет параметров — пустые скобки\nconst greet = () => "Привет!";\n\n// Несколько параметров\nconst add = (a, b) => a + b;\n\n// Многострочные — нужны скобки и return\nconst createMessage = (name, age) => {\n  const message = `${name}, ${age} лет`;\n  return message;\n};\n\n// Возврат объекта — в скобках!\nconst makeUser = (name) => ({ name, createdAt: new Date() });\n\n// Стрелочные функции в массивах\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]' },
        { type: 'tip', value: 'Стрелочные функции не имеют своего this — они берут его из внешнего контекста. Это удобно в коллбеках, но не подходит для методов объектов и конструкторов.' }
      ]
    },
    {
      id: 3,
      title: 'Область видимости (Scope)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Область видимости определяет, где переменная доступна. let/const имеют блочную область видимости.' },
        { type: 'code', language: 'javascript', value: '// Глобальная область (вне функций)\nconst globalVar = "я глобальная";\n\nfunction outer() {\n  const outerVar = "я в outer";\n  \n  function inner() {\n    const innerVar = "я в inner";\n    console.log(globalVar);  // OK — поднялась вверх\n    console.log(outerVar);   // OK — замыкание\n    console.log(innerVar);   // OK — своя\n  }\n  \n  inner();\n  // console.log(innerVar); // Ошибка! innerVar не видна здесь\n}\n\n// Блочная область с let/const\nif (true) {\n  let blockVar = "блочная";\n  const blockConst = "тоже блочная";\n}\n// console.log(blockVar); // Ошибка!\n\n// var не имеет блочной области — утекает!\nif (true) {\n  var oldVar = "утекает";\n}\nconsole.log(oldVar); // "утекает" — и это плохо' },
        { type: 'heading', value: 'Цепочка областей видимости (Scope Chain)' },
        { type: 'list', items: [
          'Глобальная — доступна везде в программе',
          'Функциональная — создаётся при каждом вызове функции',
          'Блочная (let/const) — внутри {}, if, for, while',
          'При поиске переменной JS идёт от внутренней области к внешней (scope chain)',
          'var игнорирует блочную область — это источник многих ошибок, избегай var'
        ]},
        { type: 'tip', value: 'Минимизируй использование глобальных переменных — они загрязняют глобальное пространство имён и могут конфликтовать с другими скриптами. Оборачивай код в функции или модули для изоляции.' }
      ]
    },
    {
      id: 4,
      title: 'Замыкания (Closures)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Замыкание — когда функция запоминает переменные из своей области видимости, даже после того, как внешняя функция завершила работу.' },
        { type: 'code', language: 'javascript', value: '// Простое замыкание\nfunction makeCounter() {\n  let count = 0; // эта переменная "закрывается" внутри\n  \n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n\n// Каждый вызов makeCounter создаёт новое замыкание\nconst counter2 = makeCounter();\nconsole.log(counter2()); // 1 (независимый счётчик)\n\n// Практическое применение: приватные данные\nfunction createBankAccount(initialBalance) {\n  let balance = initialBalance; // "приватное" поле\n  \n  return {\n    deposit: (amount) => { balance += amount; },\n    withdraw: (amount) => {\n      if (amount > balance) return "Недостаточно средств";\n      balance -= amount;\n    },\n    getBalance: () => balance\n  };\n}\n\nconst account = createBankAccount(1000);\naccount.deposit(500);\nconsole.log(account.getBalance()); // 1500' },
        { type: 'heading', value: 'Практические применения замыканий' },
        { type: 'list', items: [
          'Счётчики и генераторы уникальных ID',
          'Приватные данные (переменные недоступны снаружи)',
          'Частичное применение функций (partial application)',
          'Мемоизация — кеширование результатов вычислений',
          'Обработчики событий, которые "помнят" контекст создания'
        ]},
        { type: 'tip', value: 'Замыкания — одна из ключевых концепций JavaScript. Понимание замыканий объясняет поведение callback-функций в setTimeout, Promise, addEventListener и многих других API.' }
      ]
    },
    {
      id: 5,
      title: 'Функции высшего порядка и коллбеки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции высшего порядка принимают функцию как аргумент или возвращают функцию. Коллбек — функция, передаваемая в другую функцию.' },
        { type: 'code', language: 'javascript', value: '// Функция принимает коллбек\nfunction doTwice(fn) {\n  fn();\n  fn();\n}\n\ndoTwice(() => console.log("Привет!")); // Привет! Привет!\n\n// setTimeout — встроенная функция высшего порядка\nsetTimeout(() => {\n  console.log("Прошла 1 секунда");\n}, 1000);\n\n// Коллбек с аргументами\nfunction transform(arr, callback) {\n  const result = [];\n  for (const item of arr) {\n    result.push(callback(item));\n  }\n  return result;\n}\n\nconst nums = [1, 2, 3];\nconst doubled = transform(nums, x => x * 2);\nconsole.log(doubled); // [2, 4, 6]\n\n// Именно так работают map, filter, reduce\n[1, 2, 3].map(x => x * 2);           // [2, 4, 6]\n[1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]\n[1, 2, 3, 4].reduce((sum, x) => sum + x, 0); // 10' },
        { type: 'tip', value: 'map, filter, reduce — это функции высшего порядка, встроенные в массив. Освоив их, ты сможешь обрабатывать любые данные декларативно и выразительно вместо многострочных for-циклов.' },
        { type: 'list', items: [
          'Функции высшего порядка — функции, принимающие или возвращающие другие функции',
          'Коллбек — функция переданная как аргумент для вызова позже',
          'Это фундамент асинхронного программирования в JavaScript',
          'Встроенные функции высшего порядка: map, filter, reduce, forEach, sort, setTimeout'
        ]},
        { type: 'note', value: 'Проблема коллбеков — "Callback Hell": глубокая вложенность при последовательных асинхронных операциях. Эту проблему решают Promises и async/await, но понимание коллбеков всё равно необходимо.' }
      ]
    },
    {
      id: 6,
      title: 'Rest, Spread и деструктуризация в функциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современный JS предоставляет удобные инструменты для работы с параметрами функций.' },
        { type: 'code', language: 'javascript', value: '// Rest параметры: собирают оставшиеся аргументы\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4, 5)); // 15\n\n// Spread: разворачивает массив в аргументы\nconst nums = [3, 1, 4, 1, 5, 9];\nconsole.log(Math.max(...nums)); // 9\n\n// Деструктуризация параметра объекта\nfunction displayUser({ name, age = 0, role = "user" }) {\n  console.log(`${name}, ${age}, ${role}`);\n}\n\ndisplayUser({ name: "Алина", age: 25 });\n\n// Деструктуризация массива\nfunction getCoords([x, y, z = 0]) {\n  return { x, y, z };\n}\n\nconsole.log(getCoords([10, 20])); // { x: 10, y: 20, z: 0 }' },
        { type: 'heading', value: 'Разница между Rest и Spread' },
        { type: 'list', items: [
          'Spread (...) разворачивает массив/объект в отдельные элементы: Math.max(...arr)',
          'Rest (...) собирает оставшиеся элементы в массив: function f(a, b, ...rest)',
          'Один и тот же синтаксис ..., но разный смысл в зависимости от контекста',
          'Rest всегда должен быть последним параметром функции',
          'Spread можно использовать в любом месте: [...a, newItem, ...b]',
          'Деструктуризация объекта: const { a, ...rest } = obj — rest содержит оставшиеся поля'
        ]},
        { type: 'tip', value: 'Деструктуризация в параметрах функции делает API более читаемым: вместо f(name, age, role) пишут f({ name, age, role }). Это позволяет передавать параметры в любом порядке и указывать только нужные.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Генератор паролей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функцию generatePassword, которая создаёт случайный пароль.',
      requirements: [
        'Параметры: length (длина, default 12), useUppercase, useNumbers, useSymbols',
        'Буквы: строчные всегда, заглавные — если useUppercase',
        'Цифры — если useNumbers',
        'Символы !@#$%^&* — если useSymbols',
        'Функция случайного символа из набора',
        'Проверь с разными настройками'
      ],
      expectedOutput: 'generatePassword() → что-то вроде "kF3pQm7xLn2a"\ngeneratePassword(8, false, false, false) → "qwertasy"',
      hint: 'Составь строку доступных символов, потом в цикле выбирай случайные символы через Math.random() и String.prototype.charAt.',
      solution: 'function generatePassword(length = 12, useUppercase = true, useNumbers = true, useSymbols = false) {\n  const lower = "abcdefghijklmnopqrstuvwxyz";\n  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";\n  const numbers = "0123456789";\n  const symbols = "!@#$%^&*";\n  \n  let chars = lower;\n  if (useUppercase) chars += upper;\n  if (useNumbers) chars += numbers;\n  if (useSymbols) chars += symbols;\n  \n  let password = "";\n  for (let i = 0; i < length; i++) {\n    const randomIndex = Math.floor(Math.random() * chars.length);\n    password += chars[randomIndex];\n  }\n  \n  return password;\n}\n\nconsole.log(generatePassword());              // 12 символов, всё кроме символов\nconsole.log(generatePassword(8, false, false, false));  // только строчные\nconsole.log(generatePassword(16, true, true, true));    // всё',
      explanation: 'Функция строит строку доступных символов, потом в цикле выбирает случайный. Math.random() возвращает 0..1, Math.floor() округляет вниз. Параметры по умолчанию делают функцию гибкой.'
    }
  ]
}
