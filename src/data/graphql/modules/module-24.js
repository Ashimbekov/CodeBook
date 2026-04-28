export default {
  id: 24,
  title: 'GraphQL Security',
  description: 'Безопасность GraphQL API: ограничение introspection, rate limiting, query allowlisting, защита от DDoS.',
  lessons: [
    {
      id: 1,
      title: 'Угрозы безопасности GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL имеет уникальные угрозы безопасности: introspection раскрывает схему, один запрос может перегрузить сервер, батч-запросы усиливают атаки.' },
        { type: 'heading', value: 'Основные угрозы' },
        { type: 'list', value: [
          'Introspection — злоумышленник узнаёт всю структуру API',
          'Query of Death — глубокий/сложный запрос перегружает сервер',
          'Batching attack — множество мутаций в одном запросе (brute-force login)',
          'Injection — SQL/NoSQL injection через аргументы',
          'Information disclosure — ошибки раскрывают внутреннюю структуру',
          'Authorization bypass — доступ к чужим данным через связи'
        ] },
        { type: 'code', language: 'graphql', value: '# Query of Death — бесконечная рекурсия\nquery Evil {\n  user(id: "1") {\n    posts {\n      author {\n        posts {\n          author {\n            posts {\n              author {\n                # ... бесконечно глубокий запрос\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n# Batching attack — перебор паролей\nmutation BruteForce {\n  a1: login(email: "victim@mail.ru", password: "123456") { token }\n  a2: login(email: "victim@mail.ru", password: "password") { token }\n  a3: login(email: "victim@mail.ru", password: "qwerty") { token }\n  # ... 1000 попыток за один запрос\n}' },
        { type: 'tip', value: 'GraphQL по умолчанию открыт: introspection включена, нет лимитов глубины и сложности. Production API требует явной настройки безопасности.' }
      ]
    },
    {
      id: 2,
      title: 'Ограничение Introspection',
      type: 'theory',
      content: [
        { type: 'text', value: 'Introspection позволяет узнать всю схему API. В production её нужно отключить или ограничить — злоумышленнику не нужно знать вашу схему.' },
        { type: 'heading', value: 'Отключение в Apollo Server' },
        { type: 'code', language: 'javascript', value: 'import { ApolloServerPluginInlineTraceDisabled } from \'@apollo/server/plugin/disabled\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  introspection: process.env.NODE_ENV !== \'production\',\n  plugins: [\n    // Отключить inline tracing в production\n    ...(process.env.NODE_ENV === \'production\'\n      ? [ApolloServerPluginInlineTraceDisabled()]\n      : []\n    )\n  ]\n});' },
        { type: 'heading', value: 'Условная introspection' },
        { type: 'code', language: 'javascript', value: '// Разрешить introspection только для admin\nimport { getOperationAST } from \'graphql\';\n\nconst introspectionPlugin = {\n  async requestDidStart({ request, contextValue }) {\n    return {\n      async didResolveOperation({ operation }) {\n        // Проверяем, является ли запрос introspection\n        if (operation.selectionSet.selections.some(\n          sel => sel.name?.value?.startsWith(\'__\')\n        )) {\n          // Разрешаем только для admin\n          if (contextValue.user?.role !== \'ADMIN\') {\n            throw new GraphQLError(\'Introspection отключена\', {\n              extensions: { code: \'FORBIDDEN\' }\n            });\n          }\n        }\n      }\n    };\n  }\n};' },
        { type: 'note', value: 'Даже с отключенной introspection злоумышленник может угадать поля. Используйте query allowlisting для полной защиты.' }
      ]
    },
    {
      id: 3,
      title: 'Rate Limiting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate limiting ограничивает количество запросов от одного клиента. В GraphQL нужно ограничивать и количество запросов, и их сложность.' },
        { type: 'heading', value: 'HTTP Rate Limiting' },
        { type: 'code', language: 'javascript', value: 'import rateLimit from \'express-rate-limit\';\n\n// Ограничение по IP\nconst apiLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 минут\n  max: 100,                  // 100 запросов\n  message: \'Слишком много запросов\',\n  standardHeaders: true\n});\n\n// Ограничение для мутаций\nconst mutationLimiter = rateLimit({\n  windowMs: 60 * 1000,       // 1 минута\n  max: 10,                   // 10 мутаций\n  keyGenerator: (req) => {\n    // По пользователю, а не по IP\n    return req.headers.authorization || req.ip;\n  }\n});\n\napp.use(\'/graphql\', apiLimiter);\n\n// GraphQL-aware rate limiting\napp.use(\'/graphql\', (req, res, next) => {\n  const body = req.body;\n  if (body?.query?.includes(\'mutation\')) {\n    return mutationLimiter(req, res, next);\n  }\n  next();\n});' },
        { type: 'heading', value: 'Cost-based Rate Limiting' },
        { type: 'code', language: 'javascript', value: '// Rate limit по стоимости запроса\nconst COST_LIMIT_PER_MINUTE = 10000;\nconst userCosts = new Map(); // userId -> { cost, timestamp }\n\nconst costPlugin = {\n  async requestDidStart({ contextValue }) {\n    return {\n      async didResolveOperation({ request }) {\n        const userId = contextValue.user?.id || \'anonymous\';\n        const now = Date.now();\n\n        // Сбрасываем каждую минуту\n        const entry = userCosts.get(userId) || { cost: 0, timestamp: now };\n        if (now - entry.timestamp > 60000) {\n          entry.cost = 0;\n          entry.timestamp = now;\n        }\n\n        // Вычисляем стоимость запроса\n        const queryCost = calculateComplexity(request.query);\n        entry.cost += queryCost;\n\n        if (entry.cost > COST_LIMIT_PER_MINUTE) {\n          throw new GraphQLError(\n            `Лимит сложности превышен (${entry.cost}/${COST_LIMIT_PER_MINUTE})`,\n            { extensions: { code: \'RATE_LIMITED\' } }\n          );\n        }\n\n        userCosts.set(userId, entry);\n      }\n    };\n  }\n};' },
        { type: 'tip', value: 'Cost-based rate limiting справедливее: простой запрос стоит 1, сложный — 100. Пользователь может делать 10000 простых запросов или 100 сложных в минуту.' }
      ]
    },
    {
      id: 4,
      title: 'Query Allowlisting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query Allowlisting (Persisted Queries) — самая надёжная защита. Сервер выполняет только заранее зарегистрированные запросы. Произвольные запросы отклоняются.' },
        { type: 'heading', value: 'Strict Persisted Queries' },
        { type: 'code', language: 'javascript', value: '// Список разрешённых запросов (генерируется при сборке)\nconst allowedQueries = new Map([\n  [\'abc123\', \'query GetPosts { posts { id title } }\'],\n  [\'def456\', \'query GetUser($id: ID!) { user(id: $id) { name email } }\'],\n  [\'ghi789\', \'mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { id } }\']\n]);\n\nconst allowlistPlugin = {\n  async requestDidStart({ request }) {\n    return {\n      async didResolveOperation() {\n        const hash = request.extensions?.persistedQuery?.sha256Hash;\n\n        if (process.env.NODE_ENV === \'production\') {\n          // В production — ТОЛЬКО из allowlist\n          if (!hash || !allowedQueries.has(hash)) {\n            throw new GraphQLError(\n              \'Только зарегистрированные запросы разрешены\',\n              { extensions: { code: \'PERSISTED_QUERY_NOT_FOUND\' } }\n            );\n          }\n        }\n      }\n    };\n  }\n};' },
        { type: 'heading', value: 'Генерация allowlist при сборке' },
        { type: 'code', language: 'javascript', value: '// build-allowlist.js — генерация при CI/CD\nimport { createHash } from \'crypto\';\nimport { glob } from \'glob\';\nimport { readFileSync, writeFileSync } from \'fs\';\n\nconst files = glob.sync(\'src/**/*.graphql\');\nconst allowlist = {};\n\nfor (const file of files) {\n  const query = readFileSync(file, \'utf-8\');\n  const hash = createHash(\'sha256\').update(query).digest(\'hex\');\n  allowlist[hash] = query;\n}\n\nwriteFileSync(\n  \'allowlist.json\',\n  JSON.stringify(allowlist, null, 2)\n);\n\nconsole.log(`Сгенерировано ${Object.keys(allowlist).length} запросов`);' },
        { type: 'note', value: 'Query Allowlisting полностью блокирует произвольные запросы. Злоумышленник не может выполнить introspection, crafted queries или injection. Это «золотой стандарт» безопасности.' }
      ]
    },
    {
      id: 5,
      title: 'Защита от инъекций и IDOR',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL использует переменные вместо строковой подстановки, что защищает от SQL injection. Но остаются угрозы IDOR (Insecure Direct Object Reference) и утечка данных.' },
        { type: 'heading', value: 'Защита от IDOR' },
        { type: 'code', language: 'javascript', value: '// IDOR: пользователь может запросить чужие данные\n// Плохо: нет проверки владельца\nconst resolvers = {\n  Query: {\n    order: (_, { id }, { db }) => {\n      return db.order.findUnique({ where: { id } });\n      // Любой может получить любой заказ!\n    }\n  }\n};\n\n// Хорошо: проверка владельца\nconst resolvers = {\n  Query: {\n    order: async (_, { id }, { db, user }) => {\n      const order = await db.order.findUnique({ where: { id } });\n      if (!order) throw new NotFoundError(\'Order\', id);\n\n      // Проверяем, что заказ принадлежит пользователю\n      if (order.userId !== user.id && user.role !== \'ADMIN\') {\n        throw new ForbiddenError(\'Нет доступа к этому заказу\');\n      }\n\n      return order;\n    }\n  }\n};' },
        { type: 'heading', value: 'Маскировка чувствительных данных' },
        { type: 'code', language: 'javascript', value: '// Скрываем внутренние ошибки в production\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  formatError: (error) => {\n    // Не раскрывать стек-трейс\n    delete error.extensions?.stacktrace;\n\n    // Маскировать внутренние ошибки\n    if (error.extensions?.code === \'INTERNAL_SERVER_ERROR\') {\n      return {\n        message: \'Внутренняя ошибка сервера\',\n        extensions: { code: \'INTERNAL_SERVER_ERROR\' }\n      };\n    }\n\n    // Не раскрывать SQL ошибки\n    if (error.message.includes(\'UNIQUE constraint\')) {\n      return {\n        message: \'Данные уже существуют\',\n        extensions: { code: \'CONFLICT\' }\n      };\n    }\n\n    return error;\n  }\n});' },
        { type: 'tip', value: 'IDOR — одна из самых частых уязвимостей в API. Всегда проверяйте, что пользователь имеет доступ к запрашиваемому ресурсу. Не полагайтесь на frontend.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасный GraphQL API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте полный набор мер безопасности для GraphQL API: depth limit, complexity, rate limiting, introspection и sanitization.',
      requirements: [
        'Отключение introspection в production',
        'Depth limit: максимум 7 уровней вложенности',
        'Query complexity: максимум 500',
        'Rate limiting: 100 запросов / 15 минут по IP',
        'formatError: скрытие стек-трейсов и маскировка внутренних ошибок',
        'Проверка IDOR: резолвер возвращает только данные текущего пользователя'
      ],
      hint: 'Используйте depthLimit, createComplexityRule, express-rate-limit. formatError маскирует ошибки. IDOR предотвращается проверкой userId в резолвере.',
      expectedOutput: 'Конфигурация Apollo Server с полным набором security middleware и примером IDOR-защиты.',
      solution: `import depthLimit from 'graphql-depth-limit';
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';

// Rate Limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errors: [{ message: 'Слишком много запросов' }] }
});

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  validationRules: [
    depthLimit(7),
    createComplexityRule({
      maximumComplexity: 500,
      estimators: [simpleEstimator({ defaultComplexity: 1 })],
      onComplete: (complexity) => {
        if (complexity > 300) {
          console.warn(\`High complexity query: \${complexity}\`);
        }
      }
    })
  ],
  formatError: (formattedError) => {
    delete formattedError.extensions?.stacktrace;

    if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return {
        message: 'Внутренняя ошибка сервера',
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      };
    }

    if (formattedError.message?.includes('UNIQUE constraint')) {
      return {
        message: 'Запись уже существует',
        extensions: { code: 'CONFLICT' }
      };
    }

    return formattedError;
  }
});

// Express с rate limiting
app.use('/graphql', rateLimiter);

// IDOR-защищённый резолвер
const resolvers = {
  Query: {
    myOrders: async (_, __, { db, user }) => {
      if (!user) throw new GraphQLError('Не авторизован', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return db.order.findMany({ where: { userId: user.id } });
    },

    order: async (_, { id }, { db, user }) => {
      if (!user) throw new GraphQLError('Не авторизован');
      const order = await db.order.findUnique({ where: { id } });
      if (!order) throw new GraphQLError('Заказ не найден');
      if (order.userId !== user.id && user.role !== 'ADMIN') {
        throw new GraphQLError('Нет доступа', { extensions: { code: 'FORBIDDEN' } });
      }
      return order;
    }
  }
};`,
      explanation: 'Introspection отключена в production. depthLimit(7) предотвращает глубокие рекурсивные запросы. Query complexity ограничивает стоимость запроса до 500. Rate limiter на Express ограничивает 100 запросов за 15 минут. formatError скрывает стек-трейсы и маскирует SQL ошибки. IDOR-защита проверяет, что order.userId === user.id перед возвратом данных. Все меры работают вместе, обеспечивая многоуровневую защиту.'
    }
  ]
}
