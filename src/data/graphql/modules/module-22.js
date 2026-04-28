export default {
  id: 22,
  title: 'GraphQL с TypeScript',
  description: 'Типизированные схемы и резолверы: code-first (Pothos, Nexus) и schema-first подходы с TypeScript.',
  lessons: [
    {
      id: 1,
      title: 'Schema-first vs Code-first',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует два подхода к созданию GraphQL схемы с TypeScript: schema-first (SDL + типизированные резолверы) и code-first (схема из TypeScript кода).' },
        { type: 'heading', value: 'Schema-first' },
        { type: 'code', language: 'typescript', value: '// Schema-first: пишем SDL, генерируем типы\nconst typeDefs = `#graphql\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n  }\n  type Query {\n    user(id: ID!): User\n  }\n`;\n\n// Типы генерируются GraphQL Code Generator\n// import { Resolvers } from \'./generated/types\';\nconst resolvers: Resolvers = {\n  Query: {\n    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } })\n    // TypeScript проверяет аргументы и возвращаемый тип!\n  }\n};' },
        { type: 'heading', value: 'Code-first' },
        { type: 'code', language: 'typescript', value: '// Code-first: пишем TypeScript, генерируется SDL\nimport SchemaBuilder from \'@pothos/core\';\n\nconst builder = new SchemaBuilder({});\n\nbuilder.objectType(\'User\', {\n  fields: (t) => ({\n    id: t.id({ resolve: (user) => user.id }),\n    name: t.string({ resolve: (user) => user.name }),\n    email: t.string({ resolve: (user) => user.email })\n  })\n});\n\nbuilder.queryType({\n  fields: (t) => ({\n    user: t.field({\n      type: \'User\',\n      nullable: true,\n      args: { id: t.arg.id({ required: true }) },\n      resolve: (_, { id }, { db }) => db.user.findUnique({ where: { id } })\n    })\n  })\n});\n\nconst schema = builder.toSchema();' },
        { type: 'list', value: [
          'Schema-first: привычный SDL, Code Generator для типов, легче начать',
          'Code-first: полная типизация из коробки, схема генерируется из кода',
          'Schema-first подходит, если команда уже знает SDL',
          'Code-first подходит для новых TypeScript проектов'
        ] },
        { type: 'tip', value: 'Для большинства проектов рекомендуется schema-first + GraphQL Code Generator. Code-first (Pothos) — для тех, кто хочет максимальную типизацию без кодогенерации.' }
      ]
    },
    {
      id: 2,
      title: 'Типизация резолверов (Schema-first)',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL Code Generator с плагином typescript-resolvers генерирует типы для резолверов, обеспечивая полную типобезопасность.' },
        { type: 'heading', value: 'Настройка' },
        { type: 'code', language: 'typescript', value: '// codegen.ts\nconst config: CodegenConfig = {\n  schema: \'./src/schema/**/*.graphql\',\n  generates: {\n    \'src/generated/resolvers-types.ts\': {\n      plugins: [\'typescript\', \'typescript-resolvers\'],\n      config: {\n        // Маппинг моделей из БД на GraphQL типы\n        mappers: {\n          User: \'../models#UserModel\',\n          Post: \'../models#PostModel\'\n        },\n        // Тип контекста\n        contextType: \'../context#GraphQLContext\'\n      }\n    }\n  }\n};' },
        { type: 'heading', value: 'Типизированные резолверы' },
        { type: 'code', language: 'typescript', value: '// context.ts\nimport { PrismaClient } from \'@prisma/client\';\n\nexport interface GraphQLContext {\n  db: PrismaClient;\n  user: { id: string; role: string } | null;\n}\n\n// models.ts\nexport interface UserModel {\n  id: string;\n  name: string;\n  email: string;\n  passwordHash: string; // Есть в БД, но нет в GraphQL\n}\n\nexport interface PostModel {\n  id: string;\n  title: string;\n  body: string;\n  authorId: string; // В БД authorId, в GraphQL — author: User\n}\n\n// resolvers/user.ts\nimport { Resolvers } from \'../generated/resolvers-types\';\n\nexport const userResolvers: Resolvers = {\n  Query: {\n    user: async (_, { id }, { db }) => {\n      // TypeScript знает: id: string, db: PrismaClient\n      return db.user.findUnique({ where: { id } });\n      // Возвращаемый тип должен быть UserModel\n    },\n    me: (_, __, { user }) => {\n      // user типизирован из контекста\n      if (!user) throw new Error(\'Not authenticated\');\n      return user;\n    }\n  },\n  User: {\n    // parent типизирован как UserModel (из mappers)\n    // Поэтому TypeScript знает, что parent.passwordHash существует\n    // но его нет в GraphQL типе User\n  }\n};' },
        { type: 'note', value: 'mappers связывают GraphQL типы с моделями данных. Это решает проблему несовпадения: в БД authorId, а в GraphQL — поле author: User.' }
      ]
    },
    {
      id: 3,
      title: 'Pothos (Code-first)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pothos — TypeScript-first GraphQL schema builder. Схема строится из TypeScript кода с полной типизацией без кодогенерации.' },
        { type: 'heading', value: 'Настройка Pothos' },
        { type: 'code', language: 'bash', value: 'npm install @pothos/core @pothos/plugin-prisma' },
        { type: 'code', language: 'typescript', value: '// builder.ts\nimport SchemaBuilder from \'@pothos/core\';\nimport PrismaPlugin from \'@pothos/plugin-prisma\';\nimport type PrismaTypes from \'@pothos/plugin-prisma/generated\';\nimport { prisma } from \'./db\';\n\nconst builder = new SchemaBuilder<{\n  PrismaTypes: PrismaTypes;\n  Context: {\n    user: { id: string; role: string } | null;\n  };\n}>({\n  plugins: [PrismaPlugin],\n  prisma: { client: prisma }\n});\n\nexport { builder };' },
        { type: 'heading', value: 'Определение типов' },
        { type: 'code', language: 'typescript', value: '// types/user.ts\nimport { builder } from \'../builder\';\n\nbuilder.prismaObject(\'User\', {\n  fields: (t) => ({\n    id: t.exposeID(\'id\'),\n    name: t.exposeString(\'name\'),\n    email: t.exposeString(\'email\'),\n    // Связь с постами — Pothos сам сгенерирует резолвер\n    posts: t.relation(\'posts\'),\n    // Вычисляемое поле\n    postCount: t.int({\n      resolve: async (user, _, { prisma }) => {\n        return prisma.post.count({ where: { authorId: user.id } });\n      }\n    })\n  })\n});\n\n// types/post.ts\nbuilder.prismaObject(\'Post\', {\n  fields: (t) => ({\n    id: t.exposeID(\'id\'),\n    title: t.exposeString(\'title\'),\n    body: t.exposeString(\'body\'),\n    author: t.relation(\'author\'),\n    createdAt: t.expose(\'createdAt\', { type: \'DateTime\' })\n  })\n});\n\n// types/query.ts\nbuilder.queryType({\n  fields: (t) => ({\n    users: t.prismaField({\n      type: [\'User\'],\n      resolve: (query) => prisma.user.findMany({ ...query })\n    }),\n    post: t.prismaField({\n      type: \'Post\',\n      nullable: true,\n      args: { id: t.arg.id({ required: true }) },\n      resolve: (query, _, { id }) =>\n        prisma.post.findUnique({ ...query, where: { id } })\n    })\n  })\n});\n\nconst schema = builder.toSchema();' },
        { type: 'tip', value: 'Pothos + Prisma — мощная комбинация. Pothos автоматически генерирует резолверы для связей и оптимизирует SQL запросы через query parameter.' }
      ]
    },
    {
      id: 4,
      title: 'TypeGraphQL (декоратор подход)',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeGraphQL использует декораторы TypeScript для определения схемы. Каждый тип — класс с декораторами @ObjectType, @Field, @Resolver.' },
        { type: 'heading', value: 'Определение типов' },
        { type: 'code', language: 'typescript', value: 'import {\n  ObjectType, Field, ID, InputType, Resolver, Query, Mutation, Arg, Ctx\n} from \'type-graphql\';\n\n@ObjectType()\nclass User {\n  @Field(() => ID)\n  id: string;\n\n  @Field()\n  name: string;\n\n  @Field()\n  email: string;\n\n  @Field(() => [Post])\n  posts: Post[];\n}\n\n@InputType()\nclass CreateUserInput {\n  @Field()\n  name: string;\n\n  @Field()\n  email: string;\n\n  @Field()\n  password: string;\n}' },
        { type: 'heading', value: 'Резолверы' },
        { type: 'code', language: 'typescript', value: '@Resolver(() => User)\nclass UserResolver {\n  @Query(() => [User])\n  async users(@Ctx() ctx: Context): Promise<User[]> {\n    return ctx.db.user.findMany();\n  }\n\n  @Query(() => User, { nullable: true })\n  async user(\n    @Arg(\'id\', () => ID) id: string,\n    @Ctx() ctx: Context\n  ): Promise<User | null> {\n    return ctx.db.user.findUnique({ where: { id } });\n  }\n\n  @Mutation(() => User)\n  async createUser(\n    @Arg(\'input\') input: CreateUserInput,\n    @Ctx() ctx: Context\n  ): Promise<User> {\n    return ctx.db.user.create({ data: input });\n  }\n}\n\n// Создание схемы\nimport { buildSchema } from \'type-graphql\';\n\nconst schema = await buildSchema({\n  resolvers: [UserResolver, PostResolver]\n});' },
        { type: 'note', value: 'TypeGraphQL требует experimentalDecorators и emitDecoratorMetadata в tsconfig. Это ограничивает совместимость с некоторыми инструментами.' }
      ]
    },
    {
      id: 5,
      title: 'Типизация контекста и утилиты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная типизация контекста обеспечивает type-safety во всех резолверах. Рассмотрим паттерны и утилиты.' },
        { type: 'heading', value: 'Типизированный контекст' },
        { type: 'code', language: 'typescript', value: '// types/context.ts\nimport { PrismaClient } from \'@prisma/client\';\nimport DataLoader from \'dataloader\';\n\ninterface UserPayload {\n  userId: string;\n  role: \'ADMIN\' | \'USER\';\n}\n\nexport interface GraphQLContext {\n  db: PrismaClient;\n  user: UserPayload | null;\n  loaders: ReturnType<typeof createLoaders>;\n}\n\n// Типобезопасная функция requireAuth\nexport function requireAuth(ctx: GraphQLContext): UserPayload {\n  if (!ctx.user) {\n    throw new GraphQLError(\'Not authenticated\', {\n      extensions: { code: \'UNAUTHENTICATED\' }\n    });\n  }\n  return ctx.user;\n}\n\nexport function requireRole(\n  ctx: GraphQLContext,\n  roles: UserPayload[\'role\'][]\n): UserPayload {\n  const user = requireAuth(ctx);\n  if (!roles.includes(user.role)) {\n    throw new GraphQLError(\'Forbidden\', {\n      extensions: { code: \'FORBIDDEN\' }\n    });\n  }\n  return user;\n}' },
        { type: 'heading', value: 'Generic резолверы' },
        { type: 'code', language: 'typescript', value: '// Типобезопасный helper для CRUD\ntype CRUDResolvers<T, CreateInput, UpdateInput> = {\n  Query: {\n    findById: (id: string) => Promise<T | null>;\n    findAll: () => Promise<T[]>;\n  };\n  Mutation: {\n    create: (input: CreateInput) => Promise<T>;\n    update: (id: string, input: UpdateInput) => Promise<T>;\n    delete: (id: string) => Promise<boolean>;\n  };\n};\n\n// Использование\nfunction createCRUDResolvers<T>(\n  model: any\n): CRUDResolvers<T, any, any> {\n  return {\n    Query: {\n      findById: (id) => model.findUnique({ where: { id } }),\n      findAll: () => model.findMany()\n    },\n    Mutation: {\n      create: (input) => model.create({ data: input }),\n      update: (id, input) => model.update({ where: { id }, data: input }),\n      delete: async (id) => {\n        await model.delete({ where: { id } });\n        return true;\n      }\n    }\n  };\n}' },
        { type: 'tip', value: 'Типизированный контекст — основа type-safety. Все резолверы получают ctx с правильными типами для db, user и loaders.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: TypeScript GraphQL API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типизированный GraphQL API на TypeScript с code-first подходом, типизированным контекстом и проверкой ролей.',
      requirements: [
        'Интерфейс GraphQLContext с db, user и loaders',
        'Функция requireAuth(ctx) с типизированным возвращаемым значением',
        'Тип User с полями id, name, email, role (enum)',
        'Типизированные резолверы: Query.me, Query.users (только ADMIN), Mutation.updateProfile',
        'Enum Role как const object (ADMIN, USER)',
        'Все аргументы и возвращаемые значения типизированы'
      ],
      hint: 'Используйте interface для контекста и типов. Enum можно определить как const object. Функция requireAuth возвращает non-null user.',
      expectedOutput: 'Полностью типизированный GraphQL API с контекстом, авторизацией и резолверами.',
      solution: `// types.ts
export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;
export type Role = typeof Role[keyof typeof Role];

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
}

export interface GraphQLContext {
  db: {
    user: {
      findUnique: (args: { where: { id: string } }) => Promise<UserModel | null>;
      findMany: () => Promise<UserModel[]>;
      update: (args: { where: { id: string }; data: Partial<UserModel> }) => Promise<UserModel>;
    };
  };
  user: { userId: string; role: Role } | null;
}

// auth.ts
import { GraphQLError } from 'graphql';

export function requireAuth(ctx: GraphQLContext): { userId: string; role: Role } {
  if (!ctx.user) {
    throw new GraphQLError('Не авторизован', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return ctx.user;
}

export function requireRole(ctx: GraphQLContext, roles: Role[]): { userId: string; role: Role } {
  const user = requireAuth(ctx);
  if (!roles.includes(user.role)) {
    throw new GraphQLError('Недостаточно прав', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
  return user;
}

// resolvers.ts
interface UpdateProfileInput {
  name?: string;
  email?: string;
}

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: GraphQLContext): Promise<UserModel> => {
      const { userId } = requireAuth(ctx);
      const user = await ctx.db.user.findUnique({ where: { id: userId } });
      if (!user) throw new GraphQLError('Пользователь не найден');
      return user;
    },

    users: async (_: unknown, __: unknown, ctx: GraphQLContext): Promise<UserModel[]> => {
      requireRole(ctx, [Role.ADMIN]);
      return ctx.db.user.findMany();
    }
  },

  Mutation: {
    updateProfile: async (
      _: unknown,
      { input }: { input: UpdateProfileInput },
      ctx: GraphQLContext
    ): Promise<UserModel> => {
      const { userId } = requireAuth(ctx);
      return ctx.db.user.update({
        where: { id: userId },
        data: input
      });
    }
  }
};`,
      explanation: 'GraphQLContext типизирует db, user и все зависимости. requireAuth возвращает non-null user payload — TypeScript знает, что после вызова user точно существует. Role определён как const object для type-safe enum. Все резолверы типизированы: аргументы, контекст, возвращаемые значения. UserModel содержит passwordHash (есть в БД), но его нет в GraphQL типе — mappers решают это несоответствие.'
    }
  ]
}
