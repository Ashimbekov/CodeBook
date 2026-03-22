export default {
  id: 34,
  title: 'Работа с JSON и CSV',
  description: 'Научимся читать и записывать данные в форматах JSON и CSV — самых распространённых форматах обмена данными',
  lessons: [
    {
      id: 1, title: 'JSON: json.loads() и json.dumps()', type: 'theory',
      content: [
        { type: 'text', value: 'JSON (JavaScript Object Notation) — текстовый формат обмена данными. Python-словари прекрасно отображаются на JSON. Модуль json предоставляет две ключевые функции: loads для чтения, dumps для записи.' },
        { type: 'heading', value: 'Кодирование и декодирование' },
        { type: 'code', language: 'python', value: 'import json\n\n# Python -> JSON строка\ndata = {\n    "name": "Аня",\n    "age": 25,\n    "active": True,\n    "score": None,\n    "tags": ["python", "dev"]\n}\n\njson_str = json.dumps(data)\nprint(json_str)\n# {"name": "Аня", "age": 25, "active": true, "score": null, ...}\n\n# С форматированием\npretty = json.dumps(data, indent=2, ensure_ascii=False)\nprint(pretty)\n\n# JSON строка -> Python\nparsed = json.loads(json_str)\nprint(parsed["name"])   # Аня\nprint(type(parsed))     # <class "dict">'),
        { type: 'heading', value: 'Маппинг типов Python <-> JSON' },
        { type: 'code', language: 'python', value: '# Python -> JSON\n# dict    -> object {}\n# list    -> array []\n# tuple   -> array []\n# str     -> string ""\n# int     -> number\n# float   -> number\n# True    -> true\n# False   -> false\n# None    -> null\n\nimport json\n\nprint(json.dumps({"ключ": "значение"}))  # {"key": ...}\nprint(json.dumps([1, 2, 3]))             # [1, 2, 3]\nprint(json.dumps(True))                  # true\nprint(json.dumps(None))                  # null' },
        { type: 'tip', value: 'ensure_ascii=False позволяет сохранять кириллицу как есть. Без него буквы будут в виде \\uXXXX.' }
      ]
    },
    {
      id: 2, title: 'JSON: работа с файлами', type: 'theory',
      content: [
        { type: 'text', value: 'json.dump() и json.load() работают с файловыми объектами — для записи/чтения JSON непосредственно в файл.' },
        { type: 'heading', value: 'Чтение и запись JSON файлов' },
        { type: 'code', language: 'python', value: 'import json\n\nusers = [\n    {"id": 1, "name": "Аня", "email": "anya@mail.ru"},\n    {"id": 2, "name": "Боря", "email": "borya@mail.ru"},\n]\n\n# Записываем в файл\nwith open("users.json", "w", encoding="utf-8") as f:\n    json.dump(users, f, indent=2, ensure_ascii=False)\n\n# Читаем из файла\nwith open("users.json", "r", encoding="utf-8") as f:\n    loaded = json.load(f)\n\nfor user in loaded:\n    print(f"{user[\'id\']}: {user[\'name\']} <{user[\'email\']}>")\n# 1: Аня <anya@mail.ru>\n# 2: Боря <borya@mail.ru>' },
        { type: 'heading', value: 'Обработка ошибок JSON' },
        { type: 'code', language: 'python', value: 'import json\n\n# Невалидный JSON\ntry:\n    data = json.loads("{ некорректный json }")\nexcept json.JSONDecodeError as e:\n    print(f"Ошибка парсинга: {e}")\n    print(f"Строка: {e.lineno}, столбец: {e.colno}")\n\n# Кастомная сериализация\nfrom datetime import datetime\n\nclass DateEncoder(json.JSONEncoder):\n    def default(self, obj):\n        if isinstance(obj, datetime):\n            return obj.isoformat()\n        return super().default(obj)\n\ndata = {"event": "конференция", "date": datetime.now()}\nprint(json.dumps(data, cls=DateEncoder))' }
      ]
    },
    {
      id: 3, title: 'CSV: csv.reader и csv.writer', type: 'theory',
      content: [
        { type: 'text', value: 'CSV (Comma-Separated Values) — простой формат таблиц. Модуль csv обрабатывает все тонкости: кавычки, запятые внутри полей, разные разделители.' },
        { type: 'heading', value: 'Запись CSV' },
        { type: 'code', language: 'python', value: 'import csv\n\nstudents = [\n    ["Имя", "Оценка", "Город"],  # заголовок\n    ["Аня", 85, "Москва"],\n    ["Боря", 92, "СПБ"],\n    ["Вася", 78, "Казань"],\n]\n\nwith open("students.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.writer(f)\n    writer.writerows(students)  # записать все строки сразу\n    # или по одной:\n    # for row in students:\n    #     writer.writerow(row)\n\nprint("CSV записан")' },
        { type: 'heading', value: 'Чтение CSV' },
        { type: 'code', language: 'python', value: 'import csv\n\nwith open("students.csv", "r", encoding="utf-8") as f:\n    reader = csv.reader(f)\n    header = next(reader)  # первая строка — заголовок\n    print(f"Столбцы: {header}")\n\n    for row in reader:\n        name, score, city = row\n        print(f"{name}: {score} ({city})")' },
        { type: 'tip', value: 'Всегда указывай newline="" при открытии CSV файла — это предотвращает добавление лишних пустых строк в Windows.' }
      ]
    },
    {
      id: 4, title: 'DictReader и DictWriter', type: 'theory',
      content: [
        { type: 'text', value: 'csv.DictReader и DictWriter работают со строками как со словарями — удобнее и читаемее, чем обращение по индексам.' },
        { type: 'heading', value: 'DictReader — чтение как словарей' },
        { type: 'code', language: 'python', value: 'import csv\n\nwith open("students.csv", "r", encoding="utf-8") as f:\n    reader = csv.DictReader(f)  # автоматически читает заголовок\n\n    students = list(reader)\n\nfor s in students:\n    # Обращаемся по имени столбца, не по индексу!\n    print(f"{s[\'Имя\']}: {s[\'Оценка\']}")' },
        { type: 'heading', value: 'DictWriter — запись из словарей' },
        { type: 'code', language: 'python', value: 'import csv\n\nproducts = [\n    {"name": "Ноутбук",    "price": 50000, "in_stock": True},\n    {"name": "Мышь",       "price": 800,   "in_stock": True},\n    {"name": "Монитор",    "price": 25000, "in_stock": False},\n]\n\nfields = ["name", "price", "in_stock"]\n\nwith open("products.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.DictWriter(f, fieldnames=fields)\n    writer.writeheader()  # записывает строку заголовка\n    writer.writerows(products)\n\nprint("Продукты записаны в CSV")' },
        { type: 'note', value: 'DictWriter.extrasaction="ignore" позволяет игнорировать лишние ключи в словарях. По умолчанию ValueError при неизвестном ключе.' }
      ]
    },
    {
      id: 5, title: 'Работа с большими CSV файлами', type: 'theory',
      content: [
        { type: 'text', value: 'Большие CSV файлы нельзя загружать целиком. csv.reader является итератором — читает по строке, что позволяет обрабатывать файлы любого размера.' },
        { type: 'heading', value: 'Потоковая обработка CSV' },
        { type: 'code', language: 'python', value: 'import csv\n\ndef process_large_csv(filename: str, batch_size: int = 1000):\n    """Обрабатывает большой CSV файл батчами."""\n    batch = []\n    total = 0\n\n    with open(filename, "r", encoding="utf-8") as f:\n        reader = csv.DictReader(f)\n\n        for row in reader:\n            batch.append(row)\n            if len(batch) >= batch_size:\n                process_batch(batch)\n                total += len(batch)\n                batch = []\n                print(f"Обработано: {total} строк")\n\n        if batch:  # остаток\n            process_batch(batch)\n            total += len(batch)\n\n    print(f"Итого: {total} строк")\n\ndef process_batch(rows):\n    """Обработка одного батча."""\n    pass  # ваша логика' },
        { type: 'heading', value: 'Фильтрация и трансформация CSV' },
        { type: 'code', language: 'python', value: 'import csv\n\n# Читаем, фильтруем, пишем в новый файл\nwith open("students.csv", "r", encoding="utf-8") as fin, \\\n     open("excellent.csv", "w", newline="", encoding="utf-8") as fout:\n\n    reader = csv.DictReader(fin)\n    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)\n    writer.writeheader()\n\n    for row in reader:\n        if int(row["Оценка"]) >= 85:\n            writer.writerow(row)' }
      ]
    },
    {
      id: 6, title: 'Практика: Конвертер данных', type: 'practice', difficulty: 'medium',
      description: 'Создай конвертер данных: читай CSV, обрабатывай и сохраняй в JSON. Добавь сводную статистику.',
      requirements: [
        'Создай CSV файл с данными о студентах: name, score, subject',
        'Прочитай через DictReader',
        'Преобразуй в список словарей, добавив поле grade (A:90+, B:80+, C:70+, D: меньше 70)',
        'Сохрани в JSON файл с отступами',
        'Вычисли и выведи: среднюю оценку, лучшего студента, распределение по grade'
      ],
      expectedOutput: 'CSV записан (5 записей)\nJSON сохранён\nСредняя оценка: 83.0\nЛучший: Вася (95)\nРаспределение: {"A": 2, "B": 2, "C": 1}',
      hint: 'score нужно преобразовать в int: int(row["score"]). Для grade используй вложенные if. json.dump с indent=2, ensure_ascii=False.',
      solution: 'import csv\nimport json\n\n# Создаём тестовые данные\nstudents_data = [\n    ["name", "score", "subject"],\n    ["Аня", "85", "Python"],\n    ["Боря", "72", "Python"],\n    ["Вася", "95", "Python"],\n    ["Галя", "88", "Python"],\n    ["Дима", "75", "Python"],\n]\n\nwith open("students.csv", "w", newline="", encoding="utf-8") as f:\n    writer = csv.writer(f)\n    writer.writerows(students_data)\nprint(f"CSV записан ({len(students_data)-1} записей)")\n\n# Читаем и обрабатываем\ndef get_grade(score):\n    if score >= 90: return "A"\n    elif score >= 80: return "B"\n    elif score >= 70: return "C"\n    else: return "D"\n\nresult = []\nwith open("students.csv", "r", encoding="utf-8") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        score = int(row["score"])\n        result.append({\n            "name": row["name"],\n            "score": score,\n            "subject": row["subject"],\n            "grade": get_grade(score)\n        })\n\nwith open("students.json", "w", encoding="utf-8") as f:\n    json.dump(result, f, indent=2, ensure_ascii=False)\nprint("JSON сохранён")\n\navg = sum(s["score"] for s in result) / len(result)\nbest = max(result, key=lambda s: s["score"])\ngrades = {}\nfor s in result:\n    grades[s["grade"]] = grades.get(s["grade"], 0) + 1\n\nprint(f"Средняя оценка: {avg}")\nprint(f"Лучший: {best[\'name\']} ({best[\'score\']})")\nprint(f"Распределение: {grades}")',
      explanation: 'DictReader автоматически использует первую строку как заголовки. При конвертации score из str в int важно помнить, что CSV хранит всё как строки. json.dump с ensure_ascii=False сохраняет кириллицу читаемо.'
    }
  ]
}
