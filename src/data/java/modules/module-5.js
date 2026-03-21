export default {
  id: 5,
  title: 'Switch и тернарный оператор',
  description: 'Альтернатива if-else для множества вариантов: switch, и короткая запись условия — тернарный оператор',
  lessons: [
    {
      id: 1,
      title: 'Switch: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'switch — это способ выбрать один вариант из нескольких. Это как пульт от телевизора: нажал кнопку 1 — первый канал, кнопку 2 — второй, и так далее. Удобнее, чем писать много if-else if.' },
        { type: 'tip', value: 'Представь меню в кафе: смотришь на номер блюда и сразу переходишь к нужному. switch делает то же самое — "переключается" на нужный вариант без проверки каждого по очереди.' },
        { type: 'heading', value: 'Синтаксис switch' },
        { type: 'code', language: 'java', value: 'int day = 3;\nString dayName;\n\nswitch (day) {\n    case 1:\n        dayName = "Понедельник";\n        break;\n    case 2:\n        dayName = "Вторник";\n        break;\n    case 3:\n        dayName = "Среда";\n        break;\n    case 4:\n        dayName = "Четверг";\n        break;\n    case 5:\n        dayName = "Пятница";\n        break;\n    default:\n        dayName = "Выходной";\n}\n\nSystem.out.println("День: " + dayName);  // День: Среда' },
        { type: 'heading', value: 'Месяцы в году' },
        { type: 'code', language: 'java', value: 'int month = 7;\nint daysInMonth;\n\nswitch (month) {\n    case 1: case 3: case 5:\n    case 7: case 8: case 10: case 12:\n        daysInMonth = 31;\n        break;\n    case 4: case 6:\n    case 9: case 11:\n        daysInMonth = 30;\n        break;\n    case 2:\n        daysInMonth = 28;\n        break;\n    default:\n        daysInMonth = -1;  // ошибка\n}\n\nSystem.out.println("Дней в месяце: " + daysInMonth);  // 31' },
        { type: 'note', value: 'case можно писать подряд без break между ними — тогда они "проваливаются" в общий код. Это удобно для групп с одинаковым результатом.' }
      ]
    },
    {
      id: 2,
      title: 'Switch со строками',
      type: 'theory',
      content: [
        { type: 'text', value: 'С Java 7 switch работает не только с числами, но и со строками! Это очень удобно, например для обработки команд или выбора языка.' },
        { type: 'code', language: 'java', value: 'String language = "Java";\n\nswitch (language) {\n    case "Java":\n        System.out.println("Отличный выбор! Java используется везде.");\n        break;\n    case "Python":\n        System.out.println("Python — отличен для науки о данных!");\n        break;\n    case "JavaScript":\n        System.out.println("JavaScript — язык веба!");\n        break;\n    default:\n        System.out.println("Хороший язык: " + language);\n}' },
        { type: 'heading', value: 'Обработка команд' },
        { type: 'code', language: 'java', value: 'String command = "start";\n\nswitch (command) {\n    case "start":\n        System.out.println("Запускаем программу...");\n        break;\n    case "stop":\n        System.out.println("Останавливаем программу...");\n        break;\n    case "pause":\n        System.out.println("Пауза...");\n        break;\n    case "help":\n        System.out.println("Доступные команды: start, stop, pause, help");\n        break;\n    default:\n        System.out.println("Неизвестная команда: " + command);\n}' },
        { type: 'heading', value: 'Выбор сезона' },
        { type: 'code', language: 'java', value: 'String month = "июнь";\nString season;\n\nswitch (month) {\n    case "декабрь": case "январь": case "февраль":\n        season = "Зима";\n        break;\n    case "март": case "апрель": case "май":\n        season = "Весна";\n        break;\n    case "июнь": case "июль": case "август":\n        season = "Лето";\n        break;\n    case "сентябрь": case "октябрь": case "ноябрь":\n        season = "Осень";\n        break;\n    default:\n        season = "Неизвестно";\n}\n\nSystem.out.println(month + " — это " + season);  // июнь — это Лето' },
        { type: 'warning', value: 'switch со строками чувствителен к регистру! "Java" и "java" — разные значения. Если хочешь игнорировать регистр — используй .toLowerCase() перед switch.' }
      ]
    },
    {
      id: 3,
      title: 'break и default',
      type: 'theory',
      content: [
        { type: 'text', value: 'break и default — два ключевых элемента switch. Без их правильного использования switch будет работать не так, как ты ожидаешь.' },
        { type: 'heading', value: 'Что происходит без break?' },
        { type: 'text', value: 'Без break выполнение "проваливается" в следующий case. Это называется fall-through.' },
        { type: 'code', language: 'java', value: 'int x = 2;\n\nswitch (x) {\n    case 1:\n        System.out.println("Один");\n        // нет break — провалится дальше!\n    case 2:\n        System.out.println("Два");\n        // нет break — провалится дальше!\n    case 3:\n        System.out.println("Три");\n        break;\n    case 4:\n        System.out.println("Четыре");\n}\n// Вывод: Два\n//        Три' },
        { type: 'text', value: 'При x = 2: начинаем с case 2, выводим "Два". Нет break — проваливаемся в case 3, выводим "Три". Есть break — останавливаемся.' },
        { type: 'heading', value: 'Намеренный fall-through' },
        { type: 'code', language: 'java', value: '// Иногда fall-through нужен специально!\nint month = 4;\nboolean isSpring;\n\nswitch (month) {\n    case 3:\n    case 4:\n    case 5:\n        isSpring = true;  // Три месяца делят один код\n        break;\n    default:\n        isSpring = false;\n}\n\nSystem.out.println("Весна: " + isSpring);  // true' },
        { type: 'heading', value: 'default — случай по умолчанию' },
        { type: 'code', language: 'java', value: 'int rating = 6;  // Некорректное значение (должно быть 1-5)\n\nswitch (rating) {\n    case 5:\n        System.out.println("Отлично!");\n        break;\n    case 4:\n        System.out.println("Хорошо");\n        break;\n    case 3:\n        System.out.println("Нормально");\n        break;\n    case 1: case 2:\n        System.out.println("Плохо");\n        break;\n    default:\n        // Сработает при любом значении кроме 1-5\n        System.out.println("Некорректная оценка: " + rating);\n}' },
        { type: 'tip', value: 'Всегда добавляй default! Это защита на случай неожиданных значений. Даже если ты уверен, что таких значений не будет — они могут появиться. default как "поймай всё" в самом конце.' }
      ]
    },
    {
      id: 4,
      title: 'Тернарный оператор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тернарный оператор ?: — это очень короткая запись простого if-else. Называется тернарным, потому что берёт три части: условие, значение если true, значение если false.' },
        { type: 'tip', value: 'Тернарный оператор как мини-if: "дождь? возьми зонт : иди без зонта". Одна строка вместо четырёх. Удобно для простых случаев!' },
        { type: 'heading', value: 'Синтаксис и сравнение с if-else' },
        { type: 'code', language: 'java', value: '// Обычный if-else:\nint age = 20;\nString status;\nif (age >= 18) {\n    status = "взрослый";\n} else {\n    status = "ребёнок";\n}\n\n// Тернарный оператор — то же самое в одну строку!\nString status2 = age >= 18 ? "взрослый" : "ребёнок";\n\nSystem.out.println(status);   // взрослый\nSystem.out.println(status2);  // взрослый' },
        { type: 'heading', value: 'Формула: условие ? если_true : если_false' },
        { type: 'code', language: 'java', value: 'int a = 15, b = 7;\n\n// Максимум из двух чисел\nint max = a > b ? a : b;\nSystem.out.println("Максимум: " + max);  // 15\n\n// Минимум из двух чисел\nint min = a < b ? a : b;\nSystem.out.println("Минимум: " + min);  // 7\n\n// Чётное или нечётное?\nint num = 13;\nString parity = num % 2 == 0 ? "чётное" : "нечётное";\nSystem.out.println(num + " — " + parity);  // 13 — нечётное\n\n// Абсолютное значение\nint n = -42;\nint abs = n >= 0 ? n : -n;\nSystem.out.println("Модуль: " + abs);  // 42' },
        { type: 'heading', value: 'Использование прямо в println' },
        { type: 'code', language: 'java', value: 'int score = 88;\nSystem.out.println("Результат: " + (score >= 50 ? "Сдал" : "Не сдал"));\n\nboolean isLoggedIn = true;\nSystem.out.println("Статус: " + (isLoggedIn ? "Онлайн" : "Оффлайн"));\n\nint temperature = 32;\nSystem.out.println("Погода: " + (temperature > 25 ? "Жарко" : "Комфортно"));' },
        { type: 'warning', value: 'Не злоупотребляй тернарным оператором! Он хорош для простых случаев. Вложенные тернарные операторы (? внутри ?) делают код нечитаемым. В сложных случаях лучше обычный if-else.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Конвертер дней',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая переводит номер дня недели (1-7) в его название и определяет, рабочий это день или выходной. Используй switch для названия и тернарный оператор для типа дня.',
      requirements: [
        'Создай переменную int day = 6',
        'Используй switch для определения названия дня',
        'Используй тернарный оператор для определения "Рабочий" или "Выходной"',
        'Выведи результат'
      ],
      expectedOutput: 'День 6: Суббота\nТип: Выходной',
      hint: 'В switch для case 6 и 7 выведи выходные дни. Тернарный оператор: day >= 6 ? "Выходной" : "Рабочий".',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int day = 6;\n        String dayName;\n\n        switch (day) {\n            case 1: dayName = "Понедельник"; break;\n            case 2: dayName = "Вторник"; break;\n            case 3: dayName = "Среда"; break;\n            case 4: dayName = "Четверг"; break;\n            case 5: dayName = "Пятница"; break;\n            case 6: dayName = "Суббота"; break;\n            case 7: dayName = "Воскресенье"; break;\n            default: dayName = "Неверный день";\n        }\n\n        String type = day >= 6 ? "Выходной" : "Рабочий";\n\n        System.out.println("День " + day + ": " + dayName);\n        System.out.println("Тип: " + type);\n    }\n}',
      explanation: 'switch — идеальный инструмент когда есть ровно 7 чётких вариантов. Тернарный оператор красиво решает задачу "рабочий или выходной": суббота(6) и воскресенье(7) — выходные, всё остальное — рабочие.'
    },
    {
      id: 6,
      title: 'Практика: Калькулятор на switch',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу-калькулятор, который выполняет операцию между двумя числами в зависимости от символа операции (+, -, *, /). Обработай деление на ноль отдельно.',
      requirements: [
        'Создай переменные: double a = 15.0, double b = 4.0, char operation = \'*\'',
        'Используй switch по символу операции',
        'Для деления проверь через if, не равен ли b нулю',
        'В default выведи "Неизвестная операция"',
        'Выведи красивый результат вида "15.0 * 4.0 = 60.0"'
      ],
      expectedOutput: '15.0 * 4.0 = 60.0',
      hint: 'switch может работать с char. Внутри case \'+\' выполни сложение, в case \'-\' — вычитание, и так далее. В case \'/\' дополнительно проверь b != 0.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        double a = 15.0;\n        double b = 4.0;\n        char operation = \'*\';\n        double result;\n\n        switch (operation) {\n            case \'+\':\n                result = a + b;\n                System.out.println(a + " + " + b + " = " + result);\n                break;\n            case \'-\':\n                result = a - b;\n                System.out.println(a + " - " + b + " = " + result);\n                break;\n            case \'*\':\n                result = a * b;\n                System.out.println(a + " * " + b + " = " + result);\n                break;\n            case \'/\':\n                if (b != 0) {\n                    result = a / b;\n                    System.out.println(a + " / " + b + " = " + result);\n                } else {\n                    System.out.println("Ошибка: деление на ноль!");\n                }\n                break;\n            default:\n                System.out.println("Неизвестная операция: " + operation);\n        }\n    }\n}',
      explanation: 'switch отлично работает с char. Каждый case соответствует символу операции. Особый случай — деление: внутри case \'/\' мы дополнительно проверяем b != 0, чтобы не получить ошибку. Это хорошая практика — всегда обрабатывать "опасные" операции.'
    }
  ]
}
