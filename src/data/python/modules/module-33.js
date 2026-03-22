export default {
  id: 33,
  title: 'Регулярные выражения',
  description: 'Изучим модуль re для работы с регулярными выражениями: поиск, извлечение, замена и группировка шаблонов в тексте',
  lessons: [
    {
      id: 1, title: 'Основы регулярных выражений', type: 'theory',
      content: [
        { type: 'text', value: 'Регулярное выражение (regex) — это шаблон для поиска в тексте. Оно описывает не конкретную строку, а класс строк. Например, \\d+ означает "одна или более цифр".' },
        { type: 'heading', value: 'Основные метасимволы' },
        { type: 'code', language: 'python', value: 'import re\n\n# Основные метасимволы:\n# .   — любой символ кроме \\n\n# \\d  — цифра [0-9]\n# \\w  — буква, цифра или _ [a-zA-Z0-9_]\n# \\s  — пробельный символ (пробел, \\t, \\n)\n# \\D, \\W, \\S — противоположности\n\n# Квантификаторы:\n# *   — 0 или более\n# +   — 1 или более\n# ?   — 0 или 1 (необязательный)\n# {n} — ровно n раз\n# {n,m} — от n до m раз\n\ntext = "Телефон: +7 (916) 123-45-67"\npattern = r"\\+?[\\d\\s()-]{10,}"\nmatch = re.search(pattern, text)\nif match:\n    print(match.group())  # +7 (916) 123-45-67' },
        { type: 'heading', value: 're.search() vs re.match()' },
        { type: 'code', language: 'python', value: 'import re\n\ntext = "Привет 42 мир 99"\n\n# search — ищет В ЛЮБОМ МЕСТЕ строки\nresult = re.search(r"\\d+", text)\nprint(result.group())   # 42 (первое совпадение)\n\n# match — ищет только В НАЧАЛЕ строки\nresult2 = re.match(r"\\d+", text)\nprint(result2)          # None (не с начала)\n\nresult3 = re.match(r"\\d+", "42 привет")\nprint(result3.group())  # 42 (с начала!)' },
        { type: 'tip', value: 'Используй r"строку" (raw string) для регулярных выражений — это предотвращает двойное экранирование. r"\\d" = одна обратная косая черта + d.' }
      ]
    },
    {
      id: 2, title: 're.findall() и re.finditer()', type: 'theory',
      content: [
        { type: 'text', value: 'findall() возвращает список всех совпадений, finditer() — итератор объектов Match. finditer() предпочтительнее для больших текстов или когда нужна позиция совпадения.' },
        { type: 'heading', value: 'findall — все совпадения' },
        { type: 'code', language: 'python', value: 'import re\n\ntext = "Цены: 100р, 250р, 1500р, 89р"\n\n# Найти все числа\nprices = re.findall(r"\\d+", text)\nprint(prices)  # ["100", "250", "1500", "89"]\n\n# Найти все слова на кириллице\nwords = re.findall(r"[а-яё]+", text.lower())\nprint(words)  # ["цены", "р", "р", "р", "р"]\n\n# Email адреса в тексте\nemail_text = "Пишите: alice@mail.ru или bob.smith@gmail.com"\nemails = re.findall(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", email_text)\nprint(emails)  # ["alice@mail.ru", "bob.smith@gmail.com"]' },
        { type: 'heading', value: 'finditer — итератор с позициями' },
        { type: 'code', language: 'python', value: 'import re\n\ntext = "foo bar foo baz foo"\n\nfor match in re.finditer(r"foo", text):\n    print(f"Найдено: \'{match.group()}\' на позиции {match.start()}-{match.end()}")\n# Найдено: "foo" на позиции 0-3\n# Найдено: "foo" на позиции 8-11\n# Найдено: "foo" на позиции 16-19' }
      ]
    },
    {
      id: 3, title: 'Группы — re.groups() и именованные группы', type: 'theory',
      content: [
        { type: 'text', value: 'Скобки () в регулярном выражении создают группу — её содержимое можно извлечь отдельно. Это позволяет одновременно найти совпадение и извлечь его части.' },
        { type: 'heading', value: 'Нумерованные группы' },
        { type: 'code', language: 'python', value: 'import re\n\n# Парсинг даты\ndate_text = "Событие состоится 25.12.2024 в 18:30"\npattern = r"(\\d{2})\\.(\\d{2})\\.(\\d{4})"\n\nmatch = re.search(pattern, date_text)\nif match:\n    print(match.group(0))  # 25.12.2024 — всё совпадение\n    print(match.group(1))  # 25 — первая группа (день)\n    print(match.group(2))  # 12 — вторая группа (месяц)\n    print(match.group(3))  # 2024 — третья группа (год)\n    print(match.groups())  # ("25", "12", "2024")' },
        { type: 'heading', value: 'Именованные группы (?P<name>...)' },
        { type: 'code', language: 'python', value: 'import re\n\n# Гораздо читаемее!\npattern = r"(?P<day>\\d{2})\\.(?P<month>\\d{2})\\.(?P<year>\\d{4})"\ntext = "Дата: 15.03.2024"\n\nmatch = re.search(pattern, text)\nif match:\n    print(match.group("day"))    # 15\n    print(match.group("month"))  # 03\n    print(match.group("year"))   # 2024\n    print(match.groupdict())     # {"day":"15","month":"03","year":"2024"}\n\n# Пример: парсинг лог-файла\nlog = "2024-01-15 ERROR: connection timeout"\nlog_pattern = r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<level>\\w+): (?P<msg>.+)"\nm = re.search(log_pattern, log)\nif m:\n    print(f"Дата: {m.group(\'date\')}, Уровень: {m.group(\'level\')}")' },
        { type: 'tip', value: 'Именованные группы — хорошая практика: код читается как документация. (?P<year>\\d{4}) сразу ясно что ищем год из 4 цифр.' }
      ]
    },
    {
      id: 4, title: 're.sub() — замена по шаблону', type: 'theory',
      content: [
        { type: 'text', value: 're.sub(pattern, replacement, string) заменяет все совпадения на строку замены. В строке замены можно ссылаться на группы через \\1, \\2 или \\g<name>.' },
        { type: 'heading', value: 'Базовая замена' },
        { type: 'code', language: 'python', value: 'import re\n\n# Заменить все числа на [NUM]\ntext = "У меня 3 кошки и 5 собак и 100 рыбок"\nresult = re.sub(r"\\d+", "[NUM]", text)\nprint(result)  # У меня [NUM] кошки и [NUM] собак и [NUM] рыбок\n\n# Удалить лишние пробелы\ntext2 = "Слишком   много    пробелов   тут"\ncleaned = re.sub(r"\\s+", " ", text2)\nprint(cleaned)  # Слишком много пробелов тут' },
        { type: 'heading', value: 'Замена с использованием групп' },
        { type: 'code', language: 'python', value: 'import re\n\n# Форматирование телефонов: 79161234567 -> +7 (916) 123-45-67\nphone = "Звоните: 79161234567 или 74951234567"\npattern = r"7(\\d{3})(\\d{3})(\\d{2})(\\d{2})"\nformatted = re.sub(pattern, r"+7 (\\1) \\2-\\3-\\4", phone)\nprint(formatted)\n# Звоните: +7 (916) 123-45-67 или +7 (495) 123-45-67\n\n# Функция вместо строки замены\ndef double_number(match):\n    return str(int(match.group()) * 2)\n\ntext = "3 яблока и 5 груш"\nresult = re.sub(r"\\d+", double_number, text)\nprint(result)  # 6 яблока и 10 груш' }
      ]
    },
    {
      id: 5, title: 'Флаги и компиляция паттернов', type: 'theory',
      content: [
        { type: 'text', value: 'Флаги изменяют поведение регулярного выражения. re.compile() компилирует паттерн один раз для многократного использования — это быстрее при многократных применениях.' },
        { type: 'heading', value: 'Основные флаги' },
        { type: 'code', language: 'python', value: 'import re\n\ntext = "Hello WORLD\\nПривет МИР"\n\n# re.IGNORECASE (re.I) — без учёта регистра\nprint(re.findall(r"hello", text, re.I))  # ["Hello"]\n\n# re.MULTILINE (re.M) — ^ и $ для каждой строки\nprint(re.findall(r"^\\w+", text, re.M))  # ["Hello", "Привет"]\n\n# re.DOTALL (re.S) — . включает \\n\nprint(re.search(r"Hello.+МИР", text, re.DOTALL).group())\n# Hello WORLD\\nПривет МИР\n\n# Комбинирование флагов через |\nprint(re.findall(r"^hello", text, re.I | re.M))  # ["Hello"]' },
        { type: 'heading', value: 're.compile() — предкомпилированные паттерны' },
        { type: 'code', language: 'python', value: 'import re\n\n# Компилируем один раз\nemail_pattern = re.compile(\n    r"[\\w.+-]+@[\\w-]+\\.[\\w.]+",\n    re.IGNORECASE\n)\n\ntexts = [\n    "alice@gmail.com",\n    "Без почты",\n    "bob@MAIL.RU",\n]\n\nfor text in texts:\n    m = email_pattern.search(text)\n    if m:\n        print(f"Email: {m.group()}")' },
        { type: 'note', value: 're.compile() возвращает объект Pattern с теми же методами: pattern.search(), pattern.findall(), pattern.sub() и т.д.' }
      ]
    },
    {
      id: 6, title: 'Lookahead, lookbehind и другие конструкции', type: 'theory',
      content: [
        { type: 'text', value: 'Продвинутые конструкции: lookahead (?=...) и lookbehind (?<=...) — условия без включения в результат. Полезны для сложных паттернов.' },
        { type: 'heading', value: 'Lookahead и lookbehind' },
        { type: 'code', language: 'python', value: 'import re\n\n# Positive lookahead (?=...) — ищем X перед которым Y\ntext = "100USD 200EUR 50USD 300GBP"\n# Числа перед USD\npattern = r"\\d+(?=USD)"\nprint(re.findall(pattern, text))  # ["100", "50"]\n\n# Positive lookbehind (?<=...) — ищем X после которого Y\n# Числа после EUR\npattern2 = r"(?<=EUR )\\d+|\\d+(?=EUR)"\n\n# Negative lookahead (?!...)\nwords = ["test", "testing", "tested", "tester"]\nfor w in words:\n    if re.match(r"test(?!ing)", w):\n        print(w)  # test, tested, tester' }
      ]
    },
    {
      id: 7, title: 'Практика: Парсер данных', type: 'practice', difficulty: 'medium',
      description: 'Напиши парсер для извлечения структурированных данных из текста — email, телефонов и дат.',
      requirements: [
        'Функция extract_emails(text) возвращает список всех email-адресов',
        'Функция extract_phones(text) находит телефоны форматов: +7XXXXXXXXXX, 8-XXX-XXX-XX-XX',
        'Функция extract_dates(text) находит даты DD.MM.YYYY и возвращает список словарей {day, month, year}',
        'Функция clean_text(text) удаляет HTML-теги и заменяет множественные пробелы на один',
        'Протестируй на примере текста с несколькими email, телефонами и датами'
      ],
      expectedOutput: 'Emails: ["alice@mail.ru", "bob@gmail.com"]\nТелефоны: ["+79161234567", "8-495-123-45-67"]\nДаты: [{"day": "15", "month": "03", "year": "2024"}]\nОчищено: "Привет мир текст"',
      hint: 'Email: r"[\\w.+-]+@[\\w-]+\\.[\\w]+". Для дат используй именованные группы: (?P<day>\\d{2}).(?P<month>\\d{2}).(?P<year>\\d{4}).',
      solution: 'import re\n\ndef extract_emails(text: str) -> list:\n    pattern = r"[\\w.+-]+@[\\w-]+\\.[\\w.]+"\n    return re.findall(pattern, text)\n\ndef extract_phones(text: str) -> list:\n    pattern = r"\\+7\\d{10}|8-\\d{3}-\\d{3}-\\d{2}-\\d{2}"\n    return re.findall(pattern, text)\n\ndef extract_dates(text: str) -> list:\n    pattern = r"(?P<day>\\d{2})\\.(?P<month>\\d{2})\\.(?P<year>\\d{4})"\n    return [m.groupdict() for m in re.finditer(pattern, text)]\n\ndef clean_text(text: str) -> str:\n    no_tags = re.sub(r"<[^>]+>", "", text)\n    clean = re.sub(r"\\s+", " ", no_tags)\n    return clean.strip()\n\ntest_text = """\n    Контакты: alice@mail.ru и bob@gmail.com\n    Тел: +79161234567, 8-495-123-45-67\n    Дата мероприятия: 15.03.2024\n    <h1>Привет   мир</h1>   <p>текст</p>\n"""\n\nprint(f"Emails: {extract_emails(test_text)}")\nprint(f"Телефоны: {extract_phones(test_text)}")\nprint(f"Даты: {extract_dates(test_text)}")\nprint(f"Очищено: \'{clean_text(test_text)}\'")',
      explanation: 'Каждая функция решает конкретную задачу с помощью специализированного паттерна. extract_dates использует именованные группы и groupdict() для структурированного результата. clean_text применяет sub() последовательно — сначала удаляет теги, потом нормализует пробелы.'
    }
  ]
}
