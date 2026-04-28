export default {
  id: 10,
  title: 'Пагинация',
  description: 'Стратегии пагинации в GraphQL: offset, cursor-based, Relay-style connections и их реализация.',
  lessons: [
    {
      id: 1,
      title: 'Offset пагинация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Offset пагинация — самый простой подход: указываем сколько элементов пропустить (offset) и сколько загрузить (limit). Аналог SQL OFFSET/LIMIT.' },
        { type: 'heading', value: 'Схема и реализация' },
        { type: 'code', language: 'graphql', value: 'type Query {\n  posts(limit: Int = 10, offset: Int = 0): PostList!\n}\n\ntype PostList {\n  items: [Post!]!\n  totalCount: Int!\n  hasMore: Boolean!\n}\n\n# Использование:\nquery {\n  posts(limit: 10, offset: 0) {   # Страница 1\n    items { id, title }\n    totalCount\n    hasMore\n  }\n}\n\nquery {\n  posts(limit: 10, offset: 10) {  # Страница 2\n    items { id, title }\n    totalCount\n    hasMore\n  }\n}' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    posts: async (_, { limit, offset }, { db }) => {\n      const [items, totalCount] = await Promise.all([\n        db.post.findMany({\n          take: limit,\n          skip: offset,\n          orderBy: { createdAt: \'desc\' }\n        }),\n        db.post.count()\n      ]);\n\n      return {\n        items,\n        totalCount,\n        hasMore: offset + items.length < totalCount\n      };\n    }\n  }\n};' },
        { type: 'list', value: [
          'Плюсы: простой, привычный, можно перейти на любую страницу',
          'Минусы: дубликаты при вставке новых данных, медленный при большом offset',
          'SQL: OFFSET 10000 всё равно сканирует 10000 строк перед пропуском'
        ] },
        { type: 'note', value: 'Offset пагинация подходит для статических данных или когда нужна навигация по номерам страниц (1, 2, 3...). Не подходит для бесконечной прокрутки.' }
      ]
    },
    {
      id: 2,
      title: 'Cursor-based пагинация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cursor-based пагинация использует курсор (указатель на элемент) вместо offset. Это стабильнее: новые данные не вызывают дубликаты.' },
        { type: 'heading', value: 'Принцип работы' },
        { type: 'code', language: 'graphql', value: 'type Query {\n  posts(first: Int = 10, after: String): PostConnection!\n}\n\ntype PostConnection {\n  edges: [PostEdge!]!\n  pageInfo: PageInfo!\n}\n\ntype PostEdge {\n  node: Post!\n  cursor: String!\n}\n\ntype PageInfo {\n  hasNextPage: Boolean!\n  hasPreviousPage: Boolean!\n  startCursor: String\n  endCursor: String\n}\n\n# Запрос первой страницы\nquery {\n  posts(first: 10) {\n    edges {\n      node { id, title }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\n# Запрос следующей страницы\nquery {\n  posts(first: 10, after: "Y3Vyc29yOjEw") {\n    edges {\n      node { id, title }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}' },
        { type: 'heading', value: 'Реализация' },
        { type: 'code', language: 'javascript', value: '// Курсор — Base64 от ID или позиции\nconst encodeCursor = (id) => Buffer.from(`cursor:${id}`).toString(\'base64\');\nconst decodeCursor = (cursor) => Buffer.from(cursor, \'base64\').toString().replace(\'cursor:\', \'\');\n\nconst resolvers = {\n  Query: {\n    posts: async (_, { first = 10, after }, { db }) => {\n      const where = {};\n      if (after) {\n        const afterId = decodeCursor(after);\n        where.id = { gt: afterId }; // Всё после курсора\n      }\n\n      const posts = await db.post.findMany({\n        where,\n        take: first + 1, // +1 для определения hasNextPage\n        orderBy: { id: \'asc\' }\n      });\n\n      const hasNextPage = posts.length > first;\n      const edges = posts.slice(0, first).map(post => ({\n        node: post,\n        cursor: encodeCursor(post.id)\n      }));\n\n      return {\n        edges,\n        pageInfo: {\n          hasNextPage,\n          hasPreviousPage: !!after,\n          startCursor: edges[0]?.cursor || null,\n          endCursor: edges[edges.length - 1]?.cursor || null\n        }\n      };\n    }\n  }\n};' },
        { type: 'tip', value: 'Запрашиваем first + 1 элементов. Если получили больше чем first — значит, есть следующая страница. Лишний элемент отбрасываем.' }
      ]
    },
    {
      id: 3,
      title: 'Relay-style Connections',
      type: 'theory',
      content: [
        { type: 'text', value: 'Relay Connections — стандарт пагинации от Facebook. Он определяет единый формат: Connection, Edge, Node и PageInfo. Поддерживает навигацию вперёд и назад.' },
        { type: 'heading', value: 'Спецификация Relay' },
        { type: 'code', language: 'graphql', value: '# Relay стандарт для пагинации\ntype Query {\n  # forward: first + after\n  # backward: last + before\n  posts(\n    first: Int\n    after: String\n    last: Int\n    before: String\n  ): PostConnection!\n}\n\n# Connection — контейнер с метаданными\ntype PostConnection {\n  edges: [PostEdge!]!\n  pageInfo: PageInfo!\n  totalCount: Int            # Дополнительное поле\n}\n\n# Edge — элемент + его курсор\ntype PostEdge {\n  node: Post!\n  cursor: String!\n}\n\n# PageInfo — информация о навигации\ntype PageInfo {\n  hasNextPage: Boolean!\n  hasPreviousPage: Boolean!\n  startCursor: String\n  endCursor: String\n}' },
        { type: 'heading', value: 'Универсальная функция пагинации' },
        { type: 'code', language: 'javascript', value: 'async function paginateConnection(model, args, where = {}) {\n  const { first, after, last, before } = args;\n  const take = first || last || 10;\n  const isBackward = !!last;\n\n  const queryWhere = { ...where };\n  if (after) queryWhere.id = { gt: decodeCursor(after) };\n  if (before) queryWhere.id = { lt: decodeCursor(before) };\n\n  const items = await model.findMany({\n    where: queryWhere,\n    take: take + 1,\n    orderBy: { id: isBackward ? \'desc\' : \'asc\' }\n  });\n\n  if (isBackward) items.reverse();\n\n  const hasExtra = items.length > take;\n  const nodes = items.slice(0, take);\n\n  const edges = nodes.map(node => ({\n    node,\n    cursor: encodeCursor(node.id)\n  }));\n\n  const totalCount = await model.count({ where });\n\n  return {\n    edges,\n    totalCount,\n    pageInfo: {\n      hasNextPage: isBackward ? !!before : hasExtra,\n      hasPreviousPage: isBackward ? hasExtra : !!after,\n      startCursor: edges[0]?.cursor || null,\n      endCursor: edges[edges.length - 1]?.cursor || null\n    }\n  };\n}\n\n// Использование\nconst resolvers = {\n  Query: {\n    posts: (_, args, { db }) => paginateConnection(db.post, args),\n    comments: (_, args, { db }) => paginateConnection(db.comment, args, {\n      postId: args.postId\n    })\n  }\n};' },
        { type: 'note', value: 'Relay-style Connections — стандарт де-факто для пагинации в GraphQL. GitHub API, Shopify API и другие крупные API используют именно этот формат.' }
      ]
    },
    {
      id: 4,
      title: 'Сортировка и фильтрация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пагинация часто идёт вместе с сортировкой и фильтрацией. Рассмотрим, как правильно комбинировать их в GraphQL.' },
        { type: 'heading', value: 'Схема с фильтрацией' },
        { type: 'code', language: 'graphql', value: 'enum SortField {\n  CREATED_AT\n  TITLE\n  POPULARITY\n}\n\nenum SortOrder {\n  ASC\n  DESC\n}\n\ninput PostSortInput {\n  field: SortField = CREATED_AT\n  order: SortOrder = DESC\n}\n\ninput PostFilterInput {\n  status: PostStatus\n  authorId: ID\n  search: String\n  tags: [String!]\n  createdAfter: DateTime\n  createdBefore: DateTime\n}\n\ntype Query {\n  posts(\n    first: Int = 10\n    after: String\n    filter: PostFilterInput\n    sort: PostSortInput\n  ): PostConnection!\n}' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Query: {\n    posts: async (_, { first, after, filter, sort }, { db }) => {\n      const where = {};\n\n      // Применяем фильтры\n      if (filter?.status) where.status = filter.status;\n      if (filter?.authorId) where.authorId = filter.authorId;\n      if (filter?.tags) where.tags = { hasSome: filter.tags };\n      if (filter?.search) {\n        where.OR = [\n          { title: { contains: filter.search, mode: \'insensitive\' } },\n          { body: { contains: filter.search, mode: \'insensitive\' } }\n        ];\n      }\n      if (filter?.createdAfter || filter?.createdBefore) {\n        where.createdAt = {};\n        if (filter.createdAfter) where.createdAt.gte = filter.createdAfter;\n        if (filter.createdBefore) where.createdAt.lte = filter.createdBefore;\n      }\n\n      // Сортировка\n      const orderBy = {};\n      const sortField = sort?.field || \'CREATED_AT\';\n      const sortOrder = sort?.order || \'DESC\';\n      const fieldMap = { CREATED_AT: \'createdAt\', TITLE: \'title\', POPULARITY: \'viewCount\' };\n      orderBy[fieldMap[sortField]] = sortOrder.toLowerCase();\n\n      return paginateConnection(db.post, { first, after }, where, orderBy);\n    }\n  }\n};' },
        { type: 'tip', value: 'При cursor-based пагинации с пользовательской сортировкой курсор должен включать значение поля сортировки, а не только ID. Иначе порядок нарушится.' }
      ]
    },
    {
      id: 5,
      title: 'Бесконечный скролл на клиенте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cursor-based пагинация идеально подходит для бесконечной прокрутки. Apollo Client предоставляет fetchMore для дозагрузки данных.' },
        { type: 'heading', value: 'fetchMore в Apollo Client' },
        { type: 'code', language: 'javascript', value: 'import { gql, useQuery } from \'@apollo/client\';\n\nconst GET_POSTS = gql`\n  query GetPosts($first: Int!, $after: String) {\n    posts(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          createdAt\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n`;\n\nfunction PostList() {\n  const { data, loading, fetchMore } = useQuery(GET_POSTS, {\n    variables: { first: 10 }\n  });\n\n  const loadMore = () => {\n    if (!data?.posts.pageInfo.hasNextPage) return;\n\n    fetchMore({\n      variables: {\n        after: data.posts.pageInfo.endCursor\n      }\n      // Apollo Client автоматически мерджит результаты\n      // благодаря cache policy (см. следующий блок)\n    });\n  };\n\n  if (loading) return <p>Загрузка...</p>;\n\n  return (\n    <div>\n      {data.posts.edges.map(({ node }) => (\n        <article key={node.id}>\n          <h2>{node.title}</h2>\n        </article>\n      ))}\n      {data.posts.pageInfo.hasNextPage && (\n        <button onClick={loadMore}>Загрузить ещё</button>\n      )}\n    </div>\n  );\n}' },
        { type: 'heading', value: 'Cache policy для пагинации' },
        { type: 'code', language: 'javascript', value: 'import { InMemoryCache } from \'@apollo/client\';\nimport { relayStylePagination } from \'@apollo/client/utilities\';\n\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        // Автоматическое объединение страниц\n        posts: relayStylePagination(),\n\n        // Или с учётом аргументов фильтра\n        posts: relayStylePagination([\'filter\', \'sort\'])\n      }\n    }\n  }\n});' },
        { type: 'note', value: 'relayStylePagination() от Apollo автоматически объединяет edges из разных страниц в один массив при fetchMore. Без этого каждая страница перезаписывала бы предыдущую.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Cursor-based пагинация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте cursor-based пагинацию в стиле Relay для списка товаров с фильтрацией по категории.',
      requirements: [
        'Типы ProductConnection, ProductEdge, PageInfo',
        'Query products(first, after, categoryId) — пагинация с фильтрацией',
        'Функции encodeCursor и decodeCursor (Base64)',
        'Резолвер: запрашиваем first + 1 для определения hasNextPage',
        'Правильный порядок: результат соответствует порядку ключей',
        'pageInfo с hasNextPage, hasPreviousPage, startCursor, endCursor'
      ],
      hint: 'Курсор = Base64(id). Запрашиваем first+1, если получили больше first — hasNextPage=true. Отбрасываем лишний элемент.',
      expectedOutput: 'Полная реализация cursor-based пагинации с Relay Connection типами и резолвером.',
      solution: `// Схема
const typeDefs = \`#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: Category!
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Query {
    products(first: Int = 10, after: String, categoryId: ID): ProductConnection!
  }
\`;

// Утилиты курсора
const encodeCursor = (id) => Buffer.from(\`cursor:\${id}\`).toString('base64');
const decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString().replace('cursor:', '');

// Резолвер
const resolvers = {
  Query: {
    products: async (_, { first = 10, after, categoryId }, { db }) => {
      const where = {};
      if (categoryId) where.categoryId = categoryId;
      if (after) {
        const afterId = decodeCursor(after);
        where.id = { gt: afterId };
      }

      const items = await db.product.findMany({
        where,
        take: first + 1,
        orderBy: { id: 'asc' }
      });

      const hasNextPage = items.length > first;
      const nodes = items.slice(0, first);

      const edges = nodes.map(node => ({
        node,
        cursor: encodeCursor(node.id)
      }));

      const totalCount = await db.product.count({
        where: categoryId ? { categoryId } : {}
      });

      return {
        edges,
        totalCount,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null
        }
      };
    }
  }
};`,
      explanation: 'encodeCursor/decodeCursor превращают ID в непрозрачную строку (Base64). Запрос берёт first+1 элементов: если вернулось больше, значит есть следующая страница. Лишний элемент отбрасывается. Каждый edge содержит node (данные) и cursor (позицию). pageInfo сообщает клиенту о наличии дополнительных страниц. totalCount считается отдельным запросом.'
    }
  ]
}
