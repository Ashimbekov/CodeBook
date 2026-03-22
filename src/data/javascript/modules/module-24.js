export default {
  id: 24,
  title: 'Генераторы',
  description: 'Функции-генераторы function*/yield: ленивые вычисления, бесконечные последовательности, управление потоком выполнения и кооперативная многозадачность.',
  lessons: [
    {
      id: 1,
      title: 'Основы генераторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Генератор — функция, которую можно "поставить на паузу" (yield) и возобновить. function* объявляет генератор, yield возвращает значение и паузирует. Вызов генератора возвращает итератор.' },
        { type: 'code', language: 'javascript', value: '// Объявление генератора\nfunction* simpleGen() {\n  console.log("Шаг 1");\n  yield 1;           // пауза, возвращает 1\n  console.log("Шаг 2");\n  yield 2;           // пауза, возвращает 2\n  console.log("Шаг 3");\n  return 3;          // завершение\n}\n\n// Вызов НЕ выполняет функцию, возвращает итератор!\nconst gen = simpleGen();\nconsole.log("Генератор создан, ничего не выполнилось");\n\n// next() запускает до следующего yield\nconsole.log(gen.next()); // "Шаг 1", { value: 1, done: false }\nconsole.log(gen.next()); // "Шаг 2", { value: 2, done: false }\nconsole.log(gen.next()); // "Шаг 3", { value: 3, done: true }\nconsole.log(gen.next()); // { value: undefined, done: true }' },
        { type: 'heading', value: 'Генератор — это итерируемый объект' },
        { type: 'code', language: 'javascript', value: 'function* range(start, end, step = 1) {\n  for (let i = start; i <= end; i += step) {\n    yield i;\n  }\n}\n\n// for...of работает с генератором!\nfor (const n of range(1, 5)) {\n  console.log(n); // 1, 2, 3, 4, 5\n}\n\n// spread тоже!\nconsole.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8, 10]\n\n// Деструктуризация\nconst [a, b, c] = range(10, 50, 10);\nconsole.log(a, b, c); // 10 20 30' },
        { type: 'tip', value: 'Главное отличие генераторов: ленивые вычисления. Значения вычисляются только когда запрошены. Генератор range(1, Infinity) не вычислит все числа сразу, а только те, что запросите.' }
      ]
    },
    {
      id: 2,
      title: 'Передача значений через yield и return',
      type: 'theory',
      content: [
        { type: 'text', value: 'next(value) передаёт значение ВНУТРЬ генератора — оно становится результатом yield. Это позволяет двустороннее общение с генератором. gen.return(value) завершает генератор досрочно.' },
        { type: 'code', language: 'javascript', value: 'function* calculator() {\n  let result = 0;\n\n  while (true) {\n    const input = yield result; // result -> наружу, input <- снаружи\n    if (input === null) return result; // сигнал завершения\n    result += input;\n  }\n}\n\nconst calc = calculator();\nconsole.log(calc.next().value);    // 0 (инициализация, первый next игнорирует аргумент)\nconsole.log(calc.next(10).value);  // 10 (передаём 10, получаем текущий result)\nconsole.log(calc.next(5).value);   // 15\nconsole.log(calc.next(3).value);   // 18\nconsole.log(calc.next(null));      // { value: 18, done: true } — завершение' },
        { type: 'code', language: 'javascript', value: '// gen.throw() — бросить ошибку в генератор\nfunction* safeGen() {\n  try {\n    const value = yield "ждём";\n    yield `Получили: ${value}`;\n  } catch (err) {\n    yield `Ошибка: ${err.message}`;\n  }\n}\n\nconst g = safeGen();\nconsole.log(g.next().value);         // "ждём"\nconsole.log(g.throw(new Error("!")).value); // "Ошибка: !"\n\n// gen.return() — досрочное завершение\nfunction* infinite() {\n  let i = 0;\n  while (true) yield i++;\n}\n\nconst inf = infinite();\nconsole.log(inf.next().value);     // 0\nconsole.log(inf.next().value);     // 1\nconsole.log(inf.return("стоп")); // { value: "стоп", done: true }\nconsole.log(inf.next().value);   // undefined (уже завершён)' },
        { type: 'note', value: 'Первый вызов next(value) — значение ИГНОРИРУЕТСЯ. Это потому что нет предшествующего yield, которому передать значение. Первый next() только запускает генератор до первого yield.' }
      ]
    },
    {
      id: 3,
      title: 'yield* — делегирование генераторам',
      type: 'theory',
      content: [
        { type: 'text', value: 'yield* делегирует выполнение другому итерируемому объекту (генератору, массиву, строке). Удобно для композиции генераторов.' },
        { type: 'code', language: 'javascript', value: 'function* gen1() {\n  yield 1;\n  yield 2;\n}\n\nfunction* gen2() {\n  yield "a";\n  yield* gen1(); // делегируем gen1\n  yield "b";\n}\n\nconsole.log([...gen2()]); // ["a", 1, 2, "b"]\n\n// yield* с массивом и строкой\nfunction* combined() {\n  yield* [1, 2, 3];         // итерируем массив\n  yield* "hello";            // итерируем строку (символы)\n}\nconsole.log([...combined()]); // [1, 2, 3, "h", "e", "l", "l", "o"]\n\n// Рекурсивный обход дерева\nfunction* walkTree(node) {\n  yield node.value;\n  for (const child of (node.children || [])) {\n    yield* walkTree(child); // рекурсия!\n  }\n}\n\nconst tree = {\n  value: 1,\n  children: [\n    { value: 2, children: [{ value: 4 }, { value: 5 }] },\n    { value: 3, children: [{ value: 6 }] }\n  ]\n};\nconsole.log([...walkTree(tree)]); // [1, 2, 4, 5, 3, 6]' },
        { type: 'tip', value: 'yield* удобен для "сплющивания" иерархических структур (деревья, вложенные массивы) в плоские последовательности. Рекурсивные генераторы — элегантный способ обхода деревьев.' }
      ]
    },
    {
      id: 4,
      title: 'Бесконечные последовательности и ленивые вычисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Генераторы идеальны для бесконечных последовательностей. Значения вычисляются лениво — только когда запрошены. Это экономит память по сравнению с созданием большого массива.' },
        { type: 'code', language: 'javascript', value: '// Бесконечный генератор натуральных чисел\nfunction* naturals(start = 1) {\n  while (true) yield start++;\n}\n\n// Первые N элементов\nfunction take(iter, n) {\n  const result = [];\n  for (const val of iter) {\n    result.push(val);\n    if (result.length === n) break;\n  }\n  return result;\n}\n\nconsole.log(take(naturals(), 5));    // [1, 2, 3, 4, 5]\nconsole.log(take(naturals(100), 5)); // [100, 101, 102, 103, 104]\n\n// Числа Фибоначчи (бесконечно!)\nfunction* fibonacci() {\n  let [a, b] = [0, 1];\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\n\nconsole.log(take(fibonacci(), 10));\n// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]' },
        { type: 'code', language: 'javascript', value: '// Ленивый pipeline — обрабатываем данные по одному элементу\nfunction* map(iter, fn) {\n  for (const val of iter) yield fn(val);\n}\n\nfunction* filter(iter, pred) {\n  for (const val of iter) if (pred(val)) yield val;\n}\n\nfunction* limit(iter, n) {\n  let count = 0;\n  for (const val of iter) {\n    if (count++ >= n) break;\n    yield val;\n  }\n}\n\n// Найти первые 5 квадратов чётных чисел из натурального ряда\nconst result = take(\n  map(\n    filter(naturals(), n => n % 2 === 0), // фильтр чётных\n    n => n * n                              // квадрат\n  ),\n  5 // только 5\n);\nconsole.log(result); // [4, 16, 36, 64, 100]' },
        { type: 'note', value: 'Ленивый pipeline с генераторами обрабатывает данные по одному элементу — нет промежуточных массивов. При работе с большими данными (миллионы строк файла) это критично для памяти.' }
      ]
    },
    {
      id: 5,
      title: 'Асинхронные генераторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'async function* — асинхронный генератор. yield с await-значениями. Итерируется через for await...of. Идеален для потоковой обработки данных из API или файлов.' },
        { type: 'code', language: 'javascript', value: '// Асинхронный генератор\nasync function* fetchPages(baseUrl, maxPages = 5) {\n  for (let page = 1; page <= maxPages; page++) {\n    const res = await fetch(`${baseUrl}?page=${page}`);\n    const data = await res.json();\n    if (!data.items.length) return; // нет больше данных\n    yield data.items;\n  }\n}\n\n// for await...of — итерация асинхронного генератора\nasync function loadAllItems(baseUrl) {\n  const allItems = [];\n  for await (const items of fetchPages(baseUrl)) {\n    allItems.push(...items);\n    console.log(`Загружено ${items.length} элементов`);\n  }\n  return allItems;\n}\n\n// Чтение файла построчно (Node.js)\nasync function* readLines(filename) {\n  const { createReadStream } = await import("fs");\n  const { createInterface } = await import("readline");\n\n  const rl = createInterface({\n    input: createReadStream(filename),\n    crlfDelay: Infinity\n  });\n\n  for await (const line of rl) {\n    yield line;\n  }\n}\n\n// Обработка больших файлов без загрузки в память!\nasync function countLines(filename) {\n  let count = 0;\n  for await (const line of readLines(filename)) count++;\n  return count;\n}' },
        { type: 'tip', value: 'Асинхронные генераторы — идеальный инструмент для: 1) Пагинации API, 2) Потокового чтения файлов, 3) WebSocket/SSE событий, 4) Обработки больших данных чанками.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: генераторы для обхода структур',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй генераторы для различных применений.',
      requirements: [
        'range(start, end, step) — генератор диапазона чисел',
        'flatten(arr) — генератор для рекурсивного "сплющивания" вложенных массивов',
        'zip(...iters) — генератор объединяющий несколько итерируемых в пары [a, b, c]',
        'chunk(iter, size) — делит итерируемое на куски заданного размера'
      ],
      hint: 'flatten: проверяй Array.isArray(item), если да — yield* flatten(item). zip: используй итераторы через [...iters].map(i => i[Symbol.iterator]()). chunk: собирай в буфер и yield при достижении size.',
      expectedOutput: '[...range(1, 5)] -> [1, 2, 3, 4, 5]\n[...flatten([[1,[2,3]],[4]])] -> [1, 2, 3, 4]\n[...take(naturals(), 5)] -> [1, 2, 3, 4, 5]\nobход дерева через генератор возвращает узлы в порядке DFS',
      solution: 'function* range(start, end, step = 1) {\n  if (step > 0) {\n    for (let i = start; i <= end; i += step) yield i;\n  } else {\n    for (let i = start; i >= end; i += step) yield i;\n  }\n}\n\nfunction* flatten(arr) {\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      yield* flatten(item);\n    } else {\n      yield item;\n    }\n  }\n}\n\nfunction* zip(...iters) {\n  const iterators = iters.map(i => i[Symbol.iterator]());\n  while (true) {\n    const results = iterators.map(it => it.next());\n    if (results.some(r => r.done)) return;\n    yield results.map(r => r.value);\n  }\n}\n\nfunction* chunk(iter, size) {\n  let buffer = [];\n  for (const item of iter) {\n    buffer.push(item);\n    if (buffer.length === size) {\n      yield buffer;\n      buffer = [];\n    }\n  }\n  if (buffer.length > 0) yield buffer;\n}\n\nconsole.log([...range(1, 10, 2)]);\n// [1, 3, 5, 7, 9]\n\nconsole.log([...flatten([1, [2, [3, [4]], 5], 6])]);\n// [1, 2, 3, 4, 5, 6]\n\nconsole.log([...zip([1, 2, 3], ["a", "b", "c"], [true, false, true])]);\n// [[1,"a",true], [2,"b",false], [3,"c",true]]\n\nconsole.log([...chunk(range(1, 10), 3)]);\n// [[1,2,3], [4,5,6], [7,8,9], [10]]',
      explanation: 'flatten использует yield* для рекурсивного делегирования. zip берёт по одному элементу от каждого итератора, пока хоть один не завершится. chunk накапливает буфер и выдаёт его как массив при достижении нужного размера. Все функции — ленивые: не вычисляют результаты заранее.'
    }
  ]
}
