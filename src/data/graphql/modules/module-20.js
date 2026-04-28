export default {
  id: 20,
  title: 'Performance',
  description: 'Оптимизация GraphQL: query complexity, depth limiting, persisted queries, кэширование и мониторинг.',
  lessons: [
    {
      id: 1,
      title: 'Query Complexity Analysis',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query complexity анализирует стоимость запроса до его выполнения. Это защищает сервер от слишком дорогих запросов, которые могут вызвать перегрузку.' },
        { type: 'heading', value: 'Настройка complexity' },
        { type: 'code', language: 'javascript', value: 'import { createComplexityRule, simpleEstimator, fieldExtensionsEstimator } from \'graphql-query-complexity\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  validationRules: [\n    createComplexityRule({\n      maximumComplexity: 1000,\n      estimators: [\n        fieldExtensionsEstimator(),\n        simpleEstimator({ defaultComplexity: 1 })\n      ],\n      onComplete: (complexity) => {\n        console.log(`Query complexity: ${complexity}`);\n      }\n    })\n  ]\n});' },
        { type: 'heading', value: 'Кастомная стоимость полей' },
        { type: 'code', language: 'graphql', value: '# Поля с разной стоимостью\ntype Query {\n  user(id: ID!): User           # complexity: 1 (по умолчанию)\n  users: [User!]!               # complexity: 10 (список)\n  search(q: String!): [SearchResult!]!  # complexity: 50 (тяжёлый)\n}\n\ntype User {\n  id: ID!                       # complexity: 0 (бесплатно)\n  name: String!                 # complexity: 0\n  posts(first: Int): [Post!]!   # complexity: first * 5\n  followers: [User!]!           # complexity: 20\n}' },
        { type: 'code', language: 'javascript', value: '// Кастомный estimator\nconst customEstimator = (options) => {\n  const { field, args } = options;\n  // Стоимость зависит от аргументов\n  if (field.name === \'posts\') {\n    return (args.first || 10) * 5;\n  }\n  if (field.name === \'search\') {\n    return 50;\n  }\n  return undefined; // Использовать default\n};' },
        { type: 'tip', value: 'Complexity 1000 — хорошее начальное значение. Мониторьте реальные запросы и подстраивайте лимит. Для аутентифицированных пользователей можно увеличить лимит.' }
      ]
    },
    {
      id: 2,
      title: 'Depth Limiting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Depth limiting ограничивает глубину вложенности запроса. Без него клиент может запросить бесконечную вложенность: user -> posts -> author -> posts -> author -> ...' },
        { type: 'heading', value: 'Настройка' },
        { type: 'code', language: 'javascript', value: 'import depthLimit from \'graphql-depth-limit\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  validationRules: [\n    depthLimit(10) // Максимальная глубина — 10 уровней\n  ]\n});\n\n// Допустимый запрос (глубина 4):\n// query {\n//   user {           # 1\n//     posts {        # 2\n//       comments {   # 3\n//         author {   # 4\n//           name\n//         }\n//       }\n//     }\n//   }\n// }\n\n// Отклонённый запрос (глубина > 10):\n// query {\n//   user { posts { author { posts { author { posts { ... } } } } } }\n// }' },
        { type: 'heading', value: 'Комбинация с complexity' },
        { type: 'code', language: 'javascript', value: 'const server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  validationRules: [\n    depthLimit(10),                    // Ограничение глубины\n    createComplexityRule({             // Ограничение сложности\n      maximumComplexity: 1000\n    })\n  ]\n});\n\n// Depth limit защищает от рекурсивных запросов\n// Complexity limit защищает от широких запросов\n// Вместе они обеспечивают полную защиту' },
        { type: 'note', value: 'Depth limit 5-10 достаточен для большинства приложений. Если нужна бо́льшая глубина — пересмотрите дизайн схемы, возможно, нужны плоские типы.' }
      ]
    },
    {
      id: 3,
      title: 'Persisted Queries',
      type: 'theory',
      content: [
        { type: 'text', value: 'Persisted Queries заменяют полный текст запроса хешом. Клиент отправляет хеш, сервер находит запрос по хешу. Это экономит трафик и повышает безопасность.' },
        { type: 'heading', value: 'Automatic Persisted Queries (APQ)' },
        { type: 'code', language: 'javascript', value: '// Apollo Client — поддерживает APQ из коробки\nimport { createPersistedQueryLink } from \'@apollo/client/link/persisted-queries\';\nimport { sha256 } from \'crypto-hash\';\n\nconst client = new ApolloClient({\n  link: from([\n    createPersistedQueryLink({ sha256 }),\n    httpLink\n  ]),\n  cache: new InMemoryCache()\n});\n\n// Поток:\n// 1. Клиент отправляет хеш запроса (без тела)\n// POST /graphql { "extensions": { "persistedQuery": { "sha256Hash": "abc123" } } }\n\n// 2. Сервер не знает хеш -> возвращает PERSISTED_QUERY_NOT_FOUND\n\n// 3. Клиент повторяет с полным запросом + хеш\n// POST /graphql { "query": "query { users { name } }", "extensions": { ... } }\n\n// 4. Сервер сохраняет хеш -> в следующий раз запрос найдётся' },
        { type: 'heading', value: 'Серверная настройка APQ' },
        { type: 'code', language: 'javascript', value: '// Apollo Server поддерживает APQ по умолчанию\n// Кэш в памяти (по умолчанию)\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers\n  // APQ работает из коробки\n});\n\n// Для production — Redis кэш\nimport { KeyvAdapter } from \'@apollo/utils.keyvadapter\';\nimport Keyv from \'keyv\';\nimport KeyvRedis from \'@keyv/redis\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  cache: new KeyvAdapter(\n    new Keyv({ store: new KeyvRedis(\'redis://localhost:6379\') })\n  )\n});' },
        { type: 'tip', value: 'APQ экономит до 90% трафика для повторяющихся запросов. Первый запрос отправляется полностью, все последующие — только хеш (64 байта вместо килобайтов).' }
      ]
    },
    {
      id: 4,
      title: 'Response Caching',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кэширование ответов на уровне HTTP и CDN значительно снижает нагрузку на сервер для публичных данных.' },
        { type: 'heading', value: 'Cache Control директива' },
        { type: 'code', language: 'graphql', value: '# Директива @cacheControl в схеме\ntype Query {\n  # Публичные данные — кэшируем 5 минут\n  posts: [Post!]! @cacheControl(maxAge: 300)\n  # Приватные данные — не кэшируем\n  me: User @cacheControl(maxAge: 0, scope: PRIVATE)\n}\n\ntype Post @cacheControl(maxAge: 300) {\n  id: ID!\n  title: String!\n  body: String!\n  # Счётчик меняется часто — кэш 30 сек\n  viewCount: Int! @cacheControl(maxAge: 30)\n}' },
        { type: 'code', language: 'javascript', value: '// Apollo Server — плагин для Cache-Control header\nimport { ApolloServerPluginCacheControl } from \'@apollo/server/plugin/cacheControl\';\nimport responseCachePlugin from \'@apollo/server-plugin-response-cache\';\n\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  plugins: [\n    // Добавляет Cache-Control header в HTTP ответ\n    ApolloServerPluginCacheControl({\n      defaultMaxAge: 60 // 60 секунд по умолчанию\n    }),\n    // Кэширование полных ответов в памяти\n    responseCachePlugin()\n  ]\n});\n\n// HTTP ответ будет содержать:\n// Cache-Control: public, max-age=300\n// Это позволяет CDN (CloudFlare, Fastly) кэшировать ответ' },
        { type: 'note', value: 'Кэширование через CDN работает только для GET запросов. Apollo Client может отправлять GET для Query (useGETForQueries: true). Мутации всегда POST.' }
      ]
    },
    {
      id: 5,
      title: 'Мониторинг и профилирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мониторинг GraphQL отличается от REST: нужно отслеживать не URL, а операции, поля и резолверы. Рассмотрим инструменты и метрики.' },
        { type: 'heading', value: 'Плагин для метрик' },
        { type: 'code', language: 'javascript', value: '// Плагин для сбора метрик\nconst metricsPlugin = {\n  async requestDidStart({ request }) {\n    const start = Date.now();\n    return {\n      async executionDidStart() {\n        return {\n          willResolveField({ info }) {\n            const fieldStart = Date.now();\n            return (error) => {\n              const duration = Date.now() - fieldStart;\n              // Логируем медленные резолверы\n              if (duration > 100) {\n                console.warn(\n                  `Slow resolver: ${info.parentType}.${info.fieldName} (${duration}ms)`\n                );\n              }\n              // Отправляем метрику\n              metrics.timing(\n                `graphql.resolver.${info.parentType}.${info.fieldName}`,\n                duration\n              );\n            };\n          }\n        };\n      },\n      async willSendResponse() {\n        const duration = Date.now() - start;\n        metrics.timing(\'graphql.request\', duration);\n        metrics.timing(\n          `graphql.operation.${request.operationName || \'anonymous\'}`,\n          duration\n        );\n      }\n    };\n  }\n};' },
        { type: 'heading', value: 'Ключевые метрики' },
        { type: 'list', value: [
          'Время ответа по операциям (p50, p95, p99)',
          'Время выполнения отдельных резолверов',
          'Количество ошибок по типам (auth, validation, internal)',
          'Количество запросов в секунду (RPS)',
          'Cache hit rate (для APQ и response cache)',
          'N+1 detection — количество SQL запросов на операцию'
        ] },
        { type: 'tip', value: 'Apollo Studio предоставляет мониторинг из коробки: трассировка запросов, performance по полям, schema checks и alerts. Бесплатный план покрывает большинство потребностей.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте защиту и оптимизацию GraphQL API: depth limit, query complexity, APQ и cache control.',
      requirements: [
        'Подключите depthLimit(10) как validation rule',
        'Настройте query complexity с максимумом 1000 и кастомным estimator',
        'Добавьте cache control директивы: posts (300s), user (0, PRIVATE)',
        'Настройте response cache plugin',
        'Создайте плагин для логирования медленных запросов (> 500ms)',
        'Пример настройки APQ на клиенте'
      ],
      hint: 'Validation rules добавляются при создании ApolloServer. Cache control через директивы в схеме и плагин. APQ через createPersistedQueryLink на клиенте.',
      expectedOutput: 'Конфигурация сервера с depth limit, complexity, cache control и плагином логирования.',
      solution: `import depthLimit from 'graphql-depth-limit';
import { createComplexityRule, simpleEstimator } from 'graphql-query-complexity';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

// Схема с cache control
const typeDefs = \`#graphql
  type Query {
    posts: [Post!]! @cacheControl(maxAge: 300)
    me: User @cacheControl(maxAge: 0, scope: PRIVATE)
    post(id: ID!): Post @cacheControl(maxAge: 300)
  }

  type Post @cacheControl(maxAge: 300) {
    id: ID!
    title: String!
    body: String!
    viewCount: Int! @cacheControl(maxAge: 30)
  }
\`;

// Плагин логирования
const slowQueryPlugin = {
  async requestDidStart({ request }) {
    const start = Date.now();
    return {
      async willSendResponse({ response }) {
        const duration = Date.now() - start;
        if (duration > 500) {
          console.warn(\`[SLOW] \${request.operationName || 'anon'}: \${duration}ms\`);
        }
      }
    };
  }
};

// Сервер
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(10),
    createComplexityRule({
      maximumComplexity: 1000,
      estimators: [
        simpleEstimator({ defaultComplexity: 1 })
      ],
      onComplete: (complexity) => {
        if (complexity > 500) {
          console.warn(\`High complexity: \${complexity}\`);
        }
      }
    })
  ],
  plugins: [
    ApolloServerPluginCacheControl({ defaultMaxAge: 60 }),
    responseCachePlugin(),
    slowQueryPlugin
  ]
});

// Клиент с APQ
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

const client = new ApolloClient({
  link: from([
    createPersistedQueryLink({ sha256 }),
    httpLink
  ]),
  cache: new InMemoryCache()
});`,
      explanation: 'depthLimit(10) отклоняет запросы с вложенностью более 10 уровней. createComplexityRule анализирует стоимость запроса перед выполнением. Cache control через директивы и плагин добавляет HTTP заголовки для CDN. responseCachePlugin кэширует полные ответы в памяти. slowQueryPlugin логирует запросы дольше 500ms. APQ на клиенте через createPersistedQueryLink экономит трафик.'
    }
  ]
}
