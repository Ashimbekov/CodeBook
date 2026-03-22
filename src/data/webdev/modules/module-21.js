export default {
  id: 21,
  title: 'JavaScript: модули',
  description: 'Модульная система JavaScript — import, export, dynamic import и организация кода',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны модули?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модули разделяют код на независимые файлы. Каждый модуль имеет собственную область видимости — переменные не "утекают" в глобальную.' },
        { type: 'code', language: 'html', value: '<!-- Подключение JS-модуля в HTML -->\n<script type="module" src="app.js"></script>\n\n<!-- Несколько модулей -->\n<!-- НЕ нужно! app.js сам импортирует нужное -->\n<!-- <script src="utils.js"></script> -->\n<!-- <script src="api.js"></script> -->' },
        { type: 'heading', value: 'Преимущества модулей' },
        { type: 'list', items: [
          'Изоляция: нет глобального загрязнения переменными',
          'Переиспользование: функции легко шарить между файлами',
          'Явные зависимости: видно, откуда что пришло',
          'Ленивая загрузка: dynamic import грузит код по требованию',
          'Tree shaking: бандлер удаляет неиспользуемый код'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Named exports и imports',
      type: 'theory',
      content: [
        { type: 'text', value: 'Named export позволяет экспортировать несколько значений из одного файла.' },
        { type: 'code', language: 'javascript', value: '// utils.js — экспорт\nexport const PI = 3.14159;\n\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function multiply(a, b) {\n  return a * b;\n}\n\nexport class Calculator {\n  add(a, b) { return a + b; }\n}\n\n// Или в конце файла\nconst VERSION = "1.0.0";\nconst helper = () => {};\nexport { VERSION, helper };\n\n// Переименование при экспорте\nexport { VERSION as version, helper as helpFn };\n\n// ---\n\n// app.js — импорт\nimport { add, multiply, PI } from "./utils.js";\n\nconsole.log(add(2, 3));      // 5\nconsole.log(PI);              // 3.14159\n\n// Переименование при импорте\nimport { add as sum, multiply as mul } from "./utils.js";\n\n// Импорт всего в объект\nimport * as utils from "./utils.js";\nconsole.log(utils.add(2, 3));\nconsole.log(utils.PI);' }
      ]
    },
    {
      id: 3,
      title: 'Default export',
      type: 'theory',
      content: [
        { type: 'text', value: 'Default export — один основной экспорт из файла. Импортируется без фигурных скобок и с любым именем.' },
        { type: 'code', language: 'javascript', value: '// userService.js — один default\nexport default class UserService {\n  async getAll() {\n    return fetch("/api/users").then(r => r.json());\n  }\n  \n  async getById(id) {\n    return fetch(`/api/users/${id}`).then(r => r.json());\n  }\n}\n\n// Или функция\nexport default function formatDate(date) {\n  return new Intl.DateTimeFormat("ru").format(date);\n}\n\n// Или значение\nexport default { baseUrl: "https://api.example.com" };\n\n// ---\n\n// app.js — импорт default (имя произвольное)\nimport UserService from "./userService.js";\nimport formatDate from "./formatDate.js";\nimport config from "./config.js";\n\n// Смешанный импорт: default + named\nimport React, { useState, useEffect } from "react";\n// React — default, useState/useEffect — named' },
        { type: 'tip', value: 'Одна функция/класс на файл → используй default. Несколько утилит в одном файле → named exports. Это общепринятое соглашение.' }
      ]
    },
    {
      id: 4,
      title: 'Dynamic Import',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dynamic import() загружает модуль при необходимости, а не при старте приложения. Возвращает Promise.' },
        { type: 'code', language: 'javascript', value: '// Статический import — загружается сразу\nimport { heavyChart } from "./charts.js"; // всегда загружается\n\n// Динамический import — загружается когда нужно\nasync function showChart() {\n  // Загрузится только при вызове функции\n  const { renderChart } = await import("./charts.js");\n  renderChart(data);\n}\n\n// Условный импорт\nif (userWantsChart) {\n  const chartModule = await import("./charts.js");\n  chartModule.render();\n}\n\n// Ленивая загрузка по маршруту\nrouter.on("/admin", async () => {\n  const { AdminPanel } = await import("./admin/panel.js");\n  new AdminPanel().render();\n});\n\n// Default export при динамическом импорте\nconst module = await import("./myModule.js");\nconst defaultExport = module.default;\n\n// Или деструктуризация\nconst { default: MyClass, helper } = await import("./module.js");' }
      ]
    },
    {
      id: 5,
      title: 'Организация структуры модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура модулей делает проект понятным и поддерживаемым.' },
        { type: 'code', language: 'javascript', value: '// Типичная структура проекта\n// src/\n//   api/\n//     users.js      — API-функции для юзеров\n//     posts.js      — API-функции для постов\n//     index.js      — реэкспорт\n//   utils/\n//     format.js     — форматирование\n//     validation.js — валидация\n//     index.js      — реэкспорт\n//   components/\n//     Button/\n//       Button.js\n//       Button.css\n//   app.js          — точка входа\n\n// api/index.js — "barrel" файл (реэкспорт)\nexport { getUsers, createUser } from "./users.js";\nexport { getPosts } from "./posts.js";\n\n// Теперь можно импортировать из одного места\nimport { getUsers, getPosts } from "./api/index.js";\n// или просто\nimport { getUsers, getPosts } from "./api";' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модульное приложение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разбей приложение из нескольких функций на отдельные модули с правильным импортом/экспортом.',
      requirements: [
        'utils.js: экспортирует formatDate(date), capitalize(str), truncate(str, len)',
        'api.js: экспортирует async getUsers(), async getUser(id)',
        'render.js: экспортирует default renderUserCard(user)',
        'app.js: импортирует всё нужное и запускает приложение',
        'index.html: подключает app.js с type="module"'
      ],
      expectedOutput: 'Приложение разбито на модули с правильными импортами',
      hint: 'Каждый файл — отдельная зона ответственности. utils — чистые функции. api — запросы. render — UI. app — оркестратор.',
      solution: '// utils.js\nexport function formatDate(date) {\n  return new Intl.DateTimeFormat("ru", {\n    day: "numeric", month: "long", year: "numeric"\n  }).format(new Date(date));\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();\n}\n\nexport function truncate(str, len = 50) {\n  return str.length > len ? str.slice(0, len) + "..." : str;\n}\n\n// api.js\nconst BASE_URL = "https://jsonplaceholder.typicode.com";\n\nexport async function getUsers() {\n  const res = await fetch(`${BASE_URL}/users`);\n  if (!res.ok) throw new Error("Failed to fetch users");\n  return res.json();\n}\n\nexport async function getUser(id) {\n  const res = await fetch(`${BASE_URL}/users/${id}`);\n  if (!res.ok) throw new Error("User not found");\n  return res.json();\n}\n\n// render.js\nimport { capitalize } from "./utils.js";\n\nexport default function renderUserCard(user) {\n  const card = document.createElement("div");\n  card.className = "user-card";\n  card.innerHTML = `\n    <h3>${capitalize(user.name)}</h3>\n    <p>${user.email}</p>\n    <small>${user.company.name}</small>\n  `;\n  return card;\n}\n\n// app.js\nimport { getUsers } from "./api.js";\nimport renderUserCard from "./render.js";\n\nasync function main() {\n  const container = document.getElementById("app");\n  try {\n    const users = await getUsers();\n    users.forEach(user => {\n      container.appendChild(renderUserCard(user));\n    });\n  } catch (e) {\n    container.textContent = "Ошибка: " + e.message;\n  }\n}\n\nmain();',
      explanation: 'Каждый модуль имеет единственную ответственность (Single Responsibility Principle). utils — чистые функции без побочных эффектов. api — слой доступа к данным. render — только UI-логика. app — оркестратор. Такая структура легко тестируется и расширяется.'
    }
  ]
}
