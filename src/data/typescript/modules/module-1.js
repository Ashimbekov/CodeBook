export default {
  id: 1,
  title: 'Введение в TypeScript',
  description: 'Что такое TypeScript, зачем он нужен, как он связан с JavaScript, и почему его выбирают крупные проекты.',
  lessons: [
    {
      id: 1,
      title: 'Что такое TypeScript?',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript — это язык программирования, созданный Microsoft в 2012 году. Он является надмножеством JavaScript: любой валидный JS-код является валидным TS-кодом.' },
        { type: 'heading', value: 'Главная идея TypeScript' },
        { type: 'text', value: 'TypeScript добавляет статическую типизацию к JavaScript. Это означает, что типы переменных проверяются во время компиляции, а не во время выполнения.' },
        { type: 'code', language: 'typescript', value: '// JavaScript — ошибка обнаружится только при запуске\nfunction greet(name) {\n    return "Привет, " + name.toUpperCase();\n}\ngreet(42); // TypeError: name.toUpperCase is not a function\n\n// TypeScript — ошибка обнаруживается при написании кода\nfunction greet(name: string): string {\n    return "Привет, " + name.toUpperCase();\n}\ngreet(42); // Ошибка компиляции: Type "number" is not assignable to type "string"' },
        { type: 'tip', value: 'Представьте TypeScript как JavaScript с "подсказчиком": он не даёт вам допустить глупые ошибки с типами ещё до запуска программы.' }
      ]
    },
    {
      id: 2,
      title: 'TypeScript vs JavaScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание разницы между TypeScript и JavaScript поможет вам решить, когда и зачем использовать TypeScript.' },
        { type: 'heading', value: 'Ключевые отличия' },
        { type: 'list', value: 'Типизация: JS динамическая (в рантайме), TS статическая (при компиляции)\nКомпиляция: JS запускается напрямую, TS компилируется в JS\nИнструменты: TS даёт лучше IDE-поддержку (автодополнение, рефакторинг)\nОшибки: TS ловит ошибки типов до запуска\nСовместимость: TS полностью совместим с JS-библиотеками' },
        { type: 'note', value: 'TypeScript компилируется в обычный JavaScript. На сервере и в браузере работает JS — TypeScript существует только при разработке.' }
      ]
    },
    {
      id: 3,
      title: 'Преимущества TypeScript',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Почему стоит учить TypeScript?' },
        { type: 'list', value: 'Раннее обнаружение ошибок — многие баги находятся до запуска\nЛучшая документация кода — типы служат встроенной документацией\nБезопасный рефакторинг — IDE знает все места использования типа\nАвтодополнение — IDE "знает" какие методы есть у объекта\nПопулярность — используется в Angular, Vue 3, Next.js, NestJS' },
        { type: 'code', language: 'typescript', value: 'interface User {\n    id: number;\n    name: string;\n    email: string;\n}\n\nfunction sendEmail(user: User): void {\n    // IDE подскажет: user.id, user.name, user.email\n    console.log(`Отправляем письмо на ${user.email}`);\n}\n\n// Ошибка: пропущено поле email\nconst user = { id: 1, name: "Алибек" };\nsendEmail(user); // Ошибка компиляции!' },
        { type: 'tip', value: 'В 2023 году более 80% опрошенных разработчиков на JavaScript использовали TypeScript. Это де-факто стандарт в коммерческой разработке.' }
      ]
    },
    {
      id: 4,
      title: 'Как работает компилятор TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript компилятор (tsc) преобразует .ts файлы в .js файлы. При этом вся информация о типах удаляется — в итоговом JS её нет.' },
        { type: 'code', language: 'typescript', value: '// Файл: greet.ts\nfunction greet(name: string): string {\n    return `Привет, ${name}!`;\n}\nconsole.log(greet("Мир"));' },
        { type: 'code', language: 'typescript', value: '// Результат компиляции: greet.js\nfunction greet(name) {\n    return `Привет, ${name}!`;\n}\nconsole.log(greet("Мир"));' },
        { type: 'text', value: 'Всё что добавил TypeScript (: string) — исчезает при компиляции. Это называется "type erasure" — стирание типов.' },
        { type: 'note', value: 'TypeScript не добавляет рантайм-проверки типов! Если данные приходят извне (API, пользователь) — нужны дополнительные проверки (Zod, Yup).' }
      ]
    },
    {
      id: 5,
      title: 'Первая программа на TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Напишем и запустим первую программу на TypeScript. Для этого нужен Node.js и npm.' },
        { type: 'code', language: 'typescript', value: '// hello.ts\nconst message: string = "Привет, TypeScript!";\nconst year: number = 2024;\nconst isAwesome: boolean = true;\n\nconsole.log(message);\nconsole.log(`Год: ${year}`);\nconsole.log(`TypeScript классный: ${isAwesome}`);\n\n// Функция с типами\nfunction add(a: number, b: number): number {\n    return a + b;\n}\nconsole.log(`2 + 3 = ${add(2, 3)}`);\n\n// Ошибка компиляции (раскомментируйте чтобы увидеть):\n// add("2", 3);' },
        { type: 'tip', value: 'Попробуйте TypeScript прямо в браузере: typescript-play.js.org — онлайн-площадка без установки.' }
      ]
    },
    {
      id: 6,
      title: 'Вывод типов (Type Inference)',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript умеет автоматически определять типы без явного указания. Это называется выводом типов (type inference).' },
        { type: 'code', language: 'typescript', value: '// TypeScript сам определяет тип\nlet name = "Айгерим";         // тип: string\nlet age = 25;                  // тип: number\nlet scores = [90, 85, 92];    // тип: number[]\nlet active = true;            // тип: boolean\n\n// Это ошибка — TypeScript знает что name это string\nname = 42; // Error: Type "number" is not assignable to type "string"\n\n// Явное указание типа нужно когда вывод невозможен\nlet result: string | number;  // позже присвоим одно из двух' },
        { type: 'note', value: 'Хорошая практика: используйте вывод типов для простых переменных, явные аннотации — для параметров функций и возвращаемых значений.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: первые типы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Объявите типизированные переменные и напишите типизированную функцию.',
      requirements: [
        'Переменная firstName типа string со своим именем',
        'Переменная birthYear типа number',
        'Переменная isStudent типа boolean',
        'Функция introduce(name: string, year: number): string — возвращает строку "Меня зовут X, я родился в Y году"',
        'Вызовите функцию и выведите результат'
      ],
      expectedOutput: 'Меня зовут Алибек, я родился в 2000 году',
      hint: 'Используйте шаблонные строки: `Меня зовут ${name}`',
      solution: 'const firstName: string = "Алибек";\nconst birthYear: number = 2000;\nconst isStudent: boolean = true;\n\nfunction introduce(name: string, year: number): string {\n    return `Меня зовут ${name}, я родился в ${year} году`;\n}\n\nconsole.log(introduce(firstName, birthYear));\nconsole.log(`Студент: ${isStudent}`);',
      explanation: 'Аннотация типа ставится через двоеточие после имени переменной или параметра. Для функций тип возвращаемого значения — после закрывающей скобки.'
    }
  ]
}
