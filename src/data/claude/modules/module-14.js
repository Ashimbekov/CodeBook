export default {
  id: 14,
  title: 'Промпты для кода',
  description: 'Эффективные промпты для задач программирования: генерация, ревью, отладка, рефакторинг, тесты, документация, объяснение и перевод кода между языками',
  lessons: [
    {
      id: 1,
      title: 'Промпты для генерации кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Генерация кода — одна из сильнейших сторон Claude. Ключ к качественному коду — максимальная конкретность в промпте: язык, версия, стиль, зависимости, edge cases.' },
        { type: 'heading', value: 'Структура промпта для генерации кода' },
        { type: 'code', language: 'python', value: 'code_gen_template = """\n[КОНТЕКСТ]\nЯзык: Python 3.11\nФреймворк: FastAPI\nСтиль: type hints везде, docstrings в Google-стиле\n\n[ЗАДАЧА]\nСоздай endpoint для регистрации пользователя.\n\n[ТРЕБОВАНИЯ]\n- POST /api/v1/auth/register\n- Принимает: email, password, username\n- Валидация через Pydantic\n- Хеширование пароля через bcrypt\n- Возвращает: user_id, email, created_at\n- Обработка: дубликат email -> 409 Conflict\n\n[ЗАВИСИМОСТИ]\n- fastapi, pydantic, passlib[bcrypt], sqlalchemy\n\n[НЕ НУЖНО]\n- JWT-токены (только регистрация)\n- Работа с базой данных (заглушка)\n"""' },
        { type: 'tip', value: 'Чем детальнее контекст — тем лучше код. Укажи версию Python, используемые библиотеки, соглашения по именованию.' },
        { type: 'heading', value: 'Пример API-запроса' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef generate_code(task: str, context: str) -> str:\n    prompt = f"""\nЯ пишу на {context}.\nЗадача: {task}\n\nТребования к коду:\n- Добавь type hints\n- Обработай ошибки через try/except\n- Добавь краткий комментарий для каждой функции\n- Код должен быть готов к запуску\n\nВерни только код, без пояснений.\n"""\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=2048,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text' }
      ]
    },
    {
      id: 2,
      title: 'Промпты для ревью кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude — отличный code reviewer. Правильный промпт для ревью фокусирует внимание на конкретных аспектах: безопасность, производительность, читаемость.' },
        { type: 'heading', value: 'Полный ревью-промпт' },
        { type: 'code', language: 'python', value: 'code_to_review = """\ndef get_user(user_id):\n    conn = sqlite3.connect(\'db.sqlite\')\n    cursor = conn.cursor()\n    query = f\'SELECT * FROM users WHERE id = {user_id}\'\n    cursor.execute(query)\n    result = cursor.fetchone()\n    return result\n"""\n\nreview_prompt = f"""\nВыполни code review следующего Python-кода.\n\n```python\n{code_to_review}\n```\n\nПроверь по категориям:\n\n**Безопасность** (наивысший приоритет)\n**Производительность**\n**Читаемость и стиль**\n**Обработка ошибок**\n**Соответствие best practices**\n\nДля каждой проблемы:\n- Severity: Critical/High/Medium/Low\n- Строка: [номер]\n- Проблема: [описание]\n- Решение: [как исправить + пример кода]\n\nВ конце: оценка /10 и итоговый резюме.\n"""' },
        { type: 'warning', value: 'Пример выше содержит SQL-инъекцию! Именно так и выглядит уязвимость в реальном коде. Claude должен её найти.' },
        { type: 'heading', value: 'Специализированный ревью' },
        { type: 'code', language: 'python', value: '# Только безопасность\nsecurity_review = f"""\nПроверь код ТОЛЬКО на уязвимости безопасности.\nИспользуй классификацию OWASP Top 10.\nКод: {code}\n"""\n\n# Только производительность  \nperf_review = f"""\nПроанализируй производительность кода.\nОцени Big O для каждой функции.\nНайди узкие места (bottlenecks).\nКод: {code}\n"""' }
      ]
    },
    {
      id: 3,
      title: 'Промпты для отладки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отладка с Claude эффективна когда предоставляешь максимум контекста: код, ошибку, стектрейс, что уже пробовал.' },
        { type: 'heading', value: 'Шаблон отладочного промпта' },
        { type: 'code', language: 'python', value: 'debug_template = """\n**Код:**\n```python\n{code}\n```\n\n**Ошибка:**\n```\n{error_message}\n{traceback}\n```\n\n**Контекст:**\n- Python версия: {version}\n- ОС: {os}\n- Зависимости: {deps}\n\n**Что я уже пробовал:**\n{tried_solutions}\n\n**Вопрос:**\nПочему возникает ошибка и как исправить?\n"""' },
        { type: 'code', language: 'python', value: 'import traceback\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef debug_code(code: str, error: Exception) -> str:\n    tb = traceback.format_exc()\n    prompt = f"""\nПомоги исправить ошибку в Python-коде.\n\nКод:\n```python\n{code}\n```\n\nОшибка: {type(error).__name__}: {error}\n\nStacktrace:\n```\n{tb}\n```\n\nОбъясни:\n1. Почему возникает ошибка\n2. Как исправить\n3. Покажи исправленный код\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text' },
        { type: 'tip', value: 'Всегда включай полный stacktrace, не только последнюю строку. Claude использует цепочку вызовов для точной диагностики.' }
      ]
    },
    {
      id: 4,
      title: 'Промпты для рефакторинга',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рефакторинг с Claude — мощный инструмент. Важно чётко указать цель рефакторинга и ограничения (сохранить интерфейс, не менять логику).' },
        { type: 'heading', value: 'Рефакторинг с сохранением поведения' },
        { type: 'code', language: 'python', value: 'refactor_prompt = """\nВыполни рефакторинг следующего кода.\n\n**Исходный код:**\n```python\n{original_code}\n```\n\n**Цели рефакторинга:**\n- Улучшить читаемость\n- Убрать дублирование (DRY)\n- Следовать принципам SOLID\n- Добавить type hints\n\n**Ограничения:**\n- НЕ менять публичный интерфейс функций\n- НЕ менять бизнес-логику\n- Сохранить совместимость с Python 3.9+\n\n**Формат ответа:**\n1. Что было плохо в исходном коде\n2. Рефакторированный код\n3. Что изменилось и почему\n"""' },
        { type: 'heading', value: 'Специфические виды рефакторинга' },
        { type: 'code', language: 'python', value: '# Преобразование в функциональный стиль\nfunctional_prompt = """\nПерепиши код используя функциональный стиль Python:\nmap/filter/reduce, list comprehensions, functools.\nСохрани результат идентичным.\nКод: {code}\n"""\n\n# Паттерны проектирования\npattern_prompt = """\nАпплицируй паттерн Strategy к следующему коду.\nОбъясни почему этот паттерн подходит.\nКод: {code}\n"""' }
      ]
    },
    {
      id: 5,
      title: 'Промпты для генерации тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude отлично генерирует тесты — особенно если указать фреймворк, типы тестов (unit/integration) и важные edge cases.' },
        { type: 'heading', value: 'Шаблон для генерации тестов' },
        { type: 'code', language: 'python', value: 'test_gen_prompt = """\nНапиши тесты для следующей функции.\n\n**Функция:**\n```python\n{function_code}\n```\n\n**Требования к тестам:**\n- Фреймворк: pytest\n- Покрытие: минимум 90%\n- Включи:\n  * Happy path (нормальное использование)\n  * Edge cases (граничные случаи)\n  * Error cases (некорректный ввод)\n  * Boundary values (0, -1, None, пустая строка)\n\n**Стиль:**\n- Описательные имена: test_should_return_x_when_y\n- Каждый тест проверяет ОДНО утверждение\n- Используй parametrize для похожих случаев\n- Добавь docstring для неочевидных тестов\n"""' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef generate_tests(function_code: str, function_name: str) -> str:\n    prompt = f"""\nНапиши pytest-тесты для функции {function_name}.\n\nКод:\n```python\n{function_code}\n```\n\nСоздай тесты покрывающие:\n1. Обычные входные данные\n2. Граничные значения\n3. Некорректный ввод\n4. Крайние случаи\n\nВерни только код тестов, без пояснений.\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=2048,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text' },
        { type: 'tip', value: 'Попроси Claude также объяснить какие именно edge cases он покрывает и почему. Это помогает понять что тестируется.' }
      ]
    },
    {
      id: 6,
      title: 'Промпты для документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Генерация документации — задача где Claude значительно экономит время. Можно получить docstrings, README, API-документацию, инлайн-комментарии.' },
        { type: 'heading', value: 'Генерация docstrings' },
        { type: 'code', language: 'python', value: 'docstring_prompt = """\nДобавь docstrings в Google-стиле к каждой функции.\n\nТребования:\n- Краткое описание (1 строка)\n- Args: каждый параметр с типом и описанием\n- Returns: тип и описание возвращаемого значения\n- Raises: если есть исключения\n- Пример использования (если неочевидно)\n\nКод:\n```python\n{code}\n```\n\nВерни полный код с добавленными docstrings.\n"""' },
        { type: 'heading', value: 'Генерация README для проекта' },
        { type: 'code', language: 'python', value: 'readme_prompt = """\nСоздай README.md для следующего Python-проекта.\n\nСтруктура проекта:\n{project_structure}\n\nОсновной модуль:\n```python\n{main_code}\n```\n\nВключи разделы:\n1. Описание проекта (2-3 предложения)\n2. Установка (pip install ...)\n3. Быстрый старт (5-минутный пример)\n4. API Reference (основные функции)\n5. Примеры использования\n6. Требования\n\nЯзык: русский\nСтиль: технический, без воды\n"""' }
      ]
    },
    {
      id: 7,
      title: 'Объяснение кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude умеет объяснять код на любом уровне — от "объясни новичку" до "какова алгоритмическая сложность". Правильный промпт задаёт нужный уровень детализации.' },
        { type: 'heading', value: 'Уровни объяснения' },
        { type: 'code', language: 'python', value: '# Для новичка\nbegin_prompt = """\nОбъясни этот код простыми словами как для человека который\nтолько начал программировать. Используй аналогии из жизни.\nКод: {code}\n"""\n\n# Для специалиста\nexpert_prompt = """\nПроанализируй этот код:\n1. Алгоритмическая сложность (Big O)\n2. Паттерны и архитектурные решения\n3. Потенциальные проблемы в production\n4. Альтернативные подходы\nКод: {code}\n"""\n\n# Построчное объяснение\nline_by_line = """\nОбъясни каждую строку кода добавив комментарий.\nСохрани функциональность, добавь # комментарии.\nКод: {code}\n"""' },
        { type: 'heading', value: 'Объяснение сложных алгоритмов' },
        { type: 'code', language: 'python', value: 'algo_explain_prompt = """\nОбъясни этот алгоритм:\n1. Что он делает (1 предложение)\n2. Как работает (пошагово с примером на входе [1,3,2,5,4])\n3. Почему работает (математическое обоснование)\n4. Когда использовать\n5. Ограничения\n\nАлгоритм:\n```python\n{code}\n```\n"""' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Перевод кода между языками',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему code_translator(), которая переводит Python-код на JavaScript (Node.js). Функция должна сохранить логику, адаптировать идиомы (list comprehension -> Array.map/filter), обработать различия в типах данных и вернуть рабочий JS-код с объяснением изменений.',
      requirements: [
        'Функция code_translator(python_code: str, target_lang: str) -> dict',
        'Возвращает dict с ключами: translated_code, changes, notes',
        'Промпт требует сохранить логику и адаптировать идиомы',
        'Обработать: list comprehension, dict/list -> object/array, print -> console.log',
        'Протестировать на функции сортировки и фильтрации'
      ],
      expectedOutput: '{\n  "translated_code": "function sortAndFilter(arr) {...}",\n  "changes": ["list comprehension -> Array.filter().map()", ...],\n  "notes": "async/await не нужен для этого кода"\n}',
      hint: 'В промпте явно перечисли соответствия: Python list -> JS Array, dict -> object, None -> null, True/False -> true/false, range() -> for...of. Попроси возвращать JSON с тремя полями.',
      solution: 'import json\nimport re\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef code_translator(python_code: str, target_lang: str = "javascript") -> dict:\n    lang_notes = {\n        "javascript": """\n- list -> Array\n- dict -> object\n- None -> null\n- True/False -> true/false\n- print() -> console.log()\n- list comprehension -> Array.map/filter\n- f-string -> template literal\n- len() -> .length\n- range(n) -> for (let i = 0; i < n; i++)\n- // integer division -> Math.floor(a/b)\n"""\n    }\n    \n    prompt = f"""\nПереведи Python-код на {target_lang}.\n\nПравила перевода:\n{lang_notes.get(target_lang, "")}\n\nТребования:\n- Сохрани точную логику\n- Адаптируй идиомы (не дословный перевод)\n- Код должен быть рабочим\n- Следуй стилю целевого языка\n\nPython-код:\n```python\n{python_code}\n```\n\nВерни JSON:\n{{\n  "translated_code": "переведённый код",\n  "changes": ["список изменений"],\n  "notes": "важные замечания"\n}}\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=2048,\n        messages=[\n            {"role": "user", "content": prompt},\n            {"role": "assistant", "content": "{"}\n        ]\n    )\n    raw = "{" + response.content[0].text\n    return json.loads(raw)\n\npython_code = """\ndef process_students(students):\n    passed = [s for s in students if s["grade"] >= 60]\n    result = [\n        {"name": s["name"], "grade": s["grade"], "status": "passed"}\n        for s in sorted(passed, key=lambda x: x["grade"], reverse=True)\n    ]\n    return result\n"""\n\nresult = code_translator(python_code)\nprint("Переведённый код:")\nprint(result.get("translated_code", ""))\nprint("\\nИзменения:")\nfor change in result.get("changes", []):\n    print(f"  - {change}")',
      explanation: 'Промпт явно перечисляет соответствия между языками — это устраняет двусмысленность. Prefill "{" гарантирует JSON-ответ. Перевод идиом (list comprehension -> Array.map/filter) важнее дословного перевода — идиоматичный код на целевом языке читается естественно. dict с тремя ключами разделяет код, описание изменений и важные замечания.'
    }
  ]
}
