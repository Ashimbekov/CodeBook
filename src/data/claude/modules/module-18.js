export default {
  id: 18,
  title: 'Продвинутые техники промптинга',
  description: 'Продвинутые методы: мета-промптинг, саморефлексия, дебаты нескольких персон, Tree of Thought, цепочки промптов, автооптимизация и фреймворки оценки',
  lessons: [
    {
      id: 1,
      title: 'Мета-промптинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мета-промптинг — использование Claude для создания и улучшения промптов. Вместо того чтобы писать промпт вручную, вы описываете задачу и просите Claude создать оптимальный промпт для неё.' },
        { type: 'heading', value: 'Базовый мета-промптинг' },
        { type: 'code', language: 'python', value: 'meta_prompt = """\nТы эксперт по промпт-инженерии для Claude.\nЗадача: создай оптимальный промпт для следующей цели.\n\nЦель: [{описание задачи}]\nМодель: claude-haiku-4-5\nОграничения: [{ограничения}]\n\nСоздай промпт который:\n- Максимально конкретный\n- Включает необходимый контекст\n- Задаёт формат вывода\n- Обрабатывает edge cases\n\nОтвет: только готовый промпт, без пояснений.\n"""' },
        { type: 'heading', value: 'Итеративное улучшение промпта' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef improve_prompt(original_prompt: str, feedback: str) -> str:\n    meta = f"""\nИсходный промпт:\n{original_prompt}\n\nПроблема с текущим промптом:\n{feedback}\n\nУлучши промпт чтобы устранить проблему.\nСохрани хорошие части. Верни только улучшенный промпт.\n"""\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": meta}]\n    )\n    return response.content[0].text\n\n# Пример итерации\nprompt_v1 = "Напиши код для парсинга HTML"\nfeedback_1 = "Не указан язык и библиотека, не ясна цель парсинга"\nprompt_v2 = improve_prompt(prompt_v1, feedback_1)\nprint("V2:", prompt_v2)' },
        { type: 'tip', value: 'Мета-промптинг особенно ценен для создания шаблонных промптов которые будут использоваться многократно — стоит один раз сделать хорошо.' }
      ]
    },
    {
      id: 2,
      title: 'Промпты с саморефлексией',
      type: 'theory',
      content: [
        { type: 'text', value: 'Саморефлексия — просьба к Claude проверить и критически оценить свой собственный ответ перед финальным выводом. Это значительно снижает количество ошибок.' },
        { type: 'heading', value: 'Паттерн Generate-Critique-Revise' },
        { type: 'code', language: 'python', value: 'self_reflect_prompt = """\nЗадача: {task}\n\nШаг 1 — Сгенерируй ответ:\n[твой первоначальный ответ]\n\nШаг 2 — Критически оцени ответ:\n- Что могло пойти не так?\n- Есть ли фактические ошибки?\n- Пропущены ли важные аспекты?\n- Соответствует ли ответ задаче?\n\nШаг 3 — Улучшенный финальный ответ:\n[исправленная версия с учётом критики]\n"""' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef answer_with_reflection(question: str) -> dict:\n    prompt = f"""\nВопрос: {question}\n\n<draft>\nДай первоначальный ответ.\n</draft>\n\n<critique>\nКритически оцени свой ответ:\n- Правильно ли? Есть ли ошибки?\n- Полно ли? Что пропущено?\n- Ясно ли объяснено?\n</critique>\n\n<final_answer>\nФинальный улучшенный ответ с учётом критики.\n</final_answer>\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    import re\n    text = response.content[0].text\n    return {\n        "draft": re.search(r\'<draft>(.*?)</draft>\', text, re.DOTALL).group(1).strip(),\n        "critique": re.search(r\'<critique>(.*?)</critique>\', text, re.DOTALL).group(1).strip(),\n        "final": re.search(r\'<final_answer>(.*?)</final_answer>\', text, re.DOTALL).group(1).strip()\n    }' }
      ]
    },
    {
      id: 3,
      title: 'Multi-persona debate (дебаты персон)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Техника multi-persona debate заставляет модель симулировать дебаты между несколькими персонами с разными точками зрения. Отлично работает для принятия взвешенных решений.' },
        { type: 'heading', value: 'Базовый шаблон дебатов' },
        { type: 'code', language: 'python', value: 'debate_prompt = """\nТема для обсуждения: {topic}\n\nПроведи дебаты между тремя экспертами:\n\n**Оптимист** (Айгерим): видит возможности, акцент на потенциал\n**Скептик** (Нурлан): критически анализирует риски и проблемы  \n**Прагматик** (Дана): фокус на практической реализации\n\nКаждый эксперт делает по 2 реплики.\nПосле дебатов: краткое резюме ключевых разногласий и точек согласия.\n\nФормат:\nАйгерим: [реплика]\nНурлан: [реплика]\n...\n\nРезюме: ...\n"""' },
        { type: 'heading', value: 'Дебаты для технических решений' },
        { type: 'code', language: 'python', value: 'tech_debate = """\nВопрос: Использовать ли микросервисную архитектуру для нашего стартапа?\n\nЭксперты:\n- **Tech Lead** (за монолит): опыт в стартапах, приоритет скорости\n- **DevOps** (за микросервисы): опыт масштабирования\n- **CEO** (бизнес-перспектива): фокус на ROI и time-to-market\n\nКаждый: главный аргумент + контраргумент оппоненту.\nЗаключение: что выбрать для стартапа на seed-стадии и почему.\n"""' },
        { type: 'note', value: 'Дебаты между персонами помогают выявить аргументы которые вы сами не рассмотрели. Отлично для любых решений с trade-offs.' }
      ]
    },
    {
      id: 4,
      title: 'Tree of Thought (ToT)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tree of Thought — расширение CoT где модель генерирует несколько ветвей рассуждений параллельно, оценивает каждую и выбирает лучшую. Подходит для задач с несколькими решениями.' },
        { type: 'heading', value: 'Реализация Tree of Thought' },
        { type: 'code', language: 'python', value: 'tot_prompt = """\nЗадача: {problem}\n\nИспользуй метод Tree of Thought:\n\n**Ветвь 1: Подход A**\n- Суть: [описание подхода]\n- Шаги: [1, 2, 3...]\n- Оценка: [преимущества и недостатки]\n- Вероятность успеха: [%]\n\n**Ветвь 2: Подход B**\n[аналогично]\n\n**Ветвь 3: Подход C**\n[аналогично]\n\n**Выбор лучшей ветви:**\nОбоснование: [почему эта ветвь оптимальна]\nФинальный ответ: [решение по выбранной ветви]\n"""' },
        { type: 'code', language: 'python', value: '# Пример ToT для архитектурного решения\ntot_example = """\nЗадача: Спроектировать систему кеширования для API\nнагруженного 10000 RPS.\n\nПоследовательно рассмотри три архитектурных подхода:\n1. Redis кластер\n2. CDN + edge caching  \n3. In-memory LRU cache в приложении\n\nДля каждого:\n- Максимальная пропускная способность\n- Сложность реализации (1-5)\n- Стоимость в месяц (примерно)\n- Отказоустойчивость\n\nВыбери лучший подход для данной нагрузки.\n"""' },
        { type: 'tip', value: 'ToT особенно полезен для задач где нет одного правильного ответа: архитектурные решения, бизнес-стратегии, творческие задачи с несколькими валидными решениями.' }
      ]
    },
    {
      id: 5,
      title: 'Prompt Chaining — цепочки промптов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prompt chaining — разбивка сложной задачи на цепочку простых промптов где вывод одного становится вводом следующего. Это ключевая техника для сложных автоматизаций.' },
        { type: 'heading', value: 'Паттерн Pipeline' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef call_claude(prompt: str, model: str = "claude-haiku-4-5", max_tokens: int = 512) -> str:\n    response = client.messages.create(\n        model=model,\n        max_tokens=max_tokens,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text\n\ndef article_creation_pipeline(topic: str) -> dict:\n    """Цепочка: исследование -> план -> написание -> ревью"""\n    \n    # Шаг 1: Исследование темы\n    research = call_claude(f"Перечисли 10 ключевых фактов о: {topic}")\n    \n    # Шаг 2: Создание плана на основе фактов\n    outline = call_claude(f"На основе этих фактов создай план статьи:\\n{research}")\n    \n    # Шаг 3: Написание статьи по плану\n    article = call_claude(\n        f"Напиши статью по плану.\\nПлан:\\n{outline}\\n\\nДлина 500 слов.",\n        model="claude-sonnet-4-5",\n        max_tokens=1024\n    )\n    \n    # Шаг 4: Ревью и улучшение\n    reviewed = call_claude(\n        f"Отредактируй статью: улучши ясность, убери повторы, проверь факты.\\n\\n{article}"\n    )\n    \n    return {"research": research, "outline": outline, "article": reviewed}' },
        { type: 'heading', value: 'Условные цепочки (branching)' },
        { type: 'code', language: 'python', value: 'def smart_support_pipeline(user_message: str) -> str:\n    # Шаг 1: Классификация запроса\n    category = call_claude(\n        f"Классифицируй запрос одним словом: billing|technical|general\\nЗапрос: {user_message}"\n    ).strip().lower()\n    \n    # Шаг 2: Ветвление по категории\n    if "billing" in category:\n        context = "Ты специалист по биллингу. Точность важнее всего."\n    elif "technical" in category:\n        context = "Ты технический специалист. Давай пошаговые инструкции."\n    else:\n        context = "Ты универсальный помощник. Будь дружелюбным."\n    \n    # Шаг 3: Ответ с учётом контекста\n    answer = call_claude(f"{context}\\n\\nОтветь на запрос: {user_message}")\n    return answer' }
      ]
    },
    {
      id: 6,
      title: 'Автоматическая оптимизация и оценка промптов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Автоматическая оптимизация промптов — использование Claude (или другой модели) для систематического улучшения промптов на основе результатов.' },
        { type: 'heading', value: 'Фреймворк A/B тестирования промптов' },
        { type: 'code', language: 'python', value: 'import random\nfrom typing import Callable\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef evaluate_prompt(prompt_template: str, test_cases: list, evaluator: Callable) -> float:\n    """Оценивает промпт на наборе тестовых случаев"""\n    scores = []\n    for test in test_cases:\n        response = client.messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=256,\n            messages=[{"role": "user", "content": prompt_template.format(**test)}]\n        ).content[0].text\n        score = evaluator(response, test.get("expected", ""))\n        scores.append(score)\n    return sum(scores) / len(scores)\n\ndef llm_evaluator(response: str, expected: str) -> float:\n    """Оценивает ответ с помощью Claude"""\n    eval_prompt = f"""\nОцени качество ответа от 0 до 10.\nОжидаемый ответ: {expected}\nПолученный ответ: {response}\nОтветь только числом.\n"""\n    score_text = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=10,\n        messages=[{"role": "user", "content": eval_prompt}]\n    ).content[0].text\n    try:\n        return float(score_text.strip()) / 10\n    except:\n        return 0.5' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система мета-оптимизации промптов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему optimize_prompt(), которая принимает исходный промпт и набор тест-кейсов (вход + ожидаемый вывод), генерирует 3 варианта улучшенного промпта, тестирует каждый и возвращает лучший по оценке качества.',
      requirements: [
        'Функция optimize_prompt(original: str, test_cases: list) -> dict',
        'Генерирует 3 варианта промпта через мета-промптинг',
        'Тестирует каждый вариант на test_cases',
        'Оценка качества через LLM-evaluator (0-10)',
        'Возвращает: best_prompt, scores (все варианты), improvement'
      ],
      expectedOutput: '{\n  "best_prompt": "улучшенный промпт",\n  "scores": {"original": 6.2, "v1": 7.8, "v2": 8.5, "v3": 7.1},\n  "improvement": "+37%",\n  "winner": "v2"\n}',
      hint: 'Сначала вызови Claude с мета-промптом: "создай 3 варианта промпта". Парси 3 варианта из ответа. Для каждого варианта прогони test_cases. Для оценки используй отдельный LLM-вызов.',
      solution: 'import json\nimport re\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef call_claude(prompt: str, max_tokens: int = 512) -> str:\n    return client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=max_tokens,\n        messages=[{"role": "user", "content": prompt}]\n    ).content[0].text\n\ndef generate_variants(original_prompt: str) -> list:\n    meta = f"""\nТы эксперт по промпт-инженерии.\nСоздай 3 улучшенных варианта следующего промпта.\n\nИсходный промпт:\n{original_prompt}\n\nДля каждого варианта используй разный подход:\n- Вариант 1: добавь контекст и примеры\n- Вариант 2: упрости и сделай конкретнее\n- Вариант 3: добавь структуру и format\n\nФормат ответа:\n<variant1>промпт</variant1>\n<variant2>промпт</variant2>\n<variant3>промпт</variant3>\n"""\n    response = call_claude(meta, max_tokens=1024)\n    variants = []\n    for i in range(1, 4):\n        m = re.search(f\'<variant{i}>(.*?)</variant{i}>\', response, re.DOTALL)\n        if m:\n            variants.append(m.group(1).strip())\n    return variants\n\ndef score_prompt(prompt_template: str, test_cases: list) -> float:\n    scores = []\n    for test in test_cases:\n        try:\n            filled = prompt_template.replace("{input}", test["input"])\n            response = call_claude(filled, max_tokens=256)\n            eval_q = f"Оцени ответ от 0 до 10. Ожидалось: {test[\'expected\']}. Получено: {response}. Только цифра."\n            score_text = call_claude(eval_q, max_tokens=10)\n            scores.append(float(re.search(r\'\\d+\\.?\\d*\', score_text).group()) / 10)\n        except:\n            scores.append(0.5)\n    return round(sum(scores) / len(scores), 2) if scores else 0.5\n\ndef optimize_prompt(original: str, test_cases: list) -> dict:\n    variants = generate_variants(original)\n    \n    scores = {"original": score_prompt(original, test_cases)}\n    for i, variant in enumerate(variants, 1):\n        scores[f"v{i}"] = score_prompt(variant, test_cases)\n    \n    best_key = max(scores, key=scores.get)\n    best_prompt = original if best_key == "original" else variants[int(best_key[1]) - 1]\n    \n    orig_score = scores["original"]\n    best_score = scores[best_key]\n    improvement = f"+{round((best_score - orig_score) / orig_score * 100)}%" if orig_score > 0 else "N/A"\n    \n    return {\n        "best_prompt": best_prompt,\n        "scores": scores,\n        "improvement": improvement,\n        "winner": best_key\n    }\n\n# Тест\noriginal = "Переведи на русский: {input}"\ntest_cases = [\n    {"input": "Hello world", "expected": "Привет мир"},\n    {"input": "Good morning", "expected": "Доброе утро"},\n    {"input": "Thank you very much", "expected": "Большое спасибо"}\n]\n\nresult = optimize_prompt(original, test_cases)\nprint(f"Победитель: {result[\'winner\']} ({result[\'improvement\']})")\nprint(f"Оценки: {result[\'scores\']}")\nprint(f"\\nЛучший промпт:\\n{result[\'best_prompt\']}") ',
      explanation: 'Система реализует полный цикл промпт-оптимизации: мета-генерация вариантов -> тестирование -> LLM-оценка -> выбор лучшего. Ключевые компоненты: generate_variants() использует мета-промптинг с тремя стратегиями улучшения; score_prompt() оценивает промпт через отдельный LLM-вызов (LLM-as-judge); optimize_prompt() оркестрирует весь процесс. Это мощный фреймворк для автоматической оптимизации любых промптов.'
    }
  ]
}
