export default {
  id: 15,
  title: 'Docker для разных языков',
  description: 'Оптимальные Dockerfile для Python, Go, Node.js и Java. Особенности каждого языка: зависимости, runtime, multi-stage builds, production конфигурации.',
  lessons: [
    {
      id: 1,
      title: 'Docker для Python приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Python имеет свои особенности в Docker: виртуальные окружения не нужны (контейнер = изоляция), кэш pip, проблемы с нативными расширениями на alpine. Django/FastAPI/Flask имеют разные требования.' },
        { type: 'code', language: 'bash', value: '# Оптимальный Dockerfile для Python/FastAPI:\n# # syntax=docker/dockerfile:1\n# FROM python:3.11-slim AS builder\n# WORKDIR /app\n# RUN apt-get update && \\\\\n#     apt-get install -y --no-install-recommends \\\\\n#         build-essential \\\\\n#         libpq-dev && \\\\\n#     rm -rf /var/lib/apt/lists/*\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir --prefix=/install -r requirements.txt\n\n# FROM python:3.11-slim AS runtime\n# WORKDIR /app\n# # Копировать установленные пакеты из builder\n# COPY --from=builder /install /usr/local\n# # Runtime зависимости (без build tools)\n# RUN apt-get update && \\\\\n#     apt-get install -y --no-install-recommends libpq5 && \\\\\n#     rm -rf /var/lib/apt/lists/* && \\\\\n#     useradd -r -u 1001 appuser\n# COPY --chown=appuser:appuser . .\n# USER appuser\n# EXPOSE 8000\n# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]' },
        { type: 'code', language: 'bash', value: '# Django с gunicorn:\n# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "myproject.wsgi"]\n\n# PYTHONPATH и PYTHONDONTWRITEBYTECODE:\n# ENV PYTHONDONTWRITEBYTECODE=1  <- не создавать .pyc файлы\n# ENV PYTHONUNBUFFERED=1         <- stdout не буферизуется (логи сразу)\n\n# requirements.txt best practices:\n# requirements/\n#   base.txt      — основные зависимости\n#   dev.txt       — dev зависимости (-r base.txt)\n#   prod.txt      — prod зависимости (-r base.txt, gunicorn)\n#   test.txt      — тест зависимости (-r base.txt, pytest)\n\n# Alpine vs slim для Python:\n# Alpine: проблемы с numpy, pandas, psycopg2 (C extensions)\n# Нужно устанавливать build tools -> образ такой же по размеру\n# slim (debian): лучше совместимость с C extensions\n\n# Пример с numpy на alpine (долго!):\n# FROM python:3.11-alpine\n# RUN apk add --no-cache g++ musl-dev linux-headers  # Build tools\n# RUN pip install numpy  # Компилируется из source!  ~5 минут\n\n# Лучше: slim с бинарными wheel:\n# FROM python:3.11-slim\n# RUN pip install numpy  # Скачивает готовый wheel  ~30 секунд' },
        { type: 'note', value: 'PYTHONUNBUFFERED=1 критически важен в Docker — без него stdout буферизуется и логи появляются с задержкой или вообще не выводятся при краше. PYTHONDONTWRITEBYTECODE=1 экономит место (нет .pyc файлов).' }
      ]
    },
    {
      id: 2,
      title: 'Docker для Go приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go компилируется в статический бинарник — идеален для Docker. Образ из scratch (пустой) с одним бинарником: минимальный размер, максимальная безопасность. Нет runtime зависимостей.' },
        { type: 'code', language: 'bash', value: '# Оптимальный Dockerfile для Go:\n# # syntax=docker/dockerfile:1\n# FROM golang:1.21-alpine AS builder\n# WORKDIR /app\n# # Зависимости отдельно (кэш)\n# COPY go.mod go.sum ./\n# RUN go mod download\n# # Сборка\n# COPY . .\n# RUN CGO_ENABLED=0 GOOS=linux go build \\\\\n#     -ldflags="-w -s" \\\\\n#     -o /app/server ./cmd/server\n# # -w: без DWARF debug info\n# # -s: без символьной таблицы\n# # CGO_ENABLED=0: статическая линковка\n\n# FROM scratch AS runtime\n# # Только SSL сертификаты\n# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n# # Только бинарник\n# COPY --from=builder /app/server /server\n# EXPOSE 8080\n# USER 1001  # Non-root без создания пользователя\n# ENTRYPOINT ["/server"]' },
        { type: 'code', language: 'bash', value: '# Размер образа:\n# golang:1.21-alpine + app = ~400MB\n# scratch + бинарник = 10-20MB!\n\n# Если нужен shell (для debug):\n# FROM gcr.io/distroless/base-debian12 AS runtime\n# gcr.io/distroless/base — ~20MB, нет shell\n# gcr.io/distroless/static — ~5MB, без glibc (для CGO_ENABLED=0)\n\n# Debug образ с shell:\n# FROM gcr.io/distroless/base-debian12:debug\n# Есть busybox shell, можно exec\n\n# Кэш для go mod download:\n# # syntax=docker/dockerfile:1\n# FROM golang:1.21-alpine AS builder\n# WORKDIR /app\n# COPY go.mod go.sum ./\n# RUN --mount=type=cache,target=/go/pkg/mod \\\\\n#     go mod download\n# COPY . .\n# RUN --mount=type=cache,target=/go/pkg/mod \\\\\n#     --mount=type=cache,target=/root/.cache/go-build \\\\\n#     CGO_ENABLED=0 go build -o /server .\n\n# Cross-compilation в CI для разных платформ:\ndocker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  -t myapp:latest \\\n  --push .' },
        { type: 'tip', value: 'Go + scratch = самый маленький production образ. 10-20MB против 200-1000MB для других языков. Нет shell = нет возможности для атаки через shell injection. Это делает Go идеальным для microservices в Kubernetes.' }
      ]
    },
    {
      id: 3,
      title: 'Docker для Node.js приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js в Docker: главная задача — правильный порядок COPY для кэша npm, исключение node_modules с хоста через bind mount, выбор между npm ci и npm install.' },
        { type: 'code', language: 'bash', value: '# Оптимальный Dockerfile для Node.js API:\n# # syntax=docker/dockerfile:1\n# FROM node:18-alpine AS deps\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm ci --only=production\n\n# FROM node:18-alpine AS builder\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm ci\n# COPY . .\n# RUN npm run build\n\n# FROM node:18-alpine AS runtime\n# WORKDIR /app\n# ENV NODE_ENV=production\n# COPY --from=deps /app/node_modules ./node_modules\n# COPY --from=builder /app/dist ./dist\n# COPY package.json .\n# USER node\n# EXPOSE 3000\n# CMD ["node", "dist/server.js"]' },
        { type: 'code', language: 'bash', value: '# Next.js с standalone output:\n# next.config.js: output: \'standalone\'\n# # FROM node:18-alpine AS builder\n# # COPY . .\n# # RUN npm ci && npm run build\n# # FROM node:18-alpine AS runtime\n# # COPY --from=builder /app/.next/standalone ./\n# # COPY --from=builder /app/.next/static ./.next/static\n# # COPY --from=builder /app/public ./public\n# # CMD ["node", "server.js"]\n\n# npm ci vs npm install:\n# npm ci — строго по package-lock.json, чище для CI\n# npm install — обновляет lock файл (не для CI!)\n\n# Проблема node_modules в bind mount (dev):\n# volumes:\n#   - .:/app          <- монтируем весь проект\n#   - /app/node_modules  <- анонимный volume скрывает хостовый\n# node_modules контейнера не перезаписывается хостовым!\n\n# .npmrc для private registry:\n# //registry.npmjs.org/:_authToken=${NPM_TOKEN}\n# Секрет при сборке:\n# docker build --secret id=npmrc,src=.npmrc .\n# RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci' },
        { type: 'note', value: 'В Node.js всегда устанавливай NODE_ENV=production — это не только режим работы приложения, но и npm install не установит devDependencies при NODE_ENV=production. Это уменьшает размер образа и ускоряет старт.' }
      ]
    },
    {
      id: 4,
      title: 'Docker для Java приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java в Docker: JVM потребляет много памяти, нужны правильные флаги для ограничения heap. Spring Boot поддерживает layered jars для эффективного кэширования. Temurin (Eclipse) — рекомендуемый JDK.' },
        { type: 'code', language: 'bash', value: '# Maven build:\n# # syntax=docker/dockerfile:1\n# FROM eclipse-temurin:17-jdk-alpine AS builder\n# WORKDIR /app\n# COPY pom.xml .\n# # Скачать зависимости отдельно (кэш)\n# RUN --mount=type=cache,target=/root/.m2 \\\\\n#     mvn dependency:go-offline\n# COPY src ./src\n# RUN --mount=type=cache,target=/root/.m2 \\\\\n#     mvn package -DskipTests\n\n# FROM eclipse-temurin:17-jre-alpine AS runtime\n# WORKDIR /app\n# # Spring Boot layered jar:\n# COPY --from=builder /app/target/app.jar ./app.jar\n# RUN java -Djarmode=layertools -jar app.jar extract\n# FROM eclipse-temurin:17-jre-alpine\n# WORKDIR /app\n# COPY --from=runtime /app/dependencies/ ./\n# COPY --from=runtime /app/spring-boot-loader/ ./\n# COPY --from=runtime /app/snapshot-dependencies/ ./\n# COPY --from=runtime /app/application/ ./\n# ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]' },
        { type: 'code', language: 'bash', value: '# JVM флаги для Docker:\n# Java 11+: автоматически определяет лимиты контейнера!\n# Не нужно: -Xmx, -Xms вручную (если правильно настроены container limits)\n\n# Для Java 8 (не определяет limits):\n# JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"\n\n# Spring Boot environment:\n# ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"\n# CMD ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]\n\n# Gradle build:\n# FROM gradle:8-jdk17 AS builder\n# WORKDIR /app\n# COPY build.gradle settings.gradle ./\n# RUN --mount=type=cache,target=/home/gradle/.gradle gradle dependencies\n# COPY src ./src\n# RUN --mount=type=cache,target=/home/gradle/.gradle gradle build -x test\n\n# JRE vs JDK в runtime образе:\n# JDK: ~200MB (нужен только для сборки)\n# JRE: ~80MB (только для запуска)\n# Всегда используй JRE в runtime!\n\n# Distroless Java:\n# FROM gcr.io/distroless/java17-debian12\n# COPY --from=builder /app/app.jar /app.jar\n# CMD ["/app.jar"]' },
        { type: 'tip', value: 'Слоистые Spring Boot jars (Layered Jars) — killer feature для Docker. Библиотеки в отдельном слое (меняются редко), код приложения в верхнем слое. При изменении только кода — пересобирается только верхний слой. Экономит время и пропускную способность при деплое.' }
      ]
    },
    {
      id: 5,
      title: 'Frontend — React и статические сайты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Frontend приложения (React, Vue, Angular) собираются в статические файлы которые отдаёт nginx. Multi-stage build: Node.js для сборки, nginx для раздачи. Финальный образ очень маленький.' },
        { type: 'code', language: 'bash', value: '# React + nginx:\n# # syntax=docker/dockerfile:1\n# FROM node:18-alpine AS builder\n# WORKDIR /app\n# COPY package*.json ./\n# RUN npm ci\n# COPY . .\n# ARG VITE_API_URL\n# ENV VITE_API_URL=${VITE_API_URL}\n# RUN npm run build\n\n# FROM nginx:alpine AS runtime\n# COPY --from=builder /app/dist /usr/share/nginx/html\n# COPY nginx.conf /etc/nginx/nginx.conf\n# EXPOSE 80\n# CMD ["nginx", "-g", "daemon off;"]\n\n# nginx.conf для SPA (React Router):\n# server {\n#   listen 80;\n#   root /usr/share/nginx/html;\n#   index index.html;\n#\n#   location / {\n#     try_files $uri $uri/ /index.html;  # Важно для SPA!\n#   }\n#\n#   # API proxy:\n#   location /api {\n#     proxy_pass http://backend:3000;\n#   }\n#\n#   # Кэширование статики:\n#   location ~* \\.(js|css|png|jpg|gif|ico)$ {\n#     expires 1y;\n#     add_header Cache-Control "public, immutable";\n#   }\n# }' },
        { type: 'code', language: 'bash', value: '# Environment variables в React:\n# Проблема: переменные вставляются при СБОРКЕ, не при запуске!\n# Решение 1: ARG в Dockerfile (разные образы для окружений)\n# Решение 2: Runtime inject через nginx + shell script\n\n# Runtime inject:\n# entrypoint.sh:\n# #!/bin/sh\n# echo "window.env = {" > /usr/share/nginx/html/env-config.js\n# echo "  API_URL: \'${API_URL}\'," >> /usr/share/nginx/html/env-config.js\n# echo "};" >> /usr/share/nginx/html/env-config.js\n# nginx -g "daemon off;"\n\n# index.html:\n# <script src="/env-config.js"></script>\n# В React: window.env.API_URL вместо process.env.REACT_APP_API_URL\n\n# Размеры:\n# node:18-alpine + npm ci + build = 500MB (только builder)\n# nginx:alpine + dist = 25MB (финальный образ)\n# Это самый эффективный multi-stage build!' }
      ]
    },
    {
      id: 6,
      title: 'Полиглот — несколько языков в одном проекте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные проекты часто содержат несколько сервисов на разных языках. Docker Compose связывает их в единое приложение. Каждый сервис независим, но общается через сеть.' },
        { type: 'code', language: 'yaml', value: '# Полный стек: React + FastAPI + Go сервис + PostgreSQL\nservices:\n  frontend:\n    build:\n      context: ./frontend\n      dockerfile: Dockerfile\n    ports:\n      - "80:80"\n    networks:\n      - frontend\n    depends_on:\n      - api\n\n  api:\n    build:\n      context: ./api  # Python FastAPI\n      dockerfile: Dockerfile\n    environment:\n      - DATABASE_URL=postgresql://postgres:secret@db/myapp\n      - WORKER_URL=http://worker:8081\n    networks:\n      - frontend\n      - backend\n    depends_on:\n      db:\n        condition: service_healthy\n\n  worker:\n    build:\n      context: ./worker  # Go service\n      dockerfile: Dockerfile\n    environment:\n      - DATABASE_URL=postgresql://postgres:secret@db/myapp\n    networks:\n      - backend\n\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_PASSWORD: secret\n      POSTGRES_DB: myapp\n    volumes:\n      - db_data:/var/lib/postgresql/data\n    networks:\n      - backend\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 5s\n      retries: 5\n\nnetworks:\n  frontend:\n  backend:\n    internal: true\n\nvolumes:\n  db_data:' },
        { type: 'note', value: 'Каждый сервис имеет свой Dockerfile оптимизированный для своего языка: React -> nginx:alpine, Python -> python:3.11-slim, Go -> scratch. Итоговый стек с тремя сервисами занимает 50-100MB вместо нескольких GB для VM с теми же компонентами.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Containerize реальное приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Контейнеризируй простое приложение на Python (FastAPI) с postgres и Redis.',
      requirements: [
        'Создай FastAPI приложение с эндпоинтами /health и /items (CRUD)',
        'Напиши оптимальный multi-stage Dockerfile (builder + runtime stages)',
        'Настрой переменные через ENV: DATABASE_URL, REDIS_URL',
        'Создай docker-compose.yml с fastapi, postgres, redis',
        'Добавь healthcheck для всех сервисов',
        'Убедись что приложение работает: curl http://localhost:8000/health',
        'Измерь размер образа и оптимизируй если больше 200MB'
      ],
      hint: 'python:3.11-slim для runtime. PYTHONUNBUFFERED=1 и PYTHONDONTWRITEBYTECODE=1 в ENV. uvicorn для запуска. pg_isready для healthcheck postgres. redis-cli ping для redis healthcheck.',
      solution: '# app/main.py:\n# from fastapi import FastAPI\n# app = FastAPI()\n# @app.get("/health")\n# def health(): return {"status": "ok"}\n\n# requirements.txt:\n# fastapi==0.104.1\n# uvicorn[standard]==0.24.0\n# asyncpg==0.29.0\n# redis==5.0.1\n\n# Dockerfile:\n# FROM python:3.11-slim AS builder\n# WORKDIR /app\n# RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir --prefix=/install -r requirements.txt\n\n# FROM python:3.11-slim AS runtime\n# WORKDIR /app\n# ENV PYTHONUNBUFFERED=1\n# ENV PYTHONDONTWRITEBYTECODE=1\n# COPY --from=builder /install /usr/local\n# RUN useradd -r -u 1001 appuser\n# COPY --chown=appuser:appuser app/ ./app/\n# USER appuser\n# EXPOSE 8000\n# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]\n\n# docker-compose.yml:\n# services:\n#   api:\n#     build: .\n#     ports:\n#       - "8000:8000"\n#     environment:\n#       DATABASE_URL: postgresql://postgres:secret@postgres/myapp\n#       REDIS_URL: redis://redis:6379\n#     depends_on:\n#       postgres:\n#         condition: service_healthy\n#       redis:\n#         condition: service_started\n#     healthcheck:\n#       test: ["CMD", "curl", "-f", "http://localhost:8000/health"]\n#       interval: 10s\n#       retries: 3\n#\n#   postgres:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_PASSWORD: secret\n#       POSTGRES_DB: myapp\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       retries: 5\n#\n#   redis:\n#     image: redis:7-alpine\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#       interval: 5s\n#       retries: 3\n\ndocker compose up -d\ndocker compose ps\n\n# Проверить:\ncurl http://localhost:8000/health\n# {"status": "ok"}\n\n# Размер образа:\ndocker images myapp\n# Должно быть ~150-180MB с python:3.11-slim',
      explanation: 'Multi-stage build разделяет build окружение (с gcc для компиляции) от runtime (без build tools). Разница: builder ~400MB, runtime ~150MB. PYTHONUNBUFFERED критичен для логов. Non-root пользователь для безопасности. depends_on с healthcheck гарантирует порядок запуска. Такой паттерн применим к любому Python веб-приложению.'
    }
  ]
}
