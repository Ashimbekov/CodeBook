export default {
  id: 10,
  title: 'Множества (set)',
  description: 'Множества Python: создание, методы add/discard/remove, операции объединения, пересечения, разности и симметрической разности.',
  lessons: [
    {
      id: 1,
      title: 'Создание множеств',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Set — коллекция уникальных элементов'
        },
        {
          type: 'text',
          value: 'Множество (set) — неупорядоченная коллекция уникальных неизменяемых элементов. Главные особенности: нет дублей, нет порядка, очень быстрая проверка принадлежности (O(1)). Используется для удаления дубликатов и операций над множествами.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание множества\nempty_set = set()  # НЕ {} — это пустой словарь!\nnums = {1, 2, 3, 4, 5}\nfruits = {"яблоко", "банан", "вишня"}\n\n# Дубли удаляются автоматически!\nduplicates = {1, 2, 2, 3, 3, 3}\nprint(duplicates)  # {1, 2, 3} — только уникальные\n\n# Из итерируемых объектов\nfrom_list = set([1, 2, 2, 3, 3])  # {1, 2, 3}\nfrom_string = set("hello")        # {"h", "e", "l", "o"}\n\n# Проверка принадлежности — O(1)!\nprint(3 in nums)     # True\nprint(6 in nums)     # False\nprint("яблоко" in fruits)  # True\n\n# Удаление дублей из списка\ndata = [1, 2, 2, 3, 1, 4, 3, 5]\nunique = list(set(data))\nprint(sorted(unique))  # [1, 2, 3, 4, 5]\n\nprint(len(nums))   # 5\nprint(type(nums))  # <class "set">'
        }
      ]
    },
    {
      id: 2,
      title: 'Методы add, discard, remove, pop',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Изменение множества'
        },
        {
          type: 'code',
          language: 'python',
          value: 's = {1, 2, 3}\n\n# add() — добавить элемент\ns.add(4)\nprint(s)  # {1, 2, 3, 4}\ns.add(2)  # дубль игнорируется\nprint(s)  # {1, 2, 3, 4}\n\n# remove() — удалить (KeyError если нет)\ns.remove(3)\nprint(s)  # {1, 2, 4}\ntry:\n    s.remove(99)  # KeyError!\nexcept KeyError:\n    print("Элемент не найден")\n\n# discard() — удалить (без ошибки если нет)\ns.discard(99)  # ничего не происходит\nprint(s)  # {1, 2, 4}\n\n# pop() — удалить и вернуть произвольный элемент\nval = s.pop()\nprint(val)  # какой-то элемент\n\n# update() — добавить несколько элементов\ns2 = {1, 2}\ns2.update([3, 4, 5])\nprint(s2)  # {1, 2, 3, 4, 5}\ns2.update({5, 6}, {7})  # из нескольких коллекций\nprint(s2)'
        }
      ]
    },
    {
      id: 3,
      title: 'Операции над множествами',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Объединение, пересечение, разность'
        },
        {
          type: 'text',
          value: 'Множества поддерживают математические операции: объединение (|), пересечение (&), разность (-), симметрическая разность (^). Каждая операция возвращает новое множество и не изменяет исходные.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'python_devs = {"Иван", "Алиса", "Боб", "Чарли"}\njava_devs = {"Алиса", "Дэвид", "Чарли", "Ева"}\n\n# Объединение (union) — все разработчики\nall_devs = python_devs | java_devs\nprint("Все:", all_devs)\n# или: python_devs.union(java_devs)\n\n# Пересечение (intersection) — знают оба языка\nboth = python_devs & java_devs\nprint("Оба языка:", both)  # {"Алиса", "Чарли"}\n# или: python_devs.intersection(java_devs)\n\n# Разность (difference) — только Python, не Java\nonly_python = python_devs - java_devs\nprint("Только Python:", only_python)  # {"Иван", "Боб"}\n# или: python_devs.difference(java_devs)\n\n# Симметрическая разность — знают только один язык\nexclusive = python_devs ^ java_devs\nprint("Только один язык:", exclusive)\n# или: python_devs.symmetric_difference(java_devs)\n\n# Подмножество и надмножество\na = {1, 2}\nb = {1, 2, 3, 4}\nprint(a.issubset(b))    # True  — a подмножество b\nprint(b.issuperset(a))  # True  — b надмножество a\nprint(a <= b)           # True  — то же что issubset\nprint(a < b)            # True  — строгое подмножество'
        }
      ]
    },
    {
      id: 4,
      title: 'Frozenset — неизменяемое множество',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'frozenset — хэшируемое множество'
        },
        {
          type: 'text',
          value: 'frozenset — неизменяемая версия множества. Поддерживает все операции чтения и математические операции, но не методы изменения (add, remove и т.д.). Главное применение: использование как ключа словаря или элемента другого множества.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# frozenset\nfs = frozenset({1, 2, 3})\nprint(fs)  # frozenset({1, 2, 3})\n\n# Нельзя изменить\ntry:\n    fs.add(4)  # AttributeError\nexcept AttributeError:\n    print("frozenset неизменяем")\n\n# Можно использовать как ключ словаря\ngraph = {\n    frozenset({"A", "B"}): 5,   # ребро A-B, вес 5\n    frozenset({"B", "C"}): 3,   # ребро B-C, вес 3\n}\nprint(graph[frozenset({"A", "B"})])  # 5\n\n# frozenset в множестве\nsets_collection = {frozenset({1, 2}), frozenset({3, 4})}\nprint(sets_collection)\n\n# Операции работают как для set\nfs1 = frozenset({1, 2, 3})\nfs2 = frozenset({2, 3, 4})\nprint(fs1 & fs2)  # frozenset({2, 3})'
        }
      ]
    },
    {
      id: 5,
      title: 'Set comprehension и практические применения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Генераторы множеств'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Set comprehension\nsquares = {x**2 for x in range(-5, 6)}\nprint(sorted(squares))  # [0, 1, 4, 9, 16, 25]\n\n# Уникальные символы в строке\nletters = {c.lower() for c in "Hello World" if c.isalpha()}\nprint(sorted(letters))  # ["d", "e", "h", "l", "o", "r", "w"]\n\n# Практика 1: Нахождение общих элементов в списках\nlist1 = [1, 2, 3, 4, 5]\nlist2 = [3, 4, 5, 6, 7]\ncommon = set(list1) & set(list2)\nprint("Общие:", common)  # {3, 4, 5}\n\n# Практика 2: Уникальные IP-адреса из логов\nlogs = [\n    "192.168.1.1 GET /",\n    "10.0.0.1 POST /api",\n    "192.168.1.1 GET /about",  # дубль\n    "10.0.0.2 GET /"\n]\nunique_ips = {log.split()[0] for log in logs}\nprint("Уникальных IP:", len(unique_ips))\nprint(unique_ips)\n\n# Практика 3: Проверка отсутствия дублей\ndef has_duplicates(lst):\n    return len(lst) != len(set(lst))\n\nprint(has_duplicates([1, 2, 3, 4]))      # False\nprint(has_duplicates([1, 2, 2, 3]))      # True'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ пересечений',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для анализа посещаемости курсов студентами. Используйте операции над множествами.',
      requirements: [
        'Задайте три группы студентов: python_students, js_students, sql_students',
        'Найдите студентов, посещающих все три курса',
        'Найдите студентов, посещающих хотя бы два курса',
        'Найдите студентов, посещающих только один конкретный курс',
        'Выведите полный отчёт'
      ],
      expectedOutput: 'Python: 5 студентов\nJS: 5 студентов\nSQL: 5 студентов\nВсе три курса: {"Алиса"}\nТолько Python: {"Иван", "Петр"}\nВсе уникальные студенты: 8',
      hint: 'Для "хотя бы два курса" подсчитайте, сколько множеств содержат каждого студента. Используйте операции & для пересечения и - для разности.',
      solution: 'python_students = {"Алиса", "Иван", "Боб", "Петр", "Мария"}\njs_students = {"Алиса", "Боб", "Анна", "Дмитрий", "Мария"}\nsql_students = {"Алиса", "Анна", "Сергей", "Ольга", "Боб"}\n\nall_three = python_students & js_students & sql_students\nonly_python = python_students - js_students - sql_students\nall_students = python_students | js_students | sql_students\n\nprint(f"Python: {len(python_students)} студентов")\nprint(f"JS: {len(js_students)} студентов")\nprint(f"SQL: {len(sql_students)} студентов")\nprint(f"Все три курса: {all_three}")\nprint(f"Только Python: {only_python}")\nprint(f"Все уникальные студенты: {len(all_students)}")',
      explanation: 'Оператор & даёт пересечение — элементы, присутствующие во всех множествах. Оператор - даёт разность — элементы первого, которых нет в остальных. Оператор | даёт объединение — все уникальные элементы. Подсчёт len() множества мгновенен — O(1).'
    }
  ]
}
