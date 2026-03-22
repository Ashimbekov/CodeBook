export default {
  id: 25,
  title: 'Promise',
  description: 'Promise — объект для работы с асинхронными операциями: создание, цепочки .then/.catch/.finally, статические методы all/race/allSettled/any.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Promise и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Promise (обещание) — объект, представляющий результат асинхронной операции. Три состояния: pending (ожидание), fulfilled (выполнено), rejected (отклонено). Переход из pending — необратим.' },
        { type: 'code', language: 'javascript', value: '// Проблема "Callback Hell" без Promise:\ngetUser(userId, function(user) {\n  getOrders(user.id, function(orders) {\n    getProduct(orders[0].productId, function(product) {\n      updateUI(user, orders, product, function() {\n        // Ещё вложение...\n      });\n    });\n  });\n});\n\n// С Promise — линейный читаемый код:\ngetUser(userId)\n  .then(user => getOrders(user.id))\n  .then(orders => getProduct(orders[0].productId))\n  .then(product => updateUI(product))\n  .catch(err => handleError(err));' },
        { type: 'heading', value: 'Создание Promise' },
        { type: 'code', language: 'javascript', value: '// new Promise((resolve, reject) => { ... })\nconst promise = new Promise((resolve, reject) => {\n  // Симуляция асинхронной операции\n  setTimeout(() => {\n    const success = Math.random() > 0.3;\n    if (success) {\n      resolve("Данные получены!"); // fulfilled\n    } else {\n      reject(new Error("Ошибка сети")); // rejected\n    }\n  }, 1000);\n});\n\nconsole.log(promise); // Promise { <pending> }\n\npromise\n  .then(data => console.log("Успех:", data))\n  .catch(err => console.log("Ошибка:", err.message));\n\n// Уже resolved/rejected\nconst resolved = Promise.resolve(42);\nconst rejected = Promise.reject(new Error("Сразу ошибка"));' },
        { type: 'tip', value: 'resolve и reject можно вызвать только один раз — повторные вызовы игнорируются. Promise "замирает" в первом состоянии. Также: resolve(anotherPromise) — цепочка промисов.' }
      ]
    },
    {
      id: 2,
      title: '.then, .catch, .finally',
      type: 'theory',
      content: [
        { type: 'text', value: '.then(onFulfilled, onRejected) — обработка результата. .catch(onRejected) — обработка ошибок (синтаксический сахар для .then(null, fn)). .finally(fn) — выполняется в любом случае.' },
        { type: 'code', language: 'javascript', value: 'function fetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id > 0) {\n        resolve({ id, name: "Алия", age: 25 });\n      } else {\n        reject(new Error(`Пользователь ${id} не найден`));\n      }\n    }, 500);\n  });\n}\n\n// Цепочка .then\nfetchUser(1)\n  .then(user => {\n    console.log("Пользователь:", user.name);\n    return user.age; // передаём в следующий .then\n  })\n  .then(age => {\n    console.log("Возраст:", age);\n    return age >= 18; // можно вернуть обычное значение\n  })\n  .then(isAdult => console.log("Взрослый:", isAdult))\n  .catch(err => {\n    // Ловит ошибки из ЛЮБОГО .then в цепочке!\n    console.log("Ошибка:", err.message);\n  })\n  .finally(() => {\n    // Всегда выполняется\n    console.log("Операция завершена");\n  });' },
        { type: 'code', language: 'javascript', value: '// Обработка ошибок и восстановление\nfetchUser(-1)\n  .then(user => user.name)\n  .catch(err => {\n    console.log("Перехватили:", err.message);\n    return "Аноним"; // ВОССТАНОВЛЕНИЕ! Цепочка продолжается\n  })\n  .then(name => console.log("Имя:", name)) // "Аноним"\n  .catch(err => console.log("Второй catch")); // не вызовется\n\n// .then с двумя аргументами\nfetchUser(1).then(\n  user => console.log("ok:", user.name), // onFulfilled\n  err  => console.log("err:", err.message) // onRejected\n);\n// Отличие от .catch: этот onRejected НЕ поймает ошибки из onFulfilled!' },
        { type: 'note', value: '.catch в цепочке .then — это НЕ то же самое что .then(ok, err). .catch ловит ошибки из всех предшествующих .then. Ставь .catch в конце цепочки для перехвата любых ошибок.' }
      ]
    },
    {
      id: 3,
      title: 'Promise.all — параллельное выполнение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Promise.all([...promises]) выполняет все промисы параллельно и ждёт, когда ВСЕ выполнятся. Если хотя бы один отклонён — всё отклоняется.' },
        { type: 'code', language: 'javascript', value: 'const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));\n\n// Параллельно — все стартуют одновременно!\nconst start = Date.now();\n\nPromise.all([\n  delay(1000, "данные пользователя"),\n  delay(800, "заказы"),\n  delay(600, "товары")\n])\n.then(([userData, orders, products]) => {\n  console.log(`Время: ${Date.now() - start}мс`); // ~1000мс (не 2400!)\n  console.log(userData, orders, products);\n})\n.catch(err => console.log("Хотя бы один упал:", err.message));\n\n// Если один реджектится — весь Promise.all падает\nPromise.all([\n  Promise.resolve(1),\n  Promise.reject(new Error("Ошибка")),\n  Promise.resolve(3)\n])\n.catch(err => console.log(err.message)); // "Ошибка"' },
        { type: 'heading', value: 'Параллельная загрузка данных' },
        { type: 'code', language: 'javascript', value: 'async function loadDashboard(userId) {\n  // Параллельно запрашиваем разные данные\n  const [user, orders, notifications] = await Promise.all([\n    fetch(`/api/users/${userId}`).then(r => r.json()),\n    fetch(`/api/orders?userId=${userId}`).then(r => r.json()),\n    fetch(`/api/notifications/${userId}`).then(r => r.json())\n  ]);\n\n  return { user, orders, notifications };\n}\n// Все 3 запроса идут параллельно!' },
        { type: 'tip', value: 'Promise.all vs последовательные await: three awaits занимают 1+2+3=6 секунд. Promise.all — только max(1,2,3)=3 секунды. Всегда используй Promise.all для независимых запросов!' }
      ]
    },
    {
      id: 4,
      title: 'Promise.race, allSettled, any',
      type: 'theory',
      content: [
        { type: 'text', value: 'race() — первый завершившийся (resolve или reject). allSettled() — ждёт ВСЕХ, возвращает статус каждого. any() — первый resolve, игнорирует reject.' },
        { type: 'code', language: 'javascript', value: 'const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));\nconst fail  = (ms, msg) => new Promise((_, r) => setTimeout(() => r(new Error(msg)), ms));\n\n// Promise.race — первый выигрывает\nPromise.race([\n  delay(1000, "медленный"),\n  delay(200,  "быстрый"),\n  delay(500,  "средний")\n]).then(v => console.log(v)); // "быстрый"\n\n// Таймаут с race\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error(`Таймаут ${ms}мс`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}\n\nwithTimeout(delay(2000, "данные"), 1000)\n  .catch(err => console.log(err.message)); // "Таймаут 1000мс"' },
        { type: 'code', language: 'javascript', value: '// Promise.allSettled — не падает если кто-то реджектился\nPromise.allSettled([\n  Promise.resolve("успех"),\n  Promise.reject(new Error("ошибка")),\n  delay(100, "ок")\n]).then(results => {\n  for (const r of results) {\n    if (r.status === "fulfilled") {\n      console.log("Успех:", r.value);\n    } else {\n      console.log("Ошибка:", r.reason.message);\n    }\n  }\n});\n// Успех: успех\n// Ошибка: ошибка\n// Успех: ок\n\n// Promise.any — первый resolve, игнорирует reject\nPromise.any([\n  fail(100, "первый упал"),\n  delay(200, "второй успех!"),\n  fail(300, "третий упал")\n]).then(v => console.log(v)); // "второй успех!"\n\n// Если ВСЕ упали — AggregateError\nPromise.any([Promise.reject("a"), Promise.reject("b")])\n  .catch(err => console.log(err instanceof AggregateError)); // true' },
        { type: 'note', value: 'Выбор метода: all — нужны ВСЕ результаты и любая ошибка критична. allSettled — нужны все, но ошибки не критичны (отчёт по каждому). race — таймаут или первый ответивший сервер. any — любой успех (резервные серверы).' }
      ]
    },
    {
      id: 5,
      title: 'Промисификация колбэков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Промисификация — обёртка над callback-API для использования с Promise. Node.js предоставляет util.promisify для автоматической конвертации.' },
        { type: 'code', language: 'javascript', value: '// Ручная промисификация\nfunction readFilePromise(path, encoding = "utf-8") {\n  return new Promise((resolve, reject) => {\n    require("fs").readFile(path, encoding, (err, data) => {\n      if (err) reject(err);\n      else     resolve(data);\n    });\n  });\n}\n\n// util.promisify — автоматически\nconst { promisify } = require("util");\nconst { readFile }  = require("fs");\n\nconst readFileAsync = promisify(readFile);\n\nreadFileAsync("./data.txt", "utf-8")\n  .then(data => console.log(data))\n  .catch(err => console.log(err.message));\n\n// fs.promises — уже промисифицировано!\nconst { readFile: read } = require("fs").promises;\nread("./data.txt", "utf-8").then(console.log);\n\n// Универсальная промисификация\nfunction promisifyFn(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn(...args, (err, result) => {\n        if (err) reject(err);\n        else     resolve(result);\n      });\n    });\n  };\n}' },
        { type: 'tip', value: 'util.promisify работает для функций следующего соглашения: последний аргумент — callback(err, result). Если callback имеет несколько аргументов (err, a, b) — используй custom promisify через Symbol.for("nodejs.util.promisify.custom").' }
      ]
    },
    {
      id: 6,
      title: 'Продвинутые паттерны Promise',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерны: очередь промисов, retry с backoff, дедубликация запросов через кэш промисов.' },
        { type: 'code', language: 'javascript', value: '// Очередь промисов (sequential execution)\nfunction sequential(tasks) {\n  return tasks.reduce(\n    (chain, task) => chain.then(task),\n    Promise.resolve()\n  );\n}\n\nconst tasks = [\n  () => delay(100).then(() => console.log("Задача 1")),\n  () => delay(200).then(() => console.log("Задача 2")),\n  () => delay(50).then(() => console.log("Задача 3"))\n];\n\nsequential(tasks); // строго по порядку: 1, 2, 3\n\n// Кэш промисов — дедубликация запросов\nclass PromiseCache {\n  #cache = new Map();\n\n  get(key, factory) {\n    if (!this.#cache.has(key)) {\n      this.#cache.set(key, factory().catch(err => {\n        this.#cache.delete(key); // убираем из кэша при ошибке\n        return Promise.reject(err);\n      }));\n    }\n    return this.#cache.get(key);\n  }\n\n  invalidate(key) { this.#cache.delete(key); }\n}\n\nconst cache = new PromiseCache();\n// Два параллельных запроса — НЕ создадут два fetch!\ncache.get("user_1", () => fetch("/api/users/1").then(r => r.json()));\ncache.get("user_1", () => fetch("/api/users/1").then(r => r.json()));\n// Второй вызов вернёт тот же промис!' }
      ]
    },
    {
      id: 7,
      title: 'Обработка ошибок в цепочках',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная обработка ошибок в промисах — важный навык. Нераспознанные отклонения (unhandled rejection) — критичная ошибка в Node.js (падение процесса).' },
        { type: 'code', language: 'javascript', value: '// Ошибки распространяются по цепочке до .catch\nPromise.resolve(1)\n  .then(v => { throw new Error("в then!"); })\n  .then(v => console.log("не выполнится"))\n  .catch(err => {\n    console.log("поймано:", err.message); // "в then!"\n    return "восстановились";\n  })\n  .then(v => console.log(v)); // "восстановились"\n\n// Ошибка в .catch — не ловится тем же .catch!\nPromise.reject(new Error("первая"))\n  .catch(err => {\n    throw new Error("вторая ошибка в catch!");\n  })\n  .catch(err => console.log("поймали вторую:", err.message));\n\n// Всегда возвращай что-то в .catch если не хочешь остановить цепочку\nfetchData()\n  .catch(err => {\n    logError(err);\n    return defaultData; // продолжить с дефолтными данными\n  })\n  .then(data => renderUI(data));' },
        { type: 'note', value: 'Добавляй .catch() к КАЖДОЙ цепочке промисов, которую не ждёшь с await. Необработанный rejection в Node.js с версии 15+ вызывает принудительное завершение процесса (exit code 1).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: параллельные запросы с обработкой ошибок',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй набор утилит для работы с промисами.',
      requirements: [
        'retry(fn, attempts, delay) — повторить асинхронную операцию attempts раз с задержкой',
        'parallel(tasks, concurrency) — выполнить массив задач с ограничением параллелизма',
        'timeout(promise, ms) — обернуть промис с таймаутом',
        'allWithFallback(promises, fallbacks) — как Promise.all, но при ошибке использовать fallback'
      ],
      hint: 'retry: рекурсия или цикл с try/catch. parallel: worker-функция, которая берёт следующую задачу из очереди когда завершает текущую.',
      solution: 'async function retry(fn, attempts = 3, delayMs = 1000) {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (i === attempts - 1) throw err;\n      await new Promise(r => setTimeout(r, delayMs * (i + 1)));\n      console.log(`Попытка ${i + 2}/${attempts}...`);\n    }\n  }\n}\n\nasync function parallel(tasks, concurrency = 3) {\n  const results = new Array(tasks.length);\n  let index = 0;\n\n  async function worker() {\n    while (index < tasks.length) {\n      const i = index++;\n      results[i] = await tasks[i]();\n    }\n  }\n\n  await Promise.all(\n    Array.from({ length: Math.min(concurrency, tasks.length) }, worker)\n  );\n  return results;\n}\n\nfunction timeout(promise, ms) {\n  return Promise.race([\n    promise,\n    new Promise((_, reject) =>\n      setTimeout(() => reject(new Error(`Таймаут: ${ms}мс`)), ms)\n    )\n  ]);\n}\n\nasync function allWithFallback(promises, fallbacks) {\n  return Promise.all(\n    promises.map((p, i) => p.catch(() => fallbacks[i]))\n  );\n}\n\n// Тест\nconst result = await allWithFallback(\n  [Promise.resolve(1), Promise.reject(), Promise.resolve(3)],\n  [0, -1, 0]\n);\nconsole.log(result); // [1, -1, 3]',
      explanation: 'retry использует exponential backoff (задержка * (i+1)). parallel запускает конкурентные workers, каждый атомарно захватывает индекс через index++. timeout использует Promise.race с таймером. allWithFallback обрабатывает каждый промис независимо через .catch.'
    }
  ]
}
