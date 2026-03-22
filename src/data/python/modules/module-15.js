export default {
  id: 15,
  title: 'Ввод/вывод и форматирование',
  description: 'Функция input(), продвинутое форматирование строк, format(), f-строки, вывод таблиц и числовое форматирование.',
  lessons: [
    {
      id: 1,
      title: 'Функция input()',
      content: [
        {
          type: 'heading',
          value: 'Ввод данных от пользователя'
        },
        {
          type: 'text',
          value: 'Функция input() читает строку с консоли. Она всегда возвращает строку — не забывайте преобразовывать к нужному типу. Необязательный аргумент — подсказка, которая выводится перед вводом.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Базовый input\nname = input("Введите ваше имя: ")\nprint(f"Привет, {name}!")\n\n# input всегда возвращает строку!\nage_str = input("Введите возраст: ")\nage = int(age_str)  # необходимо преобразование\n\n# Компактнее\nage = int(input("Возраст: "))\nheight = float(input("Рост (м): "))\n\n# Безопасный ввод с валидацией\ndef get_integer(prompt, min_val=None, max_val=None):\n    while True:\n        try:\n            value = int(input(prompt))\n            if min_val is not None and value < min_val:\n                print(f"Число должно быть >= {min_val}")\n                continue\n            if max_val is not None and value > max_val:\n                print(f"Число должно быть <= {max_val}")\n                continue\n            return value\n        except ValueError:\n            print("Введите целое число!")\n\nage = get_integer("Возраст: ", min_val=0, max_val=120)\nprint(f"Ваш возраст: {age}")'
        }
      ]
    },
    {
      id: 2,
      title: 'Продвинутые f-строки',
      content: [
        {
          type: 'heading',
          value: 'Полный синтаксис f-строк'
        },
        {
          type: 'text',
          value: 'F-строки поддерживают полный мини-язык форматирования. Синтаксис: {выражение:формат} где формат включает выравнивание, ширину, знак, заполнение, точность и тип.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'value = 42\npi = 3.14159265\nname = "Иван"\n\n# Ширина и выравнивание\nprint(f"|{name:<10}|")   # |Иван      | — по левому краю\nprint(f"|{name:>10}|")   # |      Иван| — по правому\nprint(f"|{name:^10}|")   # |   Иван   | — по центру\n\n# Заполнение другим символом\nprint(f"|{name:*<10}|")  # |Иван******|\nprint(f"|{name:0>10}|")  # |000000Иван|\n\n# Числовое форматирование\nprint(f"{pi:.2f}")   # 3.14\nprint(f"{pi:.5f}")   # 3.14159\nprint(f"{pi:10.3f}") # "     3.142" (ширина 10)\n\n# Разделители тысяч\nbig = 1234567.89\nprint(f"{big:,.2f}")    # 1,234,567.89\nprint(f"{big:_.2f}")    # 1_234_567.89\n\n# Процент, экспонента, hex\nprint(f"{0.753:.1%}")  # 75.3%\nprint(f"{big:.2e}")    # 1.23e+06\nprint(f"{255:#x}")     # 0xff\nprint(f"{255:#b}")     # 0b11111111\nprint(f"{255:#o}")     # 0o377\n\n# Знак числа\nprint(f"{42:+}")  # +42\nprint(f"{-5:+}")  # -5\nprint(f"{42: }")  # \" 42\" (пробел перед положительным)'
        }
      ]
    },
    {
      id: 3,
      title: 'Форматирование таблиц',
      content: [
        {
          type: 'heading',
          value: 'Вывод данных в табличном виде'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Таблица с выравниванием\nstudents = [\n    ("Алиса", 92, "A"),\n    ("Боб", 78, "C"),\n    ("Чарли", 85, "B"),\n    ("Дэвид", 67, "D"),\n]\n\n# Заголовок\nprint(f"{"Имя":<10} {"Балл":>5} {"Оценка":^7}")\nprint("-" * 24)\n\n# Данные\nfor name, score, grade in students:\n    print(f"{name:<10} {score:>5} {grade:^7}")\n\n# Вывод:\n# Имя        Балл  Оценка\n# ------------------------\n# Алиса        92    A\n# Боб          78    C\n\n# Используем str.format для сложных случаев\ntemplate = "{:<15} {:>8} {:>10} {:>8}"\nprint(template.format("Товар", "Кол-во", "Цена", "Итого"))\nprint("-" * 45)\ngoods = [("Яблоки", 5, 30.0), ("Бананы", 2, 45.5), ("Вишня", 1, 150.0)]\nfor name, qty, price in goods:\n    total = qty * price\n    print(template.format(name, qty, f"{price:.2f}", f"{total:.2f}"))'
        }
      ]
    },
    {
      id: 4,
      title: 'Управляющие последовательности и терминал',
      content: [
        {
          type: 'heading',
          value: 'ANSI-коды для цветного вывода'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Специальные символы\nprint("\\n")   # новая строка\nprint("\\t")   # табуляция\nprint("\\r")   # возврат каретки\nprint("\\\\")  # обратный слэш\nprint("\\"")   # двойная кавычка\n\n# Прогресс в одной строке (carriage return)\nimport time\nfor i in range(101):\n    print(f"\\rПрогресс: {i}%", end="", flush=True)\n    time.sleep(0.01)\nprint()  # новая строка в конце\n\n# ANSI-цвета (работают в большинстве терминалов)\nRED   = "\\033[91m"\nGREEN = "\\033[92m"\nYELLOW = "\\033[93m"\nBLUE  = "\\033[94m"\nBOLD  = "\\033[1m"\nRESET = "\\033[0m"\n\nprint(f"{RED}Ошибка!{RESET}")\nprint(f"{GREEN}Успех!{RESET}")\nprint(f"{BOLD}{YELLOW}Предупреждение!{RESET}")\n\n# Или используйте библиотеку colorama для кроссплатформенности\n# pip install colorama\n# from colorama import Fore, Back, Style'
        }
      ]
    },
    {
      id: 5,
      title: 'pprint — красивый вывод',
      content: [
        {
          type: 'heading',
          value: 'Модуль pprint для сложных структур'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pprint\n\n# Стандартный print для сложных данных\ndata = {"users": [{"name": "Алиса", "age": 28, "scores": [90, 85, 92]}, {"name": "Боб", "age": 32, "scores": [75, 80]}], "total": 2}\nprint(data)  # всё в одну строку — нечитаемо\n\n# pprint форматирует красиво\npprint.pprint(data, width=40)\n\n# Настройка глубины\npprint.pprint(data, depth=2)  # скрывает вложенные уровни {...} и [...]\n\n# pformat — строка вместо вывода\nformatted = pprint.pformat(data)\nprint(formatted)\n\n# Ширина отступа\npprint.pprint(data, indent=4)\n\n# Сортировка ключей словаря\npprint.pprint({"z": 3, "a": 1, "m": 2}, sort_dicts=True)  # по алфавиту\npprint.pprint({"z": 3, "a": 1, "m": 2}, sort_dicts=False)  # по порядку вставки'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Интерактивный конвертер',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Создайте интерактивный конвертер единиц длины с красивым выводом результатов.',
      requirements: [
        'Поддержите конвертацию между: метры, километры, мили, футы, дюймы',
        'Пользователь вводит значение и единицу измерения',
        'Программа выводит все эквивалентные значения в таблице',
        'Форматируйте вывод: числа с 4 знаками после запятой, колонки выровнены',
        'Добавьте повторный запрос до ввода "q" для выхода'
      ],
      expectedOutput: 'Конвертер единиц длины\nВведите значение и единицу (например: 1 m) или q для выхода\n\nРезультаты для 1.00 m:\n  Метры     :      1.0000 m\n  Километры :      0.0010 km\n  Мили      :      0.0006 mi\n  Футы      :      3.2808 ft\n  Дюймы     :     39.3701 in',
      hint: 'Создайте словарь коэффициентов перевода к метрам: {"m": 1, "km": 1000, "mi": 1609.344, ...}. Сначала конвертируйте в метры, потом в нужную единицу.',
      solution: 'UNITS = {\n    "m":  ("Метры",     1.0),\n    "km": ("Километры", 1000.0),\n    "mi": ("Мили",      1609.344),\n    "ft": ("Футы",      0.3048),\n    "in": ("Дюймы",     0.0254),\n}\n\ndef convert(value, from_unit):\n    if from_unit not in UNITS:\n        return None\n    _, factor = UNITS[from_unit]\n    in_meters = value * factor\n    return {unit: in_meters / f for unit, (_, f) in UNITS.items()}\n\nprint("Конвертер единиц длины")\nprint("Введите значение и единицу (например: 1 m) или q для выхода")\n\nwhile True:\n    user_input = input("\\n> ").strip()\n    if user_input.lower() == "q":\n        break\n    try:\n        parts = user_input.split()\n        value = float(parts[0])\n        unit = parts[1].lower()\n        results = convert(value, unit)\n        if results is None:\n            print(f"Неизвестная единица: {unit}. Доступные: {list(UNITS.keys())}")\n            continue\n        print(f"\\nРезультаты для {value:.2f} {unit}:")\n        for u, val in results.items():\n            name, _ = UNITS[u]\n            print(f"  {name:<10}: {val:>12.4f} {u}")\n    except (ValueError, IndexError):\n        print("Ошибка: введите число и единицу, например: 5.5 km")',
      explanation: 'Словарь UNITS хранит коэффициенты перевода к базовой единице (метры). Конвертация в два шага: значение → метры → целевая единица. Это позволяет добавлять новые единицы, изменяя только один словарь. Форматирование {name:<10} и {val:>12.4f} выравнивает таблицу.'
    }
  ]
}
