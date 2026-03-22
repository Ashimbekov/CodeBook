export default {
  id: 24,
  title: 'Слеш-команды и навыки',
  description: 'Освойте встроенные слеш-команды Claude Code и научитесь создавать кастомные навыки для автоматизации повторяющихся задач.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Встроенные слеш-команды',
      content: [
        {
          type: 'heading',
          value: 'Система слеш-команд Claude Code'
        },
        {
          type: 'text',
          value: 'Слеш-команды — это специальные инструкции, начинающиеся с символа /. Они выполняют предопределённые действия быстрее, чем описание задачи в свободной форме. Claude Code имеет набор встроенных команд и поддерживает создание кастомных.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Полный список встроенных слеш-команд:\n\n/help      — показать все доступные команды\n/clear     — очистить контекст разговора\n/compact   — сжать контекст сохраняя ключевую информацию\n/cost      — показать стоимость текущей сессии\n/doctor    — диагностика установки\n/init      — инициализировать CLAUDE.md проекта\n/commit    — создать git коммит с AI-генерированным сообщением\n/review    — запросить code review для изменений\n/quit      — выйти из Claude Code\n/exit      — синоним /quit'
        },
        {
          type: 'text',
          value: 'Каждая встроенная команда оптимизирована для конкретного действия. Например, /commit не просто создаёт коммит — он анализирует staged изменения и генерирует осмысленное сообщение коммита в стиле Conventional Commits.'
        },
        {
          type: 'note',
          value: 'Встроенные слеш-команды выполняются напрямую, без дополнительного запроса к API. Это значит, что они не тратят токены и работают быстро независимо от размера контекста.'
        },
        {
          type: 'tip',
          value: 'Используйте Tab после / для автодополнения команды. Это удобно, если вы не помните точное название команды.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Команда /commit',
      content: [
        {
          type: 'heading',
          value: '/commit — умные git коммиты'
        },
        {
          type: 'text',
          value: 'Команда /commit анализирует staged изменения (git diff --staged) и автоматически генерирует сообщение коммита. Это одна из наиболее используемых команд в повседневной работе.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Типичный workflow с /commit:\n\n# 1. Сделать изменения в коде\n# 2. Добавить в staging\ngit add src/auth/login.ts src/auth/logout.ts\n\n# 3. Запросить коммит\n/commit\n\n# Claude анализирует изменения и предлагает:\n# feat(auth): add JWT refresh token support\n#\n# - Implement token refresh endpoint POST /auth/refresh\n# - Add automatic token renewal in axios interceptor\n# - Handle expired token errors with user redirect\n\n# Вы можете принять, отклонить или отредактировать\n\n# Если нужен коммит всех изменений:\ngit add -A\n/commit'
        },
        {
          type: 'text',
          value: 'Claude следует формату Conventional Commits: feat, fix, docs, style, refactor, test, chore. Тип и область автоматически определяются на основе анализа изменений.'
        },
        {
          type: 'heading',
          value: 'Кастомизация сообщения коммита'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Можно дать подсказку для сообщения:\n/commit "это хотфикс для production бага с null pointer"\n\n# Claude учтёт подсказку и создаст:\n# fix: prevent null pointer exception in user profile\n#\n# Closes #342 — production hotfix\n\n# Или указать тип явно:\n/commit type=fix "исправление валидации форм"'
        },
        {
          type: 'warning',
          value: 'Команда /commit не запускает git push. Она только создаёт локальный коммит. Для отправки изменений на сервер нужно явно запросить: "сделай git push" или выполнить команду вручную.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Команда /review',
      content: [
        {
          type: 'heading',
          value: '/review — автоматический code review'
        },
        {
          type: 'text',
          value: 'Команда /review запрашивает у Claude детальный code review текущих изменений. Claude проверяет логику, безопасность, производительность и соответствие лучшим практикам.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Review всех staged изменений:\n/review\n\n# Review конкретного файла:\n/review src/payment/stripe.ts\n\n# Review последнего коммита:\n/review HEAD\n\n# Пример вывода /review:\n# Code Review Summary\n# ===================\n# \n# Security Issues (HIGH):\n# - Line 42: API key hardcoded in source code\n#   Recommendation: Move to environment variable\n# \n# Logic Issues (MEDIUM):\n# - Line 78: Race condition possible in concurrent requests\n#   Recommendation: Add mutex or use atomic operations\n# \n# Best Practices (LOW):\n# - Line 23: Magic number 3600 should be named constant\n# - Line 91: Missing error handling for network timeout'
        },
        {
          type: 'text',
          value: 'Review категоризирует проблемы по важности: HIGH (безопасность, критические баги), MEDIUM (логические ошибки, производительность), LOW (стиль, читаемость). Это помогает приоритизировать исправления.'
        },
        {
          type: 'tip',
          value: 'Запускайте /review перед каждым /commit. Это помогает поймать очевидные проблемы до того, как они попадут в историю git. Особенно полезно при усталости или работе в незнакомой части кодовой базы.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Кастомные навыки (skills)',
      content: [
        {
          type: 'heading',
          value: 'Создание собственных слеш-команд'
        },
        {
          type: 'text',
          value: 'Кастомные навыки — это файлы Markdown в директории .claude/commands/. Каждый файл становится слеш-командой с именем, совпадающим с именем файла. Навыки позволяют автоматизировать специфические рабочие процессы вашей команды.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Структура для кастомных навыков:\n.claude/\n  commands/\n    deploy.md         -> /deploy\n    test-component.md -> /test-component\n    add-migration.md  -> /add-migration\n    security-check.md -> /security-check'
        },
        {
          type: 'text',
          value: 'Когда пользователь вводит /deploy, Claude Code читает файл .claude/commands/deploy.md и выполняет инструкции из него. Навык может содержать пошаговые инструкции, запросы к инструментам и шаблоны вывода.'
        },
        {
          type: 'heading',
          value: 'Пользовательские навыки'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Личные навыки хранятся в:\n~/.claude/commands/\n\n# Они доступны во всех проектах\n# Пример: ~/.claude/commands/standup.md\n# создаёт /standup доступный везде'
        },
        {
          type: 'note',
          value: 'Навыки проекта (.claude/commands/) имеют приоритет над личными навыками (~/.claude/commands/) при совпадении имён. Это позволяет переопределять личные навыки для конкретных проектов.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Формат навыков',
      content: [
        {
          type: 'heading',
          value: 'Структура файла навыка'
        },
        {
          type: 'text',
          value: 'Файл навыка — это Markdown файл с описанием задачи для Claude. Он может включать фронтматтер с метаданными, описание что делать, и шаблоны с переменными.'
        },
        {
          type: 'code',
          language: 'markdown',
          value: '---\ndescription: Деплой приложения на staging окружение\n---\n\n# Deploy to Staging\n\nВыполни следующие шаги для деплоя на staging:\n\n1. Убедись что все тесты проходят: `npm test`\n2. Собери проект: `npm run build`\n3. Проверь что нет незакоммиченных изменений\n4. Создай git тег с версией из package.json\n5. Запусти деплой скрипт: `./scripts/deploy-staging.sh`\n6. Проверь health check: `curl https://staging.myapp.com/health`\n7. Сообщи результат деплоя: успех или ошибки'
        },
        {
          type: 'heading',
          value: 'Навыки с параметрами'
        },
        {
          type: 'code',
          language: 'markdown',
          value: '---\ndescription: Создать новый React компонент\n---\n\n# Create React Component\n\nСоздай новый React компонент с именем $ARGUMENTS.\n\nТребования:\n- Создай файл src/components/$ARGUMENTS/$ARGUMENTS.tsx\n- Создай файл src/components/$ARGUMENTS/$ARGUMENTS.test.tsx\n- Создай файл src/components/$ARGUMENTS/index.ts\n- Компонент должен быть функциональным с TypeScript типами\n- Тест должен проверять рендеринг и основные взаимодействия\n- Экспортируй компонент через index.ts\n\nИспользуй стиль из существующих компонентов в src/components/'
        },
        {
          type: 'text',
          value: 'Переменная $ARGUMENTS содержит текст, переданный после команды. Например, /create-component Button передаст "Button" как $ARGUMENTS.'
        },
        {
          type: 'tip',
          value: 'Создавайте навыки для регулярно повторяемых задач: создание компонентов, запуск деплоя, генерация миграций, проверка безопасности. Хорошие навыки экономят по 5-10 минут при каждом использовании.'
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: создание кастомного навыка',
      difficulty: 'medium',
      description: 'Создайте кастомный навык для вашего проекта, который автоматизирует создание нового модуля с тестами.',
      requirements: [
        'Создайте директорию .claude/commands/ в вашем проекте',
        'Создайте навык create-module.md который создаёт новый JS/TS модуль',
        'Навык должен создавать: основной файл модуля, файл тестов, обновлять индексный файл',
        'Добавьте параметр $ARGUMENTS для имени модуля',
        'Протестируйте навык командой /create-module Calculator',
        'Создайте также личный навык ~/.claude/commands/daily-summary.md для ежедневного отчёта'
      ],
      expectedOutput: '.claude/commands/create-module.md — файл навыка\nПри запуске /create-module Calculator создаются:\n  src/Calculator.ts\n  src/Calculator.test.ts\n  (обновлён) src/index.ts',
      hint: 'В файле навыка используйте $ARGUMENTS там, где должно подставляться имя модуля. Пишите инструкции для Claude так же конкретно, как вы бы написали техническое задание для разработчика.',
      solution: '# Создать директорию\nmkdir -p .claude/commands\n\n# Создать файл навыка .claude/commands/create-module.md:\n---\ndescription: Создать новый TypeScript модуль с тестами\n---\n\n# Create Module\n\nСоздай новый TypeScript модуль с именем $ARGUMENTS:\n\n1. Создай файл src/$ARGUMENTS.ts:\n   - Экспортируй основной класс или функции\n   - Добавь JSDoc комментарии\n   - Следуй существующим паттернам из src/\n\n2. Создай файл src/$ARGUMENTS.test.ts:\n   - Используй Jest для тестов\n   - Покрой основную функциональность\n   - Добавь тест на edge cases\n\n3. Обнови src/index.ts:\n   - Добавь экспорт нового модуля\n\n# Тестирование навыка:\n/create-module Calculator',
      explanation: 'Кастомные навыки — это мощный инструмент стандартизации командной работы. Когда каждый разработчик использует один и тот же /create-module навык, все новые модули создаются с одинаковой структурой. Это устраняет разногласия о структуре файлов и гарантирует что тесты всегда создаются вместе с кодом.'
    }
  ]
}
