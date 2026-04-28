export default {
  id: 8,
  title: 'DataLoader и N+1 проблема',
  description: 'Проблема N+1 запросов в GraphQL, решение через DataLoader: батчинг, кэширование и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Проблема N+1',
      type: 'theory',
      content: [
        { type: 'text', value: 'N+1 проблема — главная проблема производительности в GraphQL. Она возникает, когда для загрузки списка связанных объектов выполняется N дополнительных запросов к БД.' },
        { type: 'heading', value: 'Как возникает N+1' },
        { type: 'code', language: 'graphql', value: '# Этот запрос вызывает N+1 проблему\nquery {\n  posts {          # 1 запрос: SELECT * FROM posts\n    title\n    author {       # N запросов: SELECT * FROM users WHERE id = ?\n      name         # Для КАЖДОГО поста — отдельный запрос автора!\n    }\n  }\n}\n\n# Если 100 постов, будет 101 SQL запрос:\n# 1. SELECT * FROM posts                    (1 запрос)\n# 2. SELECT * FROM users WHERE id = 1       (100 запросов)\n# 3. SELECT * FROM users WHERE id = 2\n# ... и так 100 раз' },
        { type: 'code', language: 'javascript', value: '// Проблемный резолвер\nconst resolvers = {\n  Query: {\n    posts: (_, __, { db }) => db.post.findMany()  // 1 запрос\n  },\n  Post: {\n    // Вызывается для КАЖДОГО поста отдельно!\n    author: (post, _, { db }) => {\n      console.log(`SQL: SELECT * FROM users WHERE id = ${post.authorId}`);\n      return db.user.findUnique({ where: { id: post.authorId } });\n    }\n    // 100 постов = 100 вызовов этого резолвера\n    // = 100 SQL запросов!\n  }\n};' },
        { type: 'note', value: 'N+1 проблема не уникальна для GraphQL — она существует и в REST с ORM. Но в GraphQL она более заметна, потому что клиент контролирует глубину запроса.' }
      ]
    },
    {
      id: 2,
      title: 'DataLoader: решение N+1',
      type: 'theory',
      content: [
        { type: 'text', value: 'DataLoader — библиотека от Facebook, которая решает N+1 через батчинг и кэширование. Она группирует отдельные запросы за один тик event loop и выполняет их одним батчем.' },
        { type: 'heading', value: 'Принцип работы' },
        { type: 'code', language: 'javascript', value: '// Без DataLoader: 100 отдельных запросов\n// SELECT * FROM users WHERE id = 1\n// SELECT * FROM users WHERE id = 2\n// ... x100\n\n// С DataLoader: 1 батч-запрос\n// SELECT * FROM users WHERE id IN (1, 2, 3, ..., 100)\n\nimport DataLoader from \'dataloader\';\n\n// Batch функция — получает массив ключей, возвращает массив результатов\nconst userLoader = new DataLoader(async (userIds) => {\n  console.log(`Batch загрузка: ${userIds}`);\n  // Один SQL запрос вместо N\n  const users = await db.user.findMany({\n    where: { id: { in: [...userIds] } }\n  });\n\n  // ВАЖНО: результат должен соответствовать порядку ключей\n  const userMap = new Map(users.map(u => [u.id, u]));\n  return userIds.map(id => userMap.get(id) || null);\n});\n\n// Использование в резолвере\nconst resolvers = {\n  Post: {\n    author: (post) => userLoader.load(post.authorId)\n    // .load() не выполняет запрос сразу!\n    // Собирает все вызовы за один тик event loop\n    // Затем вызывает batch функцию один раз\n  }\n};' },
        { type: 'tip', value: 'DataLoader собирает все вызовы .load() за один тик event loop (microtask), затем вызывает batch функцию с массивом всех ключей. Это превращает N запросов в 1.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка DataLoader',
      type: 'theory',
      content: [
        { type: 'text', value: 'DataLoader создаётся для каждого запроса (в context), чтобы кэш был изолирован между запросами разных пользователей.' },
        { type: 'heading', value: 'Создание лоадеров' },
        { type: 'code', language: 'javascript', value: '// loaders.js\nimport DataLoader from \'dataloader\';\n\nexport function createLoaders(db) {\n  return {\n    // Загрузка пользователей по ID\n    userById: new DataLoader(async (ids) => {\n      const users = await db.user.findMany({\n        where: { id: { in: [...ids] } }\n      });\n      const map = new Map(users.map(u => [u.id, u]));\n      return ids.map(id => map.get(id) || new Error(`User ${id} not found`));\n    }),\n\n    // Загрузка постов по authorId\n    postsByAuthorId: new DataLoader(async (authorIds) => {\n      const posts = await db.post.findMany({\n        where: { authorId: { in: [...authorIds] } }\n      });\n      // Группируем посты по authorId\n      const grouped = new Map();\n      for (const post of posts) {\n        if (!grouped.has(post.authorId)) grouped.set(post.authorId, []);\n        grouped.get(post.authorId).push(post);\n      }\n      return authorIds.map(id => grouped.get(id) || []);\n    }),\n\n    // Загрузка комментариев по postId\n    commentsByPostId: new DataLoader(async (postIds) => {\n      const comments = await db.comment.findMany({\n        where: { postId: { in: [...postIds] } }\n      });\n      const grouped = new Map();\n      for (const c of comments) {\n        if (!grouped.has(c.postId)) grouped.set(c.postId, []);\n        grouped.get(c.postId).push(c);\n      }\n      return postIds.map(id => grouped.get(id) || []);\n    })\n  };\n}' },
        { type: 'heading', value: 'Подключение к контексту' },
        { type: 'code', language: 'javascript', value: '// Создаём лоадеры для каждого запроса\napp.use(\'/graphql\', expressMiddleware(server, {\n  context: async ({ req }) => ({\n    db: prisma,\n    user: await getUser(req),\n    loaders: createLoaders(prisma) // Новый экземпляр для каждого запроса\n  })\n}));\n\n// Резолверы используют лоадеры\nconst resolvers = {\n  Query: {\n    posts: (_, __, { db }) => db.post.findMany()\n  },\n  Post: {\n    author: (post, _, { loaders }) => loaders.userById.load(post.authorId),\n    comments: (post, _, { loaders }) => loaders.commentsByPostId.load(post.id)\n  },\n  User: {\n    posts: (user, _, { loaders }) => loaders.postsByAuthorId.load(user.id)\n  }\n};' },
        { type: 'note', value: 'DataLoader ОБЯЗАТЕЛЬНО создаётся заново для каждого запроса. Если использовать один экземпляр на весь сервер, кэш будет расти бесконечно и возвращать устаревшие данные.' }
      ]
    },
    {
      id: 4,
      title: 'Кэширование в DataLoader',
      type: 'theory',
      content: [
        { type: 'text', value: 'DataLoader кэширует результаты в рамках одного запроса. Если одно и то же значение запрашивается дважды, второй раз вернётся из кэша без обращения к БД.' },
        { type: 'heading', value: 'Per-request кэш' },
        { type: 'code', language: 'javascript', value: '// DataLoader кэширует в рамках одного GraphQL запроса\n// Запрос:\n// query {\n//   post(id: "1") {\n//     author { name }     <- загрузка user "5"\n//   }\n//   post(id: "2") {\n//     author { name }     <- загрузка user "5" (тот же автор)\n//   }\n// }\n\n// Без DataLoader: 2 SQL запроса для user "5"\n// С DataLoader: 1 SQL запрос, второй из кэша\n\nconst loader = new DataLoader(batchFn);\nawait loader.load(\"5\"); // Запрос к БД\nawait loader.load(\"5\"); // Из кэша\nawait loader.load(\"5\"); // Из кэша' },
        { type: 'heading', value: 'Очистка кэша после мутаций' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Mutation: {\n    updateUser: async (_, { id, input }, { db, loaders }) => {\n      const user = await db.user.update({\n        where: { id },\n        data: input\n      });\n\n      // Очищаем кэш для обновлённого пользователя\n      loaders.userById.clear(id);\n\n      // Или загружаем новые данные в кэш\n      loaders.userById.prime(id, user);\n\n      return user;\n    },\n\n    deleteUser: async (_, { id }, { db, loaders }) => {\n      await db.user.delete({ where: { id } });\n      loaders.userById.clear(id);\n      return true;\n    }\n  }\n};\n\n// Методы кэша DataLoader:\n// loader.clear(key)     — удалить из кэша\n// loader.clearAll()     — очистить весь кэш\n// loader.prime(key, val) — загрузить в кэш вручную' },
        { type: 'tip', value: 'Можно отключить кэш: new DataLoader(batchFn, { cache: false }). Это полезно для данных, которые часто меняются между обращениями в одном запросе.' }
      ]
    },
    {
      id: 5,
      title: 'Продвинутые паттерны DataLoader',
      type: 'theory',
      content: [
        { type: 'text', value: 'DataLoader можно использовать не только для загрузки по ID. Рассмотрим продвинутые паттерны: составные ключи, фильтрация и интеграция с разными источниками данных.' },
        { type: 'heading', value: 'Составные ключи' },
        { type: 'code', language: 'javascript', value: '// Загрузка по составному ключу\nconst ordersByUserAndStatus = new DataLoader(\n  async (keys) => {\n    // keys = [{ userId: "1", status: "PENDING" }, { userId: "2", status: "SHIPPED" }]\n    const orders = await db.order.findMany({\n      where: {\n        OR: keys.map(({ userId, status }) => ({ userId, status }))\n      }\n    });\n\n    return keys.map(({ userId, status }) =>\n      orders.filter(o => o.userId === userId && o.status === status)\n    );\n  },\n  {\n    // Кастомная функция для ключей (по умолчанию сравнивает по ===)\n    cacheKeyFn: (key) => `${key.userId}:${key.status}`\n  }\n);\n\n// Использование\nconst resolvers = {\n  User: {\n    pendingOrders: (user) =>\n      ordersByUserAndStatus.load({ userId: user.id, status: \'PENDING\' }),\n    shippedOrders: (user) =>\n      ordersByUserAndStatus.load({ userId: user.id, status: \'SHIPPED\' })\n  }\n};' },
        { type: 'heading', value: 'DataLoader для REST API' },
        { type: 'code', language: 'javascript', value: '// DataLoader работает с любым источником данных\nconst githubUserLoader = new DataLoader(async (usernames) => {\n  // Батч-запрос к GitHub API\n  const promises = usernames.map(username =>\n    fetch(`https://api.github.com/users/${username}`)\n      .then(res => res.json())\n      .catch(() => null)\n  );\n  return Promise.all(promises);\n});\n\n// Или один запрос с множественными ID\nconst productLoader = new DataLoader(async (ids) => {\n  const response = await fetch(\n    `http://product-service/api/products?ids=${ids.join(\',\')}`\n  );\n  const products = await response.json();\n  const map = new Map(products.map(p => [p.id, p]));\n  return ids.map(id => map.get(id) || null);\n});' },
        { type: 'note', value: 'DataLoader — универсальный инструмент. Он работает с SQL, NoSQL, REST API, gRPC и любым другим источником данных. Главное — реализовать batch функцию.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: DataLoader для блога',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте DataLoader для блога, устранив N+1 проблему при загрузке авторов постов, комментариев и количества лайков.',
      requirements: [
        'Создайте userByIdLoader — батч-загрузка пользователей по массиву ID',
        'Создайте postsByAuthorIdLoader — батч-загрузка постов, сгруппированных по authorId',
        'Создайте commentCountByPostIdLoader — батч-подсчёт комментариев для массива постов',
        'Batch функция должна возвращать результаты в правильном порядке (соответствие ключам)',
        'Лоадеры должны создаваться в context для каждого запроса',
        'Обновите резолверы Post.author, User.posts и Post.commentCount для использования лоадеров'
      ],
      hint: 'Batch функция получает массив ключей и должна вернуть Promise<Array>, где каждый элемент соответствует ключу по индексу. Используйте Map для правильного порядка.',
      expectedOutput: 'Функция createLoaders возвращающая объект с тремя лоадерами. Резолверы используют loaders из context.',
      solution: `import DataLoader from 'dataloader';

function createLoaders(db) {
  return {
    userById: new DataLoader(async (ids) => {
      const users = await db.user.findMany({
        where: { id: { in: [...ids] } }
      });
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) || new Error(\`User \${id} not found\`));
    }),

    postsByAuthorId: new DataLoader(async (authorIds) => {
      const posts = await db.post.findMany({
        where: { authorId: { in: [...authorIds] } }
      });
      const grouped = new Map();
      for (const post of posts) {
        if (!grouped.has(post.authorId)) {
          grouped.set(post.authorId, []);
        }
        grouped.get(post.authorId).push(post);
      }
      return authorIds.map(id => grouped.get(id) || []);
    }),

    commentCountByPostId: new DataLoader(async (postIds) => {
      const counts = await db.comment.groupBy({
        by: ['postId'],
        where: { postId: { in: [...postIds] } },
        _count: { id: true }
      });
      const map = new Map(counts.map(c => [c.postId, c._count.id]));
      return postIds.map(id => map.get(id) || 0);
    })
  };
}

// Context
const context = async ({ req }) => ({
  db: prisma,
  loaders: createLoaders(prisma)
});

// Резолверы
const resolvers = {
  Query: {
    posts: (_, __, { db }) => db.post.findMany(),
    users: (_, __, { db }) => db.user.findMany()
  },
  Post: {
    author: (post, _, { loaders }) => loaders.userById.load(post.authorId),
    commentCount: (post, _, { loaders }) => loaders.commentCountByPostId.load(post.id)
  },
  User: {
    posts: (user, _, { loaders }) => loaders.postsByAuthorId.load(user.id)
  }
};`,
      explanation: 'Каждый лоадер принимает массив ключей и возвращает массив результатов в том же порядке. userById загружает пользователей одним SQL IN запросом. postsByAuthorId группирует посты по authorId. commentCountByPostId использует groupBy для подсчёта. Map обеспечивает правильный порядок возвращаемых значений. Лоадеры создаются в context заново для каждого запроса — это изолирует per-request кэш.'
    }
  ]
}
