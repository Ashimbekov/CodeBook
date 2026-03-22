export default {
  id: 16,
  title: 'JavaScript: массивы и объекты',
  description: 'Работа с массивами и объектами: map, filter, reduce, деструктуризация, spread-оператор',
  lessons: [
    {
      id: 1,
      title: 'Массивы: создание и основные методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Массив — упорядоченная коллекция данных. Индексы начинаются с 0. Массивы в JS — это объекты с числовыми ключами и методами.' },
        { type: 'code', language: 'javascript', value: 'const fruits = ["яблоко", "груша", "банан"];\n\n// Доступ по индексу\nconsole.log(fruits[0]); // "яблоко"\nconsole.log(fruits[fruits.length - 1]); // "банан"\n\n// Методы добавления/удаления\nfruits.push("апельсин");    // добавить в конец\nfruits.pop();               // удалить из конца\nfruits.unshift("вишня");    // добавить в начало\nfruits.shift();             // удалить из начала\n\n// Поиск\nconsole.log(fruits.indexOf("груша")); // 1 или -1\nconsole.log(fruits.includes("груша")); // true/false\n\n// Срез\nconst slice = fruits.slice(1, 3); // [\"груша\", \"банан\"] (не меняет оригинал)\n\n// Соединение массивов\nconst a = [1, 2];\nconst b = [3, 4];\nconst combined = [...a, ...b]; // [1, 2, 3, 4]\n// или: a.concat(b)\n\n// Сортировка\n[3, 1, 4, 1, 5].sort((a, b) => a - b); // [1, 1, 3, 4, 5]' }
      ]
    },
    {
      id: 2,
      title: 'map, filter, reduce',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три самых важных метода массива для функционального программирования. Все они не изменяют исходный массив.' },
        { type: 'code', language: 'javascript', value: 'const numbers = [1, 2, 3, 4, 5, 6];\n\n// map — преобразовать каждый элемент\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10, 12]\n\nconst users = [\n  { name: "Алина", age: 25 },\n  { name: "Берик", age: 30 }\n];\nconst names = users.map(u => u.name);\nconsole.log(names); // ["Алина", "Берик"]\n\n// filter — оставить элементы по условию\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens); // [2, 4, 6]\n\nconst adults = users.filter(u => u.age >= 18);\n\n// reduce — свернуть массив в одно значение\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\nconsole.log(sum); // 21\n\n// Сложный reduce: подсчёт частоты\nconst words = ["apple", "banana", "apple", "cherry", "banana", "apple"];\nconst count = words.reduce((acc, word) => {\n  acc[word] = (acc[word] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(count); // { apple: 3, banana: 2, cherry: 1 }\n\n// Цепочка методов\nconst result = numbers\n  .filter(n => n % 2 === 0)  // [2, 4, 6]\n  .map(n => n * n)            // [4, 16, 36]\n  .reduce((sum, n) => sum + n, 0); // 56' }
      ]
    },
    {
      id: 3,
      title: 'Другие полезные методы массива',
      type: 'theory',
      content: [
        { type: 'text', value: 'JS предоставляет богатый набор методов для работы с массивами.' },
        { type: 'code', language: 'javascript', value: 'const arr = [1, 2, 3, 4, 5];\n\n// find/findIndex — первый подходящий\nconst found = arr.find(n => n > 3);      // 4\nconst idx = arr.findIndex(n => n > 3);   // 3\n\n// some/every — хоть один / все\nconst hasEven = arr.some(n => n % 2 === 0);   // true\nconst allPos = arr.every(n => n > 0);          // true\n\n// flat/flatMap — выровнять вложенные массивы\nconst nested = [[1, 2], [3, 4], [5]];\nconsole.log(nested.flat()); // [1, 2, 3, 4, 5]\n\n// flatMap = map + flat(1)\nconst sentences = ["Привет мир", "Hello World"];\nconst words = sentences.flatMap(s => s.split(" "));\nconsole.log(words); // ["Привет", "мир", "Hello", "World"]\n\n// splice — изменяет оригинал!\nconst arr2 = [1, 2, 3, 4, 5];\narr2.splice(1, 2, 10, 20); // начало, количество, замена\nconsole.log(arr2); // [1, 10, 20, 4, 5]\n\n// Array.from — создать массив\nconst str = "Привет";\nconsole.log(Array.from(str)); // ["П","р","и","в","е","т"]\n\n// Array.from({length: 5}, (_, i) => i+1) → [1,2,3,4,5]' }
      ]
    },
    {
      id: 4,
      title: 'Объекты: создание и свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'Объект — коллекция пар ключ-значение. Ключи — строки (или Symbol), значения — любые типы.' },
        { type: 'code', language: 'javascript', value: '// Создание объекта\nconst user = {\n  name: "Нурдаулет",\n  age: 20,\n  isActive: true,\n  greet() {           // метод объекта\n    return `Привет, я ${this.name}`;\n  }\n};\n\n// Доступ к свойствам\nconsole.log(user.name);         // "Нурдаулет" (dot notation)\nconsole.log(user["name"]);      // "Нурдаулет" (bracket notation)\n\n// Динамический ключ\nconst key = "age";\nconsole.log(user[key]);         // 20\n\n// Добавление и изменение\nuser.email = "test@example.com";\nuser.age = 21;\n\n// Удаление\ndelete user.isActive;\n\n// Проверка\nconsole.log("name" in user);    // true\nconsole.log(user.hasOwnProperty("age")); // true\n\n// Ключи и значения\nconsole.log(Object.keys(user));   // ["name", "age", ...]\nconsole.log(Object.values(user)); // ["Нурдаулет", 21, ...]\nconsole.log(Object.entries(user)); // [["name","Нурдаулет"],...]\n\n// Копирование\nconst copy = { ...user };\nconst copy2 = Object.assign({}, user);' }
      ]
    },
    {
      id: 5,
      title: 'Деструктуризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризация позволяет извлечь значения из массивов и объектов в переменные.' },
        { type: 'code', language: 'javascript', value: '// Деструктуризация объекта\nconst user = { name: "Алина", age: 25, city: "Алматы" };\n\nconst { name, age } = user;\nconsole.log(name, age); // "Алина" 25\n\n// Переименование\nconst { name: userName, age: userAge } = user;\n\n// Значение по умолчанию\nconst { name: n, role = "user" } = user;\nconsole.log(role); // "user" (не было в объекте)\n\n// Вложенная деструктуризация\nconst config = {\n  server: { host: "localhost", port: 3000 },\n  db: { name: "mydb" }\n};\nconst { server: { host, port } } = config;\n\n// Деструктуризация массива\nconst [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first); // 1\nconsole.log(rest);  // [3, 4, 5]\n\n// Пропуск элементов\nconst [, , third] = [1, 2, 3];\nconsole.log(third); // 3\n\n// В параметрах функции\nfunction display({ name, age = 0 }) {\n  return `${name}, ${age}`;\n}' }
      ]
    },
    {
      id: 6,
      title: 'Spread и Rest операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spread (...) "разворачивает" массив/объект. Rest (...) "собирает" оставшиеся элементы.' },
        { type: 'code', language: 'javascript', value: '// Spread для массивов\nconst a = [1, 2, 3];\nconst b = [4, 5, 6];\nconst combined = [...a, ...b]; // [1,2,3,4,5,6]\n\n// Копия массива\nconst copy = [...a]; // новый массив, не ссылка\n\n// Spread для объектов\nconst defaults = { theme: "light", lang: "ru" };\nconst userSettings = { lang: "en", fontSize: 14 };\n\n// Мёрдж объектов (правый перезаписывает левый)\nconst settings = { ...defaults, ...userSettings };\nconsole.log(settings);\n// { theme: "light", lang: "en", fontSize: 14 }\n\n// Добавить поле без мутации\nconst user = { name: "Берик", age: 30 };\nconst updatedUser = { ...user, age: 31, role: "admin" };\n\n// Rest в деструктуризации\nconst { name, ...rest } = { name: "Алина", age: 25, city: "Алматы" };\nconsole.log(name); // "Алина"\nconsole.log(rest); // { age: 25, city: "Алматы" }\n\n// Rest в параметрах функции\nfunction sum(first, second, ...others) {\n  return first + second + others.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3, 4, 5)); // 15' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обработка данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функции для обработки массива объектов-студентов.',
      requirements: [
        'Массив students: [{name, grade, subject}]',
        'getTopStudents(students, minGrade) — студенты с оценкой >= minGrade',
        'getAverageGrade(students) — средняя оценка',
        'groupBySubject(students) — сгруппировать по предмету ({subject: [students]})',
        'getLeaderboard(students) — отсортировать по убыванию оценки',
        'Используй map, filter, reduce'
      ],
      expectedOutput: 'getTopStudents(students, 90) → [...студенты с оценкой 90+]\ngetAverageGrade(students) → 82.5\ngroupBySubject(students) → { Math: [...], JS: [...] }',
      hint: 'groupBySubject использует reduce для создания объекта. reduce((acc, student) => { acc[student.subject] = ...; return acc; }, {})',
      solution: 'const students = [\n  { name: "Алина", grade: 95, subject: "JavaScript" },\n  { name: "Берик", grade: 78, subject: "HTML/CSS" },\n  { name: "Айгерим", grade: 88, subject: "JavaScript" },\n  { name: "Данияр", grade: 72, subject: "HTML/CSS" },\n  { name: "Зарина", grade: 91, subject: "JavaScript" }\n];\n\nconst getTopStudents = (arr, minGrade) =>\n  arr.filter(s => s.grade >= minGrade);\n\nconst getAverageGrade = (arr) => {\n  const total = arr.reduce((sum, s) => sum + s.grade, 0);\n  return (total / arr.length).toFixed(1);\n};\n\nconst groupBySubject = (arr) =>\n  arr.reduce((groups, student) => {\n    const key = student.subject;\n    if (!groups[key]) groups[key] = [];\n    groups[key].push(student);\n    return groups;\n  }, {});\n\nconst getLeaderboard = (arr) =>\n  [...arr].sort((a, b) => b.grade - a.grade);\n\nconsole.log(getTopStudents(students, 90));\nconsole.log(getAverageGrade(students));\nconsole.log(groupBySubject(students));\nconsole.log(getLeaderboard(students));',
      explanation: 'filter/map/reduce — фундамент функционального программирования в JS. [...arr] создаёт копию перед sort, чтобы не мутировать оригинал. reduce для groupBy — классический паттерн.'
    },
    {
      id: 8,
      title: 'Практика: Иммутабельное обновление состояния',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функции для обновления массива и объекта без мутации (как в React/Redux).',
      requirements: [
        'addTodo(todos, text) — добавить новую задачу',
        'removeTodo(todos, id) — удалить по id',
        'toggleTodo(todos, id) — переключить done',
        'updateUser(user, changes) — обновить поля пользователя',
        'Не мутировать оригинал ни в одной функции'
      ],
      expectedOutput: 'Каждая функция возвращает новый массив/объект, оригинал неизменён',
      hint: 'Для массивов: spread [...arr], filter для удаления, map для изменения. Для объектов: {...obj, ...changes}.',
      solution: 'let nextId = 1;\n\nconst addTodo = (todos, text) => [\n  ...todos,\n  { id: nextId++, text, done: false }\n];\n\nconst removeTodo = (todos, id) =>\n  todos.filter(todo => todo.id !== id);\n\nconst toggleTodo = (todos, id) =>\n  todos.map(todo =>\n    todo.id === id ? { ...todo, done: !todo.done } : todo\n  );\n\nconst updateUser = (user, changes) => ({ ...user, ...changes });\n\n// Тест\nlet todos = [];\ntodos = addTodo(todos, "Выучить JS");\ntodos = addTodo(todos, "Создать сайт");\nconsole.log(todos);\ntodos = toggleTodo(todos, 1);\nconsole.log(todos);\ntodos = removeTodo(todos, 1);\nconsole.log(todos);\n\nconst user = { name: "Алина", age: 25 };\nconst updated = updateUser(user, { age: 26, city: "Алматы" });\nconsole.log(user);    // оригинал не изменился\nconsole.log(updated); // { name: "Алина", age: 26, city: "Алматы" }',
      explanation: 'Иммутабельность — основа предсказуемого кода. Spread-оператор создаёт поверхностные копии. map + spread для обновления элемента в массиве — стандартный паттерн в React.'
    }
  ]
}
