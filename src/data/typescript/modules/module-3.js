export default {
  id: 3,
  title: 'Базовые типы',
  description: 'Примитивные типы TypeScript: string, number, boolean, null, undefined, symbol, bigint, any, unknown, never, void.',
  lessons: [
    {
      id: 1,
      title: 'Примитивные типы: string, number, boolean',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript имеет три основных примитивных типа, соответствующих примитивам JavaScript.' },
        { type: 'code', language: 'typescript', value: '// string — текстовые данные\nlet firstName: string = "Айгерим";\nlet greeting: string = `Привет, ${firstName}!`;\nlet multiline: string = "Строка одна\\nСтрока два";\n\n// number — все числа (целые и дробные)\nlet age: number = 25;\nlet pi: number = 3.14159;\nlet hex: number = 0xFF;\nlet binary: number = 0b1010;\n\n// boolean — истина или ложь\nlet isActive: boolean = true;\nlet hasPermission: boolean = false;\nlet isAdult: boolean = age >= 18;' },
        { type: 'note', value: 'В TypeScript нет отдельных типов int, float, double — только number. Это соответствует JavaScript, где все числа — 64-битные числа с плавающей точкой.' }
      ]
    },
    {
      id: 2,
      title: 'null, undefined и strictNullChecks',
      type: 'theory',
      content: [
        { type: 'text', value: 'null и undefined — отдельные типы в TypeScript. При strictNullChecks: true они не совместимы с другими типами.' },
        { type: 'code', language: 'typescript', value: '// Без strictNullChecks (плохо)\nlet name: string = null;      // OK (но опасно!)\n\n// С strictNullChecks: true (хорошо)\nlet name: string = null;      // Ошибка!\nlet name: string | null = null; // OK — явно разрешаем null\nlet name: string | undefined;   // OK — может быть не задано\n\n// Практический пример\nfunction findUser(id: number): User | null {\n    return id === 1 ? { name: "Алибек" } : null;\n}\n\nconst user = findUser(2);\n// user.name — Ошибка: Object is possibly "null"\nconsole.log(user?.name ?? "Пользователь не найден");' },
        { type: 'tip', value: 'string | null — "nullable string". Это явно показывает в коде, что значение может отсутствовать. Всегда лучше явного null в типе!' }
      ]
    },
    {
      id: 3,
      title: 'any, unknown, never',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Три специальных типа' },
        { type: 'code', language: 'typescript', value: '// any — отключает проверку типов (избегайте!)\nlet x: any = "строка";\nx = 42;       // OK\nx = true;     // OK\nx.anything(); // OK — но может упасть в рантайме!\n\n// unknown — безопасная альтернатива any\nlet y: unknown = "строка";\ny = 42;       // OK\n// y.toFixed(); // Ошибка: нужно сначала проверить тип\nif (typeof y === "number") {\n    y.toFixed(); // OK после проверки\n}\n\n// never — тип для невозможных значений\nfunction throwError(msg: string): never {\n    throw new Error(msg);\n}\nfunction infiniteLoop(): never {\n    while (true) {}\n}' },
        { type: 'warning', value: 'any полностью отключает TypeScript для переменной. Используйте unknown если тип неизвестен — он безопаснее, так как требует проверку перед использованием.' }
      ]
    },
    {
      id: 4,
      title: 'void и функции без возвращаемого значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'void — тип функций, которые ничего не возвращают (или возвращают undefined). Используется как тип возвращаемого значения.' },
        { type: 'code', language: 'typescript', value: '// void — функция не возвращает значение\nfunction logMessage(msg: string): void {\n    console.log(msg);\n    // return; — OK\n    // return undefined; — OK\n    // return 42; — Ошибка!\n}\n\n// undefined как тип переменной\nlet u: undefined = undefined;\n// u = "строка"; — Ошибка!\n\n// Разница void vs undefined\ntype VoidFn = () => void;\ntype UndefinedFn = () => undefined;\n\nconst f1: VoidFn = () => { }; // OK\nconst f2: UndefinedFn = () => undefined; // OK\nconst f3: UndefinedFn = () => { }; // Ошибка!' },
        { type: 'note', value: 'void и undefined похожи, но void более семантичен для функций: "эта функция не возвращает полезного значения". undefined — конкретное значение.' }
      ]
    },
    {
      id: 5,
      title: 'symbol и bigint',
      type: 'theory',
      content: [
        { type: 'text', value: 'symbol и bigint — менее распространённые примитивы JavaScript, также поддерживаемые TypeScript.' },
        { type: 'code', language: 'typescript', value: '// symbol — уникальный идентификатор\nconst id1: symbol = Symbol("id");\nconst id2: symbol = Symbol("id");\nconsole.log(id1 === id2); // false — каждый Symbol уникален\n\n// Полезно для ключей объекта без коллизий\nconst USER_KEY = Symbol("userKey");\nconst obj = { [USER_KEY]: "секретные данные" };\n\n// bigint — очень большие целые числа\nconst bigNumber: bigint = 9007199254740993n;\nconst sum: bigint = bigNumber + 1n;\nconsole.log(sum); // 9007199254740994n\n\n// Нельзя смешивать bigint и number\n// const mixed = bigNumber + 1; — Ошибка!',
        },
        { type: 'tip', value: 'bigint нужен когда числа превышают Number.MAX_SAFE_INTEGER (2^53 - 1). Типично для криптографии, финансов и работы с ID из 64-битных систем.' }
      ]
    },
    {
      id: 6,
      title: 'Приведение типов (Type Assertions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Type assertion (приведение типов) — способ сказать TypeScript "я знаю тип лучше тебя". Используйте осторожно!' },
        { type: 'code', language: 'typescript', value: '// Синтаксис as Type\nconst input = document.getElementById("input") as HTMLInputElement;\nconsole.log(input.value); // TypeScript знает что это HTMLInputElement\n\n// Без assertion — ошибка\n// document.getElementById("input").value; // Ошибка: value не существует у HTMLElement\n\n// Double assertion через unknown\nconst value: unknown = "hello";\nconst length = (value as unknown as number); // Опасно!\n\n// Лучше — с проверкой\nif (typeof value === "string") {\n    console.log(value.length); // TypeScript знает что это string\n}' },
        { type: 'warning', value: 'Type assertion не делает реального преобразования типов — это только подсказка компилятору. Неправильный assertion приведёт к ошибке в рантайме!' }
      ]
    },
    {
      id: 7,
      title: 'Массивы и readonly',
      type: 'theory',
      content: [
        { type: 'text', value: 'Массивы в TypeScript типизируются как Array<T> или T[]. readonly запрещает изменение после создания.' },
        { type: 'code', language: 'typescript', value: '// Два способа объявить массив\nconst numbers: number[] = [1, 2, 3];\nconst names: Array<string> = ["Алибек", "Айгерим"];\n\n// readonly массив — нельзя изменять\nconst readonlyNums: readonly number[] = [1, 2, 3];\n// readonlyNums.push(4); — Ошибка!\n// readonlyNums[0] = 10; — Ошибка!\n\n// ReadonlyArray<T> — синоним\nconst readonlyNames: ReadonlyArray<string> = ["Алибек"];\n\n// Операции которые создают новый массив — OK!\nconst newNums = [...readonlyNums, 4]; // [1, 2, 3, 4]' },
        { type: 'tip', value: 'readonly массивы хороши для API: возвращайте readonly[] чтобы потребитель не мог случайно изменить ваши внутренние данные.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: типы в действии',
      type: 'practice',
      difficulty: 'easy',
      description: 'Исправьте типизированный код — убедитесь что все типы корректны, нет implicit any, nullable обрабатываются безопасно.',
      requirements: [
        'Переменная score: number (не any)',
        'Функция getGrade(score: number): string — "Отлично" >=90, "Хорошо" >=75, "Удовл." >=60, "Неудовл." иначе',
        'Функция parseScore(input: string): number | null — парсит строку или null если NaN',
        'Вызов parseScore("95") -> getGrade -> вывод с null-проверкой'
      ],
      expectedOutput: 'Оценка: Отлично\nНекорректный ввод',
      hint: 'isNaN(Number(input)) проверяет что строка не является числом.',
      solution: 'function getGrade(score: number): string {\n    if (score >= 90) return "Отлично";\n    if (score >= 75) return "Хорошо";\n    if (score >= 60) return "Удовл.";\n    return "Неудовл.";\n}\n\nfunction parseScore(input: string): number | null {\n    const num = Number(input);\n    return isNaN(num) ? null : num;\n}\n\nconst score1 = parseScore("95");\nif (score1 !== null) {\n    console.log(`Оценка: ${getGrade(score1)}`);\n}\n\nconst score2 = parseScore("abc");\nconsole.log(score2 !== null ? `Оценка: ${getGrade(score2)}` : "Некорректный ввод");',
      explanation: 'number | null явно моделирует возможное отсутствие значения. Проверка !== null перед использованием — паттерн null narrowing.'
    }
  ]
}
