export default {
  id: 6,
  title: 'AWS RDS и DynamoDB',
  description: 'Управляемые базы данных AWS: RDS (MySQL, PostgreSQL, Aurora), DynamoDB (NoSQL), резервное копирование, DAX, репликация.',
  lessons: [
    {
      id: 1,
      title: 'AWS RDS: реляционные базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon RDS (Relational Database Service) — управляемый сервис реляционных БД. AWS берёт на себя patching, бэкапы, репликацию, failover. Вы управляете только данными и схемой.' },
        { type: 'heading', value: 'Поддерживаемые СУБД' },
        { type: 'list', value: [
          'MySQL — самая популярная open-source СУБД',
          'PostgreSQL — продвинутая open-source СУБД с JSON, full-text search',
          'MariaDB — форк MySQL, полностью совместим',
          'Oracle — enterprise СУБД (нужна лицензия)',
          'SQL Server — Microsoft СУБД',
          'Aurora — облачная СУБД AWS, совместимая с MySQL и PostgreSQL, в 5x быстрее'
        ] },
        { type: 'code', language: 'bash', value: '# Создание RDS инстанса (PostgreSQL):\naws rds create-db-instance \\\n  --db-instance-identifier my-postgres \\\n  --db-instance-class db.t3.micro \\\n  --engine postgres \\\n  --engine-version 15.4 \\\n  --master-username admin \\\n  --master-user-password MySecurePass123! \\\n  --allocated-storage 20 \\\n  --storage-type gp3 \\\n  --vpc-security-group-ids sg-xxx \\\n  --db-subnet-group-name my-db-subnet-group \\\n  --backup-retention-period 7 \\\n  --multi-az \\\n  --storage-encrypted\n\n# Подключение:\npsql -h my-postgres.xxxxx.eu-central-1.rds.amazonaws.com \\\n     -U admin -d postgres\n\n# Важные параметры:\n# --multi-az: standby реплика в другой AZ (автоматический failover)\n# --storage-encrypted: шифрование данных at rest (KMS)\n# --backup-retention-period: хранить бэкапы N дней (макс 35)' },
        { type: 'tip', value: 'db.t3.micro входит в Free Tier (750 часов/мес). Для production всегда включайте Multi-AZ (автоматический failover за 60-120 секунд) и шифрование. Пароль лучше хранить в AWS Secrets Manager.' }
      ]
    },
    {
      id: 2,
      title: 'Amazon Aurora',
      type: 'theory',
      content: [
        { type: 'text', value: 'Aurora — облачная реляционная СУБД от AWS. Совместима с MySQL 5.7/8.0 и PostgreSQL. В 5 раз быстрее MySQL и 3 раза быстрее PostgreSQL. Автоматическое масштабирование хранилища до 128 TB.' },
        { type: 'heading', value: 'Особенности Aurora' },
        { type: 'list', value: [
          'Хранилище автоматически растёт по 10 GB до 128 TB',
          '6 копий данных в 3 AZ, переживает потерю 2 AZ',
          'До 15 Read Replicas с задержкой менее 10 мс',
          'Автоматический failover за 30 секунд (vs 60-120 для обычного RDS)',
          'Aurora Serverless v2: автомасштабирование от 0.5 до 128 ACU (Aurora Capacity Units)',
          'Aurora Global Database: репликация между регионами с задержкой менее 1 секунды'
        ] },
        { type: 'code', language: 'bash', value: '# Создание Aurora кластера (PostgreSQL):\naws rds create-db-cluster \\\n  --db-cluster-identifier my-aurora \\\n  --engine aurora-postgresql \\\n  --engine-version 15.4 \\\n  --master-username admin \\\n  --master-user-password MySecurePass123! \\\n  --vpc-security-group-ids sg-xxx \\\n  --db-subnet-group-name my-db-subnet-group \\\n  --storage-encrypted\n\n# Добавить Writer инстанс:\naws rds create-db-instance \\\n  --db-instance-identifier my-aurora-writer \\\n  --db-cluster-identifier my-aurora \\\n  --db-instance-class db.r6g.large \\\n  --engine aurora-postgresql\n\n# Добавить Reader инстанс:\naws rds create-db-instance \\\n  --db-instance-identifier my-aurora-reader \\\n  --db-cluster-identifier my-aurora \\\n  --db-instance-class db.r6g.large \\\n  --engine aurora-postgresql\n\n# Aurora Serverless v2:\naws rds create-db-cluster \\\n  --db-cluster-identifier my-aurora-serverless \\\n  --engine aurora-postgresql \\\n  --engine-version 15.4 \\\n  --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=16 \\\n  --master-username admin \\\n  --master-user-password MySecurePass123!' },
        { type: 'note', value: 'Aurora стоит на 20% дороже обычного RDS, но даёт значительно лучшую производительность и доступность. Для непредсказуемых нагрузок используйте Aurora Serverless v2 — платите только за потребляемые ACU.' }
      ]
    },
    {
      id: 3,
      title: 'Amazon DynamoDB',
      type: 'theory',
      content: [
        { type: 'text', value: 'DynamoDB — полностью управляемая NoSQL база данных с гарантированной задержкой менее 10 мс. Serverless, автомасштабирование, глобальные таблицы. Идеальна для высоконагруженных приложений.' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'Table — таблица (без фиксированной схемы, кроме ключей)',
          'Item — запись (аналог строки в SQL)',
          'Attribute — поле записи (строка, число, список, map)',
          'Partition Key (PK) — ключ хеширования для распределения данных',
          'Sort Key (SK) — необязательный ключ сортировки для диапазонных запросов',
          'RCU/WCU — Read/Write Capacity Units (единицы пропускной способности)'
        ] },
        { type: 'code', language: 'bash', value: '# Создание таблицы:\naws dynamodb create-table \\\n  --table-name Users \\\n  --attribute-definitions \\\n    AttributeName=userId,AttributeType=S \\\n    AttributeName=email,AttributeType=S \\\n  --key-schema \\\n    AttributeName=userId,KeyType=HASH \\\n    AttributeName=email,KeyType=RANGE \\\n  --billing-mode PAY_PER_REQUEST\n\n# Добавить запись:\naws dynamodb put-item \\\n  --table-name Users \\\n  --item \'{\n    "userId": {"S": "user-001"},\n    "email": {"S": "john@example.com"},\n    "name": {"S": "John Doe"},\n    "age": {"N": "30"},\n    "roles": {"L": [{"S": "admin"}, {"S": "developer"}]}\n  }\'\n\n# Получить запись:\naws dynamodb get-item \\\n  --table-name Users \\\n  --key \'{"userId": {"S": "user-001"}, "email": {"S": "john@example.com"}}\'\n\n# Запрос по Partition Key:\naws dynamodb query \\\n  --table-name Users \\\n  --key-condition-expression "userId = :uid" \\\n  --expression-attribute-values \'{":uid": {"S": "user-001"}}\'  ' },
        { type: 'tip', value: 'Используйте PAY_PER_REQUEST (on-demand) для непредсказуемых нагрузок. Для стабильных нагрузок PROVISIONED с Auto Scaling дешевле. DynamoDB Free Tier: 25 GB хранилища + 25 WCU + 25 RCU бесплатно навсегда.' }
      ]
    },
    {
      id: 4,
      title: 'DynamoDB: продвинутые возможности',
      type: 'theory',
      content: [
        { type: 'text', value: 'DynamoDB предоставляет мощные возможности: GSI/LSI для гибких запросов, DAX для кэширования, Streams для event-driven архитектуры, Global Tables для мульти-региональности.' },
        { type: 'code', language: 'bash', value: '# Global Secondary Index (GSI) — запрос по другому ключу:\naws dynamodb update-table \\\n  --table-name Users \\\n  --attribute-definitions AttributeName=email,AttributeType=S \\\n  --global-secondary-index-updates \'[{\n    "Create": {\n      "IndexName": "email-index",\n      "KeySchema": [{"AttributeName": "email", "KeyType": "HASH"}],\n      "Projection": {"ProjectionType": "ALL"}\n    }\n  }]\'\n\n# Запрос через GSI:\naws dynamodb query \\\n  --table-name Users \\\n  --index-name email-index \\\n  --key-condition-expression "email = :email" \\\n  --expression-attribute-values \'{":email": {"S": "john@example.com"}}\'\n\n# DynamoDB Streams — event при каждом изменении:\naws dynamodb update-table \\\n  --table-name Users \\\n  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES\n# Streams можно подключить к Lambda для реакции на изменения\n\n# TTL — автоматическое удаление записей:\naws dynamodb update-time-to-live \\\n  --table-name Sessions \\\n  --time-to-live-specification Enabled=true,AttributeName=expiresAt' },
        { type: 'heading', value: 'DAX (DynamoDB Accelerator)' },
        { type: 'text', value: 'DAX — in-memory кэш для DynamoDB. Снижает задержку с миллисекунд до микросекунд. Полностью совместим с DynamoDB API — нужно только изменить endpoint.' },
        { type: 'note', value: 'Выбор SQL vs NoSQL: RDS/Aurora — для сложных JOIN, транзакций, ACID (финансы, e-commerce). DynamoDB — для высокоскоростного доступа по ключу, IoT данных, gaming leaderboards, сессий.' }
      ]
    },
    {
      id: 5,
      title: 'Резервное копирование и восстановление',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS предоставляет автоматическое и ручное резервное копирование для обоих сервисов. Правильная стратегия бэкапов критична для DR (Disaster Recovery).' },
        { type: 'code', language: 'bash', value: '# RDS — автоматические бэкапы:\n# Включены по умолчанию, retention 7 дней (макс 35)\n# Point-in-Time Recovery: восстановление на любой момент за последние N дней\n\n# Восстановление RDS на определённый момент:\naws rds restore-db-instance-to-point-in-time \\\n  --source-db-instance-identifier my-postgres \\\n  --target-db-instance-identifier my-postgres-restored \\\n  --restore-time "2024-01-15T10:30:00Z"\n\n# Ручной snapshot (сохраняется навсегда):\naws rds create-db-snapshot \\\n  --db-instance-identifier my-postgres \\\n  --db-snapshot-identifier my-postgres-before-migration\n\n# DynamoDB — On-Demand Backup:\naws dynamodb create-backup \\\n  --table-name Users \\\n  --backup-name users-backup-2024-01-15\n\n# DynamoDB — Point-in-Time Recovery:\naws dynamodb update-continuous-backups \\\n  --table-name Users \\\n  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true\n\n# Восстановление DynamoDB:\naws dynamodb restore-table-to-point-in-time \\\n  --source-table-name Users \\\n  --target-table-name Users-Restored \\\n  --restore-date-time "2024-01-15T10:30:00Z"' },
        { type: 'tip', value: 'Всегда включайте Point-in-Time Recovery для production баз данных. Делайте ручные snapshots перед миграциями и обновлениями. Тестируйте восстановление из бэкапов регулярно — бэкап бесполезен если его нельзя восстановить.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: создание баз данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте RDS PostgreSQL и DynamoDB таблицу, настройте бэкапы и выполните CRUD операции.',
      requirements: [
        'Создайте RDS PostgreSQL инстанс (db.t3.micro) с Multi-AZ',
        'Подключитесь к RDS и создайте таблицу users',
        'Создайте DynamoDB таблицу Orders с partition key orderId и sort key createdAt',
        'Добавьте 3 записи в DynamoDB и выполните Query',
        'Создайте GSI на DynamoDB по полю customerId',
        'Включите PITR на DynamoDB и создайте snapshot RDS'
      ],
      hint: 'Для RDS нужен DB Subnet Group (минимум 2 подсети в разных AZ). DynamoDB не требует VPC. Используйте --billing-mode PAY_PER_REQUEST для DynamoDB.',
      expectedOutput: 'RDS my-postgres создан (db.t3.micro, Multi-AZ, encrypted).\nТаблица users создана в PostgreSQL.\nDynamoDB таблица Orders создана (orderId + createdAt).\n3 записи добавлены, Query возвращает результаты.\nGSI customer-index создан.\nPITR включен для DynamoDB. Snapshot RDS создан.',
      solution: '# RDS PostgreSQL\naws rds create-db-subnet-group \\\n  --db-subnet-group-name my-db-subnets \\\n  --db-subnet-group-description "DB subnets" \\\n  --subnet-ids subnet-priv1 subnet-priv2\n\naws rds create-db-instance \\\n  --db-instance-identifier my-postgres \\\n  --db-instance-class db.t3.micro \\\n  --engine postgres --engine-version 15.4 \\\n  --master-username admin --master-user-password SecurePass123! \\\n  --allocated-storage 20 --storage-type gp3 \\\n  --db-subnet-group-name my-db-subnets \\\n  --multi-az --storage-encrypted\n\n# DynamoDB\naws dynamodb create-table \\\n  --table-name Orders \\\n  --attribute-definitions \\\n    AttributeName=orderId,AttributeType=S \\\n    AttributeName=createdAt,AttributeType=S \\\n    AttributeName=customerId,AttributeType=S \\\n  --key-schema AttributeName=orderId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \\\n  --billing-mode PAY_PER_REQUEST\n\n# Добавить записи\nfor i in 1 2 3; do\n  aws dynamodb put-item --table-name Orders --item "{\n    \"orderId\":{\"S\":\"order-$i\"},\n    \"createdAt\":{\"S\":\"2024-01-1${i}T10:00:00Z\"},\n    \"customerId\":{\"S\":\"cust-001\"},\n    \"total\":{\"N\":\"$((i*100)}\"}}\"\ndone\n\n# GSI\naws dynamodb update-table --table-name Orders \\\n  --attribute-definitions AttributeName=customerId,AttributeType=S \\\n  --global-secondary-index-updates \'[{"Create":{"IndexName":"customer-index","KeySchema":[{"AttributeName":"customerId","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}}]\'\n\n# PITR\naws dynamodb update-continuous-backups --table-name Orders \\\n  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true\n\n# RDS Snapshot\naws rds create-db-snapshot \\\n  --db-instance-identifier my-postgres \\\n  --db-snapshot-identifier my-postgres-snapshot-1',
      explanation: 'RDS PostgreSQL с Multi-AZ обеспечивает высокую доступность для реляционных данных. DynamoDB с PAY_PER_REQUEST идеален для переменных нагрузок. GSI позволяет запрашивать данные по разным ключам. PITR и snapshots обеспечивают возможность восстановления.'
    }
  ]
}
