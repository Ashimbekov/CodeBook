export default {
  id: 3,
  title: 'Запросы (Queries)',
  description: 'Запросы в GraphQL: аргументы, псевдонимы, фрагменты, переменные и вложенные запросы.',
  lessons: [
    {
      id: 1,
      title: 'Основы запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query — основной способ чтения данных в GraphQL. Запрос описывает, какие поля и связи нужны клиенту. Сервер возвращает данные в точности соответствующие структуре запроса.' },
        { type: 'heading', value: 'Простые запросы' },
        { type: 'code', language: 'graphql', value: '# Простой запрос — получить список пользователей\nquery {\n  users {\n    id\n    name\n    email\n  }\n}\n\n# Ответ:\n# {\n#   "data": {\n#     "users": [\n#       { "id": "1", "name": "Алексей", "email": "alex@mail.ru" },\n#       { "id": "2", "name": "Мария", "email": "maria@mail.ru" }\n#     ]\n#   }\n# }' },
        { type: 'heading', value: 'Вложенные запросы' },
        { type: 'code', language: 'graphql', value: '# GraphQL позволяет запрашивать связанные данные за один запрос\nquery {\n  user(id: "1") {\n    name\n    posts {\n      title\n      comments {\n        text\n        author {\n          name\n        }\n      }\n    }\n  }\n}\n\n# Один запрос вместо нескольких REST вызовов:\n# GET /users/1\n# GET /users/1/posts\n# GET /posts/1/comments\n# GET /users/2 (для автора комментария)' },
        { type: 'tip', value: 'Имя операции (после query) необязательно, но рекомендуется для отладки. Пример: query GetUserWithPosts { ... }. В production всегда давайте имена запросам.' }
      ]
    },
    {
      id: 2,
      title: 'Аргументы и переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аргументы позволяют передавать параметры в запросы. Переменные выносят динамические значения из тела запроса, делая запросы переиспользуемыми.' },
        { type: 'heading', value: 'Аргументы полей' },
        { type: 'code', language: 'graphql', value: '# Аргументы передаются в скобках после имени поля\nquery {\n  user(id: "1") {\n    name\n  }\n\n  posts(limit: 10, offset: 0, status: PUBLISHED) {\n    title\n    createdAt\n  }\n\n  search(query: "GraphQL", type: POST) {\n    ... on Post {\n      title\n    }\n  }\n}' },
        { type: 'heading', value: 'Переменные' },
        { type: 'code', language: 'graphql', value: '# Переменные определяются в сигнатуре запроса\nquery GetUser($userId: ID!, $withPosts: Boolean = false) {\n  user(id: $userId) {\n    name\n    email\n    posts @include(if: $withPosts) {\n      title\n    }\n  }\n}\n\n# Переменные передаются отдельно (JSON):\n# {\n#   "userId": "1",\n#   "withPosts": true\n# }' },
        { type: 'code', language: 'javascript', value: '// В коде клиента переменные передаются так:\nconst GET_USER = gql`\n  query GetUser($userId: ID!) {\n    user(id: $userId) {\n      name\n      email\n    }\n  }\n`;\n\n// Apollo Client\nconst { data } = useQuery(GET_USER, {\n  variables: { userId: "1" }\n});\n\n// Fetch API\nfetch(\'/graphql\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({\n    query: GET_USER,\n    variables: { userId: "1" }\n  })\n});' },
        { type: 'note', value: 'Никогда не используйте строковую интерполяцию для подстановки значений в запрос. Всегда используйте переменные — это безопасно и позволяет серверу кэшировать запросы.' }
      ]
    },
    {
      id: 3,
      title: 'Псевдонимы (Aliases)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Псевдонимы позволяют запрашивать одно и то же поле несколько раз с разными аргументами в одном запросе. Без псевдонимов ключи в ответе конфликтовали бы.' },
        { type: 'heading', value: 'Проблема без псевдонимов' },
        { type: 'code', language: 'graphql', value: '# Ошибка! Два поля user с разными аргументами\n# query {\n#   user(id: "1") { name }\n#   user(id: "2") { name }  # Конфликт имён!\n# }\n\n# Решение — псевдонимы\nquery {\n  admin: user(id: "1") {\n    name\n    email\n  }\n  editor: user(id: "2") {\n    name\n    email\n  }\n}\n\n# Ответ:\n# {\n#   "data": {\n#     "admin": { "name": "Алексей", "email": "alex@mail.ru" },\n#     "editor": { "name": "Мария", "email": "maria@mail.ru" }\n#   }\n# }' },
        { type: 'heading', value: 'Практические примеры' },
        { type: 'code', language: 'graphql', value: '# Получить статистику по разным периодам\nquery DashboardStats {\n  todayOrders: orders(period: TODAY) {\n    count\n    total\n  }\n  weekOrders: orders(period: WEEK) {\n    count\n    total\n  }\n  monthOrders: orders(period: MONTH) {\n    count\n    total\n  }\n}\n\n# Получить посты в разных статусах\nquery PostsByStatus {\n  drafts: posts(status: DRAFT) {\n    title\n  }\n  published: posts(status: PUBLISHED) {\n    title\n  }\n}' },
        { type: 'tip', value: 'Псевдонимы полезны не только при конфликтах имён. Используйте их для семантически значимых имён в ответе, чтобы код клиента был читаемым.' }
      ]
    },
    {
      id: 4,
      title: 'Фрагменты (Fragments)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фрагменты позволяют переиспользовать наборы полей. Это устраняет дублирование и делает запросы чище. Фрагменты определяются на конкретном типе.' },
        { type: 'heading', value: 'Именованные фрагменты' },
        { type: 'code', language: 'graphql', value: '# Определение фрагмента\nfragment UserFields on User {\n  id\n  name\n  email\n  avatar\n}\n\nfragment PostPreview on Post {\n  id\n  title\n  createdAt\n  author {\n    ...UserFields\n  }\n}\n\n# Использование фрагментов\nquery Dashboard {\n  me {\n    ...UserFields\n    role\n  }\n  latestPosts: posts(limit: 5) {\n    ...PostPreview\n  }\n  popularPosts: posts(sortBy: POPULAR, limit: 5) {\n    ...PostPreview\n    viewCount      # Можно добавить поля к фрагменту\n  }\n}' },
        { type: 'heading', value: 'Inline фрагменты' },
        { type: 'code', language: 'graphql', value: '# Inline фрагменты — для Union и Interface типов\nquery Search($query: String!) {\n  search(query: $query) {\n    __typename\n    ... on User {\n      name\n      email\n    }\n    ... on Post {\n      title\n      body\n    }\n    ... on Comment {\n      text\n      createdAt\n    }\n  }\n}\n\n# __typename — встроенное мета-поле,\n# возвращает имя конкретного типа объекта' },
        { type: 'code', language: 'javascript', value: '// Фрагменты в Apollo Client\nimport { gql } from \'@apollo/client\';\n\nconst USER_FIELDS = gql`\n  fragment UserFields on User {\n    id\n    name\n    email\n    avatar\n  }\n`;\n\nconst GET_POST = gql`\n  ${USER_FIELDS}\n  query GetPost($id: ID!) {\n    post(id: $id) {\n      title\n      body\n      author {\n        ...UserFields\n      }\n    }\n  }\n`;' },
        { type: 'note', value: 'Fragment co-location — паттерн, при котором каждый компонент определяет свой фрагмент. Компонент UserAvatar определяет fragment UserAvatarFields, а родительский компонент включает его в свой запрос.' }
      ]
    },
    {
      id: 5,
      title: 'Операции и именование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное именование операций и использование нескольких операций в одном документе — важная часть работы с GraphQL.' },
        { type: 'heading', value: 'Именование операций' },
        { type: 'code', language: 'graphql', value: '# Без имени (анонимный запрос) — только для разработки\nquery {\n  users { name }\n}\n\n# С именем — рекомендуется всегда\nquery GetAllUsers {\n  users { name }\n}\n\n# Конвенции именования:\n# query GetUserById       — чтение одного объекта\n# query ListUsers         — чтение списка\n# query SearchPosts       — поиск\n# mutation CreateUser     — создание\n# mutation UpdatePost     — обновление\n# mutation DeleteComment  — удаление\n# subscription OnPostCreated — подписка' },
        { type: 'heading', value: 'Множественные операции в документе' },
        { type: 'code', language: 'graphql', value: '# В одном документе может быть несколько операций\n# При отправке указывается operationName\n\nquery GetUsers {\n  users {\n    id\n    name\n  }\n}\n\nquery GetPosts {\n  posts {\n    id\n    title\n  }\n}\n\n# HTTP запрос:\n# {\n#   "query": "... обе операции ...",\n#   "operationName": "GetUsers"\n# }' },
        { type: 'code', language: 'javascript', value: '// На практике обычно один запрос — одна переменная\nconst GET_USERS = gql`\n  query GetUsers {\n    users { id, name }\n  }\n`;\n\nconst GET_POSTS = gql`\n  query GetPosts {\n    posts { id, title }\n  }\n`;\n\n// Имя операции помогает:\n// 1. Идентифицировать запрос в логах сервера\n// 2. Apollo DevTools показывает имя\n// 3. Автодополнение в GraphQL IDE\n// 4. Persisted queries используют имя как ключ' },
        { type: 'tip', value: 'Всегда давайте операциям осмысленные имена. В production-приложениях анонимные запросы затрудняют отладку и мониторинг.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сложные запросы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите GraphQL запросы с использованием аргументов, псевдонимов, фрагментов и переменных для социальной сети.',
      requirements: [
        'Создайте фрагмент UserPreview на типе User с полями: id, name, avatar',
        'Напишите запрос GetProfile с переменной $userId, возвращающий пользователя с постами и подписчиками (используя фрагмент)',
        'Используйте псевдонимы для получения трёх категорий постов: drafts, published, archived',
        'Используйте директиву @include для условного включения поля email',
        'Все запросы должны иметь имена операций и использовать переменные'
      ],
      hint: 'Фрагмент определяется через fragment Name on Type { ... }. Псевдонимы через alias: fieldName(args). Переменные объявляются в сигнатуре: query Name($var: Type).',
      expectedOutput: 'Фрагмент UserPreview, запрос GetProfile с вложенными данными, псевдонимы для категорий постов, директива @include для email.',
      solution: `fragment UserPreview on User {
  id
  name
  avatar
}

query GetProfile($userId: ID!, $showEmail: Boolean = false) {
  user(id: $userId) {
    ...UserPreview
    email @include(if: $showEmail)
    bio
    posts {
      id
      title
      createdAt
    }
    followers {
      ...UserPreview
    }
    following {
      ...UserPreview
    }
  }
}

query GetPostsByStatus($authorId: ID!) {
  drafts: posts(authorId: $authorId, status: DRAFT) {
    id
    title
    updatedAt
  }
  published: posts(authorId: $authorId, status: PUBLISHED) {
    id
    title
    viewCount
    createdAt
  }
  archived: posts(authorId: $authorId, status: ARCHIVED) {
    id
    title
    createdAt
  }
}`,
      explanation: 'Фрагмент UserPreview переиспользуется в нескольких местах: для самого пользователя, подписчиков и подписок. Псевдонимы drafts, published, archived позволяют вызвать поле posts три раза с разными аргументами. Директива @include с переменной $showEmail условно включает email в ответ. Все операции именованы для лучшей отладки.'
    }
  ]
}
