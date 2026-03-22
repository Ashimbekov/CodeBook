export default {
  id: 8,
  title: 'Кортежи (tuple)',
  description: 'Кортежи — неизменяемые последовательности. Создание, распаковка, именованные кортежи и когда использовать tuple вместо list.',
  lessons: [
    {
      id: 1,
      title: 'Создание кортежей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Tuple — неизменяемый список'
        },
        {
          type: 'text',
          value: 'Кортеж (tuple) похож на список, но неизменяем (immutable). После создания нельзя добавить, удалить или изменить элементы. Это делает кортежи быстрее списков и безопаснее для хранения данных, которые не должны меняться.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание кортежей\nempty = ()\nsingleton = (42,)  # ВАЖНО: запятая обязательна!\nnot_tuple = (42)   # это просто число в скобках\n\npoint = (3, 5)\ncolors = ("красный", "зелёный", "синий")\nmixed = (1, "hello", 3.14, True)\n\nprint(type(singleton))   # <class "tuple">\nprint(type(not_tuple))   # <class "int">\n\n# Без скобок (скобки часто необязательны)\ncoords = 10, 20\nprint(type(coords))  # <class "tuple">\nprint(coords)        # (10, 20)\n\n# Из других итерируемых\nfrom_list = tuple([1, 2, 3])\nfrom_string = tuple("abc")\nprint(from_list)    # (1, 2, 3)\nprint(from_string)  # ("a", "b", "c")'
        }
      ]
    },
    {
      id: 2,
      title: 'Неизменяемость (immutability)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Зачем нужна неизменяемость?'
        },
        {
          type: 'text',
          value: 'Неизменяемость — ключевое свойство кортежей. Попытка изменить элемент вызовет TypeError. Но если кортеж содержит изменяемый объект (например, список), сам список можно изменить — изменяется содержимое, а не ссылка.'
        },
        {
          type: 'code',
          language: 'python',
          value: 't = (1, 2, 3)\n\n# Нельзя изменить\ntry:\n    t[0] = 10  # TypeError!\nexcept TypeError as e:\n    print("Ошибка:", e)\n\n# Нельзя добавить или удалить\ntry:\n    t.append(4)  # AttributeError — нет метода append\nexcept AttributeError as e:\n    print("Ошибка:", e)\n\n# НО: если элемент изменяемый — его можно изменить\nt2 = ([1, 2], [3, 4])\nt2[0].append(99)  # изменяем список внутри кортежа\nprint(t2)  # ([1, 2, 99], [3, 4])\n\n# Преимущества неизменяемости:\n# 1. Можно использовать как ключ словаря\npoint = (3, 5)\nd = {point: "точка А"}\nprint(d[(3, 5)])  # "точка А"\n\n# 2. Можно использовать в множествах\npoints = {(1, 2), (3, 4), (1, 2)}\nprint(points)  # {(1, 2), (3, 4)} — дублей нет'
        },
        {
          type: 'tip',
          value: 'Используйте кортежи для данных, которые не должны изменяться: координаты, RGB-цвета, константы. Кортежи занимают меньше памяти и быстрее создаются чем списки.'
        }
      ]
    },
    {
      id: 3,
      title: 'Распаковка кортежей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Tuple unpacking'
        },
        {
          type: 'text',
          value: 'Распаковка позволяет присвоить элементы кортежа нескольким переменным в одну строку. Это одна из самых питоничных возможностей языка. Работает с любым итерируемым объектом, не только с кортежами.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовая распаковка\npoint = (10, 20)\nx, y = point\nprint(x, y)  # 10 20\n\n# Должно совпадать количество\ntry:\n    a, b, c = (1, 2)  # ValueError\nexcept ValueError as e:\n    print("Ошибка:", e)\n\n# Оператор * для сбора остатка\nfirst, *rest = (1, 2, 3, 4, 5)\nprint(first)  # 1\nprint(rest)   # [2, 3, 4, 5]\n\nfirst, *middle, last = (1, 2, 3, 4, 5)\nprint(middle)  # [2, 3, 4]\n\n# Обмен значениями\na, b = 5, 10\na, b = b, a  # под капотом создаётся кортеж (b, a)\nprint(a, b)  # 10 5\n\n# Распаковка в цикле\npoints = [(1, 2), (3, 4), (5, 6)]\nfor x, y in points:\n    print(f"Точка: ({x}, {y})")\n\n# Игнорирование ненужных значений через _\nname, _, age = ("Алиса", "F", 28)\nprint(name, age)  # Алиса 28'
        }
      ]
    },
    {
      id: 4,
      title: 'Именованные кортежи (namedtuple)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'collections.namedtuple'
        },
        {
          type: 'text',
          value: 'Именованный кортеж (namedtuple) — это кортеж, у элементов которого есть имена. Это делает код более читаемым: вместо point[0] пишем point.x. Наследует все свойства tuple: неизменяемость, быстрота, возможность использовать как ключ.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from collections import namedtuple\n\n# Создание типа\nPoint = namedtuple("Point", ["x", "y"])\nColor = namedtuple("Color", "r g b")  # через строку с пробелами\n\n# Создание экземпляров\np = Point(10, 20)\nc = Color(255, 128, 0)\n\n# Доступ по имени\nprint(p.x, p.y)    # 10 20\nprint(c.r, c.g, c.b)  # 255 128 0\n\n# Доступ по индексу — тоже работает\nprint(p[0], p[1])  # 10 20\n\n# Распаковка\nx, y = p\nprint(x, y)  # 10 20\n\n# _asdict() — конвертация в OrderedDict\nprint(p._asdict())  # {"x": 10, "y": 20}\n\n# _replace() — создание копии с изменёнными полями\np2 = p._replace(x=100)\nprint(p)   # Point(x=10, y=20) — не изменился\nprint(p2)  # Point(x=100, y=20)\n\n# Применение: возврат из функции\nResult = namedtuple("Result", ["value", "error", "status"])\ndef divide(a, b):\n    if b == 0:\n        return Result(value=None, error="Деление на ноль", status=False)\n    return Result(value=a/b, error=None, status=True)\n\nresult = divide(10, 2)\nif result.status:\n    print(f"Результат: {result.value}")'
        }
      ]
    },
    {
      id: 5,
      title: 'Кортеж vs Список: когда что использовать',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Выбор между tuple и list'
        },
        {
          type: 'text',
          value: 'Правило: используйте кортеж когда данные не должны изменяться (координаты, RGB, конфигурация, возвращаемые значения из функций). Используйте список, когда нужно добавлять/удалять элементы.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Кортежи: для фиксированных структур\nRED = (255, 0, 0)          # константный цвет\nDEFAULT_SIZE = (1920, 1080) # разрешение экрана\nMONTHS = ("Январь", "Февраль", "Март")  # неизменный набор\n\n# Кортеж как ключ словаря (список — нельзя!)\ncache = {}\nkey = (10, 20)  # координата\ncache[key] = "данные"\n\n# Функция возвращает несколько значений (через кортеж)\ndef minmax(numbers):\n    return min(numbers), max(numbers)  # неявный кортеж\n\nmn, mx = minmax([3, 1, 4, 1, 5, 9])\nprint(f"min={mn}, max={mx}")  # min=1, max=9\n\n# Производительность\nimport sys\nlist_data = [1, 2, 3, 4, 5]\ntuple_data = (1, 2, 3, 4, 5)\n\nprint(sys.getsizeof(list_data))   # 120 байт (примерно)\nprint(sys.getsizeof(tuple_data))  # 80 байт (примерно)\n# Кортеж занимает меньше памяти!'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система координат',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для работы с точками в 2D пространстве, используя именованные кортежи.',
      requirements: [
        'Создайте namedtuple Point с полями x и y',
        'Функция distance(p1, p2) — евклидово расстояние между точками',
        'Функция midpoint(p1, p2) — середина отрезка',
        'Функция translate(point, dx, dy) — смещение точки',
        'Продемонстрируйте работу с тремя точками'
      ],
      expectedOutput: 'Точка A: Point(x=0, y=0)\nТочка B: Point(x=3, y=4)\nРасстояние AB: 5.00\nСередина AB: Point(x=1.5, y=2.0)\nСмещение A на (1, 1): Point(x=1, y=1)',
      hint: 'Евклидово расстояние: sqrt((x2-x1)^2 + (y2-y1)^2). Используйте math.sqrt() или ** 0.5. Середина: ((x1+x2)/2, (y1+y2)/2). translate возвращает новый Point через _replace или Point(x+dx, y+dy).',
      solution: 'from collections import namedtuple\nimport math\n\nPoint = namedtuple("Point", ["x", "y"])\n\ndef distance(p1, p2):\n    return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)\n\ndef midpoint(p1, p2):\n    return Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)\n\ndef translate(point, dx, dy):\n    return Point(point.x + dx, point.y + dy)\n\nA = Point(0, 0)\nB = Point(3, 4)\nprint(f"Точка A: {A}")\nprint(f"Точка B: {B}")\nprint(f"Расстояние AB: {distance(A, B):.2f}")\nprint(f"Середина AB: {midpoint(A, B)}")\nprint(f"Смещение A на (1, 1): {translate(A, 1, 1)}")',
      explanation: 'namedtuple создаёт лёгкий класс с доступом к полям по имени. Функции работают с Point как с объектом (p.x, p.y), что делает код читаемым. Неизменяемость гарантирует, что translate() не изменяет переданную точку, а возвращает новую.'
    }
  ]
}
