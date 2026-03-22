export default {
  id: 15,
  title: 'Модули',
  description: 'Система модулей TypeScript: ES модули, export/import, namespace, пути и организация большого проекта',
  lessons: [
    {
      id: 1,
      title: 'ES Modules в TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript использует стандарт ES Modules (ESM) — тот же, что и современный JavaScript. Ключевые слова export и import. Каждый файл — отдельный модуль со своей областью видимости.' },
        { type: 'heading', value: 'Named exports и imports' },
        { type: 'code', language: 'typescript', value: '// math.ts — экспортируем несколько элементов\nexport const PI = 3.14159;\n\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n\nexport interface Point {\n  x: number;\n  y: number;\n}\n\nexport type Direction = "north" | "south" | "east" | "west";\n\n// main.ts — импортируем\nimport { PI, add, Point, Direction } from "./math";\n\nconst p: Point = { x: 1, y: 2 };\nconsole.log(add(p.x, p.y)); // 3\nconsole.log(PI);             // 3.14159\n\n// Переименование при импорте\nimport { add as sum, PI as pi } from "./math";\nconsole.log(sum(1, 2)); // 3\nconsole.log(pi);        // 3.14159' },
        { type: 'heading', value: 'Default exports' },
        { type: 'code', language: 'typescript', value: '// userService.ts\ninterface User { id: number; name: string; }\n\nclass UserService {\n  private users: User[] = [];\n\n  add(user: User): void { this.users.push(user); }\n  getAll(): User[] { return [...this.users]; }\n  findById(id: number): User | undefined {\n    return this.users.find(u => u.id === id);\n  }\n}\n\nexport default UserService; // default export — один на файл\n\n// main.ts\nimport UserService from "./userService"; // имя можно выбрать любое\nimport MyService from "./userService";   // тоже работает\n\nconst service = new UserService();\nservice.add({ id: 1, name: "Алиса" });\nconsole.log(service.getAll());' },
        { type: 'note', value: 'Конвенция: используйте named exports для утилит и типов, default export для основного "продукта" файла (класса, компонента). В больших проектах named exports предпочтительнее — лучше поддержка tree-shaking.' }
      ]
    },
    {
      id: 2,
      title: 'Re-exports и barrel файлы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Barrel файл (обычно index.ts) — файл, который реэкспортирует всё из папки. Позволяет делать чистые импорты из одной точки вместо множества путей.' },
        { type: 'heading', value: 'Структура без barrel' },
        { type: 'code', language: 'typescript', value: '// Без barrel — много длинных импортов:\nimport { UserService } from "./services/UserService";\nimport { ProductService } from "./services/ProductService";\nimport { OrderService } from "./services/OrderService";\n\n// С barrel — services/index.ts:\nexport { UserService } from "./UserService";\nexport { ProductService } from "./ProductService";\nexport { OrderService } from "./OrderService";\n// Или короче:\nexport * from "./UserService";\nexport * from "./ProductService";\nexport * from "./OrderService";\n\n// Теперь импортируем красиво:\nimport { UserService, ProductService, OrderService } from "./services";\n// services/index.ts подхватывается автоматически!' },
        { type: 'heading', value: 'Re-export с переименованием' },
        { type: 'code', language: 'typescript', value: '// types/index.ts — публичное API модуля\nexport type { User, UserRole } from "./user";\nexport type { Product, Category } from "./product";\nexport { createUser, validateUser } from "./userUtils";\n\n// Скрываем внутренние детали:\n// UserValidator — внутренний класс, не экспортируем\n\n// Переименование при реэкспорте:\nexport { InternalUserDTO as UserDTO } from "./internal";\n\n// Использование:\nimport type { User, Product } from "./types";\nimport { createUser } from "./types";' },
        { type: 'tip', value: 'Barrel файлы — это публичное API вашего модуля. Экспортируйте только то, что должны видеть другие. Внутренние детали реализации оставляйте не экспортированными.' }
      ]
    },
    {
      id: 3,
      title: 'Namespaces',
      type: 'theory',
      content: [
        { type: 'text', value: 'Namespaces — старый способ организации кода в TypeScript (до ESM). Используйте модули (ESM) в новом коде. Namespace полезны для работы со старым кодом и глобальными типами в .d.ts файлах.' },
        { type: 'heading', value: 'Базовое использование namespace' },
        { type: 'code', language: 'typescript', value: 'namespace Validation {\n  export interface StringValidator {\n    isAcceptable(s: string): boolean;\n  }\n\n  const lettersRegexp = /^[A-Za-z]+$/;\n  const numberRegexp  = /^[0-9]+$/;\n\n  export class LettersOnlyValidator implements StringValidator {\n    isAcceptable(s: string): boolean {\n      return lettersRegexp.test(s);\n    }\n  }\n\n  export class NumbersOnlyValidator implements StringValidator {\n    isAcceptable(s: string): boolean {\n      return numberRegexp.test(s);\n    }\n  }\n}\n\nconst validators: Validation.StringValidator[] = [\n  new Validation.LettersOnlyValidator(),\n  new Validation.NumbersOnlyValidator(),\n];\n\nconsole.log(validators[0].isAcceptable("ABC")); // true\nconsole.log(validators[1].isAcceptable("123")); // true\nconsole.log(validators[0].isAcceptable("123")); // false' },
        { type: 'heading', value: 'Вложенные namespaces' },
        { type: 'code', language: 'typescript', value: 'namespace App {\n  export namespace Models {\n    export interface User { id: number; name: string; }\n    export interface Product { id: number; title: string; price: number; }\n  }\n\n  export namespace Utils {\n    export function formatPrice(price: number): string {\n      return `${price.toFixed(2)} руб.`;\n    }\n  }\n}\n\nconst user: App.Models.User = { id: 1, name: "Алиса" };\nconst product: App.Models.Product = { id: 1, title: "Ноутбук", price: 50000 };\nconsole.log(App.Utils.formatPrice(product.price)); // 50000.00 руб.' },
        { type: 'note', value: 'В современном TypeScript предпочитайте ES Modules вместо Namespaces. Namespace полезны для аугментации глобальных типов (declare namespace Window) и работы с legacy кодом.' }
      ]
    },
    {
      id: 4,
      title: 'Настройка путей (paths) в tsconfig',
      type: 'theory',
      content: [
        { type: 'text', value: 'Длинные относительные пути (../../../../utils/helpers) делают код трудночитаемым. TypeScript paths aliases позволяют настроить короткие псевдонимы для путей.' },
        { type: 'heading', value: 'Настройка paths в tsconfig.json' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json\n// {\n//   "compilerOptions": {\n//     "baseUrl": "src",\n//     "paths": {\n//       "@components/*": ["components/*"],\n//       "@utils/*": ["utils/*"],\n//       "@types/*": ["types/*"],\n//       "@services/*": ["services/*"],\n//       "@/*": ["./*"]\n//     }\n//   }\n// }\n\n// Было (относительные пути):\nimport { Button } from "../../../components/Button";\nimport { formatDate } from "../../../../utils/date";\nimport type { User } from "../../types/user";\n\n// Стало (aliases):\nimport { Button } from "@components/Button";\nimport { formatDate } from "@utils/date";\nimport type { User } from "@types/user";' },
        { type: 'heading', value: 'Структура проекта с aliases' },
        { type: 'code', language: 'typescript', value: '// Структура проекта:\n// src/\n//   components/\n//     Button.tsx\n//     Modal.tsx\n//   utils/\n//     date.ts\n//     format.ts\n//   types/\n//     user.ts\n//     product.ts\n//   services/\n//     api.ts\n//   pages/\n//     HomePage.tsx  <- вот откуда импортируем\n\n// src/pages/HomePage.tsx\nimport { Button, Modal } from "@components";\nimport { formatDate } from "@utils/date";\nimport type { User } from "@types/user";\nimport { apiService } from "@services/api";\n\n// Чисто и понятно — не важно, насколько глубоко вложена страница' },
        { type: 'tip', value: 'При использовании с Vite или Webpack нужно настроить aliases и в конфиге бандлера (resolve.alias в vite.config.ts). TypeScript видит пути через tsconfig, а бандлер должен их разрешить физически.' }
      ]
    },
    {
      id: 5,
      title: 'Declaration files (.d.ts)',
      type: 'theory',
      content: [
        { type: 'text', value: '.d.ts файлы — файлы объявлений типов. Они описывают типы для JavaScript библиотек или для кода, который не нужно компилировать. Именно из .d.ts TypeScript знает типы npm пакетов.' },
        { type: 'heading', value: 'Создание своих .d.ts файлов' },
        { type: 'code', language: 'typescript', value: '// myLibrary.d.ts — типы для JavaScript библиотеки\ndeclare module "my-js-library" {\n  export interface Config {\n    apiKey: string;\n    timeout?: number;\n  }\n\n  export function init(config: Config): void;\n  export function getData(id: number): Promise<any>;\n\n  export class Client {\n    constructor(apiKey: string);\n    get(endpoint: string): Promise<Response>;\n    post(endpoint: string, body: any): Promise<Response>;\n  }\n}\n\n// Теперь можно использовать с типами:\nimport { init, Client } from "my-js-library";\ninit({ apiKey: "abc123" });\nconst client = new Client("abc123");' },
        { type: 'heading', value: 'Аугментация глобальных типов' },
        { type: 'code', language: 'typescript', value: '// globals.d.ts — расширяем глобальные типы\ndeclare global {\n  interface Window {\n    analytics: {\n      track(event: string, data?: object): void;\n    };\n    __APP_CONFIG__: {\n      apiUrl: string;\n      version: string;\n    };\n  }\n\n  interface Array<T> {\n    last(): T | undefined;\n  }\n}\n\n// После этого TypeScript знает о наших глобальных расширениях:\nwindow.analytics.track("page_view", { path: "/home" });\nconsole.log(window.__APP_CONFIG__.version);\n\n[1, 2, 3].last(); // number | undefined' },
        { type: 'note', value: 'Большинство популярных npm пакетов имеют типы в @types/* (например, @types/lodash). Проверить наличие: npm info @types/package-name. Если нет — создайте своей .d.ts файл.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Организация модульного проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Организуйте код небольшого API-клиента по модулям. Создайте правильную структуру с barrel файлами, типами и сервисами.',
      requirements: [
        'Создайте types/index.ts с интерфейсами User, Post, ApiResponse<T>',
        'Создайте utils/http.ts с функцией buildUrl(base: string, path: string): string',
        'Создайте services/userService.ts с методами getUsers и getUserById',
        'Создайте services/index.ts — barrel для сервисов',
        'Создайте главный index.ts, импортирующий из barrel файлов',
        'Используйте типы из @types/* псевдонима'
      ],
      hint: 'Начните с типов — они нужны сервисам. Barrel файл services/index.ts должен реэкспортировать все сервисы. В главном index.ts используйте только публичные barrel импорты.',
      solution: '// types/index.ts\nexport interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nexport interface Post {\n  id: number;\n  userId: number;\n  title: string;\n  body: string;\n}\n\nexport interface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n\n// utils/http.ts\nexport function buildUrl(base: string, path: string): string {\n  return `${base.replace(/\\/$/, "")}/${path.replace(/^\\//, "")}`;\n}\n\nexport async function fetchJson<T>(url: string): Promise<T> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n\n// services/userService.ts\nimport type { User, ApiResponse } from "../types";\nimport { buildUrl, fetchJson } from "../utils/http";\n\nconst BASE_URL = "https://jsonplaceholder.typicode.com";\n\nexport async function getUsers(): Promise<ApiResponse<User[]>> {\n  const users = await fetchJson<User[]>(buildUrl(BASE_URL, "/users"));\n  return { data: users, status: 200, message: "OK" };\n}\n\nexport async function getUserById(id: number): Promise<ApiResponse<User>> {\n  const user = await fetchJson<User>(buildUrl(BASE_URL, `/users/${id}`));\n  return { data: user, status: 200, message: "OK" };\n}\n\n// services/index.ts\nexport * from "./userService";\n\n// index.ts\nimport { getUsers, getUserById } from "./services";\nimport type { User } from "./types";\n\nasync function main() {\n  const response = await getUsers();\n  const users: User[] = response.data;\n  console.log(`Загружено пользователей: ${users.length}`);\n  \n  const single = await getUserById(1);\n  console.log(`Пользователь: ${single.data.name}`);\n}\n\nmain().catch(console.error);',
      explanation: 'Модульная структура: types — данные, utils — чистые функции, services — бизнес-логика. Barrel файлы (index.ts) создают публичное API каждой папки. Главный файл импортирует только из barrel — не знает о внутренней структуре.'
    }
  ]
}
