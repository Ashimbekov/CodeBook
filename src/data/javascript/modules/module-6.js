export default {
  id: 6,
  title: 'Циклы',
  description: 'for, while, for...of, for...in, break/continue и итерационные паттерны',
  lessons: [
    {
      id: 1,
      title: 'for цикл',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Классический for цикл подходит когда нужен счётчик или доступ к индексу.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовый for\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n\n// Обратный цикл\nfor (let i = 4; i >= 0; i--) {\n  console.log(i); // 4, 3, 2, 1, 0\n}\n\n// Шаг 2\nfor (let i = 0; i < 10; i += 2) {\n  console.log(i); // 0, 2, 4, 6, 8\n}\n\n// Итерация массива с индексом\nconst fruits = ["яблоко", "банан", "апельсин"];\nfor (let i = 0; i < fruits.length; i++) {\n  console.log(`${i}: ${fruits[i]}`);\n}\n\n// Вложенные циклы\nfor (let i = 1; i <= 3; i++) {\n  for (let j = 1; j <= 3; j++) {\n    process.stdout?.write(`${i}*${j}=${i*j}  `);\n  }\n  console.log();\n}\n\n// Динамическое условие (осторожно с length!)\nconst arr = [1, 2, 3, 4, 5];\nfor (let i = 0; i < arr.length; i++) {\n  // arr.length вычисляется каждую итерацию\n  console.log(arr[i]);\n}'
        },
        {
          type: 'tip',
          value: 'Для кэширования длины массива в горячих циклах: for (let i = 0, len = arr.length; i < len; i++). Но в реальных задачах разница незначительна — движки V8 оптимизируют это.'
        }
      ]
    },
    {
      id: 2,
      title: 'while и do...while',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'while используется когда количество итераций заранее неизвестно. do...while выполняется хотя бы один раз.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// while — проверка ДО выполнения\nlet n = 1;\nwhile (n < 100) {\n  n *= 2;\n}\nconsole.log(n); // 128\n\n// do...while — проверка ПОСЛЕ выполнения\nlet attempts = 0;\ndo {\n  attempts++;\n  console.log("Попытка", attempts);\n} while (attempts < 3);\n\n// Чтение до условия (имитация)\nconst queue = [1, 2, 3, 4, 5];\nwhile (queue.length > 0) {\n  const item = queue.shift();\n  console.log("Обрабатываю:", item);\n}\n\n// Бесконечный цикл с break\nlet value = 1;\nwhile (true) {\n  if (value > 1000) break;\n  value *= 2;\n}\nconsole.log(value); // 1024\n\n// Алгоритм Евклида (НОД)\nfunction gcd(a, b) {\n  while (b !== 0) {\n    [a, b] = [b, a % b]; // деструктуризация для обмена\n  }\n  return a;\n}\nconsole.log(gcd(48, 18)); // 6'
        },
        {
          type: 'warning',
          value: 'Бесконечный цикл (while(true) без break) заморозит браузер или Node.js процесс. Всегда убедитесь, что условие выхода достижимо.'
        }
      ]
    },
    {
      id: 3,
      title: 'for...of: итерация значений',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'for...of итерирует значения любого итерируемого объекта: массивы, строки, Map, Set, генераторы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Массивы\nconst colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}\n\n// С индексом через entries()\nfor (const [index, color] of colors.entries()) {\n  console.log(`${index}: ${color}`);\n}\n\n// Строки\nfor (const char of "Hello") {\n  console.log(char); // H, e, l, l, o\n}\n\n// Map\nconst map = new Map([[\"a\", 1], [\"b\", 2], [\"c\", 3]]);\nfor (const [key, value] of map) {\n  console.log(`${key} -> ${value}`);\n}\n\n// Set\nconst set = new Set([1, 2, 3, 2, 1]);\nfor (const item of set) {\n  console.log(item); // 1, 2, 3 (уникальные)\n}\n\n// arguments в функции (не для стрелочных!)\nfunction sum() {\n  let total = 0;\n  for (const arg of arguments) {\n    total += arg;\n  }\n  return total;\n}\nconsole.log(sum(1, 2, 3, 4, 5)); // 15\n\n// Generator\nfunction* range(start, end, step = 1) {\n  for (let i = start; i < end; i += step) {\n    yield i;\n  }\n}\nfor (const n of range(0, 10, 2)) {\n  console.log(n); // 0, 2, 4, 6, 8\n}'
        },
        {
          type: 'note',
          value: 'for...of работает с любым объектом, имеющим метод Symbol.iterator. Это включает: Array, String, Map, Set, TypedArray, arguments, NodeList, генераторы.'
        }
      ]
    },
    {
      id: 4,
      title: 'for...in: итерация ключей',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'for...in итерирует перечислимые ключи объекта, включая унаследованные. Для объектов предпочтительнее Object.keys().'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// for...in для объектов\nconst person = { name: "Alice", age: 30, city: "Moscow" };\nfor (const key in person) {\n  console.log(`${key}: ${person[key]}`);\n}\n\n// ПРОБЛЕМА: итерирует и прототипные свойства!\nfunction Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.sound = "...";\nconst cat = new Animal("Мурка");\n\nfor (const key in cat) {\n  console.log(key); // name, sound (прототипное!)\n}\n\n// Защита от прототипных свойств\nfor (const key in cat) {\n  if (Object.hasOwn(cat, key)) { // ES2022\n    console.log(key); // только name\n  }\n}\n\n// Лучше использовать Object.keys() для plain objects\nconst obj = { a: 1, b: 2, c: 3 };\nfor (const key of Object.keys(obj)) {\n  console.log(`${key}: ${obj[key]}`);\n}\n\n// Object.entries() — ключ + значение\nfor (const [key, value] of Object.entries(obj)) {\n  console.log(`${key} = ${value}`);\n}\n\n// НЕ используйте for...in для массивов!\nconst arr = [1, 2, 3];\nfor (const key in arr) {\n  console.log(key); // "0", "1", "2" (строки!), плюс прототипы\n}'
        },
        {
          type: 'warning',
          value: 'Никогда не используйте for...in для массивов. Он итерирует строковые ключи и может захватить прототипные свойства. Используйте for...of или Array методы.'
        }
      ]
    },
    {
      id: 5,
      title: 'break, continue и метки',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'break прерывает цикл, continue переходит к следующей итерации. Метки позволяют управлять вложенными циклами.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// break — выход из цикла\nconst numbers = [3, 7, 2, 8, 4, 1, 9];\nlet first_even;\nfor (const n of numbers) {\n  if (n % 2 === 0) {\n    first_even = n;\n    break;\n  }\n}\nconsole.log(first_even); // 2\n\n// continue — пропуск итерации\nfor (let i = 0; i < 10; i++) {\n  if (i % 2 === 0) continue; // пропускаем чётные\n  console.log(i); // 1, 3, 5, 7, 9\n}\n\n// Метки для вложенных циклов\nouter: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i === 1 && j === 1) break outer; // выход из внешнего!\n    console.log(i, j);\n  }\n}\n\n// Поиск в матрице\nfunction findInMatrix(matrix, target) {\n  let found = null;\n  search: for (let row = 0; row < matrix.length; row++) {\n    for (let col = 0; col < matrix[row].length; col++) {\n      if (matrix[row][col] === target) {\n        found = { row, col };\n        break search;\n      }\n    }\n  }\n  return found;\n}\n\nconst matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];\nconsole.log(findInMatrix(matrix, 5)); // {row: 1, col: 1}'
        },
        { type: 'list', items: [
          'break — немедленный выход из цикла; continue — переход к следующей итерации',
          'Метка (label:) перед циклом позволяет break/continue обратиться к внешнему циклу',
          'break label — выход из цикла с данной меткой, даже если находишься во внутреннем',
          'Метки используются редко — альтернатива: вынести во вспомогательную функцию',
          'forEach не поддерживает break/continue — используй for...of если нужен ранний выход'
        ]},
        { type: 'tip', value: 'Вместо меток для поиска в матрице рассмотри альтернативу: вынести поиск в функцию и использовать return. return работает как break — немедленно прекращает выполнение функции.' }
      ]
    },
    {
      id: 6,
      title: 'Итерационные паттерны',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Современный JavaScript предоставляет функциональные альтернативы циклам: map, filter, reduce, every, some, find.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Когда использовать цикл vs функциональный подход\nconst nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Цикл: когда нужна мутация или сложная логика\nconst results = [];\nfor (const n of nums) {\n  if (n % 2 === 0) {\n    results.push(n * n);\n  }\n}\n\n// Функциональный: filter + map (декларативно)\nconst results2 = nums.filter(n => n % 2 === 0).map(n => n * n);\nconsole.log(results2); // [4, 16, 36, 64, 100]\n\n// early return эквивалент — find + every/some\nconst hasNegative = nums.some(n => n < 0); // false\nconst allPositive = nums.every(n => n > 0); // true\nconst firstBig = nums.find(n => n > 5);    // 6\n\n// reduce для аккумуляции\nconst sum = nums.reduce((acc, n) => acc + n, 0); // 55\nconst product = nums.reduce((acc, n) => acc * n, 1); // 3628800\n\n// Цикл для async операций (await в цикле)\nasync function processItems(items) {\n  const results = [];\n  for (const item of items) {\n    const result = await processItem(item); // await работает в for...of\n    results.push(result);\n  }\n  return results;\n}\n// Параллельно: await Promise.all(items.map(processItem))'
        },
        {
          type: 'tip',
          value: 'Используйте функциональные методы (map/filter/reduce) для трансформаций. Используйте for...of когда нужен break/continue или await внутри цикла.'
        }
      ]
    },
    {
      id: 7,
      title: 'Циклы: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте алгоритмы используя различные виды циклов.',
      requirements: [
        'Реализуйте функцию flattenDeep(arr) — разворачивает вложенный массив любой глубины',
        'flattenDeep([1,[2,[3,[4]]]]) -> [1,2,3,4]',
        'Реализуйте функцию chunk(arr, size) — разбивает массив на группы по size',
        'chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]',
        'Реализуйте функцию zip(...arrays) — объединяет массивы по индексам',
        'zip([1,2,3], ["a","b","c"]) -> [[1,"a"],[2,"b"],[3,"c"]]'
      ],
      expectedOutput: 'flattenDeep([1,[2,[3]]]) -> [1,2,3]\nchunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]\nzip([1,2],["a","b"]) -> [[1,"a"],[2,"b"]]',
      hint: 'flattenDeep: рекурсия или arr.flat(Infinity)\nchunk: for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i+size))\nzip: for (let i = 0; i < Math.min(...arrays.map(a=>a.length)); i++) result.push(arrays.map(a=>a[i]))',
      solution: 'function flattenDeep(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) {\n      for (const nested of flattenDeep(item)) {\n        result.push(nested);\n      }\n    } else {\n      result.push(item);\n    }\n  }\n  return result;\n}\n\n// Или встроенный метод:\n// const flattenDeep = (arr) => arr.flat(Infinity);\n\nfunction chunk(arr, size) {\n  if (size <= 0) throw new Error("Размер группы должен быть > 0");\n  const result = [];\n  for (let i = 0; i < arr.length; i += size) {\n    result.push(arr.slice(i, i + size));\n  }\n  return result;\n}\n\nfunction zip(...arrays) {\n  if (arrays.length === 0) return [];\n  const minLen = Math.min(...arrays.map(a => a.length));\n  const result = [];\n  for (let i = 0; i < minLen; i++) {\n    result.push(arrays.map(a => a[i]));\n  }\n  return result;\n}\n\n// Тесты flattenDeep\nconsole.log(flattenDeep([1, [2, [3, [4]]]])); // [1,2,3,4]\nconsole.log(flattenDeep([[1, 2], [3, 4], [5]])); // [1,2,3,4,5]\nconsole.log(flattenDeep([1, 2, 3])); // [1,2,3]\n\n// Тесты chunk\nconsole.log(chunk([1,2,3,4,5], 2)); // [[1,2],[3,4],[5]]\nconsole.log(chunk([1,2,3,4,6], 3)); // [[1,2,3],[4,6]]\nconsole.log(chunk([], 2)); // []\n\n// Тесты zip\nconsole.log(zip([1,2,3], ["a","b","c"])); // [[1,"a"],[2,"b"],[3,"c"]]\nconsole.log(zip([1,2,3], ["a","b"]));     // [[1,"a"],[2,"b"]] (по минимуму)\nconsole.log(zip([1,2], ["a","b"], [true,false])); // [[1,"a",true],[2,"b",false]]',
      explanation: 'flattenDeep рекурсивно разворачивает вложенные массивы. Встроенный arr.flat(Infinity) делает то же самое. chunk использует for с шагом size и slice для разбивки. zip берёт Math.min длин чтобы не выйти за границы более короткого массива, затем для каждого индекса берёт элемент из каждого массива.'
    }
  ]
};
