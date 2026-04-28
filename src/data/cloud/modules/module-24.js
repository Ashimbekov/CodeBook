export default {
  id: 24,
  title: 'Миграция в облако',
  description: 'Стратегии миграции в облако: assessment, 7 R стратегий, AWS Migration Hub, Database Migration Service, этапы миграции.',
  lessons: [
    {
      id: 1,
      title: 'Стратегии миграции: 7 R',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS определяет 7 стратегий миграции (7 R) для переноса приложений в облако. Выбор стратегии зависит от бизнес-требований, технической сложности и временных рамок.' },
        { type: 'heading', value: '7 R стратегий' },
        { type: 'list', value: [
          'Retire — вывести из эксплуатации. Приложение больше не нужно. Экономия 10-20%',
          'Retain — оставить as-is. Пока не мигрировать (compliance, сложность). Мигрировать позже',
          'Rehost (Lift & Shift) — перенести в облако без изменений. EC2 вместо on-premise. Быстро, минимум изменений',
          'Relocate — переместить VMware в AWS (VMware Cloud on AWS). Без изменений инфраструктуры',
          'Replatform (Lift & Reshape) — минимальные оптимизации. MySQL → RDS MySQL. Небольшие улучшения',
          'Repurchase — замена на SaaS. Exchange → Office 365, SAP → SAP on AWS. Покупка готового',
          'Refactor (Re-architect) — полная перестройка для облака. Monolith → микросервисы, serverless. Максимальная выгода, максимальные усилия'
        ] },
        { type: 'code', language: 'bash', value: '# Типичное распределение при миграции:\n#\n# Retire:     10-20% приложений (устаревшие, дублирующие)\n# Retain:     10-20% (complex legacy, compliance)\n# Rehost:     30-40% (быстрая миграция, минимальный risk)\n# Replatform: 15-25% (базы данных, middleware)\n# Repurchase:  5-10% (CRM, email, HR)\n# Refactor:    5-15% (стратегические приложения)\n#\n# Фазы миграции:\n# Phase 1: Assessment (2-4 недели)\n#   - Инвентаризация (Discovery)\n#   - Зависимости между приложениями\n#   - Выбор стратегии для каждого приложения\n#\n# Phase 2: Mobilize (4-8 недель)\n#   - Landing Zone (аккаунт, VPC, IAM, мониторинг)\n#   - Proof of Concept миграции\n#   - Обучение команды\n#\n# Phase 3: Migrate & Modernize (3-18 месяцев)\n#   - Волнами по 5-20 приложений\n#   - Валидация после каждой волны\n#   - Оптимизация после миграции' },
        { type: 'tip', value: 'Начните с Rehost (Lift & Shift) для быстрой миграции, затем постепенно оптимизируйте (Replatform, Refactor). Не пытайтесь Refactor всё сразу — это затянет проект на годы. Migrate first, optimize later.' }
      ]
    },
    {
      id: 2,
      title: 'Assessment и Discovery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Assessment — первый этап миграции: инвентаризация серверов, зависимостей, нагрузки. AWS Application Discovery Service и Migration Hub помогают автоматизировать этот процесс.' },
        { type: 'code', language: 'bash', value: '# AWS Application Discovery Service:\n# Агент устанавливается на on-premise серверы\n# Собирает: CPU, RAM, disk, network, процессы, зависимости\n\n# AWS Migration Hub:\n# Центральная панель для отслеживания миграции\n# Интегрируется с: CloudEndure, DMS, SMS\n\n# Ключевые данные для Assessment:\n# 1. Серверы: количество, OS, CPU, RAM, disk\n# 2. Приложения: какие, на каких серверах\n# 3. Зависимости: какие приложения общаются друг с другом\n# 4. Базы данных: тип, размер, IOPS, репликация\n# 5. Сеть: bandwidth, latency requirements\n# 6. Compliance: где можно хранить данные\n# 7. Лицензии: Windows, Oracle, SAP (BYOL vs included)\n\n# AWS Migration Evaluator (бесплатный):\n# Устанавливает collector на on-premise\n# Анализирует 2-4 недели\n# Генерирует отчёт: рекомендуемые AWS ресурсы + стоимость\n# Business case: TCO сравнение on-premise vs AWS\n\n# Checklist перед миграцией:\n# ✓ Все приложения каталогизированы\n# ✓ Зависимости задокументированы\n# ✓ Стратегия выбрана для каждого приложения\n# ✓ Landing Zone готова (VPC, IAM, monitoring)\n# ✓ Rollback план для каждого приложения\n# ✓ Тесты приёмки определены' },
        { type: 'note', value: 'Самая частая ошибка при миграции — недооценка зависимостей между приложениями. App A зависит от App B, который зависит от DB C. Если мигрировать A без B и C, A перестанет работать. Всегда определяйте "move groups".' }
      ]
    },
    {
      id: 3,
      title: 'Миграция серверов',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS Application Migration Service (MGN) — основной инструмент для Rehost миграции серверов. Непрерывная репликация данных на AWS, переключение с минимальным даунтаймом.' },
        { type: 'code', language: 'bash', value: '# AWS MGN (Application Migration Service):\n# 1. Установить агент на source server\n# 2. Агент непрерывно реплицирует диски в AWS\n# 3. Тестовый запуск: создаёт EC2 из реплики\n# 4. Cutover: финальное переключение\n\n# Процесс:\n# Source Server → [MGN Agent] → [Replication] → Staging Area (S3)\n#                                                     ↓\n#                                              [Conversion]\n#                                                     ↓\n#                                              Target EC2\n\n# Установка агента:\nwget -O ./installer https://aws-application-migration-service-us-east-1.s3.amazonaws.com/latest/linux/aws-replication-installer-init.py\nsudo python3 aws-replication-installer-init.py \\\n  --region eu-central-1 \\\n  --aws-access-key-id AKIAEXAMPLE \\\n  --aws-secret-access-key SECRETEXAMPLE\n\n# После установки агент начинает репликацию\n# В AWS Console → MGN → Source Servers\n# Status: Not ready → Ready for testing → Ready for cutover\n\n# Тестовый запуск:\naws mgn start-test --source-server-id s-xxx\n\n# Cutover (финальное переключение):\naws mgn start-cutover --source-server-id s-xxx\n# 1. Финальная синхронизация данных\n# 2. Остановка source server\n# 3. Запуск target EC2\n# Даунтайм: обычно 10-30 минут' },
        { type: 'tip', value: 'Всегда проводите Test Launch перед Cutover. Проверьте: приложение запускается, сеть работает, данные корректны. Держите source servers работающими несколько дней после cutover для быстрого rollback если нужно.' }
      ]
    },
    {
      id: 4,
      title: 'Миграция баз данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS DMS (Database Migration Service) мигрирует базы данных с минимальным даунтаймом. Поддерживает homogeneous (MySQL → MySQL) и heterogeneous (Oracle → PostgreSQL) миграции.' },
        { type: 'code', language: 'bash', value: '# AWS DMS — Database Migration Service:\n# Source DB → DMS Replication Instance → Target DB (RDS/Aurora)\n\n# Создание Replication Instance:\naws dms create-replication-instance \\\n  --replication-instance-identifier my-dms \\\n  --replication-instance-class dms.t3.medium \\\n  --allocated-storage 50\n\n# Source Endpoint (on-premise PostgreSQL):\naws dms create-endpoint \\\n  --endpoint-identifier source-pg \\\n  --endpoint-type source \\\n  --engine-name postgres \\\n  --server-name 10.0.1.100 \\\n  --port 5432 \\\n  --username admin \\\n  --password MyPassword \\\n  --database-name mydb\n\n# Target Endpoint (RDS PostgreSQL):\naws dms create-endpoint \\\n  --endpoint-identifier target-rds \\\n  --endpoint-type target \\\n  --engine-name postgres \\\n  --server-name mydb.xxx.eu-central-1.rds.amazonaws.com \\\n  --port 5432 \\\n  --username admin \\\n  --password MyPassword \\\n  --database-name mydb\n\n# Replication Task (full load + CDC):\naws dms create-replication-task \\\n  --replication-task-identifier full-migration \\\n  --source-endpoint-arn arn:... \\\n  --target-endpoint-arn arn:... \\\n  --replication-instance-arn arn:... \\\n  --migration-type full-load-and-cdc \\\n  --table-mappings file://table-mappings.json\n\n# full-load-and-cdc:\n# 1. Full Load: копирует все данные\n# 2. CDC (Change Data Capture): реплицирует изменения в реальном времени\n# 3. Cutover: переключить приложение на RDS, остановить DMS' },
        { type: 'heading', value: 'Heterogeneous миграция (Oracle → PostgreSQL)' },
        { type: 'text', value: 'AWS SCT (Schema Conversion Tool) конвертирует схему и хранимые процедуры. Примерно 80% конвертируется автоматически, 20% требует ручной доработки.' },
        { type: 'note', value: 'Для homogeneous миграций (MySQL → RDS MySQL) используйте native tools (mysqldump, pg_dump) для начальной загрузки и DMS CDC для синхронизации. Это быстрее чем DMS full-load для больших баз данных.' }
      ]
    },
    {
      id: 5,
      title: 'Landing Zone и post-migration',
      type: 'theory',
      content: [
        { type: 'text', value: 'Landing Zone — подготовленная облачная среда для приёма мигрируемых приложений. Включает multi-account структуру, networking, security, monitoring. Post-migration оптимизация раскрывает преимущества облака.' },
        { type: 'code', language: 'bash', value: '# AWS Landing Zone (через Control Tower):\n# Автоматически создаёт:\n# - Management Account (биллинг, root)\n# - Log Archive Account (CloudTrail, Config)\n# - Audit Account (security)\n# - Shared Services Account (AD, DNS)\n# - Workload Accounts (prod, dev, staging)\n\n# AWS Control Tower:\naws controltower create-landing-zone\n# Создаёт Organizations, SSO, Guard Rails, Account Factory\n\n# Account Factory — создание аккаунтов по шаблону:\n# Каждый аккаунт автоматически получает:\n# - VPC с публичными/приватными подсетями\n# - CloudTrail + Config\n# - IAM roles (Admin, Developer, ReadOnly)\n# - Guardrails (обязательные политики)\n\n# Post-migration оптимизация:\n# 1. Right-sizing: уменьшить EC2 до реального потребления\n# 2. Replatform: MySQL EC2 → RDS, файлы на диске → S3\n# 3. Auto Scaling: добавить ASG и ALB\n# 4. Reserved Instances: для стабильных нагрузок\n# 5. Monitoring: CloudWatch alarms, dashboards\n# 6. Security: WAF, encryption, Secrets Manager\n# 7. Backup: автоматические бэкапы, DR план' },
        { type: 'list', value: [
          'Месяц 1-3 после миграции: стабилизация, мониторинг, устранение проблем',
          'Месяц 3-6: right-sizing, Reserved Instances, cost optimization',
          'Месяц 6-12: Replatform (managed services), автоматизация',
          'Год 2+: Refactor критичных приложений (serverless, микросервисы)'
        ] },
        { type: 'tip', value: 'AWS Control Tower + Account Factory — стандартный способ создания Landing Zone для enterprise. Для небольших компаний достаточно 2-3 аккаунтов (management, prod, dev) с ручной настройкой через CloudFormation/CDK.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: план миграции',
      type: 'practice',
      difficulty: 'hard',
      description: 'Составьте план миграции для типичного web-приложения с on-premise в AWS.',
      requirements: [
        'Опишите текущую инфраструктуру: 2 web сервера, 1 БД (PostgreSQL), файловое хранилище',
        'Выберите стратегию миграции для каждого компонента (Rehost/Replatform)',
        'Спланируйте Landing Zone: VPC, подсети, security groups',
        'Опишите процесс миграции серверов через AWS MGN',
        'Опишите процесс миграции БД через AWS DMS',
        'Составьте checklist валидации после миграции'
      ],
      hint: 'Web серверы: Rehost (MGN → EC2) или Replatform (→ ECS). БД: Replatform (DMS → RDS). Файлы: Replatform (→ S3). Составьте порядок миграции с учётом зависимостей.',
      expectedOutput: 'Текущее: 2 web (nginx+python), 1 PostgreSQL, NFS storage.\nСтратегия: Web → Replatform (ECS Fargate), DB → Replatform (RDS), Files → S3.\nLanding Zone: VPC 10.0.0.0/16, public + private subnets, NAT GW.\nMGN: агент → репликация → test → cutover (даунтайм 15 мин).\nDMS: full-load + CDC → RDS, переключение приложения.\nChecklist: health checks, data integrity, performance, monitoring.',
      solution: '# План миграции:\n\n# 1. Текущая инфраструктура:\n# - 2x Web Server: Ubuntu, Nginx, Python/Django\n# - 1x Database: PostgreSQL 15, 200GB data\n# - 1x NFS: 500GB файлов (uploads, images)\n\n# 2. Стратегия:\n# Web → Replatform: Docker → ECS Fargate (или Rehost: MGN → EC2)\n# DB  → Replatform: DMS → RDS PostgreSQL (Multi-AZ)\n# NFS → Replatform: aws s3 sync → S3 + CloudFront\n\n# 3. Landing Zone:\n# VPC: 10.0.0.0/16\n# Public: 10.0.1.0/24 (ALB), 10.0.2.0/24\n# Private: 10.0.3.0/24 (ECS), 10.0.4.0/24 (RDS)\n# NAT Gateway, Internet Gateway, Security Groups\n\n# 4. Порядок миграции:\n# Week 1: Landing Zone (VPC, SG, IAM)\n# Week 2: S3 + CloudFront (файлы)\n# Week 3: RDS (DMS full-load + CDC)\n# Week 4: ECS (Docker, ALB, deploy)\n# Week 5: DNS cutover (Route 53)\n# Week 6: Validation + optimization\n\n# 5. Checklist:\n# ✓ Все страницы загружаются корректно\n# ✓ Данные в RDS соответствуют source\n# ✓ Файлы в S3 доступны через CloudFront\n# ✓ Performance: latency < 200ms\n# ✓ Monitoring: CloudWatch alarms работают\n# ✓ Backup: RDS automated backup, S3 versioning\n# ✓ Security: SG, encryption, WAF',
      explanation: 'Миграция выполняется поэтапно: сначала Landing Zone, затем stateless компоненты (файлы), потом stateful (БД), потом compute, последний — DNS переключение. DMS CDC обеспечивает непрерывную репликацию БД до момента cutover. Rollback план: вернуть DNS на on-premise.'
    }
  ]
}
