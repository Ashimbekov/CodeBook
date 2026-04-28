export default {
  id: 1,
  title: 'Введение в DevOps',
  description: 'Культура и философия DevOps, принципы непрерывной интеграции и доставки, обзор инструментов и практик современного DevOps-инженера.',
  lessons: [
    {
      id: 1,
      title: 'Что такое DevOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevOps — это культура, набор практик и инструментов, объединяющих разработку (Development) и эксплуатацию (Operations). Цель DevOps — сократить жизненный цикл разработки ПО и обеспечить непрерывную доставку качественного продукта.' },
        { type: 'heading', value: 'Проблемы без DevOps' },
        { type: 'list', value: [
          'Разработчики пишут код, но не знают как он работает в продакшене',
          'Операционная команда получает «готовое» приложение без документации',
          'Деплой — это стресс, происходит раз в месяц или реже',
          'Баги обнаруживаются поздно, откат сложный и болезненный',
          'Команды обвиняют друг друга: «У меня работает» vs «Ваш код сломал сервер»'
        ] },
        { type: 'heading', value: 'Ключевые принципы DevOps' },
        { type: 'list', value: [
          'Культура сотрудничества — Dev и Ops работают как одна команда',
          'Автоматизация — всё что можно автоматизировать, должно быть автоматизировано',
          'Непрерывная интеграция (CI) — код интегрируется в общую ветку несколько раз в день',
          'Непрерывная доставка (CD) — каждое изменение потенциально готово к деплою',
          'Мониторинг и обратная связь — метрики, логи, алерты на всех этапах',
          'Инфраструктура как код (IaC) — серверы описываются кодом, а не настраиваются вручную'
        ] },
        { type: 'tip', value: 'DevOps — это не должность и не инструмент. Это культурный сдвиг. Но на практике «DevOps-инженер» — это специалист, владеющий инструментами CI/CD, контейнеризации, оркестрации, IaC и мониторинга.' }
      ]
    },
    {
      id: 2,
      title: 'CI/CD: непрерывная интеграция и доставка',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI/CD — это основа DevOps. Continuous Integration (CI) — автоматическая сборка и тестирование при каждом коммите. Continuous Delivery (CD) — автоматическая подготовка релиза. Continuous Deployment — автоматический деплой в продакшн.' },
        { type: 'heading', value: 'Этапы CI/CD Pipeline' },
        { type: 'code', language: 'bash', value: '# Типичный CI/CD Pipeline:\n\n# 1. CODE  — Разработчик пушит код в Git\ngit push origin feature/login\n\n# 2. BUILD — Автоматическая сборка\ndocker build -t myapp:latest .\n\n# 3. TEST  — Автоматические тесты\npytest tests/\nnpm run test\n\n# 4. SCAN  — Проверка безопасности\ntrivy image myapp:latest\nsonar-scanner\n\n# 5. DEPLOY STAGING — Деплой на тестовый сервер\nkubectl apply -f k8s/staging/\n\n# 6. INTEGRATION TESTS — Интеграционные тесты\nnewman run api-tests.json\n\n# 7. DEPLOY PRODUCTION — Деплой в продакшн\nkubectl apply -f k8s/production/' },
        { type: 'heading', value: 'CI vs CD vs CD' },
        { type: 'list', value: [
          'CI (Continuous Integration) — автосборка + автотесты при каждом коммите',
          'CD (Continuous Delivery) — артефакт всегда готов к деплою, но деплой ручной (кнопка)',
          'CD (Continuous Deployment) — каждый коммит прошедший тесты автоматически деплоится в продакшн'
        ] },
        { type: 'note', value: 'Большинство компаний используют Continuous Delivery (с ручным одобрением деплоя). Continuous Deployment требует высокого покрытия тестами и зрелой культуры. Netflix и GitHub используют Continuous Deployment.' }
      ]
    },
    {
      id: 3,
      title: 'Инструменты DevOps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Экосистема DevOps включает десятки инструментов. Важно знать основные категории и популярные решения в каждой.' },
        { type: 'heading', value: 'Карта инструментов DevOps' },
        { type: 'code', language: 'bash', value: '# Управление кодом:\n# Git, GitHub, GitLab, Bitbucket\n\n# CI/CD:\n# GitHub Actions, GitLab CI, Jenkins, CircleCI, ArgoCD\n\n# Контейнеризация:\n# Docker, Podman, containerd\n\n# Оркестрация контейнеров:\n# Kubernetes, Docker Swarm, Nomad\n\n# Инфраструктура как код (IaC):\n# Terraform, Pulumi, CloudFormation, CDK\n\n# Управление конфигурацией:\n# Ansible, Chef, Puppet, Salt\n\n# Облачные провайдеры:\n# AWS, GCP, Azure, DigitalOcean\n\n# Мониторинг:\n# Prometheus, Grafana, Datadog, New Relic\n\n# Логирование:\n# ELK Stack (Elasticsearch, Logstash, Kibana), Loki, Fluentd\n\n# Безопасность:\n# Trivy, SonarQube, Vault, Falco\n\n# Сети и Service Mesh:\n# Nginx, Traefik, Istio, Envoy' },
        { type: 'tip', value: 'Не нужно знать все инструменты. Начни с: Linux + Git + Docker + Kubernetes + один CI/CD (GitHub Actions) + Terraform + мониторинг. Это покроет 80% вакансий DevOps-инженера.' },
        { type: 'heading', value: 'Популярные стеки' },
        { type: 'list', value: [
          'Стартап: GitHub + GitHub Actions + Docker + AWS ECS + Terraform',
          'Enterprise: GitLab + Jenkins + Kubernetes + Ansible + Prometheus + Grafana',
          'Cloud-native: GitHub + ArgoCD + Kubernetes + Helm + Terraform + Datadog'
        ] }
      ]
    },
    {
      id: 4,
      title: 'Методологии и практики',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevOps опирается на несколько ключевых методологий и практик, которые определяют как команды работают и доставляют ПО.' },
        { type: 'heading', value: 'Agile и DevOps' },
        { type: 'text', value: 'Agile фокусируется на итеративной разработке, DevOps расширяет это на эксплуатацию. Agile отвечает на вопрос «как разрабатывать», DevOps — «как доставлять и поддерживать».' },
        { type: 'heading', value: 'Ключевые практики' },
        { type: 'list', value: [
          'Infrastructure as Code (IaC) — инфраструктура описана в коде и версионирована в Git',
          'GitOps — Git как единый источник истины для инфраструктуры и приложений',
          'Immutable Infrastructure — серверы не изменяются, а пересоздаются',
          'Blue-Green Deployment — два окружения, мгновенное переключение',
          'Canary Deployment — новая версия раскатывается на малый процент трафика',
          'Feature Flags — включение/выключение функций без деплоя',
          'ChatOps — управление инфраструктурой через чат-ботов (Slack/Teams)'
        ] },
        { type: 'heading', value: 'Стратегии деплоя' },
        { type: 'code', language: 'bash', value: '# Blue-Green Deployment:\n# [LB] -> [Blue v1.0] (active)\n#      -> [Green v1.1] (idle, готов к переключению)\n# Переключение мгновенное, откат — тоже\n\n# Canary Deployment:\n# [LB] -> 95% трафика -> [v1.0]\n#      -> 5% трафика  -> [v1.1] (canary)\n# Если метрики OK — постепенно увеличиваем до 100%\n\n# Rolling Update (Kubernetes по умолчанию):\n# [Pod v1.0] [Pod v1.0] [Pod v1.0]\n# [Pod v1.1] [Pod v1.0] [Pod v1.0]  # замена по одному\n# [Pod v1.1] [Pod v1.1] [Pod v1.0]\n# [Pod v1.1] [Pod v1.1] [Pod v1.1]  # все обновлены' },
        { type: 'warning', value: 'Immutable Infrastructure означает: никогда не обновляй сервер вручную через SSH. Если нужно изменение — пересоздай сервер из нового образа. Это гарантирует воспроизводимость и устраняет «configuration drift».' }
      ]
    },
    {
      id: 5,
      title: 'Роль DevOps-инженера',
      type: 'theory',
      content: [
        { type: 'text', value: 'DevOps-инженер — это специалист на стыке разработки и эксплуатации. Он строит и поддерживает инфраструктуру, CI/CD пайплайны, обеспечивает надёжность и масштабируемость систем.' },
        { type: 'heading', value: 'Ежедневные задачи' },
        { type: 'list', value: [
          'Настройка и поддержка CI/CD пайплайнов',
          'Управление инфраструктурой через Terraform/Ansible',
          'Настройка мониторинга и алертинга',
          'Реагирование на инциденты (on-call)',
          'Оптимизация производительности и затрат на облако',
          'Помощь разработчикам с Docker, деплоем, отладкой',
          'Обеспечение безопасности инфраструктуры'
        ] },
        { type: 'heading', value: 'Карьерный путь' },
        { type: 'code', language: 'bash', value: '# Junior DevOps (0-2 года):\n# - Linux, Bash, Git\n# - Docker основы\n# - CI/CD один инструмент (GitHub Actions)\n# - Базовый мониторинг\n# Зарплата: 100-200K тенге\n\n# Middle DevOps (2-4 года):\n# - Kubernetes\n# - Terraform, Ansible\n# - AWS/GCP\n# - Продвинутый мониторинг\n# - Безопасность\n# Зарплата: 200-500K тенге\n\n# Senior DevOps / SRE (4+ лет):\n# - Архитектура высоконагруженных систем\n# - Multi-cloud\n# - Service Mesh, GitOps\n# - Оптимизация затрат\n# - Менторинг команды\n# Зарплата: 500K-1.5M тенге' },
        { type: 'tip', value: 'Самые востребованные навыки на рынке: Kubernetes, Terraform, AWS, CI/CD. Практика важнее сертификатов, но сертификаты AWS/CKA/Terraform помогают при устройстве на работу.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ CI/CD Pipeline',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проанализируйте описание CI/CD пайплайна и определите этапы, инструменты и возможные улучшения.',
      requirements: [
        'Определите все этапы CI/CD пайплайна из описания ниже',
        'Для каждого этапа укажите подходящий инструмент',
        'Определите тип деплоя (Blue-Green, Canary, Rolling)',
        'Предложите минимум 2 улучшения для пайплайна'
      ],
      hint: 'Подумайте о том, какие этапы отсутствуют: безопасность? интеграционные тесты? нотификации?',
      expectedOutput: 'Этапы: 1) Code (Git/GitHub), 2) Build (Docker), 3) Unit Tests (pytest), 4) Deploy Staging (kubectl), 5) Deploy Production (kubectl)\nИнструменты: GitHub Actions, Docker, pytest, Kubernetes\nТип деплоя: Rolling Update\nУлучшения: добавить security scanning (Trivy), добавить интеграционные тесты, добавить уведомления в Slack',
      solution: '# Анализ пайплайна:\n# Текущий пайплайн:\n# push -> build docker image -> run unit tests -> deploy staging -> deploy prod\n\n# Этапы и инструменты:\n# 1. Code         -> GitHub (Git repository)\n# 2. Build        -> Docker (docker build)\n# 3. Unit Tests   -> pytest / jest (автоматические тесты)\n# 4. Deploy Stg   -> Kubernetes (kubectl apply staging)\n# 5. Deploy Prod  -> Kubernetes (kubectl apply production)\n\n# Тип деплоя: Rolling Update (Kubernetes default)\n\n# Улучшения:\n# 1. Добавить Security Scanning:\n#    - trivy image myapp:latest (уязвимости в образе)\n#    - sonar-scanner (SAST — статический анализ кода)\n# 2. Добавить интеграционные тесты после deploy staging:\n#    - newman run api-tests.json (тестирование API)\n#    - cypress run (E2E тесты)\n# 3. Добавить нотификации:\n#    - Slack/Telegram уведомления о статусе деплоя\n# 4. Добавить manual approval перед продакшн деплоем\n# 5. Добавить rollback стратегию при ошибках',
      explanation: 'Хороший CI/CD пайплайн включает: сборку, тестирование (unit + integration), проверку безопасности, деплой на staging, проверку на staging, одобрение, деплой в production, мониторинг после деплоя. Каждый этап должен блокировать следующий при ошибке.'
    }
  ]
}
