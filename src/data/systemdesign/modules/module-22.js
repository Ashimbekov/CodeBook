export default {
  id: 22,
  title: 'Практикум: Задачи System Design',
  description: 'Самостоятельная практика: 10 задач с разбором. Полные решения для самопроверки после попытки.',
  lessons: [
    {
      id: 1,
      title: 'Задача 1: Спроектируй систему ограничения скорости (Rate Limiter)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Попробуйте решить задачу самостоятельно (20–30 минут), затем сверьтесь с разбором.' },
        { type: 'heading', value: 'Условие задачи' },
        { type: 'text', value: 'Спроектируй распределённый Rate Limiter как сервис.\nТребования:\n  - До 10,000 правил лимитирования (per user, per API key, per IP)\n  - Обрабатывать 5M запросов в секунду\n  - Latency добавляемая Rate Limiter: < 1 мс\n  - Алгоритм: Sliding Window\n  - Multi-datacenter (правила глобальные)' },
        { type: 'heading', value: 'Разбор решения' },
        { type: 'text', value: 'Архитектура:\n  [Client] → [API Gateway + Rate Limiter Middleware]\n                    ↓ check\n              [Rate Limiter Service]\n                    ↓\n              [Redis Cluster]\n\nData Model в Redis (Sliding Window Log):\n  key: "rl:{rule_id}:{user_id}:{window_floor}"\n  type: Sorted Set\n  score: timestamp\n  member: request_id (или timestamp с nano)\n\nФункция проверки:\n  Атомарный Lua скрипт:\n  1. ZREMRANGEBYSCORE: удалить записи старше window\n  2. ZCARD: подсчитать оставшиеся\n  3. Если count < limit → ZADD new record, EXPIRE → allow\n  4. Иначе → reject\n\nМасштабирование:\n  Redis Cluster: шардировать по user_id\n  8 шардов × 125K ops/сек = 1M ops/сек общий throughput\n  5 таких кластеров = 5M/сек\n  Latency: ~0.5 мс (Redis + сеть в одном датацентре)\n\nGlobal Multi-DC:\n  Каждый DC имеет свой Redis cluster\n  Лимиты "per DC" (eventually consistent globally)\n  Для глобального лимита: Redis Global или Gossip protocol для синхронизации счётчиков' },
        { type: 'tip', value: 'Ключевой момент: Lua скрипт обеспечивает атомарность в Redis. Без него race condition между ZCARD и ZADD.' }
      ]
    },
    {
      id: 2,
      title: 'Задача 2: Спроектируй систему поиска (Google Search)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Упрощённая версия поисковой системы.' },
        { type: 'heading', value: 'Условие задачи' },
        { type: 'text', value: 'Спроектируй упрощённый поисковик.\nТребования:\n  - Индексировать 10 млрд веб-страниц\n  - Поиск: запрос → топ-10 релевантных результатов за < 500 мс\n  - Crawling: обойти весь интернет, обновлять раз в 30 дней\n  - Ranking по релевантности и "авторитетности"' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Компоненты:\n\n1. Web Crawler:\n   URL Frontier (очередь URL к обходу) → Crawler Workers\n   Crawler скачивает страницу → передаёт парсеру\n   DNS Resolver с кешем (не нагружать DNS)\n   Politeness: robots.txt, crawl-delay\n\n2. Document Processor:\n   HTML Parser: извлечь текст, ссылки\n   Language Detection\n   Deduplication: SimHash для нахождения дублей\n   Link Extractor: добавить новые URL в Frontier\n\n3. Inverted Index:\n   word → [doc1: pos1, doc2: pos2, ...]\n   "python" → [page_123: [15, 87, 203], page_456: [5]]\n   Хранение: Apache Lucene/Elasticsearch\n   Размер: 10B страниц × 1000 слов × 8 байт = 80 ТБ\n\n4. Ranking:\n   TF-IDF: насколько слово важно в документе\n   PageRank: сколько других страниц ссылаются (авторитетность)\n   Query Time: merge posting lists → rank → top-10\n\n5. Serving:\n   Query → Index Servers (параллельно по шардам)\n   Merge results → Re-rank → Return' }
      ]
    },
    {
      id: 3,
      title: 'Задача 3: Спроектируй Dropbox (File Storage)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Синхронизация файлов между устройствами.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: '100M пользователей. Синхронизация файлов (desktop, mobile, web).\nUpload файлов до 10 ГБ. Versioning (последние 30 версий).\nSharing папок между пользователями. Offline access.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Block Storage (ключевая идея):\n  Файл разбивается на блоки по 4 МБ\n  Каждый блок: block_hash = SHA256(block_data)\n  Upload только изменившихся блоков!\n  Дедупликация: если block_hash уже в S3 → не загружать\n\nData Flow (Upload):\n  Client: разбить файл на блоки → вычислить хеши\n  POST /api/check_blocks {block_hashes} → сервер говорит какие нужны\n  Загрузить только отсутствующие блоки в S3\n  POST /api/commit_file {file_path, block_hashes_list}\n\nData Flow (Sync другого устройства):\n  Long Polling или WebSocket: сервер уведомляет об изменениях\n  Client скачивает только изменившиеся блоки\n\nMetadata Service (PostgreSQL):\n  files: file_id, user_id, path, blocks_list, version, modified_at\n  blocks: block_hash (PK), s3_key, size\n  events: event_id, user_id, type, file_id, timestamp (для sync)' }
      ]
    },
    {
      id: 4,
      title: 'Задача 4: Спроектируй систему нотификаций',
      type: 'practice',
      content: [
        { type: 'text', value: 'Push, email, SMS уведомления в масштабе.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: '1 млрд пользователей. Доставлять 10B уведомлений в день.\nКаналы: Push (iOS/Android), Email, SMS.\nПриоритеты: срочные (OTP) и обычные (маркетинг).\nШаблоны и персонализация. Аналитика доставки.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Архитектура:\n\n[Source Services] → Publish events → [Kafka]\n                                           ↓\n                              [Notification Service]\n                                    /        \\\n                           [Priority Queue]  [Bulk Queue]\n                                    ↓               ↓\n                           [P1: Urgent]    [P2: Marketing]\n                              Workers           Workers\n                            ↓  ↓  ↓           ↓  ↓  ↓\n                          APNs FCM Email     APNs FCM Email\n\nDevice Token Store (Cassandra):\n  user_id → [{device_id, platform, token, active}]\n\nTemplate Engine:\n  Шаблоны в S3/DB\n  "Привет, {{name}}! Ваш заказ #{{order_id}} готов"\n  Рендеринг → готовое сообщение\n\nDead Letter Handling:\n  APNs/FCM вернул ошибку → retry с exponential backoff\n  Invalid token → удалить из Device Token Store\n\nAnalytics:\n  Kafka: события sent, delivered, opened, clicked\n  ClickHouse: агрегация аналитики' }
      ]
    },
    {
      id: 5,
      title: 'Задача 5: Спроектируй систему live streaming',
      type: 'practice',
      content: [
        { type: 'text', value: 'Твитч/YouTube Live — видео стриминг в реальном времени.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: '100K одновременных стримов. 1M одновременных зрителей на один популярный стрим.\nЗадержка: < 5 сек (live), < 30 сек (DVR воспроизведение).\nAdaptive bitrate. Chat в реальном времени.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Ingest Pipeline (стример загружает):\n  Streamer → RTMP → Ingest Server\n  Ingest Server: принять видео поток\n  Transcode (параллельно): 360p, 720p, 1080p → HLS segments (2 сек каждый)\n  Segment Storage: S3 + CDN\n  Playlist (.m3u8): обновляется каждые 2 сек с новыми сегментами\n\nDistribution (зрители смотрят):\n  CDN с очень коротким TTL (2–4 сек для live segments)\n  Viewer → CDN Edge → получить latest HLS segment\n  Если Edge нет → Regional PoP → Ingest Server\n\nLow Latency:\n  Обычный HLS: задержка 10–30 сек (много сегментов в буфере)\n  Low-Latency HLS (Apple LL-HLS): сегменты по 0.2 сек, задержка 1–2 сек\n  WebRTC: < 1 сек задержка (для очень интерактивных стримов)\n\nChat при 1M concurrent:\n  Partitioned channels: группировать пользователей по "chat rooms" of 10K\n  Каждая комната → своя Kafka partition → WebSocket Workers\n  Moderация: ML real-time + manual' }
      ]
    },
    {
      id: 6,
      title: 'Задача 6: Спроектируй distributed job scheduler',
      type: 'practice',
      content: [
        { type: 'text', value: 'Планировщик задач как cron, но распределённый.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: 'Задачи запускаются по расписанию (cron-like) или отложенно (через N минут).\n100M задач. 1M задач в день запускаются. Exactly-once execution.\nРезультаты задач сохраняются. Retry при ошибке.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Хранение задач (PostgreSQL):\n  tasks: id, cron_expr, next_run_at, status, handler, payload, retry_count\n  task_runs: run_id, task_id, started_at, finished_at, status, result\n\nScheduler (Polling approach):\n  Каждые 1 сек: SELECT * FROM tasks\n    WHERE next_run_at <= NOW() AND status = "SCHEDULED"\n    FOR UPDATE SKIP LOCKED\n    LIMIT 100\n  FOR UPDATE SKIP LOCKED: только один Scheduler берёт строку\n  Это distributed lock через PostgreSQL!\ \n  Обновить: status = "RUNNING", locked_by = scheduler_id\n  Publish в Kafka queue для execution\n\nWorkers:\n  Kafka consumers выполняют задачи\n  По завершении → UPDATE task_runs SET status = "SUCCESS"\n  Пересчитать next_run_at по cron_expr\n  При ошибке: retry_count++, рассчитать next_retry (exponential backoff)\n\nMissed Jobs (если system was down):\n  При старте: найти задачи с next_run_at в прошлом → запустить сразу' }
      ]
    },
    {
      id: 7,
      title: 'Задача 7: Спроектируй Ticketmaster (продажа билетов)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Продажа билетов с конкурентным доступом.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: 'Продажа билетов на концерты/мероприятия.\nНа популярные события одновременно тысячи пользователей борются за билеты.\nНельзя продать одно место дважды. Виртуальная очередь.\nСтатус мест в реальном времени.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Data Model:\n  events: event_id, name, venue, date\n  seats: seat_id, event_id, section, row, number, status [AVAILABLE/HELD/SOLD]\n  orders: order_id, user_id, seat_id, status, expires_at\n\nHolding механизм (временное резервирование):\n  Пользователь выбрал место → HOLD на 10 минут\n  Если не оплатил → автоматически освободить\n\nImplementation без race condition:\n  // Redis Lua script — атомарно!\n  if redis.get("seat:{seat_id}:status") == "AVAILABLE":\n    redis.set("seat:{seat_id}:status", "HELD:user:{user_id}")\n    redis.expire("seat:{seat_id}:status", 600)  // 10 мин\n    return "held"\n  else:\n    return "not_available"\n\nВиртуальная очередь при высоком спросе:\n  За 10 мин до начала продаж: пользователи "становятся в очередь"\n  Каждому выдаётся случайное число (lottery)\n  В момент X: сортировать по случайному числу → это очередь\n  Пропускать пачками (Rate limiting для честности)\n\nReal-time обновления мест:\n  WebSocket или SSE (Server-Sent Events)\n  При изменении статуса места → pub/sub → клиенты' }
      ]
    },
    {
      id: 8,
      title: 'Задача 8: Спроектируй Stock Exchange (биржу)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Самая требовательная задача по latency.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: 'Электронная торговая биржа (упрощённая).\nOrder book: bid/ask заявки. Matching Engine: совпадение заявок.\n100,000 orders в секунду. Latency: < 1 мс для matching.\nАтомарность: нельзя потерять ни одну транзакцию.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Matching Engine (самый критичный компонент):\n  Однопоточный! (нет race conditions)\n  In-memory Order Book: \n    Bids: Max-Heap (покупатели, от высокой цены)\n    Asks: Min-Heap (продавцы, от низкой цены)\n  \n  Matching алгоритм:\n    Новая buy order с ценой P\n    if Ask.peek().price <= P: → match!\n    Создать Trade, уменьшить объём, удалить из order book\n\nPersistence:\n  Event Log (Kafka/Write-Ahead Log): каждый ордер и трейд\n  Sequence number: каждое событие имеет уникальный номер\n  Replay: восстановление Order Book из лога\n\nArchitecture:\n  [Order Router] → Kafka (в порядке поступления) → [Matching Engine]\n  Matching Engine → [Trade Events Kafka] → [Settlement Service]\n  \n  Sequencer: гарантирует порядок событий (один поток, один процессор)\n  \nFault Tolerance:\n  Primary Matching Engine + Hot Standby\n  Standby читает тот же Kafka log → синхронизирован\n  При падении Primary → Standby берёт управление (~100 мс)' }
      ]
    },
    {
      id: 9,
      title: 'Задача 9: Спроектируй Google Docs (совместное редактирование)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Real-time совместное редактирование документов.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: 'Несколько пользователей одновременно редактируют документ.\nИзменения видны в реальном времени (< 500 мс).\nCursor positions отображаются для других пользователей.\nVersioning: история правок, возможность undo/redo.' },
        { type: 'heading', value: 'Разбор: Operational Transformation (OT)' },
        { type: 'text', value: 'Проблема конкурентных изменений:\n  User A: вставить "X" на позицию 5\n  User B: удалить символ на позицию 3\n  Оба послали изменения почти одновременно\n  Если применить без трансформации — документ рассинхронизируется\n\nOperational Transformation:\n  Сервер получает op от User A: {type: "insert", pos: 5, char: "X"}\n  Затем op от User B: {type: "delete", pos: 3}\n  \n  Трансформировать op B относительно op A:\n  После вставки символа на pos 5 → позиция удаления сдвигается\n  Если delete.pos < insert.pos: нет изменений\n  Если delete.pos >= insert.pos: delete.pos += 1\n  \nAlternative: CRDTs (Conflict-free Replicated Data Types)\n  Современный подход (Figma, Linear используют CRDTs)\n  Каждый символ имеет уникальный ID\n  Операции всегда коммутативны (порядок не важен)\n  Не нужен центральный сервер для трансформации\n\nData Model:\n  document_id → list of operations (append-only log)\n  Snapshot (каждые 100 операций): полный текст документа\n  Apply операции к snapshot → текущее состояние' }
      ]
    },
    {
      id: 10,
      title: 'Задача 10: Спроектируй систему рекомендаций',
      type: 'practice',
      content: [
        { type: 'text', value: 'Netflix/Spotify-style рекомендательная система.' },
        { type: 'heading', value: 'Условие' },
        { type: 'text', value: 'Рекомендательная система для стримингового сервиса (как Netflix).\n200M пользователей. 50K фильмов в каталоге.\nПерсонализированные рекомендации на главной странице.\nXобновление рекомендаций ежедневно. Cold start для новых пользователей.' },
        { type: 'heading', value: 'Разбор' },
        { type: 'text', value: 'Два уровня системы:\n\n1. Candidate Generation (что показать — тысячи кандидатов):\n  Collaborative Filtering: "пользователи похожие на вас смотрели..."\n    User-Item Matrix: users × items → binary (watched/not)\n    Matrix Factorization (ALS): найти latent factors\n    User embedding ≈ Item embedding → кандидаты\n  \n  Content-Based: похожие на просмотренные\n    Item features: жанр, актёры, режиссёр, год\n    Cosine similarity\n\n2. Ranking (отранжировать кандидатов → топ-20):\n  ML модель (Two-Tower Neural Network):\n    Input: user features + item features + context (время, устройство)\n    Output: probability of engagement\n  Features: история просмотров, лайки, время просмотра, время суток\n\nOffline Pipeline (ежедневно):\n  Batch обучение модели на всех данных\n  Предвычислить топ-500 кандидатов для каждого пользователя\n  Сохранить в Redis: "recs:{user_id}" → [item_ids]\n\nOnline Serving:\n  GET /recommendations → Redis lookup (< 5 мс)\n  Real-time re-ranking: учесть недавние действия (последние 30 мин)\n  A/B тестирование: разные модели для разных сегментов пользователей\n\nCold Start (новый пользователь):\n  Онбординг: попросить выбрать 3–5 жанра\n  Popular items: показать топ-100 популярных\n  Быстрое обучение: после 5 просмотров — персонализация' },
        { type: 'note', value: 'Поздравляю с завершением курса! Теперь у вас есть инструменты для проектирования любых систем. Ключевые принципы: понимать trade-offs, думать вслух, масштабировать постепенно. Удачи на интервью!' }
      ]
    }
  ]
}
