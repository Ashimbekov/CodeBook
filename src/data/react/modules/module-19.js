export default {
  id: 19,
  title: 'Zustand',
  description: 'Лёгкое управление состоянием с Zustand: создание хранилища, actions, selectors, middleware devtools, персистентность и сравнение с Redux.',
  lessons: [
    {
      id: 1,
      title: 'Zustand: концепция и преимущества',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zustand — минималистичная библиотека управления состоянием для React. Около 1KB. Не требует Provider, нет boilerplate, прост в изучении.' },
        { type: 'heading', value: 'Создание первого хранилища' },
        { type: 'code', language: 'jsx', value: '// npm install zustand\nimport { create } from "zustand";\n\n// Создаём хранилище — это хук!\nconst useCounterStore = create((set) => ({\n  // Состояние\n  count: 0,\n  step: 1,\n\n  // Actions (в том же объекте!)\n  increment: () => set((state) => ({ count: state.count + state.step })),\n  decrement: () => set((state) => ({ count: state.count - state.step })),\n  reset: () => set({ count: 0 }),\n  setStep: (step) => set({ step }),\n}));\n\n// Использование — без Provider!\nfunction Counter() {\n  const { count, step, increment, decrement, reset } = useCounterStore();\n\n  return (\n    <div>\n      <p>Счётчик: {count} (шаг: {step})</p>\n      <button onClick={increment}>+</button>\n      <button onClick={decrement}>-</button>\n      <button onClick={reset}>Сброс</button>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'В отличие от Redux, не нужно оборачивать приложение в Provider. Хранилище создаётся один раз и импортируется там где нужно.' }
      ]
    },
    {
      id: 2,
      title: 'Селективная подписка для оптимизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию компонент перерендеривается при любом изменении в хранилище. Выбирай только нужные части состояния для оптимизации.' },
        { type: 'code', language: 'jsx', value: 'const useStore = create((set) => ({\n  count: 0,\n  name: "Пользователь",\n  theme: "light",\n  increment: () => set(s => ({ count: s.count + 1 })),\n  setName: (name) => set({ name }),\n}));\n\n// Плохо: компонент ререндерится при изменении theme или name\nfunction CounterBad() {\n  const store = useStore(); // Подписываемся на ВСЁ хранилище\n  return <div>{store.count}</div>;\n}\n\n// Хорошо: перерендер только при изменении count\nfunction CounterGood() {\n  const count = useStore(state => state.count);\n  const increment = useStore(state => state.increment);\n  return <button onClick={increment}>{count}</button>;\n}\n\n// Несколько значений через один selector\nfunction NameAndTheme() {\n  const { name, theme } = useStore(\n    state => ({ name: state.name, theme: state.theme }),\n    // Кастомный comparator для объектов\n    (a, b) => a.name === b.name && a.theme === b.theme\n  );\n  return <p>{name} — {theme}</p>;\n}' },
        { type: 'note', value: 'Для выбора нескольких значений из одного selector используй shallow из zustand/shallow: useStore(selector, shallow). Это предотвращает ненужные ререндеры при создании нового объекта.' }
      ]
    },
    {
      id: 3,
      title: 'Async actions и get внутри store',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zustand поддерживает async actions напрямую. Параметр get() позволяет читать текущее состояние внутри actions.' },
        { type: 'code', language: 'jsx', value: 'import { create } from "zustand";\n\nconst useUsersStore = create((set, get) => ({\n  users: [],\n  loading: false,\n  error: null,\n  selectedId: null,\n\n  // Async action\n  fetchUsers: async () => {\n    set({ loading: true, error: null });\n    try {\n      const res = await fetch("/api/users");\n      const data = await res.json();\n      set({ users: data, loading: false });\n    } catch (err) {\n      set({ error: err.message, loading: false });\n    }\n  },\n\n  selectUser: (id) => set({ selectedId: id }),\n\n  // get() читает текущее состояние\n  getSelectedUser: () => {\n    const { users, selectedId } = get();\n    return users.find(u => u.id === selectedId);\n  },\n\n  // Логика основанная на текущем состоянии\n  toggleUser: (id) => {\n    const { selectedId } = get();\n    set({ selectedId: selectedId === id ? null : id });\n  },\n}));\n\nfunction UserList() {\n  const { users, loading, fetchUsers } = useUsersStore();\n  useEffect(() => { fetchUsers(); }, []);\n  if (loading) return <p>Загрузка...</p>;\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}' }
      ]
    },
    {
      id: 4,
      title: 'Middleware: devtools и persist',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zustand поддерживает middleware. devtools подключает Redux DevTools. persist сохраняет состояние в localStorage.' },
        { type: 'code', language: 'jsx', value: 'import { create } from "zustand";\nimport { devtools, persist } from "zustand/middleware";\n\n// devtools: отображение в Redux DevTools\nconst useStore = create(\n  devtools(\n    (set) => ({\n      count: 0,\n      increment: () => set(\n        (state) => ({ count: state.count + 1 }),\n        false,          // replace: false — мержим, не заменяем\n        "increment"     // Имя action в DevTools\n      ),\n    }),\n    { name: "MyStore" } // Имя в DevTools\n  )\n);\n\n// persist: сохранение в localStorage\nconst useSettingsStore = create(\n  persist(\n    (set) => ({\n      theme: "light",\n      language: "ru",\n      fontSize: 14,\n      setTheme: (theme) => set({ theme }),\n      setLanguage: (lang) => set({ language: lang }),\n    }),\n    {\n      name: "app-settings", // Ключ в localStorage\n      // partialize: сохраняем только нужные поля\n      partialize: (state) => ({ theme: state.theme, language: state.language }),\n    }\n  )\n);\n\n// Комбинирование middleware\nconst useAppStore = create(\n  devtools(\n    persist(\n      (set) => ({ user: null, login: (u) => set({ user: u }) }),\n      { name: "auth" }\n    )\n  )\n);' },
        { type: 'tip', value: 'partialize в persist позволяет сохранять только часть состояния. Например, не стоит сохранять loading или error в localStorage.' }
      ]
    },
    {
      id: 5,
      title: 'Slice паттерн: разделение большого хранилища',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда хранилище растёт, его можно разделить на "слайсы" и объединить. Это улучшает организацию кода.' },
        { type: 'code', language: 'jsx', value: 'import { create } from "zustand";\n\n// Слайс для счётчика\nconst createCounterSlice = (set) => ({\n  count: 0,\n  increment: () => set(s => ({ count: s.count + 1 })),\n  decrement: () => set(s => ({ count: s.count - 1 })),\n});\n\n// Слайс для пользователя\nconst createUserSlice = (set) => ({\n  user: null,\n  setUser: (user) => set({ user }),\n  logout: () => set({ user: null }),\n});\n\n// Объединяем слайсы\nconst useBoundStore = create((set, get) => ({\n  ...createCounterSlice(set, get),\n  ...createUserSlice(set, get),\n}));\n\n// Каждый компонент выбирает нужное\nfunction Header() {\n  const user = useBoundStore(s => s.user);\n  const logout = useBoundStore(s => s.logout);\n  return <button onClick={logout}>{user?.name || "Войти"}</button>;\n}\n\nfunction Counter() {\n  const count = useBoundStore(s => s.count);\n  const increment = useBoundStore(s => s.increment);\n  return <button onClick={increment}>{count}</button>;\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Менеджер задач на Zustand',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай менеджер задач с Zustand. Реализуй хранилище с CRUD операциями для задач и фильтрацию по статусу.',
      requirements: [
        'useTaskStore с create из zustand',
        'Состояние: tasks (массив объектов {id, title, done}), filter ("all"|"active"|"done")',
        'Actions: addTask(title), toggleTask(id), removeTask(id), setFilter(filter)',
        'Derived selector getFilteredTasks используя get()',
        'Компонент TaskList с input для добавления задач',
        'Три кнопки фильтра: Все / Активные / Завершённые',
        'Каждая задача имеет чекбокс и кнопку удаления'
      ],
      hint: 'getFilteredTasks должен быть функцией внутри store: getFilteredTasks: () => { const { tasks, filter } = get(); ... }. В компоненте вызывай useTaskStore(s => s.getFilteredTasks)() или вызывай get() напрямую через хук.',
      expectedOutput: 'useTaskStore() -> { tasks, addTask, removeTask, toggleTask, filterStatus }\nСписок задач обновляется реактивно\nФильтрация: all / active / completed\nЗадача помечается выполненной по клику\nСостояние сохраняется между ре-рендерами',
      solution: 'import { create } from "zustand";\n\nconst useTaskStore = create((set, get) => ({\n  tasks: [],\n  filter: "all",\n\n  addTask: (title) => set(state => ({\n    tasks: [...state.tasks, { id: Date.now(), title, done: false }]\n  })),\n\n  toggleTask: (id) => set(state => ({\n    tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)\n  })),\n\n  removeTask: (id) => set(state => ({\n    tasks: state.tasks.filter(t => t.id !== id)\n  })),\n\n  setFilter: (filter) => set({ filter }),\n\n  getFilteredTasks: () => {\n    const { tasks, filter } = get();\n    if (filter === "active") return tasks.filter(t => !t.done);\n    if (filter === "done") return tasks.filter(t => t.done);\n    return tasks;\n  },\n}));\n\nfunction TaskList() {\n  const [input, setInput] = React.useState("");\n  const { addTask, toggleTask, removeTask, setFilter, filter, getFilteredTasks } = useTaskStore();\n  const filteredTasks = getFilteredTasks();\n\n  const handleAdd = () => {\n    if (input.trim()) { addTask(input.trim()); setInput(""); }\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Новая задача" />\n      <button onClick={handleAdd}>Добавить</button>\n      <div>\n        {["all", "active", "done"].map(f => (\n          <button key={f} onClick={() => setFilter(f)}\n            style={{ fontWeight: filter === f ? "bold" : "normal" }}>\n            {f === "all" ? "Все" : f === "active" ? "Активные" : "Завершённые"}\n          </button>\n        ))}\n      </div>\n      <ul>\n        {filteredTasks.map(task => (\n          <li key={task.id}>\n            <input type="checkbox" checked={task.done}\n              onChange={() => toggleTask(task.id)} />\n            <span style={{ textDecoration: task.done ? "line-through" : "none" }}>{task.title}</span>\n            <button onClick={() => removeTask(task.id)}>X</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}',
      explanation: 'Zustand позволяет создать полноценный менеджер состояния без Provider и сложной настройки. getFilteredTasks как функция в store использует get() для доступа к текущему состоянию — мощный паттерн Zustand.'
    }
  ]
}
