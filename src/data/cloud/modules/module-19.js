export default {
  id: 19,
  title: 'Azure Storage и Cosmos DB',
  description: 'Azure Storage: Blob, Table, Queue, File. Azure Cosmos DB: мультимодельная глобально распределённая NoSQL база данных.',
  lessons: [
    {
      id: 1,
      title: 'Azure Blob Storage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Blob Storage — объектное хранилище (аналог S3/GCS). Три типа блобов: Block (файлы), Append (логи), Page (диски VM). Storage Account — контейнер для всех типов хранилищ.' },
        { type: 'code', language: 'bash', value: '# Создание Storage Account:\naz storage account create \\\n  --name myappstorage123 \\\n  --resource-group myapp-prod-rg \\\n  --location westeurope \\\n  --sku Standard_LRS \\\n  --kind StorageV2\n\n# Создание контейнера (аналог bucket):\naz storage container create \\\n  --name uploads \\\n  --account-name myappstorage123\n\n# Загрузка файла:\naz storage blob upload \\\n  --account-name myappstorage123 \\\n  --container-name uploads \\\n  --name data/report.csv \\\n  --file ./report.csv\n\n# Загрузка директории:\naz storage blob upload-batch \\\n  --account-name myappstorage123 \\\n  --destination uploads \\\n  --source ./data/\n\n# Список блобов:\naz storage blob list \\\n  --account-name myappstorage123 \\\n  --container-name uploads \\\n  --output table\n\n# Access Tiers:\n# Hot:  частый доступ, $0.018/GB/мес (дороже хранение, дешевле доступ)\n# Cool: редкий доступ (30+ дней), $0.01/GB/мес\n# Cold: очень редкий (90+ дней), $0.0036/GB/мес\n# Archive: архив (180+ дней), $0.00099/GB/мес, извлечение за часы\n\n# Изменить tier:\naz storage blob set-tier \\\n  --account-name myappstorage123 \\\n  --container-name uploads \\\n  --name old-data.csv \\\n  --tier Cool' },
        { type: 'tip', value: 'Storage Account SKU: LRS (3 копии в одном ЦОД), ZRS (3 копии в 3 зонах), GRS (6 копий в 2 регионах), GZRS (наивысшая доступность). Для production данных минимум ZRS.' }
      ]
    },
    {
      id: 2,
      title: 'Lifecycle Management и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lifecycle Management автоматически перемещает блобы между access tiers и удаляет. Shared Access Signatures (SAS) предоставляют временный доступ к ресурсам.' },
        { type: 'code', language: 'json', value: '// Lifecycle Management Policy\n{\n  "rules": [\n    {\n      "enabled": true,\n      "name": "archive-old-data",\n      "type": "Lifecycle",\n      "definition": {\n        "actions": {\n          "baseBlob": {\n            "tierToCool": {"daysAfterModificationGreaterThan": 30},\n            "tierToArchive": {"daysAfterModificationGreaterThan": 90},\n            "delete": {"daysAfterModificationGreaterThan": 365}\n          },\n          "snapshot": {\n            "delete": {"daysAfterCreationGreaterThan": 30}\n          }\n        },\n        "filters": {\n          "blobTypes": ["blockBlob"],\n          "prefixMatch": ["logs/", "backups/"]\n        }\n      }\n    }\n  ]\n}' },
        { type: 'code', language: 'bash', value: '# Применить Lifecycle Policy:\naz storage account management-policy create \\\n  --account-name myappstorage123 \\\n  --resource-group myapp-prod-rg \\\n  --policy @lifecycle-policy.json\n\n# SAS Token — временный доступ:\naz storage blob generate-sas \\\n  --account-name myappstorage123 \\\n  --container-name uploads \\\n  --name report.csv \\\n  --permissions r \\\n  --expiry 2024-01-16T00:00:00Z \\\n  --output tsv\n# Добавить к URL: https://myappstorage123.blob.core.windows.net/uploads/report.csv?sv=...&sig=...\n\n# Immutable Storage — защита от изменения (WORM):\naz storage container immutability-policy create \\\n  --account-name myappstorage123 \\\n  --container-name compliance-data \\\n  --period 365  # Нельзя изменить/удалить 365 дней\n\n# Soft Delete — восстановление удалённых блобов:\naz storage account blob-service-properties update \\\n  --account-name myappstorage123 \\\n  --enable-delete-retention true \\\n  --delete-retention-days 14' },
        { type: 'note', value: 'Azure Storage поддерживает Microsoft Defender for Storage — обнаружение угроз (malware upload, подозрительный доступ). Включите для production storage accounts. SAS токены — основной способ предоставления временного доступа клиентам.' }
      ]
    },
    {
      id: 3,
      title: 'Azure Cosmos DB: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Cosmos DB — глобально распределённая мультимодельная NoSQL база данных. Гарантирует задержку <10 мс для чтения и <15 мс для записи при 99-м перцентиле. Поддерживает 5 API: NoSQL, MongoDB, Cassandra, Gremlin, Table.' },
        { type: 'heading', value: 'Ключевые особенности' },
        { type: 'list', value: [
          'Глобальное распределение: данные реплицируются в N регионов с переключением за секунды',
          '5 уровней консистентности: Strong, Bounded Staleness, Session, Consistent Prefix, Eventual',
          'Мульти-мастер: запись в нескольких регионах одновременно',
          'Автомасштабирование: RU/s (Request Units) масштабируются автоматически',
          'SLA 99.999% для multi-region accounts'
        ] },
        { type: 'code', language: 'bash', value: '# Создание Cosmos DB аккаунта (NoSQL API):\naz cosmosdb create \\\n  --name my-cosmos-db \\\n  --resource-group myapp-prod-rg \\\n  --default-consistency-level Session \\\n  --locations regionName=westeurope failoverPriority=0 \\\n  --locations regionName=northeurope failoverPriority=1\n\n# Создание базы данных и контейнера:\naz cosmosdb sql database create \\\n  --account-name my-cosmos-db \\\n  --resource-group myapp-prod-rg \\\n  --name mydb\n\naz cosmosdb sql container create \\\n  --account-name my-cosmos-db \\\n  --resource-group myapp-prod-rg \\\n  --database-name mydb \\\n  --name orders \\\n  --partition-key-path /customerId \\\n  --throughput 400\n\n# Request Units (RU):\n# 1 RU = чтение 1 документа 1 KB по id\n# Запись: ~5 RU за документ 1 KB\n# Запрос без индекса: 10-100+ RU\n# Autoscale: от 400 до 4000 RU/s автоматически\n\naz cosmosdb sql container throughput update \\\n  --account-name my-cosmos-db \\\n  --resource-group myapp-prod-rg \\\n  --database-name mydb \\\n  --name orders \\\n  --max-throughput 4000  # Autoscale up to 4000 RU/s' },
        { type: 'tip', value: 'Выбор partition key критичен для производительности. Хороший ключ: высокая кардинальность, равномерное распределение, часто используется в запросах (WHERE customerId = ...). Плохой: страна, дата.' }
      ]
    },
    {
      id: 4,
      title: 'Cosmos DB: работа с данными',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cosmos DB NoSQL API использует JSON документы и SQL-подобный язык запросов. SDK доступен для всех основных языков. Change Feed обеспечивает event-driven архитектуру.' },
        { type: 'code', language: 'python', value: '# Python SDK для Cosmos DB:\nfrom azure.cosmos import CosmosClient, PartitionKey\nimport os\n\nclient = CosmosClient(\n    os.environ["COSMOS_ENDPOINT"],\n    os.environ["COSMOS_KEY"]\n)\n\ndb = client.get_database_client("mydb")\ncontainer = db.get_container_client("orders")\n\n# Создание документа:\norder = {\n    "id": "order-001",\n    "customerId": "cust-123",\n    "items": [\n        {"name": "Laptop", "price": 999.99},\n        {"name": "Mouse", "price": 29.99}\n    ],\n    "total": 1029.98,\n    "status": "pending"\n}\ncontainer.create_item(body=order)\n\n# Чтение по id (1 RU):\nresult = container.read_item(\n    item="order-001",\n    partition_key="cust-123"\n)\n\n# SQL запрос:\nquery = "SELECT * FROM c WHERE c.customerId = @custId AND c.status = @status"\nitems = container.query_items(\n    query=query,\n    parameters=[\n        {"name": "@custId", "value": "cust-123"},\n        {"name": "@status", "value": "pending"}\n    ],\n    enable_cross_partition_query=False  # Эффективнее\n)\nfor item in items:\n    print(f"Order: {item[\'id\']}, Total: {item[\'total\']}")' },
        { type: 'code', language: 'bash', value: '# Change Feed — поток изменений:\n# Azure Function с Cosmos DB trigger:\n# Автоматически вызывается при каждом изменении документа\n# Используется для: event sourcing, материализованные views, \n# уведомления, синхронизация с другими хранилищами\n\n# SQL запросы в Cosmos DB:\n# SELECT c.customerId, COUNT(1) as orderCount, SUM(c.total) as totalSpent\n# FROM c\n# WHERE c.status = "completed"\n# GROUP BY c.customerId\n\n# Индексы — автоматически для всех полей по умолчанию\n# Можно оптимизировать excludedPaths для экономии RU при записи' },
        { type: 'note', value: 'Cosmos DB Free Tier: 1000 RU/s + 25 GB бесплатно навсегда (один аккаунт на подписку). Serverless mode — без провизированных RU, оплата за запрос. Подходит для dev/test и переменных нагрузок.' }
      ]
    },
    {
      id: 5,
      title: 'Azure Queue и Table Storage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Azure Storage включает Queue Storage (простые очереди сообщений) и Table Storage (NoSQL key-value). Дешёвые и простые решения для базовых задач.' },
        { type: 'code', language: 'bash', value: '# Queue Storage — простая очередь:\naz storage queue create --name tasks --account-name myappstorage123\n\n# Отправить сообщение:\naz storage message put \\\n  --queue-name tasks \\\n  --account-name myappstorage123 \\\n  --content "Process order 123"\n\n# Прочитать сообщение (не удаляет):\naz storage message peek \\\n  --queue-name tasks \\\n  --account-name myappstorage123\n\n# Получить и удалить сообщение:\naz storage message get \\\n  --queue-name tasks \\\n  --account-name myappstorage123 \\\n  --visibility-timeout 30  # Скрыть на 30 сек (время обработки)' },
        { type: 'code', language: 'python', value: '# Table Storage — NoSQL key-value:\nfrom azure.data.tables import TableServiceClient\n\nservice = TableServiceClient.from_connection_string(conn_str)\ntable = service.get_table_client("users")\n\n# Создание записи:\ntable.create_entity({\n    "PartitionKey": "department-engineering",\n    "RowKey": "user-001",\n    "Name": "John Doe",\n    "Email": "john@company.com",\n    "Role": "developer"\n})\n\n# Чтение по ключу (быстро):\nentity = table.get_entity(\n    partition_key="department-engineering",\n    row_key="user-001"\n)\n\n# Запрос (filter):\nentities = table.query_entities(\n    "PartitionKey eq \'department-engineering\' and Role eq \'developer\'"\n)' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: [
          'Queue Storage: простые задачи, дёшево ($0.004/10K операций). Для сложных — Service Bus',
          'Table Storage: простые key-value данные, дёшево. Для сложных — Cosmos DB',
          'Service Bus: enterprise messaging (topics, sessions, dead-letter, transactions)',
          'Cosmos DB: глобальная БД, сложные запросы, SLA 99.999%'
        ] },
        { type: 'tip', value: 'Azure Queue Storage vs Service Bus: Queue Storage проще и дешевле (для простых задач). Service Bus — для enterprise (гарантированная доставка, FIFO, dead-letter, sessions, дупликация). Выбор зависит от требований к надёжности.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Storage и Cosmos DB',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Azure Storage с lifecycle management и Cosmos DB с CRUD операциями.',
      requirements: [
        'Создайте Storage Account с ZRS репликацией',
        'Создайте Blob контейнер, загрузите файлы, настройте lifecycle',
        'Сгенерируйте SAS токен для временного доступа к файлу',
        'Создайте Cosmos DB аккаунт (Free Tier) с NoSQL API',
        'Создайте контейнер с partition key и добавьте документы',
        'Выполните SQL запрос по Cosmos DB данным'
      ],
      hint: 'az storage account create --sku Standard_ZRS. az cosmosdb create с --enable-free-tier. Используйте Python SDK для Cosmos DB операций.',
      expectedOutput: 'Storage Account myappstorage (ZRS) создан.\nBlob контейнер uploads с lifecycle (Cool через 30 дней).\nSAS URL работает для скачивания.\nCosmos DB my-cosmos (Free Tier) создан.\nКонтейнер orders (partition: customerId).\nSQL запрос возвращает документы.',
      solution: '# Storage Account\naz storage account create --name myappstorage123 --resource-group myapp-prod-rg \\\n  --location westeurope --sku Standard_ZRS --kind StorageV2\n\naz storage container create --name uploads --account-name myappstorage123\naz storage blob upload --account-name myappstorage123 --container-name uploads --name test.txt --file ./test.txt\n\n# Lifecycle\naz storage account management-policy create --account-name myappstorage123 \\\n  --resource-group myapp-prod-rg --policy @lifecycle.json\n\n# SAS\naz storage blob generate-sas --account-name myappstorage123 \\\n  --container-name uploads --name test.txt \\\n  --permissions r --expiry 2024-12-31 --output tsv\n\n# Cosmos DB\naz cosmosdb create --name my-cosmos-free --resource-group myapp-prod-rg \\\n  --enable-free-tier true --default-consistency-level Session\n\naz cosmosdb sql database create --account-name my-cosmos-free \\\n  --resource-group myapp-prod-rg --name mydb\n\naz cosmosdb sql container create --account-name my-cosmos-free \\\n  --resource-group myapp-prod-rg --database-name mydb \\\n  --name orders --partition-key-path /customerId --throughput 400',
      explanation: 'Azure Storage ZRS обеспечивает отказоустойчивость при потере зоны. Lifecycle автоматически оптимизирует стоимость. Cosmos DB Free Tier — 1000 RU/s бесплатно. Partition key по customerId обеспечивает равномерное распределение данных.'
    }
  ]
}
