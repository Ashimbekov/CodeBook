export default {
  id: 8,
  title: 'Docker: продвинутый',
  description: 'Multi-stage builds, тома (volumes), сети Docker, оптимизация и безопасность контейнеров.',
  lessons: [
    {
      id: 1,
      title: 'Multi-stage builds',
      type: 'theory',
      content: [
        { type: 'text', value: 'Multi-stage build позволяет использовать несколько FROM в одном Dockerfile. Это разделяет этапы сборки и финального образа, значительно уменьшая размер.' },
        { type: 'heading', value: 'Зачем нужен multi-stage' },
        { type: 'code', language: 'dockerfile', value: '# ПЛОХО: один этап — всё в одном образе\nFROM node:20\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n# Образ содержит: Node.js, npm, devDependencies, исходники\n# Размер: ~1.2 GB\n\n# ХОРОШО: multi-stage\n# Этап 1: сборка\nFROM node:20 AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Этап 2: финальный образ\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]\n# Образ содержит: только nginx + собранные файлы\n# Размер: ~25 MB' },
        { type: 'heading', value: 'Примеры multi-stage для разных языков' },
        { type: 'code', language: 'dockerfile', value: '# Go приложение\nFROM golang:1.22 AS builder\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -o server .\n\nFROM alpine:3.19\nRUN apk --no-cache add ca-certificates\nCOPY --from=builder /app/server /usr/local/bin/\nEXPOSE 8080\nCMD ["server"]\n# Go: 1.2GB -> 25MB!\n\n# Java (Spring Boot)\nFROM maven:3.9-eclipse-temurin-21 AS builder\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline\nCOPY src ./src\nRUN mvn package -DskipTests\n\nFROM eclipse-temurin:21-jre-alpine\nCOPY --from=builder /app/target/app.jar /app.jar\nEXPOSE 8080\nCMD ["java", "-jar", "/app.jar"]' },
        { type: 'tip', value: 'Multi-stage — стандарт для продакшена. Сборочные зависимости (компиляторы, build tools) не попадают в финальный образ. Это уменьшает размер и площадь атаки.' }
      ]
    },
    {
      id: 2,
      title: 'Volumes: постоянное хранение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Данные внутри контейнера эфемерны — при удалении контейнера данные теряются. Docker Volumes решают эту проблему, предоставляя постоянное хранилище.' },
        { type: 'heading', value: 'Типы хранилищ' },
        { type: 'code', language: 'bash', value: '# 1. Named Volumes (рекомендуется)\ndocker volume create mydata\ndocker run -d -v mydata:/var/lib/postgresql/data postgres:16\n\n# 2. Bind Mounts (монтирование каталога хоста)\ndocker run -d -v /host/path:/container/path myapp\ndocker run -d -v $(pwd)/src:/app/src myapp    # Текущий каталог\n\n# 3. tmpfs (в оперативной памяти)\ndocker run -d --tmpfs /tmp myapp' },
        { type: 'heading', value: 'Управление томами' },
        { type: 'code', language: 'bash', value: '# Создание и управление\ndocker volume create pgdata\ndocker volume ls\ndocker volume inspect pgdata\ndocker volume rm pgdata\ndocker volume prune                  # Удалить неиспользуемые\n\n# PostgreSQL с постоянным хранилищем\ndocker run -d \\\n  --name postgres \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v pgdata:/var/lib/postgresql/data \\\n  -p 5432:5432 \\\n  postgres:16\n\n# Контейнер можно удалить и создать заново — данные сохранятся!\ndocker rm -f postgres\ndocker run -d \\\n  --name postgres \\\n  -e POSTGRES_PASSWORD=secret \\\n  -v pgdata:/var/lib/postgresql/data \\\n  -p 5432:5432 \\\n  postgres:16\n# Данные на месте!\n\n# Bind mount для разработки (hot reload)\ndocker run -d \\\n  --name dev-app \\\n  -v $(pwd)/src:/app/src \\\n  -p 3000:3000 \\\n  myapp:dev\n# Изменения в ./src сразу видны в контейнере' },
        { type: 'warning', value: 'Bind mounts привязаны к файловой системе хоста — они не переносимы между серверами. Для продакшена используй named volumes. Bind mounts хороши для разработки (монтирование исходного кода).' }
      ]
    },
    {
      id: 3,
      title: 'Docker Networking',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker создаёт виртуальные сети для контейнеров. Контейнеры в одной сети могут общаться по именам. Понимание сетей Docker критично для multi-container приложений.' },
        { type: 'heading', value: 'Типы сетей' },
        { type: 'code', language: 'bash', value: '# Встроенные драйверы сетей:\n# bridge  — по умолчанию, изолированная сеть\n# host    — контейнер использует сеть хоста\n# none    — без сети\n# overlay — для Docker Swarm (multi-host)\n\n# Список сетей\ndocker network ls\n# bridge   — сеть по умолчанию\n# host     — сеть хоста\n# none     — без сети\n\n# Создание пользовательской сети\ndocker network create mynet\ndocker network create --driver bridge --subnet 172.20.0.0/16 mynet' },
        { type: 'heading', value: 'Работа с сетями' },
        { type: 'code', language: 'bash', value: '# Запуск контейнеров в одной сети\ndocker network create app-network\n\ndocker run -d \\\n  --name postgres \\\n  --network app-network \\\n  -e POSTGRES_PASSWORD=secret \\\n  postgres:16\n\ndocker run -d \\\n  --name myapp \\\n  --network app-network \\\n  -e DATABASE_URL=postgresql://postgres:secret@postgres:5432/mydb \\\n  -p 8080:8080 \\\n  myapp:latest\n\n# Контейнер myapp обращается к postgres по ИМЕНИ "postgres"\n# DNS-резолвинг имён контейнеров работает автоматически!\n\n# Проверка связности\ndocker exec myapp ping postgres\ndocker exec myapp nslookup postgres\n\n# Подключить/отключить контейнер от сети\ndocker network connect app-network existing-container\ndocker network disconnect app-network existing-container\n\n# Инспекция сети\ndocker network inspect app-network' },
        { type: 'note', value: 'В пользовательских сетях (не default bridge) контейнеры могут обращаться друг к другу по имени. В default bridge DNS не работает — нужно использовать IP. Всегда создавайте пользовательские сети.' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность Docker',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность контейнеров — критический аспект DevOps. Образы могут содержать уязвимости, контейнеры могут быть запущены с избыточными правами.' },
        { type: 'heading', value: 'Основные правила безопасности' },
        { type: 'code', language: 'dockerfile', value: '# 1. Не запускай от root\nFROM python:3.11-slim\nRUN useradd -m -r appuser\nUSER appuser\nWORKDIR /home/appuser/app\nCOPY --chown=appuser:appuser . .\nCMD ["python", "app.py"]\n\n# 2. Используй конкретные версии\nFROM python:3.11.7-slim-bookworm    # Конкретная версия + ОС\n# НЕ: FROM python:latest\n\n# 3. Минимальные права\nRUN chmod 444 /app/config.yml        # Только чтение\nRUN chmod 555 /app/entrypoint.sh     # Только чтение + выполнение' },
        { type: 'heading', value: 'Сканирование уязвимостей' },
        { type: 'code', language: 'bash', value: '# Trivy — сканер уязвимостей\ndocker run --rm \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  aquasec/trivy:latest image myapp:latest\n\n# Docker Scout (встроенный)\ndocker scout cves myapp:latest\ndocker scout recommendations myapp:latest\n\n# Проверка образа\ndocker history myapp:latest          # Слои и команды\ndocker inspect myapp:latest          # Полная информация\n\n# Запуск с ограничениями\ndocker run -d \\\n  --name myapp \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --security-opt=no-new-privileges \\\n  --cap-drop=ALL \\\n  --memory=256m \\\n  --cpus=0.5 \\\n  myapp:latest\n\n# --read-only         — файловая система только для чтения\n# --no-new-privileges — запрет повышения привилегий\n# --cap-drop=ALL      — удалить все Linux capabilities' },
        { type: 'warning', value: 'Никогда не монтируй Docker socket (/var/run/docker.sock) в контейнер без крайней необходимости. Это даёт контейнеру полный контроль над Docker хоста — эквивалент root доступа.' }
      ]
    },
    {
      id: 5,
      title: 'Docker в разработке и отладка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker упрощает разработку: единое окружение, быстрое развёртывание зависимостей, изоляция проектов. При этом важно уметь отлаживать проблемы с контейнерами.' },
        { type: 'heading', value: 'Docker для разработки' },
        { type: 'code', language: 'dockerfile', value: '# Dockerfile.dev — для разработки\nFROM python:3.11-slim\nWORKDIR /app\n\n# Зависимости (включая dev)\nCOPY requirements.txt requirements-dev.txt ./\nRUN pip install -r requirements.txt -r requirements-dev.txt\n\n# Hot reload: код монтируется через volume\n# НЕ копируем код в образ!\n\nEXPOSE 8080\nCMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080", "--reload"]' },
        { type: 'code', language: 'bash', value: '# Запуск с hot reload\ndocker build -f Dockerfile.dev -t myapp:dev .\ndocker run -d \\\n  --name myapp-dev \\\n  -v $(pwd)/src:/app/src \\\n  -p 8080:8080 \\\n  myapp:dev\n# Изменения в ./src автоматически применяются!' },
        { type: 'heading', value: 'Отладка контейнеров' },
        { type: 'code', language: 'bash', value: '# Контейнер не запускается? Проверь логи:\ndocker logs myapp\ndocker logs --tail 50 myapp\n\n# Войти в работающий контейнер\ndocker exec -it myapp bash\ndocker exec -it myapp sh          # Если нет bash (alpine)\n\n# Запустить контейнер с переопределённой командой\ndocker run -it --entrypoint bash myapp:latest\n\n# Копировать файлы из/в контейнер\ndocker cp myapp:/app/logs/error.log ./\ndocker cp ./config.yml myapp:/app/config.yml\n\n# Проверить ресурсы\ndocker stats myapp\n\n# Проверить события\ndocker events --filter container=myapp\n\n# Сохранить контейнер как образ (для анализа)\ndocker commit myapp debug-image\ndocker run -it debug-image bash\n\n# Проверить сеть контейнера\ndocker exec myapp cat /etc/hosts\ndocker exec myapp ping postgres\ndocker exec myapp curl -v http://backend:8080/health' },
        { type: 'tip', value: 'Если контейнер падает сразу после запуска, используй docker run -it --entrypoint bash myapp:latest чтобы войти внутрь и запустить команду вручную. Это покажет ошибку.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Multi-stage сборка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте multi-stage Dockerfile для приложения, настройте volumes и networking.',
      requirements: [
        'Напишите multi-stage Dockerfile (builder + runtime)',
        'Финальный образ должен быть на базе alpine или slim',
        'Образ должен запускаться от non-root пользователя',
        'Создайте Docker-сеть и запустите приложение + PostgreSQL',
        'Настройте volume для данных PostgreSQL',
        'Приложение должно подключаться к PostgreSQL по имени контейнера'
      ],
      hint: 'Multi-stage: FROM ... AS builder для сборки, FROM alpine для финального образа. COPY --from=builder для копирования артефактов. Для сети: docker network create.',
      expectedOutput: 'Multi-stage образ собран: ~50MB вместо ~1GB\nPostgreSQL запущен с persistent volume\nПриложение подключается к PostgreSQL по имени "postgres"\ncurl http://localhost:8080/health -> OK\ndocker stats показывает оба контейнера',
      solution: '# Dockerfile (multi-stage для Python)\n# --- Stage 1: Builder ---\n# FROM python:3.11-slim AS builder\n# WORKDIR /build\n# COPY requirements.txt .\n# RUN pip install --user --no-cache-dir -r requirements.txt\n# COPY . .\n#\n# --- Stage 2: Runtime ---\n# FROM python:3.11-slim\n# RUN useradd -m appuser\n# WORKDIR /app\n# COPY --from=builder /root/.local /home/appuser/.local\n# COPY --from=builder /build/app.py .\n# ENV PATH=/home/appuser/.local/bin:$PATH\n# USER appuser\n# EXPOSE 8080\n# HEALTHCHECK --interval=30s CMD curl -sf http://localhost:8080/health || exit 1\n# CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]\n\n# Команды:\ndocker build -t myapp:1.0.0 .\n\n# Создание сети и запуск\ndocker network create app-net\ndocker volume create pgdata\n\ndocker run -d \\\n  --name postgres \\\n  --network app-net \\\n  -e POSTGRES_PASSWORD=secret \\\n  -e POSTGRES_DB=myapp \\\n  -v pgdata:/var/lib/postgresql/data \\\n  postgres:16-alpine\n\ndocker run -d \\\n  --name myapp \\\n  --network app-net \\\n  -e DATABASE_URL=postgresql://postgres:secret@postgres:5432/myapp \\\n  -p 8080:8080 \\\n  myapp:1.0.0\n\n# Проверка\ncurl http://localhost:8080/health\ndocker stats --no-stream',
      explanation: 'Multi-stage build разделяет сборку и runtime. Builder-этап содержит все инструменты сборки, runtime-этап — только необходимое для запуска. Named volume pgdata сохраняет данные PostgreSQL между перезапусками. Пользовательская сеть app-net обеспечивает DNS-резолвинг по именам контейнеров.'
    }
  ]
}
