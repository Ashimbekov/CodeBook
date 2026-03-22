export default {
  id: 7,
  title: 'Union и Intersection типы',
  description: 'Union (|) и Intersection (&) типы, discriminated unions, type narrowing и практическое применение.',
  lessons: [
    {
      id: 1,
      title: 'Union типы (|)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Union тип (объединение) описывает значение, которое может быть одним из нескольких типов. Записывается через символ |.' },
        { type: 'code', language: 'typescript', value: '// Переменная может быть строкой или числом\nlet id: string | number;\nid = "abc-123"; // OK\nid = 42;        // OK\n// id = true;  — Ошибка!\n\n// Функция принимает разные типы\nfunction printId(id: string | number): void {\n    // Нельзя вызвать методы одного типа без проверки\n    // id.toUpperCase(); — Ошибка: не у number\n    if (typeof id === "string") {\n        console.log(id.toUpperCase()); // OK — TypeScript знает что string\n    } else {\n        console.log(id.toFixed(2)); // OK — TypeScript знает что number\n    }\n}\n\n// Union в параметрах массива\nconst values: (string | number | boolean)[] = ["hello", 42, true];' },
        { type: 'tip', value: 'Union типы идеальны для значений которые могут прийти из разных источников: ID может быть строкой (UUID) или числом (auto-increment).' }
      ]
    },
    {
      id: 2,
      title: 'Type Narrowing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Type narrowing — сужение типа внутри условных блоков. TypeScript автоматически определяет конкретный тип на основе проверок.' },
        { type: 'code', language: 'typescript', value: 'type StringOrNumber = string | number;\n\nfunction process(value: StringOrNumber): string {\n    // typeof guard\n    if (typeof value === "string") {\n        return value.toUpperCase(); // value: string\n    }\n    return value.toFixed(0); // value: number\n}\n\n// instanceof guard\nfunction formatDate(value: Date | string): string {\n    if (value instanceof Date) {\n        return value.toISOString(); // value: Date\n    }\n    return new Date(value).toISOString(); // value: string\n}\n\n// Truthiness narrowing\nfunction printLength(s: string | null | undefined): void {\n    if (s) {\n        console.log(s.length); // s: string (не null/undefined)\n    } else {\n        console.log("Пустая строка");\n    }\n}' },
        { type: 'note', value: 'Narrowing работает с: typeof, instanceof, in (проверка поля), === (сравнение), truthiness (if(x)), Array.isArray().' }
      ]
    },
    {
      id: 3,
      title: 'Discriminated Unions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Discriminated union — паттерн, где каждый член объединения имеет общее поле-дискриминатор с уникальным литеральным типом.' },
        { type: 'code', language: 'typescript', value: 'interface Circle    { kind: "circle";    radius: number; }\ninterface Rectangle { kind: "rectangle"; width: number; height: number; }\ninterface Triangle  { kind: "triangle";  base: number;  height: number; }\n\ntype Shape = Circle | Rectangle | Triangle;\n\nfunction getArea(shape: Shape): number {\n    switch (shape.kind) {\n        case "circle":\n            return Math.PI * shape.radius ** 2;    // shape: Circle\n        case "rectangle":\n            return shape.width * shape.height;      // shape: Rectangle\n        case "triangle":\n            return 0.5 * shape.base * shape.height; // shape: Triangle\n        default:\n            // TypeScript знает что это невозможно\n            const _never: never = shape;\n            return _never;\n    }\n}' },
        { type: 'tip', value: 'Переменная _never: never в default — защита exhaustiveness. Если добавить новый Shape без обработки, TypeScript выдаст ошибку компиляции!' }
      ]
    },
    {
      id: 4,
      title: 'Intersection типы (&)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Intersection тип (пересечение) объединяет несколько типов в один — результирующий объект должен соответствовать ВСЕМ типам одновременно.' },
        { type: 'code', language: 'typescript', value: 'interface HasName { name: string; }\ninterface HasAge  { age: number; }\ninterface HasEmail { email: string; }\n\n// Intersection: объект должен иметь все поля\ntype Employee = HasName & HasAge & HasEmail & {\n    department: string;\n};\n\nconst emp: Employee = {\n    name: "Алибек",\n    age: 30,\n    email: "alibek@company.com",\n    department: "IT"\n};\n\n// Практический паттерн: добавление метаданных\ntype WithTimestamps<T> = T & {\n    createdAt: Date;\n    updatedAt: Date;\n};\n\ntype TimestampedUser = WithTimestamps<User>;\n// Имеет все поля User + createdAt + updatedAt' },
        { type: 'note', value: 'Intersection в отличие от extends работает и с type aliases, не только с interface. WithTimestamps<T> — паттерн для добавления системных полей.' }
      ]
    },
    {
      id: 5,
      title: 'Union vs Intersection: понимание',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логика Union и Intersection интуитивна для примитивов, но для объектов кажется обратной. Разберём подробнее.' },
        { type: 'code', language: 'typescript', value: 'type A = { a: string; };\ntype B = { b: number; };\n\n// Union A | B: объект имеет поля A ИЛИ B\n// Может быть: только A, только B, или оба\ntype AB_Union = A | B;\nconst u1: AB_Union = { a: "hello" };      // OK (только A)\nconst u2: AB_Union = { b: 42 };           // OK (только B)\nconst u3: AB_Union = { a: "hi", b: 42 }; // OK (оба)\n// Но: нельзя безопасно обратиться к u1.b — не факт что есть!\n\n// Intersection A & B: объект имеет поля A И B\n// Обязательно все поля обоих типов\ntype AB_Inter = A & B;\nconst i1: AB_Inter = { a: "hello", b: 42 }; // OK (все поля)\n// const i2: AB_Inter = { a: "hello" }; — Ошибка: нет b' },
        { type: 'note', value: 'Для объектов: Union расширяет набор допустимых значений, Intersection сужает (требует больше полей). Для примитивов наоборот.' }
      ]
    },
    {
      id: 6,
      title: 'Result тип с Union',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн Result — типобезопасная альтернатива throw/catch. Функция возвращает Success или Failure.' },
        { type: 'code', language: 'typescript', value: 'type Success<T> = { ok: true;  value: T; };\ntype Failure<E>  = { ok: false; error: E; };\ntype Result<T, E = string> = Success<T> | Failure<E>;\n\nfunction divide(a: number, b: number): Result<number> {\n    if (b === 0) return { ok: false, error: "Деление на ноль" };\n    return { ok: true, value: a / b };\n}\n\nconst result = divide(10, 2);\nif (result.ok) {\n    console.log(`Результат: ${result.value}`); // value: number\n} else {\n    console.log(`Ошибка: ${result.error}`);    // error: string\n}\n\n// Утилита для обработки\nfunction unwrap<T>(result: Result<T>): T {\n    if (!result.ok) throw new Error(result.error);\n    return result.value;\n}' },
        { type: 'tip', value: 'Паттерн Result делает ошибки частью типа функции — вызывающий код обязан их обработать. Это идиома функционального программирования.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: обработчик HTTP-ответов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте типизированный обработчик HTTP-статусов с discriminated union.',
      requirements: [
        'type HttpSuccess<T> = { status: 200 | 201; data: T; }',
        'type HttpError = { status: 400 | 401 | 404 | 500; message: string; }',
        'type HttpResponse<T> = HttpSuccess<T> | HttpError',
        'Функция handleResponse<T>(resp: HttpResponse<T>): string',
        'Вывести "Успех: ..." или "Ошибка N: ..."'
      ],
      expectedOutput: 'Успех: {"id":1,"name":"Алибек"}\nОшибка 404: Пользователь не найден\nОшибка 500: Внутренняя ошибка сервера',
      hint: 'if (resp.status === 200 || resp.status === 201) — TypeScript сузит тип до HttpSuccess.',
      solution: 'type HttpSuccess<T> = { status: 200 | 201; data: T; };\ntype HttpError = { status: 400 | 401 | 404 | 500; message: string; };\ntype HttpResponse<T> = HttpSuccess<T> | HttpError;\n\nfunction handleResponse<T>(resp: HttpResponse<T>): string {\n    if (resp.status === 200 || resp.status === 201) {\n        return `Успех: ${JSON.stringify(resp.data)}`;\n    } else {\n        return `Ошибка ${resp.status}: ${resp.message}`;\n    }\n}\n\ninterface User { id: number; name: string; }\n\nconsole.log(handleResponse<User>({ status: 200, data: { id: 1, name: "Алибек" } }));\nconsole.log(handleResponse<User>({ status: 404, message: "Пользователь не найден" }));\nconsole.log(handleResponse<User>({ status: 500, message: "Внутренняя ошибка сервера" }));',
      explanation: 'Литеральные типы (200 | 201) в status делают union discriminated. TypeScript знает что при status 200/201 — данные есть (data), при ошибочных — только message.'
    }
  ]
}
