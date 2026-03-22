export default {
  id: 8,
  title: 'Docker Compose — основы',
  description: 'Определение и запуск многоконтейнерных приложений с Docker Compose. Синтаксис docker-compose.yml, сервисы, порты, переменные, depends_on, базовые команды.',
  lessons: [
    {
      id: 1,
      title: 'Зачем Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose решает проблему управления несколькими контейнерами. Вместо набора длинных docker run команд — один docker-compose.yml файл описывает всё приложение. Compose запускает, останавливает и управляет всеми сервисами вместе.' },
        { type: 'code', language: 'bash', value: '# БЕЗ Compose — управление вручную:\ndocker network create myapp\ndocker volume create postgres_data\n\ndocker run -d \\\n  --name postgres \\\n  --network myapp \\\n  -v postgres_data:/var/lib/postgresql/data \\\n  -e POSTGRES_PASSWORD=secret \\\n  -e POSTGRES_DB=mydb \\\n  postgres:15\n\ndocker run -d \\\n  --name redis \\\n  --network myapp \\\n  redis:7\n\ndocker run -d \\\n  --name app \\\n  --network myapp \\\n  -p 3000:3000 \\\n  -e DATABASE_URL=postgresql://postgres:secret@postgres/mydb \\\n  -e REDIS_URL=redis://redis:6379 \\\n  myapp:latest\n\n# С COMPOSE — одна команда:\ndocker compose up -d\n# Создаёт сети, volumes, запускает все контейнеры в правильном порядке\n\n# Остановить:\ndocker compose down\n\n# Версия Compose:\ndocker compose version\n# Docker Compose version v2.24.0\n\n# Compose v2 (новый) vs Compose v1 (старый):\n# v1: docker-compose (отдельный бинарник, Python)\n# v2: docker compose (плагин Docker, Go)\n# Используй v2 — v1 deprecated!' },
        { type: 'tip', value: 'docker compose (с пробелом) — это Docker Compose v2, встроенный плагин. docker-compose (с дефисом) — устаревшая версия v1. На современных системах всегда используй docker compose.' }
      ]
    },
    {
      id: 2,
      title: 'Структура docker-compose.yml',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker-compose.yml — YAML файл с описанием всех сервисов, сетей и volumes. Основные секции: services (обязательно), networks (опционально), volumes (опционально).' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — полная структура:\nversion: "3.8"  # Опционально в Compose v2\n\nservices:\n  # Каждый сервис = контейнер\n  web:\n    image: nginx:latest     # Готовый образ из registry\n    # ИЛИ\n    build: .                # Собрать из Dockerfile в текущей директории\n    # ИЛИ\n    build:\n      context: ./app        # Контекст сборки\n      dockerfile: Dockerfile.prod  # Конкретный Dockerfile\n      args:\n        NODE_ENV: production\n    \n    container_name: my-nginx  # Имя контейнера (опционально)\n    restart: unless-stopped   # Политика перезапуска\n    \n    ports:\n      - "80:80"\n      - "443:443"\n    \n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n      - static_files:/var/www/html\n    \n    environment:\n      - ENV_VAR=value\n      - ANOTHER_VAR=${HOST_VAR}  # Из .env файла\n    \n    networks:\n      - frontend\n    \n    depends_on:\n      - app\n\n  app:\n    build: ./app\n    ports:\n      - "3000:3000"\n    networks:\n      - frontend\n      - backend\n\n  db:\n    image: postgres:15\n    networks:\n      - backend\n    volumes:\n      - db_data:/var/lib/postgresql/data\n\nnetworks:\n  frontend:\n  backend:\n    internal: true\n\nvolumes:\n  db_data:\n  static_files:' },
        { type: 'note', value: 'version: "3.8" — устаревший атрибут в Compose v2. Можно не указывать. Compose v2 сам определяет поддерживаемые фичи. Если видишь version — это обычно старый файл или для совместимости.' }
      ]
    },
    {
      id: 3,
      title: 'Сервисы, образы и сборка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый сервис в Compose описывает один тип контейнера. Сервис может использовать готовый образ (image:) или собирать свой (build:). При необходимости можно запускать несколько экземпляров одного сервиса.' },
        { type: 'code', language: 'yaml', value: '# Сервис из готового образа:\nservices:\n  redis:\n    image: redis:7-alpine\n    command: redis-server --maxmemory 256mb\n\n# Сервис из Dockerfile:\n  app:\n    build:\n      context: .\n      dockerfile: Dockerfile\n      target: production    # Multi-stage target\n      args:\n        VERSION: "1.0.0"\n    image: myapp:latest    # Тег для собранного образа\n\n# Настройки контейнера:\n  worker:\n    image: myapp:latest\n    command: python manage.py worker  # Переопределить CMD\n    entrypoint: /entrypoint.sh        # Переопределить ENTRYPOINT\n    working_dir: /app\n    user: "1000:1000"\n    hostname: my-worker\n    \n    # Лимиты ресурсов:\n    deploy:\n      resources:\n        limits:\n          cpus: "0.5"\n          memory: 512M\n        reservations:\n          memory: 128M\n    \n    # Политики перезапуска:\n    # no          — никогда (по умолчанию)\n    # always      — всегда\n    # on-failure  — только при ошибке\n    # unless-stopped — всегда кроме ручной остановки\n    restart: on-failure:3  # Перезапустить максимум 3 раза\n    \n    # Логирование:\n    logging:\n      driver: json-file\n      options:\n        max-size: "10m"\n        max-file: "3"' },
        { type: 'code', language: 'bash', value: '# Сборка образов:\ndocker compose build          # Собрать все сервисы с build:\ndocker compose build app      # Собрать конкретный сервис\ndocker compose build --no-cache  # Без кэша\n\n# Пересобрать и запустить:\ndocker compose up --build\n\n# Запустить несколько экземпляров:\ndocker compose up --scale worker=3\n# Запускает 3 контейнера worker_1, worker_2, worker_3\n# Внимание: нельзя использовать container_name и фиксированные порты!\n\n# Посмотреть какие образы используются:\ndocker compose images' }
      ]
    },
    {
      id: 4,
      title: 'Переменные окружения и .env файлы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменные окружения — главный способ конфигурации сервисов. Docker Compose поддерживает .env файлы, env_file директивы и интерполяцию переменных. Никогда не хардкодь секреты в docker-compose.yml.' },
        { type: 'code', language: 'bash', value: '# .env файл (в директории с compose файлом):\n# Compose автоматически читает .env\n\n# .env:\n# POSTGRES_PASSWORD=mysecretpassword\n# POSTGRES_DB=myapp\n# APP_PORT=3000\n# NODE_ENV=development' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml использует .env:\nservices:\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # Из .env\n      POSTGRES_DB: ${POSTGRES_DB:-defaultdb}   # С дефолтом\n    \n  app:\n    build: .\n    ports:\n      - "${APP_PORT:-3000}:3000"  # Дефолт 3000\n    environment:\n      - NODE_ENV=${NODE_ENV}   # Передать как есть\n      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}\n    env_file:\n      - .env              # Загрузить все переменные из файла\n      - .env.local        # Дополнительный файл (если есть)\n\n# Разные env файлы для окружений:\n# docker compose --env-file .env.production up' },
        { type: 'code', language: 'bash', value: '# Использовать другой env файл:\ndocker compose --env-file .env.prod up -d\n\n# Посмотреть итоговую конфигурацию с подстановкой переменных:\ndocker compose config\n\n# Переопределить переменную из командной строки:\nAPP_PORT=8080 docker compose up\n\n# Порядок приоритетов переменных (от высшего к низшему):\n# 1. Командная строка: KEY=val docker compose up\n# 2. Shell переменные\n# 3. .env файл\n# 4. environment: в compose файле\n# 5. Значения по умолчанию ${VAR:-default}\n\n# .gitignore — НЕ коммить секреты:\n# .env\n# .env.local\n# .env.prod\n# Коммить: .env.example с плейсхолдерами' },
        { type: 'warning', value: 'Никогда не коммить .env файлы с реальными паролями в git! Добавь .env в .gitignore. Создай .env.example с placeholder значениями для документации. В CI/CD используй secrets менеджмент (GitHub Secrets, Vault, etc.).' }
      ]
    },
    {
      id: 5,
      title: 'depends_on и порядок запуска',
      type: 'theory',
      content: [
        { type: 'text', value: 'depends_on определяет порядок запуска сервисов. По умолчанию ждёт только запуска контейнера, не готовности сервиса. Для надёжности используй healthcheck условие.' },
        { type: 'code', language: 'yaml', value: '# Простой depends_on — ждёт только старта контейнера:\nservices:\n  app:\n    image: myapp\n    depends_on:\n      - db\n      - redis\n    # Проблема: db может ещё инициализироваться!\n\n  db:\n    image: postgres:15\n\n# depends_on с условием — ждёт healthcheck:\nservices:\n  app:\n    image: myapp\n    depends_on:\n      db:\n        condition: service_healthy  # Ждёт healthy статус\n      redis:\n        condition: service_started  # Только запуска (дефолт)\n      migration:\n        condition: service_completed_successfully  # Завершения с кодом 0\n\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n      start_period: 10s  # Не проверять первые 10 секунд\n\n  redis:\n    image: redis:7\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 5s\n      timeout: 3s\n      retries: 3\n\n  migration:\n    image: myapp\n    command: python manage.py migrate\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: "no"  # Не перезапускать после завершения' },
        { type: 'note', value: 'service_healthy требует настроенного healthcheck. Без healthcheck в сервисе condition: service_healthy не сработает. start_period — время на инициализацию до начала проверок (для медленных сервисов типа PostgreSQL с большой БД).' }
      ]
    },
    {
      id: 6,
      title: 'Основные команды Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose предоставляет команды для управления жизненным циклом всего приложения. Большинство команд принимают имена сервисов для фокусировки на конкретном сервисе.' },
        { type: 'code', language: 'bash', value: '# ЗАПУСК:\ndocker compose up              # Запустить (foreground, с логами)\ndocker compose up -d           # Detached (background)\ndocker compose up --build      # Пересобрать и запустить\ndocker compose up app db       # Только конкретные сервисы\n\n# ОСТАНОВКА:\ndocker compose down            # Остановить и удалить контейнеры + сети\ndocker compose down -v         # + удалить volumes (ДАННЫЕ УДАЛЯТСЯ!)\ndocker compose down --rmi all  # + удалить образы\ndocker compose stop            # Только остановить (не удалять)\ndocker compose start           # Запустить остановленные\n\n# СТАТУС И ЛОГИ:\ndocker compose ps              # Статус сервисов\ndocker compose ps --format json  # В JSON формате\ndocker compose logs            # Логи всех сервисов\ndocker compose logs -f app     # Следить за логами app\ndocker compose logs --tail 50  # Последние 50 строк\n\n# ВЗАИМОДЕЙСТВИЕ:\ndocker compose exec app bash   # Войти в контейнер\ndocker compose exec db psql -U postgres  # Выполнить команду\ndocker compose run --rm app pytest  # Запустить одноразовый контейнер\n\n# СБОРКА:\ndocker compose build           # Собрать все образы\ndocker compose build --no-cache app  # Без кэша\ndocker compose pull            # Обновить образы из registry\n\n# МАСШТАБИРОВАНИЕ:\ndocker compose up --scale worker=5  # 5 экземпляров worker\n\n# ПРОСМОТР КОНФИГУРАЦИИ:\ndocker compose config          # Итоговая конфигурация\ndocker compose config --services  # Список сервисов' },
        { type: 'tip', value: 'docker compose run vs docker compose exec: run создаёт НОВЫЙ контейнер (для одноразовых задач: миграции, тесты), exec выполняет команду в ЗАПУЩЕННОМ контейнере. --rm в run автоматически удаляет контейнер после завершения.' }
      ]
    },
    {
      id: 7,
      title: 'Override файлы и multiple Compose файлы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose поддерживает слияние нескольких файлов. docker-compose.yml — базовая конфигурация. docker-compose.override.yml — автоматически применяется поверх (для dev). docker-compose.prod.yml — для production.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — базовая конфигурация:\nservices:\n  app:\n    build: .\n    environment:\n      - NODE_ENV=production\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n\n---\n# docker-compose.override.yml — автозагрузка для dev:\nservices:\n  app:\n    build:\n      target: development  # Dev stage из multi-stage\n    volumes:\n      - .:/app              # Bind mount для hot reload\n      - /app/node_modules\n    environment:\n      - NODE_ENV=development\n      - DEBUG=true\n    ports:\n      - "9229:9229"  # Node.js debugger\n  db:\n    ports:\n      - "5432:5432"  # В dev: доступен снаружи для GUI клиентов\n\n---\n# docker-compose.prod.yml — для production:\nservices:\n  app:\n    restart: always\n    deploy:\n      replicas: 3\n      resources:\n        limits:\n          memory: 512M\n  db:\n    # Нет публичного порта в production!' },
        { type: 'code', language: 'bash', value: '# Dev (автоматически: base + override):\ndocker compose up -d\n\n# Production (явное указание файлов):\ndocker compose -f docker-compose.yml \\\n               -f docker-compose.prod.yml \\\n               up -d\n\n# Staging:\ndocker compose -f docker-compose.yml \\\n               -f docker-compose.staging.yml \\\n               up -d\n\n# Просмотреть итоговую конфигурацию:\ndocker compose -f docker-compose.yml \\\n               -f docker-compose.prod.yml \\\n               config\n\n# Структура проекта:\n# docker-compose.yml          — база\n# docker-compose.override.yml — dev (автозагрузка)\n# docker-compose.prod.yml     — prod\n# docker-compose.staging.yml  — staging\n# docker-compose.test.yml     — тесты\n# .env                        — dev переменные\n# .env.prod                   — prod переменные' },
        { type: 'tip', value: 'Override файлы СЛИВАЮТСЯ с базовым, не заменяют его. lists (ports, volumes) конкатенируются, mappings (environment) мержатся. Это позволяет иметь минимальный базовый файл и расширять его для каждого окружения.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Полноценное приложение на Compose',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай docker-compose.yml для веб-приложения с базой данных, Redis и nginx.',
      requirements: [
        'Создай docker-compose.yml с сервисами: postgres, redis, app (nginx как заглушка), nginx-proxy',
        'Настрой зависимости: app зависит от postgres (healthy) и redis (started)',
        'Добавь healthcheck для postgres и redis',
        'Настрой переменные через .env файл (пароли, порты)',
        'Настрой volumes: named volume для postgres данных',
        'Добавь сети: backend (db + redis + app), frontend (app + nginx-proxy)',
        'Настрой override файл для разработки с дополнительными портами'
      ],
      hint: 'pg_isready для healthcheck postgres. redis-cli ping для redis. depends_on с condition: service_healthy. .env для POSTGRES_PASSWORD и DATABASE_URL. Две сети: backend и frontend.',
      solution: '# .env файл:\n# POSTGRES_PASSWORD=devpassword123\n# POSTGRES_DB=myapp\n# REDIS_URL=redis://redis:6379\n# APP_PORT=3000\n\n# docker-compose.yml:\n# services:\n#   postgres:\n#     image: postgres:15-alpine\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#     environment:\n#       POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}\n#       POSTGRES_DB: ${POSTGRES_DB}\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       timeout: 5s\n#       retries: 5\n#       start_period: 10s\n#\n#   redis:\n#     image: redis:7-alpine\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       timeout: 3s\n#       retries: 3\n#\n#   app:\n#     image: nginx:alpine  # Заглушка\n#     networks:\n#       - backend\n#       - frontend\n#     depends_on:\n#       postgres:\n#         condition: service_healthy\n#       redis:\n#         condition: service_started\n#     environment:\n#       - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres/${POSTGRES_DB}\n#       - REDIS_URL=${REDIS_URL}\n#\n#   nginx-proxy:\n#     image: nginx:alpine\n#     ports:\n#       - "80:80"\n#     networks:\n#       - frontend\n#     depends_on:\n#       - app\n#\n# networks:\n#   frontend:\n#   backend:\n#     internal: true\n#\n# volumes:\n#   postgres_data:\n\n# Запустить и проверить:\ndocker compose up -d\ndocker compose ps\n# NAME              STATUS          PORTS\n# myapp-postgres-1  Up (healthy)    5432/tcp\n# myapp-redis-1     Up (healthy)    6379/tcp\n# myapp-app-1       Up              80/tcp\n# myapp-nginx-1     Up              0.0.0.0:80->80/tcp\n\ndocker compose logs postgres\ndocker compose exec postgres psql -U postgres -c "\\l"\n\n# docker-compose.override.yml (для dev):\n# services:\n#   postgres:\n#     ports:\n#       - "5432:5432"  # Доступен для IDE и клиентов\n#   redis:\n#     ports:\n#       - "6379:6379"\n\ndocker compose config  # Проверить итоговую конфигурацию',
      explanation: 'Это стандартная архитектура для веб-приложений: internal backend сеть для безопасности, healthcheck для надёжного порядка запуска, named volume для персистентности данных, .env для конфигурации без хардкода секретов. Override файл расширяет конфигурацию для разработки без изменения базового файла.'
    }
  ]
}
