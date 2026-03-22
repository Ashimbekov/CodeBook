export default {
  id: 16,
  title: 'Проектируем: Twitter/X',
  description: 'Полное проектирование Twitter: твиты, лента новостей (News Feed), подписки, поиск, тренды. Fan-out стратегии, масштабирование до миллиардов.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и масштаб',
      type: 'practice',
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
