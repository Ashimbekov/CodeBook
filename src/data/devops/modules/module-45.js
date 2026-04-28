export default {
  id: 45,
  title: 'Практикум: GitOps Pipeline',
  description: 'Практический модуль: создание полного GitOps pipeline с ArgoCD, Helm, Kubernetes и мониторингом. 6 практических заданий.',
  lessons: [
    {
      id: 1,
      title: 'Практика: Структура GitOps-репозитория',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте структуру GitOps-репозитория для управления приложением в трёх окружениях: dev, staging, production.',
      requirements: [
        'Создайте Git-репозиторий с директориями: apps/, infrastructure/, clusters/',
        'В apps/myapp/ создайте Helm chart (Chart.yaml, values.yaml, templates/)',
        'Создайте values файлы для каждого окружения: values-dev.yaml, values-staging.yaml, values-prod.yaml',
        'Dev: 1 реплика, 128Mi RAM. Staging: 2 реплики, 256Mi. Prod: 3 реплики, 512Mi',
        'Добавьте templates: deployment.yaml, service.yaml, ingress.yaml с параметрами из values',
        'Проверьте рендеринг: helm template myapp ./apps/myapp -f values-prod.yaml'
      ],
      hint: 'helm create apps/myapp для генерации шаблона. Затем отредактируйте values.yaml и создайте values-{env}.yaml с разными настройками.',
      expectedOutput: 'gitops-repo/\n  apps/myapp/Chart.yaml, values.yaml, templates/\n  apps/myapp/values-dev.yaml (1 replica, 128Mi)\n  apps/myapp/values-staging.yaml (2 replicas, 256Mi)\n  apps/myapp/values-prod.yaml (3 replicas, 512Mi)\nhelm lint apps/myapp => 0 errors\nhelm template myapp apps/myapp -f apps/myapp/values-prod.yaml => valid YAML',
      solution: '# Создание структуры\nmkdir -p gitops-repo/{apps,infrastructure,clusters}\ncd gitops-repo\nhelm create apps/myapp\n\n# values-dev.yaml\n# replicaCount: 1\n# resources:\n#   limits: { cpu: 250m, memory: 128Mi }\n#   requests: { cpu: 100m, memory: 64Mi }\n# ingress:\n#   enabled: true\n#   hosts: [{ host: myapp.dev.company.com, paths: [{ path: /, pathType: Prefix }] }]\n\n# values-staging.yaml\n# replicaCount: 2\n# resources:\n#   limits: { cpu: 500m, memory: 256Mi }\n\n# values-prod.yaml\n# replicaCount: 3\n# resources:\n#   limits: { cpu: 1000m, memory: 512Mi }\n#   requests: { cpu: 500m, memory: 256Mi }\n# autoscaling:\n#   enabled: true\n#   minReplicas: 3\n#   maxReplicas: 10\n\nhelm lint apps/myapp\nhelm template myapp apps/myapp -f apps/myapp/values-prod.yaml',
      explanation: 'GitOps-репозиторий — единый источник истины для инфраструктуры и приложений. Helm chart параметризует Kubernetes манифесты, а values файлы для каждого окружения определяют конфигурацию. Структура apps/infrastructure/clusters обеспечивает чёткое разделение.'
    },
    {
      id: 2,
      title: 'Практика: Установка и настройка ArgoCD',
      type: 'practice',
      difficulty: 'medium',
      description: 'Установите ArgoCD в Kubernetes, подключите Git-репозиторий и создайте Application для деплоя приложения.',
      requirements: [
        'Установите ArgoCD через Helm в namespace argocd',
        'Получите пароль admin и войдите через CLI',
        'Подключите Git-репозиторий с GitOps-конфигурацией',
        'Создайте ArgoCD Application для production окружения (Helm values-prod.yaml)',
        'Включите автоматическую синхронизацию с prune и selfHeal',
        'Проверьте статус: argocd app get myapp-prod => Synced, Healthy'
      ],
      hint: 'helm install argocd argo/argo-cd для установки. argocd app create с --helm-values для указания values файла. syncPolicy.automated для автосинхронизации.',
      expectedOutput: 'argocd version => v2.x\nargocd app list => myapp-prod Synced Healthy\nkubectl get deploy -n production => myapp 3/3\nargocd app diff myapp-prod => no differences\nargocd app history myapp-prod => revision history',
      solution: '# 1. Установка ArgoCD\nhelm repo add argo https://argoproj.github.io/argo-helm\nhelm install argocd argo/argo-cd -n argocd --create-namespace\n\n# 2. Получение пароля\nkubectl -n argocd get secret argocd-initial-admin-secret \\\n  -o jsonpath="{.data.password}" | base64 -d\nargocd login localhost:8080 --username admin --password <pass> --insecure\n\n# 3. Подключение репозитория\nargocd repo add https://github.com/company/gitops-repo.git \\\n  --username git --password $TOKEN\n\n# 4. Создание Application\nargocd app create myapp-prod \\\n  --repo https://github.com/company/gitops-repo.git \\\n  --path apps/myapp \\\n  --dest-server https://kubernetes.default.svc \\\n  --dest-namespace production \\\n  --helm-values values-prod.yaml \\\n  --sync-policy automated \\\n  --auto-prune \\\n  --self-heal\n\n# 5. Проверка\nargocd app get myapp-prod\nargocd app sync myapp-prod',
      explanation: 'ArgoCD отслеживает Git-репозиторий и автоматически синхронизирует состояние кластера. Application связывает Git source с destination в кластере. Автоматическая синхронизация с prune и selfHeal обеспечивает, что кластер всегда соответствует Git.'
    },
    {
      id: 3,
      title: 'Практика: ApplicationSet для нескольких окружений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте ApplicationSet для автоматического создания ArgoCD Applications для dev, staging и production из одного шаблона.',
      requirements: [
        'Создайте ApplicationSet с list generator для 3 окружений',
        'Каждое окружение: свой namespace, свой values файл, свой target revision',
        'Dev: branch develop, values-dev.yaml. Staging и Prod: branch main',
        'Добавьте sync waves: namespace (-1) -> secrets (0) -> application (1)',
        'Настройте notifications в Slack при успешном/неудачном sync',
        'Проверьте: argocd app list показывает 3 Application'
      ],
      hint: 'ApplicationSet с spec.generators[].list.elements для трёх окружений. Template генерирует Application для каждого элемента. Sync waves через annotations на ресурсах.',
      expectedOutput: 'argocd app list =>\n  myapp-dev     Synced Healthy (develop branch)\n  myapp-staging Synced Healthy (main branch)\n  myapp-prod    Synced Healthy (main branch)\nkubectl get deploy -n dev => myapp 1/1\nkubectl get deploy -n staging => myapp 2/2\nkubectl get deploy -n production => myapp 3/3\nSlack: "myapp-prod synced successfully"',
      solution: '# ApplicationSet YAML\n# apiVersion: argoproj.io/v1alpha1\n# kind: ApplicationSet\n# metadata:\n#   name: myapp-envs\n#   namespace: argocd\n# spec:\n#   generators:\n#     - list:\n#         elements:\n#           - env: dev\n#             namespace: dev\n#             branch: develop\n#             values: values-dev.yaml\n#           - env: staging\n#             namespace: staging\n#             branch: main\n#             values: values-staging.yaml\n#           - env: prod\n#             namespace: production\n#             branch: main\n#             values: values-prod.yaml\n#   template:\n#     metadata:\n#       name: myapp-{{env}}\n#       annotations:\n#         notifications.argoproj.io/subscribe.on-deployed.slack: deployments\n#     spec:\n#       project: default\n#       source:\n#         repoURL: https://github.com/company/gitops-repo.git\n#         targetRevision: "{{branch}}"\n#         path: apps/myapp\n#         helm:\n#           valueFiles: ["{{values}}"]\n#       destination:\n#         server: https://kubernetes.default.svc\n#         namespace: "{{namespace}}"\n#       syncPolicy:\n#         automated: { prune: true, selfHeal: true }\n#         syncOptions: [CreateNamespace=true]\n\nkubectl apply -f applicationset.yaml\nargocd app list',
      explanation: 'ApplicationSet автоматизирует создание ArgoCD Applications. List generator создаёт Application для каждого окружения из одного шаблона. Sync waves гарантируют порядок создания ресурсов. Notifications информируют команду о результатах деплоя.'
    },
    {
      id: 4,
      title: 'Практика: CI Pipeline с автообновлением GitOps',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте CI pipeline (GitHub Actions), который собирает Docker образ и автоматически обновляет тег в GitOps-репозитории.',
      requirements: [
        'Создайте GitHub Actions workflow: lint, test, build Docker image, push to GHCR',
        'После push образа — автоматически обновите image tag в values-staging.yaml GitOps-репозитория',
        'Используйте git commit с подписью бота для отслеживания автоматических изменений',
        'ArgoCD автоматически подхватит изменение и задеплоит новую версию',
        'Добавьте Trivy scan перед push образа',
        'Настройте pull request в GitOps-repo для production (ручное одобрение)'
      ],
      hint: 'GitHub Actions: build и push image, затем checkout gitops-repo, обновить тег через sed/yq, commit и push. Для prod — создать PR вместо прямого push.',
      expectedOutput: 'CI: lint -> test -> trivy scan -> docker build -> push ghcr.io/org/myapp:abc1234\nGitOps: values-staging.yaml updated with tag abc1234 (auto-commit)\nArgoCD: myapp-staging auto-synced to new image\nGitOps PR: "Update production to abc1234" (awaiting approval)\nAfter merge: ArgoCD syncs myapp-prod',
      solution: '# .github/workflows/ci.yml\n# name: CI\n# on:\n#   push:\n#     branches: [main]\n# jobs:\n#   build:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#       - run: ruff check .\n#       - run: pytest tests/ -v\n#       - uses: aquasecurity/trivy-action@master\n#         with:\n#           scan-type: fs\n#           exit-code: 1\n#           severity: CRITICAL\n#       - uses: docker/build-push-action@v5\n#         with:\n#           push: true\n#           tags: ghcr.io/company/myapp:${{ github.sha }}\n#\n#       # Обновление staging (auto)\n#       - uses: actions/checkout@v4\n#         with:\n#           repository: company/gitops-repo\n#           token: ${{ secrets.GITOPS_TOKEN }}\n#           path: gitops\n#       - run: |\n#           cd gitops\n#           yq -i \'.image.tag = \"${{ github.sha }}\"\' apps/myapp/values-staging.yaml\n#           git commit -am "chore: update staging to ${{ github.sha }}"\n#           git push\n#\n#       # Обновление production (PR)\n#       - run: |\n#           cd gitops\n#           git checkout -b release/${{ github.sha }}\n#           yq -i \'.image.tag = \"${{ github.sha }}\"\' apps/myapp/values-prod.yaml\n#           git commit -am "chore: update production to ${{ github.sha }}"\n#           git push origin release/${{ github.sha }}\n#           gh pr create --title "Deploy ${{ github.sha }} to production"',
      explanation: 'CI pipeline собирает и тестирует код, затем обновляет тег образа в GitOps-репозитории. ArgoCD подхватывает изменение и деплоит. Staging обновляется автоматически (push в main), Production — через Pull Request (ручное одобрение). Это обеспечивает баланс скорости и безопасности.'
    },
    {
      id: 5,
      title: 'Практика: Мониторинг GitOps Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте мониторинг для GitOps pipeline: метрики ArgoCD, алерты на failed sync, Grafana дашборд и SLO для деплоев.',
      requirements: [
        'Включите Prometheus метрики в ArgoCD',
        'Создайте PrometheusRule с алертами: sync failed, app degraded, out of sync > 10 min',
        'Настройте Grafana дашборд: sync status, sync duration, app health, git commit lag',
        'Определите SLO для деплоев: 99% sync успешны, sync time < 5 минут',
        'Настройте ArgoCD notifications в Slack для всех sync событий',
        'Создайте recording rules для Error Budget деплоев'
      ],
      hint: 'ArgoCD metrics: argocd_app_sync_total, argocd_app_health_status, argocd_app_info. PrometheusRule для алертов. Grafana dashboard с этими метриками.',
      expectedOutput: 'Prometheus targets: argocd-metrics, argocd-server-metrics\nAlerts: ArgoSyncFailed, ArgoAppDegraded, ArgoOutOfSync\nGrafana: dashboard с sync status, duration, health\nSLO: 99% successful syncs, error budget visible\nSlack: notifications on sync success/failure\nRecording rules: slo:argocd_sync_success:ratio',
      solution: '# 1. ArgoCD Prometheus метрики (включены по умолчанию)\n# Проверить: kubectl get svc argocd-metrics -n argocd\n\n# 2. PrometheusRule\n# groups:\n#   - name: argocd\n#     rules:\n#       - alert: ArgoSyncFailed\n#         expr: argocd_app_sync_total{phase="Error"} > 0\n#         for: 1m\n#         labels: { severity: critical }\n#       - alert: ArgoAppDegraded\n#         expr: argocd_app_health_status{health_status="Degraded"} == 1\n#         for: 5m\n#         labels: { severity: warning }\n#       - alert: ArgoOutOfSync\n#         expr: argocd_app_info{sync_status="OutOfSync"} == 1\n#         for: 10m\n#         labels: { severity: warning }\n\n# 3. Recording rules\n# - record: slo:argocd_sync_success:ratio_rate30d\n#   expr: sum(rate(argocd_app_sync_total{phase="Succeeded"}[30d])) / sum(rate(argocd_app_sync_total[30d]))\n\n# 4. Grafana Dashboard:\n# Panel 1: Sync Status (argocd_app_info by sync_status)\n# Panel 2: Sync Duration (argocd_app_sync_total histogram)\n# Panel 3: App Health (argocd_app_health_status)\n# Panel 4: Deploy Frequency (rate(argocd_app_sync_total[1d]))\n\n# 5. Slack notifications\n# argocd-notifications-cm ConfigMap с templates и triggers',
      explanation: 'Мониторинг GitOps pipeline включает метрики ArgoCD (sync status, duration, health), алерты на проблемы (failed sync, degraded apps), и SLO для деплоев. Error Budget показывает, сколько неудачных деплоев допустимо. Notifications информируют команду в реальном времени.'
    },
    {
      id: 6,
      title: 'Практика: Полный GitOps Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объедините все компоненты в полный GitOps pipeline: Git push -> CI build -> GitOps update -> ArgoCD sync -> Kubernetes deploy -> Monitoring.',
      requirements: [
        'Полный путь: git push -> GitHub Actions CI -> Docker build -> GitOps repo update -> ArgoCD sync',
        'Helm chart с dependency (PostgreSQL), pre-upgrade hook для миграций',
        'Canary deployment: 10% трафика на новую версию, 90% на стабильную',
        'Monitoring: Prometheus + Grafana с дашбордом для приложения и pipeline',
        'Автоматический rollback ArgoCD при degraded health > 5 минут',
        'Документация: README с архитектурой, runbook для on-call'
      ],
      hint: 'Объедините все практики модулей 26-44: Helm chart, ArgoCD Application, CI pipeline, мониторинг, canary через Ingress annotations.',
      expectedOutput: 'Git push -> CI (2 min) -> Image pushed -> GitOps updated -> ArgoCD synced (30s)\nCanary: 10% traffic to v2, monitoring error rate\nIf errors < 1%: increase to 50%, then 100%\nIf errors > 5%: automatic rollback to v1\nGrafana: full dashboard with app + pipeline metrics\nRunbook: step-by-step for common incidents',
      solution: '# Полный GitOps Pipeline:\n\n# 1. App Repo: src/ + Dockerfile + .github/workflows/ci.yml\n# CI: lint -> test -> trivy -> build -> push -> update gitops\n\n# 2. GitOps Repo:\n# apps/myapp/ (Helm chart with PostgreSQL dependency)\n#   Chart.yaml (dependencies: postgresql)\n#   values-{env}.yaml\n#   templates/deployment, service, ingress, hooks\n# clusters/prod/applicationset.yaml\n# infrastructure/monitoring/\n\n# 3. ArgoCD:\n# ApplicationSet for dev/staging/prod\n# Auto-sync for staging\n# Manual sync (PR) for prod\n# Notifications to Slack\n\n# 4. Canary:\n# Two Ingress resources (stable + canary)\n# canary-weight: 10 -> 50 -> 100\n# Monitor error_rate between each step\n\n# 5. Auto-rollback:\n# ArgoCD degraded analysis:\n# if health == Degraded for 5min -> rollback\n# argocd app rollback myapp-prod\n\n# 6. Monitoring:\n# App metrics: latency, error_rate, throughput\n# Pipeline metrics: sync_status, deploy_frequency\n# SLO: 99.9% availability, 99% successful deploys',
      explanation: 'Полный GitOps Pipeline объединяет все практики DevOps: контейнеризация (Docker), CI/CD (GitHub Actions), декларативная конфигурация (Helm), автоматическая доставка (ArgoCD), канареечный деплой (Ingress canary), мониторинг (Prometheus/Grafana), и автоматический rollback. Это production-grade pipeline для реальных проектов.'
    }
  ]
}
