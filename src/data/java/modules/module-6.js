export default {
  id: 6,
  title: 'Циклы: while и do-while',
  description: 'Учимся повторять действия: цикл while, счётчики, бесконечные циклы с break, цикл do-while и оператор continue',
  lessons: [
    {
      id: 1,
      title: 'Цикл while: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цикл while повторяет блок кода снова и снова, пока условие остаётся true. Как только условие стало false — цикл заканчивается.' },
        { type: 'tip', value: 'Представь, что ты моешь посуду. Пока есть грязные тарелки (условие: true) — моешь. Когда тарелок не осталось (условие: false) — остановился. while делает то же самое!' },
        { type: 'heading', value: 'Синтаксис while' },
        { type: 'code', language: 'java', value: '// Структура:\n// while (условие) {\n//     код, который повторяется\n// }\n\nint count = 1;\n\nwhile (count <= 5) {\n    System.out.println("Шаг: " + count);\n    count++;  // ВАЖНО: изменяем переменную, иначе цикл не остановится!\n}\n\nSystem.out.println("Готово!");\n// Вывод:\n// Шаг: 1\n// Шаг: 2\n// Шаг: 3\n// Шаг: 4\n// Шаг: 5\n// Готово!' },
        { type: 'heading', value: 'Обратный отсчёт' },
        { type: 'code', language: 'java', value: 'int countdown = 10;\n\nwhile (countdown > 0) {\n    System.out.println("До старта: " + countdown);\n    countdown--;  // уменьшаем на 1\n}\n\nSystem.out.println("Пуск!");' },
        { type: 'heading', value: 'Сумма чисел' },
        { type: 'code', language: 'java', value: '// Сумма чисел от 1 до 100\nint sum = 0;\nint i = 1;\n\nwhile (i <= 100) {\n    sum += i;  // прибавляем i к сумме\n    i++;\n}\n\nSystem.out.println("Сумма 1..100 = " + sum);  // 5050' },
        { type: 'warning', value: 'Всегда убеждайся, что условие когда-нибудь станет false! Если забыть count++ — цикл будет работать вечно (бесконечный цикл). Программа "зависнет".' }
      ]
    },
    {
      id: 2,
      title: 'Счётчики и накопители',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два самых частых паттерна в циклах — счётчик (считает итерации) и накопитель (накапливает результат). Их понимание открывает путь к решению множества задач.' },
        { type: 'heading', value: 'Счётчик — считаем события' },
        { type: 'code', language: 'java', value: '// Считаем чётные числа от 1 до 20\nint count = 0;    // счётчик\nint num = 1;\n\nwhile (num <= 20) {\n    if (num % 2 == 0) {\n        count++;  // нашли чётное — увеличиваем счётчик\n    }\n    num++;\n}\n\nSystem.out.println("Чётных чисел: " + count);  // 10' },
        { type: 'heading', value: 'Накопитель — собираем результат' },
        { type: 'code', language: 'java', value: '// Произведение чисел от 1 до 5 (факториал 5!)\nlong product = 1;  // накопитель (начинаем с 1 для умножения)\nint n = 1;\n\nwhile (n <= 5) {\n    product *= n;  // умножаем накопитель на текущее число\n    System.out.println(n + "! = " + product);\n    n++;\n}\n// 1! = 1\n// 2! = 2\n// 3! = 6\n// 4! = 24\n// 5! = 120' },
        { type: 'heading', value: 'Поиск цифр в числе' },
        { type: 'code', language: 'java', value: '// Сколько цифр в числе?\nint number = 123456;\nint digitCount = 0;\n\nwhile (number > 0) {\n    number /= 10;  // отрезаем последнюю цифру\n    digitCount++;\n}\n\nSystem.out.println("Количество цифр: " + digitCount);  // 6' },
        { type: 'heading', value: 'Комбинирование' },
        { type: 'code', language: 'java', value: '// Сумма и количество чётных чисел одновременно\nint sumEven = 0;\nint countEven = 0;\nint i = 1;\n\nwhile (i <= 30) {\n    if (i % 2 == 0) {\n        sumEven += i;\n        countEven++;\n    }\n    i++;\n}\n\nSystem.out.println("Количество чётных: " + countEven);  // 15\nSystem.out.println("Сумма чётных: " + sumEven);          // 240' },
        { type: 'tip', value: 'Накопитель для суммы начинается с 0 (нейтральный элемент сложения). Накопитель для произведения начинается с 1 (нейтральный элемент умножения). Это важно!' }
      ]
    },
    {
      id: 3,
      title: 'Бесконечные циклы и break',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда заранее не знаешь, сколько раз нужно повторить код. Тогда используют намеренно бесконечный цикл и выходят из него с помощью break в нужный момент.' },
        { type: 'heading', value: 'Бесконечный цикл' },
        { type: 'code', language: 'java', value: '// while (true) — никогда не останавливается само\n// Нужен break внутри!\n\nint num = 1;\n\nwhile (true) {\n    System.out.println("Число: " + num);\n    \n    if (num >= 5) {\n        break;  // выходим из цикла!\n    }\n    \n    num++;\n}\n\nSystem.out.println("Вышли из цикла");' },
        { type: 'heading', value: 'Поиск первого делителя' },
        { type: 'code', language: 'java', value: 'int target = 100;\nint divisor = 2;\n\nwhile (true) {\n    if (target % divisor == 0) {\n        System.out.println("Наименьший делитель " + target + ": " + divisor);\n        break;\n    }\n    divisor++;\n}\n// Наименьший делитель 100: 2' },
        { type: 'heading', value: 'Проверка числа Армстронга' },
        { type: 'code', language: 'java', value: '// Число Армстронга: сумма кубов цифр = само число\n// Например: 153 = 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153\nint num2 = 153;\nint original = num2;\nint sumCubes = 0;\n\nwhile (num2 > 0) {\n    int digit = num2 % 10;       // последняя цифра\n    sumCubes += digit * digit * digit;  // куб цифры\n    num2 /= 10;                  // убираем последнюю цифру\n}\n\nif (sumCubes == original) {\n    System.out.println(original + " — число Армстронга!");\n} else {\n    System.out.println(original + " — не число Армстронга");\n}' },
        { type: 'tip', value: 'while (true) с break внутри — законный и часто используемый паттерн. Но всегда убедись, что условие break когда-нибудь сработает. Иначе программа зависнет навечно.' }
      ]
    },
    {
      id: 4,
      title: 'Цикл do-while',
      type: 'theory',
      content: [
        { type: 'text', value: 'do-while похож на while, но с важным отличием: блок кода СНАЧАЛА выполняется, а ПОТОМ проверяется условие. Это значит, что тело цикла выполняется хотя бы один раз, даже если условие с самого начала false.' },
        { type: 'tip', value: 'Разница: while — "сначала проверяю, потом делаю". do-while — "сначала делаю, потом проверяю". Как с едой: do-while это попробовал ложку, потом решил есть ли ещё. while — сначала спросил хочу ли есть, потом ел.' },
        { type: 'heading', value: 'Синтаксис do-while' },
        { type: 'code', language: 'java', value: '// Структура:\n// do {\n//     код (выполняется всегда хотя бы раз)\n// } while (условие);\n//           ^\n//     Точка с запятой обязательна!\n\nint i = 1;\n\ndo {\n    System.out.println("Итерация: " + i);\n    i++;\n} while (i <= 5);\n\n// Вывод:\n// Итерация: 1\n// Итерация: 2\n// Итерация: 3\n// Итерация: 4\n// Итерация: 5' },
        { type: 'heading', value: 'Разница: while vs do-while' },
        { type: 'code', language: 'java', value: 'int x = 10;  // Условие (x < 5) с самого начала false!\n\n// while: тело НЕ выполнится ни разу\nwhile (x < 5) {\n    System.out.println("while: " + x);  // не выведется\n    x++;\n}\n\nx = 10;  // сброс\n\n// do-while: тело выполнится ОДИН раз, потом проверка\ndo {\n    System.out.println("do-while: " + x);  // выведется! "do-while: 10"\n    x++;\n} while (x < 5);  // false, выходим\n' },
        { type: 'heading', value: 'Ввод пин-кода (симуляция)' },
        { type: 'code', language: 'java', value: '// Симулируем ввод пин-кода\n// do-while идеален: показать запрос нужно хотя бы раз!\nint attempts = 0;\nint maxAttempts = 3;\nint pin = 1234;  // правильный пин\nint entered = 0; // симулируем введённый пин\n\ndo {\n    attempts++;\n    entered = 9999;  // "введённое" неверное значение\n    System.out.println("Попытка " + attempts + ": введён " + entered);\n    \n    if (entered == pin) {\n        System.out.println("Доступ разрешён!");\n        break;\n    } else {\n        System.out.println("Неверный пин!");\n    }\n} while (attempts < maxAttempts);\n\nif (attempts >= maxAttempts && entered != pin) {\n    System.out.println("Карта заблокирована!");\n}' },
        { type: 'note', value: 'do-while используется реже, чем while. Применяй его когда точно знаешь, что тело цикла должно выполниться хотя бы один раз: показ меню, первый запрос данных и т.п.' }
      ]
    },
    {
      id: 5,
      title: 'Оператор continue',
      type: 'theory',
      content: [
        { type: 'text', value: 'continue пропускает оставшуюся часть текущей итерации и переходит к следующей проверке условия. В отличие от break, который выходит из цикла, continue просто "пропускает шаг".' },
        { type: 'tip', value: 'Представь, что перебираешь стопку карточек. break — бросаешь все оставшиеся карточки и уходишь. continue — кладёшь текущую карточку в сторону и берёшь следующую.' },
        { type: 'heading', value: 'Пример с continue' },
        { type: 'code', language: 'java', value: '// Выводим числа от 1 до 10, пропуская нечётные\nint i = 0;\n\nwhile (i < 10) {\n    i++;\n    if (i % 2 != 0) {\n        continue;  // нечётное — пропускаем, переходим к следующей итерации\n    }\n    System.out.println(i);  // выводится только для чётных\n}\n// Вывод: 2 4 6 8 10 (каждое на своей строке)' },
        { type: 'heading', value: 'Фильтрация — пропускаем "плохие" значения' },
        { type: 'code', language: 'java', value: '// Суммируем числа, пропуская кратные 3\nint sum = 0;\nint num = 1;\n\nwhile (num <= 20) {\n    if (num % 3 == 0) {\n        num++;\n        continue;  // кратно 3 — пропускаем!\n    }\n    sum += num;\n    num++;\n}\n\nSystem.out.println("Сумма (без кратных 3): " + sum);' },
        { type: 'heading', value: 'FizzBuzz с continue' },
        { type: 'code', language: 'java', value: '// Выводим числа от 1 до 15\n// Пропускаем кратные 5, заменяем кратные 3 на "Fizz"\nint n = 1;\n\nwhile (n <= 15) {\n    if (n % 5 == 0) {\n        n++;\n        continue;  // пропускаем кратные 5\n    }\n    if (n % 3 == 0) {\n        System.out.println("Fizz");\n    } else {\n        System.out.println(n);\n    }\n    n++;\n}' },
        { type: 'warning', value: 'При использовании continue будь осторожен: убедись, что изменение переменной цикла (i++) происходит ДО continue, иначе переменная не изменится и цикл станет бесконечным!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Угадай число',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая симулирует игру "угадай число". Загаданное число = 42. Программа "угадывает" числа начиная с 1, увеличивая каждый раз на 7. Используй while с break.',
      requirements: [
        'Загаданное число: int secret = 42',
        'Начинаем с guess = 1 и каждую итерацию увеличиваем на 7',
        'Каждую итерацию выводи "Пробую: X"',
        'Когда угадали — выводи "Угадал! Число: X за Y попыток" и выходи из цикла',
        'Если за 20 попыток не угадали — выводи "Не угадал"'
      ],
      expectedOutput: 'Пробую: 1\nПробую: 8\nПробую: 15\nПробую: 22\nПробую: 29\nПробую: 36\nПробую: 43\nНе угадал',
      hint: 'В цикле увеличивай guess += 7 каждую итерацию. Условие выхода: guess == secret (тогда break) или attempts > 20.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int secret = 42;\n        int guess = 1;\n        int attempts = 0;\n        boolean found = false;\n\n        while (attempts < 20) {\n            attempts++;\n            System.out.println("Пробую: " + guess);\n\n            if (guess == secret) {\n                found = true;\n                System.out.println("Угадал! Число: " + guess + " за " + attempts + " попыток");\n                break;\n            }\n\n            guess += 7;\n        }\n\n        if (!found) {\n            System.out.println("Не угадал");\n        }\n    }\n}',
      explanation: 'Используем while с ограничением attempts < 20 — это защита от бесконечного цикла. Флаг found позволяет после цикла понять, нашли ли мы число. break прерывает цикл сразу после угадывания. Шаг 7 никогда не попадёт на 42 (42 = 6*7, но начинаем с 1, а 1 + 6*7 = 43), поэтому выводится "Не угадал".'
    },
    {
      id: 7,
      title: 'Практика: Таблица умножения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши программу, которая выводит таблицу умножения для числа, введённого пользователем (симулируем: число = 7), от 1 до 10. Пропускай (с помощью continue) строки где результат больше 50.',
      requirements: [
        'Число для таблицы: int n = 7',
        'Используй while от 1 до 10',
        'Если результат n * i > 50 — пропускай строку (continue) и выводи "7 * X = ... (пропущено)"',
        'Иначе выводи "7 * X = результат"'
      ],
      expectedOutput: '7 * 1 = 7\n7 * 2 = 14\n7 * 3 = 21\n7 * 4 = 28\n7 * 5 = 35\n7 * 6 = 42\n7 * 7 = 49\n7 * 8 = ... (пропущено)\n7 * 9 = ... (пропущено)\n7 * 10 = ... (пропущено)',
      hint: 'В цикле while (i <= 10): если n * i > 50, выводи пропущено и continue. Иначе выводи нормальный результат. Не забывай i++ до continue!',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int n = 7;\n        int i = 1;\n\n        while (i <= 10) {\n            int result = n * i;\n\n            if (result > 50) {\n                System.out.println(n + " * " + i + " = ... (пропущено)");\n                i++;\n                continue;\n            }\n\n            System.out.println(n + " * " + i + " = " + result);\n            i++;\n        }\n    }\n}',
      explanation: 'Обращаем внимание: i++ стоит ДО continue — это критично! Без этого при первом результате > 50 i никогда не изменится и цикл станет бесконечным. Всегда обновляй счётчик перед continue.'
    }
  ]
}
