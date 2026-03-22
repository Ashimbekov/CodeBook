export default {
  id: 20,
  title: 'Свойства (property)',
  description: 'Декоратор @property для геттеров, сеттеров и делетеров. Контролируемый доступ к атрибутам объекта.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен property?',
      content: [
        {
          type: 'heading',
          value: 'Проблема прямого доступа к атрибутам'
        },
        {
          type: 'text',
          value: 'В Python атрибуты объектов публичны по умолчанию. property позволяет добавить логику при чтении/записи атрибута, сохраняя простой синтаксис доступа (obj.attr). Это основа инкапсуляции в Python.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Проблема: нет контроля при прямом доступе\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius  # можно установить отрицательный!\n\nc = Circle(5)\nc.radius = -1  # это работает, но не имеет смысла!\nprint(c.radius)  # -1\n\n# Решение через методы (некрасиво)\nclass BetterCircle:\n    def __init__(self, radius):\n        self._radius = 0\n        self.set_radius(radius)\n    \n    def get_radius(self):\n        return self._radius\n    \n    def set_radius(self, value):\n        if value < 0:\n            raise ValueError("Радиус не может быть отрицательным")\n        self._radius = value\n\n# Нужно писать circle.get_radius() — неудобно\n# Python-way: @property позволяет писать circle.radius\n# но с проверками!'
        }
      ]
    },
    {
      id: 2,
      title: 'Декоратор @property (геттер)',
      content: [
        {
          type: 'heading',
          value: 'Создание свойства только для чтения'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import math\n\nclass Circle:\n    def __init__(self, radius):\n        self._radius = radius\n    \n    @property\n    def radius(self):\n        """Радиус круга."""\n        return self._radius\n    \n    @property\n    def diameter(self):\n        """Диаметр — вычисляемый атрибут."""\n        return self._radius * 2\n    \n    @property\n    def area(self):\n        """Площадь — вычисляется при каждом обращении."""\n        return math.pi * self._radius ** 2\n    \n    @property\n    def circumference(self):\n        return 2 * math.pi * self._radius\n\nc = Circle(5)\nprint(c.radius)        # 5 — читаем как атрибут\nprint(c.diameter)      # 10\nprint(f"{c.area:.2f}") # 78.54\n\n# Попытка записать — AttributeError\ntry:\n    c.area = 100  # AttributeError: нет сеттера!\nexcept AttributeError as e:\n    print(e)'
        }
      ]
    },
    {
      id: 3,
      title: 'Сеттер @property.setter',
      content: [
        {
          type: 'heading',
          value: 'Добавление валидации при записи'
        },
        {
          type: 'text',
          value: 'Метод сеттера добавляется через декоратор @property_name.setter. Он вызывается при присваивании значения. Здесь можно добавить валидацию, преобразование или логирование.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Circle:\n    def __init__(self, radius):\n        self.radius = radius  # вызывает сеттер!\n    \n    @property\n    def radius(self):\n        return self._radius\n    \n    @radius.setter\n    def radius(self, value):\n        if not isinstance(value, (int, float)):\n            raise TypeError("Радиус должен быть числом")\n        if value < 0:\n            raise ValueError(f"Радиус не может быть отрицательным: {value}")\n        self._radius = value\n    \n    @property\n    def area(self):\n        import math\n        return math.pi * self._radius ** 2\n\nc = Circle(5)\nprint(c.radius)  # 5\n\nc.radius = 10    # вызывает сеттер\nprint(c.radius)  # 10\n\ntry:\n    c.radius = -5  # ValueError!\nexcept ValueError as e:\n    print(e)\n\ntry:\n    c.radius = "big"  # TypeError!\nexcept TypeError as e:\n    print(e)\n\nprint(f"Площадь: {c.area:.2f}")  # 314.16'
        }
      ]
    },
    {
      id: 4,
      title: 'Делетер @property.deleter',
      content: [
        {
          type: 'heading',
          value: 'Обработка удаления атрибута'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Person:\n    def __init__(self, name, age):\n        self._name = name\n        self._age = age\n        self._email = None\n    \n    @property\n    def email(self):\n        return self._email\n    \n    @email.setter\n    def email(self, value):\n        if "@" not in str(value):\n            raise ValueError("Неверный формат email")\n        self._email = value\n    \n    @email.deleter\n    def email(self):\n        print(f"Удаляем email для {self._name}")\n        self._email = None  # обнуляем, а не удаляем атрибут\n\n    @property\n    def name(self):\n        return self._name\n    \n    @name.setter\n    def name(self, value):\n        if not value.strip():\n            raise ValueError("Имя не может быть пустым")\n        self._name = value.strip().title()\n\np = Person("иван", 30)\nprint(p.name)     # Иван — сеттер применил title()\n\np.email = "ivan@example.com"\nprint(p.email)    # ivan@example.com\n\ndel p.email       # вызывает делетер\nprint(p.email)    # None'
        }
      ]
    },
    {
      id: 5,
      title: 'Property для кэширования',
      content: [
        {
          type: 'heading',
          value: 'Вычисляемые атрибуты с кэшем'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Дорогое вычисление — кэшируем результат\nclass DataAnalyzer:\n    def __init__(self, data):\n        self.data = data\n        self._mean = None  # кэш\n        self._std = None\n    \n    @property\n    def mean(self):\n        if self._mean is None:\n            print("Вычисляем среднее...")  # только один раз!\n            self._mean = sum(self.data) / len(self.data)\n        return self._mean\n    \n    @property\n    def std(self):\n        if self._std is None:\n            m = self.mean  # используем кэшированное\n            self._std = (sum((x - m) ** 2 for x in self.data) / len(self.data)) ** 0.5\n        return self._std\n    \n    def add_data(self, value):\n        self.data.append(value)\n        self._mean = None  # инвалидируем кэш\n        self._std = None\n\nanalyzer = DataAnalyzer([1, 2, 3, 4, 5])\nprint(analyzer.mean)  # Вычисляем среднее... 3.0\nprint(analyzer.mean)  # 3.0 — без вычисления (кэш)\nprint(analyzer.std)   # 1.4142...\n\n# cached_property (Python 3.8+) — автоматически кэширует\nfrom functools import cached_property\n\nclass Circle:\n    def __init__(self, r): self.r = r\n    \n    @cached_property\n    def area(self):\n        import math\n        print("Вычисляем площадь...")\n        return math.pi * self.r ** 2\n\nc = Circle(5)\nprint(c.area)  # Вычисляем площадь... 78.54\nprint(c.area)  # 78.54 — из кэша (cached_property)'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Класс Rectangle',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте класс Rectangle с валидацией через property и автоматическим вычислением производных значений.',
      requirements: [
        'Класс Rectangle с атрибутами width и height через property',
        'Валидация: ширина и высота должны быть положительными числами',
        'Свойства area и perimeter (только для чтения, вычисляются)',
        'Свойство is_square — True если ширина равна высоте',
        'Метод scale(factor) масштабирует прямоугольник',
        '__str__ выводит "Rectangle(w x h), area=X"'
      ],
      expectedOutput: 'Rectangle(4.0 x 6.0), площадь=24.00\nПериметр: 20.0\nКвадрат: False\n\nПосле масштабирования на 1.5:\nRectangle(6.0 x 9.0), площадь=54.00\nКвадрат: False\n\nError: Ширина должна быть положительной',
      hint: 'В __init__ используйте self.width = width (не self._width = width), чтобы вызвался сеттер с валидацией. Так валидация работает и при создании, и при изменении.',
      solution: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width    # вызывает сеттеры\n        self.height = height  # с валидацией\n    \n    @property\n    def width(self):\n        return self._width\n    \n    @width.setter\n    def width(self, value):\n        if not isinstance(value, (int, float)) or value <= 0:\n            raise ValueError("Ширина должна быть положительной")\n        self._width = float(value)\n    \n    @property\n    def height(self):\n        return self._height\n    \n    @height.setter\n    def height(self, value):\n        if not isinstance(value, (int, float)) or value <= 0:\n            raise ValueError("Высота должна быть положительной")\n        self._height = float(value)\n    \n    @property\n    def area(self):\n        return self._width * self._height\n    \n    @property\n    def perimeter(self):\n        return 2 * (self._width + self._height)\n    \n    @property\n    def is_square(self):\n        return self._width == self._height\n    \n    def scale(self, factor):\n        self.width *= factor\n        self.height *= factor\n    \n    def __str__(self):\n        return f"Rectangle({self._width} x {self._height}), площадь={self.area:.2f}"\n\nr = Rectangle(4, 6)\nprint(r)\nprint(f"Периметр: {r.perimeter}")\nprint(f"Квадрат: {r.is_square}")\n\nprint("\\nПосле масштабирования на 1.5:")\nr.scale(1.5)\nprint(r)\nprint(f"Квадрат: {r.is_square}")\n\ntry:\n    r.width = -5\nexcept ValueError as e:\n    print(f"\\nError: {e}")',
      explanation: 'Ключевой момент: в __init__ присваивание self.width = width вызывает сеттер, который проверяет значение. Это гарантирует, что объект всегда создаётся с корректными данными. scale() использует сеттеры для обновления, что тоже проходит валидацию. Свойства area и perimeter не кэшируются — они вычисляются из актуальных _width и _height.'
    }
  ]
}
