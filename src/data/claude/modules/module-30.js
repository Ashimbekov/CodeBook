export default {
  id: 30,
  title: 'Продвинутые сценарии Claude Code',
  description: 'Освойте продвинутые сценарии использования Claude Code: навигация по большим проектам, TDD, отладка, скаффолдинг, CI/CD интеграция, headless режим и автоматизация.',
  lessons: [
    {
      id: 1,
      type: 'theory',
      title: 'Навигация по большим кодовым базам',
      content: [
        {
          type: 'heading',
          value: 'Claude Code в монорепозиториях и legacy проектах'
        },
        {
          type: 'text',
          value: 'Большие кодовые базы — особый вызов для любого инструмента. Claude Code имеет несколько стратегий для эффективной работы с проектами в сотни тысяч строк кода.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Стратегия 1: Начать с CLAUDE.md\n# Хороший CLAUDE.md описывает архитектуру:\n"объясни архитектуру этого проекта,\nориентируясь на CLAUDE.md и README"\n\n# Стратегия 2: Картография кодовой базы\n"создай карту модулей проекта:\n- перечисли все основные директории\n- опиши назначение каждой\n- покажи зависимости между модулями"\n\n# Стратегия 3: Фокусировка на нужном модуле\n"нам нужно добавить функцию X.\nНайди все файлы которые нужно изменить\nи не читай ничего лишнего"'
        },
        {
          type: 'text',
          value: 'При работе с очень большими проектами контекстное окно может заполниться. Используйте /compact после каждого исследования новой части кодовой базы, чтобы сохранить ключевую информацию без деталей.'
        },
        {
          type: 'heading',
          value: 'Понимание незнакомого кода'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Для legacy кода без документации:\n"прочитай src/legacy/billing.js и создай\nMermaid диаграмму бизнес-логики этого файла.\nПосле этого добавь JSDoc комментарии к каждой функции."\n\n# Для сложных зависимостей:\n"начиная от точки входа src/index.ts\nпроследи цепочку вызовов до функции processPayment\nи покажи полный call stack с аргументами"\n\n# Для понимания конфигурации:\n"проанализируй все конфигурационные файлы (.env.example,\ndocker-compose.yml, webpack.config.js)\nи объясни как они взаимодействуют"'
        },
        {
          type: 'tip',
          value: 'Попросите Claude создать индексный документ кодовой базы и сохранить его в CLAUDE.md. Это инвестиция которая окупается при каждой последующей сессии — Claude сразу понимает где что находится.'
        }
      ]
    },
    {
      id: 2,
      type: 'theory',
      title: 'TDD с Claude Code',
      content: [
        {
          type: 'heading',
          value: 'Test-Driven Development с AI'
        },
        {
          type: 'text',
          value: 'Claude Code отлично подходит для TDD: сначала описываете поведение через тесты, потом Claude реализует код. Это гарантирует что код тестируем по определению и соответствует спецификации.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# TDD workflow с Claude Code:\n\n# Шаг 1: Написать failing тесты\n"напиши тесты для функции calculateDiscount\nкоторая должна:\n- давать 10% скидку для заказов > 100$\n- давать 20% для > 500$\n- давать 30% для постоянных клиентов\n- не давать скидку для нулевых заказов\nТесты должны упасть (функция ещё не существует)"\n\n# Шаг 2: Запустить тесты — убедиться что они падают\nnpm test -- calculateDiscount.test.ts\n\n# Шаг 3: Реализовать минимальный код\n"реализуй calculateDiscount так чтобы все тесты прошли.\nТолько то что нужно для прохождения тестов, ничего лишнего"\n\n# Шаг 4: Проверить тесты\nnpm test\n\n# Шаг 5: Рефакторинг (тесты защищают)\n"отрефакторь calculateDiscount для читаемости.\nТесты должны остаться зелёными."'
        },
        {
          type: 'text',
          value: 'Claude Code особенно хорош в генерации граничных случаев для тестов. Попросите его: "добавь тесты для граничных случаев которые я мог пропустить" — и он найдёт неочевидные сценарии.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Продвинутый TDD: тесты как спецификация\n"у меня есть спецификация:\n$(cat specs/user-auth.md)\n\nСначала напиши все тесты которые покроют\nэту спецификацию. Потом я попрошу тебя\nреализовать код."\n\n# Это создаёт живую документацию в виде тестов'
        },
        {
          type: 'note',
          value: 'При TDD с Claude важно проверять что тесты действительно падают до реализации. Claude иногда пишет тесты которые проходят даже без имплементации — это признак плохих тестов.'
        }
      ]
    },
    {
      id: 3,
      type: 'theory',
      title: 'Отладочные сессии',
      content: [
        {
          type: 'heading',
          value: 'Claude Code как отладчик'
        },
        {
          type: 'text',
          value: 'Claude Code может помочь в отладке: анализ стек трейсов, поиск причины бага, предложение исправлений. Покажите Claude ошибку и контекст — и он предложит решение.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Отладка по стек трейсу:\n"у меня следующая ошибка:\nTypeError: Cannot read properties of undefined (reading \'email\')\n    at UserController.getProfile (UserController.ts:45)\n    at Layer.handle (router/layer.js:95)\n\nПрочитай UserController.ts строку 45 и окружающий контекст.\nОбъясни причину ошибки и предложи исправление."\n\n# Отладка с воспроизведением:\n"запусти следующий тестовый кейс и проанализируй\nпочему он падает:\nnpm test -- --testNamePattern \\"should handle null user\\""\n\n# Отладка производительности:\n"запусти профилировщик для endpoint /api/products\nи найди узкое место. Используй:\nnpm run profile"'
        },
        {
          type: 'text',
          value: 'При сложных багах попросите Claude использовать метод bisect: добавить логирование в ключевые точки, выполнить код и проанализировать вывод, сузить проблему до конкретной функции.'
        },
        {
          type: 'heading',
          value: 'Отладка асинхронного кода'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Асинхронные баги особенно сложны:\n"в этом коде иногда происходит race condition\nпри параллельных запросах к getUser.\nПроанализируй код и предложи исправление\nс использованием mutex или другого механизма синхронизации:\n$(cat services/user-service.ts)"\n\n# Memory leaks:\n"нам жалуются на утечку памяти после длительной работы.\nПроанализируй event listeners и setInterval/setTimeout\nвызовы в этом файле и найди забытые cleanup операции"'
        },
        {
          type: 'tip',
          value: 'При отладке давайте Claude максимум контекста: стек трейс, логи, версии зависимостей, описание условий при которых проявляется баг. Чем больше информации, тем точнее диагноз.'
        }
      ]
    },
    {
      id: 4,
      type: 'theory',
      title: 'Скаффолдинг проектов',
      content: [
        {
          type: 'heading',
          value: 'Быстрый запуск нового проекта'
        },
        {
          type: 'text',
          value: 'Claude Code отлично справляется с созданием структуры новых проектов (scaffolding). Вместо того чтобы настраивать всё с нуля вручную, опишите требования — и Claude создаст готовую основу.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Создание REST API проекта:\n"создай новый Node.js REST API проект со следующими требованиями:\n- TypeScript\n- Express + Helmet + cors\n- PostgreSQL с TypeORM\n- JWT аутентификация\n- Zod для валидации\n- Jest для тестов\n- ESLint + Prettier\n- Docker Compose для разработки\n- Документация API через Swagger\n\nСоздай структуру директорий, package.json,\nbazовые конфиги и пример CRUD для сущности User."'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Создание фронтенд проекта:\n"создай React приложение с:\n- Vite как bundler\n- TypeScript\n- Tailwind CSS\n- React Router v6\n- React Query для данных\n- Zustand для состояния\n- Vitest + Testing Library\n\nПример: страница списка продуктов с\nфильтрацией, пагинацией и корзиной"'
        },
        {
          type: 'text',
          value: 'Скаффолдинг с Claude занимает несколько минут вместо нескольких часов ручной настройки. Результат уже содержит рабочие примеры кода, конфигурации и базовую структуру тестов.'
        },
        {
          type: 'note',
          value: 'После скаффолдинга обязательно запустите /init для создания CLAUDE.md. Это закрепит выбранную архитектуру и технологии в конфигурации, чтобы Claude понимал проект в будущих сессиях.'
        }
      ]
    },
    {
      id: 5,
      type: 'theory',
      title: 'CI/CD интеграция',
      content: [
        {
          type: 'heading',
          value: 'Claude Code в процессах непрерывной интеграции'
        },
        {
          type: 'text',
          value: 'Claude Code можно интегрировать в CI/CD пайплайны для автоматического code review, генерации описаний PR, анализа результатов тестов и автоматического исправления простых проблем.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# GitHub Actions с Claude Code:\n# .github/workflows/claude-review.yml\n\nname: Claude Code Review\non:\n  pull_request:\n    types: [opened, synchronize]\n\njobs:\n  review:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n\n      - name: Install Claude Code\n        run: npm install -g @anthropic-ai/claude-code\n\n      - name: Run Code Review\n        env:\n          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}\n        run: |\n          git diff origin/main...HEAD > changes.diff\n          claude --print "\n          Выполни code review для следующего diff:\n          $(cat changes.diff)\n\n          Сфокусируйся на: безопасность, производительность,\n          ошибки логики. Выведи результат в Markdown." \\\n          > review.md\n\n      - name: Post Review Comment\n        uses: actions/github-script@v7\n        with:\n          script: |\n            const fs = require(\'fs\')\n            const review = fs.readFileSync(\'review.md\', \'utf8\')\n            github.rest.issues.createComment({\n              issue_number: context.issue.number,\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              body: review\n            })'
        },
        {
          type: 'text',
          value: 'В CI/CD окружении Claude Code запускается в headless режиме (--print), принимает задачу как аргумент и возвращает результат в stdout. Это делает его совместимым с любыми CI системами.'
        },
        {
          type: 'warning',
          value: 'При использовании Claude Code в CI/CD храните ANTHROPIC_API_KEY в secrets репозитория, никогда не в коде. Установите лимиты использования API чтобы избежать неожиданных расходов при многих PR.'
        }
      ]
    },
    {
      id: 6,
      type: 'theory',
      title: 'Headless режим',
      content: [
        {
          type: 'heading',
          value: 'Claude Code без интерактивного интерфейса'
        },
        {
          type: 'text',
          value: 'Headless режим (--print или -p) запускает Claude Code неинтерактивно: получает задачу, выполняет её и выводит результат. Это основа для автоматизации и скриптов.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Базовый headless запрос:\nclaude --print "что делает функция в файле utils.ts"\n\n# Headless с файловым вводом:\nclaude --print "$(cat prompt.txt)"\n\n# Headless в скрипте:\n#!/bin/bash\nfor file in src/**/*.ts; do\n  result=$(claude --print \\\n    "добавь JSDoc комментарии в $file. \\\n     Выведи только обновлённое содержимое файла.")\n  echo "$result" > "$file"\ndone\n\n# Headless с ограничением токенов:\nclaude --print --max-tokens 1000 \\\n  "кратко опиши назначение модуля src/auth/"'
        },
        {
          type: 'heading',
          value: 'Флаги headless режима'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Основные флаги для автоматизации:\nclaude --print          # неинтерактивный режим\nclaude -p               # краткая форма --print\nclaude --output-format json  # вывод в JSON\nclaude --no-color       # без цветового форматирования\nclaude --max-turns 5    # ограничить число шагов агента\nclaude --model claude-haiku-4-5  # использовать дешёвую модель\n\n# Пример: получить JSON результат\nresult=$(claude --print --output-format json \\\n  "найди все функции в auth.ts без тестов")\necho $result | jq .functions'
        },
        {
          type: 'note',
          value: 'В headless режиме Claude не запрашивает подтверждения для изменения файлов. Убедитесь что скрипт корректен перед запуском на важных данных. Используйте git для возможности отката.'
        },
        {
          type: 'tip',
          value: 'Для дешёвых задач в CI используйте claude-haiku-4-5 — он в 20 раз дешевле чем claude-opus-4-5. Для code review и сложного анализа лучше подходят более мощные модели.'
        }
      ]
    },
    {
      id: 7,
      type: 'practice',
      title: 'Практика: автоматизированный пайплайн качества кода',
      difficulty: 'hard',
      description: 'Создайте полный автоматизированный пайплайн для обеспечения качества кода с использованием Claude Code в headless режиме.',
      requirements: [
        'Создайте bash скрипт quality-pipeline.sh',
        'Скрипт принимает путь к директории как аргумент',
        'Шаг 1: Claude анализирует код и создаёт отчёт о проблемах (JSON формат)',
        'Шаг 2: Claude автоматически исправляет проблемы с низкой сложностью (missing types, console.logs)',
        'Шаг 3: Claude генерирует или обновляет тесты для изменённых функций',
        'Шаг 4: Запуск тестов, проверка что всё прошло',
        'Шаг 5: Создание итогового Markdown отчёта',
        'Добавьте GitHub Actions workflow для запуска пайплайна на PR'
      ],
      expectedOutput: 'quality-pipeline.sh — основной скрипт\nreports/issues.json — найденные проблемы\nreports/fixes.md — применённые исправления\nreports/summary.md — итоговый отчёт\n.github/workflows/quality.yml — CI конфигурация',
      hint: 'Используйте claude --print --output-format json для получения структурированных данных. Разбейте пайплайн на отдельные функции bash для лучшей поддерживаемости. Используйте jq для парсинга JSON ответов.',
      solution: '#!/bin/bash\n# quality-pipeline.sh\nset -e\n\nTARGET="${1:-src}"\nmkdir -p reports\n\necho "=== Шаг 1: Анализ кода ==="\nclaude --print --output-format json \\\n  "Проанализируй код в директории $TARGET.\n   Найди проблемы и верни JSON:\n   {\n     \\"high_priority\\": [...],\n     \\"auto_fixable\\": [...],\n     \\"needs_tests\\": [...]\n   }" > reports/issues.json\n\necho "=== Шаг 2: Автоматические исправления ==="\nauto_issues=$(cat reports/issues.json | jq -r .auto_fixable)\nclaude --print \\\n  "Автоматически исправь следующие проблемы:\n   $auto_issues\n   Применяй исправления напрямую к файлам.\n   Не исправляй сложную бизнес-логику." \\\n  > reports/fixes.md\n\necho "=== Шаг 3: Генерация тестов ==="\nneeds_tests=$(cat reports/issues.json | jq -r .needs_tests)\nclaude --print \\\n  "Создай или обнови тесты для:\n   $needs_tests" > /dev/null\n\necho "=== Шаг 4: Запуск тестов ==="\nnpm test 2>&1 | tee reports/test-results.txt\ntest_status=$?\n\necho "=== Шаг 5: Итоговый отчёт ==="\nclaude --print \\\n  "Создай Markdown отчёт о качестве кода:\n   Найденные проблемы: $(cat reports/issues.json)\n   Применённые исправления: $(cat reports/fixes.md)\n   Результаты тестов: $(cat reports/test-results.txt)" \\\n  > reports/summary.md\n\necho "Готово! Отчёт: reports/summary.md"\nexit $test_status',
      explanation: 'Этот пайплайн демонстрирует зрелое использование Claude Code в продакшн процессах. Структурированный JSON вывод позволяет обрабатывать результаты программно. Разделение на шаги обеспечивает возможность запускать только нужные части. Интеграция с CI/CD превращает разовый скрипт в постоянно работающий инструмент качества. Это реальный пример того как Claude Code переходит от помощника разработчика к инфраструктурному инструменту.'
    }
  ]
}
