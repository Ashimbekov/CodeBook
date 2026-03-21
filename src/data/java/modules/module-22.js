export default {
  id: 22,
  title: 'Собственные исключения',
  description: 'Создание пользовательских классов исключений для описания бизнес-ошибок',
  lessons: [
    {
      id: 1,
      title: 'Зачем создавать собственные исключения?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартные исключения Java (IOException, NullPointerException) описывают технические проблемы. Но в реальном приложении бывают бизнес-ошибки: "Недостаточно средств", "Товар не найден", "Недостаточный возраст". Для них и создают свои исключения.' },
        { type: 'tip', value: 'Стандартное исключение — как надпись "Ошибка". Своё исключение — как точная надпись "Срок действия карты истёк. Обратитесь в банк." Чем конкретнее ошибка, тем легче её обработать и понять пользователю.' },
        { type: 'heading', value: 'Зачем нужны свои исключения' },
        { type: 'list', items: [
          'Описывают конкретную бизнес-ошибку понятным именем',
          'Можно добавить дополнительные поля (код ошибки, связанный объект)',
          'Легче ловить только нужный тип ошибки',
          'Документируют что может пойти не так в API'
        ]},
        { type: 'code', language: 'java', value: '// БЕЗ своего исключения — непонятно\ntry {\n    bankAccount.withdraw(5000);\n} catch (IllegalStateException e) {\n    // Что за IllegalStateException? Баланс? Блокировка? Лимит?\n    System.out.println("Что-то пошло не так");\n}\n\n// СО своим исключением — всё ясно\ntry {\n    bankAccount.withdraw(5000);\n} catch (InsufficientFundsException e) {\n    System.out.println("Не хватает " + e.getShortfall() + " тг");\n} catch (AccountBlockedException e) {\n    System.out.println("Счёт заблокирован с " + e.getBlockDate());\n}' }
      ]
    },
    {
      id: 2,
      title: 'Создание класса исключения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы создать своё исключение, нужно создать класс, который extends Exception (или RuntimeException). Это всё! Дальше можно добавлять поля и методы.' },
        { type: 'heading', value: 'Минимальное исключение' },
        { type: 'code', language: 'java', value: '// Самый простой вариант\npublic class ProductNotFoundException extends RuntimeException {\n    public ProductNotFoundException(String message) {\n        super(message); // Передаём сообщение в родительский класс\n    }\n}\n\n// Использование\npublic Product findProduct(String id) {\n    // Поиск товара...\n    if (product == null) {\n        throw new ProductNotFoundException("Товар с ID " + id + " не найден");\n    }\n    return product;\n}' },
        { type: 'heading', value: 'Исключение с дополнительными полями' },
        { type: 'code', language: 'java', value: 'public class InsufficientFundsException extends Exception {\n    private double requested;  // Запрошенная сумма\n    private double available;  // Доступная сумма\n\n    // Конструктор с информацией об ошибке\n    public InsufficientFundsException(double requested, double available) {\n        super("Недостаточно средств: запрошено " + requested + " тг, доступно " + available + " тг");\n        this.requested = requested;\n        this.available = available;\n    }\n\n    // Геттеры для доступа к деталям\n    public double getRequested() { return requested; }\n    public double getAvailable() { return available; }\n\n    // Удобный метод\n    public double getShortfall() {\n        return requested - available;\n    }\n}\n\n// Использование\npublic class BankAccount {\n    private double balance;\n    private String owner;\n\n    public BankAccount(String owner, double balance) {\n        this.owner = owner;\n        this.balance = balance;\n    }\n\n    public void withdraw(double amount) throws InsufficientFundsException {\n        if (amount > balance) {\n            throw new InsufficientFundsException(amount, balance);\n        }\n        balance -= amount;\n        System.out.println("Снято: " + amount + " тг. Баланс: " + balance);\n    }\n}\n\n// Обработка с полной информацией\nBankAccount acc = new BankAccount("Нурдаулет", 1000);\ntry {\n    acc.withdraw(1500);\n} catch (InsufficientFundsException e) {\n    System.out.println("Ошибка: " + e.getMessage());\n    System.out.println("Не хватает: " + e.getShortfall() + " тг");\n}' }
      ]
    },
    {
      id: 3,
      title: 'Exception vs RuntimeException',
      type: 'theory',
      content: [
        { type: 'text', value: 'При создании своего исключения нужно выбрать: extends Exception (checked) или extends RuntimeException (unchecked). Это важный архитектурный выбор.' },
        { type: 'heading', value: 'Когда extends Exception (checked)' },
        { type: 'list', items: [
          'Ошибка предсказуема и клиент ДОЛЖЕН её обработать',
          'Ошибка из внешней среды (файл, сеть, база данных)',
          'Клиент может разумно восстановиться после ошибки',
          'Примеры: FileNotFoundException, SQLException'
        ]},
        { type: 'code', language: 'java', value: '// Checked — клиент обязан обработать\npublic class NetworkException extends Exception {\n    private int errorCode;\n\n    public NetworkException(String message, int errorCode) {\n        super(message);\n        this.errorCode = errorCode;\n    }\n\n    public int getErrorCode() { return errorCode; }\n}\n\n// Обязателен try-catch или throws\npublic void sendRequest(String url) throws NetworkException {\n    if (url == null) {\n        throw new NetworkException("URL не может быть null", 400);\n    }\n    System.out.println("Отправляем запрос на " + url);\n}' },
        { type: 'heading', value: 'Когда extends RuntimeException (unchecked)' },
        { type: 'list', items: [
          'Ошибка из-за неверного использования API программистом',
          'Клиент не может разумно восстановиться',
          'Ошибка нарушает логику программы',
          'Примеры: IllegalArgumentException, IllegalStateException'
        ]},
        { type: 'code', language: 'java', value: '// Unchecked — не обязателен try-catch\npublic class ValidationException extends RuntimeException {\n    private String fieldName;\n    private Object invalidValue;\n\n    public ValidationException(String fieldName, Object invalidValue, String message) {\n        super("Поле \'" + fieldName + "\': " + message + ". Получено: " + invalidValue);\n        this.fieldName = fieldName;\n        this.invalidValue = invalidValue;\n    }\n\n    public String getFieldName() { return fieldName; }\n    public Object getInvalidValue() { return invalidValue; }\n}\n\n// Можно использовать без try-catch\npublic void setAge(int age) {\n    if (age < 0 || age > 150) {\n        throw new ValidationException("age", age, "должен быть от 0 до 150");\n    }\n    this.age = age;\n}' },
        { type: 'tip', value: 'Современная тенденция — предпочитать unchecked exceptions. Они не загромождают код обязательными try-catch и throws. Checked exceptions используй только когда клиент действительно должен обработать ошибку.' }
      ]
    },
    {
      id: 4,
      title: 'Иерархия своих исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'В больших приложениях создают иерархию исключений. Базовый класс для всех ошибок приложения, и конкретные подклассы. Это позволяет ловить как конкретные, так и все ошибки приложения сразу.' },
        { type: 'code', language: 'java', value: '// Базовое исключение приложения\npublic class AppException extends RuntimeException {\n    private final String errorCode;\n\n    public AppException(String errorCode, String message) {\n        super(message);\n        this.errorCode = errorCode;\n    }\n\n    public AppException(String errorCode, String message, Throwable cause) {\n        super(message, cause); // cause — исходное исключение\n        this.errorCode = errorCode;\n    }\n\n    public String getErrorCode() { return errorCode; }\n}\n\n// Подкласс для ошибок пользователей\npublic class UserException extends AppException {\n    public UserException(String code, String message) {\n        super(code, message);\n    }\n}\n\n// Конкретные исключения\npublic class UserNotFoundException extends UserException {\n    private final String userId;\n\n    public UserNotFoundException(String userId) {\n        super("USER_NOT_FOUND", "Пользователь с ID " + userId + " не найден");\n        this.userId = userId;\n    }\n\n    public String getUserId() { return userId; }\n}\n\npublic class UserAlreadyExistsException extends UserException {\n    public UserAlreadyExistsException(String email) {\n        super("USER_EXISTS", "Пользователь с email " + email + " уже существует");\n    }\n}\n\n// Подкласс для ошибок продуктов\npublic class ProductException extends AppException {\n    public ProductException(String code, String message) {\n        super(code, message);\n    }\n}\n\npublic class OutOfStockException extends ProductException {\n    public OutOfStockException(String productName) {\n        super("OUT_OF_STOCK", "Товар \'" + productName + "\' закончился на складе");\n    }\n}' },
        { type: 'code', language: 'java', value: '// Можно ловить по-разному\ntry {\n    // операция\n} catch (UserNotFoundException e) {\n    // Конкретная ошибка\n} catch (UserException e) {\n    // Любая ошибка пользователя\n} catch (AppException e) {\n    // Любая ошибка приложения\n    System.out.println("Код ошибки: " + e.getErrorCode());\n}' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Банковская система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай банковскую систему с иерархией собственных исключений.',
      requirements: [
        'Базовое исключение BankException extends Exception с полем errorCode',
        'InsufficientFundsException extends BankException — нехватка средств, дополнительное поле shortfall',
        'AccountNotFoundException extends BankException — счёт не найден, поле accountId',
        'AccountBlockedException extends BankException — счёт заблокирован',
        'Класс BankAccount с полями: id, owner, balance, isBlocked',
        'Методы: deposit(double), withdraw(double) throws BankException',
        'Класс Bank с методами: addAccount, findAccount throws AccountNotFoundException, transfer'
      ],
      expectedOutput: 'Счёт найден: ACC001 (Нурдаулет)\nПополнено: 5000.0. Баланс: 15000.0\nСнято: 3000.0. Баланс: 12000.0\nОшибка [INSUFFICIENT_FUNDS]: Не хватает 5000.0 тг\nОшибка [ACCOUNT_BLOCKED]: Счёт заблокирован\nОшибка [ACCOUNT_NOT_FOUND]: Счёт ACC999 не найден',
      hint: 'BankException принимает errorCode и message, передаёт в super(message). InsufficientFundsException вычисляет shortfall = requested - balance.',
      solution: 'public class BankException extends Exception {\n    private final String errorCode;\n    public BankException(String errorCode, String message) {\n        super(message);\n        this.errorCode = errorCode;\n    }\n    public String getErrorCode() { return errorCode; }\n}\n\npublic class InsufficientFundsException extends BankException {\n    private final double shortfall;\n    public InsufficientFundsException(double requested, double available) {\n        super("INSUFFICIENT_FUNDS", "Недостаточно средств: запрошено " + requested + ", доступно " + available);\n        this.shortfall = requested - available;\n    }\n    public double getShortfall() { return shortfall; }\n}\n\npublic class AccountNotFoundException extends BankException {\n    private final String accountId;\n    public AccountNotFoundException(String accountId) {\n        super("ACCOUNT_NOT_FOUND", "Счёт " + accountId + " не найден");\n        this.accountId = accountId;\n    }\n    public String getAccountId() { return accountId; }\n}\n\npublic class AccountBlockedException extends BankException {\n    public AccountBlockedException(String accountId) {\n        super("ACCOUNT_BLOCKED", "Счёт заблокирован");\n    }\n}\n\npublic class BankAccount {\n    String id, owner;\n    double balance;\n    boolean isBlocked;\n\n    public BankAccount(String id, String owner, double initialBalance) {\n        this.id = id;\n        this.owner = owner;\n        this.balance = initialBalance;\n        this.isBlocked = false;\n    }\n\n    public void deposit(double amount) throws BankException {\n        if (isBlocked) throw new AccountBlockedException(id);\n        balance += amount;\n        System.out.println("Пополнено: " + amount + ". Баланс: " + balance);\n    }\n\n    public void withdraw(double amount) throws BankException {\n        if (isBlocked) throw new AccountBlockedException(id);\n        if (amount > balance) throw new InsufficientFundsException(amount, balance);\n        balance -= amount;\n        System.out.println("Снято: " + amount + ". Баланс: " + balance);\n    }\n}\n\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class Bank {\n    Map<String, BankAccount> accounts = new HashMap<>();\n\n    void addAccount(BankAccount account) {\n        accounts.put(account.id, account);\n    }\n\n    BankAccount findAccount(String id) throws AccountNotFoundException {\n        BankAccount account = accounts.get(id);\n        if (account == null) throw new AccountNotFoundException(id);\n        return account;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Bank bank = new Bank();\n        BankAccount acc1 = new BankAccount("ACC001", "Нурдаулет", 10000);\n        BankAccount acc2 = new BankAccount("ACC002", "Айгерим", 5000);\n        acc2.isBlocked = true;\n        bank.addAccount(acc1);\n        bank.addAccount(acc2);\n\n        try {\n            BankAccount found = bank.findAccount("ACC001");\n            System.out.println("Счёт найден: " + found.id + " (" + found.owner + ")");\n            found.deposit(5000);\n            found.withdraw(3000);\n            found.withdraw(20000);\n        } catch (BankException e) {\n            System.out.println("Ошибка [" + e.getErrorCode() + "]: " +\n                (e instanceof InsufficientFundsException ? "Не хватает " + ((InsufficientFundsException)e).getShortfall() + " тг" : e.getMessage()));\n        }\n\n        try {\n            bank.findAccount("ACC002").deposit(100);\n        } catch (BankException e) {\n            System.out.println("Ошибка [" + e.getErrorCode() + "]: " + e.getMessage());\n        }\n\n        try {\n            bank.findAccount("ACC999");\n        } catch (AccountNotFoundException e) {\n            System.out.println("Ошибка [" + e.getErrorCode() + "]: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Иерархия BankException -> InsufficientFundsException/AccountNotFoundException/AccountBlockedException позволяет ловить ошибки как конкретно, так и через базовый класс. Дополнительные поля (shortfall, accountId) дают контекст для обработки ошибки. errorCode удобен для логирования и API ответов.'
    },
    {
      id: 6,
      title: 'Практика: Валидатор данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему валидации с пользовательскими исключениями и сбором всех ошибок.',
      requirements: [
        'Класс ValidationException extends RuntimeException с полями fieldName и value',
        'Класс MultiValidationException extends RuntimeException — содержит список ValidationException',
        'Класс UserValidator с методами validateName, validateEmail, validateAge, validateAll',
        'validateAll собирает ВСЕ ошибки и бросает MultiValidationException если есть хотя бы одна',
        'Email должен содержать @, имя — минимум 2 символа, возраст — от 0 до 120',
        'Протестируй с некорректными данными'
      ],
      expectedOutput: 'Валидация прошла успешно: Нурдаулет, 25\nНайдено 3 ошибки:\n- name: Слишком короткое имя (мин. 2 символа). Получено: X\n- email: Email должен содержать @. Получено: notanemail\n- age: Возраст должен быть от 0 до 120. Получено: 200',
      hint: 'В validateAll создай List<ValidationException> errors. В каждом методе validateXxx добавляй ошибку в список вместо броска. После всех проверок if (!errors.isEmpty()) throw new MultiValidationException(errors)',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class ValidationException extends RuntimeException {\n    private final String fieldName;\n    private final Object value;\n\n    public ValidationException(String fieldName, Object value, String message) {\n        super(message);\n        this.fieldName = fieldName;\n        this.value = value;\n    }\n\n    public String getFieldName() { return fieldName; }\n    public Object getValue() { return value; }\n\n    public String toString() {\n        return "- " + fieldName + ": " + getMessage() + ". Получено: " + value;\n    }\n}\n\npublic class MultiValidationException extends RuntimeException {\n    private final List<ValidationException> errors;\n\n    public MultiValidationException(List<ValidationException> errors) {\n        super("Найдено " + errors.size() + " ошибок(и)");\n        this.errors = new ArrayList<>(errors);\n    }\n\n    public List<ValidationException> getErrors() { return errors; }\n    public int getErrorCount() { return errors.size(); }\n}\n\npublic class UserValidator {\n    public ValidationException validateName(String name) {\n        if (name == null || name.length() < 2) {\n            return new ValidationException("name", name, "Слишком короткое имя (мин. 2 символа)");\n        }\n        return null;\n    }\n\n    public ValidationException validateEmail(String email) {\n        if (email == null || !email.contains("@")) {\n            return new ValidationException("email", email, "Email должен содержать @");\n        }\n        return null;\n    }\n\n    public ValidationException validateAge(int age) {\n        if (age < 0 || age > 120) {\n            return new ValidationException("age", age, "Возраст должен быть от 0 до 120");\n        }\n        return null;\n    }\n\n    public void validateAll(String name, String email, int age) {\n        List<ValidationException> errors = new ArrayList<>();\n        ValidationException nameError = validateName(name);\n        if (nameError != null) errors.add(nameError);\n        ValidationException emailError = validateEmail(email);\n        if (emailError != null) errors.add(emailError);\n        ValidationException ageError = validateAge(age);\n        if (ageError != null) errors.add(ageError);\n        if (!errors.isEmpty()) throw new MultiValidationException(errors);\n        System.out.println("Валидация прошла успешно: " + name + ", " + age);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        UserValidator validator = new UserValidator();\n        validator.validateAll("Нурдаулет", "nur@mail.com", 25);\n        try {\n            validator.validateAll("X", "notanemail", 200);\n        } catch (MultiValidationException e) {\n            System.out.println("Найдено " + e.getErrorCount() + " ошибки:");\n            for (ValidationException err : e.getErrors()) {\n                System.out.println(err);\n            }\n        }\n    }\n}',
      explanation: 'MultiValidationException — продвинутый паттерн: вместо остановки на первой ошибке, собираем все ошибки и бросаем одно исключение со списком. Это удобно для форм — пользователь видит сразу все проблемы, а не исправляет по одной. Паттерн часто используется в фреймворках валидации (Bean Validation, Spring).'
    }
  ]
}
