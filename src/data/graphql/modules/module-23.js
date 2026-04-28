export default {
  id: 23,
  title: 'Hasura и auto-generated GraphQL',
  description: 'Автоматическая генерация GraphQL API из базы данных: Hasura, PostGraphile, подписки и авторизация.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Hasura',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hasura — движок, который автоматически генерирует GraphQL API из PostgreSQL базы данных. Вы создаёте таблицы — Hasura создаёт queries, mutations, subscriptions.' },
        { type: 'heading', value: 'Что Hasura делает автоматически' },
        { type: 'list', value: [
          'CRUD операции для каждой таблицы (query, insert, update, delete)',
          'Связи между таблицами (foreign keys -> GraphQL relationships)',
          'Фильтрация, сортировка, пагинация из коробки',
          'Real-time подписки на изменения данных',
          'Авторизация на уровне строк и столбцов',
          'Event triggers и scheduled triggers'
        ] },
        { type: 'heading', value: 'Быстрый старт' },
        { type: 'code', language: 'bash', value: '# Docker Compose для Hasura\n# docker-compose.yml:\n# version: "3.6"\n# services:\n#   postgres:\n#     image: postgres:15\n#     environment:\n#       POSTGRES_PASSWORD: postgrespassword\n#   hasura:\n#     image: hasura/graphql-engine:latest\n#     ports:\n#       - "8080:8080"\n#     environment:\n#       HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/postgres\n#       HASURA_GRAPHQL_ADMIN_SECRET: myadminsecret\n#       HASURA_GRAPHQL_ENABLE_CONSOLE: "true"\n\ndocker-compose up -d\n# Консоль: http://localhost:8080/console' },
        { type: 'tip', value: 'Hasura превращает часы работы над API в минуты. Создайте таблицы в PostgreSQL — получите полный GraphQL API с подписками, пагинацией и авторизацией.' }
      ]
    },
    {
      id: 2,
      title: 'Запросы и мутации в Hasura',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hasura автоматически генерирует мощные запросы с фильтрацией, сортировкой и агрегацией для каждой таблицы.' },
        { type: 'heading', value: 'Сгенерированные запросы' },
        { type: 'code', language: 'graphql', value: '# Hasura генерирует эти запросы автоматически из таблицы "posts"\n\n# Получить все посты с фильтрацией\nquery {\n  posts(\n    where: { status: { _eq: "published" }, author_id: { _eq: 1 } }\n    order_by: { created_at: desc }\n    limit: 10\n    offset: 0\n  ) {\n    id\n    title\n    body\n    created_at\n    # Связь через foreign key\n    author {\n      id\n      name\n    }\n    # Вложенная связь\n    comments(limit: 5, order_by: { created_at: desc }) {\n      id\n      text\n      user {\n        name\n      }\n    }\n    # Агрегация\n    comments_aggregate {\n      aggregate {\n        count\n      }\n    }\n  }\n}' },
        { type: 'heading', value: 'Мутации' },
        { type: 'code', language: 'graphql', value: '# Вставка\nmutation {\n  insert_posts_one(\n    object: {\n      title: "Новый пост"\n      body: "Текст поста"\n      author_id: 1\n      status: "draft"\n    }\n  ) {\n    id\n    title\n    created_at\n  }\n}\n\n# Обновление\nmutation {\n  update_posts_by_pk(\n    pk_columns: { id: 1 }\n    _set: { status: "published", published_at: "now()" }\n  ) {\n    id\n    status\n    published_at\n  }\n}\n\n# Удаление\nmutation {\n  delete_posts(where: { status: { _eq: "archived" } }) {\n    affected_rows\n  }\n}' },
        { type: 'note', value: 'Hasura поддерживает сложные фильтры: _eq, _neq, _gt, _lt, _in, _like, _and, _or, _not. Агрегации: count, sum, avg, max, min.' }
      ]
    },
    {
      id: 3,
      title: 'Авторизация в Hasura',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hasura реализует авторизацию на уровне строк и столбцов через систему ролей и permissions. Правила задаются в консоли или метаданных.' },
        { type: 'heading', value: 'Роли и permissions' },
        { type: 'code', language: 'javascript', value: '// JWT токен содержит Hasura claims\n// {\n//   "sub": "user-123",\n//   "https://hasura.io/jwt/claims": {\n//     "x-hasura-default-role": "user",\n//     "x-hasura-allowed-roles": ["user", "admin"],\n//     "x-hasura-user-id": "123"\n//   }\n// }\n\n// Permissions для роли "user" на таблицу "posts":\n\n// SELECT (чтение):\n// Фильтр: { "status": { "_eq": "published" } }\n//  ИЛИ: { "author_id": { "_eq": "X-Hasura-User-Id" } }\n// Колонки: id, title, body, created_at (без author_id)\n\n// INSERT (создание):\n// Проверка: { "author_id": { "_eq": "X-Hasura-User-Id" } }\n// Колонки: title, body (author_id устанавливается автоматически)\n\n// UPDATE (обновление):\n// Фильтр: { "author_id": { "_eq": "X-Hasura-User-Id" } }\n// Колонки: title, body, status\n\n// DELETE (удаление):\n// Фильтр: { "author_id": { "_eq": "X-Hasura-User-Id" } }' },
        { type: 'heading', value: 'Настройка JWT' },
        { type: 'code', language: 'bash', value: '# Переменные окружения для Hasura\n# HASURA_GRAPHQL_JWT_SECRET:\n# {\n#   "type": "HS256",\n#   "key": "your-256-bit-secret-key-minimum-32-chars"\n# }\n\n# Или с JWKS (Auth0, Firebase):\n# {\n#   "type": "RS256",\n#   "jwk_url": "https://your-auth0.auth0.com/.well-known/jwks.json"\n# }' },
        { type: 'tip', value: 'Hasura применяет правила авторизации на уровне PostgreSQL WHERE clause. Это значит, что фильтрация происходит в базе данных — максимально эффективно.' }
      ]
    },
    {
      id: 4,
      title: 'Actions и Remote Schemas',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hasura Actions позволяют добавить кастомную бизнес-логику через внешние HTTP endpoints. Remote Schemas объединяют Hasura с другими GraphQL серверами.' },
        { type: 'heading', value: 'Actions — кастомная логика' },
        { type: 'code', language: 'graphql', value: '# Определение Action в Hasura Console\n# Action: registerUser\n# Type: Mutation\n# Handler: http://backend:3000/api/register\n\ntype Mutation {\n  registerUser(input: RegisterInput!): RegisterOutput!\n}\n\ninput RegisterInput {\n  name: String!\n  email: String!\n  password: String!\n}\n\ntype RegisterOutput {\n  id: String!\n  token: String!\n}' },
        { type: 'code', language: 'javascript', value: '// backend/api/register.js — обработчик Action\napp.post(\'/api/register\', async (req, res) => {\n  const { input } = req.body;\n  const { name, email, password } = input.input;\n\n  // Бизнес-логика\n  const hashedPassword = await bcrypt.hash(password, 10);\n  const user = await db.user.create({\n    data: { name, email, password: hashedPassword }\n  });\n\n  const token = jwt.sign(\n    {\n      sub: user.id,\n      \'https://hasura.io/jwt/claims\': {\n        \'x-hasura-default-role\': \'user\',\n        \'x-hasura-allowed-roles\': [\'user\'],\n        \'x-hasura-user-id\': user.id\n      }\n    },\n    process.env.JWT_SECRET\n  );\n\n  res.json({ id: user.id, token });\n});' },
        { type: 'heading', value: 'Event Triggers' },
        { type: 'code', language: 'javascript', value: '// Event Trigger: при создании заказа отправить email\n// Hasura вызывает webhook при INSERT в таблицу orders\n\napp.post(\'/api/webhooks/order-created\', async (req, res) => {\n  const { event } = req.body;\n  const { new: order } = event.data;\n\n  // Отправить email\n  await sendEmail({\n    to: order.customer_email,\n    subject: `Заказ #${order.id} создан`,\n    body: `Спасибо за заказ на сумму ${order.total} руб.`\n  });\n\n  res.json({ success: true });\n});' },
        { type: 'note', value: 'Actions — для синхронной кастомной логики (регистрация, оплата). Event Triggers — для асинхронных реакций (email, уведомления, аналитика).' }
      ]
    },
    {
      id: 5,
      title: 'PostGraphile — альтернатива',
      type: 'theory',
      content: [
        { type: 'text', value: 'PostGraphile — альтернатива Hasura для автоматической генерации GraphQL из PostgreSQL. Работает как Node.js библиотека или CLI.' },
        { type: 'heading', value: 'Настройка PostGraphile' },
        { type: 'code', language: 'bash', value: '# Установка\nnpm install postgraphile\n\n# Запуск CLI\nnpx postgraphile \\\n  -c postgres://user:pass@localhost/mydb \\\n  --schema public \\\n  --watch \\\n  --enhance-graphiql' },
        { type: 'code', language: 'javascript', value: '// Или как Express middleware\nimport { postgraphile } from \'postgraphile\';\nimport express from \'express\';\n\nconst app = express();\n\napp.use(postgraphile(\n  process.env.DATABASE_URL,\n  \'public\',\n  {\n    watchPg: true,                    // Live reload при изменении БД\n    graphiql: true,                   // GraphiQL IDE\n    enhanceGraphiql: true,\n    dynamicJson: true,                // JSON поля\n    enableCors: true,\n    // Кастомизация через плагины\n    appendPlugins: [require(\'@graphile-contrib/pg-simplify-inflector\')]\n  }\n));\n\napp.listen(5000);' },
        { type: 'heading', value: 'Hasura vs PostGraphile' },
        { type: 'list', value: [
          'Hasura: Docker-контейнер, GUI консоль, подписки из коробки, roles-based auth',
          'PostGraphile: Node.js библиотека, программная кастомизация, плагины',
          'Hasura: лучше для быстрого прототипирования и production',
          'PostGraphile: лучше для глубокой кастомизации и контроля'
        ] },
        { type: 'tip', value: 'Hasura подходит для большинства проектов: быстрый старт, GUI, подписки, авторизация. PostGraphile — если нужна максимальная кастомизация на уровне Node.js.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Hasura API для блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте SQL таблицы и Hasura permissions для блога с пользователями, постами и комментариями.',
      requirements: [
        'SQL: таблицы users, posts, comments с foreign keys',
        'Hasura роли: anonymous (только чтение published), user (CRUD своих данных), admin (всё)',
        'Permissions для user на posts: чтение published + своих, создание со своим author_id',
        'Пример GraphQL запроса с фильтрацией и пагинацией через Hasura',
        'Пример Action для кастомной регистрации',
        'Пример Event Trigger для отправки уведомления при новом комментарии'
      ],
      hint: 'SQL таблицы с foreign keys автоматически становятся GraphQL связями. Permissions используют session variables (X-Hasura-User-Id) для фильтрации.',
      expectedOutput: 'SQL схема, permissions для трёх ролей, примеры запросов и Action/Event Trigger.',
      solution: `-- SQL таблицы
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hasura Permissions (JSON metadata)
-- Роль: anonymous
-- posts SELECT: filter { status: { _eq: "published" } }
-- columns: id, title, body, created_at

-- Роль: user
-- posts SELECT: filter { _or: [{ status: { _eq: "published" } }, { author_id: { _eq: "X-Hasura-User-Id" } }] }
-- posts INSERT: check { author_id: { _eq: "X-Hasura-User-Id" } }
-- posts UPDATE: filter { author_id: { _eq: "X-Hasura-User-Id" } }, columns: title, body, status
-- posts DELETE: filter { author_id: { _eq: "X-Hasura-User-Id" } }

-- Роль: admin — без ограничений

-- Пример запроса
-- query {
--   posts(
--     where: { status: { _eq: "published" } }
--     order_by: { created_at: desc }
--     limit: 10
--     offset: 0
--   ) {
--     id
--     title
--     author { name }
--     comments_aggregate { aggregate { count } }
--   }
-- }

-- Action: registerUser
-- Handler: POST http://backend:3000/api/register
-- Input: { name: String!, email: String!, password: String! }
-- Output: { id: String!, token: String! }

-- Event Trigger: on_comment_insert
-- Table: comments, Operation: INSERT
-- Webhook: POST http://backend:3000/api/notify-comment
-- Payload: new row data`,
      explanation: 'SQL foreign keys (author_id -> users.id) автоматически создают GraphQL связи. Hasura permissions фильтруют данные по X-Hasura-User-Id — это значение из JWT токена. anonymous видит только published, user — published + свои, admin — всё. Action registerUser обрабатывает регистрацию с хешированием пароля на бэкенде. Event Trigger on_comment_insert вызывает webhook при каждом новом комментарии.'
    }
  ]
}
