export default {
  id: 17,
  title: 'Проектируем: YouTube',
  description: 'Полное проектирование YouTube: загрузка видео, транскодирование, CDN доставка, поиск, рекомендации. Video streaming architecture.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и оценка',
      type: 'practice',
      requirements: [
        'Определить функциональные требования (загрузка, стриминг, поиск)',
        'Указать нефункциональные требования (масштаб, latency)',
        'Рассчитать объём сырых данных при загрузке 500 часов/мин',
        'Оценить пиковый bandwidth для стриминга',
        'Сделать вывод о необходимой инфраструктуре'
      ],
      hint: 'Рассчитай: 500 часов/мин × 6 ГБ/час raw = 3 ТБ/мин = 4.3 ПБ/день сырых данных! После транскодинга в 20+ форматов — ещё больше. Это определяет: только объектное хранилище типа GCS/S3, только CDN для доставки.',
      expectedOutput: 'Upload: 4.3 ПБ raw данных/день. После транскодинга: 20+ ПБ. Streaming пиковый bandwidth: 277 Тбит/с. Вывод: объектное хранилище (GCS/S3) + мощная CDN по всему миру. Видео начинается < 2 сек через edge-кеш.',
      solution: 'Функциональные требования:\n- Загрузка видео (до 10 ГБ)\n- Adaptive bitrate streaming (качество адаптируется к скорости)\n- Поиск по видео\n- Лайки, комментарии, подписки\n- Рекомендации (главная страница)\n\nНефункциональные:\n- 2.5B пользователей, 800M DAU\n- 500 часов видео загружается в минуту\n- Начало воспроизведения < 2 сек\n- Доступность: 99.99%\n\nОценка нагрузки:\n- Upload: 500 часов/мин = 4.3M видео/день × 1 ГБ raw = 4.3 ПБ сырых данных/день\n- Streaming: 800M × 1 Мбит × 30 мин / 86,400 ≈ 277 Тбит/сек пикового bandwidth\n- Это требует мощной CDN инфраструктуры по всему миру',
      explanation: '4.3 ПБ raw данных в день после транскодинга превращается в 20+ ПБ (несколько форматов и качеств). Это исключает хранение на одном кластере — нужна объектная система типа GCS/S3. 277 Тбит/сек bandwidth — только CDN может справиться с доставкой такого объёма.',
      content: [
        { type: 'text', value: 'YouTube — одна из крупнейших платформ. Определим что строим.' },
        { type: 'heading', value: 'Функциональные требования' },
        { type: 'list', value: [
          'Загрузка видео (до 10 ГБ)',
          'Стриминг видео: adaptive bitrate (качество адаптируется к скорости интернета)',
          'Поиск по видео',
          'Лайки, комментарии, подписки',
          'Рекомендации (главная страница)'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          '2.5 млрд пользователей, 800 млн DAU',
          'Загрузка видео: 500 часов видео в минуту!',
          'Видео должно начинаться за < 2 секунды',
          'Поддержка любого качества: 360p, 720p, 1080p, 4K',
          'Высокая доступность: 99.99%'
        ]},
        { type: 'heading', value: 'Оценка нагрузки' },
        { type: 'text', value: 'Upload:\n  500 часов/минуту = 30,000 часов/час = 720,000 часов/день\n  Среднее видео: 10 минут = 600 сек, 1 ГБ raw\n  720,000 × 60 мин / 10 мин/видео = 4,320,000 видео/день\n  4.3M видео × 1 ГБ raw = 4.3 ПБ raw данных в день!\n\nStreaming:\n  800M DAU, каждый смотрит 30 мин/день\n  При 1 Мбит/с: 800M × 1 Мбит × 30 мин / 86,400 = 277 Тбит/с пиковый bandwidth' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Video Upload и Transcode Pipeline',
      type: 'practice',
      requirements: [
        'Описать загрузку видео напрямую в S3 (bypass серверов)',
        'Объяснить pre-signed URL механизм',
        'Спроектировать transcode pipeline (DAG)',
        'Перечислить все форматы и разрешения для транскодинга',
        'Объяснить почему GPU инстансы для транскодинга'
      ],
      hint: 'Прямая загрузка в S3 (bypass серверов) — ключевое решение: серверы не bottleneck. DAG параллельной обработки: 360p, 720p, 1080p транскодируются одновременно, не последовательно. S3 Event → SNS → SQS → Workers — стандартный паттерн event-driven обработки.',
      expectedOutput: 'Upload: POST /uploads → pre-signed S3 URL → клиент загружает напрямую. S3 Event → SQS → Transcode Workers. DAG: thumbnail, audio normalization, transcode 360p/720p/1080p/4K параллельно, content moderation. GPU instances обоснованы. Результаты → S3 + update metadata.',
      solution: 'Upload Flow (3 шага):\n1. POST /api/v1/uploads → pre-signed S3 URL (upload_id)\n2. Клиент загружает напрямую в S3 chunked upload (минуя серверы)\n3. S3 Event → SNS → SQS → Transcode Service\n\nTranscode Pipeline (DAG обработка, параллельно):\nRaw video из S3 →\n├→ Inspect (формат, длина, разрешение)\n├→ Thumbnail generation (несколько вариантов)\n├→ Audio normalization\n├→ Transcode 360p / 720p / 1080p / 4K (параллельно, GPU instances)\n├→ HLS сегменты (по 10 сек для adaptive bitrate)\n└→ Content moderation (ML)\n\nВсе результаты → S3 + обновить metadata в БД\nОркестрация: Kafka "videos_to_transcode" → Transcode Workers (AWS EC2 GPU)',
      explanation: 'Прямая загрузка в S3 (bypass серверов) — ключевое решение: серверы не являются bottleneck для загрузки. DAG параллельной обработки минимизирует время публикации — все форматы транскодируются одновременно. GPU инстансы для транскодинга — специализированные ресурсы масштабируются независимо.',
      content: [
        { type: 'text', value: 'Загрузка и обработка видео — сложнейший компонент YouTube.' },
        { type: 'heading', value: 'Upload Flow' },
        { type: 'text', value: 'Шаг 1: Инициация загрузки\n  POST /api/v1/uploads → получить upload_url\n  Response: { upload_id, upload_url (pre-signed S3 URL) }\n\nШаг 2: Прямая загрузка в Object Storage\n  PUT {upload_url} с chunked upload\n  Клиент загружает напрямую в S3 (минуя наши серверы!)\n  Прогресс-бар через WebSocket\n\nШаг 3: Уведомление о завершении\n  S3 Event → SNS → SQS → Transcode Service\n  (или S3 Event notification в Kafka)' },
        { type: 'heading', value: 'Transcode Pipeline' },
        { type: 'text', value: 'Raw video → Transcode Workers → Multiple formats\n\nКаждое видео конвертируется в несколько форматов:\n  360p/30fps MP4  → для медленного интернета\n  720p/30fps MP4  → стандарт\n  1080p/60fps MP4 → HD\n  4K/60fps MP4    → 4K\n  HLS сегменты    → adaptive bitrate streaming (chunks по 10 сек)\n  WebM версии     → для браузеров без H.264\n\nЭто CPU-intensive! Нужно много transcode воркеров.\n\nОрхестрация:\n  Kafka topic "videos_to_transcode"\n  Transcode Workers: GPU-инстансы (AWS EC2 p3/g4)\n  Результаты: загрузить в S3, обновить metadata в БД' },
        { type: 'heading', value: 'DAG (Directed Acyclic Graph) для обработки' },
        { type: 'text', value: 'Шаги обработки (параллельно где возможно):\n\nRaw video\n  ├→ Inspect (проверить формат, длину, разрешение)\n  ├→ Thumbnail генерация (несколько вариантов)\n  ├→ Audio extraction → normalize audio\n  ├→ Transcode 360p ┐\n  ├→ Transcode 720p ├→ (параллельно) → Upload to CDN\n  ├→ Transcode 1080p┘\n  └→ Content moderation (ML: проверить на нарушения)' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: Модель данных',
      type: 'practice',
      requirements: [
        'Спроектировать таблицу videos с полем status',
        'Спроектировать таблицу video_transcodes',
        'Выбрать хранилище для каждого типа данных',
        'Объяснить зачем отдельная таблица video_transcodes',
        'Описать структуру хранения video_id (YouTube style)'
      ],
      hint: 'Разделение videos и video_transcodes важно: обработка асинхронная, каждое видео имеет несколько статусов транскодинга для разных качеств. video_id в стиле YouTube (11 символов base64) — генерируется как уникальный ID. Cassandra хороша для videos (write-heavy append), PostgreSQL для user data (ACID).',
      expectedOutput: 'Таблица videos: video_id VARCHAR(11) PK, status ENUM (UPLOADING/PROCESSING/PUBLISHED). Таблица video_transcodes: PK (video_id, quality, format), status. Хранилища обоснованы: Cassandra для videos, PostgreSQL для users, Elasticsearch для поиска, S3+CDN для файлов. Разделение таблиц объяснено.',
      solution: 'Таблица videos (Cassandra, шардирование по video_id):\nvideo_id VARCHAR(11) PK (YouTube-style: "dQw4w9WgXcQ")\nuser_id BIGINT, title VARCHAR(100), description TEXT\nstatus ENUM(UPLOADING/PROCESSING/PUBLISHED/PRIVATE)\nthumbnail_url, view_count BIGINT, like_count INT, duration_sec INT, created_at\n\nТаблица video_transcodes:\nPK: (video_id, quality, format)\nquality: "360p"/"720p"/"1080p"/"4K", format: "mp4"/"hls"\nurl VARCHAR(500) — S3/CDN URL, size_bytes BIGINT\nstatus ENUM(PENDING/PROCESSING/DONE/FAILED)\n\nВыбор хранилищ:\n- Videos metadata: Cassandra (write-heavy, шардирование по video_id)\n- User data: MySQL/PostgreSQL\n- Comments: Cassandra (partition: video_id, clustering: created_at DESC)\n- View counts: Redis INCR + periodic flush\n- Search: Elasticsearch\n- Video files: GCS/S3 + CDN',
      explanation: 'Разделение таблиц videos и video_transcodes важно: обработка видео — асинхронный процесс с несколькими статусами. video_id в стиле YouTube (11 символов base64) генерируется как уникальный ID. Cassandra для комментариев — append-only паттерн с высоким write throughput, запросы только по video_id.',
      content: [
        { type: 'text', value: 'Схема данных для видеосервиса.' },
        { type: 'heading', value: 'Таблица videos' },
        { type: 'text', value: 'video_id       VARCHAR(11) PRIMARY KEY  (YouTube style: "dQw4w9WgXcQ")\nuser_id        BIGINT NOT NULL\ntitle          VARCHAR(100)\ndescription    TEXT\nstatus         ENUM(UPLOADING, PROCESSING, PUBLISHED, PRIVATE, DELETED)\nthumbnail_url  VARCHAR(200)\nview_count     BIGINT DEFAULT 0\nlike_count     INT DEFAULT 0\nduration_sec   INT\ncreated_at     TIMESTAMP\n\nIndexes:\n  (user_id, created_at DESC)\n  (status, created_at) — для поиска опубликованных' },
        { type: 'heading', value: 'Таблица video_transcodes' },
        { type: 'text', value: 'video_id    VARCHAR(11)\nquality     VARCHAR(10)  -- "360p", "720p", "1080p", "4K"\nformat      VARCHAR(10)  -- "mp4", "hls"\nurl         VARCHAR(500) -- S3/CDN URL\nsize_bytes  BIGINT\nstatus      ENUM(PENDING, PROCESSING, DONE, FAILED)\n\nPRIMARY KEY (video_id, quality, format)' },
        { type: 'heading', value: 'Выбор БД' },
        { type: 'text', value: 'Videos metadata: Cassandra (write-heavy, шардирование по video_id)\nUser data: MySQL/PostgreSQL\nComments: Cassandra (partition key: video_id, clustering: created_at DESC)\nView counts: Redis INCR + periodic flush to DB\nSearch index: Elasticsearch' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Видео стриминг и CDN',
      type: 'practice',
      requirements: [
        'Объяснить HLS Adaptive Bitrate Streaming',
        'Описать структуру манифест-файла (.m3u8)',
        'Спроектировать трёхуровневую CDN архитектуру',
        'Объяснить как плеер выбирает качество',
        'Описать принцип Pareto в контексте CDN кеширования'
      ],
      hint: 'HLS: видео нарезано на сегменты по 10 сек в нескольких качествах. Плеер измеряет bandwidth → выбирает сегмент нужного качества. Медленный интернет → 360p, быстрый → 1080p. Трёхуровневый CDN: Origin → Regional PoP → Edge. Парето: топ-20% контента = 80% просмотров.',
      expectedOutput: 'HLS объяснён: сегменты 10 сек, плейлист .m3u8. Плеер автоматически переключает качество. CDN три уровня: Origin (S3) → Regional PoP (50) → Edge (1000). Pareto: топ-10% контента кешируется на edge. Cache-Control: max-age=86400 для видео сегментов.',
      solution: 'HLS Adaptive Bitrate Streaming:\n- Видео разбито на сегменты по 10 сек в нескольких качествах\n- Манифест playlist.m3u8 указывает доступные bitrate\n- Плеер измеряет скорость загрузки → выбирает оптимальное качество\n- Буфер снижается → автоматически переключается на меньшее качество\n\nТрёхуровневая CDN:\nOrigin (S3, несколько регионов: US/EU/Asia)\n  ↓ репликация популярных видео заранее\nRegional CDN PoP (~50 точек) → кешируют сегменты для региона\n  ↓ трафик к пользователю\nEdge Cache (~1000 серверов близко к ISP) → топ-10% контента = 90% просмотров\n\nDynamic Routing:\n- Выбрать ближайший CDN edge при воспроизведении\n- Failover: перегруженный edge → региональный PoP\n- Cache-Control: max-age=86400 для видео сегментов',
      explanation: 'HLS с адаптивным bitrate решает ключевую проблему: разные пользователи с разной скоростью интернета смотрят одно видео без буферизации. Трёхуровневый CDN оптимизирован под принцип Pareto: 20% контента = 80% просмотров кешируются на самых быстрых edge узлах.',
      content: [
        { type: 'text', value: 'Как доставлять видео миллиардам пользователей быстро.' },
        { type: 'heading', value: 'Adaptive Bitrate Streaming (HLS/DASH)' },
        { type: 'text', value: 'Идея: видео разбито на сегменты по 10 секунд в нескольких качествах.\n\nМанифест playlist.m3u8:\n  #EXTM3U\n  #EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360\n  360p/playlist.m3u8\n  #EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720\n  720p/playlist.m3u8\n  #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n  1080p/playlist.m3u8\n\nПлеер измеряет скорость загрузки:\n  Медленный интернет → загружать 360p сегменты\n  Быстрый → 1080p\n  Буфер снижается → переключиться на меньшее качество' },
        { type: 'heading', value: 'CDN архитектура для видео' },
        { type: 'text', value: 'Трёхуровневая CDN:\n\nOrigin: S3 в нескольких регионах (US, EU, Asia)\n  ↓ реплицируем популярные видео заранее\nCDN PoP (Regional): ~50 точек присутствия\n  → кешируют видео-сегменты для своего региона\n  ↓ трафик к пользователю\nEdge Cache: ~1000 edge серверов близко к ISP\n  → кешируют самые популярные видео (топ-10% получают 90% просмотров)\n\nDynamic Routing:\n  При воспроизведении — выбрать ближайший CDN edge\n  Failover: если edge перегружен → региональный PoP' },
        { type: 'tip', value: 'YouTube хранит петабайты видео, но 80% просмотров — топ 20% контента. Эти 20% кешируются на edge-серверах. Остальные 80% видео обслуживаются с региональных или origin серверов.' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Счётчики просмотров и метрики',
      type: 'practice',
      requirements: [
        'Объяснить проблему наивного подхода (прямой UPDATE)',
        'Описать Redis INCR + batch flush паттерн',
        'Рассчитать снижение нагрузки на БД',
        'Объяснить HyperLogLog для уникальных просмотров',
        'Описать критерии уникального просмотра YouTube'
      ],
      hint: 'Наивно: 1B/86400 = 11 574 UPDATE/сек на одну строку — невозможно. Решение: Redis INCR (атомарный, ~1M ops/сек) + batch flush каждые 5 мин. Нагрузка: 11K/сек → 1 раз в 5 мин. HyperLogLog для уникальных: ±1%, 12 КБ памяти на любой объём.',
      expectedOutput: 'Наивный подход отвергнут: 11 574 UPDATE/сек на одну строку. Решение: Redis INCR "views:{video_id}" → batch flush в БД каждые 5 мин. Снижение: тысячи раз. HyperLogLog объяснён: PFADD + PFCOUNT, ±1%, 12 КБ. Критерии YouTube: >30 сек просмотра + 1 раз за 24ч.',
      solution: 'Проблема: 1B просмотров/день = 11,574 UPDATE/сек на одну строку → не масштабируется.\n\nРешение: Redis INCR + Batch Write\n- При просмотре: INCR "views:{video_id}" в Redis (~1M ops/сек)\n- Batch flush каждые 5 минут: UPDATE videos SET view_count += {delta} WHERE video_id = ...\n- Результат: 11K UPDATE/сек → 1 UPDATE в 5 мин на видео\n\nДедупликация просмотров:\n- YouTube считает уникальным: >30 сек просмотра, один пользователь за 24ч\n- HyperLogLog: PFADD "unique_views:{video_id}:{date}" {user_id}\n- PFCOUNT → оценка уникальных просмотров\n- Точность: ±1%, память: 12 КБ на любой объём данных\n- 500M пользователей × 12 КБ = 6 ГБ (vs 500M × 8 байт = 4 ГБ точного подсчёта)',
      explanation: 'Redis INCR — стандартный паттерн для высокочастотных счётчиков. Batch flush снижает нагрузку на основную БД с тысяч до единиц операций в минуту. HyperLogLog — образцовое применение probabilistic data structure: ±1% погрешность неощутима для пользователя, но память константна вместо линейной.',
      content: [
        { type: 'text', value: 'Подсчёт просмотров при миллиарде воспроизведений в день — нетривиальная задача.' },
        { type: 'heading', value: 'Проблема наивного подхода' },
        { type: 'text', value: 'Наивно: UPDATE videos SET view_count = view_count + 1 WHERE video_id = ?\n  1 млрд просмотров/день = 11,574 UPDATE/сек к одной строке\n  Это не масштабируется!' },
        { type: 'heading', value: 'Решение: Redis + Batch Write' },
        { type: 'text', value: 'При просмотре:\n  INCR "views:{video_id}" в Redis → ~1M ops/sec поддерживает\n\nBatch flush (каждые 5 минут):\n  Batch Writer читает все счётчики из Redis\n  Пишет в БД один UPDATE батч:\n    UPDATE videos SET view_count = view_count + {delta} WHERE video_id = ...\n  Обнуляет Redis счётчик\n\nИтог: 11K UPDATE/сек → 1 UPDATE раз в 5 мин на видео' },
        { type: 'heading', value: 'Дедупликация просмотров' },
        { type: 'text', value: 'YouTube считает просмотр "уникальным" если:\n  - Видео просмотрено >30 секунд\n  - Один пользователь = один просмотр за 24 часа\n\nHyperLogLog в Redis: probabilistic counting уникальных пользователей\n  PFADD "unique_views:{video_id}:{date}" {user_id}\n  PFCOUNT "unique_views:{video_id}:{date}" → оценка уникальных\n  Точность: ±1%, память: 12 КБ на любой объём данных' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: Поиск и рекомендации',
      type: 'practice',
      requirements: [
        'Описать индексирование видео в Elasticsearch',
        'Объяснить автодополнение через Redis Sorted Set',
        'Описать offline компонент рекомендаций (Two-Tower NN)',
        'Описать online компонент (real-time корректировка)',
        'Объяснить разделение offline и online компонентов'
      ],
      hint: 'Поиск и рекомендации — разные системы. Elasticsearch для full-text поиска (инвертированный индекс), ML pipeline для рекомендаций (user/item embeddings). Offline batch: тяжёлые модели на всём датасете. Online: лёгкий скоринг на предвычисленных кандидатах.',
      expectedOutput: 'Поиск: Elasticsearch, Search Worker читает Kafka → индексирует. Автодополнение: Redis Sorted Set популярных запросов. Рекомендации: Two-Tower NN — user embedding ≈ video embedding. Offline (раз в несколько часов): топ-100 → Redis "recs:{user_id}". Online: <5 мс lookup + real-time корректировка.',
      solution: 'Поиск видео (Elasticsearch):\n- Индексирование: title, description, tags, transcript (субтитры)\n- Search Worker читает Kafka "video_published" → ES индексирование\n- Re-ranking: просмотры + дата + релевантность\n- Автодополнение: Redis Sorted Set популярных запросов\n  ZRANGEBYLEX "suggestions" "[openai" "(openaiz" → топ-5\n\nРекомендации (два уровня):\nОнлайн (реальное время): контекст текущего просмотра\n- Collaborative filtering: "похожие пользователи смотрели..."\n\nОффлайн (batch, раз в несколько часов):\n- Two-Tower Neural Network: user embedding ≈ video embedding\n- Предвычислить топ-100 рекомендаций для каждого пользователя\n- Сохранить в Redis: "recs:{user_id}" → [video_ids]\n- При запросе: Redis lookup (< 5 мс) + real-time корректировка',
      explanation: 'Разделение на онлайн и оффлайн компоненты — стандарт ML систем. Оффлайн (batch): тяжёлые модели на всём датасете. Онлайн (реальное время): лёгкие скоринговые модели на уже отобранных кандидатах. Elasticsearch для поиска, а не для рекомендаций — разные задачи требуют разных инструментов.',
      content: [
        { type: 'text', value: 'Поиск по миллиардам видео и персонализированные рекомендации.' },
        { type: 'heading', value: 'Поиск видео' },
        { type: 'text', value: 'Elasticsearch для full-text search:\n  Индексируем: title, description, tags, transcript (субтитры)\n\nSearch pipeline:\n  Query → Elasticsearch → Re-ranking (по просмотрам, дате, релевантности)\n  Facets: фильтр по длине, дате, качеству\n\nАвтодополнение поиска:\n  Redis Sorted Set: популярные запросы\n  При вводе "openai" → показать топ-5 похожих запросов\n  ZRANGEBYLEX "suggestions" "[openai" "(openaiz" LIMIT 0 5' },
        { type: 'heading', value: 'Рекомендации' },
        { type: 'text', value: 'Рекомендации — ML задача. На высоком уровне:\n\nОнлайн компонент (реальное время):\n  Смотрит на текущий контекст (что только что посмотрел)\n  Collaborative filtering: "похожие пользователи смотрели..."\n\nОффлайн компонент (batch, раз в несколько часов):\n  Two-Tower Neural Network: embedding видео и пользователя\n  User vector ≈ Video vector → рекомендация\n  Предвычислить топ-100 рекомендаций для каждого пользователя\n  Сохранить в Redis или специализированном хранилище' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Итоговая архитектура',
      type: 'practice',
      requirements: [
        'Перечислить все сервисы YouTube и их ответственность',
        'Назвать 5 ключевых архитектурных решений',
        'Объяснить почему каждый сервис масштабируется независимо',
        'Обосновать выбор специализированной инфраструктуры',
        'Подвести итог по технологическому стеку'
      ],
      hint: 'YouTube — один из самых технически сложных сервисов. Ключевые решения: прямая загрузка в S3, параллельный транскодинг DAG, HLS adaptive bitrate, многоуровневая CDN, Redis HyperLogLog. Каждый сервис использует специализированную инфраструктуру под свою нагрузку.',
      expectedOutput: 'Перечислены сервисы: Upload, Transcode, Metadata, Stream, Search, Recommendation, Comment, Analytics, Notification. 5 ключевых решений названы и обоснованы. Вывод: специализированная инфраструктура для каждого типа нагрузки (GPU для транскодинга, ML для рекомендаций, CDN для доставки).',
      solution: 'Сервисы YouTube:\n- Upload Service: chunked upload → S3 raw\n- Transcode Service: DAG обработка на GPU instances → несколько форматов\n- Metadata Service: CRUD видео информации → Cassandra\n- Stream Service: генерация signed URL для HLS стриминга\n- Search Service: Elasticsearch + автодополнение\n- Recommendation Service: Two-Tower NN + Redis кеш\n- Comment Service: Cassandra (partition: video_id)\n- Analytics Service: просмотры (Redis INCR + batch flush)\n- Notification Service: новые видео от подписок → Kafka + APNs/FCM\n\nКлючевые архитектурные решения:\n1. Прямая загрузка в S3 — серверы не bottleneck\n2. Параллельный DAG транскодинг — быстрая публикация\n3. HLS Adaptive Bitrate — качество на любой скорости\n4. Трёхуровневая CDN — 277 Тбит/сек доставка\n5. Redis HyperLogLog — масштабируемые уникальные просмотры',
      explanation: 'YouTube — одна из наиболее технически сложных систем: петабайты хранилища, сотни терабит в секунду доставки, миллиарды просмотров. Каждый сервис независимо масштабируется: Transcode (GPU), Stream (CPU/сеть), Recommendation (ML inference). Ключевой принцип: специализированная инфраструктура для каждого типа нагрузки.',
      content: [
        { type: 'text', value: 'Собираем полную картину системы YouTube.' },
        { type: 'heading', value: 'Сервисы' },
        { type: 'text', value: 'Upload Service: принять видео, сохранить raw в S3\nTranscode Service: конвертировать в несколько форматов (GPU instances)\nMetadata Service: CRUD операции с информацией о видео\nStream Service: генерировать signed URL для стриминга\nSearch Service: Elasticsearch индексирование и поиск\nRecommendation Service: ML-based рекомендации\nComment Service: комментарии к видео\nAnalytics Service: просмотры, статистика\nNotification Service: новые видео от подписок' },
        { type: 'heading', value: 'Key Design Decisions' },
        { type: 'list', value: [
          'Chunked upload напрямую в S3 (минуя серверы) — масштабируемость загрузки',
          'Parallel transcode workers (DAG обработка) — скорость публикации',
          'HLS Adaptive Bitrate — качество стриминга на любой скорости',
          'Multi-tier CDN — глобальная доставка с минимальной латентностью',
          'Redis для счётчиков + batch flush — масштабируемые просмотры',
          'HyperLogLog для уникальных просмотров — эффективная память'
        ]},
        { type: 'note', value: 'YouTube реальные факты: хранит более 1 эксабайта (10^18 байт) данных. Загружается 500 часов видео в минуту. Транскодирует каждое видео в 20+ форматов. Использует собственные серверы (не AWS) в Google\'s datacenters по всему миру.' }
      ]
    }
  ]
}
