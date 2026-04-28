export default {
  id: 24,
  title: 'Миграция с монолита',
  description: 'Стратегии миграции: Strangler Fig Pattern, Anti-Corruption Layer, Branch by Abstraction, Feature Flags, постепенный переход.',
  lessons: [
    {
      id: 1,
      title: 'Strangler Fig Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Strangler Fig (удушающая фига) — паттерн постепенной замены монолита. Новый функционал создаётся в микросервисах. Старый функционал постепенно переносится. API Gateway перенаправляет запросы.' },
        { type: 'code', language: 'bash', value: '# Strangler Fig Pattern:\n#\n# Фаза 1: Монолит обслуживает всё\n# [Client] -> [Monolith] -> [Single DB]\n#\n# Фаза 2: API Gateway перенаправляет часть запросов\n# [Client] -> [API Gateway]\n#              ├── /api/users    -> [User Service] -> [Users DB]\n#              └── /api/orders   -> [Monolith]     -> [Single DB]\n#              └── /api/products -> [Monolith]     -> [Single DB]\n#\n# Фаза 3: Переносим больше модулей\n# [Client] -> [API Gateway]\n#              ├── /api/users    -> [User Service]    -> [Users DB]\n#              ├── /api/orders   -> [Order Service]   -> [Orders DB]\n#              └── /api/products -> [Monolith]        -> [Single DB]\n#\n# Фаза 4: Монолит полностью заменён\n# [Client] -> [API Gateway]\n#              ├── /api/users    -> [User Service]    -> [Users DB]\n#              ├── /api/orders   -> [Order Service]   -> [Orders DB]\n#              └── /api/products -> [Product Service]  -> [Products DB]\n#\n# Монолит выключен!' },
        { type: 'tip', value: 'Начинайте с самого простого модуля (Users или Products). Получите опыт, настройте инфраструктуру (CI/CD, мониторинг). Потом переходите к сложным модулям (Orders, Payments).' }
      ]
    },
    {
      id: 2,
      title: 'Планирование миграции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Миграция — долгий процесс (месяцы-годы). Нужен чёткий план: что выделяем первым, как синхронизируем данные, как обеспечиваем обратную совместимость.' },
        { type: 'heading', value: 'Критерии выбора модуля для первой миграции' },
        { type: 'list', value: [
          'Минимум зависимостей от других модулей монолита',
          'Чёткие границы API (чистый контракт)',
          'Высокая частота изменений (бизнес-приоритет)',
          'Разная нагрузка: модуль нужно масштабировать отдельно',
          'Команда с опытом: владельцы модуля мотивированы'
        ] },
        { type: 'code', language: 'java', value: '// Шаг 1: Определить границы модуля в монолите\n// Модульный монолит — первый шаг к микросервисам\n\n// Было: пакеты по типу (controller, service, repository)\n// com.shop.controller.UserController\n// com.shop.controller.OrderController\n// com.shop.service.UserService\n// com.shop.service.OrderService\n// com.shop.repository.UserRepository\n// com.shop.repository.OrderRepository\n\n// Стало: пакеты по домену (модулю)\n// com.shop.user.UserController\n// com.shop.user.UserService\n// com.shop.user.UserRepository\n// com.shop.order.OrderController\n// com.shop.order.OrderService\n// com.shop.order.OrderRepository\n\n// Шаг 2: Определить зависимости между модулями\n// OrderService -> UserService (нужно имя клиента)\n// OrderService -> ProductService (нужна цена)\n// PaymentService -> OrderService (сумма заказа)\n\n// Шаг 3: Выделить интерфейсы между модулями\npublic interface UserApi {\n    UserDto getUser(UUID userId);\n}\n\n// В монолите: прямой вызов\n@Service\npublic class MonolithUserApi implements UserApi {\n    public UserDto getUser(UUID userId) {\n        return userRepository.findById(userId).map(UserDto::from).orElseThrow();\n    }\n}\n\n// После миграции: HTTP вызов\n@Service\npublic class RemoteUserApi implements UserApi {\n    public UserDto getUser(UUID userId) {\n        return restClient.get()\n            .uri("http://user-service/api/v1/users/{id}", userId)\n            .retrieve().body(UserDto.class);\n    }\n}' },
        { type: 'note', value: 'Branch by Abstraction: создайте интерфейс для каждой зависимости между модулями. Текущая реализация — прямой вызов в монолите. После миграции модуля — замените реализацию на HTTP-клиент. Код остальных модулей не меняется!' }
      ]
    },
    {
      id: 3,
      title: 'Миграция базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самая сложная часть миграции — разделение базы данных. Нельзя просто разрезать: есть foreign keys, JOIN-ы, общие таблицы. Стратегия: Database View -> Sync -> Separate.' },
        { type: 'code', language: 'bash', value: '# Стратегия миграции БД:\n\n# Фаза 1: Shared Database (начало)\n# [Monolith]     -> [Single DB: users, orders, products]\n# [User Service] -> [Single DB: users, orders, products]\n# User Service читает ТОЛЬКО таблицу users\n# НО пока из той же БД (shared)\n\n# Фаза 2: Database View\n# Создаём view для User Service:\n# CREATE VIEW user_service_users AS SELECT * FROM users;\n# User Service работает через view\n# Ограничиваем доступ: GRANT SELECT, INSERT, UPDATE ON user_service_users TO user_svc;\n\n# Фаза 3: Separate Database + Sync\n# [User Service] -> [Users DB] (своя БД)\n# [Monolith]     -> [Single DB] + CDC sync <- [Users DB]\n# Debezium синхронизирует Users DB -> Single DB\n# Монолит пока читает из своей копии\n\n# Фаза 4: Remove Sync\n# Монолит вызывает User Service API вместо прямого доступа\n# Убираем синхронизацию\n# Single DB больше не содержит таблицу users' },
        { type: 'code', language: 'java', value: '// Миграция данных: двойная запись\n@Service\npublic class UserService {\n    private final UserRepository newUserRepo;     // Новая БД\n    private final LegacyUserRepository legacyRepo; // Старая БД монолита\n    private final FeatureFlagClient featureFlags;\n\n    @Transactional\n    public User createUser(CreateUserRequest request) {\n        User user = new User(request);\n\n        // Пишем в новую БД\n        newUserRepo.save(user);\n\n        // Двойная запись в старую (пока монолит ещё читает)\n        if (featureFlags.isEnabled("dual-write-legacy")) {\n            try {\n                legacyRepo.save(toLegacy(user));\n            } catch (Exception e) {\n                log.error("Legacy write failed: {}", e.getMessage());\n                // Не ломаем основной flow!\n            }\n        }\n\n        return user;\n    }\n\n    public User getUser(UUID id) {\n        // Shadow read: читаем из обоих и сравниваем\n        if (featureFlags.isEnabled("shadow-read")) {\n            User newUser = newUserRepo.findById(id).orElse(null);\n            User legacyUser = legacyRepo.findById(id).map(this::fromLegacy).orElse(null);\n            if (!Objects.equals(newUser, legacyUser)) {\n                log.warn("Data mismatch for user {}: new={}, legacy={}", id, newUser, legacyUser);\n            }\n        }\n\n        return newUserRepo.findById(id)\n            .orElseThrow(() -> new UserNotFoundException(id));\n    }\n}' },
        { type: 'warning', value: 'Двойная запись — временное решение для переходного периода. Убедитесь что данные совпадают (shadow reads), потом переключайтесь полностью на новую БД и убирайте двойную запись.' }
      ]
    },
    {
      id: 4,
      title: 'Feature Flags для миграции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature Flags позволяют переключаться между монолитом и микросервисом без деплоя. Постепенное переключение трафика, мгновенный откат при проблемах.' },
        { type: 'code', language: 'java', value: '// Feature Flag для постепенного переключения\n@Configuration\npublic class UserApiConfig {\n    private final FeatureFlagClient featureFlags;\n\n    @Bean\n    public UserApi userApi(\n            MonolithUserApi monolithApi,\n            MicroserviceUserApi microserviceApi) {\n\n        // Стратегии переключения:\n        return userId -> {\n            // 1. По проценту трафика (canary)\n            if (featureFlags.isEnabled("user-service-migration\", userId.toString())) {\n                try {\n                    return microserviceApi.getUser(userId);\n                } catch (Exception e) {\n                    log.error(\"Microservice failed, fallback to monolith\", e);\n                    return monolithApi.getUser(userId);\n                }\n            }\n            return monolithApi.getUser(userId);\n        };\n    }\n}\n\n// API Gateway с Feature Flag\n@Configuration\npublic class GatewayRoutingConfig {\n\n    @Bean\n    public RouteLocator routes(RouteLocatorBuilder builder) {\n        return builder.routes()\n            .route(\"user-service-migration\", r -> r\n                .path(\"/api/v1/users/**\")\n                .filters(f -> f.filter((exchange, chain) -> {\n                    // Проверяем Feature Flag\n                    if (featureFlagClient.isEnabled(\"route-to-user-microservice\")) {\n                        // Направляем на новый микросервис\n                        exchange.getAttributes().put(GATEWAY_REQUEST_URL_ATTR,\n                            URI.create(\"http://user-service:8081\"));\n                    }\n                    // Иначе — на монолит (default route)\n                    return chain.filter(exchange);\n                }))\n                .uri(\"http://monolith:8080\"))\n            .build();\n    }\n}' },
        { type: 'list', value: [
          '0% -> микросервис: начало, всё идёт в монолит',
          '5% -> микросервис: тестирование с небольшим трафиком',
          '25% -> микросервис: мониторинг метрик (latency, errors)',
          '50% -> микросервис: сравнение производительности',
          '100% -> микросервис: полное переключение',
          'Монолит выключен: удаляем код из монолита'
        ] }
      ]
    },
    {
      id: 5,
      title: 'Типичные ошибки миграции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Миграция с монолита на микросервисы — сложный процесс с множеством ловушек. Изучение типичных ошибок поможет их избежать.' },
        { type: 'heading', value: 'Антипаттерны миграции' },
        { type: 'list', value: [
          'Big Bang Migration — попытка переписать всё сразу. Потратите год, выбросите код. Используйте Strangler Fig!',
          'Shared Database — оставить общую БД "временно". Временно = навсегда. Разделяйте БД как можно раньше',
          'Distributed Monolith — разделили код, но сервисы всё ещё сильно связаны и деплоятся вместе',
          'Nano-services — слишком мелкое дробление. Если два сервиса всегда меняются вместе — объедините',
          'Нет инфраструктуры — начали выделять сервисы без CI/CD, мониторинга, Service Discovery',
          'Нет чётких границ — выделили сервис неправильно, не по Bounded Context. Пришлось объединять обратно',
          'Игнорирование данных — разделили код, но не продумали синхронизацию данных. Данные рассинхронизировались'
        ] },
        { type: 'code', language: 'bash', value: '# Чеклист готовности к миграции:\n# [ ] CI/CD pipeline для каждого сервиса\n# [ ] Docker + Kubernetes инфраструктура\n# [ ] Centralized Logging (ELK/EFK)\n# [ ] Distributed Tracing (Jaeger/Zipkin)\n# [ ] Monitoring + Alerting (Prometheus/Grafana)\n# [ ] Service Discovery (Consul/K8s DNS)\n# [ ] API Gateway\n# [ ] Команда с опытом распределённых систем\n# [ ] Руководство понимает сроки (месяцы/годы)\n# [ ] Модульный монолит (чёткие границы модулей)' },
        { type: 'warning', value: 'Не начинайте миграцию если нет инфраструктуры (CI/CD, мониторинг, K8s) и опыта. Сначала постройте инфраструктуру и модульный монолит. Потом выделяйте сервисы. Иначе получите Distributed Monolith.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: План миграции',
      type: 'practice',
      difficulty: 'hard',
      description: 'Составьте план миграции e-commerce монолита на микросервисы и реализуйте первый шаг — выделение User Service.',
      requirements: [
        'Проанализируйте модули монолита и зависимости между ними',
        'Определите порядок миграции: какой модуль первый, второй',
        'Создайте API Gateway для маршрутизации между монолитом и микросервисом',
        'Выделите User Service с собственной БД',
        'Настройте двойную запись и shadow read для проверки',
        'Реализуйте Feature Flag для постепенного переключения трафика'
      ],
      hint: 'Начните с User Module — минимум зависимостей. Создайте интерфейс UserApi с двумя реализациями. API Gateway маршрутизирует по Feature Flag. Двойная запись синхронизирует данные переходного периода.',
      expectedOutput: 'Анализ: User модуль имеет 2 зависимости (от Order и Payment).\nПлан: 1) Users 2) Products 3) Orders 4) Payments.\nAPI Gateway: Feature Flag 0% -> user-microservice.\n\nФаза 1: User Service развёрнут, двойная запись.\nФаза 2: Feature Flag 5% -> shadow reads, 0 mismatches.\nФаза 3: Feature Flag 50% -> latency OK, errors 0%.\nФаза 4: Feature Flag 100% -> полное переключение.\nФаза 5: Убрана двойная запись, код Users удалён из монолита.',
      solution: '// 1. Интерфейс абстракции\npublic interface UserApi {\n    UserDto getUser(UUID userId);\n    UserDto createUser(CreateUserRequest request);\n}\n\n// 2. Монолитная реализация\npublic class MonolithUserApi implements UserApi {\n    public UserDto getUser(UUID userId) {\n        return userRepository.findById(userId).map(UserDto::from).orElseThrow();\n    }\n}\n\n// 3. Микросервисная реализация\npublic class RemoteUserApi implements UserApi {\n    public UserDto getUser(UUID userId) {\n        return restClient.get().uri("/api/v1/users/{id}", userId)\n            .retrieve().body(UserDto.class);\n    }\n}\n\n// 4. Переключение через Feature Flag\n@Bean\npublic UserApi userApi(MonolithUserApi monolith, RemoteUserApi remote) {\n    return userId -> {\n        if (featureFlags.isEnabled("user-service-migration")) {\n            return remote.getUser(userId);\n        }\n        return monolith.getUser(userId);\n    };\n}\n\n// 5. Gateway routing\nspring.cloud.gateway.routes:\n  - id: users-to-microservice\n    uri: http://user-service:8081\n    predicates:\n      - Path=/api/v1/users/**\n      - Header=X-Feature-Flag, user-service-migration',
      explanation: 'Миграция с монолита — постепенный процесс. Strangler Fig Pattern позволяет мигрировать по одному модулю. Branch by Abstraction изолирует изменения. Feature Flags обеспечивают безопасное переключение. Двойная запись и shadow reads проверяют корректность. Ключ: маленькие шаги, постоянный мониторинг, готовность к откату.'
    }
  ]
}
