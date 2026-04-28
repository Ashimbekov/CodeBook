export default {
  id: 13,
  title: 'Стандарты кода',
  description: 'Единообразие, читаемость и автоматизация: линтеры, форматтеры, editorconfig, pre-commit hooks и создание code style guide для команды.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны стандарты кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандарты кода — это набор правил, определяющих как писать код в команде: отступы, именование, структура файлов, паттерны. Без стандартов каждый разработчик пишет в своём стиле, и кодовая база превращается в лоскутное одеяло, которое сложно читать и поддерживать.' },
        { type: 'heading', value: 'Проблемы без стандартов' },
        { type: 'list', value: [
          'Один файл — табы, другой — пробелы. PR пестрит бессмысленными diff',
          'Разработчик A пишет camelCase, B — snake_case. Нет единообразия',
          'Code review превращается в спор о стиле вместо обсуждения логики',
          'Новый разработчик не знает "как у нас принято" — каждый учит своему',
          'Git blame показывает, что 80% изменений — переформатирование',
          'Merge-конфликты из-за разного форматирования одного и того же кода'
        ] },
        { type: 'heading', value: 'Что дают стандарты' },
        { type: 'list', value: [
          'Читаемость — код выглядит так, будто написан одним человеком',
          'Онбординг — новичок видит правила, а не "спрашивай у Васи"',
          'Code review — обсуждаем логику, а не стиль (стиль проверяет линтер)',
          'Рефакторинг — проще менять код, который написан единообразно',
          'Автоматизация — линтеры и форматтеры применяют правила без участия людей',
          'Меньше багов — многие правила линтеров предотвращают типичные ошибки'
        ] },
        { type: 'heading', value: 'Уровни стандартизации' },
        { type: 'code', language: 'bash', value: '# Уровень 1: Форматирование\n# Отступы, скобки, длина строк, кавычки\n# Автоматизация: Prettier, Black, gofmt\n\n# Уровень 2: Стиль кода\n# Naming conventions, структура импортов, паттерны\n# Автоматизация: ESLint, Checkstyle, Pylint\n\n# Уровень 3: Архитектурные правила\n# Структура проекта, слои, зависимости\n# Автоматизация: ArchUnit, eslint-plugin-import\n\n# Уровень 4: Документация\n# JSDoc, комментарии, README, CHANGELOG\n# Автоматизация: eslint-plugin-jsdoc, частично' },
        { type: 'tip', value: 'Правило 80/20: автоматизируйте 80% правил (форматирование, стиль). Оставшиеся 20% (архитектура, сложные решения) обсуждайте на code review. Не пытайтесь прописать правило на каждый случай — это парализует команду.' },
        { type: 'note', value: 'Крупные компании публикуют свои style guides: Google Style Guide (C++, Java, Python, Go), Airbnb JavaScript Style Guide, StandardJS. Вместо изобретения своего — возьмите существующий и адаптируйте.' }
      ]
    },
    {
      id: 2,
      title: 'Линтеры и форматтеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Линтер анализирует код и находит потенциальные ошибки и нарушения стиля. Форматтер автоматически исправляет форматирование. Вместе они покрывают 80% вопросов кодстайла без участия человека.' },
        { type: 'heading', value: 'Линтеры по языкам' },
        { type: 'code', language: 'bash', value: '# JavaScript/TypeScript — ESLint\nnpm install -D eslint\nnpx eslint --init\n# Популярные конфиги:\n# eslint-config-airbnb — строгий, популярный\n# @typescript-eslint — для TypeScript\n# eslint-plugin-react — правила для React\n\n# Python — Pylint, Flake8, Ruff\npip install ruff         # Быстрый, написан на Rust\nruff check .             # Проверка\nruff check --fix .       # Автоисправление\n\n# Java — Checkstyle, SpotBugs\n# В Maven pom.xml:\n# <plugin>\n#   <groupId>org.apache.maven.plugins</groupId>\n#   <artifactId>maven-checkstyle-plugin</artifactId>\n# </plugin>\n\n# Go — golangci-lint\ncurl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh\ngolangci-lint run\n\n# Kotlin — ktlint, detekt\n# ktlint — форматирование\n# detekt — статический анализ' },
        { type: 'heading', value: 'Форматтеры' },
        { type: 'code', language: 'bash', value: '# JavaScript/TypeScript — Prettier\nnpm install -D prettier\nnpx prettier --write .    # Отформатировать все файлы\nnpx prettier --check .    # Проверить без изменений\n\n# .prettierrc\n# {\n#   "semi": true,\n#   "singleQuote": true,\n#   "tabWidth": 2,\n#   "trailingComma": "es5",\n#   "printWidth": 100\n# }\n\n# Python — Black\npip install black\nblack .                   # Отформатировать\nblack --check .           # Проверить\n# Black — "бескомпромиссный": минимум настроек, один стиль\n\n# Go — gofmt (встроен в Go)\ngofmt -w .                # Go имеет единый стиль — нет споров\n\n# Java — google-java-format\n# Единый формат от Google\n\n# SQL — sqlfmt, sqlfluff\npip install sqlfluff\nsqlfluff fix queries/' },
        { type: 'heading', value: 'ESLint + Prettier вместе' },
        { type: 'code', language: 'bash', value: '# Проблема: ESLint и Prettier могут конфликтовать\n# Решение: eslint-config-prettier отключает конфликтующие правила\n\nnpm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier\n\n# .eslintrc.json\n# {\n#   "extends": [\n#     "eslint:recommended",\n#     "plugin:@typescript-eslint/recommended",\n#     "plugin:react/recommended",\n#     "prettier"              ← отключает конфликтующие правила ESLint\n#   ],\n#   "plugins": ["@typescript-eslint", "react"],\n#   "rules": {\n#     "no-console": "warn",\n#     "no-unused-vars": "error",\n#     "prefer-const": "error",\n#     "react/prop-types": "off"\n#   }\n# }\n\n# Команды в package.json:\n# "scripts": {\n#   "lint": "eslint src/ --ext .ts,.tsx",\n#   "lint:fix": "eslint src/ --ext .ts,.tsx --fix",\n#   "format": "prettier --write src/",\n#   "format:check": "prettier --check src/"\n# }' },
        { type: 'warning', value: 'Не включайте слишком много правил сразу. Начните с рекомендованного конфига (eslint:recommended), потом добавляйте по одному правилу. Если команда сопротивляется — значит правило спорное, обсудите его.' },
        { type: 'tip', value: 'Ruff для Python — в 10-100 раз быстрее Pylint и Flake8. Написан на Rust, покрывает правила обоих. Если проект на Python — используйте Ruff.' }
      ]
    },
    {
      id: 3,
      title: 'Editorconfig, pre-commit hooks, Husky',
      type: 'theory',
      content: [
        { type: 'text', value: 'Линтер и форматтер бесполезны, если разработчик может их не запускать. Настройка editorconfig, pre-commit hooks и CI-проверок гарантирует, что код всегда соответствует стандартам — без зависимости от дисциплины конкретного человека.' },
        { type: 'heading', value: '.editorconfig — единые настройки редактора' },
        { type: 'code', language: 'bash', value: '# .editorconfig — работает во всех редакторах (VS Code, IntelliJ, Vim)\n# Не требует установки плагинов в большинстве IDE\n\n# .editorconfig\n# root = true\n#\n# [*]\n# indent_style = space\n# indent_size = 2\n# end_of_line = lf\n# charset = utf-8\n# trim_trailing_whitespace = true\n# insert_final_newline = true\n#\n# [*.md]\n# trim_trailing_whitespace = false\n#\n# [*.py]\n# indent_size = 4\n#\n# [*.java]\n# indent_size = 4\n#\n# [Makefile]\n# indent_style = tab\n\n# Решает проблему:\n# - Windows: CRLF, Mac/Linux: LF → end_of_line = lf\n# - VS Code: 2 пробела, IntelliJ: 4 пробела → indent_size = 2\n# - Trailing whitespace → trim_trailing_whitespace = true' },
        { type: 'heading', value: 'Husky — Git hooks для Node.js проектов' },
        { type: 'code', language: 'bash', value: '# Установка\nnpm install -D husky\nnpx husky init\n\n# Создаёт .husky/ директорию с hooks\n\n# Pre-commit hook — запускается перед каждым коммитом\n# .husky/pre-commit:\n# #!/usr/bin/env sh\n# . "$(dirname -- "$0")/_/husky.sh"\n# npx lint-staged\n\n# Commit-msg hook — проверяет сообщение коммита\n# .husky/commit-msg:\n# #!/usr/bin/env sh\n# . "$(dirname -- "$0")/_/husky.sh"\n# npx --no -- commitlint --edit ${1}' },
        { type: 'heading', value: 'lint-staged — проверяем только изменённые файлы' },
        { type: 'code', language: 'bash', value: '# Без lint-staged: линтер проверяет ВСЕ файлы → медленно\n# С lint-staged: только staged файлы → быстро (секунды)\n\nnpm install -D lint-staged\n\n# package.json:\n# {\n#   "lint-staged": {\n#     "*.{ts,tsx}": [\n#       "eslint --fix",\n#       "prettier --write"\n#     ],\n#     "*.{json,md,yml}": [\n#       "prettier --write"\n#     ],\n#     "*.py": [\n#       "ruff check --fix",\n#       "black"\n#     ]\n#   }\n# }\n\n# Что происходит при git commit:\n# 1. Husky перехватывает commit\n# 2. Запускает lint-staged\n# 3. lint-staged берёт только staged файлы\n# 4. Для каждого файла запускает eslint --fix и prettier --write\n# 5. Если есть ошибки — commit отменяется\n# 6. Если всё ок — commit проходит' },
        { type: 'heading', value: 'commitlint — валидация сообщений коммитов' },
        { type: 'code', language: 'bash', value: '# Установка\nnpm install -D @commitlint/cli @commitlint/config-conventional\n\n# commitlint.config.js:\n# module.exports = {\n#   extends: [\'@commitlint/config-conventional\'],\n#   rules: {\n#     \'type-enum\': [2, \'always\', [\n#       \'feat\', \'fix\', \'docs\', \'style\', \'refactor\',\n#       \'perf\', \'test\', \'chore\', \'ci\'\n#     ]],\n#     \'subject-max-length\': [2, \'always\', 72],\n#     \'subject-case\': [2, \'always\', \'lower-case\']\n#   }\n# };\n\n# Теперь:\n# git commit -m "fix bug"              ❌ Нет типа в правильном формате\n# git commit -m "fix: correct login"   ✅ Проходит\n# git commit -m "Fix: correct login"   ❌ Первая буква заглавная' },
        { type: 'heading', value: 'pre-commit для Python проектов' },
        { type: 'code', language: 'bash', value: '# Python использует инструмент pre-commit (не Husky)\npip install pre-commit\n\n# .pre-commit-config.yaml:\n# repos:\n#   - repo: https://github.com/astral-sh/ruff-pre-commit\n#     rev: v0.3.0\n#     hooks:\n#       - id: ruff\n#         args: [--fix]\n#       - id: ruff-format\n#   - repo: https://github.com/pre-commit/pre-commit-hooks\n#     rev: v4.5.0\n#     hooks:\n#       - id: trailing-whitespace\n#       - id: end-of-file-fixer\n#       - id: check-yaml\n#       - id: check-added-large-files\n\npre-commit install    # Активирует hooks\npre-commit run --all-files  # Проверить все файлы' },
        { type: 'tip', value: 'lint-staged + Husky — это 90% автоматизации качества кода. Настройка занимает 10 минут, но экономит сотни часов на code review и споры о стиле.' }
      ]
    },
    {
      id: 4,
      title: 'Naming conventions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Код читают гораздо чаще, чем пишут. Хорошее именование — это самая важная часть читаемости. Если вы даёте переменной имя "d", коллега потратит 5 минут на понимание контекста. Если "deliveryDate" — понятно сразу.' },
        { type: 'heading', value: 'Стили именования' },
        { type: 'code', language: 'bash', value: '# camelCase      — JavaScript, Java (переменные, функции)\n# PascalCase     — JavaScript (классы, компоненты), C# (всё)\n# snake_case     — Python, Ruby (переменные, функции)\n# UPPER_SNAKE    — Константы (во всех языках)\n# kebab-case     — CSS, HTML атрибуты, URL, файлы\n# SCREAMING_CASE — Enum значения (Java, TypeScript)\n\n# JavaScript/TypeScript:\nconst userName = "John";              // camelCase переменные\nfunction getUserById(id) {}           // camelCase функции\nclass UserService {}                  // PascalCase классы\nconst MAX_RETRY_COUNT = 3;            // UPPER_SNAKE константы\n// Файлы: UserProfile.tsx, userService.ts, use-auth.ts\n\n# Python:\nuser_name = "John"                    // snake_case переменные\ndef get_user_by_id(user_id):          // snake_case функции\nclass UserService:                    // PascalCase классы\nMAX_RETRY_COUNT = 3                   // UPPER_SNAKE константы\n# Файлы: user_service.py, test_user.py\n\n# Java:\nString userName = "John";             // camelCase переменные\npublic User getUserById(int id) {}    // camelCase методы\npublic class UserService {}           // PascalCase классы\nstatic final int MAX_RETRY = 3;       // UPPER_SNAKE константы' },
        { type: 'heading', value: 'Правила хорошего именования' },
        { type: 'list', value: [
          'Говорящие имена — "deliveryDate" вместо "d", "userCount" вместо "n"',
          'Булевы переменные — is/has/can/should: isActive, hasPermission, canEdit',
          'Функции — глаголы: getUserById, calculateTotal, validateEmail',
          'Классы — существительные: UserService, PaymentGateway, OrderRepository',
          'Массивы — множественное число: users, orders, items (не userList)',
          'Без аббревиатур — "button" не "btn", "message" не "msg" (кроме общепринятых: id, url, api)',
          'Без венгерской нотации — "users" не "arrUsers", "name" не "strName"'
        ] },
        { type: 'heading', value: 'Именование в разных контекстах' },
        { type: 'code', language: 'bash', value: '# REST API endpoints (kebab-case, существительные, множественное число):\n# ✅ GET /api/users\n# ✅ GET /api/users/123/orders\n# ✅ POST /api/payment-methods\n# ❌ GET /api/getUsers\n# ❌ POST /api/create_order\n# ❌ GET /api/User\n\n# БД таблицы и колонки (snake_case):\n# ✅ users, user_orders, payment_methods\n# ✅ created_at, updated_at, is_active\n# ❌ Users, userOrders, PaymentMethods\n\n# CSS классы (BEM или kebab-case):\n# ✅ .user-card, .user-card__title, .user-card--active\n# ✅ .search-input, .nav-menu\n# ❌ .userCard, .UserCard, .user_card\n\n# Файлы и директории:\n# React компоненты: UserProfile.tsx (PascalCase)\n# Утилиты: formatDate.ts (camelCase)\n# Стили: user-profile.module.css (kebab-case)\n# Тесты: UserProfile.test.tsx (рядом с компонентом)' },
        { type: 'heading', value: 'Плохие имена vs хорошие' },
        { type: 'code', language: 'bash', value: '# ❌ Плохо:              ✅ Хорошо:\ndata                     users / orders / searchResults\ntemp                     previousValue / cachedResponse  \nflag                     isEnabled / hasAccess\nresult                   validationErrors / matchingUsers\nhandle()                 handleFormSubmit()\nprocess()                calculateShippingCost()\nmanager                  authenticationService\nhelper                   dateFormatter / urlBuilder\nutils                    (разбить на конкретные модули)\nfoo, bar, baz            (только в примерах/тестах)' },
        { type: 'warning', value: 'Не переименовывайте всё сразу в существующем проекте. Это сломает git blame и создаст огромный diff. Применяйте правила к новому коду и рефакторьте постепенно — Boy Scout Rule: оставь код чище, чем нашёл.' },
        { type: 'tip', value: 'Если не можете придумать хорошее имя для функции — возможно, она делает слишком много. Функция с именем processUserDataAndSendEmailAndUpdateDatabase() явно нарушает Single Responsibility Principle.' }
      ]
    },
    {
      id: 5,
      title: 'Code style guide — создание и поддержка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code style guide — документ, описывающий стандарты кодирования в команде. Это не просто список правил линтера, а решения по вопросам, которые нельзя автоматизировать: архитектурные паттерны, организация файлов, подход к обработке ошибок.' },
        { type: 'heading', value: 'Структура style guide' },
        { type: 'code', language: 'bash', value: '# docs/code-style-guide.md\n#\n# 1. Общие принципы\n#    - Читаемость > краткость\n#    - Явное > неявное\n#    - Единообразие > личные предпочтения\n#\n# 2. Форматирование\n#    - Инструменты: Prettier + ESLint (конфиги в репозитории)\n#    - Длина строки: 100 символов\n#    - Отступы: 2 пробела (JS/TS), 4 пробела (Python/Java)\n#\n# 3. Именование\n#    - Переменные: camelCase\n#    - Компоненты: PascalCase\n#    - Файлы: PascalCase для компонентов, camelCase для утилит\n#\n# 4. Структура проекта\n#    src/\n#    ├── components/     — переиспользуемые UI-компоненты\n#    ├── pages/          — страницы (роуты)\n#    ├── hooks/          — кастомные React hooks\n#    ├── services/       — API-вызовы\n#    ├── utils/          — утилитарные функции\n#    ├── types/          — TypeScript типы\n#    └── __tests__/      — тесты\n#\n# 5. Паттерны\n#    - API-вызовы: через сервисный слой, не из компонентов\n#    - Стейт: Zustand для глобального, useState для локального\n#    - Ошибки: Error Boundary + toast уведомления\n#\n# 6. Git\n#    - Conventional Commits\n#    - Ветки: feature/TICKET-описание\n#    - PR: squash merge в main' },
        { type: 'heading', value: 'Как создать style guide для команды' },
        { type: 'list', value: [
          '1. Начните с существующего — Airbnb, Google, StandardJS. Не изобретайте с нуля',
          '2. Обсудите спорные моменты на ретро — табы/пробелы, точка с запятой, именование',
          '3. Проведите голосование по спорным вопросам — демократия, не диктатура тех-лида',
          '4. Автоматизируйте всё что можно — ESLint, Prettier, Husky. Люди забывают, роботы нет',
          '5. Задокументируйте то что нельзя автоматизировать — архитектура, паттерны, подходы',
          '6. Положите style guide в репозиторий — docs/code-style.md, рядом с кодом',
          '7. Ревьюируйте по style guide — ссылайтесь на конкретные пункты',
          '8. Обновляйте — style guide живой документ, не высеченный в камне'
        ] },
        { type: 'heading', value: 'Примеры решений для style guide' },
        { type: 'code', language: 'bash', value: '# Вопрос: Как именовать булевые пропсы в React?\n# Решение: без is/has для пропсов, с is/has для переменных\n# <Button disabled />      ✅ не <Button isDisabled />\n# <Modal open />           ✅ не <Modal isOpen />\n# const isLoading = true   ✅ переменная с is\n\n# Вопрос: Как организовать импорты?\n# Решение: 3 группы, разделённые пустой строкой\n# 1. Внешние библиотеки (react, lodash)\n# 2. Внутренние модули (@/components, @/hooks)\n# 3. Относительные импорты (./styles, ../utils)\n\n# Вопрос: Как обрабатывать ошибки API?\n# Решение: try/catch в сервисном слое, toast в UI\n# service: throw AppError с кодом и сообщением\n# component: catch → показать toast + логировать в Sentry\n\n# Вопрос: Максимальный размер файла?\n# Решение: 300 строк — если больше, разбить на модули\n# Исключение: сгенерированные файлы, конфиги' },
        { type: 'heading', value: 'ADR — Architecture Decision Records' },
        { type: 'code', language: 'bash', value: '# ADR — документирование архитектурных решений\n# Формат: docs/adr/NNN-название-решения.md\n\n# docs/adr/001-state-management.md\n# # ADR 001: Использование Zustand для управления состоянием\n# \n# ## Статус: Принято\n# ## Дата: 2024-03-15\n# \n# ## Контекст\n# Проект растёт, useState + prop drilling не масштабируется.\n# Рассмотрели: Redux, MobX, Zustand, Jotai.\n# \n# ## Решение\n# Используем Zustand:\n# - Минимальный бойлерплейт\n# - Не требует Provider\n# - Хорошо работает с TypeScript\n# - 1KB gzip\n# \n# ## Последствия\n# - Команда должна изучить Zustand (1-2 часа)\n# - Миграция существующего стейта из Context (~2 дня)\n# - Redux DevTools доступен через zustand/middleware' },
        { type: 'tip', value: 'Style guide должен быть коротким и конкретным — 2-3 страницы максимум. Если разработчику нужно прочитать 50-страничный документ перед написанием первой строки — его никто не будет читать. Для деталей используйте линтер-правила.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настроить правила линтера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте ESLint + Prettier + Husky для JavaScript/TypeScript проекта с нуля. Определите правила и автоматизируйте проверку при коммите.',
      requirements: [
        'Создать конфигурацию ESLint с правилами: no-console (warn), no-unused-vars (error), prefer-const (error)',
        'Создать конфигурацию Prettier: single quotes, semicolons, tab width 2',
        'Настроить совместную работу ESLint + Prettier (eslint-config-prettier)',
        'Настроить Husky + lint-staged для проверки при коммите',
        'Добавить .editorconfig для единых настроек редактора',
        'Добавить commitlint для проверки сообщений коммитов'
      ],
      hint: 'Начните с npm install -D для всех зависимостей. Создайте конфиги: .eslintrc.json, .prettierrc, .editorconfig. Потом npx husky init и настройте lint-staged в package.json.',
      expectedOutput: 'ESLint: настроен с правилами no-console, no-unused-vars, prefer-const\nPrettier: singleQuote: true, semi: true, tabWidth: 2\neslint-config-prettier: конфликты между ESLint и Prettier отключены\nHusky: pre-commit hook запускает lint-staged\nlint-staged: ESLint --fix + Prettier --write для staged .ts/.tsx файлов\ncommitlint: проверяет conventional commits\n.editorconfig: indent_style=space, indent_size=2, end_of_line=lf',
      solution: '# 1. Установка зависимостей\nnpm install -D eslint prettier\nnpm install -D eslint-config-prettier eslint-plugin-prettier\nnpm install -D husky lint-staged\nnpm install -D @commitlint/cli @commitlint/config-conventional\n\n# 2. Конфигурация ESLint (.eslintrc.json)\n# {\n#   "env": { "browser": true, "es2021": true, "node": true },\n#   "extends": [\n#     "eslint:recommended",\n#     "prettier"\n#   ],\n#   "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },\n#   "rules": {\n#     "no-console": "warn",\n#     "no-unused-vars": "error",\n#     "prefer-const": "error"\n#   }\n# }\n\n# 3. Конфигурация Prettier (.prettierrc)\n# {\n#   "singleQuote": true,\n#   "semi": true,\n#   "tabWidth": 2,\n#   "trailingComma": "es5",\n#   "printWidth": 100\n# }\n\n# 4. EditorConfig (.editorconfig)\n# root = true\n# [*]\n# indent_style = space\n# indent_size = 2\n# end_of_line = lf\n# charset = utf-8\n# trim_trailing_whitespace = true\n# insert_final_newline = true\n\n# 5. Husky\nnpx husky init\n# .husky/pre-commit:\n# npx lint-staged\n# .husky/commit-msg:\n# npx --no -- commitlint --edit ${1}\n\n# 6. lint-staged в package.json\n# "lint-staged": {\n#   "*.{ts,tsx,js,jsx}": [\n#     "eslint --fix",\n#     "prettier --write"\n#   ],\n#   "*.{json,md,yml}": [\n#     "prettier --write"\n#   ]\n# }\n\n# 7. commitlint (commitlint.config.js)\n# module.exports = {\n#   extends: [\'@commitlint/config-conventional\']\n# };\n\n# 8. Скрипты в package.json\n# "scripts": {\n#   "lint": "eslint src/",\n#   "lint:fix": "eslint src/ --fix",\n#   "format": "prettier --write src/",\n#   "format:check": "prettier --check src/"\n# }\n\n# Проверка:\ngit add .\ngit commit -m "chore: setup linting and formatting"\n# Husky → lint-staged → ESLint + Prettier → commitlint → Commit!',
      explanation: 'Связка ESLint + Prettier + Husky + lint-staged + commitlint автоматизирует контроль качества кода. ESLint находит логические ошибки (неиспользованные переменные, console.log). Prettier форматирует код (отступы, кавычки). lint-staged проверяет только изменённые файлы для скорости. Husky запускает проверку при каждом коммите. commitlint гарантирует единый формат сообщений коммитов.'
    }
  ]
}
