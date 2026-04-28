export default {
  id: 9,
  title: 'Docker Compose',
  description: 'Управление многоконтейнерными приложениями с Docker Compose: сервисы, сети, тома, переменные окружения.',
  lessons: [
    {
      id: 1,
      title: 'Основы Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose — инструмент для определения и запуска многоконтейнерных приложений. Один YAML-файл описывает все сервисы, сети и тома. Одна команда запускает всё.' },
        { type: 'heading', value: 'Первый docker-compose.yml' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml\nversion: "3.9"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "8080:8080"\n    environment:\n      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - db\n      - redis\n    restart: unless-stopped\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  pgdata:' },
        { type: 'heading', value: 'Основные команды' },
        { type: 'code', language: 'bash', value: '# Запуск всех сервисов\ndocker compose up -d              # В фоне\ndocker compose up --build -d      # Пересобрать образы\n\n# Остановка\ndocker compose stop               # Остановить (сохранить контейнеры)\ndocker compose down               # Остановить + удалить контейнеры\ndocker compose down -v            # + удалить тома\n\n# Статус\ndocker compose ps                 # Список сервисов\ndocker compose logs               # Логи всех сервисов\ndocker compose logs -f app        # Следить за логами app\n\n# Масштабирование\ndocker compose up -d --scale app=3  # 3 экземпляра app\n\n# Выполнить команду в сервисе\ndocker compose exec app bash\ndocker compose exec db psql -U postgres myapp\n\n# Перезапуск одного сервиса\ndocker compose restart app' },
        { type: 'tip', value: 'docker compose up --build -d — самая частая команда. Она пересобирает только изменённые образы и перезапускает только изменённые сервисы.' }
      ]
    },
    {
      id: 2,
      title: 'Сервисы, сети и тома',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose автоматически создаёт сеть для всех сервисов. Сервисы общаются по именам. Тома обеспечивают постоянное хранение данных.' },
        { type: 'heading', value: 'Конфигурация сервисов' },
        { type: 'code', language: 'yaml', value: 'services:\n  app:\n    # Сборка из Dockerfile\n    build:\n      context: .\n      dockerfile: Dockerfile\n      args:\n        - VERSION=1.0.0\n    # Или готовый образ\n    # image: myapp:1.0.0\n\n    # Порты\n    ports:\n      - "8080:8080"         # host:container\n      - "127.0.0.1:9090:9090"  # Только localhost\n\n    # Переменные окружения\n    environment:\n      NODE_ENV: production\n      DB_HOST: db\n    env_file:\n      - .env\n      - .env.production\n\n    # Тома\n    volumes:\n      - ./src:/app/src              # Bind mount\n      - app-data:/app/data          # Named volume\n      - /app/node_modules           # Анонимный volume\n\n    # Зависимости\n    depends_on:\n      db:\n        condition: service_healthy   # Ждать healthcheck\n      redis:\n        condition: service_started\n\n    # Ресурсы\n    deploy:\n      resources:\n        limits:\n          memory: 512M\n          cpus: "1.0"\n\n    # Healthcheck\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]\n      interval: 30s\n      timeout: 10s\n      retries: 3\n      start_period: 40s\n\n    # Перезапуск\n    restart: unless-stopped' },
        { type: 'heading', value: 'Сети' },
        { type: 'code', language: 'yaml', value: 'services:\n  frontend:\n    networks:\n      - frontend-net\n\n  backend:\n    networks:\n      - frontend-net\n      - backend-net\n\n  db:\n    networks:\n      - backend-net\n\nnetworks:\n  frontend-net:\n    driver: bridge\n  backend-net:\n    driver: bridge\n    internal: true    # Без доступа в интернет\n\n# frontend -> backend: OK (через frontend-net)\n# backend -> db: OK (через backend-net)\n# frontend -> db: НЕВОЗМОЖНО (разные сети!)' },
        { type: 'note', value: 'Разделение сетей — важный аспект безопасности. Frontend не должен иметь прямой доступ к базе данных. Используй internal: true для сетей, которым не нужен доступ в интернет.' }
      ]
    },
    {
      id: 3,
      title: 'Переменные окружения и конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Управление конфигурацией через переменные окружения — стандартный подход в Docker. .env файлы, переменные подстановки и профили позволяют гибко настраивать окружения.' },
        { type: 'heading', value: '.env файлы' },
        { type: 'code', language: 'bash', value: '# .env — переменные для docker-compose.yml\nCOMPOSE_PROJECT_NAME=myproject\nAPP_VERSION=1.2.3\nDB_PASSWORD=supersecret\nAPP_PORT=8080\n\n# .env.production\nDATABASE_URL=postgresql://prod-db:5432/app\nREDIS_URL=redis://prod-redis:6379\nLOG_LEVEL=warn\n\n# .env.development\nDATABASE_URL=postgresql://localhost:5432/app_dev\nREDIS_URL=redis://localhost:6379\nLOG_LEVEL=debug' },
        { type: 'heading', value: 'Подстановка переменных' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml с переменными\nservices:\n  app:\n    image: myapp:${APP_VERSION:-latest}     # Значение по умолчанию\n    ports:\n      - "${APP_PORT:-8080}:8080"\n    environment:\n      - DATABASE_URL=${DATABASE_URL}\n      - LOG_LEVEL=${LOG_LEVEL:-info}\n\n  db:\n    image: postgres:${PG_VERSION:-16}-alpine\n    environment:\n      POSTGRES_PASSWORD: ${DB_PASSWORD:?Ошибка: DB_PASSWORD не задан}' },
        { type: 'heading', value: 'Профили и переопределение' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — базовая конфигурация\nservices:\n  app:\n    build: .\n    ports:\n      - "8080:8080"\n\n# docker-compose.override.yml — автоматически подхватывается для dev\nservices:\n  app:\n    volumes:\n      - ./src:/app/src\n    environment:\n      - DEBUG=true\n    command: python -m flask run --reload\n\n# docker-compose.prod.yml — для продакшена\nservices:\n  app:\n    image: registry.company.com/myapp:${VERSION}\n    restart: always\n    deploy:\n      replicas: 3\n      resources:\n        limits:\n          memory: 512M' },
        { type: 'code', language: 'bash', value: '# Использование разных конфигураций:\n# Разработка (автоматически: compose.yml + compose.override.yml)\ndocker compose up -d\n\n# Продакшн\ndocker compose -f docker-compose.yml -f docker-compose.prod.yml up -d\n\n# Профили\n# docker-compose.yml:\n# services:\n#   app: ...\n#   debug-tools:\n#     profiles: ["debug"]\n#     image: nicolaka/netshoot\n\n# Запуск с профилем debug\ndocker compose --profile debug up -d' },
        { type: 'warning', value: 'Никогда не коммитьте .env файлы с секретами в Git! Добавьте .env в .gitignore. Для команды создайте .env.example с описанием переменных без реальных значений.' }
      ]
    },
    {
      id: 4,
      title: 'Типичные стеки приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose идеален для локальной разработки и staging-окружений. Рассмотрим типичные конфигурации для веб-приложений.' },
        { type: 'heading', value: 'Полный веб-стек' },
        { type: 'code', language: 'yaml', value: '# Полный стек: Nginx + App + PostgreSQL + Redis + Celery\nversion: "3.9"\n\nservices:\n  nginx:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n      - "443:443"\n    volumes:\n      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro\n      - ./nginx/ssl:/etc/nginx/ssl:ro\n    depends_on:\n      - app\n    restart: always\n\n  app:\n    build: .\n    expose:\n      - "8080"\n    environment:\n      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/myapp\n      - REDIS_URL=redis://redis:6379/0\n      - CELERY_BROKER_URL=redis://redis:6379/1\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_started\n    restart: unless-stopped\n\n  worker:\n    build: .\n    command: celery -A app.celery worker --loglevel=info\n    environment:\n      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/myapp\n      - CELERY_BROKER_URL=redis://redis:6379/1\n    depends_on:\n      - db\n      - redis\n    restart: unless-stopped\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n      - ./init.sql:/docker-entrypoint-initdb.d/init.sql\n    healthcheck:\n      test: pg_isready -U postgres\n      interval: 10s\n      timeout: 5s\n      retries: 5\n    restart: always\n\n  redis:\n    image: redis:7-alpine\n    volumes:\n      - redis-data:/data\n    restart: always\n\nvolumes:\n  pgdata:\n  redis-data:' },
        { type: 'tip', value: 'expose (без маппинга на хост) делает порт доступным только для других контейнеров в сети. Используй expose для внутренних сервисов (app, db) и ports для внешних (nginx).' }
      ]
    },
    {
      id: 5,
      title: 'Отладка и мониторинг Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'При работе с Docker Compose важно уметь быстро находить и исправлять проблемы: неработающие сервисы, проблемы с сетью, заполненные диски.' },
        { type: 'heading', value: 'Команды отладки' },
        { type: 'code', language: 'bash', value: '# Статус сервисов\ndocker compose ps -a\n# NAME     IMAGE           STATUS          PORTS\n# app      myapp:latest    Up 5 minutes    0.0.0.0:8080->8080/tcp\n# db       postgres:16     Up 5 minutes    5432/tcp\n# redis    redis:7         Exit 1          \n\n# Логи\ndocker compose logs                   # Все сервисы\ndocker compose logs app               # Один сервис\ndocker compose logs -f --tail 100 app # Следить, последние 100 строк\ndocker compose logs --since "30m"     # За последние 30 минут\n\n# Выполнение команд\ndocker compose exec app bash\ndocker compose exec db psql -U postgres myapp\n\n# Проверка конфигурации\ndocker compose config                # Показать итоговую конфигурацию\ndocker compose config --services      # Список сервисов\n\n# События\ndocker compose events\n\n# Ресурсы\ndocker compose top                   # Процессы во всех контейнерах\ndocker stats $(docker compose ps -q) # Ресурсы контейнеров' },
        { type: 'heading', value: 'Типичные проблемы и решения' },
        { type: 'code', language: 'bash', value: '# Проблема: сервис не стартует\ndocker compose logs app              # Посмотреть ошибки\ndocker compose up app                # Запустить в foreground для отладки\n\n# Проблема: "port already in use"\nsudo lsof -i :8080                   # Кто занимает порт\ndocker compose down && docker compose up -d  # Перезапуск\n\n# Проблема: "no space left on device"\ndocker system df                     # Использование диска Docker\ndocker system prune -a --volumes     # Очистка\n\n# Проблема: контейнер не может подключиться к БД\n# 1. Проверь что db запущен:\ndocker compose ps db\n# 2. Проверь healthcheck:\ndocker compose exec db pg_isready\n# 3. Проверь сеть:\ndocker compose exec app ping db\n# 4. Проверь переменные:\ndocker compose exec app env | grep DATABASE' },
        { type: 'tip', value: 'docker compose config проверяет синтаксис и показывает итоговую конфигурацию со всеми подставленными переменными. Запускай перед up для проверки.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Развёртывание стека',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте docker-compose.yml для полноценного веб-приложения с базой данных и кэшем.',
      requirements: [
        'Напишите docker-compose.yml с тремя сервисами: app, db (PostgreSQL), redis',
        'Настройте depends_on с healthcheck для PostgreSQL',
        'Используйте named volumes для данных PostgreSQL',
        'Используйте .env файл для конфигурации',
        'Настройте отдельные сети для frontend и backend',
        'Запустите стек и проверьте что все сервисы работают'
      ],
      hint: 'healthcheck для PostgreSQL: pg_isready -U postgres. depends_on с condition: service_healthy. Два сервиса networks: frontend-net и backend-net.',
      expectedOutput: 'docker compose up -d запускает все 3 сервиса\ndocker compose ps показывает все healthy\napp подключается к db и redis по именам\n.env файл содержит DB_PASSWORD и другие переменные\nСети разделены: app в обеих, db только в backend',
      solution: '# .env\n# COMPOSE_PROJECT_NAME=myproject\n# DB_PASSWORD=secret123\n# APP_PORT=8080\n# PG_VERSION=16\n\n# docker-compose.yml\n# version: "3.9"\n#\n# services:\n#   app:\n#     build: .\n#     ports:\n#       - "${APP_PORT:-8080}:8080"\n#     environment:\n#       DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/myapp\n#       REDIS_URL: redis://redis:6379\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#       redis:\n#         condition: service_started\n#     networks:\n#       - frontend-net\n#       - backend-net\n#     restart: unless-stopped\n#\n#   db:\n#     image: postgres:${PG_VERSION:-16}-alpine\n#     environment:\n#       POSTGRES_DB: myapp\n#       POSTGRES_PASSWORD: ${DB_PASSWORD}\n#     volumes:\n#       - pgdata:/var/lib/postgresql/data\n#     healthcheck:\n#       test: pg_isready -U postgres\n#       interval: 10s\n#       timeout: 5s\n#       retries: 5\n#     networks:\n#       - backend-net\n#     restart: always\n#\n#   redis:\n#     image: redis:7-alpine\n#     networks:\n#       - backend-net\n#     restart: always\n#\n# networks:\n#   frontend-net:\n#   backend-net:\n#     internal: true\n#\n# volumes:\n#   pgdata:\n\n# Запуск и проверка:\ndocker compose config\ndocker compose up -d\ndocker compose ps\ndocker compose logs -f app\ncurl http://localhost:8080/health',
      explanation: 'depends_on с condition: service_healthy гарантирует что app запустится только когда PostgreSQL будет готов к соединениям. Named volume pgdata сохраняет данные между перезапусками. Раздельные сети обеспечивают изоляцию — db доступен только из backend-net.'
    }
  ]
}
