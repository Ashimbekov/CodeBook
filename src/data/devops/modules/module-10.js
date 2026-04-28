export default {
  id: 10,
  title: 'Kubernetes: основы',
  description: 'Основы Kubernetes: архитектура, pods, services, deployments, kubectl и работа с кластером.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes (K8s) — платформа для оркестрации контейнеров. Она автоматизирует деплой, масштабирование и управление контейнерными приложениями. Kubernetes — стандарт индустрии для запуска контейнеров в продакшене.' },
        { type: 'heading', value: 'Зачем нужен Kubernetes' },
        { type: 'list', value: [
          'Автоматическое масштабирование (Horizontal Pod Autoscaler)',
          'Self-healing: перезапуск упавших контейнеров',
          'Rolling updates: обновление без даунтайма',
          'Service discovery: автоматический DNS для сервисов',
          'Load balancing: распределение нагрузки',
          'Управление секретами и конфигурацией',
          'Декларативная конфигурация: описываешь желаемое состояние, K8s обеспечивает'
        ] },
        { type: 'heading', value: 'Архитектура Kubernetes' },
        { type: 'code', language: 'bash', value: '# Control Plane (Master):\n# ├── API Server      — точка входа (kubectl -> API Server)\n# ├── etcd            — хранилище состояния кластера\n# ├── Scheduler       — распределяет pods по нодам\n# └── Controller Manager — поддерживает желаемое состояние\n\n# Worker Nodes:\n# ├── kubelet         — агент на каждой ноде\n# ├── kube-proxy      — сетевой прокси\n# └── Container Runtime — Docker/containerd\n\n# Локальная установка для обучения:\n# minikube — локальный кластер в VM\ncurl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64\nsudo install minikube-linux-amd64 /usr/local/bin/minikube\nminikube start\n\n# kind — Kubernetes IN Docker\ncurl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64\nchmod +x ./kind && sudo mv ./kind /usr/local/bin/kind\nkind create cluster' },
        { type: 'tip', value: 'Для обучения используй minikube или kind. Для продакшена — управляемые сервисы: AWS EKS, Google GKE, Azure AKS. Они снимают бремя управления Control Plane.' }
      ]
    },
    {
      id: 2,
      title: 'kubectl и Pods',
      type: 'theory',
      content: [
        { type: 'text', value: 'kubectl — CLI для управления Kubernetes. Pod — минимальная единица развёртывания в K8s. Pod содержит один или несколько контейнеров с общей сетью и хранилищем.' },
        { type: 'heading', value: 'Основные команды kubectl' },
        { type: 'code', language: 'bash', value: '# Информация о кластере\nkubectl cluster-info\nkubectl get nodes\nkubectl get nodes -o wide\n\n# Получение ресурсов\nkubectl get pods                      # Pods в текущем namespace\nkubectl get pods -A                   # Во всех namespaces\nkubectl get pods -o wide              # Расширенный вывод (IP, нода)\nkubectl get pods -w                   # Watch (следить за изменениями)\nkubectl get all                       # Все ресурсы\n\n# Подробная информация\nkubectl describe pod my-pod\nkubectl describe node worker-01\n\n# Логи\nkubectl logs my-pod\nkubectl logs my-pod -f                # Follow\nkubectl logs my-pod -c container-name # Конкретный контейнер\nkubectl logs my-pod --previous        # Предыдущий контейнер (после рестарта)\n\n# Выполнение команд\nkubectl exec -it my-pod -- bash\nkubectl exec my-pod -- cat /etc/hosts\n\n# Удаление\nkubectl delete pod my-pod\nkubectl delete -f manifest.yaml' },
        { type: 'heading', value: 'Описание Pod в YAML' },
        { type: 'code', language: 'yaml', value: '# pod.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\n  labels:\n    app: my-app\n    env: production\nspec:\n  containers:\n    - name: app\n      image: nginx:1.25\n      ports:\n        - containerPort: 80\n      resources:\n        requests:\n          memory: "64Mi"\n          cpu: "250m"\n        limits:\n          memory: "128Mi"\n          cpu: "500m"\n      livenessProbe:\n        httpGet:\n          path: /health\n          port: 80\n        initialDelaySeconds: 5\n        periodSeconds: 10\n      readinessProbe:\n        httpGet:\n          path: /ready\n          port: 80\n        initialDelaySeconds: 5\n        periodSeconds: 5' },
        { type: 'code', language: 'bash', value: '# Применить манифест\nkubectl apply -f pod.yaml\nkubectl get pods\nkubectl describe pod my-app' },
        { type: 'note', value: 'На практике Pods редко создают напрямую. Используют Deployment для управления — он обеспечивает репликацию, обновления и самовосстановление. Pod — это абстракция для обучения.' }
      ]
    },
    {
      id: 3,
      title: 'Deployments',
      type: 'theory',
      content: [
        { type: 'text', value: 'Deployment — основной ресурс для запуска приложений в Kubernetes. Он управляет ReplicaSet, который в свою очередь управляет Pods. Deployment обеспечивает декларативные обновления и откаты.' },
        { type: 'heading', value: 'Создание Deployment' },
        { type: 'code', language: 'yaml', value: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\n  labels:\n    app: my-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: my-app\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1            # Макс. дополнительных подов при обновлении\n      maxUnavailable: 0      # Минимум доступных подов\n  template:\n    metadata:\n      labels:\n        app: my-app\n    spec:\n      containers:\n        - name: app\n          image: myapp:1.0.0\n          ports:\n            - containerPort: 8080\n          env:\n            - name: DATABASE_URL\n              value: "postgresql://db:5432/myapp"\n          resources:\n            requests:\n              memory: "128Mi"\n              cpu: "250m"\n            limits:\n              memory: "256Mi"\n              cpu: "500m"\n          readinessProbe:\n            httpGet:\n              path: /health\n              port: 8080\n            initialDelaySeconds: 10\n            periodSeconds: 5' },
        { type: 'heading', value: 'Управление Deployment' },
        { type: 'code', language: 'bash', value: '# Создание / обновление\nkubectl apply -f deployment.yaml\n\n# Статус\nkubectl get deployments\nkubectl rollout status deployment/my-app\n\n# Масштабирование\nkubectl scale deployment/my-app --replicas=5\n\n# Обновление образа\nkubectl set image deployment/my-app app=myapp:2.0.0\n\n# История обновлений\nkubectl rollout history deployment/my-app\n\n# Откат\nkubectl rollout undo deployment/my-app              # К предыдущей версии\nkubectl rollout undo deployment/my-app --to-revision=2  # К конкретной\n\n# Пауза/возобновление обновления\nkubectl rollout pause deployment/my-app\nkubectl rollout resume deployment/my-app' },
        { type: 'tip', value: 'maxSurge: 1 и maxUnavailable: 0 — самая безопасная стратегия: сначала создаётся новый pod, затем удаляется старый. Это гарантирует нулевой даунтайм при обновлениях.' }
      ]
    },
    {
      id: 4,
      title: 'Services',
      type: 'theory',
      content: [
        { type: 'text', value: 'Service в Kubernetes предоставляет стабильный сетевой endpoint для группы Pods. Pods могут создаваться и удаляться, но Service обеспечивает постоянный IP и DNS-имя.' },
        { type: 'heading', value: 'Типы Services' },
        { type: 'code', language: 'yaml', value: '# ClusterIP — доступен только внутри кластера (по умолчанию)\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app-service\nspec:\n  type: ClusterIP\n  selector:\n    app: my-app              # Выбирает pods с этим label\n  ports:\n    - port: 80               # Порт сервиса\n      targetPort: 8080       # Порт контейнера\n      protocol: TCP\n\n---\n# NodePort — доступен на IP каждой ноды\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app-nodeport\nspec:\n  type: NodePort\n  selector:\n    app: my-app\n  ports:\n    - port: 80\n      targetPort: 8080\n      nodePort: 30080        # 30000-32767\n\n---\n# LoadBalancer — создаёт облачный балансировщик (AWS ELB, GCP LB)\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app-lb\nspec:\n  type: LoadBalancer\n  selector:\n    app: my-app\n  ports:\n    - port: 80\n      targetPort: 8080' },
        { type: 'heading', value: 'DNS в Kubernetes' },
        { type: 'code', language: 'bash', value: '# Kubernetes автоматически создаёт DNS-записи для Services\n\n# Внутри одного namespace:\ncurl http://my-app-service:80\ncurl http://my-app-service\n\n# Из другого namespace:\ncurl http://my-app-service.production.svc.cluster.local\n\n# Формат DNS:\n# <service-name>.<namespace>.svc.cluster.local\n\n# Примеры:\n# http://postgres:5432                    — тот же namespace\n# http://postgres.database.svc.cluster.local  — namespace database\n\n# Проверка\nkubectl get services\nkubectl describe service my-app-service\nkubectl get endpoints my-app-service     # К каким pods подключён' },
        { type: 'note', value: 'ClusterIP — для внутренних сервисов (БД, кэш). NodePort — для разработки и тестирования. LoadBalancer — для продакшена (создаёт облачный балансировщик). Для HTTP-трафика лучше использовать Ingress.' }
      ]
    },
    {
      id: 5,
      title: 'Namespaces и организация ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Namespaces — виртуальные кластеры внутри кластера. Они изолируют ресурсы, позволяют разделять окружения (dev/staging/prod) и управлять доступом.' },
        { type: 'heading', value: 'Работа с Namespaces' },
        { type: 'code', language: 'bash', value: '# Встроенные namespaces\nkubectl get namespaces\n# default          — по умолчанию\n# kube-system      — системные компоненты K8s\n# kube-public      — публичные ресурсы\n# kube-node-lease  — heartbeat нод\n\n# Создание\nkubectl create namespace production\nkubectl create namespace staging\n\n# Или через YAML\n# apiVersion: v1\n# kind: Namespace\n# metadata:\n#   name: production\n\n# Операции в namespace\nkubectl get pods -n production\nkubectl apply -f deployment.yaml -n production\nkubectl logs my-pod -n production\n\n# Переключение namespace по умолчанию\nkubectl config set-context --current --namespace=production\n\n# Все ресурсы во всех namespaces\nkubectl get all -A' },
        { type: 'heading', value: 'Resource Quotas и Limits' },
        { type: 'code', language: 'yaml', value: '# Ограничение ресурсов на namespace\napiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: production-quota\n  namespace: production\nspec:\n  hard:\n    requests.cpu: "4"\n    requests.memory: 8Gi\n    limits.cpu: "8"\n    limits.memory: 16Gi\n    pods: "20"\n    services: "10"\n\n---\n# LimitRange — значения по умолчанию для контейнеров\napiVersion: v1\nkind: LimitRange\nmetadata:\n  name: default-limits\n  namespace: production\nspec:\n  limits:\n    - default:\n        cpu: "500m"\n        memory: "256Mi"\n      defaultRequest:\n        cpu: "250m"\n        memory: "128Mi"\n      type: Container' },
        { type: 'tip', value: 'ResourceQuota предотвращает ситуацию когда один namespace потребляет все ресурсы кластера. LimitRange задаёт значения по умолчанию, если разработчик не указал resources в Pod.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой в Kubernetes',
      type: 'practice',
      difficulty: 'hard',
      description: 'Задеплойте приложение в Kubernetes с Deployment, Service и Namespace.',
      requirements: [
        'Установите minikube или kind для локального кластера',
        'Создайте namespace "devops-lab"',
        'Создайте Deployment с 3 репликами nginx',
        'Создайте Service типа NodePort для доступа',
        'Выполните обновление образа (rolling update)',
        'Выполните откат к предыдущей версии'
      ],
      hint: 'minikube start для запуска. kubectl create namespace для namespace. kubectl apply -f для применения YAML. kubectl set image для обновления.',
      expectedOutput: 'Кластер запущен: kubectl get nodes -> Ready\nNamespace devops-lab создан\nDeployment: 3/3 pods running\nService: NodePort на порту 30080\nRolling update: nginx:1.25 -> nginx:1.26 без даунтайма\nRollback: вернулись на nginx:1.25',
      solution: '# 1. Запуск кластера\nminikube start\nkubectl get nodes\n\n# 2. Namespace\nkubectl create namespace devops-lab\n\n# 3. Deployment (deployment.yaml)\n# apiVersion: apps/v1\n# kind: Deployment\n# metadata:\n#   name: nginx-app\n#   namespace: devops-lab\n# spec:\n#   replicas: 3\n#   selector:\n#     matchLabels:\n#       app: nginx-app\n#   template:\n#     metadata:\n#       labels:\n#         app: nginx-app\n#     spec:\n#       containers:\n#         - name: nginx\n#           image: nginx:1.25\n#           ports:\n#             - containerPort: 80\n\nkubectl apply -f deployment.yaml\nkubectl get pods -n devops-lab\n\n# 4. Service (service.yaml)\n# apiVersion: v1\n# kind: Service\n# metadata:\n#   name: nginx-service\n#   namespace: devops-lab\n# spec:\n#   type: NodePort\n#   selector:\n#     app: nginx-app\n#   ports:\n#     - port: 80\n#       targetPort: 80\n#       nodePort: 30080\n\nkubectl apply -f service.yaml\nminikube service nginx-service -n devops-lab --url\n\n# 5. Rolling Update\nkubectl set image deployment/nginx-app nginx=nginx:1.26 -n devops-lab\nkubectl rollout status deployment/nginx-app -n devops-lab\n\n# 6. Rollback\nkubectl rollout undo deployment/nginx-app -n devops-lab\nkubectl rollout status deployment/nginx-app -n devops-lab',
      explanation: 'Deployment управляет ReplicaSet, который поддерживает 3 реплики Pod. Service направляет трафик на все Pods с label app: nginx-app. Rolling Update заменяет pods по одному без даунтайма. Rollback undo возвращает к предыдущему ReplicaSet.'
    }
  ]
}
