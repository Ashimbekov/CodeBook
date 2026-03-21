export default {
  id: 12,
  title: 'Рекурсия',
  description: 'Метод, который вызывает сам себя: базовый случай, факториал, числа Фибоначчи, рекурсивное мышление и сравнение с циклами',
  lessons: [
    {
      id: 1,
      title: 'Что такое рекурсия?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рекурсия — это когда метод вызывает сам себя. Звучит странно? На самом деле это мощный инструмент, который позволяет решать сложные задачи элегантно и просто.' },
        { type: 'tip', value: 'Представь зеркала напротив друг друга: в каждом отражении видишь ещё одно отражение, и ещё, и ещё... Рекурсия похожа — метод вызывает себя, тот вызывает себя снова. Важно знать когда остановиться!' },
        { type: 'heading', value: 'Простой пример: отсчёт' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static void countdown(int n) {\n        if (n <= 0) {\n            System.out.println("Пуск!");  // BASE CASE — останавливаемся!\n            return;\n        }\n        System.out.println(n);\n        countdown(n - 1);  // вызываем сами себя с n-1\n    }\n\n    public static void main(String[] args) {\n        countdown(5);\n    }\n}\n// Вывод:\n// 5\n// 4\n// 3\n// 2\n// 1\n// Пуск!' },
        { type: 'text', value: 'Что происходит? countdown(5) вызывает countdown(4), который вызывает countdown(3)... и так до countdown(0), который выводит "Пуск!" и возвращается.' },
        { type: 'heading', value: 'Два обязательных элемента рекурсии' },
        { type: 'list', items: [
          'Базовый случай (base case) — условие остановки. БЕЗ НЕГО — бесконечная рекурсия и ошибка!',
          'Рекурсивный случай — вызов самого себя с "меньшим" аргументом, приближаясь к базовому'
        ]},
        { type: 'warning', value: 'Без базового случая рекурсия бесконечна! Java выдаст StackOverflowError — стек вызовов переполнится. Как зеркала без края — бесконечное отражение.' }
      ]
    },
    {
      id: 2,
      title: 'Базовый случай — ключ к рекурсии',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовый случай — это условие, при котором метод НЕ вызывает себя и просто возвращает результат. Это "точка остановки". Рекурсия каждый раз должна приближаться к базовому случаю.' },
        { type: 'heading', value: 'Без базового случая — катастрофа' },
        { type: 'code', language: 'java', value: '// ПЛОХОЙ код — нет базового случая!\nstatic void badRecursion(int n) {\n    System.out.println(n);\n    badRecursion(n - 1);  // никогда не останавливается!\n}\n// StackOverflowError через несколько тысяч вызовов' },
        { type: 'heading', value: 'С правильным базовым случаем' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // Сумма от 1 до n\n    static int sumTo(int n) {\n        // Базовый случай: сумма от 1 до 1 равна 1\n        if (n == 1) {\n            return 1;\n        }\n        // Рекурсивный случай: n + сумма от 1 до (n-1)\n        return n + sumTo(n - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(sumTo(5));  // 15\n        // sumTo(5) = 5 + sumTo(4)\n        //          = 5 + 4 + sumTo(3)\n        //          = 5 + 4 + 3 + sumTo(2)\n        //          = 5 + 4 + 3 + 2 + sumTo(1)\n        //          = 5 + 4 + 3 + 2 + 1 = 15\n    }\n}' },
        { type: 'heading', value: 'Визуализация стека вызовов' },
        { type: 'code', language: 'java', value: '// При sumTo(4):\n// -> sumTo(4) вызывает sumTo(3)\n//    -> sumTo(3) вызывает sumTo(2)\n//       -> sumTo(2) вызывает sumTo(1)\n//          -> sumTo(1) возвращает 1  [БАЗА]\n//       <- sumTo(2) возвращает 2 + 1 = 3\n//    <- sumTo(3) возвращает 3 + 3 = 6\n// <- sumTo(4) возвращает 4 + 6 = 10\n\nSystem.out.println(sumTo(4));  // 10' },
        { type: 'tip', value: 'Рекурсия идёт в две стороны: сначала "вглубь" (вызовы накапливаются), потом "обратно" (результаты собираются). Это как загнуть бумагу и разогнуть обратно.' }
      ]
    },
    {
      id: 3,
      title: 'Факториал',
      type: 'theory',
      content: [
        { type: 'text', value: 'Факториал — классическая задача для изучения рекурсии. n! = n * (n-1) * (n-2) * ... * 2 * 1. Например: 5! = 5 * 4 * 3 * 2 * 1 = 120.' },
        { type: 'tip', value: 'Факториал — это "сколько способов расставить n предметов в ряд". 3 предмета (A, B, C): ABC, ACB, BAC, BCA, CAB, CBA — 6 способов = 3! = 6.' },
        { type: 'heading', value: 'Рекурсивный факториал' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static long factorial(int n) {\n        // Базовый случай: 0! = 1, 1! = 1\n        if (n <= 1) {\n            return 1;\n        }\n        // Рекурсивный случай: n! = n * (n-1)!\n        return (long) n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        for (int i = 0; i <= 10; i++) {\n            System.out.println(i + "! = " + factorial(i));\n        }\n    }\n}\n// 0! = 1\n// 1! = 1\n// 2! = 2\n// 3! = 6\n// 4! = 24\n// 5! = 120\n// ...\n// 10! = 3628800' },
        { type: 'heading', value: 'Рекурсия vs цикл для факториала' },
        { type: 'code', language: 'java', value: '// Итеративный (с циклом) — тоже правильно!\nstatic long factorialLoop(int n) {\n    long result = 1;\n    for (int i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Рекурсивный — элегантнее, но использует больше памяти\nstatic long factorialRecursive(int n) {\n    if (n <= 1) return 1;\n    return (long) n * factorialRecursive(n - 1);\n}' },
        { type: 'note', value: 'Для факториала итеративный вариант (с циклом) работает быстрее и не рискует переполнить стек. Рекурсия здесь — учебный пример. Для реальных задач оба подхода хороши.' }
      ]
    },
    {
      id: 4,
      title: 'Числа Фибоначчи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Числа Фибоначчи: 0, 1, 1, 2, 3, 5, 8, 13, 21... Каждое число — сумма двух предыдущих. Они встречаются в природе: лепестки цветов, спирали ракушек, рост растений.' },
        { type: 'heading', value: 'Рекурсивный Фибоначчи' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static long fib(int n) {\n        // Два базовых случая!\n        if (n == 0) return 0;\n        if (n == 1) return 1;\n        // Рекурсивный случай: fib(n) = fib(n-1) + fib(n-2)\n        return fib(n - 1) + fib(n - 2);\n    }\n\n    public static void main(String[] args) {\n        System.out.print("Фибоначчи: ");\n        for (int i = 0; i <= 10; i++) {\n            System.out.print(fib(i) + " ");\n        }\n        // Фибоначчи: 0 1 1 2 3 5 8 13 21 34 55\n    }\n}' },
        { type: 'heading', value: 'Проблема рекурсивного Фибоначчи' },
        { type: 'code', language: 'java', value: '// fib(5) вычисляет:\n//   fib(4) + fib(3)\n//   = (fib(3) + fib(2)) + (fib(2) + fib(1))\n//   = ((fib(2)+fib(1)) + (fib(1)+fib(0))) + ((fib(1)+fib(0)) + 1)\n// fib(2) вычисляется 3 раза! Очень расточительно!\n\n// При fib(40) — миллиарды лишних вычислений!\n// Быстрый итеративный вариант:\nstatic long fibFast(int n) {\n    if (n <= 1) return n;\n    long a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        long temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}' },
        { type: 'warning', value: 'Простой рекурсивный Фибоначчи очень медленный! fib(50) будет считаться минуты. Это хороший пример, где рекурсия элегантна, но неэффективна. В реальности используй итеративный вариант.' }
      ]
    },
    {
      id: 5,
      title: 'Рекурсивное мышление',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рекурсивное мышление — это способность разбить задачу на меньшую версию той же задачи. Спроси себя: "Если бы я умел решать задачу для (n-1), смог бы решить для n?"' },
        { type: 'heading', value: 'Разворот строки рекурсивно' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static String reverse(String s) {\n        // Базовый случай: пустая строка или один символ\n        if (s.length() <= 1) {\n            return s;\n        }\n        // Берём последний символ + разворот остальных\n        return s.charAt(s.length() - 1) + reverse(s.substring(0, s.length() - 1));\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverse("Java"));    // avaJ\n        System.out.println(reverse("Привет"));  // тевирП\n    }\n}' },
        { type: 'heading', value: 'Проверка палиндрома' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    static boolean isPalindrome(String s) {\n        // Базовый случай: строка длиной 0 или 1 — палиндром\n        if (s.length() <= 1) return true;\n        // Первый и последний символ должны совпадать\n        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;\n        // Проверяем середину\n        return isPalindrome(s.substring(1, s.length() - 1));\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPalindrome("level"));   // true\n        System.out.println(isPalindrome("radar"));   // true\n        System.out.println(isPalindrome("hello"));   // false\n        System.out.println(isPalindrome("abcba"));   // true\n    }\n}' },
        { type: 'heading', value: 'Возведение в степень (быстрое)' },
        { type: 'code', language: 'java', value: 'public class Main {\n\n    // Быстрое возведение в степень O(log n)\n    static long power(long base, int exp) {\n        if (exp == 0) return 1;  // base^0 = 1\n        if (exp % 2 == 0) {\n            long half = power(base, exp / 2);\n            return half * half;  // base^n = (base^(n/2))^2\n        }\n        return base * power(base, exp - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(power(2, 10));  // 1024\n        System.out.println(power(3, 5));   // 243\n    }\n}' },
        { type: 'tip', value: 'Рецепт рекурсии: 1) Найди базовый случай (самый простой вариант). 2) Предположи, что метод умеет решать меньшую задачу. 3) Реши текущую задачу используя решение меньшей.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сумма цифр и степень',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши два рекурсивных метода: 1) sumOfDigits(int n) — возвращает сумму цифр числа рекурсивно. 2) power(int base, int exp) — возвращает base^exp рекурсивно. Протестируй оба метода.',
      requirements: [
        'sumOfDigits(12345) должен вернуть 15 (1+2+3+4+5)',
        'sumOfDigits использует n % 10 для последней цифры и n / 10 для остальных',
        'power(2, 8) должен вернуть 256',
        'power использует base * power(base, exp-1) для рекурсии',
        'Для обоих методов ясно укажи базовый случай'
      ],
      expectedOutput: 'Сумма цифр 12345: 15\nСумма цифр 99999: 45\nСумма цифр 7: 7\n2^8 = 256\n3^4 = 81\n10^3 = 1000',
      hint: 'sumOfDigits(n): базовый — n < 10, возвращаем n. Иначе — n%10 + sumOfDigits(n/10). power(base,exp): базовый — exp==0, возвращаем 1. Иначе — base * power(base, exp-1).',
      solution: 'public class Main {\n\n    static int sumOfDigits(int n) {\n        if (n < 10) {\n            return n;  // базовый: однозначное число — само является суммой\n        }\n        return n % 10 + sumOfDigits(n / 10);  // последняя цифра + сумма остальных\n    }\n\n    static long power(int base, int exp) {\n        if (exp == 0) {\n            return 1;  // базовый: любое число в степени 0 = 1\n        }\n        return base * power(base, exp - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Сумма цифр 12345: " + sumOfDigits(12345));\n        System.out.println("Сумма цифр 99999: " + sumOfDigits(99999));\n        System.out.println("Сумма цифр 7: " + sumOfDigits(7));\n\n        System.out.println("2^8 = " + power(2, 8));\n        System.out.println("3^4 = " + power(3, 4));\n        System.out.println("10^3 = " + power(10, 3));\n    }\n}',
      explanation: 'sumOfDigits: n%10 берёт последнюю цифру (12345%10 = 5), n/10 отрезает её (12345/10 = 1234). Рекурсивно обрабатываем оставшееся число. power: exp уменьшается на 1 каждый раз, пока не достигнет 0 (базовый случай). Оба метода решают задачу для n через решение для n-1.'
    }
  ]
}
