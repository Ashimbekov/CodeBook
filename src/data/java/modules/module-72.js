export default {
  id: 72,
  title: 'Лучшие практики: Именование и форматирование',
  description: 'Как правильно называть переменные, методы и классы, как форматировать код и когда писать (а когда не писать) комментарии',
  lessons: [
    {
      id: 1,
      title: 'Именование переменных — ясное намерение',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Имя переменной должно отвечать на три вопроса: зачем она существует, что делает и как используется. Если имя требует комментария — оно плохое.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — аббревиатуры и однобуквенные имена'
        },
        {
          type: 'code',
          code: '// ПЛОХО: что такое d, n, t, tmp?\npublic double calc(int[] d, int n, int t) {\n    double tmp = 0;\n    for (int i = 0; i < n; i++) {\n        tmp += d[i];\n    }\n    return tmp / t;\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — имена, выражающие намерение'
        },
        {
          type: 'code',
          code: '// ХОРОШО: код читается как текст\npublic double calculateAverageScore(int[] studentScores, int numberOfScores, int numberOfSubjects) {\n    double totalPoints = 0;\n    for (int i = 0; i < numberOfScores; i++) {\n        totalPoints += studentScores[i];\n    }\n    return totalPoints / numberOfSubjects;\n}'
        },
        {
          type: 'list',
          items: [
            'Используй полные слова: customerAge вместо custAge или ca',
            'Булевы переменные: isActive, hasPermission, canDelete — не флаг, не status',
            'Коллекции: во множественном числе — users, orderItems, productIds',
            'Временные переменные цикла: i, j, k допустимы только в простых циклах',
            'Избегай слов типа data, info, manager, handler — они ничего не говорят'
          ]
        },
        {
          type: 'warning',
          text: 'Никогда не используй l (строчная L) как имя переменной — в большинстве шрифтов она неотличима от 1 (единицы). Вместо l пиши length, limit или levelCount.'
        }
      ]
    },
    {
      id: 2,
      title: 'Именование методов — глагол + существительное',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Метод — это действие. Его имя должно начинаться с глагола и описывать, что именно он делает. Хорошее имя метода делает код читаемым как список инструкций.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — неясные имена методов'
        },
        {
          type: 'code',
          code: '// ПЛОХО: непонятно, что делают методы\npublic class OrderProcessor {\n    public void order(Order o) { ... }       // обрабатывает? создаёт? удаляет?\n    public boolean check(User u) { ... }      // что проверяет?\n    public List<Order> orders(int id) { ... } // возвращает что?\n    public void doIt(Order o) { ... }         // антипаттерн\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — глагол + существительное'
        },
        {
          type: 'code',
          code: '// ХОРОШО: имена методов описывают действие\npublic class OrderProcessor {\n    public void processOrder(Order order) { ... }               // понятно\n    public boolean hasPermissionToOrder(User user) { ... }     // булев — has/is/can\n    public List<Order> findOrdersByCustomerId(int customerId) { ... } // find — возвращает коллекцию\n    public void cancelOrder(Order order) { ... }               // отмена\n    public Order createDraftOrder(Cart cart) { ... }            // создание\n}'
        },
        {
          type: 'list',
          items: [
            'get/set — для геттеров и сеттеров',
            'find/search — методы, возвращающие данные из хранилища',
            'calculate/compute — вычисления',
            'is/has/can/should — методы, возвращающие boolean',
            'create/build/make — фабричные методы',
            'save/update/delete — операции с хранилищем'
          ]
        },
        {
          type: 'tip',
          text: 'Если метод трудно назвать одной фразой с глаголом — скорее всего, он делает слишком много вещей одновременно. Разбей его.'
        }
      ]
    },
    {
      id: 3,
      title: 'Именование классов',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Классы — это существительные. Имя класса описывает, что он представляет (сущность или концепцию), а не что он делает. Избегай суффиксов Manager, Helper, Util, Processor — они расплывчаты и сигнализируют о нарушении принципа единственной ответственности.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — размытые имена классов'
        },
        {
          type: 'code',
          code: '// ПЛОХО: что делают эти классы?\npublic class DataManager { ... }    // управляет какими данными?\npublic class UserHelper { ... }      // помогает с чем именно?\npublic class OrderUtils { ... }      // утилиты — для чего?\npublic class AbstractBaseClass { ... } // бессмысленное имя'
        },
        {
          type: 'heading',
          text: 'Хороший пример — конкретные имена'
        },
        {
          type: 'code',
          code: '// ХОРОШО: имя говорит о конкретной роли класса\npublic class CustomerRepository { ... }   // хранилище клиентов\npublic class PasswordEncoder { ... }      // кодирует пароли\npublic class OrderSummary { ... }         // сводка заказа\npublic class InvoiceGenerator { ... }     // генерирует счёт-фактуры\npublic class EmailNotificationService { ... } // сервис email-уведомлений'
        },
        {
          type: 'note',
          text: 'Исключение: суффиксы Service, Repository, Controller, Factory — устоявшиеся паттерны в разработке. Они допустимы, когда точно описывают роль класса в архитектуре.'
        }
      ]
    },
    {
      id: 4,
      title: 'Форматирование кода',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Форматирование — это про коммуникацию. Правильные отступы, расположение скобок и пустые строки делают структуру кода видимой без чтения каждой строки. В Java используется стандарт Google или Oracle Java Code Style.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — хаотичное форматирование'
        },
        {
          type: 'code',
          code: '// ПЛОХО: скобки не на своём месте, нет пустых строк, разная индентация\npublic class BankAccount\n{\nprivate double balance;\npublic BankAccount(double initialBalance){\nif(initialBalance<0){throw new IllegalArgumentException("Отрицательный баланс");}\nthis.balance=initialBalance;}\npublic void deposit(double amount){if(amount<=0){throw new IllegalArgumentException("Сумма должна быть положительной");}\nbalance+=amount;}\npublic double getBalance(){return balance;}\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — стандартное Java-форматирование'
        },
        {
          type: 'code',
          code: '// ХОРОШО: открывающая скобка на той же строке, 4 пробела отступ, пустые строки между методами\npublic class BankAccount {\n\n    private double balance;\n\n    public BankAccount(double initialBalance) {\n        if (initialBalance < 0) {\n            throw new IllegalArgumentException("Отрицательный баланс");\n        }\n        this.balance = initialBalance;\n    }\n\n    public void deposit(double amount) {\n        if (amount <= 0) {\n            throw new IllegalArgumentException("Сумма должна быть положительной");\n        }\n        balance += amount;\n    }\n\n    public double getBalance() {\n        return balance;\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Отступы: 4 пробела (не табуляция) — стандарт Java',
            'Открывающая фигурная скобка на той же строке, не на новой',
            'Пустая строка между методами для визуального разделения',
            'Пробелы вокруг операторов: a + b, не a+b',
            'Не более одного оператора на строку',
            'Длина строки: не более 100-120 символов'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Комментарии — когда писать и когда нет',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Хороший код должен быть самодокументирующимся. Комментарий, объясняющий ЧТО делает код — признак того, что код нужно упростить или переименовать. Но комментарий, объясняющий ПОЧЕМУ принято то или иное решение — часто необходим.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — комментарии вместо понятного кода'
        },
        {
          type: 'code',
          code: '// ПЛОХО: комментарии дублируют код или объясняют очевидное\npublic class UserService {\n\n    // Список пользователей\n    private List<User> users = new ArrayList<>();\n\n    // Метод добавления пользователя\n    // Принимает пользователя и добавляет его в список\n    public void addUser(User user) {\n        // Проверяем, что пользователь не null\n        if (user == null) {\n            // Если null — бросаем исключение\n            throw new IllegalArgumentException("user is null");\n        }\n        // Добавляем в список\n        users.add(user);\n    }\n\n    // i++ увеличивает i на 1\n    // x = x * 2 умножает x на 2\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — комментарии объясняют "почему"'
        },
        {
          type: 'code',
          code: '// ХОРОШО: комментарии объясняют нетривиальные решения и причины\npublic class RateLimiter {\n\n    // Используем LinkedHashMap с accessOrder=true для реализации LRU-кэша\n    // без необходимости писать собственную структуру данных\n    private final Map<String, Long> requestTimestamps =\n        new LinkedHashMap<>(16, 0.75f, true);\n\n    public boolean isAllowed(String clientId) {\n        long now = System.currentTimeMillis();\n        Long lastRequest = requestTimestamps.get(clientId);\n\n        // Ограничение: не более одного запроса в секунду на клиента\n        // Требование из спецификации API (JIRA-1234)\n        if (lastRequest != null && now - lastRequest < 1000) {\n            return false;\n        }\n\n        requestTimestamps.put(clientId, now);\n        return true;\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'ПИСАТЬ: объяснение нетривиального алгоритма или бизнес-правила',
            'ПИСАТЬ: ссылку на задачу/баг (JIRA-1234) — почему код именно такой',
            'ПИСАТЬ: предупреждение о подводных камнях (// не потокобезопасно)',
            'НЕ ПИСАТЬ: что делает метод — имя метода это уже объясняет',
            'НЕ ПИСАТЬ: очевидные вещи — // i++ увеличивает i',
            'НЕ ПИСАТЬ: закомментированный код — для этого есть git'
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Задача: Переименование плохо написанного кода',
      type: 'practice',
      difficulty: 'easy',
      description: 'Переименуй все переменные, методы и класс в приведённом коде так, чтобы он стал читаемым без комментариев. Убери очевидные комментарии.',
      requirements: [
        'Класс Lib переименовать в BookLibrary',
        'Метод a(String t, String au, int y) → addBook(String title, String author, int publicationYear)',
        'Метод f(String q) → findBooksByTitle(String searchQuery)',
        'Метод chk(Book b) → isBookAvailable(Book book)',
        'Переменная tmp → searchResults, n → bookTitle (в методе f)',
        'Удалить все комментарии, которые дублируют имена методов'
      ],
      expectedOutput: 'Добавлена книга: Чистый код (Роберт Мартин, 2008)\nДобавлена книга: Чистый архитектор (Роберт Мартин, 2017)\nНайдено книг: 2\nДоступна: true',
      hint: 'После переименования код должен читаться как обычный текст. Проверь: если убрать все комментарии, останется ли код понятным? Если да — всё сделано правильно.',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.stream.Collectors;\n\npublic class BookLibrary {\n\n    static class Book {\n        String title;\n        String author;\n        int publicationYear;\n        boolean available;\n\n        Book(String title, String author, int publicationYear) {\n            this.title = title;\n            this.author = author;\n            this.publicationYear = publicationYear;\n            this.available = true;\n        }\n    }\n\n    private List<Book> books = new ArrayList<>();\n\n    public void addBook(String title, String author, int publicationYear) {\n        books.add(new Book(title, author, publicationYear));\n        System.out.printf("Добавлена книга: %s (%s, %d)%n", title, author, publicationYear);\n    }\n\n    public List<Book> findBooksByTitle(String searchQuery) {\n        List<Book> searchResults = books.stream()\n            .filter(book -> book.title.toLowerCase().contains(searchQuery.toLowerCase()))\n            .collect(Collectors.toList());\n        System.out.println("Найдено книг: " + searchResults.size());\n        return searchResults;\n    }\n\n    public boolean isBookAvailable(Book book) {\n        return book.available;\n    }\n\n    public static void main(String[] args) {\n        BookLibrary library = new BookLibrary();\n        library.addBook("Чистый код", "Роберт Мартин", 2008);\n        library.addBook("Чистый архитектор", "Роберт Мартин", 2017);\n        List<Book> found = library.findBooksByTitle("Чистый");\n        System.out.println("Доступна: " + library.isBookAvailable(found.get(0)));\n    }\n}',
      explanation: 'После рефакторинга код читается как естественный язык: library.addBook(...), library.findBooksByTitle("Чистый"), library.isBookAvailable(book). Все комментарии, объяснявшие что делает метод, стали лишними — имена методов говорят сами за себя. Булев метод isBookAvailable следует конвенции is-префикса, что мгновенно сигнализирует: этот метод возвращает true/false.'
    },
    {
      id: 7,
      title: 'Задача: Добавление и удаление комментариев',
      type: 'practice',
      difficulty: 'medium',
      description: 'В классе PaymentProcessor: удали плохие (очевидные) комментарии и добавь полезные — объясни нетривиальные решения. Также переименуй неясные переменные.',
      requirements: [
        'Удалить комментарии, которые лишь пересказывают код',
        'Добавить комментарий, объясняющий почему комиссия рассчитывается именно так (бизнес-правило: минимальная комиссия 10 руб, иначе 2.5%)',
        'Добавить комментарий к магическому числу 0.025 → вынести в константу COMMISSION_RATE',
        'Переименовать переменную r в feeAmount, переменную ok в isPaymentSuccessful',
        'Метод pr(double a) переименовать в processPayment(double amount)'
      ],
      expectedOutput: 'Оплата 500.00 руб. Комиссия: 12.50 руб. Итого списано: 512.50 руб.\nОплата 200.00 руб. Комиссия: 10.00 руб. Итого списано: 210.00 руб.\nОшибка: сумма должна быть положительной',
      hint: 'После рефакторинга в классе должен остаться один полезный комментарий — объяснение бизнес-правила комиссии. Все остальные комментарии должны быть удалены, потому что код говорит сам за себя.',
      solution: 'public class PaymentProcessor {\n\n    // Комиссия 2.5% от суммы, но не менее 10 рублей (минимальный сбор банка-эквайера)\n    private static final double COMMISSION_RATE   = 0.025;\n    private static final double MINIMUM_COMMISSION = 10.0;\n\n    public void processPayment(double amount) {\n        if (amount <= 0) {\n            System.out.println("Ошибка: сумма должна быть положительной");\n            return;\n        }\n\n        double feeAmount = Math.max(amount * COMMISSION_RATE, MINIMUM_COMMISSION);\n        double totalCharged = amount + feeAmount;\n\n        boolean isPaymentSuccessful = charge(totalCharged);\n\n        if (isPaymentSuccessful) {\n            System.out.printf("Оплата %.2f руб. Комиссия: %.2f руб. Итого списано: %.2f руб.%n",\n                amount, feeAmount, totalCharged);\n        } else {\n            System.out.println("Ошибка: платёж отклонён");\n        }\n    }\n\n    private boolean charge(double totalAmount) {\n        return totalAmount > 0;\n    }\n\n    public static void main(String[] args) {\n        PaymentProcessor processor = new PaymentProcessor();\n        processor.processPayment(500);\n        processor.processPayment(200);\n        processor.processPayment(-50);\n    }\n}',
      explanation: 'Осталось ровно два комментария: объяснение бизнес-правила комиссии (откуда 2.5% и 10 рублей — это нетривиально, нужен контекст) и Math.max понятен без комментария. Все остальные комментарии были очевидными. Константы COMMISSION_RATE и MINIMUM_COMMISSION сделали число 0.025 именованным — теперь комментарий к нему тоже не нужен. Код читается как прозаическое описание процесса оплаты.'
    }
  ]
}
