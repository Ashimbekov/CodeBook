export default {
  id: 19,
  title: 'Интеграционные тесты с Testcontainers',
  description: 'Написание реальных интеграционных тестов с использованием Testcontainers для запуска PostgreSQL, Redis и других сервисов в Docker-контейнерах прямо в тестах',
  lessons: [
    {
      id: 1,
      title: 'Введение в Testcontainers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Testcontainers — библиотека для запуска Docker-контейнеров прямо из Java-кода во время тестов. Вместо H2 в памяти ты тестируешь с настоящей PostgreSQL. Это устраняет проблему "у меня работает, в CI — нет".' },
        { type: 'tip', value: 'Testcontainers запускает реальный PostgreSQL в Docker, создаёт схему, прогоняет тесты и удаляет контейнер. Тест видит настоящую БД, а не эмулятор.' },
        { type: 'heading', value: 'Зависимости Maven' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-testcontainers</artifactId>\n    <scope>test</scope>\n</dependency>\n<dependency>\n    <groupId>org.testcontainers</groupId>\n    <artifactId>junit-jupiter</artifactId>\n    <scope>test</scope>\n</dependency>\n<dependency>\n    <groupId>org.testcontainers</groupId>\n    <artifactId>postgresql</artifactId>\n    <scope>test</scope>\n</dependency>' },
        { type: 'heading', value: 'Первый тест с PostgreSQL' },
        { type: 'code', language: 'java', value: 'import org.testcontainers.containers.PostgreSQLContainer;\nimport org.testcontainers.junit.jupiter.Container;\nimport org.testcontainers.junit.jupiter.Testcontainers;\n\n@SpringBootTest\n@Testcontainers\nclass UserRepositoryIT {\n\n    @Container\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")\n        .withDatabaseName("testdb")\n        .withUsername("test")\n        .withPassword("test");\n\n    @DynamicPropertySource\n    static void configureProperties(DynamicPropertyRegistry registry) {\n        registry.add("spring.datasource.url", postgres::getJdbcUrl);\n        registry.add("spring.datasource.username", postgres::getUsername);\n        registry.add("spring.datasource.password", postgres::getPassword);\n    }\n\n    @Autowired\n    private UserRepository userRepository;\n\n    @Test\n    void shouldSaveAndFindUser() {\n        User user = new User("Алибек", "alibek@mail.ru");\n        User saved = userRepository.save(user);\n\n        Optional<User> found = userRepository.findById(saved.getId());\n        assertThat(found).isPresent();\n        assertThat(found.get().getName()).isEqualTo("Алибек");\n    }\n}' }
      ]
    },
    {
      id: 2,
      title: '@ServiceConnection — автоматическая конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot 3.1+ поддерживает @ServiceConnection — аннотация автоматически настраивает datasource по данным контейнера. Не нужно вручную писать @DynamicPropertySource.' },
        { type: 'heading', value: 'Использование @ServiceConnection' },
        { type: 'code', language: 'java', value: 'import org.springframework.boot.testcontainers.service.connection.ServiceConnection;\n\n@SpringBootTest\n@Testcontainers\nclass ModernIT {\n\n    @Container\n    @ServiceConnection\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n\n    // Spring Boot сам настроит datasource — никаких @DynamicPropertySource!\n\n    @Autowired\n    private ProductRepository productRepository;\n\n    @Test\n    void shouldPersistProduct() {\n        Product p = new Product("Телефон", 80000.0);\n        productRepository.save(p);\n\n        assertThat(productRepository.count()).isEqualTo(1);\n    }\n}' },
        { type: 'heading', value: 'Переиспользование контейнера между тестами' },
        { type: 'code', language: 'java', value: '// static контейнер переиспользуется для всех тестов в классе\n@Container\nstatic PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n\n// Если добавить .withReuse(true) — контейнер не удаляется между тест-запусками\nstatic PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")\n    .withReuse(true);\n// Требует наличия ~/.testcontainers.properties с testcontainers.reuse.enable=true' },
        { type: 'tip', value: 'Объявляй контейнер как static — он создаётся один раз для класса, а не для каждого теста. Это ускоряет тесты в разы.' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование с Redis Testcontainer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме PostgreSQL, Testcontainers поддерживает Redis, Kafka, MongoDB, MySQL и десятки других. Подход одинаковый: объявить контейнер, настроить свойства и писать тесты.' },
        { type: 'heading', value: 'Redis контейнер' },
        { type: 'code', language: 'java', value: 'import org.testcontainers.containers.GenericContainer;\n\n@SpringBootTest\n@Testcontainers\nclass CacheServiceIT {\n\n    @Container\n    static GenericContainer<?> redis = new GenericContainer<>("redis:7")\n        .withExposedPorts(6379);\n\n    @DynamicPropertySource\n    static void configureRedis(DynamicPropertyRegistry registry) {\n        registry.add("spring.data.redis.host", redis::getHost);\n        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));\n    }\n\n    @Autowired\n    private CacheService cacheService;\n\n    @Test\n    void shouldCacheValue() {\n        cacheService.setValue("key1", "hello");\n        String result = cacheService.getValue("key1");\n        assertThat(result).isEqualTo("hello");\n    }\n}' },
        { type: 'heading', value: 'RedisContainer через ServiceConnection' },
        { type: 'code', language: 'java', value: 'import org.testcontainers.containers.GenericContainer;\nimport org.springframework.boot.testcontainers.service.connection.ServiceConnection;\n\n// Для Spring Boot 3.1+ с RedisContainer\n@Container\n@ServiceConnection(name = "redis")\nstatic GenericContainer<?> redis = new GenericContainer<>("redis:7")\n    .withExposedPorts(6379);' }
      ]
    },
    {
      id: 4,
      title: 'Базовый класс для интеграционных тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда много интеграционных тестов, удобно вынести общую конфигурацию в базовый класс. Все тесты наследуют его и получают готовую инфраструктуру.' },
        { type: 'heading', value: 'AbstractIntegrationTest' },
        { type: 'code', language: 'java', value: '@SpringBootTest\n@Testcontainers\npublic abstract class AbstractIntegrationTest {\n\n    @Container\n    @ServiceConnection\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n\n    @Container\n    @ServiceConnection(name = "redis")\n    static GenericContainer<?> redis = new GenericContainer<>("redis:7")\n        .withExposedPorts(6379);\n}\n\n// Конкретный тест\nclass UserServiceIT extends AbstractIntegrationTest {\n\n    @Autowired\n    private UserService userService;\n\n    @Test\n    void shouldRegisterUser() {\n        User user = userService.register("Дана", "dana@mail.ru");\n        assertThat(user.getId()).isNotNull();\n    }\n}' },
        { type: 'heading', value: 'Очистка БД между тестами' },
        { type: 'code', language: 'java', value: '@SpringBootTest\n@Testcontainers\n@Transactional  // откатывает транзакцию после каждого теста\nclass TransactionalIT extends AbstractIntegrationTest {\n\n    @Autowired\n    private UserRepository userRepository;\n\n    @Test\n    void test1() {\n        userRepository.save(new User("Алибек", "a@mail.ru"));\n        assertThat(userRepository.count()).isEqualTo(1);\n        // После теста транзакция откатится — БД чиста\n    }\n\n    @Test\n    void test2() {\n        // Здесь данные из test1 не видны\n        assertThat(userRepository.count()).isEqualTo(0);\n    }\n}' },
        { type: 'tip', value: '@Transactional на тестовом классе автоматически откатывает каждый тест. Это самый простой способ изолировать тесты друг от друга.' }
      ]
    },
    {
      id: 5,
      title: 'Тестирование Repository слоя с @DataJpaTest',
      type: 'theory',
      content: [
        { type: 'text', value: '@DataJpaTest загружает только JPA-слой: репозитории, сущности и конфигурацию. Гораздо быстрее @SpringBootTest. По умолчанию использует H2, но можно подключить Testcontainers.' },
        { type: 'heading', value: '@DataJpaTest + Testcontainers' },
        { type: 'code', language: 'java', value: 'import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;\nimport org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;\n\n@DataJpaTest\n@Testcontainers\n@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)\nclass ProductRepositoryTest {\n\n    @Container\n    @ServiceConnection\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n\n    @Autowired\n    private ProductRepository productRepository;\n\n    @Test\n    void findByNameContaining_shouldReturnMatchingProducts() {\n        productRepository.save(new Product("Ноутбук Dell", 120000.0));\n        productRepository.save(new Product("Ноутбук HP", 100000.0));\n        productRepository.save(new Product("Телефон Samsung", 80000.0));\n\n        List<Product> laptops = productRepository.findByNameContaining("Ноутбук");\n\n        assertThat(laptops).hasSize(2);\n        assertThat(laptops).extracting(Product::getName)\n            .containsExactlyInAnyOrder("Ноутбук Dell", "Ноутбук HP");\n    }\n}' },
        { type: 'warning', value: '@AutoConfigureTestDatabase(replace = NONE) обязателен, иначе Spring заменит реальную DataSource на H2, и Testcontainers не будет использоваться.' }
      ]
    },
    {
      id: 6,
      title: 'Kafka и MongoDB в тестах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Testcontainers поддерживает Kafka для тестирования event-driven систем и MongoDB для тестирования NoSQL репозиториев. Принцип тот же — контейнер в тесте.' },
        { type: 'heading', value: 'Kafka Testcontainer' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.testcontainers</groupId>\n    <artifactId>kafka</artifactId>\n    <scope>test</scope>\n</dependency>' },
        { type: 'code', language: 'java', value: 'import org.testcontainers.kafka.KafkaContainer;\nimport org.testcontainers.utility.DockerImageName;\n\n@SpringBootTest\n@Testcontainers\nclass OrderEventIT {\n\n    @Container\n    @ServiceConnection\n    static KafkaContainer kafka = new KafkaContainer(\n        DockerImageName.parse("confluentinc/cp-kafka:7.4.0"));\n\n    @Autowired\n    private OrderProducer producer;\n\n    @Autowired\n    private OrderEventListener listener;\n\n    @Test\n    void shouldProcessOrderEvent() throws Exception {\n        producer.sendOrder(new OrderEvent(1L, "CREATED"));\n\n        // Ждём обработки\n        await().atMost(5, SECONDS)\n            .until(() -> listener.getLastEvent() != null);\n\n        assertThat(listener.getLastEvent().getOrderId()).isEqualTo(1L);\n    }\n}' },
        { type: 'tip', value: 'Для асинхронных тестов используй библиотеку Awaitility: await().atMost(5, SECONDS).until(condition). Она периодически проверяет условие вместо блокирующего sleep.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: интеграционные тесты для OrderService',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите интеграционные тесты для OrderService, который сохраняет заказы в PostgreSQL и отправляет уведомление в Redis. Используйте Testcontainers для обоих сервисов.',
      requirements: [
        'Создай AbstractIntegrationTest с PostgreSQL и Redis контейнерами через @ServiceConnection',
        'Напиши тест создания заказа — проверь, что он сохраняется в БД',
        'Напиши тест получения заказов пользователя',
        'Напиши тест, что кэш Redis заполняется после запроса заказа',
        'Используй @BeforeEach для очистки данных через repository.deleteAll()',
        'Используй AssertJ для читаемых проверок'
      ],
      hint: 'Для проверки Redis используй StringRedisTemplate и проверяй наличие ключа. Для изоляции тестов удаляй данные в @BeforeEach.',
      expectedOutput: 'Testcontainers запускает контейнеры PostgreSQL и Redis:\n\nStarting postgres container (postgres:15)...\nStarting redis container (redis:7)...\n\nOrderServiceIT > shouldCreateOrder() PASSED\nOrderServiceIT > shouldCacheOrderAfterGet() PASSED\n\nTests run: 2, Failures: 0, Errors: 0, Skipped: 0\n\nshouldCreateOrder: order.getId() != null, orderRepository.count() == 1\nshouldCacheOrderAfterGet: redisTemplate.hasKey("order:1") == true\n\nПосле завершения тестов контейнеры автоматически удаляются.',
      solution: 'public abstract class AbstractIntegrationTest {\n    @Container @ServiceConnection\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n\n    @Container @ServiceConnection(name = "redis")\n    static GenericContainer<?> redis = new GenericContainer<>("redis:7").withExposedPorts(6379);\n}\n\n@SpringBootTest @Testcontainers\nclass OrderServiceIT extends AbstractIntegrationTest {\n\n    @Autowired OrderService orderService;\n    @Autowired OrderRepository orderRepository;\n    @Autowired StringRedisTemplate redisTemplate;\n\n    @BeforeEach\n    void clean() { orderRepository.deleteAll(); }\n\n    @Test\n    void shouldCreateOrder() {\n        Order order = orderService.create(1L, List.of("item1"));\n        assertThat(order.getId()).isNotNull();\n        assertThat(orderRepository.count()).isEqualTo(1);\n    }\n\n    @Test\n    void shouldCacheOrderAfterGet() {\n        Order saved = orderRepository.save(new Order(1L));\n        orderService.findById(saved.getId());\n        assertThat(redisTemplate.hasKey("order:" + saved.getId())).isTrue();\n    }\n}',
      explanation: 'Базовый класс экономит дублирование кода конфигурации контейнеров. @BeforeEach с deleteAll() обеспечивает изоляцию тестов. Redis проверяется через StringRedisTemplate.hasKey() — прямой доступ к хранилищу.'
    }
  ]
}
