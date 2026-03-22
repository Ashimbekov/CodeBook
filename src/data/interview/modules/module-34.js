export default {
  id: 34,
  title: 'SD Mock: Twitter + Instagram + YouTube',
  description: 'Три мини-дизайна в одном модуле: Twitter (лента, fan-out, trending), Instagram (загрузка фото, stories), YouTube (видео, транскодинг, CDN, рекомендации). Все уроки — практика с модельными ответами.',
  lessons: [
    {
      id: 1,
      title: 'Twitter: требования и оценка нагрузки',
      type: 'practice',
      description: 'Требования Twitter: 300M DAU, read-heavy 100:1, 175 твитов/сек, лента < 200ms. Хранилище: 2.8 TB/год текст + 100 TB с медиа.',
      solution: 'Функциональные требования:\n- Публикация твита (текст 280 символов + медиа)\n- Лента новостей от подписок\n- Подписка/отписка, Like, Retweet, Reply\n- Поиск по хэштегам, Trending Topics\n\nНефункциональные:\n- 300M DAU, ~1% авторы = 3M активных\n- Read-heavy: read/write = 100:1\n- Eventual consistency для ленты — OK\n- Latency ленты < 200ms (p95)\n\nОценка нагрузки:\nWrite: 3M × 5 твитов/день / 86400 ≈ 175 твитов/сек (пик × 3 = 500/сек)\nRead: 300M × 10 просмотров/день / 86400 ≈ 35 000 RPS\nХранилище: 175 × 86400 × 365 × 500B ≈ 2.8 TB/год\nС медиа (25% твитов): +100 TB/год\n\nКлючевой challenge: собрать ленту за 200ms для 10K подписок.',
      content: [
        { type: 'text', value: 'Интервьюер: "Спроектируйте Twitter." Начните с требований и оценки масштаба.' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Определите требования для Twitter. Оцените: сколько твитов в секунду? Сколько записей в хранилище?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Функциональные требования:\n- Публикация твита (текст 280 символов + медиа).\n- Лента новостей (timeline) от подписок.\n- Подписка/отписка от аккаунтов.\n- Поиск по хэштегам (trending topics).\n- Like, Retweet, Reply.\n\nНефункциональные:\n- 300M DAU, пишут ~1% = 3M активных авторов.\n- Read-heavy система: read/write ratio = 100:1.\n- Eventual consistency для ленты — OK.\n- Latency ленты < 200ms для 95-го перцентиля.\n\nОценка нагрузки:\n- Публикации: 3M пользователей * 5 твитов/день / 86400 = ~175 твитов/сек.\n- Пиковая: 175 * 3 = ~500 твитов/сек.\n- Чтения ленты: 300M * 10 просмотров/день / 86400 = ~35,000 RPS.\n- Хранилище: 175 * 86400 * 365 * 500B (текст+метадата) = ~2.8 TB/год.\n- С медиа (25% твитов с изображением): +100 TB/год.' },
        { type: 'tip', value: 'Twitter — классическая read-heavy система. Ключевой challenge: как за 200ms собрать ленту для пользователя с 10,000 подписок.' }
      ]
    },
    {
      id: 2,
      title: 'Twitter: генерация ленты и fan-out',
      type: 'practice',
      description: 'Гибридный подход к Timeline: PUSH (fan-out on write) для обычных пользователей в Redis Sorted Set, PULL (fan-out on read) для celebrity > 10K фолловеров.',
      solution: 'Pull модель: при запросе ленты выбираем твиты всех подписок → медленно при 10K подписок\n\nPush модель (precomputed timeline):\n- При публикации → tweet_id в Redis список каждого подписчика\n- При чтении: O(1) из Redis\n- Минус: celebrity 50M фолловеров → 50M операций записи при одном твите!\n\nГибридный подход (Twitter реально):\n- PUSH для обычных (< 10K фолловеров)\n- PULL для celebrity (> 10K фолловеров)\n- При чтении: merge precomputed timeline + реальные твиты celebrity\n\nRedis Timeline:\nKey: timeline:{user_id}\nValue: sorted set, score = timestamp, member = tweet_id\nХранить последние 800 tweet_id (не контент — экономия памяти)\n\nFan-out Service (Kafka consumer):\n- Событие "tweet_published"\n- Читает follower list из User Graph Service\n- Batch запись в Redis pipeline\n\n300M пользователей × 800 tweet_ids × 8 байт ≈ 1.9 TB RAM (Redis Cluster)',
      content: [
        { type: 'text', value: 'Интервьюер: "Как вы будете генерировать Timeline для пользователей? Это самая сложная часть Twitter."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Объясните разницу между Pull и Push моделью для ленты. Когда применять каждую? Как обрабатывать celebrity accounts?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Два подхода к генерации Timeline:\n\n1. PULL (Fanout on Read):\n- При запросе: выбираем всех пользователей на которых подписан юзер → получаем их последние твиты → сортируем.\n- Минус: 10,000 подписок * 1 DB query = очень медленно.\n\n2. PUSH (Fanout on Write — precomputed timeline):\n- При публикации твита: кладём tweet_id в Redis список каждого подписчика.\n- При запросе ленты: O(1) — просто читаем из Redis.\n- Минус: Celeb с 50M подписчиков → 50M операций записи при одном твите!\n\nГибридный подход (Twitter реальный):\n- PUSH для обычных пользователей (< 10K фолловеров).\n- PULL для знаменитостей (> 10K фолловеров).\n- При чтении ленты: merge precomputed timeline + реальные твиты знаменитостей.\n\nSchema Redis Timeline:\n- Key: timeline:{user_id}\n- Value: sorted set, score = timestamp, member = tweet_id\n- Хранить последние 800 tweet_id на пользователя (не весь контент).\n- Реальный контент: Tweet Service → по tweet_id.\n\nFan-out Service:\n- Kafka consumer: получает событие "tweet published".\n- Читает follower list из User Graph Service.\n- Батчами пишет в Redis пайплайном.' },
        { type: 'note', value: 'Хранение tweet_id, а не контента — экономия памяти. 300M пользователей * 800 tweet_ids * 8 байт = ~1.9 TB RAM. Используйте Redis Cluster с репликацией.' }
      ]
    },
    {
      id: 3,
      title: 'Twitter: поиск и Trending Topics',
      type: 'practice',
      description: 'Поиск через Elasticsearch (inverted index, async через Kafka). Trending Topics: Apache Flink sliding window → Redis Sorted Set. Геоперсонализация трендов.',
      solution: 'Поиск твитов:\n- Elasticsearch: inverted index для хэштегов и текста\n- При публикации: async → Kafka → Elasticsearch индексация\n- Шардирование по временным диапазонам (hot shard = последние 7 дней)\n\nTrending Topics:\n1. При твите с #хэштегом → Kafka событие\n2. Apache Flink (stream processing):\n   - Sliding window: счёт упоминаний за 24 ч, обновляется каждые 5 мин\n3. Результат → Redis Sorted Set:\n   Key: trending:{country_code}\n   Score: count за 24ч\n4. API: GET /trending → из Redis (< 1ms)\n\nПерсонализация: trending:ru, trending:us — разные тренды по региону\n\nСпам-фильтрация:\n- Аномальный рост хэштега за < 10 мин → флаг для ревью\n- 1 IP, 1000 твитов с одним хэштегом → блокировка',
      content: [
        { type: 'text', value: 'Интервьюер: "Как реализовать поиск по хэштегам и показывать трендовые темы в реальном времени?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Опишите архитектуру поиска по твитам и трендов. Как считать trending topics в реальном времени без full scan базы?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Поиск по твитам:\n- Inverted Index: слово/хэштег → список tweet_id.\n- Elasticsearch: горизонтально масштабируемый, full-text search.\n- При публикации: async запись в Elasticsearch через Kafka.\n- Шардирование по временным диапазонам (hot shard = последние 7 дней).\n\nTrending Topics (реальное время):\n- Задача: топ-10 хэштегов за последние 24 часа, обновляется каждые 5 минут.\n\nАрхитектура:\n1. При публикации твита с #хэштегом → событие в Kafka.\n2. Apache Storm / Flink (stream processing):\n   - Sliding window: считает упоминания хэштегов за последний час.\n   - Sliding по 5-минутным интервалам.\n3. Результат: топ-50 хэштегов → Redis Sorted Set.\n   - Key: trending:global\n   - Score: count за последние 24ч.\n4. API: GET /api/trending → читает из Redis (< 1ms).\n\nПерсонализация трендов:\n- Тренды для России != тренды для США.\n- Фильтруем по geo: trending:{country_code}.\n\nСпам-фильтрация:\n- Аномальный рост хэштега за < 10 минут → флаг для ревью.\n- Один IP создаёт 1000 твитов с одним хэштегом → блокировка.' },
        { type: 'tip', value: 'Apache Flink — лучший выбор для stream processing трендов: поддерживает event time, exactly-once semantics, легко масштабируется.' }
      ]
    },
    {
      id: 4,
      title: 'Instagram: загрузка фото и лента',
      type: 'practice',
      description: 'Pipeline загрузки фото Instagram: presigned S3 URL → Kafka → async Photo Processing (thumbnails 3 размера) → CDN. Лента через precomputed timeline в Redis аналогично Twitter.',
      solution: 'Масштаб: 1B DAU, 100M фото/день, 300 TB/день\n\nФлоу загрузки (presigned URL):\n1. Клиент → API: "хочу загрузить фото" → presigned S3 URL\n2. Клиент → S3 напрямую (не через API — экономим bandwidth)\n3. API → Kafka: "photo_uploaded"\n4. Async Photo Processing Service:\n   - Thumbnails: 150×150, 480×480, 1080×1080\n   - Загружает все размеры в S3\n   - Photo DB: status="processed", URL для каждого размера\n5. CDN: раздаёт фото с ближайшего edge\n\nPhoto Feed:\n- precomputed timeline в Redis (аналогично Twitter)\n- Key: feed:{user_id}, sorted set по timestamp\n- Fan-out при публикации → подписчики\n- Celebrity (Kylie Jenner, 400M followers): pull on read\n\nФильтры: обрабатываются на клиенте, не на сервере (экономим CPU)\n\nPresigned URL — ключевой паттерн для медиа: загрузка прямо в S3.',
      content: [
        { type: 'text', value: 'Интервьюер: "Теперь Instagram. Сфокусируйтесь на загрузке изображений и генерации ленты."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Спроектируйте процесс загрузки фото (от кнопки "Опубликовать" до CDN) и ленту Instagram. Что делать с размерами изображений?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Масштаб Instagram:\n- 1B DAU, 100M новых фото/день.\n- Фото: среднее 3MB, thumbnail 30KB.\n- Хранилище: 100M * 3MB = 300 TB/день.\n\nФлоу загрузки фото:\n1. Клиент → API Server: POST /photos (multipart form data).\n2. API Server → Object Storage (S3): сохраняем оригинал.\n3. API Server → Kafka: событие "photo_uploaded".\n4. Async Photo Processing Service (consumer):\n   - Генерирует thumbnails: 150x150, 480x480, 1080x1080.\n   - Загружает все размеры в S3.\n   - Обновляет Photo DB: статус "processed", URL для каждого размера.\n5. CDN (CloudFront): фото раздаётся из ближайшего edge.\n\nПрямая загрузка (Pre-signed URL):\n- Клиент → API: "хочу загрузить фото" → получает presigned S3 URL.\n- Клиент → S3 напрямую (минуя API Server).\n- Экономит bandwidth на API серверах.\n\nPhoto Feed:\n- Аналогично Twitter: precomputed timeline в Redis.\n- Key: feed:{user_id}, sorted set по timestamp.\n- При загрузке фото: fan-out к подписчикам.\n- Знаменитости (Kylie Jenner, 400M followers): pull on read.\n\nHDR и фильтры:\n- Обработка фильтров на клиенте перед загрузкой.\n- Не обрабатывать на сервере: экономим CPU.' },
        { type: 'note', value: 'Presigned URL — важный паттерн для загрузки медиа. Клиент загружает напрямую в S3, не нагружая API серверы.' }
      ]
    },
    {
      id: 5,
      title: 'Instagram: Stories — ephemeral content',
      type: 'practice',
      description: 'Instagram Stories: soft delete с expires_at, фоновый job удаления, сортировка ленты (непросмотренные + closeness_score), счётчик просмотров через Redis + batch flush.',
      solution: 'Схема:\nstories: story_id, user_id, media_url, created_at, expires_at (created_at + 24h)\nstory_views: story_id + viewer_id + viewed_at\n\nАвтоматическое удаление (soft delete):\nфлаг is_expired = true при запросе: WHERE expires_at > NOW()\nCron job каждый час: DELETE expired stories + S3 объекты\n→ Не удалять немедленно: дорого, блокирует БД\n\nОтображение Stories Feed:\nRedis sorted set stories_feed:{user_id}:\n  score = has_unviewed × 1000 + closeness_score\nНепросмотренные → выше в ленте\n\nПросмотры:\n- async запись в story_views\n- Aggregate counter в Redis → flush в БД каждые 5 мин\n- Автор видит "Просмотрели: Алиса, Борис и ещё 543"\n\nАрхивирование:\nПосле 24ч: переносить в личный архив (не удалять совсем)',
      content: [
        { type: 'text', value: 'Интервьюер: "Как реализовать Stories — контент, который исчезает через 24 часа?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Спроектируйте Stories. Как обеспечить автоматическое удаление через 24ч? Как показывать истории подписок в правильном порядке?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Таблица stories:\n- story_id, user_id, media_url, created_at, expires_at (created_at + 24h).\n- Viewers: story_views: story_id + viewer_id + viewed_at.\n\nАвтоматическое удаление:\n- НЕ удалять физически сразу: дорого и сложно.\n- Метод 1 (TTL в Cassandra): expires_at → Cassandra удаляет через compaction.\n- Метод 2 (Scheduled job): cron каждый час, удаляет expired stories из БД и S3.\n- Метод 3 (Soft delete): флаг is_expired = true, при запросе фильтруем WHERE expires_at > NOW().\n\nОтображение Stories:\n- Лента Stories: GET /stories/feed → список пользователей с активными историями.\n- Алгоритм сортировки: сначала непросмотренные, затем по active friends.\n- Redis: stories_feed:{user_id} = sorted set {author_id: score}.\n- Score = has_unviewed * 1000 + closeness_score.\n\nПросмотры:\n- При просмотре: асинхронно пишем в story_views.\n- Автор видит "Посмотрели: Алиса, Борис и ещё 543".\n- Aggregate counters в Redis, раз в 5 минут flush в DB.\n\nArchiving:\n- После 24ч: не удаляем, переносим в личный архив пользователя.\n- Пользователь может достать из архива.' },
        { type: 'tip', value: 'Soft delete + индекс по expires_at — самый практичный подход. Фоновый worker убирает expired записи в off-peak часы.' }
      ]
    },
    {
      id: 6,
      title: 'YouTube: загрузка и транскодинг видео',
      type: 'practice',
      description: 'Pipeline YouTube: chunked upload → S3 → Kafka → Video Splitter → Parallel GPU Transcoding (6 качеств) → HLS manifest → CDN. 10 мин видео транскодируется ~10-15 мин параллельно.',
      solution: 'Масштаб: 500 ч видео/мин, 2B пользователей, 1B ч просмотров/день\n\nФлоу загрузки:\n1. Клиент разбивает файл на chunks 5MB\n2. POST /videos/init → upload_id\n3. Chunks параллельно → S3 (resumable upload)\n4. Metadata → Video DB (status: "processing")\n5. Kafka: "video_uploaded"\n\nПайплайн транскодинга:\n1. Kafka consumer получает событие\n2. Video Splitter: делит на 1-мин сегменты (GOP aligned)\n3. Parallel Transcoding Workers (GPU):\n   Каждый сегмент → 6 качеств (360p, 480p, 720p, 1080p, 1440p, 4K)\n   ffmpeg / libvpx\n4. Video Assembler: собирает сегменты\n5. HLS manifest (.m3u8) / MPEG-DASH (.mpd) — пути к сегментам\n6. Все форматы → S3 → CDN\n7. Video DB: status = "published"\n\nПараллелизация сегментов — ключевая оптимизация. Без неё 4K видео транскодируется часами.',
      content: [
        { type: 'text', value: 'Интервьюер: "Спроектируйте YouTube. Начните с процесса загрузки видео."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Опишите полный pipeline загрузки видео от кнопки "Upload" до доступности для просмотра. Что значит "транскодинг" и зачем он нужен?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Масштаб YouTube:\n- 500 часов видео загружается каждую минуту.\n- 2B пользователей, смотрят 1B часов/день.\n- Среднее видео: 300MB, 10 минут.\n\nПроцесс загрузки:\n1. Клиент → разбивает файл на chunks (5MB каждый).\n2. Resumable upload: POST /videos/init → получает upload_id.\n3. Chunks загружаются параллельно в Object Storage (GCS/S3).\n4. Сборка: Object Storage → raw_video_{video_id} собран.\n5. API записывает metadata в Video DB (status: "processing").\n6. Публикует событие "video_uploaded" в Kafka.\n\nВидео Транскодинг (Transcoding Pipeline):\n- Зачем: оригинал может быть 4K MOV, нужны 1080p, 720p, 480p, 360p mp4/webm.\n- Разные устройства и скорости сети требуют разные форматы/качество.\n\nТранскодинг сервис:\n1. Kafka consumer получает "video_uploaded".\n2. Video Splitter: делит видео на 1-минутные сегменты (GOP aligned).\n3. Parallel Transcoding Workers (GPU серверы):\n   - Каждый сегмент транскодируется параллельно в 6 quality levels.\n   - ffmpeg / libvpx для кодирования.\n4. Video Assembler: собирает сегменты обратно.\n5. Манифест файл (HLS .m3u8 / MPEG-DASH .mpd): содержит пути к сегментам для каждого качества.\n6. Все форматы → S3 → CDN purge/preload.\n7. Video DB update: status = "published", thumbnail_url, duration.\n\nВремя обработки:\n- 10-минутное видео → ~10-15 минут транскодинга с параллелизацией.' },
        { type: 'note', value: 'Сегментация для параллельного транскодинга — ключевая оптимизация YouTube. Без неё 10 мин видео в 4K может транскодироваться часами.' }
      ]
    },
    {
      id: 7,
      title: 'YouTube: стриминг и CDN',
      type: 'practice',
      description: 'Adaptive Bitrate Streaming (HLS/MPEG-DASH): плеер адаптирует качество под bandwidth в реальном времени. CDN с 200+ edge nodes, предзагрузка, счётчик просмотров через Redis INCR.',
      solution: 'Adaptive Bitrate Streaming (ABR):\n- Видео нарезано на 2-10 сек сегменты\n- Для каждого сегмента: 1080p, 720p, 480p, 360p\n- Протоколы: HLS (.m3u8) — Apple, MPEG-DASH — открытый\n\nКак работает:\n1. Плеер загружает manifest: список сегментов и URL по качествам\n2. Плеер измеряет bandwidth текущего соединения\n3. Выбирает качество для следующего сегмента\n4. bandwidth упал → автоматически переключается на 480p\n5. Буферизует 30 сек вперёд\n\nCDN:\n- Edge nodes в 200+ городах\n- Видео-сегменты кешируются на ближайшем edge\n- Cache miss: edge → S3 → кешировать\n- Hit ratio для популярных: 99%+\n- DNS Anycast → ближайший CDN PoP\n\nСчётчик просмотров:\n- Redis INCR "video:{id}:views" каждые 30 сек просмотра\n- Batch flush в DB периодически\n- Не писать в SQL при каждом просмотре (2B просмотров/день)',
      content: [
        { type: 'text', value: 'Интервьюер: "Как пользователь смотрит видео? Объясните adaptive bitrate streaming и роль CDN."' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Объясните как работает видеовоспроизведение. Что такое Adaptive Bitrate Streaming? Как минимизировать буферизацию?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Adaptive Bitrate Streaming (ABR):\n- Видео нарезано на сегменты по 2-10 секунд.\n- Для каждого сегмента есть несколько качеств: 1080p, 720p, 480p.\n- Протоколы: HLS (Apple), MPEG-DASH (открытый стандарт).\n\nКак работает ABR:\n1. Плеер загружает манифест (.m3u8): список сегментов и их URL по качествам.\n2. Плеер оценивает bandwidth текущего соединения.\n3. Выбирает подходящее качество для следующего сегмента.\n4. Если bandwidth упал → автоматически переключается на 480p без остановки.\n5. Буферизует 30 секунд вперёд.\n\nCDN архитектура:\n- Edge nodes: серверы в 200+ городах мира.\n- Видео-сегменты кэшируются на ближайшем edge к пользователю.\n- Кэш-промах: edge → Origin (S3) → кэшировать на edge.\n- Hit ratio для популярных видео: 99%+.\n- Географический роутинг: DNS Anycast → ближайший CDN PoP.\n\nПредзагрузка:\n- Алгоритм анализирует что пользователь, вероятно, посмотрит следующим (рекомендации).\n- Начинает загрузку thumbnail и первых 30 секунд заранее.\n\nView count:\n- Счётчик просмотров — eventual consistency через Redis + batch flush.\n- Не писать в SQL при каждом просмотре (2B просмотров/день).\n- Redis INCR video:{id}:views каждые 30 сек просмотра, flush в DB батчами.' },
        { type: 'tip', value: 'CDN cache invalidation — сложная задача. При обновлении видео (автогенерированные субтитры) нужно инвалидировать кэш. Используйте версионирование URL: /video/{id}/v2/segment_001.ts' }
      ]
    },
    {
      id: 8,
      title: 'YouTube: система рекомендаций',
      type: 'practice',
      description: 'Двухэтапная рекомендательная архитектура: Candidate Generation (ANN embeddings, 100-500 кандидатов) → Ranking DNN (предсказывает watch time). Стандарт для Netflix, TikTok, Spotify.',
      solution: 'Входные сигналы:\n- Explicit: лайки, дизлайки, подписки\n- Implicit: watch time (%), rewatches, паузы\n- Контекст: время суток, устройство, история 24ч\n\nЭтап 1 — Candidate Generation (сотни из миллионов):\n- Collaborative Filtering: "похожие пользователи смотрели X"\n- Content-based: похожие видео по тегам и категории\n- ANN (Faiss/ScaNN) в embedding space\n- Выдаёт 100-500 кандидатов за < 100ms\n\nЭтап 2 — Ranking (10 из сотен):\n- Нейросеть (DNN) с сотнями features:\n  User: история просмотров (embedding), демография\n  Video: engagement rate, freshness, CTR\n  Context: время суток, device\n- Предсказывает P(watch > 50%)\n- Топ-10 с учётом diversity (не всё из одной категории)\n\nInfrastructure:\n- Обучение: TensorFlow/PyTorch, раз в день на свежих данных\n- Serving: TF Serving на GPU, latency < 50ms\n- A/B тесты: 100+ экспериментов одновременно\n\nCold Start: новый пользователь → топ региона + выбранные интересы при регистрации',
      content: [
        { type: 'text', value: 'Интервьюер: "Как работает система рекомендаций YouTube? Почему она так хорошо удерживает пользователей?"' },
        { type: 'heading', value: 'Задание' },
        { type: 'text', value: 'Опишите высокоуровневую архитектуру рекомендательной системы. Какие данные используются? Как обслуживать рекомендации с низкой задержкой?' },
        { type: 'heading', value: 'Модельный ответ' },
        { type: 'text', value: 'Входные сигналы:\n- Explicit: лайки, дизлайки, подписки, сохранения.\n- Implicit: watch time (%), rewatches, pause behavior.\n- Контекст: время суток, устройство, история за последние 24ч.\n\nДвухэтапная архитектура (Candidate Generation → Ranking):\n\nЭтап 1 — Candidate Generation (сотни из миллионов):\n- Collaborative Filtering: "пользователи похожие на тебя смотрели X".\n- Content-based: похожие видео по тегам, описанию, категории.\n- Выдаёт ~100-500 кандидатов за < 100ms.\n- Хранение: Approximate Nearest Neighbors (Faiss/ScaNN) в embedding space.\n\nЭтап 2 — Ranking (10 из сотен):\n- Нейросеть (DNN) с сотнями features:\n  - User features: watch history embedding, demographics.\n  - Video features: engagement rate, freshness, click-through rate.\n  - Context features: время суток, device.\n- Предсказывает: P(watch > 50%) для каждого кандидата.\n- Выбирает топ-10 с учётом diversity (не все из одной категории).\n\nInfrastructure:\n- ML Training: TensorFlow / PyTorch, обучение раз в день на свежих данных.\n- Serving: TF Serving с GPU, latency < 50ms.\n- A/B тестирование: каждый день 100+ экспериментов.\n\nCold Start проблема:\n- Новый пользователь: показываем топ по своему региону + выбранные интересы при регистрации.\n- Новое видео: сначала показываем похожей аудитории автора → если хороший engagement → расширяем.' },
        { type: 'note', value: 'Двухэтапная архитектура (candidate generation + ranking) — стандарт для всех крупных рекомендательных систем: Netflix, TikTok, Spotify.' }
      ]
    }
  ]
}
