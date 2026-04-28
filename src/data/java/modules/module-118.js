export default {
  id: 118,
  title: 'Практикум: Java Core — собеседование',
  description: 'Типичные задачи с собеседований на Java-разработчика: immutable классы, equals/hashCode, singleton, String Pool, autoboxing, generics, try-with-resources, clone, enum с поведением и хитрые вопросы на вывод кода.',
  lessons: [
    {
      id: 1,
      title: 'Immutable класс Person',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте неизменяемый (immutable) класс Person с полями name (String), age (int) и hobbies (List<String>). Класс должен использовать defensive copies при создании и при возврате коллекций, чтобы внешний код не мог изменить внутреннее состояние объекта. Это частый вопрос на собеседованиях — проверяет понимание защитного программирования.',
      requirements: [
        'Класс Person — final, все поля private final',
        'Конструктор принимает name, age и List<String> hobbies, делает defensive copy списка',
        'Геттер getHobbies() возвращает unmodifiable copy',
        'В main() продемонстрировать, что изменение исходного списка не влияет на Person',
        'Попытка изменить возвращённый список должна выбросить UnsupportedOperationException'
      ],
      expectedOutput: `=== Immutable Person ===
Person: Алексей, 30 лет, хобби: [Java, Шахматы, Бег]
Исходный список изменён: [Java, Шахматы, Бег, Python]
Person после изменения: Алексей, 30 лет, хобби: [Java, Шахматы, Бег]
Попытка изменить hobbies: UnsupportedOperationException
Объект действительно immutable!`,
      hint: 'В конструкторе создайте новый ArrayList<>(hobbies) для defensive copy. В геттере верните Collections.unmodifiableList(hobbies). Класс должен быть final, чтобы нельзя было наследовать и переопределить методы.',
      solution: `import java.util.*;

public class Main {
    static final class Person {
        private final String name;
        private final int age;
        private final List<String> hobbies;

        public Person(String name, int age, List<String> hobbies) {
            this.name = name;
            this.age = age;
            this.hobbies = new ArrayList<>(hobbies); // defensive copy
        }

        public String getName() { return name; }
        public int getAge() { return age; }
        public List<String> getHobbies() {
            return Collections.unmodifiableList(hobbies);
        }

        @Override
        public String toString() {
            return name + ", " + age + " лет, хобби: " + hobbies;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Immutable Person ===");

        List<String> hobbies = new ArrayList<>(Arrays.asList("Java", "Шахматы", "Бег"));
        Person person = new Person("Алексей", 30, hobbies);

        System.out.println("Person: " + person);

        hobbies.add("Python");
        System.out.println("Исходный список изменён: " + hobbies);
        System.out.println("Person после изменения: " + person);

        try {
            person.getHobbies().add("Hacking");
        } catch (UnsupportedOperationException e) {
            System.out.println("Попытка изменить hobbies: UnsupportedOperationException");
        }

        System.out.println("Объект действительно immutable!");
    }
}`,
      explanation: 'Immutable класс: 1) класс final — нельзя наследовать; 2) все поля private final; 3) defensive copy в конструкторе — new ArrayList<>(hobbies) — чтобы сохранить копию, а не ссылку; 4) геттер возвращает unmodifiable обёртку — Collections.unmodifiableList(). Это гарантирует, что после создания объект нельзя изменить ни изнутри, ни снаружи. Пример из JDK: String, Integer, LocalDate — все immutable.'
    },
    {
      id: 2,
      title: 'Equals и HashCode',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте правильные методы equals() и hashCode() для класса Employee с полями id (int), name (String), department (String). Проверьте контракт: равные объекты должны иметь одинаковый hashCode, объекты корректно работают в HashSet и HashMap.',
      requirements: [
        'Класс Employee с полями id, name, department',
        'Реализация equals(): проверка null, тип, сравнение по id и name (department не участвует)',
        'Реализация hashCode(): согласованная с equals() на основе id и name',
        'Демонстрация: два объекта с одинаковым id+name но разным department должны быть равны',
        'Проверка работы с HashSet — дубликат не добавляется',
        'Проверка рефлексивности, симметричности и транзитивности'
      ],
      expectedOutput: `=== Equals и HashCode ===
e1.equals(e2): true
e1.hashCode() == e2.hashCode(): true
e1.equals(e3): false

--- HashSet ---
Размер Set после добавления e1, e2, e3: 2
Set: [Employee{id=1, name='Иван', dept='IT'}, Employee{id=2, name='Мария', dept='HR'}]

--- Контракт ---
Рефлексивность: e1.equals(e1) = true
Симметричность: e1.equals(e2) = true, e2.equals(e1) = true
С null: e1.equals(null) = false`,
      hint: 'В equals() сначала проверьте this == obj, затем null и getClass(). Сравнивайте поля через id == other.id && Objects.equals(name, other.name). В hashCode() используйте Objects.hash(id, name). Важно: поля в hashCode() должны совпадать с полями в equals().',
      solution: `import java.util.*;

public class Main {
    static class Employee {
        int id;
        String name;
        String department;

        Employee(int id, String name, String department) {
            this.id = id;
            this.name = name;
            this.department = department;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Employee other = (Employee) obj;
            return id == other.id && Objects.equals(name, other.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id, name);
        }

        @Override
        public String toString() {
            return "Employee{id=" + id + ", name='" + name + "', dept='" + department + "'}";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Equals и HashCode ===");

        Employee e1 = new Employee(1, "Иван", "IT");
        Employee e2 = new Employee(1, "Иван", "Marketing"); // тот же id и name
        Employee e3 = new Employee(2, "Мария", "HR");

        System.out.println("e1.equals(e2): " + e1.equals(e2));
        System.out.println("e1.hashCode() == e2.hashCode(): " + (e1.hashCode() == e2.hashCode()));
        System.out.println("e1.equals(e3): " + e1.equals(e3));

        System.out.println("\\n--- HashSet ---");
        Set<Employee> set = new LinkedHashSet<>();
        set.add(e1);
        set.add(e2); // дубликат — не добавится
        set.add(e3);
        System.out.println("Размер Set после добавления e1, e2, e3: " + set.size());
        System.out.println("Set: " + set);

        System.out.println("\\n--- Контракт ---");
        System.out.println("Рефлексивность: e1.equals(e1) = " + e1.equals(e1));
        System.out.println("Симметричность: e1.equals(e2) = " + e1.equals(e2)
            + ", e2.equals(e1) = " + e2.equals(e1));
        System.out.println("С null: e1.equals(null) = " + e1.equals(null));
    }
}`,
      explanation: 'Контракт equals()/hashCode(): 1) Рефлексивность — x.equals(x) == true; 2) Симметричность — x.equals(y) == y.equals(x); 3) Транзитивность; 4) Непротиворечивость — при одних и тех же данных результат стабилен; 5) Если equals() == true, hashCode() ОБЯЗАН совпадать. Если нарушить — HashSet/HashMap сломаются. Используем Objects.hash() и Objects.equals() для null-safe сравнения.'
    },
    {
      id: 3,
      title: 'Singleton паттерн: три способа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте thread-safe Singleton тремя способами: 1) Eager initialization, 2) Double-checked locking с volatile, 3) Enum singleton. Сравните их свойства — ленивость, потокобезопасность, защиту от рефлексии.',
      requirements: [
        'EagerSingleton — static final поле, приватный конструктор',
        'LazySingleton — volatile + double-checked locking в getInstance()',
        'EnumSingleton — enum с одним элементом INSTANCE и методом',
        'Каждый singleton имеет метод doWork(), выводящий сообщение',
        'Проверка: getInstance() == getInstance() для каждого',
        'Вывод сравнения свойств каждого подхода'
      ],
      expectedOutput: `=== Singleton: 3 способа ===

--- Eager Singleton ---
[Eager] Работаю! Instance: EagerSingleton@1
Один экземпляр: true

--- Lazy Singleton (Double-Checked Locking) ---
[Lazy] Работаю! Instance: LazySingleton@2
Один экземпляр: true

--- Enum Singleton ---
[Enum] Работаю! Instance: INSTANCE
Один экземпляр: true

--- Сравнение ---
Eager: потокобезопасный=да, ленивый=нет, защита от reflection=нет
Lazy DCL: потокобезопасный=да, ленивый=да, защита от reflection=нет
Enum: потокобезопасный=да, ленивый=нет, защита от reflection=да`,
      hint: 'Для Double-checked locking: private static volatile LazySingleton instance; В getInstance() — первая проверка без synchronized, вторая внутри synchronized блока. Enum singleton самый надёжный — JVM гарантирует единственный экземпляр.',
      solution: `public class Main {
    // 1. Eager Initialization
    static class EagerSingleton {
        private static final EagerSingleton INSTANCE = new EagerSingleton();
        private EagerSingleton() {}
        public static EagerSingleton getInstance() { return INSTANCE; }
        public void doWork() {
            System.out.println("[Eager] Работаю! Instance: EagerSingleton@1");
        }
    }

    // 2. Double-Checked Locking
    static class LazySingleton {
        private static volatile LazySingleton instance;
        private LazySingleton() {}
        public static LazySingleton getInstance() {
            if (instance == null) {
                synchronized (LazySingleton.class) {
                    if (instance == null) {
                        instance = new LazySingleton();
                    }
                }
            }
            return instance;
        }
        public void doWork() {
            System.out.println("[Lazy] Работаю! Instance: LazySingleton@2");
        }
    }

    // 3. Enum Singleton
    enum EnumSingleton {
        INSTANCE;
        public void doWork() {
            System.out.println("[Enum] Работаю! Instance: INSTANCE");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Singleton: 3 способа ===");

        System.out.println("\\n--- Eager Singleton ---");
        EagerSingleton eager = EagerSingleton.getInstance();
        eager.doWork();
        System.out.println("Один экземпляр: " + (eager == EagerSingleton.getInstance()));

        System.out.println("\\n--- Lazy Singleton (Double-Checked Locking) ---");
        LazySingleton lazy = LazySingleton.getInstance();
        lazy.doWork();
        System.out.println("Один экземпляр: " + (lazy == LazySingleton.getInstance()));

        System.out.println("\\n--- Enum Singleton ---");
        EnumSingleton enumS = EnumSingleton.INSTANCE;
        enumS.doWork();
        System.out.println("Один экземпляр: " + (enumS == EnumSingleton.INSTANCE));

        System.out.println("\\n--- Сравнение ---");
        System.out.println("Eager: потокобезопасный=да, ленивый=нет, защита от reflection=нет");
        System.out.println("Lazy DCL: потокобезопасный=да, ленивый=да, защита от reflection=нет");
        System.out.println("Enum: потокобезопасный=да, ленивый=нет, защита от reflection=да");
    }
}`,
      explanation: 'Eager — самый простой, создаётся при загрузке класса, но не ленивый. Double-checked locking — ленивый, volatile обязателен (без него JMM позволяет увидеть частично инициализированный объект). Enum — рекомендация Joshua Bloch (Effective Java): JVM гарантирует один экземпляр, защита от рефлексии и сериализации бесплатно. На собеседованиях часто просят назвать все три и объяснить volatile.'
    },
    {
      id: 4,
      title: 'String Pool и intern()',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задачи на понимание String Pool в Java. Покажите разницу между == и equals() для строк, как работает intern(), и почему строковые литералы попадают в пул, а new String() — нет.',
      requirements: [
        'Сравнение двух литералов через == и equals()',
        'Сравнение литерала и new String() через == и equals()',
        'Использование intern() для помещения строки в пул',
        'Конкатенация литералов на этапе компиляции vs runtime',
        'Минимум 6 примеров с пояснениями'
      ],
      expectedOutput: `=== String Pool ===

--- Литералы ---
s1 == s2: true (оба из пула)
s1.equals(s2): true

--- new String ---
s1 == s3: false (s3 в куче)
s1.equals(s3): true

--- intern() ---
s1 == s3.intern(): true (intern вернул из пула)

--- Конкатенация ---
"Hello" == "Hel" + "lo": true (компилятор оптимизирует)
"Hello" == s + "lo": false (runtime конкатенация)

--- Пустые строки ---
"" == "": true (один объект в пуле)
new String("") == "": false`,
      hint: 'Литералы "abc" автоматически помещаются в String Pool. new String("abc") создаёт новый объект в куче. intern() возвращает ссылку из пула (или добавляет туда). Конкатенация литералов оптимизируется компилятором, но если хотя бы один операнд — переменная, создаётся новый объект.',
      solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("=== String Pool ===");

        // Литералы
        System.out.println("\\n--- Литералы ---");
        String s1 = "Hello";
        String s2 = "Hello";
        System.out.println("s1 == s2: " + (s1 == s2) + " (оба из пула)");
        System.out.println("s1.equals(s2): " + s1.equals(s2));

        // new String
        System.out.println("\\n--- new String ---");
        String s3 = new String("Hello");
        System.out.println("s1 == s3: " + (s1 == s3) + " (s3 в куче)");
        System.out.println("s1.equals(s3): " + s1.equals(s3));

        // intern()
        System.out.println("\\n--- intern() ---");
        System.out.println("s1 == s3.intern(): " + (s1 == s3.intern()) + " (intern вернул из пула)");

        // Конкатенация
        System.out.println("\\n--- Конкатенация ---");
        System.out.println("\\"Hello\\" == \\"Hel\\" + \\"lo\\": " + ("Hello" == "Hel" + "lo")
            + " (компилятор оптимизирует)");
        String s = "Hel";
        System.out.println("\\"Hello\\" == s + \\"lo\\": " + ("Hello" == s + "lo")
            + " (runtime конкатенация)");

        // Пустые строки
        System.out.println("\\n--- Пустые строки ---");
        String empty1 = "";
        String empty2 = "";
        System.out.println("\\"\\"\\" == \\"\\"\\":  " + (empty1 == empty2) + " (один объект в пуле)");
        System.out.println("new String(\\"\\") == \\"\\": " + (new String("") == "") + "");
    }
}`,
      explanation: 'String Pool — область памяти в Metaspace (с Java 7 — в куче), где хранятся уникальные строковые литералы. Когда вы пишете "Hello", JVM ищет такую строку в пуле. Если есть — возвращает ссылку, нет — создаёт. new String() всегда создаёт новый объект в куче, минуя пул. intern() явно помещает строку в пул. Это частый вопрос на собеседованиях для проверки понимания работы памяти в Java.'
    },
    {
      id: 5,
      title: 'Autoboxing ловушки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Исследуйте подводные камни autoboxing/unboxing в Java. Integer cache для значений -128..127, сравнение обёрток через ==, NullPointerException при unboxing null, и влияние на производительность.',
      requirements: [
        'Сравнение Integer через == для значений в кеше (-128..127) и вне кеша',
        'Демонстрация Integer.valueOf() vs new Integer()',
        'NullPointerException при unboxing null',
        'Сравнение производительности: int vs Integer в цикле',
        'Минимум 5 примеров с объяснениями'
      ],
      expectedOutput: `=== Autoboxing ловушки ===

--- Integer Cache (-128..127) ---
Integer a=127, b=127: a==b → true (из кеша)
Integer c=128, d=128: c==d → false (вне кеша!)
Всегда используйте .equals(): c.equals(d) → true

--- valueOf vs new ---
Integer.valueOf(127) == Integer.valueOf(127): true
new Integer(127) == new Integer(127): false

--- Unboxing null ---
Попытка unboxing null: NullPointerException!

--- Производительность ---
Сумма с int: 1784293664 за ~5 мс
Сумма с Integer: 1784293664 за ~50 мс
Integer ~10x медленнее из-за autoboxing!

--- Boolean кеш ---
Boolean.valueOf(true) == Boolean.valueOf(true): true (всегда кеш)`,
      hint: 'Integer кеширует значения от -128 до 127 (IntegerCache). При autoboxing вызывается Integer.valueOf(), который возвращает кешированный объект для малых значений. Для больших — каждый раз новый объект. Поэтому == работает для 127, но не для 128.',
      solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("=== Autoboxing ловушки ===");

        // Integer Cache
        System.out.println("\\n--- Integer Cache (-128..127) ---");
        Integer a = 127;
        Integer b = 127;
        System.out.println("Integer a=127, b=127: a==b → " + (a == b) + " (из кеша)");

        Integer c = 128;
        Integer d = 128;
        System.out.println("Integer c=128, d=128: c==d → " + (c == d) + " (вне кеша!)");
        System.out.println("Всегда используйте .equals(): c.equals(d) → " + c.equals(d));

        // valueOf vs new
        System.out.println("\\n--- valueOf vs new ---");
        System.out.println("Integer.valueOf(127) == Integer.valueOf(127): "
            + (Integer.valueOf(127) == Integer.valueOf(127)));
        System.out.println("new Integer(127) == new Integer(127): "
            + (new Integer(127) == new Integer(127)));

        // Unboxing null
        System.out.println("\\n--- Unboxing null ---");
        try {
            Integer nullInt = null;
            int value = nullInt; // unboxing → NPE
        } catch (NullPointerException e) {
            System.out.println("Попытка unboxing null: NullPointerException!");
        }

        // Производительность
        System.out.println("\\n--- Производительность ---");
        long start1 = System.nanoTime();
        long sum1 = 0;
        for (int i = 0; i < 10_000_000; i++) {
            sum1 += i;
        }
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.println("Сумма с int: " + (int) sum1 + " за ~" + time1 + " мс");

        long start2 = System.nanoTime();
        Long sum2 = 0L;
        for (int i = 0; i < 10_000_000; i++) {
            sum2 += i; // autoboxing каждую итерацию!
        }
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        System.out.println("Сумма с Integer: " + sum2.intValue() + " за ~" + time2 + " мс");
        System.out.println("Integer ~10x медленнее из-за autoboxing!");

        // Boolean кеш
        System.out.println("\\n--- Boolean кеш ---");
        System.out.println("Boolean.valueOf(true) == Boolean.valueOf(true): "
            + (Boolean.valueOf(true) == Boolean.valueOf(true)) + " (всегда кеш)");
    }
}`,
      explanation: 'Autoboxing — автоматическое преобразование примитива в обёртку (int → Integer). JVM кеширует Integer от -128 до 127 (класс IntegerCache). Для этих значений == работает, для остальных — нет, потому что создаются разные объекты. Правило: ВСЕГДА используйте .equals() для сравнения обёрток. Unboxing null вызывает NPE — частая ошибка. В циклах autoboxing создаёт миллионы лишних объектов.'
    },
    {
      id: 6,
      title: 'Generics и Type Erasure',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите generic методы и классы с bounded type parameters. Продемонстрируйте type erasure — как дженерики работают в runtime. Реализуйте generic Pair<K,V>, метод с ограничением <T extends Comparable<T>>, и покажите ограничения из-за стирания типов.',
      requirements: [
        'Generic класс Pair<K, V> с методами getFirst(), getSecond()',
        'Generic метод <T extends Comparable<T>> T findMax(List<T>) — найти максимум',
        'Generic метод <T extends Number> double sum(List<T>) — сумма чисел',
        'Демонстрация type erasure: getClass() одинаковый для разных параметров',
        'Показать ограничения: нельзя создать new T(), нельзя instanceof с generic'
      ],
      expectedOutput: `=== Generics и Type Erasure ===

--- Pair<K,V> ---
Pair<String,Integer>: (Алексей, 25)
Pair<Integer,Boolean>: (42, true)

--- Bounded Type: findMax ---
Max из [3, 7, 1, 9, 4]: 9
Max из [яблоко, банан, вишня]: вишня

--- Bounded Type: sum ---
Сумма Integer [1,2,3,4,5]: 15.0
Сумма Double [1.5, 2.5, 3.0]: 7.0

--- Type Erasure ---
List<String>.getClass(): java.util.ArrayList
List<Integer>.getClass(): java.util.ArrayList
Одинаковый класс: true (типы стёрты!)

--- Ограничения ---
Нельзя: new T() — type erasure стирает T
Нельзя: instanceof List<String> — только instanceof List
Нельзя: new T[] — массив generic типа`,
      hint: 'Bounded type: <T extends Comparable<T>> ограничивает T типами, реализующими Comparable. Type erasure означает, что в runtime все List<String> и List<Integer> становятся просто List. Используйте T extends Number и Number.doubleValue() для суммирования.',
      solution: `import java.util.*;

public class Main {
    // Generic Pair
    static class Pair<K, V> {
        private final K first;
        private final V second;

        Pair(K first, V second) {
            this.first = first;
            this.second = second;
        }

        K getFirst() { return first; }
        V getSecond() { return second; }

        @Override
        public String toString() { return "(" + first + ", " + second + ")"; }
    }

    // Bounded type — Comparable
    static <T extends Comparable<T>> T findMax(List<T> list) {
        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) max = item;
        }
        return max;
    }

    // Bounded type — Number
    static <T extends Number> double sum(List<T> list) {
        double total = 0;
        for (T item : list) {
            total += item.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println("=== Generics и Type Erasure ===");

        // Pair
        System.out.println("\\n--- Pair<K,V> ---");
        Pair<String, Integer> p1 = new Pair<>("Алексей", 25);
        Pair<Integer, Boolean> p2 = new Pair<>(42, true);
        System.out.println("Pair<String,Integer>: " + p1);
        System.out.println("Pair<Integer,Boolean>: " + p2);

        // findMax
        System.out.println("\\n--- Bounded Type: findMax ---");
        List<Integer> nums = Arrays.asList(3, 7, 1, 9, 4);
        System.out.println("Max из " + nums + ": " + findMax(nums));
        List<String> words = Arrays.asList("яблоко", "банан", "вишня");
        System.out.println("Max из " + words + ": " + findMax(words));

        // sum
        System.out.println("\\n--- Bounded Type: sum ---");
        List<Integer> ints = Arrays.asList(1, 2, 3, 4, 5);
        System.out.println("Сумма Integer " + ints + ": " + sum(ints));
        List<Double> doubles = Arrays.asList(1.5, 2.5, 3.0);
        System.out.println("Сумма Double " + doubles + ": " + sum(doubles));

        // Type Erasure
        System.out.println("\\n--- Type Erasure ---");
        List<String> strList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        System.out.println("List<String>.getClass(): " + strList.getClass().getName());
        System.out.println("List<Integer>.getClass(): " + intList.getClass().getName());
        System.out.println("Одинаковый класс: " + (strList.getClass() == intList.getClass())
            + " (типы стёрты!)");

        // Ограничения
        System.out.println("\\n--- Ограничения ---");
        System.out.println("Нельзя: new T() — type erasure стирает T");
        System.out.println("Нельзя: instanceof List<String> — только instanceof List");
        System.out.println("Нельзя: new T[] — массив generic типа");
    }
}`,
      explanation: 'Generics в Java реализованы через type erasure — информация о типовых параметрах стирается в runtime. List<String> и List<Integer> в байткоде становятся одним и тем же List. Из-за этого: нельзя создать new T(), нельзя проверить instanceof с generics, нельзя создать массив generic типа. Bounded types (<T extends X>) позволяют вызывать методы X на объекте типа T, при этом компилятор заменяет T на X в байткоде.'
    },
    {
      id: 7,
      title: 'try-with-resources и AutoCloseable',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте собственные классы, реализующие AutoCloseable, и используйте их в try-with-resources. Покажите порядок закрытия ресурсов, подавленные исключения (suppressed exceptions) и вложенные ресурсы.',
      requirements: [
        'Класс MyResource implements AutoCloseable с именем ресурса',
        'Метод doWork() выводит сообщение, close() выводит сообщение о закрытии',
        'Демонстрация порядка закрытия: обратный порядок объявления',
        'Демонстрация suppressed exceptions — когда и close(), и тело бросают исключение',
        'Вложенные try-with-resources'
      ],
      expectedOutput: `=== try-with-resources ===

--- Порядок закрытия ---
Открыт: Database
Открыт: FileWriter
Database работает...
FileWriter работает...
Закрыт: FileWriter
Закрыт: Database

--- Suppressed Exceptions ---
Открыт: BrokenResource
BrokenResource работает и падает...
Закрыт: BrokenResource (с ошибкой)
Основное исключение: Ошибка в doWork!
Suppressed: Ошибка в close!

--- Вложенные ресурсы ---
Открыт: Outer
Открыт: Inner
Inner работает...
Outer работает...
Закрыт: Inner
Закрыт: Outer`,
      hint: 'try-with-resources закрывает ресурсы в обратном порядке объявления. Если и тело, и close() бросают исключения, исключение из close() добавляется как suppressed к основному. Используйте Throwable.getSuppressed() для доступа к подавленным исключениям.',
      solution: `public class Main {
    static class MyResource implements AutoCloseable {
        String name;
        boolean failOnClose;

        MyResource(String name, boolean failOnClose) {
            this.name = name;
            this.failOnClose = failOnClose;
            System.out.println("Открыт: " + name);
        }

        void doWork() { doWork(false); }

        void doWork(boolean fail) {
            System.out.println(name + " работает" + (fail ? " и падает..." : "..."));
            if (fail) throw new RuntimeException("Ошибка в doWork!");
        }

        @Override
        public void close() {
            if (failOnClose) {
                System.out.println("Закрыт: " + name + " (с ошибкой)");
                throw new RuntimeException("Ошибка в close!");
            }
            System.out.println("Закрыт: " + name);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== try-with-resources ===");

        // Порядок закрытия
        System.out.println("\\n--- Порядок закрытия ---");
        try (MyResource db = new MyResource("Database", false);
             MyResource fw = new MyResource("FileWriter", false)) {
            db.doWork();
            fw.doWork();
        }

        // Suppressed Exceptions
        System.out.println("\\n--- Suppressed Exceptions ---");
        try (MyResource broken = new MyResource("BrokenResource", true)) {
            broken.doWork(true); // бросает исключение
        } catch (RuntimeException e) {
            System.out.println("Основное исключение: " + e.getMessage());
            for (Throwable s : e.getSuppressed()) {
                System.out.println("Suppressed: " + s.getMessage());
            }
        }

        // Вложенные
        System.out.println("\\n--- Вложенные ресурсы ---");
        try (MyResource outer = new MyResource("Outer", false)) {
            try (MyResource inner = new MyResource("Inner", false)) {
                inner.doWork();
                outer.doWork();
            }
        }
    }
}`,
      explanation: 'try-with-resources (Java 7+) автоматически закрывает ресурсы, реализующие AutoCloseable. Порядок закрытия — обратный порядку объявления (как стек). Если и тело try, и close() бросают исключения, close()-исключение становится suppressed — не теряется, а прикрепляется к основному через addSuppressed(). Это решает проблему «потерянных исключений» из finally.'
    },
    {
      id: 8,
      title: 'Clone vs Copy Constructor',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте shallow copy и deep copy двумя способами: через Cloneable/clone() и через copy constructor. Покажите разницу между shallow и deep копированием на примере объекта с вложенными коллекциями.',
      requirements: [
        'Класс Department: name, List<String> employees',
        'Shallow copy через clone() — вложенный список разделяется',
        'Deep copy через clone() — вложенный список копируется',
        'Deep copy через copy constructor',
        'Демонстрация: изменение копии не влияет на оригинал при deep copy',
        'Демонстрация: изменение копии влияет на оригинал при shallow copy'
      ],
      expectedOutput: `=== Clone vs Copy Constructor ===

--- Shallow Clone ---
Оригинал: IT [Иван, Мария]
Shallow copy: IT [Иван, Мария]
Добавляем Петра в копию...
Оригинал: IT [Иван, Мария, Пётр] ← ИЗМЕНИЛСЯ!
Shallow copy: IT [Иван, Мария, Пётр]

--- Deep Clone ---
Оригинал: HR [Анна, Борис]
Deep copy: HR [Анна, Борис]
Добавляем Ольгу в копию...
Оригинал: HR [Анна, Борис] ← НЕ изменился
Deep copy: HR [Анна, Борис, Ольга]

--- Copy Constructor ---
Оригинал: Sales [Дима, Катя]
Copy: Sales [Дима, Катя]
Добавляем Лену в копию...
Оригинал: Sales [Дима, Катя] ← НЕ изменился
Copy: Sales [Дима, Катя, Лена]`,
      hint: 'Shallow copy: super.clone() копирует ссылки. Для deep copy нужно явно скопировать каждую мутабельную коллекцию: this.employees = new ArrayList<>(original.employees). Copy constructor — предпочтительный способ в Java (Joshua Bloch, Effective Java, Item 13).',
      solution: `import java.util.*;

public class Main {
    // Shallow Cloneable
    static class ShallowDept implements Cloneable {
        String name;
        List<String> employees;

        ShallowDept(String name, List<String> employees) {
            this.name = name;
            this.employees = employees;
        }

        @Override
        public ShallowDept clone() {
            try {
                return (ShallowDept) super.clone(); // shallow!
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public String toString() { return name + " " + employees; }
    }

    // Deep Cloneable
    static class DeepDept implements Cloneable {
        String name;
        List<String> employees;

        DeepDept(String name, List<String> employees) {
            this.name = name;
            this.employees = new ArrayList<>(employees);
        }

        @Override
        public DeepDept clone() {
            try {
                DeepDept copy = (DeepDept) super.clone();
                copy.employees = new ArrayList<>(this.employees); // deep copy
                return copy;
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public String toString() { return name + " " + employees; }
    }

    // Copy Constructor
    static class CopyDept {
        String name;
        List<String> employees;

        CopyDept(String name, List<String> employees) {
            this.name = name;
            this.employees = new ArrayList<>(employees);
        }

        // Copy constructor
        CopyDept(CopyDept other) {
            this.name = other.name;
            this.employees = new ArrayList<>(other.employees); // deep copy
        }

        @Override
        public String toString() { return name + " " + employees; }
    }

    public static void main(String[] args) {
        System.out.println("=== Clone vs Copy Constructor ===");

        // Shallow Clone
        System.out.println("\\n--- Shallow Clone ---");
        ShallowDept original1 = new ShallowDept("IT", new ArrayList<>(Arrays.asList("Иван", "Мария")));
        ShallowDept shallowCopy = original1.clone();
        System.out.println("Оригинал: " + original1);
        System.out.println("Shallow copy: " + shallowCopy);
        System.out.println("Добавляем Петра в копию...");
        shallowCopy.employees.add("Пётр");
        System.out.println("Оригинал: " + original1 + " ← ИЗМЕНИЛСЯ!");
        System.out.println("Shallow copy: " + shallowCopy);

        // Deep Clone
        System.out.println("\\n--- Deep Clone ---");
        DeepDept original2 = new DeepDept("HR", Arrays.asList("Анна", "Борис"));
        DeepDept deepCopy = original2.clone();
        System.out.println("Оригинал: " + original2);
        System.out.println("Deep copy: " + deepCopy);
        System.out.println("Добавляем Ольгу в копию...");
        deepCopy.employees.add("Ольга");
        System.out.println("Оригинал: " + original2 + " ← НЕ изменился");
        System.out.println("Deep copy: " + deepCopy);

        // Copy Constructor
        System.out.println("\\n--- Copy Constructor ---");
        CopyDept original3 = new CopyDept("Sales", Arrays.asList("Дима", "Катя"));
        CopyDept copyConst = new CopyDept(original3);
        System.out.println("Оригинал: " + original3);
        System.out.println("Copy: " + copyConst);
        System.out.println("Добавляем Лену в копию...");
        copyConst.employees.add("Лена");
        System.out.println("Оригинал: " + original3 + " ← НЕ изменился");
        System.out.println("Copy: " + copyConst);
    }
}`,
      explanation: 'clone() — наследство Java 1.0, проблемный API: нужен Cloneable, CloneNotSupportedException, приведение типов. Shallow clone копирует ссылки — мутабельные поля (списки, массивы) разделяются между оригиналом и копией. Deep clone вручную копирует каждое мутабельное поле. Copy constructor — чище, типобезопаснее, рекомендуется Effective Java. Для immutable полей (String, Integer) глубокое копирование не нужно.'
    },
    {
      id: 9,
      title: 'Enum с поведением: Strategy',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте enum Operation с абстрактным методом apply(double, double), где каждая константа реализует свою стратегию вычислений. Реализуйте калькулятор и паттерн Strategy через enum.',
      requirements: [
        'Enum Operation: ADD, SUBTRACT, MULTIPLY, DIVIDE с abstract метод apply()',
        'Каждая константа переопределяет apply() своей логикой',
        'Enum с полями: symbol и description',
        'toString() выводит символ операции',
        'Метод fromSymbol(String) — найти операцию по символу',
        'Демонстрация: калькулятор, обрабатывающий выражения'
      ],
      expectedOutput: `=== Enum с поведением ===

--- Все операции ---
ADD (+): Сложение
SUBTRACT (-): Вычитание
MULTIPLY (*): Умножение
DIVIDE (/): Деление

--- Калькулятор ---
10.0 + 3.0 = 13.0
10.0 - 3.0 = 7.0
10.0 * 3.0 = 30.0
10.0 / 3.0 = 3.33

--- Strategy: скидки ---
REGULAR: 1000.0 → 1000.0 (0% скидка)
SILVER: 1000.0 → 950.0 (5% скидка)
GOLD: 1000.0 → 900.0 (10% скидка)
PLATINUM: 1000.0 → 800.0 (20% скидка)`,
      hint: 'В enum можно объявить abstract метод, и каждая константа обязана его реализовать в анонимном теле {}. Для полей symbol и description — конструктор enum. Enum отлично подходит для Strategy, когда набор стратегий фиксирован.',
      solution: `import java.util.*;

public class Main {
    enum Operation {
        ADD("+", "Сложение") {
            public double apply(double a, double b) { return a + b; }
        },
        SUBTRACT("-", "Вычитание") {
            public double apply(double a, double b) { return a - b; }
        },
        MULTIPLY("*", "Умножение") {
            public double apply(double a, double b) { return a * b; }
        },
        DIVIDE("/", "Деление") {
            public double apply(double a, double b) { return a / b; }
        };

        final String symbol;
        final String description;

        Operation(String symbol, String description) {
            this.symbol = symbol;
            this.description = description;
        }

        public abstract double apply(double a, double b);

        static Operation fromSymbol(String s) {
            for (Operation op : values()) {
                if (op.symbol.equals(s)) return op;
            }
            throw new IllegalArgumentException("Unknown: " + s);
        }
    }

    enum Discount {
        REGULAR(0) {
            public double applyDiscount(double price) { return price; }
        },
        SILVER(5) {
            public double applyDiscount(double price) { return price * 0.95; }
        },
        GOLD(10) {
            public double applyDiscount(double price) { return price * 0.90; }
        },
        PLATINUM(20) {
            public double applyDiscount(double price) { return price * 0.80; }
        };

        final int percent;
        Discount(int percent) { this.percent = percent; }
        public abstract double applyDiscount(double price);
    }

    public static void main(String[] args) {
        System.out.println("=== Enum с поведением ===");

        // Все операции
        System.out.println("\\n--- Все операции ---");
        for (Operation op : Operation.values()) {
            System.out.println(op.name() + " (" + op.symbol + "): " + op.description);
        }

        // Калькулятор
        System.out.println("\\n--- Калькулятор ---");
        double a = 10, b = 3;
        for (Operation op : Operation.values()) {
            double result = op.apply(a, b);
            System.out.printf("%.1f %s %.1f = %.2f%n", a, op.symbol, b, result);
        }

        // Strategy: скидки
        System.out.println("\\n--- Strategy: скидки ---");
        double price = 1000.0;
        for (Discount d : Discount.values()) {
            System.out.printf("%s: %.1f → %.1f (%d%% скидка)%n",
                d.name(), price, d.applyDiscount(price), d.percent);
        }
    }
}`,
      explanation: 'Enum в Java — мощнее, чем просто набор констант. Каждая константа может иметь поля, конструктор и реализовывать абстрактные методы. Это естественная реализация паттерна Strategy для фиксированного набора стратегий. Преимущества: type-safe, нет switch/if-else, добавление новой стратегии требует реализацию метода (компилятор проверит). Joshua Bloch рекомендует enum Strategy как замену классическому GoF Strategy для фиксированных наборов.'
    },
    {
      id: 10,
      title: 'Финальный квиз: что выведет код?',
      type: 'practice',
      difficulty: 'hard',
      description: 'Сложный пример, объединяющий наследование, полиморфизм, статические методы, исключения и порядок инициализации. Определите вывод кода без запуска — типичное задание на Senior-собеседовании.',
      requirements: [
        'Класс Base и Child с конструкторами, static и instance блоками инициализации',
        'Переопределённый и перегруженный методы',
        'Статический метод (не полиморфный)',
        'try-catch-finally с return',
        'Минимум 5 «подводных камней» в одном примере',
        'Подробный вывод с комментариями для каждого шага'
      ],
      expectedOutput: `=== Финальный квиз: что выведет код? ===

--- Загадка 1: Порядок инициализации ---
Base: static блок
Child: static блок
Base: instance блок
Base: конструктор
Child: instance блок
Child: конструктор

--- Загадка 2: Полиморфизм ---
Base.staticMethod() → Base (статические не переопределяются!)
child.instanceMethod() → Child (полиморфизм)
base.instanceMethod() → Child (полиморфизм через ссылку Base)
((Base)child).staticMethod() → Base (метод скрыт, не переопределён)

--- Загадка 3: try-catch-finally ---
try блок
finally блок
Результат: 2 (finally перезаписал return!)

--- Загадка 4: String и == ---
s1 == s2: true
s1 == s3: false
s1 == s3.intern(): true
s1 == (s4 + s5): false
s1 == "Hello World": true

--- Загадка 5: Массив и полиморфизм ---
ArrayStoreException! Integer[] замаскирован как Number[]`,
      hint: 'Порядок инициализации: static блоки родителя → static блоки потомка → instance блоки родителя → конструктор родителя → instance блоки потомка → конструктор потомка. Статические методы связываются по типу ссылки (early binding), а не объекта. finally выполняется ВСЕГДА, даже после return.',
      solution: `public class Main {
    static class Base {
        static { System.out.println("Base: static блок"); }
        { System.out.println("Base: instance блок"); }

        Base() { System.out.println("Base: конструктор"); }

        static String staticMethod() { return "Base"; }
        String instanceMethod() { return "Base"; }
    }

    static class Child extends Base {
        static { System.out.println("Child: static блок"); }
        { System.out.println("Child: instance блок"); }

        Child() { System.out.println("Child: конструктор"); }

        static String staticMethod() { return "Child"; } // hiding, не override!
        @Override
        String instanceMethod() { return "Child"; }
    }

    static int tryCatchFinally() {
        try {
            System.out.println("try блок");
            return 1;
        } finally {
            System.out.println("finally блок");
            return 2; // перезаписывает return из try!
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Финальный квиз: что выведет код? ===");

        // Загадка 1
        System.out.println("\\n--- Загадка 1: Порядок инициализации ---");
        Child child = new Child();

        // Загадка 2
        System.out.println("\\n--- Загадка 2: Полиморфизм ---");
        Base base = child;
        System.out.println("Base.staticMethod() → " + Base.staticMethod()
            + " (статические не переопределяются!)");
        System.out.println("child.instanceMethod() → " + child.instanceMethod()
            + " (полиморфизм)");
        System.out.println("base.instanceMethod() → " + base.instanceMethod()
            + " (полиморфизм через ссылку Base)");
        System.out.println("((Base)child).staticMethod() → " + ((Base) child).staticMethod()
            + " (метод скрыт, не переопределён)");

        // Загадка 3
        System.out.println("\\n--- Загадка 3: try-catch-finally ---");
        int result = tryCatchFinally();
        System.out.println("Результат: " + result + " (finally перезаписал return!)");

        // Загадка 4
        System.out.println("\\n--- Загадка 4: String и == ---");
        String s1 = "Hello World";
        String s2 = "Hello World";
        String s3 = new String("Hello World");
        String s4 = "Hello ";
        String s5 = "World";
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1 == s3: " + (s1 == s3));
        System.out.println("s1 == s3.intern(): " + (s1 == s3.intern()));
        System.out.println("s1 == (s4 + s5): " + (s1 == (s4 + s5)));
        System.out.println("s1 == \\"Hello World\\": " + (s1 == "Hello World"));

        // Загадка 5
        System.out.println("\\n--- Загадка 5: Массив и полиморфизм ---");
        try {
            Number[] numbers = new Integer[3];
            numbers[0] = 3.14; // Double в Integer[]!
        } catch (ArrayStoreException e) {
            System.out.println("ArrayStoreException! Integer[] замаскирован как Number[]");
        }
    }
}`,
      explanation: 'Ключевые моменты: 1) Порядок инициализации: static родителя → static потомка → instance родителя → конструктор родителя → instance потомка → конструктор потомка. 2) Статические методы используют early binding (по типу ссылки), instance — late binding (полиморфизм). 3) return в finally перезаписывает return из try — это антипаттерн, но нужно знать. 4) Ковариантность массивов в Java приводит к ArrayStoreException в runtime — generics решают эту проблему на этапе компиляции.'
    }
  ]
};
