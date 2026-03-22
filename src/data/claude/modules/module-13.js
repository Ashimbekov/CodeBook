export default {
  id: 13,
  title: 'Структурированный вывод (JSON, XML)',
  description: 'Получение структурированных данных от Claude: JSON, XML, Markdown-таблицы, определение схем в промпте, парсинг и обработка некорректного вывода',
  lessons: [
    {
      id: 1,
      title: 'Запрос JSON-вывода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структурированный вывод — одна из ключевых техник для интеграции Claude в приложения. JSON — самый распространённый формат, поскольку его легко парсить в любом языке программирования.' },
        { type: 'heading', value: 'Базовый запрос JSON' },
        { type: 'code', language: 'python', value: 'prompt = """\nИзвлеки информацию о человеке из текста и верни ТОЛЬКО валидный JSON.\nНикакого пояснительного текста — только JSON.\n\nТекст: "Алибек Жанов, 28 лет, старший разработчик в Kaspi Bank, Алматы"\n\nОтвет должен быть в формате:\n{"name": "...", "age": ..., "position": "...", "company": "...", "city": "..."}\n"""' },
        { type: 'heading', value: 'Хитрость: prefill ответа' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef extract_to_json(text: str) -> str:\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=512,\n        messages=[\n            {"role": "user", "content": f"Извлеки данные в JSON: {text}"},\n            {"role": "assistant", "content": "{"}  # prefill — начинаем с {{\n        ]\n    )\n    # Добавляем { обратно так как он уже в prefill\n    return "{" + response.content[0].text' },
        { type: 'tip', value: 'Техника prefill (начать ответ ассистента с "{") гарантирует что модель сразу начнёт JSON без вводных слов вроде "Конечно! Вот JSON:"' },
        { type: 'note', value: 'Claude 3+ хорошо выдаёт валидный JSON без prefill если попросить явно. Для Haiku prefill особенно полезен.' }
      ]
    },
    {
      id: 2,
      title: 'XML-вывод',
      type: 'theory',
      content: [
        { type: 'text', value: 'XML часто предпочтительнее JSON когда нужны вложенные структуры с атрибутами, или когда вывод будет использоваться в системах работающих с XML (SOAP, конфиги).' },
        { type: 'heading', value: 'Запрос структурированного XML' },
        { type: 'code', language: 'python', value: 'prompt = """\nПроанализируй этот фидбек о продукте и верни результат в XML-формате.\n\nФидбек: "Приложение работает быстро, но иногда вылетает. Дизайн красивый.\nПоддержка отвечает медленно. В целом доволен покупкой."\n\nФормат ответа:\n<feedback_analysis>\n  <sentiment>positive|negative|neutral|mixed</sentiment>\n  <aspects>\n    <aspect name="..." sentiment="positive|negative|neutral"/>\n  </aspects>\n  <summary>краткое резюме</summary>\n  <score min="1" max="10">оценка</score>\n</feedback_analysis>\n"""' },
        { type: 'heading', value: 'Парсинг XML-ответа' },
        { type: 'code', language: 'python', value: 'import xml.etree.ElementTree as ET\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef analyze_feedback(feedback: str) -> dict:\n    prompt = f"""\nПроанализируй фидбек и верни ТОЛЬКО XML:\n\n<feedback_analysis>\n  <sentiment>positive|negative|neutral|mixed</sentiment>\n  <summary>одно предложение</summary>\n  <score>число от 1 до 10</score>\n</feedback_analysis>\n\nФидбек: {feedback}\n"""\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=256,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    xml_text = response.content[0].text.strip()\n    root = ET.fromstring(xml_text)\n    return {\n        "sentiment": root.findtext("sentiment"),\n        "summary": root.findtext("summary"),\n        "score": int(root.findtext("score", "5"))\n    }' }
      ]
    },
    {
      id: 3,
      title: 'Markdown-таблицы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Markdown-таблицы полезны когда данные нужно отображать пользователю. Claude хорошо генерирует таблицы по описанию структуры.' },
        { type: 'heading', value: 'Запрос Markdown-таблицы' },
        { type: 'code', language: 'python', value: 'prompt = """\nСравни три фреймворка для веб-разработки: React, Vue, Angular.\nВерни сравнение в виде Markdown-таблицы.\n\nКолонки: Фреймворк | Язык | Кривая обучения | Производительность | Экосистема | Лучше для\nИспользуй оценки: Низкая/Средняя/Высокая\n"""' },
        { type: 'heading', value: 'Парсинг Markdown-таблицы в Python' },
        { type: 'code', language: 'python', value: 'def parse_markdown_table(md_text: str) -> list:\n    """Парсит Markdown-таблицу в список словарей"""\n    lines = [l.strip() for l in md_text.strip().split("\\n")]\n    # Фильтруем строки таблицы\n    table_lines = [l for l in lines if l.startswith("|")]\n    if len(table_lines) < 3:  # заголовок + разделитель + данные\n        return []\n    \n    # Парсим заголовки\n    headers = [h.strip() for h in table_lines[0].split("|") if h.strip()]\n    \n    # Парсим строки данных (пропускаем разделитель на индексе 1)\n    rows = []\n    for line in table_lines[2:]:\n        cells = [c.strip() for c in line.split("|") if c.strip()]\n        if len(cells) == len(headers):\n            rows.append(dict(zip(headers, cells)))\n    return rows\n\nimport anthropic\nclient = anthropic.Anthropic()\n\nresponse = client.messages.create(\n    model="claude-haiku-4-5",\n    max_tokens=512,\n    messages=[{"role": "user", "content": prompt}]\n)\ntable_data = parse_markdown_table(response.content[0].text)\nprint(table_data)' },
        { type: 'tip', value: 'Markdown-таблицы хороши для отображения, но плохи для дальнейшей обработки. Если данные нужны программно — просите JSON.' }
      ]
    },
    {
      id: 4,
      title: 'Извлечение структурированных данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Извлечение данных из неструктурированного текста — одна из мощнейших задач для Claude. Модель умеет "понимать" контекст и вытаскивать нужные поля даже из сложного текста.' },
        { type: 'heading', value: 'Извлечение из объявлений о вакансии' },
        { type: 'code', language: 'python', value: 'vacancy_text = """\nТребуется Senior Python Developer в финтех-стартап в Алматы.\nОпыт: от 4 лет. Стек: Python, FastAPI, PostgreSQL, Redis, Docker.\nЗарплата: 600 000 — 900 000 тг. Удалённо/гибрид.\nБонусы: акции компании, ДМС, корп. обучение.\nКонтакт: hr@fintech.kz\n"""\n\nprompt = f"""\nИзвлеки данные о вакансии в JSON.\n\nТекст вакансии:\n{vacancy_text}\n\nСхема JSON:\n{{\n  "title": "должность",\n  "experience_years": число,\n  "skills": ["список", "технологий"],\n  "salary_min": число или null,\n  "salary_max": число или null,\n  "currency": "код валюты",\n  "location": "город",\n  "remote": true/false,\n  "contact": "email или null"\n}}\n\nВерни только JSON, без пояснений.\n"""' },
        { type: 'code', language: 'python', value: 'import json\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef extract_vacancy(text: str) -> dict:\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=512,\n        messages=[\n            {"role": "user", "content": prompt},\n            {"role": "assistant", "content": "{"}\n        ]\n    )\n    raw = "{" + response.content[0].text\n    return json.loads(raw)\n\ndata = extract_vacancy(vacancy_text)\nprint(json.dumps(data, ensure_ascii=False, indent=2))' }
      ]
    },
    {
      id: 5,
      title: 'Определение схемы в промпте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чётко определённая схема в промпте — залог стабильного вывода. Чем точнее вы опишете ожидаемую структуру, тем меньше вариаций в ответе модели.' },
        { type: 'heading', value: 'Подробная схема с типами и ограничениями' },
        { type: 'code', language: 'python', value: 'SCHEMA_PROMPT = """\nВерни ответ строго по следующей JSON-схеме.\nВсе поля обязательны. Не добавляй лишних полей.\n\nСхема:\n{\n  "product": {\n    "name": string,           // название продукта\n    "category": string,       // одно из: electronics|clothing|food|other\n    "price": number,          // цена в тенге, целое число > 0\n    "in_stock": boolean,      // есть ли на складе\n    "tags": array of strings  // 1-5 тегов\n  },\n  "analysis": {\n    "sentiment": string,      // positive|negative|neutral\n    "confidence": number      // от 0.0 до 1.0\n  }\n}\n\nОписание продукта: {description}\n"""' },
        { type: 'heading', value: 'Использование TypeScript-типов как схемы' },
        { type: 'code', language: 'python', value: 'TS_SCHEMA_PROMPT = """\nИзвлеки данные согласно TypeScript-интерфейсу:\n\ninterface OrderData {\n  orderId: string;           // формат: ORD-XXXXX\n  customer: {\n    name: string;\n    email: string;\n  };\n  items: Array<{\n    sku: string;\n    quantity: number;        // целое число > 0\n    price: number;           // цена за единицу\n  }>;\n  totalAmount: number;       // сумма всех items\n  status: \'pending\' | \'processing\' | \'shipped\' | \'delivered\';\n}\n\nВерни JSON соответствующий этому интерфейсу.\nТекст заказа: {order_text}\n"""' },
        { type: 'note', value: 'TypeScript-интерфейсы как схемы работают хорошо — модели обучены на огромном количестве TypeScript-кода и понимают эти типы.' }
      ]
    },
    {
      id: 6,
      title: 'Парсинг и валидация структурированного вывода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Даже при идеальном промпте модель может вернуть невалидный JSON. Robustный код должен уметь обрабатывать такие случаи.' },
        { type: 'heading', value: 'Валидация с Pydantic' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, validator\nfrom typing import List, Optional\nimport json\n\nclass ProductInfo(BaseModel):\n    name: str\n    category: str\n    price: float\n    in_stock: bool\n    tags: List[str]\n    \n    @validator("category")\n    def validate_category(cls, v):\n        allowed = ["electronics", "clothing", "food", "other"]\n        if v not in allowed:\n            return "other"\n        return v\n    \n    @validator("price")\n    def validate_price(cls, v):\n        if v <= 0:\n            raise ValueError("Цена должна быть > 0")\n        return v\n\ndef safe_parse_product(json_str: str) -> Optional[ProductInfo]:\n    try:\n        data = json.loads(json_str)\n        return ProductInfo(**data)\n    except json.JSONDecodeError as e:\n        print(f"JSON ошибка: {e}")\n        return None\n    except Exception as e:\n        print(f"Валидация: {e}")\n        return None' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Извлечение данных из резюме',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему parse_resume(), которая принимает текст резюме и возвращает структурированные данные. Используй Pydantic для валидации схемы с полями: имя, email, телефон, навыки, опыт работы (список), образование.',
      requirements: [
        'Функция parse_resume(text: str) -> dict',
        'JSON-схема включает: name, email, phone, skills[], experience[], education[]',
        'Валидация через Pydantic (BaseModel)',
        'Обработка случаев когда поле отсутствует (None/пустой список)',
        'Протестировать на 2 разных резюме'
      ],
      expectedOutput: '{\n  "name": "Айгерим Сейткали",\n  "email": "aigerim@gmail.com",\n  "phone": "+7 701 234 5678",\n  "skills": ["Python", "SQL", "Excel"],\n  "experience": [{"company": "...", "role": "...", "years": 2}],\n  "education": [{"institution": "КазНУ", "degree": "Бакалавр"}]\n}',
      hint: 'Определи Pydantic-модели ResumeData, ExperienceItem, EducationItem. В промпте опиши схему. Используй prefill "{" для надёжного JSON.',
      solution: 'from pydantic import BaseModel\nfrom typing import List, Optional\nimport json\nimport anthropic\n\nclass ExperienceItem(BaseModel):\n    company: str\n    role: str\n    years: Optional[float] = None\n\nclass EducationItem(BaseModel):\n    institution: str\n    degree: str\n\nclass ResumeData(BaseModel):\n    name: str\n    email: Optional[str] = None\n    phone: Optional[str] = None\n    skills: List[str] = []\n    experience: List[ExperienceItem] = []\n    education: List[EducationItem] = []\n\nclient = anthropic.Anthropic()\n\ndef parse_resume(text: str) -> dict:\n    prompt = f"""\nИзвлеки данные из резюме в JSON строго по схеме.\nЕсли поле не найдено — используй null или [].\n\nСхема:\n{{\n  "name": "ФИО",\n  "email": "email или null",\n  "phone": "телефон или null",\n  "skills": ["навык1", "навык2"],\n  "experience": [\n    {{"company": "название", "role": "должность", "years": число}}\n  ],\n  "education": [\n    {{"institution": "учреждение", "degree": "степень"}}\n  ]\n}}\n\nРезюме:\n{text}\n\nВерни только JSON.\n"""\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=1024,\n        messages=[\n            {"role": "user", "content": prompt},\n            {"role": "assistant", "content": "{"}\n        ]\n    )\n    raw = "{" + response.content[0].text\n    data = json.loads(raw)\n    resume = ResumeData(**data)\n    return resume.model_dump()\n\ntest_resume = """\nАйгерим Сейткали\naigerim.seitkali@gmail.com | +7 701 234 5678\n\nНавыки: Python, SQL, Tableau, Excel, Power BI\n\nОпыт:\n2021-2023 — Аналитик данных, Kaspi Bank\n2023-н.в. — Senior Data Analyst, Kolesa Group\n\nОбразование:\n2017-2021 — Казахский Национальный Университет, Бакалавр информатики\n"""\n\nresult = parse_resume(test_resume)\nprint(json.dumps(result, ensure_ascii=False, indent=2))',
      explanation: 'Pydantic-модели задают строгую схему и автоматически обрабатывают null-значения через Optional. Три вложенных класса отражают структуру реального резюме. Prefill "{" в assistant message гарантирует что ответ начинается сразу с JSON. model_dump() конвертирует Pydantic-объект обратно в dict для возврата.'
    }
  ]
}
