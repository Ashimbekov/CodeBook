export default {
  id: 27,
  title: 'Coding: битовые операции',
  description: 'Битовые операции: AND, OR, XOR, сдвиги. Классические задачи на биты с собеседований — поиск одиночного числа, подсчёт единиц, сумма без арифметики. Все задачи практические.',
  lessons: [
    {
      id: 1,
      title: 'Single Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Массив целых чисел, каждое число встречается дважды, кроме одного. Найди это число за O(n) и O(1) памяти.',
      requirements: [
        'Реализовать функцию single_number(nums: list) -> int',
        'Использовать XOR (^): a ^ a = 0, a ^ 0 = a',
        'Вывести XOR результат пошагово',
        'Тесты: [2,2,1] -> 1, [4,1,2,1,2] -> 4, [1] -> 1'
      ],
      expectedOutput: '[2,2,1] -> 1\n[4,1,2,1,2] -> 4\n[1] -> 1\nТрассировка [4,1,2,1,2]:\nxor=0 ^ 4 = 4\nxor=4 ^ 1 = 5\nxor=5 ^ 2 = 7\nxor=7 ^ 1 = 6\nxor=6 ^ 2 = 4 -> ответ: 4',
      hint: 'XOR свойства: a ^ a = 0 (одинаковые числа уничтожаются), a ^ 0 = a, XOR коммутативен. Применяй XOR ко всем элементам — парные обнулятся, останется одиночный.',
      solution: 'def single_number(nums):\n    result = 0\n    for num in nums:\n        result ^= num\n    return result\n\nprint("[2,2,1] ->", single_number([2, 2, 1]))\nprint("[4,1,2,1,2] ->", single_number([4, 1, 2, 1, 2]))\nprint("[1] ->", single_number([1]))\n\ndef single_verbose(nums):\n    xor = 0\n    print("Трассировка", str(nums) + ":")\n    for num in nums:\n        new_xor = xor ^ num\n        print("xor=" + str(xor) + " ^ " + str(num) + " = " + str(new_xor))\n        xor = new_xor\n    print("-> ответ:", xor)\n    return xor\n\nsingle_verbose([4, 1, 2, 1, 2])',
      explanation: 'Подход: XOR всех чисел. Парные числа дают 0 (a ^ a = 0), одиночное остаётся (0 ^ a = a). Порядок не важен из-за коммутативности XOR.\nСложность: O(n) время, O(1) память.\nНа интервью: это идеальный пример использования XOR. Объясни три свойства: a^a=0, a^0=a, коммутативность. Задача часто используется как разминка перед более сложными битовыми задачами. Вариация: Single Number II (каждое число три раза, одно — одиночное).'
    },
    {
      id: 2,
      title: 'Number of 1 Bits (Hamming Weight)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди количество единичных битов (вес Хэмминга) в беззнаковом 32-битном целом числе n.',
      requirements: [
        'Реализовать функцию hamming_weight(n: int) -> int',
        'Метод 1: проверка последнего бита (n & 1) и сдвиг',
        'Метод 2: трюк n & (n-1) убирает последний единичный бит',
        'Тесты: 11 (0b1011) -> 3, 128 (0b10000000) -> 1, 4294967293 -> 31'
      ],
      expectedOutput: '11 -> 3\n128 -> 1\n4294967293 -> 31\nТрассировка n=11 (1011):\nn=11 (1011), n&1=1, count=1, n>>=1 -> 5\nn=5 (0101), n&1=1, count=2, n>>=1 -> 2\nn=2 (0010), n&1=0, count=2, n>>=1 -> 1\nn=1 (0001), n&1=1, count=3, n>>=1 -> 0',
      hint: 'Метод 1: while n != 0: count += n & 1; n >>= 1. Метод 2 (быстрее): n & (n-1) убирает младший единичный бит. Считай, сколько раз пока n != 0.',
      solution: 'def hamming_weight(n):\n    count = 0\n    while n:\n        count += n & 1\n        n >>= 1\n    return count\n\ndef hamming_weight_fast(n):\n    count = 0\n    while n:\n        n &= (n - 1)\n        count += 1\n    return count\n\nprint("11 ->", hamming_weight(11))\nprint("128 ->", hamming_weight(128))\nprint("4294967293 ->", hamming_weight(4294967293))\n\ndef hamming_verbose(n):\n    count = 0\n    orig = n\n    print("Трассировка n=" + str(n) + " (" + bin(n) + "):")\n    while n:\n        bit = n & 1\n        count += bit\n        print("n=" + str(n) + " (" + bin(n)[2:].zfill(4) + "), n&1=" + str(bit) + ", count=" + str(count) + ", n>>=1 -> " + str(n >> 1))\n        n >>= 1\n    return count\n\nhamming_verbose(11)',
      explanation: 'Метод 1: сдвиг вправо и проверка последнего бита. O(32) = O(1) для 32-бит чисел.\nМетод 2 (Brian Kernighan): n & (n-1) убирает самый правый единичный бит. Итераций равно числу единиц — эффективно для чисел с малым числом единиц.\nСложность: O(1) для фиксированного размера числа.\nНа интервью: знай оба метода. n & (n-1) — важный трюк для битовых задач (проверка степени двойки: n & (n-1) == 0).'
    },
    {
      id: 3,
      title: 'Counting Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Для каждого числа от 0 до n вернуть количество единичных битов. Вернуть массив из n+1 элементов. Решить за O(n) — лучше, чем O(n log n) через отдельный подсчёт.',
      requirements: [
        'Реализовать функцию count_bits(n: int) -> list',
        'Использовать ДП с битовым трюком: dp[i] = dp[i >> 1] + (i & 1)',
        'Вывести dp массив для n=8',
        'Тесты: n=2 -> [0,1,1], n=5 -> [0,1,1,2,1,2], n=8 -> [0,1,1,2,1,2,2,3,1]'
      ],
      expectedOutput: 'n=2: [0, 1, 1]\nn=5: [0, 1, 1, 2, 1, 2]\nn=8: [0, 1, 1, 2, 1, 2, 2, 3, 1]\ndp для n=8:\ni=0: 0 бит\ni=1: dp[0]+1=1\ni=2: dp[1]+0=1\ni=3: dp[1]+1=2\ni=4: dp[2]+0=1',
      hint: 'dp[i] = dp[i >> 1] + (i & 1). Число i после сдвига вправо на 1 — это i/2, мы уже знаем его счёт. Добавляем последний бит i & 1.',
      solution: 'def count_bits(n):\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)\n    return dp\n\nprint("n=2:", count_bits(2))\nprint("n=5:", count_bits(5))\nprint("n=8:", count_bits(8))\n\ndef count_bits_verbose(n):\n    dp = [0] * (n + 1)\n    print("dp для n=" + str(n) + ":")\n    print("i=0: 0 бит")\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)\n        if i <= 4:\n            print("i=" + str(i) + ": dp[" + str(i >> 1) + "]+" + str(i & 1) + "=" + str(dp[i]))\n    return dp\n\ncount_bits_verbose(8)',
      explanation: 'Подход: ДП с битовым трюком. i >> 1 (i/2) имеет те же биты что и i, но без последнего. dp[i >> 1] уже вычислен. Остаётся добавить последний бит: i & 1.\nСложность: O(n) время, O(n) память.\nНа интервью: покажи интуицию — 6 (110) = 3 (11) + один старший бит. Единиц в 6 = единиц в 3 + 0 (последний бит 6 равен 0). Это элегантное ДП решение.'
    },
    {
      id: 4,
      title: 'Reverse Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'Развернуть биты 32-битного беззнакового целого числа.',
      requirements: [
        'Реализовать функцию reverse_bits(n: int) -> int',
        'Извлекать биты справа и добавлять слева',
        'Вывести процесс разворота для числа 43261596',
        'Тесты: 43261596 (00000010100101000001111010011100) -> 964176192'
      ],
      expectedOutput: '43261596 -> 964176192\nbinary: 00000010100101000001111010011100\nreversed: 00111001011110000010100101000000\nresult: 964176192',
      hint: 'Цикл 32 раза: result = (result << 1) | (n & 1); n >>= 1. Берём последний бит n, добавляем в result слева (сдвигаем result и OR с битом).',
      solution: 'def reverse_bits(n):\n    result = 0\n    for _ in range(32):\n        result = (result << 1) | (n & 1)\n        n >>= 1\n    return result\n\nnum = 43261596\nprint(str(num) + " ->", reverse_bits(num))\nprint("binary:", bin(num)[2:].zfill(32))\nprint("reversed:", bin(reverse_bits(num))[2:].zfill(32))\nprint("result:", reverse_bits(num))',
      explanation: 'Подход: последовательно берём биты n справа (n & 1) и помещаем в result слева (result << 1 | bit). За 32 итерации разворачиваем все биты.\nСложность: O(1) — ровно 32 итерации для 32-битного числа.\nНа интервью: объясни побитово — "pop" из n справа, "push" в result слева. Оптимизация: мемоизировать для 8-битных блоков и собирать 32-битный результат из четырёх блоков (полезно при многократных вызовах).'
    },
    {
      id: 5,
      title: 'Missing Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Массив nums содержит n различных числа из диапазона [0, n]. Найди отсутствующее число за O(n) и O(1) памяти.',
      requirements: [
        'Реализовать функцию missing_number(nums: list) -> int',
        'Метод XOR: xor всех индексов и значений',
        'Метод суммы: ожидаемая сумма - фактическая',
        'Тесты: [3,0,1] -> 2, [0,1] -> 2, [9,6,4,2,3,5,7,0,1] -> 8'
      ],
      expectedOutput: '[3,0,1] -> 2\n[0,1] -> 2\n[9,6,4,2,3,5,7,0,1] -> 8\nМетод XOR для [3,0,1]:\nxor = 0^0 ^ 1^3 ^ 2^0 ^ 3^1 = 2\nМетод суммы: expected=6, actual=4, missing=2',
      hint: 'XOR метод: xor = 0; for i,num in enumerate(nums): xor ^= i ^ num; xor ^= n. Каждое число от 0 до n-1, кроме отсутствующего, встретится дважды и обнулится. Метод суммы: n*(n+1)/2 - sum(nums).',
      solution: 'def missing_number_xor(nums):\n    n = len(nums)\n    xor = n\n    for i, num in enumerate(nums):\n        xor ^= i ^ num\n    return xor\n\ndef missing_number_sum(nums):\n    n = len(nums)\n    expected = n * (n + 1) // 2\n    return expected - sum(nums)\n\nprint("[3,0,1] ->", missing_number_xor([3, 0, 1]))\nprint("[0,1] ->", missing_number_xor([0, 1]))\nprint("[9,6,4,2,3,5,7,0,1] ->", missing_number_xor([9, 6, 4, 2, 3, 5, 7, 0, 1]))\n\ndef missing_verbose(nums):\n    n = len(nums)\n    print("Метод XOR для", str(nums) + ":")\n    xor = n\n    steps = ["xor = " + str(n)]\n    for i, num in enumerate(nums):\n        xor ^= i ^ num\n        steps.append(str(i) + "^" + str(num))\n    print("xor = " + " ^ ".join(steps) + " = " + str(xor))\n    expected = n * (n + 1) // 2\n    actual = sum(nums)\n    print("Метод суммы: expected=" + str(expected) + ", actual=" + str(actual) + ", missing=" + str(expected - actual))\n    return xor\n\nmissing_verbose([3, 0, 1])',
      explanation: 'XOR метод: XOR всех индексов [0..n] и всех элементов массива. Каждое присутствующее число встречается дважды (как индекс и как значение) и обнуляется. Остаётся только отсутствующий индекс.\nСложность: O(n) время, O(1) память.\nНа интервью: знай оба метода. XOR более элегантный и безопасен от переполнения. Метод суммы проще, но может переполниться для больших n (в Python не проблема).'
    },
    {
      id: 6,
      title: 'Sum of Two Integers (без оператора +)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли сумму двух целых чисел a и b без использования операторов + и -. Используй только битовые операции.',
      requirements: [
        'Реализовать функцию get_sum(a: int, b: int) -> int',
        'XOR даёт сумму без переноса, AND << 1 даёт перенос',
        'Учесть отрицательные числа в Python (маска 0xFFFFFFFF)',
        'Тесты: 1+2 -> 3, -1+1 -> 0, -3+(-2) -> -5, 100+200 -> 300'
      ],
      expectedOutput: '1+2 -> 3\n-1+1 -> 0\n-3+(-2) -> -5\n100+200 -> 300\nТрассировка 1+2:\na=1 (01), b=2 (10)\nsum_no_carry = 01^10 = 11 = 3\ncarry = (01&10)<<1 = 0\nb=0, результат: 3',
      hint: 'Повторяй: sum_no_carry = a ^ b (XOR), carry = (a & b) << 1. a = sum_no_carry, b = carry. Продолжай пока b != 0. В Python нужна маска 0xFFFFFFFF для 32-битной арифметики.',
      solution: 'def get_sum(a, b):\n    MASK = 0xFFFFFFFF\n    MAX = 0x7FFFFFFF\n    while b & MASK:\n        carry = ((a & b) << 1) & MASK\n        a = (a ^ b) & MASK\n        b = carry\n    if a > MAX:\n        a = ~(a ^ MASK)\n    return a\n\nprint("1+2 ->", get_sum(1, 2))\nprint("-1+1 ->", get_sum(-1, 1))\nprint("-3+(-2) ->", get_sum(-3, -2))\nprint("100+200 ->", get_sum(100, 200))\n\ndef sum_verbose(a, b):\n    print("Трассировка " + str(a) + "+" + str(b) + ":")\n    print("a=" + str(a) + " (" + bin(a & 0xFF)[2:].zfill(8) + "), b=" + str(b) + " (" + bin(b & 0xFF)[2:].zfill(8) + ")")\n    MASK = 0xFFFFFFFF\n    MAX = 0x7FFFFFFF\n    step = 0\n    while b & MASK:\n        carry = ((a & b) << 1) & MASK\n        new_a = (a ^ b) & MASK\n        print("sum_no_carry = " + bin(a & 0xFF)[2:] + "^" + bin(b & 0xFF)[2:] + " = " + bin(new_a & 0xFF)[2:] + " = " + str(new_a & 0xFF))\n        print("carry = (" + bin(a & 0xFF)[2:] + "&" + bin(b & 0xFF)[2:] + ")<<1 = " + str(carry))\n        a = new_a\n        b = carry\n        step += 1\n        if step > 5:\n            break\n    if a > MAX:\n        a = ~(a ^ MASK)\n    print("b=0, результат:", a)\n    return a\n\nsum_verbose(1, 2)',
      explanation: 'Подход: a ^ b даёт сумму без переноса разряда (XOR). (a & b) << 1 — перенос (carry). Повторяем пока есть перенос. В Python целые числа имеют произвольную точность, поэтому нужна маска 0xFFFFFFFF для имитации 32-битной арифметики и обработки отрицательных чисел.\nСложность: O(1) для 32-битных чисел (не более 32 итераций).\nНа интервью: это один из самых необычных вопросов. Объясни принцип двоичного сложения — XOR это сложение без переноса, AND+сдвиг это перенос. Маска 0xFFFFFFFF объясни для Python-специфики.'
    }
  ]
}
