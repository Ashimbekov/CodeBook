export default {
  id: 19,
  title: 'Магические методы',
  description: 'Dunder-методы Python: __str__, __repr__, __eq__, __lt__, __add__, __len__, __getitem__ и другие для создания богатых объектов.',
  lessons: [
    {
      id: 1,
      title: '__str__ и __repr__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Строковое представление объектов'
        },
        {
          type: 'text',
          value: '__str__ вызывается при print() и str() — читаемое представление для пользователя. __repr__ вызывается в интерпретаторе и repr() — техническое представление. Хороший __repr__ должен позволять воссоздать объект: eval(repr(obj)) == obj.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __str__(self):\n        return f"({self.x}, {self.y})"\n    \n    def __repr__(self):\n        return f"Point(x={self.x!r}, y={self.y!r})"\n\np = Point(3, 4)\nprint(p)        # (3, 4)         — вызывает __str__\nprint(repr(p))  # Point(x=3, y=4) — вызывает __repr__\nprint(str(p))   # (3, 4)\n\n# В списке используется __repr__\npoints = [Point(1, 2), Point(3, 4)]\nprint(points)  # [Point(x=1, y=2), Point(x=3, y=4)]\n\n# f-строки\nprint(f"{p}")    # (3, 4)         — __str__\nprint(f"{p!r}")  # Point(x=3, y=4) — __repr__\nprint(f"{p!s}")  # (3, 4)         — явно __str__\n\n# Если __str__ не определён — используется __repr__\nclass MinimalClass:\n    def __repr__(self):\n        return "MinimalClass()"\n\nobj = MinimalClass()\nprint(obj)   # MinimalClass() — fallback к __repr__'
        }
      ]
    },
    {
      id: 2,
      title: '__eq__, __ne__, __hash__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Операторы сравнения'
        },
        {
          type: 'text',
          value: '__eq__ определяет ==. По умолчанию объекты равны только если это один и тот же объект в памяти. Если переопределить __eq__, нужно также переопределить __hash__ (или установить его в None, если объект изменяемый).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return NotImplemented  # позволяет Python попробовать other.__eq__(self)\n        return self.x == other.x and self.y == other.y\n    \n    def __ne__(self, other):\n        result = self.__eq__(other)\n        if result is NotImplemented:\n            return result\n        return not result\n    \n    def __hash__(self):\n        # Если объекты равны — хэши должны быть равны!\n        return hash((self.x, self.y))\n    \n    def __repr__(self):\n        return f"Point({self.x}, {self.y})"\n\np1 = Point(1, 2)\np2 = Point(1, 2)\np3 = Point(3, 4)\n\nprint(p1 == p2)  # True  — одинаковые координаты\nprint(p1 is p2)  # False — разные объекты\nprint(p1 != p3)  # True\n\n# Можно использовать в множестве и словаре (нужен __hash__)\npoints_set = {p1, p2, p3}\nprint(points_set)  # {Point(1, 2), Point(3, 4)} — дубль удалён!\n\npoints_dict = {p1: "точка А"}\nprint(points_dict[p2])  # "точка А" — p1 == p2!'
        }
      ]
    },
    {
      id: 3,
      title: 'Операторы сравнения __lt__, __le__, __gt__, __ge__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Упорядочивание объектов'
        },
        {
          type: 'text',
          value: 'Для поддержки операторов <, <=, >, >= определяются соответственно __lt__, __le__, __gt__, __ge__. Декоратор @functools.total_ordering позволяет определить только __eq__ и один из операторов сравнения, остальные будут выведены автоматически.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from functools import total_ordering\n\n@total_ordering\nclass Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n    \n    def __eq__(self, other):\n        if not isinstance(other, Temperature):\n            return NotImplemented\n        return self.celsius == other.celsius\n    \n    def __lt__(self, other):  # только этот нужен с @total_ordering\n        if not isinstance(other, Temperature):\n            return NotImplemented\n        return self.celsius < other.celsius\n    \n    def __repr__(self):\n        return f"Temperature({self.celsius}°C)"\n\nt1 = Temperature(20)\nt2 = Temperature(30)\nt3 = Temperature(20)\n\nprint(t1 < t2)   # True\nprint(t1 > t2)   # False  — автоматически из @total_ordering\nprint(t1 <= t3)  # True   — автоматически\nprint(t1 >= t3)  # True   — автоматически\n\n# Сортировка работает!\ntemps = [Temperature(30), Temperature(10), Temperature(20)]\ntemps.sort()\nprint(temps)  # [Temperature(10°C), Temperature(20°C), Temperature(30°C)]\nprint(min(temps), max(temps))'
        }
      ]
    },
    {
      id: 4,
      title: 'Арифметические операторы __add__, __mul__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Операции над объектами'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __add__(self, other):  # v1 + v2\n        return Vector(self.x + other.x, self.y + other.y)\n    \n    def __sub__(self, other):  # v1 - v2\n        return Vector(self.x - other.x, self.y - other.y)\n    \n    def __mul__(self, scalar):  # v * n\n        return Vector(self.x * scalar, self.y * scalar)\n    \n    def __rmul__(self, scalar):  # n * v (правый множитель)\n        return self.__mul__(scalar)\n    \n    def __neg__(self):  # -v\n        return Vector(-self.x, -self.y)\n    \n    def __abs__(self):  # abs(v) — длина вектора\n        return (self.x ** 2 + self.y ** 2) ** 0.5\n    \n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n\nv1 = Vector(1, 2)\nv2 = Vector(3, 4)\n\nprint(v1 + v2)  # Vector(4, 6)\nprint(v1 - v2)  # Vector(-2, -2)\nprint(v1 * 3)   # Vector(3, 6)\nprint(3 * v1)   # Vector(3, 6) — через __rmul__\nprint(-v1)      # Vector(-1, -2)\nprint(abs(v2))  # 5.0 — длина вектора (3-4-5)'
        }
      ]
    },
    {
      id: 5,
      title: '__len__, __getitem__, __contains__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Протокол последовательности'
        },
        {
          type: 'text',
          value: '__len__ позволяет использовать len(). __getitem__ позволяет индексирование []. __contains__ позволяет оператор in. Реализовав эти методы, объект ведёт себя как последовательность.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self._tracks = []\n    \n    def add_track(self, track):\n        self._tracks.append(track)\n    \n    def __len__(self):\n        return len(self._tracks)\n    \n    def __getitem__(self, index):\n        return self._tracks[index]\n    \n    def __contains__(self, track):\n        return track in self._tracks\n    \n    def __iter__(self):\n        return iter(self._tracks)\n    \n    def __repr__(self):\n        return f"Playlist({self.name!r}, {len(self)} tracks)"\n\npl = Playlist("Моя музыка")\npl.add_track("Bohemian Rhapsody")\npl.add_track("Hotel California")\npl.add_track("Stairway to Heaven")\n\nprint(len(pl))          # 3\nprint(pl[0])            # Bohemian Rhapsody\nprint(pl[-1])           # Stairway to Heaven\nprint(pl[1:3])          # срезы тоже работают!\nprint("Hotel California" in pl)  # True\n\n# Перебор в цикле (работает через __iter__)\nfor track in pl:\n    print(" -", track)'
        }
      ]
    },
    {
      id: 6,
      title: '__call__ и контекстный менеджер',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Вызываемые объекты и with'
        },
        {
          type: 'code',
          language: 'python',
          value: '# __call__ — объект как функция\nclass Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n    \n    def __call__(self, x):\n        return x * self.factor\n\ndouble = Multiplier(2)\ntriple = Multiplier(3)\n\nprint(double(5))   # 10\nprint(triple(5))   # 15\nprint(callable(double))  # True\n\n# Применение: кэширование результатов\nclass Memoize:\n    def __init__(self, func):\n        self.func = func\n        self.cache = {}\n    \n    def __call__(self, *args):\n        if args not in self.cache:\n            self.cache[args] = self.func(*args)\n        return self.cache[args]\n\n@Memoize\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(35))  # быстро!\n\n# __enter__ и __exit__ — контекстный менеджер\nclass Timer:\n    import time\n    def __enter__(self):\n        import time\n        self.start = time.time()\n        return self\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        import time\n        self.elapsed = time.time() - self.start\n        print(f"Время: {self.elapsed:.3f}с")\n        return False\n\nwith Timer() as t:\n    sum(range(1000000))'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Класс Matrix',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Реализуйте класс Matrix с поддержкой основных матричных операций через магические методы.',
      requirements: [
        'Класс Matrix принимает список списков',
        '__add__ — сложение матриц',
        '__mul__ — умножение на скаляр (и матрицу если хотите)',
        '__getitem__ — доступ по индексу matrix[i][j]',
        '__len__ — количество строк',
        '__eq__ — сравнение матриц',
        '__str__ — красивый вывод матрицы'
      ],
      expectedOutput: 'Матрица A:\n1 2 3\n4 5 6\n\nМатрица B:\n7 8 9\n1 2 3\n\nA + B:\n8 10 12\n5 7 9\n\nA * 2:\n2 4 6\n8 10 12\n\nA[0][1] = 2\nlen(A) = 2',
      hint: 'Для __add__ создайте новую матрицу, складывая соответствующие элементы. Проверьте совместимость размеров. Для __str__ используйте join для форматирования строк.',
      solution: 'class Matrix:\n    def __init__(self, data):\n        self.data = [list(row) for row in data]\n        self.rows = len(data)\n        self.cols = len(data[0]) if data else 0\n    \n    def __add__(self, other):\n        if self.rows != other.rows or self.cols != other.cols:\n            raise ValueError("Размеры матриц не совпадают")\n        result = [[self.data[i][j] + other.data[i][j]\n                   for j in range(self.cols)]\n                  for i in range(self.rows)]\n        return Matrix(result)\n    \n    def __mul__(self, scalar):\n        result = [[x * scalar for x in row] for row in self.data]\n        return Matrix(result)\n    \n    def __rmul__(self, scalar):\n        return self.__mul__(scalar)\n    \n    def __getitem__(self, index):\n        return self.data[index]\n    \n    def __len__(self):\n        return self.rows\n    \n    def __eq__(self, other):\n        return self.data == other.data\n    \n    def __str__(self):\n        return "\\n".join(" ".join(str(x) for x in row) for row in self.data)\n    \n    def __repr__(self):\n        return f"Matrix({self.data!r})"\n\nA = Matrix([[1, 2, 3], [4, 5, 6]])\nB = Matrix([[7, 8, 9], [1, 2, 3]])\n\nprint("Матрица A:")\nprint(A)\nprint("\\nМатрица B:")\nprint(B)\nprint("\\nA + B:")\nprint(A + B)\nprint("\\nA * 2:")\nprint(A * 2)\nprint(f"\\nA[0][1] = {A[0][1]}")\nprint(f"len(A) = {len(A)}")',
      explanation: 'List comprehension вложенный в list comprehension создаёт новую матрицу за одно выражение. __rmul__ позволяет писать 2 * A (а не только A * 2). __getitem__ возвращает строку (список), что позволяет двойную индексацию A[i][j]. __repr__ с !r для data создаёт строку, которую можно eval().'
    }
  ]
}
