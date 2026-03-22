export default {
  id: 22,
  title: 'Генераторы и итераторы',
  description: 'Генераторы Python: yield, yield from, send(), генераторные выражения, протокол итератора и бесконечные последовательности.',
  lessons: [
    {
      id: 1,
      title: 'Итераторы и протокол итерации',
      content: [
        {
          type: 'heading',
          value: 'Итерируемые объекты и итераторы'
        },
        {
          type: 'text',
          value: 'Итерируемый объект (iterable) — любой объект, у которого есть __iter__(). Итератор — объект с __iter__() и __next__(). Функция next() вызывает __next__(), при исчерпании бросает StopIteration. for-цикл использует этот протокол автоматически.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Протокол итерации\nmy_list = [1, 2, 3]\niterator = iter(my_list)  # вызывает __iter__()\n\nprint(next(iterator))  # 1 — вызывает __next__()\nprint(next(iterator))  # 2\nprint(next(iterator))  # 3\ntry:\n    print(next(iterator))  # StopIteration!\nexcept StopIteration:\n    print("Итератор исчерпан")\n\n# Реализация итератора вручную\nclass CountDown:\n    def __init__(self, start):\n        self.current = start\n    \n    def __iter__(self):\n        return self  # итератор возвращает сам себя\n    \n    def __next__(self):\n        if self.current <= 0:\n            raise StopIteration\n        self.current -= 1\n        return self.current + 1\n\nfor num in CountDown(5):\n    print(num, end=" ")  # 5 4 3 2 1\n\n# Различие: итерируемый vs итератор\nnums = [1, 2, 3]     # итерируемый (можно перебирать много раз)\nit = iter(nums)       # итератор (одноразовый)\n\nfor x in nums: pass   # OK\nfor x in nums: pass   # OK — можно снова\n\nfor x in it: pass     # OK — один раз\nfor x in it: pass     # ничего — уже исчерпан!'
        }
      ]
    },
    {
      id: 2,
      title: 'Генераторы с yield',
      content: [
        {
          type: 'heading',
          value: 'Функция-генератор'
        },
        {
          type: 'text',
          value: 'Функция с yield — это генератор. При вызове она возвращает объект-генератор (не выполняет код). При каждом next() код выполняется до следующего yield, возвращает значение и "замораживается". Это ленивые вычисления — значения создаются по запросу.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Простой генератор\ndef count_up(n):\n    for i in range(1, n+1):\n        yield i  # "заморозка" здесь, возвращаем i\n\ng = count_up(3)\nprint(type(g))    # <class "generator">\nprint(next(g))    # 1\nprint(next(g))    # 2\nprint(next(g))    # 3\n\n# Можно перебрать в цикле\nfor num in count_up(5):\n    print(num, end=" ")  # 1 2 3 4 5\n\n# Генератор vs список: экономия памяти!\ndef squares_gen(n):\n    for i in range(n):\n        yield i ** 2\n\n# Генератор не хранит все числа в памяти!\nfor sq in squares_gen(1000000):\n    if sq > 100:\n        break  # останавливаемся когда нужно\n\nimport sys\ngen = squares_gen(1000000)\nlst = [i**2 for i in range(1000000)]\nprint(f"Генератор: {sys.getsizeof(gen)} байт")\nprint(f"Список:    {sys.getsizeof(lst)} байт")  # намного больше!'
        }
      ]
    },
    {
      id: 3,
      title: 'Генераторные выражения',
      content: [
        {
          type: 'heading',
          value: 'Компактные генераторы'
        },
        {
          type: 'text',
          value: 'Генераторное выражение — это как list comprehension, но в круглых скобках. Оно создаёт генератор (ленивый), а не список. Используйте когда нужно обработать данные один раз и не хранить их все в памяти.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# List comprehension vs генераторное выражение\nlst = [x**2 for x in range(10)]       # список — все в памяти\ngen = (x**2 for x in range(10))       # генератор — ленивый\n\nprint(lst)        # [0, 1, 4, 9, ...]\nprint(gen)        # <generator object ...>\nprint(list(gen))  # [0, 1, 4, 9, ...] — но только один раз!\nprint(list(gen))  # [] — уже исчерпан!\n\n# Генераторы в функциях\nnumbers = range(1000000)\n\n# Эффективно: сумма квадратов чётных чисел\ntotal = sum(x**2 for x in numbers if x % 2 == 0)\n# sum() принимает итерируемое — не создаём список!\n\n# Проверка с any/all\nhas_negative = any(x < 0 for x in [-1, 2, 3])   # True — остановится на -1!\nall_positive = all(x > 0 for x in [1, 2, 3, 4]) # True — проверит все\n\n# Цепочка генераторов — pipeline\ndef read_lines(filename):\n    with open(filename) as f:\n        yield from f  # yield from для делегирования\n\ndef strip_lines(lines):\n    for line in lines:\n        yield line.strip()\n\ndef filter_empty(lines):\n    for line in lines:\n        if line:\n            yield line\n\n# Файл обрабатывается строка за строкой, без загрузки в память\n# lines = filter_empty(strip_lines(read_lines("big_file.txt")))'
        }
      ]
    },
    {
      id: 4,
      title: 'yield from',
      content: [
        {
          type: 'heading',
          value: 'Делегирование другому генератору'
        },
        {
          type: 'text',
          value: 'yield from позволяет генератору делегировать итерацию другому итерируемому объекту. Это элегантнее, чем явный цикл с yield, и корректно обрабатывает send() и throw().'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Без yield from\ndef chain_v1(*iterables):\n    for it in iterables:\n        for item in it:   # явный цикл\n            yield item\n\n# С yield from\ndef chain_v2(*iterables):\n    for it in iterables:\n        yield from it  # делегирование!\n\nprint(list(chain_v1([1,2], [3,4], [5,6])))  # [1, 2, 3, 4, 5, 6]\nprint(list(chain_v2([1,2], [3,4], [5,6])))  # то же самое\n\n# Рекурсивное сглаживание вложенных списков\ndef flatten(nested):\n    for item in nested:\n        if isinstance(item, (list, tuple)):\n            yield from flatten(item)  # рекурсия через yield from\n        else:\n            yield item\n\ndata = [1, [2, [3, 4]], [5, [6, [7]]]]\nprint(list(flatten(data)))  # [1, 2, 3, 4, 5, 6, 7]\n\n# yield from со строками\ndef multi_range(*ranges):\n    for r in ranges:\n        yield from range(*r)\n\nprint(list(multi_range((1,4), (10,13), (20,22))))\n# [1, 2, 3, 10, 11, 12, 20, 21]'
        }
      ]
    },
    {
      id: 5,
      title: 'Метод send() — двунаправленные генераторы',
      content: [
        {
          type: 'heading',
          value: 'Передача данных в генератор'
        },
        {
          type: 'text',
          value: 'Метод send() позволяет передавать значение в генератор. Оно становится результатом выражения yield. Первый вызов должен быть next() или send(None), чтобы начать выполнение до первого yield.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовый пример send()\ndef accumulator():\n    total = 0\n    while True:\n        value = yield total  # получаем через send(), возвращаем total\n        if value is None:\n            break\n        total += value\n\nacc = accumulator()\nnext(acc)        # запускаем до первого yield\nprint(acc.send(10))   # 10 — добавили 10\nprint(acc.send(20))   # 30 — добавили 20\nprint(acc.send(5))    # 35 — добавили 5\n\n# Генератор как конвейер с обратной связью\ndef running_average():\n    """Вычисляет скользящее среднее через send()."""\n    total = 0.0\n    count = 0\n    average = None\n    while True:\n        value = yield average\n        if value is None:\n            return\n        total += value\n        count += 1\n        average = total / count\n\navg = running_average()\nnext(avg)\nfor value in [10, 20, 30, 40, 50]:\n    mean = avg.send(value)\n    print(f"Добавили {value}, среднее = {mean:.1f}")'
        }
      ]
    },
    {
      id: 6,
      title: 'Бесконечные генераторы',
      content: [
        {
          type: 'heading',
          value: 'Генераторы без конца'
        },
        {
          type: 'text',
          value: 'Генераторы могут быть бесконечными — они создают значения по требованию до тех пор, пока потребитель запрашивает следующее. Это мощный инструмент для создания числовых последовательностей, симуляций и потоков данных.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Бесконечный счётчик\ndef count(start=0, step=1):\n    n = start\n    while True:\n        yield n\n        n += step\n\n# Берём только первые 5\ncounter = count(1, 2)\nfor _ in range(5):\n    print(next(counter), end=" ")  # 1 3 5 7 9\n\n# itertools.islice для ограничения\nfrom itertools import islice\nprint(list(islice(count(), 10)))  # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Числа Фибоначчи (бесконечно)\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Первые 10 чисел Фибоначчи\nfibs = list(islice(fibonacci(), 10))\nprint(fibs)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n# Первое Фибоначчи больше 1000\nbig_fib = next(x for x in fibonacci() if x > 1000)\nprint(big_fib)  # 1597\n\n# Бесконечный цикл по списку (как itertools.cycle)\ndef cycle(iterable):\n    saved = []\n    for item in iterable:\n        yield item\n        saved.append(item)\n    while True:\n        for item in saved:\n            yield item\n\ncolors = ["красный", "зелёный", "синий"]\nfor color in islice(cycle(colors), 7):\n    print(color, end=" ")  # красный зелёный синий красный...'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Генератор пагинации',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте генераторы для пагинации большого набора данных и обработки данных в конвейере.',
      requirements: [
        'Генератор paginate(data, page_size) разбивает данные на страницы',
        'Генератор read_large_file(filename) читает большой файл строка за строкой',
        'Генератор transform_pipeline(data, *transforms) применяет функции-трансформеры',
        'Продемонстрируйте пагинацию списка из 25 элементов по 5',
        'Продемонстрируйте конвейер: strip → upper → filter непустых'
      ],
      expectedOutput: 'Страница 1: [1, 2, 3, 4, 5]\nСтраница 2: [6, 7, 8, 9, 10]\nСтраница 3: [11, 12, 13, 14, 15]\nСтраница 4: [16, 17, 18, 19, 20]\nСтраница 5: [21, 22, 23, 24, 25]\n\nКонвейер:\nHELLO\nWORLD\nPYTHON',
      hint: 'Для paginate используйте range(0, len(data), page_size) и срезы data[i:i+page_size]. Для transform_pipeline примените каждую трансформацию по очереди к каждому элементу через yield.',
      solution: 'def paginate(data, page_size):\n    """Разбивает данные на страницы."""\n    for i in range(0, len(data), page_size):\n        yield data[i:i + page_size]\n\ndef transform_pipeline(data, *transforms):\n    """Применяет трансформеры к каждому элементу."""\n    for item in data:\n        for transform in transforms:\n            item = transform(item)\n        yield item\n\ndef filter_pipeline(data, predicate):\n    """Фильтрует элементы по условию."""\n    for item in data:\n        if predicate(item):\n            yield item\n\n# Демонстрация пагинации\ndata = list(range(1, 26))\nfor page_num, page in enumerate(paginate(data, 5), 1):\n    print(f"Страница {page_num}: {page}")\n\nprint("\\nКонвейер:")\nlines = ["  hello  ", "  world  ", "", "  python  ", "  "]\n\n# Конвейер обработки\nprocessed = filter_pipeline(\n    transform_pipeline(\n        lines,\n        str.strip,\n        str.upper\n    ),\n    bool  # фильтруем пустые строки (bool("") == False)\n)\n\nfor line in processed:\n    print(line)',
      explanation: 'Генераторы образуют конвейер (pipeline): данные текут через transform_pipeline и filter_pipeline без создания промежуточных списков. Каждый генератор запрашивает следующее значение только когда оно нужно — это ленивые вычисления. filter_pipeline с предикатом bool() элегантно удаляет пустые строки. Вся цепочка обрабатывает один элемент за раз — минимальное потребление памяти.'
    }
  ]
}
