export default {
  id: 9,
  title: 'Массивы',
  description: 'Методы массивов: push/pop, map, filter, reduce, find, sort и продвинутые паттерны',
  lessons: [
    {
      id: 1,
      title: 'Создание массивов и базовые операции',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Массивы в JavaScript — объекты с числовыми ключами. Элементы могут быть любого типа, длина динамична.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Создание массивов\nconst arr1 = [1, 2, 3];           // литерал\nconst arr2 = new Array(3);        // [empty x3]\nconst arr3 = Array.from({length: 5}, (_, i) => i); // [0,1,2,3,4]\nconst arr4 = Array.of(1, 2, 3);   // [1,2,3]\nconst arr5 = [...arr1, ...arr3];  // spread\n\n// Доступ к элементам\nconst fruits = ["apple", "banana", "cherry"];\nconsole.log(fruits[0]);          // "apple"\nconsole.log(fruits.at(-1));      // "cherry" (с конца)\nconsole.log(fruits.at(-2));      // "banana"\n\n// Базовые мутирующие методы\nconst stack = [];\nstack.push(1, 2, 3); // добавить в конец\nconsole.log(stack);   // [1, 2, 3]\nconsole.log(stack.pop()); // 3 — удалить с конца\nconsole.log(stack.shift()); // 1 — удалить с начала\nstack.unshift(0);    // добавить в начало\nconsole.log(stack);   // [0, 2]\n\n// splice — универсальное изменение\nconst arr = [1, 2, 3, 4, 5];\narr.splice(2, 1);        // удалить 1 элемент с индекса 2\nconsole.log(arr);         // [1, 2, 4, 5]\narr.splice(2, 0, 3);     // вставить 3 на позицию 2\nconsole.log(arr);         // [1, 2, 3, 4, 5]\narr.splice(1, 2, 10, 20); // заменить 2 элемента с позиции 1\nconsole.log(arr);         // [1, 10, 20, 4, 5]'
        },
        { type: 'list', items: [
          'arr.at(-1) — последний элемент (ES2022), удобнее чем arr[arr.length - 1]',
          'push/pop работают с концом массива (стек), shift/unshift — с началом (очередь)',
          'splice мутирует массив — будь осторожен; для немутирующей альтернативы используй toSpliced (ES2023)',
          'Array.from({length: n}, fn) — быстрый способ создать массив с вычисленными значениями',
          'new Array(3) создаёт [empty x3] — не [undefined, undefined, undefined]: пустые слоты не итерируются'
        ]},
        { type: 'tip', value: 'Мутирующие методы (push, pop, splice, sort, reverse) изменяют исходный массив. Немутирующие (map, filter, slice, concat) возвращают новый. В React и функциональном программировании предпочитай немутирующие.' }
      ]
    },
    {
      id: 2,
      title: 'map, filter, reduce',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'map, filter, reduce — три основных метода функционального программирования с массивами. Они не мутируют исходный массив.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// map — трансформация каждого элемента\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst strings = nums.map(n => n.toString());\nconst objects = nums.map((n, i) => ({ id: i, value: n }));\nconsole.log(doubled);  // [2, 4, 6, 8, 10]\nconsole.log(objects);  // [{id:0,value:1}, ...]\n\n// filter — отбор по условию\nconst evens = nums.filter(n => n % 2 === 0);\nconst odds = nums.filter(n => n % 2 !== 0);\nconsole.log(evens); // [2, 4]\nconsole.log(odds);  // [1, 3, 5]\n\n// reduce — свёртка в одно значение\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconst max = nums.reduce((acc, n) => Math.max(acc, n), -Infinity);\nconst freq = [1,2,2,3,3,3].reduce((acc, n) => {\n  acc[n] = (acc[n] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(sum);  // 15\nconsole.log(max);  // 5\nconsole.log(freq); // {1:1, 2:2, 3:3}\n\n// Цепочки методов\nconst users = [\n  { name: "Alice", age: 30, active: true },\n  { name: "Bob", age: 17, active: true },\n  { name: "Charlie", age: 25, active: false },\n  { name: "Dave", age: 22, active: true }\n];\nconst activeAdults = users\n  .filter(u => u.active && u.age >= 18)\n  .map(u => u.name)\n  .sort();\nconsole.log(activeAdults); // ["Alice", "Dave"]'
        },
        {
          type: 'tip',
          value: 'Всегда передавайте начальное значение в reduce (второй аргумент). Без него reduce использует первый элемент как acc и начинает со второго — это может привести к ошибкам на пустых массивах.'
        }
      ]
    },
    {
      id: 3,
      title: 'find, findIndex, every, some',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Методы поиска и проверки условий. Возвращают значение/индекс или boolean.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'const users = [\n  { id: 1, name: "Alice", role: "admin" },\n  { id: 2, name: "Bob", role: "user" },\n  { id: 3, name: "Charlie", role: "user" }\n];\n\n// find — первый элемент удовлетворяющий условию\nconst admin = users.find(u => u.role === "admin");\nconsole.log(admin); // {id:1, name:"Alice", role:"admin"}\n\n// findIndex — индекс первого элемента\nconst idx = users.findIndex(u => u.name === "Bob");\nconsole.log(idx); // 1\n\n// findLast и findLastIndex (ES2023)\nconst lastUser = users.findLast(u => u.role === "user");\nconsole.log(lastUser); // Charlie\n\n// includes — наличие значения\nconsole.log([1,2,3].includes(2)); // true\nconsole.log([1,2,3].includes(4)); // false\n\n// some — хотя бы один элемент удовлетворяет\nconsole.log(users.some(u => u.role === "admin")); // true\nconsole.log(users.some(u => u.age > 100));         // false\n\n// every — все элементы удовлетворяют\nconsole.log([2,4,6].every(n => n % 2 === 0)); // true\nconsole.log([2,3,6].every(n => n % 2 === 0)); // false\n\n// indexOf (для примитивов)\nconsole.log([1,2,3,2].indexOf(2));  // 1 (первое)\nconsole.log([1,2,3,2].lastIndexOf(2)); // 3 (последнее)\nconsole.log([1,2,3].indexOf(4));   // -1 (не найдено)'
        },
        { type: 'list', items: [
          'find возвращает первый совпадающий элемент или undefined — проверяй что элемент найден',
          'findIndex возвращает -1 если не найдено — используй !== -1 для проверки',
          'some останавливается при первом совпадении (false не продолжает) — эффективен',
          'every останавливается при первом несоответствии — также эффективен',
          'includes использует SameValueZero — работает с NaN: [NaN].includes(NaN) === true'
        ]},
        { type: 'tip', value: 'Шпаргалка: find — найти объект; findIndex — найти позицию; includes — проверить наличие; some — хотя бы один; every — все. Для объектов indexOf не работает по значению — используй findIndex с условием.' }
      ]
    },
    {
      id: 4,
      title: 'sort и другие методы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'sort мутирует массив и требует компаратора для числовой сортировки. flat, flatMap, forEach — другие полезные методы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// sort — мутирует исходный массив!\nconst nums = [3, 1, 4, 1, 5, 9, 2, 6];\nnums.sort((a, b) => a - b); // по возрастанию\nconsole.log(nums); // [1, 1, 2, 3, 4, 5, 6, 9]\n\nconst words = ["banana", "Apple", "cherry"];\nwords.sort((a, b) => a.localeCompare(b)); // регистронезависимо\nconsole.log(words); // ["Apple", "banana", "cherry"]\n\n// Сортировка без мутации (ES2023 toSorted)\nconst original = [3, 1, 4, 1, 5];\nconst sorted = [...original].sort((a, b) => a - b);\nconsole.log(original); // [3, 1, 4, 1, 5] — не изменился!\nconsole.log(sorted);   // [1, 1, 3, 4, 5]\n\n// Сортировка объектов\nconst people = [{name:"Charlie",age:30},{name:"Alice",age:25},{name:"Bob",age:35}];\npeople.sort((a, b) => a.age - b.age);    // по возрасту\npeople.sort((a, b) => a.name.localeCompare(b.name)); // по имени\n\n// flat и flatMap\nconst nested = [[1,2],[3,[4,5]],[6]];\nconsole.log(nested.flat());   // [1,2,3,[4,5],6] — 1 уровень\nconsole.log(nested.flat(2));  // [1,2,3,4,5,6] — 2 уровня\nconsole.log(nested.flat(Infinity)); // полное разворачивание\n\n// flatMap — map + flat(1)\nconst sentences = ["Hello World", "Foo Bar"];\nconst words2 = sentences.flatMap(s => s.split(" "));\nconsole.log(words2); // ["Hello","World","Foo","Bar"]\n\n// forEach — побочные эффекты (не возвращает значение!)\nnums.forEach((n, i) => {\n  // Используйте для side effects, не для трансформаций\n});\n\n// slice — НЕ мутирует\nconst arr = [1,2,3,4,5];\nconsole.log(arr.slice(1, 3)); // [2, 3]\nconsole.log(arr.slice(-2));   // [4, 5]'
        },
        {
          type: 'warning',
          value: 'sort() без компаратора преобразует элементы в строки! [10,9,2].sort() = [10,2,9] — неверный результат. Всегда передавайте (a, b) => a - b для числовой сортировки.'
        }
      ]
    },
    {
      id: 5,
      title: 'Деструктуризация и spread',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Деструктуризация массивов и spread оператор — мощные инструменты для работы с данными.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Деструктуризация массива\nconst [a, b, c] = [1, 2, 3];\nconsole.log(a, b, c); // 1 2 3\n\n// Пропуск элементов\nconst [first, , third] = [1, 2, 3];\nconsole.log(first, third); // 1 3\n\n// Rest\nconst [head, ...tail] = [1, 2, 3, 4, 5];\nconsole.log(head); // 1\nconsole.log(tail); // [2, 3, 4, 5]\n\n// Значения по умолчанию\nconst [x = 10, y = 20] = [5];\nconsole.log(x, y); // 5 20\n\n// Обмен переменных\nlet p = 1, q = 2;\n[p, q] = [q, p];\nconsole.log(p, q); // 2 1\n\n// Spread для объединения\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\nconst combined = [...arr1, ...arr2];\nconsole.log(combined); // [1,2,3,4,5,6]\n\n// Spread для копии\nconst copy = [...arr1]; // не мутирует оригинал\n\n// Array.from с итерируемых\nconst set = new Set([1, 2, 2, 3, 3]);\nconst unique = Array.from(set); // [1, 2, 3]\nconst chars = Array.from("hello"); // ["h","e","l","l","o"]\nconst range = Array.from({length: 5}, (_, i) => i + 1); // [1,2,3,4,5]'
        },
        { type: 'list', items: [
          'Деструктуризация присваивает значения по позиции — пропуск элементов через двойную запятую [a, , b]',
          'Rest-элемент (...rest) всегда последний в деструктуризации и собирает оставшиеся элементы',
          'Обмен переменных через деструктуризацию [a, b] = [b, a] — без временной переменной',
          'Spread создаёт поверхностную копию — вложенные объекты остаются ссылками',
          'Array.from работает с любым итерируемым объектом: строками, Set, Map, NodeList'
        ]},
        { type: 'tip', value: 'Деструктуризация массива vs объекта: массив — по позиции ([a, b, c]), объект — по имени ({name, age}). Для переименования в объектной деструктуризации используй двоеточие: const { name: userName } = user.' }
      ]
    },
    {
      id: 6,
      title: 'Продвинутые операции с массивами',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Паттерны для группировки, разворачивания и трансформации массивов.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Object.groupBy (ES2024) или ручная группировка\nconst items = [\n  {type:"a", value:1}, {type:"b", value:2},\n  {type:"a", value:3}, {type:"b", value:4}\n];\n\n// Ручная группировка через reduce\nconst grouped = items.reduce((groups, item) => {\n  const key = item.type;\n  groups[key] = groups[key] ?? [];\n  groups[key].push(item);\n  return groups;\n}, {});\nconsole.log(grouped);\n// {a: [{type:"a",value:1},{type:"a",value:3}], b: [...]}\n\n// Уникальные значения\nconst withDups = [1, 2, 2, 3, 3, 3, 4];\nconst unique = [...new Set(withDups)];\nconsole.log(unique); // [1, 2, 3, 4]\n\n// Пересечение массивов\nconst arr1 = [1, 2, 3, 4];\nconst arr2 = [2, 4, 6];\nconst intersection = arr1.filter(x => arr2.includes(x));\nconsole.log(intersection); // [2, 4]\n\n// Разность массивов\nconst diff = arr1.filter(x => !arr2.includes(x));\nconsole.log(diff); // [1, 3]\n\n// Максимум/минимум\nconst nums = [3, 1, 4, 1, 5, 9, 2, 6];\nconsole.log(Math.max(...nums)); // 9\nconsole.log(Math.min(...nums)); // 1\n\n// Транспозиция матрицы\nconst matrix = [[1,2,3],[4,5,6],[7,8,9]];\nconst transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));\nconsole.log(transposed); // [[1,4,7],[2,5,8],[3,6,9]]'
        },
        { type: 'list', items: [
          'Уникальные значения: [...new Set(arr)] — самый лаконичный способ для примитивов',
          'Пересечение: filter + includes — O(n*m); для больших массивов используй Set для O(n+m)',
          'Math.max(...arr) работает только если spread не вызывает переполнение стека — для больших массивов используй reduce',
          'Object.groupBy (ES2024) — нативная группировка, но поддержка ещё не везде; используй reduce',
          'Транспозиция матрицы: matrix[0].map((_, i) => matrix.map(row => row[i])) — классический трюк'
        ]},
        { type: 'tip', value: 'Для операций над множествами (пересечение, разность, объединение) используй Set: const setA = new Set(arr1); arr2.filter(x => setA.has(x)) — O(n) вместо O(n*m) с includes. Для больших данных это важно.' }
      ]
    },
    {
      id: 7,
      title: 'Методы массивов: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функции обработки данных используя методы массивов.',
      requirements: [
        'Реализуйте функцию groupBy(arr, key) — группирует массив объектов по ключу',
        'groupBy([{type:"a",v:1},{type:"b",v:2},{type:"a",v:3}], "type") -> {a:[...],b:[...]}',
        'Реализуйте функцию unique(arr) — возвращает массив уникальных значений',
        'Реализуйте функцию sortBy(arr, ...keys) — сортировка по нескольким полям',
        'sortBy(users, "age", "name") — сначала по age, потом по name при равном age'
      ],
      expectedOutput: 'groupBy(items, "type") -> {a:[...],b:[...]}\nunique([1,2,2,3,1]) -> [1,2,3]\nsortBy(users, "age") -> отсортированный массив',
      hint: 'groupBy: reduce с acc[item[key]] = acc[item[key]] ?? []; push;\nunique: [...new Set(arr)] для примитивов; для объектов — reduce с проверкой\nsortBy: arr.sort с компаратором перебирающим keys',
      solution: 'function groupBy(arr, key) {\n  return arr.reduce((groups, item) => {\n    const groupKey = typeof key === "function" ? key(item) : item[key];\n    groups[groupKey] = groups[groupKey] ?? [];\n    groups[groupKey].push(item);\n    return groups;\n  }, {});\n}\n\nfunction unique(arr) {\n  return [...new Set(arr)];\n}\n\nfunction uniqueBy(arr, key) {\n  const seen = new Set();\n  return arr.filter(item => {\n    const k = typeof key === "function" ? key(item) : item[key];\n    if (seen.has(k)) return false;\n    seen.add(k);\n    return true;\n  });\n}\n\nfunction sortBy(arr, ...keys) {\n  return [...arr].sort((a, b) => {\n    for (const key of keys) {\n      const aVal = a[key];\n      const bVal = b[key];\n      if (aVal < bVal) return -1;\n      if (aVal > bVal) return 1;\n    }\n    return 0;\n  });\n}\n\n// Тесты groupBy\nconst products = [\n  { type: "fruit", name: "apple", price: 1 },\n  { type: "veggie", name: "carrot", price: 0.5 },\n  { type: "fruit", name: "banana", price: 0.3 },\n  { type: "veggie", name: "potato", price: 0.2 }\n];\nconst byType = groupBy(products, "type");\nconsole.log(Object.keys(byType)); // ["fruit", "veggie"]\nconsole.log(byType.fruit.map(p => p.name)); // ["apple", "banana"]\n\n// Группировка по функции\nconst byPrice = groupBy(products, p => p.price < 0.5 ? "cheap" : "expensive");\nconsole.log(Object.keys(byPrice)); // ["expensive", "cheap"]\n\n// Тесты unique\nconsole.log(unique([1,2,2,3,3,1]));     // [1,2,3]\nconsole.log(unique(["a","b","a","c"])); // ["a","b","c"]\n\n// uniqueBy для объектов\nconst users = [\n  {id:1, name:"Alice"}, {id:2, name:"Bob"}, {id:1, name:"Alice copy"}\n];\nconsole.log(uniqueBy(users, "id").map(u => u.name)); // ["Alice", "Bob"]\n\n// Тесты sortBy\nconst data = [\n  { name: "Charlie", age: 30 },\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 25 },\n  { name: "Dave", age: 20 }\n];\nconsole.log(sortBy(data, "age", "name").map(u => u.name)); // ["Dave","Alice","Bob","Charlie"]',
      explanation: 'groupBy с функцией в качестве key — гибкий подход: можно группировать и по полю и по вычисляемому значению. unique через Set — O(n) сложность. uniqueBy использует Set для отслеживания уже виденных ключей. sortBy с несколькими ключами сортирует по первому ключу, при равенстве — по второму и т.д. [...arr] создаёт копию чтобы не мутировать исходный массив.'
    },
    {
      id: 8,
      title: 'reduce и сложные трансформации: практика',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте сложные трансформации данных используя reduce и другие методы.',
      requirements: [
        'Реализуйте функцию pivot(data, rowKey, colKey, valueKey) — создаёт сводную таблицу из массива объектов',
        'Реализуйте функцию topN(arr, n, key) — возвращает N наибольших элементов',
        'Реализуйте функцию runningTotal(arr) — кумулятивная сумма',
        'runningTotal([1,2,3,4]) -> [1,3,6,10]',
        'Реализуйте функцию frequencies(arr) — частотный анализ с процентами'
      ],
      expectedOutput: 'pivot(sales, "region", "product", "amount") -> объект сводной таблицы\ntopN([3,1,4,1,5,9], 3) -> [9,5,4]\nrunningTotal([1,2,3,4]) -> [1,3,6,10]\nfrequencies(["a","b","a"]) -> {a:{count:2,pct:66.7},b:{count:1,pct:33.3}}',
      hint: 'pivot: reduce создаёт {row: {col: value}}\ntopN: [...arr].sort(desc).slice(0, n)\nrunningTotal: reduce с отслеживанием предыдущей суммы\nfrequencies: сначала count через reduce, потом map для pct',
      solution: 'function pivot(data, rowKey, colKey, valueKey) {\n  return data.reduce((result, item) => {\n    const row = item[rowKey];\n    const col = item[colKey];\n    const value = item[valueKey];\n    if (!result[row]) result[row] = {};\n    result[row][col] = (result[row][col] || 0) + value;\n    return result;\n  }, {});\n}\n\nfunction topN(arr, n, key = null) {\n  const getValue = key ? item => item[key] : item => item;\n  return [...arr]\n    .sort((a, b) => getValue(b) - getValue(a))\n    .slice(0, n);\n}\n\nfunction runningTotal(arr) {\n  let sum = 0;\n  return arr.map(n => (sum += n));\n}\n\nfunction frequencies(arr) {\n  const counts = arr.reduce((acc, item) => {\n    acc[item] = (acc[item] || 0) + 1;\n    return acc;\n  }, {});\n  const total = arr.length;\n  return Object.fromEntries(\n    Object.entries(counts).map(([key, count]) => [\n      key,\n      { count, pct: Math.round(count / total * 1000) / 10 }\n    ])\n  );\n}\n\n// Тесты pivot\nconst sales = [\n  { region: "North", product: "A", amount: 100 },\n  { region: "South", product: "A", amount: 150 },\n  { region: "North", product: "B", amount: 200 },\n  { region: "South", product: "B", amount: 120 },\n  { region: "North", product: "A", amount: 50 }\n];\nconsole.log("Pivot:");\nconsole.log(pivot(sales, "region", "product", "amount"));\n// {North: {A:150, B:200}, South: {A:150, B:120}}\n\n// Тесты topN\nconsole.log(topN([3,1,4,1,5,9,2,6], 3)); // [9,6,5]\nconst users = [{name:"Alice",score:90},{name:"Bob",score:85},{name:"Charlie",score:95}];\nconsole.log(topN(users, 2, "score").map(u => u.name)); // ["Charlie","Alice"]\n\n// Тесты runningTotal\nconsole.log(runningTotal([1,2,3,4,5])); // [1,3,6,10,15]\nconsole.log(runningTotal([10,-5,3]));   // [10,5,8]\n\n// Тесты frequencies\nconsole.log(frequencies(["a","b","a","c","a","b"]));\n// {a:{count:3,pct:50}, b:{count:2,pct:33.3}, c:{count:1,pct:16.7}}',
      explanation: 'pivot использует двухуровневый reduce: внешний создаёт строки, внутренний суммирует по колонкам. topN создаёт копию через spread (не мутирует), сортирует в обратном порядке, берёт первые n. runningTotal использует внешнюю переменную sum в замыкании map — каждый вызов аккумулирует. frequencies сначала считает, затем Object.fromEntries(Object.entries().map()) для преобразования в новую структуру.'
    }
  ]
};
