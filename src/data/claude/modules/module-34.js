export default {
  id: 34,
  title: 'Tool Use / Function Calling',
  description: 'Учим Claude использовать инструменты: определяем функции через JSON Schema, обрабатываем вызовы инструментов, выполняем их и возвращаем результаты. Параллельный вызов и реальные примеры.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Tool Use',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Расширение возможностей Claude через инструменты'
        },
        {
          type: 'text',
          value: 'Tool Use (Function Calling) позволяет Claude вызывать внешние функции: искать в интернете, делать запросы к базам данных, вычислять, отправлять запросы к API. Claude не выполняет код — он только указывает, какой инструмент вызвать и с какими аргументами. Вы выполняете функцию и возвращаете результат.'
        },
        {
          type: 'list',
          value: 'Claude анализирует запрос пользователя\nОпределяет, что нужен внешний инструмент\nВозвращает tool_use блок с именем функции и аргументами\nВы выполняете функцию в своём коде\nВозвращаете результат в API как tool_result\nClaude формирует финальный ответ на основе результата'
        },
        {
          type: 'text',
          value: 'Это фундаментальный механизм для создания AI-агентов, которые могут взаимодействовать с реальным миром: читать файлы, обращаться к базам данных, вызывать внешние API, управлять интерфейсом браузера.'
        },
        {
          type: 'note',
          value: 'Claude безопасен: он не может сам выполнить код или обратиться к внешним ресурсам. Всё выполнение инструментов происходит в вашем коде под вашим контролем.'
        }
      ]
    },
    {
      id: 2,
      title: 'Определение инструментов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'JSON Schema для описания инструментов'
        },
        {
          type: 'text',
          value: 'Инструменты описываются через JSON Schema. Каждый инструмент имеет: имя, описание (для Claude, чтобы понять когда его использовать) и схему входных параметров.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Определяем инструменты в формате JSON Schema\ntools = [\n    {\n        "name": "get_weather",\n        "description": "Получить текущую погоду в указанном городе. "\n                       "Используй этот инструмент когда пользователь спрашивает о погоде.",\n        "input_schema": {\n            "type": "object",\n            "properties": {\n                "city": {\n                    "type": "string",\n                    "description": "Название города, например Алматы или Москва"\n                },\n                "units": {\n                    "type": "string",\n                    "enum": ["celsius", "fahrenheit"],\n                    "description": "Единицы измерения температуры"\n                }\n            },\n            "required": ["city"]  # обязательные поля\n        }\n    },\n    {\n        "name": "calculate",\n        "description": "Выполнить математическое вычисление",\n        "input_schema": {\n            "type": "object",\n            "properties": {\n                "expression": {\n                    "type": "string",\n                    "description": "Математическое выражение, например 2+2 или sqrt(16)"\n                }\n            },\n            "required": ["expression"]\n        }\n    }\n]'
        },
        {
          type: 'tip',
          value: 'Описание инструмента критически важно — от него зависит, когда Claude решит его использовать. Пишите чёткие, конкретные описания: когда применять, что делает, какие ограничения. Это как документация для Claude.'
        }
      ]
    },
    {
      id: 3,
      title: 'tool_choice',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Управление выбором инструментов'
        },
        {
          type: 'text',
          value: 'Параметр tool_choice управляет тем, как Claude выбирает инструменты: автоматически, принудительно или никогда. По умолчанию Claude сам решает, использовать ли инструмент.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ntools = [{\n    "name": "get_weather",\n    "description": "Получить погоду",\n    "input_schema": {\n        "type": "object",\n        "properties": {"city": {"type": "string"}},\n        "required": ["city"]\n    }\n}]\n\n# auto (по умолчанию): Claude сам решает\nresponse_auto = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    tools=tools,\n    tool_choice={"type": "auto"},  # по умолчанию\n    messages=[{"role": "user", "content": "Какая погода в Алматы?"}]\n)\n\n# any: Claude ДОЛЖЕН вызвать какой-нибудь инструмент\nresponse_any = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    tools=tools,\n    tool_choice={"type": "any"},  # принудительно вызвать хоть что-то\n    messages=[{"role": "user", "content": "Привет!"}]  # не связано с погодой\n)\n\n# tool: принудительно вызвать конкретный инструмент\nresponse_specific = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    tools=tools,\n    tool_choice={"type": "tool", "name": "get_weather"},  # конкретный инструмент\n    messages=[{"role": "user", "content": "Привет!"}]\n)'
        },
        {
          type: 'list',
          value: 'auto: Claude сам решает использовать инструмент или ответить текстом\nany: Claude обязан вызвать хотя бы один инструмент\ntool: Claude обязан вызвать конкретный указанный инструмент'
        }
      ]
    },
    {
      id: 4,
      title: 'Обработка tool_use ответа',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как читать ответ с вызовом инструмента'
        },
        {
          type: 'text',
          value: 'Когда Claude хочет вызвать инструмент, ответ содержит блок типа tool_use вместо или вместе с текстом. stop_reason будет "tool_use".'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\ntools = [{\n    "name": "get_weather",\n    "description": "Получить текущую погоду",\n    "input_schema": {\n        "type": "object",\n        "properties": {\n            "city": {"type": "string", "description": "Название города"}\n        },\n        "required": ["city"]\n    }\n}]\n\nresponse = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    tools=tools,\n    messages=[{"role": "user", "content": "Какая погода в Алматы?"}]\n)\n\nprint("stop_reason:", response.stop_reason)  # tool_use\nprint("Блоков контента:", len(response.content))\n\nfor block in response.content:\n    print(f"Тип блока: {block.type}")\n    if block.type == "text":\n        print(f"Текст: {block.text}")\n    elif block.type == "tool_use":\n        print(f"Инструмент: {block.name}")\n        print(f"ID вызова: {block.id}")    # нужен для tool_result\n        print(f"Аргументы: {block.input}")  # dict с параметрами\n        print(f"city = {block.input[\'city\']}")'
        }
      ]
    },
    {
      id: 5,
      title: 'Выполнение инструментов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Полный цикл: вызов инструмента и возврат результата'
        },
        {
          type: 'text',
          value: 'После получения tool_use блока нужно выполнить соответствующую функцию и вернуть результат через новый запрос API с ролью "user" и блоком tool_result.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\n# Реальная функция инструмента (имитация API погоды)\ndef get_weather(city: str, units: str = "celsius") -> dict:\n    # В реальном коде — запрос к weather API\n    weather_data = {\n        "Алматы": {"temp": 22, "condition": "Солнечно", "humidity": 45},\n        "Москва": {"temp": 8, "condition": "Облачно", "humidity": 70},\n    }\n    data = weather_data.get(city, {"temp": 15, "condition": "Неизвестно", "humidity": 50})\n    unit_symbol = "°C" if units == "celsius" else "°F"\n    return {\n        "city": city,\n        "temperature": f"{data[\'temp\']}{unit_symbol}",\n        "condition": data["condition"],\n        "humidity": f"{data[\'humidity\']}%"\n    }\n\ntools = [{\n    "name": "get_weather",\n    "description": "Получить текущую погоду в городе",\n    "input_schema": {\n        "type": "object",\n        "properties": {\n            "city": {"type": "string"},\n            "units": {"type": "string", "enum": ["celsius", "fahrenheit"]}\n        },\n        "required": ["city"]\n    }\n}]\n\n# Шаг 1: первый запрос\nmessages = [{"role": "user", "content": "Какая погода в Алматы?"}]\nresponse = client.messages.create(\n    model="claude-opus-4-5", max_tokens=512,\n    tools=tools, messages=messages\n)\n\n# Шаг 2: обработка tool_use\nif response.stop_reason == "tool_use":\n    tool_block = next(b for b in response.content if b.type == "tool_use")\n\n    # Выполняем функцию\n    result = get_weather(**tool_block.input)\n    print("Результат функции:", result)\n\n    # Шаг 3: добавляем ответ Claude и результат инструмента в историю\n    messages.append({"role": "assistant", "content": response.content})\n    messages.append({\n        "role": "user",\n        "content": [{\n            "type": "tool_result",\n            "tool_use_id": tool_block.id,  # ID из tool_use блока!\n            "content": json.dumps(result, ensure_ascii=False)\n        }]\n    })\n\n    # Шаг 4: финальный запрос с результатом инструмента\n    final = client.messages.create(\n        model="claude-opus-4-5", max_tokens=512,\n        tools=tools, messages=messages\n    )\n    print("\\nФинальный ответ:", final.content[0].text)'
        }
      ]
    },
    {
      id: 6,
      title: 'Multi-turn Tool Use',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Несколько инструментов за один диалог'
        },
        {
          type: 'text',
          value: 'Claude может вызывать инструменты несколько раз в рамках одного диалога. После получения результата одного инструмента он может запросить другой. Это основа агентного поведения.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\ndef process_tool_call(tool_name: str, tool_input: dict) -> str:\n    """Диспетчер инструментов"""\n    if tool_name == "search":\n        return f"Результаты поиска \'{tool_input[\'query\']}\': найдено 5 статей..."\n    elif tool_name == "get_page":\n        return f"Содержимое страницы {tool_input[\'url\']}: Алматы — крупнейший город Казахстана..."\n    return "Неизвестный инструмент"\n\ntools = [\n    {"name": "search", "description": "Поиск информации в интернете",\n     "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}},\n    {"name": "get_page", "description": "Получить содержимое веб-страницы",\n     "input_schema": {"type": "object", "properties": {"url": {"type": "string"}}, "required": ["url"]}}\n]\n\nmessages = [{"role": "user", "content": "Найди информацию об Алматы и summarize"}]\n\n# Цикл агента: продолжаем пока Claude вызывает инструменты\nwhile True:\n    response = client.messages.create(\n        model="claude-opus-4-5", max_tokens=1024,\n        tools=tools, messages=messages\n    )\n\n    if response.stop_reason != "tool_use":\n        # Claude закончил вызывать инструменты\n        print("Финальный ответ:", response.content[0].text)\n        break\n\n    # Обрабатываем все tool_use блоки\n    messages.append({"role": "assistant", "content": response.content})\n    tool_results = []\n\n    for block in response.content:\n        if block.type == "tool_use":\n            print(f"Вызов: {block.name}({block.input})")\n            result = process_tool_call(block.name, block.input)\n            tool_results.append({\n                "type": "tool_result",\n                "tool_use_id": block.id,\n                "content": result\n            })\n\n    messages.append({"role": "user", "content": tool_results})'
        }
      ]
    },
    {
      id: 7,
      title: 'Параллельный Tool Use',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Вызов нескольких инструментов одновременно'
        },
        {
          type: 'text',
          value: 'Claude может вызвать несколько инструментов в одном ответе (параллельно), если задачи независимы. Это значительно ускоряет выполнение — вместо последовательных вызовов все выполняются одновременно.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport json\nimport concurrent.futures\n\nclient = anthropic.Anthropic()\n\ndef get_weather(city: str) -> str:\n    return f"Погода в {city}: 22°C, солнечно"\n\ndef get_time(timezone: str) -> str:\n    return f"Время в {timezone}: 14:30"\n\ntools = [\n    {"name": "get_weather", "description": "Получить погоду",\n     "input_schema": {"type": "object", "properties": {"city": {"type": "string"}}, "required": ["city"]}},\n    {"name": "get_time", "description": "Получить текущее время",\n     "input_schema": {"type": "object", "properties": {"timezone": {"type": "string"}}, "required": ["timezone"]}}\n]\n\nresponse = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=512,\n    tools=tools,\n    messages=[{"role": "user", "content": "Какая погода в Алматы и сколько сейчас времени в UTC+5?"}]\n)\n\n# Claude может вернуть несколько tool_use блоков!\ntool_use_blocks = [b for b in response.content if b.type == "tool_use"]\nprint(f"Инструментов вызвано: {len(tool_use_blocks)}")  # может быть 2!\n\n# Параллельное выполнение инструментов\ndef execute_tool(block):\n    if block.name == "get_weather":\n        return block.id, get_weather(**block.input)\n    elif block.name == "get_time":\n        return block.id, get_time(**block.input)\n\nresults = {}\nwith concurrent.futures.ThreadPoolExecutor() as executor:\n    futures = [executor.submit(execute_tool, b) for b in tool_use_blocks]\n    for future in concurrent.futures.as_completed(futures):\n        tool_id, result = future.result()\n        results[tool_id] = result\n\n# Возвращаем все результаты одновременно\ntool_results = [\n    {"type": "tool_result", "tool_use_id": tid, "content": result}\n    for tid, result in results.items()\n]'
        },
        {
          type: 'tip',
          value: 'Параллельное выполнение инструментов через ThreadPoolExecutor сокращает время ответа. Если вызваны 3 инструмента, каждый занимает 1 секунду, параллельное выполнение даст 1 секунду вместо 3.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Агент с инструментами',
      type: 'practice',
      difficulty: 'advanced',
      description: 'Создайте агента-помощника с тремя инструментами: калькулятор (вычисляет выражения), словарь (возвращает определение слова) и конвертер валют (конвертирует суммы). Агент должен автоматически выбирать нужный инструмент.',
      requirements: [
        'Определить три инструмента: calculate, define_word, convert_currency',
        'calculate: вычислить математическое выражение через eval()',
        'define_word: вернуть фиктивное определение (захардкодить 3-5 слов)',
        'convert_currency: конвертировать сумму с фиксированными курсами',
        'Реализовать цикл агента: продолжать пока stop_reason == tool_use',
        'Тестировать запросы: "Сколько будет 25*48?", "Что такое алгоритм?", "Конвертируй 100 USD в KZT"'
      ],
      expectedOutput: 'Запрос: Сколько будет 25*48?\nВызов: calculate({"expression": "25*48"})\nРезультат: 1200\nОтвет: 25 умноженное на 48 равно 1200.\n\nЗапрос: Что такое алгоритм?\nВызов: define_word({"word": "алгоритм"})\nОтвет: Алгоритм — это...',
      hint: 'Используйте eval() для вычисления выражений (в продакшене используйте безопасные библиотеки). Словарь определений создайте как dict. Курсы валют задайте как dict с парами USD/KZT, EUR/KZT.',
      solution: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\nDEFINITIONS = {\n    "алгоритм": "Алгоритм — это конечная последовательность чётко определённых инструкций для решения задачи или выполнения вычисления.",\n    "рекурсия": "Рекурсия — метод программирования, при котором функция вызывает саму себя для решения подзадачи.",\n    "полиморфизм": "Полиморфизм — принцип ООП, позволяющий использовать один интерфейс для объектов разных типов.",\n}\n\nRATES = {"USD": 450, "EUR": 490, "RUB": 5}  # к KZT\n\ntools = [\n    {"name": "calculate",\n     "description": "Вычислить математическое выражение. Используй для любых математических вопросов.",\n     "input_schema": {"type": "object", "properties": {"expression": {"type": "string", "description": "Математическое выражение"}}, "required": ["expression"]}},\n    {"name": "define_word",\n     "description": "Получить определение слова или термина.",\n     "input_schema": {"type": "object", "properties": {"word": {"type": "string", "description": "Слово для определения"}}, "required": ["word"]}},\n    {"name": "convert_currency",\n     "description": "Конвертировать сумму из одной валюты в другую.",\n     "input_schema": {"type": "object",\n       "properties": {\n         "amount": {"type": "number"}, "from_currency": {"type": "string"}, "to_currency": {"type": "string"}\n       }, "required": ["amount", "from_currency", "to_currency"]}}\n]\n\ndef execute_tool(name: str, args: dict) -> str:\n    if name == "calculate":\n        try:\n            result = eval(args["expression"])\n            return str(result)\n        except Exception as e:\n            return f"Ошибка: {e}"\n    elif name == "define_word":\n        word = args["word"].lower()\n        return DEFINITIONS.get(word, f"Определение для \'{word}\' не найдено.")\n    elif name == "convert_currency":\n        amount = args["amount"]\n        from_cur = args["from_currency"].upper()\n        to_cur = args["to_currency"].upper()\n        if from_cur == "KZT" and to_cur in RATES:\n            result = amount / RATES[to_cur]\n        elif from_cur in RATES and to_cur == "KZT":\n            result = amount * RATES[from_cur]\n        else:\n            return f"Не поддерживается конвертация {from_cur} -> {to_cur}"\n        return f"{amount} {from_cur} = {result:.2f} {to_cur}"\n    return "Неизвестный инструмент"\n\ndef ask_agent(user_query: str):\n    print(f"Запрос: {user_query}")\n    messages = [{"role": "user", "content": user_query}]\n\n    while True:\n        response = client.messages.create(\n            model="claude-opus-4-5", max_tokens=512,\n            tools=tools, messages=messages\n        )\n\n        if response.stop_reason != "tool_use":\n            print(f"Ответ: {response.content[0].text}\\n")\n            break\n\n        messages.append({"role": "assistant", "content": response.content})\n        tool_results = []\n        for block in response.content:\n            if block.type == "tool_use":\n                print(f"Вызов: {block.name}({json.dumps(block.input, ensure_ascii=False)})")\n                result = execute_tool(block.name, block.input)\n                print(f"Результат: {result}")\n                tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})\n\n        messages.append({"role": "user", "content": tool_results})\n\nask_agent("Сколько будет 25*48?")\nask_agent("Что такое рекурсия?")\nask_agent("Конвертируй 100 USD в KZT")',
      explanation: 'Агент работает в цикле while True: отправляет запрос, проверяет stop_reason. Если "tool_use" — выполняет инструменты и добавляет результаты в историю. Если нет — выводит финальный ответ. Диспетчер execute_tool() маршрутизирует вызовы по имени инструмента. Ключевой момент: tool_results передаются как список в role: "user", а ID из tool_use блока должен совпадать с tool_use_id в tool_result. Это связывает вызов и результат.'
    }
  ]
}
