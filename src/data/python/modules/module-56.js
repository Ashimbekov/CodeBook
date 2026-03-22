export default {
  id: 56,
  title: 'Практикум: Основы',
  description: 'Практические задачи на основы Python: переменные, типы данных, условия, циклы',
  lessons: [
    {
      id: 1,
      title: 'Калькулятор с историей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши консольный калькулятор с историей операций.',
      requirements: [
        'Поддерживает +, -, *, / и ** (возведение в степень)',
        'Хранит историю последних 5 операций в списке',
        'Функция history() выводит историю',
        'Обработка деления на ноль',
        'Функция clear_history() очищает историю'
      ],
      expectedOutput: 'calc(10, "+", 5) -> 15.0\ncalc(10, "/", 0) -> "Ошибка: деление на ноль"\nhistory() -> ["10 + 5 = 15.0", ...]',
      hint: 'Храни историю в глобальном списке или как атрибут класса. Используй словарь операций {"+": lambda a,b: a+b, ...}.',
      solution: 'history_log = []\n\nOPERATIONS = {\n    "+": lambda a, b: a + b,\n    "-": lambda a, b: a - b,\n    "*": lambda a, b: a * b,\n    "/": lambda a, b: a / b if b != 0 else None,\n    "**": lambda a, b: a ** b,\n}\n\ndef calc(a: float, op: str, b: float):\n    if op not in OPERATIONS:\n        raise ValueError(f"Неизвестная операция: {op}")\n    if op == "/" and b == 0:\n        print("Ошибка: деление на ноль")\n        return None\n    result = OPERATIONS[op](a, b)\n    entry = f"{a} {op} {b} = {result}"\n    history_log.append(entry)\n    if len(history_log) > 5:\n        history_log.pop(0)\n    return result\n\ndef history():\n    if not history_log:\n        print("История пуста")\n    for item in history_log:\n        print(item)\n\ndef clear_history():\n    history_log.clear()\n    print("История очищена")\n\n# Тест\nprint(calc(10, "+", 5))\nprint(calc(10, "/", 0))\nprint(calc(2, "**", 8))\nhistory()',
      explanation: 'Словарь с lambda функциями позволяет добавлять операции без if/elif. pop(0) удаляет первый элемент (самый старый). Проверка деления на ноль до выполнения операции — правильный подход Guard Clause.'
    },
    {
      id: 2,
      title: 'Угадай число',
      type: 'practice',
      difficulty: 'easy',
      description: 'Игра "Угадай число" с подсказками и статистикой.',
      requirements: [
        'Компьютер загадывает случайное число от 1 до 100',
        'Подсказки: "больше" или "меньше"',
        'Считает количество попыток',
        'По итогу выводит оценку: 1-5 попыток "Отлично!", 6-10 "Хорошо!", 10+ "Можно лучше"',
        'Предлагает сыграть снова'
      ],
      expectedOutput: 'Загадано число от 1 до 100\nВаш вариант: 50\nМеньше!\nВаш вариант: 25\nБольше!\n...\nУгадали за 7 попыток. Хорошо!',
      hint: 'import random; number = random.randint(1, 100). Цикл while True с break при угадывании.',
      solution: 'import random\n\ndef play_game():\n    number = random.randint(1, 100)\n    attempts = 0\n    print("Загадано число от 1 до 100")\n\n    while True:\n        try:\n            guess = int(input("Ваш вариант: "))\n        except ValueError:\n            print("Введите целое число")\n            continue\n\n        attempts += 1\n\n        if guess < number:\n            print("Больше!")\n        elif guess > number:\n            print("Меньше!")\n        else:\n            if attempts <= 5:\n                rating = "Отлично!"\n            elif attempts <= 10:\n                rating = "Хорошо!"\n            else:\n                rating = "Можно лучше"\n            print(f"Угадали за {attempts} попыток. {rating}")\n            break\n\n    again = input("Сыграть снова? (да/нет): ")\n    if again.lower() in ("да", "yes", "y", "д"):\n        play_game()\n\nplay_game()',
      explanation: 'Рекурсия для перезапуска игры проста, но при многих играх может привести к RecursionError. Для продакшна лучше цикл while. try/except ValueError обрабатывает нечисловой ввод.'
    },
    {
      id: 3,
      title: 'Анализ оценок студентов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Обработай список оценок студентов и выведи статистику.',
      requirements: [
        'Словарь: {имя: [список оценок]}',
        'Функция average(grades) — среднее арифметическое',
        'Функция top_students(data, n=3) — топ-N по среднему',
        'Функция failing_students(data, threshold=3.0) — студенты с средним ниже порога',
        'Вывод: имя, средняя оценка, количество оценок, статус (отлично/хорошо/плохо)'
      ],
      expectedOutput: 'Алиса: среднее 4.5, оценок 4, статус: Отлично\nБоб: среднее 2.8, оценок 5, статус: Плохо\n...\nТоп-3: [Алиса, Вася, ...]\nОтстающие: [Боб, ...]',
      hint: 'sum(grades)/len(grades) для среднего. sorted(data.items(), key=lambda x: average(x[1]), reverse=True) для сортировки.',
      solution: 'data = {\n    "Алиса": [5, 4, 5, 4],\n    "Боб": [3, 2, 3, 2, 3],\n    "Вася": [4, 5, 4, 5, 4],\n    "Дина": [3, 4, 3, 4],\n    "Егор": [2, 2, 3, 2]\n}\n\ndef average(grades):\n    return sum(grades) / len(grades) if grades else 0\n\ndef get_status(avg):\n    if avg >= 4.5: return "Отлично"\n    if avg >= 3.5: return "Хорошо"\n    if avg >= 3.0: return "Удовлетворительно"\n    return "Плохо"\n\nfor name, grades in data.items():\n    avg = average(grades)\n    print(f"{name}: среднее {avg:.1f}, оценок {len(grades)}, статус: {get_status(avg)}")\n\ndef top_students(d, n=3):\n    return sorted(d.keys(), key=lambda k: average(d[k]), reverse=True)[:n]\n\ndef failing_students(d, threshold=3.0):\n    return [name for name, g in d.items() if average(g) < threshold]\n\nprint("\\nТоп-3:", top_students(data))\nprint("Отстающие:", failing_students(data))',
      explanation: 'lambda k: average(data[k]) — ключ сортировки, вычисляет среднее для каждого студента. Список comprehension в failing_students компактнее цикла for. [:n] ограничивает результат.'
    },
    {
      id: 4,
      title: 'Конвертер температур',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай конвертер между Цельсием, Фаренгейтом и Кельвином.',
      requirements: [
        'Функция convert(value, from_unit, to_unit) — основная',
        'Поддерживает: C (Цельсий), F (Фаренгейт), K (Кельвин)',
        'Валидация: Кельвин не может быть ниже 0',
        'Функция convert_all(celsius) — возвращает словарь со всеми единицами',
        'Таблица конвертации для значений -40, 0, 20, 37, 100'
      ],
      expectedOutput: 'convert(100, "C", "F") -> 212.0\nconvert(0, "K", "C") -> -273.15\nconvert_all(37) -> {"C": 37, "F": 98.6, "K": 310.15}\nТаблица:\n-40°C = -40°F = 233.15K\n...',
      hint: 'Сначала переведи в Цельсий (промежуточный), потом из Цельсия в целевую. C->F: (C * 9/5) + 32. C->K: C + 273.15.',
      solution: 'def to_celsius(value, unit):\n    if unit == "C": return value\n    if unit == "F": return (value - 32) * 5 / 9\n    if unit == "K":\n        if value < 0:\n            raise ValueError(f"Кельвин не может быть отрицательным: {value}")\n        return value - 273.15\n    raise ValueError(f"Неизвестная единица: {unit}")\n\ndef from_celsius(celsius, unit):\n    if unit == "C": return celsius\n    if unit == "F": return celsius * 9 / 5 + 32\n    if unit == "K": return celsius + 273.15\n    raise ValueError(f"Неизвестная единица: {unit}")\n\ndef convert(value, from_unit, to_unit):\n    celsius = to_celsius(value, from_unit.upper())\n    return round(from_celsius(celsius, to_unit.upper()), 2)\n\ndef convert_all(celsius):\n    return {\n        "C": celsius,\n        "F": round(from_celsius(celsius, "F"), 2),\n        "K": round(from_celsius(celsius, "K"), 2)\n    }\n\nprint(f"convert(100, C, F) = {convert(100, \'C\', \'F\')}")\nprint(f"convert(0, K, C) = {convert(0, \'K\', \'C\')}")\nprint(f"convert_all(37) = {convert_all(37)}")\n\nprint("\\nТаблица конвертации:")\nfor c in [-40, 0, 20, 37, 100]:\n    d = convert_all(c)\n    print(f"{d[\'C\']}°C = {d[\'F\']}°F = {d[\'K\']}K")',
      explanation: 'Приведение к общей единице (Цельсий) упрощает конвертацию — не нужно N*N формул, достаточно N*2. Метод round() на выходе устраняет float артефакты типа 98.60000000000001.'
    },
    {
      id: 5,
      title: 'Текстовый анализатор',
      type: 'practice',
      difficulty: 'easy',
      description: 'Анализируй текст: слова, предложения, частоту символов.',
      requirements: [
        'Функция word_count(text) — количество слов',
        'Функция sentence_count(text) — количество предложений',
        'Функция most_common_words(text, n=5) — топ-N слов по частоте',
        'Функция char_frequency(text) — частота каждой буквы',
        'Средняя длина слова и самое длинное слово'
      ],
      expectedOutput: 'Слов: 42\nПредложений: 5\nТоп-5 слов: [(\'the\', 8), (\'and\', 5), ...]\nСреднее длина слова: 4.3\nСамое длинное слово: "международный"',
      hint: 'text.split() для слов. text.count(".") + text.count("!") + text.count("?") для предложений. collections.Counter для частоты.',
      solution: 'import re\nfrom collections import Counter\n\ndef word_count(text):\n    words = re.findall(r"\\b\\w+\\b", text.lower())\n    return len(words)\n\ndef sentence_count(text):\n    sentences = re.split(r"[.!?]+", text)\n    return len([s for s in sentences if s.strip()])\n\ndef most_common_words(text, n=5):\n    words = re.findall(r"\\b[а-яёa-z]+\\b", text.lower())\n    stop_words = {"и", "в", "на", "с", "по", "the", "a", "of", "in"}\n    filtered = [w for w in words if w not in stop_words and len(w) > 2]\n    return Counter(filtered).most_common(n)\n\ndef char_frequency(text):\n    letters = [c.lower() for c in text if c.isalpha()]\n    return Counter(letters)\n\ndef analyze(text):\n    words = re.findall(r"\\b\\w+\\b", text.lower())\n    avg_len = sum(len(w) for w in words) / len(words) if words else 0\n    longest = max(words, key=len) if words else ""\n    print(f"Слов: {word_count(text)}")\n    print(f"Предложений: {sentence_count(text)}")\n    print(f"Топ-5 слов: {most_common_words(text)}")\n    print(f"Средняя длина слова: {avg_len:.1f}")\n    print(f"Самое длинное слово: {longest!r}")\n\ntext = "Питон - это отличный язык программирования. Он прост в изучении. Питон используется в науке о данных, веб-разработке и автоматизации. Многие компании используют Питон. Я люблю Питон!"\nanalyze(text)',
      explanation: 're.findall(r"\\b\\w+\\b") находит все слова, включая кириллицу. Counter.most_common(n) возвращает n самых частых элементов. max(words, key=len) находит самое длинное слово без сортировки.'
    },
    {
      id: 6,
      title: 'Список задач (ToDo)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй консольный менеджер задач с приоритетами.',
      requirements: [
        'Класс Task: title, priority(1-5), done, created_at',
        'Класс TodoManager: add, complete, delete, list_tasks',
        'list_tasks(filter_done=False) — фильтрация выполненных',
        'sort_by_priority() — сортировка по приоритету',
        'save_to_file() и load_from_file() через JSON',
        'statistics() — выводит общую/выполненных/ожидающих'
      ],
      expectedOutput: 'Добавлено: "Купить продукты" (приоритет 3)\nДобавлено: "Сдать отчёт" (приоритет 5)\nВыполнено: "Купить продукты"\nСтатистика: всего 2, выполнено 1, ожидает 1',
      hint: 'from datetime import datetime для created_at. json.dump/json.load для сохранения. dataclass удобен для Task.',
      solution: 'import json\nfrom dataclasses import dataclass, field, asdict\nfrom datetime import datetime\nfrom typing import Optional\n\n@dataclass\nclass Task:\n    title: str\n    priority: int = 3\n    done: bool = False\n    created_at: str = field(default_factory=lambda: datetime.now().isoformat())\n    id: int = 0\n\nclass TodoManager:\n    def __init__(self):\n        self._tasks = []\n        self._next_id = 1\n\n    def add(self, title, priority=3):\n        if not 1 <= priority <= 5:\n            raise ValueError("Приоритет должен быть от 1 до 5")\n        task = Task(title=title, priority=priority, id=self._next_id)\n        self._tasks.append(task)\n        self._next_id += 1\n        print(f\'Добавлено: "{task.title}" (приоритет {task.priority})\')\n        return task\n\n    def complete(self, task_id):\n        for task in self._tasks:\n            if task.id == task_id:\n                task.done = True\n                print(f\'Выполнено: "{task.title}"\')\n                return\n        raise ValueError(f"Задача {task_id} не найдена")\n\n    def delete(self, task_id):\n        self._tasks = [t for t in self._tasks if t.id != task_id]\n\n    def list_tasks(self, filter_done=None):\n        tasks = self._tasks\n        if filter_done is not None:\n            tasks = [t for t in tasks if t.done == filter_done]\n        for t in tasks:\n            status = "✓" if t.done else "○"\n            print(f"[{status}] {t.id}. {t.title} (P{t.priority})")\n\n    def sort_by_priority(self):\n        self._tasks.sort(key=lambda t: t.priority, reverse=True)\n\n    def statistics(self):\n        total = len(self._tasks)\n        done = sum(1 for t in self._tasks if t.done)\n        print(f"Статистика: всего {total}, выполнено {done}, ожидает {total - done}")\n\n    def save_to_file(self, filename="tasks.json"):\n        with open(filename, "w", encoding="utf-8") as f:\n            json.dump([asdict(t) for t in self._tasks], f, ensure_ascii=False, indent=2)\n\n    def load_from_file(self, filename="tasks.json"):\n        try:\n            with open(filename, encoding="utf-8") as f:\n                data = json.load(f)\n            self._tasks = [Task(**d) for d in data]\n        except FileNotFoundError:\n            print("Файл не найден, начинаем с чистого листа")\n\ntm = TodoManager()\ntm.add("Купить продукты", priority=3)\ntm.add("Сдать отчёт", priority=5)\ntm.add("Позвонить другу", priority=2)\ntm.complete(1)\ntm.list_tasks()\ntm.statistics()',
      explanation: 'dataclass с field(default_factory=lambda: ...) создаёт новый объект datetime для каждого экземпляра. asdict() сериализует dataclass в словарь для JSON. Task(**d) создаёт экземпляр из словаря.'
    },
    {
      id: 7,
      title: 'Шифр Цезаря',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй шифр Цезаря для русского и английского текста.',
      requirements: [
        'encrypt(text, shift) — шифрует текст сдвигом',
        'decrypt(text, shift) — расшифровывает',
        'Сохраняет регистр букв',
        'Нелатинские/некириллические символы не изменяет',
        'crack(ciphertext) — пробует все 33 сдвига и выводит варианты'
      ],
      expectedOutput: 'encrypt("Привет, Мир!", 3) -> "Тулезх, Пло!"\ndecrypt("Тулезх, Пло!", 3) -> "Привет, Мир!"\nencrypt("Hello", 13) -> "Uryyb" (ROT13)',
      hint: 'Раздели логику для латиницы (ord(a-z) = 97-122) и кириллицы (ord(а-я) = 1072-1103). chr((ord(c) - base + shift) % size + base).',
      solution: 'def shift_char(char, shift):\n    if "a" <= char.lower() <= "z":\n        base = ord("A") if char.isupper() else ord("a")\n        return chr((ord(char) - base + shift) % 26 + base)\n    elif "а" <= char.lower() <= "я" or char.lower() == "ё":\n        ru_lower = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"\n        lower = char.lower()\n        if lower in ru_lower:\n            idx = ru_lower.index(lower)\n            new_idx = (idx + shift) % len(ru_lower)\n            result = ru_lower[new_idx]\n            return result.upper() if char.isupper() else result\n    return char\n\ndef encrypt(text, shift):\n    return "".join(shift_char(c, shift) for c in text)\n\ndef decrypt(text, shift):\n    return encrypt(text, -shift)\n\ndef crack(ciphertext):\n    print("Перебор всех сдвигов:")\n    for shift in range(1, 34):\n        print(f"Сдвиг {shift:2d}: {decrypt(ciphertext, shift)}")\n\noriginal = "Привет, Мир! Hello!"\nencrypted = encrypt(original, 3)\ndecrypted = decrypt(encrypted, 3)\n\nprint(f"Оригинал: {original}")\nprint(f"Зашифровано (сдвиг 3): {encrypted}")\nprint(f"Расшифровано: {decrypted}")\nprint(f"ROT13: {encrypt(\'Hello\', 13)}")\nprint()\ncrack(encrypted)',
      explanation: 'Кириллица не ASCII, поэтому используем строку-алфавит и поиск индекса. % len(ru_lower) обеспечивает цикличность. Функция decrypt = encrypt с отрицательным сдвигом — хороший пример DRY.'
    },
    {
      id: 8,
      title: 'Генератор паролей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай безопасный генератор паролей с проверкой надёжности.',
      requirements: [
        'generate_password(length=12, use_uppercase=True, use_digits=True, use_symbols=True)',
        'check_strength(password) — возвращает: Слабый/Средний/Сильный/Очень сильный',
        'Минимум 1 символ каждого включённого типа',
        'Использует модуль secrets (не random) для безопасности',
        'generate_memorable(words=3) — генерирует из случайных слов типа "кот-дом-лес-42"'
      ],
      expectedOutput: 'generate_password(16) -> "Xk9#mP2@nL5$wR8!"\ncheck_strength("password") -> "Слабый"\ncheck_strength("P@ssw0rd!") -> "Сильный"\ngenerate_memorable() -> "кот-дом-звезда-73"',
      hint: 'secrets.choice(alphabet) безопаснее random.choice. Сначала добавь обязательные символы, потом дополни случайными, потом перемешай через secrets.SystemRandom().shuffle().',
      solution: 'import secrets\nimport string\n\nWORDS = ["кот", "дом", "звезда", "река", "гора", "лес", "море", "небо",\n         "огонь", "вода", "земля", "ветер", "солнце", "луна", "снег"]\n\ndef generate_password(length=12, use_uppercase=True, use_digits=True, use_symbols=True):\n    chars = string.ascii_lowercase\n    required = [secrets.choice(string.ascii_lowercase)]\n\n    if use_uppercase:\n        chars += string.ascii_uppercase\n        required.append(secrets.choice(string.ascii_uppercase))\n    if use_digits:\n        chars += string.digits\n        required.append(secrets.choice(string.digits))\n    if use_symbols:\n        symbols = "!@#$%^&*"\n        chars += symbols\n        required.append(secrets.choice(symbols))\n\n    remaining = [secrets.choice(chars) for _ in range(length - len(required))]\n    password_list = required + remaining\n    secrets.SystemRandom().shuffle(password_list)\n    return "".join(password_list)\n\ndef check_strength(password):\n    score = 0\n    if len(password) >= 8: score += 1\n    if len(password) >= 12: score += 1\n    if any(c.isupper() for c in password): score += 1\n    if any(c.isdigit() for c in password): score += 1\n    if any(c in "!@#$%^&*()_-+=[]{}|;:,.<>?" for c in password): score += 1\n    if len(set(password)) >= len(password) * 0.7: score += 1\n    levels = ["Слабый", "Слабый", "Средний", "Средний", "Сильный", "Очень сильный", "Очень сильный"]\n    return levels[score]\n\ndef generate_memorable(words=3):\n    chosen = [secrets.choice(WORDS) for _ in range(words)]\n    number = secrets.randbelow(100)\n    return "-".join(chosen) + f"-{number}"\n\nprint(generate_password(16))\nprint(generate_password(12, use_symbols=False))\nprint(check_strength("password"))\nprint(check_strength("P@ssword123!"))\nprint(generate_memorable())',
      explanation: 'secrets.SystemRandom().shuffle() криптографически безопасно, в отличие от random.shuffle(). Обязательные символы гарантируют соответствие требованиям. secrets.randbelow(100) возвращает случайное число от 0 до 99.'
    },
    {
      id: 9,
      title: 'Банковский счёт',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй класс BankAccount с полной функциональностью.',
      requirements: [
        'Атрибуты: owner, balance, account_number (случайный 10-значный), transaction_history',
        'deposit(amount) с валидацией суммы',
        'withdraw(amount) с проверкой баланса',
        'transfer(amount, target_account) — перевод между счетами',
        'statement() — выписка: все транзакции с датой и типом',
        'apply_interest(rate=0.05) — начисление процентов'
      ],
      expectedOutput: 'Счёт #1234567890 | Баланс: 0 руб\nПополнено: +5000 руб | Баланс: 5000 руб\nСнято: -2000 руб | Баланс: 3000 руб\nВыписка:\n2024-01-15 Пополнение +5000\n2024-01-15 Снятие -2000',
      hint: 'from datetime import datetime. transaction_history как список словарей: {type, amount, balance, date}. account_number = random.randint(1000000000, 9999999999).',
      solution: 'import random\nfrom datetime import datetime\nfrom typing import Optional\n\nclass BankAccount:\n    def __init__(self, owner: str, initial_balance: float = 0):\n        self.owner = owner\n        self.balance = initial_balance\n        self.account_number = random.randint(1000000000, 9999999999)\n        self.transaction_history = []\n        if initial_balance > 0:\n            self._record("Начальный баланс", initial_balance)\n\n    def _record(self, transaction_type: str, amount: float):\n        self.transaction_history.append({\n            "type": transaction_type,\n            "amount": amount,\n            "balance": self.balance,\n            "date": datetime.now().strftime("%Y-%m-%d %H:%M")\n        })\n\n    def deposit(self, amount: float):\n        if amount <= 0:\n            raise ValueError("Сумма должна быть положительной")\n        self.balance += amount\n        self._record("Пополнение", amount)\n        print(f"Пополнено: +{amount:.0f} руб | Баланс: {self.balance:.0f} руб")\n\n    def withdraw(self, amount: float):\n        if amount <= 0:\n            raise ValueError("Сумма должна быть положительной")\n        if amount > self.balance:\n            raise ValueError(f"Недостаточно средств. Баланс: {self.balance:.0f} руб")\n        self.balance -= amount\n        self._record("Снятие", -amount)\n        print(f"Снято: -{amount:.0f} руб | Баланс: {self.balance:.0f} руб")\n\n    def transfer(self, amount: float, target: "BankAccount"):\n        self.withdraw(amount)\n        target.deposit(amount)\n        print(f"Перевод {amount:.0f} руб -> счёт {target.account_number}")\n\n    def apply_interest(self, rate: float = 0.05):\n        interest = self.balance * rate\n        self.balance += interest\n        self._record("Начисление процентов", interest)\n        print(f"Начислено {rate*100:.1f}%: +{interest:.2f} руб | Баланс: {self.balance:.2f} руб")\n\n    def statement(self):\n        print(f"\\nВыписка по счёту #{self.account_number} ({self.owner})")\n        print("-" * 50)\n        for t in self.transaction_history:\n            sign = "+" if t["amount"] >= 0 else ""\n            print(f"{t[\'date\']} | {t[\'type\']:25s} | {sign}{t[\'amount\']:>10.2f} руб | Баланс: {t[\'balance\']:>10.2f} руб")\n        print(f"\\nТекущий баланс: {self.balance:.2f} руб")\n\nacc1 = BankAccount("Алиса")\nacc2 = BankAccount("Боб")\nacc1.deposit(10000)\nacc1.withdraw(3000)\nacc1.transfer(2000, acc2)\nacc1.apply_interest(0.05)\nacc1.statement()\nacc2.statement()',
      explanation: 'Метод _record с префиксом _ обозначает "приватный по соглашению". Аннотация типа "BankAccount" в кавычках — Forward Reference для самоссылок. Форматирование {t[\'date\']} внутри f-строки с одинарными кавычками — корректный Python 3.12+.'
    },
    {
      id: 10,
      title: 'Матрица и линейная алгебра',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй класс Matrix без NumPy с базовыми операциями линейной алгебры.',
      requirements: [
        'Класс Matrix: хранит данные как список списков',
        '__add__, __mul__ (на скаляр и матрицу), __repr__',
        'transpose() — транспонирование',
        'determinant() — определитель (для 2x2 и 3x3)',
        'is_square(), is_symmetric() — проверки свойств',
        'identity(n) — статический метод, создаёт единичную матрицу'
      ],
      expectedOutput: 'Matrix([[1,2],[3,4]]) + Matrix([[5,6],[7,8]]) = Matrix([[6,8],[10,12]])\nTranspose: Matrix([[1,3],[2,4]])\nDeterminant: -2\nIdentity(3):\n1 0 0\n0 1 0\n0 0 1',
      hint: 'Для матричного умножения: C[i][j] = sum(A[i][k] * B[k][j] for k in range(n)). Определитель 2x2: ad - bc.',
      solution: 'class Matrix:\n    def __init__(self, data):\n        self.data = [row[:] for row in data]\n        self.rows = len(data)\n        self.cols = len(data[0]) if data else 0\n\n    def __repr__(self):\n        rows_str = ["  [" + ", ".join(map(str, row)) + "]" for row in self.data]\n        return "Matrix(\\n" + ",\\n".join(rows_str) + "\\n)"\n\n    def __add__(self, other):\n        if self.rows != other.rows or self.cols != other.cols:\n            raise ValueError("Размеры матриц не совпадают")\n        result = [[self.data[i][j] + other.data[i][j]\n                   for j in range(self.cols)]\n                  for i in range(self.rows)]\n        return Matrix(result)\n\n    def __mul__(self, other):\n        if isinstance(other, (int, float)):\n            return Matrix([[x * other for x in row] for row in self.data])\n        if isinstance(other, Matrix):\n            if self.cols != other.rows:\n                raise ValueError("Несовместимые размеры для умножения")\n            result = []\n            for i in range(self.rows):\n                row = []\n                for j in range(other.cols):\n                    s = sum(self.data[i][k] * other.data[k][j]\n                            for k in range(self.cols))\n                    row.append(s)\n                result.append(row)\n            return Matrix(result)\n        return NotImplemented\n\n    def transpose(self):\n        return Matrix([[self.data[i][j] for i in range(self.rows)]\n                       for j in range(self.cols)])\n\n    def is_square(self):\n        return self.rows == self.cols\n\n    def is_symmetric(self):\n        return self.is_square() and self == self.transpose()\n\n    def __eq__(self, other):\n        return self.data == other.data\n\n    def determinant(self):\n        if not self.is_square():\n            raise ValueError("Определитель только для квадратных матриц")\n        d = self.data\n        if self.rows == 1:\n            return d[0][0]\n        if self.rows == 2:\n            return d[0][0]*d[1][1] - d[0][1]*d[1][0]\n        if self.rows == 3:\n            return (d[0][0]*(d[1][1]*d[2][2] - d[1][2]*d[2][1])\n                  - d[0][1]*(d[1][0]*d[2][2] - d[1][2]*d[2][0])\n                  + d[0][2]*(d[1][0]*d[2][1] - d[1][1]*d[2][0]))\n        raise NotImplementedError("Определитель для n>3 не реализован")\n\n    @staticmethod\n    def identity(n):\n        return Matrix([[1 if i == j else 0 for j in range(n)]\n                       for i in range(n)])\n\nA = Matrix([[1, 2], [3, 4]])\nB = Matrix([[5, 6], [7, 8]])\nprint("A + B:", A + B)\nprint("A * 2:", A * 2)\nprint("A * B:", A * B)\nprint("Transpose A:", A.transpose())\nprint("det(A):", A.determinant())\nprint("Identity(3):", Matrix.identity(3))',
      explanation: 'Оператор __mul__ с isinstance позволяет умножать как на скаляр, так и на матрицу. NotImplemented (не None!) сигнализирует Python попробовать правую операцию. Генератор списков в transpose() эффективнее вложенных циклов.'
    }
  ]
}
