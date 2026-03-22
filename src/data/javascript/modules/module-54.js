export default {
  id: 54,
  title: 'Практикум — Массивы и объекты',
  description: 'Практические задачи на работу с массивами и объектами: трансформации, поиск, группировка, сортировка',
  lessons: [
    {
      id: 1,
      title: 'Уникальные элементы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию unique(arr): возвращает массив без дубликатов. Три реализации: через Set, через filter+indexOf, через reduce.',
      requirements: [
        'unique([1, 2, 2, 3, 1]) -> [1, 2, 3]',
        'unique(["a", "b", "a"]) -> ["a", "b"]',
        'unique([]) -> []',
        'Порядок элементов должен сохраниться'
      ],
      hint: 'Через Set: [...new Set(arr)]. Через filter: arr.filter((x, i) => arr.indexOf(x) === i). Через reduce: накапливайте элементы если их ещё нет в аккумуляторе.',
      expectedOutput: 'unique([1,2,2,3,3,3]) -> [1, 2, 3]\nunique(["a","b","a","c"]) -> ["a", "b", "c"]\nunique([]) -> []\nВсе три реализации дают одинаковый результат',
      solution: '// Через Set\nconst uniqueSet = (arr) => [...new Set(arr)];\n\n// Через filter\nconst uniqueFilter = (arr) => arr.filter((item, idx) => arr.indexOf(item) === idx);\n\n// Через reduce\nconst uniqueReduce = (arr) => arr.reduce(\n  (acc, item) => acc.includes(item) ? acc : [...acc, item],\n  []\n);\n\nconsole.log(uniqueSet([1, 2, 2, 3, 1]));         // [1, 2, 3]\nconsole.log(uniqueFilter(["a", "b", "a"]));       // ["a", "b"]\nconsole.log(uniqueReduce([1, 1, 2, 3, 2, 3]));   // [1, 2, 3]',
      explanation: 'Set автоматически хранит только уникальные значения в порядке вставки — самый быстрый и читаемый способ O(n). filter с indexOf: условие arr.indexOf(item) === idx истинно только для первого вхождения элемента. reduce с includes — самый явный, но O(n^2) из-за includes внутри цикла. Для больших массивов Set предпочтителен. Все три сохраняют порядок первого появления элементов.'
    },
    {
      id: 2,
      title: 'Плоский массив',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте flatten(arr, depth): разворачивает вложенный массив. Без использования Array.flat(). Поддержите глубину разворачивания.',
      requirements: [
        'flatten([1, [2, 3], [4, [5]]]) -> [1, 2, 3, 4, [5]] (depth=1)',
        'flatten([1, [2, [3, [4]]]], Infinity) -> [1, 2, 3, 4]',
        'flatten([1, 2, 3]) -> [1, 2, 3]'
      ],
      hint: 'Рекурсивно: для каждого элемента если массив — рекурсивно flattten с depth-1, иначе добавьте в результат. Итеративно: используйте стек. depth=Infinity разворачивает полностью.',
      expectedOutput: 'flatten([1,[2,[3,[4]]]]) -> [1, 2, 3, 4]\nflatten([1,[2,[3]]], 1) -> [1, 2, [3]]\nflatten([1,2,3]) -> [1, 2, 3]\nflatten([]) -> []',
      solution: 'function flatten(arr, depth = 1) {\n  if (depth === 0) return [...arr];\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      acc.push(...flatten(item, depth === Infinity ? Infinity : depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}\n\nconsole.log(flatten([1, [2, 3], [4, [5]]]));         // [1, 2, 3, 4, [5]]\nconsole.log(flatten([1, [2, [3, [4]]]], Infinity));   // [1, 2, 3, 4]\nconsole.log(flatten([[1, 2], [3, [4, 5]]], 1));       // [1, 2, 3, [4, 5]]',
      explanation: 'Рекурсивная flatten использует reduce для накопления результата. При каждом вложенном массиве рекурсивно вызывается с depth-1, что ограничивает глубину разворачивания. Infinity означает полное разворачивание без ограничений. acc.push(...arr) быстрее чем acc.concat(arr) для малых массивов. Базовый случай depth === 0 — копировать без разворачивания.'
    },
    {
      id: 3,
      title: 'Группировка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция groupBy(arr, key): группирует массив объектов по значению ключа. Также реализуйте groupBy с функцией-трансформером.',
      requirements: [
        'groupBy([{a:1,b:"x"},{a:2,b:"y"},{a:3,b:"x"}], "b") -> {x:[...], y:[...]}',
        'groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? "even" : "odd")',
        'groupBy по вычисляемому ключу'
      ],
      hint: 'Используйте reduce: для каждого элемента определите ключ через key (строка или функция), добавьте элемент в группу с этим ключом. Начальное значение — пустой объект {}.',
      expectedOutput: 'groupBy(users, "city") -> { "Алматы": [...], "Астана": [...] }\ngroupBy([1,2,3,4,5], x => x%2===0 ? "чётные" : "нечётные") -> { нечётные:[1,3,5], чётные:[2,4] }\ngroupBy([], "key") -> {}',
      solution: 'function groupBy(arr, keyOrFn) {\n  const getKey = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];\n  return arr.reduce((groups, item) => {\n    const key = getKey(item);\n    (groups[key] = groups[key] || []).push(item);\n    return groups;\n  }, {});\n}\n\nconst users = [\n  { name: "Алия", role: "admin" },\n  { name: "Берик", role: "user" },\n  { name: "Карина", role: "admin" }\n];\n\nconsole.log(groupBy(users, "role"));\n// { admin: [{name:"Алия"...},{name:"Карина"...}], user: [{name:"Берик"...}] }\n\nconsole.log(groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? "even" : "odd"));\n// { odd: [1,3,5], even: [2,4,6] }\n\nconsole.log(groupBy([1,11,21,2,12], n => Math.floor(n / 10)));\n// { "0": [1,2], "1": [11,12], "2": [21] }',
      explanation: 'Полиморфный keyOrFn: если передана строка — используется как имя поля, если функция — вызывается как трансформер. Это паттерн адаптер/стратегия. (groups[key] = groups[key] || []).push(item) — идиома "инициализировать если не существует": если группы ещё нет, создать пустой массив и сразу добавить элемент. reduce превращает массив в объект за один проход O(n).'
    },
    {
      id: 4,
      title: 'Глубокое слияние объектов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Функция deepMerge(obj1, obj2): глубоко сливает два объекта. Вложенные объекты сливаются рекурсивно, массивы конкатенируются.',
      requirements: [
        'deepMerge({a:1,b:{c:2}}, {b:{d:3},e:4}) -> {a:1,b:{c:2,d:3},e:4}',
        'Вложенные объекты не перезаписываются, а дополняются',
        'Массивы конкатенируются: deepMerge({a:[1]},{a:[2]}) -> {a:[1,2]}',
        'Примитивы из obj2 перезаписывают obj1'
      ],
      hint: 'Для каждого ключа obj2: если оба значения — объекты (не массивы), рекурсивно сливайте. Если массивы — конкатенируйте. Иначе — значение из obj2 побеждает.',
      expectedOutput: 'deepMerge({a:1,b:{c:2}}, {b:{d:3},e:4}) -> {a:1, b:{c:2,d:3}, e:4}\ndeepMerge({tags:["a"]}, {tags:["b"]}) -> {tags:["a","b"]}\ndeepMerge({x:1}, {x:2}) -> {x:2}',
      solution: 'function deepMerge(obj1, obj2) {\n  if (typeof obj1 !== "object" || obj1 === null) return obj2;\n  if (typeof obj2 !== "object" || obj2 === null) return obj2;\n\n  const result = { ...obj1 };\n\n  for (const key of Object.keys(obj2)) {\n    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {\n      result[key] = [...obj1[key], ...obj2[key]];\n    } else if (\n      typeof obj2[key] === "object" && obj2[key] !== null &&\n      typeof obj1[key] === "object" && obj1[key] !== null\n    ) {\n      result[key] = deepMerge(obj1[key], obj2[key]);\n    } else {\n      result[key] = obj2[key];\n    }\n  }\n\n  return result;\n}\n\nconsole.log(deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 }));\n// { a: 1, b: { c: 2, d: 3 }, e: 4 }\n\nconsole.log(deepMerge({ tags: [1, 2] }, { tags: [3, 4] }));\n// { tags: [1, 2, 3, 4] }',
      explanation: 'Ключевое отличие от Object.assign и spread: они делают поверхностное копирование (shallow merge) — вложенные объекты перезаписываются целиком. deepMerge рекурсивно обрабатывает каждый вложенный объект. Массивы — особый случай: typeof [] === "object", поэтому нужна явная проверка Array.isArray перед обычной проверкой объекта. Иммутабельность обеспечивается созданием нового объекта через spread и рекурсивными вызовами.'
    },
    {
      id: 5,
      title: 'Поиск в массиве объектов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию search(arr, query): ищет объекты в массиве по всем строковым полям. Регистронезависимый поиск.',
      requirements: [
        'search(users, "алия") ищет во всех строковых полях',
        'Нечувствительность к регистру',
        'Возвращает массив совпадений',
        'search(users, "") -> все элементы'
      ],
      hint: 'Приведите query к нижнему регистру. Для каждого объекта проверьте все значения строковых полей через Object.values(). Используйте String(val).toLowerCase().includes(query).',
      expectedOutput: 'search(users, "алия") -> все записи содержащие "алия" в любом поле\nsearch(products, "телефон") -> { name: "Смартфон", description: "Мобильный телефон" }\nsearch([], "query") -> []',
      solution: 'function search(arr, query) {\n  if (!query) return arr;\n  const q = query.toLowerCase();\n  return arr.filter(item =>\n    Object.values(item).some(val =>\n      typeof val === "string" && val.toLowerCase().includes(q)\n    )\n  );\n}\n\nconst users = [\n  { id: 1, name: "Алия Иванова", email: "aliya@test.com", city: "Алматы" },\n  { id: 2, name: "Берик Смаилов", email: "berik@test.com", city: "Астана" },\n  { id: 3, name: "Карина Ли", email: "karina@test.com", city: "Алматы" }\n];\n\nconsole.log(search(users, "алматы"));    // Алия и Карина\nconsole.log(search(users, "berik"));     // Берик\nconsole.log(search(users, "test.com")); // все трое',
      explanation: 'Object.values(item) получает все значения объекта без знания конкретных ключей — поиск автоматически работает по всем полям. some() — ленивый итератор: останавливается при первом совпадении. typeof val === "string" защищает от ошибок при вызове .includes() на числах или null. toLowerCase на обеих сторонах делает поиск нечувствительным к регистру. Пустой запрос возвращает все элементы — разумное поведение для поиска.'
    },
    {
      id: 6,
      title: 'Пагинация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция paginate(arr, page, limit): разбивает массив на страницы и возвращает объект с данными страницы и метаданными.',
      requirements: [
        'paginate([1..20], 1, 5) -> { data:[1..5], page:1, limit:5, total:20, totalPages:4, hasNext:true, hasPrev:false }',
        'paginate([1..10], 2, 3) -> page 2 с элементами 4,5,6',
        'paginate([1..5], 10, 3) -> пустой data, page 10'
      ],
      hint: 'page начинается с 1. skip = (page-1)*limit. Данные страницы: arr.slice(skip, skip+limit). Метаданные: total, totalPages=Math.ceil(total/limit), hasNext, hasPrev.',
      expectedOutput: 'paginate([1..10], 1, 3) -> { data:[1,2,3], page:1, total:10, totalPages:4, hasNext:true, hasPrev:false }\npaginate([1..10], 4, 3) -> { data:[10], page:4, total:10, hasNext:false, hasPrev:true }\npaginate([], 1, 10) -> { data:[], total:0, totalPages:0 }',
      solution: 'function paginate(arr, page = 1, limit = 10) {\n  const total = arr.length;\n  const totalPages = Math.ceil(total / limit);\n  const start = (page - 1) * limit;\n  const data = arr.slice(start, start + limit);\n\n  return {\n    data,\n    page,\n    limit,\n    total,\n    totalPages,\n    hasNext: page < totalPages,\n    hasPrev: page > 1\n  };\n}\n\nconst items = Array.from({ length: 20 }, (_, i) => i + 1);\nconsole.log(paginate(items, 1, 5));\n// { data: [1,2,3,4,5], page: 1, limit: 5, total: 20, totalPages: 4, hasNext: true, hasPrev: false }\n\nconsole.log(paginate(items, 4, 5));\n// { data: [16,17,18,19,20], page: 4, ..., hasNext: false, hasPrev: true }',
      explanation: 'Формула смещения: start = (page - 1) * limit. Страница 1 начинается с индекса 0, страница 2 — с limit и так далее. Math.ceil для totalPages: например 21 элемент при limit=10 даёт 3 страницы (2.1 округляется вверх). arr.slice(start, start + limit) безопасно работает даже если end > arr.length — просто вернёт меньше элементов. hasNext и hasPrev — метаданные которые избавляют клиента от повторного вычисления.'
    },
    {
      id: 7,
      title: 'Трансформация дерева',
      type: 'practice',
      difficulty: 'hard',
      description: 'Преобразуйте плоский список с parentId в дерево и обратно. Плоский: [{id, parentId, name}]. Дерево: [{id, name, children:[...]}].',
      requirements: [
        'arrayToTree([{id:1,parentId:null},{id:2,parentId:1},{id:3,parentId:1}]) -> дерево',
        'treeToArray(tree) -> плоский массив с parentId',
        'Поддержать неограниченную глубину'
      ],
      hint: 'Для flat->tree: создайте Map по id, затем для каждого узла добавьте в children родителя. Корневые узлы — те у кого parentId null/undefined. Для tree->flat: рекурсивный обход с удалением поля children.',
      expectedOutput: 'flatToTree([{id:1,parentId:null},{id:2,parentId:1}]) -> [{id:1,children:[{id:2,children:[]}]}]\ntreeToFlat(tree) -> [{id:1,parentId:null},{id:2,parentId:1}]\nГлубокое дерево обрабатывается корректно',
      solution: 'function arrayToTree(items) {\n  const map = {};\n  const roots = [];\n\n  items.forEach(item => {\n    map[item.id] = { ...item, children: [] };\n  });\n\n  items.forEach(item => {\n    if (item.parentId === null || item.parentId === undefined) {\n      roots.push(map[item.id]);\n    } else if (map[item.parentId]) {\n      map[item.parentId].children.push(map[item.id]);\n    }\n  });\n\n  return roots;\n}\n\nfunction treeToArray(tree, parentId = null) {\n  return tree.flatMap(node => {\n    const { children, ...item } = node;\n    return [{ ...item, parentId }, ...treeToArray(children || [], node.id)];\n  });\n}\n\nconst flat = [\n  { id: 1, parentId: null, name: "Корень" },\n  { id: 2, parentId: 1, name: "Ветка 1" },\n  { id: 3, parentId: 1, name: "Ветка 2" },\n  { id: 4, parentId: 2, name: "Лист 1" }\n];\n\nconst tree = arrayToTree(flat);\nconsole.log(JSON.stringify(tree, null, 2));\n\nconst backToFlat = treeToArray(tree);\nconsole.log(backToFlat);',
      explanation: 'arrayToTree: два прохода — первый строит Map(id -> узел с children:[]), второй устанавливает связи родитель-потомок. Ключ оптимальности: поиск родителя O(1) через map[parentId] вместо O(n) через find. treeToArray: рекурсивный flatMap с деструктуризацией — отделяем children от остальных полей, добавляем parentId. flatMap автоматически "разворачивает" вложенные массивы на один уровень. Этот паттерн используется в меню, деревьях категорий, файловых системах.'
    },
    {
      id: 8,
      title: 'Pivot таблица',
      type: 'practice',
      difficulty: 'hard',
      description: 'Функция pivot(data, rowKey, colKey, valueKey, aggFn): строит pivot таблицу из массива данных. aggFn — функция агрегации (sum, count, avg).',
      requirements: [
        'pivot(sales, "region", "product", "amount", "sum")',
        'Результат: { Алматы: { Ноутбук: 300000, Мышка: 6000 }, Астана: {...} }',
        'Поддержать aggFn: "sum", "count", "avg", "max", "min"'
      ],
      hint: 'Создайте объект результата. Для каждой записи получите rowKey и colKey, добавьте value в соответствующую ячейку. В конце примените aggFn к каждой ячейке (для avg нужно хранить сумму и количество).',
      expectedOutput: 'pivot(sales, "region", "product", "amount", sum) -> { "Север": { "Телефон": 5000, "Ноутбук": 12000 }, "Юг": {...} }\npivot(data, "month", "category", "value", avg) -> средние значения по ячейкам',
      solution: 'function pivot(data, rowKey, colKey, valueKey, aggFn = "sum") {\n  const aggFunctions = {\n    sum: (vals) => vals.reduce((a, b) => a + b, 0),\n    count: (vals) => vals.length,\n    avg: (vals) => vals.reduce((a, b) => a + b, 0) / vals.length,\n    max: (vals) => Math.max(...vals),\n    min: (vals) => Math.min(...vals)\n  };\n\n  const agg = aggFunctions[aggFn];\n  if (!agg) throw new Error(`Неизвестная функция: ${aggFn}`);\n\n  // Собираем все значения\n  const temp = {};\n  data.forEach(item => {\n    const row = item[rowKey];\n    const col = item[colKey];\n    const val = item[valueKey];\n    if (!temp[row]) temp[row] = {};\n    if (!temp[row][col]) temp[row][col] = [];\n    temp[row][col].push(val);\n  });\n\n  // Применяем агрегацию\n  const result = {};\n  Object.keys(temp).forEach(row => {\n    result[row] = {};\n    Object.keys(temp[row]).forEach(col => {\n      result[row][col] = agg(temp[row][col]);\n    });\n  });\n\n  return result;\n}\n\nconst sales = [\n  { region: "Алматы", product: "Ноутбук", amount: 150000 },\n  { region: "Алматы", product: "Ноутбук", amount: 150000 },\n  { region: "Алматы", product: "Мышка", amount: 3000 },\n  { region: "Астана", product: "Ноутбук", amount: 150000 }\n];\n\nconsole.log(pivot(sales, "region", "product", "amount", "sum"));\nconsole.log(pivot(sales, "region", "product", "amount", "count"));',
      explanation: 'Pivot таблица — классическая операция анализа данных: превращает строки в столбцы с агрегацией. Алгоритм двухшаговый: сначала собираем все значения в temp[row][col] = [], потом применяем функцию агрегации к каждой группе. Словарь aggFunctions — паттерн стратегия: выбор поведения по строковому ключу. Это позволяет легко добавлять новые функции агрегации без изменения основной логики.'
    },
    {
      id: 9,
      title: 'Иммутабельный стейт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию updateNested(obj, path, value): обновляет значение по вложенному пути иммутабельно. path — строка вида "a.b.c" или массив.',
      requirements: [
        'updateNested({a:{b:{c:1}}}, "a.b.c", 2) -> {a:{b:{c:2}}}',
        'Не мутировать исходный объект',
        'Создавать промежуточные объекты если не существуют',
        'updateNested(state, ["user", "address", "city"], "Алматы")'
      ],
      hint: 'Разбейте path на части через split(".")(или используйте готовый массив). Рекурсивно создавайте новые объекты на каждом уровне через spread: {...obj, [key]: updateNested(obj[key], restPath, value)}.',
      expectedOutput: 'updateNested({a:{b:{c:1}}}, "a.b.c", 42) -> {a:{b:{c:42}}}\noriginal объект не изменился\nupdateNested(obj, ["x","y"], "value") -> {x:{y:"value"}}\nглубокий путь работает корректно',
      solution: 'function updateNested(obj, path, value) {\n  const keys = Array.isArray(path) ? path : path.split(".");\n\n  if (keys.length === 0) return value;\n\n  const [first, ...rest] = keys;\n  return {\n    ...obj,\n    [first]: rest.length === 0\n      ? value\n      : updateNested(obj[first] || {}, rest, value)\n  };\n}\n\nconst state = { user: { name: "Алия", address: { city: "Алматы", zip: "050000" } } };\n\nconst updated = updateNested(state, "user.address.city", "Астана");\nconsole.log(updated.user.address.city); // "Астана"\nconsole.log(state.user.address.city);   // "Алматы" — не изменился!\n\nconst withNewField = updateNested(state, "user.age", 25);\nconsole.log(withNewField.user.age);     // 25',
      explanation: 'Иммутабельное обновление — основа Redux и современного state management. Рекурсия с деструктуризацией [first, ...rest]: на каждом уровне создаём новый объект через spread, перезаписывая только нужный ключ. obj[first] || {} создаёт промежуточные объекты если пути не существует. Благодаря spread все остальные ключи на каждом уровне сохраняются. Исходный объект никогда не мутируется — только создаются новые объекты на изменённом пути.'
    },
    {
      id: 10,
      title: 'Виртуальный DOM diff',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте простую функцию diff(oldObj, newObj): находит различия между двумя объектами. Возвращает что добавлено, изменено, удалено.',
      requirements: [
        'diff({a:1, b:2}, {a:1, b:3, c:4}) -> { changed: {b:{from:2,to:3}}, added:{c:4}, removed:{} }',
        'diff({a:{b:1}}, {a:{b:2}}) -> вложенные изменения',
        'Возвращать структуру: { added, removed, changed }'
      ],
      hint: 'Сравните ключи обоих объектов. Ключи только в newObj — добавленные, только в oldObj — удалённые, в обоих с разными значениями — изменённые. Для вложенных объектов рекурсивно вызывайте diff.',
      expectedOutput: 'diff({a:1,b:2}, {b:3,c:4}) -> { added:{c:4}, changed:{b:{from:2,to:3}}, removed:{a:1} }\ndiff({x:1}, {x:1}) -> { added:{}, changed:{}, removed:{} }\ndiff({}, {a:1,b:2}) -> { added:{a:1,b:2}, changed:{}, removed:{} }',
      solution: 'function diff(oldObj, newObj) {\n  const added = {};\n  const removed = {};\n  const changed = {};\n\n  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);\n\n  for (const key of allKeys) {\n    const inOld = Object.prototype.hasOwnProperty.call(oldObj, key);\n    const inNew = Object.prototype.hasOwnProperty.call(newObj, key);\n\n    if (!inOld) {\n      added[key] = newObj[key];\n    } else if (!inNew) {\n      removed[key] = oldObj[key];\n    } else if (typeof oldObj[key] === "object" && typeof newObj[key] === "object" &&\n               oldObj[key] !== null && newObj[key] !== null) {\n      const nested = diff(oldObj[key], newObj[key]);\n      if (Object.keys(nested.added).length || Object.keys(nested.removed).length || Object.keys(nested.changed).length) {\n        changed[key] = nested;\n      }\n    } else if (oldObj[key] !== newObj[key]) {\n      changed[key] = { from: oldObj[key], to: newObj[key] };\n    }\n  }\n\n  return { added, removed, changed };\n}\n\nconst old = { a: 1, b: 2, c: { d: 3, e: 4 } };\nconst next = { a: 1, b: 3, c: { d: 5 }, f: 6 };\nconsole.log(JSON.stringify(diff(old, next), null, 2));',
      explanation: 'Объединение ключей через Set гарантирует обработку всех полей обоих объектов без дублей. hasOwnProperty через Object.prototype.call — безопасный способ проверки собственных свойств (защита от объектов без прототипа). Для вложенных объектов рекурсивно вызываем diff — это даёт глубокое сравнение. Результат включает changed только если вложенные diff содержат изменения. Такой формат { from, to } удобен для отображения пользователю и аудита изменений.'
    }
  ]
};
