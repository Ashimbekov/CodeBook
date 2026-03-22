export default {
  id: 27,
  title: 'Event Loop',
  description: 'Как работает JavaScript: однопоточность, Call Stack, Web APIs, очереди задач (макро/микро), Event Loop — понимание асинхронной модели JS.',
  lessons: [
    {
      id: 1,
      title: 'JavaScript — однопоточный язык',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript выполняется в одном потоке — в один момент времени выполняется только одна операция. Но браузер/Node.js предоставляют Web APIs/C++ APIs для параллельной работы, и Event Loop координирует всё это.' },
        { type: 'code', language: 'javascript', value: '// Синхронный код выполняется сразу и блокирует\nfunction longTask() {\n  const start = Date.now();\n  while (Date.now() - start < 2000) {} // БЛОКИРУЕТ 2 секунды!\n  return "Готово";\n}\n\nconsole.log("Начало");\nconst result = longTask(); // Страница/сервер зависает!\nconsole.log(result);       // Только через 2 секунды\n\n// Правильно: выносить тяжёлые задачи в асинхронные операции\n// или использовать Web Workers (браузер) / Worker Threads (Node.js)\n\n// Что НЕ блокирует поток (делегируется браузеру):\nsetTimeout(() => {}, 1000);  // таймер -> Web API\nfetch("/api/data");           // сеть -> Web API\nreadFile("./file.txt");       // I/O -> Node.js C++ API' },
        { type: 'heading', value: 'Компоненты модели выполнения' },
        { type: 'code', language: 'javascript', value: '// 1. Call Stack (Стек вызовов)\n// Отслеживает выполняемые функции LIFO\n// При вызове fn() -> помещается в стек\n// При return -> удаляется из стека\n\n// 2. Web APIs / Node.js APIs\n// setTimeout, setInterval, fetch, fs.readFile и т.д.\n// Выполняются ВНЕ JS потока (в браузере/Node.js)\n\n// 3. Task Queues (Очереди задач)\n// Macrotask Queue: setTimeout, setInterval, I/O, UI events\n// Microtask Queue: Promise.then, queueMicrotask, MutationObserver\n\n// 4. Event Loop\n// Переносит задачи из очередей в Call Stack когда он пуст' }
      ]
    },
    {
      id: 2,
      title: 'Call Stack — стек вызовов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Call Stack (стек вызовов) отслеживает, где мы находимся в программе. При вызове функции — помещается фрейм в стек. При return — фрейм удаляется.' },
        { type: 'code', language: 'javascript', value: 'function c() {\n  console.log("c выполняется");\n  // Stack: [main, a, b, c]\n}\n\nfunction b() {\n  c();\n  // Stack: [main, a, b]\n}\n\nfunction a() {\n  b();\n  // Stack: [main, a]\n}\n\na();\n// Stack: [main]\n\n// Stack Overflow — переполнение стека\nfunction infinite() {\n  return infinite(); // бесконечная рекурсия\n}\ntry {\n  infinite();\n} catch (err) {\n  console.log(err); // RangeError: Maximum call stack size exceeded\n}' },
        { type: 'code', language: 'javascript', value: '// Отслеживание стека в ошибке\nfunction third() {\n  throw new Error("Упс!");\n}\nfunction second() { third(); }\nfunction first()  { second(); }\n\ntry {\n  first();\n} catch (err) {\n  console.log(err.stack);\n  // Error: Упс!\n  //   at third (script.js:2)\n  //   at second (script.js:5)\n  //   at first (script.js:6)\n  //   at script.js:9\n}' },
        { type: 'tip', value: 'Error.stack — строка с трассировкой стека. В Node.js можно установить Error.stackTraceLimit = Infinity для полного стека. По умолчанию ограничено 10 фреймами.' }
      ]
    },
    {
      id: 3,
      title: 'Macrotask и Microtask очереди',
      type: 'theory',
      content: [
        { type: 'text', value: 'Две очереди задач с разным приоритетом: Microtask (Promise callbacks) — выполняется полностью перед следующей Macrotask. Macrotask (setTimeout, I/O) — по одной за итерацию Event Loop.' },
        { type: 'code', language: 'javascript', value: 'console.log("1 sync");\n\nsetTimeout(() => console.log("2 setTimeout"), 0); // macrotask\n\nPromise.resolve().then(() => console.log("3 Promise"));\n// microtask\n\nqueueMicrotask(() => console.log("4 queueMicrotask"));\n// microtask\n\nconsole.log("5 sync");\n\n// Порядок вывода:\n// 1 sync       <- синхронный код сначала\n// 5 sync       <- синхронный код\n// 3 Promise    <- microtask (ВСЕ microtasks перед macrotask!)\n// 4 queueMicrotask <- microtask\n// 2 setTimeout <- macrotask (в следующей итерации Event Loop)' },
        { type: 'code', language: 'javascript', value: '// Важный нюанс: microtasks выполняются после КАЖДОГО macrotask!\nconsole.log("start");\n\nsetTimeout(() => {\n  console.log("timeout 1"); // macrotask\n  Promise.resolve().then(() => console.log("micro after timeout 1"));\n}, 0);\n\nsetTimeout(() => {\n  console.log("timeout 2"); // macrotask\n}, 0);\n\nPromise.resolve().then(() => console.log("micro 1"));\n\nconsole.log("end");\n\n// Порядок:\n// start\n// end\n// micro 1           <- microtask\n// timeout 1         <- macrotask\n// micro after t1    <- microtask (после macrotask!)\n// timeout 2         <- macrotask' },
        { type: 'note', value: 'Все pending microtasks выполняются после каждого macrotask. Это значит: если microtask добавляет ещё microtasks — они тоже выполнятся до следующего macrotask. Бесконечная очередь microtasks заблокирует программу!' }
      ]
    },
    {
      id: 4,
      title: 'Event Loop алгоритм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event Loop — бесконечный цикл, который проверяет очереди и запускает задачи. Порядок строго определён спецификацией HTML и WHATWG.' },
        { type: 'code', language: 'javascript', value: '// Алгоритм Event Loop (упрощённо):\n// 1. Выполни весь синхронный код (Call Stack пустеет)\n// 2. Выполни ВСЕ microtasks (Promise callbacks, queueMicrotask)\n// 3. Если нужно — перерисуй страницу (requestAnimationFrame, браузер)\n// 4. Возьми ОДНУ macrotask из очереди и выполни\n// 5. Снова выполни ВСЕ microtasks\n// 6. Повтори с шага 3\n\n// Практический пример:\nconsole.log("A");\n\nPromise.resolve("B").then(v => {\n  console.log(v);\n  return "C";\n}).then(v => {\n  console.log(v);\n});\n\nsetTimeout(() => console.log("D"), 0);\n\nPromise.resolve("E").then(v => console.log(v));\n\nconsole.log("F");\n\n// Вывод: A F B E C D\n// Объяснение:\n// Sync: A, F\n// Microtasks: B -> вернул "C", E\n// Microtasks (новые): C\n// Macrotask: D' },
        { type: 'tip', value: 'setTimeout(fn, 0) не означает "немедленно". Значит "не раньше чем через 0мс". Реально выполнится после всех pending microtasks. Минимальная задержка в браузере ~4мс.' }
      ]
    },
    {
      id: 5,
      title: 'requestAnimationFrame и setImmediate',
      type: 'theory',
      content: [
        { type: 'text', value: 'requestAnimationFrame (браузер) — callback перед следующей перерисовкой. setImmediate (Node.js) — после I/O, перед setTimeout. process.nextTick (Node.js) — приоритетнее Promise microtasks!' },
        { type: 'code', language: 'javascript', value: '// В Node.js очерёдность:\n// 1. process.nextTick (выполняется ДО Promise callbacks!)\n// 2. Promise.then (microtasks)\n// 3. setImmediate (I/O callbacks, после I/O)\n// 4. setTimeout / setInterval\n\nsetTimeout(() => console.log("setTimeout"), 0);\nsetImmediate(() => console.log("setImmediate"));\n\nPromise.resolve().then(() => console.log("Promise"));\n\nprocess.nextTick(() => console.log("nextTick"));\n\nconsole.log("sync");\n\n// Вывод в Node.js:\n// sync\n// nextTick    <- nextTick ДО Promise!\n// Promise\n// setImmediate или setTimeout (порядок не гарантирован)' },
        { type: 'code', language: 'javascript', value: '// requestAnimationFrame (браузер)\nfunction animate() {\n  // Обновить анимацию\n  element.style.left = (parseInt(element.style.left) + 1) + "px";\n\n  // Запланировать следующий кадр\n  requestAnimationFrame(animate);\n}\nrequestAnimationFrame(animate); // ~60fps\n\n// Отличие от setTimeout:\n// rAF: синхронизирован с частотой обновления монитора\n// setTimeout(fn, 16): может пропустить кадры, неточный\n// rAF автоматически останавливается в фоновой вкладке' },
        { type: 'note', value: 'process.nextTick в Node.js — особая очередь с наивысшим приоритетом среди async операций. Выполняется перед Promise microtasks! Злоупотребление nextTick может "заморозить" I/O.' }
      ]
    },
    {
      id: 6,
      title: 'Практические последствия Event Loop',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание Event Loop помогает избегать ошибок и оптимизировать производительность. Рассмотрим практические примеры.' },
        { type: 'code', language: 'javascript', value: '// 1. Почему async/await не блокирует\nasync function fetchData() {\n  // await "приостанавливает" функцию и возвращает управление Event Loop\n  const data = await fetch("/api/data"); // Call Stack освободился!\n  // Когда fetch завершится — Promise callback в microtask queue\n  return data.json();\n}\n\n// 2. Почему setState(в React) бастует иногда\n// React батчит обновления состояния внутри одного event handler\n// для оптимизации перерисовок\n\n// 3. Почему setTimeout(fn, 0) полезен\nfunction updateUI(data) {\n  // Обновляем DOM синхронно...\n  heavyDOMUpdate(data);\n  // ...но вычисление откладываем\n  setTimeout(() => {\n    expensiveCalculation();\n  }, 0); // Браузер успеет перерисовать страницу!\n}\n\n// 4. Блокировка Event Loop — антипаттерн\napp.get("/api", (req, res) => {\n  // ПЛОХО: блокирует все запросы!\n  const result = computeHeavyStuff(); // синхронно!\n  res.json(result);\n});\n\n// ХОРОШО: вынести в worker или сделать асинхронным\napp.get("/api", async (req, res) => {\n  const result = await computeInWorker(); // не блокирует\n  res.json(result);\n});' },
        { type: 'tip', value: 'Node.js — single-threaded, но I/O асинхронный. Блокирующий CPU код в одном запросе замедляет ВСЕ запросы. Тяжёлые вычисления выноси в Worker Threads или child_process.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: предсказание порядка выполнения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объясни порядок вывода для нескольких асинхронных сценариев.',
      requirements: [
        'Предскажи и объясни вывод кода с setTimeout/Promise/sync кодом',
        'Реализуй функцию sleep(ms) возвращающую Promise',
        'Реализуй функцию waitForCondition(checkFn, interval) — ждёт пока checkFn() не вернёт true',
        'Объясни почему for...of с await медленнее чем Promise.all'
      ],
      hint: 'sleep: new Promise(resolve => setTimeout(resolve, ms)). waitForCondition: рекурсивно или setInterval с Promise.',
      solution: '// Задача 1: предскажи порядок\nasync function predict() {\n  console.log("1");\n  await Promise.resolve();\n  console.log("3");\n  setTimeout(() => console.log("5"), 0);\n  await new Promise(r => setTimeout(r, 0));\n  console.log("4");\n}\npredict();\nconsole.log("2");\n// Порядок: 1, 2, 3, 4, 5\n// "1" - sync в predict\n// "2" - sync после вызова predict (await возвращает управление)\n// "3" - microtask (Promise.resolve() resolved)\n// "4" - после await нового Promise (setTimeout -> macrotask -> resolve)\n//        но "4" идёт после resolve этого setTimeout\n// "5" - setTimeout(0) из шага 3, выполнится последним\n\n// sleep\nconst sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\n// waitForCondition\nasync function waitForCondition(checkFn, interval = 100, timeout = 10000) {\n  const start = Date.now();\n  while (!checkFn()) {\n    if (Date.now() - start > timeout) {\n      throw new Error("Таймаут ожидания условия");\n    }\n    await sleep(interval);\n  }\n  return true;\n}\n\n// Пример использования:\nlet ready = false;\nsetTimeout(() => { ready = true; }, 500);\nawait waitForCondition(() => ready);\nconsole.log("Условие выполнено!");\n\n// for...of vs Promise.all:\n// for...of + await: запрос 1 -> ждём -> запрос 2 -> ждём -> ...\n// Время = sum(все запросы)\n// Promise.all: все запросы стартуют одновременно\n// Время = max(все запросы)',
      explanation: 'sleep — простейшая реализация задержки через Promise. waitForCondition использует polling (периодическую проверку) с sleep между проверками. Таймаут защищает от бесконечного ожидания. for...of с await — последовательно (медленно), Promise.all — параллельно (быстро). Выбор зависит от зависимости задач.'
    }
  ]
}
