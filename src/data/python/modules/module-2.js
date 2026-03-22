export default {
  id: 2,
  title: 'Переменные и типы данных',
  description: 'Переменные, основные типы данных: int, float, str, bool. Функция type(), преобразование типов и работа с числами.',
  lessons: [
    {
      id: 1,
      title: 'Переменные и присваивание',
      content: [
        {
          type: 'heading',
          value: 'Что такое переменная?'
        },
        {
          type: 'text',
          value: 'Переменная — это именованный контейнер для хранения данных. В Python переменная создаётся в момент первого присваивания значения. Не нужно объявлять тип заранее — Python определяет его автоматически.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание переменных через присваивание\nname = "Иван"\nage = 30\nheight = 1.75\nis_student = True\n\n# Переприсваивание — тип может меняться\nx = 10\nprint(x)  # 10\nx = "теперь я строка"\nprint(x)  # теперь я строка\n\n# Множественное присваивание\na, b, c = 1, 2, 3\nprint(a, b, c)  # 1 2 3\n\n# Присваивание одного значения нескольким переменным\nx = y = z = 0\nprint(x, y, z)  # 0 0 0'
        },
        {
          type: 'text',
          value: 'Правила именования переменных: начинается с буквы или _, содержит буквы, цифры и _. Python чувствителен к регистру: name и Name — разные переменные. По соглашению PEP 8 используется snake_case.'
        }
      ]
    },
    {
      id: 2,
      title: 'Целые числа (int)',
      content: [
        {
          type: 'heading',
          value: 'Тип int — целые числа'
        },
        {
          type: 'text',
          value: 'В Python целые числа (int) имеют неограниченную точность — можно работать с числами любого размера. Это отличает Python от многих языков, где int ограничен 32 или 64 битами.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Обычные целые числа\na = 42\nb = -17\nc = 0\n\n# Большие числа (можно использовать _ для читаемости)\nbillion = 1_000_000_000\nprint(billion)  # 1000000000\n\n# Очень большие числа — Python справляется!\nfactorial_20 = 2432902008176640000\nprint(factorial_20)\n\n# Разные системы счисления\nbinary = 0b1010    # двоичное: 10\noctal = 0o17       # восьмеричное: 15\nhex_num = 0xFF     # шестнадцатеричное: 255\nprint(binary, octal, hex_num)  # 10 15 255\n\n# Арифметические операции\nprint(17 + 5)   # 22\nprint(17 - 5)   # 12\nprint(17 * 5)   # 85\nprint(17 ** 2)  # 289 (возведение в степень)\nprint(17 // 5)  # 3  (целочисленное деление)\nprint(17 % 5)   # 2  (остаток от деления)'
        },
        {
          type: 'tip',
          value: 'Функции bin(), oct(), hex() преобразуют число в строку в соответствующей системе счисления: bin(10) → "0b1010", hex(255) → "0xff".'
        }
      ]
    },
    {
      id: 3,
      title: 'Числа с плавающей точкой (float)',
      content: [
        {
          type: 'heading',
          value: 'Тип float — дробные числа'
        },
        {
          type: 'text',
          value: 'Тип float представляет числа с плавающей точкой по стандарту IEEE 754 (64-битная точность). Это обычные вещественные числа, но они имеют ограниченную точность — следует помнить об ошибках округления.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание float\nprice = 3.99\npi = 3.14159\nnegative = -2.5\n\n# Научная нотация\nspeed_of_light = 3e8     # 3 * 10^8 = 300000000.0\nelectron_mass = 9.11e-31 # очень малое число\nprint(speed_of_light)    # 300000000.0\n\n# Деление всегда возвращает float в Python 3\nprint(7 / 2)   # 3.5  (не 3!)\nprint(6 / 2)   # 3.0  (тоже float)\n\n# Ошибки точности float\nprint(0.1 + 0.2)          # 0.30000000000000004\nprint(0.1 + 0.2 == 0.3)   # False!\n\n# Правильное сравнение float\nimport math\nprint(math.isclose(0.1 + 0.2, 0.3))  # True\n\n# Специальные значения\nprint(float("inf"))   # inf\nprint(float("-inf"))  # -inf\nprint(float("nan"))   # nan'
        },
        {
          type: 'warning',
          value: 'Никогда не проверяйте равенство float через ==. Из-за ограниченной точности 0.1 + 0.2 != 0.3. Используйте math.isclose() или модуль decimal для финансовых расчётов.'
        }
      ]
    },
    {
      id: 4,
      title: 'Строки (str)',
      content: [
        {
          type: 'heading',
          value: 'Тип str — текстовые данные'
        },
        {
          type: 'text',
          value: 'Строки в Python — неизменяемые последовательности символов Unicode. Их можно создавать с помощью одинарных, двойных или тройных кавычек. Строки поддерживают множество операций и методов.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Разные способы создания строк\ns1 = "Двойные кавычки"\ns2 = \'Одинарные кавычки\'\ns3 = """Тройные кавычки\nдля многострочных строк"""\ns4 = \'\'\'Тоже тройные\'\'\'\n\n# Спецсимволы\nnewline = "Первая строка\\nВторая строка"\ntab = "Колонка1\\tКолонка2"\nquote = "Он сказал: \\"Привет!\\""\nbackslash = "Путь: C:\\\\Users\\\\name"\n\nprint(newline)\nprint(tab)\n\n# Сырые строки (raw strings) — без обработки спецсимволов\npath = r"C:\\Users\\name\\Documents"\nprint(path)  # C:\\Users\\name\\Documents\n\n# Базовые операции\nfirst = "Hello"\nsecond = "World"\nprint(first + " " + second)  # Hello World\nprint(first * 3)              # HelloHelloHello\nprint(len(first))             # 5'
        }
      ]
    },
    {
      id: 5,
      title: 'Логический тип (bool)',
      content: [
        {
          type: 'heading',
          value: 'Тип bool — логические значения'
        },
        {
          type: 'text',
          value: 'Тип bool имеет только два значения: True и False (с заглавной буквы!). В Python bool является подклассом int: True равно 1, False равно 0. Это позволяет использовать булевы значения в арифметических операциях.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Булевые значения\nis_active = True\nis_deleted = False\n\n# bool — подкласс int\nprint(True + True)   # 2\nprint(True + 1)      # 2\nprint(False * 100)   # 0\n\n# Логические операторы\nprint(True and False)  # False\nprint(True or False)   # True\nprint(not True)        # False\n\n# Операции сравнения возвращают bool\nprint(5 > 3)    # True\nprint(5 == 5)   # True\nprint(5 != 3)   # True\nprint(5 <= 5)   # True\n\n# "Истинность" различных значений\nprint(bool(0))      # False\nprint(bool(1))      # True\nprint(bool(""))     # False\nprint(bool("hi"))   # True\nprint(bool([]))     # False\nprint(bool([1]))    # True\nprint(bool(None))   # False'
        },
        {
          type: 'tip',
          value: 'Любое значение в Python имеет "истинность". Пустые коллекции ([], {}, ""), None и нулевые числа (0, 0.0) считаются False. Всё остальное — True. Это называется "truthy/falsy".'
        }
      ]
    },
    {
      id: 6,
      title: 'Функция type() и проверка типов',
      content: [
        {
          type: 'heading',
          value: 'Определение типа переменной'
        },
        {
          type: 'text',
          value: 'Функция type() возвращает тип объекта. Функция isinstance() проверяет, является ли объект экземпляром указанного типа (или одного из типов). isinstance() предпочтительнее type() при проверках, так как учитывает наследование.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Функция type()\nprint(type(42))        # <class "int">\nprint(type(3.14))      # <class "float">\nprint(type("hello"))   # <class "str">\nprint(type(True))      # <class "bool">\nprint(type(None))      # <class "NoneType">\n\n# Сравнение типов\nx = 42\nprint(type(x) == int)    # True\nprint(type(x) == float)  # False\n\n# isinstance() — более гибкая проверка\nprint(isinstance(42, int))          # True\nprint(isinstance(True, int))        # True (bool — подкласс int!)\nprint(isinstance(3.14, (int, float)))  # True (один из типов)\n\n# Функция id() — идентификатор объекта в памяти\na = 42\nb = 42\nprint(id(a), id(b))   # одинаковые (кэширование малых чисел)\nc = [1, 2]\nd = [1, 2]\nprint(id(c), id(d))   # разные (списки не кэшируются)'
        }
      ]
    },
    {
      id: 7,
      title: 'Преобразование типов',
      content: [
        {
          type: 'heading',
          value: 'Явное и неявное преобразование типов'
        },
        {
          type: 'text',
          value: 'Python строго типизирован и не делает неявных преобразований между несовместимыми типами. Для явного преобразования используются встроенные функции: int(), float(), str(), bool(). Это называется "приведение типов" или "type casting".'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Строка -> число\nage_str = "25"\nage_int = int(age_str)\nprint(age_int, type(age_int))  # 25 <class "int">\n\nprice_str = "19.99"\nprice_float = float(price_str)\nprint(price_float)  # 19.99\n\n# Число -> строка\ncount = 42\ncount_str = str(count)\nprint(count_str, type(count_str))  # 42 <class "str">\n\n# Неявное преобразование\nprint(type(5 + 2))    # int\nprint(type(5 + 2.0))  # float (int -> float автоматически)\n\n# Ошибки преобразования\ntry:\n    int("hello")  # ValueError!\nexcept ValueError as e:\n    print("Ошибка:", e)\n\ntry:\n    int("3.14")   # Тоже ошибка! Сначала float()\nexcept ValueError as e:\n    print("Ошибка:", e)\n\n# Правильно:\nprint(int(float("3.14")))  # 3'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Калькулятор площадей',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для вычисления площадей геометрических фигур. Используйте переменные разных типов и преобразование типов.',
      requirements: [
        'Вычислите площадь прямоугольника: ширина 5.5, высота 3',
        'Вычислите площадь круга с радиусом 7 (используйте math.pi)',
        'Вычислите площадь треугольника: основание 6, высота 4',
        'Выведите результаты с двумя знаками после запятой',
        'Используйте переменные с понятными именами'
      ],
      expectedOutput: 'Площадь прямоугольника: 16.50\nПлощадь круга: 153.94\nПлощадь треугольника: 12.00',
      hint: 'Для форматирования с двумя знаками используйте round(value, 2) или f-строку: f"{value:.2f}". Площадь круга = pi * r^2, треугольника = 0.5 * base * height.',
      solution: 'import math\n\n# Прямоугольник\nwidth = 5.5\nheight = 3\nrect_area = width * height\n\n# Круг\nradius = 7\ncircle_area = math.pi * radius ** 2\n\n# Треугольник\nbase = 6\ntri_height = 4\ntriangle_area = 0.5 * base * tri_height\n\nprint(f"Площадь прямоугольника: {rect_area:.2f}")\nprint(f"Площадь круга: {circle_area:.2f}")\nprint(f"Площадь треугольника: {triangle_area:.2f}")',
      explanation: 'Переменные width, height, radius и др. хранят числовые данные (int и float). Python автоматически повышает int до float при смешанных операциях. Форматирование f"{value:.2f}" выводит число с ровно двумя знаками после запятой.'
    }
  ]
}
