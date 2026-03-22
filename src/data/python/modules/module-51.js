export default {
  id: 51,
  title: 'PEP 8 и стиль кода',
  description: 'Официальные стандарты стиля Python: именование, форматирование, инструменты автоматической проверки',
  lessons: [
    {
      id: 1,
      title: 'Отступы, длина строки, пустые строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'PEP 8 — официальное руководство по стилю Python. Следование PEP 8 делает код понятным для всех Python-разработчиков.' },
        { type: 'code', language: 'python', value: '# Отступы: 4 пробела (НЕ табы)\ndef calculate_total(items):\n    total = 0\n    for item in items:\n        if item.price > 0:  # 4 пробела\n            total += item.price  # 8 пробелов\n    return total\n\n# Максимальная длина строки: 79 символов для кода, 72 для docstrings\n# Для длинных строк — перенос\nresult = (first_value\n          + second_value\n          + third_value)  # выравнивание по открывающей скобке\n\nlong_condition = (\n    condition_one\n    and condition_two\n    and condition_three\n)\n\n# Пустые строки\n# 2 пустые строки — между функциями и классами верхнего уровня\n\ndef function_one():\n    pass\n\n\ndef function_two():\n    pass\n\n\nclass MyClass:\n    # 1 пустая строка — между методами класса\n    def method_one(self):\n        pass\n\n    def method_two(self):\n        pass\n\n# Кодировка — всегда UTF-8 (по умолчанию в Python 3)\n# -*- coding: utf-8 -*- (устарело для Python 3)' },
        { type: 'heading', value: 'Перенос аргументов и выравнивание' },
        { type: 'code', language: 'python', value: '# Несколько стилей переноса длинных вызовов функций\n\n# Стиль 1: продолжение с выравниванием по открывающей скобке\nresult = some_function(argument_one, argument_two,\n                       argument_three, argument_four)\n\n# Стиль 2: "висячий отступ" с дополнительным уровнем (рекомендован black)\nresult = some_function(\n    argument_one,\n    argument_two,\n    argument_three,\n    argument_four,  # trailing comma — black добавляет автоматически\n)\n\n# Длинные условия: оператор в начале строки (современный стиль)\nif (condition_one\n        and condition_two\n        and condition_three):\n    do_something()\n\n# Длинные словари и списки\nconfig = {\n    \'host\': \'localhost\',\n    \'port\': 5432,\n    \'database\': \'mydb\',\n    \'user\': \'postgres\',\n    \'password\': \'secret\',\n}\n\nallowed_hosts = [\n    \'localhost\',\n    \'127.0.0.1\',\n    \'example.com\',\n]\n\n# Длинный декоратор\n@pytest.mark.parametrize(\n    "input_value, expected",\n    [(1, 2), (2, 4), (3, 6)],\n)\ndef test_double(input_value, expected):\n    assert double(input_value) == expected' },
        { type: 'tip', value: 'black автоматически выбирает между "коротким" и "длинным" стилем переноса в зависимости от длины строки. Trailing comma (запятая после последнего элемента) — важный сигнал для black: если она есть, он форматирует элементы вертикально, что делает git diff чище.' }
      ]
    },
    {
      id: 2,
      title: 'Именование: переменные, функции, классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Соглашения об именовании помогают сразу понять что делает идентификатор. snake_case для переменных/функций, PascalCase для классов, SCREAMING_SNAKE_CASE для констант.' },
        { type: 'code', language: 'python', value: '# Переменные и функции: snake_case\nuser_name = "Алиса"\ntotal_price = 1500.50\nmax_retry_count = 3\n\ndef calculate_discount(price, discount_rate):\n    return price * (1 - discount_rate)\n\ndef get_user_by_id(user_id):\n    pass\n\n# Классы: PascalCase (CamelCase)\nclass UserAccount:\n    pass\n\nclass HTTPRequestHandler:\n    pass\n\nclass DatabaseConnectionPool:\n    pass\n\n# Константы: SCREAMING_SNAKE_CASE\nMAX_CONNECTIONS = 100\nDEFAULT_TIMEOUT = 30\nPI = 3.14159\nBASE_URL = \'https://api.example.com\'\n\n# Приватные атрибуты: один подчёркивание\nclass BankAccount:\n    def __init__(self, balance):\n        self._balance = balance    # "приватный" (по соглашению)\n        self.__id = 12345          # name mangling (действительно скрытый)\n\n    def _validate(self, amount):   # внутренний метод\n        return amount > 0\n\n# НЕ делай так:\nUSR = \'admin\'           # непонятное сокращение\ntemp2 = calculate()     # temp, data, result — плохие имена\nI = 1                   # l, O, I — похожи на 1 и 0, запрещены\n\n# Итераторы: осмысленные имена\nfor user in users:       # хорошо\n    pass\nfor u in users:          # приемлемо если контекст ясен\n    pass\nfor x in users:          # плохо (исключение: математика)' },
        { type: 'tip', value: 'Имя должно отвечать на вопрос "что это хранит?" или "что делает?". Избегай аббревиатур кроме общеизвестных (HTTP, URL, ID, CSV).' }
      ]
    },
    {
      id: 3,
      title: 'Пробелы вокруг операторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'PEP 8 строго регламентирует пробелы вокруг операторов, запятых и двоеточий.' },
        { type: 'code', language: 'python', value: '# Вокруг операторов присваивания и сравнения — пробелы\nx = 5\ny = x + 1\nresult = x == y\n\n# НЕТ пробелов у именованных аргументов!\ndef function(arg1, arg2=10):  # правильно\n    pass\n\nfunction(arg1=5, arg2=20)     # правильно\nfunction(arg1 = 5, arg2 = 20) # неправильно!\n\n# Пробелы вокруг операторов с разным приоритетом\n# Акцентируй нижший приоритет:\nhypot = x*x + y*y              # хорошо\nhypot = x * x + y * y          # тоже ок\nc = (a+b) * (a-b)              # хорошо\n\n# Срезы: нет пробелов\nham[1:9]\nham[1:9:3]\nham[::2]\nham[lower:upper]\nham[lower+offset : upper+offset]  # пробелы если сложные выражения\n\n# После запятой — пробел, перед — нет\nx = [1, 2, 3]\nfunc(a, b, c)\n\n# Вокруг : в словарях\nd = {\'key\': \'value\'}\n\n# НЕТ пробелов:\nspam(ham[1], {eggs: 2})  # правильно\nspam( ham[ 1], { eggs: 2} )  # неправильно!' },
        { type: 'heading', value: 'Type hints и аннотации PEP 484' },
        { type: 'code', language: 'python', value: 'from typing import Optional, List, Dict, Tuple, Union\nfrom pathlib import Path\n\n# Type hints улучшают читаемость и работу IDE/mypy\n# PEP 8 рекомендует добавлять аннотации к публичным функциям\n\n# Простые аннотации\ndef greet(name: str) -> str:\n    return f"Привет, {name}!"\n\ndef add(x: int, y: int) -> int:\n    return x + y\n\n# Сложные типы (Python 3.9+ можно list[str] без импорта)\ndef get_names(users: List[Dict[str, str]]) -> List[str]:\n    return [u["name"] for u in users]\n\n# Optional — может быть None\ndef find_user(user_id: int) -> Optional[Dict]:\n    return None  # или dict\n\n# Union — несколько типов\ndef process(data: Union[str, bytes]) -> str:\n    if isinstance(data, bytes):\n        return data.decode()\n    return data\n\n# Python 3.10+: X | Y вместо Union\ndef process_modern(data: str | bytes) -> str:\n    return data.decode() if isinstance(data, bytes) else data\n\n# Переменные\ncount: int = 0\nnames: list[str] = []\nconfig: dict[str, int] = {}\n\n# Пробелы в аннотациях: пробел после двоеточия\ndef func(x: int, y: float = 1.0) -> bool:  # правильно\n    pass\n\n# mypy для проверки типов:\n# pip install mypy\n# mypy myfile.py' },
        { type: 'note', value: 'Type hints не влияют на выполнение кода — Python их не проверяет в рантайме. Для проверки используй mypy. В Python 3.10+ можно писать list[str] и dict[str, int] без импорта из typing. PEP 8 требует пробел после двоеточия в аннотациях: def f(x: int) а не f(x:int).' }
      ]
    },
    {
      id: 4,
      title: 'Импорты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Импорты должны быть в начале файла, каждый на отдельной строке, сгруппированы: stdlib, сторонние, локальные.' },
        { type: 'code', language: 'python', value: '# Правильный порядок импортов:\n# 1. Стандартная библиотека\nimport os\nimport sys\nfrom pathlib import Path\nfrom typing import List, Optional\n\n# 2. Сторонние библиотеки (пустая строка между группами)\nimport numpy as np\nimport pandas as pd\nimport requests\nfrom bs4 import BeautifulSoup\n\n# 3. Локальные модули проекта\nfrom myproject.models import User\nfrom myproject.utils import calculate_tax\n\n# Одна строка = один импорт\nimport os       # правильно\nimport sys      # правильно\nimport os, sys  # НЕПРАВИЛЬНО\n\n# from import — несколько символов через запятую ок\nfrom os.path import join, dirname, exists\n\n# Абсолютные импорты предпочтительней относительных\nfrom mypackage.module import something  # абсолютный (лучше)\nfrom .module import something           # относительный (допустимо)\n\n# НЕ используй wildcard импорты\nfrom module import *  # ПЛОХО — загрязняет namespace\n\n# isort для автосортировки импортов:\n# pip install isort\n# isort myfile.py' },
        { type: 'tip', value: 'Установи isort и настрой его в pyproject.toml. Запускай автоматически через pre-commit хуки. isort совместим с black.' }
      ]
    },
    {
      id: 5,
      title: 'flake8, black, isort',
      type: 'theory',
      content: [
        { type: 'text', value: 'Автоматические инструменты снимают нагрузку с разработчика. black форматирует код, flake8 проверяет, isort сортирует импорты.' },
        { type: 'code', language: 'python', value: '# Установка инструментов:\n# pip install black flake8 isort\n\n# black — автоформатирование (не требует настройки)\n# black myfile.py          -- форматирует файл\n# black myproject/         -- форматирует директорию\n# black --check myfile.py  -- только проверяет (не меняет)\n\n# flake8 — линтер (находит ошибки и нарушения PEP8)\n# flake8 myfile.py\n# Типичные коды ошибок:\n# E501 line too long (79 > 79 characters)\n# E302 expected 2 blank lines\n# W291 trailing whitespace\n# F401 module imported but unused\n# F821 undefined name\n\n# Конфигурация в setup.cfg или .flake8:\n# [flake8]\n# max-line-length = 88  # совместимо с black\n# extend-ignore = E203  # black иногда нарушает E203\n# exclude = .git,__pycache__,venv\n\n# pyproject.toml (современный подход):\n# [tool.black]\n# line-length = 88\n# target-version = [\'py311\']\n\n# [tool.isort]\n# profile = "black"  # совместимость с black\n\n# pre-commit — автозапуск при git commit\n# pip install pre-commit\n# Файл .pre-commit-config.yaml:\n# repos:\n#   - repo: https://github.com/psf/black\n#     hooks:\n#       - id: black\n#   - repo: https://github.com/pycqa/flake8\n#     hooks:\n#       - id: flake8\n\nprint("Хороший код пишут один раз, читают много раз")' },
        { type: 'tip', value: 'black — "мнениевый" форматтер без настроек. Он устраняет споры о стиле в команде. Настрой его один раз в pyproject.toml и забудь о ручном форматировании.' }
      ]
    },
    {
      id: 6,
      title: 'Комментарии и документация в коде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Комментарии объясняют "почему", а не "что". Docstrings документируют публичный API. Избегай очевидных комментариев.' },
        { type: 'code', language: 'python', value: '# Хорошие комментарии\n\n# Плохо: объясняет "что" (и так видно)\nx = x + 1  # увеличиваем x на 1\n\n# Хорошо: объясняет "почему"\nx = x + 1  # компенсируем смещение на 1 из-за 0-индексации\n\n# Блок-комментарий для сложной логики\n# Алгоритм Хорнера для вычисления полинома:\n# p(x) = a_n*x^n + ... + a_1*x + a_0\n# Оценка слева направо: ((a_n*x + a_{n-1})*x + ...)*x + a_0\nresult = 0\nfor coef in coefficients:\n    result = result * x + coef\n\n# TODO и FIXME — для заметок (видны в IDE)\n# TODO: добавить кэширование для повышения производительности\n# FIXME: не работает при пустом списке\n# HACK: временное решение до рефакторинга API\n\n# НЕ комментируй выключенный код — удали его\n# Git хранит историю\n# result = old_function(x)  # ПЛОХО\n\n# Inline комментарии — только для неочевидного\nx = x + 1  # increment (ИЗБЫТОЧНО)\ntax_rate = 0.13  # НДС 13% (ПОЛЕЗНО)' },
        { type: 'heading', value: 'Docstrings: Google, NumPy и reST форматы' },
        { type: 'code', language: 'python', value: '# PEP 257 — соглашения о docstrings\n# Три популярных формата: Google, NumPy, reStructuredText (Sphinx)\n\n# Google style (рекомендуется для большинства проектов)\ndef calculate_bmi(weight: float, height: float) -> float:\n    """Рассчитывает индекс массы тела (ИМТ).\n\n    Args:\n        weight: Вес в килограммах.\n        height: Рост в метрах.\n\n    Returns:\n        ИМТ = weight / height^2.\n\n    Raises:\n        ValueError: Если вес или рост отрицательные.\n\n    Example:\n        >>> calculate_bmi(70, 1.75)\n        22.857142857142858\n    """\n    if weight <= 0 or height <= 0:\n        raise ValueError("Вес и рост должны быть положительными")\n    return weight / (height ** 2)\n\n# NumPy style (для научных библиотек)\ndef normalize(array):\n    """\n    Нормализует массив к диапазону [0, 1].\n\n    Parameters\n    ----------\n    array : array-like\n        Входной массив числовых значений.\n\n    Returns\n    -------\n    ndarray\n        Нормализованный массив.\n    """\n    pass\n\n# Однострочный docstring — для простых функций\ndef double(x):\n    """Возвращает удвоенное значение."""\n    return x * 2' },
        { type: 'tip', value: 'Выбери один стиль docstring для всего проекта и придерживайся его. Google style легче читать, NumPy style лучше для математических/научных API. Docstring автоматически становится __doc__ атрибутом функции и отображается в help(). Инструмент sphinx умеет генерировать HTML документацию из docstrings.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг кода по PEP 8',
      type: 'practice',
      difficulty: 'easy',
      description: 'Исправь все нарушения PEP 8 в предоставленном коде.',
      requirements: [
        'Исправь именование: все переменные и функции в snake_case, классы в PascalCase',
        'Исправь отступы (используй 4 пробела везде)',
        'Добавь правильные пробелы вокруг операторов',
        'Упорядочи импорты по правилам PEP 8',
        'Исправь длину строк (максимум 88 символов)',
        'Удали избыточные комментарии'
      ],
      expectedOutput: 'Код без нарушений PEP 8:\n- Все переменные в snake_case\n- Классы в PascalCase\n- Правильные отступы\n- Упорядоченные импорты\n- Нет строк длиннее 88 символов',
      hint: 'Запусти black и flake8 если они установлены. Или исправь вручную, следуя правилам: snake_case для переменных, PascalCase для классов, пробелы вокруг =, 4 пробела отступ.',
      solution: '# До (нарушения PEP 8):\n# import sys,os\n# from math import *\n# import numpy as np\n# import pandas as pd\n\n# class userAccount:\n#   def __init__(self,NAME,AGE,SALARY):\n#     self.Name=NAME\n#     self.age =AGE\n#     self.Salary= SALARY\n#   def GetInfo(self):\n#     return(self.Name,self.age,self.Salary)\n\n# def CalculateTax(salary,TaxRate=0.13):\n#   TAX=salary*TaxRate # считаем налог\n#   NetSalary=salary-TAX\n#   return NetSalary\n\n# После (исправленный код):\nimport os\nimport sys\nfrom math import pi, sqrt\n\nimport numpy as np\nimport pandas as pd\n\n\nclass UserAccount:\n    def __init__(self, name, age, salary):\n        self.name = name\n        self.age = age\n        self.salary = salary\n\n    def get_info(self):\n        return self.name, self.age, self.salary\n\n\ndef calculate_tax(salary, tax_rate=0.13):\n    # Налоговая ставка НДС\n    tax = salary * tax_rate\n    net_salary = salary - tax\n    return net_salary\n\n\n# Тест\naccount = UserAccount("Алиса", 28, 80000)\nprint(account.get_info())\nprint(f"Чистая зарплата: {calculate_tax(80000):,.0f} руб")',
      explanation: 'Имена методов GetInfo -> get_info (PascalCase только для классов). Параметры через пробелы после запятой. Убраны избыточные комментарии. Импорты разделены на группы с пустой строкой. Пробелы вокруг = в присваиваниях, но не в именованных аргументах.'
    }
  ]
}
