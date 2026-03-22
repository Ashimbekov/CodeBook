export default {
  id: 8,
  title: 'Условный рендеринг',
  description: 'Паттерны условного рендеринга: if, тернарный оператор, &&, switch, компоненты состояний загрузки и пустых экранов',
  lessons: [
    {
      id: 1,
      title: 'Паттерны условного рендеринга',
      type: 'theory',
      content: [
        { type: 'text', value: 'В JSX нельзя использовать if напрямую — только выражения. Есть несколько паттернов условного рендеринга для разных ситуаций.' },
        { type: 'heading', value: 'Все паттерны' },
        { type: 'code', language: 'jsx', value: 'function ConditionalExamples({ isLoggedIn, role, data, isLoading }) {\n  // 1. if перед return (самый читаемый для сложных условий)\n  if (isLoading) return <Spinner />;\n  if (!data)     return <EmptyState />;\n\n  return (\n    <div>\n      {/* 2. Тернарный оператор: A или B */}\n      {isLoggedIn ? <UserMenu /> : <LoginButton />}\n\n      {/* 3. && : показать только если true */}\n      {isLoggedIn && <Notifications />}\n\n      {/* 4. || : значение по умолчанию */}\n      <p>{data.description || "Описание отсутствует"}</p>\n\n      {/* 5. ?? : только для null/undefined */}\n      <p>{data.count ?? 0} элементов</p>\n\n      {/* 6. IIFE для сложной логики в JSX */}\n      {(() => {\n        if (role === "admin")   return <AdminPanel />;\n        if (role === "manager") return <ManagerPanel />;\n        return <UserPanel />;\n      })()}\n    </div>\n  );\n}' },
        { type: 'tip', value: 'IIFE в JSX ((() => { ... })()) — крайняя мера. Лучше вынести логику в переменную или отдельный компонент. Читаемость важнее краткости.' }
      ]
    },
    {
      id: 2,
      title: 'Паттерны загрузки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Загрузка данных — самый частый сценарий условного рендеринга. Нужно показывать три состояния: загрузка, ошибка, данные.' },
        { type: 'heading', value: 'Три состояния данных' },
        { type: 'code', language: 'jsx', value: 'import { useState, useEffect } from "react";\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    setLoading(true);\n    setError(null);\n    fetch(`/api/users/${userId}`)\n      .then(r => r.json())\n      .then(data => { setUser(data); setLoading(false); })\n      .catch(err => { setError(err.message); setLoading(false); });\n  }, [userId]);\n\n  // Паттерн: ранние возвраты\n  if (loading) return <Skeleton />;\n  if (error)   return <ErrorMessage message={error} onRetry={() => setLoading(true)} />;\n  if (!user)   return <EmptyState message="Пользователь не найден" />;\n\n  // Основной рендер — только когда всё хорошо\n  return (\n    <div>\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Skeleton Loading' },
        { type: 'code', language: 'jsx', value: 'function Skeleton() {\n  const pulseStyle = {\n    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",\n    backgroundSize: "200% 100%",\n    animation: "pulse 1.5s infinite",\n    borderRadius: "4px",\n  };\n  return (\n    <div style={{ padding: "1rem" }}>\n      {/* Анимированные заглушки */}\n      <div style={{ ...pulseStyle, width: "60%", height: "24px", marginBottom: "12px" }} />\n      <div style={{ ...pulseStyle, width: "100%", height: "16px", marginBottom: "8px" }} />\n      <div style={{ ...pulseStyle, width: "80%", height: "16px" }} />\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 3,
      title: 'Пустые состояния (Empty States)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пустые состояния — важная часть UX. Список без элементов, результаты поиска без совпадений — всегда показывайте понятное сообщение.' },
        { type: 'heading', value: 'Компонент EmptyState' },
        { type: 'code', language: 'jsx', value: 'function EmptyState({ icon = "📭", title, description, action }) {\n  return (\n    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#6b7280" }}>\n      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{icon}</div>\n      <h3 style={{ color: "#374151", marginBottom: "0.5rem" }}>{title}</h3>\n      {description && <p style={{ marginBottom: "1.5rem" }}>{description}</p>}\n      {action}\n    </div>\n  );\n}\n\n// Использование в разных сценариях:\nfunction TodoList({ todos }) {\n  if (todos.length === 0) {\n    return (\n      <EmptyState\n        icon="✅"\n        title="Нет задач"\n        description="Создайте первую задачу чтобы начать"\n        action={<button onClick={() => {/* открыть форму */}}>Создать задачу</button>}\n      />\n    );\n  }\n  return <ul>{todos.map(t => <TodoItem key={t.id} todo={t} />)}</ul>;\n}\n\nfunction SearchResults({ results, query }) {\n  if (results.length === 0 && query) {\n    return (\n      <EmptyState\n        icon="🔍"\n        title={`Ничего не найдено по "${query}"`}\n        description="Попробуйте другой запрос или проверьте написание"\n      />\n    );\n  }\n  return <ResultList results={results} />;\n}' }
      ]
    },
    {
      id: 4,
      title: 'Рендеринг на основе ролей и прав',
      type: 'theory',
      content: [
        { type: 'text', value: 'Показывать UI элементы в зависимости от роли пользователя — частый кейс. Компоненты-guards делают это декларативным.' },
        { type: 'heading', value: 'Role-based rendering' },
        { type: 'code', language: 'jsx', value: '// Компонент-guard\nfunction CanAccess({ requiredRole, userRole, fallback = null, children }) {\n  const roles = { admin: 3, manager: 2, user: 1 };\n  const hasAccess = (roles[userRole] || 0) >= (roles[requiredRole] || 0);\n  return hasAccess ? children : fallback;\n}\n\n// Хук для авторизации\nfunction useAuth() {\n  return { user: { name: "Алиса", role: "manager" } };\n}\n\nfunction Dashboard() {\n  const { user } = useAuth();\n\n  return (\n    <div>\n      <h1>Панель управления</h1>\n\n      {/* Всем */}\n      <p>Добро пожаловать, {user.name}</p>\n\n      {/* Только менеджерам и выше */}\n      <CanAccess requiredRole="manager" userRole={user.role}>\n        <ReportsSection />\n      </CanAccess>\n\n      {/* Только администраторам */}\n      <CanAccess\n        requiredRole="admin"\n        userRole={user.role}\n        fallback={<p>Нет доступа к настройкам</p>}\n      >\n        <AdminSettings />\n      </CanAccess>\n    </div>\n  );\n}' }
      ]
    },
    {
      id: 5,
      title: 'Оптимизация условного рендеринга',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ложный 0 в && — частая ошибка. Переиспользуемые компоненты состояний убирают дублирование. Вынос условий в переменные улучшает читаемость.' },
        { type: 'heading', value: 'Типичные ошибки и решения' },
        { type: 'code', language: 'jsx', value: '// ОШИБКА: 0 рендерит как "0"!\nconst count = 0;\n{count && <Badge>{count}</Badge>} // Рендерит "0" в DOM!\n\n// РЕШЕНИЕ: явная проверка\n{count > 0 && <Badge>{count}</Badge>}\n{!!count && <Badge>{count}</Badge>}\n{count !== 0 && <Badge>{count}</Badge>}\n\n// ПЛОХО: сложные условия в JSX\n{\n  isLoading ? (\n    <Spinner />\n  ) : error ? (\n    <Error message={error} />\n  ) : data ? (\n    <DataView data={data} />\n  ) : (\n    <EmptyState />\n  )\n}\n\n// ХОРОШО: вынести в переменную или функцию\nconst renderContent = () => {\n  if (isLoading) return <Spinner />;\n  if (error)     return <Error message={error} />;\n  if (data)      return <DataView data={data} />;\n  return <EmptyState />;\n};\n\nreturn <div>{renderContent()}</div>;' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Страница с состояниями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте компонент UserList который показывает разные состояния: загрузка (skeleton), ошибка, пустой список, список с данными и фильтрацию.',
      requirements: [
        'Состояния: loading, error, empty (нет пользователей), filtered empty (фильтр без результатов)',
        'Skeleton — 3 анимированных заглушки',
        'Error с кнопкой "Повторить"',
        'Поиск по имени — если нет результатов — empty state с запросом',
        'Кнопки для симуляции состояний (загрузка/ошибка/пустой/с данными)'
      ],
      hint: 'Используйте switch или последовательные if для выбора состояния. Skeleton можно сделать через Array(3).fill(null).map(). Поиск фильтрует массив users.',
      expectedOutput: 'Состояние loading: скелетон из 3 карточек-заглушек\nСостояние error: сообщение об ошибке с кнопкой "Повторить"\nСостояние empty: иллюстрация и текст "Пользователи не найдены"\nСостояние success: список пользовательских карточек',
      solution: 'import { useState } from "react";\n\nfunction SkeletonRow() {\n  const s = { background: "#f0f0f0", borderRadius: "4px", height: "16px" };\n  return (\n    <div style={{ display: "flex", gap: "1rem", padding: "12px", borderBottom: "1px solid #f0f0f0" }}>\n      <div style={{ ...s, width: "40px", borderRadius: "50%", height: "40px" }} />\n      <div style={{ flex: 1 }}>\n        <div style={{ ...s, width: "40%", marginBottom: "8px" }} />\n        <div style={{ ...s, width: "70%" }} />\n      </div>\n    </div>\n  );\n}\n\nfunction EmptyState({ icon, title, description }) {\n  return (\n    <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>\n      <div style={{ fontSize: "3rem" }}>{icon}</div>\n      <h3 style={{ color: "#374151" }}>{title}</h3>\n      {description && <p>{description}</p>}\n    </div>\n  );\n}\n\nconst MOCK_USERS = [\n  { id: 1, name: "Алиса Иванова", email: "alice@test.com", role: "admin" },\n  { id: 2, name: "Боб Петров",    email: "bob@test.com",   role: "user" },\n  { id: 3, name: "Вера Сидорова", email: "vera@test.com",  role: "user" },\n];\n\nfunction UserList() {\n  const [mode, setMode]   = useState("data"); // loading | error | empty | data\n  const [search, setSearch] = useState("");\n\n  const filtered = MOCK_USERS.filter(u =>\n    u.name.toLowerCase().includes(search.toLowerCase())\n  );\n\n  const renderContent = () => {\n    if (mode === "loading") {\n      return Array(3).fill(null).map((_, i) => <SkeletonRow key={i} />);\n    }\n    if (mode === "error") {\n      return (\n        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>\n          <p>Ошибка загрузки данных</p>\n          <button onClick={() => setMode("data")}>Повторить</button>\n        </div>\n      );\n    }\n    if (mode === "empty") {\n      return <EmptyState icon="👥" title="Нет пользователей" description="Добавьте первого пользователя" />;\n    }\n    if (filtered.length === 0 && search) {\n      return <EmptyState icon="🔍" title={`Ничего не найдено по "${search}"`} description="Попробуйте другой запрос" />;\n    }\n    return filtered.map(user => (\n      <div key={user.id} style={{ display: "flex", gap: "1rem", padding: "12px", borderBottom: "1px solid #f0f0f0", alignItems: "center" }}>\n        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>\n          {user.name.charAt(0)}\n        </div>\n        <div>\n          <div style={{ fontWeight: "600" }}>{user.name}</div>\n          <div style={{ color: "#6b7280", fontSize: "14px" }}>{user.email}</div>\n        </div>\n        <span style={{ marginLeft: "auto", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "999px", fontSize: "12px" }}>{user.role}</span>\n      </div>\n    ));\n  };\n\n  return (\n    <div style={{ maxWidth: "500px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>\n      <div style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>\n        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>\n          {["loading", "error", "empty", "data"].map(m => (\n            <button key={m} onClick={() => setMode(m)}\n              style={{ padding: "4px 8px", background: mode === m ? "#3b82f6" : "#f3f4f6", color: mode === m ? "white" : "#374151", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>\n              {m}\n            </button>\n          ))}\n        </div>\n        {mode === "data" && (\n          <input\n            value={search}\n            onChange={e => setSearch(e.target.value)}\n            placeholder="Поиск по имени..."\n            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px" }}\n          />\n        )}\n      </div>\n      <div>{renderContent()}</div>\n    </div>\n  );\n}\nexport default UserList;',
      explanation: 'renderContent() — вынесенная функция для выбора состояния, делает JSX чистым. Последовательные if для приоритетов: загрузка > ошибка > пустой > данные > фильтр. Array(3).fill(null).map() — быстрый способ рендерить N скелетонов. Кнопки симуляции состояний — удобно для разработки и тестирования.'
    }
  ]
}
