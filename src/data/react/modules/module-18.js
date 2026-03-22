export default {
  id: 18,
  title: 'Redux Toolkit',
  description: 'Управление глобальным состоянием с Redux Toolkit: createSlice, configureStore, useSelector, useDispatch, createAsyncThunk и RTK Query.',
  lessons: [
    {
      id: 1,
      title: 'Зачем Redux и когда его использовать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Redux — паттерн и библиотека для управления глобальным состоянием. Redux Toolkit (RTK) — официальный современный способ работы с Redux, который устраняет избыточный шаблонный код.' },
        { type: 'heading', value: 'Когда нужен Redux?' },
        { type: 'list', value: ['Состояние нужно в многих несвязанных компонентах', 'Сложная логика обновления состояния', 'Нужна история изменений / time-travel debugging', 'Команда больше 3-5 разработчиков, нужны стандарты'] },
        { type: 'tip', value: 'Для небольших приложений Context API + useReducer часто достаточно. Redux нужен когда приложение растёт и состояние становится сложным.' },
        { type: 'code', language: 'jsx', value: '// npm install @reduxjs/toolkit react-redux\n// Три ключевых концепции Redux:\n// Store    — единое хранилище всего состояния приложения\n// Action   — объект { type, payload } описывающий что произошло\n// Reducer  — чистая функция (state, action) => newState' }
      ]
    },
    {
      id: 2,
      title: 'createSlice: actions и reducer в одном месте',
      type: 'theory',
      content: [
        { type: 'text', value: 'createSlice — основной инструмент RTK. Автоматически создаёт action creators и action types из описания reducer-ов. Использует Immer для иммутабельных обновлений.' },
        { type: 'heading', value: 'Создание slice для счётчика' },
        { type: 'code', language: 'jsx', value: 'import { createSlice } from "@reduxjs/toolkit";\n\nconst counterSlice = createSlice({\n  name: "counter", // Префикс для action types\n  initialState: { value: 0, step: 1 },\n  reducers: {\n    // Immer позволяет "мутировать" state напрямую!\n    increment: (state) => {\n      state.value += state.step; // На самом деле создаёт новый объект\n    },\n    decrement: (state) => {\n      state.value -= state.step;\n    },\n    // payload — данные переданные в action\n    incrementByAmount: (state, action) => {\n      state.value += action.payload;\n    },\n    setStep: (state, action) => {\n      state.step = action.payload;\n    },\n    reset: (state) => {\n      state.value = 0;\n    },\n  },\n});\n\n// Экспортируем action creators (создаются автоматически)\nexport const { increment, decrement, incrementByAmount, setStep, reset } =\n  counterSlice.actions;\n\n// Экспортируем reducer\nexport default counterSlice.reducer;\n\n// Автоматически создаются action types:\n// "counter/increment", "counter/decrement", etc.' }
      ]
    },
    {
      id: 3,
      title: 'configureStore: настройка хранилища',
      type: 'theory',
      content: [
        { type: 'text', value: 'configureStore объединяет reducers из всех slices в единый store. Автоматически добавляет Redux DevTools и полезные middleware.' },
        { type: 'heading', value: 'Настройка store и Provider' },
        { type: 'code', language: 'jsx', value: '// store/index.js\nimport { configureStore } from "@reduxjs/toolkit";\nimport counterReducer from "./counterSlice";\nimport todosReducer from "./todosSlice";\nimport userReducer from "./userSlice";\n\nexport const store = configureStore({\n  reducer: {\n    counter: counterReducer,\n    todos: todosReducer,\n    user: userReducer,\n  },\n  // devTools: true по умолчанию в разработке\n});\n\n// Тип всего состояния (для TypeScript)\nexport type RootState = ReturnType<typeof store.getState>;\nexport type AppDispatch = typeof store.dispatch;\n\n// main.jsx — оборачиваем приложение в Provider\nimport { Provider } from "react-redux";\nimport { store } from "./store";\n\nReactDOM.createRoot(document.getElementById("root")).render(\n  <Provider store={store}>\n    <App />\n  </Provider>\n);' },
        { type: 'note', value: 'Provider из react-redux делает store доступным всем компонентам через Context "под капотом". Без Provider хуки useSelector и useDispatch работать не будут.' }
      ]
    },
    {
      id: 4,
      title: 'useSelector и useDispatch',
      type: 'theory',
      content: [
        { type: 'text', value: 'useSelector читает данные из store. useDispatch возвращает функцию для отправки actions. Компонент перерендеривается только при изменении выбранных данных.' },
        { type: 'heading', value: 'Подключение компонента к Redux' },
        { type: 'code', language: 'jsx', value: 'import { useSelector, useDispatch } from "react-redux";\nimport { increment, decrement, incrementByAmount, reset } from "./counterSlice";\n\nfunction Counter() {\n  // Выбираем только нужные данные из store\n  const count = useSelector(state => state.counter.value);\n  const step = useSelector(state => state.counter.step);\n  const dispatch = useDispatch();\n\n  return (\n    <div>\n      <h1>Счётчик: {count}</h1>\n      <p>Шаг: {step}</p>\n\n      <button onClick={() => dispatch(increment())}>+{step}</button>\n      <button onClick={() => dispatch(decrement())}>-{step}</button>\n      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>\n      <button onClick={() => dispatch(reset())}>Сбросить</button>\n    </div>\n  );\n}\n\n// Хорошая практика: selector-функции\nconst selectCount = state => state.counter.value;\nconst selectStep = state => state.counter.step;\n\nfunction CounterDisplay() {\n  const count = useSelector(selectCount);\n  return <span>{count}</span>;\n}' },
        { type: 'tip', value: 'Выносите selector-функции за пределы компонента. Это улучшает читаемость и позволяет переиспользовать их в разных компонентах.' }
      ]
    },
    {
      id: 5,
      title: 'createAsyncThunk: асинхронные операции',
      type: 'theory',
      content: [
        { type: 'text', value: 'createAsyncThunk создаёт асинхронный action creator. Автоматически генерирует три action types: pending, fulfilled и rejected.' },
        { type: 'heading', value: 'Загрузка данных с thunk' },
        { type: 'code', language: 'jsx', value: 'import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";\n\n// Асинхронный thunk\nexport const fetchUsers = createAsyncThunk(\n  "users/fetchAll", // Уникальное имя\n  async (_, { rejectWithValue }) => {\n    try {\n      const response = await fetch("/api/users");\n      if (!response.ok) throw new Error("Ошибка сервера");\n      return await response.json(); // Станет action.payload\n    } catch (error) {\n      return rejectWithValue(error.message);\n    }\n  }\n);\n\nconst usersSlice = createSlice({\n  name: "users",\n  initialState: { list: [], loading: false, error: null },\n  reducers: {},\n  // Обрабатываем состояния async thunk\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchUsers.pending, (state) => {\n        state.loading = true;\n        state.error = null;\n      })\n      .addCase(fetchUsers.fulfilled, (state, action) => {\n        state.loading = false;\n        state.list = action.payload;\n      })\n      .addCase(fetchUsers.rejected, (state, action) => {\n        state.loading = false;\n        state.error = action.payload;\n      });\n  },\n});\n\n// Использование в компоненте\nfunction UserList() {\n  const dispatch = useDispatch();\n  const { list, loading, error } = useSelector(state => state.users);\n\n  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);\n\n  if (loading) return <p>Загрузка...</p>;\n  if (error) return <p>Ошибка: {error}</p>;\n  return <ul>{list.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}' }
      ]
    },
    {
      id: 6,
      title: 'Slice для todo-листа: полный пример',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реальный slice для todo-приложения с CRUD операциями. Это демонстрирует типичные паттерны работы с коллекциями в Redux.' },
        { type: 'code', language: 'jsx', value: 'import { createSlice } from "@reduxjs/toolkit";\n\nconst todosSlice = createSlice({\n  name: "todos",\n  initialState: {\n    items: [],\n    filter: "all", // "all" | "active" | "completed"\n  },\n  reducers: {\n    addTodo: (state, action) => {\n      state.items.push({\n        id: Date.now(),\n        text: action.payload,\n        completed: false,\n      });\n    },\n    toggleTodo: (state, action) => {\n      const todo = state.items.find(t => t.id === action.payload);\n      if (todo) todo.completed = !todo.completed;\n    },\n    deleteTodo: (state, action) => {\n      state.items = state.items.filter(t => t.id !== action.payload);\n    },\n    editTodo: (state, action) => {\n      const { id, text } = action.payload;\n      const todo = state.items.find(t => t.id === id);\n      if (todo) todo.text = text;\n    },\n    setFilter: (state, action) => {\n      state.filter = action.payload;\n    },\n    clearCompleted: (state) => {\n      state.items = state.items.filter(t => !t.completed);\n    },\n  },\n});\n\n// Selectors\nexport const selectFilteredTodos = state => {\n  const { items, filter } = state.todos;\n  if (filter === "active") return items.filter(t => !t.completed);\n  if (filter === "completed") return items.filter(t => t.completed);\n  return items;\n};' },
        { type: 'note', value: 'Immer внутри RTK позволяет писать state.items.push(...) вместо [...state.items, newItem]. Код стал намного читаемее при той же иммутабельности.' }
      ]
    },
    {
      id: 7,
      title: 'RTK Query: мощный инструмент для API',
      type: 'theory',
      content: [
        { type: 'text', value: 'RTK Query — встроенный в RTK инструмент для работы с API. Автоматически управляет кешированием, загрузкой и инвалидацией данных.' },
        { type: 'code', language: 'jsx', value: 'import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";\n\n// Определяем API\nexport const postsApi = createApi({\n  reducerPath: "postsApi",\n  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),\n  tagTypes: ["Post"],\n  endpoints: (builder) => ({\n    getPosts: builder.query({\n      query: () => "/posts",\n      providesTags: ["Post"],\n    }),\n    getPostById: builder.query({\n      query: (id) => "/posts/" + id,\n    }),\n    createPost: builder.mutation({\n      query: (body) => ({ url: "/posts", method: "POST", body }),\n      invalidatesTags: ["Post"], // После создания — обновляем список\n    }),\n  }),\n});\n\nexport const { useGetPostsQuery, useGetPostByIdQuery, useCreatePostMutation } = postsApi;\n\n// Использование в компоненте\nfunction Posts() {\n  const { data: posts, isLoading, error } = useGetPostsQuery();\n  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();\n\n  if (isLoading) return <p>Загрузка...</p>;\n  if (error) return <p>Ошибка</p>;\n\n  return (\n    <div>\n      <button onClick={() => createPost({ title: "Новый пост", body: "..." })}\n              disabled={isCreating}>\n        Создать пост\n      </button>\n      <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'RTK Query заменяет createAsyncThunk + extraReducers для большинства API-запросов. Кеширование, дедупликация запросов и инвалидация — из коробки.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Корзина покупок с Redux',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай slice для корзины покупок. Реализуй добавление товаров, изменение количества, удаление и подсчёт итоговой суммы.',
      requirements: [
        'createSlice с именем "cart"',
        'Состояние: items (массив) с полями: id, name, price, quantity',
        'Reducer addToCart: если товар уже есть — увеличивает quantity, иначе добавляет',
        'Reducer removeFromCart(id): удаляет товар',
        'Reducer updateQuantity({ id, quantity }): обновляет quantity (если 0 — удаляет)',
        'Reducer clearCart: очищает корзину',
        'Selector selectTotal: считает итоговую сумму (price * quantity)',
        'Компонент Cart отображает список товаров и итоговую сумму'
      ],
      hint: 'В addToCart используй state.items.find(i => i.id === action.payload.id). Если нашли — item.quantity++. Иначе state.items.push({...action.payload, quantity: 1}).',
      expectedOutput: 'addItem(product) -> добавляет товар или увеличивает количество\nremoveItem(id) -> удаляет товар\nupdateQuantity(id, qty) -> обновляет количество\nclearCart() -> очищает корзину\nselectTotal -> сумма всех товаров\nКоличество товаров отображается в иконке корзины',
      solution: 'import { createSlice } from "@reduxjs/toolkit";\nimport { useSelector, useDispatch } from "react-redux";\n\nconst cartSlice = createSlice({\n  name: "cart",\n  initialState: { items: [] },\n  reducers: {\n    addToCart: (state, action) => {\n      const existing = state.items.find(i => i.id === action.payload.id);\n      if (existing) {\n        existing.quantity++;\n      } else {\n        state.items.push({ ...action.payload, quantity: 1 });\n      }\n    },\n    removeFromCart: (state, action) => {\n      state.items = state.items.filter(i => i.id !== action.payload);\n    },\n    updateQuantity: (state, action) => {\n      const { id, quantity } = action.payload;\n      if (quantity <= 0) {\n        state.items = state.items.filter(i => i.id !== id);\n      } else {\n        const item = state.items.find(i => i.id === id);\n        if (item) item.quantity = quantity;\n      }\n    },\n    clearCart: (state) => {\n      state.items = [];\n    },\n  },\n});\n\nexport const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;\nexport const selectTotal = state =>\n  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);\nexport default cartSlice.reducer;\n\nfunction Cart() {\n  const items = useSelector(state => state.cart.items);\n  const total = useSelector(selectTotal);\n  const dispatch = useDispatch();\n\n  return (\n    <div>\n      <h2>Корзина</h2>\n      {items.map(item => (\n        <div key={item.id}>\n          <span>{item.name} x{item.quantity} = {item.price * item.quantity} тг</span>\n          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>\n          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>\n          <button onClick={() => dispatch(removeFromCart(item.id))}>Удалить</button>\n        </div>\n      ))}\n      <p>Итого: {total} тг</p>\n      <button onClick={() => dispatch(clearCart())}>Очистить</button>\n    </div>\n  );\n}',
      explanation: 'Корзина — классический пример для Redux. Ключевой паттерн в addToCart: ищем существующий товар и увеличиваем quantity, что позволяет избежать дублирования. Immer делает мутации state безопасными.'
    }
  ]
}
