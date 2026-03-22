export default {
  id: 80,
  title: 'Best Practices: Архитектура приложений',
  description: 'Проектирование Java-приложений: слоистая архитектура, паттерн MVC, разделение ответственности, внедрение зависимостей, паттерн Repository, DTO и стандартная структура проекта.',
  lessons: [
    {
      id: 1,
      title: 'Слоистая архитектура: Presentation, Service, Data',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Слоистая архитектура (Layered Architecture) — фундаментальный паттерн организации кода. Приложение делится на горизонтальные слои, каждый из которых отвечает за свою область. Зависимости направлены только сверху вниз.'
        },
        {
          type: 'heading',
          text: 'Три основных слоя'
        },
        {
          type: 'list',
          items: [
            'Presentation Layer (слой представления) — взаимодействие с пользователем: UI, REST API, CLI',
            'Service Layer (бизнес-логика) — основные операции приложения, правила бизнеса',
            'Data Layer (слой данных) — доступ к БД, файлам, внешним API'
          ]
        },
        {
          type: 'heading',
          text: 'Плохой подход — всё в одном месте'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — монолитный класс без разделения',
          code: 'public class UserController {\n    // Логика представления, бизнес-логика и работа с БД — всё в одном!\n    public String handleCreateUser(String name, String email) {\n        // Валидация (бизнес-логика)\n        if (name == null || name.length() < 2) {\n            return "ERROR: Имя слишком короткое";\n        }\n        // Работа с БД (слой данных)\n        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";\n        // ... выполняем SQL ...\n        // Формирование ответа (представление)\n        return "OK: Пользователь " + name + " создан";\n        // Проблемы: нельзя протестировать логику без БД,\n        // нельзя поменять БД без изменения контроллера,\n        // нельзя добавить новый интерфейс (мобильное API) без дублирования\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — разделение на слои',
          code: '// Слой данных: только работа с хранилищем\npublic class UserRepository {\n    public User save(User user) { /* SQL INSERT */ return user; }\n    public Optional<User> findById(long id) { /* SQL SELECT */ return Optional.empty(); }\n}\n\n// Слой бизнес-логики: правила и операции\npublic class UserService {\n    private final UserRepository repository; // зависимость через конструктор\n\n    public UserService(UserRepository repository) {\n        this.repository = repository;\n    }\n\n    public User createUser(String name, String email) {\n        // Бизнес-правила:\n        if (name == null || name.length() < 2) {\n            throw new ValidationException("name", "Имя слишком короткое");\n        }\n        User user = new User(name, email);\n        return repository.save(user);\n    }\n}\n\n// Слой представления: только взаимодействие с пользователем\npublic class UserController {\n    private final UserService userService;\n\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    public String handleCreateUser(String name, String email) {\n        try {\n            User user = userService.createUser(name, email);\n            return "OK: Пользователь " + user.getName() + " создан (ID: " + user.getId() + ")";\n        } catch (ValidationException e) {\n            return "ERROR [" + e.getField() + "]: " + e.getMessage();\n        }\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Золотое правило: верхний слой знает о нижнем, нижний — не знает о верхнем. UserRepository никогда не импортирует UserController. Это делает каждый слой независимо тестируемым и заменяемым.'
        }
      ]
    },
    {
      id: 2,
      title: 'Паттерн MVC и разделение ответственности',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'MVC (Model-View-Controller) — один из самых известных архитектурных паттернов. Разделяет приложение на три части: данные (Model), отображение (View) и управление (Controller).'
        },
        {
          type: 'heading',
          text: 'Роли в MVC'
        },
        {
          type: 'list',
          items: [
            'Model — данные и бизнес-логика. Не знает о View и Controller',
            'View — отображение данных пользователю. Не содержит бизнес-логику',
            'Controller — связующее звено: получает запросы, вызывает Model, выбирает View'
          ]
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — логика отображения в модели',
          code: 'public class Product {\n    private String name;\n    private double price;\n\n    // ПЛОХО: Model знает о форматировании для UI\n    public String getFormattedForHTML() {\n        return "<div class=\'product\'><h3>" + name + "</h3>" +\n               "<span class=\'price\'>" + String.format("%.2f ₸", price) + "</span></div>";\n    }\n\n    // ПЛОХО: Model знает о форматировании для CSV\n    public String getFormattedForCSV() {\n        return name + "," + price + "\\n";\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — Model содержит только данные',
          code: '// Model: только данные\npublic class Product {\n    private final long id;\n    private final String name;\n    private final double price;\n\n    // Только getters — никакого знания об отображении\n    public long getId() { return id; }\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n}\n\n// View: только отображение\npublic class ProductHtmlView {\n    public String render(Product product) {\n        return "<div class=\'product\'><h3>" + product.getName() + "</h3>" +\n               "<span class=\'price\'>" + String.format("%.2f ₸", product.getPrice()) +\n               "</span></div>";\n    }\n}\n\n// Controller: управляет потоком\npublic class ProductController {\n    private final ProductService productService;\n    private final ProductHtmlView htmlView;\n\n    public String showProduct(long id) {\n        Product product = productService.findById(id);\n        return htmlView.render(product); // выбирает нужный View\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Single Responsibility Principle'
        },
        {
          type: 'text',
          text: 'Принцип единственной ответственности (SRP): класс должен иметь только одну причину для изменения. Если класс меняется из-за изменений в UI И из-за изменений в БД — это нарушение SRP.'
        }
      ]
    },
    {
      id: 3,
      title: 'Внедрение зависимостей (Dependency Injection)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Внедрение зависимостей (DI) — техника, при которой объект получает свои зависимости извне, а не создаёт их сам. Это делает код тестируемым, гибким и слабосвязанным.'
        },
        {
          type: 'heading',
          text: 'Проблема тесной связанности'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — объект сам создаёт зависимости',
          code: 'public class OrderService {\n    // OrderService жёстко привязан к конкретным реализациям\n    private final EmailService emailService = new SmtpEmailService(); // нельзя заменить на mock\n    private final OrderRepository repository = new MySQLOrderRepository(); // нельзя заменить\n\n    public void placeOrder(Order order) {\n        repository.save(order);\n        emailService.sendConfirmation(order);\n        // Для теста: нужна реальная MySQL БД и SMTP сервер!\n        // Очень сложно тестировать.\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — зависимости через конструктор',
          code: '// Интерфейсы для абстракции\npublic interface EmailService {\n    void sendConfirmation(Order order);\n}\npublic interface OrderRepository {\n    void save(Order order);\n    Optional<Order> findById(long id);\n}\n\npublic class OrderService {\n    private final EmailService emailService;\n    private final OrderRepository repository;\n\n    // Зависимости инжектируются через конструктор\n    public OrderService(EmailService emailService, OrderRepository repository) {\n        this.emailService = emailService;\n        this.repository = repository;\n    }\n\n    public void placeOrder(Order order) {\n        repository.save(order);\n        emailService.sendConfirmation(order);\n    }\n}\n\n// В продакшне:\nOrderService service = new OrderService(\n    new SmtpEmailService(),     // реальная реализация\n    new MySQLOrderRepository()  // реальная реализация\n);\n\n// В тестах:\nOrderService service = new OrderService(\n    new FakeEmailService(),   // заглушка — ничего не отправляет\n    new InMemoryOrderRepo()   // заглушка — хранит в памяти\n);\n// Теперь можно тестировать OrderService без внешних зависимостей!'
        },
        {
          type: 'list',
          items: [
            'Constructor Injection — предпочтительный способ: зависимости видны, объект всегда консистентен',
            'Setter Injection — для опциональных зависимостей',
            'Field Injection (через @Autowired) — удобно в Spring, но скрывает зависимости',
            'Spring Framework, Guice, Dagger — DI-контейнеры автоматизируют создание объектов'
          ]
        },
        {
          type: 'tip',
          text: 'Если у класса больше 3-4 зависимостей в конструкторе — это сигнал нарушения SRP. Скорее всего, класс делает слишком много и его надо разбить.'
        }
      ]
    },
    {
      id: 4,
      title: 'Паттерн Repository и DTO',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Repository Pattern скрывает детали доступа к данным за интерфейсом коллекции. DTO (Data Transfer Object) — простой объект для передачи данных между слоями без бизнес-логики.'
        },
        {
          type: 'heading',
          text: 'Repository Pattern'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — Repository как абстракция над хранилищем',
          code: '// Интерфейс — контракт, не зависящий от способа хранения\npublic interface UserRepository {\n    User save(User user);\n    Optional<User> findById(long id);\n    Optional<User> findByEmail(String email);\n    List<User> findAll();\n    void deleteById(long id);\n    boolean existsByEmail(String email);\n}\n\n// Реализация для MySQL\npublic class MySQLUserRepository implements UserRepository {\n    public User save(User user) { /* INSERT или UPDATE */ return user; }\n    public Optional<User> findById(long id) { /* SELECT */ return Optional.empty(); }\n    // ... другие методы ...\n}\n\n// Реализация для тестов — данные в памяти\npublic class InMemoryUserRepository implements UserRepository {\n    private final Map<Long, User> store = new HashMap<>();\n    private long nextId = 1;\n\n    public User save(User user) {\n        if (user.getId() == 0) user.setId(nextId++);\n        store.put(user.getId(), user);\n        return user;\n    }\n    public Optional<User> findById(long id) { return Optional.ofNullable(store.get(id)); }\n    // ...\n}\n\n// UserService не знает, MySQL это или память\npublic class UserService {\n    private final UserRepository repository; // работает с любой реализацией\n}'
        },
        {
          type: 'heading',
          text: 'DTO — Data Transfer Object'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — возвращаем внутреннюю Entity наружу',
          code: 'public class User {\n    private long id;\n    private String name;\n    private String email;\n    private String passwordHash; // чувствительное поле!\n    private String internalCode;  // внутренние данные\n}\n\n// Если возвращаем User напрямую — клиент видит passwordHash и internalCode\npublic User getUser(long id) {\n    return repository.findById(id).orElseThrow(); // утечка внутренних данных!\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — DTO скрывает ненужные детали',
          code: '// Entity — внутренняя модель с полными данными\npublic class User {\n    private long id;\n    private String name;\n    private String email;\n    private String passwordHash;  // только для внутреннего использования\n    private String internalCode;  // только для внутреннего использования\n    // getters/setters\n}\n\n// DTO — только то, что нужно клиенту\npublic class UserDTO {\n    private final long id;\n    private final String name;\n    private final String email;\n    // Нет passwordHash, нет internalCode!\n\n    public UserDTO(long id, String name, String email) {\n        this.id = id;\n        this.name = name;\n        this.email = email;\n    }\n    // только getters\n}\n\n// Конвертация в Service\npublic UserDTO getUserById(long id) {\n    User user = repository.findById(id).orElseThrow();\n    return new UserDTO(user.getId(), user.getName(), user.getEmail());\n}\n// Теперь наружу выходит только безопасная информация'
        },
        {
          type: 'text',
          text: 'DTO также решает проблему циклических зависимостей между связанными объектами, проблему lazy loading при сериализации и позволяет возвращать агрегированные данные из нескольких сущностей в одном объекте.'
        }
      ]
    },
    {
      id: 5,
      title: 'Структура проекта и соглашения',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Стандартная структура проекта — это соглашение, которое понимают все Java-разработчики. Когда новый человек приходит в проект, он должен сразу понять где что лежит.'
        },
        {
          type: 'heading',
          text: 'Стандартная структура Maven/Gradle проекта'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'Рекомендуемая структура пакетов',
          code: 'myapp/\n├── src/\n│   ├── main/\n│   │   ├── java/\n│   │   │   └── com/company/myapp/\n│   │   │       ├── Main.java                    # точка входа\n│   │   │       ├── controller/                  # Presentation Layer\n│   │   │       │   ├── UserController.java\n│   │   │       │   └── ProductController.java\n│   │   │       ├── service/                     # Service Layer\n│   │   │       │   ├── UserService.java\n│   │   │       │   └── ProductService.java\n│   │   │       ├── repository/                  # Data Layer\n│   │   │       │   ├── UserRepository.java      # интерфейс\n│   │   │       │   └── impl/\n│   │   │       │       └── MySQLUserRepository.java\n│   │   │       ├── model/                       # Entity классы\n│   │   │       │   ├── User.java\n│   │   │       │   └── Product.java\n│   │   │       ├── dto/                         # Data Transfer Objects\n│   │   │       │   ├── UserDTO.java\n│   │   │       │   └── CreateUserRequest.java\n│   │   │       ├── exception/                   # Кастомные исключения\n│   │   │       │   ├── UserNotFoundException.java\n│   │   │       │   └── ValidationException.java\n│   │   │       └── config/                      # Конфигурация\n│   │   │           └── AppConfig.java\n│   │   └── resources/\n│   │       └── application.properties\n│   └── test/\n│       └── java/\n│           └── com/company/myapp/\n│               ├── service/\n│               │   └── UserServiceTest.java      # тест = рядом с классом\n│               └── repository/\n│                   └── UserRepositoryTest.java\n├── pom.xml (или build.gradle)\n└── .gitignore'
        },
        {
          type: 'heading',
          text: 'Соглашения по именованию'
        },
        {
          type: 'list',
          items: [
            'Пакеты: строчные буквы, com.company.project.layer (com.myapp.service)',
            'Классы: PascalCase — UserService, OrderController, ProductRepository',
            'Интерфейсы: без I-префикса — UserRepository (не IUserRepository)',
            'Реализации: суффикс описывает технологию — MySQLUserRepository, JpaProductRepository',
            'Методы: camelCase, глагол — findById, createUser, calculateTotal',
            'Константы: UPPER_SNAKE_CASE — MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE',
            'Тесты: имя_класса + Test — UserServiceTest.java'
          ]
        },
        {
          type: 'tip',
          text: 'Используй feature-based packaging как альтернативу layer-based: com.myapp.user (содержит UserController, UserService, UserRepository вместе), com.myapp.order и т.д. При большом проекте это удобнее — все файлы одной фичи рядом.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Рефакторинг монолитного кода в слои',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан монолитный класс LibraryApp, который делает всё подряд: хранит книги, управляет выдачей, форматирует вывод. Разбей его на три слоя: BookRepository (данные), LibraryService (логика), LibraryConsoleView (отображение).',
      requirements: [
        'BookRepository: хранит книги в Map<Integer, Book>, методы addBook, findById, findAll, isAvailable, markBorrowed, markReturned',
        'LibraryService: принимает BookRepository, методы borrowBook(bookId, borrower) и returnBook(bookId) с бизнес-правилами',
        'LibraryConsoleView: принимает LibraryService, метод printAvailableBooks() форматирует вывод',
        'Класс Book: id, title, author, boolean available, String currentBorrower',
        'borrowBook бросает исключение если книга не найдена или уже выдана',
        'Метод main создаёт все три слоя и демонстрирует работу'
      ],
      expectedOutput: '=== Доступные книги ===\n[1] "Чистый код" - Роберт Мартин (доступна)\n[2] "Паттерны проектирования" - Банда четырёх (доступна)\n[3] "Рефакторинг" - Мартин Фаулер (доступна)\nКнига [1] выдана: Алие\nКнига [2] выдана: Бекзату\n=== Доступные книги ===\n[3] "Рефакторинг" - Мартин Фаулер (доступна)\nКнига [1] возвращена\n=== Доступные книги ===\n[1] "Чистый код" - Роберт Мартин (доступна)\n[3] "Рефакторинг" - Мартин Фаулер (доступна)',
      hint: 'Book — простой класс с полями и getters/setters. BookRepository хранит Map<Integer, Book> и предоставляет методы доступа. LibraryService использует BookRepository через конструктор. LibraryConsoleView форматирует через StringBuilder. В main: new BookRepository() -> new LibraryService(repo) -> new LibraryConsoleView(service).',
      solution: 'import java.util.*;\n\npublic class LibraryApp {\n\n    // ===== MODEL =====\n    static class Book {\n        private final int id;\n        private final String title;\n        private final String author;\n        private boolean available;\n        private String currentBorrower;\n\n        Book(int id, String title, String author) {\n            this.id = id;\n            this.title = title;\n            this.author = author;\n            this.available = true;\n        }\n\n        public int getId() { return id; }\n        public String getTitle() { return title; }\n        public String getAuthor() { return author; }\n        public boolean isAvailable() { return available; }\n        public String getCurrentBorrower() { return currentBorrower; }\n\n        public void borrow(String borrower) {\n            this.available = false;\n            this.currentBorrower = borrower;\n        }\n\n        public void returnBook() {\n            this.available = true;\n            this.currentBorrower = null;\n        }\n    }\n\n    // ===== DATA LAYER =====\n    static class BookRepository {\n        private final Map<Integer, Book> books = new LinkedHashMap<>();\n\n        public void addBook(Book book) {\n            books.put(book.getId(), book);\n        }\n\n        public Optional<Book> findById(int id) {\n            return Optional.ofNullable(books.get(id));\n        }\n\n        public List<Book> findAll() {\n            return new ArrayList<>(books.values());\n        }\n\n        public List<Book> findAvailable() {\n            List<Book> available = new ArrayList<>();\n            for (Book book : books.values()) {\n                if (book.isAvailable()) available.add(book);\n            }\n            return available;\n        }\n    }\n\n    // ===== SERVICE LAYER =====\n    static class LibraryService {\n        private final BookRepository repository;\n\n        LibraryService(BookRepository repository) {\n            this.repository = repository;\n        }\n\n        public void borrowBook(int bookId, String borrower) {\n            Book book = repository.findById(bookId)\n                .orElseThrow(() -> new NoSuchElementException(\n                    "Книга с ID " + bookId + " не найдена"));\n\n            if (!book.isAvailable()) {\n                throw new IllegalStateException(\n                    "Книга \\"" + book.getTitle() + "\\" уже выдана: " +\n                    book.getCurrentBorrower());\n            }\n\n            book.borrow(borrower);\n            System.out.println("Книга [" + bookId + "] выдана: " + borrower);\n        }\n\n        public void returnBook(int bookId) {\n            Book book = repository.findById(bookId)\n                .orElseThrow(() -> new NoSuchElementException(\n                    "Книга с ID " + bookId + " не найдена"));\n\n            if (book.isAvailable()) {\n                throw new IllegalStateException(\n                    "Книга \\"" + book.getTitle() + "\\" не была выдана");\n            }\n\n            book.returnBook();\n            System.out.println("Книга [" + bookId + "] возвращена");\n        }\n\n        public List<Book> getAvailableBooks() {\n            return repository.findAvailable();\n        }\n    }\n\n    // ===== PRESENTATION LAYER =====\n    static class LibraryConsoleView {\n        private final LibraryService service;\n\n        LibraryConsoleView(LibraryService service) {\n            this.service = service;\n        }\n\n        public void printAvailableBooks() {\n            List<Book> books = service.getAvailableBooks();\n            StringBuilder sb = new StringBuilder("=== Доступные книги ===\\n");\n            for (Book book : books) {\n                sb.append("[").append(book.getId()).append("] ")\n                  .append("\\"").append(book.getTitle()).append("\\" - ")\n                  .append(book.getAuthor())\n                  .append(" (доступна)\\n");\n            }\n            if (sb.length() > 0 && sb.charAt(sb.length() - 1) == \'\\n\') {\n                sb.setLength(sb.length() - 1);\n            }\n            System.out.println(sb.toString());\n        }\n    }\n\n    // ===== ТОЧКА ВХОДА — сборка всех слоёв =====\n    public static void main(String[] args) {\n        // Создаём слои снизу вверх\n        BookRepository repository = new BookRepository();\n        repository.addBook(new Book(1, "Чистый код", "Роберт Мартин"));\n        repository.addBook(new Book(2, "Паттерны проектирования", "Банда четырёх"));\n        repository.addBook(new Book(3, "Рефакторинг", "Мартин Фаулер"));\n\n        LibraryService service = new LibraryService(repository);\n        LibraryConsoleView view = new LibraryConsoleView(service);\n\n        view.printAvailableBooks();\n\n        service.borrowBook(1, "Алие");\n        service.borrowBook(2, "Бекзату");\n\n        view.printAvailableBooks();\n\n        service.returnBook(1);\n\n        view.printAvailableBooks();\n    }\n}',
      explanation: 'Задача показывает ключевой архитектурный переход: от "всё в одном" к "каждый делает своё". BookRepository знает только как хранить и находить — он ничего не знает о бизнес-правилах выдачи. LibraryService знает правила: книгу нельзя выдать дважды, нельзя вернуть не выданную — но не знает как хранятся книги и как они отображаются. LibraryConsoleView знает только как форматировать для вывода в консоль. Зависимости через конструктор делают каждый слой тестируемым отдельно: можно создать LibraryService с InMemoryRepository в тестах. main собирает всё вместе — это называется "composition root", единственное место где создаются и связываются объекты.'
    },
    {
      id: 7,
      title: 'Практика: Паттерн Repository',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный паттерн Repository для сущности Product. Создай интерфейс ProductRepository, реализацию InMemoryProductRepository и класс ProductService, который работает через интерфейс. Продемонстрируй как легко заменить реализацию.',
      requirements: [
        'Интерфейс ProductRepository: save, findById, findAll, findByCategory, deleteById, count',
        'InMemoryProductRepository реализует интерфейс, хранит в Map<Long, Product>',
        'Product: id, name, category, double price, int stockCount',
        'ProductService принимает ProductRepository, методы: addProduct, getProductsByCategory, getLowStockProducts(threshold), getTotalInventoryValue',
        'getLowStockProducts возвращает товары со stockCount < threshold',
        'getTotalInventoryValue возвращает сумму price * stockCount по всем товарам'
      ],
      expectedOutput: 'Всего товаров: 4\nКатегория "Электроника": 2 товара\nМало на складе (< 5): [Ноутбук (3 шт)]\nСтоимость всего инвентаря: 434500.0\nПосле удаления: 3 товара',
      hint: 'InMemoryProductRepository.findByCategory фильтрует через for + if или stream().filter(). getLowStockProducts в Service использует findAll() и фильтрует по stockCount. getTotalInventoryValue суммирует price * stockCount через цикл или stream mapToDouble(p -> p.getPrice() * p.getStockCount()).sum().',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class ProductApp {\n\n    // ===== ENTITY =====\n    static class Product {\n        private long id;\n        private final String name;\n        private final String category;\n        private final double price;\n        private int stockCount;\n\n        Product(long id, String name, String category, double price, int stockCount) {\n            this.id = id;\n            this.name = name;\n            this.category = category;\n            this.price = price;\n            this.stockCount = stockCount;\n        }\n\n        public long getId() { return id; }\n        public void setId(long id) { this.id = id; }\n        public String getName() { return name; }\n        public String getCategory() { return category; }\n        public double getPrice() { return price; }\n        public int getStockCount() { return stockCount; }\n\n        public String toString() {\n            return name + " (" + stockCount + " шт)";\n        }\n    }\n\n    // ===== REPOSITORY INTERFACE =====\n    interface ProductRepository {\n        Product save(Product product);\n        Optional<Product> findById(long id);\n        List<Product> findAll();\n        List<Product> findByCategory(String category);\n        void deleteById(long id);\n        long count();\n    }\n\n    // ===== IN-MEMORY IMPLEMENTATION =====\n    static class InMemoryProductRepository implements ProductRepository {\n        private final Map<Long, Product> store = new LinkedHashMap<>();\n        private long nextId = 1;\n\n        public Product save(Product product) {\n            if (product.getId() == 0) {\n                product.setId(nextId++);\n            }\n            store.put(product.getId(), new Product(\n                product.getId(), product.getName(), product.getCategory(),\n                product.getPrice(), product.getStockCount()\n            ));\n            return store.get(product.getId());\n        }\n\n        public Optional<Product> findById(long id) {\n            return Optional.ofNullable(store.get(id));\n        }\n\n        public List<Product> findAll() {\n            return new ArrayList<>(store.values());\n        }\n\n        public List<Product> findByCategory(String category) {\n            List<Product> result = new ArrayList<>();\n            for (Product p : store.values()) {\n                if (p.getCategory().equalsIgnoreCase(category)) {\n                    result.add(p);\n                }\n            }\n            return result;\n        }\n\n        public void deleteById(long id) {\n            store.remove(id);\n        }\n\n        public long count() {\n            return store.size();\n        }\n    }\n\n    // ===== SERVICE =====\n    static class ProductService {\n        private final ProductRepository repository;\n\n        ProductService(ProductRepository repository) {\n            this.repository = repository;\n        }\n\n        public Product addProduct(String name, String category, double price, int stock) {\n            if (price < 0) throw new IllegalArgumentException("Цена не может быть отрицательной");\n            if (stock < 0) throw new IllegalArgumentException("Запас не может быть отрицательным");\n            Product product = new Product(0, name, category, price, stock);\n            return repository.save(product);\n        }\n\n        public List<Product> getProductsByCategory(String category) {\n            return repository.findByCategory(category);\n        }\n\n        public List<Product> getLowStockProducts(int threshold) {\n            List<Product> result = new ArrayList<>();\n            for (Product p : repository.findAll()) {\n                if (p.getStockCount() < threshold) {\n                    result.add(p);\n                }\n            }\n            return result;\n        }\n\n        public double getTotalInventoryValue() {\n            double total = 0;\n            for (Product p : repository.findAll()) {\n                total += p.getPrice() * p.getStockCount();\n            }\n            return total;\n        }\n\n        public long getProductCount() {\n            return repository.count();\n        }\n\n        public void removeProduct(long id) {\n            repository.findById(id).orElseThrow(() ->\n                new NoSuchElementException("Товар с ID " + id + " не найден"));\n            repository.deleteById(id);\n        }\n    }\n\n    // ===== MAIN =====\n    public static void main(String[] args) {\n        // Легко заменить InMemoryProductRepository на MySQLProductRepository\n        ProductRepository repository = new InMemoryProductRepository();\n        ProductService service = new ProductService(repository);\n\n        service.addProduct("Ноутбук", "Электроника", 150000.0, 3);\n        service.addProduct("Смартфон", "Электроника", 80000.0, 15);\n        service.addProduct("Стол", "Мебель", 25000.0, 8);\n        service.addProduct("Стул", "Мебель", 12500.0, 20);\n\n        System.out.println("Всего товаров: " + service.getProductCount());\n\n        List<Product> electronics = service.getProductsByCategory("Электроника");\n        System.out.println("Категория \\"Электроника\\": " + electronics.size() + " товара");\n\n        List<Product> lowStock = service.getLowStockProducts(5);\n        System.out.println("Мало на складе (< 5): " + lowStock);\n\n        System.out.println("Стоимость всего инвентаря: " + service.getTotalInventoryValue());\n\n        service.removeProduct(2);\n        System.out.println("После удаления: " + service.getProductCount() + " товара");\n    }\n}',
      explanation: 'Задача демонстрирует силу паттерна Repository через принцип замены. Строка ProductRepository repository = new InMemoryProductRepository() — единственное место где упоминается конкретная реализация. Замени её на new MySQLProductRepository() и весь остальной код (ProductService, тесты, main) работает без изменений. Это Dependency Inversion Principle из SOLID: завись от абстракции, а не от конкретики. LinkedHashMap в реализации сохраняет порядок добавления — findAll возвращает товары в том же порядке, что они были добавлены, что делает поведение предсказуемым. save возвращает сохранённый объект с присвоенным ID — важный контракт: после save у объекта есть ID который можно использовать.'
    },
    {
      id: 8,
      title: 'Практика: Правильная структура проекта с DTO',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай мини-приложение "Банк" с полной архитектурой: слои, DTO, Repository, Service. Account — внутренняя entity. AccountDTO — то что видит клиент. TransactionDTO — данные для операции. Реализуй перевод средств между счетами.',
      requirements: [
        'Account (entity): id, ownerName, String accountNumber, double balance, List<String> transactionHistory',
        'AccountDTO (только для чтения): id, ownerName, accountNumber, maskedBalance (строка с маской для сумм > 100000)',
        'TransferRequest (DTO для операции): fromAccountId, toAccountId, double amount',
        'AccountRepository: интерфейс с findById, findAll, save',
        'BankService: transfer(TransferRequest) с проверками, getAccountInfo(id) возвращает AccountDTO',
        'transfer: проверить достаточность средств, записать в transactionHistory обоих счетов'
      ],
      expectedOutput: 'Счёт 1: Алия | ACC-001 | Баланс: 50000.0\nСчёт 2: Бекзат | ACC-002 | Баланс: 30000.0\nПеревод: 10000.0 с счёта 1 на счёт 2\nСчёт 1: Алия | ACC-001 | Баланс: 40000.0\nСчёт 2: Бекзат | ACC-002 | Баланс: 40000.0\nИстория счёта 1: [Перевод -10000.0 -> ACC-002]\nОшибка: Недостаточно средств на счёте ACC-001',
      hint: 'Account хранит List<String> transactionHistory — при переводе добавляй запись в оба счёта. AccountDTO создаётся из Account в методе toDTO(Account). transfer проверяет: счета существуют, amount > 0, баланс >= amount. После успешного перевода: вычти из from, прибавь к to, добавь запись в transactionHistory.',
      solution: 'import java.util.*;\n\npublic class BankApp {\n\n    // ===== ENTITIES =====\n    static class Account {\n        private long id;\n        private final String ownerName;\n        private final String accountNumber;\n        private double balance;\n        private final List<String> transactionHistory;\n\n        Account(long id, String ownerName, String accountNumber, double initialBalance) {\n            this.id = id;\n            this.ownerName = ownerName;\n            this.accountNumber = accountNumber;\n            this.balance = initialBalance;\n            this.transactionHistory = new ArrayList<>();\n        }\n\n        public long getId() { return id; }\n        public String getOwnerName() { return ownerName; }\n        public String getAccountNumber() { return accountNumber; }\n        public double getBalance() { return balance; }\n        public List<String> getTransactionHistory() {\n            return Collections.unmodifiableList(transactionHistory);\n        }\n\n        public void debit(double amount, String description) {\n            this.balance -= amount;\n            transactionHistory.add(description);\n        }\n\n        public void credit(double amount, String description) {\n            this.balance += amount;\n            transactionHistory.add(description);\n        }\n    }\n\n    // ===== DTOs =====\n    static class AccountDTO {\n        private final long id;\n        private final String ownerName;\n        private final String accountNumber;\n        private final double balance;\n\n        AccountDTO(long id, String ownerName, String accountNumber, double balance) {\n            this.id = id;\n            this.ownerName = ownerName;\n            this.accountNumber = accountNumber;\n            this.balance = balance;\n        }\n\n        public long getId() { return id; }\n        public String getOwnerName() { return ownerName; }\n        public String getAccountNumber() { return accountNumber; }\n        public double getBalance() { return balance; }\n\n        public String toString() {\n            return ownerName + " | " + accountNumber + " | Баланс: " + balance;\n        }\n    }\n\n    static class TransferRequest {\n        private final long fromAccountId;\n        private final long toAccountId;\n        private final double amount;\n\n        TransferRequest(long fromAccountId, long toAccountId, double amount) {\n            this.fromAccountId = fromAccountId;\n            this.toAccountId = toAccountId;\n            this.amount = amount;\n        }\n\n        public long getFromAccountId() { return fromAccountId; }\n        public long getToAccountId() { return toAccountId; }\n        public double getAmount() { return amount; }\n    }\n\n    // ===== REPOSITORY =====\n    interface AccountRepository {\n        Account save(Account account);\n        Optional<Account> findById(long id);\n        List<Account> findAll();\n    }\n\n    static class InMemoryAccountRepository implements AccountRepository {\n        private final Map<Long, Account> store = new LinkedHashMap<>();\n\n        public Account save(Account account) {\n            store.put(account.getId(), account);\n            return account;\n        }\n\n        public Optional<Account> findById(long id) {\n            return Optional.ofNullable(store.get(id));\n        }\n\n        public List<Account> findAll() {\n            return new ArrayList<>(store.values());\n        }\n    }\n\n    // ===== SERVICE =====\n    static class BankService {\n        private final AccountRepository repository;\n\n        BankService(AccountRepository repository) {\n            this.repository = repository;\n        }\n\n        // Конвертация Entity -> DTO (только нужные поля наружу)\n        private AccountDTO toDTO(Account account) {\n            return new AccountDTO(\n                account.getId(),\n                account.getOwnerName(),\n                account.getAccountNumber(),\n                account.getBalance()\n            );\n        }\n\n        public AccountDTO getAccountInfo(long id) {\n            Account account = repository.findById(id)\n                .orElseThrow(() -> new NoSuchElementException("Счёт " + id + " не найден"));\n            return toDTO(account);\n        }\n\n        public void transfer(TransferRequest request) {\n            if (request.getAmount() <= 0) {\n                throw new IllegalArgumentException("Сумма перевода должна быть > 0");\n            }\n\n            Account from = repository.findById(request.getFromAccountId())\n                .orElseThrow(() -> new NoSuchElementException(\n                    "Счёт-отправитель не найден: " + request.getFromAccountId()));\n            Account to = repository.findById(request.getToAccountId())\n                .orElseThrow(() -> new NoSuchElementException(\n                    "Счёт-получатель не найден: " + request.getToAccountId()));\n\n            if (from.getBalance() < request.getAmount()) {\n                throw new IllegalStateException(\n                    "Недостаточно средств на счёте " + from.getAccountNumber());\n            }\n\n            double amount = request.getAmount();\n            from.debit(amount, "Перевод -" + amount + " -> " + to.getAccountNumber());\n            to.credit(amount, "Перевод +" + amount + " <- " + from.getAccountNumber());\n\n            System.out.println("Перевод: " + amount +\n                " с счёта " + request.getFromAccountId() +\n                " на счёт " + request.getToAccountId());\n        }\n\n        public List<String> getTransactionHistory(long accountId) {\n            Account account = repository.findById(accountId)\n                .orElseThrow(() -> new NoSuchElementException("Счёт не найден"));\n            return account.getTransactionHistory();\n        }\n    }\n\n    // ===== MAIN =====\n    public static void main(String[] args) {\n        AccountRepository repository = new InMemoryAccountRepository();\n\n        Account acc1 = new Account(1, "Алия", "ACC-001", 50000.0);\n        Account acc2 = new Account(2, "Бекзат", "ACC-002", 30000.0);\n        repository.save(acc1);\n        repository.save(acc2);\n\n        BankService service = new BankService(repository);\n\n        System.out.println("Счёт 1: " + service.getAccountInfo(1));\n        System.out.println("Счёт 2: " + service.getAccountInfo(2));\n\n        service.transfer(new TransferRequest(1, 2, 10000.0));\n\n        System.out.println("Счёт 1: " + service.getAccountInfo(1));\n        System.out.println("Счёт 2: " + service.getAccountInfo(2));\n\n        System.out.println("История счёта 1: " + service.getTransactionHistory(1));\n\n        try {\n            service.transfer(new TransferRequest(1, 2, 1000000.0));\n        } catch (IllegalStateException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Задача интегрирует все концепции модуля. Account — полная внутренняя модель: содержит transactionHistory, методы debit/credit изменяют баланс и добавляют запись атомарно. AccountDTO — внешняя проекция: клиент видит только id, имя, номер счёта и баланс. Если завтра нужно скрыть баланс от части клиентов — меняем только toDTO(), не трогая Account. TransferRequest — DTO для входящей операции: группирует параметры перевода в один объект вместо трёх отдельных параметров метода. BankService.transfer — бизнес-логика в одном месте: валидация, проверка средств, атомарное обновление обоих счетов. Если between check и debit/credit нужна транзакция БД — это один метод, легко обернуть. getTransactionHistory возвращает Collections.unmodifiableList — защитное копирование: внешний код не может изменить историю напрямую.'
    }
  ]
}
