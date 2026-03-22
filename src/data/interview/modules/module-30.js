export default {
  id: 30,
  title: 'SD Interview: выбор БД и хранилище',
  description: 'Как выбрать базу данных для системы: SQL vs NoSQL, матрица решений, CAP-теорема, Redis/Cassandra/MongoDB/PostgreSQL когда и зачем, партиционирование, репликация и модели согласованности.',
  lessons: [
    {
      id: 1,
      title: 'SQL vs NoSQL: матрица решений',
      type: 'theory',
      description: 'Критерии выбора между SQL и NoSQL на SD-интервью: ACID vs масштаб, схема vs гибкость. SQL достаточен для 99% приложений до десятков миллионов пользователей.',
      solution: 'Выбирай SQL (PostgreSQL/MySQL) если:\n- Нужны JOIN, ACID-транзакции (финансы, заказы)\n- Стабильная структурированная схема\n- Объём < 1 TB на одном узле\n\nВыбирай NoSQL если:\n- Write throughput 100K+ write/сек\n- Гибкая схема (документы с переменной структурой)\n- Горизонтальное масштабирование критично\n- Простые key-value или document операции без JOIN\n\nМатрица:\nMongoDB: документы, гибкая схема, средний масштаб\nCassandra: write-heavy, временные ряды, большой масштаб\nRedis: кеш, сессии, rate limiting\nDynamoDB: managed key-value, serverless\n\nПравило: не выбирай NoSQL "потому что масштабируемо".',
      content: [
        { type: 'text', value: 'Выбор между SQL и NoSQL — один из ключевых вопросов в SD-интервью. Нет универсального ответа: нужно знать trade-offs и уметь обосновать выбор.' },
        { type: 'heading', value: 'Когда выбирать SQL (PostgreSQL, MySQL)' },
        { type: 'text', value: 'Выбирай SQL если:\n- Нужны сложные JOIN-запросы\n- Требуется ACID-транзакционность (финансы, заказы)\n- Данные хорошо структурированы и схема стабильна\n- Нужны сложные аналитические запросы\n- Относительно небольшие объёмы (< 1 TB на одном узле)\n\nПримеры: банковские операции, e-commerce заказы, пользователи и роли' },
        { type: 'heading', value: 'Когда выбирать NoSQL' },
        { type: 'text', value: 'Выбирай NoSQL если:\n- Очень высокий write throughput (100K+ write/сек)\n- Горизонтальное масштабирование критично\n- Гибкая схема (JSON-документы с переменной структурой)\n- Простые key-value или document операции без JOIN\n- Географическое распределение данных\n\nMongoDB: документы, гибкая схема\nCassandra: высокий write throughput, временные ряды\nRedis: кеш, сессии, очереди, rate limiting\nDynamoDB: serverless, key-value, managed' },
        { type: 'tip', value: 'Ловушка на интервью: кандидаты часто выбирают NoSQL "потому что масштабируемо". Правильный ответ: "SQL достаточно для 99% приложений до десятков миллионов пользователей. NoSQL при доказанной необходимости."' }
      ]
    },
    {
      id: 2,
      title: 'CAP-теорема и её применение',
      type: 'theory',
      description: 'CAP-теорема: распределённая система гарантирует только 2 из 3 свойств (Consistency, Availability, Partition Tolerance). Практический выбор CP vs AP.',
      solution: 'CAP: в распределённой системе P (partition) неизбежен.\nПоэтому реальный выбор: CP или AP.\n\nCP (Consistency + Partition):\n- PostgreSQL с синхронной репликацией, HBase, Zookeeper\n- При сбое: откажи запросу, но не верни устаревшие данные\n- Использовать: банки, медицина, inventory\n\nAP (Availability + Partition):\n- Cassandra, DynamoDB, CouchDB\n- Eventual Consistency: данные рано или поздно синхронизируются\n- При сбое: вернуть устаревшие данные, но остаться доступным\n- Использовать: соцсети, e-commerce (кроме оплаты), IoT\n\nПример: лайки в Instagram — AP (eventual consistency нормально)\nПример: снятие денег — CP (нельзя допустить расхождение)',
      content: [
        { type: 'text', value: 'CAP-теорема (Brewer, 2000): распределённая система может обеспечить только 2 из 3 гарантий: Consistency, Availability, Partition Tolerance.' },
        { type: 'heading', value: 'Компоненты CAP' },
        { type: 'text', value: 'Consistency (согласованность): все узлы видят одни и те же данные в одно время. Читая данные, ты всегда получаешь самую свежую запись.\n\nAvailability (доступность): каждый запрос получает ответ (не обязательно самый свежий).\n\nPartition Tolerance (устойчивость к разделению): система работает даже если часть узлов недоступна (сетевой сбой).\n\nВ реальных распределённых системах P (partition) всегда нужен — сетевые сбои неизбежны. Значит выбор: CP vs AP.' },
        { type: 'heading', value: 'CP vs AP системы' },
        { type: 'text', value: 'CP (Consistency + Partition Tolerance):\n- PostgreSQL с синхронной репликацией\n- HBase, Zookeeper\n- Когда использовать: банки, финансы, медицина\n- При сбое: откажи запросу, не верни устаревшие данные\n\nAP (Availability + Partition Tolerance):\n- Cassandra, DynamoDB, CouchDB\n- Eventual Consistency: данные рано или поздно синхронизируются\n- Когда использовать: социальные сети, e-commerce, IoT\n- При сбое: верни устаревшие данные, но оставайся доступным' },
        { type: 'tip', value: 'CAP упрощён. Реальная жизнь — это PACELC: если нет Partition, выбирай Latency vs Consistency. Кассандра: AP + E→L (доступность, малая задержка). PostgreSQL: CP + E→C (согласованность).' }
      ]
    },
    {
      id: 3,
      title: 'Redis: когда и как использовать',
      type: 'theory',
      description: 'Паттерны использования Redis: Cache-Aside, сессии, rate limiting, leaderboard на Sorted Set, distributed lock. Ограничения: всё в RAM, нет JOIN.',
      solution: 'Паттерны:\n\n1. Cache-Aside:\nSET "user:123" {data} EX 3600\nGET → hit? вернуть : DB → SET → вернуть\n\n2. Rate Limiting (sliding window):\nINCR "ratelimit:{user}:{minute}" → EXPIRE 60\nIf count > limit → HTTP 429\n\n3. Leaderboard (Sorted Set):\nZADD "scores" 1500 "user:123"\nZRANGE "scores" 0 9 WITHSCORES → топ-10\n\n4. Distributed Lock:\nSET "lock:{res}" uuid NX EX 30\nRelease: DEL если uuid совпадает\n\n5. Pub/Sub для уведомлений:\nPUBLISH "notifications:{user}" {message}\nSUBSCRIBE "notifications:{user}"\n\nОграничения: всё в RAM (дорого), без PRIMARY данных, при restart без AOF — потеря данных.',
      content: [
        { type: 'text', value: 'Redis — in-memory хранилище данных. Используется как кеш, очередь задач, хранилище сессий, rate limiter и многое другое.' },
        { type: 'heading', value: 'Паттерны использования Redis' },
        { type: 'text', value: 'Кеширование (Cache-Aside):\nSET "user:123" {name, email} EX 3600\nGET "user:123" → hit → вернуть\n              → miss → DB → SET → вернуть\n\nСессии:\nSET "session:{token}" {user_id, expires} EX 86400\nHTTP запрос → проверить сессию в Redis → быстро\n\nRate Limiting (скользящее окно):\nINCR "ratelimit:{user_id}:{minute}"\nEXPIRE ... 60\nIf count > limit → отклонить\n\nLeaderboard (Sorted Set):\nZADD "scores" 1500 "user:123"\nZRANGE "scores" 0 9 WITHSCORES → топ-10\n\nDistributed Lock:\nSET "lock:{resource}" uuid NX EX 30\nRelease: DEL "lock:{resource}" (если uuid совпадает)' },
        { type: 'heading', value: 'Ограничения Redis' },
        { type: 'text', value: 'Ограничения:\n- Всё хранится в RAM: дорого для больших объёмов\n- Не для первичного хранения критичных данных\n- Restart = потеря данных (если без persistence)\n\nPersistence опции:\n- RDB (снимки): полный дамп каждые N минут\n- AOF (append-only file): лог каждой операции\n- Hybrid: RDB + AOF' },
        { type: 'tip', value: 'Redis Cluster: горизонтальное масштабирование через sharding. 16384 hash slots распределяются по узлам. Ключи с одинаковым hash tag {} попадают в один слот — важно для multi-key операций.' }
      ]
    },
    {
      id: 4,
      title: 'Cassandra: write-heavy и временные ряды',
      type: 'theory',
      description: 'Cassandra оптимизирована для write-heavy нагрузки и временных рядов. Модель: Partition Key определяет узел, Clustering Key задаёт сортировку внутри партиции.',
      solution: 'Когда использовать Cassandra:\n- Write throughput 100K+ write/сек\n- Временные ряды (IoT, метрики, логи событий)\n- Append-only данные (история действий)\n- Multi-datacenter, географическое распределение\n\nМодель данных (чат):\nCREATE TABLE messages (\n  chat_id UUID,         -- Partition Key\n  created_at TIMESTAMP, -- Clustering Key DESC\n  message_id UUID,\n  content TEXT,\n  PRIMARY KEY (chat_id, created_at)\n) WITH CLUSTERING ORDER BY (created_at DESC);\n\nЗапрос: SELECT * FROM messages WHERE chat_id=? LIMIT 20;\n→ один узел, отсортировано, быстро\n\nПравило: сначала запросы, потом схема.\nДублирование данных — норма.\nNO JOINS, NO COMPLEX WHERE.',
      content: [
        { type: 'text', value: 'Apache Cassandra — распределённая NoSQL БД, оптимизированная для высокого write throughput и горизонтального масштабирования.' },
        { type: 'heading', value: 'Когда использовать Cassandra' },
        { type: 'text', value: 'Идеальные сценарии:\n- Временные ряды (IoT, метрики, логи событий)\n- Историческая лента активности (что делал пользователь)\n- Write throughput 100K+ write/сек\n- Данные никогда не обновляются (append-only)\n- Географическое распределение (multi-datacenter)\n\nНе подходит:\n- Сложные JOIN запросы\n- ACID транзакции\n- Произвольные UPDATE с условиями' },
        { type: 'heading', value: 'Модель данных Cassandra' },
        { type: 'text', value: 'Partition Key (PK): определяет на каком узле хранятся данные\nClustering Key (CK): порядок сортировки внутри партиции\n\nПример: история сообщений в чате\nCREATE TABLE messages (\n  chat_id UUID,       -- Partition Key\n  created_at TIMESTAMP, -- Clustering Key (DESC)\n  message_id UUID,\n  user_id UUID,\n  content TEXT,\n  PRIMARY KEY (chat_id, created_at)\n) WITH CLUSTERING ORDER BY (created_at DESC);\n\nЗапрос: SELECT * FROM messages WHERE chat_id=? LIMIT 20;\nЭффективно: один узел, отсортировано по времени.' },
        { type: 'tip', value: 'Главное правило Cassandra: сначала модель запросов, потом модель данных. Противоположно SQL. Каждая таблица оптимизирована под конкретный запрос. Дублирование данных — норма.' }
      ]
    },
    {
      id: 5,
      title: 'Партиционирование (Sharding)',
      type: 'theory',
      description: 'Шардирование БД: стратегии (range, hash, geographic, consistent hashing) и проблемы (cross-shard JOIN, hot spots, resharding). Последнее средство масштабирования.',
      solution: 'Стратегии:\n1. Range sharding: A-М → шард 1, Н-Я → шард 2\n   Минус: hot spots\n2. Hash sharding: shard = hash(user_id) % N\n   Плюс: равномерно. Минус: range запросы медленные\n3. Geographic: EU → EU шард, US → US шард\n4. Consistent Hashing: виртуальное кольцо, минимальное перераспределение при добавлении узла\n\nПроблемы шардирования:\n- Cross-shard JOIN: решение — денормализация, application-layer JOIN\n- Hot spots: добавить replica для горячего шарда\n- Resharding: consistent hashing снижает перераспределение\n\nПорядок масштабирования:\n1. Вертикальное масштабирование\n2. Индексы и оптимизация запросов\n3. Read replicas\n4. Redis кеш\n5. Шардирование — только в крайнем случае',
      content: [
        { type: 'text', value: 'Шардирование — разбиение данных между несколькими узлами БД. Нужно когда объём данных или write QPS превышает возможности одного сервера.' },
        { type: 'heading', value: 'Стратегии шардирования' },
        { type: 'text', value: 'Horizontal Range Sharding:\nПользователи A-М → Шард 1\nПользователи Н-Я → Шард 2\nМинус: hot spots (имена на "А" популярнее)\n\nHash Sharding:\nshard_id = hash(user_id) % num_shards\nПлюс: равномерное распределение\nМинус: range запросы неэффективны\n\nGeographic Sharding:\nЕвропа → EU сервер\nАмерика → US сервер\nПлюс: latency, compliance (GDPR)\n\nConsistent Hashing:\nВиртуальное кольцо узлов\nДобавление узла перераспределяет только ~1/N данных\nИспользуют: DynamoDB, Cassandra, Redis Cluster' },
        { type: 'heading', value: 'Проблемы шардирования' },
        { type: 'text', value: 'Cross-shard JOINs: данные разных шардов не можем JOIN-ить в БД\nРешение: денормализация или JOIN в application layer\n\nResharding: при изменении числа шардов — переераспределение данных\nРешение: consistent hashing, double-shard period\n\nHot spots: один шард перегружен (знаменитость с 10M подписок)\nРешение: добавить replica для горячего шарда, prefix sharding' },
        { type: 'tip', value: 'На интервью: шардирование — это последнее средство. Сначала: вертикальное масштабирование, индексы, read replicas, кеш. Шардирование добавляет огромную сложность.' }
      ]
    },
    {
      id: 6,
      title: 'Репликация и модели согласованности',
      type: 'theory',
      description: 'Master-Slave репликация для high availability и read scaling. Модели согласованности: Strong, Eventual, Read-Your-Writes, Monotonic Reads — когда что применять.',
      solution: 'Master-Slave репликация:\n- Master: все writes\n- Slaves (read replicas): только reads\n\nSync vs Async:\nСинхронная: write подтверждается когда все slaves сохранили\n  → нет потери данных, высокая latency\nАсинхронная: write подтверждается сразу\n  → низкая latency, возможна потеря последних данных\n\nМодели согласованности:\nStrong: всегда читаешь самые свежие данные\n  → финансы, медицина, inventory\nEventual: данные синхронизируются в конечном счёте\n  → соцсети, аналитика, настройки\nRead-Your-Writes: после своей записи всегда её видишь\n  → решение: читать с primary после своей записи\nMonotonic Reads: никогда не видишь более старые данные\n  → решение: sticky sessions (один пользователь → один slave)',
      content: [
        { type: 'text', value: 'Репликация — копирование данных на несколько узлов для высокой доступности и распределения read нагрузки.' },
        { type: 'heading', value: 'Master-Slave репликация' },
        { type: 'text', value: 'Один Master (primary): все writes\nМного Slave (replicas): только reads\n\nПлюсы: высокая read пропускная способность, failover\nМинусы: replication lag (задержка синхронизации)\n\nSync vs Async репликация:\nСинхронная: write подтверждается только когда все slaves сохранили\n  Плюс: нет потери данных\n  Минус: высокая latency\n\nАсинхронная: write подтверждается сразу\n  Плюс: низкая latency\n  Минус: возможна потеря последних данных при сбое' },
        { type: 'heading', value: 'Модели согласованности' },
        { type: 'text', value: 'Strong Consistency: читаешь всегда самые свежие данные\n  Использовать для: финансы, медицина, inventory\n\nEventual Consistency: данные в конечном счёте согласованы\n  Использовать для: социальные сети, аналитика, preferences\n\nRead-Your-Writes: после своей записи всегда видишь её\n  Решение для сессий: всегда читать с primary после write\n\nMonotonic Reads: не видишь более старые данные при повторных запросах\n  Решение: sticky sessions (один пользователь всегда к одному slave)' },
        { type: 'tip', value: 'Instagram использует eventual consistency для лайков и комментариев. Ты можешь не увидеть свой лайк секунду после нажатия. Это нормально для социальных функций, но недопустимо для денежных операций.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: выбор БД для сценариев',
      type: 'practice',
      description: 'Выбор подходящей БД для 5 сценариев: банковские транзакции, лента активности, профили пользователей, поиск постов и кеш сессий.',
      requirements: [
        'Для каждого из 5 сценариев выбрать подходящую БД и объяснить почему',
        'Сценарий 1: банковские транзакции между счетами (ACID, consistency)',
        'Сценарий 2: лента активности пользователя (100M событий/день, read по user_id+time)',
        'Сценарий 3: профили пользователей и настройки (1B пользователей, key-value lookup)',
        'Сценарий 4: поиск постов по ключевым словам',
        'Сценарий 5: кеш сессий (expire через 24 часа, 10M активных сессий)'
      ],
      hint: 'Финансы → SQL (ACID). Временные ряды с высоким write → Cassandra. Key-value при огромном масштабе → DynamoDB или Redis. Полнотекстовый поиск → Elasticsearch. Кеш с TTL → Redis.',
      solution: 'Сценарий 1: Банковские транзакции\nВыбор: PostgreSQL\nПочему:\n- ACID транзакции обязательны (нельзя снять деньги с двух счетов одновременно)\n- Сложные JOIN запросы (счёт, клиент, история)\n- Strong Consistency (не может быть eventual для денег)\n- Объём данных управляем (не петабайты)\n\nСценарий 2: Лента активности пользователя\nВыбор: Apache Cassandra\nПочему:\n- 100M событий/день = ~1160 write/сек, будет расти\n- Partition Key = user_id, Clustering Key = created_at DESC\n- Запрос всегда: WHERE user_id=? ORDER BY created_at DESC LIMIT N\n- Append-only паттерн идеален для Cassandra\n- Eventual consistency приемлема для ленты активности\n\nСценарий 3: Профили пользователей (1B)\nВыбор: DynamoDB или Cassandra\nПочему:\n- 1B пользователей → шардирование обязательно\n- Запросы простые: GET profile BY user_id\n- Нет сложных JOIN\n- DynamoDB: managed, auto-scaling, дорого\n- Cassandra: self-managed, дешевле при большом масштабе\n\nСценарий 4: Поиск по ключевым словам\nВыбор: Elasticsearch\nПочему:\n- Полнотекстовый поиск — не сила SQL/NoSQL\n- Elasticsearch: TF-IDF, BM25 ранжирование, анализаторы текста\n- Inverted index для быстрого поиска\n- Дополнительно: основные данные в PostgreSQL/Cassandra, ES — для поиска\n\nСценарий 5: Кеш сессий\nВыбор: Redis\nПочему:\n- TTL 24 часа — встроенная функция Redis (EXPIRE)\n- 10M сессий × ~200 байт = 2 GB — легко в RAM\n- Чтение/запись O(1) за микросекунды\n- При рестарте можно потерять сессии (пользователи просто залогинятся снова)',
      explanation: 'Ключевые принципы выбора БД: 1) ACID нужен → SQL. 2) Высокий write throughput + временные ряды → Cassandra. 3) Key-value при огромном масштабе → DynamoDB/Redis. 4) Полнотекстовый поиск → Elasticsearch. 5) Кеш/сессии/очереди → Redis. Часто в реальных системах несколько БД используются вместе: PostgreSQL для основных данных + Redis для кеша + Elasticsearch для поиска.'
    }
  ]
}
