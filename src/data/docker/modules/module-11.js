export default {
  id: 11,
  title: 'Безопасность Docker',
  description: 'Запуск контейнеров от non-root пользователя, Docker secrets, сканирование образов на уязвимости, ограничение capabilities, read-only файловые системы.',
  lessons: [
    {
      id: 1,
      title: 'Запуск от non-root пользователя',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию процессы в контейнере запускаются от root. Это значит что при побеге из контейнера атакующий получает root на хосте. Всегда запускай приложения от непривилегированного пользователя.' },
        { type: 'code', language: 'bash', value: '# Проверить от кого запускается контейнер:\ndocker run ubuntu whoami\n# root — плохо!\n\n# Запустить от другого пользователя:\ndocker run -u 1000:1000 ubuntu whoami\n# (uid не имеет имени, но не root)\n\n# В Dockerfile — правильный подход:\n# FROM node:18-alpine\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm ci\n# COPY . .\n# USER node  # node:18-alpine имеет встроенного пользователя node\n# CMD ["node", "server.js"]' },
        { type: 'code', language: 'bash', value: '# Создать пользователя в Dockerfile:\n# FROM ubuntu:22.04\n# RUN groupadd -r appgroup && useradd -r -g appgroup appuser\n# WORKDIR /app\n# COPY --chown=appuser:appgroup . .\n# USER appuser\n# CMD ["./myapp"]\n\n# --chown: важно! Файлы должны принадлежать пользователю\n\n# Проблема с портами < 1024:\n# non-root не может bind на порты < 1024\n# Решения:\n# 1. Использовать порт > 1024 (3000, 8080)\n# 2. setcap cap_net_bind_service (для бинарников)\n# 3. Запустить как root -> drop privileges\n\n# Проверить от кого запущен контейнер:\ndocker inspect mycontainer --format "{{.Config.User}}"\n# 1000:1000 или node или пусто (= root)\n\n# Запрет на root в docker run:\ndocker run --user 1000:1000 myapp\n\n# Проверить что root запрещён:\ndocker run --user 0 myapp  # Если требуется non-root — должно падать' },
        { type: 'warning', value: 'Никогда не запускай production контейнеры от root без крайней необходимости. Если приложению нужны root привилегии для инициализации (bind port 80), используй паттерн: entrypoint от root -> setuid на обычного пользователя.' }
      ]
    },
    {
      id: 2,
      title: 'Ограничение capabilities',
      type: 'theory',
      content: [
        { type: 'text', value: 'Linux capabilities разделяют привилегии root на отдельные права. Docker по умолчанию даёт контейнерам ограниченный набор capabilities. Для production: удали все capabilities и добавляй только необходимые.' },
        { type: 'code', language: 'bash', value: '# Capabilities по умолчанию в Docker (неполный список):\n# CAP_CHOWN        — менять владельца файлов\n# CAP_DAC_OVERRIDE — обходить проверки файловых разрешений\n# CAP_NET_BIND_SERVICE — bind портов < 1024\n# CAP_SETUID/SETGID — менять UID/GID\n# И другие...\n\n# Запустить без ВСЕХ capabilities:\ndocker run --cap-drop ALL nginx\n\n# Добавить только нужные:\ndocker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx\n\n# Пример для nginx (только bind port):\ndocker run \\\n  --cap-drop ALL \\\n  --cap-add NET_BIND_SERVICE \\\n  --cap-add CHOWN \\\n  -p 80:80 \\\n  nginx\n\n# --privileged — ОПАСНО! Даёт ВСЕ capabilities:\ndocker run --privileged ubuntu  # Почти как root на хосте!\n# Только для: docker-in-docker, низкоуровневые инструменты\n\n# Проверить capabilities контейнера:\ndocker inspect mycontainer | grep -A 10 CapAdd\n\n# Посмотреть capabilities процесса внутри:\ndocker exec mycontainer cat /proc/1/status | grep Cap\n# CapPrm: 00000000a80425fb\n# capsh --decode=00000000a80425fb — декодировать' },
        { type: 'tip', value: 'Принцип минимальных привилегий: начни с --cap-drop ALL и добавляй capabilities по одной. Это требует тестирования но значительно уменьшает attack surface. Большинству web-приложений нужны только: NET_BIND_SERVICE (если порт < 1024) или вообще ничего.' }
      ]
    },
    {
      id: 3,
      title: 'Read-only файловая система и seccomp',
      type: 'theory',
      content: [
        { type: 'text', value: 'Read-only файловая система предотвращает запись в образ контейнера. Seccomp (secure computing) ограничивает системные вызовы которые может делать контейнер. Оба механизма уменьшают attack surface.' },
        { type: 'code', language: 'bash', value: '# Read-only файловая система:\ndocker run --read-only nginx\n# Ошибка: nginx пытается писать в /var/cache/nginx!\n\n# Решение: tmpfs для временных файлов:\ndocker run \\\n  --read-only \\\n  --tmpfs /var/cache/nginx:size=100m \\\n  --tmpfs /var/run:size=10m \\\n  --tmpfs /tmp:size=50m \\\n  -p 80:80 \\\n  nginx\n\n# В Compose:\n# services:\n#   nginx:\n#     image: nginx\n#     read_only: true\n#     tmpfs:\n#       - /var/cache/nginx\n#       - /var/run\n#       - /tmp\n\n# Seccomp профили:\n# По умолчанию Docker использует seccomp профиль который блокирует ~300 вызовов\n# Например: kexec_load, mount, pivot_root, etc.\n\n# Запустить без seccomp (не рекомендуется):\ndocker run --security-opt seccomp=unconfined ubuntu\n\n# Использовать кастомный профиль:\ndocker run --security-opt seccomp=/path/to/profile.json ubuntu\n\n# AppArmor профили (Ubuntu/Debian):\ndocker run --security-opt apparmor=docker-default nginx\n\n# no-new-privileges — запрет на получение привилегий:\ndocker run --security-opt no-new-privileges ubuntu\n# Предотвращает setuid бинарники от повышения привилегий\n\n# Комплексный безопасный запуск:\ndocker run \\\n  --user 1000:1000 \\\n  --cap-drop ALL \\\n  --read-only \\\n  --tmpfs /tmp:size=50m \\\n  --security-opt no-new-privileges \\\n  --security-opt seccomp=/etc/docker/seccomp.json \\\n  myapp:latest' }
      ]
    },
    {
      id: 4,
      title: 'Сканирование образов на уязвимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Образы могут содержать уязвимые версии библиотек и системных пакетов. Инструменты сканирования: Trivy (рекомендуется), Snyk, Grype. Сканируй в CI/CD перед деплоем.' },
        { type: 'code', language: 'bash', value: '# TRIVY — самый популярный сканер:\n# Установка:\nbrew install aquasecurity/trivy/trivy  # macOS\ncurl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -\n\n# Сканировать образ:\ntrivy image nginx:latest\n# 2024-01-15T10:00:00.000+0000  INFO  Detected OS: debian\n# nginx:latest (debian 12.2)\n# Total: 15 (UNKNOWN: 0, LOW: 5, MEDIUM: 8, HIGH: 2, CRITICAL: 0)\n# +------------+------------------+----------+\n# | LIBRARY    | VULNERABILITY ID | SEVERITY |\n# +------------+------------------+----------+\n# | openssl    | CVE-2024-0727    | HIGH     |\n\n# Только HIGH и CRITICAL:\ntrivy image --severity HIGH,CRITICAL nginx:latest\n\n# Сканировать локально собранный образ:\ntrivy image myapp:latest\n\n# Сканировать и завалить CI если есть CRITICAL:\ntrivy image --exit-code 1 --severity CRITICAL myapp:latest\n# exit code 1 = нашёл CRITICAL -> CI/CD pipeline упадёт\n\n# Сканировать Dockerfile:\ntrivy config Dockerfile\n\n# Сканировать docker-compose.yml:\ntrivy config docker-compose.yml\n\n# Игнорировать CVE (если false positive или нет исправления):\ntrivy image --ignorefile .trivyignore myapp:latest\n# .trivyignore:\n# CVE-2019-8457\n# CVE-2022-1234  # false positive, не применимо к нашему коду\n\n# Snyk сканирование:\nsnyk container test myapp:latest\nsnyk container monitor myapp:latest  # Непрерывный мониторинг' },
        { type: 'code', language: 'bash', value: '# Интеграция в CI/CD (GitHub Actions):\n# - name: Scan image\n#   uses: aquasecurity/trivy-action@master\n#   with:\n#     image-ref: myapp:latest\n#     format: sarif\n#     output: trivy-results.sarif\n#     severity: CRITICAL,HIGH\n#     exit-code: "1"\n\n# Стратегии снижения уязвимостей:\n# 1. Используй minimal base образы:\n#    ubuntu:22.04 (300+ пакетов) vs alpine (15 пакетов) vs distroless (0 shell)\n#    debian:bullseye-slim vs debian:bullseye\n#\n# 2. Регулярно обновляй базовый образ:\n#    FROM python:3.11-alpine  # Указывай точную версию\n#    Trivy в CI -> автоматически обновляй при новых CVE\n#\n# 3. Multi-stage builds:\n#    В runtime образе только бинарник, не build tools\n#    Меньше пакетов = меньше уязвимостей' },
        { type: 'tip', value: 'Используй distroless образы (gcr.io/distroless) для минимальной attack surface. В них нет shell, package manager и лишних утилит. Атакующий даже если проникнет в контейнер — не сможет запустить bash.' }
      ]
    },
    {
      id: 5,
      title: 'Docker secrets и управление секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты никогда не должны быть в Dockerfile, docker-compose.yml или environment переменных (они видны в docker inspect). Используй Docker secrets, Vault, AWS Secrets Manager или как минимум .env файлы вне репозитория.' },
        { type: 'code', language: 'bash', value: '# АНТИПАТТЕРН — секреты в образе:\n# FROM ubuntu\n# ENV DB_PASSWORD=secretpassword123  # ПЛОХО! Видно в docker inspect и docker history\n# RUN echo ${DB_PASSWORD} > /etc/password  # Остаётся в слое!\n\n# ПЛОХО:\ndocker inspect mycontainer --format "{{.Config.Env}}"\n# [DB_PASSWORD=secretpassword123]  # Виден всем!\n\n# ПРАВИЛЬНО — Docker secrets (Swarm или Compose):\n# Swarm secrets:\necho "secretpassword123" | docker secret create db_password -\ndocker service create \\\n  --name app \\\n  --secret db_password \\\n  myapp\n# Секрет доступен как /run/secrets/db_password\n\n# ПРАВИЛЬНО — переменная из файла:\ndocker run \\\n  -e DB_PASSWORD_FILE=/run/secrets/db_password \\\n  -v /path/to/secret:/run/secrets/db_password:ro \\\n  myapp\n# Приложение читает файл, не переменную\n\n# ПРАВИЛЬНО — использовать tmpfs для секретов:\ndocker run \\\n  --tmpfs /run/secrets:size=1m \\\n  myapp\n# Записать секрет в tmpfs при запуске\n\n# HashiCorp Vault — для enterprise:\n# Приложение само получает секреты из Vault при старте\n# Секреты не хранятся нигде в Docker\n\n# AWS Secrets Manager:\naws secretsmanager get-secret-value \\\n  --secret-id db/password \\\n  --query SecretString \\\n  --output text' },
        { type: 'warning', value: 'docker history показывает все слои включая RUN команды. Если ты когда-либо записал секрет в RUN ENV — он в истории образа навсегда. Единственное решение: пересобрать образ без секрета. Никогда не передавай секреты через ARG или ENV в Dockerfile.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Hardening контейнера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Применить лучшие практики безопасности к Docker образу и запуску.',
      requirements: [
        'Создай Dockerfile для Python приложения с non-root пользователем (appuser)',
        'Добавь --cap-drop ALL в docker run и убедись что приложение работает',
        'Запусти с --read-only и настрой tmpfs для необходимых записываемых директорий',
        'Просканируй образ с помощью trivy и исправь уязвимости (обнови базовый образ)',
        'Убедись что секреты не хранятся в ENV и не видны в docker inspect',
        'Добавь --security-opt no-new-privileges'
      ],
      hint: 'RUN useradd -r -u 1001 appuser && USER appuser. --cap-drop ALL --cap-add только нужные. --read-only + --tmpfs для /tmp. trivy image myapp:latest для сканирования.',
      expectedOutput: 'docker run --rm myapp-secure whoami:\nappuser\n\ncurl http://localhost:8080/health:\n{"status": "healthy"}\n\ntrivy image myapp-secure:latest:\nTotal: 2 (CRITICAL: 0, HIGH: 1) — низкое число уязвимостей.\n\ndocker inspect secure-app --format "{{.Config.Env}}":\n[PATH=/usr/local/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin] — пароли отсутствуют.\n\ndocker exec secure-app cat /proc/1/status | grep CapEff:\nCapEff: 0000000000000000',
      solution: '# Dockerfile.secure:\n# FROM python:3.11-alpine\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt && \\\\\n#     addgroup -S appgroup && \\\\\n#     adduser -S -G appgroup appuser && \\\\\n#     chown -R appuser:appgroup /app\n# COPY --chown=appuser:appgroup . .\n# USER appuser\n# EXPOSE 8080\n# CMD ["python", "app.py"]\n\ndocker build -t myapp-secure:latest -f Dockerfile.secure .\n\n# Проверить пользователя:\ndocker run --rm myapp-secure whoami\n# appuser\n\n# Запустить безопасно:\ndocker run -d \\\n  --name secure-app \\\n  --user appuser \\\n  --cap-drop ALL \\\n  --read-only \\\n  --tmpfs /tmp:size=50m,noexec \\\n  --tmpfs /var/run:size=10m \\\n  --security-opt no-new-privileges \\\n  -p 8080:8080 \\\n  myapp-secure:latest\n\n# Проверить что работает:\ncurl http://localhost:8080/health\n\n# Сканирование:\ntrivy image myapp-secure:latest\n# Если есть HIGH/CRITICAL — обновить базовый образ:\n# FROM python:3.11-alpine  ->  FROM python:3.12-alpine\n\n# Проверить что нет секретов в inspect:\ndocker inspect secure-app --format "{{.Config.Env}}"\n# [PATH=/usr/local/bin:...] — нет секретов!\n\n# Проверить capabilities:\ndocker exec secure-app cat /proc/1/status | grep CapEff\n# CapEff: 0000000000000000  — нет capabilities!',
      explanation: 'Defense in depth: non-root пользователь + cap-drop + read-only + no-new-privileges — несколько слоёв защиты. Даже если один механизм обойдён — другие остаются. Alpine/slim образы меньше уязвимостей. Регулярное сканирование в CI/CD — обязательно для production. Принцип: привилегий как можно меньше.'
    }
  ]
}
