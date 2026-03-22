export default {
  id: 14,
  title: 'Декораторы',
  description: 'Декораторы TypeScript: классовые, методов, свойств, параметров. Мета-программирование и практические паттерны',
  lessons: [
    {
      id: 1,
      title: 'Введение в декораторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декораторы — это специальный синтаксис для добавления аннотаций и изменения классов, методов, свойств и параметров. Символ @ перед именем декоратора. Декораторы — это функции, которые вызываются при определении класса.' },
        { type: 'tip', value: 'Декораторы похожи на аннотации в Java или атрибуты в C#. @Injectable, @Component, @Get("/users") — это декораторы в Angular и NestJS.' },
        { type: 'heading', value: 'Включение декораторов в tsconfig.json' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json:\n// {\n//   "compilerOptions": {\n//     "experimentalDecorators": true,\n//     "emitDecoratorMetadata": true\n//   }\n// }\n\n// Простой декоратор класса\nfunction sealed(constructor: Function) {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n  console.log(`Класс ${constructor.name} запечатан`);\n}\n\n@sealed\nclass MyClass {\n  name = "test";\n}\n\n// При определении класса выведет:\n// Класс MyClass запечатан' },
        { type: 'heading', value: 'Декоратор-фабрика (с параметрами)' },
        { type: 'code', language: 'typescript', value: '// Фабрика возвращает декоратор\nfunction log(prefix: string) {\n  return function(constructor: Function) {\n    console.log(`[${prefix}] Создан класс: ${constructor.name}`);\n  };\n}\n\n@log("APP")\nclass UserService {\n  getUsers() { return []; }\n}\n// Выведет: [APP] Создан класс: UserService\n\n// Несколько декораторов (применяются снизу вверх!)\n@log("OUTER")\n@log("INNER")\nclass ProductService {}\n// Порядок выполнения: INNER -> OUTER' },
        { type: 'note', value: 'Декораторы в TypeScript пока экспериментальная функция (флаг experimentalDecorators), но широко используются в Angular, NestJS, TypeORM. В ECMAScript стандарт декораторов завершён в 2023 году.' }
      ]
    },
    {
      id: 2,
      title: 'Декораторы методов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор метода получает три аргумента: target (прототип класса), propertyKey (имя метода), descriptor (дескриптор свойства). Через descriptor.value можно обернуть оригинальный метод.' },
        { type: 'heading', value: 'Декоратор логирования метода' },
        { type: 'code', language: 'typescript', value: 'function logMethod(\n  target: any,\n  key: string,\n  descriptor: PropertyDescriptor\n): PropertyDescriptor {\n  const original = descriptor.value;\n  \n  descriptor.value = function(...args: any[]) {\n    console.log(`Вызов ${key} с аргументами:`, args);\n    const result = original.apply(this, args);\n    console.log(`${key} вернул:`, result);\n    return result;\n  };\n  \n  return descriptor;\n}\n\nclass Calculator {\n  @logMethod\n  add(a: number, b: number): number {\n    return a + b;\n  }\n}\n\nconst calc = new Calculator();\ncalc.add(2, 3);\n// Вызов add с аргументами: [2, 3]\n// add вернул: 5' },
        { type: 'heading', value: 'Декоратор измерения времени' },
        { type: 'code', language: 'typescript', value: 'function measure(\n  target: any,\n  key: string,\n  descriptor: PropertyDescriptor\n): PropertyDescriptor {\n  const original = descriptor.value;\n  \n  descriptor.value = async function(...args: any[]) {\n    const start = performance.now();\n    const result = await original.apply(this, args);\n    const end = performance.now();\n    console.log(`${key} выполнился за ${(end - start).toFixed(2)}мс`);\n    return result;\n  };\n  \n  return descriptor;\n}\n\nclass DataService {\n  @measure\n  async fetchData(url: string): Promise<any> {\n    const response = await fetch(url);\n    return response.json();\n  }\n}' },
        { type: 'tip', value: 'descriptor.value — это сама функция метода. Заменив её на обёртку, вы добавляете поведение до и после вызова. Не забудьте вернуть descriptor или TypeScript не применит изменения.' }
      ]
    },
    {
      id: 3,
      title: 'Декораторы свойств и аксессоров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор свойства получает target и propertyKey, но не descriptor (свойства не имеют дескриптора при определении). Декоратор аксессора (get/set) работает как декоратор метода.' },
        { type: 'heading', value: 'Декоратор свойства для валидации' },
        { type: 'code', language: 'typescript', value: '// Хранилище метаданных для валидации\nconst requiredFields = new Map<string, string[]>();\n\nfunction required(target: any, key: string) {\n  const className = target.constructor.name;\n  const fields = requiredFields.get(className) || [];\n  fields.push(key);\n  requiredFields.set(className, fields);\n}\n\nfunction validate(obj: any): boolean {\n  const className = obj.constructor.name;\n  const fields = requiredFields.get(className) || [];\n  return fields.every(field => {\n    const val = obj[field];\n    return val !== null && val !== undefined && val !== "";\n  });\n}\n\nclass User {\n  @required\n  name: string = "";\n  \n  @required\n  email: string = "";\n  \n  age?: number;\n}\n\nconst user1 = new User();\nuser1.name = "Алиса";\nuser1.email = "alice@example.com";\nconsole.log(validate(user1)); // true\n\nconst user2 = new User();\nuser2.name = "Боб";\n// email не задан\nconsole.log(validate(user2)); // false' },
        { type: 'heading', value: 'Декоратор аксессора' },
        { type: 'code', language: 'typescript', value: 'function readonly(target: any, key: string, descriptor: PropertyDescriptor) {\n  descriptor.set = undefined; // Запрещаем setter\n  return descriptor;\n}\n\nclass Circle {\n  constructor(private _radius: number) {}\n  \n  @readonly\n  get area(): number {\n    return Math.PI * this._radius ** 2;\n  }\n  \n  // Попытка установить area вызовет ошибку\n}\n\nconst c = new Circle(5);\nconsole.log(c.area.toFixed(2)); // 78.54' },
        { type: 'note', value: 'Декораторы свойств обычно используются для сохранения метаданных (как в примере с validate). Сами по себе они не могут изменить значение свойства — для этого нужна дополнительная логика.' }
      ]
    },
    {
      id: 4,
      title: 'Декораторы параметров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор параметра получает три аргумента: target (прототип), methodName (имя метода), parameterIndex (индекс параметра). Используется для записи метаданных о параметрах.' },
        { type: 'heading', value: 'Базовый декоратор параметра' },
        { type: 'code', language: 'typescript', value: 'const paramMetadata = new Map<string, number[]>();\n\nfunction validate(target: any, methodName: string, paramIndex: number) {\n  const key = `${target.constructor.name}.${methodName}`;\n  const indices = paramMetadata.get(key) || [];\n  indices.push(paramIndex);\n  paramMetadata.set(key, indices);\n}\n\nfunction validateArgs(target: any, key: string, descriptor: PropertyDescriptor) {\n  const original = descriptor.value;\n  descriptor.value = function(...args: any[]) {\n    const metaKey = `${target.constructor.name}.${key}`;\n    const indices = paramMetadata.get(metaKey) || [];\n    for (const i of indices) {\n      if (args[i] === null || args[i] === undefined) {\n        throw new Error(`Параметр ${i} метода ${key} не может быть null/undefined`);\n      }\n    }\n    return original.apply(this, args);\n  };\n  return descriptor;\n}\n\nclass OrderService {\n  @validateArgs\n  createOrder(@validate userId: number, @validate product: string): string {\n    return `Заказ от пользователя ${userId} на ${product}`;\n  }\n}\n\nconst service = new OrderService();\nconsole.log(service.createOrder(1, "ноутбук")); // OK\ntry {\n  service.createOrder(null as any, "телефон"); // Ошибка!\n} catch (e: any) {\n  console.error(e.message);\n}' },
        { type: 'tip', value: 'Декораторы параметров сами по себе не могут изменить поведение — они только записывают метаданные. Для реального эффекта их комбинируют с декоратором метода (как validateArgs в примере).' }
      ]
    },
    {
      id: 5,
      title: 'Реальные паттерны: Dependency Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dependency Injection (внедрение зависимостей) — один из главных сценариев применения декораторов. Фреймворки Angular и NestJS строятся на этом паттерне. Простая реализация поможет понять принцип.' },
        { type: 'heading', value: 'Простой DI-контейнер' },
        { type: 'code', language: 'typescript', value: 'type Constructor<T = any> = new (...args: any[]) => T;\n\n// Простой контейнер\nconst container = new Map<string, any>();\n\nfunction Injectable(token: string) {\n  return function(constructor: Constructor) {\n    container.set(token, new constructor());\n  };\n}\n\nfunction Inject(token: string) {\n  return function(target: any, key: string) {\n    Object.defineProperty(target, key, {\n      get: () => container.get(token),\n      enumerable: true,\n    });\n  };\n}\n\n@Injectable("logger")\nclass Logger {\n  log(msg: string): void {\n    console.log(`[LOG] ${msg}`);\n  }\n}\n\n@Injectable("userService")\nclass UserService {\n  @Inject("logger")\n  private logger!: Logger;\n  \n  createUser(name: string): void {\n    this.logger.log(`Создан пользователь: ${name}`);\n  }\n}\n\nconst userService = container.get("userService") as UserService;\nuserService.createUser("Алиса");\n// [LOG] Создан пользователь: Алиса' },
        { type: 'note', value: 'В реальных фреймворках (NestJS, Angular) DI значительно сложнее: используется reflect-metadata для хранения типов параметров, есть scopes (singleton, transient, request), иерархические контейнеры.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Декораторы для API-роутера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему декораторов для описания REST API роутов в стиле NestJS. Создайте декораторы @Controller, @Get, @Post и функцию регистрации роутов.',
      requirements: [
        'Декоратор @Controller(prefix: string) — задаёт базовый путь',
        'Декораторы @Get(path: string) и @Post(path: string) — регистрируют маршруты',
        'Функция getRoutes(controller: any): Route[] — извлекает все маршруты',
        'Интерфейс Route с полями: method, path, handler',
        'Протестируйте на классе UserController с методами getUsers и createUser'
      ],
      hint: 'Используйте Map или Reflect.metadata для хранения метаданных. Декораторы класса и методов должны сохранять информацию, а getRoutes — её читать.',
      expectedOutput: 'GET /users -> getUsers\nGET /users/:id -> getUserById\nPOST /users -> createUser',
      solution: 'interface Route {\n  method: "GET" | "POST";\n  path: string;\n  handler: string;\n}\n\nconst routesMeta = new Map<string, Route[]>();\nconst prefixMeta = new Map<string, string>();\n\nfunction Controller(prefix: string) {\n  return function(constructor: Function) {\n    prefixMeta.set(constructor.name, prefix);\n  };\n}\n\nfunction createMethodDecorator(method: "GET" | "POST") {\n  return function(path: string) {\n    return function(target: any, key: string) {\n      const className = target.constructor.name;\n      const routes = routesMeta.get(className) || [];\n      routes.push({ method, path, handler: key });\n      routesMeta.set(className, routes);\n    };\n  };\n}\n\nconst Get = createMethodDecorator("GET");\nconst Post = createMethodDecorator("POST");\n\nfunction getRoutes(instance: any): Route[] {\n  const className = instance.constructor.name;\n  const prefix = prefixMeta.get(className) || "";\n  const routes = routesMeta.get(className) || [];\n  return routes.map(r => ({ ...r, path: prefix + r.path }));\n}\n\n@Controller("/users")\nclass UserController {\n  @Get("")\n  getUsers(): string {\n    return "Список пользователей";\n  }\n  \n  @Get("/:id")\n  getUserById(): string {\n    return "Один пользователь";\n  }\n  \n  @Post("")\n  createUser(): string {\n    return "Создан пользователь";\n  }\n}\n\nconst controller = new UserController();\nconst routes = getRoutes(controller);\nroutes.forEach(r => console.log(`${r.method} ${r.path} -> ${r.handler}`));\n// GET /users -> getUsers\n// GET /users/:id -> getUserById\n// POST /users -> createUser',
      explanation: 'Система декораторов хранит метаданные в Map. Controller сохраняет prefix, Get/Post добавляют маршруты. getRoutes собирает всё вместе, объединяя prefix и path каждого маршрута. Это упрощённая версия механизма NestJS.'
    }
  ]
}
