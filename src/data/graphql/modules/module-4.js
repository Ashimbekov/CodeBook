export default {
  id: 4,
  title: 'Мутации (Mutations)',
  description: 'Создание, обновление и удаление данных через мутации: input типы, возвращаемые значения, оптимистичные обновления.',
  lessons: [
    {
      id: 1,
      title: 'Основы мутаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мутации — операции для изменения данных на сервере. В отличие от запросов (Query), мутации имеют побочные эффекты: создание, обновление, удаление записей.' },
        { type: 'heading', value: 'Синтаксис мутации' },
        { type: 'code', language: 'graphql', value: '# Определение мутаций в схеме\ntype Mutation {\n  createUser(name: String!, email: String!): User!\n  updateUser(id: ID!, name: String, email: String): User!\n  deleteUser(id: ID!): Boolean!\n}\n\n# Выполнение мутации\nmutation {\n  createUser(name: "Алексей", email: "alex@mail.ru") {\n    id\n    name\n    email\n  }\n}\n\n# Ответ:\n# {\n#   "data": {\n#     "createUser": {\n#       "id": "123",\n#       "name": "Алексей",\n#       "email": "alex@mail.ru"\n#     }\n#   }\n# }' },
        { type: 'heading', value: 'Мутация с переменными' },
        { type: 'code', language: 'graphql', value: '# В реальных приложениях данные передаются через переменные\nmutation CreateUser($name: String!, $email: String!) {\n  createUser(name: $name, email: $email) {\n    id\n    name\n    email\n  }\n}\n\n# Переменные:\n# { "name": "Мария", "email": "maria@mail.ru" }' },
        { type: 'tip', value: 'Мутации выполняются последовательно (в отличие от запросов, которые выполняются параллельно). Если в одном запросе несколько мутаций, они выполнятся по порядку.' }
      ]
    },
    {
      id: 2,
      title: 'Input типы для мутаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для мутаций с множеством аргументов используют Input типы. Это группирует связанные данные и упрощает сигнатуру мутации.' },
        { type: 'heading', value: 'Без Input типа vs с Input типом' },
        { type: 'code', language: 'graphql', value: '# Плохо: много аргументов\ntype Mutation {\n  createPost(\n    title: String!\n    body: String!\n    tags: [String!]\n    status: PostStatus\n    categoryId: ID!\n    coverImage: String\n  ): Post!\n}\n\n# Хорошо: один Input аргумент\ninput CreatePostInput {\n  title: String!\n  body: String!\n  tags: [String!]\n  status: PostStatus = DRAFT\n  categoryId: ID!\n  coverImage: String\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n}' },
        { type: 'heading', value: 'Раздельные Input типы для разных операций' },
        { type: 'code', language: 'graphql', value: '# Для создания — все обязательные поля\ninput CreateProductInput {\n  name: String!\n  price: Float!\n  description: String!\n  categoryId: ID!\n  inStock: Boolean = true\n}\n\n# Для обновления — все поля опциональные\ninput UpdateProductInput {\n  name: String\n  price: Float\n  description: String\n  categoryId: ID\n  inStock: Boolean\n}\n\ntype Mutation {\n  createProduct(input: CreateProductInput!): Product!\n  updateProduct(id: ID!, input: UpdateProductInput!): Product!\n}\n\n# Использование:\nmutation {\n  updateProduct(id: "1", input: { price: 999.99 }) {\n    id\n    name\n    price\n  }\n}' },
        { type: 'note', value: 'Конвенция именования: CreateXxxInput, UpdateXxxInput, DeleteXxxInput. Input типы не могут содержать поля с object типами — только скаляры, enum и другие input.' }
      ]
    },
    {
      id: 3,
      title: 'Возвращаемые значения мутаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мутация должна возвращать изменённые данные, чтобы клиент мог обновить свой кэш без дополнительного запроса. Есть несколько паттернов для возвращаемых значений.' },
        { type: 'heading', value: 'Паттерн: Возврат объекта' },
        { type: 'code', language: 'graphql', value: '# Простой вариант — вернуть изменённый объект\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n  updatePost(id: ID!, input: UpdatePostInput!): Post!\n  deletePost(id: ID!): Post!  # Вернуть удалённый объект\n}' },
        { type: 'heading', value: 'Паттерн: Payload тип' },
        { type: 'code', language: 'graphql', value: '# Payload — объект-обёртка с дополнительной информацией\ntype CreatePostPayload {\n  post: Post!\n  userErrors: [UserError!]!\n}\n\ntype UserError {\n  field: [String!]\n  message: String!\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): CreatePostPayload!\n}\n\n# Использование:\nmutation {\n  createPost(input: { title: "...", body: "..." }) {\n    post {\n      id\n      title\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\n# Ответ с ошибкой:\n# {\n#   "data": {\n#     "createPost": {\n#       "post": null,\n#       "userErrors": [\n#         { "field": ["input", "title"], "message": "Заголовок слишком короткий" }\n#       ]\n#     }\n#   }\n# }' },
        { type: 'tip', value: 'Shopify и GitHub используют паттерн Payload. Он позволяет возвращать бизнес-ошибки (невалидные данные) отдельно от системных ошибок (сеть, авторизация).' }
      ]
    },
    {
      id: 4,
      title: 'CRUD операции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим полный набор CRUD мутаций на примере блога: создание, чтение, обновление и удаление постов с резолверами.' },
        { type: 'heading', value: 'Схема' },
        { type: 'code', language: 'graphql', value: 'input CreatePostInput {\n  title: String!\n  body: String!\n  tags: [String!]\n}\n\ninput UpdatePostInput {\n  title: String\n  body: String\n  tags: [String!]\n  status: PostStatus\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n  updatePost(id: ID!, input: UpdatePostInput!): Post!\n  deletePost(id: ID!): Boolean!\n  publishPost(id: ID!): Post!\n}' },
        { type: 'heading', value: 'Резолверы' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Mutation: {\n    createPost: async (_, { input }, { db, user }) => {\n      if (!user) throw new Error(\'Не авторизован\');\n      const post = await db.post.create({\n        data: {\n          ...input,\n          authorId: user.id,\n          status: \'DRAFT\'\n        }\n      });\n      return post;\n    },\n\n    updatePost: async (_, { id, input }, { db, user }) => {\n      const post = await db.post.findUnique({ where: { id } });\n      if (!post) throw new Error(\'Пост не найден\');\n      if (post.authorId !== user.id) throw new Error(\'Нет доступа\');\n      return db.post.update({ where: { id }, data: input });\n    },\n\n    deletePost: async (_, { id }, { db, user }) => {\n      const post = await db.post.findUnique({ where: { id } });\n      if (!post) throw new Error(\'Пост не найден\');\n      if (post.authorId !== user.id) throw new Error(\'Нет доступа\');\n      await db.post.delete({ where: { id } });\n      return true;\n    },\n\n    publishPost: async (_, { id }, { db, user }) => {\n      return db.post.update({\n        where: { id },\n        data: { status: \'PUBLISHED\', publishedAt: new Date() }\n      });\n    }\n  }\n};' },
        { type: 'note', value: 'Всегда проверяйте авторизацию в мутациях. Пользователь должен иметь право изменять только свои данные (или быть администратором).' }
      ]
    },
    {
      id: 5,
      title: 'Множественные мутации и транзакции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно выполнить несколько мутаций атомарно. GraphQL выполняет мутации последовательно, но не гарантирует транзакционность.' },
        { type: 'heading', value: 'Последовательное выполнение' },
        { type: 'code', language: 'graphql', value: '# Мутации выполняются по порядку сверху вниз\nmutation BatchOperations {\n  first: createPost(input: { title: "Пост 1", body: "..." }) {\n    id\n  }\n  second: createPost(input: { title: "Пост 2", body: "..." }) {\n    id\n  }\n  third: updateUser(id: "1", input: { name: "Новое имя" }) {\n    name\n  }\n}\n\n# first -> second -> third (последовательно)\n# Если second упадёт, first уже выполнен, third не выполнится' },
        { type: 'heading', value: 'Транзакционная мутация' },
        { type: 'code', language: 'javascript', value: '// Для атомарных операций создайте одну мутацию\n// Схема:\n// mutation createOrderWithItems(input: CreateOrderInput!): Order!\n\nconst resolvers = {\n  Mutation: {\n    createOrderWithItems: async (_, { input }, { db }) => {\n      // Транзакция в Prisma\n      return db.$transaction(async (tx) => {\n        // 1. Создаём заказ\n        const order = await tx.order.create({\n          data: {\n            userId: input.userId,\n            status: \'PENDING\'\n          }\n        });\n\n        // 2. Создаём позиции заказа\n        for (const item of input.items) {\n          const product = await tx.product.findUnique({\n            where: { id: item.productId }\n          });\n          if (!product) throw new Error(`Товар ${item.productId} не найден`);\n          if (!product.inStock) throw new Error(`${product.name} нет в наличии`);\n\n          await tx.orderItem.create({\n            data: {\n              orderId: order.id,\n              productId: item.productId,\n              quantity: item.quantity,\n              price: product.price\n            }\n          });\n        }\n\n        // 3. Считаем общую сумму\n        const total = await tx.orderItem.aggregate({\n          where: { orderId: order.id },\n          _sum: { price: true }\n        });\n\n        return tx.order.update({\n          where: { id: order.id },\n          data: { total: total._sum.price },\n          include: { items: true }\n        });\n      });\n    }\n  }\n};' },
        { type: 'tip', value: 'Если несколько операций должны быть атомарными — оберните их в одну мутацию с транзакцией на уровне резолвера. Не полагайтесь на последовательное выполнение нескольких мутаций.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CRUD мутации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный набор мутаций для управления задачами (todo-app) с input типами и payload возвращаемыми значениями.',
      requirements: [
        'Определите enum TaskPriority: LOW, MEDIUM, HIGH, URGENT',
        'Определите enum TaskStatus: TODO, IN_PROGRESS, DONE',
        'Input тип CreateTaskInput: title (обязательно), description, priority (по умолчанию MEDIUM), dueDate',
        'Input тип UpdateTaskInput: title, description, priority, status, dueDate — все опциональные',
        'Payload тип MutationResult с полями: success (Boolean!), message (String), task (Task)',
        'Мутации: createTask, updateTask, deleteTask, assignTask(taskId, userId)',
        'Напишите мутацию для создания задачи с переменными'
      ],
      hint: 'Используйте input типы для группировки аргументов. Payload тип позволяет вернуть и результат, и сообщение об ошибке.',
      expectedOutput: 'Схема с enum, input, payload типами и мутациями. Пример мутации createTask с переменными.',
      solution: `enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

type Task {
  id: ID!
  title: String!
  description: String
  priority: TaskPriority!
  status: TaskStatus!
  dueDate: String
  assignee: User
  createdAt: String!
}

input CreateTaskInput {
  title: String!
  description: String
  priority: TaskPriority = MEDIUM
  dueDate: String
}

input UpdateTaskInput {
  title: String
  description: String
  priority: TaskPriority
  status: TaskStatus
  dueDate: String
}

type TaskPayload {
  success: Boolean!
  message: String
  task: Task
}

type Mutation {
  createTask(input: CreateTaskInput!): TaskPayload!
  updateTask(id: ID!, input: UpdateTaskInput!): TaskPayload!
  deleteTask(id: ID!): TaskPayload!
  assignTask(taskId: ID!, userId: ID!): TaskPayload!
}

# Пример мутации
mutation CreateNewTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    success
    message
    task {
      id
      title
      priority
      status
    }
  }
}

# Переменные:
# {
#   "input": {
#     "title": "Изучить GraphQL мутации",
#     "description": "Пройти модуль 4 курса",
#     "priority": "HIGH",
#     "dueDate": "2025-12-31"
#   }
# }`,
      explanation: 'Input типы разделяют данные для создания (обязательные поля) и обновления (все опциональные). TaskPayload возвращает success, message и сам объект — клиент может обработать и успех, и ошибку. Enum гарантирует, что priority и status принимают только допустимые значения. Мутация assignTask принимает два ID вместо input типа, так как аргументов всего два.'
    }
  ]
}
