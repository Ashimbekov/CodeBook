export default {
  id: 23,
  title: 'Жадные алгоритмы',
  description: 'Жадные алгоритмы: принцип локально оптимального выбора, задача об активностях, дробный рюкзак, монеты, кодирование Хаффмана и расписание интервалов',
  lessons: [
    {
      id: 1,
      title: 'Что такое жадный алгоритм?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Жадный алгоритм (Greedy Algorithm) — это подход, при котором на каждом шаге делается локально оптимальный выбор в надежде, что это приведёт к глобально оптимальному результату. Жадный не пересматривает принятые решения.' },
        { type: 'tip', value: 'Жадный алгоритм — как ребёнок на шведском столе: он всегда берёт самое большое пирожное. Это работает, если все пирожные одинаковые по вкусу. Но если маленькое пирожное вкуснее — жадная стратегия подведёт!' },
        { type: 'heading', value: 'Когда жадный алгоритм работает?' },
        { type: 'list', items: [
          'Задача имеет "жадное свойство": локально оптимальный выбор ведёт к глобальному оптимуму',
          'Задача имеет "оптимальную подструктуру": оптимальное решение содержит оптимальные решения подзадач',
          'Нет зависимостей, которые требуют "заглядывания вперёд"'
        ]},
        { type: 'code', language: 'java', value: '// Простой пример: нужно набрать 30 монет минимальным числом купюр\n// Купюры: 10, 5, 2, 1\n// Жадный: всегда берём наибольшую подходящую купюру\n\npublic static int minCoins(int amount, int[] coins) {\n    // Предположим coins отсортированы по убыванию: [10, 5, 2, 1]\n    int count = 0;\n    for (int coin : coins) {\n        while (amount >= coin) {\n            amount -= coin;\n            count++;\n            System.out.println("Берём монету " + coin + ", осталось " + amount);\n        }\n    }\n    return count;\n}\n\n// amount=30, coins=[10,5,2,1]\n// Берём 10: осталось 20\n// Берём 10: осталось 10\n// Берём 10: осталось 0\n// Ответ: 3 монеты (оптимально!)' },
        { type: 'heading', value: 'Когда жадный НЕ работает' },
        { type: 'code', language: 'java', value: '// Монеты: [1, 3, 4], набрать 6\n// Жадный: 4+1+1 = 3 монеты\n// Оптимум: 3+3   = 2 монеты!\n//\n// Жадный выбрал 4 (наибольшая <= 6), потом 1+1\n// Но 3+3 — лучше! Жадный проиграл.\n//\n// Для таких задач нужно ДП:\n// dp[6] = min(dp[6-1]+1, dp[6-3]+1, dp[6-4]+1)\n//       = min(dp[5]+1, dp[3]+1, dp[2]+1)\n//       = min(3, 2, 3) = 2\n\nSystem.out.println("Жадный неверен для монет [1,3,4], сумма 6");\nSystem.out.println("Жадный даёт: 3 монеты (4+1+1)");\nSystem.out.println("Оптимум: 2 монеты (3+3)");' },
        { type: 'warning', value: 'Жадный алгоритм не всегда даёт оптимальный ответ! Перед применением убедись, что задача обладает "жадным свойством". Если не уверен — используй ДП.' }
      ]
    },
    {
      id: 2,
      title: 'Задача об активностях (Activity Selection)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача об активностях: дано N мероприятий с временем начала и конца. Нужно выбрать максимальное число непересекающихся мероприятий (одновременно может проходить только одно).' },
        { type: 'tip', value: 'Ты организатор зала. В один день есть 8 заявок на аренду зала. Каждое мероприятие имеет время начала и конца. Как вместить максимальное число мероприятий? Жадная стратегия: всегда выбирай то, что заканчивается раньше!' },
        { type: 'heading', value: 'Жадная стратегия: сортировка по времени окончания' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\npublic class ActivitySelection {\n    static int[][] activities; // [start, end]\n\n    public static int maxActivities(int[] start, int[] end) {\n        int n = start.length;\n        // Создаём массив мероприятий и сортируем по времени конца\n        Integer[] indices = new Integer[n];\n        for (int i = 0; i < n; i++) indices[i] = i;\n        Arrays.sort(indices, (a, b) -> end[a] - end[b]);\n\n        int count = 1; // Всегда берём первое (с наименьшим конечным временем)\n        int lastEnd = end[indices[0]];\n        System.out.println("Берём активность " + indices[0] +\n            " [" + start[indices[0]] + "-" + end[indices[0]] + "]");\n\n        for (int k = 1; k < n; k++) {\n            int i = indices[k];\n            if (start[i] >= lastEnd) { // Начинается не раньше конца предыдущей\n                count++;\n                lastEnd = end[i];\n                System.out.println("Берём активность " + i +\n                    " [" + start[i] + "-" + end[i] + "]");\n            }\n        }\n        return count;\n    }\n\n    public static void main(String[] args) {\n        int[] s = {1, 3, 0, 5, 8, 5}; // Время начала\n        int[] e = {2, 4, 6, 7, 9, 9}; // Время конца\n        System.out.println("Макс активностей: " + maxActivities(s, e));\n    }\n}' },
        { type: 'heading', value: 'Трассировка алгоритма' },
        { type: 'code', language: 'java', value: '// Мероприятия (start, end):\n// A0: [1,2], A1: [3,4], A2: [0,6], A3: [5,7], A4: [8,9], A5: [5,9]\n//\n// Сортируем по концу:\n// A0[1,2], A1[3,4], A2[0,6], A3[5,7], A4[8,9], A5[5,9]\n//\n// Шаг 1: Берём A0 [1,2], lastEnd=2\n// Шаг 2: A1 [3,4]: start=3 >= lastEnd=2 -> берём! lastEnd=4, count=2\n// Шаг 3: A2 [0,6]: start=0 < lastEnd=4 -> пропускаем\n// Шаг 4: A3 [5,7]: start=5 >= lastEnd=4 -> берём! lastEnd=7, count=3\n// Шаг 5: A4 [8,9]: start=8 >= lastEnd=7 -> берём! lastEnd=9, count=4\n// Шаг 6: A5 [5,9]: start=5 < lastEnd=7 -> пропускаем\n//\n// Результат: 4 мероприятия [A0, A1, A3, A4]' },
        { type: 'note', value: 'Почему жадный работает? Мероприятие с наименьшим временем окончания "освобождает зал" раньше всех — даёт больше шансов добавить следующие. Это доказуемо оптимальная жадная стратегия. Время O(n log n) — из-за сортировки.' }
      ]
    },
    {
      id: 3,
      title: 'Дробный рюкзак (Fractional Knapsack)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дробный рюкзак: те же предметы с весами и ценностями, тот же лимит W. Но теперь можно брать ЧАСТЬ предмета (например, половину предмета = половина ценности). В отличие от 0/1 рюкзака, здесь жадный алгоритм работает!' },
        { type: 'tip', value: 'Ты торговец на рынке. У тебя корзина на 10 кг. Перед тобой мешки с разными товарами: золото (ценное, лёгкое), серебро (средне), медь (дешёвое, тяжёлое). Можно насыпать сколько угодно из каждого мешка. Как набрать самую дорогую корзину? Жадность: сначала насыпь золото!' },
        { type: 'heading', value: 'Стратегия: сортировать по удельной ценности (value/weight)' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\npublic class FractionalKnapsack {\n    static class Item {\n        int weight, value;\n        double ratio; // ценность на единицу веса\n        Item(int w, int v) {\n            this.weight = w;\n            this.value = v;\n            this.ratio = (double) v / w;\n        }\n    }\n\n    public static double fractionalKnapsack(int[] weights, int[] values, int W) {\n        int n = weights.length;\n        Item[] items = new Item[n];\n        for (int i = 0; i < n; i++) items[i] = new Item(weights[i], values[i]);\n\n        // Сортируем по убыванию удельной ценности\n        Arrays.sort(items, (a, b) -> Double.compare(b.ratio, a.ratio));\n\n        double totalValue = 0;\n        int remainingCapacity = W;\n\n        for (Item item : items) {\n            if (remainingCapacity == 0) break;\n            if (item.weight <= remainingCapacity) {\n                // Берём весь предмет\n                totalValue += item.value;\n                remainingCapacity -= item.weight;\n                System.out.printf("Берём ВЕСЬ: вес=%d, цена=%d, ratio=%.2f%n",\n                    item.weight, item.value, item.ratio);\n            } else {\n                // Берём часть предмета\n                double fraction = (double) remainingCapacity / item.weight;\n                totalValue += item.value * fraction;\n                System.out.printf("Берём ЧАСТЬ (%.2f): вес=%d, цена=%d%n",\n                    fraction, item.weight, item.value);\n                remainingCapacity = 0;\n            }\n        }\n        return totalValue;\n    }\n\n    public static void main(String[] args) {\n        int[] w = {10, 20, 30};\n        int[] v = {60, 100, 120};\n        int W = 50;\n        System.out.printf("Макс ценность: %.2f%n", fractionalKnapsack(w, v, W)); // 240.0\n    }\n}' },
        { type: 'heading', value: 'Трассировка' },
        { type: 'code', language: 'java', value: '// weights=[10,20,30], values=[60,100,120], W=50\n//\n// Удельные ценности:\n// Предмет 1: 60/10 = 6.0\n// Предмет 2: 100/20 = 5.0\n// Предмет 3: 120/30 = 4.0\n//\n// Сортировка по ratio: [6.0, 5.0, 4.0] — уже отсортировано\n//\n// Шаг 1: Предмет1 (w=10, v=60), capacity=50\n//   10 <= 50 -> берём всё! totalValue=60, capacity=40\n// Шаг 2: Предмет2 (w=20, v=100), capacity=40\n//   20 <= 40 -> берём всё! totalValue=160, capacity=20\n// Шаг 3: Предмет3 (w=30, v=120), capacity=20\n//   30 > 20 -> берём 20/30 = 2/3 части\n//   totalValue += 120 * (20/30) = 80\n//   totalValue = 240, capacity=0\n//\n// Ответ: 240.0' },
        { type: 'note', value: 'Дробный рюкзак решается жадно за O(n log n). 0/1 рюкзак (без дробления) требует ДП за O(nW). Ключевое отличие: при дроблении мы можем "заполнить" рюкзак точно до краёв.' }
      ]
    },
    {
      id: 4,
      title: 'Монеты: жадный vs ДП',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача о монетах — отличный пример, показывающий разницу между жадным алгоритмом и ДП. Жадный работает для "канонических" систем монет (как реальные деньги), но не для произвольных наборов.' },
        { type: 'tip', value: 'Представь автомат по продаже кофе. Ты вставил 100 тг, кофе стоит 60 тг. Автомат должен дать сдачу 40 тг минимальным числом монет. Если монеты [25, 10, 5, 1] — жадный справится. Но если монеты [1, 3, 4] и нужно 6 — жадный ошибётся!' },
        { type: 'code', language: 'java', value: '// Сравнение жадного и ДП для задачи о монетах\n\n// Жадный алгоритм\npublic static int coinsGreedy(int[] coins, int amount) {\n    // coins должен быть отсортирован по убыванию!\n    int count = 0;\n    for (int coin : coins) {\n        int num = amount / coin;\n        count += num;\n        amount -= num * coin;\n        if (num > 0) System.out.println("Монета " + coin + " x" + num);\n    }\n    return amount == 0 ? count : -1; // -1 если не смогли набрать\n}\n\n// ДП-решение (всегда оптимально)\npublic static int coinChangeDP(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1); // "Бесконечность"\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (coin <= i) {\n                dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n\npublic static void main(String[] args) {\n    // Канонические монеты — жадный работает\n    int[] canonical = {25, 10, 5, 1};\n    System.out.println("Жадный [25,10,5,1], сумма=41: " + coinsGreedy(canonical, 41)); // 4\n    System.out.println("ДП [25,10,5,1], сумма=41: " + coinChangeDP(canonical, 41)); // 4\n\n    // Неканонические монеты — жадный ОШИБАЕТСЯ\n    int[] tricky = {4, 3, 1};\n    System.out.println("Жадный [4,3,1], сумма=6: " + coinsGreedy(tricky, 6)); // 3 (4+1+1)\n    System.out.println("ДП [4,3,1], сумма=6: " + coinChangeDP(tricky, 6)); // 2 (3+3)\n}' },
        { type: 'heading', value: 'Трассировка ДП для [1,3,4], сумма=6' },
        { type: 'code', language: 'java', value: '// coins = [1, 3, 4], amount = 6\n//\n// dp = [0, INF, INF, INF, INF, INF, INF]\n//\n// i=1: coin=1: dp[1]=min(INF, dp[0]+1)=1\n// i=2: coin=1: dp[2]=min(INF, dp[1]+1)=2\n// i=3: coin=1: dp[3]=min(INF, dp[2]+1)=3\n//       coin=3: dp[3]=min(3, dp[0]+1)=1 <- лучше!\n// i=4: coin=1: dp[4]=min(INF, dp[3]+1)=2\n//       coin=3: dp[4]=min(2, dp[1]+1)=2 (одинаково)\n//       coin=4: dp[4]=min(2, dp[0]+1)=1 <- лучше!\n// i=5: coin=1: dp[5]=min(INF, dp[4]+1)=2\n//       coin=3: dp[5]=min(2, dp[2]+1)=2+1=3, нет, min(2,3)=2\n//       coin=4: dp[5]=min(2, dp[1]+1)=2\n// i=6: coin=1: dp[6]=min(INF, dp[5]+1)=3\n//       coin=3: dp[6]=min(3, dp[3]+1)=2 <- лучше!\n//       coin=4: dp[6]=min(2, dp[2]+1)=2+1=3, min(2,3)=2\n//\n// dp = [0, 1, 2, 1, 1, 2, 2]\n// Ответ: 2 монеты (3+3)' },
        { type: 'warning', value: 'Никогда не применяй жадный алгоритм к задаче о монетах без проверки. Для реальных валют (1,2,5,10,25,50,100) жадный работает. Для произвольных — только ДП даёт гарантированно правильный ответ.' }
      ]
    },
    {
      id: 5,
      title: 'Идея кодирования Хаффмана',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кодирование Хаффмана — жадный алгоритм сжатия данных. Часто встречающимся символам присваиваются короткие коды, редким — длинные. Используется в форматах ZIP, JPEG, MP3.' },
        { type: 'tip', value: 'Представь азбуку Морзе. Буква E (самая частая в английском) — одна точка. Q (редкая) — четыре символа. Хаффман делает то же самое: частым буквам — короткий код, редким — длинный. Текст занимает меньше места!' },
        { type: 'heading', value: 'Алгоритм Хаффмана' },
        { type: 'list', items: [
          'Подсчитать частоту каждого символа',
          'Создать листовые узлы для каждого символа',
          'Взять два узла с наименьшей частотой',
          'Создать новый узел с суммой частот',
          'Повторять до одного корневого узла',
          'Левый путь = 0, правый путь = 1'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.PriorityQueue;\n\npublic class Huffman {\n    static class Node {\n        char ch;\n        int freq;\n        Node left, right;\n        Node(char ch, int freq) { this.ch = ch; this.freq = freq; }\n        Node(int freq, Node l, Node r) {\n            this.ch = \'\\0\'; this.freq = freq; left = l; right = r;\n        }\n    }\n\n    public static Node buildTree(char[] chars, int[] freqs) {\n        PriorityQueue<Node> pq = new PriorityQueue<>(\n            (a, b) -> a.freq - b.freq\n        );\n        for (int i = 0; i < chars.length; i++)\n            pq.add(new Node(chars[i], freqs[i]));\n\n        while (pq.size() > 1) {\n            Node left  = pq.poll(); // Наименьшая частота\n            Node right = pq.poll(); // Вторая наименьшая\n            Node parent = new Node(left.freq + right.freq, left, right);\n            System.out.println("Объединяем " + left.ch + "(" + left.freq + ") + " +\n                right.ch + "(" + right.freq + ") = " + parent.freq);\n            pq.add(parent);\n        }\n        return pq.poll(); // Корень дерева\n    }\n\n    public static void printCodes(Node root, String code) {\n        if (root == null) return;\n        if (root.left == null && root.right == null) {\n            System.out.println(root.ch + ": " + code);\n            return;\n        }\n        printCodes(root.left, code + "0");\n        printCodes(root.right, code + "1");\n    }\n\n    public static void main(String[] args) {\n        char[]  chars = {\'a\', \'b\', \'c\', \'d\', \'e\', \'f\'};\n        int[] freqs   = {  5,   9,  12,  13,  16,  45};\n        Node root = buildTree(chars, freqs);\n        System.out.println("\\nКоды Хаффмана:");\n        printCodes(root, "");\n    }\n}' },
        { type: 'code', language: 'java', value: '// Дерево Хаффмана для a(5),b(9),c(12),d(13),e(16),f(45):\n//\n//           100\n//          /    \\\n//         f     55\n//        (45)  /   \\\n//            30    25\n//           /  \\  /  \\\n//          14  16 c   d\n//         /  \\ (e)(12)(13)\n//        a    b\n//       (5)  (9)\n//\n// Коды:\n// f: 0      (1 бит, частота 45)\n// c: 100    (3 бита, частота 12)\n// d: 101    (3 бита, частота 13)\n// e: 111    (3 бита, частота 16)\n// a: 1100   (4 бита, частота 5)\n// b: 1101   (4 бита, частота 9)\n//\n// Частый символ f получил короткий код 0\n// Редкий символ a получил длинный код 1100' },
        { type: 'note', value: 'Хаффман гарантированно оптимален среди алгоритмов, основанных на фиксированных кодах для каждого символа. Жадное свойство: объединение двух наименее частых узлов всегда оптимально.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Задача об активностях и дробный рюкзак',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй задачу о выборе максимального числа непересекающихся активностей и дробный рюкзак.',
      requirements: [
        'Метод maxActivities(int[] start, int[] end): возвращает список выбранных индексов',
        'Метод fractionalKnapsack(int[] weights, int[] values, int W): возвращает максимальную ценность',
        'Для активностей вывести все выбранные мероприятия с временем',
        'Для рюкзака вывести что берётся полностью, что частично',
        'Тест активностей: s=[1,3,0,5,8,5], e=[2,4,6,7,9,9]',
        'Тест рюкзака: w=[10,20,30], v=[60,100,120], W=50'
      ],
      expectedOutput: 'Выбранные активности:\n  Активность 0: [1-2]\n  Активность 1: [3-4]\n  Активность 3: [5-7]\n  Активность 4: [8-9]\nВсего: 4\nДробный рюкзак (W=50):\n  Берём ВЕСЬ предмет 0: вес=10, цена=60\n  Берём ВЕСЬ предмет 1: вес=20, цена=100\n  Берём 0.67 предмета 2: вес=30, цена=120\nМакс ценность: 240.00',
      hint: 'Для активностей: создай массив индексов, отсортируй по end[i], затем жадно выбирай. Для рюкзака: создай массив (вес, ценность, исходный индекс), отсортируй по ratio=v/w по убыванию.',
      solution: 'import java.util.*;\n\npublic class GreedyProblems {\n    public static List<Integer> maxActivities(int[] start, int[] end) {\n        int n = start.length;\n        Integer[] idx = new Integer[n];\n        for (int i = 0; i < n; i++) idx[i] = i;\n        Arrays.sort(idx, (a, b) -> end[a] - end[b]);\n\n        List<Integer> result = new ArrayList<>();\n        result.add(idx[0]);\n        int lastEnd = end[idx[0]];\n\n        for (int k = 1; k < n; k++) {\n            int i = idx[k];\n            if (start[i] >= lastEnd) {\n                result.add(i);\n                lastEnd = end[i];\n            }\n        }\n        return result;\n    }\n\n    public static double fractionalKnapsack(int[] weights, int[] values, int W) {\n        int n = weights.length;\n        Integer[] idx = new Integer[n];\n        for (int i = 0; i < n; i++) idx[i] = i;\n        Arrays.sort(idx, (a, b) -> Double.compare(\n            (double) values[b] / weights[b], (double) values[a] / weights[a]\n        ));\n\n        double total = 0;\n        int cap = W;\n        for (int k = 0; k < n && cap > 0; k++) {\n            int i = idx[k];\n            if (weights[i] <= cap) {\n                total += values[i];\n                cap -= weights[i];\n                System.out.printf("  Берём ВЕСЬ предмет %d: вес=%d, цена=%d%n", i, weights[i], values[i]);\n            } else {\n                double frac = (double) cap / weights[i];\n                total += values[i] * frac;\n                System.out.printf("  Берём %.2f предмета %d: вес=%d, цена=%d%n", frac, i, weights[i], values[i]);\n                cap = 0;\n            }\n        }\n        return total;\n    }\n\n    public static void main(String[] args) {\n        int[] s = {1, 3, 0, 5, 8, 5};\n        int[] e = {2, 4, 6, 7, 9, 9};\n        List<Integer> acts = maxActivities(s, e);\n        System.out.println("Выбранные активности:");\n        for (int i : acts) System.out.printf("  Активность %d: [%d-%d]%n", i, s[i], e[i]);\n        System.out.println("Всего: " + acts.size());\n\n        int[] w = {10, 20, 30};\n        int[] v = {60, 100, 120};\n        System.out.println("Дробный рюкзак (W=50):");\n        System.out.printf("Макс ценность: %.2f%n", fractionalKnapsack(w, v, 50));\n    }\n}',
      explanation: 'Activity Selection демонстрирует ключевое жадное свойство: выбор мероприятия с наименьшим временем окончания никогда не хуже любого другого выбора. Дробный рюкзак: удельная ценность (v/w) — правильный критерий жадного выбора, так как позволяет "заполнить" рюкзак с максимальной эффективностью.'
    },
    {
      id: 7,
      title: 'Практика: Когда жадный работает, когда нет',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сравни результаты жадного алгоритма и ДП на задаче о монетах для разных наборов.',
      requirements: [
        'Метод coinsGreedy(int[] coins, int amount): жадный (coins отсортированы по убыванию)',
        'Метод coinsDP(int[] coins, int amount): оптимальное ДП-решение',
        'Сравнить результаты для трёх наборов монет',
        'Набор 1: [25,10,5,1], сумма 41 (жадный = ДП)',
        'Набор 2: [4,3,1], сумма 6 (жадный хуже ДП)',
        'Набор 3: [10,6,1], сумма 12 (жадный хуже ДП)'
      ],
      expectedOutput: 'Монеты [25,10,5,1], сумма=41:\n  Жадный: 4 монеты (25+10+5+1)\n  ДП: 4 монеты\n  Совпадают!\nМонеты [4,3,1], сумма=6:\n  Жадный: 3 монеты (4+1+1)\n  ДП: 2 монеты (3+3)\n  Жадный хуже!\nМонеты [10,6,1], сумма=12:\n  Жадный: 3 монеты (10+1+1)\n  ДП: 2 монеты (6+6)\n  Жадный хуже!',
      hint: 'В жадном: перебирай монеты от большей к меньшей, бери amount/coin штук. В ДП: dp[i] = min монет для суммы i, dp[0]=0, остальные INF, для каждой монеты обновляй dp[i]=min(dp[i], dp[i-coin]+1).',
      solution: 'import java.util.Arrays;\n\npublic class CoinsComparison {\n    public static int coinsGreedy(int[] coins, int amount) {\n        int count = 0;\n        StringBuilder sb = new StringBuilder("(");\n        for (int coin : coins) {\n            int num = amount / coin;\n            if (num > 0) {\n                count += num;\n                amount -= num * coin;\n                for (int k = 0; k < num; k++) sb.append(coin).append("+");\n            }\n        }\n        if (sb.length() > 1) sb.deleteCharAt(sb.length() - 1);\n        sb.append(")");\n        System.out.println("  Жадный: " + count + " монеты " + sb);\n        return amount == 0 ? count : -1;\n    }\n\n    public static int coinsDP(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++)\n            for (int coin : coins)\n                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n        int result = dp[amount] > amount ? -1 : dp[amount];\n        System.out.println("  ДП: " + result + " монеты");\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Монеты [25,10,5,1], сумма=41:");\n        int g1 = coinsGreedy(new int[]{25,10,5,1}, 41);\n        int d1 = coinsDP(new int[]{25,10,5,1}, 41);\n        System.out.println(g1 == d1 ? "  Совпадают!" : "  Жадный хуже!");\n\n        System.out.println("Монеты [4,3,1], сумма=6:");\n        int g2 = coinsGreedy(new int[]{4,3,1}, 6);\n        int d2 = coinsDP(new int[]{4,3,1}, 6);\n        System.out.println(g2 == d2 ? "  Совпадают!" : "  Жадный хуже!");\n\n        System.out.println("Монеты [10,6,1], сумма=12:");\n        int g3 = coinsGreedy(new int[]{10,6,1}, 12);\n        int d3 = coinsDP(new int[]{10,6,1}, 12);\n        System.out.println(g3 == d3 ? "  Совпадают!" : "  Жадный хуже!");\n    }\n}',
      explanation: 'Жадный алгоритм для монет работает только для канонических систем монет (где больший номинал всегда кратен меньшему или построен по специальным правилам). Когда это свойство нарушено (как в [4,3,1] или [10,6,1]), жадный берёт "слишком большую" монету и тратит много мелких. ДП рассматривает все варианты и гарантированно находит оптимум.'
    }
  ]
}
