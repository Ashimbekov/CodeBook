export default {
  id: 3,
  title: 'Типы данных',
  description: 'Примитивные и ссылочные типы, typeof, приведение типов и type coercion',
  lessons: [
    {
      id: 1,
      title: 'Примитивные типы данных',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В JavaScript 7 примитивных типов: string, number, bigint, boolean, null, undefined, symbol. Примитивы передаются по значению и неизменяемы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// string — последовательность символов Unicode\nconst str = "привет";\nconsole.log(str[0]);      // "п"\nconsole.log(str.length);  // 6\n// str[0] = "П"; // тихо игнорируется (примитив неизменяем)\n\n// number — 64-битное число IEEE 754\nconsole.log(Number.MAX_SAFE_INTEGER); // 9007199254740991\nconsole.log(Number.MIN_SAFE_INTEGER); // -9007199254740991\nconsole.log(Infinity);    // бесконечность\nconsole.log(-Infinity);   // минус бесконечность\nconsole.log(NaN);         // Not a Number\nconsole.log(NaN === NaN); // false! NaN не равен самому себе\nconsole.log(Number.isNaN(NaN)); // true (правильная проверка)\n\n// bigint — большие целые числа\nconst big = 9007199254740993n; // больше MAX_SAFE_INTEGER\nconsole.log(big + 1n); // 9007199254740994n\n// нельзя смешивать с number: big + 1 — TypeError\n\n// boolean\nconsole.log(Boolean(0));       // false\nconsole.log(Boolean(""));      // false\nconsole.log(Boolean(null));    // false\nconsole.log(Boolean(undefined)); // false\nconsole.log(Boolean(NaN));     // false\n// Всё остальное — true\nconsole.log(Boolean(1));       // true\nconsole.log(Boolean("hello")); // true\nconsole.log(Boolean([]));      // true (пустой массив!)\nconsole.log(Boolean({}));      // true (пустой объект!)'
        },
        {
          type: 'warning',
          value: 'Пустые массив [] и объект {} — истинные значения (truthy)! Это частая ошибка. Для проверки пустоты используйте arr.length === 0 или Object.keys(obj).length === 0.'
        }
      ]
    },
    {
      id: 2,
      title: 'Ссылочные типы (объекты)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Объекты (включая массивы и функции) передаются по ссылке. Переменная хранит не само значение, а ссылку на место в памяти.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Передача по значению (примитивы)\nlet a = 5;\nlet b = a; // копия значения\nb = 10;\nconsole.log(a); // 5 — a не изменился\n\n// Передача по ссылке (объекты)\nconst obj1 = { x: 1 };\nconst obj2 = obj1; // копия ССЫЛКИ\nobj2.x = 99;\nconsole.log(obj1.x); // 99 — obj1 тоже изменился!\n\n// Сравнение объектов\nconst p1 = { name: "Alice" };\nconst p2 = { name: "Alice" };\nconsole.log(p1 === p2); // false — разные ссылки!\nconsole.log(p1 === p1); // true — та же ссылка\n\n// Клонирование объекта\nconst original = { a: 1, b: { c: 2 } };\n// Поверхностная копия\nconst shallow1 = Object.assign({}, original);\nconst shallow2 = { ...original }; // spread\nshallow1.a = 99;\nconsole.log(original.a); // 1 — не изменился\nshallow1.b.c = 99;\nconsole.log(original.b.c); // 99 — изменился! (вложенный объект)\n\n// Глубокая копия\nconst deep = JSON.parse(JSON.stringify(original));\n// или: structuredClone(original) — ES2022\ndeep.b.c = 999;\nconsole.log(original.b.c); // 1 — не изменился'
        },
        {
          type: 'note',
          value: 'JSON.parse/stringify не работает с: функциями, undefined, Symbol, Date (теряет тип), циклическими ссылками. Для надёжного глубокого копирования используйте structuredClone() или библиотеку Lodash.'
        }
      ]
    },
    {
      id: 3,
      title: 'typeof и instanceof',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'typeof возвращает строку с типом значения. instanceof проверяет принадлежность к классу/конструктору.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// typeof\nconsole.log(typeof "hello");     // "string"\nconsole.log(typeof 42);          // "number"\nconsole.log(typeof 42n);         // "bigint"\nconsole.log(typeof true);        // "boolean"\nconsole.log(typeof undefined);   // "undefined"\nconsole.log(typeof Symbol());    // "symbol"\nconsole.log(typeof null);        // "object" (ошибка в JS!)\nconsole.log(typeof {});          // "object"\nconsole.log(typeof []);          // "object"\nconsole.log(typeof function(){}); // "function"\n\n// instanceof — проверка по цепочке прототипов\nconsole.log([] instanceof Array);   // true\nconsole.log([] instanceof Object);  // true (всё наследует Object)\nconsole.log({} instanceof Object);  // true\n\n// Правильная проверка типов\nfunction isArray(val) {\n  return Array.isArray(val); // лучший способ!\n}\n\nfunction getType(val) {\n  if (val === null) return "null";\n  if (Array.isArray(val)) return "array";\n  return typeof val;\n}\n\nconsole.log(getType(null));    // "null"\nconsole.log(getType([]));      // "array"\nconsole.log(getType({}));      // "object"\nconsole.log(getType("str"));   // "string"\nconsole.log(getType(42));      // "number"'
        },
        {
          type: 'tip',
          value: 'Для проверки массива используйте Array.isArray() вместо typeof или instanceof. Для null — строгое сравнение val === null. Для остальных примитивов — typeof.'
        }
      ]
    },
    {
      id: 4,
      title: 'Явное приведение типов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Явное (explicit) приведение типов — осознанное преобразование значения из одного типа в другой.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// В строку\nconsole.log(String(42));         // "42"\nconsole.log(String(true));       // "true"\nconsole.log(String(null));       // "null"\nconsole.log(String(undefined));  // "undefined"\nconsole.log(String([1,2,3]));    // "1,2,3"\nconsole.log((42).toString());    // "42"\nconsole.log((255).toString(16)); // "ff" (hex)\nconsole.log((10).toString(2));   // "1010" (binary)\n\n// В число\nconsole.log(Number("42"));    // 42\nconsole.log(Number("3.14"));  // 3.14\nconsole.log(Number(""));      // 0\nconsole.log(Number(true));    // 1\nconsole.log(Number(false));   // 0\nconsole.log(Number(null));    // 0\nconsole.log(Number(undefined)); // NaN\nconsole.log(Number("hello")); // NaN\nconsole.log(parseInt("42px")); // 42 (парсит до первого нечислового)\nconsole.log(parseInt("0x1F")); // 31 (hex)\nconsole.log(parseFloat("3.14abc")); // 3.14\nconsole.log(+"42");  // 42 (унарный плюс — краткая запись)\n\n// В boolean\nconsole.log(Boolean(0));   // false\nconsole.log(Boolean(""));  // false\nconsole.log(!!0);           // false (двойное отрицание)\nconsole.log(!!"hello");     // true'
        },
        {
          type: 'note',
          value: 'parseInt() и parseFloat() парсят строку с начала, останавливаясь на первом недопустимом символе. Number() конвертирует всю строку — если есть нечисловые символы, результат NaN.'
        }
      ]
    },
    {
      id: 5,
      title: 'Неявное приведение типов (Type Coercion)',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Type Coercion — автоматическое преобразование типов. JavaScript делает это часто неожиданно. Понимание coercion важно для избежания багов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Оператор + со строкой\nconsole.log("5" + 3);   // "53" (число -> строка!)\nconsole.log(3 + "5");   // "35"\nconsole.log(1 + 2 + "3"); // "33" (слева направо: 3 + "3")\nconsole.log("1" + 2 + 3); // "123"\n\n// Другие операторы (кроме +) приводят к числу\nconsole.log("5" - 3);   // 2\nconsole.log("5" * 2);   // 10\nconsole.log("6" / 2);   // 3\nconsole.log(true + 1);  // 2\nconsole.log(false + 1); // 1\nconsole.log(null + 1);  // 1 (null -> 0)\nconsole.log(undefined + 1); // NaN\n\n// Нестрогое сравнение == (с coercion)\nconsole.log(0 == false); // true\nconsole.log("" == false); // true\nconsole.log(1 == "1");   // true (строка -> число)\nconsole.log(null == undefined); // true (особый случай)\nconsole.log(null == 0);  // false!\nconsole.log(null == ""); // false!\n\n// Строгое сравнение === (без coercion)\nconsole.log(0 === false); // false\nconsole.log(1 === "1");   // false\nconsole.log(null === undefined); // false'
        },
        {
          type: 'heading',
          value: 'Известные странности coercion'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'console.log([] + []);    // "" (пустая строка)\nconsole.log([] + {});    // "[object Object]"\nconsole.log({} + []);    // "[object Object]" или 0 (зависит от контекста)\nconsole.log(+"");        // 0\nconsole.log(+[]);        // 0\nconsole.log(+{});        // NaN\nconsole.log(true + true); // 2\n\n// Правило: всегда используйте ===\n// Исключение: проверка null/undefined одним выражением\nconst val = null;\nif (val == null) { // поймает и null и undefined\n  console.log("null или undefined");\n}'
        },
        {
          type: 'warning',
          value: 'Всегда используйте === (строгое равенство) вместо ==. Исключение: val == null удобно для проверки "null или undefined" одновременно.'
        }
      ]
    },
    {
      id: 6,
      title: 'Null и Undefined',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'null и undefined — два разных типа "отсутствия значения". Важно понимать разницу между ними.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// undefined — переменная объявлена, но не инициализирована\nlet x;\nconsole.log(x); // undefined\nconsole.log(typeof x); // "undefined"\n\n// Функция без return возвращает undefined\nfunction noReturn() {}\nconsole.log(noReturn()); // undefined\n\n// Несуществующее свойство объекта\nconst obj = {};\nconsole.log(obj.missing); // undefined\n\n// null — явное "нет значения" (присваивается намеренно)\nlet user = null; // пользователь не загружен\nuser = { name: "Alice" }; // теперь загружен\n\n// Проверки\nconsole.log(x == null);  // true (undefined)\nconsole.log(x === null); // false\nconsole.log(x === undefined); // true\n\n// Nullish coalescing\nconst name = null ?? "Гость";\nconst count = 0 ?? 10; // 0 — не null/undefined!\nconsole.log(name);  // "Гость"\nconsole.log(count); // 0\n\n// Optional chaining\nconst user2 = null;\nconsole.log(user2?.name);          // undefined\nconsole.log(user2?.address?.city); // undefined\n// без ?. было бы: TypeError: Cannot read properties of null'
        },
        {
          type: 'tip',
          value: 'Соглашение: undefined означает "не задано", null означает "задано явно как отсутствие". Используйте null для явного сброса значения, не присваивайте undefined напрямую.'
        }
      ]
    },
    {
      id: 7,
      title: 'Type Coercion: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Предскажите результаты выражений и реализуйте безопасные проверки типов.',
      requirements: [
        'Реализуйте функцию safeAdd(a, b) — складывает числа, явно приводя типы',
        'Реализуйте функцию deepEqual(a, b) — глубокое сравнение двух значений',
        'Реализуйте функцию classify(value) — возвращает точный тип: "null", "undefined", "array", "date", "number", "string", "boolean", "object", "function"',
        'safeAdd("5", 3) -> 8 (не "53"!)',
        'deepEqual({a:1}, {a:1}) -> true\ndeepEqual([1,2], [1,2]) -> true\ndeepEqual({a:{b:1}}, {a:{b:1}}) -> true'
      ],
      expectedOutput: 'safeAdd("5", 3) -> 8\nsafeAdd(null, 5) -> 5\nsafeAdd(undefined, 3) -> NaN\ndeepEqual({a:1},{a:1}) -> true\ndeepEqual([1,2],[1,3]) -> false\nclassify(null) -> "null"\nclassify([]) -> "array"',
      hint: 'safeAdd: Number(a) + Number(b)\ndeepEqual: рекурсия для объектов и массивов\nclassify: проверяйте в правильном порядке: null, Array.isArray, instanceof Date, typeof',
      solution: 'function safeAdd(a, b) {\n  return Number(a) + Number(b);\n}\n\nfunction deepEqual(a, b) {\n  // Примитивы и NaN\n  if (a === b) return true;\n  if (Number.isNaN(a) && Number.isNaN(b)) return true;\n  // Если один null/undefined\n  if (a == null || b == null) return a === b;\n  // Разные типы\n  if (typeof a !== typeof b) return false;\n  // Массивы\n  if (Array.isArray(a) && Array.isArray(b)) {\n    if (a.length !== b.length) return false;\n    return a.every((item, i) => deepEqual(item, b[i]));\n  }\n  if (Array.isArray(a) !== Array.isArray(b)) return false;\n  // Объекты\n  if (typeof a === "object") {\n    const keysA = Object.keys(a);\n    const keysB = Object.keys(b);\n    if (keysA.length !== keysB.length) return false;\n    return keysA.every(key => deepEqual(a[key], b[key]));\n  }\n  return false;\n}\n\nfunction classify(value) {\n  if (value === null) return "null";\n  if (value === undefined) return "undefined";\n  if (Array.isArray(value)) return "array";\n  if (value instanceof Date) return "date";\n  if (typeof value === "function") return "function";\n  return typeof value; // number, string, boolean, object, symbol, bigint\n}\n\n// Тесты safeAdd\nconsole.log(safeAdd("5", 3));         // 8\nconsole.log(safeAdd(null, 5));        // 5\nconsole.log(safeAdd(undefined, 3));   // NaN\nconsole.log(safeAdd("10", "20"));     // 30\n\n// Тесты deepEqual\nconsole.log(deepEqual({a:1}, {a:1}));         // true\nconsole.log(deepEqual([1,2], [1,2]));          // true\nconsole.log(deepEqual({a:{b:1}}, {a:{b:1}})); // true\nconsole.log(deepEqual([1,2], [1,3]));          // false\nconsole.log(deepEqual(NaN, NaN));              // true\n\n// Тесты classify\nconsole.log(classify(null));        // "null"\nconsole.log(classify(undefined));   // "undefined"\nconsole.log(classify([]));          // "array"\nconsole.log(classify(new Date()));  // "date"\nconsole.log(classify(42));          // "number"\nconsole.log(classify("hello"));     // "string"\nconsole.log(classify({}));          // "object"',
      explanation: 'safeAdd использует явное приведение Number() для предотвращения конкатенации строк. deepEqual рекурсивно сравнивает вложенные структуры — это паттерн "структурного равенства". classify проверяет в правильном порядке: сначала null (т.к. typeof null === "object"), затем Array.isArray (т.к. typeof [] === "object"), затем Date, затем typeof для остальных.'
    },
    {
      id: 8,
      title: 'Ссылочные типы: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Работа с ссылочными типами, клонирование и сравнение объектов.',
      requirements: [
        'Реализуйте функцию deepClone(obj) — глубокое копирование объекта (без JSON методов)',
        'Должна корректно копировать: вложенные объекты, массивы, Date, null, примитивы',
        'Реализуйте функцию mergeDeep(target, ...sources) — глубокое слияние объектов',
        'mergeDeep({a:1,b:{x:1}}, {b:{y:2},c:3}) -> {a:1, b:{x:1,y:2}, c:3}',
        'Реализуйте функцию flatten(obj, separator=".") — разворачивает вложенный объект',
        'flatten({a:{b:{c:1}}}) -> {"a.b.c": 1}'
      ],
      expectedOutput: 'deepClone({a:1,b:[1,2]}) -> новый объект с теми же значениями\nmergeDeep({a:1,b:{x:1}},{b:{y:2}}) -> {a:1,b:{x:1,y:2}}\nflatten({a:{b:1},c:2}) -> {"a.b":1,"c":2}',
      hint: 'deepClone: рекурсия; проверяй instanceof Date, Array.isArray, typeof object\nmergeDeep: рекурсия для вложенных объектов, иначе перезаписать\nflatten: рекурсия с prefix + separator + key',
      solution: 'function deepClone(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (Array.isArray(obj)) return obj.map(item => deepClone(item));\n  const cloned = {};\n  for (const key of Object.keys(obj)) {\n    cloned[key] = deepClone(obj[key]);\n  }\n  return cloned;\n}\n\nfunction mergeDeep(target, ...sources) {\n  if (!sources.length) return target;\n  const result = { ...target };\n  for (const source of sources) {\n    for (const key of Object.keys(source)) {\n      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {\n        result[key] = mergeDeep(result[key] || {}, source[key]);\n      } else {\n        result[key] = source[key];\n      }\n    }\n  }\n  return result;\n}\n\nfunction flatten(obj, separator = ".", prefix = "") {\n  const result = {};\n  for (const key of Object.keys(obj)) {\n    const fullKey = prefix ? `${prefix}${separator}${key}` : key;\n    const value = obj[key];\n    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {\n      Object.assign(result, flatten(value, separator, fullKey));\n    } else {\n      result[fullKey] = value;\n    }\n  }\n  return result;\n}\n\n// Тесты\nconst original = { a: 1, b: [1, 2, 3], c: { d: new Date("2024-01-01") } };\nconst cloned = deepClone(original);\ncloned.b.push(4);\ncloned.c.d = new Date();\nconsole.log(original.b.length); // 3 — не изменился\nconsole.log(original.c.d.getFullYear()); // 2024 — не изменился\n\nconst merged = mergeDeep({a:1, b:{x:1}}, {b:{y:2}, c:3});\nconsole.log(merged); // {a:1, b:{x:1,y:2}, c:3}\n\nconst nested = {a: {b: {c: 1}}, d: [1,2], e: "str"};\nconsole.log(flatten(nested)); // {"a.b.c":1, "d":[1,2], "e":"str"}',
      explanation: 'deepClone обрабатывает случаи: null, Date (требует new Date(original.getTime())), массивы (map с рекурсией), объекты (for...of Object.keys). mergeDeep рекурсивно объединяет только plain objects, массивы заменяются целиком. flatten разворачивает вложенность через рекурсию, формируя ключи с разделителем — полезно для работы с конфигами.'
    }
  ]
};
