export default {
  id: 2,
  title: 'Переменные: let, const, var',
  description: 'Объявление переменных, hoisting, Temporal Dead Zone и области видимости',
  lessons: [
    {
      id: 1,
      title: 'var: функциональная область видимости',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'var — устаревший способ объявления переменных. Имеет функциональную (не блочную!) область видимости и поднимается (hoisting) в начало функции или скрипта.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// var имеет ФУНКЦИОНАЛЬНУЮ область видимости\nfunction example() {\n  if (true) {\n    var x = 10; // var "выходит" за блок if\n  }\n  console.log(x); // 10 — доступно вне if!\n}\nexample();\n\n// Блочная vs функциональная область\n{\n  var blockVar = "виден везде";\n  let blockLet = "виден только здесь";\n}\nconsole.log(blockVar); // "виден везде"\n// console.log(blockLet); // ReferenceError!\n\n// var в цикле — известная ловушка\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n  // Выведет: 3, 3, 3 (не 0, 1, 2!)\n}\n\n// let решает эту проблему\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 0);\n  // Выведет: 0, 1, 2\n}'
        },
        {
          type: 'warning',
          value: 'Никогда не используйте var в новом коде. Его поведение контринтуитивно и порождает баги. Всегда используйте let или const.'
        }
      ]
    },
    {
      id: 2,
      title: 'Hoisting: поднятие переменных',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Hoisting — механизм JavaScript, при котором объявления переменных и функций "поднимаются" в начало их области видимости перед выполнением кода.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// var поднимается (но не инициализация!)\nconsole.log(x); // undefined (НЕ ReferenceError)\nvar x = 5;\nconsole.log(x); // 5\n\n// Как это работает "под капотом":\n// var x;           // объявление поднимается\n// console.log(x);  // undefined\n// x = 5;           // присваивание остаётся\n// console.log(x);  // 5\n\n// function declaration поднимается ЦЕЛИКОМ\nconsole.log(sayHi()); // "Hi!" — работает до объявления!\nfunction sayHi() {\n  return "Hi!";\n}\n\n// function expression НЕ поднимается\n// console.log(greet()); // TypeError: greet is not a function\nconst greet = function() {\n  return "Hello!";\n};\n\n// Hoisting в функциях\nfunction hoistingDemo() {\n  console.log(a); // undefined\n  var a = 1;\n  console.log(a); // 1\n}'
        },
        {
          type: 'note',
          value: 'Function declarations поднимаются полностью — имя и тело. Это позволяет вызывать функцию до её объявления. Function expressions (const f = function(){}) НЕ поднимаются.'
        }
      ]
    },
    {
      id: 3,
      title: 'let и const: блочная область видимости',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'let и const введены в ES6 и имеют блочную область видимости. Они тоже "поднимаются", но попасть в Temporal Dead Zone до объявления нельзя.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Блочная область видимости\n{\n  let a = 10;\n  const b = 20;\n  console.log(a, b); // 10 20\n}\n// console.log(a); // ReferenceError\n// console.log(b); // ReferenceError\n\n// let можно переприсваивать\nlet count = 0;\ncount = 1;\ncount++;\nconsole.log(count); // 2\n\n// const нельзя переприсваивать\nconst MAX = 100;\n// MAX = 200; // TypeError: Assignment to constant variable\n\n// Но свойства объекта const менять можно!\nconst user = { name: "Alice" };\nuser.name = "Bob"; // OK!\nuser.age = 25;     // OK!\n// user = {};       // TypeError!\n\nconst arr = [1, 2, 3];\narr.push(4);   // OK!\narr[0] = 10;   // OK!\n// arr = [];    // TypeError!\n\nconsole.log(user); // { name: "Bob", age: 25 }\nconsole.log(arr);  // [10, 2, 3, 4]'
        },
        {
          type: 'tip',
          value: 'const защищает привязку (binding), не значение. Объект по-прежнему изменяем. Для неизменяемых объектов используйте Object.freeze().'
        }
      ]
    },
    {
      id: 4,
      title: 'Temporal Dead Zone (TDZ)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Temporal Dead Zone (TDZ) — зона между началом блока и объявлением переменной let/const, где переменная существует, но недоступна.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// let и const тоже "поднимаются", но попадают в TDZ\n// console.log(y); // ReferenceError: Cannot access before initialization\nlet y = 5;\nconsole.log(y); // 5\n\n// TDZ наглядно\n{\n  // -- начало TDZ для z --\n  // console.log(z); // ReferenceError — z в TDZ!\n  let z = 10; // -- конец TDZ для z --\n  console.log(z); // 10\n}\n\n// var vs let — сравнение поведения\nfunction varDemo() {\n  console.log(a); // undefined (hoisted)\n  var a = 1;\n}\n\nfunction letDemo() {\n  // console.log(b); // ReferenceError (TDZ)\n  let b = 1;\n}\n\n// TDZ в функции\nfunction tdz() {\n  const inner = () => console.log(secret);\n  // inner(); // ReferenceError — secret ещё не объявлен\n  let secret = "hello";\n  inner(); // "hello" — теперь OK\n}'
        },
        {
          type: 'heading',
          value: 'Почему TDZ — это хорошо?'
        },
        {
          type: 'text',
          value: 'TDZ помогает обнаруживать баги: использование переменной до её инициализации — почти всегда ошибка в логике кода. var скрывает такие ошибки, возвращая undefined.'
        }
      ]
    },
    {
      id: 5,
      title: 'Области видимости и замыкания',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Область видимости (scope) определяет где переменная доступна. JavaScript имеет глобальную, функциональную и блочную области видимости.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Глобальная область\nlet globalVar = "глобальная";\n\nfunction outer() {\n  // Функциональная область outer\n  let outerVar = "outer";\n\n  function inner() {\n    // Функциональная область inner\n    let innerVar = "inner";\n    // Доступны: innerVar, outerVar, globalVar\n    console.log(globalVar); // OK\n    console.log(outerVar);  // OK\n    console.log(innerVar);  // OK\n  }\n\n  inner();\n  // console.log(innerVar); // ReferenceError\n}\n\n// Цепочка областей видимости (scope chain)\nconst x = "global";\nfunction level1() {\n  const x = "level1"; // перекрывает глобальный x\n  function level2() {\n    // x не объявлен здесь — ищется вверх по цепочке\n    console.log(x); // "level1"\n  }\n  level2();\n}\nlevel1();\n\n// Замыкание (closure)\nfunction makeCounter(start = 0) {\n  let count = start;\n  return {\n    increment() { count++; },\n    decrement() { count--; },\n    value() { return count; }\n  };\n}\nconst counter = makeCounter(10);\ncounter.increment();\ncounter.increment();\nconsole.log(counter.value()); // 12'
        },
        {
          type: 'tip',
          value: 'Замыкание — это функция, которая "помнит" свою область видимости даже после того, как внешняя функция завершила выполнение. Это мощный паттерн JavaScript.'
        }
      ]
    },
    {
      id: 6,
      title: 'Hoisting: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определите результат выполнения кода с hoisting и TDZ.',
      requirements: [
        'Функция predictOutput(code) не нужна — просто ответьте на вопросы в коде',
        'Реализуйте функцию createPrivateCounter(initial) — счётчик с приватным состоянием через замыкание',
        'counter = createPrivateCounter(5)\ncounter.inc() -> 6\ncounter.inc() -> 7\ncounter.dec() -> 6\ncounter.reset() -> 5\ncounter.value() -> 5',
        'Реализуйте функцию once(fn) — функция, которую можно вызвать только один раз'
      ],
      expectedOutput: 'createPrivateCounter(5):\n  inc -> 6\n  inc -> 7\n  dec -> 6\n  reset -> 5\nonce(fn): первый вызов выполняет fn, последующие возвращают первый результат',
      hint: 'createPrivateCounter: используйте замыкание над переменной count\nonce: замыкание над called = false и result\nfunction once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) { called = true; result = fn(...args); }\n    return result;\n  };\n}',
      solution: '// Hoisting примеры (ответы в комментариях)\nconsole.log(typeof foo); // "function" — function declaration hoisted\nfunction foo() { return "foo"; }\n\nconsole.log(typeof bar); // "undefined" — var hoisted but not initialized\nvar bar = "bar";\n\n// TDZ\ntry {\n  console.log(baz); // ReferenceError — let в TDZ\n} catch(e) {\n  console.log("TDZ:", e.message);\n}\nlet baz = "baz";\n\n// Приватный счётчик через замыкание\nfunction createPrivateCounter(initial = 0) {\n  let count = initial;\n  const reset_val = initial;\n  return {\n    inc() { return ++count; },\n    dec() { return --count; },\n    reset() { count = reset_val; return count; },\n    value() { return count; }\n  };\n}\n\nconst counter = createPrivateCounter(5);\nconsole.log(counter.inc());   // 6\nconsole.log(counter.inc());   // 7\nconsole.log(counter.dec());   // 6\nconsole.log(counter.reset()); // 5\nconsole.log(counter.value()); // 5\n\n// once — выполняется только один раз\nfunction once(fn) {\n  let called = false;\n  let result;\n  return function(...args) {\n    if (!called) {\n      called = true;\n      result = fn(...args);\n    }\n    return result;\n  };\n}\n\nconst init = once((x) => {\n  console.log("Инициализация с", x);\n  return x * 2;\n});\n\nconsole.log(init(5));  // "Инициализация с 5", 10\nconsole.log(init(10)); // 10 (fn не вызывается снова)\nconsole.log(init(15)); // 10',
      explanation: 'Замыкания — ключевой паттерн JavaScript для инкапсуляции. createPrivateCounter хранит count в замыкании — он недоступен снаружи. once использует замыкание над called и result — классический пример мемоизации вызова. Hoisting: function declarations поднимаются полностью (typeof foo === "function"), var объявление поднимается без значения (undefined), let/const вызывают ReferenceError до объявления (TDZ).'
    },
    {
      id: 7,
      title: 'Области видимости: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерны использующие области видимости и замыкания.',
      requirements: [
        'Реализуйте функцию memoize(fn) — кэширует результаты вызовов функции',
        'memoize(() => slow computation) — второй вызов с теми же аргументами из кэша',
        'Реализуйте функцию makeAdder(x) — возвращает функцию добавляющую x',
        'makeAdder(5)(3) -> 8',
        'Реализуйте функцию pipe(...fns) — композиция функций слева направо',
        'pipe(x => x+1, x => x*2)(3) -> 8'
      ],
      expectedOutput: 'memoize: повторный вызов с теми же аргументами возвращает из кэша\nmakeAdder(5)(3) -> 8\nmakeAdder(10)(5) -> 15\npipe(x=>x+1, x=>x*2)(3) -> 8\npipe(x=>x*2, x=>x+1)(3) -> 7',
      hint: 'memoize: cache объект, ключ через JSON.stringify(args)\nmakeAdder: return (y) => x + y\npipe: fns.reduce((acc, fn) => fn(acc), value)',
      solution: 'function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      console.log("Из кэша для", args);\n      return cache.get(key);\n    }\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// Тест memoize\nconst expensiveCalc = memoize((n) => {\n  console.log("Вычисление для", n);\n  return n * n;\n});\nconsole.log(expensiveCalc(5)); // "Вычисление для 5", 25\nconsole.log(expensiveCalc(5)); // "Из кэша для [5]", 25\nconsole.log(expensiveCalc(3)); // "Вычисление для 3", 9\n\n// makeAdder\nfunction makeAdder(x) {\n  return (y) => x + y;\n}\nconst add5 = makeAdder(5);\nconst add10 = makeAdder(10);\nconsole.log(add5(3));  // 8\nconsole.log(add10(5)); // 15\nconsole.log(makeAdder(5)(3)); // 8\n\n// pipe — композиция функций\nfunction pipe(...fns) {\n  return (value) => fns.reduce((acc, fn) => fn(acc), value);\n}\nconst transform = pipe(\n  x => x + 1,\n  x => x * 2\n);\nconsole.log(transform(3)); // (3+1)*2 = 8\nconsole.log(pipe(x => x * 2, x => x + 1)(3)); // 3*2+1 = 7',
      explanation: 'memoize использует замыкание над cache и JSON.stringify для создания ключа из аргументов. makeAdder — классический пример каррирования (currying): функция возвращает функцию. pipe реализует функциональную композицию через reduce: каждая функция получает результат предыдущей. Все три паттерна используют замыкания для сохранения состояния или конфигурации.'
    }
  ]
};
