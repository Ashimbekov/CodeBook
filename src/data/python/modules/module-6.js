export default {
  id: 6,
  title: 'Строки',
  description: 'Работа со строками: f-строки, методы строк, срезы, форматирование, кодировка Unicode и регулярные выражения.',
  lessons: [
    {
      id: 1,
      title: 'Срезы строк',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Индексация и срезы'
        },
        {
          type: 'text',
          value: 'Строки в Python — упорядоченные последовательности символов. Каждый символ имеет индекс (позицию), начиная с 0. Отрицательные индексы считают с конца: -1 это последний символ. Срезы позволяют получить подстроку.'
        },
        {
          type: 'code',
          language: 'python',
          value: 's = "Python"\n\n# Индексация\nprint(s[0])    # P  — первый символ\nprint(s[5])    # n  — последний\nprint(s[-1])   # n  — с конца\nprint(s[-2])   # o\n\n# Срезы: s[start:stop:step]\nprint(s[0:3])   # Pyt — от 0 до 2\nprint(s[2:])    # thon — от 2 до конца\nprint(s[:4])    # Pyth — от начала до 3\nprint(s[:])     # Python — вся строка\n\n# Шаг\nprint(s[::2])   # Pto — каждый второй\nprint(s[::-1])  # nohtyP — строка наоборот!\n\n# Строки неизменяемы\ntry:\n    s[0] = "J"  # TypeError!\nexcept TypeError as e:\n    print("Ошибка:", e)'
        }
      ]
    },
    {
      id: 2,
      title: 'f-строки (форматированные строки)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'F-strings — современный способ форматирования'
        },
        {
          type: 'text',
          value: 'F-строки (f"...") — самый современный и удобный способ форматирования строк в Python (добавлен в 3.6). Они позволяют вставлять выражения Python прямо в строку, заключая их в фигурные скобки {}.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'name = "Алиса"\nage = 28\nprice = 1234.5\n\n# Простая подстановка\nprint(f"Привет, {name}!")\nprint(f"Возраст: {age}")\n\n# Выражения внутри {}\nprint(f"Через 5 лет мне будет {age + 5}")\nprint(f"Имя в верхнем регистре: {name.upper()}")\n\n# Форматирование чисел\nprint(f"Цена: {price:.2f} руб.")   # 1234.50\nprint(f"Цена: {price:,.2f} руб.")  # 1,234.50\nprint(f"Число: {42:05d}")          # 00042\nprint(f"Проценты: {0.753:.1%}")    # 75.3%\nprint(f"Бинарно: {255:b}")         # 11111111\nprint(f"Hex: {255:#x}")            # 0xff\n\n# Выравнивание\nprint(f"{"слева":<10}|")   # слева     |\nprint(f"{"справа":>10}|")  # справа|\nprint(f"{"центр":^10}|")   # центр   |'
        },
        {
          type: 'tip',
          value: 'В Python 3.12 добавлен отладочный режим f-строк: f"{value=}" выводит и имя переменной, и её значение. Например, f"{age=}" выведет "age=28". Незаменимо при отладке!'
        }
      ]
    },
    {
      id: 3,
      title: 'Основные методы строк',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Часто используемые методы'
        },
        {
          type: 'text',
          value: 'Строки в Python имеют богатый набор методов. Помните: все методы возвращают новую строку — они не изменяют оригинал (строки неизменяемы). Методы можно цепочкой: s.strip().lower().replace(" ", "_").'
        },
        {
          type: 'code',
          language: 'python',
          value: 's = "  Hello, World!  "\n\n# Регистр\nprint(s.lower())       # "  hello, world!  "\nprint(s.upper())       # "  HELLO, WORLD!  "\nprint(s.title())       # "  Hello, World!  "\nprint(s.capitalize())  # "  hello, world!  " (только первая)\n\n# Пробелы\nprint(s.strip())       # "Hello, World!" — убирает с обоих концов\nprint(s.lstrip())      # "Hello, World!  " — только слева\nprint(s.rstrip())      # "  Hello, World!" — только справа\n\n# Поиск\ntext = "hello world hello"\nprint(text.find("hello"))        # 0 — первое вхождение\nprint(text.rfind("hello"))       # 12 — последнее\nprint(text.count("hello"))       # 2\nprint(text.startswith("hello"))  # True\nprint(text.endswith("world"))    # False\n\n# Замена и разделение\nprint(text.replace("hello", "hi"))    # "hi world hi"\nparts = "a,b,c,d".split(",")          # ["a", "b", "c", "d"]\nprint(",".join(["a", "b", "c"]))      # "a,b,c"\nprint("  spaces  ".strip().split())   # ["spaces"]'
        }
      ]
    },
    {
      id: 4,
      title: 'Проверка содержимого строки',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Методы is*() для проверки строк'
        },
        {
          type: 'text',
          value: 'Python предоставляет серию методов isX() для проверки содержимого строки. Они возвращают True или False и полезны при валидации пользовательского ввода.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Проверка типа символов\nprint("123".isdigit())      # True\nprint("abc".isalpha())      # True\nprint("abc123".isalnum())   # True\nprint("   ".isspace())      # True\nprint("HELLO".isupper())    # True\nprint("hello".islower())    # True\nprint("Hello World".istitle())  # True\n\n# Применение: валидация ввода\ndef validate_username(username):\n    if len(username) < 3:\n        return "Слишком короткое (мин. 3 символа)"\n    if not username[0].isalpha():\n        return "Должно начинаться с буквы"\n    if not username.isalnum():\n        return "Только буквы и цифры"\n    return "Валидный логин"\n\nprint(validate_username("ab"))       # Слишком короткое\nprint(validate_username("1abc"))     # Должно начинаться с буквы\nprint(validate_username("abc 123"))  # Только буквы и цифры\nprint(validate_username("user123"))  # Валидный логин'
        }
      ]
    },
    {
      id: 5,
      title: 'Многострочные строки и спецсимволы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Многострочные строки и escape-последовательности'
        },
        {
          type: 'text',
          value: 'Тройные кавычки позволяют создавать многострочные строки без явных \\n. Это удобно для длинных текстов, SQL-запросов или HTML. Escape-последовательности обрабатываются в обычных строках, но не в raw-строках.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Многострочные строки\nquery = """\n    SELECT *\n    FROM users\n    WHERE age > 18\n    ORDER BY name\n"""\nprint(query)\n\n# Escape-последовательности\nprint("Первая\\nВторая")    # перенос строки\nprint("Колонка1\\tКолонка2") # табуляция\nprint("Путь: C:\\\\Windows")  # обратный слэш\nprint("Цитата: \\"Текст\\"")  # двойные кавычки\nprint("Unicode: \\u0410\\u0411\\u0412")  # АБВ\n\n# Raw-строки — без обработки escape\nregex = r"\\d+\\.\\d+"\npath = r"C:\\Users\\Alice\\Documents"\nprint(regex)  # \\d+\\.\\d+\nprint(path)   # C:\\Users\\Alice\\Documents\n\n# Байтовые строки\nbytes_str = b"Hello"\nprint(type(bytes_str))  # <class "bytes">\nprint(bytes_str.decode("utf-8"))  # Hello'
        }
      ]
    },
    {
      id: 6,
      title: 'Старые способы форматирования',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'str.format() и %-форматирование'
        },
        {
          type: 'text',
          value: 'До f-строк в Python использовались другие способы форматирования: str.format() (Python 3) и %-форматирование (унаследовано от C). Вы встретите их в старом коде, поэтому важно их понимать.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'name = "Боб"\nage = 35\npi = 3.14159\n\n# str.format()\nprint("Привет, {}!".format(name))\nprint("Возраст: {}".format(age))\nprint("{0} и {1}, {0} снова".format("первый", "второй"))\nprint("{name} = {val:.2f}".format(name="Pi", val=pi))\n\n# %-форматирование (старый стиль, как в C)\nprint("Привет, %s!" % name)\nprint("Возраст: %d" % age)\nprint("Число: %.2f" % pi)\nprint("%s: %d лет" % (name, age))  # кортеж для нескольких\n\n# Сравнение всех трёх способов\nvalue = 42\nprint(f"f-строка: {value}")           # современный\nprint("format: {}".format(value))     # Python 3\nprint("old: %d" % value)              # старый'
        },
        {
          type: 'tip',
          value: 'В новом коде всегда используйте f-строки — они быстрее, читаемее и безопаснее. str.format() и % нужно знать только для понимания старого кода.'
        }
      ]
    },
    {
      id: 7,
      title: 'Строки и Unicode',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Python и Unicode'
        },
        {
          type: 'text',
          value: 'Python 3 работает со строками как с последовательностями Unicode-символов. Это значит, что кириллица, китайские иероглифы, эмодзи — всё хранится и обрабатывается корректно. Каждый символ — это кодовая точка Unicode.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Unicode в Python 3\nrussian = "Привет"\nprint(len(russian))    # 6 (символов, не байт!)\nprint(russian[0])      # П\n\n# Кодовые точки\nprint(ord("A"))        # 65\nprint(ord("П"))        # 1055\nprint(chr(65))         # A\nprint(chr(1055))       # П\n\n# Кодирование в байты\nutf8_bytes = russian.encode("utf-8")\nprint(utf8_bytes)           # b\'\\xd0\\x9f\\xd1\\x80...\'\nprint(len(utf8_bytes))      # 12 (кириллица занимает 2 байта)\n\n# Декодирование\ndecoded = utf8_bytes.decode("utf-8")\nprint(decoded)  # Привет\n\n# Строки неизменяемы — создание новой строки\norig = "hello"\nnew = orig.replace("h", "H")\nprint(orig)  # hello (не изменился)\nprint(new)   # Hello'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Обработка текста',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите функцию для анализа текстовой строки: подсчёт слов, символов, предложений и частоты символов.',
      requirements: [
        'Функция analyze_text(text) возвращает словарь с результатами',
        'Поле "chars" — количество символов без пробелов',
        'Поле "words" — количество слов',
        'Поле "sentences" — количество предложений (по . ! ?)',
        'Поле "upper_percent" — процент заглавных букв среди всех букв',
        'Поле "most_common_char" — самая частая буква (строчная)'
      ],
      expectedOutput: 'Символов (без пробелов): 44\nСлов: 9\nПредложений: 2\nЗаглавных букв: 11.1%\nСамая частая буква: o',
      hint: 'Для подсчёта предложений используйте count() для каждого знака. Для поиска самой частой буквы создайте словарь частот или используйте max() с key=lambda.',
      solution: 'def analyze_text(text):\n    chars = sum(1 for c in text if not c.isspace())\n    words = len(text.split())\n    sentences = text.count(".") + text.count("!") + text.count("?")\n    \n    letters = [c for c in text if c.isalpha()]\n    upper = sum(1 for c in letters if c.isupper())\n    upper_percent = (upper / len(letters) * 100) if letters else 0\n    \n    freq = {}\n    for c in text.lower():\n        if c.isalpha():\n            freq[c] = freq.get(c, 0) + 1\n    most_common = max(freq, key=freq.get) if freq else ""\n    \n    return {\n        "chars": chars,\n        "words": words,\n        "sentences": sentences,\n        "upper_percent": round(upper_percent, 1),\n        "most_common_char": most_common\n    }\n\ntext = "Hello World! This is Python. How are you?"\nresult = analyze_text(text)\nprint(f"Символов (без пробелов): {result[\'chars\']}")\nprint(f"Слов: {result[\'words\']}")\nprint(f"Предложений: {result[\'sentences\']}")\nprint(f"Заглавных букв: {result[\'upper_percent\']}%")\nprint(f"Самая частая буква: {result[\'most_common_char\']}")',
      explanation: 'Генераторные выражения в sum() позволяют компактно подсчитать символы, удовлетворяющие условию. dict.get(key, 0) возвращает 0 если ключ отсутствует, что удобно для подсчёта частот. Функция max() с key= позволяет найти ключ словаря с максимальным значением.'
    }
  ]
}
