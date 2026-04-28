export default {
  id: 130,
  title: 'Практикум: Java 17+ новые фичи',
  description: 'Records, sealed classes, pattern matching, switch expressions, text blocks, var, Optional и Stream улучшения, Virtual Threads (Java 21).',
  lessons: [
    {
      id: 1,
      title: 'Records',
      type: 'practice',
      difficulty: 'easy',
      description: 'Java Records (Java 16+) — компактный способ создания immutable data classes. Record автоматически генерирует constructor, getters, equals(), hashCode(), toString(). Покажите создание records, compact constructors, дополнительные методы и ограничения.',
      requirements: [
        'record Point(int x, int y) — простой record с двумя полями',
        'record User(String name, String email) с compact constructor (валидация)',
        'Дополнительные методы в record: distanceTo(), fullInfo()',
        'Показать автоматический equals, hashCode, toString',
        'Ограничения: нельзя наследовать, поля final, нет mutable state'
      ],
      expectedOutput: `=== Java Records ===

--- Простой Record ---
Point p1 = Point[x=3, y=4]
p1.x() = 3, p1.y() = 4

Point p2 = Point[x=3, y=4]
p1.equals(p2) = true
p1.hashCode() == p2.hashCode(): true

--- Record с валидацией ---
User: User[name=Иван, email=ivan@example.com]
Невалидный email: IllegalArgumentException: Invalid email

--- Дополнительные методы ---
p1.distanceTo(Point[x=0, y=0]) = 5.0
User.greet() = "Привет, Иван!"

--- Record как ключ HashMap ---
map.get(Point[x=3, y=4]) = Точка A (работает благодаря equals/hashCode)

--- Ограничения Records ---
- Все поля final (immutable)
- Нельзя extends (implicitly extends Record)
- Можно implements interface
- Нельзя добавить instance fields
- Можно добавить static fields и methods`,
      hint: 'Compact constructor: record User(String name, String email) { User { if (...) throw ...; } } — без повторения параметров. Accessor: name() вместо getName().',
      solution: `import java.util.*;

public class Main {
    // Простой record
    record Point(int x, int y) {
        // Дополнительный метод
        double distanceTo(Point other) {
            return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));
        }

        // Static factory method
        static Point origin() { return new Point(0, 0); }
    }

    // Record с compact constructor (валидация)
    record User(String name, String email) {
        User {
            if (name == null || name.isBlank())
                throw new IllegalArgumentException("Name cannot be empty");
            if (email == null || !email.contains("@"))
                throw new IllegalArgumentException("Invalid email");
        }

        String greet() { return "Привет, " + name + "!"; }
    }

    // Record implements interface
    interface Printable {
        String toPrettyString();
    }

    record Product(int id, String name, double price) implements Printable {
        public String toPrettyString() {
            return String.format("%s — %.2f₽", name, price);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Java Records ===");

        // Простой Record
        System.out.println("\\n--- Простой Record ---");
        Point p1 = new Point(3, 4);
        System.out.println("Point p1 = " + p1);
        System.out.println("p1.x() = " + p1.x() + ", p1.y() = " + p1.y());

        Point p2 = new Point(3, 4);
        System.out.println("\\nPoint p2 = " + p2);
        System.out.println("p1.equals(p2) = " + p1.equals(p2));
        System.out.println("p1.hashCode() == p2.hashCode(): " + (p1.hashCode() == p2.hashCode()));

        // Валидация
        System.out.println("\\n--- Record с валидацией ---");
        User user = new User("Иван", "ivan@example.com");
        System.out.println("User: " + user);
        try {
            new User("Test", "invalid-email");
        } catch (IllegalArgumentException e) {
            System.out.println("Невалидный email: IllegalArgumentException: " + e.getMessage());
        }

        // Методы
        System.out.println("\\n--- Дополнительные методы ---");
        Point origin = Point.origin();
        System.out.println("p1.distanceTo(" + origin + ") = " + p1.distanceTo(origin));
        System.out.println("User.greet() = \\"" + user.greet() + "\\"");

        // Как ключ HashMap
        System.out.println("\\n--- Record как ключ HashMap ---");
        Map<Point, String> map = new HashMap<>();
        map.put(p1, "Точка A");
        System.out.println("map.get(" + p2 + ") = " + map.get(p2)
            + " (работает благодаря equals/hashCode)");

        // Ограничения
        System.out.println("\\n--- Ограничения Records ---");
        System.out.println("- Все поля final (immutable)");
        System.out.println("- Нельзя extends (implicitly extends Record)");
        System.out.println("- Можно implements interface");
        System.out.println("- Нельзя добавить instance fields");
        System.out.println("- Можно добавить static fields и methods");
    }
}`,
      explanation: 'Records — ответ Java на Kotlin data class и Scala case class. Автоматически генерируются: canonical constructor, accessor методы (name() вместо getName()), equals() (по всем полям), hashCode(), toString(). Compact constructor — только валидация, присвоение полей автоматическое. Records идеальны для DTO, Value Objects, API responses. Ограничения: immutable by design, не могут наследоваться (extends Record implicitly), но могут реализовывать интерфейсы. С Java 16 — стабильная фича.'
    },
    {
      id: 2,
      title: 'Sealed classes',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sealed classes (Java 17) ограничивают, какие классы могут наследовать от данного. Это создаёт закрытую иерархию типов, позволяя компилятору проверять exhaustiveness в switch. Идеально для моделирования алгебраических типов данных (ADT).',
      requirements: [
        'sealed interface Shape permits Circle, Rectangle, Triangle',
        'Каждый подкласс: record (Circle, Rectangle) или final class (Triangle)',
        'Метод area() через pattern matching switch',
        'Метод describe() — полная обработка всех типов',
        'Показать ошибку компиляции при пропуске типа в switch'
      ],
      expectedOutput: `=== Sealed Classes (Java 17) ===

--- Иерархия ---
sealed interface Shape permits Circle, Rectangle, Triangle

Circle(radius=5.0) → площадь: 78.54
Rectangle(width=4.0, height=6.0) → площадь: 24.00
Triangle(base=3.0, height=8.0) → площадь: 12.00

--- Pattern Matching Switch ---
Круг с радиусом 5.0
Прямоугольник 4.0 x 6.0
Треугольник с основанием 3.0

--- Exhaustiveness ---
Switch обрабатывает ВСЕ подтипы Shape.
Если добавить новый подтип — компилятор покажет ошибку!

--- Sealed + Records (ADT) ---
sealed interface Result permits Success, Failure
  Success(value) — результат вычисления
  Failure(error) — сообщение об ошибке

processResult(Success[value=42]): Успех: 42
processResult(Failure[error=Not found]): Ошибка: Not found

=== Преимущества Sealed Classes ===
- Компилятор знает все подтипы
- Exhaustive switch — нельзя пропустить тип
- Замена Visitor pattern
- Моделирование ADT (как в Kotlin, Scala, Rust)`,
      hint: 'sealed interface Shape permits ... Подклассы должны быть final, sealed или non-sealed. record автоматически final.',
      solution: `import java.util.*;

public class Main {
    // Sealed hierarchy
    sealed interface Shape permits Circle, Rectangle, Triangle {}

    record Circle(double radius) implements Shape {}
    record Rectangle(double width, double height) implements Shape {}

    static final class Triangle implements Shape {
        final double base, height;
        Triangle(double base, double height) { this.base = base; this.height = height; }
        public String toString() { return "Triangle(base=" + base + ", height=" + height + ")"; }
    }

    // Area через switch
    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Rectangle r -> r.width() * r.height();
            case Triangle t -> 0.5 * t.base * t.height;
        };
    }

    // Describe
    static String describe(Shape shape) {
        return switch (shape) {
            case Circle c -> "Круг с радиусом " + c.radius();
            case Rectangle r -> "Прямоугольник " + r.width() + " x " + r.height();
            case Triangle t -> "Треугольник с основанием " + t.base;
        };
    }

    // ADT: Result type
    sealed interface Result<T> permits Success, Failure {}
    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String error) implements Result<T> {}

    static <T> String processResult(Result<T> result) {
        return switch (result) {
            case Success<T> s -> "Успех: " + s.value();
            case Failure<T> f -> "Ошибка: " + f.error();
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Sealed Classes (Java 17) ===");

        System.out.println("\\n--- Иерархия ---");
        System.out.println("sealed interface Shape permits Circle, Rectangle, Triangle\\n");

        List<Shape> shapes = List.of(
            new Circle(5.0),
            new Rectangle(4.0, 6.0),
            new Triangle(3.0, 8.0)
        );

        for (Shape s : shapes) {
            System.out.printf("%s → площадь: %.2f%n", s, area(s));
        }

        System.out.println("\\n--- Pattern Matching Switch ---");
        for (Shape s : shapes) {
            System.out.println(describe(s));
        }

        System.out.println("\\n--- Exhaustiveness ---");
        System.out.println("Switch обрабатывает ВСЕ подтипы Shape.");
        System.out.println("Если добавить новый подтип — компилятор покажет ошибку!");

        // ADT
        System.out.println("\\n--- Sealed + Records (ADT) ---");
        System.out.println("sealed interface Result permits Success, Failure");
        System.out.println("  Success(value) — результат вычисления");
        System.out.println("  Failure(error) — сообщение об ошибке\\n");

        Result<Integer> ok = new Success<>(42);
        Result<Integer> err = new Failure<>("Not found");
        System.out.println("processResult(" + ok + "): " + processResult(ok));
        System.out.println("processResult(" + err + "): " + processResult(err));

        System.out.println("\\n=== Преимущества Sealed Classes ===");
        System.out.println("- Компилятор знает все подтипы");
        System.out.println("- Exhaustive switch — нельзя пропустить тип");
        System.out.println("- Замена Visitor pattern");
        System.out.println("- Моделирование ADT (как в Kotlin, Scala, Rust)");
    }
}`,
      explanation: 'Sealed classes — закрытая иерархия типов. Компилятор знает все разрешённые подтипы → может проверить exhaustiveness в switch (без default!). Если добавить новый подтип — все switch выдадут ошибку компиляции. Подтипы должны быть: final (нельзя наследовать дальше), sealed (можно, но тоже с ограничениями), non-sealed (открыт для наследования). Sealed + Records = Algebraic Data Types: sealed interface Result permits Success, Failure — как в Kotlin (sealed class), Scala (sealed trait), Rust (enum).'
    },
    {
      id: 3,
      title: 'Pattern Matching for instanceof',
      type: 'practice',
      difficulty: 'easy',
      description: 'Pattern Matching for instanceof (Java 16) упрощает проверку и приведение типов. Вместо отдельного instanceof + cast, тип проверяется и переменная объявляется в одном выражении. Покажите применение в реальных сценариях.',
      requirements: [
        'Старый стиль: if (obj instanceof String) { String s = (String) obj; ... }',
        'Новый стиль: if (obj instanceof String s) { s.length(); }',
        'Использование в сложных условиях: && с дополнительными проверками',
        'Pattern matching в equals() метод',
        'Применение с sealed classes и коллекциями разных типов'
      ],
      expectedOutput: `=== Pattern Matching for instanceof ===

--- Старый vs Новый стиль ---
Старый: if (obj instanceof String) { String s = (String) obj; }
Новый:  if (obj instanceof String s) { /* s уже доступен */ }

--- Обработка разных типов ---
Объект: "Hello" → String длиной 5
Объект: 42 → Integer: чётное
Объект: 3.14 → Double: 3.14
Объект: [1, 2, 3] → List размером 3
Объект: null → null значение

--- Составные условия ---
"Java 17" — строка длиннее 3: true → содержит: "Java 17"
"Hi" — строка длиннее 3: false

--- Pattern Matching в equals() ---
Point(3, 4) equals Point(3, 4): true
Point(3, 4) equals Point(1, 2): false
Point(3, 4) equals "не Point": false

--- Обработка коллекции смешанных типов ---
Сумма чисел: 142
Конкатенация строк: HelloWorld
Вложенных списков: 2`,
      hint: 'Переменная из pattern matching доступна только в scope, где её истинность гарантирована. В && — правая часть выполняется только если левая true.',
      solution: `import java.util.*;

public class Main {
    // Обработка разных типов
    static String describe(Object obj) {
        if (obj instanceof String s) {
            return "String длиной " + s.length();
        } else if (obj instanceof Integer i) {
            return "Integer: " + (i % 2 == 0 ? "чётное" : "нечётное");
        } else if (obj instanceof Double d) {
            return "Double: " + d;
        } else if (obj instanceof List<?> list) {
            return "List размером " + list.size();
        } else if (obj == null) {
            return "null значение";
        }
        return "Неизвестный тип: " + obj.getClass().getSimpleName();
    }

    // Point с pattern matching в equals
    static class Point {
        final int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }

        public boolean equals(Object obj) {
            return obj instanceof Point p && p.x == this.x && p.y == this.y;
        }

        public int hashCode() { return Objects.hash(x, y); }
        public String toString() { return "Point(" + x + ", " + y + ")"; }
    }

    public static void main(String[] args) {
        System.out.println("=== Pattern Matching for instanceof ===");

        // Старый vs Новый
        System.out.println("\\n--- Старый vs Новый стиль ---");
        System.out.println("Старый: if (obj instanceof String) { String s = (String) obj; }");
        System.out.println("Новый:  if (obj instanceof String s) { /* s уже доступен */ }");

        // Разные типы
        System.out.println("\\n--- Обработка разных типов ---");
        Object[] objects = {"Hello", 42, 3.14, List.of(1, 2, 3), null};
        for (Object obj : objects) {
            System.out.println("Объект: " + (obj instanceof String ? "\\"" + obj + "\\"" : obj)
                + " → " + describe(obj));
        }

        // Составные условия
        System.out.println("\\n--- Составные условия ---");
        Object val1 = "Java 17";
        Object val2 = "Hi";
        if (val1 instanceof String s && s.length() > 3) {
            System.out.println("\\"" + val1 + "\\" — строка длиннее 3: true → содержит: \\"" + s + "\\"");
        }
        boolean isLong = val2 instanceof String s && s.length() > 3;
        System.out.println("\\"" + val2 + "\\" — строка длиннее 3: " + isLong);

        // equals()
        System.out.println("\\n--- Pattern Matching в equals() ---");
        Point p1 = new Point(3, 4);
        Point p2 = new Point(3, 4);
        Point p3 = new Point(1, 2);
        System.out.println(p1 + " equals " + p2 + ": " + p1.equals(p2));
        System.out.println(p1 + " equals " + p3 + ": " + p1.equals(p3));
        System.out.println(p1 + " equals \\"не Point\\": " + p1.equals("не Point"));

        // Обработка смешанной коллекции
        System.out.println("\\n--- Обработка коллекции смешанных типов ---");
        List<Object> mixed = List.of("Hello", 42, "World", 3.14, List.of(1), 100, List.of(2, 3));
        int numSum = 0;
        StringBuilder strConcat = new StringBuilder();
        int listCount = 0;

        for (Object obj : mixed) {
            if (obj instanceof Integer i) numSum += i;
            else if (obj instanceof String s) strConcat.append(s);
            else if (obj instanceof List<?> l) listCount++;
        }

        System.out.println("Сумма чисел: " + numSum);
        System.out.println("Конкатенация строк: " + strConcat);
        System.out.println("Вложенных списков: " + listCount);
    }
}`,
      explanation: 'Pattern Matching for instanceof убирает бойлерплейт: одна строка вместо двух (instanceof + cast). Переменная доступна только в scope, где гарантирована истинность условия. В && правая часть не выполняется при false левой (short-circuit), поэтому String s && s.length() > 3 безопасно. Особенно полезно в equals(): obj instanceof Point p && p.x == x && p.y == y. Это первый шаг к полному pattern matching (switch с типами в Java 21+).'
    },
    {
      id: 4,
      title: 'Switch expressions',
      type: 'practice',
      difficulty: 'easy',
      description: 'Switch expressions (Java 14) превращают switch из statement в expression, которое возвращает значение. Arrow syntax (->), yield для multi-line блоков, exhaustiveness проверка. Покажите все возможности.',
      requirements: [
        'Старый switch vs switch expression с arrow syntax (->)',
        'Switch expression возвращает значение (присваивание переменной)',
        'yield для блоков с несколькими строками',
        'Multiple labels: case "a", "b" ->',
        'Exhaustiveness: enum в switch без default'
      ],
      expectedOutput: `=== Switch Expressions (Java 14) ===

--- Arrow Syntax ---
Понедельник → Рабочий день
Суббота → Выходной
Среда → Рабочий день

--- Switch как Expression ---
int numLetters = switch(day) { case "MON"... → 6; ... }
MON → 6 букв
WEDNESDAY → 9 букв

--- yield (multi-line block) ---
Статус 200:
  HTTP 200 OK
  Описание: Успешный запрос

--- Multiple labels ---
1 → Зима
4 → Весна
7 → Лето
10 → Осень

--- Exhaustive switch (enum) ---
enum Color { RED, GREEN, BLUE }
RED → #FF0000
GREEN → #00FF00
BLUE → #0000FF
Все варианты enum обработаны — default не нужен!

--- Без fall-through ---
Arrow syntax: нет fall-through (не нужен break!)
Каждый case — изолированная ветка`,
      hint: 'Switch expression: var x = switch(val) { case "a" -> 1; case "b" -> 2; default -> 0; }; yield используется внутри { } блока.',
      solution: `import java.util.*;

public class Main {
    enum Color { RED, GREEN, BLUE }
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    public static void main(String[] args) {
        System.out.println("=== Switch Expressions (Java 14) ===");

        // Arrow syntax
        System.out.println("\\n--- Arrow Syntax ---");
        for (String day : List.of("Понедельник", "Суббота", "Среда")) {
            String type = switch (day) {
                case "Понедельник", "Вторник", "Среда", "Четверг", "Пятница" -> "Рабочий день";
                case "Суббота", "Воскресенье" -> "Выходной";
                default -> "Неизвестно";
            };
            System.out.println(day + " → " + type);
        }

        // Expression (возвращает значение)
        System.out.println("\\n--- Switch как Expression ---");
        System.out.println("int numLetters = switch(day) { case \\"MON\\"... → 6; ... }");
        for (String day : List.of("MON", "WEDNESDAY")) {
            int numLetters = switch (day) {
                case "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" -> 3;
                case "MONDAY" -> 6;
                case "TUESDAY" -> 7;
                case "WEDNESDAY" -> 9;
                default -> day.length();
            };
            System.out.println(day + " → " + numLetters + " букв");
        }

        // yield
        System.out.println("\\n--- yield (multi-line block) ---");
        int statusCode = 200;
        String result = switch (statusCode) {
            case 200 -> {
                String msg = "HTTP " + statusCode + " OK";
                String desc = "Успешный запрос";
                yield msg + "\\n  Описание: " + desc;
            }
            case 404 -> {
                yield "HTTP 404 Not Found\\n  Описание: Ресурс не найден";
            }
            case 500 -> {
                yield "HTTP 500 Internal Server Error\\n  Описание: Ошибка сервера";
            }
            default -> "HTTP " + statusCode;
        };
        System.out.println("Статус " + statusCode + ":");
        System.out.println("  " + result);

        // Multiple labels
        System.out.println("\\n--- Multiple labels ---");
        for (int month : List.of(1, 4, 7, 10)) {
            String season = switch (month) {
                case 12, 1, 2 -> "Зима";
                case 3, 4, 5 -> "Весна";
                case 6, 7, 8 -> "Лето";
                case 9, 10, 11 -> "Осень";
                default -> "?";
            };
            System.out.println(month + " → " + season);
        }

        // Exhaustive enum switch
        System.out.println("\\n--- Exhaustive switch (enum) ---");
        System.out.println("enum Color { RED, GREEN, BLUE }");
        for (Color c : Color.values()) {
            String hex = switch (c) {
                case RED -> "#FF0000";
                case GREEN -> "#00FF00";
                case BLUE -> "#0000FF";
                // Нет default — компилятор знает что все варианты покрыты!
            };
            System.out.println(c + " → " + hex);
        }
        System.out.println("Все варианты enum обработаны — default не нужен!");

        // No fall-through
        System.out.println("\\n--- Без fall-through ---");
        System.out.println("Arrow syntax: нет fall-through (не нужен break!)");
        System.out.println("Каждый case — изолированная ветка");
    }
}`,
      explanation: 'Switch expressions — одно из лучших улучшений языка. Arrow syntax (->) исключает fall-through (не нужен break!). Switch как expression возвращает значение: var x = switch(v) { ... }. yield — для multi-line блоков (аналог return в switch). Multiple labels: case "a", "b" -> вместо case "a": case "b":. Exhaustiveness для enum: компилятор проверяет все варианты, default не нужен. Если добавить новый enum constant — ошибка компиляции во всех switch. Основа для Pattern Matching switch (Java 21).'
    },
    {
      id: 5,
      title: 'Pattern Matching for switch',
      type: 'practice',
      difficulty: 'medium',
      description: 'Pattern Matching for switch (Java 21) позволяет использовать типы и условия (guarded patterns) в case. Вместе с sealed classes даёт полный exhaustive pattern matching — как в Scala, Kotlin или Rust.',
      requirements: [
        'Switch по типам: case Integer i, case String s, case null',
        'Guarded patterns: case String s when s.length() > 5',
        'Pattern matching с sealed classes (exhaustive)',
        'Deconstruction с records: case Point(var x, var y)',
        'Обработка null в switch (Java 21+)'
      ],
      expectedOutput: `=== Pattern Matching for Switch (Java 21) ===

--- Switch по типам ---
format(42) = "Число: 42"
format("Hello") = "Строка[5]: Hello"
format(3.14) = "Double: 3.14"
format(null) = "null"
format(List[1,2,3]) = "Коллекция: 3 элементов"

--- Guarded Patterns ---
classify("Hi") = "Короткая строка"
classify("Hello World") = "Длинная строка (11 символов)"
classify(42) = "Положительное число"
classify(-5) = "Отрицательное число"
classify(0) = "Ноль"

--- Sealed Classes + Pattern Matching ---
sealed interface Shape permits Circle, Rectangle, Triangle
area(Circle(5)) = 78.54
area(Rectangle(4, 6)) = 24.00
area(Triangle(3, 8)) = 12.00
Exhaustive: все подтипы обработаны без default!

--- Null handling ---
Java 21: null — полноценный case в switch
process(null) = "Обработка null"
process("test") = "Строка: test"`,
      hint: 'case String s when s.length() > 5 — guarded pattern. case null — обработка null. Порядок case важен: более специфичные (с guard) до более общих.',
      solution: `import java.util.*;

public class Main {
    // Sealed hierarchy
    sealed interface Shape permits Circle, Rect, Tri {}
    record Circle(double radius) implements Shape {}
    record Rect(double w, double h) implements Shape {}
    record Tri(double base, double height) implements Shape {}

    // Switch по типам
    static String format(Object obj) {
        return switch (obj) {
            case null -> "null";
            case Integer i -> "Число: " + i;
            case String s -> "Строка[" + s.length() + "]: " + s;
            case Double d -> "Double: " + d;
            case List<?> list -> "Коллекция: " + list.size() + " элементов";
            default -> "Другое: " + obj.getClass().getSimpleName();
        };
    }

    // Guarded patterns
    static String classify(Object obj) {
        return switch (obj) {
            case String s when s.length() > 5 -> "Длинная строка (" + s.length() + " символов)";
            case String s -> "Короткая строка";
            case Integer i when i > 0 -> "Положительное число";
            case Integer i when i < 0 -> "Отрицательное число";
            case Integer i -> "Ноль";
            case null -> "null";
            default -> "Неизвестно";
        };
    }

    // Sealed + pattern matching
    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Rect r -> r.w() * r.h();
            case Tri t -> 0.5 * t.base() * t.height();
            // Нет default — exhaustive!
        };
    }

    // Null handling
    static String process(Object obj) {
        return switch (obj) {
            case null -> "Обработка null";
            case String s -> "Строка: " + s;
            case Integer i -> "Число: " + i;
            default -> "Другое";
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Pattern Matching for Switch (Java 21) ===");

        // Switch по типам
        System.out.println("\\n--- Switch по типам ---");
        System.out.println("format(42) = \\"" + format(42) + "\\"");
        System.out.println("format(\\"Hello\\") = \\"" + format("Hello") + "\\"");
        System.out.println("format(3.14) = \\"" + format(3.14) + "\\"");
        System.out.println("format(null) = \\"" + format(null) + "\\"");
        System.out.println("format(List[1,2,3]) = \\"" + format(List.of(1, 2, 3)) + "\\"");

        // Guarded patterns
        System.out.println("\\n--- Guarded Patterns ---");
        System.out.println("classify(\\"Hi\\") = \\"" + classify("Hi") + "\\"");
        System.out.println("classify(\\"Hello World\\") = \\"" + classify("Hello World") + "\\"");
        System.out.println("classify(42) = \\"" + classify(42) + "\\"");
        System.out.println("classify(-5) = \\"" + classify(-5) + "\\"");
        System.out.println("classify(0) = \\"" + classify(0) + "\\"");

        // Sealed + pattern matching
        System.out.println("\\n--- Sealed Classes + Pattern Matching ---");
        System.out.println("sealed interface Shape permits Circle, Rectangle, Triangle");
        System.out.printf("area(Circle(5)) = %.2f%n", area(new Circle(5)));
        System.out.printf("area(Rectangle(4, 6)) = %.2f%n", area(new Rect(4, 6)));
        System.out.printf("area(Triangle(3, 8)) = %.2f%n", area(new Tri(3, 8)));
        System.out.println("Exhaustive: все подтипы обработаны без default!");

        // Null
        System.out.println("\\n--- Null handling ---");
        System.out.println("Java 21: null — полноценный case в switch");
        System.out.println("process(null) = \\"" + process(null) + "\\"");
        System.out.println("process(\\"test\\") = \\"" + process("test") + "\\"");
    }
}`,
      explanation: 'Pattern Matching for switch (JEP 441, Java 21) — кульминация серии улучшений pattern matching. Позволяет: проверять типы (case Integer i), добавлять условия (when guard), обрабатывать null (case null). Порядок важен: case String s when s.length() > 5 должен быть ДО case String s. С sealed classes switch exhaustive без default — компилятор знает все подтипы. Это Java-эквивалент Scala match, Kotlin when, Rust match. Следующий шаг — record patterns: case Point(var x, var y) (Java 21).'
    },
    {
      id: 6,
      title: 'Text blocks',
      type: 'practice',
      difficulty: 'easy',
      description: 'Text blocks (Java 15) — многострочные строковые литералы с тройными кавычками """. Автоматическое удаление общих ведущих пробелов, сохранение форматирования. Идеально для JSON, HTML, SQL.',
      requirements: [
        'JSON строка в text block — чистый формат без \\n и \\"',
        'HTML шаблон — многострочный HTML без конкатенации',
        'SQL запрос — читаемый formatted SQL',
        'String.formatted() — подстановка переменных',
        'Управление пробелами: indent, stripIndent'
      ],
      expectedOutput: `=== Text Blocks (Java 15) ===

--- JSON ---
{
  "name": "Иван",
  "age": 30,
  "skills": ["Java", "Spring", "Docker"]
}

--- HTML ---
<html>
  <body>
    <h1>Привет, Иван!</h1>
    <p>Возраст: 30</p>
  </body>
</html>

--- SQL ---
SELECT u.name, u.email, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true
GROUP BY u.name, u.email
HAVING COUNT(o.id) > 5

--- formatted() ---
Привет, Иван!
Ваш баланс: 1500.50₽
Заказов: 42

--- Сравнение ---
Старый стиль: "строка1\\n" + "строка2\\n" + "строка3"
Text block: """ (чистый многострочный текст) """
Результат одинаковый: true`,
      hint: 'Text block начинается с """ и новой строки. Закрывающие """ определяют отступ (incidental whitespace). \\s — значимый пробел в конце строки.',
      solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("=== Text Blocks (Java 15) ===");

        // JSON
        System.out.println("\\n--- JSON ---");
        String json = """
                {
                  "name": "Иван",
                  "age": 30,
                  "skills": ["Java", "Spring", "Docker"]
                }""";
        System.out.println(json);

        // HTML
        System.out.println("\\n--- HTML ---");
        String name = "Иван";
        int age = 30;
        String html = """
                <html>
                  <body>
                    <h1>Привет, %s!</h1>
                    <p>Возраст: %d</p>
                  </body>
                </html>""".formatted(name, age);
        System.out.println(html);

        // SQL
        System.out.println("\\n--- SQL ---");
        String sql = """
                SELECT u.name, u.email, COUNT(o.id)
                FROM users u
                LEFT JOIN orders o ON u.id = o.user_id
                WHERE u.active = true
                GROUP BY u.name, u.email
                HAVING COUNT(o.id) > 5""";
        System.out.println(sql);

        // formatted
        System.out.println("\\n--- formatted() ---");
        String template = """
                Привет, %s!
                Ваш баланс: %.2f₽
                Заказов: %d""";
        System.out.println(template.formatted("Иван", 1500.50, 42));

        // Comparison
        System.out.println("\\n--- Сравнение ---");
        String oldStyle = "{\\n" +
                "  \\"name\\": \\"Иван\\"\\n" +
                "}";
        String textBlock = """
                {
                  "name": "Иван"
                }""";
        System.out.println("Старый стиль: \\"строка1\\\\n\\" + \\"строка2\\\\n\\" + \\"строка3\\"");
        System.out.println("Text block: \\\"\\\"\\\" (чистый многострочный текст) \\\"\\\"\\\"");
        System.out.println("Результат одинаковый: " + oldStyle.equals(textBlock));
    }
}`,
      explanation: 'Text blocks убирают бойлерплейт многострочных строк: нет \\n, нет \\", нет + конкатенации. Отступы: Java автоматически удаляет common leading whitespace (incidental whitespace), оставляя essential whitespace. Позиция закрывающих """ определяет baseline отступа. String.formatted() (Java 15) — instance метод вместо String.format(). \\s — значимый trailing space (trim не удалит). Text blocks — compile-time feature, результат — обычный String, без runtime overhead.'
    },
    {
      id: 7,
      title: 'Var — local variable type inference',
      type: 'practice',
      difficulty: 'easy',
      description: 'var (Java 10) — выведение типа локальной переменной компилятором. Тип определяется из правой части выражения. Покажите когда var улучшает читаемость и когда ухудшает. Обсудите best practices.',
      requirements: [
        'var с простыми типами: String, int, List',
        'var с Generic типами: убирает многословность',
        'var в for-each и try-with-resources',
        'Когда var НЕ стоит использовать (снижает читаемость)',
        'Где var нельзя использовать: поля класса, параметры методов, return type'
      ],
      expectedOutput: `=== Var — Local Variable Type Inference ===

--- Простые типы ---
var name = "Иван"       → String
var age = 30             → Integer
var pi = 3.14            → Double
var active = true        → Boolean

--- Generic типы (var убирает бойлерплейт) ---
Без var: Map<String, List<Integer>> map = new HashMap<String, List<Integer>>();
С var:   var map = new HashMap<String, List<Integer>>();
Тип: HashMap<String, List<Integer>> (тот же!)

--- var в циклах ---
for (var entry : map.entrySet()) → Map.Entry<String, List<Integer>>
for (var i = 0; i < 5; i++) → int

--- Когда НЕ использовать var ---
var result = getResult();    // Что возвращает? Непонятно!
var x = calculate(a, b);     // Какой тип? int? double? String?
UserService service = getResult(); // Явный тип — понятнее!

--- Где НЕЛЬЗЯ использовать var ---
- Поля класса: class Foo { var x = 1; } → ОШИБКА
- Параметры метода: void foo(var x) → ОШИБКА
- Return type: var foo() → ОШИБКА
- Без инициализации: var x; → ОШИБКА
- null: var x = null; → ОШИБКА`,
      hint: 'var — только для локальных переменных с инициализатором. Компилятор выводит конкретный тип (не интерфейс). var list = new ArrayList<>() → ArrayList<Object>, не List<Object>!',
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Var — Local Variable Type Inference ===");

        // Простые типы
        System.out.println("\\n--- Простые типы ---");
        var name = "Иван";
        var age = 30;
        var pi = 3.14;
        var active = true;
        System.out.println("var name = \\"Иван\\"       → " + ((Object) name).getClass().getSimpleName());
        System.out.println("var age = 30             → " + ((Object) age).getClass().getSimpleName());
        System.out.println("var pi = 3.14            → " + ((Object) pi).getClass().getSimpleName());
        System.out.println("var active = true        → " + ((Object) active).getClass().getSimpleName());

        // Generic
        System.out.println("\\n--- Generic типы (var убирает бойлерплейт) ---");
        System.out.println("Без var: Map<String, List<Integer>> map = new HashMap<String, List<Integer>>();");
        System.out.println("С var:   var map = new HashMap<String, List<Integer>>();");
        var map = new HashMap<String, List<Integer>>();
        map.put("числа", List.of(1, 2, 3));
        System.out.println("Тип: " + map.getClass().getSimpleName() + "<String, List<Integer>> (тот же!)");

        // Циклы
        System.out.println("\\n--- var в циклах ---");
        for (var entry : map.entrySet()) {
            System.out.println("for (var entry : map.entrySet()) → " + entry.getClass().getSimpleName()
                + " — " + entry.getKey() + ": " + entry.getValue());
        }
        System.out.print("for (var i = 0; i < 5; i++) → int: ");
        for (var i = 0; i < 5; i++) System.out.print(i + " ");
        System.out.println();

        // Когда НЕ использовать
        System.out.println("\\n--- Когда НЕ использовать var ---");
        System.out.println("var result = getResult();    // Что возвращает? Непонятно!");
        System.out.println("var x = calculate(a, b);     // Какой тип? int? double? String?");
        System.out.println("UserService service = getResult(); // Явный тип — понятнее!");

        // Где НЕЛЬЗЯ
        System.out.println("\\n--- Где НЕЛЬЗЯ использовать var ---");
        System.out.println("- Поля класса: class Foo { var x = 1; } → ОШИБКА");
        System.out.println("- Параметры метода: void foo(var x) → ОШИБКА");
        System.out.println("- Return type: var foo() → ОШИБКА");
        System.out.println("- Без инициализации: var x; → ОШИБКА");
        System.out.println("- null: var x = null; → ОШИБКА");
    }
}`,
      explanation: 'var (JEP 286, Java 10) — синтаксический сахар, тип выводится компилятором. Это НЕ динамическая типизация — тип фиксируется при компиляции. Best practices: используйте var когда тип очевиден из правой части (var list = new ArrayList<String>()), не используйте когда тип неочевиден (var result = service.process()). var выводит конкретный тип: var list = new ArrayList<>() → ArrayList<Object>, не List. В Kotlin это val/var, в C# — var, в C++ — auto.'
    },
    {
      id: 8,
      title: 'Optional улучшения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Покажите улучшения Optional из Java 9-11: or(), stream(), ifPresentOrElse(), isEmpty(). Optional помогает избежать NullPointerException, делая отсутствие значения явным. Продемонстрируйте реальные сценарии.',
      requirements: [
        'or() — fallback Optional если текущий пустой',
        'stream() — Optional как Stream (0 или 1 элемент)',
        'ifPresentOrElse() — действие для значения и для пустого',
        'isEmpty() — проверка на пустоту (обратный isPresent)',
        'Цепочки Optional в реальном коде: findUser → getAddress → getCity'
      ],
      expectedOutput: `=== Optional Улучшения (Java 9-11) ===

--- or() — fallback Optional ---
Поиск в кеше: Optional.empty
Поиск в БД: Optional[User{Иван}]
findUser("Иван"): or(cache).or(db) → User{Иван}
findUser("Никто"): or(cache).or(db) → default User{Гость}

--- stream() — Optional → Stream ---
users с адресами: [Москва, Казань]
Optional.stream() идеально для flatMap в stream pipeline

--- ifPresentOrElse() ---
user найден: Привет, Иван!
user НЕ найден: Пользователь не найден

--- isEmpty() (Java 11) ---
Optional.of("test").isEmpty() = false
Optional.empty().isEmpty() = true

--- Цепочки Optional ---
getCity(userId=1): Москва
getCity(userId=2): Город не указан
getCity(userId=99): Пользователь не найден

--- Best Practices ---
DO: return Optional<User> из метода поиска
DO: optional.map(u -> u.getName()).orElse("unknown")
DON'T: Optional как параметр метода
DON'T: Optional для полей класса
DON'T: optional.get() без проверки`,
      hint: 'or(Supplier<Optional>) — ленивый fallback. stream() возвращает Stream из 0 или 1 элемента. ifPresentOrElse(Consumer, Runnable) — два действия.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record User(String name, String city) {}

    // Имитация хранилищ
    static Optional<User> findInCache(String name) {
        System.out.println("Поиск в кеше: Optional.empty");
        return Optional.empty();
    }

    static Optional<User> findInDb(String name) {
        Map<String, User> db = Map.of("Иван", new User("Иван", "Москва"),
                                       "Мария", new User("Мария", "Казань"));
        Optional<User> result = Optional.ofNullable(db.get(name));
        System.out.println("Поиск в БД: " + result);
        return result;
    }

    static Optional<User> defaultUser() {
        return Optional.of(new User("Гость", "Неизвестно"));
    }

    // Цепочка
    static Map<Integer, User> users = Map.of(
        1, new User("Иван", "Москва"),
        2, new User("Мария", null)
    );

    static Optional<User> findById(int id) {
        return Optional.ofNullable(users.get(id));
    }

    static Optional<String> getCity(int userId) {
        return findById(userId)
            .flatMap(u -> Optional.ofNullable(u.city()));
    }

    public static void main(String[] args) {
        System.out.println("=== Optional Улучшения (Java 9-11) ===");

        // or()
        System.out.println("\\n--- or() — fallback Optional ---");
        User found = findInCache("Иван")
            .or(() -> findInDb("Иван"))
            .orElseGet(() -> defaultUser().get());
        System.out.println("findUser(\\"Иван\\"): or(cache).or(db) → " + found);

        User notFound = findInCache("Никто")
            .or(() -> findInDb("Никто"))
            .or(Main::defaultUser)
            .get();
        System.out.println("findUser(\\"Никто\\"): or(cache).or(db) → default " + notFound);

        // stream()
        System.out.println("\\n--- stream() — Optional → Stream ---");
        List<Optional<User>> optUsers = List.of(
            Optional.of(new User("Иван", "Москва")),
            Optional.empty(),
            Optional.of(new User("Мария", "Казань")),
            Optional.empty()
        );
        List<String> cities = optUsers.stream()
            .flatMap(Optional::stream)
            .map(User::city)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        System.out.println("users с адресами: " + cities);
        System.out.println("Optional.stream() идеально для flatMap в stream pipeline");

        // ifPresentOrElse()
        System.out.println("\\n--- ifPresentOrElse() ---");
        Optional<User> user1 = Optional.of(new User("Иван", "Москва"));
        Optional<User> user2 = Optional.empty();

        System.out.print("user найден: ");
        user1.ifPresentOrElse(
            u -> System.out.println("Привет, " + u.name() + "!"),
            () -> System.out.println("Пользователь не найден")
        );
        System.out.print("user НЕ найден: ");
        user2.ifPresentOrElse(
            u -> System.out.println("Привет, " + u.name() + "!"),
            () -> System.out.println("Пользователь не найден")
        );

        // isEmpty()
        System.out.println("\\n--- isEmpty() (Java 11) ---");
        System.out.println("Optional.of(\\"test\\").isEmpty() = " + Optional.of("test").isEmpty());
        System.out.println("Optional.empty().isEmpty() = " + Optional.empty().isEmpty());

        // Цепочки
        System.out.println("\\n--- Цепочки Optional ---");
        System.out.println("getCity(userId=1): " + getCity(1).orElse("Город не указан"));
        System.out.println("getCity(userId=2): " + getCity(2).orElse("Город не указан"));
        System.out.println("getCity(userId=99): " +
            findById(99).map(u -> u.city()).orElse("Пользователь не найден"));

        // Best practices
        System.out.println("\\n--- Best Practices ---");
        System.out.println("DO: return Optional<User> из метода поиска");
        System.out.println("DO: optional.map(u -> u.getName()).orElse(\\"unknown\\")");
        System.out.println("DON'T: Optional как параметр метода");
        System.out.println("DON'T: Optional для полей класса");
        System.out.println("DON'T: optional.get() без проверки");
    }
}`,
      explanation: 'Optional улучшения по версиям: Java 9: or() (fallback Optional), stream() (Optional→Stream), ifPresentOrElse(); Java 10: orElseThrow() без параметров; Java 11: isEmpty(). or() — ленивый fallback: вычисляет Supplier<Optional> только если текущий пустой. stream() — превращает Optional в Stream(0|1), идеально для flatMap. Золотое правило: Optional — только для return type методов поиска. НЕ для полей, параметров, коллекций. orElse() vs orElseGet(): orElse() всегда вычисляет значение, orElseGet() — лениво.'
    },
    {
      id: 9,
      title: 'Stream улучшения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Покажите улучшения Stream API из Java 9-16: toList(), mapMulti(), takeWhile()/dropWhile(), Collectors.teeing(). Эти методы упрощают типичные операции и убирают бойлерплейт.',
      requirements: [
        'toList() (Java 16) — вместо collect(Collectors.toList())',
        'takeWhile() / dropWhile() — обработка отсортированных данных',
        'mapMulti() — замена flatMap для простых случаев',
        'Collectors.teeing() — два collector-а одновременно',
        'Stream.iterate с hasNext, Stream.ofNullable'
      ],
      expectedOutput: `=== Stream Улучшения (Java 9-16) ===

--- toList() (Java 16) ---
Старый: stream.collect(Collectors.toList())
Новый:  stream.toList()
Результат: [2, 4, 6, 8, 10]
Внимание: toList() возвращает unmodifiable list!

--- takeWhile() / dropWhile() (Java 9) ---
Числа: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
takeWhile(x < 5): [1, 2, 3, 4]
dropWhile(x < 5): [5, 6, 7, 8, 9, 10]

Логи по уровню:
takeWhile(INFO): [INFO: start, INFO: processing]
dropWhile(INFO): [WARN: slow, ERROR: fail, INFO: end]

--- mapMulti() (Java 16) ---
Числа → чётные удвоить, нечётные пропустить:
[1,2,3,4,5] → [4, 8]
mapMulti быстрее flatMap для простых 0/1/few маппингов

--- Collectors.teeing() (Java 12) ---
Зарплаты: [50000, 70000, 60000, 90000, 80000]
Одновременно min и max:
  min = 50000, max = 90000, spread = 40000

Одновременно count и sum:
  count = 5, sum = 350000, avg = 70000.0

--- Stream.iterate с predicate (Java 9) ---
Степени 2 до 1000: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]

--- Stream.ofNullable (Java 9) ---
ofNullable("hello"): [hello]
ofNullable(null): []`,
      hint: 'mapMulti((element, consumer) -> { if (condition) consumer.accept(transformed); }) — consumer-based API, нет создания промежуточных Stream. teeing(collector1, collector2, merger) — merge результатов двух коллекторов.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Stream Улучшения (Java 9-16) ===");

        // toList()
        System.out.println("\\n--- toList() (Java 16) ---");
        System.out.println("Старый: stream.collect(Collectors.toList())");
        System.out.println("Новый:  stream.toList()");
        List<Integer> evens = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).stream()
            .filter(x -> x % 2 == 0)
            .toList();
        System.out.println("Результат: " + evens);
        System.out.println("Внимание: toList() возвращает unmodifiable list!");

        // takeWhile / dropWhile
        System.out.println("\\n--- takeWhile() / dropWhile() (Java 9) ---");
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        System.out.println("Числа: " + nums);
        System.out.println("takeWhile(x < 5): " + nums.stream().takeWhile(x -> x < 5).toList());
        System.out.println("dropWhile(x < 5): " + nums.stream().dropWhile(x -> x < 5).toList());

        System.out.println("\\nЛоги по уровню:");
        List<String> logs = List.of("INFO: start", "INFO: processing", "WARN: slow", "ERROR: fail", "INFO: end");
        System.out.println("takeWhile(INFO): " +
            logs.stream().takeWhile(l -> l.startsWith("INFO")).toList());
        System.out.println("dropWhile(INFO): " +
            logs.stream().dropWhile(l -> l.startsWith("INFO")).toList());

        // mapMulti
        System.out.println("\\n--- mapMulti() (Java 16) ---");
        System.out.println("Числа → чётные удвоить, нечётные пропустить:");
        List<Integer> result = List.of(1, 2, 3, 4, 5).stream()
            .<Integer>mapMulti((x, consumer) -> {
                if (x % 2 == 0) consumer.accept(x * 2);
            })
            .toList();
        System.out.println("[1,2,3,4,5] → " + result);
        System.out.println("mapMulti быстрее flatMap для простых 0/1/few маппингов");

        // Collectors.teeing
        System.out.println("\\n--- Collectors.teeing() (Java 12) ---");
        List<Integer> salaries = List.of(50000, 70000, 60000, 90000, 80000);
        System.out.println("Зарплаты: " + salaries);
        System.out.println("Одновременно min и max:");

        var minMax = salaries.stream().collect(
            Collectors.teeing(
                Collectors.minBy(Comparator.naturalOrder()),
                Collectors.maxBy(Comparator.naturalOrder()),
                (min, max) -> "  min = " + min.orElse(0)
                    + ", max = " + max.orElse(0)
                    + ", spread = " + (max.orElse(0) - min.orElse(0))
            )
        );
        System.out.println(minMax);

        System.out.println("\\nОдновременно count и sum:");
        var countAndSum = salaries.stream().collect(
            Collectors.teeing(
                Collectors.counting(),
                Collectors.summingLong(Integer::longValue),
                (count, sum) -> "  count = " + count
                    + ", sum = " + sum
                    + ", avg = " + (sum / (double) count)
            )
        );
        System.out.println(countAndSum);

        // Stream.iterate with predicate
        System.out.println("\\n--- Stream.iterate с predicate (Java 9) ---");
        List<Integer> powers = Stream.iterate(1, n -> n < 1000, n -> n * 2).toList();
        System.out.println("Степени 2 до 1000: " + powers);

        // Stream.ofNullable
        System.out.println("\\n--- Stream.ofNullable (Java 9) ---");
        System.out.println("ofNullable(\\"hello\\"): " + Stream.ofNullable("hello").toList());
        System.out.println("ofNullable(null): " + Stream.ofNullable(null).toList());
    }
}`,
      explanation: 'Ключевые улучшения: toList() (Java 16) — shortcut для collect(Collectors.toList()), но возвращает unmodifiable List. takeWhile/dropWhile (Java 9) — для ordered streams, останавливаются на первом несовпадении. mapMulti (Java 16) — consumer-based flatMap, эффективнее для 0-1 маппинга (нет создания Stream объектов). teeing (Java 12) — два collector-а за один проход: минимум+максимум, count+sum и т.д. Stream.iterate(seed, hasNext, next) (Java 9) — конечный iterate без limit().'
    },
    {
      id: 10,
      title: 'Virtual Threads (Java 21)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Virtual Threads (Project Loom, Java 21) — лёгкие потоки, управляемые JVM. Можно создать миллион потоков без проблем. Carrier thread (OS-поток) разделяется между виртуальными потоками. Blocking-операции не блокируют OS-поток.',
      requirements: [
        'Thread.ofVirtual().start() — создание виртуального потока',
        'Executors.newVirtualThreadPerTaskExecutor() — пул виртуальных потоков',
        'Создание 100_000 виртуальных потоков (vs невозможность с OS-потоками)',
        'Бенчмарк: blocking IO задачи на виртуальных vs платформенных потоках',
        'Structured Concurrency (preview): StructuredTaskScope'
      ],
      expectedOutput: `=== Virtual Threads (Java 21) ===

--- Создание Virtual Thread ---
Thread: VirtualThread[#21]/runnable → isVirtual: true
Platform Thread: Thread[#22,Thread-0] → isVirtual: false

--- 100_000 Virtual Threads ---
Создание 100000 виртуальных потоков...
Все завершены за ~800 мс
Каждый поток выполнил Thread.sleep(1000)!

Попытка 100000 platform threads:
  Провал: OutOfMemoryError или ~50 секунд

--- Blocking IO Benchmark ---
10000 HTTP-подобных задач (Thread.sleep = IO wait):

Virtual threads:  ~1200 мс
Platform threads (pool=200): ~50000 мс

Virtual threads быстрее в ~40x для IO-bound задач!

--- Когда использовать ---
Virtual Threads идеальны для:
- HTTP серверы (тысячи запросов)
- Микросервисы (много IO-вызовов)
- Работа с БД (JDBC blocking)

НЕ для:
- CPU-bound задачи (используйте ForkJoinPool)
- Synchronized блоки (pinning carrier thread)
- ThreadLocal с большими данными`,
      hint: 'Thread.ofVirtual().name("vt-", 0).factory() — фабрика с нумерацией. Executors.newVirtualThreadPerTaskExecutor() — каждая задача = новый виртуальный поток. Thread.currentThread().isVirtual() — проверка.',
      solution: `import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("=== Virtual Threads (Java 21) ===");

        // Создание
        System.out.println("\\n--- Создание Virtual Thread ---");
        Thread vt = Thread.ofVirtual().name("vt-1").start(() -> {
            System.out.println("Thread: " + Thread.currentThread() + " → isVirtual: "
                + Thread.currentThread().isVirtual());
        });
        vt.join();

        Thread pt = Thread.ofPlatform().name("Thread-0").start(() -> {
            System.out.println("Platform Thread: " + Thread.currentThread() + " → isVirtual: "
                + Thread.currentThread().isVirtual());
        });
        pt.join();

        // 100K виртуальных потоков
        System.out.println("\\n--- 100_000 Virtual Threads ---");
        int count = 100_000;
        System.out.println("Создание " + count + " виртуальных потоков...");

        long start1 = System.nanoTime();
        AtomicInteger completed = new AtomicInteger(0);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < count; i++) {
                executor.submit(() -> {
                    try { Thread.sleep(1000); } catch (InterruptedException e) {}
                    completed.incrementAndGet();
                });
            }
        } // автоматически ждёт завершения всех задач

        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.println("Все завершены за ~" + time1 + " мс");
        System.out.println("Каждый поток выполнил Thread.sleep(1000)!");
        System.out.println("\\nПопытка " + count + " platform threads:");
        System.out.println("  Провал: OutOfMemoryError или ~50 секунд");

        // Benchmark: virtual vs platform for IO tasks
        System.out.println("\\n--- Blocking IO Benchmark ---");
        int tasks = 10_000;
        System.out.println(tasks + " HTTP-подобных задач (Thread.sleep = IO wait):\\n");

        // Virtual threads
        long vStart = System.nanoTime();
        try (var vExec = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<?>> futures = new ArrayList<>();
            for (int i = 0; i < tasks; i++) {
                futures.add(vExec.submit(() -> {
                    try { Thread.sleep(100); } catch (InterruptedException e) {} // simulate IO
                }));
            }
            for (var f : futures) f.get();
        }
        long vTime = (System.nanoTime() - vStart) / 1_000_000;
        System.out.println("Virtual threads:  ~" + vTime + " мс");

        // Platform threads (limited pool)
        long pStart = System.nanoTime();
        try (var pExec = Executors.newFixedThreadPool(200)) {
            List<Future<?>> futures = new ArrayList<>();
            for (int i = 0; i < tasks; i++) {
                futures.add(pExec.submit(() -> {
                    try { Thread.sleep(100); } catch (InterruptedException e) {} // simulate IO
                }));
            }
            for (var f : futures) f.get();
        }
        long pTime = (System.nanoTime() - pStart) / 1_000_000;
        System.out.println("Platform threads (pool=200): ~" + pTime + " мс");

        System.out.printf("\\nVirtual threads быстрее в ~%.0fx для IO-bound задач!%n",
            (double) pTime / Math.max(vTime, 1));

        // Recommendations
        System.out.println("\\n--- Когда использовать ---");
        System.out.println("Virtual Threads идеальны для:");
        System.out.println("- HTTP серверы (тысячи запросов)");
        System.out.println("- Микросервисы (много IO-вызовов)");
        System.out.println("- Работа с БД (JDBC blocking)");
        System.out.println("\\nНЕ для:");
        System.out.println("- CPU-bound задачи (используйте ForkJoinPool)");
        System.out.println("- Synchronized блоки (pinning carrier thread)");
        System.out.println("- ThreadLocal с большими данными");
    }
}`,
      explanation: 'Virtual Threads (JEP 444, Java 21) — революция в Java concurrency. Platform thread = OS-поток (~1MB stack, max ~10K). Virtual thread = JVM-управляемый (~1KB stack, millions). При blocking IO (sleep, socket read, JDBC) виртуальный поток «отцепляется» от carrier (OS) потока, другой виртуальный поток занимает его место. Ограничения: synchronized блокирует carrier thread (pinning) — используйте ReentrantLock. Structured Concurrency (JEP 462, preview): StructuredTaskScope для управления группами задач. Spring Boot 3.2+ и Tomcat 11 уже поддерживают Virtual Threads.'
    }
  ]
};
