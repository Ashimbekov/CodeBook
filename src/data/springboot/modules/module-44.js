export default {
  id: 44,
  title: 'Spring Native и GraalVM',
  description: 'Компиляция Spring Boot приложений в нативные образы с GraalVM: концепции AOT компиляции, настройка, конфигурация reflection, сравнение производительности.',
  lessons: [
    {
      id: 1,
      title: 'Основы GraalVM и нативных образов',
      type: 'theory',
      content: [
        { type: `heading`, value: `Что такое GraalVM Native Image?` },
        { type: `text`, value: `GraalVM Native Image компилирует Java-приложение в нативный исполняемый файл (binary). Это даёт мгновенный старт (миллисекунды вместо секунд), минимальное потребление памяти и компактный размер. Идеально для serverless, контейнеров и CLI-инструментов.` },
        { type: `heading`, value: `JVM vs Native Image` },
        { type: `list`, items: [
          'JVM: старт 2-5 сек, RAM 200-500MB, JIT оптимизация в runtime, reflection работает свободно',
          'Native Image: старт 20-50ms, RAM 30-80MB, AOT компиляция, reflection требует конфигурации',
          'JVM лучше для долгоживущих приложений с высокой нагрузкой (JIT прогревается)',
          'Native лучше для serverless, микросервисов, short-lived процессов'
        ] },
        { type: `heading`, value: `AOT (Ahead-of-Time) компиляция` },
        { type: `text`, value: `В отличие от JIT (Just-in-Time), AOT компилирует весь код в машинный код ДО запуска. Это означает что все классы, reflection вызовы и ресурсы должны быть известны на этапе компиляции.` },
        { type: `code`, language: `text`, value: `Что происходит при native-image компиляции:\n1. Анализ всего кода (reachability analysis)\n2. Удаление неиспользуемого кода (tree shaking)\n3. Инициализация статических блоков\n4. Компиляция в машинный код для целевой платформы\n5. Создание исполняемого файла (50-100MB)\n\nОграничения:\n- Reflection, Proxy, JNI требуют явной конфигурации\n- Class.forName() не работает без конфигурации\n- Serialization требует регистрации классов\n- Некоторые библиотеки не совместимы` },
        { type: `heading`, value: `Spring Boot 3 + GraalVM` },
        { type: `code`, language: `xml`, value: `<!-- pom.xml -->\n<parent>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-parent</artifactId>\n    <version>3.3.0</version>\n</parent>\n\n<!-- Spring AOT plugin уже включён в spring-boot-starter-parent -->\n\n<!-- GraalVM Native Build Tools -->\n<build>\n    <plugins>\n        <plugin>\n            <groupId>org.graalvm.buildtools</groupId>\n            <artifactId>native-maven-plugin</artifactId>\n        </plugin>\n    </plugins>\n</build>\n\n<!-- Профиль для нативной сборки -->\n<profiles>\n    <profile>\n        <id>native</id>\n        <build>\n            <plugins>\n                <plugin>\n                    <groupId>org.graalvm.buildtools</groupId>\n                    <artifactId>native-maven-plugin</artifactId>\n                    <configuration>\n                        <buildArgs>\n                            <arg>-H:+ReportExceptionStackTraces</arg>\n                        </buildArgs>\n                    </configuration>\n                </plugin>\n            </plugins>\n        </build>\n    </profile>\n</profiles>` },
        { type: `tip`, value: `Spring Boot 3 имеет встроенную поддержку GraalVM Native Image. Большинство Spring модулей работают из коробки, без дополнительной конфигурации reflection.` }
      ]
    },
    {
      id: 2,
      title: 'Сборка Native Image',
      type: 'theory',
      content: [
        { type: `heading`, value: `Установка GraalVM` },
        { type: `code`, language: `bash`, value: `# Установка через SDKMAN\nsdk install java 21.0.2-graalce\nsdk use java 21.0.2-graalce\n\n# Проверка\njava -version\n# openjdk 21.0.2 2024-01-16\n# GraalVM CE 21.0.2\n\nnative-image --version\n# GraalVM Native Image` },
        { type: `heading`, value: `Сборка через Maven` },
        { type: `code`, language: `bash`, value: `# Обычная JVM сборка (для сравнения)\nmvn clean package -DskipTests\njava -jar target/myapp-1.0.jar\n# Started Application in 2.3 seconds\n\n# Нативная сборка\nmvn -Pnative native:compile -DskipTests\n# Компиляция занимает 3-10 минут, потребляет 4-8 GB RAM\n\n./target/myapp\n# Started Application in 0.045 seconds  (в 50 раз быстрее!)` },
        { type: `heading`, value: `Сборка через Docker (без локального GraalVM)` },
        { type: `code`, language: `bash`, value: `# Spring Boot Buildpacks — самый простой способ\nmvn spring-boot:build-image -Pnative -DskipTests\n# Создаёт Docker image с нативным бинарником\n\ndocker run --rm -p 8080:8080 myapp:1.0\n# Started Application in 0.038 seconds` },
        { type: `heading`, value: `Многоэтапный Dockerfile` },
        { type: `code`, language: `dockerfile`, value: `# Dockerfile для нативной сборки\nFROM ghcr.io/graalvm/graalvm-community:21 AS builder\nWORKDIR /app\n\nCOPY pom.xml .\nCOPY src ./src\nCOPY mvnw .\nCOPY .mvn ./.mvn\n\n# Сборка нативного образа\nRUN ./mvnw -Pnative native:compile -DskipTests\n\n# Финальный минимальный образ\nFROM debian:bookworm-slim\nWORKDIR /app\n\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    libz-dev && rm -rf /var/lib/apt/lists/*\n\nCOPY --from=builder /app/target/myapp .\n\nEXPOSE 8080\nENTRYPOINT ["./myapp"]\n\n# Размер образа: ~80MB (вместо ~400MB с JVM)` },
        { type: `heading`, value: `Spring AOT Processing` },
        { type: `code`, language: `java`, value: `// Spring AOT генерирует код на этапе компиляции:\n// - BeanDefinition регистрации (вместо classpath scanning)\n// - Proxy классы (вместо динамических CGLIB прокси)\n// - Reflection конфигурацию для Spring beans\n\n// Проверка AOT совместимости\nmvn spring-boot:process-aot\n\n// Запуск с AOT на JVM (для тестирования)\njava -Dspring.aot.enabled=true -jar target/myapp.jar\n\n// Сгенерированные файлы:\n// target/spring-aot/main/sources/  — Java код\n// target/spring-aot/main/resources/META-INF/native-image/\n//   reflect-config.json\n//   resource-config.json\n//   proxy-config.json` },
        { type: `note`, value: `Нативная компиляция занимает 3-10 минут и требует много RAM (4-8 GB). Используйте CI/CD для нативных сборок, а локально разрабатывайте с обычной JVM.` }
      ]
    },
    {
      id: 3,
      title: 'AOT конфигурация и Hints',
      type: 'theory',
      content: [
        { type: `heading`, value: `Проблема: Reflection в Native Image` },
        { type: `text`, value: `Native Image не поддерживает динамический reflection. Все классы, которые используются через reflection, должны быть зарегистрированы в конфигурации. Spring Boot автоматически регистрирует свои beans, но кастомный reflection нужно регистрировать вручную.` },
        { type: `heading`, value: `RuntimeHints — программная регистрация` },
        { type: `code`, language: `java`, value: `// Регистрация hints через RuntimeHintsRegistrar\n@Component\n@ImportRuntimeHints(MyRuntimeHints.class)\npublic class MyService {\n    // ...\n}\n\npublic class MyRuntimeHints implements RuntimeHintsRegistrar {\n\n    @Override\n    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {\n        // Reflection для класса\n        hints.reflection().registerType(MyDto.class, \n            MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS,\n            MemberCategory.INVOKE_PUBLIC_METHODS,\n            MemberCategory.DECLARED_FIELDS);\n\n        // Ресурсы\n        hints.resources().registerPattern(\"templates/*\");\n        hints.resources().registerPattern(\"*.properties\");\n\n        // Сериализация\n        hints.serialization().registerType(MySerializableClass.class);\n\n        // Proxy\n        hints.proxies().registerJdkProxy(MyInterface.class);\n    }\n}` },
        { type: `heading`, value: `@RegisterReflectionForBinding` },
        { type: `code`, language: `java`, value: `// Простой способ: аннотация для DTO классов\n@RestController\n@RegisterReflectionForBinding({\n    UserDto.class,\n    CreateUserRequest.class,\n    UpdateUserRequest.class,\n    ErrorResponse.class\n})\npublic class UserController {\n    // Spring автоматически регистрирует все поля и методы этих классов\n}` },
        { type: `heading`, value: `JSON конфигурация (ручная)` },
        { type: `code`, language: `json`, value: `// src/main/resources/META-INF/native-image/reflect-config.json\n[\n  {\n    "name": "com.example.dto.UserDto",\n    "allDeclaredConstructors": true,\n    "allDeclaredMethods": true,\n    "allDeclaredFields": true\n  },\n  {\n    "name": "com.example.dto.OrderDto",\n    "methods": [\n      {"name": "getId", "parameterTypes": []},\n      {"name": "getName", "parameterTypes": []}\n    ]\n  }\n]\n\n// src/main/resources/META-INF/native-image/resource-config.json\n{\n  "resources": {\n    "includes": [\n      {"pattern": "templates/.*\\\\.html$\"},\n      {\"pattern\": \"static/.*\"}\n    ]\n  }\n}` },
        { type: `heading`, value: `Tracing Agent — автоматическая генерация` },
        { type: `code`, language: `bash`, value: `# Запустить приложение с tracing agent\njava -agentlib:native-image-agent=config-output-dir=src/main/resources/META-INF/native-image \\\n  -jar target/myapp.jar\n\n# Прогнать все endpoints (вручную или тестами)\ncurl http://localhost:8080/api/users\ncurl -X POST http://localhost:8080/api/users -d \\'{"name":"test"}\\'\n\n# Agent записывает все reflection/resource/proxy вызовы\n# Файлы создаются автоматически:\n# reflect-config.json, resource-config.json, proxy-config.json` },
        { type: `tip`, value: `Запускайте tracing agent с интеграционными тестами для автоматической генерации полной конфигурации: mvn test -DargLine="-agentlib:native-image-agent=config-output-dir=..."` }
      ]
    },
    {
      id: 4,
      title: 'Настройка и совместимость',
      type: 'theory',
      content: [
        { type: `heading`, value: `Совместимые Spring модули` },
        { type: `list`, items: [
          'Spring Web (MVC и WebFlux) — полная поддержка',
          'Spring Data JPA — полная поддержка',
          'Spring Security — полная поддержка',
          'Spring Actuator — поддерживается',
          'Spring Kafka — поддерживается',
          'Spring Cache — поддерживается',
          'Spring Batch — экспериментальная поддержка',
          'Некоторые третьесторонние библиотеки могут не работать'
        ] },
        { type: `heading`, value: `Проблемы и решения` },
        { type: `code`, language: `java`, value: `// Проблема: CGLIB proxy не работают в Native Image\n// Решение: используйте JDK proxy (интерфейсы)\n\n// До (CGLIB proxy — не работает):\n@Service\npublic class UserService {\n    @Transactional\n    public void save(User user) { }\n}\n\n// После (JDK proxy — работает):\npublic interface UserService {\n    void save(User user);\n}\n\n@Service\npublic class UserServiceImpl implements UserService {\n    @Transactional\n    public void save(User user) { }\n}\n\n// Или включите CGLIB для AOT:\n// spring.aot.enabled=true автоматически генерирует нужные прокси` },
        { type: `code`, language: `java`, value: `// Проблема: динамическая загрузка классов\n// Class.forName("com.example.MyClass") — не работает без hints\n\n// Решение: зарегистрировать класс\npublic class NativeHints implements RuntimeHintsRegistrar {\n    @Override\n    public void registerHints(RuntimeHints hints, ClassLoader cl) {\n        hints.reflection().registerType(\n            TypeReference.of(\"com.example.MyClass\"),\n            MemberCategory.values());\n    }\n}\n\n// Проблема: Profiles не работают с @Profile\n// Решение: используйте @ConditionalOnProperty вместо @Profile\n@ConditionalOnProperty(name = \"app.feature.enabled\", havingValue = \"true\")\n@Configuration\npublic class FeatureConfig { }` },
        { type: `heading`, value: `Тестирование Native Image` },
        { type: `code`, language: `java`, value: `// Тест AOT совместимости (без нативной компиляции)\n@SpringBootTest\n@EnabledIfEnvironmentVariable(named = \"SPRING_AOT_ENABLED\", matches = \"true\")\nclass AotCompatibilityTest {\n\n    @Autowired\n    ApplicationContext context;\n\n    @Test\n    void contextLoads() {\n        assertNotNull(context);\n    }\n\n    @Test\n    void allBeansCreated() {\n        assertNotNull(context.getBean(UserService.class));\n        assertNotNull(context.getBean(OrderService.class));\n    }\n}\n\n// Нативный тест (компилируется и запускается как native image)\n// mvn -Pnative test\n@SpringBootTest\n@DisabledInAotMode  // пропустить в обычном режиме\nclass NativeIntegrationTest {\n    @Test\n    void healthCheck() {\n        // ...\n    }\n}` },
        { type: `heading`, value: `Build-time инициализация` },
        { type: `code`, language: `java`, value: `// Некоторые классы можно инициализировать при сборке (build time)\n// Это ускоряет старт за счёт более долгой компиляции\n\n// native-image.properties или в pom.xml:\n// --initialize-at-build-time=com.example.config.StaticConfig\n\n@Configuration\npublic class NativeImageConfig {\n\n    @Bean\n    @Scope(\"singleton\")  // singleton создаётся при старте\n    public ObjectMapper objectMapper() {\n        return new ObjectMapper()\n            .registerModule(new JavaTimeModule())\n            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);\n    }\n}` },
        { type: `warning`, value: `Не все библиотеки совместимы с Native Image. Перед переходом проверьте совместимость: https://www.graalvm.org/native-image/libraries-and-frameworks/` }
      ]
    },
    {
      id: 5,
      title: 'Сравнение производительности',
      type: 'theory',
      content: [
        { type: `heading`, value: `Метрики: JVM vs Native Image` },
        { type: `code`, language: `text`, value: `┌────────────────────────┬──────────────┬──────────────┐\n│ Метрика                │ JVM (JIT)    │ Native Image │\n├────────────────────────┼──────────────┼──────────────┤\n│ Время старта           │ 2.3 сек      │ 0.045 сек    │\n│ Время до первого ответа│ 3.1 сек      │ 0.08 сек     │\n│ RAM при старте         │ 280 MB       │ 45 MB        │\n│ RAM под нагрузкой      │ 450 MB       │ 120 MB       │\n│ Размер образа (Docker) │ 400 MB       │ 85 MB        │\n│ Время сборки           │ 15 сек       │ 5 мин        │\n│ Peak throughput        │ 12000 rps    │ 8500 rps     │\n│ P99 latency (warmup)   │ 150ms→15ms   │ 10ms         │\n│ P99 latency (steady)   │ 12ms         │ 14ms         │\n└────────────────────────┴──────────────┴──────────────┘` },
        { type: `heading`, value: `Когда использовать Native Image` },
        { type: `list`, items: [
          'Serverless (AWS Lambda, Google Cloud Functions) — критичен холодный старт',
          'CLI инструменты — мгновенный запуск',
          'Kubernetes с частым масштабированием — быстрый scale-up',
          'Edge/IoT — ограниченные ресурсы',
          'Микросервисы с низкой нагрузкой — экономия RAM'
        ] },
        { type: `heading`, value: `Когда НЕ использовать` },
        { type: `list`, items: [
          'Высоконагруженные long-running сервисы — JIT оптимизирует лучше',
          'Приложения с динамическим reflection — слишком много конфигурации',
          'Rapid development — компиляция слишком долгая',
          'Монолиты — выигрыш минимален'
        ] },
        { type: `heading`, value: `Serverless с Spring Cloud Function` },
        { type: `code`, language: `java`, value: `// Spring Cloud Function + Native Image для AWS Lambda\n@SpringBootApplication\npublic class LambdaApplication {\n\n    @Bean\n    public Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> \n            handleRequest() {\n        return request -> {\n            String body = request.getBody();\n            // обработка\n            APIGatewayProxyResponseEvent response = \n                new APIGatewayProxyResponseEvent();\n            response.setStatusCode(200);\n            response.setBody(\"{\\\"message\\\": \\\"Hello from Native!\\\"}\");\n            return response;\n        };\n    }\n}\n\n// Результат: Lambda cold start: 200ms (вместо 5-10 сек с JVM)` },
        { type: `heading`, value: `Бенчмарк скрипт` },
        { type: `code`, language: `bash`, value: `#!/bin/bash\n# Сравнение JVM vs Native\n\necho "=== JVM ===" \ntime java -jar target/myapp.jar &\nPID=$!\nsleep 5\n\n# Замер памяти\nRSS=$(ps -o rss= -p $PID)\necho "JVM RSS: $((RSS / 1024)) MB"\n\n# Нагрузочный тест\nab -n 10000 -c 100 http://localhost:8080/api/products\n\nkill $PID\n\necho "=== Native ==="\ntime ./target/myapp &\nPID=$!\nsleep 2\n\nRSS=$(ps -o rss= -p $PID)\necho "Native RSS: $((RSS / 1024)) MB"\n\nab -n 10000 -c 100 http://localhost:8080/api/products\n\nkill $PID` },
        { type: `tip`, value: `Используйте JVM для разработки и тестирования (быстрая компиляция), а Native Image для production deployment (быстрый старт, меньше RAM). CI/CD собирает нативный образ.` }
      ]
    },
    {
      id: 6,
      title: 'Практика: Нативная сборка REST API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подготовьте Spring Boot REST API для нативной компиляции: настройте AOT, зарегистрируйте hints и соберите Native Image.',
      requirements: [
        'Spring Boot 3.x REST API с JPA и Security',
        'Настроить native-maven-plugin в pom.xml',
        'RuntimeHintsRegistrar для кастомных DTO',
        '@RegisterReflectionForBinding для контроллеров',
        'Собрать нативный образ: mvn -Pnative native:compile',
        'Docker image с нативным бинарником через Buildpacks',
        'Сравнить время старта JVM vs Native',
        'Проверить работоспособность всех endpoints'
      ],
      hint: 'Используйте tracing agent для автоматической генерации конфигурации, затем проверьте и дополните вручную. spring-boot:build-image -Pnative — самый простой способ создать Docker image.',
      expectedOutput: 'JVM сборка:\n  mvn package: 15 секунд\n  java -jar: Started in 2.3 seconds\n  Docker image: 380 MB\n  RAM: 280 MB\n\nNative сборка:\n  mvn -Pnative native:compile: 4 минуты 30 секунд\n  ./myapp: Started in 0.042 seconds\n  Docker image: 82 MB\n  RAM: 42 MB\n\nВсе endpoints работают:\n  GET /api/products -> 200 OK\n  POST /api/products -> 201 Created\n  GET /actuator/health -> 200 OK {"status":"UP"}',
      solution: '<!-- pom.xml -->\n<build>\n    <plugins>\n        <plugin>\n            <groupId>org.graalvm.buildtools</groupId>\n            <artifactId>native-maven-plugin</artifactId>\n        </plugin>\n        <plugin>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-maven-plugin</artifactId>\n            <configuration>\n                <image>\n                    <builder>paketobuildpacks/builder-jammy-tiny:latest</builder>\n                </image>\n            </configuration>\n        </plugin>\n    </plugins>\n</build>\n\n// RuntimeHints\n@ImportRuntimeHints(AppRuntimeHints.class)\n@SpringBootApplication\npublic class Application { }\n\npublic class AppRuntimeHints implements RuntimeHintsRegistrar {\n    @Override\n    public void registerHints(RuntimeHints hints, ClassLoader cl) {\n        hints.reflection().registerType(ProductDto.class,\n            MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS,\n            MemberCategory.INVOKE_PUBLIC_METHODS,\n            MemberCategory.DECLARED_FIELDS);\n        hints.resources().registerPattern("db/migration/*");\n    }\n}\n\n@RestController\n@RegisterReflectionForBinding({ProductDto.class, CreateProductRequest.class})\npublic class ProductController {\n    @GetMapping("/api/products")\n    public List<ProductDto> getAll() { return service.findAll(); }\n}\n\n// Сборка: mvn -Pnative native:compile -DskipTests\n// Docker: mvn spring-boot:build-image -Pnative -DskipTests',
      explanation: 'Spring Boot 3 автоматически генерирует большую часть AOT конфигурации. RuntimeHintsRegistrar нужен только для кастомного reflection. Buildpacks создают оптимальный Docker image без написания Dockerfile. Нативный образ стартует в 50x быстрее при 5x меньшем потреблении RAM.'
    }
  ]
}
