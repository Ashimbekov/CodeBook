export default {
  id: 53,
  title: 'Структура проекта',
  description: 'Организация Python проектов: директории, pyproject.toml, виртуальные среды, пакеты',
  lessons: [
    {
      id: 1,
      title: 'Стандартная структура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная структура проекта облегчает навигацию, тестирование и публикацию. Современный стандарт: src layout с pyproject.toml.' },
        { type: 'code', language: 'python', value: '# Современная структура Python проекта (src layout):\n#\n# myproject/                   <- корень репозитория\n# |-- src/\n# |   |-- myproject/           <- пакет приложения\n# |       |-- __init__.py\n# |       |-- main.py\n# |       |-- models/\n# |       |   |-- __init__.py\n# |       |   |-- user.py\n# |       |   |-- product.py\n# |       |-- services/\n# |       |   |-- __init__.py\n# |       |   |-- auth.py\n# |       |   |-- payment.py\n# |       |-- utils/\n# |           |-- __init__.py\n# |           |-- helpers.py\n# |-- tests/\n# |   |-- __init__.py\n# |   |-- test_models.py\n# |   |-- test_services.py\n# |   |-- conftest.py          <- pytest fixtures\n# |-- docs/\n# |-- scripts/\n# |-- .env.example\n# |-- .gitignore\n# |-- pyproject.toml           <- всё в одном файле\n# |-- README.md\n#\n# Преимущества src layout:\n# - Избегает случайного импорта не установленного пакета\n# - Чётко разделяет код и конфиг\n# - Стандарт для публикации на PyPI\n\nprint("Структура — это архитектура файловой системы")' }
      ]
    },
    {
      id: 2,
      title: 'pyproject.toml: современная конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'pyproject.toml — единый файл конфигурации для всего проекта. Заменяет setup.py, setup.cfg, requirements.txt для простых проектов.' },
        { type: 'code', language: 'python', value: '# pyproject.toml\n\n# [build-system] — система сборки\n# [build-system]\n# requires = ["hatchling"]\n# build-backend = "hatchling.build"\n\n# [project] — метаданные проекта\n# [project]\n# name = "myproject"\n# version = "0.1.0"\n# description = "Описание проекта"\n# authors = [{name = "Иван Иванов", email = "ivan@example.com"}]\n# readme = "README.md"\n# license = {file = "LICENSE"}\n# requires-python = ">=3.11"\n# dependencies = [\n#     "requests>=2.28",\n#     "pandas>=2.0",\n#     "numpy>=1.24",\n# ]\n\n# [project.optional-dependencies]\n# dev = [\n#     "pytest>=7.0",\n#     "black>=23.0",\n#     "flake8>=6.0",\n#     "isort>=5.0",\n#     "mypy>=1.0",\n# ]\n\n# [tool.black]\n# line-length = 88\n# target-version = ["py311"]\n\n# [tool.isort]\n# profile = "black"\n\n# [tool.pytest.ini_options]\n# testpaths = ["tests"]\n# python_files = ["test_*.py"]\n\n# [tool.mypy]\n# python_version = "3.11"\n# strict = true\n\n# Установка зависимостей\n# pip install -e .           # установить проект в режиме разработки\n# pip install -e ".[dev]"   # с dev-зависимостями\n\nprint("pyproject.toml — один файл для всего")' },
        { type: 'tip', value: 'Используй pip install -e . (editable install) при разработке. Изменения в коде отражаются сразу без переустановки пакета.' }
      ]
    },
    {
      id: 3,
      title: 'Виртуальные среды и зависимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуальная среда изолирует зависимости проекта. Каждый проект имеет свои версии пакетов независимо от других.' },
        { type: 'code', language: 'python', value: '# venv — встроенный инструмент\n# python -m venv .venv              # создать среду\n# source .venv/bin/activate         # активировать (Linux/Mac)\n# .venv\\Scripts\\activate            # активировать (Windows)\n# deactivate                        # деактивировать\n\n# pip управление пакетами\n# pip install package               # установить\n# pip install package==1.2.3        # конкретная версия\n# pip install "package>=1.0,<2.0"   # диапазон версий\n# pip install -r requirements.txt   # из файла\n# pip uninstall package             # удалить\n# pip list                          # список установленных\n# pip freeze > requirements.txt     # сохранить текущие версии\n\n# requirements.txt (простой вариант):\n# requests==2.31.0\n# pandas==2.1.0\n# numpy==1.25.0\n\n# requirements-dev.txt (для разработки):\n# -r requirements.txt\n# pytest==7.4.0\n# black==23.9.0\n\n# uv — современный быстрый менеджер (рекомендуется)\n# pip install uv\n# uv venv                           # создать среду\n# uv pip install -r requirements.txt\n# uv pip compile requirements.in    # заморозить версии\n\n# poetry — популярная альтернатива\n# poetry new myproject               # создать проект\n# poetry add requests                # добавить зависимость\n# poetry add --group dev pytest      # dev зависимость\n# poetry install                    # установить все\n# poetry run python main.py         # запустить в среде\n# poetry.lock — зафиксированные версии (коммитить в git)' }
      ]
    },
    {
      id: 4,
      title: '__init__.py и пакеты',
      type: 'theory',
      content: [
        { type: 'text', value: '__init__.py делает директорию пакетом Python. Управляет что экспортируется наружу и задаёт удобные псевдонимы.' },
        { type: 'code', language: 'python', value: '# src/myproject/__init__.py\n# Версия пакета\n__version__ = "0.1.0"\n__author__ = "Иван Иванов"\n\n# Реэкспорт для удобного импорта\nfrom myproject.models.user import User\nfrom myproject.models.product import Product\nfrom myproject.services.auth import AuthService\n\n# __all__ — явно объявляет публичный API\n__all__ = ["User", "Product", "AuthService"]\n\n# Теперь можно делать:\n# from myproject import User  # вместо from myproject.models.user import User\n\n# src/myproject/models/__init__.py\nfrom .user import User\nfrom .product import Product\n\n__all__ = ["User", "Product"]\n\n# src/myproject/models/user.py\nclass User:\n    def __init__(self, name: str, email: str):\n        self.name = name\n        self.email = email\n\n    def __repr__(self) -> str:\n        return f"User(name={self.name!r}, email={self.email!r})"\n\n# Абсолютные vs относительные импорты\n# src/myproject/services/auth.py\nfrom myproject.models import User  # абсолютный (рекомендуется)\nfrom ..models import User           # относительный (тоже работает)\nfrom ..models.user import User      # более явный' }
      ]
    },
    {
      id: 5,
      title: '.gitignore и .env',
      type: 'theory',
      content: [
        { type: 'text', value: '.gitignore исключает временные файлы и секреты из git. .env хранит конфиденциальные настройки. python-dotenv загружает их автоматически.' },
        { type: 'code', language: 'python', value: '# .gitignore для Python проекта:\n# __pycache__/\n# *.py[cod]\n# *$py.class\n# .venv/\n# .env\n# .env.local\n# *.egg-info/\n# dist/\n# build/\n# .pytest_cache/\n# .mypy_cache/\n# .coverage\n# htmlcov/\n# *.log\n# .DS_Store       (macOS)\n# Thumbs.db       (Windows)\n\n# .env — секреты и настройки окружения\n# DATABASE_URL=postgresql://user:password@localhost/mydb\n# SECRET_KEY=your-very-secret-key-here\n# API_KEY=sk-1234567890\n# DEBUG=True\n# ALLOWED_HOSTS=localhost,127.0.0.1\n\n# .env.example — шаблон без реальных значений (коммитить в git!)\n# DATABASE_URL=postgresql://user:password@localhost/mydb\n# SECRET_KEY=change-me\n# API_KEY=your-api-key\n# DEBUG=False\n\n# Использование в Python\nimport os\nfrom pathlib import Path\nfrom dotenv import load_dotenv  # pip install python-dotenv\n\n# Загрузить .env из текущей директории\nload_dotenv()\n\n# Или явно указать путь\nBASE_DIR = Path(__file__).parent.parent\nload_dotenv(BASE_DIR / ".env")\n\n# Читать переменные\nDATABASE_URL = os.getenv("DATABASE_URL")\nSECRET_KEY = os.environ["SECRET_KEY"]  # KeyError если не задано\nDEBUG = os.getenv("DEBUG", "False").lower() == "true"\n\nif not DATABASE_URL:\n    raise RuntimeError("DATABASE_URL не задан в .env")' },
        { type: 'warning', value: 'НИКОГДА не коммить .env с реальными секретами. Всегда добавляй .env в .gitignore. Используй .env.example как шаблон для команды.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание структуры проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай правильную структуру Python проекта с пакетами и конфигурацией.',
      requirements: [
        'Создай структуру: src/calculator/__init__.py, operations.py, utils.py',
        'В operations.py: функции add, subtract, multiply, divide с type hints',
        'В utils.py: функция format_result(result, decimals=2) -> str',
        'В __init__.py: реэкспорт всех операций и __version__ = "1.0.0"',
        'Создай tests/test_operations.py с тестами для всех операций',
        'Создай pyproject.toml с метаданными проекта'
      ],
      expectedOutput: 'Структура:\nsrc/calculator/__init__.py\nsrc/calculator/operations.py\nsrc/calculator/utils.py\ntests/test_operations.py\npyproject.toml\n\nИмпорт работает:\nfrom calculator import add\nprint(add(2, 3))  # 5',
      hint: 'Для divide добавь проверку деления на ноль с raise ZeroDivisionError. В __init__.py: from .operations import add, subtract, multiply, divide.',
      solution: '# src/calculator/operations.py\ndef add(a: float, b: float) -> float:\n    """Складывает два числа."""\n    return a + b\n\ndef subtract(a: float, b: float) -> float:\n    """Вычитает b из a."""\n    return a - b\n\ndef multiply(a: float, b: float) -> float:\n    """Умножает два числа."""\n    return a * b\n\ndef divide(a: float, b: float) -> float:\n    """Делит a на b.\n\n    Raises:\n        ZeroDivisionError: Если b равно нулю.\n    """\n    if b == 0:\n        raise ZeroDivisionError("Деление на ноль недопустимо")\n    return a / b\n\n\n# src/calculator/utils.py\ndef format_result(result: float, decimals: int = 2) -> str:\n    """Форматирует числовой результат.\n\n    Args:\n        result: Число для форматирования.\n        decimals: Количество знаков после запятой.\n\n    Returns:\n        Строка с форматированным числом.\n    """\n    return f"{result:.{decimals}f}"\n\n\n# src/calculator/__init__.py\n__version__ = "1.0.0"\n\nfrom .operations import add, subtract, multiply, divide\nfrom .utils import format_result\n\n__all__ = ["add", "subtract", "multiply", "divide", "format_result"]\n\n\n# tests/test_operations.py\nimport pytest\nfrom calculator import add, subtract, multiply, divide\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0\n    assert add(0.1, 0.2) == pytest.approx(0.3)\n\ndef test_subtract():\n    assert subtract(10, 3) == 7\n    assert subtract(5, 10) == -5\n\ndef test_multiply():\n    assert multiply(3, 4) == 12\n    assert multiply(-2, 5) == -10\n\ndef test_divide():\n    assert divide(10, 2) == 5.0\n    assert divide(7, 2) == 3.5\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        divide(10, 0)',
      explanation: 'Точечный импорт (from .operations import) — относительный импорт внутри пакета. __all__ явно объявляет публичный API. pytest.approx для сравнения float. pytest.raises проверяет что исключение выбрасывается.'
    }
  ]
}
