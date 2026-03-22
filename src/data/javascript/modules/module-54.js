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
      solution: {
        code: '// Через Set\nconst uniqueSet = (arr) => [...new Set(arr)];\n\n// Через filter\nconst uniqueFilter = (arr) => arr.filter((item, idx) => arr.indexOf(item) === idx);\n\n// Через reduce\nconst uniqueReduce = (arr) => arr.reduce(\n  (acc, item) => acc.includes(item) ? acc : [...acc, item],\n  []\n);\n\nconsole.log(uniqueSet([1, 2, 2, 3, 1]));         // [1, 2, 3]\nconsole.log(uniqueFilter(["a", "b", "a"]));       // ["a", "b"]\nconsole.log(uniqueReduce([1, 1, 2, 3, 2, 3]));   // [1, 2, 3]',
        language: 'javascript'
      }
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
      solution: {
        code: 'function flatten(arr, depth = 1) {\n  if (depth === 0) return [...arr];\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      acc.push(...flatten(item, depth === Infinity ? Infinity : depth - 1));\n    } else {\n      acc.push(item);\n    }\n    return acc;\n  }, []);\n}\n\nconsole.log(flatten([1, [2, 3], [4, [5]]]));         // [1, 2, 3, 4, [5]]\nconsole.log(flatten([1, [2, [3, [4]]]], Infinity));   // [1, 2, 3, 4]\nconsole.log(flatten([[1, 2], [3, [4, 5]]], 1));       // [1, 2, 3, [4, 5]]',
        language: 'javascript'
      }
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
      solution: {
        code: 'function groupBy(arr, keyOrFn) {\n  const getKey = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];\n  return arr.reduce((groups, item) => {\n    const key = getKey(item);\n    (groups[key] = groups[key] || []).push(item);\n    return groups;\n  }, {});\n}\n\nconst users = [\n  { name: "Алия", role: "admin" },\n  { name: "Берик", role: "user" },\n  { name: "Карина", role: "admin" }\n];\n\nconsole.log(groupBy(users, "role"));\n// { admin: [{name:"Алия"...},{name:"Карина"...}], user: [{name:"Берик"...}] }\n\nconsole.log(groupBy([1,2,3,4,5,6], n => n % 2 === 0 ? "even" : "odd"));\n// { odd: [1,3,5], even: [2,4,6] }\n\nconsole.log(groupBy([1,11,21,2,12], n => Math.floor(n / 10)));\n// { "0": [1,2], "1": [11,12], "2": [21] }',
        language: 'javascript'
      }
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
      solution: {
        code: 'function deepMerge(obj1, obj2) {\n  if (typeof obj1 !== "object" || obj1 === null) return obj2;\n  if (typeof obj2 !== "object" || obj2 === null) return obj2;\n\n  const result = { ...obj1 };\n\n  for (const key of Object.keys(obj2)) {\n    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {\n      result[key] = [...obj1[key], ...obj2[key]];\n    } else if (\n      typeof obj2[key] === "object" && obj2[key] !== null &&\n      typeof obj1[key] === "object" && obj1[key] !== null\n    ) {\n      result[key] = deepMerge(obj1[key], obj2[key]);\n    } else {\n      result[key] = obj2[key];\n    }\n  }\n\n  return result;\n}\n\nconsole.log(deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 }));\n// { a: 1, b: { c: 2, d: 3 }, e: 4 }\n\nconsole.log(deepMerge({ tags: [1, 2] }, { tags: [3, 4] }));\n// { tags: [1, 2, 3, 4] }',
        language: 'javascript'
      }
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
      solution: {
        code: 'function search(arr, query) {\n  if (!query) return arr;\n  const q = query.toLowerCase();\n  return arr.filter(item =>\n    Object.values(item).some(val =>\n      typeof val === "string" && val.toLowerCase().includes(q)\n    )\n  );\n}\n\nconst users = [\n  { id: 1, name: "Алия Иванова", email: "aliya@test.com", city: "Алматы" },\n  { id: 2, name: "Берик Смаилов", email: "berik@test.com", city: "Астана" },\n  { id: 3, name: "Карина Ли", email: "karina@test.com", city: "Алматы" }\n];\n\nconsole.log(search(users, "алматы"));    // Алия и Карина\nconsole.log(search(users, "berik"));     // Берик\nconsole.log(search(users, "test.com")); // все трое',
        language: 'javascript'
      }
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
      solution: {
        code: 'function paginate(arr, page = 1, limit = 10) {\n  const total = arr.length;\n  const totalPages = Math.ceil(total / limit);\n  const start = (page - 1) * limit;\n  const data = arr.slice(start, start + limit);\n\n  return {\n    data,\n    page,\n    limit,\n    total,\n    totalPages,\n    hasNext: page < totalPages,\n    hasPrev: page > 1\n  };\n}\n\nconst items = Array.from({ length: 20 }, (_, i) => i + 1);\nconsole.log(paginate(items, 1, 5));\n// { data: [1,2,3,4,5], page: 1, limit: 5, total: 20, totalPages: 4, hasNext: true, hasPrev: false }\n\nconsole.log(paginate(items, 4, 5));\n// { data: [16,17,18,19,20], page: 4, ..., hasNext: false, hasPrev: true }',
        language: 'javascript'
      }
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
      solution: {
        code: 'function arrayToTree(items) {\n  const map = {};\n  const roots = [];\n\n  items.forEach(item => {\n    map[item.id] = { ...item, children: [] };\n  });\n\n  items.forEach(item => {\n    if (item.parentId === null || item.parentId === undefined) {\n      roots.push(map[item.id]);\n    } else if (map[item.parentId]) {\n      map[item.parentId].children.push(map[item.id]);\n    }\n  });\n\n  return roots;\n}\n\nfunction treeToArray(tree, parentId = null) {\n  return tree.flatMap(node => {\n    const { children, ...item } = node;\n    return [{ ...item, parentId }, ...treeToArray(children || [], node.id)];\n  });\n}\n\nconst flat = [\n  { id: 1, parentId: null, name: "Корень" },\n  { id: 2, parentId: 1, name: "Ветка 1" },\n  { id: 3, parentId: 1, name: "Ветка 2" },\n  { id: 4, parentId: 2, name: "Лист 1" }\n];\n\nconst tree = arrayToTree(flat);\nconsole.log(JSON.stringify(tree, null, 2));\n\nconst backToFlat = treeToArray(tree);\nconsole.log(backToFlat);',
        language: 'javascript'
      }
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
      solution: {
        code: 'function pivot(data, rowKey, colKey, valueKey, aggFn = "sum") {\n  const aggFunctions = {\n    sum: (vals) => vals.reduce((a, b) => a + b, 0),\n    count: (vals) => vals.length,\n    avg: (vals) => vals.reduce((a, b) => a + b, 0) / vals.length,\n    max: (vals) => Math.max(...vals),\n    min: (vals) => Math.min(...vals)\n  };\n\n  const agg = aggFunctions[aggFn];\n  if (!agg) throw new Error(`Неизвестная функция: ${aggFn}`);\n\n  // Собираем все значения\n  const temp = {};\n  data.forEach(item => {\n    const row = item[rowKey];\n    const col = item[colKey];\n    const val = item[valueKey];\n    if (!temp[row]) temp[row] = {};\n    if (!temp[row][col]) temp[row][col] = [];\n    temp[row][col].push(val);\n  });\n\n  // Применяем агрегацию\n  const result = {};\n  Object.keys(temp).forEach(row => {\n    result[row] = {};\n    Object.keys(temp[row]).forEach(col => {\n      result[row][col] = agg(temp[row][col]);\n    });\n  });\n\n  return result;\n}\n\nconst sales = [\n  { region: "Алматы", product: "Ноутбук", amount: 150000 },\n  { region: "Алматы", product: "Ноутбук", amount: 150000 },\n  { region: "Алматы", product: "Мышка", amount: 3000 },\n  { region: "Астана", product: "Ноутбук", amount: 150000 }\n];\n\nconsole.log(pivot(sales, "region", "product", "amount", "sum"));\nconsole.log(pivot(sales, "region", "product", "amount", "count"));',
        language: 'javascript'
      }
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
      solution: {
        code: 'function updateNested(obj, path, value) {\n  const keys = Array.isArray(path) ? path : path.split(".");\n\n  if (keys.length === 0) return value;\n\n  const [first, ...rest] = keys;\n  return {\n    ...obj,\n    [first]: rest.length === 0\n      ? value\n      : updateNested(obj[first] || {}, rest, value)\n  };\n}\n\nconst state = { user: { name: "Алия", address: { city: "Алматы", zip: "050000" } } };\n\nconst updated = updateNested(state, "user.address.city", "Астана");\nconsole.log(updated.user.address.city); // "Астана"\nconsole.log(state.user.address.city);   // "Алматы" — не изменился!\n\nconst withNewField = updateNested(state, "user.age", 25);\nconsole.log(withNewField.user.age);     // 25',
        language: 'javascript'
      }
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
      solution: {
        code: 'function diff(oldObj, newObj) {\n  const added = {};\n  const removed = {};\n  const changed = {};\n\n  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);\n\n  for (const key of allKeys) {\n    const inOld = Object.prototype.hasOwnProperty.call(oldObj, key);\n    const inNew = Object.prototype.hasOwnProperty.call(newObj, key);\n\n    if (!inOld) {\n      added[key] = newObj[key];\n    } else if (!inNew) {\n      removed[key] = oldObj[key];\n    } else if (typeof oldObj[key] === "object" && typeof newObj[key] === "object" &&\n               oldObj[key] !== null && newObj[key] !== null) {\n      const nested = diff(oldObj[key], newObj[key]);\n      if (Object.keys(nested.added).length || Object.keys(nested.removed).length || Object.keys(nested.changed).length) {\n        changed[key] = nested;\n      }\n    } else if (oldObj[key] !== newObj[key]) {\n      changed[key] = { from: oldObj[key], to: newObj[key] };\n    }\n  }\n\n  return { added, removed, changed };\n}\n\nconst old = { a: 1, b: 2, c: { d: 3, e: 4 } };\nconst next = { a: 1, b: 3, c: { d: 5 }, f: 6 };\nconsole.log(JSON.stringify(diff(old, next), null, 2));',
        language: 'javascript'
      }
    }
  ]
};
