export default {
  id: 22,
  title: 'Тестирование микросервисов',
  description: 'Стратегии тестирования: unit, integration, contract testing (Pact), E2E, тестирование с TestContainers, тестовые дублёры.',
  lessons: [
    {
      id: 1,
      title: 'Пирамида тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах тестирование сложнее: нужно тестировать не только код, но и взаимодействие между сервисами. Тестовая пирамида адаптирована: Unit -> Integration -> Contract -> E2E.' },
        { type: 'code', language: 'bash', value: '# Тестовая пирамида для микросервисов:\n#\n#        /\\      E2E Tests (мало, медленные, хрупкие)\n#       /  \\     Несколько сценариев через весь стек\n#      /    \\\n#     /------\\   Contract Tests (средне)\n#    / Pact   \\  Проверка контрактов между сервисами\n#   /----------\\\n#  / Integration \\  Интеграционные (средне)\n# / TestContainers\\  Сервис + БД + Kafka (реальные)\n#/------------------\\\n# Unit Tests (много, быстрые, надёжные)\n# Бизнес-логика, валидация, маппинг\n\n# Количество тестов:\n# Unit:        70% — быстрые, изолированные\n# Integration: 20% — с реальной БД, Kafka (TestContainers)\n# Contract:    8%  — проверка API контрактов\n# E2E:         2%  — основные пользовательские сценарии' },
        { type: 'tip', value: 'Contract Tests — ключевое отличие от монолита. Они заменяют часть интеграционных тестов, проверяя что API сервиса соответствует ожиданиям потребителей. Быстрее и надёжнее E2E.' }
      ]
    },
    {
      id: 2,
      title: 'Unit и Integration тесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Unit-тесты проверяют бизнес-логику в изоляции. Integration-тесты проверяют взаимодействие с БД, Kafka, Redis через TestContainers — реальные контейнеры, запущенные в Docker.' },
        { type: 'code', language: 'java', value: '// Unit Test — бизнес-логика\n@ExtendWith(MockitoExtension.class)\nclass OrderServiceTest {\n\n    @Mock OrderRepository orderRepository;\n    @Mock UserServiceClient userServiceClient;\n    @Mock KafkaTemplate<String, Object> kafkaTemplate;\n    @InjectMocks OrderService orderService;\n\n    @Test\n    void shouldCreateOrder() {\n        // Given\n        var request = new CreateOrderRequest(UUID.randomUUID(),\n            List.of(new OrderItemDto(UUID.randomUUID(), 2, BigDecimal.TEN)));\n        when(userServiceClient.getUser(any())).thenReturn(new UserResponse("John"));\n        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));\n\n        // When\n        Order order = orderService.createOrder(request);\n\n        // Then\n        assertThat(order.getStatus()).isEqualTo(OrderStatus.CREATED);\n        assertThat(order.getTotalAmount()).isEqualByComparingTo("20.00");\n        verify(kafkaTemplate).send(eq("order-events"), anyString(), any());\n    }\n\n    @Test\n    void shouldFailWhenUserNotFound() {\n        when(userServiceClient.getUser(any())).thenThrow(\n            new UserNotFoundException(UUID.randomUUID()));\n\n        assertThatThrownBy(() -> orderService.createOrder(request))\n            .isInstanceOf(UserNotFoundException.class);\n    }\n}\n\n// Integration Test с TestContainers\n@SpringBootTest\n@Testcontainers\nclass OrderRepositoryIntegrationTest {\n\n    @Container\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine\")\n        .withDatabaseName(\"orders_test\")\n        .withUsername(\"test\")\n        .withPassword(\"test\");\n\n    @DynamicPropertySource\n    static void properties(DynamicPropertyRegistry registry) {\n        registry.add(\"spring.datasource.url\", postgres::getJdbcUrl);\n        registry.add(\"spring.datasource.username\", postgres::getUsername);\n        registry.add(\"spring.datasource.password\", postgres::getPassword);\n    }\n\n    @Autowired OrderRepository orderRepository;\n\n    @Test\n    void shouldSaveAndFindOrder() {\n        Order order = new Order(UUID.randomUUID(), OrderStatus.CREATED);\n        orderRepository.save(order);\n\n        Optional<Order> found = orderRepository.findById(order.getId());\n        assertThat(found).isPresent();\n        assertThat(found.get().getStatus()).isEqualTo(OrderStatus.CREATED);\n    }\n}' },
        { type: 'note', value: 'TestContainers запускает реальные Docker-контейнеры (PostgreSQL, Kafka, Redis) для тестов. Это надёжнее чем in-memory базы (H2) потому что тестируете с тем же движком что в production.' }
      ]
    },
    {
      id: 3,
      title: 'Contract Testing с Pact',
      type: 'theory',
      content: [
        { type: 'text', value: 'Contract Testing проверяет что API producer-а соответствует ожиданиям consumer-а. Pact — фреймворк для consumer-driven contract testing. Consumer определяет контракт, producer подтверждает.' },
        { type: 'code', language: 'java', value: '// Consumer Test (Order Service — потребитель User Service)\n@ExtendWith(PactConsumerTestExt.class)\n@PactTestFor(providerName = "user-service\", port = \"8081\")\nclass UserServiceConsumerPactTest {\n\n    @Pact(consumer = \"order-service\")\n    public V4Pact getUserPact(PactDslWithProvider builder) {\n        return builder\n            .given(\"user with id 123 exists\")\n            .uponReceiving(\"get user by id\")\n                .path(\"/api/v1/users/123\")\n                .method(\"GET\")\n            .willRespondWith()\n                .status(200)\n                .body(newJsonBody(body -> {\n                    body.stringType(\"id\", \"123\");\n                    body.stringType(\"name\", \"John Doe\");\n                    body.stringType(\"email\", \"john@example.com\");\n                }).build())\n            .toPact(V4Pact.class);\n    }\n\n    @Test\n    @PactTestFor(pactMethod = \"getUserPact\")\n    void shouldGetUser(MockServer mockServer) {\n        // Pact создаёт mock server с описанным контрактом\n        UserServiceClient client = new UserServiceClient(\n            RestClient.builder().baseUrl(mockServer.getUrl()).build());\n\n        UserResponse user = client.getUser(UUID.fromString(\"123\"));\n\n        assertThat(user.name()).isEqualTo(\"John Doe\");\n        assertThat(user.email()).isEqualTo(\"john@example.com\");\n    }\n}\n\n// Provider Test (User Service — провайдер)\n@Provider(\"user-service\")\n@PactBroker(url = \"http://pact-broker:9292\")\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass UserServiceProviderPactTest {\n\n    @TestTemplate\n    @ExtendWith(PactVerificationSpringProvider.class)\n    void pactVerificationTestTemplate(PactVerificationContext context) {\n        context.verifyInteraction();\n    }\n\n    @State(\"user with id 123 exists\")\n    void userExists() {\n        // Подготовка данных для провайдера\n        userRepository.save(new User(\"123\", \"John Doe\", \"john@example.com\"));\n    }\n}' },
        { type: 'list', value: [
          'Consumer генерирует pact-файл (контракт) и публикует в Pact Broker',
          'Provider скачивает контракты и проверяет что его API соответствует',
          'Если Provider меняет API — тесты consumer-ов падают',
          'Если Consumer ожидает несуществующее поле — тест provider-а падает',
          'Контракт = документация API, всегда актуальная'
        ] },
        { type: 'warning', value: 'Contract Testing НЕ заменяет integration тесты. Pact проверяет формат API (поля, типы), но не бизнес-логику. Integration тесты проверяют что данные корректно обрабатываются.' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование Kafka и событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование асинхронного взаимодействия через Kafka: EmbeddedKafka для интеграционных тестов, проверка что события корректно публикуются и обрабатываются.' },
        { type: 'code', language: 'java', value: '// Integration Test с Kafka (TestContainers)\n@SpringBootTest\n@Testcontainers\nclass OrderEventPublisherTest {\n\n    @Container\n    static KafkaContainer kafka = new KafkaContainer(\n        DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));\n\n    @DynamicPropertySource\n    static void kafkaProperties(DynamicPropertyRegistry registry) {\n        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);\n    }\n\n    @Autowired OrderService orderService;\n    @Autowired KafkaTemplate<String, Object> kafkaTemplate;\n\n    @Test\n    void shouldPublishOrderCreatedEvent() {\n        // Создаём consumer для проверки\n        Map<String, Object> props = Map.of(\n            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafka.getBootstrapServers(),\n            ConsumerConfig.GROUP_ID_CONFIG, "test-group",\n            ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest\");\n        var consumer = new KafkaConsumer<>(props,\n            new StringDeserializer(), new JsonDeserializer<>(OrderCreatedEvent.class));\n        consumer.subscribe(List.of(\"order-events\"));\n\n        // Создаём заказ\n        orderService.createOrder(new CreateOrderRequest(\n            UUID.randomUUID(), List.of(new OrderItemDto(UUID.randomUUID(), 1, BigDecimal.TEN))));\n\n        // Проверяем что событие опубликовано\n        ConsumerRecords<String, OrderCreatedEvent> records =\n            consumer.poll(Duration.ofSeconds(10));\n\n        assertThat(records).hasSize(1);\n        OrderCreatedEvent event = records.iterator().next().value();\n        assertThat(event.totalAmount()).isEqualByComparingTo(\"10.00\");\n    }\n}\n\n// Unit Test для Event Handler\n@ExtendWith(MockitoExtension.class)\nclass PaymentEventHandlerTest {\n\n    @Mock PaymentService paymentService;\n    @InjectMocks PaymentEventHandler handler;\n\n    @Test\n    void shouldProcessOrderCreatedEvent() {\n        var event = new OrderCreatedEvent(\n            UUID.randomUUID(), UUID.randomUUID(),\n            BigDecimal.valueOf(100), Instant.now());\n\n        handler.handleOrderCreated(event);\n\n        verify(paymentService).processPayment(\n            event.orderId(), event.totalAmount());\n    }\n}' },
        { type: 'tip', value: 'Для быстрых тестов используйте @EmbeddedKafka из spring-kafka-test. Для продакшен-подобных — KafkaContainer из TestContainers. EmbeddedKafka быстрее, TestContainers надёжнее.' }
      ]
    },
    {
      id: 5,
      title: 'E2E тестирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'E2E (End-to-End) тесты проверяют полный пользовательский сценарий через все сервисы. Сложные и медленные, но незаменимы для проверки критических бизнес-потоков.' },
        { type: 'code', language: 'java', value: '// E2E Test — полный flow через все сервисы\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)\n@Testcontainers\nclass OrderFlowE2ETest {\n\n    @Container static DockerComposeContainer<?> environment =\n        new DockerComposeContainer<>(new File("docker-compose-test.yml\"))\n            .withExposedService(\"user-service\", 8080,\n                Wait.forHttp(\"/actuator/health\").forStatusCode(200))\n            .withExposedService(\"order-service\", 8080,\n                Wait.forHttp(\"/actuator/health\").forStatusCode(200))\n            .withExposedService(\"payment-service\", 8080,\n                Wait.forHttp(\"/actuator/health\").forStatusCode(200));\n\n    @Test\n    void shouldCreateOrderAndProcessPayment() {\n        String orderServiceUrl = String.format(\"http://%s:%d\",\n            environment.getServiceHost(\"order-service\", 8080),\n            environment.getServicePort(\"order-service\", 8080));\n\n        RestClient client = RestClient.builder()\n            .baseUrl(orderServiceUrl).build();\n\n        // 1. Создаём заказ\n        OrderResponse order = client.post()\n            .uri(\"/api/v1/orders\")\n            .body(new CreateOrderRequest(UUID.randomUUID(),\n                List.of(new OrderItemDto(UUID.randomUUID(), 1, BigDecimal.TEN))))\n            .retrieve()\n            .body(OrderResponse.class);\n\n        assertThat(order.status()).isEqualTo(\"CREATED\");\n\n        // 2. Ждём обработки (async)\n        Awaitility.await()\n            .atMost(Duration.ofSeconds(30))\n            .pollInterval(Duration.ofSeconds(2))\n            .until(() -> {\n                OrderResponse updated = client.get()\n                    .uri(\"/api/v1/orders/{id}\", order.id())\n                    .retrieve()\n                    .body(OrderResponse.class);\n                return \"CONFIRMED\".equals(updated.status());\n            });\n    }\n}' },
        { type: 'warning', value: 'E2E тесты хрупкие и медленные. Запускайте их отдельно от unit/integration тестов (например, nightly build). Держите минимум E2E — только критические бизнес-сценарии (happy path + основные ошибки).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тестирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для Order Service: unit, integration, contract, E2E.',
      requirements: [
        'Напишите unit тесты для OrderService с моками зависимостей',
        'Напишите integration тест с TestContainers (PostgreSQL + Kafka)',
        'Создайте Consumer Pact тест для User Service API',
        'Создайте Provider Pact тест для Order Service API',
        'Напишите тест публикации Kafka событий',
        'Создайте E2E тест полного flow заказа'
      ],
      hint: 'Unit: Mockito для моков, AssertJ для assertions. Integration: @Testcontainers + PostgreSQLContainer + KafkaContainer. Contract: pact-jvm-consumer-junit5 + pact-jvm-provider-spring. E2E: DockerComposeContainer + Awaitility.',
      expectedOutput: 'Unit Tests: 15 тестов, 100% бизнес-логики покрыто (1 сек).\nIntegration Tests: 5 тестов с PostgreSQL + Kafka (15 сек).\nContract Tests: 3 consumer pacts, 3 provider verifications (5 сек).\nE2E: 1 полный flow тест (45 сек).\nОбщее покрытие: 85% (80% unit + integration, 5% contract/E2E).\nВсе тесты зелёные, Pact Broker содержит актуальные контракты.',
      solution: '// Unit Test\n@Test\nvoid shouldCreateOrder() {\n    when(userClient.getUser(any())).thenReturn(new UserResponse("John"));\n    when(orderRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));\n    Order order = orderService.createOrder(request);\n    assertThat(order.getStatus()).isEqualTo(OrderStatus.CREATED);\n    verify(kafkaTemplate).send(eq("order-events"), any(), any());\n}\n\n// Integration Test\n@SpringBootTest\n@Testcontainers\nclass OrderIntegrationTest {\n    @Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");\n    @Container static KafkaContainer kafka = new KafkaContainer(...);\n    @DynamicPropertySource\n    static void props(DynamicPropertyRegistry r) {\n        r.add("spring.datasource.url", pg::getJdbcUrl);\n        r.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);\n    }\n    @Test void shouldSaveOrderToDb() { ... }\n}\n\n// Contract Test\n@Pact(consumer = "order-service")\npublic V4Pact getUserPact(PactDslWithProvider builder) {\n    return builder.given("user exists").uponReceiving("get user")\n        .path("/api/v1/users/123").willRespondWith().status(200)\n        .body(newJsonBody(b -> b.stringType("name", "John"))).toPact();\n}',
      explanation: 'Тестирование микросервисов многоуровневое: unit тесты для быстрой проверки логики, integration для реального взаимодействия с инфраструктурой, contract для проверки API между сервисами, E2E для критических сценариев. TestContainers обеспечивает реалистичное окружение. Pact гарантирует совместимость API.'
    }
  ]
}
