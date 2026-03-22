export default {
  id: 24,
  title: 'Docker и деплой',
  description: 'Dockerfile, docker-compose, gunicorn, nginx, переменные окружения — деплоим Django в продакшен.',
  lessons: [
    {
      id: 1,
      title: 'Dockerfile для Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker позволяет упаковать приложение со всеми зависимостями в изолированный контейнер. Работает одинаково везде: на ноутбуке разработчика и на продакшен сервере.' },
        { type: 'code', language: 'python', value: '# Dockerfile\nFROM python:3.12-slim\n\n# Установка системных зависимостей\nRUN apt-get update && apt-get install -y \\\n    libpq-dev \\\n    gcc \\\n    && rm -rf /var/lib/apt/lists/*\n\n# Рабочая директория\nWORKDIR /app\n\n# Установка Python зависимостей (кешируется если requirements.txt не изменился)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Копируем код\nCOPY . .\n\n# Статические файлы\nRUN python manage.py collectstatic --noinput\n\n# Порт приложения\nEXPOSE 8000\n\n# Запуск через gunicorn\nCMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "myproject.wsgi:application"]' },
        { type: 'tip', value: 'Используй python:3.12-slim вместо python:3.12 — образ в 5 раз меньше. Копируй requirements.txt перед кодом — это кеширует установку зависимостей.' }
      ]
    },
    {
      id: 2,
      title: 'docker-compose для разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker-compose позволяет запустить несколько сервисов (Django, PostgreSQL, Redis, Celery) одной командой.' },
        { type: 'code', language: 'python', value: '# docker-compose.yml\nversion: "3.9"\n\nservices:\n  web:\n    build: .\n    command: python manage.py runserver 0.0.0.0:8000\n    volumes:\n      - .:/app\n    ports:\n      - "8000:8000"\n    env_file:\n      - .env\n    depends_on:\n      - db\n      - redis\n\n  db:\n    image: postgres:15-alpine\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: myuser\n      POSTGRES_PASSWORD: mypassword\n\n  redis:\n    image: redis:7-alpine\n\n  celery:\n    build: .\n    command: celery -A myproject worker -l info\n    volumes:\n      - .:/app\n    env_file:\n      - .env\n    depends_on:\n      - db\n      - redis\n\nvolumes:\n  postgres_data:' },
        { type: 'code', language: 'python', value: '# Управление\ndocker-compose up -d          # запустить все сервисы\ndocker-compose down           # остановить\ndocker-compose logs -f web    # логи сервиса\ndocker-compose exec web python manage.py migrate  # миграции внутри контейнера' }
      ]
    },
    {
      id: 3,
      title: 'Gunicorn — WSGI сервер для продакшена',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django development server (runserver) не предназначен для продакшена. Gunicorn — профессиональный WSGI сервер с поддержкой нескольких воркеров.' },
        { type: 'code', language: 'python', value: '# pip install gunicorn\n\n# Простой запуск\ngunicorn myproject.wsgi:application\n\n# С настройками\ngunicorn myproject.wsgi:application \\\n    --bind 0.0.0.0:8000 \\\n    --workers 4 \\\n    --threads 2 \\\n    --worker-class gthread \\\n    --timeout 120 \\\n    --access-logfile - \\\n    --error-logfile -\n\n# gunicorn.conf.py — файл конфигурации\nbind = "0.0.0.0:8000"\nworkers = 4  # обычно: (2 * CPU_cores) + 1\nthreads = 2\ntimeout = 120\nloglevel = "info"' },
        { type: 'note', value: 'Количество воркеров: (2 * количество_ядер_CPU) + 1. Для 2-ядерного сервера: 5 воркеров. Больше воркеров = больше памяти, меньше воркеров = меньше параллельности.' }
      ]
    },
    {
      id: 4,
      title: 'Nginx как reverse proxy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nginx стоит перед Gunicorn: отдаёт статические файлы напрямую (быстрее), проксирует динамические запросы на Gunicorn, завершает SSL соединения.' },
        { type: 'code', language: 'python', value: '# nginx.conf\nupstream django {\n    server web:8000;\n}\n\nserver {\n    listen 80;\n    server_name example.com www.example.com;\n\n    # Статические файлы отдаёт nginx напрямую\n    location /static/ {\n        alias /app/staticfiles/;\n    }\n\n    location /media/ {\n        alias /app/media/;\n    }\n\n    # Всё остальное -> Gunicorn\n    location / {\n        proxy_pass http://django;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Переменные окружения и production settings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты (SECRET_KEY, пароли БД) никогда не хранятся в коде. Используй переменные окружения и .env файлы.' },
        { type: 'code', language: 'python', value: '# pip install python-decouple\n# .env файл (в .gitignore!)\nDJANGO_SECRET_KEY=your-secret-key-here\nDEBUG=False\nDATABASE_URL=postgresql://user:pass@db:5432/mydb\nREDIS_URL=redis://redis:6379/0\nALLOWED_HOSTS=example.com,www.example.com\n\n# settings.py\nfrom decouple import config\n\nSECRET_KEY = config("DJANGO_SECRET_KEY")\nDEBUG = config("DEBUG", default=False, cast=bool)\nALLOWED_HOSTS = config("ALLOWED_HOSTS").split(",")\n\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.postgresql",\n        "NAME": config("DB_NAME"),\n        "USER": config("DB_USER"),\n        "PASSWORD": config("DB_PASSWORD"),\n        "HOST": config("DB_HOST", default="localhost"),\n    }\n}' },
        { type: 'warning', value: 'НИКОГДА не коммить .env файл в Git! Добавь его в .gitignore. Используй .env.example как шаблон с пустыми значениями для других разработчиков.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: docker-compose продакшен стек',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полный продакшен docker-compose стек для Django с PostgreSQL, Redis, Celery и Nginx.',
      requirements: [
        'docker-compose.prod.yml с сервисами: web (gunicorn), db (postgres), redis, celery, nginx',
        'web использует gunicorn с 4 воркерами',
        'Все секреты через env_file: .env.prod',
        'Nginx проксирует запросы на web:8000',
        'Volume для статических файлов, shared между web и nginx',
        'depends_on с healthcheck условием для db'
      ],
      expectedOutput: 'docker-compose -f docker-compose.prod.yml up -d\nAll 5 services started\nNginx доступен на :80, проксирует на gunicorn',
      hint: 'Статические файлы: создай volume staticfiles и подключи к web (/app/staticfiles) и nginx (/app/staticfiles). Nginx конфиг через bind mount.',
      solution: '# docker-compose.prod.yml\nversion: "3.9"\nservices:\n  web:\n    build: .\n    command: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000 --workers 4\n    volumes:\n      - staticfiles:/app/staticfiles\n    env_file: .env.prod\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_started\n  db:\n    image: postgres:15-alpine\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    env_file: .env.prod\n    healthcheck:\n      test: ["CMD", "pg_isready", "-U", "myuser"]\n      interval: 5s\n      retries: 5\n  redis:\n    image: redis:7-alpine\n  celery:\n    build: .\n    command: celery -A myproject worker -l info\n    env_file: .env.prod\n    depends_on: [db, redis]\n  nginx:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf\n      - staticfiles:/app/staticfiles\n    depends_on: [web]\nvolumes:\n  postgres_data:\n  staticfiles:',
      explanation: 'healthcheck на db гарантирует, что Django не стартует до готовности PostgreSQL. Shared volume staticfiles позволяет nginx отдавать статику напрямую без обращения к gunicorn — в разы быстрее.'
    },
    {
      id: 7,
      title: 'Практика: CI/CD деплой скрипт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши deploy.sh скрипт для автоматического деплоя Django приложения на сервер.',
      requirements: [
        'Pull последнего кода с git',
        'Пересборка Docker образов',
        'Применение миграций',
        'Сборка статики',
        'Перезапуск сервисов без даунтайма (--no-deps)',
        'Логирование каждого шага'
      ],
      expectedOutput: 'bash deploy.sh\n[OK] Код обновлён\n[OK] Образы пересобраны\n[OK] Миграции применены\n[OK] Статика собрана\n[OK] Сервисы перезапущены',
      hint: 'Используй docker-compose -f docker-compose.prod.yml. Для zero-downtime: сначала запусти новый контейнер, затем останови старый через --no-deps web.',
      solution: '#!/bin/bash\nset -e  # остановить при ошибке\n\necho "[...] Обновление кода"\ngit pull origin main\necho "[OK] Код обновлён"\n\necho "[...] Пересборка образов"\ndocker-compose -f docker-compose.prod.yml build\necho "[OK] Образы пересобраны"\n\necho "[...] Применение миграций"\ndocker-compose -f docker-compose.prod.yml run --rm web python manage.py migrate\necho "[OK] Миграции применены"\n\necho "[...] Сборка статики"\ndocker-compose -f docker-compose.prod.yml run --rm web python manage.py collectstatic --noinput\necho "[OK] Статика собрана"\n\necho "[...] Перезапуск сервисов"\ndocker-compose -f docker-compose.prod.yml up -d --no-deps web celery\necho "[OK] Сервисы перезапущены"',
      explanation: 'set -e останавливает скрипт при первой ошибке. run --rm запускает разовую команду в новом контейнере и удаляет его. --no-deps перезапускает только web и celery, не трогая db и redis.'
    }
  ]
}
