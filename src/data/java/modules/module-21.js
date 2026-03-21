export default {
  id: 21,
  title: 'Обработка исключений',
  description: 'Как правильно обрабатывать ошибки в Java с помощью try-catch-finally',
  lessons: [
    {
      id: 1,
      title: 'Что такое исключения?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Исключение (Exception) — это ошибка, которая возникает во время выполнения программы. Java использует специальный механизм обработки исключений, чтобы программа не "падала" при ошибках.' },
        { type: 'tip', value: 'Исключение — как пожарная тревога. Что-то пошло не так (пожар), срабатывает сигнализация (Exception), кто-то должен отреагировать (catch). Если никто не среагирует — здание сгорит (программа упадёт с ошибкой).' },
        { type: 'heading', value: 'Что происходит без обработки исключений' },
        { type: 'code', language: 'java', value: '// Этот код вызовет исключение\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        System.out.println(arr[5]); // ArrayIndexOutOfBoundsException!\n        // Программа здесь падает, следующая строка не выполнится\n        System.out.println("Это не выведется");\n    }\n}\n\n// Вывод в консоли:\n// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3\n//     at Main.main(Main.java:4)' },
        { type: 'heading', value: 'Стандартные исключения Java' },
        { type: 'list', items: [
          'NullPointerException — обращение к null объекту',
          'ArrayIndexOutOfBoundsException — выход за пределы массива',
          'NumberFormatException — неверный формат числа ("abc" в parseInt)',
          'ArithmeticException — математическая ошибка (деление на ноль)',
          'ClassCastException — неверное приведение типов',
          'StackOverflowError — переполнение стека (бесконечная рекурсия)',
          'OutOfMemoryError — нехватка памяти'
        ]},
        { type: 'code', language: 'java', value: '// Примеры разных исключений\nString s = null;\n// s.length(); // NullPointerException!\n\nint[] a = new int[3];\n// a[10] = 5; // ArrayIndexOutOfBoundsException!\n\n// int x = Integer.parseInt("abc"); // NumberFormatException!\n\n// int y = 10 / 0; // ArithmeticException!\n\nSystem.out.println("Все эти ошибки можно поймать через try-catch");' }
      ]
    },
    {
      id: 2,
      title: 'try-catch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конструкция try-catch позволяет "попробовать" выполнить код и "поймать" исключение, если оно возникнет. Программа не падает, а выполняет блок catch.' },
        { type: 'tip', value: 'try-catch — как шлем на голове. try — пробуем что-то рискованное (едем на велосипеде). catch — шлем защищает если упадём. Без шлема упал — черепно-мозговая травма (программа падает). С шлемом — отделался синяком (выводим сообщение об ошибке и продолжаем).' },
        { type: 'code', language: 'java', value: '// Синтаксис try-catch\ntry {\n    // Код, который может вызвать исключение\n    int result = 10 / 0; // ArithmeticException!\n    System.out.println("Результат: " + result); // Не выполнится\n} catch (ArithmeticException e) {\n    // Этот код выполнится если возникнет ArithmeticException\n    System.out.println("Ошибка математики: " + e.getMessage());\n}\nSystem.out.println("Программа продолжает работу!"); // Выполнится!' },
        { type: 'heading', value: 'Несколько примеров try-catch' },
        { type: 'code', language: 'java', value: '// Пример 1: деление на ноль\npublic static int divide(int a, int b) {\n    try {\n        return a / b;\n    } catch (ArithmeticException e) {\n        System.out.println("Нельзя делить на ноль! Возвращаем 0");\n        return 0;\n    }\n}\n\nSystem.out.println(divide(10, 2));  // 5\nSystem.out.println(divide(10, 0));  // "Нельзя делить на ноль!" затем 0\n\n// Пример 2: преобразование строки в число\npublic static int parseNumber(String s) {\n    try {\n        return Integer.parseInt(s);\n    } catch (NumberFormatException e) {\n        System.out.println("Не число: \\"" + s + "\\". Используем 0");\n        return 0;\n    }\n}\n\nSystem.out.println(parseNumber("42"));   // 42\nSystem.out.println(parseNumber("abc"));  // "Не число: abc" затем 0\nSystem.out.println(parseNumber("99"));   // 99' },
        { type: 'code', language: 'java', value: '// Информация об исключении\ntry {\n    String s = null;\n    System.out.println(s.length());\n} catch (NullPointerException e) {\n    System.out.println("Тип: " + e.getClass().getSimpleName());\n    System.out.println("Сообщение: " + e.getMessage());\n    // Полный стек вызовов (для отладки)\n    e.printStackTrace();\n}' }
      ]
    },
    {
      id: 3,
      title: 'Несколько блоков catch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Один try блок может иметь несколько catch для разных типов исключений. Java выполнит первый подходящий catch блок.' },
        { type: 'code', language: 'java', value: 'public static void processInput(String[] arr, int index) {\n    try {\n        String value = arr[index];         // Может: ArrayIndexOutOfBoundsException\n        int number = Integer.parseInt(value); // Может: NumberFormatException\n        int result = 100 / number;          // Может: ArithmeticException\n        System.out.println("Результат: " + result);\n\n    } catch (ArrayIndexOutOfBoundsException e) {\n        System.out.println("Неверный индекс: " + index);\n\n    } catch (NumberFormatException e) {\n        System.out.println("Не число: " + e.getMessage());\n\n    } catch (ArithmeticException e) {\n        System.out.println("Деление на ноль!");\n    }\n}\n\nString[] data = {"5", "0", "abc"};\nprocessInput(data, 0);  // Результат: 20\nprocessInput(data, 1);  // Деление на ноль!\nprocessInput(data, 2);  // Не число: For input string: "abc"\nprocessInput(data, 5);  // Неверный индекс: 5' },
        { type: 'heading', value: 'Multi-catch (Java 7+)' },
        { type: 'code', language: 'java', value: '// Поймать несколько типов в одном блоке\ntry {\n    // код...\n} catch (NumberFormatException | ArithmeticException e) {\n    System.out.println("Математическая ошибка: " + e.getMessage());\n} catch (NullPointerException | ArrayIndexOutOfBoundsException e) {\n    System.out.println("Ошибка доступа к данным: " + e.getMessage());\n}' },
        { type: 'heading', value: 'Перехват базового класса Exception' },
        { type: 'code', language: 'java', value: '// Exception — родитель всех checked exceptions\ntry {\n    // Рискованный код\n    String s = null;\n    s.length();\n} catch (Exception e) {\n    // Поймает ЛЮБОЕ исключение!\n    System.out.println("Ошибка: " + e.getClass().getSimpleName());\n}' },
        { type: 'warning', value: 'Не злоупотребляй catch(Exception e) или catch(Throwable e) — это "ловит всё подряд" и может скрыть серьёзные ошибки. Лучше ловить конкретные типы.' }
      ]
    },
    {
      id: 4,
      title: 'finally',
      type: 'theory',
      content: [
        { type: 'text', value: 'Блок finally выполняется ВСЕГДА — и когда исключение было, и когда не было. Он идеален для освобождения ресурсов (закрытие файлов, соединений с базой данных).' },
        { type: 'tip', value: 'finally — как уборка после вечеринки. Праздник прошёл хорошо (нет исключений) или плохо (исключение) — убирать нужно в любом случае! Открыл файл — закрой. Начал транзакцию — заверши или откати.' },
        { type: 'code', language: 'java', value: 'public static void readFile(String filename) {\n    System.out.println("Открываем файл: " + filename);\n\n    try {\n        System.out.println("Читаем данные из файла...");\n        // Симулируем ошибку\n        if (filename.equals("bad.txt")) {\n            throw new RuntimeException("Файл повреждён!");\n        }\n        System.out.println("Данные прочитаны успешно");\n\n    } catch (RuntimeException e) {\n        System.out.println("Ошибка: " + e.getMessage());\n\n    } finally {\n        // Выполняется ВСЕГДА!\n        System.out.println("Закрываем файл (finally)");\n    }\n\n    System.out.println("После блока try-catch-finally");\n}\n\nreadFile("good.txt");\n// Открываем файл: good.txt\n// Читаем данные из файла...\n// Данные прочитаны успешно\n// Закрываем файл (finally)\n// После блока try-catch-finally\n\nreadFile("bad.txt");\n// Открываем файл: bad.txt\n// Читаем данные из файла...\n// Ошибка: Файл повреждён!\n// Закрываем файл (finally)\n// После блока try-catch-finally' },
        { type: 'heading', value: 'try-with-resources (Java 7+)' },
        { type: 'code', language: 'java', value: '// Современный способ — автоматически закрывает ресурсы\nimport java.io.*;\n\ntry (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {\n    String line = reader.readLine();\n    System.out.println(line);\n    // reader.close() вызывается АВТОМАТИЧЕСКИ!\n} catch (IOException e) {\n    System.out.println("Ошибка чтения: " + e.getMessage());\n}\n// Не нужен finally для закрытия ресурса!' },
        { type: 'note', value: 'finally всегда выполняется, даже если в try стоит return! Сначала выполнится finally, потом вернётся значение.' }
      ]
    },
    {
      id: 5,
      title: 'Ключевое слово throws',
      type: 'theory',
      content: [
        { type: 'text', value: 'throws в сигнатуре метода означает: "этот метод может бросить такое исключение". Вызывающий код обязан либо обработать его, либо тоже объявить throws.' },
        { type: 'tip', value: 'throws — как предупреждение "Осторожно, горячо!" на чашке кофе. Метод говорит: "Я могу бросить исключение — ты должен быть готов!" Если не обработаешь — компилятор не даст скомпилировать.' },
        { type: 'code', language: 'java', value: 'import java.io.IOException;\n\n// Метод объявляет что может бросить IOException\npublic static String readFirstLine(String path) throws IOException {\n    // Здесь нет try-catch — исключение передаётся вверх по стеку\n    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(path));\n    String line = reader.readLine();\n    reader.close();\n    return line;\n}\n\n// Вызывающий код ОБЯЗАН обработать или тоже объявить throws\npublic static void main(String[] args) {\n    try {\n        String line = readFirstLine("data.txt"); // Может бросить IOException\n        System.out.println("Первая строка: " + line);\n    } catch (IOException e) {\n        System.out.println("Не удалось прочитать файл: " + e.getMessage());\n    }\n}' },
        { type: 'code', language: 'java', value: '// Цепочка throws\npublic class App {\n    // Нижний уровень\n    static void connectToDatabase(String url) throws Exception {\n        if (url == null) throw new Exception("URL не может быть null");\n        System.out.println("Подключаемся к " + url);\n    }\n\n    // Средний уровень — передаёт исключение дальше\n    static void loadData(String url) throws Exception {\n        connectToDatabase(url); // Передаём throws выше\n        System.out.println("Загружаем данные...");\n    }\n\n    // Верхний уровень — обрабатывает\n    public static void main(String[] args) {\n        try {\n            loadData(null);\n        } catch (Exception e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Ключевое слово throw',
      type: 'theory',
      content: [
        { type: 'text', value: 'throw (без s) используется чтобы БРОСИТЬ исключение вручную. Это полезно когда нужно сигнализировать об ошибке из своей логики.' },
        { type: 'tip', value: 'throw — как нажать кнопку "Пожарная тревога" вручную. throws (с s) — просто предупреждение на двери "Здесь может случиться пожар". throw — это действие, throws — объявление.' },
        { type: 'code', language: 'java', value: 'public class AgeValidator {\n    public static void validateAge(int age) {\n        if (age < 0) {\n            throw new IllegalArgumentException("Возраст не может быть отрицательным: " + age);\n        }\n        if (age > 150) {\n            throw new IllegalArgumentException("Нереальный возраст: " + age);\n        }\n        System.out.println("Возраст " + age + " — корректный");\n    }\n\n    public static void main(String[] args) {\n        try {\n            validateAge(25);   // Возраст 25 — корректный\n            validateAge(-5);   // Бросает исключение!\n        } catch (IllegalArgumentException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n\n        try {\n            validateAge(200);  // Бросает исключение!\n        } catch (IllegalArgumentException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}' },
        { type: 'heading', value: 'throw + rethrow' },
        { type: 'code', language: 'java', value: 'public static void processOrder(String orderId) {\n    try {\n        if (orderId == null || orderId.isEmpty()) {\n            throw new IllegalArgumentException("ID заказа не может быть пустым");\n        }\n        System.out.println("Обрабатываем заказ: " + orderId);\n        // ... обработка ...\n    } catch (IllegalArgumentException e) {\n        System.out.println("Логируем ошибку: " + e.getMessage());\n        throw e; // Перебрасываем дальше!\n    }\n}\n\ntry {\n    processOrder("");\n} catch (IllegalArgumentException e) {\n    System.out.println("В main поймали: " + e.getMessage());\n}' }
      ]
    },
    {
      id: 7,
      title: 'Проверяемые и непроверяемые исключения',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Java есть два типа исключений: checked (проверяемые) — компилятор требует их обработки, и unchecked (непроверяемые) — не требуют обязательной обработки.' },
        { type: 'heading', value: 'Иерархия исключений' },
        { type: 'code', language: 'java', value: '// Throwable\n//   Error              — серьёзные проблемы (OutOfMemoryError, StackOverflowError)\n//   Exception          — базовый класс исключений\n//     RuntimeException — UNCHECKED исключения\n//       NullPointerException\n//       ArrayIndexOutOfBoundsException\n//       NumberFormatException\n//       ArithmeticException\n//       IllegalArgumentException\n//       ClassCastException\n//     IOException      — CHECKED исключения (обязательно обрабатывать)\n//     SQLException     — CHECKED\n//     ClassNotFoundException — CHECKED' },
        { type: 'heading', value: 'Checked exceptions' },
        { type: 'code', language: 'java', value: 'import java.io.*;\n\n// IOException — checked, ОБЯЗАН обработать или объявить throws\npublic static void checkedExample() throws IOException {\n    // Если не написать throws IOException или try-catch — ОШИБКА КОМПИЛЯЦИИ!\n    FileReader fr = new FileReader("file.txt");\n    fr.close();\n}\n\n// Обработка checked exception\ntry {\n    checkedExample();\n} catch (IOException e) {\n    System.out.println("Файл не найден: " + e.getMessage());\n}' },
        { type: 'heading', value: 'Unchecked exceptions (RuntimeException)' },
        { type: 'code', language: 'java', value: '// RuntimeException — unchecked, компилятор не требует обработки\npublic static int uncheckedExample(int[] arr, int i) {\n    return arr[i]; // Может бросить ArrayIndexOutOfBoundsException\n    // Не нужно писать throws или try-catch (но можно!)\n}\n\n// Это скомпилируется без проблем\nuncheckedExample(new int[]{1,2,3}, 10); // Но упадёт в runtime!' },
        { type: 'tip', value: 'Общее правило: Checked exceptions — для ситуаций которые нормальны и предсказуемы (файл не найден, нет подключения). Unchecked — для программных ошибок (неверный аргумент, null там где не должен быть).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Калькулятор с обработкой ошибок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай надёжный калькулятор с полной обработкой исключений.',
      requirements: [
        'Метод calculate(String expression) принимает строку вида "10 + 5"',
        'Разбивает строку на части: число1, оператор, число2',
        'Поддерживает операции: +, -, *, /',
        'Обрабатывает: деление на ноль, неверный формат числа, неизвестная операция',
        'Метод main() вызывает calculate() с разными входными данными',
        'Использовать try-catch-finally'
      ],
      expectedOutput: '10.0 + 5.0 = 15.0\n20.0 - 8.0 = 12.0\n6.0 * 7.0 = 42.0\n15.0 / 3.0 = 5.0\nОшибка: Деление на ноль!\nОшибка: Не число: "abc"\nОшибка: Неизвестная операция: %',
      hint: 'Используй String.split(" ") для разбора. parseInt/parseDouble может бросить NumberFormatException. Проверяй оператор через switch.',
      solution: 'public class Calculator {\n    public static double calculate(String expression) {\n        System.out.print(expression.replace(" ", " ") + " = ");\n        try {\n            String[] parts = expression.split(" ");\n            if (parts.length != 3) throw new IllegalArgumentException("Неверный формат выражения");\n\n            double a, b;\n            try {\n                a = Double.parseDouble(parts[0]);\n                b = Double.parseDouble(parts[2]);\n            } catch (NumberFormatException e) {\n                throw new NumberFormatException("Не число: \\"" + e.getMessage().split(":")[1].trim() + "\\"");\n            }\n\n            String op = parts[1];\n            double result;\n            switch (op) {\n                case "+": result = a + b; break;\n                case "-": result = a - b; break;\n                case "*": result = a * b; break;\n                case "/":\n                    if (b == 0) throw new ArithmeticException("Деление на ноль!");\n                    result = a / b; break;\n                default: throw new IllegalArgumentException("Неизвестная операция: " + op);\n            }\n            System.out.println(result);\n            return result;\n\n        } catch (ArithmeticException | IllegalArgumentException | NumberFormatException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n            return Double.NaN;\n        } finally {\n            // finally всегда выполняется\n        }\n    }\n\n    public static void main(String[] args) {\n        calculate("10 + 5");\n        calculate("20 - 8");\n        calculate("6 * 7");\n        calculate("15 / 3");\n        calculate("10 / 0");\n        calculate("abc + 5");\n        calculate("10 % 3");\n    }\n}',
      explanation: 'Калькулятор обрабатывает три типа ошибок: деление на ноль (ArithmeticException), неверный формат числа (NumberFormatException), неизвестная операция (IllegalArgumentException). Multi-catch ловит все три в одном блоке. finally может использоваться для логирования.'
    }
  ]
}
