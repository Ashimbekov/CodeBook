export default {
  id: 17,
  title: 'Наследование',
  description: 'Наследование классов в Python: super(), переопределение методов, MRO, множественное наследование и миксины.',
  lessons: [
    {
      id: 1,
      title: 'Базовое наследование',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Расширение существующих классов'
        },
        {
          type: 'text',
          value: 'Наследование позволяет создавать новый класс (дочерний) на основе существующего (родительского). Дочерний класс наследует все методы и атрибуты родителя, но может их переопределить или добавить новые. Синтаксис: class Child(Parent).'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Родительский класс\nclass Animal:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def speak(self):\n        return f"{self.name} издаёт звук"\n    \n    def info(self):\n        return f"{self.name}, {self.age} лет"\n    \n    def __str__(self):\n        return self.info()\n\n# Дочерний класс\nclass Dog(Animal):\n    def speak(self):  # переопределение метода\n        return f"{self.name} говорит: Гав!"\n    \n    def fetch(self):  # новый метод\n        return f"{self.name} принёс палку!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} говорит: Мяу!"\n    \n    def purr(self):\n        return f"{self.name}: Urrr..."\n\ndog = Dog("Рекс", 3)\ncat = Cat("Мурка", 2)\n\nprint(dog.speak())   # Рекс говорит: Гав!\nprint(cat.speak())   # Мурка говорит: Мяу!\nprint(dog.info())    # Рекс, 3 лет (унаследован)\nprint(dog.fetch())   # Рекс принёс палку!\nprint(isinstance(dog, Dog))     # True\nprint(isinstance(dog, Animal))  # True — собака это животное!'
        }
      ]
    },
    {
      id: 2,
      title: 'Функция super()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Вызов методов родительского класса'
        },
        {
          type: 'text',
          value: 'super() возвращает прокси-объект, который делегирует вызовы методов к родительскому классу. Используется в __init__ для инициализации родительской части, и при переопределении методов для расширения функциональности.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Vehicle:\n    def __init__(self, make, model, year):\n        self.make = make\n        self.model = model\n        self.year = year\n        self.speed = 0\n    \n    def accelerate(self, amount):\n        self.speed += amount\n    \n    def brake(self, amount):\n        self.speed = max(0, self.speed - amount)\n    \n    def __str__(self):\n        return f"{self.year} {self.make} {self.model}"\n\nclass Car(Vehicle):\n    def __init__(self, make, model, year, num_doors=4):\n        super().__init__(make, model, year)  # вызов родительского __init__\n        self.num_doors = num_doors  # добавляем новый атрибут\n    \n    def __str__(self):\n        base = super().__str__()  # расширяем родительский метод\n        return f"{base} ({self.num_doors} двери)"\n\nclass ElectricCar(Car):\n    def __init__(self, make, model, year, battery_capacity):\n        super().__init__(make, model, year)\n        self.battery_capacity = battery_capacity\n        self.charge_level = 100\n    \n    def charge(self):\n        self.charge_level = 100\n        return "Заряжен!"\n    \n    def __str__(self):\n        base = super().__str__()\n        return f"{base}, батарея {self.battery_capacity} кВтч"\n\ntesla = ElectricCar("Tesla", "Model 3", 2023, 75)\nprint(tesla)  # 2023 Tesla Model 3 (4 двери), батарея 75 кВтч'
        }
      ]
    },
    {
      id: 3,
      title: 'issubclass() и isinstance()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Проверка иерархии наследования'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class A:\n    pass\n\nclass B(A):\n    pass\n\nclass C(B):\n    pass\n\n# isinstance — проверяет тип объекта\nc = C()\nprint(isinstance(c, C))  # True\nprint(isinstance(c, B))  # True  — C наследует B\nprint(isinstance(c, A))  # True  — C наследует через B\n\n# issubclass — проверяет иерархию классов\nprint(issubclass(C, B))  # True\nprint(issubclass(C, A))  # True\nprint(issubclass(B, C))  # False — B не подкласс C\nprint(issubclass(C, C))  # True  — класс подкласс самого себя\n\n# Практическое применение\ndef process(obj):\n    if isinstance(obj, str):\n        return obj.upper()\n    elif isinstance(obj, (int, float)):\n        return obj * 2\n    elif isinstance(obj, list):\n        return [process(item) for item in obj]\n    else:\n        return obj\n\nprint(process("hello"))  # HELLO\nprint(process(5))        # 10\nprint(process([1, "a", 2.5]))  # [2, "A", 5.0]\n\n# __class__ и __bases__\nprint(C.__bases__)     # (<class "__main__.B">,)\nprint(C.__mro__)       # кортеж иерархии MRO'
        }
      ]
    },
    {
      id: 4,
      title: 'MRO — Method Resolution Order',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Порядок разрешения методов'
        },
        {
          type: 'text',
          value: 'MRO (Порядок разрешения методов) определяет, в каком порядке Python ищет методы при наследовании. Python использует алгоритм C3 (линеаризация). Метод .__mro__ или mro() показывает порядок поиска.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class A:\n    def hello(self):\n        return "A.hello"\n\nclass B(A):\n    def hello(self):\n        return "B.hello"\n\nclass C(A):\n    def hello(self):\n        return "C.hello"\n\nclass D(B, C):\n    pass\n\nd = D()\nprint(d.hello())  # B.hello — ищем слева направо\n\n# MRO для D:\nprint(D.__mro__)\n# (<class "D">, <class "B">, <class "C">, <class "A">, <class "object">)\n\n# Порядок поиска: D → B → C → A → object\n# "Бриллиантовое" наследование решается через MRO\n\nclass Base:\n    def method(self):\n        print("Base.method")\n\nclass Left(Base):\n    def method(self):\n        print("Left.method")\n        super().method()  # super() идёт по MRO!\n\nclass Right(Base):\n    def method(self):\n        print("Right.method")\n        super().method()\n\nclass Combined(Left, Right):\n    def method(self):\n        print("Combined.method")\n        super().method()\n\nc = Combined()\nc.method()\n# Combined.method\n# Left.method\n# Right.method\n# Base.method'
        }
      ]
    },
    {
      id: 5,
      title: 'Множественное наследование и миксины',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Миксины — переиспользуемые части классов'
        },
        {
          type: 'text',
          value: 'Миксин (Mixin) — это класс с небольшим набором связанных методов, предназначенный для подмешивания к другим классам. Миксины не используются самостоятельно. Это мощный паттерн для добавления функциональности без глубокого наследования.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Миксин для сериализации\nclass SerializeMixin:\n    def to_dict(self):\n        return {k: v for k, v in self.__dict__.items()}\n    \n    def to_json(self):\n        import json\n        return json.dumps(self.to_dict())\n\n# Миксин для логирования\nclass LogMixin:\n    def log(self, message):\n        print(f"[{self.__class__.__name__}] {message}")\n\n# Основной класс\nclass User(SerializeMixin, LogMixin):\n    def __init__(self, name, email):\n        self.name = name\n        self.email = email\n    \n    def activate(self):\n        self.log(f"Активация пользователя {self.name}")\n        self.active = True\n\nuser = User("Иван", "ivan@example.com")\nuser.activate()          # [User] Активация пользователя Иван\nprint(user.to_dict())   # {"name": "Иван", "email": "...", "active": True}\nprint(user.to_json())'
        }
      ]
    },
    {
      id: 6,
      title: 'Переопределение операторов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Дочерний класс изменяет родительский оператор'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Shape:\n    def area(self):\n        return 0\n    \n    def perimeter(self):\n        return 0\n    \n    def describe(self):\n        return f"{self.__class__.__name__}: площадь={self.area():.2f}, периметр={self.perimeter():.2f}"\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    \n    def area(self):\n        import math\n        return math.pi * self.radius ** 2\n    \n    def perimeter(self):\n        import math\n        return 2 * math.pi * self.radius\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    \n    def area(self):\n        return self.width * self.height\n    \n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\nshapes = [Circle(5), Rectangle(4, 6), Circle(3)]\nfor shape in shapes:\n    print(shape.describe())\n\ntotal_area = sum(s.area() for s in shapes)\nprint(f"\\nОбщая площадь: {total_area:.2f}")\nlargest = max(shapes, key=lambda s: s.area())\nprint(f"Наибольшая фигура: {largest.describe()}")'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Иерархия сотрудников',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте иерархию классов для системы сотрудников компании.',
      requirements: [
        'Базовый класс Employee: name, salary, department',
        'Метод get_info() и calculate_bonus()',
        'Класс Manager(Employee): team (список сотрудников), метод add_employee()',
        'Manager.calculate_bonus() — 20% от зарплаты + 5% от зарплаты каждого в команде',
        'Класс Developer(Employee): skills (список), метод add_skill()',
        'Developer.calculate_bonus() — 15% от зарплаты + 1000 за каждые 5 навыков'
      ],
      expectedOutput: 'Иван Петров (Manager, Разработка): 120000\nБонус менеджера: 30500.0\n\nАлиса Смит (Developer, Разработка): 90000\nБонус разработчика: 15500.0',
      hint: 'В Manager.calculate_bonus() используйте super() для получения базового бонуса, затем добавьте бонус за команду. В add_employee() просто append в self.team.',
      solution: 'class Employee:\n    def __init__(self, name, salary, department):\n        self.name = name\n        self.salary = salary\n        self.department = department\n    \n    def calculate_bonus(self):\n        return self.salary * 0.1  # базовый бонус 10%\n    \n    def get_info(self):\n        return f"{self.name} ({self.__class__.__name__}, {self.department}): {self.salary}"\n\nclass Manager(Employee):\n    def __init__(self, name, salary, department):\n        super().__init__(name, salary, department)\n        self.team = []\n    \n    def add_employee(self, employee):\n        self.team.append(employee)\n    \n    def calculate_bonus(self):\n        base = self.salary * 0.20\n        team_bonus = sum(e.salary * 0.05 for e in self.team)\n        return base + team_bonus\n\nclass Developer(Employee):\n    def __init__(self, name, salary, department):\n        super().__init__(name, salary, department)\n        self.skills = []\n    \n    def add_skill(self, skill):\n        self.skills.append(skill)\n    \n    def calculate_bonus(self):\n        base = self.salary * 0.15\n        skill_bonus = (len(self.skills) // 5) * 1000\n        return base + skill_bonus\n\ndev = Developer("Алиса Смит", 90000, "Разработка")\nfor skill in ["Python", "Django", "PostgreSQL", "Git", "Docker"]:\n    dev.add_skill(skill)\n\nmanager = Manager("Иван Петров", 120000, "Разработка")\nmanager.add_employee(dev)\nmanager.add_employee(Employee("Боб", 70000, "Разработка"))\n\nprint(manager.get_info())\nprint(f"Бонус менеджера: {manager.calculate_bonus()}")\nprint()\nprint(dev.get_info())\nprint(f"Бонус разработчика: {dev.calculate_bonus()}")',
      explanation: 'super().__init__() гарантирует правильную инициализацию родительского класса. Переопределение calculate_bonus() в каждом подклассе — пример полиморфизма: один метод, разное поведение. Manager не переопределяет get_info() — он наследует его от Employee. self.__class__.__name__ динамически возвращает имя реального класса.'
    }
  ]
}
