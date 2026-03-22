export default {
  id: 9,
  title: 'Spring Data JPA: основы',
  description: 'Работа с базой данных: Entity, Repository, CRUD операции, H2 и PostgreSQL',
  lessons: [
    {
      id: 1,
      title: 'JPA и Hibernate: основные концепции',
      type: 'theory',
      content: [
        { type: 'text', value: 'JPA (Java Persistence API) — стандарт для работы с реляционными базами данных в Java. Hibernate — самая популярная реализация JPA. Spring Data JPA — надстройка над JPA/Hibernate, добавляющая удобные репозитории.' },
        { type: 'heading', value: 'Зачем нужна JPA?' },
        { type: 'text', value: 'Без JPA приходится писать SQL вручную через JDBC. JPA позволяет работать с объектами Java, а не с таблицами SQL — ORM (Object-Relational Mapping) делает преобразование автоматически.' },
        { type: 'code', language: 'java', value: '<!-- Подключение Spring Data JPA -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-data-jpa</artifactId>\n</dependency>\n\n<!-- H2 для разработки (in-memory) -->\n<dependency>\n    <groupId>com.h2database</groupId>\n    <artifactId>h2</artifactId>\n    <scope>runtime</scope>\n</dependency>\n\n<!-- PostgreSQL для продакшена -->\n<dependency>\n    <groupId>org.postgresql</groupId>\n    <artifactId>postgresql</artifactId>\n    <scope>runtime</scope>\n</dependency>' },
        { type: 'note', value: 'H2 — встроенная база данных, работает в памяти. Идеальна для разработки и тестов: не нужно устанавливать PostgreSQL. Данные сбрасываются при перезапуске приложения.' }
      ]
    },
    {
      id: 2,
      title: '@Entity: класс-сущность',
      type: 'theory',
      content: [
        { type: 'text', value: '@Entity — аннотация, которая превращает Java класс в сущность JPA. Каждый экземпляр класса соответствует строке в таблице базы данных.' },
        { type: 'code', language: 'java', value: '@Entity\n@Table(name = "users")  // название таблицы (по умолчанию = имя класса)\npublic class User {\n\n    @Id  // первичный ключ\n    @GeneratedValue(strategy = GenerationType.IDENTITY)  // автоинкремент\n    private Long id;\n\n    @Column(name = "user_name", nullable = false, length = 50)\n    private String username;\n\n    @Column(unique = true, nullable = false)\n    private String email;\n\n    @Column(name = "created_at")\n    private LocalDateTime createdAt;\n\n    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")\n    private boolean active = true;\n\n    // Конструктор без аргументов ОБЯЗАТЕЛЕН для JPA!\n    public User() {}\n\n    public User(String username, String email) {\n        this.username = username;\n        this.email = email;\n        this.createdAt = LocalDateTime.now();\n    }\n    // геттеры и сеттеры\n}' },
        { type: 'warning', value: 'У @Entity класса ОБЯЗАТЕЛЬНО должен быть конструктор без аргументов (no-args constructor). JPA использует его при загрузке объектов из БД. Если нет — будет ошибка при запуске.' },
        { type: 'tip', value: 'Lombok упрощает Entity классы: @Data, @NoArgsConstructor, @AllArgsConstructor. Но с @Entity и @Data есть нюансы — лучше использовать @Getter @Setter @NoArgsConstructor.' }
      ]
    },
    {
      id: 3,
      title: 'JpaRepository и CRUD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Data JPA генерирует реализацию репозитория автоматически. Достаточно создать интерфейс, расширяющий JpaRepository — и все CRUD методы уже готовы.' },
        { type: 'code', language: 'java', value: '// Просто создай интерфейс!\n@Repository\npublic interface UserRepository extends JpaRepository<User, Long> {\n    // JpaRepository<T, ID>:\n    // T — тип Entity\n    // ID — тип первичного ключа\n\n    // Spring автоматически создаст реализацию с методами:\n    // save(User user)         — сохранить/обновить\n    // findById(Long id)       — найти по id -> Optional<User>\n    // findAll()               — все записи\n    // findAll(Pageable p)     — с пагинацией\n    // delete(User user)       — удалить\n    // deleteById(Long id)     — удалить по id\n    // existsById(Long id)     — проверить существование\n    // count()                 — количество записей\n}' },
        { type: 'code', language: 'java', value: '// Использование в сервисе\n@Service\npublic class UserService {\n    private final UserRepository userRepository;\n\n    public UserService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    public User createUser(String username, String email) {\n        User user = new User(username, email);\n        return userRepository.save(user);  // INSERT в БД\n    }\n\n    public Optional<User> findUser(Long id) {\n        return userRepository.findById(id);  // SELECT по id\n    }\n\n    public List<User> getAllUsers() {\n        return userRepository.findAll();  // SELECT *\n    }\n\n    public void deleteUser(Long id) {\n        userRepository.deleteById(id);  // DELETE\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Query Methods: поиск по конвенции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Data JPA генерирует SQL запросы по имени метода. Используй специальные ключевые слова — Spring поймёт какой запрос нужен.' },
        { type: 'code', language: 'java', value: 'public interface UserRepository extends JpaRepository<User, Long> {\n\n    // SELECT * FROM users WHERE email = ?\n    Optional<User> findByEmail(String email);\n\n    // SELECT * FROM users WHERE username = ? AND active = ?\n    List<User> findByUsernameAndActive(String username, boolean active);\n\n    // SELECT * FROM users WHERE email = ? OR username = ?\n    List<User> findByEmailOrUsername(String email, String username);\n\n    // SELECT * FROM users WHERE username LIKE %?%\n    List<User> findByUsernameContaining(String part);\n\n    // SELECT * FROM users WHERE username LIKE ?%\n    List<User> findByUsernameStartingWith(String prefix);\n\n    // SELECT * FROM users WHERE created_at > ?\n    List<User> findByCreatedAtAfter(LocalDateTime date);\n\n    // SELECT * FROM users WHERE age BETWEEN ? AND ?\n    List<User> findByAgeBetween(int min, int max);\n\n    // SELECT COUNT(*) FROM users WHERE active = ?\n    long countByActive(boolean active);\n\n    // SELECT * FROM users ORDER BY username ASC\n    List<User> findAllByOrderByUsernameAsc();\n\n    // Проверить существование\n    boolean existsByEmail(String email);\n}' },
        { type: 'tip', value: 'Ключевые слова: findBy, countBy, existsBy, deleteBy — действие. Потом условие: By, And, Or, Not, Like, Containing, StartingWith, EndingWith, Between, LessThan, GreaterThan, In, After, Before.' }
      ]
    },
    {
      id: 5,
      title: 'Конфигурация подключения к БД',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot нужно знать как подключиться к базе данных. Настройки задаются в application.properties или application.yml.' },
        { type: 'heading', value: 'H2 (для разработки)' },
        { type: 'code', language: 'java', value: '# application.properties для H2\nspring.datasource.url=jdbc:h2:mem:testdb\nspring.datasource.driver-class-name=org.h2.Driver\nspring.datasource.username=sa\nspring.datasource.password=\n\n# H2 консоль для просмотра данных\nspring.h2.console.enabled=true\nspring.h2.console.path=/h2-console\n\n# JPA настройки\nspring.jpa.hibernate.ddl-auto=create-drop  # пересоздавать таблицы при старте\nspring.jpa.show-sql=true  # логировать SQL запросы\nspring.jpa.properties.hibernate.format_sql=true' },
        { type: 'heading', value: 'PostgreSQL (для продакшена)' },
        { type: 'code', language: 'java', value: '# application.properties для PostgreSQL\nspring.datasource.url=jdbc:postgresql://localhost:5432/mydb\nspring.datasource.username=postgres\nspring.datasource.password=secret\n\n# ddl-auto для продакшена - НЕ create, только validate или none!\nspring.jpa.hibernate.ddl-auto=validate\nspring.jpa.show-sql=false' },
        { type: 'warning', value: 'ddl-auto=create-drop удаляет все данные при перезапуске! Для продакшена используй validate (проверяет схему) или none. Для миграций схемы используй Flyway или Liquibase.' }
      ]
    },
    {
      id: 6,
      title: '@Transactional: управление транзакциями',
      type: 'theory',
      content: [
        { type: 'text', value: '@Transactional — аннотация для управления транзакциями. Если в методе несколько операций с БД — они выполняются как одна атомарная транзакция.' },
        { type: 'code', language: 'java', value: '@Service\npublic class TransferService {\n\n    @Transactional  // всё или ничего\n    public void transferMoney(Long fromId, Long toId, BigDecimal amount) {\n        Account from = accountRepository.findById(fromId)\n            .orElseThrow(() -> new ResourceNotFoundException("Account", fromId));\n        Account to = accountRepository.findById(toId)\n            .orElseThrow(() -> new ResourceNotFoundException("Account", toId));\n\n        if (from.getBalance().compareTo(amount) < 0) {\n            throw new InsufficientFundsException("Недостаточно средств");\n        }\n\n        from.setBalance(from.getBalance().subtract(amount));\n        to.setBalance(to.getBalance().add(amount));\n\n        // Если здесь будет исключение — оба изменения откатятся!\n        accountRepository.save(from);\n        accountRepository.save(to);\n    }\n}' },
        { type: 'note', value: 'Все методы JpaRepository уже @Transactional. @Transactional нужен на уровне сервиса когда несколько repository операций должны быть атомарными. При RuntimeException транзакция откатывается автоматически.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CRUD для задач (ToDo)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полноценный CRUD для задач с хранением в базе данных H2.',
      requirements: [
        'Entity Task: id, title, description, completed, createdAt',
        'TaskRepository: JpaRepository + findByCompleted(boolean)',
        'TaskService: create, findAll, findById, update, delete',
        'REST API: GET /tasks, GET /tasks/{id}, POST /tasks, PUT /tasks/{id}, DELETE /tasks/{id}',
        'GET /tasks?completed=true — фильтр по статусу'
      ],
      expectedOutput: 'POST /tasks {"title":"Изучить JPA","description":"Репозитории"} => 201 {"id":1,"title":"Изучить JPA","completed":false}\nGET /tasks?completed=false => [{"id":1,...}]',
      hint: '@Entity Task класс с @GeneratedValue. TaskRepository extends JpaRepository<Task, Long> с findByCompleted. @Transactional на методах сервиса.',
      solution: '// Task.java\n@Entity\n@Table(name = "tasks")\npublic class Task {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false)\n    private String title;\n\n    private String description;\n\n    private boolean completed = false;\n\n    @Column(name = "created_at")\n    private LocalDateTime createdAt = LocalDateTime.now();\n\n    public Task() {}\n    // геттеры и сеттеры\n}\n\n// TaskRepository.java\n@Repository\npublic interface TaskRepository extends JpaRepository<Task, Long> {\n    List<Task> findByCompleted(boolean completed);\n}\n\n// TaskService.java\n@Service\npublic class TaskService {\n    private final TaskRepository taskRepository;\n\n    public TaskService(TaskRepository taskRepository) {\n        this.taskRepository = taskRepository;\n    }\n\n    public Task create(Task task) {\n        return taskRepository.save(task);\n    }\n\n    public List<Task> findAll(Boolean completed) {\n        if (completed != null) return taskRepository.findByCompleted(completed);\n        return taskRepository.findAll();\n    }\n\n    public Task findById(Long id) {\n        return taskRepository.findById(id)\n            .orElseThrow(() -> new RuntimeException("Задача не найдена: " + id));\n    }\n\n    @Transactional\n    public Task update(Long id, Task data) {\n        Task task = findById(id);\n        task.setTitle(data.getTitle());\n        task.setDescription(data.getDescription());\n        task.setCompleted(data.isCompleted());\n        return taskRepository.save(task);\n    }\n\n    public void delete(Long id) {\n        taskRepository.deleteById(id);\n    }\n}\n\n// TaskController.java\n@RestController\n@RequestMapping("/tasks")\npublic class TaskController {\n    private final TaskService taskService;\n\n    public TaskController(TaskService taskService) { this.taskService = taskService; }\n\n    @GetMapping\n    public List<Task> getAll(@RequestParam(required = false) Boolean completed) {\n        return taskService.findAll(completed);\n    }\n\n    @GetMapping("/{id}")\n    public Task getById(@PathVariable Long id) {\n        return taskService.findById(id);\n    }\n\n    @PostMapping\n    public ResponseEntity<Task> create(@RequestBody Task task) {\n        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(task));\n    }\n\n    @PutMapping("/{id}")\n    public Task update(@PathVariable Long id, @RequestBody Task task) {\n        return taskService.update(id, task);\n    }\n\n    @DeleteMapping("/{id}")\n    public ResponseEntity<Void> delete(@PathVariable Long id) {\n        taskService.delete(id);\n        return ResponseEntity.noContent().build();\n    }\n}',
      explanation: 'Spring Data JPA избавляет от написания SQL. @Entity маппит класс на таблицу. JpaRepository предоставляет готовые CRUD методы. Имена методов (findByCompleted) Spring конвертирует в SQL. @Transactional на update обеспечивает атомарность.'
    },
    {
      id: 8,
      title: 'Практика: Пагинация и сортировка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь пагинацию и сортировку к списку задач используя Pageable.',
      requirements: [
        'GET /tasks?page=0&size=5&sort=createdAt,desc — страница задач',
        'Ответ должен включать: content, totalElements, totalPages, currentPage',
        'Использовать Page<Task> из Spring Data',
        'Сортировка по любому полю, пагинация по умолчанию: page=0, size=10'
      ],
      expectedOutput: 'GET /tasks?page=0&size=2&sort=title,asc => {"content":[...],"totalElements":10,"totalPages":5,"currentPage":0}',
      hint: 'Репозиторий: findAll(Pageable pageable). Контроллер: @RequestParam int page, int size, String sortField, String sortDir. PageRequest.of(page, size, Sort.by(dir, field)).',
      solution: '// TaskRepository.java — дополнение\npublic interface TaskRepository extends JpaRepository<Task, Long> {\n    Page<Task> findByCompleted(boolean completed, Pageable pageable);\n}\n\n// TaskService.java — метод с пагинацией\npublic Map<String, Object> findAllPaged(int page, int size,\n                                         String sortField, String sortDir) {\n    Sort.Direction direction = sortDir.equalsIgnoreCase("desc")\n        ? Sort.Direction.DESC : Sort.Direction.ASC;\n    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));\n    Page<Task> taskPage = taskRepository.findAll(pageable);\n\n    Map<String, Object> response = new LinkedHashMap<>();\n    response.put("content", taskPage.getContent());\n    response.put("totalElements", taskPage.getTotalElements());\n    response.put("totalPages", taskPage.getTotalPages());\n    response.put("currentPage", taskPage.getNumber());\n    response.put("pageSize", taskPage.getSize());\n    return response;\n}\n\n// TaskController.java — endpoint с пагинацией\n@GetMapping("/paged")\npublic Map<String, Object> getPaged(\n        @RequestParam(defaultValue = "0") int page,\n        @RequestParam(defaultValue = "10") int size,\n        @RequestParam(defaultValue = "id") String sort,\n        @RequestParam(defaultValue = "asc") String dir) {\n    return taskService.findAllPaged(page, size, sort, dir);\n}',
      explanation: 'Pageable — интерфейс Spring Data для пагинации и сортировки. PageRequest.of() создаёт конкретный Pageable с номером страницы, размером и сортировкой. findAll(Pageable) возвращает Page<T> с данными и метаинформацией о пагинации. Page<T>.getContent() — данные текущей страницы.'
    }
  ]
}
