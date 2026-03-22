export default {
  id: 17,
  title: 'Fetch и работа с API',
  description: 'Работа с внешними API в React: Fetch API, axios, загрузка данных в useEffect, обработка состояний загрузки и ошибок, отмена запросов, кастомный хук useFetch.',
  lessons: [
    {
      id: 1,
      title: 'Fetch API: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fetch API — встроенный браузерный инструмент для HTTP-запросов. Возвращает Promise. Используется вместе с async/await для удобной работы.' },
        { type: 'heading', value: 'Базовый GET-запрос' },
        { type: 'code', language: 'jsx', value: '// Простой fetch-запрос\nasync function fetchUsers() {\n  const response = await fetch("https://jsonplaceholder.typicode.com/users");\n\n  // Важно: fetch не бросает ошибку при HTTP 4xx/5xx!\n  if (!response.ok) {\n    throw new Error("HTTP ошибка: " + response.status);\n  }\n\n  const data = await response.json();\n  return data;\n}\n\n// POST-запрос\nasync function createUser(userData) {\n  const response = await fetch("https://api.example.com/users", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(userData),\n  });\n\n  if (!response.ok) throw new Error("Ошибка создания");\n  return response.json();\n}' },
        { type: 'warning', value: 'Fetch не бросает ошибку при статусах 404 или 500! Всегда проверяй response.ok или response.status вручную.' }
      ]
    },
    {
      id: 2,
      title: 'Загрузка данных в useEffect',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартный паттерн загрузки данных — запрос в useEffect при монтировании компонента. Нужно хранить три состояния: data, loading и error.' },
        { type: 'heading', value: 'Паттерн загрузки данных' },
        { type: 'code', language: 'jsx', value: 'import { useState, useEffect } from "react";\n\nfunction UserList() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        setError(null);\n\n        const response = await fetch(\n          "https://jsonplaceholder.typicode.com/users"\n        );\n        if (!response.ok) throw new Error("Ошибка: " + response.status);\n\n        const data = await response.json();\n        setUsers(data);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, []); // [] — запрос только при монтировании\n\n  if (loading) return <p>Загрузка...</p>;\n  if (error) return <p>Ошибка: {error}</p>;\n\n  return (\n    <ul>\n      {users.map(user => (\n        <li key={user.id}>{user.name} — {user.email}</li>\n      ))}\n    </ul>\n  );\n}' },
        { type: 'tip', value: 'finally { setLoading(false) } гарантирует, что индикатор загрузки исчезнет и при успехе, и при ошибке.' }
      ]
    },
    {
      id: 3,
      title: 'Отмена запросов с AbortController',
      type: 'theory',
      content: [
        { type: 'text', value: 'При размонтировании компонента может прийти ответ от сервера и произойдёт обновление состояния несуществующего компонента. AbortController позволяет отменить запрос при cleanup.' },
        { type: 'heading', value: 'Правильная отмена fetch' },
        { type: 'code', language: 'jsx', value: 'import { useState, useEffect } from "react";\n\nfunction PostDetail({ postId }) {\n  const [post, setPost] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    const signal = controller.signal;\n\n    const fetchPost = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(\n          "https://jsonplaceholder.typicode.com/posts/" + postId,\n          { signal } // Передаём signal в fetch\n        );\n        if (!response.ok) throw new Error("Ошибка загрузки");\n        const data = await response.json();\n        setPost(data);\n      } catch (err) {\n        // AbortError — это нормально, не показываем как ошибку\n        if (err.name !== "AbortError") {\n          console.error("Ошибка:", err);\n        }\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchPost();\n\n    // Cleanup: отменяем запрос при размонтировании\n    // или при изменении postId\n    return () => controller.abort();\n  }, [postId]);\n\n  return loading ? <p>Загрузка...</p> : <div>{post?.title}</div>;\n}' },
        { type: 'note', value: 'Это важно для компонентов которые зависят от пропса (как postId). При быстрой смене postId старые запросы автоматически отменяются — нет race condition.' }
      ]
    },
    {
      id: 4,
      title: 'Axios: альтернатива Fetch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Axios — популярная библиотека для HTTP-запросов. Автоматически парсит JSON, бросает ошибки при 4xx/5xx, имеет интерсепторы и удобный API.' },
        { type: 'heading', value: 'Axios vs Fetch' },
        { type: 'code', language: 'jsx', value: '// npm install axios\nimport axios from "axios";\n\n// Базовый запрос\nconst response = await axios.get("/api/users");\nconsole.log(response.data); // Уже распарсенный JSON\n\n// axios бросает ошибку при 4xx/5xx (в отличие от fetch!)\ntry {\n  const { data } = await axios.get("/api/users/999");\n} catch (error) {\n  if (axios.isAxiosError(error)) {\n    console.log("Статус:", error.response?.status); // 404\n    console.log("Сообщение:", error.message);\n  }\n}\n\n// Создание экземпляра с базовыми настройками\nconst api = axios.create({\n  baseURL: "https://api.example.com",\n  headers: { "Authorization": "Bearer " + token },\n  timeout: 5000,\n});\n\n// Интерсептор для обработки токена\napi.interceptors.request.use(config => {\n  const token = localStorage.getItem("token");\n  if (token) config.headers.Authorization = "Bearer " + token;\n  return config;\n});' },
        { type: 'tip', value: 'Деструктурируй data сразу: const { data } = await axios.get(...). Это избавляет от лишнего response.json() и response.data.' }
      ]
    },
    {
      id: 5,
      title: 'Кастомный хук useFetch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Повторяющуюся логику загрузки данных можно вынести в кастомный хук useFetch. Это позволяет переиспользовать паттерн loading/error/data в любом компоненте.' },
        { type: 'heading', value: 'Реализация useFetch' },
        { type: 'code', language: 'jsx', value: 'import { useState, useEffect } from "react";\n\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    if (!url) return;\n\n    const controller = new AbortController();\n\n    const fetchData = async () => {\n      setLoading(true);\n      setError(null);\n      try {\n        const response = await fetch(url, { signal: controller.signal });\n        if (!response.ok) throw new Error("HTTP " + response.status);\n        const json = await response.json();\n        setData(json);\n      } catch (err) {\n        if (err.name !== "AbortError") setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n\n// Использование в компонентах\nfunction Posts() {\n  const { data: posts, loading, error } = useFetch(\n    "https://jsonplaceholder.typicode.com/posts"\n  );\n\n  if (loading) return <p>Загрузка...</p>;\n  if (error) return <p>Ошибка: {error}</p>;\n\n  return <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>;\n}' },
        { type: 'note', value: 'useFetch — простая версия React Query. Для продакшна лучше использовать TanStack Query, но понимание основ через useFetch очень важно.' }
      ]
    },
    {
      id: 6,
      title: 'Отправка данных: POST, PUT, DELETE',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для изменения данных используем методы POST (создание), PUT/PATCH (обновление) и DELETE (удаление). После успешного запроса обновляем локальное состояние.' },
        { type: 'code', language: 'jsx', value: 'import { useState } from "react";\n\nfunction TodoApp() {\n  const [todos, setTodos] = useState([]);\n  const [newTitle, setNewTitle] = useState("");\n\n  // Создание\n  const createTodo = async () => {\n    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ title: newTitle, completed: false }),\n    });\n    const created = await response.json();\n    setTodos(prev => [created, ...prev]);\n    setNewTitle("");\n  };\n\n  // Удаление\n  const deleteTodo = async (id) => {\n    await fetch("https://jsonplaceholder.typicode.com/todos/" + id, {\n      method: "DELETE",\n    });\n    // Оптимистичное обновление: удаляем до получения ответа\n    setTodos(prev => prev.filter(t => t.id !== id));\n  };\n\n  // Переключение статуса\n  const toggleTodo = async (todo) => {\n    const response = await fetch(\n      "https://jsonplaceholder.typicode.com/todos/" + todo.id,\n      {\n        method: "PATCH",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ completed: !todo.completed }),\n      }\n    );\n    const updated = await response.json();\n    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));\n  };\n}' },
        { type: 'tip', value: 'Оптимистичное обновление: обновляем UI сразу, не дожидаясь ответа сервера. Если запрос упал — откатываем изменение. Это делает приложение более отзывчивым.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: GitHub пользователь поиск',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай компонент поиска GitHub-пользователей. При вводе имени загружай данные через GitHub API и показывай аватар, имя и количество публичных репозиториев.',
      requirements: [
        'Input поле для ввода username (с debounce 500мс через useEffect)',
        'Запрос к https://api.github.com/users/{username} при изменении username',
        'Состояния: loading, error, data',
        'Отображение: аватар, имя, login, количество репозиториев, ссылка на профиль',
        'При пустом input — не делать запрос',
        'AbortController для отмены предыдущего запроса'
      ],
      hint: 'Debounce реализуй через useEffect с setTimeout: const timer = setTimeout(() => setDebouncedValue(value), 500); return () => clearTimeout(timer). Запрос делай по debouncedValue, а не по value.',
      expectedOutput: 'Поле поиска с debounce 500мс\nВо время загрузки: "Загрузка..."\nНайденный пользователь: аватар, имя, bio, stats (repos, followers)\nОшибка 404: "Пользователь не найден"\nСетевая ошибка: "Ошибка загрузки данных"',
      solution: 'import { useState, useEffect } from "react";\n\nfunction GitHubSearch() {\n  const [username, setUsername] = useState("");\n  const [debouncedUsername, setDebouncedUsername] = useState("");\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n\n  // Debounce\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedUsername(username);\n    }, 500);\n    return () => clearTimeout(timer);\n  }, [username]);\n\n  // Запрос\n  useEffect(() => {\n    if (!debouncedUsername.trim()) {\n      setUser(null);\n      return;\n    }\n\n    const controller = new AbortController();\n\n    const fetchUser = async () => {\n      setLoading(true);\n      setError(null);\n      try {\n        const res = await fetch(\n          "https://api.github.com/users/" + debouncedUsername,\n          { signal: controller.signal }\n        );\n        if (res.status === 404) throw new Error("Пользователь не найден");\n        if (!res.ok) throw new Error("Ошибка API");\n        const data = await res.json();\n        setUser(data);\n      } catch (err) {\n        if (err.name !== "AbortError") setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchUser();\n    return () => controller.abort();\n  }, [debouncedUsername]);\n\n  return (\n    <div>\n      <input\n        value={username}\n        onChange={e => setUsername(e.target.value)}\n        placeholder="Введите GitHub username"\n      />\n      {loading && <p>Загрузка...</p>}\n      {error && <p style={{color: "red"}}>{error}</p>}\n      {user && (\n        <div>\n          <img src={user.avatar_url} alt={user.login} width={100} />\n          <h2>{user.name || user.login}</h2>\n          <p>@{user.login}</p>\n          <p>Репозитории: {user.public_repos}</p>\n          <a href={user.html_url} target="_blank" rel="noreferrer">Профиль</a>\n        </div>\n      )}\n    </div>\n  );\n}',
      explanation: 'Debounce предотвращает лишние запросы при каждом нажатии клавиши. AbortController отменяет устаревший запрос если пользователь напечатал новое имя до ответа сервера.'
    }
  ]
}
