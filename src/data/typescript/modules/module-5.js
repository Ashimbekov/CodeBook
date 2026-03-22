export default {
  id: 5,
  title: 'Объекты и интерфейсы',
  description: 'Типизация объектов, interface, опциональные свойства, readonly, extends и разница между interface и type.',
  lessons: [
    {
      id: 1,
      title: 'Типизация объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript позволяет описывать форму объектов через тип объекта прямо в аннотации или через именованный interface.' },
        { type: 'code', language: 'typescript', value: '// Встроенная типизация объекта\nfunction printUser(user: { name: string; age: number }): void {\n    console.log(`${user.name}, ${user.age} лет`);\n}\n\n// Именованный интерфейс\ninterface User {\n    name: string;\n    age: number;\n}\n\nfunction printUser(user: User): void {\n    console.log(`${user.name}, ${user.age} лет`);\n}\n\nconst user: User = { name: "Алибек", age: 25 };\nprintUser(user);\n\n// Лишние поля — ошибка при прямом присвоении\nconst bad: User = { name: "Алибек", age: 25, city: "Алматы" }; // Ошибка!' },
        { type: 'note', value: 'TypeScript использует структурную типизацию: если объект имеет все нужные поля с нужными типами — он совместим с типом, даже если создан без явной аннотации.' }
      ]
    },
    {
      id: 2,
      title: 'Опциональные свойства и readonly',
      type: 'theory',
      content: [
        { type: 'text', value: 'Знак ? делает свойство опциональным. readonly запрещает изменение после создания объекта.' },
        { type: 'code', language: 'typescript', value: 'interface Profile {\n    readonly id: number;      // нельзя изменить\n    name: string;             // обязательное\n    email?: string;           // опциональное (string | undefined)\n    age?: number;             // опциональное\n    readonly createdAt: Date; // нельзя изменить\n}\n\nconst profile: Profile = {\n    id: 1,\n    name: "Айгерим",\n    createdAt: new Date()\n};\n\n// profile.id = 2; — Ошибка: Cannot assign to "id"\nprofile.name = "Жанар"; // OK\nprofile.email = "jane@example.com"; // OK (опциональное но назначаемое)\n\n// Работа с опциональными полями\nconst greeting = profile.email\n    ? `Привет, пиши на ${profile.email}`\n    : `Привет, ${profile.name}!`;' },
        { type: 'tip', value: 'readonly на интерфейсе — только TypeScript-проверка. Object.freeze() делает объект неизменяемым в рантайме. Для полной неизменяемости нужно оба.' }
      ]
    },
    {
      id: 3,
      title: 'Расширение интерфейсов (extends)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерфейсы могут наследовать свойства других интерфейсов через extends. Это позволяет строить иерархии типов.' },
        { type: 'code', language: 'typescript', value: 'interface Animal {\n    name: string;\n    age: number;\n}\n\ninterface Pet extends Animal {\n    owner: string;\n    isVaccinated: boolean;\n}\n\ninterface Dog extends Pet {\n    breed: string;\n    canFetch: boolean;\n}\n\nconst dog: Dog = {\n    name: "Барсик",\n    age: 3,\n    owner: "Алибек",\n    isVaccinated: true,\n    breed: "Лабрадор",\n    canFetch: true\n};\n\n// Множественное наследование\ninterface Flyable { fly(): void; }\ninterface Swimmable { swim(): void; }\ninterface Duck extends Animal, Flyable, Swimmable { quack(): void; }' },
        { type: 'note', value: 'Интерфейс может наследовать несколько интерфейсов через запятую: interface C extends A, B. В отличие от классов, это не создаёт конфликтов.' }
      ]
    },
    {
      id: 4,
      title: 'Индексируемые типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Index signatures позволяют описать объекты с динамическими ключами, когда имена свойств заранее неизвестны.' },
        { type: 'code', language: 'typescript', value: '// Объект с динамическими строковыми ключами\ninterface Dictionary {\n    [key: string]: string;\n}\n\nconst translations: Dictionary = {\n    hello: "привет",\n    world: "мир",\n    cat: "кот"\n};\n\nconsole.log(translations["hello"]); // "привет"\n\n// Смешивание фиксированных и динамических ключей\ninterface Config {\n    host: string;        // фиксированное\n    port: number;        // фиксированное\n    [key: string]: unknown; // дополнительные произвольные\n}\n\n// Record<K, V> — удобный тип для словаря\nconst scores: Record<string, number> = {\n    Алибек: 95,\n    Айгерим: 88\n};' },
        { type: 'tip', value: 'Record<string, number> — то же что { [key: string]: number } но более читаемо. Предпочитайте Record для простых словарей.' }
      ]
    },
    {
      id: 5,
      title: 'Слияние интерфейсов (Declaration Merging)',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript несколько объявлений одного интерфейса автоматически сливаются. Это уникальная возможность интерфейсов (type так не умеет).' },
        { type: 'code', language: 'typescript', value: 'interface Window {\n    title: string;\n}\n\n// Второе объявление СЛИВАЕТСЯ с первым\ninterface Window {\n    width: number;\n    height: number;\n}\n\n// Итог: Window имеет все три поля\nconst win: Window = {\n    title: "Моё окно",\n    width: 1920,\n    height: 1080\n};\n\n// Практическое применение: расширение глобальных типов\n// В файле globals.d.ts:\ndeclare global {\n    interface Window {\n        myCustomProp: string; // Добавляем поле к встроенному Window\n    }\n}' },
        { type: 'note', value: 'Declaration merging используется для расширения типов библиотек без изменения исходного кода. Это называется "ambient augmentation".' }
      ]
    },
    {
      id: 6,
      title: 'interface vs type: когда что использовать',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Сходства и различия' },
        { type: 'list', value: 'Оба описывают форму объекта\ninterface: расширяемый через extends, поддерживает слияние\ntype: поддерживает Union, Intersection, Conditional types, mapped types\ninterface: лучше для публичного API библиотек (возможность расширения)\ntype: лучше для вычисляемых и сложных типов' },
        { type: 'code', language: 'typescript', value: '// interface — хорошо для объектов\ninterface User {\n    name: string;\n    age: number;\n}\n\n// type — хорошо для union, сложных типов\ntype ID = string | number;\ntype Status = "active" | "inactive" | "pending";\ntype Nullable<T> = T | null;\n\n// Оба могут описывать функции\ninterface Greet { (name: string): string; }\ntype Greet = (name: string) => string;\n\n// Правило: для объектов используйте interface, для остального — type' },
        { type: 'tip', value: 'Большинство стайлгайдов (включая TypeScript официальный) рекомендуют interface для объектов и type для всего остального.' }
      ]
    },
    {
      id: 7,
      title: 'Структурная типизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript использует структурную типизацию (duck typing): если объект имеет нужные поля — он совместим с типом, независимо от того как создан.' },
        { type: 'code', language: 'typescript', value: 'interface Point {\n    x: number;\n    y: number;\n}\n\nfunction printPoint(p: Point): void {\n    console.log(`(${p.x}, ${p.y})`);\n}\n\n// Явно типизированный объект\nconst p1: Point = { x: 1, y: 2 };\nprintPoint(p1); // OK\n\n// Объект без аннотации — тоже OK (структура совпадает!)\nconst p2 = { x: 3, y: 4, z: 5 }; // Лишнее поле z\nprintPoint(p2); // OK — лишние поля разрешены в переменных\n\nclass Circle {\n    constructor(public x: number, public y: number, public radius: number) {}\n}\nprintPoint(new Circle(0, 0, 5)); // OK — Circle имеет x и y' },
        { type: 'note', value: 'Структурная типизация — мощная концепция. Класс совместим с интерфейсом если имеет все нужные поля, даже без явного implements.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: система типов для API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте интерфейсы для типичного REST API ответа.',
      requirements: [
        'interface ApiResponse<T> { data: T; status: number; message: string; }',
        'interface PaginatedResponse<T> extends ApiResponse<T[]> { total: number; page: number; perPage: number; }',
        'interface User { id: number; name: string; email: string; createdAt: string; }',
        'Функция mockGetUsers(): PaginatedResponse<User> — возвращает тестовые данные',
        'Функция printUsers(response: PaginatedResponse<User>): void'
      ],
      expectedOutput: 'Страница 1 из 1. Всего: 2\nПользователи: Алибек (alibek@test.com), Жанар (zhanar@test.com)',
      hint: 'PaginatedResponse<T> extends ApiResponse<T[]> — data теперь массив T.',
      solution: 'interface ApiResponse<T> {\n    data: T;\n    status: number;\n    message: string;\n}\n\ninterface PaginatedResponse<T> extends ApiResponse<T[]> {\n    total: number;\n    page: number;\n    perPage: number;\n}\n\ninterface User {\n    id: number;\n    name: string;\n    email: string;\n    createdAt: string;\n}\n\nfunction mockGetUsers(): PaginatedResponse<User> {\n    return {\n        data: [\n            { id: 1, name: "Алибек", email: "alibek@test.com", createdAt: "2024-01-01" },\n            { id: 2, name: "Жанар", email: "zhanar@test.com", createdAt: "2024-01-02" }\n        ],\n        status: 200,\n        message: "OK",\n        total: 2,\n        page: 1,\n        perPage: 10\n    };\n}\n\nfunction printUsers(response: PaginatedResponse<User>): void {\n    console.log(`Страница ${response.page} из ${Math.ceil(response.total / response.perPage)}. Всего: ${response.total}`);\n    const list = response.data.map(u => `${u.name} (${u.email})`).join(", ");\n    console.log(`Пользователи: ${list}`);\n}\n\nprintUsers(mockGetUsers());',
      explanation: 'Дженерик интерфейс ApiResponse<T> параметризует тип данных. extends ApiResponse<T[]> наследует все поля и переопределяет data как массив.'
    }
  ]
}
