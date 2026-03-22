export default {
  id: 19,
  title: 'Проектируем: Instagram',
  description: 'Полное проектирование Instagram: загрузка фото/видео, новостная лента, подписки, поиск, Stories. Photo storage и news feed generation.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и оценка',
      type: 'practice',
      content: [
        { type: 'text', value: 'Instagram — платформа для фото/видео с социальным графом.' },
        { type: 'heading', value: 'Функциональные требования' },
        { type: 'list', value: [
          'Загрузка фото и видео (Reels до 90 сек)',
          'Просмотр ленты новостей (хронологически и по алгоритму)',
          'Stories (исчезают через 24 часа)',
          'Лайки, комментарии',
          'Подписки (follow/unfollow)',
          'Поиск по хештегам и пользователям',
          'Explore страница (рекомендации)'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          '2 млрд пользователей, 500M DAU',
          '100M новых фото/видео в день',
          'Лента загружается < 500 мс',
          'Фото доставляются < 200 мс',
          'Доступность: 99.99%'
        ]},
        { type: 'heading', value: 'Оценка' },
        { type: 'text', value: 'Upload:\n  100M фото/день × 3 МБ = 300 ГБ/день нового контента\n  100M / 86400 = 1,157 uploads/сек\n\nRead:\n  500M DAU × 50 загрузок ленты = 25B feed loads/день\n  25B / 86,400 = 289,352 feed RPS ≈ 290K RPS\n\nФото отдача:\n  500M × 100 просмотров фото = 50B photo views/день\n  50B / 86,400 = 578K photo RPS (обрабатывает CDN)' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Загрузка и хранение медиа',
      type: 'practice',
      content: [
        { type: 'text', value: 'Загрузка, обработка и хранение фотографий.' },
        { type: 'heading', value: 'Upload Pipeline' },
        { type: 'text', value: 'Шаг 1: Клиент загружает оригинальное фото\n  POST /api/v1/media/upload → pre-signed S3 URL\n  Клиент загружает напрямую в S3 bucket "instagram-originals"\n\nШаг 2: S3 Event → Image Processing Service\n  S3 → SNS/SQS → Image Processor\n\nШаг 3: Image Processing\n  Загрузить оригинал из S3\n  Обработать параллельно:\n    Thumbnail: 150×150 px (для сетки профиля)\n    Feed size: 1080×1080 px (квадрат в ленте)\n    Detail: 1440×1440 px (полноэкранный просмотр)\n    Original: без изменений (хранить)\n    WebP версии каждого размера (меньше размер файла)\n  Загрузить все версии в S3 bucket "instagram-processed"\n  Обновить media metadata в БД' },
        { type: 'heading', value: 'Хранение и CDN' },
        { type: 'text', value: 'S3 структура:\n  /originals/{year}/{month}/{day}/{media_id}.jpg\n  /processed/{media_id}/150x150.jpg\n  /processed/{media_id}/1080x1080.jpg\n  /processed/{media_id}/1080x1080.webp\n\nCDN (Cloudflare или AWS CloudFront):\n  Все processed файлы → CDN\n  URL: cdn.instagram.com/p/{media_id}/1080x1080.webp\n  Cache-Control: public, max-age=86400 (1 день)\n\nЗа 10 лет: 100M фото/день × 365 × 10 × 3 версии × 3 МБ ≈ 30 ЭБ' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: Модель данных',
      type: 'practice',
      content: [
        { type: 'text', value: 'Схема данных для Instagram.' },
        { type: 'heading', value: 'Таблица posts' },
        { type: 'text', value: 'post_id       BIGINT PRIMARY KEY  (Snowflake: содержит timestamp)\nuser_id       BIGINT NOT NULL\ncaption       VARCHAR(2200)\nmedia_keys    ARRAY<VARCHAR>  // S3 ключи до 10 фото/видео\nlocation      VARCHAR(100)\nlike_count    INT DEFAULT 0\ncomment_count INT DEFAULT 0\ncreated_at    TIMESTAMP\n\nBD: Cassandra, шардирование по user_id\nIndexes: (user_id, created_at DESC) — для user profile posts' },
        { type: 'heading', value: 'Таблица user_follows' },
        { type: 'text', value: 'Два отдельных индекса в Cassandra:\n\nfollowing_by_user (кто я фоллоую):\n  follower_id  PARTITION KEY\n  followee_id  CLUSTERING KEY\n\nfollowers_of_user (кто фоллоует меня):\n  followee_id  PARTITION KEY\n  follower_id  CLUSTERING KEY\n\nОба нужны для разных запросов.' },
        { type: 'heading', value: 'Stories (в Redis)' },
        { type: 'text', value: 'Активные Stories хранятся в Redis (они недолговечные — 24 часа):\n\nHash: "stories:{user_id}" → {story_id: {media_url, created_at, views}}\nSorted Set: "active_stories" → score: expiry_timestamp, member: user_id\n\nПри запросе Stories пользователя:\n  HGETALL "stories:{user_id}"\n\nЧистка истёкших:\n  ZRANGEBYSCORE "active_stories" 0 {now} → список устаревших\n  Удалить их stories из Redis' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Алгоритмическая лента новостей',
      type: 'practice',
      content: [
        { type: 'text', value: 'Instagram давно перешёл от хронологической ленты к алгоритмической.' },
        { type: 'heading', value: 'Факторы ранжирования' },
        { type: 'text', value: 'Instagram\'s Feed Ranking учитывает:\n  Interest Score: насколько пользователь интересуется автором\n  Recency: свежие посты важнее старых\n  Relationship: друзья, часто лайкаемые аккаунты\n  Frequency: как часто пользователь открывает Instagram\n  Usage: долго ли смотрит на посты' },
        { type: 'heading', value: 'Feed Generation Architecture' },
        { type: 'text', value: 'Offline (Batch, раз в N минут):\n  ML модель переранжирует кандидатов для каждого пользователя\n  Результат → сохранить в Redis: "feed:{user_id}"\n\nOnline (при запросе):\n  1. Взять базовый кеш из Redis\n  2. Добавить свежие посты (последние 5 мин) от фоллоуинг\n  3. Исключить уже просмотренные посты (seen_filter в Redis Bitmap)\n  4. Вернуть топ-20\n\nCandidates Generation:\n  "Что показать" — от подписок + рекомендации\n  Retrieval: последние посты from following (последние 7 дней)\n  Candidate set: ~1000 постов → ранжируем → 20 для показа' },
        { type: 'heading', value: 'Seen Filter (не повторять посты)' },
        { type: 'text', value: 'Bloom Filter: "видел ли пользователь этот пост?"\n  SETBIT "seen:{user_id}" {post_id % BIT_ARRAY_SIZE} 1\n  GETBIT "seen:{user_id}" {post_id % BIT_ARRAY_SIZE}\n\nФалшь-позитив (иногда не покажем непросмотренный) — допустимо\nПамять: 10 млн постов на пользователя = 1.25 МБ\n500M пользователей × 1.25 МБ = 625 ТБ — слишком много!\n\nРеальное решение: хранить только для активных, TTL 7 дней' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Поиск и Explore',
      type: 'practice',
      content: [
        { type: 'text', value: 'Поиск по контенту и страница рекомендаций.' },
        { type: 'heading', value: 'Поиск по хештегам' },
        { type: 'text', value: 'При создании поста → извлечь хештеги из caption\n  "#sunset #travel #photography"\n\nИндексирование:\n  Elasticsearch: {hashtag: "sunset", post_id, created_at, like_count}\n\nПоиск:\n  GET /api/v1/search/hashtags?q=sunset\n  → ES: match {hashtag: "sunset"}, sort по post_count DESC\n\n  GET /api/v1/hashtags/sunset/posts?cursor={cursor}\n  → Cassandra: {hashtag: "sunset"}, posts sorted by like_count' },
        { type: 'heading', value: 'Explore Page (Рекомендации)' },
        { type: 'text', value: 'Explore Page — персонализированные рекомендации постов не от подписок.\n\nAlgorithm (упрощённо):\n1. Анализировать интересы: что лайкал, что смотрел долго, какие хештеги\n2. Candidate generation: \n   - Посты с похожими хештегами\n   - Посты от "похожих пользователей"\n   - Trending посты в регионе\n3. Ranking: ML модель ранжирует кандидатов\n4. Diversity: не показывать только один тип контента\n5. Personalization: у каждого пользователя уникальная страница\n\nОффлайн предвычисление:\n  Batch job раз в час предвычисляет Explore Feed для всех пользователей\n  Результат → Redis/Cassandra\n  Онлайн: дополнить трендовыми постами (real-time)' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: Лайки, комментарии и счётчики',
      type: 'practice',
      content: [
        { type: 'text', value: 'Социальные взаимодействия и их масштабирование.' },
        { type: 'heading', value: 'Лайки' },
        { type: 'text', value: 'Таблица likes (Cassandra):\n  post_id     PARTITION KEY\n  user_id     CLUSTERING KEY\n  created_at  TIMESTAMP\n\nОбратный индекс:\n  user_likes:\n    user_id   PARTITION KEY\n    post_id   CLUSTERING KEY\n    created_at\n\nПроверка "лайкнул ли я?":\n  SELECT FROM likes WHERE post_id=? AND user_id=?\n\nСчётчик лайков:\n  like_count в Redis INCR/DECR (быстро)\n  Batch flush в Cassandra каждые 30 сек' },
        { type: 'heading', value: 'Комментарии' },
        { type: 'text', value: 'Таблица comments (Cassandra):\n  post_id      PARTITION KEY\n  comment_id   CLUSTERING KEY DESC (Snowflake)\n  user_id\n  text         VARCHAR(2200)\n  parent_id    BIGINT NULL  (для ответов на комментарии)\n  created_at\n\nЗапрос комментариев к посту:\n  SELECT * FROM comments WHERE post_id = ? LIMIT 20\n  (последние 20 комментариев)\n\nМодерация: ML модель проверяет на спам/hate speech\n  При violation: скрыть комментарий (не удалять)' },
        { type: 'note', value: 'Instagram реальные факты: построен на Python/Django (монолит до ~2015), PostgreSQL, Cassandra, Redis. Команда из 12 инженеров обслуживала 30M пользователей до покупки Facebook в 2012 за $1 млрд. Простота архитектуры — секрет успеха.' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Итоговая архитектура',
      type: 'practice',
      content: [
        { type: 'text', value: 'Сводная архитектура Instagram.' },
        { type: 'heading', value: 'Сервисы' },
        { type: 'text', value: 'Media Service: загрузка и обработка фото/видео\nPost Service: создание и получение постов\nFeed Service: генерация и кеширование ленты\nSocial Service: follow/unfollow, social graph\nSearch Service: Elasticsearch индексирование и поиск\nStories Service: Stories с TTL\nNotification Service: push уведомления\nUser Service: профили, аутентификация\nRecommendation Service: Explore, рекомендации' },
        { type: 'heading', value: 'Key Design Decisions' },
        { type: 'list', value: [
          'Direct upload to S3 (bypass servers) — масштабируемая загрузка',
          'Multiple image sizes precomputed — быстрая загрузка на разных устройствах',
          'Push-based feed для обычных пользователей, pull для знаменитостей',
          'Redis для счётчиков (like_count) с batch persistence',
          'Stories в Redis с TTL — нет необходимости в очистке вручную',
          'Cassandra для постов — high write throughput, простые запросы по partition key'
        ]},
        { type: 'tip', value: 'На интервью: подчеркните что Instagram очень похож на Twitter архитектурно (Feed, Social Graph, Media). Главные отличия: медиа-ориентированность (обработка изображений), Stories (эфемерный контент), Explore (discovery).' }
      ]
    }
  ]
}
