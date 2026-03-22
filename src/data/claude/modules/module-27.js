export default {
  id: 27,
  title: 'Хуки (Hooks)',
  description: 'Изучите систему хуков Claude Code: типы хуков, конфигурация, практические примеры для автоматического форматирования, линтинга и уведомлений.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Что такое хуки в Claude Code',
      content: [
        {
          type: 'heading',
          value: 'Хуки — автоматические действия при событиях'
        },
        {
          type: 'text',
          value: 'Хуки (hooks) в Claude Code — это пользовательские скрипты или команды, которые автоматически выполняются при определённых событиях: до или после использования инструмента, при запуске сессии или при её завершении.'
        },
        {
          type: 'text',
          value: 'С помощью хуков можно автоматизировать повторяющиеся действия: форматирование кода после каждого редактирования файла, запуск линтера, отправка уведомлений при выполнении bash команд, логирование всех действий Claude.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Примеры того что можно сделать с хуками:\n\n# После каждого редактирования файла:\n# -> автоматически запустить prettier\n# -> автоматически запустить eslint --fix\n\n# После каждой bash команды:\n# -> логировать команду в audit.log\n# -> отправить уведомление в Slack\n\n# Перед запуском опасных команд:\n# -> запросить дополнительное подтверждение\n# -> создать резервную копию\n\n# После завершения сессии:\n# -> сгенерировать отчёт о выполненной работе'
        },
        {
          type: 'note',
          value: 'Хуки выполняются как shell команды на вашей машине с теми же правами что и Claude Code. Будьте осторожны: хуки выполняются при каждом соответствующем событии и могут замедлить работу если выполняются долго.'
        },
        {
          type: 'tip',
          value: 'Хуки особенно полезны для команд разработки: они обеспечивают соблюдение стандартов кода автоматически, без ручной проверки каждого изменения от Claude.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Типы хуков',
      content: [
        {
          type: 'heading',
          value: 'PreToolUse и PostToolUse'
        },
        {
          type: 'text',
          value: 'Claude Code поддерживает несколько типов хуков, каждый из которых срабатывает в разный момент жизненного цикла действий Claude.'
        },
        {
          type: 'list',
          value: 'PreToolUse — выполняется перед тем как Claude использует инструмент. Может предотвратить выполнение инструмента вернув ошибку.\nPostToolUse — выполняется после того как Claude использует инструмент. Получает результат выполнения инструмента.\nNotification — срабатывает когда Claude хочет уведомить пользователя (ожидание ввода).\nStop — срабатывает когда Claude заканчивает выполнение задачи.'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Структура хука в settings.json:\n{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "echo \'Executing bash command...\'"\n          }\n        ]\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Edit",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "prettier --write $CLAUDE_TOOL_INPUT_FILE"\n          }\n        ]\n      }\n    ]\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Матчеры хуков'
        },
        {
          type: 'text',
          value: 'Поле matcher определяет для какого инструмента срабатывает хук. Можно указать конкретный инструмент или использовать шаблон.'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Матчеры для разных инструментов:\n{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Edit",        // только Edit инструмент\n        "hooks": [...]\n      },\n      {\n        "matcher": "Bash",        // только Bash инструмент\n        "hooks": [...]\n      },\n      {\n        "matcher": ".*",          // любой инструмент\n        "hooks": [...]\n      }\n    ]\n  }\n}'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Конфигурация хуков в settings.json',
      content: [
        {
          type: 'heading',
          value: 'Полная структура конфигурации хуков'
        },
        {
          type: 'text',
          value: 'Хуки конфигурируются в файле settings.json. Они могут быть заданы глобально (~/.claude/settings.json) или для конкретного проекта (.claude/settings.json).'
        },
        {
          type: 'code',
          language: 'json',
          value: '// .claude/settings.json с полной конфигурацией хуков:\n{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "echo \'[$(date)] Running: $CLAUDE_TOOL_INPUT_COMMAND\' >> /tmp/claude-audit.log"\n          }\n        ]\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Edit",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "if [[ \\"$CLAUDE_TOOL_INPUT_FILE\\" == *.ts || \\"$CLAUDE_TOOL_INPUT_FILE\\" == *.tsx ]]; then npx prettier --write \\"$CLAUDE_TOOL_INPUT_FILE\\" 2>/dev/null; fi"\n          },\n          {\n            "type": "command",\n            "command": "npx eslint --fix \\"$CLAUDE_TOOL_INPUT_FILE\\" 2>/dev/null || true"\n          }\n        ]\n      }\n    ],\n    "Stop": [\n      {\n        "matcher": ".*",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "terminal-notifier -message \'Claude завершил задачу\' -title \'Claude Code\'"\n          }\n        ]\n      }\n    ]\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Переменные окружения в хуках'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Доступные переменные в хуках:\n$CLAUDE_TOOL_NAME       # Имя инструмента (Edit, Bash, etc.)\n$CLAUDE_TOOL_INPUT_FILE # Путь к файлу (для Edit)\n$CLAUDE_TOOL_INPUT_COMMAND # Команда (для Bash)\n$CLAUDE_TOOL_RESULT     # Результат выполнения (для PostToolUse)\n$CLAUDE_SESSION_ID      # ID текущей сессии'
        },
        {
          type: 'warning',
          value: 'Хуки выполняются синхронно: PostToolUse хук завершится до того, как Claude получит результат инструмента. Если хук долго выполняется или падает с ошибкой, это замедлит или нарушит работу Claude.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Примеры хуков: форматирование, линтинг, уведомления',
      content: [
        {
          type: 'heading',
          value: 'Практические примеры хуков'
        },
        {
          type: 'text',
          value: 'Рассмотрим наиболее полезные конфигурации хуков для типичных проектов.'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Хук 1: Автоматическое форматирование Python файлов\n{\n  "PostToolUse": [\n    {\n      "matcher": "Edit",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "if [[ \\"$CLAUDE_TOOL_INPUT_FILE\\" == *.py ]]; then black \\"$CLAUDE_TOOL_INPUT_FILE\\"; fi"\n        }\n      ]\n    }\n  ]\n}'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Хук 2: Запрет опасных команд\n{\n  "PreToolUse": [\n    {\n      "matcher": "Bash",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "if echo \\"$CLAUDE_TOOL_INPUT_COMMAND\\" | grep -qE \\"(rm -rf|DROP TABLE|DELETE FROM.*WHERE 1=1)\\"; then echo \\"BLOCKED: Dangerous command detected\\" >&2; exit 1; fi"\n        }\n      ]\n    }\n  ]\n}'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Хук 3: Уведомление о завершении задачи (macOS)\n{\n  "Stop": [\n    {\n      "matcher": ".*",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "osascript -e \'display notification \\"Claude завершил задачу\\" with title \\"Claude Code\\"\'" \n        }\n      ]\n    }\n  ]\n}'
        },
        {
          type: 'code',
          language: 'json',
          value: '// Хук 4: Логирование всех bash команд\n{\n  "PreToolUse": [\n    {\n      "matcher": "Bash",\n      "hooks": [\n        {\n          "type": "command",\n          "command": "echo \\"[$(date -Iseconds)] $CLAUDE_TOOL_INPUT_COMMAND\\" >> ~/.claude-commands.log"\n        }\n      ]\n    }\n  ]\n}'
        },
        {
          type: 'tip',
          value: 'Комбинируйте несколько хуков для одного события: сначала форматирование, потом линтинг. Claude увидит результат обоих действий и уже отформатированный/исправленный код.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Отладка хуков',
      content: [
        {
          type: 'heading',
          value: 'Когда хук не работает: диагностика'
        },
        {
          type: 'text',
          value: 'Хуки могут не работать по разным причинам: синтаксическая ошибка в JSON, неверный путь к команде, ошибка в shell скрипте. Вот как диагностировать проблемы.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Шаг 1: Проверить синтаксис settings.json:\ncat .claude/settings.json | python3 -m json.tool\n# Или:\njq . .claude/settings.json\n\n# Шаг 2: Запустить команду хука вручную\n# Скопируйте команду из settings.json и запустите напрямую\nexport CLAUDE_TOOL_INPUT_FILE="src/test.ts"\nnpx prettier --write "$CLAUDE_TOOL_INPUT_FILE"\n\n# Шаг 3: Добавить отладочный вывод в хук\n"command": "echo \\"Hook triggered for $CLAUDE_TOOL_INPUT_FILE\\" >> /tmp/hook-debug.log && prettier --write \\"$CLAUDE_TOOL_INPUT_FILE\\""\n\n# Шаг 4: Проверить логи Claude Code\n# При запуске с --verbose флагом выводится больше информации\nclaude --verbose'
        },
        {
          type: 'heading',
          value: 'Частые ошибки в хуках'
        },
        {
          type: 'list',
          value: 'Не экранированные кавычки в JSON строках — используйте \\" вместо "\nКоманда недоступна в PATH — укажите полный путь (/usr/local/bin/prettier)\nХук завершается с ненулевым кодом — Claude считает это ошибкой (добавьте || true для игнорирования)\nЦиклические вызовы — хук вызывает инструмент который снова вызывает хук'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Правило: хук должен завершаться с кодом 0\n# Если команда может упасть — добавьте || true:\n"command": "eslint --fix \\"$CLAUDE_TOOL_INPUT_FILE\\" || true"\n\n# PreToolUse хук с кодом != 0 БЛОКИРУЕТ инструмент\n# PostToolUse хук с кодом != 0 — Claude увидит предупреждение'
        },
        {
          type: 'warning',
          value: 'PreToolUse хуки которые завершаются с кодом ошибки (не 0) предотвращают выполнение инструмента. Это может заблокировать работу Claude если хук случайно падает. Тщательно тестируйте PreToolUse хуки.'
        }
      ]
    },
    {
      id: 6,
      type: 'practice',
      title: 'Практика: настройка хуков для TypeScript проекта',
      difficulty: 'medium',
      description: 'Настройте набор хуков для автоматического обеспечения качества кода в TypeScript проекте.',
      requirements: [
        'Создайте .claude/settings.json с конфигурацией хуков',
        'Хук 1 (PostToolUse Edit): автоматически запускать prettier для .ts и .tsx файлов',
        'Хук 2 (PostToolUse Edit): автоматически запускать eslint --fix',
        'Хук 3 (PreToolUse Bash): логировать все bash команды в файл',
        'Хук 4 (Stop): выводить уведомление о завершении',
        'Протестируйте: попросите Claude отредактировать файл и проверьте, что хуки сработали'
      ],
      expectedOutput: '.claude/settings.json с конфигурацией 4 хуков\nПосле редактирования .ts файла — он автоматически отформатирован\nВ лог файле — записи о выполненных bash командах',
      hint: 'Начните с одного хука и постепенно добавляйте остальные. Тестируйте после каждого добавления. Убедитесь что prettier и eslint установлены локально (npx prettier --version).',
      solution: '// .claude/settings.json:\n{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Edit",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "if [[ \\"$CLAUDE_TOOL_INPUT_FILE\\" == *.ts ]] || [[ \\"$CLAUDE_TOOL_INPUT_FILE\\" == *.tsx ]]; then npx prettier --write \\"$CLAUDE_TOOL_INPUT_FILE\\" 2>/dev/null || true; fi"\n          },\n          {\n            "type": "command",\n            "command": "npx eslint --fix \\"$CLAUDE_TOOL_INPUT_FILE\\" 2>/dev/null || true"\n          }\n        ]\n      }\n    ],\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "echo \\"[$(date)] $CLAUDE_TOOL_INPUT_COMMAND\\" >> /tmp/claude-bash.log"\n          }\n        ]\n      }\n    ],\n    "Stop": [\n      {\n        "matcher": ".*",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "echo \\"\\\\n=== Claude Code task completed at $(date) ===\\""\n          }\n        ]\n      }\n    ]\n  }\n}',
      explanation: 'Хуки превращают Claude Code из умного ассистента в полноценный CI/CD инструмент прямо на рабочей машине. Автоматическое форматирование гарантирует что код всегда в правильном стиле, логирование обеспечивает аудит действий, а уведомления позволяют заниматься другими делами пока Claude работает над длительными задачами.'
    }
  ]
}
