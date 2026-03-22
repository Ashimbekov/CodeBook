export default {
  id: 37,
  title: 'collections',
  description: 'Изучим специализированные контейнеры из модуля collections: Counter, defaultdict, deque, namedtuple и OrderedDict',
  lessons: [
    {
      id: 1, title: 'Counter — счётчик элементов', type: 'theory',
      content: [
        { type: 'text', value: 'Counter — подкласс dict, который автоматически подсчитывает количество вхождений элементов. Идеален для частотного анализа текста, подсчёта голосов и статистики.' },
        { type: 'heading', value: 'Создание и использование Counter' },
        { type: 'code', language: 'python', value: 'from collections import Counter\n\n# Из строки\nletter_count = Counter("abracadabra")\nprint(letter_count)  # Counter({"a": 5, "b": 2, "r": 2, "c": 1, "d": 1})\n\n# Из списка\nwords = ["apple", "banana", "apple", "cherry", "banana", "apple"]\nword_count = Counter(words)\nprint(word_count)  # Counter({"apple": 3, "banana": 2, "cherry": 1})\n\n# Из словаря\nc = Counter({"red": 4, "blue": 2, "green": 1})\n\n# Доступ к несуществующему ключу — возвращает 0!\nprint(word_count["grape"])  # 0, не KeyError' },
        { type: 'heading', value: 'Методы Counter' },
        { type: 'code', language: 'python', value: 'from collections import Counter\n\nc = Counter("hello world hello python world")\n\n# N самых частых\nprint(c.most_common(3))  # [("o", 3), ("l", 3), ("d", 2)]\n\n# Арифметика счётчиков\nc1 = Counter(a=3, b=2, c=1)\nc2 = Counter(a=1, b=4)\nprint(c1 + c2)  # Counter({"b": 6, "a": 4, "c": 1})\nprint(c1 - c2)  # Counter({"a": 2, "c": 1})  — только положительные\n\n# Обновление\nc.update(["hello", "python"])\nprint(c["hello"])  # +1' },
        { type: 'tip', value: 'Counter.most_common() без аргумента возвращает все элементы по убыванию. Counter.elements() возвращает итератор с каждым элементом столько раз, сколько его count.' }
      ]
    },
    {
      id: 2, title: 'defaultdict — словарь с умолчанием', type: 'theory',
      content: [
        { type: 'text', value: 'defaultdict автоматически создаёт значение для несуществующего ключа. Это устраняет шаблонный код "если ключа нет — создай пустой список/0/...".' },
        { type: 'heading', value: 'Сравнение с обычным dict' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict\n\n# Обычный dict — нужно проверять или использовать setdefault\ngroups_old = {}\nfor word in ["apple", "banana", "avocado", "blueberry", "cherry"]:\n    first = word[0]\n    if first not in groups_old:\n        groups_old[first] = []\n    groups_old[first].append(word)\n\n# defaultdict — чище!\ngroups = defaultdict(list)  # default_factory = list\nfor word in ["apple", "banana", "avocado", "blueberry", "cherry"]:\n    groups[word[0]].append(word)\n\nprint(dict(groups))\n# {"a": ["apple","avocado"], "b": ["banana","blueberry"], "c": ["cherry"]}' },
        { type: 'heading', value: 'Разные типы default_factory' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict\n\n# int — для подсчёта (0 по умолчанию)\nword_count = defaultdict(int)\nfor word in "the cat sat on the mat".split():\n    word_count[word] += 1\nprint(dict(word_count))\n\n# set — для уникальных значений\ntags = defaultdict(set)\ntags["python"].add("programming")\ntags["python"].add("language")\ntags["java"].add("programming")\nprint(dict(tags))\n\n# lambda для сложных умолчаний\nconfig = defaultdict(lambda: {"value": 0, "enabled": True})\nconfig["feature_a"]["value"] = 42\nprint(config["new_feature"])  # {"value": 0, "enabled": True}' }
      ]
    },
    {
      id: 3, title: 'deque — двусторонняя очередь', type: 'theory',
      content: [
        { type: 'text', value: 'deque (double-ended queue) — быстрая очередь с добавлением/удалением с обоих концов. Операции O(1) против O(n) для list.insert(0, ...).' },
        { type: 'heading', value: 'Основные операции deque' },
        { type: 'code', language: 'python', value: 'from collections import deque\n\nd = deque([1, 2, 3, 4, 5])\n\n# Добавление\nd.append(6)       # добавить справа: [1,2,3,4,5,6]\nd.appendleft(0)   # добавить слева: [0,1,2,3,4,5,6]\n\n# Удаление\nd.pop()           # удалить справа -> 6\nd.popleft()       # удалить слева -> 0\n\nprint(d)  # deque([1, 2, 3, 4, 5])\n\n# Ротация\nd.rotate(2)   # сдвинуть вправо: [4, 5, 1, 2, 3]\nd.rotate(-2)  # сдвинуть влево: [1, 2, 3, 4, 5]' },
        { type: 'heading', value: 'deque с ограниченным размером' },
        { type: 'code', language: 'python', value: 'from collections import deque\n\n# maxlen — автоматически удаляет старые элементы\nhistory = deque(maxlen=3)\n\ncommands = ["ls", "cd home", "pwd", "cat file.txt", "grep pattern"]\nfor cmd in commands:\n    history.append(cmd)\n    print(f"История: {list(history)}")\n\n# Последние 3 сообщения всегда в очереди\n# deque(["pwd", "cat file.txt", "grep pattern"])' },
        { type: 'tip', value: 'deque идеален для реализации очередей (FIFO) и стеков (LIFO). Для реализации BFS в графах — deque стандартный выбор.' }
      ]
    },
    {
      id: 4, title: 'namedtuple — именованные кортежи', type: 'theory',
      content: [
        { type: 'text', value: 'namedtuple создаёт класс кортежа с именованными полями. Данные неизменяемы, доступны по имени и по индексу. Это легковесная альтернатива датаклассам.' },
        { type: 'heading', value: 'Создание и использование' },
        { type: 'code', language: 'python', value: 'from collections import namedtuple\n\n# Создание класса\nPoint = namedtuple("Point", ["x", "y"])\nColor = namedtuple("Color", "red green blue")  # можно через строку\n\n# Создание экземпляров\np = Point(3, 4)\nc = Color(255, 128, 0)\n\n# Доступ по имени И по индексу\nprint(p.x, p.y)    # 3 4\nprint(p[0], p[1])  # 3 4\nprint(c.red)       # 255\n\n# Конвертация\nprint(p._asdict())      # {"x": 3, "y": 4}\nprint(p._replace(x=10)) # Point(x=10, y=4) — создаёт новый!' },
        { type: 'heading', value: 'typing.NamedTuple — современный синтаксис' },
        { type: 'code', language: 'python', value: 'from typing import NamedTuple\n\nclass Employee(NamedTuple):\n    name: str\n    department: str\n    salary: float = 50000.0  # значение по умолчанию!\n\n    def annual_salary(self) -> float:  # можно добавлять методы!\n        return self.salary * 12\n\ne = Employee("Аня", "IT", 80000)\nprint(e)                   # Employee(name="Аня", department="IT", salary=80000)\nprint(e.annual_salary())   # 960000.0' },
        { type: 'note', value: 'typing.NamedTuple предпочтительнее наследуется лучше, поддерживает аннотации типов и методы. collections.namedtuple — более легковесный вариант.' }
      ]
    },
    {
      id: 5, title: 'OrderedDict и ChainMap', type: 'theory',
      content: [
        { type: 'text', value: 'OrderedDict помнит порядок вставки (в Python 3.7+ обычный dict тоже это делает). ChainMap объединяет несколько словарей в один вид.' },
        { type: 'heading', value: 'OrderedDict' },
        { type: 'code', language: 'python', value: 'from collections import OrderedDict\n\n# Особенность OrderedDict: move_to_end()\nod = OrderedDict()\nod["a"] = 1\nod["b"] = 2\nod["c"] = 3\n\nod.move_to_end("a")         # переместить "a" в конец\nod.move_to_end("c", last=False)  # переместить "c" в начало\n\nprint(list(od.keys()))  # ["c", "b", "a"]\n\n# popitem(last=True/False)\nprint(od.popitem(last=False))  # ("c", 3) — из начала' },
        { type: 'heading', value: 'ChainMap — цепочка словарей' },
        { type: 'code', language: 'python', value: 'from collections import ChainMap\n\n# Приоритет конфигураций: CLI > env > default\ndefaults  = {"color": "blue", "timeout": 30, "debug": False}\nenv_vars  = {"timeout": 60, "host": "prod"}\ncli_args  = {"debug": True}\n\nconfig = ChainMap(cli_args, env_vars, defaults)\nprint(config["debug"])   # True (из cli_args)\nprint(config["timeout"]) # 60 (из env_vars)\nprint(config["color"])   # "blue" (из defaults)\n\n# Изменения идут в первый словарь\nconfig["new_key"] = "value"\nprint(cli_args)  # {"debug": True, "new_key": "value"}' }
      ]
    },
    {
      id: 6, title: 'heapq — приоритетная очередь', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль heapq реализует кучу (heap) на основе списка. Минимальный элемент всегда на позиции 0. Используется для приоритетных очередей и нахождения N наименьших/наибольших элементов.' },
        { type: 'heading', value: 'Основные операции heapq' },
        { type: 'code', language: 'python', value: 'import heapq\n\n# Создание кучи\nnums = [5, 1, 8, 2, 9, 3]\nheapq.heapify(nums)  # преобразует список в кучу O(n)\nprint(nums)  # [1, 2, 3, 5, 9, 8] (порядок элементов, не sorted!)\n\n# Извлечение минимума\nprint(heapq.heappop(nums))  # 1 — минимальный элемент\nprint(heapq.heappop(nums))  # 2\n\n# Добавление\nheapq.heappush(nums, 0)  # добавить 0, порядок сохранится\n\n# N наименьших/наибольших\ndata = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\nprint(heapq.nsmallest(3, data))  # [1, 1, 2]\nprint(heapq.nlargest(3, data))   # [9, 6, 5]' }
      ]
    },
    {
      id: 7, title: 'Практика: Анализ текста', type: 'practice', difficulty: 'medium',
      description: 'Используя Counter, defaultdict и deque, проанализируй текст и выведи статистику.',
      requirements: [
        'Используй Counter для подсчёта слов и букв',
        'defaultdict(list) для группировки слов по первой букве',
        'deque(maxlen=5) для хранения последних 5 уникальных слов',
        'Найди топ-5 слов и топ-3 буквы',
        'Выведи группы слов по алфавиту (только группы с 2+ словами)',
        'Последние 5 уникальных слов из текста'
      ],
      expectedOutput: 'Топ-5 слов: [("the", 3), ("quick", 1), ("brown", 1), ("fox", 1), ("jumps", 1)]\nТоп-3 буквы: [("t", 6), ("h", 4), ("e", 4)]\nГруппы (2+): {"t": ["the", "the", "the"], ...}\nПоследние 5: deque([...])',
      hint: 'text.lower().split() для слов. "".join(text.lower().split()) для всех букв без пробелов. Группировка: for w in words: groups[w[0]].append(w).',
      solution: 'from collections import Counter, defaultdict, deque\n\ntext = "the quick brown fox jumps over the lazy dog the cat sat on the mat"\nwords = text.lower().split()\nletters = "".join(c for c in text.lower() if c.isalpha())\n\n# Counter для слов и букв\nword_counter = Counter(words)\nletter_counter = Counter(letters)\n\nprint(f"Топ-5 слов: {word_counter.most_common(5)}")\nprint(f"Топ-3 буквы: {letter_counter.most_common(3)}")\n\n# defaultdict для группировки по первой букве\ngroups = defaultdict(list)\nfor word in words:\n    groups[word[0]].append(word)\n\n# Только группы с 2+ элементами\nbig_groups = {k: v for k, v in groups.items() if len(v) >= 2}\nprint(f"Группы (2+): {dict(big_groups)}")\n\n# deque для последних 5 уникальных слов\nseen = set()\nlast_5 = deque(maxlen=5)\nfor word in words:\n    if word not in seen:\n        seen.add(word)\n        last_5.append(word)\n\nprint(f"Последние 5 уникальных: {last_5}")',
      explanation: 'Counter.most_common() сразу даёт отсортированный результат. defaultdict(list) исключает проверку "если ключа нет — создай список". deque(maxlen=5) автоматически удаляет старые элементы — идеально для "последних N". Комбинирование этих структур делает анализ элегантным.'
    }
  ]
}
