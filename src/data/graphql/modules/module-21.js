export default {
  id: 21,
  title: 'Тестирование GraphQL',
  description: 'Тестирование GraphQL API: мокирование схемы, интеграционные тесты, тесты резолверов и snapshot тесты.',
  lessons: [
    {
      id: 1,
      title: 'Стратегии тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование GraphQL включает три уровня: unit тесты резолверов, интеграционные тесты API и тесты схемы. Каждый уровень проверяет разные аспекты.' },
        { type: 'heading', value: 'Пирамида тестирования GraphQL' },
        { type: 'list', value: [
          'Unit тесты — резолверы изолированно, с мокированными зависимостями',
          'Интеграционные тесты — полный запрос через сервер, с реальной/тестовой БД',
          'Тесты схемы — валидность схемы, breaking changes, deprecated поля',
          'E2E тесты — полный сценарий: клиент -> сервер -> БД'
        ] },
        { type: 'code', language: 'javascript', value: '// Пример структуры тестов\n// tests/\n// ├── unit/\n// │   ├── resolvers/\n// │   │   ├── user.test.js\n// │   │   └── post.test.js\n// │   └── services/\n// │       └── auth.test.js\n// ├── integration/\n// │   ├── queries.test.js\n// │   └── mutations.test.js\n// └── schema/\n//     └── schema.test.js' },
        { type: 'tip', value: 'Для большинства проектов достаточно интеграционных тестов: они проверяют полный цикл запроса. Unit тесты резолверов нужны для сложной бизнес-логики.' }
      ]
    },
    {
      id: 2,
      title: 'Unit тесты резолверов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Резолвер — обычная функция. Её можно протестировать, передав мокированные аргументы: parent, args, context.' },
        { type: 'heading', value: 'Тестирование с Vitest' },
        { type: 'code', language: 'javascript', value: '// resolvers/user.test.js\nimport { describe, it, expect, vi } from \'vitest\';\nimport { resolvers } from \'./user\';\n\ndescribe(\'User Resolvers\', () => {\n  // Мок базы данных\n  const mockDb = {\n    user: {\n      findUnique: vi.fn(),\n      findMany: vi.fn(),\n      create: vi.fn()\n    }\n  };\n\n  describe(\'Query.user\', () => {\n    it(\'возвращает пользователя по ID\', async () => {\n      const mockUser = { id: \'1\', name: \'Алексей\', email: \'alex@mail.ru\' };\n      mockDb.user.findUnique.mockResolvedValue(mockUser);\n\n      const result = await resolvers.Query.user(\n        null,                   // parent\n        { id: \'1\' },            // args\n        { db: mockDb }          // context\n      );\n\n      expect(result).toEqual(mockUser);\n      expect(mockDb.user.findUnique).toHaveBeenCalledWith({\n        where: { id: \'1\' }\n      });\n    });\n\n    it(\'возвращает null для несуществующего пользователя\', async () => {\n      mockDb.user.findUnique.mockResolvedValue(null);\n\n      const result = await resolvers.Query.user(\n        null, { id: \'999\' }, { db: mockDb }\n      );\n\n      expect(result).toBeNull();\n    });\n  });\n\n  describe(\'Query.me\', () => {\n    it(\'возвращает текущего пользователя\', () => {\n      const user = { id: \'1\', name: \'Алексей\' };\n      const result = resolvers.Query.me(null, {}, { user });\n      expect(result).toEqual(user);\n    });\n\n    it(\'выбрасывает ошибку без авторизации\', () => {\n      expect(() => {\n        resolvers.Query.me(null, {}, { user: null });\n      }).toThrow(\'Не авторизован\');\n    });\n  });\n});' },
        { type: 'note', value: 'Мокируйте только зависимости (db, services), не сам резолвер. Тестируйте возвращаемые значения и вызовы зависимостей.' }
      ]
    },
    {
      id: 3,
      title: 'Интеграционные тесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интеграционные тесты выполняют реальные GraphQL запросы через сервер. Они проверяют всю цепочку: парсинг, валидацию, резолверы, форматирование.' },
        { type: 'heading', value: 'Тестирование с executeOperation' },
        { type: 'code', language: 'javascript', value: '// integration/queries.test.js\nimport { ApolloServer } from \'@apollo/server\';\nimport { describe, it, expect, beforeAll, afterAll } from \'vitest\';\n\nlet server;\n\nbeforeAll(async () => {\n  server = new ApolloServer({ typeDefs, resolvers });\n  await server.start();\n});\n\nafterAll(async () => {\n  await server.stop();\n});\n\ndescribe(\'GraphQL Queries\', () => {\n  it(\'получает список пользователей\', async () => {\n    const response = await server.executeOperation({\n      query: `query GetUsers {\n        users {\n          id\n          name\n          email\n        }\n      }`\n    }, {\n      contextValue: { db: testDb, user: adminUser }\n    });\n\n    expect(response.body.kind).toBe(\'single\');\n    expect(response.body.singleResult.errors).toBeUndefined();\n    expect(response.body.singleResult.data.users).toHaveLength(2);\n    expect(response.body.singleResult.data.users[0]).toHaveProperty(\'name\');\n  });\n\n  it(\'возвращает ошибку для несуществующего пользователя\', async () => {\n    const response = await server.executeOperation({\n      query: `query { user(id: "999") { name } }`\n    }, {\n      contextValue: { db: testDb }\n    });\n\n    expect(response.body.singleResult.errors).toBeDefined();\n    expect(response.body.singleResult.errors[0].extensions.code).toBe(\'NOT_FOUND\');\n  });\n});' },
        { type: 'heading', value: 'Тестирование мутаций' },
        { type: 'code', language: 'javascript', value: 'describe(\'GraphQL Mutations\', () => {\n  it(\'создаёт пост\', async () => {\n    const response = await server.executeOperation({\n      query: `mutation CreatePost($input: CreatePostInput!) {\n        createPost(input: $input) { id, title, body }\n      }`,\n      variables: {\n        input: { title: \'Тестовый пост\', body: \'Текст\' }\n      }\n    }, {\n      contextValue: { db: testDb, user: testUser }\n    });\n\n    const post = response.body.singleResult.data.createPost;\n    expect(post.title).toBe(\'Тестовый пост\');\n    expect(post.id).toBeDefined();\n  });\n\n  it(\'отклоняет мутацию без авторизации\', async () => {\n    const response = await server.executeOperation({\n      query: `mutation { createPost(input: { title: "X", body: "Y" }) { id } }`\n    }, {\n      contextValue: { db: testDb, user: null } // Нет пользователя\n    });\n\n    expect(response.body.singleResult.errors[0].extensions.code)\n      .toBe(\'UNAUTHENTICATED\');\n  });\n});' },
        { type: 'tip', value: 'executeOperation тестирует без HTTP — быстро и надёжно. Для тестирования через HTTP используйте supertest с expressMiddleware.' }
      ]
    },
    {
      id: 4,
      title: 'Мокирование схемы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мокирование схемы позволяет генерировать реалистичные ответы без бэкенда. Полезно для фронтенд-разработки и тестирования компонентов.' },
        { type: 'heading', value: '@graphql-tools/mock' },
        { type: 'code', language: 'javascript', value: 'import { addMocksToSchema } from \'@graphql-tools/mock\';\nimport { makeExecutableSchema } from \'@graphql-tools/schema\';\nimport { faker } from \'@faker-js/faker\';\n\nconst schema = makeExecutableSchema({ typeDefs });\n\nconst mockedSchema = addMocksToSchema({\n  schema,\n  mocks: {\n    // Кастомные мок-функции\n    String: () => faker.lorem.word(),\n    Int: () => faker.number.int({ min: 1, max: 100 }),\n    Float: () => faker.number.float({ min: 0, max: 1000 }),\n    DateTime: () => faker.date.recent().toISOString(),\n\n    // Мок для конкретного типа\n    User: () => ({\n      id: faker.string.uuid(),\n      name: faker.person.fullName(),\n      email: faker.internet.email(),\n      avatar: faker.image.avatar()\n    }),\n\n    // Мок для Query\n    Query: () => ({\n      users: () => new Array(5),  // 5 элементов\n      posts: () => new Array(10)\n    })\n  }\n});' },
        { type: 'heading', value: 'MockedProvider для React тестов' },
        { type: 'code', language: 'javascript', value: 'import { MockedProvider } from \'@apollo/client/testing\';\nimport { render, screen, waitFor } from \'@testing-library/react\';\n\nconst mocks = [\n  {\n    request: { query: GET_POSTS },\n    result: {\n      data: {\n        posts: [\n          { id: \'1\', title: \'Тестовый пост\', author: { name: \'Автор\' } },\n          { id: \'2\', title: \'Второй пост\', author: { name: \'Другой\' } }\n        ]\n      }\n    }\n  }\n];\n\ntest(\'отображает список постов\', async () => {\n  render(\n    <MockedProvider mocks={mocks} addTypename={false}>\n      <PostList />\n    </MockedProvider>\n  );\n\n  // Ждём загрузки\n  expect(screen.getByText(\'Загрузка...\')).toBeInTheDocument();\n\n  await waitFor(() => {\n    expect(screen.getByText(\'Тестовый пост\')).toBeInTheDocument();\n    expect(screen.getByText(\'Второй пост\')).toBeInTheDocument();\n  });\n});' },
        { type: 'note', value: 'MockedProvider перехватывает запросы и возвращает мокированные данные. Каждый мок привязан к конкретному query + variables. Порядок моков важен.' }
      ]
    },
    {
      id: 5,
      title: 'Тесты схемы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тесты схемы проверяют, что схема валидна, не содержит breaking changes и соответствует конвенциям.' },
        { type: 'heading', value: 'Валидация схемы' },
        { type: 'code', language: 'javascript', value: 'import { buildSchema, validateSchema, printSchema } from \'graphql\';\nimport { describe, it, expect } from \'vitest\';\n\ndescribe(\'GraphQL Schema\', () => {\n  it(\'схема валидна\', () => {\n    const schema = buildSchema(typeDefs);\n    const errors = validateSchema(schema);\n    expect(errors).toHaveLength(0);\n  });\n\n  it(\'содержит обязательные типы\', () => {\n    const schema = buildSchema(typeDefs);\n    expect(schema.getType(\'User\')).toBeDefined();\n    expect(schema.getType(\'Post\')).toBeDefined();\n    expect(schema.getType(\'Query\')).toBeDefined();\n    expect(schema.getType(\'Mutation\')).toBeDefined();\n  });\n\n  it(\'User имеет обязательные поля\', () => {\n    const schema = buildSchema(typeDefs);\n    const userType = schema.getType(\'User\');\n    const fields = userType.getFields();\n\n    expect(fields.id).toBeDefined();\n    expect(fields.name).toBeDefined();\n    expect(fields.email).toBeDefined();\n  });\n\n  it(\'snapshot схемы\', () => {\n    const schema = buildSchema(typeDefs);\n    const printed = printSchema(schema);\n    expect(printed).toMatchSnapshot();\n  });\n});' },
        { type: 'heading', value: 'Проверка breaking changes' },
        { type: 'code', language: 'javascript', value: 'import { findBreakingChanges, buildSchema } from \'graphql\';\n\ndescribe(\'Schema Evolution\', () => {\n  it(\'нет breaking changes\', () => {\n    const oldSchema = buildSchema(oldTypeDefs);\n    const newSchema = buildSchema(newTypeDefs);\n\n    const breakingChanges = findBreakingChanges(oldSchema, newSchema);\n\n    expect(breakingChanges).toHaveLength(0);\n    // Если есть breaking changes:\n    // [{ type: \"FIELD_REMOVED\", description: \"User.email was removed\" }]\n  });\n});' },
        { type: 'tip', value: 'Snapshot тесты схемы ловят непреднамеренные изменения. findBreakingChanges из graphql проверяет совместимость версий схемы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тестирование API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для GraphQL API блога: unit тесты, интеграционные тесты и тесты схемы.',
      requirements: [
        'Unit тест Query.posts — мокирование db, проверка вызова findMany',
        'Unit тест Mutation.createPost — проверка авторизации и вызова create',
        'Интеграционный тест — executeOperation для получения постов',
        'Интеграционный тест — мутация создания поста с переменными',
        'Тест мутации без авторизации — ожидание UNAUTHENTICATED ошибки',
        'Тест валидности схемы'
      ],
      hint: 'Для unit тестов мокируйте db через vi.fn(). Для интеграционных используйте server.executeOperation. Для тестов схемы используйте buildSchema + validateSchema.',
      expectedOutput: 'Полный набор тестов: 2 unit, 3 интеграционных и 1 тест схемы.',
      solution: `import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { buildSchema, validateSchema } from 'graphql';

// Unit тесты
describe('Resolvers Unit Tests', () => {
  const mockDb = {
    post: {
      findMany: vi.fn(),
      create: vi.fn()
    }
  };

  it('Query.posts возвращает список постов', async () => {
    const posts = [{ id: '1', title: 'Пост' }];
    mockDb.post.findMany.mockResolvedValue(posts);

    const result = await resolvers.Query.posts(null, { limit: 10 }, { db: mockDb });

    expect(result).toEqual(posts);
    expect(mockDb.post.findMany).toHaveBeenCalled();
  });

  it('Mutation.createPost проверяет авторизацию', async () => {
    await expect(
      resolvers.Mutation.createPost(null, { input: { title: 'X', body: 'Y' } }, { db: mockDb, user: null })
    ).rejects.toThrow('Не авторизован');
  });

  it('Mutation.createPost создаёт пост', async () => {
    const user = { id: '1', name: 'Тест' };
    const created = { id: '10', title: 'Новый', body: 'Текст', authorId: '1' };
    mockDb.post.create.mockResolvedValue(created);

    const result = await resolvers.Mutation.createPost(
      null,
      { input: { title: 'Новый', body: 'Текст' } },
      { db: mockDb, user }
    );

    expect(result.title).toBe('Новый');
    expect(mockDb.post.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ authorId: '1' }) })
    );
  });
});

// Интеграционные тесты
describe('Integration Tests', () => {
  let server;
  const testDb = { /* тестовая БД */ };

  beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
  });

  afterAll(async () => { await server.stop(); });

  it('получает список постов', async () => {
    const response = await server.executeOperation(
      { query: 'query { posts { id title } }' },
      { contextValue: { db: testDb, user: { id: '1', role: 'USER' } } }
    );
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data.posts).toBeDefined();
  });

  it('создаёт пост', async () => {
    const response = await server.executeOperation({
      query: \`mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) { id title }
      }\`,
      variables: { input: { title: 'Тест', body: 'Текст' } }
    }, {
      contextValue: { db: testDb, user: { id: '1', role: 'USER' } }
    });
    expect(response.body.singleResult.data.createPost.title).toBe('Тест');
  });

  it('отклоняет без авторизации', async () => {
    const response = await server.executeOperation({
      query: 'mutation { createPost(input: { title: "X", body: "Y" }) { id } }'
    }, {
      contextValue: { db: testDb, user: null }
    });
    expect(response.body.singleResult.errors[0].extensions.code).toBe('UNAUTHENTICATED');
  });
});

// Тесты схемы
describe('Schema Tests', () => {
  it('схема валидна', () => {
    const schema = buildSchema(typeDefs);
    expect(validateSchema(schema)).toHaveLength(0);
  });
});`,
      explanation: 'Unit тесты проверяют резолверы изолированно с мокированной db. Интеграционные тесты через executeOperation проходят полный цикл: парсинг, валидация, выполнение. contextValue позволяет передать разный context (с user или без). Тест схемы проверяет валидность SDL через buildSchema + validateSchema.'
    }
  ]
}
