export default {
  id: 12,
  title: 'Оптимизация Docker образов',
  description: 'Уменьшение размера образов через .dockerignore, порядок слоёв для кэша, выбор базового образа, удаление лишних файлов и BuildKit оптимизации.',
  lessons: [
    {
      id: 1,
      title: '.dockerignore — исключение ненужных файлов',
      type: 'theory',
      content: [
        { type: 'text', value: '.dockerignore работает как .gitignore для Docker build context. Исключает файлы которые не нужны в образе. Уменьшает размер контекста (данные отправляемые docker daemon) и предотвращает попадание секретов в образ.' },
        { type: 'code', language: 'bash', value: '# Без .dockerignore — весь проект отправляется в daemon:\n# Sending build context to Docker daemon  1.2GB  <- очень медленно!\n\n# С .dockerignore — только нужные файлы:\n# Sending build context to Docker daemon  2.5MB  <- быстро!\n\n# Типичный .dockerignore для Node.js:\n# node_modules/\n# npm-debug.log\n# .npm\n# .git/\n# .gitignore\n# .env\n# .env.*\n# coverage/\n# .nyc_output/\n# dist/\n# build/\n# *.md\n# Dockerfile*\n# docker-compose*\n# .dockerignore\n# tests/\n# __tests__/\n# *.test.js\n# *.spec.js\n\n# Типичный .dockerignore для Python:\n# __pycache__/\n# *.pyc\n# *.pyo\n# *.pyd\n# .Python\n# venv/\n# .venv/\n# env/\n# .git/\n# .env\n# .env.*\n# *.log\n# .pytest_cache/\n# .mypy_cache/\n# tests/\n# docs/\n# *.md\n\n# Проверить что в контексте:\ndocker build --no-cache -t test . 2>&1 | head -5\n# Sending build context to Docker daemon  X.XXkB' }
      ]
    },
    {
      id: 2,
      title: 'Порядок слоёв — оптимизация кэша',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кэш слоёв — главный механизм ускорения сборки. Docker кэширует каждый слой. Как только слой изменился — все следующие слои пересобираются. Размещай стабильные слои вверху, изменяемые вниз.' },
        { type: 'code', language: 'bash', value: '# ПЛОХО — код копируется раньше зависимостей:\n# FROM node:18-alpine\n# WORKDIR /app\n# COPY . .          <- при любом изменении кода\n# RUN npm install   <- npm install пересобирается!\n# CMD ["node", "server.js"]\n\n# ХОРОШО — зависимости отдельно от кода:\n# FROM node:18-alpine\n# WORKDIR /app\n# COPY package*.json ./    <- меняется редко\n# RUN npm ci               <- кэшируется!\n# COPY . .                 <- меняется часто (но уже после npm ci)\n# CMD ["node", "server.js"]\n\n# Принцип: от редко меняемого к часто меняемому\n\n# Python:\n# FROM python:3.11-alpine\n# WORKDIR /app\n# COPY requirements.txt .  <- меняется редко\n# RUN pip install -r requirements.txt  <- кэшируется!\n# COPY . .                 <- меняется часто\n# CMD ["python", "app.py"]\n\n# Go:\n# FROM golang:1.21-alpine\n# WORKDIR /app\n# COPY go.mod go.sum ./    <- меняется редко\n# RUN go mod download      <- кэшируется!\n# COPY . .\n# RUN go build -o app .\n# CMD ["./app"]' },
        { type: 'code', language: 'bash', value: '# Проверить какие слои кэшированы:\ndocker build -t myapp . 2>&1 | grep -E "CACHED|Step"\n# Step 1/8 : FROM node:18-alpine\n#  ---> Using cache\n# Step 2/8 : WORKDIR /app\n#  ---> Using cache\n# Step 3/8 : COPY package*.json ./\n#  ---> Using cache  <- кэш использован!\n# Step 4/8 : RUN npm ci\n#  ---> Using cache  <- кэш использован!\n# Step 5/8 : COPY . .\n#  ---> Running in abc123  <- пересборка только с этого шага\n\n# BuildKit кэш для pip/npm в CI:\n# (синтаксис BuildKit)\n# # syntax=docker/dockerfile:1\n# FROM python:3.11\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN --mount=type=cache,target=/root/.cache/pip \\\\\n#     pip install -r requirements.txt\n# COPY . .\n\n# Включить BuildKit:\nexport DOCKER_BUILDKIT=1\ndocker build -t myapp .' },
        { type: 'tip', value: 'В CI/CD кэш Docker слоёв сохраняется между запусками только если используешь правильный кэш механизм: GitHub Actions cache, GitLab cache artifacts, BuildKit inline cache. Без этого каждый CI run начинает с нуля.' }
      ]
    },
    {
      id: 3,
      title: 'Выбор базового образа — размер vs удобство',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор базового образа сильно влияет на размер финального образа. Иерархия размеров: ubuntu/debian > slim > alpine > distroless > scratch. Меньший образ = меньше уязвимостей и быстрее pull.' },
        { type: 'code', language: 'bash', value: '# Сравнение размеров базовых образов:\n# ubuntu:22.04         — 77MB\n# debian:bookworm      — 117MB\n# debian:bookworm-slim — 74MB\n# python:3.11          — 920MB (debian + python)\n# python:3.11-slim     — 130MB\n# python:3.11-alpine   — 52MB\n# python:3.11-bookworm — 1GB\n\n# Node.js:\n# node:18              — 990MB\n# node:18-slim         — 240MB\n# node:18-alpine       — 130MB\n# node:18-bookworm     — 1.1GB\n\n# Проверить размер:\ndocker images | grep python\n\n# Alpine — плюсы и минусы:\n# Плюсы: маленький (5MB), apk пакет менеджер, busybox\n# Минусы: musl libc (не glibc), некоторые C расширения не работают\n# Проблемы с: некоторые Python пакеты (numpy, pandas) долго собираются\n\n# Slim — баланс:\n# debian-slim: все нужные пакеты, удалены лишние\n# Нет: системной документации, переводов, debug утилит\n\n# Distroless (Google):\n# gcr.io/distroless/python3 — только Python runtime\n# gcr.io/distroless/java17  — только JRE\n# gcr.io/distroless/base    — glibc + ssl\n# gcr.io/distroless/static  — без glibc (для Go статических бинарей)\n# Нет shell вообще! Нет apt/apk!\n\n# Scratch — пустой образ (для Go):\n# FROM scratch  — нет ничего, только твой бинарник\n# CGO_ENABLED=0 go build -o app .\n# Образ = размер бинарника (10-20MB)' },
        { type: 'note', value: 'Для production API (Go, Rust): scratch или distroless/static. Для Python/Node.js: slim или alpine. Для разработки: полный образ удобнее (есть инструменты для отладки). Multi-stage: dev stage полный, prod stage slim/distroless.' }
      ]
    },
    {
      id: 4,
      title: 'Уменьшение размера — удаление лишнего',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждая команда в Dockerfile создаёт слой. Неправильная очистка кэша пакетных менеджеров оставляет лишние данные даже если их "удалить" в следующей команде. Объединяй RUN команды.' },
        { type: 'code', language: 'bash', value: '# ПЛОХО — удаление в отдельном слое НЕ уменьшает образ:\n# RUN apt-get update && apt-get install -y curl\n# RUN rm -rf /var/lib/apt/lists/*  <- этот слой добавляет 0 байт!\n# Кэш всё равно в предыдущем слое!\n\n# ХОРОШО — в одной команде:\n# FROM debian:bookworm-slim\n# RUN apt-get update && \\\\\n#     apt-get install -y --no-install-recommends \\\\\n#         curl \\\\\n#         ca-certificates && \\\\\n#     rm -rf /var/lib/apt/lists/*\n# ОДИН слой, кэш удалён в нём же!\n\n# Alpine apk:\n# RUN apk add --no-cache curl ca-certificates\n# --no-cache: не создаёт кэш вообще!\n\n# Python pip:\n# RUN pip install --no-cache-dir -r requirements.txt\n# --no-cache-dir: не кэшировать загруженные пакеты\n\n# npm:\n# RUN npm ci --only=production && npm cache clean --force\n# ci: точно по package-lock.json\n# --only=production: только prod зависимости\n\n# Squash — объединить все слои в один:\ndocker build --squash -t myapp .\n# Экспериментальная фича, уменьшает размер но теряет кэш\n\n# Проверить размер каждого слоя:\ndocker history myapp:latest\n# IMAGE          CREATED BY                          SIZE\n# abc123         CMD ["node", "server.js"]            0B\n# def456         COPY . .                             5.2MB\n# ghi789         RUN npm ci                           45MB  <- большой!\n# jkl012         COPY package*.json ./                2.1kB\n# mno345         WORKDIR /app                         0B\n# pqr678         /bin/sh -c #(nop) FROM node:18...    0B' },
        { type: 'tip', value: 'Посмотри на слои через docker history: найди самые большие. Часто экономия возможна через: --no-install-recommends в apt, --no-cache-dir в pip, удаление dev dependencies для production, multi-stage builds.' }
      ]
    },
    {
      id: 5,
      title: 'BuildKit — современные возможности сборки',
      type: 'theory',
      content: [
        { type: 'text', value: 'BuildKit — новый движок сборки Docker с параллельной сборкой, улучшенным кэшем и новыми возможностями Dockerfile. Включён по умолчанию начиная с Docker 23.0.' },
        { type: 'code', language: 'bash', value: '# Включить BuildKit (если не включён):\nexport DOCKER_BUILDKIT=1\n# Или глобально в daemon.json:\n# { "features": { "buildkit": true } }\n\n# Новый синтаксис (первая строка Dockerfile):\n# # syntax=docker/dockerfile:1\n\n# Параллельная сборка multi-stage:\n# # syntax=docker/dockerfile:1\n# FROM node:18-alpine AS frontend\n# RUN npm ci && npm run build\n\n# FROM python:3.11-alpine AS backend\n# RUN pip install -r requirements.txt\n\n# FROM nginx:alpine AS final\n# COPY --from=frontend /app/dist /var/www/html\n# COPY --from=backend /app /app\n# BuildKit запускает frontend и backend ПАРАЛЛЕЛЬНО!\n\n# Кэш mount — кэшировать между сборками:\n# # syntax=docker/dockerfile:1\n# FROM python:3.11\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN --mount=type=cache,target=/root/.cache/pip \\\\\n#     pip install -r requirements.txt\n# COPY . .\n\n# SSH mount — использовать SSH ключ при сборке:\n# RUN --mount=type=ssh git clone git@github.com:private/repo .\n# docker build --ssh default .\n\n# Secret mount — передать секрет без сохранения в слое:\n# RUN --mount=type=secret,id=mysecret \\\\\n#     SECRET=$(cat /run/secrets/mysecret) && \\\\\n#     curl -H "Auth: $SECRET" https://api.example.com/package\n# docker build --secret id=mysecret,src=./secret.txt .' },
        { type: 'code', language: 'bash', value': '# docker buildx — расширенные возможности:\n# Multi-platform сборка:\ndocker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  -t myapp:latest \\\n  --push .\n\n# Создать builder с поддержкой multi-platform:\ndocker buildx create --use --name mybuilder\ndocker buildx inspect --bootstrap\n\n# Кэш для CI/CD:\ndocker buildx build \\\n  --cache-from type=gha \\\n  --cache-to type=gha,mode=max \\\n  -t myapp:latest \\\n  --push .\n# type=gha: GitHub Actions cache\n# type=registry: сохранить кэш в registry\n# type=local: локальная директория' },
        { type: 'note', value: 'BuildKit cache mount особенно эффективен для pip и npm в CI/CD. Зависимости кэшируются между сборками. Это может сократить время сборки с 5 минут до 30 секунд для проектов со многими зависимостями.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация реального образа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируй Dockerfile для Python приложения: уменьши размер и ускори сборку.',
      requirements: [
        'Возьми "плохой" Dockerfile и измерь его размер и время сборки',
        'Создай правильный .dockerignore',
        'Оптимизируй порядок слоёв для лучшего кэширования',
        'Переключись на python:3.11-slim вместо python:3.11',
        'Используй --no-cache-dir для pip и --no-install-recommends для apt',
        'Добавь multi-stage: build stage для установки зависимостей, runtime stage минимальный'
      ],
      hint: 'docker history myapp показывает размер каждого слоя. COPY requirements.txt до COPY . . для кэша pip. python:3.11-slim намного меньше python:3.11. В одном RUN: apt-get update && install && rm -rf /var/lib/apt/lists/*.',
      solution: '# Плохой Dockerfile (начальная точка):\n# FROM python:3.11\n# COPY . .\n# RUN apt-get update && apt-get install -y libpq-dev\n# RUN pip install -r requirements.txt\n# RUN apt-get clean\n# CMD ["python", "app.py"]\n\ndocker build -t myapp-bad -f Dockerfile.bad .\ndocker images myapp-bad\n# myapp-bad  latest  ...  1.2GB  <- очень большой!\n\n# .dockerignore:\n# cat > .dockerignore << EOF\n# __pycache__/\n# *.pyc\n# .git/\n# .env\n# venv/\n# .venv/\n# tests/\n# *.md\n# .dockerignore\n# Dockerfile*\n# EOF\n\n# Оптимизированный Dockerfile:\n# FROM python:3.11-slim AS builder\n# WORKDIR /app\n# RUN apt-get update && \\\\\n#     apt-get install -y --no-install-recommends \\\\\n#         libpq-dev gcc && \\\\\n#     rm -rf /var/lib/apt/lists/*\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt\n\n# FROM python:3.11-slim AS runtime\n# WORKDIR /app\n# RUN apt-get update && \\\\\n#     apt-get install -y --no-install-recommends libpq5 && \\\\\n#     rm -rf /var/lib/apt/lists/*\n# COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages\n# COPY --from=builder /usr/local/bin /usr/local/bin\n# COPY . .\n# RUN useradd -r appuser && chown -R appuser /app\n# USER appuser\n# CMD ["python", "app.py"]\n\ndocker build -t myapp-optimized -f Dockerfile.optimized .\ndocker images myapp-optimized\n# myapp-optimized  latest  ...  180MB  <- в 6 раз меньше!\n\ndocker history myapp-optimized\n# Посмотреть размеры каждого слоя\n\n# Тест кэша:\n# Изменить app.py и пересобрать:\ntime docker build -t myapp-optimized -f Dockerfile.optimized .\n# Только последние шаги пересобираются, pip install из кэша',
      explanation: 'Основные техники оптимизации: slim образ (экономия 800MB), правильный порядок COPY (кэш pip), объединённый RUN с очисткой (реальное удаление кэша apt), --no-cache-dir (нет кэша pip в образе), .dockerignore (не копировать лишнее), multi-stage (в runtime только нужные библиотеки). Результат: 1.2GB -> 180MB, сборка 3 мин -> 20 сек при изменении кода.'
    }
  ]
}
