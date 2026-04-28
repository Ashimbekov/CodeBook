export default {
  id: 24,
  title: 'Документация',
  description: 'Зачем и как документировать: README, Wiki, Confluence, ADR, API документация. Практические подходы к документации в IT-командах.',
  lessons: [
    {
      id: 1,
      title: 'Зачем документировать — для себя будущего и для команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Документация — это инвестиция в будущее. Через 6 месяцев ты не вспомнишь, почему выбрал такую архитектуру. Новый разработчик потратит неделю разбираясь в проекте без документации, и 2 часа — с ней. Документация — это не бюрократия, это забота о команде и о себе будущем.' },
        { type: 'heading', value: 'Стоимость отсутствия документации' },
        { type: 'list', value: [
          'Онбординг нового разработчика: 2 недели вместо 2 дней',
          'Bus factor = 1: если единственный знающий человек уходит, знания уходят с ним',
          'Повторные обсуждения: «Почему мы решили использовать PostgreSQL?» — каждые 3 месяца',
          'Дублирование работы: разработчик пишет то, что уже было написано и удалено',
          'Ошибки при деплое: «А как деплоить на production?» — в пятницу вечером',
          'По данным Stripe: разработчики тратят 42% времени на maintenance и технический долг, большая часть которого — отсутствие документации'
        ] },
        { type: 'heading', value: 'Что документировать' },
        { type: 'code', language: 'bash', value: '# Документировать НУЖНО:\n# ✅ Как запустить проект (README)\n# ✅ Архитектурные решения (ADR)\n# ✅ API контракты (Swagger/OpenAPI)\n# ✅ Процессы деплоя и rollback\n# ✅ Runbooks для инцидентов\n# ✅ Onboarding guide для новых разработчиков\n# ✅ Бизнес-логика и доменные правила\n\n# Документировать НЕ НУЖНО:\n# ❌ Очевидный код (// увеличиваем counter на 1)\n# ❌ Детали реализации, которые видны из кода\n# ❌ Временные решения (лучше TODO в коде)\n# ❌ То, что автогенерируется (JSDoc → API docs)' },
        { type: 'heading', value: 'Принципы хорошей документации' },
        { type: 'list', value: [
          'Актуальная: обновляется вместе с кодом, а не живёт отдельной жизнью',
          'Находимая: лежит рядом с кодом или в известном месте (Wiki)',
          'Краткая: лучше 1 страница актуальная, чем 10 страниц устаревших',
          'С примерами: код-пример стоит тысячи слов описания',
          'Для конкретной аудитории: README для разработчиков ≠ User Guide для пользователей'
        ] },
        { type: 'tip', value: 'Правило: если тебе задали вопрос дважды — задокументируй ответ. Это сигнал, что информация нужна, но не зафиксирована.' },
        { type: 'note', value: 'Docs as Code — подход, при котором документация хранится в Git рядом с кодом, в формате Markdown. Обновляется через PR, ревьюится командой. Используется в Google, GitHub, Stripe.' }
      ]
    },
    {
      id: 2,
      title: 'README — что должно быть в README проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'README.md — это первый файл, который видит человек, открывая проект. Это «лицо» проекта. Хороший README отвечает на вопрос: «Что это, зачем, и как начать?» за 5 минут чтения. В GitHub, GitLab и Bitbucket README автоматически отображается на главной странице репозитория.' },
        { type: 'heading', value: 'Структура хорошего README' },
        { type: 'code', language: 'bash', value: '# Структура README.md:\n\n# 1. Название и описание\n# # Project Name\n# Краткое описание: что делает, для кого, зачем.\n# Одно предложение или абзац.\n\n# 2. Badges (опционально)\n# ![Build Status](badge-url) ![Coverage](badge-url)\n\n# 3. Quick Start / Getting Started\n# Как запустить проект за 2 минуты:\n# git clone ...\n# npm install\n# npm run dev\n\n# 4. Prerequisites / Требования\n# Что нужно установить:\n# - Node.js >= 18\n# - PostgreSQL 15\n# - Docker (опционально)\n\n# 5. Installation / Установка\n# Пошаговая инструкция установки.\n# Копипастные команды, не "установите зависимости".\n\n# 6. Configuration / Конфигурация\n# Переменные окружения:\n# DATABASE_URL=postgresql://...\n# API_KEY=your-key-here\n# Где брать ключи, как настраивать.\n\n# 7. Usage / Использование\n# Основные сценарии использования с примерами.\n\n# 8. Development / Разработка\n# Как запустить тесты, линтер, миграции.\n# npm run test\n# npm run lint\n# npm run db:migrate\n\n# 9. Deployment / Деплой\n# Как деплоить. Или ссылка на отдельный документ.\n\n# 10. Architecture / Архитектура (опционально)\n# Краткое описание структуры проекта.\n# Ссылка на подробную документацию.\n\n# 11. Contributing\n# Как контрибьютить: branching strategy, PR process.\n\n# 12. License\n# MIT / Apache 2.0 / Proprietary' },
        { type: 'heading', value: 'Антипаттерны README' },
        { type: 'list', value: [
          'Пустой README или только название — бесполезен',
          'README написан при создании проекта и никогда не обновлялся',
          '«Установите зависимости» без конкретных команд — человек не знает какие',
          'Нет информации о переменных окружения — проект не запустится',
          'Скопированный из другого проекта без адаптации',
          'README на 20 страниц — слишком длинный, выноси в Wiki'
        ] },
        { type: 'heading', value: 'Пример минимального README' },
        { type: 'code', language: 'bash', value: '# # E-Commerce API\n#\n# REST API для интернет-магазина.\n# Стек: Node.js, Express, PostgreSQL, Redis.\n#\n# ## Quick Start\n#\n# ```bash\n# git clone git@github.com:company/ecommerce-api.git\n# cd ecommerce-api\n# cp .env.example .env  # заполни переменные\n# docker-compose up -d  # PostgreSQL + Redis\n# npm install\n# npm run db:migrate\n# npm run dev           # http://localhost:3000\n# ```\n#\n# ## Environment Variables\n#\n# | Variable      | Description          | Example               |\n# |---------------|----------------------|-----------------------|\n# | DATABASE_URL  | PostgreSQL connection| postgresql://...      |\n# | REDIS_URL     | Redis connection     | redis://localhost:6379|\n# | JWT_SECRET    | Secret for JWT tokens| your-secret-key       |\n#\n# ## Development\n#\n# ```bash\n# npm run test          # запуск тестов\n# npm run lint          # проверка кода\n# npm run db:seed       # загрузка тестовых данных\n# ```\n#\n# ## API Docs\n# http://localhost:3000/api-docs (Swagger UI)' },
        { type: 'tip', value: 'Тест качества README: дай ссылку на репозиторий новому разработчику и засеки время. Если за 15 минут он смог запустить проект — README хороший. Если нет — README нужно улучшить.' }
      ]
    },
    {
      id: 3,
      title: 'Wiki и Confluence — база знаний команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Wiki — это централизованная база знаний команды, где хранится информация, которая не помещается в README: процессы, гайды, архитектурные описания, onboarding. В большинстве IT-компаний используют Confluence (Atlassian), Notion, или GitHub/GitLab Wiki.' },
        { type: 'heading', value: 'Что хранить в Wiki' },
        { type: 'code', language: 'bash', value: '# Структура Wiki команды:\n\n# 📁 Onboarding\n#    ├── Первый день — доступы, инструменты, каналы\n#    ├── Настройка окружения — IDE, Docker, VPN, ключи\n#    ├── Архитектура проекта — обзор сервисов и их связей\n#    ├── Кто за что отвечает — люди и их области\n#    └── FAQ — частые вопросы новичков\n\n# 📁 Процессы\n#    ├── Git Flow — branching strategy, правила коммитов\n#    ├── Code Review — чеклист, SLA, кто ревьюит\n#    ├── Деплой — как деплоить, rollback, hotfix process\n#    └── On-Call — ротация, эскалация, runbooks\n\n# 📁 Архитектура\n#    ├── System Overview — диаграмма сервисов\n#    ├── Data Model — схема БД, ER-диаграмма\n#    ├── API Contracts — основные API между сервисами\n#    └── ADRs — Architecture Decision Records\n\n# 📁 Гайды\n#    ├── Как добавить новый API endpoint\n#    ├── Как настроить мониторинг для нового сервиса\n#    ├── Как запустить нагрузочное тестирование\n#    └── Troubleshooting Guide — типовые проблемы' },
        { type: 'heading', value: 'Confluence vs Notion vs GitHub Wiki' },
        { type: 'list', value: [
          'Confluence: стандарт в enterprise, интеграция с Jira, мощный но сложный',
          'Notion: популярен в стартапах, красивый UI, гибкий, базы данных',
          'GitHub Wiki: рядом с кодом, Markdown, простой, бесплатный',
          'GitBook: для публичной документации (API docs, user guides)',
          'Outline: open-source альтернатива Notion, self-hosted'
        ] },
        { type: 'heading', value: 'Проблема устаревшей документации' },
        { type: 'text', value: 'Главная проблема Wiki — документация устаревает. Команда написала гайд 2 года назад, с тех пор архитектура изменилась, но гайд никто не обновил. Новичок следует устаревшему гайду, тратит 2 дня, понимает что всё неправильно. Это хуже, чем отсутствие документации — потому что вводит в заблуждение.' },
        { type: 'heading', value: 'Как поддерживать Wiki актуальной' },
        { type: 'list', value: [
          'Назначь ответственного за каждую секцию (DRI — Directly Responsible Individual)',
          'Проводи ревью документации раз в квартал: каждый проверяет свою секцию',
          'Ставь дату «Last Updated» на каждой странице',
          'При изменении процесса — обновляй Wiki как часть задачи (Definition of Done)',
          'Помечай устаревшие страницы: «⚠️ Страница может быть устаревшей, проверь с командой»'
        ] },
        { type: 'tip', value: 'Лучший момент обновить Wiki — когда ты сам натыкаешься на устаревшую информацию. Исправь прямо сейчас, пока контекст свежий. Это занимает 5 минут, но экономит часы следующему человеку.' }
      ]
    },
    {
      id: 4,
      title: 'ADR (Architecture Decision Records)',
      type: 'theory',
      content: [
        { type: 'text', value: 'ADR (Architecture Decision Record) — это документ, фиксирующий важное архитектурное или техническое решение: что решили, почему, какие альтернативы рассматривали. ADR решает проблему «А почему мы используем MongoDB, а не PostgreSQL?» — потому что 2 года назад Вася решил, но Вася уволился, и никто не помнит причину.' },
        { type: 'heading', value: 'Формат ADR' },
        { type: 'code', language: 'bash', value: '# ADR-001: Выбор базы данных для сервиса заказов\n# Дата: 2024-01-15\n# Статус: Accepted\n# Автор: Алексей Петров\n\n# == Контекст ==\n# Сервис заказов обрабатывает ~10K заказов в день.\n# Данные заказов имеют сложную структуру: вложенные\n# товары, адреса доставки, история статусов.\n# Нужны: быстрое чтение, транзакции, join между\n# заказами и пользователями.\n\n# == Решение ==\n# Используем PostgreSQL 15.\n\n# == Альтернативы ==\n# 1. MongoDB:\n#    + Гибкая схема для вложенных документов\n#    - Нет ACID транзакций на несколько коллекций\n#    - Команда не имеет опыта с MongoDB\n#\n# 2. MySQL:\n#    + Знакомая технология\n#    - Хуже поддержка JSON типов\n#    - Нет нативных массивов\n#\n# 3. PostgreSQL:\n#    + ACID транзакции\n#    + Отличная поддержка JSON (jsonb)\n#    + Команда имеет опыт\n#    + Масштабируется до наших нагрузок\n#    - Сложнее горизонтальное масштабирование\n\n# == Последствия ==\n# - Нужно настроить реплику для read-нагрузки\n# - Миграции через Flyway\n# - Мониторинг через pg_stat_statements\n\n# == Связанные ADR ==\n# ADR-003: Стратегия кэширования (Redis)' },
        { type: 'heading', value: 'Когда писать ADR' },
        { type: 'list', value: [
          'Выбор технологии или фреймворка (React vs Vue, PostgreSQL vs MongoDB)',
          'Архитектурный паттерн (монолит vs микросервисы, REST vs GraphQL)',
          'Значительное изменение структуры (переход на event-driven архитектуру)',
          'Компромиссы с техническим долгом (осознанное решение «сделаем так, потому что...»)',
          'Решения по безопасности (хранение секретов, аутентификация)',
          'Отказ от технологии (почему мигрируем с X на Y)'
        ] },
        { type: 'heading', value: 'Статусы ADR' },
        { type: 'list', value: [
          'Proposed — предложено, обсуждается командой',
          'Accepted — принято, реализуется',
          'Superseded — заменено новым ADR (ссылка на новый)',
          'Deprecated — устарело, но не заменено',
          'Rejected — отклонено после обсуждения (с причиной)'
        ] },
        { type: 'heading', value: 'Где хранить ADR' },
        { type: 'code', language: 'bash', value: '# Вариант 1: В репозитории (предпочтительно)\n# /docs/adr/\n#    ├── 001-database-selection.md\n#    ├── 002-api-versioning-strategy.md\n#    ├── 003-caching-strategy.md\n#    └── template.md\n\n# Вариант 2: В Wiki/Confluence\n# Удобнее для нетехнических стейкхолдеров\n\n# Вариант 3: Инструмент adr-tools\n# npm install -g adr-tools\n# adr new "Database selection"\n# adr list' },
        { type: 'tip', value: 'ADR не нужно писать идеально. 10 минут на фиксацию решения сейчас сэкономят 2 часа обсуждений через полгода. Начни с простого: контекст (1 абзац), решение (1 предложение), почему (2-3 пункта).' }
      ]
    },
    {
      id: 5,
      title: 'API документация — Swagger/OpenAPI, Postman collections',
      type: 'theory',
      content: [
        { type: 'text', value: 'API документация — это описание контрактов вашего API: какие эндпоинты доступны, какие параметры принимают, какие ответы возвращают. Без API docs frontend-разработчик не может интегрироваться с backend, мобильный разработчик не знает формат данных, а партнёры не могут использовать ваш API.' },
        { type: 'heading', value: 'OpenAPI (Swagger) — стандарт API документации' },
        { type: 'code', language: 'bash', value: '# OpenAPI спецификация (YAML):\n\n# openapi: 3.0.0\n# info:\n#   title: E-Commerce API\n#   version: 1.0.0\n#\n# paths:\n#   /api/products:\n#     get:\n#       summary: Список товаров\n#       parameters:\n#         - name: category\n#           in: query\n#           schema:\n#             type: string\n#         - name: page\n#           in: query\n#           schema:\n#             type: integer\n#             default: 1\n#       responses:\n#         200:\n#           description: Успешный ответ\n#           content:\n#             application/json:\n#               schema:\n#                 type: object\n#                 properties:\n#                   data:\n#                     type: array\n#                     items:\n#                       $ref: "#/components/schemas/Product"\n#                   total:\n#                     type: integer\n#         401:\n#           description: Не авторизован\n\n# Swagger UI автоматически генерирует\n# интерактивную страницу из этой спецификации:\n# http://localhost:3000/api-docs' },
        { type: 'heading', value: 'Подходы к созданию API docs' },
        { type: 'list', value: [
          'Code-first: пишешь код → аннотации генерируют спецификацию (Spring Boot + SpringDoc, NestJS + @ApiProperty)',
          'Spec-first: пишешь OpenAPI спецификацию → генерируешь код и документацию из неё',
          'Manual: пишешь документацию вручную в Markdown или Confluence (не рекомендуется — устаревает)'
        ] },
        { type: 'heading', value: 'Postman Collections' },
        { type: 'code', language: 'bash', value: '# Postman Collection — набор готовых запросов к API:\n\n# Структура коллекции:\n# 📁 E-Commerce API\n#    📁 Auth\n#       ├── POST /auth/login\n#       ├── POST /auth/register\n#       └── POST /auth/refresh-token\n#    📁 Products\n#       ├── GET /products\n#       ├── GET /products/:id\n#       ├── POST /products (admin)\n#       └── PUT /products/:id (admin)\n#    📁 Orders\n#       ├── POST /orders\n#       ├── GET /orders/:id\n#       └── GET /orders (my orders)\n\n# Каждый запрос содержит:\n# - URL и метод\n# - Headers (Authorization: Bearer {{token}})\n# - Body (JSON пример)\n# - Тесты (проверка status code)\n# - Описание и примеры ответов\n\n# Экспорт коллекции:\n# Postman → Export → Collection v2.1 → JSON файл\n# Можно хранить в Git: /docs/postman/collection.json\n\n# Запуск через CLI (Newman):\n# npm install -g newman\n# newman run collection.json --environment staging.json' },
        { type: 'heading', value: 'Что должно быть в API документации' },
        { type: 'list', value: [
          'Аутентификация: как получить токен, как передавать (Bearer, API Key)',
          'Все эндпоинты с описанием, параметрами и примерами',
          'Коды ответов: 200, 400, 401, 403, 404, 500 — с описанием когда возникают',
          'Формат ошибок: единый формат { error: { code, message } }',
          'Rate limiting: ограничения на количество запросов',
          'Pagination: формат, параметры (page, limit, cursor)',
          'Примеры запросов и ответов: curl, JavaScript, Python'
        ] },
        { type: 'warning', value: 'API документация, которая не соответствует реальному API — хуже, чем отсутствие документации. Используйте автогенерацию из кода (code-first) или контрактное тестирование (spec-first), чтобы docs и код всегда были синхронизированы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Написать README для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вы работаете в команде над проектом «TaskFlow» — веб-приложение для управления задачами (аналог Trello). Стек: React + TypeScript (frontend), Node.js + Express (backend), PostgreSQL (база данных), Redis (кэш и сессии). Проект запускается через Docker Compose. Есть переменные окружения для БД, Redis и JWT. Тесты через Jest.\n\nНапишите README.md для этого проекта.',
      requirements: [
        'Напишите название и краткое описание проекта (1-2 предложения)',
        'Секция Quick Start — запуск проекта за минимум шагов (git clone → docker-compose up)',
        'Секция Prerequisites — что нужно установить (Node.js, Docker, etc.)',
        'Секция Environment Variables — таблица переменных с описанием',
        'Секция Development — команды для разработки (тесты, линтер, миграции)',
        'Секция Project Structure — краткое описание структуры папок'
      ],
      hint: 'README должен быть самодостаточным: новый разработчик в первый день должен запустить проект за 15 минут, следуя только README. Не забудьте .env.example и docker-compose.',
      expectedOutput: '# TaskFlow\nВеб-приложение для управления задачами.\nСтек: React, Node.js, PostgreSQL, Redis.\n\n## Quick Start\ngit clone ... && cp .env.example .env && docker-compose up -d && npm install && npm run dev\n\n## Prerequisites\nNode.js >= 18, Docker, Docker Compose\n\n## Environment Variables\nDATABASE_URL, REDIS_URL, JWT_SECRET, PORT\n\n## Development\nnpm run test, npm run lint, npm run db:migrate\n\n## Project Structure\n/client (React), /server (Express), /docker (configs)',
      solution: '# README для проекта TaskFlow:\n\n# # TaskFlow\n#\n# Веб-приложение для управления задачами в командах.\n# Канбан-доски, списки задач, назначение исполнителей,\n# дедлайны и комментарии.\n#\n# **Стек:** React + TypeScript | Node.js + Express |\n# PostgreSQL | Redis\n#\n# ## Quick Start\n#\n# ```bash\n# # 1. Клонировать репозиторий\n# git clone git@github.com:company/taskflow.git\n# cd taskflow\n#\n# # 2. Настроить переменные окружения\n# cp .env.example .env\n# # Заполнить .env (значения по умолчанию работают\n# # для локальной разработки)\n#\n# # 3. Запустить БД и Redis через Docker\n# docker-compose up -d postgres redis\n#\n# # 4. Установить зависимости\n# npm install\n#\n# # 5. Выполнить миграции БД\n# npm run db:migrate\n# npm run db:seed  # загрузить тестовые данные\n#\n# # 6. Запустить приложение\n# npm run dev\n# # Frontend: http://localhost:3000\n# # Backend:  http://localhost:4000\n# # API Docs: http://localhost:4000/api-docs\n# ```\n#\n# ## Prerequisites\n#\n# - Node.js >= 18\n# - npm >= 9\n# - Docker и Docker Compose\n# - Git\n#\n# ## Environment Variables\n#\n# | Variable     | Description            | Default              |\n# |------------- |------------------------|----------------------|\n# | DATABASE_URL | PostgreSQL connection  | postgresql://task... |\n# | REDIS_URL    | Redis connection       | redis://localhost    |\n# | JWT_SECRET   | Secret for JWT tokens  | dev-secret-key       |\n# | PORT         | Backend server port    | 4000                 |\n# | CLIENT_URL   | Frontend URL for CORS  | http://localhost:3000|\n# | NODE_ENV     | Environment            | development          |\n#\n# Все переменные описаны в `.env.example`.\n#\n# ## Development\n#\n# ```bash\n# npm run dev          # Запуск frontend + backend\n# npm run dev:client   # Только frontend\n# npm run dev:server   # Только backend\n#\n# npm run test         # Запуск тестов (Jest)\n# npm run test:watch   # Тесты в watch-режиме\n# npm run test:coverage # Тесты с покрытием\n#\n# npm run lint         # Проверка ESLint + Prettier\n# npm run lint:fix     # Автоисправление\n#\n# npm run db:migrate   # Применить миграции\n# npm run db:rollback  # Откатить последнюю миграцию\n# npm run db:seed      # Загрузить тестовые данные\n# ```\n#\n# ## Project Structure\n#\n# ```\n# taskflow/\n# ├── client/          # React + TypeScript frontend\n# │   ├── src/\n# │   │   ├── components/  # UI компоненты\n# │   │   ├── pages/       # Страницы\n# │   │   ├── hooks/       # Custom hooks\n# │   │   ├── services/    # API calls\n# │   │   └── store/       # State management\n# │   └── public/\n# ├── server/          # Node.js + Express backend\n# │   ├── src/\n# │   │   ├── controllers/ # Route handlers\n# │   │   ├── models/      # Database models\n# │   │   ├── routes/      # API routes\n# │   │   ├── middleware/  # Auth, validation\n# │   │   └── services/   # Business logic\n# │   └── migrations/     # Database migrations\n# ├── docker/          # Docker configurations\n# ├── docs/            # Documentation, ADRs\n# ├── docker-compose.yml\n# ├── .env.example\n# └── package.json\n# ```\n#\n# ## API Documentation\n# После запуска: http://localhost:4000/api-docs\n# (Swagger UI)\n#\n# ## Contributing\n# 1. Создай ветку: `git checkout -b feature/my-feature`\n# 2. Сделай коммит: `git commit -m "feat: add feature"`\n# 3. Создай Pull Request в `main`\n# 4. Пройди Code Review',
      explanation: 'Хороший README — это инструкция по быстрому старту. Ключевые элементы: 1) Quick Start с копипастными командами (не «установите зависимости», а «npm install»), 2) Таблица переменных окружения с описанием и значениями по умолчанию, 3) Команды для разработки (тесты, линтер), 4) Структура проекта для ориентации. Тест качества: новый разработчик должен запустить проект за 15 минут, следуя только README.'
    }
  ]
}
