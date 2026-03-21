export default {
  id: 7,
  title: 'Цикл for',
  description: 'Самый популярный цикл в Java: синтаксис for, вложенные циклы, break и continue, паттерны программирования',
  lessons: [
    {
      id: 1,
      title: 'Цикл for: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цикл for — самый популярный цикл в Java. Он специально создан для случаев, когда заранее известно количество повторений. Всё управление циклом собрано в одной строке.' },
        { type: 'tip', value: 'for — это как планировщик: "начни с 0, делай пока меньше 10, каждый раз увеличивай на 1". Всё в одном месте — удобно и наглядно!' },
        { type: 'heading', value: 'Синтаксис for' },
        { type: 'code', language: 'java', value: '// for (начало; условие; шаг) {\n//     тело цикла\n// }\n\nfor (int i = 0; i < 5; i++) {\n    System.out.println("Итерация: " + i);\n}\n// Вывод:\n// Итерация: 0\n// Итерация: 1\n// Итерация: 2\n// Итерация: 3\n// Итерация: 4' },
        { type: 'text', value: 'Разберём по частям: int i = 0 — начальное значение (выполняется один раз). i < 5 — условие (проверяется перед каждой итерацией). i++ — шаг (выполняется после каждой итерации).' },
        { type: 'heading', value: 'Разные варианты for' },
        { type: 'code', language: 'java', value: '// Считаем с 1 до 10\nfor (int i = 1; i <= 10; i++) {\n    System.out.print(i + " ");\n}\nSystem.out.println();  // перевод строки\n// Вывод: 1 2 3 4 5 6 7 8 9 10\n\n// Считаем вниз (обратный отсчёт)\nfor (int i = 10; i >= 1; i--) {\n    System.out.print(i + " ");\n}\nSystem.out.println();\n// Вывод: 10 9 8 7 6 5 4 3 2 1\n\n// Шаг 2 (только чётные)\nfor (int i = 0; i <= 20; i += 2) {\n    System.out.print(i + " ");\n}\n// Вывод: 0 2 4 6 8 10 12 14 16 18 20' },
        { type: 'heading', value: 'Сумма с помощью for' },
        { type: 'code', language: 'java', value: '// Сумма квадратов от 1 до 10\nint sum = 0;\nfor (int i = 1; i <= 10; i++) {\n    sum += i * i;\n    System.out.println(i + "^2 = " + (i*i) + ", сумма = " + sum);\n}\nSystem.out.println("Итого: " + sum);  // 385' },
        { type: 'note', value: 'for и while взаимозаменяемы — всё что можно написать на for, можно написать на while и наоборот. Используй for когда знаешь количество итераций, while — когда не знаешь.' }
      ]
    },
    {
      id: 2,
      title: 'Вложенные циклы for',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вложенные циклы — это цикл внутри цикла. Внешний цикл делает шаг — внутренний прокручивается полностью. Как часы: минутная стрелка (внутренний) делает 60 оборотов пока часовая (внешний) делает 1.' },
        { type: 'heading', value: 'Таблица умножения' },
        { type: 'code', language: 'java', value: '// Таблица умножения 3x3\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.print(i + "*" + j + "=" + (i*j) + "  ");\n    }\n    System.out.println();  // новая строка после каждой строки таблицы\n}\n// Вывод:\n// 1*1=1  1*2=2  1*3=3\n// 2*1=2  2*2=4  2*3=6\n// 3*1=3  3*2=6  3*3=9' },
        { type: 'heading', value: 'Рисование фигур символами' },
        { type: 'code', language: 'java', value: '// Прямоугольник 4x6 из звёздочек\nfor (int row = 1; row <= 4; row++) {\n    for (int col = 1; col <= 6; col++) {\n        System.out.print("*");\n    }\n    System.out.println();\n}\n// ******\n// ******\n// ******\n// ******\n\n// Треугольник (растущий)\nfor (int row = 1; row <= 5; row++) {\n    for (int col = 1; col <= row; col++) {\n        System.out.print("*");\n    }\n    System.out.println();\n}\n// *\n// **\n// ***\n// ****\n// *****' },
        { type: 'heading', value: 'Считаем пары' },
        { type: 'code', language: 'java', value: '// Все пары (i, j) где i + j = 10, оба от 1 до 9\nint pairCount = 0;\nfor (int i = 1; i <= 9; i++) {\n    for (int j = 1; j <= 9; j++) {\n        if (i + j == 10) {\n            System.out.println("(" + i + ", " + j + ")");\n            pairCount++;\n        }\n    }\n}\nSystem.out.println("Всего пар: " + pairCount);' },
        { type: 'tip', value: 'В вложенных циклах используй разные имена переменных! Внешний — i или row, внутренний — j или col. Никогда не используй одно имя для обоих циклов.' }
      ]
    },
    {
      id: 3,
      title: 'break и continue в for',
      type: 'theory',
      content: [
        { type: 'text', value: 'break и continue работают в for точно так же, как в while. break прерывает весь цикл, continue пропускает текущую итерацию.' },
        { type: 'heading', value: 'break в for — выход при условии' },
        { type: 'code', language: 'java', value: '// Ищем первое число кратное 7 и больше 50\nfor (int i = 51; i <= 100; i++) {\n    if (i % 7 == 0) {\n        System.out.println("Первое кратное 7 > 50: " + i);\n        break;  // нашли — выходим\n    }\n}\n// Первое кратное 7 > 50: 56\n\n// Проверяем, простое ли число 37?\nint num = 37;\nboolean isPrime = true;\n\nfor (int i = 2; i < num; i++) {\n    if (num % i == 0) {\n        isPrime = false;\n        break;  // нашли делитель — незачем проверять дальше\n    }\n}\nSystem.out.println(num + " простое: " + isPrime);  // true' },
        { type: 'heading', value: 'continue в for — пропуск итерации' },
        { type: 'code', language: 'java', value: '// Числа от 1 до 20 — пропускаем кратные 3\nSystem.out.print("Без кратных 3: ");\nfor (int i = 1; i <= 20; i++) {\n    if (i % 3 == 0) continue;  // пропускаем\n    System.out.print(i + " ");\n}\nSystem.out.println();\n// Без кратных 3: 1 2 4 5 7 8 10 11 13 14 16 17 19 20' },
        { type: 'heading', value: 'break во вложенных циклах' },
        { type: 'code', language: 'java', value: '// break выходит только из СВОЕГО цикла!\nfor (int i = 1; i <= 3; i++) {\n    System.out.println("Внешний: " + i);\n    for (int j = 1; j <= 5; j++) {\n        if (j == 3) {\n            break;  // выходит только из внутреннего цикла\n        }\n        System.out.println("  Внутренний: " + j);\n    }\n}\n// Внешний: 1\n//   Внутренний: 1\n//   Внутренний: 2\n// Внешний: 2\n//   Внутренний: 1\n//   Внутренний: 2\n// Внешний: 3\n//   Внутренний: 1\n//   Внутренний: 2' },
        { type: 'warning', value: 'break прерывает только тот цикл, внутри которого он находится! Чтобы выйти из нескольких вложенных циклов, используют флаг (boolean found = true) или метки (label) — но это продвинутая тема.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерны с for',
      type: 'theory',
      content: [
        { type: 'text', value: 'Зная цикл for, можно решать целый класс задач. Рассмотрим несколько мощных паттернов, которые встречаются снова и снова.' },
        { type: 'heading', value: 'Паттерн: нахождение максимума и минимума' },
        { type: 'code', language: 'java', value: '// Находим максимум среди набора чисел\nint max = Integer.MIN_VALUE;  // начинаем с самого маленького\nint min = Integer.MAX_VALUE;  // начинаем с самого большого\n\nfor (int i = 1; i <= 10; i++) {\n    int num = i * i - 5 * i + 3;  // какая-то формула\n    System.out.println("f(" + i + ") = " + num);\n    if (num > max) max = num;\n    if (num < min) min = num;\n}\n\nSystem.out.println("Максимум: " + max);\nSystem.out.println("Минимум: " + min);' },
        { type: 'heading', value: 'Паттерн: числа Фибоначчи' },
        { type: 'code', language: 'java', value: '// Первые 10 чисел Фибоначчи: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34\nint a = 0, b = 1;\n\nSystem.out.print("Фибоначчи: " + a + " " + b + " ");\n\nfor (int i = 2; i < 10; i++) {\n    int next = a + b;  // следующий = сумма двух предыдущих\n    System.out.print(next + " ");\n    a = b;\n    b = next;\n}\nSystem.out.println();' },
        { type: 'heading', value: 'Паттерн: проверка всех чисел в диапазоне' },
        { type: 'code', language: 'java', value: '// Все простые числа от 2 до 30\nSystem.out.print("Простые числа: ");\n\nfor (int num = 2; num <= 30; num++) {\n    boolean isPrime = true;\n    for (int d = 2; d * d <= num; d++) {  // оптимизация: до sqrt(num)\n        if (num % d == 0) {\n            isPrime = false;\n            break;\n        }\n    }\n    if (isPrime) {\n        System.out.print(num + " ");\n    }\n}\n// Простые числа: 2 3 5 7 11 13 17 19 23 29' },
        { type: 'heading', value: 'Паттерн: накопление с условием' },
        { type: 'code', language: 'java', value: '// Сумма цифр числа\nint number = 12345;\nint sumOfDigits = 0;\n\nfor (int n = number; n > 0; n /= 10) {\n    sumOfDigits += n % 10;  // берём последнюю цифру\n}\n\nSystem.out.println("Сумма цифр " + number + " = " + sumOfDigits);  // 15' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Пирамида из звёздочек',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая рисует пирамиду из звёздочек высотой 5 строк. Первая строка — 1 звёздочка в центре, каждая следующая — на 2 больше. Перед звёздочками — пробелы для центрирования.',
      requirements: [
        'Высота пирамиды: int height = 5',
        'В строке i: (height - i) пробелов, потом (2*i - 1) звёздочек',
        'Используй вложенные циклы for',
        'Строки нумеруются с 1 до height'
      ],
      expectedOutput: '    *\n   ***\n  *****\n ******* \n*********',
      hint: 'Внешний цикл — строки (i от 1 до height). Первый внутренний — пробелы (j от 1 до height-i). Второй внутренний — звёздочки (j от 1 до 2*i-1).',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int height = 5;\n\n        for (int i = 1; i <= height; i++) {\n            // Пробелы для центрирования\n            for (int j = 1; j <= height - i; j++) {\n                System.out.print(" ");\n            }\n            // Звёздочки\n            for (int j = 1; j <= 2 * i - 1; j++) {\n                System.out.print("*");\n            }\n            System.out.println();\n        }\n    }\n}',
      explanation: 'Ключ к пирамиде — формула: в строке i нужно (height - i) пробелов и (2*i - 1) звёздочек. При i=1: 4 пробела, 1 звёздочка. При i=5: 0 пробелов, 9 звёздочек. Три вложенных цикла — для строк, для пробелов и для звёздочек.'
    },
    {
      id: 6,
      title: 'Практика: Простые числа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая находит все простые числа от 2 до N (включительно) и выводит их. Простое число — делится только на 1 и на само себя.',
      requirements: [
        'N = 50',
        'Для каждого числа от 2 до N проверяй, простое ли оно',
        'Для проверки используй внутренний цикл от 2 до sqrt числа',
        'Выводи все простые числа через пробел',
        'В конце выводи количество найденных простых чисел'
      ],
      expectedOutput: 'Простые числа до 50: 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 \nКоличество: 15',
      hint: 'Для проверки "является ли num простым" используй for (int d = 2; d * d <= num; d++). Если d * d <= num — ищем делители только до корня. Это эффективнее чем до num.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int n = 50;\n        int count = 0;\n\n        System.out.print("Простые числа до " + n + ": ");\n\n        for (int num = 2; num <= n; num++) {\n            boolean isPrime = true;\n\n            for (int d = 2; d * d <= num; d++) {\n                if (num % d == 0) {\n                    isPrime = false;\n                    break;\n                }\n            }\n\n            if (isPrime) {\n                System.out.print(num + " ");\n                count++;\n            }\n        }\n\n        System.out.println();\n        System.out.println("Количество: " + count);\n    }\n}',
      explanation: 'Алгоритм проверки простоты: для каждого числа num ищем делитель d от 2 до sqrt(num). Если нашли (num % d == 0) — число составное, ставим isPrime = false и выходим из внутреннего цикла через break. Оптимизация d * d <= num работает потому что если у числа есть делитель больше его корня — есть и меньший.'
    },
    {
      id: 7,
      title: 'Практика: Числовой прямоугольник',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши программу, которая выводит таблицу умножения (от 1 до 9) в виде красивой сетки с заголовками.',
      requirements: [
        'Выведи заголовок строки с числами 1-9 (разделённые |)',
        'Выведи разделительную линию',
        'Для каждой строки (i от 1 до 9): выводи i в начале, затем i*j для j от 1 до 9',
        'Форматируй числа так чтобы они занимали 4 символа (для выравнивания)'
      ],
      expectedOutput: '   |   1   2   3   4   5   6   7   8   9\n---+------------------------------------\n 1 |   1   2   3   4   5   6   7   8   9\n 2 |   2   4   6   8  10  12  14  16  18',
      hint: 'Используй System.out.printf("%4d", number) для форматирования числа в 4 символа. Сначала выведи заголовок отдельным циклом.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        // Заголовок\n        System.out.print("   |");\n        for (int j = 1; j <= 9; j++) {\n            System.out.printf("%4d", j);\n        }\n        System.out.println();\n\n        // Разделитель\n        System.out.println("---+------------------------------------");\n\n        // Строки таблицы\n        for (int i = 1; i <= 9; i++) {\n            System.out.printf("%2d |", i);\n            for (int j = 1; j <= 9; j++) {\n                System.out.printf("%4d", i * j);\n            }\n            System.out.println();\n        }\n    }\n}',
      explanation: 'printf — мощный инструмент форматирования. "%4d" означает: вывести целое число в поле шириной 4 символа, выровненное вправо. Это делает таблицу аккуратной. "%2d |" для номера строки оставляет 2 места под число и добавляет разделитель.'
    }
  ]
}
