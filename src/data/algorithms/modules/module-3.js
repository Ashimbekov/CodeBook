export default {
  id: 3,
  title: 'Пузырьковая сортировка',
  description: 'Изучите первый алгоритм сортировки — пузырьковую сортировку — через простые аналогии и пошаговые примеры.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Что такое сортировка и зачем она нужна?',
      content: [
        {
          type: 'heading',
          text: 'Сортировка — это наведение порядка'
        },
        {
          type: 'text',
          text: 'Представьте стопку книг на полу в полном беспорядке. Вы хотите расставить их по алфавиту. Или представьте список покупок, который вы хотите упорядочить по отделам магазина. Это и есть сортировка — расположить элементы в определённом порядке.'
        },
        {
          type: 'text',
          text: 'В программировании сортировка — одна из самых частых задач. Отсортированные данные позволяют использовать бинарный поиск, быстрее находить минимум и максимум, строить графики и многое другое.'
        },
        {
          type: 'heading',
          text: 'Примеры сортировки в реальной жизни'
        },
        {
          type: 'list',
          items: [
            'Рейтинг игроков в игре — сортировка по убыванию очков',
            'Список контактов в телефоне — сортировка по алфавиту',
            'Товары на сайте "от дешёвых к дорогим" — сортировка по цене',
            'Письма в почте по дате — сортировка по времени',
            'Карточки в картотеке библиотеки — сортировка по номеру'
          ]
        },
        {
          type: 'heading',
          text: 'Виды сортировки'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SortingIntro {\n    public static void main(String[] args) {\n        // Сортировка по возрастанию\n        int[] asc = {5, 2, 8, 1, 9};\n        // После сортировки: {1, 2, 5, 8, 9}\n\n        // Сортировка по убыванию\n        int[] desc = {5, 2, 8, 1, 9};\n        // После сортировки: {9, 8, 5, 2, 1}\n\n        // Сортировка строк (лексикографическая)\n        String[] names = {"Карим", "Айгерим", "Болат", "Данияр"};\n        // После сортировки: {"Айгерим", "Болат", "Данияр", "Карим"}\n\n        // Java умеет сортировать встроенными методами:\n        java.util.Arrays.sort(asc);    // для примитивов\n        java.util.Arrays.sort(names);  // для строк\n\n        System.out.println(java.util.Arrays.toString(asc));   // [1, 2, 5, 8, 9]\n        System.out.println(java.util.Arrays.toString(names)); // [Айгерим, Болат, Данияр, Карим]\n    }\n}'
        },
        {
          type: 'note',
          text: 'Существует более 20 известных алгоритмов сортировки! Каждый имеет свои плюсы и минусы. Мы изучим несколько самых важных, начиная с самого простого и понятного — пузырьковой сортировки.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Пузырьковая сортировка — пузырьки всплывают вверх',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: пузырьки в газировке'
        },
        {
          type: 'text',
          text: 'Откройте бутылку газировки и смотрите: маленькие пузырьки со дна поднимаются вверх. Большие пузырьки поднимаются быстрее маленьких. Пузырьковая сортировка работает похожим образом: большие числа "всплывают" в конец массива, проталкиваясь через соседей.'
        },
        {
          type: 'heading',
          text: 'Принцип работы'
        },
        {
          type: 'text',
          text: 'Мы проходим по массиву и сравниваем каждую пару соседних элементов. Если левый больше правого — меняем их местами. После первого прохода самый большой элемент окажется в конце. После второго прохода — второй по величине займёт своё место. И так далее.'
        },
        {
          type: 'heading',
          text: 'Пошаговый пример: [5, 3, 8, 1, 2]'
        },
        {
          type: 'list',
          items: [
            'ПРОХОД 1:',
            '  [5, 3, 8, 1, 2] → сравниваем 5 и 3: 5 > 3, меняем → [3, 5, 8, 1, 2]',
            '  [3, 5, 8, 1, 2] → сравниваем 5 и 8: 5 < 8, не меняем → [3, 5, 8, 1, 2]',
            '  [3, 5, 8, 1, 2] → сравниваем 8 и 1: 8 > 1, меняем → [3, 5, 1, 8, 2]',
            '  [3, 5, 1, 8, 2] → сравниваем 8 и 2: 8 > 2, меняем → [3, 5, 1, 2, 8]',
            '  Результат: 8 "всплыл" на своё место!',
            'ПРОХОД 2:',
            '  [3, 5, 1, 2, 8] → сравниваем 3 и 5: OK → [3, 5, 1, 2, 8]',
            '  [3, 5, 1, 2, 8] → сравниваем 5 и 1: меняем → [3, 1, 5, 2, 8]',
            '  [3, 1, 5, 2, 8] → сравниваем 5 и 2: меняем → [3, 1, 2, 5, 8]',
            '  Результат: 5 на месте!',
            'ПРОХОД 3: [3, 1, 2, 5, 8] → меняем 3 и 1 → [1, 3, 2, 5, 8] → меняем 3 и 2 → [1, 2, 3, 5, 8]',
            'ПРОХОД 4: [1, 2, 3, 5, 8] → ничего не меняем — готово!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class BubbleSortVisualized {\n\n    public static void bubbleSortWithTrace(int[] arr) {\n        int n = arr.length;\n        System.out.println("Начало: " + java.util.Arrays.toString(arr));\n\n        for (int pass = 0; pass < n - 1; pass++) {\n            System.out.println("\\n--- Проход " + (pass + 1) + " ---");\n            boolean swapped = false;\n\n            for (int j = 0; j < n - 1 - pass; j++) {\n                System.out.print("  Сравниваем arr[" + j + "]=" + arr[j] +\n                    " и arr[" + (j+1) + "]=" + arr[j+1]);\n\n                if (arr[j] > arr[j + 1]) {\n                    // Меняем местами\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                    swapped = true;\n                    System.out.println(" → SWAP! " + java.util.Arrays.toString(arr));\n                } else {\n                    System.out.println(" → OK");\n                }\n            }\n\n            if (!swapped) {\n                System.out.println("Нет обменов — массив отсортирован!");\n                break;\n            }\n        }\n\n        System.out.println("\\nРезультат: " + java.util.Arrays.toString(arr));\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {5, 3, 8, 1, 2};\n        bubbleSortWithTrace(arr);\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Заметили? После каждого прохода i самые большие i чисел уже стоят на своих местах в конце массива. Поэтому во втором проходе можно не проверять последний элемент, в третьем — последние два, и так далее.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Реализация пузырьковой сортировки',
      content: [
        {
          type: 'heading',
          text: 'Чистая реализация на Java'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class BubbleSort {\n\n    // Базовая версия пузырьковой сортировки\n    public static void bubbleSort(int[] arr) {\n        int n = arr.length;\n\n        // Внешний цикл: n-1 проходов\n        for (int i = 0; i < n - 1; i++) {\n            // Внутренний цикл: сравниваем соседей\n            // После i-го прохода последние i элементов — на месте\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    // Обмен соседних элементов\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n    }\n\n    // Сортировка по убыванию\n    public static void bubbleSortDescending(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (arr[j] < arr[j + 1]) { // просто меняем знак сравнения!\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n    }\n\n    // Вспомогательный метод для печати\n    public static void print(int[] arr) {\n        System.out.println(java.util.Arrays.toString(arr));\n    }\n\n    public static void main(String[] args) {\n        int[] arr1 = {64, 34, 25, 12, 22, 11, 90};\n        System.out.print("До:    ");\n        print(arr1);\n        bubbleSort(arr1);\n        System.out.print("После: ");\n        print(arr1);\n        // [11, 12, 22, 25, 34, 64, 90]\n\n        int[] arr2 = {5, 1, 4, 2, 8};\n        bubbleSortDescending(arr2);\n        System.out.print("По убыванию: ");\n        print(arr2);\n        // [8, 5, 4, 2, 1]\n\n        // Уже отсортированный массив\n        int[] arr3 = {1, 2, 3, 4, 5};\n        bubbleSort(arr3);\n        System.out.print("Уже отсортирован: ");\n        print(arr3);\n        // [1, 2, 3, 4, 5]\n    }\n}'
        },
        {
          type: 'note',
          text: 'Почему цикл внутри идёт до n-1-i, а не до n-1? После i проходов последние i элементов уже стоят на своих местах. Нет смысла их проверять заново — это оптимизация, уменьшающая количество сравнений.'
        },
        {
          type: 'heading',
          text: 'Подсчёт операций вручную'
        },
        {
          type: 'text',
          text: 'Для массива из 5 элементов: Проход 1: 4 сравнения. Проход 2: 3 сравнения. Проход 3: 2 сравнения. Проход 4: 1 сравнение. Итого: 4+3+2+1 = 10 = n*(n-1)/2 = 5*4/2 = 10.'
        },
        {
          type: 'list',
          items: [
            'n=5: 10 сравнений',
            'n=10: 45 сравнений',
            'n=100: 4 950 сравнений',
            'n=1000: 499 500 сравнений',
            'Формула: n*(n-1)/2 ≈ n²/2, значит сложность O(n²)'
          ]
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Оптимизация: ранний выход',
      content: [
        {
          type: 'heading',
          text: 'Что делать, если массив уже отсортирован?'
        },
        {
          type: 'text',
          text: 'Представьте, что вы наводите порядок в уже аккуратной комнате. Вы расставляете все вещи — и обнаруживаете, что они уже стоят правильно! Зачем продолжать? Базовая пузырьковая сортировка всё равно сделает все n-1 проходов, даже если массив уже отсортирован. Можно это исправить!'
        },
        {
          type: 'heading',
          text: 'Оптимизация с флагом swapped'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class OptimizedBubbleSort {\n\n    // Оптимизированная версия с ранним выходом\n    public static void bubbleSortOptimized(int[] arr) {\n        int n = arr.length;\n\n        for (int i = 0; i < n - 1; i++) {\n            boolean swapped = false; // флаг: были ли обмены?\n\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                    swapped = true; // был обмен!\n                }\n            }\n\n            // Если в этом проходе не было ни одного обмена\n            // — массив уже отсортирован! Выходим.\n            if (!swapped) {\n                System.out.println("Ранний выход на проходе " + (i + 1));\n                break;\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        // Лучший случай: уже отсортированный массив\n        int[] sorted = {1, 2, 3, 4, 5};\n        System.out.println("Отсортированный массив:");\n        bubbleSortOptimized(sorted);\n        // Ранний выход на проходе 1 — всего n-1 сравнений!\n\n        // Почти отсортированный: только один элемент не на месте\n        int[] almostSorted = {1, 2, 4, 3, 5};\n        System.out.println("\\nПочти отсортированный:");\n        bubbleSortOptimized(almostSorted);\n        // Ранний выход на проходе 2\n\n        // Худший случай: отсортирован в обратном порядке\n        int[] reversed = {5, 4, 3, 2, 1};\n        System.out.println("\\nОбратный порядок:");\n        bubbleSortOptimized(reversed);\n        // Ранний выход не поможет — нужно n-1 проходов\n    }\n}'
        },
        {
          type: 'tip',
          text: 'С оптимизацией ранним выходом: лучший случай O(n) — массив уже отсортирован (один проход без обменов). Средний случай O(n²). Худший случай O(n²) — обратный порядок.'
        },
        {
          type: 'heading',
          text: 'Ещё одна оптимизация: граница последнего обмена'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class SuperOptimizedBubbleSort {\n\n    // Запоминаем позицию последнего обмена\n    // Всё, что правее — уже отсортировано\n    public static void bubbleSortSuperOpt(int[] arr) {\n        int n = arr.length;\n        int lastSwap; // позиция последнего обмена\n\n        do {\n            lastSwap = 0; // если обменов не будет — выйдем\n            for (int j = 0; j < n - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                    lastSwap = j + 1; // запоминаем последний обмен\n                }\n            }\n            n = lastSwap; // следующий проход до этой позиции\n        } while (n > 1);\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {3, 1, 2, 8, 5, 4};\n        // Элементы 8, 5, 4 в правой части относительно близки к финалу\n        bubbleSortSuperOpt(arr);\n        System.out.println(java.util.Arrays.toString(arr));\n        // [1, 2, 3, 4, 5, 8]\n    }\n}'
        },
        {
          type: 'warning',
          text: 'Несмотря на оптимизации, в среднем и худшем случае пузырьковая сортировка остаётся O(n²). Для больших данных используйте более быстрые алгоритмы (сортировка слиянием, быстрая сортировка).'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Анализ сложности O(n²) наглядно',
      content: [
        {
          type: 'heading',
          text: 'Считаем операции для пузырьковой сортировки'
        },
        {
          type: 'text',
          text: 'Давайте посчитаем точное количество сравнений и обменов для разных размеров массива, чтобы "почувствовать" O(n²) на практике.'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class ComplexityAnalysis {\n\n    static int comparisons = 0;\n    static int swaps = 0;\n\n    public static void bubbleSortCount(int[] arr) {\n        comparisons = 0;\n        swaps = 0;\n        int n = arr.length;\n\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - 1 - i; j++) {\n                comparisons++; // считаем каждое сравнение\n                if (arr[j] > arr[j + 1]) {\n                    swaps++; // считаем каждый обмен\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n            }\n        }\n    }\n\n    // Генерируем худший случай: обратный порядок\n    static int[] worstCase(int n) {\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = n - i;\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        int[] sizes = {5, 10, 20, 50, 100};\n\n        System.out.println("n\\t| Сравнений\\t| n*(n-1)/2\\t| Обменов");\n        System.out.println("----+----------\\t+-----------\\t+---------");\n\n        for (int n : sizes) {\n            bubbleSortCount(worstCase(n));\n            long formula = (long) n * (n - 1) / 2;\n            System.out.println(n + "\\t| " + comparisons +\n                "\\t\\t| " + formula + "\\t\\t| " + swaps);\n        }\n\n        // Вывод:\n        // n=5:   Сравнений=10,   n*(n-1)/2=10\n        // n=10:  Сравнений=45,   n*(n-1)/2=45\n        // n=20:  Сравнений=190,  n*(n-1)/2=190\n        // n=50:  Сравнений=1225, n*(n-1)/2=1225\n        // n=100: Сравнений=4950, n*(n-1)/2=4950\n        // Формула точна! O(n²) подтверждена.\n    }\n}'
        },
        {
          type: 'note',
          text: 'Три случая для пузырьковой сортировки:\n- Лучший O(n): массив уже отсортирован (с оптимизацией)\n- Средний O(n²): случайный порядок элементов\n- Худший O(n²): массив отсортирован в обратном порядке\nПамять: O(1) — только несколько переменных (temp, i, j). Это называется "сортировка на месте" (in-place sort).'
        },
        {
          type: 'heading',
          text: 'Когда стоит (и не стоит) использовать пузырьковую сортировку'
        },
        {
          type: 'list',
          items: [
            'СТОИТ использовать: маленькие массивы (до 50-100 элементов), когда массив почти отсортирован, в учебных целях для понимания принципов',
            'НЕ СТОИТ использовать: большие массивы (тысячи и более элементов), в production-коде для больших данных',
            'НА ПРАКТИКЕ: реальные приложения используют TimSort (Java по умолчанию) — гибрид сортировки слиянием и вставками, работающий за O(n log n)'
          ]
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: Реализуйте и трассируйте пузырьковую сортировку',
      difficulty: 'easy',
      description: 'Реализуйте пузырьковую сортировку и добавьте подробную трассировку, чтобы видеть каждый шаг алгоритма. Затем посчитайте общее количество обменов.',
      requirements: [
        'Реализуйте метод bubbleSort(int[] arr), который сортирует массив по возрастанию',
        'Добавьте счётчик обменов и выводите его в конце',
        'Реализуйте оптимизацию с ранним выходом',
        'Для массива {64, 34, 25, 12, 22, 11, 90} вывести отсортированный результат и количество обменов'
      ],
      expectedOutput: 'До: [64, 34, 25, 12, 22, 11, 90]\nПосле: [11, 12, 22, 25, 34, 64, 90]\nКоличество обменов: 14',
      hint: 'Каждый раз, когда вы меняете arr[j] и arr[j+1] местами — увеличивайте счётчик на 1. Убедитесь, что счётчик объявлен вне циклов, чтобы сохранять значение между проходами.',
      solution: 'public class BubbleSortPractice {\n    public static int bubbleSort(int[] arr) {\n        int n = arr.length;\n        int swapCount = 0;\n\n        for (int i = 0; i < n - 1; i++) {\n            boolean swapped = false;\n\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                    swapCount++;\n                    swapped = true;\n                }\n            }\n\n            if (!swapped) break; // ранний выход\n        }\n\n        return swapCount;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n        System.out.println("До: " + java.util.Arrays.toString(arr));\n        int swaps = bubbleSort(arr);\n        System.out.println("После: " + java.util.Arrays.toString(arr));\n        System.out.println("Количество обменов: " + swaps);\n    }\n}',
      explanation: 'Пузырьковая сортировка делает проходы по массиву, каждый раз "всплывая" максимальный элемент на его финальную позицию. Оптимизация с флагом swapped позволяет завершить раньше, если за целый проход не было ни одного обмена — это значит массив уже отсортирован. Сложность O(n²) в худшем случае, O(n) в лучшем.'
    }
  ]
};
