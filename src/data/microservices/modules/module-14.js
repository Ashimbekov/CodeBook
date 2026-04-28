export default {
  id: 14,
  title: 'Service Mesh: Istio',
  description: 'Service Mesh как инфраструктурный слой: sidecar proxy, traffic management, mTLS, observability. Istio архитектура и конфигурация.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Service Mesh',
      type: 'theory',
      content: [
        { type: 'text', value: 'Service Mesh — инфраструктурный слой, который управляет межсервисной коммуникацией. Вместо реализации retry, circuit breaker, mTLS в каждом сервисе, эти функции выносятся в прокси (sidecar), работающий рядом с каждым сервисом.' },
        { type: 'code', language: 'bash', value: '# Без Service Mesh:\n# Каждый сервис сам реализует:\n# - Retry, Circuit Breaker (Resilience4j)\n# - mTLS (Spring Security)\n# - Load Balancing (Spring Cloud LoadBalancer)\n# - Distributed Tracing (Micrometer Tracing)\n# - Metrics (Micrometer + Prometheus)\n# Проблема: дублирование кода, разные языки = разные библиотеки\n\n# С Service Mesh:\n# [Service A] <-> [Envoy Proxy] <----> [Envoy Proxy] <-> [Service B]\n#                 (sidecar)     mTLS     (sidecar)\n#                    |                      |\n#              retry, CB,              retry, CB,\n#              metrics,                metrics,\n#              tracing                 tracing\n#\n# Service A и B НЕ знают о mesh — Envoy прозрачно перехватывает трафик\n\n# Компоненты Service Mesh:\n# Data Plane:   Envoy proxies (sidecar в каждом Pod)\n# Control Plane: Istiod (конфигурация, сертификаты, маршрутизация)' },
        { type: 'tip', value: 'Service Mesh нужен когда: много сервисов (>20), разные языки, строгие требования к безопасности (mTLS), сложные схемы деплоя (canary, blue-green). Для 5 Java-сервисов Resilience4j + Spring Cloud достаточно.' }
      ]
    },
    {
      id: 2,
      title: 'Istio архитектура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Istio — самый популярный Service Mesh. Состоит из Control Plane (Istiod) и Data Plane (Envoy sidecar proxies). Istiod управляет конфигурацией, сертификатами и маршрутизацией.' },
        { type: 'code', language: 'bash', value: '# Установка Istio\ncurl -L https://istio.io/downloadIstio | sh -\nistioctl install --set profile=demo\n\n# Включить auto sidecar injection для namespace\nkubectl label namespace shop istio-injection=enabled\n\n# После деплоя сервиса в namespace shop:\n# Каждый Pod автоматически получит Envoy sidecar\n# Pod:\n#   container: user-service (наш код)\n#   container: istio-proxy  (Envoy sidecar, инжектирован автоматически)\n\n# Проверка:\nkubectl get pods -n shop\n# NAME                          READY   STATUS\n# user-service-abc123           2/2     Running    # 2/2 = app + sidecar\n# order-service-def456          2/2     Running\n# payment-service-ghi789        2/2     Running\n\n# Компоненты Istiod:\n# Pilot:   конфигурация маршрутизации для Envoy\n# Citadel: управление сертификатами (mTLS)\n# Galley:  валидация конфигурации' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Deployment с Istio sidecar\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: order-service\n  namespace: shop\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: order-service\n      version: v1\n  template:\n    metadata:\n      labels:\n        app: order-service\n        version: v1  # Важно для Istio traffic management\n    spec:\n      containers:\n        - name: order-service\n          image: order-service:1.0.0\n          ports:\n            - containerPort: 8080\n          resources:\n            requests:\n              memory: 256Mi\n              cpu: 250m\n      # Envoy sidecar инжектируется автоматически\n      # Не нужно добавлять вручную!' },
        { type: 'note', value: 'Envoy sidecar добавляет ~10ms latency и ~50MB RAM к каждому Pod. Для высоконагруженных систем это может быть значительным. Альтернатива: Istio Ambient Mesh (без sidecar, через node-level proxy).' }
      ]
    },
    {
      id: 3,
      title: 'Traffic Management',
      type: 'theory',
      content: [
        { type: 'text', value: 'Istio предоставляет мощные инструменты управления трафиком: VirtualService для маршрутизации, DestinationRule для политик, canary deployments, traffic splitting, fault injection.' },
        { type: 'code', language: 'yaml', value: '# VirtualService — маршрутизация трафика\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: order-service\n  namespace: shop\nspec:\n  hosts:\n    - order-service\n  http:\n    # Canary: 90% на v1, 10% на v2\n    - route:\n        - destination:\n            host: order-service\n            subset: v1\n          weight: 90\n        - destination:\n            host: order-service\n            subset: v2\n          weight: 10\n      # Retry policy\n      retries:\n        attempts: 3\n        perTryTimeout: 2s\n        retryOn: 5xx,reset,connect-failure\n      # Timeout\n      timeout: 10s\n\n---\n# DestinationRule — определение subset и политик\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: order-service\n  namespace: shop\nspec:\n  host: order-service\n  trafficPolicy:\n    connectionPool:\n      tcp:\n        maxConnections: 100\n      http:\n        h2UpgradePolicy: DEFAULT\n        http1MaxPendingRequests: 50\n    # Circuit Breaker\n    outlierDetection:\n      consecutive5xxErrors: 5\n      interval: 10s\n      baseEjectionTime: 30s\n      maxEjectionPercent: 50\n  subsets:\n    - name: v1\n      labels:\n        version: v1\n    - name: v2\n      labels:\n        version: v2\n\n---\n# Fault Injection — тестирование устойчивости\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: payment-service-fault\nspec:\n  hosts:\n    - payment-service\n  http:\n    - fault:\n        delay:\n          percentage:\n            value: 10  # 10% запросов получат задержку\n          fixedDelay: 5s\n        abort:\n          percentage:\n            value: 5   # 5% запросов получат ошибку 500\n          httpStatus: 500\n      route:\n        - destination:\n            host: payment-service' },
        { type: 'tip', value: 'Fault Injection — мощный инструмент для тестирования resilience. Добавьте задержку или ошибки к сервису через Istio и проверьте что Circuit Breaker, Retry и Fallback работают корректно в production.' }
      ]
    },
    {
      id: 4,
      title: 'mTLS и безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Istio обеспечивает mutual TLS (mTLS) между всеми сервисами автоматически. Каждый Envoy sidecar получает сертификат от Istiod. Весь трафик внутри mesh зашифрован. Zero-trust networking.' },
        { type: 'code', language: 'yaml', value: '# PeerAuthentication — включение mTLS\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: shop\nspec:\n  mtls:\n    mode: STRICT  # Только mTLS трафик разрешён\n\n---\n# AuthorizationPolicy — авторизация между сервисами\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: order-service-policy\n  namespace: shop\nspec:\n  selector:\n    matchLabels:\n      app: order-service\n  rules:\n    # Разрешить доступ только от API Gateway и admin-service\n    - from:\n        - source:\n            principals:\n              - cluster.local/ns/shop/sa/api-gateway\n              - cluster.local/ns/shop/sa/admin-service\n      to:\n        - operation:\n            methods: [\"GET\", \"POST\", \"PUT\"]\n            paths: [\"/api/v1/orders/*\"]\n\n    # Разрешить health checks от Kubernetes\n    - from:\n        - source:\n            namespaces: [\"kube-system\"]\n      to:\n        - operation:\n            methods: [\"GET\"]\n            paths: [\"/actuator/health/*\"]\n\n---\n# RequestAuthentication — проверка JWT\napiVersion: security.istio.io/v1beta1\nkind: RequestAuthentication\nmetadata:\n  name: jwt-auth\n  namespace: shop\nspec:\n  jwtRules:\n    - issuer: \"https://auth.shop.com\"\n      jwksUri: \"https://auth.shop.com/.well-known/jwks.json\"' },
        { type: 'warning', value: 'При включении STRICT mTLS все клиенты ВНЕ mesh не смогут обращаться к сервисам напрямую. Весь внешний трафик должен проходить через Istio Ingress Gateway. Начинайте с PERMISSIVE mode, затем переходите на STRICT.' }
      ]
    },
    {
      id: 5,
      title: 'Observability с Istio',
      type: 'theory',
      content: [
        { type: 'text', value: 'Istio автоматически собирает метрики, трейсы и логи для всего трафика между сервисами. Интеграция с Prometheus, Grafana, Jaeger, Kiali — из коробки.' },
        { type: 'code', language: 'bash', value: '# Kiali — дашборд для визуализации Service Mesh\nistioctl dashboard kiali\n# Показывает: граф сервисов, трафик, ошибки, латентность\n\n# Grafana — метрики\nistioctl dashboard grafana\n# Дашборды: Istio Mesh, Istio Service, Istio Workload\n\n# Jaeger — Distributed Tracing\nistioctl dashboard jaeger\n# Трейсы всех запросов через mesh\n\n# Prometheus — метрики для алертинга\nistioctl dashboard prometheus\n\n# Автоматические метрики Istio (без изменения кода!):\n# istio_requests_total{source_app="order-service", destination_app="payment-service"}\n# istio_request_duration_milliseconds_bucket{...}\n# istio_request_bytes_sum{...}\n# istio_response_bytes_sum{...}\n\n# Пример PromQL запросов:\n# Requests per second:\n#   rate(istio_requests_total{destination_app="order-service"}[5m])\n\n# Error rate:\n#   rate(istio_requests_total{response_code=~"5.*"}[5m])\n#   / rate(istio_requests_total[5m])\n\n# P99 latency:\n#   histogram_quantile(0.99,\n#     rate(istio_request_duration_milliseconds_bucket[5m]))' },
        { type: 'note', value: 'Kiali — уникальный инструмент Istio, показывающий граф сервисов в реальном времени. Видно кто кого вызывает, с какой частотой, какой процент ошибок. Незаменим для дебага проблем в mesh.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Istio',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте Istio Service Mesh для e-commerce приложения: traffic management, mTLS, canary deployment.',
      requirements: [
        'Установите Istio и включите sidecar injection',
        'Настройте VirtualService с canary: 90/10 для order-service v1/v2',
        'Настройте DestinationRule с Circuit Breaker (outlier detection)',
        'Включите STRICT mTLS между всеми сервисами',
        'Настройте AuthorizationPolicy: order-service доступен только через gateway',
        'Добавьте Fault Injection для тестирования resilience'
      ],
      hint: 'Используйте istioctl install --set profile=demo. Label pods с version: v1/v2. VirtualService weight для canary. PeerAuthentication mode: STRICT для mTLS.',
      expectedOutput: 'Istio установлен, sidecar injection enabled.\norder-service Pods: 2/2 (app + sidecar).\nCanary: 90% трафика -> v1, 10% -> v2.\nmTLS: весь трафик зашифрован (istioctl authn tls-check).\nAuthorization: прямой вызов order-service -> 403 Forbidden.\nFault Injection: 5% запросов к payment-service -> 500.\nKiali: граф сервисов показывает все connections.',
      solution: '# Установка Istio\nistioctl install --set profile=demo\nkubectl label namespace shop istio-injection=enabled\nkubectl rollout restart deployment -n shop\n\n# VirtualService canary\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: order-service\n  namespace: shop\nspec:\n  hosts: [order-service]\n  http:\n    - route:\n        - destination:\n            host: order-service\n            subset: v1\n          weight: 90\n        - destination:\n            host: order-service\n            subset: v2\n          weight: 10\n\n# DestinationRule\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: order-service\nspec:\n  host: order-service\n  trafficPolicy:\n    outlierDetection:\n      consecutive5xxErrors: 3\n      interval: 10s\n      baseEjectionTime: 30s\n  subsets:\n    - name: v1\n      labels: {version: v1}\n    - name: v2\n      labels: {version: v2}\n\n# mTLS\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: shop\nspec:\n  mtls:\n    mode: STRICT',
      explanation: 'Istio Service Mesh выносит инфраструктурные задачи из кода сервисов в sidecar proxy. Traffic management позволяет canary deployments и A/B тестирование без изменения кода. mTLS автоматически шифрует трафик. AuthorizationPolicy обеспечивает zero-trust. Observability даёт полную видимость через Kiali, Grafana, Jaeger.'
    }
  ]
}
