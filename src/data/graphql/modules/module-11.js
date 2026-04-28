export default {
  id: 11,
  title: 'Обработка ошибок',
  description: 'Стратегии обработки ошибок в GraphQL: форматирование, кастомные ошибки, union error типы и коды ошибок.',
  lessons: [
    {
      id: 1,
      title: 'Ошибки в GraphQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'В GraphQL ошибки возвращаются в поле errors ответа, а не через HTTP статус-коды. GraphQL всегда отвечает 200 OK, даже при ошибках. Это принципиальное отличие от REST.' },
        { type: 'heading', value: 'Формат ответа с ошибкой' },
        { type: 'code', language: 'javascript', value: '// Ответ GraphQL всегда содержит data и/или errors\n{\n  "data": {\n    "user": null     // null, потому что произошла ошибка\n  },\n  "errors": [\n    {\n      "message": "Пользователь не найден",\n      "locations": [{ "line": 2, "column": 3 }],\n      "path": ["user"],\n      "extensions": {\n        "code": "NOT_FOUND",\n        "timestamp": "2025-01-15T10:30:00Z"\n      }\n    }\n  ]\n}\n\n// Частичные данные — уникальная возможность GraphQL!\n// Если часть запроса упала, остальные данные возвращаются\n{\n  "data": {\n    "user": {\n      "name": "Алексей",\n      "orders": null    // Ошибка при загрузке заказов\n    },\n    "posts": [...]      // Посты загрузились успешно\n  },\n  "errors": [\n    { "message": "Ошибка сервиса заказов", "path": ["user", "orders"] }\n  ]\n}' },
        { type: 'tip', value: 'В REST ошибка = нет данных. В GraphQL ошибка может быть частичной — часть данных вернётся. Это полезно для устойчивости: если один микросервис упал, остальные данные всё равно приходят.' }
      ]
    },
    {
      id: 2,
      title: 'GraphQLError и кастомные ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQLError — стандартный класс для ошибок в GraphQL. Поле extensions позволяет добавить дополнительную информацию: код ошибки, детали валидации и т.д.' },
        { type: 'heading', value: 'Создание ошибок' },
        { type: 'code', language: 'javascript', value: 'import { GraphQLError } from \'graphql\';\n\n// Стандартные коды ошибок Apollo\nconst resolvers = {\n  Query: {\n    user: (_, { id }, { db }) => {\n      const user = db.user.findUnique({ where: { id } });\n      if (!user) {\n        throw new GraphQLError(\'Пользователь не найден\', {\n          extensions: {\n            code: \'NOT_FOUND\',\n            argumentName: \'id\'\n          }\n        });\n      }\n      return user;\n    }\n  },\n  Mutation: {\n    createPost: (_, { input }, { user }) => {\n      if (!user) {\n        throw new GraphQLError(\'Необходима авторизация\', {\n          extensions: { code: \'UNAUTHENTICATED\' }\n        });\n      }\n      if (!input.title || input.title.length < 3) {\n        throw new GraphQLError(\'Некорректные данные\', {\n          extensions: {\n            code: \'BAD_USER_INPUT\',\n            validationErrors: {\n              title: \'Заголовок должен быть не менее 3 символов\'\n            }\n          }\n        });\n      }\n    }\n  }\n};' },
        { type: 'heading', value: 'Классы-обёртки' },
        { type: 'code', language: 'javascript', value: '// errors.js — кастомные классы ошибок\nexport class NotFoundError extends GraphQLError {\n  constructor(resource, id) {\n    super(`${resource} с id ${id} не найден`, {\n      extensions: { code: \'NOT_FOUND\', resource, id }\n    });\n  }\n}\n\nexport class AuthError extends GraphQLError {\n  constructor(message = \'Не авторизован\') {\n    super(message, {\n      extensions: { code: \'UNAUTHENTICATED\' }\n    });\n  }\n}\n\nexport class ForbiddenError extends GraphQLError {\n  constructor(message = \'Нет доступа\') {\n    super(message, {\n      extensions: { code: \'FORBIDDEN\' }\n    });\n  }\n}\n\nexport class ValidationError extends GraphQLError {\n  constructor(errors) {\n    super(\'Ошибка валидации\', {\n      extensions: { code: \'BAD_USER_INPUT\', validationErrors: errors }\n    });\n  }\n}\n\n// Использование\nthrow new NotFoundError(\'User\', id);\nthrow new ValidationError({ email: \'Некорректный email\' });' },
        { type: 'note', value: 'Стандартные коды: UNAUTHENTICATED, FORBIDDEN, BAD_USER_INPUT, NOT_FOUND, INTERNAL_SERVER_ERROR. Клиент обрабатывает ошибки по коду из extensions.' }
      ]
    },
    {
      id: 3,
      title: 'Форматирование ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apollo Server позволяет форматировать ошибки перед отправкой клиенту: скрывать стек-трейсы в production, логировать ошибки и добавлять метаданные.' },
        { type: 'heading', value: 'Плагин для обработки ошибок' },
        { type: 'code', language: 'javascript', value: 'const server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  formatError: (formattedError, error) => {\n    // Логируем все ошибки\n    console.error(\'GraphQL Error:\', error);\n\n    // В production скрываем внутренние ошибки\n    if (process.env.NODE_ENV === \'production\') {\n      // Скрываем стек-трейс\n      delete formattedError.extensions?.stacktrace;\n\n      // Скрываем детали внутренних ошибок\n      if (formattedError.extensions?.code === \'INTERNAL_SERVER_ERROR\') {\n        return {\n          message: \'Внутренняя ошибка сервера\',\n          extensions: { code: \'INTERNAL_SERVER_ERROR\' }\n        };\n      }\n    }\n\n    return formattedError;\n  }\n});' },
        { type: 'heading', value: 'Плагин для логирования ошибок' },
        { type: 'code', language: 'javascript', value: 'const errorLoggingPlugin = {\n  async requestDidStart() {\n    return {\n      async didEncounterErrors({ errors, request }) {\n        for (const error of errors) {\n          // Отправляем в Sentry/DataDog/etc.\n          if (error.extensions?.code === \'INTERNAL_SERVER_ERROR\') {\n            console.error(\'[CRITICAL]\', {\n              message: error.message,\n              path: error.path,\n              operation: request.operationName,\n              stack: error.originalError?.stack\n            });\n            // await sentry.captureException(error.originalError);\n          } else {\n            console.warn(\'[USER_ERROR]\', {\n              code: error.extensions?.code,\n              message: error.message,\n              path: error.path\n            });\n          }\n        }\n      }\n    };\n  }\n};' },
        { type: 'tip', value: 'Никогда не отправляйте стек-трейсы клиенту в production. Они могут содержать пути к файлам, имена БД и другую чувствительную информацию.' }
      ]
    },
    {
      id: 4,
      title: 'Union Error Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Union Error Pattern — продвинутый подход, где ошибки являются частью схемы. Вместо массива errors используются union типы, которые могут быть результатом или ошибкой.' },
        { type: 'heading', value: 'Определение типов ошибок' },
        { type: 'code', language: 'graphql', value: '# Интерфейс для всех ошибок\ninterface Error {\n  message: String!\n}\n\n# Конкретные типы ошибок\ntype NotFoundError implements Error {\n  message: String!\n  resourceType: String!\n  resourceId: ID!\n}\n\ntype ValidationError implements Error {\n  message: String!\n  field: String!\n}\n\ntype UnauthorizedError implements Error {\n  message: String!\n}\n\n# Union результат: успех ИЛИ ошибка\nunion CreatePostResult = Post | ValidationError | UnauthorizedError\nunion GetUserResult = User | NotFoundError\n\ntype Query {\n  user(id: ID!): GetUserResult!\n}\n\ntype Mutation {\n  createPost(input: CreatePostInput!): CreatePostResult!\n}' },
        { type: 'heading', value: 'Резолверы и запросы' },
        { type: 'code', language: 'javascript', value: '// Резолвер возвращает объект с __typename\nconst resolvers = {\n  Mutation: {\n    createPost: async (_, { input }, { user, db }) => {\n      if (!user) {\n        return {\n          __typename: \'UnauthorizedError\',\n          message: \'Необходима авторизация\'\n        };\n      }\n      if (!input.title || input.title.length < 3) {\n        return {\n          __typename: \'ValidationError\',\n          message: \'Заголовок слишком короткий\',\n          field: \'title\'\n        };\n      }\n      const post = await db.post.create({ data: { ...input, authorId: user.id } });\n      return { __typename: \'Post\', ...post };\n    }\n  },\n  CreatePostResult: {\n    __resolveType(obj) {\n      if (obj.__typename) return obj.__typename;\n      if (obj.title) return \'Post\';\n      return \'ValidationError\';\n    }\n  }\n};\n\n// Запрос на клиенте\n// mutation {\n//   createPost(input: { title: "ab" }) {\n//     ... on Post { id, title }\n//     ... on ValidationError { message, field }\n//     ... on UnauthorizedError { message }\n//   }\n// }' },
        { type: 'note', value: 'Union Error Pattern делает ошибки частью типовой системы. Клиент ОБЯЗАН обработать все возможные варианты. TypeScript + GraphQL Codegen генерирует типы, гарантируя полную обработку.' }
      ]
    },
    {
      id: 5,
      title: 'Обработка ошибок на клиенте',
      type: 'theory',
      content: [
        { type: 'text', value: 'На клиенте ошибки приходят в разных формах: сетевые ошибки, GraphQL ошибки (валидация, авторизация) и ошибки в данных (union error). Нужно обрабатывать все варианты.' },
        { type: 'heading', value: 'Apollo Client Error Handling' },
        { type: 'code', language: 'javascript', value: 'import { useQuery, useMutation } from \'@apollo/client\';\n\nfunction UserProfile({ userId }) {\n  const { data, loading, error } = useQuery(GET_USER, {\n    variables: { userId }\n  });\n\n  // Сетевая ошибка (сервер недоступен)\n  if (error?.networkError) {\n    return <p>Сервер недоступен. Проверьте соединение.</p>;\n  }\n\n  // GraphQL ошибка (из массива errors)\n  if (error?.graphQLErrors?.length) {\n    const err = error.graphQLErrors[0];\n    switch (err.extensions?.code) {\n      case \'UNAUTHENTICATED\':\n        return <Redirect to="/login" />;\n      case \'NOT_FOUND\':\n        return <p>Пользователь не найден</p>;\n      default:\n        return <p>Ошибка: {err.message}</p>;\n    }\n  }\n\n  if (loading) return <Spinner />;\n  return <div>{data.user.name}</div>;\n}' },
        { type: 'heading', value: 'Error Link для глобальной обработки' },
        { type: 'code', language: 'javascript', value: 'import { onError } from \'@apollo/client/link/error\';\n\nconst errorLink = onError(({ graphQLErrors, networkError, operation }) => {\n  if (graphQLErrors) {\n    for (const err of graphQLErrors) {\n      console.error(`[GraphQL] ${err.message}`, {\n        code: err.extensions?.code,\n        path: err.path,\n        operation: operation.operationName\n      });\n\n      // Глобальная обработка UNAUTHENTICATED\n      if (err.extensions?.code === \'UNAUTHENTICATED\') {\n        localStorage.removeItem(\'token\');\n        window.location.href = \'/login\';\n      }\n    }\n  }\n\n  if (networkError) {\n    console.error(`[Network] ${networkError.message}`);\n    // Показать глобальное уведомление\n  }\n});\n\n// Подключение\nconst client = new ApolloClient({\n  link: from([errorLink, httpLink]),\n  cache: new InMemoryCache()\n});' },
        { type: 'tip', value: 'Error Link перехватывает ВСЕ ошибки до того, как они попадут в компонент. Используйте его для глобальной обработки: редирект на логин, уведомления, логирование.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система обработки ошибок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полную систему обработки ошибок для GraphQL API с кастомными классами, форматированием и union error типами.',
      requirements: [
        'Класс NotFoundError(resource, id) с кодом NOT_FOUND',
        'Класс ValidationError(errors) с кодом BAD_USER_INPUT',
        'formatError функция: скрывает стек-трейсы в production, маскирует внутренние ошибки',
        'Union тип CreateUserResult = User | ValidationError | EmailTakenError',
        'Резолвер createUser возвращает union результат вместо throw',
        'Пример обработки ошибки на клиенте с проверкой __typename'
      ],
      hint: 'GraphQLError принимает объект options с полем extensions. formatError получает отформатированную ошибку и оригинальный error. Union результат возвращает объект с __typename.',
      expectedOutput: 'Классы ошибок, formatError функция, union типы и резолвер с обработкой ошибок через union.',
      solution: `import { GraphQLError } from 'graphql';

// Кастомные ошибки
class NotFoundError extends GraphQLError {
  constructor(resource, id) {
    super(\`\${resource} с id \${id} не найден\`, {
      extensions: { code: 'NOT_FOUND', resource, id }
    });
  }
}

class ValidationError extends GraphQLError {
  constructor(errors) {
    super('Ошибка валидации', {
      extensions: { code: 'BAD_USER_INPUT', validationErrors: errors }
    });
  }
}

// Форматирование ошибок
function formatError(formattedError, error) {
  delete formattedError.extensions?.stacktrace;
  if (process.env.NODE_ENV === 'production') {
    if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return {
        message: 'Внутренняя ошибка сервера',
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      };
    }
  }
  return formattedError;
}

// Схема с Union Error
// union CreateUserResult = User | UserValidationError | EmailTakenError
// type UserValidationError { message: String!, field: String! }
// type EmailTakenError { message: String!, email: String! }

const resolvers = {
  Mutation: {
    createUser: async (_, { input }, { db }) => {
      if (!input.name || input.name.length < 2) {
        return {
          __typename: 'UserValidationError',
          message: 'Имя слишком короткое',
          field: 'name'
        };
      }

      const existing = await db.user.findUnique({
        where: { email: input.email }
      });
      if (existing) {
        return {
          __typename: 'EmailTakenError',
          message: 'Email уже занят',
          email: input.email
        };
      }

      const user = await db.user.create({ data: input });
      return { __typename: 'User', ...user };
    }
  },
  CreateUserResult: {
    __resolveType(obj) {
      return obj.__typename;
    }
  }
};

// Клиент: обработка union ошибок
// mutation CreateUser($input: CreateUserInput!) {
//   createUser(input: $input) {
//     ... on User { id, name, email }
//     ... on UserValidationError { message, field }
//     ... on EmailTakenError { message, email }
//   }
// }`,
      explanation: 'Кастомные классы ошибок наследуются от GraphQLError и добавляют код через extensions. formatError скрывает стек-трейсы и маскирует внутренние ошибки. Union Error Pattern возвращает ошибку как часть данных — клиент обрабатывает каждый тип через inline fragments. __typename определяет конкретный тип в union.'
    }
  ]
}
