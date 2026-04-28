export default {
  id: 58,
  title: 'Практикум: Docker и деплой',
  description: 'Контейнеризация и деплой Spring Boot: Dockerfile, Docker Compose, multi-stage builds, health checks, переменные окружения, Nginx reverse proxy, CI/CD и blue-green deployment.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Dockerfile для Spring Boot',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте оптимизированный Dockerfile для Spring Boot приложения.',
      requirements: [
        'Базовый образ: eclipse-temurin:21-jre-alpine',
        'Копирование JAR файла',
        'Настройка JVM параметров через JAVA_OPTS',
        'Непривилегированный пользователь (не root)',
        'EXPOSE порта',
        'HEALTHCHECK инструкция'
      ],
      expectedOutput: 'docker build -t myapp:1.0 .\nStep 1/8: FROM eclipse-temurin:21-jre-alpine\nStep 2/8: RUN addgroup -S app && adduser -S app -G app\n...\nSuccessfully built abc123\n\ndocker run -p 8080:8080 myapp:1.0\nStarted Application in 3.5 seconds\n\nImage size: 185MB',
      hint: 'JRE вместо JDK — меньший образ. Alpine — минимальный Linux. Непривилегированный пользователь — безопасность. JAVA_OPTS через ENV для настройки JVM.',
      solution: '# Dockerfile\n# FROM eclipse-temurin:21-jre-alpine\n#\n# RUN addgroup -S app && adduser -S app -G app\n#\n# WORKDIR /app\n#\n# COPY target/*.jar app.jar\n#\n# RUN chown -R app:app /app\n# USER app\n#\n# ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"\n# ENV SERVER_PORT=8080\n#\n# EXPOSE ${SERVER_PORT}\n#\n# HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\\n#   CMD wget -qO- http://localhost:${SERVER_PORT}/actuator/health || exit 1\n#\n# ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]\n\n# Команды сборки и запуска:\n# mvn clean package -DskipTests\n# docker build -t myapp:1.0 .\n# docker run -d -p 8080:8080 --name myapp \\\n#   -e SPRING_PROFILES_ACTIVE=prod \\\n#   -e JAVA_OPTS="-Xms512m -Xmx1g" \\\n#   myapp:1.0\n\n// .dockerignore\n// .git\n// .idea\n// target/classes\n// target/test-classes\n// *.md\n// docker-compose*.yml',
      explanation: 'eclipse-temurin:21-jre-alpine — минимальный образ с Java 21 (~185MB vs ~450MB с JDK). Непривилегированный пользователь предотвращает escape из контейнера. HEALTHCHECK позволяет Docker/Kubernetes определять готовность приложения. ENTRYPOINT с sh -c позволяет использовать переменные окружения.'
    },
    {
      id: 2,
      title: 'Задача: Docker Compose с PostgreSQL',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте docker-compose для запуска приложения с PostgreSQL и Redis.',
      requirements: [
        'Сервис app: Spring Boot приложение',
        'Сервис db: PostgreSQL 16',
        'Сервис redis: Redis 7',
        'Volumes для persistence данных',
        'Networks для изоляции',
        'depends_on с healthcheck'
      ],
      expectedOutput: 'docker-compose up -d\nCreating network "myapp_default"\nCreating myapp_db_1    ... done\nCreating myapp_redis_1 ... done\nWaiting for db to be healthy...\nCreating myapp_app_1   ... done\n\ndocker-compose ps\nNAME          STATUS     PORTS\nmyapp_app_1   Up         0.0.0.0:8080->8080/tcp\nmyapp_db_1    Up (healthy) 5432/tcp\nmyapp_redis_1 Up         6379/tcp',
      hint: 'depends_on с condition: service_healthy гарантирует что PostgreSQL готов до старта приложения. Volumes предотвращают потерю данных при перезапуске.',
      solution: '# docker-compose.yml\n# version: "3.8"\n#\n# services:\n#   app:\n#     build: .\n#     ports:\n#       - "8080:8080"\n#     environment:\n#       - SPRING_PROFILES_ACTIVE=docker\n#       - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp\n#       - SPRING_DATASOURCE_USERNAME=postgres\n#       - SPRING_DATASOURCE_PASSWORD=secret\n#       - SPRING_DATA_REDIS_HOST=redis\n#       - JAVA_OPTS=-Xms256m -Xmx512m\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#       redis:\n#         condition: service_started\n#     networks:\n#       - backend\n#     restart: unless-stopped\n#\n#   db:\n#     image: postgres:16-alpine\n#     environment:\n#       POSTGRES_DB: myapp\n#       POSTGRES_USER: postgres\n#       POSTGRES_PASSWORD: secret\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#       - ./init.sql:/docker-entrypoint-initdb.d/init.sql\n#     ports:\n#       - "5432:5432"\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U postgres"]\n#       interval: 5s\n#       timeout: 5s\n#       retries: 5\n#     networks:\n#       - backend\n#\n#   redis:\n#     image: redis:7-alpine\n#     ports:\n#       - "6379:6379"\n#     volumes:\n#       - redis_data:/data\n#     networks:\n#       - backend\n#\n# volumes:\n#   postgres_data:\n#   redis_data:\n#\n# networks:\n#   backend:\n#     driver: bridge',
      explanation: 'Docker Compose оркестрирует несколько контейнеров. depends_on с condition: service_healthy ждёт пока PostgreSQL пройдёт healthcheck. Volumes сохраняют данные при перезапуске контейнеров. Networks изолируют сервисы — db доступен только из backend сети. init.sql выполняется при первом запуске БД.'
    },
    {
      id: 3,
      title: 'Задача: Multi-stage build',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте multi-stage Dockerfile для сборки и запуска в отдельных стадиях.',
      requirements: [
        'Stage 1 (builder): Maven сборка в Docker',
        'Stage 2 (runtime): только JRE + JAR',
        'Кеширование Maven зависимостей',
        'Layered JAR для оптимизации Docker cache',
        'Результирующий образ минимального размера',
        'Сравнение: single-stage vs multi-stage размер образа'
      ],
      expectedOutput: 'docker build -t myapp:multi .\nStage 1 (builder): Downloading dependencies... Compiling... Packaging...\nStage 2 (runtime): Copying JAR...\nSuccessfully built def456\n\nImage comparison:\n  Single-stage (JDK + sources): 650MB\n  Multi-stage (JRE + JAR): 185MB\n  Multi-stage layered: 185MB (но быстрее rebuild)',
      hint: 'Скопируйте pom.xml отдельно и запустите mvn dependency:go-offline ДО копирования исходников — это кеширует зависимости.',
      solution: '# Multi-stage Dockerfile\n#\n# --- Stage 1: Build ---\n# FROM maven:3.9-eclipse-temurin-21 AS builder\n# WORKDIR /build\n#\n# # Кеширование зависимостей\n# COPY pom.xml .\n# RUN mvn dependency:go-offline -B\n#\n# # Копирование исходников и сборка\n# COPY src ./src\n# RUN mvn package -DskipTests -B\n#\n# # Распаковка layered JAR\n# RUN java -Djarmode=layertools -jar target/*.jar extract --destination /extracted\n#\n# --- Stage 2: Runtime ---\n# FROM eclipse-temurin:21-jre-alpine\n#\n# RUN addgroup -S app && adduser -S app -G app\n# WORKDIR /app\n#\n# # Копирование слоёв (от наименее изменяемого к наиболее)\n# COPY --from=builder /extracted/dependencies/ ./\n# COPY --from=builder /extracted/spring-boot-loader/ ./\n# COPY --from=builder /extracted/snapshot-dependencies/ ./\n# COPY --from=builder /extracted/application/ ./\n#\n# RUN chown -R app:app /app\n# USER app\n#\n# ENV JAVA_OPTS="-Xms256m -Xmx512m"\n# EXPOSE 8080\n#\n# HEALTHCHECK --interval=30s --timeout=3s \\\n#   CMD wget -qO- http://localhost:8080/actuator/health || exit 1\n#\n# ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} org.springframework.boot.loader.launch.JarLauncher"]\n\n# Для layered JAR добавьте в pom.xml:\n# <plugin>\n#   <groupId>org.springframework.boot</groupId>\n#   <artifactId>spring-boot-maven-plugin</artifactId>\n#   <configuration>\n#     <layers><enabled>true</enabled></layers>\n#   </configuration>\n# </plugin>',
      explanation: 'Multi-stage: первая стадия содержит JDK + Maven + исходники (для сборки), вторая — только JRE + JAR (для запуска). Layered JAR разделяет приложение на слои: dependencies (редко меняются), application (часто). Docker кеширует неизменённые слои — rebuild после изменения кода копирует только application слой.'
    },
    {
      id: 4,
      title: 'Задача: Health Check endpoint',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте health check endpoints для мониторинга готовности приложения.',
      requirements: [
        'Spring Actuator health endpoint',
        'Liveness probe: /actuator/health/liveness',
        'Readiness probe: /actuator/health/readiness',
        'Кастомный health indicator: проверка внешних сервисов',
        'Health groups: db, redis, external',
        'Kubernetes-совместимые probes'
      ],
      expectedOutput: 'GET /actuator/health\n{"status":"UP","components":{"db":{"status":"UP"},"redis":{"status":"UP"},"diskSpace":{"status":"UP"}}}\n\nGET /actuator/health/liveness\n{"status":"UP"}\n\nGET /actuator/health/readiness\n{"status":"UP","components":{"db":{"status":"UP"},"redis":{"status":"UP"}}}\n\nPostgreSQL down:\nGET /actuator/health/readiness\n{"status":"DOWN","components":{"db":{"status":"DOWN","details":{"error":"Connection refused"}}}}',
      hint: 'management.endpoint.health.probes.enabled=true для Kubernetes probes. management.health.redis.enabled=true для автоматической проверки Redis.',
      solution: '// application.yml\n// management:\n//   endpoint:\n//     health:\n//       show-details: always\n//       probes:\n//         enabled: true\n//   health:\n//     redis:\n//       enabled: true\n//     db:\n//       enabled: true\n//     diskspace:\n//       enabled: true\n//       threshold: 100MB\n\n@Component\npublic class ExternalApiHealthIndicator implements HealthIndicator {\n\n    @Autowired RestTemplate restTemplate;\n\n    @Value("${external.api.url}")\n    private String apiUrl;\n\n    @Override\n    public Health health() {\n        try {\n            ResponseEntity<String> response = restTemplate.getForEntity(\n                apiUrl + "/health", String.class);\n            if (response.getStatusCode().is2xxSuccessful()) {\n                return Health.up()\n                    .withDetail("url", apiUrl)\n                    .withDetail("status", response.getStatusCode().value())\n                    .build();\n            }\n            return Health.down()\n                .withDetail("url", apiUrl)\n                .withDetail("status", response.getStatusCode().value())\n                .build();\n        } catch (Exception e) {\n            return Health.down()\n                .withDetail("url", apiUrl)\n                .withDetail("error", e.getMessage())\n                .build();\n        }\n    }\n}\n\n@Component\npublic class DatabaseHealthIndicator implements HealthIndicator {\n    @Autowired JdbcTemplate jdbc;\n\n    @Override\n    public Health health() {\n        try {\n            jdbc.queryForObject("SELECT 1", Integer.class);\n            long start = System.currentTimeMillis();\n            jdbc.queryForObject("SELECT COUNT(*) FROM users", Long.class);\n            long queryTime = System.currentTimeMillis() - start;\n\n            Health.Builder builder = queryTime < 1000 ? Health.up() : Health.status("DEGRADED");\n            return builder\n                .withDetail("queryTime", queryTime + "ms")\n                .build();\n        } catch (Exception e) {\n            return Health.down().withException(e).build();\n        }\n    }\n}\n\n// Kubernetes deployment.yml\n// livenessProbe:\n//   httpGet:\n//     path: /actuator/health/liveness\n//     port: 8080\n//   initialDelaySeconds: 30\n//   periodSeconds: 10\n// readinessProbe:\n//   httpGet:\n//     path: /actuator/health/readiness\n//     port: 8080\n//   initialDelaySeconds: 10\n//   periodSeconds: 5',
      explanation: 'Liveness probe — "приложение живо?" (если нет — Kubernetes перезапускает). Readiness probe — "приложение готово принимать трафик?" (если нет — убирается из load balancer). Кастомные HealthIndicator проверяют внешние зависимости. DEGRADED — промежуточный статус когда сервис работает, но медленно.'
    },
    {
      id: 5,
      title: 'Задача: Переменные окружения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте приложение через переменные окружения для разных сред.',
      requirements: [
        'Все секреты через переменные окружения (не в коде)',
        'application-docker.yml для Docker-профиля',
        'Fallback значения: ${DB_HOST:localhost}',
        '.env файл для docker-compose',
        'Spring Cloud Config как альтернатива',
        'Проверка обязательных переменных при старте'
      ],
      expectedOutput: 'docker run -e DB_HOST=db -e DB_PASSWORD=secret -e JWT_SECRET=mykey myapp\n\napplication.yml:\nspring.datasource.url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:myapp}\nspring.datasource.password: ${DB_PASSWORD}\n\nОтсутствует DB_PASSWORD:\nApplication failed to start:\n***************************\nPROPERTY: spring.datasource.password\nREASON: Missing required environment variable: DB_PASSWORD',
      hint: 'Используйте @ConfigurationProperties с @Validated для проверки обязательных параметров. @PostConstruct для кастомных проверок.',
      solution: '// application.yml\n// spring:\n//   datasource:\n//     url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:myapp}\n//     username: ${DB_USERNAME:postgres}\n//     password: ${DB_PASSWORD}\n//   data:\n//     redis:\n//       host: ${REDIS_HOST:localhost}\n//       port: ${REDIS_PORT:6379}\n//\n// app:\n//   jwt:\n//     secret: ${JWT_SECRET}\n//     expiration: ${JWT_EXPIRATION:3600}\n//   cors:\n//     allowed-origins: ${CORS_ORIGINS:http://localhost:3000}\n\n@ConfigurationProperties(prefix = "app")\n@Validated\npublic record AppProperties(\n    @Valid JwtProperties jwt,\n    CorsProperties cors\n) {\n    public record JwtProperties(\n        @NotBlank(message = "JWT_SECRET обязателен")\n        String secret,\n        int expiration\n    ) {}\n    public record CorsProperties(String allowedOrigins) {}\n}\n\n@Component\npublic class EnvironmentValidator {\n\n    @Value("${spring.datasource.password:}")\n    private String dbPassword;\n\n    @Value("${app.jwt.secret:}")\n    private String jwtSecret;\n\n    @PostConstruct\n    public void validate() {\n        List<String> missing = new ArrayList<>();\n        if (dbPassword.isBlank()) missing.add("DB_PASSWORD");\n        if (jwtSecret.isBlank()) missing.add("JWT_SECRET");\n\n        if (!missing.isEmpty()) {\n            throw new IllegalStateException(\n                "Missing required environment variables: " + String.join(", ", missing));\n        }\n    }\n}\n\n// .env файл для docker-compose\n// DB_HOST=db\n// DB_PORT=5432\n// DB_NAME=myapp\n// DB_USERNAME=postgres\n// DB_PASSWORD=supersecret\n// REDIS_HOST=redis\n// JWT_SECRET=my-256-bit-secret-key-for-jwt\n// CORS_ORIGINS=https://myapp.com\n\n// docker-compose.yml\n// services:\n//   app:\n//     env_file: .env\n//     environment:\n//       - SPRING_PROFILES_ACTIVE=docker',
      explanation: '${VAR:default} — переменная окружения с дефолтом. Секреты (пароли, ключи) НИКОГДА не хранятся в коде или git. .env файл для удобства разработки (не коммитить!). @ConfigurationProperties с @Validated проверяет конфигурацию при старте — fail fast. @PostConstruct даёт подробное сообщение об отсутствующих переменных.'
    },
    {
      id: 6,
      title: 'Задача: Docker Networking',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Docker-сети для изоляции и безопасности микросервисов.',
      requirements: [
        'Frontend network: только Nginx доступен извне',
        'Backend network: API сервисы общаются между собой',
        'Database network: только API имеет доступ к БД',
        'Сервис API подключён к backend и database сетям',
        'Сервис DB подключён только к database сети',
        'DNS resolving: обращение к сервисам по имени'
      ],
      expectedOutput: 'Networks:\n  frontend: nginx (exposed ports 80, 443)\n  backend: api, worker, redis\n  database: api, db\n\nNginx → API: ✓ (оба в frontend/backend)\nAPI → DB: ✓ (оба в database)\nNginx → DB: ✗ (разные сети — изоляция!)\nWorker → DB: ✗ (worker не в database сети)\n\nDNS: api resolves to 172.20.0.3 (внутренний IP)',
      hint: 'Один контейнер может быть подключён к нескольким сетям. Сервисы в разных сетях не могут общаться — это обеспечивает изоляцию.',
      solution: '# docker-compose.yml с сетевой изоляцией\n# version: "3.8"\n#\n# services:\n#   nginx:\n#     image: nginx:alpine\n#     ports:\n#       - "80:80"\n#       - "443:443"\n#     volumes:\n#       - ./nginx.conf:/etc/nginx/nginx.conf\n#     networks:\n#       - frontend\n#     depends_on:\n#       - api\n#\n#   api:\n#     build: .\n#     environment:\n#       - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/myapp\n#       - SPRING_DATA_REDIS_HOST=redis\n#     networks:\n#       - frontend\n#       - backend\n#       - database\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#\n#   worker:\n#     build:\n#       context: .\n#       dockerfile: Dockerfile.worker\n#     environment:\n#       - SPRING_DATA_REDIS_HOST=redis\n#     networks:\n#       - backend\n#\n#   redis:\n#     image: redis:7-alpine\n#     networks:\n#       - backend\n#\n#   db:\n#     image: postgres:16-alpine\n#     environment:\n#       POSTGRES_DB: myapp\n#       POSTGRES_PASSWORD: secret\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#     networks:\n#       - database\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready"]\n#       interval: 5s\n#\n# networks:\n#   frontend:\n#     driver: bridge\n#   backend:\n#     driver: bridge\n#   database:\n#     driver: bridge\n#     internal: true  # нет доступа в интернет\n#\n# volumes:\n#   postgres_data:',
      explanation: 'Сетевая изоляция — ключевой принцип безопасности. frontend: только Nginx виден извне. backend: API и Worker общаются через Redis. database: internal: true — нет доступа в интернет, только API может обратиться к БД. Если злоумышленник попадёт в Nginx — он не достанет до БД напрямую.'
    },
    {
      id: 7,
      title: 'Задача: Nginx Reverse Proxy',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Nginx как reverse proxy перед Spring Boot с SSL и rate limiting.',
      requirements: [
        'Proxy pass к Spring Boot API',
        'SSL терминация (HTTPS)',
        'Rate limiting (10 req/s на IP)',
        'Gzip сжатие ответов',
        'WebSocket proxy (/ws)',
        'Static files serving'
      ],
      expectedOutput: 'curl https://myapp.com/api/users\n→ Nginx (HTTPS) → Spring Boot (HTTP :8080)\n\ncurl https://myapp.com/ws\n→ Nginx → WebSocket upgrade → Spring Boot\n\n11-й запрос за секунду:\n→ HTTP 429 Too Many Requests\n\nResponse headers:\nContent-Encoding: gzip\nX-Request-ID: abc-123\nStrict-Transport-Security: max-age=31536000',
      hint: 'proxy_pass http://api:8080; для проксирования. proxy_http_version 1.1 и Upgrade headers для WebSocket.',
      solution: '# nginx.conf\n# events { worker_connections 1024; }\n#\n# http {\n#     # Rate limiting\n#     limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n#\n#     # Gzip\n#     gzip on;\n#     gzip_types application/json text/plain application/javascript;\n#     gzip_min_length 1024;\n#\n#     upstream backend {\n#         server api:8080;\n#     }\n#\n#     server {\n#         listen 80;\n#         server_name myapp.com;\n#         return 301 https://$host$request_uri;\n#     }\n#\n#     server {\n#         listen 443 ssl http2;\n#         server_name myapp.com;\n#\n#         ssl_certificate /etc/nginx/ssl/cert.pem;\n#         ssl_certificate_key /etc/nginx/ssl/key.pem;\n#\n#         # Security headers\n#         add_header Strict-Transport-Security "max-age=31536000" always;\n#         add_header X-Content-Type-Options "nosniff" always;\n#         add_header X-Frame-Options "DENY" always;\n#\n#         # Request ID\n#         add_header X-Request-ID $request_id;\n#         proxy_set_header X-Request-ID $request_id;\n#\n#         # API proxy\n#         location /api/ {\n#             limit_req zone=api burst=20 nodelay;\n#             proxy_pass http://backend;\n#             proxy_set_header Host $host;\n#             proxy_set_header X-Real-IP $remote_addr;\n#             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n#             proxy_set_header X-Forwarded-Proto $scheme;\n#         }\n#\n#         # WebSocket proxy\n#         location /ws {\n#             proxy_pass http://backend;\n#             proxy_http_version 1.1;\n#             proxy_set_header Upgrade $http_upgrade;\n#             proxy_set_header Connection "upgrade";\n#             proxy_set_header Host $host;\n#             proxy_read_timeout 86400;\n#         }\n#\n#         # Static files\n#         location / {\n#             root /usr/share/nginx/html;\n#             try_files $uri $uri/ /index.html;\n#         }\n#\n#         # Actuator (internal only)\n#         location /actuator/ {\n#             deny all;\n#             return 403;\n#         }\n#     }\n# }',
      explanation: 'Reverse Proxy: Nginx принимает все запросы и перенаправляет к Spring Boot. SSL терминация — HTTPS на Nginx, HTTP между Nginx и Spring Boot (в одной Docker-сети безопасно). Rate limiting на Nginx эффективнее чем на уровне приложения. WebSocket требует Upgrade и Connection headers. /actuator блокируется извне для безопасности.'
    },
    {
      id: 8,
      title: 'Задача: CI/CD с GitHub Actions',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте CI/CD pipeline для автоматической сборки, тестирования и деплоя.',
      requirements: [
        'Build: компиляция и запуск тестов',
        'Test: unit + integration тесты с TestContainers',
        'Docker: build и push образа в registry',
        'Deploy: деплой на сервер через SSH/Docker',
        'Кеширование Maven зависимостей',
        'Уведомления о статусе в Telegram/Slack'
      ],
      expectedOutput: 'Push to main → GitHub Actions triggered\n\n✓ Build (1m 30s)\n  ✓ Compile\n  ✓ Unit tests (45 passed)\n\n✓ Integration Tests (3m)\n  ✓ TestContainers started\n  ✓ 20 integration tests passed\n\n✓ Docker Build (2m)\n  ✓ Built image myapp:sha-abc123\n  ✓ Pushed to ghcr.io/user/myapp\n\n✓ Deploy (1m)\n  ✓ SSH to production\n  ✓ docker pull && docker-compose up -d\n  ✓ Health check passed\n\nTotal: 7m 30s',
      hint: 'Используйте actions/cache для Maven. services: postgres для тестов. docker/build-push-action для Docker. appleboy/ssh-action для SSH деплоя.',
      solution: `# .github/workflows/ci-cd.yml\n# name: CI/CD Pipeline\n#\n# on:\n#   push:\n#     branches: [main]\n#   pull_request:\n#     branches: [main]\n#\n# env:\n#   REGISTRY: ghcr.io\n#   IMAGE_NAME: \${{ github.repository }}\n#\n# jobs:\n#   build-and-test:\n#     runs-on: ubuntu-latest\n#\n#     services:\n#       postgres:\n#         image: postgres:16-alpine\n#         env:\n#           POSTGRES_DB: testdb\n#           POSTGRES_PASSWORD: test\n#         ports: ["5432:5432"]\n#         options: >-\n#           --health-cmd pg_isready\n#           --health-interval 10s\n#           --health-timeout 5s\n#           --health-retries 5\n#\n#     steps:\n#       - uses: actions/checkout@v4\n#\n#       - name: Set up Java 21\n#         uses: actions/setup-java@v4\n#         with:\n#           java-version: 21\n#           distribution: temurin\n#           cache: maven\n#\n#       - name: Run tests\n#         run: mvn verify -B\n#         env:\n#           SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/testdb\n#           SPRING_DATASOURCE_PASSWORD: test\n#\n#       - name: Upload test results\n#         if: always()\n#         uses: actions/upload-artifact@v4\n#         with:\n#           name: test-results\n#           path: target/surefire-reports/\n#\n#   docker:\n#     needs: build-and-test\n#     if: github.ref == \'refs/heads/main\'\n#     runs-on: ubuntu-latest\n#     permissions:\n#       packages: write\n#\n#     steps:\n#       - uses: actions/checkout@v4\n#\n#       - name: Log in to registry\n#         uses: docker/login-action@v3\n#         with:\n#           registry: \${{ env.REGISTRY }}\n#           username: \${{ github.actor }}\n#           password: \${{ secrets.GITHUB_TOKEN }}\n#\n#       - name: Build and push\n#         uses: docker/build-push-action@v5\n#         with:\n#           push: true\n#           tags: |\n#             \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest\n#             \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}\n#\n#   deploy:\n#     needs: docker\n#     runs-on: ubuntu-latest\n#     steps:\n#       - name: Deploy via SSH\n#         uses: appleboy/ssh-action@v1\n#         with:\n#           host: \${{ secrets.SERVER_HOST }}\n#           username: \${{ secrets.SERVER_USER }}\n#           key: \${{ secrets.SSH_KEY }}\n#           script: |\n#             cd /opt/myapp\n#             docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest\n#             docker-compose up -d\n#             sleep 10\n#             curl -f http://localhost:8080/actuator/health || exit 1`,
      explanation: 'CI/CD pipeline автоматизирует: сборку, тестирование, создание Docker-образа и деплой. GitHub Services запускает PostgreSQL для тестов. Cache Maven ускоряет повторные сборки. Docker-образ тегируется SHA коммита для трассировки. Health check после деплоя подтверждает успешный запуск.'
    },
    {
      id: 9,
      title: 'Задача: Docker Compose Profiles',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используйте Docker Compose profiles для разных окружений: dev, test, prod.',
      requirements: [
        'Profile "dev": приложение + БД + Redis + Adminer (DB GUI)',
        'Profile "test": приложение + тестовая БД + Redis',
        'Profile "prod": приложение + БД + Redis + Nginx + мониторинг',
        'Profile "monitoring": Prometheus + Grafana',
        'Разные конфигурации для каждого профиля',
        'docker-compose --profile dev up'
      ],
      expectedOutput: 'docker-compose --profile dev up:\n  ✓ db (PostgreSQL)\n  ✓ redis\n  ✓ adminer (DB GUI на порту 8888)\n  ✓ app (Spring Boot с dev профилем)\n\ndocker-compose --profile prod up:\n  ✓ db (PostgreSQL с ограниченной памятью)\n  ✓ redis (с persistence)\n  ✓ nginx (SSL + rate limiting)\n  ✓ app (Spring Boot с prod профилем)\n\ndocker-compose --profile monitoring up:\n  ✓ prometheus\n  ✓ grafana',
      hint: 'profiles: ["dev"] в сервисе — он запускается только с --profile dev. Сервис без профиля запускается всегда.',
      solution: '# docker-compose.yml\n# version: "3.8"\n#\n# services:\n#   # Всегда запускается\n#   db:\n#     image: postgres:16-alpine\n#     environment:\n#       POSTGRES_DB: ${DB_NAME:-myapp}\n#       POSTGRES_PASSWORD: ${DB_PASSWORD:-secret}\n#     volumes:\n#       - postgres_data:/var/lib/postgresql/data\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready"]\n#       interval: 5s\n#\n#   redis:\n#     image: redis:7-alpine\n#     volumes:\n#       - redis_data:/data\n#\n#   app:\n#     build: .\n#     ports:\n#       - "${APP_PORT:-8080}:8080"\n#     environment:\n#       - SPRING_PROFILES_ACTIVE=${SPRING_PROFILE:-dev}\n#       - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/${DB_NAME:-myapp}\n#       - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD:-secret}\n#       - SPRING_DATA_REDIS_HOST=redis\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#\n#   # Dev only\n#   adminer:\n#     image: adminer\n#     profiles: ["dev"]\n#     ports:\n#       - "8888:8080"\n#\n#   mailhog:\n#     image: mailhog/mailhog\n#     profiles: ["dev"]\n#     ports:\n#       - "8025:8025"\n#\n#   # Prod only\n#   nginx:\n#     image: nginx:alpine\n#     profiles: ["prod"]\n#     ports:\n#       - "80:80"\n#       - "443:443"\n#     volumes:\n#       - ./nginx.conf:/etc/nginx/nginx.conf\n#       - ./ssl:/etc/nginx/ssl\n#\n#   # Monitoring\n#   prometheus:\n#     image: prom/prometheus:latest\n#     profiles: ["monitoring", "prod"]\n#     ports:\n#       - "9090:9090"\n#     volumes:\n#       - ./prometheus.yml:/etc/prometheus/prometheus.yml\n#\n#   grafana:\n#     image: grafana/grafana:latest\n#     profiles: ["monitoring", "prod"]\n#     ports:\n#       - "3000:3000"\n#     environment:\n#       - GF_SECURITY_ADMIN_PASSWORD=admin\n#\n# volumes:\n#   postgres_data:\n#   redis_data:',
      explanation: 'Docker Compose profiles позволяют определять наборы сервисов для разных окружений в одном файле. Сервисы без profiles запускаются всегда (db, redis, app). adminer и mailhog только в dev — полезные инструменты для разработки. nginx, prometheus, grafana только в prod — production инфраструктура.'
    },
    {
      id: 10,
      title: 'Задача: Blue-Green Deployment',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте стратегию blue-green deployment для zero-downtime обновлений.',
      requirements: [
        'Два окружения: blue (текущее) и green (новое)',
        'Nginx переключает трафик между blue и green',
        'Health check перед переключением',
        'Rollback: быстрый откат на предыдущую версию',
        'Скрипт деплоя: deploy.sh',
        'Graceful shutdown Spring Boot'
      ],
      expectedOutput: 'deploy.sh v2.0:\n\n1. Определение текущего окружения: BLUE (port 8081)\n2. Запуск GREEN окружения (port 8082) с v2.0\n3. Ожидание health check GREEN... ✓ (5 sec)\n4. Переключение Nginx: blue → green\n5. Nginx reload: ✓\n6. Трафик идёт на GREEN (v2.0)\n7. Graceful shutdown BLUE (v1.9): ожидание завершения запросов... ✓\n8. Deployment complete! Active: GREEN (v2.0)\n\nRollback:\n1. Nginx switch: green → blue\n2. Трафик вернулся на BLUE (v1.9)\n3. Rollback complete! (< 5 seconds)',
      hint: 'Используйте Nginx upstream с переключением через конфигурацию. Spring Boot graceful shutdown: server.shutdown=graceful. Скрипт определяет текущее окружение и деплоит на другое.',
      solution: `#!/bin/bash\n# deploy.sh\n#\n# DEPLOY_DIR=/opt/myapp\n# NGINX_CONF=/etc/nginx/conf.d/myapp.conf\n# IMAGE=\$1  # e.g., ghcr.io/user/myapp:v2.0\n#\n# # Определить текущее активное окружение\n# CURRENT=\$(docker inspect --format=\'{{.Name}}\' \$(docker ps -qf "name=myapp-blue" 2>/dev/null) 2>/dev/null)\n# if [ -z "\$CURRENT" ]; then\n#     ACTIVE="none"\n#     TARGET="blue"\n#     TARGET_PORT=8081\n# elif echo "\$CURRENT" | grep -q "blue"; then\n#     ACTIVE="blue"\n#     TARGET="green"\n#     TARGET_PORT=8082\n# else\n#     ACTIVE="green"\n#     TARGET="blue"\n#     TARGET_PORT=8081\n# fi\n#\n# echo "Current: \$ACTIVE, Deploying to: \$TARGET (port \$TARGET_PORT)"\n#\n# # Запуск нового окружения\n# docker run -d --name myapp-\$TARGET \\\n#   -p \$TARGET_PORT:8080 \\\n#   -e SPRING_PROFILES_ACTIVE=prod \\\n#   -e SERVER_SHUTDOWN=graceful \\\n#   --network myapp-network \\\n#   \$IMAGE\n#\n# # Ждать health check\n# echo "Waiting for health check..."\n# for i in \$(seq 1 30); do\n#   if curl -sf http://localhost:\$TARGET_PORT/actuator/health > /dev/null; then\n#     echo "Health check passed!"\n#     break\n#   fi\n#   if [ \$i -eq 30 ]; then\n#     echo "Health check failed! Aborting."\n#     docker rm -f myapp-\$TARGET\n#     exit 1\n#   fi\n#   sleep 2\n# done\n#\n# # Переключить Nginx\n# cat > \$NGINX_CONF << EOF\n# upstream backend {\n#     server localhost:\$TARGET_PORT;\n# }\n# EOF\n# nginx -s reload\n# echo "Traffic switched to \$TARGET"\n#\n# # Graceful shutdown старого окружения\n# if [ "\$ACTIVE" != "none" ]; then\n#   echo "Graceful shutdown of \$ACTIVE..."\n#   docker stop --time 30 myapp-\$ACTIVE\n#   docker rm myapp-\$ACTIVE\n# fi\n#\n# echo "Deployment complete! Active: \$TARGET"\n\n// Spring Boot graceful shutdown\n// application.yml:\n// server:\n//   shutdown: graceful\n// spring:\n//   lifecycle:\n//     timeout-per-shutdown-phase: 30s\n\n// Rollback script: rollback.sh\n# #!/bin/bash\n# # Быстро переключить Nginx обратно\n# CURRENT_PORT=\$(grep "server localhost" /etc/nginx/conf.d/myapp.conf | grep -o "[0-9]*")\n# if [ "\$CURRENT_PORT" = "8081" ]; then\n#   ROLLBACK_PORT=8082\n# else\n#   ROLLBACK_PORT=8081\n# fi\n# sed -i "s/\$CURRENT_PORT/\$ROLLBACK_PORT/" /etc/nginx/conf.d/myapp.conf\n# nginx -s reload\n# echo "Rolled back to port \$ROLLBACK_PORT"`,
      explanation: 'Blue-Green: два идентичных окружения, трафик переключается между ними. Zero downtime: новая версия запускается параллельно, трафик переключается мгновенно. Health check перед переключением гарантирует что новая версия работает. Rollback — просто переключение Nginx обратно (секунды). Graceful shutdown ждёт завершения текущих запросов.'
    }
  ]
}
