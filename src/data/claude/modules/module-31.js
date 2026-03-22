export default {
  id: 31,
  title: 'Anthropic API: начало работы',
  description: 'Изучаем, как получить API-ключ, установить SDK, сделать первый запрос к Claude через API и разобраться со структурой ответов, версионированием и аутентификацией.',
  lessons: [
    {
      id: 1,
      title: 'Получение API-ключа',
      content: [
        {
          type: 'heading',
          value: 'Как получить доступ к Anthropic API'
        },
        {
          type: 'text',
          value: 'Чтобы использовать Claude через API, нужен API-ключ. Ключ — это секретная строка, которая идентифицирует вас перед сервером Anthropic. Без ключа запросы будут отклонены с ошибкой 401 Unauthorized.'
        },
        {
          type: 'list',
          value: 'Шаг 1: Зайдите на console.anthropic.com и создайте аккаунт\nШаг 2: Перейдите в раздел "API Keys"\nШаг 3: Нажмите "Create Key" и задайте имя ключу\nШаг 4: Скопируйте ключ сразу — он показывается только один раз\nШаг 5: Сохраните ключ в безопасном месте (менеджер паролей или переменная окружения)'
        },
        {
          type: 'warning',
          value: 'Никогда не вставляйте API-ключ прямо в код и не коммитьте его в Git. Используйте переменные окружения или файл .env, добавленный в .gitignore. Утечка ключа грозит несанкционированными расходами на вашем аккаунте.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Правильный способ: задать переменную окружения\nexport ANTHROPIC_API_KEY="sk-ant-api03-..."\n\n# Или добавить в ~/.bashrc / ~/.zshrc\necho \'export ANTHROPIC_API_KEY="sk-ant-api03-..."\' >> ~/.bashrc\nsource ~/.bashrc\n\n# Проверить, что ключ установлен\necho $ANTHROPIC_API_KEY'
        },
        {
          type: 'tip',
          value: 'Создавайте отдельные ключи для каждого проекта. Так вы сможете отозвать ключ одного проекта, не затрагивая остальные. В консоли Anthropic видна статистика использования каждого ключа.'
        }
      ]
    },
    {
      id: 2,
      title: 'Консоль Anthropic',
      content: [
        {
          type: 'heading',
          value: 'Что можно делать в console.anthropic.com'
        },
        {
          type: 'text',
          value: 'Консоль Anthropic — веб-интерфейс для управления API-доступом, мониторинга использования и тестирования запросов. Это ваш центр управления всем, что связано с API.'
        },
        {
          type: 'list',
          value: 'API Keys — создание, просмотр и отзыв ключей\nWorkbench — интерактивная песочница для тестирования промптов\nUsage — графики использования токенов и расходов\nSettings — настройки аккаунта, лимиты, уведомления о расходах\nModels — список доступных моделей с характеристиками'
        },
        {
          type: 'text',
          value: 'Workbench особенно полезен для прототипирования: вы можете протестировать промпт с разными настройками (температура, max_tokens, системный промпт) прямо в браузере, не написав ни строчки кода.'
        },
        {
          type: 'note',
          value: 'В консоли можно задать бюджетные уведомления: вы получите email, когда расходы за месяц достигнут порога. Это защитит от неожиданных счётов при разработке.'
        }
      ]
    },
    {
      id: 3,
      title: 'Установка SDK',
      content: [
        {
          type: 'heading',
          value: 'Официальные SDK для Python и JavaScript'
        },
        {
          type: 'text',
          value: 'Anthropic предоставляет официальные SDK для Python и JavaScript/TypeScript. SDK берут на себя формирование HTTP-запросов, обработку ошибок и аутентификацию — вам не нужно вручную работать с REST API.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Python SDK\npip install anthropic\n\n# Или через poetry\npoetry add anthropic\n\n# JavaScript/TypeScript SDK\nnpm install @anthropic-ai/sdk\n\n# Или через yarn\nyarn add @anthropic-ai/sdk'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Проверка установки Python SDK\nimport anthropic\nprint(anthropic.__version__)  # например: 0.34.0\n\n# Создание клиента\n# SDK автоматически читает ANTHROPIC_API_KEY из окружения\nclient = anthropic.Anthropic()\n\n# Или явно передать ключ (не рекомендуется для продакшена)\nclient = anthropic.Anthropic(api_key="sk-ant-...")'
        },
        {
          type: 'tip',
          value: 'Для Python рекомендуется использовать виртуальное окружение: python -m venv venv && source venv/bin/activate. Это изолирует зависимости проекта и избегает конфликтов версий.'
        }
      ]
    },
    {
      id: 4,
      title: 'Первый API-запрос',
      content: [
        {
          type: 'heading',
          value: 'Hello World через Anthropic API'
        },
        {
          type: 'text',
          value: 'Самый простой запрос к API: отправить сообщение и получить ответ. Минимальный набор параметров — имя модели, максимальное число токенов и список сообщений.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[\n        {"role": "user", "content": "Привет! Как дела?"}\n    ]\n)\n\nprint(message.content[0].text)\n# Привет! У меня всё хорошо, спасибо что спросил...'
        },
        {
          type: 'text',
          value: 'Этот код делает HTTPS POST-запрос к endpoint https://api.anthropic.com/v1/messages. SDK формирует заголовки (включая API-ключ), сериализует тело в JSON и десериализует ответ обратно в объект Python.'
        },
        {
          type: 'note',
          value: 'Параметр max_tokens обязателен. Он ограничивает длину ответа в токенах и напрямую влияет на стоимость. Начните с 1024 для коротких ответов, увеличьте до 4096+ для длинных текстов.'
        }
      ]
    },
    {
      id: 5,
      title: 'Структура ответа API',
      content: [
        {
          type: 'heading',
          value: 'Что возвращает messages.create()'
        },
        {
          type: 'text',
          value: 'API возвращает объект Message с несколькими важными полями. Понимание структуры ответа необходимо для правильной обработки результатов и мониторинга расходов.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=256,\n    messages=[{"role": "user", "content": "Скажи привет"}]\n)\n\n# Основные поля ответа\nprint("ID:", message.id)                    # msg_01XFDUDYJgAACzvnptvVoYEL\nprint("Тип:", message.type)                 # message\nprint("Роль:", message.role)                # assistant\nprint("Модель:", message.model)             # claude-opus-4-5\nprint("Причина остановки:", message.stop_reason)  # end_turn\n\n# Содержимое ответа\nprint("Контент:", message.content)         # [TextBlock(text="Привет!...")]\nprint("Текст:", message.content[0].text)   # Привет! ...\n\n# Информация об использовании токенов\nprint("Входящих токенов:", message.usage.input_tokens)   # 12\nprint("Исходящих токенов:", message.usage.output_tokens) # 34'
        },
        {
          type: 'code',
          language: 'json',
          value: '{\n  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",\n  "type": "message",\n  "role": "assistant",\n  "model": "claude-opus-4-5",\n  "content": [\n    {\n      "type": "text",\n      "text": "Привет! Я Claude, AI-ассистент..."\n    }\n  ],\n  "stop_reason": "end_turn",\n  "stop_sequence": null,\n  "usage": {\n    "input_tokens": 12,\n    "output_tokens": 34\n  }\n}'
        },
        {
          type: 'list',
          value: 'stop_reason: "end_turn" — модель завершила ответ естественно\nstop_reason: "max_tokens" — достигнут лимит токенов, ответ обрезан\nstop_reason: "stop_sequence" — встретилась стоп-последовательность\nstop_reason: "tool_use" — модель вызвала инструмент'
        }
      ]
    },
    {
      id: 6,
      title: 'API versioning',
      content: [
        {
          type: 'heading',
          value: 'Версионирование Anthropic API'
        },
        {
          type: 'text',
          value: 'Anthropic API использует версионирование через HTTP-заголовок anthropic-version. Каждая версия API фиксирует поведение на определённую дату. Это гарантирует, что ваш код не сломается при выпуске новых версий API.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\n# SDK автоматически устанавливает правильную версию\n# Текущая версия: 2023-06-01\nclient = anthropic.Anthropic()\n\n# При прямых HTTP-запросах нужно указать версию вручную\nimport requests\n\nresponse = requests.post(\n    "https://api.anthropic.com/v1/messages",\n    headers={\n        "x-api-key": "sk-ant-...",\n        "anthropic-version": "2023-06-01",\n        "content-type": "application/json"\n    },\n    json={\n        "model": "claude-opus-4-5",\n        "max_tokens": 1024,\n        "messages": [{"role": "user", "content": "Привет"}]\n    }\n)\nprint(response.json())'
        },
        {
          type: 'text',
          value: 'Версия API не путается с версией модели. claude-opus-4-5 — это конкретная версия модели Claude. anthropic-version: 2023-06-01 — это версия протокола API (формат запросов и ответов). SDK автоматически выставляет правильную версию протокола.'
        },
        {
          type: 'note',
          value: 'Anthropic поддерживает старые версии API в течение длительного времени. Вы получите заблаговременное уведомление перед устареванием версии, что даст время на миграцию.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Первый чат-скрипт',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите Python-скрипт, который читает API-ключ из переменной окружения, делает запрос к Claude с вопросом о Python, выводит ответ и статистику токенов.',
      requirements: [
        'Читать ANTHROPIC_API_KEY из os.environ, выдавать понятную ошибку если ключ не задан',
        'Использовать модель claude-haiku-3-5 (самая дешёвая для практики)',
        'Задать вопрос: "Объясни в одном предложении, что такое list comprehension в Python"',
        'Вывести текст ответа',
        'Вывести количество использованных токенов (input и output)',
        'Обернуть вызов в try/except для обработки anthropic.APIError'
      ],
      expectedOutput: 'Ответ Claude:\nList comprehension в Python — это краткий синтаксис для создания списков...\n\nИспользовано токенов:\n  Входящих: 23\n  Исходящих: 41',
      hint: 'Используйте os.environ.get("ANTHROPIC_API_KEY") и проверьте на None. Статистика токенов хранится в message.usage.input_tokens и message.usage.output_tokens.',
      solution: 'import os\nimport anthropic\n\ndef main():\n    api_key = os.environ.get("ANTHROPIC_API_KEY")\n    if not api_key:\n        raise ValueError("Переменная ANTHROPIC_API_KEY не задана. "\n                         "Установите: export ANTHROPIC_API_KEY=sk-ant-...")\n\n    client = anthropic.Anthropic(api_key=api_key)\n\n    try:\n        message = client.messages.create(\n            model="claude-haiku-3-5",\n            max_tokens=256,\n            messages=[\n                {\n                    "role": "user",\n                    "content": "Объясни в одном предложении, что такое list comprehension в Python"\n                }\n            ]\n        )\n\n        print("Ответ Claude:")\n        print(message.content[0].text)\n        print()\n        print("Использовано токенов:")\n        print(f"  Входящих: {message.usage.input_tokens}")\n        print(f"  Исходящих: {message.usage.output_tokens}")\n\n    except anthropic.APIError as e:\n        print(f"Ошибка API: {e}")\n\nif __name__ == "__main__":\n    main()',
      explanation: 'Скрипт демонстрирует базовый паттерн работы с API: проверка конфигурации → создание клиента → запрос → обработка ответа. Чтение ключа из окружения (os.environ) — стандартная практика безопасности. Блок try/except перехватывает ошибки API (неверный ключ, превышен лимит и т.д.). claude-haiku-3-5 выбрана намеренно — она быстрее и дешевле других моделей, что удобно для разработки и тестирования.'
    }
  ]
}
