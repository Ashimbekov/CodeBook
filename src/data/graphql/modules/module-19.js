export default {
  id: 19,
  title: 'Federation и Microservices',
  description: 'Apollo Federation: supergraph, subgraphs, entities, ключи и композиция микросервисных GraphQL API.',
  lessons: [
    {
      id: 1,
      title: 'Что такое GraphQL Federation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Federation позволяет объединить несколько GraphQL API (subgraphs) в один unified API (supergraph). Каждый микросервис управляет своей частью схемы.' },
        { type: 'heading', value: 'Архитектура Federation' },
        { type: 'list', value: [
          'Subgraph — отдельный GraphQL сервис (users, products, orders)',
          'Supergraph — единая схема, объединяющая все subgraphs',
          'Router (Gateway) — принимает запросы и распределяет по subgraphs',
          'Composition — процесс объединения subgraph схем в supergraph'
        ] },
        { type: 'code', language: 'graphql', value: '# Users Subgraph (порт 4001)\ntype User @key(fields: "id") {\n  id: ID!\n  name: String!\n  email: String!\n}\n\ntype Query {\n  me: User\n  users: [User!]!\n}\n\n# Products Subgraph (порт 4002)\ntype Product @key(fields: "id") {\n  id: ID!\n  name: String!\n  price: Float!\n}\n\n# Расширяем User из другого subgraph\nextend type User @key(fields: "id") {\n  id: ID! @external\n  reviews: [Review!]!   # Добавляем поле из этого сервиса\n}\n\n# Router (порт 4000) — единая точка входа\n# Клиент видит один GraphQL API:\n# query { me { name, email, reviews { rating } } }' },
        { type: 'tip', value: 'Federation позволяет разным командам независимо развивать свои сервисы. Users команда управляет User subgraph, Products команда — Products subgraph.' }
      ]
    },
    {
      id: 2,
      title: 'Entities и @key',
      type: 'theory',
      content: [
        { type: 'text', value: 'Entity — тип, который может быть разрешён (resolved) через несколько subgraphs. Директива @key определяет, по какому полю можно найти сущность.' },
        { type: 'heading', value: 'Определение Entity' },
        { type: 'code', language: 'graphql', value: '# Users Subgraph — определяет User\ntype User @key(fields: "id") {\n  id: ID!\n  name: String!\n  email: String!\n}\n\n# Reviews Subgraph — расширяет User\ntype User @key(fields: "id") {\n  id: ID!\n  reviews: [Review!]!\n  averageRating: Float\n}\n\ntype Review @key(fields: "id") {\n  id: ID!\n  body: String!\n  rating: Int!\n  author: User!\n}\n\n# Orders Subgraph — тоже расширяет User\ntype User @key(fields: "id") {\n  id: ID!\n  orders: [Order!]!\n}' },
        { type: 'heading', value: 'Reference Resolver' },
        { type: 'code', language: 'javascript', value: '// Users Subgraph — резолвер для __resolveReference\nconst resolvers = {\n  User: {\n    // Вызывается, когда другой subgraph запрашивает User\n    __resolveReference(reference, { db }) {\n      // reference = { __typename: "User", id: "1" }\n      return db.user.findUnique({ where: { id: reference.id } });\n    }\n  }\n};\n\n// Reviews Subgraph\nconst resolvers = {\n  User: {\n    reviews(user, _, { db }) {\n      return db.review.findMany({ where: { authorId: user.id } });\n    }\n  }\n};' },
        { type: 'note', value: '__resolveReference — специальный резолвер Federation. Router вызывает его, когда нужно получить данные entity из конкретного subgraph. Он получает объект с ключевыми полями.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка Subgraph',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый subgraph — это обычный Apollo Server с подключённым @apollo/subgraph. Рассмотрим настройку двух subgraphs.' },
        { type: 'heading', value: 'Users Subgraph' },
        { type: 'code', language: 'javascript', value: '// users-service/index.js\nimport { ApolloServer } from \'@apollo/server\';\nimport { buildSubgraphSchema } from \'@apollo/subgraph\';\nimport { startStandaloneServer } from \'@apollo/server/standalone\';\nimport gql from \'graphql-tag\';\n\nconst typeDefs = gql`\n  type User @key(fields: "id") {\n    id: ID!\n    name: String!\n    email: String!\n  }\n\n  type Query {\n    me: User\n    user(id: ID!): User\n  }\n`;\n\nconst resolvers = {\n  Query: {\n    me: (_, __, { user }) => user,\n    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } })\n  },\n  User: {\n    __resolveReference: (ref, { db }) => {\n      return db.user.findUnique({ where: { id: ref.id } });\n    }\n  }\n};\n\nconst server = new ApolloServer({\n  schema: buildSubgraphSchema({ typeDefs, resolvers })\n});\n\nawait startStandaloneServer(server, { listen: { port: 4001 } });' },
        { type: 'heading', value: 'Products Subgraph' },
        { type: 'code', language: 'javascript', value: '// products-service/index.js\nconst typeDefs = gql`\n  type Product @key(fields: "id") {\n    id: ID!\n    name: String!\n    price: Float!\n    inStock: Boolean!\n  }\n\n  # Расширяем User из users-service\n  type User @key(fields: "id") {\n    id: ID!\n    purchasedProducts: [Product!]!\n  }\n\n  type Query {\n    products: [Product!]!\n    product(id: ID!): Product\n  }\n`;\n\nconst resolvers = {\n  Query: {\n    products: (_, __, { db }) => db.product.findMany(),\n    product: (_, { id }, { db }) => db.product.findUnique({ where: { id } })\n  },\n  Product: {\n    __resolveReference: (ref, { db }) => {\n      return db.product.findUnique({ where: { id: ref.id } });\n    }\n  },\n  User: {\n    purchasedProducts: (user, _, { db }) => {\n      return db.purchase.findMany({\n        where: { userId: user.id },\n        include: { product: true }\n      }).then(purchases => purchases.map(p => p.product));\n    }\n  }\n};' },
        { type: 'tip', value: 'Каждый subgraph использует buildSubgraphSchema вместо makeExecutableSchema. Это добавляет Federation директивы (_service, _entities) автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'Apollo Router',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Router — высокопроизводительный gateway, написанный на Rust. Он композирует subgraph схемы и маршрутизирует запросы.' },
        { type: 'heading', value: 'Настройка Router' },
        { type: 'code', language: 'bash', value: '# Установка Apollo Router\ncurl -sSL https://router.apollo.dev/download/nix/latest | sh\n\n# Или через npm\nnpm install -g @apollo/router\n\n# Конфигурация supergraph\n# supergraph.yaml\n# federation_version: =2\n# subgraphs:\n#   users:\n#     routing_url: http://localhost:4001/graphql\n#     schema:\n#       subgraph_url: http://localhost:4001/graphql\n#   products:\n#     routing_url: http://localhost:4002/graphql\n#     schema:\n#       subgraph_url: http://localhost:4002/graphql\n\n# Композиция supergraph схемы\nnpx @apollo/rover supergraph compose --config supergraph.yaml > supergraph.graphql\n\n# Запуск Router\n./router --supergraph supergraph.graphql --config router.yaml' },
        { type: 'heading', value: 'Конфигурация router.yaml' },
        { type: 'code', language: 'bash', value: '# router.yaml\n# supergraph:\n#   listen: 0.0.0.0:4000\n# cors:\n#   origins:\n#     - http://localhost:3000\n# headers:\n#   all:\n#     request:\n#       - propagate:\n#           named: authorization\n# telemetry:\n#   tracing:\n#     enabled: true' },
        { type: 'note', value: 'Apollo Router на Rust обрабатывает запросы в 10-100 раз быстрее, чем JavaScript gateway. Для development можно использовать @apollo/gateway на Node.js.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны Federation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Federation имеет свои паттерны и ограничения. Рассмотрим типичные сценарии и решения.' },
        { type: 'heading', value: 'Shared типы' },
        { type: 'code', language: 'graphql', value: '# Enum и interface можно определить в нескольких subgraphs\n# Они должны быть идентичными!\n\n# В users-service И в orders-service:\nenum Currency {\n  USD\n  EUR\n  RUB\n}\n\n# Value type — одинаковый в нескольких subgraphs\ntype Money {\n  amount: Float!\n  currency: Currency!\n}\n\n# @shareable — поле может резолвиться несколькими subgraphs\ntype Product @key(fields: "id") {\n  id: ID!\n  name: String! @shareable  # Оба subgraph могут возвращать name\n  price: Float!\n}' },
        { type: 'heading', value: '@provides и @requires' },
        { type: 'code', language: 'graphql', value: '# @external — поле определено в другом subgraph\n# @requires — нужно поле из другого subgraph для вычисления\n# @provides — этот subgraph предоставляет поле другого типа\n\n# Reviews Subgraph\ntype Review @key(fields: "id") {\n  id: ID!\n  body: String!\n  rating: Int!\n  product: Product!\n}\n\n# При загрузке Review, загрузить и Product.name\nextend type Product @key(fields: "id") {\n  id: ID! @external\n  name: String! @external\n  reviews: [Review!]! @provides(fields: "product { name }")\n}\n\n# Inventory Subgraph\n# Для вычисления shippingEstimate нужен вес и цена из Product subgraph\nextend type Product @key(fields: "id") {\n  id: ID! @external\n  weight: Float @external\n  price: Float! @external\n  shippingEstimate: Float @requires(fields: "weight price")\n}' },
        { type: 'tip', value: '@requires позволяет одному subgraph использовать данные из другого для вычислений. Router автоматически запросит необходимые поля из нужного subgraph.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Микросервисная архитектура',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте Federation схему для e-commerce платформы с тремя subgraphs: users, products и orders.',
      requirements: [
        'Users Subgraph: тип User @key(fields: "id") с name, email',
        'Products Subgraph: тип Product @key(fields: "id") с name, price, inStock',
        'Orders Subgraph: тип Order @key(fields: "id") с items, total, status',
        'Products расширяет User, добавляя wishlist: [Product!]!',
        'Orders расширяет User, добавляя orders: [Order!]!',
        'Orders расширяет Product, добавляя orderCount: Int!',
        '__resolveReference для каждой entity'
      ],
      hint: 'Каждый subgraph определяет свои типы с @key и расширяет типы из других subgraphs. __resolveReference загружает entity по ключевому полю.',
      expectedOutput: 'Три subgraph схемы с entities, расширениями и __resolveReference резолверами.',
      solution: `// === Users Subgraph (порт 4001) ===
// Схема
const usersTypeDefs = gql\`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    me: User
    users: [User!]!
  }
\`;

const usersResolvers = {
  Query: {
    me: (_, __, { user }) => user,
    users: (_, __, { db }) => db.user.findMany()
  },
  User: {
    __resolveReference: (ref, { db }) =>
      db.user.findUnique({ where: { id: ref.id } })
  }
};

// === Products Subgraph (порт 4002) ===
const productsTypeDefs = gql\`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    inStock: Boolean!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    wishlist: [Product!]!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }
\`;

const productsResolvers = {
  Query: {
    products: (_, __, { db }) => db.product.findMany(),
    product: (_, { id }, { db }) => db.product.findUnique({ where: { id } })
  },
  Product: {
    __resolveReference: (ref, { db }) =>
      db.product.findUnique({ where: { id: ref.id } })
  },
  User: {
    wishlist: (user, _, { db }) =>
      db.wishlist.findMany({
        where: { userId: user.id },
        include: { product: true }
      }).then(items => items.map(i => i.product))
  }
};

// === Orders Subgraph (порт 4003) ===
const ordersTypeDefs = gql\`
  type Order @key(fields: "id") {
    id: ID!
    items: [OrderItem!]!
    total: Float!
    status: OrderStatus!
    createdAt: String!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  enum OrderStatus { PENDING, PROCESSING, SHIPPED, DELIVERED }

  extend type User @key(fields: "id") {
    id: ID! @external
    orders: [Order!]!
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
    orderCount: Int!
  }

  type Query {
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(items: [OrderItemInput!]!): Order!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }
\`;

const ordersResolvers = {
  Query: {
    order: (_, { id }, { db }) => db.order.findUnique({ where: { id } })
  },
  Order: {
    __resolveReference: (ref, { db }) =>
      db.order.findUnique({ where: { id: ref.id } })
  },
  User: {
    orders: (user, _, { db }) =>
      db.order.findMany({ where: { userId: user.id } })
  },
  Product: {
    orderCount: (product, _, { db }) =>
      db.orderItem.count({ where: { productId: product.id } })
  }
};`,
      explanation: 'Три subgraph: Users определяет User, Products определяет Product и расширяет User (wishlist), Orders определяет Order и расширяет и User (orders) и Product (orderCount). @key определяет ключевое поле для entity resolution. @external отмечает поля из другого subgraph. __resolveReference загружает entity когда Router перенаправляет запрос. Router композирует всё в единый API.'
    }
  ]
}
