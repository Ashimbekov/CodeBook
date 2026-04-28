export default {
  id: 1,
  title: 'Введение в GraphQL',
  description: 'Что такое GraphQL, история создания, сравнение с REST, основные концепции и преимущества.',
  lessons: [
    {
      id: 1,
      title: 'Что такое GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL — это язык запросов для API и среда выполнения этих запросов. Создан в Facebook в 2012 году и открыт в 2015. В отличие от REST, клиент сам определяет, какие данные ему нужны.' },
        { type: 'heading', value: 'Ключевая идея' },
        { type: 'text', value: 'В REST сервер решает, какие данные отдавать. В GraphQL клиент описывает структуру нужных данных в запросе, и сервер возвращает ровно то, что запрошено — ни больше, ни меньше.' },
        { type: 'code', language: 'graphql', value: '# Клиент запрашивает конкретные поля\nquery {\n  user(id: "1") {\n    name\n    email\n    posts {\n      title\n    }\n  }\n}\n\n# Сервер возвращает ровно то, что запрошено\n# {\n#   "data": {\n#     "user": {\n#       "name": "Алексей",\n#       "email": "alex@example.com",\n#       "posts": [\n#         { "title": "Первый пост" },\n#         { "title": "Второй пост" }\n#       ]\n#     }\n#   }\n# }' },
        { type: 'heading', value: 'Три основные операции' },
        { type: 'list', value: [
          'Query — чтение данных (аналог GET в REST)',
          'Mutation — изменение данных (аналог POST/PUT/DELETE)',
          'Subscription — подписка на реальное время (WebSocket)'
        ] },
        { type: 'tip', value: 'GraphQL — это не замена REST. Это альтернативный подход к проектированию API. Оба подхода имеют свои сильные стороны.' }
      ]
    },
    {
      id: 2,
      title: 'REST vs GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST и GraphQL решают одну задачу — взаимодействие клиента с сервером. Но делают это принципиально по-разному. Разберём ключевые отличия.' },
        { type: 'heading', value: 'Проблема over-fetching в REST' },
        { type: 'code', language: 'javascript', value: '// REST: получаем ВСЕ поля пользователя, даже если нужны только имя и email\n// GET /api/users/1\n// Ответ:\n{\n  "id": 1,\n  "name": "Алексей",\n  "email": "alex@example.com",\n  "phone": "+7999...",      // не нужно\n  "address": "...",          // не нужно\n  "avatar": "...",           // не нужно\n  "settings": { ... },      // не нужно\n  "createdAt": "...",        // не нужно\n  "updatedAt": "..."         // не нужно\n}\n\n// GraphQL: получаем ТОЛЬКО то, что просим\n// query { user(id: "1") { name, email } }\n// Ответ:\n{\n  "data": {\n    "user": {\n      "name": "Алексей",\n      "email": "alex@example.com"\n    }\n  }\n}' },
        { type: 'heading', value: 'Проблема under-fetching в REST' },
        { type: 'code', language: 'javascript', value: '// REST: нужно сделать 3 запроса для одной страницы\n// 1. GET /api/users/1           -> данные пользователя\n// 2. GET /api/users/1/posts     -> посты пользователя\n// 3. GET /api/users/1/followers -> подписчики\n\n// GraphQL: один запрос — все данные\nconst query = `\n  query {\n    user(id: "1") {\n      name\n      email\n      posts {\n        title\n        createdAt\n      }\n      followers {\n        name\n        avatar\n      }\n    }\n  }\n`;' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'list', value: [
          'REST: множество эндпоинтов (/users, /posts, /comments). GraphQL: один эндпоинт (/graphql)',
          'REST: сервер определяет структуру ответа. GraphQL: клиент определяет структуру',
          'REST: версионирование API (v1, v2). GraphQL: эволюция схемы без версий',
          'REST: отлично кэшируется через HTTP. GraphQL: кэширование сложнее',
          'REST: прост в изучении. GraphQL: требует изучения нового языка запросов'
        ] },
        { type: 'note', value: 'GraphQL идеально подходит для мобильных приложений и SPA, где важно минимизировать трафик и количество запросов. REST лучше для простых CRUD API и публичных API.' }
      ]
    },
    {
      id: 3,
      title: 'Архитектура GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL работает как слой между клиентом и источниками данных. Один GraphQL сервер может агрегировать данные из нескольких баз, микросервисов и внешних API.' },
        { type: 'heading', value: 'Компоненты GraphQL системы' },
        { type: 'code', language: 'javascript', value: '// 1. СХЕМА (Schema) — описание всех типов данных и операций\nconst typeDefs = `\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n    posts: [Post!]!\n  }\n\n  type Post {\n    id: ID!\n    title: String!\n    author: User!\n  }\n\n  type Query {\n    user(id: ID!): User\n    posts: [Post!]!\n  }\n`;\n\n// 2. РЕЗОЛВЕРЫ (Resolvers) — функции, которые получают данные\nconst resolvers = {\n  Query: {\n    user: (_, { id }) => db.users.findById(id),\n    posts: () => db.posts.findAll()\n  },\n  User: {\n    posts: (user) => db.posts.findByUserId(user.id)\n  }\n};\n\n// 3. СЕРВЕР — принимает запросы и выполняет их\n// Apollo Server, GraphQL Yoga, Mercurius и др.' },
        { type: 'heading', value: 'Поток выполнения запроса' },
        { type: 'list', value: [
          '1. Клиент отправляет GraphQL запрос на /graphql',
          '2. Сервер валидирует запрос по схеме',
          '3. Для каждого поля вызывается соответствующий резолвер',
          '4. Резолверы получают данные из БД, других API и т.д.',
          '5. Результат собирается в JSON и отправляется клиенту'
        ] },
        { type: 'tip', value: 'GraphQL — строго типизированный. Схема определяет все возможные запросы. Если клиент запросит несуществующее поле, сервер вернёт ошибку ещё до выполнения.' }
      ]
    },
    {
      id: 4,
      title: 'GraphQL Playground и инструменты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для разработки и тестирования GraphQL API существуют отличные визуальные инструменты. Они позволяют писать запросы, просматривать схему и автодополнение.' },
        { type: 'heading', value: 'Apollo Sandbox' },
        { type: 'code', language: 'bash', value: '# Apollo Sandbox — встроен в Apollo Server 4\n# Доступен по адресу http://localhost:4000/graphql\n# Или через studio.apollographql.com/sandbox\n\n# Установка Apollo Server\nnpm install @apollo/server graphql\n\n# После запуска сервера откройте браузер:\n# http://localhost:4000\n# Увидите Apollo Sandbox с автодополнением и документацией' },
        { type: 'heading', value: 'Другие инструменты' },
        { type: 'list', value: [
          'Apollo Sandbox — встроенная IDE для Apollo Server',
          'GraphiQL — классическая IDE от GraphQL Foundation',
          'Altair GraphQL Client — десктопное приложение с богатым функционалом',
          'Insomnia / Postman — поддерживают GraphQL запросы',
          'GraphQL Voyager — визуализация схемы в виде графа'
        ] },
        { type: 'code', language: 'graphql', value: '# Introspection запрос — получить всю схему\nquery {\n  __schema {\n    types {\n      name\n      fields {\n        name\n        type {\n          name\n        }\n      }\n    }\n  }\n}\n\n# Этот запрос позволяет инструментам\n# автоматически подгружать схему и предлагать\n# автодополнение при написании запросов' },
        { type: 'note', value: 'Introspection — одна из суперспособностей GraphQL. Схема самодокументируема: любой клиент может узнать все доступные типы, поля и операции.' }
      ]
    },
    {
      id: 5,
      title: 'Когда использовать GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL — не серебряная пуля. Есть ситуации, когда он идеально подходит, и случаи, когда REST или gRPC будут лучшим выбором.' },
        { type: 'heading', value: 'GraphQL идеален когда:' },
        { type: 'list', value: [
          'Несколько клиентов с разными потребностями (мобильное приложение, веб, Smart TV)',
          'Сложные связанные данные (социальная сеть, e-commerce каталог)',
          'Частое изменение UI — новые экраны не требуют новых эндпоинтов',
          'Нужна самодокументируемость API',
          'Микросервисная архитектура — GraphQL как API Gateway'
        ] },
        { type: 'heading', value: 'REST лучше когда:' },
        { type: 'list', value: [
          'Простой CRUD без сложных связей',
          'Публичный API для сторонних разработчиков',
          'Файловые операции (upload/download)',
          'Нужно максимально простое HTTP кэширование',
          'Маленькая команда без опыта в GraphQL'
        ] },
        { type: 'code', language: 'javascript', value: '// Пример: мобильному приложению нужны только имя и аватар\n// query { user(id: "1") { name, avatar } }\n\n// Вебу нужна полная информация\n// query { user(id: "1") { name, avatar, email, phone, address, posts { title } } }\n\n// REST: пришлось бы делать два эндпоинта или фильтрацию полей\n// GET /api/users/1?fields=name,avatar\n// GraphQL: клиент просто запрашивает разные поля' },
        { type: 'tip', value: 'Многие крупные компании (GitHub, Shopify, Airbnb, Twitter) используют GraphQL вместе с REST. Можно начать с GraphQL для новых фич и постепенно мигрировать.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Первый GraphQL запрос',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите схему GraphQL и несколько запросов для простого блога. Это ваш первый шаг в мир GraphQL.',
      requirements: [
        'Определите тип User с полями: id (ID!), name (String!), email (String!)',
        'Определите тип Post с полями: id (ID!), title (String!), body (String!), author (User!)',
        'Определите Query тип с полями: users (список всех User) и post по id',
        'Напишите GraphQL запрос для получения всех пользователей с именами',
        'Напишите GraphQL запрос для получения поста с id "1" вместе с автором'
      ],
      hint: 'Типы определяются через ключевое слово type. Обязательные поля помечаются восклицательным знаком (!). Список обозначается квадратными скобками [Type].',
      expectedOutput: 'Схема с типами User, Post и Query.\nЗапрос users возвращает список имён.\nЗапрос post(id: "1") возвращает пост с данными автора.',
      solution: `# Схема (typeDefs)
type User {
  id: ID!
  name: String!
  email: String!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
}

type Query {
  users: [User!]!
  post(id: ID!): Post
}

# Запрос 1: Все пользователи
query GetUsers {
  users {
    name
    email
  }
}

# Запрос 2: Пост с автором
query GetPost {
  post(id: "1") {
    title
    body
    author {
      name
    }
  }
}`,
      explanation: 'Схема определяет контракт API: какие типы данных существуют и какие операции доступны. Тип Query — точка входа для чтения данных. Восклицательный знак (!) означает, что поле обязательно (не может быть null). Квадратные скобки означают массив. В запросе клиент указывает только нужные поля.'
    }
  ]
}
