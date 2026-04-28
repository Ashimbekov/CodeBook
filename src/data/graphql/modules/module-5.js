export default {
  id: 5,
  title: 'Подписки (Subscriptions)',
  description: 'Real-time данные через подписки: WebSocket, PubSub, фильтрация событий и практические сценарии.',
  lessons: [
    {
      id: 1,
      title: 'Что такое подписки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подписки (Subscriptions) — третий тип операций в GraphQL. В отличие от Query и Mutation, подписки устанавливают долгоживущее соединение и получают данные в реальном времени при возникновении событий.' },
        { type: 'heading', value: 'Query vs Mutation vs Subscription' },
        { type: 'list', value: [
          'Query — одноразовый запрос данных (клиент спрашивает, сервер отвечает)',
          'Mutation — одноразовое изменение данных (клиент отправляет, сервер выполняет)',
          'Subscription — постоянное соединение (сервер уведомляет клиента о событиях)'
        ] },
        { type: 'heading', value: 'Определение подписок в схеме' },
        { type: 'code', language: 'graphql', value: 'type Subscription {\n  # Новое сообщение в чате\n  messageAdded(chatId: ID!): Message!\n\n  # Новый заказ для ресторана\n  orderCreated(restaurantId: ID!): Order!\n\n  # Обновление статуса заказа\n  orderStatusChanged(orderId: ID!): Order!\n\n  # Пользователь вошёл/вышел\n  userPresenceChanged: UserPresence!\n\n  # Уведомление для конкретного пользователя\n  notificationReceived(userId: ID!): Notification!\n}\n\n# Использование:\nsubscription OnNewMessage($chatId: ID!) {\n  messageAdded(chatId: $chatId) {\n    id\n    text\n    sender {\n      name\n      avatar\n    }\n    createdAt\n  }\n}' },
        { type: 'tip', value: 'Подписки используют WebSocket протокол (ws:// или wss://). Это позволяет серверу отправлять данные клиенту без запроса — идеально для чатов, уведомлений, live-данных.' }
      ]
    },
    {
      id: 2,
      title: 'PubSub и серверная реализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'PubSub (Publish-Subscribe) — паттерн, лежащий в основе подписок. Мутации публикуют события, а подписки слушают их. Рассмотрим реализацию на Apollo Server.' },
        { type: 'heading', value: 'Настройка PubSub' },
        { type: 'code', language: 'javascript', value: '// Установка\n// npm install graphql-subscriptions graphql-ws ws\n\nimport { PubSub } from \'graphql-subscriptions\';\n\nconst pubsub = new PubSub();\n\n// Константы для событий\nconst EVENTS = {\n  MESSAGE_ADDED: \'MESSAGE_ADDED\',\n  ORDER_CREATED: \'ORDER_CREATED\',\n  ORDER_STATUS_CHANGED: \'ORDER_STATUS_CHANGED\'\n};' },
        { type: 'heading', value: 'Резолверы подписок' },
        { type: 'code', language: 'javascript', value: 'const resolvers = {\n  Subscription: {\n    messageAdded: {\n      // subscribe возвращает AsyncIterator\n      subscribe: (_, { chatId }) => {\n        return pubsub.asyncIterableIterator(\n          `${EVENTS.MESSAGE_ADDED}.${chatId}`\n        );\n      }\n    },\n    orderStatusChanged: {\n      subscribe: (_, { orderId }) => {\n        return pubsub.asyncIterableIterator(\n          `${EVENTS.ORDER_STATUS_CHANGED}.${orderId}`\n        );\n      }\n    }\n  },\n\n  Mutation: {\n    sendMessage: async (_, { input }, { db, user }) => {\n      const message = await db.message.create({\n        data: {\n          text: input.text,\n          chatId: input.chatId,\n          senderId: user.id\n        },\n        include: { sender: true }\n      });\n\n      // Публикуем событие — все подписчики получат данные\n      pubsub.publish(`${EVENTS.MESSAGE_ADDED}.${input.chatId}`, {\n        messageAdded: message\n      });\n\n      return message;\n    }\n  }\n};' },
        { type: 'note', value: 'PubSub из graphql-subscriptions хранит подписки в памяти и подходит только для одного сервера. В production используйте Redis PubSub, Kafka или другой брокер сообщений.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка WebSocket сервера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для подписок нужен отдельный WebSocket сервер. Apollo Server 4 использует библиотеку graphql-ws для WebSocket транспорта.' },
        { type: 'heading', value: 'Полная настройка сервера с подписками' },
        { type: 'code', language: 'javascript', value: 'import { ApolloServer } from \'@apollo/server\';\nimport { expressMiddleware } from \'@apollo/server/express4\';\nimport { createServer } from \'http\';\nimport express from \'express\';\nimport { WebSocketServer } from \'ws\';\nimport { useServer } from \'graphql-ws/lib/use/ws\';\nimport { makeExecutableSchema } from \'@graphql-tools/schema\';\n\nconst app = express();\nconst httpServer = createServer(app);\n\n// Создаём схему\nconst schema = makeExecutableSchema({ typeDefs, resolvers });\n\n// WebSocket сервер для подписок\nconst wsServer = new WebSocketServer({\n  server: httpServer,\n  path: \'/graphql\'\n});\n\nconst serverCleanup = useServer(\n  {\n    schema,\n    // Аутентификация WebSocket соединения\n    context: async (ctx) => {\n      const token = ctx.connectionParams?.authToken;\n      const user = token ? await verifyToken(token) : null;\n      return { user };\n    },\n    // Вызывается при установке соединения\n    onConnect: async (ctx) => {\n      console.log(\'Клиент подключился\');\n    },\n    // Вызывается при закрытии\n    onDisconnect: async (ctx) => {\n      console.log(\'Клиент отключился\');\n    }\n  },\n  wsServer\n);\n\n// Apollo Server для Query/Mutation\nconst server = new ApolloServer({\n  schema,\n  plugins: [{\n    async serverWillStart() {\n      return {\n        async drainServer() {\n          await serverCleanup.dispose();\n        }\n      };\n    }\n  }]\n});\n\nawait server.start();\napp.use(\'/graphql\', express.json(), expressMiddleware(server));\nhttpServer.listen(4000);' },
        { type: 'tip', value: 'HTTP используется для Query и Mutation (порт 4000/graphql). WebSocket для Subscription (ws://localhost:4000/graphql). Оба работают на одном URL, но разных протоколах.' }
      ]
    },
    {
      id: 4,
      title: 'Фильтрация подписок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фильтрация позволяет подписчику получать только нужные события. Например, получать сообщения только из определённого чата или уведомления только для конкретного пользователя.' },
        { type: 'heading', value: 'withFilter' },
        { type: 'code', language: 'javascript', value: 'import { withFilter } from \'graphql-subscriptions\';\n\nconst resolvers = {\n  Subscription: {\n    // Без фильтрации — все получают все события\n    messageAdded: {\n      subscribe: () => pubsub.asyncIterableIterator(\'MESSAGE_ADDED\')\n    },\n\n    // С фильтрацией — только для нужного чата\n    messageAdded: {\n      subscribe: withFilter(\n        // Итератор событий\n        () => pubsub.asyncIterableIterator(\'MESSAGE_ADDED\'),\n        // Функция фильтрации: payload, variables\n        (payload, variables) => {\n          return payload.messageAdded.chatId === variables.chatId;\n        }\n      )\n    },\n\n    // Фильтрация по роли пользователя\n    orderCreated: {\n      subscribe: withFilter(\n        () => pubsub.asyncIterableIterator(\'ORDER_CREATED\'),\n        (payload, variables, context) => {\n          // Менеджер видит все заказы, курьер — только свои\n          if (context.user.role === \'MANAGER\') return true;\n          return payload.orderCreated.courierId === context.user.id;\n        }\n      )\n    }\n  }\n};' },
        { type: 'heading', value: 'Публикация событий из мутации' },
        { type: 'code', language: 'javascript', value: '// При публикации можно передать любые данные\nconst resolvers = {\n  Mutation: {\n    updateOrderStatus: async (_, { id, status }, { db }) => {\n      const order = await db.order.update({\n        where: { id },\n        data: { status },\n        include: { items: true, user: true }\n      });\n\n      // Уведомляем подписчиков\n      pubsub.publish(\'ORDER_STATUS_CHANGED\', {\n        orderStatusChanged: order\n      });\n\n      // Отправляем уведомление пользователю\n      pubsub.publish(\'NOTIFICATION\', {\n        notificationReceived: {\n          userId: order.userId,\n          type: \'ORDER_UPDATE\',\n          message: `Статус заказа #${id}: ${status}`\n        }\n      });\n\n      return order;\n    }\n  }\n};' },
        { type: 'note', value: 'Фильтрация выполняется на сервере — клиенту не приходят лишние данные. Это важно для производительности и безопасности.' }
      ]
    },
    {
      id: 5,
      title: 'Подписки на клиенте',
      type: 'theory',
      content: [
        { type: 'text', value: 'На клиенте подписки создаются через Apollo Client с WebSocket Link. Рассмотрим подключение и использование хука useSubscription.' },
        { type: 'heading', value: 'Настройка Apollo Client с подписками' },
        { type: 'code', language: 'javascript', value: 'import { ApolloClient, InMemoryCache, split, HttpLink } from \'@apollo/client\';\nimport { GraphQLWsLink } from \'@apollo/client/link/subscriptions\';\nimport { createClient } from \'graphql-ws\';\nimport { getMainDefinition } from \'@apollo/client/utilities\';\n\n// HTTP Link для Query/Mutation\nconst httpLink = new HttpLink({\n  uri: \'http://localhost:4000/graphql\'\n});\n\n// WebSocket Link для Subscription\nconst wsLink = new GraphQLWsLink(\n  createClient({\n    url: \'ws://localhost:4000/graphql\',\n    connectionParams: {\n      authToken: localStorage.getItem(\'token\')\n    }\n  })\n);\n\n// Split: Subscription -> WS, остальное -> HTTP\nconst splitLink = split(\n  ({ query }) => {\n    const definition = getMainDefinition(query);\n    return (\n      definition.kind === \'OperationDefinition\' &&\n      definition.operation === \'subscription\'\n    );\n  },\n  wsLink,\n  httpLink\n);\n\nconst client = new ApolloClient({\n  link: splitLink,\n  cache: new InMemoryCache()\n});' },
        { type: 'heading', value: 'Хук useSubscription' },
        { type: 'code', language: 'javascript', value: 'import { gql, useSubscription } from \'@apollo/client\';\n\nconst MESSAGE_SUBSCRIPTION = gql`\n  subscription OnMessageAdded($chatId: ID!) {\n    messageAdded(chatId: $chatId) {\n      id\n      text\n      sender {\n        name\n        avatar\n      }\n      createdAt\n    }\n  }\n`;\n\nfunction ChatMessages({ chatId }) {\n  const { data, loading, error } = useSubscription(\n    MESSAGE_SUBSCRIPTION,\n    { variables: { chatId } }\n  );\n\n  if (loading) return <p>Ожидание сообщений...</p>;\n  if (error) return <p>Ошибка: {error.message}</p>;\n\n  // data.messageAdded — последнее полученное сообщение\n  return (\n    <div className="new-message">\n      <strong>{data.messageAdded.sender.name}:</strong>\n      <span>{data.messageAdded.text}</span>\n    </div>\n  );\n}' },
        { type: 'tip', value: 'subscribeToMore — альтернативный способ. Он позволяет добавить подписку к существующему useQuery и автоматически обновлять кэш при получении событий.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чат с подписками',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте схему и резолверы для чата реального времени с подписками на новые сообщения и статус набора текста.',
      requirements: [
        'Тип Message: id, text, sender (User!), chatId (ID!), createdAt',
        'Подписка messageAdded с аргументом chatId для фильтрации',
        'Подписка typingStarted(chatId) — уведомление о наборе текста',
        'Мутация sendMessage(chatId, text) — отправка сообщения с публикацией события',
        'Мутация startTyping(chatId) — уведомление о начале набора текста',
        'Фильтрация через withFilter — подписчик получает только события своего чата'
      ],
      hint: 'Используйте PubSub для publish/subscribe. Резолвер подписки должен вернуть asyncIterableIterator. withFilter принимает итератор и функцию фильтрации.',
      expectedOutput: 'Полная схема чата с мутациями и подписками. Резолверы с PubSub и фильтрацией по chatId.',
      solution: `// Схема
const typeDefs = \`
  type Message {
    id: ID!
    text: String!
    sender: User!
    chatId: ID!
    createdAt: String!
  }

  type TypingIndicator {
    user: User!
    chatId: ID!
  }

  type Query {
    messages(chatId: ID!, limit: Int = 50): [Message!]!
  }

  type Mutation {
    sendMessage(chatId: ID!, text: String!): Message!
    startTyping(chatId: ID!): Boolean!
  }

  type Subscription {
    messageAdded(chatId: ID!): Message!
    typingStarted(chatId: ID!): TypingIndicator!
  }
\`;

// Резолверы
import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();

const resolvers = {
  Query: {
    messages: async (_, { chatId, limit }, { db }) => {
      return db.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { sender: true }
      });
    }
  },

  Mutation: {
    sendMessage: async (_, { chatId, text }, { db, user }) => {
      const message = await db.message.create({
        data: { text, chatId, senderId: user.id },
        include: { sender: true }
      });

      pubsub.publish('MESSAGE_ADDED', { messageAdded: message });
      return message;
    },

    startTyping: async (_, { chatId }, { user }) => {
      pubsub.publish('TYPING_STARTED', {
        typingStarted: { user, chatId }
      });
      return true;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator('MESSAGE_ADDED'),
        (payload, variables) => {
          return payload.messageAdded.chatId === variables.chatId;
        }
      )
    },
    typingStarted: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator('TYPING_STARTED'),
        (payload, variables) => {
          return payload.typingStarted.chatId === variables.chatId;
        }
      )
    }
  }
};`,
      explanation: 'Мутация sendMessage создаёт сообщение в БД и публикует событие MESSAGE_ADDED через PubSub. Подписка messageAdded фильтрует события по chatId — клиент получает только сообщения из своего чата. Аналогично работает startTyping для индикатора набора текста. withFilter проверяет каждое событие и передаёт только подходящие.'
    }
  ]
}
