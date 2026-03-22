export default {
  id: 13,
  title: 'Работа с файлами',
  description: 'Чтение и запись файлов: open(), режимы работы, контекстный менеджер with, текстовые и бинарные файлы, pathlib.',
  lessons: [
    {
      id: 1,
      title: 'Открытие и закрытие файлов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функция open()'
        },
        {
          type: 'text',
          value: 'Функция open() открывает файл и возвращает объект файла. Первый аргумент — путь к файлу, второй — режим (r — чтение, w — запись, a — добавление, b — бинарный). После работы файл нужно закрыть методом close().'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Открытие файла (старый способ)\nf = open("example.txt", "r", encoding="utf-8")\ncontent = f.read()\nf.close()  # ВАЖНО: всегда закрывать файл!\n\n# Режимы открытия:\n# "r"  — чтение (по умолчанию)\n# "w"  — запись (перезаписывает файл)\n# "a"  — добавление в конец\n# "r+" — чтение и запись\n# "b"  — бинарный (rb, wb, ab)\n# "x"  — создание (ошибка если файл существует)\n\n# Что если файл не существует?\ntry:\n    f = open("nonexistent.txt", "r")\nexcept FileNotFoundError as e:\n    print(f"Файл не найден: {e}")\n\n# Что если путь неверный?\ntry:\n    f = open("/invalid/path/file.txt", "w")\nexcept PermissionError as e:\n    print(f"Нет прав: {e}")\nexcept OSError as e:\n    print(f"Ошибка ОС: {e}")'
        }
      ]
    },
    {
      id: 2,
      title: 'Контекстный менеджер with',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Безопасная работа с файлами'
        },
        {
          type: 'text',
          value: 'Оператор with гарантирует, что файл будет закрыт даже при возникновении исключения. Это предпочтительный способ работы с файлами в Python. with автоматически вызывает close() при выходе из блока.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# with — правильный способ работы с файлами\nwith open("example.txt", "r", encoding="utf-8") as f:\n    content = f.read()\n    print(content)\n# файл автоматически закрывается здесь, даже при ошибке\n\n# Запись файла\nwith open("output.txt", "w", encoding="utf-8") as f:\n    f.write("Первая строка\\n")\n    f.write("Вторая строка\\n")\n\n# Несколько файлов в одном with\nwith open("input.txt", "r") as fin, open("output.txt", "w") as fout:\n    for line in fin:\n        fout.write(line.upper())\n\n# Проверка: файл закрыт после with\nwith open("test.txt", "w") as f:\n    f.write("test")\nprint(f.closed)  # True — файл закрыт'
        },
        {
          type: 'tip',
          value: 'Всегда используйте with при работе с файлами. Без него файл может остаться открытым при возникновении исключения, что приводит к утечке ресурсов и потере данных.'
        }
      ]
    },
    {
      id: 3,
      title: 'Методы чтения файлов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'read(), readline(), readlines()'
        },
        {
          type: 'code',
          language: 'python',
          value: '# read() — читает весь файл\nwith open("example.txt", "r", encoding="utf-8") as f:\n    content = f.read()  # строка со всем содержимым\n    print(f"Символов: {len(content)}")\n\n# read(n) — читает n символов\nwith open("example.txt", "r", encoding="utf-8") as f:\n    chunk = f.read(100)   # первые 100 символов\n    rest = f.read()       # остальное\n\n# readline() — читает одну строку\nwith open("example.txt", "r", encoding="utf-8") as f:\n    first = f.readline()   # первая строка (с \\n)\n    second = f.readline()  # вторая строка\n\n# readlines() — список всех строк\nwith open("example.txt", "r", encoding="utf-8") as f:\n    lines = f.readlines()  # список строк с \\n\n    print(lines[:3])\n\n# Перебор строк (самый эффективный!)\nwith open("example.txt", "r", encoding="utf-8") as f:\n    for line in f:  # файл — итерируемый объект\n        line = line.strip()  # убираем \\n\n        if line:  # пропускаем пустые строки\n            print(line)'
        }
      ]
    },
    {
      id: 4,
      title: 'Запись файлов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Методы записи'
        },
        {
          type: 'code',
          language: 'python',
          value: '# write() — запись строки\nwith open("output.txt", "w", encoding="utf-8") as f:\n    f.write("Строка 1\\n")\n    f.write("Строка 2\\n")\n    count = f.write("Строка 3\\n")  # возвращает кол-во символов\n    print(f"Записано {count} символов")\n\n# writelines() — запись списка строк (без автоматических \\n)\nlines = ["Строка 1\\n", "Строка 2\\n", "Строка 3\\n"]\nwith open("output.txt", "w", encoding="utf-8") as f:\n    f.writelines(lines)\n\n# print() в файл\nwith open("output.txt", "w", encoding="utf-8") as f:\n    print("Первая строка", file=f)\n    print("Вторая строка", file=f)\n    # print автоматически добавляет \\n\n\n# Добавление в существующий файл (режим "a")\nwith open("log.txt", "a", encoding="utf-8") as f:\n    f.write("Новая запись в лог\\n")\n\n# Запись чисел — нужно преобразование в str\ndata = [1, 2, 3, 4, 5]\nwith open("numbers.txt", "w") as f:\n    for num in data:\n        f.write(str(num) + "\\n")'
        }
      ]
    },
    {
      id: 5,
      title: 'Бинарные файлы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Работа с бинарными данными'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Чтение бинарного файла\nwith open("image.png", "rb") as f:\n    header = f.read(8)  # первые 8 байт\n    print(header.hex())  # в шестнадцатеричном виде\n\n# Копирование файла побайтово\nwith open("source.bin", "rb") as src, open("copy.bin", "wb") as dst:\n    while chunk := src.read(4096):  # читаем кусками\n        dst.write(chunk)\n\n# Сериализация через pickle\nimport pickle\n\ndata = {"name": "Иван", "scores": [90, 85, 92]}\n\n# Сохранение\nwith open("data.pkl", "wb") as f:\n    pickle.dump(data, f)\n\n# Загрузка\nwith open("data.pkl", "rb") as f:\n    loaded = pickle.load(f)\nprint(loaded)  # {"name": "Иван", "scores": [90, 85, 92]}'
        },
        {
          type: 'warning',
          value: 'Никогда не загружайте pickle-данные из ненадёжных источников! Pickle может выполнить произвольный код при десериализации. Для обмена данными используйте JSON.'
        }
      ]
    },
    {
      id: 6,
      title: 'pathlib — современная работа с путями',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Модуль pathlib (Python 3.4+)'
        },
        {
          type: 'text',
          value: 'pathlib предоставляет объектно-ориентированный API для работы с путями файловой системы. Path объект работает кроссплатформенно и предоставляет удобные методы. Рекомендуется вместо os.path.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from pathlib import Path\n\n# Создание объекта Path\np = Path("my_folder/file.txt")\nhome = Path.home()       # домашняя директория\ncwd = Path.cwd()         # текущая директория\n\n# Операции с путями\nprint(p.name)      # file.txt\nprint(p.stem)      # file\nprint(p.suffix)    # .txt\nprint(p.parent)    # my_folder\n\n# Соединение путей через /\nfull_path = home / "documents" / "report.txt"\nprint(full_path)\n\n# Проверки\nprint(p.exists())      # существует ли\nprint(p.is_file())     # это файл?\nprint(p.is_dir())      # это директория?\n\n# Создание директорий\nnew_dir = Path("new_folder/sub")\nnew_dir.mkdir(parents=True, exist_ok=True)\n\n# Чтение и запись через pathlib\npath = Path("test.txt")\npath.write_text("Привет, мир!\\n", encoding="utf-8")\ncontent = path.read_text(encoding="utf-8")\nprint(content)\n\n# Список файлов\nfor f in Path(".").glob("*.py"):\n    print(f)'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Анализ лог-файла',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Напишите программу для анализа текстового лог-файла: подсчёт ошибок, предупреждений и извлечение статистики.',
      requirements: [
        'Создайте функцию generate_log(filename) для создания тестового лога из 20 строк',
        'Функция analyze_log(filename) читает файл и возвращает статистику',
        'Считайте количество строк типа ERROR, WARNING, INFO',
        'Соберите список строк с ошибками (ERROR)',
        'Выведите отчёт об анализе'
      ],
      expectedOutput: 'Лог создан: log.txt\nАнализ лог-файла:\n  Всего строк: 20\n  INFO: 10\n  WARNING: 5\n  ERROR: 5\nОшибки:\n  [ERROR] Connection timeout\n  [ERROR] Database error',
      hint: 'Используйте with open для чтения. Для проверки типа строки используйте line.startswith("[ERROR]"). Собирайте ошибки в список через append.',
      solution: 'import random\nfrom datetime import datetime\n\ndef generate_log(filename):\n    levels = ["INFO"] * 10 + ["WARNING"] * 5 + ["ERROR"] * 5\n    random.shuffle(levels)\n    messages = {\n        "INFO": ["Server started", "Request received", "Cache updated"],\n        "WARNING": ["High memory usage", "Slow query detected"],\n        "ERROR": ["Connection timeout", "Database error", "File not found"]\n    }\n    with open(filename, "w", encoding="utf-8") as f:\n        for level in levels:\n            msg = random.choice(messages[level])\n            f.write(f"[{level}] {msg}\\n")\n    print(f"Лог создан: {filename}")\n\ndef analyze_log(filename):\n    stats = {"INFO": 0, "WARNING": 0, "ERROR": 0}\n    errors = []\n    total = 0\n    with open(filename, "r", encoding="utf-8") as f:\n        for line in f:\n            line = line.strip()\n            if not line:\n                continue\n            total += 1\n            for level in stats:\n                if line.startswith(f"[{level}]"):\n                    stats[level] += 1\n                    if level == "ERROR":\n                        errors.append(line)\n    return total, stats, errors\n\ngenerate_log("log.txt")\ntotal, stats, errors = analyze_log("log.txt")\nprint("Анализ лог-файла:")\nprint(f"  Всего строк: {total}")\nfor level, count in stats.items():\n    print(f"  {level}: {count}")\nprint("Ошибки:")\nfor err in errors:\n    print(f"  {err}")',
      explanation: 'Итерация по файлу (for line in f) читает строки лениво — эффективно для больших файлов. strip() удаляет \\n и пробелы. startswith() быстрее чем in для проверки начала строки. Разделение логики на generate/analyze следует принципу единственной ответственности.'
    }
  ]
}
