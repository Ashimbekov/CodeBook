export default {
  id: 9,
  title: 'Аутентификация и авторизация',
  description: 'Защита GraphQL API: JWT, context, директивы авторизации, middleware и ролевой доступ.',
  lessons: [
    {
      id: 1,
      title: 'Аутентификация через контекст',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аутентификация в GraphQL реализуется через контекст. Токен из HTTP заголовка проверяется при создании контекста, и информация о пользователе становится доступной всем резолверам.' },
        { type: 'heading', value: 'JWT аутентификация' },
        { type: 'code', language: 'javascript', value: 'import jwt from \'jsonwebtoken\';\n\n// Context создаётся для каждого запроса\nconst context = async ({ req }) => {\n  const token = req.headers.authorization?.replace(\'Bearer \', \'\');\n\n  let user = null;\n  if (token) {\n    try {\n      const decoded = jwt.verify(token, process.env.JWT_SECRET);\n      user = await prisma.user.findUnique({\n        where: { id: decoded.userId }\n      });\n    } catch (err) {\n      // Токен невалидный — user остаётся null\n      console.warn(\'Невалидный токен:\', err.message);\n    }\n  }\n\n  return { user, db: prisma, loaders: createLoaders(prisma) };\n};' },
        { type: 'heading', value: 'Мутации для входа и регистрации' },
        { type: 'code', language: 'javascript', value: 'import bcrypt from \'bcryptjs\';\n\nconst resolvers = {\n  Mutation: {\n    register: async (_, { input }, { db }) => {\n      const exists = await db.user.findUnique({\n        where: { email: input.email }\n      });\n      if (exists) throw new Error(\'Email уже занят\');\n\n      const hashedPassword = await bcrypt.hash(input.password, 10);\n      const user = await db.user.create({\n        data: { ...input, password: hashedPassword }\n      });\n\n      const token = jwt.sign(\n        { userId: user.id },\n        process.env.JWT_SECRET,\n        { expiresIn: \'7d\' }\n      );\n\n      return { token, user };\n    },\n\n    login: async (_, { email, password }, { db }) => {\n      const user = await db.user.findUnique({ where: { email } });\n      if (!user) throw new Error(\'Пользователь не найден\');\n\n      const valid = await bcrypt.compare(password, user.password);\n      if (!valid) throw new Error(\'Неверный пароль\');\n\n      const token = jwt.sign(\n        { userId: user.id },\n        process.env.JWT_SECRET,\n        { expiresIn: \'7d\' }\n      );\n\n      return { token, user };\n    }\n  }\n};' },
        { type: 'tip', value: 'Никогда не храните пароли в открытом виде. Используйте bcrypt для хеширования. JWT токен возвращается клиенту и отправляется в заголовке Authorization: Bearer <token>.' }
      ]
    },
    {
      id: 2,
      title: 'Проверка авторизации в резолверах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Авторизация проверяет, имеет ли аутентифицированный пользователь право выполнить действие. Можно проверять прямо в резолверах или использовать вспомогательные функции.' },
        { type: 'heading', value: 'Прямая проверка' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    // Публичный — доступен всем\n    posts: (_, __, { db }) => db.post.findMany({ where: { status: \'PUBLISHED\' } }),\n\n    // Требует аутентификации\n    me: (_, __, { user }) => {\n      if (!user) throw new AuthenticationError(\'Войдите в систему\');\n      return user;\n    },\n\n    // Требует роли ADMIN\n    users: (_, __, { user, db }) => {\n      if (!user) throw new AuthenticationError(\'Войдите в систему\');\n      if (user.role !== \'ADMIN\') throw new ForbiddenError(\'Нет доступа\');\n      return db.user.findMany();\n    }\n  },\n\n  Mutation: {\n    deletePost: async (_, { id }, { user, db }) => {\n      if (!user) throw new AuthenticationError(\'Войдите в систему\');\n\n      const post = await db.post.findUnique({ where: { id } });\n      if (!post) throw new Error(\'Пост не найден\');\n\n      // Автор или админ может удалить\n      if (post.authorId !== user.id && user.role !== \'ADMIN\') {\n        throw new ForbiddenError(\'Нет доступа\');\n      }\n\n      await db.post.delete({ where: { id } });\n      return true;\n    }\n  }\n};' },
        { type: 'heading', value: 'Вспомогательные функции' },
        { type: 'code', language: 'javascript', value: '// utils/auth.js\nexport function requireAuth(user) {\n  if (!user) {\n    throw new GraphQLError(\'Не авторизован\', {\n      extensions: { code: \'UNAUTHENTICATED\' }\n    });\n  }\n  return user;\n}\n\nexport function requireRole(user, roles) {\n  requireAuth(user);\n  if (!roles.includes(user.role)) {\n    throw new GraphQLError(\'Недостаточно прав\', {\n      extensions: { code: \'FORBIDDEN\' }\n    });\n  }\n  return user;\n}\n\n// Использование в резолверах\nconst resolvers = {\n  Query: {\n    me: (_, __, { user }) => requireAuth(user),\n    users: (_, __, { user, db }) => {\n      requireRole(user, [\'ADMIN\']);\n      return db.user.findMany();\n    }\n  }\n};' },
        { type: 'note', value: 'GraphQLError с extensions.code позволяет клиенту различать типы ошибок: UNAUTHENTICATED — нужно войти, FORBIDDEN — нет прав, BAD_USER_INPUT — невалидные данные.' }
      ]
    },
    {
      id: 3,
      title: 'Директивы авторизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кастомные директивы позволяют декларативно описать правила доступа прямо в схеме. Это чище, чем проверки в каждом резолвере.' },
        { type: 'heading', value: 'Определение директивы @auth' },
        { type: 'code', language: 'graphql', value: 'directive @auth(requires: Role = USER) on FIELD_DEFINITION\n\nenum Role {\n  ADMIN\n  MODERATOR\n  USER\n}\n\ntype Query {\n  # Публичный\n  posts: [Post!]!\n\n  # Любой аутентифицированный\n  me: User! @auth\n\n  # Только ADMIN\n  users: [User!]! @auth(requires: ADMIN)\n\n  # Только MODERATOR или выше\n  reports: [Report!]! @auth(requires: MODERATOR)\n}' },
        { type: 'heading', value: 'Реализация директивы' },
        { type: 'code', language: 'javascript', value: 'import { mapSchema, getDirective, MapperKind } from \'@graphql-tools/utils\';\nimport { defaultFieldResolver, GraphQLError } from \'graphql\';\n\nconst ROLE_HIERARCHY = { ADMIN: 3, MODERATOR: 2, USER: 1 };\n\nfunction authDirectiveTransformer(schema) {\n  return mapSchema(schema, {\n    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {\n      const directive = getDirective(schema, fieldConfig, \'auth\')?.[0];\n      if (!directive) return fieldConfig;\n\n      const requiredRole = directive.requires || \'USER\';\n      const { resolve = defaultFieldResolver } = fieldConfig;\n\n      fieldConfig.resolve = async function (source, args, context, info) {\n        const { user } = context;\n\n        if (!user) {\n          throw new GraphQLError(\'Не авторизован\', {\n            extensions: { code: \'UNAUTHENTICATED\' }\n          });\n        }\n\n        const userLevel = ROLE_HIERARCHY[user.role] || 0;\n        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;\n\n        if (userLevel < requiredLevel) {\n          throw new GraphQLError(\n            `Требуется роль ${requiredRole}`,\n            { extensions: { code: \'FORBIDDEN\' } }\n          );\n        }\n\n        return resolve(source, args, context, info);\n      };\n\n      return fieldConfig;\n    }\n  });\n}\n\n// Применение\nlet schema = makeExecutableSchema({ typeDefs, resolvers });\nschema = authDirectiveTransformer(schema);' },
        { type: 'tip', value: 'Директивы декларативны — глядя на схему, сразу видно, какие поля защищены. Это упрощает аудит безопасности и документацию API.' }
      ]
    },
    {
      id: 4,
      title: 'Разграничение доступа на уровне данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо доступа к операциям, нужно контролировать доступ к данным: пользователь видит только свои заказы, модератор видит все посты и т.д.' },
        { type: 'heading', value: 'Фильтрация по пользователю' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    // Пользователь видит только свои заказы\n    myOrders: (_, __, { user, db }) => {\n      requireAuth(user);\n      return db.order.findMany({ where: { userId: user.id } });\n    },\n\n    // Админ видит все, пользователь — только опубликованные\n    posts: (_, { status }, { user, db }) => {\n      const where = {};\n      if (user?.role === \'ADMIN\') {\n        if (status) where.status = status;\n      } else {\n        where.status = \'PUBLISHED\'; // Не-админы видят только опубликованные\n      }\n      return db.post.findMany({ where });\n    }\n  },\n\n  User: {\n    // Email виден только самому пользователю или админу\n    email: (parent, _, { user }) => {\n      if (user?.id === parent.id || user?.role === \'ADMIN\') {\n        return parent.email;\n      }\n      return null; // Скрываем email\n    }\n  }\n};' },
        { type: 'heading', value: 'Middleware подход' },
        { type: 'code', language: 'javascript', value: '// graphql-shield — библиотека для авторизации\nimport { shield, rule, and, or, not } from \'graphql-shield\';\n\n// Определяем правила\nconst isAuthenticated = rule()((_, __, { user }) => {\n  return user !== null;\n});\n\nconst isAdmin = rule()((_, __, { user }) => {\n  return user?.role === \'ADMIN\';\n});\n\nconst isOwner = rule()((_, { id }, { user, db }) => {\n  // Проверяем, является ли пользователь владельцем ресурса\n  return user !== null;\n});\n\n// Комбинируем правила\nconst permissions = shield({\n  Query: {\n    me: isAuthenticated,\n    users: isAdmin,\n    posts: and(isAuthenticated, or(isAdmin, isOwner))\n  },\n  Mutation: {\n    createPost: isAuthenticated,\n    deleteUser: isAdmin\n  }\n});' },
        { type: 'note', value: 'graphql-shield кэширует результаты правил в рамках запроса. Если правило isAuthenticated уже проверено, повторно оно не выполняется.' }
      ]
    },
    {
      id: 5,
      title: 'WebSocket аутентификация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подписки используют WebSocket, где нет HTTP заголовков. Аутентификация происходит через connectionParams при установке соединения.' },
        { type: 'heading', value: 'Серверная сторона' },
        { type: 'code', language: 'javascript', value: 'import { useServer } from \'graphql-ws/lib/use/ws\';\n\nconst serverCleanup = useServer(\n  {\n    schema,\n    context: async (ctx) => {\n      // connectionParams передаются клиентом при подключении\n      const token = ctx.connectionParams?.authToken;\n      if (!token) {\n        throw new Error(\'Не авторизован\');\n      }\n\n      try {\n        const decoded = jwt.verify(token, process.env.JWT_SECRET);\n        const user = await prisma.user.findUnique({\n          where: { id: decoded.userId }\n        });\n        if (!user) throw new Error(\'Пользователь не найден\');\n        return { user, db: prisma };\n      } catch {\n        throw new Error(\'Невалидный токен\');\n      }\n    },\n\n    onConnect: async (ctx) => {\n      // Можно проверить соединение дополнительно\n      console.log(\'WS подключение\');\n    },\n\n    onDisconnect: (ctx) => {\n      console.log(\'WS отключение\');\n    }\n  },\n  wsServer\n);' },
        { type: 'heading', value: 'Клиентская сторона' },
        { type: 'code', language: 'javascript', value: 'import { GraphQLWsLink } from \'@apollo/client/link/subscriptions\';\nimport { createClient } from \'graphql-ws\';\n\nconst wsLink = new GraphQLWsLink(\n  createClient({\n    url: \'ws://localhost:4000/graphql\',\n    connectionParams: {\n      // Передаём токен при подключении\n      authToken: localStorage.getItem(\'token\')\n    },\n    // Переподключение при потере связи\n    retryAttempts: 5,\n    on: {\n      connected: () => console.log(\'WS подключено\'),\n      closed: () => console.log(\'WS отключено\'),\n      error: (err) => console.error(\'WS ошибка:\', err)\n    }\n  })\n);' },
        { type: 'tip', value: 'connectionParams отправляются один раз при установке WebSocket соединения. Если токен истёк — нужно переподключиться. Используйте retryAttempts для автоматического переподключения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Защита GraphQL API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную систему аутентификации и авторизации для GraphQL API с регистрацией, входом и ролевым доступом.',
      requirements: [
        'Схема AuthPayload: token (String!), user (User!)',
        'Мутация register(name, email, password) — регистрация с хешированием пароля',
        'Мутация login(email, password) — вход с проверкой пароля и выдачей JWT',
        'Функция requireAuth(user) — выбрасывает ошибку, если пользователь не авторизован',
        'Функция requireRole(user, roles) — проверяет роль пользователя',
        'Резолвер me — возвращает текущего пользователя (требует авторизации)',
        'Резолвер users — только для ADMIN'
      ],
      hint: 'Используйте bcrypt для хеширования паролей и jwt.sign для создания токена. context.user доступен из JWT токена в заголовке Authorization.',
      expectedOutput: 'Схема с AuthPayload, мутации register/login, функции requireAuth/requireRole и защищённые резолверы.',
      solution: `// Схема
const typeDefs = \`#graphql
  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    me: User!
    users: [User!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
\`;

// Функции авторизации
import { GraphQLError } from 'graphql';

function requireAuth(user) {
  if (!user) {
    throw new GraphQLError('Не авторизован', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return user;
}

function requireRole(user, roles) {
  requireAuth(user);
  if (!roles.includes(user.role)) {
    throw new GraphQLError('Недостаточно прав', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
  return user;
}

// Резолверы
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    me: (_, __, { user }) => {
      return requireAuth(user);
    },
    users: (_, __, { user, db }) => {
      requireRole(user, ['ADMIN']);
      return db.user.findMany();
    }
  },

  Mutation: {
    register: async (_, { name, email, password }, { db }) => {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) throw new GraphQLError('Email уже зарегистрирован');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: { name, email, password: hashedPassword, role: 'USER' }
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token, user };
    },

    login: async (_, { email, password }, { db }) => {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) throw new GraphQLError('Пользователь не найден');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new GraphQLError('Неверный пароль');

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { token, user };
    }
  }
};`,
      explanation: 'Регистрация хеширует пароль через bcrypt и создаёт JWT токен. Логин проверяет пароль и выдаёт токен. requireAuth проверяет наличие пользователя в контексте. requireRole дополнительно проверяет роль. me доступен любому авторизованному, users — только ADMIN. GraphQLError с extensions.code позволяет клиенту различать типы ошибок.'
    }
  ]
}
