export default {
  id: 17,
  title: 'Управление секретами',
  description: 'HashiCorp Vault, AWS Secrets Manager, переменные окружения, ротация ключей и безопасное хранение секретов.',
  lessons: [
    {
      id: 1,
      title: 'Проблемы управления секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты (пароли, API ключи, сертификаты) — самое слабое звено безопасности. Проблемы: секреты в коде/Git, отсутствие ротации, shared credentials, нет аудита доступа к секретам.' },
        { type: 'heading', value: 'Типичные ошибки' },
        { type: 'list', value: [
          'Секреты в коде: hardcoded passwords, API keys в Git',
          'Секреты в ENV: видны через docker inspect, /proc, логи',
          '.env файлы: часто попадают в Git, расшариваются через Slack',
          'Shared credentials: один пароль на всю команду',
          'No rotation: пароли не меняются годами',
          'No audit: неизвестно кто и когда получал доступ к секрету'
        ]},
        { type: 'code', language: 'bash', value: '# === Где утекают секреты ===\n\n# 1. Git history (даже если удалили из текущей версии)\ngit log --all -p | grep -i "password\\|secret\\|api_key"\n\n# 2. Docker image layers\ndocker history myapp:latest\n# Каждый слой можно извлечь и прочитать ENV!\ndocker save myapp:latest | tar -xf - -O */layer.tar | tar -tf -\n\n# 3. Переменные окружения контейнера\ndocker inspect container_id | jq \'.[0].Config.Env\'\n# ["DB_PASSWORD=SuperSecret123", ...]\n\n# 4. Kubernetes Secrets (base64, НЕ шифрование!)\nkubectl get secret db-creds -o jsonpath=\'{.data.password}\' | base64 -d\n# Любой с правами get secrets видит пароль!\n\n# 5. Логи приложения\n# logger.info(f"Connecting to {DB_URL}")  # URL содержит пароль!\n\n# 6. Error messages\n# "Connection failed: postgresql://admin:P@ssw0rd@db:5432/app"' },
        { type: 'warning', value: 'GitHub сканирует публичные репозитории и уведомляет провайдеров при обнаружении их ключей. Но приватные ключи, самоподписанные сертификаты и пароли БД не обнаруживаются автоматически. Используйте gitleaks для проверки.' }
      ]
    },
    {
      id: 2,
      title: 'HashiCorp Vault',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vault — централизованное хранилище секретов. Основные возможности: динамические секреты (генерируются по запросу), автоматическая ротация, полный аудит доступа, шифрование как сервис.' },
        { type: 'code', language: 'bash', value: '# === HashiCorp Vault: основы ===\n\n# Запуск Vault (dev mode)\nvault server -dev\n\n# Или production (Docker)\ndocker run --cap-add=IPC_LOCK -d --name vault \\\n  -p 8200:8200 \\\n  -e VAULT_ADDR=http://0.0.0.0:8200 \\\n  hashicorp/vault:latest server\n\n# Конфигурация клиента\nexport VAULT_ADDR="http://127.0.0.1:8200"\nexport VAULT_TOKEN="your-root-token"\n\n# Запись секрета\nvault kv put secret/myapp/database \\\n  username="app_user" \\\n  password="SuperSecretPassword123"\n\n# Чтение секрета\nvault kv get secret/myapp/database\n# Key         Value\n# ---         -----\n# username    app_user\n# password    SuperSecretPassword123\n\n# Чтение конкретного поля\nvault kv get -field=password secret/myapp/database\n\n# === Политики (минимальные права) ===\nvault policy write myapp-policy - <<EOF\n# Только чтение секретов myapp\npath "secret/data/myapp/*" {\n  capabilities = ["read"]\n}\n# Запрет на всё остальное (по умолчанию deny)\nEOF\n\n# Создание токена с политикой\nvault token create -policy=myapp-policy -ttl=1h' },
        { type: 'code', language: 'python', value: '# === Vault в Python приложении ===\nimport hvac\nimport os\n\ndef get_vault_client():\n    """Подключение к Vault"""\n    client = hvac.Client(\n        url=os.environ["VAULT_ADDR"],\n        token=os.environ.get("VAULT_TOKEN"),\n    )\n    \n    # Или аутентификация через Kubernetes ServiceAccount\n    # client.auth.kubernetes.login(\n    #     role="myapp",\n    #     jwt=open("/var/run/secrets/kubernetes.io/serviceaccount/token").read()\n    # )\n    \n    if not client.is_authenticated():\n        raise Exception("Vault authentication failed")\n    return client\n\ndef get_secret(path: str, key: str) -> str:\n    """Получение секрета из Vault"""\n    client = get_vault_client()\n    response = client.secrets.kv.v2.read_secret_version(path=path)\n    return response["data"]["data"][key]\n\n# Использование\ndb_password = get_secret("myapp/database", "password")\njwt_secret = get_secret("myapp/auth", "jwt_secret")\n\n# Динамические секреты (генерируются по запросу!)\n# Vault генерирует временные credentials для PostgreSQL\ndef get_dynamic_db_credentials():\n    client = get_vault_client()\n    creds = client.secrets.database.generate_credentials("myapp-role")\n    return {\n        "username": creds["data"]["username"],  # v-myapp-abc123\n        "password": creds["data"]["password"],  # Случайный\n        "ttl": creds["lease_duration"]           # 1 час\n    }\n    # Credentials автоматически отзываются через TTL!' },
        { type: 'tip', value: 'Динамические секреты Vault — лучшая практика: каждый pod/сервис получает уникальные временные credentials, которые автоматически отзываются. Нет shared passwords, полный аудит, автоматическая ротация.' }
      ]
    },
    {
      id: 3,
      title: 'AWS Secrets Manager и альтернативы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облачные провайдеры предоставляют managed сервисы для секретов: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault. Проще в использовании чем Vault, но привязывают к провайдеру.' },
        { type: 'code', language: 'python', value: '# === AWS Secrets Manager ===\nimport boto3\nimport json\n\ndef get_aws_secret(secret_name: str, region: str = "eu-central-1") -> dict:\n    """Получение секрета из AWS Secrets Manager"""\n    client = boto3.client("secretsmanager", region_name=region)\n    \n    response = client.get_secret_value(SecretId=secret_name)\n    \n    if "SecretString" in response:\n        return json.loads(response["SecretString\"])\n    else:\n        # Binary secret\n        return response[\"SecretBinary\"]\n\n# Использование\ndb_creds = get_aws_secret(\"production/myapp/database\")\nprint(f\"DB Host: {db_creds[\'host\']}\")\nprint(f\"DB User: {db_creds[\'username\']}\")\n\n# === Автоматическая ротация ===\n# AWS Secrets Manager может автоматически ротировать:\n# - RDS пароли\n# - Redshift пароли  \n# - DocumentDB пароли\n# Настройка через Lambda функцию ротации\n\n# Terraform:\n# resource \"aws_secretsmanager_secret_rotation\" \"example\" {\n#   secret_id           = aws_secretsmanager_secret.db.id\n#   rotation_lambda_arn = aws_lambda_function.rotate.arn\n#   rotation_rules {\n#     automatically_after_days = 30\n#   }\n# }' },
        { type: 'code', language: 'yaml', value: '# === Kubernetes: External Secrets Operator ===\n# Синхронизирует секреты из AWS Secrets Manager в K8s Secrets\n\napiVersion: external-secrets.io/v1beta1\nkind: SecretStore\nmetadata:\n  name: aws-secrets\n  namespace: production\nspec:\n  provider:\n    aws:\n      service: SecretsManager\n      region: eu-central-1\n      auth:\n        jwt:\n          serviceAccountRef:\n            name: external-secrets-sa\n\n---\napiVersion: external-secrets.io/v1beta1\nkind: ExternalSecret\nmetadata:\n  name: db-credentials\n  namespace: production\nspec:\n  refreshInterval: 1h  # Обновлять каждый час\n  secretStoreRef:\n    name: aws-secrets\n  target:\n    name: db-credentials\n  data:\n    - secretKey: DB_PASSWORD\n      remoteRef:\n        key: production/myapp/database\n        property: password' },
        { type: 'tip', value: 'Для Kubernetes используйте External Secrets Operator — он синхронизирует секреты из любого хранилища (Vault, AWS SM, GCP SM) в Kubernetes Secrets. Секреты обновляются автоматически при ротации.' }
      ]
    },
    {
      id: 4,
      title: 'Ротация секретов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ротация секретов — регулярная замена паролей, ключей и сертификатов. Без ротации скомпрометированный секрет остаётся действительным бесконечно. Автоматическая ротация исключает человеческий фактор.' },
        { type: 'code', language: 'python', value: '# === Стратегии ротации ===\n\n# 1. Single-user rotation: заменить пароль, обновить во всех сервисах\n# Проблема: downtime между заменой пароля и обновлением сервисов\n\n# 2. Dual-user rotation (рекомендуется)\n# Два пользователя БД: app_user_1 и app_user_2\n# Ротируем по очереди: когда активен _1, меняем пароль _2\n# Переключаем на _2, затем меняем пароль _1\n\ndef rotate_db_password_dual_user(secret_name: str):\n    """Dual-user стратегия ротации"""\n    import boto3\n    import secrets\n    import psycopg2\n    \n    sm = boto3.client("secretsmanager\")\n    \n    # Получаем текущий секрет\n    current = json.loads(\n        sm.get_secret_value(SecretId=secret_name)[\"SecretString\"]\n    )\n    \n    # Определяем какой пользователь активен\n    active = current.get(\"active_user\", \"user_1\")\n    inactive = \"user_2\" if active == \"user_1\" else \"user_1\"\n    \n    # Генерируем новый пароль для НЕАКТИВНОГО пользователя\n    new_password = secrets.token_urlsafe(32)\n    \n    # Меняем пароль в БД\n    conn = psycopg2.connect(\n        host=current[\"host\"],\n        user=current[f\"{active}_username\"],\n        password=current[f\"{active}_password\"],\n        dbname=current[\"dbname\"]\n    )\n    cursor = conn.cursor()\n    cursor.execute(\n        f\"ALTER USER {current[f\'{inactive}_username\']} PASSWORD %s\",\n        (new_password,)\n    )\n    conn.commit()\n    \n    # Обновляем секрет: переключаем активного пользователя\n    current[f\"{inactive}_password\"] = new_password\n    current[\"active_user\"] = inactive\n    \n    sm.put_secret_value(\n        SecretId=secret_name,\n        SecretString=json.dumps(current)\n    )\n    \n    return {\"rotated\": True, \"active_user\": inactive}' },
        { type: 'heading', value: 'Рекомендации по частоте ротации' },
        { type: 'list', value: [
          'Пароли БД: каждые 30-90 дней (автоматически)',
          'API ключи: каждые 90 дней или при компрометации',
          'TLS сертификаты: каждые 90 дней (Let\'s Encrypt автоматически)',
          'SSH ключи: каждые 6-12 месяцев',
          'JWT секреты: каждые 90 дней (с grace period для старых токенов)',
          'Root/admin credentials: никогда не использовать в коде, только через Vault'
        ]},
        { type: 'warning', value: 'При подозрении на компрометацию — ротируйте ВСЕ связанные секреты НЕМЕДЛЕННО. Не только скомпрометированный ключ, но и все секреты к которым он давал доступ.' }
      ]
    },
    {
      id: 5,
      title: 'Безопасные паттерны работы с секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасное управление секретами в приложении: centralized management, injection at runtime, audit logging, encryption at rest, short-lived credentials, zero-knowledge architecture.' },
        { type: 'code', language: 'python', value: '# === Паттерн: Config class с lazy loading секретов ===\nimport os\nfrom functools import cached_property\n\nclass Config:\n    """Конфигурация с безопасной загрузкой секретов"""\n    \n    @cached_property\n    def database_url(self) -> str:\n        """Загрузка из Vault или файла секрета"""\n        # Приоритет: Vault > Secret file > ENV\n        \n        # 1. Vault\n        vault_url = os.environ.get("VAULT_ADDR\")\n        if vault_url:\n            return get_vault_secret(\"myapp/database\", \"url\")\n        \n        # 2. Docker/K8s secret file\n        secret_file = \"/run/secrets/database_url\"\n        if os.path.exists(secret_file):\n            return open(secret_file).read().strip()\n        \n        # 3. ENV (только для локальной разработки!)\n        url = os.environ.get(\"DATABASE_URL\")\n        if url:\n            return url\n        \n        raise RuntimeError(\"DATABASE_URL not configured\")\n    \n    @cached_property\n    def jwt_secret(self) -> str:\n        secret_file = \"/run/secrets/jwt_secret\"\n        if os.path.exists(secret_file):\n            return open(secret_file).read().strip()\n        return os.environ.get(\"JWT_SECRET\", \"\")\n    \n    def validate(self):\n        \"\"\"Проверка что все необходимые секреты доступны\"\"\"\n        required = [\"database_url\", \"jwt_secret\"]\n        for attr in required:\n            value = getattr(self, attr)\n            if not value:\n                raise RuntimeError(f\"{attr} is required but not set\")\n\n# === Паттерн: никогда не логировать секреты ===\nimport logging\nimport re\n\nclass SecretFilter(logging.Filter):\n    \"\"\"Фильтр для маскирования секретов в логах\"\"\"\n    PATTERNS = [\n        (r\"password[=:]\\s*\\S+\", \"password=***\"),\n        (r\"token[=:]\\s*\\S+\", \"token=***\"),\n        (r\"secret[=:]\\s*\\S+\", \"secret=***\"),\n        (r\"Bearer\\s+\\S+\", \"Bearer ***\"),\n    ]\n    \n    def filter(self, record):\n        msg = record.getMessage()\n        for pattern, replacement in self.PATTERNS:\n            msg = re.sub(pattern, replacement, msg, flags=re.IGNORECASE)\n        record.msg = msg\n        record.args = None\n        return True' },
        { type: 'tip', value: 'Никогда не логируйте секреты. Используйте secret filter в logging. При выводе URL БД маскируйте пароль. Для отладки выводите только наличие секрета (set/not set), а не его значение.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Внедрение Vault для управления секретами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте HashiCorp Vault для централизованного управления секретами приложения с политиками доступа и аудитом.',
      requirements: [
        'Запустите Vault в dev режиме и настройте KV секреты',
        'Создайте политику с минимальными правами (только чтение конкретного пути)',
        'Напишите Python/JS модуль для получения секретов из Vault',
        'Настройте аудит логирование в Vault',
        'Продемонстрируйте ротацию секрета без downtime'
      ],
      hint: 'vault server -dev, vault kv put, vault policy write, hvac (Python) или node-vault (JS). vault audit enable file.',
      expectedOutput: 'Vault запущен, KV engine v2 включён\nСекреты сохранены: database/password, auth/jwt_secret\nПолитика myapp-readonly: read-only на secret/data/myapp/*\nPython клиент: секреты получены успешно\nАудит: все запросы логируются в /var/log/vault/audit.log\nРотация: пароль обновлён, приложение переподключилось',
      solution: '#!/bin/bash\n# 1. Запуск Vault\nvault server -dev -dev-root-token-id="dev-token" &\nexport VAULT_ADDR="http://127.0.0.1:8200"\nexport VAULT_TOKEN="dev-token"\n\n# 2. Создание секретов\nvault kv put secret/myapp/database \\\n  host="db.example.com" \\\n  username="app_user" \\\n  password="$(openssl rand -base64 32)"\n\nvault kv put secret/myapp/auth \\\n  jwt_secret="$(openssl rand -hex 32)"\n\n# 3. Политика\nvault policy write myapp-readonly - <<EOF\npath "secret/data/myapp/*" {\n  capabilities = ["read"]\n}\nEOF\n\n# 4. Токен с политикой\nAPP_TOKEN=$(vault token create -policy=myapp-readonly -ttl=24h -format=json | jq -r .auth.client_token)\n\n# 5. Включение аудита\nvault audit enable file file_path=/var/log/vault/audit.log\n\n# 6. Python клиент\npython3 << \'PYTHON\'\nimport hvac\nimport os\n\nclient = hvac.Client(\n    url=os.environ["VAULT_ADDR"],\n    token=os.environ.get("APP_TOKEN", os.environ.get("VAULT_TOKEN"))\n)\n\ndb = client.secrets.kv.v2.read_secret_version(path="myapp/database")\nprint(f"DB Host: {db[\'data\'][\'data\'][\'host\']}")\nprint(f"DB User: {db[\'data\'][\'data\'][\'username\']}")\nprint("DB Password: ***") # Не логируем!\nprint("Secrets loaded successfully")\nPYTHON\n\n# 7. Ротация\nvault kv put secret/myapp/database \\\n  host="db.example.com" \\\n  username="app_user" \\\n  password="$(openssl rand -base64 32)"\necho "Password rotated successfully"',
      explanation: 'Vault централизует управление секретами: хранение в зашифрованном виде, доступ через политики (минимальные права), полный аудит, версионирование (KV v2), автоматическая ротация. Приложение получает секреты при старте через API, а не через ENV или файлы конфигурации.'
    }
  ]
}
