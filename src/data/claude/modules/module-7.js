export default {
  id: 7,
  title: 'Мультимодальность',
  description: 'Изучите работу Claude с изображениями, PDF и документами. Узнайте, как анализировать визуальный контент и комбинировать текст с изображениями.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Понимание изображений',
      content: [
        {
          type: 'heading',
          value: 'Claude видит картинки'
        },
        {
          type: 'text',
          value: 'Claude — мультимодальная модель. Это значит, что он работает не только с текстом, но и с изображениями. Вы можете загрузить скриншот, фотографию, диаграмму, схему — и задавать вопросы о том, что на них изображено.'
        },
        {
          type: 'text',
          value: 'Это похоже на то, как вы показываете картинку другу и просите его описать или объяснить. Только Claude умеет делать это очень точно, находить детали, которые легко пропустить, и связывать визуальное с текстовым контекстом.'
        },
        {
          type: 'heading',
          value: 'Что умеет Claude с изображениями'
        },
        {
          type: 'list',
          items: [
            'Описать содержимое изображения детально',
            'Ответить на вопросы об объектах, людях, тексте на изображении',
            'Сравнить два изображения',
            'Найти текст на изображении (OCR)',
            'Проанализировать диаграммы, графики, схемы',
            'Объяснить технические схемы и чертежи',
            'Анализировать скриншоты интерфейсов'
          ]
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\n# Загрузка изображения из файла\nwith open("diagram.png", "rb") as f:\n    image_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\nmessage = client.messages.create(\n    model="claude-sonnet-4-5",\n    max_tokens=1024,\n    messages=[\n        {\n            "role": "user",\n            "content": [\n                {\n                    "type": "image",\n                    "source": {\n                        "type": "base64",\n                        "media_type": "image/png",\n                        "data": image_data\n                    }\n                },\n                {\n                    "type": "text",\n                    "text": "Опиши эту диаграмму. Что она показывает? Какие ключевые выводы можно сделать?"\n                }\n            ]\n        }\n    ]\n)\n\nprint(message.content[0].text)'
        },
        {
          type: 'tip',
          value: 'Можно отправить изображение по URL без скачивания: используйте type: "url" вместо "base64". Это удобно, когда изображение уже доступно в интернете.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Анализ PDF документов',
      content: [
        {
          type: 'heading',
          value: 'PDF как входной формат'
        },
        {
          type: 'text',
          value: 'Claude умеет работать с PDF-файлами напрямую! Вы можете загрузить PDF-документ и задавать вопросы по его содержимому. Это особенно ценно для работы с договорами, отчётами, научными статьями и технической документацией.'
        },
        {
          type: 'heading',
          value: 'Как работает PDF-анализ'
        },
        {
          type: 'text',
          value: 'Claude извлекает как текст, так и визуальное содержимое из PDF. Он видит текст, таблицы, изображения, схемы и понимает их в контексте всего документа. Это мощнее простого извлечения текста — Claude понимает структуру документа.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\n# Загрузка PDF\nwith open("contract.pdf", "rb") as f:\n    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\nmessage = client.messages.create(\n    model="claude-sonnet-4-5",\n    max_tokens=2048,\n    messages=[\n        {\n            "role": "user",\n            "content": [\n                {\n                    "type": "document",\n                    "source": {\n                        "type": "base64",\n                        "media_type": "application/pdf",\n                        "data": pdf_data\n                    }\n                },\n                {\n                    "type": "text",\n                    "text": """Проанализируй этот договор:\n1. Стороны договора\n2. Предмет договора\n3. Ключевые условия и обязательства\n4. Штрафные санкции\n5. Срок действия\n6. Потенциально невыгодные пункты"""\n                }\n            ]\n        }\n    ]\n)\n\nprint(message.content[0].text)'
        },
        {
          type: 'note',
          value: 'Размер PDF ограничен: обычно до 32MB или ~100 страниц за один запрос. Для больших документов разбивайте на части или используйте стратегии из модуля про токены.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Извлечение данных из документов',
      content: [
        {
          type: 'heading',
          value: 'Структурированное извлечение из неструктурированного'
        },
        {
          type: 'text',
          value: 'Одна из самых ценных функций мультимодальности — извлечение структурированных данных из визуальных документов. Сканы счетов, фотографии визиток, скриншоты таблиц — всё это Claude может обработать и вернуть в удобном формате.'
        },
        {
          type: 'heading',
          value: 'Применения извлечения данных'
        },
        {
          type: 'list',
          items: [
            'Обработка счетов и накладных: извлечь дату, сумму, поставщика',
            'Распознавание визиток: имя, телефон, email, должность',
            'Обработка форм и анкет: перевести заполненную форму в данные',
            'Таблицы из скана: восстановить структуру таблицы из изображения',
            'Паспорта и документы: номер, дата, ФИО (с соблюдением privacy)',
            'Чеки и квитанции: товары, цены, итог'
          ]
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\nimport json\n\nclient = anthropic.Anthropic()\n\ndef extract_invoice_data(image_path: str) -> dict:\n    """Извлекает данные из скана счёта."""\n    with open(image_path, "rb") as f:\n        img_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n    ext = image_path.split(".")[-1].lower()\n    media_type = f"image/{ext}" if ext != "jpg" else "image/jpeg"\n\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=512,\n        messages=[{\n            "role": "user",\n            "content": [\n                {\n                    "type": "image",\n                    "source": {"type": "base64", "media_type": media_type, "data": img_data}\n                },\n                {\n                    "type": "text",\n                    "text": """Извлеки данные из этого счёта в JSON формат:\n{\n  "invoice_number": str,\n  "date": "YYYY-MM-DD",\n  "vendor": str,\n  "total_amount": float,\n  "currency": str,\n  "items": [{"name": str, "quantity": float, "price": float}]\n}\nВерни только валидный JSON, без объяснений."""\n                }\n            ]\n        }]\n    )\n\n    return json.loads(response.content[0].text)\n\n# Пример использования\ndata = extract_invoice_data("invoice_scan.jpg")\nprint(f"Счёт №{data[\'invoice_number\']} на сумму {data[\'total_amount\']} {data[\'currency\']}")'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Комбинирование текста и изображений',
      content: [
        {
          type: 'heading',
          value: 'Мощь мультимодального промптинга'
        },
        {
          type: 'text',
          value: 'Самые интересные сценарии возникают, когда вы комбинируете изображения с текстом. Можно показать несколько изображений, дополнить контекстом, попросить сравнить или объединить информацию из разных источников.'
        },
        {
          type: 'heading',
          value: 'Практические сценарии'
        },
        {
          type: 'list',
          items: [
            'Дизайн-ревью: загрузить несколько версий макета и попросить сравнить',
            'Технический анализ: схема + спецификация → анализ соответствия',
            'Обучение: диаграмма + вопрос → подробное объяснение',
            'Мониторинг: скриншоты интерфейса + критерии → проверка качества',
            'A/B тест: два варианта → рекомендация с обоснованием',
            'Данные + визуализация: таблица + график → интерпретация'
          ]
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\ndef compare_designs(image_path_a: str, image_path_b: str, criteria: str) -> str:\n    """Сравнивает два варианта дизайна по заданным критериям."""\n\n    def load_image(path: str):\n        with open(path, "rb") as f:\n            data = base64.standard_b64encode(f.read()).decode("utf-8")\n        ext = "jpeg" if path.endswith(".jpg") else path.split(".")[-1]\n        return data, f"image/{ext}"\n\n    img_a_data, mt_a = load_image(image_path_a)\n    img_b_data, mt_b = load_image(image_path_b)\n\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "text", "text": "Вариант A:"},\n                {"type": "image", "source": {"type": "base64", "media_type": mt_a, "data": img_a_data}},\n                {"type": "text", "text": "Вариант B:"},\n                {"type": "image", "source": {"type": "base64", "media_type": mt_b, "data": img_b_data}},\n                {"type": "text", "text": f"Сравни два варианта по критериям: {criteria}. Дай конкретную рекомендацию."}\n            ]\n        }]\n    )\n\n    return response.content[0].text'
        },
        {
          type: 'tip',
          value: 'В одном запросе можно отправить до 5 изображений (проверяйте актуальный лимит в документации). Для анализа интерфейсов особенно полезно показывать состояния "до" и "после".'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Сценарии использования компьютерного зрения',
      content: [
        {
          type: 'heading',
          value: 'Реальные применения Vision API'
        },
        {
          type: 'text',
          value: 'Мультимодальность Claude открывает целый класс задач, которые раньше требовали специализированных CV-моделей. Теперь можно описать задачу естественным языком и получить умный анализ.'
        },
        {
          type: 'heading',
          value: 'Бизнес-применения'
        },
        {
          type: 'list',
          items: [
            'QA проверка: анализ скриншотов UI на соответствие макету',
            'Обработка документов: автоматизация ввода данных из сканов',
            'Мониторинг безопасности: анализ изображений с камер (описание сцены)',
            'E-commerce: описание товаров по фотографии',
            'Медицина: описание медицинских изображений (не диагностика!)',
            'Accessibility: автоматические alt-тексты для изображений',
            'Контент-модерация: проверка изображений перед публикацией'
          ]
        },
        {
          type: 'heading',
          value: 'Автоматические alt-тексты'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\ndef generate_alt_text(image_path: str, context: str = "") -> str:\n    """Генерирует alt-текст для изображения (доступность сайта)."""\n    with open(image_path, "rb") as f:\n        img_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n    context_note = f"Контекст страницы: {context}\\n" if context else ""\n\n    response = client.messages.create(\n        model="claude-haiku-4-5",  # Простая задача — Haiku\n        max_tokens=150,\n        messages=[{\n            "role": "user",\n            "content": [\n                {\n                    "type": "image",\n                    "source": {"type": "base64", "media_type": "image/jpeg", "data": img_data}\n                },\n                {\n                    "type": "text",\n                    "text": f"{context_note}Напиши краткий alt-текст для этого изображения (до 125 символов). Только текст alt, без объяснений."\n                }\n            ]\n        }]\n    )\n\n    return response.content[0].text.strip()\n\n# Использование\nalt = generate_alt_text("product_photo.jpg", "Страница продукта интернет-магазина")\nprint(f\'alt="{alt}"\')'
        },
        {
          type: 'note',
          value: 'Для задач с изображениями важна модель с хорошими возможностями зрения. Sonnet и Opus обычно дают более точные описания, чем Haiku. Для критически важных задач тестируйте разные модели.'
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: Анализ изображения с Claude',
      difficulty: 'medium',
      description: 'Напишите Python-скрипт, который использует мультимодальные возможности Claude для анализа изображений. Реализуйте несколько полезных функций.',
      requirements: [
        'Функция 1: describe_image(path) — подробное описание содержимого изображения',
        'Функция 2: extract_text_from_image(path) — извлечение всего текста с изображения (OCR)',
        'Функция 3: analyze_chart(path) — анализ графика или диаграммы с ключевыми выводами',
        'Функция 4: find_issues(screenshot_path, expected_behavior) — анализ скриншота интерфейса на проблемы'
      ],
      expectedOutput: 'Рабочий Python-скрипт с четырьмя функциями. Каждая функция принимает путь к изображению, отправляет его в Claude и возвращает структурированный ответ. Функции используют правильные модели (Haiku для простых, Sonnet для сложных задач).',
      hint: 'Не забудьте обработать разные форматы изображений (jpg, png, gif, webp) и добавить проверку существования файла. Для extract_text_from_image попросите Claude вернуть текст "как есть", сохраняя форматирование.',
      solution: 'import anthropic\nimport base64\nimport os\n\nclient = anthropic.Anthropic()\n\nMEDIA_TYPES = {\n    "jpg": "image/jpeg", "jpeg": "image/jpeg",\n    "png": "image/png", "gif": "image/gif", "webp": "image/webp"\n}\n\ndef load_image(path: str) -> tuple[str, str]:\n    """Загружает изображение и возвращает (base64_data, media_type)."""\n    if not os.path.exists(path):\n        raise FileNotFoundError(f"Файл не найден: {path}")\n    ext = path.split(".")[-1].lower()\n    media_type = MEDIA_TYPES.get(ext, "image/jpeg")\n    with open(path, "rb") as f:\n        data = base64.standard_b64encode(f.read()).decode("utf-8")\n    return data, media_type\n\ndef describe_image(path: str) -> str:\n    """Подробное описание изображения."""\n    img_data, mt = load_image(path)\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64", "media_type": mt, "data": img_data}},\n                {"type": "text", "text": "Подробно опиши это изображение: что на нём, детали, контекст, настроение."}\n            ]\n        }]\n    )\n    return response.content[0].text\n\ndef extract_text_from_image(path: str) -> str:\n    """OCR: извлекает весь текст с изображения."""\n    img_data, mt = load_image(path)\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=2048,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64", "media_type": mt, "data": img_data}},\n                {"type": "text", "text": "Извлеки весь текст с изображения. Сохраняй структуру и форматирование. Верни только текст, без комментариев."}\n            ]\n        }]\n    )\n    return response.content[0].text\n\ndef analyze_chart(path: str) -> dict:\n    """Анализирует график/диаграмму."""\n    img_data, mt = load_image(path)\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64", "media_type": mt, "data": img_data}},\n                {"type": "text", "text": "Проанализируй этот график:\\n1. Тип графика\\n2. Что показывает (оси, единицы)\\n3. Ключевые тренды и паттерны\\n4. Главные выводы (3-5 пунктов)"}\n            ]\n        }]\n    )\n    return {"analysis": response.content[0].text}\n\ndef find_issues(screenshot_path: str, expected_behavior: str) -> str:\n    """Анализирует UI скриншот на проблемы."""\n    img_data, mt = load_image(screenshot_path)\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64", "media_type": mt, "data": img_data}},\n                {"type": "text", "text": f"Ожидаемое поведение интерфейса: {expected_behavior}\\n\\nНайди все проблемы и несоответствия: баги UI, UX проблемы, ошибки текста, визуальные дефекты."}\n            ]\n        }]\n    )\n    return response.content[0].text',
      explanation: 'Мультимодальные функции — мощный инструмент автоматизации. Обратите внимание на выбор модели: Haiku для простых описаний экономит бюджет, Sonnet для сложного анализа. Обработка ошибок и поддержка разных форматов делают код production-ready. Такие утилиты можно встраивать в CI/CD для автоматической проверки скриншотов или в бизнес-процессы для обработки документов.'
    }
  ]
}
