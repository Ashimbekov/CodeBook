export default {
  id: 19,
  title: 'JavaScript: async (Promise, async/await)',
  description: 'Асинхронный JavaScript — Promise, async/await, обработка ошибок с try/catch',
  lessons: [
    {
      id: 1,
      title: 'Синхронный vs асинхронный код',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript однопоточный — он выполняет один кусок кода за раз. Асинхронность позволяет не блокировать выполнение, пока ждём долгие операции (сеть, диск, таймеры).' },
        { type: 'code', language: 'javascript', value: '// Синхронный код — выполняется строго по порядку\nconsole.log("1");\nconsole.log("2");\nconsole.log("3");\n// Вывод: 1, 2, 3\n\n// Асинхронный код — не блокирует выполнение\nconsole.log("1");\nsetTimeout(() => {\n  console.log("2");\n}, 1000);\nconsole.log("3");\n// Вывод: 1, 3, 2 (через 1 секунду)\n\n// Проблема с коллбеками — "callback hell"\ngetUser(userId, (user) => {\n  getOrders(user.id, (orders) => {\n    getProduct(orders[0].productId, (product) => {\n      console.log(product);\n      // Пирамида из callbacks...\n    });\n  });\n});' },
        { type: 'tip', value: 'Promise и async/await — способы сделать асинхронный код читаемым, как синхронный. Они решают проблему "callback hell".' }
      ]
    },
    {
      id: 2,
      title: 'Promise: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Promise — объект-обещание, которое либо выполнится (resolve), либо отклонится (reject). Имеет три состояния: pending, fulfilled, rejected.' },
        { type: 'code', language: 'javascript', value: '// Создание Promise\nconst promise = new Promise((resolve, reject) => {\n  const success = true;\n  \n  if (success) {\n    resolve("Данные получены!"); // успех\n  } else {\n    reject(new Error("Что-то пошло не так")); // ошибка\n  }\n});\n\n// Использование Promise\npromise\n  .then(data => {\n    console.log("Успех:", data); // "Данные получены!"\n  })\n  .catch(error => {\n    console.error("Ошибка:", error.message);\n  })\n  .finally(() => {\n    console.log("Выполнится всегда");\n  });\n\n// Пример: setTimeout как Promise\nfunction delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\ndelay(1000).then(() => console.log("Прошла секунда"));' }
      ]
    },
    {
      id: 3,
      title: 'Цепочки Promise (Promise chaining)',
      type: 'theory',
      content: [
        { type: 'text', value: 'then() тоже возвращает Promise, поэтому можно строить цепочки вместо вложенных коллбеков.' },
        { type: 'code', language: 'javascript', value: '// Цепочка промисов\nfetch("/api/user/1")\n  .then(response => response.json())       // Promise<data>\n  .then(user => fetch(`/api/orders/${user.id}`))\n  .then(response => response.json())\n  .then(orders => {\n    console.log("Заказы:", orders);\n  })\n  .catch(error => {\n    console.error("Ошибка:", error);\n    // Ловит ошибки из ЛЮБОГО then выше\n  });\n\n// Promise.all — ждём ВСЕ промисы\nconst [users, products] = await Promise.all([\n  fetch("/api/users").then(r => r.json()),\n  fetch("/api/products").then(r => r.json())\n]);\n\n// Promise.race — первый победивший\nconst first = await Promise.race([\n  fetch("/api/fast"),\n  fetch("/api/slow")\n]);\n\n// Promise.allSettled — ждём все, даже с ошибками\nconst results = await Promise.allSettled([\n  Promise.resolve("OK"),\n  Promise.reject("Ошибка"),\n  Promise.resolve("Тоже OK")\n]);\n// [{ status: "fulfilled", value: "OK" },\n//  { status: "rejected", reason: "Ошибка" }, ...]' }
      ]
    },
    {
      id: 4,
      title: 'async/await — синтаксический сахар',
      type: 'theory',
      content: [
        { type: 'text', value: 'async/await — это более читаемый синтаксис для работы с Promise. async функция всегда возвращает Promise. await "ждёт" результат Promise.' },
        { type: 'code', language: 'javascript', value: '// Функция с async/await\nasync function getUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  const user = await response.json();\n  return user;\n}\n\n// Использование\ngetUser(1).then(user => console.log(user));\n\n// Или внутри другой async-функции\nasync function showUserOrders(userId) {\n  const user = await getUser(userId);\n  const response = await fetch(`/api/orders/${user.id}`);\n  const orders = await response.json();\n  return { user, orders };\n}\n\n// Несколько параллельных запросов\nasync function loadDashboard() {\n  // Параллельно (не последовательно!)\n  const [users, stats] = await Promise.all([\n    fetch("/api/users").then(r => r.json()),\n    fetch("/api/stats").then(r => r.json())\n  ]);\n  return { users, stats };\n}' },
        { type: 'tip', value: 'await только замедляет выполнение внутри async-функции. Код за её пределами продолжает работать. Это не блокировка — это магия event loop.' }
      ]
    },
    {
      id: 5,
      title: 'try/catch/finally для обработки ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'async/await работает вместе с try/catch для обработки ошибок в асинхронном коде.' },
        { type: 'code', language: 'javascript', value: 'async function loadData(url) {\n  try {\n    const response = await fetch(url);\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error: ${response.status}`);\n    }\n    \n    const data = await response.json();\n    return data;\n    \n  } catch (error) {\n    if (error instanceof TypeError) {\n      console.error("Сетевая ошибка:", error.message);\n    } else {\n      console.error("Ошибка:", error.message);\n    }\n    return null;\n    \n  } finally {\n    hideLoadingSpinner(); // выполнится всегда\n  }\n}\n\n// Обработка на уровне вызова\nasync function main() {\n  try {\n    const user = await loadData("/api/user");\n    const posts = await loadData(`/api/posts/${user.id}`);\n    renderPage(user, posts);\n  } catch (error) {\n    showErrorMessage(error.message);\n  } finally {\n    hideLoader();\n  }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практические паттерны async кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Несколько важных паттернов для работы с асинхронным кодом в реальных проектах.' },
        { type: 'code', language: 'javascript', value: '// 1. Паттерн: функция загрузки с состоянием\nasync function fetchWithState(url) {\n  const state = { loading: true, data: null, error: null };\n  try {\n    state.data = await fetch(url).then(r => r.json());\n  } catch (e) {\n    state.error = e.message;\n  } finally {\n    state.loading = false;\n  }\n  return state;\n}\n\n// 2. Паттерн: повторная попытка\nasync function fetchWithRetry(url, retries = 3) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      return await fetch(url).then(r => r.json());\n    } catch (e) {\n      if (i === retries - 1) throw e;\n      await new Promise(r => setTimeout(r, 1000 * (i + 1)));\n    }\n  }\n}\n\n// 3. Паттерн: таймаут\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error("Timeout")), ms)\n  );\n  return Promise.race([promise, timeout]);\n}\n\nconst data = await withTimeout(fetch("/api/slow"), 5000);\n\n// 4. AbortController: отмена запроса\nconst controller = new AbortController();\nfetch("/api/data", { signal: controller.signal })\n  .then(r => r.json())\n  .catch(e => console.log("Отменён:", e.name));\n\ncontroller.abort(); // отменить запрос' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Загрузчик данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай функцию для загрузки данных с индикатором загрузки и обработкой ошибок.',
      requirements: [
        'async функция loadUsers() загружает данные с https://jsonplaceholder.typicode.com/users',
        'Показывает индикатор загрузки (spinner) во время запроса',
        'При успехе — отображает список пользователей в DOM',
        'При ошибке — показывает сообщение об ошибке',
        'finally — скрывает индикатор в любом случае',
        'Кнопка "Загрузить" запускает функцию'
      ],
      expectedOutput: 'Список пользователей с лоадером',
      hint: 'jsonplaceholder.typicode.com — бесплатный тестовый API. fetch вернёт массив объектов {id, name, email}. Покажи spinner до await, скрой в finally.',
      solution: 'const listEl = document.getElementById("list");\nconst spinner = document.getElementById("spinner");\nconst errorEl = document.getElementById("error");\nconst loadBtn = document.getElementById("loadBtn");\n\nasync function loadUsers() {\n  listEl.innerHTML = "";\n  errorEl.textContent = "";\n  spinner.style.display = "block";\n  loadBtn.disabled = true;\n  \n  try {\n    const response = await fetch(\n      "https://jsonplaceholder.typicode.com/users"\n    );\n    \n    if (!response.ok) {\n      throw new Error(`Ошибка сервера: ${response.status}`);\n    }\n    \n    const users = await response.json();\n    \n    users.forEach(user => {\n      const li = document.createElement("li");\n      li.innerHTML = `<strong>${user.name}</strong> — ${user.email}`;\n      listEl.appendChild(li);\n    });\n    \n  } catch (error) {\n    errorEl.textContent = `Ошибка: ${error.message}`;\n  } finally {\n    spinner.style.display = "none";\n    loadBtn.disabled = false;\n  }\n}\n\nloadBtn.addEventListener("click", loadUsers);',
      explanation: 'try/catch/finally — стандарт обработки ошибок в async коде. finally гарантирует скрытие спиннера. Проверка response.ok важна — fetch выбрасывает ошибку только при сетевых проблемах, но 404/500 тоже response.ok === false.'
    },
    {
      id: 8,
      title: 'Практика: Параллельные запросы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Загрузи данные из нескольких API параллельно с помощью Promise.all.',
      requirements: [
        'Загрузи посты (https://jsonplaceholder.typicode.com/posts?_limit=5)',
        'Одновременно загрузи пользователей (https://jsonplaceholder.typicode.com/users?_limit=5)',
        'Используй Promise.all для параллельной загрузки',
        'Совмести данные: добавь имя автора к каждому посту',
        'Отобрази карточки постов с именем автора',
        'Время загрузки должно быть равно самому долгому запросу, не сумме'
      ],
      expectedOutput: 'Карточки постов с именами авторов, загруженные параллельно',
      hint: 'Promise.all([fetch1, fetch2]).then(([posts, users]) => ...). Для поиска автора: users.find(u => u.id === post.userId)',
      solution: 'async function loadPostsWithAuthors() {\n  const container = document.getElementById("posts");\n  container.innerHTML = "Загрузка...";\n  \n  try {\n    const [postsRes, usersRes] = await Promise.all([\n      fetch("https://jsonplaceholder.typicode.com/posts?_limit=5"),\n      fetch("https://jsonplaceholder.typicode.com/users")\n    ]);\n    \n    const [posts, users] = await Promise.all([\n      postsRes.json(),\n      usersRes.json()\n    ]);\n    \n    container.innerHTML = "";\n    \n    posts.forEach(post => {\n      const author = users.find(u => u.id === post.userId);\n      const card = document.createElement("div");\n      card.className = "card";\n      card.innerHTML = `\n        <h3>${post.title}</h3>\n        <p>${post.body.slice(0, 100)}...</p>\n        <small>Автор: ${author ? author.name : "Неизвестен"}</small>\n      `;\n      container.appendChild(card);\n    });\n  } catch (e) {\n    container.textContent = "Ошибка: " + e.message;\n  }\n}\n\nloadPostsWithAuthors();',
      explanation: 'Promise.all запускает все промисы одновременно. Если бы мы использовали await поочерёдно, ждали бы sum(times). Promise.all ждёт только max(times). При большом числе запросов разница огромна.'
    }
  ]
}
