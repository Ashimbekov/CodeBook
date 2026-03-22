export default {
  id: 16,
  title: 'Классы и объекты',
  description: 'Объектно-ориентированное программирование: классы, объекты, __init__, self, методы, атрибуты экземпляра и класса.',
  lessons: [
    {
      id: 1,
      title: 'Создание класса',
      content: [
        {
          type: 'heading',
          value: 'Класс — шаблон для создания объектов'
        },
        {
          type: 'text',
          value: 'Класс — это шаблон (blueprint) для создания объектов. Объект — это экземпляр класса. ООП позволяет объединить данные (атрибуты) и поведение (методы) в одной структуре. Ключевое слово class определяет класс.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Определение класса\nclass Dog:\n    """Класс, представляющий собаку."""\n    \n    def __init__(self, name, breed, age):\n        """Конструктор — вызывается при создании объекта."""\n        self.name = name    # атрибут экземпляра\n        self.breed = breed\n        self.age = age\n    \n    def bark(self):\n        """Метод — функция объекта."""\n        print(f"{self.name} говорит: Гав!")\n    \n    def info(self):\n        return f"{self.name} ({self.breed}), {self.age} лет"\n\n# Создание объектов (экземпляров)\ndog1 = Dog("Рекс", "Немецкая овчарка", 3)\ndog2 = Dog("Белка", "Лабрадор", 5)\n\n# Вызов методов\ndog1.bark()        # Рекс говорит: Гав!\nprint(dog1.info()) # Рекс (Немецкая овчарка), 3 лет\n\n# Доступ к атрибутам\nprint(dog1.name)   # Рекс\nprint(dog2.age)    # 5\n\n# Изменение атрибутов\ndog1.age = 4\nprint(dog1.age)    # 4'
        }
      ]
    },
    {
      id: 2,
      title: 'self — ссылка на экземпляр',
      content: [
        {
          type: 'heading',
          value: 'Что такое self?'
        },
        {
          type: 'text',
          value: 'self — это первый параметр каждого метода класса, он ссылается на текущий экземпляр. Через self метод обращается к атрибутам и другим методам объекта. self передаётся автоматически при вызове метода.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Counter:\n    def __init__(self, start=0):\n        self.value = start  # сохраняем состояние в self\n    \n    def increment(self, step=1):\n        self.value += step  # изменяем атрибут экземпляра\n    \n    def reset(self):\n        self.value = 0\n    \n    def get(self):\n        return self.value\n    \n    def is_zero(self):\n        return self.value == 0\n\nc1 = Counter()\nc2 = Counter(10)  # у каждого объекта своё состояние\n\nc1.increment()    # c1.value = 1\nc1.increment(5)   # c1.value = 6\nc2.increment()    # c2.value = 11\n\nprint(c1.get())   # 6\nprint(c2.get())   # 11\n\nc1.reset()\nprint(c1.is_zero())  # True\nprint(c2.is_zero())  # False\n\n# За кулисами: dog.bark() == Dog.bark(dog)\n# Python автоматически передаёт экземпляр первым аргументом'
        }
      ]
    },
    {
      id: 3,
      title: 'Атрибуты класса и экземпляра',
      content: [
        {
          type: 'heading',
          value: 'Разница между атрибутами класса и экземпляра'
        },
        {
          type: 'text',
          value: 'Атрибуты экземпляра уникальны для каждого объекта (определяются в __init__ через self). Атрибуты класса общие для всех экземпляров (определяются в теле класса). Атрибуты экземпляра имеют приоритет над атрибутами класса.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Cat:\n    # Атрибут класса — общий для всех экземпляров\n    species = "Felis catus"\n    count = 0  # счётчик кошек\n    \n    def __init__(self, name, color):\n        # Атрибуты экземпляра — уникальные для каждого объекта\n        self.name = name\n        self.color = color\n        Cat.count += 1  # изменяем атрибут КЛАССА\n    \n    def describe(self):\n        return f"{self.name} ({self.color}), вид: {Cat.species}"\n\ncat1 = Cat("Мурка", "рыжая")\ncat2 = Cat("Пушок", "белый")\ncat3 = Cat("Барсик", "серый")\n\nprint(Cat.count)   # 3 — атрибут класса\nprint(cat1.count)  # 3 — доступ через экземпляр тоже работает\nprint(cat1.species)  # Felis catus\n\n# Изменение атрибута через экземпляр создаёт новый атрибут экземпляра!\ncat1.species = "Домашняя кошка"  # новый атрибут ЭКЗЕМПЛЯРА\nprint(cat1.species)  # Домашняя кошка (экземпляр)\nprint(cat2.species)  # Felis catus (класс не изменился!)\nprint(Cat.species)   # Felis catus'
        },
        {
          type: 'warning',
          value: 'Будьте осторожны с изменяемыми атрибутами класса (списками, словарями). Если один экземпляр изменит список-атрибут класса через append, это отразится на всех экземплярах. Лучше инициализировать изменяемые атрибуты в __init__.'
        }
      ]
    },
    {
      id: 4,
      title: 'Специальные методы __str__ и __repr__',
      content: [
        {
          type: 'heading',
          value: 'Строковое представление объекта'
        },
        {
          type: 'text',
          value: '__str__ возвращает строку для пользователя (print). __repr__ возвращает техническое представление (для разработчика). Если __str__ не определён, используется __repr__. Оба должны возвращать строку.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Book:\n    def __init__(self, title, author, year):\n        self.title = title\n        self.author = author\n        self.year = year\n    \n    def __str__(self):\n        """Для пользователя — краткое описание."""\n        return f\'"{self.title}" - {self.author} ({self.year})\'\n    \n    def __repr__(self):\n        """Для разработчика — полное техническое описание."""\n        return f"Book(title={self.title!r}, author={self.author!r}, year={self.year!r})"\n\nb = Book("Мастер и Маргарита", "Булгаков", 1967)\n\nprint(b)       # "Мастер и Маргарита" - Булгаков (1967)\nprint(str(b))  # то же самое\nprint(repr(b)) # Book(title="Мастер и Маргарита", author="Булгаков", year=1967)\n\n# В f-строках !r и !s\nprint(f"Книга: {b}")    # использует __str__\nprint(f"Книга: {b!r}")  # использует __repr__\nprint(f"Книга: {b!s}")  # явно __str__\n\n# Список объектов\nlibrary = [Book("1984", "Оруэлл", 1949), Book("Дюна", "Херберт", 1965)]\nprint(library)  # использует __repr__ для элементов списка'
        }
      ]
    },
    {
      id: 5,
      title: 'Инкапсуляция и приватные атрибуты',
      content: [
        {
          type: 'heading',
          value: 'Ограничение доступа к атрибутам'
        },
        {
          type: 'text',
          value: 'В Python нет настоящих приватных атрибутов, но есть соглашения. _ (одно подчёркивание) — "защищённый" атрибут, не трогайте снаружи. __ (двойное подчёркивание) — "приватный", вызывает name mangling (переименование). _ClassName__attr.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner          # публичный\n        self._balance = balance     # защищённый (соглашение)\n        self.__pin = "1234"         # "приватный" (name mangling)\n    \n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Сумма должна быть положительной")\n        self._balance += amount\n    \n    def withdraw(self, amount, pin):\n        if pin != self.__pin:\n            raise PermissionError("Неверный PIN")\n        if amount > self._balance:\n            raise ValueError("Недостаточно средств")\n        self._balance -= amount\n    \n    @property  # геттер (подробнее в модуле 20)\n    def balance(self):\n        return self._balance\n\nacc = BankAccount("Иван", 1000)\nacc.deposit(500)\nprint(acc.balance)     # 1500\nprint(acc._balance)    # 1500 — можно, но не рекомендуется\n\n# Name mangling: __pin стал _BankAccount__pin\nprint(acc._BankAccount__pin)  # "1234" — технически доступно\ntry:\n    print(acc.__pin)  # AttributeError\nexcept AttributeError:\n    print("Атрибут __pin недоступен")'
        }
      ]
    },
    {
      id: 6,
      title: 'Методы класса и статические методы',
      content: [
        {
          type: 'heading',
          value: '@classmethod и @staticmethod'
        },
        {
          type: 'text',
          value: 'Обычные методы получают self (экземпляр). @classmethod получает cls (класс) — полезен для альтернативных конструкторов. @staticmethod не получает ни self, ни cls — это обычная функция внутри класса, связанная с ним логически.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n    \n    @classmethod\n    def from_fahrenheit(cls, fahrenheit):\n        """Альтернативный конструктор."""\n        celsius = (fahrenheit - 32) * 5 / 9\n        return cls(celsius)  # создаём объект через cls\n    \n    @classmethod\n    def from_kelvin(cls, kelvin):\n        """Ещё один альтернативный конструктор."""\n        celsius = kelvin - 273.15\n        return cls(celsius)\n    \n    @staticmethod\n    def is_valid_celsius(value):\n        """Утилита — не требует ни self, ни cls."""\n        return -273.15 <= value <= 10000\n    \n    def __str__(self):\n        return f"{self.celsius:.2f}°C"\n\nt1 = Temperature(100)\nt2 = Temperature.from_fahrenheit(212)\nt3 = Temperature.from_kelvin(373.15)\n\nprint(t1, t2, t3)  # все 100.00°C\nprint(Temperature.is_valid_celsius(-300))  # False\nprint(Temperature.is_valid_celsius(20))    # True'
        }
      ]
    },
    {
      id: 7,
      title: '__del__ и управление ресурсами',
      content: [
        {
          type: 'heading',
          value: 'Деструктор объекта'
        },
        {
          type: 'code',
          language: 'python',
          value: 'class FileWrapper:\n    def __init__(self, filename, mode):\n        print(f"Открываем {filename}")\n        self.filename = filename\n        self.file = open(filename, mode)\n    \n    def write(self, data):\n        self.file.write(data)\n    \n    def __del__(self):\n        """Вызывается при удалении объекта сборщиком мусора."""\n        if hasattr(self, "file") and not self.file.closed:\n            print(f"Закрываем {self.filename} в __del__")\n            self.file.close()\n\n# Лучше использовать with и __enter__/__exit__!\nclass ManagedFile:\n    def __init__(self, filename):\n        self.filename = filename\n    \n    def __enter__(self):\n        self.file = open(self.filename, "w")\n        return self.file\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.file.close()\n        return False  # не подавляем исключения\n\nwith ManagedFile("temp.txt") as f:\n    f.write("Данные")\n# файл закрыт автоматически'
        },
        {
          type: 'tip',
          value: 'Не полагайтесь на __del__ для освобождения ресурсов — Python не гарантирует когда он будет вызван. Используйте контекстный менеджер with и протокол __enter__/__exit__.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Класс Student',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте класс Student для управления студентами и их оценками.',
      requirements: [
        'Класс Student с атрибутами: name, student_id, grades (список)',
        'Метод add_grade(subject, score) добавляет оценку',
        'Метод get_average() возвращает средний балл',
        'Метод get_best_subject() возвращает предмет с лучшей оценкой',
        'Метод is_passing(threshold=60) проверяет, сдал ли студент все предметы',
        '__str__ выводит сводку: имя, ID и средний балл'
      ],
      expectedOutput: 'Студент: Иван Петров (ID: S001)\nСредний балл: 81.3\nЛучший предмет: Математика (95)\nСдал все предметы: True\n\nСтудент: Алиса (ID: S002)\nСредний балл: 52.0\nСдал все предметы: False',
      hint: 'grades хранит список словарей {"subject": ..., "score": ...}. Для get_best_subject используйте max() с key=lambda. Не забудьте обработать случай пустого списка оценок.',
      solution: 'class Student:\n    def __init__(self, name, student_id):\n        self.name = name\n        self.student_id = student_id\n        self.grades = []\n    \n    def add_grade(self, subject, score):\n        self.grades.append({"subject": subject, "score": score})\n    \n    def get_average(self):\n        if not self.grades:\n            return 0.0\n        return sum(g["score"] for g in self.grades) / len(self.grades)\n    \n    def get_best_subject(self):\n        if not self.grades:\n            return None\n        best = max(self.grades, key=lambda g: g["score"])\n        return f"{best[\'subject\']} ({best[\'score\']})" \n    \n    def is_passing(self, threshold=60):\n        return all(g["score"] >= threshold for g in self.grades)\n    \n    def __str__(self):\n        return f"Студент: {self.name} (ID: {self.student_id})"\n\ns1 = Student("Иван Петров", "S001")\ns1.add_grade("Математика", 95)\ns1.add_grade("Python", 82)\ns1.add_grade("Английский", 67)\n\nprint(s1)\nprint(f"Средний балл: {s1.get_average():.1f}")\nprint(f"Лучший предмет: {s1.get_best_subject()}")\nprint(f"Сдал все предметы: {s1.is_passing()}")\n\ns2 = Student("Алиса", "S002")\ns2.add_grade("Математика", 45)\ns2.add_grade("Python", 59)\nprint(f"\\n{s2}")\nprint(f"Средний балл: {s2.get_average():.1f}")\nprint(f"Сдал все предметы: {s2.is_passing()}")',
      explanation: 'Хранение оценок как список словарей позволяет иметь несколько полей. Генераторные выражения в get_average и is_passing читаемее и эффективнее циклов. max() с key= элегантно находит лучшую оценку. all() с генератором — питоничный способ проверить условие для всех элементов.'
    }
  ]
}
