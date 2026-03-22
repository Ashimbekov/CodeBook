export default {
  id: 15,
  title: 'Context API',
  description: 'Context API в React: создание контекста, Provider и Consumer, useContext хук, передача данных без prop drilling, паттерны использования и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Проблема prop drilling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prop drilling — это ситуация, когда пропсы передаются через несколько уровней компонентов только для того, чтобы достичь глубоко вложенного компонента. Это делает код громоздким и трудно поддерживаемым.' },
        { type: 'heading', value: 'Пример prop drilling' },
        { type: 'code', language: 'jsx', value: '// Плохо: user передаётся через несколько уровней\nfunction App() {\n  const user = { name: "Алия", role: "admin" };\n  return <Layout user={user} />;\n}\n\nfunction Layout({ user }) {\n  return <Sidebar user={user} />;\n}\n\nfunction Sidebar({ user }) {\n  return <UserProfile user={user} />;\n}\n\nfunction UserProfile({ user }) {\n  return <div>Привет, {user.name}!</div>;\n}\n// Layout и Sidebar не используют user — только передают дальше' },
        { type: 'tip', value: 'Context решает проблему prop drilling: данные доступны любому компоненту в дереве без явной передачи через каждый уровень.' }
      ]
    },
    {
      id: 2,
      title: 'Создание контекста и Provider',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контекст создаётся с помощью React.createContext(). Provider оборачивает дерево компонентов и предоставляет значение всем потомкам.' },
        { type: 'heading', value: 'Создание и использование контекста' },
        { type: 'code', language: 'jsx', value: 'import { createContext } from "react";\n\n// 1. Создаём контекст с дефолтным значением\nconst UserContext = createContext(null);\n\n// 2. Provider оборачивает дерево\nfunction App() {\n  const user = { name: "Алия", role: "admin" };\n\n  return (\n    <UserContext.Provider value={user}>\n      <Layout />\n    </UserContext.Provider>\n  );\n}\n\n// Layout и Sidebar больше не получают user как пропс!\nfunction Layout() {\n  return <Sidebar />;\n}\n\nfunction Sidebar() {\n  return <UserProfile />;\n}' },
        { type: 'note', value: 'Дефолтное значение createContext(null) используется только если компонент рендерится вне Provider. На практике всегда оборачивайте дерево в Provider.' }
      ]
    },
    {
      id: 3,
      title: 'Хук useContext',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хук useContext позволяет функциональным компонентам читать значение из ближайшего Provider в дереве.' },
        { type: 'heading', value: 'useContext в действии' },
        { type: 'code', language: 'jsx', value: 'import { createContext, useContext } from "react";\n\nconst UserContext = createContext(null);\n\nfunction UserProfile() {\n  // Получаем значение из контекста напрямую!\n  const user = useContext(UserContext);\n\n  if (!user) return <p>Пользователь не найден</p>;\n\n  return (\n    <div>\n      <h2>Профиль: {user.name}</h2>\n      <p>Роль: {user.role}</p>\n    </div>\n  );\n}\n\n// Компонент автоматически перерендеривается\n// при изменении значения в Provider' },
        { type: 'tip', value: 'useContext принимает объект контекста (результат createContext), а не Provider или Consumer. Частая ошибка: передать UserContext.Provider вместо UserContext.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн: кастомный хук для контекста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рекомендуемый паттерн — создавать кастомный хук для каждого контекста. Это улучшает читаемость и позволяет добавить проверку на наличие Provider.' },
        { type: 'heading', value: 'Создание кастомного хука' },
        { type: 'code', language: 'jsx', value: 'import { createContext, useContext, useState } from "react";\n\n// contexts/ThemeContext.jsx\nconst ThemeContext = createContext(null);\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("light");\n\n  const toggleTheme = () => {\n    setTheme(prev => prev === "light" ? "dark" : "light");\n  };\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\n// Кастомный хук с проверкой\nexport function useTheme() {\n  const context = useContext(ThemeContext);\n  if (!context) {\n    throw new Error("useTheme должен использоваться внутри ThemeProvider");\n  }\n  return context;\n}\n\n// Использование\nfunction Header() {\n  const { theme, toggleTheme } = useTheme();\n  return (\n    <header className={theme}>\n      <button onClick={toggleTheme}>Сменить тему</button>\n    </header>\n  );\n}' },
        { type: 'note', value: 'Этот паттерн — стандарт в индустрии. Он инкапсулирует логику контекста и даёт понятные сообщения об ошибках при неправильном использовании.' }
      ]
    },
    {
      id: 5,
      title: 'Несколько контекстов и вложенность',
      type: 'theory',
      content: [
        { type: 'text', value: 'В приложении может быть несколько независимых контекстов. Их Provider-ы просто вкладываются друг в друга.' },
        { type: 'heading', value: 'Несколько Provider-ов' },
        { type: 'code', language: 'jsx', value: 'function App() {\n  return (\n    <AuthProvider>\n      <ThemeProvider>\n        <LanguageProvider>\n          <Router>\n            <AppContent />\n          </Router>\n        </LanguageProvider>\n      </ThemeProvider>\n    </AuthProvider>\n  );\n}\n\n// Компонент использует несколько контекстов\nfunction UserSettings() {\n  const { user } = useAuth();\n  const { theme, toggleTheme } = useTheme();\n  const { language, setLanguage } = useLanguage();\n\n  return (\n    <div>\n      <p>Пользователь: {user.name}</p>\n      <p>Тема: {theme}</p>\n      <p>Язык: {language}</p>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'Если Provider-ов слишком много, создайте компонент AppProviders который их все объединяет. Это упростит корневой App компонент.' }
      ]
    },
    {
      id: 6,
      title: 'Оптимизация: предотвращение лишних ререндеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда значение контекста меняется, все компоненты использующие useContext перерендериваются. Важно правильно мемоизировать значение Provider-а.' },
        { type: 'heading', value: 'Мемоизация значения контекста' },
        { type: 'code', language: 'jsx', value: 'import { createContext, useContext, useState, useMemo, useCallback } from "react";\n\nconst CartContext = createContext(null);\n\nexport function CartProvider({ children }) {\n  const [items, setItems] = useState([]);\n\n  // useMemo: пересоздаём объект только при изменении items\n  const addItem = useCallback((item) => {\n    setItems(prev => [...prev, item]);\n  }, []);\n\n  const removeItem = useCallback((id) => {\n    setItems(prev => prev.filter(i => i.id !== id));\n  }, []);\n\n  const value = useMemo(() => ({\n    items,\n    addItem,\n    removeItem,\n    total: items.reduce((sum, item) => sum + item.price, 0)\n  }), [items, addItem, removeItem]);\n\n  return (\n    <CartContext.Provider value={value}>\n      {children}\n    </CartContext.Provider>\n  );\n}' },
        { type: 'warning', value: 'Без useMemo: при каждом рендере App создаётся новый объект value, что вызывает ререндер ВСЕХ потребителей контекста, даже если данные не изменились.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Context для авторизации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему авторизации с использованием Context API. AuthProvider должен хранить состояние пользователя и предоставлять методы login и logout.',
      requirements: [
        'Создай AuthContext с помощью createContext',
        'AuthProvider хранит состояние: user (объект или null) и isAuthenticated (boolean)',
        'Метод login(credentials) устанавливает user и isAuthenticated = true',
        'Метод logout() очищает user и isAuthenticated = false',
        'Хук useAuth() с проверкой на наличие Provider',
        'Компонент LoginForm использует useAuth для вызова login',
        'Компонент UserMenu показывает имя пользователя и кнопку выхода'
      ],
      hint: 'Используй паттерн кастомного хука. Начни с createContext(null), затем создай AuthProvider с useState для user, и экспортируй useAuth с проверкой context !== null.',
      solution: 'import { createContext, useContext, useState } from "react";\n\nconst AuthContext = createContext(null);\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n\n  const login = (credentials) => {\n    // Симуляция авторизации\n    setUser({ name: credentials.username, email: credentials.username + "@mail.ru" });\n  };\n\n  const logout = () => setUser(null);\n\n  return (\n    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\nexport function useAuth() {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error("useAuth должен быть внутри AuthProvider");\n  return context;\n}\n\nfunction LoginForm() {\n  const { login } = useAuth();\n  return (\n    <button onClick={() => login({ username: "alice" })}>Войти</button>\n  );\n}\n\nfunction UserMenu() {\n  const { user, logout } = useAuth();\n  return (\n    <div>\n      <span>Привет, {user.name}!</span>\n      <button onClick={logout}>Выйти</button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <AuthProvider>\n      <AppContent />\n    </AuthProvider>\n  );\n}\n\nfunction AppContent() {\n  const { isAuthenticated } = useAuth();\n  return isAuthenticated ? <UserMenu /> : <LoginForm />;\n}',
      explanation: 'Context API идеально подходит для глобального состояния авторизации. Кастомный хук useAuth инкапсулирует логику и защищает от использования вне Provider.'
    }
  ]
}
