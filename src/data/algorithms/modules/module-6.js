export default {
  id: 6,
  title: 'Быстрая сортировка (Quick Sort)',
  description: 'Один из самых быстрых алгоритмов сортировки на практике. Разбираем идею разбиения, выбор опорного элемента и анализируем сложность',
  lessons: [
    {
      id: 1,
      title: 'Идея разбиения (partition)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представь, что тебе нужно навести порядок в классе. Учитель встаёт посередине и говорит: "Все, кто ниже меня ростом — идите влево, кто выше — вправо!" Учитель — это опорный элемент (pivot). Вот и вся идея быстрой сортировки!' },
        { type: 'tip', value: 'Ключевая операция Quick Sort называется partition (разбиение). Мы берём один элемент (pivot), и перемещаем все меньшие элементы левее него, а все большие — правее. После этого pivot стоит на своём окончательном месте!' },
        { type: 'heading', value: 'Как работает разбиение — пример' },
        { type: 'text', value: 'Массив: [3, 6, 8, 10, 1, 2, 1]. Выбираем pivot = 1 (последний элемент). Проходим по массиву и: элементы <= 1 идут влево от 1, элементы > 1 идут вправо. Результат: [1, 1, 3, 6, 8, 10, 2]... и так рекурсивно.' },
        { type: 'heading', value: 'Аналогия с библиотекой' },
        { type: 'text', value: 'Представь, что ты расставляешь книги по алфавиту. Берёшь одну книгу ("М") и делишь стопку: все книги до "М" — влево, все после — вправо. Потом рекурсивно делаешь то же самое с левой и правой кучками.' },
        { type: 'note', value: 'После каждого разбиения опорный элемент оказывается ТОЧНО на своём финальном месте. Мы больше никогда его не трогаем. Это и есть магия partition!' },
        { type: 'heading', value: 'Визуализация шагов partition' },
        { type: 'code', language: 'java', value: '// Массив: [5, 3, 8, 1, 9, 2], pivot = 2 (последний)\n// i = -1 (граница малых элементов)\n// j проходит от 0 до length-2\n\n// j=0: arr[0]=5 > pivot=2  -> ничего не делаем\n// j=1: arr[1]=3 > pivot=2  -> ничего не делаем\n// j=2: arr[2]=8 > pivot=2  -> ничего не делаем\n// j=3: arr[3]=1 <= pivot=2 -> i++, swap(arr[0], arr[3])\n//   Массив теперь: [1, 3, 8, 5, 9, 2], i=0\n// j=4: arr[4]=9 > pivot=2  -> ничего не делаем\n// Финал: меняем pivot (arr[5]) с arr[i+1] (arr[1])\n//   Массив: [1, 2, 8, 5, 9, 3]\n//             ^\n//         pivot на месте! Слева 1 < 2, справа 8,5,9,3 > 2' }
      ]
    },
    {
      id: 2,
      title: 'Выбор опорного элемента (pivot)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор pivot — это как выбор "разделяющей линии" при дележе территории. От этого выбора зависит, насколько равномерно мы поделим массив. Идеально — делить пополам каждый раз.' },
        { type: 'heading', value: 'Стратегии выбора pivot' },
        { type: 'list', value: ['Последний элемент — просто, но плохо работает на отсортированных массивах', 'Первый элемент — аналогично', 'Средний элемент — лучше, меньше шансов на худший случай', 'Случайный элемент — хорошая защита от специальных входных данных', 'Медиана трёх — берём первый, средний, последний и выбираем медиану'] },
        { type: 'heading', value: 'Почему выбор pivot важен?' },
        { type: 'code', language: 'java', value: '// ПЛОХОЙ выбор: pivot = последний, массив уже отсортирован\n// [1, 2, 3, 4, 5] -> pivot = 5\n// Левая часть: [1, 2, 3, 4] (4 элемента)\n// Правая часть: [] (0 элементов)\n// Следующий pivot = 4, левая: [1,2,3], правая: []\n// Это O(n^2)! Худший случай!\n\n// ХОРОШИЙ выбор: pivot = средний элемент\n// [1, 2, 3, 4, 5] -> pivot = 3 (индекс 2)\n// Левая часть: [1, 2] (2 элемента)\n// Правая часть: [4, 5] (2 элемента)\n// Делим почти пополам — это O(n log n)!' },
        { type: 'heading', value: 'Медиана трёх — надёжный выбор' },
        { type: 'code', language: 'java', value: 'static int medianOfThree(int[] arr, int low, int high) {\n    int mid = low + (high - low) / 2;\n    // Находим медиану из arr[low], arr[mid], arr[high]\n    if (arr[low] > arr[mid]) swap(arr, low, mid);\n    if (arr[low] > arr[high]) swap(arr, low, high);\n    if (arr[mid] > arr[high]) swap(arr, mid, high);\n    // arr[mid] — медиана. Ставим её предпоследней\n    swap(arr, mid, high - 1);\n    return arr[high - 1];\n}' },
        { type: 'tip', value: 'В учебных примерах обычно берут последний элемент как pivot — это просто. В реальных проектах используют случайный выбор или медиану трёх. Java\'s Arrays.sort() использует "dual-pivot quicksort" — ещё умнее!' }
      ]
    },
    {
      id: 3,
      title: 'Схема разбиения Ломуто',
      type: 'theory',
      content: [
        { type: 'text', value: 'Схема Ломуто — самая простая и понятная реализация partition. Названа по имени Нико Ломуто. Идея: используем два указателя i и j. i — граница "малых" элементов, j — текущий просматриваемый элемент.' },
        { type: 'heading', value: 'Реализация partition по Ломуто' },
        { type: 'code', language: 'java', value: 'static int partition(int[] arr, int low, int high) {\n    int pivot = arr[high];  // Берём последний элемент как pivot\n    int i = low - 1;        // i — правая граница "малых" элементов\n\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;                        // Расширяем зону малых\n            int temp = arr[i];          // Меняем местами\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n\n    // Ставим pivot на своё место\n    int temp = arr[i + 1];\n    arr[i + 1] = arr[high];\n    arr[high] = temp;\n\n    return i + 1;  // Возвращаем индекс pivot\n}' },
        { type: 'heading', value: 'Пошаговый разбор' },
        { type: 'code', language: 'java', value: '// Массив: [10, 80, 30, 90, 40, 50, 70], pivot = 70 (last)\n// i = -1\n\n// j=0: arr[0]=10 <= 70 -> i=0, swap(arr[0], arr[0]) -> [10, 80, 30, 90, 40, 50, 70]\n// j=1: arr[1]=80 > 70  -> ничего\n// j=2: arr[2]=30 <= 70 -> i=1, swap(arr[1], arr[2]) -> [10, 30, 80, 90, 40, 50, 70]\n// j=3: arr[3]=90 > 70  -> ничего\n// j=4: arr[4]=40 <= 70 -> i=2, swap(arr[2], arr[4]) -> [10, 30, 40, 90, 80, 50, 70]\n// j=5: arr[5]=50 <= 70 -> i=3, swap(arr[3], arr[5]) -> [10, 30, 40, 50, 80, 90, 70]\n\n// Финал: swap(arr[i+1], arr[high]) = swap(arr[4], arr[6])\n// Результат: [10, 30, 40, 50, 70, 90, 80]\n//                         ^^ pivot на своём месте (индекс 4)' },
        { type: 'note', value: 'После partition: все элементы левее индекса 4 меньше 70, все правее — больше. Теперь рекурсивно сортируем [10,30,40,50] и [90,80] отдельно.' },
        { type: 'warning', value: 'Схема Ломуто делает больше перестановок, чем схема Хоара (оригинальная). Но она намного проще для понимания и реализации, поэтому мы начинаем с неё.' }
      ]
    },
    {
      id: 4,
      title: 'Полная реализация Quick Sort на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Теперь собираем всё вместе! Quick Sort — это рекурсивный алгоритм: разбиваем массив, потом рекурсивно сортируем левую и правую части. Это как "разделяй и властвуй".' },
        { type: 'heading', value: 'Полная реализация' },
        { type: 'code', language: 'java', value: 'public class QuickSort {\n\n    // Главная функция сортировки\n    static void quickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            // Разбиваем массив и получаем позицию pivot\n            int pivotIndex = partition(arr, low, high);\n\n            // Рекурсивно сортируем левую часть (до pivot)\n            quickSort(arr, low, pivotIndex - 1);\n\n            // Рекурсивно сортируем правую часть (после pivot)\n            quickSort(arr, pivotIndex + 1, high);\n        }\n    }\n\n    // Разбиение по схеме Ломуто\n    static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low - 1;\n\n        for (int j = low; j < high; j++) {\n            if (arr[j] <= pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n\n        return i + 1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {10, 7, 8, 9, 1, 5};\n        System.out.println("До сортировки:");\n        for (int x : arr) System.out.print(x + " ");\n\n        quickSort(arr, 0, arr.length - 1);\n\n        System.out.println("\\nПосле сортировки:");\n        for (int x : arr) System.out.print(x + " ");\n        // Вывод: 1 5 7 8 9 10\n    }\n}' },
        { type: 'heading', value: 'Дерево рекурсии для [5, 3, 1, 4, 2]' },
        { type: 'code', language: 'java', value: '// quickSort([5, 3, 1, 4, 2], 0, 4)\n//   pivot = 2, после partition: [1, 2, 5, 4, 3], pivotIndex = 1\n//   |\n//   +-- quickSort([1], 0, 0) -> base case, уже отсортировано\n//   |\n//   +-- quickSort([5, 4, 3], 2, 4)\n//         pivot = 3, после partition: [_, _, 3, 5, 4], pivotIndex = 2+нет\n//         Нет, давайте точнее:\n//         [5,4,3] -> pivot=3, partition: [3, 5, 4] wrong order...\n//         Нет, [5,4,3]: pivot=arr[4]=3\n//           j=2: arr[2]=5 > 3 -> ничего\n//           j=3: arr[3]=4 > 3 -> ничего\n//           swap arr[i+1]=arr[2] с arr[4]=3 -> [3, 4, 5] (в подмассиве)\n//           pivotIndex = 2\n//         +-- quickSort([пусто], 2, 1) -> base case\n//         +-- quickSort([4, 5], 3, 4)\n//               pivot=5, partition: 4<=5 -> i=3, swap\n//               swap arr[4] с arr[4] -> [4,5]\n//               Итог: [4, 5] готово\n// Финальный массив: [1, 2, 3, 4, 5]' },
        { type: 'tip', value: 'Базовый случай рекурсии — когда low >= high. Это означает, что подмассив содержит 0 или 1 элемент и уже "отсортирован".' }
      ]
    },
    {
      id: 5,
      title: 'Пошаговая трассировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Давай разберём Quick Sort очень детально на маленьком массиве [3, 1, 4, 2]. Следим за каждым вызовом функции.' },
        { type: 'heading', value: 'Трассировка [3, 1, 4, 2]' },
        { type: 'code', language: 'java', value: '// ============= Шаг 1 =============\n// quickSort([3, 1, 4, 2], low=0, high=3)\n// pivot = arr[3] = 2\n// i = -1\n//\n// j=0: arr[0]=3 > 2 -> ничего не делаем\n// j=1: arr[1]=1 <= 2 -> i=0, swap(arr[0], arr[1]): [1, 3, 4, 2]\n// j=2: arr[2]=4 > 2 -> ничего не делаем\n// swap(arr[i+1], arr[high]) = swap(arr[1], arr[3]): [1, 2, 4, 3]\n// pivotIndex = 1. Pivot=2 на месте!\n//\n// ============= Шаг 2 =============\n// quickSort([1], low=0, high=0)\n// low == high -> возвращаемся (base case)\n//\n// ============= Шаг 3 =============\n// quickSort([4, 3], low=2, high=3)\n// pivot = arr[3] = 3\n// i = 1 (low-1 = 2-1)\n//\n// j=2: arr[2]=4 > 3 -> ничего\n// swap(arr[i+1], arr[high]) = swap(arr[2], arr[3]): меняем 4 и 3 -> [3, 4]\n// pivotIndex = 2\n//\n// ============= Шаг 4 =============\n// quickSort([], low=2, high=1) -> base case (low > high)\n// quickSort([4], low=3, high=3) -> base case\n//\n// ============= Итог =============\n// Массив: [1, 2, 3, 4] - отсортировано!' },
        { type: 'heading', value: 'Дерево вызовов' },
        { type: 'code', language: 'java', value: '//            quickSort(0,3) -> pivot=2, pivotIdx=1\n//           /                        \\\n//    quickSort(0,0)          quickSort(2,3) -> pivot=3, pivotIdx=2\n//    [уже готово]           /                        \\\n//                    quickSort(2,1)         quickSort(3,3)\n//                    [low>high, стоп]       [уже готово]' },
        { type: 'note', value: 'Каждый раз pivot занимает своё окончательное место. Количество уровней рекурсии зависит от качества выбора pivot. В идеале — log(n) уровней.' }
      ]
    },
    {
      id: 6,
      title: 'Сложность: лучший, средний, худший случай',
      type: 'theory',
      content: [
        { type: 'text', value: 'Quick Sort — особенный алгоритм, потому что его скорость сильно зависит от входных данных. Давай разберём три сценария.' },
        { type: 'heading', value: 'Лучший случай — O(n log n)' },
        { type: 'code', language: 'java', value: '// Pivot всегда делит массив РОВНО пополам\n// Например: [4, 2, 6, 1, 3, 5, 7], pivot = 4 (медиана)\n// Уровень 1: один вызов на 7 элементах  -> 7 операций\n// Уровень 2: два вызова на 3 элементах  -> 6 операций\n// Уровень 3: четыре вызова на 1 элементе -> 4 операции\n// Итого: ~7+6+4 = O(n log n)\n//\n// log2(7) ≈ 3 уровня рекурсии\n// Как башня из log(n) этажей, каждый этаж — n работы' },
        { type: 'heading', value: 'Средний случай — O(n log n)' },
        { type: 'text', value: 'На случайных данных Quick Sort ведёт себя близко к лучшему случаю. Математически доказано, что среднее ожидаемое время — O(n log n). Поэтому на практике Quick Sort обычно быстрее Merge Sort, несмотря на одинаковую асимптотику.' },
        { type: 'heading', value: 'Худший случай — O(n²)' },
        { type: 'code', language: 'java', value: '// Массив уже отсортирован: [1, 2, 3, 4, 5]\n// Pivot = последний элемент = 5\n// После partition: [] и [1,2,3,4] — крайне неравный раздел!\n//\n// Уровень 1: вызов на 5 элементах -> 5 сравнений\n// Уровень 2: вызов на 4 элементах -> 4 сравнения\n// Уровень 3: вызов на 3 элементах -> 3 сравнения\n// ...\n// Итого: 5+4+3+2+1 = 15 = n*(n-1)/2 = O(n^2)\n//\n// Как чистить луковицу по одному слою — очень долго!' },
        { type: 'heading', value: 'Память — O(log n) в среднем' },
        { type: 'code', language: 'java', value: '// Quick Sort сортирует "на месте" — доп. память для данных не нужна!\n// Но стек рекурсии занимает O(log n) памяти в среднем\n// (в худшем случае — O(n), при сильно несбалансированном дереве)\n//\n// Для сравнения: Merge Sort требует O(n) доп. памяти\n// Quick Sort экономнее!' },
        { type: 'list', value: ['Лучший случай: O(n log n) — идеальный pivot', 'Средний случай: O(n log n) — случайные данные', 'Худший случай: O(n²) — уже отсортированный/обратный массив', 'Память: O(log n) — только стек рекурсии', 'Стабильность: НЕ стабильный — одинаковые элементы могут поменяться местами'] }
      ]
    },
    {
      id: 7,
      title: 'Практика: Реализуй Quick Sort',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полный алгоритм быстрой сортировки с нуля. Функция partition должна использовать схему Ломуто. Отсортируй массив [64, 34, 25, 12, 22, 11, 90] и выведи результат.',
      requirements: [
        'Реализуй метод partition(int[] arr, int low, int high) — схема Ломуто, pivot = arr[high]',
        'Реализуй метод quickSort(int[] arr, int low, int high) с рекурсией',
        'В main создай массив int[] arr = {64, 34, 25, 12, 22, 11, 90}',
        'Выведи массив до сортировки',
        'Отсортируй и выведи после сортировки',
        'Также выведи количество элементов'
      ],
      expectedOutput: 'До: 64 34 25 12 22 11 90 \nПосле: 11 12 22 25 34 64 90 \nКоличество элементов: 7',
      hint: 'В partition: i = low-1, пробегай j от low до high-1. Если arr[j] <= pivot — увеличь i и поменяй arr[i] с arr[j]. В конце поменяй arr[i+1] с arr[high] и верни i+1.',
      solution: 'public class Main {\n\n    static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low - 1;\n\n        for (int j = low; j < high; j++) {\n            if (arr[j] <= pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp;\n\n        return i + 1;\n    }\n\n    static void quickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pivotIndex = partition(arr, low, high);\n            quickSort(arr, low, pivotIndex - 1);\n            quickSort(arr, pivotIndex + 1, high);\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {64, 34, 25, 12, 22, 11, 90};\n\n        System.out.print("До: ");\n        for (int x : arr) System.out.print(x + " ");\n        System.out.println();\n\n        quickSort(arr, 0, arr.length - 1);\n\n        System.out.print("После: ");\n        for (int x : arr) System.out.print(x + " ");\n        System.out.println();\n\n        System.out.println("Количество элементов: " + arr.length);\n    }\n}',
      explanation: 'partition — сердце алгоритма. Переменная i следит за правой границей "зоны малых элементов". Когда находим элемент <= pivot, расширяем зону (i++) и помещаем элемент туда (swap). В конце pivot встаёт на позицию i+1 — это его финальное место. quickSort рекурсивно обрабатывает левую и правую части.'
    }
  ]
}
