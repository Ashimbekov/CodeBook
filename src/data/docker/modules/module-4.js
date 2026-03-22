export default {
  id: 4,
  title: 'Dockerfile: FROM, COPY, RUN, CMD, ENTRYPOINT',
  description: 'Создание собственных Docker образов через Dockerfile. Все основные инструкции: FROM, COPY, ADD, RUN, CMD, ENTRYPOINT, ENV, ARG, WORKDIR, EXPOSE, USER, LABEL, HEALTHCHECK.',
  lessons: [
    {
      id: 1,
      title: 'Структура Dockerfile и инструкция FROM',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dockerfile — текстовый файл с инструкциями для сборки образа. Каждая инструкция создаёт новый слой. FROM — обязательная первая инструкция, задаёт базовый образ.' },
        { type: 'code', language: 'bash', value: '# Простой Dockerfile для Python Flask приложения:\n# Файл: Dockerfile\n\n# FROM: базовый образ\n# FROM <image>[:<tag>] [AS <name>]\n\n# Официальные Python образы:\n# python:3.11          <- Debian, большой (~900MB)\n# python:3.11-slim     <- Debian без лишних пакетов (~130MB)\n# python:3.11-alpine   <- Alpine Linux (~50MB)\n# python:3.11-bookworm <- Debian Bookworm (явная версия ОС)\n\n# Сборка образа:\n# docker build -t myapp:latest .\n# docker build -t myapp:latest -f Dockerfile.prod .\n# docker build --no-cache -t myapp:latest .  # Без кэша\n\n# Просмотр образа:\n# docker history myapp:latest\n# docker inspect myapp:latest\n\n# Многоэтапная сборка (multi-stage) — AS name:\n# FROM node:18 AS builder\n# FROM nginx:alpine\n# COPY --from=builder /app/dist /usr/share/nginx/html' },
        { type: 'code', language: 'yaml', value: '# Пример минимального Dockerfile:\nFROM python:3.11-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\n\nCOPY . .\n\nEXPOSE 5000\n\nCMD ["python", "app.py"]' },
        { type: 'tip', value: 'Выбор базового образа: slim — хороший баланс размера и совместимости. alpine — минимальный, но использует musl libc (могут быть проблемы с некоторыми Python пакетами). Для начала используй slim, переходи на alpine если нет проблем.' }
      ]
    },
    {
      id: 2,
      title: 'COPY и ADD: копирование файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'COPY копирует файлы с хоста в образ. ADD делает то же самое плюс умеет распаковывать tar архивы и скачивать по URL. Рекомендуется использовать COPY для явности.' },
        { type: 'code', language: 'yaml', value: '# COPY: простое копирование\n# COPY <src> <dest>\n\nFROM node:18-alpine\n\nWORKDIR /app\n\n# Копировать один файл:\nCOPY package.json .\n\n# Копировать несколько файлов:\nCOPY package.json package-lock.json ./\n\n# Копировать директорию:\nCOPY src/ ./src/\n\n# Копировать всё (исключения в .dockerignore!):\nCOPY . .\n\n# COPY с --chown: установить владельца\nCOPY --chown=node:node . .\n\n# ADD: расширенные возможности\n# Распаковать архив:\nADD ./data.tar.gz /data/\n# Скачать файл (НЕ рекомендуется в Dockerfile):\nADD https://example.com/config.json /app/config.json\n\n# ЛУЧШЕ использовать RUN curl вместо ADD URL:\nRUN curl -fsSL https://example.com/config.json -o /app/config.json\n\n# COPY --from: из другого stage или образа\nCOPY --from=builder /app/dist ./public\nCOPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf' },
        { type: 'note', value: '.dockerignore работает как .gitignore — исключает файлы из контекста сборки. Всегда создавай .dockerignore: исключи node_modules, .git, .env, __pycache__, *.pyc, тесты. Без .dockerignore COPY . . копирует ВСЁ включая гигабайты зависимостей.' }
      ]
    },
    {
      id: 3,
      title: 'RUN: выполнение команд при сборке',
      type: 'theory',
      content: [
        { type: 'text', value: 'RUN выполняет команды в новом слое образа во время сборки. Каждый RUN — новый слой. Объединяй команды через && для уменьшения слоёв.' },
        { type: 'code', language: 'yaml', value: '# RUN: выполнить команду при сборке\n# RUN <command>  (shell форма: /bin/sh -c)\n# RUN ["executable", "arg1", "arg2"]  (exec форма)\n\n# Плохо: каждая команда = отдельный слой\nRUN apt-get update\nRUN apt-get install -y curl\nRUN apt-get install -y wget\nRUN rm -rf /var/lib/apt/lists/*\n\n# Хорошо: объединить в один слой + очистка кэша\nRUN apt-get update && \\\n    apt-get install -y \\\n        curl \\\n        wget \\\n        git \\\n    && rm -rf /var/lib/apt/lists/*\n# rm -rf /var/lib/apt/lists/* в том же слое!\n# Иначе кэш apt останется в образе даже если его удалить потом\n\n# Python зависимости:\nRUN pip install --no-cache-dir -r requirements.txt\n# --no-cache-dir: не кэшировать загруженные пакеты (меньше образ)\n\n# Node.js зависимости:\nRUN npm ci --only=production\n# npm ci: чистая установка по package-lock.json (для prod)\n\n# Создать пользователя:\nRUN adduser --system --no-create-home --group appuser\n\n# Права доступа:\nRUN chmod +x /app/entrypoint.sh && \\\n    chown -R appuser:appuser /app' },
        { type: 'tip', value: 'Главное правило RUN: всё что устанавливаешь — очисти кэш в том же RUN. apt: rm -rf /var/lib/apt/lists/*. pip: --no-cache-dir. yum: yum clean all. Если очищаешь в отдельном RUN — кэш уже сохранён в предыдущем слое и размер образа не уменьшится.' }
      ]
    },
    {
      id: 4,
      title: 'CMD и ENTRYPOINT: запуск контейнера',
      type: 'theory',
      content: [
        { type: 'text', value: 'CMD задаёт команду по умолчанию при запуске контейнера. ENTRYPOINT задаёт исполняемый файл. Их комбинация позволяет создавать гибкие образы.' },
        { type: 'code', language: 'yaml', value: '# CMD: команда по умолчанию\n# Может быть переопределена при docker run:\n# docker run myapp python other_script.py  <- переопределяет CMD\n\n# Shell форма (НЕ рекомендуется в prod):\nCMD python app.py\n# Проблема: запускается через /bin/sh -c\n# PID 1 = sh, а не python -> неправильная обработка сигналов!\n\n# Exec форма (рекомендуется):\nCMD ["python", "app.py"]\n# PID 1 = python -> правильно получает SIGTERM\n\n# ENTRYPOINT: фиксированный исполняемый файл\n# НЕ переопределяется при docker run (только через --entrypoint)\nENTRYPOINT ["python", "-m"]\nCMD ["app"]\n# docker run myapp      -> python -m app\n# docker run myapp api  -> python -m api  (CMD заменяется!)\n\n# Паттерн: скрипт инициализации как ENTRYPOINT\nCOPY entrypoint.sh /entrypoint.sh\nRUN chmod +x /entrypoint.sh\nENTRYPOINT [\"/entrypoint.sh\"]\nCMD [\"gunicorn\", \"app:app\"]\n\n# entrypoint.sh:\n# #!/bin/sh\n# set -e\n# # Выполнить миграции при первом запуске\n# python manage.py migrate\n# # Передать управление CMD (или аргументам docker run)\n# exec "$@"\n\n# ВАЖНО: exec "$@" в скрипте!\n# Заменяет shell процесс на CMD -> CMD становится PID 1\n# Без exec: shell = PID 1, CMD = дочерний процесс\n# Проблема: SIGTERM получает sh, не передаёт приложению' },
        { type: 'warning', value: 'Всегда используй exec форму ["cmd", "arg"] а не shell форму "cmd arg". Shell форма: CMD python app.py -> sh -c "python app.py" -> PID 1 = sh. При docker stop SIGTERM получает sh, а не python. Приложение не завершается gracefully.' }
      ]
    },
    {
      id: 5,
      title: 'ENV, ARG, WORKDIR, EXPOSE, USER, LABEL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дополнительные инструкции Dockerfile для управления окружением, метаданными и безопасностью.' },
        { type: 'code', language: 'yaml', value: '# ENV: переменные среды доступные в образе И контейнере\nENV NODE_ENV=production\nENV PORT=3000 HOST=0.0.0.0\n\n# ARG: переменные только во время сборки (не в контейнере)\nARG BUILD_VERSION=dev\nARG REGISTRY=docker.io\n# Использование: --build-arg BUILD_VERSION=1.2.3\n# RUN echo "Building version: $BUILD_VERSION"\n\n# ENV vs ARG:\n# ARG -> только при сборке (docker build --build-arg)\n# ENV -> при сборке И в контейнере (docker run -e)\n\n# WORKDIR: рабочая директория\nWORKDIR /app\n# Создаёт директорию если не существует\n# Все последующие COPY, RUN, CMD выполняются в этой директории\n# Лучше чем: RUN mkdir /app && cd /app\n\n# EXPOSE: документирует порт (НЕ публикует!)\nEXPOSE 8000\nEXPOSE 8000/tcp\nEXPOSE 9090/udp\n# Только документация. Реальный маппинг: docker run -p\n# docker run -P публикует все EXPOSE порты на случайные порты хоста\n\n# USER: переключиться на не-root пользователя\nRUN adduser --disabled-password --gecos \'\' appuser\nUSER appuser\n# Все последующие RUN, CMD, ENTRYPOINT выполняются от этого пользователя\n# Критично для безопасности!\n\n# LABEL: метаданные образа\nLABEL maintainer="team@example.com"\nLABEL version="1.0.0"\nLABEL description="My Flask Application"\nLABEL org.opencontainers.image.source="https://github.com/org/repo"\n\n# HEALTHCHECK: проверка состояния\nHEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\\n    CMD curl -f http://localhost:8000/health || exit 1\n# interval: как часто проверять\n# timeout: таймаут одной проверки\n# start-period: ждать перед первой проверкой\n# retries: сколько раз попробовать\n# exit 0 = healthy, exit 1 = unhealthy' },
        { type: 'tip', value: 'USER — важнейшая инструкция безопасности. Никогда не запускай приложение от root внутри контейнера. Если контейнер скомпрометирован, атакующий получит root. С USER appuser: даже при побеге из контейнера — только права appuser на хосте.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Dockerfile для Python приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши оптимизированный Dockerfile для Flask приложения.',
      requirements: [
        'Создай Flask приложение (app.py) с маршрутами / и /health',
        'Напиши Dockerfile: python:3.11-slim, установи зависимости, запусти через gunicorn',
        'Добавь USER для запуска от непривилегированного пользователя',
        'Добавь HEALTHCHECK для проверки /health endpoint',
        'Создай .dockerignore исключающий .git, __pycache__, .env',
        'Собери образ и запусти. Проверь healthcheck через docker inspect'
      ],
      hint: 'gunicorn устанавливается через pip. Команда запуска: gunicorn --bind 0.0.0.0:8000 app:app. HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1. Healthcheck статус: docker inspect --format "{{.State.Health.Status}}" container_name.',
      solution: '# app.py\ncat > app.py << \'PYEOF\'\nfrom flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return jsonify({"message": "Hello from Docker!", "status": "ok"})\n\n@app.route("/health")\ndef health():\n    return jsonify({"status": "healthy"}), 200\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=8000)\nPYEOF\n\n# requirements.txt\ncat > requirements.txt << \'REQEOF\'\nflask==3.0.0\ngunicorn==21.2.0\nREQEOF\n\n# .dockerignore\ncat > .dockerignore << \'IGNEOF\'\n.git\n.gitignore\n__pycache__\n*.pyc\n*.pyo\n.env\n.env.*\nvenv/\n.venv/\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\ntests/\nREADME.md\nIGNEOF\n\n# Dockerfile\ncat > Dockerfile << \'DOCKEREOF\'\nFROM python:3.11-slim\n\n# Метаданные\nLABEL maintainer="developer@example.com"\nLABEL version="1.0.0"\n\n# Рабочая директория\nWORKDIR /app\n\n# Сначала зависимости (кэш слоя при неизменном requirements.txt)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Создать пользователя\nRUN adduser --disabled-password --gecos "" appuser\n\n# Копировать код\nCOPY --chown=appuser:appuser . .\n\n# Переключиться на непривилегированного пользователя\nUSER appuser\n\n# Документировать порт\nEXPOSE 8000\n\n# Healthcheck\nHEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \\\n    CMD python -c "import urllib.request; urllib.request.urlopen(\'http://localhost:8000/health\')"\n\n# Запуск через gunicorn\nCMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]\nDOCKEREOF\n\n# Собрать образ\ndocker build -t flask-demo:latest .\n\n# Запустить\ndocker run -d --name flask-app -p 8000:8000 flask-demo:latest\n\n# Подождать и проверить:\nsleep 15\ndocker inspect --format "{{.State.Health.Status}}" flask-app\n# healthy\n\n# Тест:\ncurl http://localhost:8000/\ncurl http://localhost:8000/health\n\n# Проверить что запущен не от root:\ndocker exec flask-app whoami  # appuser\n\n# Очистка:\ndocker stop flask-app\ndocker rm flask-app',
      explanation: 'Ключевые практики Dockerfile: COPY requirements.txt ПЕРЕД кодом (кэш слоя), --no-cache-dir для pip (меньше образ), USER appuser (безопасность), HEALTHCHECK (orchestration знает о состоянии), exec форма CMD для правильных сигналов. .dockerignore обязателен.'
    },
    {
      id: 7,
      title: 'Практика: Dockerfile для Node.js приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай оптимизированный Dockerfile для Node.js Express приложения.',
      requirements: [
        'Создай простое Express приложение (server.js) с / и /health маршрутами',
        'Dockerfile: node:18-alpine, npm ci для установки production зависимостей',
        'Разделить package.json и код для эффективного кэширования',
        'Запускать от непривилегированного пользователя node (уже существует в node образе)',
        'Сравни размер образа node:18 vs node:18-alpine',
        'Проверь что NODE_ENV=production установлен и npm ci устанавливает только prod зависимости'
      ],
      hint: 'В официальном node образе уже есть пользователь node (UID 1000). USER node. npm ci --only=production или npm ci --omit=dev устанавливает только production зависимости. NODE_ENV=production через ENV.',
      solution: '# server.js\ncat > server.js << \'JSEOF\'\nconst express = require("express");\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get("/", (req, res) => {\n    res.json({ message: "Node.js in Docker!", env: process.env.NODE_ENV });\n});\n\napp.get("/health", (req, res) => {\n    res.json({ status: "healthy", uptime: process.uptime() });\n});\n\napp.listen(PORT, "0.0.0.0", () => {\n    console.log(`Server running on port ${PORT}`);\n});\nJSEOF\n\n# package.json\ncat > package.json << \'PKGEOF\'\n{\n  "name": "node-docker-demo",\n  "version": "1.0.0",\n  "main": "server.js",\n  "scripts": { "start": "node server.js" },\n  "dependencies": { "express": "^4.18.2" },\n  "devDependencies": { "nodemon": "^3.0.0" }\n}\nPKGEOF\n\nnpm install --package-lock-only  # Создать package-lock.json\n\n# Dockerfile\ncat > Dockerfile << \'DOCKEREOF\'\nFROM node:18-alpine\n\nWORKDIR /app\n\nENV NODE_ENV=production\n\n# Сначала зависимости (кэш)\nCOPY package*.json ./\nRUN npm ci --only=production && npm cache clean --force\n\n# Копировать код\nCOPY --chown=node:node . .\n\nUSER node\n\nEXPOSE 3000\n\nHEALTHCHECK --interval=30s --timeout=5s --retries=3 \\\n    CMD wget -qO- http://localhost:3000/health || exit 1\n\nCMD ["node", "server.js"]\nDOCKEREOF\n\n# Сравнение размеров:\ndocker build -t node-demo:alpine .\n\n# Временно изменить на node:18:\nsed -i \'s/node:18-alpine/node:18/\' Dockerfile\ndocker build -t node-demo:full .\nsed -i \'s/node:18/node:18-alpine/\' Dockerfile\n\ndocker images | grep node-demo\n# node-demo  alpine  xxx  recently  85MB\n# node-demo  full    yyy  recently  1.09GB!!\n\n# Запустить и проверить:\ndocker run -d --name node-app -p 3000:3000 node-demo:alpine\ncurl http://localhost:3000/\ndocker exec node-app whoami  # node\ndocker exec node-app node -e "console.log(process.env.NODE_ENV)"  # production',
      explanation: 'Alpine образ (85MB) vs полный Node (1GB) — разница 12x. npm ci (clean install) быстрее и надёжнее npm install для CI/CD. --only=production исключает devDependencies. Пользователь node уже создан в официальных node образах — не нужно создавать вручную.'
    },
    {
      id: 8,
      title: 'Кэширование слоёв и оптимизация Dockerfile',
      type: 'practice',
      difficulty: 'hard',
      description: 'Оптимизируй Dockerfile для максимального использования кэша слоёв.',
      requirements: [
        'Объясни почему COPY . . ПЕРЕД npm install неэффективно — покажи разницу во времени сборки',
        'Перепиши Dockerfile чтобы изменение app.py не инвалидировало кэш зависимостей',
        'Измерь время первой и повторной сборки (изменив только код)',
        'Исследуй docker build --cache-from для распределённого кэша в CI/CD',
        'Напиши Makefile с целями build, push, clean'
      ],
      hint: 'Слои кэшируются пока не изменится содержимое. COPY . . инвалидирует кэш при любом изменении. COPY requirements.txt . -> RUN pip install -> COPY . . — зависимости кэшируются пока requirements.txt не изменился.',
      solution: '# НЕЭФФЕКТИВНЫЙ Dockerfile (не кэшируется):\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY . .           <- любое изменение кода инвалидирует ВСЁ ниже!\n# RUN pip install -r requirements.txt  <- устанавливается каждый раз!\n# CMD ["python", "app.py"]\n\n# ЭФФЕКТИВНЫЙ Dockerfile:\ncat > Dockerfile.efficient << \'DOCKEREOF\'\nFROM python:3.11-slim\nWORKDIR /app\n\n# СНАЧАЛА только зависимости\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n# Этот слой кэшируется пока requirements.txt не изменился!\n\n# ПОТОМ код (часто меняется)\nCOPY . .\n\nCMD ["python", "app.py"]\nDOCKEREOF\n\n# Тест производительности:\ntime docker build -t test:v1 -f Dockerfile.efficient .\n# real 0m45.123s (первая сборка — скачивает образ, ставит пакеты)\n\necho "# Trivial change" >> app.py\ntime docker build -t test:v2 -f Dockerfile.efficient .\n# real 0m1.234s (использует кэш слоя с зависимостями!)\n\n# cache-from: использовать образ из registry как кэш\ndocker build \\\n  --cache-from myrepo/myapp:latest \\\n  -t myrepo/myapp:new \\\n  .\n# CI/CD: сначала pull latest, затем build с cache-from\n\n# Makefile:\ncat > Makefile << \'MAKEEOF\'\nAPP_NAME := myapp\nREGISTRY := myrepo\nVERSION := $(shell git rev-parse --short HEAD)\n\nbuild:\n\tdocker build -t $(REGISTRY)/$(APP_NAME):$(VERSION) .\n\tdocker tag $(REGISTRY)/$(APP_NAME):$(VERSION) $(REGISTRY)/$(APP_NAME):latest\n\npush: build\n\tdocker push $(REGISTRY)/$(APP_NAME):$(VERSION)\n\tdocker push $(REGISTRY)/$(APP_NAME):latest\n\nclean:\n\tdocker rmi $(REGISTRY)/$(APP_NAME):$(VERSION) || true\n\tdocker rmi $(REGISTRY)/$(APP_NAME):latest || true\n\nrun: build\n\tdocker run -d --name $(APP_NAME) -p 8000:8000 $(REGISTRY)/$(APP_NAME):latest\n\nstop:\n\tdocker stop $(APP_NAME) || true\n\tdocker rm $(APP_NAME) || true\n\n.PHONY: build push clean run stop\nMAKEEOF',
      explanation: 'Порядок инструкций в Dockerfile критичен. Часто меняющиеся файлы должны быть ПОЗЖЕ редко меняющихся. requirements.txt меняется редко -> пакеты кэшируются. Код меняется часто -> COPY . . последним. Правило: стабильное снизу, изменчивое сверху. Это ускоряет CI/CD в 10-100x.'
    }
  ]
}
