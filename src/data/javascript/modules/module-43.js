export default {
  id: 43,
  title: 'npm и yarn',
  description: 'Управление пакетами: npm/yarn init, install, scripts, lock-файлы, семантическое версионирование и публикация пакетов',
  lessons: [
    {
      id: 1,
      title: 'Инициализация проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'npm (Node Package Manager) — стандартный менеджер пакетов Node.js. yarn — альтернатива от Facebook, работает быстрее за счёт параллельных загрузок и кэширования.' },
        { type: 'heading', value: 'Создание проекта' },
        { type: 'code', language: 'javascript', value: '// npm init — интерактивное создание package.json\n// npm init -y — создать с дефолтными значениями\n// yarn init\n\n// Пример package.json\n{\n  "name": "my-project",\n  "version": "1.0.0",\n  "description": "Описание проекта",\n  "main": "index.js",\n  "type": "module", // ES Modules (или "commonjs")\n  "engines": {\n    "node": ">=18.0.0" // Минимальная версия Node\n  },\n  "keywords": ["api", "express"],\n  "author": "Имя <email@example.com>",\n  "license": "MIT",\n  "private": true, // Не публиковать в npm registry\n  "dependencies": {\n    "express": "^4.18.2",\n    "mongoose": "^7.0.0"\n  },\n  "devDependencies": {\n    "nodemon": "^3.0.0",\n    "jest": "^29.0.0"\n  },\n  "scripts": {\n    "start": "node index.js",\n    "dev": "nodemon index.js",\n    "test": "jest",\n    "build": "tsc"\n  }\n}\n\n// Структура проекта\n// my-project/\n//   node_modules/     — зависимости (в .gitignore)\n//   src/              — исходный код\n//   package.json      — мета-информация\n//   package-lock.json — точные версии (npm)\n//   yarn.lock         — точные версии (yarn)\n//   .gitignore\n//   .env              — переменные окружения (в .gitignore!)\n//   README.md' }
      ]
    },
    {
      id: 2,
      title: 'Установка и удаление пакетов',
      type: 'theory',
      content: [
        { type: 'text', value: 'dependencies — пакеты нужные в production. devDependencies — только для разработки (тесты, линтеры, сборщики). Не устанавливаются при npm install --production.' },
        { type: 'heading', value: 'Команды установки' },
        { type: 'code', language: 'javascript', value: '// === npm ===\n\n// Установить все зависимости из package.json\nnpm install  // или: npm i\n\n// Установить пакет (в dependencies)\nnpm install express\nnpm install express mongoose cors helmet\n\n// Установить в devDependencies\nnpm install --save-dev nodemon jest eslint\nnpm install -D nodemon\n\n// Установить глобально\nnpm install -g nodemon\nnpm install -g typescript ts-node\n\n// Удалить пакет\nnpm uninstall express\nnpm uninstall --save-dev jest\n\n// Обновить пакеты\nnpm update          // Все в рамках semver\nnpm update express  // Конкретный\nnpm outdated        // Показать устаревшие\n\n// === yarn ===\n\nyarn                      // Установить все\nyarn add express          // В dependencies\nyarn add -D jest          // В devDependencies\nyarn global add nodemon   // Глобально\nyarn remove express       // Удалить\nyarn upgrade              // Обновить все\nyarn upgrade express      // Конкретный\nyarn outdated             // Устаревшие\n\n// === pnpm (ещё одна альтернатива) ===\n// pnpm add express\n// pnpm add -D jest\n// pnpm install\n\n// Проверить версию пакета\nnpm list express\nnpm list --depth=0  // Только прямые зависимости' }
      ]
    },
    {
      id: 3,
      title: 'npm scripts',
      type: 'theory',
      content: [
        { type: 'text', value: 'Scripts в package.json — задачи для автоматизации. Запускаются командой npm run <name>. Специальные скрипты start, test, build не требуют run.' },
        { type: 'heading', value: 'Полезные скрипты' },
        { type: 'code', language: 'javascript', value: '// package.json\n{\n  "scripts": {\n    // Запуск\n    "start": "node src/index.js",\n    "dev": "nodemon src/index.js",\n    "dev:debug": "NODE_OPTIONS=--inspect nodemon src/index.js",\n\n    // Сборка\n    "build": "tsc -p tsconfig.json",\n    "build:watch": "tsc -p tsconfig.json --watch",\n\n    // Тесты\n    "test": "jest",\n    "test:watch": "jest --watch",\n    "test:coverage": "jest --coverage",\n    "test:ci": "jest --ci --coverage",\n\n    // Линтинг\n    "lint": "eslint src --ext .js,.ts",\n    "lint:fix": "eslint src --ext .js,.ts --fix",\n    "format": "prettier --write src",\n\n    // Цепочки с && (последовательно) или & (параллельно)\n    "prepare": "npm run build",\n    "prestart": "npm run build", // Запускается перед start\n    "posttest": "npm run lint",  // Запускается после test\n\n    // cross-env для кросс-платформенных переменных\n    "start:prod": "cross-env NODE_ENV=production node dist/index.js",\n    "start:dev": "cross-env NODE_ENV=development nodemon src/index.js",\n\n    // concurrently — параллельный запуск\n    "dev:full": "concurrently \\"npm run dev:server\\" \\"npm run dev:client\\"",\n\n    // Утилиты\n    "clean": "rimraf dist node_modules/.cache",\n    "db:seed": "node scripts/seed.js",\n    "db:migrate": "node scripts/migrate.js"\n  }\n}\n\n// Хуки: pre<script> и post<script>\n// prebuild — перед build\n// postbuild — после build\n// preinstall — перед install\n// prepare — перед публикацией и после git install' }
      ]
    },
    {
      id: 4,
      title: 'Семантическое версионирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Semver (Semantic Versioning): MAJOR.MINOR.PATCH. MAJOR — ломающие изменения, MINOR — новые фичи совместимые, PATCH — исправления. Символы ^ и ~ определяют диапазон версий.' },
        { type: 'heading', value: 'Версионирование пакетов' },
        { type: 'code', language: 'javascript', value: '// MAJOR.MINOR.PATCH — например: 4.18.2\n//\n// PATCH увеличивается при: исправлении багов\n// MINOR увеличивается при: новых функциях (обратно совместимых)\n// MAJOR увеличивается при: ломающих изменениях\n\n// В package.json:\n// Точная версия: "express": "4.18.2" — всегда 4.18.2\n// Тильда: "express": "~4.18.2"  — 4.18.x (только PATCH)\n// Каретка: "express": "^4.18.2" — 4.x.x (MINOR и PATCH)\n// Диапазон: "express": ">=4.18.0 <5.0.0"\n// Любая: "express": "*"\n// Последняя: "express": "latest"\n// Тег: "express": "beta"\n\n// npm version — обновить версию\nnpm version patch    // 1.0.0 -> 1.0.1\nnpm version minor    // 1.0.1 -> 1.1.0\nnpm version major    // 1.1.0 -> 2.0.0\nnpm version 2.5.0    // Установить конкретную\n// Автоматически создаёт git tag\n\n// Pre-release версии\n// "1.0.0-alpha.1"\n// "1.0.0-beta.2"\n// "1.0.0-rc.1"\nnpm version prerelease --preid=beta // 1.0.0-beta.0\n\n// Проверить совместимость\nnpm doctor\nnpm audit         // Проверить безопасность\nnpm audit fix     // Исправить уязвимости автоматически' }
      ]
    },
    {
      id: 5,
      title: 'lock-файлы и воспроизводимость',
      type: 'theory',
      content: [
        { type: 'text', value: 'package-lock.json (npm) и yarn.lock — фиксируют точные версии всех зависимостей. Гарантируют одинаковую установку на всех машинах и в CI/CD.' },
        { type: 'heading', value: 'Lock-файлы и CI/CD' },
        { type: 'code', language: 'javascript', value: '// package-lock.json создаётся автоматически при npm install\n// yarn.lock — при yarn install\n// Оба файла ДОЛЖНЫ быть в git!\n\n// npm ci — для CI/CD (строгая установка)\n// Отличия от npm install:\n// - Требует package-lock.json\n// - Устанавливает ТОЧНО как в lock-файле\n// - Удаляет node_modules перед установкой\n// - Не изменяет package.json или lock-файл\n// - Быстрее в CI за счёт отсутствия разрешения версий\n\n// GitHub Actions пример\n// steps:\n//   - uses: actions/checkout@v3\n//   - uses: actions/setup-node@v3\n//     with:\n//       node-version: "18"\n//       cache: "npm"\n//   - run: npm ci     # Не npm install!\n//   - run: npm test\n\n// .npmrc — настройки npm\n// registry=https://registry.npmjs.org\n// save-exact=true  — сохранять точную версию (без ^ и ~)\n// engine-strict=true — проверять версию node из engines\n\n// Проблемы с node_modules:\n// npm cache clean --force — очистить кэш\n// rm -rf node_modules package-lock.json && npm install\n\n// npm workspaces (монорепозиторий)\n// package.json:\n// "workspaces": ["packages/*"]\n// npm install --workspaces\n// npm run test --workspace=packages/api' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте package.json для Express API проекта с полным набором скриптов, правильными зависимостями и конфигурацией.',
      requirements: [
        'Создайте package.json с зависимостями: express, mongoose, jsonwebtoken, bcryptjs, cors, dotenv',
        'devDependencies: nodemon, jest, eslint, prettier',
        'Скрипты: start, dev, test, lint, lint:fix, build',
        'Добавьте engines: node >= 18',
        'Создайте .gitignore с node_modules, .env, dist',
        'Создайте .nvmrc с версией Node 18'
      ],
      hint: 'В package.json поле "main" указывает точку входа, "scripts" должны содержать start, dev, test, build. devDependencies для инструментов разработки, dependencies для production. Поле "engines" фиксирует версию Node.js.',
      expectedOutput: 'npm start -> запускает node src/index.js\nnpm run dev -> запускает nodemon src/index.js\nnpm test -> запускает jest\nnpm run lint -> запускает eslint\npackage.json валиден и содержит все нужные поля',
      solution: {
        code: '// package.json\n{\n  "name": "express-api",\n  "version": "1.0.0",\n  "description": "Express REST API",\n  "main": "src/index.js",\n  "engines": { "node": ">=18.0.0" },\n  "private": true,\n  "scripts": {\n    "start": "node src/index.js",\n    "dev": "nodemon src/index.js",\n    "test": "jest --passWithNoTests",\n    "test:watch": "jest --watch",\n    "test:coverage": "jest --coverage",\n    "lint": "eslint src --ext .js",\n    "lint:fix": "eslint src --ext .js --fix",\n    "format": "prettier --write src"\n  },\n  "dependencies": {\n    "bcryptjs": "^2.4.3",\n    "cors": "^2.8.5",\n    "dotenv": "^16.0.0",\n    "express": "^4.18.2",\n    "jsonwebtoken": "^9.0.0",\n    "mongoose": "^7.0.0"\n  },\n  "devDependencies": {\n    "eslint": "^8.0.0",\n    "jest": "^29.0.0",\n    "nodemon": "^3.0.0",\n    "prettier": "^3.0.0"\n  }\n}\n\n// .gitignore\nnode_modules/\n.env\n.env.local\ndist/\ncoverage/\n*.log\n.DS_Store\n\n// .nvmrc\n18\n\n// .env.example\nPORT=3000\nMONGODB_URI=mongodb://localhost:27017/mydb\nJWT_SECRET=your-super-secret-key-change-in-production\nNODE_ENV=development',
        language: 'javascript'
      },
      explanation: 'dependencies содержит пакеты нужные в production, devDependencies — только для разработки. Каретка ^ разрешает обновления minor и patch версий в рамках semver. engines.node фиксирует минимальную версию Node.js. .gitignore обязательно включает node_modules/ и .env — первый слишком большой для git, второй содержит секреты. .env.example документирует нужные переменные без реальных значений. .nvmrc позволяет nvm автоматически переключать версию Node в директории проекта.'
    }
  ]
};
