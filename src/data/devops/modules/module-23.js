export default {
  id: 23,
  title: 'DevSecOps',
  description: 'Безопасность в DevOps: сканирование уязвимостей, SAST/DAST, управление секретами, безопасность контейнеров.',
  lessons: [
    {
      id: 1,
      title: 'Принципы DevSecOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevSecOps интегрирует безопасность в каждый этап DevOps-процесса. Вместо проверки безопасности в конце — «Shift Left»: проверяй безопасность как можно раньше, начиная с написания кода.' },
        { type: 'heading', value: 'Shift Left Security' },
        { type: 'code', language: 'bash', value: '# Традиционный подход:\n# Code -> Build -> Test -> Deploy -> [Security Audit] -> Production\n# Проблемы: поздно, дорого исправлять, тормозит релизы\n\n# DevSecOps подход (Shift Left):\n# [Pre-commit hooks] -> Code -> [SAST] -> Build -> [SCA] -> [Container Scan]\n# -> Test -> [DAST] -> Deploy -> [Runtime Security] -> Production\n# Безопасность на КАЖДОМ этапе, автоматически' },
        { type: 'heading', value: 'Типы проверок безопасности' },
        { type: 'list', value: [
          'SAST (Static Application Security Testing) — анализ исходного кода',
          'SCA (Software Composition Analysis) — проверка зависимостей',
          'Container Scanning — уязвимости в Docker-образах',
          'DAST (Dynamic Application Security Testing) — тестирование работающего приложения',
          'Secret Scanning — поиск секретов в коде',
          'IaC Scanning — проверка Terraform/CloudFormation',
          'Runtime Security — мониторинг в продакшене'
        ] },
        { type: 'tip', value: 'Начни с малого: secret scanning + container scanning + SCA. Эти три проверки покрывают 80% типичных уязвимостей и легко интегрируются в CI/CD.' }
      ]
    },
    {
      id: 2,
      title: 'Сканирование уязвимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сканирование Docker-образов и зависимостей находит известные уязвимости (CVE). Это должно быть обязательным этапом CI/CD pipeline.' },
        { type: 'heading', value: 'Trivy — сканер уязвимостей' },
        { type: 'code', language: 'bash', value: '# Установка Trivy\nsudo apt install -y trivy\n# или через Docker\ndocker pull aquasec/trivy:latest\n\n# Сканирование Docker-образа\ntrivy image myapp:latest\ntrivy image --severity HIGH,CRITICAL myapp:latest\ntrivy image --exit-code 1 --severity CRITICAL myapp:latest  # Fail при CRITICAL\n\n# Сканирование файловой системы (зависимости)\ntrivy fs --security-checks vuln,config .\ntrivy fs --scanners vuln requirements.txt\n\n# Сканирование IaC (Terraform, Dockerfile)\ntrivy config .\ntrivy config --severity HIGH,CRITICAL ./terraform/\n\n# Пример вывода:\n# myapp:latest (ubuntu 22.04)\n# Total: 15 (HIGH: 10, CRITICAL: 5)\n# +---------+------------------+----------+-------------------+\n# | Library | Vulnerability    | Severity | Fixed Version     |\n# +---------+------------------+----------+-------------------+\n# | openssl | CVE-2024-0727    | CRITICAL | 3.0.13-0ubuntu3.1 |\n# | curl    | CVE-2024-2398    | HIGH     | 7.88.1-10ubuntu1  |' },
        { type: 'heading', value: 'Интеграция в CI/CD' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions\n- name: Scan Docker image\n  uses: aquasecurity/trivy-action@master\n  with:\n    image-ref: myapp:${{ github.sha }}\n    format: "sarif"\n    output: "trivy-results.sarif"\n    severity: "HIGH,CRITICAL"\n    exit-code: "1"\n\n- name: Upload scan results\n  uses: github/codeql-action/upload-sarif@v3\n  with:\n    sarif_file: "trivy-results.sarif"' },
        { type: 'warning', value: 'Не игнорируй CRITICAL уязвимости! Настрой CI/CD на блокировку деплоя при CRITICAL. HIGH уязвимости — план исправления в течение 30 дней. Регулярно обновляй базовые образы.' }
      ]
    },
    {
      id: 3,
      title: 'SAST и Secret Scanning',
      type: 'theory',
      content: [
        { type: 'text', value: 'SAST анализирует исходный код на уязвимости (SQL injection, XSS, hardcoded secrets). Secret Scanning находит случайно закоммиченные пароли, ключи и токены.' },
        { type: 'heading', value: 'SonarQube — SAST' },
        { type: 'code', language: 'bash', value: '# Запуск SonarQube\ndocker run -d --name sonarqube \\\n  -p 9000:9000 \\\n  sonarqube:community\n\n# Анализ проекта\n# Установка sonar-scanner\nsonar-scanner \\\n  -Dsonar.projectKey=myapp \\\n  -Dsonar.sources=. \\\n  -Dsonar.host.url=http://localhost:9000 \\\n  -Dsonar.login=$SONAR_TOKEN\n\n# SonarQube находит:\n# - SQL Injection\n# - Cross-Site Scripting (XSS)\n# - Hard-coded credentials\n# - Code smells\n# - Duplicated code\n# - Security hotspots' },
        { type: 'heading', value: 'Secret Scanning' },
        { type: 'code', language: 'bash', value: '# gitleaks — поиск секретов в Git-репозитории\ndocker run --rm -v $(pwd):/repo zricethezav/gitleaks:latest detect --source /repo\n\n# truffleHog — поиск секретов в истории Git\npip install trufflehog\ntrufflehog git file://./\n\n# Pre-commit hook для проверки секретов\n# .pre-commit-config.yaml\n# repos:\n#   - repo: https://github.com/gitleaks/gitleaks\n#     rev: v8.18.0\n#     hooks:\n#       - id: gitleaks\n\n# Типичные секреты которые находят:\n# AWS Access Keys:     AKIA...\n# GitHub Tokens:       ghp_...\n# Private Keys:        -----BEGIN RSA PRIVATE KEY-----\n# Database URLs:       postgresql://user:password@host\n# API Keys:            sk-..., api_key=...\n\n# GitHub Actions\n- name: Secret Scanning\n  uses: gitleaks/gitleaks-action@v2\n  env:\n    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}' },
        { type: 'tip', value: 'Если секрет уже попал в Git историю — считай его скомпрометированным! Нельзя просто удалить коммит — он останется в истории. Немедленно ротируй (замени) скомпрометированный секрет.' }
      ]
    },
    {
      id: 4,
      title: 'Управление секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты (пароли, ключи, токены) должны храниться безопасно, а не в коде или переменных окружения. Специализированные инструменты обеспечивают шифрование, аудит и ротацию.' },
        { type: 'heading', value: 'HashiCorp Vault' },
        { type: 'code', language: 'bash', value: '# Запуск Vault\ndocker run -d --name vault \\\n  -p 8200:8200 \\\n  -e VAULT_DEV_ROOT_TOKEN_ID=root \\\n  hashicorp/vault\n\n# Настройка CLI\nexport VAULT_ADDR=http://localhost:8200\nexport VAULT_TOKEN=root\n\n# Запись секрета\nvault kv put secret/myapp/production \\\n  db_password=supersecret \\\n  api_key=abc123\n\n# Чтение секрета\nvault kv get secret/myapp/production\nvault kv get -field=db_password secret/myapp/production\n\n# Динамические секреты (генерируются на лету)\nvault secrets enable database\nvault write database/config/mydb \\\n  plugin_name=postgresql-database-plugin \\\n  connection_url="postgresql://admin:pass@db:5432/myapp"\n\nvault read database/creds/readonly\n# username: v-root-readonly-abc123\n# password: generated-password-456\n# Автоматически создаёт временного пользователя БД!' },
        { type: 'heading', value: 'AWS Secrets Manager / Parameter Store' },
        { type: 'code', language: 'bash', value: '# AWS Secrets Manager\naws secretsmanager create-secret \\\n  --name production/db-password \\\n  --secret-string "supersecret"\n\naws secretsmanager get-secret-value \\\n  --secret-id production/db-password\n\n# AWS Parameter Store (SSM)\naws ssm put-parameter \\\n  --name "/app/production/db-password" \\\n  --value "supersecret" \\\n  --type SecureString\n\naws ssm get-parameter \\\n  --name "/app/production/db-password" \\\n  --with-decryption\n\n# Использование в ECS Task Definition:\n# "secrets": [{\n#   "name": "DB_PASSWORD",\n#   "valueFrom": "arn:aws:ssm:us-east-1:123456:parameter/app/production/db-password"\n# }]' },
        { type: 'note', value: 'Иерархия управления секретами: 1) .env файлы (только dev), 2) CI/CD секреты (GitHub/GitLab), 3) AWS Parameter Store (простой), 4) AWS Secrets Manager (ротация), 5) HashiCorp Vault (продвинутый). Выбирай по сложности проекта.' }
      ]
    },
    {
      id: 5,
      title: 'Безопасность контейнеров и инфраструктуры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность контейнеров включает: минимальные образы, non-root пользователи, read-only файловая система, ограничение capabilities, сканирование на уязвимости.' },
        { type: 'heading', value: 'Hardening Docker' },
        { type: 'code', language: 'dockerfile', value: '# Безопасный Dockerfile\nFROM python:3.11-slim-bookworm AS builder\nWORKDIR /build\nCOPY requirements.txt .\nRUN pip install --user --no-cache-dir -r requirements.txt\n\nFROM python:3.11-slim-bookworm\n# Non-root пользователь\nRUN groupadd -r appuser && useradd -r -g appuser appuser\nWORKDIR /app\nCOPY --from=builder /root/.local /home/appuser/.local\nCOPY --chown=appuser:appuser . .\n\n# Минимальные права\nRUN chmod -R 555 /app\nENV PATH=/home/appuser/.local/bin:$PATH\n\nUSER appuser\nEXPOSE 8080\nHEALTHCHECK CMD curl -f http://localhost:8080/health || exit 1\nCMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]' },
        { type: 'code', language: 'bash', value: '# Запуск с максимальными ограничениями\ndocker run -d \\\n  --name myapp \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --security-opt=no-new-privileges:true \\\n  --cap-drop=ALL \\\n  --cap-add=NET_BIND_SERVICE \\\n  --memory=256m \\\n  --cpus=0.5 \\\n  --pids-limit=100 \\\n  --user 1000:1000 \\\n  myapp:latest' },
        { type: 'heading', value: 'IaC Security Scanning' },
        { type: 'code', language: 'bash', value: '# Checkov — сканер IaC\npip install checkov\ncheckov -d ./terraform/\ncheckov -f Dockerfile\ncheckov --framework kubernetes -d ./k8s/\n\n# tfsec — специализированный для Terraform\ndocker run --rm -v $(pwd):/src aquasec/tfsec /src\n\n# Типичные находки:\n# - S3 bucket без шифрования\n# - Security Group с 0.0.0.0/0\n# - RDS без Multi-AZ\n# - EC2 без IMDSv2\n# - Kubernetes pod с root привилегиями' },
        { type: 'warning', value: 'Контейнер с --privileged или с монтированным Docker socket имеет root-доступ к хосту. Это эквивалентно полному контролю над сервером. Никогда не давай контейнерам избыточные привилегии.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Security Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавьте проверки безопасности в CI/CD pipeline.',
      requirements: [
        'Добавьте Trivy для сканирования Docker-образа на уязвимости',
        'Добавьте gitleaks для поиска секретов в коде',
        'Создайте безопасный Dockerfile (non-root, minimal image)',
        'Настройте блокировку деплоя при CRITICAL уязвимостях',
        'Добавьте проверку Terraform конфигурации через checkov',
        'Создайте политику: какие уязвимости блокируют деплой'
      ],
      hint: 'trivy image --exit-code 1 --severity CRITICAL. gitleaks detect. FROM slim + USER appuser. checkov -d ./terraform/.',
      expectedOutput: 'Trivy: 0 CRITICAL уязвимостей (pipeline проходит)\ngitleaks: 0 секретов найдено\nDockerfile: non-root, slim image, HEALTHCHECK\nCI блокирует деплой при CRITICAL\ncheckov: IaC соответствует best practices\nПолитика: CRITICAL=block, HIGH=warn, MEDIUM=info',
      solution: '# .github/workflows/security.yml\n# name: Security Pipeline\n# on: [push, pull_request]\n# jobs:\n#   secret-scan:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#         with: { fetch-depth: 0 }\n#       - uses: gitleaks/gitleaks-action@v2\n#\n#   container-scan:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#       - run: docker build -t myapp:test .\n#       - name: Trivy scan\n#         uses: aquasecurity/trivy-action@master\n#         with:\n#           image-ref: myapp:test\n#           exit-code: "1"\n#           severity: "CRITICAL"\n#\n#   iac-scan:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#       - name: Checkov\n#         uses: bridgecrewio/checkov-action@master\n#         with:\n#           directory: ./terraform/\n#           soft_fail: false\n\n# Безопасный Dockerfile:\n# FROM python:3.11-slim\n# RUN useradd -r appuser\n# WORKDIR /app\n# COPY --chown=appuser:appuser . .\n# USER appuser\n# CMD ["gunicorn", "app:app"]',
      explanation: 'Security Pipeline проверяет: 1) gitleaks — нет секретов в коде, 2) Trivy — нет критических уязвимостей в образе, 3) checkov — IaC соответствует best practices. exit-code: 1 заставляет pipeline упасть при обнаружении проблемы. Это блокирует деплой небезопасного кода.'
    }
  ]
}
