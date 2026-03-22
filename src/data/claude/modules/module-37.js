export default {
  id: 37,
  title: 'Кеширование промптов',
  description: 'Изучаем prompt caching: как кешировать части запроса для снижения затрат и задержки. Разбираем cache_control, ephemeral кеш, попадания и промахи, стратегии кеширования.',
  lessons: [
    {
      id: 1,
      title: 'Концепция кеширования промптов',
      content: [
        {
          type: 'heading',
          value: 'Зачем кешировать части запроса'
        },
        {
          type: 'text',
          value: 'Prompt Caching позволяет сохранять обработанные части запроса на серверах Anthropic. При следующем запросе с теми же префиксами сервер использует кешированные данные вместо повторной обработки. Это снижает стоимость входящих токенов на 90% и уменьшает задержку на 85%.'
        },
        {
          type: 'text',
          value: 'Представьте, что вы отправляете тысячи запросов с одним и тем же системным промптом из 10000 токенов. Без кеширования каждый запрос платит за 10000 входящих токенов. С кешированием — только первый запрос платит полную цену, все последующие — 10% от стоимости.'
        },
        {
          type: 'list',
          value: 'Когда кешировать: длинные системные промпты (от 1024 токенов)\nКогда кешировать: большие документы для анализа\nКогда кешировать: базы знаний и примеры (few-shot)\nКогда кешировать: статический контекст, который редко меняется\nНе нужно кешировать: короткие промпты (overhead не оправдан)\nНе нужно кешировать: данные, которые меняются в каждом запросе'
        },
        {
          type: 'note',
          value: 'Кеш живёт 5 минут после последнего использования. При каждом cache hit таймер сбрасывается. Первый запрос после создания кеша немного дороже — он создаёт кеш (cache write). Последующие запросы — дешевле (cache read).'
        }
      ]
    },
    {
      id: 2,
      title: 'cache_control',
      content: [
        {
          type: 'heading',
          value: 'Разметка кешируемых частей промпта'
        },
        {
          type: 'text',
          value: 'Чтобы включить кеширование для части запроса, добавьте cache_control с type "ephemeral" к нужным блокам. Кешируется всё от начала запроса до маркера cache_control включительно.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Кеширование системного промпта\nresponse = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    system=[\n        {\n            "type": "text",\n            "text": """Ты эксперт по Python с 10-летним опытом.\nТы знаешь все стандартные библиотеки, лучшие практики,\nпаттерны проектирования и типичные ошибки разработчиков.\nОтвечай подробно с примерами кода...\n[Здесь может быть очень длинный системный промпт из тысяч токенов]\n""",\n            "cache_control": {"type": "ephemeral"}  # кешировать эту часть!\n        }\n    ],\n    messages=[\n        {"role": "user", "content": "Объясни list comprehension"}\n    ]\n)\n\nprint(response.content[0].text)\n\n# Проверяем статистику кеша\nusage = response.usage\nprint(f"\\nСтатистика:")\nprint(f"Входящих токенов: {usage.input_tokens}")\nif hasattr(usage, "cache_creation_input_tokens"):\n    print(f"Создание кеша: {usage.cache_creation_input_tokens}")\nif hasattr(usage, "cache_read_input_tokens"):\n    print(f"Чтение кеша: {usage.cache_read_input_tokens}")'
        },
        {
          type: 'tip',
          value: 'Минимальный размер кешируемого блока — 1024 токена для claude-opus-4-5 и claude-sonnet-4-5, 2048 для claude-haiku-3-5. Кеширование блоков меньше этого размера не работает.'
        }
      ]
    },
    {
      id: 3,
      title: 'Ephemeral кеширование',
      content: [
        {
          type: 'heading',
          value: 'Тип кеша: ephemeral'
        },
        {
          type: 'text',
          value: 'В настоящее время Anthropic поддерживает единственный тип кеша — ephemeral (эфемерный). Такой кеш живёт 5 минут. Это значит: если запросы идут часто (как в интерактивном приложении), кеш будет актуален и экономия максимальна.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\n\nclient = anthropic.Anthropic()\n\n# Большой документ для анализа (кешируем!)\ndocument = """\nГлава 1: Основы Python\nPython был создан Гвидо ван Россумом в 1991 году...\n[Очень длинный текст документа - 2000+ токенов]\n""" * 10  # имитируем длинный документ\n\ndef analyze_document(question: str):\n    return client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=512,\n        messages=[\n            {\n                "role": "user",\n                "content": [\n                    {\n                        "type": "text",\n                        "text": f"Документ для анализа:\\n{document}",\n                        "cache_control": {"type": "ephemeral"}  # кешируем документ\n                    },\n                    {\n                        "type": "text",\n                        "text": question  # вопрос НЕ кешируем (он меняется)\n                    }\n                ]\n            }\n        ]\n    )\n\n# Первый запрос: создаёт кеш (немного дороже)\nprint("Запрос 1 (создание кеша):")\nr1 = analyze_document("О чём этот документ?")\nusage1 = r1.usage\nprint(f"Cache creation: {getattr(usage1, \'cache_creation_input_tokens\', 0)}")\n\n# Второй запрос в течение 5 минут: использует кеш (90% дешевле!)\nprint("\\nЗапрос 2 (использование кеша):")\nr2 = analyze_document("Кто создал Python?")\nusage2 = r2.usage\nprint(f"Cache read: {getattr(usage2, \'cache_read_input_tokens\', 0)}")\nprint(f"Экономия очевидна!")'
        }
      ]
    },
    {
      id: 4,
      title: 'Cache hits и misses',
      content: [
        {
          type: 'heading',
          value: 'Мониторинг эффективности кеша'
        },
        {
          type: 'text',
          value: 'В ответе API поле usage содержит три статистики: input_tokens (некешированные токены), cache_creation_input_tokens (токены при записи в кеш), cache_read_input_tokens (токены из кеша). Это позволяет точно отслеживать эффективность.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nclass CacheStats:\n    def __init__(self):\n        self.cache_writes = 0\n        self.cache_reads = 0\n        self.regular_tokens = 0\n        self.requests = 0\n\n    def update(self, usage):\n        self.requests += 1\n        self.regular_tokens += usage.input_tokens\n        self.cache_writes += getattr(usage, "cache_creation_input_tokens", 0)\n        self.cache_reads += getattr(usage, "cache_read_input_tokens", 0)\n\n    def report(self):\n        total = self.regular_tokens + self.cache_writes + self.cache_reads\n        if total == 0:\n            return\n        # Стоимость cache_read в 10 раз ниже обычных токенов\n        cost_no_cache = total\n        cost_with_cache = (self.regular_tokens + self.cache_writes +\n                          self.cache_reads * 0.1)  # 10% от обычной цены\n        savings = cost_no_cache - cost_with_cache\n        print(f"Запросов: {self.requests}")\n        print(f"Обычные токены: {self.regular_tokens}")\n        print(f"Записей в кеш: {self.cache_writes}")\n        print(f"Чтений из кеша: {self.cache_reads}")\n        print(f"Экономия (условная): {savings:.0f} токенов")\n\nstats = CacheStats()\nSYSTEM = "Ты эксперт по Python. Отвечай кратко." + "x" * 2000  # длинный промпт\n\nfor i in range(3):\n    r = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=100,\n        system=[{"type": "text", "text": SYSTEM,\n                 "cache_control": {"type": "ephemeral"}}],\n        messages=[{"role": "user", "content": f"Вопрос {i}: что такое list?"}]\n    )\n    stats.update(r.usage)\n\nstats.report()'
        },
        {
          type: 'list',
          value: 'cache_creation_input_tokens > 0: кеш был создан (первый запрос или кеш устарел)\ncache_read_input_tokens > 0: кеш был использован (экономия 90%)\ncache_creation_input_tokens = 0 и cache_read_input_tokens = 0: кеш не применился (блок слишком мал)'
        }
      ]
    },
    {
      id: 5,
      title: 'Экономия на кешировании',
      content: [
        {
          type: 'heading',
          value: 'Расчёт реальной экономии'
        },
        {
          type: 'text',
          value: 'Цены на кешированные токены: cache write — 25% выше обычной цены (разовая операция), cache read — 10% от обычной цены. При частом использовании кеш окупается уже со второго запроса.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Расчёт экономии от кеширования\ndef calculate_savings(\n    system_tokens: int,\n    question_tokens: int,\n    n_requests: int,\n    price_per_1k_input: float = 0.015  # цена claude-opus-4-5 за 1000 входящих\n) -> dict:\n    """\n    Сравниваем стоимость с кешированием и без него.\n    cache_write стоит 1.25x обычной цены (разово)\n    cache_read стоит 0.1x обычной цены (каждый раз)\n    """\n    # Без кеширования\n    cost_no_cache = (system_tokens + question_tokens) * n_requests\n\n    # С кешированием\n    # Первый запрос: обычные вопросные токены + cache_write за системный\n    first_request = question_tokens + system_tokens * 1.25\n    # Последующие: обычные вопросные + cache_read за системный\n    subsequent = (question_tokens + system_tokens * 0.1) * (n_requests - 1)\n    cost_with_cache = first_request + subsequent\n\n    savings = cost_no_cache - cost_with_cache\n    savings_pct = (savings / cost_no_cache * 100) if cost_no_cache > 0 else 0\n    money_saved = savings / 1000 * price_per_1k_input\n\n    return {\n        "without_cache_tokens": cost_no_cache,\n        "with_cache_tokens": cost_with_cache,\n        "savings_tokens": savings,\n        "savings_pct": savings_pct,\n        "money_saved_usd": money_saved\n    }\n\n# Пример: системный промпт 5000 токенов, 100 запросов в день\nresult = calculate_savings(\n    system_tokens=5000,\n    question_tokens=50,\n    n_requests=100\n)\nprint(f"Без кеша: {result[\'without_cache_tokens\']} токенов")\nprint(f"С кешем: {result[\'with_cache_tokens\']:.0f} токенов")\nprint(f"Экономия: {result[\'savings_pct\']:.1f}% (${result[\'money_saved_usd\']:.4f})")'
        },
        {
          type: 'note',
          value: 'При 100 запросах в день с 5000-токенным системным промптом экономия составляет около 87%. За месяц это может быть существенная сумма для высоконагруженных приложений.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чат с кешированием',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте чат-бота с длинным системным промптом (имитируйте 2000+ токенов через повторение) и включите кеширование. Сделайте 5 запросов и сравните стоимость первого запроса (cache write) и последующих (cache read).',
      requirements: [
        'Создать длинный системный промпт минимум 1024 токена (повторить текст несколько раз)',
        'Добавить cache_control: {"type": "ephemeral"} к системному промпту',
        'Сделать 5 разных запросов к этому боту',
        'После каждого запроса выводить: обычные токены, cache_write, cache_read',
        'В конце вывести суммарную статистику и расчёт экономии',
        'Сравнить суммарную стоимость с кешем и без него'
      ],
      expectedOutput: 'Запрос 1: "Привет!"\n  Обычные входящие: 14\n  Cache write: 1247\n  Cache read: 0\n\nЗапрос 2: "Как дела?"\n  Обычные входящие: 13\n  Cache write: 0\n  Cache read: 1247\n\n...\n\nИтого:\n  Суммарно без кеша: 6320 токенов\n  Суммарно с кешем: 1456 токенов\n  Экономия: 77%',
      hint: 'Создайте LONG_SYSTEM = "Ты...\n" + "Дополнительный контекст... " * 100 для имитации длинного промпта. Проверяйте hasattr(usage, "cache_creation_input_tokens") перед чтением атрибутов кеша.',
      solution: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Создаём длинный системный промпт (имитация)\nBASE_SYSTEM = """Ты опытный ассистент по программированию.\nОтвечай дружелюбно, с примерами кода когда нужно.\nВсегда объясняй своё мышление.\n"""\n# Повторяем чтобы набрать 1024+ токенов\nLONG_SYSTEM = BASE_SYSTEM + ("Ты знаешь Python, JavaScript, Go, Rust и другие языки. " * 150)\n\nQUESTIONS = [\n    "Привет! Как дела?",\n    "Что такое переменная в программировании?",\n    "Как работает цикл for?",\n    "Что такое функция?",\n    "Объясни что такое список (list)"\n]\n\ntotal_regular = 0\ntotal_cache_write = 0\ntotal_cache_read = 0\n\nfor i, question in enumerate(QUESTIONS, 1):\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=256,\n        system=[\n            {\n                "type": "text",\n                "text": LONG_SYSTEM,\n                "cache_control": {"type": "ephemeral"}\n            }\n        ],\n        messages=[{"role": "user", "content": question}]\n    )\n\n    usage = response.usage\n    regular = usage.input_tokens\n    cache_write = getattr(usage, "cache_creation_input_tokens", 0)\n    cache_read = getattr(usage, "cache_read_input_tokens", 0)\n\n    total_regular += regular\n    total_cache_write += cache_write\n    total_cache_read += cache_read\n\n    print(f"Запрос {i}: \\"{question[:30]}...\\"")\n    print(f"  Обычные входящие: {regular}")\n    print(f"  Cache write: {cache_write}")\n    print(f"  Cache read: {cache_read}")\n    print()\n\n# Итоговая статистика\nsystem_tokens = total_cache_write if total_cache_write > 0 else total_cache_read\ntotal_with_cache = total_regular + total_cache_write + total_cache_read * 0.1\ntotal_no_cache = total_regular + (system_tokens * len(QUESTIONS))\nsavings_pct = (1 - total_with_cache / total_no_cache) * 100 if total_no_cache > 0 else 0\n\nprint("=" * 40)\nprint("Итого:")\nprint(f"  Суммарно без кеша (условно): {total_no_cache:.0f} токенов")\nprint(f"  Суммарно с кешем: {total_with_cache:.0f} токенов")\nprint(f"  Экономия: {savings_pct:.1f}%")',
      explanation: 'Кеширование системного промпта экономит токены при многократных запросах. Первый запрос создаёт кеш (cache_write > 0) — он немного дороже обычного. Все последующие запросы в течение 5 минут читают из кеша (cache_read > 0) — они стоят 10% от обычной цены. Статистика в usage.cache_creation_input_tokens и usage.cache_read_input_tokens позволяет точно отслеживать эффективность. Для длинных системных промптов (1000+ токенов) кеширование практически всегда выгодно при более чем 2 запросах.'
    }
  ]
}
