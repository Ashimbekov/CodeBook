export default {
  id: 20,
  title: 'Проектируем: Uber',
  description: 'Полное проектирование Uber: геолокация водителей, матчинг, маршруты, surge pricing. Real-time location tracking и ride matching.',
  lessons: [
    {
      id: 1,
      title: 'Шаг 1: Требования и особенности',
      type: 'practice',
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
