export default {
  id: 31,
  title: 'SD Interview: масштабирование',
  description: 'Стратегии масштабирования: вертикальное vs горизонтальное, stateless сервисы, балансировка нагрузки, кеширование (CDN/Redis/app), очереди сообщений, шардирование БД, декомпозиция на микросервисы.',
  lessons: [
    {
      id: 1,
      title: 'Вертикальное vs горизонтальное масштабирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Масштабирование — способность системы обрабатывать возросшую нагрузку. Два основных подхода: вертикальное (больше ресурсов на один сервер) и горизонтальное (больше серверов).' },
        { type: 'heading', value: 'Вертикальное масштабирование (Scale Up)' },
        { type: 'text', value: 'Добавить CPU/RAM/SSD на существующий сервер.\n\nПлюсы:\n- Простота: не нужно менять архитектуру\n- Нет проблем с распределёнными данными\n- Быстрый первый шаг\n\nМинусы:\n- Жёсткий предел (самый большой сервер в облаке: 448 CPU, 6 TB RAM)\n- Single Point of Failure\n- Дорого (цена растёт нелинейно)\n- Downtime при upgrade\n\nКогда использовать: базы данных на начальном этапе (проще чем шардирование).' },
        { type: 'heading', value: 'Горизонтальное масштабирование (Scale Out)' },
        { type: 'text', value: 'Добавить больше серверов того же типа.\n\nПлюсы:\n- Теоретически неограниченное масштабирование\n- High availability (один сервер упал — другие работают)\n- Дешевле (commodity hardware)\n\nМинусы:\n- Сложность: нужен load balancer, distributed state\n- Stateful сервисы сложно масштабировать горизонтально\n\nКогда использовать: API серверы, stateless сервисы — легко. БД — сложнее (репликация, шардирование).' },
        { type: 'tip', value: 'Правило: API серверы всегда горизонтально, БД — сначала вертикально, потом read replicas, потом шардирование. Не начинай с шардирования!' }
      ]
    },
    {
      id: 2,
      title: 'Stateless сервисы: ключ к горизонтальному масштабированию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stateless сервис — сервис, который не хранит состояние между запросами. Любой инстанс может обработать любой запрос. Это фундаментальное условие для горизонтального масштабирования.' },
        { type: 'heading', value: 'Stateful vs Stateless' },
        { type: 'text', value: 'Stateful (плохо для масштабирования):\nСервер А запомнил сессию пользователя в памяти\nЕсли следующий запрос пришёл на сервер Б — пользователь не авторизован!\n\nStateless (правильно):\nСессия хранится в Redis (внешнее состояние)\nЛюбой сервер обращается к Redis и получает сессию\nСервер можно добавлять/удалять свободно\n\nПравило: всё состояние — во внешних хранилищах (Redis, БД, S3)\nСам сервис — чистые функции: request → response' },
        { type: 'heading', value: 'Что выносим из сервиса' },
        { type: 'text', value: 'Сессии → Redis\nКеш → Redis\nФайлы → S3 / Object Storage\nОчереди → Kafka / RabbitMQ\nКонфигурация → Environment Variables / Config Service\nлоги → централизованный ELK / Datadog\n\nПосле этого:\n- Контейнеризация (Docker): один образ для всех инстансов\n- Оркестрация (Kubernetes): автоматическое масштабирование\n- Health checks: убрать нездоровые инстансы из rotation' },
        { type: 'tip', value: 'Stateless = масштабируемо. Всегда спрашивай: "Где хранится это состояние?" Если ответ "в памяти сервиса" — это проблема при масштабировании.' }
      ]
    },
    {
      id: 3,
      title: 'Балансировка нагрузки: стратегии',
      type: 'theory',
      content: [
        { type: 'text', value: 'Load Balancer распределяет входящие запросы между серверами. Без LB горизонтальное масштабирование бессмысленно.' },
        { type: 'heading', value: 'Алгоритмы балансировки' },
        { type: 'text', value: 'Round Robin: запросы распределяются по очереди 1→2→3→1→...\nПросто, но не учитывает загрузку серверов.\n\nWeighted Round Robin: серверам назначается вес (мощный сервер = больший вес)\nПодходит если серверы разной мощности.\n\nLeast Connections: запрос идёт на сервер с наименьшим числом активных соединений\nЛучше Round Robin для длинных запросов (streaming, uploads).\n\nIP Hash: IP клиента → всегда один сервер (sticky sessions)\nНужно если сессия в памяти сервера (антипаттерн).\n\nHealth Check Based: LB следит за здоровьем серверов\nАвтоматически убирает упавшие серверы.' },
        { type: 'heading', value: 'Уровни балансировки' },
        { type: 'text', value: 'Layer 4 (Transport): балансирует TCP/UDP потоки\nБыстро, но не видит HTTP контент.\nПример: AWS NLB (Network Load Balancer)\n\nLayer 7 (Application): балансирует HTTP запросы\nМожет смотреть URL, headers, cookies\nПример: AWS ALB (Application Load Balancer), Nginx\nПозволяет: /api → API серверы, /images → Media серверы' },
        { type: 'tip', value: 'В SD-интервью всегда добавляй Load Balancer между клиентом и серверами. Упомяни: health checks (каждые 5 сек), automatic failover, connection draining при деплое.' }
      ]
    },
    {
      id: 4,
      title: 'Слои кеширования: CDN, Redis, Application',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кеширование — самый эффективный способ улучшить производительность. Кеш существует на нескольких уровнях: от браузера до базы данных.' },
        { type: 'heading', value: 'CDN (Content Delivery Network)' },
        { type: 'text', value: 'CDN — распределённая сеть серверов по всему миру для доставки статичного контента.\n\nЧто кешировать в CDN:\n- JS, CSS, HTML файлы\n- Изображения, видео\n- API ответы которые редко меняются\n\nКак работает:\nПользователь (Алматы) → CDN edge (Алматы) → hit → вернуть\n                                              → miss → Origin (Лондон) → CDN → пользователь\n\nПлюсы: низкая latency (ближе к пользователю), снижает нагрузку на origin\nПровайдеры: Cloudflare, AWS CloudFront, Fastly' },
        { type: 'heading', value: 'Redis: Application Caching' },
        { type: 'text', value: 'Паттерн Cache-Aside (Lazy Loading):\n1. Запрос данных → проверить Redis\n2. Cache hit → вернуть из Redis (быстро)\n3. Cache miss → запрос в БД → сохранить в Redis с TTL → вернуть\n\nWrite-Through Cache:\nКаждая запись в БД → синхронно в Redis\nПлюс: кеш всегда актуален\nМинус: пишем даже редко читаемые данные\n\nWrite-Behind (Write-Back):\nЗаписываем в Redis → асинхронно в БД\nПлюс: быстрая запись\nМинус: риск потери данных при сбое Redis' },
        { type: 'tip', value: 'Кешируй результаты дорогих запросов (тяжёлые JOIN), а не простых (SELECT by primary key). БД и так кеширует PK lookups в buffer pool.' }
      ]
    },
    {
      id: 5,
      title: 'Message Queues: async decoupling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Message Queue (очередь сообщений) позволяет компонентам системы взаимодействовать асинхронно. Отправитель не ждёт, пока получатель обработает сообщение.' },
        { type: 'heading', value: 'Когда использовать Message Queue' },
        { type: 'text', value: 'Тяжёлые async задачи:\n- Отправка email после регистрации\n- Генерация thumbnail после загрузки фото\n- Обработка платежей\n- Обновление search индекса\n\nПик нагрузки (буферизация):\n- 10K заказов в минуту при пиковой распродаже\n- Queue буферизует, workers обрабатывают с комфортной скоростью\n\nDecoupling сервисов:\n- User Service публикует событие "user.registered"\n- Email Service, Analytics Service, Recommendation Service — независимые подписчики\n- Изменение в одном сервисе не ломает другие' },
        { type: 'heading', value: 'Kafka vs RabbitMQ' },
        { type: 'text', value: 'Apache Kafka:\n- Retained log: сообщения хранятся долго (дни/недели)\n- Consumer Groups: несколько групп независимо читают одну тему\n- Высокий throughput (миллионы сообщений/сек)\n- Подходит для: event streaming, аналитика, audit log\n\nRabbitMQ:\n- Traditional queue: сообщение удаляется после обработки\n- Flexible routing (fanout, topic, direct)\n- Проще для задач task queues\n- Подходит для: job queues, work distribution' },
        { type: 'tip', value: 'Kafka — не "просто очередь", это распределённый лог событий. Можно воспроизвести историю, добавить новых консьюмеров которые прочитают всё с начала. Это мощно для event-driven архитектуры.' }
      ]
    },
    {
      id: 6,
      title: 'Микросервисы: декомпозиция монолита',
      type: 'theory',
      content: [
        { type: 'text', value: 'Микросервисы — архитектурный паттерн, при котором система разбивается на небольшие независимые сервисы. Каждый сервис отвечает за одну функциональную область.' },
        { type: 'heading', value: 'Монолит vs Микросервисы' },
        { type: 'text', value: 'Монолит:\nВесь код в одном приложении.\nПлюсы: проще разрабатывать, отлаживать, деплоить (1 приложение)\nМинусы: сложно масштабировать частично, один баг роняет всё, деплой страшный\n\nМикросервисы:\nСервисы развёртываются независимо.\nПлюсы: масштабировать только нагруженный компонент, независимые деплои, разные технологии\nМинусы: distributed systems complexity, сетевые вызовы между сервисами, distributed tracing\n\nПравило: начни с монолита, декомпозируй когда:\n- Конкретный компонент стал узким местом\n- Команды мешают друг другу в одной кодовой базе\n- Разные компоненты требуют разных технологий' },
        { type: 'heading', value: 'Паттерны декомпозиции' },
        { type: 'text', value: 'По бизнес-функциям (Domain Driven Design):\nUser Service, Order Service, Payment Service, Inventory Service\n\nПо нагрузке:\nRead Service (оптимизирован для чтения)\nWrite Service (оптимизирован для записи)\n\nAPI Gateway:\nЕдиная точка входа для клиентов\nАутентификация, rate limiting, routing\nCompose ответы из нескольких сервисов (BFF — Backend For Frontend)' },
        { type: 'tip', value: 'На интервью не предлагай микросервисы сразу. Скажи: "Начнём с монолита для простоты, декомпозируем User и Payment сервисы когда они станут узкими местами." Это зрелый ответ.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: масштабирование монолита',
      type: 'practice',
      requirements: [
        'Описать стартовую архитектуру монолита для социальной сети (1 сервер, 1 БД)',
        'Пройти эволюцию по шагам: 1K → 100K → 1M → 10M DAU',
        'На каждом шаге описать узкое место и решение',
        'Упомянуть конкретные технологии: Redis, CDN, Read Replicas, Kafka, Sharding',
        'Финальная архитектура для 10M DAU'
      ],
      hint: '1K: один сервер. 10K: добавь Redis кеш для сессий и частых запросов. 100K: read replicas PostgreSQL, CDN для статики, горизонтально API серверы + LB. 1M: шардирование БД, Kafka для async обработки, выделить Media Service. 10M: микросервисы для узких мест, multi-region.',
      solution: 'Эволюция архитектуры социальной сети:\n\nФаза 1 — 1K DAU (Стартап)\nАрхитектура: 1 веб-сервер + 1 PostgreSQL\nУзкое место: нет узких мест, всё просто\nРешение: ничего не менять. Преждевременная оптимизация — зло.\n\nФаза 2 — 10K DAU\nУзкое место: сессии в памяти, статика грузит сервер\nРешение 1: Redis для сессий → сервис становится stateless\nРешение 2: Nginx для статики (JS/CSS/images) → снижает нагрузку на app\nАрхитектура: Nginx → App Server → Redis | PostgreSQL\n\nФаза 3 — 100K DAU\nУзкое место: PostgreSQL захлёбывается от read запросов\nРешение 1: PostgreSQL Read Replica × 2 → reads идут на replicas\nРешение 2: Redis Application Cache (ленты, профили, TTL)\nРешение 3: горизонтально API серверы × 3 + Load Balancer\nРешение 4: CDN (Cloudflare) для медиа\nАрхитектура: CDN → LB → [API ×3] → Redis | PG Primary + [PG Replica ×2]\n\nФаза 4 — 1M DAU\nУзкое место: write QPS перегружает PostgreSQL Primary\nРешение 1: Шардирование PostgreSQL по user_id (4 шарда)\nРешение 2: Kafka для async событий (новый пост → обновить ленты, отправить уведомления)\nРешение 3: Выделить Media Service (S3 + CDN для загрузки фото)\nАрхитектура: LB → [API ×10] → Kafka → [Workers] | Redis Cluster | [PG Shard ×4]\n\nФаза 5 — 10M DAU\nУзкое место: Feed Service стал узким местом\nРешение 1: Выделить отдельный Feed Service с Cassandra\nРешение 2: Выделить Search Service (Elasticsearch)\nРешение 3: Multi-region deployment (US, EU, ASIA)\nАрхитектура: Global LB → [Region CDN] → [API Gateway] → Microservices:\n  User Service (PG), Feed Service (Cassandra), Search Service (ES),\n  Media Service (S3), Notification Service (Kafka consumer)',
      explanation: 'Масштабирование — это итеративный процесс. Не строй архитектуру для 10M когда у тебя 1K пользователей. Каждый шаг решает конкретное узкое место, а не абстрактные проблемы. Последовательность: кеш → replicas → горизонтальный API → CDN → async → шардирование → микросервисы. Большинство стартапов не доходят до шага 4.'
    }
  ]
}
