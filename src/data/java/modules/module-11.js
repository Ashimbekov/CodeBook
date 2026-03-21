export default {
  id: 11,
  title: 'Методы (функции)',
  description: 'Создание собственных методов: объявление, параметры, возвращаемые значения, перегрузка, статические методы и область видимости переменных',
  lessons: [
    {
      id: 1,
      title: 'Что такое метод?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метод (функция) — это именованный блок кода, который можно вызвать по имени сколько угодно раз. Вместо того чтобы писать одинаковый код много раз, мы один раз описываем его в методе и вызываем, когда нужно.' },
        { type: 'tip', value: 'Метод — как рецепт торта. Ты один раз описываешь рецепт (пишешь метод). Когда хочешь торт — следуешь рецепту (вызываешь метод). Нужно сто тортов? Сто раз следуешь одному рецепту!' },
        { type: 'heading', value: 'Зачем нужны методы?' },
        { type: 'list', items: [
          'Избегаем повторения кода — пишем один раз, используем много раз',
          'Код становится понятнее — greetUser() говорит само за себя',
          'Легче исправлять ошибки — исправил в одном месте, всё работает',
          'Можно тестировать части программы по отдельности'
        ]},
        { type: 'heading', value: 'Первый метод' },
        { type: 'code', language: 'java', value: 'public class Main {\n    \n    // Объявление метода\n    static void sayHello() {\n        System.out.println("Привет!");\n        System.out.println("Как дела?");\n    }\n    \n    public static void main(String[] args) {\n        sayHello();  // вызываем метод\n        sayHello();  // вызываем снова\n        sayHello();  // и ещё раз!\n        \n        System.out.println("Метод вызван 3 раза!");\n    }\n}' },
        { type: 'text', value: 'Метод sayHello() объявляется один раз, но выполняет свой код каждый раз при вызове. Без методов пришлось бы писать 6 строк вместо 3 вызовов.' }
      ]
    },
    {
      id: 2,
      title: 'Параметры метода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметры позволяют передавать данные в метод. Метод может принимать одно или несколько значений и использовать их внутри. Это делает метод гибким.' },
        { type: 'tip', value: 'Параметр — как ингредиент рецепта. "Приготовь торт с N граммами сахара" — N это параметр. Вызываешь метод с 200 граммами — один результат, с 100 граммами — другой.' },
        { type: 'heading', value: 'Метод с одним параметром' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // Метод с параметром: принимает имя\n    static void greet(String name) {\n        System.out.println("Привет, " + name + "!");\n    }\n\n    public static void main(String[] args) {\n        greet("Алибек");    // Привет, Алибек!\n        greet("Нурлан");    // Привет, Нурлан!\n        greet("Дана");      // Привет, Дана!\n    }\n}' },
        { type: 'heading', value: 'Метод с несколькими параметрами' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static void printSum(int a, int b) {\n        int sum = a + b;\n        System.out.println(a + " + " + b + " = " + sum);\n    }\n\n    static void drawRectangle(int width, int height) {\n        for (int i = 0; i < height; i++) {\n            for (int j = 0; j < width; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n    }\n\n    public static void main(String[] args) {\n        printSum(3, 7);   // 3 + 7 = 10\n        printSum(15, 28); // 15 + 28 = 43\n\n        drawRectangle(5, 3);\n        // *****\n        // *****\n        // *****\n    }\n}' },
        { type: 'heading', value: 'Передача по значению' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static void doubleIt(int x) {\n        x = x * 2;  // изменяем локальную копию\n        System.out.println("Внутри метода: " + x);\n    }\n\n    public static void main(String[] args) {\n        int num = 5;\n        doubleIt(num);\n        System.out.println("После метода: " + num);  // 5 — не изменился!\n    }\n}' },
        { type: 'note', value: 'Java передаёт примитивы (int, double, boolean) по значению — внутрь метода копируется само значение. Изменения внутри метода не влияют на исходную переменную.' }
      ]
    },
    {
      id: 3,
      title: 'Возвращаемые значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метод может не только принимать данные, но и возвращать результат. Вместо void (ничего не возвращает) указываем тип возвращаемого значения и используем return.' },
        { type: 'tip', value: 'return — как посылка обратно. Отправил запрос (вызвал метод с параметрами), получил посылку с результатом (return). Как вычислять 2+2 в уме: даёшь задачу и получаешь ответ 4.' },
        { type: 'heading', value: 'Метод, возвращающий значение' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // Возвращает int — сумму двух чисел\n    static int add(int a, int b) {\n        return a + b;  // return — отправляем результат\n    }\n\n    // Возвращает double — площадь круга\n    static double circleArea(double radius) {\n        return 3.14159 * radius * radius;\n    }\n\n    // Возвращает boolean — является ли число чётным\n    static boolean isEven(int n) {\n        return n % 2 == 0;\n    }\n\n    public static void main(String[] args) {\n        int sum = add(5, 3);\n        System.out.println("Сумма: " + sum);  // 8\n\n        double area = circleArea(5.0);\n        System.out.println("Площадь: " + area);\n\n        System.out.println("10 чётное: " + isEven(10));  // true\n        System.out.println("7 чётное: " + isEven(7));    // false\n    }\n}' },
        { type: 'heading', value: 'Использование результата в выражениях' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static int max(int a, int b) {\n        return a > b ? a : b;\n    }\n\n    static int min(int a, int b) {\n        return a < b ? a : b;\n    }\n\n    public static void main(String[] args) {\n        // Результат метода используем сразу\n        System.out.println("Макс: " + max(10, 7));\n\n        // Вкладываем вызовы методов\n        int a = 5, b = 3, c = 8;\n        int maxOfThree = max(max(a, b), c);  // max из трёх чисел\n        System.out.println("Макс из трёх: " + maxOfThree);  // 8\n    }\n}' },
        { type: 'warning', value: 'После return метод заканчивается немедленно! Код после return в том же блоке никогда не выполнится. Компилятор предупредит о "недостижимом коде".' }
      ]
    },
    {
      id: 4,
      title: 'void методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'void методы ничего не возвращают — они выполняют действие и всё. Чаще всего используются для вывода, изменения состояния или выполнения побочных эффектов.' },
        { type: 'heading', value: 'Практические void методы' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // Выводит красивое приветствие\n    static void printHeader(String title) {\n        int len = title.length() + 4;\n        for (int i = 0; i < len; i++) System.out.print("=");\n        System.out.println();\n        System.out.println("| " + title + " |");\n        for (int i = 0; i < len; i++) System.out.print("=");\n        System.out.println();\n    }\n\n    // Выводит массив красиво\n    static void printArray(int[] arr) {\n        System.out.print("[");\n        for (int i = 0; i < arr.length; i++) {\n            System.out.print(arr[i]);\n            if (i < arr.length - 1) System.out.print(", ");\n        }\n        System.out.println("]");\n    }\n\n    public static void main(String[] args) {\n        printHeader("Привет, мир!");\n        // ====================\n        // | Привет, мир!     |\n        // ====================\n\n        int[] nums = {1, 2, 3, 4, 5};\n        printArray(nums);  // [1, 2, 3, 4, 5]\n    }\n}' },
        { type: 'heading', value: 'return в void методе' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // return без значения — выход из метода\n    static void printPositive(int n) {\n        if (n <= 0) {\n            System.out.println("Число должно быть положительным!");\n            return;  // выходим из метода\n        }\n        System.out.println("Положительное число: " + n);\n    }\n\n    public static void main(String[] args) {\n        printPositive(5);   // Положительное число: 5\n        printPositive(-3);  // Число должно быть положительным!\n        printPositive(10);  // Положительное число: 10\n    }\n}' },
        { type: 'tip', value: 'Используй return в void методе как "ранний выход" — когда условие не выполнено, нет смысла продолжать выполнение метода. Это называется "guard clause" и делает код чище.' }
      ]
    },
    {
      id: 5,
      title: 'Перегрузка методов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перегрузка (overloading) — возможность иметь несколько методов с одинаковым именем, но разными параметрами. Java выбирает нужный метод по типу и количеству аргументов.' },
        { type: 'tip', value: 'Как приветствие: "Привет!" — для обычного человека, "Привет, Алибек!" — для знакомого, "Добрый день, господин Алибеков!" — для официального. Одно понятие "поздороваться", но разные варианты.' },
        { type: 'heading', value: 'Перегрузка по количеству параметров' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    static int add(int a, int b, int c) {\n        return a + b + c;\n    }\n\n    static double add(double a, double b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(2, 3));           // вызовет add(int, int) = 5\n        System.out.println(add(2, 3, 4));        // вызовет add(int,int,int) = 9\n        System.out.println(add(2.5, 3.5));       // вызовет add(double,double) = 6.0\n    }\n}' },
        { type: 'heading', value: 'Реальный пример: print' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static void print(String s) {\n        System.out.println("Строка: " + s);\n    }\n\n    static void print(int n) {\n        System.out.println("Число: " + n);\n    }\n\n    static void print(boolean b) {\n        System.out.println("Булево: " + b);\n    }\n\n    static void print(String s, int times) {\n        for (int i = 0; i < times; i++) {\n            System.out.println(s);\n        }\n    }\n\n    public static void main(String[] args) {\n        print("Привет");    // Строка: Привет\n        print(42);          // Число: 42\n        print(true);        // Булево: true\n        print("Java", 3);   // Java (3 раза)\n    }\n}' },
        { type: 'note', value: 'Кстати, именно так работает System.out.println() — это перегруженный метод! Он принимает String, int, double, boolean — любой тип.' }
      ]
    },
    {
      id: 6,
      title: 'Область видимости переменных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Область видимости (scope) определяет, где в программе существует переменная. Переменная объявленная внутри метода — "умирает" когда метод заканчивается.' },
        { type: 'tip', value: 'Представь, что каждый блок {} — отдельная комната. Переменная "живёт" только в своей комнате. За стену (}) она не проходит.' },
        { type: 'heading', value: 'Локальные переменные' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static void methodA() {\n        int x = 10;  // x живёт только в methodA\n        System.out.println("В methodA: x = " + x);\n    }\n\n    static void methodB() {\n        int x = 99;  // Другой x! Тот же имя, но другая переменная\n        System.out.println("В methodB: x = " + x);\n    }\n\n    public static void main(String[] args) {\n        methodA();  // x = 10\n        methodB();  // x = 99\n        // System.out.println(x); — ОШИБКА! x не существует здесь\n    }\n}' },
        { type: 'heading', value: 'Область видимости внутри блоков' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        int outer = 1;  // видна во всём main\n\n        if (true) {\n            int inner = 2;  // видна только внутри if\n            System.out.println(outer);  // 1 — OK\n            System.out.println(inner);  // 2 — OK\n        }\n\n        System.out.println(outer);  // 1 — OK\n        // System.out.println(inner);  // ОШИБКА! inner не существует здесь\n\n        for (int i = 0; i < 3; i++) {\n            int loopVar = i * 2;  // новая переменная каждую итерацию\n            System.out.println(loopVar);\n        }\n        // System.out.println(i);       // ОШИБКА! i вне цикла\n        // System.out.println(loopVar); // ОШИБКА! loopVar вне цикла\n    }\n}' },
        { type: 'heading', value: 'Статические поля — "глобальные" переменные' },
        { type: 'code', language: 'java', value: 'public class Main {\n    \n    // static поле — доступно всем методам в классе\n    static int counter = 0;\n\n    static void increment() {\n        counter++;  // меняем общую переменную\n    }\n\n    static void printCounter() {\n        System.out.println("Счётчик: " + counter);\n    }\n\n    public static void main(String[] args) {\n        increment();\n        increment();\n        increment();\n        printCounter();  // Счётчик: 3\n    }\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Библиотека математических методов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай программу с библиотекой из 5 математических методов: нахождение максимума из трёх чисел, проверка простоты числа, степень числа, НОД двух чисел, и вывод таблицы умножения для числа.',
      requirements: [
        'Метод max3(int a, int b, int c) — возвращает максимум',
        'Метод isPrime(int n) — возвращает boolean',
        'Метод power(int base, int exp) — возвращает long',
        'Метод gcd(int a, int b) — НОД через алгоритм Евклида',
        'В main вызови все методы и выведи результаты'
      ],
      expectedOutput: 'Макс из (5, 12, 8): 12\n17 простое: true\n2 в степени 10: 1024\nНОД(48, 18): 6',
      hint: 'НОД алгоритм Евклида: пока b != 0, делаем temp = b, b = a % b, a = temp. Для степени используй цикл for с умножением.',
      solution: 'public class Main {\n\n    static int max3(int a, int b, int c) {\n        int max = a;\n        if (b > max) max = b;\n        if (c > max) max = c;\n        return max;\n    }\n\n    static boolean isPrime(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n\n    static long power(int base, int exp) {\n        long result = 1;\n        for (int i = 0; i < exp; i++) {\n            result *= base;\n        }\n        return result;\n    }\n\n    static int gcd(int a, int b) {\n        while (b != 0) {\n            int temp = b;\n            b = a % b;\n            a = temp;\n        }\n        return a;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Макс из (5, 12, 8): " + max3(5, 12, 8));\n        System.out.println("17 простое: " + isPrime(17));\n        System.out.println("2 в степени 10: " + power(2, 10));\n        System.out.println("НОД(48, 18): " + gcd(48, 18));\n    }\n}',
      explanation: 'max3 — два сравнения. isPrime — цикл до sqrt(n). power — перемножаем base exp раз. gcd (алгоритм Евклида) — один из древнейших алгоритмов: НОД(a,b) = НОД(b, a%b), пока b не ноль. Методы делают main чистым и читаемым.'
    },
    {
      id: 8,
      title: 'Практика: Конвертер температур',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полноценный конвертер температур с перегруженными методами. Конвертируй: Цельсий-Фаренгейт, Цельсий-Кельвин, Фаренгейт-Кельвин. Используй перегрузку для форматирования результата.',
      requirements: [
        'Метод celsiusToFahrenheit(double c) — формула: F = C * 9/5 + 32',
        'Метод celsiusToKelvin(double c) — формула: K = C + 273.15',
        'Метод fahrenheitToCelsius(double f) — формула: C = (F - 32) * 5/9',
        'Метод format(double value, String unit) — форматирует число с 2 знаками и единицей',
        'В main выполни несколько конвертаций и красиво выведи результаты'
      ],
      expectedOutput: '100°C = 212.00°F\n100°C = 373.15 K\n32°F = 0.00°C\n-40°C = -40.00°F (особая точка!)',
      hint: 'format() использует String.format("%.2f %s", value, unit). Методы конвертации просто применяют формулу и возвращают double.',
      solution: 'public class Main {\n\n    static double celsiusToFahrenheit(double c) {\n        return c * 9.0 / 5.0 + 32;\n    }\n\n    static double celsiusToKelvin(double c) {\n        return c + 273.15;\n    }\n\n    static double fahrenheitToCelsius(double f) {\n        return (f - 32) * 5.0 / 9.0;\n    }\n\n    static String format(double value, String unit) {\n        return String.format("%.2f%s", value, unit);\n    }\n\n    public static void main(String[] args) {\n        double c1 = 100.0;\n        System.out.println(c1 + "\\u00B0C = " + format(celsiusToFahrenheit(c1), "\\u00B0F"));\n        System.out.println(c1 + "\\u00B0C = " + format(celsiusToKelvin(c1), " K"));\n\n        double f1 = 32.0;\n        System.out.println(f1 + "\\u00B0F = " + format(fahrenheitToCelsius(f1), "\\u00B0C"));\n\n        double c2 = -40.0;\n        System.out.println(c2 + "\\u00B0C = " + format(celsiusToFahrenheit(c2), "\\u00B0F") + " (особая точка!)");\n    }\n}',
      explanation: 'Методы конвертации применяют математические формулы. Вспомогательный метод format() убирает дублирование форматирования. Вкладывание вызовов методов: format(celsiusToFahrenheit(c1), "°F") — сначала конвертируем, потом форматируем результат. Это называется функциональная композиция.'
    }
  ]
}
