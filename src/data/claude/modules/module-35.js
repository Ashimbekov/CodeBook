export default {
  id: 35,
  title: 'Vision API (работа с изображениями)',
  description: 'Учимся отправлять изображения в Claude: base64 и URL, анализ изображений, извлечение данных из документов, работа с несколькими изображениями и ограничения Vision API.',
  lessons: [
    {
      id: 1,
      title: 'Отправка изображений через base64',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Встраивание изображений в запрос API'
        },
        {
          type: 'text',
          value: 'Claude поддерживает отправку изображений двумя способами: как base64-строку (встроенную в запрос) или как URL. Base64 подходит для локальных файлов и случаев, когда изображение не доступно публично.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\nfrom pathlib import Path\n\nclient = anthropic.Anthropic()\n\n# Читаем изображение и кодируем в base64\nimage_path = "screenshot.png"\nwith open(image_path, "rb") as f:\n    image_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n# Определяем медиа-тип\nmedia_type = "image/png"  # или image/jpeg, image/gif, image/webp\n\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[\n        {\n            "role": "user",\n            "content": [\n                {\n                    "type": "image",\n                    "source": {\n                        "type": "base64",\n                        "media_type": media_type,\n                        "data": image_data,\n                    },\n                },\n                {\n                    "type": "text",\n                    "text": "Опиши что изображено на этом скриншоте"\n                }\n            ],\n        }\n    ],\n)\n\nprint(message.content[0].text)'
        },
        {
          type: 'list',
          value: 'Поддерживаемые форматы: JPEG, PNG, GIF, WebP\nМаксимальный размер файла: 5 МБ\nМаксимальное разрешение: 8000x8000 пикселей\nbase64 увеличивает размер данных на ~33%'
        }
      ]
    },
    {
      id: 2,
      title: 'Отправка изображений по URL',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Изображения по ссылке'
        },
        {
          type: 'text',
          value: 'Если изображение доступно по публичному URL, можно передать ссылку напрямую. Сервер Anthropic скачает изображение самостоятельно. Это удобнее base64 для публичных ресурсов.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[\n        {\n            "role": "user",\n            "content": [\n                {\n                    "type": "image",\n                    "source": {\n                        "type": "url",\n                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",\n                    },\n                },\n                {\n                    "type": "text",\n                    "text": "Что изображено на картинке? Опиши цвета и объекты."\n                }\n            ],\n        }\n    ],\n)\n\nprint(message.content[0].text)'
        },
        {
          type: 'warning',
          value: 'URL должен быть публично доступен — Anthropic скачивает изображение со своих серверов. Защищённые, требующие авторизации или внутренние корпоративные URL работать не будут. Для приватных изображений используйте base64.'
        },
        {
          type: 'tip',
          value: 'URL-метод быстрее и проще в разработке, но base64 надёжнее для продакшена: вы не зависите от доступности внешнего URL и контролируете, что именно отправляется.'
        }
      ]
    },
    {
      id: 3,
      title: 'Анализ изображений',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что умеет Claude с изображениями'
        },
        {
          type: 'text',
          value: 'Claude способен на широкий спектр задач с изображениями: описание содержимого, ответы на вопросы о деталях, нахождение ошибок, сравнение изображений, извлечение текста (OCR), анализ графиков и диаграмм.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\ndef analyze_image(image_path: str, question: str) -> str:\n    """Универсальная функция анализа изображения"""\n    with open(image_path, "rb") as f:\n        image_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n    # Определяем медиа-тип по расширению\n    ext = image_path.split(".")[-1].lower()\n    media_types = {"jpg": "image/jpeg", "jpeg": "image/jpeg",\n                   "png": "image/png", "gif": "image/gif", "webp": "image/webp"}\n    media_type = media_types.get(ext, "image/jpeg")\n\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64",\n                 "media_type": media_type, "data": image_data}},\n                {"type": "text", "text": question}\n            ]\n        }]\n    )\n    return response.content[0].text\n\n# Примеры использования\n# analyze_image("chart.png", "Какой тренд показывает этот график? Опиши основные данные")\n# analyze_image("receipt.jpg", "Извлеки все позиции и суммы из этого чека")\n# analyze_image("code_screenshot.png", "Найди ошибки в этом коде")\n# analyze_image("diagram.png", "Объясни эту архитектурную диаграмму")\n\nprint("Функция analyze_image готова к использованию")'
        },
        {
          type: 'list',
          value: 'Описание: что изображено, стиль, настроение\nOCR: извлечение текста из изображений, скриншотов, фото документов\nАнализ графиков: интерпретация данных, трендов, аномалий\nПоиск ошибок: в коде на скриншоте, в дизайне, в документах\nСравнение: найти различия между двумя изображениями'
        }
      ]
    },
    {
      id: 4,
      title: 'Извлечение данных из документов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Обработка фотографий документов'
        },
        {
          type: 'text',
          value: 'Одна из мощнейших возможностей Vision: извлечение структурированных данных из фотографий документов — чеков, накладных, форм, паспортов, визиток. Claude понимает структуру документа и извлекает данные в JSON.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\nimport json\n\nclient = anthropic.Anthropic()\n\ndef extract_receipt_data(image_path: str) -> dict:\n    """Извлечь данные из фото чека"""\n    with open(image_path, "rb") as f:\n        image_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image", "source": {"type": "base64",\n                 "media_type": "image/jpeg", "data": image_data}},\n                {"type": "text", "text": """Извлеки данные из этого чека и верни JSON:\n{\n  "store": "название магазина",\n  "date": "дата в формате YYYY-MM-DD",\n  "items": [\n    {"name": "название", "quantity": 1, "price": 0.00}\n  ],\n  "subtotal": 0.00,\n  "tax": 0.00,\n  "total": 0.00\n}\nВерни только JSON, без пояснений."""}\n            ]\n        }]\n    )\n\n    text = response.content[0].text.strip()\n    # Убираем markdown-блоки если они есть\n    if text.startswith("```"):\n        text = text.split("```")[1]\n        if text.startswith("json"):\n            text = text[4:]\n    return json.loads(text)\n\n# Пример вызова (нужен реальный файл чека)\n# data = extract_receipt_data("receipt.jpg")\n# print(json.dumps(data, ensure_ascii=False, indent=2))\nprint("Функция extract_receipt_data готова")'
        },
        {
          type: 'note',
          value: 'Claude хорошо справляется с извлечением данных из типичных документов даже при частичной видимости или плохом качестве фото. Используйте чёткие JSON-схемы в промпте для надёжного парсинга.'
        }
      ]
    },
    {
      id: 5,
      title: 'Несколько изображений в запросе',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сравнение и анализ нескольких изображений'
        },
        {
          type: 'text',
          value: 'В один запрос можно включить несколько изображений. Claude проанализирует их вместе, что полезно для сравнения, поиска различий, составления отчёта по серии фотографий.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport base64\n\nclient = anthropic.Anthropic()\n\ndef compare_images(image_paths: list, question: str) -> str:\n    """Сравнить несколько изображений"""\n    content = []\n\n    for i, path in enumerate(image_paths, 1):\n        with open(path, "rb") as f:\n            data = base64.standard_b64encode(f.read()).decode("utf-8")\n        ext = path.split(".")[-1].lower()\n        media_type = "image/png" if ext == "png" else "image/jpeg"\n\n        # Добавляем подпись перед каждым изображением\n        content.append({"type": "text", "text": f"Изображение {i}:"})\n        content.append({"type": "image",\n                        "source": {"type": "base64", "media_type": media_type, "data": data}})\n\n    # Добавляем вопрос в конце\n    content.append({"type": "text", "text": question})\n\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": content}]\n    )\n    return response.content[0].text\n\n# Примеры использования\n# compare_images(["before.jpg", "after.jpg"], "Опиши изменения между этими изображениями")\n# compare_images(["design_v1.png", "design_v2.png"], "Найди все отличия в дизайне")\n# compare_images([f"page_{i}.jpg" for i in range(1, 4)], "Суммаризируй эти страницы отчёта")\nprint("Функция compare_images готова")'
        },
        {
          type: 'tip',
          value: 'Лимит изображений в одном запросе — до 20 изображений. При большом количестве изображений учитывайте, что каждое изображение потребляет токены (от 85 до нескольких тысяч в зависимости от размера).'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализатор изображений',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте скрипт, который принимает путь к изображению из командной строки и выполняет его полный анализ: описание содержимого, извлечение любого текста (OCR) и определение типа изображения.',
      requirements: [
        'Читать путь к файлу из sys.argv[1]',
        'Проверять существование файла и поддерживаемый формат (jpg, jpeg, png, gif, webp)',
        'Читать файл и кодировать в base64',
        'Отправить запрос с тремя задачами: тип изображения, описание, OCR-текст',
        'Вывести структурированный отчёт с тремя секциями',
        'Обработать ошибку FileNotFoundError с понятным сообщением'
      ],
      expectedOutput: '=== Анализ изображения: screenshot.png ===\n\nТип изображения:\nСкриншот веб-интерфейса / Фотография / Диаграмма...\n\nОписание содержимого:\nИзображение показывает...\n\nИзвлечённый текст (OCR):\nНайденный текст: "Hello World" / Текст не обнаружен\n\n=== Анализ завершён ===',
      hint: 'Используйте sys.argv для аргументов командной строки. В одном запросе можно задать все три вопроса сразу через многострочный текстовый блок. Словарь media_types поможет определить медиа-тип по расширению файла.',
      solution: 'import anthropic\nimport base64\nimport sys\nfrom pathlib import Path\n\ndef analyze_image_full(image_path: str):\n    # Проверка существования файла\n    path = Path(image_path)\n    if not path.exists():\n        print(f"Ошибка: файл \'{image_path}\' не найден")\n        sys.exit(1)\n\n    # Проверка формата\n    supported = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",\n                 ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp"}\n    media_type = supported.get(path.suffix.lower())\n    if not media_type:\n        print(f"Ошибка: неподдерживаемый формат {path.suffix}")\n        print(f"Поддерживаются: {list(supported.keys())}")\n        sys.exit(1)\n\n    # Читаем и кодируем\n    with open(image_path, "rb") as f:\n        image_data = base64.standard_b64encode(f.read()).decode("utf-8")\n\n    client = anthropic.Anthropic()\n\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{\n            "role": "user",\n            "content": [\n                {"type": "image",\n                 "source": {"type": "base64", "media_type": media_type, "data": image_data}},\n                {"type": "text", "text": """Проанализируй это изображение и ответь на три вопроса:\n\n1. ТИП ИЗОБРАЖЕНИЯ: Это скриншот, фотография, диаграмма, схема, документ или что-то другое?\n\n2. ОПИСАНИЕ СОДЕРЖИМОГО: Подробно опиши что изображено.\n\n3. ИЗВЛЕЧЁННЫЙ ТЕКСТ (OCR): Перечисли весь текст, который видишь на изображении. Если текста нет — напиши "Текст не обнаружен".\n\nФорматируй ответ с тремя секциями, начиная каждую с соответствующего номера."""}\n            ]\n        }]\n    )\n\n    print(f"=== Анализ изображения: {path.name} ===")\n    print()\n    print(response.content[0].text)\n    print()\n    print("=== Анализ завершён ===")\n\nif __name__ == "__main__":\n    if len(sys.argv) < 2:\n        print("Использование: python script.py <путь_к_изображению>")\n        print("Пример: python script.py screenshot.png")\n        sys.exit(1)\n\n    analyze_image_full(sys.argv[1])',
      explanation: 'Скрипт демонстрирует полный рабочий процесс Vision API: валидация входных данных → кодирование → запрос с мультимодальным контентом (изображение + текст). Контент сообщения передаётся как список блоков: сначала блок изображения (type: "image"), затем текстовый вопрос (type: "text"). Один запрос содержит три подзадачи — это эффективнее трёх отдельных запросов. Запрос к модели claude-opus-4-5 обеспечивает лучшее качество распознавания изображений.'
    }
  ]
}
