export default {
  id: 32,
  title: 'SD Mock: URL Shortener + Pastebin',
  description: 'Полная симуляция SD-интервью: URL Shortener (bit.ly) и Pastebin. Каждый урок — один шаг интервью с эталонным ответом. Требования, оценка нагрузки, API, модель данных, хеш-генерация, high-level design, кеширование и аналитика, узкие места.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Уточнение требований',
      type: 'practice',
      description: 'Уточнение scope для URL Shortener: функциональные требования (создать ссылку, редирект), нефункциональные (latency < 50ms, 99.9% uptime) и что не входит в scope.',
      requirements: [
        'Задать интервьюеру вопросы для уточнения scope системы',
        'Сформулировать функциональные требования (3-4 пункта)',
        'Сформулировать нефункциональные требования (3-4 пункта)',
        'Уточнить масштаб: 100M URLs в системе, 500 читателей/сек, 10 записей/сек',
        'Определить что НЕ входит в scope'
      ],
      hint: 'Вопросы интервьюеру: Нужна ли кастомизация alias? Какой срок жизни ссылки? Нужна ли аналитика переходов? Нужна ли авторизация? Это read-heavy или write-heavy система? Какой регион? Отдельные ответы для Pastebin: поддержка синтаксиса? Размер пасты?',
      solution: 'Вопросы к интервьюеру:\n1. Нужна ли возможность создать кастомный alias? (да, опционально)\n2. Есть ли срок жизни ссылки / пасты? (да, default 5 лет, кастомный — опция)\n3. Нужна аналитика (сколько переходов, откуда)? (базовая: счётчик кликов)\n4. Авторизация нужна для создания? (нет, анонимное создание разрешено)\n5. Нужна ли поддержка синтаксиса для Pastebin? (да — опционально, language type)\n\nФункциональные требования:\n- POST /shorten: принять длинный URL → вернуть короткий (short_code 7 символов)\n- GET /{short_code}: перенаправить на оригинальный URL (HTTP 301/302)\n- Опционально: кастомный alias, TTL, счётчик кликов\n- Pastebin: POST /paste, GET /{paste_id} — аналогично\n\nНефункциональные требования:\n- High Availability: 99.9% uptime (система для redirect должна быть доступна всегда)\n- Low Latency: redirect < 50ms (критично для UX)\n- Масштаб: 100M коротких ссылок, 500 read/сек, 10 write/сек\n- Durability: ссылки не теряются\n- Read:Write соотношение = 50:1\n\nНЕ входит в scope:\n- Сложная аналитика (heat maps, user journeys)\n- Социальные функции (sharing, comments)\n- Платные уровни и квоты',
      explanation: 'Уточнение требований — самый важный шаг. Без него есть риск спроектировать не то. Опытный кандидат задаёт вопросы и слушает ответы интервьюера, адаптируя дизайн. Read:Write 50:1 означает read-heavy систему — кеш критичен. Анонимное создание упрощает дизайн (не нужен User Service).'
    },
    {
      id: 2,
      title: 'Шаг 2: Оценка нагрузки',
      type: 'practice',
      description: 'Расчёт QPS (10 write/сек, 500 read/сек), объёма хранилища (50 GB за 5 лет) и размера кеша (10 GB). Вывод: один PostgreSQL + Redis достаточно при данном масштабе.',
      requirements: [
        'Рассчитать write QPS и read QPS (дано: 100M URLs, 500 read/сек)',
        'Оценить объём хранилища за 5 лет',
        'Рассчитать пиковую нагрузку',
        'Оценить требования к кешу',
        'Сделать вывод: какая инфраструктура нужна'
      ],
      hint: '10 write/сек уже дано. Для хранилища: каждый URL = ~500 байт (short_code + original_url + metadata). 100M × 500 байт = 50 GB. За 5 лет: если 10 write/сек, за 5 лет = 10 × 86400 × 365 × 5 = 1.57B записей, но по условию 100M URLs в системе. Кеш: 20% горячих URL = 20M × 500 байт = 10 GB.',
      solution: 'Расчёт QPS:\nWrite QPS: 10 новых URL/сек (дано)\nRead QPS: 500 redirect/сек (дано)\nSoотношение: 500/10 = 50:1 (read-heavy)\nПиковый read: 500 × 3 = 1500/сек\n\nОбъём хранилища (один URL):\nshort_code: 7 байт\noriginal_url: среднее 200 байт\nuser_id (optional): 8 байт\ncreated_at: 8 байт\nexpires_at: 8 байт\ncustom_alias: 20 байт\nclick_count: 8 байт\nИтого: ~260 байт ≈ округлим до 500 байт с overhead\n\nХранилище за 5 лет:\n10 write/сек × 86400 × 365 × 5 ≈ 1.57 миллиарда URL\nОднако система рассчитана на 100M URL → 100M × 500 байт = 50 GB\n50 GB легко помещается в один PostgreSQL сервер!\n\nОбъём redirectов:\n500 read/сек × 86400 × 365 = 15.7 миллиарда/год\n\nРазмер кеша:\n20% горячих URL: 100M × 20% = 20M URL\n20M × 500 байт = 10 GB → Redis с 16 GB RAM\n\nВыводы:\n- 500 read/сек → один PostgreSQL справится (< 10K QPS)\n- НО: Redis кеш снизит latency redirect с ~10ms до ~1ms\n- 50 GB хранилище: один сервер, шардирование не нужно\n- Простая архитектура оправдана данными',
      explanation: '50 GB — это маленький объём для современных серверов. Система URL Shortener при 500 QPS проще чем кажется. Кеш нужен не для выживания, а для low latency (< 50ms). Честная оценка нагрузки помогает не переусложнить архитектуру. Многие кандидаты проектируют Cassandra и Kafka для системы которая прекрасно живёт на одном PostgreSQL + Redis.'
    },
    {
      id: 3,
      title: 'Шаг 3: API Design',
      type: 'practice',
      description: 'REST API для URL Shortener и Pastebin: POST /urls, GET /{short_code} (302 vs 301), GET /stats. Обоснование 302 Temporary Redirect для сохранения аналитики кликов.',
      requirements: [
        'Спроектировать REST API для URL Shortener (3 эндпоинта)',
        'Спроектировать REST API для Pastebin (3 эндпоинта)',
        'Указать HTTP методы, пути, request body и response',
        'Обоснать выбор HTTP 301 vs 302 для redirect',
        'Добавить rate limiting'
      ],
      hint: '301 Permanent Redirect: браузер кешируют — снижает нагрузку, но аналитика кликов теряется. 302 Temporary Redirect: каждый клик проходит через сервер — аналитика работает, но больше нагрузки. Для бизнеса с аналитикой — 302.',
      solution: 'URL Shortener API:\n\n1. Создать короткую ссылку:\nPOST /api/v1/urls\nRequest Body:\n{\n  "original_url": "https://very-long-url.com/path?query=value",\n  "custom_alias": "mylink",  // optional\n  "expires_at": "2027-01-01" // optional\n}\nResponse 201 Created:\n{\n  "short_code": "abc1234",\n  "short_url": "https://sho.rt/abc1234",\n  "original_url": "https://very-long-url.com/...",\n  "expires_at": "2031-01-01"\n}\nError 400: невалидный URL\nError 409: alias уже занят\n\n2. Редирект:\nGET /{short_code}\nResponse 302 Found\nHeader: Location: https://original-url.com\nError 404: код не найден\nError 410 Gone: ссылка истекла\n\n3. Статистика:\nGET /api/v1/urls/{short_code}/stats\nResponse: { "click_count": 1542, "created_at": "...", "expires_at": "..." }\n\nPastebin API:\n\n1. Создать пасту:\nPOST /api/v1/pastes\nRequest: { "content": "...", "language": "python", "expires_in": 3600 }\nResponse 201: { "paste_id": "xyz789", "url": "https://paste.it/xyz789" }\n\n2. Получить пасту:\nGET /{paste_id}\nResponse 200: { "content": "...", "language": "python", "created_at": "..." }\n\n3. Удалить:\nDELETE /api/v1/pastes/{paste_id}\nResponse 204 No Content\n\nRate Limiting:\nPOST /urls: 10 создания/час на IP (anonymous)\nGET /{short_code}: 1000 redirects/мин на IP (defence против DDoS)',
      explanation: '302 вместо 301 для redirect: при 301 браузеры кешируют редирект навсегда, обходя наш сервер. Аналитика кликов перестаёт работать. 302 гарантирует что каждый клик проходит через нас. Компромисс: больше нагрузки, но полная аналитика. Версионирование /v1/ позволит выпустить новый API без поломки старых клиентов.'
    },
    {
      id: 4,
      title: 'Шаг 4: Модель данных',
      type: 'practice',
      description: 'Схема PostgreSQL для URL Shortener (short_code PK, индексы) и Pastebin (метаданные в SQL, контент в S3). Обоснование разделения данных по типу хранилища.',
      requirements: [
        'Спроектировать схему БД для URL Shortener',
        'Спроектировать схему для Pastebin (с учётом больших текстов)',
        'Указать индексы и обосновать их',
        'Обосновать выбор SQL (PostgreSQL) для данного масштаба',
        'Объяснить где хранить контент Pastebin (SQL vs Object Storage)'
      ],
      hint: 'URL таблица простая: short_code (PK), original_url, created_at, expires_at. Индекс по short_code (уже PK). Pastebin: content может быть до 10MB — не храни в SQL, используй S3! В БД храни только метаданные + S3 key.',
      solution: 'Схема для URL Shortener (PostgreSQL):\n\nCREATE TABLE urls (\n  short_code   VARCHAR(10) PRIMARY KEY,\n  original_url TEXT NOT NULL,\n  custom_alias VARCHAR(50) UNIQUE,\n  created_at   TIMESTAMP DEFAULT NOW(),\n  expires_at   TIMESTAMP,\n  click_count  BIGINT DEFAULT 0,\n  creator_ip   INET    -- для rate limiting\n);\n\nINDEX: short_code — уже PRIMARY KEY (B-tree index, поиск O(log n))\nINDEX: expires_at — для batch удаления истёкших ссылок\n\nCREATE TABLE url_clicks (\n  id         BIGSERIAL PRIMARY KEY,\n  short_code VARCHAR(10) REFERENCES urls(short_code),\n  clicked_at TIMESTAMP DEFAULT NOW(),\n  user_agent TEXT,\n  referer    TEXT\n) PARTITION BY RANGE (clicked_at); -- партиционирование по дате\n\nСхема для Pastebin:\n\nCREATE TABLE pastes (\n  paste_id    VARCHAR(10) PRIMARY KEY,\n  title       VARCHAR(255),\n  language    VARCHAR(50),\n  size_bytes  INT,\n  s3_key      VARCHAR(255) NOT NULL, -- ключ в S3 для контента\n  created_at  TIMESTAMP DEFAULT NOW(),\n  expires_at  TIMESTAMP,\n  view_count  BIGINT DEFAULT 0\n);\n\nКонтент пасты → S3:\n- Пасты могут быть до 10 MB\n- 100M паст × 100 KB avg = 10 TB → нельзя в PostgreSQL\n- S3 bucket: "pastes/{paste_id}.txt"\n- Чтение: GET /paste_id → найти s3_key в БД → fetch из S3\n\nОбоснование SQL:\n- 100M записей × 500 байт = 50 GB — PostgreSQL справляется\n- ACID нужен (не потерять ссылки)\n- Простые запросы по PRIMARY KEY — индекс B-tree\n- Нет необходимости в NoSQL при данном масштабе',
      explanation: 'Разделение данных: метаданные в PostgreSQL (быстрый lookup), контент в S3 (дешёвое хранение больших объёмов). Это стандартный паттерн для систем с пользовательским контентом. url_clicks — отдельная таблица для аналитики, чтобы не замедлять основную таблицу. Партиционирование по дате позволяет удалять старые клики без полного VACUUM.'
    },
    {
      id: 5,
      title: 'Шаг 5: Генерация хеша (Base62 и коллизии)',
      type: 'practice',
      description: 'Генерация short_code через Base62 (62^7 = 3.5 триллиона кодов): сравнение MD5+truncate, Auto-increment+Base62 и Pre-generated pool. Рекомендация: Auto-increment + Base62.',
      requirements: [
        'Описать алгоритм генерации short_code через Base62 encoding',
        'Объяснить проблему коллизий и как её решить',
        'Сравнить три подхода: MD5+truncate, Auto-increment+Base62, Pre-generated pool',
        'Рассчитать ёмкость пространства для 7-символьного Base62 кода',
        'Выбрать лучший подход для данной системы и обосновать'
      ],
      hint: 'Base62 = [a-z A-Z 0-9] = 62 символа. 62^7 = 3.5 триллиона уникальных кодов — достаточно. MD5(URL)[:7]: риск коллизии (разные URL → одинаковые первые 7 символов). Auto-increment → Base62: детерминировано, без коллизий, но угадываемо. Pre-generated pool: безопасно, но сложнее.',
      solution: 'Пространство имён Base62:\nАлфавит: [a-z] + [A-Z] + [0-9] = 26 + 26 + 10 = 62 символа\n7-символьный код: 62^7 = 3 521 614 606 208 ≈ 3.5 триллиона\n10 write/сек × 86400 × 365 × 100 лет = 31.5 миллиарда\n3.5 триллиона >> 31.5 миллиарда → хватит на >100 лет!\n\nПодход 1: MD5 URL → Base62 → взять первые 7 символов\nmd5("https://example.com") = "a7d8f2..."\nbase62_encode(a7d8f2) = "gT3xYq1"\n\nМинусы:\n- Коллизия возможна (разные URL → одинаковый хеш)\n- Нужно проверять БД и добавлять суффикс при коллизии\n- Ленивая обработка коллизий усложняет код\n\nПодход 2: Auto-increment ID → Base62 encode (РЕКОМЕНДУЕТСЯ)\nINSERT INTO urls → получить id = 12345678\nBase62(12345678) = "FXdiS" → дополнить до 7: "00FXdiS"\n\nПлюсы:\n- Гарантированно уникальный (auto-increment)\n- Без коллизий\n- Детерминированный и простой\nМинусы:\n- Предсказуемый (id=1 → "0000001") → можно угадать следующую ссылку\n- Решение: начать с большого random ID или добавить соль\n\nПодход 3: Pre-generated pool\nГенератор заранее создаёт миллион уникальных кодов\nSQL таблица: unused_codes (code VARCHAR PRIMARY KEY)\nПри создании URL: SELECT code, DELETE FROM unused_codes LIMIT 1\n\nПлюсы: гарантированная уникальность, непредсказуемые коды\nМинусы: сложность управления пулом, нужен background job\n\nРекомендация для 500 QPS: Подход 2 (Auto-increment + Base62)\nПростота важнее идеальной безопасности. При нужде — рандомизировать начальный ID.',
      explanation: 'Base62 выбирается потому что Base64 содержит "+" и "/" — символы небезопасные в URL. Base62 использует только URL-safe символы. Auto-increment + Base62 — стандартный выбор для систем среднего масштаба: простой, надёжный, без коллизий. Pre-generated pool используют системы с очень высоким write QPS где конкурентный auto-increment может стать узким местом.'
    },
    {
      id: 6,
      title: 'Шаг 6: Высокоуровневый дизайн',
      type: 'practice',
      description: 'Архитектура URL Shortener: Client → CDN → LB → API Servers → Redis → PostgreSQL. Write path (генерация short_code) и read path (redirect с cache-aside).',
      requirements: [
        'Нарисовать (описать текстом) высокоуровневую архитектуру',
        'Описать write path: создание короткой ссылки',
        'Описать read path: переход по короткой ссылке',
        'Указать все компоненты: LB, API серверы, кеш, БД, CDN',
        'Объяснить где стоит кеш и что он кеширует'
      ],
      hint: 'Архитектура: Client → CDN (для статики) → LB → [API Server x N] → Redis Cache → PostgreSQL. Write: нет CDN (мутирующий запрос). Read/redirect: сначала Redis, потом PostgreSQL. API серверы — stateless, их можно горизонтально масштабировать.',
      solution: 'Высокоуровневая архитектура:\n\n[Client Browser / Mobile App]\n        |\n[CDN (Cloudflare)] -- кешируем статику и HOT redirects\n        |\n[Load Balancer (AWS ALB)] -- round-robin, health checks\n        |\n[API Server x 3] -- stateless, горизонтально масштабируемы\n   /        \\\n[Redis]  [PostgreSQL]\n(Cache)  (Primary + 1 Read Replica)\n              |\n           [S3] -- контент Pastebin\n\nWrite Path (POST /urls — создание ссылки):\n1. Client → LB → API Server\n2. Валидировать URL (проверить что это валидный URL)\n3. INSERT в PostgreSQL → получить auto-increment id\n4. Encode id в Base62 → short_code\n5. Сохранить запись с short_code\n6. Вернуть short_url клиенту\n7. (async) Прогреть кеш Redis: SET "url:{short_code}" original_url EX 86400\n\nRead Path (GET /abc1234 — редирект):\n1. Client → LB → API Server\n2. GET "url:abc1234" из Redis → hit?\n3. Cache HIT: return 302 Location: original_url\n   Cache MISS: SELECT original_url FROM urls WHERE short_code = "abc1234"\n              → проверить expires_at (410 если истекло)\n              → Redis SET (прогреть кеш)\n              → return 302 Location: original_url\n4. async: increment click_count в PostgreSQL\n\nCDN для redirect (оптимизация):\nPopular links (hot): CDN Edge кеширует 302 response\nHits идут прямо с CDN, не достигая API серверов\nCache-Control: max-age=3600 для горячих ссылок',
      explanation: 'Архитектура намеренно проста для данного масштаба. 500 read/сек — это 43 миллиона в день. Redis с 10GB для 20M горячих ссылок даст hit rate 90%+. PostgreSQL легко обработает оставшиеся 10% (50 QPS к БД). Три API сервера — избыточность и rolling deploys. CDN для редиректов горячих ссылок — продвинутая оптимизация, стоит упомянуть.'
    },
    {
      id: 7,
      title: 'Шаг 7: Deep Dive — кеширование и аналитика',
      type: 'practice',
      description: 'Cache-Aside паттерн для redirect. Решение проблемы click_count hotspot: Redis INCR + периодический flush в PostgreSQL вместо UPDATE на каждый запрос.',
      requirements: [
        'Углублённо разобрать стратегию кеширования: что кешировать, TTL, eviction',
        'Описать Cache-Aside паттерн для redirect',
        'Описать систему аналитики кликов: синхронная vs асинхронная',
        'Объяснить проблему счётчика кликов при высокой нагрузке',
        'Предложить решение для click_count без блокировки БД'
      ],
      hint: 'Инкремент click_count на каждый redirect — дорого (UPDATE на каждый запрос). Решение: Redis INCR для буферизации, периодически flush в PostgreSQL (batch UPDATE). Или: Kafka события clicks → consumer обновляет счётчик. Cache eviction: LRU (Least Recently Used) стандартно для URL кеша.',
      solution: 'Детальная стратегия кеширования:\n\nRedis ключи для URL Shortener:\n"url:{short_code}" → original_url (самый горячий паттерн)\n"url:{short_code}:meta" → {expires_at, click_count} \nTTL: 24 часа (большинство кликов в первые сутки)\n\nCache-Aside для redirect:\nFunction redirect(short_code):\n  url = redis.get("url:" + short_code)\n  if url is None:\n    record = db.query("SELECT * FROM urls WHERE short_code = ?", short_code)\n    if record is None: return 404\n    if record.expires_at < now(): return 410\n    redis.setex("url:" + short_code, 86400, record.original_url)\n    url = record.original_url\n  return redirect(302, url)\n\nEviction Policy: maxmemory-policy allkeys-lru\nПри заполнении RAM: удалять наименее недавно используемые ключи\n\nАналитика кликов — проблема:\nНаивно: UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?\nПроблема: 500 UPDATE/сек на одну строку → table lock!\nДля популярной ссылки (viral) это убьёт БД\n\nРешение 1: Redis INCR (буферизация)\nПри каждом клике: INCR "clicks:{short_code}"\nBackground job (каждые 60 сек):\n  для каждого ключа "clicks:*":\n    count = redis.getdel("clicks:{short_code}")\n    db.execute("UPDATE urls SET click_count = click_count + ? WHERE short_code = ?", count, short_code)\nПлюс: 1 UPDATE/мин вместо 500/сек\n\nРешение 2: Kafka async pipeline\nПри клике: kafka.produce("url_clicks", {short_code, timestamp, user_agent})\nConsumer: batch обработка каждые 30 сек → UPDATE\nПлюс: полные данные для аналитики (не только счётчик)',
      explanation: 'Счётчик кликов — классическая проблема write hotspot. Redis INCR + периодический flush — элегантное решение: O(1) операция в Redis, минимальная нагрузка на БД. Kafka pipeline даёт дополнительно полные данные для analytics (kто кликнул, откуда, с какого устройства). На интервью умение выявить и решить write hotspot — признак опытного инженера.'
    },
    {
      id: 8,
      title: 'Шаг 8: Узкие места и follow-up вопросы',
      type: 'practice',
      description: 'Узкие места системы (PostgreSQL SPOF, Redis SPOF) и ответы на follow-up: рост до 50K QPS, 99.99% availability, защита от abuse и удаление истёкших ссылок.',
      requirements: [
        'Выявить потенциальные узкие места в спроектированной системе',
        'Ответить на follow-up: что если система вырастет до 50K QPS?',
        'Ответить на follow-up: как обеспечить 99.99% availability?',
        'Ответить: как предотвратить abuse (спам, фишинговые ссылки)?',
        'Ответить: как реализовать мягкое удаление истёкших ссылок?'
      ],
      hint: 'Узкие места при росте: одна PostgreSQL instance, один Redis (SPOF). При 50K QPS: Redis Cluster + PostgreSQL read replicas. 99.99%: multi-AZ deployment, автофейловер. Abuse: URL blacklist (Google Safe Browsing API), rate limiting по IP, CAPTCHA для массового создания. Expired links: background job, партиционирование по expires_at.',
      solution: 'Потенциальные узкие места:\n\n1. PostgreSQL Single Point of Failure\nПроблема: один Primary — если упадёт, запись недоступна\nРешение: PostgreSQL Primary + Standby (hot standby)\nАвто-failover: Patroni + etcd (или AWS RDS Multi-AZ)\nRTO (Recovery Time Objective): < 30 сек при автофейловере\n\n2. Redis SPOF\nПроблема: один Redis — кеш недоступен → все запросы в БД\nРешение: Redis Sentinel (мониторинг + автофейловер)\n  или Redis Cluster (шардирование + репликация)\nПри Redis смерти: система деградирует (медленнее), но не падает\n\nFollow-up: рост до 50K read QPS:\nRead QPS 50K → Redis легко справится (100K+ ops/сек)\nЕсли Redis не справляется: Redis Cluster (шардирование)\nAPI серверы: scale out (10-20 инстансов за LB)\nПостgresql: read replicas для оставшихся cache miss\n\nFollow-up: 99.99% availability:\n99.99% = 52 мин downtime в год (vs 99.9% = 8.7 часов)\nТребования:\n- Multi-AZ deployment (нет зависимости от одной зоны доступности)\n- Автофейловер для всех компонентов (LB, API, Redis, PostgreSQL)\n- Canary deploys (постепенный роллаут, не всё сразу)\n- Circuit breakers (не каскадные сбои)\n- Health checks + auto-restart (Kubernetes liveness probes)\n\nAbuse Prevention:\n- Rate limiting: 10 URL/час на IP (anonymous), 100/час (авторизованный)\n- Google Safe Browsing API: проверить URL на фишинг/малварь\n- Blocklist популярных схем фишинга\n- CAPTCHA при массовом создании (> 3 создания за 5 мин)\n- Reporting: пользователи могут жаловаться на вредоносные ссылки\n- Scan worker: async проверка новых URL\n\nУдаление истёкших ссылок (Soft Delete):\nПодход: не удалять сразу — пометить как expired\nBackground job (каждые 5 мин):\n  SELECT short_code FROM urls WHERE expires_at < NOW() AND deleted = false LIMIT 1000\n  UPDATE urls SET deleted = true WHERE short_code IN (...)\n  redis.delete("url:{short_code}") для каждого\n\nПартиционирование по expires_at:\nOLD partition (expires_at < год назад) → DROP PARTITION\nЭффективнее чем DELETE миллионов строк',
      explanation: 'Follow-up вопросы выявляют глубину понимания. 99.99% availability требует multi-AZ и автофейловера — это существенно сложнее 99.9%. Abuse prevention — часто задаваемый follow-up который многие кандидаты игнорируют. Мягкое удаление через background job с партиционированием — правильный подход: не блокируем основную БД дорогими DELETE операциями. Завершай интервью обзором trade-offs: что упростили, что можно улучшить при большем масштабе.'
    }
  ]
}
