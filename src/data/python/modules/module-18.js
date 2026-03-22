export default {
  id: 18,
  title: 'Полиморфизм и абстракция',
  description: 'Полиморфизм, duck typing, абстрактные классы (ABC), интерфейсы через ABC и принцип подстановки Лисков.',
  lessons: [
    {
      id: 1,
      title: 'Полиморфизм',
      content: [
        {
          type: 'heading',
          value: 'Один интерфейс — разные реализации'
        },
        {
          type: 'text',
          value: 'Полиморфизм — это способность объектов разных классов реагировать на одно и то же сообщение (вызов метода) по-своему. В Python полиморфизм реализуется через переопределение методов и duck typing. Код становится гибким и расширяемым.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Shape:\n    def area(self): return 0\n    def perimeter(self): return 0\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self):\n        import math\n        return math.pi * self.r ** 2\n    def perimeter(self):\n        import math\n        return 2 * math.pi * self.r\n\nclass Square(Shape):\n    def __init__(self, s): self.s = s\n    def area(self): return self.s ** 2\n    def perimeter(self): return 4 * self.s\n\nclass Triangle(Shape):\n    def __init__(self, a, b, c):\n        self.a, self.b, self.c = a, b, c\n    def area(self):\n        s = self.perimeter() / 2\n        return (s * (s-self.a) * (s-self.b) * (s-self.c)) ** 0.5\n    def perimeter(self): return self.a + self.b + self.c\n\n# Полиморфизм: один и тот же код работает с разными классами\nshapes = [Circle(5), Square(4), Triangle(3, 4, 5)]\nfor shape in shapes:\n    print(f"{shape.__class__.__name__}: площадь={shape.area():.2f}")\n\n# Функция работает с любым объектом, у которого есть area()\ndef total_area(shapes):\n    return sum(s.area() for s in shapes)\n\nprint(f"Общая площадь: {total_area(shapes):.2f}")'
        }
      ]
    },
    {
      id: 2,
      title: 'Duck Typing',
      content: [
        {
          type: 'heading',
          value: '"Если оно крякает как утка — это утка"'
        },
        {
          type: 'text',
          value: 'Duck typing — концепция Python: важен не тип объекта, а наличие нужных методов и атрибутов. Если объект "ведёт себя" как нужно — его можно использовать. Это делает код гибким без явного наследования.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Duck typing — не нужно явное наследование\nclass Duck:\n    def quack(self): return "Кря!"\n    def walk(self): return "Топ-топ"\n\nclass Person:\n    def quack(self): return "Я притворяюсь уткой!"\n    def walk(self): return "Шаг-шаг"\n\nclass RubberDuck:\n    def quack(self): return "Скрип!"\n    def walk(self): return "Не умею ходить"\n\n# Функция не проверяет тип — только вызывает методы\ndef make_it_quack(duck_like):\n    print(duck_like.quack())\n    print(duck_like.walk())\n\n# Все три работают!\nfor obj in [Duck(), Person(), RubberDuck()]:\n    make_it_quack(obj)\n\n# Практический пример: файлоподобные объекты\nimport io\n\ndef read_data(stream):  # работает с любым объектом у которого есть read()\n    return stream.read()\n\n# Работает и с файлом, и со StringIO\nwith open("file.txt", "w") as f: f.write("Из файла")\nwith open("file.txt") as f:\n    print(read_data(f))        # Из файла\n\nbuffer = io.StringIO("Из памяти")\nprint(read_data(buffer))       # Из памяти'
        }
      ]
    },
    {
      id: 3,
      title: 'Абстрактные классы (ABC)',
      content: [
        {
          type: 'heading',
          value: 'Интерфейсы через абстрактные классы'
        },
        {
          type: 'text',
          value: 'Абстрактный класс (ABC) — класс, который нельзя создать напрямую. Он определяет интерфейс (набор методов), которые должны реализовать подклассы. @abstractmethod помечает метод как обязательный для реализации.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from abc import ABC, abstractmethod\n\n# Абстрактный класс — нельзя создать экземпляр\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> float:\n        """Вычислить площадь."""\n        pass\n    \n    @abstractmethod\n    def perimeter(self) -> float:\n        """Вычислить периметр."""\n        pass\n    \n    # Неабстрактный метод — уже реализован\n    def describe(self):\n        return f"{type(self).__name__}: S={self.area():.2f}, P={self.perimeter():.2f}"\n\n# Нельзя создать Shape напрямую\ntry:\n    s = Shape()  # TypeError!\nexcept TypeError as e:\n    print(e)\n\n# Подкласс ДОЛЖЕН реализовать все абстрактные методы\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    \n    def area(self):\n        import math\n        return math.pi * self.radius ** 2\n    \n    def perimeter(self):\n        import math\n        return 2 * math.pi * self.radius\n\n# Неполная реализация\nclass BadShape(Shape):\n    def area(self): return 0\n    # perimeter() не реализован!\n\ntry:\n    b = BadShape()  # TypeError!\nexcept TypeError as e:\n    print(e)'
        }
      ]
    },
    {
      id: 4,
      title: 'Абстрактные свойства',
      content: [
        {
          type: 'heading',
          value: '@abstractmethod + @property'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    def __init__(self, name):\n        self.name = name\n    \n    @property\n    @abstractmethod\n    def sound(self) -> str:\n        """Звук животного — должен быть определён."""\n        pass\n    \n    @abstractmethod\n    def move(self) -> str:\n        pass\n    \n    def describe(self):\n        return f"{self.name}: {self.sound}, {self.move()}"\n\nclass Dog(Animal):\n    @property\n    def sound(self):\n        return "Гав!"\n    \n    def move(self):\n        return "бежит"\n\nclass Fish(Animal):\n    @property\n    def sound(self):\n        return "..."\n    \n    def move(self):\n        return "плывёт"\n\nanimals = [Dog("Рекс"), Fish("Немо")]\nfor a in animals:\n    print(a.describe())\n\n# ABC с classmethod\nclass Serializable(ABC):\n    @abstractmethod\n    def to_dict(self):\n        pass\n    \n    @classmethod\n    @abstractmethod\n    def from_dict(cls, data):\n        pass'
        }
      ]
    },
    {
      id: 5,
      title: 'Принцип подстановки Лисков',
      content: [
        {
          type: 'heading',
          value: 'LSP — объекты подклассов заменяемы родителями'
        },
        {
          type: 'text',
          value: 'Принцип Лисков (LSP): если S — подкласс T, то объекты T могут быть заменены объектами S без нарушения корректности программы. Нарушение LSP — признак плохой архитектуры.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# НАРУШЕНИЕ LSP\nclass Bird:\n    def fly(self):\n        return "Лечу!"\n\nclass Penguin(Bird):  # Пингвин — птица, но не летает!\n    def fly(self):\n        raise NotImplementedError("Пингвины не летают!")\n\n# Код, написанный для Bird, сломается с Penguin\ndef make_fly(bird: Bird):\n    print(bird.fly())  # упадёт для Penguin!\n\n# ПРАВИЛЬНЫЙ дизайн\nclass Bird:\n    def eat(self): return "Ем"\n    def breathe(self): return "Дышу"\n\nclass FlyingBird(Bird):\n    def fly(self): return "Лечу!"\n\nclass SwimmingBird(Bird):\n    def swim(self): return "Плыву!"\n\nclass Eagle(FlyingBird):\n    pass\n\nclass Penguin(SwimmingBird):\n    pass\n\n# Функция работает только с летающими птицами\ndef make_fly(bird: FlyingBird):\n    print(bird.fly())\n\nmake_fly(Eagle())    # OK\n# make_fly(Penguin()) # Ошибка типа — пингвин не FlyingBird (правильно!)'
        }
      ]
    },
    {
      id: 6,
      title: 'Протоколы (Structural Subtyping)',
      content: [
        {
          type: 'heading',
          value: 'typing.Protocol — статическая duck typing'
        },
        {
          type: 'text',
          value: 'Protocol (Python 3.8+) из модуля typing — это способ описать "структурный подтип". Если класс имеет нужные методы/атрибуты, он считается совместимым с протоколом — без явного наследования. Это статически проверяемый duck typing.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Drawable(Protocol):\n    def draw(self) -> None: ...\n    def get_bounds(self) -> tuple: ...\n\n# Классы не наследуют Drawable явно!\nclass Circle:\n    def __init__(self, x, y, r):\n        self.x, self.y, self.r = x, y, r\n    def draw(self): print(f"Рисую круг в ({self.x}, {self.y})")\n    def get_bounds(self): return (self.x-self.r, self.y-self.r, self.x+self.r, self.y+self.r)\n\nclass TextLabel:\n    def __init__(self, text): self.text = text\n    def draw(self): print(f"Вывожу текст: {self.text}")\n    def get_bounds(self): return (0, 0, 100, 20)\n\ndef render(item: Drawable):\n    item.draw()\n    print(f"Границы: {item.get_bounds()}")\n\nrender(Circle(10, 10, 5))\nrender(TextLabel("Hello"))\n\n# runtime_checkable позволяет isinstance\nprint(isinstance(Circle(0,0,1), Drawable))  # True\nprint(isinstance("string", Drawable))       # False'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система оплаты',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте абстрактную систему обработки платежей с различными методами оплаты.',
      requirements: [
        'Абстрактный класс PaymentProcessor с методами: process(amount), refund(amount), get_fee(amount)',
        'Класс CreditCard(PaymentProcessor): комиссия 2.5%, минимум 1.50',
        'Класс PayPal(PaymentProcessor): комиссия 3.5% + фиксированные 0.30',
        'Класс CryptoWallet(PaymentProcessor): комиссия 0.5%, минимум 0.10',
        'Функция checkout(processor, amount) вычисляет итог с комиссией'
      ],
      expectedOutput: 'CreditCard: платёж 100.00, комиссия 2.50, итого 102.50\nPayPal: платёж 100.00, комиссия 3.80, итого 103.80\nCrypto: платёж 100.00, комиссия 0.50, итого 100.50\nВыбираем минимальную комиссию: CryptoWallet',
      hint: 'Используйте from abc import ABC, abstractmethod. get_fee(amount) возвращает размер комиссии. В checkout вызывайте process() и get_fee(). Используйте min() с key= для поиска минимальной комиссии.',
      solution: 'from abc import ABC, abstractmethod\n\nclass PaymentProcessor(ABC):\n    @abstractmethod\n    def process(self, amount: float) -> bool:\n        pass\n    \n    @abstractmethod\n    def refund(self, amount: float) -> bool:\n        pass\n    \n    @abstractmethod\n    def get_fee(self, amount: float) -> float:\n        pass\n    \n    def checkout(self, amount: float):\n        fee = self.get_fee(amount)\n        total = amount + fee\n        self.process(amount)\n        name = self.__class__.__name__\n        return total, fee, name\n\nclass CreditCard(PaymentProcessor):\n    def process(self, amount):\n        print(f"Оплата картой: {amount:.2f}")\n        return True\n    def refund(self, amount):\n        print(f"Возврат на карту: {amount:.2f}")\n        return True\n    def get_fee(self, amount):\n        return max(1.50, amount * 0.025)\n\nclass PayPal(PaymentProcessor):\n    def process(self, amount):\n        print(f"PayPal платёж: {amount:.2f}")\n        return True\n    def refund(self, amount):\n        print(f"PayPal возврат: {amount:.2f}")\n        return True\n    def get_fee(self, amount):\n        return amount * 0.035 + 0.30\n\nclass CryptoWallet(PaymentProcessor):\n    def process(self, amount):\n        print(f"Крипто платёж: {amount:.2f}")\n        return True\n    def refund(self, amount):\n        print(f"Крипто возврат: {amount:.2f}")\n        return True\n    def get_fee(self, amount):\n        return max(0.10, amount * 0.005)\n\nprocessors = [CreditCard(), PayPal(), CryptoWallet()]\namount = 100.0\nresults = []\nfor proc in processors:\n    total, fee, name = proc.checkout(amount)\n    print(f"{name}: платёж {amount:.2f}, комиссия {fee:.2f}, итого {total:.2f}")\n    results.append((fee, name))\n\nbest = min(results)\nprint(f"Выбираем минимальную комиссию: {best[1]}")',
      explanation: 'ABC гарантирует, что любой подкласс PaymentProcessor реализует все три абстрактных метода — иначе TypeError при создании экземпляра. checkout() определён в базовом классе и использует get_fee() и process() — шаблонный метод (Template Method pattern). Полиморфизм: один и тот же цикл обрабатывает все три типа процессоров.'
    }
  ]
}
