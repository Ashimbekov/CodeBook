export default {
  id: 29,
  title: 'HashiCorp Vault: управление секретами',
  description: 'HashiCorp Vault — централизованное управление секретами, шифрование данных и контроль доступа к чувствительной информации.',
  lessons: [
    {
      id: 1,
      title: 'Управление секретами',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Проблема управления секретами' },
        { type: 'text', value: 'Секреты (пароли, API-ключи, сертификаты, токены) — одна из главных уязвимостей. Хранение секретов в коде, переменных окружения или конфиг-файлах создаёт риски утечки. Vault решает эту проблему, предоставляя централизованное хранилище с аудитом и контролем доступа.' },
        { type: 'list', items: [
          'Секреты в Git — утечка через историю коммитов',
          'Секреты в ENV переменных — видны через /proc или docker inspect',
          'Статические пароли — не ротируются, сложно отозвать',
          'Общие учётные записи — нет аудита, кто получил доступ',
          'Vault решает все эти проблемы'
        ] },
        { type: 'heading', value: 'Возможности Vault' },
        { type: 'code', language: 'bash', value: '# Основные возможности HashiCorp Vault:\n\n# 1. Secrets Management — хранение и выдача секретов\n#    KV store, database credentials, API keys\n\n# 2. Dynamic Secrets — генерация временных учётных данных\n#    PostgreSQL user на 1 час, AWS IAM на 15 минут\n\n# 3. Encryption as a Service — шифрование данных\n#    Transit engine: encrypt/decrypt без хранения ключей\n\n# 4. Identity & Access — аутентификация и авторизация\n#    LDAP, OIDC, Kubernetes SA, AppRole\n\n# 5. PKI — управление сертификатами\n#    Выдача TLS сертификатов, CA management\n\n# 6. Audit — полный аудит доступа к секретам\n#    Кто, когда, к чему получил доступ' },
        { type: 'tip', value: 'Vault работает по принципу "всё запрещено по умолчанию". Доступ к секретам явно разрешается через политики. Каждый запрос аудитируется.' }
      ]
    },
    {
      id: 2,
      title: 'Архитектура Vault',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Установка и инициализация' },
        { type: 'text', value: 'Vault может работать в dev-режиме (для обучения) и production-режиме (с бэкендом хранения, TLS, HA). В production Vault использует Raft или Consul для хранения данных.' },
        { type: 'code', language: 'bash', value: '# Dev-режим (для обучения, данные в памяти)\nvault server -dev\n# Root Token: hvs.xxxxx\n# Unseal Key: xxxxx\n\n# Установка Vault в Kubernetes через Helm\nhelm repo add hashicorp https://helm.releases.hashicorp.com\nhelm install vault hashicorp/vault \\\n  --namespace vault \\\n  --create-namespace \\\n  --set server.ha.enabled=true \\\n  --set server.ha.replicas=3 \\\n  --set server.ha.raft.enabled=true' },
        { type: 'heading', value: 'Инициализация и Unseal' },
        { type: 'code', language: 'bash', value: '# Инициализация Vault (один раз)\nvault operator init -key-shares=5 -key-threshold=3\n# Unseal Key 1: xxxxx\n# Unseal Key 2: xxxxx\n# Unseal Key 3: xxxxx\n# Unseal Key 4: xxxxx\n# Unseal Key 5: xxxxx\n# Initial Root Token: hvs.xxxxx\n\n# Unsealing — нужно 3 из 5 ключей (threshold)\nvault operator unseal <key1>\nvault operator unseal <key2>\nvault operator unseal <key3>\n\n# Проверка статуса\nvault status\n# Sealed: false\n# HA Enabled: true\n# HA Mode: active\n\n# Автоматический unseal (production)\n# Используйте AWS KMS, Azure Key Vault или GCP KMS\n# --set server.seal.type=awskms' },
        { type: 'heading', value: 'Аутентификация' },
        { type: 'code', language: 'bash', value: '# Методы аутентификации\nvault auth list\n\n# Token (встроенный)\nvault login <token>\n\n# UserPass\nvault auth enable userpass\nvault write auth/userpass/users/admin password=secret policies=admin\nvault login -method=userpass username=admin password=secret\n\n# AppRole (для приложений)\nvault auth enable approle\nvault write auth/approle/role/myapp \\\n  token_policies="myapp-policy" \\\n  token_ttl=1h \\\n  token_max_ttl=24h\n\n# Получение RoleID и SecretID\nvault read auth/approle/role/myapp/role-id\nvault write -f auth/approle/role/myapp/secret-id\n\n# Логин через AppRole\nvault write auth/approle/login \\\n  role_id=$ROLE_ID \\\n  secret_id=$SECRET_ID' },
        { type: 'note', value: 'Shamir Secret Sharing (5 ключей, порог 3) защищает master key. Ни один человек не может unseal Vault в одиночку. В production используйте auto-unseal через облачный KMS.' }
      ]
    },
    {
      id: 3,
      title: 'KV Secrets Engine',
      type: 'theory',
      content: [
        { type: 'heading', value: 'KV Version 2' },
        { type: 'text', value: 'KV (Key-Value) Secrets Engine — основной способ хранения статических секретов в Vault. Версия 2 поддерживает версионирование, что позволяет отслеживать историю изменений и откатываться к предыдущим версиям.' },
        { type: 'code', language: 'bash', value: '# Включение KV v2 engine\nvault secrets enable -path=secret kv-v2\n\n# Запись секрета\nvault kv put secret/myapp/config \\\n  db_host=db.company.com \\\n  db_user=myapp \\\n  db_password=SuperSecret123 \\\n  api_key=sk-xxxxxxxxxxxx\n\n# Чтение секрета\nvault kv get secret/myapp/config\nvault kv get -field=db_password secret/myapp/config\nvault kv get -format=json secret/myapp/config\n\n# Обновление секрета (создаёт новую версию)\nvault kv put secret/myapp/config \\\n  db_host=db.company.com \\\n  db_user=myapp \\\n  db_password=NewPassword456 \\\n  api_key=sk-yyyyyyyyyyyy\n\n# Частичное обновление (patch)\nvault kv patch secret/myapp/config db_password=AnotherPwd789' },
        { type: 'heading', value: 'Версионирование' },
        { type: 'code', language: 'bash', value: '# Просмотр метаданных (все версии)\nvault kv metadata get secret/myapp/config\n\n# Чтение конкретной версии\nvault kv get -version=1 secret/myapp/config\nvault kv get -version=2 secret/myapp/config\n\n# Удаление версии (soft delete)\nvault kv delete -versions=3 secret/myapp/config\n\n# Восстановление версии\nvault kv undelete -versions=3 secret/myapp/config\n\n# Полное уничтожение (hard delete)\nvault kv destroy -versions=3 secret/myapp/config\n\n# Настройка максимума версий\nvault kv metadata put -max-versions=10 secret/myapp/config' },
        { type: 'heading', value: 'Политики доступа' },
        { type: 'code', language: 'bash', value: '# Создание политики (HCL формат)\nvault policy write myapp-policy - <<EOF\n# Чтение секретов приложения\npath "secret/data/myapp/*" {\n  capabilities = ["read", "list"]\n}\n\n# Запись в логи\npath "secret/data/myapp/logs" {\n  capabilities = ["create", "update"]\n}\n\n# Запрет доступа к production секретам\npath "secret/data/production/*" {\n  capabilities = ["deny"]\n}\nEOF\n\n# Просмотр политики\nvault policy read myapp-policy\n\n# Создание токена с политикой\nvault token create -policy=myapp-policy -ttl=1h' },
        { type: 'tip', value: 'Используйте иерархию путей для организации секретов: secret/team/app/env (например secret/backend/myapp/prod). Политики применяйте на уровне команды или приложения.' }
      ]
    },
    {
      id: 4,
      title: 'Dynamic Secrets',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Динамические секреты' },
        { type: 'text', value: 'Dynamic Secrets — это временные учётные данные, создаваемые по запросу. Vault генерирует уникальные credentials для каждого клиента с ограниченным TTL. После истечения TTL credentials автоматически отзываются.' },
        { type: 'code', language: 'bash', value: '# Настройка Database Secrets Engine для PostgreSQL\nvault secrets enable database\n\nvault write database/config/mydb \\\n  plugin_name=postgresql-database-plugin \\\n  allowed_roles="myapp-role" \\\n  connection_url="postgresql://{{username}}:{{password}}@db.company.com:5432/myapp?sslmode=disable" \\\n  username="vault_admin" \\\n  password="vault_admin_password"\n\n# Создание роли (шаблон для генерации пользователей)\nvault write database/roles/myapp-role \\\n  db_name=mydb \\\n  creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD \'{{password}}\' VALID UNTIL \'{{expiration}}\'; GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO \\"{{name}}\\";" \\\n  revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \\"{{name}}\\"; DROP ROLE IF EXISTS \\"{{name}}\\";" \\\n  default_ttl="1h" \\\n  max_ttl="24h"' },
        { type: 'code', language: 'bash', value: '# Получение временных credentials\nvault read database/creds/myapp-role\n# Key             Value\n# lease_id        database/creds/myapp-role/xxxx\n# lease_duration  1h\n# username        v-approle-myapp-role-xxxxx\n# password        A1B2C3D4-xxxx-yyyy-zzzz\n\n# Каждый запрос создаёт уникального пользователя!\n# Через 1 час пользователь автоматически удаляется\n\n# Продление lease\nvault lease renew database/creds/myapp-role/xxxx\n\n# Отзыв lease (немедленное удаление)\nvault lease revoke database/creds/myapp-role/xxxx\n\n# Отзыв всех lease для роли\nvault lease revoke -prefix database/creds/myapp-role' },
        { type: 'heading', value: 'AWS Dynamic Secrets' },
        { type: 'code', language: 'bash', value: '# AWS Secrets Engine — временные IAM credentials\nvault secrets enable aws\n\nvault write aws/config/root \\\n  access_key=$AWS_ACCESS_KEY \\\n  secret_key=$AWS_SECRET_KEY \\\n  region=us-east-1\n\nvault write aws/roles/s3-reader \\\n  credential_type=iam_user \\\n  policy_arns=arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess \\\n  default_ttl=1h \\\n  max_ttl=12h\n\n# Получение временных AWS credentials\nvault read aws/creds/s3-reader\n# access_key     AKIAXXXXXXXX\n# secret_key     xxxxxxxxxxxxx\n# lease_duration 1h\n# Через 1 час IAM user автоматически удаляется' },
        { type: 'warning', value: 'Dynamic secrets значительно повышают безопасность: каждый сервис получает уникальные credentials с коротким TTL. При утечке вред ограничен одним сервисом и временным окном.' }
      ]
    },
    {
      id: 5,
      title: 'Интеграция с Kubernetes',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Kubernetes Auth Method' },
        { type: 'text', value: 'Vault интегрируется с Kubernetes через ServiceAccount. Pod аутентифицируется в Vault с помощью JWT токена своего ServiceAccount и получает секреты согласно назначенной политике.' },
        { type: 'code', language: 'bash', value: '# Включение Kubernetes auth\nvault auth enable kubernetes\n\nvault write auth/kubernetes/config \\\n  kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" \\\n  token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" \\\n  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt\n\n# Создание роли для приложения\nvault write auth/kubernetes/role/myapp \\\n  bound_service_account_names=myapp \\\n  bound_service_account_namespaces=production \\\n  policies=myapp-policy \\\n  ttl=1h' },
        { type: 'heading', value: 'Vault Agent Injector' },
        { type: 'code', language: 'yaml', value: '# Pod с Vault Agent Injector — секреты через annotations\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  template:\n    metadata:\n      annotations:\n        vault.hashicorp.com/agent-inject: "true"\n        vault.hashicorp.com/role: "myapp"\n        vault.hashicorp.com/agent-inject-secret-config: "secret/data/myapp/config"\n        vault.hashicorp.com/agent-inject-template-config: |\n          {{- with secret "secret/data/myapp/config" -}}\n          export DB_HOST={{ .Data.data.db_host }}\n          export DB_USER={{ .Data.data.db_user }}\n          export DB_PASSWORD={{ .Data.data.db_password }}\n          export API_KEY={{ .Data.data.api_key }}\n          {{- end -}}\n    spec:\n      serviceAccountName: myapp\n      containers:\n        - name: app\n          image: myapp:latest\n          command: [\"/bin/sh\", \"-c\"]\n          args: [\"source /vault/secrets/config && exec python main.py\"]' },
        { type: 'heading', value: 'Vault Secrets Operator (VSO)' },
        { type: 'code', language: 'yaml', value: '# Vault Secrets Operator — синхронизация в Kubernetes Secrets\napiVersion: secrets.hashicorp.com/v1beta1\nkind: VaultAuth\nmetadata:\n  name: vault-auth\n  namespace: production\nspec:\n  method: kubernetes\n  mount: kubernetes\n  kubernetes:\n    role: myapp\n    serviceAccount: myapp\n\n---\napiVersion: secrets.hashicorp.com/v1beta1\nkind: VaultStaticSecret\nmetadata:\n  name: myapp-secrets\n  namespace: production\nspec:\n  vaultAuthRef: vault-auth\n  type: kv-v2\n  mount: secret\n  path: myapp/config\n  refreshAfter: 60s\n  destination:\n    name: myapp-secret  # Kubernetes Secret\n    create: true' },
        { type: 'tip', value: 'Vault Secrets Operator (VSO) — рекомендуемый подход для Kubernetes. Он автоматически синхронизирует Vault секреты в Kubernetes Secrets и обновляет их при изменении.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Vault',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте HashiCorp Vault для управления секретами приложения с KV engine, политиками доступа и интеграцией с Kubernetes.',
      requirements: [
        'Запустите Vault в dev-режиме и настройте KV v2 engine',
        'Сохраните секреты приложения (db_host, db_password, api_key) в KV',
        'Создайте политику, разрешающую только чтение секретов myapp',
        'Настройте Kubernetes auth method и роль для ServiceAccount',
        'Создайте Deployment с Vault Agent Injector annotations',
        'Проверьте, что секреты доступны внутри Pod в /vault/secrets/'
      ],
      hint: 'Запустите vault server -dev, затем vault kv put для секретов, vault policy write для политики, vault auth enable kubernetes для интеграции с K8s.',
      expectedOutput: 'vault kv get secret/myapp/config => db_password, api_key отображаются\nvault policy read myapp-policy => path "secret/data/myapp/*" read\nkubectl exec myapp-pod -- cat /vault/secrets/config => секреты доступны\nvault audit list => аудит включён',
      solution: '# 1. Запуск Vault dev\nvault server -dev &\nexport VAULT_ADDR=http://127.0.0.1:8200\nexport VAULT_TOKEN=root\n\n# 2. Сохранение секретов\nvault kv put secret/myapp/config \\\n  db_host=db.company.com \\\n  db_password=SuperSecret123 \\\n  api_key=sk-xxxxxxxxxxxx\n\n# 3. Политика\nvault policy write myapp-policy - <<EOF\npath "secret/data/myapp/*" {\n  capabilities = ["read", "list"]\n}\nEOF\n\n# 4. Kubernetes auth\nvault auth enable kubernetes\nvault write auth/kubernetes/config \\\n  kubernetes_host=https://kubernetes.default.svc\nvault write auth/kubernetes/role/myapp \\\n  bound_service_account_names=myapp \\\n  bound_service_account_namespaces=production \\\n  policies=myapp-policy \\\n  ttl=1h\n\n# 5. Deployment с annotations\n# vault.hashicorp.com/agent-inject: "true"\n# vault.hashicorp.com/role: "myapp"\n# vault.hashicorp.com/agent-inject-secret-config: "secret/data/myapp/config"\n\n# 6. Проверка\nkubectl exec myapp-pod -- cat /vault/secrets/config',
      explanation: 'Vault обеспечивает централизованное управление секретами с аудитом и контролем доступа. KV engine хранит статические секреты, политики ограничивают доступ, Kubernetes auth позволяет подам аутентифицироваться через ServiceAccount, а Agent Injector доставляет секреты в Pod.'
    }
  ]
}
