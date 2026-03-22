export default {
  id: 6,
  title: 'Функции и типизация',
  description: 'Типизация функций в TypeScript: параметры, возвращаемые значения, перегрузки, дженерик-функции и функциональные типы.',
  lessons: [
    {
      id: 1,
      title: 'Типизация параметров и возвращаемого значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript позволяет явно указать типы всех параметров и возвращаемого значения функции.' },
        { type: 'code', language: 'typescript', value: '// Базовая типизация\nfunction add(a: number, b: number): number {\n    return a + b;\n}\n\n// Стрелочная функция\nconst multiply = (a: number, b: number): number => a * b;\n\n// Тип возвращаемого значения — лучше указывать явно\nfunction divide(a: number, b: number): number {\n    if (b === 0) throw new Error("Деление на ноль");\n    return a / b;\n}\n\n// Функция без возвращаемого значения\nfunction logError(message: string): void {\n    console.error(`Ошибка: ${message}`);\n}\n\n// Асинхронная функция\nasync function fetchUser(id: number): Promise<User> {\n    const response = await fetch(`/api/users/${id}`);\n    return response.json();\n}' },
        { type: 'tip', value: 'Всегда указывайте тип возвращаемого значения для публичных функций — это документация и защита от случайного изменения.' }
      ]
    },
    {
      id: 2,
      title: 'Опциональные и дефолтные параметры',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Опциональный параметр\nfunction greet(name: string, greeting?: string): string {\n    // greeting имеет тип string | undefined\n    return `${greeting ?? "Привет"}, ${name}!`;\n}\nconsole.log(greet("Алибек"));           // "Привет, Алибек!"\nconsole.log(greet("Алибек", "Сәлем")); // "Сәлем, Алибек!"\n\n// Параметр со значением по умолчанию\nfunction repeat(text: string, times: number = 3): string {\n    return text.repeat(times);\n}\nconsole.log(repeat("ha")); // "hahaha"\n\n// Rest параметры\nfunction joinStrings(separator: string, ...parts: string[]): string {\n    return parts.join(separator);\n}\nconsole.log(joinStrings(", ", "один", "два", "три")); // "один, два, три"' },
        { type: 'note', value: 'Опциональные и rest параметры должны быть после обязательных. Дефолтный параметр делает его опциональным автоматически.' }
      ]
    },
    {
      id: 3,
      title: 'Функциональные типы и callback',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции в TypeScript — объекты первого класса. Тип функции описывает её сигнатуру.' },
        { type: 'code', language: 'typescript', value: '// Тип функции через type alias\ntype Transformer = (input: string) => string;\ntype Comparator<T> = (a: T, b: T) => number;\n\nconst upperCase: Transformer = s => s.toUpperCase();\nconst numCompare: Comparator<number> = (a, b) => a - b;\n\n// Функция принимает callback\nfunction processItems<T, R>(\n    items: T[],\n    transform: (item: T) => R\n): R[] {\n    return items.map(transform);\n}\n\nconst numbers = [1, 2, 3];\nconst doubled = processItems(numbers, n => n * 2); // number[]\nconst asStrings = processItems(numbers, n => n.toString()); // string[]\n\n// Callback с несколькими параметрами\nfunction forEach<T>(\n    arr: T[],\n    callback: (item: T, index: number) => void\n): void {\n    arr.forEach(callback);\n}' },
        { type: 'tip', value: '(item: T) => void — тип callback-функции которая ничего не возвращает. void в типе функции означает что возвращаемое значение игнорируется.' }
      ]
    },
    {
      id: 4,
      title: 'Перегрузка функций (Overloads)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перегрузка функций позволяет описать несколько сигнатур для одной функции с разными типами аргументов.' },
        { type: 'code', language: 'typescript', value: '// Сигнатуры перегрузки\nfunction format(value: string): string;\nfunction format(value: number): string;\nfunction format(value: Date): string;\n\n// Реализация (должна быть совместима со всеми)\nfunction format(value: string | number | Date): string {\n    if (typeof value === "string") return value.trim();\n    if (typeof value === "number") return value.toFixed(2);\n    return value.toISOString().split("T")[0];\n}\n\nconsole.log(format("  hello  "));  // "hello"\nconsole.log(format(3.14159));      // "3.14"\nconsole.log(format(new Date()));   // "2024-01-15"' },
        { type: 'note', value: 'Перегрузка описывает публичный API. Реализующая сигнатура (с | union) не видна вызывающему коду. Используйте перегрузку когда возвращаемый тип зависит от входного.' }
      ]
    },
    {
      id: 5,
      title: 'this в функциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript позволяет аннотировать тип this в функциях через специальный первый параметр (не влияет на сигнатуру).' },
        { type: 'code', language: 'typescript', value: 'interface Counter {\n    count: number;\n    increment(this: Counter): void;\n    getCount(this: Counter): number;\n}\n\nconst counter: Counter = {\n    count: 0,\n    increment(this: Counter) {\n        this.count++;\n    },\n    getCount(this: Counter) {\n        return this.count;\n    }\n};\n\n// Ошибка: потеря контекста\n// const { increment } = counter;\n// increment(); // "this" не Counter!\n\n// Правильно\nconst boundIncrement = counter.increment.bind(counter);\nboundIncrement(); // OK' },
        { type: 'tip', value: 'noImplicitThis: true в tsconfig — TypeScript будет требовать явной аннотации this в функциях где его тип неочевиден.' }
      ]
    },
    {
      id: 6,
      title: 'Функции высшего порядка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции высшего порядка — функции принимающие или возвращающие функции. TypeScript полностью типизирует их.' },
        { type: 'code', language: 'typescript', value: '// Каррирование (currying)\nfunction curriedAdd(a: number): (b: number) => number {\n    return (b: number) => a + b;\n}\nconst add5 = curriedAdd(5);\nconsole.log(add5(3)); // 8\nconsole.log(add5(10)); // 15\n\n// Memoization\nfunction memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {\n    const cache = new Map<string, unknown>();\n    return ((...args: unknown[]) => {\n        const key = JSON.stringify(args);\n        if (cache.has(key)) return cache.get(key);\n        const result = fn(...args);\n        cache.set(key, result);\n        return result;\n    }) as T;\n}\n\nconst expensiveCalc = memoize((n: number) => {\n    console.log("Вычисляем...");\n    return n * n;\n});\nconsole.log(expensiveCalc(5)); // "Вычисляем..." 25\nconsole.log(expensiveCalc(5)); // 25 (из кэша)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: типизированный пайплайн',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типизированный пайплайн функций: compose и pipe.',
      requirements: [
        'type UnaryFn<A, B> = (a: A) => B',
        'function pipe<A, B, C>(f: UnaryFn<A,B>, g: UnaryFn<B,C>): UnaryFn<A,C>',
        'function pipe<A,B,C,D>(...) перегрузка для 3 функций',
        'Пример: pipe(trim, toNumber, double) преобразует строку -> число -> удвоение',
        'Результат pipe("  5  ") = 10'
      ],
      expectedOutput: '10\nПРИВЕТ МИР',
      hint: 'pipe возвращает (a: A) => g(f(a)). TypeScript выведет типы из дженериков.',
      solution: 'type UnaryFn<A, B> = (a: A) => B;\n\nfunction pipe<A, B, C>(f: UnaryFn<A, B>, g: UnaryFn<B, C>): UnaryFn<A, C>;\nfunction pipe<A, B, C, D>(f: UnaryFn<A, B>, g: UnaryFn<B, C>, h: UnaryFn<C, D>): UnaryFn<A, D>;\nfunction pipe(...fns: Array<(x: unknown) => unknown>): (x: unknown) => unknown {\n    return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);\n}\n\nconst trim = (s: string) => s.trim();\nconst toNumber = (s: string) => Number(s);\nconst double = (n: number) => n * 2;\n\nconst pipeline = pipe(trim, toNumber, double);\nconsole.log(pipeline("  5  ")); // 10\n\nconst upperTrim = pipe((s: string) => s.trim(), (s: string) => s.toUpperCase());\nconsole.log(upperTrim("  привет мир  ")); // ПРИВЕТ МИР',
      explanation: 'pipe комбинирует функции так что выход одной становится входом следующей. Перегрузки дают TypeScript информацию о типах на каждом шаге.'
    }
  ]
}
