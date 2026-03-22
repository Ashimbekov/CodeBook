export default {
  id: 6,
  title: 'useState',
  description: 'Хук useState: объявление состояния, обновление, функциональные обновления, ленивая инициализация и работа с объектами',
  lessons: [
    {
      id: 1,
      title: 'Что такое состояние (state)',
      type: 'theory',
      content: [
        { type: 'text', value: 'State (состояние) — данные компонента, которые могут меняться со временем. В отличие от props, state управляется самим компонентом. При изменении state React перерендеривает компонент.' },
        { type: 'heading', value: 'Props vs State' },
        { type: 'code', language: 'jsx', value: '// Props — данные от родителя, только для чтения\n// State — данные компонента, он сам их меняет\n\nfunction Counter({ initialCount = 0 }) { // initialCount — prop\n  const [count, setCount] = React.useState(initialCount); // count — state\n\n  return (\n    <div>\n      <p>Счёт: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(count - 1)}>-1</button>\n      <button onClick={() => setCount(0)}>Сброс</button>\n    </div>\n  );\n}\n\n// Каждый экземпляр Counter имеет СВОЁ состояние!\n<Counter initialCount={0} />  // count: 0\n<Counter initialCount={10} /> // count: 10 — независимо!' },
        { type: 'tip', value: 'Спросите себя: "Если это изменится, должен ли компонент перерендериться?". Да → state. Нет → обычная переменная или ref. Минимизируйте state — выводите данные из него.' }
      ]
    },
    {
      id: 2,
      title: 'Синтаксис useState',
      type: 'theory',
      content: [
        { type: 'text', value: 'useState возвращает массив из двух элементов: текущее значение и функцию для его обновления. Деструктуризация массива — стандартный паттерн.' },
        { type: 'heading', value: 'Разбор синтаксиса' },
        { type: 'code', language: 'jsx', value: 'import { useState } from "react";\n\nfunction Examples() {\n  // [значение, функция_обновления] = useState(начальное_значение)\n  const [count, setCount] = useState(0);           // число\n  const [name, setName]   = useState("Алиса");     // строка\n  const [isOpen, setIsOpen] = useState(false);     // булево\n  const [items, setItems] = useState([]);           // массив\n  const [user, setUser]   = useState(null);         // null/объект\n  const [error, setError] = useState(undefined);   // undefined\n\n  // Называйте: [нечто, setНечто] — соглашение React\n\n  // Обновление\n  const increment = () => setCount(count + 1);\n  const updateName = () => setName("Боб");\n  const toggleMenu = () => setIsOpen(!isOpen);\n\n  return (\n    <div>\n      <p>{count} | {name} | {isOpen ? "открыто" : "закрыто"}</p>\n      <button onClick={increment}>+1</button>\n      <button onClick={updateName}>Сменить имя</button>\n      <button onClick={toggleMenu}>Переключить меню</button>\n    </div>\n  );\n}' },
        { type: 'note', value: 'useState — это хук. Хуки можно вызывать ТОЛЬКО на верхнем уровне функции компонента или кастомного хука. Нельзя в условиях, циклах, вложенных функциях.' }
      ]
    },
    {
      id: 3,
      title: 'Функциональное обновление состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда новое состояние зависит от предыдущего, используйте функциональное обновление: setCount(prev => prev + 1). Это безопаснее, чем setCount(count + 1).' },
        { type: 'heading', value: 'Почему функциональное обновление лучше' },
        { type: 'code', language: 'jsx', value: 'function Counter() {\n  const [count, setCount] = useState(0);\n\n  // ПРОБЛЕМА: state обновляется асинхронно!\n  const addThreeWrong = () => {\n    setCount(count + 1); // count всегда 0 в этом рендере!\n    setCount(count + 1); // Всё ещё 0 + 1 = 1\n    setCount(count + 1); // Всё ещё 0 + 1 = 1\n    // Результат: count = 1, не 3!\n  };\n\n  // РЕШЕНИЕ: функциональное обновление\n  const addThreeCorrect = () => {\n    setCount(prev => prev + 1); // prev = 0, новый = 1\n    setCount(prev => prev + 1); // prev = 1, новый = 2\n    setCount(prev => prev + 1); // prev = 2, новый = 3\n    // Результат: count = 3!\n  };\n\n  // Правило: если новое значение зависит от старого — используй (prev => ...)\n  const toggle = () => setIsOpen(prev => !prev);\n  const addItem = (item) => setItems(prev => [...prev, item]);\n  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));\n\n  return <button onClick={addThreeCorrect}>+3 (правильно: {count})</button>;\n}' }
      ]
    },
    {
      id: 4,
      title: 'Состояние объектов и массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'При обновлении объектов и массивов в state нужно создавать НОВЫЙ объект/массив. React сравнивает по ссылке — если ссылка не изменилась, перерендера не будет.' },
        { type: 'heading', value: 'Обновление объектов' },
        { type: 'code', language: 'jsx', value: 'function ProfileForm() {\n  const [form, setForm] = useState({\n    name: "",\n    email: "",\n    age: 0,\n    address: { city: "", country: "" }\n  });\n\n  // Обновление одного поля через spread\n  const handleChange = (field, value) => {\n    setForm(prev => ({ ...prev, [field]: value }));\n  };\n\n  // Обновление вложенного объекта\n  const handleAddressChange = (field, value) => {\n    setForm(prev => ({\n      ...prev,\n      address: { ...prev.address, [field]: value }\n    }));\n  };\n\n  // НЕЛЬЗЯ: прямая мутация\n  // form.name = "Алиса"; setForm(form); // Ссылка та же -> нет перерендера!\n\n  return (\n    <form>\n      <input value={form.name} onChange={e => handleChange("name", e.target.value)} />\n      <input value={form.email} onChange={e => handleChange("email", e.target.value)} />\n      <input value={form.address.city} onChange={e => handleAddressChange("city", e.target.value)} />\n    </form>\n  );\n}' },
        { type: 'heading', value: 'Обновление массивов' },
        { type: 'code', language: 'jsx', value: 'function TodoList() {\n  const [todos, setTodos] = useState([]);\n\n  // ДОБАВИТЬ — spread + новый элемент\n  const add = (text) => setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);\n\n  // УДАЛИТЬ — filter (не включает удалённый)\n  const remove = (id) => setTodos(prev => prev.filter(t => t.id !== id));\n\n  // ОБНОВИТЬ — map (заменяет нужный элемент)\n  const toggle = (id) => setTodos(prev =>\n    prev.map(t => t.id === id ? { ...t, done: !t.done } : t)\n  );\n\n  // НЕЛЬЗЯ: мутирующие методы!\n  // todos.push(item);    // Мутация!\n  // todos.splice(idx, 1); // Мутация!\n  // todos[0].done = true; // Мутация!\n}' }
      ]
    },
    {
      id: 5,
      title: 'Ленивая инициализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если начальное значение вычисляется дорого (парсинг localStorage, сложные вычисления), передайте функцию в useState. Она вызовется только один раз при монтировании.' },
        { type: 'heading', value: 'Lazy Initial State' },
        { type: 'code', language: 'jsx', value: '// БЕЗ ленивой инициализации — вычисляется КАЖДЫЙ рендер!\nfunction App() {\n  const [data, setData] = useState(expensiveComputation()); // Вызывается постоянно!\n  // ...\n}\n\n// С ленивой инициализацией — вычисляется ОДИН РАЗ\nfunction App() {\n  const [data, setData] = useState(() => expensiveComputation()); // Функция!\n  // ...\n}\n\n// Практический пример — читаем localStorage\nfunction useLocalStorage(key, defaultValue) {\n  const [value, setValue] = useState(() => {\n    try {\n      const saved = localStorage.getItem(key);\n      return saved !== null ? JSON.parse(saved) : defaultValue;\n    } catch {\n      return defaultValue;\n    }\n  });\n\n  const update = (newValue) => {\n    setValue(newValue);\n    localStorage.setItem(key, JSON.stringify(newValue));\n  };\n\n  return [value, update];\n}\n\nconst [theme, setTheme] = useLocalStorage("theme", "light");' }
      ]
    },
    {
      id: 6,
      title: 'Несколько состояний vs один объект',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда использовать несколько useState, а когда один объект? Правило: связанные данные объединяйте, независимые — разделяйте.' },
        { type: 'heading', value: 'Разделять или объединять?' },
        { type: 'code', language: 'jsx', value: '// ХОРОШО: независимые переменные — отдельно\nfunction Modal() {\n  const [isOpen, setIsOpen] = useState(false);\n  const [title, setTitle]   = useState("");\n  const [loading, setLoading] = useState(false);\n  // Изменение isOpen не триггерит обновление title и loading\n}\n\n// ХОРОШО: связанные данные формы — вместе\nfunction LoginForm() {\n  const [form, setForm] = useState({ email: "", password: "" });\n  // Обновление: setForm(prev => ({ ...prev, email: newEmail }))\n}\n\n// ПЛОХО: смешиваем несвязанные данные\nfunction BadComponent() {\n  const [state, setState] = useState({\n    isLoading: false,    // Несвязанное\n    userName: "",        // Несвязанное\n    theme: "light",      // Несвязанное\n    sidebarOpen: false   // Несвязанное\n  });\n  // Каждое обновление требует spread всего объекта!\n}' },
        { type: 'tip', value: 'Правило большого пальца: если данные обновляются вместе — один useState. Если обновляются независимо — отдельные useState.' }
      ]
    },
    {
      id: 7,
      title: 'Батчинг обновлений',
      type: 'theory',
      content: [
        { type: 'text', value: 'React батчит (объединяет) несколько вызовов setState в один перерендер. В React 18 это работает везде — включая setTimeout, fetch callbacks и event handlers.' },
        { type: 'heading', value: 'Automatic Batching в React 18' },
        { type: 'code', language: 'jsx', value: 'function App() {\n  const [count, setCount] = useState(0);\n  const [flag, setFlag]   = useState(false);\n\n  // React 18: ОБА обновления в одном рендере\n  const handleClick = () => {\n    setCount(c => c + 1); // Батчится\n    setFlag(f => !f);     // Батчится\n    // Только ОДИН перерендер!\n  };\n\n  // React 18: батчинг даже в setTimeout!\n  setTimeout(() => {\n    setCount(c => c + 1);\n    setFlag(f => !f);\n    // Один перерендер (в React 17 было бы два!)\n  }, 1000);\n\n  // Принудительно выключить батчинг (редко нужно)\n  // import { flushSync } from "react-dom";\n  // flushSync(() => setCount(c => c + 1)); // Немедленный рендер\n}' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Корзина покупок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте корзину покупок с добавлением, удалением, изменением количества и подсчётом итоговой суммы.',
      requirements: [
        'State: массив items { id, name, price, quantity }',
        'addItem(item) — добавляет или увеличивает quantity если уже есть',
        'removeItem(id) — удаляет полностью',
        'updateQuantity(id, qty) — устанавливает количество (min 1)',
        'Подсчёт total: items.reduce(...)',
        'Показывать пустое состояние если нет товаров'
      ],
      hint: 'addItem: найдите item по id через find, если есть — map и увеличьте quantity, если нет — добавьте через spread. total через reduce((sum, item) => sum + item.price * item.quantity, 0).',
      solution: 'import { useState } from "react";\n\nconst PRODUCTS = [\n  { id: 1, name: "Ноутбук", price: 50000 },\n  { id: 2, name: "Мышь",    price: 1500  },\n  { id: 3, name: "Клавиатура", price: 3000 },\n];\n\nfunction Cart() {\n  const [items, setItems] = useState([]);\n\n  const addItem = (product) => {\n    setItems(prev => {\n      const existing = prev.find(i => i.id === product.id);\n      if (existing) {\n        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);\n      }\n      return [...prev, { ...product, quantity: 1 }];\n    });\n  };\n\n  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));\n\n  const updateQuantity = (id, qty) => {\n    if (qty < 1) { removeItem(id); return; }\n    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));\n  };\n\n  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);\n\n  return (\n    <div style={{ padding: "2rem", maxWidth: "600px" }}>\n      <h2>Магазин</h2>\n      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>\n        {PRODUCTS.map(p => (\n          <button key={p.id} onClick={() => addItem(p)}\n            style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>\n            + {p.name}\n          </button>\n        ))}\n      </div>\n\n      <h2>Корзина</h2>\n      {items.length === 0 ? (\n        <p style={{ color: "#6b7280" }}>Корзина пуста</p>\n      ) : (\n        <>\n          {items.map(item => (\n            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "8px" }}>\n              <span style={{ fontWeight: "600" }}>{item.name}</span>\n              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>\n                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>\n                <span>{item.quantity}</span>\n                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>\n                <span style={{ width: "80px", textAlign: "right" }}>{(item.price * item.quantity).toLocaleString()} руб.</span>\n                <button onClick={() => removeItem(item.id)} style={{ color: "#ef4444" }}>✕</button>\n              </div>\n            </div>\n          ))}\n          <div style={{ marginTop: "1rem", fontWeight: "700", fontSize: "1.2rem" }}>\n            Итого: {total.toLocaleString()} руб.\n          </div>\n        </>\n      )}\n    </div>\n  );\n}\n\nexport default Cart;',
      explanation: 'addItem использует функциональное обновление (prev =>) — безопасно при быстрых кликах. find + map или filter — стандартные паттерны для массива в state. reduce для подсчёта total — чистая функция, не state. updateQuantity с qty < 1 вызывает removeItem — интуитивное поведение.'
    }
  ]
}
