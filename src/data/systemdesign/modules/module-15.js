export default {
  id: 15,
  title: 'Проектируем: URL Shortener',
  description: 'Полное проектирование URL-сокращателя (bit.ly): требования, оценка нагрузки, API, модель данных, алгоритм генерации, масштабирование.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования',
      type: 'practice',
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
