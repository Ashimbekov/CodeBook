export default {
  id: 46,
  title: 'Jest — тестирование',
  description: 'Тестирование JavaScript с Jest: describe/test/expect, моки (mock/spy), beforeEach/afterEach, покрытие кода и тестирование async',
  lessons: [
    {
      id: 1,
      title: 'Основы Jest',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jest — популярный фреймворк тестирования от Facebook. Из коробки: test runner, assertions, mocking, coverage. Не требует конфигурации для базового использования.' },
        { type: 'heading', value: 'Первые тесты' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev jest\n// package.json: "test": "jest"\n\n// math.js\nfunction add(a, b) { return a + b; }\nfunction subtract(a, b) { return a - b; }\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Деление на ноль");\n  return a / b;\n}\nmodule.exports = { add, subtract, divide };\n\n// math.test.js\nconst { add, subtract, divide } = require("./math");\n\n// describe — группировка тестов\ndescribe("Математические функции", () => {\n  // test() или it() — одинаковы\n  test("сложение двух чисел", () => {\n    expect(add(2, 3)).toBe(5);\n    expect(add(-1, 1)).toBe(0);\n    expect(add(0, 0)).toBe(0);\n  });\n\n  it("вычитание", () => {\n    expect(subtract(5, 3)).toBe(2);\n  });\n\n  test("деление", () => {\n    expect(divide(10, 2)).toBe(5);\n    expect(divide(9, 3)).toBe(3);\n  });\n\n  test("деление на ноль бросает ошибку", () => {\n    expect(() => divide(10, 0)).toThrow("Деление на ноль");\n    expect(() => divide(5, 0)).toThrow(Error);\n  });\n});\n\n// Запуск:\n// npx jest\n// npx jest math.test.js    — конкретный файл\n// npx jest --watch         — watch mode\n// npx jest --coverage      — с покрытием' },
        { type: 'tip', value: 'Файлы тестов: *.test.js, *.spec.js или в папке __tests__. Jest автоматически их найдёт. Называйте файл тестов так же как модуль: math.js -> math.test.js.' }
      ]
    },
    {
      id: 2,
      title: 'expect — матчеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Матчеры (matchers) — методы expect() для проверки значений. toBe для примитивов, toEqual для объектов, toContain для массивов, toMatch для строк.' },
        { type: 'heading', value: 'Основные матчеры' },
        { type: 'code', language: 'javascript', value: 'describe("Матчеры Jest", () => {\n  // Равенство\n  test("toBe — строгое равенство (===)", () => {\n    expect(2 + 2).toBe(4);\n    expect("hello").toBe("hello");\n  });\n\n  test("toEqual — глубокое равенство объектов", () => {\n    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });\n    expect([1, 2, 3]).toEqual([1, 2, 3]);\n    // toBe не работает для объектов: {} !== {}\n  });\n\n  // Истинность\n  test("truthy/falsy", () => {\n    expect(true).toBeTruthy();\n    expect(null).toBeFalsy();\n    expect(0).toBeFalsy();\n    expect("text").toBeTruthy();\n    expect(undefined).toBeUndefined();\n    expect(null).toBeNull();\n    expect(42).toBeDefined();\n  });\n\n  // Числа\n  test("числа", () => {\n    expect(5).toBeGreaterThan(3);\n    expect(3).toBeLessThanOrEqual(3);\n    expect(0.1 + 0.2).toBeCloseTo(0.3); // Не toBe для float!\n  });\n\n  // Строки\n  test("строки", () => {\n    expect("hello world").toContain("world");\n    expect("hello").toMatch(/^hell/);\n    expect("test@email.com").toMatch(/\\S+@\\S+\\.\\S+/);\n  });\n\n  // Массивы\n  test("массивы", () => {\n    expect([1, 2, 3]).toContain(2);\n    expect([1, 2, 3]).toHaveLength(3);\n    expect([{id: 1}, {id: 2}]).toContainEqual({id: 1});\n  });\n\n  // Объекты\n  test("объекты", () => {\n    expect({ name: "Алия", age: 25 }).toMatchObject({ name: "Алия" }); // Частичное\n    expect({ a: 1 }).toHaveProperty("a", 1);\n  });\n\n  // Отрицание\n  test("not — отрицание", () => {\n    expect(5).not.toBe(10);\n    expect(null).not.toBeDefined();\n  });\n});' }
      ]
    },
    {
      id: 3,
      title: 'beforeEach, afterEach — хуки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хуки позволяют выполнять код до/после тестов: beforeEach/afterEach (каждый тест), beforeAll/afterAll (весь suite). Используются для setup и teardown.' },
        { type: 'heading', value: 'Хуки и организация тестов' },
        { type: 'code', language: 'javascript', value: 'const UserService = require("./UserService");\nconst db = require("./db");\n\ndescribe("UserService", () => {\n  // Один раз перед всеми тестами\n  beforeAll(async () => {\n    await db.connect("mongodb://localhost:27017/test-db");\n    console.log("БД подключена");\n  });\n\n  // Один раз после всех тестов\n  afterAll(async () => {\n    await db.disconnect();\n    console.log("БД отключена");\n  });\n\n  // Перед каждым тестом\n  beforeEach(async () => {\n    await db.collection("users").deleteMany({});\n    // Чистый state для каждого теста\n  });\n\n  // После каждого теста\n  afterEach(() => {\n    jest.clearAllMocks(); // Очищаем моки\n  });\n\n  test("создание пользователя", async () => {\n    const user = await UserService.create({ email: "test@test.com", name: "Test" });\n    expect(user).toHaveProperty("id");\n    expect(user.email).toBe("test@test.com");\n  });\n\n  test("получение пользователя", async () => {\n    const created = await UserService.create({ email: "a@b.com", name: "A" });\n    const found = await UserService.findById(created.id);\n    expect(found).toMatchObject({ email: "a@b.com" });\n  });\n\n  describe("Вложенная группа", () => {\n    let testUser;\n\n    beforeEach(async () => {\n      testUser = await UserService.create({ email: "t@t.com", name: "T" });\n    });\n\n    test("обновление", async () => {\n      const updated = await UserService.update(testUser.id, { name: "Updated" });\n      expect(updated.name).toBe("Updated");\n    });\n  });\n});' }
      ]
    },
    {
      id: 4,
      title: 'Моки и шпионы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Моки (mocks) заменяют реальные зависимости. jest.fn() создаёт мок-функцию. jest.mock() мокает целые модули. jest.spyOn() следит за реальными методами.' },
        { type: 'heading', value: 'Jest mock и spy' },
        { type: 'code', language: 'javascript', value: '// jest.fn() — мок функция\ndescribe("Mock функции", () => {\n  test("jest.fn() отслеживает вызовы", () => {\n    const mockFn = jest.fn();\n    mockFn(1);\n    mockFn(2, "test");\n    mockFn(3);\n\n    expect(mockFn).toHaveBeenCalledTimes(3);\n    expect(mockFn).toHaveBeenCalledWith(2, "test");\n    expect(mockFn).toHaveBeenLastCalledWith(3);\n    expect(mockFn.mock.calls).toEqual([[1], [2, "test"], [3]]);\n  });\n\n  test("jest.fn() с возвращаемым значением", () => {\n    const greet = jest.fn().mockReturnValue("Привет!");\n    expect(greet()).toBe("Привет!");\n    expect(greet()).toBe("Привет!");\n\n    const fetchUser = jest.fn()\n      .mockReturnValueOnce({ id: 1, name: "Алия" }) // Первый вызов\n      .mockReturnValueOnce(null)                    // Второй вызов\n      .mockReturnValue({ id: 0, name: "default" }); // Остальные\n  });\n});\n\n// jest.mock() — мок модуля\njest.mock("./emailService"); // Весь модуль становится jest.fn()\nconst emailService = require("./emailService");\n\ntest("отправка email при регистрации", async () => {\n  emailService.sendWelcome.mockResolvedValue({ sent: true });\n  await UserService.register({ email: "new@user.com" });\n  expect(emailService.sendWelcome).toHaveBeenCalledWith("new@user.com");\n});\n\n// jest.spyOn() — следить за реальным методом\ntest("spyOn", () => {\n  const spy = jest.spyOn(console, "log").mockImplementation(() => {});\n  doSomethingThatLogs();\n  expect(spy).toHaveBeenCalled();\n  spy.mockRestore(); // Восстановить оригинал\n});\n\n// Мок для Date\ntest("мок Date", () => {\n  const fixedDate = new Date("2024-01-15");\n  jest.setSystemTime(fixedDate);\n  expect(new Date()).toEqual(fixedDate);\n  jest.useRealTimers();\n});' }
      ]
    },
    {
      id: 5,
      title: 'Тестирование async кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для async тестов используйте async/await или возвращайте Promise. Jest ждёт завершения. Тестирование fetch, API запросов — через моки.' },
        { type: 'heading', value: 'Async тесты' },
        { type: 'code', language: 'javascript', value: '// Тестирование async/await\ndescribe("Async тесты", () => {\n  // 1. async/await — предпочтительный способ\n  test("успешный async вызов", async () => {\n    const data = await fetchUserData(1);\n    expect(data).toHaveProperty("id", 1);\n  });\n\n  // 2. Возвращение Promise\n  test("через Promise", () => {\n    return fetchUserData(1).then(data => {\n      expect(data.id).toBe(1);\n    });\n  });\n\n  // 3. Тест на отклонение Promise\n  test("ошибка при невалидном id", async () => {\n    await expect(fetchUserData(-1)).rejects.toThrow("Пользователь не найден");\n    await expect(fetchUserData(-1)).rejects.toMatchObject({ status: 404 });\n  });\n});\n\n// Мок fetch\nglobal.fetch = jest.fn();\n\ntest("мок fetch запроса", async () => {\n  fetch.mockResolvedValue({\n    ok: true,\n    json: async () => ({ id: 1, name: "Алия" })\n  });\n\n  const user = await getUserFromAPI(1);\n  expect(user.name).toBe("Алия");\n  expect(fetch).toHaveBeenCalledWith("https://api.example.com/users/1");\n});\n\n// jest.useFakeTimers() для setTimeout\ntest("setTimeout", () => {\n  jest.useFakeTimers();\n  const callback = jest.fn();\n  setTimeout(callback, 1000);\n\n  expect(callback).not.toHaveBeenCalled();\n  jest.runAllTimers(); // или jest.advanceTimersByTime(1000)\n  expect(callback).toHaveBeenCalledTimes(1);\n\n  jest.useRealTimers();\n});\n\n// Тестирование Express с supertest\nconst request = require("supertest");\nconst app = require("./app");\n\ntest("GET /users возвращает массив", async () => {\n  const res = await request(app).get("/users");\n  expect(res.status).toBe(200);\n  expect(res.body).toBeInstanceOf(Array);\n});' }
      ]
    },
    {
      id: 6,
      title: 'Coverage — покрытие кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Coverage показывает какой процент кода покрыт тестами: statements, branches, functions, lines. Настраивается в jest.config.js. Цель — не 100%, а осмысленные тесты.' },
        { type: 'heading', value: 'Настройка coverage' },
        { type: 'code', language: 'javascript', value: '// jest.config.js\nmodule.exports = {\n  // Среда выполнения\n  testEnvironment: "node",   // или "jsdom" для browser\n\n  // Файлы тестов\n  testMatch: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],\n\n  // Coverage\n  collectCoverage: false,  // Включить через --coverage флаг\n  coverageDirectory: "coverage",\n  collectCoverageFrom: [\n    "src/**/*.{js,jsx,ts,tsx}",\n    "!src/**/*.d.ts",\n    "!src/index.js",\n    "!src/**/*.stories.js"\n  ],\n  coverageThresholds: {\n    global: {\n      branches: 70,\n      functions: 80,\n      lines: 80,\n      statements: 80\n    }\n  },\n  coverageReporters: ["text", "lcov", "html"],\n\n  // Трансформации\n  transform: {\n    "^.+\\\\.(js|jsx)$": "babel-jest",\n    "^.+\\\\.(ts|tsx)$": "ts-jest"\n  },\n\n  // Алиасы (как в webpack/vite)\n  moduleNameMapper: {\n    "^@/(.*)$": "<rootDir>/src/$1",\n    "\\\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"\n  },\n\n  // Setup файлы\n  setupFilesAfterFramework: ["<rootDir>/jest.setup.js"],\n\n  // Таймаут для async тестов\n  testTimeout: 10000\n};\n\n// Запуск:\n// npx jest --coverage\n// Создаёт coverage/ папку с HTML отчётом' }
      ]
    },
    {
      id: 7,
      title: 'Тестирование Express API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Supertest — библиотека для интеграционного тестирования HTTP API. Делает реальные HTTP запросы к Express app без запуска сервера.' },
        { type: 'heading', value: 'Интеграционные тесты с Supertest' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev supertest\nconst request = require("supertest");\nconst app = require("../src/app"); // Express app без listen()\nconst mongoose = require("mongoose");\n\ndescribe("Tasks API", () => {\n  beforeAll(async () => {\n    await mongoose.connect(process.env.MONGODB_TEST_URI);\n  });\n\n  afterAll(async () => {\n    await mongoose.connection.dropDatabase();\n    await mongoose.disconnect();\n  });\n\n  beforeEach(async () => {\n    await mongoose.connection.collection("tasks").deleteMany({});\n  });\n\n  describe("GET /tasks", () => {\n    test("возвращает пустой массив", async () => {\n      const res = await request(app).get("/tasks");\n      expect(res.status).toBe(200);\n      expect(res.body.data).toEqual([]);\n    });\n  });\n\n  describe("POST /tasks", () => {\n    test("создаёт задачу", async () => {\n      const res = await request(app)\n        .post("/tasks")\n        .send({ title: "Тестовая задача" });\n      expect(res.status).toBe(201);\n      expect(res.body.data.title).toBe("Тестовая задача");\n      expect(res.body.data).toHaveProperty("id");\n    });\n\n    test("400 без title", async () => {\n      const res = await request(app).post("/tasks").send({});\n      expect(res.status).toBe(400);\n      expect(res.body).toHaveProperty("error");\n    });\n  });\n\n  describe("Авторизованные запросы", () => {\n    let token;\n    beforeEach(async () => {\n      const res = await request(app)\n        .post("/auth/login")\n        .send({ email: "test@test.com", password: "password123" });\n      token = res.body.token;\n    });\n\n    test("GET /profile с токеном", async () => {\n      const res = await request(app)\n        .get("/profile")\n        .set("Authorization", `Bearer ${token}`);\n      expect(res.status).toBe(200);\n    });\n  });\n});' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Тестирование утилит',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите тесты для набора утилитарных функций: валидация, форматирование, обработка данных. Достигните 80%+ покрытия.',
      requirements: [
        'Напишите функции: validateEmail, formatCurrency, groupBy, debounce',
        'validateEmail: проверяет email через regex',
        'formatCurrency(amount, currency): форматирует число как валюту',
        'groupBy(array, key): группирует массив объектов по ключу',
        'debounce(fn, delay): возвращает debounced функцию',
        'Для каждой функции: happy path, edge cases, ошибки',
        'Тесты debounce через jest.useFakeTimers()',
        'Покрытие > 80%'
      ],
      solution: {
        code: '// utils.js\nfunction validateEmail(email) {\n  if (!email || typeof email !== "string") return false;\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}\n\nfunction formatCurrency(amount, currency = "KZT") {\n  if (typeof amount !== "number") throw new Error("amount должен быть числом");\n  return new Intl.NumberFormat("ru-KZ", { style: "currency", currency }).format(amount);\n}\n\nfunction groupBy(array, key) {\n  if (!Array.isArray(array)) throw new Error("Первый аргумент должен быть массивом");\n  return array.reduce((result, item) => {\n    const group = item[key];\n    if (!result[group]) result[group] = [];\n    result[group].push(item);\n    return result;\n  }, {});\n}\n\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\nmodule.exports = { validateEmail, formatCurrency, groupBy, debounce };\n\n// utils.test.js\nconst { validateEmail, formatCurrency, groupBy, debounce } = require("./utils");\n\ndescribe("validateEmail", () => {\n  test("валидный email", () => {\n    expect(validateEmail("user@example.com")).toBe(true);\n    expect(validateEmail("a.b@c.ru")).toBe(true);\n  });\n  test("невалидный email", () => {\n    expect(validateEmail("not-email")).toBe(false);\n    expect(validateEmail("")).toBe(false);\n    expect(validateEmail(null)).toBe(false);\n  });\n});\n\ndescribe("groupBy", () => {\n  test("группирует по ключу", () => {\n    const users = [{ name: "A", role: "admin" }, { name: "B", role: "user" }, { name: "C", role: "admin" }];\n    const result = groupBy(users, "role");\n    expect(result.admin).toHaveLength(2);\n    expect(result.user).toHaveLength(1);\n  });\n  test("бросает ошибку для не-массива", () => {\n    expect(() => groupBy("string", "key")).toThrow();\n  });\n});\n\ndescribe("debounce", () => {\n  beforeEach(() => jest.useFakeTimers());\n  afterEach(() => jest.useRealTimers());\n  test("вызывается один раз после delay", () => {\n    const fn = jest.fn();\n    const debounced = debounce(fn, 500);\n    debounced(); debounced(); debounced();\n    expect(fn).not.toHaveBeenCalled();\n    jest.runAllTimers();\n    expect(fn).toHaveBeenCalledTimes(1);\n  });\n});',
        language: 'javascript'
      }
    }
  ]
};
