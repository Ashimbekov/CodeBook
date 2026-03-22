export default {
  id: 9,
  title: 'Docker Compose — продвинутые возможности',
  description: 'Profiles для условного запуска сервисов, healthcheck, deploy конфигурация, секреты, расширение сервисов через extends и YAML anchors.',
  lessons: [
    {
      id: 1,
      title: 'Profiles — условный запуск сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Profiles позволяют группировать сервисы и запускать только нужные. Например: сервисы разработки (swagger, pgadmin) запускаются только с профилем dev, а prod содержит только основные сервисы.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml с profiles:\nservices:\n  # Основные сервисы (всегда запускаются)\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n\n  postgres:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n\n  # Только для разработки:\n  pgadmin:\n    image: dpage/pgadmin4\n    profiles:\n      - dev\n      - tools\n    ports:\n      - "5050:80"\n    environment:\n      PGADMIN_DEFAULT_EMAIL: admin@admin.com\n      PGADMIN_DEFAULT_PASSWORD: admin\n\n  # Swagger UI — только в dev и staging:\n  swagger:\n    image: swaggerapi/swagger-ui\n    profiles:\n      - dev\n      - staging\n    ports:\n      - "8080:8080"\n\n  # Инструменты мониторинга:\n  prometheus:\n    image: prom/prometheus\n    profiles:\n      - monitoring\n    ports:\n      - "9090:9090"\n\n  grafana:\n    image: grafana/grafana\n    profiles:\n      - monitoring\n    ports:\n      - "3001:3000"\n\n  # Тесты:\n  test-runner:\n    build:\n      target: test\n    profiles:\n      - test\n    command: pytest' },
        { type: 'code', language: 'bash', value: '# Запустить только основные сервисы:\ndocker compose up -d\n\n# Запустить с профилем dev:\ndocker compose --profile dev up -d\n\n# Несколько профилей:\ndocker compose --profile dev --profile monitoring up -d\n\n# Через переменную COMPOSE_PROFILES:\nexport COMPOSE_PROFILES=dev,tools\ndocker compose up -d\n\n# Запустить конкретный сервис с профилем:\ndocker compose --profile dev up pgadmin -d\n\n# Остановить с профилями:\ndocker compose --profile dev down\n\n# Проверить сервисы профиля:\ndocker compose --profile dev config --services' },
        { type: 'tip', value: 'Profiles — отличное решение для dev-инструментов. Разработчики запускают docker compose --profile dev up и получают pgadmin, swagger, mailhog автоматически. Production: docker compose up без профилей — только основные сервисы.' }
      ]
    },
    {
      id: 2,
      title: 'Healthcheck — проверка готовности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Healthcheck определяет как Docker проверяет что сервис готов принимать запросы. Статусы: starting, healthy, unhealthy. Используется в depends_on, load balancers и оркестраторах.' },
        { type: 'code', language: 'yaml', value: '# Healthcheck конфигурация:\nservices:\n  postgres:\n    image: postgres:15\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres -d mydb"]\n      interval: 10s      # Как часто проверять\n      timeout: 5s        # Таймаут проверки\n      retries: 5         # Сколько неудач подряд = unhealthy\n      start_period: 30s  # Не считать ошибки в начале\n\n  redis:\n    image: redis:7\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 5s\n      timeout: 3s\n      retries: 3\n\n  mongodb:\n    image: mongo:7\n    healthcheck:\n      test: ["CMD", "mongosh", "--eval", "db.adminCommand(\'ping\')"]\n      interval: 10s\n      timeout: 10s\n      retries: 5\n      start_period: 40s\n\n  elasticsearch:\n    image: elasticsearch:8.11.0\n    healthcheck:\n      test: ["CMD-SHELL", "curl -s http://localhost:9200/_cluster/health | grep -q \'status.*\\\"green\\\"\\|status.*\\\"yellow\\\"\'\"]\n      interval: 20s\n      timeout: 10s\n      retries: 10\n      start_period: 60s\n\n  # HTTP healthcheck для веб-приложения:\n  app:\n    build: .\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]\n      interval: 10s\n      timeout: 5s\n      retries: 3\n      start_period: 15s\n\n  # Отключить healthcheck (если в образе уже настроен):\n  nginx:\n    image: nginx\n    healthcheck:\n      disable: true' },
        { type: 'code', language: 'bash', value: '# Проверить статус healthcheck:\ndocker compose ps\n# NAME         STATUS\n# app-db-1     Up (healthy)\n# app-app-1    Up (unhealthy)\n\ndocker inspect app-db-1 | python3 -m json.tool | grep -A 10 Health\n\n# Лог healthcheck:\ndocker inspect app-app-1 --format "{{json .State.Health}}" | python3 -m json.tool\n# {\n#   "Status": "unhealthy",\n#   "FailingStreak": 3,\n#   "Log": [\n#     {\n#       "Start": "...",\n#       "End": "...",\n#       "ExitCode": 1,\n#       "Output": "curl: (7) Failed to connect"\n#     }\n#   ]\n# }' },
        { type: 'note', value: 'start_period — критически важен для медленных сервисов (Elasticsearch, Kafka). В этот период failures не считаются как retries. Но если успешная проверка прошла до истечения start_period — сервис сразу становится healthy.' }
      ]
    },
    {
      id: 3,
      title: 'Deploy конфигурация и ресурсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секция deploy задаёт параметры развёртывания: количество реплик, ограничения ресурсов, политики перезапуска. В Compose без Swarm ресурсные лимиты применяются немедленно.' },
        { type: 'code', language: 'yaml', value: '# deploy секция в docker-compose.yml:\nservices:\n  app:\n    image: myapp:latest\n    deploy:\n      # Количество экземпляров:\n      replicas: 3\n      \n      # Ресурсные лимиты (применяются в Compose и Swarm):\n      resources:\n        limits:\n          cpus: "0.5"      # 50% одного CPU\n          memory: 512M     # Максимум RAM\n        reservations:\n          cpus: "0.25"     # Гарантированный CPU\n          memory: 128M     # Гарантированная RAM\n      \n      # Политика перезапуска:\n      restart_policy:\n        condition: on-failure\n        delay: 5s          # Задержка между перезапусками\n        max_attempts: 3    # Максимум попыток\n        window: 120s       # Окно для отслеживания\n      \n      # Стратегия обновления (для Swarm):\n      update_config:\n        parallelism: 1     # По одному контейнеру\n        delay: 10s\n        order: start-first # Сначала новый, потом старый\n        failure_action: rollback\n      \n      # Стратегия отката:\n      rollback_config:\n        parallelism: 0     # Все сразу\n        delay: 0s\n      \n      # Ограничения размещения (для Swarm):\n      placement:\n        constraints:\n          - node.role == worker\n          - node.labels.disk == ssd\n\n  # Только лимиты (без Swarm, для обычного Compose):\n  worker:\n    image: myapp:latest\n    command: python worker.py\n    deploy:\n      resources:\n        limits:\n          memory: 256M     # OOM killer если превысит\n        reservations:\n          memory: 64M' },
        { type: 'tip', value: 'В Docker Compose (без Swarm) работают: resources, restart_policy. replicas работает через --scale флаг. update_config и placement — только для Docker Swarm. Для Kubernetes используй Helm charts или kustomize.' }
      ]
    },
    {
      id: 4,
      title: 'Секреты в Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker secrets — безопасный способ передачи чувствительных данных контейнерам. Секреты монтируются как файлы в /run/secrets/. В Compose можно использовать файлы или environment переменные.' },
        { type: 'code', language: 'yaml', value: '# Секреты через файлы:\nservices:\n  app:\n    image: myapp\n    secrets:\n      - db_password\n      - api_key\n    environment:\n      # Приложение читает пароль из файла, не из env!\n      DB_PASSWORD_FILE: /run/secrets/db_password\n\n  postgres:\n    image: postgres:15\n    secrets:\n      - db_password\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n      # PostgreSQL сам читает файл, если *_FILE переменная!\n\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt  # Файл с паролем\n  api_key:\n    file: ./secrets/api_key.txt\n\n---\n# Создать файлы секретов (не коммить!):\n# mkdir -p secrets\n# echo "mysecretpassword" > secrets/db_password.txt\n# echo "sk-abc123" > secrets/api_key.txt\n# .gitignore: secrets/\n\n---\n# Docker Swarm секреты (в production):\nservices:\n  app:\n    secrets:\n      - db_password\n\nsecrets:\n  db_password:\n    external: true  # Уже создан через docker secret create\n    # docker secret create db_password - < password.txt' },
        { type: 'code', language: 'bash', value: '# Чтение секрета в приложении:\n# Python пример:\n# with open("/run/secrets/db_password") as f:\n#     password = f.read().strip()\n\n# Node.js пример:\n# const password = fs.readFileSync("/run/secrets/db_password", "utf8").trim()\n\n# PostgreSQL переменная *_FILE:\n# POSTGRES_PASSWORD_FILE=/run/secrets/db_password\n# postgres автоматически читает файл!\n\n# Проверить секрет в контейнере:\ndocker exec app ls /run/secrets/\n# api_key  db_password\n\ndocker exec app cat /run/secrets/db_password\n# mysecretpassword' },
        { type: 'warning', value: 'Secrets в файловой системе контейнера читаемы root процессами внутри контейнера. Для максимальной безопасности используй Docker Swarm secrets или Vault agent — они монтируются в tmpfs и не попадают на диск.' }
      ]
    },
    {
      id: 5,
      title: 'YAML anchors и extends',
      type: 'theory',
      content: [
        { type: 'text', value: 'YAML anchors (&) и aliases (*) позволяют переиспользовать блоки конфигурации внутри одного файла. extends позволяет наследовать конфигурацию из другого файла или сервиса.' },
        { type: 'code', language: 'yaml', value: '# YAML anchors — DRY (Don\'t Repeat Yourself):\n\n# Определить anchor:\nx-common-app: &common-app\n  build: .\n  restart: unless-stopped\n  networks:\n    - backend\n  environment:\n    - DATABASE_URL=${DATABASE_URL}\n    - REDIS_URL=${REDIS_URL}\n\n# Использовать anchor:\nservices:\n  app:\n    <<: *common-app  # Merge key — вставить всё из anchor\n    ports:\n      - "3000:3000"\n\n  worker:\n    <<: *common-app  # Те же настройки\n    command: python worker.py\n    # ports НЕТ — worker не нужен снаружи\n\n  beat:\n    <<: *common-app\n    command: python beat.py\n\n# Anchor для environment:\nx-db-env: &db-env\n  POSTGRES_USER: postgres\n  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n  POSTGRES_DB: myapp\n\nservices:\n  postgres:\n    image: postgres:15\n    environment:\n      <<: *db-env\n      POSTGRES_INITDB_ARGS: "--encoding=UTF8"\n\n  app:\n    build: .\n    environment:\n      <<: *db-env\n      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres/myapp\n      EXTRA_VAR: value  # Дополнительная переменная' },
        { type: 'code', language: 'yaml', value: '# extends — наследование сервисов:\n# base-compose.yml:\nservices:\n  app-base:\n    build: .\n    environment:\n      - LOG_LEVEL=info\n      - SECRET_KEY=${SECRET_KEY}\n\n---\n# docker-compose.yml:\nservices:\n  app:\n    extends:\n      file: base-compose.yml\n      service: app-base\n    ports:\n      - "3000:3000"\n    environment:\n      - DEBUG=false\n\n  worker:\n    extends:\n      file: base-compose.yml\n      service: app-base\n    command: python worker.py\n\n# Ограничение extends:\n# Нельзя наследовать depends_on, volumes, networks\n# (потому что они могут ссылаться на несуществующие сервисы/volumes/networks)' },
        { type: 'note', value: '<<: *anchor (merge key) — YAML фича, не Docker. Работает в любом YAML. Позволяет избежать дублирования общих настроек. Особенно полезно для микросервисов где много похожих сервисов.' }
      ]
    },
    {
      id: 6,
      title: 'Жизненный цикл и управление данными',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание жизненного цикла Compose проекта важно для правильного управления данными. Знай что удаляется при down, что сохраняется и как правильно управлять состоянием.' },
        { type: 'code', language: 'bash', value: '# ЖИЗНЕННЫЙ ЦИКЛ:\n\n# up: создаёт и запускает контейнеры, сети, volumes\ndocker compose up -d\n\n# stop: останавливает контейнеры (не удаляет)\ndocker compose stop\n# Можно продолжить: docker compose start\n\n# down: останавливает и УДАЛЯЕТ контейнеры и сети\ndocker compose down\n# Volumes СОХРАНЯЮТСЯ!\n\n# down --volumes: удаляет всё включая volumes\ndocker compose down --volumes  # ДАННЫЕ УДАЛЯТСЯ!\n\n# rm: удаляет остановленные контейнеры\ndocker compose rm\ndocker compose rm -f  # Без подтверждения\n\n# ПЕРЕСОЗДАТЬ конкретный сервис без остановки других:\ndocker compose up -d --no-deps --build app\n# --no-deps: не пересоздавать зависимые сервисы\n# --build: пересобрать образ\n\n# ПОСМОТРЕТЬ что займёт пространство:\ndocker compose ps\ndocker system df\n\n# Именование ресурсов:\n# По умолчанию: {проект}_{сервис}_{номер}\n# Проект = имя директории или COMPOSE_PROJECT_NAME\n\n# Задать имя проекта:\ndocker compose -p myproject up -d\n# или\nexport COMPOSE_PROJECT_NAME=myproject\ndocker compose up -d\n\n# Список всех Compose проектов:\ndocker compose ls\n# NAME        STATUS       CONFIG FILES\n# myproject   running(3)   /path/docker-compose.yml' },
        { type: 'tip', value: 'Используй COMPOSE_PROJECT_NAME для изоляции проектов. Два проекта с одним именем будут конфликтовать. Это особенно важно в CI/CD где несколько pipelines могут запускаться параллельно на одном хосте.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Продвинутая конфигурация Compose',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай production-ready Compose конфигурацию с profiles, healthcheck, секретами и ресурсными лимитами.',
      requirements: [
        'Создай базовый docker-compose.yml с app, postgres, redis, nginx',
        'Добавь profiles: dev (pgadmin, mailhog), monitoring (prometheus, grafana)',
        'Настрой healthcheck для postgres и redis с правильными параметрами',
        'Добавь depends_on с condition: service_healthy для app',
        'Настрой секреты через файлы для паролей БД',
        'Добавь ресурсные лимиты через deploy.resources',
        'Создай override файл для dev с дополнительными портами и bind mount'
      ],
      hint: 'YAML anchors помогут избежать дублирования. profiles: [dev] для dev-сервисов. POSTGRES_PASSWORD_FILE для postgres с секретами. deploy.resources.limits.memory для ограничения памяти.',
      solution: '# Создать структуру:\n# mkdir -p secrets\n# echo "devpassword123" > secrets/db_password.txt\n# echo "devredispass" > secrets/redis_password.txt\n\n# docker-compose.yml:\n# x-logging: &default-logging\n#   logging:\n#     driver: json-file\n#     options:\n#       max-size: "10m"\n#       max-file: "3"\n#\n# services:\n#   postgres:\n#     image: postgres:15-alpine\n#     <<: *default-logging\n#     secrets:\n#       - db_password\n#     environment:\n#       POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n#       POSTGRES_DB: myapp\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres -d myapp"]\n#       interval: 10s\n#       timeout: 5s\n#       retries: 5\n#       start_period: 30s\n#     deploy:\n#       resources:\n#         limits:\n#           memory: 512M\n#\n#   redis:\n#     image: redis:7-alpine\n#     <<: *default-logging\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       timeout: 3s\n#       retries: 3\n#     deploy:\n#       resources:\n#         limits:\n#           memory: 128M\n#\n#   app:\n#     build: .\n#     <<: *default-logging\n#     networks:\n#       - backend\n#       - frontend\n#     depends_on:\n#       postgres:\n#         condition: service_healthy\n#       redis:\n#         condition: service_started\n#     deploy:\n#       resources:\n#         limits:\n#           memory: 256M\n#\n#   nginx:\n#     image: nginx:alpine\n#     ports:\n#       - "80:80"\n#     networks:\n#       - frontend\n#     depends_on:\n#       - app\n#\n#   pgadmin:\n#     image: dpage/pgadmin4\n#     profiles:\n#       - dev\n#     ports:\n#       - "5050:80"\n#     networks:\n#       - backend\n#     environment:\n#       PGADMIN_DEFAULT_EMAIL: admin@admin.com\n#       PGADMIN_DEFAULT_PASSWORD: admin\n#\n#   prometheus:\n#     image: prom/prometheus\n#     profiles:\n#       - monitoring\n#     ports:\n#       - "9090:9090"\n#\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n#\n# networks:\n#   frontend:\n#   backend:\n#     internal: true\n#\n# volumes:\n#   postgres_data:\n\n# Тестирование:\ndocker compose up -d\ndocker compose ps\n\ndocker compose --profile dev up -d\ndocker compose --profile dev ps\n\ndocker compose --profile monitoring up -d\n\n# Проверить healthcheck:\ndocker inspect $(docker compose ps -q postgres) --format "{{.State.Health.Status}}"',
      explanation: 'Production-ready конфигурация включает: healthcheck для надёжного порядка запуска, secrets для безопасного хранения паролей, ресурсные лимиты для предотвращения OOM, profiles для dev-инструментов, logging для ротации логов. YAML anchors уменьшают дублирование. internal: true для backend защищает БД от прямого внешнего доступа.'
    }
  ]
}
