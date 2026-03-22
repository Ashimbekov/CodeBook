export default {
  id: 18,
  title: 'Проектируем: Chat (WhatsApp)',
  description: 'Полное проектирование мессенджера: real-time доставка сообщений, WebSocket, шифрование, хранение истории, онлайн-статус.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования',
      type: 'practice',
      solution: 'Функциональные требования:\n- Личные сообщения (1-to-1)\n- Групповые чаты (до 500 участников)\n- Медиа: фото, видео, голосовые сообщения\n- Статус доставки: отправлено/доставлено/прочитано\n- Online/Offline статус\n- Push уведомления оффлайн\n- End-to-end шифрование\n\nНефункциональные:\n- 2B пользователей, 100B сообщений/день\n- Latency доставки: < 100 мс\n- Доступность: 99.99%\n- Хранить последние 30 дней\n\nОценка нагрузки:\n- 100B / 86,400 = 1.2M сообщений/сек\n- 1.2M × 1 КБ = 1.2 ГБ/сек write throughput\n- 100M+ одновременных WebSocket соединений',
      explanation: '1.2M сообщений/сек — один из самых высоких write throughput в индустрии. Это исключает любую реляционную БД в single-master конфигурации. Cassandra с шардированием по chat_id — единственный практичный выбор. 100M WebSocket соединений требуют специализированных Chat Servers с sticky sessions.',
      content: [
        { type: 'text', value: 'Проектируем систему мгновенных сообщений уровня WhatsApp.' },
        { type: 'heading', value: 'Функциональные требования' },
        { type: 'list', value: [
          'Личные сообщения (1-to-1 чаты)',
          'Групповые чаты (до 500 участников)',
          'Медиа: фото, видео, голосовые сообщения',
          'Статус доставки: отправлено, доставлено, прочитано (галочки)',
          'Online/Offline статус пользователей',
          'Уведомления (push) при оффлайн',
          'End-to-end шифрование'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          '2 млрд пользователей, 100 млрд сообщений в день',
          'Latency: сообщение доставляется < 100 мс',
          'Доступность: 99.99%',
          'Хранить историю: последние 30 дней на сервере',
          'E2E шифрование: сервер не читает сообщения'
        ]},
        { type: 'heading', value: 'Оценка нагрузки' },
        { type: 'text', value: '100 млрд сообщений / 86,400 = 1,157,407 ≈ 1.2M msg/sec\n\nОдно сообщение: ~1 КБ (текст + метаданные)\n1.2M × 1 КБ = 1.2 ГБ/сек write throughput\n\nАктивные WebSocket соединения: 100M+ одновременно\n  (каждый активный пользователь = постоянное соединение)' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Real-Time доставка — WebSocket',
      type: 'practice',
      solution: 'Почему WebSocket: постоянное двустороннее соединение, сервер push без polling.\nHTTP polling → 100M × запрос/сек = огромная нагрузка.\nWebSocket → постоянное соединение, сервер инициирует отправку.\n\nWebSocket Connection Management:\n[User 1] ←WS→ [Chat Server 1]\n[User 2] ←WS→ [Chat Server 3]\n\nДоставка сообщения User 1 → User 2:\n1. Chat Server 1 получает сообщение\n2. Redis: GET "ws:{user_2_id}" → "chat-server-3"\n3. Kafka: публикует сообщение для Chat Server 3\n4. Chat Server 3 → доставляет User 2 через WebSocket\n5. ACK обратно → статус "доставлено"\n\nPresence Service хранит: {user_id → server_id} маппинг в Redis\nTTL: 30 сек (обновляется heartbeat каждые 5 сек)',
      explanation: 'Redis как service registry для WebSocket соединений — ключевое решение. Без него Chat Server 1 не знает, где подключён User 2. Kafka между Chat Servers обеспечивает надёжную доставку даже при временной недоступности сервера-получателя. Sticky sessions (IP hash) необходимы — WebSocket соединение должно оставаться на одном сервере.',
      content: [
        { type: 'text', value: 'Ключевой компонент мессенджера — мгновенная доставка сообщений.' },
        { type: 'heading', value: 'Почему WebSocket, а не HTTP polling' },
        { type: 'text', value: 'Short Polling: клиент спрашивает сервер каждые N секунд\n  GET /messages/new → нет новых → 200 пустой ответ\n  Плохо: огромная нагрузка при 100M пользователей, задержка\n\nLong Polling: клиент спрашивает, сервер не отвечает пока нет данных\n  Лучше, но: много открытых соединений, сложнее\n\nWebSocket: постоянное двустороннее соединение\n  Клиент открыл соединение → сервер может в любой момент отправить данные\n  Идеально для чата!' },
        { type: 'heading', value: 'WebSocket Connection Management' },
        { type: 'text', value: 'Проблема: если user_1 подключён к Chat Server 1, а user_2 к Chat Server 3 — как доставить сообщение?\n\nАрхитектура:\n[User 1] ←WebSocket→ [Chat Server 1]\n[User 2] ←WebSocket→ [Chat Server 3]\n\nChat Server 1 получает сообщение от User 1 для User 2:\n1. Найти в Redis: на каком Chat Server сидит User 2?\n   Redis: "ws:{user_2_id}" → "chat-server-3"\n2. Послать сообщение Chat Server 3 (через Kafka или gRPC)\n3. Chat Server 3 доставляет через WebSocket User 2\n\nPresence Service хранит: {user_id → server_id} маппинг' },
        { type: 'heading', value: 'Message Flow' },
        { type: 'text', value: 'User 1 → User 2:\n1. User 1 отправляет через WebSocket: {to: "user2", text: "Hello"}\n2. Chat Server 1: сохранить в Cassandra + опубликовать в Kafka\n3. Message Router: найти Chat Server для User 2\n4. Chat Server 3: доставить User 2 через WebSocket\n5. User 2 получает: ACK отправляется обратно\n6. Chat Server → обновить статус: "delivered"\n7. User 1 получает: "вторая галочка"' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: Модель данных и хранение сообщений',
      type: 'practice',
      solution: 'Таблица messages (Cassandra):\nchat_id UUID — PARTITION KEY (все сообщения чата на одном шарде)\nmessage_id BIGINT — CLUSTERING KEY DESC (Snowflake ID, содержит timestamp)\nsender_id UUID, text TEXT, media_url VARCHAR\nstatus TINYINT (0=sent, 1=delivered, 2=read)\ncreated_at TIMESTAMP\n\nЗапрос последних 50 сообщений:\nSELECT * FROM messages WHERE chat_id = ? LIMIT 50\n→ один шард, O(1) по partition key, быстро\n\nТаблица chats: chat_id, type (DIRECT/GROUP), name, created_by, participants LIST\n\nUser Inbox (Redis Sorted Set):\n"inbox:{user_id}" → score: timestamp, member: chat_id\nПри новом сообщении: ZADD для каждого участника\nСписок чатов: ZREVRANGE "inbox:{user_id}" 0 19',
      explanation: 'Partition key = chat_id — фундаментальное решение: все сообщения одного чата на одном узле Cassandra. Clustering key = message_id DESC — сортировка новых сначала без ORDER BY. Redis Sorted Set для inbox позволяет за O(log N) обновлять и читать список чатов. Snowflake message_id содержит timestamp — уникальность + сортировка в одном поле.',
      content: [
        { type: 'text', value: 'Схема хранения сообщений для огромного объёма.' },
        { type: 'heading', value: 'Таблица messages (Cassandra)' },
        { type: 'text', value: 'chat_id      UUID       PARTITION KEY\nmessage_id   BIGINT     CLUSTERING KEY DESC  (Snowflake ID, содержит timestamp)\nsender_id    UUID\ntext         TEXT\nmedia_url    VARCHAR\nstatus       TINYINT    (0=sent, 1=delivered, 2=read)\ncreated_at   TIMESTAMP\n\nSharding: по chat_id — все сообщения чата на одном шарде\nOrdering: по message_id DESC — новые сначала\n\nЗапрос последних 50 сообщений:\n  SELECT * FROM messages\n  WHERE chat_id = ?\n  LIMIT 50' },
        { type: 'heading', value: 'Таблица chats' },
        { type: 'text', value: 'chat_id        UUID PRIMARY KEY\ntype           ENUM(DIRECT, GROUP)\nname           VARCHAR (только для группы)\ncreated_by     UUID\ncreated_at     TIMESTAMP\nparticipants   LIST<UUID>  (для групп до 500)' },
        { type: 'heading', value: 'User Inbox (Redis)' },
        { type: 'text', value: 'Для быстрой загрузки списка чатов пользователя:\n\nRedis Sorted Set: "inbox:{user_id}"\n  Score: timestamp последнего сообщения\n  Member: chat_id\n\nПри новом сообщении в чате:\n  ZADD "inbox:{participant_id}" {timestamp} {chat_id}\n  для каждого участника\n\nПолучить список чатов (последние 20):\n  ZREVRANGE "inbox:{user_id}" 0 19 WITHSCORES' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Online Presence и статус',
      type: 'practice',
      solution: 'Heartbeat механизм:\n- Клиент отправляет heartbeat каждые 5 сек через WebSocket\n- Сервер: Redis SET "presence:{user_id}" {timestamp} EX 30\n- Ключ истекает через 30 сек без обновления = offline\n- При отключении WebSocket: Redis DEL + обновить last_seen в БД\n\nМасштабирование Presence:\n100M онлайн × 1 heartbeat/5 сек = 20M Redis ops/сек\n→ Presence Service кластер: 20 нод Redis, каждая 1M ops/сек\n\nДоставка изменений статуса подписчикам:\n- При изменении статуса → Kafka event\n- Kafka consumers → отправить через WebSocket контактам пользователя\n- Подписка только для 200 контактов (не для всех пользователей)',
      explanation: 'TTL 30 сек с heartbeat каждые 5 сек — баланс: достаточно частые обновления для актуальности статуса, достаточный запас TTL для network hiccups. 20M Redis ops/сек требует кластеризации — это одна из самых высоконагруженных подсистем мессенджера. Pub/sub через Kafka для статусов избегает N×M проблемы подписок.',
      content: [
        { type: 'text', value: 'Отображение онлайн-статуса пользователей в реальном времени.' },
        { type: 'heading', value: 'Heartbeat механизм' },
        { type: 'text', value: 'Каждые 5 секунд клиент отправляет heartbeat через WebSocket.\n\nНа сервере:\n  При получении heartbeat:\n    Redis SET "presence:{user_id}" {timestamp} EX 30\n    (ключ истечёт через 30 сек без обновления = offline)\n\n  Проверка онлайн статуса:\n    value = Redis GET "presence:{user_id}"\n    if value exists AND now - timestamp < 30 сек: ONLINE\n    else: OFFLINE + show "last seen"\n\n  При отключении (WebSocket closed):\n    Redis DEL "presence:{user_id}"\n    Обновить last_seen timestamp в БД' },
        { type: 'heading', value: 'Масштабирование Presence' },
        { type: 'text', value: 'Проблема: 100M онлайн пользователей × heartbeat каждые 5 сек = 20M операций/сек к Redis\n\nРешение: Presence Service кластер\n  Шардировать по user_id: 20 нод Redis, каждая обрабатывает 1M ops/sec\n\nДоставка изменений статуса:\n  User A хочет видеть онлайн-статус 200 контактов\n  Subscribe на Kafka topics для каждого контакта (pub/sub)\n  При изменении статуса → Kafka event → доставить подписчикам через WebSocket' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Push уведомления и оффлайн',
      type: 'practice',
      solution: 'Push Notifications архитектура:\n- iOS → Apple Push Notification Service (APNs)\n- Android → Firebase Cloud Messaging (FCM)\n- Device Token Store (Cassandra): user_id → [{device_id, platform, token}]\n\nFlow:\n1. Пользователь установил приложение → зарегистрировал push token\n2. При сообщении и адресат оффлайн (нет WebSocket записи в Redis):\n   → Notification Service → APNs/FCM API\n   → Текст при E2E шифровании: "Новое сообщение" (без контента!)\n\nOffline Message Queue:\n- Сообщения хранятся в Cassandra (обычно)\n- При reconnect: клиент запрашивает все сообщения с last_seen_timestamp\n- Сервер доставляет пропущенные → ACK\n\nRead Receipts (галочки):\n- User 2 открывает чат → WebSocket: {read_up_to: message_id}\n- Chat Server → уведомить User 1 → обновить статус на "прочитано"',
      explanation: 'При E2E шифровании сервер не может читать содержимое → push уведомление содержит только "Новое сообщение". Это компромисс между приватностью и UX. Механизм sync при reconnect критичен — мессенджер должен доставить все пропущенные сообщения без дублирования. ACK-основанная доставка гарантирует надёжность.',
      content: [
        { type: 'text', value: 'Доставка сообщений когда пользователь оффлайн.' },
        { type: 'heading', value: 'Архитектура Push Notifications' },
        { type: 'text', value: 'Платформы:\n  iOS → Apple Push Notification Service (APNs)\n  Android → Firebase Cloud Messaging (FCM)\n  Web → Web Push (браузер)\n\nFlow:\n1. Пользователь установил приложение → зарегистрировал push token\n2. Сохранить: {user_id → [push_token_1, push_token_2 (несколько устройств)]}\n3. При получении сообщения, адресат оффлайн:\n   → Notification Service: отправить push через APNs/FCM\n   → Текст уведомления: "Иван: Привет!" (без контента при E2E шифровании)' },
        { type: 'heading', value: 'Offline Message Queue' },
        { type: 'text', value: 'Пока пользователь оффлайн:\n  Сообщения хранятся в Cassandra (обычно)\n  + Pending notifications в Redis: "pending:{user_id}" → [msg_ids]\n\nПри повторном подключении:\n  1. WebSocket установлен\n  2. Клиент посылает: "give me all messages since {last_seen_timestamp}"\n  3. Сервер доставляет пропущенные\n  4. Клиент подтверждает получение (ACK)' },
        { type: 'heading', value: 'Message Acknowledgment (статусы)' },
        { type: 'text', value: 'Три статуса (WhatsApp галочки):\n  Отправлено серверу (1 серая галочка):\n    Клиент получил ack от Chat Server\n  Доставлено получателю (2 серых галочки):\n    Получатель\'s устройство получило сообщение, WebSocket ACK\n  Прочитано (2 синих галочки):\n    Получатель открыл чат, saw message → отправил Read Receipt\n\nRead Receipt flow:\n  User 2 открывает чат → websocket отправляет: {read_up_to: message_id_N}\n  Chat Server → уведомить User 1 → UI обновляет галочки' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: End-to-End Encryption и медиа',
      type: 'practice',
      solution: 'Signal Protocol (E2E шифрование):\n1. Каждый клиент генерирует пару ключей (публичный/приватный)\n2. Публичный ключ регистрируется на сервере\n3. При первом сообщении: получить публичный ключ получателя → Diffie-Hellman → session key\n4. Шифровать session key-ом → сервер хранит только зашифрованные данные\n5. Только получатель расшифровывает (знает приватный ключ)\n\nЗагрузка медиа:\n1. Клиент шифрует медиа локально (AES-256)\n2. POST /media/upload → pre-signed S3 URL\n3. Загрузить зашифрованный файл напрямую в S3\n4. Отправить сообщение: {media_url + encryption_key}\n5. Получатель: скачать с CDN → расшифровать локально\n\nСервер никогда не видит содержимое сообщений и медиа.',
      explanation: 'E2E шифрование через Signal Protocol — золотой стандарт приватности: даже взлом серверов не раскрывает содержимое переписки. Медиа шифруется и загружается напрямую в S3 (bypass серверов) — сервер хранит только зашифрованный blob и URL. Это масштабируемо: серверы не являются bottleneck для медиа.',
      content: [
        { type: 'text', value: 'Обеспечиваем приватность через E2E шифрование.' },
        { type: 'heading', value: 'Signal Protocol (E2E Encryption)' },
        { type: 'text', value: 'WhatsApp использует Signal Protocol.\n\nОбмен ключами (упрощённо):\n  1. Каждый клиент генерирует пару ключей (публичный/приватный)\n  2. Публичный ключ регистрируется на сервере\n  3. При первом сообщении User 1 → User 2:\n     User 1 получает публичный ключ User 2 с сервера\n     Генерирует session key через Diffie-Hellman\n     Шифрует сообщение session key\'ом\n  4. Только User 2 может расшифровать (знает приватный ключ)\n\nСервер: хранит только зашифрованные данные. Не может прочитать сообщения!' },
        { type: 'heading', value: 'Загрузка и хранение медиа' },
        { type: 'text', value: 'Медиа не передаётся через WebSocket (слишком большое).\n\nUpload flow:\n  1. Клиент шифрует медиа файл локально (AES-256)\n  2. POST /media/upload → получить pre-signed S3 URL\n  3. Загрузить зашифрованный файл напрямую в S3\n  4. Отправить сообщение с media_url + encryption_key\n\nDownload flow:\n  1. Получатель получает сообщение с {media_url, encryption_key}\n  2. Загружает зашифрованный файл с CDN\n  3. Расшифровывает локально\n\nСервер не видит содержимое медиа!' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Групповые чаты и масштабирование',
      type: 'practice',
      solution: 'Групповые сообщения (до 500 участников):\nОптимизированный подход через Kafka:\n1. Сохранить сообщение в Cassandra\n2. Publish в Kafka topic группы\n3. Chat Servers с онлайн-участниками читают Kafka\n4. Каждый Chat Server доставляет своим подключённым участникам\n→ Нет прямого fan-out к каждому — только к активным серверам\n\nМасштабирование Chat Servers:\n- Один Chat Server: ~65,000 WebSocket соединений\n- 100M активных / 65,000 = 1,540 Chat Servers\n- Sticky Sessions (IP Hash или Cookie): WebSocket остаётся на одном сервере\n\nFailover:\n- Chat Server упал → клиенты reconnect за 1–5 сек\n- Redis обновляется: {user_id → new_server_id}\n- Пропущенные сообщения получают при reconnect через sync механизм',
      explanation: 'Kafka для групповых сообщений элегантнее прямого fan-out: Chat Servers подписываются на топик группы и доставляют только своим локальным соединениям. Это масштабируется лучше, чем 500 прямых push операций. 1,540 Chat Servers — реалистичная оценка: Facebook Messenger и WhatsApp использовали аналогичные масштабы.',
      content: [
        { type: 'text', value: 'Групповые чаты и финальные решения по масштабированию.' },
        { type: 'heading', value: 'Групповые сообщения' },
        { type: 'text', value: 'Доставка сообщения 500 участникам группы:\n\nПростой подход: Fan-out to all participants\n  Одно сообщение → 500 WebSocket push\n  При 1000 таких сообщений/сек: 500,000 WebSocket push/сек\n\nОптимизация для больших групп:\n  1. Chat Server сохраняет сообщение в Cassandra\n  2. Публикует событие в Kafka topic группы\n  3. Все Chat Servers, у которых есть онлайн-участники, читают Kafka\n  4. Каждый Chat Server доставляет своим подключённым участникам' },
        { type: 'heading', value: 'Масштабирование Chat Servers' },
        { type: 'text', value: 'Один Chat Server держит ~65,000 WebSocket соединений (ограничение OS: 65,535 портов)\n  100M активных соединений / 65,000 ≈ 1,540 Chat Servers\n\nLoad Balancing WebSocket:\n  Sticky Sessions через IP Hash или Cookie\n  (WebSocket соединение должно оставаться на одном сервере)\n\nFailover:\n  Chat Server упал → Клиенты переподключаются (автоматически за 1–5 сек)\n  Новый сервер обновляет Redis: {user_id → new_server}\n  Пропущенные сообщения получают при reconnect' },
        { type: 'note', value: 'WhatsApp работает с 2009. Успех их инфраструктуры: Erlang (язык для телекоммуникаций, идеален для WebSocket серверов), FreeBSD, минимум dependencies. В 2014 обрабатывали 50B сообщений/день с командой из 50 инженеров.' }
      ]
    }
  ]
}
