export default {
  id: 4,
  title: 'Условные конструкции',
  description: 'Управление потоком выполнения с помощью if, elif, else. Тернарный оператор, match/case и вложенные условия.',
  lessons: [
    {
      id: 1,
      title: 'Оператор if',
      content: [
        {
          type: 'heading',
          value: 'Базовые условия'
        },
        {
          type: 'text',
          value: 'Оператор if позволяет выполнять блок кода только при определённом условии. Если условие истинно (True или любое truthy значение), выполняется блок с отступом. Условие не обязательно должно быть булевым.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовый if\nage = 18\n\nif age >= 18:\n    print("Совершеннолетний")\n    print("Доступ разрешён")\n\n# Условие с falsy значением\nname = ""\nif name:  # пустая строка — falsy\n    print("Имя:", name)\n\nif not name:\n    print("Имя не указано")\n\n# Несколько условий в одном if\nx, y = 5, 10\nif x > 0 and y > 0:\n    print("Оба положительные")\n\nif x > 0 or y < 0:\n    print("Хотя бы одно условие выполнено")'
        }
      ]
    },
    {
      id: 2,
      title: 'if / else',
      content: [
        {
          type: 'heading',
          value: 'Ветвление: выбор из двух вариантов'
        },
        {
          type: 'text',
          value: 'Конструкция if/else позволяет выбрать одно из двух действий: если условие истинно — выполняется блок if, иначе — блок else. Только один из двух блоков всегда будет выполнен.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'temperature = 22\n\nif temperature > 25:\n    print("Жарко, надевай лёгкую одежду")\nelse:\n    print("Прохладно, возьми куртку")\n\n# Определение чётности\nnumber = 7\nif number % 2 == 0:\n    print(f"{number} — чётное")\nelse:\n    print(f"{number} — нечётное")\n\n# Возврат разных значений\ndef absolute(x):\n    if x >= 0:\n        return x\n    else:\n        return -x\n\nprint(absolute(-5))  # 5\nprint(absolute(3))   # 3'
        }
      ]
    },
    {
      id: 3,
      title: 'if / elif / else',
      content: [
        {
          type: 'heading',
          value: 'Множественное ветвление'
        },
        {
          type: 'text',
          value: 'Когда вариантов больше двух, используется elif (else if). Python проверяет условия сверху вниз и выполняет первый подходящий блок. Как только одно условие выполнено, остальные не проверяются.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'score = 75\n\nif score >= 90:\n    grade = "Отлично"\nelif score >= 80:\n    grade = "Хорошо"\nelif score >= 70:\n    grade = "Удовлетворительно"\nelif score >= 60:\n    grade = "Плохо"\nelse:\n    grade = "Неудовлетворительно"\n\nprint(f"Оценка: {grade}")  # Оценка: Удовлетворительно\n\n# Определение времени суток\nhour = 14\n\nif 6 <= hour < 12:\n    time_of_day = "утро"\nelif 12 <= hour < 18:\n    time_of_day = "день"\nelif 18 <= hour < 22:\n    time_of_day = "вечер"\nelse:\n    time_of_day = "ночь"\n\nprint(f"Сейчас {time_of_day}")'
        },
        {
          type: 'tip',
          value: 'elif можно использовать сколько угодно раз. Блок else необязателен — если ни одно условие не выполнено и else нет, просто ничего не происходит.'
        }
      ]
    },
    {
      id: 4,
      title: 'Тернарный оператор',
      content: [
        {
          type: 'heading',
          value: 'Условное выражение в одну строку'
        },
        {
          type: 'text',
          value: 'Python поддерживает тернарный оператор (условное выражение): значение_если_истина if условие else значение_если_ложь. Это выражение (expression), а не оператор, поэтому его можно использовать везде, где ожидается значение.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Обычный if/else\nage = 20\nif age >= 18:\n    status = "взрослый"\nelse:\n    status = "ребёнок"\n\n# Тернарный оператор\nstatus = "взрослый" if age >= 18 else "ребёнок"\nprint(status)  # взрослый\n\n# В других выражениях\nx = 5\nabs_x = x if x >= 0 else -x\nprint(abs_x)  # 5\n\n# В функциях\ndef max_of_two(a, b):\n    return a if a > b else b\n\nprint(max_of_two(3, 7))  # 7\n\n# Цепочка тернарных операторов (не рекомендуется — плохая читаемость)\nn = 0\nresult = "положительное" if n > 0 else "отрицательное" if n < 0 else "ноль"\nprint(result)  # ноль'
        },
        {
          type: 'warning',
          value: 'Не злоупотребляйте тернарным оператором. Он хорош для простых однострочных условий. Вложенные тернарные операторы сложно читать — лучше использовать обычный if/elif/else.'
        }
      ]
    },
    {
      id: 5,
      title: 'match / case (Python 3.10+)',
      content: [
        {
          type: 'heading',
          value: 'Структурное сопоставление с образцом'
        },
        {
          type: 'text',
          value: 'В Python 3.10 появился оператор match/case — структурное сопоставление с образцом (pattern matching). Он мощнее простого if/elif: может сопоставлять типы, структуры данных, извлекать значения.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Простое сопоставление значений\ncommand = "quit"\n\nmatch command:\n    case "quit":\n        print("Выход из программы")\n    case "help":\n        print("Справка по командам")\n    case "start":\n        print("Запуск")\n    case _:  # _ — случай по умолчанию (как else)\n        print(f"Неизвестная команда: {command}")\n\n# Сопоставление с захватом значения\npoint = (1, 5)\nmatch point:\n    case (0, 0):\n        print("Начало координат")\n    case (x, 0):\n        print(f"На оси X: {x}")\n    case (0, y):\n        print(f"На оси Y: {y}")\n    case (x, y):\n        print(f"Точка ({x}, {y})")\n\n# Сопоставление HTTP-кодов\ndef handle_status(status_code):\n    match status_code:\n        case 200:\n            return "OK"\n        case 404:\n            return "Не найдено"\n        case 500 | 503:\n            return "Ошибка сервера"\n        case _:\n            return "Неизвестный код"'
        }
      ]
    },
    {
      id: 6,
      title: 'Вложенные условия',
      content: [
        {
          type: 'heading',
          value: 'Условия внутри условий'
        },
        {
          type: 'text',
          value: 'Блоки if/elif/else могут содержать другие блоки if/elif/else — это вложенные условия. Они полезны, когда логика требует нескольких уровней проверки. Однако глубокое вложение ухудшает читаемость.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Вложенные условия: проверка логина\nusername = "admin"\npassword = "secret123"\n\nif username:\n    if password:\n        if username == "admin" and password == "secret123":\n            print("Вход выполнен")\n        else:\n            print("Неверный логин или пароль")\n    else:\n        print("Пароль не введён")\nelse:\n    print("Логин не введён")\n\n# Лучше: объединить условия (избегайте глубокого вложения)\nif not username:\n    print("Логин не введён")\nelif not password:\n    print("Пароль не введён")\nelif username == "admin" and password == "secret123":\n    print("Вход выполнен")\nelse:\n    print("Неверный логин или пароль")'
        },
        {
          type: 'tip',
          value: 'Принцип "ранний возврат" (early return): вместо глубокого вложения проверяйте граничные случаи в начале и возвращайтесь из функции. Это называется "guard clauses" и делает код более плоским и читаемым.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: FizzBuzz',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Классическая задача FizzBuzz. Для чисел от 1 до 20 выводите: "Fizz" если делится на 3, "Buzz" если делится на 5, "FizzBuzz" если делится на 3 и 5, иначе само число.',
      requirements: [
        'Переберите числа от 1 до 20 включительно',
        'Если число делится на 3 и на 5 — выведите "FizzBuzz"',
        'Если только на 3 — выведите "Fizz"',
        'Если только на 5 — выведите "Buzz"',
        'Иначе — выведите само число',
        'Важно: сначала проверяйте делимость на 15!'
      ],
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz',
      hint: 'Для проверки делимости используйте оператор % (остаток). Число делится на n если n % n == 0. Важен порядок условий: FizzBuzz нужно проверять первым!',
      solution: 'for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
      explanation: 'Ключевое место — порядок условий. Проверка i % 15 == 0 должна идти первой, потому что 15 делится и на 3, и на 5. Если проверить 3 первым, то FizzBuzz никогда не выведется — числа типа 15 попадут в ветку Fizz. Это классическая ошибка новичков.'
    }
  ]
}
