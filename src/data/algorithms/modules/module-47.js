export default {
  id: 47,
  title: 'Практикум: Bit Manipulation',
  description: 'Битовые операции: XOR, подсчёт бит, разворот бит, пропущенное число, сумма без арифметики, степень двойки, расстояние Хэмминга, подмножества через маски.',
  lessons: [
    {
      id: 1,
      title: 'Single Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив, в котором каждое число встречается дважды, кроме одного. Найди это уникальное число. Реши за O(n) времени и O(1) памяти.',
      requirements: [
        'Метод int singleNumber(int[] nums)',
        'Используй XOR: a ^ a = 0, a ^ 0 = a',
        'XOR всех элементов даст уникальное число',
        'Пример: [2,2,1] → 1',
        'Пример: [4,1,2,1,2] → 4',
        'Пример: [1] → 1'
      ],
      expectedOutput: '[2,2,1] → 1\n[4,1,2,1,2] → 4\n[1] → 1',
      hint: 'XOR обладает свойствами: коммутативность (a^b = b^a), ассоциативность ((a^b)^c = a^(b^c)), самообратность (a^a = 0). Поэтому все пары "уничтожаются", остаётся уникальный.',
      solution: `public class Main {
    static int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num; // XOR: пары обнуляются
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("[2,2,1] → " + singleNumber(new int[]{2,2,1}));
        System.out.println("[4,1,2,1,2] → " + singleNumber(new int[]{4,1,2,1,2}));
        System.out.println("[1] → " + singleNumber(new int[]{1}));
    }
}`,
      explanation: 'XOR всех элементов: пары дают 0 (a ^ a = 0), а 0 ^ unique = unique. Одно из самых элегантных решений: O(n) время, O(1) память, без дополнительных структур.'
    },
    {
      id: 2,
      title: 'Number of 1 Bits (Hamming Weight)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано беззнаковое целое число. Верни количество единичных бит (вес Хэмминга).',
      requirements: [
        'Метод int hammingWeight(int n)',
        'Способ 1: n & (n-1) убирает младший единичный бит',
        'Способ 2: проверяй n & 1, сдвигай n >>> 1',
        'Пример: 11 (1011) → 3',
        'Пример: 128 (10000000) → 1',
        'Пример: 255 (11111111) → 8'
      ],
      expectedOutput: '11 (1011) → 3\n128 (10000000) → 1\n255 (11111111) → 8',
      hint: 'n & (n-1) убирает самый правый единичный бит. Например: 1100 & 1011 = 1000. Считаем, сколько раз можем это сделать до n == 0.',
      solution: `public class Main {
    static int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1); // убираем младший единичный бит
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("11 (1011) → " + hammingWeight(11));
        System.out.println("128 (10000000) → " + hammingWeight(128));
        System.out.println("255 (11111111) → " + hammingWeight(255));
    }
}`,
      explanation: 'Трюк n & (n-1) убирает самый правый единичный бит за одну операцию. Количество итераций = количество единичных бит. Это быстрее, чем проверять все 32 бита.'
    },
    {
      id: 3,
      title: 'Counting Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано число n. Верни массив ans длины n+1, где ans[i] — количество единичных бит в числе i. Реши за O(n).',
      requirements: [
        'Метод int[] countBits(int n)',
        'DP подход: ans[i] = ans[i >> 1] + (i & 1)',
        'Или: ans[i] = ans[i & (i-1)] + 1',
        'Пример: n=2 → [0,1,1]',
        'Пример: n=5 → [0,1,1,2,1,2]',
        'O(n) время, без Integer.bitCount'
      ],
      expectedOutput: 'n=2 → [0, 1, 1]\nn=5 → [0, 1, 1, 2, 1, 2]\nn=8 → [0, 1, 1, 2, 1, 2, 2, 3, 1]',
      hint: 'Число i имеет столько же бит, сколько i/2 (сдвинутое вправо), плюс младший бит (i & 1). Формула: dp[i] = dp[i >> 1] + (i & 1).',
      solution: `import java.util.Arrays;

public class Main {
    static int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            ans[i] = ans[i >> 1] + (i & 1);
            // или: ans[i] = ans[i & (i-1)] + 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println("n=2 → " + Arrays.toString(countBits(2)));
        System.out.println("n=5 → " + Arrays.toString(countBits(5)));
        System.out.println("n=8 → " + Arrays.toString(countBits(8)));
    }
}`,
      explanation: 'DP на битах: i >> 1 — это i без младшего бита, i & 1 — это сам младший бит. Поэтому bitCount(i) = bitCount(i >> 1) + (i & 1). O(n) без вложенных циклов.'
    },
    {
      id: 4,
      title: 'Reverse Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разверни биты 32-битного беззнакового целого числа. Например, 43261596 (00000010100101000001111010011100) → 964176192 (00111001011110000010100101000000).',
      requirements: [
        'Метод int reverseBits(int n)',
        'Итерируй 32 раза: бери младший бит n, добавляй в result со сдвигом',
        'result = (result << 1) | (n & 1); n >>>= 1;',
        'Пример: 43261596 → 964176192',
        'Пример: 1 → -2147483648 (= 2^31 в unsigned)',
        'Используй unsigned shift (>>>)'
      ],
      expectedOutput: '43261596 → 964176192\n1 → -2147483648\n0 → 0',
      hint: 'Берём младший бит: n & 1. Добавляем в result: result = (result << 1) | bit. Сдвигаем n вправо: n >>>= 1. Повторяем 32 раза.',
      solution: `public class Main {
    static int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1); // добавляем младший бит n в result
            n >>>= 1; // unsigned right shift
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("43261596 → " + reverseBits(43261596));
        System.out.println("1 → " + reverseBits(1));
        System.out.println("0 → " + reverseBits(0));
    }
}`,
      explanation: 'За 32 итерации извлекаем биты из n справа и добавляем в result слева. Используем >>> (unsigned shift) для корректной работы с отрицательными числами. O(1) время (всегда 32 итерации).'
    },
    {
      id: 5,
      title: 'Missing Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив из n различных чисел в диапазоне [0, n]. Найди пропущенное число. Реши за O(n) времени и O(1) памяти.',
      requirements: [
        'Метод int missingNumber(int[] nums)',
        'Способ 1: XOR — XOR(0..n) ^ XOR(nums) = пропущенное',
        'Способ 2: сумма — n*(n+1)/2 - sum(nums)',
        'Пример: [3,0,1] → 2',
        'Пример: [0,1] → 2',
        'Пример: [9,6,4,2,3,5,7,0,1] → 8'
      ],
      expectedOutput: '[3,0,1] → 2\n[0,1] → 2\n[9,6,4,2,3,5,7,0,1] → 8',
      hint: 'XOR подход: XOR всех индексов 0..n и всех элементов массива. Все пары (индекс, элемент) обнулятся кроме пропущенного. Или используй формулу суммы.',
      solution: `public class Main {
    // Способ 1: XOR
    static int missingNumberXOR(int[] nums) {
        int xor = nums.length; // начинаем с n
        for (int i = 0; i < nums.length; i++) {
            xor ^= i ^ nums[i]; // XOR индекса и значения
        }
        return xor;
    }

    // Способ 2: Сумма
    static int missingNumberSum(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) actualSum += num;
        return expectedSum - actualSum;
    }

    public static void main(String[] args) {
        System.out.println("[3,0,1] → " + missingNumberXOR(new int[]{3,0,1}));
        System.out.println("[0,1] → " + missingNumberXOR(new int[]{0,1}));
        System.out.println("[9,6,4,2,3,5,7,0,1] → " +
            missingNumberXOR(new int[]{9,6,4,2,3,5,7,0,1}));
    }
}`,
      explanation: 'XOR метод: XOR(0,1,...,n) ^ XOR(nums) = пропущенное, т.к. все пары обнуляются. Сумма: expectedSum - actualSum. Оба O(n) по времени и O(1) по памяти. XOR безопаснее (нет переполнения).'
    },
    {
      id: 6,
      title: 'Sum of Two Integers',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли сумму двух целых чисел a и b без использования операторов + и -.',
      requirements: [
        'Метод int getSum(int a, int b)',
        'XOR даёт сумму без учёта переноса: a ^ b',
        'AND + сдвиг даёт перенос: (a & b) << 1',
        'Повторяй пока перенос != 0',
        'Пример: getSum(1, 2) → 3',
        'Пример: getSum(-1, 1) → 0',
        'Работает и для отрицательных чисел (дополнительный код)'
      ],
      expectedOutput: 'getSum(1, 2) → 3\ngetSum(-1, 1) → 0\ngetSum(5, 3) → 8\ngetSum(-5, -3) → -8',
      hint: 'Сложение в двоичной системе: 1+1 = 10 (0 с переносом 1). XOR = сумма без переноса. AND << 1 = перенос. Складываем сумму и перенос, пока перенос != 0.',
      solution: `public class Main {
    static int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1; // перенос
            a = a ^ b;                // сумма без переноса
            b = carry;                // прибавляем перенос на след. итерации
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println("getSum(1, 2) → " + getSum(1, 2));
        System.out.println("getSum(-1, 1) → " + getSum(-1, 1));
        System.out.println("getSum(5, 3) → " + getSum(5, 3));
        System.out.println("getSum(-5, -3) → " + getSum(-5, -3));
    }
}`,
      explanation: 'Имитация процессора: XOR — побитовая сумма без переноса, AND << 1 — перенос. Повторяем, пока есть перенос. Работает для любых целых чисел (дополнительный код). O(1) — не более 32 итераций.'
    },
    {
      id: 7,
      title: 'Power of Two',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, является ли число n степенью двойки. Степени двойки: 1, 2, 4, 8, 16, ...',
      requirements: [
        'Метод boolean isPowerOfTwo(int n)',
        'Свойство: степень двойки имеет ровно 1 единичный бит',
        'Проверка: n > 0 && (n & (n-1)) == 0',
        'n & (n-1) убирает единственный единичный бит → получаем 0',
        'Пример: 16 → true (10000)',
        'Пример: 6 → false (110), 0 → false, 1 → true'
      ],
      expectedOutput: '1 → true\n16 → true\n6 → false\n0 → false\n1024 → true',
      hint: 'Степень двойки в двоичном виде: 1, 10, 100, 1000, ... Ровно один единичный бит. n-1 переворачивает все биты после этого: 1000 → 0111. AND даёт 0.',
      solution: `public class Main {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        System.out.println("1 → " + isPowerOfTwo(1));
        System.out.println("16 → " + isPowerOfTwo(16));
        System.out.println("6 → " + isPowerOfTwo(6));
        System.out.println("0 → " + isPowerOfTwo(0));
        System.out.println("1024 → " + isPowerOfTwo(1024));
    }
}`,
      explanation: 'n & (n-1) убирает младший единичный бит. Если n — степень двойки, у неё ровно один бит, и после операции получаем 0. Проверка n > 0 отсекает 0 и отрицательные. O(1).'
    },
    {
      id: 8,
      title: 'Hamming Distance',
      type: 'practice',
      difficulty: 'easy',
      description: 'Расстояние Хэмминга между двумя числами — количество позиций, в которых их биты различаются. Например, 1 (001) и 4 (100) → 2.',
      requirements: [
        'Метод int hammingDistance(int x, int y)',
        'XOR даёт 1 в позициях, где биты различаются',
        'Подсчитай количество единичных бит в x ^ y',
        'Используй n & (n-1) для подсчёта бит',
        'Пример: hammingDistance(1, 4) → 2',
        'Пример: hammingDistance(3, 1) → 1'
      ],
      expectedOutput: 'hammingDistance(1, 4) → 2\nhammingDistance(3, 1) → 1\nhammingDistance(0, 0) → 0\nhammingDistance(15, 0) → 4',
      hint: 'XOR: биты одинаковые → 0, разные → 1. Осталось посчитать единицы в результате XOR. Используй трюк n & (n-1).',
      solution: `public class Main {
    static int hammingDistance(int x, int y) {
        int xor = x ^ y; // различающиеся биты
        int count = 0;
        while (xor != 0) {
            xor &= (xor - 1); // убираем младший единичный бит
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("hammingDistance(1, 4) → " + hammingDistance(1, 4));
        System.out.println("hammingDistance(3, 1) → " + hammingDistance(3, 1));
        System.out.println("hammingDistance(0, 0) → " + hammingDistance(0, 0));
        System.out.println("hammingDistance(15, 0) → " + hammingDistance(15, 0));
    }
}`,
      explanation: 'XOR выделяет различающиеся биты, затем считаем их количество трюком n & (n-1). Расстояние Хэмминга используется в теории кодирования и коррекции ошибок. O(1).'
    },
    {
      id: 9,
      title: 'Subsets через битмаски',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных чисел nums. Верни все подмножества (power set). Используй битовые маски вместо рекурсии.',
      requirements: [
        'Метод List<List<Integer>> subsets(int[] nums)',
        'Для n элементов есть 2^n подмножеств',
        'Маска от 0 до 2^n - 1: бит j == 1 → элемент j включён',
        'Пример: [1,2,3] → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]',
        'Битмаска 5 (101) → включены элементы 0 и 2 → [1,3]',
        'O(n * 2^n) время'
      ],
      expectedOutput: '[1,2,3] → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\n[0] → [[], [0]]',
      hint: 'Число от 0 до 2^n-1 кодирует подмножество: i-й бит == 1 означает "элемент i включён". Проверяй (mask >> j) & 1.',
      solution: `import java.util.*;

public class Main {
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        int total = 1 << n; // 2^n

        for (int mask = 0; mask < total; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                if ((mask >> j & 1) == 1) { // j-й бит включён
                    subset.add(nums[j]);
                }
            }
            result.add(subset);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("[1,2,3] → " + subsets(new int[]{1,2,3}));
        System.out.println("[0] → " + subsets(new int[]{0}));
    }
}`,
      explanation: 'Битмаска — элегантная альтернатива рекурсии для генерации подмножеств. Число mask кодирует подмножество: бит j == 1 → элемент j включён. Перебираем все маски от 0 до 2^n - 1. O(n * 2^n).'
    },
    {
      id: 10,
      title: 'Single Number III',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив, в котором каждое число встречается дважды, кроме двух. Найди эти два уникальных числа. O(n) времени, O(1) памяти.',
      requirements: [
        'Метод int[] singleNumber(int[] nums)',
        'Шаг 1: XOR всех → получаем xor = a ^ b (два уникальных числа)',
        'Шаг 2: найди любой различающийся бит: diffBit = xor & (-xor)',
        'Шаг 3: раздели на 2 группы по этому биту и XOR каждую',
        'Пример: [1,2,1,3,2,5] → [3,5]',
        'Пример: [-1,0] → [-1,0]'
      ],
      expectedOutput: '[1,2,1,3,2,5] → [3, 5]\n[-1,0] → [-1, 0]\n[1,2,3,4,1,2] → [3, 4]',
      hint: 'XOR всех элементов = a ^ b. Так как a != b, хотя бы один бит различается. Используем этот бит, чтобы разделить массив на 2 группы: в каждой ровно одно уникальное число.',
      solution: `import java.util.Arrays;

public class Main {
    static int[] singleNumber(int[] nums) {
        // Шаг 1: XOR всех элементов = a ^ b
        int xor = 0;
        for (int num : nums) xor ^= num;

        // Шаг 2: найти различающийся бит (младший единичный)
        int diffBit = xor & (-xor);

        // Шаг 3: разделить на 2 группы и XOR каждую
        int a = 0, b = 0;
        for (int num : nums) {
            if ((num & diffBit) != 0) {
                a ^= num; // группа 1: бит установлен
            } else {
                b ^= num; // группа 2: бит не установлен
            }
        }
        // Для консистентного порядка
        if (a > b) { int t = a; a = b; b = t; }
        return new int[]{a, b};
    }

    public static void main(String[] args) {
        System.out.println("[1,2,1,3,2,5] → " +
            Arrays.toString(singleNumber(new int[]{1,2,1,3,2,5})));
        System.out.println("[-1,0] → " +
            Arrays.toString(singleNumber(new int[]{-1,0})));
        System.out.println("[1,2,3,4,1,2] → " +
            Arrays.toString(singleNumber(new int[]{1,2,3,4,1,2})));
    }
}`,
      explanation: 'Расширение Single Number: XOR даёт a^b. Находим различающийся бит через xor & (-xor). Делим массив на 2 группы по этому биту — в каждой по одному уникальному числу. Пары по-прежнему обнуляются внутри каждой группы. O(n), O(1).'
    }
  ]
}
