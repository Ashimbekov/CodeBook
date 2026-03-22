export default {
  id: 24,
  title: 'Comprehensions',
  description: 'Освоим компактный синтаксис list/dict/set comprehensions и генераторных выражений для элегантного создания коллекций',
  lessons: [
    {
      id: 1, title: 'List comprehension — основы', type: 'theory',
      content: [
        { type: 'text', value: 'List comprehension — это компактный способ создать список на основе другого итерируемого объекта. Вместо цикла for с append() — одна выразительная строка.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'python', value: '# Обычный цикл\nsquares = []\nfor x in range(10):\n    squares.append(x ** 2)\n\n# List comprehension — то же самое, но короче\nsquares = [x ** 2 for x in range(10)]\nprint(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\n\n# Из строки\nchars = [c.upper() for c in "python"]\nprint(chars)  # ["P", "Y", "T", "H", "O", "N"]' },
        { type: 'heading', value: 'С условием (фильтрация)' },
        { type: 'code', language: 'python', value: '# Только чётные числа\nevens = [x for x in range(20) if x % 2 == 0]\nprint(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\n# Слова длиннее 4 символов\nwords = ["cat", "elephant", "dog", "butterfly", "ox"]\nlong_words = [w for w in words if len(w) > 4]\nprint(long_words)  # ["elephant", "butterfly"]' },
        { type: 'tip', value: 'Синтаксис: [выражение for переменная in итерируемый if условие]. Часть if необязательна.' }
      ]
    },
    {
      id: 2, title: 'List comprehension — продвинутый', type: 'theory',
      content: [
        { type: 'text', value: 'List comprehension поддерживает вложенные циклы и тернарный оператор в части выражения. Это мощные инструменты, но не стоит злоупотреблять сложностью.' },
        { type: 'heading', value: 'Вложенные циклы' },
        { type: 'code', language: 'python', value: '# Таблица умножения (пары)\npairs = [(x, y) for x in range(1, 4) for y in range(1, 4)]\nprint(pairs)\n# [(1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(3,1),(3,2),(3,3)]\n\n# Развернуть вложенный список\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [num for row in matrix for num in row]\nprint(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]' },
        { type: 'heading', value: 'Тернарный оператор в выражении' },
        { type: 'code', language: 'python', value: '# Заменяем отрицательные числа на 0\nnumbers = [-3, 5, -1, 8, -2, 4]\nclamped = [x if x > 0 else 0 for x in numbers]\nprint(clamped)  # [0, 5, 0, 8, 0, 4]\n\n# Классификация чётные/нечётные\nlabels = ["чётное" if x % 2 == 0 else "нечётное" for x in range(6)]\nprint(labels)  # ["чётное","нечётное","чётное","нечётное","чётное","нечётное"]' },
        { type: 'warning', value: 'Не нужно вкладывать больше двух уровней — код станет нечитаемым. Если comprehension не помещается на одну строку — лучше написать обычный цикл.' }
      ]
    },
    {
      id: 3, title: 'Dict comprehension', type: 'theory',
      content: [
        { type: 'text', value: 'Dict comprehension создаёт словарь так же элегантно, как list comprehension создаёт список. Синтаксис схож, но используются фигурные скобки и пара ключ: значение.' },
        { type: 'heading', value: 'Основной синтаксис' },
        { type: 'code', language: 'python', value: '# Квадраты: {число: квадрат}\nsquares = {x: x**2 for x in range(1, 6)}\nprint(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n# Инвертировать словарь (значения становятся ключами)\noriginal = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in original.items()}\nprint(inverted)  # {1: "a", 2: "b", 3: "c"}' },
        { type: 'heading', value: 'С фильтрацией и преобразованием' },
        { type: 'code', language: 'python', value: '# Слова и их длины, только слова > 3 букв\nwords = ["hi", "hello", "bye", "world", "ok"]\nlengths = {w: len(w) for w in words if len(w) > 3}\nprint(lengths)  # {"hello": 5, "world": 5}\n\n# Нормализовать ключи (в нижний регистр)\ndata = {"Name": "Alice", "AGE": 30, "City": "Moscow"}\nnormalized = {k.lower(): v for k, v in data.items()}\nprint(normalized)  # {"name": "Alice", "age": 30, "city": "Moscow"}' },
        { type: 'tip', value: 'Dict comprehension идеален для преобразования или фильтрации словарей — не нужно писать d = {} и d[k] = v в цикле.' }
      ]
    },
    {
      id: 4, title: 'Set comprehension', type: 'theory',
      content: [
        { type: 'text', value: 'Set comprehension создаёт множество — коллекцию уникальных элементов. Синтаксис аналогичен list comprehension, но с фигурными скобками. Дубликаты автоматически удаляются.' },
        { type: 'heading', value: 'Создание множеств' },
        { type: 'code', language: 'python', value: '# Уникальные длины слов\nwords = ["cat", "dog", "elephant", "ant", "bee"]\nunique_lengths = {len(w) for w in words}\nprint(unique_lengths)  # {3, 8} (или в другом порядке)\n\n# Уникальные первые буквы\nnames = ["Alice", "Bob", "Anna", "Charlie", "Alex"]\nfirst_letters = {name[0] for name in names}\nprint(first_letters)  # {"A", "B", "C"}' },
        { type: 'heading', value: 'Практический пример: дубликаты' },
        { type: 'code', language: 'python', value: 'numbers = [1, 2, 3, 2, 4, 3, 5, 1, 6]\n\n# Найти дубликаты\nseen = set()\ndups = {x for x in numbers if x in seen or seen.add(x)}\nprint(dups)  # {1, 2, 3}\n\n# Уникальные элементы\nunique = {x for x in numbers}\nprint(unique)  # {1, 2, 3, 4, 5, 6}' },
        { type: 'note', value: 'Чтобы создать пустое множество, пишите set() — не {}, так как {} создаёт пустой словарь.' }
      ]
    },
    {
      id: 5, title: 'Генераторные выражения', type: 'theory',
      content: [
        { type: 'text', value: 'Генераторное выражение похоже на list comprehension, но не создаёт весь список сразу — оно генерирует элементы по одному. Это экономит память при работе с большими данными.' },
        { type: 'heading', value: 'Синтаксис и разница с list comprehension' },
        { type: 'code', language: 'python', value: 'import sys\n\n# List comprehension — создаёт весь список в памяти\nlst = [x**2 for x in range(1000000)]\nprint(f"Список: {sys.getsizeof(lst)} байт")  # ~8 МБ\n\n# Генераторное выражение — ленивое, почти без памяти\ngen = (x**2 for x in range(1000000))\nprint(f"Генератор: {sys.getsizeof(gen)} байт")  # ~120 байт\n\n# Использование генератора\ntotal = sum(x**2 for x in range(1000))  # без лишних скобок в sum()\nprint(total)  # 332833500' },
        { type: 'heading', value: 'Генераторы с встроенными функциями' },
        { type: 'code', language: 'python', value: 'numbers = [1, -3, 5, -2, 8, -1]\n\n# sum, max, min, any, all принимают генераторы\nprint(sum(x for x in numbers if x > 0))  # 14\nprint(max(abs(x) for x in numbers))      # 8\nprint(any(x > 7 for x in numbers))       # True\nprint(all(x != 0 for x in numbers))      # True\n\n# Найти первый элемент по условию\nfirst_positive = next(x for x in numbers if x > 0)\nprint(first_positive)  # 1' },
        { type: 'tip', value: 'Когда передаёте генераторное выражение как единственный аргумент функции, внешние скобки можно опустить: sum(x**2 for x in range(10)).' }
      ]
    },
    {
      id: 6, title: 'Сравнение и выбор подхода', type: 'theory',
      content: [
        { type: 'text', value: 'Выбор между list comprehension, генератором, dict/set comprehension и обычным циклом зависит от задачи. Важно понимать компромиссы.' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'code', language: 'python', value: '# List comprehension: нужен список, данные помещаются в память\nprices = [10, 25, 5, 42, 18]\ndiscounted = [p * 0.9 for p in prices if p > 15]\n\n# Генератор: большие данные, нужен только проход\nlog_lines = (line.strip() for line in open("big.log"))\nerrors = (l for l in log_lines if "ERROR" in l)\n\n# Dict comprehension: создать/трансформировать словарь\nstudents = ["Аня", "Боря", "Вася"]\ngrades = {name: 0 for name in students}  # инициализация\n\n# Обычный цикл: сложная логика, несколько переменных, побочные эффекты\nresult = []\nfor x in range(10):\n    if x % 2 == 0:\n        result.append(x)\n    else:\n        result.append(x * -1)' },
        { type: 'tip', value: 'Правило: если comprehension читается как обычное предложение — используй его. Если нужно прочитать дважды, чтобы понять — пиши цикл.' }
      ]
    },
    {
      id: 7, title: 'Практика: Обработка данных', type: 'practice', difficulty: 'medium',
      description: 'Используя comprehensions, обработай список студентов с оценками. Создай нужные коллекции только через comprehensions — без явных циклов с append.',
      requirements: [
        'Дан список: students = [("Аня", 85), ("Боря", 92), ("Вася", 60), ("Галя", 78), ("Дима", 95)]',
        'Создай список имён студентов с оценкой >= 80 (list comprehension)',
        'Создай словарь {имя: оценка} для всех студентов (dict comprehension)',
        'Создай множество уникальных оценок (set comprehension)',
        'Вычисли среднюю оценку через генераторное выражение и sum()/len()',
        'Выведи все результаты'
      ],
      expectedOutput: 'Отличники: ["Аня", "Боря", "Дима"]\nВсе оценки: {"Аня": 85, "Боря": 92, "Вася": 60, "Галя": 78, "Дима": 95}\nУникальные оценки: {85, 92, 60, 78, 95}\nСредняя: 82.0',
      hint: 'Для среднего: sum(score for _, score in students) / len(students). Помни, что порядок в множестве не гарантирован.',
      solution: 'students = [("Аня", 85), ("Боря", 92), ("Вася", 60), ("Галя", 78), ("Дима", 95)]\n\nexcellent = [name for name, score in students if score >= 80]\nprint(f"Отличники: {excellent}")\n\nall_grades = {name: score for name, score in students}\nprint(f"Все оценки: {all_grades}")\n\nunique_scores = {score for _, score in students}\nprint(f"Уникальные оценки: {unique_scores}")\n\naverage = sum(score for _, score in students) / len(students)\nprint(f"Средняя: {average}")',
      explanation: 'Каждый тип comprehension решает свою задачу: list для фильтрации, dict для маппинга, set для уникальности. Генераторное выражение в sum() экономит память, не создавая промежуточного списка.'
    }
  ]
}
