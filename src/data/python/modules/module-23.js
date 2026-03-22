export default {
  id: 23,
  title: 'Контекстные менеджеры (with)',
  description: 'Изучим протокол __enter__/__exit__, создание собственных контекстных менеджеров и использование библиотеки contextlib',
  lessons: [
    {
      id: 1, title: 'Оператор with и зачем он нужен', type: 'theory',
      content: [
        { type: 'text', value: 'Контекстный менеджер — это объект, который автоматически выполняет код при входе в блок with и при выходе из него. Самый частый пример — открытие файлов: что бы ни случилось, файл будет закрыт.' },
        { type: 'tip', value: 'Представь контекстный менеджер как аренду велосипеда. Ты берёшь велосипед (enter), едешь (тело блока), и автоматически возвращаешь его (exit) — даже если ты упал.' },
        { type: 'heading', value: 'Старый способ vs оператор with' },
        { type: 'code', language: 'python', value: '# Старый способ — нужно помнить закрыть файл\nf = open("data.txt", "w")\ntry:\n    f.write("Привет")\nfinally:\n    f.close()  # не забыть!\n\n# С оператором with — файл закрывается автоматически\nwith open("data.txt", "w") as f:\n    f.write("Привет")\n# f.close() вызывается сам по себе здесь' },
        { type: 'heading', value: 'Несколько ресурсов в одном with' },
        { type: 'code', language: 'python', value: '# Открыть два файла одновременно\nwith open("input.txt", "r") as src, open("output.txt", "w") as dst:\n    for line in src:\n        dst.write(line.upper())\n# Оба файла закроются автоматически' },
        { type: 'note', value: 'Оператор with работает с любым объектом, у которого есть методы __enter__ и __exit__. Это и есть протокол контекстного менеджера.' }
      ]
    },
    {
      id: 2, title: 'Методы __enter__ и __exit__', type: 'theory',
      content: [
        { type: 'text', value: 'Протокол контекстного менеджера состоит из двух методов: __enter__ вызывается при входе в блок with и возвращает объект для as-переменной, __exit__ вызывается при выходе — даже если было исключение.' },
        { type: 'heading', value: 'Создание простого контекстного менеджера' },
        { type: 'code', language: 'python', value: 'class Timer:\n    import time\n\n    def __enter__(self):\n        import time\n        self.start = time.time()\n        print("Таймер запущен")\n        return self  # это попадёт в as-переменную\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        import time\n        elapsed = time.time() - self.start\n        print(f"Прошло {elapsed:.3f} секунд")\n        return False  # не подавлять исключения\n\nwith Timer() as t:\n    # делаем что-то долгое\n    total = sum(range(1_000_000))\n# Таймер запущен\n# Прошло 0.045 секунд' },
        { type: 'heading', value: 'Параметры метода __exit__' },
        { type: 'code', language: 'python', value: 'class SafeDiv:\n    def __enter__(self):\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        # exc_type  — тип исключения (None если не было)\n        # exc_val   — объект исключения\n        # exc_tb    — traceback\n        if exc_type is ZeroDivisionError:\n            print("Деление на ноль перехвачено!")\n            return True  # True = подавить исключение\n        return False  # False = пропустить исключение дальше\n\nwith SafeDiv():\n    result = 10 / 0  # ZeroDivisionError будет подавлено\nprint("Код продолжается")  # выполнится!' },
        { type: 'tip', value: 'Если __exit__ возвращает True — исключение подавляется и код продолжается. Если False или None — исключение распространяется дальше.' }
      ]
    },
    {
      id: 3, title: 'contextlib.contextmanager', type: 'theory',
      content: [
        { type: 'text', value: 'Создавать класс с __enter__ и __exit__ бывает громоздко. Декоратор @contextmanager из модуля contextlib позволяет написать контекстный менеджер как генераторную функцию — намного проще.' },
        { type: 'heading', value: 'Синтаксис с @contextmanager' },
        { type: 'code', language: 'python', value: 'from contextlib import contextmanager\n\n@contextmanager\ndef managed_resource(name):\n    print(f"Открываем {name}")\n    try:\n        yield name  # значение попадает в as-переменную\n    finally:\n        print(f"Закрываем {name}")\n\nwith managed_resource("база данных") as res:\n    print(f"Работаем с {res}")\n# Открываем база данных\n# Работаем с база данных\n# Закрываем база данных' },
        { type: 'heading', value: 'Реальный пример: временная директория' },
        { type: 'code', language: 'python', value: 'from contextlib import contextmanager\nimport os\nimport tempfile\nimport shutil\n\n@contextmanager\ndef temp_directory():\n    """Создаёт временную директорию и удаляет её после использования."""\n    tmpdir = tempfile.mkdtemp()\n    try:\n        yield tmpdir\n    finally:\n        shutil.rmtree(tmpdir)\n        print(f"Временная папка удалена")\n\nwith temp_directory() as tmpdir:\n    filepath = os.path.join(tmpdir, "test.txt")\n    with open(filepath, "w") as f:\n        f.write("временные данные")\n    print(f"Файл создан: {filepath}")\n# После выхода папка удалена автоматически' },
        { type: 'tip', value: 'Код до yield — это __enter__, код после yield (в блоке finally) — это __exit__. Сам yield передаёт значение в as-переменную.' }
      ]
    },
    {
      id: 4, title: 'contextlib: suppress, redirect_stdout, ExitStack', type: 'theory',
      content: [
        { type: 'text', value: 'Библиотека contextlib содержит много полезных готовых контекстных менеджеров. Рассмотрим наиболее часто используемые.' },
        { type: 'heading', value: 'suppress — подавление исключений' },
        { type: 'code', language: 'python', value: 'from contextlib import suppress\nimport os\n\n# Без suppress — нужен try/except\ntry:\n    os.remove("nonexistent.txt")\nexcept FileNotFoundError:\n    pass\n\n# С suppress — короче и понятнее\nwith suppress(FileNotFoundError):\n    os.remove("nonexistent.txt")  # ошибка тихо игнорируется\n\n# Можно подавлять несколько типов\nwith suppress(FileNotFoundError, PermissionError):\n    os.remove("locked_file.txt")' },
        { type: 'heading', value: 'redirect_stdout — перенаправление вывода' },
        { type: 'code', language: 'python', value: 'from contextlib import redirect_stdout\nimport io\n\n# Захватить вывод print() в строку\nbuffer = io.StringIO()\nwith redirect_stdout(buffer):\n    print("Это не попадёт в консоль")\n    print("Это тоже")\n\noutput = buffer.getvalue()\nprint(f"Захвачено: {repr(output)}")  # "Это не попадёт в консоль\\nЭто тоже\\n"' },
        { type: 'heading', value: 'ExitStack — динамическое число менеджеров' },
        { type: 'code', language: 'python', value: 'from contextlib import ExitStack\n\nfilenames = ["a.txt", "b.txt", "c.txt"]\n\n# Открыть переменное количество файлов\nwith ExitStack() as stack:\n    files = [stack.enter_context(open(f, "w")) for f in filenames]\n    for i, f in enumerate(files):\n        f.write(f"Файл номер {i}")\n# Все файлы закрываются при выходе' },
        { type: 'note', value: 'ExitStack особенно полезен, когда число контекстных менеджеров неизвестно заранее — например, при работе с динамическим списком файлов.' }
      ]
    },
    {
      id: 5, title: 'Практические паттерны использования', type: 'theory',
      content: [
        { type: 'text', value: 'Контекстные менеджеры применяются во многих стандартных сценариях: работа с БД, блокировки в потоках, измерение времени, временное изменение настроек.' },
        { type: 'heading', value: 'Менеджер транзакций базы данных' },
        { type: 'code', language: 'python', value: 'from contextlib import contextmanager\n\n@contextmanager\ndef transaction(connection):\n    """Автоматический commit или rollback."""\n    try:\n        yield connection\n        connection.commit()\n        print("Транзакция подтверждена")\n    except Exception as e:\n        connection.rollback()\n        print(f"Откат транзакции: {e}")\n        raise\n\n# Использование:\n# with transaction(conn) as conn:\n#     conn.execute("INSERT ...")' },
        { type: 'heading', value: 'Временное изменение переменной' },
        { type: 'code', language: 'python', value: 'from contextlib import contextmanager\n\n@contextmanager\ndef temp_setting(obj, attr, value):\n    """Временно меняет атрибут объекта."""\n    old_value = getattr(obj, attr)\n    setattr(obj, attr, value)\n    try:\n        yield\n    finally:\n        setattr(obj, attr, old_value)\n\nclass Config:\n    debug = False\n\ncfg = Config()\nprint(cfg.debug)  # False\n\nwith temp_setting(cfg, "debug", True):\n    print(cfg.debug)  # True\n\nprint(cfg.debug)  # False — восстановлено!' },
        { type: 'tip', value: 'Шаблон "сохрани-измени-восстанови" очень удобен для тестов: можно временно подменить настройки без риска забыть их восстановить.' }
      ]
    },
    {
      id: 6, title: 'Практика: Менеджер логирования', type: 'practice', difficulty: 'medium',
      description: 'Создай контекстный менеджер LogBlock, который при входе печатает "=== Начало: <имя> ===", при выходе "=== Конец: <имя> ===" и время выполнения. При исключении — выводит сообщение об ошибке, но не подавляет его.',
      requirements: [
        'Реализуй через класс с __enter__ и __exit__',
        'Принимает имя блока в конструкторе',
        'Замеряет время через time.time()',
        'Выводит "=== Начало: <имя> ===" при входе',
        'Выводит "=== Конец: <имя> === (0.001 сек)" при выходе',
        'При исключении выводит "ОШИБКА в <имя>: <сообщение>" и НЕ подавляет его'
      ],
      expectedOutput: '=== Начало: вычисления ===\n6\n=== Конец: вычисления === (0.000 сек)\n=== Начало: деление ===\nОШИБКА в деление: division by zero',
      hint: 'В __exit__ проверяй exc_type is not None для определения ошибки. Для вывода времени сохрани self.start в __enter__.',
      solution: 'import time\n\nclass LogBlock:\n    def __init__(self, name):\n        self.name = name\n\n    def __enter__(self):\n        self.start = time.time()\n        print(f"=== Начало: {self.name} ===")\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        elapsed = time.time() - self.start\n        if exc_type is not None:\n            print(f"ОШИБКА в {self.name}: {exc_val}")\n        else:\n            print(f"=== Конец: {self.name} === ({elapsed:.3f} сек)")\n        return False  # не подавляем исключение\n\nwith LogBlock("вычисления"):\n    result = 2 * 3\n    print(result)\n\ntry:\n    with LogBlock("деление"):\n        x = 1 / 0\nexcept ZeroDivisionError:\n    pass',
      explanation: 'Метод __enter__ фиксирует время старта и выводит заголовок. Метод __exit__ проверяет наличие исключения через exc_type. Возврат False означает, что мы не подавляем исключение — оно продолжит распространяться.'
    }
  ]
}
