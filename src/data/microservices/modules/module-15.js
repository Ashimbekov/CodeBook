export default {
  id: 15,
  title: 'Аутентификация и авторизация',
  description: 'Безопасность микросервисов: OAuth2, JWT токены, API keys, zero-trust архитектура, централизованная vs распределённая проверка.',
  lessons: [
    {
      id: 1,
      title: 'OAuth2 для микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'OAuth2 — стандарт авторизации, идеально подходящий для микросервисов. Authorization Server выдаёт JWT-токены. API Gateway проверяет токены. Сервисы доверяют токену и извлекают информацию о пользователе из claims.' },
        { type: 'code', language: 'bash', value: '# OAuth2 flow для микросервисов:\n# 1. Client -> Authorization Server: POST /oauth/token\n#    (credentials: client_id + client_secret + user credentials)\n# 2. Authorization Server -> Client: JWT access_token\n# 3. Client -> API Gateway: GET /api/orders (Authorization: Bearer <jwt>)\n# 4. API Gateway: проверяет JWT (signature, expiry)\n# 5. API Gateway -> Order Service: GET /api/orders (X-User-Id, X-Roles)\n# 6. Order Service: проверяет X-Roles для авторизации\n\n# JWT token содержит:\n# Header:  {"alg": "RS256", "typ": "JWT"}\n# Payload: {\n#   "sub": "user-123",\n#   "email": "user@example.com",\n#   "roles": ["USER", "ADMIN"],\n#   "iss": "https://auth.shop.com",\n#   "exp": 1700000000,\n#   "iat": 1699996400\n# }\n# Signature: RS256(header + payload, private_key)' },
        { type: 'tip', value: 'JWT позволяет не вызывать Authorization Server при каждом запросе — Gateway проверяет подпись локально с public key. Это значительно снижает нагрузку и латентность.' }
      ]
    },
    {
      id: 2,
      title: 'JWT проверка в Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Security с OAuth2 Resource Server автоматически валидирует JWT: проверяет подпись, срок действия, issuer. Claims из токена доступны через SecurityContext.' },
        { type: 'code', language: 'java', value: '// Spring Security — JWT Resource Server\n@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        return http\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers("/actuator/health/**").permitAll()\n                .requestMatchers("/api/v1/orders/**").authenticated()\n                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")\n            )\n            .oauth2ResourceServer(oauth2 -> oauth2\n                .jwt(jwt -> jwt\n                    .jwtAuthenticationConverter(jwtAuthConverter())))\n            .build();\n    }\n\n    // Конвертация JWT claims в Spring Security authorities\n    @Bean\n    public JwtAuthenticationConverter jwtAuthConverter() {\n        JwtGrantedAuthoritiesConverter grantedAuthorities =\n            new JwtGrantedAuthoritiesConverter();\n        grantedAuthorities.setAuthoritiesClaimName("roles");\n        grantedAuthorities.setAuthorityPrefix("ROLE_");\n\n        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();\n        converter.setJwtGrantedAuthoritiesConverter(grantedAuthorities);\n        return converter;\n    }\n}\n\n// Использование в контроллере\n@RestController\n@RequestMapping("/api/v1/orders")\npublic class OrderController {\n\n    @GetMapping\n    public List<OrderResponse> getMyOrders(\n            @AuthenticationPrincipal Jwt jwt) {\n        String userId = jwt.getSubject(); // user-123\n        String email = jwt.getClaimAsString("email");\n        List<String> roles = jwt.getClaimAsStringList("roles");\n\n        return orderService.findByCustomerId(UUID.fromString(userId));\n    }\n\n    @PreAuthorize("hasRole(\'ADMIN\')\")\n    @GetMapping(\"/all\")\n    public List<OrderResponse> getAllOrders() {\n        return orderService.findAll();\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml\nspring:\n  security:\n    oauth2:\n      resourceserver:\n        jwt:\n          issuer-uri: https://auth.shop.com\n          # Или указать JWKS URL напрямую:\n          # jwk-set-uri: https://auth.shop.com/.well-known/jwks.json' },
        { type: 'note', value: 'issuer-uri автоматически загружает JWKS (JSON Web Key Set) для проверки подписи JWT. Public keys кэшируются. При ротации ключей Spring Security автоматически подтягивает новые.' }
      ]
    },
    {
      id: 3,
      title: 'Service-to-Service аутентификация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда сервис вызывает другой сервис напрямую (без запроса пользователя), нужна service-to-service аутентификация. Подходы: mTLS, API keys, Client Credentials grant.' },
        { type: 'code', language: 'java', value: '// Подход 1: Client Credentials (OAuth2)\n// Order Service получает свой токен для вызова Payment Service\n@Service\npublic class ServiceTokenProvider {\n    private final OAuth2AuthorizedClientManager clientManager;\n\n    public String getServiceToken() {\n        OAuth2AuthorizeRequest request = OAuth2AuthorizeRequest\n            .withClientRegistrationId("payment-service")\n            .principal("order-service\")\n            .build();\n\n        OAuth2AuthorizedClient client = clientManager.authorize(request);\n        return client.getAccessToken().getTokenValue();\n    }\n}\n\n// Подход 2: API Key (простой)\n@Service\npublic class PaymentServiceClient {\n    @Value(\"${services.payment.api-key}\")\n    private String apiKey;\n\n    public PaymentResponse processPayment(PaymentRequest request) {\n        return restClient.post()\n            .uri(\"/api/v1/payments\")\n            .header(\"X-API-Key\", apiKey)\n            .body(request)\n            .retrieve()\n            .body(PaymentResponse.class);\n    }\n}\n\n// Подход 3: Прокидывание пользовательского JWT\n@Service\npublic class UserServiceClient {\n    public UserResponse getUser(UUID userId) {\n        // Берём JWT из текущего SecurityContext\n        String jwt = SecurityContextHolder.getContext()\n            .getAuthentication().getCredentials().toString();\n\n        return restClient.get()\n            .uri(\"/api/v1/users/{id}\", userId)\n            .header(HttpHeaders.AUTHORIZATION, \"Bearer \" + jwt)\n            .retrieve()\n            .body(UserResponse.class);\n    }\n}' },
        { type: 'list', value: [
          'mTLS: самый безопасный, Istio обеспечивает автоматически',
          'Client Credentials: OAuth2 стандарт, сервис получает свой токен',
          'API Keys: простой, но менее гибкий, нужна ротация',
          'JWT propagation: прокидывание пользовательского токена по цепочке вызовов'
        ] }
      ]
    },
    {
      id: 4,
      title: 'Zero Trust Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Zero Trust — модель безопасности "никому не доверяй, всегда проверяй". Каждый запрос аутентифицируется и авторизуется, даже внутри сети. Микросервисы идеально подходят для Zero Trust.' },
        { type: 'code', language: 'yaml', value: '# Zero Trust принципы для микросервисов:\n\n# 1. Encrypt everything (mTLS)\n# Istio PeerAuthentication\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: shop\nspec:\n  mtls:\n    mode: STRICT\n\n# 2. Least privilege (минимальные права)\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: payment-service-policy\nspec:\n  selector:\n    matchLabels:\n      app: payment-service\n  rules:\n    - from:\n        - source:\n            principals:\n              - cluster.local/ns/shop/sa/order-service\n      to:\n        - operation:\n            methods: [\"POST\"]\n            paths: [\"/api/v1/payments\"]\n    # Только order-service может вызывать payment-service\n    # Только POST на /api/v1/payments\n\n# 3. Verify identity (проверка каждого запроса)\n# JWT RequestAuthentication + AuthorizationPolicy\n\n# 4. Network segmentation (сегментация сети)\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: payment-service-netpol\n  namespace: shop\nspec:\n  podSelector:\n    matchLabels:\n      app: payment-service\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: order-service\n      ports:\n        - port: 8080' },
        { type: 'warning', value: 'Zero Trust требует: mTLS между всеми сервисами, AuthorizationPolicy для каждого сервиса, NetworkPolicy в Kubernetes, JWT проверку на каждом уровне. Это значительная работа, но критична для безопасности production.' }
      ]
    },
    {
      id: 5,
      title: 'Keycloak как Authorization Server',
      type: 'theory',
      content: [
        { type: 'text', value: 'Keycloak — open-source Authorization Server от Red Hat. Поддерживает OAuth2, OpenID Connect, SAML. Управление пользователями, ролями, группами через Admin Console.' },
        { type: 'code', language: 'yaml', value: '# Docker Compose — Keycloak\nservices:\n  keycloak:\n    image: quay.io/keycloak/keycloak:23.0\n    command: start-dev\n    environment:\n      KEYCLOAK_ADMIN: admin\n      KEYCLOAK_ADMIN_PASSWORD: admin\n      KC_DB: postgres\n      KC_DB_URL: jdbc:postgresql://keycloak-db:5432/keycloak\n      KC_DB_USERNAME: keycloak\n      KC_DB_PASSWORD: keycloak\n    ports:\n      - "8180:8080"\n\n  keycloak-db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: keycloak\n      POSTGRES_USER: keycloak\n      POSTGRES_PASSWORD: keycloak' },
        { type: 'code', language: 'yaml', value: '# Spring Boot + Keycloak конфигурация\nspring:\n  security:\n    oauth2:\n      resourceserver:\n        jwt:\n          issuer-uri: http://keycloak:8180/realms/shop\n          jwk-set-uri: http://keycloak:8180/realms/shop/protocol/openid-connect/certs\n      client:\n        registration:\n          keycloak:\n            client-id: order-service\n            client-secret: ${KEYCLOAK_CLIENT_SECRET}\n            authorization-grant-type: client_credentials\n            scope: openid\n        provider:\n          keycloak:\n            issuer-uri: http://keycloak:8180/realms/shop' },
        { type: 'tip', value: 'Keycloak предоставляет: Admin Console для управления, User Federation (LDAP, Active Directory), Social Login (Google, GitHub), Multi-factor authentication, User self-service (registration, password reset).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: OAuth2 + JWT',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте аутентификацию и авторизацию для микросервисов через Keycloak с JWT.',
      requirements: [
        'Запустите Keycloak и создайте realm "shop" с пользователями',
        'Настройте Spring Security Resource Server с JWT проверкой',
        'Реализуйте role-based access: USER может создавать заказы, ADMIN — видеть все',
        'Настройте Client Credentials для service-to-service вызовов',
        'Добавьте JWT propagation при вызове другого сервиса',
        'Настройте API Gateway для проверки JWT перед маршрутизацией'
      ],
      hint: 'В Keycloak создайте realm, clients (order-service, api-gateway), roles (USER, ADMIN), users. В Spring Security используйте @PreAuthorize. Для service-to-service используйте OAuth2AuthorizedClientManager.',
      expectedOutput: 'Keycloak: realm "shop", user "john" с ролью USER, user "admin" с ролью ADMIN.\nPOST /api/v1/orders без токена -> 401 Unauthorized.\nPOST /api/v1/orders с JWT (john/USER) -> 201 Created.\nGET /api/v1/orders/all с JWT (john/USER) -> 403 Forbidden.\nGET /api/v1/orders/all с JWT (admin/ADMIN) -> 200 OK.\nService-to-Service: Order Service -> Payment Service с Client Credentials token.',
      solution: '// Security Config\n@Configuration\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        return http\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers("/actuator/**").permitAll()\n                .requestMatchers(HttpMethod.POST, "/api/v1/orders").hasRole("USER")\n                .requestMatchers("/api/v1/orders/all").hasRole("ADMIN")\n                .anyRequest().authenticated())\n            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))\n            .build();\n    }\n}\n\n// Controller\n@PostMapping\npublic OrderResponse create(@RequestBody CreateOrderRequest req,\n                            @AuthenticationPrincipal Jwt jwt) {\n    return orderService.create(req, UUID.fromString(jwt.getSubject()));\n}\n\n@PreAuthorize("hasRole(\'ADMIN\')\")\n@GetMapping(\"/all\")\npublic List<OrderResponse> getAll() {\n    return orderService.findAll();\n}\n\n// application.yml\nspring:\n  security:\n    oauth2:\n      resourceserver:\n        jwt:\n          issuer-uri: http://keycloak:8180/realms/shop',
      explanation: 'OAuth2 + JWT обеспечивают безопасность микросервисов. Keycloak как Authorization Server выдаёт JWT с claims (roles, sub). Spring Security проверяет JWT подпись и expiry. @PreAuthorize контролирует доступ на основе ролей. Client Credentials позволяют сервисам аутентифицировать друг друга.'
    }
  ]
}
