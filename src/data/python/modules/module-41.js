export default {
  id: 41,
  title: 'unittest и pytest',
  description: 'Научимся писать тесты с pytest: базовые утверждения assert, фикстуры, параметризация, мокирование и принципы TDD',
  lessons: [
    {
      id: 1, title: 'Зачем писать тесты', type: 'theory',
      content: [
        { type: 'text', value: 'Тесты — это код, который проверяет что ваш код работает правильно. Они спасают от регрессий: изменил одно — сломал другое. Хорошие тесты = уверенность при изменениях.' },
        { type: 'tip', value: 'Правило: если ты проверяешь код вручную — запускаешь, смотришь, думаешь "работает" — это можно автоматизировать тестом.' },
        { type: 'heading', value: 'Первый тест на pytest' },
        { type: 'code', language: 'python', value: '# Файл: test_calculator.py\n# Запуск: pytest test_calculator.py\n\ndef add(a, b):\n    return a + b\n\ndef test_add_positive():  # имя начинается с test_!\n    result = add(2, 3)\n    assert result == 5   # утверждение\n\ndef test_add_negative():\n    assert add(-1, -2) == -3\n\ndef test_add_zero():\n    assert add(0, 5) == 5\n    assert add(5, 0) == 5\n    assert add(0, 0) == 0' },
        { type: 'heading', value: 'Запуск и вывод pytest' },
        { type: 'code', language: 'python', value: '# pytest               — запустить все тесты\n# pytest -v             — подробный вывод\n# pytest test_calc.py   — конкретный файл\n# pytest -k "add"       — только тесты содержащие "add"\n# pytest -x             — остановиться на первой ошибке\n\n# Вывод при успехе:\n# test_calculator.py ...\n# 3 passed in 0.05s\n\n# Вывод при ошибке:\n# FAILED test_calculator.py::test_add_positive\n# AssertionError: assert 4 == 5' },
        { type: 'note', value: 'pytest автоматически находит тесты в файлах test_*.py или *_test.py, в функциях test_* и классах Test*.' }
      ]
    },
    {
      id: 2, title: 'Assert с понятными сообщениями', type: 'theory',
      content: [
        { type: 'text', value: 'pytest умеет "разобрать" assert и показать подробное сообщение об ошибке. Можно также добавить собственное сообщение.' },
        { type: 'heading', value: 'Различные виды assertions' },
        { type: 'code', language: 'python', value: 'def test_assertions():\n    # Равенство\n    assert 1 + 1 == 2\n\n    # Неравенство\n    assert 1 != 2\n\n    # Вхождение\n    assert "ello" in "hello"\n    assert 3 in [1, 2, 3]\n\n    # Тип\n    assert isinstance(42, int)\n    assert isinstance("hello", str)\n\n    # Истинность/ложность\n    assert [1, 2, 3]   # непустой список — True\n    assert not []       # пустой список — False\n\n    # С сообщением\n    actual = 42\n    expected = 42\n    assert actual == expected, f"Ожидалось {expected}, получено {actual}"' },
        { type: 'heading', value: 'Проверка исключений' },
        { type: 'code', language: 'python', value: 'import pytest\n\ndef divide(a, b):\n    if b == 0:\n        raise ZeroDivisionError("Деление на ноль")\n    return a / b\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        divide(10, 0)\n\ndef test_divide_message():\n    with pytest.raises(ZeroDivisionError, match="Деление на ноль"):\n        divide(10, 0)\n\ndef test_divide_exception_info():\n    with pytest.raises(ZeroDivisionError) as exc_info:\n        divide(10, 0)\n    assert "ноль" in str(exc_info.value)' }
      ]
    },
    {
      id: 3, title: 'Фикстуры (fixtures)', type: 'theory',
      content: [
        { type: 'text', value: 'Фикстуры — это функции, которые подготавливают данные или объекты для тестов. Они избавляют от дублирования setup-кода и управляют жизненным циклом ресурсов.' },
        { type: 'heading', value: 'Базовые фикстуры' },
        { type: 'code', language: 'python', value: 'import pytest\n\nclass BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Сумма должна быть положительной")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            raise ValueError("Недостаточно средств")\n        self.balance -= amount\n\n# Фикстура создаётся для каждого теста заново\n@pytest.fixture\ndef account():\n    return BankAccount(balance=1000)\n\n@pytest.fixture\ndef empty_account():\n    return BankAccount(balance=0)\n\ndef test_deposit(account):  # pytest передаёт фикстуру автоматически!\n    account.deposit(500)\n    assert account.balance == 1500\n\ndef test_withdraw(account):\n    account.withdraw(200)\n    assert account.balance == 800\n\ndef test_withdraw_insufficient(account):\n    with pytest.raises(ValueError, match="Недостаточно средств"):\n        account.withdraw(2000)' },
        { type: 'heading', value: 'Фикстуры с scope' },
        { type: 'code', language: 'python', value: 'import pytest\n\n# scope="function" — новая для каждого теста (по умолчанию)\n# scope="class"    — одна на класс\n# scope="module"   — одна на файл\n# scope="session"  — одна на всю сессию pytest\n\n@pytest.fixture(scope="module")\ndef db_connection():\n    """Подключение к БД — дорогая операция, создаём один раз."""\n    print("\\nПодключаемся к БД...")\n    conn = {"status": "connected"}  # имитация соединения\n    yield conn  # передаём тесту\n    print("\\nЗакрываем соединение")  # cleanup после всех тестов\n\ndef test_query1(db_connection):\n    assert db_connection["status"] == "connected"\n\ndef test_query2(db_connection):\n    assert db_connection["status"] == "connected"' },
        { type: 'tip', value: 'Фикстура с yield — это контекстный менеджер для тестов. Код после yield выполняется как teardown (очистка) после теста.' }
      ]
    },
    {
      id: 4, title: 'parametrize — параметризованные тесты', type: 'theory',
      content: [
        { type: 'text', value: '@pytest.mark.parametrize позволяет запустить один тест с множеством разных входных данных. Это самый эффективный способ покрыть много сценариев.' },
        { type: 'heading', value: 'Параметризация тестов' },
        { type: 'code', language: 'python', value: 'import pytest\n\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\n@pytest.mark.parametrize("n, expected", [\n    (2, True),\n    (3, True),\n    (4, False),\n    (5, True),\n    (6, False),\n    (7, True),\n    (1, False),\n    (0, False),\n    (-1, False),\n])\ndef test_is_prime(n, expected):\n    assert is_prime(n) == expected\n# Запустится 9 отдельных тестов!' },
        { type: 'heading', value: 'Несколько аргументов' },
        { type: 'code', language: 'python', value: 'import pytest\n\ndef add(a, b):\n    return a + b\n\n@pytest.mark.parametrize("a, b, expected", [\n    (1, 2, 3),\n    (-1, 1, 0),\n    (0, 0, 0),\n    (100, -50, 50),\n])\ndef test_add(a, b, expected):\n    assert add(a, b) == expected\n\n# Именованные параметры для читаемости\n@pytest.mark.parametrize("a, b, expected", [\n    pytest.param(1, 2, 3, id="positive"),\n    pytest.param(-1, -2, -3, id="negative"),\n    pytest.param(0, 0, 0, id="zeros"),\n])  \ndef test_add_named(a, b, expected):\n    assert add(a, b) == expected' }
      ]
    },
    {
      id: 5, title: 'Mock — подмена объектов', type: 'theory',
      content: [
        { type: 'text', value: 'Mock позволяет подменить реальные зависимости (HTTP запросы, БД, файлы) на заглушки. Это делает тесты быстрыми, надёжными и изолированными.' },
        { type: 'heading', value: 'unittest.mock.patch' },
        { type: 'code', language: 'python', value: 'import pytest\nfrom unittest.mock import patch, MagicMock\n\n# Функция, которая делает HTTP запрос\ndef get_user_name(user_id: int) -> str:\n    import requests\n    response = requests.get(f"https://api.example.com/users/{user_id}")\n    return response.json()["name"]\n\n# Тест без реального HTTP запроса\ndef test_get_user_name():\n    mock_response = MagicMock()\n    mock_response.json.return_value = {"name": "Аня", "id": 1}\n\n    with patch("requests.get", return_value=mock_response):\n        name = get_user_name(1)\n        assert name == "Аня"' },
        { type: 'heading', value: 'Декоратор @patch' },
        { type: 'code', language: 'python', value: 'from unittest.mock import patch, MagicMock\nimport pytest\n\ndef save_user(user_data: dict) -> bool:\n    """Сохраняет пользователя в БД."""\n    import database  # внешняя зависимость\n    return database.save(user_data)\n\n@patch("database.save", return_value=True)\ndef test_save_user(mock_save):\n    result = save_user({"name": "Аня"})\n    assert result is True\n    # Проверяем что mock был вызван с нужными аргументами\n    mock_save.assert_called_once_with({"name": "Аня"})' },
        { type: 'note', value: 'patch() подменяет объект по строковому пути в том месте, где он используется, а не где определён. Важно указывать правильный путь.' }
      ]
    },
    {
      id: 6, title: 'conftest.py и организация тестов', type: 'theory',
      content: [
        { type: 'text', value: 'conftest.py — специальный файл pytest для общих фикстур и плагинов. Фикстуры в нём доступны всем тестам в директории без импорта.' },
        { type: 'heading', value: 'Структура проекта тестов' },
        { type: 'code', language: 'python', value: '# Структура:\n# myproject/\n#   src/\n#     calculator.py\n#   tests/\n#     conftest.py    <- общие фикстуры\n#     test_calc.py\n#     test_utils.py\n\n# tests/conftest.py\nimport pytest\n\n@pytest.fixture\ndef sample_data():\n    return {"users": ["Аня", "Боря"], "count": 2}\n\n@pytest.fixture(autouse=True)  # применяется ко всем тестам автоматически!\ndef reset_state():\n    yield  # до теста\n    # после теста — очистка\n\n# tests/test_calc.py\ndef test_something(sample_data):  # фикстура из conftest.py — без импорта!\n    assert sample_data["count"] == 2' },
        { type: 'heading', value: 'Маркировка и пропуск тестов' },
        { type: 'code', language: 'python', value: 'import pytest\nimport sys\n\n@pytest.mark.skip(reason="В разработке")\ndef test_new_feature():\n    pass\n\n@pytest.mark.skipif(sys.platform == "win32", reason="Только Linux")\ndef test_linux_only():\n    pass\n\n@pytest.mark.xfail(reason="Известный баг #123")\ndef test_known_bug():\n    assert False  # ожидаемый провал\n\n@pytest.mark.slow  # кастомная метка\ndef test_heavy_computation():\n    pass\n# pytest -m "not slow"  — пропустить медленные тесты' }
      ]
    },
    {
      id: 7, title: 'unittest — встроенный фреймворк', type: 'theory',
      content: [
        { type: 'text', value: 'unittest — встроенный в Python фреймворк тестирования. Он более многословный чем pytest, но не требует установки и широко используется в корпоративном коде.' },
        { type: 'heading', value: 'TestCase классы' },
        { type: 'code', language: 'python', value: 'import unittest\n\nclass Stack:\n    def __init__(self):\n        self._items = []\n    def push(self, item): self._items.append(item)\n    def pop(self): return self._items.pop()\n    def is_empty(self): return not self._items\n\nclass TestStack(unittest.TestCase):\n    def setUp(self):  # вызывается перед каждым тестом\n        self.stack = Stack()\n\n    def tearDown(self):  # вызывается после каждого теста\n        pass\n\n    def test_push(self):\n        self.stack.push(1)\n        self.assertFalse(self.stack.is_empty())\n\n    def test_pop(self):\n        self.stack.push(42)\n        self.assertEqual(self.stack.pop(), 42)\n\n    def test_pop_empty(self):\n        with self.assertRaises(IndexError):\n            self.stack.pop()\n\nif __name__ == "__main__":\n    unittest.main()' }
      ]
    },
    {
      id: 8, title: 'Практика: TDD — разработка через тесты', type: 'practice', difficulty: 'hard',
      description: 'Напиши класс Shopping Cart через TDD: сначала тесты, потом реализацию. Тесты должны покрывать все сценарии включая граничные случаи.',
      requirements: [
        'Класс ShoppingCart: add_item(name, price, qty=1), remove_item(name), total() -> float',
        'Тест: добавление товара увеличивает total',
        'Тест: удаление товара уменьшает total',
        'Тест: удаление несуществующего товара — KeyError',
        'Тест: total пустой корзины = 0.0',
        'Параметризованный тест для add_item с разными комбинациями',
        'Фикстура empty_cart и filled_cart'
      ],
      expectedOutput: 'test_total_empty PASSED\ntest_add_item PASSED\ntest_remove_item PASSED\ntest_remove_nonexistent PASSED\ntest_add_parametrized[laptop-1000-1] PASSED\ntest_add_parametrized[book-500-3] PASSED\n6 passed',
      hint: 'Корзина как dict: {name: {price, qty}}. total = sum(item["price"]*item["qty"] for item in cart.values()). pytest.raises(KeyError) для несуществующего товара.',
      solution: '# test_shopping_cart.py\nimport pytest\n\nclass ShoppingCart:\n    def __init__(self):\n        self._items = {}\n\n    def add_item(self, name: str, price: float, qty: int = 1):\n        if name in self._items:\n            self._items[name]["qty"] += qty\n        else:\n            self._items[name] = {"price": price, "qty": qty}\n\n    def remove_item(self, name: str):\n        if name not in self._items:\n            raise KeyError(f"Товар \'{name}\' не найден в корзине")\n        del self._items[name]\n\n    def total(self) -> float:\n        return sum(item["price"] * item["qty"] for item in self._items.values())\n\n# === ТЕСТЫ ===\n\n@pytest.fixture\ndef empty_cart():\n    return ShoppingCart()\n\n@pytest.fixture\ndef filled_cart():\n    cart = ShoppingCart()\n    cart.add_item("Ноутбук", 50000)\n    cart.add_item("Мышь", 800, qty=2)\n    return cart\n\ndef test_total_empty(empty_cart):\n    assert empty_cart.total() == 0.0\n\ndef test_add_item(empty_cart):\n    empty_cart.add_item("Книга", 500)\n    assert empty_cart.total() == 500.0\n\ndef test_remove_item(filled_cart):\n    before = filled_cart.total()\n    filled_cart.remove_item("Мышь")\n    assert filled_cart.total() == before - 1600\n\ndef test_remove_nonexistent(empty_cart):\n    with pytest.raises(KeyError, match="не найден"):\n        empty_cart.remove_item("Несуществующий")\n\n@pytest.mark.parametrize("name, price, qty, expected_total", [\n    ("laptop", 1000, 1, 1000),\n    ("book", 500, 3, 1500),\n    ("pen", 50, 10, 500),\n])\ndef test_add_parametrized(empty_cart, name, price, qty, expected_total):\n    empty_cart.add_item(name, price, qty)\n    assert empty_cart.total() == expected_total',
      explanation: 'TDD: сначала написали тесты (они падают), затем минимальную реализацию (тесты проходят). Фикстуры устраняют дублирование setup. Параметризация проверяет множество сценариев одним тестом. pytest.raises проверяет что исключение действительно бросается.'
    }
  ]
}
