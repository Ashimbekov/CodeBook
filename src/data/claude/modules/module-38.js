export default {
  id: 38,
  title: 'Batches API',
  description: 'Изучаем Message Batches API для асинхронной массовой обработки запросов. Создание батчей, мониторинг статуса, получение результатов и 50% скидка на стоимость по сравнению с обычным API.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Batches API',
      content: [
        {
          type: 'heading',
          value: 'Асинхронная массовая обработка запросов'
        },
        {
          type: 'text',
          value: 'Message Batches API позволяет отправить до 10000 запросов в одном батче и обработать их асинхронно. В отличие от обычного API (синхронный), батч обрабатывается в фоне — вы не ждёте ответа, а потом получаете все результаты сразу.'
        },
        {
          type: 'list',
          value: 'Стоимость: 50% скидка по сравнению с синхронным API\nМаксимум запросов: 10000 на батч\nВремя обработки: до 24 часов (обычно значительно быстрее)\nРезультаты: доступны через polling или webhook\nИдеально для: обработка датасетов, пакетная классификация, генерация контента'
        },
        {
          type: 'text',
          value: 'Батчи идеальны для задач, которые не требуют немедленного ответа: ночная обработка данных, генерация описаний для тысяч товаров, классификация отзывов, создание обучающих данных.'
        },
        {
          type: 'note',
          value: 'Batches API не подходит для интерактивных приложений, где нужен немедленный ответ. Используйте его для batch-задач где задержка в часы приемлема, а экономия на стоимости критична.'
        }
      ]
    },
    {
      id: 2,
      title: 'Создание батча',
      content: [
        {
          type: 'heading',
          value: 'Формирование и отправка батч-запроса'
        },
        {
          type: 'text',
          value: 'Для создания батча нужно сформировать список запросов. Каждый запрос имеет custom_id (ваш идентификатор для сопоставления результатов) и params (параметры как в обычном messages.create()).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Формируем список запросов для батча\nrequests = [\n    {\n        "custom_id": "review-001",  # ваш ID для этого запроса\n        "params": {\n            "model": "claude-haiku-3-5",\n            "max_tokens": 100,\n            "messages": [{\n                "role": "user",\n                "content": "Это отличный продукт, очень доволен!\\nОцени тональность: позитивная/негативная/нейтральная"\n            }]\n        }\n    },\n    {\n        "custom_id": "review-002",\n        "params": {\n            "model": "claude-haiku-3-5",\n            "max_tokens": 100,\n            "messages": [{\n                "role": "user",\n                "content": "Ужасное качество, разочарован покупкой.\\nОцени тональность: позитивная/негативная/нейтральная"\n            }]\n        }\n    },\n    {\n        "custom_id": "review-003",\n        "params": {\n            "model": "claude-haiku-3-5",\n            "max_tokens": 100,\n            "messages": [{\n                "role": "user",\n                "content": "Обычный товар, ничего особенного.\\nОцени тональность: позитивная/негативная/нейтральная"\n            }]\n        }\n    },\n]\n\n# Отправляем батч\nbatch = client.messages.batches.create(requests=requests)\n\nprint(f"Батч создан!")\nprint(f"ID батча: {batch.id}")\nprint(f"Статус: {batch.processing_status}")\nprint(f"Всего запросов: {batch.request_counts.processing}")'
        },
        {
          type: 'tip',
          value: 'Сохраняйте batch.id после создания батча! Он нужен для проверки статуса и получения результатов. Если потеряете ID, найти его можно через client.messages.batches.list().'
        }
      ]
    },
    {
      id: 3,
      title: 'Мониторинг статуса батча',
      content: [
        {
          type: 'heading',
          value: 'Polling — проверка готовности батча'
        },
        {
          type: 'text',
          value: 'После создания батч обрабатывается асинхронно. Нужно периодически проверять статус через polling. Статус "ended" означает, что все запросы обработаны.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\n\nclient = anthropic.Anthropic()\n\ndef wait_for_batch(batch_id: str, poll_interval: int = 60) -> object:\n    """Ждём завершения батча с периодической проверкой"""\n    print(f"Ожидание батча {batch_id}...")\n\n    while True:\n        batch = client.messages.batches.retrieve(batch_id)\n        counts = batch.request_counts\n\n        print(f"Статус: {batch.processing_status} | "\n              f"Обработано: {counts.processing} | "\n              f"Успешно: {counts.succeeded} | "\n              f"Ошибок: {counts.errored}")\n\n        if batch.processing_status == "ended":\n            print("Батч завершён!")\n            return batch\n\n        time.sleep(poll_interval)  # ждём 60 секунд между проверками\n\n# Список статусов батча:\n# "in_progress" - батч обрабатывается\n# "canceling" - батч отменяется\n# "ended" - батч завершён (успешно или с ошибками)\n\n# Статусы отдельных запросов:\n# processing - ещё обрабатывается\n# succeeded - успешно завершён\n# errored - ошибка при обработке\n# canceled - отменён\n# expired - истёк срок (более 24 часов)\n\nbatch_id = "msgbatch_01234..."\n# batch = wait_for_batch(batch_id)'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Посмотреть все батчи аккаунта\nbatches = client.messages.batches.list(limit=10)\n\nfor batch in batches.data:\n    print(f"ID: {batch.id}")\n    print(f"  Статус: {batch.processing_status}")\n    print(f"  Создан: {batch.created_at}")\n    counts = batch.request_counts\n    print(f"  Запросов: успешно={counts.succeeded}, ошибок={counts.errored}")\n    print()'
        }
      ]
    },
    {
      id: 4,
      title: 'Получение результатов',
      content: [
        {
          type: 'heading',
          value: 'Чтение ответов завершённого батча'
        },
        {
          type: 'text',
          value: 'После завершения батча результаты доступны через итератор results(). Каждый результат содержит custom_id (для сопоставления с исходным запросом) и result с ответом или ошибкой.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nbatch_id = "msgbatch_01234..."  # ID вашего батча\n\n# Получаем результаты завершённого батча\nresults = {}\nerrors = {}\n\nfor result in client.messages.batches.results(batch_id):\n    custom_id = result.custom_id\n\n    if result.result.type == "succeeded":\n        # Успешный ответ\n        message = result.result.message\n        answer_text = message.content[0].text\n        results[custom_id] = answer_text\n        print(f"[{custom_id}] Успешно: {answer_text}")\n\n    elif result.result.type == "errored":\n        # Ошибка при обработке\n        error = result.result.error\n        errors[custom_id] = error\n        print(f"[{custom_id}] Ошибка: {error.type} - {error.message}")\n\n    elif result.result.type == "expired":\n        # Запрос не был обработан вовремя\n        errors[custom_id] = "expired"\n        print(f"[{custom_id}] Истёк срок")\n\nprint(f"\\nРезультатов: {len(results)}, Ошибок: {len(errors)}")'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\n# Сохранить результаты в JSON файл\nbatch_id = "msgbatch_01234..."\n\noutput = []\nfor result in client.messages.batches.results(batch_id):\n    entry = {"id": result.custom_id, "status": result.result.type}\n    if result.result.type == "succeeded":\n        entry["answer"] = result.result.message.content[0].text\n        entry["tokens"] = {\n            "input": result.result.message.usage.input_tokens,\n            "output": result.result.message.usage.output_tokens\n        }\n    output.append(entry)\n\nwith open("batch_results.json", "w", encoding="utf-8") as f:\n    json.dump(output, f, ensure_ascii=False, indent=2)\n\nprint(f"Сохранено {len(output)} результатов в batch_results.json")'
        }
      ]
    },
    {
      id: 5,
      title: 'Экономия и сценарии',
      content: [
        {
          type: 'heading',
          value: 'Когда батчи выгодны: расчёт экономии'
        },
        {
          type: 'text',
          value: '50% скидка делает батчи привлекательными для любой массовой обработки. Сравнение: 1000 запросов через синхронный API = X рублей, через батч = X/2 рублей.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Реальный пример: классификация 1000 отзывов\ndef classify_reviews_batch(reviews: list[str]) -> dict:\n    """Классифицировать отзывы через батч API (50% дешевле!)"""\n\n    # Формируем запросы\n    requests = []\n    for i, review in enumerate(reviews):\n        requests.append({\n            "custom_id": f"review-{i}",\n            "params": {\n                "model": "claude-haiku-3-5",\n                "max_tokens": 20,\n                "messages": [{\n                    "role": "user",\n                    "content": f"Тональность отзыва одним словом (позитивная/негативная/нейтральная):\\n{review}"\n                }]\n            }\n        })\n\n    # Создаём батч\n    batch = client.messages.batches.create(requests=requests)\n    print(f"Батч создан: {batch.id}")\n    print(f"Запросов: {len(requests)}")\n    print(f"Ожидаемая экономия: ~50% по сравнению с синхронным API")\n    return batch.id\n\n# Пример вызова (не запускаем - нужны реальные отзывы)\n# sample_reviews = ["Отличный товар!", "Плохое качество", "Нормально"]\n# batch_id = classify_reviews_batch(sample_reviews)\nprint("Функция classify_reviews_batch готова")\nprint("Лучшие сценарии для батчей:")\nprint("  - Классификация/категоризация датасетов")\nprint("  - Генерация описаний для каталогов товаров")\nprint("  - Создание обучающих данных")\nprint("  - Ночная обработка логов")\nprint("  - Массовый перевод документов")'
        },
        {
          type: 'list',
          value: 'Классификация: тональность, категория, тег — простые задачи в больших объёмах\nГенерация: описания товаров, SEO-тексты, summary для тысяч статей\nЭкстракция: извлечение данных из неструктурированного текста\nОценка: рейтинг качества, проверка на соответствие критериям\nПеревод: массовый перевод документов или строк локализации'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Батч-классификатор',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте скрипт, который принимает список текстов, создаёт батч для их классификации по тональности, ожидает завершения и выводит результаты с статистикой стоимости.',
      requirements: [
        'Создать список из 5 тестовых отзывов на разных языках',
        'Сформировать батч-запросы для классификации тональности',
        'Создать батч через client.messages.batches.create()',
        'Реализовать polling с выводом статуса каждые 10 секунд',
        'После завершения вывести результаты в виде таблицы',
        'Посчитать суммарные токены и оценить экономию vs синхронный API'
      ],
      expectedOutput: 'Создан батч: msgbatch_...\nЗапросов: 5\n\nОжидание... статус: in_progress\nОжидание... статус: in_progress\nБатч завершён!\n\nРезультаты:\nID          | Тональность    | Токены\nreview-0    | позитивная     | 45\nreview-1    | негативная     | 38\n...\n\nИтого токенов: 215\nЭкономия (50%): ~107 токенов',
      hint: 'Используйте time.sleep(10) в цикле polling. Создайте requests как список словарей. После завершения итерируйте client.messages.batches.results(batch_id). Для красивой таблицы используйте f-строки с выравниванием.',
      solution: 'import anthropic\nimport time\n\nclient = anthropic.Anthropic()\n\nREVIEWS = [\n    "Отличный продукт! Очень доволен покупкой, рекомендую всем.",\n    "Terrible quality, very disappointed with this purchase.",\n    "Обычный товар, ничего особенного. Цена соответствует качеству.",\n    "Превзошло все ожидания! Буду заказывать ещё.",\n    "Не советую. Пришло с дефектом, поддержка не отвечает."\n]\n\n# Формируем батч-запросы\nrequests = [\n    {\n        "custom_id": f"review-{i}",\n        "params": {\n            "model": "claude-haiku-3-5",\n            "max_tokens": 20,\n            "messages": [{\n                "role": "user",\n                "content": f"Тональность одним словом (позитивная/негативная/нейтральная):\\n{review}"\n            }]\n        }\n    }\n    for i, review in enumerate(REVIEWS)\n]\n\n# Создаём батч\nbatch = client.messages.batches.create(requests=requests)\nprint(f"Создан батч: {batch.id}")\nprint(f"Запросов: {len(requests)}\\n")\n\n# Polling до завершения\nwhile True:\n    batch = client.messages.batches.retrieve(batch.id)\n    print(f"Ожидание... статус: {batch.processing_status}")\n    if batch.processing_status == "ended":\n        print("Батч завершён!\\n")\n        break\n    time.sleep(10)\n\n# Результаты\nprint(f"{\'ID\':<12} | {\'Тональность\':<15} | {\'Токены\'}")\nprint("-" * 40)\n\ntotal_tokens = 0\nfor result in client.messages.batches.results(batch.id):\n    if result.result.type == "succeeded":\n        msg = result.result.message\n        answer = msg.content[0].text.strip()\n        tokens = msg.usage.input_tokens + msg.usage.output_tokens\n        total_tokens += tokens\n        print(f"{result.custom_id:<12} | {answer:<15} | {tokens}")\n\nprint(f"\\nИтого токенов: {total_tokens}")\nprint(f"Экономия (50%): ~{total_tokens // 2} токенов")',
      explanation: 'Батч API работает в три шага: создать батч (batches.create), дождаться завершения (batches.retrieve в цикле), получить результаты (batches.results). Ключевое отличие от синхронного API: вы не блокируете поток на время генерации, просто периодически проверяете статус. custom_id позволяет сопоставить каждый результат с исходным запросом. В реальном коде polling делают с большими интервалами (60+ секунд) и с возможностью сохранить batch_id для проверки позже.'
    }
  ]
}
