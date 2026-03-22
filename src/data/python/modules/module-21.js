export default {
  id: 21,
  title: 'Декораторы',
  description: 'Декораторы функций и классов: functools.wraps, @classmethod, @staticmethod, создание своих декораторов с аргументами.',
  lessons: [
    {
      id: 1,
      title: 'Что такое декоратор?',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции как объекты первого класса'
        },
        {
          type: 'text',
          value: 'В Python функции — объекты первого класса: их можно передавать как аргументы, возвращать из функций, присваивать переменным. Декоратор — это функция, принимающая функцию и возвращающая новую функцию с расширенным поведением.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Функция как объект\ndef greet(name):\n    return f"Привет, {name}!"\n\n# Передача функции как аргумента\ndef apply(func, value):\n    return func(value)\n\nprint(apply(greet, "Алиса"))  # Привет, Алиса!\nprint(apply(str.upper, "hello"))  # HELLO\n\n# Функция, возвращающая функцию\ndef make_multiplier(n):\n    def multiplier(x):\n        return x * n\n    return multiplier\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nprint(double(5))  # 10\nprint(triple(5))  # 15\n\n# Простейший декоратор\ndef my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print(f"До вызова {func.__name__}")\n        result = func(*args, **kwargs)\n        print(f"После вызова {func.__name__}")\n        return result\n    return wrapper\n\n# Использование декоратора\n@my_decorator\ndef say_hello(name):\n    print(f"Привет, {name}!")\n\nsay_hello("Боб")\n# До вызова say_hello\n# Привет, Боб!\n# После вызова say_hello'
        }
      ]
    },
    {
      id: 2,
      title: 'functools.wraps',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сохранение метаданных функции'
        },
        {
          type: 'text',
          value: 'Без @wraps декоратор "теряет" имя и документацию оригинальной функции — wrapper.__name__ будет "wrapper". functools.wraps копирует метаданные оригинальной функции в обёртку. Всегда используйте @wraps в своих декораторах.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from functools import wraps\n\n# Без @wraps — теряем метаданные\ndef bad_decorator(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@bad_decorator\ndef my_func():\n    """Документация функции."""\n    pass\n\nprint(my_func.__name__)  # wrapper — плохо!\nprint(my_func.__doc__)   # None — плохо!\n\n# С @wraps — сохраняем метаданные\ndef good_decorator(func):\n    @wraps(func)  # копирует __name__, __doc__, __module__\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@good_decorator\ndef my_func():\n    """Документация функции."""\n    pass\n\nprint(my_func.__name__)  # my_func — правильно!\nprint(my_func.__doc__)   # Документация функции. — правильно!\n\n# Практический декоратор с wraps\ndef timer(func):\n    """Измеряет время выполнения функции."""\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} выполнилась за {elapsed:.4f}с")\n        return result\n    return wrapper\n\n@timer\ndef slow_sum(n):\n    """Вычисляет сумму от 1 до n."""\n    return sum(range(n))\n\nprint(slow_sum(1000000))\nprint(slow_sum.__name__)  # slow_sum\nprint(slow_sum.__doc__)   # Вычисляет сумму...'
        }
      ]
    },
    {
      id: 3,
      title: 'Декораторы с аргументами',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Параметризованные декораторы'
        },
        {
          type: 'text',
          value: 'Декоратор с аргументами — это функция, которая возвращает декоратор. Три уровня вложенности: фабрика_декоратора → декоратор → обёртка.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from functools import wraps\n\n# Декоратор с аргументом: количество повторов\ndef retry(times=3, exceptions=(Exception,)):\n    """Повторяет вызов при исключении."""\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            last_error = None\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except exceptions as e:\n                    last_error = e\n                    print(f"Попытка {attempt}/{times} не удалась: {e}")\n            raise last_error\n        return wrapper\n    return decorator\n\n# Использование\nimport random\n\n@retry(times=3, exceptions=(ValueError,))\ndef unstable_function():\n    if random.random() < 0.7:\n        raise ValueError("Случайная ошибка")\n    return "Успех!"\n\n# Декоратор с аргументом: уровень логирования\ndef log(level="INFO"):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            print(f"[{level}] Вызов {func.__name__}")\n            result = func(*args, **kwargs)\n            print(f"[{level}] {func.__name__} вернула {result}")\n            return result\n        return wrapper\n    return decorator\n\n@log("DEBUG")\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))'
        }
      ]
    },
    {
      id: 4,
      title: 'Стекирование декораторов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Несколько декораторов на одной функции'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from functools import wraps\nimport time\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        print(f"[timer] {func.__name__}: {time.perf_counter()-start:.4f}с")\n        return result\n    return wrapper\n\ndef logger(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(f"[log] Вызов {func.__name__}({args}, {kwargs})")\n        result = func(*args, **kwargs)\n        print(f"[log] Результат: {result}")\n        return result\n    return wrapper\n\ndef validate_positive(func):\n    @wraps(func)\n    def wrapper(n, **kwargs):\n        if n <= 0:\n            raise ValueError(f"Аргумент должен быть положительным: {n}")\n        return func(n, **kwargs)\n    return wrapper\n\n# Порядок важен! Применяются снизу вверх\n@timer\n@logger\n@validate_positive\ndef factorial(n):\n    """Вычисляет факториал."""\n    if n == 1: return 1\n    return n * factorial.__wrapped__(n-1)  # __wrapped__ — оригинальная функция\n\n# factorial = timer(logger(validate_positive(factorial)))\nfactorial(5)'
        }
      ]
    },
    {
      id: 5,
      title: 'Декораторы классов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Декорирование классов'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Декоратор класса — принимает класс, возвращает класс\ndef singleton(cls):\n    """Гарантирует единственный экземпляр класса."""\n    instances = {}\n    \n    @wraps(cls, updated=[])\n    def get_instance(*args, **kwargs):\n        if cls not in instances:\n            instances[cls] = cls(*args, **kwargs)\n        return instances[cls]\n    \n    return get_instance\n\nfrom functools import wraps\n\n@singleton\nclass DatabaseConnection:\n    def __init__(self, host):\n        print(f"Подключение к {host}")\n        self.host = host\n\ndb1 = DatabaseConnection("localhost")  # Подключение к localhost\ndb2 = DatabaseConnection("server2")    # НЕ создаёт новое подключение\nprint(db1 is db2)  # True — один объект!\n\n# dataclass — встроенный декоратор\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    z: float = 0.0  # значение по умолчанию\n    tags: list = field(default_factory=list)\n    \n    def distance_to_origin(self):\n        return (self.x**2 + self.y**2 + self.z**2) ** 0.5\n\np = Point(1.0, 2.0)\nprint(p)            # Point(x=1.0, y=2.0, z=0.0, tags=[])\nprint(p.distance_to_origin())'
        }
      ]
    },
    {
      id: 6,
      title: 'Встроенные декораторы: @classmethod, @staticmethod',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Специальные декораторы методов'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class MathUtils:\n    PI = 3.14159\n    \n    def __init__(self, precision):\n        self.precision = precision\n    \n    def round_result(self, value):\n        """Обычный метод — использует self."""\n        return round(value, self.precision)\n    \n    @classmethod\n    def circle_area(cls, r):\n        """Метод класса — использует cls вместо self."""\n        return cls.PI * r ** 2\n    \n    @staticmethod\n    def is_prime(n):\n        """Статический метод — не использует ни self, ни cls."""\n        if n < 2: return False\n        return all(n % i != 0 for i in range(2, int(n**0.5)+1))\n    \n    @classmethod\n    def create_high_precision(cls):\n        """Альтернативный конструктор — паттерн фабричного метода."""\n        return cls(precision=10)\n\n# Вызов через класс (не нужен экземпляр)\nprint(MathUtils.circle_area(5))  # 78.53975\nprint(MathUtils.is_prime(17))    # True\nprint(MathUtils.is_prime(16))    # False\n\n# Вызов через экземпляр\nm = MathUtils(2)\nprint(m.round_result(3.14159))   # 3.14\nprint(m.circle_area(5))          # тоже работает\nprint(m.is_prime(7))             # тоже работает\n\nhp = MathUtils.create_high_precision()\nprint(hp.precision)              # 10'
        }
      ]
    },
    {
      id: 7,
      title: 'Декораторы из functools',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Полезные декораторы стандартной библиотеки'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from functools import lru_cache, cache, partial\n\n# lru_cache — мемоизация с ограниченным размером\n@lru_cache(maxsize=128)\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(50))          # мгновенно\nprint(fib.cache_info()) # CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)\n\n# cache (Python 3.9+) — без ограничений\n@cache\ndef expensive(n):\n    return sum(i**2 for i in range(n))\n\n# partial — фиксируем часть аргументов\ndef power(base, exponent):\n    return base ** exponent\n\nsquare = partial(power, exponent=2)\ncube = partial(power, exponent=3)\n\nprint(square(5))   # 25\nprint(cube(3))     # 27\n\n# partial с первыми аргументами\nfrom functools import partial\nprint_error = partial(print, "ERROR:", sep="")\nprint_error("File not found")  # ERROR:File not found\n\n# singledispatch — полиморфизм по типу\nfrom functools import singledispatch\n\n@singledispatch\ndef process(value):\n    return f"Unknown: {value}"\n\n@process.register(int)\ndef _(value): return f"Integer: {value * 2}"\n\n@process.register(str)\ndef _(value): return f"String: {value.upper()}"\n\nprint(process(5))      # Integer: 10\nprint(process("hi"))   # String: HI'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Декоратор кэширования с TTL',
      type: 'practice',
      difficulty: 'advanced',
      description: 'Создайте декоратор cache_with_ttl, который кэширует результаты функции на указанное время (TTL — Time To Live).',
      requirements: [
        'Декоратор cache_with_ttl(ttl_seconds) принимает время жизни кэша',
        'Кэш хранит результаты вместе с временем создания',
        'При истечении TTL кэш инвалидируется и функция вызывается снова',
        'Поддержите произвольные аргументы (args и kwargs)',
        'Добавьте метод cache_clear() для ручной очистки'
      ],
      expectedOutput: 'Вычисление для (5,)...\nРезультат: 25\nИз кэша: 25\nИз кэша: 25\n[через 2 секунды]\nКэш устарел, пересчёт для (5,)...\nРезультат: 25',
      hint: 'Используйте time.time() для получения текущего времени. Кэш — словарь где ключ = (args, frozenset(kwargs.items())), значение = (result, timestamp). Проверяйте time.time() - timestamp < ttl_seconds.',
      solution: 'import time\nfrom functools import wraps\n\ndef cache_with_ttl(ttl_seconds):\n    def decorator(func):\n        cache = {}\n        \n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            key = (args, frozenset(kwargs.items()))\n            now = time.time()\n            \n            if key in cache:\n                result, timestamp = cache[key]\n                if now - timestamp < ttl_seconds:\n                    return result\n                else:\n                    print(f"Кэш устарел, пересчёт для {args}...")\n            else:\n                print(f"Вычисление для {args}...")\n            \n            result = func(*args, **kwargs)\n            cache[key] = (result, now)\n            return result\n        \n        def cache_clear():\n            cache.clear()\n        \n        wrapper.cache_clear = cache_clear\n        return wrapper\n    return decorator\n\n@cache_with_ttl(ttl_seconds=1)\ndef compute(n):\n    return n ** 2\n\nresult = compute(5)\nprint(f"Результат: {result}")\nprint(f"Из кэша: {compute(5)}")\nprint(f"Из кэша: {compute(5)}")\n\ntime.sleep(1.1)\nresult = compute(5)\nprint(f"Результат: {result}")',
      explanation: 'Три уровня вложенности: cache_with_ttl → decorator → wrapper. Словарь cache замкнут в closure и живёт всё время существования декорированной функции. Ключ кэша — кортеж (args, frozenset(kwargs)) — хэшируемый и уникальный для каждого набора аргументов. Добавление cache_clear как атрибута функции — удобный интерфейс без изменения поведения.'
    }
  ]
}
