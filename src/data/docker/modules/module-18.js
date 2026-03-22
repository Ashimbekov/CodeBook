export default {
  id: 18,
  title: 'Практикум: Docker Compose',
  description: 'Практические задания по Docker Compose — от простых конфигураций до сложных многосервисных стеков.',
  lessons: [
    {
      id: 1,
      title: 'Задача 1: Первый Compose файл',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай docker-compose.yml для WordPress с MySQL.',
      requirements: [
        'Создай docker-compose.yml с сервисами wordpress и mysql',
        'Настрой environment переменные для WordPress (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)',
        'Добавь named volumes для данных MySQL и uploads WordPress',
        'WordPress доступен на порту 8080',
        'MySQL не публикует порт наружу',
        'Убедись что сайт открывается: http://localhost:8080'
      ],
      hint: 'wordpress:latest образ. mysql:8.0 образ. WORDPRESS_DB_HOST: mysql. named volumes: mysql_data и wordpress_uploads.',
      solution: '# docker-compose.yml:\n# services:\n#   wordpress:\n#     image: wordpress:latest\n#     ports:\n#       - "8080:80"\n#     environment:\n#       WORDPRESS_DB_HOST: mysql\n#       WORDPRESS_DB_USER: wordpress\n#       WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD:-secret}\n#       WORDPRESS_DB_NAME: wordpress\n#     volumes:\n#       - wordpress_uploads:/var/www/html/wp-content/uploads\n#     depends_on:\n#       mysql:\n#         condition: service_healthy\n#\n#   mysql:\n#     image: mysql:8.0\n#     environment:\n#       MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootsecret}\n#       MYSQL_DATABASE: wordpress\n#       MYSQL_USER: wordpress\n#       MYSQL_PASSWORD: ${MYSQL_PASSWORD:-secret}\n#     volumes:\n#       - mysql_data:/var/lib/mysql\n#     healthcheck:\n#       test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]\n#       interval: 10s\n#       retries: 5\n#\n# volumes:\n#   mysql_data:\n#   wordpress_uploads:\n\ndocker compose up -d\ndocker compose ps\n# Открыть http://localhost:8080 — установщик WordPress',
      explanation: 'WordPress + MySQL — классический пример Compose. depends_on с healthcheck ждёт готовности MySQL. Named volumes сохраняют данные БД и загруженные файлы. Пароли через .env переменные (не хардкод). MySQL не публикует порт — доступен только WordPress контейнеру.'
    },
    {
      id: 2,
      title: 'Задача 2: Development окружение',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настрой Compose для разработки с hot reload.',
      requirements: [
        'Создай Node.js приложение с nodemon для hot reload',
        'docker-compose.yml: bind mount исходного кода в контейнер',
        'Исключи node_modules хоста (анонимный volume)',
        'Override файл: добавь дополнительные инструменты (redis-commander, adminer)',
        'Порт 9229 для Node.js debugger',
        'Изменение кода должно сразу отображаться без пересборки образа'
      ],
      hint: 'volumes: - .:/app - /app/node_modules. nodemon для hot reload. DEBUG=* переменная. docker-compose.override.yml автоматически применяется.',
      solution: '# docker-compose.yml (base):\n# services:\n#   app:\n#     build: .\n#     ports: ["3000:3000"]\n#     environment:\n#       NODE_ENV: development\n#\n#   postgres:\n#     image: postgres:15-alpine\n#     environment: {POSTGRES_PASSWORD: dev}\n#     volumes:\n#       - pg_data:/var/lib/postgresql/data\n#\n# volumes:\n#   pg_data:\n\n# docker-compose.override.yml (автозагрузка в dev):\n# services:\n#   app:\n#     volumes:\n#       - .:/app\n#       - /app/node_modules\n#     command: nodemon server.js\n#     ports:\n#       - "9229:9229"  # debugger\n#     environment:\n#       DEBUG: "*"\n#\n#   postgres:\n#     ports:\n#       - "5432:5432"\n#\n#   adminer:\n#     image: adminer\n#     ports:\n#       - "8080:8080"\n#\n#   redis-commander:\n#     image: rediscommander/redis-commander\n#     ports:\n#       - "8081:8081"\n\n# Dockerfile:\n# FROM node:18-alpine\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm install  # dev deps тоже\n# COPY . .\n# CMD ["node", "server.js"]\n\ndocker compose up -d\n# Изменить server.js -> nodemon перезапускает\n# Adminer: http://localhost:8080\n# Redis Commander: http://localhost:8081',
      explanation: 'Bind mount .:/app + анонимный volume /app/node_modules — стандартный паттерн для Node.js dev. Override файл добавляет dev-инструменты без изменения base конфига. nodemon следит за изменениями файлов. Разработчик запускает docker compose up и сразу работает с hot reload.'
    },
    {
      id: 3,
      title: 'Задача 3: Compose с несколькими окружениями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой один Compose проект для dev, staging и production.',
      requirements: [
        'Базовый docker-compose.yml: минимальная конфигурация',
        'docker-compose.dev.yml: bind mounts, отладочные инструменты, debug порты',
        'docker-compose.staging.yml: closer to prod, тестовые данные',
        'docker-compose.prod.yml: лимиты ресурсов, restart policies, без debug',
        'Разные .env файлы для каждого окружения',
        'Скрипт deploy.sh который принимает аргумент: dev|staging|prod'
      ],
      hint: 'docker compose -f base.yml -f env.yml config для проверки. --env-file для разных переменных. Скрипт: case "$1" in dev) docker compose -f ... ;;.',
      solution: '# deploy.sh:\n# #!/bin/bash\n# ENV=${1:-dev}\n# case $ENV in\n#   dev)\n#     docker compose \\\n#       -f docker-compose.yml \\\n#       -f docker-compose.dev.yml \\\n#       --env-file .env.dev \\\n#       up -d\n#     ;;\n#   staging)\n#     docker compose \\\n#       -f docker-compose.yml \\\n#       -f docker-compose.staging.yml \\\n#       --env-file .env.staging \\\n#       up -d\n#     ;;\n#   prod)\n#     docker compose \\\n#       -f docker-compose.yml \\\n#       -f docker-compose.prod.yml \\\n#       --env-file .env.prod \\\n#       up -d\n#     ;;\n#   *)\n#     echo "Usage: $0 dev|staging|prod"\n#     exit 1\n#     ;;\n# esac\n\n# Проверить итоговую конфигурацию:\ndocker compose \\\n  -f docker-compose.yml \\\n  -f docker-compose.prod.yml \\\n  --env-file .env.prod \\\n  config\n\nchmod +x deploy.sh\n./deploy.sh dev\n./deploy.sh prod',
      explanation: 'Разделение конфигураций по окружениям: base содержит общее, отдельные файлы добавляют специфику. Скрипт deploy.sh скрывает сложность выбора файлов. В CI/CD скрипт вызывается с параметром окружения. --env-file позволяет использовать разные пароли для каждого окружения.'
    },
    {
      id: 4,
      title: 'Задача 4: Горизонтальное масштабирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой масштабирование сервиса с load balancing через nginx.',
      requirements: [
        'Создай простой веб-сервис который возвращает имя контейнера',
        'Запусти 3 экземпляра через --scale',
        'Настрой nginx как load balancer для этих трёх экземпляров',
        'Проверь что запросы распределяются между экземплярами (round-robin)',
        'Убедись что нет фиксированных портов у масштабируемого сервиса',
        'Масштабируй до 5 экземпляров без остановки nginx'
      ],
      hint: 'Нельзя указывать ports если replicas > 1. nginx upstream с Docker service discovery. resolver 127.0.0.11 в nginx. docker compose up --scale app=3.',
      solution: '# app/app.py:\n# from flask import Flask\n# import socket\n# app = Flask(__name__)\n# @app.get("/")\n# def index():\n#     return f"Hello from {socket.gethostname()}\\n"\n# app.run(host="0.0.0.0", port=5000)\n\n# docker-compose.yml:\n# services:\n#   app:\n#     build: ./app\n#     # НЕТ ports! Масштабируем без конфликтов\n#     networks: [backend]\n#\n#   nginx:\n#     image: nginx:alpine\n#     ports: ["80:80"]\n#     volumes:\n#       - ./nginx.conf:/etc/nginx/conf.d/default.conf\n#     networks: [frontend, backend]\n#\n# networks:\n#   frontend:\n#   backend:\n\n# nginx.conf с upstream (Compose service discovery):\n# upstream app {\n#   server app:5000;  # Docker DNS разрешит все экземпляры\n# }\n# server {\n#   listen 80;\n#   location / {\n#     proxy_pass http://app;\n#   }\n# }\n\n# Запустить 3 экземпляра:\ndocker compose up -d --scale app=3\ndocker compose ps\n# NAME       STATUS\n# myapp-app-1 Up\n# myapp-app-2 Up\n# myapp-app-3 Up\n# myapp-nginx-1 Up\n\n# Проверить балансировку:\nfor i in $(seq 10); do curl -s http://localhost; done\n# Hello from myapp-app-1\n# Hello from myapp-app-2\n# Hello from myapp-app-3\n# Hello from myapp-app-1\n# ...\n\n# Масштабировать до 5:\ndocker compose up -d --scale app=5',
      explanation: 'Docker DNS с service discovery: когда nginx обращается к "app", Docker DNS возвращает IP всех экземпляров. nginx делает round-robin между ними. Для production load balancing нужны sticky sessions (ip_hash), healthcheck в upstream, и оркестратор. Этот паттерн работает для stateless сервисов.'
    },
    {
      id: 5,
      title: 'Задача 5: Сложные зависимости и порядок запуска',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настрой правильный порядок запуска для стека с несколькими зависимостями.',
      requirements: [
        'Стек: postgres -> redis -> migrations -> app -> nginx',
        'migrations запускается один раз и применяет схему',
        'app стартует только после успешных migrations',
        'nginx стартует только после healthy app',
        'Если migrations провалится — app не запускается',
        'Продемонстрируй что повторный up не применяет migrations повторно'
      ],
      hint: 'condition: service_healthy для живых сервисов. condition: service_completed_successfully для job (migrations). restart: "no" для migrations.',
      solution: '# docker-compose.yml:\n# services:\n#   postgres:\n#     image: postgres:15-alpine\n#     environment: {POSTGRES_PASSWORD: secret, POSTGRES_DB: myapp}\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#\n#   redis:\n#     image: redis:7-alpine\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       retries: 3\n#\n#   migrations:\n#     image: postgres:15-alpine\n#     command: |\n#       bash -c "psql -h postgres -U postgres -d myapp -c \'\n#         CREATE TABLE IF NOT EXISTS migrations_applied (id SERIAL, name TEXT, applied_at TIMESTAMP DEFAULT NOW());\n#         INSERT INTO migrations_applied(name) VALUES(\\\'v1_init\\\') ON CONFLICT DO NOTHING;\n#       \'"\n#     environment: {PGPASSWORD: secret}\n#     depends_on:\n#       postgres:\n#         condition: service_healthy\n#     restart: "no"\n#\n#   app:\n#     image: nginx:alpine\n#     healthcheck:\n#       test: ["CMD-SHELL", "wget -q -O- http://localhost/"]\n#       interval: 5s\n#       retries: 3\n#     depends_on:\n#       migrations:\n#         condition: service_completed_successfully\n#       redis:\n#         condition: service_healthy\n#\n#   nginx-proxy:\n#     image: nginx:alpine\n#     ports: ["80:80"]\n#     depends_on:\n#       app:\n#         condition: service_healthy\n\ndocker compose up -d\ndocker compose ps\n# Порядок: postgres -> redis -> migrations -> app -> nginx-proxy\n\n# Повторный запуск:\ndocker compose up -d\n# migrations уже completed_successfully — не запускается повторно!',
      explanation: 'Цепочка зависимостей: каждый сервис ждёт предыдущий. service_healthy для длительных сервисов, service_completed_successfully для одноразовых задач. Если migrations упадёт — app не стартует. Это надёжнее чем просто depends_on (который ждёт только старт, не готовность).'
    },
    {
      id: 6,
      title: 'Задача 6: Compose с secrets и profiles',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настрой безопасный Compose с секретами через файлы и условным запуском через profiles.',
      requirements: [
        'Создай файлы секретов для DB пароля и API ключа',
        'Приложение читает секреты из /run/secrets/, не из ENV',
        'Profiles: основные сервисы (app, db), dev (adminer, mailhog), monitoring (prometheus)',
        'Докажи что секреты не видны в docker inspect',
        'Запусти с разными комбинациями profiles',
        'Добавь YAML anchor для общей logging конфигурации'
      ],
      hint: 'secrets: db_password: file: ./secrets/db_password.txt. APP_DB_PASSWORD_FILE=/run/secrets/db_password. profiles: [dev] для dev-инструментов.',
      solution: '# Создать секреты:\nmkdir -p secrets\necho "devdbpassword" > secrets/db_password.txt\necho "sk-api-key-12345" > secrets/api_key.txt\nchmod 600 secrets/*.txt\n\n# docker-compose.yml:\n# x-logging: &logging\n#   logging:\n#     driver: json-file\n#     options: {max-size: "10m", max-file: "3"}\n#\n# services:\n#   app:\n#     build: .\n#     <<: *logging\n#     secrets: [db_password, api_key]\n#     environment:\n#       DB_PASSWORD_FILE: /run/secrets/db_password\n#       API_KEY_FILE: /run/secrets/api_key\n#\n#   db:\n#     image: postgres:15-alpine\n#     <<: *logging\n#     secrets: [db_password]\n#     environment:\n#       POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n#\n#   adminer:\n#     image: adminer\n#     profiles: [dev]\n#     ports: ["8080:8080"]\n#\n#   mailhog:\n#     image: mailhog/mailhog\n#     profiles: [dev]\n#     ports: ["8025:8025", "1025:1025"]\n#\n#   prometheus:\n#     image: prom/prometheus\n#     profiles: [monitoring]\n#     ports: ["9090:9090"]\n#\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n#   api_key:\n#     file: ./secrets/api_key.txt\n\n# Запустить только основное:\ndocker compose up -d\n\n# С dev инструментами:\ndocker compose --profile dev up -d\n\n# Проверить что секрет НЕ виден в ENV:\ndocker inspect $(docker compose ps -q app) --format "{{.Config.Env}}"\n# Нет паролей! Только ссылки на файлы\n\n# Секрет доступен только внутри контейнера:\ndocker exec $(docker compose ps -q app) cat /run/secrets/db_password\n# devdbpassword',
      explanation: 'Secrets через файлы безопаснее ENV переменных: не видны в docker inspect, не логируются случайно, поддерживают ротацию (перемонтировать файл). YAML anchors устраняют дублирование logging конфига. Profiles разделяют разработку и production: docker compose --profile dev включает только нужные инструменты.'
    },
    {
      id: 7,
      title: 'Задача 7: Реальный production стек',
      type: 'practice',
      difficulty: 'hard',
      description: 'Полноценный production Compose для e-commerce приложения.',
      requirements: [
        'Сервисы: frontend (React/nginx), backend (FastAPI), postgres, redis, celery-worker',
        'Nginx reverse proxy для SSL termination и routing',
        'Celery для фоновых задач (обработка заказов)',
        'Все секреты через файлы',
        'Healthcheck для всех сервисов',
        'Ресурсные лимиты: backend 512M, worker 256M, db 1G',
        'Logging с ротацией для всех сервисов'
      ],
      hint: 'Celery подключается к Redis как broker. FastAPI имеет /metrics endpoint для Prometheus. celery worker --app=tasks beat --app=tasks для scheduler. CELERY_BROKER_URL=redis://redis:6379/0.',
      solution: '# Полная структура проекта:\n# .\n# docker-compose.yml\n# .env\n# secrets/ (в .gitignore)\n#   db_password.txt\n#   redis_password.txt\n#   secret_key.txt\n# frontend/\n#   Dockerfile (multi-stage: node + nginx)\n# backend/\n#   Dockerfile (python:3.11-slim)\n#   app/main.py\n#   tasks.py (celery tasks)\n# nginx/\n#   nginx.conf\n\n# docker-compose.yml:\n# x-common: &common\n#   restart: unless-stopped\n#   logging:\n#     driver: json-file\n#     options: {max-size: "10m", max-file: "3"}\n#\n# services:\n#   nginx:\n#     image: nginx:alpine\n#     <<: *common\n#     ports: ["80:80", "443:443"]\n#     volumes:\n#       - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro\n#       - ssl_certs:/etc/nginx/certs\n#     networks: [frontend]\n#     depends_on:\n#       frontend:\n#         condition: service_healthy\n#       backend:\n#         condition: service_healthy\n#\n#   frontend:\n#     build: ./frontend\n#     <<: *common\n#     networks: [frontend]\n#     healthcheck:\n#       test: ["CMD", "wget", "-q", "-O-", "http://localhost/"]\n#       interval: 10s\n#       retries: 3\n#\n#   backend:\n#     build: ./backend\n#     <<: *common\n#     secrets: [db_password, secret_key]\n#     networks: [frontend, backend]\n#     depends_on:\n#       postgres: {condition: service_healthy}\n#       redis: {condition: service_healthy}\n#     deploy:\n#       resources:\n#         limits: {memory: 512M}\n#     healthcheck:\n#       test: ["CMD", "curl", "-f", "http://localhost:8000/health"]\n#       interval: 10s\n#       retries: 3\n#\n#   celery-worker:\n#     build: ./backend\n#     command: celery -A tasks worker --loglevel=info\n#     <<: *common\n#     secrets: [db_password]\n#     networks: [backend]\n#     depends_on:\n#       postgres: {condition: service_healthy}\n#       redis: {condition: service_healthy}\n#     deploy:\n#       resources:\n#         limits: {memory: 256M}\n#\n#   postgres:\n#     image: postgres:15-alpine\n#     <<: *common\n#     secrets: [db_password]\n#     environment:\n#       POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n#       POSTGRES_DB: shop\n#     volumes:\n#       - pg_data:/var/lib/postgresql/data\n#     networks: [backend]\n#     deploy:\n#       resources:\n#         limits: {memory: 1G}\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#\n#   redis:\n#     image: redis:7-alpine\n#     <<: *common\n#     networks: [backend]\n#     deploy:\n#       resources:\n#         limits: {memory: 256M}\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       retries: 3\n#\n# networks:\n#   frontend:\n#   backend:\n#     internal: true\n#\n# volumes:\n#   pg_data:\n#   ssl_certs:\n#\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n#   secret_key:\n#     file: ./secrets/secret_key.txt\n\ndocker compose up -d\ndocker compose ps\ndocker compose logs -f backend',
      explanation: 'Production Compose применяет все best practices: x-common anchor для повторяемой конфигурации, secrets для паролей, healthcheck с depends_on для надёжного запуска, ресурсные лимиты против OOM, сетевая изоляция (frontend/backend), logging с ротацией. Celery для фоновых задач — стандарт для e-commerce (email, обработка платежей).'
    },
    {
      id: 8,
      title: 'Задача 8: Миграция с docker run на Compose',
      type: 'practice',
      difficulty: 'medium',
      description: 'Преобразуй набор docker run команд в правильный docker-compose.yml.',
      requirements: [
        'Дан набор docker run команд для запуска стека — конвертируй в Compose',
        'Выяви неявные зависимости и добавь depends_on',
        'Найди проблемы безопасности (пароли в ENV) и исправь',
        'Добавь healthcheck которых не было в оригинале',
        'Добавь volumes для данных которые терялись при перезапуске',
        'Проверь что стек работает идентично оригинальным командам'
      ],
      hint: 'Каждый docker run — отдельный сервис. -e -> environment. -v -> volumes. -p -> ports. --network -> networks. --name -> container_name (если нужно).',
      solution: '# Исходные docker run команды:\n# docker network create app-net\n# docker volume create pgdata\n# docker run -d --name postgres \\\n#   --network app-net \\\n#   -v pgdata:/var/lib/postgresql/data \\\n#   -e POSTGRES_PASSWORD=verysecret123 \\\n#   postgres:15\n# docker run -d --name redis \\\n#   --network app-net \\\n#   redis:7\n# docker run -d --name myapp \\\n#   --network app-net \\\n#   -p 3000:3000 \\\n#   -e DATABASE_URL=postgresql://postgres:verysecret123@postgres/postgres \\\n#   -e REDIS_URL=redis://redis:6379 \\\n#   myapp:latest\n\n# docker-compose.yml (исправленная версия):\n# services:\n#   postgres:\n#     image: postgres:15\n#     secrets:\n#       - db_password  # Исправлено: пароль не в ENV!\n#     environment:\n#       POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n#     volumes:\n#       - pgdata:/var/lib/postgresql/data\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#\n#   redis:\n#     image: redis:7\n#     networks:\n#       - backend\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       retries: 3\n#\n#   app:\n#     image: myapp:latest\n#     ports:\n#       - "3000:3000"\n#     environment:\n#       DATABASE_URL: postgresql://postgres@postgres/postgres\n#       REDIS_URL: redis://redis:6379\n#     secrets:\n#       - db_password\n#     networks:\n#       - backend\n#     depends_on:\n#       postgres: {condition: service_healthy}\n#       redis: {condition: service_healthy}\n#\n# networks:\n#   backend:\n#     internal: true  # Добавлено: изоляция сети\n#\n# volumes:\n#   pgdata:\n#\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n\ndocker compose up -d\ndocker compose ps\n\n# Проверить:\ncurl http://localhost:3000',
      explanation: 'Конвертация docker run -> Compose выявляет проблемы: пароли в ENV (исправлено на secrets), отсутствие healthcheck (добавлено), отсутствие зависимостей (добавлен depends_on с condition). Compose не только упрощает управление но и подталкивает к best practices. internal: true для backend сети — дополнительная безопасность.'
    }
  ]
}
