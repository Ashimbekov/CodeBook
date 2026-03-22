export default {
  id: 36,
  title: 'Extended Thinking',
  description: 'Изучаем режим расширенного мышления Claude: как включить thinking, управлять бюджетом токенов на размышление, читать блоки thinking в ответе и когда использовать эту возможность.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Extended Thinking',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Режим глубокого размышления Claude'
        },
        {
          type: 'text',
          value: 'Extended Thinking — режим, в котором Claude перед ответом "думает вслух": выстраивает цепочку рассуждений, проверяет свои предположения, рассматривает альтернативы. Это похоже на то, как человек решает сложную задачу на бумаге, прежде чем записать финальный ответ.'
        },
        {
          type: 'text',
          value: 'В обычном режиме Claude генерирует ответ "напрямую". При Extended Thinking он сначала создаёт внутренние "thinking blocks" — рассуждения, которые не попадают в финальный ответ, но влияют на его качество. Эти блоки доступны в ответе API для отладки.'
        },
        {
          type: 'list',
          value: 'Задачи требующие многошагового рассуждения (математика, логика)\nСложный анализ с множеством факторов\nПрограммирование с требованиями к надёжности\nЗадачи где важно проверить несколько подходов\nВопросы требующие рассмотрения разных точек зрения'
        },
        {
          type: 'note',
          value: 'Extended Thinking доступен только для моделей claude-sonnet-4-5 и claude-opus-4-5. Thinking блоки потребляют дополнительные токены (до budget_tokens), что влияет на стоимость запроса.'
        }
      ]
    },
    {
      id: 2,
      title: 'Включение thinking',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Параметр thinking в API'
        },
        {
          type: 'text',
          value: 'Чтобы включить Extended Thinking, передайте параметр thinking с типом "enabled" и бюджетом токенов. budget_tokens определяет максимальное количество токенов, которые Claude может потратить на размышление.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Включаем Extended Thinking\nresponse = client.messages.create(\n    model="claude-sonnet-4-5",  # или claude-opus-4-5\n    max_tokens=16000,           # должен быть больше budget_tokens!\n    thinking={\n        "type": "enabled",\n        "budget_tokens": 10000  # токены для размышления\n    },\n    messages=[{\n        "role": "user",\n        "content": "Какое наибольшее простое число меньше 1000? Объясни как ты это определяешь."\n    }]\n)\n\nprint(f"Блоков в ответе: {len(response.content)}")\nfor block in response.content:\n    print(f"Тип блока: {block.type}")'
        },
        {
          type: 'warning',
          value: 'max_tokens должен быть БОЛЬШЕ budget_tokens! Если budget_tokens=10000, то max_tokens должен быть как минимум 10001. На практике ставьте max_tokens = budget_tokens + ожидаемый_размер_ответа.'
        }
      ]
    },
    {
      id: 3,
      title: 'budget_tokens',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Управление бюджетом размышлений'
        },
        {
          type: 'text',
          value: 'budget_tokens задаёт верхнюю границу токенов для thinking. Claude не обязан использовать все токены — он тратит столько, сколько нужно для конкретной задачи. Для простых задач используется мало токенов, для сложных — больше.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Разные бюджеты для разных задач\ndef solve_with_thinking(problem: str, budget: int = 5000) -> dict:\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=budget + 2000,  # бюджет + место для ответа\n        thinking={"type": "enabled", "budget_tokens": budget},\n        messages=[{"role": "user", "content": problem}]\n    )\n\n    thinking_tokens = 0\n    answer = ""\n\n    for block in response.content:\n        if block.type == "thinking":\n            thinking_tokens = len(block.thinking.split())  # приблизительно\n        elif block.type == "text":\n            answer = block.text\n\n    return {\n        "answer": answer,\n        "thinking_tokens_approx": thinking_tokens,\n        "input_tokens": response.usage.input_tokens,\n        "output_tokens": response.usage.output_tokens\n    }\n\n# Маленький бюджет для простой задачи\nresult1 = solve_with_thinking("Сколько будет 15 * 17?", budget=1000)\nprint(f"Простая задача: {result1[\'answer\']}")\nprint(f"Output токенов: {result1[\'output_tokens\']}\\n")\n\n# Большой бюджет для сложной задачи\nresult2 = solve_with_thinking(\n    "Докажи или опровергни: сумма первых n нечётных чисел равна n^2",\n    budget=8000\n)\nprint(f"Сложная задача: {result2[\'answer\'][:200]}...")\nprint(f"Output токенов: {result2[\'output_tokens\']}")'
        },
        {
          type: 'list',
          value: 'budget_tokens=1000-2000: быстрые рассуждения для несложных задач\nbudget_tokens=5000-8000: стандартный анализ, код среднего уровня\nbudget_tokens=10000-16000: сложные математические задачи, архитектурные решения\nbudget_tokens=32000+: самые сложные задачи, исследовательские вопросы'
        }
      ]
    },
    {
      id: 4,
      title: 'Thinking блоки в ответе',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как читать thinking из ответа'
        },
        {
          type: 'text',
          value: 'Ответ API с включённым thinking содержит несколько блоков контента: один или несколько блоков типа "thinking" с рассуждениями и блок типа "text" с финальным ответом.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nresponse = client.messages.create(\n    model="claude-sonnet-4-5",\n    max_tokens=8000,\n    thinking={"type": "enabled", "budget_tokens": 5000},\n    messages=[{\n        "role": "user",\n        "content": "Какой самый эффективный алгоритм сортировки и почему?"\n    }]\n)\n\n# Разбираем ответ\nfor i, block in enumerate(response.content):\n    print(f"\\nБлок {i+1}: тип = {block.type}")\n\n    if block.type == "thinking":\n        print("--- Рассуждения Claude ---")\n        print(block.thinking[:500] + "..." if len(block.thinking) > 500 else block.thinking)\n        print(f"(Всего {len(block.thinking)} символов рассуждений)")\n\n    elif block.type == "text":\n        print("--- Финальный ответ ---")\n        print(block.text)\n\n# Статистика\nprint(f"\\nТокенов использовано:")\nprint(f"  Входящих: {response.usage.input_tokens}")\nprint(f"  Исходящих (включая thinking): {response.usage.output_tokens}")'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Удобная функция для работы с thinking\ndef think_and_answer(question: str, show_thinking: bool = False) -> str:\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=10000,\n        thinking={"type": "enabled", "budget_tokens": 7000},\n        messages=[{"role": "user", "content": question}]\n    )\n\n    result = {"thinking": "", "answer": ""}\n    for block in response.content:\n        if block.type == "thinking":\n            result["thinking"] = block.thinking\n        elif block.type == "text":\n            result["answer"] = block.text\n\n    if show_thinking:\n        print("Процесс мышления:")\n        print(result["thinking"])\n        print("\\n" + "="*50 + "\\n")\n\n    return result["answer"]\n\nanswer = think_and_answer(\n    "Объясни теорему Пифагора тремя разными способами",\n    show_thinking=True  # показываем как Claude думал\n)\nprint("Ответ:", answer)'
        }
      ]
    },
    {
      id: 5,
      title: 'Когда использовать Thinking',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сценарии использования Extended Thinking'
        },
        {
          type: 'text',
          value: 'Extended Thinking не нужен для каждого запроса — он дороже и медленнее. Используйте его осознанно для задач, где дополнительное время на размышление действительно улучшает ответ.'
        },
        {
          type: 'list',
          value: 'Используйте Thinking: сложные математические задачи и доказательства\nИспользуйте Thinking: многошаговое программирование с требованиями к корректности\nИспользуйте Thinking: стратегические решения с множеством факторов\nИспользуйте Thinking: анализ текста с противоречивыми интерпретациями\nНЕ нужен Thinking: простые вопросы и ответы\nНЕ нужен Thinking: суммаризация текста\nНЕ нужен Thinking: перевод и форматирование\nНЕ нужен Thinking: классификация и категоризация'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Пример: решение сложной логической задачи с thinking\nproblem = """У Алибека, Данияра и Айгерим разные профессии:\nпрограммист, дизайнер и менеджер. Известно:\n1. Алибек не программист\n2. Данияр не дизайнер\n3. Айгерим не менеджер\n4. Программист работает с Алибеком\n\nКто чем занимается?\"\"\"\n\nresponse = client.messages.create(\n    model="claude-sonnet-4-5",\n    max_tokens=6000,\n    thinking={"type": "enabled", "budget_tokens": 4000},\n    messages=[{"role": "user", "content": problem}]\n)\n\nfor block in response.content:\n    if block.type == "thinking":\n        print("Рассуждение:")\n        print(block.thinking)\n    elif block.type == "text":\n        print("\\nОтвет:")\n        print(block.text)'
        },
        {
          type: 'tip',
          value: 'Хорошая стратегия: начните без thinking, оцените качество ответа. Если ответ неточный или неполный — попробуйте с thinking. Для критически важных задач используйте thinking по умолчанию.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Решение сложных задач',
      type: 'practice',
      difficulty: 'advanced',
      description: 'Создайте систему сравнения ответов с thinking и без него. Задайте сложную задачу (например, оптимизацию или логическую головоломку), получите оба ответа и сравните их по длине и качеству.',
      requirements: [
        'Создать функцию get_answer(question, use_thinking=False) возвращающую словарь с ответом и статистикой',
        'Без thinking: обычный запрос с max_tokens=1000',
        'С thinking: запрос с budget_tokens=5000, max_tokens=7000',
        'Для обоих вариантов сохранить: текст ответа, количество токенов, время выполнения',
        'Вывести сравнительную таблицу двух подходов',
        'Задача для теста: задача о коммивояжёре с 4 городами (найти кратчайший маршрут)'
      ],
      expectedOutput: 'Тестовая задача: Найди кратчайший маршрут через 4 города...\n\n=== БЕЗ THINKING ===\nВремя: 2.3 сек\nТокенов: 156\nОтвет: Оптимальный маршрут: A->B->C->D->A...\n\n=== С THINKING ===\nВремя: 8.1 сек\nТокенов: 3847\nРазмышлений: 2104 токена\nОтвет: Рассмотрим все перестановки...\n\n=== СРАВНЕНИЕ ===\nС thinking на 24.7x больше токенов\nОтвет с thinking на 340 символов длиннее',
      hint: 'Используйте time.time() для измерения времени. response.usage.output_tokens включает токены thinking. Чтобы посчитать только thinking-токены, считайте длину block.thinking. Сравнивайте len(answer) для оценки детализации.',
      solution: 'import anthropic\nimport time\n\nclient = anthropic.Anthropic()\n\nTASK = """У нас 4 города: A, B, C, D. Расстояния между ними:\nA-B: 10, A-C: 15, A-D: 20\nB-C: 12, B-D: 8\nC-D: 6\nНайди кратчайший маршрут, начинающийся и заканчивающийся в A, проходящий через все города."""\n\ndef get_answer(question: str, use_thinking: bool = False) -> dict:\n    start = time.time()\n\n    if use_thinking:\n        response = client.messages.create(\n            model="claude-sonnet-4-5",\n            max_tokens=7000,\n            thinking={"type": "enabled", "budget_tokens": 5000},\n            messages=[{"role": "user", "content": question}]\n        )\n    else:\n        response = client.messages.create(\n            model="claude-sonnet-4-5",\n            max_tokens=1000,\n            messages=[{"role": "user", "content": question}]\n        )\n\n    elapsed = time.time() - start\n    answer = ""\n    thinking_text = ""\n\n    for block in response.content:\n        if block.type == "thinking":\n            thinking_text = block.thinking\n        elif block.type == "text":\n            answer = block.text\n\n    return {\n        "answer": answer,\n        "thinking": thinking_text,\n        "tokens": response.usage.output_tokens,\n        "input_tokens": response.usage.input_tokens,\n        "time": elapsed\n    }\n\nprint(f"Тестовая задача: {TASK[:80]}...\\n")\n\nresult_no_think = get_answer(TASK, use_thinking=False)\nresult_with_think = get_answer(TASK, use_thinking=True)\n\nprint("=== БЕЗ THINKING ===")\nprint(f"Время: {result_no_think[\'time\']:.1f} сек")\nprint(f"Токенов: {result_no_think[\'tokens\']}")\nprint(f"Ответ: {result_no_think[\'answer\'][:200]}...")\n\nprint("\\n=== С THINKING ===")\nprint(f"Время: {result_with_think[\'time\']:.1f} сек")\nprint(f"Токенов: {result_with_think[\'tokens\']}")\nif result_with_think["thinking"]:\n    print(f"Размышлений (симв): {len(result_with_think[\'thinking\'])}")\nprint(f"Ответ: {result_with_think[\'answer\'][:200]}...")\n\nprint("\\n=== СРАВНЕНИЕ ===")\ntoken_ratio = result_with_think["tokens"] / max(result_no_think["tokens"], 1)\nlen_diff = len(result_with_think["answer"]) - len(result_no_think["answer"])\nprint(f"С thinking на {token_ratio:.1f}x больше токенов")\nprint(f"Ответ с thinking на {len_diff} символов {\'длиннее\' if len_diff > 0 else \'короче\'}")\nprint(f"Время с thinking в {result_with_think[\'time\']/max(result_no_think[\'time\'],0.1):.1f}x дольше")',
      explanation: 'Сравнительный тест показывает реальную разницу: с thinking Claude строит явную цепочку рассуждений (перечисляет все маршруты, считает расстояния), без thinking даёт более прямолинейный ответ. Для задачи коммивояжёра с 4 городами разница заметна: thinking-вариант проверяет все 6 перестановок (3!=6 маршрутов для 4 городов), без thinking Claude может ошибиться или дать неоптимальный маршрут. Увеличение времени и токенов — плата за надёжность рассуждений.'
    }
  ]
}
