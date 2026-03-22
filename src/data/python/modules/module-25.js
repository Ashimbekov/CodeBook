export default {
  id: 25,
  title: 'Lambda, map, filter, reduce',
  description: 'Изучим анонимные функции lambda и функциональные инструменты map, filter, reduce для обработки коллекций',
  lessons: [
    {
      id: 1, title: 'Lambda-функции', type: 'theory',
      content: [
        { type: 'text', value: 'Lambda — это анонимная функция, которую можно написать в одну строку. Она не имеет имени, не содержит инструкций return и полезна там, где нужна небольшая функция "на месте".' },
        { type: 'heading', value: 'Синтаксис lambda' },
        { type: 'code', language: 'python', value: '# Обычная функция\ndef square(x):\n    return x ** 2\n\n# Эквивалентная lambda\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\n# Lambda с несколькими аргументами\nadd = lambda x, y: x + y\nprint(add(3, 4))  # 7\n\n# Lambda без аргументов\ngreeting = lambda: "Привет, мир!"\nprint(greeting())  # Привет, мир!' },
        { type: 'heading', value: 'Когда lambda полезна' },
        { type: 'code', language: 'python', value: 'students = [("Аня", 85), ("Боря", 72), ("Вася", 91)]\n\n# Сортировка по оценке — lambda как ключ сортировки\nsorted_by_score = sorted(students, key=lambda s: s[1])\nprint(sorted_by_score)\n# [("Боря", 72), ("Аня", 85), ("Вася", 91)]\n\n# Сортировка по длине имени\nnames = ["Александра", "Боря", "Дмитрий", "Ан"]\nnames.sort(key=lambda n: len(n))\nprint(names)  # ["Ан", "Боря", "Дмитрий", "Александра"]' },
        { type: 'tip', value: 'Lambda лучше всего подходит для простых однострочных операций. Для сложной логики с несколькими строками — всегда используй обычную функцию def.' }
      ]
    },
    {
      id: 2, title: 'Функция map()', type: 'theory',
      content: [
        { type: 'text', value: 'map() применяет функцию к каждому элементу итерируемого объекта и возвращает итератор. Это функциональная альтернатива циклу for с преобразованием.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'python', value: '# map(функция, итерируемый)\nnumbers = [1, 2, 3, 4, 5]\n\n# Возводим каждый элемент в квадрат\nsquared = list(map(lambda x: x**2, numbers))\nprint(squared)  # [1, 4, 9, 16, 25]\n\n# С обычной функцией\ndef celsius_to_fahrenheit(c):\n    return c * 9/5 + 32\n\ntemps_c = [0, 20, 37, 100]\ntemps_f = list(map(celsius_to_fahrenheit, temps_c))\nprint(temps_f)  # [32.0, 68.0, 98.6, 212.0]' },
        { type: 'heading', value: 'map() с несколькими итерируемыми' },
        { type: 'code', language: 'python', value: '# map с двумя списками\na = [1, 2, 3]\nb = [10, 20, 30]\n\n# Складываем поэлементно\nsums = list(map(lambda x, y: x + y, a, b))\nprint(sums)  # [11, 22, 33]\n\n# Применение встроенных функций\nwords = ["hello", "WORLD", "Python"]\nlowered = list(map(str.lower, words))\nprint(lowered)  # ["hello", "world", "python"]' },
        { type: 'note', value: 'map() возвращает объект-итератор, а не список. Для получения списка оберни в list(). Генераторные выражения зачастую читаются понятнее: [x**2 for x in numbers].' }
      ]
    },
    {
      id: 3, title: 'Функция filter()', type: 'theory',
      content: [
        { type: 'text', value: 'filter() оставляет только те элементы, для которых функция возвращает True. Это функциональный способ фильтровать коллекции.' },
        { type: 'heading', value: 'Основы filter()' },
        { type: 'code', language: 'python', value: 'numbers = [-3, -1, 0, 2, 5, -2, 8]\n\n# Только положительные\npositives = list(filter(lambda x: x > 0, numbers))\nprint(positives)  # [2, 5, 8]\n\n# Только нечётные\nodds = list(filter(lambda x: x % 2 != 0, numbers))\nprint(odds)  # [-3, -1, 5]\n\n# filter с None — удаляет все "ложные" значения\nmixed = [0, 1, "", "hello", None, [], [1,2], False, True]\ntruthful = list(filter(None, mixed))\nprint(truthful)  # [1, "hello", [1, 2], True]' },
        { type: 'heading', value: 'filter() с обычными функциями' },
        { type: 'code', language: 'python', value: 'def is_adult(person):\n    return person["age"] >= 18\n\npeople = [\n    {"name": "Аня", "age": 17},\n    {"name": "Боря", "age": 22},\n    {"name": "Вася", "age": 15},\n    {"name": "Галя", "age": 30},\n]\n\nadults = list(filter(is_adult, people))\nfor p in adults:\n    print(p["name"])  # Боря, Галя' },
        { type: 'tip', value: 'filter() часто заменяется list comprehension с условием: [x for x in numbers if x > 0] — это более питонический стиль.' }
      ]
    },
    {
      id: 4, title: 'Функция reduce()', type: 'theory',
      content: [
        { type: 'text', value: 'reduce() из модуля functools применяет функцию к первым двум элементам, затем к результату и третьему элементу и так далее — "сворачивает" коллекцию в одно значение.' },
        { type: 'heading', value: 'Как работает reduce' },
        { type: 'code', language: 'python', value: 'from functools import reduce\n\nnumbers = [1, 2, 3, 4, 5]\n\n# Сумма через reduce\ntotal = reduce(lambda acc, x: acc + x, numbers)\nprint(total)  # 15\n# Шаги: ((((1+2)+3)+4)+5) = 15\n\n# Произведение\nproduct = reduce(lambda acc, x: acc * x, numbers)\nprint(product)  # 120\n\n# Максимум без max()\nmaximum = reduce(lambda a, b: a if a > b else b, numbers)\nprint(maximum)  # 5' },
        { type: 'heading', value: 'reduce() с начальным значением' },
        { type: 'code', language: 'python', value: 'from functools import reduce\n\n# Третий аргумент — начальное значение аккумулятора\nwords = ["Привет", " ", "мир", "!"]\nsentence = reduce(lambda acc, w: acc + w, words, "")\nprint(sentence)  # "Привет мир!"\n\n# Подсчёт элементов\nnumbers = [1, 5, 3, 5, 2, 5]\ncount_fives = reduce(lambda acc, x: acc + (1 if x == 5 else 0), numbers, 0)\nprint(count_fives)  # 3' },
        { type: 'warning', value: 'reduce() перенесён в functools, так как Гвидо считает его менее читаемым. Часто лучше использовать sum(), max(), min() или явный цикл.' }
      ]
    },
    {
      id: 5, title: 'Цепочки map/filter/reduce', type: 'theory',
      content: [
        { type: 'text', value: 'map(), filter() и reduce() можно комбинировать в цепочки для сложной обработки данных. Главное — сохранять читаемость.' },
        { type: 'heading', value: 'Комбинирование функций' },
        { type: 'code', language: 'python', value: 'from functools import reduce\n\norders = [\n    {"product": "ноутбук", "price": 50000, "qty": 2},\n    {"product": "мышь",    "price": 1500,  "qty": 5},\n    {"product": "монитор", "price": 25000, "qty": 1},\n    {"product": "кабель",  "price": 300,   "qty": 10},\n]\n\n# Шаг 1: фильтруем дорогие товары (>1000)\nexpensive = filter(lambda o: o["price"] > 1000, orders)\n\n# Шаг 2: вычисляем стоимость каждого заказа\namounts = map(lambda o: o["price"] * o["qty"], expensive)\n\n# Шаг 3: суммируем всё\ntotal = reduce(lambda acc, x: acc + x, amounts, 0)\nprint(f"Итого по дорогим: {total}")  # 126500' },
        { type: 'heading', value: 'Сравнение стилей' },
        { type: 'code', language: 'python', value: '# Функциональный стиль\nresult_func = list(map(lambda x: x**2, filter(lambda x: x%2==0, range(10))))\n\n# List comprehension — более читаемо\nresult_comp = [x**2 for x in range(10) if x%2==0]\n\nprint(result_func)  # [0, 4, 16, 36, 64]\nprint(result_comp)  # [0, 4, 16, 36, 64]' },
        { type: 'tip', value: 'В Python принято предпочитать comprehensions над map/filter для простых случаев. map/filter полезны когда функция уже готова (например, str.lower, int).' }
      ]
    },
    {
      id: 6, title: 'sorted(), min(), max() с ключом', type: 'theory',
      content: [
        { type: 'text', value: 'Встроенные функции sorted(), min(), max() принимают параметр key — функцию, которая определяет критерий сортировки/сравнения. Здесь lambda незаменима.' },
        { type: 'heading', value: 'Сортировка по ключу' },
        { type: 'code', language: 'python', value: 'employees = [\n    {"name": "Аня",  "salary": 80000, "dept": "IT"},\n    {"name": "Боря", "salary": 60000, "dept": "HR"},\n    {"name": "Вася", "salary": 95000, "dept": "IT"},\n    {"name": "Галя", "salary": 75000, "dept": "HR"},\n]\n\n# Сортировка по зарплате\nby_salary = sorted(employees, key=lambda e: e["salary"])\nfor e in by_salary:\n    print(e["name"], e["salary"])\n\n# Сортировка по отделу, затем по зарплате\nby_dept_salary = sorted(employees, key=lambda e: (e["dept"], e["salary"]))\n\n# Самый высокооплачиваемый\nbest_paid = max(employees, key=lambda e: e["salary"])\nprint(f"Лучший: {best_paid[\'name\']} — {best_paid[\'salary\']}")' },
        { type: 'note', value: 'Параметр key принимает любую callable — lambda, def-функцию, метод класса или operator.attrgetter/itemgetter из стандартной библиотеки.' }
      ]
    },
    {
      id: 7, title: 'Практика: Обработка данных о продажах', type: 'practice', difficulty: 'medium',
      description: 'Используя lambda, map, filter и reduce, обработай список продаж. Реши все подзадачи без явных циклов for.',
      requirements: [
        'Дан список: sales = [("Ноутбук",45000,3),("Мышь",800,15),("Монитор",22000,5),("Клавиатура",2500,8),("Наушники",5000,0)]',
        'Создай список итоговых сумм (цена * количество) через map',
        'Отфильтруй товары с количеством > 0 через filter',
        'Найди общую выручку через reduce',
        'Выведи самый дорогой товар через max с lambda',
        'Отсортируй товары по выручке по убыванию через sorted'
      ],
      expectedOutput: 'Суммы: [135000, 12000, 110000, 20000, 0]\nТоваров в наличии: 4\nОбщая выручка: 277000\nСамый дорогой: Ноутбук (45000)\nТоп по выручке: Ноутбук, Монитор, Клавиатура, Мышь',
      hint: 'Для reduce не забудь from functools import reduce. Для суммы используй lambda acc, x: acc + x. При сортировке по убыванию добавь reverse=True.',
      solution: 'from functools import reduce\n\nsales = [\n    ("Ноутбук", 45000, 3),\n    ("Мышь", 800, 15),\n    ("Монитор", 22000, 5),\n    ("Клавиатура", 2500, 8),\n    ("Наушники", 5000, 0)\n]\n\ntotals = list(map(lambda s: s[1] * s[2], sales))\nprint(f"Суммы: {totals}")\n\nin_stock = list(filter(lambda s: s[2] > 0, sales))\nprint(f"Товаров в наличии: {len(in_stock)}")\n\nrevenue = reduce(lambda acc, x: acc + x, totals, 0)\nprint(f"Общая выручка: {revenue}")\n\nmost_expensive = max(sales, key=lambda s: s[1])\nprint(f"Самый дорогой: {most_expensive[0]} ({most_expensive[1]})")\n\nsorted_sales = sorted(in_stock, key=lambda s: s[1]*s[2], reverse=True)\nprint("Топ по выручке:", ", ".join(s[0] for s in sorted_sales))',
      explanation: 'map трансформирует данные, filter отбирает нужные, reduce агрегирует. max и sorted с key=lambda позволяют сравнивать по нужному критерию. Комбинирование этих инструментов — основа функционального стиля в Python.'
    }
  ]
}
