export default {
  id: 74,
  title: 'Лучшие практики: Обработка ошибок',
  description: 'Как правильно работать с исключениями в Java: не использовать исключения для управления потоком, ловить конкретные исключения, принцип fail fast, пользовательские исключения с контекстом, правильное логирование и Optional вместо null',
  lessons: [
    {
      id: 1,
      title: 'Не используй исключения для управления потоком',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Исключения — для исключительных ситуаций, не для обычной логики. Использование try-catch вместо if-else делает код медленным (создание stacktrace дорого), трудночитаемым и скрывает настоящие ошибки.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — исключение как управление потоком'
        },
        {
          type: 'code',
          code: '// ПЛОХО: исключение используется для проверки, является ли строка числом\npublic boolean isNumber(String value) {\n    try {\n        Integer.parseInt(value);\n        return true;\n    } catch (NumberFormatException e) {\n        return false; // исключение — не ошибка, а ожидаемый результат!\n    }\n}\n\n// ПЛОХО: исключение для проверки существования элемента\npublic String getFirstElement(List<String> list) {\n    try {\n        return list.get(0);\n    } catch (IndexOutOfBoundsException e) {\n        return "пусто"; // пустой список — не исключительная ситуация\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — обычная логика без исключений'
        },
        {
          type: 'code',
          code: '// ХОРОШО: проверяем заранее без исключений\npublic boolean isNumber(String value) {\n    if (value == null || value.isEmpty()) return false;\n    for (int i = 0; i < value.length(); i++) {\n        char c = value.charAt(i);\n        if (i == 0 && c == \'-\') continue; // разрешаем отрицательные числа\n        if (!Character.isDigit(c)) return false;\n    }\n    return true;\n}\n\n// Или используем встроенный API без исключений\npublic OptionalInt parseNumber(String value) {\n    try {\n        return OptionalInt.of(Integer.parseInt(value));\n    } catch (NumberFormatException e) {\n        return OptionalInt.empty();\n    }\n}\n\n// ХОРОШО: проверяем размер до обращения по индексу\npublic String getFirstElement(List<String> list) {\n    return list.isEmpty() ? "пусто" : list.get(0);\n}'
        },
        {
          type: 'tip',
          text: 'Вопрос для самопроверки: если убрать try-catch, код всё ещё работает правильно в нормальных условиях? Если нет — исключение используется как управление потоком.'
        }
      ]
    },
    {
      id: 2,
      title: 'Перехватывай конкретные исключения',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Перехват Exception (или, тем более, Throwable) — антипаттерн. Это скрывает ошибки программиста, перехватывает неожиданные исключения и усложняет отладку. Всегда лови самое конкретное исключение, которое ты готов обработать.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — поймать всё и ничего не сделать'
        },
        {
          type: 'code',
          code: '// ПЛОХО: ловим Exception — перехватываем ВСЁ, включая NullPointerException\n// и OutOfMemoryError — потенциальные баги остаются незамеченными\npublic int readAndParseNumber(String filename) {\n    try {\n        String content = readFile(filename);  // IOException\n        return Integer.parseInt(content.trim()); // NumberFormatException, NullPointerException\n    } catch (Exception e) {  // поймали всё подряд!\n        return -1; // тихо проглотили ошибку — кошмар для отладки\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — конкретные исключения с осмысленной обработкой'
        },
        {
          type: 'code',
          code: '// ХОРОШО: каждое исключение обрабатывается отдельно и осмысленно\npublic int readAndParseNumber(String filename) throws FileProcessingException {\n    String content;\n    try {\n        content = readFile(filename);\n    } catch (IOException e) {\n        throw new FileProcessingException("Не удалось прочитать файл: " + filename, e);\n    }\n\n    if (content == null || content.trim().isEmpty()) {\n        throw new FileProcessingException("Файл пустой: " + filename);\n    }\n\n    try {\n        return Integer.parseInt(content.trim());\n    } catch (NumberFormatException e) {\n        throw new FileProcessingException(\n            "Файл содержит не число: \'" + content.trim() + "\' в файле " + filename, e);\n    }\n}'
        },
        {
          type: 'warning',
          text: 'Никогда не перехватывай Error (OutOfMemoryError, StackOverflowError) — это критические ошибки JVM, которые нельзя обработать. Перехват Throwable — только в точках верхнего уровня (main, обработчики запросов) для логирования.'
        }
      ]
    },
    {
      id: 3,
      title: 'Принцип Fail Fast',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Fail Fast: обнаружь ошибку как можно раньше и немедленно сообщи о ней. Не позволяй некорректным данным распространяться по системе. Чем раньше ошибка обнаружена — тем дешевле её исправить.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — ошибка обнаруживается поздно'
        },
        {
          type: 'code',
          code: '// ПЛОХО: null попадает в систему и вызывает NullPointerException где-то глубоко\npublic class OrderService {\n    private UserRepository userRepository;\n    private ProductRepository productRepository;\n\n    // Конструктор принимает null и молчит\n    public OrderService(UserRepository userRepository, ProductRepository productRepository) {\n        this.userRepository   = userRepository;\n        this.productRepository = productRepository;\n        // Никакой проверки — null обнаружится только при первом вызове метода\n    }\n\n    public void createOrder(int userId, int productId, int quantity) {\n        User user = userRepository.findById(userId); // NPE если userRepository == null\n        // ... 50 строк логики ...\n        Product product = productRepository.findById(productId); // NPE ещё глубже\n        // Трудно понять, где именно пошло не так\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — проверяем на входе'
        },
        {
          type: 'code',
          code: '// ХОРОШО: проверяем все предусловия сразу при создании объекта\npublic class OrderService {\n    private final UserRepository userRepository;\n    private final ProductRepository productRepository;\n\n    public OrderService(UserRepository userRepository, ProductRepository productRepository) {\n        if (userRepository == null) {\n            throw new IllegalArgumentException("userRepository не может быть null");\n        }\n        if (productRepository == null) {\n            throw new IllegalArgumentException("productRepository не может быть null");\n        }\n        this.userRepository    = userRepository;\n        this.productRepository = productRepository;\n    }\n\n    public void createOrder(int userId, int productId, int quantity) {\n        if (userId <= 0)   throw new IllegalArgumentException("Некорректный userId: " + userId);\n        if (productId <= 0) throw new IllegalArgumentException("Некорректный productId: " + productId);\n        if (quantity <= 0)  throw new IllegalArgumentException("Количество должно быть > 0, получено: " + quantity);\n\n        // Логика выполняется только с валидными данными\n        User user       = userRepository.findById(userId);\n        Product product = productRepository.findById(productId);\n        // ...\n    }\n}'
        },
        {
          type: 'note',
          text: 'В Java 7+ можно использовать Objects.requireNonNull(value, "Сообщение") — стандартный способ Fail Fast проверки на null. Для числовых диапазонов — Guava\'s Preconditions.checkArgument().'
        }
      ]
    },
    {
      id: 4,
      title: 'Пользовательские исключения с контекстом',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Собственные классы исключений позволяют добавлять контекст к ошибкам: что именно пошло не так, где, с какими данными. Это делает отладку в разы быстрее.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — стандартные исключения без контекста'
        },
        {
          type: 'code',
          code: '// ПЛОХО: общее исключение без контекста\npublic User findUser(int id) {\n    User user = database.get(id);\n    if (user == null) {\n        throw new RuntimeException("Не найдено"); // что не найдено? где?\n    }\n    return user;\n}\n\npublic Order processOrder(int userId, int orderId) {\n    User user = findUser(userId);\n    Order order = database.getOrder(orderId);\n    if (order == null) {\n        throw new RuntimeException("Не найдено"); // снова то же сообщение!\n    }\n    // ...\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — кастомные исключения с контекстом'
        },
        {
          type: 'code',
          code: '// ХОРОШО: кастомные исключения с полным контекстом\npublic class EntityNotFoundException extends RuntimeException {\n    private final String entityType;\n    private final Object entityId;\n\n    public EntityNotFoundException(String entityType, Object entityId) {\n        super(entityType + " с ID " + entityId + " не найден");\n        this.entityType = entityType;\n        this.entityId   = entityId;\n    }\n\n    public String getEntityType() { return entityType; }\n    public Object getEntityId()   { return entityId; }\n}\n\npublic class InsufficientStockException extends RuntimeException {\n    public InsufficientStockException(String productName, int requested, int available) {\n        super(String.format(\n            "Недостаточно товара \'%s\': запрошено %d, доступно %d",\n            productName, requested, available));\n    }\n}\n\n// Использование — сообщение говорит само за себя\npublic User findUser(int id) {\n    User user = database.get(id);\n    if (user == null) {\n        throw new EntityNotFoundException("Пользователь", id);\n        // "Пользователь с ID 42 не найден"\n    }\n    return user;\n}'
        },
        {
          type: 'tip',
          text: 'Иерархия исключений: создай базовое исключение для модуля (например, OrderException), а конкретные исключения наследуй от него. Это позволяет ловить и базовое, и конкретное.'
        }
      ]
    },
    {
      id: 5,
      title: 'Optional вместо null',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'null — источник NullPointerException, самой частой ошибки в Java. Optional<T> явно сигнализирует: "этот метод может не вернуть значение". Это делает API честным и заставляет вызывающий код обрабатывать оба случая.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — возврат null и его последствия'
        },
        {
          type: 'code',
          code: '// ПЛОХО: метод возвращает null — вызывающий код обязан это знать,\n// но нигде в сигнатуре это не отражено\npublic User findUserByEmail(String email) {\n    return database.findByEmail(email); // может вернуть null!\n}\n\n// Вызывающий код забыл проверить null — NPE!\npublic String getUserCity(String email) {\n    User user = findUserByEmail(email);\n    return user.getAddress().getCity(); // NPE если user или address == null\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — Optional делает возможность "нет значения" явной'
        },
        {
          type: 'code',
          code: '// ХОРОШО: Optional явно говорит "пользователь может не существовать"\npublic Optional<User> findUserByEmail(String email) {\n    User user = database.findByEmail(email);\n    return Optional.ofNullable(user);\n}\n\n// Вызывающий код ВЫНУЖДЕН обработать оба случая\npublic String getUserCity(String email) {\n    return findUserByEmail(email)\n        .map(User::getAddress)\n        .map(Address::getCity)\n        .orElse("Город не указан");\n}\n\n// Другие способы работы с Optional:\npublic void processUser(String email) {\n    Optional<User> userOpt = findUserByEmail(email);\n\n    // Если нужно выполнить действие только при наличии:\n    userOpt.ifPresent(user -> sendWelcomeEmail(user));\n\n    // Если нужно получить или бросить исключение:\n    User user = userOpt.orElseThrow(\n        () -> new EntityNotFoundException("Пользователь", email));\n\n    // Если нужен результат по умолчанию:\n    User guest = userOpt.orElse(User.guest());\n}'
        },
        {
          type: 'warning',
          text: 'Optional не для всего: не используй Optional в полях класса, в параметрах методов и в коллекциях. Optional — только для возвращаемых значений методов, которые могут не найти результат.'
        }
      ]
    },
    {
      id: 6,
      title: 'Задача: Исправить плохую обработку ошибок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Метод loadUserData содержит все антипаттерны: глотает исключения, использует Exception вместо конкретных, игнорирует ошибки. Исправь его.',
      requirements: [
        'Не использовать пустые catch-блоки (не глотать исключения)',
        'Заменить catch (Exception e) на конкретные типы исключений',
        'Добавить Fail Fast проверку входного параметра (null или пустая строка)',
        'Создать класс UserLoadException extends RuntimeException с контекстом (filename, причина)',
        'Метод должен возвращать Optional<User> вместо null'
      ],
      expectedOutput: 'Пользователь загружен: Алия, aliya@example.com\nОшибка: UserLoadException: Файл не найден: missing.txt\nОшибка: UserLoadException: filename не может быть null или пустым',
      hint: 'readFile симулирует IOException, parseUser — NumberFormatException. Оборачивай каждое в отдельный catch с понятным сообщением. Optional.of(user) при успехе.',
      solution: 'import java.util.Optional;\n\npublic class UserLoader {\n\n    static class User {\n        String name;\n        String email;\n        User(String name, String email) {\n            this.name = name;\n            this.email = email;\n        }\n    }\n\n    static class UserLoadException extends RuntimeException {\n        private final String filename;\n\n        UserLoadException(String message, String filename) {\n            super(message + ": " + filename);\n            this.filename = filename;\n        }\n\n        UserLoadException(String message, String filename, Throwable cause) {\n            super(message + ": " + filename, cause);\n            this.filename = filename;\n        }\n\n        public String getFilename() { return filename; }\n    }\n\n    // Симуляция чтения файла\n    private String readFile(String filename) throws Exception {\n        if (filename.equals("missing.txt")) {\n            throw new java.io.IOException("Файл не существует");\n        }\n        return "Алия,aliya@example.com";\n    }\n\n    // Симуляция парсинга\n    private User parseUser(String data) {\n        String[] parts = data.split(",");\n        return new User(parts[0].trim(), parts[1].trim());\n    }\n\n    public Optional<User> loadUserData(String filename) {\n        // Fail Fast: проверяем входные данные сразу\n        if (filename == null || filename.trim().isEmpty()) {\n            throw new UserLoadException("filename не может быть null или пустым", String.valueOf(filename));\n        }\n\n        String rawData;\n        try {\n            rawData = readFile(filename);\n        } catch (java.io.IOException e) {\n            throw new UserLoadException("Файл не найден", filename, e);\n        } catch (Exception e) {\n            throw new UserLoadException("Ошибка чтения файла", filename, e);\n        }\n\n        if (rawData == null || rawData.trim().isEmpty()) {\n            return Optional.empty();\n        }\n\n        User user = parseUser(rawData);\n        return Optional.of(user);\n    }\n\n    public static void main(String[] args) {\n        UserLoader loader = new UserLoader();\n\n        // Успешный случай\n        try {\n            Optional<User> result = loader.loadUserData("user.txt");\n            result.ifPresent(u -> System.out.println("Пользователь загружен: " + u.name + ", " + u.email));\n        } catch (UserLoadException e) {\n            System.out.println("Ошибка: " + e.getClass().getSimpleName() + ": " + e.getMessage());\n        }\n\n        // Файл не найден\n        try {\n            loader.loadUserData("missing.txt");\n        } catch (UserLoadException e) {\n            System.out.println("Ошибка: " + e.getClass().getSimpleName() + ": " + e.getMessage());\n        }\n\n        // Null filename\n        try {\n            loader.loadUserData(null);\n        } catch (UserLoadException e) {\n            System.out.println("Ошибка: " + e.getClass().getSimpleName() + ": " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Теперь каждая ошибка перехватывается осмысленно: IOException — проблема с файлом, остальное — непредвиденное. Fail Fast проверяет null до любой работы. Optional<User> делает API честным: возвращаем empty() если данных нет, а не null. UserLoadException несёт контекст — из сообщения ясно, какой файл вызвал проблему. Никаких тихих проглатываний ошибок.'
    },
    {
      id: 7,
      title: 'Задача: Реализовать правильную обработку ошибок для API-клиента',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй класс WeatherApiClient с правильной обработкой ошибок: кастомные исключения, Fail Fast, retry при временных ошибках, Optional для отсутствующих данных.',
      requirements: [
        'Класс WeatherApiException(String city, int statusCode, String message)',
        'Класс ConnectionException extends WeatherApiException для сетевых ошибок',
        'Метод Optional<Double> getTemperature(String city) — Fail Fast: city не null/пустой',
        'Симуляция: city="error" → ConnectionException, city="unknown" → Optional.empty(), иначе → случайная температура 15.0-30.0',
        'Метод getTemperatureWithRetry(String city, int maxAttempts): 3 попытки при ConnectionException, пауза 100ms между попытками',
        'После всех неудачных попыток — выбросить исходное исключение'
      ],
      expectedOutput: 'Температура в Алматы: 22.5°C\nДанные для \'unknown\' недоступны\nПопытка 1/3 для error — ошибка соединения\nПопытка 2/3 для error — ошибка соединения\nПопытка 3/3 для error — ошибка соединения\nConnectionException после 3 попыток: Нет соединения с API: error',
      hint: 'getTemperatureWithRetry использует цикл for(int attempt=1; attempt<=maxAttempts; attempt++). При ConnectionException: логируй попытку, sleep(100), продолжай цикл. После цикла — rethrow последнего исключения.',
      solution: 'import java.util.Optional;\n\npublic class WeatherApiClient {\n\n    static class WeatherApiException extends RuntimeException {\n        private final String city;\n        private final int statusCode;\n\n        WeatherApiException(String city, int statusCode, String message) {\n            super(message + ": " + city);\n            this.city = city;\n            this.statusCode = statusCode;\n        }\n\n        WeatherApiException(String city, int statusCode, String message, Throwable cause) {\n            super(message + ": " + city, cause);\n            this.city = city;\n            this.statusCode = statusCode;\n        }\n\n        public String getCity()    { return city; }\n        public int getStatusCode() { return statusCode; }\n    }\n\n    static class ConnectionException extends WeatherApiException {\n        ConnectionException(String city) {\n            super(city, 503, "Нет соединения с API");\n        }\n    }\n\n    public Optional<Double> getTemperature(String city) {\n        if (city == null || city.trim().isEmpty()) {\n            throw new IllegalArgumentException("Название города не может быть null или пустым");\n        }\n\n        if (city.equals("error")) {\n            throw new ConnectionException(city);\n        }\n\n        if (city.equals("unknown")) {\n            return Optional.empty();\n        }\n\n        // Симуляция успешного ответа: температура 15.0–30.0\n        double temperature = 15.0 + (city.hashCode() & 0xFF) % 15;\n        return Optional.of(temperature);\n    }\n\n    public double getTemperatureWithRetry(String city, int maxAttempts) {\n        ConnectionException lastException = null;\n\n        for (int attempt = 1; attempt <= maxAttempts; attempt++) {\n            try {\n                return getTemperature(city)\n                    .orElseThrow(() -> new WeatherApiException(city, 404, "Данные не найдены"));\n            } catch (ConnectionException e) {\n                lastException = e;\n                System.out.printf("Попытка %d/%d для %s — ошибка соединения%n", attempt, maxAttempts, city);\n                if (attempt < maxAttempts) {\n                    try {\n                        Thread.sleep(100);\n                    } catch (InterruptedException ie) {\n                        Thread.currentThread().interrupt();\n                        throw new WeatherApiException(city, 0, "Прервано", ie);\n                    }\n                }\n            }\n        }\n\n        throw lastException;\n    }\n\n    public static void main(String[] args) {\n        WeatherApiClient client = new WeatherApiClient();\n\n        // Успешный запрос\n        try {\n            Optional<Double> temp = client.getTemperature("Алматы");\n            temp.ifPresent(t -> System.out.printf("Температура в Алматы: %.1f°C%n", t));\n        } catch (WeatherApiException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n\n        // Нет данных\n        try {\n            Optional<Double> temp = client.getTemperature("unknown");\n            if (temp.isEmpty()) System.out.println("Данные для \'unknown\' недоступны");\n        } catch (WeatherApiException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n\n        // Retry при ошибке соединения\n        try {\n            client.getTemperatureWithRetry("error", 3);\n        } catch (ConnectionException e) {\n            System.out.println("ConnectionException после 3 попыток: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Клиент демонстрирует несколько паттернов обработки ошибок. Иерархия исключений: ConnectionException extends WeatherApiException — позволяет ловить оба уровня. Retry только для восстанавливаемых ошибок (ConnectionException) — сетевые сбои временны. Thread.currentThread().interrupt() при InterruptedException — обязательное правило, не глотать прерывание. Optional.orElseThrow в retry — если данных нет, это тоже ошибка в контексте retry. Fail Fast в начале getTemperature избавляет от NullPointerException где-то глубже.'
    }
  ]
}
