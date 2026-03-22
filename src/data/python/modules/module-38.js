export default {
  id: 38,
  title: 'itertools и functools',
  description: 'Изучим мощные инструменты итераций и функционального программирования: chain, combinations, permutations, lru_cache, partial и другие',
  lessons: [
    {
      id: 1, title: 'itertools: chain, cycle, repeat', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль itertools предоставляет функции для создания итераторов. Они ленивы — не создают все данные сразу, что экономит память при работе с большими последовательностями.' },
        { type: 'heading', value: 'chain — объединение итерируемых' },
        { type: 'code', language: 'python', value: 'import itertools\n\n# chain объединяет несколько итерируемых в один\nlist1 = [1, 2, 3]\nlist2 = [4, 5, 6]\nlist3 = [7, 8, 9]\n\ncombined = list(itertools.chain(list1, list2, list3))\nprint(combined)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# chain.from_iterable — если есть список списков\nmatrix = [[1, 2], [3, 4], [5, 6]]\nflat = list(itertools.chain.from_iterable(matrix))\nprint(flat)  # [1, 2, 3, 4, 5, 6]' },
        { type: 'heading', value: 'cycle и repeat' },
        { type: 'code', language: 'python', value: 'import itertools\n\n# cycle — бесконечное повторение последовательности\ncounter = 0\nfor color in itertools.cycle(["красный", "жёлтый", "зелёный"]):\n    print(color)\n    counter += 1\n    if counter >= 6:\n        break\n# красный, жёлтый, зелёный, красный, жёлтый, зелёный\n\n# repeat — повторить элемент N раз\nprint(list(itertools.repeat("hello", 3)))  # ["hello","hello","hello"]\n\n# Полезно в zip для "подставления" константы\npairs = list(zip([1, 2, 3], itertools.repeat("x")))\nprint(pairs)  # [(1,"x"), (2,"x"), (3,"x")]' }
      ]
    },
    {
      id: 2, title: 'itertools: combinations и permutations', type: 'theory',
      content: [
        { type: 'text', value: 'combinations, permutations, product — для комбинаторных задач. Они ленивые и работают без дублирования данных в памяти.' },
        { type: 'heading', value: 'combinations и combinations_with_replacement' },
        { type: 'code', language: 'python', value: 'import itertools\n\ncolors = ["R", "G", "B"]\n\n# Сочетания без повторений — порядок не важен\nprint(list(itertools.combinations(colors, 2)))\n# [("R","G"), ("R","B"), ("G","B")]\n\n# Сочетания с повторениями\nprint(list(itertools.combinations_with_replacement(colors, 2)))\n# [("R","R"), ("R","G"), ("R","B"), ("G","G"), ("G","B"), ("B","B")]' },
        { type: 'heading', value: 'permutations и product' },
        { type: 'code', language: 'python', value: 'import itertools\n\n# Перестановки — порядок ВАЖЕН\ndigits = [1, 2, 3]\nperms = list(itertools.permutations(digits))\nprint(len(perms))  # 6 = 3!\nprint(perms[:3])   # [(1,2,3), (1,3,2), (2,1,3)]\n\n# product — декартово произведение\ndice1 = [1, 2, 3, 4, 5, 6]\ndice2 = [1, 2, 3, 4, 5, 6]\nall_rolls = list(itertools.product(dice1, dice2))\nprint(len(all_rolls))  # 36\n\n# Эквивалент вложенного цикла\nfor a, b in itertools.product(range(1, 4), range(1, 4)):\n    print(f"{a}x{b}={a*b}", end="  ")' },
        { type: 'tip', value: 'combinations и permutations работают лениво. Для 10 элементов permutations(range(10)) даст 3628800 штук — не вызывай list() без нужды!' }
      ]
    },
    {
      id: 3, title: 'itertools: islice, takewhile, dropwhile, groupby', type: 'theory',
      content: [
        { type: 'text', value: 'Эти функции позволяют нарезать, фильтровать и группировать итераторы без создания промежуточных списков.' },
        { type: 'heading', value: 'islice, takewhile, dropwhile' },
        { type: 'code', language: 'python', value: 'import itertools\n\n# islice — нарезать итератор (как slice для списков)\nnumbers = range(100)\nfirst_10 = list(itertools.islice(numbers, 10))\nprint(first_10)  # [0, 1, 2, ..., 9]\n\n# islice(iterable, start, stop, step)\nevery_third = list(itertools.islice(numbers, 0, 30, 3))\nprint(every_third)  # [0, 3, 6, 9, ..., 27]\n\n# takewhile — брать пока условие истинно\nnums = [1, 4, 6, 4, 1]\nresult = list(itertools.takewhile(lambda x: x < 5, nums))\nprint(result)  # [1, 4] — остановился на 6\n\n# dropwhile — пропускать пока условие истинно\nresult2 = list(itertools.dropwhile(lambda x: x < 5, nums))\nprint(result2)  # [6, 4, 1] — начал с 6' },
        { type: 'heading', value: 'groupby — группировка последовательных элементов' },
        { type: 'code', language: 'python', value: 'import itertools\n\n# ВАЖНО: данные должны быть отсортированы по ключу!\nstudents = [\n    {"name": "Аня",  "dept": "IT"},\n    {"name": "Боря", "dept": "IT"},\n    {"name": "Вася", "dept": "HR"},\n    {"name": "Галя", "dept": "HR"},\n    {"name": "Дима", "dept": "Finance"},\n]\n\nstudents.sort(key=lambda s: s["dept"])\n\nfor dept, group in itertools.groupby(students, key=lambda s: s["dept"]):\n    names = [s["name"] for s in group]\n    print(f"{dept}: {names}")' }
      ]
    },
    {
      id: 4, title: 'functools.lru_cache — кэширование', type: 'theory',
      content: [
        { type: 'text', value: 'lru_cache (Least Recently Used) — декоратор, который кэширует результаты функции. Повторный вызов с теми же аргументами возвращает кэшированный результат без повторного вычисления.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'python', value: 'from functools import lru_cache\nimport time\n\n@lru_cache(maxsize=None)  # None = безлимитный кэш\ndef fibonacci(n: int) -> int:\n    if n < 2:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Без кэша: экспоненциальное время O(2^n)\n# С кэшом: линейное O(n) — каждый n считается один раз!\nstart = time.time()\nprint(fibonacci(40))   # 102334155\nprint(f"Время: {time.time()-start:.3f} сек")  # ~0.0001\n\n# Статистика кэша\nprint(fibonacci.cache_info())  # CacheInfo(hits=38, misses=41, ...)' },
        { type: 'heading', value: 'cache vs lru_cache' },
        { type: 'code', language: 'python', value: 'from functools import cache, lru_cache\n\n# Python 3.9+: @cache = @lru_cache(maxsize=None)\n@cache\ndef factorial(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(100))  # мгновенно\n\n# lru_cache(maxsize=128) — ограниченный кэш, старые удаляются\n@lru_cache(maxsize=128)\ndef slow_function(x: int, y: int) -> float:\n    time.sleep(0.1)  # имитация медленного вычисления\n    return x ** y' },
        { type: 'warning', value: 'lru_cache работает только с хешируемыми аргументами. Функция не должна иметь побочных эффектов — результат должен зависеть только от аргументов.' }
      ]
    },
    {
      id: 5, title: 'functools.partial — частичное применение', type: 'theory',
      content: [
        { type: 'text', value: 'partial создаёт новую функцию с предустановленными аргументами. Это позволяет "специализировать" общую функцию без написания нового кода.' },
        { type: 'heading', value: 'Создание специализированных функций' },
        { type: 'code', language: 'python', value: 'from functools import partial\n\ndef power(base: int, exponent: int) -> int:\n    return base ** exponent\n\n# Создаём специализированные функции\nsquare = partial(power, exponent=2)\ncube   = partial(power, exponent=3)\n\nprint(square(5))   # 25\nprint(cube(3))     # 27\nprint(square(10))  # 100\n\n# Пример с print\nprint_error = partial(print, "ОШИБКА:", end="\\n", flush=True)\nprint_info  = partial(print, "ИНФО:")\n\nprint_error("Что-то пошло не так")  # ОШИБКА: Что-то пошло не так\nprint_info("Всё хорошо")            # ИНФО: Всё хорошо' },
        { type: 'heading', value: 'partial с методами и ключами сортировки' },
        { type: 'code', language: 'python', value: 'from functools import partial\n\ndef sort_key(item, field):\n    return item[field]\n\nproducts = [\n    {"name": "Ноутбук", "price": 50000},\n    {"name": "Мышь",    "price": 800},\n    {"name": "Монитор", "price": 25000},\n]\n\n# Создаём специализированные ключи сортировки\nsort_by_price = partial(sort_key, field="price")\nsort_by_name  = partial(sort_key, field="name")\n\nby_price = sorted(products, key=sort_by_price)\nby_name  = sorted(products, key=sort_by_name)\nprint(by_price[0]["name"])  # Мышь (дешевейшая)' }
      ]
    },
    {
      id: 6, title: 'functools.reduce, wraps и singledispatch', type: 'theory',
      content: [
        { type: 'text', value: 'functools содержит ещё несколько полезных инструментов: wraps для правильного оформления декораторов, reduce для агрегации, singledispatch для перегрузки функций.' },
        { type: 'heading', value: 'wraps — правильные декораторы' },
        { type: 'code', language: 'python', value: 'from functools import wraps\n\n# Без @wraps — теряется __name__ и __doc__\ndef my_decorator_bad(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n# С @wraps — метаданные сохраняются\ndef my_decorator(func):\n    @wraps(func)  # сохраняем имя, docstring, сигнатуру\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@my_decorator\ndef my_function():\n    """Важная функция."""\n    pass\n\nprint(my_function.__name__)  # my_function (не wrapper!)\nprint(my_function.__doc__)   # Важная функция.' },
        { type: 'heading', value: 'singledispatch — перегрузка по типу' },
        { type: 'code', language: 'python', value: 'from functools import singledispatch\n\n@singledispatch\ndef process(value):\n    raise NotImplementedError(f"Нет обработчика для {type(value)}")\n\n@process.register(int)\ndef _(value):\n    return f"Целое: {value * 2}"\n\n@process.register(str)\ndef _(value):\n    return f"Строка: {value.upper()}"\n\n@process.register(list)\ndef _(value):\n    return f"Список из {len(value)} элементов"\n\nprint(process(42))           # Целое: 84\nprint(process("hello"))      # Строка: HELLO\nprint(process([1, 2, 3]))    # Список из 3 элементов' }
      ]
    },
    {
      id: 7, title: 'Практика: Конвейер обработки данных', type: 'practice', difficulty: 'hard',
      description: 'Используй itertools и functools для создания эффективного конвейера обработки данных.',
      requirements: [
        'Используй lru_cache для кэширования числа Фибоначчи',
        'partial для создания специализированного фильтра',
        'chain для объединения нескольких наборов данных',
        'groupby для группировки результатов по категории',
        'Замерь ускорение от lru_cache сравнивая с некэшированной версией'
      ],
      expectedOutput: 'Без кэша (n=35): ~X.XX сек\nС кэшом (n=35): ~0.000 сек\nОбъединённых записей: 9\nГруппы: {"A": [...], "B": [...], "C": [...]}',
      hint: 'Для замера без кэша создай обычную рекурсивную fibonacci_no_cache. groupby требует предварительной сортировки по ключу группировки.',
      solution: 'from functools import lru_cache, partial\nimport itertools\nimport time\n\n# Без кэша — для сравнения\ndef fib_slow(n):\n    if n < 2: return n\n    return fib_slow(n-1) + fib_slow(n-2)\n\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    if n < 2: return n\n    return fib_fast(n-1) + fib_fast(n-2)\n\n# Сравнение скорости\nN = 35\nstart = time.time()\nfib_slow(N)\nprint(f"Без кэша (n={N}): {time.time()-start:.3f} сек")\n\nstart = time.time()\nfib_fast(N)\nprint(f"С кэшом (n={N}): {time.time()-start:.6f} сек")\n\n# partial — специализированный фильтр\ndef has_category(item, category):\n    return item["category"] == category\n\nfilter_a = partial(has_category, category="A")\n\n# chain — объединяем данные из нескольких источников\nbatch1 = [{"id": 1, "category": "A"}, {"id": 2, "category": "B"}]\nbatch2 = [{"id": 3, "category": "A"}, {"id": 4, "category": "C"}]\nbatch3 = [{"id": 5, "category": "B"}, {"id": 6, "category": "A"},\n          {"id": 7, "category": "C"}, {"id": 8, "category": "B"},\n          {"id": 9, "category": "C"}]\n\nall_data = list(itertools.chain(batch1, batch2, batch3))\nprint(f"Объединённых записей: {len(all_data)}")\n\n# groupby — группировка\nall_data.sort(key=lambda x: x["category"])\ngroups = {k: list(v) for k, v in itertools.groupby(all_data, key=lambda x: x["category"])}\nprint(f"Группы: { {k: [i[\'id\'] for i in v] for k, v in groups.items()} }")',
      explanation: 'lru_cache превращает экспоненциальную рекурсию Фибоначчи в линейную. partial создаёт специализированные функции без дублирования кода. chain.from_iterable эффективно объединяет данные без создания промежуточных списков. groupby требует сортировки — это важное ограничение.'
    }
  ]
}
