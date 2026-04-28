export default {
  id: 32,
  title: 'Лямбда-выражения',
  description: 'Полное руководство по лямбда-выражениям в Java 8+: от проблемы анонимных классов до цепочек функциональных интерфейсов, ссылок на методы и замыканий.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны лямбды',
      type: 'theory',
      content: [
        { type: 'text', value: 'До Java 8, чтобы передать поведение как параметр, приходилось создавать анонимные классы. Это было громоздко и многословно. Лямбда-выражения решают эту проблему — они позволяют записать то же самое в одну строку.' },
        { type: 'heading', value: 'Проблема: многословность анонимных классов' },
        { type: 'text', value: 'Рассмотрим типичную задачу — сортировка списка строк. До Java 8 нужно было создать анонимный класс Comparator:' },
        { type: 'code', language: 'java', value: `import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;

public class BeforeLambda {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(Arrays.asList(
            "Виктор", "Анна", "Борис", "Дмитрий"
        ));

        // ДО Java 8: анонимный класс — 7 строк ради одной операции!
        names.sort(new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.compareTo(b);
            }
        });

        System.out.println(names);
        // [Анна, Борис, Виктор, Дмитрий]
    }
}` },
        { type: 'text', value: 'Из 7 строк анонимного класса полезная только одна: a.compareTo(b). Всё остальное — шаблонный код (boilerplate).' },
        { type: 'heading', value: 'Решение: лямбда-выражение' },
        { type: 'code', language: 'java', value: `import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class AfterLambda {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(Arrays.asList(
            "Виктор", "Анна", "Борис", "Дмитрий"
        ));

        // ПОСЛЕ Java 8: лямбда — одна строка!
        names.sort((a, b) -> a.compareTo(b));

        System.out.println(names);
        // [Анна, Борис, Виктор, Дмитрий]
    }
}` },
        { type: 'heading', value: 'Ещё примеры: до и после' },
        { type: 'code', language: 'java', value: `// Пример 1: Запуск потока (Runnable)

// ДО: анонимный класс
Thread t1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Поток запущен!");
    }
});

// ПОСЛЕ: лямбда
Thread t2 = new Thread(() -> System.out.println("Поток запущен!"));

// ---

// Пример 2: Обработка кнопки (ActionListener)

// ДО:
// button.addActionListener(new ActionListener() {
//     @Override
//     public void actionPerformed(ActionEvent e) {
//         System.out.println("Кнопка нажата!");
//     }
// });

// ПОСЛЕ:
// button.addActionListener(e -> System.out.println("Кнопка нажата!"));

// ---

// Пример 3: forEach по коллекции

// ДО:
List<String> items = Arrays.asList("Java", "Python", "Go");
for (String item : items) {
    System.out.println(item);
}

// ПОСЛЕ:
items.forEach(item -> System.out.println(item));

// ЕЩЁ КОРОЧЕ (ссылка на метод):
items.forEach(System.out::println);` },
        { type: 'tip', value: 'Лямбда — это не просто синтаксический сахар. Компилятор создаёт для лямбд более эффективный байт-код через invokedynamic, чем для анонимных классов. Лямбда не создаёт отдельный .class файл.' },
        { type: 'text', value: 'Лямбда-выражение можно использовать везде, где ожидается функциональный интерфейс — интерфейс с ровно одним абстрактным методом. Об этом подробно в следующем уроке.' }
      ]
    },
    {
      id: 2,
      title: 'Функциональные интерфейсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функциональный интерфейс (Functional Interface) — это интерфейс, содержащий ровно один абстрактный метод. Такие интерфейсы ещё называют SAM-интерфейсами (Single Abstract Method). Лямбда-выражение может быть присвоено переменной любого функционального интерфейса.' },
        { type: 'heading', value: 'Аннотация @FunctionalInterface' },
        { type: 'code', language: 'java', value: `// @FunctionalInterface — необязательная, но рекомендуемая аннотация.
// Компилятор проверит, что в интерфейсе ровно один абстрактный метод.

@FunctionalInterface
interface Greeter {
    void greet(String name); // единственный абстрактный метод

    // default и static методы — можно сколько угодно!
    default void greetAll(String... names) {
        for (String name : names) {
            greet(name);
        }
    }

    static Greeter formal() {
        return name -> System.out.println("Уважаемый " + name + "!");
    }
}

// Ошибка компиляции! Два абстрактных метода.
// @FunctionalInterface
// interface InvalidFI {
//     void method1();
//     void method2(); // ОШИБКА: не функциональный интерфейс
// }` },
        { type: 'heading', value: 'Правила SAM (Single Abstract Method)' },
        { type: 'code', language: 'java', value: `// Интерфейс считается функциональным, если:
// 1. Имеет ровно ОДИН абстрактный метод
// 2. Может иметь любое количество default/static методов
// 3. Может переопределять методы Object (toString, equals, hashCode)

@FunctionalInterface
interface Transformer<T> {
    T transform(T input);           // абстрактный — ОДИН

    default Transformer<T> andThen(Transformer<T> after) {
        return input -> after.transform(this.transform(input));
    }

    // Переопределение метода Object — не считается абстрактным
    String toString();
}

// Использование:
Transformer<String> upper = s -> s.toUpperCase();
Transformer<String> trim = s -> s.trim();
Transformer<String> pipeline = upper.andThen(trim);

System.out.println(pipeline.transform("  hello  ")); // HELLO` },
        { type: 'heading', value: 'Встроенные функциональные интерфейсы JDK' },
        { type: 'code', language: 'java', value: `// Java уже имеет множество функциональных интерфейсов.
// Не нужно создавать свои для типовых задач!

// 1. Runnable — () -> void
Runnable task = () -> System.out.println("Задача выполнена");

// 2. Comparator<T> — (T, T) -> int
Comparator<String> byLength = (a, b) -> a.length() - b.length();

// 3. Callable<V> — () -> V (может бросить Exception)
// Callable<String> call = () -> fetchFromDatabase();

// 4. Из пакета java.util.function (основные):
// Predicate<T>    — T -> boolean   (проверка условия)
// Function<T, R>  — T -> R         (преобразование)
// Consumer<T>     — T -> void      (потребление)
// Supplier<T>     — () -> T        (создание/поставка)
// BiFunction<T,U,R> — (T, U) -> R  (два аргумента)
// UnaryOperator<T>  — T -> T       (то же что Function<T,T>)
// BinaryOperator<T> — (T, T) -> T  (то же что BiFunction<T,T,T>)` },
        { type: 'heading', value: 'Создание собственного функционального интерфейса' },
        { type: 'code', language: 'java', value: `@FunctionalInterface
interface Validator<T> {
    boolean validate(T item);
}

@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);
}

@FunctionalInterface
interface TriFunction<A, B, C, R> {
    R apply(A a, B b, C c);
}

public class Main {
    public static void main(String[] args) {
        Validator<String> notEmpty = s -> s != null && !s.isEmpty();
        Validator<Integer> isAdult = age -> age >= 18;

        System.out.println(notEmpty.validate("Привет")); // true
        System.out.println(notEmpty.validate(""));        // false
        System.out.println(isAdult.validate(25));         // true
        System.out.println(isAdult.validate(12));         // false

        Converter<String, Integer> toInt = Integer::parseInt;
        System.out.println(toInt.convert("42")); // 42

        TriFunction<Integer, Integer, Integer, Integer> sum3 =
            (a, b, c) -> a + b + c;
        System.out.println(sum3.apply(1, 2, 3)); // 6
    }
}` },
        { type: 'note', value: 'Правило: если стандартный интерфейс из java.util.function подходит — используй его. Создавай свой только если нужна специфическая семантика (Validator вместо Predicate для читаемости) или нестандартная сигнатура (TriFunction).' }
      ]
    },
    {
      id: 3,
      title: 'Синтаксис лямбда-выражений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лямбда-выражение состоит из трёх частей: параметры, стрелка -> и тело. Java предоставляет множество сокращений для максимальной компактности.' },
        { type: 'heading', value: 'Полный синтаксис' },
        { type: 'code', language: 'java', value: `// Полная форма:
// (ТипПараметра1 параметр1, ТипПараметра2 параметр2) -> { тело; return результат; }

import java.util.function.*;

// Полная форма — все типы указаны, тело в фигурных скобках
Function<String, Integer> fullForm = (String s) -> {
    return s.length();
};

BiFunction<Integer, Integer, Integer> add = (Integer a, Integer b) -> {
    return a + b;
};

System.out.println(fullForm.apply("Привет")); // 6
System.out.println(add.apply(3, 7));           // 10` },
        { type: 'heading', value: 'Сокращение 1: вывод типов' },
        { type: 'code', language: 'java', value: `// Компилятор знает типы параметров из контекста.
// Типы можно не указывать.

// Полная форма:
Comparator<String> comp1 = (String a, String b) -> { return a.compareTo(b); };

// Без типов (компилятор выводит из Comparator<String>):
Comparator<String> comp2 = (a, b) -> { return a.compareTo(b); };

// ВАЖНО: нельзя указать тип только у части параметров!
// Comparator<String> bad = (String a, b) -> a.compareTo(b); // ОШИБКА!` },
        { type: 'heading', value: 'Сокращение 2: без скобок для одного параметра' },
        { type: 'code', language: 'java', value: `// Если параметр один и тип не указан — скобки необязательны.

// Со скобками:
Function<String, String> upper1 = (s) -> s.toUpperCase();

// Без скобок:
Function<String, String> upper2 = s -> s.toUpperCase();

// НО! Если указан тип — скобки обязательны:
Function<String, String> upper3 = (String s) -> s.toUpperCase();

// Без параметров — пустые скобки обязательны:
Supplier<String> hello = () -> "Привет!";

// Два и более параметра — скобки обязательны:
BiFunction<Integer, Integer, Integer> sum = (a, b) -> a + b;` },
        { type: 'heading', value: 'Сокращение 3: без return и без фигурных скобок' },
        { type: 'code', language: 'java', value: `// Если тело — одно выражение, то:
// - не нужны фигурные скобки {}
// - не нужен return (результат возвращается автоматически)
// - не нужна точка с запятой внутри

// Полная форма:
Function<Integer, Integer> square1 = (n) -> { return n * n; };

// Сокращённая:
Function<Integer, Integer> square2 = n -> n * n;

// Для void-методов — одно действие без скобок:
Consumer<String> print1 = (s) -> { System.out.println(s); };
Consumer<String> print2 = s -> System.out.println(s);

// ВАЖНО: если тело содержит несколько строк — скобки и return ОБЯЗАТЕЛЬНЫ:
Function<Integer, String> classify = n -> {
    if (n > 0) return "положительное";
    if (n < 0) return "отрицательное";
    return "ноль";
};

System.out.println(classify.apply(5));  // положительное
System.out.println(classify.apply(-3)); // отрицательное
System.out.println(classify.apply(0));  // ноль` },
        { type: 'heading', value: 'Шпаргалка по сокращениям' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

// === Без параметров ===
Supplier<Double> random = () -> Math.random();

// === Один параметр ===
// Полная:
Function<String, Integer> len1 = (String s) -> { return s.length(); };
// Без типа:
Function<String, Integer> len2 = (s) -> { return s.length(); };
// Без скобок:
Function<String, Integer> len3 = s -> { return s.length(); };
// Без return:
Function<String, Integer> len4 = s -> s.length();

// === Два параметра ===
// Полная:
BinaryOperator<Integer> max1 = (Integer a, Integer b) -> { return a > b ? a : b; };
// Без типов:
BinaryOperator<Integer> max2 = (a, b) -> { return a > b ? a : b; };
// Без return:
BinaryOperator<Integer> max3 = (a, b) -> a > b ? a : b;

// === Многострочное тело ===
Consumer<String> process = s -> {
    String upper = s.toUpperCase();
    String trimmed = upper.trim();
    System.out.println("Результат: " + trimmed);
};

process.accept("  hello  "); // Результат: HELLO` },
        { type: 'tip', value: 'Общее правило: убирай всё лишнее. Один параметр без типа? Убери скобки. Одно выражение? Убери фигурные скобки и return. Компилятор и так всё поймёт.' }
      ]
    },
    {
      id: 4,
      title: 'Стандартные функциональные интерфейсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пакет java.util.function содержит 43 функциональных интерфейса. Из них 6 основных покрывают 90% задач: Predicate, Function, Consumer, Supplier, BiFunction и UnaryOperator. Знание этих интерфейсов — ключ к эффективной работе с лямбдами.' },
        { type: 'heading', value: 'Обзор основных интерфейсов' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

// ╔═══════════════════╦══════════════╦═════════════╦═══════════════╗
// ║ Интерфейс         ║ Метод        ║ Вход        ║ Выход         ║
// ╠═══════════════════╬══════════════╬═════════════╬═══════════════╣
// ║ Predicate<T>      ║ test(T)      ║ T           ║ boolean       ║
// ║ Function<T, R>    ║ apply(T)     ║ T           ║ R             ║
// ║ Consumer<T>       ║ accept(T)    ║ T           ║ void          ║
// ║ Supplier<T>       ║ get()        ║ —           ║ T             ║
// ║ BiFunction<T,U,R> ║ apply(T, U)  ║ T, U        ║ R             ║
// ║ UnaryOperator<T>  ║ apply(T)     ║ T           ║ T             ║
// ║ BinaryOperator<T> ║ apply(T, T)  ║ T, T        ║ T             ║
// ║ BiPredicate<T,U>  ║ test(T, U)   ║ T, U        ║ boolean       ║
// ║ BiConsumer<T,U>   ║ accept(T, U) ║ T, U        ║ void          ║
// ╚═══════════════════╩══════════════╩═════════════╩═══════════════╝` },
        { type: 'heading', value: 'Как выбрать нужный интерфейс' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

public class ChoosingInterface {
    public static void main(String[] args) {

        // Нужно ПРОВЕРИТЬ условие? -> Predicate
        Predicate<Integer> isAdult = age -> age >= 18;

        // Нужно ПРЕОБРАЗОВАТЬ один тип в другой? -> Function
        Function<String, Integer> toLength = s -> s.length();

        // Нужно ПРЕОБРАЗОВАТЬ, но тип не меняется? -> UnaryOperator
        UnaryOperator<String> shout = s -> s.toUpperCase() + "!";

        // Нужно ЧТО-ТО СДЕЛАТЬ с объектом (вывод, запись)? -> Consumer
        Consumer<String> log = s -> System.out.println("[LOG] " + s);

        // Нужно СОЗДАТЬ/ПОЛУЧИТЬ объект? -> Supplier
        Supplier<StringBuilder> sbFactory = () -> new StringBuilder();

        // Нужно ПРИНЯТЬ ДВА аргумента и вернуть результат? -> BiFunction
        BiFunction<String, Integer, String> repeat =
            (s, n) -> s.repeat(n);

        // Нужна ОПЕРАЦИЯ над двумя одинаковыми типами? -> BinaryOperator
        BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;

        // Демонстрация:
        System.out.println(isAdult.test(25));             // true
        System.out.println(toLength.apply("Привет"));     // 6
        System.out.println(shout.apply("java"));          // JAVA!
        log.accept("Запуск приложения");                  // [LOG] Запуск приложения
        System.out.println(sbFactory.get().append("OK")); // OK
        System.out.println(repeat.apply("Ха", 3));        // ХаХаХа
        System.out.println(max.apply(10, 20));             // 20
    }
}` },
        { type: 'heading', value: 'Примитивные специализации' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

// Для примитивов есть специальные версии без автоупаковки (boxing):

// IntPredicate, LongPredicate, DoublePredicate
IntPredicate isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4)); // true — без Integer boxing!

// IntFunction<R>, LongFunction<R>, DoubleFunction<R>
IntFunction<String> intToStr = n -> "Число: " + n;
System.out.println(intToStr.apply(42)); // Число: 42

// IntConsumer, LongConsumer, DoubleConsumer
IntConsumer printInt = n -> System.out.println("int: " + n);
printInt.accept(100); // int: 100

// IntSupplier, LongSupplier, DoubleSupplier
IntSupplier dice = () -> (int)(Math.random() * 6) + 1;
System.out.println(dice.getAsInt()); // 1-6

// IntUnaryOperator, LongUnaryOperator, DoubleUnaryOperator
IntUnaryOperator doubleIt = n -> n * 2;
System.out.println(doubleIt.applyAsInt(5)); // 10

// IntBinaryOperator, LongBinaryOperator, DoubleBinaryOperator
IntBinaryOperator sum = (a, b) -> a + b;
System.out.println(sum.applyAsInt(3, 7)); // 10

// ToIntFunction<T>, ToLongFunction<T>, ToDoubleFunction<T>
ToIntFunction<String> strlen = s -> s.length();
System.out.println(strlen.applyAsInt("Java")); // 4` },
        { type: 'note', value: 'Используй примитивные специализации (IntPredicate, IntFunction и т.д.) в критичном к производительности коде, чтобы избежать лишнего boxing/unboxing. Для обычного кода Predicate<Integer>, Function<Integer, String> — вполне достаточно.' }
      ]
    },
    {
      id: 5,
      title: 'Predicate — проверка условий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Predicate<T> — один из самых часто используемых функциональных интерфейсов. Его задача — проверить условие и вернуть true/false. Predicate поддерживает композицию через методы and(), or(), negate() и isEqual().' },
        { type: 'heading', value: 'Основы: метод test()' },
        { type: 'code', language: 'java', value: `import java.util.function.Predicate;

public class PredicateBasics {
    public static void main(String[] args) {
        // Predicate<T> — принимает T, возвращает boolean
        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Predicate<String> isLong = s -> s.length() > 10;
        Predicate<String> startsWithJ = s -> s.startsWith("J");

        System.out.println(isPositive.test(5));      // true
        System.out.println(isPositive.test(-3));     // false
        System.out.println(isEven.test(8));          // true
        System.out.println(isLong.test("Привет"));   // false
        System.out.println(startsWithJ.test("Java")); // true
    }
}` },
        { type: 'heading', value: 'Комбинирование: and(), or(), negate()' },
        { type: 'code', language: 'java', value: `import java.util.function.Predicate;

Predicate<Integer> isPositive = n -> n > 0;
Predicate<Integer> isEven = n -> n % 2 == 0;
Predicate<Integer> isSmall = n -> n < 100;

// and() — оба условия должны быть true (логическое И)
Predicate<Integer> isPositiveAndEven = isPositive.and(isEven);
System.out.println(isPositiveAndEven.test(8));   // true  (>0 И чётное)
System.out.println(isPositiveAndEven.test(-4));  // false (не >0)
System.out.println(isPositiveAndEven.test(7));   // false (не чётное)

// or() — хотя бы одно условие true (логическое ИЛИ)
Predicate<Integer> isPositiveOrEven = isPositive.or(isEven);
System.out.println(isPositiveOrEven.test(7));    // true  (>0)
System.out.println(isPositiveOrEven.test(-4));   // true  (чётное)
System.out.println(isPositiveOrEven.test(-3));   // false (ни то, ни другое)

// negate() — отрицание (логическое НЕ)
Predicate<Integer> isOdd = isEven.negate();
System.out.println(isOdd.test(3)); // true
System.out.println(isOdd.test(4)); // false

// Цепочка из нескольких условий:
Predicate<Integer> complex = isPositive.and(isEven).and(isSmall);
System.out.println(complex.test(42));  // true  (>0, чётное, <100)
System.out.println(complex.test(200)); // false (<100 — нет)` },
        { type: 'heading', value: 'Predicate.isEqual() и Predicate.not()' },
        { type: 'code', language: 'java', value: `import java.util.function.Predicate;

// Predicate.isEqual(target) — создаёт предикат "равен ли объект target?"
Predicate<String> isJava = Predicate.isEqual("Java");
System.out.println(isJava.test("Java"));   // true
System.out.println(isJava.test("Python")); // false

// Predicate.isEqual работает через Objects.equals — безопасен с null
Predicate<String> isNull = Predicate.isEqual(null);
System.out.println(isNull.test(null));    // true
System.out.println(isNull.test("text"));  // false

// Predicate.not() — статический метод для отрицания (Java 11+)
Predicate<String> notEmpty = Predicate.not(String::isEmpty);
System.out.println(notEmpty.test("Hello")); // true
System.out.println(notEmpty.test(""));      // false` },
        { type: 'heading', value: 'Фильтрация коллекций с Predicate' },
        { type: 'code', language: 'java', value: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

public class PredicateFilter {

    // Универсальный метод фильтрации
    public static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
        List<T> result = new ArrayList<>();
        for (T item : list) {
            if (predicate.test(item)) {
                result.add(item);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(
            -5, -2, 0, 1, 3, 4, 7, 8, 12, 15, 20
        );

        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isEven = n -> n % 2 == 0;

        List<Integer> positives = filter(numbers, isPositive);
        System.out.println("Положительные: " + positives);
        // [1, 3, 4, 7, 8, 12, 15, 20]

        List<Integer> evens = filter(numbers, isEven);
        System.out.println("Чётные: " + evens);
        // [-2, 0, 4, 8, 12, 20]

        List<Integer> positiveEvens = filter(numbers, isPositive.and(isEven));
        System.out.println("Положительные чётные: " + positiveEvens);
        // [4, 8, 12, 20]

        List<Integer> smallOdds = filter(numbers,
            isPositive.and(isEven.negate()).and(n -> n < 10));
        System.out.println("Положительные нечётные < 10: " + smallOdds);
        // [1, 3, 7]

        // Фильтрация строк
        List<String> words = Arrays.asList(
            "Java", "JavaScript", "Python", "Jira", "Go", "Jenkins"
        );
        Predicate<String> startsWithJ = s -> s.startsWith("J");
        Predicate<String> longWord = s -> s.length() > 4;

        System.out.println("На J: " + filter(words, startsWithJ));
        // [Java, JavaScript, Jira, Jenkins]

        System.out.println("Длинные на J: " +
            filter(words, startsWithJ.and(longWord)));
        // [JavaScript, Jenkins]
    }
}` },
        { type: 'tip', value: 'Predicate — основа фильтрации. В Stream API метод filter() принимает именно Predicate<T>. Навык комбинирования предикатов через and(), or(), negate() пригодится повсюду.' }
      ]
    },
    {
      id: 6,
      title: 'Function и Consumer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Function<T, R> преобразует объект типа T в объект типа R. Consumer<T> принимает объект и не возвращает результат. Оба интерфейса поддерживают цепочки через andThen() и compose().' },
        { type: 'heading', value: 'Function<T, R> — метод apply()' },
        { type: 'code', language: 'java', value: `import java.util.function.Function;

// Function<T, R>: принимает T, возвращает R
Function<String, Integer> toLength = s -> s.length();
Function<Integer, Integer> square = n -> n * n;
Function<Integer, String> toStars = n -> "*".repeat(n);
Function<String, String> toUpper = String::toUpperCase;

System.out.println(toLength.apply("Привет"));  // 6
System.out.println(square.apply(5));            // 25
System.out.println(toStars.apply(4));           // ****
System.out.println(toUpper.apply("java"));      // JAVA` },
        { type: 'heading', value: 'Цепочки: andThen() и compose()' },
        { type: 'code', language: 'java', value: `import java.util.function.Function;

Function<String, String> trim = String::trim;
Function<String, String> toUpper = String::toUpperCase;
Function<String, String> addBang = s -> s + "!";

// andThen: сначала текущая, потом следующая
// trim -> toUpper -> addBang
Function<String, String> pipeline1 = trim.andThen(toUpper).andThen(addBang);
System.out.println(pipeline1.apply("  hello  "));
// Шаг 1: trim -> "hello"
// Шаг 2: toUpper -> "HELLO"
// Шаг 3: addBang -> "HELLO!"
// Результат: HELLO!

// compose: сначала аргумент, потом текущая (обратный порядок)
// Порядок выполнения: addBang -> toUpper -> trim
Function<String, String> pipeline2 = trim.compose(toUpper).compose(addBang);
System.out.println(pipeline2.apply("  hello  "));
// Шаг 1: addBang -> "  hello  !"
// Шаг 2: toUpper -> "  HELLO  !"
// Шаг 3: trim -> "HELLO  !"
// Результат: HELLO  !

// СОВЕТ: andThen() читается интуитивнее — используй его` },
        { type: 'heading', value: 'Function.identity()' },
        { type: 'code', language: 'java', value: `import java.util.function.Function;

// Function.identity() — возвращает тот же объект (x -> x)
Function<String, String> id = Function.identity();
System.out.println(id.apply("test")); // test

// Полезно как значение по умолчанию:
public static <T> List<T> transformAndFilter(
        List<T> list,
        Function<T, T> transform) {
    // transform по умолчанию — ничего не делать
    // ...
}

// Вызов без трансформации:
// transformAndFilter(list, Function.identity());` },
        { type: 'heading', value: 'Consumer<T> — метод accept()' },
        { type: 'code', language: 'java', value: `import java.util.function.Consumer;
import java.util.Arrays;
import java.util.List;

// Consumer<T>: принимает T, ничего не возвращает (void)
Consumer<String> print = s -> System.out.println(s);
Consumer<String> log = s -> System.out.println("[LOG] " + s);
Consumer<String> save = s -> System.out.println("[SAVE] " + s);

print.accept("Привет");  // Привет
log.accept("Событие");   // [LOG] Событие

// andThen: выполнить оба Consumer по порядку
Consumer<String> logAndSave = log.andThen(save);
logAndSave.accept("Данные пользователя");
// [LOG] Данные пользователя
// [SAVE] Данные пользователя

// Цепочка из трёх Consumer:
Consumer<String> fullPipeline = print.andThen(log).andThen(save);
fullPipeline.accept("Запись");
// Запись
// [LOG] Запись
// [SAVE] Запись` },
        { type: 'heading', value: 'Практический пример: обработка списка' },
        { type: 'code', language: 'java', value: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

public class FunctionConsumerDemo {

    // Метод трансформации списка через Function
    public static <T, R> List<R> map(List<T> list, Function<T, R> mapper) {
        List<R> result = new ArrayList<>();
        for (T item : list) {
            result.add(mapper.apply(item));
        }
        return result;
    }

    // Метод обработки каждого элемента через Consumer
    public static <T> void process(List<T> list, Consumer<T> action) {
        for (T item : list) {
            action.accept(item);
        }
    }

    public static void main(String[] args) {
        List<String> names = Arrays.asList("анна", "борис", "виктор");

        // Цепочка Function: привести к верхнему регистру, добавить приветствие
        Function<String, String> upper = String::toUpperCase;
        Function<String, String> greet = s -> "Привет, " + s + "!";
        Function<String, String> pipeline = upper.andThen(greet);

        List<String> greetings = map(names, pipeline);
        System.out.println(greetings);
        // [Привет, АННА!, Привет, БОРИС!, Привет, ВИКТОР!]

        // Преобразование типов
        List<Integer> lengths = map(names, String::length);
        System.out.println("Длины: " + lengths); // [4, 5, 6]

        // Consumer с нумерацией
        int[] counter = {1}; // массив для обхода effectively final
        Consumer<String> numberedPrint = s ->
            System.out.println(counter[0]++ + ". " + s);

        process(names, numberedPrint);
        // 1. анна
        // 2. борис
        // 3. виктор
    }
}` },
        { type: 'note', value: 'Function — для трансформации данных (есть вход и выход). Consumer — для побочных эффектов (вывод, запись в БД, отправка). Не путай: если метод что-то возвращает — это Function, если просто делает действие — Consumer.' }
      ]
    },
    {
      id: 7,
      title: 'Supplier и BiFunction',
      type: 'theory',
      content: [
        { type: 'text', value: 'Supplier<T> создаёт объекты без входных данных — идеален для фабрик и отложенной инициализации. BiFunction<T, U, R> принимает два аргумента — для операций над парами значений.' },
        { type: 'heading', value: 'Supplier<T> — метод get()' },
        { type: 'code', language: 'java', value: `import java.util.function.Supplier;
import java.util.Random;
import java.util.ArrayList;
import java.util.List;

// Supplier<T>: не принимает ничего, возвращает T
Supplier<String> greeting = () -> "Привет, мир!";
Supplier<Double> random = Math::random;
Supplier<List<String>> listFactory = ArrayList::new;
Supplier<int[]> arrayFactory = () -> new int[10];

System.out.println(greeting.get());    // Привет, мир!
System.out.println(random.get());      // 0.748... (случайное)

// Каждый вызов get() создаёт НОВЫЙ список
List<String> list1 = listFactory.get();
List<String> list2 = listFactory.get();
list1.add("А");
System.out.println(list1); // [А]
System.out.println(list2); // []  — это другой объект!` },
        { type: 'heading', value: 'Lazy Initialization (отложенная инициализация)' },
        { type: 'code', language: 'java', value: `import java.util.function.Supplier;

public class LazyDemo {

    // Тяжёлый объект — не хотим создавать заранее
    static String createExpensiveResource() {
        System.out.println(">>> Создаём тяжёлый ресурс...");
        // Имитация долгой операции
        return "Тяжёлый ресурс #" + System.currentTimeMillis();
    }

    // Метод, который использует ресурс ТОЛЬКО если нужно
    static void processOrder(String order, boolean needsResource,
                             Supplier<String> resourceSupplier) {
        System.out.println("Обработка заказа: " + order);
        if (needsResource) {
            // Ресурс создаётся ТОЛЬКО здесь!
            String resource = resourceSupplier.get();
            System.out.println("Используем: " + resource);
        }
        System.out.println("Заказ обработан.");
    }

    public static void main(String[] args) {
        Supplier<String> lazyResource = LazyDemo::createExpensiveResource;

        // Ресурс НЕ создаётся — needsResource = false
        processOrder("Заказ-1", false, lazyResource);
        // Обработка заказа: Заказ-1
        // Заказ обработан.

        System.out.println();

        // Ресурс создаётся — needsResource = true
        processOrder("Заказ-2", true, lazyResource);
        // Обработка заказа: Заказ-2
        // >>> Создаём тяжёлый ресурс...
        // Используем: Тяжёлый ресурс #1712345678
        // Заказ обработан.
    }
}` },
        { type: 'heading', value: 'Supplier как фабрика объектов' },
        { type: 'code', language: 'java', value: `import java.util.function.Supplier;
import java.util.ArrayList;
import java.util.List;

class User {
    String name;
    int age;
    User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String toString() { return name + " (" + age + ")"; }
}

public class SupplierFactory {

    // Генератор объектов с использованием Supplier
    static <T> List<T> generate(Supplier<T> supplier, int count) {
        List<T> result = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            result.add(supplier.get());
        }
        return result;
    }

    public static void main(String[] args) {
        // Генерация 3 случайных чисел
        Supplier<Integer> dice = () -> (int)(Math.random() * 6) + 1;
        List<Integer> rolls = generate(dice, 3);
        System.out.println("Броски: " + rolls); // например: [4, 1, 6]

        // Генерация пустых списков
        Supplier<List<String>> listMaker = ArrayList::new;
        List<List<String>> lists = generate(listMaker, 3);
        lists.get(0).add("A");
        System.out.println(lists); // [[A], [], []] — разные объекты!

        // Генерация пользователей с порядковым номером
        int[] counter = {0};
        Supplier<User> userFactory = () ->
            new User("User-" + (++counter[0]), 20 + counter[0]);
        List<User> users = generate(userFactory, 3);
        System.out.println(users);
        // [User-1 (21), User-2 (22), User-3 (23)]
    }
}` },
        { type: 'heading', value: 'BiFunction<T, U, R> — два аргумента' },
        { type: 'code', language: 'java', value: `import java.util.function.BiFunction;
import java.util.function.BinaryOperator;

// BiFunction<T, U, R>: принимает (T, U), возвращает R
BiFunction<String, Integer, String> repeat =
    (s, n) -> s.repeat(n);
BiFunction<String, String, String> concat =
    (a, b) -> a + " " + b;
BiFunction<Integer, Integer, Double> divide =
    (a, b) -> (double) a / b;

System.out.println(repeat.apply("Ha", 3));    // HaHaHa
System.out.println(concat.apply("Привет", "мир")); // Привет мир
System.out.println(divide.apply(7, 2));        // 3.5

// andThen: результат BiFunction передаётся в Function
BiFunction<String, String, String> greet =
    (firstName, lastName) -> firstName + " " + lastName;

// Цепочка: BiFunction -> Function
String result = greet.andThen(String::toUpperCase)
                     .apply("Иван", "Петров");
System.out.println(result); // ИВАН ПЕТРОВ

// BinaryOperator<T> — частный случай BiFunction<T, T, T>
BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;
BinaryOperator<String> longer = (a, b) ->
    a.length() >= b.length() ? a : b;

System.out.println(max.apply(10, 20));               // 20
System.out.println(longer.apply("Java", "Python"));   // Python` },
        { type: 'heading', value: 'BiConsumer и BiPredicate' },
        { type: 'code', language: 'java', value: `import java.util.function.*;
import java.util.HashMap;
import java.util.Map;

// BiConsumer<T, U>: принимает два аргумента, ничего не возвращает
BiConsumer<String, Integer> printEntry =
    (key, value) -> System.out.println(key + " = " + value);

printEntry.accept("Возраст", 25); // Возраст = 25

// BiConsumer идеально для forEach по Map
Map<String, Integer> scores = new HashMap<>();
scores.put("Анна", 95);
scores.put("Борис", 82);
scores.put("Виктор", 91);

scores.forEach((name, score) ->
    System.out.println(name + ": " + score + " баллов"));
// Анна: 95 баллов
// Борис: 82 баллов
// Виктор: 91 баллов

// BiPredicate<T, U>: два аргумента -> boolean
BiPredicate<String, Integer> nameFits =
    (name, maxLen) -> name.length() <= maxLen;

System.out.println(nameFits.test("Анна", 5));   // true
System.out.println(nameFits.test("Александр", 5)); // false` },
        { type: 'tip', value: 'Supplier — для создания и отложенной инициализации. BiFunction — когда Function не хватает (нужно два входных параметра). BinaryOperator — частный случай BiFunction, когда все типы одинаковые.' }
      ]
    },
    {
      id: 8,
      title: 'Лямбды и коллекции',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Java 8 в интерфейсы коллекций добавили default-методы, которые принимают лямбды. Это кардинально упростило работу с List, Set и Map. Рассмотрим ключевые методы.' },
        { type: 'heading', value: 'List.sort() — замена Collections.sort()' },
        { type: 'code', language: 'java', value: `import java.util.*;

public class ListSortDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(Arrays.asList(
            "Виктор", "Анна", "Дмитрий", "Борис"
        ));

        // ДО Java 8: Collections.sort + анонимный Comparator
        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.compareTo(b);
            }
        });

        // ПОСЛЕ Java 8: List.sort + лямбда
        names.sort((a, b) -> a.compareTo(b));
        System.out.println("По алфавиту: " + names);
        // [Анна, Борис, Виктор, Дмитрий]

        // Сортировка по длине строки
        names.sort((a, b) -> a.length() - b.length());
        System.out.println("По длине: " + names);
        // [Анна, Борис, Виктор, Дмитрий]

        // Comparator.comparing — ещё удобнее
        names.sort(Comparator.comparing(String::length));
        System.out.println("По длине (comparing): " + names);

        // Обратная сортировка
        names.sort(Comparator.comparing(String::length).reversed());
        System.out.println("По длине (обратно): " + names);
        // [Дмитрий, Виктор, Борис, Анна]

        // Составная сортировка: по длине, потом по алфавиту
        names.sort(Comparator.comparing(String::length)
                             .thenComparing(Comparator.naturalOrder()));
        System.out.println("По длине + алфавит: " + names);
    }
}` },
        { type: 'heading', value: 'removeIf() — удаление по условию' },
        { type: 'code', language: 'java', value: `import java.util.*;

List<Integer> numbers = new ArrayList<>(Arrays.asList(
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
));

// ДО: ручной перебор с итератором
// Iterator<Integer> it = numbers.iterator();
// while (it.hasNext()) {
//     if (it.next() % 2 == 0) it.remove();
// }

// ПОСЛЕ: removeIf с Predicate
numbers.removeIf(n -> n % 2 == 0);
System.out.println("Нечётные: " + numbers);
// [1, 3, 5, 7, 9]

// Ещё примеры:
List<String> words = new ArrayList<>(Arrays.asList(
    "Java", "", "Python", null, "Go", "", "Rust"
));

// Удалить null и пустые строки
words.removeIf(s -> s == null || s.isEmpty());
System.out.println("Очищенный: " + words);
// [Java, Python, Go, Rust]

// Удалить короткие слова
words.removeIf(s -> s.length() <= 2);
System.out.println("Длинные: " + words);
// [Java, Python, Rust]` },
        { type: 'heading', value: 'replaceAll() — замена всех элементов' },
        { type: 'code', language: 'java', value: `import java.util.*;

// replaceAll принимает UnaryOperator<T> — замена каждого элемента

List<String> names = new ArrayList<>(Arrays.asList(
    "анна", "борис", "виктор"
));

// Привести все имена к верхнему регистру
names.replaceAll(String::toUpperCase);
System.out.println(names); // [АННА, БОРИС, ВИКТОР]

// Добавить приветствие
names.replaceAll(name -> "Привет, " + name + "!");
System.out.println(names);
// [Привет, АННА!, Привет, БОРИС!, Привет, ВИКТОР!]

// С числами
List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
nums.replaceAll(n -> n * n); // возвести в квадрат
System.out.println(nums); // [1, 4, 9, 16, 25]` },
        { type: 'heading', value: 'forEach() — обход коллекции' },
        { type: 'code', language: 'java', value: `import java.util.*;

List<String> langs = Arrays.asList("Java", "Python", "Go", "Rust");

// ДО:
for (String lang : langs) {
    System.out.println(lang);
}

// ПОСЛЕ:
langs.forEach(lang -> System.out.println(lang));

// ЕЩЁ КОРОЧЕ:
langs.forEach(System.out::println);

// forEach для Map — принимает BiConsumer
Map<String, Integer> scores = new HashMap<>();
scores.put("Анна", 95);
scores.put("Борис", 82);
scores.put("Виктор", 91);

// ДО:
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// ПОСЛЕ:
scores.forEach((name, score) ->
    System.out.println(name + ": " + score));` },
        { type: 'heading', value: 'Map: merge(), compute(), getOrDefault()' },
        { type: 'code', language: 'java', value: `import java.util.*;

// merge() — объединение значений
Map<String, Integer> wordCount = new HashMap<>();
String[] words = {"java", "python", "java", "go", "java", "python"};

for (String word : words) {
    // Если ключ есть — применить BiFunction к старому и новому значению
    // Если нет — поставить новое значение
    wordCount.merge(word, 1, (oldVal, newVal) -> oldVal + newVal);
    // Короче: wordCount.merge(word, 1, Integer::sum);
}
System.out.println(wordCount); // {python=2, java=3, go=1}

// computeIfAbsent() — вычислить если ключ отсутствует
Map<String, List<String>> groups = new HashMap<>();
String[][] students = {{"A", "Анна"}, {"B", "Борис"}, {"A", "Алексей"}};

for (String[] pair : students) {
    // Если группы нет — создать ArrayList, затем добавить
    groups.computeIfAbsent(pair[0], key -> new ArrayList<>())
          .add(pair[1]);
}
System.out.println(groups); // {A=[Анна, Алексей], B=[Борис]}

// compute() — пересчитать значение
Map<String, Integer> counters = new HashMap<>();
counters.put("a", 1);
counters.put("b", 2);

counters.compute("a", (key, val) -> val + 10);
System.out.println(counters); // {a=11, b=2}

// replaceAll() для Map — заменить все значения
counters.replaceAll((key, val) -> val * 2);
System.out.println(counters); // {a=22, b=4}

// getOrDefault()
System.out.println(counters.getOrDefault("c", 0)); // 0` },
        { type: 'note', value: 'Все эти методы (sort, removeIf, replaceAll, forEach, merge, compute) — это default-методы, добавленные в Java 8. Они принимают функциональные интерфейсы и позволяют писать декларативный код вместо императивного.' }
      ]
    },
    {
      id: 9,
      title: 'Ссылки на методы (Method References)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ссылка на метод (method reference) — это ещё более компактная форма лямбды. Если лямбда просто вызывает один существующий метод, её можно заменить ссылкой через оператор ::. Существует 4 вида ссылок на методы.' },
        { type: 'heading', value: 'Вид 1: Ссылка на статический метод (ClassName::staticMethod)' },
        { type: 'code', language: 'java', value: `import java.util.function.*;
import java.util.Arrays;
import java.util.List;

public class StaticMethodRef {

    static boolean isEven(int n) { return n % 2 == 0; }
    static int doubleIt(int n) { return n * 2; }
    static void printFormatted(String s) {
        System.out.println(">>> " + s);
    }

    public static void main(String[] args) {

        // Лямбда:           n -> Math.abs(n)
        // Ссылка на метод:  Math::abs
        Function<Integer, Integer> abs1 = n -> Math.abs(n);
        Function<Integer, Integer> abs2 = Math::abs;
        System.out.println(abs2.apply(-5)); // 5

        // Лямбда:           s -> Integer.parseInt(s)
        // Ссылка на метод:  Integer::parseInt
        Function<String, Integer> parse1 = s -> Integer.parseInt(s);
        Function<String, Integer> parse2 = Integer::parseInt;
        System.out.println(parse2.apply("42")); // 42

        // Свои статические методы
        // Лямбда:           n -> isEven(n)
        // Ссылка на метод:  StaticMethodRef::isEven
        IntPredicate even = StaticMethodRef::isEven;
        System.out.println(even.test(4)); // true

        IntUnaryOperator dbl = StaticMethodRef::doubleIt;
        System.out.println(dbl.applyAsInt(5)); // 10

        Consumer<String> printer = StaticMethodRef::printFormatted;
        printer.accept("Тест"); // >>> Тест
    }
}` },
        { type: 'heading', value: 'Вид 2: Ссылка на метод экземпляра через объект (instance::method)' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

class Formatter {
    private String prefix;

    Formatter(String prefix) { this.prefix = prefix; }

    String format(String text) {
        return prefix + text;
    }

    void print(String text) {
        System.out.println(prefix + text);
    }
}

public class InstanceMethodRef {
    public static void main(String[] args) {
        Formatter logFormatter = new Formatter("[LOG] ");
        Formatter errFormatter = new Formatter("[ERROR] ");

        // Лямбда:           s -> logFormatter.format(s)
        // Ссылка на метод:  logFormatter::format
        Function<String, String> logFn = logFormatter::format;
        Function<String, String> errFn = errFormatter::format;

        System.out.println(logFn.apply("Запуск"));   // [LOG] Запуск
        System.out.println(errFn.apply("Ошибка!"));  // [ERROR] Ошибка!

        // Самый частый пример — System.out::println
        // Лямбда:           s -> System.out.println(s)
        // Ссылка на метод:  System.out::println
        Consumer<String> print1 = s -> System.out.println(s);
        Consumer<String> print2 = System.out::println;

        print2.accept("Привет!"); // Привет!

        // Consumer через экземпляр
        Consumer<String> logPrinter = logFormatter::print;
        logPrinter.accept("Готово"); // [LOG] Готово
    }
}` },
        { type: 'heading', value: 'Вид 3: Ссылка на метод произвольного экземпляра (ClassName::instanceMethod)' },
        { type: 'code', language: 'java', value: `import java.util.function.*;
import java.util.Arrays;
import java.util.List;
import java.util.Comparator;

public class ArbitraryInstanceRef {
    public static void main(String[] args) {

        // Здесь метод вызывается на ПЕРВОМ аргументе лямбды!
        // Лямбда:           (s) -> s.toUpperCase()
        // Ссылка на метод:  String::toUpperCase
        Function<String, String> upper1 = s -> s.toUpperCase();
        Function<String, String> upper2 = String::toUpperCase;
        System.out.println(upper2.apply("java")); // JAVA

        // Лямбда:           (s) -> s.length()
        // Ссылка на метод:  String::length
        Function<String, Integer> len = String::length;
        System.out.println(len.apply("Привет")); // 6

        // Лямбда:           (s) -> s.isEmpty()
        // Ссылка на метод:  String::isEmpty
        Predicate<String> empty = String::isEmpty;
        System.out.println(empty.test(""));    // true
        System.out.println(empty.test("abc")); // false

        // ДВА аргумента — метод вызывается на первом, второй передаётся
        // Лямбда:           (a, b) -> a.compareTo(b)
        // Ссылка на метод:  String::compareTo
        Comparator<String> comp1 = (a, b) -> a.compareTo(b);
        Comparator<String> comp2 = String::compareTo;

        List<String> names = Arrays.asList("Виктор", "Анна", "Борис");
        names.sort(String::compareTo);
        System.out.println(names); // [Анна, Борис, Виктор]

        // Лямбда:           (s, prefix) -> s.startsWith(prefix)
        // Ссылка на метод:  String::startsWith
        BiPredicate<String, String> starts1 = (s, p) -> s.startsWith(p);
        BiPredicate<String, String> starts2 = String::startsWith;
        System.out.println(starts2.test("Java", "Ja")); // true
    }
}` },
        { type: 'heading', value: 'Вид 4: Ссылка на конструктор (ClassName::new)' },
        { type: 'code', language: 'java', value: `import java.util.function.*;
import java.util.ArrayList;
import java.util.List;

class Product {
    String name;
    double price;

    Product() { this.name = "Без имени"; this.price = 0; }
    Product(String name) { this.name = name; this.price = 0; }
    Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String toString() { return name + " (" + price + ")"; }
}

public class ConstructorRef {
    public static void main(String[] args) {

        // Лямбда:           () -> new Product()
        // Ссылка:           Product::new (подберёт конструктор без аргументов)
        Supplier<Product> factory1 = Product::new;
        System.out.println(factory1.get()); // Без имени (0.0)

        // Лямбда:           name -> new Product(name)
        // Ссылка:           Product::new (подберёт конструктор с одним String)
        Function<String, Product> factory2 = Product::new;
        System.out.println(factory2.apply("Молоко")); // Молоко (0.0)

        // Лямбда:           (name, price) -> new Product(name, price)
        // Ссылка:           Product::new (подберёт конструктор с String, double)
        BiFunction<String, Double, Product> factory3 = Product::new;
        System.out.println(factory3.apply("Сыр", 250.0)); // Сыр (250.0)

        // Ссылка на конструктор массива
        // Лямбда:           n -> new String[n]
        // Ссылка:           String[]::new
        Function<Integer, String[]> arrayFactory = String[]::new;
        String[] arr = arrayFactory.apply(5);
        System.out.println("Длина массива: " + arr.length); // 5

        // Практика: создание списка продуктов из массива имён
        String[] names = {"Молоко", "Хлеб", "Масло"};
        List<Product> products = new ArrayList<>();
        for (String name : names) {
            products.add(factory2.apply(name));
        }
        System.out.println(products);
        // [Молоко (0.0), Хлеб (0.0), Масло (0.0)]
    }
}` },
        { type: 'heading', value: 'Когда использовать ссылки на методы' },
        { type: 'code', language: 'java', value: `// ИСПОЛЬЗУЙ ссылку на метод, если лямбда ПРОСТО вызывает метод:
list.forEach(System.out::println);       // ХОРОШО
list.forEach(s -> System.out.println(s)); // НОРМАЛЬНО, но длиннее

list.sort(String::compareTo);             // ХОРОШО
list.sort((a, b) -> a.compareTo(b));      // НОРМАЛЬНО

// ИСПОЛЬЗУЙ лямбду, если есть дополнительная логика:
list.forEach(s -> System.out.println(">>> " + s)); // тут ссылка не подойдёт
list.sort((a, b) -> b.compareTo(a));               // обратный порядок
list.removeIf(s -> s.length() > 5 && s.startsWith("A")); // сложное условие` },
        { type: 'note', value: 'Запомни 4 вида: ClassName::staticMethod, instance::method, ClassName::instanceMethod, ClassName::new. Java сама определяет, какой конструктор или перегрузку метода использовать, на основе контекста (ожидаемого функционального интерфейса).' }
      ]
    },
    {
      id: 10,
      title: 'Замыкания и effectively final',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лямбда-выражения могут захватывать (capture) переменные из окружающей области видимости. Однако Java накладывает строгое ограничение: захваченные переменные должны быть effectively final — то есть не изменяться после инициализации.' },
        { type: 'heading', value: 'Что такое замыкание (closure)' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

public class ClosureDemo {
    public static void main(String[] args) {
        String prefix = "Привет, "; // effectively final — не изменяется
        int multiplier = 3;         // effectively final

        // Лямбда "захватывает" переменные prefix и multiplier
        Function<String, String> greeter = name -> prefix + name + "!";
        Function<Integer, Integer> tripler = n -> n * multiplier;

        System.out.println(greeter.apply("Иван")); // Привет, Иван!
        System.out.println(tripler.apply(5));       // 15

        // Переменные prefix и multiplier живут в стеке метода main,
        // но лямбда копирует их значения и может использовать даже
        // после выхода из метода (если лямбда передана дальше).
    }
}` },
        { type: 'heading', value: 'Effectively final — правило' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

// Effectively final = переменная не изменяется после присвоения.
// Не обязательно иметь ключевое слово final — достаточно не менять.

public class EffectivelyFinal {
    public static void main(String[] args) {

        // ОК: переменная не изменяется (effectively final)
        String name = "Мир";
        Supplier<String> hello = () -> "Привет, " + name;
        System.out.println(hello.get()); // Привет, Мир

        // ОШИБКА КОМПИЛЯЦИИ: переменная изменяется!
        // int count = 0;
        // Runnable r = () -> System.out.println(count); // ОШИБКА!
        // count = 1; // <-- вот это ломает effectively final

        // ОШИБКА: переменная изменяется внутри лямбды!
        // int total = 0;
        // list.forEach(n -> total += n); // ОШИБКА! нельзя менять total

        // ОК с final:
        final int x = 42;
        Supplier<Integer> getX = () -> x; // ОК
    }
}` },
        { type: 'heading', value: 'Обходные пути: массив и AtomicInteger' },
        { type: 'code', language: 'java', value: `import java.util.function.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Arrays;
import java.util.List;

public class WorkaroundDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Анна", "Борис", "Виктор");

        // ПРОБЛЕМА: хотим считать в лямбде
        // int count = 0;
        // names.forEach(n -> count++); // ОШИБКА!

        // ОБХОД 1: одноэлементный массив (ссылка на массив не меняется)
        int[] counter = {0};
        names.forEach(n -> counter[0]++);
        System.out.println("Кол-во (массив): " + counter[0]); // 3

        // ОБХОД 2: AtomicInteger (потокобезопасный, ссылка не меняется)
        AtomicInteger atomicCount = new AtomicInteger(0);
        names.forEach(n -> atomicCount.incrementAndGet());
        System.out.println("Кол-во (Atomic): " + atomicCount.get()); // 3

        // ОБХОД 3: StringBuilder для накопления строк
        StringBuilder sb = new StringBuilder();
        names.forEach(n -> sb.append(n).append(", "));
        System.out.println("Имена: " + sb); // Анна, Борис, Виктор,

        // ОБХОД 4: использовать обычный цикл!
        int sum = 0;
        for (String n : names) {
            sum += n.length();
        }
        System.out.println("Сумма длин: " + sum); // 15
    }
}` },
        { type: 'heading', value: 'Захват полей объекта vs локальных переменных' },
        { type: 'code', language: 'java', value: `import java.util.function.*;

public class FieldCapture {
    // Поля объекта — можно менять свободно!
    private int instanceCounter = 0;
    private static int staticCounter = 0;

    public void demo() {
        // Лямбда может менять поля объекта — ведь она захватывает this
        Runnable r = () -> {
            instanceCounter++;       // ОК — это this.instanceCounter
            staticCounter++;         // ОК — это FieldCapture.staticCounter
        };
        r.run();
        r.run();
        System.out.println("Instance: " + instanceCounter); // 2
        System.out.println("Static: " + staticCounter);     // 2

        // А вот локальные переменные — нельзя менять!
        int local = 0;
        // Runnable bad = () -> local++; // ОШИБКА!
    }

    public static void main(String[] args) {
        new FieldCapture().demo();
    }
}` },
        { type: 'heading', value: 'Типичные ошибки' },
        { type: 'code', language: 'java', value: `import java.util.*;
import java.util.function.*;

public class CommonMistakes {
    public static void main(String[] args) {

        // ОШИБКА 1: Изменение переменной цикла
        List<Runnable> tasks = new ArrayList<>();
        // for (int i = 0; i < 5; i++) {
        //     tasks.add(() -> System.out.println(i)); // ОШИБКА! i меняется
        // }

        // ИСПРАВЛЕНИЕ:
        for (int i = 0; i < 5; i++) {
            int copy = i; // effectively final копия
            tasks.add(() -> System.out.println(copy)); // ОК!
        }
        tasks.forEach(Runnable::run); // 0 1 2 3 4

        // ОШИБКА 2: Присвоение после использования в лямбде
        // String msg = "start";
        // Runnable r = () -> System.out.println(msg); // ОШИБКА!
        // msg = "end"; // <-- это ломает effectively final

        // ИСПРАВЛЕНИЕ:
        final String msg = "start";
        Runnable r = () -> System.out.println(msg); // ОК
        r.run(); // start

        // ОШИБКА 3: Ожидание, что лямбда видит ТЕКУЩЕЕ значение
        int[] value = {10};
        Supplier<Integer> getter = () -> value[0];
        System.out.println(getter.get()); // 10
        value[0] = 20;
        System.out.println(getter.get()); // 20 — видит изменение!
        // Массив — ссылочный тип, поэтому лямбда видит изменения содержимого.
    }
}` },
        { type: 'tip', value: 'Правило effectively final существует для безопасности: лямбды могут выполняться в другом потоке, и изменение переменной из двух потоков вызвало бы гонку данных. Если нужен счётчик — используй AtomicInteger или одноэлементный массив.' }
      ]
    },
    {
      id: 11,
      title: 'Практика: Обработка списка сотрудников',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй лямбды и функциональные интерфейсы для фильтрации, сортировки и трансформации списка сотрудников.',
      requirements: [
        'Создай класс Employee с полями: name (String), department (String), salary (double)',
        'Создай список из 7 сотрудников разных отделов с разными зарплатами',
        'Используй Predicate для фильтрации: сотрудники с зарплатой > 80000',
        'Используй Predicate.and() для фильтрации: отдел "IT" И зарплата > 70000',
        'Отсортируй по зарплате (по убыванию) используя Comparator-лямбду',
        'Используй Function для получения строкового представления "Имя (Отдел)"',
        'Используй Consumer для красивого форматированного вывода',
        'Найди сотрудника с максимальной зарплатой с помощью BinaryOperator'
      ],
      expectedOutput: `Все сотрудники:
  Анна [IT] - 95000.0
  Борис [HR] - 62000.0
  Виктор [IT] - 78000.0
  Дмитрий [Sales] - 85000.0
  Елена [IT] - 110000.0
  Фёдор [HR] - 71000.0
  Галина [Sales] - 68000.0

Зарплата > 80000:
  Анна [IT] - 95000.0
  Дмитрий [Sales] - 85000.0
  Елена [IT] - 110000.0

IT с зарплатой > 70000:
  Анна [IT] - 95000.0
  Виктор [IT] - 78000.0
  Елена [IT] - 110000.0

Отсортировано по зарплате (убывание):
  Елена [IT] - 110000.0
  Анна [IT] - 95000.0
  Дмитрий [Sales] - 85000.0
  Виктор [IT] - 78000.0
  Фёдор [HR] - 71000.0
  Галина [Sales] - 68000.0
  Борис [HR] - 62000.0

Краткие имена: [Анна (IT), Борис (HR), Виктор (IT), Дмитрий (Sales), Елена (IT), Фёдор (HR), Галина (Sales)]

Самый высокооплачиваемый: Елена [IT] - 110000.0`,
      hint: 'Создай вспомогательный метод filter(list, predicate). Для BinaryOperator используй reduce-подобный цикл: сравнивай текущего сотрудника с "лучшим" на каждом шаге.',
      solution: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.*;

class Employee {
    String name;
    String department;
    double salary;

    Employee(String name, String department, double salary) {
        this.name = name;
        this.department = department;
        this.salary = salary;
    }

    public String toString() {
        return name + " [" + department + "] - " + salary;
    }
}

public class Main {

    static <T> List<T> filter(List<T> list, Predicate<T> pred) {
        List<T> result = new ArrayList<>();
        for (T item : list) {
            if (pred.test(item)) result.add(item);
        }
        return result;
    }

    static <T, R> List<R> map(List<T> list, Function<T, R> func) {
        List<R> result = new ArrayList<>();
        for (T item : list) {
            result.add(func.apply(item));
        }
        return result;
    }

    public static void main(String[] args) {
        List<Employee> employees = new ArrayList<>(Arrays.asList(
            new Employee("Анна", "IT", 95000),
            new Employee("Борис", "HR", 62000),
            new Employee("Виктор", "IT", 78000),
            new Employee("Дмитрий", "Sales", 85000),
            new Employee("Елена", "IT", 110000),
            new Employee("Фёдор", "HR", 71000),
            new Employee("Галина", "Sales", 68000)
        ));

        Consumer<Employee> printer = e -> System.out.println("  " + e);

        // Все сотрудники
        System.out.println("Все сотрудники:");
        employees.forEach(printer);

        // Фильтрация: зарплата > 80000
        Predicate<Employee> highSalary = e -> e.salary > 80000;
        System.out.println("\\nЗарплата > 80000:");
        filter(employees, highSalary).forEach(printer);

        // Комбинированный фильтр: IT и зарплата > 70000
        Predicate<Employee> isIT = e -> e.department.equals("IT");
        Predicate<Employee> itHighPaid = isIT.and(e -> e.salary > 70000);
        System.out.println("\\nIT с зарплатой > 70000:");
        filter(employees, itHighPaid).forEach(printer);

        // Сортировка по зарплате (убывание)
        List<Employee> sorted = new ArrayList<>(employees);
        sorted.sort((a, b) -> Double.compare(b.salary, a.salary));
        System.out.println("\\nОтсортировано по зарплате (убывание):");
        sorted.forEach(printer);

        // Трансформация: Function -> краткие имена
        Function<Employee, String> shortName =
            e -> e.name + " (" + e.department + ")";
        List<String> names = map(employees, shortName);
        System.out.println("\\nКраткие имена: " + names);

        // Максимальная зарплата через BinaryOperator
        BinaryOperator<Employee> maxBySalary =
            (a, b) -> a.salary >= b.salary ? a : b;
        Employee best = employees.get(0);
        for (Employee e : employees) {
            best = maxBySalary.apply(best, e);
        }
        System.out.println("\\nСамый высокооплачиваемый: " + best);
    }
}`,
      explanation: 'В этой задаче Predicate используется для фильтрации, Function — для трансформации (получение строкового представления), Consumer — для вывода, BinaryOperator — для поиска максимума. Метод filter() — универсальный благодаря обобщениям (generics): он работает с любым типом T. Комбинирование предикатов через and() позволяет строить сложные фильтры из простых.'
    },
    {
      id: 12,
      title: 'Практика: Валидатор данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай гибкую систему валидации данных, используя цепочки Predicate и BiFunction для формирования правил проверки.',
      requirements: [
        'Создай класс UserForm с полями: username, email, password, age',
        'Создай класс ValidationRule с Predicate<UserForm> и сообщением об ошибке',
        'Создай класс Validator, который хранит список ValidationRule',
        'Метод addRule(Predicate<UserForm>, String errorMessage) добавляет правило',
        'Метод validate(UserForm) возвращает List<String> со всеми ошибками',
        'Используй Predicate.and() для комбинированных правил',
        'Добавь BiFunction<String, Integer, Predicate<UserForm>> как фабрику правил длины',
        'Протестируй на 3 формах: валидная, частично невалидная, полностью невалидная'
      ],
      expectedOutput: `=== Валидация формы 1 (Иван): ===
Форма валидна!

=== Валидация формы 2 (Б): ===
Ошибки:
  - Имя пользователя должно быть от 3 до 20 символов
  - Email должен содержать @
  - Пароль должен быть не менее 8 символов
  - Пароль должен содержать цифру

=== Валидация формы 3 (): ===
Ошибки:
  - Имя пользователя не может быть пустым
  - Имя пользователя должно быть от 3 до 20 символов
  - Email не может быть пустым
  - Email должен содержать @
  - Пароль не может быть пустым
  - Пароль должен быть не менее 8 символов
  - Пароль должен содержать цифру
  - Пароль должен содержать заглавную букву
  - Возраст должен быть от 18 до 120`,
      hint: 'ValidationRule — это пара (Predicate, String). Validator.validate() проходит по всем правилам, проверяет test() и собирает ошибки. BiFunction создаёт Predicate для проверки длины конкретного поля.',
      solution: `import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Predicate;

class UserForm {
    String username;
    String email;
    String password;
    int age;

    UserForm(String username, String email, String password, int age) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
    }
}

class ValidationRule {
    Predicate<UserForm> predicate;
    String errorMessage;

    ValidationRule(Predicate<UserForm> predicate, String errorMessage) {
        this.predicate = predicate;
        this.errorMessage = errorMessage;
    }
}

class Validator {
    private List<ValidationRule> rules = new ArrayList<>();

    void addRule(Predicate<UserForm> predicate, String errorMessage) {
        rules.add(new ValidationRule(predicate, errorMessage));
    }

    List<String> validate(UserForm form) {
        List<String> errors = new ArrayList<>();
        for (ValidationRule rule : rules) {
            if (!rule.predicate.test(form)) {
                errors.add(rule.errorMessage);
            }
        }
        return errors;
    }
}

public class Main {
    public static void main(String[] args) {

        // Фабрика правил для проверки длины поля
        BiFunction<Function<UserForm, String>, Integer, Predicate<UserForm>>
            minLength = (getter, min) ->
                form -> getter.apply(form).length() >= min;

        // Проверка: строка содержит символ
        BiFunction<Function<UserForm, String>, String, Predicate<UserForm>>
            contains = (getter, substr) ->
                form -> getter.apply(form).contains(substr);

        // Геттеры для полей
        Function<UserForm, String> getUsername = f -> f.username;
        Function<UserForm, String> getEmail = f -> f.email;
        Function<UserForm, String> getPassword = f -> f.password;

        // Создаём валидатор с правилами
        Validator validator = new Validator();

        // Правила для username
        Predicate<UserForm> usernameNotEmpty =
            f -> f.username != null && !f.username.isEmpty();
        Predicate<UserForm> usernameLength =
            f -> f.username.length() >= 3 && f.username.length() <= 20;

        validator.addRule(usernameNotEmpty,
            "Имя пользователя не может быть пустым");
        validator.addRule(usernameLength,
            "Имя пользователя должно быть от 3 до 20 символов");

        // Правила для email
        Predicate<UserForm> emailNotEmpty =
            f -> f.email != null && !f.email.isEmpty();
        Predicate<UserForm> emailHasAt =
            contains.apply(getEmail, "@");

        validator.addRule(emailNotEmpty,
            "Email не может быть пустым");
        validator.addRule(emailHasAt,
            "Email должен содержать @");

        // Правила для password
        Predicate<UserForm> passNotEmpty =
            f -> f.password != null && !f.password.isEmpty();
        Predicate<UserForm> passMinLength =
            minLength.apply(getPassword, 8);
        Predicate<UserForm> passHasDigit =
            f -> f.password.chars().anyMatch(Character::isDigit);
        Predicate<UserForm> passHasUpper =
            f -> f.password.chars().anyMatch(Character::isUpperCase);

        validator.addRule(passNotEmpty,
            "Пароль не может быть пустым");
        validator.addRule(passMinLength,
            "Пароль должен быть не менее 8 символов");
        validator.addRule(passHasDigit,
            "Пароль должен содержать цифру");
        validator.addRule(passHasUpper,
            "Пароль должен содержать заглавную букву");

        // Правило для age
        Predicate<UserForm> validAge =
            f -> f.age >= 18 && f.age <= 120;
        validator.addRule(validAge,
            "Возраст должен быть от 18 до 120");

        // Тестируем 3 формы
        UserForm form1 = new UserForm(
            "Иван", "ivan@mail.ru", "SecurePass1", 25);
        UserForm form2 = new UserForm(
            "Б", "badmail", "short", 30);
        UserForm form3 = new UserForm(
            "", "", "", 10);

        // Вывод результатов
        printValidation("Иван", validator.validate(form1));
        printValidation("Б", validator.validate(form2));
        printValidation("", validator.validate(form3));
    }

    static void printValidation(String name, List<String> errors) {
        System.out.println("=== Валидация формы ("
            + (name.isEmpty() ? "" : name) + "): ===");
        if (errors.isEmpty()) {
            System.out.println("Форма валидна!");
        } else {
            System.out.println("Ошибки:");
            errors.forEach(e -> System.out.println("  - " + e));
        }
        System.out.println();
    }
}`,
      explanation: 'Эта задача демонстрирует мощь функциональных интерфейсов. Predicate используется как ядро каждого правила валидации. BiFunction работает как фабрика предикатов — принимает геттер поля и параметр, возвращает готовый Predicate. Function используется для извлечения полей из формы. Такой подход позволяет: (1) легко добавлять новые правила без изменения класса Validator, (2) комбинировать правила через and()/or(), (3) переиспользовать фабрики правил для разных полей. Это основа паттерна Specification в DDD.'
    }
  ]
}
