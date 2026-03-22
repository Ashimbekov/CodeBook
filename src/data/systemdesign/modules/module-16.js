export default {
  id: 16,
  title: 'Проектируем: Twitter/X',
  description: 'Полное проектирование Twitter: твиты, лента новостей (News Feed), подписки, поиск, тренды. Fan-out стратегии, масштабирование до миллиардов.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и масштаб',
      type: 'practice',
      requirements: [
        'Определить функциональные требования (твиты, лента, подписки)',
        'Указать нефункциональные требования (масштаб, SLA, latency)',
        'Рассчитать write RPS (твиты)',
        'Рассчитать read RPS (загрузка ленты)',
        'Определить read/write ratio и характер нагрузки'
      ],
      hint: 'Twitter — система с умеренным write (публикация твитов) и очень высоким read (загрузка ленты). Рассчитай: 500M твитов/день → write RPS. 300M DAU × 30 загрузок ленты → read RPS. Это определит архитектуру кеширования.',
      expectedOutput: 'Write RPS: ~6 000. Read RPS: ~100 000. Read/Write ratio: 17:1 — система read-heavy. Хранилище: 500 ГБ/день. Eventual consistency ленты допустима (задержка 1–2 сек). Вывод: кеш лент обязателен, Cassandra для горизонтального масштабирования.',
      solution: 'Функциональные требования:\n- Создание твита (280 символов, опционально медиа)\n- Подписка на пользователей (follow/unfollow)\n- Домашняя лента: последние твиты от подписок\n- Лайк, ретвит, ответ\n- Поиск по твитам и пользователям\n\nНефункциональные требования:\n- 300M DAU, 500M твитов/день\n- Доступность: 99.99%\n- Лента < 200 мс\n- Eventual consistency ленты (задержка 1–2 сек допустима)\n\nОценка нагрузки:\n- Write: 500M / 86,400 ≈ 6,000 RPS\n- Read: 300M × 30 загрузок / 86,400 ≈ 100,000 RPS\n- Read/Write = 17:1 (read-heavy, но write тоже существен)\n- Хранилище: 500M × 1КБ = 500 ГБ/день',
      explanation: 'Twitter — система с умеренным write (6K RPS) и высоким read (100K RPS). Read/Write 17:1 означает кеширование лент обязательно. 500 ГБ хранилища в день → Cassandra для горизонтального масштабирования. Eventual consistency ленты — правильный выбор: задержка 1–2 сек незаметна для пользователя.',
      content: [
        { type: 'text', value: 'Определяем что строим и какой масштаб планируем.' },
        { type: 'heading', value: 'Функциональные требования (Core)' },
        { type: 'list', value: [
          'Создание твита (до 280 символов, опционально медиа)',
          'Подписка на других пользователей',
          'Домашняя лента: последние твиты от подписок',
          'Лайк, ретвит, ответ на твит',
          'Поиск по твитам и пользователям',
          'Профиль пользователя'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          'Доступность: 99.99%',
          'Лента: загрузка < 200 мс',
          'Масштаб: 300 млн DAU, 500M твитов в день',
          'Лента: eventual consistency (задержка 1–2 сек допустима)',
          'Хранение медиа: видео до 2 минут'
        ]},
        { type: 'heading', value: 'Back-of-the-envelope' },
        { type: 'text', value: 'Твиты:\n  500M твитов / 86,400 = 5,787 write RPS ≈ ~6,000 write RPS\n  Средний твит: 280 символов + метаданные ≈ 1 КБ\n  500M × 1КБ = 500 ГБ хранилища в день\n\nЧтение ленты:\n  300M DAU × 30 загрузок ленты = 9B read операций\n  9B / 86,400 = 104,166 read RPS ≈ ~100,000 read RPS\n\nRead/Write ratio ≈ 17:1\nСистема read-heavy, но write тоже существенен' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: API Design',
      type: 'practice',
      requirements: [
        'Спроектировать Tweets API (создание, получение, удаление)',
        'Спроектировать Feed API с курсорной пагинацией',
        'Спроектировать Social Graph API (follow/unfollow, followers)',
        'Объяснить cursor-based vs offset-based пагинацию',
        'Описать эндпоинты для лайков и ретвитов'
      ],
      hint: 'Cursor-based пагинация обязательна для ленты — объясни почему offset ломается при вставке новых твитов. refresh_cursor нужен для pull-to-refresh без потери позиции. Social Graph API должен поддерживать оба направления: followers и following.',
      expectedOutput: 'POST /tweets, GET /tweets/{id}, DELETE /tweets/{id} спроектированы. Feed: GET /timeline/home?cursor={c}&limit=20 с next_cursor и refresh_cursor. Cursor-based обоснован: новые твиты не сдвигают позицию. Social: POST/DELETE /users/{id}/follow, GET followers/following с пагинацией.',
      solution: 'Tweets API:\n- POST /api/v1/tweets → 201 {tweet_id, text, author, created_at}\n- GET /api/v1/tweets/{tweet_id} → 200 {tweet_id, text, likes, retweets}\n- DELETE /api/v1/tweets/{tweet_id} → 204\n- POST /api/v1/tweets/{tweet_id}/likes → 201\n- DELETE /api/v1/tweets/{tweet_id}/likes → 204\n- POST /api/v1/tweets/{tweet_id}/retweets → 201\n\nFeed API (cursor-based пагинация):\n- GET /api/v1/timeline/home?limit=20&cursor={cursor}\n  Response: {tweets: [...], next_cursor, refresh_cursor}\n- GET /api/v1/timeline/user/{user_id}?limit=20&cursor={cursor}\n\nSocial Graph API:\n- POST /api/v1/users/{user_id}/follow → 201\n- DELETE /api/v1/users/{user_id}/follow → 204\n- GET /api/v1/users/{user_id}/followers?limit=20&cursor={cursor}\n- GET /api/v1/users/{user_id}/following?limit=20&cursor={cursor}',
      explanation: 'Cursor-based пагинация обязательна для лент — offset-based ломается при вставке новых твитов (дубликаты или пропуски при скролле). refresh_cursor позволяет подгружать только новые твиты при pull-to-refresh без потери позиции скролла.',
      content: [
        { type: 'text', value: 'Ключевые API для основных функций Twitter.' },
        { type: 'heading', value: 'Tweets API' },
        { type: 'text', value: 'POST /api/v1/tweets\n  Body: { text: "...", media_ids: [...], reply_to: null }\n  Response 201: { tweet_id, text, author, created_at, ... }\n\nGET /api/v1/tweets/{tweet_id}\n  Response 200: { tweet_id, text, author, likes, retweets, ... }\n\nDELETE /api/v1/tweets/{tweet_id}\n\nPOST /api/v1/tweets/{tweet_id}/likes\nDELETE /api/v1/tweets/{tweet_id}/likes\n\nPOST /api/v1/tweets/{tweet_id}/retweets' },
        { type: 'heading', value: 'Feed API' },
        { type: 'text', value: 'GET /api/v1/timeline/home\n  Query: limit=20, cursor={cursor}\n  Response: { tweets: [...], next_cursor: "...", refresh_cursor: "..." }\n\nGET /api/v1/timeline/user/{user_id}\n  Query: limit=20, cursor={cursor}' },
        { type: 'heading', value: 'Social Graph API' },
        { type: 'text', value: 'POST /api/v1/users/{user_id}/follow\nDELETE /api/v1/users/{user_id}/follow\nGET /api/v1/users/{user_id}/followers?limit=20&cursor={cursor}\nGET /api/v1/users/{user_id}/following?limit=20&cursor={cursor}' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: Модель данных',
      type: 'practice',
      requirements: [
        'Спроектировать таблицу tweets с индексами',
        'Спроектировать таблицу user_follows с двумя индексами',
        'Выбрать хранилище для каждого типа данных',
        'Объяснить Redis Sorted Set для ленты (feed кеш)',
        'Обосновать Snowflake ID вместо автоинкремента'
      ],
      hint: 'Для user_follows нужны оба индекса: (follower_id → followee_id) для "кого я фоллоую" и (followee_id → follower_id) для "кто меня фоллоует". Snowflake ID содержит timestamp — это позволяет сортировку без отдельного поля. Для ленты: Redis Sorted Set с tweet_id как member и timestamp как score.',
      expectedOutput: 'Таблица tweets: Snowflake ID PK, индекс (user_id, created_at DESC). Два индекса user_follows обоснованы. Хранилища: tweets → Cassandra, users → PostgreSQL, social graph → PostgreSQL, feed → Redis Sorted Set, media → S3+CDN. Каждый выбор обоснован.',
      solution: 'Таблица tweets (Cassandra, шардирование по user_id):\ntweet_id BIGINT PK (Snowflake ID — содержит timestamp)\nuser_id BIGINT, text VARCHAR(280), media_ids ARRAY, reply_to BIGINT\nlike_count INT, retweet_cnt INT, created_at TIMESTAMP\nИндексы: (user_id, created_at DESC), (created_at DESC)\n\nТаблица user_follows (Cassandra или PostgreSQL):\nfollower_id BIGINT, followee_id BIGINT, created_at TIMESTAMP\nPK: (follower_id, followee_id)\nДоп. индекс: (followee_id, follower_id)\n\nFeed кеш (Redis Sorted Set):\n"feed:{user_id}" → {tweet_id: timestamp_score}\nХранить последние 1000 твитов ленты\n\nВыбор хранилищ:\n- Tweets: Cassandra (high write throughput)\n- User data: PostgreSQL (ACID, небольшой объём)\n- Social Graph: отдельный сервис / PostgreSQL\n- Feed: Redis Sorted Set\n- Media: S3 + CloudFront CDN',
      explanation: 'Snowflake ID в tweet_id содержит timestamp — это позволяет сортировать по времени без отдельного поля created_at в индексе. Два индекса для user_follows (follower→followee и followee→follower) нужны для разных запросов: "кто я фоллоую" и "кто фоллоует меня". Redis Sorted Set — идеальная структура для ленты с сортировкой по времени.',
      content: [
        { type: 'text', value: 'Схема данных для ключевых сущностей.' },
        { type: 'heading', value: 'Таблица tweets' },
        { type: 'text', value: 'tweet_id    BIGINT PRIMARY KEY  (Snowflake ID — содержит timestamp)\nuser_id     BIGINT NOT NULL\ntext        VARCHAR(280)\nmedia_ids   ARRAY<BIGINT>\nreply_to    BIGINT REFERENCES tweets\nlike_count  INT DEFAULT 0\nretweet_cnt INT DEFAULT 0\ncreated_at  TIMESTAMP\n\nIndexes:\n  (user_id, created_at DESC) — для user timeline\n  (created_at DESC) — для глобального поиска по времени' },
        { type: 'heading', value: 'Таблица user_follows' },
        { type: 'text', value: 'follower_id  BIGINT\nfollowee_id  BIGINT\ncreated_at   TIMESTAMP\nPRIMARY KEY (follower_id, followee_id)\n\nIndexes:\n  (followee_id, follower_id) — кто подписан на данного пользователя\n  (follower_id, followee_id) — на кого подписан данный пользователь' },
        { type: 'heading', value: 'Таблица user_feed (precomputed, Redis)' },
        { type: 'text', value: 'Sorted Set в Redis: "feed:{user_id}" → {tweet_id: timestamp_score}\n\nРазмер: хранить последние 1000 твитов ленты на пользователя\nEviction: удалять старые при добавлении новых' },
        { type: 'heading', value: 'Выбор БД' },
        { type: 'text', value: 'Tweets: Cassandra (high write throughput, шардирование по tweet_id)\nUser data: PostgreSQL (ACID, относительно небольшой объём)\nSocial Graph: Neo4j или отдельный сервис (много graph traversal)\nFeed: Redis (in-memory, Sorted Set по timestamp)\nMedia: Object Storage (S3-совместимое) + CDN' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Алгоритм ленты — Fan-Out',
      type: 'practice',
      requirements: [
        'Описать Fan-Out on Write (Push) с плюсами и минусами',
        'Описать Fan-Out on Read (Pull) с плюсами и минусами',
        'Объяснить проблему celebrity при Fan-Out on Write',
        'Предложить гибридный подход Twitter',
        'Описать алгоритм merge при чтении ленты'
      ],
      hint: 'Знаменитость с 150M подписчиков → 150M Redis операций при Fan-Out on Write. Это неприемлемо. Решение: гибрид — обычные пользователи Fan-Out on Write, знаменитости (> 10K followers) Fan-Out on Read. При GET feed — смешать precomputed ленту с твитами знаменитостей.',
      expectedOutput: 'Fan-Out on Write описан: быстрое чтение, проблема celebrities. Fan-Out on Read: нет проблемы celebrities, но медленное чтение при 2000 подписок. Гибридный подход: порог 10K followers. Алгоритм GET feed: Redis precomputed + celebrity pull + merge по timestamp.',
      solution: 'Fan-Out on Write (Push): при публикации твита → записать tweet_id в ленту каждого подписчика в Redis.\nПлюсы: чтение ленты мгновенное. Минусы: знаменитость с 100M подписчиков → 100M операций записи.\n\nFan-Out on Read (Pull): при загрузке ленты → запросить твиты всех подписок.\nПлюсы: нет проблемы celebrities. Минусы: 2000 подписок → 2000 запросов к БД.\n\nГибридный подход Twitter:\n- Обычные пользователи (< 10K подписчиков): Fan-Out on Write → пишем в Redis ленты подписчиков\n- Celebrities (> 10K подписчиков): Fan-Out on Read → при загрузке ленты подмешать их твиты\n\nПри GET feed:\n1. precomputed_tweets = Redis "feed:{user_id}" (обычные пользователи)\n2. celebrity_ids = Social Graph Service\n3. celebrity_tweets = Cassandra последние твиты знаменитостей\n4. merge + sort by timestamp → топ-20',
      explanation: 'Гибридный подход — образцовое решение trade-off. Fan-out on write эффективен для большинства пользователей (быстрое чтение). Для celebrities (< 0.01% пользователей, но > 50% write нагрузки) — pull при чтении. Граница 10K подписчиков — настраиваемый параметр под реальные метрики.',
      content: [
        { type: 'text', value: 'Самая сложная часть: как доставить твит всем подписчикам быстро?' },
        { type: 'heading', value: 'Подход 1: Fan-Out on Write (Push)' },
        { type: 'text', value: 'При создании твита → записать tweet_id в ленту КАЖДОГО подписчика.\n\nПсевдокод:\nonNewTweet(tweet):\n  followers = socialGraph.getFollowers(tweet.user_id)\n  for follower_id in followers:\n    redis.zadd("feed:" + follower_id, tweet.created_at, tweet.tweet_id)\n\nПлюсы: чтение ленты мгновенное (уже готова в Redis)\nМинусы:\n  Знаменитость с 100M подписчиков → 100M записей в Redis → долго!\n  Это называется "hot write" проблема' },
        { type: 'heading', value: 'Подход 2: Fan-Out on Read (Pull)' },
        { type: 'text', value: 'При загрузке ленты → запросить последние твиты всех, на кого подписан.\n\nПсевдокод:\nonGetFeed(user_id):\n  following = socialGraph.getFollowing(user_id)\n  tweets = []\n  for followee_id in following:\n    tweets += db.getRecentTweets(followee_id, limit=100)\n  return sortByTime(tweets)[:20]\n\nПлюсы: нет проблемы с celebrities, всегда актуальные данные\nМинусы:\n  Если пользователь подписан на 2000 аккаунтов → 2000 запросов к БД!\n  Очень медленно при чтении ленты' },
        { type: 'heading', value: 'Twitter\'s решение: гибридный подход' },
        { type: 'text', value: 'Обычные пользователи (< 10K followers): Fan-Out on Write\n  При публикации → записать в ленты всех подписчиков (быстро, их немного)\n\nCelebrities (> 10K followers): Fan-Out on Read\n  При загрузке ленты → "подмешать" последние твиты знаменитостей\n\nРезультат:\n  GET feed:\n    precomputed_tweets = redis.get("feed:" + user_id)  // твиты от обычных\n    celebrity_ids = socialGraph.getCelebrities(user_id)  // кто из знаменитостей\n    celebrity_tweets = db.getTweets(celebrity_ids, limit=5)\n    return merge(precomputed_tweets, celebrity_tweets)' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: High-Level архитектура',
      type: 'practice',
      requirements: [
        'Перечислить все сервисы и их ответственность',
        'Описать data flow публикации твита через Kafka',
        'Объяснить роль Kafka в декаплировании сервисов',
        'Указать принцип Database per Service',
        'Нарисовать путь от публикации до доставки в ленту'
      ],
      hint: 'Kafka — ключевой элемент: Tweet Service публикует событие и сразу возвращает ответ клиенту. Fan-out происходит асинхронно. Это обеспечивает быстрый ответ при публикации (100 мс), даже если у автора миллионы подписчиков. Каждый сервис — своя БД.',
      expectedOutput: 'Сервисы перечислены: Tweet, Feed, Social Graph, User, Media, Notification, Search. Data flow: POST /tweets → Tweet Service → Cassandra → Kafka → Fan-out Worker → Redis + Notification + Search. Kafka объяснён как decoupler. Database per Service обоснован (независимое масштабирование).',
      solution: 'Сервисы:\n- Tweet Service: создание/получение/удаление твитов → Cassandra\n- Feed Service: генерация и чтение ленты → Redis Cluster (Sorted Sets)\n- Social Graph Service: follow/unfollow, followers/following → PostgreSQL\n- User Service: профили, аутентификация → PostgreSQL\n- Media Service: загрузка медиа → S3 + CloudFront\n- Notification Service: push/email → Kafka consumer\n- Search Service: индексирование и поиск → Elasticsearch\n\nData Flow (публикация твита):\n[Client] → POST /tweets → [API Gateway]\n→ [Tweet Service]: сохранить в Cassandra\n→ Kafka event: {tweet_id, user_id}\n→ [Feed Fanout Worker]: получить followers → Redis ZADD для каждого\n→ [Notification Service]: уведомить упомянутых\n→ [Search Worker]: индексировать в Elasticsearch',
      explanation: 'Kafka декаплирует Tweet Service от Fan-out Worker — tweet создаётся быстро (100 мс), fan-out происходит асинхронно (секунды). Это обеспечивает eventual consistency ленты, приемлемую для Twitter. Каждый сервис имеет свою БД (Database per Service) — независимое масштабирование.',
      content: [
        { type: 'text', value: 'Собираем все сервисы в единую архитектуру.' },
        { type: 'heading', value: 'Сервисы' },
        { type: 'text', value: 'Tweet Service:\n  Создание, получение, удаление твитов\n  БД: Cassandra (шардирование по user_id)\n\nFeed Service:\n  Генерация и чтение ленты\n  Кеш: Redis Cluster (sorted sets)\n  Fan-out через Kafka events\n\nSocial Graph Service:\n  follow/unfollow операции\n  Запросы followers/following\n  БД: Graph DB или PostgreSQL\n\nUser Service:\n  Профили, аутентификация\n  БД: PostgreSQL\n\nMedia Service:\n  Загрузка/раздача медиа\n  Хранилище: S3 + CloudFront CDN\n\nNotification Service:\n  Push/email уведомления\n  Очередь: Kafka' },
        { type: 'heading', value: 'Data Flow: публикация твита' },
        { type: 'text', value: '[Client] → POST /tweets → [API Gateway]\n  → [Tweet Service]: сохранить в Cassandra\n  → Publish event: {tweet_id, user_id} в Kafka topic "new_tweets"\n  → [Feed Fanout Worker]: получает событие\n      → Social Graph Service: получить список followers\n      → Для каждого follower: Redis ZADD\n  → [Notification Service]: уведомить упомянутых пользователей' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: Поиск и тренды',
      type: 'practice',
      requirements: [
        'Описать индексирование твитов в Elasticsearch',
        'Спроектировать поиск по твитам и пользователям',
        'Спроектировать алгоритм вычисления трендов',
        'Объяснить использование Redis Sorted Set для хештегов',
        'Описать разницу velocity vs абсолютного счётчика'
      ],
      hint: 'Elasticsearch для full-text поиска, Redis Sorted Set для трендов. Тренд — это быстро растущий хештег, а не просто популярный. Считай хештеги по скользящему окну (час/день). ZINCRBY атомарно инкрементирует score. ZREVRANGE возвращает топ-N.',
      expectedOutput: 'Elasticsearch индекс: поля title, text, user_id, created_at. Search Worker читает Kafka → индексирует. GET /search/tweets?q=... работает. Тренды: Redis ZINCRBY "trends:{date}:{hour}" по каждому хештегу. ZREVRANGE для топ-10. Velocity > абсолютного счётчика объяснена.',
      solution: 'Полнотекстовый поиск (Elasticsearch):\n- Search Worker читает Kafka "new_tweets" → индексирует в ES\n- Индекс: {tweet_id, text, user_id, created_at, like_count}\n- GET /search/tweets?q=openai → ES match query + сортировка по relevance/дате\n- Поиск пользователей: отдельный ES индекс по name/username/bio\n\nTrending Topics (хештеги):\n- Kafka Consumer извлекает хештеги из каждого твита\n- Redis ZINCRBY "trends:{date}:{hour}" 1 "#openai" → Sorted Set\n- GET /trends → ZREVRANGE топ-10 за последний час\n- Учитывать velocity (скорость роста), не только абсолютный счётчик\n- Персонализация: тренды в регионе пользователя (отдельные ключи по геолокации)',
      explanation: 'Elasticsearch — стандарт для full-text search в масштабных системах: инвертированный индекс, scoring по TF-IDF, горизонтальное масштабирование. Redis Sorted Set для трендов — O(log N) операции, естественная сортировка по count. Velocity важнее абсолютного числа: быстро растущий хештег — тренд, а не просто популярный.',
      content: [
        { type: 'text', value: 'Функционал поиска и вычисление трендов.' },
        { type: 'heading', value: 'Полнотекстовый поиск' },
        { type: 'text', value: 'Технология: Elasticsearch\n\nПри создании твита → индексировать в Elasticsearch\nЭто делает Search Worker, читая из Kafka\n\nSearch Request:\n  GET /api/v1/search/tweets?q=openai&limit=20&cursor={cursor}\n  → ES query: match{text: "openai"} + sort по relevance/date\n\nДля поиска пользователей:\n  Elasticsearch индекс users: name, username, bio' },
        { type: 'heading', value: 'Trending Topics' },
        { type: 'text', value: 'Вычисление трендов — агрегация хештегов за последние 24 часа.\n\nPseudocode:\n  Kafka Consumer читает все новые твиты\n  Извлекает хештеги: #openai, #crypto, ...\n  Redis ZINCRBY "trends:2024-01-15:hour:10" 1 "#openai"\n  → Sorted Set: хештег → счётчик\n\nПолучение трендов:\n  GET /api/v1/trends\n  → Redis ZREVRANGE "trends:{today}:{current_hour}" 0 9\n  → Топ-10 хештегов за последний час\n\nУчитываем скорость роста (velocity), не только абсолютный счётчик.' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Масштабирование и bottlenecks',
      type: 'practice',
      requirements: [
        'Идентифицировать bottleneck Fan-out для знаменитостей',
        'Рассчитать время fan-out для 150M подписчиков',
        'Описать проблему Redis Memory для 300M пользователей',
        'Объяснить hot partition в Cassandra и решение через bucket',
        'Предложить решение для каждого bottleneck'
      ],
      hint: 'Для каждого bottleneck: сначала рассчитай почему это проблема (числа), потом предложи решение. Fan-out: 150M / 100K ops = 1500 сек — неприемлемо. Redis memory: 300M × 1000 × 8 байт = 2.4 ТБ. Hot partition: знаменитости на одном шарде.',
      expectedOutput: 'Bottleneck 1: Fan-out для 150M followers занял бы 25 мин → celebrities делают pull. Bottleneck 2: Redis 2.4 ТБ для всех → хранить только активные пользователи. Bottleneck 3: Hot partition → bucket в composite key. Все три решения обоснованы trade-off.',
      solution: 'Bottleneck 1 (Fan-out для celebrities, 150M подписчиков):\nПараллельный fan-out батчами по 1000 + 100 параллельных батчей = 100K ops/сек\nНо 150M / 100K = 1500 сек = 25 мин → слишком долго!\nРешение: celebrities (> 10K followers) не делают fan-out → pull при чтении ленты.\n\nBottleneck 2 (Redis Memory):\n300M пользователей × 1000 tweet_ids × 8 байт = 2.4 ТБ — слишком много!\nРешение: хранить только для активных (DAU). Инактивные пользователи → удалить ленту из Redis. При следующем входе → перегенерировать (slow first load, допустимо).\n\nBottleneck 3 (Cassandra Hot Partition):\nЗнаменитости на одном шарде → перегрузка.\nРешение: составной partition key (user_id, bucket) где bucket = random(0, N).\nЗапись распределяется по нодам, чтение агрегируется из всех buckets.',
      explanation: 'Все три bottleneck — следствие "hot spots" (знаменитости). Их решения: изменить алгоритм (pull вместо push), ограничить кеш (только активные пользователи), рандомизировать шардирование (bucket). Каждое решение вводит дополнительную сложность — правильный trade-off обосновывается метриками.',
      content: [
        { type: 'text', value: 'Идентифицируем и решаем узкие места системы.' },
        { type: 'heading', value: 'Bottleneck 1: Fan-out для celebrities' },
        { type: 'text', value: 'Проблема: Илон Маск с 150M подписчиками публикует твит → 150M операций в Redis.\n\nРешение:\n  Параллельный fan-out: разделить followers на батчи по 1000\n  Параллельно обрабатывать 100 батчей одновременно\n  Время: 150M / 100K ops/sec = 1500 сек = 25 мин\n  Всё ещё долго!\n\nФинальное решение: celebrities не делают fan-out.\n  Их твиты "подмешиваются" при чтении ленты (pull для celebrities).' },
        { type: 'heading', value: 'Bottleneck 2: Redis Memory' },
        { type: 'text', value: 'Хранить ленту для всех 300M пользователей:\n  300M × 1000 твитов × 8 байт (tweet_id) = 2.4 ТБ в Redis!\n\nРешение:\n  Хранить только для активных пользователей (DAU)\n  Инактивные пользователи: удалить их ленту из Redis\n  При следующем входе: перегенерировать (slow first load, acceptable)' },
        { type: 'heading', value: 'Bottleneck 3: Cassandra Hot Partition' },
        { type: 'text', value: 'Шардирование по user_id: знаменитости создают hot partition\n(их user_id попадает на один шард, который перегружен запросами)\n\nРешение: добавить bucket к partition key\n  (user_id, bucket) где bucket = random(0, N)\n  Чтение: агрегировать из всех buckets\n  Запись: распределена по нодам' },
        { type: 'tip', value: 'Twitter реальные числа (до смены): 400M твитов/день, Fan-out service обрабатывал 65B writes в Redis в день. Redis cluster: более 100 нод по 100 ГБ каждая. Реальный scale.' }
      ]
    },
    {
      id: 8,
      title: 'Шаг 8: Reliability и Edge Cases',
      type: 'practice',
      requirements: [
        'Описать geo-distribution и стратегию репликации',
        'Объяснить поведение при частичных отказах',
        'Описать failover для Redis и Cassandra',
        'Предложить защиту от спама и злоупотреблений',
        'Объяснить принцип shadow ban'
      ],
      hint: 'Geo-distribution: reads → ближайший датацентр, writes → ближайший + асинхронная репликация. Для partial failures: graceful degradation — показывать что-то вместо ошибки. Shadow ban: злоупотребители не знают, что их блокируют — их контент просто не виден.',
      expectedOutput: 'Geo-distribution: 4 региона, GeoDNS. Partial failures: Feed недоступен → cached версия, Redis падает → чтение из БД напрямую, Cassandra нода → replication factor=3. Защита: rate limit 300 твитов/день, ML модерация, shadow ban. Каждое решение обосновано.',
      solution: 'Geo-Distribution (4 региона: US-East, US-West, EU, Asia):\n- Reads → ближайший датацентр (данные реплицированы)\n- Writes → ближайший регион, асинхронная репликация в другие\n- GeoDNS: пользователи автоматически направляются в ближайший регион\n- Global CDN (Cloudflare/Fastly) для статики\n\nPartial Failures:\n- Feed Service недоступен → показать cached версию ленты или user timeline\n- Cassandra нода упала → replication factor=3, quorum reads с 2 из 3 нод\n- Redis нода упала → Redis Cluster автоматический failover к replica (секунды)\n\nЗащита от спама/abuse:\n- Rate limiting: 300 твитов/день с одного аккаунта\n- ML модель: обнаружение spam/hate speech в реальном времени\n- Shadow banning: злоупотребители не блокируются, но контент не виден\n- IP блокировка при признаках ботов',
      explanation: 'Отказоустойчивость строится на нескольких уровнях: репликация данных (replication factor=3), автоматический failover (Redis Cluster, Cassandra), graceful degradation (показывать что-то вместо ошибки). Защита от abuse — критично для социальных платформ: shadow ban предпочтительнее блокировки (не предупреждает ботов).',
      content: [
        { type: 'text', value: 'Обеспечиваем надёжность и обрабатываем граничные случаи.' },
        { type: 'heading', value: 'Geo-Distribution' },
        { type: 'text', value: 'Datacenter regions: US-East, US-West, EU, Asia\n\nПользователь в Токио:\n  Reads → ближайший датацентр (Азия) — данные реплицированы\n  Writes → пишем в ближайший, асинхронно реплицируем в другие\n\nGlobal CDN: Cloudflare/Fastly для статики\nGeo-DNS: направляем пользователей в ближайший регион' },
        { type: 'heading', value: 'Partial Failures' },
        { type: 'text', value: 'Feed Service недоступен:\n  Показать cached версию ленты пользователя\n  Или: загрузить только "user timeline" (последние твиты конкретных людей)\n\nCassandra нода упала:\n  Данные реплицированы на 3 ноды (replication factor=3)\n  Quorum reads: читаем с 2 из 3 → продолжаем работать\n\nRedis нода упала:\n  Redis Cluster автоматически failover к replica\n  Небольшой промежуток: читаем из БД напрямую (деградация, не падение)' },
        { type: 'heading', value: 'Защита от спама и abuse' },
        { type: 'list', value: [
          'Rate limiting: 300 твитов в день с одного аккаунта',
          'Content moderation: ML модель для определения spam/hate speech',
          'Shadow banning: злоупотребители не блокируются, но их контент не виден другим',
          'IP блокировка при признаках ботов'
        ]},
        { type: 'note', value: 'Twitter — одна из технически сложнейших систем в мире. Эволюция: 2006 — Ruby on Rails монолит → 2013 — сервисная архитектура → 2015+ — microservices. Их blog engineering.twitter.com — отличный ресурс для углубления.' }
      ]
    }
  ]
}
