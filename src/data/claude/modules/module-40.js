export default {
  id: 40,
  title: 'Стоимость и оптимизация затрат',
  description: 'Разбираем модель ценообразования Anthropic API, считаем стоимость запросов, изучаем стратегии снижения затрат: короткие промпты, кеширование, батчи и выбор подходящей модели.',
  lessons: [
    {
      id: 1,
      title: 'Модель ценообразования',
      content: [
        {
          type: 'heading',
          value: 'Как считается стоимость в Anthropic API'
        },
        {
          type: 'text',
          value: 'Anthropic API тарифицируется за токены: отдельно за входящие (input) и исходящие (output) токены. Исходящие токены обычно стоят дороже. Токен — это примерно 4 символа английского текста или 2-3 символа русского.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Актуальные цены Anthropic API (за 1 миллион токенов, USD)\n# Проверяйте актуальные цены на anthropic.com/pricing\n\nPRICING = {\n    "claude-opus-4-5": {\n        "input": 15.00,       # $15 за 1M входящих токенов\n        "output": 75.00,      # $75 за 1M исходящих токенов\n        "cache_write": 18.75, # $18.75 за 1M (запись в кеш)\n        "cache_read": 1.50,   # $1.50 за 1M (чтение из кеша)\n    },\n    "claude-sonnet-4-5": {\n        "input": 3.00,\n        "output": 15.00,\n        "cache_write": 3.75,\n        "cache_read": 0.30,\n    },\n    "claude-haiku-3-5": {\n        "input": 0.80,\n        "output": 4.00,\n        "cache_write": 1.00,\n        "cache_read": 0.08,\n    },\n}\n\ndef calculate_cost(\n    input_tokens: int,\n    output_tokens: int,\n    model: str = "claude-opus-4-5",\n    cache_write_tokens: int = 0,\n    cache_read_tokens: int = 0\n) -> float:\n    """Рассчитать стоимость запроса в USD"""\n    prices = PRICING.get(model, PRICING["claude-opus-4-5"])\n    cost = (\n        input_tokens * prices["input"] / 1_000_000 +\n        output_tokens * prices["output"] / 1_000_000 +\n        cache_write_tokens * prices["cache_write"] / 1_000_000 +\n        cache_read_tokens * prices["cache_read"] / 1_000_000\n    )\n    return cost\n\n# Пример\ncost = calculate_cost(\n    input_tokens=1000,\n    output_tokens=500,\n    model="claude-opus-4-5"\n)\nprint(f"Стоимость: ${cost:.6f}")  # ~$0.052500'
        },
        {
          type: 'tip',
          value: 'Цены Anthropic регулярно обновляются — всегда проверяйте актуальные тарифы на anthropic.com/pricing. Здесь приведены ориентировочные значения для понимания соотношения стоимости моделей.'
        }
      ]
    },
    {
      id: 2,
      title: 'Расчёт стоимости запросов',
      content: [
        {
          type: 'heading',
          value: 'Практический расчёт и мониторинг расходов'
        },
        {
          type: 'text',
          value: 'Каждый ответ API содержит поле usage с точным количеством токенов. Это позволяет точно считать стоимость каждого запроса и прогнозировать месячные расходы.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nPRICING_PER_M = {\n    "claude-opus-4-5": {"input": 15.0, "output": 75.0},\n    "claude-sonnet-4-5": {"input": 3.0, "output": 15.0},\n    "claude-haiku-3-5": {"input": 0.8, "output": 4.0},\n}\n\nclass CostTracker:\n    def __init__(self):\n        self.total_cost = 0.0\n        self.requests = []\n\n    def track(self, response, model: str):\n        prices = PRICING_PER_M.get(model, PRICING_PER_M["claude-opus-4-5"])\n        usage = response.usage\n        cost = (\n            usage.input_tokens * prices["input"] / 1_000_000 +\n            usage.output_tokens * prices["output"] / 1_000_000\n        )\n        self.total_cost += cost\n        self.requests.append({\n            "model": model,\n            "input": usage.input_tokens,\n            "output": usage.output_tokens,\n            "cost": cost\n        })\n        return cost\n\n    def report(self):\n        print(f"\\nОтчёт о расходах:")\n        print(f"Всего запросов: {len(self.requests)}")\n        for i, req in enumerate(self.requests, 1):\n            print(f"  Запрос {i}: {req[\'model\']} | вх={req[\'input\']} | "\n                  f"исх={req[\'output\']} | ${req[\'cost\']:.6f}")\n        print(f"ИТОГО: ${self.total_cost:.6f}")\n\ntracker = CostTracker()\nmodel = "claude-haiku-3-5"\n\nfor question in ["Привет!", "2+2=?", "Столица Казахстана?"]:\n    r = client.messages.create(\n        model=model, max_tokens=50,\n        messages=[{"role": "user", "content": question}]\n    )\n    cost = tracker.track(r, model)\n    print(f"Запрос: \\"{question}\\\" | ${cost:.6f}")\n\ntracker.report()'
        }
      ]
    },
    {
      id: 3,
      title: 'Стратегии снижения затрат',
      content: [
        {
          type: 'heading',
          value: 'Практические способы оптимизации расходов'
        },
        {
          type: 'text',
          value: 'Есть несколько проверенных стратегий для снижения затрат без потери качества: выбор подходящей модели, сокращение промптов, кеширование, батч-обработка и управление историей диалога.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Стратегия 1: Выбирать минимально достаточную модель\n# Классификация не требует Opus — Haiku справится!\n\ndef classify_sentiment(text: str) -> str:\n    """Используем Haiku для простой классификации — в 18x дешевле Opus"""\n    response = client.messages.create(\n        model="claude-haiku-3-5",  # НЕ claude-opus-4-5!\n        max_tokens=10,              # минимум токенов для классификации\n        messages=[{\n            "role": "user",\n            "content": f"Тональность одним словом (позитивная/негативная/нейтральная):\\n{text}"\n        }]\n    )\n    return response.content[0].text.strip()\n\n# Стратегия 2: Минимизировать max_tokens\n# Не ставьте max_tokens=4096 для коротких ответов!\ndef get_short_answer(question: str) -> str:\n    response = client.messages.create(\n        model="claude-haiku-3-5",\n        max_tokens=150,  # достаточно для короткого ответа\n        messages=[{\n            "role": "user",\n            "content": question + " Ответь одним предложением."\n        }]\n    )\n    return response.content[0].text\n\n# Стратегия 3: Чёткие инструкции уменьшают вывод\ndef extract_name(text: str) -> str:\n    response = client.messages.create(\n        model="claude-haiku-3-5",\n        max_tokens=20,\n        messages=[{\n            "role": "user",\n            # Плохо: "Найди имя в тексте"\n            # Хорошо: конкретная инструкция с форматом\n            "content": f"Извлеки только имя из текста. Верни только имя, без пояснений.\\nТекст: {text}"\n        }]\n    )\n    return response.content[0].text.strip()\n\nprint(classify_sentiment("Замечательный продукт!"))\nprint(extract_name("Меня зовут Алибек Джаксыбеков"))'
        },
        {
          type: 'list',
          value: 'Выбор модели: Haiku в 18x дешевле Opus — используйте его для простых задач\nmax_tokens: ставьте минимально достаточное значение, не 4096 для коротких ответов\nКеширование: длинные системные промпты кешируйте — экономия 90% на повторных запросах\nБатчи: для массовых задач используйте Batches API — 50% скидка\nИстория: обрезайте длинные диалоги или суммаризируйте старые сообщения\nПромпт: чёткие инструкции дают короткие ответы, размытые — длинные и дорогие'
        }
      ]
    },
    {
      id: 4,
      title: 'Мониторинг расходов',
      content: [
        {
          type: 'heading',
          value: 'Отслеживание и прогнозирование бюджета'
        },
        {
          type: 'text',
          value: 'Без мониторинга легко получить неожиданный счёт. Несколько инструментов: Usage API для получения данных об использовании, бюджетные уведомления в консоли, встроенный учёт в коде.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nfrom datetime import datetime, date\n\nclient = anthropic.Anthropic()\n\n# Получить статистику использования через API\n# (Availability зависит от плана аккаунта)\ntry:\n    # Usage API — данные об использовании за период\n    # Доступно через консоль Anthropic\n    print("Для мониторинга расходов:")\n    print("1. Используйте console.anthropic.com/usage")\n    print("2. Настройте уведомления о расходах")\n    print("3. Используйте встроенный учёт в коде")\nexcept Exception as e:\n    print(f"Ошибка: {e}")\n\n# Встроенный учёт расходов в приложении\nclass BudgetManager:\n    def __init__(self, daily_budget_usd: float = 1.0):\n        self.daily_budget = daily_budget_usd\n        self.today_cost = 0.0\n        self.today = date.today()\n\n    def check_and_spend(self, estimated_cost: float) -> bool:\n        """Проверить лимит и разрешить/отклонить запрос"""\n        # Сброс дневного счётчика в полночь\n        if date.today() != self.today:\n            self.today_cost = 0.0\n            self.today = date.today()\n\n        if self.today_cost + estimated_cost > self.daily_budget:\n            print(f"Дневной бюджет исчерпан! "\n                  f"Потрачено: ${self.today_cost:.4f} из ${self.daily_budget}")\n            return False\n\n        self.today_cost += estimated_cost\n        remaining = self.daily_budget - self.today_cost\n        print(f"Расход: ${estimated_cost:.6f} | "\n              f"Дневной остаток: ${remaining:.4f}")\n        return True\n\nbudget = BudgetManager(daily_budget_usd=0.10)\n\nif budget.check_and_spend(0.001):\n    r = client.messages.create(\n        model="claude-haiku-3-5",\n        max_tokens=50,\n        messages=[{"role": "user", "content": "Привет!"}]\n    )\n    print(r.content[0].text)'
        },
        {
          type: 'note',
          value: 'В консоли Anthropic можно настроить автоматические уведомления: email при достижении $10, $50, $100 расходов за месяц. Это защитит от случайных бесконтрольных расходов при ошибках в коде (например, бесконечный цикл запросов).'
        }
      ]
    },
    {
      id: 5,
      title: 'Сравнение стоимости моделей',
      content: [
        {
          type: 'heading',
          value: 'Выбор оптимальной модели для каждой задачи'
        },
        {
          type: 'text',
          value: 'Правильный выбор модели — самый важный рычаг оптимизации затрат. Haiku стоит в 18-19 раз дешевле Opus, а для многих задач даёт сопоставимый результат.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Тест: одна задача, три модели, сравниваем качество и стоимость\nQUESTION = "Объясни что такое рекурсия в программировании. Ответь в 2-3 предложениях."\n\nMODELS = [\n    ("claude-haiku-3-5", 0.80, 4.00),\n    ("claude-sonnet-4-5", 3.00, 15.00),\n    ("claude-opus-4-5", 15.00, 75.00),\n]\n\nresults = []\nfor model, input_price, output_price in MODELS:\n    r = client.messages.create(\n        model=model,\n        max_tokens=200,\n        messages=[{"role": "user", "content": QUESTION}]\n    )\n    cost = (\n        r.usage.input_tokens * input_price / 1_000_000 +\n        r.usage.output_tokens * output_price / 1_000_000\n    )\n    results.append({\n        "model": model.split("-")[1],  # haiku/sonnet/opus\n        "answer_len": len(r.content[0].text),\n        "tokens_out": r.usage.output_tokens,\n        "cost": cost\n    })\n\nprint(f"{\'Модель\':<10} | {\'Симв\':<6} | {\'Токены\':<8} | Стоимость")\nprint("-" * 50)\nfor res in results:\n    print(f"{res[\'model\']:<10} | {res[\'answer_len\']:<6} | {res[\'tokens_out\']:<8} | ${res[\'cost\']:.6f}")\n\nref_cost = results[-1]["cost"]  # Opus как эталон\nprint("\\nОтносительная стоимость:")\nfor res in results:\n    ratio = ref_cost / res["cost"] if res["cost"] > 0 else 0\n    print(f"  {res[\'model\']}: в {ratio:.0f}x дешевле Opus")'
        },
        {
          type: 'list',
          value: 'Haiku: классификация, фильтрация, простые Q&A, перевод коротких текстов\nSonnet: большинство продакшен-задач, написание кода, анализ текста\nOpus: сложный анализ, исследовательские задачи, когда качество критично\nКомбинированный подход: Haiku для фильтрации + Opus только для прошедших фильтр задач'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Калькулятор оптимизации',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте инструмент для анализа эффективности использования API. Скрипт делает одинаковый запрос тремя моделями, сравнивает качество и стоимость, рекомендует оптимальную модель для задачи.',
      requirements: [
        'Отправить одинаковый запрос к claude-haiku-3-5, claude-sonnet-4-5, claude-opus-4-5',
        'Для каждой модели записать: текст ответа, токены (input+output), стоимость',
        'Вывести сравнительную таблицу: модель, токены, стоимость, длина ответа',
        'Рассчитать "ценность" как длина_ответа / стоимость (символов за цент)',
        'Определить и вывести рекомендацию: какая модель лучшая по соотношению цена/качество',
        'Рассчитать экономию при переходе с Opus на Haiku для 1000 запросов в день'
      ],
      expectedOutput: 'Задача: "Объясни ООП в 3 предложениях"\n\nМодель         | Токены | Стоимость  | Длина | Ценность\nclaude-haiku   |   145  | $0.000153  |  312  | 2039 симв/цент\nclaude-sonnet  |   162  | $0.000717  |  378  |  527 симв/цент\nclaude-opus    |   171  | $0.003480  |  401  |  115 симв/цент\n\nРекомендация: claude-haiku-3-5 (лучшее соотношение цена/качество)\nЭкономия при 1000 req/day (Haiku vs Opus): $3.33/день = $99.90/месяц',
      hint: 'Создайте список кортежей (model_name, input_price, output_price) и итерируйтесь по нему. Ценность = len(answer) / (cost * 100) для симв/цент. Для сравнения с Opus считайте разницу в daily_cost * 30.',
      solution: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nQUESTION = "Объясни ООП (объектно-ориентированное программирование) в 3 предложениях"\n\nMODELS = [\n    ("claude-haiku-3-5",  0.80,  4.00),\n    ("claude-sonnet-4-5", 3.00, 15.00),\n    ("claude-opus-4-5",  15.00, 75.00),\n]\n\nresults = []\n\nprint(f"Задача: \\"{QUESTION[:50]}...\\"")\nprint()\n\nfor model, inp_price, out_price in MODELS:\n    r = client.messages.create(\n        model=model,\n        max_tokens=300,\n        messages=[{"role": "user", "content": QUESTION}]\n    )\n    answer = r.content[0].text\n    inp_tok = r.usage.input_tokens\n    out_tok = r.usage.output_tokens\n    cost = inp_tok * inp_price / 1_000_000 + out_tok * out_price / 1_000_000\n    # Ценность: символов на цент (1 цент = 0.01 USD)\n    value = len(answer) / (cost * 100) if cost > 0 else 0\n\n    short_name = model.split("-")[1]  # haiku / sonnet / opus\n    results.append({\n        "model": model,\n        "short": short_name,\n        "tokens": inp_tok + out_tok,\n        "cost": cost,\n        "length": len(answer),\n        "value": value,\n    })\n\n# Таблица\nprint(f"{\'Модель\':<16} | {\'Токены\':<7} | {\'Стоимость\':<11} | {\'Длина\':<6} | Ценность")\nprint("-" * 65)\nfor res in results:\n    print(f"claude-{res[\'short\']:<9} | {res[\'tokens\']:<7} | \"\n          f"${res[\'cost\']:.6f}  | {res[\'length\']:<6} | {res[\'value\']:.0f} симв/цент")\n\n# Рекомендация: лучшая ценность\nbest = max(results, key=lambda x: x["value"])\nprint(f"\\nРекомендация: {best[\'model\']} (лучшее соотношение цена/качество)")\n\n# Экономия Haiku vs Opus за 1000 запросов\nhaiku_cost = results[0]["cost"]\nopus_cost = results[2]["cost"]\ndaily_savings = (opus_cost - haiku_cost) * 1000\nmonthly_savings = daily_savings * 30\nprint(f"Экономия при 1000 req/day (Haiku vs Opus): "\n      f"${daily_savings:.2f}/день = ${monthly_savings:.2f}/месяц")',
      explanation: 'Этот анализ помогает принять обоснованное решение о выборе модели. "Ценность" (символов за цент) — не идеальная метрика качества, но хорошо показывает соотношение цена/объём. Для реального проекта оценивайте качество по предметной метрике: точность классификации, оценка людьми, BLEU для перевода. Часто Haiku даёт 90% качества Opus за 5% цены — это делает его оптимальным для большинства продакшен-задач. Opus оставляйте для задач, где каждый процент качества критичен.'
    }
  ]
}
