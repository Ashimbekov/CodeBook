export default {
  id: 19,
  title: 'Docker и деплой',
  description: 'Контейнеризация FastAPI с Docker, docker-compose для разработки, деплой на сервер, nginx как reverse proxy, переменные окружения и production-настройки',
  lessons: [
    {
      id: 1,
      title: 'Dockerfile для FastAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dockerfile описывает как собрать Docker-образ с приложением. Для FastAPI используют официальный образ Python, устанавливают зависимости и запускают uvicorn.' },
        { type: 'code', language: 'python', value: '# Dockerfile\n# FROM python:3.11-slim — минимальный образ Python\n# WORKDIR /app — рабочая директория внутри контейнера\n# COPY requirements.txt . — копируем список зависимостей\n# RUN pip install -r requirements.txt — устанавливаем\n# COPY . . — копируем весь код\n# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n\n# requirements.txt:\n# fastapi==0.104.0\n# uvicorn[standard]==0.24.0\n# pydantic==2.4.2\n# sqlalchemy==2.0.23\n# alembic==1.12.1\n\n# main.py\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/health")\ndef health_check():\n    return {"status": "ok"}\n\n# Сборка и запуск:\n# docker build -t myapp .\n# docker run -p 8000:8000 myapp' },
        { type: 'tip', value: 'python:3.11-slim значительно меньше чем python:3.11 (150MB vs 900MB). Для ещё меньшего размера используй python:3.11-alpine, но с ним могут быть проблемы с C-зависимостями.' },
        { type: 'heading', value: 'Многоэтапная сборка (multi-stage build)' },
        { type: 'code', language: 'python', value: '# Dockerfile с multi-stage build\n# Stage 1: builder\n# FROM python:3.11-slim as builder\n# WORKDIR /app\n# RUN pip install --upgrade pip\n# COPY requirements.txt .\n# RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt\n\n# Stage 2: runner\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY --from=builder /wheels /wheels\n# RUN pip install --no-cache /wheels/*\n# COPY . .\n# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n\n# Преимущества:\n# - Финальный образ не содержит build-инструменты\n# - Меньший размер образа\n# - Лучшая безопасность\nprint("Multi-stage build помогает уменьшить размер образа")' }
      ]
    },
    {
      id: 2,
      title: 'Docker Compose для разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose позволяет запускать несколько контейнеров как единое приложение: FastAPI + PostgreSQL + Redis. Конфигурация описывается в docker-compose.yml.' },
        { type: 'code', language: 'python', value: '# docker-compose.yml (YAML-формат, показан как строка)\n# version: "3.8"\n# services:\n#   app:\n#     build: .\n#     ports:\n#       - "8000:8000"\n#     environment:\n#       - DATABASE_URL=postgresql://user:pass@db:5432/mydb\n#       - REDIS_URL=redis://redis:6379\n#     depends_on:\n#       - db\n#       - redis\n#     volumes:\n#       - .:/app  # hot-reload в разработке\n#\n#   db:\n#     image: postgres:15\n#     environment:\n#       POSTGRES_USER: user\n#       POSTGRES_PASSWORD: pass\n#       POSTGRES_DB: mydb\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#\n#   redis:\n#     image: redis:7-alpine\n#\n# volumes:\n#   postgres_data:\n\n# Команды:\n# docker compose up -d        — запустить в фоне\n# docker compose down          — остановить\n# docker compose logs -f app   — логи приложения\n# docker compose exec app bash — войти в контейнер\nprint("docker compose up -d запускает все сервисы")' },
        { type: 'note', value: 'volumes: .:/app монтирует текущую директорию в контейнер. Изменения в коде сразу видны без пересборки. Для продакшна убери этот volume — там должен быть только образ.' }
      ]
    },
    {
      id: 3,
      title: 'Переменные окружения и настройки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация приложения должна браться из переменных окружения, а не быть захардкожена в коде. Pydantic BaseSettings автоматически читает .env файл.' },
        { type: 'code', language: 'python', value: 'from pydantic_settings import BaseSettings\nfrom functools import lru_cache\n\nclass Settings(BaseSettings):\n    # Приложение\n    app_name: str = "My FastAPI App"\n    debug: bool = False\n    api_version: str = "v1"\n\n    # База данных\n    database_url: str\n    db_pool_size: int = 10\n\n    # Безопасность\n    secret_key: str\n    algorithm: str = "HS256"\n    access_token_expire_minutes: int = 30\n\n    # Redis\n    redis_url: str = "redis://localhost:6379"\n\n    class Config:\n        env_file = ".env"\n\n@lru_cache()\ndef get_settings() -> Settings:\n    return Settings()\n\n# Использование в приложении:\nfrom fastapi import FastAPI, Depends\n\napp = FastAPI()\n\n@app.get("/info")\ndef get_info(settings: Settings = Depends(get_settings)):\n    return {\n        "app": settings.app_name,\n        "version": settings.api_version,\n        "debug": settings.debug\n    }' },
        { type: 'tip', value: '@lru_cache() кэширует объект Settings — он создаётся один раз при первом вызове. .env файл добавь в .gitignore! Секреты не должны попасть в репозиторий.' }
      ]
    },
    {
      id: 4,
      title: 'Nginx как reverse proxy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nginx располагается перед FastAPI и обрабатывает SSL, сжатие, кэширование и балансировку нагрузки. FastAPI отвечает только за бизнес-логику.' },
        { type: 'code', language: 'python', value: '# nginx.conf (конфигурация Nginx)\n# upstream fastapi {\n#     server app:8000;\n# }\n# server {\n#     listen 80;\n#     server_name example.com;\n#\n#     # Перенаправление на HTTPS\n#     return 301 https://$host$request_uri;\n# }\n# server {\n#     listen 443 ssl;\n#     server_name example.com;\n#\n#     ssl_certificate /etc/ssl/certs/cert.pem;\n#     ssl_certificate_key /etc/ssl/private/key.pem;\n#\n#     # Проксирование в FastAPI\n#     location / {\n#         proxy_pass http://fastapi;\n#         proxy_set_header Host $host;\n#         proxy_set_header X-Real-IP $remote_addr;\n#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n#         proxy_set_header X-Forwarded-Proto $scheme;\n#     }\n#\n#     # Раздача статики напрямую\n#     location /static/ {\n#         alias /app/static/;\n#     }\n# }\n\n# В FastAPI нужно доверять заголовкам прокси:\nfrom fastapi import FastAPI\nfrom fastapi.middleware.trustedhost import TrustedHostMiddleware\n\napp = FastAPI()\napp.add_middleware(TrustedHostMiddleware, allowed_hosts=["example.com", "*.example.com"])' },
        { type: 'note', value: 'X-Real-IP и X-Forwarded-For заголовки передают реальный IP клиента через прокси. В FastAPI используй request.headers.get("X-Real-IP") чтобы получить настоящий IP, а не адрес nginx.' }
      ]
    },
    {
      id: 5,
      title: 'Gunicorn + Uvicorn в продакшне',
      type: 'theory',
      content: [
        { type: 'text', value: 'В продакшне рекомендуется запускать несколько uvicorn-воркеров через gunicorn. Gunicorn управляет воркерами и перезапускает их при падении.' },
        { type: 'code', language: 'python', value: '# Запуск через gunicorn с uvicorn-воркерами:\n# gunicorn main:app \\\n#   --workers 4 \\\n#   --worker-class uvicorn.workers.UvicornWorker \\\n#   --bind 0.0.0.0:8000 \\\n#   --timeout 120 \\\n#   --keepalive 5 \\\n#   --log-level info\n\n# Правило количества воркеров: 2 * CPU + 1\n# Для 2 CPU: 5 воркеров\n# Для 4 CPU: 9 воркеров\n\n# Dockerfile для продакшна:\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install -r requirements.txt gunicorn\n# COPY . .\n# CMD ["gunicorn", "main:app",\n#      "--workers", "4",\n#      "--worker-class", "uvicorn.workers.UvicornWorker",\n#      "--bind", "0.0.0.0:8000"]\n\n# Health check в Docker:\n# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \\\n#   CMD curl -f http://localhost:8000/health || exit 1\n\nfrom fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/health")\ndef health():\n    return {"status": "healthy"}' },
        { type: 'tip', value: 'Gunicorn + UvicornWorker лучше чем просто uvicorn --workers в продакшне: gunicorn перезапускает упавшие воркеры и корректно обрабатывает сигналы операционной системы (SIGTERM, SIGKILL).' }
      ]
    },
    {
      id: 6,
      title: 'CI/CD и автодеплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI/CD автоматизирует тестирование и деплой при каждом push в репозиторий. Рассмотрим GitHub Actions для сборки Docker-образа и деплоя на сервер.' },
        { type: 'code', language: 'python', value: '# .github/workflows/deploy.yml\n# name: Deploy\n# on:\n#   push:\n#     branches: [main]\n# jobs:\n#   test:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v3\n#       - uses: actions/setup-python@v4\n#         with: {python-version: "3.11"}\n#       - run: pip install -r requirements.txt pytest\n#       - run: pytest\n#\n#   build-and-push:\n#     needs: test\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v3\n#       - uses: docker/login-action@v2\n#         with:\n#           registry: ghcr.io\n#           username: ${{ github.actor }}\n#           password: ${{ secrets.GITHUB_TOKEN }}\n#       - run: |\n#           docker build -t ghcr.io/${{ github.repository }}:latest .\n#           docker push ghcr.io/${{ github.repository }}:latest\n#\n#   deploy:\n#     needs: build-and-push\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: appleboy/ssh-action@master\n#         with:\n#           host: ${{ secrets.SERVER_HOST }}\n#           username: ${{ secrets.SERVER_USER }}\n#           key: ${{ secrets.SSH_KEY }}\n#           script: |\n#             docker pull ghcr.io/${{ github.repository }}:latest\n#             docker compose up -d --no-deps app\n\nprint("Сохраняй секреты (SSH_KEY, SERVER_HOST) в GitHub Secrets, не в коде!")' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Production-ready деплой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подготовь FastAPI-приложение к production деплою с Docker.',
      requirements: [
        'Dockerfile с multi-stage build (builder + runner стадии)',
        'Settings класс на базе BaseSettings с чтением из .env',
        'docker-compose.yml с сервисами: app, db (PostgreSQL), redis',
        'Эндпоинт /health с проверкой соединения с базой',
        'Gunicorn запуск с 4 воркерами в Dockerfile CMD',
        '.env.example файл с описанием всех переменных (без реальных секретов)'
      ],
      expectedOutput: 'docker compose up -d\nGET /health -> {"status": "healthy", "database": "connected", "version": "1.0.0"}',
      hint: 'В Settings используй @validator для валидации DATABASE_URL. В health_check попробуй выполнить db.execute("SELECT 1") чтобы проверить соединение с базой. HEALTHCHECK в Dockerfile использует curl.',
      solution: '# settings.py\nfrom pydantic_settings import BaseSettings\nfrom functools import lru_cache\n\nclass Settings(BaseSettings):\n    app_name: str = "FastAPI App"\n    version: str = "1.0.0"\n    debug: bool = False\n    database_url: str = "postgresql://user:pass@localhost/db"\n    redis_url: str = "redis://localhost:6379"\n    secret_key: str = "changeme"\n    workers: int = 4\n\n    class Config:\n        env_file = ".env"\n\n@lru_cache()\ndef get_settings():\n    return Settings()\n\n# main.py\nfrom fastapi import FastAPI, Depends\nfrom settings import Settings, get_settings\n\napp = FastAPI()\n\n@app.get("/health")\ndef health(settings: Settings = Depends(get_settings)):\n    return {\n        "status": "healthy",\n        "app": settings.app_name,\n        "version": settings.version,\n        "database": "connected"\n    }\n\n# Dockerfile\n# FROM python:3.11-slim as builder\n# WORKDIR /build\n# COPY requirements.txt .\n# RUN pip wheel --wheel-dir /wheels -r requirements.txt\n#\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY --from=builder /wheels /wheels\n# RUN pip install --no-cache /wheels/*\n# COPY . .\n# HEALTHCHECK --interval=30s CMD curl -f http://localhost:8000/health || exit 1\n# CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]\n\nprint("docker compose up -d && docker compose logs -f")  # Запуск и мониторинг',
      explanation: 'Multi-stage build разделяет сборку зависимостей и финальный образ. BaseSettings читает переменные из .env и переменных окружения. HEALTHCHECK позволяет Docker самостоятельно проверять что контейнер живой. Gunicorn с 4 UvicornWorker воркерами максимизирует использование CPU в продакшне.'
    }
  ]
}
