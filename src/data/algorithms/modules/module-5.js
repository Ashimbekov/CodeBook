export default {
  id: 5,
  title: 'Сортировка слиянием (Merge Sort)',
  description: 'Откройте для себя принцип "разделяй и властвуй" и изучите элегантный алгоритм сортировки слиянием с O(n log n).',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Разделяй и властвуй — великая идея',
      content: [
        {
          type: 'heading',
          text: 'Принцип "разделяй и властвуй" (Divide and Conquer)'
        },
        {
          type: 'text',
          text: 'Представьте, что вам нужно убрать огромный беспорядок в комнате. Задача кажется невозможной! Но если разделить комнату на зоны (стол, шкаф, пол, кровать) — каждая зона убирается легко. Потом просто "складываем" результаты — и всё готово. Это и есть "разделяй и властвуй": разбить большую трудную задачу на маленькие простые, решить каждую, объединить результаты.'
        },
        {
          type: 'text',
          text: 'Три шага принципа: 1) РАЗДЕЛИТЬ — разбить задачу на более мелкие подзадачи. 2) РЕШИТЬ — рекурсивно решить каждую подзадачу (пока подзадача не станет тривиальной). 3) ОБЪЕДИНИТЬ — соединить решения подзадач в итоговый ответ.'
        },
        {
          type: 'heading',
          text: 'Применение к сортировке'
        },
        {
          type: 'list',
          items: [
            'РАЗДЕЛИТЬ: разрезаем массив пополам',
            'РЕШИТЬ: рекурсивно сортируем каждую половину',
            'ОБЪЕДИНИТЬ: сливаем две отсортированные половины в один отсортированный массив',
            'База рекурсии: массив из 1 элемента уже отсортирован!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class DivideAndConquerDemo {\n\n    // Пример "разделяй и властвуй": нахождение максимума\n    // Вместо одного прохода O(n) — рекурсивное разделение\n    public static int findMax(int[] arr, int left, int right) {\n        // База: один элемент — он и есть максимум\n        if (left == right) {\n            return arr[left];\n        }\n\n        // Разделяем пополам\n        int mid = (left + right) / 2;\n\n        // Рекурсивно находим максимум в каждой половине\n        int maxLeft  = findMax(arr, left, mid);     // левая половина\n        int maxRight = findMax(arr, mid + 1, right); // правая половина\n\n        // Объединяем: берём наибольший из двух максимумов\n        return Math.max(maxLeft, maxRight);\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {3, 7, 1, 9, 2, 8, 4};\n\n        // Дерево рекурсии для arr = {3, 7, 1, 9, 2, 8, 4}:\n        //\n        //          findMax(0,6)\n        //         /            \\\n        //   findMax(0,3)    findMax(4,6)\n        //    /       \\        /      \\\n        // f(0,1)  f(2,3)   f(4,5)   f(6,6)\n        //  / \\     / \\     / \\       |\n        // f(0) f(1) f(2) f(3) f(4) f(5)  4\n        //  3    7    1    9    2    8\n\n        int max = findMax(arr, 0, arr.length - 1);\n        System.out.println("Максимум: " + max); // 9\n    }\n}'
        },
        {
          type: 'note',
          text: 'Ключевое преимущество "разделяй и властвуй": задача размером n разбивается на 2 задачи размером n/2. Это создаёт "дерево рекурсии" с глубиной log₂(n) уровней. На каждом уровне суммарная работа — O(n). Итого: O(n) × O(log n) = O(n log n)!'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Слияние двух отсортированных массивов',
      content: [
        {
          type: 'heading',
          text: 'Аналогия: соединяем две колоды карт'
        },
        {
          type: 'text',
          text: 'У вас две колоды карт, каждая уже отсортирована по возрастанию. Вы хотите объединить их в одну отсортированную колоду. Как? Смотрите на верхние карты обеих колод — берёте наименьшую и кладёте в результирующую колоду. Повторяете. Когда одна колода закончилась — докладываете остаток другой. Это и есть процедура слияния (merge)!'
        },
        {
          type: 'heading',
          text: 'Пошаговое слияние: [1, 4, 7] и [2, 5, 6]'
        },
        {
          type: 'list',
          items: [
            'Левая: [1, 4, 7], Правая: [2, 5, 6], Результат: []',
            'Шаг 1: 1 vs 2 → 1 меньше → берём 1. Левая: [4, 7]. Результат: [1]',
            'Шаг 2: 4 vs 2 → 2 меньше → берём 2. Правая: [5, 6]. Результат: [1, 2]',
            'Шаг 3: 4 vs 5 → 4 меньше → берём 4. Левая: [7]. Результат: [1, 2, 4]',
            'Шаг 4: 7 vs 5 → 5 меньше → берём 5. Правая: [6]. Результат: [1, 2, 4, 5]',
            'Шаг 5: 7 vs 6 → 6 меньше → берём 6. Правая: []. Результат: [1, 2, 4, 5, 6]',
            'Шаг 6: Правая пуста → докладываем остаток левой [7]. Результат: [1, 2, 4, 5, 6, 7]',
            'Готово!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class MergeDemo {\n\n    // Слияние двух отсортированных массивов\n    public static int[] merge(int[] left, int[] right) {\n        int[] result = new int[left.length + right.length];\n        int i = 0; // указатель на левый массив\n        int j = 0; // указатель на правый массив\n        int k = 0; // указатель на результат\n\n        // Пока оба массива не пусты\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) {\n                result[k++] = left[i++]; // берём из левого\n            } else {\n                result[k++] = right[j++]; // берём из правого\n            }\n        }\n\n        // Докладываем остаток левого (если есть)\n        while (i < left.length) {\n            result[k++] = left[i++];\n        }\n\n        // Докладываем остаток правого (если есть)\n        while (j < right.length) {\n            result[k++] = right[j++];\n        }\n\n        return result;\n    }\n\n    public static void mergeTrace(int[] left, int[] right) {\n        System.out.println("Сливаем: " + java.util.Arrays.toString(left) +\n            " + " + java.util.Arrays.toString(right));\n        int[] result = merge(left, right);\n        System.out.println("Результат: " + java.util.Arrays.toString(result));\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        mergeTrace(new int[]{1, 4, 7}, new int[]{2, 5, 6});\n        // Результат: [1, 2, 4, 5, 6, 7]\n\n        mergeTrace(new int[]{1, 3}, new int[]{2, 4, 6, 8});\n        // Результат: [1, 2, 3, 4, 6, 8]\n\n        mergeTrace(new int[]{5}, new int[]{1, 2, 3});\n        // Результат: [1, 2, 3, 5]\n    }\n}'
        },
        {
          type: 'note',
          text: 'Сложность слияния двух массивов суммарного размера n: O(n) по времени (проходим каждый элемент ровно один раз) и O(n) по памяти (нужен дополнительный массив для результата).'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Алгоритм сортировки слиянием',
      content: [
        {
          type: 'heading',
          text: 'Как merge sort использует слияние'
        },
        {
          type: 'text',
          text: 'Теперь объединим идею "разделяй и властвуй" с процедурой слияния. Вот полный алгоритм:'
        },
        {
          type: 'list',
          items: [
            '1. Если массив содержит 0 или 1 элемент — он уже отсортирован, возвращаем его',
            '2. Делим массив пополам: левая и правая части',
            '3. Рекурсивно сортируем левую половину',
            '4. Рекурсивно сортируем правую половину',
            '5. Сливаем две отсортированные половины в один массив',
            '6. Возвращаем объединённый отсортированный массив'
          ]
        },
        {
          type: 'heading',
          text: 'Визуализация разделения: [38, 27, 43, 3, 9, 82, 10]'
        },
        {
          type: 'list',
          items: [
            'Уровень 0: [38, 27, 43, 3, 9, 82, 10]',
            'Уровень 1: [38, 27, 43, 3]  |  [9, 82, 10]',
            'Уровень 2: [38, 27] | [43, 3]  |  [9, 82] | [10]',
            'Уровень 3: [38] [27] [43] [3]  |  [9] [82] [10]  ← база: 1 элемент',
            '--- Начинаем слияние снизу вверх ---',
            'Уровень 2: [27, 38] [3, 43]  |  [9, 82] [10]',
            'Уровень 1: [3, 27, 38, 43]   |  [9, 10, 82]',
            'Уровень 0: [3, 9, 10, 27, 38, 43, 82]  ← ГОТОВО!'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class MergeSort {\n\n    // Основная функция: возвращает отсортированный массив\n    public static int[] mergeSort(int[] arr) {\n        // База рекурсии: массив из 0 или 1 элемента уже отсортирован\n        if (arr.length <= 1) {\n            return arr;\n        }\n\n        // Разделяем пополам\n        int mid = arr.length / 2;\n        int[] left  = java.util.Arrays.copyOfRange(arr, 0, mid);\n        int[] right = java.util.Arrays.copyOfRange(arr, mid, arr.length);\n\n        // Рекурсивно сортируем каждую половину\n        left  = mergeSort(left);\n        right = mergeSort(right);\n\n        // Сливаем и возвращаем\n        return merge(left, right);\n    }\n\n    // Слияние двух отсортированных массивов\n    private static int[] merge(int[] left, int[] right) {\n        int[] result = new int[left.length + right.length];\n        int i = 0, j = 0, k = 0;\n\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) {\n                result[k++] = left[i++];\n            } else {\n                result[k++] = right[j++];\n            }\n        }\n\n        while (i < left.length)  result[k++] = left[i++];\n        while (j < right.length) result[k++] = right[j++];\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {38, 27, 43, 3, 9, 82, 10};\n        System.out.println("До:    " + java.util.Arrays.toString(arr));\n        int[] sorted = mergeSort(arr);\n        System.out.println("После: " + java.util.Arrays.toString(sorted));\n        // После: [3, 9, 10, 27, 38, 43, 82]\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Обратите внимание: в этой версии мы создаём новые массивы (возвращаем отсортированную копию). Существует "in-place" версия, которая сортирует исходный массив без создания копий — она сложнее, но экономит память.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'In-place реализация сортировки слиянием',
      content: [
        {
          type: 'heading',
          text: 'Сортировка в исходном массиве'
        },
        {
          type: 'text',
          text: 'Профессиональная реализация merge sort работает с индексами и сортирует массив "на месте" (не создавая полных копий). Но для слияния всё равно нужен временный буфер.'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class MergeSortInPlace {\n\n    // Сортировка подмассива arr[left..right]\n    public static void mergeSort(int[] arr, int left, int right) {\n        if (left >= right) return; // база: 0 или 1 элемент\n\n        int mid = left + (right - left) / 2;\n\n        mergeSort(arr, left, mid);      // сортируем левую часть\n        mergeSort(arr, mid + 1, right); // сортируем правую часть\n        merge(arr, left, mid, right);   // сливаем\n    }\n\n    // Слияние arr[left..mid] и arr[mid+1..right]\n    private static void merge(int[] arr, int left, int mid, int right) {\n        // Создаём временный массив для слияния\n        int[] temp = new int[right - left + 1];\n\n        int i = left;     // указатель на левую часть\n        int j = mid + 1;  // указатель на правую часть\n        int k = 0;        // указатель на temp\n\n        while (i <= mid && j <= right) {\n            if (arr[i] <= arr[j]) {\n                temp[k++] = arr[i++];\n            } else {\n                temp[k++] = arr[j++];\n            }\n        }\n\n        while (i <= mid)   temp[k++] = arr[i++];\n        while (j <= right) temp[k++] = arr[j++];\n\n        // Копируем обратно в исходный массив\n        for (int l = 0; l < temp.length; l++) {\n            arr[left + l] = temp[l];\n        }\n    }\n\n    // Удобная точка входа\n    public static void sort(int[] arr) {\n        mergeSort(arr, 0, arr.length - 1);\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {12, 11, 13, 5, 6, 7};\n        System.out.println("До:    " + java.util.Arrays.toString(arr));\n        sort(arr); // сортируем исходный массив\n        System.out.println("После: " + java.util.Arrays.toString(arr));\n        // После: [5, 6, 7, 11, 12, 13]\n\n        // Крайние случаи\n        int[] single = {42};\n        sort(single);\n        System.out.println("Один элемент: " + java.util.Arrays.toString(single)); // [42]\n\n        int[] two = {2, 1};\n        sort(two);\n        System.out.println("Два элемента: " + java.util.Arrays.toString(two)); // [1, 2]\n\n        int[] duplicates = {3, 1, 4, 1, 5, 9, 2, 6, 5};\n        sort(duplicates);\n        System.out.println("С дубликатами: " + java.util.Arrays.toString(duplicates));\n        // [1, 1, 2, 3, 4, 5, 5, 6, 9]\n    }\n}'
        },
        {
          type: 'note',
          text: 'Эта версия использует O(n) дополнительной памяти для временного буфера при слиянии. Стек рекурсии занимает O(log n). Итого память: O(n).\n\nВажно: сортировка слиянием УСТОЙЧИВА, если в merge используем <=: if (arr[i] <= arr[j]). Это сохраняет относительный порядок равных элементов.'
        },
        {
          type: 'warning',
          text: 'Глубина рекурсии merge sort — O(log n). Для массива из миллиарда элементов это около 30 уровней. StackOverflowError не случится, в отличие от некоторых других рекурсивных алгоритмов.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Пошаговая трассировка сортировки слиянием',
      content: [
        {
          type: 'heading',
          text: 'Наблюдаем за каждым вызовом'
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class MergeSortTrace {\n\n    static int callCount = 0;\n\n    public static void mergeSortTrace(int[] arr, int left, int right, int depth) {\n        String indent = "  ".repeat(depth);\n        int[] sub = java.util.Arrays.copyOfRange(arr, left, right + 1);\n        System.out.println(indent + "mergeSort(" + left + ", " + right + ") = "\n            + java.util.Arrays.toString(sub));\n\n        if (left >= right) {\n            System.out.println(indent + "↳ База: возвращаем " +\n                java.util.Arrays.toString(sub));\n            return;\n        }\n\n        int mid = left + (right - left) / 2;\n        System.out.println(indent + "↳ Делим: left=[" + left + ".." + mid +\n            "], right=[" + (mid+1) + ".." + right + "]");\n\n        mergeSortTrace(arr, left, mid, depth + 1);\n        mergeSortTrace(arr, mid + 1, right, depth + 1);\n\n        mergeInPlace(arr, left, mid, right);\n        int[] merged = java.util.Arrays.copyOfRange(arr, left, right + 1);\n        System.out.println(indent + "↳ После слияния: " +\n            java.util.Arrays.toString(merged));\n    }\n\n    private static void mergeInPlace(int[] arr, int left, int mid, int right) {\n        int[] temp = new int[right - left + 1];\n        int i = left, j = mid + 1, k = 0;\n        while (i <= mid && j <= right)\n            temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];\n        while (i <= mid)   temp[k++] = arr[i++];\n        while (j <= right) temp[k++] = arr[j++];\n        for (int l = 0; l < temp.length; l++) arr[left + l] = temp[l];\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {5, 2, 4, 1, 3};\n        System.out.println("Сортируем: " + java.util.Arrays.toString(arr));\n        System.out.println();\n        mergeSortTrace(arr, 0, arr.length - 1, 0);\n        System.out.println("\\nРезультат: " + java.util.Arrays.toString(arr));\n    }\n    // Вывод:\n    // mergeSort(0, 4) = [5, 2, 4, 1, 3]\n    //   ↳ Делим: left=[0..2], right=[3..4]\n    //   mergeSort(0, 2) = [5, 2, 4]\n    //     ↳ Делим: left=[0..1], right=[2..2]\n    //     mergeSort(0, 1) = [5, 2]\n    //       ↳ Делим: left=[0..0], right=[1..1]\n    //       mergeSort(0, 0) = [5]\n    //         ↳ База: возвращаем [5]\n    //       mergeSort(1, 1) = [2]\n    //         ↳ База: возвращаем [2]\n    //       ↳ После слияния: [2, 5]\n    //     ...\n}'
        },
        {
          type: 'note',
          text: 'Дерево рекурсии для n=8:\n- Уровень 0: 1 вызов (весь массив)\n- Уровень 1: 2 вызова (по n/2)\n- Уровень 2: 4 вызова (по n/4)\n- ...\n- Уровень log n: n вызовов (по 1 элементу)\n\nНа каждом уровне суммарная работа при слиянии = n. Уровней = log n. Итого: O(n log n).'
        },
        {
          type: 'tip',
          text: 'Merge sort — один из немногих алгоритмов сортировки, гарантирующих O(n log n) в ЛЮБОМ случае (лучшем, среднем, худшем). Quick sort в среднем тоже O(n log n), но в худшем случае — O(n²). Поэтому для гарантированной производительности выбирают merge sort.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Анализ сложности O(n log n)',
      content: [
        {
          type: 'heading',
          text: 'Почему O(n log n) — это очень хорошо?'
        },
        {
          type: 'text',
          text: 'Сравним количество операций для разных алгоритмов на практике. Для n = 1 000 000 элементов:'
        },
        {
          type: 'list',
          items: [
            'O(n²) пузырьковая/выбором/вставкой: 1 000 000 000 000 операций — несколько часов!',
            'O(n log n) merge sort: ~20 000 000 операций — доли секунды!',
            'O(n) линейная: 1 000 000 операций — мгновенно',
            'Вывод: O(n log n) НАМНОГО лучше O(n²) для больших данных'
          ]
        },
        {
          type: 'code',
          language: 'java',
          code: 'public class ComplexityComparison {\n\n    public static void compareAlgorithms() {\n        int[] sizes = {100, 1_000, 10_000, 100_000, 1_000_000};\n\n        System.out.println("n\\t\\t| O(n²)\\t\\t\\t| O(n log n)\\t\\t| Во сколько раз быстрее");\n        System.out.println("------\\t\\t+------\\t\\t\\t+------\\t\\t\\t+--------");\n\n        for (int n : sizes) {\n            long quadratic = (long) n * n;\n            long nlogn = (long) (n * (Math.log(n) / Math.log(2)));\n            long ratio = quadratic / nlogn;\n\n            System.out.println(n + "\\t\\t| " + quadratic + "\\t\\t| " + nlogn + "\\t\\t| " + ratio + "x");\n        }\n    }\n\n    // Практическое измерение\n    public static void benchmark() throws Exception {\n        int n = 100_000;\n        int[] arr = new int[n];\n        java.util.Random rand = new java.util.Random(42);\n        for (int i = 0; i < n; i++) arr[i] = rand.nextInt(1_000_000);\n\n        // Тест merge sort\n        int[] arr1 = arr.clone();\n        long start = System.currentTimeMillis();\n        mergeSort(arr1, 0, arr1.length - 1);\n        long mergeTime = System.currentTimeMillis() - start;\n\n        // Тест insertion sort\n        int[] arr2 = arr.clone();\n        start = System.currentTimeMillis();\n        insertionSort(arr2);\n        long insertTime = System.currentTimeMillis() - start;\n\n        System.out.println("n=" + n + ":");\n        System.out.println("  Merge sort:     " + mergeTime + " мс");\n        System.out.println("  Insertion sort: " + insertTime + " мс");\n        System.out.println("  Merge sort быстрее в " + (insertTime/Math.max(mergeTime,1)) + " раз");\n    }\n\n    static void mergeSort(int[] arr, int l, int r) {\n        if (l >= r) return;\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m+1, r);\n        int[] tmp = new int[r-l+1];\n        int i=l, j=m+1, k=0;\n        while(i<=m && j<=r) tmp[k++] = arr[i]<=arr[j] ? arr[i++] : arr[j++];\n        while(i<=m) tmp[k++]=arr[i++];\n        while(j<=r) tmp[k++]=arr[j++];\n        for(int x=0;x<tmp.length;x++) arr[l+x]=tmp[x];\n    }\n\n    static void insertionSort(int[] arr) {\n        for(int i=1;i<arr.length;i++) {\n            int key=arr[i], j=i-1;\n            while(j>=0 && arr[j]>key){arr[j+1]=arr[j];j--;}\n            arr[j+1]=key;\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        compareAlgorithms();\n        // n=100:     O(n²)=10000,         O(n log n)=664\n        // n=1000:    O(n²)=1000000,       O(n log n)=9965\n        // n=10000:   O(n²)=100000000,     O(n log n)=132877\n        // n=100000:  O(n²)=10000000000,   O(n log n)=1660964\n        // n=1000000: O(n²)=1000000000000, O(n log n)=19931569\n        benchmark();\n    }\n}'
        },
        {
          type: 'note',
          text: 'Характеристики merge sort:\n- Время: O(n log n) всегда (лучший = средний = худший)\n- Память: O(n) дополнительно (для временного буфера)\n- Устойчивость: ДА (порядок равных элементов сохраняется)\n- Параллелизм: легко распараллеливается (подмассивы независимы)\n- Применение: Java Arrays.sort() для объектов использует TimSort — гибрид merge sort и insertion sort'
        }
      ]
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: Подсчёт инверсий с помощью merge sort',
      difficulty: 'hard',
      description: 'Инверсия — это пара индексов (i, j), где i < j, но arr[i] > arr[j]. Другими словами, "неправильно расположенная" пара элементов. Подсчитайте количество инверсий в массиве, используя модифицированную сортировку слиянием.',
      requirements: [
        'Реализуйте метод countInversions(int[] arr), возвращающий количество инверсий',
        'Пример: [2, 4, 1, 3, 5] → инверсии: (2,1), (4,1), (4,3) → ответ 3',
        'Используйте модифицированную сортировку слиянием (не наивный O(n²) алгоритм)',
        'Сложность должна быть O(n log n)'
      ],
      expectedOutput: 'countInversions([2, 4, 1, 3, 5]) = 3\ncountInversions([1, 2, 3, 4, 5]) = 0\ncountInversions([5, 4, 3, 2, 1]) = 10',
      hint: 'Ключевое наблюдение: во время слияния, когда мы берём элемент из правого подмассива вместо левого, это означает, что он образует инверсию с КАЖДЫМ оставшимся элементом левого подмассива. Если в левом осталось (mid - i + 1) элементов — добавляем столько инверсий.',
      solution: 'public class CountInversions {\n\n    public static long countInversions(int[] arr) {\n        int[] temp = arr.clone();\n        return mergeCount(temp, 0, temp.length - 1);\n    }\n\n    private static long mergeCount(int[] arr, int left, int right) {\n        if (left >= right) return 0;\n\n        int mid = left + (right - left) / 2;\n        long count = 0;\n\n        count += mergeCount(arr, left, mid);      // инверсии в левой части\n        count += mergeCount(arr, mid + 1, right); // инверсии в правой части\n        count += merge(arr, left, mid, right);    // инверсии между частями\n\n        return count;\n    }\n\n    private static long merge(int[] arr, int left, int mid, int right) {\n        int[] temp = new int[right - left + 1];\n        int i = left, j = mid + 1, k = 0;\n        long inversions = 0;\n\n        while (i <= mid && j <= right) {\n            if (arr[i] <= arr[j]) {\n                temp[k++] = arr[i++];\n            } else {\n                // arr[j] меньше arr[i..mid] — это (mid - i + 1) инверсий!\n                temp[k++] = arr[j++];\n                inversions += (mid - i + 1);\n            }\n        }\n\n        while (i <= mid)   temp[k++] = arr[i++];\n        while (j <= right) temp[k++] = arr[j++];\n\n        for (int l = 0; l < temp.length; l++) arr[left + l] = temp[l];\n\n        return inversions;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(countInversions(new int[]{2, 4, 1, 3, 5})); // 3\n        System.out.println(countInversions(new int[]{1, 2, 3, 4, 5})); // 0\n        System.out.println(countInversions(new int[]{5, 4, 3, 2, 1})); // 10\n    }\n}',
      explanation: 'Гениальная идея: во время слияния, если мы берём элемент arr[j] из правой части, он меньше всех оставшихся элементов в левой части arr[i..mid]. Значит, каждый из них образует инверсию с arr[j]. Их ровно (mid - i + 1). Суммируя эти подсчёты по всем операциям слияния, мы получаем полное количество инверсий за O(n log n) вместо наивных O(n²).'
    }
  ]
};
