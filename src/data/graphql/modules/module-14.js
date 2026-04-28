export default {
  id: 14,
  title: 'Apollo Client: кэширование',
  description: 'InMemoryCache: нормализация, type policies, cache eviction, оптимистичные обновления и стратегии fetch.',
  lessons: [
    {
      id: 1,
      title: 'InMemoryCache и нормализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Client хранит данные в нормализованном кэше (InMemoryCache). Каждый объект с полями id и __typename сохраняется отдельно. При обновлении объекта все компоненты, использующие его, перерисовываются.' },
        { type: 'heading', value: 'Как работает нормализация' },
        { type: 'code', language: 'javascript', value: '// Ответ сервера:\n// {\n//   posts: [\n//     { id: "1", title: "Пост 1", author: { id: "10", name: "Алексей" } },\n//     { id: "2", title: "Пост 2", author: { id: "10", name: "Алексей" } }\n//   ]\n// }\n\n// Apollo нормализует в плоскую структуру:\n// {\n//   "Post:1": { id: "1", title: "Пост 1", author: { __ref: "User:10" } },\n//   "Post:2": { id: "2", title: "Пост 2", author: { __ref: "User:10" } },\n//   "User:10": { id: "10", name: "Алексей" },\n//   "ROOT_QUERY": { posts: [{ __ref: "Post:1" }, { __ref: "Post:2" }] }\n// }\n\n// Если обновить User:10.name = "Алекс", ОБА поста\n// автоматически покажут нового автора!' },
        { type: 'heading', value: 'Кастомный cache ID' },
        { type: 'code', language: 'javascript', value: 'const cache = new InMemoryCache({\n  typePolicies: {\n    // По умолчанию ключ = __typename:id\n    // Для типов без id нужен кастомный ключ\n    Product: {\n      keyFields: [\'sku\'] // Ключ: Product:{sku}\n    },\n    CartItem: {\n      keyFields: [\'productId\', \'size\'] // Составной ключ\n    },\n    AllProducts: {\n      keyFields: false // Singleton — не нормализуется\n    }\n  }\n});' },
        { type: 'tip', value: 'Всегда запрашивайте id и __typename. Без них Apollo не сможет нормализовать объект, и обновления не будут работать автоматически.' }
      ]
    },
    {
      id: 2,
      title: 'Fetch Policies',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fetch Policy определяет, откуда Apollo берёт данные: из кэша, с сервера или комбинирует. Выбор политики влияет на скорость и актуальность данных.' },
        { type: 'heading', value: 'Доступные политики' },
        { type: 'code', language: 'javascript', value: '// cache-first (по умолчанию)\n// Сначала кэш. Если нет — запрос к серверу.\nuseQuery(GET_POSTS, { fetchPolicy: \'cache-first\' });\n\n// cache-and-network\n// Сразу показать из кэша + обновить с сервера.\nuseQuery(GET_POSTS, { fetchPolicy: \'cache-and-network\' });\n\n// network-only\n// Всегда запрос к серверу. Результат сохраняется в кэш.\nuseQuery(GET_POSTS, { fetchPolicy: \'network-only\' });\n\n// no-cache\n// Всегда сервер. Результат НЕ сохраняется в кэш.\nuseQuery(GET_POSTS, { fetchPolicy: \'no-cache\' });\n\n// cache-only\n// Только кэш. Если нет — ошибка.\nuseQuery(GET_POSTS, { fetchPolicy: \'cache-only\' });\n\n// standby\n// Как cache-first, но не обновляется при изменении кэша.\nuseQuery(GET_POSTS, { fetchPolicy: \'standby\' });' },
        { type: 'heading', value: 'nextFetchPolicy' },
        { type: 'code', language: 'javascript', value: '// Первый запрос — с сервера, последующие — из кэша\nuseQuery(GET_POSTS, {\n  fetchPolicy: \'network-only\',      // Первый раз\n  nextFetchPolicy: \'cache-first\'    // Потом\n});\n\n// Глобальная настройка\nconst client = new ApolloClient({\n  cache: new InMemoryCache(),\n  defaultOptions: {\n    watchQuery: {\n      fetchPolicy: \'cache-and-network\',\n      nextFetchPolicy: \'cache-first\'\n    }\n  }\n});' },
        { type: 'note', value: 'cache-and-network — лучший выбор для большинства случаев: пользователь видит данные мгновенно из кэша, затем они обновляются с сервера.' }
      ]
    },
    {
      id: 3,
      title: 'Ручное обновление кэша',
      type: 'theory',
      content: [
        { type: 'text', value: 'После мутаций часто нужно обновить кэш вручную: добавить элемент в список, удалить из списка, обновить связанные данные.' },
        { type: 'heading', value: 'readQuery / writeQuery' },
        { type: 'code', language: 'javascript', value: 'const [deletePost] = useMutation(DELETE_POST, {\n  update: (cache, { data: { deletePost } }) => {\n    // Читаем текущие данные из кэша\n    const existing = cache.readQuery({ query: GET_POSTS });\n\n    // Записываем обновлённые данные\n    cache.writeQuery({\n      query: GET_POSTS,\n      data: {\n        posts: existing.posts.filter(p => p.id !== deletePost.id)\n      }\n    });\n  }\n});\n\n// Обновление конкретного объекта\nconst [likePost] = useMutation(LIKE_POST, {\n  update: (cache, { data: { likePost } }) => {\n    // writeFragment обновляет конкретный объект\n    cache.writeFragment({\n      id: `Post:${likePost.id}`,\n      fragment: gql`\n        fragment UpdatedPost on Post {\n          likesCount\n          isLikedByMe\n        }\n      `,\n      data: {\n        likesCount: likePost.likesCount,\n        isLikedByMe: true\n      }\n    });\n  }\n});' },
        { type: 'heading', value: 'cache.modify' },
        { type: 'code', language: 'javascript', value: '// cache.modify — более низкоуровневый API\nconst [createPost] = useMutation(CREATE_POST, {\n  update: (cache, { data: { createPost } }) => {\n    cache.modify({\n      id: \'ROOT_QUERY\',\n      fields: {\n        posts(existingPosts = []) {\n          const newPostRef = cache.writeFragment({\n            data: createPost,\n            fragment: gql`\n              fragment NewPost on Post {\n                id\n                title\n                body\n                author { id, name }\n              }\n            `\n          });\n          return [newPostRef, ...existingPosts];\n        }\n      }\n    });\n  }\n});' },
        { type: 'tip', value: 'cache.modify работает с ссылками (__ref), а не с данными напрямую. writeFragment возвращает ссылку, которую можно добавить в массив.' }
      ]
    },
    {
      id: 4,
      title: 'Type Policies и Field Policies',
      type: 'theory',
      content: [
        { type: 'text', value: 'Type Policies настраивают поведение кэша для конкретных типов и полей: мерджинг списков, вычисляемые поля, пагинация.' },
        { type: 'heading', value: 'Merge функции' },
        { type: 'code', language: 'javascript', value: 'const cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        // Merge для пагинации — объединяем страницы\n        posts: {\n          keyArgs: [\'status\'], // Разный кэш для разных статусов\n          merge(existing = [], incoming) {\n            return [...existing, ...incoming];\n          }\n        },\n\n        // Read — трансформация при чтении из кэша\n        notifications: {\n          read(existing = []) {\n            // Показывать только непрочитанные\n            return existing.filter(n => !n.read);\n          }\n        }\n      }\n    },\n\n    User: {\n      fields: {\n        // Вычисляемое поле в кэше\n        fullName: {\n          read(_, { readField }) {\n            const first = readField(\'firstName\');\n            const last = readField(\'lastName\');\n            return `${first} ${last}`;\n          }\n        }\n      }\n    }\n  }\n});' },
        { type: 'heading', value: 'keyArgs для разделения кэша' },
        { type: 'code', language: 'javascript', value: '// keyArgs определяет, какие аргументы влияют на кэш\nconst cache = new InMemoryCache({\n  typePolicies: {\n    Query: {\n      fields: {\n        posts: {\n          // Разный кэш для разных status, но один кэш\n          // для разных limit/offset (пагинация)\n          keyArgs: [\'status\', \'authorId\'],\n          // posts(status: PUBLISHED) и posts(status: DRAFT)\n          // будут кэшироваться отдельно\n        },\n\n        // Relay-style пагинация\n        users: relayStylePagination([\'role\']),\n        // Разный кэш для role: ADMIN и role: USER\n        // first/after не влияют на ключ кэша\n      }\n    }\n  }\n});' },
        { type: 'note', value: 'keyArgs = false означает один кэш для всех аргументов (подходит для пагинации). keyArgs = [\"status\"] — разный кэш для каждого значения status.' }
      ]
    },
    {
      id: 5,
      title: 'Eviction и Garbage Collection',
      type: 'theory',
      content: [
        { type: 'text', value: 'Со временем кэш растёт. Eviction удаляет конкретные данные, garbage collection очищает неиспользуемые объекты.' },
        { type: 'heading', value: 'Eviction' },
        { type: 'code', language: 'javascript', value: '// Удаление конкретного объекта\ncache.evict({ id: \'Post:123\' });\n\n// Удаление конкретного поля\ncache.evict({ id: \'Post:123\', fieldName: \'comments\' });\n\n// Удаление корневого поля\ncache.evict({ id: \'ROOT_QUERY\', fieldName: \'posts\' });\n\n// После evict нужна сборка мусора\ncache.gc();\n\n// Пример: удаление поста из кэша\nconst [deletePost] = useMutation(DELETE_POST, {\n  update: (cache, { data }) => {\n    cache.evict({ id: `Post:${data.deletePost.id}` });\n    cache.gc(); // Очистить осиротевшие ссылки\n  }\n});' },
        { type: 'heading', value: 'Полная очистка' },
        { type: 'code', language: 'javascript', value: '// Полная очистка кэша (при logout)\nfunction handleLogout() {\n  localStorage.removeItem(\'token\');\n\n  // Вариант 1: очистить и перезапросить активные запросы\n  await client.resetStore();\n\n  // Вариант 2: очистить без перезапроса\n  await client.clearStore();\n\n  navigate(\'/login\');\n}\n\n// Частичная очистка (при смене пользователя)\nfunction handleSwitchUser() {\n  // Удалить пользовательские данные, оставить публичные\n  cache.evict({ id: \'ROOT_QUERY\', fieldName: \'me\' });\n  cache.evict({ id: \'ROOT_QUERY\', fieldName: \'myOrders\' });\n  cache.evict({ id: \'ROOT_QUERY\', fieldName: \'notifications\' });\n  cache.gc();\n}' },
        { type: 'tip', value: 'resetStore() вызывает refetch всех активных запросов после очистки. clearStore() просто очищает кэш. При logout используйте resetStore для перезагрузки публичных данных.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка кэширования',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте InMemoryCache для блога: type policies, merge функции для пагинации, обновление кэша при мутациях.',
      requirements: [
        'Настройте InMemoryCache с typePolicies для Query.posts (пагинация с merge)',
        'keyArgs для posts: разный кэш для status, общий для пагинации',
        'Мутация deletePost с cache.evict',
        'Мутация createPost с cache.modify для добавления в список',
        'Мутация likePost с writeFragment для обновления счётчика',
        'Вычисляемое поле User.fullName через read'
      ],
      hint: 'merge объединяет existing и incoming массивы. keyArgs определяет, какие аргументы создают отдельные кэши. evict + gc удаляет объект.',
      expectedOutput: 'Настроенный InMemoryCache с type policies и три мутации с разными стратегиями обновления кэша.',
      solution: `import { InMemoryCache, gql } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: ['status'],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          }
        }
      }
    },
    User: {
      fields: {
        fullName: {
          read(_, { readField }) {
            return \`\${readField('firstName')} \${readField('lastName')}\`;
          }
        }
      }
    }
  }
});

// Удаление
const [deletePost] = useMutation(DELETE_POST, {
  update(cache, { data: { deletePost } }) {
    cache.evict({ id: \`Post:\${deletePost.id}\` });
    cache.gc();
  }
});

// Создание
const [createPost] = useMutation(CREATE_POST, {
  update(cache, { data: { createPost: newPost } }) {
    cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        posts(existingRefs = []) {
          const newRef = cache.writeFragment({
            data: newPost,
            fragment: gql\`
              fragment NewPost on Post {
                id title body author { id name } createdAt
              }
            \`
          });
          return [newRef, ...existingRefs];
        }
      }
    });
  }
});

// Лайк
const [likePost] = useMutation(LIKE_POST, {
  update(cache, { data: { likePost: updated } }) {
    cache.writeFragment({
      id: \`Post:\${updated.id}\`,
      fragment: gql\`
        fragment LikedPost on Post {
          likesCount
          isLikedByMe
        }
      \`,
      data: {
        likesCount: updated.likesCount,
        isLikedByMe: true
      }
    });
  }
});`,
      explanation: 'typePolicies настраивают кэш: keyArgs=[\"status\"] разделяет кэш по статусу, merge объединяет страницы пагинации. evict+gc удаляет объект и связанные ссылки. cache.modify с writeFragment добавляет новый пост в начало списка через ссылку (__ref). writeFragment обновляет только указанные поля объекта. fullName — вычисляемое поле, не хранится, а генерируется при чтении.'
    }
  ]
}
