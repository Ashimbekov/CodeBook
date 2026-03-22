export default {
  id: 22,
  title: 'Тестирование (Vitest + RTL)',
  description: 'Тестирование React-приложений: Vitest как тест-раннер, React Testing Library для компонентных тестов, user-event для взаимодействий, моки функций и API.',
  lessons: [
    {
      id: 1,
      title: 'Виды тестов и инструменты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Автоматические тесты — это код, который проверяет другой код. В React-приложениях используют три уровня: юнит-тесты, интеграционные тесты и E2E тесты.' },
        { type: 'heading', value: 'Установка Vitest + RTL' },
        { type: 'code', language: 'jsx', value: '// npm install -D vitest @vitest/ui jsdom\n// npm install -D @testing-library/react @testing-library/user-event\n// npm install -D @testing-library/jest-dom\n\n// vite.config.js\nimport { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n  test: {\n    globals: true,\n    environment: "jsdom",\n    setupFiles: "./src/test/setup.js",\n  },\n});\n\n// src/test/setup.js\nimport "@testing-library/jest-dom";\n// Добавляет матчеры: toBeInTheDocument, toHaveClass, etc.\n\n// package.json scripts:\n// "test": "vitest",\n// "test:ui": "vitest --ui",\n// "test:coverage": "vitest --coverage"' },
        { type: 'list', value: ['Vitest: быстрый тест-раннер на базе Vite, совместим с Jest API', 'React Testing Library (RTL): тестирование компонентов как пользователь', '@testing-library/user-event: симуляция реальных событий пользователя', 'jsdom: эмуляция браузерного DOM в Node.js'] }
      ]
    },
    {
      id: 2,
      title: 'Первый тест: render и query',
      type: 'theory',
      content: [
        { type: 'text', value: 'RTL рендерит компонент и предоставляет методы поиска элементов в DOM. Философия: тестируем как пользователь видит компонент, не внутреннюю реализацию.' },
        { type: 'code', language: 'jsx', value: 'import { render, screen } from "@testing-library/react";\nimport { describe, it, expect } from "vitest";\nimport Greeting from "./Greeting";\n\n// Компонент для тестирования\n// function Greeting({ name }) {\n//   return <h1>Привет, {name}!</h1>;\n// }\n\ndescribe("Greeting компонент", () => {\n  it("показывает имя пользователя", () => {\n    render(<Greeting name="Алия" />);\n\n    // screen.getBy* — бросает ошибку если не найден\n    const heading = screen.getByText("Привет, Алия!");\n    expect(heading).toBeInTheDocument();\n  });\n\n  it("рендерится как h1", () => {\n    render(<Greeting name="Тест" />);\n    const heading = screen.getByRole("heading", { level: 1 });\n    expect(heading).toHaveTextContent("Привет, Тест!");\n  });\n});\n\n// Методы поиска:\n// getBy*   — элемент должен быть, иначе ошибка\n// queryBy* — возвращает null если не найден\n// findBy*  — асинхронный поиск (ждёт появления элемента)\n// *ByRole, *ByText, *ByLabelText, *ByPlaceholderText, *ByTestId' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование взаимодействий с userEvent',
      type: 'theory',
      content: [
        { type: 'text', value: 'userEvent симулирует реальные действия пользователя: клики, набор текста, нажатие клавиш. Это более реалистично чем fireEvent.' },
        { type: 'code', language: 'jsx', value: 'import { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\nimport { describe, it, expect } from "vitest";\nimport Counter from "./Counter";\n\n// function Counter() {\n//   const [count, setCount] = useState(0);\n//   return (\n//     <div>\n//       <p>Счётчик: {count}</p>\n//       <button onClick={() => setCount(c => c + 1)}>Увеличить</button>\n//       <button onClick={() => setCount(c => c - 1)}>Уменьшить</button>\n//     </div>\n//   );\n// }\n\ndescribe("Counter", () => {\n  it("увеличивает счётчик при клике", async () => {\n    const user = userEvent.setup(); // Настраиваем пользователя\n\n    render(<Counter />);\n\n    const button = screen.getByText("Увеличить");\n    const counter = screen.getByText("Счётчик: 0");\n\n    await user.click(button);\n    expect(screen.getByText("Счётчик: 1")).toBeInTheDocument();\n\n    await user.click(button);\n    await user.click(button);\n    expect(screen.getByText("Счётчик: 3")).toBeInTheDocument();\n  });\n\n  it("вводит текст в поле", async () => {\n    const user = userEvent.setup();\n    render(<SearchForm />);\n    const input = screen.getByRole("textbox");\n    await user.type(input, "React");\n    expect(input).toHaveValue("React");\n  });\n});' },
        { type: 'tip', value: 'userEvent.setup() нужно вызывать внутри каждого теста или в beforeEach. Все методы userEvent асинхронны — используй await.' }
      ]
    },
    {
      id: 4,
      title: 'Моки функций с vi.fn()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Моки позволяют заменить реальные функции (API-вызовы, коллбэки) на тестовые версии. Это изолирует компонент от внешних зависимостей.' },
        { type: 'code', language: 'jsx', value: 'import { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\nimport { describe, it, expect, vi } from "vitest";\nimport LoginForm from "./LoginForm";\n\n// function LoginForm({ onSubmit }) {\n//   const [email, setEmail] = useState("");\n//   const [password, setPassword] = useState("");\n//   return (\n//     <form onSubmit={() => onSubmit({ email, password })}>\n//       <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />\n//       <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" />\n//       <button type="submit">Войти</button>\n//     </form>\n//   );\n// }\n\ndescribe("LoginForm", () => {\n  it("вызывает onSubmit с данными формы", async () => {\n    const user = userEvent.setup();\n    const mockOnSubmit = vi.fn(); // Мок-функция\n\n    render(<LoginForm onSubmit={mockOnSubmit} />);\n\n    await user.type(screen.getByPlaceholderText("Email"), "test@mail.ru");\n    await user.type(screen.getByPlaceholderText("Пароль"), "secret123");\n    await user.click(screen.getByRole("button", { name: "Войти" }));\n\n    expect(mockOnSubmit).toHaveBeenCalledTimes(1);\n    expect(mockOnSubmit).toHaveBeenCalledWith({\n      email: "test@mail.ru",\n      password: "secret123",\n    });\n  });\n\n  it("не вызывает onSubmit при пустых полях", async () => {\n    const mockOnSubmit = vi.fn();\n    render(<LoginForm onSubmit={mockOnSubmit} />);\n    await userEvent.click(screen.getByRole("button"));\n    expect(mockOnSubmit).not.toHaveBeenCalled();\n  });\n});' }
      ]
    },
    {
      id: 5,
      title: 'Тестирование асинхронных компонентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компоненты с API-запросами тестируются с помощью vi.mock() для мокирования fetch/axios и waitFor/findBy для ожидания асинхронных изменений.' },
        { type: 'code', language: 'jsx', value: 'import { render, screen, waitFor } from "@testing-library/react";\nimport { describe, it, expect, vi, beforeEach } from "vitest";\nimport UserList from "./UserList";\n\n// Мокируем глобальный fetch\nconst mockUsers = [\n  { id: 1, name: "Алия Джакупова" },\n  { id: 2, name: "Нурлан Сейтов" },\n];\n\ndescribe("UserList", () => {\n  beforeEach(() => {\n    // Мокируем fetch перед каждым тестом\n    global.fetch = vi.fn().mockResolvedValue({\n      ok: true,\n      json: async () => mockUsers,\n    });\n  });\n\n  it("показывает список пользователей после загрузки", async () => {\n    render(<UserList />);\n\n    // Ждём появления индикатора загрузки\n    expect(screen.getByText("Загрузка...")).toBeInTheDocument();\n\n    // findByText ждёт появления текста (асинхронно)\n    expect(await screen.findByText("Алия Джакупова")).toBeInTheDocument();\n    expect(screen.getByText("Нурлан Сейтов")).toBeInTheDocument();\n    expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();\n  });\n\n  it("показывает ошибку при неудачном запросе", async () => {\n    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });\n    render(<UserList />);\n    await waitFor(() => {\n      expect(screen.getByText(/ошибка/i)).toBeInTheDocument();\n    });\n  });\n});' },
        { type: 'note', value: 'findBy* — это комбинация waitFor + getBy. Он ждёт до 1000мс (настраивается) пока элемент не появится в DOM. Используй его для асинхронного контента.' }
      ]
    },
    {
      id: 6,
      title: 'Тестирование с Context и Router',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компоненты, использующие Context или Router, нужно оборачивать в соответствующие Provider при тестировании. Создай вспомогательную функцию renderWithProviders.' },
        { type: 'code', language: 'jsx', value: 'import { render } from "@testing-library/react";\nimport { BrowserRouter } from "react-router-dom";\nimport { QueryClient, QueryClientProvider } from "@tanstack/react-query";\n\n// test/utils.jsx — переиспользуемые утилиты\nfunction renderWithProviders(ui, options = {}) {\n  const queryClient = new QueryClient({\n    defaultOptions: { queries: { retry: false } }, // Без retry в тестах!\n  });\n\n  function Wrapper({ children }) {\n    return (\n      <BrowserRouter>\n        <QueryClientProvider client={queryClient}>\n          {children}\n        </QueryClientProvider>\n      </BrowserRouter>\n    );\n  }\n\n  return render(ui, { wrapper: Wrapper, ...options });\n}\n\nexport { renderWithProviders };\n\n// Использование в тестах\nimport { renderWithProviders } from "../test/utils";\n\ndescribe("Navbar", () => {\n  it("показывает ссылки навигации", () => {\n    renderWithProviders(<Navbar />); // Уже обёрнут в Router!\n\n    expect(screen.getByRole("link", { name: "Главная" })).toBeInTheDocument();\n    expect(screen.getByRole("link", { name: "О нас" })).toBeInTheDocument();\n  });\n});' }
      ]
    },
    {
      id: 7,
      title: 'Практика: тестирование формы авторизации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши набор тестов для компонента LoginForm. Покрой основные сценарии: успешный вход, валидация ошибок, состояние загрузки.',
      requirements: [
        'Тест: форма рендерится с полями email и password и кнопкой',
        'Тест: при пустых полях показывается сообщение об ошибке',
        'Тест: при невалидном email показывается ошибка валидации',
        'Тест: при корректных данных вызывается onLogin с email и password',
        'Тест: при isLoading кнопка disabled и показывает "Вход..."',
        'vi.fn() для мока onLogin',
        'userEvent для ввода данных'
      ],
      hint: 'screen.getByRole("button") найдёт кнопку. Для проверки атрибута disabled используй expect(button).toBeDisabled(). Для проверки текста ошибки используй screen.getByText(/ошибка/i) с регулярным выражением.',
      expectedOutput: 'PASS LoginForm.test.jsx\n✓ рендерит форму с полями email и пароля\n✓ показывает ошибку при пустом email\n✓ показывает ошибку при неверном формате email\n✓ вызывает onLogin с данными при успешной отправке\n✓ показывает "Загрузка..." при pending\nTests: 6 passed',
      solution: 'import { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\nimport { describe, it, expect, vi } from "vitest";\n\n// Компонент для тестирования\nfunction LoginForm({ onLogin, isLoading = false }) {\n  const [email, setEmail] = React.useState("");\n  const [password, setPassword] = React.useState("");\n  const [errors, setErrors] = React.useState({});\n\n  const validate = () => {\n    const errs = {};\n    if (!email) errs.email = "Email обязателен";\n    else if (!email.includes("@")) errs.email = "Неверный формат email";\n    if (!password) errs.password = "Пароль обязателен";\n    return errs;\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const errs = validate();\n    if (Object.keys(errs).length > 0) { setErrors(errs); return; }\n    onLogin({ email, password });\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />\n      {errors.email && <span>{errors.email}</span>}\n      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />\n      {errors.password && <span>{errors.password}</span>}\n      <button type="submit" disabled={isLoading}>{isLoading ? "Вход..." : "Войти"}</button>\n    </form>\n  );\n}\n\n// Тесты\ndescribe("LoginForm", () => {\n  it("рендерит форму с полями и кнопкой", () => {\n    render(<LoginForm onLogin={vi.fn()} />);\n    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();\n    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();\n    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();\n  });\n\n  it("показывает ошибки при пустых полях", async () => {\n    const user = userEvent.setup();\n    render(<LoginForm onLogin={vi.fn()} />);\n    await user.click(screen.getByRole("button"));\n    expect(screen.getByText("Email обязателен")).toBeInTheDocument();\n    expect(screen.getByText("Пароль обязателен")).toBeInTheDocument();\n  });\n\n  it("показывает ошибку при невалидном email", async () => {\n    const user = userEvent.setup();\n    render(<LoginForm onLogin={vi.fn()} />);\n    await user.type(screen.getByPlaceholderText("Email"), "notanemail");\n    await user.type(screen.getByPlaceholderText("Пароль"), "password123");\n    await user.click(screen.getByRole("button"));\n    expect(screen.getByText("Неверный формат email")).toBeInTheDocument();\n  });\n\n  it("вызывает onLogin с правильными данными", async () => {\n    const mockOnLogin = vi.fn();\n    const user = userEvent.setup();\n    render(<LoginForm onLogin={mockOnLogin} />);\n    await user.type(screen.getByPlaceholderText("Email"), "test@mail.ru");\n    await user.type(screen.getByPlaceholderText("Пароль"), "secret123");\n    await user.click(screen.getByRole("button"));\n    expect(mockOnLogin).toHaveBeenCalledWith({ email: "test@mail.ru", password: "secret123" });\n  });\n\n  it("блокирует кнопку при isLoading", () => {\n    render(<LoginForm onLogin={vi.fn()} isLoading={true} />);\n    expect(screen.getByRole("button")).toBeDisabled();\n    expect(screen.getByText("Вход...")).toBeInTheDocument();\n  });\n});',
      explanation: 'Хорошие тесты описывают поведение компонента с точки зрения пользователя. Мы не тестируем state напрямую — мы проверяем что отображается в DOM при тех или иных действиях.'
    }
  ]
}
