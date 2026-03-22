export default {
  id: 7,
  title: 'Списки (list)',
  description: 'Списки Python: создание, методы append/insert/remove/sort, срезы, list comprehension и работа с вложенными списками.',
  lessons: [
    {
      id: 1,
      title: 'Создание и базовые операции',
      content: [
        {
          type: 'heading',
          value: 'Список — главная структура данных Python'
        },
        {
          type: 'text',
          value: 'Список (list) — упорядоченная изменяемая коллекция элементов. Элементы могут быть разных типов. Списки поддерживают индексацию, срезы, итерацию. Это самая используемая структура данных в Python.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание списков\nempty = []\nnumbers = [1, 2, 3, 4, 5]\nmixed = [1, "hello", 3.14, True, None]\nnested = [[1, 2], [3, 4], [5, 6]]\n\n# Из других итерируемых объектов\nfrom_string = list("hello")  # ["h", "e", "l", "l", "o"]\nfrom_range = list(range(5))  # [0, 1, 2, 3, 4]\n\n# Доступ по индексу\nprint(numbers[0])   # 1\nprint(numbers[-1])  # 5\n\n# Изменение элемента\nnumbers[0] = 10\nprint(numbers)  # [10, 2, 3, 4, 5]\n\n# Основные операции\nprint(len(numbers))        # 5\nprint(3 in numbers)        # True\nprint(10 not in numbers)   # False\nprint(numbers + [6, 7])    # [10, 2, 3, 4, 5, 6, 7]\nprint([0] * 3)             # [0, 0, 0]'
        }
      ]
    },
    {
      id: 2,
      title: 'Методы append, insert, extend',
      content: [
        {
          type: 'heading',
          value: 'Добавление элементов'
        },
        {
          type: 'text',
          value: 'append() добавляет один элемент в конец, insert() добавляет в указанную позицию, extend() добавляет все элементы другой коллекции. Важно: append() добавляет объект целиком, extend() — разворачивает его.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'nums = [1, 2, 3]\n\n# append — добавить в конец\nnums.append(4)\nprint(nums)  # [1, 2, 3, 4]\n\nnums.append([5, 6])  # список добавляется как один элемент!\nprint(nums)  # [1, 2, 3, 4, [5, 6]]\n\n# insert(index, value) — вставить в позицию\nnums2 = [1, 2, 4, 5]\nnums2.insert(2, 3)  # вставить 3 на позицию 2\nprint(nums2)  # [1, 2, 3, 4, 5]\nnums2.insert(0, 0)  # в начало\nprint(nums2)  # [0, 1, 2, 3, 4, 5]\n\n# extend — добавить все элементы другого списка\na = [1, 2, 3]\na.extend([4, 5, 6])  # разворачивает список\nprint(a)  # [1, 2, 3, 4, 5, 6]\n\n# extend vs append\nb = [1, 2]\nb.append([3, 4])   # [[3, 4]] — список внутри списка\nc = [1, 2]\nc.extend([3, 4])   # [1, 2, 3, 4] — плоский список\nprint(b)\nprint(c)'
        }
      ]
    },
    {
      id: 3,
      title: 'Методы remove, pop, del, clear',
      content: [
        {
          type: 'heading',
          value: 'Удаление элементов'
        },
        {
          type: 'text',
          value: 'Есть несколько способов удалить элементы из списка: remove() удаляет по значению, pop() — по индексу (и возвращает его), del — удаляет по индексу или срезу, clear() — очищает весь список.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'fruits = ["яблоко", "банан", "вишня", "банан", "груша"]\n\n# remove(value) — удаляет ПЕРВОЕ вхождение\nfruits.remove("банан")\nprint(fruits)  # ["яблоко", "вишня", "банан", "груша"]\n\n# pop() — удаляет последний и возвращает его\nlast = fruits.pop()\nprint(last)    # груша\nprint(fruits)  # ["яблоко", "вишня", "банан"]\n\n# pop(index) — удаляет по индексу\nfirst = fruits.pop(0)\nprint(first)   # яблоко\nprint(fruits)  # ["вишня", "банан"]\n\n# del — удаление по индексу или срезу\nnums = [10, 20, 30, 40, 50]\ndel nums[1]      # удаляем 20\nprint(nums)      # [10, 30, 40, 50]\ndel nums[1:3]    # удаляем [30, 40]\nprint(nums)      # [10, 50]\n\n# clear() — полная очистка\nnums.clear()\nprint(nums)  # []'
        },
        {
          type: 'tip',
          value: 'pop() возвращает удалённый элемент — это удобно для реализации стека (LIFO). Без аргументов pop() работает с последним элементом: O(1). С индексом — O(n) из-за сдвига элементов.'
        }
      ]
    },
    {
      id: 4,
      title: 'Сортировка: sort() и sorted()',
      content: [
        {
          type: 'heading',
          value: 'Сортировка списков'
        },
        {
          type: 'text',
          value: 'sort() сортирует список на месте (изменяет его, возвращает None). sorted() создаёт новый отсортированный список, не изменяя исходный. Оба поддерживают параметр key= для кастомной сортировки и reverse=True для обратного порядка.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'nums = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# sort() — изменяет список\nnums.sort()\nprint(nums)  # [1, 1, 2, 3, 4, 5, 6, 9]\n\nnums.sort(reverse=True)\nprint(nums)  # [9, 6, 5, 4, 3, 2, 1, 1]\n\n# sorted() — создаёт новый список\norig = [3, 1, 4, 1, 5]\nnew = sorted(orig)\nprint(orig)  # [3, 1, 4, 1, 5] — не изменился!\nprint(new)   # [1, 1, 3, 4, 5]\n\n# Сортировка строк\nwords = ["банан", "яблоко", "Абрикос", "вишня"]\nwords.sort()\nprint(words)  # Абрикос первый (заглавные раньше строчных)\n\n# Сортировка без учёта регистра\nwords.sort(key=str.lower)\nprint(words)  # [\'Абрикос\', \'банан\', \'вишня\', \'яблоко\']\n\n# Сортировка по ключу\npeople = [("Иван", 30), ("Алиса", 25), ("Боб", 35)]\npeople.sort(key=lambda p: p[1])  # по возрасту\nprint(people)  # [("Алиса", 25), ("Иван", 30), ("Боб", 35)]'
        }
      ]
    },
    {
      id: 5,
      title: 'Другие полезные методы',
      content: [
        {
          type: 'heading',
          value: 'index, count, reverse, copy'
        },
        {
          type: 'code',
          language: 'python',
          value: 'data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\n\n# count(value) — количество вхождений\nprint(data.count(5))   # 3\nprint(data.count(1))   # 2\n\n# index(value) — первое вхождение\nprint(data.index(5))   # 4\nprint(data.index(5, 5))  # 8 — поиск начиная с индекса 5\n\n# reverse() — разворот на месте\nnums = [1, 2, 3, 4, 5]\nnums.reverse()\nprint(nums)  # [5, 4, 3, 2, 1]\n\n# copy() — поверхностная копия\noriginal = [1, 2, 3]\ncopy1 = original.copy()\ncopy2 = original[:]       # срез тоже копия\ncopy3 = list(original)    # через конструктор\n\ncopy1.append(4)\nprint(original)  # [1, 2, 3] — не изменился\nprint(copy1)     # [1, 2, 3, 4]\n\n# Осторожно с вложенными списками!\nnested = [[1, 2], [3, 4]]\nshallow = nested.copy()  # поверхностная копия!\nshallow[0].append(99)    # изменяем вложенный список\nprint(nested)  # [[1, 2, 99], [3, 4]] — оригинал тоже изменился!'
        },
        {
          type: 'warning',
          value: 'Метод copy() создаёт поверхностную копию (shallow copy). Для вложенных структур нужна глубокая копия: import copy; deep = copy.deepcopy(original).'
        }
      ]
    },
    {
      id: 6,
      title: 'Генераторы списков (list comprehension)',
      content: [
        {
          type: 'heading',
          value: 'Компактное создание списков'
        },
        {
          type: 'text',
          value: 'List comprehension (генератор списка) — питоничный и эффективный способ создания списков. Синтаксис: [выражение for элемент in итерируемое if условие]. Это быстрее и читаемее, чем цикл с append().'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Обычный цикл\nsquares = []\nfor i in range(1, 6):\n    squares.append(i ** 2)\nprint(squares)  # [1, 4, 9, 16, 25]\n\n# То же самое через list comprehension\nsquares = [i ** 2 for i in range(1, 6)]\nprint(squares)  # [1, 4, 9, 16, 25]\n\n# С условием (фильтрация)\nevens = [i for i in range(20) if i % 2 == 0]\nprint(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n\n# Преобразование строк\nwords = ["hello", "world", "python"]\nupper = [w.upper() for w in words]\nprint(upper)  # ["HELLO", "WORLD", "PYTHON"]\n\n# Вложенный list comprehension\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [x for row in matrix for x in row]\nprint(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Условное выражение в comprehension\nresult = ["чётное" if i % 2 == 0 else "нечётное" for i in range(6)]\nprint(result)'
        }
      ]
    },
    {
      id: 7,
      title: 'zip() и распаковка',
      content: [
        {
          type: 'heading',
          value: 'Параллельный перебор и распаковка'
        },
        {
          type: 'text',
          value: 'zip() объединяет несколько итерируемых объектов в один, давая кортежи из соответствующих элементов. Распаковка (unpacking) позволяет присвоить элементы списка нескольким переменным сразу.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# zip — параллельный перебор\nnames = ["Алиса", "Боб", "Чарли"]\nages = [25, 30, 35]\n\nfor name, age in zip(names, ages):\n    print(f"{name}: {age} лет")\n\n# Создание словаря через zip\nkeys = ["a", "b", "c"]\nvalues = [1, 2, 3]\nd = dict(zip(keys, values))\nprint(d)  # {"a": 1, "b": 2, "c": 3}\n\n# Распаковка списка\nfirst, second, *rest = [1, 2, 3, 4, 5]\nprint(first)   # 1\nprint(second)  # 2\nprint(rest)    # [3, 4, 5]\n\n# Первый и последний\nfirst, *middle, last = [10, 20, 30, 40, 50]\nprint(first, last)  # 10 50\nprint(middle)       # [20, 30, 40]\n\n# Обмен значениями\na, b = 5, 10\na, b = b, a  # без временной переменной!\nprint(a, b)  # 10 5'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Обработка списка оценок',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите функции для обработки списка оценок студентов. Вычислите статистику и отфильтруйте данные.',
      requirements: [
        'Функция get_stats(grades) возвращает словарь: min, max, average, median',
        'Функция get_passing(grades, threshold=60) возвращает список оценок выше порога',
        'Функция get_grade_letter(score) возвращает буквенную оценку: A(90+), B(80+), C(70+), D(60+), F',
        'Выведите статистику для списка [85, 92, 78, 95, 61, 70, 88, 55, 79, 90]'
      ],
      expectedOutput: 'Минимум: 55\nМаксимум: 95\nСреднее: 79.3\nМедиана: 81.5\nПрошли порог: 8 из 10\nОценки: B A C A F C B F C A',
      hint: 'Для медианы отсортируйте список и возьмите средний элемент (или среднее двух средних для чётного количества). Используйте sorted() чтобы не изменять оригинал.',
      solution: 'def get_stats(grades):\n    s = sorted(grades)\n    n = len(s)\n    if n % 2 == 0:\n        median = (s[n//2 - 1] + s[n//2]) / 2\n    else:\n        median = s[n//2]\n    return {\n        "min": min(grades),\n        "max": max(grades),\n        "average": round(sum(grades) / len(grades), 1),\n        "median": median\n    }\n\ndef get_passing(grades, threshold=60):\n    return [g for g in grades if g >= threshold]\n\ndef get_grade_letter(score):\n    if score >= 90: return "A"\n    elif score >= 80: return "B"\n    elif score >= 70: return "C"\n    elif score >= 60: return "D"\n    else: return "F"\n\ngrades = [85, 92, 78, 95, 61, 70, 88, 55, 79, 90]\nstats = get_stats(grades)\nprint(f"Минимум: {stats[\'min\']}")\nprint(f"Максимум: {stats[\'max\']}")\nprint(f"Среднее: {stats[\'average\']}")\nprint(f"Медиана: {stats[\'median\']}")\npassing = get_passing(grades)\nprint(f"Прошли порог: {len(passing)} из {len(grades)}")\nletters = " ".join(get_grade_letter(g) for g in grades)\nprint(f"Оценки: {letters}")',
      explanation: 'sorted() создаёт новый отсортированный список без изменения исходного — важно для вычисления медианы. List comprehension с условием элегантно фильтрует список. Генераторное выражение в join() создаёт строку без создания промежуточного списка.'
    }
  ]
}
