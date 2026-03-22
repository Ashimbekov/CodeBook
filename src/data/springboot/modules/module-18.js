export default {
  id: 18,
  title: 'Unit тесты: @SpringBootTest и MockMvc',
  description: 'Написание unit и интеграционных тестов в Spring Boot с использованием @SpringBootTest, MockMvc, @WebMvcTest и JUnit 5',
  lessons: [
    {
      id: 1,
      title: 'Введение в тестирование Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование — обязательная часть профессиональной разработки. Spring Boot предоставляет мощный инструментарий для тестирования: @SpringBootTest загружает весь контекст приложения, @WebMvcTest — только слой контроллеров, а MockMvc позволяет эмулировать HTTP-запросы без реального сервера.' },
        { type: 'tip', value: 'Пирамида тестирования: снизу — много быстрых unit-тестов, в середине — интеграционные тесты, сверху — мало медленных e2e тестов. Spring Boot охватывает все уровни.' },
        { type: 'heading', value: 'Зависимости для тестирования' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-test</artifactId>\n    <scope>test</scope>\n</dependency>\n<!-- Включает: JUnit 5, Mockito, AssertJ, MockMvc -->' },
        { type: 'heading', value: 'Структура тестового класса' },
        { type: 'code', language: 'java', value: 'import org.junit.jupiter.api.Test;\nimport org.springframework.boot.test.context.SpringBootTest;\nimport static org.assertj.core.api.Assertions.assertThat;\n\n@SpringBootTest\nclass ApplicationTests {\n\n    @Test\n    void contextLoads() {\n        // Просто проверяет, что контекст загружается без ошибок\n    }\n\n    @Test\n    void simpleAssertionExample() {\n        int result = 2 + 2;\n        assertThat(result).isEqualTo(4);\n    }\n}' },
        { type: 'warning', value: '@SpringBootTest загружает весь ApplicationContext — это медленно. Для тестов контроллеров используй @WebMvcTest, для сервисов — Mockito без Spring.' }
      ]
    },
    {
      id: 2,
      title: 'Unit тесты сервисного слоя с Mockito',
      type: 'theory',
      content: [
        { type: 'text', value: 'Unit тесты проверяют один класс изолированно. Зависимости заменяются «моками» — объектами, которые имитируют поведение реальных зависимостей. Mockito — стандартный фреймворк для создания моков в Java.' },
        { type: 'heading', value: 'Мокирование зависимостей' },
        { type: 'code', language: 'java', value: 'import org.junit.jupiter.api.Test;\nimport org.junit.jupiter.api.extension.ExtendWith;\nimport org.mockito.InjectMocks;\nimport org.mockito.Mock;\nimport org.mockito.junit.jupiter.MockitoExtension;\nimport static org.mockito.Mockito.*;\nimport static org.assertj.core.api.Assertions.assertThat;\n\n@ExtendWith(MockitoExtension.class)\nclass UserServiceTest {\n\n    @Mock\n    private UserRepository userRepository;\n\n    @InjectMocks\n    private UserService userService;\n\n    @Test\n    void shouldReturnUserById() {\n        // Arrange\n        User mockUser = new User(1L, "Алибек", "alibek@mail.ru");\n        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));\n\n        // Act\n        User result = userService.findById(1L);\n\n        // Assert\n        assertThat(result.getName()).isEqualTo("Алибек");\n        verify(userRepository, times(1)).findById(1L);\n    }\n}' },
        { type: 'heading', value: 'Паттерн AAA: Arrange-Act-Assert' },
        { type: 'code', language: 'java', value: '@Test\nvoid shouldThrowExceptionWhenUserNotFound() {\n    // Arrange — подготовка\n    when(userRepository.findById(99L)).thenReturn(Optional.empty());\n\n    // Act & Assert — действие и проверка исключения\n    assertThatThrownBy(() -> userService.findById(99L))\n        .isInstanceOf(UserNotFoundException.class)\n        .hasMessage("Пользователь с id 99 не найден");\n}' },
        { type: 'tip', value: 'Паттерн AAA делает тесты читаемыми: Arrange (подготовь данные), Act (выполни действие), Assert (проверь результат). Разделяй секции пустыми строками.' }
      ]
    },
    {
      id: 3,
      title: 'MockMvc: тестирование контроллеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'MockMvc позволяет тестировать контроллеры без запуска HTTP-сервера. Запросы обрабатываются напрямую через DispatcherServlet. Используй @WebMvcTest для загрузки только слоя MVC.' },
        { type: 'heading', value: 'Настройка @WebMvcTest' },
        { type: 'code', language: 'java', value: 'import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.boot.test.mock.mockito.MockBean;\nimport org.springframework.test.web.servlet.MockMvc;\nimport static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;\nimport static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;\n\n@WebMvcTest(UserController.class)\nclass UserControllerTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @MockBean\n    private UserService userService;\n\n    @Test\n    void shouldReturnAllUsers() throws Exception {\n        List<User> users = List.of(\n            new User(1L, "Алибек", "alibek@mail.ru"),\n            new User(2L, "Дана", "dana@mail.ru")\n        );\n        when(userService.findAll()).thenReturn(users);\n\n        mockMvc.perform(get("/api/users"))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.length()").value(2))\n            .andExpect(jsonPath("$[0].name").value("Алибек"));\n    }\n}' },
        { type: 'heading', value: 'Тестирование POST запроса' },
        { type: 'code', language: 'java', value: '@Test\nvoid shouldCreateUser() throws Exception {\n    UserRequest request = new UserRequest("Нурлан", "nurlan@mail.ru");\n    User created = new User(3L, "Нурлан", "nurlan@mail.ru");\n    when(userService.create(any())).thenReturn(created);\n\n    mockMvc.perform(post("/api/users")\n            .contentType(MediaType.APPLICATION_JSON)\n            .content(objectMapper.writeValueAsString(request)))\n        .andExpect(status().isCreated())\n        .andExpect(jsonPath("$.id").value(3))\n        .andExpect(jsonPath("$.name").value("Нурлан"));\n}' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование исключений и валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Важно тестировать не только «счастливый путь», но и обработку ошибок: что происходит при неверных данных, несуществующих ресурсах и нарушении бизнес-правил.' },
        { type: 'heading', value: 'Тест 404 ответа' },
        { type: 'code', language: 'java', value: '@Test\nvoid shouldReturn404WhenUserNotFound() throws Exception {\n    when(userService.findById(99L))\n        .thenThrow(new UserNotFoundException("Не найден"));\n\n    mockMvc.perform(get("/api/users/99"))\n        .andExpect(status().isNotFound())\n        .andExpect(jsonPath("$.message").value("Не найден"));\n}' },
        { type: 'heading', value: 'Тест валидации входных данных' },
        { type: 'code', language: 'java', value: '@Test\nvoid shouldReturn400WhenEmailIsInvalid() throws Exception {\n    String invalidJson = "{\"name\": \"\", \"email\": \"не-email\"}";\n\n    mockMvc.perform(post("/api/users")\n            .contentType(MediaType.APPLICATION_JSON)\n            .content(invalidJson))\n        .andExpect(status().isBadRequest())\n        .andExpect(jsonPath("$.errors").isArray());\n}' },
        { type: 'heading', value: 'andDo(print()) для отладки' },
        { type: 'code', language: 'java', value: 'import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;\n\n// Выводит полный запрос и ответ в консоль — удобно при отладке\nmockMvc.perform(get("/api/users/1"))\n    .andDo(print())\n    .andExpect(status().isOk());' },
        { type: 'tip', value: 'Добавляй .andDo(print()) только при отладке теста. Убирай его из финальной версии, чтобы не засорять вывод.' }
      ]
    },
    {
      id: 5,
      title: '@SpringBootTest с реальным контекстом',
      type: 'theory',
      content: [
        { type: 'text', value: '@SpringBootTest загружает полный контекст Spring. Используй его когда нужно проверить взаимодействие нескольких слоёв. Можно запустить настоящий сервер или использовать MockMvc поверх него.' },
        { type: 'heading', value: 'Режимы @SpringBootTest' },
        { type: 'code', language: 'java', value: '// Без сервера (самый быстрый для MockMvc)\n@SpringBootTest\n@AutoConfigureMockMvc\nclass FullContextTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @Test\n    void fullIntegrationTest() throws Exception {\n        mockMvc.perform(get("/api/health"))\n            .andExpect(status().isOk());\n    }\n}\n\n// С реальным сервером на случайном порту\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass RealServerTest {\n\n    @Autowired\n    private TestRestTemplate restTemplate;\n\n    @Test\n    void testWithRealHttp() {\n        ResponseEntity<String> response = restTemplate.getForEntity("/api/health", String.class);\n        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);\n    }\n}' },
        { type: 'heading', value: 'TestRestTemplate vs RestTemplate' },
        { type: 'code', language: 'java', value: '@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\nclass RestTemplateTest {\n\n    @Autowired\n    private TestRestTemplate restTemplate;\n\n    @Test\n    void createAndGetUser() {\n        // POST\n        UserRequest request = new UserRequest("Айгерим", "aigul@mail.ru");\n        ResponseEntity<User> created = restTemplate.postForEntity(\n            "/api/users", request, User.class);\n        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n\n        // GET\n        Long id = created.getBody().getId();\n        User found = restTemplate.getForObject("/api/users/" + id, User.class);\n        assertThat(found.getName()).isEqualTo("Айгерим");\n    }\n}' },
        { type: 'warning', value: '@SpringBootTest медленно запускается, так как поднимает весь контекст и (опционально) базу данных. Используй его только для реальных интеграционных проверок.' }
      ]
    },
    {
      id: 6,
      title: 'Параметризованные тесты и @BeforeEach',
      type: 'theory',
      content: [
        { type: 'text', value: 'JUnit 5 поддерживает параметризованные тесты — один метод запускается с разными входными данными. @BeforeEach позволяет вынести повторяющуюся подготовку в отдельный метод.' },
        { type: 'heading', value: '@BeforeEach и @AfterEach' },
        { type: 'code', language: 'java', value: '@ExtendWith(MockitoExtension.class)\nclass ProductServiceTest {\n\n    @Mock\n    private ProductRepository repository;\n\n    @InjectMocks\n    private ProductService service;\n\n    private Product sampleProduct;\n\n    @BeforeEach\n    void setUp() {\n        sampleProduct = new Product(1L, "Ноутбук", 150000.0);\n    }\n\n    @AfterEach\n    void tearDown() {\n        // Очистка после каждого теста, если нужно\n    }\n\n    @Test\n    void findByIdShouldReturnProduct() {\n        when(repository.findById(1L)).thenReturn(Optional.of(sampleProduct));\n        Product result = service.findById(1L);\n        assertThat(result.getName()).isEqualTo("Ноутбук");\n    }\n}' },
        { type: 'heading', value: 'Параметризованные тесты' },
        { type: 'code', language: 'java', value: 'import org.junit.jupiter.params.ParameterizedTest;\nimport org.junit.jupiter.params.provider.ValueSource;\nimport org.junit.jupiter.params.provider.CsvSource;\n\nclass EmailValidatorTest {\n\n    private final EmailValidator validator = new EmailValidator();\n\n    @ParameterizedTest\n    @ValueSource(strings = {"user@mail.ru", "admin@example.com", "test+tag@domain.org"})\n    void validEmailsShouldPass(String email) {\n        assertThat(validator.isValid(email)).isTrue();\n    }\n\n    @ParameterizedTest\n    @CsvSource({\n        "alice@mail.ru, true",\n        "not-an-email, false",\n        "@nodomain.com, false",\n        "noatsign.com, false"\n    })\n    void emailValidationWithExpectedResult(String email, boolean expected) {\n        assertThat(validator.isValid(email)).isEqualTo(expected);\n    }\n}' },
        { type: 'tip', value: 'Параметризованные тесты отлично подходят для тестирования граничных случаев и эквивалентных классов данных.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: написать тесты для UserController',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для UserController, включая успешные сценарии и сценарии с ошибками, используя @WebMvcTest и MockMvc.',
      requirements: [
        'Используй @WebMvcTest(UserController.class)',
        'Замокируй UserService через @MockBean',
        'Напиши тест GET /api/users — возвращает список',
        'Напиши тест GET /api/users/{id} — находит пользователя',
        'Напиши тест GET /api/users/{id} — возвращает 404 когда не найден',
        'Напиши тест POST /api/users — создаёт пользователя и возвращает 201',
        'Напиши тест DELETE /api/users/{id} — удаляет и возвращает 204'
      ],
      hint: 'Используй jsonPath("$[0].name") для проверки полей в JSON. Для 204 No Content не нужно проверять тело ответа.',
      expectedOutput: 'Все 5 тестов выполнены успешно:\n\nUserControllerTest > getAllUsers_shouldReturn200WithList() PASSED\nUserControllerTest > getUserById_shouldReturn200() PASSED\nUserControllerTest > getUserById_shouldReturn404() PASSED\nUserControllerTest > createUser_shouldReturn201() PASSED\nUserControllerTest > deleteUser_shouldReturn204() PASSED\n\nTests run: 5, Failures: 0, Errors: 0, Skipped: 0\n\nGET /api/users — статус 200, тело: [{\"id\":1,\"name\":\"Алибек\",\"email\":\"a@mail.ru\"}]\nGET /api/users/1 — статус 200, поле name: \"Алибек\"\nGET /api/users/99 — статус 404\nPOST /api/users — статус 201, поле id: 2\nDELETE /api/users/1 — статус 204, тело отсутствует',
      solution: '@WebMvcTest(UserController.class)\nclass UserControllerTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @Autowired\n    private ObjectMapper objectMapper;\n\n    @MockBean\n    private UserService userService;\n\n    @Test\n    void getAllUsers_shouldReturn200WithList() throws Exception {\n        when(userService.findAll()).thenReturn(\n            List.of(new User(1L, "Алибек", "a@mail.ru")));\n\n        mockMvc.perform(get("/api/users"))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.length()").value(1));\n    }\n\n    @Test\n    void getUserById_shouldReturn200() throws Exception {\n        when(userService.findById(1L)).thenReturn(new User(1L, "Алибек", "a@mail.ru"));\n\n        mockMvc.perform(get("/api/users/1"))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.name").value("Алибек"));\n    }\n\n    @Test\n    void getUserById_shouldReturn404() throws Exception {\n        when(userService.findById(99L)).thenThrow(new UserNotFoundException("Not found"));\n\n        mockMvc.perform(get("/api/users/99"))\n            .andExpect(status().isNotFound());\n    }\n\n    @Test\n    void createUser_shouldReturn201() throws Exception {\n        UserRequest req = new UserRequest("Дана", "dana@mail.ru");\n        when(userService.create(any())).thenReturn(new User(2L, "Дана", "dana@mail.ru"));\n\n        mockMvc.perform(post("/api/users")\n                .contentType(MediaType.APPLICATION_JSON)\n                .content(objectMapper.writeValueAsString(req)))\n            .andExpect(status().isCreated())\n            .andExpect(jsonPath("$.id").value(2));\n    }\n\n    @Test\n    void deleteUser_shouldReturn204() throws Exception {\n        doNothing().when(userService).delete(1L);\n\n        mockMvc.perform(delete("/api/users/1"))\n            .andExpect(status().isNoContent());\n    }\n}',
      explanation: '@WebMvcTest загружает только слой контроллеров, поэтому сервис нужно мокировать через @MockBean. MockMvc позволяет проверять статусы, заголовки и тело ответа без запуска сервера.'
    }
  ]
}
