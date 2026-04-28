export default {
  id: 17,
  title: 'GraphQL Code Generator',
  description: 'Автоматическая генерация TypeScript типов, хуков и SDK из GraphQL схемы и операций.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Code Generator',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL Code Generator автоматически генерирует TypeScript типы, React хуки и SDK из вашей GraphQL схемы. Это устраняет ручное написание типов и обеспечивает type-safety.' },
        { type: 'heading', value: 'Проблема без кодогенерации' },
        { type: 'code', language: 'typescript', value: '// Без кодогенерации — типы пишутся вручную\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\ninterface GetUserData {\n  user: User;\n}\n\ninterface GetUserVars {\n  id: string;\n}\n\n// Типы могут разойтись со схемой!\nconst { data } = useQuery<GetUserData, GetUserVars>(GET_USER, {\n  variables: { id: userId }\n});\n\n// С кодогенерацией — типы генерируются автоматически\n// Всегда актуальны, всегда совпадают со схемой\nconst { data } = useGetUserQuery({ variables: { id: userId } });\n// data.user типизирован автоматически!' },
        { type: 'list', value: [
          'Типы всегда соответствуют серверной схеме',
          'Типизированные хуки useQuery/useMutation',
          'Автодополнение в IDE для полей и переменных',
          'Ошибки типов при компиляции, а не в runtime'
        ] },
        { type: 'tip', value: 'GraphQL Code Generator — must-have для TypeScript проектов. Он экономит десятки часов на написание и поддержку типов.' }
      ]
    },
    {
      id: 2,
      title: 'Установка и настройка',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: 'npm install -D @graphql-codegen/cli @graphql-codegen/typescript \\\n  @graphql-codegen/typescript-operations \\\n  @graphql-codegen/typescript-react-apollo' },
        { type: 'heading', value: 'Конфигурация codegen.ts' },
        { type: 'code', language: 'typescript', value: '// codegen.ts\nimport type { CodegenConfig } from \'@graphql-codegen/cli\';\n\nconst config: CodegenConfig = {\n  // Источник схемы\n  schema: \'http://localhost:4000/graphql\',\n  // Где искать .graphql файлы\n  documents: \'src/**/*.graphql\',\n  generates: {\n    // Генерация типов и хуков\n    \'src/generated/graphql.ts\': {\n      plugins: [\n        \'typescript\',               // Типы из схемы\n        \'typescript-operations\',     // Типы для операций\n        \'typescript-react-apollo\'    // React хуки\n      ],\n      config: {\n        withHooks: true,\n        withComponent: false,\n        skipTypename: false,\n        // Используем enum как const\n        enumsAsConst: true\n      }\n    }\n  }\n};\n\nexport default config;' },
        { type: 'heading', value: 'Запуск' },
        { type: 'code', language: 'bash', value: '# Генерация\nnpx graphql-codegen\n\n# Watch mode\nnpx graphql-codegen --watch\n\n# package.json\n# "scripts": {\n#   "codegen": "graphql-codegen",\n#   "codegen:watch": "graphql-codegen --watch"\n# }' },
        { type: 'note', value: 'Запускайте codegen при изменении схемы или GraphQL файлов. В watch mode он перегенерирует автоматически.' }
      ]
    },
    {
      id: 3,
      title: 'Генерация типов и хуков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code Generator создаёт типы для каждого типа из схемы и типизированные хуки для каждой операции из .graphql файлов.' },
        { type: 'heading', value: 'Определение операций' },
        { type: 'code', language: 'graphql', value: '# src/graphql/queries/user.graphql\nquery GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n    posts {\n      id\n      title\n    }\n  }\n}\n\nquery GetUsers {\n  users {\n    id\n    name\n    role\n  }\n}\n\n# src/graphql/mutations/user.graphql\nmutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    id\n    name\n    email\n  }\n}' },
        { type: 'heading', value: 'Сгенерированный код' },
        { type: 'code', language: 'typescript', value: '// src/generated/graphql.ts (автоматически)\n\n// Типы из схемы\nexport type User = {\n  __typename?: \'User\';\n  id: string;\n  name: string;\n  email: string;\n  posts: Array<Post>;\n  role: Role;\n};\n\nexport const Role = {\n  Admin: \'ADMIN\',\n  User: \'USER\'\n} as const;\n\n// Типы для операции GetUser\nexport type GetUserQueryVariables = {\n  id: string;\n};\n\nexport type GetUserQuery = {\n  __typename?: \'Query\';\n  user: {\n    __typename?: \'User\';\n    id: string;\n    name: string;\n    email: string;\n    posts: Array<{ __typename?: \'Post\'; id: string; title: string }>;\n  } | null;\n};\n\n// Типизированный хук\nexport function useGetUserQuery(options: QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {\n  return useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);\n}\n\nexport function useCreateUserMutation() {\n  return useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);\n}' },
        { type: 'tip', value: 'Типы для операций содержат ТОЛЬКО запрошенные поля, а не все поля типа. Это отражает реальную структуру данных, которую получит компонент.' }
      ]
    },
    {
      id: 4,
      title: 'Использование в компонентах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сгенерированные хуки предоставляют полную типизацию: переменные, данные, ошибки. IDE автодополняет всё.' },
        { type: 'heading', value: 'Типизированные компоненты' },
        { type: 'code', language: 'typescript', value: 'import { useGetUserQuery, useCreateUserMutation } from \'./generated/graphql\';\n\nfunction UserProfile({ userId }: { userId: string }) {\n  // Переменные и данные полностью типизированы\n  const { data, loading, error } = useGetUserQuery({\n    variables: { id: userId } // TS проверит тип\n  });\n\n  if (loading) return <Spinner />;\n  if (error) return <Error message={error.message} />;\n\n  // data.user типизирован — IDE подсказывает поля\n  return (\n    <div>\n      <h1>{data?.user?.name}</h1>\n      <p>{data?.user?.email}</p>\n      <ul>\n        {data?.user?.posts.map(post => (\n          <li key={post.id}>{post.title}</li>\n          // post.body — ошибка TS! Не запрашивали\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nfunction CreateUserForm() {\n  const [createUser, { loading }] = useCreateUserMutation();\n\n  const handleSubmit = async (formData: CreateUserInput) => {\n    // TypeScript проверит input\n    const { data } = await createUser({\n      variables: { input: formData }\n    });\n    console.log(data?.createUser.id); // типизировано\n  };\n\n  return <form onSubmit={handleSubmit}>...</form>;\n}' },
        { type: 'note', value: 'Если добавить поле в .graphql файл и запустить codegen, TypeScript сразу подскажет новые поля в компонентах. Если удалить поле — покажет ошибки во всех местах использования.' }
      ]
    },
    {
      id: 5,
      title: 'Продвинутая конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code Generator поддерживает множество плагинов и настроек: фрагменты, кастомные скаляры, near-operation-file генерация.' },
        { type: 'heading', value: 'Near Operation File' },
        { type: 'code', language: 'typescript', value: '// codegen.ts — генерация рядом с операцией\nconst config: CodegenConfig = {\n  schema: \'http://localhost:4000/graphql\',\n  documents: \'src/**/*.graphql\',\n  generates: {\n    // Генерировать .generated.ts рядом с .graphql\n    \'src/\': {\n      preset: \'near-operation-file\',\n      presetConfig: {\n        extension: \'.generated.tsx\',\n        baseTypesPath: \'~@/generated/types\'\n      },\n      plugins: [\n        \'typescript-operations\',\n        \'typescript-react-apollo\'\n      ]\n    },\n    // Базовые типы в одном файле\n    \'src/generated/types.ts\': {\n      plugins: [\'typescript\']\n    }\n  }\n};\n\n// Результат:\n// src/components/UserProfile/query.graphql\n// src/components/UserProfile/query.generated.tsx  <- хуки рядом!' },
        { type: 'heading', value: 'Кастомные скаляры' },
        { type: 'code', language: 'typescript', value: '// codegen.ts\nconst config: CodegenConfig = {\n  generates: {\n    \'src/generated/graphql.ts\': {\n      plugins: [\'typescript\', \'typescript-operations\'],\n      config: {\n        // Маппинг кастомных скаляров на TypeScript типы\n        scalars: {\n          DateTime: \'string\',\n          JSON: \'Record<string, unknown>\',\n          Upload: \'File\',\n          BigInt: \'bigint\'\n        },\n        // Все enum как string union\n        enumsAsTypes: true,\n        // Добавить __typename везде\n        skipTypename: false\n      }\n    }\n  }\n};' },
        { type: 'tip', value: 'near-operation-file генерирует типы рядом с .graphql файлом — легко найти и импортировать. Идеально для больших проектов с fragment co-location.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Code Generator',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте GraphQL Code Generator для React проекта с типизированными хуками и кастомными скалярами.',
      requirements: [
        'Файл codegen.ts с настройкой schema, documents и generates',
        'Плагины: typescript, typescript-operations, typescript-react-apollo',
        'Маппинг скаляров DateTime -> string и JSON -> Record<string, unknown>',
        'GraphQL файл с query GetPosts и mutation CreatePost',
        'Пример использования сгенерированных хуков в компоненте',
        'Скрипт в package.json для генерации'
      ],
      hint: 'Установите @graphql-codegen/cli и плагины. Создайте codegen.ts с указанием источника схемы и выходного файла.',
      expectedOutput: 'Конфигурация codegen.ts, GraphQL операции и компонент с типизированными хуками.',
      solution: `// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>'
        },
        enumsAsConst: true,
        skipTypename: false
      }
    }
  }
};

export default config;

// src/graphql/posts.graphql
// query GetPosts($status: PostStatus) {
//   posts(status: $status) {
//     id
//     title
//     body
//     createdAt
//     author { id name avatar }
//   }
// }
//
// mutation CreatePost($input: CreatePostInput!) {
//   createPost(input: $input) {
//     id title body createdAt
//   }
// }

// src/components/PostList.tsx
import { useGetPostsQuery, useCreatePostMutation, PostStatus } from '../generated/graphql';

function PostList() {
  const { data, loading } = useGetPostsQuery({
    variables: { status: PostStatus.Published }
  });

  const [createPost] = useCreatePostMutation({
    refetchQueries: ['GetPosts']
  });

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {data?.posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>Автор: {post.author.name}</p>
        </article>
      ))}
    </div>
  );
}

// package.json: "codegen": "graphql-codegen", "codegen:watch": "graphql-codegen --watch"`,
      explanation: 'codegen.ts описывает источник схемы (URL сервера), расположение .graphql файлов и настройки генерации. Три плагина генерируют: базовые типы схемы, типы операций и React хуки. scalars маппит кастомные GraphQL скаляры на TypeScript типы. Сгенерированные хуки (useGetPostsQuery, useCreatePostMutation) полностью типизированы — IDE подсказывает переменные и поля данных.'
    }
  ]
}
