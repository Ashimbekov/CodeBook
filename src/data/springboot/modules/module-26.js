export default {
  id: 26,
  title: 'Docker и деплой Spring Boot',
  description: 'Контейнеризация Spring Boot приложения с Docker, создание Dockerfile, docker-compose для локальной разработки, деплой на сервер и CI/CD основы',
  lessons: [
    {
      id: 1,
      title: 'Создание Dockerfile для Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker позволяет упаковать приложение со всеми зависимостями в контейнер. Контейнер запускается одинаково на любом сервере. Для Spring Boot нужно: собрать JAR, создать образ на базе JDK.' },
        { type: 'heading', value: 'Базовый Dockerfile' },
        { type: 'code', language: 'java', value: '# Dockerfile\n# Этап 1: сборка\nFROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline  # кешировать зависимости\nCOPY src ./src\nRUN mvn clean package -DskipTests\n\n# Этап 2: запуск\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\n\n# Создать не-root пользователя для безопасности\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser\n\nCOPY --from=build /app/target/*.jar app.jar\n\nEXPOSE 8080\nENTRYPOINT ["java", "-jar", "app.jar"]' },
        { type: 'tip', value: 'Многоэтапная сборка (multi-stage build) уменьшает итоговый образ: этап сборки содержит Maven и JDK, итоговый образ — только JRE и JAR файл.' }
      ]
    },
    {
      id: 2,
      title: 'Оптимизированный Dockerfile с layers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot поддерживает layered JAR: зависимости, ресурсы и код приложения в разных слоях. Docker кеширует слои — пересборка только изменившегося кода, а не всех зависимостей.' },
        { type: 'heading', value: 'Layered Dockerfile' },
        { type: 'code', language: 'java', value: '# Dockerfile (оптимизированный)\nFROM eclipse-temurin:21-jre-alpine AS extract\nWORKDIR /app\nCOPY target/*.jar app.jar\n# Распаковать слои JAR\nRUN java -Djarmode=layertools -jar app.jar extract\n\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nRUN addgroup -S app && adduser -S app -G app && chown -R app:app /app\nUSER app\n\n# Копировать слои в правильном порядке (от редко до часто меняющихся)\nCOPY --from=extract /app/dependencies/ ./\nCOPY --from=extract /app/spring-boot-loader/ ./\nCOPY --from=extract /app/snapshot-dependencies/ ./\nCOPY --from=extract /app/application/ ./\n\nEXPOSE 8080\nENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]' },
        { type: 'heading', value: 'Сборка и запуск' },
        { type: 'code', language: 'java', value: '# Собрать образ\ndocker build -t myapp:1.0 .\n\n# Запустить контейнер\ndocker run -p 8080:8080 \\\n  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/mydb \\\n  -e SPRING_DATASOURCE_PASSWORD=secret \\\n  myapp:1.0\n\n# Запустить в фоне\ndocker run -d --name myapp -p 8080:8080 myapp:1.0' }
      ]
    },
    {
      id: 3,
      title: 'Docker Compose для разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose объединяет несколько контейнеров: приложение, база данных, Redis. Один файл docker-compose.yml описывает всю инфраструктуру.' },
        { type: 'heading', value: 'docker-compose.yml' },
        { type: 'code', language: 'java', value: '# docker-compose.yml\nversion: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "8080:8080"\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb\n      SPRING_DATASOURCE_USERNAME: myuser\n      SPRING_DATASOURCE_PASSWORD: mypassword\n      SPRING_DATA_REDIS_HOST: redis\n    depends_on:\n      postgres:\n        condition: service_healthy\n      redis:\n        condition: service_started\n\n  postgres:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: myuser\n      POSTGRES_PASSWORD: mypassword\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U myuser"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  postgres_data:' },
        { type: 'code', language: 'java', value: '# Запустить всё\ndocker compose up -d\n\n# Остановить\ndocker compose down\n\n# Посмотреть логи приложения\ndocker compose logs -f app\n\n# Пересобрать образ\ndocker compose up -d --build' }
      ]
    },
    {
      id: 4,
      title: 'Переменные окружения и профили',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация приложения в Docker передаётся через переменные окружения. Spring Boot поддерживает привязку env-переменных к application.properties.' },
        { type: 'heading', value: 'Конфигурация через переменные окружения' },
        { type: 'code', language: 'java', value: '# application.properties — базовые настройки\nspring.datasource.url=${DATASOURCE_URL:jdbc:postgresql://localhost:5432/mydb}\nspring.datasource.username=${DB_USERNAME:admin}\nspring.datasource.password=${DB_PASSWORD:changeme}\nspring.data.redis.host=${REDIS_HOST:localhost}\nserver.port=${PORT:8080}\napp.jwt.secret=${JWT_SECRET:default-dev-secret-change-in-production}' },
        { type: 'heading', value: 'Spring профили в Docker' },
        { type: 'code', language: 'java', value: '# docker-compose.yml — передаём профиль\nservices:\n  app:\n    environment:\n      SPRING_PROFILES_ACTIVE: prod\n\n# application-prod.properties\nspring.jpa.hibernate.ddl-auto=validate  # не менять схему в проде\nlogging.level.root=WARN\nmanagement.endpoints.web.exposure.include=health,metrics' },
        { type: 'tip', value: 'Никогда не хардкоди секреты в Dockerfile или docker-compose.yml! Используй переменные окружения или Docker Secrets.' }
      ]
    },
    {
      id: 5,
      title: 'Деплой на Linux сервер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деплой приложения на сервер включает: копирование compose-файла, настройку переменных, запуск контейнеров и настройку Nginx как reverse proxy.' },
        { type: 'heading', value: 'Nginx reverse proxy' },
        { type: 'code', language: 'java', value: '# /etc/nginx/sites-available/myapp\nserver {\n    listen 80;\n    server_name myapp.kz;\n\n    location / {\n        proxy_pass http://localhost:8080;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}' },
        { type: 'heading', value: 'Скрипт деплоя' },
        { type: 'code', language: 'java', value: '#!/bin/bash\n# deploy.sh\nset -e\n\necho "Сборка JAR..."\nmvn clean package -DskipTests\n\necho "Сборка Docker образа..."\ndocker build -t myapp:latest .\n\necho "Остановка старого контейнера..."\ndocker compose down app\n\necho "Запуск нового контейнера..."\ndocker compose up -d app\n\necho "Проверка здоровья..."\nsleep 10\ncurl -f http://localhost:8080/actuator/health || exit 1\n\necho "Деплой успешен!"' }
      ]
    },
    {
      id: 6,
      title: 'GitHub Actions для CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Actions автоматизирует: запуск тестов при каждом коммите, сборку Docker образа, деплой на сервер. Это называется CI/CD (Continuous Integration/Deployment).' },
        { type: 'heading', value: 'GitHub Actions workflow' },
        { type: 'code', language: 'java', value: '# .github/workflows/deploy.yml\nname: CI/CD\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with:\n          java-version: "21"\n          distribution: temurin\n      - name: Run tests\n        run: mvn test\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build and push Docker image\n        run: |\n          docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}\n          docker build -t myuser/myapp:${{ github.sha }} .\n          docker push myuser/myapp:${{ github.sha }}\n      - name: Deploy to server\n        uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.SERVER_HOST }}\n          username: ${{ secrets.SERVER_USER }}\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: |\n            docker pull myuser/myapp:${{ github.sha }}\n            docker compose up -d --no-deps app' },
        { type: 'tip', value: 'Секреты (пароли, ключи) храни в GitHub Settings -> Secrets and Variables -> Actions. Никогда не коммить их в код.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: полный деплой приложения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полную конфигурацию для деплоя Spring Boot приложения: оптимизированный Dockerfile, docker-compose с PostgreSQL и Redis, настройка переменных окружения.',
      requirements: [
        'Создай многоэтапный Dockerfile с layered JAR',
        'Создай docker-compose.yml с app, postgres, redis, nginx сервисами',
        'Настрой healthcheck для PostgreSQL',
        'Все секреты передавай через переменные окружения',
        'Создай .env файл с переменными для разработки',
        'Добавь application-prod.properties с production настройками',
        'Напиши скрипт deploy.sh с проверкой здоровья после деплоя'
      ],
      hint: 'Используй depends_on с condition: service_healthy для ожидания готовности PostgreSQL. .env файл автоматически читается docker-compose.',
      expectedOutput: 'docker build -t myapp:1.0 . — сборка образа:\nStep 1/6 : FROM eclipse-temurin:21-jre-alpine\nStep 2/6 : WORKDIR /app\nStep 3/6 : COPY target/*.jar app.jar\n...\nSuccessfully built a1b2c3d4e5f6\nSuccessfully tagged myapp:1.0\n\ndocker compose up -d:\n[+] Running 3/3\n  postgres  Started\n  app       Started\n  redis     Started\n\ndocker compose ps:\nNAME      SERVICE   STATUS     PORTS\napp       app       Up         0.0.0.0:8080->8080/tcp\npostgres  postgres  Up         5432/tcp\nredis     redis     Up         0.0.0.0:6379->6379/tcp\n\ncurl http://localhost:8080/actuator/health:\n{"status":"UP","components":{"db":{"status":"UP"},"redis":{"status":"UP"}}}\n\ndocker compose logs -f app:\n2026-03-21 10:00:00 INFO  Started Application in 4.2 seconds\n2026-03-21 10:00:00 INFO  Profile: prod',
      solution: '# .env (для разработки)\nDB_PASSWORD=devpassword\nJWT_SECRET=dev-jwt-secret-32chars-minimum\nREDIS_PASSWORD=\n\n# Dockerfile\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nCOPY target/*.jar app.jar\nRUN addgroup -S app && adduser -S app -G app\nUSER app\nEXPOSE 8080\nENTRYPOINT ["java", \"-jar\", \"app.jar\"]\n\n# docker-compose.yml\nversion: "3.8"\nservices:\n  app:\n    build: .\n    environment:\n      SPRING_PROFILES_ACTIVE: prod\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb\n      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}\n      JWT_SECRET: ${JWT_SECRET}\n    depends_on:\n      postgres:\n        condition: service_healthy\n  postgres:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n    healthcheck:\n      test: ["CMD", "pg_isready"]\n      interval: 5s\n      retries: 5\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\nvolumes:\n  postgres_data:',
      explanation: 'Многоэтапный Dockerfile уменьшает образ и улучшает кеширование. .env файл держит секреты вне кода. healthcheck гарантирует, что приложение не запустится до готовности БД.'
    }
  ]
}
