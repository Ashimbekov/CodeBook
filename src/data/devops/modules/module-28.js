export default {
  id: 28,
  title: 'Service Mesh: Istio',
  description: 'Service Mesh решает задачи коммуникации, безопасности и наблюдаемости между микросервисами. Istio — самая популярная реализация.',
  lessons: [
    {
      id: 1,
      title: 'Концепция Service Mesh',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Service Mesh?' },
        { type: 'text', value: 'Service Mesh — это выделенный инфраструктурный слой для управления коммуникацией между сервисами. Он берёт на себя задачи, которые раньше решались в коде каждого сервиса: балансировка нагрузки, шифрование, retry, circuit breaker, трассировка.' },
        { type: 'list', items: [
          'Traffic Management — маршрутизация, балансировка, canary/blue-green деплой',
          'Security — mTLS шифрование, аутентификация, авторизация между сервисами',
          'Observability — метрики, трассировка, логирование для каждого запроса',
          'Resilience — retry, timeout, circuit breaker, rate limiting'
        ] },
        { type: 'heading', value: 'Архитектура Sidecar' },
        { type: 'code', language: 'bash', value: '# Без Service Mesh:\n# Service A ---(HTTP/gRPC)---> Service B\n# Логика retry, TLS, метрики — в коде каждого сервиса\n\n# С Service Mesh (Sidecar pattern):\n# Service A -> [Envoy Proxy] ---(mTLS)---> [Envoy Proxy] -> Service B\n#               sidecar                      sidecar\n#\n# Envoy Proxy (sidecar) перехватывает весь трафик:\n# - Автоматическое mTLS шифрование\n# - Retry, timeout, circuit breaker\n# - Метрики (latency, errors, throughput)\n# - Distributed tracing\n# - Access logging\n\n# Data Plane — Envoy sidecar proxies (обрабатывают трафик)\n# Control Plane — Istiod (настраивает proxies)' },
        { type: 'heading', value: 'Когда нужен Service Mesh?' },
        { type: 'list', items: [
          'Много микросервисов (10+) с активной коммуникацией',
          'Требования к безопасности (mTLS, zero-trust network)',
          'Сложная маршрутизация трафика (canary, A/B testing)',
          'Необходимость наблюдаемости без изменения кода',
          'Compliance требования (аудит трафика между сервисами)'
        ] },
        { type: 'warning', value: 'Service Mesh добавляет сложность и потребляет ресурсы (CPU/RAM для sidecar). Для 3-5 простых сервисов Service Mesh может быть избыточным.' }
      ]
    },
    {
      id: 2,
      title: 'Архитектура Istio',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Компоненты Istio' },
        { type: 'text', value: 'Istio состоит из Control Plane (Istiod) и Data Plane (Envoy sidecar proxies). Istiod управляет конфигурацией, сертификатами и политиками. Envoy proxies обрабатывают весь сетевой трафик между сервисами.' },
        { type: 'code', language: 'bash', value: '# Установка Istio через istioctl\ncurl -L https://istio.io/downloadIstio | sh -\ncd istio-*\nexport PATH=$PWD/bin:$PATH\n\n# Установка с профилем demo (для обучения)\nistioctl install --set profile=demo -y\n\n# Профили:\n# default — production (минимальный набор)\n# demo — все компоненты для обучения\n# minimal — только istiod\n# empty — ничего (для кастомизации)\n\n# Проверка установки\nistioctl verify-install\nkubectl get pods -n istio-system' },
        { type: 'heading', value: 'Включение Sidecar Injection' },
        { type: 'code', language: 'bash', value: '# Автоматический sidecar injection для namespace\nkubectl label namespace default istio-injection=enabled\n\n# Проверка — каждый Pod получит sidecar контейнер\nkubectl get pods\n# NAME                     READY   STATUS    RESTARTS\n# myapp-7d4b8c6f5-x2k9j   2/2     Running   0\n#                          ^^^ 2 контейнера: app + envoy\n\n# Просмотр sidecar конфигурации\nistioctl proxy-config routes myapp-7d4b8c6f5-x2k9j\nistioctl proxy-status\n\n# Отключение для конкретного Pod\n# annotations:\n#   sidecar.istio.io/inject: "false"' },
        { type: 'heading', value: 'Установка дополнений' },
        { type: 'code', language: 'bash', value: '# Установка Kiali (dashboard для Service Mesh)\nkubectl apply -f samples/addons/kiali.yaml\n\n# Установка Jaeger (distributed tracing)\nkubectl apply -f samples/addons/jaeger.yaml\n\n# Установка Prometheus и Grafana\nkubectl apply -f samples/addons/prometheus.yaml\nkubectl apply -f samples/addons/grafana.yaml\n\n# Доступ к Kiali dashboard\nistioctl dashboard kiali\n\n# Доступ к Jaeger\nistioctl dashboard jaeger\n\n# Доступ к Grafana\nistioctl dashboard grafana' },
        { type: 'note', value: 'Kiali предоставляет визуальную карту сервисов с метриками трафика, ошибок и latency. Это главный инструмент для наблюдаемости в Istio.' }
      ]
    },
    {
      id: 3,
      title: 'Управление трафиком',
      type: 'theory',
      content: [
        { type: 'heading', value: 'VirtualService и DestinationRule' },
        { type: 'text', value: 'VirtualService определяет правила маршрутизации трафика. DestinationRule определяет политики для трафика после маршрутизации: балансировка, connection pool, outlier detection.' },
        { type: 'code', language: 'yaml', value: '# VirtualService — маршрутизация трафика\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: myapp\nspec:\n  hosts:\n    - myapp\n  http:\n    - match:\n        - headers:\n            x-canary:\n              exact: "true"\n      route:\n        - destination:\n            host: myapp\n            subset: canary\n    - route:\n        - destination:\n            host: myapp\n            subset: stable\n          weight: 90\n        - destination:\n            host: myapp\n            subset: canary\n          weight: 10' },
        { type: 'code', language: 'yaml', value: '# DestinationRule — определение subsets и политик\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: myapp\nspec:\n  host: myapp\n  trafficPolicy:\n    connectionPool:\n      tcp:\n        maxConnections: 100\n      http:\n        h2UpgradePolicy: DEFAULT\n        http1MaxPendingRequests: 100\n        http2MaxRequests: 1000\n    outlierDetection:\n      consecutive5xxErrors: 5\n      interval: 30s\n      baseEjectionTime: 30s\n      maxEjectionPercent: 50\n  subsets:\n    - name: stable\n      labels:\n        version: v1\n    - name: canary\n      labels:\n        version: v2' },
        { type: 'heading', value: 'Retry и Timeout' },
        { type: 'code', language: 'yaml', value: '# VirtualService с retry и timeout\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: myapp\nspec:\n  hosts:\n    - myapp\n  http:\n    - route:\n        - destination:\n            host: myapp\n      timeout: 10s\n      retries:\n        attempts: 3\n        perTryTimeout: 3s\n        retryOn: 5xx,reset,connect-failure\n      fault:\n        delay:\n          percentage:\n            value: 5\n          fixedDelay: 2s\n        abort:\n          percentage:\n            value: 1\n          httpStatus: 500' },
        { type: 'tip', value: 'Fault injection (delay/abort) позволяет тестировать отказоустойчивость без изменения кода. Inject 500 ошибку в 1% запросов и проверьте, как сервис обрабатывает сбои.' }
      ]
    },
    {
      id: 4,
      title: 'Наблюдаемость с Istio',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Метрики' },
        { type: 'text', value: 'Istio автоматически собирает метрики для каждого запроса без изменения кода приложения. Envoy proxy генерирует метрики о latency, throughput, ошибках для всех сервисов.' },
        { type: 'code', language: 'bash', value: '# Стандартные метрики Istio (Prometheus формат):\n# istio_requests_total — счётчик запросов\n# istio_request_duration_milliseconds — гистограмма latency\n# istio_request_bytes — размер запроса\n# istio_response_bytes — размер ответа\n\n# Пример PromQL запросов:\n# RPS по сервисам:\nsum(rate(istio_requests_total[5m])) by (destination_service_name)\n\n# Error rate:\nsum(rate(istio_requests_total{response_code=~"5.."}[5m])) by (destination_service_name)\n/ sum(rate(istio_requests_total[5m])) by (destination_service_name)\n\n# p99 latency:\nhistogram_quantile(0.99,\n  sum(rate(istio_request_duration_milliseconds_bucket[5m]))\n  by (le, destination_service_name)\n)' },
        { type: 'heading', value: 'Distributed Tracing' },
        { type: 'code', language: 'yaml', value: '# Telemetry API — настройка трассировки\napiVersion: telemetry.istio.io/v1alpha1\nkind: Telemetry\nmetadata:\n  name: mesh-default\n  namespace: istio-system\nspec:\n  tracing:\n    - providers:\n        - name: jaeger\n      randomSamplingPercentage: 10  # 10% запросов' },
        { type: 'code', language: 'bash', value: '# Для работы tracing приложение должно пробрасывать заголовки:\n# x-request-id\n# x-b3-traceid\n# x-b3-spanid\n# x-b3-parentspanid\n# x-b3-sampled\n# x-b3-flags\n# b3\n# traceparent\n# tracestate\n\n# Пример в Python (Flask):\n# TRACE_HEADERS = [\n#     "x-request-id", "x-b3-traceid", "x-b3-spanid",\n#     "x-b3-parentspanid", "x-b3-sampled", "x-b3-flags",\n#     "traceparent", "tracestate"\n# ]\n# headers = {h: request.headers.get(h) for h in TRACE_HEADERS if request.headers.get(h)}\n# requests.get("http://service-b/api", headers=headers)' },
        { type: 'heading', value: 'Access Logging' },
        { type: 'code', language: 'yaml', value: '# Включение access log для всех sidecar\napiVersion: telemetry.istio.io/v1alpha1\nkind: Telemetry\nmetadata:\n  name: mesh-default\n  namespace: istio-system\nspec:\n  accessLogging:\n    - providers:\n        - name: envoy\n      filter:\n        expression: "response.code >= 400"  # Только ошибки' },
        { type: 'note', value: 'Istio обеспечивает наблюдаемость без изменения кода (кроме проброса trace headers). Метрики, трейсы и логи собираются автоматически для всех сервисов в mesh.' }
      ]
    },
    {
      id: 5,
      title: 'mTLS и безопасность',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Mutual TLS (mTLS)' },
        { type: 'text', value: 'mTLS шифрует весь трафик между сервисами и обеспечивает взаимную аутентификацию. Istio автоматически управляет сертификатами через встроенный CA (Certificate Authority).' },
        { type: 'code', language: 'yaml', value: '# PeerAuthentication — политика mTLS\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: istio-system  # Для всего mesh\nspec:\n  mtls:\n    mode: STRICT  # Весь трафик должен быть mTLS\n\n---\n# Режимы mTLS:\n# STRICT — только mTLS (без plaintext)\n# PERMISSIVE — mTLS + plaintext (для миграции)\n# DISABLE — без mTLS\n\n# PeerAuthentication для конкретного сервиса\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: myapp-mtls\n  namespace: production\nspec:\n  selector:\n    matchLabels:\n      app: myapp\n  mtls:\n    mode: STRICT' },
        { type: 'heading', value: 'Authorization Policy' },
        { type: 'code', language: 'yaml', value: '# AuthorizationPolicy — контроль доступа между сервисами\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: allow-frontend-to-backend\n  namespace: production\nspec:\n  selector:\n    matchLabels:\n      app: backend-api\n  action: ALLOW\n  rules:\n    - from:\n        - source:\n            principals:\n              - "cluster.local/ns/production/sa/frontend"\n      to:\n        - operation:\n            methods: [\"GET\", \"POST\"]\n            paths: [\"/api/*\"]\n\n---\n# Запрет всего трафика по умолчанию (zero-trust)\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: deny-all\n  namespace: production\nspec:\n  {}  # Пустой spec = deny all' },
        { type: 'heading', value: 'RequestAuthentication (JWT)' },
        { type: 'code', language: 'yaml', value: '# JWT валидация на ingress gateway\napiVersion: security.istio.io/v1beta1\nkind: RequestAuthentication\nmetadata:\n  name: jwt-auth\n  namespace: istio-system\nspec:\n  selector:\n    matchLabels:\n      istio: ingressgateway\n  jwtRules:\n    - issuer: "https://auth.company.com"\n      jwksUri: "https://auth.company.com/.well-known/jwks.json"\n      forwardOriginalToken: true\n\n---\n# AuthorizationPolicy для JWT\napiVersion: security.istio.io/v1beta1\nkind: AuthorizationPolicy\nmetadata:\n  name: require-jwt\n  namespace: production\nspec:\n  action: ALLOW\n  rules:\n    - from:\n        - source:\n            requestPrincipals: [\"https://auth.company.com/*\"]\n      when:\n        - key: request.auth.claims[role]\n          values: [\"admin\", \"user\"]' },
        { type: 'tip', value: 'Начинайте с mode: PERMISSIVE для mTLS, чтобы не сломать существующие сервисы. После проверки, что все сервисы поддерживают mTLS, переключайтесь на STRICT.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Istio',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте Istio Service Mesh с управлением трафиком (canary deployment), mTLS и наблюдаемостью для двух микросервисов.',
      requirements: [
        'Установите Istio с профилем demo',
        'Разверните два сервиса (frontend и backend) с sidecar injection',
        'Настройте VirtualService для canary deployment (90/10 split)',
        'Включите STRICT mTLS для namespace',
        'Создайте AuthorizationPolicy: только frontend может обращаться к backend',
        'Настройте retry (3 попытки) и timeout (5s) для backend'
      ],
      hint: 'Сначала istioctl install --set profile=demo, затем label namespace, деплой сервисов, VirtualService/DestinationRule, PeerAuthentication, AuthorizationPolicy.',
      expectedOutput: 'istioctl verify-install => Istio is installed and verified\nkubectl get pods => все pods 2/2 Running (app + sidecar)\nТрафик: 90% -> v1, 10% -> v2\nmTLS: STRICT для namespace production\nAuthPolicy: только frontend -> backend разрешён',
      solution: '# 1. Установка\nistioctl install --set profile=demo -y\nkubectl label namespace production istio-injection=enabled\n\n# 2. VirtualService для canary\n# apiVersion: networking.istio.io/v1beta1\n# kind: VirtualService\n# metadata:\n#   name: backend\n# spec:\n#   hosts: [backend]\n#   http:\n#     - route:\n#         - destination:\n#             host: backend\n#             subset: stable\n#           weight: 90\n#         - destination:\n#             host: backend\n#             subset: canary\n#           weight: 10\n#       retries:\n#         attempts: 3\n#         perTryTimeout: 3s\n#       timeout: 5s\n\n# 3. DestinationRule\n# apiVersion: networking.istio.io/v1beta1\n# kind: DestinationRule\n# metadata:\n#   name: backend\n# spec:\n#   host: backend\n#   subsets:\n#     - name: stable\n#       labels: { version: v1 }\n#     - name: canary\n#       labels: { version: v2 }\n\n# 4. mTLS\n# apiVersion: security.istio.io/v1beta1\n# kind: PeerAuthentication\n# metadata:\n#   name: default\n#   namespace: production\n# spec:\n#   mtls: { mode: STRICT }\n\n# 5. AuthorizationPolicy\n# apiVersion: security.istio.io/v1beta1\n# kind: AuthorizationPolicy\n# metadata:\n#   name: backend-policy\n# spec:\n#   selector: { matchLabels: { app: backend } }\n#   rules:\n#     - from:\n#         - source:\n#             principals: [\"cluster.local/ns/production/sa/frontend\"]',
      explanation: 'Istio Service Mesh берёт на себя сетевые задачи: mTLS шифрует трафик между сервисами, VirtualService управляет маршрутизацией (canary 90/10), AuthorizationPolicy реализует zero-trust (только разрешённые сервисы могут общаться). Всё это без изменения кода приложений.'
    }
  ]
}
