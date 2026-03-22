export default {
  id: 57,
  title: 'Практикум: Задачи уровня Easy',
  description: 'Классические задачи уровня Easy из технических интервью: поиск двух чисел, разворот числа, валидация скобок, слияние массивов, римские цифры и другие популярные алгоритмы',
  lessons: [
    {
      id: 1,
      title: 'Задача: Two Sum (Сумма двух чисел)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums и число target. Найди два числа в массиве, сумма которых равна target, и верни их индексы. Каждая задача имеет ровно одно решение. Нельзя использовать один и тот же элемент дважды.',
      requirements: [
        'Метод twoSum(int[] nums, int target) возвращает int[]',
        'Вернуть массив из двух индексов [i, j] где nums[i] + nums[j] == target',
        'Решение должно работать за O(n) с использованием HashMap',
        'Протестировать: [2,7,11,15] target=9 → [0,1], [3,2,4] target=6 → [1,2]'
      ],
      expectedOutput: '[0, 1]\n[1, 2]\n[0, 1]',
      hint: 'Используй HashMap где ключ — число, значение — его индекс. Для каждого элемента проверяй: есть ли в карте (target - nums[i])? Если есть — нашли пару.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\nimport java.util.Arrays;\n\npublic class TwoSum {\n\n    public static int[] twoSum(int[] nums, int target) {\n        // Ключ: число, Значение: индекс этого числа\n        Map<Integer, Integer> seen = new HashMap<>();\n\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i]; // нужное дополнение\n\n            if (seen.containsKey(complement)) {\n                // Нашли пару: complement уже встречался раньше\n                return new int[]{seen.get(complement), i};\n            }\n\n            // Запоминаем текущее число и его индекс\n            seen.put(nums[i], i);\n        }\n\n        return new int[]{}; // решение всегда существует по условию\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));  // [0, 1]\n        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));       // [1, 2]\n        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6)));           // [0, 1]\n    }\n}',
      explanation: 'Наивный подход — два вложенных цикла O(n²): для каждой пары проверяем сумму. Оптимальное решение — HashMap за O(n): идём по массиву, и для каждого элемента x ищем (target - x) в уже просмотренных элементах. HashMap даёт поиск за O(1), поэтому итоговая сложность O(n). Ключевая идея: вместо "найди второй элемент для текущего" мы думаем "видели ли мы дополнение к текущему элементу раньше?"'
    },
    {
      id: 2,
      title: 'Задача: Reverse Integer (Разворот числа)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано 32-битное целое число x. Разверни его цифры. Если результат выходит за диапазон 32-битного целого числа [-2³¹, 2³¹-1], вернуть 0. Например: 123 → 321, -123 → -321, 120 → 21.',
      requirements: [
        'Метод reverse(int x) возвращает int',
        'Если развёрнутое число переполняет int — вернуть 0',
        'Знак числа сохраняется',
        'Протестировать: 123 → 321, -123 → -321, 120 → 21, 1534236469 → 0'
      ],
      expectedOutput: '321\n-321\n21\n0',
      hint: 'Извлекай последнюю цифру через x % 10, добавляй к результату через result * 10 + digit, обрезай x через x / 10. Перед добавлением цифры проверяй переполнение: если result > Integer.MAX_VALUE / 10 — уже переполнение.',
      solution: 'public class ReverseInteger {\n\n    public static int reverse(int x) {\n        long result = 0;\n\n        while (x != 0) {\n            int digit = x % 10;   // последняя цифра (с учётом знака)\n            x /= 10;              // убираем последнюю цифру\n            result = result * 10 + digit;\n        }\n\n        // Проверяем диапазон int\n        if (result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) {\n            return 0;\n        }\n\n        return (int) result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverse(123));         // 321\n        System.out.println(reverse(-123));        // -321\n        System.out.println(reverse(120));         // 21\n        System.out.println(reverse(1534236469));  // 0 (переполнение)\n    }\n}',
      explanation: 'Алгоритм: в цикле берём последнюю цифру через остаток от деления (x % 10), добавляем её к результату (result * 10 + digit), затем сдвигаем x на один разряд (x / 10). В Java оператор % для отрицательных чисел сохраняет знак: -123 % 10 = -3, поэтому знак числа обрабатывается автоматически. Используем long для результата, чтобы поймать переполнение int. В конце сравниваем с границами Integer.MAX_VALUE и Integer.MIN_VALUE.'
    },
    {
      id: 3,
      title: 'Задача: Valid Parentheses (Валидация скобок)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка s, содержащая только символы "(", ")", "{", "}", "[", "]". Определи, является ли строка корректной. Строка корректна если: открывающие скобки закрываются скобками того же типа, скобки закрываются в правильном порядке.',
      requirements: [
        'Метод isValid(String s) возвращает boolean',
        'Использовать стек (Stack или Deque) для отслеживания открытых скобок',
        'Протестировать: "()" → true, "()[]{}" → true, "(]" → false, "([)]" → false, "{[]}" → true'
      ],
      expectedOutput: 'true\ntrue\nfalse\nfalse\ntrue',
      hint: 'Открывающую скобку кладём в стек. Когда встречаем закрывающую — проверяем верхушку стека: должна быть соответствующая открывающая. Если нет — false. В конце стек должен быть пустым.',
      solution: 'import java.util.Deque;\nimport java.util.ArrayDeque;\n\npublic class ValidParentheses {\n\n    public static boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n\n        for (char c : s.toCharArray()) {\n            // Открывающие скобки — кладём в стек\n            if (c == \'(\' || c == \'[\' || c == \'{\') {\n                stack.push(c);\n            } else {\n                // Закрывающая скобка — стек должен быть непустым\n                if (stack.isEmpty()) return false;\n\n                char top = stack.pop();\n\n                // Проверяем соответствие\n                if (c == \')\' && top != \'(\') return false;\n                if (c == \']\' && top != \'[\') return false;\n                if (c == \'}\' && top != \'{\') return false;\n            }\n        }\n\n        // Все открытые скобки должны быть закрыты\n        return stack.isEmpty();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isValid("()"));      // true\n        System.out.println(isValid("()[]{}"));  // true\n        System.out.println(isValid("(]"));      // false\n        System.out.println(isValid("([)]"));    // false\n        System.out.println(isValid("{[]}"));    // true\n    }\n}',
      explanation: 'Стек идеально подходит для задачи с вложенными структурами. Принцип LIFO (последним вошёл — первым вышел) отражает природу скобок: последняя открытая скобка должна закрыться первой. Алгоритм: при открывающей скобке — push в стек; при закрывающей — pop из стека и сравниваем с ожидаемой парой. Два условия ошибки: 1) при закрывающей скобке стек пуст (лишняя закрывающая), 2) после прохода стек непустой (незакрытые открывающие). Сложность O(n) по времени и O(n) по памяти.'
    },
    {
      id: 4,
      title: 'Задача: Merge Two Sorted Arrays (Слияние отсортированных массивов)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны два отсортированных массива целых чисел. Слей их в один отсортированный массив. Например: [1,3,5] и [2,4,6] → [1,2,3,4,5,6]. Реализуй классический алгоритм слияния из сортировки слиянием.',
      requirements: [
        'Метод merge(int[] a, int[] b) возвращает int[]',
        'Результирующий массив отсортирован',
        'Алгоритм работает за O(n+m) без дополнительной сортировки',
        'Протестировать: [1,3,5]+[2,4,6]→[1,2,3,4,5,6], [1,2]+[3,4,5]→[1,2,3,4,5], []+[1,2]→[1,2]'
      ],
      expectedOutput: '[1, 2, 3, 4, 5, 6]\n[1, 2, 3, 4, 5]\n[1, 2]',
      hint: 'Используй три указателя: i для массива a, j для массива b, k для результата. Сравнивай a[i] и b[j], меньший элемент копируй в результат. После того как один массив исчерпан — копируй остаток второго.',
      solution: 'import java.util.Arrays;\n\npublic class MergeSortedArrays {\n\n    public static int[] merge(int[] a, int[] b) {\n        int[] result = new int[a.length + b.length];\n        int i = 0; // указатель на массив a\n        int j = 0; // указатель на массив b\n        int k = 0; // указатель на результат\n\n        // Сравниваем элементы обоих массивов\n        while (i < a.length && j < b.length) {\n            if (a[i] <= b[j]) {\n                result[k++] = a[i++];\n            } else {\n                result[k++] = b[j++];\n            }\n        }\n\n        // Копируем остаток массива a (если есть)\n        while (i < a.length) {\n            result[k++] = a[i++];\n        }\n\n        // Копируем остаток массива b (если есть)\n        while (j < b.length) {\n            result[k++] = b[j++];\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(merge(new int[]{1,3,5}, new int[]{2,4,6})));    // [1,2,3,4,5,6]\n        System.out.println(Arrays.toString(merge(new int[]{1,2}, new int[]{3,4,5})));      // [1,2,3,4,5]\n        System.out.println(Arrays.toString(merge(new int[]{}, new int[]{1,2})));            // [1,2]\n    }\n}',
      explanation: 'Алгоритм слияния — основа сортировки слиянием (Merge Sort). Ключевое свойство: раз оба входных массива уже отсортированы, наименьший элемент объединённого массива — это либо a[i], либо b[j]. Берём меньший и продвигаем соответствующий указатель. Когда один массив исчерпан, просто копируем остаток второго. Сложность O(n+m) по времени и O(n+m) по памяти — оптимальна, так как нам нужно прочитать каждый элемент ровно один раз.'
    },
    {
      id: 5,
      title: 'Задача: Roman to Integer (Римские цифры в число)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Переведи строку с римским числом в целое число. Символы: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Правило вычитания: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900. Входные данные всегда корректны, диапазон [1, 3999].',
      requirements: [
        'Метод romanToInt(String s) возвращает int',
        'Учитывать правило вычитания (когда меньший символ стоит перед большим)',
        'Протестировать: "III"→3, "IV"→4, "IX"→9, "LVIII"→58, "MCMXCIV"→1994'
      ],
      expectedOutput: '3\n4\n9\n58\n1994',
      hint: 'Идём по строке справа налево. Если текущий символ меньше предыдущего — вычитаем его, иначе прибавляем. Или идём слева направо: если значение текущего символа меньше следующего — вычитаем, иначе прибавляем.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class RomanToInteger {\n\n    public static int romanToInt(String s) {\n        Map<Character, Integer> values = new HashMap<>();\n        values.put(\'I\', 1);\n        values.put(\'V\', 5);\n        values.put(\'X\', 10);\n        values.put(\'L\', 50);\n        values.put(\'C\', 100);\n        values.put(\'D\', 500);\n        values.put(\'M\', 1000);\n\n        int result = 0;\n        int prevValue = 0;\n\n        // Идём СПРАВА НАЛЕВО\n        for (int i = s.length() - 1; i >= 0; i--) {\n            int curr = values.get(s.charAt(i));\n\n            // Если текущий символ меньше предыдущего (справа) — вычитаем\n            if (curr < prevValue) {\n                result -= curr;\n            } else {\n                result += curr;\n            }\n\n            prevValue = curr;\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(romanToInt("III"));      // 3\n        System.out.println(romanToInt("IV"));       // 4\n        System.out.println(romanToInt("IX"));       // 9\n        System.out.println(romanToInt("LVIII"));    // 58\n        System.out.println(romanToInt("MCMXCIV")); // 1994\n    }\n}',
      explanation: 'Правило вычитания в римских числах: если символ с меньшим значением стоит перед символом с большим значением, то он вычитается (IV = 5 - 1 = 4). Проход справа налево упрощает логику: сравниваем текущий символ с "предыдущим" (который справа от нас). Если текущий меньше — это случай вычитания, иначе — сложения. Разбор MCMXCIV: M(1000) + CM(900) + XC(90) + IV(4) = 1994. HashMap даёт O(1) поиск, итоговая сложность O(n).'
    },
    {
      id: 6,
      title: 'Задача: Contains Duplicate (Есть ли дубликаты)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums. Вернуть true если в массиве есть хотя бы одно число, которое встречается более одного раза. Вернуть false если все элементы различны.',
      requirements: [
        'Метод containsDuplicate(int[] nums) возвращает boolean',
        'Решение за O(n) с использованием HashSet',
        'Протестировать: [1,2,3,1]→true, [1,2,3,4]→false, [1,1,1,3,3,4,3,2,4,2]→true'
      ],
      expectedOutput: 'true\nfalse\ntrue',
      hint: 'Используй HashSet. Для каждого числа: если оно уже есть в Set — дубликат найден, возвращай true. Иначе добавляй в Set. HashSet.add() возвращает false если элемент уже существует.',
      solution: 'import java.util.HashSet;\nimport java.util.Set;\n\npublic class ContainsDuplicate {\n\n    public static boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n\n        for (int num : nums) {\n            // add() возвращает false если элемент уже есть в Set\n            if (!seen.add(num)) {\n                return true; // дубликат!\n            }\n        }\n\n        return false; // все элементы уникальны\n    }\n\n    public static void main(String[] args) {\n        System.out.println(containsDuplicate(new int[]{1, 2, 3, 1}));          // true\n        System.out.println(containsDuplicate(new int[]{1, 2, 3, 4}));          // false\n        System.out.println(containsDuplicate(new int[]{1,1,1,3,3,4,3,2,4,2}));// true\n    }\n}',
      explanation: 'HashSet хранит только уникальные значения. Метод add() возвращает true если элемент был добавлен (его не было), и false если элемент уже присутствовал. Используем это свойство для элегантного однострочного условия. Сложность O(n) по времени — один проход, O(n) по памяти — в худшем случае (все уникальные) хранится весь массив. Альтернатива — отсортировать за O(n log n) и проверить соседей, но HashSet быстрее.'
    },
    {
      id: 7,
      title: 'Задача: Single Number (Одинокое число через XOR)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел, в котором каждое число встречается дважды, кроме одного — оно встречается ровно один раз. Найди это число. Решение должно работать за O(n) по времени и O(1) по памяти.',
      requirements: [
        'Метод singleNumber(int[] nums) возвращает int',
        'O(n) по времени, O(1) по памяти — без HashMap!',
        'Использовать операцию XOR (^)',
        'Протестировать: [2,2,1]→1, [4,1,2,1,2]→4, [1]→1'
      ],
      expectedOutput: '1\n4\n1',
      hint: 'Вспомни свойства XOR: a ^ a = 0 (число XOR само с собой = 0), a ^ 0 = a (число XOR ноль = число), XOR коммутативен и ассоциативен. Значит XOR всех чисел массива даст одинокое число, т.к. все парные числа "уничтожат" друг друга.',
      solution: 'public class SingleNumber {\n\n    public static int singleNumber(int[] nums) {\n        int result = 0;\n\n        for (int num : nums) {\n            result ^= num; // XOR с каждым числом\n        }\n\n        // Все парные числа "обнулились", остался одиночный элемент\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(singleNumber(new int[]{2, 2, 1}));       // 1\n        System.out.println(singleNumber(new int[]{4, 1, 2, 1, 2})); // 4\n        System.out.println(singleNumber(new int[]{1}));              // 1\n    }\n}',
      explanation: 'XOR (исключающее ИЛИ) — битовая операция с уникальными свойствами: a ^ a = 0 (два одинаковых числа дают 0), a ^ 0 = a (число и ноль дают само число). Для массива [4,1,2,1,2]: result = 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4. Порядок операций не важен из-за коммутативности и ассоциативности. Это решение использует O(1) памяти в отличие от HashMap. Прекрасный пример задачи, где знание битовых операций даёт элегантное решение.'
    },
    {
      id: 8,
      title: 'Задача: Move Zeroes (Нули в конец)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums. Перемести все нули в конец массива, сохранив относительный порядок ненулевых элементов. Нужно изменить массив на месте (in-place) без создания копии.',
      requirements: [
        'Метод moveZeroes(int[] nums) изменяет массив на месте (void)',
        'Порядок ненулевых элементов сохраняется',
        'Минимальное количество операций',
        'Протестировать: [0,1,0,3,12]→[1,3,12,0,0], [0]→[0], [1,0]→[1,0]'
      ],
      expectedOutput: '[1, 3, 12, 0, 0]\n[0]\n[1, 0]',
      hint: 'Используй технику двух указателей. Медленный указатель (insertPos) указывает на позицию для следующего ненулевого элемента. Быстрый (i) сканирует массив. Когда находим ненулевой — ставим его на позицию insertPos.',
      solution: 'import java.util.Arrays;\n\npublic class MoveZeroes {\n\n    public static void moveZeroes(int[] nums) {\n        int insertPos = 0; // позиция для следующего ненулевого элемента\n\n        // Первый проход: все ненулевые ставим на нужные позиции\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) {\n                nums[insertPos++] = nums[i];\n            }\n        }\n\n        // Второй проход: заполняем оставшиеся позиции нулями\n        while (insertPos < nums.length) {\n            nums[insertPos++] = 0;\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] a = {0, 1, 0, 3, 12};\n        moveZeroes(a);\n        System.out.println(Arrays.toString(a)); // [1, 3, 12, 0, 0]\n\n        int[] b = {0};\n        moveZeroes(b);\n        System.out.println(Arrays.toString(b)); // [0]\n\n        int[] c = {1, 0};\n        moveZeroes(c);\n        System.out.println(Arrays.toString(c)); // [1, 0]\n    }\n}',
      explanation: 'Паттерн "два указателя" решает эту задачу за O(n) с O(1) дополнительной памяти. Указатель insertPos всегда указывает на место для следующего ненулевого элемента. Мы "перезаписываем" массив: ненулевые элементы копируются на левую часть в правильном порядке, затем оставшиеся позиции заполняются нулями. Этот подход делает ровно (n + количество_нулей) присваиваний — минимально необходимое количество операций записи.'
    },
    {
      id: 9,
      title: 'Задача: Plus One (Прибавить единицу к числу-массиву)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Большое целое число представлено массивом цифр digits, где digits[0] — старшая цифра. Прибавь 1 к числу и верни результат в виде массива. Например: [1,2,3] представляет число 123, прибавляем 1 → [1,2,4].',
      requirements: [
        'Метод plusOne(int[] digits) возвращает int[]',
        'Обработать перенос разряда (carry)',
        'Обработать случай когда все цифры 9: [9,9,9] → [1,0,0,0]',
        'Протестировать: [1,2,3]→[1,2,4], [4,3,2,1]→[4,3,2,2], [9]→[1,0], [9,9,9]→[1,0,0,0]'
      ],
      expectedOutput: '[1, 2, 4]\n[4, 3, 2, 2]\n[1, 0]\n[1, 0, 0, 0]',
      hint: 'Идём с конца массива. Если цифра < 9 — просто прибавляем 1 и возвращаем. Если 9 — ставим 0 и продолжаем (перенос). Если вышли из цикла (все были 9) — создаём новый массив длиной n+1 с 1 в начале.',
      solution: 'import java.util.Arrays;\n\npublic class PlusOne {\n\n    public static int[] plusOne(int[] digits) {\n        // Идём с конца (с младших разрядов)\n        for (int i = digits.length - 1; i >= 0; i--) {\n            if (digits[i] < 9) {\n                // Нет переноса — просто прибавляем и выходим\n                digits[i]++;\n                return digits;\n            }\n            // Цифра равна 9 — ставим 0 (9 + 1 = 10, перенос)\n            digits[i] = 0;\n        }\n\n        // Сюда попадаем только если все цифры были 9\n        // Например [9,9,9] -> нужен [1,0,0,0]\n        int[] result = new int[digits.length + 1];\n        result[0] = 1; // остальные нули по умолчанию\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(plusOne(new int[]{1, 2, 3})));    // [1, 2, 4]\n        System.out.println(Arrays.toString(plusOne(new int[]{4, 3, 2, 1}))); // [4, 3, 2, 2]\n        System.out.println(Arrays.toString(plusOne(new int[]{9})));           // [1, 0]\n        System.out.println(Arrays.toString(plusOne(new int[]{9, 9, 9})));    // [1, 0, 0, 0]\n    }\n}',
      explanation: 'Задача моделирует сложение в столбик. Идём с конца (с наименее значимого разряда). Если цифра < 9: прибавляем 1 и сразу возвращаем — перенос не нужен. Если цифра = 9: 9+1=10, записываем 0 и "переносим" 1 в следующий разряд. Особый случай: если весь массив состоит из девяток (например [9,9,9]), после цикла все стали 0, и нужен новый массив с 1 в начале. new int[n+1] автоматически заполняется нулями, нам нужно только поставить result[0] = 1.'
    },
    {
      id: 10,
      title: 'Задача: Intersection of Two Arrays (Пересечение массивов)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны два массива nums1 и nums2. Верни массив их пересечения — элементы, которые есть в обоих массивах. Каждый элемент в результате должен быть уникальным (без дубликатов). Порядок элементов в ответе не важен.',
      requirements: [
        'Метод intersection(int[] nums1, int[] nums2) возвращает int[]',
        'Результат содержит только уникальные элементы',
        'Использовать HashSet для O(n) решения',
        'Протестировать: [1,2,2,1]+[2,2]→[2], [4,9,5]+[9,4,9,8,4]→[9,4]'
      ],
      expectedOutput: '[2]\n[9, 4]',
      hint: 'Положи все элементы nums1 в HashSet. Затем для каждого элемента nums2 проверяй — есть ли он в Set. Если есть — это пересечение, добавь в результирующий Set (чтобы не было дублей).',
      solution: 'import java.util.HashSet;\nimport java.util.Set;\nimport java.util.Arrays;\n\npublic class IntersectionOfArrays {\n\n    public static int[] intersection(int[] nums1, int[] nums2) {\n        Set<Integer> set1 = new HashSet<>();\n        for (int num : nums1) {\n            set1.add(num); // добавляем все элементы nums1\n        }\n\n        Set<Integer> resultSet = new HashSet<>();\n        for (int num : nums2) {\n            if (set1.contains(num)) {\n                resultSet.add(num); // нашли общий элемент\n            }\n        }\n\n        // Конвертируем Set в массив\n        int[] result = new int[resultSet.size()];\n        int i = 0;\n        for (int num : resultSet) {\n            result[i++] = num;\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(intersection(new int[]{1,2,2,1}, new int[]{2,2})));         // [2]\n        System.out.println(Arrays.toString(intersection(new int[]{4,9,5}, new int[]{9,4,9,8,4})));    // [9, 4]\n    }\n}',
      explanation: 'Используем два HashSet для O(n+m) решения. Первый Set хранит все уникальные элементы nums1. Второй Set накапливает пересечение — элементы из nums2, которые есть в первом Set. Использование результирующего Set гарантирует уникальность, даже если элемент встречается в nums2 несколько раз. Альтернативное решение: отсортировать оба массива и использовать два указателя за O(n log n + m log m), но HashSet-подход быстрее. Конвертация Set в массив в конце — стандартный Java-паттерн.'
    }
  ]
}
