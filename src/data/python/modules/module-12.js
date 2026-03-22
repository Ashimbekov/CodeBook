export default {
  id: 12,
  title: 'Модули и пакеты',
  description: 'Импорт модулей: import, from...import, as. Создание собственных модулей, пакетов и переменная __name__.',
  lessons: [
    {
      id: 1,
      title: 'import и from...import',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Подключение модулей'
        },
        {
          type: 'text',
          value: 'Модуль — это файл Python с кодом, который можно переиспользовать. Стандартная библиотека Python содержит сотни модулей. import позволяет использовать их в своём коде. Хорошая практика: импортировать в начале файла.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# import — весь модуль\nimport math\nimport random\nimport os\n\nprint(math.pi)          # 3.141592653589793\nprint(math.sqrt(16))    # 4.0\nprint(math.floor(3.7))  # 3\n\n# from...import — конкретные имена\nfrom math import pi, sqrt, factorial\nprint(pi)          # 3.141592653589793\nprint(sqrt(25))    # 5.0\nprint(factorial(5)) # 120\n\n# from...import * — все имена (не рекомендуется!)\n# from math import *  # засоряет пространство имён\n\n# import...as — псевдоним\nimport numpy as np          # стандарт для numpy\nimport pandas as pd         # стандарт для pandas\nfrom datetime import datetime as dt\n\nnow = dt.now()\nprint(now)'
        },
        {
          type: 'warning',
          value: 'Избегайте from module import * — это загрязняет глобальное пространство имён и может вызвать конфликты имён. Всегда импортируйте явно то, что нужно.'
        }
      ]
    },
    {
      id: 2,
      title: 'Часто используемые стандартные модули',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Полезные модули стандартной библиотеки'
        },
        {
          type: 'code',
          language: 'python',
          value: '# math — математика\nimport math\nprint(math.ceil(2.1))   # 3\nprint(math.log(100, 10))  # 2.0\nprint(math.gcd(12, 8))    # 4\n\n# random — случайность\nimport random\nprint(random.random())          # 0.0 — 1.0\nprint(random.randint(1, 10))    # целое 1-10\nprint(random.choice([1,2,3]))   # случайный элемент\ndata = [1, 2, 3, 4, 5]\nrandom.shuffle(data)            # перемешать на месте\nprint(random.sample(data, 3))   # 3 уникальных\n\n# os — операционная система\nimport os\nprint(os.getcwd())              # текущая директория\nprint(os.listdir("."))          # файлы в текущей папке\nprint(os.path.join("a", "b", "c"))  # a/b/c\nprint(os.path.exists("file.txt"))   # есть ли файл\n\n# sys — интерпретатор Python\nimport sys\nprint(sys.version)    # версия Python\nprint(sys.platform)   # операционная система\nprint(sys.argv)       # аргументы командной строки'
        }
      ]
    },
    {
      id: 3,
      title: 'Создание собственных модулей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Модуль — это файл .py'
        },
        {
          type: 'text',
          value: 'Любой файл .py может быть модулем. Чтобы использовать его, просто импортируйте файл по имени (без расширения). При импорте Python выполняет весь код в модуле и делает его имена доступными.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Файл: utils.py\n"""Утилиты для работы с числами."""\n\nPI = 3.14159\n\ndef circle_area(radius):\n    """Площадь круга."""\n    return PI * radius ** 2\n\ndef is_prime(n):\n    """Проверка на простое число."""\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nclass Calculator:\n    def add(self, a, b): return a + b\n    def sub(self, a, b): return a - b\n\n# ---\n# Файл: main.py — импортируем наш модуль\nimport utils\n\nprint(utils.PI)                  # 3.14159\nprint(utils.circle_area(5))      # 78.53975\nprint(utils.is_prime(17))        # True\n\nfrom utils import is_prime, PI\nprint(is_prime(100))  # False\n\ncalc = utils.Calculator()\nprint(calc.add(3, 5))  # 8'
        }
      ]
    },
    {
      id: 4,
      title: 'Переменная __name__',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'if __name__ == "__main__"'
        },
        {
          type: 'text',
          value: 'Переменная __name__ содержит имя текущего модуля. Когда файл запускается напрямую, __name__ == "__main__". Когда файл импортируется, __name__ == "имя_файла". Это стандартный паттерн для кода, который должен выполняться только при прямом запуске.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Файл: calculator.py\ndef add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\n# Этот код выполняется ТОЛЬКО при прямом запуске\n# При импорте — НЕ выполняется\nif __name__ == "__main__":\n    print("Тестирование calculator.py")\n    print(f"2 + 3 = {add(2, 3)}")\n    print(f"4 * 5 = {multiply(4, 5)}")\n    \n    # Можно запустить тесты\n    assert add(2, 3) == 5, "Ошибка в add"\n    assert multiply(4, 5) == 20, "Ошибка в multiply"\n    print("Все тесты пройдены!")\n\n# ---\n# Когда запускаем: python calculator.py\n# Вывод:\n# Тестирование calculator.py\n# 2 + 3 = 5\n# 4 * 5 = 20\n# Все тесты пройдены!\n\n# Когда import calculator — ничего не выводится'
        }
      ]
    },
    {
      id: 5,
      title: 'Пакеты — организация модулей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Папки с модулями'
        },
        {
          type: 'text',
          value: 'Пакет — это папка с файлом __init__.py (может быть пустым). Пакеты позволяют организовать модули в иерархию. В Python 3 файл __init__.py необязателен (namespace packages), но рекомендуется для обычных пакетов.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Структура проекта:\n# myapp/\n#     __init__.py\n#     utils/\n#         __init__.py\n#         math_utils.py\n#         string_utils.py\n#     models/\n#         __init__.py\n#         user.py\n\n# Импорт из пакета\nfrom myapp.utils.math_utils import circle_area\nfrom myapp.models.user import User\nimport myapp.utils.string_utils as str_utils\n\n# __init__.py может экспортировать удобные импорты:\n# В myapp/utils/__init__.py:\n# from .math_utils import circle_area, is_prime\n# from .string_utils import slugify\n\n# Тогда можно писать:\n# from myapp.utils import circle_area\n\n# Относительные импорты (внутри пакета)\n# В math_utils.py:\n# from . import string_utils      # тот же пакет\n# from .. import models           # родительский пакет\n# from ..models.user import User  # конкретный модуль'
        },
        {
          type: 'tip',
          value: 'Для установки внешних пакетов используйте pip: pip install requests numpy pandas. Список зависимостей хранят в requirements.txt: pip freeze > requirements.txt. Установка всех зависимостей: pip install -r requirements.txt.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модуль для работы со строками',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Создайте модуль string_tools с полезными функциями для обработки строк.',
      requirements: [
        'Функция count_vowels(text) — количество гласных букв (а е и о у ы э ю я)',
        'Функция is_palindrome(text) — проверка на палиндром (без пробелов и регистра)',
        'Функция truncate(text, max_length, suffix="...") — обрезка строки',
        'Функция word_wrap(text, width=40) — разбивка на строки по ширине',
        'Добавьте блок if __name__ == "__main__" с тестами'
      ],
      expectedOutput: 'Гласных: 5\nПалиндром "А роза упала на лапу Азора": True\nПалиндром "Python": False\nОбрезка: "Это очень длинный..."\nНет необходимости обрезать: "Короткий текст"',
      hint: 'Для палиндрома удалите пробелы, приведите к нижнему регистру и сравните со строкой[::-1]. Для усечения проверьте len(text) > max_length и верните text[:max_length-len(suffix)] + suffix.',
      solution: 'VOWELS = set("аеиоуыэюяАЕИОУЫЭЮЯ")\n\ndef count_vowels(text):\n    return sum(1 for c in text if c in VOWELS)\n\ndef is_palindrome(text):\n    clean = text.lower().replace(" ", "")\n    return clean == clean[::-1]\n\ndef truncate(text, max_length, suffix="..."):\n    if len(text) <= max_length:\n        return text\n    return text[:max_length - len(suffix)] + suffix\n\ndef word_wrap(text, width=40):\n    words = text.split()\n    lines = []\n    current = ""\n    for word in words:\n        if len(current) + len(word) + 1 <= width:\n            current = (current + " " + word).strip()\n        else:\n            if current:\n                lines.append(current)\n            current = word\n    if current:\n        lines.append(current)\n    return "\\n".join(lines)\n\nif __name__ == "__main__":\n    print(f"Гласных: {count_vowels(\'Привет Мир\')}")\n    print(f\'Палиндром "А роза упала на лапу Азора": {is_palindrome("А роза упала на лапу Азора")}\')\n    print(f\'Палиндром "Python": {is_palindrome("Python")}\')\n    print(f\'Обрезка: "{truncate("Это очень длинный текст", 20)}"\')\n    print(f\'Нет необходимости обрезать: "{truncate("Короткий текст", 20)}"\')',
      explanation: 'Модуль использует set для быстрой проверки гласных — O(1) вместо O(n) для строки. Для палиндрома строка сравнивается с обратной через срез [::-1]. Константа VOWELS вынесена на уровень модуля — она создаётся один раз. Блок if __name__ позволяет тестировать модуль напрямую.'
    }
  ]
}
