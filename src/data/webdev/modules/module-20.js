export default {
  id: 20,
  title: 'JavaScript: Fetch API',
  description: 'Работа с сетью через Fetch API — GET, POST запросы, заголовки и обработка JSON',
  lessons: [
    {
      id: 1,
      title: 'Fetch API: основы GET-запроса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fetch API — современный способ делать HTTP-запросы. Возвращает Promise с объектом Response.' },
        { type: 'code', language: 'javascript', value: '// Простой GET-запрос\nfetch("https://api.example.com/users")\n  .then(response => {\n    console.log(response.status);  // 200\n    console.log(response.ok);      // true (200-299)\n    return response.json();        // распарсить JSON\n  })\n  .then(data => {\n    console.log(data);\n  })\n  .catch(error => {\n    console.error("Ошибка сети:", error);\n  });\n\n// С async/await (предпочтительно)\nasync function getUsers() {\n  const response = await fetch("https://api.example.com/users");\n  \n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n  \n  const users = await response.json();\n  return users;\n}\n\n// response.json() — для JSON\n// response.text() — для текста\n// response.blob() — для файлов\n// response.formData() — для FormData' },
        { type: 'list', items: [
          'fetch возвращает Promise<Response> — нужно вызвать response.json() для получения данных',
          'response.ok равен true при статусах 200-299, false для 400+',
          'fetch не выбрасывает ошибку при HTTP 404/500 — нужно проверять response.ok вручную',
          'response.json() тоже возвращает Promise — его тоже нужно await',
          'Метод по умолчанию — GET, остальные задаются через options.method'
        ]},
        { type: 'tip', value: 'fetch выбрасывает ошибку только при сетевых проблемах (нет интернета, CORS-блокировка). Ответы 404 или 500 считаются "успешными" с точки зрения сети. Всегда проверяй if (!response.ok) throw new Error(...).' }
      ]
    },
    {
      id: 2,
      title: 'POST-запрос с JSON-телом',
      type: 'theory',
      content: [
        { type: 'text', value: 'POST-запрос используется для отправки данных на сервер. Тело запроса и Content-Type нужно задавать явно.' },
        { type: 'code', language: 'javascript', value: 'async function createUser(userData) {\n  const response = await fetch("https://api.example.com/users", {\n    method: "POST",\n    headers: {\n      "Content-Type": "application/json"\n    },\n    body: JSON.stringify(userData)\n  });\n  \n  if (!response.ok) {\n    const error = await response.json();\n    throw new Error(error.message || "Ошибка создания");\n  }\n  \n  return response.json();\n}\n\n// Вызов\nconst newUser = await createUser({\n  name: "Алина",\n  email: "alina@example.com",\n  role: "user"\n});\nconsole.log(newUser.id); // ID созданного пользователя\n\n// PUT — полное обновление\nawait fetch(`/api/users/${id}`, {\n  method: "PUT",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(updatedUser)\n});\n\n// DELETE — удаление\nawait fetch(`/api/users/${id}`, { method: "DELETE" });' },
        { type: 'heading', value: 'HTTP методы и их назначение' },
        { type: 'list', items: [
          'GET — получить ресурс, нет тела запроса, можно кешировать',
          'POST — создать новый ресурс, тело содержит данные нового объекта',
          'PUT — полностью заменить ресурс по ID, тело содержит весь объект',
          'PATCH — частично обновить ресурс, тело содержит только изменённые поля',
          'DELETE — удалить ресурс по ID',
          'Content-Type: application/json обязателен при отправке JSON-тела'
        ]},
        { type: 'tip', value: 'body в fetch принимает строку, поэтому нужен JSON.stringify(data). Обратно — response.json() парсит строку в объект. Не забывай оба шага при работе с JSON API.' }
      ]
    },
    {
      id: 3,
      title: 'Заголовки запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Заголовки передают дополнительную информацию с запросом: тип данных, авторизацию, язык.' },
        { type: 'code', language: 'javascript', value: '// Авторизация через Bearer токен\nasync function getProtectedData(token) {\n  const response = await fetch("/api/protected", {\n    headers: {\n      "Authorization": `Bearer ${token}`,\n      "Content-Type": "application/json",\n      "Accept": "application/json",\n      "Accept-Language": "ru,en"\n    }\n  });\n  return response.json();\n}\n\n// Объект Headers\nconst headers = new Headers({\n  "Content-Type": "application/json",\n  "Authorization": "Bearer mytoken123"\n});\n\nheaders.append("X-Custom-Header", "value");\nheaders.get("Content-Type"); // "application/json"\nheaders.has("Authorization"); // true\n\nfetch("/api/data", { headers });\n\n// Чтение заголовков ответа\nconst response = await fetch("/api/users");\nconsole.log(response.headers.get("Content-Type"));\nconsole.log(response.headers.get("X-Total-Count"));' },
        { type: 'list', items: [
          'Authorization: Bearer {token} — стандартный способ передачи JWT-токена',
          'Content-Type: application/json — обязателен при отправке JSON в теле запроса',
          'Accept: application/json — запрашиваем у сервера ответ в формате JSON',
          'Объект Headers удобен для повторного использования и динамического добавления заголовков',
          'X-Custom-Header — соглашение для нестандартных заголовков приложения',
          'response.headers.get() читает заголовки ответа (Content-Type, X-Total-Count для пагинации)'
        ]},
        { type: 'tip', value: 'Создай базовую функцию apiFetch с токеном авторизации в заголовках, чтобы не повторять headers в каждом запросе. Это DRY-принцип применительно к HTTP-клиенту.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок и проверка статуса',
      type: 'theory',
      content: [
        { type: 'text', value: 'fetch выбрасывает ошибку только при сетевых проблемах. HTTP-ошибки (404, 500) нужно проверять вручную через response.ok.' },
        { type: 'code', language: 'javascript', value: '// Универсальная функция для fetch\nasync function apiFetch(url, options = {}) {\n  const response = await fetch(url, {\n    headers: {\n      "Content-Type": "application/json",\n      ...options.headers\n    },\n    ...options\n  });\n  \n  if (!response.ok) {\n    let errorMessage;\n    try {\n      const errorData = await response.json();\n      errorMessage = errorData.message || errorData.error;\n    } catch {\n      errorMessage = `HTTP error: ${response.status}`;\n    }\n    throw new Error(errorMessage);\n  }\n  \n  // 204 No Content — пустой ответ\n  if (response.status === 204) return null;\n  \n  return response.json();\n}\n\n// Использование\ntry {\n  const user = await apiFetch("/api/users/1");\n  console.log(user);\n} catch (error) {\n  if (error.message.includes("404")) {\n    showNotFound();\n  } else {\n    showError(error.message);\n  }\n}' },
        { type: 'list', items: [
          '200 OK — успешный запрос с данными в теле ответа',
          '201 Created — ресурс успешно создан (обычно при POST)',
          '204 No Content — успех, но нет тела ответа (удаление, обновление)',
          '400 Bad Request — ошибка в данных запроса',
          '401 Unauthorized — требуется авторизация',
          '404 Not Found — ресурс не найден, 500 Internal Server Error — ошибка на сервере'
        ]},
        { type: 'tip', value: 'Оборачивай fetch в универсальную функцию apiFetch — она будет обрабатывать токен, проверять response.ok, парсить ошибки из тела ответа. Это намного лучше, чем копировать одинаковый код обработки в каждом вызове.' }
      ]
    },
    {
      id: 5,
      title: 'Загрузка файлов и FormData',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для загрузки файлов используем FormData. Не устанавливай Content-Type вручную — браузер сам добавит правильный заголовок с boundary.' },
        { type: 'code', language: 'javascript', value: '// Загрузка файла\nconst fileInput = document.querySelector("input[type=file]");\n\nfileInput.addEventListener("change", async () => {\n  const file = fileInput.files[0];\n  if (!file) return;\n  \n  const formData = new FormData();\n  formData.append("avatar", file);\n  formData.append("userId", "123");\n  \n  try {\n    const response = await fetch("/api/upload", {\n      method: "POST",\n      // НЕ ЗАДАВАЙ Content-Type — браузер добавит с boundary\n      body: formData\n    });\n    \n    const result = await response.json();\n    console.log("Загружено:", result.url);\n    \n  } catch (error) {\n    console.error("Ошибка загрузки:", error);\n  }\n});\n\n// Прогресс загрузки через XMLHttpRequest (fetch не поддерживает)\nconst xhr = new XMLHttpRequest();\nxhr.upload.addEventListener("progress", (e) => {\n  const percent = Math.round((e.loaded / e.total) * 100);\n  progressBar.style.width = percent + "%";\n});' },
        { type: 'list', items: [
          'FormData автоматически устанавливает Content-Type: multipart/form-data с boundary',
          'Не задавай Content-Type вручную при использовании FormData — браузер сделает правильно',
          'formData.append(name, file) добавляет файл, formData.append(name, value) — текстовое поле',
          'file.size — размер в байтах, file.type — MIME-тип (image/jpeg), file.name — имя файла',
          'fetch не поддерживает прогресс загрузки — для этого нужен XMLHttpRequest'
        ]},
        { type: 'tip', value: 'Для валидации файлов перед загрузкой проверяй file.size и file.type на стороне клиента: if (file.size > 5 * 1024 * 1024) throw new Error("Файл слишком большой"). Это даёт мгновенную обратную связь без лишнего запроса.' }
      ]
    },
    {
      id: 6,
      title: 'AbortController и отмена запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'AbortController позволяет отменить fetch-запрос, например при вводе нового поиска.' },
        { type: 'code', language: 'javascript', value: '// Базовая отмена\nconst controller = new AbortController();\n\nconst response = await fetch("/api/slow", {\n  signal: controller.signal\n});\n\n// Отменить запрос\ncontroller.abort();\n// fetch выбросит AbortError\n\n// Практический пример: поиск с отменой предыдущего\nlet searchController = null;\n\nasync function search(query) {\n  // Отменить предыдущий запрос\n  if (searchController) {\n    searchController.abort();\n  }\n  searchController = new AbortController();\n  \n  try {\n    const response = await fetch(`/api/search?q=${query}`, {\n      signal: searchController.signal\n    });\n    const results = await response.json();\n    displayResults(results);\n  } catch (error) {\n    if (error.name !== "AbortError") {\n      console.error("Ошибка поиска:", error);\n    }\n  }\n}\n\nsearchInput.addEventListener("input", (e) => {\n  search(e.target.value);\n});' },
        { type: 'list', items: [
          'AbortController.abort() немедленно отменяет запрос, освобождая ресурсы',
          'Отменённый запрос выбрасывает AbortError — его нужно отловить отдельно',
          'Один контроллер можно передать нескольким fetch — abort() отменит все',
          'Полезен при смене маршрута в SPA, чтобы не обрабатывать ответы для предыдущей страницы',
          'controller.signal.aborted — проверить, был ли уже вызван abort()'
        ]},
        { type: 'tip', value: 'Комбинация AbortController + дебаунс — стандарт для live-поиска. Дебаунс уменьшает количество запросов, AbortController отменяет те, что успели уйти. Вместе они предотвращают "race condition" — отображение устаревших результатов.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Приложение для поиска',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай поиск пользователей через GitHub API с debounce и отменой запросов.',
      requirements: [
        'Поле поиска с debounce 400ms',
        'Запрос к https://api.github.com/search/users?q={query}',
        'Отменять предыдущий запрос при новом вводе',
        'Показывать список пользователей (аватар + логин)',
        'Индикатор загрузки',
        'Обработка ошибок (например rate limit 403)'
      ],
      expectedOutput: 'Живой поиск пользователей GitHub',
      hint: 'GitHub API отдаёт {items: [{login, avatar_url}]}. Используй AbortController для отмены. Дебаунс уменьшит количество запросов.',
      solution: 'const input = document.getElementById("search");\nconst results = document.getElementById("results");\nconst spinner = document.getElementById("spinner");\n\nlet controller = null;\n\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\nasync function searchUsers(query) {\n  if (!query.trim()) {\n    results.innerHTML = "";\n    return;\n  }\n  \n  if (controller) controller.abort();\n  controller = new AbortController();\n  \n  spinner.style.display = "block";\n  \n  try {\n    const res = await fetch(\n      `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=10`,\n      { signal: controller.signal }\n    );\n    \n    if (res.status === 403) throw new Error("Rate limit exceeded. Подождите.");\n    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);\n    \n    const { items } = await res.json();\n    \n    results.innerHTML = items.map(user => `\n      <div class="user-card">\n        <img src="${user.avatar_url}" width="40" height="40" alt="${user.login}">\n        <a href="${user.html_url}" target="_blank" rel="noopener">${user.login}</a>\n      </div>\n    `).join("");\n  } catch (e) {\n    if (e.name !== "AbortError") {\n      results.innerHTML = `<p class="error">${e.message}</p>`;\n    }\n  } finally {\n    spinner.style.display = "none";\n  }\n}\n\ninput.addEventListener("input", debounce((e) => {\n  searchUsers(e.target.value);\n}, 400));',
      explanation: 'AbortController + дебаунс — стандарт для поиска в реальном приложении. Без дебаунса каждое нажатие клавиши делает запрос. Без AbortController старые запросы могут "победить" новые в гонке. encodeURIComponent защищает от спецсимволов в запросе.'
    }
  ]
}
