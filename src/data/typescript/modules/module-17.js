export default {
  id: 17,
  title: 'TypeScript с React',
  description: 'TypeScript в React проектах: типизация компонентов, props, hooks, событий, Context API и generic компоненты',
  lessons: [
    {
      id: 1,
      title: 'Настройка TypeScript + React проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript и React отлично работают вместе. Vite — быстрейший способ создать TypeScript + React проект. Используйте расширение .tsx для файлов с JSX.' },
        { type: 'heading', value: 'Создание проекта' },
        { type: 'code', language: 'typescript', value: '// Создание проекта через Vite:\n// npm create vite@latest my-app -- --template react-ts\n// cd my-app && npm install && npm run dev\n\n// Структура tsconfig.json для React:\n// {\n//   "compilerOptions": {\n//     "target": "ES2020",\n//     "lib": ["ES2020", "DOM", "DOM.Iterable"],\n//     "module": "ESNext",\n//     "moduleResolution": "bundler",\n//     "jsx": "react-jsx",  // <- важно для React 17+\n//     "strict": true,\n//     "noUnusedLocals": true\n//   }\n// }\n\n// Файлы:\n// .ts  — TypeScript без JSX\n// .tsx — TypeScript с JSX (компоненты, хуки с JSX)' },
        { type: 'heading', value: 'Первый типизированный компонент' },
        { type: 'code', language: 'typescript', value: '// Greeting.tsx\nimport React from "react";\n\n// Тип пропсов\ninterface GreetingProps {\n  name: string;\n  age?: number; // необязательный\n}\n\n// Функциональный компонент\nfunction Greeting({ name, age }: GreetingProps) {\n  return (\n    <div>\n      <h1>Привет, {name}!</h1>\n      {age && <p>Возраст: {age}</p>}\n    </div>\n  );\n}\n\nexport default Greeting;\n\n// Использование — TypeScript проверяет пропсы!\n// <Greeting name="Алиса" age={25} />  <- OK\n// <Greeting />                         <- Ошибка: name обязателен\n// <Greeting name={42} />               <- Ошибка: ждём string' },
        { type: 'note', value: 'В React 18+ не нужно явно импортировать React в каждом .tsx файле при использовании new JSX transform (jsx: "react-jsx" в tsconfig). Но ещё нужен для хуков: import { useState } from "react".' }
      ]
    },
    {
      id: 2,
      title: 'Типизация Props',
      type: 'theory',
      content: [
        { type: 'text', value: 'Props — главный способ передачи данных в React. TypeScript делает props полностью типобезопасными: IDE подсказывает доступные props, компилятор ловит ошибки.' },
        { type: 'heading', value: 'Разные виды пропсов' },
        { type: 'code', language: 'typescript', value: 'import { ReactNode, CSSProperties } from "react";\n\ninterface ButtonProps {\n  // Примитивы\n  label: string;\n  disabled?: boolean;\n  count?: number;\n\n  // Union типы\n  variant: "primary" | "secondary" | "danger";\n  size?: "small" | "medium" | "large";\n\n  // Функции\n  onClick: () => void;\n  onHover?: (e: MouseEvent) => void;\n\n  // React дочерние элементы\n  children?: ReactNode;\n\n  // Стили\n  style?: CSSProperties;\n  className?: string;\n}\n\nfunction Button({\n  label,\n  variant,\n  size = "medium",\n  disabled = false,\n  onClick,\n  children\n}: ButtonProps) {\n  return (\n    <button\n      disabled={disabled}\n      className={`btn btn-${variant} btn-${size}`}\n      onClick={onClick}\n    >\n      {children || label}\n    </button>\n  );\n}' },
        { type: 'heading', value: 'Передача HTML атрибутов через extends' },
        { type: 'code', language: 'typescript', value: 'import { ButtonHTMLAttributes } from "react";\n\n// Расширяем нативные атрибуты кнопки\ninterface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "primary" | "secondary";\n  loading?: boolean;\n}\n\nfunction MyButton({ variant = "primary", loading, children, ...rest }: MyButtonProps) {\n  return (\n    <button\n      {...rest} // Все нативные атрибуты (type, disabled, aria-*, ...)\n      className={`btn-${variant} ${loading ? "loading" : ""}`}\n    >\n      {loading ? "Загрузка..." : children}\n    </button>\n  );\n}\n\n// Теперь работает всё нативное:\n// <MyButton type="submit" aria-label="Отправить" form="myForm">' },
        { type: 'tip', value: 'Для компонентов-обёрток используйте extends HTMLAttributes<HTMLElement> или ComponentPropsWithoutRef<"button">. Это даёт все нативные атрибуты плюс ваши кастомные.' }
      ]
    },
    {
      id: 3,
      title: 'Типизация useState и useReducer',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript автоматически выводит тип useState из начального значения. Но для сложных типов (null, union, объекты) лучше явно указывать generic параметр.' },
        { type: 'heading', value: 'useState с TypeScript' },
        { type: 'code', language: 'typescript', value: 'import { useState } from "react";\n\n// TypeScript выводит тип автоматически\nconst [count, setCount] = useState(0); // number\nconst [name, setName]   = useState(""); // string\n\n// Явный generic для null/undefined вариантов\ninterface User { id: number; name: string; }\n\nconst [user, setUser] = useState<User | null>(null);\nconst [items, setItems] = useState<string[]>([]);\nconst [error, setError] = useState<Error | null>(null);\n\n// Обновление объекта с spread\nconst [form, setForm] = useState({ name: "", email: "" });\n\nfunction handleChange(field: "name" | "email", value: string) {\n  setForm(prev => ({ ...prev, [field]: value }));\n}\n\n// Ленивая инициализация\nconst [list, setList] = useState<number[]>(() => {\n  const saved = localStorage.getItem("list");\n  return saved ? JSON.parse(saved) : [];\n});' },
        { type: 'heading', value: 'useReducer с TypeScript' },
        { type: 'code', language: 'typescript', value: 'import { useReducer } from "react";\n\n// Discriminated union для actions\ntype Action =\n  | { type: "INCREMENT" }\n  | { type: "DECREMENT" }\n  | { type: "RESET" }\n  | { type: "SET"; payload: number };\n\ninterface State { count: number; history: number[]; }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case "INCREMENT":\n      return { count: state.count + 1, history: [...state.history, state.count + 1] };\n    case "DECREMENT":\n      return { count: state.count - 1, history: [...state.history, state.count - 1] };\n    case "RESET":\n      return { count: 0, history: [] };\n    case "SET":\n      return { count: action.payload, history: [...state.history, action.payload] };\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0, history: [] });\n\n  return (\n    <div>\n      <p>Счёт: {state.count}</p>\n      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>\n      <button onClick={() => dispatch({ type: "SET", payload: 10 })}>Установить 10</button>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 4,
      title: 'Типизация событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'В React события — это синтетические объекты, обёртки над нативными DOM событиями. TypeScript предоставляет типы для каждого вида события. Правильная типизация даёт доступ к e.target, e.currentTarget и другим полям.' },
        { type: 'heading', value: 'Основные типы событий' },
        { type: 'code', language: 'typescript', value: 'import { ChangeEvent, MouseEvent, FormEvent, KeyboardEvent } from "react";\n\nfunction EventExamples() {\n  // Изменение input\n  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {\n    console.log(e.target.value); // string\n    console.log(e.target.checked); // boolean (для checkbox)\n  };\n\n  // Изменение select\n  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {\n    console.log(e.target.value);\n  };\n\n  // Клик мыши\n  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {\n    console.log(e.clientX, e.clientY);\n    e.preventDefault();\n  };\n\n  // Отправка формы\n  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    const form = e.currentTarget;\n    // form: HTMLFormElement — доступ к нативному DOM\n  };\n\n  // Клавиатура\n  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {\n    if (e.key === "Enter" && e.ctrlKey) {\n      console.log("Ctrl+Enter нажат");\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input onChange={handleChange} onKeyDown={handleKey} />\n      <button onClick={handleClick}>Отправить</button>\n    </form>\n  );\n}' },
        { type: 'tip', value: 'Сокращённый способ: вместо явного типа можно использовать inline — TypeScript выведет тип автоматически: onChange={(e) => ...}. Но явная типизация полезна при выносе обработчиков в отдельные функции.' }
      ]
    },
    {
      id: 5,
      title: 'Типизация useRef и useCallback',
      type: 'theory',
      content: [
        { type: 'text', value: 'useRef в React используется двумя способами: ссылка на DOM элемент и мутируемое значение. TypeScript требует явного generic параметра.' },
        { type: 'heading', value: 'useRef для DOM' },
        { type: 'code', language: 'typescript', value: 'import { useRef, useEffect, useCallback } from "react";\n\nfunction VideoPlayer() {\n  // Ссылка на DOM — начальное значение null, generic = HTMLVideoElement\n  const videoRef = useRef<HTMLVideoElement>(null);\n\n  const play = useCallback(() => {\n    // current может быть null — нужна проверка!\n    videoRef.current?.play();\n  }, []);\n\n  const pause = useCallback(() => {\n    videoRef.current?.pause();\n  }, []);\n\n  useEffect(() => {\n    const video = videoRef.current;\n    if (!video) return;\n\n    video.volume = 0.5; // HTMLVideoElement API с полным intellisense\n\n    return () => { video.pause(); };\n  }, []);\n\n  return (\n    <div>\n      <video ref={videoRef} src="/video.mp4" />\n      <button onClick={play}>▶</button>\n      <button onClick={pause}>⏸</button>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'useRef как мутируемое значение' },
        { type: 'code', language: 'typescript', value: 'import { useRef, useEffect } from "react";\n\nfunction Timer() {\n  // Мутируемое значение — не null, generic явный\n  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);\n  const countRef  = useRef<number>(0);\n\n  const start = () => {\n    timerRef.current = setInterval(() => {\n      countRef.current += 1;\n      console.log("Тик:", countRef.current);\n    }, 1000);\n  };\n\n  const stop = () => {\n    if (timerRef.current) {\n      clearInterval(timerRef.current);\n      timerRef.current = null;\n    }\n  };\n\n  useEffect(() => () => stop(), []); // Очищаем при размонтировании\n\n  return <button onClick={start}>Старт</button>;\n}' }
      ]
    },
    {
      id: 6,
      title: 'Context API с TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Context API позволяет передавать данные через дерево компонентов без явной передачи props. TypeScript обеспечивает типобезопасность контекста.' },
        { type: 'heading', value: 'Типизированный контекст' },
        { type: 'code', language: 'typescript', value: 'import { createContext, useContext, useState, ReactNode } from "react";\n\ninterface Theme { mode: "light" | "dark"; color: string; }\n\ninterface ThemeContextType {\n  theme: Theme;\n  toggleMode: () => void;\n  setColor: (color: string) => void;\n}\n\n// Создаём контекст с undefined как дефолт\nconst ThemeContext = createContext<ThemeContextType | undefined>(undefined);\n\n// Кастомный хук с проверкой\nexport function useTheme(): ThemeContextType {\n  const ctx = useContext(ThemeContext);\n  if (!ctx) throw new Error("useTheme должен использоваться внутри ThemeProvider");\n  return ctx;\n}\n\n// Провайдер\nexport function ThemeProvider({ children }: { children: ReactNode }) {\n  const [theme, setTheme] = useState<Theme>({ mode: "light", color: "#007bff" });\n\n  const toggleMode = () =>\n    setTheme(t => ({ ...t, mode: t.mode === "light" ? "dark" : "light" }));\n  const setColor = (color: string) =>\n    setTheme(t => ({ ...t, color }));\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleMode, setColor }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\n// Использование\nfunction Header() {\n  const { theme, toggleMode } = useTheme();\n  return (\n    <header style={{ background: theme.mode === "dark" ? "#333" : "#fff" }}>\n      <button onClick={toggleMode}>Сменить тему</button>\n    </header>\n  );\n}' }
      ]
    },
    {
      id: 7,
      title: 'Generic компоненты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generic компоненты — компоненты с type параметрами. Позволяют создавать переиспользуемые компоненты (списки, таблицы, формы), которые работают с любым типом данных, сохраняя типобезопасность.' },
        { type: 'heading', value: 'Generic List компонент' },
        { type: 'code', language: 'typescript', value: 'interface ListProps<T> {\n  items: T[];\n  renderItem: (item: T, index: number) => ReactNode;\n  keyExtractor: (item: T) => string | number;\n  emptyMessage?: string;\n}\n\n// Generic компонент — <T,> запятая нужна в .tsx, иначе путается с JSX\nfunction List<T>({ items, renderItem, keyExtractor, emptyMessage = "Пусто" }: ListProps<T>) {\n  if (items.length === 0) return <p>{emptyMessage}</p>;\n\n  return (\n    <ul>\n      {items.map((item, index) => (\n        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>\n      ))}\n    </ul>\n  );\n}\n\n// Использование — TypeScript выводит T автоматически!\ninterface User { id: number; name: string; email: string; }\ninterface Product { id: number; title: string; price: number; }\n\n// List<User>\n<List\n  items={users}\n  keyExtractor={u => u.id}\n  renderItem={u => <span>{u.name}</span>}\n/>\n\n// List<Product>\n<List\n  items={products}\n  keyExtractor={p => p.id}\n  renderItem={p => <span>{p.title} — {p.price}руб.</span>}\n/>' },
        { type: 'tip', value: 'Запятая в <T,> — особенность .tsx файлов. TypeScript парсер без запятой думает, что T — это JSX тег. Альтернатива: <T extends unknown> или <T extends object>.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Типизированный список задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте типизированный компонент TodoList с полными типами для всех props, событий, useState и кастомного хука useTodos.',
      requirements: [
        'Интерфейс Todo: id, text, completed, createdAt (Date)',
        'Хук useTodos(): возвращает todos, addTodo, toggleTodo, deleteTodo',
        'Компонент TodoItem с пропсами: todo: Todo, onToggle, onDelete',
        'Компонент TodoList использует useTodos и рендерит TodoItem',
        'Обработчик ChangeEvent<HTMLInputElement> для инпута',
        'Все типы явные — никаких any'
      ],
      hint: 'useTodos хранит состояние через useState<Todo[]>. addTodo принимает string и создаёт новый Todo с Date.now() как id. toggleTodo меняет completed через map.',
      solution: 'import { useState, useCallback, ChangeEvent, FormEvent } from "react";\n\ninterface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n  createdAt: Date;\n}\n\nfunction useTodos() {\n  const [todos, setTodos] = useState<Todo[]>([]);\n\n  const addTodo = useCallback((text: string) => {\n    if (!text.trim()) return;\n    setTodos(prev => [\n      ...prev,\n      { id: Date.now(), text: text.trim(), completed: false, createdAt: new Date() }\n    ]);\n  }, []);\n\n  const toggleTodo = useCallback((id: number) => {\n    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));\n  }, []);\n\n  const deleteTodo = useCallback((id: number) => {\n    setTodos(prev => prev.filter(t => t.id !== id));\n  }, []);\n\n  return { todos, addTodo, toggleTodo, deleteTodo };\n}\n\ninterface TodoItemProps {\n  todo: Todo;\n  onToggle: (id: number) => void;\n  onDelete: (id: number) => void;\n}\n\nfunction TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {\n  return (\n    <li>\n      <input\n        type="checkbox"\n        checked={todo.completed}\n        onChange={() => onToggle(todo.id)}\n      />\n      <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>\n        {todo.text}\n      </span>\n      <button onClick={() => onDelete(todo.id)}>Удалить</button>\n    </li>\n  );\n}\n\nexport function TodoList() {\n  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();\n  const [input, setInput] = useState("");\n\n  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {\n    setInput(e.target.value);\n  };\n\n  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {\n    e.preventDefault();\n    addTodo(input);\n    setInput("");\n  };\n\n  return (\n    <div>\n      <form onSubmit={handleSubmit}>\n        <input value={input} onChange={handleChange} placeholder="Новая задача" />\n        <button type="submit">Добавить</button>\n      </form>\n      <p>Задач: {todos.length}, выполнено: {todos.filter(t => t.completed).length}</p>\n      <ul>\n        {todos.map(todo => (\n          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />\n        ))}\n      </ul>\n    </div>\n  );\n}',
      explanation: 'Хук useTodos инкапсулирует всю логику с полной типизацией. useCallback с явными типами параметров. TodoItem получает строго типизированные пропсы. FormEvent и ChangeEvent с generic типом элемента дают доступ к e.target с правильным типом.'
    }
  ]
}
