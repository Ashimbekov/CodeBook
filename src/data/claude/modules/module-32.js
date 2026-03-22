export default {
  id: 32,
  title: 'Messages API',
  description: 'Глубокое погружение в основной метод API — messages.create(). Изучаем роли user/assistant, многоходовые диалоги, системные промпты и ключевые параметры: max_tokens, temperature, stop_sequences.',
  lessons: [
    {
      id: 1,
      title: 'messages.create()',
      content: [
        {
          type: 'heading',
          value: 'Основной метод Anthropic API'
        },
        {
          type: 'text',
          value: 'messages.create() — единственный метод для получения ответов от Claude через API. Он принимает список сообщений и параметры генерации, возвращает объект Message с ответом модели.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Полная сигнатура метода\nmessage = client.messages.create(\n    model="claude-opus-4-5",      # обязательно\n    max_tokens=1024,               # обязательно\n    messages=[...],                # обязательно\n    system="...",                  # опционально\n    temperature=1.0,               # опционально (0.0-1.0)\n    top_p=None,                    # опционально\n    top_k=None,                    # опционально\n    stop_sequences=[],             # опционально\n    stream=False,                  # опционально\n    metadata=None,                 # опционально\n)\n\nprint(type(message))  # <class "anthropic.types.Message">'
        },
        {
          type: 'text',
          value: 'Три параметра обязательны для каждого вызова: model (какую модель использовать), max_tokens (максимальная длина ответа) и messages (история диалога). Остальные параметры имеют разумные значения по умолчанию.'
        },
        {
          type: 'tip',
          value: 'Всегда явно указывайте max_tokens, даже если он не нужен маленький. Это защищает от случайных дорогостоящих ответов и помогает контролировать расходы.'
        }
      ]
    },
    {
      id: 2,
      title: 'Роли: user и assistant',
      content: [
        {
          type: 'heading',
          value: 'Формат сообщений: роль и содержимое'
        },
        {
          type: 'text',
          value: 'Каждое сообщение в списке messages имеет два поля: role и content. Роль определяет, кто написал сообщение. API поддерживает две роли: "user" (пользователь) и "assistant" (Claude).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Простое сообщение пользователя\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    messages=[\n        {\n            "role": "user",\n            "content": "Что такое рекурсия?"\n        }\n    ]\n)\n\nprint(message.role)              # assistant\nprint(message.content[0].type)  # text\nprint(message.content[0].text)  # Рекурсия — это...'
        },
        {
          type: 'text',
          value: 'Роль "assistant" используется в истории диалога, чтобы указать, что Claude уже ответил на предыдущие сообщения. Также можно использовать "assistant prefill" — начать ответ Claude самостоятельно, чтобы направить его в нужную сторону.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Assistant prefill: принуждаем Claude начать ответ с определённых слов\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    messages=[\n        {"role": "user", "content": "Какой твой любимый язык программирования?"},\n        {"role": "assistant", "content": "Мой любимый язык — Python, потому что"}  # prefill\n    ]\n)\n\n# Claude продолжит с этого места\nprint(message.content[0].text)  # он отличается простотой синтаксиса...'
        },
        {
          type: 'warning',
          value: 'Сообщения в списке должны чередоваться: user, assistant, user, assistant... Первое сообщение всегда должно быть от user. Нарушение этого порядка вызовет ошибку API.'
        }
      ]
    },
    {
      id: 3,
      title: 'Многоходовые диалоги',
      content: [
        {
          type: 'heading',
          value: 'Как создать диалог с памятью'
        },
        {
          type: 'text',
          value: 'Claude API не хранит историю диалогов между запросами — каждый вызов независим. Чтобы создать диалог с памятью, нужно вручную передавать всю историю сообщений в каждом запросе.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# История диалога — список сообщений\nconversation_history = []\n\ndef chat(user_message: str) -> str:\n    # Добавляем новое сообщение пользователя\n    conversation_history.append({\n        "role": "user",\n        "content": user_message\n    })\n\n    # Отправляем всю историю в API\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=conversation_history  # вся история!\n    )\n\n    # Получаем ответ\n    assistant_message = response.content[0].text\n\n    # Сохраняем ответ в историю\n    conversation_history.append({\n        "role": "assistant",\n        "content": assistant_message\n    })\n\n    return assistant_message\n\n# Ведём диалог\nprint(chat("Меня зовут Алибек. Помни это."))\nprint(chat("Как меня зовут?"))  # Claude знает имя из истории!'
        },
        {
          type: 'tip',
          value: 'При длинных диалогах история занимает много токенов и дорого стоит. Стратегии управления историей: хранить только последние N сообщений, суммаризировать старые сообщения, удалять несущественные части.'
        }
      ]
    },
    {
      id: 4,
      title: 'Системный промпт',
      content: [
        {
          type: 'heading',
          value: 'Параметр system: задаём поведение Claude'
        },
        {
          type: 'text',
          value: 'Параметр system задаёт контекст и инструкции для Claude, которые применяются ко всему диалогу. Системный промпт — это место для установки роли, ограничений, стиля ответов и специфического поведения.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Системный промпт задаёт роль и поведение\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    system="""Ты — опытный Python-разработчик с 10-летним стажем.\nТы отвечаешь кратко и по делу.\nВсегда приводи примеры кода.\nОтвечай только на вопросы о Python. На остальные вопросы\nвежливо объясняй, что ты специализируешься только на Python.""",\n    messages=[\n        {"role": "user", "content": "Как сортировать список?"},\n    ]\n)\nprint(message.content[0].text)'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Системный промпт с переменными (шаблонизация)\ndef create_assistant(language: str, style: str):\n    system_prompt = f"""Ты — эксперт по {language}.\nСтиль объяснений: {style}.\nВсегда форматируй код в блоках кода."""\n\n    def ask(question: str) -> str:\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            system=system_prompt,\n            messages=[{"role": "user", "content": question}]\n        )\n        return response.content[0].text\n\n    return ask\n\n# Создаём специализированных ассистентов\npython_expert = create_assistant("Python", "подробный, с примерами")\njs_expert = create_assistant("JavaScript", "краткий, только код")\n\nprint(python_expert("Что такое декораторы?"))\nprint(js_expert("Как работают промисы?"))'
        },
        {
          type: 'note',
          value: 'Системный промпт передаётся в каждом запросе API, поэтому токены системного промпта входят в стоимость каждого вызова. Для длинных системных промптов выгодно использовать кеширование (prompt caching).'
        }
      ]
    },
    {
      id: 5,
      title: 'max_tokens и temperature',
      content: [
        {
          type: 'heading',
          value: 'Управление длиной и случайностью ответов'
        },
        {
          type: 'text',
          value: 'Два важнейших параметра для управления генерацией: max_tokens ограничивает длину ответа, temperature контролирует случайность (креативность) ответа.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# max_tokens: максимум токенов в ответе\n# 1 токен ≈ 4 символа, 1000 токенов ≈ 750 слов\n\n# Короткий ответ — маленький max_tokens\nshort = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=50,  # примерно 1-2 предложения\n    messages=[{"role": "user", "content": "Что такое Python?"}]\n)\nprint("Короткий:", short.content[0].text)\nprint("stop_reason:", short.stop_reason)  # может быть max_tokens!\n\n# Длинный ответ — большой max_tokens\nlong_response = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=4096,  # несколько страниц текста\n    messages=[{"role": "user", "content": "Напиши подробную статью о Python"}]\n)\nprint("Длинный stop_reason:", long_response.stop_reason)  # end_turn'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nquestion = "Придумай название для стартапа по доставке пиццы"\n\n# temperature=0: детерминированный, предсказуемый ответ\n# Хорошо для: анализ, код, факты\nlow_temp = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=100,\n    temperature=0,  # минимальная случайность\n    messages=[{"role": "user", "content": question}]\n)\nprint("Температура 0:", low_temp.content[0].text)\n\n# temperature=1: стандартный баланс\nmid_temp = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=100,\n    temperature=1,  # по умолчанию\n    messages=[{"role": "user", "content": question}]\n)\nprint("Температура 1:", mid_temp.content[0].text)\n\n# Запустите несколько раз — при temperature=0 ответы будут одинаковые,\n# при temperature=1 — разными!'
        },
        {
          type: 'list',
          value: 'temperature=0: всегда один и тот же ответ. Используйте для кода, SQL, JSON, анализа\ntemperature=0.5: умеренная вариативность. Хорошо для резюме, перефразирований\ntemperature=1: стандартный режим. Подходит для большинства задач\ntemperature>1: очень случайный. Может генерировать бессвязный текст, используйте осторожно'
        }
      ]
    },
    {
      id: 6,
      title: 'stop_sequences',
      content: [
        {
          type: 'heading',
          value: 'Управление остановкой генерации'
        },
        {
          type: 'text',
          value: 'stop_sequences — список строк, при встрече которых генерация немедленно останавливается. Это полезно когда вам нужно получить ответ определённого формата или остановить генерацию в конкретном месте.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Остановить генерацию на определённой строке\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    stop_sequences=["КОНЕЦ", "---"],  # стоп-последовательности\n    messages=[{\n        "role": "user",\n        "content": "Перечисли 5 языков программирования. "\n                   "После каждого ставь перенос строки. "\n                   "Когда закончишь — напиши КОНЕЦ"\n    }]\n)\n\nprint(message.content[0].text)\nprint("Остановлено на:", message.stop_reason)    # stop_sequence\nprint("Последовательность:", message.stop_sequence)  # "КОНЕЦ"'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\n# Практичный пример: извлечение JSON из ответа\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    stop_sequences=["}"],  # останавливаем после закрывающей скобки JSON\n    messages=[{\n        "role": "user",\n        "content": "Верни JSON с полями: name=\'Алибек\', age=25, city=\'Алматы\'"\n    }],\n    # prefill помогает получить чистый JSON без лишних слов\n)\n\n# Добавляем закрывающую скобку, которую стоп-последовательность срезала\nraw = message.content[0].text + "}"\ntry:\n    data = json.loads(raw)\n    print(data)  # {"name": "Алибек", "age": 25, "city": "Алматы"}\nexcept json.JSONDecodeError as e:\n    print(f"Ошибка парсинга: {e}")'
        },
        {
          type: 'tip',
          value: 'stop_sequences особенно полезны при извлечении структурированных данных. Используйте уникальные разделители, которые точно не встретятся в нормальном тексте, например XML-теги: ["</answer>", "</json>"].'
        }
      ]
    },
    {
      id: 7,
      title: 'Выбор модели',
      content: [
        {
          type: 'heading',
          value: 'Какую модель Claude выбрать'
        },
        {
          type: 'text',
          value: 'Anthropic предлагает несколько моделей с разным соотношением скорости, качества и стоимости. Правильный выбор модели — ключевой фактор для оптимизации производительности и затрат.'
        },
        {
          type: 'list',
          value: 'claude-haiku-3-5: самая быстрая и дешёвая. Идеальна для классификации, фильтрации, простых задач\nclaude-sonnet-4-5: баланс скорости и качества. Подходит для большинства продакшен-задач\nclaude-opus-4-5: самая мощная. Используйте для сложного анализа, рассуждений, когда качество критично\nclaude-sonnet-4-5 (extended thinking): Sonnet с расширенным мышлением для сложных задач'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Получить список доступных моделей через API\nmodels = client.models.list()\nfor model in models.data:\n    print(f"{model.id}: {model.display_name}")\n\n# Константы для удобства\nHAIKU = "claude-haiku-3-5"\nSONNET = "claude-sonnet-4-5"\nOPUS = "claude-opus-4-5"\n\n# Простая задача — используем Haiku\nclassify = client.messages.create(\n    model=HAIKU,  # дёшево и быстро\n    max_tokens=10,\n    messages=[{"role": "user", "content": "Это спам? \'Вы выиграли миллион!\' Ответь одним словом: да или нет"}]\n)\nprint("Спам?", classify.content[0].text)\n\n# Сложный анализ — используем Opus\nanalysis = client.messages.create(\n    model=OPUS,  # лучшее качество для важных задач\n    max_tokens=2048,\n    messages=[{"role": "user", "content": "Проанализируй архитектуру микросервисов..."}]\n)'
        },
        {
          type: 'note',
          value: 'Имена моделей содержат версию: claude-opus-4-5 это Opus четвёртого поколения. Всегда используйте точное имя модели из документации — Anthropic периодически добавляет новые версии.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Многоходовый диалог',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте интерактивный чат-бот в терминале. Бот должен помнить историю диалога, поддерживать системный промпт и позволять пользователю выйти командой "выход".',
      requirements: [
        'Принять системный промпт от пользователя в начале (или использовать дефолтный)',
        'Вести диалог в цикле: читать ввод пользователя, получать ответ Claude',
        'Хранить историю диалога и передавать её в каждом запросе',
        'При вводе "выход" или "exit" завершить программу',
        'Выводить количество использованных токенов после каждого ответа',
        'Использовать модель claude-haiku-3-5 для экономии'
      ],
      expectedOutput: 'Система: Ты дружелюбный ассистент. Отвечай кратко.\nВы: Привет, как тебя зовут?\nClaude: Привет! Я Claude, AI-ассистент от Anthropic.\n[Токены: вх=15, исх=12]\nВы: Что ты умеешь?\nClaude: Я помогаю отвечать на вопросы, писать код, анализировать текст...\n[Токены: вх=29, исх=24]\nВы: выход\nДо свидания! Всего было обменов: 2',
      hint: 'Используйте input() для чтения ввода. Список conversation_history добавляйте в каждую итерацию цикла. Проверяйте user_input.lower() in ["выход", "exit"] для завершения.',
      solution: 'import anthropic\n\ndef run_chatbot():\n    client = anthropic.Anthropic()\n\n    print("Введите системный промпт (Enter для дефолтного):")\n    system_input = input().strip()\n    system = system_input if system_input else "Ты дружелюбный ассистент. Отвечай кратко."\n    print(f"Система: {system}")\n    print("Введите \'выход\' для завершения.\\n")\n\n    history = []\n    turn_count = 0\n\n    while True:\n        user_input = input("Вы: ").strip()\n        if not user_input:\n            continue\n        if user_input.lower() in ["выход", "exit", "quit"]:\n            print(f"До свидания! Всего было обменов: {turn_count}")\n            break\n\n        history.append({"role": "user", "content": user_input})\n\n        response = client.messages.create(\n            model="claude-haiku-3-5",\n            max_tokens=512,\n            system=system,\n            messages=history\n        )\n\n        answer = response.content[0].text\n        history.append({"role": "assistant", "content": answer})\n        turn_count += 1\n\n        print(f"Claude: {answer}")\n        print(f"[Токены: вх={response.usage.input_tokens}, исх={response.usage.output_tokens}]\\n")\n\nif __name__ == "__main__":\n    run_chatbot()',
      explanation: 'Ключевой паттерн: history — это список словарей, который растёт с каждым обменом. Передавая его полностью в каждый запрос, мы создаём иллюзию памяти — Claude "видит" весь предыдущий диалог. Важно добавлять как сообщение пользователя, так и ответ ассистента в историю. Вывод токенов после каждого ответа помогает отслеживать расход: чем длиннее история, тем больше входящих токенов потребляет каждый запрос.'
    }
  ]
}
