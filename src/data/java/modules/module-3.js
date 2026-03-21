export default {
  id: 3,
  title: 'Операторы',
  description: 'Арифметические, операторы присваивания, сравнения, логические, инкремент и декремент, приоритеты',
  lessons: [
    {
      id: 1,
      title: 'Арифметические операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Арифметические операторы — это символы, с помощью которых Java умеет считать. Как в обычной математике: плюс, минус, умножить, разделить.' },
        { type: 'tip', value: 'Представь, что операторы — это кнопки калькулятора. Ты нажимаешь + — компьютер складывает. Нажимаешь * — умножает. Всё просто!' },
        { type: 'heading', value: 'Все арифметические операторы' },
        { type: 'code', language: 'java', value: 'int a = 10;\nint b = 3;\n\nSystem.out.println(a + b);  // 13 — сложение\nSystem.out.println(a - b);  // 7  — вычитание\nSystem.out.println(a * b);  // 30 — умножение\nSystem.out.println(a / b);  // 3  — деление (целая часть)\nSystem.out.println(a % b);  // 1  — остаток от деления' },
        { type: 'heading', value: 'Оператор % — остаток от деления' },
        { type: 'text', value: 'Оператор % (модуль) — один из самых полезных. Он показывает, сколько "осталось" после деления. Например, 10 % 3 = 1, потому что 10 = 3*3 + 1.' },
        { type: 'code', language: 'java', value: 'System.out.println(10 % 3);  // 1  (10 = 3*3 + 1)\nSystem.out.println(15 % 5);  // 0  (15 делится без остатка)\nSystem.out.println(7 % 2);   // 1  (нечётное число)\nSystem.out.println(8 % 2);   // 0  (чётное число)' },
        { type: 'note', value: 'С помощью % легко проверить, чётное ли число: если number % 2 == 0, то чётное, иначе нечётное. Это очень популярный приём!' },
        { type: 'heading', value: 'Деление целых чисел' },
        { type: 'code', language: 'java', value: '// Деление int на int — результат int (дробь отрезается)\nSystem.out.println(10 / 3);    // 3, не 3.33!\nSystem.out.println(7 / 2);     // 3, не 3.5!\n\n// Чтобы получить дробный результат — используй double\nSystem.out.println(10.0 / 3);  // 3.3333333333333335\nSystem.out.println(7.0 / 2);   // 3.5\n\n// Или приведи к double:\nint x = 10;\nint y = 3;\nSystem.out.println((double) x / y);  // 3.3333...' },
        { type: 'warning', value: 'Никогда не делите на ноль! int / 0 вызовет ошибку ArithmeticException и программа упадёт. double / 0.0 даст Infinity, но это тоже нехорошо.' }
      ]
    },
    {
      id: 2,
      title: 'Операторы присваивания',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мы уже знаем простое присваивание =. Но в Java есть укороченные операторы, которые одновременно выполняют действие и присваивают результат. Они экономят время и делают код короче.' },
        { type: 'tip', value: 'Представь: у тебя на счёте 100 рублей. Ты говоришь "добавь 50 рублей". Вместо balance = balance + 50 можно написать balance += 50. Короче и понятнее!' },
        { type: 'heading', value: 'Все операторы присваивания' },
        { type: 'code', language: 'java', value: 'int x = 10;\n\nx += 5;  // то же что x = x + 5;  -> x = 15\nx -= 3;  // то же что x = x - 3;  -> x = 12\nx *= 2;  // то же что x = x * 2;  -> x = 24\nx /= 4;  // то же что x = x / 4;  -> x = 6\nx %= 4;  // то же что x = x % 4;  -> x = 2\n\nSystem.out.println(x);  // 2' },
        { type: 'heading', value: 'Примеры из жизни' },
        { type: 'code', language: 'java', value: '// Счёт в игре\nint score = 0;\nscore += 10;  // убил монстра — +10 очков\nscore += 25;  // нашёл сокровище — +25 очков\nscore -= 5;   // получил урон — -5 очков\nSystem.out.println("Счёт: " + score);  // Счёт: 30\n\n// Цена со скидкой\ndouble price = 1000.0;\nprice *= 0.8;  // скидка 20% — умножаем на 0.8\nSystem.out.println("Цена со скидкой: " + price);  // 800.0\n\n// Делим пиццу\nint pizzaSlices = 8;\npizzaSlices /= 2;  // отдали половину другу\nSystem.out.println("Нам осталось: " + pizzaSlices);  // 4' },
        { type: 'note', value: 'Эти операторы работают с любым числовым типом: int, long, double, float. Используй их вместо длинной записи — это хороший стиль кода.' }
      ]
    },
    {
      id: 3,
      title: 'Операторы сравнения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы сравнения сравнивают два значения и возвращают результат типа boolean (true или false). Они нужны для принятия решений в программе.' },
        { type: 'tip', value: 'Это как вопросы: "Ты старше 18?" — true или false. "Эта цена ниже 500?" — true или false. Компьютер всегда отвечает на такие вопросы "да" (true) или "нет" (false).' },
        { type: 'heading', value: 'Все операторы сравнения' },
        { type: 'code', language: 'java', value: 'int a = 10;\nint b = 5;\n\nSystem.out.println(a == b);  // false — равно?\nSystem.out.println(a != b);  // true  — не равно?\nSystem.out.println(a > b);   // true  — больше?\nSystem.out.println(a < b);   // false — меньше?\nSystem.out.println(a >= b);  // true  — больше или равно?\nSystem.out.println(a <= b);  // false — меньше или равно?' },
        { type: 'warning', value: 'Очень частая ошибка: = и ==. Один знак = — это присваивание (положить значение). Два знака == — это сравнение (проверить равны ли). if (a = 5) — ошибка! Нужно if (a == 5).' },
        { type: 'heading', value: 'Сохранение результата сравнения' },
        { type: 'code', language: 'java', value: 'int age = 20;\nboolean isAdult = age >= 18;       // true\nboolean isMinor = age < 18;        // false\nboolean canVote = age >= 18;       // true\nboolean isExactly20 = age == 20;   // true\n\nSystem.out.println("Взрослый: " + isAdult);\nSystem.out.println("Может голосовать: " + canVote);\n\n// Проверяем диапазон — температура комфортная?\nint temp = 22;\nboolean notTooHot = temp <= 28;\nboolean notTooCold = temp >= 18;\nSystem.out.println("Не жарко: " + notTooHot);\nSystem.out.println("Не холодно: " + notTooCold);' },
        { type: 'heading', value: 'Сравнение с числами разных типов' },
        { type: 'code', language: 'java', value: 'int x = 5;\ndouble y = 5.0;\nSystem.out.println(x == y);  // true — Java автоматически преобразует\n\nint price = 100;\nSystem.out.println(price >= 100);  // true (больше ИЛИ равно)\nSystem.out.println(price > 100);   // false (строго больше)' }
      ]
    },
    {
      id: 4,
      title: 'Логические операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логические операторы позволяют объединять несколько условий вместе. Например: "идёт дождь И нет зонта" — тогда промокнешь. Или "пятница ИЛИ суббота" — выходной день.' },
        { type: 'heading', value: 'Оператор && (И, AND)' },
        { type: 'text', value: 'Результат true только когда ОБА условия true. Достаточно одного false — результат false.' },
        { type: 'code', language: 'java', value: 'int age = 25;\nboolean hasLicense = true;\n\n// Можно ли водить машину?\nboolean canDrive = age >= 18 && hasLicense;\nSystem.out.println("Можно водить: " + canDrive);  // true\n\n// Таблица истинности &&\nSystem.out.println(true && true);   // true\nSystem.out.println(true && false);  // false\nSystem.out.println(false && true);  // false\nSystem.out.println(false && false); // false' },
        { type: 'heading', value: 'Оператор || (ИЛИ, OR)' },
        { type: 'text', value: 'Результат true когда ХОТЯ БЫ ОДНО условие true. Оба должны быть false, чтобы результат был false.' },
        { type: 'code', language: 'java', value: 'int day = 6;  // 6 = суббота\n\n// Выходной — суббота или воскресенье?\nboolean isWeekend = day == 6 || day == 7;\nSystem.out.println("Выходной: " + isWeekend);  // true\n\n// Таблица истинности ||\nSystem.out.println(true || true);   // true\nSystem.out.println(true || false);  // true\nSystem.out.println(false || true);  // true\nSystem.out.println(false || false); // false' },
        { type: 'heading', value: 'Оператор ! (НЕ, NOT)' },
        { type: 'text', value: 'Переворачивает значение: true становится false, false становится true.' },
        { type: 'code', language: 'java', value: 'boolean isRaining = false;\nboolean isNotRaining = !isRaining;\nSystem.out.println("Дождя нет: " + isNotRaining);  // true\n\nboolean isStudent = true;\nSystem.out.println("Не студент: " + !isStudent);   // false\n\n// Пример использования:\nint speed = 120;\nboolean isSpeedOk = speed <= 110;\nboolean isSpeeding = !isSpeedOk;\nSystem.out.println("Превышение скорости: " + isSpeeding);  // true' },
        { type: 'tip', value: 'Запомни так: && = "и то, и другое", || = "хотя бы одно", ! = "наоборот". Это базовая логика — как в математике множества.' },
        { type: 'heading', value: 'Комбинирование операторов' },
        { type: 'code', language: 'java', value: 'int age = 22;\ndouble salary = 50000;\nboolean hasJob = true;\n\n// Можно ли взять кредит?\nboolean canGetLoan = age >= 21 && salary >= 30000 && hasJob;\nSystem.out.println("Кредит одобрен: " + canGetLoan);  // true\n\n// Бесплатный вход — ребёнок до 5 или пенсионер старше 65?\nboolean isFreeEntry = age < 5 || age > 65;\nSystem.out.println("Бесплатный вход: " + isFreeEntry);  // false' }
      ]
    },
    {
      id: 5,
      title: 'Инкремент и декремент',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очень часто нужно увеличить переменную на 1 или уменьшить на 1. Для этого есть специальные операторы — инкремент ++ и декремент --.' },
        { type: 'tip', value: 'Думай о ++ как о "шаг вперёд" (на один больше), а о -- как о "шаг назад" (на один меньше). Как будто идёшь по лестнице — одна ступенька вверх или вниз.' },
        { type: 'heading', value: 'Инкремент ++' },
        { type: 'code', language: 'java', value: 'int count = 0;\ncount++;  // то же что count = count + 1\nSystem.out.println(count);  // 1\ncount++;\nSystem.out.println(count);  // 2\ncount++;\nSystem.out.println(count);  // 3' },
        { type: 'heading', value: 'Декремент --' },
        { type: 'code', language: 'java', value: 'int lives = 3;\nlives--;  // то же что lives = lives - 1\nSystem.out.println("Жизни: " + lives);  // 2\nlives--;\nSystem.out.println("Жизни: " + lives);  // 1\nlives--;\nSystem.out.println("Жизни: " + lives);  // 0' },
        { type: 'heading', value: 'Префиксная и постфиксная формы' },
        { type: 'text', value: 'Важное отличие: ++ можно писать ДО или ПОСЛЕ переменной. Результат разный!' },
        { type: 'code', language: 'java', value: 'int a = 5;\n\n// Постфиксный: сначала вернуть значение, потом увеличить\nint b = a++;  // b = 5 (старое значение), a стал 6\nSystem.out.println("a = " + a + ", b = " + b);  // a=6, b=5\n\nint x = 5;\n// Префиксный: сначала увеличить, потом вернуть значение\nint y = ++x;  // x стал 6, y = 6 (новое значение)\nSystem.out.println("x = " + x + ", y = " + y);  // x=6, y=6' },
        { type: 'warning', value: 'Разница между a++ и ++a важна только тогда, когда ты используешь значение в том же выражении. Если просто пишешь count++ на отдельной строке — разницы нет.' },
        { type: 'note', value: 'Инкремент очень часто используется в циклах: for (int i = 0; i < 10; i++). Без него циклы было бы неудобно писать.' }
      ]
    },
    {
      id: 6,
      title: 'Приоритет операторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда в выражении несколько операторов, Java выполняет их в определённом порядке. Это называется приоритет операторов — как правило "умножение раньше сложения" в математике.' },
        { type: 'tip', value: 'Помнишь правило из школы: сначала умножение и деление, потом сложение и вычитание? В Java то же самое, только операторов больше.' },
        { type: 'heading', value: 'Приоритет от высшего к низшему' },
        { type: 'list', items: [
          '1. Скобки () — самый высокий приоритет',
          '2. Унарные: ++ -- ! (минус перед числом)',
          '3. Умножение, деление, остаток: * / %',
          '4. Сложение и вычитание: + -',
          '5. Сравнение: < <= > >=',
          '6. Равенство: == !=',
          '7. Логическое И: &&',
          '8. Логическое ИЛИ: ||',
          '9. Присваивание: = += -= и т.д.'
        ]},
        { type: 'code', language: 'java', value: '// Без скобок: * выполняется раньше +\nint result1 = 2 + 3 * 4;   // 2 + 12 = 14\nSystem.out.println(result1);  // 14\n\n// Со скобками: сначала то, что в скобках\nint result2 = (2 + 3) * 4;  // 5 * 4 = 20\nSystem.out.println(result2);  // 20\n\n// Цепочка сравнений\nint x = 5;\nboolean res = x > 2 && x < 10;  // сначала >, потом <, потом &&\nSystem.out.println(res);  // true' },
        { type: 'code', language: 'java', value: '// Порядок выполнения в сложном выражении\nint a = 10, b = 5, c = 2;\n\n// Что здесь вычисляется?\nint result = a + b * c - a / b;\n// Шаг 1: b * c = 5 * 2 = 10\n// Шаг 2: a / b = 10 / 5 = 2\n// Шаг 3: a + 10 - 2 = 10 + 10 - 2 = 18\nSystem.out.println(result);  // 18\n\n// С явными скобками — понятнее:\nint sameResult = a + (b * c) - (a / b);\nSystem.out.println(sameResult);  // тоже 18' },
        { type: 'tip', value: 'Совет: если не уверен в порядке — ставь скобки! Лучше написать (a + b) * c и быть уверенным, чем думать, вспоминать и ошибиться. Скобки делают код понятнее.' },
        { type: 'code', language: 'java', value: '// Логические операторы: && имеет приоритет выше ||\nboolean res1 = true || false && false;\n// false && false = false, потом true || false = true\nSystem.out.println(res1);  // true\n\n// Со скобками — другой результат!\nboolean res2 = (true || false) && false;\n// true || false = true, потом true && false = false\nSystem.out.println(res2);  // false' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Операторы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая проверяет, может ли человек зарегистрироваться на сайте. Для регистрации нужно: возраст от 13 до 99 лет, имя пользователя длиннее 3 символов, пароль длиннее 7 символов.',
      requirements: [
        'Создай переменные: int age = 16, int usernameLength = 5, int passwordLength = 8',
        'Проверь каждое условие отдельно с помощью boolean переменных',
        'Создай итоговую переменную canRegister, объединив все условия через &&',
        'Выведи результат каждой проверки и итог'
      ],
      expectedOutput: 'Возраст подходит: true\nИмя пользователя подходит: true\nПароль подходит: true\nМожно зарегистрироваться: true',
      hint: 'Возраст от 13 до 99 — это age >= 13 && age <= 99. Для имени — usernameLength > 3. Для пароля — passwordLength > 7.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int age = 16;\n        int usernameLength = 5;\n        int passwordLength = 8;\n\n        boolean ageOk = age >= 13 && age <= 99;\n        boolean usernameOk = usernameLength > 3;\n        boolean passwordOk = passwordLength > 7;\n        boolean canRegister = ageOk && usernameOk && passwordOk;\n\n        System.out.println("Возраст подходит: " + ageOk);\n        System.out.println("Имя пользователя подходит: " + usernameOk);\n        System.out.println("Пароль подходит: " + passwordOk);\n        System.out.println("Можно зарегистрироваться: " + canRegister);\n    }\n}',
      explanation: 'Мы разбили сложное условие на части. age >= 13 && age <= 99 проверяет диапазон — оба условия должны быть true. Затем объединяем все три проверки через && — все три должны быть true для регистрации.'
    }
  ]
}
