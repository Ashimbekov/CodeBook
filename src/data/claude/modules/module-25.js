export default {
  id: 25,
  title: 'Git-интеграция',
  description: 'Изучите глубокую интеграцию Claude Code с Git: создание коммитов, pull request-ов, code review, управление ветками и разрешение конфликтов слияния.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Workflow с командой /commit',
      content: [
        {
          type: 'heading',
          value: 'Умные коммиты с Claude'
        },
        {
          type: 'text',
          value: 'Команда /commit — это не просто обёртка над git commit. Claude анализирует содержимое изменений, понимает их смысл и создаёт информативное сообщение коммита, которое объясняет "почему" а не только "что".'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Полный workflow создания коммита:\n\n# 1. Проверить статус\ngit status\n\n# 2. Проверить что будет в коммите\ngit diff --staged\n\n# 3. Если ничего не staged — добавить файлы\ngit add src/auth/\n\n# 4. Создать коммит через Claude\n/commit\n\n# Claude предложит сообщение, например:\n# feat(auth): implement OAuth2 with Google\n#\n# Add Google OAuth2 authentication flow:\n# - Add GoogleStrategy with passport.js\n# - Implement callback handler with JWT generation\n# - Add user creation/update on first OAuth login\n# - Store OAuth tokens securely in encrypted form\n#\n# Closes #156'
        },
        {
          type: 'text',
          value: 'Сообщение коммита от Claude включает: тип изменения (feat/fix/etc), область (модуль/компонент), краткое описание в первой строке, детальное описание в теле коммита и ссылки на issue если они упоминались в разговоре.'
        },
        {
          type: 'heading',
          value: 'Подготовка staging area'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Можно попросить Claude помочь с staging:\n"добавь в staging только файлы относящиеся к фиче авторизации,\nне включай изменения в тестовых файлах"\n\n# Или попросить разделить изменения на несколько коммитов:\n"у меня в unstaged изменения из двух разных фич.\nРазбей их на два отдельных коммита:\n1. Фича добавления корзины\n2. Исправление бага в форме оплаты"'
        },
        {
          type: 'tip',
          value: 'Хорошая практика: делайте коммиты часто, по одной логической единице изменений. Claude поможет сформулировать чёткое сообщение даже для небольшого изменения.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'Создание Pull Request',
      content: [
        {
          type: 'heading',
          value: 'Автоматическое создание PR'
        },
        {
          type: 'text',
          value: 'Claude Code интегрируется с GitHub CLI (gh) для создания pull request-ов. Он анализирует все коммиты ветки и создаёт подробное описание PR.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Создать PR для текущей ветки:\n"создай pull request для этой ветки на GitHub"\n\n# Claude выполнит:\n# 1. git log main..HEAD — просмотр всех коммитов\n# 2. Анализ изменений\n# 3. Создание заголовка и описания PR\n# 4. gh pr create с заполненным описанием\n\n# Пример созданного PR:\n# Заголовок: feat(auth): add Google OAuth2 authentication\n#\n# ## Summary\n# Implements Google OAuth2 login flow using passport.js\n# with JWT token generation.\n#\n# ## Changes\n# - Add GoogleStrategy configuration\n# - Implement OAuth callback handler\n# - Add user profile sync from Google\n# - Update login page with Google button\n#\n# ## Testing\n# - Unit tests: 15 new tests added\n# - Manual testing: verified with test Google account\n#\n# ## Screenshots\n# [screenshot placeholder]\n#\n# Closes #156'
        },
        {
          type: 'text',
          value: 'Для создания PR через GitHub Claude использует gh pr create. Убедитесь, что GitHub CLI установлен и авторизован: gh auth login.'
        },
        {
          type: 'note',
          value: 'Claude не может автоматически добавить скриншоты в PR. Если ваш проект требует визуальных доказательств, Claude напомнит об этом в описании PR и оставит placeholder.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Code Review с Claude',
      content: [
        {
          type: 'heading',
          value: 'Review изменений перед мержем'
        },
        {
          type: 'text',
          value: 'Claude может выполнить подробный code review для любого набора изменений: staged файлов, конкретной ветки или PR с GitHub.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Review текущих staged изменений:\n/review\n\n# Review конкретной ветки относительно main:\n"сделай review всех изменений в ветке feature/payments\nотносительно main ветки"\n\n# Review PR с GitHub:\n"сделай review PR #234 из репозитория myapp"\n\n# Фокусированный review:\n"сделай review только на безопасность\nи обработку ошибок в файле payment-service.ts"'
        },
        {
          type: 'text',
          value: 'Claude проверяет изменения по нескольким критериям: корректность логики, безопасность, производительность, обработка ошибок, тестируемость, читаемость и соответствие соглашениям проекта (из CLAUDE.md).'
        },
        {
          type: 'heading',
          value: 'Получение обратной связи по PR'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Просмотр комментариев к PR:\n"покажи все комментарии к PR #234 на GitHub\nи предложи как на них ответить"\n\n# Автоматический ответ на review:\n"исправь все замечания из code review PR #234.\nКомментарии к security issues исправь первыми."'
        },
        {
          type: 'tip',
          value: 'Используйте Claude для self-review перед тем как запросить review у коллег. Это повышает качество кода и снижает количество циклов review, экономя время всей команды.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Управление ветками',
      content: [
        {
          type: 'heading',
          value: 'Работа с git ветками через Claude'
        },
        {
          type: 'text',
          value: 'Claude помогает управлять ветками: создание, переключение, слияние и очистка. Это удобно для тех, кто не помнит точный синтаксис git команд.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Создание ветки по задаче:\n"создай ветку для задачи PROJ-123 (добавить поиск)"\n# Claude создаст: feature/PROJ-123-add-search\n\n# Переключение с сохранением прогресса:\n"нужно срочно переключиться на hotfix.\nСохрани текущую работу и переключись на main"\n# Claude выполнит git stash + checkout\n\n# Список веток и их состояние:\n"покажи все ветки которые не смержены в main\nи когда последний раз в них был коммит"\n\n# Очистка старых веток:\n"удали все локальные ветки которые уже\nзамержены в main"'
        },
        {
          type: 'heading',
          value: 'Git Flow и Trunk-Based Development'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Для Git Flow:\n"мы используем git flow. Начни новую feature ветку\nдля добавления темной темы"\n# Claude создаст: feature/dark-theme из develop\n\n# Для Trunk-Based:\n"мы работаем по trunk-based. Создай короткоживущую\nветку для этого изменения и подготовь PR"\n\n# Добавь в CLAUDE.md:\n## Git Workflow\nМы используем trunk-based development.\nВсе ветки от main, PR мержатся в main.\nНазвание веток: type/description (feat/fix/chore)'
        },
        {
          type: 'note',
          value: 'Укажите вашу git стратегию в CLAUDE.md. Тогда Claude автоматически будет создавать ветки с правильными именами и от правильной базовой ветки.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'Разрешение конфликтов слияния',
      content: [
        {
          type: 'heading',
          value: 'Claude помогает разрешить merge conflicts'
        },
        {
          type: 'text',
          value: 'Разрешение конфликтов слияния — одна из самых ценных возможностей Claude Code. Claude понимает контекст обеих версий кода и предлагает разумное слияние.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# При конфликте после git merge или git rebase:\ngit merge feature/payments\n# CONFLICT (content): Merge conflict in src/cart.ts\n\n# Попросить Claude помочь:\n"у меня merge conflict в cart.ts.\nОба изменения важны: в main добавили скидки,\nв feature/payments добавили расчёт налогов.\nПомоги объединить оба изменения."\n\n# Claude:\n# 1. Прочитает файл с маркерами конфликта\n# 2. Поймёт что делают обе версии\n# 3. Предложит объединённую версию\n# 4. Объяснит принятые решения\n# 5. Применит изменения'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Пример файла с конфликтом:\n<<<<<<< HEAD\nconst cartTotal = items.reduce((sum, item) => {\n  const price = item.price * (1 - item.discount);\n  return sum + price;\n}, 0);\n=======\nconst cartTotal = items.reduce((sum, item) => {\n  const price = item.price * (1 + item.taxRate);\n  return sum + price;\n}, 0);\n>>>>>>> feature/payments\n\n# Claude объединит в:\nconst cartTotal = items.reduce((sum, item) => {\n  const discountedPrice = item.price * (1 - (item.discount || 0));\n  const priceWithTax = discountedPrice * (1 + (item.taxRate || 0));\n  return sum + priceWithTax;\n}, 0);'
        },
        {
          type: 'warning',
          value: 'Всегда проверяйте результат разрешения конфликта. Claude старается сохранить оба изменения, но иногда требуется бизнес-решение о приоритете. Запустите тесты после разрешения конфликтов.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Git blame, log и история',
      content: [
        {
          type: 'heading',
          value: 'Анализ истории кода с Claude'
        },
        {
          type: 'text',
          value: 'Claude Code может использовать git blame и git log для анализа истории изменений. Это помогает понять почему код написан именно так и кто последний касался конкретной строки.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Понять историю файла:\n"покажи историю изменений файла auth.ts\nза последние 3 месяца. Что изменилось и почему?"\n\n# Найти когда появился баг:\n"в функции calculateShipping есть баг.\nКогда этот код последний раз менялся\nи что именно изменилось?"\n\n# Контрибьюторы и зоны ответственности:\n"кто чаще всего вносил изменения в src/payments/\nза последний год? Это поможет понять\nкому задать вопросы об этом коде."'
        },
        {
          type: 'text',
          value: 'Анализ git blame особенно полезен при обнаружении бага — Claude может проследить историю изменений подозрительного кода и определить коммит, который мог ввести проблему.'
        },
        {
          type: 'heading',
          value: 'Поиск регрессий'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Найти когда сломалась функциональность:\n"наш тест test_payment_processing начал падать\nпримерно 2 недели назад. Используй git bisect\nили анализ git log чтобы найти виновный коммит"\n\n# Сравнение версий:\n"сравни реализацию функции getUser\nмежду тегами v2.0.0 и v2.1.0.\nЧто изменилось в логике?"'
        },
        {
          type: 'tip',
          value: 'Claude может выполнять git bisect автоматически, если у вас есть автоматический тест для обнаружения регрессии. Просто опишите задачу: "найди коммит который сломал X используя git bisect".'
        }
      ]
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: полный git workflow',
      difficulty: 'medium',
      description: 'Пройдите полный цикл разработки фичи с использованием git интеграции Claude Code: ветка, код, коммиты, PR.',
      requirements: [
        'Создайте новую feature ветку с помощью Claude',
        'Внесите несколько логически связанных изменений',
        'Используйте /commit для каждого логического блока изменений',
        'Запустите /review для проверки всех изменений',
        'Создайте PR с описанием через Claude',
        'Симулируйте merge conflict и попросите Claude его разрешить'
      ],
      expectedOutput: 'Ветка feature/your-feature\nНесколько коммитов с информативными сообщениями\nPR с подробным описанием\nРазрешённый merge conflict',
      hint: 'Начните с "создай ветку для фичи добавления тёмной темы". Сделайте несколько небольших изменений в разных файлах. Каждый логически завершённый блок — отдельный коммит.',
      solution: '# Шаг 1: Создать ветку\n"создай ветку feature/dark-theme от main ветки"\n\n# Шаг 2: Внести изменения\n"добавь CSS переменные для тёмной темы в styles/variables.css"\n"обнови компонент ThemeToggle для переключения тем"\n\n# Шаг 3: Первый коммит\ngit add styles/variables.css\n/commit\n\n# Шаг 4: Второй коммит\ngit add src/components/ThemeToggle.tsx\n/commit\n\n# Шаг 5: Review\n/review\n\n# Шаг 6: PR\n"создай PR для ветки feature/dark-theme на GitHub\nс подробным описанием изменений"\n\n# Шаг 7: Конфликт (симуляция)\ngit checkout main\n# Внести конкурирующее изменение в тот же файл\ngit checkout feature/dark-theme\ngit merge main\n# При конфликте:\n"помоги разрешить merge conflict в variables.css"',
      explanation: 'Этот workflow иллюстрирует как Claude Code вписывается в стандартный процесс разработки. Ключевые преимущества: информативные сообщения коммитов без ручного написания, автоматический code review перед PR, и интеллектуальное разрешение конфликтов с пониманием бизнес-контекста.'
    }
  ]
}
