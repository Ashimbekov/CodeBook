export default {
  id: 29,
  title: 'Claude Code в IDE (VS Code, JetBrains)',
  description: 'Научитесь эффективно использовать Claude Code в популярных IDE: расширения VS Code и JetBrains, встроенное редактирование, параллельный workflow.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Расширение VS Code',
      content: [
        {
          type: 'heading',
          value: 'Claude Code в Visual Studio Code'
        },
        {
          type: 'text',
          value: 'Расширение Claude Code для VS Code интегрирует возможности Claude непосредственно в IDE. Вам не нужно переключаться между терминалом и редактором — всё доступно прямо в VS Code.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Установка расширения:\n# 1. Откройте VS Code\n# 2. Нажмите Ctrl+Shift+X (Extensions)\n# 3. Найдите "Claude Code"\n# 4. Нажмите Install\n\n# Или через командную строку:\ncode --install-extension anthropic.claude-code\n\n# Проверка установки:\ncode --list-extensions | grep claude'
        },
        {
          type: 'text',
          value: 'После установки расширение добавляет несколько элементов в интерфейс VS Code: иконку Claude на боковой панели, интеграцию с встроенным терминалом и команды в командной палитре (Ctrl+Shift+P).'
        },
        {
          type: 'heading',
          value: 'Основные функции расширения VS Code'
        },
        {
          type: 'list',
          value: 'Боковая панель Claude — чат с Claude прямо в VS Code\nВстроенный терминал — Claude Code запускается в встроенном терминале\nСинхронизация контекста — открытые файлы автоматически доступны Claude\nБыстрые действия — правый клик на выделенном коде для объяснения или рефакторинга\nСтатусная строка — индикатор активности Claude и стоимости токенов'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Горячие клавиши расширения VS Code:\n# Ctrl+Shift+C — открыть Claude Code панель\n# Ctrl+Shift+A — спросить Claude о выделенном коде\n# Ctrl+Shift+R — рефакторить выделенный код\n# Ctrl+Shift+E — объяснить выделенный код'
        },
        {
          type: 'tip',
          value: 'Используйте боковую панель Claude когда работаете с большим количеством файлов — удобнее видеть код и чат одновременно. Для быстрых вопросов удобнее встроенный терминал.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Плагин JetBrains',
      content: [
        {
          type: 'heading',
          value: 'Claude Code для IntelliJ IDEA, PyCharm, WebStorm'
        },
        {
          type: 'text',
          value: 'Плагин Claude Code доступен для всех IDE на платформе JetBrains: IntelliJ IDEA, PyCharm, WebStorm, GoLand, Rider и других. Функциональность аналогична VS Code расширению.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Установка плагина JetBrains:\n# 1. Откройте Settings (Ctrl+Alt+S)\n# 2. Перейдите в Plugins\n# 3. Найдите "Claude Code"\n# 4. Нажмите Install\n# 5. Перезапустите IDE\n\n# Или через JetBrains Toolbox:\n# Settings -> Plugins -> Marketplace -> Claude Code'
        },
        {
          type: 'text',
          value: 'Плагин JetBrains имеет глубокую интеграцию с системой индексации кода IDE. Это означает, что Claude лучше понимает структуру Java/Kotlin/Python проектов, может использовать символьный поиск и навигацию по коду.'
        },
        {
          type: 'heading',
          value: 'Особенности JetBrains интеграции'
        },
        {
          type: 'list',
          value: 'Инструментное окно Claude — отдельный таб в боковой панели IDE\nИнтеграция с git — видит текущие изменения в VCS панели\nПоддержка Copilot протокола — совместим с completion API\nКонтекст из PSI дерева — понимает структуру кода через JetBrains AST\nЗапуск тестов — может запускать тесты через Run Configuration'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Горячие клавиши JetBrains:\n# Alt+Shift+C — открыть Claude Tool Window\n# Alt+Enter -> Ask Claude — контекстное меню для кода\n# Ctrl+Shift+Alt+A — объяснить ошибку компилятора'
        },
        {
          type: 'note',
          value: 'JetBrains плагин требует активного подключения к интернету. В отличие от встроенной Copilot интеграции, которая работает через LSP, Claude Code плагин отправляет запросы к API Anthropic.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Интеграция с терминалом',
      content: [
        {
          type: 'heading',
          value: 'Claude Code в встроенном терминале IDE'
        },
        {
          type: 'text',
          value: 'Встроенный терминал VS Code и JetBrains — оптимальное место для работы с Claude Code. Вы видите терминал и код одновременно, можете легко копировать фрагменты и следить за изменениями файлов в реальном времени.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Открыть терминал в VS Code: Ctrl+`\n# Открыть терминал в JetBrains: Alt+F12\n\n# Разделить терминал на несколько панелей\n# VS Code: Ctrl+Shift+5\n# JetBrains: кнопка Split в верхнем правом углу терминала\n\n# Типичный layout для работы с Claude Code:\n# Левая панель: редактор кода\n# Правая панель: терминал с Claude Code\n# Нижняя панель: дополнительный терминал для команд'
        },
        {
          type: 'text',
          value: 'Преимущество встроенного терминала: когда Claude Code изменяет файлы, VS Code автоматически обновляет представление в редакторе. Вы мгновенно видите изменения без необходимости вручную обновлять файлы.'
        },
        {
          type: 'heading',
          value: 'Настройка окружения терминала'
        },
        {
          type: 'code',
          language: 'json',
          value: '// VS Code settings.json — настройка терминала для Claude:\n{\n  "terminal.integrated.env.linux": {\n    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"\n  },\n  "terminal.integrated.defaultProfile.linux": "bash",\n  "terminal.integrated.fontFamily": "Fira Code",\n  "terminal.integrated.fontSize": 14\n}'
        },
        {
          type: 'tip',
          value: 'Настройте terminal.integrated.env чтобы переменная ANTHROPIC_API_KEY автоматически передавалась в терминал VS Code. Это избавит от необходимости экспортировать её вручную каждый раз.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Встроенное редактирование кода',
      content: [
        {
          type: 'heading',
          value: 'Inline редактирование через Claude'
        },
        {
          type: 'text',
          value: 'Один из наиболее эффективных способов работы с Claude Code в IDE — встроенное редактирование: вы указываете Claude на конкретный фрагмент кода и просите его изменить, не отходя от редактора.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Паттерн 1: Выделить код в редакторе, описать изменение\n# 1. Выделите функцию в редакторе\n# 2. В терминале с Claude Code:\n"отрефакторь функцию в буфере выделения — добавь\nобработку ошибок и логирование"\n\n# Паттерн 2: Указать файл и строки\n"в файле UserService.ts строки 45-67\nзамени callback pattern на async/await"\n\n# Паттерн 3: Работа с текущим открытым файлом\n"обнови текущий открытый файл: добавь TypeScript типы\nко всем параметрам функций которые их не имеют"'
        },
        {
          type: 'text',
          value: 'В VS Code при использовании расширения Claude Code вы можете нажать правой кнопкой на выделенный код и выбрать "Ask Claude" или "Refactor with Claude" — это откроет диалог прямо в IDE.'
        },
        {
          type: 'heading',
          value: 'Использование открытых файлов как контекст'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Claude Code видит какие файлы открыты в IDE\n# Это можно использовать как контекст:\n\n"посмотри на открытые в редакторе файлы\nи найди несоответствия в именовании переменных"\n\n"сравни UserController.ts и ProductController.ts\n(оба открыты в редакторе) и приведи к единому стилю"\n\n# Или явно сослаться на открытый файл:\n"добавь unit тесты для методов в текущем открытом файле"'
        },
        {
          type: 'note',
          value: 'Claude Code использует файловую систему для доступа к файлам, а не буфер обмена IDE. Упоминание "открытый файл" — это удобный способ коммуникации, но Claude реально читает файл с диска.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Параллельный workflow с IDE',
      content: [
        {
          type: 'heading',
          value: 'Эффективный workflow: IDE + Claude Code'
        },
        {
          type: 'text',
          value: 'Наиболее продуктивный workflow сочетает ручное редактирование в IDE с делегированием рутинных задач Claude Code. Понимание того, когда использовать каждый инструмент, критически важно.'
        },
        {
          type: 'list',
          value: 'Вручную в IDE: бизнес-логика требующая глубокого понимания, критические участки кода, архитектурные решения\nClaude Code: шаблонный код (boilerplate), рефакторинг по чётким правилам, генерация тестов, документация, обновление импортов'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичный рабочий день с Claude Code в VS Code:\n\n# Утро: планирование с Claude\n"проанализируй список задач в TODO.md и предложи\nпорядок выполнения с оценкой сложности"\n\n# Разработка: Claude пишет, вы руководите\n"создай скелет для новой фичи по этой спецификации:\n$(cat specs/feature-x.md)"\n\n# Код ревью: Claude помогает\n"/review"\n\n# Рутина: Claude делает один к одному\n"обнови все тесты чтобы использовали\nновую версию API (смотри CHANGELOG.md)"'
        },
        {
          type: 'heading',
          value: 'Горячие клавиши для переключения контекста'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# VS Code: эффективное переключение\n# Ctrl+` — переключить терминал\n# Ctrl+Tab — переключить файлы\n# Ctrl+P — быстрый поиск файла\n# Ctrl+G — перейти к строке\n\n# Совет: используйте Groups (Ctrl+1, Ctrl+2)\n# для разделения: левая группа — код, правая — Claude'
        },
        {
          type: 'tip',
          value: 'Настройте VS Code workspace settings (нажмите Ctrl+Shift+P -> Open Workspace Settings JSON) чтобы конфигурация IDE была оптимальна для работы с Claude Code: крупный шрифт терминала, автосохранение файлов, автоматический reload при изменениях.'
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: настройка IDE workflow',
      difficulty: 'easy',
      description: 'Настройте VS Code для оптимальной работы с Claude Code и проведите сессию разработки используя возможности IDE интеграции.',
      requirements: [
        'Установите расширение Claude Code для VS Code',
        'Настройте терминальное окружение: добавьте ANTHROPIC_API_KEY в terminal.integrated.env',
        'Настройте layout: редактор слева, терминал с Claude Code справа',
        'Создайте новый проект и запустите Claude Code во встроенном терминале',
        'Попросите Claude создать React компонент через терминал и наблюдайте как файл появляется в редакторе',
        'Используйте контекстное меню (правый клик) на коде для запроса объяснения через расширение'
      ],
      expectedOutput: 'VS Code с установленным расширением Claude Code\nНастроенный layout с терминалом и редактором\nСозданный компонент виден в редакторе в реальном времени\nИспользована функция объяснения кода через контекстное меню',
      hint: 'Если расширение Claude Code не установлено — можно использовать встроенный терминал без расширения. Главное — настроить удобный layout где видно и код и терминал одновременно.',
      solution: '# Шаг 1: Установка расширения\ncode --install-extension anthropic.claude-code\n\n# Шаг 2: Настройка settings.json\n# Ctrl+Shift+P -> "Open User Settings JSON"\n{\n  "terminal.integrated.env.linux": {\n    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"\n  },\n  "files.autoSave": "afterDelay",\n  "files.autoSaveDelay": 1000,\n  "terminal.integrated.fontSize": 14\n}\n\n# Шаг 3: Настройка layout\n# View -> Editor Layout -> Two Columns\n# Перетащите терминал в правую колонку\n\n# Шаг 4: Запуск Claude Code в терминале\nclaude\n\n# Шаг 5: Создать компонент\n"создай React компонент Button в src/components/Button.tsx\nс вариантами primary, secondary и danger"\n\n# Шаг 6: Наблюдать изменения в редакторе\n# Файл должен появиться в левой панели автоматически\n\n# Шаг 7: Тест расширения\n# Выделите функцию в Button.tsx\n# Правый клик -> Ask Claude -> "объясни этот компонент"',
      explanation: 'Интеграция Claude Code с IDE меняет paradigm разработки: вместо того чтобы переключаться между IDE, терминалом и браузером, весь workflow сосредоточен в одном месте. Редактор показывает результаты работы Claude в реальном времени, а расширение обеспечивает контекстный доступ к AI прямо из редактора.'
    }
  ]
}
