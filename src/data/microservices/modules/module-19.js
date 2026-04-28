export default {
  id: 19,
  title: 'Контейнеризация с Docker',
  description: 'Docker для микросервисов: оптимальные Dockerfile, multi-stage builds, health checks, Docker Compose для локальной разработки.',
  lessons: [
    {
      id: 1,
      title: 'Dockerfile для микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый микросервис упаковывается в Docker-образ. Оптимальный Dockerfile использует multi-stage build, non-root user, health check и минимальный base image.' },
        { type: 'code', language: 'bash', value: '# Multi-stage Dockerfile для Spring Boot\n# Stage 1: Build\nFROM eclipse-temurin:21-jdk-alpine AS builder\nWORKDIR /app\nCOPY gradle/ gradle/\nCOPY gradlew build.gradle settings.gradle ./\nRUN ./gradlew dependencies --no-daemon\nCOPY src/ src/\nRUN ./gradlew bootJar --no-daemon -x test\n\n# Stage 2: Runtime\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\n\n# Non-root user\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\n\n# Copy JAR from builder\nCOPY --from=builder /app/build/libs/*.jar app.jar\n\n# Health check\nHEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\\n  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1\n\n# Security\nUSER appuser\nEXPOSE 8080\n\n# JVM tuning\nENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"\nENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]' },
        { type: 'list', value: [
          'Multi-stage: первый stage собирает, второй запускает — образ меньше',
          'Alpine base: ~60MB вместо ~200MB для Debian-based',
          'Non-root user: безопасность — контейнер не от root',
          'HEALTHCHECK: Docker/K8s проверяют здоровье контейнера',
          '-XX:+UseContainerSupport: JVM учитывает memory limits контейнера'
        ] },
        { type: 'tip', value: 'Размер образа: JDK (~400MB) vs JRE (~200MB) vs JRE Alpine (~100MB) vs GraalVM Native (~50MB). Для микросервисов рекомендуется JRE Alpine или Native Image.' }
      ]
    },
    {
      id: 2,
      title: 'Docker Compose для разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose позволяет запустить все микросервисы и инфраструктуру (Kafka, PostgreSQL, Redis) одной командой. Незаменим для локальной разработки и тестирования.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — полный стек микросервисов\nservices:\n  # === Инфраструктура ===\n  postgres:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: admin\n      POSTGRES_PASSWORD: admin\n    ports: ["5432:5432"]\n    volumes:\n      - postgres-data:/var/lib/postgresql/data\n      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql\n\n  kafka:\n    image: confluentinc/cp-kafka:7.5.0\n    ports: ["9092:9092"]\n    environment:\n      KAFKA_NODE_ID: 1\n      KAFKA_PROCESS_ROLES: broker,controller\n      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093\n      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092\n      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093\n      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER\n      CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk\n\n  redis:\n    image: redis:7-alpine\n    ports: ["6379:6379"]\n\n  # === Микросервисы ===\n  user-service:\n    build: ./user-service\n    ports: ["8081:8080"]\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/users\n      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092\n    depends_on: [postgres, kafka]\n    healthcheck:\n      test: wget --spider http://localhost:8080/actuator/health || exit 1\n      interval: 15s\n      timeout: 5s\n      retries: 3\n\n  order-service:\n    build: ./order-service\n    ports: ["8082:8080"]\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/orders\n      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092\n      SERVICES_USER_URL: http://user-service:8080\n    depends_on:\n      user-service:\n        condition: service_healthy\n\n  payment-service:\n    build: ./payment-service\n    ports: ["8083:8080"]\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/payments\n      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092\n    depends_on: [postgres, kafka]\n\nvolumes:\n  postgres-data:' },
        { type: 'note', value: 'Используйте depends_on с condition: service_healthy чтобы сервисы стартовали только после готовности зависимостей. Без этого Order Service может стартовать раньше PostgreSQL.' }
      ]
    },
    {
      id: 3,
      title: 'Оптимизация Docker-образов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оптимизация образов ускоряет CI/CD, экономит место в registry и ускоряет скачивание. Ключевые техники: кэширование слоёв, .dockerignore, минимальный base image, Spring Boot layered JAR.' },
        { type: 'code', language: 'bash', value: '# Spring Boot Layered JAR — оптимизация кэширования\n# Dockerfile с использованием layers\nFROM eclipse-temurin:21-jre-alpine AS builder\nWORKDIR /app\nCOPY app.jar app.jar\nRUN java -Djarmode=layertools -jar app.jar extract\n\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nRUN addgroup -S app && adduser -S app -G app\n\n# Слои: зависимости -> spring -> snapshot -> application\n# Зависимости меняются РЕДКО -> кэшируются\nCOPY --from=builder /app/dependencies/ ./\nCOPY --from=builder /app/spring-boot-loader/ ./\nCOPY --from=builder /app/snapshot-dependencies/ ./\n# Код приложения меняется ЧАСТО -> последний слой\nCOPY --from=builder /app/application/ ./\n\nUSER app\nEXPOSE 8080\nENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]\n\n# Результат:\n# Пересборка после изменения кода: только последний слой (~5MB)\n# Зависимости (~200MB) берутся из кэша!\n# Скорость: 30 секунд вместо 5 минут' },
        { type: 'code', language: 'bash', value: '# .dockerignore — исключить ненужное\n.git\n.gradle\nbuild/\n!build/libs/*.jar\n*.md\n.env\n.idea\n*.iml\ntarget/\nnode_modules/' },
        { type: 'tip', value: 'Используйте docker scan (Snyk) для проверки уязвимостей в образе. Trivy — бесплатная альтернатива: trivy image order-service:latest. Запускайте в CI/CD при каждой сборке.' }
      ]
    },
    {
      id: 4,
      title: 'Конфигурация и секреты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Микросервисы в Docker получают конфигурацию через переменные окружения (12-Factor). Секреты никогда не хранятся в образе. В production используйте Docker Secrets или Kubernetes Secrets.' },
        { type: 'code', language: 'yaml', value: '# application.yml — конфигурация через env variables\nspring:\n  datasource:\n    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/orders}\n    username: ${DB_USERNAME:postgres}\n    password: ${DB_PASSWORD:secret}\n  kafka:\n    bootstrap-servers: ${KAFKA_SERVERS:localhost:9092}\n\nservices:\n  user:\n    url: ${USER_SERVICE_URL:http://localhost:8081}\n  payment:\n    url: ${PAYMENT_SERVICE_URL:http://localhost:8082}\n\nserver:\n  port: ${PORT:8080}\n\n---\n# docker-compose.yml — переменные окружения\nservices:\n  order-service:\n    image: order-service:1.0.0\n    environment:\n      DATABASE_URL: jdbc:postgresql://postgres:5432/orders\n      DB_USERNAME: admin\n      DB_PASSWORD: ${DB_PASSWORD}  # Из .env файла\n      KAFKA_SERVERS: kafka:9092\n      USER_SERVICE_URL: http://user-service:8080\n    env_file:\n      - .env  # Секреты в .env файле (не коммитить!)' },
        { type: 'warning', value: 'Никогда не храните секреты в Docker image или docker-compose.yml! Используйте .env файлы (добавьте в .gitignore), Docker Secrets, Kubernetes Secrets или HashiCorp Vault.' }
      ]
    },
    {
      id: 5,
      title: 'Docker networking для микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker networking позволяет сервисам общаться по имени контейнера. Docker Compose создаёт default network. Для изоляции создавайте отдельные сети: frontend, backend, monitoring.' },
        { type: 'code', language: 'yaml', value: '# Docker Compose с сегментацией сетей\nservices:\n  api-gateway:\n    build: ./gateway\n    ports: ["8080:8080"]\n    networks:\n      - frontend\n      - backend\n\n  order-service:\n    build: ./order-service\n    networks:\n      - backend  # Только внутренняя сеть\n\n  payment-service:\n    build: ./payment-service\n    networks:\n      - backend\n\n  postgres:\n    image: postgres:16-alpine\n    networks:\n      - backend  # БД не доступна извне\n\n  prometheus:\n    image: prom/prometheus\n    networks:\n      - monitoring\n      - backend  # Для scraping метрик\n\n  grafana:\n    image: grafana/grafana\n    ports: ["3000:3000"]\n    networks:\n      - monitoring\n\nnetworks:\n  frontend:   # API Gateway <-> внешний мир\n  backend:    # Сервисы <-> БД <-> Kafka\n  monitoring: # Prometheus <-> Grafana' },
        { type: 'note', value: 'В Docker Compose сервисы обращаются друг к другу по имени контейнера: http://order-service:8080. Docker DNS резолвит имена в IP внутри сети. Порты не нужно маппить для внутренней коммуникации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Контейнеризация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Docker-образы для 3 микросервисов и Docker Compose для запуска полного стека.',
      requirements: [
        'Создайте multi-stage Dockerfile для каждого сервиса',
        'Используйте Spring Boot layered JAR для кэширования слоёв',
        'Добавьте non-root user и HEALTHCHECK',
        'Создайте Docker Compose с сервисами + инфраструктура (Postgres, Kafka, Redis)',
        'Настройте сегментацию сетей: frontend, backend',
        'Убедитесь что сервисы стартуют в правильном порядке (depends_on + healthcheck)'
      ],
      hint: 'Multi-stage: FROM ... AS builder для сборки, FROM ... для runtime. Layered JAR: java -Djarmode=layertools -jar app.jar extract. depends_on с condition: service_healthy.',
      expectedOutput: 'docker-compose up: все сервисы запущены.\norder-service: image 120MB (multi-stage + Alpine).\nПересборка после изменения кода: 15 секунд (кэширование слоёв).\nСети: api-gateway в frontend+backend, сервисы только в backend.\nHealth: docker-compose ps показывает healthy для всех сервисов.\nНавигация: curl http://localhost:8080/api/orders -> 200 OK.',
      solution: '# Dockerfile (order-service)\nFROM eclipse-temurin:21-jdk-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN ./gradlew bootJar -x test\nRUN java -Djarmode=layertools -jar build/libs/*.jar extract\n\nFROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nRUN addgroup -S app && adduser -S app -G app\nCOPY --from=builder /app/dependencies/ ./\nCOPY --from=builder /app/spring-boot-loader/ ./\nCOPY --from=builder /app/snapshot-dependencies/ ./\nCOPY --from=builder /app/application/ ./\nUSER app\nEXPOSE 8080\nHEALTHCHECK --interval=15s --timeout=3s CMD wget --spider http://localhost:8080/actuator/health || exit 1\nENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]\n\n# docker-compose up --build\n# docker-compose ps -> all healthy\n# curl http://localhost:8080/api/orders',
      explanation: 'Контейнеризация — основа деплоя микросервисов. Multi-stage build создаёт компактные образы. Layered JAR ускоряет пересборку через кэширование зависимостей. Non-root user и health check — базовые практики безопасности. Docker Compose обеспечивает одинаковое окружение для разработки.'
    }
  ]
}
