export default {
  id: 16,
  title: 'JSON',
  description: 'JSON.parse и JSON.stringify, replacer и reviver функции, работа с датами и особые случаи — всё для обмена данными.',
  lessons: [
    {
      id: 1,
      title: 'JSON.stringify — объект в строку',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSON (JavaScript Object Notation) — текстовый формат обмена данными. JSON.stringify преобразует JavaScript значение в JSON строку. JSON.parse — обратная операция.' },
        { type: 'code', language: 'javascript', value: 'const user = {\n  name: "Алия",\n  age: 25,\n  hobbies: ["чтение", "код"],\n  address: { city: "Алматы" }\n};\n\n// Базовое преобразование\nconsole.log(JSON.stringify(user));\n// {"name":"Алия","age":25,"hobbies":["чтение","код"],"address":{"city":"Алматы"}}\n\n// С отступами (для читабельности)\nconsole.log(JSON.stringify(user, null, 2));\n// {\n//   "name": "Алия",\n//   "age": 25,\n//   ...\n// }\n\n// Что НЕ сериализуется в JSON:\nconst mixed = {\n  fn: function() {},    // undefined — функции пропускаются\n  sym: Symbol("id"),    // undefined — Symbol пропускается\n  undef: undefined,     // undefined — пропускается\n  inf: Infinity,        // null\n  nan: NaN,             // null\n  date: new Date(),     // строка (ISO формат!)\n  regex: /test/g        // {} (пустой объект!)\n};\nconsole.log(JSON.stringify(mixed));\n// {"inf":null,"nan":null,"date":"2024-01-15T...","regex":{}}' },
        { type: 'tip', value: 'JSON.stringify(undefined) возвращает undefined (не строку!). Это частая причина багов при попытке сохранить undefined в localStorage. Всегда проверяй результат.' }
      ]
    },
    {
      id: 2,
      title: 'JSON.parse — строка в объект',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSON.parse преобразует JSON строку обратно в JavaScript значение. При невалидном JSON бросает SyntaxError — всегда оборачивай в try/catch.' },
        { type: 'code', language: 'javascript', value: 'const jsonString = \'{"name":"Алия","age":25,"active":true,"tags":["js","ts"]}\';\n\nconst parsed = JSON.parse(jsonString);\nconsole.log(parsed.name);    // "Алия"\nconsole.log(parsed.age);     // 25 (число, не строка!)\nconsole.log(parsed.active);  // true (булев)\nconsole.log(parsed.tags);    // ["js", "ts"]\n\n// Базовые типы\nconsole.log(JSON.parse("42"));      // 42\nconsole.log(JSON.parse(\'true\'));     // true\nconsole.log(JSON.parse(\'null\'));     // null\nconsole.log(JSON.parse(\'"текст"\')); // "текст"\n\n// Ошибка при невалидном JSON\ntry {\n  JSON.parse("{bad json}");\n} catch (err) {\n  console.log(err instanceof SyntaxError); // true\n  console.log(err.message); // JSON parse error\n}\n\n// Безопасный парсинг\nfunction safeParse(str, fallback = null) {\n  try {\n    return JSON.parse(str);\n  } catch {\n    return fallback;\n  }\n}\nconsole.log(safeParse("{}", []));     // {}\nconsole.log(safeParse("bad", []));   // []' },
        { type: 'note', value: 'JSON строго отличается от JavaScript объектов: 1) Все ключи — в двойных кавычках, 2) Строки — только в двойных кавычках, 3) Нет trailing comma, 4) Нет undefined, 5) Нет комментариев.' }
      ]
    },
    {
      id: 3,
      title: 'replacer — фильтрация при сериализации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй аргумент JSON.stringify — replacer. Это либо массив ключей для включения, либо функция (key, value) => value для трансформации каждого значения.' },
        { type: 'code', language: 'javascript', value: 'const data = {\n  name: "Алия",\n  password: "secret123",\n  age: 25,\n  token: "abc.def.ghi"\n};\n\n// Replacer как массив — включить только указанные ключи\nconst safe = JSON.stringify(data, ["name", "age"]);\nconsole.log(safe); // {"name":"Алия","age":25}\n\n// Replacer как функция\nconst filtered = JSON.stringify(data, (key, value) => {\n  if (key === "password" || key === "token") return undefined; // пропустить\n  return value; // включить\n});\nconsole.log(filtered); // {"name":"Алия","age":25}\n\n// Трансформация значений\nconst withDates = {\n  name: "Алия",\n  createdAt: new Date("2024-01-15"),\n  updatedAt: new Date()\n};\n\nconst result = JSON.stringify(withDates, (key, value) => {\n  if (value instanceof Date) {\n    return value.toISOString().split("T")[0]; // только дата без времени\n  }\n  return value;\n});\nconsole.log(result);\n// {"name":"Алия","createdAt":"2024-01-15","updatedAt":"2024-..."}' },
        { type: 'tip', value: 'replacer-функция вызывается для каждого ключа, включая корневой объект (с пустым ключом ""). Значение null в replacer означает "сериализовать как обычно", undefined — "пропустить".' }
      ]
    },
    {
      id: 4,
      title: 'reviver — трансформация при парсинге',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй аргумент JSON.parse — reviver. Функция (key, value) вызывается для каждого значения при парсинге и может трансформировать его. Особенно полезна для восстановления Date объектов.' },
        { type: 'code', language: 'javascript', value: 'const json = \'{"name":"Алия","createdAt":"2024-01-15T10:00:00.000Z","score":95}\';\n\n// Без reviver — даты остаются строками\nconst plain = JSON.parse(json);\nconsole.log(typeof plain.createdAt); // "string"\nconsole.log(plain.createdAt instanceof Date); // false\n\n// С reviver — конвертируем ISO-строки в Date\nconst dateReviver = (key, value) => {\n  // ISO 8601 паттерн: 2024-01-15T10:00:00.000Z\n  if (typeof value === "string" && /^\\d{4}-\\d{2}-\\d{2}T/.test(value)) {\n    return new Date(value);\n  }\n  return value;\n};\n\nconst parsed = JSON.parse(json, dateReviver);\nconsole.log(parsed.createdAt instanceof Date); // true\nconsole.log(parsed.createdAt.getFullYear());  // 2024' },
        { type: 'code', language: 'javascript', value: '// Практика: полный цикл сериализации/десериализации с Date\nconst user = {\n  name: "Берик",\n  birthDate: new Date("1995-06-15"),\n  tags: ["js", "node"]\n};\n\n// Сериализация\nconst saved = JSON.stringify(user);\nconsole.log(saved);\n// {"name":"Берик","birthDate":"1995-06-15T00:00:00.000Z","tags":["js","node"]}\n\n// Десериализация с восстановлением дат\nconst loaded = JSON.parse(saved, (key, val) => {\n  if (key === "birthDate") return new Date(val);\n  return val;\n});\n\nconsole.log(loaded.birthDate instanceof Date); // true\nconsole.log(loaded.birthDate.getFullYear());   // 1995' },
        { type: 'note', value: 'reviver вызывается снизу вверх — сначала для дочерних элементов, потом для родительских. Это позволяет обрабатывать вложенные структуры правильно.' }
      ]
    },
    {
      id: 5,
      title: 'toJSON и глубокое клонирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метод toJSON() на объекте позволяет контролировать его сериализацию. JSON.stringify + JSON.parse — простой способ глубокого клонирования (с ограничениями).' },
        { type: 'code', language: 'javascript', value: '// toJSON — кастомная сериализация\nclass User {\n  constructor(name, password, age) {\n    this.name = name;\n    this.password = password;\n    this.age = age;\n  }\n\n  toJSON() {\n    // Исключаем пароль при сериализации\n    return { name: this.name, age: this.age };\n  }\n}\n\nconst user = new User("Алия", "secret", 25);\nconsole.log(JSON.stringify(user));\n// {"name":"Алия","age":25} — без password!\n\n// Date.toJSON() встроен — вот почему Date сериализуется в ISO строку\nconsole.log(new Date().toJSON()); // "2024-01-15T10:00:00.000Z"' },
        { type: 'code', language: 'javascript', value: '// Глубокое клонирование через JSON\nconst original = {\n  name: "Алия",\n  address: { city: "Алматы", zip: "050000" },\n  tags: ["js", "node"]\n};\n\nconst deep = JSON.parse(JSON.stringify(original));\ndeep.address.city = "Астана";\ndeep.tags.push("react");\n\nconsole.log(original.address.city); // "Алматы" (не изменился!)\nconsole.log(original.tags.length);  // 2 (не изменился!)\n\n// Ограничения JSON клонирования:\n// 1. Теряет функции, undefined, Symbol\n// 2. Date превращается в строку\n// 3. Теряет циклические ссылки (ошибка!)\n\n// Альтернатива: structuredClone (ES2022)\nconst better = structuredClone(original);\n// Поддерживает Date, циклические ссылки и многое другое' },
        { type: 'tip', value: 'structuredClone() — современный способ глубокого клонирования. Работает с Date, Map, Set, ArrayBuffer, циклическими ссылками. Доступен в Node.js 17+ и всех современных браузерах.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: localStorage и API данные',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй утилиты для работы с JSON в практических сценариях.',
      requirements: [
        'storage.set(key, value) и storage.get(key, fallback) — обёртка над localStorage с JSON',
        'serializeUser(user) — сериализовать пользователя, исключив поля password и token',
        'parseAPIResponse(json) — парсить ответ API восстанавливая Date из строк вида YYYY-MM-DD',
        'deepClone(obj) — глубокое клонирование через JSON (с обработкой ошибок)'
      ],
      hint: 'Для storage.get: try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }. Для parseAPIResponse используй reviver с regex для дат.',
      solution: 'const storage = {\n  set(key, value) {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n      return true;\n    } catch {\n      return false;\n    }\n  },\n  get(key, fallback = null) {\n    try {\n      const item = localStorage.getItem(key);\n      return item !== null ? JSON.parse(item) : fallback;\n    } catch {\n      return fallback;\n    }\n  },\n  remove(key) { localStorage.removeItem(key); }\n};\n\nfunction serializeUser(user) {\n  const { password, token, ...safe } = user;\n  return JSON.stringify(safe);\n}\n\nfunction parseAPIResponse(json) {\n  return JSON.parse(json, (key, value) => {\n    if (typeof value === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {\n      return new Date(value);\n    }\n    return value;\n  });\n}\n\nfunction deepClone(obj) {\n  if (typeof structuredClone === "function") return structuredClone(obj);\n  try {\n    return JSON.parse(JSON.stringify(obj));\n  } catch {\n    throw new Error("Невозможно клонировать объект");\n  }\n}\n\n// Тест\nconst user = { name: "Алия", age: 25, password: "secret", token: "abc" };\nconsole.log(serializeUser(user)); // {"name":"Алия","age":25}\n\nconst apiJson = \'{"id":1,"name":"Берик","birthday":"1995-06-15"}\';\nconst parsed = parseAPIResponse(apiJson);\nconsole.log(parsed.birthday instanceof Date); // true',
      explanation: 'storage.get использует ?? (nullish coalescing) — возвращает fallback только если localStorage вернул null (ключ не существует), но не если значение false или 0. serializeUser использует деструктуризацию с rest для исключения полей.'
    }
  ]
}
