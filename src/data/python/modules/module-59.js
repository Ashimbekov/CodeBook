export default {
  id: 59,
  title: 'Практикум: Функциональное',
  description: 'Задачи на функциональное программирование: lambda, map, filter, reduce, генераторы, декораторы',
  lessons: [
    {
      id: 1,
      title: 'map, filter, reduce цепочки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реши задачи с использованием функциональных инструментов Python.',
      requirements: [
        'Дан список транзакций: [{amount, type, category}]. Найди сумму доходов категории "salary" с НДС 20%',
        'Из списка слов оставь только слова длиннее 4 букв, переведи в верхний регистр, отсортируй',
        'Найди произведение всех чётных чисел от 2 до 20 через reduce',
        'Из матрицы [[1,2],[3,4],[5,6]] получи плоский список через map+chain',
        'Напиши всё через одно выражение без промежуточных переменных'
      ],
      expectedOutput: 'Доход salary с НДС: XXXX руб\nСлова: ["ПИТОН", "ПРОГРАММИРОВАНИЕ", ...]\nПроизведение чётных: 3715891200\nПлоский список: [1, 2, 3, 4, 5, 6]',
      hint: 'functools.reduce(lambda a,b: a*b, iterable). itertools.chain.from_iterable(matrix).',
      solution: 'from functools import reduce\nfrom itertools import chain\n\ntransactions = [\n    {"amount": 80000, "type": "income", "category": "salary"},\n    {"amount": 5000, "type": "expense", "category": "food"},\n    {"amount": 20000, "type": "income", "category": "salary"},\n    {"amount": 3000, "type": "expense", "category": "transport"},\n    {"amount": 15000, "type": "income", "category": "freelance"},\n]\n\nsalary_with_vat = sum(\n    map(lambda t: t["amount"] * 1.20,\n        filter(lambda t: t["category"] == "salary" and t["type"] == "income",\n               transactions))\n)\nprint(f"Доход salary с НДС: {salary_with_vat:.0f} руб")\n\nwords = ["кот", "питон", "дом", "программирование", "ит", "данные", "алгоритм"]\nresult = sorted(filter(lambda w: len(w) > 4, map(str.upper, words)))\nprint(f"Длинные слова: {result}")\n\nproduct = reduce(lambda a, b: a * b, filter(lambda x: x % 2 == 0, range(1, 21)))\nprint(f"Произведение чётных 2..20: {product}")\n\nmatrix = [[1, 2], [3, 4], [5, 6]]\nflat = list(chain.from_iterable(matrix))\nprint(f"Плоский список: {flat}")',
      explanation: 'filter+map+reduce — классический функциональный конвейер. chain.from_iterable "разворачивает" вложенные итерируемые объекты. str.upper как функция (без скобок) передаётся в map напрямую.'
    },
    {
      id: 2,
      title: 'Замыкания и фабрики функций',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай фабрики функций через замыкания.',
      requirements: [
        'make_multiplier(n) — возвращает функцию умножения на n',
        'make_power(exp) — возвращает функцию возведения в степень',
        'make_validator(min_val, max_val, type_) — валидатор диапазона',
        'make_counter(start=0, step=1) — счётчик с состоянием',
        'compose(*funcs) — составная функция f(g(h(x)))'
      ],
      expectedOutput: 'double = make_multiplier(2)\ndouble(5) -> 10\nsquare = make_power(2)\nsquare(4) -> 16\ncounter = make_counter()\ncounter() -> 0, counter() -> 1, counter() -> 2\ncompose(str, abs, lambda x: x-10)(3) -> "7"',
      hint: 'Замыкание захватывает переменные из внешней функции. Для make_counter используй nonlocal count. compose: functools.reduce(lambda f,g: lambda x: f(g(x)), funcs).',
      solution: 'from functools import reduce\n\ndef make_multiplier(n):\n    return lambda x: x * n\n\ndef make_power(exp):\n    return lambda x: x ** exp\n\ndef make_validator(min_val, max_val, type_=None):\n    def validate(value):\n        if type_ and not isinstance(value, type_):\n            raise TypeError(f"Ожидается {type_.__name__}")\n        if value < min_val or value > max_val:\n            raise ValueError(f"Значение должно быть в [{min_val}, {max_val}]")\n        return True\n    return validate\n\ndef make_counter(start=0, step=1):\n    count = start - step\n    def counter():\n        nonlocal count\n        count += step\n        return count\n    return counter\n\ndef compose(*funcs):\n    if not funcs:\n        return lambda x: x\n    return reduce(lambda f, g: lambda x: f(g(x)), funcs)\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nsquare = make_power(2)\ncube = make_power(3)\n\nprint(double(5), triple(4))\nprint(square(4), cube(3))\n\nvalidate_age = make_validator(0, 150, int)\ntry:\n    validate_age(25)\n    print("Возраст 25: OK")\n    validate_age(-5)\nexcept ValueError as e:\n    print(f"Ошибка: {e}")\n\ncounter = make_counter()\nprint([counter() for _ in range(5)])\n\ncounter_by5 = make_counter(0, 5)\nprint([counter_by5() for _ in range(4)])\n\ntransform = compose(str, abs, lambda x: x - 10)\nprint(transform(3))',
      explanation: 'nonlocal позволяет изменять переменную из внешней области видимости. count = start - step: начальное значение такое чтобы первый вызов вернул start. compose через reduce: создаёт цепочку lambda, каждая из которых оборачивает предыдущую.'
    },
    {
      id: 3,
      title: 'Генераторы и ленивые вычисления',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реши задачи с использованием генераторов для эффективной обработки данных.',
      requirements: [
        'fibonacci_gen() — бесконечный генератор чисел Фибоначчи',
        'prime_gen() — бесконечный генератор простых чисел (Решето Эратосфена)',
        'chunked(iterable, size) — делит на куски по size элементов',
        'take(n, iterable) — берёт первые n элементов',
        'pipeline(data, *transforms) — применяет функции лениво'
      ],
      expectedOutput: 'list(take(10, fibonacci_gen())) -> [0,1,1,2,3,5,8,13,21,34]\nlist(take(10, prime_gen())) -> [2,3,5,7,11,13,17,19,23,29]\nlist(chunked(range(10), 3)) -> [[0,1,2],[3,4,5],[6,7,8],[9]]',
      hint: 'fibonacci: prev, curr = 0, 1; yield prev; prev, curr = curr, prev+curr. prime: хранить множество найденных простых, делить каждое новое число на них.',
      solution: 'from itertools import islice\n\ndef fibonacci_gen():\n    prev, curr = 0, 1\n    while True:\n        yield prev\n        prev, curr = curr, prev + curr\n\ndef prime_gen():\n    primes = []\n    n = 2\n    while True:\n        is_prime = all(n % p != 0 for p in primes if p * p <= n)\n        if is_prime:\n            primes.append(n)\n            yield n\n        n += 1\n\ndef take(n, iterable):\n    return list(islice(iterable, n))\n\ndef chunked(iterable, size):\n    lst = list(iterable)\n    for i in range(0, len(lst), size):\n        yield lst[i:i + size]\n\ndef windowed(iterable, n):\n    from collections import deque\n    window = deque(maxlen=n)\n    for item in iterable:\n        window.append(item)\n        if len(window) == n:\n            yield tuple(window)\n\ndef pipeline(data, *transforms):\n    result = data\n    for transform in transforms:\n        result = transform(result)\n    return result\n\nprint("Фибоначчи:", take(10, fibonacci_gen()))\nprint("Простые:", take(10, prime_gen()))\nprint("Чанки:", list(chunked(range(10), 3)))\nprint("Окна:", list(windowed(range(6), 3)))\n\nresult = pipeline(\n    range(1, 20),\n    lambda x: filter(lambda n: n % 2 == 0, x),\n    lambda x: map(lambda n: n ** 2, x),\n    lambda x: list(islice(x, 5))\n)\nprint("Pipeline (чётные квадраты):", result)',
      explanation: 'Генераторы не хранят все данные в памяти — критично для больших последовательностей. islice из itertools позволяет взять N элементов из бесконечного генератора. windowed — полезно для скользящих средних в Data Science.'
    },
    {
      id: 4,
      title: 'Декораторы: кэш, мемоизация, таймер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй практически полезные декораторы.',
      requirements: [
        '@memoize — кэширует результаты функции по аргументам',
        '@timer — измеряет и выводит время выполнения',
        '@throttle(calls_per_second) — ограничивает частоту вызовов',
        '@deprecated(message) — выводит предупреждение',
        'Сравни скорость fibonacci(30) с и без мемоизации'
      ],
      expectedOutput: 'fibonacci(30) без memo: ~0.3с\nfibonacci(30) с @memoize: <0.001с\n@timer: "execute_heavy took 0.052s"\n@deprecated: DeprecationWarning: используй new_func()',
      hint: 'memoize: cache = {}; key = (args, tuple(sorted(kwargs.items()))). throttle: хранить last_call time, sleep если нужно.',
      solution: 'import functools\nimport time\nimport warnings\n\ndef memoize(func):\n    cache = {}\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        key = (args, tuple(sorted(kwargs.items())))\n        if key not in cache:\n            cache[key] = func(*args, **kwargs)\n        return cache[key]\n    wrapper.cache = cache\n    wrapper.cache_clear = cache.clear\n    return wrapper\n\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} выполнено за {elapsed:.6f}с")\n        return result\n    return wrapper\n\ndef throttle(calls_per_second=1):\n    min_interval = 1.0 / calls_per_second\n    def decorator(func):\n        last_called = [0.0]\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            now = time.time()\n            wait = min_interval - (now - last_called[0])\n            if wait > 0:\n                time.sleep(wait)\n            last_called[0] = time.time()\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator\n\ndef deprecated(message=""):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            warnings.warn(\n                f"{func.__name__} устарела. {message}",\n                DeprecationWarning, stacklevel=2\n            )\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator\n\ndef fib_slow(n):\n    return n if n <= 1 else fib_slow(n-1) + fib_slow(n-2)\n\n@memoize\ndef fib_fast(n):\n    return n if n <= 1 else fib_fast(n-1) + fib_fast(n-2)\n\nstart = time.perf_counter()\nfib_slow(30)\nprint(f"fib(30) без memo: {time.perf_counter()-start:.4f}с")\n\nstart = time.perf_counter()\nfib_fast(30)\nprint(f"fib(30) с @memoize: {time.perf_counter()-start:.8f}с")\n\n@timer\ndef process_data():\n    return sum(i**2 for i in range(100000))\n\nprocess_data()\n\n@deprecated("Используйте new_function() вместо этой.")\ndef old_function():\n    return 42\n\nold_function()',
      explanation: 'key = (args, tuple(sorted(kwargs.items()))) — хешируемый ключ для кэша. wrapper.cache даёт доступ к кэшу извне. throttle хранит last_called в списке [0.0] — это обходит ограничение Python на изменение переменных в замыкании через простое присвоение.'
    },
    {
      id: 5,
      title: 'functools: partial, lru_cache, reduce',
      type: 'practice',
      difficulty: 'easy',
      description: 'Применяй инструменты модуля functools для функционального стиля.',
      requirements: [
        'partial: создай функцию add_tax из lambda x,rate: x*(1+rate) с фиксированным rate=0.20',
        'lru_cache: кешируй дорогую функцию, сравни производительность',
        'reduce: вычисли факториал, найди максимум без max()',
        'total_ordering: реализуй класс Card с __eq__ и __lt__, получи остальные сравнения',
        'singledispatch: разные поведения функции area() для int, tuple, dict'
      ],
      expectedOutput: 'add_tax(1000) -> 1200.0\nfactorial(10) через reduce -> 3628800\nCard("A") > Card("K") -> True\narea(5) -> 78.5 (круг)\narea((3,4)) -> 12 (прямоугольник)',
      hint: 'from functools import partial, lru_cache, reduce, total_ordering, singledispatch. @singledispatch на базовой функции, @func.register(type) на специализациях.',
      solution: 'import functools\nimport math\n\n# partial\ndef apply_rate(price, rate):\n    return price * (1 + rate)\n\nadd_vat = functools.partial(apply_rate, rate=0.20)\nadd_nds = functools.partial(apply_rate, rate=0.13)\nprint(f"add_vat(1000) = {add_vat(1000)}")\nprint(f"add_nds(1000) = {add_nds(1000)}")\n\n# lru_cache\n@functools.lru_cache(maxsize=None)\ndef expensive_fib(n):\n    return n if n <= 1 else expensive_fib(n-1) + expensive_fib(n-2)\n\nexpensive_fib(35)\nprint(f"Cache info: {expensive_fib.cache_info()}")\n\n# reduce\nfactorial = lambda n: functools.reduce(lambda a, b: a * b, range(1, n+1), 1)\nmy_max = lambda lst: functools.reduce(lambda a, b: a if a > b else b, lst)\nprint(f"10! = {factorial(10)}")\nprint(f"max([3,7,1,9,4]) = {my_max([3,7,1,9,4])}")\n\n# total_ordering\n@functools.total_ordering\nclass Card:\n    RANKS = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]\n    def __init__(self, rank):\n        self.rank = rank\n    def __eq__(self, other):\n        return self.RANKS.index(self.rank) == self.RANKS.index(other.rank)\n    def __lt__(self, other):\n        return self.RANKS.index(self.rank) < self.RANKS.index(other.rank)\n    def __repr__(self):\n        return f"Card({self.rank})"\n\nprint(Card("A") > Card("K"))\nprint(Card("2") <= Card("3"))\nprint(sorted([Card("K"), Card("A"), Card("2"), Card("J")]))\n\n# singledispatch\n@functools.singledispatch\ndef area(shape):\n    raise NotImplementedError(f"Неизвестный тип: {type(shape)}")\n\n@area.register(int)\n@area.register(float)\ndef _(radius):\n    return round(math.pi * radius ** 2, 2)\n\n@area.register(tuple)\ndef _(dimensions):\n    return dimensions[0] * dimensions[1]\n\n@area.register(dict)\ndef _(shape_data):\n    if shape_data.get("type") == "triangle":\n        a, b, c = shape_data["a"], shape_data["b"], shape_data["c"]\n        s = (a + b + c) / 2\n        return round(math.sqrt(s*(s-a)*(s-b)*(s-c)), 2)\n    return 0\n\nprint(area(5))\nprint(area((3, 4)))\nprint(area({"type": "triangle", "a": 3, "b": 4, "c": 5}))',
      explanation: 'partial "заморозил" один аргумент — удобно для конфигурирования функций. lru_cache(maxsize=None) — неограниченный кэш (аналог @cache в Python 3.9+). total_ordering из __eq__ и __lt__ автоматически генерирует >, >=, <=. singledispatch — множественная диспетчеризация по типу первого аргумента.'
    },
    {
      id: 6,
      title: 'Comprehensions продвинутые',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решай задачи эффективно через list/dict/set comprehensions.',
      requirements: [
        'Таблица умножения 1..10 как dict {(i,j): i*j} через dict comprehension',
        'Матрица N×N с True на диагонали через nested list comprehension',
        'Из вложенного списка строк получи множество уникальных слов > 4 букв',
        'transpose(matrix) через zip и list comprehension',
        'Группировка: {первая_буква: [слова]} через dict comprehension + defaultdict'
      ],
      expectedOutput: 'table[(3,4)] -> 12\ntable[(7,8)] -> 56\ndiagonal(3) -> [[True,False,False],[False,True,False],[False,False,True]]\ntranspose([[1,2,3],[4,5,6]]) -> [[1,4],[2,5],[3,6]]',
      hint: '{(i,j): i*j for i in range(1,11) for j in range(1,11)}. diagonal: [[i==j for j in range(n)] for i in range(n)]. transpose: [[row[i] for row in m] for i in range(len(m[0]))].',
      solution: '# Таблица умножения\ntable = {(i, j): i * j for i in range(1, 11) for j in range(1, 11)}\nprint(f"3*4={table[(3,4)]}, 7*8={table[(7,8)]}, 9*9={table[(9,9)]}")\n\n# Форматированная таблица\nprint("\\nТаблица умножения:")\nfor i in range(1, 6):\n    print("  ".join(f"{table[(i,j)]:3d}" for j in range(1, 6)))\n\n# Диагональная матрица\ndef diagonal_matrix(n):\n    return [[i == j for j in range(n)] for i in range(n)]\n\nfor row in diagonal_matrix(4):\n    print(row)\n\n# Уникальные слова\nsentences = [\n    ["питон", "это", "язык", "программирования"],\n    ["программирование", "это", "искусство", "и", "наука"],\n    ["питон", "мощный", "язык", "для", "науки"]\n]\nunique_long = {word for sentence in sentences for word in sentence if len(word) > 4}\nprint(f"Уникальные длинные слова: {sorted(unique_long)}")\n\n# Transpose\ndef transpose(matrix):\n    return [[row[i] for row in matrix] for i in range(len(matrix[0]))]\n\nmatrix = [[1, 2, 3], [4, 5, 6]]\nprint(f"Исходная: {matrix}")\nprint(f"Транспонированная: {transpose(matrix)}")\n\n# Группировка по первой букве\nfrom collections import defaultdict\nwords = ["алиса", "боб", "вася", "аня", "борис", "василий", "антон"]\ngrouped = defaultdict(list)\nfor w in words:\n    grouped[w[0]].append(w)\nprint(f"По первой букве: {dict(grouped)}")\n\n# Через dict comprehension (только существующие буквы)\nletters = {w[0] for w in words}\nby_letter = {l: [w for w in words if w[0] == l] for l in sorted(letters)}\nprint(f"Dict comprehension: {by_letter}")',
      explanation: 'Set comprehension {... for ... if ...} автоматически убирает дубликаты. Вложенные comprehensions читаются слева-направо: внешний цикл первым. transpose через zip(*matrix) — элегантнее, но list comprehension нагляднее для учёбы.'
    },
    {
      id: 7,
      title: 'itertools: комбинаторика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй itertools для работы с комбинаторными задачами.',
      requirements: [
        'combinations, permutations: сколько команд из 5 человек можно составить из 10?',
        'product: создай все возможные пароли из [a,b,c] длиной 3',
        'groupby: сгруппируй транзакции по месяцу (данные уже отсортированы)',
        'chain: объедини несколько генераторов',
        'cycle + islice: создай бесконечно повторяющийся паттерн, возьми 20 элементов'
      ],
      expectedOutput: 'C(10,5) = 252 команды\nВсего паролей: 27 (3^3)\nGroupby по месяцу: {1: [...], 2: [...]}\ncycle("ABC", 7) -> ["A","B","C","A","B","C","A"]',
      hint: 'from itertools import combinations, permutations, product, groupby, chain, cycle, islice.',
      solution: 'from itertools import (combinations, permutations, product,\n                       groupby, chain, cycle, islice)\n\n# Комбинации\nteam_members = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"]\nteams = list(combinations(team_members, 5))\nprint(f"Команд из 5 из 10: {len(teams)}")\n\n# Перестановки первых 4\nperms = list(permutations(team_members[:4], 3))\nprint(f"3-перестановок из 4: {len(perms)}")\n\n# Пароли\nalphabet = ["a", "b", "c"]\npasswords = list(product(alphabet, repeat=3))\nprint(f"Паролей из 3 символов: {len(passwords)}")\nprint(f"Первые 5: {passwords[:5]}")\n\n# groupby — данные ДОЛЖНЫ быть отсортированы!\ntransactions = [\n    {"month": 1, "amount": 5000},\n    {"month": 1, "amount": 3000},\n    {"month": 2, "amount": 8000},\n    {"month": 2, "amount": 2000},\n    {"month": 3, "amount": 6000},\n]\nfor month, group in groupby(transactions, key=lambda t: t["month"]):\n    total = sum(t["amount"] for t in group)\n    print(f"Месяц {month}: сумма={total}")\n\n# chain\ngen1 = (x**2 for x in range(1, 4))\ngen2 = (x**3 for x in range(1, 4))\ncombined = list(chain(gen1, gen2))\nprint(f"Chain: {combined}")\n\n# cycle + islice\npattern = cycle(["A", "B", "C"])\nresult = list(islice(pattern, 10))\nprint(f"Cycle 10: {result}")\n\n# Реальный пример: назначение дежурств\nstaff = ["Алиса", "Боб", "Вася"]\nduty_cycle = cycle(staff)\nschedule = {f"День {i+1}": next(duty_cycle) for i in range(10)}\nfor day, person in list(schedule.items())[:6]:\n    print(f"  {day}: {person}")',
      explanation: 'groupby требует предварительной сортировки по тому же ключу — иначе создаёт новую группу при каждом изменении. product(alphabet, repeat=3) эффективнее трёх вложенных циклов. cycle создаёт бесконечный итератор — используй только с islice.'
    },
    {
      id: 8,
      title: 'Функции высшего порядка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй библиотеку функций высшего порядка в функциональном стиле.',
      requirements: [
        'curry(func) — каррирование: curry(add)(1)(2) == add(1,2)',
        'pipe(*funcs) — конвейер функций (слева направо)',
        'memoize_with_ttl(ttl_seconds) — кэш с временем жизни',
        'retry_with_backoff(max_retries, base_delay) — экспоненциальная задержка',
        'flatten(nested) — рекурсивно разворачивает вложенные списки'
      ],
      expectedOutput: 'add = curry(lambda a,b: a+b)\nadd(1)(2) -> 3\nadd(1) -> partial function\npipe(double, inc, square)(3) -> ((3*2)+1)^2 = 49\nflatten([1,[2,[3,[4]]],5]) -> [1,2,3,4,5]',
      hint: 'curry: проверь количество аргументов через inspect.signature. pipe: reduce(lambda f,g: lambda x: g(f(x)), funcs). flatten: isinstance(item, list) для рекурсии.',
      solution: 'import inspect\nimport time\nimport functools\nimport random\n\ndef curry(func):\n    n_args = len(inspect.signature(func).parameters)\n    @functools.wraps(func)\n    def curried(*args):\n        if len(args) >= n_args:\n            return func(*args[:n_args])\n        return lambda *more: curried(*(args + more))\n    return curried\n\ndef pipe(*funcs):\n    def pipeline(x):\n        for func in funcs:\n            x = func(x)\n        return x\n    return pipeline\n\ndef memoize_with_ttl(ttl_seconds):\n    def decorator(func):\n        cache = {}\n        @functools.wraps(func)\n        def wrapper(*args):\n            now = time.time()\n            if args in cache:\n                result, timestamp = cache[args]\n                if now - timestamp < ttl_seconds:\n                    print(f"  Из кэша (возраст: {now-timestamp:.1f}с)")\n                    return result\n            result = func(*args)\n            cache[args] = (result, now)\n            return result\n        return wrapper\n    return decorator\n\ndef retry_with_backoff(max_retries=3, base_delay=0.1):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(max_retries):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == max_retries - 1:\n                        raise\n                    delay = base_delay * (2 ** attempt)\n                    print(f"Попытка {attempt+1} неудачна: {e}. Ждём {delay:.2f}с")\n                    time.sleep(delay)\n        return wrapper\n    return decorator\n\ndef flatten(nested):\n    result = []\n    for item in nested:\n        if isinstance(item, (list, tuple)):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\n# Тесты\nadd = curry(lambda a, b: a + b)\nmultiply = curry(lambda a, b, c: a * b * c)\nprint(add(1)(2))\nprint(add(5)(10))\nprint(multiply(2)(3)(4))\n\nprocess = pipe(\n    lambda x: x * 2,\n    lambda x: x + 1,\n    lambda x: x ** 2\n)\nprint(f"pipe(3) = {process(3)}")  # ((3*2)+1)^2 = 49\n\n@memoize_with_ttl(ttl_seconds=2)\ndef fetch_data(key):\n    print(f"Вычисляем для {key}...")\n    return key * 100\n\nprint(fetch_data(5))\nprint(fetch_data(5))\n\nprint(flatten([1, [2, [3, [4, 5]]], 6, [7, 8]]))',
      explanation: 'curry через inspect.signature работает для функций с любым числом аргументов. Экспоненциальная задержка: 0.1, 0.2, 0.4, 0.8... — стандарт для взаимодействия с API. flatten рекурсивна: если элемент — список, применяем flatten снова и добавляем результат через extend.'
    },
    {
      id: 9,
      title: 'Функциональная обработка данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обработай датасет сотрудников в чисто функциональном стиле.',
      requirements: [
        'Без классов и циклов — только map, filter, reduce, comprehensions',
        'Посчитай среднюю зарплату по отделам через groupby + reduce',
        'Найди топ-3 сотрудника по зарплате через sorted + lambda',
        'Вычисли разницу между максимальной и минимальной зарплатой',
        'Создай отчёт: {отдел: {avg, max, min, count}} через dict comprehension'
      ],
      expectedOutput: 'Средняя по IT: XXXXX руб\nТоп-3: [(name, salary), ...]\nДиапазон зарплат: MAX - MIN = DIFF\nОтчёт по отделам: {"IT": {"avg":..., "max":..., "min":..., "count":...}, ...}',
      hint: 'Группировка без groupby: {dept: [e for e in employees if e["dept"] == dept] for dept in {e["dept"] for e in employees}}.',
      solution: 'from functools import reduce\n\nemployees = [\n    {"name": "Алиса", "dept": "IT", "salary": 90000},\n    {"name": "Боб", "dept": "HR", "salary": 55000},\n    {"name": "Вася", "dept": "IT", "salary": 80000},\n    {"name": "Дина", "dept": "Finance", "salary": 75000},\n    {"name": "Егор", "dept": "IT", "salary": 100000},\n    {"name": "Фёдор", "dept": "HR", "salary": 60000},\n    {"name": "Галя", "dept": "Finance", "salary": 70000},\n]\n\n# Уникальные отделы\ndepts = sorted({e["dept"] for e in employees})\nprint(f"Отделы: {depts}")\n\n# Группировка\nby_dept = {dept: list(filter(lambda e: e["dept"] == dept, employees))\n           for dept in depts}\n\n# Средняя зарплата по отделам\navg_by_dept = {\n    dept: reduce(lambda a, b: a + b["salary"], emps, 0) / len(emps)\n    for dept, emps in by_dept.items()\n}\nfor dept, avg in avg_by_dept.items():\n    print(f"Средняя зарплата {dept}: {avg:.0f} руб")\n\n# Топ-3\ntop3 = sorted(employees, key=lambda e: e["salary"], reverse=True)[:3]\nprint("\\nТоп-3 по зарплате:")\nfor e in top3:\n    print(f"  {e[\'name\']} ({e[\'dept\']}): {e[\'salary\']} руб")\n\n# Диапазон\nsalaries = list(map(lambda e: e["salary"], employees))\nsal_max = reduce(lambda a, b: a if a > b else b, salaries)\nsal_min = reduce(lambda a, b: a if a < b else b, salaries)\nprint(f"\\nДиапазон: {sal_max} - {sal_min} = {sal_max - sal_min}")\n\n# Полный отчёт\nreport = {\n    dept: {\n        "avg": round(sum(e["salary"] for e in emps) / len(emps)),\n        "max": max(e["salary"] for e in emps),\n        "min": min(e["salary"] for e in emps),\n        "count": len(emps)\n    }\n    for dept, emps in by_dept.items()\n}\nprint("\\nОтчёт по отделам:")\nfor dept, stats in report.items():\n    print(f"  {dept}: {stats}")',
      explanation: 'Функциональный стиль: данные не изменяются, только трансформируются. Set comprehension {e["dept"] for e in employees} — быстрое получение уникальных значений. reduce для min/max демонстрирует принцип, но в реальном коде используй встроенные min/max.'
    },
    {
      id: 10,
      title: 'Ленивые вычисления и бесконечные последовательности',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй систему ленивых вычислений с бесконечными последовательностями.',
      requirements: [
        'Класс LazySeq: обёртка над генератором с методами map, filter, take, drop',
        'natural_numbers() — 1, 2, 3, ... (бесконечно)',
        'Через LazySeq найди: первые 5 простых чисел, первые 5 чисел Фибоначчи > 100',
        'zip_with(f, seq1, seq2) — поэлементное применение функции',
        'Цикл вычислений не должен зависать — всегда есть limit'
      ],
      expectedOutput: 'LazySeq(natural_numbers()).filter(is_prime).take(10).to_list()\n-> [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\nLazySeq(fibonacci()).filter(lambda x: x > 100).take(5).to_list()\n-> [144, 233, 377, 610, 987]',
      hint: 'LazySeq хранит генератор. filter/map возвращают новый LazySeq. take(n) — itertools.islice(self._gen, n). Все операции ленивые до вызова to_list().',
      solution: 'from itertools import islice\n\nclass LazySeq:\n    def __init__(self, iterable):\n        self._gen = iter(iterable)\n\n    def map(self, func):\n        return LazySeq(func(x) for x in self._gen)\n\n    def filter(self, pred):\n        return LazySeq(x for x in self._gen if pred(x))\n\n    def take(self, n):\n        return LazySeq(islice(self._gen, n))\n\n    def drop(self, n):\n        for _ in range(n):\n            next(self._gen, None)\n        return self\n\n    def first(self):\n        return next(self._gen, None)\n\n    def to_list(self):\n        return list(self._gen)\n\n    def reduce(self, func, initial=None):\n        import functools\n        return functools.reduce(func, self._gen, initial) if initial is not None else functools.reduce(func, self._gen)\n\ndef natural_numbers(start=1):\n    n = start\n    while True:\n        yield n\n        n += 1\n\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ndef is_prime(n):\n    if n < 2: return False\n    if n == 2: return True\n    if n % 2 == 0: return False\n    return all(n % i != 0 for i in range(3, int(n**0.5)+1, 2))\n\ndef zip_with(func, seq1, seq2):\n    return LazySeq(func(a, b) for a, b in zip(iter(seq1), iter(seq2)))\n\n# Первые 10 простых\nprimes = LazySeq(natural_numbers()).filter(is_prime).take(10).to_list()\nprint(f"Первые 10 простых: {primes}")\n\n# Числа Фибоначчи > 100\nbig_fibs = LazySeq(fibonacci()).filter(lambda x: x > 100).take(5).to_list()\nprint(f"Фибоначчи > 100 (5 штук): {big_fibs}")\n\n# Сумма первых 10 квадратов\nsum_squares = LazySeq(natural_numbers()).map(lambda x: x**2).take(10).reduce(lambda a,b: a+b)\nprint(f"Сумма 10 квадратов: {sum_squares}")\n\n# zip_with\nevens = LazySeq(natural_numbers()).filter(lambda x: x % 2 == 0).take(5)\nodds = LazySeq(natural_numbers()).filter(lambda x: x % 2 != 0).take(5)\nprint(f"evens+odds: {zip_with(lambda a,b: a+b, evens.to_list(), odds.to_list()).to_list()}")',
      explanation: 'LazySeq — обёртка обеспечивающая ленивость. Генераторное выражение (func(x) for x in self._gen) не вычисляется до итерации. islice из itertools безопасно берёт N элементов из бесконечного генератора. После вызова to_list() генератор исчерпан — создавай новый LazySeq для повторного использования.'
    }
  ]
}
