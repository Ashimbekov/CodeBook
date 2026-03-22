export default {
  id: 71,
  title: 'Лучшие практики: Чистый код',
  description: 'Принципы написания чистого, читаемого и поддерживаемого кода: что такое чистый код, принципы DRY и KISS, единственная ответственность методов, магические числа и константы',
  lessons: [
    {
      id: 1,
      title: 'Что такое чистый код и почему это важно',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Чистый код — это код, который легко читать, понимать и изменять. Роберт Мартин (Uncle Bob) определяет чистый код как код, который выглядит так, будто его написал человек, которому не всё равно.'
        },
        {
          type: 'heading',
          text: 'Почему чистый код важен'
        },
        {
          type: 'list',
          items: [
            'Код читают в 10 раз чаще, чем пишут — читаемость важнее краткости',
            'Плохой код замедляет разработку: одно изменение ломает другое',
            'Чистый код легче тестировать и отлаживать',
            'Команда работает быстрее, когда код понятен всем'
          ]
        },
        {
          type: 'heading',
          text: 'Плохой пример — нечитаемый код'
        },
        {
          type: 'code',
          code: '// ПЛОХО: непонятные имена, всё в одном месте, магические числа\npublic int calc(int a, int b, int t) {\n    int r = 0;\n    if (t == 1) r = a + b;\n    else if (t == 2) r = a - b;\n    else if (t == 3) r = a * b;\n    else if (t == 4 && b != 0) r = a / b;\n    return r;\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — чистый и понятный код'
        },
        {
          type: 'code',
          code: '// ХОРОШО: понятные имена, разделение по методам, нет магических чисел\npublic enum Operation { ADD, SUBTRACT, MULTIPLY, DIVIDE }\n\npublic int calculate(int firstNumber, int secondNumber, Operation operation) {\n    switch (operation) {\n        case ADD:      return firstNumber + secondNumber;\n        case SUBTRACT: return firstNumber - secondNumber;\n        case MULTIPLY: return firstNumber * secondNumber;\n        case DIVIDE:   return divideWithCheck(firstNumber, secondNumber);\n        default:       throw new IllegalArgumentException("Неизвестная операция: " + operation);\n    }\n}\n\nprivate int divideWithCheck(int dividend, int divisor) {\n    if (divisor == 0) {\n        throw new ArithmeticException("Деление на ноль недопустимо");\n    }\n    return dividend / divisor;\n}'
        },
        {
          type: 'tip',
          text: 'Правило бойскаута: оставляй код чище, чем он был до тебя. Каждый раз, работая с кодом, улучшай хотя бы одну мелочь.'
        }
      ]
    },
    {
      id: 2,
      title: 'Принцип DRY — Don\'t Repeat Yourself',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'DRY (Don\'t Repeat Yourself) — каждая единица знания должна иметь единственное, однозначное представление в системе. Дублирование кода — источник ошибок: исправив в одном месте, легко забыть про остальные.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — дублирование логики'
        },
        {
          type: 'code',
          code: '// ПЛОХО: одна и та же логика валидации повторяется в трёх местах\npublic void registerUser(String name, String email, int age) {\n    if (name == null || name.trim().isEmpty()) {\n        throw new IllegalArgumentException("Имя не может быть пустым");\n    }\n    if (email == null || !email.contains("@")) {\n        throw new IllegalArgumentException("Некорректный email");\n    }\n    if (age < 18 || age > 120) {\n        throw new IllegalArgumentException("Некорректный возраст");\n    }\n    // ... сохраняем пользователя\n}\n\npublic void updateUser(String name, String email, int age) {\n    if (name == null || name.trim().isEmpty()) {         // повтор!\n        throw new IllegalArgumentException("Имя не может быть пустым");\n    }\n    if (email == null || !email.contains("@")) {        // повтор!\n        throw new IllegalArgumentException("Некорректный email");\n    }\n    if (age < 18 || age > 120) {                        // повтор!\n        throw new IllegalArgumentException("Некорректный возраст");\n    }\n    // ... обновляем пользователя\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — выделяем валидацию в отдельный метод'
        },
        {
          type: 'code',
          code: '// ХОРОШО: валидация в одном месте, используется везде\npublic void registerUser(String name, String email, int age) {\n    validateUserData(name, email, age);\n    // ... сохраняем пользователя\n}\n\npublic void updateUser(String name, String email, int age) {\n    validateUserData(name, email, age);\n    // ... обновляем пользователя\n}\n\nprivate void validateUserData(String name, String email, int age) {\n    if (name == null || name.trim().isEmpty()) {\n        throw new IllegalArgumentException("Имя не может быть пустым");\n    }\n    if (email == null || !email.contains("@")) {\n        throw new IllegalArgumentException("Некорректный email");\n    }\n    if (age < 18 || age > 120) {\n        throw new IllegalArgumentException("Некорректный возраст");\n    }\n}'
        },
        {
          type: 'warning',
          text: 'DRY не означает "никогда не пиши похожий код". Два похожих фрагмента, которые меняются по разным причинам, лучше оставить отдельными. Абстрагируй только то, что действительно одно и то же.'
        }
      ]
    },
    {
      id: 3,
      title: 'Принцип KISS — Keep It Simple',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'KISS (Keep It Simple, Stupid) — системы работают лучше, когда они остаются простыми. Сложность — враг надёжности. Не усложняй то, что можно сделать просто.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — излишняя сложность'
        },
        {
          type: 'code',
          code: '// ПЛОХО: переусложнённая проверка чётности\npublic boolean isEven(int number) {\n    if (number >= 0) {\n        for (int i = 0; i <= number; i += 2) {\n            if (i == number) return true;\n        }\n        return false;\n    } else {\n        for (int i = 0; i >= number; i -= 2) {\n            if (i == number) return true;\n        }\n        return false;\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — простое и очевидное решение'
        },
        {
          type: 'code',
          code: '// ХОРОШО: одна строка, мгновенно понятно\npublic boolean isEven(int number) {\n    return number % 2 == 0;\n}'
        },
        {
          type: 'heading',
          text: 'Ещё пример: поиск максимума'
        },
        {
          type: 'code',
          code: '// ПЛОХО: "умный" код, который трудно понять\npublic int max(int a, int b) {\n    return (a + b + Math.abs(a - b)) / 2;\n}\n\n// ХОРОШО: читается как обычное предложение\npublic int max(int a, int b) {\n    return a > b ? a : b;\n}'
        },
        {
          type: 'tip',
          text: 'Если ты пишешь комментарий, объясняющий КАК работает код — это сигнал, что код слишком сложный. Упрости код до такой степени, чтобы он объяснял сам себя.'
        }
      ]
    },
    {
      id: 4,
      title: 'Единственная ответственность методов',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Каждый метод должен делать одно конкретное дело и делать его хорошо. Длинные методы, которые делают всё сразу, трудно читать, тестировать и переиспользовать. Признак проблемы — метод длиннее 20-30 строк или с несколькими уровнями вложенности.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — метод делает слишком много'
        },
        {
          type: 'code',
          code: '// ПЛОХО: один метод читает, валидирует, считает и выводит результат\npublic void processStudentData(String csvLine) {\n    // Парсинг\n    String[] parts = csvLine.split(",");\n    String name = parts[0].trim();\n    int grade1 = Integer.parseInt(parts[1].trim());\n    int grade2 = Integer.parseInt(parts[2].trim());\n    int grade3 = Integer.parseInt(parts[3].trim());\n\n    // Валидация\n    if (name.isEmpty()) {\n        System.out.println("Ошибка: пустое имя");\n        return;\n    }\n    if (grade1 < 1 || grade1 > 5 || grade2 < 1 || grade2 > 5 || grade3 < 1 || grade3 > 5) {\n        System.out.println("Ошибка: оценки вне диапазона 1-5");\n        return;\n    }\n\n    // Подсчёт\n    double average = (grade1 + grade2 + grade3) / 3.0;\n    String status = average >= 4.5 ? "Отличник" : average >= 3.5 ? "Хорошист" : "Троечник";\n\n    // Вывод\n    System.out.printf("Студент: %s | Средний балл: %.2f | Статус: %s%n", name, average, status);\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — каждый метод делает одно дело'
        },
        {
          type: 'code',
          code: '// ХОРОШО: каждый метод — одна задача\npublic void processStudentData(String csvLine) {\n    StudentRecord record = parseStudentRecord(csvLine);\n    validateStudentRecord(record);\n    double average = calculateAverage(record.grades);\n    String status = determineStatus(average);\n    printStudentReport(record.name, average, status);\n}\n\nprivate StudentRecord parseStudentRecord(String csvLine) {\n    String[] parts = csvLine.split(",");\n    String name = parts[0].trim();\n    int[] grades = new int[parts.length - 1];\n    for (int i = 1; i < parts.length; i++) {\n        grades[i - 1] = Integer.parseInt(parts[i].trim());\n    }\n    return new StudentRecord(name, grades);\n}\n\nprivate void validateStudentRecord(StudentRecord record) {\n    if (record.name.isEmpty()) {\n        throw new IllegalArgumentException("Имя студента не может быть пустым");\n    }\n    for (int grade : record.grades) {\n        if (grade < 1 || grade > 5) {\n            throw new IllegalArgumentException("Оценка вне диапазона 1-5: " + grade);\n        }\n    }\n}\n\nprivate double calculateAverage(int[] grades) {\n    int sum = 0;\n    for (int grade : grades) sum += grade;\n    return (double) sum / grades.length;\n}\n\nprivate String determineStatus(double average) {\n    if (average >= 4.5) return "Отличник";\n    if (average >= 3.5) return "Хорошист";\n    return "Троечник";\n}\n\nprivate void printStudentReport(String name, double average, String status) {\n    System.out.printf("Студент: %s | Средний балл: %.2f | Статус: %s%n", name, average, status);\n}'
        },
        {
          type: 'note',
          text: 'Правило: если ты не можешь описать метод одним предложением без союза "и", метод делает слишком много и его нужно разбить.'
        }
      ]
    },
    {
      id: 5,
      title: 'Магические числа и константы',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Магическое число — это числовой литерал в коде без объяснения его смысла. Увидев число 86400 или 0.15, читатель кода не сразу понимает, что это. Константы делают код самодокументирующимся.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — магические числа везде'
        },
        {
          type: 'code',
          code: '// ПЛОХО: что означают эти числа?\npublic double calculateShippingCost(double orderAmount, int itemCount) {\n    if (orderAmount > 5000) {\n        return 0;\n    }\n    double base = itemCount * 150;\n    if (itemCount > 10) {\n        base = base * 0.85;\n    }\n    return base + 300;\n}\n\npublic boolean isSessionValid(long lastActivityTime) {\n    return System.currentTimeMillis() - lastActivityTime < 1800000;\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — именованные константы'
        },
        {
          type: 'code',
          code: '// ХОРОШО: константы с осмысленными именами\npublic class ShippingService {\n\n    private static final double FREE_SHIPPING_THRESHOLD = 5000.0;\n    private static final double PRICE_PER_ITEM = 150.0;\n    private static final double BULK_DISCOUNT_RATE = 0.85;\n    private static final int BULK_ORDER_MIN_ITEMS = 10;\n    private static final double BASE_HANDLING_FEE = 300.0;\n\n    private static final long SESSION_TIMEOUT_MS = 30 * 60 * 1000L; // 30 минут в мс\n\n    public double calculateShippingCost(double orderAmount, int itemCount) {\n        if (orderAmount > FREE_SHIPPING_THRESHOLD) {\n            return 0;\n        }\n        double base = itemCount * PRICE_PER_ITEM;\n        if (itemCount > BULK_ORDER_MIN_ITEMS) {\n            base = base * BULK_DISCOUNT_RATE;\n        }\n        return base + BASE_HANDLING_FEE;\n    }\n\n    public boolean isSessionValid(long lastActivityTime) {\n        return System.currentTimeMillis() - lastActivityTime < SESSION_TIMEOUT_MS;\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Исключения из правила: 0 и 1 допустимы в большинстве контекстов (индексы, булевы условия). Число 2 в делении пополам — тоже нормально. Магическими считаются числа, смысл которых не очевиден из контекста.'
        }
      ]
    },
    {
      id: 6,
      title: 'Задача: Рефакторинг спагетти-кода',
      type: 'practice',
      difficulty: 'easy',
      description: 'Перед тобой метод, который считает стоимость заказа в интернет-магазине. Он нечитаемый, с дублированием и магическими числами. Выполни рефакторинг: примени DRY, KISS, вынеси константы.',
      requirements: [
        'Убрать все магические числа — заменить именованными константами',
        'Устранить дублирование логики скидки',
        'Сохранить ту же бизнес-логику: скидка 10% при сумме > 1000, 20% при сумме > 5000',
        'Доставка бесплатна при сумме заказа (до скидки) > 3000, иначе 250 рублей',
        'Метод должен возвращать итоговую сумму к оплате'
      ],
      expectedOutput: 'Сумма 500 → итог: 750.0\nСумма 1500 → итог: 1600.0\nСумма 6000 → итог: 4800.0',
      hint: 'Создай отдельные private методы: calculateDiscount(double amount) и calculateDelivery(double amount). Константы объяви как private static final double.',
      solution: 'public class OrderCalculator {\n\n    private static final double DISCOUNT_THRESHOLD_MEDIUM = 1000.0;\n    private static final double DISCOUNT_THRESHOLD_HIGH   = 5000.0;\n    private static final double DISCOUNT_RATE_MEDIUM      = 0.10;\n    private static final double DISCOUNT_RATE_HIGH        = 0.20;\n    private static final double FREE_DELIVERY_THRESHOLD   = 3000.0;\n    private static final double DELIVERY_COST             = 250.0;\n\n    public double calculateTotal(double subtotal) {\n        double discount  = calculateDiscount(subtotal);\n        double delivery  = calculateDelivery(subtotal);\n        return subtotal - discount + delivery;\n    }\n\n    private double calculateDiscount(double amount) {\n        if (amount > DISCOUNT_THRESHOLD_HIGH) {\n            return amount * DISCOUNT_RATE_HIGH;\n        }\n        if (amount > DISCOUNT_THRESHOLD_MEDIUM) {\n            return amount * DISCOUNT_RATE_MEDIUM;\n        }\n        return 0;\n    }\n\n    private double calculateDelivery(double amount) {\n        return amount > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;\n    }\n\n    public static void main(String[] args) {\n        OrderCalculator calc = new OrderCalculator();\n        System.out.println("Сумма 500 → итог: "  + calc.calculateTotal(500));\n        System.out.println("Сумма 1500 → итог: " + calc.calculateTotal(1500));\n        System.out.println("Сумма 6000 → итог: " + calc.calculateTotal(6000));\n    }\n}',
      explanation: 'Рефакторинг выявил три отдельных ответственности: подсчёт скидки, подсчёт доставки и итоговая сумма. Каждая константа теперь имеет имя, объясняющее её роль. Метод calculateTotal стал декларативным — он описывает ЧТО делается, а не КАК. Логика скидки сосредоточена в одном месте: если условия изменятся, правится только calculateDiscount.'
    },
    {
      id: 7,
      title: 'Задача: Извлечение методов из длинной функции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Метод generateReport делает всё: читает данные, считает статистику, форматирует и выводит отчёт. Разбей его на отдельные методы с чёткой ответственностью.',
      requirements: [
        'Метод parseScores(String data) — парсит строку "85,92,78,95,88" в int[]',
        'Метод calculateStats(int[] scores) — возвращает объект Stats с полями min, max, average',
        'Метод formatReport(String subject, Stats stats) — возвращает отформатированную строку',
        'Метод generateReport(String subject, String data) — оркестрирует вызовы трёх методов выше',
        'Сохранить исходный формат вывода'
      ],
      expectedOutput: '=== Отчёт по предмету: Математика ===\nМинимум: 78\nМаксимум: 95\nСредний балл: 87.60\n=====================================',
      hint: 'Создай внутренний класс Stats или используй отдельный класс-запись. parseScores должен использовать split(",") и Integer.parseInt. Для среднего используй String.format("%.2f", average).',
      solution: 'public class ReportGenerator {\n\n    static class Stats {\n        int min;\n        int max;\n        double average;\n\n        Stats(int min, int max, double average) {\n            this.min = min;\n            this.max = max;\n            this.average = average;\n        }\n    }\n\n    public int[] parseScores(String data) {\n        String[] parts = data.split(",");\n        int[] scores = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            scores[i] = Integer.parseInt(parts[i].trim());\n        }\n        return scores;\n    }\n\n    public Stats calculateStats(int[] scores) {\n        int min = scores[0], max = scores[0];\n        long sum = 0;\n        for (int score : scores) {\n            if (score < min) min = score;\n            if (score > max) max = score;\n            sum += score;\n        }\n        double average = (double) sum / scores.length;\n        return new Stats(min, max, average);\n    }\n\n    public String formatReport(String subject, Stats stats) {\n        String separator = "=====================================";\n        return  "=== Отчёт по предмету: " + subject + " ===\n" +\n                "Минимум: " + stats.min + "\n" +\n                "Максимум: " + stats.max + "\n" +\n                "Средний балл: " + String.format("%.2f", stats.average) + "\n" +\n                separator;\n    }\n\n    public void generateReport(String subject, String data) {\n        int[] scores   = parseScores(data);\n        Stats stats    = calculateStats(scores);\n        String report  = formatReport(subject, stats);\n        System.out.println(report);\n    }\n\n    public static void main(String[] args) {\n        ReportGenerator generator = new ReportGenerator();\n        generator.generateReport("Математика", "85,92,78,95,88");\n    }\n}',
      explanation: 'После рефакторинга каждый метод можно тестировать отдельно: parseScores — unit-тест с разными строками, calculateStats — тест с граничными значениями, formatReport — тест формата вывода. Класс Stats — это Value Object: неизменяемый контейнер данных, передаваемый между методами. generateReport стал читаться как алгоритм высокого уровня: прочитай → посчитай → отформатируй → выведи.'
    },
    {
      id: 8,
      title: 'Задача: Замена магических чисел константами',
      type: 'practice',
      difficulty: 'easy',
      description: 'В классе GameCharacter полно магических чисел. Замени все литералы именованными константами и объясни смысл каждой.',
      requirements: [
        'Все числовые литералы заменить на private static final константы',
        'Имена констант должны точно описывать их смысл',
        'Логика методов не меняется — только замена литералов на имена',
        'Добавить комментарии к неочевидным константам (например, единицы измерения)'
      ],
      expectedOutput: 'Персонаж создан: HP=100, Мана=50, Уровень=1\nПолучен урон 30. HP: 70\nИспользована способность. Мана: 30\nУровень повышен! Уровень: 2, HP: 120, Мана: 70',
      hint: 'Подумай о константах: MAX_HP, MAX_MANA, STARTING_LEVEL, ABILITY_MANA_COST, LEVEL_UP_HP_BONUS, LEVEL_UP_MANA_BONUS. Объяви их в начале класса.',
      solution: 'public class GameCharacter {\n\n    private static final int MAX_HP            = 100;\n    private static final int MAX_MANA          = 50;\n    private static final int STARTING_LEVEL    = 1;\n    private static final int ABILITY_MANA_COST = 20;\n    private static final int LEVEL_UP_HP_BONUS   = 20; // HP за уровень\n    private static final int LEVEL_UP_MANA_BONUS = 20; // мана за уровень\n\n    private int hp;\n    private int mana;\n    private int level;\n\n    public GameCharacter() {\n        this.hp    = MAX_HP;\n        this.mana  = MAX_MANA;\n        this.level = STARTING_LEVEL;\n        System.out.printf("Персонаж создан: HP=%d, Мана=%d, Уровень=%d%n", hp, mana, level);\n    }\n\n    public void takeDamage(int damage) {\n        hp -= damage;\n        if (hp < 0) hp = 0;\n        System.out.printf("Получен урон %d. HP: %d%n", damage, hp);\n    }\n\n    public boolean useAbility() {\n        if (mana < ABILITY_MANA_COST) {\n            System.out.println("Недостаточно маны!");\n            return false;\n        }\n        mana -= ABILITY_MANA_COST;\n        System.out.printf("Использована способность. Мана: %d%n", mana);\n        return true;\n    }\n\n    public void levelUp() {\n        level++;\n        hp   += LEVEL_UP_HP_BONUS;\n        mana += LEVEL_UP_MANA_BONUS;\n        System.out.printf("Уровень повышен! Уровень: %d, HP: %d, Мана: %d%n", level, hp, mana);\n    }\n\n    public static void main(String[] args) {\n        GameCharacter hero = new GameCharacter();\n        hero.takeDamage(30);\n        hero.useAbility();\n        hero.levelUp();\n    }\n}',
      explanation: 'Теперь если дизайнер захочет изменить стоимость способности с 20 до 25, нужно поменять одну строку — ABILITY_MANA_COST = 25. Без константы пришлось бы искать все вхождения числа 20 по всему коду и гадать, какое из них относится к способности. Константы также документируют бизнес-правила: LEVEL_UP_HP_BONUS = 20 чётко говорит, что за каждый уровень персонаж получает 20 HP.'
    }
  ]
}
