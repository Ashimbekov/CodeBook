export default {
  id: 11,
  title: 'Функции',
  description: 'Определение функций: def, return, аргументы по умолчанию, *args, **kwargs, аннотации типов и рекурсия.',
  lessons: [
    {
      id: 1,
      title: 'Определение функций: def и return',
      content: [
        {
          type: 'heading',
          value: 'Создание функций'
        },
        {
          type: 'text',
          value: 'Функции — это именованные блоки кода, которые можно вызывать многократно. В Python функции определяются ключевым словом def. Функция может возвращать значение через return или возвращает None по умолчанию.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Простая функция\ndef greet():\n    print("Привет, мир!")\n\ngreet()  # вызов\n\n# Функция с параметрами\ndef greet_person(name):\n    print(f"Привет, {name}!")\n\ngreet_person("Алиса")  # Привет, Алиса!\n\n# Функция с возвратом значения\ndef add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)  # 7\n\n# return прерывает функцию\ndef find_first_even(numbers):\n    for n in numbers:\n        if n % 2 == 0:\n            return n  # немедленный возврат\n    return None  # если нет чётных\n\nprint(find_first_even([1, 3, 5, 4, 6]))  # 4\nprint(find_first_even([1, 3, 5]))         # None\n\n# Несколько return (через кортеж)\ndef divmod_custom(a, b):\n    return a // b, a % b  # неявный кортеж\n\nquotient, remainder = divmod_custom(17, 5)\nprint(quotient, remainder)  # 3 2'
        }
      ]
    },
    {
      id: 2,
      title: 'Позиционные и именованные аргументы',
      content: [
        {
          type: 'heading',
          value: 'Виды аргументов'
        },
        {
          type: 'text',
          value: 'Python поддерживает два способа передачи аргументов: позиционный (по порядку) и именованный (по имени). Именованные аргументы (keyword arguments) делают вызов более читаемым и позволяют передавать аргументы в любом порядке.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'def create_user(name, age, city):\n    return f"{name}, {age} лет, {city}"\n\n# Позиционные аргументы (порядок важен)\nprint(create_user("Иван", 30, "Москва"))\n\n# Именованные аргументы (порядок не важен)\nprint(create_user(age=25, city="Питер", name="Алиса"))\n\n# Смешанный вызов (позиционные первыми!)\nprint(create_user("Боб", city="Казань", age=28))\n\n# Аргументы по умолчанию\ndef greet(name, greeting="Привет"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Иван"))              # Привет, Иван!\nprint(greet("Алиса", "Здравствуй"))  # Здравствуй, Алиса!\nprint(greet("Боб", greeting="Хай"))  # Хай, Боб!'
        },
        {
          type: 'warning',
          value: 'Никогда не используйте изменяемые объекты (список, словарь) как значения по умолчанию! Они создаются один раз при определении функции: def f(lst=[]) — баг. Используйте None: def f(lst=None): if lst is None: lst = []'
        }
      ]
    },
    {
      id: 3,
      title: '*args — переменное число аргументов',
      content: [
        {
          type: 'heading',
          value: 'Произвольное количество аргументов'
        },
        {
          type: 'text',
          value: '*args позволяет функции принимать любое количество позиционных аргументов. Внутри функции args — это кортеж со всеми переданными значениями. Звёздочка * при вызове разворачивает итерируемый объект в аргументы.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# *args — кортеж позиционных аргументов\ndef total(*args):\n    print(f"Аргументы: {args}")\n    return sum(args)\n\nprint(total(1, 2, 3))       # 6\nprint(total(1, 2, 3, 4, 5)) # 15\nprint(total())              # 0 (пустой кортеж)\n\n# *args с обычными аргументами\ndef log(level, *messages):\n    for msg in messages:\n        print(f"[{level}] {msg}")\n\nlog("INFO", "Запуск", "Подключение к БД", "Готово")\n\n# Разворачивание списка в аргументы\nnums = [1, 2, 3]\nprint(total(*nums))  # то же что total(1, 2, 3)\n\n# Слияние списков\ndef merge(*lists):\n    result = []\n    for lst in lists:\n        result.extend(lst)\n    return result\n\nprint(merge([1, 2], [3, 4], [5, 6]))  # [1, 2, 3, 4, 5, 6]'
        }
      ]
    },
    {
      id: 4,
      title: '**kwargs — именованные аргументы',
      content: [
        {
          type: 'heading',
          value: 'Произвольное количество именованных аргументов'
        },
        {
          type: 'text',
          value: '**kwargs позволяет принимать любое количество именованных аргументов. Внутри функции kwargs — это словарь. Двойная звёздочка ** при вызове разворачивает словарь в именованные аргументы.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# **kwargs — словарь именованных аргументов\ndef print_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f"{key} = {value}")\n\nprint_info(name="Иван", age=30, city="Москва")\n\n# Комбинация всех видов аргументов\ndef complex_func(a, b, *args, key="default", **kwargs):\n    print(f"a={a}, b={b}")\n    print(f"args={args}")\n    print(f"key={key}")\n    print(f"kwargs={kwargs}")\n\ncomplex_func(1, 2, 3, 4, key="custom", x=10, y=20)\n\n# Разворачивание словаря в аргументы\ndef create_user(name, age, city):\n    return f"{name}, {age} лет, {city}"\n\ndata = {"name": "Алиса", "age": 25, "city": "Питер"}\nprint(create_user(**data))  # Алиса, 25 лет, Питер\n\n# Обёртка функции\ndef debug_wrapper(func, *args, **kwargs):\n    print(f"Вызов {func.__name__}({args}, {kwargs})")\n    result = func(*args, **kwargs)\n    print(f"Результат: {result}")\n    return result\n\ndebug_wrapper(max, 3, 1, 4, key=abs)'
        }
      ]
    },
    {
      id: 5,
      title: 'Только позиционные и только именованные',
      content: [
        {
          type: 'heading',
          value: 'Ограничение способа передачи аргументов'
        },
        {
          type: 'text',
          value: 'Python позволяет явно указать, какие аргументы должны передаваться только позиционно, а какие — только по имени. / в сигнатуре — всё левее только позиционно. * — всё правее только по имени.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Только именованные аргументы (после *)\ndef connect(host, port, *, timeout, retry):\n    print(f"Подключение к {host}:{port}")\n    print(f"Таймаут: {timeout}, попыток: {retry}")\n\n# Правильно:\nconnect("localhost", 5432, timeout=30, retry=3)\n\n# Ошибка — timeout обязателен как именованный:\ntry:\n    connect("localhost", 5432, 30, 3)  # TypeError\nexcept TypeError as e:\n    print("Ошибка:", e)\n\n# Только позиционные (перед /)\ndef normalize(x, y, /):\n    total = x + y\n    return x / total, y / total\n\n# Правильно:\nprint(normalize(3, 7))\n\n# Аннотации типов\ndef add(a: int, b: int) -> int:\n    return a + b\n\ndef greet(name: str, loud: bool = False) -> str:\n    msg = f"Привет, {name}"\n    return msg.upper() if loud else msg\n\nprint(greet("Иван"))           # Привет, Иван\nprint(greet("Алиса", loud=True))  # ПРИВЕТ, АЛИСА'
        }
      ]
    },
    {
      id: 6,
      title: 'Рекурсия',
      content: [
        {
          type: 'heading',
          value: 'Функции, вызывающие сами себя'
        },
        {
          type: 'text',
          value: 'Рекурсия — это когда функция вызывает саму себя. Каждая рекурсия должна иметь базовый случай (условие остановки), иначе будет бесконечная рекурсия. Python ограничивает глубину рекурсии (~1000 по умолчанию).'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Факториал рекурсивно\ndef factorial(n):\n    if n <= 1:      # базовый случай\n        return 1\n    return n * factorial(n - 1)  # рекурсивный вызов\n\nprint(factorial(5))  # 120\nprint(factorial(10)) # 3628800\n\n# Числа Фибоначчи\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\n# Медленно! Экспоненциальная сложность\n# Лучше с мемоизацией:\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    if n <= 1:\n        return n\n    return fib_fast(n - 1) + fib_fast(n - 2)\n\nprint(fib_fast(50))  # быстро!\n\n# Обход дерева — рекурсия уместна\ndef flatten(nested):\n    result = []\n    for item in nested:\n        if isinstance(item, list):\n            result.extend(flatten(item))  # рекурсия\n        else:\n            result.append(item)\n    return result\n\nprint(flatten([1, [2, [3, 4]], [5, 6]]))  # [1, 2, 3, 4, 5, 6]'
        }
      ]
    },
    {
      id: 7,
      title: 'Lambda-функции',
      content: [
        {
          type: 'heading',
          value: 'Анонимные функции'
        },
        {
          type: 'text',
          value: 'Lambda — анонимная функция, которую можно определить в одном выражении. Синтаксис: lambda аргументы: выражение. Используется там, где нужна простая функция на одно выражение — обычно как аргумент key= для sort/sorted/min/max.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Обычная функция vs lambda\ndef square(x):\n    return x ** 2\n\nsquare_lambda = lambda x: x ** 2\n\nprint(square(5))        # 25\nprint(square_lambda(5)) # 25\n\n# Применение в sorted\npeople = [("Иван", 30), ("Алиса", 25), ("Боб", 35)]\n\nsorted_by_age = sorted(people, key=lambda p: p[1])\nprint(sorted_by_age)\n\nsorted_by_name = sorted(people, key=lambda p: p[0])\nprint(sorted_by_name)\n\n# С map() и filter()\nnums = [1, 2, 3, 4, 5, 6]\nsquares = list(map(lambda x: x**2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(squares)  # [1, 4, 9, 16, 25, 36]\nprint(evens)    # [2, 4, 6]\n\n# Питоничнее через comprehension:\nsquares2 = [x**2 for x in nums]\nevens2 = [x for x in nums if x % 2 == 0]'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Функциональный калькулятор',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте функциональный калькулятор с поддержкой операций через словарь функций.',
      requirements: [
        'Создайте словарь operations с ключами "+", "-", "*", "/" и лямбда-функциями как значениями',
        'Функция calculate(a, op, b) выполняет операцию и возвращает результат',
        'Обрабатывайте деление на ноль',
        'Функция batch_calculate(operations_list) принимает список кортежей (a, op, b)',
        'Выведите результаты для нескольких операций'
      ],
      expectedOutput: '10 + 5 = 15\n10 - 5 = 5\n10 * 5 = 50\n10 / 5 = 2.0\n10 / 0 = Ошибка: деление на ноль',
      hint: 'Словарь функций: {"+": lambda a, b: a + b, ...}. В calculate() получайте функцию по ключу через dict.get() и вызывайте её. Для деления на ноль используйте try/except.',
      solution: 'operations = {\n    "+": lambda a, b: a + b,\n    "-": lambda a, b: a - b,\n    "*": lambda a, b: a * b,\n    "/": lambda a, b: a / b,\n}\n\ndef calculate(a, op, b):\n    func = operations.get(op)\n    if func is None:\n        return f"Ошибка: неизвестная операция {op}"\n    try:\n        return func(a, b)\n    except ZeroDivisionError:\n        return "Ошибка: деление на ноль"\n\ndef batch_calculate(ops_list):\n    results = []\n    for a, op, b in ops_list:\n        result = calculate(a, op, b)\n        results.append((a, op, b, result))\n    return results\n\ntests = [(10, "+", 5), (10, "-", 5), (10, "*", 5), (10, "/", 5), (10, "/", 0)]\nfor a, op, b, result in batch_calculate(tests):\n    print(f"{a} {op} {b} = {result}")',
      explanation: 'Словарь функций (dispatch table) — мощный паттерн для замены длинных if/elif цепочек. Получение функции через dict.get() позволяет обрабатывать неизвестные операции. Lambda-функции в словаре создаются один раз и вызываются по требованию.'
    }
  ]
}
