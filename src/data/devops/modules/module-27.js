export default {
  id: 27,
  title: 'ArgoCD и GitOps',
  description: 'GitOps — подход к управлению инфраструктурой через Git. ArgoCD — инструмент непрерывной доставки для Kubernetes на принципах GitOps.',
  lessons: [
    {
      id: 1,
      title: 'Принципы GitOps',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое GitOps?' },
        { type: 'text', value: 'GitOps — это методология, где Git-репозиторий является единственным источником истины для декларативной инфраструктуры и приложений. Все изменения проходят через Pull Request, а специальный оператор автоматически синхронизирует состояние кластера с Git.' },
        { type: 'list', items: [
          'Декларативность — вся система описана декларативно',
          'Версионирование — Git хранит полную историю изменений',
          'Автоматизация — одобренные изменения применяются автоматически',
          'Наблюдаемость — агент сообщает об отклонениях от желаемого состояния'
        ] },
        { type: 'heading', value: 'GitOps vs традиционный CI/CD' },
        { type: 'code', language: 'bash', value: '# Традиционный подход (Push-based):\n# Developer -> Git Push -> CI Build -> CI Deploy (kubectl apply)\n# Проблемы:\n# - CI-система имеет прямой доступ к кластеру\n# - Нет синхронизации Git <-> кластер\n# - Drift (ручные изменения в кластере)\n\n# GitOps подход (Pull-based):\n# Developer -> Git Push -> PR Review -> Merge\n#                                         |\n#                                    ArgoCD Agent\n#                                         |\n#                                   Kubernetes Cluster\n# Преимущества:\n# - Git — единственный источник истины\n# - Автоматическое обнаружение drift\n# - Аудит через Git history\n# - Откат = git revert' },
        { type: 'heading', value: 'Структура репозиториев' },
        { type: 'code', language: 'bash', value: '# Рекомендуемая структура — отдельный репозиторий для манифестов:\n\n# Репозиторий приложения (app-repo):\napp-repo/\n├── src/\n├── Dockerfile\n├── .github/workflows/ci.yml   # CI: build + push image\n└── README.md\n\n# Репозиторий GitOps (gitops-repo):\ngitops-repo/\n├── apps/\n│   ├── myapp/\n│   │   ├── base/\n│   │   │   ├── deployment.yaml\n│   │   │   ├── service.yaml\n│   │   │   └── kustomization.yaml\n│   │   └── overlays/\n│   │       ├── dev/\n│   │       ├── staging/\n│   │       └── prod/\n│   └── another-app/\n├── infrastructure/\n│   ├── monitoring/\n│   ├── ingress/\n│   └── cert-manager/\n└── argocd/\n    └── applications/' },
        { type: 'tip', value: 'Разделение репозиториев (app vs gitops) позволяет CI обновлять только тег образа в gitops-repo, а ArgoCD синхронизирует манифесты с кластером. Это обеспечивает чёткое разделение ответственности.' }
      ]
    },
    {
      id: 2,
      title: 'Установка ArgoCD',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Установка ArgoCD в Kubernetes' },
        { type: 'text', value: 'ArgoCD — это декларативный GitOps-инструмент непрерывной доставки для Kubernetes. Он отслеживает Git-репозиторий и автоматически синхронизирует состояние кластера с определёнными манифестами.' },
        { type: 'code', language: 'bash', value: '# Создание namespace\nkubectl create namespace argocd\n\n# Установка ArgoCD\nkubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml\n\n# Или через Helm\nhelm repo add argo https://argoproj.github.io/argo-helm\nhelm install argocd argo/argo-cd -n argocd --create-namespace \\\n  --set server.service.type=LoadBalancer' },
        { type: 'heading', value: 'Доступ к UI и CLI' },
        { type: 'code', language: 'bash', value: '# Port-forward для доступа к UI\nkubectl port-forward svc/argocd-server -n argocd 8080:443\n# Откройте https://localhost:8080\n\n# Получение начального пароля admin\nkubectl -n argocd get secret argocd-initial-admin-secret \\\n  -o jsonpath="{.data.password}" | base64 -d\n\n# Установка ArgoCD CLI\ncurl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64\nchmod +x argocd && sudo mv argocd /usr/local/bin/\n\n# Логин через CLI\nargocd login localhost:8080 --username admin --password <password> --insecure\n\n# Смена пароля\nargocd account update-password' },
        { type: 'heading', value: 'Подключение Git-репозитория' },
        { type: 'code', language: 'bash', value: '# Добавление репозитория через CLI\nargocd repo add https://github.com/company/gitops-repo.git \\\n  --username git \\\n  --password $GITHUB_TOKEN\n\n# Добавление приватного репозитория с SSH\nargocd repo add git@github.com:company/gitops-repo.git \\\n  --ssh-private-key-path ~/.ssh/id_rsa\n\n# Через Kubernetes Secret (декларативно)\nkubectl apply -f - <<EOF\napiVersion: v1\nkind: Secret\nmetadata:\n  name: gitops-repo\n  namespace: argocd\n  labels:\n    argocd.argoproj.io/secret-type: repository\nstringData:\n  type: git\n  url: https://github.com/company/gitops-repo.git\n  username: git\n  password: ghp_xxxxxxxxxxxx\nEOF' },
        { type: 'note', value: 'Для production рекомендуется использовать SSO (OIDC/SAML) вместо встроенной аутентификации. ArgoCD поддерживает интеграцию с Dex, Okta, Azure AD, Google.' }
      ]
    },
    {
      id: 3,
      title: 'Application Custom Resource',
      type: 'theory',
      content: [
        { type: 'heading', value: 'ArgoCD Application' },
        { type: 'text', value: 'Application — основной ресурс ArgoCD. Он связывает Git-репозиторий (source) с целевым кластером и namespace (destination). ArgoCD отслеживает изменения в Git и применяет их в кластер.' },
        { type: 'code', language: 'yaml', value: '# argocd/applications/myapp.yaml\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: myapp\n  namespace: argocd\n  finalizers:\n    - resources-finalizer.argocd.argoproj.io\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/company/gitops-repo.git\n    targetRevision: main\n    path: apps/myapp/overlays/prod\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true        # Удалять ресурсы, которых нет в Git\n      selfHeal: true     # Восстанавливать ресурсы при ручном изменении\n    syncOptions:\n      - CreateNamespace=true\n      - PruneLast=true\n    retry:\n      limit: 5\n      backoff:\n        duration: 5s\n        maxDuration: 3m0s\n        factor: 2' },
        { type: 'heading', value: 'Application с Helm' },
        { type: 'code', language: 'yaml', value: '# Application для Helm chart\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: monitoring\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://prometheus-community.github.io/helm-charts\n    chart: kube-prometheus-stack\n    targetRevision: 55.5.0\n    helm:\n      releaseName: monitoring\n      values: |\n        grafana:\n          enabled: true\n          adminPassword: admin123\n        prometheus:\n          prometheusSpec:\n            retention: 30d\n            storageSpec:\n              volumeClaimTemplate:\n                spec:\n                  resources:\n                    requests:\n                      storage: 50Gi\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: monitoring\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true' },
        { type: 'heading', value: 'ApplicationSet — генерация Applications' },
        { type: 'code', language: 'yaml', value: '# ApplicationSet для нескольких окружений\napiVersion: argoproj.io/v1alpha1\nkind: ApplicationSet\nmetadata:\n  name: myapp-envs\n  namespace: argocd\nspec:\n  generators:\n    - list:\n        elements:\n          - env: dev\n            namespace: dev\n            branch: develop\n          - env: staging\n            namespace: staging\n            branch: main\n          - env: prod\n            namespace: production\n            branch: main\n  template:\n    metadata:\n      name: myapp-{{env}}\n    spec:\n      project: default\n      source:\n        repoURL: https://github.com/company/gitops-repo.git\n        targetRevision: "{{branch}}"\n        path: apps/myapp/overlays/{{env}}\n      destination:\n        server: https://kubernetes.default.svc\n        namespace: "{{namespace}}"' },
        { type: 'tip', value: 'ApplicationSet автоматизирует создание Applications по шаблону. Генераторы (list, git, cluster, matrix) определяют набор параметров для шаблона.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии синхронизации',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Sync Policy' },
        { type: 'text', value: 'ArgoCD поддерживает автоматическую и ручную синхронизацию. Автоматическая синхронизация применяет изменения из Git сразу после коммита. Ручная — требует явного подтверждения через UI или CLI.' },
        { type: 'code', language: 'yaml', value: '# Автоматическая синхронизация\nsyncPolicy:\n  automated:\n    prune: true       # Удалять ресурсы, отсутствующие в Git\n    selfHeal: true    # Восстанавливать при ручных изменениях\n    allowEmpty: false # Не синхронизировать пустые ресурсы\n  syncOptions:\n    - Validate=true           # Валидация манифестов\n    - CreateNamespace=true    # Создание namespace\n    - PrunePropagationPolicy=foreground  # Порядок удаления\n    - PruneLast=true          # Удаление после создания новых\n    - ApplyOutOfSyncOnly=true # Применять только изменённые\n    - ServerSideApply=true    # Server-side apply (рекомендуется)\n  retry:\n    limit: 5\n    backoff:\n      duration: 5s\n      maxDuration: 3m0s\n      factor: 2' },
        { type: 'heading', value: 'Sync Waves и Hooks' },
        { type: 'code', language: 'yaml', value: '# Sync Waves — порядок применения ресурсов\n# Wave 0 (по умолчанию) — основные ресурсы\n# Отрицательные волны — применяются первыми\n# Положительные — последними\n\n# 1. Namespace (wave -2)\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  annotations:\n    argocd.argoproj.io/sync-wave: "-2"\n\n---\n# 2. Secrets (wave -1)\napiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secret\n  namespace: production\n  annotations:\n    argocd.argoproj.io/sync-wave: "-1"\n\n---\n# 3. ConfigMap (wave 0)\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\n  namespace: production\n  annotations:\n    argocd.argoproj.io/sync-wave: "0"\n\n---\n# 4. Deployment (wave 1)\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\n  namespace: production\n  annotations:\n    argocd.argoproj.io/sync-wave: "1"\n\n---\n# 5. Post-sync Job (hook)\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: smoke-test\n  annotations:\n    argocd.argoproj.io/hook: PostSync\n    argocd.argoproj.io/hook-delete-policy: HookSucceeded' },
        { type: 'heading', value: 'Управление синхронизацией через CLI' },
        { type: 'code', language: 'bash', value: '# Ручная синхронизация\nargocd app sync myapp\n\n# Синхронизация конкретных ресурсов\nargocd app sync myapp --resource :Deployment:myapp\n\n# Просмотр статуса\nargocd app get myapp\nargocd app diff myapp\n\n# История синхронизаций\nargocd app history myapp\n\n# Откат к предыдущей ревизии\nargocd app rollback myapp 3\n\n# Принудительная синхронизация (для решения конфликтов)\nargocd app sync myapp --force --replace' },
        { type: 'warning', value: 'prune: true удаляет ресурсы из кластера, если они удалены из Git. Будьте осторожны с PersistentVolumeClaim — добавьте аннотацию argocd.argoproj.io/sync-options: Prune=false для защиты данных.' }
      ]
    },
    {
      id: 5,
      title: 'Multi-cluster и продвинутые настройки',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Multi-cluster управление' },
        { type: 'text', value: 'ArgoCD может управлять несколькими Kubernetes-кластерами из одного места. Это позволяет централизованно контролировать dev, staging и production окружения в разных кластерах или облаках.' },
        { type: 'code', language: 'bash', value: '# Добавление внешнего кластера\nargocd cluster add staging-cluster --name staging\nargocd cluster add prod-cluster --name production\n\n# Список кластеров\nargocd cluster list\n\n# Декларативное добавление кластера\nkubectl apply -f - <<EOF\napiVersion: v1\nkind: Secret\nmetadata:\n  name: prod-cluster-secret\n  namespace: argocd\n  labels:\n    argocd.argoproj.io/secret-type: cluster\nstringData:\n  name: production\n  server: https://prod-k8s.company.com\n  config: |\n    {\n      "bearerToken": "eyJhbGciOi...",\n      "tlsClientConfig": {\n        "insecure": false,\n        "caData": "LS0tLS1CRUdJTi..."\n      }\n    }\nEOF' },
        { type: 'heading', value: 'ArgoCD Projects' },
        { type: 'code', language: 'yaml', value: '# AppProject — ограничение доступа для команд\napiVersion: argoproj.io/v1alpha1\nkind: AppProject\nmetadata:\n  name: backend-team\n  namespace: argocd\nspec:\n  description: "Backend team project"\n  sourceRepos:\n    - "https://github.com/company/backend-*"\n  destinations:\n    - namespace: "backend-*"\n      server: https://kubernetes.default.svc\n    - namespace: production\n      server: https://prod-k8s.company.com\n  clusterResourceWhitelist:\n    - group: ""\n      kind: Namespace\n  namespaceResourceBlacklist:\n    - group: ""\n      kind: ResourceQuota\n  roles:\n    - name: developer\n      description: "Backend developers"\n      policies:\n        - p, proj:backend-team:developer, applications, get, backend-team/*, allow\n        - p, proj:backend-team:developer, applications, sync, backend-team/*, allow\n      groups:\n        - backend-developers  # OIDC group' },
        { type: 'heading', value: 'Notifications и интеграции' },
        { type: 'code', language: 'yaml', value: '# ArgoCD Notifications — уведомления о деплоях\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: argocd-notifications-cm\n  namespace: argocd\ndata:\n  service.slack: |\n    token: $slack-token\n  template.app-deployed: |\n    message: |\n      Application {{.app.metadata.name}} is now {{.app.status.sync.status}}.\n      Revision: {{.app.status.sync.revision}}\n  trigger.on-deployed: |\n    - description: Application synced\n      send:\n        - app-deployed\n      when: app.status.operationState.phase in [\"Succeeded\"]\n\n---\n# Аннотация на Application для включения уведомлений\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: myapp\n  annotations:\n    notifications.argoproj.io/subscribe.on-deployed.slack: deployments-channel' },
        { type: 'tip', value: 'App of Apps — паттерн, где одно Application управляет другими Applications. Создайте корневое Application, которое указывает на директорию с манифестами других Applications. Это упрощает bootstrap кластера.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка ArgoCD GitOps',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте ArgoCD для автоматического деплоя приложения из Git-репозитория с автоматической синхронизацией и уведомлениями.',
      requirements: [
        'Установите ArgoCD в Kubernetes кластер',
        'Создайте Application CR для деплоя приложения из Git',
        'Настройте автоматическую синхронизацию с prune и selfHeal',
        'Используйте sync waves для правильного порядка (namespace -> secret -> deployment)',
        'Создайте ApplicationSet для dev/staging/prod окружений',
        'Добавьте PostSync hook для smoke-тестирования'
      ],
      hint: 'Установите ArgoCD через kubectl apply, затем создайте Application YAML с указанием repoURL и path. Sync waves задаются через аннотации argocd.argoproj.io/sync-wave.',
      expectedOutput: 'ArgoCD UI: Application "myapp" — Synced, Healthy\nargocd app get myapp — Status: Synced, Health: Healthy\nSync waves: Namespace(-2) -> Secret(-1) -> ConfigMap(0) -> Deployment(1)\nPostSync Job: smoke-test — Succeeded',
      solution: '# 1. Установка ArgoCD\nkubectl create namespace argocd\nkubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml\n\n# 2. Application CR\n# apiVersion: argoproj.io/v1alpha1\n# kind: Application\n# metadata:\n#   name: myapp\n#   namespace: argocd\n# spec:\n#   project: default\n#   source:\n#     repoURL: https://github.com/company/gitops-repo.git\n#     targetRevision: main\n#     path: apps/myapp/overlays/prod\n#   destination:\n#     server: https://kubernetes.default.svc\n#     namespace: production\n#   syncPolicy:\n#     automated:\n#       prune: true\n#       selfHeal: true\n#     syncOptions:\n#       - CreateNamespace=true\n\n# 3. Sync waves на ресурсах:\n# Namespace: argocd.argoproj.io/sync-wave: "-2"\n# Secret: argocd.argoproj.io/sync-wave: "-1"\n# Deployment: argocd.argoproj.io/sync-wave: "1"\n\n# 4. PostSync hook\n# annotations:\n#   argocd.argoproj.io/hook: PostSync\n#   argocd.argoproj.io/hook-delete-policy: HookSucceeded\n\nargocd app sync myapp\nargocd app get myapp',
      explanation: 'ArgoCD автоматически отслеживает Git-репозиторий и синхронизирует кластер. selfHeal восстанавливает ресурсы при ручных изменениях, prune удаляет лишние ресурсы. Sync waves гарантируют правильный порядок создания ресурсов. PostSync hooks запускают проверки после деплоя.'
    }
  ]
}
