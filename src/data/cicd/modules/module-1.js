export default {
  id: 1,
  title: 'Введение в CI/CD',
  description: 'Что такое CI/CD, зачем нужно, ключевые понятия и обзор инструментов.',
  lessons: [
    {
      id: 1,
      title: 'Что такое CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI/CD — набор практик для автоматизации разработки и доставки программного обеспечения. CI (Continuous Integration) — непрерывная интеграция кода. CD (Continuous Delivery/Deployment) — непрерывная доставка или деплой.' },
        { type: 'tip', value: 'Представь конвейер на заводе: каждое изменение кода проходит через автоматические проверки (тесты, линтинг) и автоматически доставляется на сервер. Без ручного вмешательства.' },
        { type: 'heading', value: 'Три части CI/CD' },
        { type: 'list', items: [
          'Continuous Integration — автоматическая сборка и тестирование при каждом коммите',
          'Continuous Delivery — автоматическая подготовка к деплою (артефакты готовы к выкатке)',
          'Continuous Deployment — автоматический деплой на прод без ручного утверждения'
        ]},
        { type: 'note', value: 'Разница между Delivery и Deployment: Delivery требует ручного нажатия кнопки деплоя, Deployment деплоится автоматически. Многие компании используют Delivery для продакшена из соображений безопасности.' }
      ]
    },
    {
      id: 2,
      title: 'Проблемы без CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'До CI/CD разработка была болезненной: разработчики работали неделями в изоляции, потом пытались слить код — это называлось "integration hell".' },
        { type: 'heading', value: 'Типичные проблемы без CI/CD' },
        { type: 'list', items: [
          '"Работает у меня" — код не работает на другой машине',
          'Integration hell — слияние кода нескольких разработчиков вызывает массу конфликтов',
          'Ручное тестирование — медленно, дорого, ненадёжно',
          'Страх деплоя — деплой происходит раз в месяц ночью по пятницам',
          'Долгая обратная связь — баг обнаруживается через недели после его написания'
        ]},
        { type: 'tip', value: 'C CI/CD ошибка обнаруживается через минуты после коммита, а не через недели. Чем раньше найден баг, тем дешевле его исправить.' }
      ]
    },
    {
      id: 3,
      title: 'Ключевые понятия: Pipeline, Job, Stage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pipeline (пайплайн) — последовательность автоматических шагов обработки кода. Состоит из jobs (работ), сгруппированных в stages (стадии).' },
        { type: 'code', language: 'yaml', value: '# Упрощённая схема пайплайна\npipeline:\n  stages:\n    - stage: test       # Стадия 1: тесты\n      jobs:\n        - unit-tests\n        - integration-tests\n\n    - stage: build      # Стадия 2: сборка\n      jobs:\n        - build-image\n\n    - stage: deploy     # Стадия 3: деплой\n      jobs:\n        - deploy-staging\n        - deploy-production' },
        { type: 'note', value: 'Jobs в одной stage выполняются параллельно. Stages выполняются последовательно — следующая стадия начинается только если все jobs предыдущей прошли успешно.' }
      ]
    },
    {
      id: 4,
      title: 'Обзор CI/CD инструментов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует много CI/CD платформ. Выбор зависит от хостинга кода, команды и требований.' },
        { type: 'heading', value: 'Популярные инструменты' },
        { type: 'list', items: [
          'GitHub Actions — интегрирован в GitHub, бесплатен для open source',
          'GitLab CI/CD — встроен в GitLab, мощный и гибкий',
          'Jenkins — open source, самостоятельный хостинг, огромная экосистема',
          'CircleCI — облачный, быстрый старт',
          'Travis CI — популярен в open source сообществе',
          'Bitbucket Pipelines — интегрирован в Bitbucket/Jira',
          'TeamCity — от JetBrains, популярен в Java сообществе'
        ]},
        { type: 'tip', value: 'Если код на GitHub — используй GitHub Actions. На GitLab — GitLab CI. Если нужен self-hosted с максимальной гибкостью — Jenkins.' }
      ]
    },
    {
      id: 5,
      title: 'Артефакты и окружения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Артефакт — результат сборки (JAR файл, Docker образ, ZIP архив), который передаётся между stages и сохраняется для деплоя.' },
        { type: 'heading', value: 'Окружения (environments)' },
        { type: 'list', items: [
          'Development (dev) — локальная разработка',
          'Testing/QA — среда для тестирования',
          'Staging — копия продакшена для финальной проверки',
          'Production (prod) — живой сервер для пользователей'
        ]},
        { type: 'code', language: 'yaml', value: '# Типичный поток деплоя\ndev branch  -> тесты\nmain branch -> тесты -> staging -> ручное утверждение -> production\n\n# Артефакт путешествует по окружениям:\nbuild: code -> docker image (артефакт)\ndeploy-staging: docker image -> staging server\ndeploy-prod:    docker image -> production server' }
      ]
    },
    {
      id: 6,
      title: 'GitFlow и CI/CD стратегии',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегия ветвления влияет на то, как работает CI/CD. Разные ветки запускают разные пайплайны.' },
        { type: 'code', language: 'yaml', value: '# GitHub Flow (простой)\nmain   -> автоматический деплой на production\nfeature/* -> тесты + линтинг, деплой на review-окружение\n\n# GitFlow (сложный)\nfeature/* -> тесты\ndevelop   -> тесты + деплой на staging\nrelease/* -> тесты + деплой на staging + ручной деплой на prod\nmain      -> только теги, деплой на production' },
        { type: 'note', value: 'Trunk-based development — современная альтернатива: все работают в main, feature flags управляют видимостью фич. CI/CD максимально прост: каждый коммит в main -> деплой на prod.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Анализ пайплайна',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проанализируй существующий CI/CD пайплайн и определи его структуру.',
      requirements: [
        'Дан YAML конфиг пайплайна ниже в решении',
        'Определи: сколько stages, сколько jobs',
        'Какие jobs выполняются параллельно',
        'В каком порядке выполняются stages',
        'Что произойдёт если job "unit-tests" упадёт'
      ],
      expectedOutput: 'Stages: 3 (test, build, deploy)\nJobs в stage test: 2 (параллельно)\nПри падении unit-tests: build и deploy не запустятся',
      hint: 'Jobs в одной stage выполняются параллельно. Следующая stage ждёт все jobs текущей.',
      solution: '# Анализируемый пайплайн:\nstages:\n  - test\n  - build\n  - deploy\n\nunit-tests:         # stage: test (параллельно с lint)\n  stage: test\n  script: pytest\n\nlint:               # stage: test (параллельно с unit-tests)\n  stage: test\n  script: flake8\n\nbuild-image:        # stage: build (только после test)\n  stage: build\n  script: docker build -t app .\n\ndeploy-prod:        # stage: deploy (только после build)\n  stage: deploy\n  script: kubectl apply -f k8s/\n\n# Ответы:\n# Stages: 3 — test, build, deploy\n# unit-tests и lint выполняются параллельно в stage test\n# build-image ждёт оба теста\n# Если unit-tests упадёт: lint завершится, build-image НЕ запустится',
      explanation: 'CI/CD пайплайн — граф зависимостей. Стадии последовательные, jobs в стадии — параллельные. Провал любого job в стадии останавливает весь пайплайн по умолчанию.'
    }
  ]
}
