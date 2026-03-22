export default {
  id: 12,
  title: 'Деструктуризация',
  description: 'Деструктуризация массивов и объектов, вложенная деструктуризация, значения по умолчанию — элегантный способ извлекать данные в ES6.',
  lessons: [
    {
      id: 1,
      title: 'Деструктуризация массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризация массивов позволяет извлечь значения в переменные по позиции. Вместо arr[0], arr[1] пишем просто const [a, b] = arr. Это компактнее и читабельнее.' },
        { type: 'code', language: 'javascript', value: 'const colors = ["red", "green", "blue"];\n\n// Старый способ\nconst r = colors[0];\nconst g = colors[1];\nconst b = colors[2];\n\n// Деструктуризация\nconst [red, green, blue] = colors;\nconsole.log(red, green, blue); // red green blue\n\n// Пропуск элементов (запятая без имени)\nconst [first, , third] = colors;\nconsole.log(first, third); // red blue\n\n// Остаток массива через rest\nconst [head, ...tail] = colors;\nconsole.log(head); // red\nconsole.log(tail); // ["green", "blue"]\n\n// Swap переменных без temp\nlet x = 1, y = 2;\n[x, y] = [y, x];\nconsole.log(x, y); // 2 1' },
        { type: 'heading', value: 'Деструктуризация из функции' },
        { type: 'code', language: 'javascript', value: 'function getCoordinates() {\n  return [55.75, 37.62]; // Москва\n}\n\nconst [lat, lng] = getCoordinates();\nconsole.log(`Широта: ${lat}, Долгота: ${lng}`);\n\n// Удобно с методами типа entries()\nconst obj = { a: 1, b: 2, c: 3 };\nfor (const [key, value] of Object.entries(obj)) {\n  console.log(`${key}: ${value}`);\n}' },
        { type: 'tip', value: 'Деструктуризация массивов работает для любых итерируемых объектов: массивов, строк, Set, Map, результатов генераторов. const [a, b] = "hi" даст a="h", b="i".' }
      ]
    },
    {
      id: 2,
      title: 'Деструктуризация объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризация объектов извлекает свойства по имени. В отличие от массивов — порядок не важен, важно имя ключа.' },
        { type: 'code', language: 'javascript', value: 'const user = {\n  name: "Алия",\n  age: 28,\n  city: "Алматы",\n  role: "admin"\n};\n\n// Деструктуризация объекта\nconst { name, age, city } = user;\nconsole.log(name, age, city); // Алия 28 Алматы\n\n// Переименование при деструктуризации (key: newName)\nconst { name: userName, role: userRole } = user;\nconsole.log(userName); // Алия\nconsole.log(userRole); // admin\n\n// Переменные name и role НЕ созданы:\n// console.log(name); // будет брать переменную name из выше\n\n// Деструктуризация с остатком\nconst { name: n, ...rest } = user;\nconsole.log(n);    // Алия\nconsole.log(rest); // { age: 28, city: "Алматы", role: "admin" }' },
        { type: 'heading', value: 'Деструктуризация в параметрах функции' },
        { type: 'code', language: 'javascript', value: '// Без деструктуризации — неудобно\nfunction greetOld(user) {\n  console.log(`Привет, ${user.name}! Ты из ${user.city}.`);\n}\n\n// С деструктуризацией — элегантно\nfunction greet({ name, city }) {\n  console.log(`Привет, ${name}! Ты из ${city}.`);\n}\n\ngreet({ name: "Нурдаулет", city: "Астана", age: 30 });\n// Привет, Нурдаулет! Ты из Астана.\n\n// Переименование в параметрах\nfunction display({ name: fullName, age: years }) {\n  console.log(`${fullName}, ${years} лет`);\n}\ndisplay({ name: "Сергей", age: 35 }); // Сергей, 35 лет' },
        { type: 'note', value: 'При деструктуризации объекта можно извлекать только нужные свойства — остальные игнорируются. Это удобно при работе с большими API-ответами.' }
      ]
    },
    {
      id: 3,
      title: 'Значения по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'При деструктуризации можно задавать значения по умолчанию. Они используются, если значение undefined (не передано или не существует). Значение null НЕ заменяется умолчанием!' },
        { type: 'code', language: 'javascript', value: '// Массив: значения по умолчанию\nconst [a = 10, b = 20, c = 30] = [1, 2];\nconsole.log(a, b, c); // 1 2 30 (c взял умолчание)\n\n// Объект: значения по умолчанию\nconst { name = "Аноним", age = 0, city = "Неизвестно" } = { name: "Алия" };\nconsole.log(name, age, city); // Алия 0 Неизвестно\n\n// Переименование + умолчание\nconst { role: userRole = "user" } = { name: "Боб" };\nconsole.log(userRole); // user\n\n// ВАЖНО: null НЕ равен undefined!\nconst { x = 100 } = { x: null };\nconsole.log(x); // null (умолчание не сработало!)\n\nconst { y = 100 } = { y: undefined };\nconsole.log(y); // 100 (умолчание сработало)' },
        { type: 'heading', value: 'Умолчания в параметрах функций' },
        { type: 'code', language: 'javascript', value: '// Функция с деструктуризацией и умолчаниями\nfunction createUser({\n  name = "Аноним",\n  age = 0,\n  role = "user",\n  active = true\n} = {}) {  // = {} защищает от вызова без аргументов\n  return { name, age, role, active };\n}\n\nconsole.log(createUser({ name: "Алия", age: 28 }));\n// { name: "Алия", age: 28, role: "user", active: true }\n\nconsole.log(createUser());\n// { name: "Аноним", age: 0, role: "user", active: true }\n// Без = {} в параметре -- createUser() бросило бы ошибку!' },
        { type: 'tip', value: 'Паттерн = {} в параметре функции — защита от вызова без аргументов. Без него createUser() вызовет TypeError: Cannot destructure property "name" of undefined.' }
      ]
    },
    {
      id: 4,
      title: 'Вложенная деструктуризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризацию можно вкладывать — извлекать данные из вложенных объектов и массивов прямо при деструктуризации.' },
        { type: 'code', language: 'javascript', value: 'const user = {\n  name: "Нурдаулет",\n  address: {\n    city: "Алматы",\n    street: "Абая",\n    zip: "050000"\n  },\n  hobbies: ["программирование", "чтение", "спорт"]\n};\n\n// Вложенная деструктуризация объектов\nconst {\n  name,\n  address: { city, street },  // вложенный объект\n  hobbies: [firstHobby, secondHobby]  // вложенный массив\n} = user;\n\nconsole.log(name);        // Нурдаулет\nconsole.log(city);        // Алматы\nconsole.log(street);      // Абая\nconsole.log(firstHobby);  // программирование\n\n// ВАЖНО: переменная address НЕ создаётся!\n// Если нужна — извлеки отдельно:\nconst { address, address: { zip } } = user;\nconsole.log(address); // { city: "Алматы", ... }\nconsole.log(zip);     // 050000' },
        { type: 'heading', value: 'Глубокая вложенность' },
        { type: 'code', language: 'javascript', value: 'const data = {\n  status: "ok",\n  result: {\n    users: [\n      { id: 1, profile: { name: "Алия", score: 95 } },\n      { id: 2, profile: { name: "Боб",  score: 80 } }\n    ]\n  }\n};\n\n// Извлечь имя первого пользователя\nconst {\n  result: {\n    users: [{ profile: { name: firstName, score } }]\n  }\n} = data;\n\nconsole.log(firstName, score); // Алия 95\n\n// Лучше: умеренная деструктуризация + точечная нотация\nconst { result: { users } } = data;\nconsole.log(users[0].profile.name); // Алия' },
        { type: 'note', value: 'Не углубляйся слишком в вложенную деструктуризацию — код становится нечитаемым. Правило: не более 2-3 уровней. Глубже — лучше промежуточные переменные.' }
      ]
    },
    {
      id: 5,
      title: 'Деструктуризация в циклах и импортах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризация широко применяется в циклах for...of и при импорте модулей — это делает код значительно чище.' },
        { type: 'code', language: 'javascript', value: 'const users = [\n  { id: 1, name: "Алия",  age: 25 },\n  { id: 2, name: "Берик", age: 30 },\n  { id: 3, name: "Сауле", age: 22 }\n];\n\n// for...of с деструктуризацией\nfor (const { id, name, age } of users) {\n  console.log(`${id}: ${name} (${age} лет)`);\n}\n\n// map с деструктуризацией\nconst names = users.map(({ name }) => name);\nconsole.log(names); // ["Алия", "Берик", "Сауле"]\n\n// filter с деструктуризацией\nconst adults = users.filter(({ age }) => age >= 25);\n\n// entries() — индекс + значение\nconst fruits = ["яблоко", "груша", "банан"];\nfor (const [index, fruit] of fruits.entries()) {\n  console.log(`${index + 1}. ${fruit}`);\n}' },
        { type: 'heading', value: 'Деструктуризация при импорте' },
        { type: 'code', language: 'javascript', value: '// Named imports — это деструктуризация модуля!\nimport { useState, useEffect, useCallback } from "react";\nimport { createStore, applyMiddleware } from "redux";\n\n// Аналогично:\nconst { useState, useEffect } = require("react");\n\n// Переименование при импорте\nimport { reallyLongFunctionName as shortName } from "./utils";\n\n// Namespace import (все экспорты как объект)\nimport * as MathUtils from "./math";\nconsole.log(MathUtils.add(1, 2));' },
        { type: 'tip', value: 'Деструктуризация в параметрах callback-функций (map, filter, reduce, forEach) — один из самых распространённых паттернов в React и современном JS. Изучи его хорошо.' }
      ]
    },
    {
      id: 6,
      title: 'Продвинутые паттерны деструктуризации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деструктуризацию можно комбинировать с вычисляемыми ключами, использовать для клонирования и обмена значений между переменными.' },
        { type: 'code', language: 'javascript', value: '// Вычисляемые ключи при деструктуризации\nconst key = "name";\nconst { [key]: personName } = { name: "Алия" };\nconsole.log(personName); // Алия\n\n// Деструктуризация в присваивании (без const/let)\nlet a, b;\n({ a, b } = { a: 1, b: 2 }); // скобки обязательны!\nconsole.log(a, b); // 1 2\n\n// Игнорирование значений в объекте\nconst { x, y, ...coords2D } = { x: 1, y: 2, z: 3, w: 4 };\nconsole.log(x, y);      // 1 2\nconsole.log(coords2D); // { z: 3, w: 4 }\n\n// Деструктуризация Map\nconst map = new Map([["a", 1], ["b", 2]]);\nfor (const [key, val] of map) {\n  console.log(key, val);\n}' },
        { type: 'code', language: 'javascript', value: '// Практический паттерн: обновление части объекта\nconst state = { user: "Алия", count: 5, active: true };\n\n// Обновить только count\nconst newState = { ...state, count: state.count + 1 };\nconsole.log(newState);\n// { user: "Алия", count: 6, active: true }\n\n// Удалить поле через деструктуризацию + rest\nconst { active, ...stateWithoutActive } = state;\nconsole.log(stateWithoutActive);\n// { user: "Алия", count: 5 }' },
        { type: 'note', value: 'Паттерн "удалить поле через деструктуризацию + rest" — чистый способ убрать свойство из объекта без мутации. Широко применяется в Redux reducers и React компонентах.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: деструктуризация API-ответов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Извлеки нужные данные из типичного API-ответа используя деструктуризацию.',
      requirements: [
        'Извлеки из apiResponse: статус, первого пользователя и его город',
        'Напиши функцию formatUser({ name, age, address: { city } }), возвращающую строку',
        'Используй деструктуризацию с умолчаниями: если city отсутствует, используй "Не указан"',
        'Используй map с деструктуризацией, чтобы получить массив строк "Имя (город)"'
      ],
      hint: 'Для вложенной деструктуризации с умолчанием: { address: { city = "Не указан" } = {} }. Скобки = {} защищают если address отсутствует.',
      solution: 'const apiResponse = {\n  status: 200,\n  data: {\n    users: [\n      { id: 1, name: "Алия", age: 25, address: { city: "Алматы" } },\n      { id: 2, name: "Берик", age: 30, address: { city: "Астана" } },\n      { id: 3, name: "Сауле", age: 22 }\n    ]\n  }\n};\n\n// 1. Извлечение данных\nconst {\n  status,\n  data: { users }\n} = apiResponse;\n\nconst [firstUser] = users;\nconst { name: firstName, address: { city: firstCity } = {} } = firstUser;\nconsole.log(status, firstName, firstCity); // 200 Алия Алматы\n\n// 2. Функция форматирования\nfunction formatUser({ name, age, address: { city = "Не указан" } = {} }) {\n  return `${name}, ${age} лет, ${city}`;\n}\n\n// 3. map с деструктуризацией\nconst formatted = users.map(({ name, address: { city = "Не указан" } = {} }) =>\n  `${name} (${city})`\n);\n\nconsole.log(formatted);\n// ["Алия (Алматы)", "Берик (Астана)", "Сауле (Не указан)"]',
      explanation: 'Вложенная деструктуризация позволяет работать с глубокими структурами данных. Паттерн = {} для вложенного объекта защищает от ошибки, если объект отсутствует (address: { city = "Не указан" } = {}). Деструктуризация в параметрах map делает код декларативным.'
    }
  ]
}
