export default {
  id: 17,
  title: 'CI/CD: ArgoCD и GitOps',
  description: 'Автоматизация деплоя в Kubernetes через GitOps с ArgoCD: приложения, синхронизация, автодеплой',
  lessons: [
    {
      id: 1,
      title: 'GitOps: принципы и подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitOps — это практика, где Git репозиторий является единственным источником истины для инфраструктуры и приложений. Любое изменение в кластере происходит только через Git PR/commit.' },
        { type: 'heading', value: 'Принципы GitOps' },
        { type: 'list', items: [
          'Декларативное описание — желаемое состояние системы описано в Git',
          'Git как источник истины — никаких ручных kubectl apply в продакшене',
          'Автоматическая синхронизация — изменения в Git автоматически применяются в кластере',
          'Непрерывный откат — Git revert = откат изменений в кластере'
        ]},
        { type: 'heading', value: 'GitOps vs традиционный CI/CD' },
        { type: 'list', items: [
          'Push model (традиционный): CI pipeline делает kubectl apply — требует доступ к кластеру из CI',
          'Pull model (GitOps): Агент в кластере тянет изменения из Git — более безопасно',
          'GitOps: история изменений в Git, легко понять "кто и когда поменял"',
          'GitOps: аварийное восстановление — clone repo + apply = готово'
        ]},
        { type: 'tip', value: 'ArgoCD и Flux — наиболее популярные GitOps инструменты. ArgoCD имеет удобный UI и более богатые возможности. Flux лучше интегрируется с Helm и Kustomize.' }
      ]
    },
    {
      id: 2,
      title: 'ArgoCD: установка и архитектура',
      type: 'theory',
      content: [
        { type: 'text', value: 'ArgoCD — декларативный GitOps инструмент для Kubernetes. Он мониторит Git репозиторий и синхронизирует состояние кластера с ним.' },
        { type: 'code', language: 'bash', value: '# Установка ArgoCD\nkubectl create namespace argocd\nkubectl apply -n argocd -f \\\n  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml\n\n# Дождаться запуска\nkubectl wait --for=condition=available deployment/argocd-server \\\n  -n argocd --timeout=300s\n\n# Открыть UI (port-forward)\nkubectl port-forward svc/argocd-server 8080:443 -n argocd &\n# Браузер: https://localhost:8080\n\n# Получить начальный пароль\nkubectl get secret argocd-initial-admin-secret \\\n  -n argocd -o jsonpath="{.data.password}" | base64 -d\n# Логин: admin\n\n# Установить argocd CLI\ncurl -sSL -o argocd \\\n  https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64\nchmod +x argocd && sudo mv argocd /usr/local/bin/\n\n# Войти через CLI\nargocd login localhost:8080 --insecure --username admin' }
      ]
    },
    {
      id: 3,
      title: 'ArgoCD Application: деклар. определение деплоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'ArgoCD Application — CRD, описывающий какой Git репозиторий и папку синхронизировать с каким namespace. Это основной объект управления в ArgoCD.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: my-app\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/my-org/my-app-config.git\n    targetRevision: HEAD  # или ветка/тег\n    path: kubernetes/production  # папка с манифестами\n    # Для Helm чарта:\n    # helm:\n    #   valueFiles: [values-prod.yaml]\n    #   values: |\n    #     replicaCount: 3\n  destination:\n    server: https://kubernetes.default.svc  # текущий кластер\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true      # удалять ресурсы отсутствующие в Git\n      selfHeal: true   # восстанавливать ручные изменения\n    syncOptions:\n    - CreateNamespace=true\n    retry:\n      limit: 5\n      backoff:\n        duration: 5s\n        factor: 2\n        maxDuration: 3m' }
      ]
    },
    {
      id: 4,
      title: 'App of Apps паттерн',
      type: 'theory',
      content: [
        { type: 'text', value: 'App of Apps — паттерн управления множеством ArgoCD Applications. Одно "корневое" Application управляет набором других Application. Это позволяет централизованно управлять всеми деплоями кластера.' },
        { type: 'code', language: 'yaml', value: '# root-app.yaml - управляет всеми приложениями кластера\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: cluster-apps\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/my-org/cluster-config.git\n    targetRevision: HEAD\n    path: apps  # папка содержит Application YAML файлы\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: argocd\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true' },
        { type: 'text', value: 'В папке apps/ находятся файлы для каждого Application: frontend-app.yaml, backend-app.yaml, monitoring-app.yaml. При добавлении нового файла в Git, ArgoCD автоматически создаёт новый Application.' },
        { type: 'note', value: 'ApplicationSet — более мощная альтернатива App of Apps. Позволяет генерировать Application для всех кластеров, сред или репозиториев через шаблоны.' }
      ]
    },
    {
      id: 5,
      title: 'ArgoCD Sync Strategies и Image Updater',
      type: 'theory',
      content: [
        { type: 'text', value: 'ArgoCD Image Updater автоматически обновляет теги образов в Git когда в container registry появляется новый образ.' },
        { type: 'code', language: 'bash', value: '# Полезные команды argocd CLI\n\n# Список приложений\nargocd app list\n\n# Детали приложения\nargocd app get my-app\n\n# Ручная синхронизация\nargocd app sync my-app\n\n# Принудительная синхронизация (с удалением ресурсов)\nargocd app sync my-app --prune\n\n# История синхронизаций\nargocd app history my-app\n\n# Откат к предыдущему состоянию\nargocd app rollback my-app 3  # к ревизии 3\n\n# Посмотреть diff между Git и кластером\nargocd app diff my-app\n\n# Создать Application через CLI\nargocd app create my-app \\\n  --repo https://github.com/my-org/config.git \\\n  --path kubernetes/ \\\n  --dest-server https://kubernetes.default.svc \\\n  --dest-namespace production \\\n  --sync-policy automated' }
      ]
    },
    {
      id: 6,
      title: 'Практика: GitOps деплой с ArgoCD',
      type: 'practice',
      difficulty: 'hard',
      description: 'Установите ArgoCD, создайте Application, синхронизируйте манифесты из Git репозитория.',
      requirements: [
        'Установить ArgoCD в кластер',
        'Открыть UI и войти',
        'Создать Application указывающий на GitHub репозиторий',
        'Синхронизировать приложение',
        'Внести изменение в Git и наблюдать автоматическую синхронизацию'
      ],
      hint: 'Для тестирования можно использовать публичный репозиторий https://github.com/argoproj/argocd-example-apps. Включите automated sync для автоматического применения изменений.',
      expectedOutput: 'kubectl get pods -n argocd:\nNAME                               READY   STATUS\nargocd-server-xxx                  1/1     Running\nargocd-repo-server-xxx             1/1     Running\nargocd-application-controller-xxx  2/2     Running\n\nargocd app get guestbook:\nName: guestbook\nProject: default\nStatus: Synced\nHealth: Healthy\n\nArgoCD UI http://localhost:8080 показывает граф ресурсов приложения.\nПосле commit в Git репозиторий и автосинхронизации — kubectl get pods обновляется автоматически.',
      solution: '# Установить ArgoCD\nkubectl create namespace argocd\nkubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml\n\n# Дождаться\nkubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s\n\n# Port-forward\nkubectl port-forward svc/argocd-server -n argocd 8080:443 &\n\n# Получить пароль\nINITIAL_PASSWORD=$(kubectl get secret argocd-initial-admin-secret \\\n  -n argocd -o jsonpath="{.data.password}" | base64 -d)\necho "Password: $INITIAL_PASSWORD"\n\n# Войти через CLI\nargocd login localhost:8080 --insecure --username admin --password $INITIAL_PASSWORD\n\n# Создать Application из example репозитория\nargocd app create guestbook \\\n  --repo https://github.com/argoproj/argocd-example-apps.git \\\n  --path guestbook \\\n  --dest-server https://kubernetes.default.svc \\\n  --dest-namespace default\n\n# Синхронизировать вручную\nargocd app sync guestbook\n\n# Проверить статус\nargocd app get guestbook\nkubectl get pods\n\n# Включить автосинхронизацию\nargocd app set guestbook --sync-policy automated\nargocd app set guestbook --auto-prune --self-heal\n\n# Применить Application через YAML\ncat <<EOF | kubectl apply -f -\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: my-guestbook\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/argoproj/argocd-example-apps.git\n    targetRevision: HEAD\n    path: helm-guestbook\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: default\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n    syncOptions:\n    - CreateNamespace=true\nEOF',
      explanation: 'ArgoCD следит за состоянием Git репозитория и синхронизирует кластер. selfHeal возвращает ручные изменения в состояние из Git. prune удаляет ресурсы, которых нет в Git. UI ArgoCD показывает граф зависимостей всех ресурсов и статус синхронизации в реальном времени.'
    }
  ]
}
