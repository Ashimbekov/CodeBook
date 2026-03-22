export default {
  id: 33,
  title: 'SD Mock: Messenger + Notification',
  description: 'Полный макет собеседования по System Design: проектируем мессенджер с групповыми чатами и push-уведомлениями. Все 8 шагов с модельными ответами.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования — личные и групповые чаты',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Спроектируйте мессенджер вроде WhatsApp или Telegram." Ваша задача — первым делом уточнить требования и scope.' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Задайте уточняющие вопросы интервьюеру и определите функциональные и нефункциональные требования. Что обязательно включить в MVP?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Функциональные требования:\n1. Личные сообщения 1-на-1 (text, image, voice).\n2. Групповые чаты (до 500 участников).\n3. Статус онлайн/оффлайн.\n4. Push-уведомления при получении сообщения.\n5. История сообщений (хранить 5 лет).\n6. Прочитано/доставлено (read receipts).\n\nНефункциональные требования:\n- Низкая задержка: < 100ms для доставки сообщений.\n- Высокая доступность: 99.99% uptime.\n- Eventual consistency для read receipts.\n- Сообщения хранятся на сервере (мультиустройство).\n\nOut of scope для MVP: звонки, платёжная система, публичные каналы.' },
        { type: 'tip', value: 'На реальном интервью уточните: сколько участников в группе? хранить ли историю? важна ли end-to-end шифровка? Это показывает зрелость мышления.' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Оценка нагрузки — 500M пользователей',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Хорошо. Давайте оценим нагрузку. Предположим 500 миллионов пользователей."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Посчитайте: DAU, RPS (read/write), хранилище в год. Сколько нужно серверов?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'DAU: 500M * 50% = 250M активных в день.\n\nСообщения:\n- 40 сообщений/день на пользователя.\n- Write RPS: 250M * 40 / 86400 = ~115,000 msg/sec.\n- Пиковая нагрузка x3 = ~350,000 msg/sec.\n\nХранилище:\n- Среднее сообщение: 100 байт.\n- В день: 250M * 40 * 100B = 1 TB/day.\n- Медиа (+20x overhead): ~20 TB/day.\n- За 5 лет: ~37 PB.\n\nПодключения WebSocket:\n- 250M одновременно открытых соединений.\n- 1 сервер держит ~100K соединений.\n- Нужно ~2500 chat серверов.\n\nBandwidth:\n- Входящий: 115K * 100B = 11.5 MB/s ~ 100 Gbps.' },
        { type: 'note', value: 'Показывайте ход вычислений вслух. Интервьюер оценивает не точность, а методичность подхода.' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: API Design — WebSocket + REST',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Как клиент будет общаться с сервером? Какой протокол выберете?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Спроектируйте API для отправки/получения сообщений. Обоснуйте выбор WebSocket vs HTTP long-polling vs SSE.' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'WebSocket — основной протокол для real-time:\n- Bidirectional: клиент и сервер могут отправлять сообщения без нового HTTP-запроса.\n- Persistent connection: одно соединение живёт всё время сессии.\n- Низкая задержка: нет overhead HTTP-заголовков на каждое сообщение.\n\nREST — для не-real-time операций:\n\nGET /api/v1/conversations — список чатов\nGET /api/v1/conversations/{id}/messages?before=timestamp&limit=50 — история\nPOST /api/v1/users/{id}/devices — регистрация push-токена\n\nWebSocket события:\n{\n  "type": "message",\n  "conversation_id": "uuid",\n  "sender_id": "uuid",\n  "content": "текст",\n  "timestamp": 1700000000,\n  "message_id": "uuid"\n}\n\nAcknowledgement:\n{\n  "type": "ack",\n  "message_id": "uuid",\n  "status": "delivered"\n}' },
        { type: 'tip', value: 'HTTP long-polling — устаревший fallback для клиентов без WebSocket. SSE — только server-to-client. WebSocket — лучший выбор для мессенджера.' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Модель данных — сообщения, чаты, пользователи',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Как вы смоделируете данные? Какую базу данных выберете?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Нарисуйте схему данных. Объясните выбор базы данных для сообщений и метаданных.' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Таблица users:\n- user_id (UUID, PK)\n- username, phone, avatar_url\n- created_at, last_seen\n\nТаблица conversations:\n- conversation_id (UUID, PK)\n- type: ENUM(direct, group)\n- name (для групп)\n- created_at\n\nТаблица participants:\n- conversation_id + user_id (composite PK)\n- joined_at, role (admin/member)\n\nТаблица messages:\n- message_id (UUID, PK)\n- conversation_id (partition key)\n- sender_id\n- content (text)\n- type: ENUM(text, image, audio)\n- created_at (sort key)\n- status: ENUM(sent, delivered, read)\n\nВыбор БД:\n- Сообщения: Apache Cassandra / HBase\n  Причина: горизонтальное масштабирование, быстрая запись, хранение по partition_key = conversation_id.\n- Метаданные (users, conversations): PostgreSQL\n  Причина: реляционные связи, транзакции, joins.\n- Медиа файлы: S3 / object storage с CDN.' },
        { type: 'note', value: 'Для мессенджера главный паттерн доступа: получить последние N сообщений конкретного чата. Cassandra оптимальна для этого: partition_key = conversation_id, clustering_key = created_at DESC.' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Chat Service Design',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Опишите архитектуру chat сервиса. Что происходит когда Алиса отправляет сообщение Боту?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Опишите путь сообщения от отправителя до получателя. Как обеспечить доставку если получатель offline?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Компоненты:\n1. API Gateway — балансировка, аутентификация.\n2. Chat Server Farm — держат WebSocket соединения.\n3. Message Queue (Kafka) — буферизация, гарантированная доставка.\n4. Message Storage Service — запись в Cassandra.\n5. Notification Service — push для offline пользователей.\n6. Presence Service — онлайн/оффлайн статус.\n7. Session Service — на каком chat server находится пользователь.\n\nФлоу отправки сообщения:\n1. Алиса → WebSocket → Chat Server A.\n2. Chat Server A → Kafka topic "messages".\n3. Kafka → Message Storage Service → Cassandra.\n4. Kafka → Fan-out Service:\n   а. Боб онлайн: Session Service → Chat Server B → WebSocket → Боб.\n   б. Боб оффлайн: → Notification Service → APNs/FCM → push.\n5. Chat Server A ← ACK "delivered" ← Боб.\n6. Chat Server A → Алиса: статус "delivered".' },
        { type: 'tip', value: 'Kafka даёт at-least-once delivery. Для exactly-once используйте idempotent message_id на стороне клиента — дубликаты дедуплицируются по message_id перед записью.' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: Notification Service',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Расскажите подробнее о системе уведомлений. Как отправлять push на iOS, Android, web?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Спроектируйте Notification Service. Как хранить device токены? Как обрабатывать ошибки при отправке?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Device Token Storage:\n- Таблица device_tokens: user_id, device_id, token, platform (ios/android/web), last_active.\n- Один пользователь может иметь N устройств.\n\nNotification Service архитектура:\n1. Kafka consumer читает события "message_received".\n2. Проверяет статус пользователя в Presence Service.\n3. Если offline: читает device_tokens из Redis (cache) / PostgreSQL.\n4. Распределяет по платформам:\n   - iOS → APNs (Apple Push Notification service).\n   - Android → FCM (Firebase Cloud Messaging).\n   - Web → Web Push Protocol.\n5. Retry логика: exponential backoff при ошибке.\n\nОбработка ошибок:\n- APNs/FCM возвращает "invalid token" → удаляем из device_tokens.\n- Rate limiting: не больше N уведомлений/сек на пользователя.\n- Batch sending: группируем уведомления если много сообщений за короткое время (digest).\n\nАгрегация:\n- Если получено 5 сообщений пока offline → одно push "5 новых сообщений от Алисы" вместо 5 отдельных.' },
        { type: 'note', value: 'Никогда не отправляйте контент сообщения в push payload для E2E зашифрованных чатов — только "у вас новое сообщение". Клиент сам расшифрует.' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Presence Service — онлайн статус',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Как вы реализуете показ онлайн/оффлайн статуса? Это звучит несложно, но там есть нюансы..."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Спроектируйте систему онлайн-статуса. Обработайте кейс: соединение разорвалось без явного logout (упал интернет). Как масштабировать на 500M пользователей?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Хранение статуса:\n- Redis: user_id → {status: "online", last_seen: timestamp, server_id: "chat-server-7"}.\n- TTL: 30 секунд на запись.\n\nHeartbeat механизм:\n- Клиент посылает heartbeat каждые 10 секунд по WebSocket.\n- Chat Server обновляет TTL в Redis при получении heartbeat.\n- Если TTL истёк (нет heartbeat 30 сек) → пользователь автоматически offline.\n\nПроблема "мерцания":\n- Нестабильный интернет: online/offline/online каждые 5 секунд.\n- Решение: не показывать статус online сразу, показывать только после 3+ heartbeats подряд.\n\nМасштабирование:\n- Подписки на статус: если у Алисы 500 друзей, при изменении статуса нужно уведомить 500 серверов.\n- Fan-out через Pub/Sub (Redis Pub/Sub или Kafka).\n- Ленивая загрузка: показывать статус только тех, кто в открытом чате.\n\nGDPR соображение:\n- Дать пользователям выбор: скрыть онлайн-статус от всех или конкретных пользователей.' },
        { type: 'tip', value: 'Heartbeat каждые 10 сек для 250M активных пользователей = 25M heartbeats/sec. Redis Cluster справится, но разделите по шардам (user_id % N_shards).' }
      ]
    },
    {
      id: 8,
      title: 'Шаг 8: Масштабирование до миллиардов',
      type: 'practice',
      content: [
        { type: 'text', value: 'Интервьюер: "Отлично. Как мы масштабируемся если нагрузка вырастет в 10 раз? Какие bottlenecks вы видите?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Определите узкие места архитектуры и предложите решения для масштабирования до 5 миллиардов пользователей.' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Bottlenecks и решения:\n\n1. Chat Servers (WebSocket):\n- Bottleneck: 2500 серверов по 100K соединений.\n- Решение: горизонтальное масштабирование + consistent hashing для роутинга по conversation_id.\n\n2. Message Storage (Cassandra):\n- Bottleneck: hot partitions для популярных групп.\n- Решение: sharding по (conversation_id, bucket_id), where bucket = timestamp / BUCKET_SIZE.\n\n3. Fan-out для групповых чатов:\n- Bottleneck: группа 500 участников на 25 разных серверах.\n- Решение: Push model для малых групп (< 100), Pull model для больших (> 100).\n- Pull: клиент сам запрашивает новые сообщения при открытии чата.\n\n4. Media Storage:\n- Решение: CDN (CloudFront/Akamai) для медиа файлов, S3 для хранения.\n- Дедупликация: хэш файла → если файл уже есть, не загружаем снова.\n\n5. Geography:\n- Multi-region deployment: серверы в США, Европе, Азии.\n- Пользователи подключаются к ближайшему региону.\n- Репликация данных между регионами (eventual consistency).\n\nМониторинг:\n- Latency p99, p999 для доставки сообщений.\n- Размер очереди Kafka (lag).\n- Число активных WebSocket соединений на сервер.' },
        { type: 'note', value: 'Итог архитектуры: API Gateway → Chat Servers (WebSocket) → Kafka → Fan-out Service → Cassandra + Notification Service. Presence Service на Redis с TTL heartbeat. Media на S3+CDN.' }
      ]
    }
  ]
}
