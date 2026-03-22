export default {
  id: 2,
  title: 'Установка и настройка',
  description: 'Установка TypeScript, создание проекта, настройка tsconfig.json и основные опции компилятора.',
  lessons: [
    {
      id: 1,
      title: 'Установка TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript устанавливается через npm (Node Package Manager). Нужен Node.js версии 16 или выше.' },
        { type: 'code', language: 'typescript', value: '# Глобальная установка (рекомендуется для начала)\nnpm install -g typescript\n\n# Проверка версии\ntsc --version\n# Вывод: Version 5.x.x\n\n# Локальная установка в проект (рекомендуется для команд)\nnpm install --save-dev typescript' },
        { type: 'heading', value: 'Команды компилятора tsc' },
        { type: 'list', value: 'tsc file.ts — компилирует один файл\ntsc — компилирует весь проект по tsconfig.json\ntsc --watch — режим отслеживания изменений\ntsc --noEmit — только проверяет типы, не создаёт JS\ntsc --init — создаёт tsconfig.json' },
        { type: 'tip', value: 'Для быстрого запуска TS-файлов без компиляции используйте ts-node: npm install -g ts-node. Команда: ts-node file.ts' }
      ]
    },
    {
      id: 2,
      title: 'tsconfig.json: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'tsconfig.json — файл конфигурации TypeScript-проекта. Он указывает компилятору какие файлы компилировать и с какими настройками.' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json (создаётся командой tsc --init)\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "esModuleInterop": true\n  },\n  "include": ["src/**/*"],\n  "exclude": ["node_modules", "dist"]\n}' },
        { type: 'note', value: '"strict": true включает сразу несколько проверок: noImplicitAny, strictNullChecks и другие. Всегда используйте strict в новых проектах!' }
      ]
    },
    {
      id: 3,
      title: 'Ключевые опции компилятора',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Важные опции tsconfig' },
        { type: 'list', value: 'target: ES версия выходного JS (ES5, ES2020, ESNext)\nmodule: система модулей (commonjs для Node, ESNext для браузера)\nstrict: включить все строгие проверки\nstrictNullChecks: null/undefined не совместимы с другими типами\nnoImplicitAny: запрет неявного типа any\noutDir: куда компилировать JS-файлы\nrootDir: корень исходников\nsourceMap: генерировать source maps для отладки' },
        { type: 'code', language: 'typescript', value: '// При strictNullChecks: true\nfunction getLength(s: string | null): number {\n    // Ошибка без проверки: Object is possibly "null"\n    // return s.length;\n\n    // Правильно: проверяем null\n    return s?.length ?? 0;\n}' },
        { type: 'tip', value: 'sourceMap: true позволяет отлаживать TypeScript-код в браузере/Node, хотя реально работает скомпилированный JS.' }
      ]
    },
    {
      id: 4,
      title: 'Структура TypeScript-проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартная структура TypeScript-проекта для Node.js.' },
        { type: 'code', language: 'typescript', value: 'my-project/\n├── src/\n│   ├── index.ts\n│   ├── types/\n│   │   └── index.ts\n│   └── utils/\n│       └── helpers.ts\n├── dist/           (сгенерированные JS файлы)\n├── node_modules/\n├── package.json\n├── tsconfig.json\n└── .gitignore      (добавьте dist/ и node_modules/)' },
        { type: 'code', language: 'typescript', value: '// package.json — скрипты для TS-проекта\n{\n  "scripts": {\n    "build": "tsc",\n    "dev": "ts-node src/index.ts",\n    "watch": "tsc --watch",\n    "type-check": "tsc --noEmit"\n  }\n}' },
        { type: 'note', value: 'dist/ добавляйте в .gitignore — это сгенерированный код, который воспроизводится командой npm run build.' }
      ]
    },
    {
      id: 5,
      title: 'Типы для сторонних библиотек (@types)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство популярных JS-библиотек написаны без типов. Для них существуют отдельные пакеты с типами — @types/название.' },
        { type: 'code', language: 'typescript', value: '# Установка типов для Node.js и Express\nnpm install --save-dev @types/node @types/express\n\n# После установки TypeScript знает типы Express\nimport express, { Request, Response } from "express";\n\nconst app = express();\n\napp.get("/hello", (req: Request, res: Response) => {\n    // Полное автодополнение: req.params, req.body, res.json...\n    res.json({ message: "Привет!" });\n});\n\napp.listen(3000);' },
        { type: 'tip', value: 'Современные библиотеки (Zod, Prisma, tRPC) включают типы в основной пакет. @types нужны для старых библиотек без встроенной типизации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте tsconfig.json для типичного Node.js проекта и напишите проверочный файл.',
      requirements: [
        'target: "ES2020"',
        'strict: true',
        'outDir: "./dist"',
        'rootDir: "./src"',
        'Создайте src/index.ts с интерфейсом Person и функцией greetPerson',
        'Интерфейс: { name: string, age: number, city: string }'
      ],
      expectedOutput: 'Привет! Меня зовут Дамир, мне 28 лет, я из Астаны.',
      hint: 'interface Person { name: string; age: number; city: string; }',
      solution: '// tsconfig.json\n// { "compilerOptions": { "target": "ES2020", "strict": true, "outDir": "./dist", "rootDir": "./src" } }\n\n// src/index.ts\ninterface Person {\n    name: string;\n    age: number;\n    city: string;\n}\n\nfunction greetPerson(person: Person): string {\n    return `Привет! Меня зовут ${person.name}, мне ${person.age} лет, я из ${person.city}.`;\n}\n\nconst person: Person = { name: "Дамир", age: 28, city: "Астаны" };\nconsole.log(greetPerson(person));',
      explanation: 'tsconfig.json управляет поведением компилятора для всего проекта. strict: true — обязательная настройка для надёжного TypeScript-кода.'
    }
  ]
}
