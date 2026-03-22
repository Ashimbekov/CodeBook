export default {
  id: 9,
  title: 'Списки и ключи',
  description: 'Рендеринг списков через map, key prop, почему ключи важны, антипаттерны и работа с вложенными списками',
  lessons: [
    {
      id: 1,
      title: 'Рендеринг списков через map',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для рендеринга списков в React используется Array.map() — он возвращает массив JSX элементов. Каждый элемент должен иметь уникальный ключ key.' },
        { type: 'heading', value: 'Базовый рендеринг списков' },
        { type: 'code', language: 'jsx', value: 'function ShoppingList({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>\n          {item.name} — {item.price} руб.\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// Вынесенный компонент (лучший подход)\nfunction ShoppingItem({ item }) {\n  return (\n    <li>\n      <span>{item.name}</span>\n      <span>{item.price} руб.</span>\n    </li>\n  );\n}\n\nfunction ShoppingListV2({ items }) {\n  return (\n    <ul>\n      {items.map(item => (\n        <ShoppingItem key={item.id} item={item} />\n        // key на компоненте, не на li!\n      ))}\n    </ul>\n  );\n}' },
        { type: 'note', value: 'key — специальный prop, он НЕ передаётся в компонент. Если нужен id внутри — передайте явно: <Item key={item.id} id={item.id} item={item} />' }
      ]
    },
    {
      id: 2,
      title: 'Почему ключи важны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Key помогает React понять, какой элемент изменился, добавился или удалился. Без key (или с плохим key) React перерендерит весь список вместо одного элемента.' },
        { type: 'heading', value: 'Как React использует key' },
        { type: 'code', language: 'jsx', value: '// БЕЗ key (или key=index) — React не понимает что изменилось\n// Список: [А, Б, В]\n// Добавляем Г В НАЧАЛО: [Г, А, Б, В]\n// React перерендерит ВСЕ элементы, т.к. key=0,1,2,3 изменились!\n\n// С правильным key — React видит: добавился Г (новый key), А,Б,В переместились\nconst todos = [\n  { id: "abc", text: "Купить молоко" },\n  { id: "def", text: "Позвонить маме" },\n];\n\n// ПРАВИЛЬНО\n{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}\n\n// ПРОБЛЕМА с key=index:\n// [А(0), Б(1), В(2)] -> удаляем А -> [Б(0), В(1)]\n// React видит: А(0) изменился на Б, Б(1) изменился на В, В(2) удалился\n// Вместо: А удалилась, Б и В остались\n// Это вызывает баги с controlled inputs и анимациями!' },
        { type: 'tip', value: 'Хорошие ключи: id из базы данных, уникальный идентификатор. Плохие ключи: index массива (если список меняется), Math.random() (создаёт новый key каждый рендер). Используйте index только если список статичен!' }
      ]
    },
    {
      id: 3,
      title: 'Фильтрация и трансформация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перед map можно цепочкой добавить filter, sort, slice. Это позволяет отображать отфильтрованные и отсортированные данные без изменения исходного массива.' },
        { type: 'heading', value: 'Цепочки методов' },
        { type: 'code', language: 'jsx', value: 'function UserList({ users, searchQuery, roleFilter, sortBy }) {\n  const processedUsers = users\n    .filter(user => {\n      if (roleFilter && user.role !== roleFilter) return false;\n      if (searchQuery) {\n        const q = searchQuery.toLowerCase();\n        return user.name.toLowerCase().includes(q) ||\n               user.email.toLowerCase().includes(q);\n      }\n      return true;\n    })\n    .sort((a, b) => {\n      if (sortBy === "name")  return a.name.localeCompare(b.name);\n      if (sortBy === "email") return a.email.localeCompare(b.email);\n      return 0;\n    })\n    .slice(0, 20); // Максимум 20 элементов\n\n  if (processedUsers.length === 0) {\n    return <p>Нет пользователей по вашему запросу</p>;\n  }\n\n  return (\n    <ul>\n      {processedUsers.map(user => (\n        <li key={user.id}>{user.name} — {user.email}</li>\n      ))}\n    </ul>\n  );\n}' }
      ]
    },
    {
      id: 4,
      title: 'Вложенные списки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вложенные структуры данных требуют вложенных map. Ключи должны быть уникальны на каждом уровне — не глобально, а среди элементов одного родителя.' },
        { type: 'heading', value: 'Рендеринг вложенных данных' },
        { type: 'code', language: 'jsx', value: 'function CategoryList({ categories }) {\n  // categories = [\n  //   { id: 1, name: "Электроника", products: [\n  //     { id: 1, name: "Ноутбук" },\n  //     { id: 2, name: "Телефон" }\n  //   ]},\n  //   ...\n  // ]\n\n  return (\n    <div>\n      {categories.map(category => (\n        <section key={category.id}> {/* key среди секций */}\n          <h2>{category.name}</h2>\n          <ul>\n            {category.products.map(product => (\n              <li key={product.id}> {/* key среди li этой секции */}\n                {product.name}\n              </li>\n              // product.id=1 может совпадать в разных категориях — OK!\n              // key нужен уникальный только среди siblings\n            ))}\n          </ul>\n        </section>\n      ))}\n    </div>\n  );\n}\n\n// Рекурсивное дерево\nfunction TreeNode({ node }) {\n  return (\n    <li>\n      {node.name}\n      {node.children && node.children.length > 0 && (\n        <ul>\n          {node.children.map(child => (\n            <TreeNode key={child.id} node={child} />\n          ))}\n        </ul>\n      )}\n    </li>\n  );\n}' }
      ]
    },
    {
      id: 5,
      title: 'Виртуализация длинных списков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рендеринг тысяч элементов — проблема производительности. Виртуализация рендерит только видимые элементы. Библиотека react-window решает это просто.' },
        { type: 'heading', value: 'Когда нужна виртуализация' },
        { type: 'code', language: 'jsx', value: '// БЕЗ виртуализации — 10 000 элементов в DOM (медленно!)\nfunction SlowList({ items }) {\n  return (\n    <ul style={{ height: "400px", overflow: "auto" }}>\n      {items.map(item => <li key={item.id}>{item.name}</li>)}\n    </ul>\n  );\n}\n\n// С виртуализацией — только ~20 элементов в DOM\n// npm install react-window\nimport { FixedSizeList } from "react-window";\n\nfunction FastList({ items }) {\n  const Row = ({ index, style }) => (\n    <div style={style}> {/* style обязателен для позиционирования! */}\n      {items[index].name}\n    </div>\n  );\n\n  return (\n    <FixedSizeList\n      height={400}    // Высота контейнера\n      itemCount={items.length}\n      itemSize={50}   // Высота одного элемента\n      width="100%"\n    >\n      {Row}\n    </FixedSizeList>\n  );\n}' },
        { type: 'note', value: 'Виртуализация нужна при > 100-200 элементах в DOM. Для меньшего количества обычный map работает отлично. Pagination (постраничность) — альтернатива виртуализации.' }
      ]
    },
    {
      id: 6,
      title: 'Drag and Drop списки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перетаскивание элементов списка — распространённая задача. HTML5 Drag and Drop API + React state позволяет реализовать базовую сортировку без библиотек.' },
        { type: 'heading', value: 'Простой Drag and Drop' },
        { type: 'code', language: 'jsx', value: 'import { useState, useRef } from "react";\n\nfunction DraggableList({ initialItems }) {\n  const [items, setItems] = useState(initialItems);\n  const dragItem = useRef(null);\n  const dragOver  = useRef(null);\n\n  const handleDragStart = (index) => {\n    dragItem.current = index;\n  };\n\n  const handleDragEnter = (index) => {\n    dragOver.current = index;\n  };\n\n  const handleDragEnd = () => {\n    const newItems = [...items];\n    const dragged = newItems.splice(dragItem.current, 1)[0];\n    newItems.splice(dragOver.current, 0, dragged);\n    dragItem.current = null;\n    dragOver.current = null;\n    setItems(newItems);\n  };\n\n  return (\n    <ul style={{ listStyle: "none", padding: 0 }}>\n      {items.map((item, index) => (\n        <li\n          key={item.id}\n          draggable\n          onDragStart={() => handleDragStart(index)}\n          onDragEnter={() => handleDragEnter(index)}\n          onDragEnd={handleDragEnd}\n          onDragOver={(e) => e.preventDefault()}\n          style={{ padding: "12px", border: "1px solid #e5e7eb", marginBottom: "4px", cursor: "grab", background: "white" }}\n        >\n          ☰ {item.name}\n        </li>\n      ))}\n    </ul>\n  );\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Менеджер задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте менеджер задач с категориями, фильтрацией, сортировкой и правильными ключами.',
      requirements: [
        'Данные: массив задач с id, title, category, priority, completed',
        'Фильтр по категории и статусу (все/активные/выполненные)',
        'Сортировка по приоритету или дате',
        'Добавление новой задачи через форму',
        'Переключение статуса задачи',
        'Счётчик задач по категориям'
      ],
      hint: 'Используйте .filter().sort().map() цепочку. Для добавления: setTasks(prev => [...prev, { id: Date.now(), ...newTask }]). Переключение: map с условием по id.',
      expectedOutput: 'Задачи отображаются с фильтрацией по категориям\nФильтр "Все" / "Активные" / "Завершённые"\nСортировка по дате / приоритету\nДобавление новой задачи через форму\nКаждая задача имеет уникальный key\nУдаление задачи обновляет список',
      solution: 'import { useState, useMemo } from "react";\n\nconst CATEGORIES = ["работа", "личное", "учёба"];\nconst PRIORITIES  = { high: 3, medium: 2, low: 1 };\n\nfunction TodoManager() {\n  const [tasks, setTasks] = useState([\n    { id: 1, title: "Написать отчёт",    category: "работа",  priority: "high",   completed: false },\n    { id: 2, title: "Купить продукты",   category: "личное",  priority: "medium", completed: true  },\n    { id: 3, title: "Изучить React",     category: "учёба",   priority: "high",   completed: false },\n    { id: 4, title: "Позвонить клиенту", category: "работа",  priority: "low",    completed: false },\n  ]);\n\n  const [newTitle,     setNewTitle]     = useState("");\n  const [newCategory,  setNewCategory]  = useState("работа");\n  const [newPriority,  setNewPriority]  = useState("medium");\n  const [filterCat,    setFilterCat]    = useState("все");\n  const [filterStatus, setFilterStatus] = useState("все");\n  const [sortBy,       setSortBy]       = useState("priority");\n\n  const addTask = (e) => {\n    e.preventDefault();\n    if (!newTitle.trim()) return;\n    setTasks(prev => [...prev, { id: Date.now(), title: newTitle.trim(), category: newCategory, priority: newPriority, completed: false }]);\n    setNewTitle("");\n  };\n\n  const toggleTask = (id) =>\n    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));\n\n  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));\n\n  const filtered = useMemo(() => tasks\n    .filter(t => filterCat    === "все" || t.category === filterCat)\n    .filter(t => filterStatus === "все" || (filterStatus === "active" ? !t.completed : t.completed))\n    .sort((a, b) => sortBy === "priority" ? PRIORITIES[b.priority] - PRIORITIES[a.priority] : b.id - a.id),\n    [tasks, filterCat, filterStatus, sortBy]\n  );\n\n  const counts = CATEGORIES.reduce((acc, cat) => ({\n    ...acc, [cat]: tasks.filter(t => t.category === cat && !t.completed).length\n  }), {});\n\n  const priorityColor = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };\n\n  return (\n    <div style={{ maxWidth: "600px", padding: "1rem" }}>\n      <h2>Задачи</h2>\n      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>\n        {CATEGORIES.map(cat => (\n          <span key={cat} style={{ background: "#dbeafe", padding: "4px 8px", borderRadius: "999px", fontSize: "12px" }}>\n            {cat}: {counts[cat]}\n          </span>\n        ))}\n      </div>\n      <form onSubmit={addTask} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>\n        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Новая задача" style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "6px" }} />\n        <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ padding: "8px" }}>\n          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}\n        </select>\n        <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ padding: "8px" }}>\n          <option value="high">Высокий</option>\n          <option value="medium">Средний</option>\n          <option value="low">Низкий</option>\n        </select>\n        <button type="submit" style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px" }}>+</button>\n      </form>\n      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>\n        {["все", ...CATEGORIES].map(c => (\n          <button key={c} onClick={() => setFilterCat(c)}\n            style={{ padding: "4px 10px", background: filterCat === c ? "#3b82f6" : "#f3f4f6", color: filterCat === c ? "white" : "#374151", border: "none", borderRadius: "4px", cursor: "pointer" }}>\n            {c}\n          </button>\n        ))}\n        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginLeft: "auto", padding: "4px 8px" }}>\n          <option value="priority">По приоритету</option>\n          <option value="date">По дате</option>\n        </select>\n      </div>\n      {filtered.length === 0 ? (\n        <p style={{ color: "#6b7280", textAlign: "center" }}>Нет задач</p>\n      ) : (\n        filtered.map(task => (\n          <div key={task.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "4px", opacity: task.completed ? 0.6 : 1 }}>\n            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />\n            <span style={{ flex: 1, textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</span>\n            <span style={{ fontSize: "12px", background: "#f3f4f6", padding: "2px 8px", borderRadius: "999px" }}>{task.category}</span>\n            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: priorityColor[task.priority] }} />\n            <button onClick={() => deleteTask(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>✕</button>\n          </div>\n        ))\n      )}\n    </div>\n  );\n}\nexport default TodoManager;',
      explanation: 'useMemo кэширует filtered — не пересчитывается без изменения зависимостей. Цепочка filter().filter().sort() — стандартный паттерн. Счётчик через reduce — O(n) за один проход. key={task.id} — стабильный ключ из данных, не index. priorityColor — объект-маппинг вместо if/switch.'
    }
  ]
}
