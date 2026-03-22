export default {
  id: 36,
  title: 'os, sys, pathlib',
  description: 'Изучим инструменты для работы с операционной системой: модули os, sys и современный объектно-ориентированный pathlib',
  lessons: [
    {
      id: 1, title: 'Модуль os — взаимодействие с ОС', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль os предоставляет функции для работы с файловой системой, переменными среды и процессами. Это кросс-платформенный способ взаимодействия с ОС.' },
        { type: 'heading', value: 'Работа с директориями' },
        { type: 'code', language: 'python', value: 'import os\n\n# Текущая директория\nprint(os.getcwd())  # /home/user/project\n\n# Изменить директорию\nos.chdir("/tmp")\nprint(os.getcwd())  # /tmp\n\n# Создать директории\nos.mkdir("new_dir")          # одна директория\nos.makedirs("a/b/c", exist_ok=True)  # все уровни сразу\n\n# Список файлов\nfor item in os.listdir("."):\n    print(item)\n\n# Удалить\nos.remove("file.txt")     # удалить файл\nos.rmdir("empty_dir")     # удалить пустую директорию\n\n# Переименовать/переместить\nos.rename("old.txt", "new.txt")' },
        { type: 'heading', value: 'Переменные среды' },
        { type: 'code', language: 'python', value: 'import os\n\n# Получить переменную среды\nhome = os.getenv("HOME", "/default/path")\npath = os.environ.get("PATH", "")\n\n# Установить переменную среды\nos.environ["MY_VAR"] = "my_value"\n\n# Все переменные\nfor key, value in os.environ.items():\n    if "PYTHON" in key:\n        print(f"{key}={value}")' },
        { type: 'tip', value: 'os.getenv() vs os.environ[]: getenv безопаснее — возвращает None (или default) если переменная не существует. environ[] выбросит KeyError.' }
      ]
    },
    {
      id: 2, title: 'os.path — работа с путями', type: 'theory',
      content: [
        { type: 'text', value: 'os.path предоставляет функции для манипуляций с путями к файлам. Они автоматически учитывают особенности ОС (разделители / и \\).' },
        { type: 'heading', value: 'Основные функции os.path' },
        { type: 'code', language: 'python', value: 'import os\nimport os.path\n\npath = "/home/user/documents/report.pdf"\n\nprint(os.path.basename(path))  # report.pdf\nprint(os.path.dirname(path))   # /home/user/documents\nprint(os.path.split(path))     # ("/home/user/documents", "report.pdf")\nprint(os.path.splitext(path))  # ("/home/user/documents/report", ".pdf")\n\n# Объединение путей\nnew_path = os.path.join("/home", "user", "docs", "file.txt")\nprint(new_path)  # /home/user/docs/file.txt (кросс-платформенно!)\n\n# Проверки\nprint(os.path.exists(path))   # существует ли\nprint(os.path.isfile(path))   # это файл?\nprint(os.path.isdir(path))    # это директория?\nprint(os.path.getsize(path))  # размер в байтах' },
        { type: 'heading', value: 'os.walk — обход дерева директорий' },
        { type: 'code', language: 'python', value: 'import os\n\n# Рекурсивный обход всех файлов\nfor root, dirs, files in os.walk("."):\n    level = root.count(os.sep)\n    indent = "  " * level\n    print(f"{indent}{os.path.basename(root)}/")\n    for file in files:\n        print(f"{indent}  {file}")' }
      ]
    },
    {
      id: 3, title: 'Модуль sys', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль sys предоставляет доступ к параметрам Python-интерпретатора: аргументы командной строки, пути поиска модулей, стандартные потоки ввода/вывода.' },
        { type: 'heading', value: 'Аргументы командной строки и пути' },
        { type: 'code', language: 'python', value: 'import sys\n\n# Аргументы командной строки\n# python script.py arg1 arg2 --verbose\nprint(sys.argv)       # ["script.py", "arg1", "arg2", "--verbose"]\nprint(sys.argv[0])    # script.py (имя скрипта)\n\n# Версия Python\nprint(sys.version)    # 3.12.0 (main, ...\nprint(sys.version_info.major)  # 3\nprint(sys.version_info.minor)  # 12\n\n# Пути поиска модулей\nprint(sys.path)       # список директорий для import\nsys.path.append("/custom/modules")  # добавить путь\n\n# Платформа\nprint(sys.platform)   # "linux", "win32", "darwin"' },
        { type: 'heading', value: 'stdout, stderr и exit' },
        { type: 'code', language: 'python', value: 'import sys\n\n# Запись в стандартные потоки\nsys.stdout.write("Это stdout\\n")\nsys.stderr.write("Это ошибка\\n")\n\n# Завершение программы\nif len(sys.argv) < 2:\n    print("Ошибка: нужен аргумент", file=sys.stderr)\n    sys.exit(1)  # код ошибки (0 = успех, ненулевой = ошибка)\n\nprint(f"Аргумент: {sys.argv[1]}")' },
        { type: 'note', value: 'sys.exit() вызывает SystemExit. Можно поймать через except SystemExit. В скриптах код выхода важен для скриптов оболочки: 0 = успех.' }
      ]
    },
    {
      id: 4, title: 'pathlib — объектно-ориентированные пути', type: 'theory',
      content: [
        { type: 'text', value: 'pathlib (Python 3.4+) — современная замена os.path. Путь — это объект с методами, а не строка с функциями. Код получается чище и читаемее.' },
        { type: 'heading', value: 'Path — основной класс' },
        { type: 'code', language: 'python', value: 'from pathlib import Path\n\n# Создание пути\np = Path("/home/user/documents/report.pdf")\ncwd = Path(".")  # текущая директория\nhome = Path.home()  # домашняя директория\n\n# Свойства\nprint(p.name)      # report.pdf\nprint(p.stem)      # report\nprint(p.suffix)    # .pdf\nprint(p.parent)    # /home/user/documents\nprint(p.parts)     # ("/", "home", "user", "documents", "report.pdf")\n\n# Объединение через /\nnew_path = Path.home() / "docs" / "file.txt"\nprint(new_path)  # /home/user/docs/file.txt\n\n# Проверки\nprint(p.exists())     # существует?\nprint(p.is_file())    # файл?\nprint(p.is_dir())     # директория?' },
        { type: 'heading', value: 'Работа с файлами через Path' },
        { type: 'code', language: 'python', value: 'from pathlib import Path\n\np = Path("example.txt")\n\n# Запись\np.write_text("Привет, pathlib!", encoding="utf-8")\n\n# Чтение\ncontent = p.read_text(encoding="utf-8")\nprint(content)  # Привет, pathlib!\n\n# Бинарный режим\nbytes_path = Path("data.bin")\nbytes_path.write_bytes(b"\\x00\\x01\\x02")\ndata = bytes_path.read_bytes()\n\n# Создание директорий\nPath("a/b/c").mkdir(parents=True, exist_ok=True)\n\n# Удаление\np.unlink()  # удалить файл' }
      ]
    },
    {
      id: 5, title: 'pathlib: поиск файлов и glob', type: 'theory',
      content: [
        { type: 'text', value: 'pathlib поддерживает поиск файлов по шаблону (glob) и рекурсивный обход директорий через rglob. Это заменяет os.walk для большинства задач.' },
        { type: 'heading', value: 'glob и rglob' },
        { type: 'code', language: 'python', value: 'from pathlib import Path\n\nproject = Path(".")\n\n# Все Python файлы в текущей директории\nfor py_file in project.glob("*.py"):\n    print(py_file)\n\n# Рекурсивно все Python файлы\nfor py_file in project.rglob("*.py"):\n    print(py_file)\n\n# Подсчёт размера директории\ntotal_size = sum(\n    f.stat().st_size\n    for f in project.rglob("*")\n    if f.is_file()\n)\nprint(f"Размер: {total_size / 1024:.1f} КБ")' },
        { type: 'heading', value: 'iterdir и stat' },
        { type: 'code', language: 'python', value: 'from pathlib import Path\nimport datetime\n\np = Path(".")\n\nfor item in p.iterdir():\n    if item.is_file():\n        stat = item.stat()\n        size = stat.st_size\n        mtime = datetime.datetime.fromtimestamp(stat.st_mtime)\n        print(f"{item.name:30} {size:8} байт  {mtime:%Y-%m-%d}")' },
        { type: 'tip', value: 'pathlib — современный стандарт. Используй его везде где раньше использовал os.path. Операция / для объединения путей — это не деление, а перегрузка оператора!' }
      ]
    },
    {
      id: 6, title: 'shutil — высокоуровневые файловые операции', type: 'theory',
      content: [
        { type: 'text', value: 'Модуль shutil дополняет os: копирование файлов и директорий, перемещение, архивация. Он работает с pathlib и строками.' },
        { type: 'heading', value: 'Копирование и перемещение' },
        { type: 'code', language: 'python', value: 'import shutil\nfrom pathlib import Path\n\nsrc = Path("source.txt")\ndst = Path("backup/source_copy.txt")\ndst.parent.mkdir(parents=True, exist_ok=True)\n\n# Копирование файла\nshutil.copy2(src, dst)        # копирует с метаданными\nshutil.copy(src, dst)         # только содержимое\n\n# Копирование директории\nshutil.copytree("src_dir", "dst_dir", dirs_exist_ok=True)\n\n# Перемещение\nshutil.move("old_name.txt", "new_name.txt")\n\n# Удаление директории со всем содержимым\nshutil.rmtree("temp_dir", ignore_errors=True)\n\n# Информация о диске\ntotal, used, free = shutil.disk_usage("/")\nprint(f"Свободно: {free // (1024**3)} ГБ")' }
      ]
    },
    {
      id: 7, title: 'Практика: Органайзер файлов', type: 'practice', difficulty: 'medium',
      description: 'Создай скрипт-органайзер файлов, который сортирует файлы по расширению в папки.',
      requirements: [
        'Создай временную директорию с тестовыми файлами разных расширений',
        'Используй pathlib для работы с путями',
        'Функция organize(source_dir) сортирует файлы: .py -> python/, .txt -> docs/, .jpg/.png -> images/, остальные -> other/',
        'Используй shutil.move для перемещения',
        'Выведи количество файлов в каждой папке',
        'Не трогай поддиректории, только файлы'
      ],
      expectedOutput: 'Создано тестовых файлов: 8\nОрганизовано:\n  python: 3 файла\n  docs: 2 файла\n  images: 2 файла\n  other: 1 файл',
      hint: 'file.suffix даёт расширение типа ".py". Словарь CATEGORIES = {".py": "python", ".txt": "docs", ...} упростит код.',
      solution: 'import shutil\nfrom pathlib import Path\n\ndef create_test_files(base_dir: Path):\n    """Создаёт тестовые файлы."""\n    base_dir.mkdir(exist_ok=True)\n    files = [\n        "script1.py", "script2.py", "module.py",\n        "readme.txt", "notes.txt",\n        "photo.jpg", "logo.png",\n        "archive.zip"\n    ]\n    for name in files:\n        (base_dir / name).write_text(f"content of {name}")\n    return len(files)\n\ndef organize(source_dir: Path):\n    CATEGORIES = {\n        ".py":  "python",\n        ".txt": "docs",\n        ".md":  "docs",\n        ".jpg": "images",\n        ".png": "images",\n        ".gif": "images",\n    }\n\n    counts = {}\n\n    for file in source_dir.iterdir():\n        if not file.is_file():\n            continue\n\n        category = CATEGORIES.get(file.suffix, "other")\n        dest_dir = source_dir / category\n        dest_dir.mkdir(exist_ok=True)\n\n        shutil.move(str(file), str(dest_dir / file.name))\n        counts[category] = counts.get(category, 0) + 1\n\n    return counts\n\ntest_dir = Path("test_organizer")\ncount = create_test_files(test_dir)\nprint(f"Создано тестовых файлов: {count}")\n\ncounts = organize(test_dir)\nprint("Организовано:")\nfor category, n in sorted(counts.items()):\n    print(f"  {category}: {n} файла")\n\n# Уборка\nshutil.rmtree(test_dir)',
      explanation: 'pathlib делает код выразительным: file.suffix, file.is_file(), dir.mkdir(). Словарь CATEGORIES устраняет цепочку if/elif. shutil.move работает с обоими форматами путей. iterdir() обходит только первый уровень директории.'
    }
  ]
}
