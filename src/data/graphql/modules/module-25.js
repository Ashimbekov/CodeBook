export default {
  id: 25,
  title: 'Практический проект: Full-Stack GraphQL',
  description: 'Создание полноценного приложения: сервер, клиент, аутентификация, CRUD, подписки и деплой.',
  lessons: [
    {
      id: 1,
      title: 'Архитектура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создадим полноценное приложение для управления задачами (Task Manager) с GraphQL. Архитектура: Apollo Server + Prisma + PostgreSQL на бэкенде, React + Apollo Client на фронтенде.' },
        { type: 'heading', value: 'Стек технологий' },
        { type: 'list', value: [
          'Backend: Apollo Server 4 + Express + Prisma + PostgreSQL',
          'Frontend: React + Apollo Client + TypeScript',
          'Auth: JWT (access + refresh tokens)',
          'Real-time: GraphQL Subscriptions через WebSocket',
          'Codegen: GraphQL Code Generator для типов',
          'Deploy: Docker + docker-compose'
        ] },
        { type: 'heading', value: 'Структура монорепо' },
        { type: 'code', language: 'bash', value: 'task-manager/\n├── packages/\n│   ├── server/\n│   │   ├── src/\n│   │   │   ├── index.ts          # Точка входа\n│   │   │   ├── schema/\n│   │   │   │   ├── typeDefs/      # SDL схема\n│   │   │   │   └── resolvers/     # Резолверы\n│   │   │   ├── services/          # Бизнес-логика\n│   │   │   ├── middleware/        # Auth middleware\n│   │   │   └── utils/             # Утилиты\n│   │   ├── prisma/\n│   │   │   └── schema.prisma      # БД схема\n│   │   └── package.json\n│   └── client/\n│       ├── src/\n│       │   ├── App.tsx\n│       │   ├── graphql/           # .graphql операции\n│       │   ├── generated/         # Codegen типы\n│       │   ├── components/        # React компоненты\n│       │   ├── pages/             # Страницы\n│       │   └── hooks/             # Кастомные хуки\n│       ├── codegen.ts\n│       └── package.json\n├── docker-compose.yml\n└── package.json' },
        { type: 'tip', value: 'Монорепо позволяет шарить типы и конфиги между сервером и клиентом. Turborepo или npm workspaces упрощают управление зависимостями.' }
      ]
    },
    {
      id: 2,
      title: 'Серверная часть: схема и резолверы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Определим полную GraphQL схему Task Manager: пользователи, проекты, задачи с статусами, приоритетами и назначениями.' },
        { type: 'heading', value: 'Prisma схема' },
        { type: 'code', language: 'javascript', value: '// prisma/schema.prisma\n// model User {\n//   id        String   @id @default(cuid())\n//   name      String\n//   email     String   @unique\n//   password  String\n//   role      Role     @default(USER)\n//   tasks     Task[]   @relation("assignee")\n//   projects  Project[] @relation("ProjectMembers")\n//   createdAt DateTime @default(now())\n// }\n//\n// model Project {\n//   id       String @id @default(cuid())\n//   name     String\n//   tasks    Task[]\n//   members  User[] @relation("ProjectMembers")\n//   ownerId  String\n// }\n//\n// model Task {\n//   id          String     @id @default(cuid())\n//   title       String\n//   description String?\n//   status      TaskStatus @default(TODO)\n//   priority    Priority   @default(MEDIUM)\n//   project     Project    @relation(fields: [projectId], references: [id])\n//   projectId   String\n//   assignee    User?      @relation("assignee", fields: [assigneeId], references: [id])\n//   assigneeId  String?\n//   dueDate     DateTime?\n//   createdAt   DateTime   @default(now())\n//   updatedAt   DateTime   @updatedAt\n// }\n//\n// enum Role { ADMIN USER }\n// enum TaskStatus { TODO IN_PROGRESS REVIEW DONE }\n// enum Priority { LOW MEDIUM HIGH URGENT }' },
        { type: 'heading', value: 'GraphQL схема' },
        { type: 'code', language: 'graphql', value: 'scalar DateTime\n\nenum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE }\nenum Priority { LOW, MEDIUM, HIGH, URGENT }\nenum Role { ADMIN, USER }\n\ntype User {\n  id: ID!\n  name: String!\n  email: String!\n  role: Role!\n  tasks: [Task!]!\n  projects: [Project!]!\n}\n\ntype Project {\n  id: ID!\n  name: String!\n  owner: User!\n  members: [User!]!\n  tasks(status: TaskStatus): [Task!]!\n  taskCount: Int!\n}\n\ntype Task {\n  id: ID!\n  title: String!\n  description: String\n  status: TaskStatus!\n  priority: Priority!\n  project: Project!\n  assignee: User\n  dueDate: DateTime\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}\n\ntype AuthPayload {\n  token: String!\n  user: User!\n}\n\ninput CreateTaskInput {\n  title: String!\n  description: String\n  priority: Priority = MEDIUM\n  projectId: ID!\n  assigneeId: ID\n  dueDate: DateTime\n}\n\ninput UpdateTaskInput {\n  title: String\n  description: String\n  status: TaskStatus\n  priority: Priority\n  assigneeId: ID\n  dueDate: DateTime\n}\n\ntype Query {\n  me: User!\n  project(id: ID!): Project\n  myProjects: [Project!]!\n  task(id: ID!): Task\n  tasks(projectId: ID!, status: TaskStatus): [Task!]!\n}\n\ntype Mutation {\n  register(name: String!, email: String!, password: String!): AuthPayload!\n  login(email: String!, password: String!): AuthPayload!\n  createProject(name: String!): Project!\n  createTask(input: CreateTaskInput!): Task!\n  updateTask(id: ID!, input: UpdateTaskInput!): Task!\n  deleteTask(id: ID!): Boolean!\n}\n\ntype Subscription {\n  taskUpdated(projectId: ID!): Task!\n}' },
        { type: 'note', value: 'Схема отражает бизнес-домен: проекты содержат задачи, задачи назначены пользователям. Подписка taskUpdated уведомляет о изменениях в проекте.' }
      ]
    },
    {
      id: 3,
      title: 'Резолверы и бизнес-логика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализуем ключевые резолверы: аутентификация, CRUD задач, подписки на обновления и проверки доступа.' },
        { type: 'heading', value: 'Аутентификация' },
        { type: 'code', language: 'javascript', value: 'import bcrypt from \'bcryptjs\';\nimport jwt from \'jsonwebtoken\';\n\nconst authResolvers = {\n  Mutation: {\n    register: async (_, { name, email, password }, { db }) => {\n      const exists = await db.user.findUnique({ where: { email } });\n      if (exists) throw new GraphQLError(\'Email уже зарегистрирован\');\n\n      const user = await db.user.create({\n        data: {\n          name,\n          email,\n          password: await bcrypt.hash(password, 12)\n        }\n      });\n\n      return {\n        token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: \'7d\' }),\n        user\n      };\n    },\n\n    login: async (_, { email, password }, { db }) => {\n      const user = await db.user.findUnique({ where: { email } });\n      if (!user || !(await bcrypt.compare(password, user.password))) {\n        throw new GraphQLError(\'Неверные учётные данные\');\n      }\n\n      return {\n        token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: \'7d\' }),\n        user\n      };\n    }\n  }\n};' },
        { type: 'heading', value: 'CRUD задач с подписками' },
        { type: 'code', language: 'javascript', value: 'import { PubSub } from \'graphql-subscriptions\';\nconst pubsub = new PubSub();\n\nconst taskResolvers = {\n  Query: {\n    tasks: async (_, { projectId, status }, { db, user }) => {\n      requireAuth(user);\n      const where = { projectId };\n      if (status) where.status = status;\n      return db.task.findMany({\n        where,\n        orderBy: { createdAt: \'desc\' }\n      });\n    }\n  },\n\n  Mutation: {\n    createTask: async (_, { input }, { db, user }) => {\n      requireAuth(user);\n      const task = await db.task.create({\n        data: { ...input },\n        include: { project: true, assignee: true }\n      });\n\n      pubsub.publish(`TASK_UPDATED.${task.projectId}`, {\n        taskUpdated: task\n      });\n\n      return task;\n    },\n\n    updateTask: async (_, { id, input }, { db, user }) => {\n      requireAuth(user);\n      const task = await db.task.update({\n        where: { id },\n        data: { ...input },\n        include: { project: true, assignee: true }\n      });\n\n      pubsub.publish(`TASK_UPDATED.${task.projectId}`, {\n        taskUpdated: task\n      });\n\n      return task;\n    },\n\n    deleteTask: async (_, { id }, { db, user }) => {\n      requireAuth(user);\n      await db.task.delete({ where: { id } });\n      return true;\n    }\n  },\n\n  Subscription: {\n    taskUpdated: {\n      subscribe: (_, { projectId }) => {\n        return pubsub.asyncIterableIterator(`TASK_UPDATED.${projectId}`);\n      }\n    }\n  }\n};' },
        { type: 'tip', value: 'PubSub публикует события при создании/обновлении задач. Все подписчики проекта получают обновления в реальном времени.' }
      ]
    },
    {
      id: 4,
      title: 'Клиентская часть: React + Apollo',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фронтенд на React с Apollo Client: авторизация, список задач, Kanban-доска с drag-and-drop и real-time обновления.' },
        { type: 'heading', value: 'Настройка Apollo Client' },
        { type: 'code', language: 'javascript', value: 'import { ApolloClient, InMemoryCache, split, HttpLink, from } from \'@apollo/client\';\nimport { setContext } from \'@apollo/client/link/context\';\nimport { GraphQLWsLink } from \'@apollo/client/link/subscriptions\';\nimport { createClient } from \'graphql-ws\';\nimport { getMainDefinition } from \'@apollo/client/utilities\';\n\nconst httpLink = new HttpLink({ uri: \'http://localhost:4000/graphql\' });\n\nconst authLink = setContext((_, { headers }) => ({\n  headers: {\n    ...headers,\n    authorization: localStorage.getItem(\'token\')\n      ? `Bearer ${localStorage.getItem(\'token\')}` : \'\'\n  }\n}));\n\nconst wsLink = new GraphQLWsLink(createClient({\n  url: \'ws://localhost:4000/graphql\',\n  connectionParams: { authToken: localStorage.getItem(\'token\') }\n}));\n\nconst splitLink = split(\n  ({ query }) => {\n    const def = getMainDefinition(query);\n    return def.kind === \'OperationDefinition\' && def.operation === \'subscription\';\n  },\n  wsLink,\n  from([authLink, httpLink])\n);\n\nexport const client = new ApolloClient({\n  link: splitLink,\n  cache: new InMemoryCache()\n});' },
        { type: 'heading', value: 'Kanban доска задач' },
        { type: 'code', language: 'javascript', value: 'import { useQuery, useMutation, useSubscription } from \'@apollo/client\';\n\nconst TASKS_QUERY = gql`\n  query GetTasks($projectId: ID!) {\n    tasks(projectId: $projectId) {\n      id title description status priority\n      assignee { name avatar }\n    }\n  }\n`;\n\nconst UPDATE_TASK = gql`\n  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {\n    updateTask(id: $id, input: $input) {\n      id status\n    }\n  }\n`;\n\nconst TASK_SUBSCRIPTION = gql`\n  subscription OnTaskUpdated($projectId: ID!) {\n    taskUpdated(projectId: $projectId) {\n      id title status priority\n      assignee { name }\n    }\n  }\n`;\n\nfunction KanbanBoard({ projectId }) {\n  const { data, loading } = useQuery(TASKS_QUERY, {\n    variables: { projectId }\n  });\n\n  const [updateTask] = useMutation(UPDATE_TASK);\n\n  // Real-time обновления\n  useSubscription(TASK_SUBSCRIPTION, {\n    variables: { projectId }\n  });\n\n  const columns = [\'TODO\', \'IN_PROGRESS\', \'REVIEW\', \'DONE\'];\n\n  const handleDrop = (taskId, newStatus) => {\n    updateTask({\n      variables: { id: taskId, input: { status: newStatus } },\n      optimisticResponse: {\n        __typename: \'Mutation\',\n        updateTask: { __typename: \'Task\', id: taskId, status: newStatus }\n      }\n    });\n  };\n\n  if (loading) return <Spinner />;\n\n  return (\n    <div className="kanban">\n      {columns.map(status => (\n        <Column key={status} status={status}\n          tasks={data.tasks.filter(t => t.status === status)}\n          onDrop={handleDrop}\n        />\n      ))}\n    </div>\n  );\n}' },
        { type: 'note', value: 'Подписка автоматически обновляет кэш Apollo при изменении задачи другим пользователем. Оптимистичный ответ мгновенно перемещает карточку при drag-and-drop.' }
      ]
    },
    {
      id: 5,
      title: 'Docker и деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Упакуем приложение в Docker и настроим production окружение с nginx, SSL и мониторингом.' },
        { type: 'heading', value: 'Dockerfile для сервера' },
        { type: 'code', language: 'bash', value: '# packages/server/Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nCOPY prisma ./prisma/\nRUN npm ci\nCOPY . .\nRUN npm run build\nRUN npx prisma generate\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/prisma ./prisma\nCOPY --from=builder /app/package.json ./\nEXPOSE 4000\nCMD ["node", "dist/index.js"]' },
        { type: 'heading', value: 'docker-compose.yml' },
        { type: 'code', language: 'bash', value: '# docker-compose.yml\n# version: "3.8"\n# services:\n#   postgres:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_DB: taskmanager\n#       POSTGRES_USER: postgres\n#       POSTGRES_PASSWORD: ${DB_PASSWORD}\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#\n#   server:\n#     build: ./packages/server\n#     ports:\n#       - "4000:4000"\n#     environment:\n#       DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/taskmanager\n#       JWT_SECRET: ${JWT_SECRET}\n#       NODE_ENV: production\n#     depends_on:\n#       - postgres\n#\n#   client:\n#     build: ./packages/client\n#     ports:\n#       - "3000:80"\n#\n# volumes:\n#   postgres_data:' },
        { type: 'heading', value: 'Production checklist' },
        { type: 'list', value: [
          'Отключить introspection (introspection: false)',
          'Настроить CORS (разрешить только ваш домен)',
          'Включить depth limit и query complexity',
          'Настроить rate limiting',
          'Использовать HTTPS (SSL/TLS)',
          'Настроить логирование и мониторинг',
          'Настроить database migrations (prisma migrate deploy)',
          'Настроить health check endpoint',
          'Использовать environment variables для секретов'
        ] },
        { type: 'tip', value: 'Никогда не храните секреты (JWT_SECRET, DB_PASSWORD) в коде. Используйте переменные окружения и .env файлы (не коммитьте их в git).' }
      ]
    },
    {
      id: 6,
      title: 'Итоговый обзор курса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поздравляем! Вы прошли полный курс GraphQL. Давайте подведём итоги и наметим пути дальнейшего развития.' },
        { type: 'heading', value: 'Что вы освоили' },
        { type: 'list', value: [
          'Основы GraphQL: схемы, типы, запросы, мутации, подписки',
          'Серверная часть: Apollo Server, резолверы, DataLoader, аутентификация',
          'Клиентская часть: Apollo Client, кэширование, state management, хуки',
          'Продвинутые темы: Federation, Code Generator, TypeScript интеграция',
          'Оптимизация: performance, caching, persisted queries',
          'Безопасность: depth limiting, rate limiting, introspection control',
          'Тестирование: unit, интеграционные, schema тесты',
          'Инструменты: Hasura, PostGraphile, Pothos, TypeGraphQL'
        ] },
        { type: 'heading', value: 'Дальнейшее развитие' },
        { type: 'list', value: [
          'Изучите Apollo Studio для мониторинга production API',
          'Попробуйте GraphQL Mesh для интеграции REST/gRPC/SOAP',
          'Изучите Relay — Facebook-клиент с автоматической оптимизацией',
          'Познакомьтесь с Stellate (GraphCDN) для edge caching',
          'Изучите GraphQL over HTTP specification',
          'Внедрите CI/CD с schema checks и breaking change detection'
        ] },
        { type: 'note', value: 'GraphQL — мощный инструмент, который продолжает развиваться. Присоединяйтесь к сообществу: graphql.org, Apollo Blog, The Guild Blog. Практикуйтесь, создавая реальные проекты!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Full-Stack проект',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полную архитектуру Full-Stack GraphQL приложения: серверную схему, резолверы, клиентские запросы и компоненты.',
      requirements: [
        'GraphQL схема для Task Manager: типы User, Project, Task с enum статусами и приоритетами',
        'Резолверы: register/login с JWT, CRUD задач, подписка taskUpdated',
        'Настройка Apollo Client с authLink, errorLink и wsLink',
        'React компонент TaskBoard с useQuery для загрузки задач',
        'useMutation для создания задачи с оптимистичным обновлением',
        'useSubscription для real-time обновлений',
        'DataLoader для оптимизации загрузки assignee задач'
      ],
      hint: 'Разделите код на schema, resolvers, client. Используйте PubSub для подписок. authLink добавляет токен из localStorage. optimisticResponse для мгновенного UI.',
      expectedOutput: 'Полная архитектура: схема, резолверы с подписками, клиент с real-time обновлениями и оптимистичным UI.',
      solution: `// === СЕРВЕРНАЯ ЧАСТЬ ===

// Схема (server/schema.graphql)
// enum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE }
// enum Priority { LOW, MEDIUM, HIGH, URGENT }
// type Task { id: ID!, title: String!, status: TaskStatus!, priority: Priority!, assignee: User, project: Project! }
// type Query { tasks(projectId: ID!): [Task!]! }
// type Mutation { createTask(input: CreateTaskInput!): Task!, updateTask(id: ID!, input: UpdateTaskInput!): Task! }
// type Subscription { taskUpdated(projectId: ID!): Task! }

// Резолверы
import { PubSub } from 'graphql-subscriptions';
import DataLoader from 'dataloader';

const pubsub = new PubSub();

function createLoaders(db) {
  return {
    userById: new DataLoader(async (ids) => {
      const users = await db.user.findMany({ where: { id: { in: [...ids] } } });
      const map = new Map(users.map(u => [u.id, u]));
      return ids.map(id => map.get(id) || null);
    })
  };
}

const resolvers = {
  Query: {
    tasks: (_, { projectId }, { db, user }) => {
      requireAuth(user);
      return db.task.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
    }
  },
  Mutation: {
    createTask: async (_, { input }, { db, user }) => {
      requireAuth(user);
      const task = await db.task.create({
        data: input,
        include: { assignee: true, project: true }
      });
      pubsub.publish(\`TASK.\${task.projectId}\`, { taskUpdated: task });
      return task;
    },
    updateTask: async (_, { id, input }, { db, user }) => {
      requireAuth(user);
      const task = await db.task.update({
        where: { id },
        data: input,
        include: { assignee: true, project: true }
      });
      pubsub.publish(\`TASK.\${task.projectId}\`, { taskUpdated: task });
      return task;
    }
  },
  Subscription: {
    taskUpdated: {
      subscribe: (_, { projectId }) =>
        pubsub.asyncIterableIterator(\`TASK.\${projectId}\`)
    }
  },
  Task: {
    assignee: (task, _, { loaders }) =>
      task.assigneeId ? loaders.userById.load(task.assigneeId) : null
  }
};

// === КЛИЕНТСКАЯ ЧАСТЬ ===
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';

const GET_TASKS = gql\`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) { id title status priority assignee { id name } }
  }
\`;

const CREATE_TASK = gql\`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) { id title status priority }
  }
\`;

const TASK_SUB = gql\`
  subscription OnTask($projectId: ID!) {
    taskUpdated(projectId: $projectId) { id title status priority assignee { name } }
  }
\`;

function TaskBoard({ projectId }) {
  const { data, loading } = useQuery(GET_TASKS, { variables: { projectId } });
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { projectId } }]
  });

  useSubscription(TASK_SUB, { variables: { projectId } });

  if (loading) return <p>Загрузка...</p>;

  const columns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {columns.map(status => (
        <div key={status}>
          <h3>{status}</h3>
          {data?.tasks.filter(t => t.status === status).map(task => (
            <div key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.priority}</span>
              {task.assignee && <small>{task.assignee.name}</small>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}`,
      explanation: 'Full-Stack архитектура: сервер определяет схему с enum для статусов и приоритетов. Резолверы CRUD публикуют события через PubSub. DataLoader оптимизирует загрузку assignee. Клиент настроен с authLink (JWT), wsLink (подписки) и errorLink. TaskBoard загружает задачи через useQuery, подписывается на обновления через useSubscription. При создании/обновлении задачи другим пользователем все клиенты получают обновление в реальном времени.'
    }
  ]
}
