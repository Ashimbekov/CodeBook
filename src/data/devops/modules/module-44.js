export default {
  id: 44,
  title: 'Platform Engineering',
  description: 'Platform Engineering создаёт Internal Developer Platform (IDP) для упрощения работы разработчиков: self-service инфраструктура, golden paths и developer experience.',
  lessons: [
    {
      id: 1,
      title: 'Концепция Platform Engineering',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Platform Engineering?' },
        { type: 'text', value: 'Platform Engineering — дисциплина создания и поддержки внутренней платформы, которая позволяет разработчикам самостоятельно создавать, деплоить и управлять приложениями без глубоких знаний инфраструктуры. Цель — уменьшить когнитивную нагрузку на разработчиков.' },
        { type: 'code', language: 'bash', value: '# Эволюция подходов:\n#\n# Ops (2000-2010): Отдельная команда Ops управляет серверами\n# -> Медленные релизы, "стена" между Dev и Ops\n#\n# DevOps (2010-2020): Разработчики управляют инфраструктурой\n# -> Когнитивная перегрузка: dev должен знать K8s, Terraform, AWS...\n#\n# Platform Engineering (2020+): Платформенная команда создаёт\n# Internal Developer Platform (IDP)\n# -> Разработчик нажимает кнопку "Create Service"\n# -> Платформа создаёт: repo, CI/CD, K8s, monitoring, DNS\n#\n# "You build it, you run it" -> "You build it, platform runs it"' },
        { type: 'heading', value: 'Компоненты Internal Developer Platform' },
        { type: 'list', items: [
          'Developer Portal (Backstage) — каталог сервисов, документация, templates',
          'Self-Service Infrastructure — создание ресурсов без тикетов в Ops',
          'Golden Paths — рекомендуемые шаблоны для создания сервисов',
          'CI/CD Pipelines — стандартизированные pipeline для сборки и деплоя',
          'Observability — единый стек мониторинга, логирования, трассировки',
          'Security — автоматическое сканирование, policy enforcement'
        ] },
        { type: 'heading', value: 'Метрики платформы (DORA + DX)' },
        { type: 'code', language: 'bash', value: '# DORA метрики (скорость и стабильность):\n# 1. Deployment Frequency — как часто деплоим\n# 2. Lead Time for Changes — от коммита до production\n# 3. Change Failure Rate — % деплоев, вызвавших инцидент\n# 4. Time to Restore — время восстановления после сбоя\n\n# Developer Experience метрики:\n# 5. Time to First Deploy — от создания сервиса до первого деплоя\n# 6. Onboarding Time — время до первого продуктивного коммита\n# 7. Developer Satisfaction (DSAT) — опрос NPS\n# 8. Self-Service Ratio — % задач, решаемых без помощи platform team' },
        { type: 'tip', value: 'Главный принцип: "Treat your platform as a product". У платформы есть пользователи (разработчики), roadmap, обратная связь и метрики удовлетворённости.' }
      ]
    },
    {
      id: 2,
      title: 'Backstage: Developer Portal',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Spotify Backstage' },
        { type: 'text', value: 'Backstage — open-source Developer Portal от Spotify. Это единое место для каталога сервисов, документации, шаблонов создания сервисов и плагинов. Backstage объединяет всю информацию о сервисах в одном интерфейсе.' },
        { type: 'code', language: 'bash', value: '# Установка Backstage\nnpx @backstage/create-app@latest\ncd my-backstage-app\n\n# Запуск в dev-режиме\nyarn dev\n# Откройте http://localhost:3000\n\n# Dockerfile для production\n# yarn build:backend\n# docker build -t backstage .\n\n# Helm chart для Kubernetes\nhelm repo add backstage https://backstage.github.io/charts\nhelm install backstage backstage/backstage \\\n  --namespace backstage \\\n  --create-namespace' },
        { type: 'heading', value: 'Software Catalog' },
        { type: 'code', language: 'yaml', value: '# catalog-info.yaml — регистрация сервиса в Backstage\napiVersion: backstage.io/v1alpha1\nkind: Component\nmetadata:\n  name: order-service\n  description: Order processing microservice\n  annotations:\n    github.com/project-slug: company/order-service\n    backstage.io/techdocs-ref: dir:.\n    argocd/app-name: order-service\n    prometheus.io/alert: order-service\n  tags:\n    - python\n    - grpc\n    - postgresql\n  links:\n    - url: https://grafana.company.com/d/order-service\n      title: Grafana Dashboard\n    - url: https://argocd.company.com/applications/order-service\n      title: ArgoCD\nspec:\n  type: service\n  lifecycle: production\n  owner: team-backend\n  system: e-commerce\n  dependsOn:\n    - component:user-service\n    - resource:orders-database\n  providesApis:\n    - order-api' },
        { type: 'code', language: 'yaml', value: '# API определение\napiVersion: backstage.io/v1alpha1\nkind: API\nmetadata:\n  name: order-api\n  description: Order Service REST API\nspec:\n  type: openapi\n  lifecycle: production\n  owner: team-backend\n  definition:\n    $text: ./openapi.yaml\n\n---\n# Team\napiVersion: backstage.io/v1alpha1\nkind: Group\nmetadata:\n  name: team-backend\n  description: Backend Engineering Team\nspec:\n  type: team\n  profile:\n    displayName: Backend Team\n    email: backend@company.com\n  children: []\n  members: [alice, bob, charlie]' },
        { type: 'note', value: 'Software Catalog в Backstage — единый источник истины о всех сервисах, API, инфраструктуре и командах. Каждый репозиторий содержит catalog-info.yaml, который автоматически индексируется.' }
      ]
    },
    {
      id: 3,
      title: 'Golden Paths и шаблоны',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Golden Path — рекомендуемый путь' },
        { type: 'text', value: 'Golden Path (или Paved Road) — предустановленный, рекомендуемый способ создания сервиса. Шаблон включает всё необходимое: код, CI/CD, Kubernetes манифесты, мониторинг, документацию. Разработчик получает production-ready сервис за минуты.' },
        { type: 'code', language: 'yaml', value: '# Backstage Software Template\napiVersion: scaffolder.backstage.io/v1beta3\nkind: Template\nmetadata:\n  name: python-service\n  title: Python Microservice\n  description: Create a new Python microservice with CI/CD, K8s, and monitoring\n  tags: [\"python\", \"recommended\"]\nspec:\n  owner: team-platform\n  type: service\n  parameters:\n    - title: Service Details\n      required: [name, owner]\n      properties:\n        name:\n          title: Service Name\n          type: string\n          pattern: \"^[a-z][a-z0-9-]+$\"\n        description:\n          title: Description\n          type: string\n        owner:\n          title: Owner Team\n          type: string\n          ui:field: OwnerPicker\n    - title: Infrastructure\n      properties:\n        database:\n          title: Database\n          type: string\n          enum: [\"none\", \"postgresql\", \"redis\"]\n          default: \"none\"\n        replicas:\n          title: Replicas\n          type: integer\n          default: 2\n  steps:\n    - id: fetch\n      name: Fetch Template\n      action: fetch:template\n      input:\n        url: ./skeleton\n        values:\n          name: ${{ parameters.name }}\n          owner: ${{ parameters.owner }}\n          database: ${{ parameters.database }}\n    - id: publish\n      name: Create Repository\n      action: publish:github\n      input:\n        repoUrl: github.com?owner=company&repo=${{ parameters.name }}\n        defaultBranch: main\n    - id: register\n      name: Register in Catalog\n      action: catalog:register\n      input:\n        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}\n        catalogInfoPath: /catalog-info.yaml' },
        { type: 'heading', value: 'Что включает шаблон' },
        { type: 'code', language: 'bash', value: '# Шаблон Golden Path Python Service:\n# skeleton/\n# ├── src/\n# │   ├── main.py              # FastAPI приложение\n# │   ├── config.py            # Конфигурация из ENV\n# │   ├── health.py            # /health, /ready endpoints\n# │   └── metrics.py           # Prometheus метрики\n# ├── tests/\n# │   └── test_main.py\n# ├── Dockerfile               # Multi-stage, non-root, optimized\n# ├── docker-compose.yml       # Локальная разработка\n# ├── k8s/\n# │   ├── deployment.yaml      # С probes и resources\n# │   ├── service.yaml\n# │   ├── ingress.yaml\n# │   └── kustomization.yaml\n# ├── .github/workflows/\n# │   └── ci-cd.yml            # Build, test, scan, deploy\n# ├── monitoring/\n# │   ├── alerts.yaml          # PrometheusRule\n# │   └── dashboard.json       # Grafana dashboard\n# ├── catalog-info.yaml        # Backstage catalog\n# ├── pyproject.toml\n# ├── Makefile                 # make build, make test, make deploy\n# └── README.md' },
        { type: 'tip', value: 'Golden Path должен быть опциональным ("easy path"), а не обязательным ("only path"). Разработчики могут отклониться, но golden path должен быть настолько удобным, что большинство выберет его добровольно.' }
      ]
    },
    {
      id: 4,
      title: 'Self-Service Infrastructure',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Self-Service для разработчиков' },
        { type: 'text', value: 'Self-Service позволяет разработчикам создавать инфраструктурные ресурсы (базы данных, очереди, кэш) без тикетов в Ops. Платформа предоставляет безопасные, предварительно настроенные варианты через API или UI.' },
        { type: 'code', language: 'yaml', value: '# Crossplane Claim — self-service для разработчика\n# Разработчик создаёт:\napiVersion: platform.company.com/v1\nkind: Database\nmetadata:\n  name: orders-db\n  namespace: team-backend\nspec:\n  size: medium       # small, medium, large\n  engine: postgres\n  version: \"16\"\n\n# Платформа автоматически создаёт:\n# - RDS Instance (medium = db.t3.medium)\n# - Security Group (только VPC access)\n# - Subnet Group (private subnets)\n# - Backup (ежедневный, 7 дней)\n# - Monitoring (CloudWatch + алерты)\n# - Secret в Vault с credentials\n# - NetworkPolicy в Kubernetes' },
        { type: 'heading', value: 'Port: Internal Developer Portal' },
        { type: 'code', language: 'bash', value: '# Альтернативы Backstage для Self-Service:\n#\n# Port (getport.io) — visual IDP builder\n# - Blueprints для ресурсов\n# - Self-service actions\n# - Scorecards для quality\n# - Интеграция с любыми инструментами\n\n# Humanitec — Score-based IDP\n# - Workload definition -> platform resolves dependencies\n# - Environment-aware deployments\n\n# Kratix — promise-based IDP\n# - Platform team создаёт Promises (APIs)\n# - Developers создаёт Resource Requests\n# - GitOps pipeline выполняет provisioning' },
        { type: 'heading', value: 'Score: Platform-Agnostic Workload Spec' },
        { type: 'code', language: 'yaml', value: '# score.yaml — описание workload (Humanitec Score)\napiVersion: score.dev/v1b1\nmetadata:\n  name: order-service\ncontainers:\n  main:\n    image: ghcr.io/company/order-service\n    variables:\n      DB_HOST: ${resources.db.host}\n      DB_PORT: ${resources.db.port}\n      DB_NAME: ${resources.db.name}\n      CACHE_URL: ${resources.cache.url}\nresources:\n  db:\n    type: postgres\n    properties:\n      version: \"16\"\n  cache:\n    type: redis\n  dns:\n    type: dns\n    properties:\n      host: orders.company.com\nservice:\n  ports:\n    www:\n      port: 8080\n      targetPort: 8080\n\n# Платформа переводит Score в:\n# Kubernetes Deployment + Service + Ingress\n# + RDS PostgreSQL + ElastiCache Redis\n# + DNS запись + TLS сертификат' },
        { type: 'note', value: 'Self-Service не значит "без контроля". Платформа определяет допустимые размеры, конфигурации и политики. Разработчик выбирает из предложенных вариантов, а платформа обеспечивает compliance.' }
      ]
    },
    {
      id: 5,
      title: 'Developer Experience',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Улучшение Developer Experience' },
        { type: 'text', value: 'Developer Experience (DX) — это совокупность впечатлений разработчика при работе с платформой и инструментами. Хорошая DX: быстрый feedback loop, понятная документация, самообслуживание, минимум ожидания.' },
        { type: 'code', language: 'bash', value: '# Метрики Developer Experience:\n#\n# 1. Time to First Deploy\n#    Цель: < 1 дня от создания сервиса до первого деплоя\n#    Сейчас: 2 недели -> С платформой: 2 часа\n#\n# 2. CI/CD Feedback Time\n#    Цель: < 10 минут от push до результата\n#    Оптимизация: параллельные тесты, кэширование, spot runners\n#\n# 3. Local Development Experience\n#    docker compose up -> всё работает локально\n#    Tilt/Skaffold для hot-reload в Kubernetes\n#\n# 4. Documentation Quality\n#    Backstage TechDocs: документация рядом с кодом\n#    ADR (Architecture Decision Records)\n#\n# 5. Toil Ratio\n#    % времени на рутинные задачи (должен уменьшаться)\n#    Цель: < 20% времени разработчика на ops-задачи' },
        { type: 'heading', value: 'Инструменты для DX' },
        { type: 'code', language: 'bash', value: '# Tilt — hot reload для Kubernetes\n# Tiltfile\n# docker_build("myapp", ".")\n# k8s_yaml("k8s/deployment.yaml")\n# k8s_resource("myapp", port_forwards="8080:8080")\n\ntilt up\n# Изменения в коде автоматически применяются в K8s pod\n\n# DevContainers — стандартизированная среда разработки\n# .devcontainer/devcontainer.json\n# {\n#   "image": "mcr.microsoft.com/devcontainers/python:3.12",\n#   "features": {\n#     "ghcr.io/devcontainers/features/docker-in-docker:2": {},\n#     "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {}\n#   },\n#   "postCreateCommand": "pip install -r requirements.txt",\n#   "forwardPorts": [8080]\n# }' },
        { type: 'heading', value: 'Internal CLI' },
        { type: 'code', language: 'bash', value: '# Внутренний CLI для платформы:\n# company-cli — обёртка над kubectl, helm, terraform\n\n# company create service order-service --template python\n# -> Создаёт repo, CI/CD, K8s, monitoring\n\n# company deploy order-service --env staging\n# -> Деплоит в staging через ArgoCD\n\n# company logs order-service --env production --since 1h\n# -> Показывает логи из Loki/ELK\n\n# company db create --name orders --size medium\n# -> Создаёт PostgreSQL через Crossplane\n\n# company status\n# -> Показывает все сервисы команды, их статус, SLO\n\n# company incident create --severity SEV2 --title "API latency"\n# -> Создаёт инцидент в PagerDuty, Slack канал' },
        { type: 'tip', value: 'Самый простой способ улучшить DX — спросить разработчиков, что их раздражает. Проведите Developer Survey и NPS. Исправьте top-3 проблемы. Повторяйте каждый квартал.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Internal Developer Platform',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте основу Internal Developer Platform: Backstage с каталогом сервисов, шаблон Golden Path и self-service для создания базы данных.',
      requirements: [
        'Установите Backstage и настройте Software Catalog',
        'Зарегистрируйте 3 сервиса в каталоге (с владельцами и зависимостями)',
        'Создайте Software Template для Python microservice (Golden Path)',
        'Настройте Crossplane для self-service создания PostgreSQL',
        'Добавьте TechDocs для документации рядом с кодом',
        'Интегрируйте ArgoCD и Prometheus плагины в Backstage'
      ],
      hint: 'npx @backstage/create-app для Backstage. catalog-info.yaml для сервисов. scaffolder template для Golden Path. Crossplane Composition для self-service DB.',
      expectedOutput: 'Backstage UI: 3 сервиса в каталоге с owner, dependencies, links\nSoftware Template: "Create Python Service" -> repo + CI/CD + K8s\nSelf-service: kubectl apply -f database.yaml -> PostgreSQL создан\nTechDocs: документация отображается в Backstage\nPlugins: ArgoCD статус и Prometheus метрики в Backstage',
      solution: '# 1. Backstage\nnpx @backstage/create-app@latest\nyarn dev\n\n# 2. Catalog (catalog-info.yaml в каждом repo)\n# apiVersion: backstage.io/v1alpha1\n# kind: Component\n# metadata:\n#   name: order-service\n# spec:\n#   type: service\n#   owner: team-backend\n#   dependsOn: [component:user-service]\n\n# 3. Software Template\n# apiVersion: scaffolder.backstage.io/v1beta3\n# kind: Template\n# metadata: { name: python-service }\n# spec:\n#   steps:\n#     - action: fetch:template (skeleton/)\n#     - action: publish:github\n#     - action: catalog:register\n\n# 4. Crossplane Self-Service\n# CompositeResourceDefinition: Database\n# Composition: database-aws (RDS)\n# Claim: kubectl apply -f database-claim.yaml\n\n# 5. TechDocs: mkdocs.yml в каждом repo\n# 6. Plugins: @backstage/plugin-kubernetes, plugin-argocd',
      explanation: 'Platform Engineering создаёт Internal Developer Platform для самообслуживания разработчиков. Backstage — единый портал с каталогом и шаблонами. Golden Paths дают production-ready сервис за минуты. Crossplane обеспечивает self-service инфраструктуру. Результат: разработчики продуктивнее, платформа стандартизирована.'
    }
  ]
}
