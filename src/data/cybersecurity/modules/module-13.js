export default {
  id: 13,
  title: 'Безопасность Docker и контейнеров',
  description: 'Сканирование образов, runtime security, управление секретами в контейнерах, rootless Docker и best practices.',
  lessons: [
    {
      id: 1,
      title: 'Угрозы безопасности контейнеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнеры разделяют ядро хостовой ОС — это создаёт уникальные риски. Основные угрозы: уязвимые образы, container escape (побег из контейнера), небезопасные runtime конфигурации, утечка секретов.' },
        { type: 'heading', value: 'Основные угрозы' },
        { type: 'list', value: [
          'Уязвимые базовые образы (устаревшие пакеты, CVE)',
          'Запуск от root (повышение привилегий при escape)',
          'Чувствительные данные в образе (секреты в ENV, файлах)',
          'Привилегированный режим (--privileged = полный доступ к хосту)',
          'Монтирование Docker socket (/var/run/docker.sock)',
          'Отсутствие ограничения ресурсов (CPU, RAM, PID)'
        ]},
        { type: 'code', language: 'bash', value: '# === Опасные конфигурации ===\n\n# ОПАСНО: привилегированный режим\ndocker run --privileged myimage\n# Контейнер получает ВСЕ capabilities, доступ к устройствам хоста!\n\n# ОПАСНО: монтирование Docker socket\ndocker run -v /var/run/docker.sock:/var/run/docker.sock myimage\n# Контейнер может управлять Docker = полный контроль над хостом!\n\n# ОПАСНО: запуск от root без ограничений\ndocker run --user root --cap-add ALL myimage\n\n# ОПАСНО: host network\ndocker run --network host myimage\n# Контейнер видит все сетевые интерфейсы хоста!\n\n# ОПАСНО: монтирование чувствительных путей\ndocker run -v /etc:/host-etc myimage\n# Контейнер имеет доступ к /etc/shadow хоста!' },
        { type: 'warning', value: 'Никогда не используйте --privileged в production. Монтирование Docker socket даёт контейнеру контроль над всем хостом. Даже root внутри контейнера может быть опасен при неправильной конфигурации.' }
      ]
    },
    {
      id: 2,
      title: 'Безопасный Dockerfile',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dockerfile определяет содержимое образа. Безопасный Dockerfile: минимальный базовый образ, non-root пользователь, multi-stage сборка, фиксированные версии зависимостей, отсутствие секретов.' },
        { type: 'code', language: 'bash', value: '# === Безопасный Dockerfile ===\n\n# 1. Минимальный базовый образ с фиксированной версией\nFROM node:20.11.1-alpine3.19 AS builder\n# Alpine: ~5MB vs Ubuntu ~77MB, меньше пакетов = меньше уязвимостей\n# НЕ используйте :latest — результат непредсказуем!\n\n# 2. Создаём non-root пользователя\nRUN addgroup -g 1001 appgroup && \\\n    adduser -u 1001 -G appgroup -D appuser\n\nWORKDIR /app\n\n# 3. Копируем зависимости отдельно (кэширование слоёв)\nCOPY package*.json ./\nRUN npm ci --only=production && \\\n    npm cache clean --force\n\n# 4. Multi-stage: финальный образ без dev-зависимостей\nFROM node:20.11.1-alpine3.19\n\nRUN addgroup -g 1001 appgroup && \\\n    adduser -u 1001 -G appgroup -D appuser\n\nWORKDIR /app\n\n# Копируем только production артефакты\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --chown=appuser:appgroup . .\n\n# 5. Переключаемся на non-root\nUSER appuser\n\n# 6. Ограничиваем capabilities\n# (при запуске: docker run --cap-drop ALL --cap-add NET_BIND_SERVICE)\n\n# 7. Read-only файловая система\n# (при запуске: docker run --read-only --tmpfs /tmp)\n\n# 8. Health check\nHEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n  CMD wget -q --spider http://localhost:3000/health || exit 1\n\nEXPOSE 3000\nCMD ["node", "server.js"]' },
        { type: 'tip', value: 'Используйте multi-stage builds для уменьшения образа и удаления инструментов сборки. distroless образы (gcr.io/distroless) — ещё безопаснее Alpine: содержат только runtime, без shell и пакетного менеджера.' }
      ]
    },
    {
      id: 3,
      title: 'Сканирование образов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сканирование образов обнаруживает уязвимости (CVE) в установленных пакетах. Инструменты: Trivy, Grype, Docker Scout, Snyk Container. Сканирование должно быть частью CI/CD пайплайна.' },
        { type: 'code', language: 'bash', value: '# === Trivy: сканирование образов ===\n\n# Установка\ncurl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh\n\n# Сканирование образа\ntrivy image myapp:latest\n\n# Только Critical и High уязвимости\ntrivy image --severity CRITICAL,HIGH myapp:latest\n\n# Сканирование с exit code (для CI/CD)\ntrivy image --exit-code 1 --severity CRITICAL myapp:latest\n# Exit code 1 если найдены CRITICAL — pipeline fails\n\n# Сканирование Dockerfile (misconfigurations)\ntrivy config Dockerfile\n\n# Пример вывода:\n# myapp:latest (alpine 3.19)\n# ================================\n# Total: 3 (HIGH: 2, CRITICAL: 1)\n#\n# ┌──────────┬──────────────┬──────────┬──────────────────────┐\n# │ Library  │ Vulnerability │ Severity │ Fixed Version        │\n# ├──────────┼──────────────┼──────────┼──────────────────────┤\n# │ openssl  │ CVE-2024-XXX │ CRITICAL │ 3.1.5-r0             │\n# │ curl     │ CVE-2024-YYY │ HIGH     │ 8.5.0-r1             │\n# └──────────┴──────────────┴──────────┴──────────────────────┘\n\n# Docker Scout (встроенный в Docker Desktop)\ndocker scout cves myapp:latest\ndocker scout recommendations myapp:latest' },
        { type: 'code', language: 'yaml', value: '# CI/CD: Сканирование в GitHub Actions\nname: Container Security\non:\n  push:\n    branches: [main]\n\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Build image\n        run: docker build -t myapp:${{ github.sha }} .\n      \n      - name: Trivy scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: myapp:${{ github.sha }}\n          severity: CRITICAL,HIGH\n          exit-code: 1\n          format: sarif\n          output: trivy-results.sarif\n      \n      - name: Upload to GitHub Security\n        uses: github/codeql-action/upload-sarif@v3\n        with:\n          sarif_file: trivy-results.sarif' },
        { type: 'tip', value: 'Сканируйте образы при сборке (CI/CD) И регулярно в registry (новые CVE появляются для старых пакетов). Используйте Trivy + Dependabot для полного покрытия.' }
      ]
    },
    {
      id: 4,
      title: 'Runtime Security и секреты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Runtime security защищает контейнеры во время выполнения: ограничение capabilities, seccomp профили, AppArmor, read-only файловая система. Секреты передаются через Docker Secrets или монтируемые файлы, НЕ через переменные окружения.' },
        { type: 'code', language: 'bash', value: '# === Безопасный запуск контейнера ===\n\ndocker run \\\n  --user 1001:1001 \\\n  --cap-drop ALL \\\n  --cap-add NET_BIND_SERVICE \\\n  --read-only \\\n  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\\n  --memory 256m \\\n  --cpus 0.5 \\\n  --pids-limit 100 \\\n  --security-opt no-new-privileges \\\n  --security-opt seccomp=default.json \\\n  --network app-network \\\n  myapp:latest\n\n# Объяснение:\n# --user          : non-root пользователь\n# --cap-drop ALL  : убираем ВСЕ Linux capabilities\n# --cap-add       : добавляем только необходимые\n# --read-only     : запрет записи в файловую систему\n# --tmpfs         : временная ФС для /tmp (noexec!)\n# --memory/cpus   : ограничение ресурсов\n# --pids-limit    : защита от fork bomb\n# --no-new-privileges : запрет повышения привилегий\n# --seccomp       : ограничение системных вызовов' },
        { type: 'code', language: 'yaml', value: '# === Docker Compose: безопасная конфигурация ===\nversion: "3.8"\nservices:\n  app:\n    image: myapp:latest\n    user: "1001:1001"\n    read_only: true\n    tmpfs:\n      - /tmp:size=64m,noexec,nosuid\n    cap_drop:\n      - ALL\n    cap_add:\n      - NET_BIND_SERVICE\n    security_opt:\n      - no-new-privileges:true\n    deploy:\n      resources:\n        limits:\n          cpus: "0.5"\n          memory: 256M\n        reservations:\n          memory: 128M\n    # Секреты через Docker Secrets (НЕ environment!)\n    secrets:\n      - db_password\n      - jwt_secret\n    environment:\n      - DB_HOST=postgres\n      - DB_NAME=myapp\n      # НЕ: DB_PASSWORD=secret123\n    networks:\n      - app-net\n\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt\n  jwt_secret:\n    file: ./secrets/jwt_secret.txt\n\n# В приложении читаем секрет из файла:\n# /run/secrets/db_password' },
        { type: 'warning', value: 'Переменные окружения для секретов — плохая практика: они видны через docker inspect, /proc/1/environ, логи. Используйте Docker Secrets, Kubernetes Secrets или Vault для передачи секретов через файлы.' }
      ]
    },
    {
      id: 5,
      title: 'Docker Bench и аудит безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Bench for Security — автоматизированный скрипт проверки Docker конфигурации по CIS Docker Benchmark. Проверяет хост, daemon, образы, контейнеры, runtime и Docker Swarm.' },
        { type: 'code', language: 'bash', value: '# === Docker Bench for Security ===\ngit clone https://github.com/docker/docker-bench-security.git\ncd docker-bench-security\nsudo sh docker-bench-security.sh\n\n# Или через Docker:\ndocker run --rm --net host --pid host --userns host --cap-add audit_control \\\n  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \\\n  -v /var/lib:/var/lib:ro \\\n  -v /var/run/docker.sock:/var/run/docker.sock:ro \\\n  -v /etc:/etc:ro \\\n  docker/docker-bench-security\n\n# Пример вывода:\n# [INFO] 1 - Host Configuration\n# [PASS] 1.1 - Ensure a separate partition for containers has been created\n# [WARN] 1.2 - Ensure the container host is hardened\n# [INFO] 2 - Docker daemon configuration\n# [WARN] 2.1 - Run the Docker daemon as a non-root user\n# [PASS] 2.2 - Ensure network traffic is restricted between containers\n# [INFO] 4 - Container Images and Build File\n# [WARN] 4.1 - Ensure a user for the container has been created\n# [WARN] 4.5 - Ensure Content trust for Docker is enabled\n\n# === Hadolint: линтер Dockerfile ===\ndocker run --rm -i hadolint/hadolint < Dockerfile\n# DL3018 warning: Pin versions in apk add\n# DL3008 warning: Pin versions in apt-get install\n# DL3002 warning: Last USER should not be root\n\n# === Dockle: лучшие практики образов ===\ndockle myapp:latest\n# WARN  - CIS-DI-0001: Create a user for the container\n# WARN  - CIS-DI-0005: Enable Content trust\n# INFO  - CIS-DI-0006: Add HEALTHCHECK instruction' },
        { type: 'tip', value: 'Запускайте Docker Bench регулярно. Используйте Hadolint в CI/CD для проверки Dockerfile. Dockle проверяет собранные образы. Все три инструмента бесплатны и автоматизируемы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасный Docker образ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте безопасный Docker образ для Node.js приложения, отвечающий CIS Docker Benchmark.',
      requirements: [
        'Напишите multi-stage Dockerfile с Alpine базой и non-root пользователем',
        'Просканируйте образ на уязвимости с Trivy',
        'Настройте docker-compose с security best practices (caps, resources, secrets)',
        'Проверьте образ с Hadolint и Dockle',
        'Убедитесь что контейнер работает read-only с tmpfs'
      ],
      hint: 'Multi-stage: builder (npm install) -> production (copy node_modules). USER appuser. --cap-drop ALL. --read-only + --tmpfs /tmp.',
      expectedOutput: 'Dockerfile: multi-stage, Alpine 3.19, non-root (UID 1001)\nTrivy: 0 CRITICAL, 0 HIGH vulnerabilities\nHadolint: 0 warnings\nDockle: 0 WARN (PASS all CIS checks)\nRuntime: read-only FS, 256MB RAM limit, no capabilities',
      solution: '# === Dockerfile ===\nFROM node:20-alpine3.19 AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production && npm cache clean --force\n\nFROM node:20-alpine3.19\nRUN addgroup -g 1001 -S appgroup && \\\n    adduser -u 1001 -S appuser -G appgroup\nWORKDIR /app\nCOPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules\nCOPY --chown=appuser:appgroup . .\nUSER 1001\nHEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3000/health || exit 1\nEXPOSE 3000\nCMD ["node", "server.js"]\n\n# === docker-compose.yml ===\n# version: "3.8"\n# services:\n#   app:\n#     build: .\n#     user: "1001:1001"\n#     read_only: true\n#     tmpfs:\n#       - /tmp:size=64m,noexec\n#     cap_drop:\n#       - ALL\n#     security_opt:\n#       - no-new-privileges:true\n#     deploy:\n#       resources:\n#         limits:\n#           cpus: "0.5"\n#           memory: 256M\n#     secrets:\n#       - db_password\n#     ports:\n#       - "3000:3000"\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n\n# === Проверки ===\n# trivy image myapp:latest --severity CRITICAL,HIGH\n# hadolint Dockerfile\n# dockle myapp:latest\n# docker run --rm --read-only --tmpfs /tmp myapp:latest',
      explanation: 'Безопасный Docker образ: минимальный Alpine базовый образ, multi-stage сборка (без dev зависимостей), non-root пользователь, HEALTHCHECK, фиксированные версии. Runtime: drop all capabilities, read-only FS, ограничение ресурсов, no-new-privileges. Секреты через Docker Secrets, не ENV.'
    }
  ]
}
