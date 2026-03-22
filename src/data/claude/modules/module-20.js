export default {
  id: 20,
  title: 'Установка и настройка Claude Code',
  description: 'Пошаговая установка Claude Code CLI: требования Node.js, npm install, аутентификация через API ключ, первый запуск, конфигурационный файл и модель разрешений',
  lessons: [
    {
      id: 1,
      title: 'Требования: Node.js и окружение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude Code — это Node.js приложение, устанавливаемое через npm. Для работы нужен Node.js версии 18 или выше, API ключ Anthropic и интернет-соединение.' },
        { type: 'heading', value: 'Системные требования' },
        { type: 'list', items: [
          'Node.js: версия 18.0.0 или выше',
          'npm: версия 9.0.0 или выше (идёт вместе с Node.js)',
          'ОС: macOS, Linux, Windows (через WSL2)',
          'Интернет: требуется для API вызовов',
          'API ключ: учётная запись Anthropic с активным биллингом'
        ]},
        { type: 'heading', value: 'Проверка и установка Node.js' },
        { type: 'code', language: 'bash', value: '# Проверяем текущую версию\nnode --version\nnpm --version\n\n# Если Node.js не установлен или версия старая:\n# macOS через homebrew:\nbrew install node\n\n# Linux (Ubuntu/Debian):\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt-get install -y nodejs\n\n# Или через nvm (рекомендуется для разработчиков):\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\nsource ~/.bashrc\nnvm install 20\nnvm use 20\nnvm alias default 20' },
        { type: 'tip', value: 'nvm (Node Version Manager) — рекомендуемый способ управления версиями Node.js. Позволяет переключаться между версиями для разных проектов.' }
      ]
    },
    {
      id: 2,
      title: 'Установка через npm',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude Code устанавливается как глобальный npm-пакет одной командой. Глобальная установка делает команду claude доступной из любой директории.' },
        { type: 'heading', value: 'Установка Claude Code' },
        { type: 'code', language: 'bash', value: '# Установка глобально\nnpm install -g @anthropic-ai/claude-code\n\n# Проверяем установку\nclaude --version\n\n# Ожидаемый вывод:\n# claude 1.x.x\n\n# Если команда не найдена после установки:\n# Проверяем PATH\necho $PATH\nnpm config get prefix\n\n# Добавляем npm bin в PATH (если нужно)\nexport PATH="$(npm config get prefix)/bin:$PATH"' },
        { type: 'heading', value: 'Обновление Claude Code' },
        { type: 'code', language: 'bash', value: '# Обновить до последней версии\nnpm update -g @anthropic-ai/claude-code\n\n# Или переустановить\nnpm uninstall -g @anthropic-ai/claude-code\nnpm install -g @anthropic-ai/claude-code\n\n# Проверить доступность обновлений\nnpm outdated -g @anthropic-ai/claude-code' },
        { type: 'note', value: 'На некоторых системах может потребоваться sudo для глобальной установки. Лучше настроить npm для установки без sudo используя nvm или изменив prefix.' }
      ]
    },
    {
      id: 3,
      title: 'Аутентификация: API ключ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для работы Claude Code требует API ключ Anthropic. Ключ привязан к вашей учётной записи и определяет биллинг.' },
        { type: 'heading', value: 'Получение API ключа' },
        { type: 'list', items: [
          'Зайдите на console.anthropic.com',
          'Создайте учётную запись или войдите',
          'В разделе API Keys нажмите "Create Key"',
          'Скопируйте ключ (он показывается только один раз!)',
          'Убедитесь что у вас настроен биллинг (Settings > Billing)'
        ]},
        { type: 'heading', value: 'Настройка ключа' },
        { type: 'code', language: 'bash', value: '# Способ 1: Переменная окружения (рекомендуется)\nexport ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"\n\n# Добавить постоянно в ~/.bashrc или ~/.zshrc:\necho \'export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"\' >> ~/.bashrc\nsource ~/.bashrc\n\n# Способ 2: Первый запуск (интерактивно)\nclaude\n# Claude Code спросит ключ при первом запуске\n# и сохранит его в ~/.claude/config.json\n\n# Способ 3: .env файл проекта\necho \'ANTHROPIC_API_KEY=sk-ant-api03-xxxxx\' > .env' },
        { type: 'warning', value: 'НИКОГДА не коммитьте API ключ в git. Добавьте .env в .gitignore. Если ключ попал в репозиторий — немедленно отзовите его на console.anthropic.com.' }
      ]
    },
    {
      id: 4,
      title: 'Первый запуск',
      type: 'theory',
      content: [
        { type: 'text', value: 'После установки и настройки ключа — запускаем Claude Code в реальном проекте.' },
        { type: 'heading', value: 'Первый запуск' },
        { type: 'code', language: 'bash', value: '# Переходим в директорию проекта\ncd /path/to/your/project\n\n# Запуск интерактивной сессии\nclaude\n\n# Или с конкретной задачей (non-interactive)\nclaude "объясни структуру этого проекта"\n\n# Или с файлом как входными данными\nclaude < task.txt\n\n# Флаги командной строки\nclaude --help                  # справка\nclaude --model claude-haiku-4-5  # выбор модели\nclaude --no-color              # без цветного вывода\nclaude --print                 # не интерактивный режим' },
        { type: 'heading', value: 'Интерфейс при первом запуске' },
        { type: 'code', language: 'bash', value: '# Вывод при запуске claude:\n#\n# Claude Code v1.x.x\n# Working directory: /your/project\n# Model: claude-sonnet-4-5\n#\n# > _     <- курсор ввода\n#\n# Полезные команды:\n# /help   - все команды\n# /clear  - очистить историю\n# /quit   - выход\n# Ctrl+C  - прервать текущее действие\n# Ctrl+D  - выход' },
        { type: 'tip', value: 'При первом запуске Claude Code проиндексирует структуру вашего проекта. Это займёт несколько секунд но значительно улучшит понимание кодовой базы.' }
      ]
    },
    {
      id: 5,
      title: 'Конфигурационный файл CLAUDE.md',
      type: 'theory',
      content: [
        { type: 'text', value: 'CLAUDE.md — специальный файл в корне проекта который Claude Code читает автоматически при каждом запуске. Это "инструкция" для Claude о вашем проекте.' },
        { type: 'heading', value: 'Создание CLAUDE.md' },
        { type: 'code', language: 'bash', value: '# Создаём CLAUDE.md в корне проекта\ntouch CLAUDE.md\n\n# Пример содержимого CLAUDE.md:\ncat > CLAUDE.md << \'EOF\'\n# Проект: E-commerce API\n\n## Технологический стек\n- Python 3.11, FastAPI, SQLAlchemy 2.0\n- PostgreSQL 15, Redis 7\n- Pytest для тестов\n\n## Структура проекта\n- app/ — основной код приложения\n- app/models/ — SQLAlchemy модели\n- app/api/ — роутеры FastAPI\n- tests/ — тесты\n\n## Соглашения\n- Именование: snake_case везде\n- Commits: conventional commits (feat/fix/docs)\n- Тесты: всегда писать тесты для новых функций\n\n## Запуск\n- Тесты: pytest -v\n- Сервер: uvicorn app.main:app --reload\nEOF' },
        { type: 'heading', value: 'Что писать в CLAUDE.md' },
        { type: 'list', items: [
          'Технологический стек и версии',
          'Структура директорий',
          'Соглашения по коду (naming, style)',
          'Как запускать тесты и сервер',
          'Важные переменные окружения',
          'Запрещённые действия (не трогать prod, не менять схему БД)',
          'Контакты и ссылки на документацию'
        ]},
        { type: 'note', value: 'CLAUDE.md читается при каждом запуске и помещается в системный промпт. Держи файл кратким (до 500 строк) — длинный файл занимает много токенов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Установка и первый проект',
      type: 'practice',
      difficulty: 'easy',
      description: 'Пройди полный процесс установки Claude Code, создай реальный мини-проект на Python с несколькими файлами и настрой CLAUDE.md. Попроси Claude добавить тесты и исправить баг.',
      requirements: [
        'Установить Claude Code: npm install -g @anthropic-ai/claude-code',
        'Настроить ANTHROPIC_API_KEY как переменную окружения',
        'Создать проект calculator/ с файлами: calculator.py, README.md',
        'Создать CLAUDE.md описывающий проект',
        'Попросить Claude: написать тесты для calculator.py и исправить намеренно внедрённый баг'
      ],
      expectedOutput: 'claude --version показывает версию\ntest_calculator.py создан с тестами\nБаг исправлен и тесты проходят',
      hint: 'В calculator.py намеренно добавь баг: def divide(a, b): return a * b (умножение вместо деления). Попроси Claude запустить тесты, найти баг и исправить.',
      solution: '# === Шаг 1: Установка ===\nnpm install -g @anthropic-ai/claude-code\nnode --version  # должен быть >= 18\nclaude --version\n\n# === Шаг 2: API ключ ===\nexport ANTHROPIC_API_KEY="sk-ant-api03-YOUR_KEY_HERE"\n# Или добавь в ~/.bashrc\n\n# === Шаг 3: Создаём проект ===\nmkdir calculator && cd calculator\n\n# calculator.py с намеренным багом\ncat > calculator.py << \'EOF\'\ndef add(a: float, b: float) -> float:\n    """Складывает два числа."""\n    return a + b\n\ndef subtract(a: float, b: float) -> float:\n    """Вычитает b из a."""\n    return a - b\n\ndef multiply(a: float, b: float) -> float:\n    """Умножает два числа."""\n    return a * b\n\ndef divide(a: float, b: float) -> float:\n    """Делит a на b."""\n    if b == 0:\n        raise ValueError("Делитель не может быть нулём")\n    return a * b  # БАГ: должно быть a / b\nEOF\n\n# CLAUDE.md\ncat > CLAUDE.md << \'EOF\'\n# Калькулятор\n\n## Стек\n- Python 3.11\n- pytest для тестов\n\n## Запуск тестов\npytest -v\n\n## Соглашения\n- Type hints обязательны\n- Docstrings для каждой функции\nEOF\n\n# === Шаг 4: Запускаем Claude Code ===\nclaude\n\n# Задание 1: написать тесты\n# "Напиши pytest тесты для calculator.py с проверкой edge cases"\n\n# Задание 2: найти и исправить баг\n# "Запусти pytest, найди упавшие тесты и исправь баг в calculator.py"\n\n# === Ожидаемый результат ===\n# Claude:\n# 1. Читает calculator.py и CLAUDE.md\n# 2. Создаёт test_calculator.py\n# 3. Запускает pytest\n# 4. Находит что divide возвращает a*b вместо a/b\n# 5. Исправляет баг\n# 6. Запускает pytest снова — все тесты проходят',
      explanation: 'Этот workflow иллюстрирует ключевое преимущество Claude Code: полный цикл без copy-paste. Claude читает файлы, создаёт тесты, запускает их, находит проблему и исправляет — всё в одной сессии. CLAUDE.md позволяет задать контекст проекта один раз и не объяснять его каждый раз заново. Намеренный баг (умножение вместо деления) позволяет увидеть как Claude анализирует несоответствие между документацией и реализацией.'
    }
  ]
}
