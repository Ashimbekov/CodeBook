export default {
  id: 16,
  title: 'tsconfig.json',
  description: 'Полная настройка TypeScript компилятора: target, module, strict, paths, включение файлов и ключевые опции для разных типов проектов',
  lessons: [
    {
      id: 1,
      title: 'Структура tsconfig.json',
      type: 'theory',
      content: [
        { type: 'text', value: 'tsconfig.json — файл конфигурации TypeScript компилятора (tsc). Он определяет: какие файлы компилировать, в какой JavaScript версию, насколько строгие проверки использовать и многое другое.' },
        { type: 'heading', value: 'Базовая структура' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json\n{\n  "compilerOptions": {\n    // Куда компилировать\n    "target": "ES2020",\n    "module": "ESNext",\n    "outDir": "./dist",\n    "rootDir": "./src",\n\n    // Строгость\n    "strict": true,\n\n    // Разрешение модулей\n    "moduleResolution": "bundler",\n    "esModuleInterop": true,\n\n    // Пути\n    "baseUrl": "src",\n    "paths": { "@/*": ["./*"] }\n  },\n\n  // Какие файлы включить\n  "include": ["src/**/*"],\n\n  // Какие исключить\n  "exclude": ["node_modules", "dist", "**/*.test.ts"]\n}' },
        { type: 'heading', value: 'Генерация tsconfig' },
        { type: 'code', language: 'typescript', value: '// Создать tsconfig с дефолтными настройками:\n// npx tsc --init\n\n// Проверить конфигурацию (показывает все настройки):\n// npx tsc --showConfig\n\n// Компилировать с конкретным конфигом:\n// npx tsc --project tsconfig.prod.json\n\n// Только проверка типов (без компиляции):\n// npx tsc --noEmit' },
        { type: 'note', value: 'Флаг "strict": true включает сразу несколько строгих проверок. Всегда используйте strict: true в новых проектах. Отдельные опции strict можно отключить по необходимости.' }
      ]
    },
    {
      id: 2,
      title: 'target и module — версия JavaScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'target — версия JavaScript, в которую компилируется TypeScript. module — система модулей в скомпилированном коде. Эти две настройки определяют совместимость с рантаймом.' },
        { type: 'heading', value: 'Опция target' },
        { type: 'code', language: 'typescript', value: '// target: в какой JavaScript компилировать\n// "ES5"      — для старых браузеров (IE11)\n// "ES6"/"ES2015" — стрелочные функции, let/const, классы\n// "ES2017"   — async/await нативно\n// "ES2020"   — optional chaining ?., nullish ??\n// "ES2022"   — class fields, top-level await\n// "ESNext"   — последняя версия ES (опасно для prod)\n// "NodeNext" — для Node.js с ESM\n\n// Пример: что делает target с кодом\n// TypeScript:\nconst greet = (name: string): string => `Привет, ${name}!`;\n\n// target: "ES5" -> компилируется в:\nvar greet = function(name) { return "Привет, " + name + "!"; };\n\n// target: "ES2020" -> остаётся почти как есть:\nconst greet = (name) => `Привет, ${name}!`;' },
        { type: 'heading', value: 'Опция module' },
        { type: 'code', language: 'typescript', value: '// module: система модулей в output\n// "CommonJS" — require/module.exports (Node.js legacy)\n// "ESNext"   — import/export (современный браузер, Vite)\n// "NodeNext" — умный для Node.js (ESM + CJS)\n// "bundler"  — для Vite/webpack (рекомендуется с Vite)\n\n// Для Node.js (современный):\n// "module": "NodeNext", "moduleResolution": "NodeNext"\n\n// Для браузера с Vite:\n// "module": "ESNext", "moduleResolution": "bundler"\n\n// Для Node.js (legacy/библиотека):\n// "module": "CommonJS"' },
        { type: 'tip', value: 'Для проектов на Vite используйте module: "ESNext" и moduleResolution: "bundler". Для Node.js 18+ с ESM — module: "NodeNext". Для старых Node.js проектов — module: "CommonJS".' }
      ]
    },
    {
      id: 3,
      title: 'strict и опции строгости',
      type: 'theory',
      content: [
        { type: 'text', value: 'strict: true — один флаг, который включает несколько проверок. Лучше понимать каждую из них, чтобы знать, что именно ловит TypeScript.' },
        { type: 'heading', value: 'Что включает strict: true' },
        { type: 'code', language: 'typescript', value: '// strict: true включает:\n\n// 1. strictNullChecks — null/undefined не совместимы с другими типами\nlet name: string = null; // Ошибка!\nlet name2: string | null = null; // OK\n\n// 2. noImplicitAny — нельзя оставлять переменные с неявным any\nfunction greet(name) { // Ошибка: name имеет тип any\n  return "Привет " + name;\n}\n\n// 3. strictFunctionTypes — строгая проверка типов функций\ntype Fn = (x: number) => void;\nconst fn: Fn = (x: string) => {}; // Ошибка!\n\n// 4. strictPropertyInitialization — свойства класса должны быть\n// инициализированы в конструкторе\nclass User {\n  name: string; // Ошибка! Не инициализировано\n  // Исправление:\n  name2: string = "";\n  name3!: string; // OK — говорим TS "доверяй мне"\n}' },
        { type: 'heading', value: 'Дополнительные полезные опции' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json\n{\n  "compilerOptions": {\n    "strict": true,\n\n    // Дополнительно рекомендуем:\n    "noUnusedLocals": true,      // Ошибка на неиспользованные переменные\n    "noUnusedParameters": true,  // Ошибка на неиспользованные параметры\n    "noImplicitReturns": true,   // Все ветки функции должны возвращать значение\n    "noFallthroughCasesInSwitch": true, // Запрет fallthrough в switch\n    "exactOptionalPropertyTypes": true  // ? означает undefined, а не absent\n  }\n}\n\n// Пример noImplicitReturns:\nfunction getStatus(code: number): string {\n  if (code === 200) return "OK";\n  // Ошибка: не все ветки возвращают string!\n}\n// Исправление:\nfunction getStatus2(code: number): string {\n  if (code === 200) return "OK";\n  return "Unknown";\n}' },
        { type: 'note', value: 'noUnusedLocals и noUnusedParameters помогают держать код чистым. Но они могут мешать при прототипировании. Можно включать только в production конфиге.' }
      ]
    },
    {
      id: 4,
      title: 'lib и типы стандартной библиотеки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Опция lib определяет, какие встроенные типы доступны: DOM API, ES6 методы, Promise, Web APIs. TypeScript включает только те типы, которые подходят вашему target.' },
        { type: 'heading', value: 'Опция lib' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "lib": [\n      "ES2020",    // Стандартные JS типы (Map, Set, Promise...)\n      "DOM",       // document, window, HTMLElement...\n      "DOM.Iterable" // for...of по DOM коллекциям\n    ]\n  }\n}\n\n// Только для Node.js (без DOM):\n// "lib": ["ES2022"]\n// И установить: npm i -D @types/node\n\n// Для React приложения:\n// "lib": ["ES2020", "DOM", "DOM.Iterable"]\n\n// Все возможные значения:\n// ES5, ES6/ES2015, ES2016...ES2023, ESNext\n// DOM, DOM.Iterable, DOM.AsyncIterable\n// WebWorker, ScriptHost\n// ES2015.Promise, ES2015.Proxy и т.д.' },
        { type: 'heading', value: 'types и typeRoots' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json\n{\n  "compilerOptions": {\n    // Включить только эти @types пакеты:\n    "types": ["node", "jest", "lodash"],\n    // По умолчанию включены ВСЕ @types/* в node_modules\n\n    // Где искать @types (по умолчанию node_modules/@types):\n    "typeRoots": [\n      "./node_modules/@types",\n      "./src/types" // Ваши кастомные .d.ts файлы\n    ]\n  }\n}\n\n// Зачем ограничивать types?\n// Если у вас frontend, не нужны типы Node.js\n// (process, Buffer и т.д. не должны быть доступны)\n// Явное лучше неявного!' }
      ]
    },
    {
      id: 5,
      title: 'Несколько tsconfig для разных сред',
      type: 'theory',
      content: [
        { type: 'text', value: 'В реальных проектах часто нужно несколько конфигов: для разработки (с source maps, без строгости), для production (оптимизированный), для тестов (специальные настройки).' },
        { type: 'heading', value: 'Наследование конфигов' },
        { type: 'code', language: 'typescript', value: '// tsconfig.base.json — общие настройки\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "strict": true,\n    "esModuleInterop": true,\n    "resolveJsonModule": true,\n    "baseUrl": "src"\n  }\n}\n\n// tsconfig.json — для разработки\n{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "sourceMap": true,\n    "noUnusedLocals": false // Отключаем при разработке\n  },\n  "include": ["src"]\n}\n\n// tsconfig.prod.json — для production\n{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noImplicitReturns": true\n  },\n  "include": ["src"],\n  "exclude": ["**/*.test.ts", "**/*.spec.ts"]\n}' },
        { type: 'heading', value: 'tsconfig для тестов' },
        { type: 'code', language: 'typescript', value: '// tsconfig.test.json\n{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "types": ["node", "jest", "@testing-library/jest-dom"]\n  },\n  "include": ["src", "tests"]\n}\n\n// package.json\n// {\n//   "scripts": {\n//     "build": "tsc --project tsconfig.prod.json",\n//     "test": "jest --project tsconfig.test.json",\n//     "typecheck": "tsc --noEmit"\n//   }\n// }' },
        { type: 'tip', value: 'extends позволяет создать иерархию конфигов. Дочерний конфиг наследует все настройки родителя и может их переопределить. Это избавляет от дублирования.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка tsconfig для реального проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте tsconfig.json для fullstack TypeScript проекта: фронтенд на Vite+React и бэкенд на Node.js. Создайте базовый конфиг и два наследующих.',
      requirements: [
        'tsconfig.base.json: strict, ES2022, esModuleInterop, resolveJsonModule',
        'tsconfig.json (фронтенд): extends base, target ES2020, lib с DOM, jsx: react-jsx',
        'tsconfig.node.json (бэкенд): extends base, module NodeNext, types только node',
        'В фронтенде: paths с @components и @utils',
        'В бэкенде: outDir ./dist/server, include только src/server'
      ],
      hint: 'Фронтенд и бэкенд имеют разные настройки module: фронтенд использует bundler, бэкенд — NodeNext. jsx нужен только фронтенду. DOM lib нельзя включать в бэкенд.',
      expectedOutput: 'Созданы три конфигурационных файла:\ntsconfig.base.json  — базовые строгие настройки (strict, ES2022, esModuleInterop)\ntsconfig.json       — фронтенд (DOM, JSX react-jsx, paths: @components, @utils)\ntsconfig.node.json  — бэкенд (NodeNext, outDir: ./dist/server, types: node)\n\ntsc --project tsconfig.json --noEmit\n// Нет ошибок для фронтенд кода\n\ntsc --project tsconfig.node.json --noEmit\n// Нет ошибок для бэкенд кода\n\n// Попытка использовать document в бэкенд файле:\n// error TS2304: Cannot find name \'document\'.\n// (DOM типы не подключены в tsconfig.node.json)',
      solution: '// tsconfig.base.json\n{\n  "compilerOptions": {\n    "strict": true,\n    "target": "ES2022",\n    "esModuleInterop": true,\n    "resolveJsonModule": true,\n    "skipLibCheck": true,\n    "forceConsistentCasingInFileNames": true,\n    "noUnusedLocals": true,\n    "noImplicitReturns": true\n  }\n}\n\n// tsconfig.json (фронтенд, Vite+React)\n{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "jsx": "react-jsx",\n    "baseUrl": "src",\n    "paths": {\n      "@components/*": ["components/*"],\n      "@utils/*": ["utils/*"],\n      "@hooks/*": ["hooks/*"]\n    }\n  },\n  "include": ["src"],\n  "exclude": ["node_modules", "dist", "src/server"]\n}\n\n// tsconfig.node.json (бэкенд, Node.js)\n{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "outDir": "./dist/server",\n    "types": ["node"],\n    "baseUrl": "src/server"\n  },\n  "include": ["src/server"],\n  "exclude": ["node_modules"]\n}',
      explanation: 'Три конфига: base с общими строгими настройками, frontend с DOM и JSX поддержкой, backend с Node.js модульной системой. Такая структура используется в monorepo проектах. Разделение важно: бэкенд не должен иметь типы DOM, фронтенд — типы Node.js.'
    }
  ]
}
