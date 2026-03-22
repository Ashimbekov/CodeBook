export default {
  id: 54,
  title: 'Документация (docstrings, Sphinx)',
  description: 'Написание docstrings в стилях Google/NumPy, автогенерация документации через Sphinx',
  lessons: [
    {
      id: 1,
      title: 'Зачем документировать и базовые docstrings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Документация — часть кода. Хорошие docstrings позволяют IDE показывать подсказки, генераторам создавать HTML-документацию, а коллегам понимать ваш код.' },
        { type: 'code', language: 'python', value: '# Однострочный docstring — для простых функций\ndef add(a, b):\n    """Возвращает сумму двух чисел."""\n    return a + b\n\n# Многострочный docstring\ndef calculate_discount(price, rate):\n    """\n    Вычисляет цену со скидкой.\n\n    Первая строка — краткое описание.\n    Затем пустая строка.\n    Затем подробное описание если нужно.\n    """\n    return price * (1 - rate)\n\n# Docstring доступен через __doc__\nprint(calculate_discount.__doc__)\n\n# help() выводит отформатированный docstring\nhelp(calculate_discount)\n\n# Для модуля — в начале файла\n"""\nМодуль для финансовых расчётов.\n\nПредоставляет функции для вычисления скидок, налогов и комиссий.\nИспользуется в модулях payments и reporting.\n"""\n\n# Для класса\nclass BankAccount:\n    """Банковский счёт с базовыми операциями.\n\n    Attributes:\n        owner: Владелец счёта.\n        balance: Текущий баланс.\n    """\n    def __init__(self, owner, initial_balance=0):\n        self.owner = owner\n        self.balance = initial_balance' }
      ]
    },
    {
      id: 2,
      title: 'Google Style docstrings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Google Style — наиболее читаемый и компактный формат. Рекомендуется Google, используется в большинстве open-source проектов.' },
        { type: 'code', language: 'python', value: 'def process_payment(\n    amount: float,\n    currency: str,\n    user_id: int,\n    description: str = ""\n) -> dict:\n    """Обрабатывает платёж и возвращает результат транзакции.\n\n    Выполняет валидацию суммы, конвертацию валюты и создаёт запись\n    о транзакции в базе данных.\n\n    Args:\n        amount: Сумма платежа. Должна быть положительной.\n        currency: Код валюты в формате ISO 4217 (например, \'RUB\', \'USD\').\n        user_id: Идентификатор пользователя в системе.\n        description: Необязательное описание платежа. По умолчанию пустая строка.\n\n    Returns:\n        Словарь с результатом транзакции:\n            - transaction_id (str): Уникальный идентификатор транзакции.\n            - status (str): \'success\' или \'failed\'.\n            - amount (float): Обработанная сумма.\n            - timestamp (str): Время транзакции в ISO формате.\n\n    Raises:\n        ValueError: Если amount <= 0 или currency не соответствует ISO 4217.\n        UserNotFoundError: Если пользователь с user_id не существует.\n        PaymentServiceError: При ошибке внешнего платёжного сервиса.\n\n    Example:\n        >>> result = process_payment(1000.0, \'RUB\', user_id=42)\n        >>> result[\'status\']\n        \'success\'\n        >>> result[\'transaction_id\']\n        \'txn_abc123\'\n\n    Note:\n        Транзакция атомарна: либо создаётся запись в БД и списываются деньги,\n        либо не происходит ничего.\n    """\n    pass' }
      ]
    },
    {
      id: 3,
      title: 'NumPy Style и атрибуты классов',
      type: 'theory',
      content: [
        { type: 'text', value: 'NumPy Style используется в научных библиотеках (NumPy, SciPy, Pandas, Scikit-learn). Более подробный, с разделителями из дефисов.' },
        { type: 'code', language: 'python', value: 'def correlation(x, y):\n    """\n    Вычисляет коэффициент корреляции Пирсона между двумя массивами.\n\n    Parameters\n    ----------\n    x : array-like of shape (n,)\n        Первый набор данных. Должен быть одномерным.\n    y : array-like of shape (n,)\n        Второй набор данных. Должен иметь ту же длину что x.\n\n    Returns\n    -------\n    float\n        Коэффициент корреляции от -1.0 до 1.0.\n        1.0 — полная положительная корреляция.\n        -1.0 — полная отрицательная корреляция.\n        0.0 — отсутствие линейной корреляции.\n\n    Raises\n    ------\n    ValueError\n        Если x и y имеют разную длину или содержат менее 2 элементов.\n\n    See Also\n    --------\n    numpy.corrcoef : Матрица корреляций.\n    scipy.stats.pearsonr : С p-value.\n\n    Examples\n    --------\n    >>> correlation([1, 2, 3], [4, 5, 6])\n    1.0\n    >>> correlation([1, 2, 3], [6, 5, 4])\n    -1.0\n    """\n    pass\n\n\nclass DataProcessor:\n    """Обрабатывает и трансформирует датафреймы.\n\n    Attributes\n    ----------\n    data : pd.DataFrame\n        Исходный датафрейм для обработки.\n    processed : bool\n        True если данные были обработаны.\n    schema : dict\n        Схема валидации данных.\n    """\n    def __init__(self, data):\n        self.data = data\n        self.processed = False\n        self.schema = {}' }
      ]
    },
    {
      id: 4,
      title: 'doctest: документация с тестами',
      type: 'theory',
      content: [
        { type: 'text', value: 'doctest позволяет писать тесты прямо в docstring. Удобно для простых функций — документация всегда актуальна.' },
        { type: 'code', language: 'python', value: 'def fibonacci(n):\n    """Возвращает n-е число Фибоначчи.\n\n    Args:\n        n: Порядковый номер (начиная с 0).\n\n    Returns:\n        n-е число Фибоначчи.\n\n    Raises:\n        ValueError: Если n отрицательное.\n\n    Examples:\n        >>> fibonacci(0)\n        0\n        >>> fibonacci(1)\n        1\n        >>> fibonacci(10)\n        55\n        >>> fibonacci(-1)\n        Traceback (most recent call last):\n            ...\n        ValueError: n не может быть отрицательным\n    """\n    if n < 0:\n        raise ValueError("n не может быть отрицательным")\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n# Запуск doctests:\nimport doctest\n\n# Запустить тесты в файле\n# python -m doctest myfile.py -v\n\n# Или в коде:\nif __name__ == "__main__":\n    doctest.testmod(verbose=True)\n\n# Результат:\n# Trying: fibonacci(0)\n# Expecting: 0\n# ok\n# Trying: fibonacci(10)\n# Expecting: 55\n# ok\n# ...' },
        { type: 'tip', value: 'Используй doctest для простых, чистых функций. Для сложных тестов с фикстурами и моками — pytest. Не перегружай docstring сложными тестами — это снижает читаемость.' }
      ]
    },
    {
      id: 5,
      title: 'Sphinx: генерация документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sphinx автоматически генерирует HTML, PDF документацию из docstrings и .rst файлов. Стандарт для Python проектов.' },
        { type: 'code', language: 'python', value: '# Установка и инициализация\n# pip install sphinx sphinx-rtd-theme\n# sphinx-quickstart docs/\n\n# Структура docs/:\n# docs/\n# |-- conf.py          <- конфигурация\n# |-- index.rst        <- главная страница\n# |-- api/\n# |   |-- modules.rst\n# |-- _build/          <- сгенерированная документация\n\n# docs/conf.py — основная конфигурация\n# import os, sys\n# sys.path.insert(0, os.path.abspath("../src"))\n\n# project = "MyProject"\n# copyright = "2024, Иван Иванов"\n# author = "Иван Иванов"\n# version = "1.0"\n\n# extensions = [\n#     "sphinx.ext.autodoc",     # из docstrings\n#     "sphinx.ext.napoleon",    # Google/NumPy style\n#     "sphinx.ext.viewcode",    # ссылки на исходный код\n#     "sphinx.ext.autosummary", # автосодержание\n# ]\n\n# html_theme = "sphinx_rtd_theme"\n\n# docs/api/modules.rst\n# Calculator Module\n# ================\n# .. automodule:: calculator.operations\n#    :members:\n#    :undoc-members:\n#    :show-inheritance:\n\n# Генерация документации\n# cd docs\n# make html                    # HTML\n# make pdf                     # PDF (нужен LaTeX)\n\n# Авто-документация из всех модулей\n# sphinx-apidoc -o docs/api src/myproject\n\nprint("Хорошая документация = уважение к пользователям кода")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Документирование модуля',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши полные docstrings в Google Style для модуля статистических функций.',
      requirements: [
        'Создай модуль stats.py с docstring модуля',
        'Функция mean(data) — среднее арифметическое с Google Style docstring',
        'Функция median(data) — медиана с Google Style docstring',
        'Функция std_dev(data) — стандартное отклонение с Google Style docstring',
        'Класс StatsSummary с __init__, compute() и __repr__ — все с docstrings',
        'Добавь doctest примеры в mean() и median()'
      ],
      expectedOutput: 'Все функции документированы.\nhelp(mean) показывает полный docstring.\nDoctest проходит:\npython -m doctest stats.py -v\n...\n3 items passed all tests',
      hint: 'Начни с модульного docstring. Для mean: Args: data (list[float]), Returns: float, Raises: ValueError если пустой список. Добавь >>> mean([1, 2, 3]) в Examples.',
      solution: '"""\nМодуль для базовых статистических вычислений.\n\nПредоставляет функции для вычисления описательной статистики:\nсреднее, медиана, стандартное отклонение.\n\nExample:\n    >>> from stats import mean, median\n    >>> mean([1, 2, 3, 4, 5])\n    3.0\n"""\nimport math\nfrom typing import Sequence\n\n\ndef mean(data: Sequence[float]) -> float:\n    """Вычисляет среднее арифметическое.\n\n    Args:\n        data: Последовательность чисел. Не должна быть пустой.\n\n    Returns:\n        Среднее значение всех элементов.\n\n    Raises:\n        ValueError: Если data пуста.\n        TypeError: Если data содержит нечисловые значения.\n\n    Example:\n        >>> mean([1, 2, 3, 4, 5])\n        3.0\n        >>> mean([10])\n        10.0\n        >>> mean([])\n        Traceback (most recent call last):\n            ...\n        ValueError: Нельзя вычислить среднее пустого набора данных\n    """\n    if not data:\n        raise ValueError("Нельзя вычислить среднее пустого набора данных")\n    return sum(data) / len(data)\n\n\ndef median(data: Sequence[float]) -> float:\n    """Вычисляет медиану набора данных.\n\n    Медиана — среднее значение при сортировке. Для чётного числа\n    элементов — среднее двух центральных значений.\n\n    Args:\n        data: Последовательность чисел. Не должна быть пустой.\n\n    Returns:\n        Медианное значение.\n\n    Raises:\n        ValueError: Если data пуста.\n\n    Example:\n        >>> median([3, 1, 4, 1, 5])\n        3\n        >>> median([1, 2, 3, 4])\n        2.5\n    """\n    if not data:\n        raise ValueError("Нельзя вычислить медиану пустого набора данных")\n    sorted_data = sorted(data)\n    n = len(sorted_data)\n    mid = n // 2\n    if n % 2 == 0:\n        return (sorted_data[mid - 1] + sorted_data[mid]) / 2\n    return sorted_data[mid]\n\n\ndef std_dev(data: Sequence[float]) -> float:\n    """Вычисляет выборочное стандартное отклонение.\n\n    Использует формулу Бесселя (деление на n-1) для несмещённой оценки.\n\n    Args:\n        data: Последовательность чисел. Должна содержать минимум 2 элемента.\n\n    Returns:\n        Стандартное отклонение.\n\n    Raises:\n        ValueError: Если data содержит менее 2 элементов.\n    """\n    if len(data) < 2:\n        raise ValueError("Для std_dev нужно минимум 2 элемента")\n    avg = mean(data)\n    variance = sum((x - avg) ** 2 for x in data) / (len(data) - 1)\n    return math.sqrt(variance)\n\n\nclass StatsSummary:\n    """Вычисляет и хранит сводную статистику набора данных.\n\n    Attributes:\n        data: Исходный набор данных.\n        stats: Словарь со статистиками (заполняется после compute()).\n    """\n\n    def __init__(self, data: Sequence[float]):\n        """Инициализирует с набором данных.\n\n        Args:\n            data: Список числовых значений для анализа.\n        """\n        self.data = list(data)\n        self.stats: dict = {}\n\n    def compute(self) -> dict:\n        """Вычисляет все статистики.\n\n        Returns:\n            Словарь с ключами: mean, median, std_dev, min, max, count.\n        """\n        self.stats = {\n            \'mean\': mean(self.data),\n            \'median\': median(self.data),\n            \'std_dev\': std_dev(self.data) if len(self.data) >= 2 else 0,\n            \'min\': min(self.data),\n            \'max\': max(self.data),\n            \'count\': len(self.data)\n        }\n        return self.stats\n\n    def __repr__(self) -> str:\n        """Возвращает строковое представление объекта."""\n        return f"StatsSummary(n={len(self.data)}, mean={mean(self.data):.2f})"\n\n\nif __name__ == "__main__":\n    import doctest\n    doctest.testmod(verbose=True)',
      explanation: 'Sequence[float] более гибко чем list[float] — принимает tuple, numpy array и другие последовательности. Doctest в Example: секции проверяются автоматически. __repr__ с краткой информацией удобен при отладке в REPL.'
    }
  ]
}
