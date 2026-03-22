export default {
  id: 19,
  title: 'Замыкания (Closures)',
  description: 'Замыкания — фундаментальная концепция JS: функция "запоминает" переменные из внешней области видимости. Область видимости, цепочка областей, приватность данных.',
  lessons: [
    {
      id: 1,
      title: 'Область видимости и цепочка областей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Область видимости (scope) определяет, где доступна переменная. JavaScript использует лексическую область видимости — она определяется при написании кода, а не при выполнении.' },
        { type: 'code', language: 'javascript', value: '// Глобальная область видимости\nconst global = "я глобальная";\n\nfunction outer() {\n  const outerVar = "я в outer";\n\n  function inner() {\n    const innerVar = "я в inner";\n    // inner видит: innerVar, outerVar, global\n    console.log(innerVar);  // "я в inner"\n    console.log(outerVar);  // "я в outer"\n    console.log(global);    // "я глобальная"\n  }\n\n  // outer НЕ видит innerVar!\n  // console.log(innerVar); // ReferenceError\n\n  inner();\n}\n\nouter();\n// console.log(outerVar); // ReferenceError — не видно снаружи' },
        { type: 'heading', value: 'Цепочка областей видимости (Scope Chain)' },
        { type: 'code', language: 'javascript', value: '// При поиске переменной JS идёт по цепочке:\n// local scope -> outer scope -> ... -> global scope\n\nconst x = 1; // глобальная\n\nfunction level1() {\n  const x = 2; // перекрывает глобальную!\n\n  function level2() {\n    const x = 3; // перекрывает level1\n\n    function level3() {\n      // Нет своей x — ищет в level2 -> находит 3\n      console.log(x); // 3\n    }\n    level3();\n  }\n  level2();\n  console.log(x); // 2 (своя x)\n}\n\nlevel1();\nconsole.log(x); // 1 (глобальная)' },
        { type: 'tip', value: 'Переменные var "поднимаются" (hoisting) до верха функции, let/const — до блока. var не имеет блочной области видимости, что приводит к классическим багам. Всегда используй let/const.' }
      ]
    },
    {
      id: 2,
      title: 'Что такое замыкание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Замыкание — это функция вместе с её лексическим окружением. Функция "закрывается" над переменными из внешней области и помнит их даже после того, как внешняя функция завершила работу.' },
        { type: 'code', language: 'javascript', value: 'function makeCounter() {\n  let count = 0; // эта переменная "захвачена" замыканием\n\n  return function() { // возвращаем функцию!\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n\n// count НЕ доступна снаружи:\n// console.log(count); // ReferenceError\n\n// Каждый вызов makeCounter создаёт ОТДЕЛЬНОЕ замыкание!\nconst counter1 = makeCounter();\nconst counter2 = makeCounter();\n\ncounter1(); counter1(); // 1, 2\ncounter2(); // 1 (своё независимое состояние!)\nconsole.log(counter1()); // 3 (продолжает с 2)\nconsole.log(counter2()); // 2' },
        { type: 'heading', value: 'Замыкание — это не копия, а живая ссылка' },
        { type: 'code', language: 'javascript', value: 'function makeAdder(x) {\n  // x "захвачена" замыканием\n  return function(y) {\n    return x + y; // всегда помнит x!\n  };\n}\n\nconst add5  = makeAdder(5);\nconst add10 = makeAdder(10);\n\nconsole.log(add5(3));  // 8\nconsole.log(add10(3)); // 13\nconsole.log(add5(7));  // 12\n\n// Замыкание видит ИЗМЕНЕНИЯ переменной!\nfunction sharedClosure() {\n  let value = 0;\n\n  const increment = () => ++value;\n  const decrement = () => --value;\n  const get = () => value;\n\n  return { increment, decrement, get };\n}\n\nconst c = sharedClosure();\nc.increment(); c.increment(); c.increment();\nconsole.log(c.get()); // 3\nc.decrement();\nconsole.log(c.get()); // 2' },
        { type: 'note', value: 'Замыкание — живая ссылка на переменную, не копия! Если переменная изменится — замыкание увидит новое значение. Это источник и мощи, и классических багов с циклами.' }
      ]
    },
    {
      id: 3,
      title: 'Замыкания для приватности данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Замыкания — классический способ создания приватных переменных в JavaScript. Данные доступны только через предоставленные функции, снаружи — не видны.' },
        { type: 'code', language: 'javascript', value: '// Модульный паттерн (Module Pattern)\nfunction createBankAccount(initialBalance) {\n  // Приватная переменная — недоступна снаружи!\n  let balance = initialBalance;\n  const history = [];\n\n  // Публичный API\n  return {\n    deposit(amount) {\n      if (amount <= 0) throw new Error("Сумма должна быть > 0");\n      balance += amount;\n      history.push({ type: "deposit", amount, balance });\n      return this;\n    },\n    withdraw(amount) {\n      if (amount > balance) throw new Error("Недостаточно средств");\n      balance -= amount;\n      history.push({ type: "withdraw", amount, balance });\n      return this;\n    },\n    getBalance() {\n      return balance; // только для чтения!\n    },\n    getHistory() {\n      return [...history]; // копия, не оригинал!\n    }\n  };\n}\n\nconst account = createBankAccount(1000);\naccount.deposit(500).withdraw(200); // цепочка!\nconsole.log(account.getBalance()); // 1300\nconsole.log(account.balance);      // undefined — приватно!' },
        { type: 'tip', value: 'Возврат копии массива [...history] вместо оригинала — важная деталь. Иначе внешний код мог бы изменить внутренний массив: account.getHistory().push(...) изменило бы историю!' }
      ]
    },
    {
      id: 4,
      title: 'Классический баг с var в циклах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Знаменитый баг: функции в цикле с var все захватывают ОДНУ переменную i. К моменту их вызова цикл уже завершился, и i равна конечному значению.' },
        { type: 'code', language: 'javascript', value: '// БАГ с var\nconst funcs = [];\nfor (var i = 0; i < 5; i++) {\n  funcs.push(function() {\n    return i; // захватывает ОДНУ переменную i!\n  });\n}\n// К этому моменту i = 5 (цикл закончился)\nconsole.log(funcs[0]()); // 5 (ожидали 0!)\nconsole.log(funcs[2]()); // 5 (ожидали 2!)\n\n// РЕШЕНИЕ 1: let (блочная область видимости)\nconst funcs2 = [];\nfor (let i = 0; i < 5; i++) {\n  funcs2.push(() => i); // каждая итерация — своя i!\n}\nconsole.log(funcs2[0]()); // 0 ✓\nconsole.log(funcs2[2]()); // 2 ✓\n\n// РЕШЕНИЕ 2: IIFE (немедленно вызываемая функция)\nconst funcs3 = [];\nfor (var i = 0; i < 5; i++) {\n  funcs3.push((function(j) {\n    return () => j; // j — копия i на момент вызова IIFE\n  })(i));\n}\nconsole.log(funcs3[0]()); // 0 ✓' },
        { type: 'note', value: 'let в цикле создаёт новую переменную для КАЖДОЙ итерации — это специальное поведение, прописанное в спецификации. Именно поэтому let решает классический баг с var. Используй let в циклах.' }
      ]
    },
    {
      id: 5,
      title: 'Мемоизация и фабричные функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Замыкания лежат в основе мемоизации (кэширования результатов) и фабричных функций (создающих специализированные функции).' },
        { type: 'code', language: 'javascript', value: '// Мемоизация через замыкание\nfunction memoize(fn) {\n  const cache = new Map(); // кэш в замыкании\n\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      console.log("Из кэша!");\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// Медленная функция (например, рекурсивный Фибоначчи)\nfunction fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n\nconst fastFib = memoize(fib);\nconsole.log(fastFib(10)); // считает и кэширует\nconsole.log(fastFib(10)); // "Из кэша!" -> 55' },
        { type: 'code', language: 'javascript', value: '// Фабричные функции (Factory Functions)\nfunction createMultiplier(factor) {\n  return (n) => n * factor;\n}\n\nconst double = createMultiplier(2);\nconst triple = createMultiplier(3);\nconst percent = createMultiplier(0.01);\n\nconsole.log(double(5));   // 10\nconsole.log(triple(5));   // 15\nconsole.log(percent(75)); // 0.75\n\n// Фабрика для создания валидаторов\nfunction createRangeValidator(min, max) {\n  return (value) => {\n    if (value < min) return `Минимум: ${min}`;\n    if (value > max) return `Максимум: ${max}`;\n    return null; // null = нет ошибки\n  };\n}\n\nconst validateAge  = createRangeValidator(0, 150);\nconst validateScore = createRangeValidator(0, 100);\n\nconsole.log(validateAge(25));   // null (ок)\nconsole.log(validateAge(200));  // "Максимум: 150"\nconsole.log(validateScore(95)); // null\nconsole.log(validateScore(-1)); // "Минимум: 0"' },
        { type: 'tip', value: 'Фабричные функции — альтернатива классам для создания объектов с инкапсулированным состоянием. Они проще, не требуют new и this, и прекрасно работают с замыканиями.' }
      ]
    },
    {
      id: 6,
      title: 'IIFE и паттерн модуля',
      type: 'theory',
      content: [
        { type: 'text', value: 'IIFE (Immediately Invoked Function Expression) — функция, которая вызывается сразу после объявления. До ES6 модулей это был основной способ изолировать код.' },
        { type: 'code', language: 'javascript', value: '// IIFE синтаксис\n(function() {\n  const private = "не видна снаружи";\n  console.log("IIFE выполнилась!");\n})();\n\n// Стрелочная IIFE\n(() => {\n  const x = 10;\n  console.log(x);\n})();\n\n// IIFE с возвратом (Module Pattern)\nconst Calculator = (function() {\n  let history = []; // приватно!\n\n  function add(a, b) { return a + b; }\n  function sub(a, b) { return a - b; }\n\n  return { // публичный API\n    calculate(op, a, b) {\n      const result = op === "+" ? add(a, b) : sub(a, b);\n      history.push(`${a} ${op} ${b} = ${result}`);\n      return result;\n    },\n    getHistory: () => [...history]\n  };\n})();\n\nCalculator.calculate("+", 5, 3); // 8\nCalculator.calculate("-", 10, 4); // 6\nconsole.log(Calculator.getHistory());\n// ["5 + 3 = 8", "10 - 4 = 6"]\nconsole.log(Calculator.history); // undefined — приватно!' },
        { type: 'note', value: 'В современном JS IIFE заменены ES6 модулями (import/export). Но паттерн всё ещё используется в legacy коде и для изоляции блоков кода в скриптах без модульной системы.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: создание счётчика и кэша',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй несколько утилит используя замыкания.',
      requirements: [
        'createCounter(start, step) — счётчик с методами increment(), decrement(), reset(), getValue()',
        'once(fn) — функция-обёртка, которая вызывает fn только один раз, при последующих вызовах возвращает первый результат',
        'throttle(fn, delay) — не позволяет функции вызываться чаще чем раз в delay мс',
        'createStack() — стек с методами push, pop, peek, isEmpty, size'
      ],
      hint: 'once: сохрани флаг called и result в замыкании. throttle: храни lastCall в замыкании, сравнивай с Date.now().',
      expectedOutput: 'counter: 1, 2, 3 после трёх вызовов increment()\ngetCache("key") -> значение до истечения TTL, undefined после\nmakeLogger("INFO")("Сервер запущен") -> "[INFO] Сервер запущен"',
      solution: 'function createCounter(start = 0, step = 1) {\n  let value = start;\n  return {\n    increment() { value += step; return this; },\n    decrement() { value -= step; return this; },\n    reset()     { value = start; return this; },\n    getValue()  { return value; }\n  };\n}\n\nfunction once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn.apply(this, args);\n    }\n    return result;\n  };\n}\n\nfunction throttle(fn, delay) {\n  let lastCall = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastCall >= delay) {\n      lastCall = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\nfunction createStack() {\n  const items = [];\n  return {\n    push(item)  { items.push(item); return this; },\n    pop()       { return items.pop(); },\n    peek()      { return items[items.length - 1]; },\n    isEmpty()   { return items.length === 0; },\n    get size()  { return items.length; }\n  };\n}\n\nconst counter = createCounter(10, 5);\ncounter.increment().increment().decrement();\nconsole.log(counter.getValue()); // 20\n\nconst init = once(() => console.log("Инициализация!"));\ninit(); // "Инициализация!"\ninit(); // ничего\ninit(); // ничего',
      explanation: 'createCounter возвращает объект с методами через замыкание — value приватна. once хранит флаг called и результат result в замыкании. throttle отслеживает время последнего вызова. createStack хранит массив items закрытым от внешнего доступа.'
    }
  ]
}
