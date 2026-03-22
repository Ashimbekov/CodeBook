export default {
  id: 12,
  title: 'Few-shot примеры',
  description: 'Техника few-shot prompting: использование примеров input/output для обучения модели нужному формату и поведению без дообучения',
  lessons: [
    {
      id: 1,
      title: 'Что такое few-shot prompting?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Few-shot prompting — техника, при которой в промпт включаются несколько примеров (shots) желаемого поведения. Модель "понимает паттерн" из примеров и применяет его к новому вводу.' },
        { type: 'tip', value: 'Это как показать новому сотруднику 3 заполненных отчёта и сказать "делай так же". Он не читал инструкцию, но понял формат из примеров.' },
        { type: 'heading', value: 'Базовая структура few-shot' },
        { type: 'code', language: 'python', value: 'few_shot_prompt = """\nПреобразуй дату из формата DD.MM.YYYY в YYYY-MM-DD.\n\nПример 1:\nВход: 15.03.2024\nВыход: 2024-03-15\n\nПример 2:\nВход: 01.01.2023\nВыход: 2023-01-01\n\nПример 3:\nВход: 31.12.2025\nВыход: 2025-12-31\n\nТеперь преобразуй:\nВход: 07.08.2024\nВыход:"""' },
        { type: 'heading', value: 'Zero-shot для сравнения' },
        { type: 'code', language: 'python', value: 'zero_shot_prompt = """\nПреобразуй дату 07.08.2024 из формата DD.MM.YYYY в YYYY-MM-DD.\n"""' },
        { type: 'note', value: 'Few-shot особенно ценен когда нужен конкретный формат вывода: модель видит примеры и точно следует структуре.' }
      ]
    },
    {
      id: 2,
      title: 'Форматирование примеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Формат примеров влияет на качество результата. Хорошее форматирование — чёткое разделение между примерами, последовательная структура, ясные метки.' },
        { type: 'heading', value: 'Стиль 1: Метки Input/Output' },
        { type: 'code', language: 'python', value: 'prompt = """\nОпределяй тональность текста (позитивная/негативная/нейтральная).\n\nInput: Отличный продукт, очень доволен покупкой!\nOutput: позитивная\n\nInput: Качество среднее, ничего особенного.\nOutput: нейтральная\n\nInput: Ужасный сервис, больше не приду.\nOutput: негативная\n\nInput: {new_text}\nOutput:"""' },
        { type: 'heading', value: 'Стиль 2: Вопрос/Ответ' },
        { type: 'code', language: 'python', value: 'prompt = """\nПримеры классификации запросов поддержки:\n\nЗапрос: Не могу войти в аккаунт\nКатегория: Аутентификация\nПриоритет: Высокий\n\nЗапрос: Как изменить цвет темы?\nКатегория: Настройки UI\nПриоритет: Низкий\n\nЗапрос: Платёж завис в обработке уже 2 дня\nКатегория: Платежи\nПриоритет: Критический\n\nЗапрос: {new_request}\nКатегория:\nПриоритет:"""' },
        { type: 'heading', value: 'Стиль 3: Структурированный JSON' },
        { type: 'code', language: 'python', value: 'prompt = """\nИзвлекай данные из текста в JSON.\n\nТекст: "Иван Петров, 35 лет, iOS разработчик"\nJSON: {"name": "Иван Петров", "age": 35, "role": "iOS разработчик"}\n\nТекст: "Айгерим Жакупова, специалист по ML, 28 лет"\nJSON: {"name": "Айгерим Жакупова", "age": 28, "role": "специалист по ML"}\n\nТекст: "{input_text}"\nJSON:"""' },
        { type: 'tip', value: 'Выбирайте стиль форматирования и держитесь его во всех примерах. Непоследовательное форматирование сбивает модель с толку.' }
      ]
    },
    {
      id: 3,
      title: 'Пары input/output: правила составления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Качество few-shot промпта определяется качеством примеров. Плохие примеры обучают модель плохому поведению. Вот правила составления хороших пар.' },
        { type: 'heading', value: 'Правило 1: Полное покрытие паттернов' },
        { type: 'code', language: 'python', value: '# Плохо — все примеры одного типа\nbad_examples = """\nПример 1: число 5 -> "пять"\nПример 2: число 7 -> "семь"\nПример 3: число 3 -> "три"\n"""\n\n# Хорошо — разные краевые случаи\ngood_examples = """\nПример 1 (простое): число 5 -> "пять"\nПример 2 (составное): число 23 -> "двадцать три"\nПример 3 (сотни): число 300 -> "триста"\nПример 4 (ноль): число 0 -> "ноль"\n"""' },
        { type: 'heading', value: 'Правило 2: Реалистичные примеры' },
        { type: 'code', language: 'python', value: '# Плохо — искусственные примеры\nbad = """\nInput: hello world\nOutput: HELLO WORLD\n\nInput: foo bar\nOutput: FOO BAR\n"""\n\n# Хорошо — реальные данные похожие на боевые\ngood = """\nInput: заголовок новости о технологиях\nOutput: ЗАГОЛОВОК НОВОСТИ О ТЕХНОЛОГИЯХ\n\nInput: объявление о вакансии\nOutput: ОБЪЯВЛЕНИЕ О ВАКАНСИИ\n"""' },
        { type: 'heading', value: 'Правило 3: Правильные ответы' },
        { type: 'note', value: 'Никогда не включайте примеры с неправильными ответами — даже для иллюстрации "неправильного". Модель учится на ВСЕХ примерах, в том числе "неправильных".' },
        { type: 'tip', value: 'Золотое правило: примеры — это обучающие данные. Мусор на входе — мусор на выходе.' }
      ]
    },
    {
      id: 4,
      title: 'Выбор хороших примеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все примеры одинаково полезны. Правильный выбор примеров — ключ к эффективному few-shot промпту.' },
        { type: 'heading', value: 'Критерии отбора примеров' },
        { type: 'list', items: [
          'Разнообразие: примеры должны покрывать разные случаи',
          'Сложность: включи простые и сложные примеры',
          'Релевантность: примеры близкие к реальному вводу',
          'Однозначность: правильный ответ не должен вызывать сомнений',
          'Краткость: не слишком длинные — модель теряет фокус'
        ]},
        { type: 'heading', value: 'Техника: динамический выбор примеров' },
        { type: 'code', language: 'python', value: 'from typing import List\nimport anthropic\n\n# Заготовленные примеры для разных типов задач\nEXAMPLES = {\n    "greeting": [\n        {"input": "hi", "output": "Привет!"},\n        {"input": "good morning", "output": "Доброе утро!"},\n    ],\n    "question": [\n        {"input": "how are you?", "output": "Как дела?"},\n        {"input": "what time is it?", "output": "Сколько времени?"},\n    ],\n    "command": [\n        {"input": "please translate", "output": "Пожалуйста, переведи."},\n        {"input": "help me", "output": "Помоги мне."},\n    ]\n}\n\ndef build_few_shot_prompt(user_input: str, examples: List[dict]) -> str:\n    prompt = "Переводи английский на русский, сохраняя тон.\\n\\n"\n    for ex in examples:\n        prompt += f"Английский: {ex[\'input\']}\\n"\n        prompt += f"Русский: {ex[\'output\']}\\n\\n"\n    prompt += f"Английский: {user_input}\\nРусский:"\n    return prompt' },
        { type: 'code', language: 'python', value: 'client = anthropic.Anthropic()\n\ndef translate_with_examples(text: str, num_examples: int = 3):\n    all_examples = []\n    for examples in EXAMPLES.values():\n        all_examples.extend(examples)\n    \n    selected = all_examples[:num_examples]\n    prompt = build_few_shot_prompt(text, selected)\n    \n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=256,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text\n\nprint(translate_with_examples("open the door"))' }
      ]
    },
    {
      id: 5,
      title: 'Zero-shot vs Few-shot vs Many-shot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Количество примеров в промпте влияет на поведение модели по-разному. Нет универсального ответа "сколько нужно" — зависит от задачи.' },
        { type: 'heading', value: 'Zero-shot (0 примеров)' },
        { type: 'code', language: 'python', value: '# Полагаемся только на предобученные знания\nzero_shot = "Переведи на французский: Привет, как дела?"' },
        { type: 'heading', value: 'One-shot (1 пример)' },
        { type: 'code', language: 'python', value: '# Один пример задаёт формат\none_shot = """\nПример:\nРусский: Добрый день!\nФранцузский: Bonjour!\n\nРусский: Как вас зовут?\nФранцузский:"""' },
        { type: 'heading', value: 'Few-shot (2-5 примеров)' },
        { type: 'code', language: 'python', value: '# Оптимальный баланс для большинства задач\nfew_shot = """\n[2-5 примеров разных типов]\n"""' },
        { type: 'heading', value: 'Many-shot (10+ примеров)' },
        { type: 'code', language: 'python', value: '# Для сложной классификации или нестандартных форматов\n# Занимает много токенов — учитывай стоимость\nmany_shot = """\n[10-20 примеров покрывающих все краевые случаи]\n"""' },
        { type: 'list', items: [
          'Zero-shot: простые задачи, стандартные форматы',
          'One-shot: задаём формат вывода',
          'Few-shot (3-5): большинство задач классификации и трансформации',
          'Many-shot (10+): сложная классификация с тонкими различиями',
          'Больше 20: обычно нет смысла, используй fine-tuning'
        ]},
        { type: 'tip', value: 'Начинай с zero-shot. Если ошибки — добавляй примеры постепенно. Часто 2-3 хороших примера решают задачу полностью.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Few-shot классификатор тикетов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай функцию classify_ticket(), которая классифицирует тикеты службы поддержки по категории (Billing/Technical/Account/General) и приоритету (Low/Medium/High/Critical) используя few-shot промпт с минимум 4 примерами.',
      requirements: [
        'Функция classify_ticket(ticket_text: str) -> dict',
        'Промпт содержит минимум 4 примера разных категорий',
        'Возвращает dict с ключами category и priority',
        'Примеры должны покрывать все 4 категории',
        'Протестировать на 3 разных тикетах'
      ],
      expectedOutput: '{"category": "Technical", "priority": "High"}\n{"category": "Billing", "priority": "Critical"}\n{"category": "Account", "priority": "Medium"}',
      hint: 'В конце промпта оставь незаполненное поле для нового тикета. Используй re или json.loads() для парсинга ответа. Попроси модель отвечать только JSON.',
      solution: 'import json\nimport re\nimport anthropic\n\nclient = anthropic.Anthropic()\n\nEXAMPLES = [\n    {\n        "ticket": "Мне выставили двойной счёт за прошлый месяц",\n        "category": "Billing",\n        "priority": "High"\n    },\n    {\n        "ticket": "Приложение вылетает при открытии настроек",\n        "category": "Technical",\n        "priority": "High"\n    },\n    {\n        "ticket": "Не могу сменить пароль — кнопка не работает",\n        "category": "Account",\n        "priority": "Medium"\n    },\n    {\n        "ticket": "Как подключить двухфакторную аутентификацию?",\n        "category": "General",\n        "priority": "Low"\n    },\n    {\n        "ticket": "Сервис недоступен уже 3 часа, теряем деньги",\n        "category": "Technical",\n        "priority": "Critical"\n    }\n]\n\ndef classify_ticket(ticket_text: str) -> dict:\n    prompt = "Классифицируй тикет поддержки. Отвечай только JSON.\\n\\n"\n    \n    for ex in EXAMPLES:\n        prompt += f"Тикет: {ex[\'ticket\']}\\n"\n        prompt += f\'Ответ: {{"category": "{ex[\'category\']}", "priority": "{ex[\'priority\']}"}}\'\n        prompt += "\\n\\n"\n    \n    prompt += f"Тикет: {ticket_text}\\nОтвет:"\n    \n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=64,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    \n    text = response.content[0].text.strip()\n    try:\n        return json.loads(text)\n    except json.JSONDecodeError:\n        m = re.search(r\'\\{.*?\\}\', text, re.DOTALL)\n        return json.loads(m.group()) if m else {"category": "General", "priority": "Low"}\n\ntests = [\n    "API возвращает 500 ошибку при создании заказа",\n    "С моей карты сняли деньги но подписка не активирована",\n    "Хочу удалить свой аккаунт"\n]\n\nfor test in tests:\n    result = classify_ticket(test)\n    print(f"Тикет: {test[:50]}...")\n    print(f"Результат: {result}\\n")',
      explanation: 'Few-shot промпт с 5 примерами покрывает все категории и уровни приоритета. Формат примеров точно совпадает с ожидаемым форматом ответа — модель видит паттерн и воспроизводит его. Двойной парсинг (json.loads + regex fallback) делает код устойчивым к незначительным отклонениям в ответе.'
    }
  ]
}
