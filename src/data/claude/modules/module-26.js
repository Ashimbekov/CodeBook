export default {
  id: 26,
  title: 'MCP серверы',
  description: 'Изучите Model Context Protocol (MCP): архитектура, встроенные и кастомные MCP серверы, конфигурация и практическое применение для расширения возможностей Claude.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Что такое MCP (Model Context Protocol)',
      content: [
        {
          type: 'heading',
          value: 'MCP — стандарт расширения AI-ассистентов'
        },
        {
          type: 'text',
          value: 'Model Context Protocol (MCP) — это открытый стандарт, разработанный Anthropic, для подключения AI-ассистентов к внешним инструментам и источникам данных. MCP позволяет Claude Code работать с браузером, базами данных, внешними API и корпоративными системами.'
        },
        {
          type: 'text',
          value: 'Без MCP Claude Code работает только с файлами вашей файловой системы. С MCP серверами Claude может управлять браузером, делать запросы к API, читать базы данных, отправлять уведомления и взаимодействовать с любыми внешними сервисами.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Что Claude Code может делать С MCP:\n\n# Playwright MCP:\n"открой браузер, зайди на сайт, залогинься\nи сделай скриншот главной страницы"\n\n# GitHub MCP:\n"найди все открытые issues с меткой bug\nв репозитории и создай план их исправления"\n\n# Slack MCP:\n"отправь в канал #deployments сообщение\nо том что деплой v2.3 завершён успешно"\n\n# PostgreSQL MCP:\n"проанализируй медленные запросы за последние 24 часа\nи предложи оптимизации"'
        },
        {
          type: 'note',
          value: 'MCP работает по принципу клиент-сервер. Claude Code — клиент, MCP сервер — программа которая предоставляет инструменты. Сервер может быть локальным процессом или удалённым сервисом.'
        },
        {
          type: 'tip',
          value: 'Экосистема MCP серверов быстро растёт. Проверяйте официальный реестр MCP серверов на GitHub (modelcontextprotocol/servers) и anthropic.com/mcp для новых интеграций.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Архитектура MCP',
      content: [
        {
          type: 'heading',
          value: 'Как работает MCP протокол'
        },
        {
          type: 'text',
          value: 'MCP использует JSON-RPC 2.0 для коммуникации между Claude Code (хостом) и MCP серверами. Каждый сервер предоставляет набор инструментов (tools), ресурсов (resources) и промптов (prompts).'
        },
        {
          type: 'list',
          value: 'Tools (инструменты) — функции которые Claude может вызывать: читать файлы, делать HTTP запросы, управлять браузером\nResources (ресурсы) — данные которые MCP сервер предоставляет: файлы, записи БД, API ответы\nPrompts (промпты) — шаблоны взаимодействия определённые сервером\nTransports (транспорт) — способы коммуникации: stdio (локальный процесс) или HTTP/SSE (сетевой)'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Пример ответа MCP сервера на запрос списка инструментов:\n{\n  "tools": [\n    {\n      "name": "browser_navigate",\n      "description": "Navigate browser to a URL",\n      "inputSchema": {\n        "type": "object",\n        "properties": {\n          "url": {\n            "type": "string",\n            "description": "URL to navigate to"\n          }\n        },\n        "required": ["url"]\n      }\n    },\n    {\n      "name": "browser_screenshot",\n      "description": "Take screenshot of current page",\n      "inputSchema": {\n        "type": "object",\n        "properties": {}\n      }\n    }\n  ]\n}'
        },
        {
          type: 'text',
          value: 'Claude Code автоматически обнаруживает доступные инструменты при подключении к MCP серверу и включает их в свой набор возможностей. Вы видите их в /help.'
        },
        {
          type: 'heading',
          value: 'Жизненный цикл MCP соединения'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# 1. Claude Code запускает MCP сервер (для stdio transport)\n# 2. Инициализация: обмен возможностями\n# 3. Claude Code запрашивает список tools/resources\n# 4. При необходимости Claude вызывает инструмент\n# 5. MCP сервер возвращает результат\n# 6. Claude использует результат в ответе\n# 7. При выходе — graceful shutdown'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Встроенные MCP серверы',
      content: [
        {
          type: 'heading',
          value: 'MCP серверы, поставляемые с Claude Code'
        },
        {
          type: 'text',
          value: 'Claude Code поставляется с набором встроенных MCP серверов для наиболее популярных сценариев. Некоторые активны по умолчанию, другие требуют явного включения.'
        },
        {
          type: 'list',
          value: 'Filesystem MCP — расширенная работа с файлами (активен по умолчанию)\nGit MCP — глубокая интеграция с git операциями\nFetch MCP — HTTP запросы к внешним API\nMemory MCP — персистентная память между сессиями\nSequential Thinking MCP — инструмент для пошагового рассуждения'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Просмотр подключённых MCP серверов:\n"покажи список активных MCP серверов"\n\n# Или через настройки Claude Code:\ncat ~/.claude/settings.json\n\n# Проверить доступные MCP инструменты:\n/help\n# В выводе будут перечислены инструменты от MCP серверов'
        },
        {
          type: 'heading',
          value: 'Fetch MCP — HTTP запросы'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Если Fetch MCP подключён, Claude может:\n"получи данные о погоде через API OpenWeatherMap\nдля Москвы и выведи температуру"\n\n"сделай POST запрос к нашему staging API\n/api/test-webhook с тестовыми данными\nи покажи ответ"\n\n"проверь что все эндпоинты из api-endpoints.txt\nвозвращают 200 статус"'
        },
        {
          type: 'note',
          value: 'Встроенный Fetch MCP по умолчанию блокирует запросы к localhost и внутренним сетям из соображений безопасности. Для разработки это поведение можно изменить в настройках.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Конфигурация MCP серверов',
      content: [
        {
          type: 'heading',
          value: 'Добавление MCP серверов в конфигурацию'
        },
        {
          type: 'text',
          value: 'MCP серверы конфигурируются в файле settings.json на уровне пользователя (~/.claude/settings.json) или проекта (.claude/settings.json).'
        },
        {
          type: 'code',
          language: 'json',
          value: '// ~/.claude/settings.json\n{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"],\n      "env": {}\n    },\n    "github": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": {\n        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."\n      }\n    },\n    "postgres": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-postgres"],\n      "env": {\n        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost/db"\n      }\n    }\n  }\n}'
        },
        {
          type: 'text',
          value: 'Поле command указывает как запустить MCP сервер. Для Node.js серверов обычно используется npx. Поле env позволяет передать переменные окружения с секретами.'
        },
        {
          type: 'heading',
          value: 'Транспорт HTTP/SSE для удалённых серверов'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Подключение к удалённому MCP серверу:\n{\n  "mcpServers": {\n    "company-tools": {\n      "type": "sse",\n      "url": "https://mcp.company.internal/sse",\n      "headers": {\n        "Authorization": "Bearer ${COMPANY_API_TOKEN}"\n      }\n    }\n  }\n}'
        },
        {
          type: 'warning',
          value: 'Никогда не вставляйте секреты (пароли, токены) непосредственно в settings.json если он хранится в git репозитории. Используйте переменные окружения: "${VARIABLE_NAME}" в значениях будет автоматически раскрыт из env.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Playwright MCP',
      content: [
        {
          type: 'heading',
          value: 'Автоматизация браузера с Playwright'
        },
        {
          type: 'text',
          value: 'Playwright MCP — один из самых мощных MCP серверов. Он даёт Claude возможность управлять реальным браузером: навигация, клики, заполнение форм, скриншоты, тестирование веб-приложений.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Установка Playwright MCP:\nnpx @playwright/mcp@latest\n\n# Или добавить в settings.json:\n{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Примеры использования Playwright MCP:\n\n# Тестирование UI:\n"открой localhost:3000, залогинься как testuser@example.com\nс паролем test123, перейди в профиль\nи сделай скриншот"\n\n# End-to-end тест:\n"проверь flow оформления заказа:\n1. Добавь товар в корзину\n2. Заполни форму доставки\n3. Введи тестовую карту 4242 4242 4242 4242\n4. Подтверди заказ\n5. Проверь что появилось подтверждение"\n\n# Парсинг данных:\n"зайди на страницу конкурента и собери\nсписок цен на все продукты"'
        },
        {
          type: 'note',
          value: 'Playwright MCP запускает браузер в headless режиме по умолчанию. Для отладки можно добавить флаг --headed к аргументам запуска MCP сервера.'
        },
        {
          type: 'tip',
          value: 'Playwright MCP отлично подходит для написания E2E тестов. Покажите Claude приложение в браузере и попросите написать Playwright тесты для конкретного пользовательского сценария.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Кастомные MCP серверы',
      content: [
        {
          type: 'heading',
          value: 'Создание собственного MCP сервера'
        },
        {
          type: 'text',
          value: 'Если готового MCP сервера для вашей задачи нет, можно создать свой. MCP SDK доступен для Python и TypeScript.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Пример минимального MCP сервера на Python:\nfrom mcp.server import Server\nfrom mcp.server.models import InitializationOptions\nimport mcp.types as types\n\napp = Server("my-company-tools")\n\n@app.list_tools()\nasync def handle_list_tools() -> list[types.Tool]:\n    return [\n        types.Tool(\n            name="get_ticket_info",\n            description="Get Jira ticket information",\n            inputSchema={\n                "type": "object",\n                "properties": {\n                    "ticket_id": {\n                        "type": "string",\n                        "description": "Jira ticket ID (e.g. PROJ-123)"\n                    }\n                },\n                "required": ["ticket_id"]\n            }\n        )\n    ]\n\n@app.call_tool()\nasync def handle_call_tool(\n    name: str, arguments: dict\n) -> list[types.TextContent]:\n    if name == "get_ticket_info":\n        ticket_id = arguments["ticket_id"]\n        # Запрос к Jira API\n        ticket_data = await fetch_jira_ticket(ticket_id)\n        return [types.TextContent(\n            type="text",\n            text=str(ticket_data)\n        )]\n    raise ValueError(f"Unknown tool: {name}")'
        },
        {
          type: 'text',
          value: 'Кастомные MCP серверы особенно полезны для интеграции с корпоративными системами: Jira, Confluence, внутренние API, legacy системы.'
        },
        {
          type: 'heading',
          value: 'Тестирование MCP сервера'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Тестирование через MCP Inspector:\nnpx @modelcontextprotocol/inspector python server.py\n\n# MCP Inspector — веб-интерфейс для тестирования\n# MCP серверов без Claude Code'
        }
      ]
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: подключение и использование Playwright MCP',
      difficulty: 'hard',
      description: 'Установите Playwright MCP, подключите его к Claude Code и используйте для автоматизированного тестирования веб-страницы.',
      requirements: [
        'Установите Playwright MCP: npx @playwright/mcp@latest',
        'Добавьте конфигурацию в ~/.claude/settings.json',
        'Перезапустите Claude Code и убедитесь что MCP инструменты доступны через /help',
        'Попросите Claude открыть https://example.com и сделать скриншот',
        'Попросите Claude заполнить форму на тестовой странице',
        'Напишите простой E2E тест с помощью Playwright MCP'
      ],
      expectedOutput: 'Playwright MCP подключён и виден в /help\nСкриншот example.com сделан\nE2E тест написан и выполнен успешно',
      hint: 'Убедитесь что Node.js установлен (npx должен работать). После добавления MCP в settings.json перезапустите claude. Если MCP не появился в /help — запустите /doctor для диагностики.',
      solution: '# Шаг 1: Установка\nnpx @playwright/mcp@latest --version\n\n# Шаг 2: Конфигурация ~/.claude/settings.json\n{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}\n\n# Шаг 3: Перезапуск и проверка\nclaude\n/help\n# Должны появиться инструменты: browser_navigate, browser_screenshot и др.\n\n# Шаг 4: Первое использование\n"открой https://example.com и сделай скриншот"\n\n# Шаг 5: E2E тест\n"открой https://httpbin.org/forms/post\nзаполни форму тестовыми данными\nотправь её и проверь что ответ содержит\nвведённые данные"',
      explanation: 'Playwright MCP кардинально расширяет возможности Claude Code, позволяя работать с веб-приложениями так же легко, как с файлами. Это открывает возможности: автоматическое E2E тестирование, документирование UI, web scraping, автоматизация рутинных задач в браузере. MCP серверы — это экосистема которая продолжает расти, добавляя новые интеграции.'
    }
  ]
}
