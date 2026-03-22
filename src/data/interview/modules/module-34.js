export default {
  id: 34,
  title: 'SD Mock: Twitter + Instagram + YouTube',
  description: 'Три мини-дизайна в одном модуле: Twitter (лента, fan-out, trending), Instagram (загрузка фото, stories), YouTube (видео, транскодинг, CDN, рекомендации). Все уроки — практика с модельными ответами.',
  lessons: [
    {
      id: 1,
      title: 'Twitter: требования и оценка нагрузки',
      type: 'practice',
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
