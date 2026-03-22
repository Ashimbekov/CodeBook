export default {
  id: 20,
  title: 'Проектируем: Uber',
  description: 'Полное проектирование Uber: геолокация водителей, матчинг, маршруты, surge pricing. Real-time location tracking и ride matching.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и особенности',
      type: 'practice',
      requirements: [
        'Определить функциональные требования (геолокация, матчинг, поездка)',
        'Указать нефункциональные требования (latency, consistency)',
        'Рассчитать write RPS для location updates',
        'Объяснить проблему double matching',
        'Описать чем Uber отличается от других систем'
      ],
      hint: 'Uber уникален жёсткими требованиями к real-time: 5M водителей × 1 update/4 сек = 1.25M location updates/сек. Matching < 1 сек исключает наивный full-scan 5M водителей. Consistency: один водитель = одна поездка — нужен distributed lock. Геолокация — ключевой компонент.',
      expectedOutput: 'Location updates: 1.25M/сек, 80 МБ/сек. Matching latency: < 1 сек. Consistency: no double matching. Вывод: Kafka для буферизации location stream, Redis GEO для поиска ближайших, distributed lock для матчинга. Это принципиально отличается от CRUD-систем.',
      solution: 'Функциональные требования:\n- Водители обновляют геолокацию каждые 4 секунды\n- Пассажир вызывает такси → найти ближайшего водителя\n- Матчинг пассажира и водителя\n- Отображение водителя на карте в реальном времени\n- Расчёт маршрута и ETA\n- Surge pricing (динамические цены)\n- Завершение поездки и оплата\n\nНефункциональные:\n- 5M активных водителей, 10M поездок/день\n- Location updates: каждые 4 сек от каждого водителя\n- Matching latency: найти водителя < 1 сек\n- Consistency: один водитель = одна поездка (no double matching)\n\nОценка нагрузки:\n5M × 1 update/4 сек = 1.25M location updates/сек\n1.25M × 64 байт = 80 МБ/сек входящих данных',
      explanation: '1.25M location updates/сек — исключительно высокий write throughput, требующий Kafka для буферизации. Matching latency < 1 сек при 5M водителях исключает наивный full-scan — нужен гео-индекс. Consistency при матчинге — distributed lock, иначе два пассажира могут "забрать" одного водителя одновременно.',
      content: [
        { type: 'text', value: 'Uber — уникальная система с жёсткими требованиями к реальному времени.' },
        { type: 'heading', value: 'Функциональные требования' },
        { type: 'list', value: [
          'Водители регистрируют своё местоположение каждые 4 секунды',
          'Пассажир вызывает такси → система находит ближайшего водителя',
          'Матчинг пассажира и водителя',
          'Просмотр водителя на карте в реальном времени',
          'Расчёт маршрута и примерного времени',
          'Surge pricing (динамическое ценообразование)',
          'Завершение поездки и оплата'
        ]},
        { type: 'heading', value: 'Нефункциональные требования' },
        { type: 'list', value: [
          '5M активных водителей, 10M поездок в день',
          'Обновление локации: каждые 4 сек от каждого водителя',
          'Matching latency: найти водителя < 1 сек',
          'High availability: водитель не может ждать',
          'Consistency: один водитель = одна поездка (нет двойного матчинга)'
        ]},
        { type: 'heading', value: 'Оценка нагрузки (Location Updates)' },
        { type: 'text', value: '5M водителей × 1 обновление/4 сек = 1.25M location updates/сек!\n\nЭто очень высокий write throughput.\nКаждое обновление: {driver_id, lat, lon, timestamp, status} ≈ 64 байт\n1.25M × 64 байт = 80 МБ/сек входящих данных' }
      ]
    },
    {
      id: 2,
      title: 'Шаг 2: Геолокация — работа с координатами',
      type: 'practice',
      requirements: [
        'Объяснить проблему наивного поиска по 5M водителям',
        'Описать принцип Geohash',
        'Объяснить точность Geohash по длине строки',
        'Описать Redis GEO API (GEOADD, GEOSEARCH)',
        'Объяснить шардирование по городам'
      ],
      hint: 'Naïve: 5M × вычислить расстояние = медленно при каждом запросе. Geohash делит Землю на ячейки. Redis GEO: GEOADD добавляет точку, GEOSEARCH находит ближайшие в радиусе. Шардирование по городам: Нью-Йорк и Лондон не пересекаются — каждый город независимый Redis ключ.',
      expectedOutput: 'Naïve подход отвергнут. Geohash: 5-символьный = ~5 км². Соседи для поиска в радиусе. Redis GEO: GEOADD "drivers:available:{city}" lon lat driver_id. GEOSEARCH BYRADIUS 2 KM ASC COUNT 10 — O(N+log M). Шардирование по городам: горизонтальное масштабирование без cross-shard запросов.',
      solution: 'Проблема: 5M водителей × вычисление расстояния = медленно для наивного поиска.\n\nGeohash — иерархическое разбиение земли на ячейки:\n- 5 символов: ~5 км² (подходит для поиска такси)\n- Соседние ячейки имеют похожие префиксы\n- Поиск в радиусе: ячейка + 8 соседних ячеек\n\nRedis GEO (встроенная поддержка):\nДобавить водителя: GEOADD "drivers:available:{city}" lon lat driver_id\nПоиск ближайших в 2 км:\nGEOSEARCH "drivers:available:{city}" FROMMEMBER passenger BYRADIUS 2 KM ASC COUNT 10\n→ топ-10 ближайших, O(N+log M), быстро\n\nОбновление позиции:\nGEOADD "drivers:available:{city}" new_lon new_lat driver_id\n(перезаписывает старую позицию)',
      explanation: 'Redis GEO использует Sorted Set внутри с геохешами в качестве score — это позволяет range запросы по географии. GEOSEARCH возвращает отсортированный список за O(N+log M) вместо O(N) для brute force. Sharding по городу критичен: Нью-Йорк и Лондон полностью независимы — горизонтальное масштабирование без cross-shard запросов.',
      content: [
        { type: 'text', value: 'Ключевая задача: эффективно хранить и запрашивать геоданные.' },
        { type: 'heading', value: 'Проблема поиска ближайших' },
        { type: 'text', value: 'Наивный подход: для каждого запроса пассажира пройти всех 5M водителей и вычислить расстояние.\n  5M × вычисление расстояния = медленно!' },
        { type: 'heading', value: 'Geohash: сетка на карте' },
        { type: 'text', value: 'Geohash делит Землю на прямоугольные ячейки с помощью иерархического хеша.\n\nПринцип:\n  Широта/долгота → строка: "u4pruydqqvj"\n  Более длинный хеш = меньше ячейка, точнее позиция\n\nТочность по длине:\n  4 символа: 39.1 × 19.5 км\n  5 символов: 4.9 × 4.9 км\n  6 символов: 1.2 × 0.61 км\n  7 символов: 152 × 152 м\n\nСоседи: можно найти все ячейки в радиусе 2 км, зная их хеши.\n  Ячейка "u4pru" → 8 соседних ячеек: "u4prv", "u4prg", ...\n\nПоиск водителей в радиусе 2 км:\n  geohash = geohash(passenger_lat, lon, precision=6)\n  neighbors = geohash.neighbors(geohash, radius=2)\n  drivers = redis.smembers("geo:{geohash}") ∪ redis.smembers("geo:{neighbor}")' },
        { type: 'heading', value: 'Redis GEO (встроенная поддержка)' },
        { type: 'text', value: 'Redis имеет встроенные геоиндексы!\n\nДобавить водителя:\n  GEOADD "drivers:available" lon lat driver_id\n\nНайти ближайших в радиусе 2 км:\n  GEOSEARCH "drivers:available"\n    FROMMEMBER passenger_location\n    BYRADIUS 2 KM ASC COUNT 10\n  → Возвращает 10 ближайших водителей, отсортированных по расстоянию\n\nЭто O(N+log M) — очень быстро!' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 3: Location Service — 1.25M updates/sec',
      type: 'practice',
      requirements: [
        'Описать архитектуру Location Service через Kafka',
        'Объяснить роль Location Gateway',
        'Описать что делает Location Processor',
        'Объяснить TTL для определения оффлайн-водителя',
        'Описать как статус водителя влияет на GEO index'
      ],
      hint: 'Kafka — буфер между 1.25M/сек входящих и обработчиками. Без Kafka Location Gateway напрямую давил бы на Redis. Partition key = driver_id: один водитель → одна партиция → порядок обновлений. TTL 30 сек без обновления = водитель оффлайн. GEO index только для AVAILABLE водителей.',
      expectedOutput: 'Driver App → WebSocket → Location Gateway → Kafka "driver_locations" → Location Processor. Processor: GEOADD Redis + SET "driver:{id}:location" EX 30 + Cassandra история + pub/sub пассажирам. TTL 30 сек. При принятии поездки: ZREM из "drivers:available". При завершении: ZADD обратно.',
      solution: 'Архитектура Location Service:\n[Driver App] → WebSocket → [Location Gateway] → [Kafka] → [Location Processor]\n\nLocation Gateway:\n- Принимает WebSocket соединения от водителей\n- Буферизирует batch обновлений\n- Отправляет в Kafka topic "driver_locations"\n\nKafka (100 партиций, ключ = driver_id):\n- Один водитель всегда в одной партиции → упорядоченность\n- 1.25M updates/сек легко переваривает Kafka\n\nLocation Processor (Kafka consumers):\n1. GEOADD обновить в Redis Geo index\n2. SET "driver:{id}:location" {lat, lon, status} EX 30\n3. INSERT в Cassandra (история перемещений)\n4. Publish в pub/sub для пассажиров (отображение на карте)\n\nTTL 30 сек: если нет обновления → водитель оффлайн',
      explanation: 'Kafka — буфер между 1.25M/сек входящих и обработчиками. Без Kafka Location Gateway напрямую давил бы на Redis, что недопустимо. Partition key = driver_id обеспечивает порядок обновлений одного водителя. Cassandra для истории перемещений — append-only паттерн с высоким write throughput идеален.',
      content: [
        { type: 'text', value: 'Как обрабатывать поток обновлений локаций от 5M водителей.' },
        { type: 'heading', value: 'Архитектура Location Service' },
        { type: 'text', value: '[Driver App] → WebSocket → [Location Gateway] → [Kafka] → [Location Processor]\n\nLocation Gateway:\n  Принимает WebSocket соединения от водителей\n  Буферизирует updates\n  Отправляет в Kafka (topic: "driver_locations")\n\nKafka Topic "driver_locations":\n  Партиций: 100 (параллельная обработка)\n  Ключ партиции: driver_id (одного водителя всегда один consumer)\n\nLocation Processor (Kafka consumer):\n  Читает batch обновлений\n  Обновляет Redis: GEOADD + SET "driver:{id}:location"\n  Сохраняет в Cassandra (история перемещений)\n  Публикует в pub/sub для passenger apps (отображение на карте)' },
        { type: 'heading', value: 'Redis для текущих позиций' },
        { type: 'text', value: 'Для каждого активного водителя:\n\n"driver:{id}:location" → {lat, lon, timestamp, status}\nTTL: 30 секунд (если нет обновления — водитель оффлайн)\n\nGEO index только для доступных водителей:\n"drivers:available:{city}" → GEOADD\n\nПри изменении статуса водителя:\n  Принял поездку → ZREM из "drivers:available"\n  Завершил → ZADD обратно в "drivers:available"' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 4: Matching Service — найти водителя',
      type: 'practice',
      requirements: [
        'Описать алгоритм поиска и ранжирования водителей',
        'Объяснить distributed lock через Redis NX',
        'Показать почему NX предотвращает double matching',
        'Описать Ride State Machine со всеми состояниями',
        'Объяснить обработку таймаута и отказа водителя'
      ],
      hint: 'Redis SET "lock:driver:{id}" NX EX 30: атомарная операция — если ключ уже существует, SET возвращает nil → водитель занят. Без этого два пассажира могут одновременно получить одного водителя. State Machine: явные переходы состояний облегчают отладку и мониторинг.',
      expectedOutput: 'Алгоритм: GEOSEARCH → фильтр → ранжирование → отправить запрос → таймаут 15 сек → следующий. Redis NX lock: атомарный check-and-set, предотвращает race condition. Ride State Machine: REQUESTED → MATCHING → ACCEPTED → EN_ROUTE → IN_PROGRESS → COMPLETED. Kafka events при переходах.',
      solution: 'Алгоритм матчинга:\n1. GEOSEARCH "drivers:available:{city}" BYRADIUS 2 KM ASC COUNT 10\n2. Фильтр: рейтинг >= 4.0, нужный класс автомобиля\n3. Ранжирование: расстояние + рейтинг + acceptance rate\n4. Отправить запрос водителю #1 (ближайшему)\n5. Таймаут 15 сек → следующий водитель\n6. Принял → поездка назначена\n\nПредотвращение двойного матчинга (Redis Distributed Lock):\nredis.SET "lock:driver:{id}" ride_id NX EX 30\n- NX (Only if Not Exists): атомарная операция\n- Если lock уже есть → водитель занят, try next\n- Водитель принял → lock остаётся\n- Водитель отказал → DEL lock\n\nRide State Machine:\nREQUESTED → MATCHING → ACCEPTED → DRIVER_EN_ROUTE → IN_PROGRESS → COMPLETED\nKafka events при каждом переходе → Payment, Notification, Analytics',
      explanation: 'Distributed Lock через Redis NX — атомарная операция без race condition. Без lock два пассажира могут одновременно "зарезервировать" одного водителя. State Machine для поездки — явное описание всех возможных состояний и переходов, упрощает debugging и мониторинг. Kafka events при переходах — event-driven архитектура для decoupling.',
      content: [
        { type: 'text', value: 'Алгоритм матчинга пассажира с водителем.' },
        { type: 'heading', value: 'Базовый алгоритм матчинга' },
        { type: 'text', value: 'Passenger запрашивает поездку:\n1. Получить geohash пассажира\n2. Найти N ближайших доступных водителей (Redis GEOSEARCH)\n3. Отфильтровать: рейтинг >= 4.0, нужный класс автомобиля\n4. Ранжировать: расстояние + рейтинг + acceptance rate\n5. Отправить запрос водителю #1 (ближайшему)\n6. Если отказ/таймаут (15 сек) → следующий водитель\n7. Водитель принял → поездка назначена!' },
        { type: 'heading', value: 'Предотвращение двойного матчинга' },
        { type: 'text', value: 'Проблема: два пассажира одновременно пытаются взять одного водителя.\n\nРешение: Distributed Lock (Redis)\n\nFunc tryMatchDriver(driver_id, ride_id):\n  lock = redis.SET "lock:driver:{driver_id}" ride_id NX EX 30\n  if lock == null: return false  // уже занят\n  // Отправить запрос водителю\n  // Ожидать ответа 15 секунд\n  if driver_accepted:\n    // Lock остаётся (водитель занят)\n    return success\n  else:\n    redis.DEL "lock:driver:{driver_id}"  // Освободить\n    return false\n\nNX (Only if Not Exists): атомарная операция в Redis' },
        { type: 'heading', value: 'Ride State Machine' },
        { type: 'text', value: 'Состояния поездки:\nREQUESTED → MATCHING → ACCEPTED → DRIVER_EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED\n                                                              ↓\n                                                          CANCELLED\n\nKafka events при каждом переходе:\n  ride.requested, ride.matched, ride.cancelled, ride.completed\n  → Payment Service, Analytics, Notification Service' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 5: Отображение водителя в реальном времени',
      type: 'practice',
      requirements: [
        'Описать push обновлений позиции водителя пассажиру',
        'Объяснить Redis Pub/Sub для трансляции позиции',
        'Описать когда создаётся и удаляется pub/sub канал',
        'Объяснить клиентскую интерполяцию для плавного движения',
        'Указать частоту обновлений и обоснование'
      ],
      hint: 'Redis Pub/Sub: channel "ride:{ride_id}:driver_location". Location Processor публикует только при активной поездке. Passenger WebSocket Server подписан на канал. Клиентская интерполяция: между дискретными обновлениями каждые 4 сек — плавное движение маркера без серверной нагрузки.',
      expectedOutput: 'Flow: Location Processor → проверить активную поездку → PUBLISH "ride:{ride_id}:driver_location" {lat, lon} → Passenger WebSocket Server → push пассажиру. Частота: каждые 4 сек. При COMPLETED: отписаться от канала. Интерполяция: клиент вычисляет промежуточные позиции.',
      solution: 'После матчинга пассажир видит водителя на карте в реальном времени.\n\nАрхитектура push обновлений:\n[Driver App] → Location Service → Redis Pub/Sub\n  → channel "ride:{ride_id}:driver_location"\n  → [Passenger WebSocket Server] (подписан на канал)\n  → [Passenger App] ← WebSocket push\n\nПоток:\n1. Location Processor получает новую позицию водителя\n2. Проверяет: есть ли активная поездка у водителя?\n3. Если да: PUBLISH "ride:{ride_id}:driver_location" {lat, lon}\n4. Passenger WebSocket Server → push обновление пассажиру\n\nЧастота: каждые 4 секунды (синхронно с GPS обновлениями)\nПо завершении поездки: отписаться от канала → канал автоматически исчезает\n\nКлиентская интерполяция:\nСервер присылает позицию раз в 4 сек → клиент интерполирует для плавного движения на карте',
      explanation: 'Redis Pub/Sub идеален для real-time трансляции: один publisher (Location Processor) → один subscriber (Passenger WebSocket Server). Только активные поездки создают pub/sub каналы — нет лишней нагрузки. Клиентская интерполяция решает UX проблему: водитель "плавно движется" между дискретными обновлениями без серверной нагрузки.',
      content: [
        { type: 'text', value: 'Пассажир видит водителя движущегося на карте.' },
        { type: 'heading', value: 'Push обновлений на карте' },
        { type: 'text', value: 'После матчинга пассажир хочет видеть водителя в реальном времени.\n\nArchitecture:\n[Driver App] → updates location → [Location Service] → [Redis Pub/Sub]\n                                                               ↓\n                                        publishes to channel "ride:{ride_id}:driver_location"\n                                                               ↓\n[Passenger WebSocket Server] ← subscribed ← receives update\n                                                               ↓\n                                          [Passenger App] ← WebSocket push\n\nОбновления только для активных поездок:\n  Когда поездка COMPLETED → отписаться от pub/sub канала\n  Канал автоматически исчезает\n\nЧастота: каждые 4 секунды (не нужно чаще — водитель не летит)' },
        { type: 'heading', value: 'Интерполяция на клиенте' },
        { type: 'text', value: 'Сервер присылает позицию раз в 4 секунды.\nНо на карте нужно плавное движение.\n\nКлиент интерполирует позицию:\n  Последняя позиция: {lat1, lon1, time1}\n  Новая позиция: {lat2, lon2, time2}\n  Текущее время t: interpolated = lat1 + (lat2-lat1) × (t-time1)/(time2-time1)\n  \nВодитель "плавно" движется между реальными обновлениями.' }
      ]
    },
    {
      id: 6,
      title: 'Шаг 6: Surge Pricing и аналитика',
      type: 'practice',
      requirements: [
        'Описать формулу surge pricing через demand/supply',
        'Объяснить вычисление через Kafka Streams',
        'Описать Redis TTL для хранения surge multiplier',
        'Описать real-time аналитику через Kafka Streams / Flink',
        'Описать batch аналитику (Lambda Architecture)'
      ],
      hint: 'Surge = demand / supply в геоячейке. Kafka Streams агрегирует события ride.requested по geohash + скользящее 5-мин окно. Результат → Redis "surge:{geohash}" с TTL 2 мин (не показывать устаревшие цены). Lambda Architecture: real-time (Kafka Streams) + batch (Spark) = полная аналитика.',
      expectedOutput: 'Формула: demand/supply → multiplier (1.5x, 2x, 2.5x). Kafka Streams: aggregate ride.requested по geohash, 5-мин окно → Redis "surge:{geohash}" TTL 2 мин. Real-time dashboard через Kafka Streams. Batch: Spark + Data Lake (S3) + Redshift для BI. Lambda Architecture описана.',
      solution: 'Surge Pricing (динамические цены):\nsurge_multiplier = demand / supply\n- demand: запросы на поездки в geohash ячейке за последние 5 мин\n- supply: доступные водители в ячейке\n- demand/supply > 2 → 1.5x; > 3 → 2.0x; > 5 → 2.5x (max)\n\nВычисление:\n- Kafka Streams обрабатывает поток ride.requested\n- Aggregate по geohash (5 символов = ~5 км²) за скользящее 5-мин окно\n- Redis: "surge:{geohash}" → multiplier (TTL 2 мин)\n- Обновляется каждую минуту\n\nReal-time Analytics:\n- Kafka Streams / Apache Flink: поток ride.requested, ride.completed\n- Aggregate по городу + 5-мин окно → Dashboard, Surge calculation\n\nBatch Analytics (Spark, раз в ночь):\n- Детальный анализ маршрутов, паттернов спроса\n- Data Lake (S3) → Redshift → BI инструменты',
      explanation: 'Surge pricing через Kafka Streams — образцовый пример streaming аналитики: real-time агрегация входящих событий для принятия бизнес-решений. Redis с TTL для surge multiplier — кеш, который автоматически устаревает (не показывать старые цены). Разделение real-time и batch аналитики — стандартная Lambda Architecture.',
      content: [
        { type: 'text', value: 'Динамическое ценообразование и аналитика в реальном времени.' },
        { type: 'heading', value: 'Surge Pricing (Динамическая цена)' },
        { type: 'text', value: 'Идея: высокий спрос + мало водителей → цена растёт → привлекает больше водителей.\n\nФормула (упрощённо):\n  surge_multiplier = demand / supply\n  demand = запросы на поездки в ячейке за последние 5 мин\n  supply = доступные водители в ячейке\n\n  Если demand/supply > 2: surge = 1.5x\n  Если > 3: surge = 2.0x\n  Если > 5: surge = 2.5x (максимум)\n\nГеография surge:\n  Вычисляется для каждой geohash ячейки (5-символьная = ~5 км²)\n  Обновляется каждую минуту\n\nХранилище:\n  Redis: "surge:{geohash}" → multiplier (TTL 2 мин)\n  При запросе цены: получить surge для geohash пассажира' },
        { type: 'heading', value: 'Real-time Analytics' },
        { type: 'text', value: 'Kafka Streams или Apache Flink обрабатывают поток событий:\n\nПример: подсчёт поездок в реальном времени\n  Поток: ride.requested, ride.completed, ride.cancelled\n  Aggregate: по городу, по времени (5-мин окно)\n  Результат → Dashboards, Surge calculation\n\nBatch Analytics (Spark, раз в ночь):\n  Детальный анализ: маршруты, популярные места, паттерны спроса\n  Data Lake (S3) → Redshift/BigQuery → BI инструменты' }
      ]
    },
    {
      id: 7,
      title: 'Шаг 7: Итоговая архитектура и масштабирование',
      type: 'practice',
      requirements: [
        'Перечислить все сервисы Uber',
        'Описать шардирование Location Service по городам',
        'Назвать 5 ключевых архитектурных решений',
        'Объяснить почему шардирование по городам эффективно',
        'Описать технологический стек Uber'
      ],
      hint: 'Ключевое решение масштабирования: шардирование по городам. Нью-Йорк и Лондон абсолютно независимы — свой Kafka topic, свой Redis GEO index, свой Matching Service. Это уменьшает размер каждого компонента и повышает performance. Uber использует H3 (hexagonal geospatial system) вместо Geohash.',
      expectedOutput: 'Сервисы: Location, Driver, Ride, Matching, Map, Pricing, Payment, Notification, Analytics. Шардирование по городам: Kafka "locations:{city}", Redis GEO "drivers:available:{city}", Matching per region. 5 решений: Redis GEO, Kafka buffer, distributed lock, Geohash sharding, surge real-time. H3 упомянут.',
      solution: 'Сервисы Uber:\n- Location Service: WebSocket + Kafka для 1.25M updates/сек\n- Driver Service: профили, рейтинги → PostgreSQL\n- Ride Service: создание/управление поездками (Saga pattern) → PostgreSQL\n- Matching Service: поиск водителя через Redis GEO\n- Map Service: маршруты (Google Maps / HERE Maps)\n- Pricing Service: базовые тарифы + surge multiplier\n- Payment Service: обработка платежей\n- Notification Service: push уведомления\n- Analytics Service: Kafka Streams + Spark\n\nМасштабирование Location Service:\nРазделить по городам:\n- Kafka topic per city: "locations:new_york", "locations:london"\n- Redis GEO index per city: "drivers:available:new_york"\n- Matching Service per region\n\nКлючевые решения:\n1. Redis GEO для поиска ближайших — O(log N)\n2. Kafka для буферизации 1.25M/сек location updates\n3. Distributed Lock (Redis NX) против double matching\n4. Geohash + regional sharding — горизонтальное масштабирование\n5. Surge pricing на основе real-time supply/demand',
      explanation: 'Sharding по городам — ключевое решение масштабирования: географически изолированные данные не имеют смысла объединять. Это уменьшает размер каждого Redis GEO index и повышает производительность поиска. Uber реально использует Go, Java, Kafka, PostgreSQL, Redis — архитектура описанная здесь соответствует их реальным решениям.',
      content: [
        { type: 'text', value: 'Финальная архитектура и ключевые решения по масштабированию.' },
        { type: 'heading', value: 'Сервисы' },
        { type: 'text', value: 'Location Service: WebSocket + Kafka для location updates\nDriver Service: профили водителей, документы, рейтинги\nRide Service: создание и управление поездками (Saga pattern)\nMatching Service: найти и предложить водителя\nMap Service: маршруты (интеграция с Google Maps / HERE Maps)\nPricing Service: базовые тарифы + surge multiplier\nPayment Service: обработка платежей\nNotification Service: push уведомления\nAnalytics Service: real-time и batch аналитика' },
        { type: 'heading', value: 'Масштабирование Location Service' },
        { type: 'text', value: 'Проблема: 1.25M location updates/сек через Kafka\n\nРешение: разделить по городам\n  Kafka topic per city: "locations:new_york", "locations:london"\n  Redis Geo index per city: "drivers:available:new_york"\n  Matching Service per region: обрабатывает только свой регион\n\nBonus: обработка ближних геолокаций стала быстрее (меньше данных в redis geo index)' },
        { type: 'heading', value: 'Key Design Decisions' },
        { type: 'list', value: [
          'Redis GEO для поиска ближайших водителей — O(log N) поиск',
          'WebSocket для location updates — меньше overhead чем HTTP polling',
          'Kafka для буферизации location stream — handles 1.25M/sec',
          'Distributed Lock (Redis) против двойного матчинга',
          'Geohash + regional sharding — горизонтальное масштабирование',
          'Surge pricing на основе real-time supply/demand ratio'
        ]},
        { type: 'note', value: 'Uber реальные технологии: Go, Java, Python. Kafka для событий. PostgreSQL + MySQL для данных. Redis для кеша и геоиндексов. H3 (Uber\'s Hexagonal Hierarchical Geospatial Indexing System) вместо Geohash — опубликован как open source.' }
      ]
    }
  ]
}
