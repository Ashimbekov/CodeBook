export default {
  id: 18,
  title: 'Schema Design Best Practices',
  description: 'Лучшие практики проектирования GraphQL схемы: именование, nullability, пагинация, эволюция схемы.',
  lessons: [
    {
      id: 1,
      title: 'Конвенции именования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Единообразное именование делает схему предсказуемой и удобной. Следуйте устоявшимся конвенциям GraphQL сообщества.' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'code', language: 'graphql', value: '# Типы: PascalCase\ntype UserProfile { ... }\ntype OrderItem { ... }\n\n# Поля и аргументы: camelCase\ntype User {\n  firstName: String!\n  lastName: String!\n  isActive: Boolean!\n  createdAt: DateTime!\n}\n\n# Enum: PascalCase тип, SCREAMING_SNAKE_CASE значения\nenum OrderStatus {\n  PENDING\n  IN_PROGRESS\n  SHIPPED\n  DELIVERED\n}\n\n# Input типы: суффикс Input\ninput CreateUserInput { ... }\ninput UpdateOrderInput { ... }\ninput PostFilterInput { ... }\n\n# Payload типы: суффикс Payload\ntype CreateUserPayload { ... }\ntype DeletePostPayload { ... }\n\n# Connections (пагинация): суффикс Connection/Edge\ntype UserConnection { ... }\ntype UserEdge { ... }' },
        { type: 'heading', value: 'Именование операций' },
        { type: 'code', language: 'graphql', value: '# Query: существительное или getX / listX\ntype Query {\n  user(id: ID!): User              # Один объект\n  users(filter: UserFilter): UserConnection!  # Список\n  me: User!                         # Текущий пользователь\n  searchUsers(query: String!): [User!]!       # Поиск\n}\n\n# Mutation: глагол + существительное\ntype Mutation {\n  createUser(input: CreateUserInput!): CreateUserPayload!\n  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!\n  deleteUser(id: ID!): DeleteUserPayload!\n  publishPost(id: ID!): Post!\n  sendMessage(input: SendMessageInput!): Message!\n}\n\n# Subscription: on + событие\ntype Subscription {\n  onMessageReceived(chatId: ID!): Message!\n  onOrderStatusChanged(orderId: ID!): Order!\n}' },
        { type: 'tip', value: 'Схема — это контракт API. Чёткие конвенции именования делают её самодокументируемой. Новый разработчик должен понимать схему без документации.' }
      ]
    },
    {
      id: 2,
      title: 'Nullability: когда ставить !',
      type: 'theory',
      content: [
        { type: 'text', value: 'Решение о nullable/non-null полях — одно из самых важных при проектировании схемы. Неправильная nullability ломает клиентов при эволюции API.' },
        { type: 'heading', value: 'Правила nullability' },
        { type: 'code', language: 'graphql', value: '# Правило 1: ID — всегда non-null\ntype User {\n  id: ID!              # Всегда есть\n}\n\n# Правило 2: Массивы — обычно [Type!]!\ntype User {\n  posts: [Post!]!      # Пустой массив, но не null\n  tags: [String!]!     # Пустой массив, не null\n}\n\n# Правило 3: Связи — nullable, если могут отсутствовать\ntype Post {\n  author: User!         # Автор всегда есть\n  editor: User          # Редактора может не быть\n  publishedAt: DateTime # Черновик не опубликован\n}\n\n# Правило 4: Поля Query — nullable для ошибок\ntype Query {\n  user(id: ID!): User          # null, если не найден\n  me: User                     # null, если не авторизован\n  posts: [Post!]!              # Массив — всегда non-null\n}\n\n# Правило 5: Мутации — non-null для Payload\ntype Mutation {\n  createUser(input: CreateUserInput!): CreateUserPayload!\n}' },
        { type: 'heading', value: 'Эволюция nullability' },
        { type: 'code', language: 'graphql', value: '# БЕЗОПАСНО: сделать nullable поле non-null\n# Было: name: String   -> Стало: name: String!\n# Клиенты уже обрабатывают null, non-null будет работать\n\n# ОПАСНО: сделать non-null поле nullable\n# Было: name: String!  -> Стало: name: String\n# Клиенты НЕ обрабатывают null — может сломать код!\n\n# Рекомендация: начинайте с nullable, ужесточайте потом\n# Это безопаснее для эволюции схемы' },
        { type: 'note', value: 'Goldilocks rule: если вы не уверены — оставьте nullable. Сделать поле non-null позже — безопасно. Сделать non-null поле nullable — breaking change.' }
      ]
    },
    {
      id: 3,
      title: 'Проектирование связей',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL — это граф. Правильное проектирование связей между типами определяет удобство и производительность API.' },
        { type: 'heading', value: 'Двунаправленные связи' },
        { type: 'code', language: 'graphql', value: '# Двунаправленные связи: User <-> Post\ntype User {\n  id: ID!\n  name: String!\n  posts: [Post!]!        # User -> Posts\n}\n\ntype Post {\n  id: ID!\n  title: String!\n  author: User!          # Post -> User\n}\n\n# Но будьте осторожны с глубокой вложенностью:\n# query {\n#   user {\n#     posts {\n#       author {\n#         posts {\n#           author { ... }  # Бесконечная рекурсия!\n#         }\n#       }\n#     }\n#   }\n# }' },
        { type: 'heading', value: 'Connection vs простой массив' },
        { type: 'code', language: 'graphql', value: '# Простой массив — для маленьких коллекций\ntype Post {\n  tags: [String!]!         # Обычно 1-10 тегов\n  images: [Image!]!        # Обычно 1-5 изображений\n}\n\n# Connection — для больших коллекций\ntype User {\n  # Может быть тысячи постов — нужна пагинация\n  posts(first: Int, after: String): PostConnection!\n\n  # Может быть миллионы подписчиков\n  followers(first: Int, after: String): UserConnection!\n}\n\n# Правило: если коллекция может расти неограниченно,\n# используйте Connection с пагинацией' },
        { type: 'tip', value: 'Связи должны отражать бизнес-логику, а не структуру БД. Клиент не должен знать о foreign keys и join tables.' }
      ]
    },
    {
      id: 4,
      title: 'Мутации: паттерны проектирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошо спроектированные мутации предсказуемы, самодокументируемы и безопасны для эволюции.' },
        { type: 'heading', value: 'Input Object паттерн' },
        { type: 'code', language: 'graphql', value: '# Плохо: отдельные аргументы\ntype Mutation {\n  createUser(name: String!, email: String!, age: Int): User!\n}\n\n# Хорошо: Input объект\ntype Mutation {\n  createUser(input: CreateUserInput!): CreateUserPayload!\n}\n\n# Преимущества Input:\n# 1. Легко добавить новое поле без breaking change\n# 2. Переиспользование в разных мутациях\n# 3. Вложенные объекты\n# 4. Значения по умолчанию' },
        { type: 'heading', value: 'Payload паттерн' },
        { type: 'code', language: 'graphql', value: '# Payload возвращает результат + ошибки\ntype CreateUserPayload {\n  user: User\n  userErrors: [UserError!]!\n}\n\ntype UserError {\n  field: [String!]!     # Путь к полю: ["input", "email"]\n  message: String!      # Человекочитаемое сообщение\n  code: ErrorCode!      # Машиночитаемый код\n}\n\nenum ErrorCode {\n  REQUIRED\n  INVALID_FORMAT\n  ALREADY_EXISTS\n  NOT_FOUND\n}\n\n# Успешный ответ:\n# { user: { id: "1", name: "Алексей" }, userErrors: [] }\n\n# Ошибка валидации:\n# { user: null, userErrors: [{ field: ["input","email"], message: "Email занят", code: ALREADY_EXISTS }] }' },
        { type: 'note', value: 'Shopify API использует именно такой паттерн. userErrors — для бизнес-ошибок (валидация). GraphQL errors — для системных ошибок (авторизация, сервер).' }
      ]
    },
    {
      id: 5,
      title: 'Эволюция схемы без версий',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL позволяет развивать API без версионирования (v1, v2). Клиент запрашивает только нужные поля, поэтому добавление новых полей безопасно.' },
        { type: 'heading', value: 'Безопасные изменения' },
        { type: 'code', language: 'graphql', value: '# БЕЗОПАСНО: добавить поле\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n  avatar: String        # НОВОЕ — не сломает клиентов\n  bio: String           # НОВОЕ — клиенты его не запрашивают\n}\n\n# БЕЗОПАСНО: добавить аргумент с default\ntype Query {\n  posts(status: PostStatus = PUBLISHED, limit: Int = 10): [Post!]!\n  #                                      ^^^ НОВОЕ — default не сломает\n}\n\n# БЕЗОПАСНО: добавить значение в enum\nenum PostStatus {\n  DRAFT\n  PUBLISHED\n  ARCHIVED       # НОВОЕ — клиенты не используют\n}\n\n# БЕЗОПАСНО: добавить тип в union\nunion SearchResult = User | Post | Comment  # Comment — НОВОЕ' },
        { type: 'heading', value: 'Опасные (breaking) изменения' },
        { type: 'code', language: 'graphql', value: '# ОПАСНО: удалить поле\n# type User { name: String! }  # удалили email — клиенты сломаются\n\n# Вместо удаления — deprecate\ntype User {\n  name: String!\n  email: String! @deprecated(reason: "Используйте contactEmail")\n  contactEmail: String!   # Новое поле\n}\n\n# ОПАСНО: изменить тип поля\n# age: Int! -> age: String!  # Сломает клиентов\n\n# ОПАСНО: сделать non-null поле nullable\n# name: String! -> name: String  # Клиенты не обрабатывают null\n\n# ОПАСНО: удалить значение enum\n# Клиенты могут использовать его в запросах' },
        { type: 'tip', value: '@deprecated не удаляет поле — оно продолжает работать. IDE показывает предупреждение, документация помечает как устаревшее. Удалять можно после полной миграции клиентов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Проектирование API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте GraphQL схему для платформы онлайн-курсов, следуя всем best practices.',
      requirements: [
        'Типы: Course, Lesson, User, Enrollment с правильными связями',
        'Enum: CourseLevel (BEGINNER, INTERMEDIATE, ADVANCED), EnrollmentStatus',
        'Input типы: CreateCourseInput, EnrollInput',
        'Payload типы с userErrors',
        'Пагинация через Connection для courses и lessons',
        'Deprecated поле с указанием альтернативы',
        'Query и Mutation с правильным именованием'
      ],
      hint: 'Следуйте конвенциям: PascalCase типы, camelCase поля, суффиксы Input/Payload/Connection. Используйте Connection для больших списков.',
      expectedOutput: 'Полная схема платформы курсов с правильным именованием, nullability, пагинацией и Payload паттерном.',
      solution: `scalar DateTime

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

type User {
  id: ID!
  name: String!
  email: String!
  enrollments(first: Int, after: String): EnrollmentConnection!
  createdAt: DateTime!
}

type Course {
  id: ID!
  title: String!
  description: String!
  level: CourseLevel!
  instructor: User!
  lessons(first: Int, after: String): LessonConnection!
  studentsCount: Int!
  rating: Float
  price: Float!
  thumbnail: String @deprecated(reason: "Используйте coverImage")
  coverImage: String
  createdAt: DateTime!
}

type Lesson {
  id: ID!
  title: String!
  content: String!
  duration: Int!
  order: Int!
  course: Course!
}

type Enrollment {
  id: ID!
  user: User!
  course: Course!
  status: EnrollmentStatus!
  progress: Float!
  enrolledAt: DateTime!
  completedAt: DateTime
}

type CourseConnection {
  edges: [CourseEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CourseEdge {
  node: Course!
  cursor: String!
}

type LessonConnection {
  edges: [LessonEdge!]!
  pageInfo: PageInfo!
}

type LessonEdge {
  node: Lesson!
  cursor: String!
}

type EnrollmentConnection {
  edges: [EnrollmentEdge!]!
  pageInfo: PageInfo!
}

type EnrollmentEdge {
  node: Enrollment!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

input CreateCourseInput {
  title: String!
  description: String!
  level: CourseLevel!
  price: Float!
  coverImage: String
}

input EnrollInput {
  courseId: ID!
}

type UserError {
  field: [String!]!
  message: String!
}

type CreateCoursePayload {
  course: Course
  userErrors: [UserError!]!
}

type EnrollPayload {
  enrollment: Enrollment
  userErrors: [UserError!]!
}

type Query {
  me: User
  course(id: ID!): Course
  courses(first: Int, after: String, level: CourseLevel): CourseConnection!
}

type Mutation {
  createCourse(input: CreateCourseInput!): CreateCoursePayload!
  enroll(input: EnrollInput!): EnrollPayload!
}`,
      explanation: 'Схема следует best practices: PascalCase типы, camelCase поля, суффиксы Input/Payload/Connection. Большие коллекции (courses, lessons, enrollments) используют Connection пагинацию. Payload включает userErrors для бизнес-ошибок. thumbnail помечен @deprecated с указанием альтернативы coverImage. Nullability осознанная: rating может быть null (нет оценок), completedAt — null для незавершённых курсов.'
    }
  ]
}
