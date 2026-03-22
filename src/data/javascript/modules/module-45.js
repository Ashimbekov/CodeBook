export default {
  id: 45,
  title: 'ESLint и Prettier',
  description: 'Статический анализ кода с ESLint, форматирование с Prettier, совместная настройка, плагины и интеграция в CI/CD',
  lessons: [
    {
      id: 1,
      title: 'ESLint — анализ кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'ESLint — инструмент статического анализа JavaScript. Находит ошибки, потенциальные баги, нарушения стиля. Правила можно включать/отключать и настраивать.' },
        { type: 'heading', value: 'Установка и конфигурация ESLint' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev eslint\n// npx eslint --init  — интерактивная настройка\n\n// .eslintrc.js (или .eslintrc.json, eslint.config.js)\nmodule.exports = {\n  // Среда выполнения — определяет глобальные переменные\n  env: {\n    browser: true,    // window, document, etc.\n    es2021: true,     // Promise, Map, Set, etc.\n    node: true,       // process, require, etc.\n    jest: true        // describe, test, expect\n  },\n\n  // Расширения — наборы правил\n  extends: [\n    "eslint:recommended",          // Стандартные рекомендации\n    "plugin:@typescript-eslint/recommended", // TypeScript\n    "plugin:react/recommended",    // React\n    "plugin:react-hooks/recommended" // Хуки\n  ],\n\n  // Парсер для TypeScript\n  parser: "@typescript-eslint/parser",\n\n  parserOptions: {\n    ecmaVersion: "latest",\n    sourceType: "module",\n    ecmaFeatures: { jsx: true }\n  },\n\n  // Плагины добавляют новые правила\n  plugins: ["@typescript-eslint", "react", "react-hooks"],\n\n  // Отдельные правила\n  rules: {\n    "no-console": "warn",           // warn | error | off\n    "no-unused-vars": "error",\n    "no-var": "error",              // Запретить var\n    "prefer-const": "error",        // Требовать const\n    "eqeqeq": ["error", "always"],  // Только ===\n    "semi": ["error", "always"],    // Точки с запятой\n    "react/prop-types": "off"       // Отключить правило\n  }\n};' },
        { type: 'tip', value: 'Используйте extends с готовыми наборами (airbnb, recommended) вместо настройки каждого правила вручную. Это экономит время и даёт проверенные конфигурации.' }
      ]
    },
    {
      id: 2,
      title: 'Правила ESLint',
      type: 'theory',
      content: [
        { type: 'text', value: 'ESLint имеет сотни правил. Три уровня: "off" (0), "warn" (1), "error" (2). Правила с параметрами передаются как массив.' },
        { type: 'heading', value: 'Важные правила' },
        { type: 'code', language: 'javascript', value: '// .eslintrc.js — правила\nmodule.exports = {\n  rules: {\n    // === ВОЗМОЖНЫЕ ОШИБКИ ===\n    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Разрешить _param\n    "no-undef": "error",\n    "no-console": ["warn", { allow: ["warn", "error"] }], // Разрешить console.warn/error\n    "no-debugger": "error",\n    "no-duplicate-case": "error",\n\n    // === ЛУЧШИЕ ПРАКТИКИ ===\n    "eqeqeq": ["error", "always", { null: "ignore" }],\n    "no-eval": "error",\n    "no-var": "error",\n    "prefer-const": "error",\n    "prefer-arrow-callback": "error",\n    "arrow-body-style": ["error", "as-needed"],\n    "object-shorthand": "error",   // { x } вместо { x: x }\n    "no-param-reassign": "warn",   // Не изменять параметры функции\n    "no-throw-literal": "error",   // throw new Error(), не throw "string"\n\n    // === ES6+ ===\n    "prefer-template": "error",    // Шаблонные строки вместо конкатенации\n    "no-useless-return": "error",\n    "prefer-destructuring": ["warn", { array: false, object: true }],\n\n    // === ИМПОРТЫ ===\n    "no-duplicate-imports": "error",\n    "sort-imports": ["warn", { ignoreDeclarationSort: true }]\n  },\n\n  // Переопределение для конкретных файлов\n  overrides: [\n    {\n      files: ["**/*.test.js", "**/*.spec.js"],\n      env: { jest: true },\n      rules: { "no-console": "off" }\n    },\n    {\n      files: ["*.ts", "*.tsx"],\n      rules: { "no-unused-vars": "off", "@typescript-eslint/no-unused-vars": "error" }\n    }\n  ]\n};' }
      ]
    },
    {
      id: 3,
      title: 'Prettier — форматирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prettier — автоматический форматировщик кода. Не анализирует логику, только форматирует: отступы, запятые, кавычки, скобки. Устраняет споры о стиле в команде.' },
        { type: 'heading', value: 'Настройка Prettier' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev prettier\n\n// .prettierrc.json — или .prettierrc.js\n{\n  "semi": true,              // Точки с запятой\n  "singleQuote": false,      // Двойные кавычки\n  "jsxSingleQuote": false,\n  "trailingComma": "es5",    // Запятые: "none" | "es5" | "all"\n  "tabWidth": 2,             // Отступ 2 пробела\n  "useTabs": false,          // Пробелы, не табы\n  "printWidth": 100,         // Максимальная длина строки\n  "bracketSpacing": true,    // { foo } не {foo}\n  "bracketSameLine": false,  // JSX закрывающий > на новой строке\n  "arrowParens": "always",   // (x) => x, не x => x\n  "endOfLine": "lf"          // Unix переносы строк\n}\n\n// .prettierignore\n// node_modules\n// dist\n// build\n// coverage\n// *.min.js\n\n// package.json scripts:\n// "format": "prettier --write \'src/**/*.{js,jsx,ts,tsx,css,json}\'"\n// "format:check": "prettier --check \'src/**/*.{js,jsx,ts,tsx}\'"\n\n// Проверить форматирование без изменения:\n// npx prettier --check src\n\n// Исправить форматирование:\n// npx prettier --write src\n\n// Отключить для конкретного блока:\n// prettier-ignore\nconst matrix = [\n  1, 0, 0,\n  0, 1, 0,\n  0, 0, 1,\n];' }
      ]
    },
    {
      id: 4,
      title: 'ESLint + Prettier вместе',
      type: 'theory',
      content: [
        { type: 'text', value: 'ESLint и Prettier могут конфликтовать: оба управляют форматированием. Решение: eslint-config-prettier отключает ESLint правила, конфликтующие с Prettier.' },
        { type: 'heading', value: 'Интеграция' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev eslint-config-prettier eslint-plugin-prettier\n\n// .eslintrc.js\nmodule.exports = {\n  extends: [\n    "eslint:recommended",\n    "plugin:react/recommended",\n    "prettier"  // ПОСЛЕДНИМ! Отключает конфликтующие правила\n  ],\n\n  plugins: ["prettier"],\n\n  rules: {\n    "prettier/prettier": "error"  // Prettier нарушения как ESLint ошибки\n  }\n};\n\n// Или проще — современный подход (ESLint v9 flat config):\n// eslint.config.js\nimport eslint from "@eslint/js";\nimport prettierConfig from "eslint-config-prettier";\nimport tsEslint from "typescript-eslint";\n\nexport default [\n  eslint.configs.recommended,\n  ...tsEslint.configs.recommended,\n  prettierConfig,\n  {\n    rules: {\n      "no-console": "warn",\n      "prefer-const": "error"\n    }\n  }\n];\n\n// VS Code настройка (settings.json)\n// {\n//   "editor.formatOnSave": true,\n//   "editor.defaultFormatter": "esbenp.prettier-vscode",\n//   "editor.codeActionsOnSave": {\n//     "source.fixAll.eslint": "explicit"\n//   }\n// }\n\n// Pre-commit хук с husky + lint-staged\n// npm install --save-dev husky lint-staged\n// npx husky init\n// echo "npx lint-staged" > .husky/pre-commit\n// package.json:\n// "lint-staged": {\n//   "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],\n//   "*.{css,json,md}": "prettier --write"\n// }' }
      ]
    },
    {
      id: 5,
      title: 'Плагины и extends',
      type: 'theory',
      content: [
        { type: 'text', value: 'Популярные расширения ESLint: eslint:recommended, airbnb, standard, @typescript-eslint/recommended. Плагины добавляют правила для конкретных технологий: react, hooks, import, jest.' },
        { type: 'heading', value: 'Полная конфигурация для React+TS' },
        { type: 'code', language: 'javascript', value: '// npm install --save-dev\n// @typescript-eslint/eslint-plugin @typescript-eslint/parser\n// eslint-plugin-react eslint-plugin-react-hooks\n// eslint-plugin-import eslint-plugin-jsx-a11y\n// eslint-config-prettier\n\n// .eslintrc.cjs\nmodule.exports = {\n  root: true,\n  env: { browser: true, es2020: true },\n  extends: [\n    "eslint:recommended",\n    "plugin:@typescript-eslint/recommended",\n    "plugin:react/recommended",\n    "plugin:react/jsx-runtime",  // Не нужен import React\n    "plugin:react-hooks/recommended",\n    "plugin:import/recommended",\n    "plugin:jsx-a11y/recommended",  // Доступность\n    "prettier"\n  ],\n  parser: "@typescript-eslint/parser",\n  parserOptions: { ecmaVersion: "latest", sourceType: "module" },\n  plugins: ["react-refresh"],\n  settings: { react: { version: "detect" } },\n  rules: {\n    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],\n    "@typescript-eslint/no-explicit-any": "warn",\n    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],\n    "no-console": ["warn", { allow: ["warn", "error"] }],\n    "import/order": ["error", {\n      "groups": ["builtin", "external", "internal", "parent", "sibling"],\n      "newlines-between": "always"\n    }]\n  }\n};' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка линтинга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте ESLint + Prettier для Node.js/Express проекта с pre-commit хуками через husky и lint-staged.',
      requirements: [
        'ESLint с extends: eslint:recommended',
        'Правила: no-var, prefer-const, no-console (warn), eqeqeq, no-unused-vars',
        'Prettier: singleQuote: true, tabWidth: 2, semi: true, printWidth: 100',
        'eslint-config-prettier для совместимости',
        'npm scripts: lint, lint:fix, format, format:check',
        'husky pre-commit хук запускает lint-staged',
        'lint-staged: ESLint --fix + Prettier --write для .js файлов'
      ],
      hint: 'В .eslintrc настройте rules для запрета var, требования const и предупреждений для console. В .prettierrc установите tabWidth, singleQuote, trailingComma. Husky хук pre-commit запускает lint-staged для проверки staged файлов.',
      expectedOutput: 'npx eslint src/index.js -> список нарушений правил\nnpx prettier --check src/ -> список файлов требующих форматирования\ngit commit -> автоматически запускает ESLint и Prettier\nПри ошибках lint -> commit отменяется',
      solution: {
        code: '// package.json (добавить секции)\n{\n  "scripts": {\n    "lint": "eslint src --ext .js",\n    "lint:fix": "eslint src --ext .js --fix",\n    "format": "prettier --write \\"src/**/*.{js,json,css}\\"",\n    "format:check": "prettier --check \\"src/**/*.{js,json,css}\\"",\n    "prepare": "husky"\n  },\n  "lint-staged": {\n    "src/**/*.js": ["eslint --fix", "prettier --write"],\n    "src/**/*.{json,css}": "prettier --write"\n  }\n}\n\n// .eslintrc.js\nmodule.exports = {\n  env: { node: true, es2021: true },\n  extends: ["eslint:recommended", "prettier"],\n  parserOptions: { ecmaVersion: "latest", sourceType: "module" },\n  rules: {\n    "no-var": "error",\n    "prefer-const": "error",\n    "no-console": ["warn", { allow: ["warn", "error"] }],\n    "eqeqeq": ["error", "always"],\n    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],\n    "no-throw-literal": "error",\n    "prefer-template": "error"\n  }\n};\n\n// .prettierrc.json\n{\n  "singleQuote": true,\n  "tabWidth": 2,\n  "semi": true,\n  "printWidth": 100,\n  "trailingComma": "es5",\n  "arrowParens": "always"\n}\n\n// Установка husky:\n// npx husky init\n// echo "npx lint-staged" > .husky/pre-commit',
        language: 'javascript'
      },
      explanation: 'eslint-config-prettier (extends: "prettier") отключает правила ESLint, конфликтующие с форматированием Prettier — без этого они будут спорить об отступах и кавычках. lint-staged запускает проверки только на staged файлах, а не на всём проекте — это делает pre-commit хук быстрым. argsIgnorePattern: "^_" позволяет использовать параметры с префиксом _ как намеренно неиспользуемые. prepare скрипт запускается автоматически при npm install, устанавливая husky хуки для всей команды.'
    }
  ]
};
