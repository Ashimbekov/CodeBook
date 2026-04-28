export default {
  id: 7,
  title: 'Docker: основы',
  description: 'Основы Docker: образы, контейнеры, Dockerfile, команды Docker CLI, работа с Docker Hub.',
  lessons: [
    {
      id: 1,
      title: 'Образы и контейнеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Image (образ) — неизменяемый шаблон для создания контейнеров. Контейнер — запущенный экземпляр образа. Один образ может порождать множество контейнеров.' },
        { type: 'heading', value: 'Работа с образами' },
        { type: 'code', language: 'bash', value: '# Скачать образ из Docker Hub\ndocker pull nginx:latest\ndocker pull python:3.11-slim\ndocker pull ubuntu:22.04\n\n# Список локальных образов\ndocker images\n# REPOSITORY   TAG          IMAGE ID       SIZE\n# nginx        latest       abc123         187MB\n# python       3.11-slim    def456         131MB\n\n# Удалить образ\ndocker rmi nginx:latest\ndocker rmi abc123                     # По ID\ndocker image prune                    # Удалить неиспользуемые\ndocker image prune -a                 # Удалить ВСЕ неиспользуемые\n\n# Информация об образе\ndocker inspect nginx:latest\ndocker history nginx:latest           # Слои образа\n\n# Теги образов\n# nginx:latest      — последняя версия (не рекомендуется в продакшене)\n# nginx:1.25.3      — конкретная версия (рекомендуется)\n# python:3.11-slim  — облегчённая версия\n# python:3.11-alpine — на базе Alpine Linux (минимальная)' },
        { type: 'warning', value: 'Никогда не используй тег :latest в продакшене. Он может измениться в любой момент, и ваш деплой станет непредсказуемым. Всегда указывай конкретную версию: nginx:1.25.3.' }
      ]
    },
    {
      id: 2,
      title: 'Запуск и управление контейнерами',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker run — основная команда для создания и запуска контейнеров. Она комбинирует docker create и docker start.' },
        { type: 'heading', value: 'docker run и его флаги' },
        { type: 'code', language: 'bash', value: '# Базовый запуск\ndocker run nginx                      # Запустить в foreground\ndocker run -d nginx                   # Запустить в фоне (detach)\ndocker run -d --name my-nginx nginx   # С именем\n\n# Порты\ndocker run -d -p 8080:80 nginx        # host:container порт\ndocker run -d -p 80:80 -p 443:443 nginx  # Несколько портов\n\n# Переменные окружения\ndocker run -d \\\n  -e DATABASE_URL="postgresql://db:5432/app" \\\n  -e APP_ENV=production \\\n  --env-file .env \\\n  myapp:latest\n\n# Интерактивный режим\ndocker run -it ubuntu:22.04 bash      # Войти в контейнер\ndocker run -it --rm alpine sh         # --rm удалит контейнер после выхода\n\n# Ограничение ресурсов\ndocker run -d \\\n  --memory=512m \\\n  --cpus=1.5 \\\n  --restart=unless-stopped \\\n  myapp:latest' },
        { type: 'heading', value: 'Управление контейнерами' },
        { type: 'code', language: 'bash', value: '# Список контейнеров\ndocker ps                             # Запущенные\ndocker ps -a                          # Все (включая остановленные)\n\n# Остановка и удаление\ndocker stop my-nginx                  # Остановить (SIGTERM)\ndocker kill my-nginx                  # Убить (SIGKILL)\ndocker rm my-nginx                    # Удалить остановленный\ndocker rm -f my-nginx                 # Остановить и удалить\n\n# Войти в работающий контейнер\ndocker exec -it my-nginx bash         # Открыть shell\ndocker exec my-nginx cat /etc/nginx/nginx.conf  # Выполнить команду\n\n# Логи\ndocker logs my-nginx                  # Все логи\ndocker logs -f my-nginx               # Следить (follow)\ndocker logs --tail 100 my-nginx       # Последние 100 строк\ndocker logs --since "1h" my-nginx     # За последний час\n\n# Ресурсы\ndocker stats                          # CPU/Memory всех контейнеров\ndocker top my-nginx                   # Процессы в контейнере\n\n# Очистка\ndocker system prune                   # Удалить всё неиспользуемое\ndocker system prune -a --volumes      # Полная очистка' },
        { type: 'tip', value: '--restart=unless-stopped автоматически перезапускает контейнер при падении и при перезагрузке сервера. Для продакшена это обязательный флаг (если не используется Kubernetes).' }
      ]
    },
    {
      id: 3,
      title: 'Dockerfile: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dockerfile — текстовый файл с инструкциями для создания Docker-образа. Каждая инструкция создаёт новый слой в образе.' },
        { type: 'heading', value: 'Основные инструкции' },
        { type: 'code', language: 'dockerfile', value: '# Базовый Dockerfile для Python приложения\nFROM python:3.11-slim\n\n# Метаданные\nLABEL maintainer="devops@company.com"\nLABEL version="1.0"\n\n# Рабочий каталог\nWORKDIR /app\n\n# Копирование зависимостей (отдельно для кэширования)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Копирование кода приложения\nCOPY . .\n\n# Переменные окружения\nENV APP_ENV=production\nENV APP_PORT=8080\n\n# Открыть порт (документация)\nEXPOSE 8080\n\n# Пользователь (не root!)\nRUN useradd -m appuser\nUSER appuser\n\n# Команда запуска\nCMD ["python", "app.py"]' },
        { type: 'heading', value: 'Инструкции Dockerfile' },
        { type: 'code', language: 'dockerfile', value: '# FROM     — базовый образ (ОБЯЗАТЕЛЬНО первая инструкция)\nFROM ubuntu:22.04\nFROM node:20-alpine\n\n# RUN      — выполнить команду при сборке\nRUN apt-get update && apt-get install -y curl\nRUN npm install\n\n# COPY     — копировать файлы из контекста в образ\nCOPY package.json .\nCOPY src/ ./src/\n\n# ADD      — как COPY + распаковка архивов + URL\nADD app.tar.gz /opt/\n\n# WORKDIR  — рабочий каталог (как cd)\nWORKDIR /app\n\n# ENV      — переменные окружения\nENV NODE_ENV=production\n\n# EXPOSE   — порт (только документация!)\nEXPOSE 3000\n\n# USER     — от какого пользователя запускать\nUSER node\n\n# CMD      — команда при запуске контейнера (можно переопределить)\nCMD ["node", "server.js"]\n\n# ENTRYPOINT — главная команда (нельзя легко переопределить)\nENTRYPOINT ["python", "app.py"]\n\n# HEALTHCHECK — проверка здоровья\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD curl -f http://localhost:8080/health || exit 1' },
        { type: 'note', value: 'COPY предпочтительнее ADD (более предсказуемый). CMD можно переопределить при docker run, ENTRYPOINT — нет. Используй ENTRYPOINT для основной команды, CMD — для аргументов по умолчанию.' }
      ]
    },
    {
      id: 4,
      title: 'Сборка и оптимизация образов',
      type: 'theory',
      content: [
        { type: 'text', value: 'docker build собирает образ из Dockerfile. Оптимизация размера и скорости сборки — важная часть работы с Docker.' },
        { type: 'heading', value: 'Команда docker build' },
        { type: 'code', language: 'bash', value: '# Сборка образа\ndocker build -t myapp:latest .\ndocker build -t myapp:1.0.0 .\ndocker build -t registry.company.com/myapp:1.0.0 .\n\n# Флаги\ndocker build -t myapp:latest -f Dockerfile.prod .   # Другой Dockerfile\ndocker build --no-cache -t myapp:latest .           # Без кэша\ndocker build --build-arg VERSION=1.0 -t myapp .\n\n# .dockerignore — исключить файлы из контекста\nnode_modules\n.git\n.env\n*.log\n__pycache__\n.pytest_cache\nvenv' },
        { type: 'heading', value: 'Оптимизация Dockerfile' },
        { type: 'code', language: 'dockerfile', value: '# ПЛОХО: каждый RUN = новый слой\nRUN apt-get update\nRUN apt-get install -y curl\nRUN apt-get install -y wget\nRUN apt-get clean\n\n# ХОРОШО: один RUN, меньше слоёв, очистка кэша\nRUN apt-get update && \\\n    apt-get install -y --no-install-recommends \\\n      curl \\\n      wget && \\\n    apt-get clean && \\\n    rm -rf /var/lib/apt/lists/*\n\n# ПЛОХО: копирование ВСЕГО до установки зависимостей\nCOPY . .\nRUN pip install -r requirements.txt\n# Любое изменение кода -> пересборка зависимостей!\n\n# ХОРОШО: сначала зависимости, потом код\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\n# Изменение кода НЕ пересобирает зависимости!\n\n# Используй slim/alpine образы\nFROM python:3.11          # 1.0 GB\nFROM python:3.11-slim     # 131 MB\nFROM python:3.11-alpine   # 52 MB' },
        { type: 'tip', value: 'Порядок инструкций в Dockerfile влияет на кэширование. Помещай редко меняющиеся слои (зависимости) вверху, часто меняющиеся (код) — внизу. Это ускоряет пересборку в разы.' }
      ]
    },
    {
      id: 5,
      title: 'Docker Hub и реестры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Registry — хранилище образов. Docker Hub — публичный реестр по умолчанию. В корпоративной среде используют приватные реестры: AWS ECR, GitHub Container Registry, GitLab Registry.' },
        { type: 'heading', value: 'Работа с Docker Hub' },
        { type: 'code', language: 'bash', value: '# Авторизация\ndocker login\ndocker login -u username\n\n# Тегирование для push\ndocker tag myapp:latest username/myapp:1.0.0\ndocker tag myapp:latest username/myapp:latest\n\n# Push (загрузка)\ndocker push username/myapp:1.0.0\ndocker push username/myapp:latest\n\n# Pull (скачивание)\ndocker pull username/myapp:1.0.0\n\n# Поиск образов\ndocker search nginx' },
        { type: 'heading', value: 'Приватные реестры' },
        { type: 'code', language: 'bash', value: '# GitHub Container Registry (ghcr.io)\ndocker login ghcr.io -u USERNAME --password-stdin <<< "$GITHUB_TOKEN"\ndocker tag myapp:latest ghcr.io/username/myapp:1.0.0\ndocker push ghcr.io/username/myapp:1.0.0\n\n# AWS ECR\naws ecr get-login-password | docker login --username AWS --password-stdin 123456.dkr.ecr.us-east-1.amazonaws.com\ndocker tag myapp:latest 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0.0\ndocker push 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0.0\n\n# Собственный реестр\ndocker run -d -p 5000:5000 --name registry registry:2\ndocker tag myapp:latest localhost:5000/myapp:1.0.0\ndocker push localhost:5000/myapp:1.0.0\n\n# Стратегия тегирования для CI/CD:\n# myapp:latest          — последняя сборка\n# myapp:1.2.3           — семантическая версия\n# myapp:abc1234         — Git commit SHA\n# myapp:main-20240321   — ветка + дата' },
        { type: 'tip', value: 'Для CI/CD тегируй образы Git commit SHA: myapp:abc1234. Это гарантирует воспроизводимость — всегда знаешь какой код внутри образа. Семантические версии (1.2.3) используй для релизов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Контейнеризация приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Dockerfile для веб-приложения, соберите образ и запустите контейнер.',
      requirements: [
        'Создайте простое веб-приложение (Python Flask или Node.js Express)',
        'Напишите оптимизированный Dockerfile (slim образ, порядок слоёв)',
        'Создайте .dockerignore',
        'Соберите образ с двумя тегами: latest и 1.0.0',
        'Запустите контейнер с маппингом портов и проверьте работу через curl',
        'Просмотрите логи и слои образа'
      ],
      hint: 'Для Flask: pip install flask, app.py с маршрутом /health. Для Node: npm init, express, server.js. Используйте FROM python:3.11-slim или node:20-alpine.',
      expectedOutput: 'Приложение отвечает на http://localhost:8080\ncurl http://localhost:8080/health -> {"status": "ok"}\nОбраз: myapp:1.0.0, размер ~150MB\nСлои: 7-10 слоёв, зависимости кэшированы',
      solution: '# app.py\nfrom flask import Flask, jsonify\napp = Flask(__name__)\n\n@app.route("/health")\ndef health():\n    return jsonify({"status": "ok"})\n\n@app.route("/")\ndef index():\n    return jsonify({"message": "Hello, DevOps!"})\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=8080)\n\n# requirements.txt\n# flask==3.0.0\n# gunicorn==21.2.0\n\n# Dockerfile\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install --no-cache-dir -r requirements.txt\n# COPY . .\n# RUN useradd -m appuser\n# USER appuser\n# EXPOSE 8080\n# HEALTHCHECK --interval=30s CMD curl -f http://localhost:8080/health || exit 1\n# CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]\n\n# .dockerignore\n# .git\n# __pycache__\n# venv\n# .env\n# *.log\n\n# Сборка и запуск\ndocker build -t myapp:latest -t myapp:1.0.0 .\ndocker run -d --name myapp -p 8080:8080 myapp:1.0.0\ncurl http://localhost:8080/health\ndocker logs myapp\ndocker history myapp:1.0.0',
      explanation: 'Оптимизированный Dockerfile: slim-образ (меньше размер), COPY requirements.txt перед COPY . (кэширование зависимостей), non-root user (безопасность), HEALTHCHECK (мониторинг). .dockerignore исключает ненужные файлы из контекста сборки, ускоряя процесс.'
    }
  ]
}
