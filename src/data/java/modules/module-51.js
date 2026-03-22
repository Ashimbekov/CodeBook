export default {
  id: 51,
  title: 'Практикум: Основы Java',
  description: 'Практические задачи на основы Java: переменные, приведение типов, арифметика, операторы сравнения, if/else, switch, тернарный оператор, составные условия',
  lessons: [
    {
      id: 1,
      title: 'Задача: Конвертер температур',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая переводит температуру из Цельсия в Фаренгейт и Кельвин. Используй переменные типа double и арифметические операции.',
      requirements: [
        'Задай переменную double celsius = 37.0',
        'Переведи в Фаренгейт по формуле: F = C * 9/5 + 32',
        'Переведи в Кельвины по формуле: K = C + 273.15',
        'Выведи все три значения с двумя знаками после запятой'
      ],
      expectedOutput: 'Температура в Цельсиях: 37.00\nТемпература в Фаренгейтах: 98.60\nТемпература в Кельвинах: 310.15',
      hint: 'Используй String.format("%.2f", значение) для форматирования. Будь внимателен: 9/5 в Java — это целочисленное деление! Пиши 9.0/5 или 9.0/5.0.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        double celsius = 37.0;\n\n        double fahrenheit = celsius * 9.0 / 5.0 + 32;\n        double kelvin = celsius + 273.15;\n\n        System.out.println("Температура в Цельсиях: " + String.format("%.2f", celsius));\n        System.out.println("Температура в Фаренгейтах: " + String.format("%.2f", fahrenheit));\n        System.out.println("Температура в Кельвинах: " + String.format("%.2f", kelvin));\n    }\n}',
      explanation: 'Ключевой момент — деление 9.0/5.0, а не 9/5. В Java деление двух целых чисел даёт целое число: 9/5 = 1, а не 1.8! Добавляя .0 мы делаем числа типа double, и деление становится вещественным: 9.0/5.0 = 1.8. String.format("%.2f", x) форматирует число с ровно двумя знаками после запятой.'
    },
    {
      id: 2,
      title: 'Задача: Калькулятор оценки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая по числовому баллу (0–100) определяет оценку по буквенной системе и выводит поздравление или совет.',
      requirements: [
        'Задай переменную int score = 85',
        'Используй if/else if/else для определения оценки',
        '90-100: "A — Отлично!", 75-89: "B — Хорошо!", 60-74: "C — Удовлетворительно", 0-59: "F — Неудовлетворительно"',
        'Если оценка A или B — выведи "Отличная работа!", иначе — "Нужно больше практики!"'
      ],
      expectedOutput: 'Балл: 85\nОценка: B — Хорошо!\nОтличная работа!',
      hint: 'Используй цепочку if/else if/else. Для второй части можно использовать тернарный оператор: String msg = (score >= 75) ? "Отличная работа!" : "Нужно больше практики!";',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n\n        String grade;\n        if (score >= 90) {\n            grade = "A — Отлично!";\n        } else if (score >= 75) {\n            grade = "B — Хорошо!";\n        } else if (score >= 60) {\n            grade = "C — Удовлетворительно";\n        } else {\n            grade = "F — Неудовлетворительно";\n        }\n\n        String advice = (score >= 75) ? "Отличная работа!" : "Нужно больше практики!";\n\n        System.out.println("Балл: " + score);\n        System.out.println("Оценка: " + grade);\n        System.out.println(advice);\n    }\n}',
      explanation: 'В цепочке if/else if условия проверяются сверху вниз, и выполняется первый подходящий блок. Порядок важен: мы начинаем с наибольшего порога (90), поэтому если score = 95, программа не дойдёт до проверки score >= 75. Тернарный оператор (условие ? значение_если_истина : значение_если_ложь) — удобное сокращение для простых if/else.'
    },
    {
      id: 3,
      title: 'Задача: Проверка високосного года',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая определяет, является ли год високосным. Год високосный если: делится на 4, но не на 100, ИЛИ делится на 400.',
      requirements: [
        'Задай переменную int year = 2024',
        'Используй составное логическое условие с &&, ||, !',
        'Выведи год и результат проверки',
        'Проверь также year = 1900 (не високосный) и year = 2000 (високосный)'
      ],
      expectedOutput: '2024: високосный год\n1900: не високосный год\n2000: високосный год',
      hint: 'Формула: (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0). Оберни проверку в метод boolean isLeap(int year) или просто вычисли boolean результат.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] years = {2024, 1900, 2000};\n\n        for (int year : years) {\n            boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n            String result = isLeap ? "високосный год" : "не високосный год";\n            System.out.println(year + ": " + result);\n        }\n    }\n}',
      explanation: 'Правило проверки високосного года состоит из двух частей, соединённых ||: первая часть (year % 4 == 0 && year % 100 != 0) — делится на 4, но НЕ на 100. Вторая часть (year % 400 == 0) — особый случай: каждые 400 лет год является исключением из правила "не на 100". Пример: 1900 делится на 100 и не делится на 400 — не високосный. 2000 делится на 400 — високосный. 2024 делится на 4 и не делится на 100 — високосный.'
    },
    {
      id: 4,
      title: 'Задача: Простой калькулятор',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши калькулятор, который выполняет базовые арифметические операции. Используй оператор switch для выбора операции.',
      requirements: [
        'Задай double a = 10.0, double b = 4.0, char op = \'+\'',
        'Используй switch по символу операции: +, -, *, /',
        'Для деления проверь делитель на ноль',
        'Выведи выражение и результат'
      ],
      expectedOutput: '10.0 + 4.0 = 14.0\n10.0 - 4.0 = 6.0\n10.0 * 4.0 = 40.0\n10.0 / 4.0 = 2.5\n10.0 / 0.0 = Ошибка: деление на ноль!',
      hint: 'В switch можно использовать char. Для деления добавь перед вычислением: if (b == 0) { ... break; }. Не забудь default в switch.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        double a = 10.0;\n        double[] bValues = {4.0, 4.0, 4.0, 4.0, 0.0};\n        char[] ops = {\'+\', \'-\', \'*\', \'/\', \'/\'};\n\n        for (int i = 0; i < ops.length; i++) {\n            double b = bValues[i];\n            char op = ops[i];\n            String expr = a + " " + op + " " + b + " = ";\n\n            switch (op) {\n                case \'+\':\n                    System.out.println(expr + (a + b));\n                    break;\n                case \'-\':\n                    System.out.println(expr + (a - b));\n                    break;\n                case \'*\':\n                    System.out.println(expr + (a * b));\n                    break;\n                case \'/\':\n                    if (b == 0) {\n                        System.out.println(expr + "Ошибка: деление на ноль!");\n                    } else {\n                        System.out.println(expr + (a / b));\n                    }\n                    break;\n                default:\n                    System.out.println("Неизвестная операция: " + op);\n            }\n        }\n    }\n}',
      explanation: 'Switch по char — удобный способ реализовать калькулятор. Java умеет делать switch по типам char, int, String и enum. Каждый case обязательно должен заканчиваться break, иначе выполнение "провалится" в следующий case. Проверка деления на ноль — хорошая практика: без неё Java не выдаст исключение для double (вернёт Infinity), но такой результат бессмысленен.'
    },
    {
      id: 5,
      title: 'Задача: Калькулятор ИМТ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу для расчёта Индекса Массы Тела (ИМТ). ИМТ = вес (кг) / (рост (м))². По значению определи категорию и дай рекомендацию.',
      requirements: [
        'Задай double weight = 70.0, double height = 1.75',
        'Вычисли ИМТ = weight / (height * height)',
        'Категории: < 18.5 — Недостаточный вес, 18.5–24.9 — Норма, 25.0–29.9 — Избыточный вес, >= 30 — Ожирение',
        'Выведи ИМТ (1 знак) и категорию'
      ],
      expectedOutput: 'Вес: 70.0 кг, Рост: 1.75 м\nИМТ: 22.9\nКатегория: Норма\nРекомендация: Отличный показатель, поддерживайте форму!',
      hint: 'ИМТ вычисляется как weight / (height * height). Не надо import Math — простое умножение. Используй String.format("%.1f", bmi) для одного знака.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        double weight = 70.0;\n        double height = 1.75;\n\n        double bmi = weight / (height * height);\n\n        String category;\n        String recommendation;\n\n        if (bmi < 18.5) {\n            category = "Недостаточный вес";\n            recommendation = "Рекомендуется увеличить калорийность питания.";\n        } else if (bmi < 25.0) {\n            category = "Норма";\n            recommendation = "Отличный показатель, поддерживайте форму!";\n        } else if (bmi < 30.0) {\n            category = "Избыточный вес";\n            recommendation = "Рекомендуется умеренная физическая активность.";\n        } else {\n            category = "Ожирение";\n            recommendation = "Рекомендуется проконсультироваться с врачом.";\n        }\n\n        System.out.println("Вес: " + weight + " кг, Рост: " + height + " м");\n        System.out.println("ИМТ: " + String.format("%.1f", bmi));\n        System.out.println("Категория: " + category);\n        System.out.println("Рекомендация: " + recommendation);\n    }\n}',
      explanation: 'ИМТ — классическая задача на арифметику и ветвление. Формула weight / (height * height) использует скобки для правильного порядка: сначала вычисляется height * height = 3.0625, затем 70.0 / 3.0625 = 22.857... Мы используем цепочку if/else if, начиная с наименьшего порога, чтобы каждый диапазон обрабатывался ровно один раз. Форматирование "%.1f" даёт один знак после запятой: 22.9.'
    },
    {
      id: 6,
      title: 'Задача: Цена билета по возрасту',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая рассчитывает стоимость билета в кинотеатр с учётом возраста зрителя и времени сеанса.',
      requirements: [
        'Базовая цена: int basePrice = 1500 (тенге)',
        'Дети до 12 лет: скидка 50%, пенсионеры 65+: скидка 30%, студенты 18–25: скидка 20%',
        'Утренний сеанс (до 12:00) даёт дополнительную скидку 10% от итоговой цены',
        'Задай int age = 20, int hour = 10 и выведи финальную цену'
      ],
      expectedOutput: 'Возраст: 20 лет, Время сеанса: 10:00\nБазовая цена: 1500 тг\nСкидка для студента: 20%\nЦена после скидки по возрасту: 1200 тг\nДополнительная скидка (утренний сеанс): 10%\nИтоговая цена: 1080 тг',
      hint: 'Сначала вычисли скидку по возрасту (ageDiscount), потом примени её к basePrice. Затем проверь время и примени дополнительную скидку. int price = basePrice * (100 - ageDiscount) / 100.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int basePrice = 1500;\n        int age = 20;\n        int hour = 10;\n\n        int ageDiscount;\n        String category;\n\n        if (age < 12) {\n            ageDiscount = 50;\n            category = "ребёнка";\n        } else if (age >= 65) {\n            ageDiscount = 30;\n            category = "пенсионера";\n        } else if (age >= 18 && age <= 25) {\n            ageDiscount = 20;\n            category = "студента";\n        } else {\n            ageDiscount = 0;\n            category = "взрослого";\n        }\n\n        int priceAfterAge = basePrice * (100 - ageDiscount) / 100;\n\n        int morningDiscount = (hour < 12) ? 10 : 0;\n        int finalPrice = priceAfterAge * (100 - morningDiscount) / 100;\n\n        System.out.println("Возраст: " + age + " лет, Время сеанса: " + hour + ":00");\n        System.out.println("Базовая цена: " + basePrice + " тг");\n        if (ageDiscount > 0) {\n            System.out.println("Скидка для " + category + ": " + ageDiscount + "%");\n        }\n        System.out.println("Цена после скидки по возрасту: " + priceAfterAge + " тг");\n        if (morningDiscount > 0) {\n            System.out.println("Дополнительная скидка (утренний сеанс): " + morningDiscount + "%");\n        }\n        System.out.println("Итоговая цена: " + finalPrice + " тг");\n    }\n}',
      explanation: 'Задача применяет скидки последовательно, а не суммирует их. Сначала определяем возрастную скидку через if/else if. Формула price * (100 - discount) / 100 применяет скидку: 1500 * 80 / 100 = 1200. Затем применяем утреннюю скидку на уже сниженную цену: 1200 * 90 / 100 = 1080. Обратите внимание: 10 < 12 означает "утренний сеанс" (сеансы в 10:00 — это утро). Тернарный оператор элегантно устанавливает скидку в 0 если сеанс не утренний.'
    },
    {
      id: 7,
      title: 'Задача: Сезон по номеру месяца',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая по номеру месяца определяет текущее время года и выводит характеристику сезона. Используй switch с группировкой case.',
      requirements: [
        'Задай int month = 7',
        'Зима: 12, 1, 2 — "Зима: холодно, снег"',
        'Весна: 3, 4, 5 — "Весна: тепло, цветы"',
        'Лето: 6, 7, 8 — "Лето: жарко, каникулы"',
        'Осень: 9, 10, 11 — "Осень: прохладно, листопад"',
        'Проверь несколько месяцев: 7, 1, 4, 11'
      ],
      expectedOutput: 'Месяц 7: Лето: жарко, каникулы\nМесяц 1: Зима: холодно, снег\nМесяц 4: Весна: тепло, цветы\nМесяц 11: Осень: прохладно, листопад',
      hint: 'В switch несколько case могут вести к одному блоку кода — просто перечисли их подряд без break между ними. Например: case 6: case 7: case 8: System.out.println("Лето"); break;',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] months = {7, 1, 4, 11};\n\n        for (int month : months) {\n            String season;\n            switch (month) {\n                case 12:\n                case 1:\n                case 2:\n                    season = "Зима: холодно, снег";\n                    break;\n                case 3:\n                case 4:\n                case 5:\n                    season = "Весна: тепло, цветы";\n                    break;\n                case 6:\n                case 7:\n                case 8:\n                    season = "Лето: жарко, каникулы";\n                    break;\n                case 9:\n                case 10:\n                case 11:\n                    season = "Осень: прохладно, листопад";\n                    break;\n                default:\n                    season = "Неверный номер месяца";\n            }\n            System.out.println("Месяц " + month + ": " + season);\n        }\n    }\n}',
      explanation: 'Ключевая техника — группировка case в switch. Когда несколько case идут подряд без break между ними, они все ведут к одному и тому же блоку кода. Выполнение "проваливается" до первого break. Это удобно для задач типа "несколько значений дают один результат". default обрабатывает некорректный ввод (месяц < 1 или > 12) — хорошая защитная практика.'
    },
    {
      id: 8,
      title: 'Задача: Число прописью (1–10)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая переводит цифру от 1 до 10 в её словесное представление на русском языке, используя switch.',
      requirements: [
        'Задай int number = 7',
        'Используй switch по числу',
        'Каждое число от 1 до 10 должно выводиться прописью',
        'Для числа вне диапазона выведи "Число вне диапазона 1-10"',
        'Выведи несколько чисел: 1, 5, 7, 10, 0, 11'
      ],
      expectedOutput: '1 — один\n5 — пять\n7 — семь\n10 — десять\n0 — Число вне диапазона 1-10\n11 — Число вне диапазона 1-10',
      hint: 'Простой switch с уникальным case для каждого числа. Не забудь default для обработки чисел вне диапазона.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {1, 5, 7, 10, 0, 11};\n\n        for (int number : numbers) {\n            String word;\n            switch (number) {\n                case 1:  word = "один";    break;\n                case 2:  word = "два";     break;\n                case 3:  word = "три";     break;\n                case 4:  word = "четыре";  break;\n                case 5:  word = "пять";    break;\n                case 6:  word = "шесть";   break;\n                case 7:  word = "семь";    break;\n                case 8:  word = "восемь";  break;\n                case 9:  word = "девять";  break;\n                case 10: word = "десять";  break;\n                default: word = "Число вне диапазона 1-10";\n            }\n            System.out.println(number + " — " + word);\n        }\n    }\n}',
      explanation: 'Это классическое использование switch как "таблицы соответствий". Каждый case — отдельное число, break обязателен после каждого блока. Без break выполнение провалится в следующий case и выведет неверный результат. default — это ключевой элемент надёжного кода: всегда обрабатывай неожиданные значения.'
    },
    {
      id: 9,
      title: 'Задача: Минимум и максимум трёх чисел',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая находит минимальное и максимальное из трёх введённых чисел без использования массивов и методов Math.min/max — только с помощью операторов сравнения и if.',
      requirements: [
        'Задай int a = 15, int b = 7, int c = 23',
        'Найди максимум с помощью вложенных if или составных условий',
        'Найди минимум аналогично',
        'Выведи все три числа и результат',
        'Также вычисли среднее значение (с точностью до 1 знака)'
      ],
      expectedOutput: 'Числа: 15, 7, 23\nМаксимум: 23\nМинимум: 7\nСреднее: 15.0',
      hint: 'Для максимума: начни с int max = a. Затем if (b > max) max = b; и if (c > max) max = c;. Для среднего приведи к double: double avg = (double)(a + b + c) / 3;',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 15, b = 7, c = 23;\n\n        int max = a;\n        if (b > max) max = b;\n        if (c > max) max = c;\n\n        int min = a;\n        if (b < min) min = b;\n        if (c < min) min = c;\n\n        double avg = (double)(a + b + c) / 3;\n\n        System.out.println("Числа: " + a + ", " + b + ", " + c);\n        System.out.println("Максимум: " + max);\n        System.out.println("Минимум: " + min);\n        System.out.println("Среднее: " + String.format("%.1f", avg));\n    }\n}',
      explanation: 'Алгоритм поиска максимума/минимума основан на идее "текущий лидер": начинаем с предположения, что максимум — это первое число (int max = a). Затем по очереди сравниваем с остальными и обновляем max если нашли большее. Этот же паттерн работает для любого количества чисел — просто добавьте ещё if. Для среднего нужно (double)(a + b + c) / 3 — приведение к double важно, иначе получим целочисленное деление.'
    },
    {
      id: 10,
      title: 'Задача: Простой шифр сдвига',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй простейший шифр Цезаря для одного символа: сдвинь букву на заданное количество позиций в алфавите. Используй приведение типов char/int.',
      requirements: [
        'Задай char letter = \'A\', int shift = 3',
        'Зашифруй букву: сдвинь на shift позиций вперёд в ASCII',
        'Расшифруй: сдвинь на shift позиций назад',
        'Выведи исходную, зашифрованную и расшифрованную буквы',
        'Обработай сдвиг для строчных букв тоже: letter = \'z\', shift = 2 (должно стать \'b\')'
      ],
      expectedOutput: 'Буква: A, сдвиг: 3\nЗашифрованная: D\nРасшифрованная: A\n---\nБуква: z, сдвиг: 2\nЗашифрованная: b\nРасшифрованная: z',
      hint: 'Символ char можно привести к int: int code = (int) letter. Для циклического сдвига заглавных букв: char encrypted = (char)(\'A\' + (letter - \'A\' + shift) % 26). Аналогично для строчных с \'a\'.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        encryptAndDecrypt(\'A\', 3);\n        System.out.println("---");\n        encryptAndDecrypt(\'z\', 2);\n    }\n\n    static void encryptAndDecrypt(char letter, int shift) {\n        char encrypted;\n        char decrypted;\n\n        if (letter >= \'A\' && letter <= \'Z\') {\n            // Заглавные буквы: диапазон A-Z (65-90)\n            encrypted = (char)(\'A\' + (letter - \'A\' + shift) % 26);\n            decrypted = (char)(\'A\' + (encrypted - \'A\' - shift + 26) % 26);\n        } else if (letter >= \'a\' && letter <= \'z\') {\n            // Строчные буквы: диапазон a-z (97-122)\n            encrypted = (char)(\'a\' + (letter - \'a\' + shift) % 26);\n            decrypted = (char)(\'a\' + (encrypted - \'a\' - shift + 26) % 26);\n        } else {\n            System.out.println("Не буква латинского алфавита: " + letter);\n            return;\n        }\n\n        System.out.println("Буква: " + letter + ", сдвиг: " + shift);\n        System.out.println("Зашифрованная: " + encrypted);\n        System.out.println("Расшифрованная: " + decrypted);\n    }\n}',
      explanation: 'Шифр Цезаря работает через арифметику ASCII-кодов. Идея: вычтем из буквы базовый код (\'A\' или \'a\'), получим позицию в алфавите (0-25), добавим сдвиг, возьмём остаток от деления на 26 (чтобы сдвиг был цикличным: Z+1 = A), прибавим обратно базовый код. Например: \'z\' - \'a\' = 25, 25 + 2 = 27, 27 % 26 = 1, \'a\' + 1 = \'b\'. Для расшифровки вычитаем, но добавляем 26 перед % чтобы не получить отрицательное число: (encrypted - \'a\' - shift + 26) % 26.'
    }
  ]
}
