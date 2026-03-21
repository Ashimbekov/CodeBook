export default {
  id: 2,
  title: 'Линейный и бинарный поиск',
  description: 'Изучите два фундаментальных алгоритма поиска: простой линейный и молниеносный бинарный поиск.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Линейный поиск — проверяем каждый элемент',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: поиск носка в ящике комода'
        },
        {
          type: 'text',
          text: 'Представьте, что вы ищете красный носок в ящике комода. Что вы делаете? Берёте первый носок — синий, откладываете. Берёте второй — белый, откладываете. Третий — красный! Нашли. Это и есть линейный поиск: проверяем каждый элемент по очереди, пока не найдём нужный.'
        },
        {
          type: 'text',
          text: 'Линейный поиск — самый простой алгоритм поиска. Его красота в простоте: он работает на ЛЮБОМ массиве, даже если элементы в полном беспорядке. Никакой подготовки не нужно!'
        },
        {
          type: 'heading',
          text: 'Шаги алгоритма линейного поиска'
        },
        {
          type: 'list',
          items: [
            'Шаг 1: Начинаем с первого элемента (индекс 0)',
            'Шаг 2: Сравниваем текущий элемент с искомым',
            'Шаг 3: Если совпадает — возвращаем индекс, ГОТОВО!',
            'Шаг 4: Если не совпадает — переходим к следующему элементу',
            'Шаг 5: Если прошли все элементы и не нашли — возвращаем -1 (не найдено)'
          ]
        },
        {
          type: 'heading',
          text: 'Пошаговый пример'
        },
        {
          type: 'text',
          text: 'Массив: [7, 2, 15, 4, 11, 8]. Ищем: 11.'
        },
        {
          type: 'list',
          items: [
            'Шаг 1: arr[0] = 7.  7 == 11? НЕТ. Идём дальше.',
            'Шаг 2: arr[1] = 2.  2 == 11? НЕТ. Идём дальше.',
            'Шаг 3: arr[2] = 15. 15 == 11? НЕТ. Идём дальше.',
            'Шаг 4: arr[3] = 4.  4 == 11? НЕТ. Идём дальше.',
            'Шаг 5: arr[4] = 11. 11 == 11? ДА! Возвращаем индекс 4.',
            'Итого: 5 сравнений для массива из 6 элементов.'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class LinearSearch {\n\n    // Линейный поиск: возвращает индекс или -1\n    public static int linearSearch(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) {\n                return i; // нашли! возвращаем индекс\n            }\n        }\n        return -1; // не нашли\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {7, 2, 15, 4, 11, 8};\n\n        System.out.println("Ищем 11: индекс " + linearSearch(arr, 11)); // 4\n        System.out.println("Ищем 7:  индекс " + linearSearch(arr, 7));  // 0\n        System.out.println("Ищем 99: индекс " + linearSearch(arr, 99)); // -1\n    }\n}'
        },
        {
          type: 'note',
          text: 'Сложность линейного поиска: Лучший случай O(1) — элемент первый. Средний случай O(n/2) = O(n). Худший случай O(n) — элемент последний или отсутствует. В Big O нас интересует худший случай: O(n).'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Реализация линейного поиска — все варианты',
      content: [
        {
          type: 'heading',
          text: 'Разные версии линейного поиска'
        },
        {
          type: 'text',
          text: 'В реальном коде линейный поиск бывает нужен в разных формах: найти первый элемент, все элементы, или проверить наличие. Давайте реализуем все варианты!'
        },
        {
          type: 'code',
          language: 'java',
          code: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class LinearSearchVariants {\n\n    // Версия 1: Найти первое вхождение\n    public static int findFirst(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) return i;\n        }\n        return -1;\n    }\n\n    // Версия 2: Найти все вхождения\n    public static List<Integer> findAll(int[] arr, int target) {\n        List<Integer> indices = new ArrayList<>();\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) {\n                indices.add(i); // добавляем каждый найденный индекс\n            }\n        }\n        return indices;\n    }\n\n    // Версия 3: Проверить наличие (true/false)\n    public static boolean contains(int[] arr, int target) {\n        for (int num : arr) {\n            if (num == target) return true;\n        }\n        return false;\n    }\n\n    // Версия 4: Поиск в строковом массиве\n    public static int findString(String[] arr, String target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i].equals(target)) { // equals() для строк!\n                return i;\n            }\n        }\n        return -1;\n    }\n\n    // Версия 5: Поиск максимального элемента — тоже линейный!\n    public static int findMaxIndex(int[] arr) {\n        int maxIndex = 0;\n        for (int i = 1; i < arr.length; i++) {\n            if (arr[i] > arr[maxIndex]) {\n                maxIndex = i;\n            }\n        }\n        return maxIndex;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {3, 7, 2, 7, 5, 7, 1};\n        System.out.println("Первый 7: " + findFirst(nums, 7)); // 1\n        System.out.println("Все 7: " + findAll(nums, 7));     // [1, 3, 5]\n        System.out.println("Есть 5? " + contains(nums, 5));   // true\n        System.out.println("Есть 9? " + contains(nums, 9));   // false\n\n        String[] names = {"Алиса", "Боб", "Карлос", "Диана"};\n        System.out.println("Карлос на позиции: " + findString(names, "Карлос")); // 2\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Для строк используйте .equals() вместо ==. Оператор == сравнивает ссылки на объекты, а .equals() — содержимое строк.'
        },
        {
          type: 'heading',
          text: 'Когда использовать линейный поиск?'
        },
        {
          type: 'list',
          items: [
            'Массив маленький (до ~100 элементов) — разница в скорости незначительна',
            'Массив несортированный — бинарный поиск не подходит',
            'Нужно найти ВСЕ вхождения элемента',
            'Одноразовый поиск — нет смысла сортировать ради одного запроса',
            'Простота кода важнее производительности'
          ]
        },
        {
          type: 'warning',
          text: 'Если вы часто ищете в большом сортированном массиве — используйте бинарный поиск! Линейный поиск в таком случае — это как читать всю книгу, чтобы найти одно слово, вместо использования алфавитного указателя.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Бинарный поиск — идея и аналогия',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: как мы ищем слово в словаре?'
        },
        {
          type: 'text',
          text: 'Вам нужно найти слово "море" в большом словаре. Вы открываете его посередине — на букве "П". "М" раньше "П" в алфавите, значит ищем в левой половине. Открываем середину левой половины — "Л". "М" после "Л", ищем правее. Открываем середину — "М"! Нашли раздел. Так работает бинарный поиск!'
        },
        {
          type: 'text',
          text: 'Главное условие бинарного поиска: массив должен быть ОТСОРТИРОВАН. Без этого мы не можем знать, в какую половину идти дальше.'
        },
        {
          type: 'heading',
          text: 'Шаги бинарного поиска'
        },
        {
          type: 'list',
          items: [
            'Шаг 1: Смотрим на средний элемент',
            'Шаг 2: Если средний == искомому — нашли!',
            'Шаг 3: Если искомое МЕНЬШЕ среднего — ищем в левой половине',
            'Шаг 4: Если искомое БОЛЬШЕ среднего — ищем в правой половине',
            'Шаг 5: Повторяем с оставшейся половиной',
            'Шаг 6: Если область поиска пуста — элемент не найден'
          ]
        },
        {
          type: 'heading',
          text: 'Пошаговый пример поиска числа 23'
        },
        {
          type: 'text',
          text: 'Отсортированный массив: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. Ищем: 23.'
        },
        {
          type: 'list',
          items: [
            'Итерация 1: left=0, right=9, mid=4. arr[4]=16. 23 > 16 → ищем справа. left=5.',
            'Итерация 2: left=5, right=9, mid=7. arr[7]=56. 23 < 56 → ищем слева. right=6.',
            'Итерация 3: left=5, right=6, mid=5. arr[5]=23. 23 == 23 → НАШЛИ! Возвращаем 5.',
            'Всего 3 шага для массива из 10 элементов!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class BinarySearchConcept {\n\n    public static void demonstrateBinarySearch() {\n        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n        int target = 23;\n        int left = 0, right = arr.length - 1;\n        int step = 1;\n\n        System.out.println("Ищем " + target + " в массиве");\n        System.out.println("Индексы: 0  1  2   3   4   5   6   7   8   9");\n        System.out.println("Массив: " + java.util.Arrays.toString(arr));\n        System.out.println();\n\n        while (left <= right) {\n            int mid = (left + right) / 2;\n            System.out.println("Шаг " + step + ": left=" + left +\n                ", right=" + right + ", mid=" + mid +\n                ", arr[mid]=" + arr[mid]);\n\n            if (arr[mid] == target) {\n                System.out.println("Нашли! Индекс: " + mid);\n                return;\n            } else if (arr[mid] < target) {\n                System.out.println(arr[mid] + " < " + target + " → ищем в правой половине");\n                left = mid + 1;\n            } else {\n                System.out.println(arr[mid] + " > " + target + " → ищем в левой половине");\n                right = mid - 1;\n            }\n            step++;\n        }\n        System.out.println("Не нашли!");\n    }\n\n    public static void main(String[] args) {\n        demonstrateBinarySearch();\n    }\n}'
        },
        {
          type: 'note',
          text: 'Почему бинарный поиск такой быстрый? После каждого шага мы отбрасываем ПОЛОВИНУ оставшихся элементов. 1000 элементов → после 1 шага 500 → после 2 шага 250 → ... → после 10 шагов 1 элемент. log₂(1000) ≈ 10!'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Реализация бинарного поиска на Java',
      content: [
        {
          type: 'heading',
          text: 'Итеративный бинарный поиск'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class BinarySearch {\n\n    // Итеративная версия: используем цикл while\n    public static int binarySearch(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n\n        while (left <= right) {\n            // ВАЖНО: используем left + (right-left)/2, а не (left+right)/2\n            // Это защищает от переполнения при больших числах!\n            int mid = left + (right - left) / 2;\n\n            if (arr[mid] == target) {\n                return mid;        // нашли!\n            } else if (arr[mid] < target) {\n                left = mid + 1;    // ищем в правой половине\n            } else {\n                right = mid - 1;   // ищем в левой половине\n            }\n        }\n\n        return -1; // не нашли\n    }\n\n    // Нахождение первого вхождения (для массива с дубликатами)\n    public static int findFirst(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n        int result = -1;\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) {\n                result = mid;      // запоминаем, но продолжаем искать левее\n                right = mid - 1;  // ищем ещё левее\n            } else if (arr[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        return result;\n    }\n\n    // Нахождение последнего вхождения\n    public static int findLast(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n        int result = -1;\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (arr[mid] == target) {\n                result = mid;     // запоминаем, но продолжаем искать правее\n                left = mid + 1;  // ищем ещё правее\n            } else if (arr[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] sorted = {1, 3, 3, 3, 5, 7, 9};\n\n        System.out.println(binarySearch(sorted, 7));   // 5\n        System.out.println(binarySearch(sorted, 10));  // -1\n        System.out.println(findFirst(sorted, 3));       // 1\n        System.out.println(findLast(sorted, 3));        // 3\n    }\n}'
        },
        {
          type: 'warning',
          text: 'Классическая ошибка: писать mid = (left + right) / 2. Если left и right — большие числа (близко к Integer.MAX_VALUE = 2147483647), их сумма переполнится! Всегда пишите mid = left + (right - left) / 2.'
        },
        {
          type: 'heading',
          text: 'Анализ сложности бинарного поиска'
        },
        {
          type: 'list',
          items: [
            'Лучший случай: O(1) — элемент оказался ровно посередине с первого раза',
            'Средний случай: O(log n) — находим за несколько итераций',
            'Худший случай: O(log n) — элемент не найден или на краю',
            'Память: O(1) — используем только несколько переменных'
          ]
        },
        {
          type: 'tip',
          text: 'В Java уже есть встроенный бинарный поиск: Arrays.binarySearch(arr, target). Но важно понимать, как он работает внутри!'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'O(n) против O(log n) — наглядное сравнение',
      content: [
        {
          type: 'heading',
          text: 'Насколько O(log n) быстрее O(n)?'
        },
        {
          type: 'text',
          text: 'Представьте, что вы ищете слово в телефонном справочнике Алматы (2 миллиона номеров). Линейный поиск читает страницы одну за другой — в среднем придётся перелистать миллион страниц. Бинарный поиск — как опытный библиотекарь, который сразу открывает середину и каждый раз отсекает половину. Ему нужно всего около 21 "прыжка"!'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SearchComparison {\n\n    // Сравниваем количество операций\n    public static void compareSearches() {\n        int[] sizes = {10, 100, 1_000, 10_000, 100_000, 1_000_000};\n\n        System.out.println("n\\t\\tЛинейный (худший)\\tБинарный (худший)");\n        System.out.println("--\\t\\t-----------------\\t-----------------");\n\n        for (int n : sizes) {\n            int linear = n;  // O(n): до n сравнений\n            int binary = (int) (Math.log(n) / Math.log(2)) + 1; // O(log n)\n            System.out.println(n + "\\t\\t" + linear + "\\t\\t\\t" + binary);\n        }\n    }\n\n    // Практический тест: замеряем реальное время\n    public static void performanceTest() {\n        int n = 10_000_000; // 10 миллионов элементов\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = i * 2; // чётные числа\n        int target = n * 2 - 1; // ищем последний элемент (худший случай)\n\n        // Тест линейного поиска\n        long start = System.nanoTime();\n        int result1 = linearSearch(arr, target);\n        long linearTime = System.nanoTime() - start;\n\n        // Тест бинарного поиска\n        start = System.nanoTime();\n        int result2 = binarySearch(arr, target);\n        long binaryTime = System.nanoTime() - start;\n\n        System.out.println("Линейный: " + linearTime/1_000_000 + " мс");\n        System.out.println("Бинарный: " + binaryTime/1_000_000 + " мс");\n    }\n\n    static int linearSearch(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++)\n            if (arr[i] == target) return i;\n        return -1;\n    }\n\n    static int binarySearch(int[] arr, int target) {\n        int l = 0, r = arr.length - 1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (arr[m] == target) return m;\n            if (arr[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        compareSearches();\n        // n=10:        Линейный=10,      Бинарный=4\n        // n=1000:      Линейный=1000,    Бинарный=10\n        // n=1000000:   Линейный=1000000, Бинарный=20\n    }\n}'
        },
        {
          type: 'note',
          text: 'Таблица сравнения:\nn=10 → линейный: 10, бинарный: 4\nn=1 000 → линейный: 1 000, бинарный: 10\nn=1 000 000 → линейный: 1 000 000, бинарный: 20\nn=1 000 000 000 → линейный: 1 000 000 000, бинарный: 30'
        },
        {
          type: 'tip',
          text: 'Важно помнить: бинарный поиск требует ОТСОРТИРОВАННОГО массива. Если массив не отсортирован и вам нужен один поиск — линейный поиск быстрее (сортировка занимает O(n log n)!). Если поисков много — стоит один раз отсортировать и потом использовать бинарный.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Рекурсивный бинарный поиск',
      content: [
        {
          type: 'heading',
          text: 'Рекурсия — это функция, вызывающая саму себя'
        },
        {
          type: 'text',
          text: 'Представьте матрёшку: открываете большую — внутри точно такая же, только меньше. Открываете её — снова такая же, ещё меньше. И так пока не дойдёте до самой маленькой. Рекурсия работает так же: задача разбивается на меньшую версию той же задачи, пока не дойдём до простого случая.'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class RecursiveBinarySearch {\n\n    // Рекурсивная версия бинарного поиска\n    public static int binarySearch(int[] arr, int target, int left, int right) {\n        // База рекурсии: область поиска пуста\n        if (left > right) {\n            return -1; // не нашли\n        }\n\n        int mid = left + (right - left) / 2;\n\n        // Нашли!\n        if (arr[mid] == target) {\n            return mid;\n        }\n\n        // Рекурсивный вызов для правой половины\n        if (arr[mid] < target) {\n            return binarySearch(arr, target, mid + 1, right);\n        }\n\n        // Рекурсивный вызов для левой половины\n        return binarySearch(arr, target, left, mid - 1);\n    }\n\n    // Удобная обёртка\n    public static int search(int[] arr, int target) {\n        return binarySearch(arr, target, 0, arr.length - 1);\n    }\n\n    // Трассировка рекурсии\n    public static int binarySearchTrace(int[] arr, int target, int left, int right, int depth) {\n        String indent = "  ".repeat(depth); // отступ для визуализации\n        System.out.println(indent + "Вызов: left=" + left + ", right=" + right);\n\n        if (left > right) {\n            System.out.println(indent + "→ Не нашли (left > right)");\n            return -1;\n        }\n\n        int mid = left + (right - left) / 2;\n        System.out.println(indent + "→ mid=" + mid + ", arr[mid]=" + arr[mid]);\n\n        if (arr[mid] == target) {\n            System.out.println(indent + "→ НАШЛИ! Возвращаем " + mid);\n            return mid;\n        }\n\n        if (arr[mid] < target) {\n            System.out.println(indent + "→ " + arr[mid] + " < " + target + ", ищем правее");\n            return binarySearchTrace(arr, target, mid + 1, right, depth + 1);\n        }\n\n        System.out.println(indent + "→ " + arr[mid] + " > " + target + ", ищем левее");\n        return binarySearchTrace(arr, target, left, mid - 1, depth + 1);\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};\n\n        System.out.println("Результат: " + search(arr, 7));  // 3\n        System.out.println("Результат: " + search(arr, 10)); // -1\n\n        System.out.println("\\nТрассировка поиска числа 11:");\n        binarySearchTrace(arr, 11, 0, arr.length - 1, 0);\n    }\n}'
        },
        {
          type: 'note',
          text: 'Рекурсивная версия элегантна, но использует память стека (O(log n) дополнительной памяти). Итеративная версия использует O(1) памяти. В практике чаще используют итеративную версию для экономии памяти.'
        },
        {
          type: 'warning',
          text: 'У рекурсии есть предел глубины — StackOverflowError! Для бинарного поиска это не проблема (log₂(10^18) ≈ 60 уровней), но для других рекурсивных алгоритмов нужно быть осторожным.'
        }
      ]
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: Реализуйте поиск в ротированном массиве',
      difficulty: 'hard',
      description: 'Представьте отсортированный массив, который был "прокручен" на несколько позиций: [4, 5, 6, 7, 0, 1, 2]. Это массив [0, 1, 2, 4, 5, 6, 7], сдвинутый на 4 позиции. Напишите алгоритм поиска в таком массиве.',
      requirements: [
        'Реализуйте метод searchRotated(int[] arr, int target), возвращающий индекс или -1',
        'Используйте модифицированный бинарный поиск (не линейный!)',
        'Сложность должна быть O(log n)',
        'Подсказка: одна из двух половин (левая или правая от mid) всегда остаётся отсортированной'
      ],
      expectedOutput: 'searchRotated([4,5,6,7,0,1,2], 0) = 4\nsearchRotated([4,5,6,7,0,1,2], 3) = -1\nsearchRotated([1], 0) = -1',
      hint: 'Проверьте, какая половина отсортирована. Если arr[left] <= arr[mid] — левая половина отсортирована. Иначе — правая. Потом проверьте, попадает ли target в отсортированную половину.',
      solution: 'public class RotatedSearch {\n    public static int searchRotated(int[] arr, int target) {\n        int left = 0, right = arr.length - 1;\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n\n            if (arr[mid] == target) return mid;\n\n            // Левая половина отсортирована\n            if (arr[left] <= arr[mid]) {\n                // target в левой половине?\n                if (arr[left] <= target && target < arr[mid]) {\n                    right = mid - 1; // ищем слева\n                } else {\n                    left = mid + 1;  // ищем справа\n                }\n            } else {\n                // Правая половина отсортирована\n                // target в правой половине?\n                if (arr[mid] < target && target <= arr[right]) {\n                    left = mid + 1;  // ищем справа\n                } else {\n                    right = mid - 1; // ищем слева\n                }\n            }\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr1 = {4, 5, 6, 7, 0, 1, 2};\n        System.out.println(searchRotated(arr1, 0)); // 4\n        System.out.println(searchRotated(arr1, 3)); // -1\n        int[] arr2 = {1};\n        System.out.println(searchRotated(arr2, 0)); // -1\n    }\n}',
      explanation: 'Ключевое наблюдение: в ротированном массиве всегда хотя бы одна половина (левая или правая от mid) является отсортированной. Мы определяем, какая половина отсортирована, сравнивая arr[left] с arr[mid]. Затем проверяем, входит ли target в диапазон этой отсортированной половины. Если да — ищем там. Если нет — ищем в другой половине. Сложность остаётся O(log n)!'
    }
  ]
};
