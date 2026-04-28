export default {
  id: 20,
  title: 'Kubernetes для микросервисов',
  description: 'Оркестрация микросервисов в Kubernetes: Deployments, Services, Helm charts, namespaces, auto-scaling, rolling updates.',
  lessons: [
    {
      id: 1,
      title: 'Kubernetes ресурсы для микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes — стандартная платформа для деплоя микросервисов. Каждый сервис описывается набором ресурсов: Deployment (запуск), Service (обнаружение), ConfigMap/Secret (конфигурация), HPA (масштабирование).' },
        { type: 'code', language: 'yaml', value: '# Полный набор ресурсов для order-service\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: order-service\n  namespace: shop\n  labels:\n    app: order-service\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: order-service\n  template:\n    metadata:\n      labels:\n        app: order-service\n        version: v1\n      annotations:\n        prometheus.io/scrape: "true"\n        prometheus.io/path: "/actuator/prometheus"\n        prometheus.io/port: "8080"\n    spec:\n      containers:\n        - name: order-service\n          image: registry.example.com/order-service:1.2.0\n          ports:\n            - containerPort: 8080\n          envFrom:\n            - configMapRef:\n                name: order-service-config\n            - secretRef:\n                name: order-service-secrets\n          resources:\n            requests:\n              memory: 256Mi\n              cpu: 250m\n            limits:\n              memory: 512Mi\n              cpu: 500m\n          livenessProbe:\n            httpGet:\n              path: /actuator/health/liveness\n              port: 8080\n            initialDelaySeconds: 30\n            periodSeconds: 10\n          readinessProbe:\n            httpGet:\n              path: /actuator/health/readiness\n              port: 8080\n            initialDelaySeconds: 15\n            periodSeconds: 5\n      imagePullSecrets:\n        - name: registry-credentials' },
        { type: 'tip', value: 'Всегда указывайте resource requests и limits. Requests — гарантированные ресурсы, limits — максимум. Без limits один Pod может сожрать все ресурсы ноды.' }
      ]
    },
    {
      id: 2,
      title: 'Services и Ingress',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes Service обеспечивает стабильный адрес для набора Pods. Ingress маршрутизирует внешний HTTP-трафик к внутренним сервисам. Для микросервисов используют ClusterIP + Ingress.' },
        { type: 'code', language: 'yaml', value: '# Service — внутренний доступ\napiVersion: v1\nkind: Service\nmetadata:\n  name: order-service\n  namespace: shop\nspec:\n  selector:\n    app: order-service\n  ports:\n    - port: 80\n      targetPort: 8080\n  type: ClusterIP\n\n---\n# Ingress — внешний доступ\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: shop-ingress\n  namespace: shop\n  annotations:\n    nginx.ingress.kubernetes.io/rate-limit: "100"\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  tls:\n    - hosts: [api.shop.com]\n      secretName: shop-tls\n  rules:\n    - host: api.shop.com\n      http:\n        paths:\n          - path: /api/v1/users\n            pathType: Prefix\n            backend:\n              service:\n                name: user-service\n                port:\n                  number: 80\n          - path: /api/v1/orders\n            pathType: Prefix\n            backend:\n              service:\n                name: order-service\n                port:\n                  number: 80\n          - path: /api/v1/payments\n            pathType: Prefix\n            backend:\n              service:\n                name: payment-service\n                port:\n                  number: 80' },
        { type: 'note', value: 'Ingress Controller (Nginx, Traefik) заменяет API Gateway для простых случаев: routing, TLS, rate limiting. Для сложных сценариев (JWT auth, response transformation) используйте полноценный API Gateway.' }
      ]
    },
    {
      id: 3,
      title: 'Helm Charts',
      type: 'theory',
      content: [
        { type: 'text', value: 'Helm — пакетный менеджер для Kubernetes. Chart — шаблон для деплоя. Values — параметры, переопределяемые для разных окружений (dev, staging, prod). Один Chart для всех микросервисов с разными values.' },
        { type: 'code', language: 'yaml', value: '# Структура Helm Chart:\n# microservice-chart/\n#   Chart.yaml\n#   values.yaml\n#   templates/\n#     deployment.yaml\n#     service.yaml\n#     configmap.yaml\n#     hpa.yaml\n#     ingress.yaml\n\n# templates/deployment.yaml (шаблон)\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Values.name }}\n  namespace: {{ .Values.namespace }}\nspec:\n  replicas: {{ .Values.replicas }}\n  selector:\n    matchLabels:\n      app: {{ .Values.name }}\n  template:\n    spec:\n      containers:\n        - name: {{ .Values.name }}\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n          ports:\n            - containerPort: {{ .Values.port }}\n          resources:\n            requests:\n              memory: {{ .Values.resources.requests.memory }}\n              cpu: {{ .Values.resources.requests.cpu }}\n            limits:\n              memory: {{ .Values.resources.limits.memory }}\n              cpu: {{ .Values.resources.limits.cpu }}' },
        { type: 'code', language: 'yaml', value: '# values.yaml — значения по умолчанию\nname: order-service\nnamespace: shop\nreplicas: 2\nport: 8080\n\nimage:\n  repository: registry.example.com/order-service\n  tag: latest\n\nresources:\n  requests:\n    memory: 256Mi\n    cpu: 250m\n  limits:\n    memory: 512Mi\n    cpu: 500m\n\n---\n# values-prod.yaml — override для production\nreplicas: 5\nimage:\n  tag: 1.2.0\nresources:\n  requests:\n    memory: 512Mi\n    cpu: 500m\n  limits:\n    memory: 1Gi\n    cpu: 1000m' },
        { type: 'code', language: 'bash', value: '# Деплой через Helm\nhelm install order-service ./microservice-chart \\\n  -f values-prod.yaml \\\n  --set image.tag=1.2.0 \\\n  --namespace shop\n\n# Обновление\nhelm upgrade order-service ./microservice-chart \\\n  --set image.tag=1.3.0\n\n# Откат\nhelm rollback order-service 1\n\n# Деплой всех сервисов из одного Chart\nfor service in user-service order-service payment-service; do\n  helm upgrade --install $service ./microservice-chart \\\n    -f values/$service.yaml \\\n    --namespace shop\ndone' },
        { type: 'tip', value: 'Создайте один универсальный Helm Chart для всех микросервисов. Различия — в values файлах. Это уменьшает дублирование и стандартизирует деплой.' }
      ]
    },
    {
      id: 4,
      title: 'Auto-Scaling',
      type: 'theory',
      content: [
        { type: 'text', value: 'HPA (Horizontal Pod Autoscaler) масштабирует количество Pod-ов на основе метрик: CPU, Memory, custom metrics. KEDA расширяет HPA поддержкой Kafka lag, queue depth и других внешних метрик.' },
        { type: 'code', language: 'yaml', value: '# HPA — автомасштабирование по CPU\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: order-service-hpa\n  namespace: shop\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: order-service\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70\n    - type: Resource\n      resource:\n        name: memory\n        target:\n          type: Utilization\n          averageUtilization: 80\n    # Custom metric: requests per second\n    - type: Pods\n      pods:\n        metric:\n          name: http_requests_per_second\n        target:\n          type: AverageValue\n          averageValue: "100"\n  behavior:\n    scaleUp:\n      stabilizationWindowSeconds: 60\n      policies:\n        - type: Pods\n          value: 2\n          periodSeconds: 60\n    scaleDown:\n      stabilizationWindowSeconds: 300\n      policies:\n        - type: Pods\n          value: 1\n          periodSeconds: 120' },
        { type: 'code', language: 'yaml', value: '# KEDA — масштабирование по Kafka consumer lag\napiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: payment-consumer-scaler\n  namespace: shop\nspec:\n  scaleTargetRef:\n    name: payment-service\n  minReplicaCount: 1\n  maxReplicaCount: 20\n  triggers:\n    - type: kafka\n      metadata:\n        bootstrapServers: kafka:9092\n        consumerGroup: payment-service\n        topic: order-events\n        lagThreshold: "100"  # Scale up если lag > 100' },
        { type: 'warning', value: 'Масштабирование вниз медленнее чем вверх (stabilizationWindow). Это предотвращает "пилу" — постоянное добавление/удаление Pod-ов при колебании нагрузки. Настройте scaleDown window на 5-10 минут.' }
      ]
    },
    {
      id: 5,
      title: 'Rolling Updates и Rollbacks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rolling Update — обновление без downtime: постепенная замена старых Pod-ов новыми. Blue-Green — два набора Pod-ов, переключение трафика. Canary — постепенное увеличение трафика на новую версию.' },
        { type: 'code', language: 'yaml', value: '# Rolling Update стратегия\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: order-service\nspec:\n  replicas: 5\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # +1 Pod во время обновления\n      maxUnavailable: 0  # 0 Pod недоступных (zero downtime)\n  template:\n    spec:\n      containers:\n        - name: order-service\n          image: order-service:1.3.0\n          readinessProbe:  # Критично для rolling update!\n            httpGet:\n              path: /actuator/health/readiness\n              port: 8080\n            initialDelaySeconds: 10\n            periodSeconds: 5' },
        { type: 'code', language: 'bash', value: '# Обновление версии\nkubectl set image deployment/order-service \\\n  order-service=order-service:1.3.0 -n shop\n\n# Мониторинг обновления\nkubectl rollout status deployment/order-service -n shop\n# Waiting for rollout to finish: 2 of 5 updated replicas are available...\n# deployment "order-service" successfully rolled out\n\n# Откат при проблемах\nkubectl rollout undo deployment/order-service -n shop\n\n# История ревизий\nkubectl rollout history deployment/order-service -n shop\n# REVISION  CHANGE-CAUSE\n# 1         image: order-service:1.2.0\n# 2         image: order-service:1.3.0\n\n# Откат к конкретной ревизии\nkubectl rollout undo deployment/order-service --to-revision=1 -n shop' },
        { type: 'tip', value: 'readinessProbe критичен для zero-downtime: без него Kubernetes направит трафик на Pod до того как он готов, вызывая ошибки. initialDelaySeconds должен покрывать время старта приложения (для Java: 15-45 секунд).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой в Kubernetes',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разверните 3 микросервиса в Kubernetes с Helm, HPA и Ingress.',
      requirements: [
        'Создайте универсальный Helm Chart для микросервисов',
        'Деплойте 3 сервиса с разными values файлами',
        'Настройте Ingress с TLS для маршрутизации по path',
        'Настройте HPA: масштабирование от 2 до 10 реплик по CPU',
        'Выполните Rolling Update до новой версии',
        'Выполните Rollback при обнаружении ошибки'
      ],
      hint: 'Используйте Minikube или kind для локального кластера. Helm create для шаблона chart. kubectl apply -f ingress.yaml для Ingress. kubectl rollout status для мониторинга обновления.',
      expectedOutput: 'Helm install: 3 сервиса развёрнуты в namespace shop.\nPods: user-service (2), order-service (3), payment-service (2).\nIngress: api.shop.com/api/v1/users -> user-service.\nHPA: CPU > 70% -> scale up order-service до 5 реплик.\nRolling Update: order-service 1.2.0 -> 1.3.0 (zero downtime).\nRollback: order-service 1.3.0 -> 1.2.0 (обнаружены ошибки).',
      solution: '# helm install\nfor svc in user-service order-service payment-service; do\n  helm upgrade --install $svc ./microservice-chart \\\n    -f values/$svc.yaml -n shop --create-namespace\ndone\n\n# HPA\nkubectl apply -f hpa.yaml -n shop\n\n# Rolling Update\nhelm upgrade order-service ./microservice-chart \\\n  --set image.tag=1.3.0 -n shop\nkubectl rollout status deployment/order-service -n shop\n\n# Rollback\nhelm rollback order-service 1 -n shop\n# или: kubectl rollout undo deployment/order-service -n shop',
      explanation: 'Kubernetes — стандартная платформа для микросервисов. Helm стандартизирует деплой. HPA автоматически масштабирует по нагрузке. Rolling Update обеспечивает zero-downtime deployments. Ingress маршрутизирует внешний трафик. Rollback быстро откатывает проблемную версию.'
    }
  ]
}
