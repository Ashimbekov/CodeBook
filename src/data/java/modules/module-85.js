export default {
  id: 85,
  title: 'Практикум: Bit Manipulation',
  description: 'Практические задачи на битовые операции: XOR, побитовые сдвиги, подсчёт битов, маски и другие трюки с битами.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Single Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'В массиве каждый элемент встречается дважды, кроме одного. Найди этот уникальный элемент. Используй XOR для решения за O(1) памяти.',
      requirements: [
        'Пройди по массиву, применяя XOR ко всем элементам',
        'Свойство XOR: a ^ a = 0, a ^ 0 = a',
        'Результат — единственный уникальный элемент',
        'Решение должно быть O(n) по времени и O(1) по памяти'
      ],
      expectedOutput: 'Массив: [2, 2, 1] → Уникальный: 1\nМассив: [4, 1, 2, 1, 2] → Уникальный: 4',
      hint: 'XOR отменяет парные элементы: 2^2=0, 1^1=0. Что остаётся — то и уникальный элемент. Порядок XOR не важен (коммутативность и ассоциативность).',
      solution: `import java.util.Arrays;

public class Main {
    static int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] arr1 = {2, 2, 1};
        System.out.println("Массив: " + Arrays.toString(arr1) + " → Уникальный: " + singleNumber(arr1));

        int[] arr2 = {4, 1, 2, 1, 2};
        System.out.println("Массив: " + Arrays.toString(arr2) + " → Уникальный: " + singleNumber(arr2));
    }
}`,
      explanation: 'XOR (исключающее ИЛИ) — мощный инструмент. Ключевые свойства: a^a=0 (элемент с самим собой даёт 0), a^0=a (XOR с нулём не меняет), коммутативность и ассоциативность (порядок не важен). Поэтому все парные элементы "уничтожают" друг друга, оставляя только уникальный. Это одна из самых элегантных задач на битовые операции.'
    },
    {
      id: 2,
      title: 'Задача: Number of 1 Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подсчитай количество единичных битов (вес Хэмминга) в бинарном представлении числа.',
      requirements: [
        'Реализуй метод hammingWeight(int n)',
        'Используй трюк n & (n-1) для обнуления последнего единичного бита',
        'Каждая итерация убирает один единичный бит',
        'Также реализуй наивный подход со сдвигом'
      ],
      expectedOutput: 'n=11 (1011): 3 единичных бита\nn=128 (10000000): 1 единичный бит\nn=255 (11111111): 8 единичных бит',
      hint: 'n & (n-1) обнуляет самый правый единичный бит. Например: 1100 & 1011 = 1000. Считай, сколько раз можно это сделать до n=0.',
      solution: `public class Main {
    static int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("n=11 (" + Integer.toBinaryString(11) + "): "
            + hammingWeight(11) + " единичных бита");
        System.out.println("n=128 (" + Integer.toBinaryString(128) + "): "
            + hammingWeight(128) + " единичный бит");
        System.out.println("n=255 (" + Integer.toBinaryString(255) + "): "
            + hammingWeight(255) + " единичных бит");
    }
}`,
      explanation: 'Трюк n & (n-1) — фундаментальная битовая операция. n-1 инвертирует все биты после последней единицы (включая саму единицу). AND с n обнуляет эту последнюю единицу. Пример: 1100 → n-1=1011 → AND=1000. Количество итераций = количество единичных бит. Сложность O(k), где k — число единичных бит (лучше чем O(32) при сдвиге).'
    },
    {
      id: 3,
      title: 'Задача: Power of Two',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, является ли число степенью двойки. Используй битовые операции для O(1) решения.',
      requirements: [
        'Степень двойки имеет ровно один единичный бит: 1, 10, 100, 1000...',
        'Используй трюк: n > 0 && (n & (n-1)) == 0',
        'Обработай крайние случаи: 0 и отрицательные числа',
        'Протестируй на нескольких значениях'
      ],
      expectedOutput: '1 → true\n16 → true\n3 → false\n0 → false\n-16 → false',
      hint: 'Степень двойки в бинарном виде: 1, 10, 100, 1000... Ровно один единичный бит. n & (n-1) обнуляет этот единственный бит → результат 0.',
      solution: `public class Main {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        int[] tests = {1, 16, 3, 0, -16};
        for (int n : tests) {
            System.out.println(n + " → " + isPowerOfTwo(n));
        }
    }
}`,
      explanation: 'Степень двойки в бинарной записи — это число с единственной единицей: 1 (1), 2 (10), 4 (100), 8 (1000) и т.д. Операция n & (n-1) обнуляет последний единичный бит. Если единичный бит один — результат 0. Проверка n > 0 отсекает 0 и отрицательные числа. Это O(1) по времени и памяти — максимально эффективное решение.'
    },
    {
      id: 4,
      title: 'Задача: Reverse Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разверни биты 32-битного беззнакового числа. Бит 0 становится битом 31, бит 1 — битом 30 и т.д.',
      requirements: [
        'Обрабатывай биты по одному, от младшего к старшему',
        'Извлекай последний бит: n & 1',
        'Добавляй его в результат сдвигом: result = (result << 1) | bit',
        'Повтори 32 раза'
      ],
      expectedOutput: 'n = 43261596\nБинарно: 00000010100101000001111010011100\nРеверс:  00111001011110000010100101000000\nРезультат: 964176192',
      hint: 'На каждом шаге: 1) Извлеки последний бит n: bit = n & 1. 2) Сдвинь result влево: result <<= 1. 3) Добавь бит: result |= bit. 4) Сдвинь n вправо: n >>>= 1.',
      solution: `public class Main {
    static int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        int n = 43261596;
        System.out.println("n = " + n);
        System.out.println("Бинарно: " + String.format("%32s", Integer.toBinaryString(n)).replace(' ', '0'));
        int reversed = reverseBits(n);
        System.out.println("Реверс:  " + String.format("%32s", Integer.toBinaryString(reversed)).replace(' ', '0'));
        System.out.println("Результат: " + reversed);
    }
}`,
      explanation: 'Алгоритм проходит по всем 32 битам: извлекает младший бит n (n & 1), добавляет его как старший бит result (сдвиг влево + OR). Используем >>> (беззнаковый сдвиг вправо) для n, чтобы корректно обрабатывать отрицательные числа (знаковый бит не расширяется). За 32 итерации биты полностью разворачиваются.'
    },
    {
      id: 5,
      title: 'Задача: Missing Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив из n различных чисел из диапазона [0, n]. Найди отсутствующее число. Используй XOR или формулу суммы.',
      requirements: [
        'Способ 1: XOR всех чисел 0..n и всех элементов массива',
        'Способ 2: sum(0..n) - sum(array)',
        'Оба способа — O(n) по времени, O(1) по памяти',
        'Протестируй на нескольких примерах'
      ],
      expectedOutput: 'Массив: [3, 0, 1] → Пропущено: 2\nМассив: [9, 6, 4, 2, 3, 5, 7, 0, 1] → Пропущено: 8',
      hint: 'XOR: result = 0. XOR со всеми индексами (0..n) и со всеми значениями. Парные числа отменятся, останется пропущенное.',
      solution: `import java.util.Arrays;

public class Main {
    static int missingNumberXOR(int[] nums) {
        int xor = nums.length;
        for (int i = 0; i < nums.length; i++) {
            xor ^= i ^ nums[i];
        }
        return xor;
    }

    static int missingNumberSum(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) actualSum += num;
        return expectedSum - actualSum;
    }

    public static void main(String[] args) {
        int[] arr1 = {3, 0, 1};
        System.out.println("Массив: " + Arrays.toString(arr1) + " → Пропущено: " + missingNumberXOR(arr1));

        int[] arr2 = {9, 6, 4, 2, 3, 5, 7, 0, 1};
        System.out.println("Массив: " + Arrays.toString(arr2) + " → Пропущено: " + missingNumberSum(arr2));
    }
}`,
      explanation: 'XOR-подход: XOR индексов 0..n с элементами массива. Все присутствующие числа встретятся дважды (как индекс и как значение) и дадут 0. Останется только пропущенное число. Подход через сумму: ожидаемая сумма n*(n+1)/2 минус фактическая сумма = пропущенное число. Оба подхода O(n) по времени, O(1) по памяти.'
    },
    {
      id: 6,
      title: 'Задача: Counting Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Для каждого числа от 0 до n подсчитай количество единичных битов. Верни массив результатов. Используй DP-подход с битовыми операциями.',
      requirements: [
        'dp[i] = dp[i >> 1] + (i & 1) — используй свойство сдвига',
        'Альтернатива: dp[i] = dp[i & (i-1)] + 1',
        'Решение должно быть O(n) по времени',
        'Выведи результат для n = 10'
      ],
      expectedOutput: 'n = 10\nЧисло: 0  1  2  3  4  5  6  7  8  9  10\nБиты:  0  1  1  2  1  2  2  3  1  2  2',
      hint: 'dp[i] = dp[i >> 1] + (i & 1). Объяснение: i >> 1 — число без последнего бита (мы уже знаем ответ). i & 1 — последний бит (0 или 1). Сумма даёт количество единиц.',
      solution: `import java.util.Arrays;

public class Main {
    static int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = dp[i >> 1] + (i & 1);
        }
        return dp;
    }

    public static void main(String[] args) {
        int n = 10;
        int[] result = countBits(n);

        System.out.println("n = " + n);
        StringBuilder nums = new StringBuilder("Число: ");
        StringBuilder bits = new StringBuilder("Биты:  ");
        for (int i = 0; i <= n; i++) {
            nums.append(String.format("%-3d", i));
            bits.append(String.format("%-3d", result[i]));
        }
        System.out.println(nums);
        System.out.println(bits);
    }
}`,
      explanation: 'Гениальная DP-формула: dp[i] = dp[i >> 1] + (i & 1). i >> 1 — это число i без последнего бита, количество единиц в котором мы уже знаем. i & 1 — это значение последнего бита (0 или 1). Пример: для i=6 (110): i>>1=3 (11), dp[3]=2, i&1=0 → dp[6]=2. Сложность O(n) без использования popcount.'
    },
    {
      id: 7,
      title: 'Задача: Hamming Distance',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди расстояние Хэмминга между двумя числами — количество позиций, в которых их биты различаются.',
      requirements: [
        'Вычисли XOR двух чисел — единицы в результате = различающиеся биты',
        'Подсчитай количество единичных бит в XOR',
        'Используй трюк n & (n-1) для подсчёта',
        'Протестируй на нескольких парах'
      ],
      expectedOutput: 'Hamming(1, 4) = 2  (001 vs 100 → XOR: 101)\nHamming(3, 7) = 1  (011 vs 111 → XOR: 100)\nHamming(0, 15) = 4 (0000 vs 1111 → XOR: 1111)',
      hint: 'XOR даёт 1 только там, где биты различаются. Подсчитай единицы в результате XOR — это и есть расстояние Хэмминга.',
      solution: `public class Main {
    static int hammingDistance(int x, int y) {
        int xor = x ^ y;
        int count = 0;
        while (xor != 0) {
            xor &= (xor - 1);
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("Hamming(1, 4) = " + hammingDistance(1, 4)
            + "  (001 vs 100 → XOR: 101)");
        System.out.println("Hamming(3, 7) = " + hammingDistance(3, 7)
            + "  (011 vs 111 → XOR: 100)");
        System.out.println("Hamming(0, 15) = " + hammingDistance(0, 15)
            + " (0000 vs 1111 → XOR: 1111)");
    }
}`,
      explanation: 'Расстояние Хэмминга — фундаментальная метрика в теории информации и кодировании. XOR двух чисел даёт 1 ровно в тех позициях, где биты различаются. Подсчёт единиц в XOR-результате через n&(n-1) даёт ответ за O(k) операций, где k — расстояние Хэмминга. Используется в коррекции ошибок и хешировании.'
    },
    {
      id: 8,
      title: 'Задача: Sum of Two Integers без +',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли сумму двух чисел без использования операторов + и -. Используй только битовые операции.',
      requirements: [
        'XOR даёт сумму без учёта переносов',
        'AND даёт позиции переносов, сдвиг влево переносит их',
        'Повторяй пока carry != 0',
        'Обработай отрицательные числа'
      ],
      expectedOutput: 'getSum(5, 3) = 8\ngetSum(-1, 1) = 0\ngetSum(100, 200) = 300',
      hint: 'sum = a ^ b (сложение без переноса). carry = (a & b) << 1 (перенос). Повторяй: a = sum, b = carry, пока carry != 0.',
      solution: `public class Main {
    static int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println("getSum(5, 3) = " + getSum(5, 3));
        System.out.println("getSum(-1, 1) = " + getSum(-1, 1));
        System.out.println("getSum(100, 200) = " + getSum(100, 200));
    }
}`,
      explanation: 'Битовое сложение имитирует работу полного сумматора в процессоре. XOR (^) выполняет сложение без переноса (0+0=0, 0+1=1, 1+0=1, 1+1=0). AND (&) определяет, где возникают переносы (только при 1+1). Сдвиг влево (<<1) переносит перенос в следующий разряд. Цикл повторяется, пока все переносы не обработаны. Работает и для отрицательных чисел благодаря дополнительному коду.'
    },
    {
      id: 9,
      title: 'Задача: Subsets через битовую маску',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгенерируй все подмножества массива используя битовые маски. Каждое число от 0 до 2^n-1 кодирует одно подмножество.',
      requirements: [
        'Для массива из n элементов есть 2^n подмножеств',
        'Число от 0 до 2^n-1 в бинарном виде показывает, какие элементы включить',
        'Бит i == 1 → включить nums[i]',
        'Проверяй бит: (mask >> i) & 1'
      ],
      expectedOutput: 'Массив: [1, 2, 3]\nВсе подмножества:\n[] [1] [2] [1, 2] [3] [1, 3] [2, 3] [1, 2, 3]',
      hint: 'Перебирай mask от 0 до (1 << n) - 1. Для каждого mask проверяй каждый бит: если (mask >> i) & 1 == 1, добавляй nums[i] в текущее подмножество.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        int total = 1 << n; // 2^n

        for (int mask = 0; mask < total; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) {
                    subset.add(nums[i]);
                }
            }
            result.add(subset);
        }
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println("Массив: [1, 2, 3]");
        System.out.println("Все подмножества:");
        List<List<Integer>> subs = subsets(nums);
        StringBuilder sb = new StringBuilder();
        for (List<Integer> s : subs) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(s);
        }
        System.out.println(sb);
    }
}`,
      explanation: 'Битовые маски — элегантный способ перебора подмножеств. Для n элементов маска — число от 0 до 2^n-1. Каждый бит маски соответствует элементу: 1 — включён, 0 — нет. Пример для [1,2,3]: маска 101 (5) → элементы [1,3]. Маска 000 (0) → пустое множество []. Маска 111 (7) → все элементы [1,2,3]. Сложность O(n * 2^n).'
    },
    {
      id: 10,
      title: 'Задача: Swap without temp',
      type: 'practice',
      difficulty: 'easy',
      description: 'Поменяй местами два числа без использования временной переменной. Используй XOR для элегантного решения.',
      requirements: [
        'Используй три операции XOR: a ^= b; b ^= a; a ^= b;',
        'Объясни, почему это работает',
        'Также покажи способ через арифметику: a += b; b = a - b; a -= b;',
        'Обработай случай a == b (XOR даст 0, но это корректно)'
      ],
      expectedOutput: 'До обмена: a = 5, b = 10\nПосле XOR-обмена: a = 10, b = 5\n\nДо обмена: a = -3, b = 7\nПосле арифметического обмена: a = 7, b = -3',
      hint: 'XOR swap: 1) a ^= b → a содержит XOR обоих. 2) b ^= a → b = b ^ (a^b) = a. 3) a ^= b → a = (a^b) ^ a = b. Готово!',
      solution: `public class Main {
    public static void main(String[] args) {
        // XOR swap
        int a = 5, b = 10;
        System.out.println("До обмена: a = " + a + ", b = " + b);
        a ^= b;
        b ^= a;
        a ^= b;
        System.out.println("После XOR-обмена: a = " + a + ", b = " + b);

        System.out.println();

        // Arithmetic swap
        int x = -3, y = 7;
        System.out.println("До обмена: a = " + x + ", b = " + y);
        x += y;
        y = x - y;
        x -= y;
        System.out.println("После арифметического обмена: a = " + x + ", b = " + y);
    }
}`,
      explanation: 'XOR swap работает благодаря свойствам XOR: ассоциативность (a^(b^c) = (a^b)^c), самообратимость (a^a=0), нейтральность нуля (a^0=a). Шаг 1: a = a^b. Шаг 2: b = b^(a^b) = a. Шаг 3: a = (a^b)^a = b. Арифметический способ аналогичен, но может вызвать переполнение для больших чисел. На практике обычно используют временную переменную — она быстрее на современных процессорах.'
    }
  ]
}
