export default {
  id: 14,
  title: 'GCP Cloud Storage и BigQuery',
  description: 'Объектное хранилище GCP: Cloud Storage buckets, классы хранения, data lake. BigQuery: аналитика, SQL, партиционирование.',
  lessons: [
    {
      id: 1,
      title: 'Cloud Storage: объектное хранилище',
      type: 'theory',
      content: [
        { type: 'text', value: 'Google Cloud Storage (GCS) — объектное хранилище GCP (аналог AWS S3). Единый API для всех классов хранения, автоматическое управление классами через Object Lifecycle Management.' },
        { type: 'code', language: 'bash', value: '# Создание бакета:\ngsutil mb -l europe-west1 -c standard gs://my-app-data-prod\n\n# Или через gcloud:\ngcloud storage buckets create gs://my-app-data-prod \\\n  --location=europe-west1 --default-storage-class=standard\n\n# Загрузка файлов:\ngsutil cp local-file.txt gs://my-app-data-prod/\ngsutil cp -r ./data/ gs://my-app-data-prod/data/\n\n# Синхронизация:\ngsutil rsync -r ./local-dir gs://my-app-data-prod/remote-dir\n\n# Список объектов:\ngsutil ls gs://my-app-data-prod/\ngsutil ls -l gs://my-app-data-prod/data/  # С деталями\n\n# Скачивание:\ngsutil cp gs://my-app-data-prod/data/report.csv ./\n\n# Классы хранения:\n# Standard        — $0.020/GB/мес. Частый доступ\n# Nearline        — $0.010/GB/мес. Раз в месяц (min 30 дней)\n# Coldline        — $0.004/GB/мес. Раз в квартал (min 90 дней)\n# Archive         — $0.0012/GB/мес. Раз в год (min 365 дней)\n\n# Изменить класс хранения объекта:\ngsutil rewrite -s nearline gs://my-bucket/old-data/*' },
        { type: 'tip', value: 'GCS использует uniform bucket-level access по умолчанию (рекомендуется). Autoclass автоматически перемещает объекты между классами на основе паттерна доступа — включите для оптимизации стоимости без ручной настройки.' }
      ]
    },
    {
      id: 2,
      title: 'Cloud Storage: безопасность и lifecycle',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCS контролирует доступ через IAM и ACL. Object Lifecycle Management автоматически управляет объектами: изменение класса, удаление, версионирование.' },
        { type: 'code', language: 'json', value: '// lifecycle.json — Object Lifecycle Management\n{\n  "rule": [\n    {\n      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},\n      "condition": {"age": 30, "matchesStorageClass": ["STANDARD"]}\n    },\n    {\n      "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},\n      "condition": {"age": 90, "matchesStorageClass": ["NEARLINE"]}\n    },\n    {\n      "action": {"type": "Delete"},\n      "condition": {"age": 365}\n    },\n    {\n      "action": {"type": "Delete"},\n      "condition": {"isLive": false, "numNewerVersions": 3}\n    }\n  ]\n}' },
        { type: 'code', language: 'bash', value: '# Применить lifecycle:\ngsutil lifecycle set lifecycle.json gs://my-bucket\n\n# Включить версионирование:\ngsutil versioning set on gs://my-bucket\n\n# Signed URLs (временная ссылка):\ngsutil signurl -d 1h key.json gs://my-bucket/private-file.pdf\n\n# IAM для бакета:\ngsutil iam ch user:dev@company.com:objectViewer gs://my-bucket\ngsutil iam ch serviceAccount:my-sa@project.iam.gserviceaccount.com:objectAdmin gs://my-bucket\n\n# Retention Policy (запрет удаления на N дней):\ngsutil retention set 90d gs://my-bucket\n\n# Notifications (событие при изменении):\ngsutil notification create -t my-topic -f json gs://my-bucket' },
        { type: 'note', value: 'GCS Signed URLs аналогичны S3 Pre-signed URLs. Для больших файлов используйте Resumable Uploads (gsutil по умолчанию для файлов >8 MB). Transfer Service перемещает данные из S3/Azure в GCS.' }
      ]
    },
    {
      id: 3,
      title: 'BigQuery: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'BigQuery — serverless колоночное хранилище данных для аналитики. Обрабатывает петабайты за секунды. Стандартный SQL, нет управления серверами, оплата за сканированные данные.' },
        { type: 'code', language: 'bash', value: '# Создание dataset:\nbq mk --dataset --location=EU myproject:analytics\n\n# Загрузка данных из CSV:\nbq load --autodetect --source_format=CSV \\\n  analytics.sales gs://my-bucket/data/sales.csv\n\n# Загрузка из JSON:\nbq load --autodetect --source_format=NEWLINE_DELIMITED_JSON \\\n  analytics.events gs://my-bucket/data/events.json\n\n# SQL запрос:\nbq query --use_legacy_sql=false \\\n  "SELECT date, SUM(revenue) as total\n   FROM analytics.sales\n   WHERE date >= \'2024-01-01\'\n   GROUP BY date\n   ORDER BY total DESC\n   LIMIT 10"\n\n# Стоимость:\n# Хранение: $0.02/GB/мес (active), $0.01/GB/мес (long-term >90 дней)\n# Запросы: $5/TB сканированных данных\n# Free Tier: 1 TB запросов/мес + 10 GB хранения\n\n# Оценка стоимости запроса (dry run):\nbq query --use_legacy_sql=false --dry_run \\\n  "SELECT * FROM analytics.sales WHERE date = \'2024-01-15\'"' },
        { type: 'tip', value: 'BigQuery сканирует только нужные колонки (колоночное хранилище). SELECT * сканирует ВСЕ колонки — дорого. Всегда выбирайте только нужные поля: SELECT date, revenue FROM ... . Партиционирование по дате снижает стоимость на 90%+.' }
      ]
    },
    {
      id: 4,
      title: 'BigQuery: партиционирование и оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Партиционирование и кластеризация — ключевые техники оптимизации стоимости и производительности BigQuery. Они ограничивают объём сканируемых данных.' },
        { type: 'code', language: 'bash', value: '# Создание партиционированной таблицы:\nbq mk --table \\\n  --time_partitioning_field=event_date \\\n  --time_partitioning_type=DAY \\\n  --clustering_fields=country,category \\\n  analytics.events \\\n  event_date:DATE,country:STRING,category:STRING,revenue:FLOAT64,user_id:STRING\n\n# Запрос с фильтром по партиции (сканирует только нужные дни):\nbq query --use_legacy_sql=false "\n  SELECT country, SUM(revenue) as total\n  FROM analytics.events\n  WHERE event_date BETWEEN \'2024-01-01\' AND \'2024-01-31\'  -- partition pruning!\n    AND country = \'KZ\'  -- cluster pruning!\n  GROUP BY country\n"' },
        { type: 'code', language: 'bash', value: '# External Tables — запрос данных напрямую из GCS:\nbq mk --external_table_definition=\\\n  "gs://my-bucket/data/*.parquet@PARQUET" \\\n  analytics.external_data\n\n# Materialized Views — предрассчитанные агрегаты:\nbq query --use_legacy_sql=false "\n  CREATE MATERIALIZED VIEW analytics.daily_revenue AS\n  SELECT event_date, country, SUM(revenue) as total_revenue, COUNT(*) as events\n  FROM analytics.events\n  GROUP BY event_date, country\n"\n\n# Scheduled Query — автоматические ETL:\nbq query --use_legacy_sql=false \\\n  --schedule="every 24 hours" \\\n  --display_name="daily_aggregation" \\\n  --destination_table=analytics.daily_summary "\n  SELECT CURRENT_DATE() as date, COUNT(*) as total_events\n  FROM analytics.events\n  WHERE event_date = CURRENT_DATE()\n"' },
        { type: 'note', value: 'Parquet и ORC форматы в 10-100x эффективнее CSV для аналитических запросов в BigQuery (колоночное сжатие). При загрузке данных конвертируйте CSV в Parquet через Apache Spark или pandas.' }
      ]
    },
    {
      id: 5,
      title: 'Data Lake на GCP',
      type: 'theory',
      content: [
        { type: 'text', value: 'Data Lake — централизованное хранилище для структурированных и неструктурированных данных. На GCP: Cloud Storage (хранение) + BigQuery (аналитика) + Dataflow/Dataproc (обработка).' },
        { type: 'list', value: [
          'Cloud Storage — хранилище сырых данных (logs, images, CSV, JSON, Parquet)',
          'BigQuery — SQL аналитика, BI дашборды, ML модели (BigQuery ML)',
          'Dataflow — Apache Beam для stream и batch обработки данных',
          'Dataproc — управляемый Apache Spark/Hadoop',
          'Pub/Sub — приём потоковых данных в реальном времени',
          'Data Catalog — метаданные и поиск по данным'
        ] },
        { type: 'code', language: 'bash', value: '# Типичная Data Lake архитектура:\n#\n# Sources → Pub/Sub → Dataflow → BigQuery → Looker/BI\n#              ↓\n#         Cloud Storage (raw data)\n#              ↓\n#         Dataflow/Dataproc (ETL)\n#              ↓\n#         BigQuery (analytics)\n\n# Dataflow — stream processing из Pub/Sub в BigQuery:\ngcloud dataflow jobs run my-pipeline \\\n  --gcs-location=gs://dataflow-templates/latest/PubSub_to_BigQuery \\\n  --region=europe-west1 \\\n  --parameters=\\\ninputTopic=projects/myproject/topics/events,\\\noutputTableSpec=myproject:analytics.events\n\n# BigQuery ML — ML прямо в SQL:\nbq query --use_legacy_sql=false "\n  CREATE MODEL analytics.revenue_forecast\n  OPTIONS(model_type=\'ARIMA_PLUS\', time_series_timestamp_col=\'date\',\n          time_series_data_col=\'revenue\') AS\n  SELECT date, SUM(revenue) as revenue\n  FROM analytics.sales\n  GROUP BY date\n"\n\n# Предсказание:\nbq query --use_legacy_sql=false "\n  SELECT * FROM ML.FORECAST(MODEL analytics.revenue_forecast,\n    STRUCT(30 AS horizon))\n"' },
        { type: 'tip', value: 'BigQuery ML позволяет обучать ML модели (линейная регрессия, XGBoost, ARIMA, кластеризация) прямо из SQL без знания Python/TensorFlow. Идеально для аналитиков, которые уже знают SQL.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Cloud Storage и BigQuery',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте data pipeline: загрузка данных в GCS, аналитика в BigQuery.',
      requirements: [
        'Создайте GCS бакет с lifecycle policy (Nearline через 30 дней)',
        'Загрузите CSV файл с данными в бакет',
        'Создайте BigQuery dataset и загрузите данные из GCS',
        'Создайте партиционированную таблицу по дате',
        'Выполните аналитический SQL запрос с группировкой',
        'Создайте Materialized View для агрегации'
      ],
      hint: 'gsutil mb для создания бакета. bq mk для dataset. bq load --autodetect для загрузки. Используйте --time_partitioning_field для партиционирования.',
      expectedOutput: 'Бакет gs://my-analytics-data создан с lifecycle.\nCSV загружен: gs://my-analytics-data/sales.csv\nDataset analytics создан. Таблица sales загружена.\nПартиционированная таблица events создана.\nSQL запрос: топ-10 дней по выручке.\nMaterialized View daily_revenue создан.',
      solution: '# GCS\ngsutil mb -l europe-west1 gs://my-analytics-data\ngsutil lifecycle set lifecycle.json gs://my-analytics-data\ngsutil cp sales.csv gs://my-analytics-data/\n\n# BigQuery\nbq mk --dataset --location=EU myproject:analytics\nbq load --autodetect --source_format=CSV analytics.sales gs://my-analytics-data/sales.csv\n\n# Партиционированная таблица\nbq mk --table --time_partitioning_field=event_date --time_partitioning_type=DAY \\\n  analytics.events event_date:DATE,category:STRING,revenue:FLOAT64\n\n# Аналитический запрос\nbq query --use_legacy_sql=false "\n  SELECT FORMAT_DATE(\'%Y-%m\', date) as month, SUM(amount) as total\n  FROM analytics.sales\n  GROUP BY month ORDER BY total DESC LIMIT 10\n"\n\n# Materialized View\nbq query --use_legacy_sql=false "\n  CREATE MATERIALIZED VIEW analytics.daily_revenue AS\n  SELECT event_date, SUM(revenue) as total, COUNT(*) as cnt\n  FROM analytics.events GROUP BY event_date\n"',
      explanation: 'GCS + BigQuery — основа аналитической платформы на GCP. Lifecycle оптимизирует стоимость хранения. Партиционирование сокращает объём сканируемых данных в BigQuery (и стоимость). Materialized Views ускоряют частые запросы.'
    }
  ]
}
