export default {
  id: 14,
  title: 'Map и Set',
  description: 'Коллекции ES6: Map для пар ключ-значение с любым типом ключа, Set для уникальных значений, WeakMap и WeakSet для слабых ссылок.',
  lessons: [
    {
      id: 1,
      title: 'Map — карта ключ-значение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Map — коллекция пар ключ-значение, где ключом может быть любое значение (объект, функция, число). В отличие от обычного объекта, Map запоминает порядок вставки и не имеет проблем с прототипными ключами.' },
        { type: 'code', language: 'javascript', value: '// Создание Map\nconst map = new Map();\n\n// set(key, value) — добавить или обновить\nmap.set("name", "Алия");\nmap.set(42, "число как ключ");\nmap.set(true, "булев ключ");\n\nconst objKey = { id: 1 };\nmap.set(objKey, "объект как ключ!");\n\nconsole.log(map.size); // 4\n\n// get(key) — получить значение\nconsole.log(map.get("name")); // "Алия"\nconsole.log(map.get(42));     // "число как ключ"\nconsole.log(map.get(objKey)); // "объект как ключ!"\n\n// has(key) — проверить существование\nconsole.log(map.has("name")); // true\nconsole.log(map.has("age"));  // false\n\n// delete(key) — удалить\nmap.delete(42);\nconsole.log(map.size); // 3\n\n// clear() — очистить всё\nmap.clear();\nconsole.log(map.size); // 0' },
        { type: 'heading', value: 'Инициализация и цепочка set' },
        { type: 'code', language: 'javascript', value: '// Инициализация через массив пар\nconst capitals = new Map([\n  ["Казахстан", "Астана"],\n  ["Россия",    "Москва"],\n  ["США",       "Вашингтон"]\n]);\n\nconsole.log(capitals.get("Казахстан")); // "Астана"\n\n// Цепочка set() — возвращает сам Map\nconst scores = new Map()\n  .set("Алия",  95)\n  .set("Берик", 88)\n  .set("Сауле", 92);\n\nconsole.log(scores.size); // 3' },
        { type: 'tip', value: 'Map vs объект: используй Map когда ключи — не строки, когда важен порядок, когда нужен size, или когда часто добавляешь/удаляешь ключи. Объект быстрее для статических структур.' }
      ]
    },
    {
      id: 2,
      title: 'Итерация по Map',
      type: 'theory',
      content: [
        { type: 'text', value: 'Map — итерируемая коллекция. Можно обходить её через for...of, forEach, а также получать представления ключей, значений или пар через keys(), values(), entries().' },
        { type: 'code', language: 'javascript', value: 'const userRoles = new Map([\n  ["alice@mail.com", "admin"],\n  ["bob@mail.com",   "user"],\n  ["carol@mail.com", "moderator"]\n]);\n\n// for...of с деструктуризацией\nfor (const [email, role] of userRoles) {\n  console.log(`${email}: ${role}`);\n}\n\n// forEach(callback(value, key, map))\nuserRoles.forEach((role, email) => {\n  // ВАЖНО: порядок (value, key) — отличается от for...of!\n  console.log(`${email} -> ${role}`);\n});\n\n// Итераторы\nfor (const key of userRoles.keys()) {\n  console.log(key); // alice@mail.com, bob@mail.com, ...\n}\n\nfor (const value of userRoles.values()) {\n  console.log(value); // admin, user, moderator\n}\n\n// Map -> массив\nconst pairs = [...userRoles.entries()];\nconst keys  = [...userRoles.keys()];\nconst vals  = [...userRoles.values()];\nconsole.log(pairs); // [["alice@...", "admin"], ...]' },
        { type: 'heading', value: 'Конвертация Map <-> Object' },
        { type: 'code', language: 'javascript', value: '// Object -> Map\nconst obj = { a: 1, b: 2, c: 3 };\nconst mapFromObj = new Map(Object.entries(obj));\n\n// Map -> Object (только строковые ключи!)\nconst map = new Map([["x", 10], ["y", 20]]);\nconst objFromMap = Object.fromEntries(map);\nconsole.log(objFromMap); // { x: 10, y: 20 }\n\n// Map -> JSON (через Object.fromEntries)\nconsole.log(JSON.stringify(Object.fromEntries(map)));\n// \'{"x":10,"y":20}\'' },
        { type: 'note', value: 'В forEach Map порядок аргументов (value, key) — исторически от Set.forEach(value, value, set). Это отличается от Array.forEach(value, index). Многих это путает! В for...of всё интуитивно: [key, value].' }
      ]
    },
    {
      id: 3,
      title: 'Set — множество уникальных значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Set — коллекция уникальных значений. Автоматически удаляет дубликаты. Подходит для хранения уникальных элементов, проверки вхождения (O(1)) и математических операций над множествами.' },
        { type: 'code', language: 'javascript', value: '// Создание Set\nconst set = new Set();\n\n// add(value) — добавить\nset.add(1);\nset.add(2);\nset.add(3);\nset.add(2); // дубликат — игнорируется!\nset.add(1); // дубликат — игнорируется!\n\nconsole.log(set.size); // 3\nconsole.log(set);      // Set {1, 2, 3}\n\n// has(value) — проверить\nconsole.log(set.has(2)); // true\nconsole.log(set.has(5)); // false\n\n// delete(value)\nset.delete(2);\nconsole.log(set.size); // 2\n\n// Инициализация из массива\nconst fruits = new Set(["яблоко", "груша", "яблоко", "банан"]);\nconsole.log(fruits); // Set {"яблоко", "груша", "банан"}\n\n// Удалить дубликаты из массива!\nconst nums = [1, 2, 2, 3, 3, 3, 4];\nconst unique = [...new Set(nums)];\nconsole.log(unique); // [1, 2, 3, 4]' },
        { type: 'heading', value: 'Итерация по Set' },
        { type: 'code', language: 'javascript', value: 'const tags = new Set(["js", "ts", "react", "node"]);\n\n// for...of\nfor (const tag of tags) {\n  console.log(tag);\n}\n\n// forEach\ntags.forEach(tag => console.log(tag));\n\n// Преобразование\nconst arr = [...tags];        // Array from Set\nconst sorted = [...tags].sort();\n\n// Set строк — поиск работает через has() (O(1) в отличие от includes() O(n))\nconst allowedTags = new Set(["admin", "user", "moderator"]);\n\nfunction checkRole(role) {\n  return allowedTags.has(role) ? "Разрешено" : "Запрещено";\n}\n\nconsole.log(checkRole("admin")); // Разрешено\nconsole.log(checkRole("guest")); // Запрещено' },
        { type: 'tip', value: 'has() у Set работает за O(1), includes() у массива — O(n). Для частых проверок вхождения используй Set вместо массива. Особенно важно при большом количестве элементов.' }
      ]
    },
    {
      id: 4,
      title: 'Операции над множествами',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript Set не имеет встроенных методов объединения, пересечения и разности. Но их легко реализовать через spread и filter.' },
        { type: 'code', language: 'javascript', value: 'const A = new Set([1, 2, 3, 4, 5]);\nconst B = new Set([3, 4, 5, 6, 7]);\n\n// Объединение (Union): все элементы из A и B\nconst union = new Set([...A, ...B]);\nconsole.log([...union]); // [1, 2, 3, 4, 5, 6, 7]\n\n// Пересечение (Intersection): только общие элементы\nconst intersection = new Set([...A].filter(x => B.has(x)));\nconsole.log([...intersection]); // [3, 4, 5]\n\n// Разность (Difference): элементы A, которых нет в B\nconst difference = new Set([...A].filter(x => !B.has(x)));\nconsole.log([...difference]); // [1, 2]\n\n// Симметричная разность: есть в A или B, но не в обоих\nconst symDiff = new Set([\n  ...[...A].filter(x => !B.has(x)),\n  ...[...B].filter(x => !A.has(x))\n]);\nconsole.log([...symDiff]); // [1, 2, 6, 7]\n\n// Является ли A подмножеством B?\nconst isSubset = (a, b) => [...a].every(x => b.has(x));\nconsole.log(isSubset(new Set([3, 4]), B)); // true' },
        { type: 'note', value: 'В ES2024/2025 появляются встроенные методы Set: union(), intersection(), difference(), symmetricDifference(), isSubsetOf(), isSupersetOf(). Пока поддержка не везде — проверяй совместимость.' }
      ]
    },
    {
      id: 5,
      title: 'WeakMap и WeakSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'WeakMap и WeakSet хранят "слабые" ссылки на объекты. Если объект больше нигде не используется, сборщик мусора может его удалить. Это предотвращает утечки памяти.' },
        { type: 'code', language: 'javascript', value: '// WeakMap: ключи — только объекты, нет итерации\nconst cache = new WeakMap();\n\nfunction processUser(user) {\n  if (cache.has(user)) {\n    return cache.get(user); // возвращаем из кэша\n  }\n  const result = { processed: true, name: user.name.toUpperCase() };\n  cache.set(user, result); // кэшируем\n  return result;\n}\n\nlet user1 = { name: "Алия" };\nconsole.log(processUser(user1)); // { processed: true, name: "АЛИЯ" }\nconsole.log(processUser(user1)); // из кэша\n\nuser1 = null; // объект больше не нужен\n// cache автоматически удалит запись при GC!\n\n// WeakSet: только объекты, нет итерации\nconst visited = new WeakSet();\n\nfunction visit(page) {\n  if (visited.has(page)) {\n    console.log("Уже посещено!");\n    return;\n  }\n  visited.add(page);\n  console.log("Посещаем:", page.url);\n}\n\nconst page = { url: "/home" };\nvisit(page); // Посещаем: /home\nvisit(page); // Уже посещено!' },
        { type: 'heading', value: 'Практический пример: приватные данные' },
        { type: 'code', language: 'javascript', value: '// Хранение приватных данных для объектов\nconst privateData = new WeakMap();\n\nclass SecureUser {\n  constructor(name, password) {\n    privateData.set(this, { password });\n    this.name = name;\n  }\n\n  checkPassword(input) {\n    return privateData.get(this).password === input;\n  }\n}\n\nconst u = new SecureUser("Алия", "secret123");\nconsole.log(u.name);              // "Алия"\nconsole.log(u.checkPassword("secret123")); // true\nconsole.log(u.password);          // undefined (приватно!)\n// Когда u = null, WeakMap автоматически очистит данные' },
        { type: 'tip', value: 'WeakMap/WeakSet нельзя итерировать (нет forEach, size, keys, values) — это намеренное ограничение, потому что сборщик мусора может удалить элементы в любой момент.' }
      ]
    },
    {
      id: 6,
      title: 'Map vs Object — когда что использовать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Map и Object похожи, но имеют важные различия. Понимание этих различий помогает выбрать правильный инструмент.' },
        { type: 'code', language: 'javascript', value: '// Object: проблемы с прототипными ключами\nconst obj = {};\nconsole.log(obj["toString"]); // function (из прототипа!)\nconsole.log(obj["__proto__"]); // {...}\n\n// Map: нет прототипных ключей\nconst map = new Map();\nconsole.log(map.get("toString")); // undefined (чисто!)\n\n// Сравнение по характеристикам:\n// Ключи: Object — строки/Symbol, Map — любой тип\n// Порядок: Object — ненадёжен, Map — гарантирован (порядок вставки)\n// Размер: Object — Object.keys(obj).length, Map — map.size\n// Итерация: Object — Object.entries(), Map — for...of, forEach\n// Производительность: Map быстрее при частых добавлениях/удалениях\n\n// Когда Object лучше:\n// - Небольшие статические данные\n// - JSON сериализация\n// - Методы (методы объекта)\n\n// Когда Map лучше:\n// - Ключи не-строки\n// - Динамическое добавление/удаление\n// - Нужен size\n// - Большой объём данных' },
        { type: 'note', value: 'JSON.stringify не поддерживает Map напрямую. Для сериализации: JSON.stringify(Object.fromEntries(map)). Для десериализации: new Map(Object.entries(JSON.parse(str))).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: частотный анализ и кэш',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй Map и Set для решения практических задач.',
      requirements: [
        'wordFrequency(text) — подсчитать частоту слов в тексте используя Map, вернуть Map отсортированную по убыванию',
        'uniqueChars(str) — вернуть массив уникальных символов используя Set',
        'groupBy(arr, key) — сгруппировать массив объектов по ключу используя Map',
        'memoize(fn) — кэшировать результаты функции используя Map'
      ],
      hint: 'Для wordFrequency: split + toLowerCase + для каждого слова map.set(word, (map.get(word) || 0) + 1). Для groupBy: map.get(k) || [] и добавляем элемент.',
      solution: 'function wordFrequency(text) {\n  const freq = new Map();\n  const words = text.toLowerCase().match(/\\w+/g) || [];\n  for (const word of words) {\n    freq.set(word, (freq.get(word) || 0) + 1);\n  }\n  return new Map([...freq.entries()].sort((a, b) => b[1] - a[1]));\n}\n\nfunction uniqueChars(str) {\n  return [...new Set(str.split(""))];\n}\n\nfunction groupBy(arr, key) {\n  return arr.reduce((map, item) => {\n    const k = item[key];\n    map.set(k, [...(map.get(k) || []), item]);\n    return map;\n  }, new Map());\n}\n\nfunction memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nconst text = "кот пёс кот кот пёс рыба";\nconsole.log([...wordFrequency(text)]);\n// [["кот", 3], ["пёс", 2], ["рыба", 1]]\n\nconst users = [\n  { name: "Алия", city: "Алматы" },\n  { name: "Берик", city: "Астана" },\n  { name: "Сауле", city: "Алматы" }\n];\nconsole.log(groupBy(users, "city"));\n// Map { "Алматы" => [{...}, {...}], "Астана" => [{...}] }',
      explanation: 'wordFrequency использует map.get(word) || 0 для начального значения. groupBy накапливает массивы по ключу. memoize использует JSON.stringify для создания ключа из аргументов. Эти паттерны широко применяются в реальных приложениях.'
    }
  ]
}
