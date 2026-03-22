export default {
  id: 5,
  title: 'Multi-stage builds (многоэтапная сборка)',
  description: 'Multi-stage build позволяет использовать разные образы для сборки и для запуска. Сборка в fat-образе с инструментами, финальный образ только с артефактами. Уменьшение размера образа в 5-20 раз.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны multi-stage builds',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проблема: для сборки приложения нужны компиляторы, инструменты сборки, devDependencies. Для запуска — только скомпилированный код и runtime-зависимости. Multi-stage: собрать в большом образе, скопировать только артефакты в маленький.' },
        { type: 'code', language: 'yaml', value: '# БЕЗ multi-stage: один большой образ\n# FROM node:18          <- 1.09GB\n# COPY . .\n# RUN npm install       <- включает devDependencies\n# RUN npm run build\n# CMD ["node", "dist/server.js"]\n# Итого: 1.09GB + node_modules + devDeps = ~1.5GB\n\n# С multi-stage: маленький финальный образ\n# Stage 1 (builder): 1.09GB — только для сборки\n# Stage 2 (runtime): 23MB — только для запуска\n# Финальный образ: ~100MB (runtime + dist)\n\n# Синтаксис multi-stage:\n# FROM <image> AS <stage_name>\n# COPY --from=<stage_name> <src> <dest>\n\n# Запустить конкретный stage (для debug):\n# docker build --target builder -t myapp:debug .\n\n# COPY --from работает с:\n# - Named stages: COPY --from=builder /app/dist .\n# - Stage numbers: COPY --from=0 /app/dist .\n# - Внешними образами: COPY --from=nginx:alpine /etc/nginx/nginx.conf .\n\n# Пример экономии:\n# Go приложение БЕЗ multi-stage: ~800MB (go toolchain)\n# Go приложение С multi-stage: ~10MB (только статический бинарник!)\n# Экономия: 80x!' },
        { type: 'tip', value: 'Multi-stage build — стандарт для production образов. Никогда не включай в финальный образ: компиляторы, SDK, тестовые зависимости, .git директорию, документацию. Правило: в финальном образе только то что нужно для работы приложения.' }
      ]
    },
    {
      id: 2,
      title: 'Multi-stage для Go приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go — идеальный кандидат для multi-stage: компилятор создаёт статический бинарник который можно запустить даже в scratch образе (пустой образ без ОС).' },
        { type: 'code', language: 'yaml', value: '# Многоэтапная сборка Go приложения\n# Dockerfile\n\n# Stage 1: Сборка\nFROM golang:1.21-alpine AS builder\n\nWORKDIR /build\n\n# Скопировать go.mod и go.sum для кэша зависимостей\nCOPY go.mod go.sum ./\nRUN go mod download\n\n# Скопировать исходный код\nCOPY . .\n\n# Собрать статический бинарник\nRUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \\\n    go build \\\n    -ldflags="-w -s" \\\n    -o app \\\n    ./cmd/server\n\n# CGO_ENABLED=0: без cgo библиотек (статическая линковка)\n# -ldflags="-w -s": убрать debug symbols (меньше бинарник)\n# Результат: /build/app — одиночный статический файл\n\n# Stage 2: Минимальный runtime (scratch = пустой!)\nFROM scratch\n\n# Добавить корневые сертификаты (для HTTPS)\nCOPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n\n# Только бинарник из stage 1\nCOPY --from=builder /build/app /app\n\nEXPOSE 8080\n\n# ENTRYPOINT для scratch (нет shell!)\nENTRYPOINT [\"/app\"]\n\n# Результат:\n# builder stage: 350MB (golang:alpine + зависимости)\n# Финальный образ: ~10MB (только бинарник + сертификаты)' },
        { type: 'note', value: 'scratch — специальный пустой образ Docker. Нет shell, нет инструментов, нет ничего кроме того что ты добавил. Максимально безопасный (нечего атаковать) и минимальный. Для Go и Rust отлично работает, для Python/Node — нет (нужен интерпретатор).' }
      ]
    },
    {
      id: 3,
      title: 'Multi-stage для Node.js (React/TypeScript)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фронтенд-приложения: Node.js + npm для сборки, nginx для раздачи статики. Классический multi-stage паттерн.' },
        { type: 'code', language: 'yaml', value: '# React/TypeScript приложение -> nginx\n# Dockerfile\n\n# Stage 1: Dependencies\nFROM node:18-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n\n# Stage 2: Builder\nFROM node:18-alpine AS builder\nWORKDIR /app\n# Скопировать зависимости из stage deps\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\n# Build TypeScript/React\nRUN npm run build\n# Результат: /app/dist или /app/build\n\n# Stage 3: Production (nginx)\nFROM nginx:1.25-alpine AS production\n\n# Кастомный nginx конфиг (SPA routing)\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n\n# Только собранные файлы\nCOPY --from=builder /app/dist /usr/share/nginx/html\n\nEXPOSE 80\n\n# nginx.conf для SPA (React Router):\n# server {\n#     listen 80;\n#     location / {\n#         root /usr/share/nginx/html;\n#         index index.html;\n#         try_files $uri $uri/ /index.html;  # SPA fallback!\n#     }\n# }\n\n# Размеры:\n# node:18-alpine + devDeps + build: ~500MB\n# nginx:alpine + dist: ~30MB\n# Экономия: 15x!\n\n# Запуск:\n# docker build -t frontend:latest .\n# docker run -d -p 80:80 frontend:latest\n\n# Просмотр определённого stage:\n# docker build --target builder -t frontend:debug .\n# docker run --rm -it frontend:debug ls /app/dist' },
        { type: 'tip', value: 'Три stage (deps, builder, production) — паттерн для максимального кэширования. deps stage кэширует node_modules отдельно. builder копирует node_modules из deps — если package.json не изменился, зависимости используются из кэша даже при изменении кода.' }
      ]
    },
    {
      id: 4,
      title: 'Multi-stage для Java/Maven',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java приложения требуют JDK для компиляции но только JRE для запуска. Maven/Gradle — огромные инструменты которые не нужны в production.' },
        { type: 'code', language: 'yaml', value: '# Spring Boot приложение с Maven\n# Dockerfile\n\n# Stage 1: Build\nFROM maven:3.9-eclipse-temurin-21-alpine AS builder\n\nWORKDIR /build\n\n# Кэш Maven зависимостей\nCOPY pom.xml .\n# Скачать зависимости без кода (docker layer cache!)\nRUN mvn dependency:go-offline -q\n\n# Скопировать исходный код и собрать\nCOPY src ./src\nRUN mvn package -q -DskipTests\n# Результат: /build/target/app.jar\n\n# Stage 2: JRE runtime (намного меньше JDK)\nFROM eclipse-temurin:21-jre-alpine AS production\n\nWORKDIR /app\n\n# Создать пользователя\nRUN adduser -D -u 1000 appuser\n\n# Скопировать только JAR файл\nCOPY --from=builder /build/target/*.jar app.jar\n\n# Spring Boot layered JAR (оптимизация кэша)\n# Разбить JAR на слои для лучшего кэширования Docker слоёв\nRUN java -Djarmode=layertools -jar app.jar extract\n\nUSER appuser\n\nHEALTHCHECK --interval=30s --timeout=5s \\\n    CMD wget -qO- http://localhost:8080/actuator/health || exit 1\n\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n\n# Оптимизация JVM для контейнеров:\n# ENTRYPOINT [\"java\",\n#   \"-XX:+UseContainerSupport\",\n#   \"-XX:MaxRAMPercentage=75.0\",\n#   \"-jar\", \"app.jar\"]\n\n# Размеры:\n# maven:3.9-temurin-21: ~700MB\n# eclipse-temurin:21-jre-alpine: ~200MB (без компилятора)\n# Экономия: 3.5x (меньше чем Go но всё равно значительная)' },
        { type: 'note', value: 'Для Java: -XX:+UseContainerSupport (включено по умолчанию в JDK 11+) позволяет JVM правильно читать лимиты контейнера (--memory) вместо total RAM хоста. -XX:MaxRAMPercentage=75.0 использует 75% от memory limit контейнера для heap.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Multi-stage build сравнение размеров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай single-stage и multi-stage Dockerfile для одного приложения и сравни результаты.',
      requirements: [
        'Создай Node.js TypeScript приложение с devDependencies (typescript, ts-node)',
        'Napиши single-stage Dockerfile: включает все devDeps, tsx напрямую',
        'Напиши multi-stage Dockerfile: компиляция в одном stage, production в другом',
        'Сравни размеры образов: docker images',
        'Проверь что финальный образ не содержит typescript и node_modules devDeps',
        'Замерь время сборки при изменении только TypeScript кода (с кэшем)'
      ],
      hint: 'В stage builder: npm install (все зависимости), npx tsc (компилировать). В stage production: npm ci --only=production, COPY --from=builder /app/dist ./dist. Проверка: docker exec production-container ls node_modules | grep typescript -> ничего.',
      solution: '# server.ts\ncat > server.ts << \'TSEOF\'\nimport express from "express";\nconst app = express();\napp.get("/", (_req, res) => res.json({ msg: "Hello TypeScript!" }));\napp.listen(3000, () => console.log("Running on :3000"));\nTSEOF\n\n# package.json\ncat > package.json << \'PKGEOF\'\n{\n  "scripts": { "build": "tsc", "start": "node dist/server.js" },\n  "dependencies": { "express": "^4.18.2" },\n  "devDependencies": { "typescript": "^5.2.2", "@types/express": "^4.17.20" }\n}\nPKGEOF\n\n# tsconfig.json\ncat > tsconfig.json << \'TSCONF\'\n{\n  "compilerOptions": {\n    "outDir": "dist",\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true\n  },\n  "include": ["*.ts"]\n}\nTSCONF\n\nnpm install  # Создаёт package-lock.json\n\n# SINGLE-STAGE Dockerfile:\ncat > Dockerfile.single << \'EOF\'\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json tsconfig.json ./\nRUN npm install  # Все зависимости включая devDeps\nCOPY *.ts .\nRUN npm run build\nCMD ["node", "dist/server.js"]\nEOF\n\n# MULTI-STAGE Dockerfile:\ncat > Dockerfile.multi << \'EOF\'\n# Stage 1: Build TypeScript\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json tsconfig.json ./\nRUN npm install  # Все зависимости\nCOPY *.ts .\nRUN npm run build\n\n# Stage 2: Production (только dist + prod deps)\nFROM node:18-alpine AS production\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production && npm cache clean --force\nCOPY --from=builder /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD ["node", "dist/server.js"]\nEOF\n\n# Собрать оба образа:\ndocker build -f Dockerfile.single -t ts-single:latest .\ndocker build -f Dockerfile.multi -t ts-multi:latest .\n\n# Сравнить размеры:\ndocker images | grep "ts-"\n# ts-single  latest  abc  recently  300MB\n# ts-multi   latest  def  recently  110MB <- ~3x меньше!\n\n# Проверить что devDeps нет в production:\ndocker run --rm ts-multi ls node_modules | grep typescript\n# (пусто)\ndocker run --rm ts-single ls node_modules | grep typescript\n# typescript\n\n# Тест кэша при изменении кода:\necho "// comment" >> server.ts\ntime docker build -f Dockerfile.multi -t ts-multi:v2 .\n# Только последний stage пересобирается!',
      explanation: 'Multi-stage убирает из финального образа: TypeScript компилятор, @types пакеты, все devDependencies. Результат в 2-3x меньше для Node.js, 10-80x для Go/Rust. Тест кэша: изменение только .ts файлов не трогает слой npm ci --only=production — он кэшируется.'
    },
    {
      id: 6,
      title: 'Практика: Оптимизация существующего Dockerfile',
      type: 'practice',
      difficulty: 'hard',
      description: 'Возьми неоптимальный Dockerfile и улучши его используя все изученные техники.',
      requirements: [
        'Дан "плохой" Dockerfile: большой образ, нет кэша, запуск от root, нет healthcheck',
        'Применить multi-stage: сборка отдельно от runtime',
        'Оптимизировать порядок инструкций для максимального кэширования',
        'Добавить USER, HEALTHCHECK, LABEL, правильный .dockerignore',
        'Сравнить размер до и после: должно быть минимум в 3x меньше',
        'Провести security scan через docker scout или trivy'
      ],
      hint: 'Базовые принципы оптимизации: alpine вместо full, multi-stage, порядок инструкций (deps перед кодом), чистка кэша в одном RUN. Trivy: docker run aquasec/trivy image myapp:latest.',
      solution: '# ПЛОХОЙ Dockerfile (исходник):\ncat > Dockerfile.bad << \'EOF\'\nFROM python:3.11\nCOPY . .\nRUN pip install flask gunicorn requests boto3 pandas\nRUN apt-get update && apt-get install -y curl\nEXPOSE 8000\nCMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]\nEOF\n# Проблемы: python:3.11 (900MB), COPY . . в начале, нет --no-cache-dir,\n# нет очистки apt, нет USER, нет HEALTHCHECK\n\ndocker build -f Dockerfile.bad -t app:bad .\ndocker images app:bad  # ~1.5GB!\n\n# ХОРОШИЙ Dockerfile:\ncat > Dockerfile.good << \'EOF\'\n# Stage 1: Зависимости (кэш)\nFROM python:3.11-slim AS dependencies\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Stage 2: Production\nFROM python:3.11-slim AS production\n\nWORKDIR /app\n\n# Системные зависимости (редко меняются)\nRUN apt-get update && \\\n    apt-get install -y --no-install-recommends curl && \\\n    rm -rf /var/lib/apt/lists/* && \\\n    adduser --disabled-password --gecos "" appuser\n\n# Python зависимости из stage 1\nCOPY --from=dependencies /usr/local/lib/python3.11 /usr/local/lib/python3.11\nCOPY --from=dependencies /usr/local/bin /usr/local/bin\n\n# Код (меняется часто — в конце)\nCOPY --chown=appuser:appuser . .\n\nUSER appuser\n\nLABEL version="2.0.0" maintainer="team@example.com"\n\nEXPOSE 8000\n\nHEALTHCHECK --interval=30s --timeout=5s --retries=3 \\\n    CMD curl -f http://localhost:8000/health || exit 1\n\nCMD [\"gunicorn\", \"--bind\", \"0.0.0.0:8000\", \"--workers\", \"2\", \"app:app\"]\nEOF\n\ndocker build -f Dockerfile.good -t app:good .\ndocker images | grep "^app"\n# app  bad   xxx  recently  1.5GB\n# app  good  yyy  recently  200MB  <- 7x меньше!\n\n# Security scan с Trivy:\ndocker run --rm \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  aquasec/trivy image app:bad\n# CRITICAL: X (OLD образ = много уязвимостей)\n\ndocker run --rm \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  aquasec/trivy image app:good\n# CRITICAL: 0 или значительно меньше (slim + свежий)',
      explanation: 'Оптимизация образа: 1) slim вместо full (900MB -> 130MB для python), 2) --no-cache-dir для pip, 3) apt очистка в том же RUN, 4) USER appuser (безопасность), 5) HEALTHCHECK (orchestration). Итог: 7x меньше образ, меньше уязвимостей, безопаснее.'
    }
  ]
}
