export default {
  id: 42,
  title: 'Virtual environments и pip',
  description: 'Изучим управление зависимостями Python: создание виртуальных окружений через venv, установку пакетов через pip и работу с requirements.txt',
  lessons: [
    {
      id: 1, title: 'Проблема глобальных зависимостей', type: 'theory',
      content: [
        { type: 'text', value: 'Без виртуальных окружений все пакеты устанавливаются глобально. Проект A требует requests 2.0, проект B — requests 3.0. Конфликт! Виртуальное окружение изолирует зависимости каждого проекта.' },
        { type: 'heading', value: 'Структура Python без и с venv' },
        { type: 'code', language: 'python', value: '# БЕЗ виртуального окружения:\n# Все проекты используют ОДНИ пакеты\n# /usr/lib/python3.12/site-packages/\n#   requests==2.28.0  <- все проекты используют это\n#   django==3.2.0\n\n# С ВИРТУАЛЬНЫМ ОКРУЖЕНИЕМ:\n# project_a/\n#   venv/\n#     lib/python3.12/site-packages/\n#       requests==2.28.0  <- только для project_a\n#       flask==2.3.0\n\n# project_b/\n#   venv/\n#     lib/python3.12/site-packages/\n#       requests==3.0.0  <- только для project_b\n#       django==4.2.0' },
        { type: 'tip', value: 'Золотое правило: каждый Python-проект — в отдельном виртуальном окружении. Никогда не используй pip install без активированного venv.' }
      ]
    },
    {
      id: 2, title: 'venv — создание и активация', type: 'theory',
      content: [
        { type: 'text', value: 'venv — встроенный инструмент Python для создания виртуальных окружений. Создаёт изолированную копию Python с собственным pip.' },
        { type: 'heading', value: 'Команды venv' },
        { type: 'code', language: 'python', value: '# Создание виртуального окружения\n# python -m venv venv          (имя папки — venv по соглашению)\n# python -m venv .venv         (скрытая папка)\n# python3.11 -m venv venv      (конкретная версия Python)\n\n# Активация (запускаются в терминале, не в Python!)\n# Linux/macOS:\n# source venv/bin/activate\n#\n# Windows CMD:\n# venv\\Scripts\\activate.bat\n#\n# Windows PowerShell:\n# venv\\Scripts\\Activate.ps1\n\n# После активации в командной строке появится (venv)\n# (venv) $ python --version\n# (venv) $ pip list\n\n# Деактивация\n# deactivate' },
        { type: 'heading', value: 'Что находится внутри venv' },
        { type: 'code', language: 'python', value: '# venv/\n#   bin/         (или Scripts/ на Windows)\n#     python     <- ссылка на интерпретатор\n#     pip        <- изолированный pip\n#     activate   <- скрипт активации\n#   lib/\n#     python3.12/\n#       site-packages/  <- сюда устанавливаются пакеты\n#   pyvenv.cfg  <- конфигурация\n\n# Проверить что используем нужный Python:\nimport sys\nprint(sys.executable)\n# /path/to/project/venv/bin/python  <- внутри venv' },
        { type: 'note', value: 'Папку venv/.venv никогда не добавляй в git! Добавь её в .gitignore. Для воспроизведения окружения используй requirements.txt.' }
      ]
    },
    {
      id: 3, title: 'pip — установка пакетов', type: 'theory',
      content: [
        { type: 'text', value: 'pip — менеджер пакетов Python. Устанавливает пакеты из PyPI (Python Package Index) — крупнейшего репозитория Python-пакетов с более чем 500 000 проектов.' },
        { type: 'heading', value: 'Основные команды pip' },
        { type: 'code', language: 'python', value: '# Установка пакета\n# pip install requests\n# pip install requests==2.28.0      (конкретная версия)\n# pip install "requests>=2.0,<3.0"  (диапазон версий)\n# pip install requests flask django  (несколько сразу)\n\n# Обновление\n# pip install --upgrade requests\n# pip install -U requests  (короткий флаг)\n\n# Удаление\n# pip uninstall requests\n# pip uninstall requests flask  (несколько)\n\n# Список установленных\n# pip list\n# pip show requests  (подробно о пакете)\n\n# Поиск\n# pip search requests  (устарело в новых версиях)' },
        { type: 'heading', value: 'Информация о пакете' },
        { type: 'code', language: 'python', value: '# pip show requests выведет:\n# Name: requests\n# Version: 2.31.0\n# Summary: Python HTTP for Humans.\n# Home-page: https://requests.readthedocs.io\n# Author: Kenneth Reitz\n# License: Apache 2.0\n# Location: /venv/lib/python3.12/site-packages\n# Requires: certifi, charset-normalizer, idna, urllib3\n# Required-by: ...\n\n# Устаревшие пакеты\n# pip list --outdated' },
        { type: 'tip', value: 'pip install -e . устанавливает пакет в "режиме разработки" — изменения в коде сразу видны без переустановки. Используется при разработке своих пакетов.' }
      ]
    },
    {
      id: 4, title: 'requirements.txt — фиксация зависимостей', type: 'theory',
      content: [
        { type: 'text', value: 'requirements.txt — файл со списком зависимостей проекта. Позволяет воспроизвести точно такое же окружение на другой машине или в CI/CD.' },
        { type: 'heading', value: 'Создание и использование requirements.txt' },
        { type: 'code', language: 'python', value: '# Создать requirements.txt из текущего окружения\n# pip freeze > requirements.txt\n\n# Содержимое requirements.txt:\n# certifi==2024.2.2\n# charset-normalizer==3.3.2\n# idna==3.6\n# requests==2.31.0\n# urllib3==2.2.1\n\n# Установить все зависимости из файла\n# pip install -r requirements.txt\n\n# Это позволяет воспроизвести окружение:\n# git clone project\n# python -m venv venv\n# source venv/bin/activate\n# pip install -r requirements.txt' },
        { type: 'heading', value: 'Разделение зависимостей' },
        { type: 'code', language: 'python', value: '# requirements.txt — основные зависимости\n# requests==2.31.0\n# flask==3.0.0\n\n# requirements-dev.txt — для разработки\n# -r requirements.txt   <- включает основные\n# pytest==8.0.0\n# black==24.1.1\n# mypy==1.8.0\n\n# Установка для разработки:\n# pip install -r requirements-dev.txt\n\n# Установка только для продакшна:\n# pip install -r requirements.txt' },
        { type: 'note', value: 'pip freeze включает ВСЕ пакеты (включая транзитивные зависимости). Иногда лучше вручную указывать только прямые зависимости без жёстких версий.' }
      ]
    },
    {
      id: 5, title: 'pyproject.toml и современные инструменты', type: 'theory',
      content: [
        { type: 'text', value: 'pyproject.toml — современный стандарт конфигурации Python-проектов. Poetry, PDM и uv — современные альтернативы venv+pip с управлением зависимостями.' },
        { type: 'heading', value: 'pyproject.toml — современная конфигурация' },
        { type: 'code', language: 'python', value: '# pyproject.toml\n# [build-system]\n# requires = ["setuptools>=68", "wheel"]\n# build-backend = "setuptools.backends.legacy:build"\n#\n# [project]\n# name = "my-awesome-project"\n# version = "1.0.0"\n# description = "Описание проекта"\n# authors = [{name = "Аня", email = "anya@mail.ru"}]\n# requires-python = ">=3.11"\n# dependencies = [\n#     "requests>=2.28",\n#     "flask>=3.0",\n# ]\n#\n# [project.optional-dependencies]\n# dev = [\n#     "pytest>=8.0",\n#     "mypy>=1.8",\n# ]' },
        { type: 'heading', value: 'Быстрый старт с uv' },
        { type: 'code', language: 'python', value: '# uv — ультрабыстрый менеджер пакетов (Rust)\n# pip install uv  или  curl -LsSf https://astral.sh/uv/install.sh | sh\n\n# Создать проект\n# uv init my-project\n# cd my-project\n\n# Добавить зависимость (создаёт venv автоматически)\n# uv add requests\n# uv add --dev pytest\n\n# Запустить скрипт\n# uv run python script.py\n\n# Синхронизировать зависимости\n# uv sync\n\n# В 10-100 раз быстрее pip!' },
        { type: 'tip', value: 'Для новых проектов в 2024+ рекомендую uv. Для существующих проектов — стандартный venv + pip отлично работает.' }
      ]
    },
    {
      id: 6, title: 'Практика: Настройка проекта с нуля', type: 'practice', difficulty: 'easy',
      description: 'Создай полноценный Python-проект с виртуальным окружением, зависимостями и структурой.',
      requirements: [
        'Создай папку проекта my_project/',
        'Инициализируй venv и создай .gitignore с исключением venv/',
        'Создай requirements.txt с: requests>=2.28, python-dateutil>=2.8',
        'Создай requirements-dev.txt включающий requirements.txt + pytest>=8.0',
        'Напиши скрипт setup_check.py проверяющий что все пакеты установлены',
        'Выведи версии всех установленных пакетов'
      ],
      expectedOutput: 'Проверка зависимостей:\n  requests: 2.31.0 OK\n  dateutil: 2.8.2 OK\nВсе зависимости установлены!\nPython: 3.12.0\nПуть к интерпретатору: /project/venv/bin/python',
      hint: 'importlib.metadata.version("requests") возвращает версию. sys.executable — путь к интерпретатору. Оберни в try/except ImportError для отсутствующих пакетов.',
      solution: '# setup_check.py\nimport sys\n\ndef check_dependencies():\n    dependencies = [\n        ("requests", "requests"),\n        ("python-dateutil", "dateutil"),\n    ]\n\n    print("Проверка зависимостей:")\n    all_ok = True\n\n    for package_name, import_name in dependencies:\n        try:\n            import importlib.metadata\n            version = importlib.metadata.version(package_name)\n            print(f"  {import_name}: {version} OK")\n        except importlib.metadata.PackageNotFoundError:\n            print(f"  {import_name}: НЕ УСТАНОВЛЕН")\n            all_ok = False\n\n    if all_ok:\n        print("Все зависимости установлены!")\n    else:\n        print("Выполните: pip install -r requirements.txt")\n        sys.exit(1)\n\n    print(f"Python: {sys.version.split()[0]}")\n    print(f"Путь к интерпретатору: {sys.executable}")\n\nif __name__ == "__main__":\n    check_dependencies()\n\n# .gitignore содержит:\n# venv/\n# .venv/\n# __pycache__/\n# *.pyc\n# .env\n# *.egg-info/\n\n# requirements.txt:\n# requests>=2.28\n# python-dateutil>=2.8\n\n# requirements-dev.txt:\n# -r requirements.txt\n# pytest>=8.0',
      explanation: 'importlib.metadata.version() — стандартный способ получить версию установленного пакета. sys.executable показывает путь к текущему интерпретатору — если он внутри venv/, значит окружение активировано. Разделение requirements на основные и dev — хорошая практика для CI/CD.'
    }
  ]
}
