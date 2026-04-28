export default {
  id: 4,
  title: 'AWS S3',
  description: 'Amazon S3: бакеты, объекты, версионирование, классы хранения, lifecycle policies, статический хостинг, pre-signed URLs.',
  lessons: [
    {
      id: 1,
      title: 'Основы S3: бакеты и объекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon S3 (Simple Storage Service) — объектное хранилище с неограниченной ёмкостью. Используется для файлов, бэкапов, статических сайтов, data lake. Durability: 99.999999999% (11 девяток) — потеря файла раз в 10 миллионов лет.' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'Bucket (бакет) — контейнер для объектов. Имя уникально глобально во всём AWS',
          'Object (объект) — файл + метаданные. Макс размер 5 TB. Ключ = путь к файлу',
          'Key (ключ) — полный путь к объекту (photos/2024/cat.jpg)',
          'Region — бакет создаётся в конкретном регионе, данные не покидают регион автоматически'
        ] },
        { type: 'code', language: 'bash', value: '# Создание бакета:\naws s3 mb s3://my-unique-bucket-name-2024\n\n# Загрузка файла:\naws s3 cp local-file.txt s3://my-bucket/folder/file.txt\n\n# Загрузка директории:\naws s3 cp ./build s3://my-bucket/static/ --recursive\n\n# Скачивание файла:\naws s3 cp s3://my-bucket/folder/file.txt ./downloaded.txt\n\n# Список объектов:\naws s3 ls s3://my-bucket/\naws s3 ls s3://my-bucket/folder/ --recursive\n\n# Удаление:\naws s3 rm s3://my-bucket/folder/file.txt\naws s3 rm s3://my-bucket/ --recursive  # Все объекты\n\n# Синхронизация (как rsync):\naws s3 sync ./local-folder s3://my-bucket/remote-folder\naws s3 sync s3://my-bucket/remote-folder ./local-folder' },
        { type: 'tip', value: 'Имя бакета должно быть уникальным глобально, содержать только строчные буквы, цифры, дефисы. Используйте префикс компании или проекта: company-project-env-purpose (myapp-prod-images).' }
      ]
    },
    {
      id: 2,
      title: 'Версионирование и классы хранения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Версионирование сохраняет все версии объекта, защищая от случайного удаления. Классы хранения (Storage Classes) позволяют оптимизировать стоимость в зависимости от частоты доступа.' },
        { type: 'code', language: 'bash', value: '# Включить версионирование:\naws s3api put-bucket-versioning \\\n  --bucket my-bucket \\\n  --versioning-configuration Status=Enabled\n\n# Загрузить файл дважды — обе версии сохранятся:\naws s3 cp v1.txt s3://my-bucket/config.txt\naws s3 cp v2.txt s3://my-bucket/config.txt\n\n# Посмотреть все версии:\naws s3api list-object-versions --bucket my-bucket --prefix config.txt\n\n# Восстановить предыдущую версию:\naws s3api get-object \\\n  --bucket my-bucket \\\n  --key config.txt \\\n  --version-id "abc123" \\\n  restored-config.txt' },
        { type: 'heading', value: 'Классы хранения' },
        { type: 'list', value: [
          'S3 Standard — частый доступ, $0.023/GB/мес. Для активных данных',
          'S3 Intelligent-Tiering — автоматическое перемещение между уровнями, +$0.0025/1000 объектов',
          'S3 Standard-IA (Infrequent Access) — $0.0125/GB/мес, но $0.01/GB за извлечение',
          'S3 One Zone-IA — как IA, но в одной AZ. $0.01/GB/мес. Для воспроизводимых данных',
          'S3 Glacier Instant Retrieval — архив с мгновенным доступом, $0.004/GB/мес',
          'S3 Glacier Flexible — архив, извлечение за 1-12 часов, $0.0036/GB/мес',
          'S3 Glacier Deep Archive — самый дешёвый, извлечение за 12-48 часов, $0.00099/GB/мес'
        ] },
        { type: 'note', value: 'S3 Intelligent-Tiering — лучший выбор когда паттерн доступа неизвестен. Он автоматически перемещает объекты между Standard и IA, экономя до 40% без ручной настройки.' }
      ]
    },
    {
      id: 3,
      title: 'Lifecycle Policies',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lifecycle Rules автоматически перемещают объекты между классами хранения или удаляют их по истечении заданного времени. Помогают оптимизировать стоимость хранения.' },
        { type: 'code', language: 'json', value: '{\n  "Rules": [\n    {\n      "ID": "MoveToIA",\n      "Status": "Enabled",\n      "Filter": { "Prefix": "logs/" },\n      "Transitions": [\n        {\n          "Days": 30,\n          "StorageClass": "STANDARD_IA"\n        },\n        {\n          "Days": 90,\n          "StorageClass": "GLACIER"\n        }\n      ],\n      "Expiration": {\n        "Days": 365\n      }\n    },\n    {\n      "ID": "CleanupOldVersions",\n      "Status": "Enabled",\n      "Filter": {},\n      "NoncurrentVersionTransitions": [\n        {\n          "NoncurrentDays": 30,\n          "StorageClass": "STANDARD_IA"\n        }\n      ],\n      "NoncurrentVersionExpiration": {\n        "NoncurrentDays": 90\n      }\n    }\n  ]\n}' },
        { type: 'code', language: 'bash', value: '# Применить lifecycle правило:\naws s3api put-bucket-lifecycle-configuration \\\n  --bucket my-bucket \\\n  --lifecycle-configuration file://lifecycle.json\n\n# Посмотреть текущие правила:\naws s3api get-bucket-lifecycle-configuration --bucket my-bucket\n\n# Типичный сценарий для логов:\n# День 0-30:   Standard (частый доступ для отладки)\n# День 30-90:  Standard-IA (редкий доступ)\n# День 90-365: Glacier (архив, нужен для compliance)\n# День 365+:   Удаление' },
        { type: 'tip', value: 'Lifecycle rules — один из главных инструментов оптимизации стоимости S3. Для бакетов с логами и бэкапами настройте автоматическое перемещение в Glacier и удаление. Это может сэкономить 70-90% стоимости хранения.' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность S3 и политики доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'S3 по умолчанию закрыт. Доступ контролируется через Bucket Policies (JSON), ACL, IAM Policies и Block Public Access. Неправильная настройка — частая причина утечек данных.' },
        { type: 'code', language: 'json', value: '// Bucket Policy: разрешить публичное чтение для статического сайта\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "PublicReadGetObject",\n      "Effect": "Allow",\n      "Principal": "*",\n      "Action": "s3:GetObject",\n      "Resource": "arn:aws:s3:::my-website-bucket/*"\n    }\n  ]\n}' },
        { type: 'code', language: 'bash', value: '# Заблокировать весь публичный доступ (рекомендуется!):\naws s3api put-public-access-block \\\n  --bucket my-bucket \\\n  --public-access-block-configuration \\\n    BlockPublicAcls=true,\\\n    IgnorePublicAcls=true,\\\n    BlockPublicPolicy=true,\\\n    RestrictPublicBuckets=true\n\n# Pre-signed URL — временная ссылка для доступа:\naws s3 presign s3://my-bucket/private-file.pdf --expires-in 3600\n# https://my-bucket.s3.amazonaws.com/private-file.pdf?X-Amz-Algorithm=...\n# Ссылка действительна 1 час (3600 сек)\n\n# Шифрование по умолчанию:\naws s3api put-bucket-encryption \\\n  --bucket my-bucket \\\n  --server-side-encryption-configuration \'{\n    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]\n  }\'  ' },
        { type: 'note', value: 'С апреля 2023 все новые бакеты S3 по умолчанию имеют Block Public Access включённым и шифрование SSE-S3 (AES-256). Используйте pre-signed URLs для временного доступа вместо открытия публичного доступа.' }
      ]
    },
    {
      id: 5,
      title: 'Статический хостинг на S3',
      type: 'theory',
      content: [
        { type: 'text', value: 'S3 может хостить статические сайты (HTML, CSS, JS) без серверов. В связке с CloudFront (CDN) получается быстрый и дешёвый хостинг для SPA (React, Vue, Angular).' },
        { type: 'code', language: 'bash', value: '# Включить статический хостинг:\naws s3 website s3://my-website-bucket \\\n  --index-document index.html \\\n  --error-document error.html\n\n# Загрузить файлы сайта:\naws s3 sync ./build s3://my-website-bucket \\\n  --delete \\\n  --cache-control "max-age=86400"\n\n# URL сайта:\n# http://my-website-bucket.s3-website-eu-central-1.amazonaws.com\n\n# Для production: CloudFront + S3 + Route53 + ACM\n# CloudFront — CDN (кэш по миру)\n# Route53 — DNS (your-domain.com)\n# ACM — SSL сертификат (HTTPS) бесплатно\n\n# Создание CloudFront distribution:\naws cloudfront create-distribution \\\n  --origin-domain-name my-website-bucket.s3.amazonaws.com \\\n  --default-root-object index.html' },
        { type: 'list', value: [
          'S3 Static Hosting — бесплатен (платите только за хранение и трафик)',
          'CloudFront — ускоряет доступ через 400+ edge locations по миру',
          'ACM — бесплатные SSL сертификаты для HTTPS',
          'Стоимость хостинга React SPA: ~$1-5/мес для среднего сайта'
        ] },
        { type: 'tip', value: 'Для React/Vue SPA настройте CloudFront Error Pages: 403 и 404 редиректить на /index.html с кодом 200. Это обеспечит работу client-side routing (React Router).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: работа с S3',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте S3 бакет, настройте версионирование, lifecycle и статический хостинг.',
      requirements: [
        'Создайте S3 бакет и включите версионирование',
        'Загрузите файл, обновите его, проверьте что обе версии доступны',
        'Настройте lifecycle policy: перемещение в IA через 30 дней, удаление через 365',
        'Включите шифрование по умолчанию (SSE-S3)',
        'Настройте статический хостинг и загрузите простую HTML страницу',
        'Создайте pre-signed URL для приватного файла с TTL 1 час'
      ],
      hint: 'Для статического хостинга нужно отключить Block Public Access и добавить Bucket Policy разрешающую публичное чтение. Pre-signed URL генерируется через aws s3 presign.',
      expectedOutput: 'Бакет my-test-bucket создан с версионированием.\nФайл загружен и обновлён, обе версии доступны через list-object-versions.\nLifecycle: IA через 30 дней, удаление через 365 дней.\nШифрование SSE-S3 включено по умолчанию.\nСтатический сайт доступен по URL: http://my-test-bucket.s3-website-...\nPre-signed URL: https://my-test-bucket.s3.amazonaws.com/private.pdf?X-Amz-...',
      solution: '# Создание бакета\naws s3 mb s3://my-test-bucket-unique-123\n\n# Версионирование\naws s3api put-bucket-versioning \\\n  --bucket my-test-bucket-unique-123 \\\n  --versioning-configuration Status=Enabled\n\n# Загрузка и обновление\necho "version 1" > test.txt\naws s3 cp test.txt s3://my-test-bucket-unique-123/test.txt\necho "version 2" > test.txt\naws s3 cp test.txt s3://my-test-bucket-unique-123/test.txt\n\n# Проверка версий\naws s3api list-object-versions \\\n  --bucket my-test-bucket-unique-123 --prefix test.txt\n\n# Lifecycle\ncat > lifecycle.json << \'EOF\'\n{"Rules":[{"ID":"ArchiveAndDelete","Status":"Enabled","Filter":{},\n"Transitions":[{"Days":30,"StorageClass":"STANDARD_IA"}],\n"Expiration":{"Days":365}}]}\nEOF\naws s3api put-bucket-lifecycle-configuration \\\n  --bucket my-test-bucket-unique-123 \\\n  --lifecycle-configuration file://lifecycle.json\n\n# Шифрование\naws s3api put-bucket-encryption \\\n  --bucket my-test-bucket-unique-123 \\\n  --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}\'\n\n# Статический хостинг\naws s3 website s3://my-test-bucket-unique-123 \\\n  --index-document index.html --error-document error.html\necho "<h1>Hello S3!</h1>" > index.html\naws s3 cp index.html s3://my-test-bucket-unique-123/\n\n# Pre-signed URL\naws s3 presign s3://my-test-bucket-unique-123/test.txt --expires-in 3600',
      explanation: 'S3 — фундаментальный сервис AWS. Версионирование защищает от случайного удаления. Lifecycle оптимизирует стоимость. Шифрование обязательно для compliance. Pre-signed URL даёт временный доступ без открытия бакета.'
    }
  ]
}
