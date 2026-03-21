export default {
  id: 4,
  title: 'Сортировка выбором и вставкой',
  description: 'Изучите два классических алгоритма сортировки: выбором и вставкой — и сравните все три простые сортировки.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Сортировка выбором — ищем минимум',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: собираем команду от слабейшего к сильнейшему'
        },
        {
          type: 'text',
          text: 'Представьте, что вы выстраиваете детей по росту. Вы смотрите на всех детей, находите самого низкого и ставите его первым. Потом смотрите на оставшихся, находите самого низкого из них и ставите вторым. И так далее. Это и есть сортировка выбором: на каждом шаге находим минимальный элемент из оставшихся и ставим его на нужное место.'
        },
        {
          type: 'heading',
          text: 'Алгоритм шаг за шагом'
        },
        {
          type: 'list',
          items: [
            'Шаг 1: Находим минимальный элемент во всём массиве',
            'Шаг 2: Меняем его местами с первым элементом',
            'Шаг 3: Теперь первый элемент на своём месте — забываем о нём',
            'Шаг 4: Находим минимальный среди оставшихся (со 2-го по последний)',
            'Шаг 5: Меняем с вторым элементом',
            'Шаг 6: Повторяем n-1 раз'
          ]
        },
        {
          type: 'heading',
          text: 'Пошаговый пример: [64, 25, 12, 22, 11]'
        },
        {
          type: 'list',
          items: [
            'Проход i=0: ищем min в [64, 25, 12, 22, 11] → min=11, позиция 4. Меняем arr[0] и arr[4] → [11, 25, 12, 22, 64]',
            'Проход i=1: ищем min в [25, 12, 22, 64] → min=12, позиция 2. Меняем arr[1] и arr[2] → [11, 12, 25, 22, 64]',
            'Проход i=2: ищем min в [25, 22, 64] → min=22, позиция 3. Меняем arr[2] и arr[3] → [11, 12, 22, 25, 64]',
            'Проход i=3: ищем min в [25, 64] → min=25, позиция 3. Менять не нужно (уже на месте) → [11, 12, 22, 25, 64]',
            'Готово! Массив отсортирован за 4 прохода.'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SelectionSortVisualized {\n\n    public static void selectionSort(int[] arr) {\n        int n = arr.length;\n        System.out.println("Начало: " + java.util.Arrays.toString(arr));\n\n        for (int i = 0; i < n - 1; i++) {\n            // Находим индекс минимального элемента\n            // в неотсортированной части [i..n-1]\n            int minIndex = i;\n\n            for (int j = i + 1; j < n; j++) {\n                if (arr[j] < arr[minIndex]) {\n                    minIndex = j; // нашли новый минимум\n                }\n            }\n\n            // Меняем минимальный элемент с первым\n            // в неотсортированной части\n            if (minIndex != i) { // обмен нужен только если не тот же элемент\n                int temp = arr[minIndex];\n                arr[minIndex] = arr[i];\n                arr[i] = temp;\n            }\n\n            System.out.println("После прохода " + (i+1) +\n                ": " + java.util.Arrays.toString(arr) +\n                " (arr[" + i + "]=" + arr[i] + " на месте)");\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {64, 25, 12, 22, 11};\n        selectionSort(arr);\n        // Начало: [64, 25, 12, 22, 11]\n        // После прохода 1: [11, 25, 12, 22, 64] (arr[0]=11 на месте)\n        // После прохода 2: [11, 12, 25, 22, 64] (arr[1]=12 на месте)\n        // После прохода 3: [11, 12, 22, 25, 64] (arr[2]=22 на месте)\n        // После прохода 4: [11, 12, 22, 25, 64] (arr[3]=25 на месте)\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Ключевое преимущество сортировки выбором перед пузырьковой: она делает минимальное количество обменов — ровно n-1 (по одному на каждый проход). Пузырьковая может делать до n*(n-1)/2 обменов! Если обмен — дорогая операция, выбор побеждает.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Реализация сортировки выбором',
      content: [
        {
          type: 'heading',
          text: 'Полная реализация с анализом'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SelectionSort {\n\n    // Сортировка выбором по возрастанию\n    public static void selectionSort(int[] arr) {\n        int n = arr.length;\n\n        for (int i = 0; i < n - 1; i++) {\n            // Предполагаем, что arr[i] — минимальный\n            int minIndex = i;\n\n            // Ищем настоящий минимум в [i+1..n-1]\n            for (int j = i + 1; j < n; j++) {\n                if (arr[j] < arr[minIndex]) {\n                    minIndex = j;\n                }\n            }\n\n            // Ставим минимум на позицию i\n            if (minIndex != i) {\n                int temp = arr[minIndex];\n                arr[minIndex] = arr[i];\n                arr[i] = temp;\n            }\n        }\n    }\n\n    // Подсчёт операций\n    public static int[] selectionSortCount(int[] arr) {\n        int n = arr.length;\n        int comparisons = 0;\n        int swaps = 0;\n\n        for (int i = 0; i < n - 1; i++) {\n            int minIndex = i;\n            for (int j = i + 1; j < n; j++) {\n                comparisons++;\n                if (arr[j] < arr[minIndex]) {\n                    minIndex = j;\n                }\n            }\n            if (minIndex != i) {\n                int temp = arr[minIndex];\n                arr[minIndex] = arr[i];\n                arr[i] = temp;\n                swaps++;\n            }\n        }\n\n        return new int[]{comparisons, swaps};\n    }\n\n    public static void main(String[] args) {\n        // Тест 1: обычный массив\n        int[] arr1 = {64, 25, 12, 22, 11};\n        selectionSort(arr1);\n        System.out.println(java.util.Arrays.toString(arr1));\n        // [11, 12, 22, 25, 64]\n\n        // Тест 2: уже отсортированный\n        int[] arr2 = {1, 2, 3, 4, 5};\n        int[] count2 = selectionSortCount(arr2.clone());\n        System.out.println("Сравнений: " + count2[0] + ", обменов: " + count2[1]);\n        // Сравнений: 10, обменов: 0 — обменов нет!\n\n        // Тест 3: обратный порядок\n        int[] arr3 = {5, 4, 3, 2, 1};\n        int[] count3 = selectionSortCount(arr3.clone());\n        System.out.println("Сравнений: " + count3[0] + ", обменов: " + count3[1]);\n        // Сравнений: 10, обменов: 2 (не 4!)\n        // Интересно: не всегда n-1 обменов,\n        // потому что минимум может оказаться уже на месте\n    }\n}'
        },
        {
          type: 'note',
          text: 'Сложность сортировки выбором:\n- Все случаи (лучший, средний, худший): O(n²) сравнений\n- Количество обменов: от 0 до n-1 (это лучше, чем пузырьковая!)\n- Память: O(1) — сортировка на месте\n\nВажно: сортировка выбором НЕ является устойчивой! Устойчивая сортировка сохраняет относительный порядок одинаковых элементов.'
        },
        {
          type: 'warning',
          text: 'Сортировка выбором не реагирует на "почти отсортированный" массив — она всегда делает n*(n-1)/2 сравнений, независимо от начального порядка. В отличие от неё, пузырьковая (с флагом) работает за O(n) для почти отсортированных данных.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Сортировка вставкой — как раскладывать карты',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: сортируем карты в руке'
        },
        {
          type: 'text',
          text: 'Вы играете в карты. Вам раздают карты по одной. Каждую новую карту вы вставляете на правильное место среди уже держащихся в руке карт. Например, у вас 3, 7, 10. Приходит карта 5 — вы вставляете её между 3 и 7: получается 3, 5, 7, 10. Это и есть сортировка вставкой!'
        },
        {
          type: 'text',
          text: 'Идея алгоритма: массив делится на отсортированную (левую) и неотсортированную (правую) части. На каждом шаге берём первый элемент из неотсортированной части и вставляем его в правильное место отсортированной части.'
        },
        {
          type: 'heading',
          text: 'Пошаговый пример: [5, 2, 4, 6, 1, 3]'
        },
        {
          type: 'list',
          items: [
            'Начало: [5] | [2, 4, 6, 1, 3]  (отсортировано | не отсортировано)',
            'Вставляем 2: ключ=2. 2 < 5, сдвигаем 5 вправо. Вставляем 2. → [2, 5] | [4, 6, 1, 3]',
            'Вставляем 4: ключ=4. 4 < 5, сдвигаем 5. 4 > 2, стоп. Вставляем 4. → [2, 4, 5] | [6, 1, 3]',
            'Вставляем 6: ключ=6. 6 > 5, стоп. Вставляем 6. → [2, 4, 5, 6] | [1, 3]',
            'Вставляем 1: ключ=1. Сдвигаем 6, 5, 4, 2. Вставляем в начало. → [1, 2, 4, 5, 6] | [3]',
            'Вставляем 3: ключ=3. Сдвигаем 6, 5, 4. 3 > 2, стоп. Вставляем. → [1, 2, 3, 4, 5, 6]',
            'Готово!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class InsertionSortVisualized {\n\n    public static void insertionSortTrace(int[] arr) {\n        int n = arr.length;\n        System.out.println("Начало: " + java.util.Arrays.toString(arr));\n\n        for (int i = 1; i < n; i++) {\n            int key = arr[i]; // элемент, который вставляем\n            int j = i - 1;   // начинаем сравнивать с предыдущим\n\n            System.out.print("Вставляем " + key + ": ");\n\n            // Сдвигаем элементы вправо, пока они больше key\n            while (j >= 0 && arr[j] > key) {\n                arr[j + 1] = arr[j]; // сдвигаем на 1 вправо\n                j--;\n            }\n\n            // Вставляем key на найденное место\n            arr[j + 1] = key;\n\n            System.out.println(java.util.Arrays.toString(arr));\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {5, 2, 4, 6, 1, 3};\n        insertionSortTrace(arr);\n        // Вставляем 2: [2, 5, 4, 6, 1, 3]\n        // Вставляем 4: [2, 4, 5, 6, 1, 3]\n        // Вставляем 6: [2, 4, 5, 6, 1, 3]\n        // Вставляем 1: [1, 2, 4, 5, 6, 3]\n        // Вставляем 3: [1, 2, 3, 4, 5, 6]\n    }\n}'
        },
        {
          type: 'note',
          text: 'Ключевое отличие: при вставке мы не меняем элементы местами (как пузырьковая), а СДВИГАЕМ их вправо, освобождая место для вставки. Это делает сортировку вставкой эффективной для почти отсортированных массивов.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Реализация сортировки вставкой',
      content: [
        {
          type: 'heading',
          text: 'Полная реализация'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class InsertionSort {\n\n    // Сортировка вставкой по возрастанию\n    public static void insertionSort(int[] arr) {\n        int n = arr.length;\n\n        for (int i = 1; i < n; i++) {\n            int key = arr[i]; // запоминаем вставляемый элемент\n            int j = i - 1;\n\n            // Сдвигаем элементы, большие key, на одну позицию вправо\n            while (j >= 0 && arr[j] > key) {\n                arr[j + 1] = arr[j];\n                j--;\n            }\n\n            // Вставляем key на правильное место\n            arr[j + 1] = key;\n        }\n    }\n\n    // Анализ производительности\n    public static int[] insertionSortCount(int[] arr) {\n        int n = arr.length;\n        int comparisons = 0;\n        int shifts = 0;\n\n        for (int i = 1; i < n; i++) {\n            int key = arr[i];\n            int j = i - 1;\n\n            while (j >= 0) {\n                comparisons++;\n                if (arr[j] > key) {\n                    arr[j + 1] = arr[j];\n                    shifts++;\n                    j--;\n                } else {\n                    break;\n                }\n            }\n            arr[j + 1] = key;\n        }\n\n        return new int[]{comparisons, shifts};\n    }\n\n    public static void main(String[] args) {\n        // Тест 1: обычный массив\n        int[] arr1 = {12, 11, 13, 5, 6};\n        insertionSort(arr1);\n        System.out.println(java.util.Arrays.toString(arr1));\n        // [5, 6, 11, 12, 13]\n\n        // Тест 2: уже отсортированный (лучший случай!)\n        int[] arr2 = {1, 2, 3, 4, 5};\n        int[] count2 = insertionSortCount(arr2.clone());\n        System.out.println("Отсортирован: сравнений=" + count2[0] + ", сдвигов=" + count2[1]);\n        // Сравнений=4 (n-1), сдвигов=0 — это O(n)!\n\n        // Тест 3: обратный порядок (худший случай)\n        int[] arr3 = {5, 4, 3, 2, 1};\n        int[] count3 = insertionSortCount(arr3.clone());\n        System.out.println("Обратный: сравнений=" + count3[0] + ", сдвигов=" + count3[1]);\n        // Сравнений=10, сдвигов=10 — это O(n²)\n\n        // Тест 4: почти отсортированный (сортировка вставкой блистает!)\n        int[] arr4 = {1, 2, 3, 5, 4}; // только 5 и 4 перепутаны\n        int[] count4 = insertionSortCount(arr4.clone());\n        System.out.println("Почти sorted: сравнений=" + count4[0]);\n        // Почти O(n)!\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Сортировка вставкой — УСТОЙЧИВАЯ! Одинаковые элементы сохраняют свой относительный порядок. Это важно, например, когда нужно сортировать объекты по одному полю, сохраняя порядок по другому полю.'
        },
        {
          type: 'note',
          text: 'Сложность сортировки вставкой:\n- Лучший случай O(n): массив уже отсортирован (inner while не выполняется)\n- Средний случай O(n²)\n- Худший случай O(n²): обратный порядок\n- Память O(1): сортировка на месте\n\nНа практике сортировка вставкой очень быстра для маленьких массивов (до ~20 элементов) — именно поэтому TimSort использует её для маленьких подмассивов!'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Сравнение трёх простых сортировок',
      content: [
        {
          type: 'heading',
          text: 'Пузырьковая vs Выбором vs Вставкой'
        },
        {
          type: 'text',
          text: 'Все три алгоритма имеют O(n²) в худшем и среднем случае. Но у каждого есть свои особенности. Давайте сравним их детально и выясним, когда какой использовать.'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SortComparison {\n\n    // Измеряем время работы каждого алгоритма\n    public static void compare(int[] original) {\n        int[] arr1 = original.clone();\n        int[] arr2 = original.clone();\n        int[] arr3 = original.clone();\n\n        long start, end;\n\n        start = System.nanoTime();\n        bubbleSort(arr1);\n        end = System.nanoTime();\n        System.out.println("Пузырьковая:  " + (end - start) / 1000 + " мкс");\n\n        start = System.nanoTime();\n        selectionSort(arr2);\n        end = System.nanoTime();\n        System.out.println("Выбором:      " + (end - start) / 1000 + " мкс");\n\n        start = System.nanoTime();\n        insertionSort(arr3);\n        end = System.nanoTime();\n        System.out.println("Вставкой:     " + (end - start) / 1000 + " мкс");\n    }\n\n    static void bubbleSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            boolean swapped = false;\n            for (int j = 0; j < n - 1 - i; j++)\n                if (arr[j] > arr[j+1]) { int t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; swapped=true; }\n            if (!swapped) break;\n        }\n    }\n\n    static void selectionSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            int min = i;\n            for (int j = i+1; j < n; j++) if (arr[j] < arr[min]) min = j;\n            if (min != i) { int t=arr[min]; arr[min]=arr[i]; arr[i]=t; }\n        }\n    }\n\n    static void insertionSort(int[] arr) {\n        for (int i = 1; i < arr.length; i++) {\n            int key = arr[i], j = i - 1;\n            while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }\n            arr[j+1] = key;\n        }\n    }\n\n    public static void main(String[] args) {\n        int n = 1000;\n        int[] random = new int[n];\n        int[] sorted = new int[n];\n        int[] reversed = new int[n];\n\n        for (int i = 0; i < n; i++) {\n            random[i] = (int)(Math.random() * 1000);\n            sorted[i] = i;\n            reversed[i] = n - i;\n        }\n\n        System.out.println("=== Случайный массив ===");\n        compare(random);\n\n        System.out.println("=== Уже отсортированный ===");\n        compare(sorted);\n        // Вставкой выиграет! O(n) против O(n²)\n\n        System.out.println("=== Обратный порядок ===");\n        compare(reversed);\n    }\n}'
        },
        {
          type: 'note',
          text: 'Сводная таблица сравнения:\n\nАлгоритм     | Лучший  | Средний | Худший  | Память | Устойчивый?\nПузырьковая  | O(n)    | O(n²)   | O(n²)   | O(1)   | ДА\nВыбором      | O(n²)   | O(n²)   | O(n²)   | O(1)   | НЕТ\nВставкой     | O(n)    | O(n²)   | O(n²)   | O(1)   | ДА\n\nПобедитель для почти отсортированных данных: ВСТАВКОЙ\nПобедитель по обменам: ВЫБОРОМ (максимум n-1 обменов)\nСамый простой для понимания: ПУЗЫРЬКОВАЯ'
        },
        {
          type: 'tip',
          text: 'На практике ни один из этих трёх алгоритмов не используется для больших данных. Java Arrays.sort() использует TimSort — гибрид вставкой (для малых) и merge sort (для больших), который работает за O(n log n).'
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: Сортировка вставкой для строк',
      difficulty: 'medium',
      description: 'Реализуйте сортировку вставкой для массива строк. Строки сравниваются лексикографически (как в словаре): "apple" < "banana", "Алматы" < "Астана".',
      requirements: [
        'Реализуйте метод insertionSortStrings(String[] arr)',
        'Используйте метод compareTo() для сравнения строк',
        'Отсортируйте массив {"банан", "яблоко", "апельсин", "вишня", "груша"} по алфавиту',
        'Выведите массив до и после сортировки'
      ],
      expectedOutput: 'До: [банан, яблоко, апельсин, вишня, груша]\nПосле: [апельсин, банан, вишня, груша, яблоко]',
      hint: 'Метод compareTo() возвращает отрицательное число, если первая строка "меньше" второй. Например, "банан".compareTo("яблоко") < 0, потому что "б" идёт раньше "я" в алфавите.',
      solution: 'public class StringInsertionSort {\n    public static void insertionSortStrings(String[] arr) {\n        int n = arr.length;\n\n        for (int i = 1; i < n; i++) {\n            String key = arr[i];\n            int j = i - 1;\n\n            // Сдвигаем элементы, которые "больше" key\n            while (j >= 0 && arr[j].compareTo(key) > 0) {\n                arr[j + 1] = arr[j];\n                j--;\n            }\n\n            arr[j + 1] = key;\n        }\n    }\n\n    public static void main(String[] args) {\n        String[] fruits = {"банан", "яблоко", "апельсин", "вишня", "груша"};\n        System.out.println("До: " + java.util.Arrays.toString(fruits));\n        insertionSortStrings(fruits);\n        System.out.println("После: " + java.util.Arrays.toString(fruits));\n    }\n}',
      explanation: 'Сортировка вставкой работает одинаково хорошо для любого типа данных, где есть порядок сравнения. Для строк используем compareTo(): "a".compareTo("b") < 0 (a < b), "b".compareTo("a") > 0 (b > a), "a".compareTo("a") == 0 (равны). Алгоритм стабилен — одинаковые строки сохраняют свой порядок.'
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: Найдите k наименьших элементов',
      difficulty: 'medium',
      description: 'Используя сортировку выбором, найдите k наименьших элементов массива. Не нужно сортировать весь массив — достаточно k проходов!',
      requirements: [
        'Реализуйте метод kSmallest(int[] arr, int k), возвращающий массив из k наименьших элементов',
        'Используйте принцип сортировки выбором (не более k проходов)',
        'Элементы в результате должны быть отсортированы по возрастанию',
        'kSmallest([7, 10, 4, 3, 20, 15], 3) = [3, 4, 7]'
      ],
      expectedOutput: 'kSmallest([7, 10, 4, 3, 20, 15], 3) = [3, 4, 7]\nkSmallest([1, 5, 2, 8, 3], 2) = [1, 2]',
      hint: 'Сортировка выбором каждый проход ставит минимум на своё место. После k проходов первые k элементов — это k наименьших. Не забудьте работать с копией массива, чтобы не изменять оригинал!',
      solution: 'public class KSmallest {\n    public static int[] kSmallest(int[] arr, int k) {\n        int[] copy = arr.clone(); // работаем с копией\n        int n = copy.length;\n\n        // Делаем ровно k проходов сортировки выбором\n        for (int i = 0; i < k; i++) {\n            int minIndex = i;\n            for (int j = i + 1; j < n; j++) {\n                if (copy[j] < copy[minIndex]) {\n                    minIndex = j;\n                }\n            }\n            if (minIndex != i) {\n                int temp = copy[minIndex];\n                copy[minIndex] = copy[i];\n                copy[i] = temp;\n            }\n        }\n\n        // Первые k элементов — наши ответ\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) result[i] = copy[i];\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] arr1 = {7, 10, 4, 3, 20, 15};\n        System.out.println("kSmallest([7,10,4,3,20,15], 3) = " +\n            java.util.Arrays.toString(kSmallest(arr1, 3)));\n        // [3, 4, 7]\n\n        int[] arr2 = {1, 5, 2, 8, 3};\n        System.out.println("kSmallest([1,5,2,8,3], 2) = " +\n            java.util.Arrays.toString(kSmallest(arr2, 2)));\n        // [1, 2]\n    }\n}',
      explanation: 'Красота этого решения: нам не нужно сортировать весь массив! Сортировка выбором после каждого прохода гарантирует, что i-й элемент стоит на своём правильном месте. Нам нужно лишь k таких проходов. Сложность: O(k*n) вместо O(n²). Если k маленькое (например, k=10 для миллионного массива), это значительно эффективнее полной сортировки.'
    }
  ]
};
