export default {
  id: 75,
  title: 'Лучшие практики: Тестирование (JUnit)',
  description: 'Основы автоматического тестирования в Java с JUnit 5: зачем тестировать, аннотации @Test, утверждения (assertions), паттерн AAA, соглашения именования тестов, @BeforeEach/@AfterEach, тестирование граничных случаев',
  lessons: [
    {
      id: 1,
      title: 'Зачем тестировать и что такое JUnit',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Автоматические тесты — это код, который проверяет другой код. Они позволяют уверенно вносить изменения, не боясь сломать то, что уже работало. JUnit — стандартный фреймворк тестирования в Java.'
        },
        {
          type: 'heading',
          text: 'Без тестов vs. С тестами'
        },
        {
          type: 'code',
          code: '// БЕЗ ТЕСТОВ: проверяем руками каждый раз\npublic class Calculator {\n    public int add(int a, int b) { return a + b; }\n}\n// Проверка: запускаем main, смотрим на вывод...\n// После каждого изменения — снова руками...\n\n// С ТЕСТАМИ JUnit 5: проверка автоматическая, запускается за секунды\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass CalculatorTest {\n    @Test\n    void add_twoPositiveNumbers_returnsSum() {\n        Calculator calculator = new Calculator();\n        int result = calculator.add(2, 3);\n        assertEquals(5, result);\n    }\n\n    @Test\n    void add_negativeAndPositive_returnsCorrectSum() {\n        Calculator calculator = new Calculator();\n        assertEquals(-1, calculator.add(-3, 2));\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Уверенный рефакторинг: тесты покажут, если что-то сломалось',
            'Документация: тесты показывают, как использовать код',
            'Быстрая обратная связь: тест запускается за миллисекунды',
            'Меньше багов в продакшене: проблемы ловятся на этапе разработки'
          ]
        },
        {
          type: 'note',
          text: 'Для добавления JUnit 5 в Maven-проект добавь зависимость: <dependency><groupId>org.junit.jupiter</groupId><artifactId>junit-jupiter</artifactId><version>5.10.0</version><scope>test</scope></dependency>'
        }
      ]
    },
    {
      id: 2,
      title: 'Аннотация @Test и основные утверждения',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Каждый тестовый метод помечается @Test. Утверждения (assertions) проверяют результат и выбрасывают AssertionError при неудаче, останавливая тест. JUnit 5 предоставляет богатый набор методов в классе Assertions.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — ручная проверка вместо assertions'
        },
        {
          type: 'code',
          code: '// ПЛОХО: ручная проверка не даёт понятного сообщения об ошибке\n@Test\nvoid testDivide() {\n    Calculator calc = new Calculator();\n    double result = calc.divide(10, 2);\n    if (result != 5.0) {\n        System.out.println("ОШИБКА: ожидалось 5.0, получено " + result);\n        // Тест НЕ провалится! JUnit не знает об этой проверке\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — стандартные assertions JUnit 5'
        },
        {
          type: 'code',
          code: '// ХОРОШО: используем assertions — тест провалится с понятным сообщением\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass AssertionsExampleTest {\n\n    @Test\n    void assertEquals_checkExactEquality() {\n        assertEquals(5, 2 + 3);                          // числа\n        assertEquals("привет", "при" + "вет");           // строки\n        assertEquals(5.0, 10.0 / 2.0, 0.001);           // double с погрешностью\n    }\n\n    @Test\n    void assertTrue_assertFalse_checkBooleans() {\n        assertTrue(5 > 3, "5 должно быть больше 3");\n        assertFalse("hello".isEmpty(), "строка не должна быть пустой");\n    }\n\n    @Test\n    void assertNull_assertNotNull_checkNullability() {\n        String nullValue = null;\n        assertNull(nullValue);\n        assertNotNull("значение", "значение не должно быть null");\n    }\n\n    @Test\n    void assertThrows_checkExceptionIsThrown() {\n        Calculator calc = new Calculator();\n        // Проверяем, что метод БРОСАЕТ нужное исключение\n        ArithmeticException exception = assertThrows(\n            ArithmeticException.class,\n            () -> calc.divide(10, 0)\n        );\n        assertEquals("Деление на ноль", exception.getMessage());\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Всегда добавляй сообщение к assertion: assertEquals(5, result, "Сумма 2+3 должна равняться 5"). При падении теста сообщение сразу скажет, что именно проверялось.'
        }
      ]
    },
    {
      id: 3,
      title: 'Паттерн AAA — Arrange, Act, Assert',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'AAA — стандартная структура теста: Arrange (подготовить данные), Act (выполнить действие), Assert (проверить результат). Эта структура делает тест читаемым и понятным.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — каша из подготовки, действий и проверок'
        },
        {
          type: 'code',
          code: '// ПЛОХО: трудно понять, что именно тестируется\n@Test\nvoid testShoppingCart() {\n    ShoppingCart cart = new ShoppingCart();\n    assertEquals(0, cart.getTotal());\n    cart.addItem("Книга", 500);\n    cart.addItem("Ручка", 50);\n    assertTrue(cart.getTotal() > 0);\n    cart.removeItem("Ручка");\n    assertEquals(1, cart.getItemCount());\n    assertEquals(500, cart.getTotal());\n    cart.applyDiscount(10);\n    assertEquals(450.0, cart.getTotal());\n    // Что именно тестируем? Всё сразу!?\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — каждый тест проверяет одно, структура AAA'
        },
        {
          type: 'code',
          code: '// ХОРОШО: три отдельных теста, каждый с AAA-структурой\n@Test\nvoid addItem_newItem_increasesTotal() {\n    // Arrange — подготовка\n    ShoppingCart cart = new ShoppingCart();\n\n    // Act — действие\n    cart.addItem("Книга", 500);\n\n    // Assert — проверка\n    assertEquals(500, cart.getTotal(), "Общая сумма должна равняться цене добавленного товара");\n}\n\n@Test\nvoid removeItem_existingItem_decreasesItemCount() {\n    // Arrange\n    ShoppingCart cart = new ShoppingCart();\n    cart.addItem("Книга", 500);\n    cart.addItem("Ручка", 50);\n\n    // Act\n    cart.removeItem("Ручка");\n\n    // Assert\n    assertEquals(1, cart.getItemCount(), "После удаления должен остаться 1 товар");\n    assertEquals(500, cart.getTotal(), "Сумма должна уменьшиться до цены оставшегося товара");\n}\n\n@Test\nvoid applyDiscount_tenPercent_reducesTotalByTenPercent() {\n    // Arrange\n    ShoppingCart cart = new ShoppingCart();\n    cart.addItem("Товар", 500);\n\n    // Act\n    cart.applyDiscount(10);\n\n    // Assert\n    assertEquals(450.0, cart.getTotal(), 0.01, "Скидка 10% от 500 должна дать 450");\n}'
        },
        {
          type: 'note',
          text: 'Правило: один тест — одна проверка одного поведения. Если тест падает, сразу ясно что именно сломалось. Несколько assertEquals в одном тесте — допустимо, если они все проверяют один результат одного действия.'
        }
      ]
    },
    {
      id: 4,
      title: 'Именование тестов и @BeforeEach/@AfterEach',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Название теста должно описывать: что тестируется, при каком условии, какой ожидается результат. @BeforeEach выполняется перед каждым тестом — для подготовки общих данных. @AfterEach — после каждого, для очистки.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — непонятные имена тестов'
        },
        {
          type: 'code',
          code: '// ПЛОХО: имена ничего не говорят о том, что тестируется\n@Test\nvoid test1() { ... }\n\n@Test\nvoid testAdd() { ... }\n\n@Test\nvoid testError() { ... }'
        },
        {
          type: 'heading',
          text: 'Хороший пример — описательные имена и @BeforeEach'
        },
        {
          type: 'code',
          code: '// ХОРОШО: имя = метод_условие_ожидаемыйРезультат\nimport org.junit.jupiter.api.BeforeEach;\nimport org.junit.jupiter.api.AfterEach;\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass BankAccountTest {\n\n    private BankAccount account; // общий объект для всех тестов\n\n    @BeforeEach\n    void setUp() {\n        // Выполняется перед КАЖДЫМ тестом — свежий объект каждый раз\n        account = new BankAccount(1000.0);\n    }\n\n    @AfterEach\n    void tearDown() {\n        // Выполняется после КАЖДОГО теста — очистка ресурсов\n        // Например: закрыть соединение с тестовой БД\n        account = null;\n    }\n\n    @Test\n    void deposit_positiveAmount_increasesBalance() {\n        account.deposit(500);\n        assertEquals(1500.0, account.getBalance());\n    }\n\n    @Test\n    void deposit_negativeAmount_throwsIllegalArgumentException() {\n        assertThrows(IllegalArgumentException.class, () -> account.deposit(-100));\n    }\n\n    @Test\n    void withdraw_amountLessThanBalance_decreasesBalance() {\n        account.withdraw(300);\n        assertEquals(700.0, account.getBalance());\n    }\n\n    @Test\n    void withdraw_amountGreaterThanBalance_throwsInsufficientFundsException() {\n        assertThrows(InsufficientFundsException.class, () -> account.withdraw(2000));\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Шаблон имени: methodName_condition_expectedResult',
            'Примеры: add_twoPositives_returnsSum, withdraw_insufficientFunds_throwsException',
            '@BeforeEach: создание объектов, открытие соединений, подготовка данных',
            '@AfterEach: закрытие соединений, удаление временных файлов',
            '@BeforeAll / @AfterAll: static методы, выполняются один раз для всего класса'
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Тестирование граничных случаев',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Большинство багов живёт на границах: пустые коллекции, null, минимальные и максимальные значения, нулевые длины. Тест, проверяющий только "счастливый путь" — неполный тест.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — тестируем только счастливый путь'
        },
        {
          type: 'code',
          code: '// ПЛОХО: проверяем только один "нормальный" случай\n@Test\nvoid testFindMax() {\n    int[] numbers = {3, 1, 4, 1, 5, 9};\n    assertEquals(9, ArrayUtils.findMax(numbers));\n    // А что с пустым массивом? С массивом из одного элемента?\n    // С массивом из одинаковых чисел? С отрицательными числами?\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — полное покрытие граничных случаев'
        },
        {
          type: 'code',
          code: '// ХОРОШО: тестируем все важные случаи\nclass ArrayUtilsTest {\n\n    @Test\n    void findMax_regularArray_returnsLargestElement() {\n        int[] numbers = {3, 1, 4, 1, 5, 9, 2, 6};\n        assertEquals(9, ArrayUtils.findMax(numbers));\n    }\n\n    @Test\n    void findMax_singleElement_returnsThatElement() {\n        int[] numbers = {42};\n        assertEquals(42, ArrayUtils.findMax(numbers));\n    }\n\n    @Test\n    void findMax_allNegativeNumbers_returnsLeastNegative() {\n        int[] numbers = {-5, -1, -10, -3};\n        assertEquals(-1, ArrayUtils.findMax(numbers));\n    }\n\n    @Test\n    void findMax_allEqualNumbers_returnsTheSameValue() {\n        int[] numbers = {7, 7, 7, 7};\n        assertEquals(7, ArrayUtils.findMax(numbers));\n    }\n\n    @Test\n    void findMax_emptyArray_throwsIllegalArgumentException() {\n        int[] numbers = {};\n        assertThrows(IllegalArgumentException.class,\n            () -> ArrayUtils.findMax(numbers),\n            "Пустой массив должен вызывать IllegalArgumentException");\n    }\n\n    @Test\n    void findMax_nullArray_throwsNullPointerException() {\n        assertThrows(NullPointerException.class,\n            () -> ArrayUtils.findMax(null));\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Пустые коллекции и массивы нулевой длины',
            'null — как аргумент и как возвращаемое значение',
            'Минимальное и максимальное допустимые значения',
            'Одноэлементная коллекция',
            'Коллекция с дублирующимися значениями',
            'Граница между допустимым и недопустимым (например, age 17 vs 18)'
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Задача: Написать тесты для калькулятора',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши полный набор тестов для класса Calculator с методами add, subtract, multiply, divide. Используй @BeforeEach, AAA-структуру и правильные имена.',
      requirements: [
        'Класс Calculator с методами: int add(int a, int b), int subtract(int a, int b), int multiply(int a, int b), double divide(double a, double b)',
        'divide(x, 0) бросает ArithmeticException("Деление на ноль")',
        'Минимум 2 теста для каждого метода (нормальный случай + граничный)',
        'Тест на деление с дробным результатом (assertEquals с delta)',
        '@BeforeEach для создания экземпляра Calculator',
        'Имена тестов по шаблону: methodName_condition_expectedResult'
      ],
      expectedOutput: 'Все тесты проходят:\nadd_twoPositives_returnsSum ✓\nadd_positiveAndNegative_returnsCorrectResult ✓\nsubtract_positiveNumbers_returnsDifference ✓\nsubtract_resultIsNegative_returnsNegativeNumber ✓\nmultiply_twoPositives_returnsProduct ✓\nmultiply_byZero_returnsZero ✓\ndivide_exactDivision_returnsWholeNumber ✓\ndivide_fractionResult_returnsCorrectDouble ✓\ndivide_byZero_throwsArithmeticException ✓',
      hint: 'Для divide используй assertEquals(2.5, calc.divide(5, 2), 0.001) — третий параметр это допустимая погрешность для double. Для assertThrows: assertThrows(ArithmeticException.class, () -> calc.divide(10, 0)).',
      solution: 'import org.junit.jupiter.api.BeforeEach;\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass Calculator {\n    public int add(int a, int b)              { return a + b; }\n    public int subtract(int a, int b)         { return a - b; }\n    public int multiply(int a, int b)         { return a * b; }\n    public double divide(double a, double b)  {\n        if (b == 0) throw new ArithmeticException("Деление на ноль");\n        return a / b;\n    }\n}\n\nclass CalculatorTest {\n\n    private Calculator calc;\n\n    @BeforeEach\n    void setUp() {\n        calc = new Calculator();\n    }\n\n    // --- add ---\n    @Test\n    void add_twoPositives_returnsSum() {\n        assertEquals(5, calc.add(2, 3));\n    }\n\n    @Test\n    void add_positiveAndNegative_returnsCorrectResult() {\n        assertEquals(-1, calc.add(-3, 2));\n    }\n\n    // --- subtract ---\n    @Test\n    void subtract_positiveNumbers_returnsDifference() {\n        assertEquals(3, calc.subtract(8, 5));\n    }\n\n    @Test\n    void subtract_resultIsNegative_returnsNegativeNumber() {\n        assertEquals(-3, calc.subtract(5, 8));\n    }\n\n    // --- multiply ---\n    @Test\n    void multiply_twoPositives_returnsProduct() {\n        assertEquals(12, calc.multiply(3, 4));\n    }\n\n    @Test\n    void multiply_byZero_returnsZero() {\n        assertEquals(0, calc.multiply(999, 0));\n    }\n\n    // --- divide ---\n    @Test\n    void divide_exactDivision_returnsWholeNumber() {\n        assertEquals(5.0, calc.divide(10, 2), 0.001);\n    }\n\n    @Test\n    void divide_fractionResult_returnsCorrectDouble() {\n        assertEquals(2.5, calc.divide(5, 2), 0.001);\n    }\n\n    @Test\n    void divide_byZero_throwsArithmeticException() {\n        ArithmeticException ex = assertThrows(\n            ArithmeticException.class,\n            () -> calc.divide(10, 0)\n        );\n        assertEquals("Деление на ноль", ex.getMessage());\n    }\n}',
      explanation: '@BeforeEach создаёт новый Calculator перед каждым тестом — тесты изолированы, не влияют друг на друга. Каждый тест проверяет одну вещь, имя описывает сценарий. divide с delta 0.001 — правильный способ сравнивать double (из-за погрешности floating point). assertThrows не только проверяет, что исключение брошено, но и позволяет проверить его сообщение — это полная проверка поведения метода при ошибке.'
    },
    {
      id: 7,
      title: 'Задача: Написать тесты для StringUtils',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши тесты для класса StringUtils с методами для работы со строками. Особый упор — на граничные случаи (null, пустая строка, один символ).',
      requirements: [
        'Метод boolean isPalindrome(String s) — строка-палиндром (без учёта регистра)',
        'Метод String reverse(String s) — перевернуть строку',
        'Метод int countVowels(String s) — подсчёт гласных (аеиоуАЕИОУ)',
        'Все три метода должны корректно обрабатывать null → возвращать false/пустую строку/0',
        'Минимум 3 теста для каждого метода включая граничные случаи',
        'Использовать AAA-структуру в каждом тесте'
      ],
      expectedOutput: 'isPalindrome("Казак") → true\nisPalindrome("Привет") → false\nisPalindrome(null) → false\nisPalindrome("а") → true\nreverse("Привет") → "тевирП"\nreverse("") → ""\nreverse(null) → ""\ncountVowels("Привет") → 2\ncountVowels("") → 0\ncountVowels(null) → 0',
      hint: 'isPalindrome: приведи к нижнему регистру, затем сравни с перевёрнутой версией. new StringBuilder(s.toLowerCase()).reverse().toString(). countVowels: перебирай символы и проверяй "аеиоуАЕИОУ".indexOf(c) != -1.',
      solution: 'import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass StringUtils {\n\n    public boolean isPalindrome(String s) {\n        if (s == null) return false;\n        String lower    = s.toLowerCase();\n        String reversed = new StringBuilder(lower).reverse().toString();\n        return lower.equals(reversed);\n    }\n\n    public String reverse(String s) {\n        if (s == null) return "";\n        return new StringBuilder(s).reverse().toString();\n    }\n\n    public int countVowels(String s) {\n        if (s == null) return 0;\n        int count = 0;\n        String vowels = "аеиоуАЕИОУaeiouAEIOU";\n        for (char c : s.toCharArray()) {\n            if (vowels.indexOf(c) != -1) count++;\n        }\n        return count;\n    }\n}\n\nclass StringUtilsTest {\n\n    private final StringUtils utils = new StringUtils();\n\n    // --- isPalindrome ---\n    @Test\n    void isPalindrome_cyrillicPalindrome_returnsTrue() {\n        assertTrue(utils.isPalindrome("Казак"));\n    }\n\n    @Test\n    void isPalindrome_nonPalindrome_returnsFalse() {\n        assertFalse(utils.isPalindrome("Привет"));\n    }\n\n    @Test\n    void isPalindrome_null_returnsFalse() {\n        assertFalse(utils.isPalindrome(null));\n    }\n\n    @Test\n    void isPalindrome_singleChar_returnsTrue() {\n        assertTrue(utils.isPalindrome("а"));\n    }\n\n    @Test\n    void isPalindrome_emptyString_returnsTrue() {\n        // Пустая строка — палиндром по определению\n        assertTrue(utils.isPalindrome(""));\n    }\n\n    // --- reverse ---\n    @Test\n    void reverse_regularString_returnsReversedString() {\n        // Arrange\n        String input = "Привет";\n        // Act\n        String result = utils.reverse(input);\n        // Assert\n        assertEquals("тевирП", result);\n    }\n\n    @Test\n    void reverse_emptyString_returnsEmptyString() {\n        assertEquals("", utils.reverse(""));\n    }\n\n    @Test\n    void reverse_null_returnsEmptyString() {\n        assertEquals("", utils.reverse(null));\n    }\n\n    @Test\n    void reverse_singleChar_returnsSameChar() {\n        assertEquals("а", utils.reverse("а"));\n    }\n\n    // --- countVowels ---\n    @Test\n    void countVowels_stringWithVowels_returnsCorrectCount() {\n        assertEquals(2, utils.countVowels("Привет")); // и, е\n    }\n\n    @Test\n    void countVowels_emptyString_returnsZero() {\n        assertEquals(0, utils.countVowels(""));\n    }\n\n    @Test\n    void countVowels_null_returnsZero() {\n        assertEquals(0, utils.countVowels(null));\n    }\n\n    @Test\n    void countVowels_allVowels_returnsStringLength() {\n        assertEquals(3, utils.countVowels("аио"));\n    }\n}',
      explanation: 'Тесты охватывают все граничные случаи: null (ни один метод не должен бросать NPE), пустую строку, одиночный символ и "нормальные" строки. Для isPalindrome важно проверить и регистронезависимость — "Казак" с заглавной К должен считаться палиндромом. countVowels тестируем на строке из одних гласных — так проверяем, что все гласные включены в список. Метод utils объявлен как final без @BeforeEach — StringUtils не имеет состояния, один экземпляр на весь класс тестов безопасен.'
    },
    {
      id: 8,
      title: 'Задача: Написать тесты для операций с коллекцией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши тесты для класса StudentGradeBook — журнала оценок студентов. Тестируй добавление, удаление, поиск лучшего студента и подсчёт средней оценки.',
      requirements: [
        'Класс StudentGradeBook: addGrade(String student, int grade), getAverage(String student), getBestStudent(), getAllStudents()',
        'getAverage для несуществующего студента → бросает NoSuchElementException',
        'getBestStudent на пустом журнале → бросает NoSuchElementException',
        'addGrade с оценкой вне 1-5 → бросает IllegalArgumentException',
        'Минимум 8 тестовых методов покрывающих нормальные случаи и ошибки',
        '@BeforeEach создаёт журнал и добавляет тестовые данные'
      ],
      expectedOutput: 'Все тесты проходят:\naddGrade_validGrade_increasesStudentGradeCount ✓\ngetAverage_existingStudent_returnsCorrectAverage ✓\ngetAverage_unknownStudent_throwsNoSuchElementException ✓\ngetBestStudent_multipleStudents_returnsStudentWithHighestAverage ✓\ngetBestStudent_emptyGradeBook_throwsNoSuchElementException ✓\naddGrade_gradeAbove5_throwsIllegalArgumentException ✓\naddGrade_gradeBelowOne_throwsIllegalArgumentException ✓\ngetAllStudents_afterAddingThreeStudents_returnsThreeStudents ✓',
      hint: 'В @BeforeEach создай gradeBook и добавь Алию (5,4,5), Бекзата (3,4,3). getBestStudent сравни по getAverage — Алия со средним 4.67 должна выиграть. Для assertThrows используй лямбда-синтаксис.',
      solution: 'import org.junit.jupiter.api.BeforeEach;\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nimport java.util.*;\n\nclass StudentGradeBook {\n    private final Map<String, List<Integer>> grades = new LinkedHashMap<>();\n\n    public void addGrade(String student, int grade) {\n        if (grade < 1 || grade > 5) {\n            throw new IllegalArgumentException("Оценка должна быть от 1 до 5, получено: " + grade);\n        }\n        grades.computeIfAbsent(student, k -> new ArrayList<>()).add(grade);\n    }\n\n    public double getAverage(String student) {\n        List<Integer> studentGrades = grades.get(student);\n        if (studentGrades == null) {\n            throw new NoSuchElementException("Студент не найден: " + student);\n        }\n        return studentGrades.stream().mapToInt(Integer::intValue).average().orElse(0.0);\n    }\n\n    public String getBestStudent() {\n        if (grades.isEmpty()) {\n            throw new NoSuchElementException("Журнал пуст");\n        }\n        return grades.keySet().stream()\n            .max(Comparator.comparingDouble(this::getAverage))\n            .orElseThrow();\n    }\n\n    public Set<String> getAllStudents() {\n        return Collections.unmodifiableSet(grades.keySet());\n    }\n}\n\nclass StudentGradeBookTest {\n\n    private StudentGradeBook gradeBook;\n\n    @BeforeEach\n    void setUp() {\n        gradeBook = new StudentGradeBook();\n        gradeBook.addGrade("Алия",   5);\n        gradeBook.addGrade("Алия",   4);\n        gradeBook.addGrade("Алия",   5);\n        gradeBook.addGrade("Бекзат", 3);\n        gradeBook.addGrade("Бекзат", 4);\n        gradeBook.addGrade("Бекзат", 3);\n    }\n\n    @Test\n    void addGrade_validGrade_increasesStudentGradeCount() {\n        // Arrange\n        gradeBook.addGrade("Алия", 3);\n\n        // Act & Assert: средняя изменилась — значит оценка добавлена\n        // было (5+4+5)/3 = 4.67, стало (5+4+5+3)/4 = 4.25\n        assertEquals(4.25, gradeBook.getAverage("Алия"), 0.01);\n    }\n\n    @Test\n    void getAverage_existingStudent_returnsCorrectAverage() {\n        assertEquals(4.67, gradeBook.getAverage("Алия"),   0.01);\n        assertEquals(3.33, gradeBook.getAverage("Бекзат"), 0.01);\n    }\n\n    @Test\n    void getAverage_unknownStudent_throwsNoSuchElementException() {\n        assertThrows(NoSuchElementException.class,\n            () -> gradeBook.getAverage("Несуществующий"));\n    }\n\n    @Test\n    void getBestStudent_multipleStudents_returnsStudentWithHighestAverage() {\n        assertEquals("Алия", gradeBook.getBestStudent());\n    }\n\n    @Test\n    void getBestStudent_emptyGradeBook_throwsNoSuchElementException() {\n        // Arrange: новый пустой журнал\n        StudentGradeBook emptyBook = new StudentGradeBook();\n\n        // Act & Assert\n        assertThrows(NoSuchElementException.class, emptyBook::getBestStudent);\n    }\n\n    @Test\n    void addGrade_gradeAbove5_throwsIllegalArgumentException() {\n        IllegalArgumentException ex = assertThrows(\n            IllegalArgumentException.class,\n            () -> gradeBook.addGrade("Алия", 6)\n        );\n        assertTrue(ex.getMessage().contains("6"), "Сообщение должно содержать неверное значение");\n    }\n\n    @Test\n    void addGrade_gradeBelowOne_throwsIllegalArgumentException() {\n        assertThrows(IllegalArgumentException.class,\n            () -> gradeBook.addGrade("Алия", 0));\n    }\n\n    @Test\n    void getAllStudents_afterAddingThreeStudents_returnsThreeStudents() {\n        // Arrange\n        gradeBook.addGrade("Нурдаулет", 5);\n\n        // Act\n        Set<String> students = gradeBook.getAllStudents();\n\n        // Assert\n        assertEquals(3, students.size());\n        assertTrue(students.contains("Алия"));\n        assertTrue(students.contains("Бекзат"));\n        assertTrue(students.contains("Нурдаулет"));\n    }\n}',
      explanation: '@BeforeEach создаёт два студента с заранее известными оценками — это тестовые фикстуры. Тест getBestStudent_emptyGradeBook создаёт собственный пустой журнал, не используя данные из @BeforeEach — это важно для изоляции. assertThrows с проверкой сообщения (ex.getMessage().contains("6")) — полная проверка: не только факт исключения, но и его качество. emptyBook::getBestStudent — ссылка на метод как альтернатива лямбде () -> emptyBook.getBestStudent(). getAverage с delta 0.01 — корректное сравнение double.'
    }
  ]
}
