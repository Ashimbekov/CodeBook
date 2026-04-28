export default {
  id: 2,
  title: 'Схема и типы',
  description: 'Система типов GraphQL: скалярные типы, объекты, перечисления, input типы, интерфейсы и union.',
  lessons: [
    {
      id: 1,
      title: 'Скалярные типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Скалярные типы — это примитивные типы данных в GraphQL. Они представляют конечные значения (листья) в графе данных. GraphQL имеет 5 встроенных скалярных типов.' },
        { type: 'heading', value: 'Встроенные скаляры' },
        { type: 'code', language: 'graphql', value: '# 5 встроенных скалярных типов:\n\ntype Example {\n  id: ID!          # Уникальный идентификатор (строка)\n  name: String!    # Строка (UTF-8)\n  age: Int!        # Целое число (32-bit)\n  rating: Float!   # Число с плавающей точкой (64-bit)\n  active: Boolean! # true / false\n}\n\n# ID — сериализуется как String, но семантически\n# означает уникальный идентификатор.\n# Может быть числовым ("123") или UUID ("550e8400-...")' },
        { type: 'heading', value: 'Кастомные скаляры' },
        { type: 'code', language: 'graphql', value: '# Можно определить свои скаляры\nscalar DateTime\nscalar Email\nscalar URL\nscalar JSON\n\ntype User {\n  id: ID!\n  email: Email!\n  website: URL\n  createdAt: DateTime!\n  metadata: JSON\n}' },
        { type: 'code', language: 'javascript', value: '// Реализация кастомного скаляра в JavaScript\nimport { GraphQLScalarType, Kind } from \'graphql\';\n\nconst DateTime = new GraphQLScalarType({\n  name: \'DateTime\',\n  description: \'ISO 8601 дата и время\',\n  // Сервер -> Клиент\n  serialize(value) {\n    return value instanceof Date ? value.toISOString() : value;\n  },\n  // Клиент -> Сервер (из переменных)\n  parseValue(value) {\n    return new Date(value);\n  },\n  // Клиент -> Сервер (из литерала в запросе)\n  parseLiteral(ast) {\n    if (ast.kind === Kind.STRING) {\n      return new Date(ast.value);\n    }\n    return null;\n  }\n});' },
        { type: 'tip', value: 'Библиотека graphql-scalars предоставляет готовые кастомные скаляры: DateTime, Email, URL, PhoneNumber, Currency и десятки других.' }
      ]
    },
    {
      id: 2,
      title: 'Object типы и поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'Object типы — основные строительные блоки GraphQL схемы. Они описывают объекты с набором полей, каждое из которых имеет свой тип.' },
        { type: 'heading', value: 'Определение объектных типов' },
        { type: 'code', language: 'graphql', value: 'type User {\n  id: ID!\n  name: String!\n  email: String!\n  age: Int\n  bio: String\n  posts: [Post!]!       # Массив постов (не null, элементы не null)\n  friends: [User!]      # Может быть null, но элементы не null\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  body: String!\n  published: Boolean!\n  author: User!          # Связь с другим типом\n  comments: [Comment!]!\n  tags: [String!]!\n}\n\ntype Comment {\n  id: ID!\n  text: String!\n  author: User!\n  post: Post!\n  createdAt: String!\n}' },
        { type: 'heading', value: 'Nullability — обязательность полей' },
        { type: 'code', language: 'graphql', value: '# Разница между String, String!, [String], [String!], [String!]!\n\ntype NullabilityExample {\n  a: String          # null или "строка"\n  b: String!         # только "строка", НИКОГДА null\n  c: [String]        # null, [], ["a", null, "b"]\n  d: [String!]       # null, [], ["a", "b"] — элементы не null\n  e: [String!]!      # [], ["a", "b"] — ни массив, ни элементы не null\n}\n\n# Правило: ставьте ! везде, где значение ВСЕГДА должно быть.\n# Лучше быть строже — ослабить легко, ужесточить сложно.' },
        { type: 'note', value: 'Каждое поле в GraphQL может быть null по умолчанию. Добавляйте ! (non-null) осознанно. Если поле может отсутствовать в будущем — не ставьте !.' }
      ]
    },
    {
      id: 3,
      title: 'Enum и Input типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum определяет набор допустимых значений, а Input тип используется для передачи сложных объектов в аргументы запросов и мутаций.' },
        { type: 'heading', value: 'Enum типы' },
        { type: 'code', language: 'graphql', value: '# Enum — перечисление допустимых значений\nenum Role {\n  ADMIN\n  MODERATOR\n  USER\n  GUEST\n}\n\nenum PostStatus {\n  DRAFT\n  PUBLISHED\n  ARCHIVED\n}\n\nenum SortOrder {\n  ASC\n  DESC\n}\n\ntype User {\n  id: ID!\n  name: String!\n  role: Role!          # Может быть только ADMIN, MODERATOR, USER или GUEST\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  status: PostStatus!  # DRAFT, PUBLISHED или ARCHIVED\n}\n\n# Использование в запросе:\n# query { users(role: ADMIN) { name } }' },
        { type: 'heading', value: 'Input типы' },
        { type: 'code', language: 'graphql', value: '# Input типы — для аргументов мутаций и запросов\n# Нельзя использовать обычный type в аргументах!\n\ninput CreateUserInput {\n  name: String!\n  email: String!\n  password: String!\n  role: Role = USER     # Значение по умолчанию\n}\n\ninput UpdateUserInput {\n  name: String          # Все поля необязательные\n  email: String\n  bio: String\n}\n\ninput PostFilterInput {\n  status: PostStatus\n  authorId: ID\n  search: String\n  sortBy: SortOrder = DESC\n}\n\ntype Mutation {\n  createUser(input: CreateUserInput!): User!\n  updateUser(id: ID!, input: UpdateUserInput!): User!\n}\n\ntype Query {\n  posts(filter: PostFilterInput): [Post!]!\n}' },
        { type: 'tip', value: 'Используйте суффикс Input для input типов (CreateUserInput) — это общепринятая конвенция. Input типы не могут содержать поля с типами объектов (type), только скаляры, enum и другие input типы.' }
      ]
    },
    {
      id: 4,
      title: 'Interface и Union типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Interface задаёт контракт, который должны реализовать другие типы. Union позволяет полю возвращать один из нескольких типов. Оба используются для полиморфизма.' },
        { type: 'heading', value: 'Interface — общий контракт' },
        { type: 'code', language: 'graphql', value: '# Interface определяет общие поля\ninterface Node {\n  id: ID!\n}\n\ninterface Timestamped {\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}\n\n# Типы реализуют интерфейс\ntype User implements Node & Timestamped {\n  id: ID!\n  name: String!\n  email: String!\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}\n\ntype Post implements Node & Timestamped {\n  id: ID!\n  title: String!\n  body: String!\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}\n\n# Запрос по интерфейсу\ntype Query {\n  node(id: ID!): Node\n}\n\n# Использование:\nquery {\n  node(id: "user-1") {\n    id\n    ... on User {\n      name\n      email\n    }\n    ... on Post {\n      title\n      body\n    }\n  }\n}' },
        { type: 'heading', value: 'Union — один из нескольких типов' },
        { type: 'code', language: 'graphql', value: '# Union — результат может быть одним из типов\nunion SearchResult = User | Post | Comment\n\ntype Query {\n  search(query: String!): [SearchResult!]!\n}\n\n# Запрос с inline fragments\nquery {\n  search(query: "GraphQL") {\n    ... on User {\n      name\n      email\n    }\n    ... on Post {\n      title\n      body\n    }\n    ... on Comment {\n      text\n      author {\n        name\n      }\n    }\n    # __typename — встроенное поле, возвращает имя типа\n    __typename\n  }\n}' },
        { type: 'code', language: 'javascript', value: '// Резолвер для Union — нужен __resolveType\nconst resolvers = {\n  SearchResult: {\n    __resolveType(obj) {\n      if (obj.email) return \'User\';\n      if (obj.title) return \'Post\';\n      if (obj.text) return \'Comment\';\n      return null;\n    }\n  }\n};' },
        { type: 'note', value: 'Interface подходит, когда типы имеют общие поля (Node, Timestamped). Union подходит, когда типы не имеют общих полей, но могут быть результатом одной операции (SearchResult).' }
      ]
    },
    {
      id: 5,
      title: 'Директивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директивы позволяют модифицировать выполнение запроса или определение схемы. GraphQL имеет встроенные директивы и позволяет создавать кастомные.' },
        { type: 'heading', value: 'Встроенные директивы для запросов' },
        { type: 'code', language: 'graphql', value: '# @include(if: Boolean!) — включить поле, если условие true\nquery GetUser($withPosts: Boolean!) {\n  user(id: "1") {\n    name\n    email\n    posts @include(if: $withPosts) {\n      title\n    }\n  }\n}\n\n# @skip(if: Boolean!) — пропустить поле, если условие true\nquery GetUser($hiddenEmail: Boolean!) {\n  user(id: "1") {\n    name\n    email @skip(if: $hiddenEmail)\n  }\n}\n\n# Переменные передаются отдельно:\n# { "withPosts": true, "hiddenEmail": false }' },
        { type: 'heading', value: 'Директивы схемы' },
        { type: 'code', language: 'graphql', value: '# @deprecated — пометить поле как устаревшее\ntype User {\n  id: ID!\n  name: String!\n  username: String! @deprecated(reason: "Используйте поле name")\n  email: String!\n  avatar: String\n  profilePicture: String @deprecated(reason: "Используйте avatar")\n}' },
        { type: 'heading', value: 'Кастомные директивы' },
        { type: 'code', language: 'graphql', value: '# Определение кастомной директивы\ndirective @auth(requires: Role = ADMIN) on FIELD_DEFINITION\ndirective @cacheControl(maxAge: Int!) on FIELD_DEFINITION\ndirective @uppercase on FIELD_DEFINITION\n\ntype Query {\n  users: [User!]! @auth(requires: ADMIN)\n  publicPosts: [Post!]! @cacheControl(maxAge: 300)\n}\n\ntype User {\n  id: ID!\n  name: String! @uppercase\n  secretField: String @auth(requires: ADMIN)\n}' },
        { type: 'tip', value: 'Кастомные директивы — мощный инструмент для авторизации, кэширования, валидации и трансформации данных. Они делают схему декларативной и читаемой.' }
      ]
    },
    {
      id: 6,
      title: 'Полная схема: SDL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Schema Definition Language (SDL) — язык описания GraphQL схемы. Собираем все концепции вместе в одну полную схему.' },
        { type: 'heading', value: 'Пример полной схемы блога' },
        { type: 'code', language: 'graphql', value: '# Кастомные скаляры\nscalar DateTime\n\n# Перечисления\nenum Role {\n  ADMIN\n  USER\n}\n\nenum PostStatus {\n  DRAFT\n  PUBLISHED\n  ARCHIVED\n}\n\n# Интерфейс\ninterface Node {\n  id: ID!\n}\n\n# Объектные типы\ntype User implements Node {\n  id: ID!\n  name: String!\n  email: String!\n  role: Role!\n  posts: [Post!]!\n  createdAt: DateTime!\n}\n\ntype Post implements Node {\n  id: ID!\n  title: String!\n  body: String!\n  status: PostStatus!\n  author: User!\n  comments: [Comment!]!\n  tags: [String!]!\n  createdAt: DateTime!\n}\n\ntype Comment implements Node {\n  id: ID!\n  text: String!\n  author: User!\n  post: Post!\n  createdAt: DateTime!\n}\n\n# Input типы\ninput CreatePostInput {\n  title: String!\n  body: String!\n  tags: [String!]\n  status: PostStatus = DRAFT\n}\n\ninput UpdatePostInput {\n  title: String\n  body: String\n  tags: [String!]\n  status: PostStatus\n}\n\n# Корневые типы\ntype Query {\n  node(id: ID!): Node\n  me: User\n  users: [User!]!\n  post(id: ID!): Post\n  posts(status: PostStatus): [Post!]!\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): Post!\n  updatePost(id: ID!, input: UpdatePostInput!): Post!\n  deletePost(id: ID!): Boolean!\n}\n\ntype Subscription {\n  postCreated: Post!\n  commentAdded(postId: ID!): Comment!\n}' },
        { type: 'note', value: 'Эта схема содержит все основные элементы: скаляры, перечисления, интерфейсы, объектные типы, input типы, Query, Mutation и Subscription. Это основа любого GraphQL API.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Проектирование схемы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте полную GraphQL схему для интернет-магазина с продуктами, категориями, пользователями и заказами.',
      requirements: [
        'Enum: OrderStatus (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)',
        'Interface: Node с полем id: ID!',
        'Тип Product: id, name, price (Float!), description, category (Category!), inStock (Boolean!)',
        'Тип Category: id, name, products ([Product!]!)',
        'Тип Order: id, user (User!), items ([OrderItem!]!), total (Float!), status (OrderStatus!)',
        'Тип OrderItem: product (Product!), quantity (Int!), price (Float!)',
        'Input типы для создания заказа',
        'Query: products, product(id), categories, order(id)',
        'Mutation: createOrder, updateOrderStatus'
      ],
      hint: 'Начните с enum и interface, затем определите основные типы, input типы и корневые Query/Mutation.',
      expectedOutput: 'Полная SDL схема с типами Product, Category, Order, OrderItem, User, input типами и Query/Mutation.',
      solution: `scalar DateTime

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Category implements Node {
  id: ID!
  name: String!
  products: [Product!]!
}

type Product implements Node {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: Category!
  inStock: Boolean!
}

type OrderItem {
  product: Product!
  quantity: Int!
  price: Float!
}

type Order implements Node {
  id: ID!
  user: User!
  items: [OrderItem!]!
  total: Float!
  status: OrderStatus!
  createdAt: DateTime!
}

input CreateOrderItemInput {
  productId: ID!
  quantity: Int!
}

input CreateOrderInput {
  items: [CreateOrderItemInput!]!
}

type Query {
  products(categoryId: ID): [Product!]!
  product(id: ID!): Product
  categories: [Category!]!
  order(id: ID!): Order
  myOrders: [Order!]!
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  cancelOrder(id: ID!): Order!
}`,
      explanation: 'Схема отражает бизнес-домен: продукты принадлежат категориям, заказы содержат позиции (OrderItem) со ссылкой на продукт. Используем interface Node для единообразного поиска по ID. Input типы отделяют данные для записи от данных для чтения. Enum гарантирует, что статус заказа может быть только одним из допустимых значений.'
    }
  ]
}
