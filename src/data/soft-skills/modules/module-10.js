export default {
  id: 10,
  title: 'Документация',
  description: 'README, ADR, API docs, wiki — когда документации достаточно, а когда она избыточна.',
  lessons: [
    {
      id: 1,
      title: 'Зачем документировать и когда НЕ надо',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Золотое правило документации' },
        { type: 'text', value: 'Документация должна отвечать на вопрос «почему», а не «что». Код говорит «что» происходит. Тесты говорят «как» это работает. Документация объясняет «почему» так, а не иначе. Если документация дублирует код — она устареет и будет вводить в заблуждение.' },
        { type: 'heading', value: 'Когда документация нужна' },
        { type: 'list', value: [
          'Архитектурные решения (ADR) — почему выбрали MongoDB вместо PostgreSQL',
          'Onboarding — как новому разработчику запустить проект',
          'API документация — контракт между сервисами',
          'Runbooks — как реагировать на инциденты',
          'Нетривиальная бизнес-логика — почему скидка считается именно так'
        ]},
        { type: 'heading', value: 'Когда документация вредна' },
        { type: 'list', value: [
          'Описание очевидного кода: // Увеличиваем счётчик на 1 → count++',
          'Копия Jira-задачи в README',
          'Документация, которую никто не обновляет → хуже, чем отсутствие документации',
          '50-страничное ТЗ вместо работающего прототипа'
        ]},
        { type: 'tip', value: 'Тест: если убрать эту документацию, кто-нибудь потратит время впустую? Если да — документация нужна. Если нет — удаляйте.' }
      ]
    },
    {
      id: 2,
      title: 'README: первое впечатление о проекте',
      type: 'theory',
      content: [
        { type: 'heading', value: 'README — витрина вашего проекта' },
        { type: 'text', value: 'README — первое, что видит новый разработчик. За 30 секунд он решает: «понимаю ли я что это и как запустить?». Плохой README = часы потраченного времени на вопросы в Slack.' },
        { type: 'heading', value: 'Шаблон идеального README' },
        { type: 'code', language: 'markdown', value: '# Название проекта\n\nОдно предложение: что это и для кого.\n\n## Быстрый старт\n\n```bash\ngit clone <repo>\ncp .env.example .env\ndocker-compose up\n# Приложение на http://localhost:3000\n```\n\n## Архитектура\n\nКраткое описание + ссылка на диаграмму.\n\n## Разработка\n\n```bash\nnpm install\nnpm run dev         # запуск в dev-режиме\nnpm test            # тесты\nnpm run lint        # линтер\n```\n\n## Структура проекта\n\n```\nsrc/\n  api/          # REST endpoints\n  services/     # бизнес-логика\n  models/       # модели данных\n  utils/        # утилиты\n```\n\n## Переменные окружения\n\nСм. `.env.example` — все переменные с описанием.\n\n## Деплой\n\nCI/CD через GitHub Actions. Push в main → автодеплой.\n\n## Полезные ссылки\n\n- [API документация](./docs/api.md)\n- [Архитектурные решения](./docs/adr/)\n- [Runbook](./docs/runbook.md)' },
        { type: 'note', value: 'Проверяйте README раз в месяц: попросите нового человека запустить проект по инструкции. Если он застрял — README устарел.' }
      ]
    },
    {
      id: 3,
      title: 'API документация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Документация API: контракт между командами' },
        { type: 'text', value: 'API документация — это контракт. Frontend-разработчик начинает работу, опираясь на документацию API, ещё до того как backend готов. Если документация неточна — frontend сделает не то, и придётся переделывать.' },
        { type: 'heading', value: 'OpenAPI (Swagger) спецификация' },
        { type: 'code', language: 'yaml', value: '# openapi.yaml\nopenapi: 3.0.0\ninfo:\n  title: Orders API\n  version: 1.0.0\n\npaths:\n  /api/orders:\n    get:\n      summary: Список заказов пользователя\n      parameters:\n        - name: page\n          in: query\n          schema: { type: integer, default: 1 }\n        - name: limit\n          in: query\n          schema: { type: integer, default: 20, maximum: 100 }\n      responses:\n        200:\n          description: Список заказов\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  data:\n                    type: array\n                    items: { $ref: "#/components/schemas/Order" }\n                  total: { type: integer }\n        401:\n          description: Не авторизован' },
        { type: 'heading', value: 'Генерация документации из кода' },
        { type: 'list', value: [
          'swagger-jsdoc — генерация OpenAPI из JSDoc-комментариев в коде',
          'tsoa — генерация из TypeScript декораторов',
          'FastAPI — автоматическая генерация в Python',
          'Spring REST Docs — генерация из тестов в Java'
        ]},
        { type: 'tip', value: 'Лучшая API-документация — генерируемая из кода или тестов. Она всегда актуальна, потому что обновляется автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'Комментарии в коде: когда и как',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Хорошие комментарии объясняют «почему»' },
        { type: 'text', value: 'Код должен быть самодокументируемым настолько, насколько возможно. Хорошие имена функций и переменных устраняют потребность в комментариях «что». Но бизнес-контекст, хаки и workaround-ы требуют комментариев «почему».' },
        { type: 'heading', value: 'Плохие vs хорошие комментарии' },
        { type: 'code', language: 'javascript', value: '// ❌ Плохие комментарии (описывают ЧТО):\n\n// Увеличиваем счётчик\ncount++;\n\n// Проверяем, что пользователь существует\nif (user !== null) { ... }\n\n// Возвращаем результат\nreturn result;\n\n\n// ✅ Хорошие комментарии (объясняют ПОЧЕМУ):\n\n// Stripe API возвращает сумму в центах, конвертируем в доллары\nconst amount = stripeAmount / 100;\n\n// Используем 30-секундный таймаут вместо дефолтного 5с,\n// потому что внешний API партнёра отвечает медленно (SLA: 20s)\nconst TIMEOUT = 30_000;\n\n// HACK: Safari не поддерживает date.toLocaleDateString(\'kk-KZ\')\n// Удалить после выхода Safari 19 (трекер: WEBKIT-12345)\nconst formatted = customFormatDate(date, \'kk-KZ\');' },
        { type: 'heading', value: 'TODO, FIXME, HACK — структурированные маркеры' },
        { type: 'code', language: 'javascript', value: '// TODO(PROJ-789): Заменить на WebSocket после настройки инфраструктуры\n// FIXME: Race condition при одновременном обновлении\n// HACK: Workaround для бага в библиотеке X (issue #123)\n// NOTE: Эта функция вызывается из cron-задачи каждые 5 минут\n// DEPRECATED: Использовать newCalculatePrice() — удалим в v3.0' },
        { type: 'note', value: 'TODO без номера задачи — это мёртвый код. Если TODO важен — создайте задачу. Если не важен — удалите комментарий.' }
      ]
    },
    {
      id: 5,
      title: 'Documentation as Code',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Документация рядом с кодом' },
        { type: 'text', value: 'Документация в Confluence устаревает, потому что живёт отдельно от кода. Если документация — в репозитории, она проходит code review, версионируется и деплоится вместе с кодом.' },
        { type: 'heading', value: 'Структура docs/ в репозитории' },
        { type: 'code', language: 'text', value: 'docs/\n├── adr/                    # Architecture Decision Records\n│   ├── 001-database-choice.md\n│   ├── 002-auth-strategy.md\n│   └── template.md\n├── api/                    # API документация\n│   └── openapi.yaml\n├── guides/                 # Руководства\n│   ├── onboarding.md       # Для новых разработчиков\n│   ├── deployment.md       # Процесс деплоя\n│   └── troubleshooting.md  # Частые проблемы\n├── runbooks/               # Инструкции для инцидентов\n│   ├── high-cpu.md\n│   └── database-recovery.md\n└── architecture/           # Архитектурные диаграммы\n    ├── system-overview.md\n    └── diagrams/' },
        { type: 'heading', value: 'Диаграммы как код (Mermaid)' },
        { type: 'code', language: 'markdown', value: '```mermaid\ngraph LR\n    Client --> API[API Gateway]\n    API --> Auth[Auth Service]\n    API --> Orders[Order Service]\n    Orders --> DB[(PostgreSQL)]\n    Orders --> Queue[RabbitMQ]\n    Queue --> Notifications[Notification Service]\n    Notifications --> Email[Email Provider]\n```' },
        { type: 'tip', value: 'Mermaid-диаграммы рендерятся прямо в GitHub/GitLab. Их можно ревьюить и версионировать, в отличие от картинок.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: напишите документацию для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите README, ADR и API-документацию для небольшого проекта — сервиса сокращения ссылок.',
      requirements: [
        'Напишите README с секциями: описание, быстрый старт, структура, env-переменные',
        'Напишите ADR о выборе базы данных (PostgreSQL vs Redis)',
        'Напишите API-документацию для 3 эндпоинтов',
        'Добавьте примеры запросов и ответов',
        'Включите раздел troubleshooting с 3 частыми проблемами'
      ],
      hint: 'Для сервиса сокращения ссылок подумайте о: хранилище (SQL vs NoSQL), TTL ссылок, аналитике кликов, rate limiting.',
      expectedOutput: 'README: быстрый старт за 3 команды\nADR: выбор PostgreSQL с аргументами\nAPI docs: 3 эндпоинта с примерами\nTroubleshooting: 3 частые проблемы',
      solution: `const readme = \`# LinkShort — Сервис сокращения ссылок

Простой, быстрый сервис для сокращения URL с аналитикой кликов.

## Быстрый старт

\\\`\\\`\\\`bash
git clone https://github.com/team/linkshort.git
cp .env.example .env
docker-compose up
# API: http://localhost:3000
# Документация: http://localhost:3000/docs
\\\`\\\`\\\`

## Структура проекта

\\\`\\\`\\\`
src/
  routes/       # HTTP endpoints
  services/     # Бизнес-логика
  models/       # Модели данных (Sequelize)
  middleware/   # Auth, rate limiting
  utils/        # Генерация коротких кодов
\\\`\\\`\\\`

## Переменные окружения

| Переменная   | Описание              | По умолчанию |
|-------------|----------------------|-------------|
| PORT        | Порт сервера          | 3000        |
| DATABASE_URL| PostgreSQL connection | -           |
| BASE_URL    | Базовый URL для ссылок | http://localhost:3000 |
| RATE_LIMIT  | Запросов в минуту     | 60          |
\`;

const adr = \`# ADR-001: Выбор PostgreSQL для хранения ссылок

## Статус: Принято

## Контекст
Нужно хранить сокращённые ссылки с метаданными и аналитикой кликов.
Рассмотрены: PostgreSQL, Redis, MongoDB.

## Решение
PostgreSQL как основное хранилище.

## Причины
- Надёжность: ACID-транзакции для аналитики (точные счётчики)
- Аналитика: SQL для агрегаций (клики по дням, по странам)
- Зрелость: команда имеет опыт с PostgreSQL
- Масштаб: при 1М ссылок — PostgreSQL справится с индексами

## Отвергнутые варианты
- Redis: быстрый, но нет сложных запросов для аналитики.
  Используем Redis как кэш для горячих ссылок.
- MongoDB: нет преимуществ над PostgreSQL для наших данных.

## Последствия
- Нужен Redis как кэш перед PostgreSQL для популярных ссылок
- Нужны индексы на short_code (уникальный) и created_at
\`;

const apiDocs = \`## API Endpoints

### POST /api/links — Создать короткую ссылку

Запрос:
{
  "url": "https://example.com/very/long/url",
  "customCode": "my-link",    // опционально
  "expiresIn": "7d"           // опционально, по умолчанию: без срока
}

Ответ (201):
{
  "shortUrl": "http://localhost:3000/abc123",
  "code": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "expiresAt": "2026-04-11T00:00:00Z"
}

### GET /:code — Перенаправление

Ответ: 302 Redirect на оригинальный URL
Ошибка (404): { "error": "Link not found or expired" }

### GET /api/links/:code/stats — Статистика

Ответ (200):
{
  "code": "abc123",
  "totalClicks": 1542,
  "clicksByDay": [
    { "date": "2026-04-01", "clicks": 200 },
    { "date": "2026-04-02", "clicks": 350 }
  ]
}
\`;

const troubleshooting = \`## Troubleshooting

### Проблема: "Connection refused" при запуске
Причина: PostgreSQL ещё не готова.
Решение: Подождите 10 секунд или запустите: docker-compose restart app

### Проблема: Rate limit exceeded (429)
Причина: Превышен лимит запросов (60/мин по умолчанию).
Решение: Увеличьте RATE_LIMIT в .env или подождите 1 минуту.

### Проблема: Короткая ссылка возвращает 404
Причина: Ссылка истекла (expiresAt прошёл) или удалена.
Решение: Проверьте GET /api/links/:code/stats — если 404, ссылка удалена.
\`;

console.log('=== README ===');
console.log(readme);
console.log('\\n=== ADR ===');
console.log(adr);
console.log('\\n=== API Docs ===');
console.log(apiDocs);
console.log('\\n=== Troubleshooting ===');
console.log(troubleshooting);`,
      explanation: 'Хорошая документация отвечает на реальные вопросы. README — «как запустить» (для новичка). ADR — «почему так решили» (для будущего себя). API docs — «как использовать» (для потребителей API). Troubleshooting — «что делать если сломалось» (для всех). Каждый тип документации имеет свою аудиторию и цель.'
    }
  ]
}
