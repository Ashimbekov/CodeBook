export default {
  id: 4,
  title: 'Условные конструкции: if/else',
  description: 'Учимся принимать решения в программе: простой if, if-else, цепочки условий и вложенные проверки',
  lessons: [
    {
      id: 1,
      title: 'Простой if',
      type: 'theory',
      content: [
        { type: 'text', value: 'if — это первое слово, которое позволяет программе принимать решения. Если условие выполняется (true) — код внутри блока выполняется. Если не выполняется (false) — пропускается.' },
        { type: 'tip', value: 'Представь светофор. Если свет зелёный — идёшь. Если не зелёный — стоишь. Программа делает то же самое: "ЕСЛИ условие, ТО делай это".' },
        { type: 'heading', value: 'Синтаксис if' },
        { type: 'code', language: 'java', value: '// Структура:\n// if (условие) {\n//     код, который выполняется если условие true\n// }\n\nint age = 20;\n\nif (age >= 18) {\n    System.out.println("Вход разрешён");\n}\n\nSystem.out.println("Конец программы");  // выполнится всегда' },
        { type: 'text', value: 'В этом примере, если age >= 18 (что true при age = 20), то выведется "Вход разрешён". Последняя строка выведется в любом случае.' },
        { type: 'heading', value: 'Несколько примеров' },
        { type: 'code', language: 'java', value: 'int temperature = 30;\n\nif (temperature > 25) {\n    System.out.println("Жарко! Включи кондиционер.");\n}\n\nint score = 85;\n\nif (score >= 90) {\n    System.out.println("Отличная работа! Оценка: 5");\n}\n\nif (score >= 70) {\n    System.out.println("Хорошая работа! Оценка: 4");\n}' },
        { type: 'note', value: 'Заметь: оба условия score >= 90 и score >= 70 проверяются независимо. При score = 85 первое false, второе true — выведется только "Хорошая работа".' },
        { type: 'heading', value: 'Блок без фигурных скобок' },
        { type: 'code', language: 'java', value: '// Если в блоке одна строка — скобки можно опустить\n// Но лучше всегда писать скобки!\nint x = 10;\n\nif (x > 5)\n    System.out.println("x больше 5");  // сработает\n\n// ОПАСНО без скобок:\nif (x > 5)\n    System.out.println("Первая строка");   // часть if\n    System.out.println("Вторая строка");  // НЕ часть if! Выполнится всегда!' },
        { type: 'warning', value: 'Всегда используй фигурные скобки {}! Без них легко ошибиться и подумать, что несколько строк входят в if, хотя входит только одна.' }
      ]
    },
    {
      id: 2,
      title: 'Конструкция if-else',
      type: 'theory',
      content: [
        { type: 'text', value: 'if-else позволяет выбирать: "ЕСЛИ условие выполняется — делай А, ИНАЧЕ делай Б". Всегда выполняется ровно один из двух блоков.' },
        { type: 'tip', value: 'Как выбор в игре: "ЕСЛИ у тебя есть ключ — открой дверь, ИНАЧЕ — иди искать ключ". Один из двух вариантов обязательно произойдёт.' },
        { type: 'heading', value: 'Синтаксис if-else' },
        { type: 'code', language: 'java', value: 'int age = 15;\n\nif (age >= 18) {\n    System.out.println("Взрослый — вход разрешён");\n} else {\n    System.out.println("Несовершеннолетний — вход запрещён");\n}' },
        { type: 'heading', value: 'Чётные и нечётные числа' },
        { type: 'code', language: 'java', value: 'int number = 7;\n\nif (number % 2 == 0) {\n    System.out.println(number + " — чётное");\n} else {\n    System.out.println(number + " — нечётное");\n}' },
        { type: 'heading', value: 'Максимум из двух чисел' },
        { type: 'code', language: 'java', value: 'int a = 42;\nint b = 17;\nint max;\n\nif (a > b) {\n    max = a;\n} else {\n    max = b;\n}\n\nSystem.out.println("Максимум: " + max);  // 42' },
        { type: 'heading', value: 'Оценка по баллам' },
        { type: 'code', language: 'java', value: 'int score = 65;\nString grade;\n\nif (score >= 50) {\n    grade = "Зачёт";\n} else {\n    grade = "Незачёт";\n}\n\nSystem.out.println("Результат: " + grade);' },
        { type: 'note', value: 'Обрати внимание: переменную grade мы объявили до if, а значение присвоили внутри блоков. Это позволяет использовать grade после условия.' }
      ]
    },
    {
      id: 3,
      title: 'Цепочка if-else if-else',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда вариантов больше двух, используется цепочка else if. Java проверяет условия по порядку и выполняет первый подходящий блок.' },
        { type: 'tip', value: 'Как автомат с напитками: "ЕСЛИ нажал кнопку 1 — выдай колу, ИНАЧЕ ЕСЛИ нажал 2 — выдай сок, ИНАЧЕ ЕСЛИ нажал 3 — выдай воду, ИНАЧЕ — ничего не выдавай". Проверяется каждая кнопка по порядку.' },
        { type: 'heading', value: 'Система оценок' },
        { type: 'code', language: 'java', value: 'int score = 78;\nString grade;\n\nif (score >= 90) {\n    grade = "5 (Отлично)";\n} else if (score >= 75) {\n    grade = "4 (Хорошо)";\n} else if (score >= 60) {\n    grade = "3 (Удовлетворительно)";\n} else {\n    grade = "2 (Неудовлетворительно)";\n}\n\nSystem.out.println("Оценка: " + grade);  // 4 (Хорошо)' },
        { type: 'text', value: 'При score = 78: первое условие (>= 90) — false; второе (>= 75) — true! Выполняется второй блок, остальные не проверяются.' },
        { type: 'heading', value: 'Время суток' },
        { type: 'code', language: 'java', value: 'int hour = 14;  // 14:00\nString greeting;\n\nif (hour >= 6 && hour < 12) {\n    greeting = "Доброе утро!";\n} else if (hour >= 12 && hour < 17) {\n    greeting = "Добрый день!";\n} else if (hour >= 17 && hour < 22) {\n    greeting = "Добрый вечер!";\n} else {\n    greeting = "Доброй ночи!";\n}\n\nSystem.out.println(greeting);  // Добрый день!' },
        { type: 'heading', value: 'Знак числа' },
        { type: 'code', language: 'java', value: 'int num = -5;\n\nif (num > 0) {\n    System.out.println("Положительное");\n} else if (num < 0) {\n    System.out.println("Отрицательное");\n} else {\n    System.out.println("Ноль");\n}' },
        { type: 'warning', value: 'Важно: Java проверяет условия СВЕРХУ ВНИЗ и останавливается на первом true. Поэтому порядок условий важен! Поставь самое узкое условие первым, самое широкое последним.' }
      ]
    },
    {
      id: 4,
      title: 'Вложенные условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно проверять условие внутри другого условия. Это называется вложенные if. Представь слои: сначала проверяем внешнее, если прошли — проверяем внутреннее.' },
        { type: 'tip', value: 'Как охрана в клубе: сначала проверяют паспорт (возраст). Если прошёл — проверяют дресс-код. Только если оба условия выполнены — пускают внутрь.' },
        { type: 'heading', value: 'Пример: вход на концерт' },
        { type: 'code', language: 'java', value: 'int age = 20;\nboolean hasTicket = true;\n\nif (age >= 18) {\n    System.out.println("Возраст подходит");\n    if (hasTicket) {\n        System.out.println("Билет есть — добро пожаловать!");\n    } else {\n        System.out.println("Нет билета — вход закрыт");\n    }\n} else {\n    System.out.println("Вам нет 18 лет — вход запрещён");\n}' },
        { type: 'heading', value: 'Классификация числа' },
        { type: 'code', language: 'java', value: 'int num = 42;\n\nif (num >= 0) {\n    System.out.println("Число неотрицательное");\n    if (num == 0) {\n        System.out.println("Это ноль");\n    } else if (num % 2 == 0) {\n        System.out.println("Положительное чётное");\n    } else {\n        System.out.println("Положительное нечётное");\n    }\n} else {\n    System.out.println("Число отрицательное");\n}' },
        { type: 'heading', value: 'Скидки в магазине' },
        { type: 'code', language: 'java', value: 'int age = 70;\ndouble purchase = 5000.0;\ndouble discount;\n\nif (age >= 60) {\n    // Пенсионер\n    if (purchase >= 5000) {\n        discount = 20.0;  // пенсионер + большая покупка\n    } else {\n        discount = 10.0;  // пенсионер\n    }\n} else {\n    if (purchase >= 5000) {\n        discount = 10.0;  // большая покупка\n    } else {\n        discount = 5.0;   // стандарт\n    }\n}\n\nSystem.out.println("Скидка: " + discount + "%");  // 20.0%' },
        { type: 'warning', value: 'Не злоупотребляй вложенными if! Если уровней больше 3 — код становится трудночитаемым. Часто можно переписать с помощью && и ||. Например, age >= 60 && purchase >= 5000.' }
      ]
    },
    {
      id: 5,
      title: 'Объединение условий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вместо вложенных if часто удобнее объединять условия с помощью && и || прямо внутри одного if. Это делает код короче и понятнее.' },
        { type: 'heading', value: 'Вложенный if vs объединённый' },
        { type: 'code', language: 'java', value: '// Длинный способ (вложенные if)\nint age = 25;\nboolean hasTicket = true;\n\nif (age >= 18) {\n    if (hasTicket) {\n        System.out.println("Вход разрешён");\n    }\n}\n\n// Короткий способ (объединённые условия)\nif (age >= 18 && hasTicket) {\n    System.out.println("Вход разрешён");\n}' },
        { type: 'heading', value: 'Проверка диапазона' },
        { type: 'code', language: 'java', value: '// Температура в норме (от 36.0 до 37.2)?\ndouble bodyTemp = 36.6;\n\nif (bodyTemp >= 36.0 && bodyTemp <= 37.2) {\n    System.out.println("Температура в норме");\n} else if (bodyTemp > 37.2 && bodyTemp <= 38.5) {\n    System.out.println("Небольшая температура");\n} else if (bodyTemp > 38.5) {\n    System.out.println("Высокая температура — к врачу!");\n} else {\n    System.out.println("Очень низкая температура!");\n}' },
        { type: 'heading', value: 'Проверка символа' },
        { type: 'code', language: 'java', value: "char grade = 'B';\n\nif (grade == 'A' || grade == 'B') {\n    System.out.println(\"Отличный результат!\");\n} else if (grade == 'C') {\n    System.out.println(\"Нормальный результат\");\n} else {\n    System.out.println(\"Нужно учиться лучше\");\n}" },
        { type: 'heading', value: 'Валидация данных' },
        { type: 'code', language: 'java', value: 'String username = "alice";\nint usernameLen = username.length();\nboolean isValid;\n\n// Имя от 3 до 20 символов И не пустое\nif (usernameLen >= 3 && usernameLen <= 20) {\n    isValid = true;\n    System.out.println("Имя подходит: " + username);\n} else {\n    isValid = false;\n    System.out.println("Имя слишком короткое или длинное!");\n}' },
        { type: 'tip', value: 'Хорошее правило: если видишь вложенный if с единственным содержимым, попробуй объединить условия через &&. Код станет на несколько строк короче.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Калькулятор оценок',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая по количеству баллов (от 0 до 100) определяет оценку по казахстанской системе: 90-100 = "A", 75-89 = "B", 60-74 = "C", 50-59 = "D", ниже 50 = "F".',
      requirements: [
        'Создай переменную int score со значением (протестируй разные значения)',
        'Используй if-else if-else цепочку',
        'Выведи баллы и соответствующую оценку'
      ],
      expectedOutput: 'Баллы: 82\nОценка: B',
      hint: 'Начни с самого высокого условия (>= 90) и спускайся вниз. Java проверяет условия по порядку и остановится на первом подходящем.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int score = 82;\n        String grade;\n\n        if (score >= 90) {\n            grade = "A";\n        } else if (score >= 75) {\n            grade = "B";\n        } else if (score >= 60) {\n            grade = "C";\n        } else if (score >= 50) {\n            grade = "D";\n        } else {\n            grade = "F";\n        }\n\n        System.out.println("Баллы: " + score);\n        System.out.println("Оценка: " + grade);\n    }\n}',
      explanation: 'Цепочка else if проверяет условия по порядку. При score = 82: первое (>= 90) — false, второе (>= 75) — true! Присваивается "B" и остальные условия не проверяются. else в конце — "страховка" для всех оставшихся случаев.'
    },
    {
      id: 7,
      title: 'Практика: Расчёт стоимости поездки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу расчёта стоимости поездки в такси. Правила: базовая ставка 200 тг за посадку. Расстояние до 5 км — 80 тг/км. От 5 до 15 км — 70 тг/км. Свыше 15 км — 60 тг/км. Ночью (с 22:00 до 6:00) добавляется надбавка 20%.',
      requirements: [
        'Создай переменные: int distance = 12 и int hour = 23',
        'Посчитай стоимость по километражу с учётом тарифа',
        'Примени ночную надбавку если нужно',
        'Выведи детализацию расчёта и итоговую сумму'
      ],
      expectedOutput: 'Расстояние: 12 км\nВремя: 23:00 (ночь)\nБазовая стоимость: 1040.0 тг\nС ночной надбавкой (20%): 1248.0 тг',
      hint: 'Посчитай базовую стоимость через if-else if. Потом отдельно проверь условие ночи: hour >= 22 || hour < 6. Если ночь — умножь на 1.2.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int distance = 12;\n        int hour = 23;\n\n        double baseFare = 200.0;\n        double costPerKm;\n\n        if (distance <= 5) {\n            costPerKm = 80.0;\n        } else if (distance <= 15) {\n            costPerKm = 70.0;\n        } else {\n            costPerKm = 60.0;\n        }\n\n        double totalCost = baseFare + distance * costPerKm;\n\n        System.out.println("Расстояние: " + distance + " км");\n\n        boolean isNight = hour >= 22 || hour < 6;\n\n        if (isNight) {\n            System.out.println("Время: " + hour + ":00 (ночь)");\n            System.out.println("Базовая стоимость: " + totalCost + " тг");\n            totalCost *= 1.2;\n            System.out.println("С ночной надбавкой (20%): " + totalCost + " тг");\n        } else {\n            System.out.println("Время: " + hour + ":00 (день)");\n            System.out.println("Итого: " + totalCost + " тг");\n        }\n    }\n}',
      explanation: 'Задача решается в два этапа. Сначала выбираем тариф за км через if-else if. Затем считаем базовую стоимость. Потом проверяем время: ночь — это hour >= 22 (вечером) ИЛИ hour < 6 (утром). Если ночь — применяем коэффициент 1.2 через *=.'
    }
  ]
}
