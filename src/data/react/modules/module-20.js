export default {
  id: 20,
  title: 'React Query (TanStack)',
  description: 'Серверное состояние с TanStack Query: useQuery, useMutation, кеширование, инвалидация, пагинация, оптимистичные обновления и DevTools.',
  lessons: [
    {
      id: 1,
      title: 'Концепция: серверное vs клиентское состояние',
      type: 'theory',
      content: [
        { type: 'text', value: 'React Query разделяет состояние на серверное (данные с API) и клиентское (UI-состояние). Серверное состояние отличается: оно асинхронное, может устаревать, хранится удалённо.' },
        { type: 'heading', value: 'Установка и настройка' },
        { type: 'code', language: 'jsx', value: '// npm install @tanstack/react-query\nimport { QueryClient, QueryClientProvider } from "@tanstack/react-query";\nimport { ReactQueryDevtools } from "@tanstack/react-query-devtools";\n\n// Создаём клиент с настройками\nconst queryClient = new QueryClient({\n  defaultOptions: {\n    queries: {\n      staleTime: 60 * 1000,    // Данные "свежие" 1 минуту\n      gcTime: 5 * 60 * 1000,   // Хранить в кеше 5 минут\n      retry: 2,                 // 2 повтора при ошибке\n      refetchOnWindowFocus: true, // Обновлять при фокусе вкладки\n    },\n  },\n});\n\n// В main.jsx\nexport default function App() {\n  return (\n    <QueryClientProvider client={queryClient}>\n      <AppContent />\n      {/* DevTools — только в разработке */}\n      <ReactQueryDevtools initialIsOpen={false} />\n    </QueryClientProvider>\n  );\n}' },
        { type: 'note', value: 'staleTime — время пока данные считаются "свежими" и не нужно повторно запрашивать. gcTime — время хранения в кеше после того как компонент размонтирован.' }
      ]
    },
    {
      id: 2,
      title: 'useQuery: получение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'useQuery — основной хук для GET-запросов. Управляет loading/error/data, кешированием и автоматическим рефетчингом.' },
        { type: 'code', language: 'jsx', value: 'import { useQuery } from "@tanstack/react-query";\n\n// Функция-fetcher (обычная async функция)\nconst fetchPosts = async () => {\n  const res = await fetch("https://jsonplaceholder.typicode.com/posts");\n  if (!res.ok) throw new Error("Ошибка загрузки");\n  return res.json();\n};\n\nfunction PostList() {\n  const {\n    data: posts,\n    isLoading,\n    isError,\n    error,\n    isFetching, // true при фоновом обновлении\n    refetch,    // Принудительное обновление\n  } = useQuery({\n    queryKey: ["posts"], // Уникальный ключ кеша\n    queryFn: fetchPosts,\n    staleTime: 2 * 60 * 1000, // Переопределяем глобальный\n  });\n\n  if (isLoading) return <p>Первая загрузка...</p>;\n  if (isError) return <p>Ошибка: {error.message}</p>;\n\n  return (\n    <div>\n      {isFetching && <span>Обновление...</span>}\n      <button onClick={() => refetch()}>Обновить</button>\n      <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'queryKey — это массив. ["posts"] и ["posts", 1] — разные кеши. При изменении queryKey автоматически делается новый запрос.' }
      ]
    },
    {
      id: 3,
      title: 'Зависимые запросы и queryKey с параметрами',
      type: 'theory',
      content: [
        { type: 'text', value: 'queryKey с динамическими параметрами — каждое уникальное значение кешируется отдельно. Параметр enabled позволяет делать зависимые запросы.' },
        { type: 'code', language: 'jsx', value: 'import { useQuery } from "@tanstack/react-query";\n\n// Динамический ключ: отдельный кеш для каждого userId\nfunction UserDetail({ userId }) {\n  const { data: user, isLoading } = useQuery({\n    queryKey: ["users", userId], // Кеш per-user!\n    queryFn: () => fetch("/api/users/" + userId).then(r => r.json()),\n    enabled: !!userId, // Запрос только если userId не null/undefined\n  });\n\n  if (isLoading) return <p>Загрузка...</p>;\n  return <div>{user?.name}</div>;\n}\n\n// Зависимые запросы: второй запрос зависит от результата первого\nfunction UserPosts({ username }) {\n  // 1. Получаем userId по username\n  const { data: user } = useQuery({\n    queryKey: ["users", "byUsername", username],\n    queryFn: () => fetch("/api/users?username=" + username).then(r => r.json()),\n    enabled: !!username,\n  });\n\n  // 2. Получаем посты только когда есть userId\n  const { data: posts } = useQuery({\n    queryKey: ["posts", "byUser", user?.id],\n    queryFn: () => fetch("/api/posts?userId=" + user.id).then(r => r.json()),\n    enabled: !!user?.id, // Ждём загрузки пользователя\n  });\n\n  return <div>{posts?.map(p => <p key={p.id}>{p.title}</p>)}</div>;\n}' }
      ]
    },
    {
      id: 4,
      title: 'useMutation: изменение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'useMutation используется для POST/PUT/DELETE запросов. Поддерживает коллбэки onSuccess, onError, onSettled и оптимистичные обновления.' },
        { type: 'code', language: 'jsx', value: 'import { useMutation, useQueryClient } from "@tanstack/react-query";\n\nfunction CreatePost() {\n  const queryClient = useQueryClient();\n\n  const createMutation = useMutation({\n    mutationFn: (newPost) =>\n      fetch("/api/posts", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify(newPost),\n      }).then(r => r.json()),\n\n    onSuccess: (data) => {\n      // Инвалидируем кеш постов — принудительный рефетч\n      queryClient.invalidateQueries({ queryKey: ["posts"] });\n      console.log("Пост создан:", data);\n    },\n    onError: (error) => {\n      console.error("Ошибка:", error);\n    },\n  });\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    createMutation.mutate({ title: "Новый пост", body: "Текст..." });\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <button\n        type="submit"\n        disabled={createMutation.isPending}\n      >\n        {createMutation.isPending ? "Создание..." : "Создать"}\n      </button>\n      {createMutation.isError && <p>Ошибка создания</p>}\n    </form>\n  );\n}' },
        { type: 'note', value: 'queryClient.invalidateQueries({ queryKey: ["posts"] }) помечает кеш постов как устаревший. При следующем показе компонента с useQuery(["posts"]) данные будут перезагружены.' }
      ]
    },
    {
      id: 5,
      title: 'Оптимистичные обновления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оптимистичное обновление: обновляем кеш сразу не дожидаясь ответа сервера. При ошибке откатываемся к предыдущему состоянию.' },
        { type: 'code', language: 'jsx', value: 'import { useMutation, useQueryClient } from "@tanstack/react-query";\n\nfunction TodoItem({ todo }) {\n  const queryClient = useQueryClient();\n\n  const toggleMutation = useMutation({\n    mutationFn: (todo) =>\n      fetch("/api/todos/" + todo.id, {\n        method: "PATCH",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ completed: !todo.completed }),\n      }).then(r => r.json()),\n\n    onMutate: async (todo) => {\n      // Отменяем исходящие запросы\n      await queryClient.cancelQueries({ queryKey: ["todos"] });\n\n      // Сохраняем предыдущее состояние\n      const previous = queryClient.getQueryData(["todos"]);\n\n      // Оптимистично обновляем кеш\n      queryClient.setQueryData(["todos"], (old) =>\n        old.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)\n      );\n\n      // Возвращаем предыдущее для отката\n      return { previous };\n    },\n    onError: (err, todo, context) => {\n      // Откатываемся при ошибке\n      queryClient.setQueryData(["todos"], context.previous);\n    },\n    onSettled: () => {\n      // Всегда синхронизируем с сервером\n      queryClient.invalidateQueries({ queryKey: ["todos"] });\n    },\n  });\n\n  return (\n    <input\n      type="checkbox"\n      checked={todo.completed}\n      onChange={() => toggleMutation.mutate(todo)}\n    />\n  );\n}' }
      ]
    },
    {
      id: 6,
      title: 'Пагинация и бесконечная прокрутка',
      type: 'theory',
      content: [
        { type: 'text', value: 'React Query поддерживает пагинацию через keepPreviousData и бесконечную прокрутку через useInfiniteQuery.' },
        { type: 'code', language: 'jsx', value: 'import { useQuery, useInfiniteQuery } from "@tanstack/react-query";\n\n// Обычная пагинация\nfunction PaginatedPosts() {\n  const [page, setPage] = React.useState(1);\n\n  const { data, isPlaceholderData } = useQuery({\n    queryKey: ["posts", "page", page],\n    queryFn: () =>\n      fetch("/api/posts?page=" + page + "&limit=10").then(r => r.json()),\n    placeholderData: (prev) => prev, // keepPreviousData — старые данные пока грузятся новые\n  });\n\n  return (\n    <div>\n      <ul>{data?.posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>\n      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Назад</button>\n      <span>Страница {page}</span>\n      <button onClick={() => setPage(p => p + 1)}\n              disabled={isPlaceholderData || !data?.hasMore}>Вперёд</button>\n    </div>\n  );\n}\n\n// Бесконечная прокрутка\nfunction InfinitePosts() {\n  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({\n    queryKey: ["posts", "infinite"],\n    queryFn: ({ pageParam = 1 }) =>\n      fetch("/api/posts?page=" + pageParam).then(r => r.json()),\n    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,\n    initialPageParam: 1,\n  });\n\n  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];\n\n  return (\n    <div>\n      {allPosts.map(p => <div key={p.id}>{p.title}</div>)}\n      <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>\n        {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}\n      </button>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Todo приложение с React Query',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай todo-приложение использующее React Query для работы с API. Используй JSONPlaceholder API для демонстрации.',
      requirements: [
        'QueryClientProvider в корне приложения',
        'useQuery для загрузки списка todos (GET /todos?_limit=10)',
        'useMutation для добавления нового todo (POST /todos)',
        'useMutation для переключения статуса (PATCH /todos/:id)',
        'useMutation для удаления (DELETE /todos/:id)',
        'После каждой мутации: invalidateQueries для ["todos"]',
        'Состояния загрузки и ошибок для каждой операции'
      ],
      hint: 'Используй https://jsonplaceholder.typicode.com/todos. Для POST/PATCH/DELETE JSONPlaceholder принимает запросы и возвращает моковый ответ, но данные реально не меняются — это нормально для практики.',
      expectedOutput: 'useQuery(["todos"]) -> { data, isLoading, isError }\nuseMutation для создания/обновления/удаления\nПри создании задачи: optimistic update (задача сразу в списке)\nОшибка сервера: автоматический rollback\nRefetch при фокусе вкладки',
      solution: 'import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";\n\nconst BASE = "https://jsonplaceholder.typicode.com";\nconst queryClient = new QueryClient();\n\nfunction TodoApp() {\n  const qc = useQueryClient();\n\n  const { data: todos, isLoading } = useQuery({\n    queryKey: ["todos"],\n    queryFn: () => fetch(BASE + "/todos?_limit=5").then(r => r.json()),\n  });\n\n  const addMutation = useMutation({\n    mutationFn: (title) => fetch(BASE + "/todos", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ title, completed: false, userId: 1 }),\n    }).then(r => r.json()),\n    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),\n  });\n\n  const toggleMutation = useMutation({\n    mutationFn: ({ id, completed }) => fetch(BASE + "/todos/" + id, {\n      method: "PATCH",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ completed }),\n    }).then(r => r.json()),\n    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),\n  });\n\n  const deleteMutation = useMutation({\n    mutationFn: (id) => fetch(BASE + "/todos/" + id, { method: "DELETE" }),\n    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),\n  });\n\n  if (isLoading) return <p>Загрузка...</p>;\n\n  return (\n    <div>\n      <button onClick={() => addMutation.mutate("Новая задача")}>\n        {addMutation.isPending ? "Добавление..." : "Добавить"}\n      </button>\n      {todos?.map(todo => (\n        <div key={todo.id}>\n          <input type="checkbox" checked={todo.completed}\n            onChange={() => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })} />\n          <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</span>\n          <button onClick={() => deleteMutation.mutate(todo.id)}>Удалить</button>\n        </div>\n      ))}\n    </div>\n  );\n}\n\nexport default function App() {\n  return <QueryClientProvider client={queryClient}><TodoApp /></QueryClientProvider>;\n}',
      explanation: 'React Query полностью заменяет useState+useEffect паттерн для серверного состояния. invalidateQueries после мутаций обеспечивает актуальность данных без ручного управления состоянием.'
    }
  ]
}
