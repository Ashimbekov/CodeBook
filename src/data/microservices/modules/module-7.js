export default {
  id: 7,
  title: 'API Gateway',
  description: 'API Gateway как единая точка входа: маршрутизация, rate limiting, аутентификация, агрегация, Kong и Spring Cloud Gateway.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен API Gateway',
      type: 'theory',
      content: [
        { type: 'text', value: 'API Gateway — единая точка входа для всех клиентов (web, mobile, third-party). Клиент не знает о внутренней структуре микросервисов. Gateway маршрутизирует запросы, агрегирует ответы и обеспечивает cross-cutting concerns.' },
        { type: 'heading', value: 'Без Gateway vs С Gateway' },
        { type: 'code', language: 'bash', value: '# БЕЗ API Gateway:\n# Mobile App -> http://user-service:8081/api/users\n# Mobile App -> http://order-service:8082/api/orders\n# Mobile App -> http://product-service:8083/api/products\n# Проблемы: клиент знает все адреса, CORS, no auth, no rate limit\n\n# С API Gateway:\n# Mobile App -> https://api.shop.com/users     -> user-service\n# Mobile App -> https://api.shop.com/orders    -> order-service\n# Mobile App -> https://api.shop.com/products  -> product-service\n# Один адрес, один SSL, auth, rate limiting, logging\n\n# Функции API Gateway:\n# 1. Routing — маршрутизация к нужному сервису\n# 2. Authentication — проверка JWT/API key\n# 3. Rate Limiting — ограничение запросов\n# 4. Load Balancing — распределение нагрузки\n# 5. Circuit Breaking — отключение упавших сервисов\n# 6. Request/Response transformation\n# 7. Caching — кэширование ответов\n# 8. Logging/Monitoring — централизованные метрики\n# 9. SSL Termination — единый SSL сертификат\n# 10. API Composition — агрегация ответов нескольких сервисов' },
        { type: 'tip', value: 'API Gateway — не бизнес-логика! Gateway маршрутизирует и защищает, но не содержит бизнес-правил. Если Gateway становится "умным" — это признак проблем архитектуры.' }
      ]
    },
    {
      id: 2,
      title: 'Spring Cloud Gateway',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Cloud Gateway — реактивный API Gateway на основе Spring WebFlux. Поддерживает маршрутизацию, фильтры, rate limiting, circuit breaker из коробки.' },
        { type: 'code', language: 'java', value: '// Spring Cloud Gateway — конфигурация через Java\n@Configuration\npublic class GatewayConfig {\n\n    @Bean\n    public RouteLocator routes(RouteLocatorBuilder builder) {\n        return builder.routes()\n            // User Service\n            .route("user-service", r -> r\n                .path("/api/v1/users/**")\n                .filters(f -> f\n                    .stripPrefix(0)\n                    .addRequestHeader("X-Gateway", "true")\n                    .retry(config -> config\n                        .setRetries(3)\n                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE))\n                    .circuitBreaker(config -> config\n                        .setName("userServiceCB")\n                        .setFallbackUri("forward:/fallback/users")))\n                .uri("lb://user-service")) // lb = load balancer\n\n            // Order Service\n            .route("order-service", r -> r\n                .path("/api/v1/orders/**")\n                .filters(f -> f\n                    .requestRateLimiter(config -> config\n                        .setRateLimiter(redisRateLimiter())\n                        .setKeyResolver(userKeyResolver())))\n                .uri("lb://order-service"))\n\n            // WebSocket route\n            .route("websocket", r -> r\n                .path("/ws/**")\n                .uri("lb:ws://notification-service"))\n            .build();\n    }\n\n    // Rate Limiter на основе Redis\n    @Bean\n    public RedisRateLimiter redisRateLimiter() {\n        return new RedisRateLimiter(10, 20); // 10 req/sec, burst 20\n    }\n\n    // Ключ для rate limiting — по userId\n    @Bean\n    public KeyResolver userKeyResolver() {\n        return exchange -> Mono.justOrEmpty(\n            exchange.getRequest().getHeaders().getFirst("X-User-Id")\n        ).defaultIfEmpty("anonymous");\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# Или через YAML конфигурацию:\nspring:\n  cloud:\n    gateway:\n      routes:\n        - id: user-service\n          uri: lb://user-service\n          predicates:\n            - Path=/api/v1/users/**\n          filters:\n            - StripPrefix=0\n            - name: CircuitBreaker\n              args:\n                name: userServiceCB\n                fallbackUri: forward:/fallback/users\n\n        - id: order-service\n          uri: lb://order-service\n          predicates:\n            - Path=/api/v1/orders/**\n            - Method=GET,POST,PUT\n          filters:\n            - name: RequestRateLimiter\n              args:\n                redis-rate-limiter.replenishRate: 10\n                redis-rate-limiter.burstCapacity: 20' },
        { type: 'note', value: 'lb:// означает client-side load balancing через Service Discovery. Gateway автоматически балансирует между инстансами сервиса.' }
      ]
    },
    {
      id: 3,
      title: 'Kong API Gateway',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kong — production-grade API Gateway на основе Nginx и OpenResty. Поддерживает плагины: rate limiting, JWT auth, logging, transformations. Управляется через Admin API или декларативную конфигурацию.' },
        { type: 'code', language: 'yaml', value: '# kong.yml — декларативная конфигурация\n_format_version: "3.0"\n\nservices:\n  - name: user-service\n    url: http://user-service:8081\n    routes:\n      - name: user-route\n        paths:\n          - /api/v1/users\n        strip_path: false\n        methods: [GET, POST, PUT, DELETE]\n\n  - name: order-service\n    url: http://order-service:8082\n    routes:\n      - name: order-route\n        paths:\n          - /api/v1/orders\n        strip_path: false\n\nplugins:\n  # Rate Limiting\n  - name: rate-limiting\n    config:\n      minute: 100\n      hour: 5000\n      policy: redis\n      redis_host: redis\n\n  # JWT Authentication\n  - name: jwt\n    route: order-route\n    config:\n      key_claim_name: kid\n      claims_to_verify:\n        - exp\n\n  # Request Transformer\n  - name: request-transformer\n    service: user-service\n    config:\n      add:\n        headers:\n          - \"X-Gateway: kong\"\n          - \"X-Request-Start: $(now)\"\n\n  # Logging\n  - name: http-log\n    config:\n      http_endpoint: http://logstash:5044\n      method: POST\n      content_type: application/json' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — Kong с PostgreSQL\nservices:\n  kong-database:\n    image: postgres:15\n    environment:\n      POSTGRES_USER: kong\n      POSTGRES_DB: kong\n      POSTGRES_PASSWORD: kongpass\n\n  kong:\n    image: kong:3.5\n    depends_on: [kong-database]\n    environment:\n      KONG_DATABASE: postgres\n      KONG_PG_HOST: kong-database\n      KONG_PG_PASSWORD: kongpass\n      KONG_PROXY_LISTEN: 0.0.0.0:8000\n      KONG_ADMIN_LISTEN: 0.0.0.0:8001\n    ports:\n      - "8000:8000"   # Proxy\n      - "8001:8001"   # Admin API\n      - "8443:8443"   # Proxy SSL' },
        { type: 'list', value: [
          'Kong — production-ready, Nginx под капотом, плагины на Lua',
          'Spring Cloud Gateway — для Java-экосистемы, тесная интеграция со Spring',
          'NGINX — raw reverse proxy, нужна ручная конфигурация',
          'Traefik — автоматическое обнаружение сервисов из Docker/K8s',
          'AWS API Gateway — managed сервис для AWS'
        ] }
      ]
    },
    {
      id: 4,
      title: 'Rate Limiting и Throttling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate Limiting ограничивает количество запросов от клиента за период. Защищает от DDoS, abuse и перегрузки backend-сервисов. Алгоритмы: Token Bucket, Sliding Window, Fixed Window.' },
        { type: 'code', language: 'java', value: '// Token Bucket алгоритм — наиболее распространённый\n// Ведро с токенами, каждый запрос забирает токен\n// Токены добавляются с фиксированной скоростью\n\n// Spring Cloud Gateway + Redis Rate Limiter\n@Component\npublic class RateLimitConfig {\n\n    // По API key\n    @Bean\n    public KeyResolver apiKeyResolver() {\n        return exchange -> {\n            String apiKey = exchange.getRequest()\n                .getHeaders().getFirst("X-API-Key");\n            return Mono.justOrEmpty(apiKey).defaultIfEmpty("anonymous");\n        };\n    }\n\n    // По IP адресу\n    @Bean\n    public KeyResolver ipKeyResolver() {\n        return exchange -> Mono.just(\n            Objects.requireNonNull(\n                exchange.getRequest().getRemoteAddress())\n                .getAddress().getHostAddress()\n        );\n    }\n}\n\n// Кастомный Rate Limiter с разными лимитами по тарифам\n@Component\npublic class TieredRateLimiter implements RateLimiter<TieredRateLimiter.Config> {\n\n    private final ReactiveRedisTemplate<String, String> redis;\n\n    @Override\n    public Mono<Response> isAllowed(String routeId, String id) {\n        // Определяем тариф по API key\n        String tier = getUserTier(id); // FREE, PRO, ENTERPRISE\n        int limit = switch (tier) {\n            case "FREE" -> 100;       // 100 req/min\n            case "PRO" -> 1000;       // 1000 req/min\n            case "ENTERPRISE" -> 10000; // 10000 req/min\n            default -> 10;\n        };\n\n        String key = "rate:" + id + ":" + currentMinute();\n        return redis.opsForValue().increment(key)\n            .flatMap(count -> {\n                if (count == 1) redis.expire(key, Duration.ofMinutes(1));\n                boolean allowed = count <= limit;\n                return Mono.just(new Response(allowed,\n                    Map.of("X-RateLimit-Limit", String.valueOf(limit),\n                           "X-RateLimit-Remaining\", String.valueOf(Math.max(0, limit - count)))));\n            });\n    }\n}' },
        { type: 'tip', value: 'Всегда возвращайте заголовки X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset — клиент должен знать свои лимиты. При превышении возвращайте 429 Too Many Requests.' }
      ]
    },
    {
      id: 5,
      title: 'BFF: Backend for Frontend',
      type: 'theory',
      content: [
        { type: 'text', value: 'BFF (Backend for Frontend) — паттерн где для каждого типа клиента (web, mobile, IoT) создаётся отдельный API Gateway. Каждый BFF оптимизирован под потребности своего клиента.' },
        { type: 'code', language: 'java', value: '// BFF для Mobile — агрегирует данные, минимизирует запросы\n@RestController\n@RequestMapping("/mobile/api/v1")\npublic class MobileBffController {\n\n    private final UserServiceClient userService;\n    private final OrderServiceClient orderService;\n    private final ProductServiceClient productService;\n\n    // Один запрос от mobile = 3 запроса к сервисам\n    @GetMapping("/dashboard")\n    public Mono<MobileDashboardResponse> getDashboard(\n            @RequestHeader("X-User-Id") UUID userId) {\n\n        // Параллельные вызовы к сервисам\n        Mono<UserProfile> userMono = userService.getProfile(userId);\n        Mono<List<Order>> ordersMono = orderService.getRecent(userId, 5);\n        Mono<List<Product>> recommendationsMono =\n            productService.getRecommendations(userId, 10);\n\n        return Mono.zip(userMono, ordersMono, recommendationsMono)\n            .map(tuple -> new MobileDashboardResponse(\n                tuple.getT1().getName(),\n                tuple.getT1().getAvatarUrl(),\n                tuple.getT2().stream()\n                    .map(o -> new OrderSummary(o.getId(), o.getStatus()))\n                    .toList(),\n                tuple.getT3().stream()\n                    .map(p -> new ProductCard(p.getId(), p.getName(),\n                        p.getPrice(), p.getThumbnailUrl()))\n                    .toList()\n            ));\n    }\n}\n\n// BFF для Web — больше данных, больше деталей\n@RestController\n@RequestMapping("/web/api/v1")\npublic class WebBffController {\n\n    @GetMapping("/dashboard")\n    public Mono<WebDashboardResponse> getDashboard(\n            @RequestHeader("X-User-Id") UUID userId) {\n        // Web получает больше данных: статистику, графики, уведомления\n        // ...\n    }\n}' },
        { type: 'note', value: 'BFF решает проблему "one size fits all": мобильному приложению нужны компактные данные и один запрос, web-приложению — детальные данные. Без BFF либо mobile получает лишние данные, либо web делает много запросов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка API Gateway',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Spring Cloud Gateway с маршрутизацией, rate limiting, JWT аутентификацией и fallback.',
      requirements: [
        'Настройте маршрутизацию к 3 сервисам: users, orders, products',
        'Добавьте JWT фильтр для проверки токена на всех маршрутах',
        'Настройте Redis Rate Limiter: 100 req/min для обычных, 1000 для PRO',
        'Реализуйте Circuit Breaker с fallback для каждого сервиса',
        'Добавьте global filter для логирования всех запросов',
        'Настройте CORS для web-приложения'
      ],
      hint: 'Используйте spring-cloud-gateway с spring-cloud-starter-circuitbreaker-reactor-resilience4j. JWT фильтр — кастомный GatewayFilter, проверяющий Authorization header. Redis Rate Limiter — RedisRateLimiter bean.',
      expectedOutput: 'Gateway запущен на порту 8080.\nGET /api/v1/users/123 -> проксируется к user-service (200 OK).\nGET /api/v1/orders без JWT -> 401 Unauthorized.\nGET /api/v1/orders с JWT -> проксируется к order-service.\n101-й запрос за минуту -> 429 Too Many Requests.\nUser Service упал -> fallback: {"message": "Service temporarily unavailable"}.\nЛоги: каждый запрос логируется с method, path, status, duration.',
      solution: '// Gateway Application\n@SpringBootApplication\npublic class ApiGatewayApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(ApiGatewayApplication.class, args);\n    }\n}\n\n// JWT Filter\n@Component\npublic class JwtAuthFilter implements GatewayFilter {\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {\n        String token = exchange.getRequest().getHeaders()\n            .getFirst(HttpHeaders.AUTHORIZATION);\n        if (token == null || !token.startsWith("Bearer ")) {\n            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);\n            return exchange.getResponse().setComplete();\n        }\n        Claims claims = jwtParser.parseClaimsJws(token.substring(7)).getBody();\n        exchange.getRequest().mutate()\n            .header("X-User-Id", claims.getSubject())\n            .build();\n        return chain.filter(exchange);\n    }\n}\n\n// application.yml\nspring:\n  cloud:\n    gateway:\n      routes:\n        - id: user-service\n          uri: lb://user-service\n          predicates:\n            - Path=/api/v1/users/**\n          filters:\n            - name: CircuitBreaker\n              args:\n                name: userCB\n                fallbackUri: forward:/fallback/users\n            - name: RequestRateLimiter\n              args:\n                redis-rate-limiter.replenishRate: 10\n                redis-rate-limiter.burstCapacity: 20\n      globalcors:\n        corsConfigurations:\n          \"[/**]\":\n            allowedOrigins: \"http://localhost:3000\"\n            allowedMethods: [GET, POST, PUT, DELETE]\n            allowedHeaders: \"*\"',
      explanation: 'API Gateway централизует cross-cutting concerns: аутентификацию, rate limiting, circuit breaking, логирование. Клиенты работают с одним URL. Gateway маршрутизирует запросы на основе path, headers или параметров. Fallback возвращает graceful error при недоступности сервиса.'
    }
  ]
}
