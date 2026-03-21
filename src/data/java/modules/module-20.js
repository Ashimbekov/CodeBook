export default {
  id: 20,
  title: 'Перечисления (enum)',
  description: 'Перечисления для представления фиксированных наборов значений',
  lessons: [
    {
      id: 1,
      title: 'Что такое enum?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum (перечисление) — это специальный тип, который имеет фиксированный набор значений. Используется когда переменная может принимать только ограниченное число значений.' },
        { type: 'tip', value: 'Enum — как светофор. У светофора только три состояния: КРАСНЫЙ, ЖЁЛТЫЙ, ЗЕЛЁНЫЙ. Нет смысла хранить это как строку — можно случайно написать "Красный" или "red" и ошибиться. Enum гарантирует, что будет только одно из трёх значений!' },
        { type: 'heading', value: 'Простой enum' },
        { type: 'code', language: 'java', value: '// Объявление enum\npublic enum Day {\n    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY\n}\n\npublic enum Season {\n    SPRING, SUMMER, AUTUMN, WINTER\n}\n\npublic enum Direction {\n    NORTH, SOUTH, EAST, WEST\n}\n\n// Использование\nDay today = Day.WEDNESDAY;\nSeason current = Season.SUMMER;\n\nSystem.out.println(today);    // WEDNESDAY\nSystem.out.println(current);  // SUMMER\n\n// Сравнение enum\nif (today == Day.WEDNESDAY) {\n    System.out.println("Середина недели!");\n}\n\n// Enum в switch\nswitch (today) {\n    case SATURDAY:\n    case SUNDAY:\n        System.out.println("Выходной!");\n        break;\n    default:\n        System.out.println("Рабочий день");\n}' },
        { type: 'heading', value: 'Встроенные методы enum' },
        { type: 'code', language: 'java', value: '// name() — имя константы\nSystem.out.println(Day.MONDAY.name()); // MONDAY\n\n// ordinal() — порядковый номер (начиная с 0)\nSystem.out.println(Day.MONDAY.ordinal());    // 0\nSystem.out.println(Day.WEDNESDAY.ordinal()); // 2\nSystem.out.println(Day.SUNDAY.ordinal());    // 6\n\n// values() — все значения\nfor (Day d : Day.values()) {\n    System.out.println(d.ordinal() + ": " + d.name());\n}\n\n// valueOf() — из строки\nDay friday = Day.valueOf("FRIDAY");\nSystem.out.println(friday); // FRIDAY' },
        { type: 'note', value: 'Enum автоматически наследуется от java.lang.Enum. Все константы enum — это public static final поля своего типа.' }
      ]
    },
    {
      id: 2,
      title: 'Enum с полями и методами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum может иметь поля, конструктор и методы. Это делает его очень мощным инструментом для хранения связанных данных.' },
        { type: 'code', language: 'java', value: 'public enum Planet {\n    // Константы с параметрами\n    MERCURY(3.303e+23, 2.4397e6),\n    VENUS  (4.869e+24, 6.0518e6),\n    EARTH  (5.976e+24, 6.37814e6),\n    MARS   (6.421e+23, 3.3972e6);\n\n    // Поля\n    private final double mass;   // кг\n    private final double radius; // метры\n\n    // Конструктор enum — всегда private!\n    Planet(double mass, double radius) {\n        this.mass = mass;\n        this.radius = radius;\n    }\n\n    // Методы\n    public double getMass() { return mass; }\n    public double getRadius() { return radius; }\n\n    static final double G = 6.67300E-11;\n\n    public double surfaceGravity() {\n        return G * mass / (radius * radius);\n    }\n\n    public double surfaceWeight(double otherMass) {\n        return otherMass * surfaceGravity();\n    }\n}\n\n// Ваш вес на разных планетах\ndouble earthWeight = 75.0;\ndouble mass = earthWeight / Planet.EARTH.surfaceGravity();\n\nfor (Planet p : Planet.values()) {\n    System.out.printf("Ваш вес на %s: %.2f кг%n", p, p.surfaceWeight(mass));\n}' },
        { type: 'heading', value: 'Практичный пример — цвета RGB' },
        { type: 'code', language: 'java', value: 'public enum Color {\n    RED(255, 0, 0, "Красный"),\n    GREEN(0, 255, 0, "Зелёный"),\n    BLUE(0, 0, 255, "Синий"),\n    YELLOW(255, 255, 0, "Жёлтый"),\n    WHITE(255, 255, 255, "Белый"),\n    BLACK(0, 0, 0, "Чёрный");\n\n    private final int r, g, b;\n    private final String russianName;\n\n    Color(int r, int g, int b, String russianName) {\n        this.r = r; this.g = g; this.b = b;\n        this.russianName = russianName;\n    }\n\n    public String toHex() {\n        return String.format("#%02X%02X%02X", r, g, b);\n    }\n\n    public String getRussianName() { return russianName; }\n\n    @Override\n    public String toString() {\n        return russianName + " (" + toHex() + ")";\n    }\n}\n\nSystem.out.println(Color.RED);     // Красный (#FF0000)\nSystem.out.println(Color.BLUE);    // Синий (#0000FF)\nSystem.out.println(Color.YELLOW.toHex()); // #FFFF00' }
      ]
    },
    {
      id: 3,
      title: 'Enum в switch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum отлично работает с switch. Это один из самых читаемых и безопасных способов обработки разных состояний.' },
        { type: 'code', language: 'java', value: 'public enum TrafficLight {\n    RED, YELLOW, GREEN;\n\n    public TrafficLight next() {\n        switch (this) {\n            case RED:    return GREEN;\n            case GREEN:  return YELLOW;\n            case YELLOW: return RED;\n            default: throw new IllegalStateException();\n        }\n    }\n}\n\nTrafficLight light = TrafficLight.RED;\nSystem.out.println("Сейчас: " + light);\nlight = light.next();\nSystem.out.println("Теперь: " + light);\nlight = light.next();\nSystem.out.println("Теперь: " + light);\n// Сейчас: RED\n// Теперь: GREEN\n// Теперь: YELLOW' },
        { type: 'heading', value: 'Switch expression (Java 14+)' },
        { type: 'code', language: 'java', value: 'public enum Season {\n    SPRING, SUMMER, AUTUMN, WINTER\n}\n\nSeason season = Season.SUMMER;\n\n// Старый switch\nString description;\nswitch (season) {\n    case SPRING: description = "Тепло и цветы"; break;\n    case SUMMER: description = "Жарко и отпуск"; break;\n    case AUTUMN: description = "Листопад"; break;\n    case WINTER: description = "Холодно и снег"; break;\n    default: description = "Неизвестно";\n}\n\n// Современный switch expression (Java 14+)\nString desc = switch (season) {\n    case SPRING -> "Тепло и цветы";\n    case SUMMER -> "Жарко и отпуск";\n    case AUTUMN -> "Листопад";\n    case WINTER -> "Холодно и снег";\n};\n\nSystem.out.println(desc); // Жарко и отпуск' },
        { type: 'code', language: 'java', value: 'public enum OrderStatus {\n    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED;\n\n    public String getMessage() {\n        return switch (this) {\n            case PENDING   -> "Ожидает подтверждения";\n            case CONFIRMED -> "Заказ подтверждён";\n            case SHIPPED   -> "В пути";\n            case DELIVERED -> "Доставлен";\n            case CANCELLED -> "Отменён";\n        };\n    }\n\n    public boolean isFinal() {\n        return this == DELIVERED || this == CANCELLED;\n    }\n}\n\nfor (OrderStatus status : OrderStatus.values()) {\n    System.out.println(status + ": " + status.getMessage());\n}' }
      ]
    },
    {
      id: 4,
      title: 'EnumSet и EnumMap',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java предоставляет специальные коллекции для enum: EnumSet (множество значений enum) и EnumMap (карта с ключами-enum). Они очень эффективны.' },
        { type: 'code', language: 'java', value: 'import java.util.EnumSet;\nimport java.util.EnumMap;\n\npublic enum Day {\n    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY\n}\n\n// EnumSet — множество значений enum\nEnumSet<Day> workdays = EnumSet.of(\n    Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY\n);\nEnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);\nEnumSet<Day> allDays = EnumSet.allOf(Day.class);\nEnumSet<Day> noDay = EnumSet.noneOf(Day.class);\n\nSystem.out.println("Рабочие дни: " + workdays);\nSystem.out.println("Выходные: " + weekend);\nSystem.out.println("Сегодня выходной? " + weekend.contains(Day.SATURDAY)); // true\nSystem.out.println("Сегодня рабочий? " + workdays.contains(Day.SUNDAY));   // false' },
        { type: 'code', language: 'java', value: '// EnumMap — карта с ключами-enum\nEnumMap<Day, String> schedule = new EnumMap<>(Day.class);\n\nschedule.put(Day.MONDAY,    "Встреча с командой");\nschedule.put(Day.WEDNESDAY, "Код-ревью");\nschedule.put(Day.FRIDAY,    "Стендап и планирование");\nschedule.put(Day.SATURDAY,  "Отдых");\n\nfor (Day day : Day.values()) {\n    String event = schedule.getOrDefault(day, "Обычный день");\n    System.out.println(day + ": " + event);\n}' },
        { type: 'tip', value: 'EnumSet хранит значения как битовые флаги внутри — это очень быстро. Операции contains(), add(), remove() работают за O(1). Используй EnumSet когда работаешь с подмножествами enum.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Статусы заказа',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай систему статусов заказа с enum.',
      requirements: [
        'Enum OrderStatus с полями: displayName (String), description (String)',
        'Значения: NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED',
        'Метод canTransitionTo(OrderStatus next) — проверяет допустимость перехода',
        'Допустимые переходы: NEW→PROCESSING, PROCESSING→SHIPPED, SHIPPED→DELIVERED, любой→CANCELLED',
        'Класс Order с полями id, customerName, status',
        'Метод updateStatus(OrderStatus newStatus) с проверкой через canTransitionTo'
      ],
      expectedOutput: 'Заказ #1001: NEW — Новый заказ\nОбновляем до: PROCESSING\nЗаказ #1001: PROCESSING — В обработке\nОбновляем до: DELIVERED\nНедопустимый переход: PROCESSING -> DELIVERED\nОтмена заказа...\nЗаказ #1001: CANCELLED — Заказ отменён',
      hint: 'В canTransitionTo используй switch(this). Для CANCELLED можно всегда возвращать true из любого состояния кроме DELIVERED.',
      solution: 'public enum OrderStatus {\n    NEW("Новый заказ", "Только создан"),\n    PROCESSING("В обработке", "Идёт сборка"),\n    SHIPPED("Отправлен", "В пути к покупателю"),\n    DELIVERED("Доставлен", "Получен покупателем"),\n    CANCELLED("Заказ отменён", "Возврат средств");\n\n    private final String displayName;\n    private final String description;\n\n    OrderStatus(String displayName, String description) {\n        this.displayName = displayName;\n        this.description = description;\n    }\n\n    public String getDisplayName() { return displayName; }\n    public String getDescription() { return description; }\n\n    public boolean canTransitionTo(OrderStatus next) {\n        if (next == CANCELLED && this != DELIVERED) return true;\n        switch (this) {\n            case NEW:        return next == PROCESSING;\n            case PROCESSING: return next == SHIPPED;\n            case SHIPPED:    return next == DELIVERED;\n            default:         return false;\n        }\n    }\n}\n\npublic class Order {\n    String id;\n    String customerName;\n    OrderStatus status;\n\n    public Order(String id, String customerName) {\n        this.id = id;\n        this.customerName = customerName;\n        this.status = OrderStatus.NEW;\n    }\n\n    void updateStatus(OrderStatus newStatus) {\n        if (status.canTransitionTo(newStatus)) {\n            status = newStatus;\n            System.out.println("Заказ #" + id + ": " + status + " — " + status.getDisplayName());\n        } else {\n            System.out.println("Недопустимый переход: " + status + " -> " + newStatus);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Order order = new Order("1001", "Нурдаулет");\n        System.out.println("Заказ #" + order.id + ": " + order.status + " — " + order.status.getDisplayName());\n        System.out.println("Обновляем до: PROCESSING");\n        order.updateStatus(OrderStatus.PROCESSING);\n        System.out.println("Обновляем до: DELIVERED");\n        order.updateStatus(OrderStatus.DELIVERED);\n        System.out.println("Отмена заказа...");\n        order.updateStatus(OrderStatus.CANCELLED);\n    }\n}',
      explanation: 'Enum с логикой переходов — практический паттерн "Машина состояний". canTransitionTo() инкапсулирует правила в самом enum, а не в бизнес-логике. Это делает код понятным и защищённым от недопустимых операций.'
    },
    {
      id: 6,
      title: 'Практика: Калькулятор с enum операций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай калькулятор, где операции представлены enum с методами.',
      requirements: [
        'Enum Operation: ADD, SUBTRACT, MULTIPLY, DIVIDE',
        'Каждая константа имеет символ (String) и может вычислять результат',
        'Используй абстрактный метод apply(double a, double b) в каждой константе',
        'DIVIDE должна проверять деление на ноль',
        'Класс Calculator принимает Operation и вычисляет',
        'Выполни все операции для пары чисел'
      ],
      expectedOutput: '10.0 + 4.0 = 14.0\n10.0 - 4.0 = 6.0\n10.0 * 4.0 = 40.0\n10.0 / 4.0 = 2.5\n10.0 / 0.0 = Ошибка: деление на ноль!',
      hint: 'Каждая enum-константа может переопределять абстрактный метод: ADD { public double apply(double a, double b) { return a + b; } }',
      solution: 'public enum Operation {\n    ADD("+") {\n        @Override public double apply(double a, double b) { return a + b; }\n    },\n    SUBTRACT("-") {\n        @Override public double apply(double a, double b) { return a - b; }\n    },\n    MULTIPLY("*") {\n        @Override public double apply(double a, double b) { return a * b; }\n    },\n    DIVIDE("/") {\n        @Override public double apply(double a, double b) {\n            if (b == 0) throw new ArithmeticException("деление на ноль!");\n            return a / b;\n        }\n    };\n\n    private final String symbol;\n\n    Operation(String symbol) { this.symbol = symbol; }\n\n    public abstract double apply(double a, double b);\n    public String getSymbol() { return symbol; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        double a = 10.0, b = 4.0;\n        for (Operation op : Operation.values()) {\n            try {\n                double result = op.apply(a, b);\n                System.out.println(a + " " + op.getSymbol() + " " + b + " = " + result);\n            } catch (ArithmeticException e) {\n                System.out.println(a + " " + op.getSymbol() + " " + b + " = Ошибка: " + e.getMessage());\n            }\n        }\n        // Тест деления на ноль\n        try {\n            Operation.DIVIDE.apply(10, 0);\n        } catch (ArithmeticException e) {\n            System.out.println("10.0 / 0.0 = Ошибка: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Enum с абстрактными методами — мощная техника. Каждая константа является экземпляром анонимного подкласса enum. Это объектно-ориентированный способ хранить алгоритм вместе с константой, избегая больших switch-выражений.'
    }
  ]
}
