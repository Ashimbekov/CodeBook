export default {
  id: 10,
  title: 'Объекты',
  description: 'Методы объектов: keys/values/entries, computed properties, shorthand и деструктуризация',
  lessons: [
    {
      id: 1,
      title: 'Создание объектов и синтаксис ES6',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'ES6 добавил удобный синтаксис для объектов: shorthand свойства и методы, computed property names.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовый объект\nconst person = {\n  name: "Alice",\n  age: 30,\n  greet() {\n    return `Привет, я ${this.name}`;\n  }\n};\n\n// Shorthand свойства (ES6)\nconst name = "Bob";\nconst age = 25;\n// Длинный вариант:\nconst user1 = { name: name, age: age };\n// Краткий (shorthand):\nconst user2 = { name, age }; // если имя переменной = имя ключа\nconsole.log(user1, user2); // одинаково\n\n// Shorthand методы\nconst calculator = {\n  // Длинный вариант:\n  add: function(a, b) { return a + b; },\n  // Краткий вариант:\n  subtract(a, b) { return a - b; },\n  multiply(a, b) { return a * b; }\n};\n\n// Computed property names\nconst key = "dynamicKey";\nconst obj = {\n  [key]: "значение",          // "dynamicKey": "значение"\n  [`prefix_${key}`]: "ещё",   // "prefix_dynamicKey": "ещё"\n  [1 + 2]: "три"               // 3: "три"\n};\nconsole.log(obj.dynamicKey); // "значение"\nconsole.log(obj[3]);         // "три"\n\n// Вычисляемые ключи из массива\nconst fields = ["name", "age", "email"];\nconst template = fields.reduce((acc, field) => {\n  acc[field] = null;\n  return acc;\n}, {});\nconsole.log(template); // {name:null, age:null, email:null}'
        },
        { type: 'list', items: [
          'Shorthand свойства {name, age} — если имя переменной совпадает с именем ключа',
          'Shorthand методы greet() {} — краткая запись вместо greet: function() {}',
          'Computed property names [key]: value — динамические ключи из выражений',
          'Шаблонные строки в ключах: {[`${prefix}_${field}`]: value}',
          'Object.fromEntries(arr) — обратное к Object.entries(): из массива пар в объект'
        ]},
        { type: 'tip', value: 'Computed property names особенно полезны для создания объектов с динамическими ключами: const obj = { [fieldName]: value }. Используется в Redux для именования actions, в React для обновления полей формы.' }
      ]
    },
    {
      id: 2,
      title: 'Object.keys, values, entries',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Статические методы Object для работы с ключами и значениями. Возвращают только собственные перечислимые свойства.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const user = { name: "Alice", age: 30, role: "admin" };\n\n// Object.keys — массив ключей\nconsole.log(Object.keys(user)); // ["name", "age", "role"]\n\n// Object.values — массив значений\nconsole.log(Object.values(user)); // ["Alice", 30, "admin"]\n\n// Object.entries — массив [ключ, значение]\nconsole.log(Object.entries(user));\n// [["name","Alice"], ["age",30], ["role","admin"]]\n\n// Итерация объекта\nfor (const [key, value] of Object.entries(user)) {\n  console.log(`${key}: ${value}`);\n}\n\n// Преобразование объекта\nconst upper = Object.fromEntries(\n  Object.entries(user).map(([k, v]) => [k, String(v).toUpperCase()])\n);\nconsole.log(upper); // {name:"ALICE", age:"30", role:"ADMIN"}\n\n// Фильтрация объекта\nconst withoutRole = Object.fromEntries(\n  Object.entries(user).filter(([k]) => k !== "role")\n);\nconsole.log(withoutRole); // {name:"Alice", age:30}\n\n// Object.assign — слияние объектов\nconst defaults = { color: "blue", size: "medium" };\nconst custom = { size: "large", weight: "light" };\nconst result = Object.assign({}, defaults, custom);\nconsole.log(result); // {color:"blue", size:"large", weight:"light"}\n\n// Spread оператор (современная альтернатива assign)\nconst merged = { ...defaults, ...custom };\nconsole.log(merged); // то же самое'
        },
        {
          type: 'tip',
          value: 'Object.fromEntries() — это обратная операция к Object.entries(). Позволяет легко трансформировать объекты через map/filter на entries.'
        }
      ]
    },
    {
      id: 3,
      title: 'Деструктуризация объектов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Деструктуризация объектов — удобный синтаксис для извлечения свойств в переменные.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовая деструктуризация\nconst { name, age, role } = { name: "Alice", age: 30, role: "admin" };\nconsole.log(name, age, role); // "Alice" 30 "admin"\n\n// Переименование\nconst { name: userName, age: userAge } = { name: "Bob", age: 25 };\nconsole.log(userName, userAge); // "Bob" 25\n\n// Значения по умолчанию\nconst { x = 0, y = 0, z = 0 } = { x: 10, y: 20 };\nconsole.log(x, y, z); // 10 20 0\n\n// Переименование + умолчание\nconst { name: n = "Аноним", role: r = "user" } = {};\nconsole.log(n, r); // "Аноним" "user"\n\n// Rest в деструктуризации\nconst { name: n2, ...rest } = { name: "Alice", age: 30, role: "admin" };\nconsole.log(n2);   // "Alice"\nconsole.log(rest); // {age:30, role:"admin"}\n\n// Вложенная деструктуризация\nconst config = {\n  server: { host: "localhost", port: 3000 },\n  db: { name: "mydb", pool: 5 }\n};\nconst { server: { host, port }, db: { name: dbName } } = config;\nconsole.log(host, port, dbName); // "localhost" 3000 "mydb"\n\n// Деструктуризация параметров\nfunction printUser({ name, age, role = "user" }) {\n  console.log(`${name} (${age}) — ${role}`);\n}\nprintUser({ name: "Alice", age: 30 }); // "Alice (30) — user"'
        },
        { type: 'list', items: [
          'Переименование: const { name: userName } = obj — извлекает name в переменную userName',
          'Значения по умолчанию применяются только если свойство undefined (не null, не 0)',
          'Rest-оператор {...rest} собирает все оставшиеся свойства в новый объект',
          'Вложенная деструктуризация: { server: { host, port } } — удобно для config-объектов',
          'Деструктуризация параметров функции: function f({ name, age = 18 }) — чище чем f(obj)'
        ]},
        { type: 'tip', value: 'Золотое правило деструктуризации: используй для функций с объектом-параметром. Вместо function createUser(name, age, role, permissions) — function createUser({ name, age, role, permissions = [] }). Аргументы именованы и есть значения по умолчанию.' }
      ]
    },
    {
      id: 4,
      title: 'Прототипы и цепочка прототипов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'JavaScript использует прототипное наследование. Каждый объект имеет внутреннюю ссылку [[Prototype]] на другой объект или null.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Создание объекта с прототипом\nconst animal = {\n  breathe() { return "дышу"; },\n  eat() { return "ем"; }\n};\n\nconst dog = Object.create(animal);\ndog.bark = function() { return "гав!"; };\ndog.name = "Рекс";\n\nconsole.log(dog.bark());    // "гав!" — собственный метод\nconsole.log(dog.breathe()); // "дышу" — из прототипа\nconsole.log(dog.eat());     // "ем" — из прототипа\n\n// Проверка прототипа\nconsole.log(Object.getPrototypeOf(dog) === animal); // true\nconsole.log(dog.hasOwnProperty("name"));  // true\nconsole.log(dog.hasOwnProperty("breathe")); // false\nconsole.log(Object.hasOwn(dog, "name"));  // true (ES2022)\n\n// Цепочка прототипов\nconst obj = {};\n// obj -> Object.prototype -> null\nconsole.log(Object.getPrototypeOf(Object.prototype)); // null\n\n// in оператор — включая прототипы\nconsole.log("breathe" in dog); // true\nconsole.log("toString" in dog); // true (из Object.prototype!)\n\n// Object.keys — только собственные свойства\nconsole.log(Object.keys(dog)); // ["bark", "name"]'
        },
        {
          type: 'note',
          value: 'В современном JavaScript для наследования используйте class синтаксис — он понятнее. Прямая работа с прототипами нужна для понимания внутренней работы JS.'
        }
      ]
    },
    {
      id: 5,
      title: 'Методы Object: assign, freeze, seal',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Object предоставляет утилитарные методы для создания, слияния и защиты объектов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Object.freeze — делает объект неизменяемым\nconst config = Object.freeze({\n  host: "localhost",\n  port: 3000\n});\nconfig.port = 8080; // тихо игнорируется!\nconfig.newProp = "test"; // тоже игнорируется\nconsole.log(config.port); // 3000\n\n// freeze не глубокое!\nconst nested = Object.freeze({\n  server: { host: "localhost" }\n});\nnested.server.host = "production"; // РАБОТАЕТ — вложенный не заморожен!\nconsole.log(nested.server.host); // "production"\n\n// Object.seal — разрешает изменение существующих, запрещает добавление/удаление\nconst obj = Object.seal({ x: 1, y: 2 });\nobj.x = 99;  // OK — изменение существующего\nobj.z = 3;   // тихо игнорируется — нельзя добавить\ndelete obj.x; // тихо игнорируется — нельзя удалить\nconsole.log(obj); // {x:99, y:2}\n\n// Object.create с дескрипторами\nconst user = Object.create(null, {\n  name: { value: "Alice", writable: false, enumerable: true, configurable: false },\n  _age: { value: 30, writable: true, enumerable: false }\n});\nconsole.log(user.name);         // "Alice"\nconsole.log(Object.keys(user)); // ["name"] (_age не перечислимо)\n\n// Object.getOwnPropertyDescriptor\nconsole.log(Object.getOwnPropertyDescriptor(user, "name"));\n// {value:"Alice", writable:false, enumerable:true, configurable:false}'
        },
        { type: 'list', items: [
          'Object.freeze: нельзя изменить, добавить или удалить свойства — только поверхностно',
          'Object.seal: нельзя добавить/удалить свойства, но можно изменить существующие',
          'Object.isFrozen и Object.isSealed проверяют состояние объекта',
          'Дескрипторы свойств: writable, enumerable, configurable — тонкое управление поведением',
          'enumerable: false скрывает свойство из for...in и Object.keys, но оно остаётся доступным'
        ]},
        { type: 'tip', value: 'Object.freeze популярен для конфигурационных объектов и констант. Помни: freeze поверхностный — вложенные объекты не заморожены. Для глубокой заморозки нужна рекурсия: function deepFreeze(obj) { Object.keys(obj).forEach(k => typeof obj[k] === "object" && deepFreeze(obj[k])); return Object.freeze(obj); }' }
      ]
    },
    {
      id: 6,
      title: 'Map и WeakMap',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Map — коллекция ключ-значение где ключи могут быть любого типа (включая объекты). WeakMap использует слабые ссылки на объекты-ключи.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Map vs Object\n// Object: ключи только строки/символы\n// Map: ключи любого типа\n\nconst map = new Map();\nmap.set("string", 1);\nmap.set(42, 2);\nmap.set(true, 3);\nmap.set({ id: 1 }, 4); // объект как ключ\nmap.set([1,2], 5);\n\nconsole.log(map.get("string")); // 1\nconsole.log(map.get(42));       // 2\nconsole.log(map.size);          // 5\n\n// Итерация Map\nfor (const [key, value] of map) {\n  console.log(key, "->", value);\n}\n\n// Map из массива\nconst users = new Map([\n  ["alice", { age: 30, role: "admin" }],\n  ["bob", { age: 25, role: "user" }]\n]);\nconsole.log(users.get("alice")); // {age:30, role:"admin"}\n\n// Методы Map\nconsole.log(map.has(42));  // true\nmap.delete(42);\nconsole.log(map.has(42));  // false\n\n// Map -> Object и обратно\nconst obj = Object.fromEntries(users);\nconst map2 = new Map(Object.entries(obj));\n\n// WeakMap — ключи только объекты, слабые ссылки\nconst wm = new WeakMap();\nlet key = {};\nwm.set(key, "data");\nconsole.log(wm.get(key)); // "data"\nkey = null; // объект может быть собран GC\n// WeakMap не мешает сборке мусора'
        },
        {
          type: 'tip',
          value: 'Используйте Map когда: ключи не строки, нужно знать размер (.size), нужна гарантированная итерация. Используйте Object для конфигов и простых хранилищ.'
        }
      ]
    },
    {
      id: 7,
      title: 'Объекты: практика — трансформации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функции трансформации объектов.',
      requirements: [
        'Реализуйте функцию pick(obj, ...keys) — выбирает только указанные ключи',
        'Реализуйте функцию omit(obj, ...keys) — исключает указанные ключи',
        'Реализуйте функцию mapValues(obj, fn) — трансформирует значения объекта',
        'Реализуйте функцию invert(obj) — меняет ключи и значения местами',
        'pick({a:1,b:2,c:3}, "a","c") -> {a:1,c:3}\nomit({a:1,b:2,c:3}, "b") -> {a:1,c:3}\nmapValues({a:1,b:2}, n=>n*2) -> {a:2,b:4}\ninvert({a:"x",b:"y"}) -> {x:"a",y:"b"}'
      ],
      expectedOutput: 'pick({a:1,b:2,c:3}, "a","c") -> {a:1,c:3}\nomit({a:1,b:2,c:3}, "b") -> {a:1,c:3}\nmapValues({a:1,b:2}, n=>n*2) -> {a:2,b:4}\ninvert({a:"x",b:"y"}) -> {x:"a",y:"b"}',
      hint: 'pick: keys.reduce((acc,k) => { if(k in obj) acc[k] = obj[k]; return acc; }, {})\nomit: Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))\nmapValues: Object.fromEntries(Object.entries(obj).map(([k,v]) => [k, fn(v)]))\ninvert: Object.fromEntries(Object.entries(obj).map(([k,v]) => [v, k]))',
      solution: 'function pick(obj, ...keys) {\n  return keys.reduce((acc, key) => {\n    if (Object.hasOwn(obj, key)) {\n      acc[key] = obj[key];\n    }\n    return acc;\n  }, {});\n}\n\nfunction omit(obj, ...keys) {\n  const keySet = new Set(keys);\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => !keySet.has(k))\n  );\n}\n\nfunction mapValues(obj, fn) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [k, fn(v, k, obj)])\n  );\n}\n\nfunction invert(obj) {\n  return Object.fromEntries(\n    Object.entries(obj).map(([k, v]) => [v, k])\n  );\n}\n\n// Тесты pick\nconst user = { name: "Alice", age: 30, role: "admin", email: "a@b.com" };\nconsole.log(pick(user, "name", "age"));         // {name:"Alice", age:30}\nconsole.log(pick(user, "name", "nonexistent")); // {name:"Alice"}\n\n// Тесты omit\nconsole.log(omit(user, "role", "email")); // {name:"Alice", age:30}\nconsole.log(omit(user, "nonexistent"));   // весь объект\n\n// Тесты mapValues\nconst prices = { apple: 1.5, banana: 0.5, cherry: 3.0 };\nconst withTax = mapValues(prices, v => Math.round(v * 1.2 * 100) / 100);\nconsole.log(withTax); // {apple:1.8, banana:0.6, cherry:3.6}\n\nconst strings = { a: "hello", b: "world" };\nconsole.log(mapValues(strings, v => v.toUpperCase())); // {a:"HELLO",b:"WORLD"}\n\n// Тесты invert\nconst codes = { ru: "Россия", us: "США", de: "Германия" };\nconsole.log(invert(codes)); // {Россия:"ru", США:"us", Германия:"de"}',
      explanation: 'pick использует reduce для построения нового объекта только с нужными ключами. Set в omit даёт O(1) проверку принадлежности вместо O(n) от includes. mapValues передаёт fn три аргумента (value, key, obj) как принято в стандартных методах. invert меняет местами ключи и значения — работает только если значения уникальны и пригодны как ключи.'
    },
    {
      id: 8,
      title: 'Объекты: практика — паттерны',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте продвинутые паттерны работы с объектами.',
      requirements: [
        'Реализуйте функцию deepFreeze(obj) — рекурсивно замораживает объект и все вложенные',
        'Реализуйте функцию objectDiff(obj1, obj2) — возвращает различия между объектами',
        'diff({a:1,b:2,c:3}, {a:1,b:5,d:4}) -> {changed:{b:{from:2,to:5}},added:{d:4},removed:{c:3}}',
        'Реализуйте функцию buildObject(keys, values) — создаёт объект из массивов ключей и значений',
        'buildObject(["a","b","c"], [1,2,3]) -> {a:1,b:2,c:3}'
      ],
      expectedOutput: 'deepFreeze({a:{b:1}}) -> полностью неизменяемый объект\nobjectDiff({a:1,b:2},{a:1,b:5,c:3}) -> {changed:{b:...},added:{c:3},removed:{}}\nbuildObject(["a","b"],[1,2]) -> {a:1,b:2}',
      hint: 'deepFreeze: Object.freeze(obj); Object.values(obj).forEach(v => typeof v === "object" && v !== null && deepFreeze(v))\nobjectDiff: Object.entries для каждого объекта, сравни пересечения\nbuildObject: Object.fromEntries(keys.map((k, i) => [k, values[i]]))',
      solution: 'function deepFreeze(obj) {\n  if (obj === null || typeof obj !== "object") return obj;\n  Object.freeze(obj);\n  for (const value of Object.values(obj)) {\n    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {\n      deepFreeze(value);\n    }\n  }\n  return obj;\n}\n\nfunction objectDiff(obj1, obj2) {\n  const keys1 = new Set(Object.keys(obj1));\n  const keys2 = new Set(Object.keys(obj2));\n  const result = { changed: {}, added: {}, removed: {} };\n\n  // Найти удалённые (есть в obj1, нет в obj2)\n  for (const key of keys1) {\n    if (!keys2.has(key)) {\n      result.removed[key] = obj1[key];\n    }\n  }\n\n  // Найти добавленные (есть в obj2, нет в obj1)\n  for (const key of keys2) {\n    if (!keys1.has(key)) {\n      result.added[key] = obj2[key];\n    }\n  }\n\n  // Найти изменённые (есть в обоих, но разные)\n  for (const key of keys1) {\n    if (keys2.has(key)) {\n      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {\n        result.changed[key] = { from: obj1[key], to: obj2[key] };\n      }\n    }\n  }\n\n  return result;\n}\n\nfunction buildObject(keys, values) {\n  return Object.fromEntries(\n    keys.map((key, i) => [key, values[i]])\n  );\n}\n\n// Дополнительно: zipToObject\nfunction zipToObject(keys, values, defaultValue = undefined) {\n  return Object.fromEntries(\n    keys.map((key, i) => [key, i < values.length ? values[i] : defaultValue])\n  );\n}\n\n// Тесты deepFreeze\nconst frozen = deepFreeze({ a: { b: { c: 1 } }, arr: [1, 2, 3] });\ntry {\n  frozen.a.b.c = 99; // TypeError в strict mode, тихое игнорирование иначе\n} catch (e) {\n  console.log("Cannot modify frozen:", e.message);\n}\nconsole.log(frozen.a.b.c); // 1 — не изменился\nconsole.log(Object.isFrozen(frozen));     // true\nconsole.log(Object.isFrozen(frozen.a));   // true\nconsole.log(Object.isFrozen(frozen.a.b)); // true\n\n// Тесты objectDiff\nconst diff = objectDiff(\n  { a: 1, b: 2, c: 3, d: 4 },\n  { a: 1, b: 5, e: 6, d: 4 }\n);\nconsole.log("changed:", diff.changed); // {b: {from:2, to:5}}\nconsole.log("added:", diff.added);     // {e: 6}\nconsole.log("removed:", diff.removed); // {c: 3}\n\n// Тесты buildObject\nconsole.log(buildObject(["x","y","z"], [10,20,30])); // {x:10, y:20, z:30}\nconsole.log(zipToObject(["a","b","c"], [1,2], "N/A")); // {a:1, b:2, c:"N/A"}',
      explanation: 'deepFreeze рекурсивно вызывает Object.freeze для каждого вложенного объекта. Object.isFrozen проверяет перед повторным замораживанием. objectDiff использует Set для эффективного поиска различий между наборами ключей. JSON.stringify для сравнения значений — простой но не идеальный подход (не работает для функций, Date). buildObject через map + fromEntries — элегантное создание объекта из двух массивов.'
    }
  ]
};
