export default {
  id: 52,
  title: 'Практикум: Циклы и массивы',
  description: 'Практические задачи на циклы и массивы в Java: таблица умножения, FizzBuzz, работа с цифрами числа, поиск простых чисел, операции над массивами и матрицами',
  lessons: [
    {
      id: 1,
      title: 'Задача: Таблица умножения',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая выводит таблицу умножения для числа от 1 до 10 в красиво отформатированном виде.',
      requirements: [
        'Задай int n = 7',
        'Выведи таблицу умножения числа n от 1 до 10',
        'Каждая строка в формате: "7 × 1 = 7"',
        'Дополнительно: выведи полную таблицу умножения 3×3 (от 1 до 3) в виде сетки'
      ],
      expectedOutput: 'Таблица умножения числа 7:\n7 × 1 = 7\n7 × 2 = 14\n7 × 3 = 21\n7 × 4 = 28\n7 × 5 = 35\n7 × 6 = 42\n7 × 7 = 49\n7 × 8 = 56\n7 × 9 = 63\n7 × 10 = 70',
      hint: 'Используй цикл for (int i = 1; i <= 10; i++). Для форматирования строки используй String.format или конкатенацию строк.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int n = 7;\n\n        System.out.println("Таблица умножения числа " + n + ":");\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(n + " × " + i + " = " + (n * i));\n        }\n    }\n}',
      explanation: 'Задача решается одним простым циклом for. Переменная цикла i идёт от 1 до 10 включительно (условие i <= 10). На каждой итерации выводим строку с результатом n * i. Важно, что n * i нужно заключить в скобки при конкатенации строк: без скобок n + " × " + i + " = " + n * i сначала вычислит n * i (умножение имеет приоритет над +), но лучше всегда писать скобки явно для ясности кода.'
    },
    {
      id: 2,
      title: 'Задача: FizzBuzz',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классическая задача программирования: выведи числа от 1 до 30, но вместо кратных 3 выводи "Fizz", вместо кратных 5 — "Buzz", вместо кратных и 3 и 5 — "FizzBuzz".',
      requirements: [
        'Пройди по числам от 1 до 30',
        'Если число кратно и 3 и 5 — выводи "FizzBuzz"',
        'Если кратно только 3 — выводи "Fizz"',
        'Если кратно только 5 — выводи "Buzz"',
        'Иначе — выводи само число',
        'Важен порядок проверок!'
      ],
      expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz Fizz 22 23 Fizz Buzz 26 Fizz 28 29 FizzBuzz',
      hint: 'Порядок проверок критически важен: сначала проверяй делимость на 15 (или на 3 И на 5), потом на 3, потом на 5. Если проверять сначала на 3, то число 15 попадёт в первый блок и не станет FizzBuzz.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        StringBuilder result = new StringBuilder();\n\n        for (int i = 1; i <= 30; i++) {\n            if (i % 3 == 0 && i % 5 == 0) {\n                result.append("FizzBuzz");\n            } else if (i % 3 == 0) {\n                result.append("Fizz");\n            } else if (i % 5 == 0) {\n                result.append("Buzz");\n            } else {\n                result.append(i);\n            }\n\n            if (i < 30) result.append(" ");\n        }\n\n        System.out.println(result.toString());\n    }\n}',
      explanation: 'FizzBuzz — знаменитая задача для собеседований, проверяющая понимание условий и оператора %. Ключевая ошибка новичков — проверять сначала "кратно 3", а не "кратно 3 И 5": тогда число 15 выведет "Fizz" вместо "FizzBuzz". Правильный порядок: сначала проверяем самое специфичное условие (кратно обоим), потом менее специфичные. Альтернативный подход: собираем строку из "Fizz" и "Buzz" и если она пуста — пишем число. Мы используем StringBuilder для эффективной сборки результата.'
    },
    {
      id: 3,
      title: 'Задача: Переворот цифр числа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая переворачивает цифры числа без использования строк — только с помощью арифметики (операторы % и /).',
      requirements: [
        'Задай int number = 12345',
        'Используй цикл while и операции % (остаток) и / (деление) для извлечения цифр',
        'Собери перевёрнутое число',
        'Выведи исходное и перевёрнутое числа',
        'Обработай число 1000 (должно стать 1, без ведущих нулей)'
      ],
      expectedOutput: 'Исходное число: 12345\nПеревёрнутое число: 54321\n---\nИсходное число: 1000\nПеревёрнутое число: 1',
      hint: 'Алгоритм: пока number != 0, берём последнюю цифру (digit = number % 10), добавляем к перевёрнутому (reversed = reversed * 10 + digit), удаляем последнюю цифру (number /= 10). Ведущие нули исчезают автоматически благодаря целочисленной арифметике.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        reverseNumber(12345);\n        System.out.println("---");\n        reverseNumber(1000);\n    }\n\n    static void reverseNumber(int number) {\n        System.out.println("Исходное число: " + number);\n\n        int original = number;\n        int reversed = 0;\n\n        while (number != 0) {\n            int digit = number % 10;    // берём последнюю цифру\n            reversed = reversed * 10 + digit;  // добавляем к перевёрнутому\n            number /= 10;              // удаляем последнюю цифру\n        }\n\n        System.out.println("Перевёрнутое число: " + reversed);\n    }\n}',
      explanation: 'Алгоритм извлечения цифр — базовый приём работы с числами. Оператор % 10 всегда даёт последнюю цифру числа: 12345 % 10 = 5. Деление на 10 "убирает" последнюю цифру: 12345 / 10 = 1234. Для сборки перевёрнутого числа умножаем reversed на 10 (освобождаем место) и добавляем цифру: 0*10+5=5, 5*10+4=54, 54*10+3=543... Ведущие нули (1000 → 0001) автоматически исчезают: 0 добавляется в reversed, но когда число исчерпано, reversed = 1 — целое число без ведущих нулей.'
    },
    {
      id: 4,
      title: 'Задача: Проверка числа-палиндрома',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая проверяет, является ли число палиндромом (читается одинаково слева направо и справа налево). Используй только арифметику, без строк.',
      requirements: [
        'Проверь числа: 121, 1221, 12321, 123, 1000',
        'Число является палиндромом если исходное == перевёрнутому',
        'Отрицательные числа и числа, оканчивающиеся на 0 (кроме 0), не являются палиндромами',
        'Выведи каждое число и результат проверки'
      ],
      expectedOutput: '121: палиндром\n1221: палиндром\n12321: палиндром\n123: не палиндром\n1000: не палиндром',
      hint: 'Переверни число (как в предыдущей задаче) и сравни с исходным. Важно: сохрани исходное число до переворота (int original = number), так как number будет изменяться в цикле.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {121, 1221, 12321, 123, 1000};\n\n        for (int num : numbers) {\n            System.out.println(num + ": " + (isPalindrome(num) ? "палиндром" : "не палиндром"));\n        }\n    }\n\n    static boolean isPalindrome(int number) {\n        if (number < 0 || (number % 10 == 0 && number != 0)) {\n            return false;\n        }\n\n        int original = number;\n        int reversed = 0;\n\n        while (number != 0) {\n            int digit = number % 10;\n            reversed = reversed * 10 + digit;\n            number /= 10;\n        }\n\n        return original == reversed;\n    }\n}',
      explanation: 'Число-палиндром — это число, которое не меняется при переворачивании цифр. Алгоритм: переворачиваем цифры (как в предыдущей задаче) и сравниваем с оригиналом. Важные граничные случаи: отрицательные числа никогда не палиндромы (знак "-" не симметричен), числа кратные 10 (кроме 0) тоже не палиндромы (перевёрнутое число теряет ведущий ноль: 100 → 1 ≠ 100). Вынесем логику в отдельный метод isPalindrome — это хорошая практика разбиения кода.'
    },
    {
      id: 5,
      title: 'Задача: Простые числа до N',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая находит все простые числа от 2 до N. Простое число делится только на 1 и на само себя.',
      requirements: [
        'Задай int n = 50',
        'Для каждого числа от 2 до n проверь, является ли оно простым',
        'Для проверки делай цикл делителей от 2 до sqrt(число)',
        'Выведи все простые числа через пробел',
        'В конце выведи их количество'
      ],
      expectedOutput: 'Простые числа до 50:\n2 3 5 7 11 13 17 19 23 29 31 37 41 43 47\nКоличество простых чисел: 15',
      hint: 'Для проверки простоты: цикл for (int d = 2; d * d <= num; d++) — это эффективнее чем d <= num / 2. Если нашли делитель — число не простое. Используй boolean isPrime = true, меняй на false при нахождении делителя.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int n = 50;\n        StringBuilder primes = new StringBuilder();\n        int count = 0;\n\n        for (int num = 2; num <= n; num++) {\n            if (isPrime(num)) {\n                if (count > 0) primes.append(" ");\n                primes.append(num);\n                count++;\n            }\n        }\n\n        System.out.println("Простые числа до " + n + ":");\n        System.out.println(primes.toString());\n        System.out.println("Количество простых чисел: " + count);\n    }\n\n    static boolean isPrime(int num) {\n        if (num < 2) return false;\n        if (num == 2) return true;\n        if (num % 2 == 0) return false;\n\n        for (int d = 3; d * d <= num; d += 2) {\n            if (num % d == 0) return false;\n        }\n        return true;\n    }\n}',
      explanation: 'Проверка на простоту: если число имеет делитель d, то оно также имеет делитель num/d. Один из них не превышает sqrt(num). Поэтому достаточно проверять делители только до sqrt(num) — это экономит время. Оптимизация: сначала проверяем чётность (num % 2 == 0), это отсеивает половину чисел сразу, затем проверяем только нечётные делители (d += 2 вместо d++). Метод isPrime выделен отдельно — код становится чище и понятнее. Такой подход в разы быстрее наивного алгоритма для больших N.'
    },
    {
      id: 6,
      title: 'Задача: Поворот массива',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая поворачивает массив на K позиций вправо. При повороте последние элементы переходят в начало.',
      requirements: [
        'Исходный массив: int[] arr = {1, 2, 3, 4, 5, 6, 7}',
        'K = 3 (сдвиг вправо на 3 позиции)',
        'Результат: {5, 6, 7, 1, 2, 3, 4}',
        'Используй новый массив для хранения результата',
        'Обработай случай когда K > arr.length (используй K % arr.length)'
      ],
      expectedOutput: 'Исходный массив: [1, 2, 3, 4, 5, 6, 7]\nПоворот вправо на 3: [5, 6, 7, 1, 2, 3, 4]\n---\nИсходный массив: [1, 2, 3, 4, 5]\nПоворот вправо на 7: [4, 5, 1, 2, 3]',
      hint: 'При повороте вправо на k, элемент с индексом i попадает на индекс (i + k) % n в новом массиве. Или наоборот: элемент нового массива с индексом j берётся из old[(j - k + n) % n].',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr1 = {1, 2, 3, 4, 5, 6, 7};\n        rotateAndPrint(arr1, 3);\n\n        System.out.println("---");\n\n        int[] arr2 = {1, 2, 3, 4, 5};\n        rotateAndPrint(arr2, 7);\n    }\n\n    static void rotateAndPrint(int[] arr, int k) {\n        int n = arr.length;\n        k = k % n;  // нормализуем сдвиг\n\n        System.out.println("Исходный массив: " + arrayToString(arr));\n\n        int[] rotated = new int[n];\n        for (int i = 0; i < n; i++) {\n            rotated[(i + k) % n] = arr[i];\n        }\n\n        System.out.println("Поворот вправо на " + k + ": " + arrayToString(rotated));\n    }\n\n    static String arrayToString(int[] arr) {\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]);\n            if (i < arr.length - 1) sb.append(", ");\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n}',
      explanation: 'Поворот массива — классическая задача на работу с индексами. Ключевая формула: элемент с позиции i при повороте вправо на k попадает на позицию (i + k) % n. Оператор % обеспечивает "перенос" через конец массива: если i = 5, k = 3, n = 7, то (5 + 3) % 7 = 1 — элемент перемещается с позиции 5 на позицию 1. Нормализация k = k % n важна для больших значений: поворот на 7 элементов при длине 5 эквивалентен повороту на 7 % 5 = 2 элемента.'
    },
    {
      id: 7,
      title: 'Задача: Второй максимум массива',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди второй по величине элемент в массиве за один проход без сортировки.',
      requirements: [
        'Массив: int[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3}',
        'Найди наибольший и второй наибольший элементы',
        'Решение должно работать за один проход O(n)',
        'Если все элементы одинаковые — выведи сообщение об ошибке',
        'Выведи оба значения'
      ],
      expectedOutput: 'Массив: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\nМаксимум: 9\nВторой максимум: 6',
      hint: 'Храни две переменные: max и secondMax, инициализированные Integer.MIN_VALUE. Для каждого элемента: если element > max — secondMax = max, max = element. Иначе если element > secondMax && element != max — обновляй secondMax.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};\n\n        System.out.println("Массив: " + arrayToString(arr));\n\n        int max = Integer.MIN_VALUE;\n        int secondMax = Integer.MIN_VALUE;\n\n        for (int num : arr) {\n            if (num > max) {\n                secondMax = max;\n                max = num;\n            } else if (num > secondMax && num != max) {\n                secondMax = num;\n            }\n        }\n\n        if (secondMax == Integer.MIN_VALUE) {\n            System.out.println("Второй максимум не найден (все элементы одинаковые)");\n        } else {\n            System.out.println("Максимум: " + max);\n            System.out.println("Второй максимум: " + secondMax);\n        }\n    }\n\n    static String arrayToString(int[] arr) {\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]);\n            if (i < arr.length - 1) sb.append(", ");\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n}',
      explanation: 'Поиск второго максимума за один проход — элегантный алгоритм. Держим два "лидера": max и secondMax. Когда находим новый максимум, старый max становится вторым. Условие num != max важно для корректной обработки дубликатов: если в массиве {9, 9, 6} мы не проверяли бы это условие, второй 9 перезаписал бы secondMax, и мы бы получили второй максимум = 9 вместо 6. Integer.MIN_VALUE — минимально возможное int, полезно как начальное значение для поиска максимума.'
    },
    {
      id: 8,
      title: 'Задача: Слияние двух отсортированных массивов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Слей два отсортированных массива в один отсортированный массив. Классический алгоритм из сортировки слиянием.',
      requirements: [
        'Массив 1: int[] a = {1, 3, 5, 7, 9}',
        'Массив 2: int[] b = {2, 4, 6, 8, 10}',
        'Результат должен быть отсортированным: {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}',
        'Используй три указателя: i для a, j для b, k для результата',
        'Не используй сортировку — только сравнение элементов'
      ],
      expectedOutput: 'Массив 1: [1, 3, 5, 7, 9]\nМассив 2: [2, 4, 6, 8, 10]\nСлитый массив: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n---\nМассив 1: [1, 1, 3, 5]\nМассив 2: [1, 2, 4]\nСлитый массив: [1, 1, 1, 2, 3, 4, 5]',
      hint: 'Три указателя i, j, k стартуют с 0. Пока i < a.length && j < b.length: сравниваем a[i] и b[j], меньший кладём в result[k]. Когда один массив закончился — копируем остаток другого.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] a1 = {1, 3, 5, 7, 9};\n        int[] b1 = {2, 4, 6, 8, 10};\n        mergeAndPrint(a1, b1);\n\n        System.out.println("---");\n\n        int[] a2 = {1, 1, 3, 5};\n        int[] b2 = {1, 2, 4};\n        mergeAndPrint(a2, b2);\n    }\n\n    static void mergeAndPrint(int[] a, int[] b) {\n        System.out.println("Массив 1: " + arrayToString(a));\n        System.out.println("Массив 2: " + arrayToString(b));\n\n        int[] result = merge(a, b);\n        System.out.println("Слитый массив: " + arrayToString(result));\n    }\n\n    static int[] merge(int[] a, int[] b) {\n        int[] result = new int[a.length + b.length];\n        int i = 0, j = 0, k = 0;\n\n        // Сравниваем элементы пока оба массива не исчерпаны\n        while (i < a.length && j < b.length) {\n            if (a[i] <= b[j]) {\n                result[k++] = a[i++];\n            } else {\n                result[k++] = b[j++];\n            }\n        }\n\n        // Копируем оставшиеся элементы массива a\n        while (i < a.length) {\n            result[k++] = a[i++];\n        }\n\n        // Копируем оставшиеся элементы массива b\n        while (j < b.length) {\n            result[k++] = b[j++];\n        }\n\n        return result;\n    }\n\n    static String arrayToString(int[] arr) {\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]);\n            if (i < arr.length - 1) sb.append(", ");\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n}',
      explanation: 'Алгоритм слияния — сердце сортировки merge sort. Принцип: два указателя i и j идут по двум отсортированным массивам, мы выбираем меньший из двух текущих элементов и помещаем в результат. Элегантность алгоритма в том, что после главного цикла хотя бы один массив полностью обработан, нужно только скопировать оставшиеся элементы другого — они уже отсортированы и гарантированно больше всех скопированных. Сложность O(n + m), где n и m — длины массивов.'
    },
    {
      id: 9,
      title: 'Задача: Частота элементов массива',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подсчитай, сколько раз каждый элемент встречается в массиве, и выведи элемент с наибольшей частотой.',
      requirements: [
        'Массив: int[] arr = {1, 2, 3, 2, 1, 4, 2, 3, 1, 2}',
        'Элементы массива в диапазоне от 1 до 10',
        'Используй вспомогательный массив int[] frequency = new int[11] для подсчёта',
        'Выведи частоту каждого встречающегося элемента',
        'Найди и выведи наиболее часто встречающийся элемент'
      ],
      expectedOutput: 'Массив: [1, 2, 3, 2, 1, 4, 2, 3, 1, 2]\nЧастота элементов:\n1 встречается 3 раз(а)\n2 встречается 4 раз(а)\n3 встречается 2 раз(а)\n4 встречается 1 раз(а)\nНаиболее частый элемент: 2 (4 раз(а))',
      hint: 'frequency[element]++ увеличивает счётчик для элемента. Для поиска максимума перебери frequency и найди индекс с наибольшим значением. Выводи только те элементы, у которых frequency[i] > 0.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 2, 1, 4, 2, 3, 1, 2};\n\n        // Подсчёт частоты\n        int[] frequency = new int[11];  // индексы 0-10\n        for (int num : arr) {\n            frequency[num]++;\n        }\n\n        // Поиск наиболее частого элемента\n        int maxFreq = 0;\n        int mostFrequent = -1;\n        for (int i = 1; i <= 10; i++) {\n            if (frequency[i] > maxFreq) {\n                maxFreq = frequency[i];\n                mostFrequent = i;\n            }\n        }\n\n        // Вывод результатов\n        System.out.println("Массив: " + arrayToString(arr));\n        System.out.println("Частота элементов:");\n        for (int i = 1; i <= 10; i++) {\n            if (frequency[i] > 0) {\n                System.out.println(i + " встречается " + frequency[i] + " раз(а)");\n            }\n        }\n        System.out.println("Наиболее частый элемент: " + mostFrequent + " (" + maxFreq + " раз(а))");\n    }\n\n    static String arrayToString(int[] arr) {\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < arr.length; i++) {\n            sb.append(arr[i]);\n            if (i < arr.length - 1) sb.append(", ");\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n}',
      explanation: 'Подсчёт частоты через массив — классический паттерн "count array" или "frequency array". Идея: индекс массива frequency соответствует значению элемента, значение по индексу — его частота. frequency[2]++ увеличивает счётчик для числа 2. Это работает за O(n) времени и O(k) памяти, где k — диапазон значений. Альтернатива — HashMap<Integer, Integer> — более гибкое решение для произвольного диапазона значений, но для небольшого диапазона массив эффективнее.'
    },
    {
      id: 10,
      title: 'Задача: Сумма диагоналей матрицы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши программу для работы с квадратной матрицей: выведи её, найди суммы главной и побочной диагоналей, а также максимальный элемент на диагоналях.',
      requirements: [
        'Создай матрицу int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}}',
        'Выведи матрицу в виде таблицы',
        'Вычисли сумму главной диагонали (левый верхний → правый нижний): элементы matrix[i][i]',
        'Вычисли сумму побочной диагонали (правый верхний → левый нижний): элементы matrix[i][n-1-i]',
        'Выведи обе суммы и определи, какая диагональ больше'
      ],
      expectedOutput: 'Матрица:\n1 2 3\n4 5 6\n7 8 9\nСумма главной диагонали (1+5+9): 15\nСумма побочной диагонали (3+5+7): 15\nДиагонали равны',
      hint: 'Главная диагональ: индексы [0][0], [1][1], [2][2] — сумма matrix[i][i] при i от 0 до n-1. Побочная: [0][2], [1][1], [2][0] — сумма matrix[i][n-1-i]. Элемент [1][1] входит в обе диагонали.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[][] matrix = {\n            {1, 2, 3},\n            {4, 5, 6},\n            {7, 8, 9}\n        };\n\n        int n = matrix.length;\n\n        // Вывод матрицы\n        System.out.println("Матрица:");\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                System.out.print(matrix[i][j]);\n                if (j < n - 1) System.out.print(" ");\n            }\n            System.out.println();\n        }\n\n        // Вычисление диагоналей\n        int mainDiag = 0;\n        int antiDiag = 0;\n        StringBuilder mainElements = new StringBuilder();\n        StringBuilder antiElements = new StringBuilder();\n\n        for (int i = 0; i < n; i++) {\n            mainDiag += matrix[i][i];\n            antiDiag += matrix[i][n - 1 - i];\n\n            if (i > 0) { mainElements.append("+"); antiElements.append("+"); }\n            mainElements.append(matrix[i][i]);\n            antiElements.append(matrix[i][n - 1 - i]);\n        }\n\n        System.out.println("Сумма главной диагонали (" + mainElements + "): " + mainDiag);\n        System.out.println("Сумма побочной диагонали (" + antiElements + "): " + antiDiag);\n\n        if (mainDiag > antiDiag) {\n            System.out.println("Главная диагональ больше");\n        } else if (antiDiag > mainDiag) {\n            System.out.println("Побочная диагональ больше");\n        } else {\n            System.out.println("Диагонали равны");\n        }\n    }\n}',
      explanation: 'Двумерный массив (матрица) в Java — это массив массивов: int[строка][столбец]. Главная диагональ — элементы где номер строки равен номеру столбца: [0][0], [1][1], [2][2]. Побочная диагональ — элементы где столбец = n-1-строка: [0][2], [1][1], [2][0]. Один цикл for по i позволяет одновременно обработать обе диагонали. В нечётных матрицах центральный элемент входит в обе диагонали. Вывод матрицы использует вложенные циклы: внешний по строкам, внутренний по столбцам.'
    }
  ]
}
