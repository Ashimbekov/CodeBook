export default {
  id: 77,
  title: 'Best Practices: Code Review',
  description: 'Культура и техника код-ревью: как находить проблемы, давать конструктивную обратную связь, распознавать антипаттерны и правильно реагировать на замечания рецензента.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен код-ревью',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Код-ревью (code review) — процесс проверки кода коллегами перед слиянием в основную ветку. Это одна из самых эффективных практик обеспечения качества кода в команде.'
        },
        {
          type: 'heading',
          text: 'Что даёт код-ревью'
        },
        {
          type: 'list',
          items: [
            'Нахождение багов до попадания в продакшн — дешевле исправлять сейчас',
            'Распространение знаний: каждый узнаёт о частях системы, которые не писал',
            'Поддержание единого стиля кода в команде',
            'Наставничество: опытные разработчики учат начинающих',
            'Второй взгляд: автор не видит очевидных для других ошибок',
            'Документирование через комментарии в PR — история решений'
          ]
        },
        {
          type: 'heading',
          text: 'Что НЕ является целью код-ревью'
        },
        {
          type: 'list',
          items: [
            'Доказать, что ты умнее автора кода',
            'Переписать весь код "под себя"',
            'Придираться к стилю (для этого есть автоматические линтеры)',
            'Затягивать разработку бесконечными мелкими замечаниями'
          ]
        },
        {
          type: 'tip',
          text: 'Оптимальный размер PR — до 400 строк кода. Большие PR рецензируются хуже: после 400 строк концентрация рецензента падает и находится меньше реальных проблем. Разбивай большие задачи на несколько PR.'
        }
      ]
    },
    {
      id: 2,
      title: 'На что смотреть при код-ревью',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Хороший рецензент проверяет код на нескольких уровнях: от корректности логики до архитектурных решений.'
        },
        {
          type: 'heading',
          text: 'Чеклист рецензента'
        },
        {
          type: 'list',
          items: [
            'Корректность: решает ли код поставленную задачу? Есть ли граничные случаи?',
            'Читаемость: понятны ли имена переменных, методов, классов?',
            'Надёжность: обрабатываются ли ошибки и исключения?',
            'Производительность: нет ли очевидных узких мест (N+1 запросов, цикл в цикле)?',
            'Безопасность: нет ли SQL-инъекций, открытых данных, уязвимостей?',
            'Тестируемость: есть ли тесты? Покрывают ли они важные сценарии?',
            'Дублирование: не повторяет ли код уже существующую функциональность?',
            'Сложность: нет ли излишне сложных решений для простых задач?'
          ]
        },
        {
          type: 'heading',
          text: 'Пример: что найти в этом коде'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — код с типичными проблемами для ревью',
          code: 'public class UserManager {\n    // Проблема 1: магическое число\n    public boolean checkAge(int age) {\n        return age >= 18;\n    }\n\n    // Проблема 2: непонятное имя, возвращает null\n    public String proc(String s) {\n        if (s == null) return null;\n        return s.trim().toLowerCase();\n    }\n\n    // Проблема 3: нет обработки исключений, сырой тип\n    public List getUsers(String sql) {\n        // выполняет SQL запрос\n        return new ArrayList();\n    }\n\n    // Проблема 4: пустой catch, проглатывает ошибку\n    public void saveUser(User user) {\n        try {\n            database.save(user);\n        } catch (Exception e) {\n            // ничего не делаем\n        }\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — после ревью и исправлений',
          code: 'public class UserManager {\n    private static final int MINIMUM_LEGAL_AGE = 18; // именованная константа\n\n    public boolean isAdult(int age) { // понятное имя\n        return age >= MINIMUM_LEGAL_AGE;\n    }\n\n    // Понятное имя, явно нормализует email\n    public String normalizeEmail(String email) {\n        if (email == null || email.isBlank()) {\n            throw new IllegalArgumentException("Email не может быть пустым");\n        }\n        return email.trim().toLowerCase();\n    }\n\n    public List<User> getUsers() { // типизированный список\n        return userRepository.findAll();\n    }\n\n    // Ошибка пробрасывается или логируется\n    public void saveUser(User user) {\n        Objects.requireNonNull(user, "User не может быть null");\n        try {\n            database.save(user);\n        } catch (DatabaseException e) {\n            log.error("Не удалось сохранить пользователя: {}", user.getId(), e);\n            throw new ServiceException("Ошибка сохранения пользователя", e);\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Как давать конструктивную обратную связь',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Форма подачи замечаний так же важна, как и их содержание. Плохо поданный правильный комментарий создаёт конфликт и демотивирует. Хорошо поданный — помогает расти.'
        },
        {
          type: 'heading',
          text: 'Плохие комментарии в ревью'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ПЛОХО — агрессивные и бесполезные комментарии',
          code: '// Это неправильно!\n// Зачем ты так написал? Это очевидно неверно.\n// Любой нормальный разработчик знает, что так не делают.\n// Перепиши весь этот метод, он ужасен.\n// Нельзя использовать null, это плохо.'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ХОРОШО — конструктивные комментарии',
          code: '// Здесь может возникнуть NullPointerException если user == null.\n// Предлагаю добавить проверку: Objects.requireNonNull(user) или Optional.\n\n// Этот метод делает слишком много: загружает данные, фильтрует и форматирует.\n// Рассмотрим разбивку на 2-3 метода для улучшения читаемости?\n\n// Нит (необязательно): переменная "d" неинформативна.\n// Может "dayOfWeek" или "deliveryDate" точнее отражает смысл?\n\n// Вопрос: почему здесь используется LinkedList вместо ArrayList?\n// Если нет частых вставок в середину, ArrayList будет быстрее.'
        },
        {
          type: 'heading',
          text: 'Принципы конструктивного ревью'
        },
        {
          type: 'list',
          items: [
            'Критикуй код, не автора: "этот метод делает..." а не "ты написал..."',
            'Объясняй ПОЧЕМУ: "это медленно, потому что..." а не просто "это медленно"',
            'Предлагай решение: не только указывай проблему, но и показывай как исправить',
            'Разделяй обязательное и желательное: prefixы "нит:", "вопрос:", "предложение:"',
            'Хвали хорошее: если видишь элегантное решение — скажи об этом',
            'Задавай вопросы вместо утверждений: "почему здесь используется X?" вместо "нельзя использовать X"'
          ]
        },
        {
          type: 'tip',
          text: 'Используй "нит" (nit — nitpick) для мелких стилистических замечаний, которые необязательно исправлять. Это сигнализирует автору: "это не блокер, но было бы лучше". Помогает отделить критичное от желательного.'
        }
      ]
    },
    {
      id: 4,
      title: 'Антипаттерны: God Class, Long Method, Feature Envy',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Антипаттерны — устойчивые плохие решения, которые выглядят разумно, но на практике создают проблемы. Умение их распознавать — ключевой навык рецензента.'
        },
        {
          type: 'heading',
          text: 'God Class — класс, который знает всё'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — God Class',
          code: '// Класс отвечает за ВСЁ: данные, логику, UI, БД\npublic class ApplicationManager {\n    public User createUser(String name, String email) { ... }\n    public void saveUserToDatabase(User user) { ... }\n    public void sendWelcomeEmail(User user) { ... }\n    public void renderUserProfile(User user) { ... }\n    public Order createOrder(User user, List<Product> products) { ... }\n    public void processPayment(Order order, CreditCard card) { ... }\n    public void updateInventory(Order order) { ... }\n    public void generateInvoice(Order order) { ... }\n    public void sendOrderConfirmation(Order order) { ... }\n    // ... ещё 50 методов ...\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — разделение ответственности',
          code: '// Каждый класс отвечает за одну область\npublic class UserService {\n    public User createUser(String name, String email) { ... }\n}\npublic class UserRepository {\n    public void save(User user) { ... }\n}\npublic class EmailService {\n    public void sendWelcomeEmail(User user) { ... }\n}\npublic class OrderService {\n    public Order createOrder(User user, List<Product> products) { ... }\n}\npublic class PaymentService {\n    public void processPayment(Order order, CreditCard card) { ... }\n}'
        },
        {
          type: 'heading',
          text: 'Long Method — метод, который делает слишком много'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — метод на 80 строк',
          code: 'public void processOrder(Order order) {\n    // 1. Валидация (15 строк)\n    if (order == null) throw new IllegalArgumentException(...);\n    if (order.getItems().isEmpty()) throw new ...;\n    for (Item item : order.getItems()) { ... }\n\n    // 2. Подсчёт цены (20 строк)\n    double total = 0;\n    for (Item item : order.getItems()) {\n        double price = item.getPrice();\n        if (item.hasDiscount()) { ... }\n        total += price;\n    }\n    if (order.hasCoupon()) { ... }\n\n    // 3. Обработка оплаты (25 строк)\n    // ... много кода ...\n\n    // 4. Отправка уведомлений (20 строк)\n    // ... ещё много кода ...\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — декомпозиция на методы',
          code: 'public void processOrder(Order order) {\n    validateOrder(order);\n    double total = calculateTotal(order);\n    processPayment(order, total);\n    sendConfirmation(order);\n}\n\nprivate void validateOrder(Order order) { ... }\nprivate double calculateTotal(Order order) { ... }\nprivate void processPayment(Order order, double total) { ... }\nprivate void sendConfirmation(Order order) { ... }'
        },
        {
          type: 'heading',
          text: 'Feature Envy — метод, который больше интересуется чужими данными'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — Feature Envy в OrderService',
          code: 'public class OrderService {\n    // Метод OrderService использует почти только данные Customer — это Feature Envy\n    public double calculateDiscount(Order order) {\n        Customer customer = order.getCustomer();\n        int loyaltyYears = customer.getLoyaltyYears();\n        boolean isPremium = customer.isPremium();\n        int ordersCount = customer.getOrdersCount();\n        // ... вся логика основана на данных Customer ...\n        return loyaltyYears * 0.01 + (isPremium ? 0.1 : 0) + ordersCount * 0.001;\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — метод переносится в нужный класс',
          code: 'public class Customer {\n    // Метод о скидке клиента принадлежит классу Customer\n    public double calculateDiscount() {\n        return loyaltyYears * 0.01 + (premium ? 0.1 : 0) + ordersCount * 0.001;\n    }\n}\n\npublic class OrderService {\n    public double calculateDiscount(Order order) {\n        return order.getCustomer().calculateDiscount(); // просто делегируем\n    }\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Как отвечать на замечания в ревью',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Получать критику сложно. Но правильная реакция на ревью — важный профессиональный навык, который отличает хорошего командного игрока от того, кто застрял в развитии.'
        },
        {
          type: 'heading',
          text: 'Неправильные реакции'
        },
        {
          type: 'list',
          items: [
            'Защищаться и объяснять, почему рецензент неправ, без аргументов',
            'Молча исправить без ответа — рецензент не знает, понял ли ты замечание',
            'Игнорировать замечания, которые кажутся мелкими',
            'Воспринимать замечания как личные нападки'
          ]
        },
        {
          type: 'heading',
          text: 'Правильные реакции'
        },
        {
          type: 'code',
          language: 'bash',
          label: 'ХОРОШО — примеры ответов на замечания',
          code: '// Замечание: "Здесь может быть NullPointerException"\n\n// Хорошие ответы:\n"Спасибо, исправил. Добавил Objects.requireNonNull() в начале метода."\n\n"Согласен, добавил проверку. Также нашёл аналогичное место в buildOrder() и тоже исправил."\n\n"Хороший момент! Я использовал Optional<User> вместо null, смотри коммит abc123."\n\n// Если не согласен:\n"Интересное замечание. В этом конкретном случае user не может быть null,\nпотому что метод вызывается только из getUserById(),\nкоторый бросает NoSuchElementException если пользователь не найден.\nНо согласен, что явная проверка сделает это очевиднее. Добавил комментарий."\n\n// Если нужно уточнение:\n"Не до конца понял замечание — ты предлагаешь использовать\nStrategyPattern вместо switch? Можешь показать пример?"'
        },
        {
          type: 'list',
          items: [
            'Отвечай на каждый комментарий — даже если просто "Исправлено"',
            'Если согласен — исправь и опиши что сделал',
            'Если не согласен — объясни почему с аргументами, не эмоциями',
            'Если не понял — спроси, это нормально',
            'Благодари за хорошие замечания — это мотивирует рецензента',
            'Помни: рецензент критикует код, а не тебя лично'
          ]
        },
        {
          type: 'tip',
          text: 'Прежде чем отправить PR, сделай само-ревью: пройдись по своему коду как рецензент. Найди и исправь очевидные проблемы сам. Это уважение к времени коллег и ускоряет процесс ревью.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Найди проблемы в коде',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведи код-ревью класса ProductService и найди все проблемы. Реализуй метод reviewCode(String code), который возвращает список найденных проблем. Также напиши исправленную версию метода getDiscountedPrice.',
      requirements: [
        'Класс CodeReviewer с методом findIssues() — возвращает List<String> с описаниями проблем',
        'Найти минимум 5 проблем в предоставленном коде',
        'Метод getFixedDiscountedPrice(double price, int discountPercent) — исправленная версия',
        'Исправленный метод проверяет: цена > 0, скидка от 0 до 100',
        'Исправленный метод не возвращает отрицательную цену'
      ],
      expectedOutput: 'Найдено проблем: 5\n1. Метод возвращает -1 при ошибке вместо выброса исключения\n2. Нет проверки что discountPercent в диапазоне 0-100\n3. Магическое число 100 должно быть константой\n4. Нет проверки на отрицательную цену\n5. Имя переменной "d" неинформативно\nИсправленная цена (1000, 20%): 800.0\nИсправленная цена (500, 0%): 500.0\nОшибка: цена не может быть отрицательной',
      hint: 'Список проблем создай как List<String> и добавляй в него описания через add(). Для исправленного метода используй IllegalArgumentException для невалидных аргументов. Результат: price * (1 - discountPercent / 100.0).',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class CodeReviewer {\n\n    // Исходный проблемный код для ревью:\n    // public double getDiscountedPrice(double price, int discountPercent) {\n    //     if (price < 0) return -1;             // ПРОБЛЕМА 1: -1 как признак ошибки\n    //     double d = price * discountPercent;   // ПРОБЛЕМА 5: имя "d" неинформативно\n    //     d = d / 100;                          // ПРОБЛЕМА 3: магическое число 100\n    //     return price - d;                     // ПРОБЛЕМА 2: нет проверки диапазона скидки\n    //                                           // ПРОБЛЕМА 4: результат может быть < 0\n    // }\n\n    public List<String> findIssues() {\n        List<String> issues = new ArrayList<>();\n        issues.add("Метод возвращает -1 при ошибке вместо выброса исключения — " +\n                   "вызывающий код должен проверять магическое значение, легко пропустить");\n        issues.add("Нет проверки что discountPercent в диапазоне 0-100 — " +\n                   "скидка 150% даст отрицательную цену");\n        issues.add("Магическое число 100 должно быть именованной константой — " +\n                   "private static final int PERCENT_BASE = 100");\n        issues.add("Нет проверки на отрицательную цену — " +\n                   "при price < 0 возвращается -1 вместо осмысленной ошибки");\n        issues.add("Имя переменной \\"d\\" неинформативно — " +\n                   "лучше \\"discountAmount\\" или \\"discountValue\\"");\n        return issues;\n    }\n\n    private static final int PERCENT_BASE = 100;\n\n    public double getFixedDiscountedPrice(double price, int discountPercent) {\n        if (price < 0) {\n            throw new IllegalArgumentException("Цена не может быть отрицательной: " + price);\n        }\n        if (discountPercent < 0 || discountPercent > 100) {\n            throw new IllegalArgumentException(\n                "Скидка должна быть от 0 до 100, получено: " + discountPercent);\n        }\n\n        double discountAmount = price * discountPercent / PERCENT_BASE;\n        double discountedPrice = price - discountAmount;\n\n        // Защита от ошибок с плавающей точкой\n        return Math.max(0, discountedPrice);\n    }\n\n    public static void main(String[] args) {\n        CodeReviewer reviewer = new CodeReviewer();\n\n        List<String> issues = reviewer.findIssues();\n        System.out.println("Найдено проблем: " + issues.size());\n        for (int i = 0; i < issues.size(); i++) {\n            System.out.println((i + 1) + ". " + issues.get(i));\n        }\n\n        System.out.println("Исправленная цена (1000, 20%): " +\n            reviewer.getFixedDiscountedPrice(1000, 20));\n        System.out.println("Исправленная цена (500, 0%): " +\n            reviewer.getFixedDiscountedPrice(500, 0));\n\n        try {\n            reviewer.getFixedDiscountedPrice(-100, 10);\n        } catch (IllegalArgumentException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Задача учит систематическому подходу к ревью: не просто "что-то не так", а конкретные проблемы с объяснением почему это плохо. Возврат -1 как признак ошибки — антипаттерн "error code" из C, в Java принято бросать исключения. Магические числа затрудняют понимание: 100 понятен в контексте процентов, но завтра придёт другой разработчик и не поймёт. Именованная константа PERCENT_BASE самодокументирует код. Math.max(0, discountedPrice) защищает от аномалий с плавающей точкой — хорошая практика в финансовых вычислениях.'
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг по замечаниям ревью',
      type: 'practice',
      difficulty: 'medium',
      description: 'Тебе дали класс UserValidator с замечаниями от рецензента. Реализуй исправленную версию, устранив все замечания: вынеси константы, добавь нормальную обработку ошибок, избавься от God Method, улучши читаемость.',
      requirements: [
        'Константы MIN_AGE=0, MAX_AGE=150, MIN_NAME_LENGTH=2, MAX_NAME_LENGTH=100',
        'Метод validateName(String name) — проверяет имя, бросает IllegalArgumentException с понятным сообщением',
        'Метод validateAge(int age) — проверяет возраст, бросает IllegalArgumentException',
        'Метод validateEmail(String email) — проверяет что email содержит @ и точку после @',
        'Метод validateUser(String name, int age, String email) — вызывает все три метода',
        'Класс ValidationException с полем fieldName для указания какое поле не прошло валидацию'
      ],
      expectedOutput: 'Пользователь валиден\nОшибка поля [name]: Имя не может быть пустым\nОшибка поля [age]: Возраст должен быть от 0 до 150, получено: -5\nОшибка поля [email]: Email должен содержать символ @\nОшибка поля [name]: Имя слишком короткое (минимум 2 символа)',
      hint: 'ValidationException extends RuntimeException с дополнительным полем String fieldName. В конструкторе вызывай super(message). validateEmail проверяет contains("@") и что после @ есть точка: найди indexOf("@"), возьми подстроку после @ и проверь contains(".").',
      solution: 'public class UserValidator {\n\n    // Именованные константы вместо магических чисел\n    private static final int MIN_AGE = 0;\n    private static final int MAX_AGE = 150;\n    private static final int MIN_NAME_LENGTH = 2;\n    private static final int MAX_NAME_LENGTH = 100;\n\n    // Собственный тип исключения с информацией о поле\n    public static class ValidationException extends RuntimeException {\n        private final String fieldName;\n\n        public ValidationException(String fieldName, String message) {\n            super(message);\n            this.fieldName = fieldName;\n        }\n\n        public String getFieldName() {\n            return fieldName;\n        }\n    }\n\n    // Каждый метод отвечает за одно поле — Single Responsibility\n    public void validateName(String name) {\n        if (name == null || name.isBlank()) {\n            throw new ValidationException("name", "Имя не может быть пустым");\n        }\n        if (name.trim().length() < MIN_NAME_LENGTH) {\n            throw new ValidationException("name",\n                "Имя слишком короткое (минимум " + MIN_NAME_LENGTH + " символа)");\n        }\n        if (name.trim().length() > MAX_NAME_LENGTH) {\n            throw new ValidationException("name",\n                "Имя слишком длинное (максимум " + MAX_NAME_LENGTH + " символов)");\n        }\n    }\n\n    public void validateAge(int age) {\n        if (age < MIN_AGE || age > MAX_AGE) {\n            throw new ValidationException("age",\n                "Возраст должен быть от " + MIN_AGE + " до " + MAX_AGE + ", получено: " + age);\n        }\n    }\n\n    public void validateEmail(String email) {\n        if (email == null || email.isBlank()) {\n            throw new ValidationException("email", "Email не может быть пустым");\n        }\n        int atIndex = email.indexOf("@");\n        if (atIndex < 0) {\n            throw new ValidationException("email", "Email должен содержать символ @");\n        }\n        String domainPart = email.substring(atIndex + 1);\n        if (!domainPart.contains(".")) {\n            throw new ValidationException("email",\n                "Email должен содержать точку в доменной части");\n        }\n    }\n\n    // Оркестрирующий метод — вызывает специализированные валидаторы\n    public void validateUser(String name, int age, String email) {\n        validateName(name);\n        validateAge(age);\n        validateEmail(email);\n    }\n\n    public static void main(String[] args) {\n        UserValidator validator = new UserValidator();\n\n        // Валидный пользователь\n        try {\n            validator.validateUser("Алия", 25, "aliya@example.com");\n            System.out.println("Пользователь валиден");\n        } catch (ValidationException e) {\n            System.out.println("Ошибка поля [" + e.getFieldName() + "]: " + e.getMessage());\n        }\n\n        // Тест разных ошибок\n        String[][] testCases = {\n            {null, "25", "test@test.com"},     // пустое имя\n            {"Алия", "-5", "test@test.com"},   // неверный возраст\n            {"Алия", "25", "невалидный"},      // нет @\n            {"A", "25", "a@b.com"}             // имя слишком короткое\n        };\n\n        for (String[] tc : testCases) {\n            try {\n                int age = Integer.parseInt(tc[1]);\n                validator.validateUser(tc[0], age, tc[2]);\n            } catch (ValidationException e) {\n                System.out.println("Ошибка поля [" + e.getFieldName() + "]: " + e.getMessage());\n            } catch (NumberFormatException e) {\n                System.out.println("Ошибка парсинга возраста");\n            }\n        }\n    }\n}',
      explanation: 'Задача показывает типичный результат хорошего код-ревью. Кастомный ValidationException несёт больше информации, чем базовый IllegalArgumentException: fieldName позволяет клиентскому коду (например, REST API) сформировать точный ответ об ошибке. Разбивка God Method на validateName/validateAge/validateEmail — пример принципа Single Responsibility: каждый метод делает одно и знает об одном поле. Именованные константы делают ограничения читаемыми и изменяемыми в одном месте. isBlank() лучше isEmpty() — проверяет и пустую строку, и строку из пробелов.'
    }
  ]
}
