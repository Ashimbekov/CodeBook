export default {
  id: 7,
  title: 'GraphQL Server с Node.js',
  description: 'Создание GraphQL сервера с Apollo Server и Express: настройка, middleware, плагины и production-конфигурация.',
  lessons: [
    {
      id: 1,
      title: 'Apollo Server: быстрый старт',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Server — самый популярный GraphQL сервер для Node.js. Версия 4 — лёгкая, без зависимостей от конкретного HTTP фреймворка.' },
        { type: 'heading', value: 'Установка и минимальный сервер' },
        { type: 'code', language: 'bash', value: '# Создание проекта\nmkdir graphql-server && cd graphql-server\nnpm init -y\nnpm install @apollo/server graphql\n\n# Для ES modules добавьте в package.json:\n# "type": "module"' },
        { type: 'code', language: 'javascript', value: '// server.js\nimport { ApolloServer } from \'@apollo/server\';\nimport { startStandaloneServer } from \'@apollo/server/standalone\';\n\n// Схема\nconst typeDefs = `#graphql\n  type Book {\n    id: ID!\n    title: String!\n    author: String!\n    year: Int\n  }\n\n  type Query {\n    books: [Book!]!\n    book(id: ID!): Book\n  }\n\n  type Mutation {\n    addBook(title: String!, author: String!, year: Int): Book!\n  }\n`;\n\n// Данные (в реальности — БД)\nlet books = [\n  { id: \'1\', title: \'Война и мир\', author: \'Толстой\', year: 1869 },\n  { id: \'2\', title: \'Мастер и Маргарита\', author: \'Булгаков\', year: 1967 }\n];\n\n// Резолверы\nconst resolvers = {\n  Query: {\n    books: () => books,\n    book: (_, { id }) => books.find(b => b.id === id)\n  },\n  Mutation: {\n    addBook: (_, { title, author, year }) => {\n      const book = { id: String(books.length + 1), title, author, year };\n      books.push(book);\n      return book;\n    }\n  }\n};\n\n// Запуск\nconst server = new ApolloServer({ typeDefs, resolvers });\nconst { url } = await startStandaloneServer(server, { listen: { port: 4000 } });\nconsole.log(`Сервер запущен: ${url}`);' },
        { type: 'tip', value: 'startStandaloneServer — простейший способ запуска. Для production используйте expressMiddleware с Express для полного контроля над middleware.' }
      ]
    },
    {
      id: 2,
      title: 'Apollo Server + Express',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интеграция Apollo Server с Express даёт полный контроль: middleware для аутентификации, CORS, rate limiting, статические файлы и REST эндпоинты рядом с GraphQL.' },
        { type: 'heading', value: 'Полная настройка' },
        { type: 'code', language: 'bash', value: 'npm install @apollo/server express cors graphql' },
        { type: 'code', language: 'javascript', value: 'import { ApolloServer } from \'@apollo/server\';\nimport { expressMiddleware } from \'@apollo/server/express4\';\nimport { ApolloServerPluginDrainHttpServer } from \'@apollo/server/plugin/drainHttpServer\';\nimport express from \'express\';\nimport http from \'http\';\nimport cors from \'cors\';\n\nconst app = express();\nconst httpServer = http.createServer(app);\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  plugins: [\n    // Корректное завершение сервера\n    ApolloServerPluginDrainHttpServer({ httpServer })\n  ]\n});\n\nawait server.start();\n\n// GraphQL endpoint\napp.use(\n  \'/graphql\',\n  cors({ origin: [\'http://localhost:3000\'] }),\n  express.json(),\n  expressMiddleware(server, {\n    context: async ({ req }) => {\n      const token = req.headers.authorization?.replace(\'Bearer \', \'\');\n      const user = token ? await verifyToken(token) : null;\n      return { user, db: prisma };\n    }\n  })\n);\n\n// REST эндпоинты рядом с GraphQL\napp.get(\'/health\', (req, res) => res.json({ status: \'ok\' }));\napp.get(\'/api/version\', (req, res) => res.json({ version: \'1.0.0\' }));\n\nawait new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));\nconsole.log(\'Сервер: http://localhost:4000/graphql\');' },
        { type: 'note', value: 'Express middleware выполняется до GraphQL: можно добавить helmet для безопасности, morgan для логирования, express-rate-limit для ограничения запросов.' }
      ]
    },
    {
      id: 3,
      title: 'Структура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для масштабируемого проекта важна правильная структура файлов. Разделяйте схему, резолверы и бизнес-логику по модулям.' },
        { type: 'heading', value: 'Рекомендуемая структура' },
        { type: 'code', language: 'bash', value: '# Структура проекта\nsrc/\n├── index.js              # Точка входа, запуск сервера\n├── schema/\n│   ├── typeDefs/\n│   │   ├── index.js      # Объединение всех схем\n│   │   ├── user.js       # type User, Query, Mutation\n│   │   ├── post.js       # type Post, Query, Mutation\n│   │   └── comment.js    # type Comment\n│   └── resolvers/\n│       ├── index.js      # Объединение всех резолверов\n│       ├── user.js       # User резолверы\n│       ├── post.js       # Post резолверы\n│       └── comment.js    # Comment резолверы\n├── models/               # Модели данных (Prisma, Mongoose)\n│   └── index.js\n├── services/             # Бизнес-логика\n│   ├── userService.js\n│   └── postService.js\n├── middleware/            # Express middleware\n│   └── auth.js\n├── utils/                # Утилиты\n│   ├── errors.js\n│   └── validators.js\n└── config/\n    └── index.js          # Конфигурация' },
        { type: 'heading', value: 'Модульная схема' },
        { type: 'code', language: 'javascript', value: '// schema/typeDefs/user.js\nexport const userTypeDefs = `#graphql\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n    posts: [Post!]!\n  }\n\n  extend type Query {\n    user(id: ID!): User\n    users: [User!]!\n    me: User\n  }\n\n  extend type Mutation {\n    register(input: RegisterInput!): AuthPayload!\n    login(email: String!, password: String!): AuthPayload!\n  }\n`;\n\n// schema/typeDefs/index.js\nimport { userTypeDefs } from \'./user.js\';\nimport { postTypeDefs } from \'./post.js\';\n\n// Базовые типы Query и Mutation\nconst baseTypeDefs = `#graphql\n  type Query {\n    _empty: String\n  }\n  type Mutation {\n    _empty: String\n  }\n`;\n\nexport const typeDefs = [baseTypeDefs, userTypeDefs, postTypeDefs];' },
        { type: 'tip', value: 'Ключевое слово extend type Query позволяет добавлять поля к Query из разных файлов. Базовый Query определяется один раз, остальные модули его расширяют.' }
      ]
    },
    {
      id: 4,
      title: 'Плагины Apollo Server',
      type: 'theory',
      content: [
        { type: 'text', value: 'Плагины позволяют встраиваться в жизненный цикл выполнения запроса: логирование, метрики, кэширование, обработка ошибок.' },
        { type: 'heading', value: 'Жизненный цикл запроса' },
        { type: 'code', language: 'javascript', value: '// Кастомный плагин для логирования\nconst loggingPlugin = {\n  // Вызывается при старте сервера\n  async serverWillStart() {\n    console.log(\'Сервер запускается\');\n    return {\n      async drainServer() {\n        console.log(\'Сервер останавливается\');\n      }\n    };\n  },\n\n  // Вызывается для каждого запроса\n  async requestDidStart(requestContext) {\n    const start = Date.now();\n    console.log(`Запрос: ${requestContext.request.operationName}`);\n\n    return {\n      // После парсинга\n      async parsingDidStart() {\n        console.log(\'Парсинг запроса...\');\n      },\n\n      // После валидации\n      async validationDidStart() {\n        console.log(\'Валидация запроса...\');\n      },\n\n      // После выполнения\n      async executionDidStart() {\n        return {\n          willResolveField({ info }) {\n            const fieldStart = Date.now();\n            return () => {\n              const ms = Date.now() - fieldStart;\n              if (ms > 100) {\n                console.warn(`Медленный резолвер: ${info.parentType}.${info.fieldName} (${ms}ms)`);\n              }\n            };\n          }\n        };\n      },\n\n      // Завершение запроса\n      async willSendResponse() {\n        const duration = Date.now() - start;\n        console.log(`Запрос выполнен за ${duration}ms`);\n      }\n    };\n  }\n};' },
        { type: 'heading', value: 'Использование плагинов' },
        { type: 'code', language: 'javascript', value: 'import { ApolloServerPluginLandingPageLocalDefault } from \'@apollo/server/plugin/landingPage/default\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  plugins: [\n    ApolloServerPluginDrainHttpServer({ httpServer }),\n    ApolloServerPluginLandingPageLocalDefault(),\n    loggingPlugin,\n    // Плагин для метрик\n    {\n      async requestDidStart() {\n        return {\n          async willSendResponse({ response }) {\n            metrics.increment(\'graphql.requests\');\n            if (response.body.singleResult?.errors) {\n              metrics.increment(\'graphql.errors\');\n            }\n          }\n        };\n      }\n    }\n  ]\n});' },
        { type: 'note', value: 'Apollo Server предоставляет встроенные плагины: LandingPage, DrainHttpServer, CacheControl, UsageReporting. Кастомные плагины добавляются в массив plugins.' }
      ]
    },
    {
      id: 5,
      title: 'Альтернативные серверы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Server — не единственный вариант. Существуют другие GraphQL серверы для Node.js, каждый со своими преимуществами.' },
        { type: 'heading', value: 'GraphQL Yoga' },
        { type: 'code', language: 'javascript', value: '// GraphQL Yoga — от The Guild, лёгкий и гибкий\nimport { createServer } from \'http\';\nimport { createSchema, createYoga } from \'graphql-yoga\';\n\nconst yoga = createYoga({\n  schema: createSchema({\n    typeDefs: `\n      type Query {\n        hello(name: String): String!\n      }\n    `,\n    resolvers: {\n      Query: {\n        hello: (_, { name }) => `Привет, ${name || \'мир\'}!`\n      }\n    }\n  })\n});\n\nconst server = createServer(yoga);\nserver.listen(4000, () => {\n  console.log(\'GraphQL Yoga: http://localhost:4000/graphql\');\n});' },
        { type: 'heading', value: 'Mercurius (Fastify)' },
        { type: 'code', language: 'javascript', value: '// Mercurius — GraphQL для Fastify (самый быстрый)\nimport Fastify from \'fastify\';\nimport mercurius from \'mercurius\';\n\nconst app = Fastify();\n\napp.register(mercurius, {\n  schema: typeDefs,\n  resolvers,\n  graphiql: true // Встроенная IDE\n});\n\napp.listen({ port: 4000 });' },
        { type: 'list', value: [
          'Apollo Server — самый популярный, богатая экосистема, Apollo Studio',
          'GraphQL Yoga — лёгкий, поддерживает Deno и Cloudflare Workers',
          'Mercurius — для Fastify, высокая производительность, JIT компиляция',
          'Pothos — schema-builder для TypeScript (code-first подход)',
          'Nexus — code-first GraphQL от Prisma'
        ] },
        { type: 'tip', value: 'Если уже используете Fastify — берите Mercurius. Если нужна экосистема Apollo — Apollo Server. Для edge computing (Cloudflare Workers) — GraphQL Yoga.' }
      ]
    },
    {
      id: 6,
      title: 'Подключение базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL сервер обычно работает с базой данных. Prisma — самый популярный ORM для Node.js, идеально сочетающийся с GraphQL.' },
        { type: 'heading', value: 'Настройка Prisma' },
        { type: 'code', language: 'bash', value: 'npm install prisma @prisma/client\nnpx prisma init --datasource-provider postgresql' },
        { type: 'code', language: 'javascript', value: '// prisma/schema.prisma\n// model User {\n//   id    String @id @default(cuid())\n//   name  String\n//   email String @unique\n//   posts Post[]\n// }\n//\n// model Post {\n//   id       String @id @default(cuid())\n//   title    String\n//   body     String\n//   author   User   @relation(fields: [authorId], references: [id])\n//   authorId String\n// }\n\n// server.js\nimport { PrismaClient } from \'@prisma/client\';\n\nconst prisma = new PrismaClient();\n\n// Передаём prisma через context\nconst server = new ApolloServer({ typeDefs, resolvers });\n\nconst { url } = await startStandaloneServer(server, {\n  context: async ({ req }) => ({\n    db: prisma,\n    user: await getUser(req)\n  })\n});\n\n// Резолверы используют db из context\nconst resolvers = {\n  Query: {\n    users: (_, __, { db }) => db.user.findMany(),\n    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } }),\n    posts: (_, { status }, { db }) => db.post.findMany({\n      where: status ? { status } : undefined,\n      orderBy: { createdAt: \'desc\' }\n    })\n  },\n  User: {\n    posts: (parent, _, { db }) => db.post.findMany({\n      where: { authorId: parent.id }\n    })\n  }\n};' },
        { type: 'note', value: 'Prisma генерирует типизированный клиент из схемы БД. GraphQL схема и Prisma схема — разные вещи. GraphQL определяет API, Prisma определяет БД. Резолверы соединяют их.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: GraphQL API сервер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полноценный GraphQL API сервер на Apollo Server + Express с модульной структурой, контекстом и middleware.',
      requirements: [
        'Настройте Apollo Server с Express middleware',
        'Создайте context с db (можно использовать массивы для данных) и user',
        'Определите схему для типов User и Post с Query и Mutation',
        'Реализуйте резолверы: users, user(id), createUser, createPost',
        'Добавьте middleware для CORS',
        'Добавьте health-check эндпоинт на /health',
        'Добавьте кастомный плагин для логирования запросов'
      ],
      hint: 'Используйте expressMiddleware для интеграции. context функция получает { req } и возвращает объект. Плагин — объект с методом requestDidStart.',
      expectedOutput: 'Работающий GraphQL сервер на Express с модульной структурой, контекстом, CORS, health-check и логированием.',
      solution: `import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';

// Данные в памяти (вместо БД)
const db = {
  users: [
    { id: '1', name: 'Алексей', email: 'alex@mail.ru' },
    { id: '2', name: 'Мария', email: 'maria@mail.ru' }
  ],
  posts: [
    { id: '1', title: 'Первый пост', body: 'Текст...', authorId: '1' }
  ]
};

const typeDefs = \`#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, body: String!, authorId: ID!): Post!
  }
\`;

const resolvers = {
  Query: {
    users: () => db.users,
    user: (_, { id }) => db.users.find(u => u.id === id),
    posts: () => db.posts
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(db.users.length + 1), name, email };
      db.users.push(user);
      return user;
    },
    createPost: (_, { title, body, authorId }) => {
      const post = { id: String(db.posts.length + 1), title, body, authorId };
      db.posts.push(post);
      return post;
    }
  },
  User: {
    posts: (parent) => db.posts.filter(p => p.authorId === parent.id)
  },
  Post: {
    author: (parent) => db.users.find(u => u.id === parent.authorId)
  }
};

const loggingPlugin = {
  async requestDidStart({ request }) {
    const start = Date.now();
    console.log(\`[GraphQL] \${request.operationName || 'Anonymous'}\`);
    return {
      async willSendResponse() {
        console.log(\`[GraphQL] Завершено за \${Date.now() - start}ms\`);
      }
    };
  }
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    loggingPlugin
  ]
});

await server.start();

app.use('/graphql', cors({ origin: '*' }), express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      db,
      user: null // В реальности — из JWT токена
    })
  })
);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

httpServer.listen(4000, () => {
  console.log('Сервер: http://localhost:4000/graphql');
});`,
      explanation: 'Сервер использует Express для HTTP, Apollo Server для GraphQL. expressMiddleware интегрирует Apollo в Express. context создаётся для каждого запроса с доступом к данным и пользователю. Плагин loggingPlugin логирует имя операции и время выполнения. Health-check — обычный Express endpoint. CORS разрешает запросы с фронтенда.'
    }
  ]
}
