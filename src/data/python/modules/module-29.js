export default {
  id: 29,
  title: 'Enum и ABC',
  description: 'Изучим перечисления Enum для именованных констант и абстрактные базовые классы ABC для определения интерфейсов в Python',
  lessons: [
    {
      id: 1, title: 'Enum — перечисления', type: 'theory',
      content: [
        { type: 'text', value: 'Enum (перечисление) — это набор именованных констант. Вместо магических чисел или строк вы используете выразительные имена. Это делает код самодокументированным и защищённым от опечаток.' },
        { type: 'heading', value: 'Создание и использование Enum' },
        { type: 'code', language: 'python', value: 'from enum import Enum\n\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n    BLUE = 3\n\n# Доступ к членам\nprint(Color.RED)          # Color.RED\nprint(Color.RED.name)     # "RED"\nprint(Color.RED.value)    # 1\n\n# Сравнение\nprint(Color.RED == Color.RED)    # True\nprint(Color.RED == Color.BLUE)   # False\nprint(Color.RED is Color.RED)    # True — синглтоны!\n\n# Итерация\nfor color in Color:\n    print(f"{color.name} = {color.value}")' },
        { type: 'heading', value: 'Получение по значению или имени' },
        { type: 'code', language: 'python', value: '# По значению\nc = Color(2)\nprint(c)  # Color.GREEN\n\n# По имени\nc2 = Color["BLUE"]\nprint(c2)  # Color.BLUE\n\n# Проверка членства\nprint(Color.RED in Color)  # True' },
        { type: 'tip', value: 'Используй Enum вместо строковых или числовых констант. Если у тебя есть STATUS = "active", лучше сделать class Status(Enum): ACTIVE = "active".' }
      ]
    },
    {
      id: 2, title: 'IntEnum, StrEnum, auto() и методы', type: 'theory',
      content: [
        { type: 'text', value: 'Python предоставляет специальные варианты Enum: IntEnum для числовых значений, StrEnum для строковых (Python 3.11+). auto() автоматически генерирует значения. В Enum можно определять методы.' },
        { type: 'heading', value: 'auto() и IntEnum' },
        { type: 'code', language: 'python', value: 'from enum import Enum, IntEnum, auto\n\nclass Direction(Enum):\n    NORTH = auto()  # 1\n    SOUTH = auto()  # 2\n    EAST  = auto()  # 3\n    WEST  = auto()  # 4\n\nprint(Direction.NORTH.value)  # 1\nprint(Direction.WEST.value)   # 4\n\n# IntEnum — значения работают как числа\nclass HttpStatus(IntEnum):\n    OK = 200\n    NOT_FOUND = 404\n    SERVER_ERROR = 500\n\nprint(HttpStatus.OK == 200)      # True — можно сравнивать с int\nprint(HttpStatus.OK > 100)       # True' },
        { type: 'heading', value: 'Методы в Enum' },
        { type: 'code', language: 'python', value: 'from enum import Enum\n\nclass Planet(Enum):\n    MERCURY = (3.303e+23, 2.4397e6)\n    VENUS   = (4.869e+24, 6.0518e6)\n    EARTH   = (5.976e+24, 6.37814e6)\n\n    def __init__(self, mass, radius):\n        self.mass = mass\n        self.radius = radius\n\n    @property\n    def surface_gravity(self):\n        G = 6.67430e-11\n        return G * self.mass / (self.radius ** 2)\n\nprint(f"Земля g = {Planet.EARTH.surface_gravity:.2f}")  # 9.80' }
      ]
    },
    {
      id: 3, title: 'ABC — абстрактные базовые классы', type: 'theory',
      content: [
        { type: 'text', value: 'ABC (Abstract Base Class) — это класс-интерфейс. Он объявляет методы, которые ОБЯЗАНЫ реализовать все подклассы. Нельзя создать экземпляр ABC, если не реализованы все абстрактные методы.' },
        { type: 'heading', value: 'Создание ABC' },
        { type: 'code', language: 'python', value: 'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    """Абстрактный базовый класс для фигур."""\n\n    @abstractmethod\n    def area(self) -> float:\n        """Вычислить площадь."""\n        ...\n\n    @abstractmethod\n    def perimeter(self) -> float:\n        """Вычислить периметр."""\n        ...\n\n    def describe(self) -> str:\n        """Неабстрактный метод — работает у всех наследников."""\n        return f"Площадь: {self.area():.2f}, периметр: {self.perimeter():.2f}"\n\n# Нельзя создать экземпляр ABC\ntry:\n    s = Shape()  # TypeError!\nexcept TypeError as e:\n    print(e)  # Can\'t instantiate abstract class' },
        { type: 'heading', value: 'Реализация абстрактных методов' },
        { type: 'code', language: 'python', value: 'import math\n\nclass Circle(Shape):\n    def __init__(self, radius: float):\n        self.radius = radius\n\n    def area(self) -> float:\n        return math.pi * self.radius ** 2\n\n    def perimeter(self) -> float:\n        return 2 * math.pi * self.radius\n\nclass Square(Shape):\n    def __init__(self, side: float):\n        self.side = side\n\n    def area(self) -> float:\n        return self.side ** 2\n\n    def perimeter(self) -> float:\n        return 4 * self.side\n\nc = Circle(5)\nprint(c.describe())  # Площадь: 78.54, периметр: 31.42\n\ns = Square(4)\nprint(s.describe())  # Площадь: 16.00, периметр: 16.00' },
        { type: 'tip', value: 'ABC — это контракт. Если ты говоришь "это Shape", то гарантируешь, что у объекта есть area() и perimeter(). Это важно для полиморфизма.' }
      ]
    },
    {
      id: 4, title: 'abstractproperty и регистрация виртуальных подклассов', type: 'theory',
      content: [
        { type: 'text', value: 'ABC поддерживает абстрактные свойства через @property + @abstractmethod и позволяет "регистрировать" существующие классы как виртуальные подклассы без наследования.' },
        { type: 'heading', value: 'Абстрактные свойства' },
        { type: 'code', language: 'python', value: 'from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @property\n    @abstractmethod\n    def sound(self) -> str:\n        ...\n\n    @abstractmethod\n    def move(self) -> str:\n        ...\n\n    def describe(self) -> str:\n        return f"Я говорю {self.sound} и {self.move}"\n\nclass Dog(Animal):\n    @property\n    def sound(self) -> str:\n        return "Гав"\n\n    def move(self) -> str:\n        return "бегаю"\n\nd = Dog()\nprint(d.describe())  # Я говорю Гав и бегаю' },
        { type: 'heading', value: 'register() — виртуальные подклассы' },
        { type: 'code', language: 'python', value: 'from abc import ABC\n\nclass Drawable(ABC):\n    pass\n\nclass ExternalCanvas:\n    """Чужой класс — нельзя изменить."""\n    def draw(self): ...\n\n# Регистрируем без наследования\nDrawable.register(ExternalCanvas)\n\ncanvas = ExternalCanvas()\nprint(isinstance(canvas, Drawable))  # True\nprint(issubclass(ExternalCanvas, Drawable))  # True' }
      ]
    },
    {
      id: 5, title: 'ABC из collections.abc', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль collections.abc содержит готовые ABC для стандартных протоколов Python: Iterable, Iterator, Sequence, Mapping и другие. Реализуй нужные методы — и остальные получишь бесплатно.' },
        { type: 'heading', value: 'Пользовательская коллекция' },
        { type: 'code', language: 'python', value: 'from collections.abc import MutableSequence\n\nclass NumberList(MutableSequence):\n    """Список только из чисел."""\n\n    def __init__(self):\n        self._data = []\n\n    # Обязательные абстрактные методы MutableSequence:\n    def __getitem__(self, index):\n        return self._data[index]\n\n    def __setitem__(self, index, value):\n        if not isinstance(value, (int, float)):\n            raise TypeError(f"Ожидается число, получено {type(value)}")\n        self._data[index] = value\n\n    def __delitem__(self, index):\n        del self._data[index]\n\n    def __len__(self):\n        return len(self._data)\n\n    def insert(self, index, value):\n        if not isinstance(value, (int, float)):\n            raise TypeError("Ожидается число")\n        self._data.insert(index, value)\n\n# Бесплатно получаем: append, extend, remove, pop, index, count, reverse...\nnl = NumberList()\nnl.append(1)\nnl.append(2.5)\nnl.extend([3, 4])\nprint(list(nl))  # [1, 2.5, 3, 4]\nprint(len(nl))   # 4' },
        { type: 'note', value: 'MutableSequence реализует append, extend, remove, pop, index, count и другие методы на основе 5 обязательных. Это мощный паттерн!' }
      ]
    },
    {
      id: 6, title: 'Практика: Система транспорта', type: 'practice', difficulty: 'medium',
      description: 'Создай иерархию классов транспортных средств с использованием ABC и Enum для статусов.',
      requirements: [
        'Enum VehicleStatus: PARKED, MOVING, MAINTENANCE',
        'ABC Vehicle: абстрактные методы start() -> str, stop() -> str, свойство max_speed -> float',
        'Неабстрактный метод status_report() выводит статус и скорость',
        'Класс Car(Vehicle): марка, год, max_speed=180',
        'Класс Bicycle(Vehicle): тип (горный/шоссейный), max_speed=30',
        'Продемонстрируй полиморфизм: список Vehicle, вызов start() для каждого'
      ],
      expectedOutput: 'Автомобиль Toyota запущен\nВелосипед (горный) тронулся\n--- Отчёт ---\nToyota: MOVING, макс. 180 км/ч\nгорный: MOVING, макс. 30 км/ч',
      hint: 'В abstractmethod можно оставить тело с pass или "...". Для status_report используй self.start() чтобы изменить статус.',
      solution: 'from abc import ABC, abstractmethod\nfrom enum import Enum\n\nclass VehicleStatus(Enum):\n    PARKED = "припаркован"\n    MOVING = "едет"\n    MAINTENANCE = "на ТО"\n\nclass Vehicle(ABC):\n    def __init__(self):\n        self.status = VehicleStatus.PARKED\n\n    @abstractmethod\n    def start(self) -> str:\n        ...\n\n    @abstractmethod\n    def stop(self) -> str:\n        ...\n\n    @property\n    @abstractmethod\n    def max_speed(self) -> float:\n        ...\n\n    def status_report(self) -> str:\n        return f"{self}: {self.status.value}, макс. {self.max_speed} км/ч"\n\nclass Car(Vehicle):\n    def __init__(self, brand: str, year: int):\n        super().__init__()\n        self.brand = brand\n        self.year = year\n\n    @property\n    def max_speed(self) -> float:\n        return 180.0\n\n    def start(self) -> str:\n        self.status = VehicleStatus.MOVING\n        return f"Автомобиль {self.brand} запущен"\n\n    def stop(self) -> str:\n        self.status = VehicleStatus.PARKED\n        return f"{self.brand} остановлен"\n\n    def __str__(self): return self.brand\n\nclass Bicycle(Vehicle):\n    def __init__(self, bike_type: str):\n        super().__init__()\n        self.bike_type = bike_type\n\n    @property\n    def max_speed(self) -> float:\n        return 30.0\n\n    def start(self) -> str:\n        self.status = VehicleStatus.MOVING\n        return f"Велосипед ({self.bike_type}) тронулся"\n\n    def stop(self) -> str:\n        self.status = VehicleStatus.PARKED\n        return f"Велосипед остановлен"\n\n    def __str__(self): return self.bike_type\n\nvehicles = [Car("Toyota", 2020), Bicycle("горный")]\nfor v in vehicles:\n    print(v.start())\n\nprint("--- Отчёт ---")\nfor v in vehicles:\n    print(v.status_report())',
      explanation: 'ABC обеспечивает контракт: любой Vehicle гарантированно имеет start(), stop() и max_speed. Enum VehicleStatus делает состояния явными. Полиморфизм позволяет обработать разные транспортные средства единообразно.'
    }
  ]
}
