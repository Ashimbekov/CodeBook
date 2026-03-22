export default {
  id: 15,
  title: 'Проектируем: URL Shortener',
  description: 'Полное проектирование URL-сокращателя (bit.ly): требования, оценка нагрузки, API, модель данных, алгоритм генерации, масштабирование.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования',
      type: 'practice',
      requirements: [
        'Определить функциональные требования (создание, редирект, aliases)',
        'Уточнить масштаб: количество ссылок в день и redirects',
        'Определить SLA и допустимую latency',
        'Сформулировать нефункциональные требования',
        'Очертить out of scope'
      ],
      hint: 'Начни с вопросов к интервьюеру: сколько ссылок создаётся в день? Сколько redirects? Нужна ли аналитика? Нужны ли аккаунты? Ответы определят масштаб и выбор технологий.',
      expectedOutput: 'Функциональные требования зафиксированы: создание, редирект, aliases, TTL. Нефункциональные: масштаб (write/read RPS), SLA 99.99%, latency < 10 мс для redirect. Out of scope определён (аккаунты, custom domains, детальная аналитика).',
      solution: 'Функциональные требования URL Shortener:\n- POST /shorten: длинный URL → короткий код (7 символов, base62)\n- GET /{code}: редирект 302 на оригинальный URL\n- Кастомные aliases (опционально)\n- Срок жизни ссылки по умолчанию 5 лет\n\nНефункциональные требования:\n- Масштаб: 100M новых ссылок/день, 10B redirects/день\n- Доступность: 99.99% (redirect никогда не должен падать)\n- Latency redirect: < 10 мс\n- Хранение: 5 лет\n- Аутентификация: не нужна (анонимный сервис)\n- Аналитика: только счётчик переходов\n\nOut of scope: пользовательские аккаунты, custom domains, детальная аналитика',
      explanation: 'Уточнение требований за 5–7 минут — фундамент всего дизайна. Функциональные требования определяют API; нефункциональные (масштаб, SLA, latency) — выбор технологий. Разделение in-scope/out-of-scope защищает от расширения задачи и экономит время интервью.',
      content: [
        { type: 'text', value: 'Начинаем проектирование с уточнения требований. Никогда не пропускайте этот шаг!' },
        { type: 'heading', value: 'Функциональные требования' },
        { type: 'list', value: [
          'Пользователь вводит длинный URL → получает короткий (например, bit.ly/XkP2q)',
          'Переход по короткому URL → redirect на оригинальный',
          'Кастомные aliases: пользователь может задать свой slug (bit.ly/my-link)',
          'Срок жизни ссылки: по умолчанию 5 лет, можно задать кастомный'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          'Высокая доступность: 99.99% (redirect должен работать всегда)',
          'Низкая латентность redirect: < 10 мс (пользователь не должен замечать)',
          'Масштаб: 100 млн новых ссылок в день, 10 млрд redirects в день',
          'Short URL случайный (не предсказуемый)',
          'Аналитика: сколько раз перешли по ссылке (опционально)'
        ]},
        { type: 'heading', value: 'Out of Scope (не делаем)' },
        { type: 'list', value: [
          'Аккаунты пользователей (делаем анонимный сервис)',
          'Детальная аналитика (только счётчик переходов)',
          'API для управления ссылками',
          'Custom domains (bit.ly/domain)'
        ]},
        { type: 'tip', value: 'На интервью: 5–7 минут на требования — это норма. Записывайте согласованные требования на доске. Это reference на весь дальнейший дизайн.' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Оценка нагрузки',
      type: 'practice',
      requirements: [
        'Рассчитать write RPS (создание ссылок)',
        'Рассчитать read RPS (redirects)',
        'Определить read/write ratio',
        'Оценить объём хранилища за 5 лет',
        'Обосновать длину короткого кода (количество символов)'
      ],
      hint: 'Переводи дневные цифры в секунды (делить на 86 400). Считай объём: одна запись × количество записей × лет. Для пространства кодов: base62^N — сколько лет хватит при текущей скорости создания?',
      expectedOutput: 'Write RPS: ~1 200. Read RPS: ~120 000. Read/Write = 100:1 (система read-heavy). Хранилище за 5 лет: ~91 ТБ. Пространство base62 с 7 символами = 3.5 трлн комбинаций = 95 лет. Вывод: нужен кеш для redirect path.',
      solution: 'Write (создание ссылок):\n100M / 86,400 ≈ 1,200 write RPS\nХранилище: 100M × 500 байт × 365 × 5 = ~91 ТБ за 5 лет\n\nRead (redirects):\n10B / 86,400 ≈ 120,000 read RPS\nRead/Write = 100:1 → система read-heavy\n\nПространство кодов (base62):\n7 символов: 62^7 = 3.5 трлн комбинаций\n3.5 трлн / 100M в день = 34,000 дней = 95 лет → достаточно\n\nВыводы:\n- Система read-heavy (100:1) → кеш критически важен\n- 91 ТБ хранилища → нужна NoSQL БД с горизонтальным масштабированием\n- Пространство кодов → 7 символов base62 достаточно на 95 лет',
      explanation: 'Расчёт read/write ratio определяет архитектурные решения: 100:1 означает, что 99% нагрузки — это redirect, а не создание. Кеш снимет 98% этой нагрузки. Хранилище 91 ТБ исключает обычный SQL на одном сервере — нужен NoSQL с шардированием.',
      content: [
        { type: 'text', value: 'Back-of-the-envelope расчёты для понимания масштаба системы.' },
        { type: 'heading', value: 'Write (создание ссылок)' },
        { type: 'text', value: '100 млн новых ссылок в день\n100,000,000 / 86,400 сек ≈ 1,160 write RPS\nОкруглим: ~1,200 write RPS\n\nХранилище:\n  Одна запись ≈ 500 байт (URL до 2048 символов + метаданные)\n  100M × 500 bytes = 50 ГБ в день\n  За 5 лет: 50 ГБ × 365 × 5 = 91 ТБ' },
        { type: 'heading', value: 'Read (redirects)' },
        { type: 'text', value: '10 млрд redirects в день\n10,000,000,000 / 86,400 ≈ 115,700 read RPS\nОкруглим: ~120,000 read RPS\n\nRead/Write ratio = 120,000 / 1,200 = 100:1\n→ Система сильно read-heavy\n→ Нужен кеш для redirects' },
        { type: 'heading', value: 'Пространство коротких URL' },
        { type: 'text', value: 'Используем base62 (a-z, A-Z, 0-9) = 62 символа\n\n6 символов: 62^6 = 56 млрд комбинаций\nПри 100M в день: 56B / 100M = 560 дней ≈ 1.5 года\n\n7 символов: 62^7 = 3.5 трлн комбинаций\nПри 100M в день: 95 лет! → достаточно для нас\n\nВыбираем: 7 символов base62.' },
        { type: 'note', value: 'Важный результат расчётов: система read-heavy (100:1). Это означает: кеш критически важен, нужно оптимизировать redirect path, write latency менее критична.' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: API Design',
      type: 'practice',
      requirements: [
        'Спроектировать эндпоинт создания короткой ссылки',
        'Спроектировать эндпоинт redirect',
        'Выбрать HTTP статус-коды (201, 302 или 301)',
        'Описать формат запроса и ответа',
        'Обосновать выбор 301 vs 302 для redirect'
      ],
      hint: 'Для redirect ключевой вопрос: нужна ли аналитика кликов? 302 (временный) — каждый клик проходит через сервер, можно считать. 301 (постоянный) — браузер кеширует, нагрузка меньше, но аналитика теряется.',
      expectedOutput: 'POST /api/v1/urls спроектирован с телом запроса и ответом 201. GET /{code} возвращает 302 с Location заголовком. Выбор 302 обоснован (аналитика кликов важна). Описаны ошибки: 400, 409, 422.',
      solution: 'Два ключевых эндпоинта:\n\nСоздание короткой ссылки:\nPOST /api/v1/urls\nBody: {original_url, custom_alias?, expires_at?}\nResponse 201: {short_url, short_code, original_url, created_at, expires_at}\nОшибки: 400 (невалидный URL), 409 (alias занят), 422 (URL заблокирован)\n\nRedirect:\nGET /{short_code}\nResponse 302 Found: Location: {original_url}\n301 vs 302: выбираем 302 (временный) — браузер не кеширует, каждый переход проходит через наш сервер → можно считать клики.\n301 (постоянный) — браузер кеширует → меньше нагрузки, но нет аналитики.',
      explanation: 'Выбор 301 vs 302 — реальный trade-off. 301 снижает нагрузку на 80–90% (браузер кеширует и ходит напрямую), но ломает аналитику. 302 позволяет считать каждый клик — ценно для бизнеса. Для bit.ly логика = 302, т.к. аналитика — ключевая функция продукта.',
      content: [
        { type: 'text', value: 'Проектируем два ключевых API эндпоинта.' },
        { type: 'heading', value: 'Создание короткой ссылки' },
        { type: 'text', value: 'POST /api/v1/urls\n\nRequest Body:\n  {\n    "original_url": "https://www.example.com/very/long/url?with=params",\n    "custom_alias": "my-link",    // опционально\n    "expires_at": "2025-12-31"    // опционально\n  }\n\nResponse 201 Created:\n  {\n    "short_url": "https://bit.ly/XkP2q7A",\n    "short_code": "XkP2q7A",\n    "original_url": "https://...",\n    "created_at": "2024-01-15T10:30:00Z",\n    "expires_at": "2029-01-15T10:30:00Z"\n  }\n\nОшибки:\n  400: невалидный URL\n  409: custom_alias уже занят\n  422: URL заблокирован (malware, spam)' },
        { type: 'heading', value: 'Redirect' },
        { type: 'text', value: 'GET /{short_code}\n  (например: GET /XkP2q7A)\n\nResponse 301 Moved Permanently (или 302 Found):\n  Location: https://www.example.com/very/long/url?with=params\n\n301 vs 302:\n  301 Permanent: браузер кеширует редирект, следующий раз идёт напрямую. Меньше нагрузки на наш сервер, но нельзя отследить повторные переходы.\n  302 Temporary: браузер каждый раз спрашивает нас. Можно считать клики.\n  \nВыбор: 302 (нам нужна аналитика кликов).' },
        { type: 'tip', value: '301 vs 302 — реальный trade-off на интервью. Объясните: 301 снижает нагрузку, но ломает аналитику. 302 добавляет нагрузку, но даёт контроль. Для bit.ly логика = 302.' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Модель данных',
      type: 'practice',
      requirements: [
        'Спроектировать схему таблицы url_mappings',
        'Определить типы полей и индексы',
        'Обосновать выбор NoSQL вместо SQL',
        'Объяснить почему Redis не подходит как основная БД',
        'Оценить объём одной записи в байтах'
      ],
      hint: 'Ключевой вопрос: какие запросы будут выполняться? Только по short_code (primary key). Нет JOIN, нет сложных фильтров. Плюс объём данных — 91 ТБ за 5 лет. Эти два фактора определяют выбор хранилища.',
      expectedOutput: 'Таблица url_mappings спроектирована: short_code PK, original_url, expires_at, hit_count. Выбран DynamoDB/Cassandra — обоснование: key-value паттерн + 91 ТБ. PostgreSQL отклонён (сложное горизонтальное масштабирование). Redis отклонён (91 ТБ не влезает в память). Индекс на expires_at для batch-очистки.',
      solution: 'Таблица url_mappings:\n- short_code VARCHAR(7) PRIMARY KEY (hash index)\n- original_url VARCHAR(2048) NOT NULL\n- created_at TIMESTAMP\n- expires_at TIMESTAMP (nullable)\n- hit_count BIGINT DEFAULT 0\n\nИндекс на expires_at — для очистки устаревших записей.\n\nВыбор БД: Cassandra или DynamoDB\nПочему не PostgreSQL:\n- 91 ТБ за 5 лет → горизонтальное масштабирование обязательно\n- Все запросы по primary key (short_code) → нет JOIN, нет сложных запросов\n- Key-Value паттерн = идеальный fit для NoSQL\n- DynamoDB/Cassandra: auto-sharding, высокий throughput\n\nПочему не Redis как основная БД: 91 ТБ не помещается в память.',
      explanation: 'Выбор NoSQL обоснован паттерном доступа (только по primary key) и масштабом (91 ТБ). SQL был бы правильным при сложных запросах или транзакциях, но здесь их нет. DynamoDB предпочтительнее Cassandra для managed решения без операционных сложностей. Индекс на expires_at — для batch-очистки, не для поиска.',
      content: [
        { type: 'text', value: 'Проектируем схему хранения данных.' },
        { type: 'heading', value: 'Таблица url_mappings' },
        { type: 'text', value: 'short_code  VARCHAR(7)   PRIMARY KEY\noriginal_url VARCHAR(2048) NOT NULL\ncreated_at  TIMESTAMP    DEFAULT NOW()\nexpires_at  TIMESTAMP    NULL\nhit_count   BIGINT       DEFAULT 0\n\nИндексы:\n  PRIMARY KEY: short_code (hash index — точные lookups)\n  INDEX: expires_at (для удаления истёкших)\n\nРазмер:\n  Одна строка ≈ 7 + 2048 + 8 + 8 + 8 = ~2.1 КБ\n  100M строк × 2.1 КБ = 210 ГБ — влезает на один сервер!\n  \nНо за 5 лет: 100M × 365 × 5 = 182.5 млрд строк → нужно шардирование' },
        { type: 'heading', value: 'Выбор БД' },
        { type: 'text', value: 'Варианты:\n1. PostgreSQL/MySQL: ACID, но горизонтальное масштабирование сложно\n2. Cassandra: горизонтально масштабируемая, eventual consistency\n3. DynamoDB: managed, auto-scaling\n\nВыбор: DynamoDB или Cassandra\nПочему:\n  - Lookups исключительно по primary key (short_code)\n  - Нет JOIN, нет сложных запросов\n  - Огромный объём данных → нужно горизонтальное масштабирование\n  - Key-value паттерн идеально подходит для NoSQL' },
        { type: 'note', value: 'На интервью объясните выбор. "Я выбираю Cassandra, потому что: 1) огромный объём данных, 2) все запросы по primary key, 3) нет транзакций, нет JOIN, 4) нужна горизонтальная масштабируемость." Это ответ на 10/10.' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Алгоритм генерации коротких кодов',
      type: 'practice',
      requirements: [
        'Описать алгоритм случайной генерации + проверка коллизий',
        'Описать подход Counter + Base62',
        'Объяснить Range-based Counter для масштабируемости',
        'Сравнить MD5/SHA256 хеш URL как метод генерации',
        'Указать рекомендуемый подход и почему'
      ],
      hint: 'Оцени каждый подход по двум критериям: гарантирует ли уникальность без дополнительных запросов к БД? Масштабируется ли горизонтально без единой точки записи? Range-based Counter решает оба критерия.',
      expectedOutput: 'Три подхода рассмотрены. Random: прост, коллизии растут со временем. MD5: коллизии при совпадении первых 7 символов. Range-based Counter: рекомендуется — гарантированная уникальность, горизонтальное масштабирование, каждый инстанс работает со своим диапазоном. Аналогия с Snowflake ID объяснена.',
      solution: 'Рекомендуемый подход: Range-based Counter + Base62\n\n1. Централизованный счётчик (atomically incremented)\n2. ID Generator выдаёт диапазоны инстансам (Range-based):\n   - Сервер 1: IDs 1–10,000\n   - Сервер 2: IDs 10,001–20,000\n3. Конвертация числа в base62: 12345678 → "FPucN" (дополнить до 7 символов)\n\nАльтернативы:\n- Random + проверка коллизий: прост, но коллизии растут с заполненностью пространства\n- MD5(URL) + первые 7 символов: коллизии при разных URL → дополнительная логика\n\nПочему Range-based Counter лучше:\n- Гарантированная уникальность без проверки БД\n- Нет centralized bottleneck (каждый инстанс использует свой диапазон)\n- Snowflake ID (Twitter) использует аналогичный подход\n- Масштабируется горизонтально',
      explanation: 'Range-based Counter устраняет два bottleneck: проверку коллизий (дополнительный round-trip к БД) и центральный счётчик (единая точка записи). Каждый инстанс работает независимо со своим диапазоном, запрашивая новый лишь когда тот исчерпан (~10,000 операций).',
      content: [
        { type: 'text', value: 'Как генерировать уникальные 7-символьные коды для миллионов ссылок?' },
        { type: 'heading', value: 'Вариант 1: Random + проверка коллизий' },
        { type: 'text', value: 'Псевдокод:\nfunction generateShortCode():\n  while true:\n    code = randomBase62(7)  // случайные 7 символов\n    if not db.exists(code):\n      return code\n\nПроблема: при 1M+ существующих кодов вероятность коллизии растёт.\nПри заполненности 1% пространства: ~1% запросов потребуют повторной генерации.\n\nДопустимо при 56 млрд комбинациях — коллизии редки.' },
        { type: 'heading', value: 'Вариант 2: Counter + Base62 (рекомендуется)' },
        { type: 'text', value: 'Централизованный атомарный счётчик + конвертация в base62.\n\nAlgorithm:\n1. Атомарно инкрементировать глобальный счётчик\n2. Конвертировать число в base62\n\nПример:\n  counter = 12345678\n  12345678 в base62 = "FPucN"\n  Дополнить до 7 символов = "0FPucN0"\n\nПлюсы: гарантированная уникальность, нет проверки коллизий\nМинусы: централизованный счётчик = bottleneck\n\nРешение bottleneck: Range-based ID (выдаём диапазоны инстансам)\n  Сервер 1: использует IDs 1–10,000\n  Сервер 2: использует IDs 10,001–20,000\n  Когда закончатся — берут новый диапазон' },
        { type: 'heading', value: 'Вариант 3: Hash URL + усечение' },
        { type: 'text', value: 'MD5(original_url) → первые 7 символов в base62\n\nПроблема: разные URL могут дать одинаковые первые 7 символов (коллизия хеша)\nРешение при коллизии: добавить суффикс и попробовать снова\n\nПрактика: не рекомендуется как основной метод из-за коллизий.' },
        { type: 'tip', value: 'На интервью рекомендуйте Range-based Counter. Объясните: Snowflake ID (Twitter) использует похожий подход — distributed unique ID generation без центральной точки.' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: High-Level архитектура',
      type: 'practice',
      requirements: [
        'Нарисовать write path (создание ссылки)',
        'Нарисовать read path (redirect)',
        'Добавить трёхуровневый кеш (CDN, Redis, DB)',
        'Указать настройку Redis (политика вытеснения, TTL, размер)',
        'Показать распределение нагрузки по уровням кеша'
      ],
      hint: 'Разделяй read path и write path — они сильно отличаются по нагрузке (120K vs 1.2K RPS). Read path должен иметь несколько уровней кеша. Подумай какую политику вытеснения выбрать для Redis, учитывая что популярные ссылки получают трафик дольше.',
      expectedOutput: 'Write path: Client → API Gateway → URL Service → ID Generator → Cassandra. Read path: Client → CDN/In-memory (80%) → Redis LFU (18%) → Cassandra (2%). Redis: LFU, TTL 24ч, 10 ГБ. Объяснено: LFU лучше LRU для URL shortener — популярные ссылки остаются дольше.',
      solution: 'Компоненты URL Shortener:\n\nWrite Path (создание, 1,200 RPS):\n[Client] → POST /api/v1/urls → [API Gateway (rate limit)] → [URL Service] → [ID Generator (range counter)] → [Cassandra/DynamoDB]\n\nRead Path (redirect, 120,000 RPS):\n[Client] → GET /{code} → [CDN/Redirect Service (L1 кеш)] → [Redis Cache L2 (TTL 24ч)] → [Cassandra] → HTTP 302\n\nРаспределение нагрузки:\n- CDN/in-memory: 80% запросов (96K RPS) — популярные ссылки\n- Redis: 18% запросов (21.6K RPS)\n- Cassandra: 2% запросов (2.4K RPS) — только промахи\n\nRedis настройка:\n- Политика: LFU (самые редкие удаляются)\n- Размер: ~10 ГБ (топ-5M ссылок × 2 КБ)\n- TTL: 24 часа',
      explanation: 'Трёхуровневый кеш снижает нагрузку на Cassandra с 120K до 2.4K RPS — в 50 раз. Ключевое решение: redirect path полностью оптимизирован (98% из кеша), write path намного проще. LFU лучше LRU для URL shortener — популярные ссылки должны оставаться в кеше дольше.',
      content: [
        { type: 'text', value: 'Собираем все компоненты в единую архитектуру.' },
        { type: 'heading', value: 'Компоненты системы' },
        { type: 'text', value: 'Write Path (создание ссылок):\n[Client]\n  → POST /api/v1/urls\n  → [API Gateway] (rate limiting, auth)\n  → [URL Service] (генерация кода, валидация)\n  → [ID Generator Service] (атомарный счётчик)\n  → [Database] (Cassandra/DynamoDB)\n\nRead Path (redirect):\n[Client]\n  → GET /XkP2q7A\n  → [CDN / Redirect Service] (кеш L1)\n  → [Redis Cache] (кеш L2, TTL 24 часа)\n  → [Database] (только при промахе кеша)\n  → HTTP 302 redirect' },
        { type: 'heading', value: 'Caching стратегия' },
        { type: 'text', value: 'Распределение нагрузки:\n  120,000 read RPS всего\n  CDN/Redirect Service: ~80% (популярные ссылки) = 96,000 RPS\n  Redis: ~18% = 21,600 RPS\n  Database: ~2% (промахи кеша) = 2,400 RPS\n\nRedis настройка:\n  Политика вытеснения: LFU (Least Frequently Used)\n  Размер кеша: ~10 ГБ (хранит топ-5M ссылок × 2КБ)\n  TTL: 24 часа (большинство ссылок получают трафик в первые дни)' },
        { type: 'note', value: 'URL Shortener — классическая задача для демонстрации понимания кеширования, выбора БД и масштабирования. Ключевые моменты: read-heavy → кеш, Key-Value паттерн → NoSQL, уникальная генерация ID → distributed counter.' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Deep Dives и Edge Cases',
      type: 'practice',
      requirements: [
        'Описать стратегию очистки устаревших ссылок',
        'Предложить защиту от злоупотреблений',
        'Спроектировать систему аналитики кликов',
        'Объяснить HyperLogLog для уникальных посетителей',
        'Сформулировать итоговый вывод по архитектуре'
      ],
      hint: 'Для очистки: Lazy Deletion при каждом redirect + Batch Cleanup ночью. Для аналитики: синхронный счётчик (Redis INCR) и асинхронная детальная аналитика (Kafka → Analytics Service). HyperLogLog — когда использовать и почему он лучше точного подсчёта?',
      expectedOutput: 'Lazy Deletion + Batch Cleanup описаны с разделением ответственностей. Rate limiting: 100 ссылок/день на IP. Аналитика: Redis INCR для счётчика + Kafka для детальной. HyperLogLog объяснён: ±1%, 12 КБ памяти. Итоговый вывод: NoSQL + Redis кеш (98% нагрузки) + Distributed ID generator + CDN.',
      solution: 'Очистка истёкших ссылок:\n- Lazy Deletion: при redirect проверить expires_at → если истекло → 410 Gone\n- Batch Cleanup (ночью): DELETE WHERE expires_at < NOW() LIMIT 10,000 батчами\n\nЗащита от злоупотреблений:\n- Rate limiting: 100 ссылок/день с одного IP\n- URL валидация: проверить реальность URL, исключить localhost/private\n- Google Safe Browsing API: проверить на malware/фишинг\n\nАналитика кликов:\n- Простой счётчик: Redis INCR "hits:{code}" → периодический flush в БД\n- Детальная аналитика (асинхронно): при redirect → Kafka event → Analytics Service\n  - Уникальные посетители: HyperLogLog (±1%, 12 КБ на любой объём)\n  - Гео-распределение: IP → GeoIP →City\n  - Referrer, время переходов\n\nИтог системы: NoSQL (key-value) + Redis кеш (снимает 98% нагрузки) + distributed ID generator + CDN для redirect.',
      explanation: 'Lazy Deletion + Batch Cleanup разделяют корректность (пользователь не видит устаревшие ссылки) и производительность (нет дорогого сканирования при каждом запросе). HyperLogLog — образцовый пример trade-off: точность ±1% за константную память 12 КБ вместо O(N) для точного подсчёта.',
      content: [
        { type: 'text', value: 'Рассмотрим важные детали и граничные случаи.' },
        { type: 'heading', value: 'Очистка истёкших ссылок' },
        { type: 'text', value: 'Проблема: за 5 лет накапливаются миллиарды просроченных записей.\n\nРешение: Lazy Deletion + Batch Cleanup\n\nLazy Deletion:\n  При redirect проверяем expires_at\n  Если истекло → 410 Gone (не 302)\n  Запись остаётся в БД, но не используется\n\nBatch Cleanup (раз в ночь):\n  Фоновый job сканирует истёкшие записи и удаляет\n  DELETE FROM urls WHERE expires_at < NOW() LIMIT 10000\n  Делаем батчами, чтобы не нагружать БД' },
        { type: 'heading', value: 'Защита от злоупотреблений' },
        { type: 'list', value: [
          'Rate limiting: максимум 100 ссылок в день с одного IP',
          'URL валидация: проверка что URL реальный, не localhost, не заблокированный',
          'Malware scanning: проверить URL в базах фишинга/malware (Google Safe Browsing API)',
          'Spam detection: ML модель или эвристики'
        ]},
        { type: 'heading', value: 'Аналитика кликов' },
        { type: 'text', value: 'Простой счётчик:\n  INCR hit_count в Redis (очень быстро)\n  Периодически flush в основную БД\n\nДетальная аналитика (асинхронно):\n  При redirect → publish event в Kafka\n  Analytics Service читает и агрегирует:\n    - Уникальные посетители (HyperLogLog в Redis)\n    - Гео-распределение (IP → City)\n    - Время переходов\n    - Referrer (откуда пришли)' },
        { type: 'tip', value: 'Итоговый recap для интервью: URL Shortener = NoSQL БД (key-value) + Redis кеш (снимает 98% нагрузки) + distributed ID generator + CDN для redirect. Простая в описании, богатая в деталях система.' }
      ]
    }
  ]
}
