export default {
  id: 25,
  title: 'Best Practices',
  description: 'Лучшие практики React-разработки: структура проекта, производительность, доступность, обработка ошибок, TypeScript интеграция и подготовка к production.',
  lessons: [
    {
      id: 1,
      title: 'Структура проекта: feature-based подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура проекта критична для масштабируемости. Feature-based структура группирует связанные файлы вместе по функциональности, а не по типу файла.' },
        { type: 'heading', value: 'Рекомендуемая структура' },
        { type: 'code', language: 'jsx', value: '// src/\n// ├── features/               <- Фичи приложения\n// │   ├── auth/\n// │   │   ├── components/     <- AuthForm, LoginButton\n// │   │   ├── hooks/          <- useAuth, useLogin\n// │   │   ├── store/          <- authSlice.js (Redux)\n// │   │   ├── services/       <- authApi.js\n// │   │   └── index.js        <- Публичный API фичи\n// │   ├── products/\n// │   └── cart/\n// ├── components/             <- Переиспользуемые UI компоненты\n// │   ├── ui/                 <- Button, Input, Modal\n// │   └── layout/             <- Header, Footer, Sidebar\n// ├── hooks/                  <- Глобальные хуки\n// ├── utils/                  <- Утилиты, хелперы\n// ├── types/                  <- TypeScript типы (если используется)\n// ├── store/                  <- Конфигурация Redux\n// └── app.jsx                 <- Корневой компонент\n\n// Принцип: импортируй только через index.js фичи\n// Хорошо: import { AuthForm } from "@/features/auth"\n// Плохо: import AuthForm from "@/features/auth/components/AuthForm"' },
        { type: 'tip', value: 'Правило "barrel exports": каждая фича экспортирует только публичный API через index.js. Внутренняя структура может меняться без изменения импортов.' }
      ]
    },
    {
      id: 2,
      title: 'Производительность: memo, useMemo, useCallback',
      type: 'theory',
      content: [
        { type: 'text', value: 'Преждевременная оптимизация — зло. Сначала измерь (React DevTools Profiler), потом оптимизируй. Но знать инструменты важно.' },
        { type: 'code', language: 'jsx', value: 'import { memo, useMemo, useCallback, useState } from "react";\n\n// React.memo: предотвращает ререндер если пропсы не изменились\nconst ExpensiveList = memo(function ExpensiveList({ items, onSelect }) {\n  console.log("ExpensiveList render"); // Должен логировать редко\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id} onClick={() => onSelect(item)}>{item.name}</li>\n      ))}\n    </ul>\n  );\n});\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [items] = useState([{ id: 1, name: "Элемент 1" }]);\n\n  // useMemo: мемоизация вычисления\n  const sortedItems = useMemo(() => {\n    console.log("Сортировка..."); // Выполняется только при изменении items\n    return [...items].sort((a, b) => a.name.localeCompare(b.name));\n  }, [items]);\n\n  // useCallback: мемоизация функции\n  // Без useCallback — новая функция при каждом ререндере App\n  // Это сломает React.memo на ExpensiveList!\n  const handleSelect = useCallback((item) => {\n    console.log("Выбран:", item.name);\n  }, []); // Пустой массив — функция создаётся один раз\n\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>\n      {/* ExpensiveList НЕ ререндерится при изменении count */}\n      <ExpensiveList items={sortedItems} onSelect={handleSelect} />\n    </div>\n  );\n}' },
        { type: 'warning', value: 'memo + useCallback — связка. Если передать функцию без useCallback в memo-компонент, мемоизация не работает (новая функция = новый пропс). Используй оба вместе.' }
      ]
    },
    {
      id: 3,
      title: 'Обработка ошибок: Error Boundaries',
      type: 'theory',
      content: [
        { type: 'text', value: 'Error Boundary — React-компонент который перехватывает JavaScript-ошибки в дочернем дереве и показывает UI запасного варианта вместо краша приложения.' },
        { type: 'code', language: 'jsx', value: 'import { Component } from "react";\n\n// Error Boundary — только классовый компонент!\nclass ErrorBoundary extends Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false, error: null };\n  }\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error, errorInfo) {\n    // Логируем в Sentry / другой сервис мониторинга\n    console.error("Error caught:", error, errorInfo);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return (\n        <div style={{ padding: "20px", textAlign: "center" }}>\n          <h2>Что-то пошло не так</h2>\n          <p>{this.state.error?.message}</p>\n          <button onClick={() => this.setState({ hasError: false, error: null })}>\n            Попробовать снова\n          </button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}\n\n// Использование: обёртка вокруг "рискованных" компонентов\nfunction App() {\n  return (\n    <ErrorBoundary>\n      <Dashboard />\n    </ErrorBoundary>\n  );\n}\n\n// Альтернатива: react-error-boundary (npm install react-error-boundary)\nimport { ErrorBoundary } from "react-error-boundary";\nfunction FallbackUI({ error, resetErrorBoundary }) {\n  return <button onClick={resetErrorBoundary}>Перезагрузить: {error.message}</button>;\n}\n<ErrorBoundary FallbackComponent={FallbackUI}><App /></ErrorBoundary>' }
      ]
    },
    {
      id: 4,
      title: 'Доступность (Accessibility / a11y)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Доступность — это разработка для всех пользователей, включая людей с ограниченными возможностями. В React это означает правильное использование семантики HTML и ARIA-атрибутов.' },
        { type: 'code', language: 'jsx', value: 'function AccessibleForm() {\n  const [error, setError] = React.useState("");\n\n  return (\n    <form>\n      {/* Связывай label с input через htmlFor/id */}\n      <label htmlFor="email">Email <span aria-hidden="true">*</span></label>\n      <input\n        id="email"\n        type="email"\n        required\n        aria-required="true"\n        aria-describedby={error ? "email-error" : undefined}\n        aria-invalid={!!error}\n      />\n      {error && (\n        <span id="email-error" role="alert" style={{ color: "red" }}>\n          {error}\n        </span>\n      )}\n\n      {/* Кнопки без текста — добавляй aria-label */}\n      <button type="button" aria-label="Закрыть форму">\n        ✕\n      </button>\n\n      {/* Иконки — скрывай от screen reader */}\n      <button type="submit">\n        <span aria-hidden="true">💾</span>\n        Сохранить\n      </button>\n\n      {/* Loading state */}\n      <div role="status" aria-live="polite">\n        {isLoading && "Загрузка..."}\n      </div>\n    </form>\n  );\n}' },
        { type: 'list', value: ['Всегда используй семантические HTML-теги: button, nav, main, article', 'Связывай label с input через htmlFor/id', 'Добавляй aria-label для элементов без текста', 'Не убирай outline у focused элементов — важно для клавиатурной навигации', 'Проверяй доступность: axe DevTools, Lighthouse, NVDA screen reader'] }
      ]
    },
    {
      id: 5,
      title: 'TypeScript в React: базовые паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript добавляет статическую типизацию в React. Это помогает ловить ошибки на этапе компиляции и улучшает IDE автодополнение.' },
        { type: 'code', language: 'jsx', value: '// Типизация пропсов\ntype ButtonProps = {\n  children: React.ReactNode;\n  variant?: "primary" | "secondary" | "danger";\n  size?: "sm" | "md" | "lg";\n  disabled?: boolean;\n  onClick?: () => void;\n};\n\nfunction Button({ children, variant = "primary", size = "md", disabled, onClick }: ButtonProps) {\n  return <button className={variant + " " + size} disabled={disabled} onClick={onClick}>{children}</button>;\n}\n\n// Типизация useState\nconst [user, setUser] = React.useState<User | null>(null);\nconst [count, setCount] = React.useState<number>(0);\n\n// Типизация useRef\nconst inputRef = React.useRef<HTMLInputElement>(null);\n\n// Типизация обработчиков событий\nconst handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setValue(e.target.value);\n};\nconst handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n  e.preventDefault();\n};\nconst handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {\n  console.log(e.target);\n};\n\n// Интерфейс для API данных\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}' }
      ]
    },
    {
      id: 6,
      title: 'Code splitting и lazy loading',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code splitting разделяет bundle на части, которые загружаются по необходимости. React.lazy + Suspense позволяет лениво загружать компоненты.' },
        { type: 'code', language: 'jsx', value: 'import { lazy, Suspense } from "react";\n\n// Лениво загружаемые компоненты (разные chunks в сборке)\nconst Dashboard = lazy(() => import("./pages/Dashboard"));\nconst Settings = lazy(() => import("./pages/Settings"));\nconst Analytics = lazy(() => import("./pages/Analytics"));\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      {/* Suspense обязателен вокруг lazy компонентов */}\n      <Suspense fallback={<div>Загрузка страницы...</div>}>\n        <Routes>\n          <Route path="/dashboard" element={<Dashboard />} />\n          <Route path="/settings" element={<Settings />} />\n          <Route path="/analytics" element={<Analytics />} />\n        </Routes>\n      </Suspense>\n    </BrowserRouter>\n  );\n}\n\n// Предзагрузка при наведении (prefetch)\nconst handleMouseEnter = () => {\n  // Начинаем загрузку до клика!\n  import("./pages/Dashboard");\n};\n\n// Разные Suspense fallback для разных уровней\nfunction Layout() {\n  return (\n    <Suspense fallback={<HeaderSkeleton />}>\n      <Header />\n    </Suspense>\n  );\n}' },
        { type: 'note', value: 'Анализируй размер bundle через npm run build и vite-bundle-visualizer. Ищи зависимости которые занимают больше 50KB — возможно их стоит загружать лениво.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: рефакторинг компонента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепиши компонент UserDashboard применяя best practices: разбей на меньшие компоненты, добавь мемоизацию, обработку ошибок и правильный TypeScript.',
      requirements: [
        'Разбей большой компонент на: UserHeader, UserStats, UserActivity — каждый в отдельном файле',
        'UserStats получает массив stats и мемоизирован через React.memo',
        'Вычисление totalRevenue вынеси в useMemo',
        'Коллбэки (onFilter, onSort) обёрни в useCallback',
        'ErrorBoundary вокруг UserActivity (может падать)',
        'Proper TypeScript типы для всех пропсов',
        'Семантический HTML: section, article, h2 заголовки'
      ],
      hint: 'Начни с определения TypeScript интерфейсов. Потом создай маленькие компоненты. Последним добавь мемоизацию там где компоненты получают объекты/функции как пропсы.',
      solution: '// types.ts\ninterface User { id: number; name: string; email: string; }\ninterface Stat { label: string; value: number | string; }\n\n// UserHeader.tsx\nfunction UserHeader({ user }: { user: User }) {\n  return (\n    <header>\n      <h1>{user.name}</h1>\n      <p>{user.email}</p>\n    </header>\n  );\n}\n\n// UserStats.tsx\nconst UserStats = React.memo(function UserStats({ stats }: { stats: Stat[] }) {\n  return (\n    <section aria-label="Статистика">\n      <h2>Статистика</h2>\n      {stats.map(stat => (\n        <article key={stat.label}>\n          <dt>{stat.label}</dt>\n          <dd>{stat.value}</dd>\n        </article>\n      ))}\n    </section>\n  );\n});\n\n// UserDashboard.tsx\nfunction UserDashboard({ user, activities, stats }: DashboardProps) {\n  const totalRevenue = React.useMemo(() =>\n    stats.filter(s => s.type === "revenue").reduce((sum, s) => sum + Number(s.value), 0)\n  , [stats]);\n\n  const handleFilter = React.useCallback((filter: string) => {\n    console.log("Фильтр:", filter);\n  }, []);\n\n  return (\n    <main>\n      <UserHeader user={user} />\n      <p>Общий доход: {totalRevenue}</p>\n      <UserStats stats={stats} />\n      <ErrorBoundary>\n        <UserActivity activities={activities} onFilter={handleFilter} />\n      </ErrorBoundary>\n    </main>\n  );\n}',
      explanation: 'Best practices это не отдельные правила, а система. Разбивка на компоненты + TypeScript + мемоизация + ErrorBoundary вместе создают поддерживаемый и производительный код.'
    }
  ]
}
