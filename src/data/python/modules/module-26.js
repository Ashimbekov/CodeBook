export default {
  id: 26,
  title: 'Замыкания и *args/**kwargs',
  description: 'Разберёмся с замыканиями функций, переменным числом аргументов через *args и **kwargs и их применением на практике',
  lessons: [
    {
      id: 1, title: 'Замыкания (closures)', type: 'theory',
      content: [
        { type: 'text', value: 'Замыкание — это функция, которая "запоминает" переменные из своей области видимости, даже после того как внешняя функция завершила работу. Внутренняя функция "закрывается" над переменными внешней.' },
        { type: 'heading', value: 'Как создаётся замыкание' },
        { type: 'code', language: 'python', value: 'def make_counter(start=0):\n    count = start  # переменная во внешней функции\n\n    def counter():  # внутренняя функция\n        nonlocal count  # используем nonlocal для изменения\n        count += 1\n        return count\n\n    return counter  # возвращаем функцию, не вызывая её\n\nc1 = make_counter()\nprint(c1())  # 1\nprint(c1())  # 2\nprint(c1())  # 3\n\nc2 = make_counter(10)  # отдельный счётчик!\nprint(c2())  # 11\nprint(c1())  # 4 — c1 независим от c2' },
        { type: 'heading', value: 'Замыкание для запоминания данных' },
        { type: 'code', language: 'python', value: 'def make_multiplier(factor):\n    """Создаёт функцию, умножающую на factor."""\n    def multiply(x):\n        return x * factor  # factor "замкнут" из внешней функции\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\n\nprint(double(5))   # 10\nprint(triple(5))   # 15\nprint(double(10))  # 20' },
        { type: 'tip', value: 'Проверить, что функция является замыканием: func.__closure__ содержит кортеж ячеек с замкнутыми переменными.' }
      ]
    },
    {
      id: 2, title: 'nonlocal и практические паттерны', type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое слово nonlocal позволяет изменять переменную из внешней (не глобальной) области видимости. Без nonlocal внутренняя функция может только читать внешние переменные.' },
        { type: 'heading', value: 'nonlocal vs global' },
        { type: 'code', language: 'python', value: 'x = 100  # глобальная\n\ndef outer():\n    y = 200  # переменная outer\n\n    def inner():\n        nonlocal y   # изменяем переменную outer\n        # global x   # изменяли бы глобальную\n        y += 10\n        print(f"inner: y={y}")\n\n    inner()  # inner: y=210\n    print(f"outer: y={y}")  # outer: y=210\n\nouter()' },
        { type: 'heading', value: 'Паттерн: фабрика функций' },
        { type: 'code', language: 'python', value: 'def make_validator(min_val, max_val):\n    """Создаёт функцию-валидатор для диапазона."""\n    def validate(value):\n        if min_val <= value <= max_val:\n            return True, f"{value} в допустимом диапазоне"\n        return False, f"{value} вне [{min_val}, {max_val}]"\n    return validate\n\nvalidate_age = make_validator(0, 120)\nvalidate_score = make_validator(0, 100)\n\nprint(validate_age(25))    # (True, "25 в допустимом диапазоне")\nprint(validate_score(150)) # (False, "150 вне [0, 100]")' },
        { type: 'note', value: 'Замыкания часто используются вместо классов с одним методом — они легче и быстрее. Но если логика сложная — класс читаемее.' }
      ]
    },
    {
      id: 3, title: '*args — переменное число позиционных аргументов', type: 'theory',
      content: [
        { type: 'text', value: '*args позволяет функции принимать любое количество позиционных аргументов. Внутри функции args — это обычный кортеж.' },
        { type: 'heading', value: 'Основы *args' },
        { type: 'code', language: 'python', value: 'def total(*args):\n    """Принимает любое количество чисел."""\n    print(type(args))  # <class "tuple">\n    return sum(args)\n\nprint(total(1, 2, 3))          # 6\nprint(total(10, 20))            # 30\nprint(total(1, 2, 3, 4, 5))    # 15\nprint(total())                  # 0\n\ndef greet(greeting, *names):\n    for name in names:\n        print(f"{greeting}, {name}!")\n\ngreet("Привет", "Аня", "Боря", "Вася")\n# Привет, Аня!\n# Привет, Боря!\n# Привет, Вася!' },
        { type: 'heading', value: 'Распаковка аргументов через *' },
        { type: 'code', language: 'python', value: 'def add(a, b, c):\n    return a + b + c\n\nnumbers = [1, 2, 3]\nresult = add(*numbers)  # распаковываем список в аргументы\nprint(result)  # 6\n\n# Объединение списков\nlist1 = [1, 2, 3]\nlist2 = [4, 5, 6]\ncombined = [*list1, *list2]\nprint(combined)  # [1, 2, 3, 4, 5, 6]' },
        { type: 'tip', value: '*args должен стоять после обычных параметров. Имя args — это просто конвенция, можно использовать любое имя после *.' }
      ]
    },
    {
      id: 4, title: '**kwargs — именованные аргументы', type: 'theory',
      content: [
        { type: 'text', value: '**kwargs позволяет принимать любое количество именованных аргументов. Внутри функции kwargs — это словарь {имя: значение}.' },
        { type: 'heading', value: 'Основы **kwargs' },
        { type: 'code', language: 'python', value: 'def describe(**kwargs):\n    """Выводит все переданные параметры."""\n    print(type(kwargs))  # <class "dict">\n    for key, value in kwargs.items():\n        print(f"  {key} = {value}")\n\ndescribe(name="Аня", age=25, city="Москва")\n# name = Аня\n# age = 25\n# city = Москва\n\ndef create_user(username, **options):\n    user = {"username": username}\n    user.update(options)\n    return user\n\nu = create_user("alice", email="a@b.com", admin=True, theme="dark")\nprint(u)' },
        { type: 'heading', value: 'Распаковка словаря через **' },
        { type: 'code', language: 'python', value: 'def connect(host, port, timeout=30):\n    print(f"Подключение к {host}:{port} (таймаут: {timeout})")\n\nparams = {"host": "localhost", "port": 5432, "timeout": 60}\nconnect(**params)  # распаковываем словарь\n\n# Объединение словарей\ndefaults = {"color": "blue", "size": 12, "bold": False}\noverrides = {"size": 16, "bold": True}\nresult = {**defaults, **overrides}\nprint(result)  # {"color": "blue", "size": 16, "bold": True}' },
        { type: 'note', value: '**kwargs должен стоять последним в списке параметров. Порядок: обычные аргументы, *args, keyword-only, **kwargs.' }
      ]
    },
    {
      id: 5, title: 'Комбинирование *args и **kwargs', type: 'theory',
      content: [
        { type: 'text', value: 'Функции могут одновременно принимать и *args, и **kwargs. Это позволяет создавать максимально гибкие API — как у декораторов или функций-обёрток.' },
        { type: 'heading', value: 'Полный порядок параметров' },
        { type: 'code', language: 'python', value: 'def flexible(pos1, pos2, *args, keyword_only, **kwargs):\n    print(f"pos1={pos1}, pos2={pos2}")\n    print(f"args={args}")\n    print(f"keyword_only={keyword_only}")\n    print(f"kwargs={kwargs}")\n\nflexible(1, 2, 3, 4, 5, keyword_only="важно", extra="да")\n# pos1=1, pos2=2\n# args=(3, 4, 5)\n# keyword_only=важно\n# kwargs={"extra": "да"}' },
        { type: 'heading', value: 'Паттерн: функция-обёртка (wrapper)' },
        { type: 'code', language: 'python', value: 'def logger(func):\n    """Декоратор-логгер — передаёт любые аргументы."""\n    def wrapper(*args, **kwargs):\n        print(f"Вызов {func.__name__}")\n        print(f"  args:   {args}")\n        print(f"  kwargs: {kwargs}")\n        result = func(*args, **kwargs)  # передаём ВСЕ аргументы\n        print(f"  результат: {result}")\n        return result\n    return wrapper\n\n@logger\ndef add(a, b, multiplier=1):\n    return (a + b) * multiplier\n\nadd(3, 4, multiplier=2)\n# Вызов add\n#   args:   (3, 4)\n#   kwargs: {"multiplier": 2}\n#   результат: 14' },
        { type: 'tip', value: 'Паттерн *args, **kwargs в wrapper — стандартный способ написать декоратор, который работает с любой функцией.' }
      ]
    },
    {
      id: 6, title: 'Практика: Гибкая система конфигурации', type: 'practice', difficulty: 'medium',
      description: 'Реализуй систему конфигурации с замыканиями и **kwargs. Создай функцию make_config, которая возвращает замыкание-конфигуратор.',
      requirements: [
        'Функция make_config(**defaults) возвращает функцию configure',
        'configure(**overrides) возвращает словарь: defaults + overrides (overrides имеет приоритет)',
        'Функция log_call(*args, **kwargs) выводит аргументы и результат любой функции',
        'Декорируй configure через log_call-подобную функцию',
        'Продемонстрируй работу с примером defaults = {debug: False, timeout: 30, host: localhost}'
      ],
      expectedOutput: 'Базовая конфигурация: {"debug": False, "timeout": 30, "host": "localhost"}\nС переопределением: {"debug": True, "timeout": 60, "host": "localhost"}\nТолько хост: {"debug": False, "timeout": 30, "host": "production"}',
      hint: 'В make_config сохраняй defaults.copy() как замкнутую переменную. В configure делай {**defaults, **overrides} для слияния.',
      solution: 'def make_config(**defaults):\n    """Создаёт конфигуратор с базовыми значениями."""\n    base = defaults.copy()\n\n    def configure(**overrides):\n        return {**base, **overrides}\n\n    return configure\n\nconfigure = make_config(debug=False, timeout=30, host="localhost")\n\nbase_cfg = configure()\nprint(f"Базовая конфигурация: {base_cfg}")\n\ndev_cfg = configure(debug=True, timeout=60)\nprint(f"С переопределением: {dev_cfg}")\n\nprod_cfg = configure(host="production")\nprint(f"Только хост: {prod_cfg}")',
      explanation: 'Функция make_config создаёт замыкание: переменная base "запоминается" в configure. При каждом вызове configure мы сливаем базовые настройки с переопределениями. {**base, **overrides} — идиоматичный способ слияния словарей.'
    }
  ]
}
