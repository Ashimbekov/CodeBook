export default {
  id: 15,
  title: 'Обработка ошибок',
  description: 'try/catch/finally, throw, создание пользовательских классов ошибок — надёжный код требует правильной обработки исключений.',
  lessons: [
    {
      id: 1,
      title: 'try/catch — перехват ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'try/catch позволяет "поймать" ошибку и обработать её вместо краша программы. Код в блоке try выполняется, если возникает ошибка — управление переходит в catch.' },
        { type: 'code', language: 'javascript', value: '// Базовый синтаксис\ntry {\n  const result = JSON.parse("невалидный JSON");\n  console.log(result);\n} catch (error) {\n  console.log("Ошибка:", error.message);\n  // Ошибка: Unexpected token е in JSON at position 0\n}\n\nconsole.log("Программа продолжает работу!");\n\n// Без try/catch программа бы упала\n// JSON.parse("invalid") -> SyntaxError -> CRASH\n\n// Объект ошибки имеет свойства:\ntry {\n  null.property; // TypeError\n} catch (err) {\n  console.log(err.name);    // "TypeError"\n  console.log(err.message); // "Cannot read properties of null"\n  console.log(err.stack);   // стек вызовов\n}' },
        { type: 'heading', value: 'Типы встроенных ошибок' },
        { type: 'code', language: 'javascript', value: '// ReferenceError — обращение к несуществующей переменной\ntry { undeclaredVar; } catch(e) { console.log(e.name); } // ReferenceError\n\n// TypeError — неправильный тип\ntry { (42).toUpperCase(); } catch(e) { console.log(e.name); } // TypeError\n\n// SyntaxError — обычно при парсинге\ntry { JSON.parse("{bad}"); } catch(e) { console.log(e.name); } // SyntaxError\n\n// RangeError — значение вне допустимого диапазона\ntry { new Array(-1); } catch(e) { console.log(e.name); } // RangeError\n\n// URIError\ntry { decodeURIComponent("%"); } catch(e) { console.log(e.name); } // URIError' },
        { type: 'tip', value: 'Имя переменной в catch (err, e, error) можно не указывать с ES2019: try { ... } catch { ... }. Используй когда сам факт ошибки важен, но объект ошибки не нужен.' }
      ]
    },
    {
      id: 2,
      title: 'finally и throw',
      type: 'theory',
      content: [
        { type: 'text', value: 'finally выполняется ВСЕГДА — и при успехе, и при ошибке. Идеален для очистки ресурсов. throw позволяет бросить любое значение как ошибку.' },
        { type: 'code', language: 'javascript', value: '// finally — выполняется всегда\nfunction divide(a, b) {\n  try {\n    if (b === 0) throw new Error("Деление на ноль!");\n    return a / b;\n  } catch (err) {\n    console.log("Поймана ошибка:", err.message);\n    return null;\n  } finally {\n    console.log("finally всегда выполняется"); // всегда!\n  }\n}\n\nconsole.log(divide(10, 2)); // finally... -> 5\nconsole.log(divide(10, 0)); // Поймана ошибка... finally... -> null' },
        { type: 'code', language: 'javascript', value: '// throw — бросить ошибку\nfunction getUser(id) {\n  if (!id) throw new Error("ID обязателен");\n  if (typeof id !== "number") throw new TypeError("ID должен быть числом");\n  if (id <= 0) throw new RangeError("ID должен быть положительным");\n  return { id, name: "Пользователь " + id };\n}\n\ntry {\n  console.log(getUser(1));    // { id: 1, name: "Пользователь 1" }\n  console.log(getUser(-5));   // RangeError\n} catch (err) {\n  console.log(`${err.name}: ${err.message}`);\n}\n\n// throw можно бросить что угодно (но Error лучше)\ntry {\n  throw "строка как ошибка"; // плохая практика\n} catch (e) {\n  console.log(typeof e); // "string"\n}' },
        { type: 'note', value: 'finally выполняется даже если в try есть return! Если в finally тоже есть return — он перекрывает return из try. Будь осторожен с return в finally — это может скрыть возвращаемое значение.' }
      ]
    },
    {
      id: 3,
      title: 'Пользовательские классы ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для сложных приложений создают иерархию классов ошибок, расширяя встроенный Error. Это позволяет различать типы ошибок через instanceof и добавлять дополнительные данные.' },
        { type: 'code', language: 'javascript', value: '// Базовый пользовательский класс ошибки\nclass AppError extends Error {\n  constructor(message, code) {\n    super(message);         // передаём message в Error\n    this.name = "AppError"; // имя ошибки\n    this.code = code;       // дополнительные данные\n    // Фикс для instanceOf в некоторых средах:\n    Object.setPrototypeOf(this, AppError.prototype);\n  }\n}\n\n// Специализированные ошибки\nclass ValidationError extends AppError {\n  constructor(field, message) {\n    super(message, "VALIDATION_ERROR");\n    this.name = "ValidationError";\n    this.field = field;\n  }\n}\n\nclass NotFoundError extends AppError {\n  constructor(resource, id) {\n    super(`${resource} с id=${id} не найден`, "NOT_FOUND");\n    this.name = "NotFoundError";\n    this.resource = resource;\n    this.id = id;\n  }\n}\n\nclass NetworkError extends AppError {\n  constructor(url, status) {\n    super(`HTTP ${status} при запросе к ${url}`, "NETWORK_ERROR");\n    this.name = "NetworkError";\n    this.status = status;\n    this.url = url;\n  }\n}' },
        { type: 'heading', value: 'Использование пользовательских ошибок' },
        { type: 'code', language: 'javascript', value: 'function validateAge(age) {\n  if (typeof age !== "number") {\n    throw new ValidationError("age", "Возраст должен быть числом");\n  }\n  if (age < 0 || age > 150) {\n    throw new ValidationError("age", "Возраст должен быть от 0 до 150");\n  }\n  return true;\n}\n\nfunction findUser(id) {\n  const users = [{ id: 1, name: "Алия" }];\n  const user = users.find(u => u.id === id);\n  if (!user) throw new NotFoundError("User", id);\n  return user;\n}\n\ntry {\n  validateAge("двадцать");\n} catch (err) {\n  if (err instanceof ValidationError) {\n    console.log(`Ошибка поля ${err.field}: ${err.message}`);\n    // Ошибка поля age: Возраст должен быть числом\n  } else {\n    throw err; // перебрасываем неизвестные ошибки!\n  }\n}\n\ntry {\n  findUser(99);\n} catch (err) {\n  if (err instanceof NotFoundError) {\n    console.log(`${err.resource} #${err.id} не найден`);\n  }\n}' },
        { type: 'tip', value: 'Паттерн "перебросить неизвестные ошибки" (throw err в else) очень важен! Не проглатывай все ошибки подряд — обрабатывай только те, которые ожидаешь, остальные пропускай дальше.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок в асинхронном коде',
      type: 'theory',
      content: [
        { type: 'text', value: 'try/catch не ловит ошибки в колбэках setTimeout. Для Promise используют .catch(), для async/await — try/catch. Важно не оставлять необработанные отклонения Promise.' },
        { type: 'code', language: 'javascript', value: '// try/catch НЕ ловит асинхронные ошибки в callbacks!\ntry {\n  setTimeout(() => {\n    throw new Error("Асинхронная ошибка"); // НЕ поймает!\n  }, 100);\n} catch (err) {\n  console.log("Не сработает!");\n}\n\n// Promise .catch()\nfetch("/api/users")\n  .then(res => res.json())\n  .catch(err => console.log("Ошибка fetch:", err.message));\n\n// Эквивалент с .then(onSuccess, onError)\nfetch("/api/users").then(\n  res => res.json(),\n  err => console.log("Ошибка:", err)\n);\n\n// async/await + try/catch\nasync function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new NetworkError(res.url, res.status);\n    return await res.json();\n  } catch (err) {\n    if (err instanceof NetworkError) {\n      console.log(`Сеть: ${err.message}`);\n    } else {\n      throw err; // перебрасываем\n    }\n  }\n}' },
        { type: 'code', language: 'javascript', value: '// Глобальная обработка необработанных ошибок\n// В браузере:\nwindow.addEventListener("unhandledrejection", event => {\n  console.error("Необработанный Promise:", event.reason);\n  event.preventDefault();\n});\n\n// В Node.js:\nprocess.on("unhandledRejection", (reason, promise) => {\n  console.error("Необработанный reject:", reason);\n});\n\n// Паттерн: обёртка для async с обработкой ошибок\nasync function safeAsync(fn, ...args) {\n  try {\n    return [null, await fn(...args)];\n  } catch (err) {\n    return [err, null];\n  }\n}\n\nconst [err, data] = await safeAsync(fetch, "/api/data");\nif (err) console.log("Ошибка:", err.message);\nelse console.log("Данные:", data);' },
        { type: 'note', value: 'Паттерн [error, data] = await safeAsync(fn) — популярный в Go-стиле подход. Возвращает массив [ошибка, результат]. Если ошибки нет — первый элемент null. Это избегает вложенных try/catch.' }
      ]
    },
    {
      id: 5,
      title: 'Стратегии обработки ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая обработка ошибок — это не просто catch. Нужна стратегия: когда восстанавливаться, когда логировать, когда пробрасывать дальше.' },
        { type: 'code', language: 'javascript', value: '// 1. Восстановление (recovery)\nfunction parseConfig(json) {\n  try {\n    return JSON.parse(json);\n  } catch {\n    console.warn("Невалидный конфиг, используем умолчания");\n    return { theme: "light", lang: "ru" }; // умолчания\n  }\n}\n\n// 2. Retry (повторная попытка)\nasync function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(`HTTP ${res.status}`);\n      return await res.json();\n    } catch (err) {\n      if (i === retries - 1) throw err; // последняя попытка — бросаем\n      console.log(`Попытка ${i + 1} не удалась, повторяем...`);\n      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // экспоненциальная задержка\n    }\n  }\n}\n\n// 3. Fallback\nasync function getAvatar(userId) {\n  try {\n    return await fetchUserAvatar(userId);\n  } catch {\n    return "/images/default-avatar.png"; // заглушка\n  }\n}' },
        { type: 'tip', value: 'Три стратегии: 1) Восстановиться — продолжить с умолчаниями, 2) Retry — повторить с задержкой, 3) Fallback — использовать запасной вариант. Выбирай исходя из типа ошибки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: надёжный парсер данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай надёжный валидатор и парсер пользовательских данных с пользовательскими классами ошибок.',
      requirements: [
        'Создай класс ValidationError с полями field и message',
        'Напиши функцию validateUser(data) которая валидирует объект пользователя',
        'Валидация: name (строка, не пустая), age (число, 0-150), email (содержит @)',
        'Напиши функцию safeParse(json) — парсит JSON, возвращает { data, error }'
      ],
      hint: 'Собери все ошибки валидации в массив, потом бросай или возвращай. safeParse: try/catch -> { data: result, error: null } или { data: null, error: err }.',
      expectedOutput: 'Валидация прошла!\nvalidateUser({ name: "", age: 200, email: "bad" }) -> ValidationError с 3 ошибками\nsafeParse("invalid") -> { data: null, error: SyntaxError }',
      solution: 'class ValidationError extends Error {\n  constructor(errors) {\n    super("Ошибка валидации");\n    this.name = "ValidationError";\n    this.errors = errors;\n  }\n}\n\nfunction validateUser(data) {\n  const errors = [];\n\n  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {\n    errors.push({ field: "name", message: "Имя обязательно" });\n  }\n\n  if (typeof data.age !== "number" || data.age < 0 || data.age > 150) {\n    errors.push({ field: "age", message: "Возраст должен быть от 0 до 150" });\n  }\n\n  if (!data.email || !data.email.includes("@")) {\n    errors.push({ field: "email", message: "Некорректный email" });\n  }\n\n  if (errors.length > 0) throw new ValidationError(errors);\n  return true;\n}\n\nfunction safeParse(json) {\n  try {\n    return { data: JSON.parse(json), error: null };\n  } catch (err) {\n    return { data: null, error: err };\n  }\n}\n\n// Тесты\nconst { data, error } = safeParse(\'{"name":"Алия","age":25,"email":"a@b.c"}\');\nif (!error) {\n  try {\n    validateUser(data);\n    console.log("Валидация прошла!");\n  } catch (e) {\n    if (e instanceof ValidationError) {\n      console.log("Ошибки:", e.errors);\n    }\n  }\n}',
      explanation: 'ValidationError хранит массив всех ошибок — так пользователь видит все проблемы сразу, а не по одной. safeParse возвращает объект { data, error } вместо бросания исключений — удобный паттерн для API вызовов.'
    }
  ]
}
