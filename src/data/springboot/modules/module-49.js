export default {
  id: 49,
  title: 'Практикум: Реактивный API',
  description: 'Практический проект: создание реактивного чат-приложения с использованием Spring WebFlux, R2DBC, WebSocket и Reactive Streams.',
  lessons: [
    {
      id: 1,
      title: 'Задача: настройка проекта и доменная модель',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте реактивный проект для чат-приложения: WebFlux + R2DBC + PostgreSQL. Определите доменную модель и реактивные репозитории.',
      requirements: [
        'Spring WebFlux + R2DBC + PostgreSQL',
        'Entity: ChatRoom (id, name, createdBy, createdAt)',
        'Entity: Message (id, roomId, senderId, content, createdAt)',
        'Entity: User (id, username, email, avatarUrl, online)',
        'ReactiveCrudRepository для каждого Entity',
        'Custom query: findMessagesByRoomIdOrderByCreatedAtDesc с пагинацией',
        'Flyway миграции для создания таблиц',
        'R2DBC конфигурация в application.yml'
      ],
      hint: 'R2DBC не поддерживает JPA аннотации. Используйте @Table, @Id из spring-data-relational. Связи реализуйте через отдельные запросы.',
      expectedOutput: 'Приложение запускается на Netty:\nStarted Application in 1.2 seconds\n\nFlyway миграции:\nV1__create_users.sql\nV2__create_chat_rooms.sql\nV3__create_messages.sql\n\nТаблицы созданы:\nusers (id, username, email, avatar_url, online, created_at)\nchat_rooms (id, name, created_by, created_at)\nmessages (id, room_id, sender_id, content, created_at)',
      solution: '// application.yml\n// spring.r2dbc.url: r2dbc:postgresql://localhost:5432/chatdb\n// spring.r2dbc.username: user\n// spring.r2dbc.password: password\n// spring.flyway.url: jdbc:postgresql://localhost:5432/chatdb\n\n@Table("users")\npublic class User {\n    @Id private Long id;\n    private String username;\n    private String email;\n    private String avatarUrl;\n    private boolean online;\n    @CreatedDate private LocalDateTime createdAt;\n}\n\n@Table("messages")\npublic class Message {\n    @Id private Long id;\n    private Long roomId;\n    private Long senderId;\n    private String content;\n    @CreatedDate private LocalDateTime createdAt;\n}\n\n@Table("chat_rooms")\npublic class ChatRoom {\n    @Id private Long id;\n    private String name;\n    private Long createdBy;\n    @CreatedDate private LocalDateTime createdAt;\n}\n\npublic interface MessageRepository extends ReactiveCrudRepository<Message, Long> {\n    @Query("SELECT * FROM messages WHERE room_id = :roomId ORDER BY created_at DESC LIMIT :limit OFFSET :offset")\n    Flux<Message> findByRoomId(@Param("roomId") Long roomId, @Param("limit") int limit, @Param("offset") int offset);\n\n    Flux<Message> findByRoomIdOrderByCreatedAtDesc(Long roomId);\n}\n\npublic interface ChatRoomRepository extends ReactiveCrudRepository<ChatRoom, Long> {\n    Flux<ChatRoom> findByCreatedBy(Long userId);\n}\n\npublic interface UserRepository extends ReactiveCrudRepository<User, Long> {\n    Mono<User> findByUsername(String username);\n    Flux<User> findByOnlineTrue();\n}',
      explanation: 'R2DBC обеспечивает полностью неблокирующий доступ к PostgreSQL. Flyway использует JDBC для миграций (R2DBC не поддерживает DDL). ReactiveCrudRepository возвращает Mono/Flux вместо Optional/List.'
    },
    {
      id: 2,
      title: 'Задача: реактивные REST endpoints',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте REST API для управления чат-комнатами и сообщениями с реактивными контроллерами.',
      requirements: [
        'GET /api/rooms — список всех комнат (Flux<ChatRoomDto>)',
        'POST /api/rooms — создать комнату (Mono<ChatRoomDto>)',
        'GET /api/rooms/{id}/messages?limit=50 — сообщения комнаты с пагинацией',
        'POST /api/rooms/{id}/messages — отправить сообщение',
        'GET /api/users/online — онлайн пользователи (Flux<UserDto>)',
        'Реактивный сервисный слой (Mono/Flux цепочки)',
        'Обработка ошибок: switchIfEmpty для 404',
        'Валидация через @Valid с реактивными DTO'
      ],
      hint: 'Контроллер возвращает Mono/Flux, Spring WebFlux автоматически подписывается. Используйте flatMap для цепочки асинхронных операций.',
      expectedOutput: 'POST /api/rooms {"name": "general"}:\nHTTP 201 {"id": 1, "name": "general", "createdAt": "..."}\n\nPOST /api/rooms/1/messages {"content": "Привет!"}:\nHTTP 201 {"id": 1, "roomId": 1, "senderId": 5, "content": "Привет!"}\n\nGET /api/rooms/1/messages?limit=50:\n[{"id":2,"content":"Как дела?","senderName":"Иван"}, {"id":1,"content":"Привет!","senderName":"Алия"}]\n\nGET /api/rooms/999:\nHTTP 404 {"error": "Комната не найдена"}\n\nGET /api/users/online:\n[{"id":1,"username":"ivan","online":true}, {"id":3,"username":"aliya","online":true}]',
      solution: '@RestController\n@RequestMapping("/api/rooms")\npublic class ChatRoomController {\n    private final ChatRoomService roomService;\n    private final MessageService messageService;\n\n    @GetMapping\n    public Flux<ChatRoomDto> getAllRooms() {\n        return roomService.findAll().map(ChatRoomDto::from);\n    }\n\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public Mono<ChatRoomDto> createRoom(@Valid @RequestBody Mono<CreateRoomRequest> request) {\n        return request.flatMap(roomService::create).map(ChatRoomDto::from);\n    }\n\n    @GetMapping("/{id}")\n    public Mono<ResponseEntity<ChatRoomDto>> getRoom(@PathVariable Long id) {\n        return roomService.findById(id)\n            .map(room -> ResponseEntity.ok(ChatRoomDto.from(room)))\n            .defaultIfEmpty(ResponseEntity.notFound().build());\n    }\n\n    @GetMapping("/{id}/messages")\n    public Flux<MessageDto> getMessages(@PathVariable Long id,\n                                         @RequestParam(defaultValue = "50") int limit) {\n        return messageService.findByRoomId(id, limit);\n    }\n\n    @PostMapping("/{id}/messages")\n    @ResponseStatus(HttpStatus.CREATED)\n    public Mono<MessageDto> sendMessage(@PathVariable Long id,\n                                         @Valid @RequestBody Mono<SendMessageRequest> request) {\n        return request.flatMap(req -> messageService.send(id, req)).map(MessageDto::from);\n    }\n}\n\n@Service\npublic class MessageService {\n    private final MessageRepository messageRepo;\n    private final UserRepository userRepo;\n\n    public Flux<MessageDto> findByRoomId(Long roomId, int limit) {\n        return messageRepo.findByRoomId(roomId, limit, 0)\n            .flatMap(msg -> userRepo.findById(msg.getSenderId())\n                .map(user -> MessageDto.from(msg, user.getUsername())));\n    }\n\n    public Mono<Message> send(Long roomId, SendMessageRequest req) {\n        Message msg = new Message();\n        msg.setRoomId(roomId);\n        msg.setSenderId(req.getSenderId());\n        msg.setContent(req.getContent());\n        return messageRepo.save(msg);\n    }\n}',
      explanation: 'Каждый endpoint возвращает Mono или Flux. WebFlux подписывается автоматически и стримит данные клиенту. flatMap используется для цепочки асинхронных операций (загрузка сообщения -> загрузка автора).'
    },
    {
      id: 3,
      title: 'Задача: WebSocket для реального времени',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте WebSocket endpoint для real-time обмена сообщениями в чат-комнатах.',
      requirements: [
        'WebSocket endpoint: /ws/chat/{roomId}',
        'Подключение к комнате по roomId',
        'Отправка сообщений через WebSocket (JSON формат)',
        'Broadcast сообщения всем участникам комнаты',
        'Reactor Sinks для управления потоками сообщений',
        'Уведомление при подключении/отключении пользователя',
        'Сохранение сообщений в БД через R2DBC',
        'Обработка отключения и очистка ресурсов'
      ],
      hint: 'Используйте Sinks.many().multicast().onBackpressureBuffer() для каждой комнаты. WebSocketHandler обрабатывает входящие и исходящие потоки.',
      expectedOutput: 'WebSocket подключение: ws://localhost:8080/ws/chat/1\n\nОтправка: {"senderId": 5, "content": "Привет всем!"}\n\nВсе участники комнаты 1 получают:\n{"id": 42, "senderId": 5, "senderName": "Алия", "content": "Привет всем!", "createdAt": "..."}\n\nПри подключении нового пользователя:\n{"type": "USER_JOINED", "userId": 3, "username": "Иван"}\n\nПри отключении:\n{"type": "USER_LEFT", "userId": 3, "username": "Иван"}\n\nСообщение сохранено в PostgreSQL через R2DBC.',
      solution: '@Configuration\npublic class WebSocketConfig {\n    @Bean\n    public HandlerMapping webSocketMapping(ChatWebSocketHandler handler) {\n        Map<String, WebSocketHandler> map = Map.of("/ws/chat/**", handler);\n        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();\n        mapping.setUrlMap(map);\n        mapping.setOrder(-1);\n        return mapping;\n    }\n\n    @Bean\n    public WebSocketHandlerAdapter handlerAdapter() {\n        return new WebSocketHandlerAdapter();\n    }\n}\n\n@Component\npublic class ChatWebSocketHandler implements WebSocketHandler {\n    private final Map<String, Sinks.Many<String>> roomSinks = new ConcurrentHashMap<>();\n    private final MessageService messageService;\n    private final ObjectMapper mapper;\n\n    @Override\n    public Mono<Void> handle(WebSocketSession session) {\n        String roomId = extractRoomId(session);\n        Sinks.Many<String> sink = roomSinks.computeIfAbsent(roomId,\n            k -> Sinks.many().multicast().onBackpressureBuffer());\n\n        // Входящие сообщения\n        Mono<Void> input = session.receive()\n            .map(WebSocketMessage::getPayloadAsText)\n            .flatMap(payload -> {\n                ChatMessageRequest req = mapper.readValue(payload, ChatMessageRequest.class);\n                return messageService.send(Long.valueOf(roomId), req)\n                    .doOnNext(msg -> sink.tryEmitNext(mapper.writeValueAsString(MessageDto.from(msg))));\n            })\n            .doFinally(signal -> {\n                sink.tryEmitNext(\"{\\\"type\\\":\\\"USER_LEFT\\\"}\");\n            })\n            .then();\n\n        // Исходящие сообщения\n        Mono<Void> output = session.send(\n            sink.asFlux().map(session::textMessage));\n\n        // Уведомление о подключении\n        sink.tryEmitNext("{\\\"type\\\":\\\"USER_JOINED\\\"}\")\n\n        return Mono.zip(input, output).then();\n    }\n\n    private String extractRoomId(WebSocketSession session) {\n        String path = session.getHandshakeInfo().getUri().getPath();\n        return path.substring(path.lastIndexOf(\"/\") + 1);\n    }\n}',
      explanation: 'Reactor Sinks.many().multicast() создаёт горячий поток сообщений для каждой комнаты. Все подписчики (WebSocket сессии) получают broadcast. Входящие сообщения сохраняются в БД и публикуются в sink для рассылки.'
    },
    {
      id: 4,
      title: 'Задача: SSE для уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Server-Sent Events для потоковых уведомлений: новые сообщения, статус пользователей, системные уведомления.',
      requirements: [
        'GET /api/notifications/stream — SSE endpoint (produces TEXT_EVENT_STREAM)',
        'Уведомления о новых сообщениях в комнатах пользователя',
        'Уведомления о смене статуса друзей (online/offline)',
        'Уведомления о приглашениях в комнаты',
        'Reactor Sinks для каждого пользователя',
        'Heartbeat каждые 30 секунд (для поддержания соединения)',
        'Автоматическое отключение при закрытии SSE',
        'Фильтрация уведомлений по типу через query param'
      ],
      hint: 'SSE endpoint возвращает Flux<ServerSentEvent<Notification>>. Используйте Flux.merge() для объединения разных источников уведомлений с heartbeat.',
      expectedOutput: 'GET /api/notifications/stream (Accept: text/event-stream)\n\nevent: message\ndata: {"type":"NEW_MESSAGE","roomId":1,"senderName":"Иван","preview":"Привет!"}\n\nevent: status\ndata: {"type":"USER_ONLINE","userId":3,"username":"Алия"}\n\nevent: heartbeat\ndata: {"type":"HEARTBEAT","timestamp":"2026-04-05T10:00:30"}\n\nevent: invite\ndata: {"type":"ROOM_INVITE","roomId":5,"roomName":"Проект X","invitedBy":"Админ"}\n\nGET /api/notifications/stream?types=message,invite\n(только сообщения и приглашения, без status и heartbeat)',
      solution: '@RestController\n@RequestMapping("/api/notifications")\npublic class NotificationController {\n    private final NotificationService notificationService;\n\n    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)\n    public Flux<ServerSentEvent<Notification>> stream(\n            @AuthenticationPrincipal UserDetails user,\n            @RequestParam(required = false) List<String> types) {\n\n        Flux<Notification> notifications = notificationService\n            .getNotificationStream(user.getUsername());\n\n        if (types != null && !types.isEmpty()) {\n            notifications = notifications.filter(n -> types.contains(n.getType()));\n        }\n\n        Flux<Notification> heartbeat = Flux.interval(Duration.ofSeconds(30))\n            .map(i -> new Notification("HEARTBEAT", Map.of("timestamp", LocalDateTime.now())));\n\n        return Flux.merge(notifications, heartbeat)\n            .map(n -> ServerSentEvent.<Notification>builder()\n                .event(n.getType().toLowerCase())\n                .data(n)\n                .build());\n    }\n}\n\n@Service\npublic class NotificationService {\n    private final Map<String, Sinks.Many<Notification>> userSinks = new ConcurrentHashMap<>();\n\n    public Flux<Notification> getNotificationStream(String username) {\n        Sinks.Many<Notification> sink = userSinks.computeIfAbsent(username,\n            k -> Sinks.many().multicast().onBackpressureBuffer());\n        return sink.asFlux();\n    }\n\n    public void notify(String username, Notification notification) {\n        Sinks.Many<Notification> sink = userSinks.get(username);\n        if (sink != null) {\n            sink.tryEmitNext(notification);\n        }\n    }\n\n    public void notifyRoom(Long roomId, Notification notification) {\n        roomMemberRepo.findByRoomId(roomId)\n            .forEach(member -> notify(member.getUsername(), notification));\n    }\n}',
      explanation: 'SSE — это однонаправленный серверный поток через HTTP. Идеально для уведомлений: сервер пушит данные клиенту. Heartbeat предотвращает закрытие соединения прокси/балансировщиком. Flux.merge() объединяет уведомления и heartbeat в один поток.'
    },
    {
      id: 5,
      title: 'Задача: реактивная аутентификация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте JWT аутентификацию для реактивного приложения с ReactiveSecurityContext.',
      requirements: [
        'POST /api/auth/register — регистрация (Mono)',
        'POST /api/auth/login — логин, возврат JWT (Mono)',
        'ReactiveSecurityContextHolder для получения текущего пользователя',
        'SecurityWebFilterChain с JWT фильтром',
        'PasswordEncoder с BCrypt',
        'Custom ReactiveUserDetailsService',
        'Защита WebSocket endpoints по JWT из query param',
        'Реактивные тесты с @WithMockUser и WebTestClient'
      ],
      hint: 'В WebFlux нет SecurityContextHolder. Используйте ReactiveSecurityContextHolder.getContext(). JWT передаётся в Authorization header для REST и в query param для WebSocket.',
      expectedOutput: 'POST /api/auth/register {"username":"ivan","email":"ivan@mail.com","password":"secret"}:\n{"id":1,"username":"ivan","token":"eyJhbGciOiJIUzI1NiJ9..."}\n\nPOST /api/auth/login {"username":"ivan","password":"secret"}:\n{"token":"eyJhbGciOiJIUzI1NiJ9...","expiresIn":3600}\n\nGET /api/rooms (без токена):\nHTTP 401 Unauthorized\n\nGET /api/rooms (Authorization: Bearer <token>):\n[{"id":1,"name":"general"}]\n\nWebSocket: ws://localhost:8080/ws/chat/1?token=eyJhbG...\nПодключение успешно.',
      solution: '@Configuration\n@EnableWebFluxSecurity\npublic class SecurityConfig {\n    @Bean\n    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,\n                                                      JwtAuthFilter jwtFilter) {\n        return http\n            .csrf(ServerHttpSecurity.CsrfSpec::disable)\n            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)\n            .authorizeExchange(auth -> auth\n                .pathMatchers("/api/auth/**").permitAll()\n                .pathMatchers("/ws/**").permitAll()\n                .anyExchange().authenticated())\n            .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)\n            .build();\n    }\n}\n\n@Component\npublic class JwtAuthFilter implements WebFilter {\n    private final JwtService jwtService;\n    private final ReactiveUserDetailsService userDetailsService;\n\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {\n        String token = extractToken(exchange.getRequest());\n        if (token == null) return chain.filter(exchange);\n\n        String username = jwtService.extractUsername(token);\n        return userDetailsService.findByUsername(username)\n            .filter(user -> jwtService.isValid(token, user))\n            .map(user -> new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()))\n            .flatMap(auth -> chain.filter(exchange)\n                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth)))\n            .switchIfEmpty(chain.filter(exchange));\n    }\n}\n\n@Service\npublic class AuthService {\n    public Mono<AuthResponse> login(LoginRequest req) {\n        return userRepo.findByUsername(req.getUsername())\n            .filter(user -> passwordEncoder.matches(req.getPassword(), user.getPassword()))\n            .map(user -> new AuthResponse(jwtService.generateToken(user), 3600))\n            .switchIfEmpty(Mono.error(new BadCredentialsException("Неверные данные")));\n    }\n}',
      explanation: 'WebFlux Security использует WebFilter вместо Servlet Filter. ReactiveSecurityContextHolder хранит аутентификацию в Reactor Context (не в ThreadLocal). JWT фильтр извлекает токен, валидирует и устанавливает Authentication в реактивный контекст.'
    },
    {
      id: 6,
      title: 'Задача: тестирование и деплой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полные тесты для реактивного чат-приложения и подготовьте Docker deployment.',
      requirements: [
        'StepVerifier тесты для сервисов (MessageService, AuthService)',
        'WebTestClient тесты для контроллеров',
        'WebSocket тест с WebSocketClient',
        'Testcontainers для PostgreSQL',
        'docker-compose: app + postgres + nginx',
        'Nginx конфигурация для WebSocket proxy'
      ],
      hint: 'WebTestClient.bindToServer() для E2E тестов. StepVerifier.create(mono).expectNext(...).verifyComplete() для unit тестов. Nginx: proxy_set_header Upgrade $http_upgrade для WebSocket.',
      expectedOutput: 'Тесты:\n  MessageServiceTest: 5 passed\n  ChatRoomControllerTest: 4 passed\n  AuthServiceTest: 3 passed\n  WebSocketIT: 2 passed\n  E2E ChatFlowIT: 1 passed\n  Total: 15 passed, 0 failed\n\ndocker compose up:\n  app: Netty started on port 8080\n  postgres: accepting connections\n  nginx: listening on port 80\n\ncurl http://localhost/api/rooms -> []\nwebsocket: ws://localhost/ws/chat/1 -> connected',
      solution: '// StepVerifier тест\n@ExtendWith(MockitoExtension.class)\nclass MessageServiceTest {\n    @Mock MessageRepository messageRepo;\n    @Mock UserRepository userRepo;\n    @InjectMocks MessageService messageService;\n\n    @Test\n    void sendMessage_shouldSaveAndReturn() {\n        Message saved = new Message(1L, 1L, 5L, "Hello", LocalDateTime.now());\n        when(messageRepo.save(any())).thenReturn(Mono.just(saved));\n\n        StepVerifier.create(messageService.send(1L, new SendMessageRequest(5L, "Hello")))\n            .assertNext(msg -> {\n                assertEquals("Hello", msg.getContent());\n                assertEquals(1L, msg.getRoomId());\n            })\n            .verifyComplete();\n    }\n}\n\n// WebTestClient тест\n@SpringBootTest(webEnvironment = RANDOM_PORT)\nclass ChatRoomControllerIT {\n    @Autowired WebTestClient webTestClient;\n\n    @Test\n    void createRoom_shouldReturn201() {\n        webTestClient.post().uri("/api/rooms")\n            .contentType(MediaType.APPLICATION_JSON)\n            .bodyValue(new CreateRoomRequest("test-room"))\n            .headers(h -> h.setBearerAuth(getToken()))\n            .exchange()\n            .expectStatus().isCreated()\n            .expectBody()\n            .jsonPath("$.name").isEqualTo("test-room");\n    }\n}\n\n# docker-compose.yml\n# services:\n#   app:\n#     build: .\n#     environment:\n#       SPRING_R2DBC_URL: r2dbc:postgresql://postgres:5432/chatdb\n#     depends_on: [postgres]\n#   postgres:\n#     image: postgres:16\n#     environment:\n#       POSTGRES_DB: chatdb\n#   nginx:\n#     image: nginx:alpine\n#     ports: ["80:80"]\n#     volumes: [./nginx.conf:/etc/nginx/conf.d/default.conf]',
      explanation: 'StepVerifier тестирует реактивные потоки пошагово. WebTestClient — встроенный HTTP клиент для тестирования WebFlux. Testcontainers запускает PostgreSQL в Docker для интеграционных тестов. Nginx проксирует WebSocket соединения с правильными заголовками Upgrade.'
    }
  ]
}
