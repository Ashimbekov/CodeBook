export default {
  id: 7,
  title: 'Функции',
  description: 'Function declaration, expression, hoisting, IIFE, параметры и возврат значений',
  lessons: [
    {
      id: 1,
      title: 'Function Declaration',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Function Declaration (объявление функции) — создание именованной функции с ключевым словом function. Поднимается (hoisting) полностью.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Function Declaration\nfunction greet(name) {\n  return `Привет, ${name}!`;\n}\nconsole.log(greet("Alice")); // "Привет, Alice!"\n\n// Hoisting: можно вызвать до объявления\nconsole.log(add(2, 3)); // 5 — работает!\nfunction add(a, b) {\n  return a + b;\n}\n\n// Параметры по умолчанию\nfunction createUser(name, role = "user", active = true) {\n  return { name, role, active };\n}\nconsole.log(createUser("Alice"));             // {name:"Alice", role:"user", active:true}\nconsole.log(createUser("Bob", "admin"));      // {name:"Bob", role:"admin", active:true}\nconsole.log(createUser("Charlie", undefined, false)); // role = "user" (undefined -> default)\n\n// Rest параметры\nfunction sum(...numbers) {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}\nconsole.log(sum(1, 2, 3));        // 6\nconsole.log(sum(1, 2, 3, 4, 5)); // 15\n\n// Смесь параметров\nfunction log(level, ...messages) {\n  console.log(`[${level}]`, ...messages);\n}\nlog("INFO", "Server", "started", "at", "port 3000");'
        },
        {
          type: 'tip',
          value: 'Rest параметр (...args) всегда должен быть последним. Он собирает все оставшиеся аргументы в массив.'
        }
      ]
    },
    {
      id: 2,
      title: 'Function Expression',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Function Expression (функциональное выражение) — функция как значение, присваиваемое переменной. НЕ поднимается (только переменная, не тело).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Function Expression\nconst multiply = function(a, b) {\n  return a * b;\n};\nconsole.log(multiply(4, 5)); // 20\n\n// Именованное Function Expression (NFE)\nconst factorial = function fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1); // fact доступна ВНУТРИ\n};\nconsole.log(factorial(5)); // 120\n// console.log(fact(5)); // ReferenceError — fact недоступна снаружи\n\n// Function Expression в объектах\nconst math = {\n  add: function(a, b) { return a + b; },\n  sub: function(a, b) { return a - b; }\n};\nconsole.log(math.add(5, 3)); // 8\n\n// Функции как аргументы (callback)\nconst nums = [3, 1, 4, 1, 5, 9, 2, 6];\nconst sorted = nums.sort(function(a, b) {\n  return a - b;\n});\nconsole.log(sorted); // [1, 1, 2, 3, 4, 5, 6, 9]\n\n// Функции как возвращаемые значения\nfunction multiplier(factor) {\n  return function(n) {\n    return n * factor;\n  };\n}\nconst double = multiplier(2);\nconst triple = multiplier(3);\nconsole.log(double(5));  // 10\nconsole.log(triple(5)); // 15'
        },
        { type: 'list', items: [
          'Function Expression не поднимается (hoisting): нельзя вызвать до объявления',
          'Function Declaration поднимается полностью — можно вызвать выше объявления',
          'Именованный FE (NFE): имя доступно только внутри функции — полезно для рекурсии',
          'Функции в JS — объекты первого класса: передаются как аргументы, возвращаются',
          'Замыкание (closure): функция захватывает переменные внешней области видимости'
        ]},
        { type: 'tip', value: 'Когда использовать Function Expression: когда функция нужна как значение (callback, результат функции, условное присвоение). Function Declaration — когда функция используется до её определения в коде.' }
      ]
    },
    {
      id: 3,
      title: 'Параметры: arguments, spread, деструктуризация',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript предоставляет несколько способов работы с параметрами функций.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// arguments объект (только в обычных функциях, не стрелочных)\nfunction legacySum() {\n  let total = 0;\n  for (let i = 0; i < arguments.length; i++) {\n    total += arguments[i];\n  }\n  return total;\n}\nconsole.log(legacySum(1, 2, 3)); // 6\n\n// Современный подход — rest\nconst modernSum = (...args) => args.reduce((a, b) => a + b, 0);\n\n// Spread при вызове\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(Math.max(...numbers)); // 5\nconsole.log(modernSum(...numbers)); // 15\n\n// Деструктуризация параметров\nfunction displayUser({ name, age, role = "user" }) {\n  console.log(`${name} (${age}) — ${role}`);\n}\ndisplayUser({ name: "Alice", age: 30, role: "admin" });\ndisplayUser({ name: "Bob", age: 25 });\n\n// Деструктуризация массива параметров\nfunction firstAndRest([first, ...rest]) {\n  return { first, rest };\n}\nconsole.log(firstAndRest([1, 2, 3, 4])); // {first: 1, rest: [2,3,4]}\n\n// Сложная деструктуризация\nfunction processConfig({\n  host = "localhost",\n  port = 3000,\n  db: { name: dbName = "mydb", pool = 5 } = {}\n} = {}) {\n  return `${host}:${port} db=${dbName} pool=${pool}`;\n}\nconsole.log(processConfig({ port: 8080, db: { name: "proddb" } }));\nconsole.log(processConfig()); // все значения по умолчанию'
        },
        {
          type: 'note',
          value: 'arguments — устаревший способ, не работает в стрелочных функциях. Используйте rest параметры (...args) — они создают настоящий массив с доступом ко всем Array методам.'
        }
      ]
    },
    {
      id: 4,
      title: 'IIFE (Immediately Invoked Function Expression)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'IIFE — функция, которая определяется и сразу вызывается. Используется для создания изолированной области видимости.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// IIFE синтаксис\n(function() {\n  const private_var = "недоступна снаружи";\n  console.log("IIFE выполнена");\n})();\n\n// Стрелочная IIFE\n(() => {\n  console.log("Arrow IIFE");\n})();\n\n// IIFE с возвратом значения\nconst result = (function() {\n  const data = [1, 2, 3, 4, 5];\n  return data.reduce((a, b) => a + b, 0);\n})();\nconsole.log(result); // 15\n\n// IIFE с параметрами\n(function(global, factory) {\n  console.log("Module pattern:", typeof global);\n})(globalThis, function() {});\n\n// Модульный паттерн (до ES6 модулей)\nconst Counter = (function() {\n  let count = 0; // приватная переменная\n  return {\n    increment() { count++; },\n    decrement() { count--; },\n    value() { return count; }\n  };\n})();\n\nCounter.increment();\nCounter.increment();\nconsole.log(Counter.value()); // 2\n// console.log(count); // ReferenceError\n\n// Async IIFE — для await на верхнем уровне (до ES2022)\n(async () => {\n  // await работает здесь\n  const data = await Promise.resolve("загружено");\n  console.log(data);\n})();'
        },
        {
          type: 'note',
          value: 'В современном коде IIFE менее нужны — ES6 модули дают изоляцию. Но они полезны для async кода на верхнем уровне (до Top-Level Await ES2022) и изоляции блоков кода.'
        }
      ]
    },
    {
      id: 5,
      title: 'Чистые функции и side effects',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Чистая функция (pure function) всегда возвращает одинаковый результат для одинаковых аргументов и не имеет побочных эффектов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Чистая функция\nfunction add(a, b) {\n  return a + b; // зависит только от аргументов\n}\n\n// Нечистая — зависит от внешнего состояния\nlet discount = 0.1;\nfunction applyDiscount(price) {\n  return price * (1 - discount); // зависит от discount!\n}\n\n// Нечистая — изменяет аргументы (side effect)\nfunction addItem(arr, item) {\n  arr.push(item); // мутирует входной массив!\n  return arr;\n}\n\n// Чистая версия\nfunction addItemPure(arr, item) {\n  return [...arr, item]; // создаёт новый массив\n}\n\n// Нечистая — изменяет внешний объект\nconst user = { name: "Alice", visits: 0 };\nfunction trackVisit(user) {\n  user.visits++; // мутация!\n}\n\n// Чистая версия\nconst trackVisitPure = (user) => ({ ...user, visits: user.visits + 1 });\n\n// Преимущества чистых функций\nconst arr1 = [1, 2, 3];\nconst arr2 = addItemPure(arr1, 4);\nconsole.log(arr1); // [1, 2, 3] — неизменён\nconsole.log(arr2); // [1, 2, 3, 4]'
        },
        {
          type: 'tip',
          value: 'Чистые функции легко тестировать, предсказуемы и безопасны для параллельного выполнения. Стремитесь к чистым функциям, изолируйте side effects.'
        }
      ]
    },
    {
      id: 6,
      title: 'Рекурсия',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Рекурсия — функция вызывает сама себя. Важно: базовый случай (условие выхода) и уменьшение задачи к нему.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Факториал\nfunction factorial(n) {\n  if (n <= 1) return 1; // базовый случай\n  return n * factorial(n - 1); // рекурсивный случай\n}\nconsole.log(factorial(5)); // 120\n\n// Числа Фибоначчи (неэффективно — экспоненциальное время!)\nfunction fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\n// С мемоизацией (эффективно)\nfunction fibMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n  return memo[n];\n}\nconsole.log(fibMemo(40)); // быстро!\n\n// Рекурсивный обход дерева\nfunction sumTree(node) {\n  if (!node) return 0;\n  return node.value + sumTree(node.left) + sumTree(node.right);\n}\n\nconst tree = {\n  value: 1,\n  left: { value: 2, left: { value: 4, left: null, right: null }, right: null },\n  right: { value: 3, left: null, right: null }\n};\nconsole.log(sumTree(tree)); // 10'
        },
        { type: 'list', items: [
          'Каждая рекурсия должна иметь базовый случай (условие выхода) — иначе бесконечный цикл',
          'Рекурсия без оптимизации Фибоначчи — экспоненциальная сложность O(2^n)',
          'Мемоизация кэширует результаты вычислений — превращает O(2^n) в O(n)',
          'Стек вызовов ограничен (около 10 000 уровней) — глубокая рекурсия даёт Stack Overflow',
          'Хвостовая рекурсия (tail recursion) оптимизируется компилятором, но JS её не оптимизирует'
        ]},
        { type: 'tip', value: 'Правило рекурсии: 1) определи базовый случай (когда возвращаем значение без рекурсии), 2) убедись что рекурсивный вызов приближает задачу к базовому случаю. Для деревьев и вложенных структур рекурсия обычно элегантнее итерации.' }
      ]
    },
    {
      id: 7,
      title: 'Функции: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте утилитарные функции высшего порядка.',
      requirements: [
        'Реализуйте функцию curry(fn) — преобразует fn в каррированную версию',
        'curry((a,b,c) => a+b+c)(1)(2)(3) -> 6',
        'curry((a,b,c) => a+b+c)(1,2)(3) -> 6',
        'Реализуйте функцию compose(...fns) — композиция функций справа налево',
        'compose(x => x+1, x => x*2)(3) -> 7 (сначала *2, потом +1)',
        'Реализуйте функцию partial(fn, ...args) — частичное применение',
        'partial(Math.pow, 2)(10) -> 1024'
      ],
      expectedOutput: 'curry(add)(1)(2)(3) -> 6\ncurry(add)(1,2)(3) -> 6\ncompose(x=>x+1, x=>x*2)(3) -> 7\npartial(Math.pow, 2)(10) -> 1024',
      hint: 'curry: function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...more) => curried(...args, ...more); }\ncompose: fns.reduceRight((acc, fn) => fn(acc), value)\npartial: (...moreArgs) => fn(...preArgs, ...moreArgs)',
      solution: 'function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn(...args);\n    }\n    return (...moreArgs) => curried(...args, ...moreArgs);\n  };\n}\n\nfunction compose(...fns) {\n  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);\n}\n\nfunction partial(fn, ...preArgs) {\n  return (...moreArgs) => fn(...preArgs, ...moreArgs);\n}\n\n// Тесты curry\nconst add3 = curry((a, b, c) => a + b + c);\nconsole.log(add3(1)(2)(3));   // 6\nconsole.log(add3(1, 2)(3));   // 6\nconsole.log(add3(1)(2, 3));   // 6\nconsole.log(add3(1, 2, 3));   // 6\n\nconst multiply = curry((a, b) => a * b);\nconst double = multiply(2);\nconst triple = multiply(3);\nconsole.log(double(5));  // 10\nconsole.log(triple(4)); // 12\n\n// Тесты compose\nconst transform = compose(\n  x => x + 1,  // 3. прибавить 1\n  x => x * 2,  // 2. умножить на 2\n  x => x - 1   // 1. вычесть 1\n);\nconsole.log(transform(3)); // ((3-1)*2)+1 = 5\n\n// Тесты partial\nconst pow2 = partial(Math.pow, 2);\nconsole.log(pow2(10)); // 1024\nconsole.log(pow2(8));  // 256\n\nconst greetWith = partial((greeting, name) => `${greeting}, ${name}!`, "Привет");\nconsole.log(greetWith("Alice")); // "Привет, Alice!"',
      explanation: 'curry использует fn.length (количество объявленных параметров) для определения когда функция полностью применена. Если переданных аргументов достаточно — вызывает fn, иначе возвращает новую curried функцию с накопленными аргументами. compose использует reduceRight чтобы применять функции справа налево (математическое определение композиции). partial создаёт новую функцию с предустановленными первыми аргументами.'
    },
    {
      id: 8,
      title: 'IIFE и модульный паттерн: практика',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте модульный паттерн для создания инкапсулированного модуля.',
      requirements: [
        'Создайте IIFE-модуль StorageModule с методами:\n  - set(key, value, ttl=null) — сохраняет значение, опционально с временем жизни (мс)\n  - get(key) — возвращает значение или null если истекло/не существует\n  - delete(key) — удаляет ключ\n  - clear() — очищает всё\n  - size() — количество активных записей\n  - keys() — список активных ключей',
        'Данные должны быть приватными (недоступны извне)',
        'TTL: если задан, запись автоматически считается просроченной'
      ],
      expectedOutput: 'StorageModule.set("user", {name:"Alice"}, 5000)\nStorageModule.get("user") -> {name:"Alice"}\n// через > 5000мс:\nStorageModule.get("user") -> null\nStorageModule.size() -> количество активных записей',
      hint: 'IIFE возвращает объект с публичными методами\nПриватные данные: const store = new Map();\nTTL: store.set(key, { value, expiresAt: ttl ? Date.now() + ttl : null })\nget: проверяем entry.expiresAt && Date.now() > entry.expiresAt',
      solution: 'const StorageModule = (function() {\n  const store = new Map();\n  const stats = { hits: 0, misses: 0, sets: 0 };\n\n  function isExpired(entry) {\n    return entry.expiresAt !== null && Date.now() > entry.expiresAt;\n  }\n\n  function cleanup() {\n    for (const [key, entry] of store) {\n      if (isExpired(entry)) store.delete(key);\n    }\n  }\n\n  return {\n    set(key, value, ttl = null) {\n      store.set(key, {\n        value,\n        expiresAt: ttl !== null ? Date.now() + ttl : null,\n        createdAt: Date.now()\n      });\n      stats.sets++;\n      return this;\n    },\n\n    get(key) {\n      const entry = store.get(key);\n      if (!entry) {\n        stats.misses++;\n        return null;\n      }\n      if (isExpired(entry)) {\n        store.delete(key);\n        stats.misses++;\n        return null;\n      }\n      stats.hits++;\n      return entry.value;\n    },\n\n    delete(key) {\n      return store.delete(key);\n    },\n\n    clear() {\n      store.clear();\n      return this;\n    },\n\n    size() {\n      cleanup();\n      return store.size;\n    },\n\n    keys() {\n      cleanup();\n      return [...store.keys()];\n    },\n\n    getStats() {\n      const total = stats.hits + stats.misses;\n      return {\n        ...stats,\n        hitRate: total > 0 ? (stats.hits / total).toFixed(2) : 0\n      };\n    }\n  };\n})();\n\n// Тесты\nStorageModule.set("user", { name: "Alice", age: 30 });\nStorageModule.set("config", { theme: "dark" }, 100); // 100ms TTL\nStorageModule.set("session", "abc123", 50000);\n\nconsole.log("user:", StorageModule.get("user"));\nconsole.log("config:", StorageModule.get("config"));\nconsole.log("size:", StorageModule.size()); // 3\n\n// Симулируем истечение TTL\nconst entry = StorageModule.get("config"); // достаём сейчас\nsetTimeout(() => {\n  console.log("config after 200ms:", StorageModule.get("config")); // null\n  console.log("size after expiry:", StorageModule.size()); // 2\n  console.log("stats:", StorageModule.getStats());\n}, 200);\n\nStorageModule.delete("user");\nconsole.log("after delete:", StorageModule.get("user")); // null\nconsole.log("keys:", StorageModule.keys());',
      explanation: 'IIFE создаёт замыкание: store и stats приватны — недоступны через StorageModule.store. Возвращаемый объект — публичный API модуля. TTL реализован через timestamp: expiresAt = Date.now() + ttl. Ленивая очистка (cleanup при size/keys) эффективнее чем background timer. Method chaining через return this позволяет писать StorageModule.set("a",1).set("b",2).clear().'
    }
  ]
};
