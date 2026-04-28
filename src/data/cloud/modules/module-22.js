export default {
  id: 22,
  title: 'Облачная архитектура',
  description: 'Well-Architected Framework, design patterns для облака: микросервисы, event-driven, CQRS, saga, circuit breaker.',
  lessons: [
    {
      id: 1,
      title: 'Well-Architected Framework',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS Well-Architected Framework — набор лучших практик для проектирования облачных систем. Все три провайдера имеют аналогичные frameworks. 6 столпов определяют качество архитектуры.' },
        { type: 'heading', value: '6 столпов Well-Architected' },
        { type: 'list', value: [
          'Operational Excellence — автоматизация, мониторинг, инциденты, CI/CD, IaC',
          'Security — IAM, шифрование, compliance, детекция угроз, defense in depth',
          'Reliability — отказоустойчивость, автовосстановление, DR, multi-AZ/region',
          'Performance Efficiency — правильный выбор ресурсов, кэширование, CDN, auto scaling',
          'Cost Optimization — right-sizing, reserved instances, spot, lifecycle, FinOps',
          'Sustainability — энергоэффективность, оптимизация утилизации ресурсов'
        ] },
        { type: 'code', language: 'bash', value: '# AWS Well-Architected Tool — бесплатная самооценка:\n# Console → AWS Well-Architected Tool → Create Workload\n# Отвечаете на вопросы по каждому столпу\n# Получаете рекомендации и план улучшений\n\n# Ключевые вопросы:\n# Security: "Как вы управляете идентификацией и доступом?"\n# Reliability: "Как система восстанавливается после сбоев?"\n# Performance: "Как вы выбираете тип инстанса?"\n# Cost: "Как вы контролируете расходы?"\n\n# Пример архитектурных решений по столпам:\n# Reliability: Multi-AZ RDS, ASG min=2, health checks\n# Performance: CloudFront CDN, ElastiCache, read replicas\n# Cost: Reserved Instances, spot для batch, S3 lifecycle\n# Security: WAF, encryption, VPC private subnets\n# Operational: CloudWatch alarms, X-Ray, IaC (CDK)' },
        { type: 'tip', value: 'Проводите Well-Architected Review перед каждым крупным запуском и ежеквартально для production систем. AWS Well-Architected Tool бесплатный. Для GCP используйте Architecture Framework, для Azure — Well-Architected Review.' }
      ]
    },
    {
      id: 2,
      title: 'Паттерны высокой доступности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Высокая доступность (HA) — способность системы оставаться работоспособной при отказе компонентов. Достигается через избыточность, автовосстановление и распределение по AZ/регионам.' },
        { type: 'heading', value: 'Уровни доступности' },
        { type: 'list', value: [
          'Single AZ: ~99.9% (8.7 часов даунтайма/год). Для dev/test',
          'Multi-AZ: ~99.95% (4.4 часа/год). Standard production',
          'Multi-Region Active-Passive: ~99.99% (52 мин/год). Критичные системы',
          'Multi-Region Active-Active: ~99.999% (5 мин/год). Глобальные сервисы'
        ] },
        { type: 'code', language: 'yaml', value: '# Production HA архитектура (AWS CDK / pseudo-config):\n# \n# Route 53 (DNS failover)\n# ├── Region 1 (Primary): eu-central-1\n# │   ├── ALB (across AZ-a, AZ-b, AZ-c)\n# │   │   └── ECS Fargate Service (min=2, max=10)\n# │   ├── Aurora PostgreSQL (Multi-AZ, 2 read replicas)\n# │   ├── ElastiCache Redis (Multi-AZ)\n# │   └── S3 (Cross-Region Replication → Region 2)\n# │\n# └── Region 2 (DR): eu-west-1\n#     ├── ALB (standby)\n#     │   └── ECS Fargate Service (min=1)\n#     ├── Aurora Global Database (read replica)\n#     ├── ElastiCache Redis (standby)\n#     └── S3 (replicated from Region 1)\n#\n# RTO (Recovery Time Objective): 5 минут\n# RPO (Recovery Point Objective): 1 секунда\n# Failover: автоматический через Route 53 health checks' },
        { type: 'note', value: 'Multi-Region стоит дорого (удвоение инфраструктуры). Для большинства приложений Multi-AZ достаточно. Multi-Region нужен для: SLA 99.99%+, глобальные пользователи, regulatory requirements (данные ближе к пользователю).' }
      ]
    },
    {
      id: 3,
      title: 'Event-Driven архитектура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event-Driven Architecture (EDA) — компоненты системы общаются через события (events) вместо прямых вызовов. Обеспечивает слабую связанность, масштабируемость, устойчивость к сбоям.' },
        { type: 'code', language: 'bash', value: '# Event-Driven паттерны в AWS:\n#\n# 1. Event Bus (EventBridge):\n# Service A → EventBridge → Service B, C, D\n# Pub/Sub с фильтрацией и маршрутизацией\n\n# 2. Message Queue (SQS):\n# Producer → SQS Queue → Consumer (1 получатель)\n# Буферизация, retry, dead-letter queue\n\n# 3. Pub/Sub (SNS):\n# Publisher → SNS Topic → SQS, Lambda, Email, HTTP\n# Fan-out: одно событие → множество получателей\n\n# 4. Streaming (Kinesis / Kafka):\n# Producer → Kinesis Stream → Consumer 1, 2, 3\n# Порядок сохраняется, replay возможен\n\n# Пример: обработка заказов\n# 1. API → SQS (order-queue)\n# 2. Lambda читает из SQS → обрабатывает → DynamoDB\n# 3. DynamoDB Stream → Lambda → SNS (notification)\n# 4. SNS → Email, SMS, Push notification\n\n# EventBridge правило:\naws events put-rule \\\n  --name order-created \\\n  --event-pattern \'{"source":["my-app"],"detail-type":["OrderCreated"]}\'\n\naws events put-targets \\\n  --rule order-created \\\n  --targets "Id"="1","Arn"="arn:aws:lambda:...:function:process-order"' },
        { type: 'tip', value: 'Event-Driven + Serverless = идеальная комбинация для масштабируемых систем. SQS + Lambda масштабируется автоматически от 0 до тысяч concurrent обработчиков. Используйте Dead Letter Queue (DLQ) для неудавшихся сообщений.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерны микросервисов в облаке',
      type: 'theory',
      content: [
        { type: 'text', value: 'Микросервисная архитектура в облаке использует специфические паттерны для надёжности и масштабируемости: Circuit Breaker, Saga, CQRS, API Gateway.' },
        { type: 'heading', value: 'Ключевые паттерны' },
        { type: 'list', value: [
          'API Gateway — единая точка входа для клиентов (AWS API Gateway, Kong, Envoy)',
          'Circuit Breaker — прерывание запросов к неработающему сервису (предотвращение каскадных сбоев)',
          'Saga — распределённые транзакции через события (choreography) или оркестратор (orchestration)',
          'CQRS — разделение команд записи и запросов чтения (разные модели данных)',
          'Service Mesh — инфраструктурный слой для service-to-service коммуникации (Istio, AWS App Mesh)',
          'Strangler Fig — постепенная миграция с монолита на микросервисы'
        ] },
        { type: 'code', language: 'python', value: '# Circuit Breaker паттерн (Python):\nfrom circuitbreaker import circuit\nimport requests\n\n@circuit(failure_threshold=5, recovery_timeout=30)\ndef call_payment_service(order_id):\n    """Если 5 ошибок подряд — circuit opens на 30 секунд.\n    Все вызовы сразу возвращают ошибку (без обращения к сервису).\n    Через 30 секунд — один пробный запрос (half-open).\n    Если успешен — circuit closes, нормальная работа.\"\"\"\n    response = requests.post(\n        "https://payment-service/api/charge",\n        json={"orderId": order_id},\n        timeout=5\n    )\n    response.raise_for_status()\n    return response.json()\n\n# Saga паттерн (Step Functions):\n# 1. CreateOrder → 2. ReserveInventory → 3. ChargePayment → 4. Confirm\n# Если шаг 3 падает:\n# 3.compensate → ReleaseInventory → CancelOrder\n# Каждый шаг имеет компенсирующее действие для отката' },
        { type: 'note', value: 'Не начинайте с микросервисов! Monolith-first: начните с монолита, выделяйте микросервисы когда появится реальная необходимость (разные команды, разная скорость деплоя, разные требования к масштабированию).' }
      ]
    },
    {
      id: 5,
      title: 'Кэширование и оптимизация производительности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кэширование — ключевой паттерн для снижения задержки и стоимости. CDN кэширует статику. Redis/Memcached — данные из БД. Application-level кэш — результаты вычислений.' },
        { type: 'code', language: 'bash', value: '# Уровни кэширования:\n# 1. CDN (CloudFront/Cloud CDN) — статические файлы, ~50мс → ~5мс\n# 2. API Cache (API Gateway) — ответы API, ~200мс → ~10мс\n# 3. Application Cache (Redis) — данные из БД, ~50мс → ~1мс\n# 4. Database Cache (DAX/Query Cache) — внутри БД\n\n# AWS ElastiCache (Redis):\naws elasticache create-replication-group \\\n  --replication-group-id my-redis \\\n  --replication-group-description "App cache" \\\n  --engine redis \\\n  --cache-node-type cache.t3.micro \\\n  --num-cache-clusters 2 \\\n  --automatic-failover-enabled\n\n# GCP Memorystore (Redis):\ngcloud redis instances create my-redis \\\n  --region=europe-west1 \\\n  --size=1 \\\n  --tier=standard  # High availability\n\n# Azure Cache for Redis:\naz redis create \\\n  --name my-redis \\\n  --resource-group myapp-prod-rg \\\n  --sku Basic \\\n  --vm-size c0' },
        { type: 'code', language: 'python', value: '# Cache-Aside паттерн (Python + Redis):\nimport redis\nimport json\n\ncache = redis.Redis(host="my-redis.xxx.cache.amazonaws.com", port=6379)\n\ndef get_user(user_id):\n    # 1. Проверить кэш\n    cached = cache.get(f"user:{user_id}")\n    if cached:\n        return json.loads(cached)  # Cache HIT (~1ms)\n    \n    # 2. Cache MISS — читать из БД\n    user = db.query("SELECT * FROM users WHERE id = %s", user_id)\n    \n    # 3. Сохранить в кэш (TTL 5 минут)\n    cache.setex(f"user:{user_id}", 300, json.dumps(user))\n    \n    return user\n\ndef update_user(user_id, data):\n    # Обновить БД\n    db.execute("UPDATE users SET ... WHERE id = %s", user_id)\n    # Инвалидировать кэш\n    cache.delete(f"user:{user_id}")' },
        { type: 'tip', value: 'Кэш решает 80% проблем производительности. Начните с CDN для статики, затем Redis для горячих данных из БД. TTL (Time To Live) — компромисс между свежестью и скоростью: 5 мин для профилей, 60 сек для каталога, 0 для баланса.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: проектирование облачной архитектуры',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте и опишите архитектуру облачного приложения с HA, кэшированием и event-driven обработкой.',
      requirements: [
        'Нарисуйте (опишите) архитектуру e-commerce приложения на AWS',
        'Обеспечьте Multi-AZ для всех stateful компонентов (RDS, Redis)',
        'Используйте SQS для асинхронной обработки заказов',
        'Добавьте CloudFront CDN для статического контента',
        'Добавьте ElastiCache Redis для кэширования каталога',
        'Рассчитайте примерную стоимость инфраструктуры'
      ],
      hint: 'Архитектура: Route53 → CloudFront → ALB → ECS Fargate → Aurora + ElastiCache. SQS для order processing. S3 для статики и изображений.',
      expectedOutput: 'Архитектура: CloudFront → ALB → ECS (2 AZ) → Aurora Multi-AZ + Redis.\nSQS: order-queue → Lambda → DynamoDB (order history).\nCDN: статика из S3 через CloudFront.\nRedis: кэш каталога (TTL 5 min).\nОценка стоимости: ~$300-500/мес для среднего трафика.',
      solution: '# Архитектура e-commerce (AWS):\n#\n# DNS: Route 53\n# CDN: CloudFront → S3 (static assets, images)\n# API: ALB → ECS Fargate (2 AZ, min=2, max=10)\n# DB:  Aurora PostgreSQL Multi-AZ (writer + reader)\n# Cache: ElastiCache Redis Multi-AZ\n# Queue: SQS (order-processing) → Lambda → DynamoDB\n# Notification: SNS → Email, SMS\n# Storage: S3 (uploads, backups)\n# Monitoring: CloudWatch + X-Ray\n# Security: WAF + Shield Standard\n\n# Terraform описание (ключевые ресурсы):\n# module "vpc" { ... multi-az, nat gateway }\n# module "ecs" { ... fargate, alb, autoscaling }\n# module "aurora" { ... multi-az, read replica }\n# module "redis" { ... multi-az, replication }\n# module "sqs" { ... dead-letter queue }\n# module "cdn" { ... cloudfront + s3 }\n\n# Примерная стоимость (средний трафик):\n# ECS Fargate (2x 0.5vCPU/1GB): ~$30/мес\n# Aurora (db.t3.medium Multi-AZ): ~$130/мес\n# ElastiCache (cache.t3.micro x2): ~$25/мес\n# ALB: ~$20/мес\n# NAT Gateway: ~$32/мес\n# S3 + CloudFront: ~$10/мес\n# SQS + Lambda: ~$5/мес\n# Итого: ~$250-350/мес',
      explanation: 'Production архитектура строится по принципам Well-Architected Framework: Multi-AZ для HA, кэширование для performance, SQS для decoupling, CDN для latency, WAF для security. Стоимость оптимизируется через right-sizing, reserved instances и serverless компоненты.'
    }
  ]
}
