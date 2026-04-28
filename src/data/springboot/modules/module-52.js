export default {
  id: 52,
  title: 'Практикум: DTO и MapStruct',
  description: 'Паттерн DTO и маппинг с MapStruct: создание DTO, ручной и автоматический маппинг, вложенные объекты, коллекции, условный маппинг и интеграция с валидацией.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Create и Response DTO',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте раздельные DTO для создания и ответа сущности User, чтобы разделить входные и выходные данные API.',
      requirements: [
        'Entity User: id, firstName, lastName, email, password, role, active, createdAt',
        'CreateUserRequest DTO: firstName, lastName, email, password (без id, role, createdAt)',
        'UserResponse DTO: id, firstName, lastName, email, fullName, role, createdAt (без password)',
        'fullName — вычисляемое поле: firstName + " " + lastName',
        'Использовать Java record для DTO',
        'Валидация на CreateUserRequest: @NotBlank, @Email, @Size(min=8) для password'
      ],
      expectedOutput: 'POST /api/users\nRequest: {"firstName":"Иван","lastName":"Петров","email":"ivan@mail.ru","password":"secret123"}\n\nResponse 201:\n{\n  "id": 1,\n  "firstName": "Иван",\n  "lastName": "Петров",\n  "email": "ivan@mail.ru",\n  "fullName": "Иван Петров",\n  "role": "USER",\n  "createdAt": "2024-01-15T10:30:00"\n}\n\nПоле password НЕ попадает в ответ!',
      hint: 'Java record — идеальный формат для DTO: неизменяемый, с equals/hashCode/toString. Для вычисляемых полей добавьте метод или вычисляйте в фабричном методе.',
      solution: '// Create DTO\npublic record CreateUserRequest(\n    @NotBlank(message = "Имя обязательно")\n    String firstName,\n\n    @NotBlank(message = "Фамилия обязательна")\n    String lastName,\n\n    @NotBlank @Email(message = "Некорректный email")\n    String email,\n\n    @NotBlank @Size(min = 8, message = "Пароль минимум 8 символов")\n    String password\n) {}\n\n// Response DTO\npublic record UserResponse(\n    Long id,\n    String firstName,\n    String lastName,\n    String email,\n    String fullName,\n    String role,\n    LocalDateTime createdAt\n) {\n    public static UserResponse from(User user) {\n        return new UserResponse(\n            user.getId(),\n            user.getFirstName(),\n            user.getLastName(),\n            user.getEmail(),\n            user.getFirstName() + " " + user.getLastName(),\n            user.getRole().name(),\n            user.getCreatedAt()\n        );\n    }\n}\n\n// Controller\n@PostMapping("/api/users")\n@ResponseStatus(HttpStatus.CREATED)\npublic UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {\n    User user = userService.create(request);\n    return UserResponse.from(user);\n}',
      explanation: 'Разделение на Create/Response DTO защищает API: клиент не может задать id, role или createdAt при создании. Password никогда не попадает в ответ. Record-классы гарантируют иммутабельность DTO и генерируют equals/hashCode/toString автоматически.'
    },
    {
      id: 2,
      title: 'Задача: Ручной маппинг Entity ↔ DTO',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте ручной маппинг между Entity и DTO через фабричные методы и утилитные классы.',
      requirements: [
        'Статический метод UserResponse.from(User) для маппинга Entity → DTO',
        'Метод в Service для маппинга CreateUserRequest → User',
        'UserMapper утилитный класс с toEntity() и toResponse()',
        'Маппинг списков: List<User> → List<UserResponse>',
        'Обработка null-значений при маппинге',
        'Маппинг enum: Role enum → String в DTO'
      ],
      expectedOutput: 'UserMapper.toResponse(user):\n{id:1, firstName:"Иван", fullName:"Иван Петров", role:"ADMIN"}\n\nUserMapper.toEntity(createRequest):\nUser{firstName:"Иван", lastName:"Петров", email:"ivan@mail.ru", role:USER}\n\nUserMapper.toResponseList(users):\n[{id:1,...}, {id:2,...}, {id:3,...}]\n\nUserMapper.toResponse(null) → null (не NullPointerException)',
      hint: 'Создайте утилитный класс с приватным конструктором и статическими методами. Для списков используйте Stream.map().',
      solution: 'public final class UserMapper {\n\n    private UserMapper() {} // utility class\n\n    public static UserResponse toResponse(User user) {\n        if (user == null) return null;\n        return new UserResponse(\n            user.getId(),\n            user.getFirstName(),\n            user.getLastName(),\n            user.getEmail(),\n            user.getFirstName() + " " + user.getLastName(),\n            user.getRole() != null ? user.getRole().name() : null,\n            user.getCreatedAt()\n        );\n    }\n\n    public static User toEntity(CreateUserRequest request) {\n        if (request == null) return null;\n        User user = new User();\n        user.setFirstName(request.firstName());\n        user.setLastName(request.lastName());\n        user.setEmail(request.email());\n        user.setPassword(request.password()); // будет захеширован в сервисе\n        user.setRole(Role.USER);\n        user.setActive(true);\n        return user;\n    }\n\n    public static List<UserResponse> toResponseList(List<User> users) {\n        if (users == null) return Collections.emptyList();\n        return users.stream()\n            .map(UserMapper::toResponse)\n            .collect(Collectors.toList());\n    }\n\n    public static Page<UserResponse> toResponsePage(Page<User> users) {\n        return users.map(UserMapper::toResponse);\n    }\n}\n\n// Использование в сервисе\n@Service\npublic class UserService {\n    @Autowired UserRepository repo;\n    @Autowired PasswordEncoder encoder;\n\n    public User create(CreateUserRequest request) {\n        User user = UserMapper.toEntity(request);\n        user.setPassword(encoder.encode(request.password()));\n        return repo.save(user);\n    }\n}',
      explanation: 'Ручной маппинг прост и понятен, но с ростом числа полей становится утомительным. Null-проверки предотвращают NullPointerException. Page.map() удобно преобразует страницы без потери метаданных пагинации. Пароль хешируется в сервисе, а не в маппере.'
    },
    {
      id: 3,
      title: 'Задача: Настройка MapStruct',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подключите MapStruct и создайте первый mapper-интерфейс для автоматического маппинга.',
      requirements: [
        'Добавить зависимости MapStruct в pom.xml (mapstruct + mapstruct-processor)',
        'Настроить maven-compiler-plugin с annotationProcessorPaths',
        'Создать UserMapper интерфейс с @Mapper(componentModel = "spring")',
        'Маппинг User → UserResponse с @Mapping для fullName',
        'Маппинг CreateUserRequest → User с @Mapping(target = "id", ignore = true)',
        'Инжектировать mapper через @Autowired в сервис'
      ],
      expectedOutput: 'При компиляции MapStruct генерирует:\n\n@Component\npublic class UserMapperImpl implements UserMapper {\n    @Override\n    public UserResponse toResponse(User user) {\n        if (user == null) return null;\n        return new UserResponse(\n            user.getId(),\n            user.getFirstName(),\n            user.getLastName(),\n            user.getEmail(),\n            user.getFirstName() + " " + user.getLastName(),\n            ...\n        );\n    }\n}\n\nuserMapper.toResponse(user) → {id:1, fullName:"Иван Петров", ...}',
      hint: 'Для вычисляемых полей используйте @Mapping(target = "fullName", expression = "java(...)"). componentModel = "spring" делает mapper Spring Bean-ом.',
      solution: '<!-- pom.xml -->\n<!--\n<dependency>\n    <groupId>org.mapstruct</groupId>\n    <artifactId>mapstruct</artifactId>\n    <version>1.5.5.Final</version>\n</dependency>\n<dependency>\n    <groupId>org.mapstruct</groupId>\n    <artifactId>mapstruct-processor</artifactId>\n    <version>1.5.5.Final</version>\n    <scope>provided</scope>\n</dependency>\n-->\n\n@Mapper(componentModel = "spring")\npublic interface UserMapper {\n\n    @Mapping(target = "fullName", expression = "java(user.getFirstName() + \\" \\" + user.getLastName())")\n    @Mapping(target = "role", expression = "java(user.getRole().name())")\n    UserResponse toResponse(User user);\n\n    @Mapping(target = "id", ignore = true)\n    @Mapping(target = "role", constant = "USER")\n    @Mapping(target = "active", constant = "true")\n    @Mapping(target = "createdAt", ignore = true)\n    @Mapping(target = "password", ignore = true)\n    User toEntity(CreateUserRequest request);\n\n    List<UserResponse> toResponseList(List<User> users);\n}\n\n// Использование\n@Service\npublic class UserService {\n    @Autowired\n    private UserMapper userMapper;\n\n    public UserResponse createUser(CreateUserRequest request) {\n        User user = userMapper.toEntity(request);\n        user.setPassword(passwordEncoder.encode(request.password()));\n        User saved = userRepository.save(user);\n        return userMapper.toResponse(saved);\n    }\n}',
      explanation: 'MapStruct генерирует код маппинга на этапе компиляции, а не через reflection в runtime — это быстрее. componentModel="spring" создаёт @Component, который можно инжектировать. expression позволяет писать произвольный Java-код. ignore=true пропускает поля, которые не нужно маппить.'
    },
    {
      id: 4,
      title: 'Задача: Nested DTO маппинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте маппинг вложенных объектов: Order с Customer и списком OrderItem.',
      requirements: [
        'OrderResponse содержит CustomerSummary (id, fullName) вместо полного Customer',
        'OrderResponse содержит List<OrderItemResponse> вместо List<OrderItem>',
        'OrderItemResponse содержит ProductSummary (id, name, price) вместо полного Product',
        'MapStruct @Mapper(uses = {CustomerMapper.class, OrderItemMapper.class})',
        'Маппинг вложенного поля: @Mapping(source = "customer.firstName", target = "customerName")',
        'Автоматический маппинг коллекций через uses'
      ],
      expectedOutput: 'orderMapper.toResponse(order):\n{\n  "id": 1,\n  "orderDate": "2024-01-15",\n  "totalAmount": 1599.98,\n  "customer": {\n    "id": 5,\n    "fullName": "Иван Петров"\n  },\n  "items": [\n    {\n      "id": 1,\n      "quantity": 1,\n      "price": 999.99,\n      "product": {"id": 10, "name": "Laptop", "price": 999.99}\n    },\n    {\n      "id": 2,\n      "quantity": 1,\n      "price": 599.99,\n      "product": {"id": 11, "name": "Phone", "price": 599.99}\n    }\n  ]\n}',
      hint: 'uses = {} позволяет MapStruct использовать другие mapper-ы для вложенных типов. MapStruct автоматически маппит List<OrderItem> в List<OrderItemResponse> если OrderItemMapper определён.',
      solution: '@Mapper(componentModel = "spring")\npublic interface CustomerMapper {\n    @Mapping(target = "fullName", expression = "java(customer.getFirstName() + \\" \\" + customer.getLastName())")\n    CustomerSummary toSummary(Customer customer);\n}\n\n@Mapper(componentModel = "spring", uses = {ProductMapper.class})\npublic interface OrderItemMapper {\n    @Mapping(source = "product", target = "product")\n    OrderItemResponse toResponse(OrderItem item);\n    List<OrderItemResponse> toResponseList(List<OrderItem> items);\n}\n\n@Mapper(componentModel = "spring")\npublic interface ProductMapper {\n    ProductSummary toSummary(Product product);\n}\n\n@Mapper(componentModel = "spring", uses = {CustomerMapper.class, OrderItemMapper.class})\npublic interface OrderMapper {\n    @Mapping(source = "customer", target = "customer")\n    @Mapping(source = "items", target = "items")\n    OrderResponse toResponse(Order order);\n    List<OrderResponse> toResponseList(List<Order> orders);\n}\n\n// DTO records\npublic record CustomerSummary(Long id, String fullName) {}\npublic record ProductSummary(Long id, String name, BigDecimal price) {}\npublic record OrderItemResponse(Long id, Integer quantity, BigDecimal price, ProductSummary product) {}\npublic record OrderResponse(Long id, LocalDateTime orderDate, BigDecimal totalAmount,\n                            CustomerSummary customer, List<OrderItemResponse> items) {}',
      explanation: 'uses = {} создаёт композицию mapper-ов. MapStruct автоматически находит подходящий метод маппинга по типу. Для Customer → CustomerSummary он вызовет customerMapper.toSummary(). Коллекции маппятся автоматически, если маппер для элемента определён.'
    },
    {
      id: 5,
      title: 'Задача: Маппинг коллекций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте маппинг различных коллекций: List, Set, Map и Page через MapStruct.',
      requirements: [
        'List<User> → List<UserResponse>',
        'Set<Tag> → Set<String> (только имена тегов)',
        'Map<String, Product> → Map<String, ProductResponse>',
        'Page<User> → Page<UserResponse>',
        'Stream<User> → List<UserResponse>',
        'Маппинг с фильтрацией: только активные пользователи'
      ],
      expectedOutput: 'toResponseList([user1, user2, user3]):\n[{id:1,...}, {id:2,...}, {id:3,...}]\n\ntagsToNames([Tag("Java"), Tag("Spring")]):\n["Java", "Spring"]\n\ntoResponseMap({"key1": product1}):\n{"key1": {id:1, name:"Laptop"}}\n\ntoResponsePage(Page<User>(content=[...], page=0, size=10, total=50)):\nPage<UserResponse>(content=[...], page=0, size=10, total=50)',
      hint: 'Для Set<Tag> → Set<String> используйте default метод с Stream. Page маппится через page.map(). Для Map используйте @MapMapping.',
      solution: '@Mapper(componentModel = "spring")\npublic interface UserMapper {\n\n    UserResponse toResponse(User user);\n\n    List<UserResponse> toResponseList(List<User> users);\n\n    Set<UserResponse> toResponseSet(Set<User> users);\n\n    default Set<String> tagsToNames(Set<Tag> tags) {\n        if (tags == null) return Collections.emptySet();\n        return tags.stream()\n            .map(Tag::getName)\n            .collect(Collectors.toSet());\n    }\n\n    default Page<UserResponse> toResponsePage(Page<User> page) {\n        return page.map(this::toResponse);\n    }\n\n    default List<UserResponse> toResponseListFromStream(Stream<User> stream) {\n        return stream\n            .map(this::toResponse)\n            .collect(Collectors.toList());\n    }\n\n    default List<UserResponse> toActiveResponseList(List<User> users) {\n        if (users == null) return Collections.emptyList();\n        return users.stream()\n            .filter(User::isActive)\n            .map(this::toResponse)\n            .collect(Collectors.toList());\n    }\n}\n\n@Mapper(componentModel = "spring")\npublic interface ProductMapper {\n\n    ProductResponse toResponse(Product product);\n\n    default Map<String, ProductResponse> toResponseMap(Map<String, Product> map) {\n        if (map == null) return Collections.emptyMap();\n        return map.entrySet().stream()\n            .collect(Collectors.toMap(\n                Map.Entry::getKey,\n                e -> toResponse(e.getValue())\n            ));\n    }\n}',
      explanation: 'MapStruct автоматически генерирует маппинг для List и Set коллекций. Для нестандартных коллекций (Page, Map, Stream) используйте default-методы. default-методы позволяют добавлять произвольную логику в mapper-интерфейс, включая фильтрацию и трансформацию.'
    },
    {
      id: 6,
      title: 'Задача: Условный маппинг и @Condition',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте условный маппинг: маппить поля только при выполнении условий.',
      requirements: [
        'Маппить email только если пользователь дал согласие (emailVisible = true)',
        'Маппить phoneNumber только если текущий пользователь — ADMIN',
        '@Condition аннотация для проверки условий',
        'qualifiedByName для выбора конкретного маппинг-метода',
        '@AfterMapping для постобработки результата',
        '@BeforeMapping для предобработки источника'
      ],
      expectedOutput: 'user.emailVisible=true:\ntoResponse(user) → {email: "ivan@mail.ru", phone: null}\n\nuser.emailVisible=false:\ntoResponse(user) → {email: null, phone: null}\n\ncurrentUser.role=ADMIN:\ntoResponse(user) → {email: "ivan@mail.ru", phone: "+7-999-123-45-67"}\n\n@AfterMapping маскирует данные:\ntoResponse(user) → {email: "i***@mail.ru", phone: "+7-***-***-45-67"}',
      hint: 'Используйте @AfterMapping void enrichResponse(User source, @MappingTarget UserResponse target) для постобработки. @Context позволяет передавать дополнительный контекст в mapper.',
      solution: '@Mapper(componentModel = "spring")\npublic abstract class UserMapper {\n\n    @Mapping(target = "email", conditionExpression = "java(user.isEmailVisible())", source = "email")\n    @Mapping(target = "phone", ignore = true)\n    public abstract UserResponse toResponse(User user, @Context SecurityContext context);\n\n    @AfterMapping\n    protected void afterMapping(User user, @MappingTarget UserResponse.Builder builder,\n                                 @Context SecurityContext context) {\n        // Показывать телефон только админам\n        if (context != null && context.isAdmin()) {\n            builder.phone(user.getPhoneNumber());\n        }\n\n        // Маскировать email\n        if (builder.getEmail() != null) {\n            builder.email(maskEmail(builder.getEmail()));\n        }\n    }\n\n    @BeforeMapping\n    protected void beforeMapping(User user) {\n        // Нормализация данных\n        if (user.getFirstName() != null) {\n            user.setFirstName(user.getFirstName().trim());\n        }\n    }\n\n    @Named("maskEmail")\n    protected String maskEmail(String email) {\n        if (email == null || !email.contains("@")) return email;\n        String[] parts = email.split("@");\n        String name = parts[0];\n        return name.charAt(0) + "***@" + parts[1];\n    }\n\n    @Named("maskPhone")\n    protected String maskPhone(String phone) {\n        if (phone == null || phone.length() < 6) return phone;\n        return phone.substring(0, 3) + "-***-***-" + phone.substring(phone.length() - 5);\n    }\n}',
      explanation: 'conditionExpression позволяет маппить поле только при выполнении условия. @AfterMapping/@BeforeMapping дают доступ к объекту до/после маппинга. @Context передаёт дополнительные параметры (например SecurityContext) без маппинга. @Named позволяет выбирать конкретный метод для маппинга поля.'
    },
    {
      id: 7,
      title: 'Задача: Update Entity из DTO',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте обновление существующей Entity из DTO с помощью @MappingTarget.',
      requirements: [
        'UpdateUserRequest DTO с опциональными полями',
        '@MappingTarget для обновления существующего объекта',
        'Null-стратегия: не обновлять поле если оно null в DTO',
        'NullValuePropertyMappingStrategy.IGNORE',
        'Частичное обновление (PATCH): только переданные поля',
        'Обновление вложенных объектов (Address) через @MappingTarget'
      ],
      expectedOutput: 'Existing user: {id:1, firstName:"Иван", lastName:"Петров", email:"ivan@mail.ru"}\n\nPATCH /api/users/1 {"firstName":"Пётр"}\n\nupdateUser(updateRequest, existingUser):\n{id:1, firstName:"Пётр", lastName:"Петров", email:"ivan@mail.ru"}\n\nТолько firstName обновился, остальные поля сохранились!',
      hint: 'NullValuePropertyMappingStrategy.IGNORE — ключевая настройка для PATCH. Без неё null-поля из DTO перезапишут существующие данные.',
      solution: 'public record UpdateUserRequest(\n    String firstName,\n    String lastName,\n    String email,\n    String phone,\n    UpdateAddressRequest address\n) {}\n\npublic record UpdateAddressRequest(\n    String city,\n    String street,\n    String zipCode\n) {}\n\n@Mapper(componentModel = "spring",\n        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,\n        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)\npublic interface UserMapper {\n\n    @Mapping(target = "id", ignore = true)\n    @Mapping(target = "createdAt", ignore = true)\n    @Mapping(target = "role", ignore = true)\n    @Mapping(target = "password", ignore = true)\n    void updateUserFromDto(UpdateUserRequest dto, @MappingTarget User user);\n\n    void updateAddressFromDto(UpdateAddressRequest dto, @MappingTarget Address address);\n}\n\n@Service\n@Transactional\npublic class UserService {\n    @Autowired UserRepository repo;\n    @Autowired UserMapper mapper;\n\n    public UserResponse updateUser(Long id, UpdateUserRequest request) {\n        User user = repo.findById(id)\n            .orElseThrow(() -> new UserNotFoundException(id));\n\n        mapper.updateUserFromDto(request, user);\n\n        // Обновление вложенного адреса\n        if (request.address() != null) {\n            if (user.getAddress() == null) {\n                user.setAddress(new Address());\n            }\n            mapper.updateAddressFromDto(request.address(), user.getAddress());\n        }\n\n        return UserMapper.toResponse(repo.save(user));\n    }\n}',
      explanation: '@MappingTarget указывает что нужно обновить существующий объект, а не создавать новый. NullValuePropertyMappingStrategy.IGNORE пропускает null-поля — это реализует семантику PATCH-запроса. id, createdAt, role и password игнорируются чтобы клиент не мог их изменить через этот endpoint.'
    },
    {
      id: 8,
      title: 'Задача: Маппинг наследования',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте маппинг иерархий наследования: абстрактные entity и DTO.',
      requirements: [
        'Абстрактная Entity: Notification (id, message, createdAt, type)',
        'Подклассы: EmailNotification (email, subject), SmsNotification (phone), PushNotification (token, title)',
        'Абстрактный NotificationResponse с подклассами',
        'MapStruct @SubclassMapping для автоматического определения подтипа',
        'Фабричный метод для создания нужного подтипа',
        'Маппинг List<Notification> → List<NotificationResponse> с полиморфизмом'
      ],
      expectedOutput: 'notifications = [EmailNotification, SmsNotification, PushNotification]\n\nmapper.toResponseList(notifications):\n[\n  {type:"EMAIL", message:"...", email:"ivan@mail.ru", subject:"Welcome"},\n  {type:"SMS", message:"...", phone:"+7-999-123-45-67"},\n  {type:"PUSH", message:"...", token:"fcm_token", title:"Уведомление"}\n]',
      hint: 'Используйте @SubclassMapping(source = EmailNotification.class, target = EmailNotificationResponse.class). MapStruct 1.5+ поддерживает полиморфный маппинг.',
      solution: '// Entities\n@Entity\n@Inheritance(strategy = InheritanceType.SINGLE_TABLE)\n@DiscriminatorColumn(name = "type")\npublic abstract class Notification {\n    @Id @GeneratedValue private Long id;\n    private String message;\n    @CreationTimestamp private LocalDateTime createdAt;\n}\n\n@Entity @DiscriminatorValue("EMAIL")\npublic class EmailNotification extends Notification {\n    private String email;\n    private String subject;\n}\n\n@Entity @DiscriminatorValue("SMS")\npublic class SmsNotification extends Notification {\n    private String phone;\n}\n\n@Entity @DiscriminatorValue("PUSH")\npublic class PushNotification extends Notification {\n    private String token;\n    private String title;\n}\n\n// DTOs\npublic sealed interface NotificationResponse {\n    Long id();\n    String type();\n    String message();\n}\npublic record EmailNotificationResponse(Long id, String type, String message,\n    String email, String subject) implements NotificationResponse {}\npublic record SmsNotificationResponse(Long id, String type, String message,\n    String phone) implements NotificationResponse {}\npublic record PushNotificationResponse(Long id, String type, String message,\n    String token, String title) implements NotificationResponse {}\n\n// Mapper\n@Mapper(componentModel = "spring")\npublic interface NotificationMapper {\n\n    @SubclassMapping(source = EmailNotification.class, target = EmailNotificationResponse.class)\n    @SubclassMapping(source = SmsNotification.class, target = SmsNotificationResponse.class)\n    @SubclassMapping(source = PushNotification.class, target = PushNotificationResponse.class)\n    NotificationResponse toResponse(Notification notification);\n\n    List<NotificationResponse> toResponseList(List<Notification> notifications);\n}',
      explanation: '@SubclassMapping определяет пары source→target для подклассов. MapStruct генерирует instanceof проверки и вызывает нужный маппинг. sealed interface гарантирует что все подтипы известны на этапе компиляции. @Inheritance(SINGLE_TABLE) хранит все подтипы в одной таблице с дискриминатором.'
    },
    {
      id: 9,
      title: 'Задача: Bi-directional маппинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Решите проблему бесконечной рекурсии при маппинге двунаправленных связей.',
      requirements: [
        'Department ↔ Employee двунаправленная связь',
        'DepartmentResponse содержит List<EmployeeSummary> (без обратной ссылки на Department)',
        'EmployeeResponse содержит DepartmentSummary (без списка сотрудников)',
        'Избежать StackOverflowError при маппинге',
        '@Named методы для разных уровней вложенности',
        'Циклическая ссылка: Employee → Department → List<Employee>'
      ],
      expectedOutput: 'departmentMapper.toResponse(department):\n{\n  "id": 1,\n  "name": "Engineering",\n  "employees": [\n    {"id": 1, "name": "Иван", "position": "Developer"},\n    {"id": 2, "name": "Мария", "position": "QA"}\n  ]\n}\n\nemployeeMapper.toResponse(employee):\n{\n  "id": 1,\n  "name": "Иван",\n  "position": "Developer",\n  "department": {"id": 1, "name": "Engineering"}\n}',
      hint: 'Ключ — разные DTO для разных уровней: DepartmentResponse (полный) и DepartmentSummary (без employees). Это разрывает рекурсию.',
      solution: '// Summary DTOs (без вложенных коллекций)\npublic record DepartmentSummary(Long id, String name) {}\npublic record EmployeeSummary(Long id, String name, String position) {}\n\n// Full DTOs\npublic record DepartmentResponse(Long id, String name, String description,\n    List<EmployeeSummary> employees, int employeeCount) {}\npublic record EmployeeResponse(Long id, String name, String position,\n    String email, DepartmentSummary department) {}\n\n@Mapper(componentModel = "spring")\npublic interface DepartmentMapper {\n\n    @Mapping(target = "employees", source = "employees", qualifiedByName = "toSummaryList")\n    @Mapping(target = "employeeCount", expression = "java(department.getEmployees() != null ? department.getEmployees().size() : 0)")\n    DepartmentResponse toResponse(Department department);\n\n    DepartmentSummary toSummary(Department department);\n\n    @Named("toSummaryList")\n    default List<EmployeeSummary> toSummaryList(List<Employee> employees) {\n        if (employees == null) return Collections.emptyList();\n        return employees.stream()\n            .map(e -> new EmployeeSummary(e.getId(), e.getName(), e.getPosition()))\n            .collect(Collectors.toList());\n    }\n}\n\n@Mapper(componentModel = "spring", uses = DepartmentMapper.class)\npublic interface EmployeeMapper {\n\n    @Mapping(source = "department", target = "department")\n    EmployeeResponse toResponse(Employee employee);\n\n    EmployeeSummary toSummary(Employee employee);\n\n    List<EmployeeResponse> toResponseList(List<Employee> employees);\n}',
      explanation: 'Бесконечная рекурсия возникает когда Department маппит полный Employee (с Department), а Employee маппит полный Department (с employees). Решение: Summary DTO без обратных ссылок. DepartmentResponse содержит EmployeeSummary (без department), EmployeeResponse содержит DepartmentSummary (без employees).'
    },
    {
      id: 10,
      title: 'Задача: Validation + DTO интеграция',
      type: 'practice',
      difficulty: 'hard',
      description: 'Интегрируйте валидацию Bean Validation с DTO и MapStruct для полной цепочки обработки.',
      requirements: [
        'Кастомные аннотации валидации: @UniqueEmail, @StrongPassword',
        'Группы валидации: onCreate, onUpdate',
        'Cross-field validation: passwordConfirmation == password',
        'Валидация вложенных DTO: @Valid на вложенных объектах',
        'Маппинг ошибок валидации в структурированный ответ',
        'Интеграция: Controller → Validation → MapStruct → Service → Repository'
      ],
      expectedOutput: 'POST /api/users {"firstName":"","email":"invalid","password":"123"}\n\nHTTP 422 Unprocessable Entity:\n{\n  "status": 422,\n  "errors": [\n    {"field": "firstName", "message": "Имя обязательно"},\n    {"field": "email", "message": "Некорректный формат email"},\n    {"field": "password", "message": "Пароль должен содержать минимум 8 символов, цифру и спецсимвол"}\n  ]\n}\n\nPOST /api/users {"email":"existing@mail.ru",...}\nHTTP 409: {"field":"email","message":"Email уже используется"}',
      hint: 'Кастомная аннотация валидации: @Constraint(validatedBy = UniqueEmailValidator.class). Группы: @NotBlank(groups = OnCreate.class). Cross-field: ConstraintValidator на уровне класса.',
      solution: '// Кастомная аннотация\n@Target(ElementType.FIELD)\n@Retention(RetentionPolicy.RUNTIME)\n@Constraint(validatedBy = UniqueEmailValidator.class)\npublic @interface UniqueEmail {\n    String message() default "Email уже используется";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n}\n\npublic class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {\n    @Autowired UserRepository userRepository;\n\n    @Override\n    public boolean isValid(String email, ConstraintValidatorContext context) {\n        if (email == null) return true;\n        return !userRepository.existsByEmail(email);\n    }\n}\n\n// DTO с группами валидации\npublic record CreateUserRequest(\n    @NotBlank(message = "Имя обязательно")\n    String firstName,\n\n    @NotBlank(message = "Фамилия обязательна")\n    String lastName,\n\n    @NotBlank @Email(message = "Некорректный формат email")\n    @UniqueEmail\n    String email,\n\n    @NotBlank @StrongPassword\n    String password,\n\n    @NotBlank\n    String passwordConfirmation,\n\n    @Valid\n    AddressRequest address\n) {}\n\n// Cross-field validation\n@Target(ElementType.TYPE)\n@Constraint(validatedBy = PasswordMatchValidator.class)\npublic @interface PasswordMatch {\n    String message() default "Пароли не совпадают";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n}\n\npublic class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, CreateUserRequest> {\n    @Override\n    public boolean isValid(CreateUserRequest req, ConstraintValidatorContext ctx) {\n        return req.password() != null && req.password().equals(req.passwordConfirmation());\n    }\n}\n\n// Controller\n@RestController @RequestMapping("/api/users")\npublic class UserController {\n    @Autowired UserService service;\n    @Autowired UserMapper mapper;\n\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {\n        User user = mapper.toEntity(request);\n        return mapper.toResponse(service.create(user));\n    }\n}\n\n@RestControllerAdvice\npublic class ValidationExceptionHandler {\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)\n    public ValidationErrorResponse handleValidation(MethodArgumentNotValidException ex) {\n        List<FieldError> errors = ex.getBindingResult().getFieldErrors().stream()\n            .map(e -> new FieldError(e.getField(), e.getDefaultMessage()))\n            .toList();\n        return new ValidationErrorResponse(422, errors);\n    }\n}',
      explanation: 'Кастомные валидаторы инжектируют Spring Bean-ы (например UserRepository). Группы позволяют применять разные правила для create/update. Cross-field validation работает на уровне класса. @Valid каскадирует валидацию на вложенные объекты. ControllerAdvice форматирует ошибки в удобный JSON.'
    }
  ]
}
