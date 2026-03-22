export default {
  id: 23,
  title: 'WebSocket и STOMP',
  description: 'Реализация двусторонней связи в реальном времени через WebSocket с использованием протокола STOMP, SockJS и интеграция с Spring Security',
  lessons: [
    {
      id: 1,
      title: 'Введение в WebSocket',
      type: 'theory',
      content: [
        { type: 'text', value: 'WebSocket — протокол полнодуплексной связи между клиентом и сервером через одно TCP-соединение. В отличие от HTTP, сервер может отправлять данные клиенту в любое время без запроса. Применяется в: чатах, уведомлениях, совместном редактировании, онлайн-играх, биржевых котировках.' },
        { type: 'tip', value: 'HTTP — как письмо: клиент отправляет запрос, сервер отвечает. WebSocket — как телефонный звонок: оба могут говорить в любое время, пока соединение открыто.' },
        { type: 'heading', value: 'Зависимость для WebSocket' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-websocket</artifactId>\n</dependency>' },
        { type: 'heading', value: 'STOMP поверх WebSocket' },
        { type: 'text', value: 'STOMP (Simple Text Oriented Messaging Protocol) — протокол обмена сообщениями поверх WebSocket. Добавляет понятие топиков (подписок), сообщений и подтверждений. Spring Boot имеет отличную поддержку STOMP.' }
      ]
    },
    {
      id: 2,
      title: 'Конфигурация WebSocket STOMP',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация WebSocket в Spring Boot состоит из: endpoint для подключения, брокера сообщений и префиксов для маршрутизации.' },
        { type: 'heading', value: 'WebSocketConfig' },
        { type: 'code', language: 'java', value: 'import org.springframework.messaging.simp.config.MessageBrokerRegistry;\nimport org.springframework.web.socket.config.annotation.*;\n\n@Configuration\n@EnableWebSocketMessageBroker\npublic class WebSocketConfig implements WebSocketMessageBrokerConfigurer {\n\n    @Override\n    public void configureMessageBroker(MessageBrokerRegistry config) {\n        // Префикс для топиков — клиенты подписываются на /topic/...\n        config.enableSimpleBroker("/topic", "/queue");\n        // Префикс для сообщений от клиента к серверу\n        config.setApplicationDestinationPrefixes("/app");\n        // Префикс для личных сообщений\n        config.setUserDestinationPrefix("/user");\n    }\n\n    @Override\n    public void registerStompEndpoints(StompEndpointRegistry registry) {\n        // Endpoint для WebSocket подключения\n        registry.addEndpoint("/ws")\n            .setAllowedOriginPatterns("*")  // CORS\n            .withSockJS();  // fallback для браузеров без WebSocket\n    }\n}' },
        { type: 'heading', value: 'Простой контроллер сообщений' },
        { type: 'code', language: 'java', value: '@Controller\npublic class ChatController {\n\n    @MessageMapping("/chat.send")  // слушает /app/chat.send\n    @SendTo("/topic/public")       // отправляет всем подписанным на /topic/public\n    public ChatMessage sendMessage(ChatMessage message) {\n        message.setTimestamp(LocalDateTime.now());\n        return message;\n    }\n\n    @MessageMapping("/chat.addUser")\n    @SendTo("/topic/public")\n    public ChatMessage addUser(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {\n        headerAccessor.getSessionAttributes().put("username", message.getSender());\n        return message;\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'SimpMessagingTemplate: отправка с сервера',
      type: 'theory',
      content: [
        { type: 'text', value: 'SimpMessagingTemplate позволяет отправлять сообщения из любого места приложения (не только из контроллеров): из сервисов, планировщиков, обработчиков событий.' },
        { type: 'heading', value: 'Отправка из сервиса' },
        { type: 'code', language: 'java', value: '@Service\npublic class NotificationService {\n\n    private final SimpMessagingTemplate messagingTemplate;\n\n    public NotificationService(SimpMessagingTemplate messagingTemplate) {\n        this.messagingTemplate = messagingTemplate;\n    }\n\n    // Отправить всем подписчикам топика\n    public void broadcastUpdate(String message) {\n        messagingTemplate.convertAndSend("/topic/notifications", message);\n    }\n\n    // Отправить конкретному пользователю (личное сообщение)\n    public void sendToUser(String username, String message) {\n        messagingTemplate.convertAndSendToUser(\n            username,\n            "/queue/private",  // клиент подпишется на /user/queue/private\n            message\n        );\n    }\n}\n\n// Из планировщика\n@Component\npublic class PriceUpdateScheduler {\n\n    @Autowired\n    private SimpMessagingTemplate messagingTemplate;\n\n    @Scheduled(fixedRate = 5000)\n    public void broadcastPrices() {\n        List<PriceUpdate> prices = priceService.getCurrentPrices();\n        messagingTemplate.convertAndSend("/topic/prices", prices);\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Модель сообщений и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сообщения между клиентом и сервером сериализуются в JSON. Важно правильно спроектировать модель сообщения и обрабатывать ошибки.' },
        { type: 'heading', value: 'Модель сообщения чата' },
        { type: 'code', language: 'java', value: 'public class ChatMessage {\n    public enum MessageType {\n        CHAT, JOIN, LEAVE, ERROR\n    }\n\n    private MessageType type;\n    private String content;\n    private String sender;\n    private LocalDateTime timestamp;\n\n    // Constructors, getters, setters...\n}\n\n// Контроллер с обработкой ошибок\n@Controller\npublic class ChatController {\n\n    @MessageMapping("/chat.send")\n    @SendTo("/topic/public")\n    public ChatMessage sendMessage(@Payload ChatMessage message,\n                                   Principal principal) {\n        // principal.getName() — имя аутентифицированного пользователя\n        message.setSender(principal.getName());\n        message.setTimestamp(LocalDateTime.now());\n        return message;\n    }\n\n    @MessageExceptionHandler\n    @SendToUser("/queue/errors")\n    public String handleException(Exception exception) {\n        return "Ошибка: " + exception.getMessage();\n    }\n}' },
        { type: 'heading', value: 'Обработчики жизненного цикла соединения' },
        { type: 'code', language: 'java', value: '@Component\npublic class WebSocketEventListener {\n\n    @EventListener\n    public void handleWebSocketConnectListener(SessionConnectedEvent event) {\n        log.info("Новый клиент подключился");\n    }\n\n    @EventListener\n    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {\n        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());\n        String username = (String) headerAccessor.getSessionAttributes().get("username");\n        if (username != null) {\n            log.info("Пользователь отключился: {}", username);\n            ChatMessage message = new ChatMessage(ChatMessage.MessageType.LEAVE, username + " покинул чат", "System");\n            messagingTemplate.convertAndSend("/topic/public", message);\n        }\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'WebSocket Security',
      type: 'theory',
      content: [
        { type: 'text', value: 'WebSocket соединения нужно защищать так же, как HTTP эндпоинты. Spring Security поддерживает авторизацию STOMP сообщений.' },
        { type: 'heading', value: 'Настройка безопасности WebSocket' },
        { type: 'code', language: 'java', value: 'import org.springframework.security.messaging.access.intercept.MessageSecurityMetadataSourceRegistry;\nimport org.springframework.security.messaging.web.csrf.CsrfChannelInterceptor;\n\n@Configuration\npublic class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {\n\n    @Override\n    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {\n        messages\n            .simpDestMatchers("/app/**").authenticated()  // только аутентифицированные\n            .simpSubscribeDestMatchers("/topic/public").permitAll()  // публичные топики\n            .simpSubscribeDestMatchers("/user/**").authenticated()   // личные топики\n            .anyMessage().authenticated();\n    }\n\n    @Override\n    protected boolean sameOriginDisabled() {\n        return true;  // отключить CSRF для WebSocket\n    }\n}' },
        { type: 'tip', value: 'Для передачи JWT через WebSocket: клиент передаёт токен как query-параметр при подключении (?token=...) или в STOMP заголовке CONNECT.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: чат с приватными сообщениями',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте WebSocket чат с публичными и приватными сообщениями. Сервер должен уведомлять всех о подключении/отключении пользователей.',
      requirements: [
        'Настрой WebSocketConfig с эндпоинтом /ws и SockJS',
        'Создай ChatMessage с полями: type (CHAT/JOIN/LEAVE), content, sender, timestamp',
        'Реализуй /app/chat.send -> /topic/public для публичных сообщений',
        'Реализуй /app/chat.private -> /user/queue/private для личных сообщений',
        'Добавь WebSocketEventListener для событий подключения/отключения',
        'При отключении отправляй LEAVE сообщение в /topic/public'
      ],
      hint: 'Для приватных сообщений используй messagingTemplate.convertAndSendToUser(recipient, "/queue/private", message). Клиент должен подписаться на /user/queue/private.',
      expectedOutput: 'Сервер запускается на порту 8080. WebSocket endpoint: ws://localhost:8080/ws\n\nПодключение первого клиента (Алибек):\nINFO  WebSocketEventListener: Новый клиент подключился\n\nПодключение второго клиента (Дана):\nINFO  WebSocketEventListener: Новый клиент подключился\n\nАлибек отправляет сообщение в /app/chat.send:\n{\n  "type": "CHAT",\n  "content": "Привет всем!",\n  "sender": "Алибек",\n  "timestamp": "2026-03-21T10:00:00"\n}\nВсе подписчики /topic/public получают это сообщение.\n\nАлибек отправляет приватное в /app/chat.private (recipient: "Дана"):\nТолько Дана получает сообщение на /user/queue/private.\n\nАлибек отключается:\nINFO  Пользователь отключился: Алибек\nВсе получают на /topic/public: {"type":"LEAVE","content":"Алибек вышел","sender":"System"}',
      solution: '@Configuration @EnableWebSocketMessageBroker\npublic class WebSocketConfig implements WebSocketMessageBrokerConfigurer {\n    public void configureMessageBroker(MessageBrokerRegistry config) {\n        config.enableSimpleBroker("/topic", "/queue");\n        config.setApplicationDestinationPrefixes("/app");\n        config.setUserDestinationPrefix("/user");\n    }\n    public void registerStompEndpoints(StompEndpointRegistry registry) {\n        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();\n    }\n}\n\n@Controller\npublic class ChatController {\n    @Autowired SimpMessagingTemplate template;\n\n    @MessageMapping("/chat.send")\n    @SendTo("/topic/public")\n    public ChatMessage send(@Payload ChatMessage msg, Principal p) {\n        msg.setSender(p.getName()); msg.setTimestamp(LocalDateTime.now()); return msg;\n    }\n\n    @MessageMapping("/chat.private")\n    public void sendPrivate(@Payload ChatMessage msg, Principal p) {\n        msg.setSender(p.getName()); msg.setTimestamp(LocalDateTime.now());\n        template.convertAndSendToUser(msg.getRecipient(), "/queue/private", msg);\n    }\n}\n\n@Component\npublic class WsEventListener {\n    @Autowired SimpMessagingTemplate template;\n\n    @EventListener\n    public void onDisconnect(SessionDisconnectEvent event) {\n        String user = (String) StompHeaderAccessor.wrap(event.getMessage())\n            .getSessionAttributes().get("username");\n        if (user != null) template.convertAndSend("/topic/public",\n            new ChatMessage(ChatMessage.MessageType.LEAVE, user + " вышел", "System"));\n    }\n}',
      explanation: 'SimpMessagingTemplate.convertAndSendToUser() использует префикс /user для маршрутизации личных сообщений. Клиент должен подписаться на /user/queue/private — Spring автоматически добавит id сессии для уникальности.'
    }
  ]
}
