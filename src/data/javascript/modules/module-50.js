export default {
  id: 50,
  title: 'Функциональное программирование',
  description: 'ФП в JavaScript: чистые функции, иммутабельность, compose/pipe, каррирование, функторы и практические техники',
  lessons: [
    {
      id: 1,
      title: 'Чистые функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чистая функция: 1) всегда возвращает одинаковый результат для одинаковых аргументов, 2) не имеет побочных эффектов. Ссылочная прозрачность — можно заменить вызов результатом.' },
        { type: 'heading', value: 'Pure vs Impure' },
        { type: 'code', language: 'javascript', value: '// Нечистые функции (side effects / внешние зависимости)\nlet total = 0;\nconst addToTotal = (n) => { total += n; }; // Изменяет внешнее состояние\n\nconst getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]; // Случайность\n\nconst logAndReturn = (x) => { console.log(x); return x; }; // I/O\n\nconst getUser = (id) => fetch(`/api/users/${id}`); // Сеть\n\n// Чистые функции\nconst add = (a, b) => a + b; // Всегда одинаковый результат\n\nconst multiply = (a, b) => a * b;\n\nconst formatName = (first, last) => `${first} ${last}`.trim();\n\nconst calculateTotal = (items) =>\n  items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n\n// Чистая vs нечистая версия одной задачи\n// Нечистая — мутирует массив\nconst addItemImpure = (cart, item) => {\n  cart.push(item); // Изменяем переданный массив!\n  return cart;\n};\n\n// Чистая — возвращает новый массив\nconst addItemPure = (cart, item) => [...cart, item];\n\nconst cart = [{ name: "Книга", price: 1000 }];\nconst newCart = addItemPure(cart, { name: "Ручка", price: 100 });\nconsole.log(cart);    // Не изменился!\nconsole.log(newCart); // Новый массив с двумя элементами' },
        { type: 'tip', value: 'Не все функции должны быть чистыми — программа должна иметь side effects (I/O, работа с БД). Цель — изолировать side effects, максимально используя чистые функции для логики.' }
      ]
    },
    {
      id: 2,
      title: 'Иммутабельность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иммутабельность — данные не изменяются, создаются новые. Предотвращает баги связанные с мутацией. В JS используем spread, Object.assign, Array методы без мутации.' },
        { type: 'heading', value: 'Работа с иммутабельными данными' },
        { type: 'code', language: 'javascript', value: '// МУТИРУЮЩИЕ операции (избегайте в ФП)\nconst arr = [1, 2, 3];\narr.push(4);    // Мутирует arr\narr.splice(1, 1); // Мутирует arr\narr.sort();     // Мутирует arr!\n\nconst obj = { a: 1 };\nobj.b = 2;        // Мутирует obj\ndelete obj.a;     // Мутирует obj\n\n// ИММУТАБЕЛЬНЫЕ операции\n// Массивы\nconst arr2 = [1, 2, 3];\nconst withFour = [...arr2, 4];          // Добавить в конец\nconst withZero = [0, ...arr2];          // Добавить в начало\nconst without2 = arr2.filter(n => n !== 2); // Удалить элемент\nconst updated = arr2.map(n => n === 2 ? 20 : n); // Изменить элемент\nconst sorted = [...arr2].sort();        // Сортировка без мутации\n\n// Объекты\nconst user = { id: 1, name: "Алия", age: 25 };\nconst withEmail = { ...user, email: "aliya@example.com" }; // Добавить поле\nconst renamed = { ...user, name: "Берик" };                 // Изменить поле\nconst { age, ...withoutAge } = user;                        // Удалить поле\n\n// Вложенные объекты — глубокое обновление\nconst state = {\n  user: { id: 1, name: "Алия", address: { city: "Алматы" } }\n};\n\n// Иммутабельное обновление вложенного поля\nconst newState = {\n  ...state,\n  user: {\n    ...state.user,\n    address: {\n      ...state.user.address,\n      city: "Астана"\n    }\n  }\n};\n\n// Object.freeze — запретить мутацию\nconst config = Object.freeze({\n  apiUrl: "https://api.example.com",\n  timeout: 5000\n});\nconfig.apiUrl = "другой"; // Тихо проигнорируется (TypeError в strict mode)' }
      ]
    },
    {
      id: 3,
      title: 'compose и pipe',
      type: 'theory',
      content: [
        { type: 'text', value: 'compose и pipe объединяют функции в цепочку. compose применяет справа налево, pipe — слева направо. Результат каждой функции передаётся в следующую.' },
        { type: 'heading', value: 'Функциональная композиция' },
        { type: 'code', language: 'javascript', value: '// compose(f, g, h)(x) = f(g(h(x))) — справа налево\nconst compose = (...fns) => (x) =>\n  fns.reduceRight((acc, fn) => fn(acc), x);\n\n// pipe(f, g, h)(x) = h(g(f(x))) — слева направо (интуитивнее)\nconst pipe = (...fns) => (x) =>\n  fns.reduce((acc, fn) => fn(acc), x);\n\n// Функции-трансформеры\nconst trim = (str) => str.trim();\nconst toLowerCase = (str) => str.toLowerCase();\nconst removeSpaces = (str) => str.replace(/\\s+/g, "-");\nconst truncate = (max) => (str) => str.slice(0, max);\nconst addPrefix = (prefix) => (str) => `${prefix}${str}`;\n\n// Создаём новую функцию из комбинации\nconst toSlug = pipe(\n  trim,\n  toLowerCase,\n  removeSpaces,\n  truncate(50)\n);\n\nconsole.log(toSlug("  Hello World Example  ")); // "hello-world-example"\n\n// Числовые трансформации\nconst processNumber = pipe(\n  (n) => n * 2,\n  (n) => n + 10,\n  (n) => Math.max(n, 0),\n  (n) => n.toFixed(2)\n);\n\nconsole.log(processNumber(5)); // "20.00"\n\n// Трансформация данных\nconst processUsers = pipe(\n  (users) => users.filter(u => u.isActive),\n  (users) => users.map(u => ({ ...u, fullName: `${u.first} ${u.last}` })),\n  (users) => users.sort((a, b) => a.fullName.localeCompare(b.fullName)),\n  (users) => users.slice(0, 10)\n);\n\nconst topTen = processUsers(allUsers);' }
      ]
    },
    {
      id: 4,
      title: 'Каррирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каррирование преобразует функцию от N аргументов в цепочку функций от одного аргумента. Позволяет создавать специализированные функции из общих.' },
        { type: 'heading', value: 'Curry — частичное применение' },
        { type: 'code', language: 'javascript', value: '// Ручное каррирование\nconst add = (a) => (b) => a + b;\nconst add5 = add(5); // Специализированная функция\nconsole.log(add5(3)); // 8\nconsole.log(add5(10)); // 15\n\n// Универсальная curry функция\nconst curry = (fn) => {\n  const arity = fn.length;\n  return function curried(...args) {\n    if (args.length >= arity) {\n      return fn(...args);\n    }\n    return (...moreArgs) => curried(...args, ...moreArgs);\n  };\n};\n\n// Применение\nconst multiply = curry((a, b, c) => a * b * c);\nconst double = multiply(2);\nconst triple = multiply(3);\nconst sixTimes = multiply(2)(3);\nconsole.log(double(5));    // 10\nconsole.log(triple(5));    // 15\nconsole.log(sixTimes(5));  // 30\n\n// Практические примеры\nconst filter = curry((fn, arr) => arr.filter(fn));\nconst map = curry((fn, arr) => arr.map(fn));\nconst reduce = curry((fn, init, arr) => arr.reduce(fn, init));\n\nconst getActives = filter(u => u.isActive);\nconst getNames = map(u => u.name);\nconst sumPrices = reduce((sum, item) => sum + item.price, 0);\n\nconst activeNames = pipe(getActives, getNames)(users);\n\n// Каррированные утилиты\nconst prop = curry((key, obj) => obj[key]);\nconst getName = prop("name");\nconsole.log(getName({ name: "Алия", age: 25 })); // "Алия"\n\nconst has = curry((key, obj) => key in obj);\nconst hasEmail = has("email");\nconst usersWithEmail = users.filter(hasEmail);' }
      ]
    },
    {
      id: 5,
      title: 'Функторы и Maybe',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функтор — контейнер с методом map, который применяет функцию к содержимому. Maybe функтор обрабатывает null/undefined безопасно, без if проверок.' },
        { type: 'heading', value: 'Maybe монада' },
        { type: 'code', language: 'javascript', value: '// Простой функтор Box\nclass Box {\n  constructor(value) { this._value = value; }\n  static of(value) { return new Box(value); }\n  map(fn) { return new Box(fn(this._value)); }\n  fold(fn) { return fn(this._value); } // Извлечь значение\n  toString() { return `Box(${this._value})`; }\n}\n\nBox.of(5)\n  .map(x => x * 2)     // Box(10)\n  .map(x => x + 1)     // Box(11)\n  .fold(x => x);       // 11\n\n// Maybe — безопасная обработка null\nclass Maybe {\n  constructor(value) { this._value = value; }\n  static of(value) { return new Maybe(value); }\n  static empty() { return new Maybe(null); }\n\n  isNothing() { return this._value == null; }\n\n  map(fn) {\n    if (this.isNothing()) return this; // Пропускаем если null\n    return Maybe.of(fn(this._value));\n  }\n\n  getOrElse(defaultValue) {\n    return this.isNothing() ? defaultValue : this._value;\n  }\n}\n\n// Без Maybe — цепочка проверок\nconst getCity = (user) => {\n  if (!user) return "Неизвестно";\n  if (!user.address) return "Неизвестно";\n  if (!user.address.city) return "Неизвестно";\n  return user.address.city;\n};\n\n// С Maybe — чисто\nconst getCityMaybe = (user) =>\n  Maybe.of(user)\n    .map(u => u.address)\n    .map(a => a.city)\n    .getOrElse("Неизвестно");\n\nconsole.log(getCityMaybe(null));                          // "Неизвестно"\nconsole.log(getCityMaybe({ address: null }));             // "Неизвестно"\nconsole.log(getCityMaybe({ address: { city: "Алматы" } })); // "Алматы"' }
      ]
    },
    {
      id: 6,
      title: 'Point-free стиль и утилиты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Point-free (tacit programming) — стиль без явного упоминания аргументов. Функции описывают что делать, а не как. Используется с compose/pipe и каррированными функциями.' },
        { type: 'heading', value: 'Point-free программирование' },
        { type: 'code', language: 'javascript', value: '// С аргументами (обычный стиль)\nconst getActiveUserNames = (users) =>\n  users.filter(u => u.isActive).map(u => u.name);\n\n// Point-free (без явных аргументов)\nconst isActive = (u) => u.isActive;\nconst getName = (u) => u.name;\n\nconst getActiveUserNamesPF = pipe(\n  (users) => users.filter(isActive),\n  (users) => users.map(getName)\n);\n\n// Полностью point-free с каррированием\nconst filter = curry((pred, arr) => arr.filter(pred));\nconst map = curry((fn, arr) => arr.map(fn));\n\nconst getActiveUserNamesFull = pipe(\n  filter(isActive),\n  map(getName)\n);\n\n// Утилиты ФП стиля\nconst identity = (x) => x;         // Тождественная функция\nconst always = (x) => () => x;     // Всегда возвращает x\nconst not = (fn) => (...args) => !fn(...args); // Отрицание\nconst tap = (fn) => (x) => { fn(x); return x; }; // Для side effects в pipe\n\nconst isInactive = not(isActive);\nconst logAndPass = tap((x) => console.log("Промежуточное:", x));\n\nconst process = pipe(\n  filter(isActive),\n  logAndPass,      // Логирует, не прерывает цепочку\n  map(getName),\n  (names) => names.sort()\n);\n\n// Каррированные версии Array методов\nconst includes = curry((item, arr) => arr.includes(item));\nconst gt = curry((a, b) => b > a);        // b > a (для частичного применения)\nconst lt = curry((a, b) => b < a);\nconst eq = curry((a, b) => a === b);\nconst prop = curry((key, obj) => obj[key]);\n\nconst getAge = prop("age");\nconst isAdult = pipe(getAge, gt(17)); // age > 17\nconst adults = users.filter(isAdult);' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Трансформация данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Применим ФП техники к реальной задаче: трансформация и анализ данных через цепочку чистых функций без мутации.' },
        { type: 'heading', value: 'Обработка данных в ФП стиле' },
        { type: 'code', language: 'javascript', value: 'const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);\nconst curry = (fn) => {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn(...args)\n      : (...more) => curried(...args, ...more);\n  };\n};\n\n// Данные о продажах\nconst salesData = [\n  { id: 1, product: "Ноутбук", category: "Электроника", price: 150000, qty: 3, region: "Алматы" },\n  { id: 2, product: "Мышка", category: "Электроника", price: 3000, qty: 15, region: "Астана" },\n  { id: 3, product: "Стол", category: "Мебель", price: 50000, qty: 5, region: "Алматы" },\n  { id: 4, product: "Кресло", category: "Мебель", price: 80000, qty: 2, region: "Алматы" }\n];\n\n// Чистые функции-трансформеры\nconst addTotal = (sale) => ({ ...sale, total: sale.price * sale.qty });\nconst byCategory = curry((category, sale) => sale.category === category);\nconst byRegion = curry((region, sale) => sale.region === region);\nconst sumBy = curry((key, acc, item) => acc + item[key]);\nconst sortByDesc = curry((key, arr) => [...arr].sort((a, b) => b[key] - a[key]));\nconst take = curry((n, arr) => arr.slice(0, n));\n\n// Анализ: топ-2 продажи по электронике\nconst topElectronics = pipe(\n  (data) => data.map(addTotal),\n  (data) => data.filter(byCategory("Электроника")),\n  sortByDesc("total"),\n  take(2)\n)(salesData);\n\nconsole.log(topElectronics);\n\n// Итого по региону\nconst almatyRevenue = pipe(\n  (data) => data.map(addTotal),\n  (data) => data.filter(byRegion("Алматы")),\n  (data) => data.reduce(sumBy("total"), 0)\n)(salesData);\n\nconsole.log("Выручка Алматы:", almatyRevenue);\n\n// Сводка по категориям\nconst categoryStats = (data) =>\n  data.map(addTotal).reduce((acc, sale) => ({\n    ...acc,\n    [sale.category]: {\n      total: (acc[sale.category]?.total || 0) + sale.total,\n      count: (acc[sale.category]?.count || 0) + 1\n    }\n  }), {});\n\nconsole.log(categoryStats(salesData));' }
      ]
    }
  ]
};
