export default {
  id: 17,
  title: 'Практикум: Контейнеризация приложений',
  description: 'Практические задания по контейнеризации различных типов приложений. Только практика — от простого к сложному.',
  lessons: [
    {
      id: 1,
      title: 'Задача 1: Контейнеризация статического сайта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Упакуй статический HTML/CSS/JS сайт в Docker образ с nginx.',
      requirements: [
        'Создай простой HTML файл с заголовком "Мой первый Docker сайт"',
        'Напиши Dockerfile на основе nginx:alpine',
        'Добавь кастомный nginx.conf для кэширования статики',
        'Соберись образ с тегом mysite:1.0.0',
        'Запусти контейнер, проверь в браузере',
        'Измерь размер образа'
      ],
      hint: 'COPY index.html /usr/share/nginx/html/. Nginx config: expires 30d для статических файлов. docker images mysite для размера.',
      expectedOutput: 'docker build успешно завершён.\n\ncurl http://localhost:8080:\n<html><body><h1>Мой первый Docker сайт</h1></body></html>\n\ndocker images mysite:\nREPOSITORY   TAG     IMAGE ID   SIZE\nmysite       1.0.0   abc123     23.4MB',
      solution: '# index.html:\n# <html><body><h1>Мой первый Docker сайт</h1></body></html>\n\n# nginx.conf:\n# server {\n#   listen 80;\n#   location / {\n#     root /usr/share/nginx/html;\n#     index index.html;\n#     expires 30d;\n#     add_header Cache-Control "public";\n#   }\n# }\n\n# Dockerfile:\n# FROM nginx:alpine\n# COPY nginx.conf /etc/nginx/conf.d/default.conf\n# COPY index.html /usr/share/nginx/html/\n# EXPOSE 80\n\ndocker build -t mysite:1.0.0 .\ndocker run -d -p 8080:80 --name mysite mysite:1.0.0\ncurl http://localhost:8080\ndocker images mysite\n# mysite  1.0.0  ...  23MB  <- очень маленький!',
      explanation: 'nginx:alpine — идеальная база для статики. Весь сайт занимает ~23MB. Кэширование через nginx конфиг повышает производительность. Это паттерн для деплоя React/Vue/Angular SPA после npm run build.'
    },
    {
      id: 2,
      title: 'Задача 2: Python скрипт в Docker',
      type: 'practice',
      difficulty: 'easy',
      description: 'Упакуй Python скрипт обработки данных в Docker с зависимостями.',
      requirements: [
        'Создай Python скрипт который читает CSV файл и считает статистику',
        'Создай requirements.txt с pandas и numpy',
        'Напиши Dockerfile с python:3.11-alpine',
        'Настрой bind mount для передачи CSV файла в контейнер',
        'Запусти скрипт и получи вывод статистики',
        'Убедись что работает без виртуального окружения'
      ],
      hint: 'alpine может требовать: apk add --no-cache musl-dev g++ для pandas. Альтернатива: python:3.11-slim для лучшей совместимости. ENTRYPOINT ["python", "stats.py"].',
      expectedOutput: 'docker run --rm -v $(pwd)/data.csv:/data/input.csv stats:latest:\n       value\ncount   3.000000\nmean   15.000000\nstd     5.000000\nmin    10.000000\n25%    12.500000\n50%    15.000000\n75%    17.500000\nmax    20.000000\n\nRows: 3',
      solution: '# stats.py:\n# import pandas as pd\n# import sys\n# df = pd.read_csv(sys.argv[1] if len(sys.argv) > 1 else "/data/input.csv")\n# print(df.describe())\n# print(f"\\nRows: {len(df)}")\n\n# requirements.txt:\n# pandas==2.1.4\n# numpy==1.26.2\n\n# Dockerfile:\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt\n# COPY stats.py .\n# ENTRYPOINT ["python", "stats.py"]\n\ndocker build -t stats:latest .\n\n# Запустить с данными:\necho "name,value\\nalice,10\\nbob,20\\ncarol,15" > data.csv\ndocker run --rm -v $(pwd)/data.csv:/data/input.csv stats:latest\n# count  3.000000\n# mean   15.000000\n# ...\n\n# Передать файл как аргумент:\ndocker run --rm -v $(pwd):/data stats:latest /data/data.csv',
      explanation: 'Docker упрощает распространение Python скриптов с зависимостями — получатель не устанавливает Python и библиотеки. Bind mount для данных позволяет использовать контейнер как CLI инструмент. ENTRYPOINT + CMD = гибкость: можно переопределить аргументы не переопределяя команду.'
    },
    {
      id: 3,
      title: 'Задача 3: Node.js API с базой данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Контейнеризируй Express.js REST API с PostgreSQL.',
      requirements: [
        'Создай Express.js приложение с эндпоинтами GET/POST /api/todos',
        'Используй pg (node-postgres) для работы с PostgreSQL',
        'Напиши Dockerfile с node:18-alpine (два stage: deps + runtime)',
        'Создай docker-compose.yml с api и postgres сервисами',
        'Настрой healthcheck для postgres',
        'Инициализируй таблицу через init SQL файл'
      ],
      hint: 'COPY package*.json ./; RUN npm ci для кэша. /docker-entrypoint-initdb.d/ для init SQL в postgres. pg_isready для healthcheck. Переменная DB_URL из environment.',
      expectedOutput: 'docker compose up -d — сервисы запущены.\n\ncurl -X POST -H "Content-Type: application/json" -d \'{"title":"First todo"}\' http://localhost:3000/api/todos:\n{"id":1,"title":"First todo","done":false}\n\ncurl http://localhost:3000/api/todos:\n[{"id":1,"title":"First todo","done":false}]',
      solution: '# app.js:\n# const express = require("express")\n# const { Pool } = require("pg")\n# const app = express()\n# app.use(express.json())\n# const pool = new Pool({ connectionString: process.env.DB_URL })\n# app.get("/api/todos", async (req, res) => {\n#   const { rows } = await pool.query("SELECT * FROM todos")\n#   res.json(rows)\n# })\n# app.post("/api/todos", async (req, res) => {\n#   const { title } = req.body\n#   const { rows } = await pool.query("INSERT INTO todos(title) VALUES($1) RETURNING *", [title])\n#   res.json(rows[0])\n# })\n# app.listen(3000, () => console.log("Server running on port 3000"))\n\n# init.sql:\n# CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title TEXT NOT NULL, done BOOL DEFAULT false);\n\n# Dockerfile:\n# FROM node:18-alpine AS deps\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm ci --only=production\n# FROM node:18-alpine AS runtime\n# WORKDIR /app\n# COPY --from=deps /app/node_modules ./node_modules\n# COPY app.js .\n# USER node\n# EXPOSE 3000\n# CMD ["node", "app.js"]\n\n# docker-compose.yml:\n# services:\n#   api:\n#     build: .\n#     ports: ["3000:3000"]\n#     environment:\n#       DB_URL: postgresql://postgres:secret@db/myapp\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#   db:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_PASSWORD: secret\n#       POSTGRES_DB: myapp\n#     volumes:\n#       - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro\n#       - db_data:/var/lib/postgresql/data\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n# volumes:\n#   db_data:\n\ndocker compose up -d\ncurl -X POST -H "Content-Type: application/json" -d \'{"title":"First todo"}\' http://localhost:3000/api/todos\ncurl http://localhost:3000/api/todos',
      explanation: 'Реальный production паттерн: multi-stage Dockerfile (deps stage кэширует npm ci), healthcheck перед запуском api, init SQL для инициализации БД, named volume для данных. Этот шаблон подходит для любого Node.js + PostgreSQL проекта.'
    },
    {
      id: 4,
      title: 'Задача 4: Миграция базы данных в Docker',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой автоматические миграции БД как отдельный сервис в Compose.',
      requirements: [
        'Создай три SQL файла миграций: V1__create_users.sql, V2__add_email.sql, V3__add_index.sql',
        'Настрой Flyway (или использ Python скрипт) для применения миграций',
        'В docker-compose.yml: migrate сервис запускается перед app',
        'migrate сервис должен завершаться после применения миграций',
        'app запускается только после service_completed_successfully',
        'Проверь что повторный docker compose up не применяет миграции снова'
      ],
      hint: 'flyway/flyway образ для миграций. restart: "no" для migrate сервиса. condition: service_completed_successfully в depends_on. Flyway хранит историю миграций в таблице flyway_schema_history.',
      expectedOutput: 'docker compose up -d — запуск всех сервисов.\n\nLogs migrate:\nFlyway Community Edition v10.x\nDatabase: jdbc:postgresql://db:5432/myapp\nSuccessfully applied 3 migrations to schema "public"\n\nSELECT * FROM flyway_schema_history:\n installed_rank | version | description | type | script             | success\n---------------+---------+-------------+------+--------------------+---------\n             1 | 1       | create users| SQL  | V1__create_users   | t\n             2 | 2       | add email   | SQL  | V2__add_email      | t\n             3 | 3       | add index   | SQL  | V3__add_index      | t\n\nПовторный docker compose up: migrate не запускается повторно (статус Exited).',
      solution: '# V1__create_users.sql:\n# CREATE TABLE users (\n#   id SERIAL PRIMARY KEY,\n#   username VARCHAR(50) UNIQUE NOT NULL,\n#   created_at TIMESTAMP DEFAULT NOW()\n# );\n\n# V2__add_email.sql:\n# ALTER TABLE users ADD COLUMN email VARCHAR(100);\n\n# V3__add_index.sql:\n# CREATE INDEX idx_users_email ON users(email);\n\n# docker-compose.yml:\n# services:\n#   db:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_PASSWORD: secret\n#       POSTGRES_DB: myapp\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#     volumes:\n#       - db_data:/var/lib/postgresql/data\n#\n#   migrate:\n#     image: flyway/flyway:10\n#     command: >\n#       -url=jdbc:postgresql://db:5432/myapp\n#       -user=postgres\n#       -password=secret\n#       -connectRetries=5\n#       migrate\n#     volumes:\n#       - ./migrations:/flyway/sql\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#     restart: "no"\n#\n#   app:\n#     image: nginx:alpine\n#     depends_on:\n#       migrate:\n#         condition: service_completed_successfully\n#\n# volumes:\n#   db_data:\n\ndocker compose up -d\n\n# Проверить применение миграций:\ndocker exec $(docker compose ps -q db) psql -U postgres -d myapp -c "SELECT * FROM flyway_schema_history;"\n\n# Повторный запуск — миграции пропускаются:\ndocker compose up -d  # Flyway видит что V1,V2,V3 применены',
      explanation: 'Отдельный migrate сервис — правильный паттерн. Миграции применяются один раз при старте, не при каждом перезапуске app. service_completed_successfully гарантирует что app стартует только после успешных миграций. Flyway (или Liquibase, Alembic, golang-migrate) хранит версию схемы в специальной таблице.'
    },
    {
      id: 5,
      title: 'Задача 5: Микросервисная архитектура',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай три микросервиса которые взаимодействуют через HTTP API.',
      requirements: [
        'Сервис users (Python/Flask): CRUD операции с пользователями',
        'Сервис orders (Node.js/Express): заказы, обращается к users для проверки',
        'Сервис gateway (nginx): маршрутизирует /api/users -> users, /api/orders -> orders',
        'Каждый сервис в своём контейнере с Dockerfile',
        'Compose: правильные сети, только gateway публикует порт',
        'Сервисы видят друг друга по имени через Docker DNS'
      ],
      hint: 'nginx proxy_pass http://users:5000 для маршрутизации. Flask на порту 5000, Express на 3000. Только gateway в сети frontend + backend, остальные только в backend. resolver 127.0.0.11 valid=30s в nginx для Docker DNS.',
      expectedOutput: 'docker compose up -d — три контейнера запущены.\n\ncurl http://localhost/api/users/1:\n{"name": "Alice"}\n\ncurl http://localhost/api/orders/1:\n{"userId": "1", "user": {"name": "Alice"}, "orders": []}\n\nPрямой доступ к users:5000 снаружи невозможен — internal сеть.',
      solution: '# users/app.py (Flask):\n# from flask import Flask, jsonify\n# app = Flask(__name__)\n# users = {1: {"name": "Alice"}, 2: {"name": "Bob"}}\n# @app.route("/users/<int:id>")\n# def get_user(id): return jsonify(users.get(id, {}))\n# @app.route("/health")\n# def health(): return {"status": "ok"}\n# app.run(host="0.0.0.0", port=5000)\n\n# orders/app.js (Express):\n# const express = require("express")\n# const axios = require("axios")\n# const app = express()\n# app.get("/orders/:userId", async (req, res) => {\n#   const user = await axios.get(`http://users:5000/users/${req.params.userId}`)\n#   res.json({userId: req.params.userId, user: user.data, orders: []})\n# })\n# app.listen(3000)\n\n# nginx/nginx.conf:\n# upstream users { server users:5000; }\n# upstream orders { server orders:3000; }\n# server {\n#   listen 80;\n#   location /api/users/ { proxy_pass http://users/; }\n#   location /api/orders/ { proxy_pass http://orders/; }\n# }\n\n# docker-compose.yml:\n# services:\n#   gateway:\n#     build: ./nginx\n#     ports: ["80:80"]\n#     networks: [frontend, backend]\n#   users:\n#     build: ./users\n#     networks: [backend]\n#   orders:\n#     build: ./orders\n#     networks: [backend]\n# networks:\n#   frontend:\n#   backend: { internal: true }\n\ndocker compose up -d\ncurl http://localhost/api/users/1\ncurl http://localhost/api/orders/1',
      explanation: 'Микросервисная архитектура в Docker: каждый сервис независимо разрабатывается и деплоится. nginx gateway — единая точка входа. Внутренняя сеть (backend, internal: true) изолирует сервисы от прямого внешнего доступа. Docker DNS позволяет обращаться по именам сервисов.'
    },
    {
      id: 6,
      title: 'Задача 6: Blue-Green деплой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй blue-green деплой для веб-приложения с нулевым downtime.',
      requirements: [
        'Запусти "blue" версию приложения (nginx с текстом "Version 1.0")',
        'Запусти nginx-proxy который проксирует трафик на blue',
        'Подними "green" версию (nginx с текстом "Version 2.0") на другом порту',
        'Переключи proxy с blue на green без остановки сервиса',
        'Убедись что в момент переключения нет downtime (curl в loop)',
        'Удали blue контейнер после успешного переключения'
      ],
      hint: 'docker network connect/disconnect для переключения. nginx -s reload после изменения upstream. curl в loop для проверки: while true; do curl -s localhost; sleep 0.1; done.',
      expectedOutput: 'curl http://localhost (до переключения):\nVersion 1.0\n\ndocker exec proxy nginx -s reload:\n2026/03/21 10:00:00 [notice] 1#1: signal process started\n\ncurl http://localhost (после переключения):\nVersion 2.0\n\nCurl в loop не показывает ошибок при переключении — downtime 0.',
      solution: '# Запустить blue:\ndocker run -d --name blue --network mynet nginx\ndocker exec blue bash -c "echo \'Version 1.0\' > /usr/share/nginx/html/index.html"\n\n# Создать сеть и proxy:\ndocker network create mynet\n\n# Proxy nginx.conf:\n# upstream app { server blue:80; }\n# server { listen 80; location / { proxy_pass http://app; }}\n\ndocker run -d --name proxy --network mynet -p 80:80 \\\n  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \\\n  nginx\n\ncurl http://localhost  # Version 1.0\n\n# Запустить green:\ndocker run -d --name green --network mynet nginx\ndocker exec green bash -c "echo \'Version 2.0\' > /usr/share/nginx/html/index.html"\n\n# Переключить: изменить upstream на green:\n# sed -i \'s/server blue:80/server green:80/\' nginx.conf\ndocker exec proxy nginx -s reload\n\ncurl http://localhost  # Version 2.0\n\n# Проверить без downtime:\n# В отдельном терминале:\n# while true; do curl -s http://localhost; sleep 0.1; done\n# Не должно быть пустых строк или ошибок!\n\n# Удалить blue:\ndocker stop blue && docker rm blue',
      explanation: 'Blue-green деплой: одновременно работают две версии, переключение происходит мгновенно через изменение nginx upstream. Rollback так же быстр: переключить обратно на blue. Nginx reload (не restart) применяет конфиг без downtime — graceful reload завершает текущие соединения.'
    },
    {
      id: 7,
      title: 'Задача 7: Мониторинг стека приложений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь мониторинг (Prometheus + Grafana) к существующему приложению.',
      requirements: [
        'Запусти любое приложение (nginx или простой HTTP сервер)',
        'Добавь prometheus и grafana в docker-compose.yml',
        'Настрой nginx-prometheus-exporter для метрик nginx',
        'Создай конфиг prometheus.yml с target для экспортёра',
        'Настрой Grafana с Prometheus как data source',
        'Импортируй или создай дашборд с метриками nginx'
      ],
      hint: 'prom/prometheus образ. nginx/nginx-prometheus-exporter образ. grafana/grafana образ. prometheus.yml: scrape_configs -> targets. Grafana: admin/admin по умолчанию.',
      expectedOutput: 'docker compose up -d — все 4 сервиса запущены.\n\nPrometheus http://localhost:9090 — targets: nginx-exporter UP.\n\nGrafana http://localhost:3000 — вход с admin/admin.\nДatasource Prometheus добавлен: http://prometheus:9090 — статус OK.\n\nДашборд nginx (ID 12708) импортирован и показывает метрики:\nnginx_connections_active, nginx_requests_total.',
      solution: '# docker-compose.yml:\n# services:\n#   nginx:\n#     image: nginx:alpine\n#     ports: ["8080:80"]\n#     volumes:\n#       - ./nginx.conf:/etc/nginx/conf.d/default.conf\n#\n#   nginx-exporter:\n#     image: nginx/nginx-prometheus-exporter:1.0\n#     command: --nginx.scrape-uri=http://nginx/nginx_status\n#     ports: ["9113:9113"]\n#     depends_on: [nginx]\n#\n#   prometheus:\n#     image: prom/prometheus\n#     ports: ["9090:9090"]\n#     volumes:\n#       - ./prometheus.yml:/etc/prometheus/prometheus.yml\n#\n#   grafana:\n#     image: grafana/grafana\n#     ports: ["3000:3000"]\n#     environment:\n#       GF_SECURITY_ADMIN_PASSWORD: admin\n#     volumes:\n#       - grafana_data:/var/lib/grafana\n#\n# volumes:\n#   grafana_data:\n\n# nginx.conf (добавить stub_status):\n# server {\n#   listen 80;\n#   location /nginx_status { stub_status on; allow 127.0.0.1; deny all; }\n# }\n\n# prometheus.yml:\n# global:\n#   scrape_interval: 15s\n# scrape_configs:\n#   - job_name: nginx\n#     static_configs:\n#       - targets: [\'nginx-exporter:9113\']\n\ndocker compose up -d\n# Grafana: http://localhost:3000 (admin/admin)\n# Prometheus: http://localhost:9090\n# Добавить datasource: http://prometheus:9090\n# Импортировать dashboard ID: 12708 (nginx)',
      explanation: 'Стандартный мониторинг стек: Prometheus собирает метрики через pull model, экспортёры преобразуют метрики приложений в Prometheus формат, Grafana визуализирует. Для Docker контейнеров добавь cAdvisor для системных метрик. Это основа для SRE/DevOps мониторинга.'
    },
    {
      id: 8,
      title: 'Задача 8: Автоматизация бэкапов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай автоматическую систему бэкапов PostgreSQL данных.',
      requirements: [
        'Запусти PostgreSQL с данными (создай таблицы и записи)',
        'Создай скрипт backup.sh который делает pg_dump и сохраняет с timestamp',
        'Запусти бэкап в отдельном контейнере с доступом к postgres сети',
        'Настрой автоматический бэкап каждые 5 минут через cron контейнер',
        'Проверь восстановление из бэкапа',
        'Добавь ротацию: удалять бэкапы старше 7 дней'
      ],
      hint: 'pg_dump -U postgres -d mydb | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz. cron в контейнере: supercronic или ofelia. docker run --rm для одноразового бэкапа.',
      expectedOutput: 'Ручной бэкап:\nBackup created: /backups/backup_20260321_100000.sql.gz\nOld backups cleaned\n\nls -lh backups/:\n-rw-r--r-- 1 root root 2.1K Mar 21 10:00 backup_20260321_100000.sql.gz\n\nВосстановление прошло успешно — данные в таблицах совпадают с исходными.\n\nOfelia запускает бэкап каждые 5 минут автоматически.',
      solution: '# backup.sh:\n# #!/bin/bash\n# DATE=$(date +%Y%m%d_%H%M%S)\n# BACKUP_FILE="/backups/backup_${DATE}.sql.gz"\n# pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"\n# echo "Backup created: $BACKUP_FILE"\n# find /backups -name "*.sql.gz" -mtime +7 -delete\n# echo "Old backups cleaned"\n\n# Dockerfile для backup:\n# FROM postgres:15-alpine\n# COPY backup.sh /backup.sh\n# RUN chmod +x /backup.sh\n# CMD ["/backup.sh"]\n\n# Ручной бэкап:\ndocker run --rm \\\n  --network myapp_backend \\\n  -v $(pwd)/backups:/backups \\\n  -e DB_HOST=db \\\n  -e DB_USER=postgres \\\n  -e DB_NAME=myapp \\\n  -e PGPASSWORD=secret \\\n  mybackup:latest\n\n# Автоматический через ofelia (cron для Docker):\n# docker-compose.yml дополнение:\n# ofelia:\n#   image: mcuadros/ofelia:latest\n#   volumes:\n#     - /var/run/docker.sock:/var/run/docker.sock\n#     - ./ofelia.ini:/etc/ofelia/config.ini\n\n# ofelia.ini:\n# [job-run "postgres-backup"]\n# schedule = @every 5m\n# container = myapp_db_1\n# command = /backup.sh\n\n# Восстановление:\ngunzip -c backups/backup_20240115_120000.sql.gz | \\\n  docker exec -i db psql -U postgres myapp',
      explanation: 'pg_dump даёт логический бэкап который легко переносить и восстанавливать. Сжатие gzip уменьшает размер в 5-10 раз. Автоматизация через ofelia (или cron) обеспечивает регулярные бэкапы. Ротация предотвращает переполнение диска. Всегда проверяй что бэкапы можно восстановить!'
    },
    {
      id: 9,
      title: 'Задача 9: Docker в тестировании',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой запуск integration тестов с реальными зависимостями.',
      requirements: [
        'Напиши Python тесты которые проверяют CRUD операции с PostgreSQL',
        'Создай docker-compose.test.yml с test-runner и postgres',
        'Тесты должны запускаться в изолированном окружении',
        'После завершения тестов все контейнеры удаляются',
        'Exit code из тестов должен передаваться в CI',
        'Тесты должны создавать чистую БД перед каждым запуском'
      ],
      hint: 'docker compose up --abort-on-container-exit --exit-code-from test-runner. pytest --create-db или fixtures в conftest.py. docker compose -f docker-compose.test.yml down -v после тестов.',
      expectedOutput: 'docker compose -f docker-compose.test.yml up:\ntest-runner_1  | ============================= test session starts ==============================\ntest-runner_1  | collected 1 item\ntest-runner_1  | tests/test_db.py::test_insert PASSED\ntest-runner_1  | ======================== 1 passed in 0.23s ==============================\ntest-runner_1 exited with code 0\n\nВсе контейнеры и volumes удалены после завершения тестов.',
      solution: '# tests/test_db.py:\n# import pytest\n# import asyncpg\n# import os\n# \n# @pytest.fixture(scope="session")\n# async def db():\n#     conn = await asyncpg.connect(os.environ["DATABASE_URL"])\n#     await conn.execute("CREATE TABLE IF NOT EXISTS items (id SERIAL, name TEXT)")\n#     yield conn\n#     await conn.execute("DROP TABLE IF EXISTS items")\n#     await conn.close()\n#\n# async def test_insert(db):\n#     await db.execute("INSERT INTO items(name) VALUES($1)", "test")\n#     row = await db.fetchrow("SELECT * FROM items WHERE name=$1", "test")\n#     assert row["name"] == "test"\n\n# docker-compose.test.yml:\n# services:\n#   test-runner:\n#     build:\n#       context: .\n#       target: test\n#     command: pytest tests/ -v\n#     environment:\n#       DATABASE_URL: postgresql://postgres:test@db/testdb\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#\n#   db:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_PASSWORD: test\n#       POSTGRES_DB: testdb\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#     tmpfs:\n#       - /var/lib/postgresql/data  # В памяти — быстрее!\n\n# Запустить тесты:\ndocker compose -f docker-compose.test.yml up \\\n  --abort-on-container-exit \\\n  --exit-code-from test-runner\n\nEXIT_CODE=$?\ndocker compose -f docker-compose.test.yml down -v\nexit $EXIT_CODE',
      explanation: 'Тесты в Docker: изолированное окружение (всегда чистая БД), --abort-on-container-exit останавливает всё при завершении тестов, --exit-code-from передаёт exit code в CI. tmpfs для PostgreSQL данных ускоряет тесты в 2-3 раза. Этот паттерн работает одинаково локально и в CI.'
    },
    {
      id: 10,
      title: 'Задача 10: Полный production стек',
      type: 'practice',
      difficulty: 'hard',
      description: 'Собери production-ready стек с приложением, базой данных, кэшом, мониторингом и логированием.',
      requirements: [
        'Создай Compose с сервисами: app (FastAPI), postgres, redis, nginx, prometheus, grafana, loki',
        'Все секреты через файлы, не ENV',
        'Healthcheck для всех stateful сервисов',
        'Ресурсные лимиты для всех сервисов',
        'Логирование в Loki через promtail',
        'Prometheus собирает метрики с app и postgres_exporter',
        'Profiles: основной стек и monitoring профиль отдельно'
      ],
      hint: 'x-logging anchor для общего logging config. profiles: [monitoring] для prometheus/grafana/loki. postgres_exporter образ для метрик postgres. FastAPI с prometheus_fastapi_instrumentator для /metrics.',
      expectedOutput: 'docker compose up -d (основной стек):\nNAME       STATUS\napp        Up (healthy)\npostgres   Up (healthy)\nredis      Up (healthy)\nnginx      Up\n\ndocker compose --profile monitoring up -d (добавляет мониторинг):\nprometheus  Up  0.0.0.0:9090->9090/tcp\ngrafana     Up  0.0.0.0:3000->3000/tcp\nloki        Up\n\nSecretsне видны в docker inspect — хранятся в /run/secrets/.',
      solution: '# Структура проекта:\n# .\n# docker-compose.yml\n# secrets/\n#   db_password.txt\n# config/\n#   prometheus.yml\n#   promtail.yml\n# app/\n#   Dockerfile\n#   main.py\n#   requirements.txt\n\n# docker-compose.yml (сокращённо):\n# x-logging: &logging\n#   logging:\n#     driver: json-file\n#     options: {max-size: "10m", max-file: "3"}\n#\n# services:\n#   app:\n#     build: ./app\n#     <<: *logging\n#     secrets: [db_password]\n#     networks: [frontend, backend]\n#     deploy:\n#       resources:\n#         limits: {memory: 256M}\n#     healthcheck:\n#       test: ["CMD", "curl", "-f", "http://localhost:8000/health"]\n#\n#   postgres:\n#     image: postgres:15-alpine\n#     <<: *logging\n#     secrets: [db_password]\n#     environment:\n#       POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready"]\n#     deploy:\n#       resources:\n#         limits: {memory: 512M}\n#\n#   nginx:\n#     image: nginx:alpine\n#     ports: ["80:80", "443:443"]\n#     networks: [frontend]\n#\n#   prometheus:\n#     image: prom/prometheus\n#     profiles: [monitoring]\n#     networks: [backend, monitoring]\n#\n#   grafana:\n#     image: grafana/grafana\n#     profiles: [monitoring]\n#     ports: ["3000:3000"]\n#\n#   loki:\n#     image: grafana/loki\n#     profiles: [monitoring]\n#\n# secrets:\n#   db_password:\n#     file: ./secrets/db_password.txt\n\n# Запустить основной стек:\ndocker compose up -d\n\n# С мониторингом:\ndocker compose --profile monitoring up -d',
      explanation: 'Production стек объединяет все изученные концепции: многоуровневые сети (frontend/backend), secrets для паролей, healthchecks, ресурсные лимиты, централизованное логирование (Loki), мониторинг (Prometheus+Grafana), profiles для разделения основного стека и мониторинга. Это близко к реальным production системам.'
    }
  ]
}
