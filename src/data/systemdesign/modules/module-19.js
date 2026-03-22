export default {
  id: 19,
  title: 'Проектируем: Instagram',
  description: 'Полное проектирование Instagram: загрузка фото/видео, новостная лента, подписки, поиск, Stories. Photo storage и news feed generation.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и оценка',
      type: 'practice',
      description: 'Определение требований Instagram и оценка масштаба: 100M фото/день = 300 ГБ/день, 290K feed RPS — вывод о необходимости S3+CDN, Redis кеша лент и Cassandra.',
      requirements: [
        'Определить функциональные требования (фото, лента, Stories)',
        'Указать нефункциональные требования (масштаб, latency)',
        'Рассчитать upload RPS и объём данных',
        'Рассчитать feed read RPS',
        'Сделать вывод о ключевых компонентах'
      ],
      hint: 'Instagram = медиа-ориентированный Twitter. 100M фото/день × 3 МБ = 300 ГБ/день — нужно объектное хранилище + CDN. Feed: 500M DAU × 50 загрузок = 290K RPS — нужен кеш лент. Stories — эфемерный контент (24 часа) — Redis с TTL.',
      expectedOutput: 'Upload: 300 ГБ/день, 1 157 uploads/сек. Feed: 290K RPS (кеш обязателен). Фото: 578K RPS (CDN). Хранилище за 10 лет: ~30 ЭБ. Вывод: S3+CDN для медиа, Redis для лент и Stories, Cassandra для постов.',
      solution: 'Функциональные требования:\n- Загрузка фото и видео (Reels до 90 сек)\n- Лента новостей (хронологически и по алгоритму)\n- Stories (исчезают через 24 часа)\n- Лайки, комментарии\n- Подписки (follow/unfollow)\n- Поиск по хештегам и пользователям\n- Explore (рекомендации)\n\nНефункциональные:\n- 2B пользователей, 500M DAU\n- 100M новых фото/видео в день\n- Лента < 500 мс, фото < 200 мс\n- Доступность: 99.99%\n\nОценка:\n- Upload: 100M фото × 3 МБ = 300 ГБ/день, 1,157 uploads/сек\n- Feed reads: 500M × 50 загрузок / 86,400 ≈ 290K RPS\n- Photo views: 500M × 100 / 86,400 ≈ 578K RPS (обрабатывает CDN)',
      explanation: '290K RPS на ленту и 578K на фото — значительная нагрузка, которую решает CDN (фото) и кеш лент в Redis (feed). Upload 300 ГБ/день требует объектного хранилища (S3) и асинхронной обработки изображений. Stories — эфемерный контент: Redis с TTL идеален, не нужна дорогая долгосрочная персистентность.',
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
      description: 'Upload pipeline через pre-signed S3 URL, параллельная обработка изображений в несколько форматов (thumbnail/feed/detail + WebP) и CDN структура для быстрой раздачи.',
      requirements: [
        'Описать upload pipeline через pre-signed S3 URL',
        'Перечислить все размеры изображений для обработки',
        'Объяснить преимущество WebP',
        'Описать структуру S3 для хранения файлов',
        'Объяснить зачем предгенерировать размеры при upload, не при запросе'
      ],
      hint: 'Прямая загрузка в S3 bypass серверов — сервер не bottleneck. Image Processing: несколько размеров параллельно (thumbnail, feed, detail) + WebP версии. WebP: на 25–35% меньше JPEG при том же качестве. Предгенерация: CDN раздаёт готовые файлы, не нужна динамическая обработка.',
      expectedOutput: 'Upload: POST /media → pre-signed S3 URL → клиент загружает напрямую. S3 Event → Image Processor: thumbnail 150×150, feed 1080×1080, detail 1440×1440 + WebP. S3 структура описана. CDN URL: cdn.instagram.com/p/{media_id}/1080x1080.webp. Предгенерация обоснована.',
      solution: 'Upload Pipeline:\n1. POST /api/v1/media/upload → pre-signed S3 URL\n2. Клиент загружает оригинал напрямую в S3 "instagram-originals"\n3. S3 Event → SNS/SQS → Image Processing Service\n\nImage Processing (параллельно):\n- Thumbnail: 150×150 px (сетка профиля)\n- Feed size: 1080×1080 px\n- Detail: 1440×1440 px\n- WebP версии каждого размера\n- Обновить media metadata в БД\n\nS3 структура:\n/originals/{year}/{month}/{day}/{media_id}.jpg\n/processed/{media_id}/150x150.webp\n/processed/{media_id}/1080x1080.webp\n\nCDN (Cloudflare/CloudFront):\nURL: cdn.instagram.com/p/{media_id}/1080x1080.webp\nCache-Control: public, max-age=86400\n\nЗа 10 лет: ~30 ЭБ хранилища',
      explanation: 'Прямая загрузка в S3 (bypass серверов) + несколько размеров изображений — два ключевых решения. WebP снижает размер файлов на 25–35% по сравнению с JPEG при том же качестве. Предгенерация размеров при upload (не при запросе) упрощает CDN: все запросы идут к готовым файлам, не к динамической обработке.',
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
      description: 'Схема данных Instagram: таблица posts со Snowflake ID, два индекса user_follows для разных запросов, Stories в Redis с TTL, выбор хранилищ для каждого типа данных.',
      requirements: [
        'Спроектировать таблицу posts с полем media_keys',
        'Описать два индекса для user_follows',
        'Объяснить хранение Stories в Redis с TTL',
        'Выбрать хранилище для каждого типа данных',
        'Обосновать Snowflake ID для постов'
      ],
      hint: 'Два индекса для user_follows — для двух разных запросов: "кого я фоллоую" (follower_id как PK) и "кто фоллоует меня" (followee_id как PK). Stories в Redis: TTL = автоудаление через 24 часа без фонового cleanup. Snowflake ID содержит timestamp — сортировка без дополнительного поля.',
      expectedOutput: 'Таблица posts: Snowflake PK, media_keys ARRAY. Два индекса user_follows: following_by_user и followers_of_user — оба необходимы. Stories: Redis Hash "stories:{user_id}" + Sorted Set для чистки. Хранилища: Cassandra (posts), PostgreSQL (users), Redis (stories, feed), S3+CDN (media).',
      solution: 'Таблица posts (Cassandra, шардирование по user_id):\npost_id BIGINT PK (Snowflake), user_id BIGINT\ncaption VARCHAR(2200), media_keys ARRAY<VARCHAR>\nlike_count INT, comment_count INT, created_at TIMESTAMP\nИндекс: (user_id, created_at DESC)\n\nUser follows (два Cassandra индекса):\nfollowing_by_user: follower_id → followee_id (кто я фоллоую)\nfollowers_of_user: followee_id → follower_id (кто фоллоует меня)\n\nStories (Redis — эфемерные, 24 часа):\nHash: "stories:{user_id}" → {story_id: {media_url, created_at, views}}\nSorted Set: "active_stories" → score: expiry_timestamp, member: user_id\nЧистка: ZRANGEBYSCORE "active_stories" 0 {now} → удалить устаревшие\n\nВыбор хранилищ:\n- Posts: Cassandra (высокий write throughput)\n- User data: PostgreSQL (ACID)\n- Stories: Redis (TTL = автоудаление)\n- Likes: Cassandra (два индекса)\n- Media: S3 + CDN',
      explanation: 'Два индекса для user_follows — необходимость: "кто я фоллоую" и "кто фоллоует меня" — разные запросы с разными partition key. Stories в Redis с TTL — элегантное решение: Redis автоматически удаляет истёкшие ключи, не нужен фоновый cleanup job. Snowflake ID содержит timestamp — сортировка по времени без дополнительного индекса.',
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
      description: 'Алгоритм ранжирования ленты Instagram: факторы interest/recency/relationship, гибридный offline (ML batch) + online (fresh posts + Bloom Filter) pipeline для генерации топ-20 постов.',
      requirements: [
        'Описать факторы ранжирования Instagram Feed',
        'Описать offline batch компонент генерации ленты',
        'Описать online real-time компонент при запросе',
        'Объяснить Bloom Filter для seen_filter',
        'Описать pipeline: candidates → ranking → топ-20'
      ],
      hint: 'Гибридный offline+online подход: offline (ML на полном датасете, раз в N минут) → результат в Redis. Online при запросе: взять кеш + добавить свежие посты + исключить просмотренные через Bloom Filter + вернуть топ-20. Bloom Filter: константная память vs точный подсчёт.',
      expectedOutput: 'Факторы ранжирования: interest score, recency, relationship, engagement probability. Offline: ML переранжирует кандидатов → Redis "feed:{user_id}". Online: базовый кеш + свежие посты 5 мин + Bloom Filter seen_filter + топ-20. Candidates: ~1000 постов от подписок за 7 дней.',
      solution: 'Факторы ранжирования ленты Instagram:\n- Interest Score: насколько пользователь взаимодействовал с автором\n- Recency: свежесть поста\n- Relationship: часто лайкаемые, близкие друзья\n- Engagement probability: ML предсказание вероятности лайка/комментария\n\nFeed Generation Architecture:\nОффлайн (Batch, раз в N минут):\n- ML модель переранжирует кандидатов для каждого пользователя\n- Результат → Redis: "feed:{user_id}"\n\nОнлайн (при запросе):\n1. Базовый кеш из Redis\n2. Добавить свежие посты за последние 5 мин от followings\n3. Исключить просмотренные (Bloom Filter в Redis Bitmap)\n4. Вернуть топ-20\n\nCandidates (~1000 постов → ранжируем → 20 для показа):\n- Последние посты from followings за 7 дней\n- Рекомендации от Explore',
      explanation: 'Гибридный offline+online подход — стандарт для ML-ранжированных лент. Offline (тяжёлые модели на полном датасете) + Online (лёгкая real-time корректировка) = баланс качества и latency. Bloom Filter для seen_filter экономит память: точный подсчёт потребовал бы 500M × N MB, Bloom Filter даёт приемлемую погрешность за константную память.',
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
      description: 'Поиск хештегов через Elasticsearch с автодополнением на Redis Sorted Set; Explore Page — ML-based рекомендации через offline предвычисление + online trending компонент.',
      requirements: [
        'Описать индексирование хештегов в Elasticsearch',
        'Спроектировать автодополнение хештегов',
        'Описать алгоритм Explore Page (рекомендации)',
        'Объяснить offline предвычисление Explore',
        'Описать отличие Поиска и Explore как систем'
      ],
      hint: 'Поиск и Explore — разные задачи: Elasticsearch для full-text поиска по введённому тексту, ML pipeline для discovery (показать что понравится). Offline предвычисление раз в час — баланс актуальности и стоимости. Trending компонент добавляется онлайн для свежести.',
      expectedOutput: 'Поиск: Elasticsearch, хештеги индексируются при создании поста. Автодополнение: Redis Sorted Set популярных хештегов. Explore: candidates (похожие хештеги + collaborative filtering + trending) → ML ranking → diversity. Offline раз в час → Redis/Cassandra. Онлайн: + trending real-time.',
      solution: 'Поиск по хештегам:\n- При создании поста → извлечь хештеги из caption\n- Elasticsearch: {hashtag: "sunset", post_id, created_at, like_count}\n- GET /search/hashtags?q=sunset → ES match + sort по post_count DESC\n- Cassandra: посты по хештегу (partition: hashtag, clustering: like_count DESC)\n- Автодополнение: Redis Sorted Set популярных хештегов\n\nExplore Page (персонализированные рекомендации):\n1. Анализ интересов: что лайкал, что смотрел долго, хештеги\n2. Candidate generation:\n   - Посты с похожими хештегами\n   - Посты от "похожих пользователей" (collaborative filtering)\n   - Trending посты в регионе\n3. ML Ranking: score каждого кандидата\n4. Diversity: разные типы контента\n5. Оффлайн предвычисление (раз в час) → Redis/Cassandra\n6. Онлайн: добавить trending real-time + A/B тестирование',
      explanation: 'Поиск и Explore — разные системы: Elasticsearch для full-text поиска по тексту, ML pipeline для discovery и рекомендаций. Предвычисление Explore раз в час — баланс между актуальностью (не устаревшие рекомендации) и стоимостью (не пересчитывать на каждый запрос). Trending компонент добавляется онлайн для свежести.',
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
      description: 'Таблица likes с двумя Cassandra-индексами для разных запросов; Redis INCR для счётчиков + batch flush в БД; soft delete для модерации комментариев.',
      requirements: [
        'Спроектировать таблицу likes с двумя индексами',
        'Описать Redis INCR для счётчиков + batch flush',
        'Спроектировать таблицу comments',
        'Объяснить soft delete для модерации',
        'Рассчитать снижение нагрузки от batch flush'
      ],
      hint: 'Два индекса для лайков: (post_id → user_id) для "кто лайкнул пост" и (user_id → post_id) для "что лайкнул пользователь". Redis INCR/DECR для счётчиков + batch flush каждые 30 сек. Soft delete: скрыть комментарий без физического удаления — можно восстановить при ошибке модерации.',
      expectedOutput: 'Таблица likes: два индекса обоснованы. Счётчик: Redis INCR "like_count:{post_id}" → batch flush в Cassandra каждые 30 сек. Снижение нагрузки в тысячи раз. Таблица comments: parent_id для threading. Модерация: ML + soft delete (скрыть, не удалить).',
      solution: 'Лайки (Cassandra):\nТаблица likes: PK (post_id, user_id) → created_at\nОбратный индекс user_likes: PK (user_id, post_id)\nСчётчик: Redis INCR/DECR "like_count:{post_id}" → batch flush в Cassandra каждые 30 сек\n\nПроверка "лайкнул ли я?":\nSELECT FROM likes WHERE post_id=? AND user_id=? → O(1) по PK\n\nКомментарии (Cassandra):\nтаблица comments: PK (post_id, comment_id DESC)\nuser_id, text VARCHAR(2200), parent_id (для ответов), created_at\nЗапрос: SELECT * FROM comments WHERE post_id=? LIMIT 20\n\nМодерация:\n- ML модель проверяет на спам/hate speech в реальном времени\n- Violation: скрыть комментарий (soft delete, не физическое удаление)\n\nСчётчики:\n- Redis INCR/DECR для лайков и комментариев\n- Batch flush в БД каждые 30 сек — снижение нагрузки в тысячи раз',
      explanation: 'Redis для счётчиков + batch flush — образцовый паттерн для высокочастотных инкрементов. Потеря ~30 сек данных при сбое Redis допустима для счётчиков лайков. Два индекса для лайков решают два разных запроса: "кто лайкнул этот пост" и "что лайкнул этот пользователь". Soft delete для комментариев позволяет восстановить при ошибке модерации.',
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
      description: 'Итоговая архитектура Instagram: 9 сервисов, 6 ключевых архитектурных решений, сравнение с Twitter — сходство Feed/Social Graph при уникальности медиа-обработки и Stories TTL.',
      requirements: [
        'Перечислить все сервисы Instagram',
        'Назвать 6 ключевых архитектурных решений',
        'Объяснить сходство и отличие от Twitter',
        'Обосновать выбор Cassandra для постов',
        'Описать роль Redis в системе'
      ],
      hint: 'Instagram архитектурно близок к Twitter (Feed, Social Graph) с ключевыми отличиями: медиа-ориентированность (обработка изображений), Stories (эфемерный контент TTL), Explore (discovery). Cassandra для постов: high write throughput, простые запросы по partition key.',
      expectedOutput: 'Сервисы: Media, Post, Feed, Social, Search, Stories, Notification, User, Recommendation. 6 решений: direct S3 upload, precomputed image sizes, push/pull hybrid, Redis INCR+batch, Stories TTL, Cassandra для постов. Сравнение с Twitter: Feed и Social Graph похожи, медиа и Stories уникальны.',
      solution: 'Сервисы Instagram:\n- Media Service: загрузка, обработка фото/видео → S3 + CDN\n- Post Service: создание/получение постов → Cassandra\n- Feed Service: генерация и кеширование ленты → Redis\n- Social Service: follow/unfollow, social graph → Cassandra\n- Search Service: Elasticsearch + автодополнение\n- Stories Service: Stories с TTL → Redis\n- Notification Service: push уведомления → Kafka + APNs/FCM\n- User Service: профили, аутентификация → PostgreSQL\n- Recommendation Service: Explore + ML рекомендации\n\nКлючевые архитектурные решения:\n1. Прямая загрузка в S3 → серверы не bottleneck\n2. Предгенерация размеров изображений → CDN раздаёт готовые файлы\n3. Push-based feed (обычные), pull для знаменитостей\n4. Redis INCR для счётчиков + batch persistence\n5. Stories в Redis с TTL — автоочистка без background jobs\n6. Cassandra для постов — high write throughput, простые запросы по PK',
      explanation: 'Instagram архитектурно похож на Twitter (Feed, Social Graph, Media) с ключевыми отличиями: медиа-ориентированность (обработка изображений), Stories (эфемерный контент с TTL), Explore (discovery через ML). Простота исходной архитектуры (Python/Django + PostgreSQL на 12 инженеров) — пример "monolith-first" подхода до реального масштаба.',
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
