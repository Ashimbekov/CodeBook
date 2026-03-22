export default {
  id: 11,
  title: 'useEffect',
  description: 'Хук useEffect: побочные эффекты, зависимости, cleanup, запросы к API, subscriptions и паттерны использования',
  lessons: [
    {
      id: 1,
      title: 'Что такое useEffect',
      type: 'theory',
      content: [
        { type: 'text', value: 'useEffect — хук для выполнения побочных эффектов: запросы к API, работа с DOM, подписки, таймеры. Выполняется после рендера компонента.' },
        { type: 'heading', value: 'Синтаксис useEffect' },
        { type: 'code', language: 'jsx', value: 'import { useEffect } from "react";\n\nfunction Component() {\n  // useEffect(функция, [зависимости])\n\n  // 1. Без зависимостей — каждый рендер\n  useEffect(() => {\n    console.log("Компонент отрендерился");\n  });\n\n  // 2. Пустой массив — только при монтировании\n  useEffect(() => {\n    console.log("Компонент смонтирован");\n    // Аналог componentDidMount в классовых компонентах\n  }, []);\n\n  // 3. Список зависимостей — при изменении зависимостей\n  useEffect(() => {\n    console.log("userId изменился:", userId);\n    // Запустится при монтировании И при каждом изменении userId\n  }, [userId]);\n\n  // 4. С cleanup — очистка при размонтировании\n  useEffect(() => {\n    const timer = setInterval(() => {/* ... */}, 1000);\n    return () => clearInterval(timer); // Cleanup!\n  }, []);\n\n  return <div>...</div>;\n}' },
        { type: 'note', value: 'React вызывает useEffect ПОСЛЕ отрисовки DOM — браузер успевает обновить экран. Если нужно выполнить ДО отрисовки (измерения DOM) — используйте useLayoutEffect.' }
      ]
    },
    {
      id: 2,
      title: 'Зависимости useEffect',
      type: 'theory',
      content: [
        { type: 'text', value: 'Массив зависимостей говорит React когда перезапускать эффект. Все значения из closure (кроме setState и стабильных функций) должны быть в зависимостях.' },
        { type: 'heading', value: 'Правило зависимостей' },
        { type: 'code', language: 'jsx', value: 'function SearchComponent({ query, pageSize }) {\n  const [results, setResults] = useState([]);\n\n  useEffect(() => {\n    // query и pageSize используются внутри\n    // -> должны быть в зависимостях!\n    if (!query) return;\n\n    const controller = new AbortController();\n    fetch(`/api/search?q=${query}&size=${pageSize}`, {\n      signal: controller.signal\n    })\n      .then(r => r.json())\n      .then(data => setResults(data))\n      .catch(e => {\n        if (e.name !== "AbortError") console.error(e);\n      });\n\n    return () => controller.abort(); // Отменяем запрос при cleanup\n  }, [query, pageSize]); // ОБА должны быть здесь!\n\n  return <ResultsList results={results} />;\n}' },
        { type: 'heading', value: 'Нарушение правила зависимостей' },
        { type: 'code', language: 'jsx', value: '// ПЛОХО: userId используется, но не в зависимостях\nuseEffect(() => {\n  fetchUser(userId); // Стабильный userId при смене?\n}, []); // Будет использовать первоначальный userId!\n\n// ПРАВИЛЬНО:\nuseEffect(() => {\n  fetchUser(userId);\n}, [userId]); // Перезапустится при смене userId\n\n// Правило: eslint-plugin-react-hooks предупредит о пропущенных зависимостях\n// Никогда не лгите ESLint о зависимостях — это вызовет баги!' }
      ]
    },
    {
      id: 3,
      title: 'Cleanup функция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cleanup (функция очистки) — возвращается из useEffect. Вызывается перед следующим запуском эффекта и при размонтировании компонента. Предотвращает утечки памяти.' },
        { type: 'heading', value: 'Cleanup для разных сценариев' },
        { type: 'code', language: 'jsx', value: 'function CleanupExamples({ isConnected, roomId }) {\n  // 1. Таймер\n  useEffect(() => {\n    const timer = setInterval(() => {\n      console.log("Тик");\n    }, 1000);\n    return () => clearInterval(timer); // Очищаем таймер!\n  }, []);\n\n  // 2. Event listener\n  useEffect(() => {\n    const handleResize = () => console.log(window.innerWidth);\n    window.addEventListener("resize", handleResize);\n    return () => window.removeEventListener("resize", handleResize);\n  }, []);\n\n  // 3. WebSocket / subscription\n  useEffect(() => {\n    if (!isConnected) return;\n    const ws = new WebSocket(`ws://chat/${roomId}`);\n    ws.onmessage = (e) => console.log("Сообщение:", e.data);\n    return () => ws.close(); // Закрываем соединение\n  }, [isConnected, roomId]); // roomId изменился -> закрыть старое, открыть новое\n\n  // 4. AbortController для fetch\n  useEffect(() => {\n    const abortCtrl = new AbortController();\n    fetch("/api/data", { signal: abortCtrl.signal })\n      .then(r => r.json())\n      .then(setData)\n      .catch(() => {}); // Игнорируем abort ошибки\n    return () => abortCtrl.abort(); // Отменяем запрос при cleanup\n  }, []);\n}' }
      ]
    },
    {
      id: 4,
      title: 'Загрузка данных из API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Загрузка данных — главный сценарий useEffect. Нужно обрабатывать три состояния: загрузка, данные, ошибка. Не забывайте про cleanup через AbortController.' },
        { type: 'heading', value: 'Паттерн загрузки данных' },
        { type: 'code', language: 'jsx', value: 'import { useState, useEffect } from "react";\n\nfunction useFetch(url) {\n  const [data, setData]       = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError]     = useState(null);\n\n  useEffect(() => {\n    if (!url) return;\n    setLoading(true);\n    setError(null);\n\n    const controller = new AbortController();\n\n    fetch(url, { signal: controller.signal })\n      .then(response => {\n        if (!response.ok) throw new Error(`HTTP ${response.status}`);\n        return response.json();\n      })\n      .then(json => {\n        setData(json);\n        setLoading(false);\n      })\n      .catch(err => {\n        if (err.name === "AbortError") return; // Нормально — компонент размонтирован\n        setError(err.message);\n        setLoading(false);\n      });\n\n    return () => controller.abort();\n  }, [url]); // Перезапускаем при смене url\n\n  return { data, loading, error };\n}\n\n// Использование:\nfunction PostDetail({ postId }) {\n  const { data: post, loading, error } = useFetch(`/api/posts/${postId}`);\n\n  if (loading) return <p>Загрузка...</p>;\n  if (error)   return <p>Ошибка: {error}</p>;\n  if (!post)   return <p>Пост не найден</p>;\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.body}</p>\n    </article>\n  );\n}' }
      ]
    },
    {
      id: 5,
      title: 'useEffect для синхронизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'useEffect синхронизирует компонент с внешними системами: localStorage, URL, document.title. Думайте о нём как о "синхронизаторе", а не о жизненном цикле.' },
        { type: 'heading', value: 'Синхронизация с внешними системами' },
        { type: 'code', language: 'jsx', value: 'function App() {\n  const [theme, setTheme] = useState("light");\n  const [title, setTitle] = useState("Главная");\n  const [count, setCount] = useState(0);\n\n  // Синхронизация с document.title\n  useEffect(() => {\n    document.title = `${title} | Мой сайт`;\n  }, [title]); // Обновляем заголовок при смене title\n\n  // Синхронизация с localStorage\n  useEffect(() => {\n    localStorage.setItem("theme", theme);\n    document.body.className = theme; // Применяем CSS класс\n  }, [theme]);\n\n  // Синхронизация с URL (без роутера)\n  useEffect(() => {\n    const newUrl = `${window.location.pathname}?count=${count}`;\n    window.history.replaceState(null, "", newUrl);\n  }, [count]);\n\n  // Синхронизация с внешней библиотекой\n  useEffect(() => {\n    const map = new MapLibrary("#map-container");\n    map.init();\n    return () => map.destroy(); // Cleanup\n  }, []); // Один раз при монтировании\n}' }
      ]
    },
    {
      id: 6,
      title: 'Общие ошибки с useEffect',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бесконечный цикл, устаревшее состояние, race conditions — частые проблемы с useEffect. Понимание причин помогает избежать ошибок.' },
        { type: 'heading', value: 'Как создать бесконечный цикл' },
        { type: 'code', language: 'jsx', value: '// БЕСКОНЕЧНЫЙ ЦИКЛ: объект создаётся при каждом рендере\nconst options = { limit: 10 }; // Новая ссылка каждый раз!\nuseEffect(() => { fetch("/api", { ...options }); }, [options]); // Ссылка меняется!\n\n// РЕШЕНИЕ 1: Примитивные значения в зависимостях\nuseEffect(() => { fetch(`/api?limit=${options.limit}`); }, [options.limit]);\n\n// РЕШЕНИЕ 2: useMemo/useCallback для стабилизации\nconst stableOptions = useMemo(() => ({ limit: 10 }), []); // Стабильная ссылка\n\n// БЕСКОНЕЧНЫЙ ЦИКЛ: setState в useEffect без условия\nuseEffect(() => {\n  setCount(count + 1); // Изменяет count -> эффект перезапускается -> ...\n}, [count]);\n\n// РЕШЕНИЕ: функциональное обновление\nuseEffect(() => {\n  const timer = setInterval(() => {\n    setCount(prev => prev + 1); // Не нужен count в зависимостях!\n  }, 1000);\n  return () => clearInterval(timer);\n}, []); // Пустые зависимости — OK!' }
      ]
    },
    {
      id: 7,
      title: 'Race Conditions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Race condition: пользователь быстро переключает id, несколько fetch запросов "гонятся" — последний отрендеренный результат может быть не от последнего запроса.' },
        { type: 'code', language: 'jsx', value: '// ПРОБЛЕМА: race condition\nfunction BadComponent({ userId }) {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    fetch(`/api/users/${userId}`)\n      .then(r => r.json())\n      .then(setUser); // Какой из параллельных ответов пришёл первым?\n  }, [userId]);\n}\n\n// РЕШЕНИЕ 1: AbortController (отменяем старые)\nfunction GoodComponent({ userId }) {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    const ctrl = new AbortController();\n    fetch(`/api/users/${userId}`, { signal: ctrl.signal })\n      .then(r => r.json())\n      .then(setUser)\n      .catch(() => {});\n    return () => ctrl.abort(); // Отменяем при смене userId\n  }, [userId]);\n}\n\n// РЕШЕНИЕ 2: ignore флаг\nfunction GoodComponent2({ userId }) {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    let ignore = false; // Флаг устаревания\n    fetch(`/api/users/${userId}`)\n      .then(r => r.json())\n      .then(data => {\n        if (!ignore) setUser(data); // Только если актуальный запрос\n      });\n    return () => { ignore = true; }; // Помечаем как устаревший\n  }, [userId]);\n}' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Dashboard с данными',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте dashboard который загружает данные из JSONPlaceholder, показывает список постов с пагинацией, поиском и автообновлением.',
      requirements: [
        'Загрузка постов из https://jsonplaceholder.typicode.com/posts',
        'Показывать загрузку, ошибку, данные',
        'Поиск по заголовку — фильтрация на клиенте',
        'Пагинация: 5 постов на страницу',
        'Автообновление каждые 30 секунд (с индикатором)',
        'Cleanup: отмена fetch и clearInterval'
      ],
      hint: 'useFetch хук с AbortController. Автообновление: setInterval внутри useEffect с пустыми зависимостями, который вызывает refetch. refetch инкрементирует refreshKey, который в зависимостях useFetch.',
      solution: 'import { useState, useEffect, useMemo, useCallback } from "react";\n\nfunction usePosts() {\n  const [posts, setPosts]     = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError]     = useState(null);\n  const [refreshKey, setRefreshKey] = useState(0);\n  const [lastUpdated, setLastUpdated] = useState(null);\n\n  useEffect(() => {\n    const ctrl = new AbortController();\n    setLoading(true);\n    fetch("https://jsonplaceholder.typicode.com/posts", { signal: ctrl.signal })\n      .then(r => r.json())\n      .then(data => { setPosts(data); setLoading(false); setLastUpdated(new Date()); })\n      .catch(err => { if (err.name !== "AbortError") { setError(err.message); setLoading(false); } });\n    return () => ctrl.abort();\n  }, [refreshKey]);\n\n  // Автообновление каждые 30 секунд\n  useEffect(() => {\n    const timer = setInterval(() => setRefreshKey(k => k + 1), 30_000);\n    return () => clearInterval(timer);\n  }, []);\n\n  const refetch = useCallback(() => setRefreshKey(k => k + 1), []);\n  return { posts, loading, error, refetch, lastUpdated };\n}\n\nexport default function Dashboard() {\n  const { posts, loading, error, refetch, lastUpdated } = usePosts();\n  const [search, setSearch] = useState("");\n  const [page, setPage]     = useState(1);\n  const PAGE_SIZE = 5;\n\n  const filtered = useMemo(() =>\n    posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())),\n    [posts, search]\n  );\n  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);\n  const currentPage = useMemo(() =>\n    filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),\n    [filtered, page]\n  );\n\n  // Сброс страницы при поиске\n  useEffect(() => { setPage(1); }, [search]);\n\n  return (\n    <div style={{ padding: "2rem", maxWidth: "700px" }}>\n      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>\n        <h2>Посты ({filtered.length})</h2>\n        <div style={{ fontSize: "12px", color: "#6b7280" }}>\n          {lastUpdated && `Обновлено: ${lastUpdated.toLocaleTimeString()}`}\n          <button onClick={refetch} style={{ marginLeft: "8px", padding: "4px 8px", cursor: "pointer" }}>🔄</button>\n        </div>\n      </div>\n      <input\n        value={search}\n        onChange={e => setSearch(e.target.value)}\n        placeholder="Поиск по заголовку..."\n        style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "1rem" }}\n      />\n      {loading && <p>Загрузка...</p>}\n      {error   && <p style={{ color: "red" }}>Ошибка: {error} <button onClick={refetch}>Повторить</button></p>}\n      {!loading && !error && currentPage.map(post => (\n        <div key={post.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1rem", marginBottom: "0.5rem" }}>\n          <div style={{ display: "flex", justifyContent: "space-between" }}>\n            <h3 style={{ margin: 0, fontSize: "16px" }}>{post.title}</h3>\n            <span style={{ color: "#9ca3af", fontSize: "12px" }}>#{post.id}</span>\n          </div>\n          <p style={{ color: "#6b7280", margin: "8px 0 0", fontSize: "14px" }}>{post.body.substring(0, 80)}...</p>\n        </div>\n      ))}\n      {totalPages > 1 && (\n        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>\n          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>\n          <span>Стр. {page} из {totalPages}</span>\n          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>\n        </div>\n      )}\n    </div>\n  );\n}',
      explanation: 'refreshKey инкрементируется для повторной загрузки — useEffect перезапускается при изменении зависимости. AbortController отменяет fetch при cleanup. Автообновление через setInterval в отдельном useEffect с пустыми зависимостями — очищается при размонтировании. useMemo кэширует filtered и currentPage для производительности.'
    }
  ]
}
