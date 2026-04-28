export default {
  id: 6,
  title: 'Резолверы',
  description: 'Функции-резолверы: аргументы, контекст, info, цепочки резолверов, default resolvers и паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Анатомия резолвера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Резолвер — функция, которая возвращает данные для конкретного поля в схеме. Каждое поле в GraphQL может иметь свой резолвер. Резолвер принимает 4 аргумента.' },
        { type: 'heading', value: 'Четыре аргумента резолвера' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    // parent (root) — результат родительского резолвера\n    // args — аргументы, переданные в поле\n    // context — общий объект для всех резолверов (БД, user, etc.)\n    // info — информация о запросе (AST, путь, схема)\n    user: (parent, args, context, info) => {\n      console.log(parent);   // undefined для корневых полей\n      console.log(args);     // { id: "1" }\n      console.log(context);  // { db, user, req }\n      console.log(info);     // { fieldName, returnType, parentType, ... }\n\n      return context.db.user.findUnique({ where: { id: args.id } });\n    }\n  }\n};\n\n// Сокращённая запись с деструктуризацией:\nconst resolvers = {\n  Query: {\n    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } }),\n    users: (_, __, { db }) => db.user.findMany(),\n    me: (_, __, { user }) => user  // текущий пользователь из контекста\n  }\n};' },
        { type: 'heading', value: 'Контекст (context)' },
        { type: 'code', language: 'javascript', value: '// Контекст создаётся для каждого запроса\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  context: async ({ req }) => {\n    // Извлекаем токен из заголовка\n    const token = req.headers.authorization?.replace(\'Bearer \', \'\');\n    const user = token ? await verifyToken(token) : null;\n\n    return {\n      db: prisma,           // Подключение к БД\n      user,                 // Текущий пользователь\n      loaders: createLoaders() // DataLoader (оптимизация)\n    };\n  }\n});' },
        { type: 'tip', value: 'Parent (первый аргумент) — undefined для Query/Mutation, но содержит родительский объект для вложенных полей. Это ключ к пониманию цепочки резолверов.' }
      ]
    },
    {
      id: 2,
      title: 'Цепочка резолверов',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL выполняет резолверы сверху вниз по дереву запроса. Результат родительского резолвера передаётся как первый аргумент (parent) дочернему.' },
        { type: 'heading', value: 'Пример цепочки' },
        { type: 'code', language: 'graphql', value: '# Запрос\nquery {\n  user(id: "1") {       # 1. Query.user -> User объект\n    name                 # 2. User.name -> из parent\n    posts {              # 3. User.posts -> загрузка постов\n      title              # 4. Post.title -> из parent\n      author {           # 5. Post.author -> загрузка автора\n        name             # 6. User.name -> из parent\n      }\n    }\n  }\n}' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    // 1. Корневой резолвер — parent = undefined\n    user: (_, { id }, { db }) => {\n      return db.user.findUnique({ where: { id } });\n      // Возвращает: { id: "1", name: "Алексей", email: "..." }\n    }\n  },\n\n  User: {\n    // 2. name — default resolver берёт parent.name\n    // Не нужно писать резолвер!\n\n    // 3. posts — нужен резолвер, данных нет в parent\n    posts: (parent, _, { db }) => {\n      // parent = { id: "1", name: "Алексей", email: "..." }\n      return db.post.findMany({ where: { authorId: parent.id } });\n    }\n  },\n\n  Post: {\n    // 4. title — default resolver (parent.title)\n\n    // 5. author — загрузка связанного объекта\n    author: (parent, _, { db }) => {\n      // parent = { id: "10", title: "...", authorId: "1" }\n      return db.user.findUnique({ where: { id: parent.authorId } });\n    }\n  }\n};' },
        { type: 'note', value: 'Default resolver автоматически возвращает parent[fieldName]. Если Query.user вернул объект с полем name, то User.name резолвер писать не нужно — GraphQL возьмёт parent.name.' }
      ]
    },
    {
      id: 3,
      title: 'Асинхронные резолверы и источники данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Резолверы могут быть асинхронными и получать данные из любых источников: базы данных, REST API, файлов, кэша и т.д.' },
        { type: 'heading', value: 'Различные источники данных' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    // Из базы данных (Prisma)\n    users: async (_, __, { db }) => {\n      return db.user.findMany();\n    },\n\n    // Из REST API\n    weather: async (_, { city }) => {\n      const res = await fetch(\n        `https://api.weather.com/v1?city=${city}`\n      );\n      return res.json();\n    },\n\n    // Из Redis кэша\n    cachedStats: async (_, __, { redis }) => {\n      const cached = await redis.get(\'dashboard:stats\');\n      if (cached) return JSON.parse(cached);\n\n      const stats = await computeStats();\n      await redis.set(\'dashboard:stats\', JSON.stringify(stats), \'EX\', 300);\n      return stats;\n    }\n  },\n\n  User: {\n    // Из другого микросервиса\n    orders: async (parent) => {\n      const res = await fetch(\n        `http://order-service/api/users/${parent.id}/orders`\n      );\n      return res.json();\n    },\n\n    // Вычисляемое поле\n    fullName: (parent) => {\n      return `${parent.firstName} ${parent.lastName}`;\n    },\n\n    // Поле с форматированием\n    avatarUrl: (parent) => {\n      return parent.avatar\n        ? `https://cdn.example.com/${parent.avatar}`\n        : \'https://cdn.example.com/default-avatar.png\';\n    }\n  }\n};' },
        { type: 'tip', value: 'GraphQL агрегирует данные из разных источников в один ответ. Это одно из главных преимуществ — клиент делает один запрос, а сервер собирает данные из БД, REST API, кэша и т.д.' }
      ]
    },
    {
      id: 4,
      title: 'Объект info и оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Четвёртый аргумент info содержит информацию о выполняемом запросе: AST, запрошенные поля, путь в графе. Его используют для оптимизации запросов к БД.' },
        { type: 'heading', value: 'Структура info' },
        { type: 'code', language: 'javascript', value: '// info содержит:\n// - fieldName: имя текущего поля\n// - returnType: тип возвращаемого значения\n// - parentType: тип родителя\n// - path: путь от корня запроса\n// - fieldNodes: AST узлы запроса\n// - schema: полная схема\n\n// Получение запрошенных полей\nimport { graphqlFields } from \'graphql-fields\';\n\nconst resolvers = {\n  Query: {\n    users: (_, args, { db }, info) => {\n      // Узнаём, какие поля запросил клиент\n      const requestedFields = graphqlFields(info);\n      // { name: {}, email: {}, posts: { title: {}, body: {} } }\n\n      // Оптимизируем: загружаем только нужные связи\n      const include = {};\n      if (requestedFields.posts) {\n        include.posts = true;\n      }\n      if (requestedFields.followers) {\n        include.followers = true;\n      }\n\n      return db.user.findMany({ include });\n    }\n  }\n};' },
        { type: 'heading', value: 'Оптимизация SQL запросов' },
        { type: 'code', language: 'javascript', value: '// Библиотека graphql-parse-resolve-info\nimport { parseResolveInfo } from \'graphql-parse-resolve-info\';\n\nconst resolvers = {\n  Query: {\n    users: (_, args, { db }, info) => {\n      const parsedInfo = parseResolveInfo(info);\n      const fields = parsedInfo.fieldsByTypeName.User;\n\n      // SELECT только запрошенных полей\n      const select = {};\n      if (fields.id) select.id = true;\n      if (fields.name) select.name = true;\n      if (fields.email) select.email = true;\n\n      return db.user.findMany({ select });\n      // Вместо SELECT * будет SELECT id, name, email\n    }\n  }\n};' },
        { type: 'note', value: 'Использование info для оптимизации — продвинутая техника. Начинайте без неё. Добавляйте, когда профилирование покажет проблемы с производительностью.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны резолверов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют проверенные паттерны организации резолверов для чистого и поддерживаемого кода.' },
        { type: 'heading', value: 'Разделение по файлам' },
        { type: 'code', language: 'javascript', value: '// resolvers/user.js\nexport const userResolvers = {\n  Query: {\n    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } }),\n    users: (_, __, { db }) => db.user.findMany()\n  },\n  Mutation: {\n    createUser: (_, { input }, { db }) => db.user.create({ data: input }),\n    updateUser: (_, { id, input }, { db }) => db.user.update({ where: { id }, data: input })\n  },\n  User: {\n    posts: (parent, _, { db }) => db.post.findMany({ where: { authorId: parent.id } }),\n    fullName: (parent) => `${parent.firstName} ${parent.lastName}`\n  }\n};\n\n// resolvers/post.js\nexport const postResolvers = { ... };\n\n// resolvers/index.js\nimport { merge } from \'lodash\';\nimport { userResolvers } from \'./user.js\';\nimport { postResolvers } from \'./post.js\';\n\nexport const resolvers = merge(userResolvers, postResolvers);' },
        { type: 'heading', value: 'Repository паттерн' },
        { type: 'code', language: 'javascript', value: '// repositories/userRepository.js\nexport class UserRepository {\n  constructor(db) {\n    this.db = db;\n  }\n\n  findById(id) {\n    return this.db.user.findUnique({ where: { id } });\n  }\n\n  findAll(filters = {}) {\n    return this.db.user.findMany({ where: filters });\n  }\n\n  create(data) {\n    return this.db.user.create({ data });\n  }\n\n  update(id, data) {\n    return this.db.user.update({ where: { id }, data });\n  }\n}\n\n// context\ncontext: ({ req }) => ({\n  repos: {\n    user: new UserRepository(prisma),\n    post: new PostRepository(prisma)\n  }\n})\n\n// resolvers — чистые и короткие\nconst resolvers = {\n  Query: {\n    user: (_, { id }, { repos }) => repos.user.findById(id),\n    users: (_, __, { repos }) => repos.user.findAll()\n  }\n};' },
        { type: 'tip', value: 'Repository паттерн изолирует логику доступа к данным от резолверов. Резолверы становятся тонкими, а бизнес-логика — тестируемой.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Резолверы для блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор резолверов для блога с пользователями, постами и комментариями. Используйте все 4 аргумента резолвера.',
      requirements: [
        'Query.posts — возвращает все посты, принимает аргумент limit',
        'Query.post(id) — возвращает один пост по ID',
        'Query.me — возвращает текущего пользователя из context',
        'Mutation.createPost(input) — создаёт пост, проверяет авторизацию',
        'User.posts — загружает посты пользователя через parent.id',
        'Post.author — загружает автора поста через parent.authorId',
        'Post.commentCount — вычисляемое поле (количество комментариев)'
      ],
      hint: 'Первый аргумент (parent) содержит результат родительского резолвера. Используйте его для загрузки связанных данных. context.user содержит текущего пользователя.',
      expectedOutput: 'Объект resolvers с Query, Mutation, User и Post резолверами. Все резолверы используют context.db для доступа к данным.',
      solution: `const resolvers = {
  Query: {
    posts: async (_, { limit = 20 }, { db }) => {
      return db.post.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
    },

    post: async (_, { id }, { db }) => {
      const post = await db.post.findUnique({ where: { id } });
      if (!post) throw new Error('Пост не найден');
      return post;
    },

    me: (_, __, { user }) => {
      if (!user) throw new Error('Не авторизован');
      return user;
    }
  },

  Mutation: {
    createPost: async (_, { input }, { db, user }) => {
      if (!user) throw new Error('Не авторизован');
      return db.post.create({
        data: {
          ...input,
          authorId: user.id,
          status: 'DRAFT'
        }
      });
    }
  },

  User: {
    posts: (parent, _, { db }) => {
      return db.post.findMany({
        where: { authorId: parent.id }
      });
    }
  },

  Post: {
    author: (parent, _, { db }) => {
      return db.user.findUnique({
        where: { id: parent.authorId }
      });
    },

    commentCount: async (parent, _, { db }) => {
      const count = await db.comment.count({
        where: { postId: parent.id }
      });
      return count;
    }
  }
};`,
      explanation: 'Корневые резолверы (Query, Mutation) получают parent = undefined. Для вложенных полей (User.posts, Post.author) parent содержит родительский объект — его используем для загрузки связей. commentCount — вычисляемое поле, не хранится в БД, а считается при каждом запросе. context.user проверяется в мутациях для авторизации.'
    }
  ]
}
