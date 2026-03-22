export default {
  id: 4,
  title: 'Условные конструкции',
  description: 'if как выражение, when — мощная альтернатива switch, условная логика в Kotlin',
  lessons: [
    {
      id: 1,
      title: 'if / else — основные условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'if / else — основная условная конструкция. Если условие выполнено (true) — выполняется первый блок, иначе (else) — второй.' },
        { type: 'code', language: 'kotlin', value: 'val temperature = 25\n\nif (temperature > 20) {\n    println("На улице тепло!")\n} else {\n    println("Возьми куртку.")\n}' },
        { type: 'heading', value: 'if / else if / else' },
        { type: 'code', language: 'kotlin', value: 'val score = 75\n\nif (score >= 90) {\n    println("Отлично!")\n} else if (score >= 70) {\n    println("Хорошо!")\n} else if (score >= 50) {\n    println("Удовлетворительно")\n} else {\n    println("Нужно больше учиться")\n}' },
        { type: 'tip', value: 'Условия проверяются сверху вниз. Как только нашлось первое подходящее — остальные не проверяются. Поэтому важен порядок: начинай с самых строгих условий.' },
        { type: 'note', value: 'В Kotlin фигурные скобки при одной команде можно не ставить: if (x > 0) println("Положительное"). Но лучше всегда ставить скобки — код становится читаемее и безопаснее.' }
      ]
    },
    {
      id: 2,
      title: 'if как выражение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Это одна из самых приятных особенностей Kotlin: if может быть выражением, то есть возвращать значение! Это позволяет писать очень лаконичный код.' },
        { type: 'code', language: 'kotlin', value: '// if как выражение — возвращает значение\nval age = 20\nval status = if (age >= 18) "Взрослый" else "Несовершеннолетний"\nprintln(status)  // Взрослый' },
        { type: 'heading', value: 'Сравни с Java-версией' },
        { type: 'code', language: 'kotlin', value: '// Java (тернарный оператор):\n// String status = age >= 18 ? "Взрослый" : "Несовершеннолетний";\n\n// Kotlin — if как выражение:\nval status = if (age >= 18) "Взрослый" else "Несовершеннолетний"\n\n// Kotlin — многострочный if как выражение:\nval max = if (a > b) {\n    println("a больше")\n    a   // последнее выражение — возвращаемое значение\n} else {\n    println("b больше или равно")\n    b\n}' },
        { type: 'tip', value: 'В блоке if как выражения последняя строка блока — это возвращаемое значение. Не нужен return! Kotlin сам понимает что вернуть.' },
        { type: 'warning', value: 'Если используешь if как выражение — ветка else обязательна! Иначе непонятно что вернуть когда условие ложно. Без else — только если используешь if как оператор (не присваиваешь результат).' }
      ]
    },
    {
      id: 3,
      title: 'when — умный выбор',
      type: 'theory',
      content: [
        { type: 'text', value: 'when — это мощная замена switch из Java и C. Но when в Kotlin гораздо умнее: он умеет проверять диапазоны, типы, произвольные условия.' },
        { type: 'heading', value: 'Базовый when' },
        { type: 'code', language: 'kotlin', value: 'val day = 3\n\nwhen (day) {\n    1 -> println("Понедельник")\n    2 -> println("Вторник")\n    3 -> println("Среда")\n    4 -> println("Четверг")\n    5 -> println("Пятница")\n    6, 7 -> println("Выходной!")  // несколько значений!\n    else -> println("Неверный день")\n}' },
        { type: 'heading', value: 'when с диапазонами' },
        { type: 'code', language: 'kotlin', value: 'val score = 85\n\nwhen (score) {\n    in 90..100 -> println("A — Отлично")\n    in 80..89  -> println("B — Хорошо")\n    in 70..79  -> println("C — Нормально")\n    in 60..69  -> println("D — Слабо")\n    else       -> println("F — Неудовлетворительно")\n}' },
        { type: 'tip', value: 'in 90..100 — это проверка диапазона. Читается как "попадает ли значение от 90 до 100 включительно". Гораздо читаемее чем score >= 90 && score <= 100.' }
      ]
    },
    {
      id: 4,
      title: 'when как выражение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Как и if, конструкция when может быть выражением — возвращать значение. Это делает код ещё лаконичнее.' },
        { type: 'code', language: 'kotlin', value: 'val month = 4\n\nval season = when (month) {\n    in 3..5  -> "Весна"\n    in 6..8  -> "Лето"\n    in 9..11 -> "Осень"\n    12, 1, 2 -> "Зима"\n    else     -> "Неверный месяц"\n}\n\nprintln("Сейчас: $season")  // Сейчас: Весна' },
        { type: 'heading', value: 'when без аргумента' },
        { type: 'code', language: 'kotlin', value: 'val x = 15\n\nwhen {\n    x < 0  -> println("Отрицательное")\n    x == 0 -> println("Ноль")\n    x < 10 -> println("Однозначное")\n    x < 100 -> println("Двузначное")  // это сработает!\n    else   -> println("Большое")\n}' },
        { type: 'note', value: 'when без аргумента работает как цепочка if-else. Каждая ветка — это произвольное условие. Удобно когда условия разнородные и не связаны с одним значением.' },
        { type: 'tip', value: 'Правило: если when используется как выражение (результат присваивается или возвращается) — ветка else обязательна, если Kotlin не может гарантировать исчерпывающее покрытие.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Классификатор BMI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу для классификации индекса массы тела (BMI) с использованием when.',
      requirements: [
        'Объяви переменную bmi = 22.5',
        'Используй when для классификации: < 18.5 — "Недовес", 18.5..24.9 — "Норма", 25.0..29.9 — "Избыточный вес", >= 30 — "Ожирение"',
        'Сохрани результат в val category',
        'Выведи: "BMI: 22.5 — Норма"'
      ],
      expectedOutput: 'BMI: 22.5 — Норма',
      hint: 'when с диапазонами: in 18.5..24.9. Для числа >= 30 используй else ветку. Сохрани результат when в val.',
      solution: 'fun main() {\n    val bmi = 22.5\n    val category = when {\n        bmi < 18.5 -> "Недовес"\n        bmi < 25.0 -> "Норма"\n        bmi < 30.0 -> "Избыточный вес"\n        else -> "Ожирение"\n    }\n    println("BMI: $bmi — $category")\n}',
      explanation: 'when без аргумента позволяет сравнивать Double значения. Проверяем условия по порядку: если bmi < 18.5 — недовес, затем < 25 — норма (предыдущее условие уже исключено), и так далее.'
    },
    {
      id: 6,
      title: 'Практика: Оценка успеваемости',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй if как выражение для определения оценки и комментария к ней.',
      requirements: [
        'Объяви val points = 78',
        'Используй if-else if-else как выражение для определения буквенной оценки (A/B/C/D/F)',
        'Отдельно определи комментарий: if >= 60 "Сдано" else "Не сдано"',
        'Выведи: "78 очков: B — Сдано"'
      ],
      expectedOutput: '78 очков: B — Сдано',
      hint: 'val grade = if (points >= 90) "A" else if (points >= 80) "B" else ... Помни про else в конце!',
      solution: 'fun main() {\n    val points = 78\n    val grade = if (points >= 90) "A"\n        else if (points >= 80) "B"\n        else if (points >= 70) "C"\n        else if (points >= 60) "D"\n        else "F"\n    val status = if (points >= 60) "Сдано" else "Не сдано"\n    println("$points очков: $grade — $status")\n}',
      explanation: 'if как выражение возвращает строку в зависимости от условия. Каждая ветка — одно значение. else в конце обязателен — иначе что вернуть если ни одно условие не подошло?'
    },
    {
      id: 7,
      title: 'Практика: Определение сезона',
      type: 'practice',
      difficulty: 'easy',
      description: 'Используй when для определения сезона года по номеру месяца.',
      requirements: [
        'Объяви val month = 7',
        'Используй when с несколькими значениями в одной ветке (через запятую)',
        'Декабрь, январь, февраль — Зима; март, апрель, май — Весна; июнь, июль, август — Лето; сентябрь, октябрь, ноябрь — Осень',
        'Выведи "Месяц 7 — Лето"'
      ],
      expectedOutput: 'Месяц 7 — Лето',
      hint: 'В when можно перечислить несколько значений через запятую: 12, 1, 2 -> "Зима"',
      solution: 'fun main() {\n    val month = 7\n    val season = when (month) {\n        12, 1, 2 -> "Зима"\n        3, 4, 5 -> "Весна"\n        6, 7, 8 -> "Лето"\n        9, 10, 11 -> "Осень"\n        else -> "Неверный месяц"\n    }\n    println("Месяц $month — $season")\n}',
      explanation: 'when позволяет перечислять несколько значений через запятую — очень удобно. 12, 1, 2 -> "Зима" означает: если month равен 12, 1 или 2 — зима. Гораздо чище чем цепочка if-else.'
    }
  ]
}
