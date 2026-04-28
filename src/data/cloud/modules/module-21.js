export default {
  id: 21,
  title: 'Облачная безопасность',
  description: 'Безопасность в облаке: шифрование данных, управление ключами, WAF, DDoS защита, compliance, модель разделённой ответственности.',
  lessons: [
    {
      id: 1,
      title: 'Модель разделённой ответственности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Shared Responsibility Model — провайдер отвечает за безопасность облака (hardware, сеть, физическая безопасность), клиент — за безопасность В облаке (данные, IAM, конфигурация, шифрование).' },
        { type: 'list', value: [
          'Провайдер отвечает за: физическую безопасность ЦОД, hardware, hypervisor, глобальную сеть',
          'Клиент отвечает за: данные, IAM, конфигурацию сервисов, шифрование, сетевые правила',
          'Для IaaS (EC2): клиент отвечает за ОС, patching, firewall, приложение',
          'Для PaaS (Lambda): клиент отвечает за код, данные, IAM',
          'Для SaaS (Office 365): клиент отвечает за данные и учётные записи'
        ] },
        { type: 'code', language: 'bash', value: '# Наиболее частые ошибки безопасности в облаке:\n#\n# 1. Открытый S3 bucket (публичный доступ к данным)\n# 2. Утечка access keys (захардкожены в коде или в git)\n# 3. Слишком широкие IAM права (Administrator Access всем)\n# 4. Отсутствие шифрования (данные в открытом виде)\n# 5. Открытый SSH (порт 22) для 0.0.0.0/0\n# 6. Отсутствие MFA на привилегированных аккаунтах\n# 7. Устаревшие security patches на EC2/VM\n# 8. Отсутствие логирования (нет audit trail)\n\n# Проверка безопасности:\n# AWS: AWS Security Hub, GuardDuty, Inspector\n# GCP: Security Command Center\n# Azure: Microsoft Defender for Cloud\n# Multi-cloud: Prisma Cloud, Wiz, Orca Security' },
        { type: 'tip', value: 'Более 90% инцидентов безопасности в облаке вызваны ошибками конфигурации клиента, а не уязвимостями провайдера. Автоматизируйте проверки безопасности через Policy as Code (OPA, AWS Config, Azure Policy).' }
      ]
    },
    {
      id: 2,
      title: 'Шифрование данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шифрование данных at rest (в хранилище) и in transit (при передаче) — обязательное требование для production. Каждый облачный провайдер предоставляет управление ключами (KMS).' },
        { type: 'heading', value: 'At Rest vs In Transit' },
        { type: 'list', value: [
          'At Rest: данные зашифрованы в хранилище (диски, S3, RDS). AES-256',
          'In Transit: данные зашифрованы при передаче (TLS/SSL). HTTPS',
          'At Rest по умолчанию: S3 (SSE-S3), EBS, RDS, GCS, Azure Storage',
          'In Transit: всегда используйте HTTPS, TLS для внутренних соединений'
        ] },
        { type: 'code', language: 'bash', value: '# AWS KMS (Key Management Service):\n# Создание Customer Managed Key (CMK):\naws kms create-key \\\n  --description "My app encryption key" \\\n  --key-usage ENCRYPT_DECRYPT\n\n# Создание alias:\naws kms create-alias \\\n  --alias-name alias/my-app-key \\\n  --target-key-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\n\n# Шифрование данных:\naws kms encrypt \\\n  --key-id alias/my-app-key \\\n  --plaintext fileb://secret.txt \\\n  --output text --query CiphertextBlob | base64 --decode > secret.enc\n\n# Дешифровка:\naws kms decrypt \\\n  --ciphertext-blob fileb://secret.enc \\\n  --output text --query Plaintext | base64 --decode > secret.txt\n\n# S3 шифрование с CMK:\naws s3 cp file.txt s3://my-bucket/ \\\n  --sse aws:kms \\\n  --sse-kms-key-id alias/my-app-key\n\n# RDS шифрование:\naws rds create-db-instance \\\n  --storage-encrypted \\\n  --kms-key-id alias/my-app-key \\\n  # ... остальные параметры' },
        { type: 'note', value: 'AWS KMS: $1/мес за каждый CMK + $0.03/10,000 API вызовов. Используйте AWS-managed keys (бесплатно) для обычных задач. CMK — когда нужен контроль над ключом (ротация, аудит, cross-account). Automatic key rotation каждые 365 дней.' }
      ]
    },
    {
      id: 3,
      title: 'Управление секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secrets Management — безопасное хранение паролей, API ключей, сертификатов. Никогда не храните секреты в коде, env files или git. Используйте Secrets Manager или Key Vault.' },
        { type: 'code', language: 'bash', value: '# AWS Secrets Manager:\naws secretsmanager create-secret \\\n  --name prod/database/password \\\n  --secret-string "MySecurePassword123!"\n\n# Чтение секрета:\naws secretsmanager get-secret-value \\\n  --secret-id prod/database/password \\\n  --query SecretString --output text\n\n# Автоматическая ротация (Lambda вызывается по расписанию):\naws secretsmanager rotate-secret \\\n  --secret-id prod/database/password \\\n  --rotation-lambda-arn arn:aws:lambda:...:function:rotate-db-password \\\n  --rotation-rules AutomaticallyAfterDays=30\n\n# GCP Secret Manager:\ngcloud secrets create db-password\necho -n "MySecurePassword" | gcloud secrets versions add db-password --data-file=-\ngcloud secrets versions access latest --secret=db-password\n\n# Azure Key Vault:\naz keyvault create --name my-vault --resource-group myapp-prod-rg\naz keyvault secret set --vault-name my-vault --name db-password --value "MySecurePassword"\naz keyvault secret show --vault-name my-vault --name db-password --query value -o tsv' },
        { type: 'code', language: 'python', value: '# Чтение секрета из AWS Secrets Manager (Python):\nimport boto3\nimport json\n\ndef get_secret(secret_name):\n    client = boto3.client("secretsmanager")\n    response = client.get_secret_value(SecretId=secret_name)\n    return json.loads(response["SecretString"])\n\n# Использование:\ndb_creds = get_secret("prod/database/credentials")\nconnection = psycopg2.connect(\n    host=db_creds["host"],\n    user=db_creds["username"],\n    password=db_creds["password"],\n    dbname=db_creds["dbname"]\n)' },
        { type: 'tip', value: 'AWS SSM Parameter Store — бесплатная альтернатива Secrets Manager для простых случаев. Standard параметры бесплатны, SecureString шифруется KMS. Secrets Manager — для автоматической ротации и cross-account доступа.' }
      ]
    },
    {
      id: 4,
      title: 'WAF и DDoS защита',
      type: 'theory',
      content: [
        { type: 'text', value: 'WAF (Web Application Firewall) защищает от SQL injection, XSS, CSRF на уровне HTTP. DDoS защита предотвращает перегрузку инфраструктуры. Все провайдеры включают базовую DDoS защиту бесплатно.' },
        { type: 'code', language: 'bash', value: '# AWS WAF:\naws wafv2 create-web-acl \\\n  --name my-web-acl \\\n  --scope REGIONAL \\\n  --default-action Allow={} \\\n  --rules file://waf-rules.json \\\n  --visibility-config \\\n    SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=my-waf\n\n# Типичные WAF правила:\n# 1. AWS Managed Rules — готовые наборы правил:\n#    - AWSManagedRulesCommonRuleSet (SQL injection, XSS)\n#    - AWSManagedRulesSQLiRuleSet (SQL injection)\n#    - AWSManagedRulesKnownBadInputsRuleSet (Log4j, etc.)\n#    - AWSManagedRulesBotControlRuleSet (боты)\n#\n# 2. Rate Limiting — ограничение запросов:\n#    - 1000 запросов в 5 минут с одного IP\n#\n# 3. Geo Blocking — блокировка по стране:\n#    - Заблокировать трафик из определённых стран\n#\n# 4. IP Whitelist/Blacklist:\n#    - Разрешить/заблокировать конкретные IP\n\n# Привязать WAF к ALB:\naws wafv2 associate-web-acl \\\n  --web-acl-arn arn:aws:wafv2:...:webacl/my-web-acl/xxx \\\n  --resource-arn arn:aws:elasticloadbalancing:...:loadbalancer/app/my-alb/xxx\n\n# AWS Shield:\n# Standard — бесплатная DDoS защита L3/L4 (все AWS ресурсы)\n# Advanced — $3000/мес, DDoS защита L3/L4/L7, 24/7 DRT команда' },
        { type: 'note', value: 'AWS WAF стоит $5/мес за Web ACL + $1/мес за правило + $0.60/млн запросов. AWS Managed Rules бесплатны для базовых наборов. Для большинства приложений достаточно CommonRuleSet + Rate Limiting.' }
      ]
    },
    {
      id: 5,
      title: 'Compliance и аудит',
      type: 'theory',
      content: [
        { type: 'text', value: 'Compliance — соответствие нормативным требованиям (GDPR, HIPAA, PCI DSS, SOC 2, 152-ФЗ). Облачные провайдеры сертифицированы по основным стандартам, но конфигурация — ваша ответственность.' },
        { type: 'heading', value: 'Основные стандарты' },
        { type: 'list', value: [
          'GDPR — защита персональных данных (ЕС). Данные в ЕС, право на удаление',
          'HIPAA — медицинские данные (США). Шифрование, audit logs, BAA',
          'PCI DSS — данные платёжных карт. Шифрование, сегментация сети, логирование',
          'SOC 2 — контроли безопасности для SaaS. Type I/II аудит',
          '152-ФЗ — персональные данные (РФ). Хранение в РФ, уведомление РКН',
          'ISO 27001 — система управления информационной безопасностью'
        ] },
        { type: 'code', language: 'bash', value: '# AWS Config — аудит конфигурации:\n# Правило: все S3 бакеты должны быть зашифрованы\naws configservice put-config-rule \\\n  --config-rule \'{\n    "ConfigRuleName": "s3-bucket-encrypted",\n    "Source": {\n      "Owner": "AWS",\n      "SourceIdentifier": "S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"\n    }\n  }\'\n\n# AWS CloudTrail — аудит всех API вызовов:\naws cloudtrail create-trail \\\n  --name my-audit-trail \\\n  --s3-bucket-name my-audit-logs \\\n  --is-multi-region-trail \\\n  --enable-log-file-validation\n\naws cloudtrail start-logging --name my-audit-trail\n\n# Проверка compliance:\naws configservice get-compliance-summary-by-config-rule\n# COMPLIANT: 45\n# NON_COMPLIANT: 3\n\n# AWS Audit Manager — автоматизация аудита:\n# Собирает evidence для SOC 2, HIPAA, GDPR автоматически' },
        { type: 'tip', value: 'Включите CloudTrail, AWS Config и GuardDuty сразу при создании аккаунта. CloudTrail — бесплатен для Management Events. AWS Config — $0.003/оценку. GuardDuty — от $1/млн CloudTrail событий. Это базовый набор безопасности.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: безопасность облачной инфраструктуры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте безопасность облачной инфраструктуры: шифрование, секреты, WAF, аудит.',
      requirements: [
        'Создайте KMS ключ и зашифруйте S3 bucket с его помощью',
        'Создайте секрет в AWS Secrets Manager для пароля БД',
        'Напишите Python код для чтения секрета',
        'Включите CloudTrail для аудита API вызовов',
        'Настройте AWS Config правило для проверки шифрования S3',
        'Создайте WAF Web ACL с базовым набором правил'
      ],
      hint: 'aws kms create-key, aws secretsmanager create-secret, aws cloudtrail create-trail. WAF: aws wafv2 create-web-acl с managed rule group.',
      expectedOutput: 'KMS ключ создан. S3 bucket зашифрован CMK.\nСекрет db-password в Secrets Manager.\nPython код читает секрет через boto3.\nCloudTrail записывает API вызовы в S3.\nConfig rule: S3 encryption — COMPLIANT.\nWAF Web ACL с CommonRuleSet создан.',
      solution: '# KMS + S3\nKEY_ID=$(aws kms create-key --query "KeyMetadata.KeyId" --output text)\naws kms create-alias --alias-name alias/my-key --target-key-id $KEY_ID\naws s3api put-bucket-encryption --bucket my-bucket \\\n  --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms","KMSMasterKeyID":"alias/my-key"}}]}\'\n\n# Secrets Manager\naws secretsmanager create-secret --name prod/db-password --secret-string "SecurePass123"\n\n# Python: boto3.client("secretsmanager").get_secret_value(SecretId="prod/db-password")\n\n# CloudTrail\naws cloudtrail create-trail --name audit-trail --s3-bucket-name audit-logs --is-multi-region-trail\naws cloudtrail start-logging --name audit-trail\n\n# Config Rule\naws configservice put-config-rule --config-rule \'{"ConfigRuleName":"s3-encrypted","Source":{"Owner":"AWS","SourceIdentifier":"S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED"}}\'\n\n# WAF\naws wafv2 create-web-acl --name my-waf --scope REGIONAL --default-action Allow={} \\\n  --rules \'[{"Name":"AWS-Common","Priority":1,"Statement":{"ManagedRuleGroupStatement":{"VendorName":"AWS","Name":"AWSManagedRulesCommonRuleSet"}},"OverrideAction":{"None":{}},"VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"common-rules"}}]\' \\\n  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=my-waf',
      explanation: 'Многоуровневая безопасность: шифрование данных (KMS), управление секретами (Secrets Manager), аудит (CloudTrail), проверка конфигурации (Config), защита приложений (WAF). Эти компоненты обязательны для production.'
    }
  ]
}
