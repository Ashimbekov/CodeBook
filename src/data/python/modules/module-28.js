export default {
  id: 28,
  title: 'Dataclasses',
  description: 'Изучим декоратор @dataclass для автоматической генерации __init__, __repr__, __eq__ и других методов, а также field() и frozen dataclasses',
  lessons: [
    {
      id: 1, title: 'Декоратор @dataclass — основы', type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор @dataclass автоматически генерирует стандартные методы класса: __init__, __repr__ и __eq__ на основе аннотированных полей. Это значительно сокращает шаблонный код.' },
        { type: 'heading', value: 'Без dataclass vs с dataclass' },
        { type: 'code', language: 'python', value: '# Обычный класс — много шаблонного кода\nclass PointOld:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f"Point(x={self.x}, y={self.y})"\n\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n\n# Dataclass — всё то же самое, 2 строки!\nfrom dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\np1 = Point(1.0, 2.0)\np2 = Point(1.0, 2.0)\nprint(p1)           # Point(x=1.0, y=2.0)\nprint(p1 == p2)     # True' },
        { type: 'heading', value: 'Значения по умолчанию' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass\n\n@dataclass\nclass User:\n    name: str\n    age: int\n    active: bool = True   # значение по умолчанию\n    role: str = "user"\n\nu1 = User("Аня", 25)\nu2 = User("Боря", 30, role="admin")\nprint(u1)  # User(name="Аня", age=25, active=True, role="user")\nprint(u2)  # User(name="Боря", age=30, active=True, role="admin")' },
        { type: 'tip', value: 'Поля без значений по умолчанию должны стоять перед полями со значениями — иначе Python выбросит TypeError.' }
      ]
    },
    {
      id: 2, title: 'field() — расширенные настройки полей', type: 'theory',
      content: [
        { type: 'text', value: 'Функция field() из dataclasses позволяет тонко настраивать каждое поле: изменяемые значения по умолчанию, поля для сравнения, repr и многое другое.' },
        { type: 'heading', value: 'field() для изменяемых значений по умолчанию' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, field\nfrom typing import List\n\n# ОШИБКА: нельзя [] как default, он изменяемый!\n# @dataclass\n# class Bag:\n#     items: List[str] = []  # ValueError!\n\n# ПРАВИЛЬНО: используем field(default_factory=list)\n@dataclass\nclass Bag:\n    name: str\n    items: List[str] = field(default_factory=list)\n    tags: dict = field(default_factory=dict)\n\nb1 = Bag("рюкзак")\nb2 = Bag("сумка")\nb1.items.append("книга")  # только у b1!\nprint(b1.items)  # ["книга"]\nprint(b2.items)  # []  — у b2 свой пустой список' },
        { type: 'heading', value: 'Настройки field()' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    _id: int = field(repr=False)         # не показывать в repr\n    discount: float = field(default=0.0, compare=False)  # не участвует в ==\n    tags: list = field(default_factory=list, hash=False)\n\np = Product("Ноутбук", 50000, _id=42)\nprint(p)  # Product(name="Ноутбук", price=50000.0)' },
        { type: 'note', value: 'compare=False исключает поле из __eq__ и __lt__. repr=False убирает из строкового представления. hash=False нужно для изменяемых полей.' }
      ]
    },
    {
      id: 3, title: 'frozen=True — неизменяемые датаклассы', type: 'theory',
      content: [
        { type: 'text', value: 'frozen=True делает датакласс неизменяемым: попытка изменить поле вызовет FrozenInstanceError. Frozen датаклассы можно использовать как ключи словаря и хешировать.' },
        { type: 'heading', value: 'Frozen dataclass' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\np = Point(1.0, 2.0)\nprint(p.x)  # 1.0\n\n# Попытка изменить — ошибка\ntry:\n    p.x = 10.0\nexcept Exception as e:\n    print(e)  # cannot assign to field "x"\n\n# Можно использовать как ключ словаря!\npositions = {}\npositions[p] = "старт"\nprint(positions[Point(1.0, 2.0)])  # "старт"' },
        { type: 'heading', value: 'order=True — сравнение датаклассов' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass\n\n@dataclass(order=True)\nclass Version:\n    major: int\n    minor: int\n    patch: int\n\nv1 = Version(1, 0, 0)\nv2 = Version(1, 2, 0)\nv3 = Version(2, 0, 0)\n\nversions = [v3, v1, v2]\nversions.sort()\nprint(versions)\n# [Version(1,0,0), Version(1,2,0), Version(2,0,0)]' },
        { type: 'tip', value: 'Замена namedtuple — frozen dataclass. Он удобнее: поддерживает методы, наследование, значения по умолчанию.' }
      ]
    },
    {
      id: 4, title: 'Методы и наследование', type: 'theory',
      content: [
        { type: 'text', value: 'Датаклассы — это обычные классы. К ним можно добавлять методы, использовать __post_init__ для дополнительной логики после инициализации и создавать иерархии наследования.' },
        { type: 'heading', value: '__post_init__ — инициализация после автосгенерированного __init__' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Rectangle:\n    width: float\n    height: float\n    area: float = field(init=False)  # не в __init__\n\n    def __post_init__(self):\n        if self.width <= 0 or self.height <= 0:\n            raise ValueError("Размеры должны быть положительными")\n        self.area = self.width * self.height\n\n    def perimeter(self) -> float:\n        return 2 * (self.width + self.height)\n\nr = Rectangle(5.0, 3.0)\nprint(r)         # Rectangle(width=5.0, height=3.0, area=15.0)\nprint(r.perimeter())  # 16.0' },
        { type: 'heading', value: 'Наследование датаклассов' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass\n\n@dataclass\nclass Animal:\n    name: str\n    sound: str\n\n@dataclass\nclass Dog(Animal):\n    breed: str\n    sound: str = "Гав"  # переопределяем с умолчанием\n\n    def speak(self) -> str:\n        return f"{self.name} говорит {self.sound}!"\n\nd = Dog("Шарик", breed="Лабрадор")\nprint(d)         # Dog(name="Шарик", sound="Гав", breed="Лабрадор")\nprint(d.speak()) # Шарик говорит Гав!' }
      ]
    },
    {
      id: 5, title: 'asdict, astuple и replace', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль dataclasses предоставляет утилиты: asdict() конвертирует датакласс в словарь, astuple() — в кортеж, replace() создаёт копию с изменёнными полями.' },
        { type: 'heading', value: 'Утилиты dataclasses' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, asdict, astuple, replace\n\n@dataclass\nclass Config:\n    host: str\n    port: int\n    debug: bool = False\n\ncfg = Config("localhost", 8080)\n\n# Конвертация в словарь (полезно для JSON)\nd = asdict(cfg)\nprint(d)  # {"host": "localhost", "port": 8080, "debug": False}\n\n# Конвертация в кортеж\nt = astuple(cfg)\nprint(t)  # ("localhost", 8080, False)\n\n# Создать копию с изменениями (frozen-совместимо!)\nprod_cfg = replace(cfg, host="production", debug=False)\nprint(prod_cfg)  # Config(host="production", port=8080, debug=False)\nprint(cfg)       # оригинал не изменился!' },
        { type: 'tip', value: 'replace() — это функциональный способ "изменить" frozen датакласс: создаётся новый объект. Это безопасно и привычно для функционального стиля.' }
      ]
    },
    {
      id: 6, title: 'Практика: Система управления задачами', type: 'practice', difficulty: 'medium',
      description: 'Создай систему задач на основе датаклассов. Реализуй Task, TaskList и функции для управления ими.',
      requirements: [
        'Датакласс Task: title(str), priority(int, default=1), done(bool, default=False), tags(List[str], default_factory)',
        '__post_init__: проверка priority от 1 до 5, ValueError иначе',
        'Метод complete() возвращает новый Task с done=True через replace()',
        'Датакласс TaskList: tasks(List[Task], default_factory)',
        'Метод add(task) добавляет задачу',
        'Метод pending() возвращает список незавершённых задач по убыванию приоритета'
      ],
      expectedOutput: 'Задача: Task(title="Написать код", priority=3, done=False, tags=[])\nВыполнена: Task(title="Написать код", priority=3, done=True, tags=[])\nНезавершённых: 2\nПо приоритету: Сделать тесты (5), Написать код (3)',
      hint: 'Для сортировки по убыванию: sorted(tasks, key=lambda t: t.priority, reverse=True). replace() для неизменяемых копий.',
      solution: 'from dataclasses import dataclass, field, replace, asdict\nfrom typing import List\n\n@dataclass\nclass Task:\n    title: str\n    priority: int = 1\n    done: bool = False\n    tags: List[str] = field(default_factory=list)\n\n    def __post_init__(self):\n        if not 1 <= self.priority <= 5:\n            raise ValueError(f"Приоритет должен быть 1-5, получено: {self.priority}")\n\n    def complete(self) -> "Task":\n        return replace(self, done=True)\n\n@dataclass\nclass TaskList:\n    tasks: List[Task] = field(default_factory=list)\n\n    def add(self, task: Task) -> None:\n        self.tasks.append(task)\n\n    def pending(self) -> List[Task]:\n        active = [t for t in self.tasks if not t.done]\n        return sorted(active, key=lambda t: t.priority, reverse=True)\n\nt1 = Task("Написать код", priority=3)\nprint(f"Задача: {t1}")\nt1_done = t1.complete()\nprint(f"Выполнена: {t1_done}")\n\ntl = TaskList()\ntl.add(Task("Написать код", priority=3))\ntl.add(Task("Сделать тесты", priority=5))\ntl.add(t1_done)\n\npending = tl.pending()\nprint(f"Незавершённых: {len(pending)}")\nprint("По приоритету:", ", ".join(f"{t.title} ({t.priority})" for t in pending))',
      explanation: 'field(default_factory=list) создаёт новый список для каждого экземпляра. __post_init__ выполняет валидацию после автосгенерированного __init__. replace() создаёт новый объект — идеальный способ "изменить" данные без мутации.'
    }
  ]
}
