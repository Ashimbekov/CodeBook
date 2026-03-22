export default {
  id: 17,
  title: 'Проектируем: YouTube',
  description: 'Полное проектирование YouTube: загрузка видео, транскодирование, CDN доставка, поиск, рекомендации. Video streaming architecture.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и оценка',
      type: 'practice',
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
