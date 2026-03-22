export default {
  id: 28,
  title: 'Spring Cloud: Gateway, Config, Discovery',
  description: 'Экосистема Spring Cloud: Service Discovery с Eureka, API Gateway, централизованная конфигурация с Config Server и балансировка нагрузки',
  lessons: [
    {
      id: 1,
      title: 'Eureka: Service Discovery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Service Discovery решает проблему: как один сервис находит другой? В Kubernetes это встроено, но в классических микросервисах нужен реестр сервисов. Eureka — Netflix Service Registry, интегрированный в Spring Cloud.' },
        { type: 'heading', value: 'Eureka Server' },
        { type: 'code', language: 'xml', value: '<!-- eureka-server/pom.xml -->\n<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '@SpringBootApplication\n@EnableEurekaServer\npublic class EurekaServerApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(EurekaServerApplication.class, args);\n    }\n}' },
        { type: 'code', language: 'java', value: '# application.properties (Eureka Server)\nserver.port=8761\neureka.client.register-with-eureka=false\neureka.client.fetch-registry=false\n\n# Дашборд доступен на: http://localhost:8761' },
        { type: 'heading', value: 'Регистрация клиента в Eureka' },
        { type: 'code', language: 'java', value: '<!-- user-service/pom.xml -->\n<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# user-service/application.properties\nspring.application.name=user-service\neureka.client.service-url.defaultZone=http://localhost:8761/eureka/' }
      ]
    },
    {
      id: 2,
      title: 'Spring Cloud Gateway',
      type: 'theory',
      content: [
        { type: 'text', value: 'API Gateway — единая точка входа для всех клиентов. Принимает запросы и маршрутизирует их к нужным микросервисам. Также: аутентификация, rate limiting, логирование, SSL termination.' },
        { type: 'heading', value: 'Настройка маршрутов' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-gateway</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# application.yml — конфигурация маршрутов\nspring:\n  cloud:\n    gateway:\n      routes:\n        - id: user-service\n          uri: lb://user-service  # lb:// — load balanced через Eureka\n          predicates:\n            - Path=/api/users/**\n          filters:\n            - StripPrefix=0\n\n        - id: order-service\n          uri: lb://order-service\n          predicates:\n            - Path=/api/orders/**\n            - Method=GET,POST\n\n        - id: product-service\n          uri: http://product-service:8083\n          predicates:\n            - Path=/api/products/**\n          filters:\n            - AddRequestHeader=X-Gateway, true\n            - RequestRateLimiter=10, 5  # 10 запросов/сек, burst 5' },
        { type: 'tip', value: 'lb://service-name — Spring Cloud Gateway автоматически получает адрес из Eureka и балансирует нагрузку между несколькими экземплярами.' }
      ]
    },
    {
      id: 3,
      title: 'Gateway Filters: авторизация и логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Global Filters применяются ко всем запросам через Gateway. Это идеальное место для: проверки JWT, логирования, добавления заголовков корреляции.' },
        { type: 'heading', value: 'JWT аутентификация в Gateway' },
        { type: 'code', language: 'java', value: '@Component\npublic class JwtAuthFilter implements GlobalFilter, Ordered {\n\n    @Autowired\n    private JwtUtil jwtUtil;\n\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {\n        ServerHttpRequest request = exchange.getRequest();\n\n        // Пропускать публичные эндпоинты\n        if (isPublicPath(request.getPath().value())) {\n            return chain.filter(exchange);\n        }\n\n        String authHeader = request.getHeaders().getFirst("Authorization");\n        if (authHeader == null || !authHeader.startsWith("Bearer ")) {\n            return unauthorized(exchange);\n        }\n\n        String token = authHeader.substring(7);\n        try {\n            String userId = jwtUtil.extractUserId(token);\n            // Добавить userId в заголовок для downstream сервисов\n            ServerHttpRequest modifiedRequest = request.mutate()\n                .header("X-User-Id", userId)\n                .build();\n            return chain.filter(exchange.mutate().request(modifiedRequest).build());\n        } catch (JwtException e) {\n            return unauthorized(exchange);\n        }\n    }\n\n    @Override\n    public int getOrder() { return -1; }\n\n    private Mono<Void> unauthorized(ServerWebExchange exchange) {\n        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);\n        return exchange.getResponse().setComplete();\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Config Server: централизованная конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Config Server хранит конфигурации всех сервисов централизованно (обычно в Git репозитории). Сервисы получают свою конфигурацию при старте. Изменение конфига без перезапуска через @RefreshScope.' },
        { type: 'heading', value: 'Config Server' },
        { type: 'code', language: 'java', value: '@SpringBootApplication\n@EnableConfigServer\npublic class ConfigServerApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(ConfigServerApplication.class, args);\n    }\n}' },
        { type: 'code', language: 'java', value: '# config-server/application.properties\nserver.port=8888\nspring.cloud.config.server.git.uri=https://github.com/myorg/configs\nspring.cloud.config.server.git.default-label=main\n\n# В Git репозитории структура:\n# configs/\n#   user-service.properties\n#   order-service.properties\n#   order-service-prod.properties  (профиль prod)' },
        { type: 'heading', value: 'Клиент Config Server' },
        { type: 'code', language: 'java', value: '# bootstrap.properties (или application.properties)\nspring.application.name=user-service\nspring.config.import=configserver:http://localhost:8888\n\n# Динамическое обновление конфига\n@RestController\n@RefreshScope  // Бин пересоздаётся при /actuator/refresh\npublic class ConfigController {\n\n    @Value("${app.feature.enabled:false}")\n    private boolean featureEnabled;\n\n    @GetMapping("/feature")\n    public boolean isEnabled() {\n        return featureEnabled;\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Load Balancing и Resilience',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Cloud LoadBalancer заменяет Netflix Ribbon. Автоматически распределяет запросы между несколькими экземплярами сервиса, зарегистрированными в Eureka.' },
        { type: 'heading', value: 'Настройка LoadBalancer' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class FeignConfig {\n\n    // LoadBalancer автоматически подключается при наличии Eureka\n    // Просто используй lb:// в URL или имя сервиса в @FeignClient\n}\n\n// С WebClient\n@Configuration\npublic class WebClientConfig {\n\n    @Bean\n    @LoadBalanced  // автоматически использует LoadBalancer\n    public WebClient.Builder webClientBuilder() {\n        return WebClient.builder();\n    }\n}\n\n// Использование\n@Service\npublic class ProductService {\n    @Autowired WebClient.Builder webClientBuilder;\n\n    public Mono<ProductDto> getProduct(Long id) {\n        return webClientBuilder.build()\n            .get()\n            .uri("http://product-service/api/products/" + id)  // product-service — имя в Eureka\n            .retrieve()\n            .bodyToMono(ProductDto.class);\n    }\n}' },
        { type: 'heading', value: 'Стратегии балансировки' },
        { type: 'code', language: 'java', value: '# Round Robin (по умолчанию)\nspring.cloud.loadbalancer.ribbon.enabled=false\n\n# Кастомная стратегия\n@Configuration\npublic class CustomLbConfig {\n    @Bean\n    ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(\n        ObjectProvider<ServiceInstanceListSupplier> provider,\n        Environment env) {\n        String name = env.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);\n        return new RandomLoadBalancer(provider, name);\n    }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Spring Cloud Sleuth и централизованные логи',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах логи разбросаны по разным сервисам. ELK Stack (Elasticsearch, Logstash, Kibana) или Loki+Grafana собирают их централизованно. Spring Cloud Sleuth добавляет traceId к каждому логу.' },
        { type: 'heading', value: 'Structured Logging для ELK' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>net.logstash.logback</groupId>\n    <artifactId>logstash-logback-encoder</artifactId>\n    <version>7.4</version>\n</dependency>' },
        { type: 'code', language: 'java', value: '// logback-spring.xml\n<appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">\n    <destination>logstash:5044</destination>\n    <encoder class="net.logstash.logback.encoder.LogstashEncoder">\n        <customFields>{"app":"user-service","env":"prod"}</customFields>\n    </encoder>\n</appender>\n\n// Логи отправляются в Logstash -> Elasticsearch -> Kibana\n// В Kibana ищи по traceId чтобы видеть все логи одного запроса' },
        { type: 'tip', value: 'Сохраняй traceId из Micrometer Tracing в MDC: MDC.put("traceId", traceId). Тогда traceId автоматически добавляется во все логи в текущем потоке.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: минимальная микросервисная система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте базовую инфраструктуру микросервисов: Eureka Server, API Gateway с JWT фильтром, два сервиса (User и Product) регистрируются в Eureka.',
      requirements: [
        'Eureka Server на порту 8761',
        'Config Server на порту 8888, читает configs из файловой системы',
        'API Gateway на порту 8080, маршрутизирует /api/users/** и /api/products/**',
        'JWT Global Filter в Gateway для защиты маршрутов',
        'User Service и Product Service регистрируются в Eureka',
        'Добавь docker-compose.yml для запуска всей инфраструктуры',
        'Добавь Spring Boot Actuator health endpoints на все сервисы'
      ],
      hint: 'В docker-compose сети используй имена сервисов как hostname. User Service подключается к eureka через http://eureka-server:8761/eureka/',
      expectedOutput: 'docker compose up -d:\n[+] Running 4/4\n  eureka         Started (порт 8761)\n  gateway        Started (порт 8080)\n  user-service   Started\n  product-service Started\n\nEureka Dashboard http://localhost:8761:\nInstances currently registered with Eureka:\n  USER-SERVICE     (1 instance)  UP  http://user-service:8082/actuator/info\n  PRODUCT-SERVICE  (1 instance)  UP  http://product-service:8083/actuator/info\n\nЗапросы через Gateway:\nGET http://localhost:8080/api/users/1\n  -> Gateway маршрутизирует в lb://user-service -> http://user-service:8082/api/users/1\n  -> HTTP 200 OK {"id":1,"name":"Алибек"}\n\nGET http://localhost:8080/api/products/5\n  -> маршрутизирует в lb://product-service\n  -> HTTP 200 OK {"id":5,"name":"Ноутбук"}\n\nGET http://localhost:8080/api/secret (без JWT):\n  -> JwtAuthFilter: HTTP 401 Unauthorized',
      solution: '# docker-compose.yml\nversion: "3.8"\nservices:\n  eureka:\n    image: myapp/eureka-server\n    ports: ["8761:8761"]\n\n  config-server:\n    image: myapp/config-server\n    environment:\n      EUREKA_URL: http://eureka:8761/eureka/\n    depends_on: [eureka]\n\n  gateway:\n    image: myapp/api-gateway\n    ports: ["8080:8080"]\n    environment:\n      EUREKA_URL: http://eureka:8761/eureka/\n    depends_on: [eureka]\n\n  user-service:\n    image: myapp/user-service\n    environment:\n      EUREKA_URL: http://eureka:8761/eureka/\n      CONFIG_URL: http://config-server:8888\n    depends_on: [eureka, config-server]\n\n// GatewayConfig\n@Bean\npublic RouteLocator routes(RouteLocatorBuilder b) {\n    return b.routes()\n        .route("users", r -> r.path("/api/users/**").uri("lb://user-service"))\n        .route("products", r -> r.path("/api/products/**").uri("lb://product-service"))\n        .build();\n}',
      explanation: 'lb:// в URL Gateway означает Load Balanced — адрес разрешается через Eureka. depends_on в docker-compose гарантирует порядок запуска. Все сервисы используют имена контейнеров для обнаружения друг друга.'
    }
  ]
}
