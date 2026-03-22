export default {
  id: 9,
  title: 'Словари (dict)',
  description: 'Словари Python: создание, методы get/items/keys/values, dict comprehension, вложенные словари и паттерны использования.',
  lessons: [
    {
      id: 1,
      title: 'Создание и базовые операции',
      content: [
        {
          type: 'heading',
          value: 'Словарь — структура ключ: значение'
        },
        {
          type: 'text',
          value: 'Словарь (dict) хранит пары ключ-значение. Ключи уникальны и должны быть неизменяемыми (строки, числа, кортежи). В Python 3.7+ словари сохраняют порядок вставки. Поиск по ключу — O(1).'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание словаря\nempty = {}\nperson = {"имя": "Иван", "возраст": 30, "город": "Москва"}\n\n# Через dict()\nd2 = dict(name="Алиса", age=25)\nd3 = dict([("a", 1), ("b", 2)])  # из списка кортежей\n\n# Доступ по ключу\nprint(person["имя"])    # Иван\nprint(person["возраст"]) # 30\n\n# Изменение и добавление\nperson["возраст"] = 31  # изменение\nperson["email"] = "ivan@example.com"  # добавление\nprint(person)\n\n# Удаление\ndel person["email"]\nprint(person)\n\n# Проверка наличия ключа\nprint("имя" in person)     # True\nprint("email" in person)   # False\nprint("email" not in person)  # True'
        }
      ]
    },
    {
      id: 2,
      title: 'Метод get() и безопасный доступ',
      content: [
        {
          type: 'heading',
          value: 'Безопасное получение значений'
        },
        {
          type: 'text',
          value: 'Прямой доступ d[key] вызывает KeyError если ключа нет. Метод get() возвращает None (или указанное значение по умолчанию) если ключ отсутствует. Это основной способ "безопасного" чтения из словаря.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'config = {"host": "localhost", "port": 5432}\n\n# KeyError если ключа нет\ntry:\n    print(config["password"])  # KeyError!\nexcept KeyError as e:\n    print(f"Ключ {e} не найден")\n\n# get() — безопасный доступ\nprint(config.get("host"))           # localhost\nprint(config.get("password"))       # None\nprint(config.get("password", ""))   # "" — значение по умолчанию\nprint(config.get("port", 3306))     # 5432 (ключ есть)\n\n# setdefault() — получить или создать\nscores = {"Алиса": 90}\nscores.setdefault("Боб", 0)  # создаёт "Боб": 0\nscores.setdefault("Алиса", 0)  # не изменяет существующий\nprint(scores)  # {"Алиса": 90, "Боб": 0}\n\n# Подсчёт через setdefault\ncounters = {}\nwords = ["яблоко", "банан", "яблоко", "вишня", "банан", "яблоко"]\nfor word in words:\n    counters.setdefault(word, 0)\n    counters[word] += 1\nprint(counters)'
        }
      ]
    },
    {
      id: 3,
      title: 'Методы keys(), values(), items()',
      content: [
        {
          type: 'heading',
          value: 'Перебор словаря'
        },
        {
          type: 'text',
          value: 'keys(), values(), items() возвращают "представления" (view objects) — динамические объекты, отражающие текущее состояние словаря. items() особенно полезен — возвращает пары (ключ, значение) для одновременного перебора.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'prices = {"яблоко": 30, "банан": 25, "вишня": 80}\n\n# keys() — перебор ключей\nfor key in prices.keys():\n    print(key)\n\n# или просто for key in prices:\nfor key in prices:\n    print(key, "->", prices[key])\n\n# values() — перебор значений\nfor value in prices.values():\n    print(value)\n\nprint(list(prices.values()))  # [30, 25, 80]\nprint(sum(prices.values()))   # 135\nprint(max(prices.values()))   # 80\n\n# items() — перебор пар ключ-значение\nfor fruit, price in prices.items():\n    print(f"{fruit}: {price} руб.")\n\n# Нахождение максимального значения\nmost_expensive = max(prices, key=prices.get)\nprint(f"Самый дорогой: {most_expensive}")  # вишня\n\n# Проверка: keys/values/items — динамические\nkeys_view = prices.keys()\nprices["арбуз"] = 50\nprint(list(keys_view))  # ["яблоко", "банан", "вишня", "арбуз"] — обновилось!'
        }
      ]
    },
    {
      id: 4,
      title: 'Методы update, pop, merge',
      content: [
        {
          type: 'heading',
          value: 'Обновление и слияние словарей'
        },
        {
          type: 'code',
          language: 'python',
          value: 'd = {"a": 1, "b": 2}\n\n# update() — добавление/обновление ключей\nd.update({"b": 20, "c": 3})\nprint(d)  # {"a": 1, "b": 20, "c": 3}\n\nd.update(x=100, y=200)  # через именованные аргументы\nprint(d)\n\n# pop() — удаление с возвратом значения\nval = d.pop("a")\nprint(val)  # 1\nprint(d)\n\nval2 = d.pop("z", "не найдено")  # с дефолтным значением\nprint(val2)  # не найдено\n\n# popitem() — удаление последней добавленной пары\nd2 = {"a": 1, "b": 2, "c": 3}\nlast = d2.popitem()\nprint(last)  # ("c", 3)\nprint(d2)    # {"a": 1, "b": 2}\n\n# Слияние словарей (Python 3.9+)\ndefaults = {"theme": "dark", "lang": "ru", "timeout": 30}\nuser_prefs = {"theme": "light", "font_size": 14}\n\n# Оператор | — новый словарь\nmerged = defaults | user_prefs\nprint(merged)\n\n# Оператор |= — обновление на месте\ndefaults |= user_prefs\nprint(defaults)'
        }
      ]
    },
    {
      id: 5,
      title: 'Dict comprehension',
      content: [
        {
          type: 'heading',
          value: 'Компактное создание словарей'
        },
        {
          type: 'text',
          value: 'Dict comprehension создаёт словарь из итерируемого объекта за одну строку. Синтаксис: {ключ: значение for элемент in итерируемое if условие}. Аналог list comprehension, но для словарей.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Квадраты чисел\nsquares = {x: x**2 for x in range(1, 6)}\nprint(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n\n# Из двух списков\nkeys = ["a", "b", "c"]\nvalues = [1, 2, 3]\nd = {k: v for k, v in zip(keys, values)}\nprint(d)  # {"a": 1, "b": 2, "c": 3}\n\n# Фильтрация\nprices = {"яблоко": 30, "банан": 25, "вишня": 80, "груша": 45}\nexpensive = {k: v for k, v in prices.items() if v > 35}\nprint(expensive)  # {"вишня": 80, "груша": 45}\n\n# Инверсия словаря (значения -> ключи)\noriginal = {"a": 1, "b": 2, "c": 3}\ninverted = {v: k for k, v in original.items()}\nprint(inverted)  # {1: "a", 2: "b", 3: "c"}\n\n# Нормализация ключей\ndata = {"Name": "Иван", "AGE": 30, "CITY": "Москва"}\nnormalized = {k.lower(): v for k, v in data.items()}\nprint(normalized)  # {"name": "Иван", "age": 30, "city": "Москва"}'
        }
      ]
    },
    {
      id: 6,
      title: 'Вложенные словари',
      content: [
        {
          type: 'heading',
          value: 'Словари в словарях'
        },
        {
          type: 'text',
          value: 'Значения в словаре могут быть любого типа, включая другие словари. Вложенные словари часто используются для представления иерархических данных (конфиги, JSON, базы данных). Доступ к вложенным значениям через цепочку ключей.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Вложенный словарь\nusers = {\n    "alice": {\n        "age": 28,\n        "email": "alice@example.com",\n        "scores": [90, 85, 92]\n    },\n    "bob": {\n        "age": 32,\n        "email": "bob@example.com",\n        "scores": [75, 80, 70]\n    }\n}\n\n# Доступ к вложенным данным\nprint(users["alice"]["email"])      # alice@example.com\nprint(users["bob"]["scores"][0])    # 75\n\n# Безопасный доступ к вложенным ключам\nalice_city = users.get("alice", {}).get("city", "не указан")\nprint(alice_city)  # не указан\n\n# Обновление вложенного словаря\nusers["alice"]["age"] = 29\nusers["alice"]["scores"].append(88)\n\n# Перебор вложенного словаря\nfor username, info in users.items():\n    avg_score = sum(info["scores"]) / len(info["scores"])\n    print(f"{username}: средний балл {avg_score:.1f}")'
        }
      ]
    },
    {
      id: 7,
      title: 'defaultdict и Counter',
      content: [
        {
          type: 'heading',
          value: 'Полезные подклассы dict из collections'
        },
        {
          type: 'text',
          value: 'Модуль collections предоставляет специализированные словари. defaultdict автоматически создаёт значение по умолчанию для отсутствующих ключей. Counter — словарь для подсчёта элементов. Оба наследуют dict.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from collections import defaultdict, Counter\n\n# defaultdict — нет KeyError\ngroups = defaultdict(list)\nfor person, group in [("Иван", "A"), ("Алиса", "B"), ("Боб", "A")]:\n    groups[person].append(group)  # list создаётся автоматически\nprint(dict(groups))\n\n# Группировка без defaultdict (сложнее)\ngroups2 = {}\nfor person, group in [("Иван", "A"), ("Алиса", "B"), ("Боб", "A")]:\n    if person not in groups2:\n        groups2[person] = []\n    groups2[person].append(group)\n\n# Counter — подсчёт элементов\ntext = "hello world"\ncounts = Counter(text)\nprint(counts.most_common(3))  # [("l", 3), ("o", 2), (" ", 1)]\n\nwords = ["яблоко", "банан", "яблоко", "вишня", "яблоко"]\nword_counts = Counter(words)\nprint(word_counts["яблоко"])  # 3\nprint(word_counts.most_common(1))  # [(яблоко, 3)]\n\n# Арифметика Counter\na = Counter({"a": 3, "b": 2})\nb = Counter({"a": 1, "b": 4})\nprint(a + b)  # Counter({"b": 6, "a": 4})'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Анализ частоты слов',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Напишите программу для анализа текста: подсчёт частоты слов, вывод топ-5 слов и базовой статистики.',
      requirements: [
        'Функция word_frequency(text) возвращает словарь {слово: количество}',
        'Приведите все слова к нижнему регистру',
        'Удалите знаки препинания (используйте str.translate или replace)',
        'Функция top_n(freq_dict, n) возвращает n самых частых слов',
        'Выведите топ-5 слов и общую статистику'
      ],
      expectedOutput: 'Уникальных слов: 8\nВсего слов: 12\nТоп-3 слова:\n  the: 3\n  quick: 2\n  brown: 1',
      hint: 'Для удаления пунктуации: text.translate(str.maketrans("", "", string.punctuation)) или используйте цикл с isalpha(). Для сортировки по значению: sorted(d.items(), key=lambda x: x[1], reverse=True).',
      solution: 'import string\n\ndef word_frequency(text):\n    text = text.lower()\n    text = text.translate(str.maketrans("", "", string.punctuation))\n    words = text.split()\n    freq = {}\n    for word in words:\n        freq[word] = freq.get(word, 0) + 1\n    return freq\n\ndef top_n(freq_dict, n):\n    sorted_items = sorted(freq_dict.items(), key=lambda x: x[1], reverse=True)\n    return sorted_items[:n]\n\ntext = "the quick brown fox jumps over the lazy dog the quick"\nfreq = word_frequency(text)\nprint(f"Уникальных слов: {len(freq)}")\nprint(f"Всего слов: {sum(freq.values())}")\nprint("Топ-3 слова:")\nfor word, count in top_n(freq, 3):\n    print(f"  {word}: {count}")',
      explanation: 'str.translate с str.maketrans — эффективный способ удалить все знаки пунктуации за O(n). sorted() с lambda-ключом сортирует по значениям словаря. Срез [:n] безопасно возвращает не более n элементов, даже если словарь меньше.'
    }
  ]
}
