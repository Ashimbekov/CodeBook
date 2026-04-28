export default {
  id: 37,
  title: 'API Gateway: Kong и NGINX',
  description: 'API Gateway управляет трафиком к микросервисам: маршрутизация, аутентификация, rate limiting, мониторинг. Kong и NGINX Ingress.',
  lessons: [
    {
      id: 1,
      title: 'API Gateway паттерны',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем нужен API Gateway?' },
        { type: 'text', value: 'API Gateway — это единая точка входа для всех клиентских запросов к микросервисам. Он берёт на себя cross-cutting concerns: аутентификацию, rate limiting, логирование, трансформацию запросов, SSL termination.' },
        { type: 'code', language: 'bash', value: '# Без API Gateway:\n# Client -> User Service     (auth, rate-limit, logging)\n# Client -> Order Service    (auth, rate-limit, logging)\n# Client -> Payment Service  (auth, rate-limit, logging)\n# Каждый сервис реализует cross-cutting concerns\n\n# С API Gateway:\n# Client -> [API Gateway] -> User Service\n#                         -> Order Service\n#                         -> Payment Service\n# Gateway централизует: auth, rate-limit, logging, SSL, CORS' },
        { type: 'list', items: [
          'Routing — маршрутизация запросов к нужному сервису',
          'Authentication — проверка JWT, API keys, OAuth2',
          'Rate Limiting — ограничение количества запросов',
          'Load Balancing — распределение нагрузки между инстансами',
          'Caching — кэширование ответов для снижения нагрузки',
          'Transformation — изменение запросов/ответов (headers, body)',
          'Monitoring — метрики, логирование, трассировка'
        ] },
        { type: 'heading', value: 'Популярные API Gateway' },
        { type: 'code', language: 'bash', value: '# Open-source:\n# Kong        — построен на NGINX/OpenResty, plugin-архитектура\n# APISIX      — построен на NGINX/OpenResty, облачный\n# Traefik     — Go, автоматический service discovery\n# Envoy       — C++, высокая производительность, gRPC\n\n# Cloud-managed:\n# AWS API Gateway  — serverless, Lambda integration\n# Azure API Management — enterprise features\n# GCP API Gateway  — serverless, Cloud Run integration\n\n# Kubernetes-native:\n# NGINX Ingress Controller\n# Kong Ingress Controller\n# Traefik Ingress Controller\n# Istio Gateway (если используется Service Mesh)' },
        { type: 'tip', value: 'Для Kubernetes-native подхода используйте Ingress Controller (NGINX/Kong). Для enterprise API management с developer portal — Kong Enterprise или AWS API Gateway.' }
      ]
    },
    {
      id: 2,
      title: 'Kong: установка и настройка',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Установка Kong в Kubernetes' },
        { type: 'text', value: 'Kong — популярный open-source API Gateway, построенный на NGINX и OpenResty (Lua). Поддерживает DB-less режим (декларативная конфигурация) и DB-mode (PostgreSQL для хранения конфигурации).' },
        { type: 'code', language: 'bash', value: '# Установка Kong через Helm (DB-less mode)\nhelm repo add kong https://charts.konghq.com\nhelm install kong kong/kong \\\n  --namespace kong \\\n  --create-namespace \\\n  --set ingressController.installCRDs=false \\\n  --set proxy.type=LoadBalancer\n\n# С Kong Ingress Controller для Kubernetes\nhelm install kong kong/ingress \\\n  --namespace kong \\\n  --create-namespace' },
        { type: 'heading', value: 'Декларативная конфигурация' },
        { type: 'code', language: 'yaml', value: '# kong.yaml — декларативная конфигурация\n_format_version: \"3.0\"\n\nservices:\n  - name: user-service\n    url: http://user-service.production:8080\n    routes:\n      - name: user-api\n        paths:\n          - /api/users\n        strip_path: false\n        methods:\n          - GET\n          - POST\n          - PUT\n\n  - name: order-service\n    url: http://order-service.production:8080\n    routes:\n      - name: order-api\n        paths:\n          - /api/orders\n        strip_path: false\n\n  - name: payment-service\n    url: http://payment-service.production:8080\n    routes:\n      - name: payment-api\n        paths:\n          - /api/payments\n        strip_path: false\n        methods:\n          - POST' },
        { type: 'heading', value: 'Kong с Kubernetes CRDs' },
        { type: 'code', language: 'yaml', value: '# KongIngress + Ingress для маршрутизации\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: api-routes\n  annotations:\n    konghq.com/strip-path: \"false\"\nspec:\n  ingressClassName: kong\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /api/users\n            pathType: Prefix\n            backend:\n              service:\n                name: user-service\n                port:\n                  number: 8080\n          - path: /api/orders\n            pathType: Prefix\n            backend:\n              service:\n                name: order-service\n                port:\n                  number: 8080\n          - path: /api/payments\n            pathType: Prefix\n            backend:\n              service:\n                name: payment-service\n                port:\n                  number: 8080' },
        { type: 'note', value: 'DB-less mode рекомендуется для Kubernetes. Конфигурация хранится в ConfigMap или CRDs, что соответствует GitOps подходу. DB mode нужен для Kong Manager UI и Admin API.' }
      ]
    },
    {
      id: 3,
      title: 'Kong Plugins: Auth и Rate Limiting',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Аутентификация через Kong' },
        { type: 'text', value: 'Kong Plugins добавляют функциональность без изменения кода сервисов. Плагины применяются глобально, на сервис, на route или на consumer. Аутентификация — самый важный plugin.' },
        { type: 'code', language: 'yaml', value: '# JWT Plugin через Kubernetes CRD\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: jwt-auth\nplugin: jwt\nconfig:\n  key_claim_name: iss\n  claims_to_verify:\n    - exp\n  header_names:\n    - Authorization\n\n---\n# Применить к Ingress\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: protected-api\n  annotations:\n    konghq.com/plugins: jwt-auth\nspec:\n  ingressClassName: kong\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /api/orders\n            pathType: Prefix\n            backend:\n              service:\n                name: order-service\n                port:\n                  number: 8080' },
        { type: 'heading', value: 'Rate Limiting' },
        { type: 'code', language: 'yaml', value: '# Rate Limiting Plugin\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: rate-limit\nplugin: rate-limiting\nconfig:\n  minute: 100            # 100 запросов в минуту\n  hour: 5000             # 5000 в час\n  policy: redis           # redis для distributed rate-limiting\n  redis_host: redis.production\n  redis_port: 6379\n  redis_database: 0\n  fault_tolerant: true    # продолжать работу если Redis недоступен\n  hide_client_headers: false  # показывать X-RateLimit headers\n\n---\n# API Key Authentication\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: api-key-auth\nplugin: key-auth\nconfig:\n  key_names:\n    - X-API-Key\n    - apikey\n  hide_credentials: true  # не передавать API key в upstream' },
        { type: 'heading', value: 'Другие полезные плагины' },
        { type: 'code', language: 'yaml', value: '# CORS Plugin\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: cors\nplugin: cors\nconfig:\n  origins: [\"https://app.company.com\"]\n  methods: [\"GET\", \"POST\", \"PUT\", \"DELETE\"]\n  headers: [\"Authorization\", \"Content-Type\"]\n  max_age: 3600\n\n---\n# Request Transformer\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: add-headers\nplugin: request-transformer\nconfig:\n  add:\n    headers:\n      - \"X-Request-ID:$(uuid)\"\n      - \"X-Gateway:kong\"\n\n---\n# Response Caching\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: cache\nplugin: proxy-cache\nconfig:\n  response_code: [200]\n  request_method: [\"GET\"]\n  content_type: [\"application/json\"]\n  cache_ttl: 300\n  strategy: memory' },
        { type: 'tip', value: 'Применяйте plugins через аннотации: konghq.com/plugins: "jwt-auth, rate-limit, cors". Несколько plugins можно комбинировать на одном route.' }
      ]
    },
    {
      id: 4,
      title: 'NGINX Ingress: продвинутый',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Продвинутые настройки NGINX Ingress' },
        { type: 'text', value: 'NGINX Ingress Controller — самый популярный Ingress Controller для Kubernetes. Аннотации позволяют настраивать SSL, rate limiting, rewrites, canary deployments и другие функции без изменения кода NGINX.' },
        { type: 'code', language: 'yaml', value: '# Ingress с продвинутыми аннотациями\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-ingress\n  annotations:\n    # SSL redirect\n    nginx.ingress.kubernetes.io/ssl-redirect: \"true\"\n    nginx.ingress.kubernetes.io/force-ssl-redirect: \"true\"\n\n    # Rate limiting\n    nginx.ingress.kubernetes.io/limit-rps: \"50\"\n    nginx.ingress.kubernetes.io/limit-rpm: \"1000\"\n    nginx.ingress.kubernetes.io/limit-connections: \"10\"\n\n    # Timeouts\n    nginx.ingress.kubernetes.io/proxy-connect-timeout: \"10\"\n    nginx.ingress.kubernetes.io/proxy-read-timeout: \"60\"\n    nginx.ingress.kubernetes.io/proxy-send-timeout: \"60\"\n\n    # Body size\n    nginx.ingress.kubernetes.io/proxy-body-size: \"50m\"\n\n    # CORS\n    nginx.ingress.kubernetes.io/enable-cors: \"true\"\n    nginx.ingress.kubernetes.io/cors-allow-origin: \"https://app.company.com\"\n    nginx.ingress.kubernetes.io/cors-allow-methods: \"GET, POST, PUT, DELETE\"\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts: [\"api.company.com\"]\n      secretName: api-tls\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: myapp\n                port:\n                  number: 80' },
        { type: 'heading', value: 'Canary Deployments через NGINX Ingress' },
        { type: 'code', language: 'yaml', value: '# Production Ingress (stable)\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-stable\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: myapp-stable\n                port:\n                  number: 80\n\n---\n# Canary Ingress (10% трафика)\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-canary\n  annotations:\n    nginx.ingress.kubernetes.io/canary: \"true\"\n    nginx.ingress.kubernetes.io/canary-weight: \"10\"  # 10% трафика\n    # Или по header:\n    # nginx.ingress.kubernetes.io/canary-by-header: \"X-Canary\"\n    # nginx.ingress.kubernetes.io/canary-by-header-value: \"true\"\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: myapp-canary\n                port:\n                  number: 80' },
        { type: 'heading', value: 'Custom NGINX конфигурация' },
        { type: 'code', language: 'yaml', value: '# ConfigMap для глобальной конфигурации NGINX\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: nginx-configuration\n  namespace: ingress-nginx\ndata:\n  proxy-buffer-size: \"16k\"\n  proxy-buffers-number: \"4\"\n  use-gzip: \"true\"\n  gzip-types: \"application/json application/javascript text/css text/plain\"\n  log-format-upstream: \'$remote_addr - $request_id [$time_local] \"$request\" $status $body_bytes_sent \"$http_referer\" \"$http_user_agent\" rt=$request_time\'\n  enable-modsecurity: \"true\"\n  enable-owasp-modsecurity-crs: \"true\"' },
        { type: 'note', value: 'Canary через NGINX Ingress позволяет направлять процент трафика на новую версию. Увеличивайте вес постепенно: 5% -> 25% -> 50% -> 100%. Мониторьте error rate на каждом шаге.' }
      ]
    },
    {
      id: 5,
      title: 'Traffic Management',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Продвинутое управление трафиком' },
        { type: 'text', value: 'API Gateway предоставляет мощные возможности управления трафиком: circuit breaker, retry, timeout, load balancing algorithms, request/response transformation.' },
        { type: 'code', language: 'yaml', value: '# Kong Circuit Breaker\napiVersion: configuration.konghq.com/v1\nkind: KongPlugin\nmetadata:\n  name: circuit-breaker\nplugin: circuit-breaker\nconfig:\n  threshold: 5              # порог ошибок\n  window_size: 60           # окно в секундах\n  wait_duration: 30         # время ожидания перед retry\n  error_status_code: 503\n\n---\n# Kong Retry/Timeout\napiVersion: configuration.konghq.com/v1\nkind: KongIngress\nmetadata:\n  name: upstream-settings\nproxy:\n  connect_timeout: 5000     # 5 секунд\n  read_timeout: 30000       # 30 секунд\n  write_timeout: 30000\n  retries: 3\nupstream:\n  algorithm: round-robin    # или: consistent-hashing, least-connections\n  healthchecks:\n    active:\n      healthy:\n        interval: 10\n        successes: 3\n      unhealthy:\n        interval: 5\n        http_failures: 3\n      http_path: /health\n      timeout: 5' },
        { type: 'heading', value: 'Мониторинг API Gateway' },
        { type: 'code', language: 'yaml', value: '# Kong Prometheus Plugin — метрики\napiVersion: configuration.konghq.com/v1\nkind: KongClusterPlugin\nmetadata:\n  name: prometheus\n  labels:\n    global: \"true\"  # применить ко всем routes\nplugin: prometheus\nconfig:\n  per_consumer: true\n  status_code_metrics: true\n  latency_metrics: true\n  bandwidth_metrics: true' },
        { type: 'code', language: 'bash', value: '# Ключевые метрики API Gateway:\n\n# Request rate по routes\nsum(rate(kong_http_requests_total[5m])) by (route)\n\n# Error rate по сервисам\nsum(rate(kong_http_requests_total{code=~\"5..\"}[5m])) by (service)\n/ sum(rate(kong_http_requests_total[5m])) by (service)\n\n# Latency p99\nhistogram_quantile(0.99, sum(rate(kong_request_latency_ms_bucket[5m])) by (le, route))\n\n# Rate limiting hits\nsum(rate(kong_http_requests_total{code=\"429\"}[5m])) by (route)\n\n# Upstream health\nkong_upstream_target_health{state=\"healthy\"}' },
        { type: 'tip', value: 'Включайте Prometheus plugin глобально через KongClusterPlugin. Это обеспечит метрики для всех routes без ручной настройки каждого. Создайте Grafana dashboard для визуализации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка API Gateway',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Kong API Gateway для трёх микросервисов с аутентификацией, rate limiting, canary deployment и мониторингом.',
      requirements: [
        'Установите Kong Ingress Controller в Kubernetes',
        'Настройте маршрутизацию к 3 сервисам через Ingress',
        'Добавьте JWT аутентификацию для /api/orders и /api/payments',
        'Настройте rate limiting: 100 req/min для /api/users',
        'Реализуйте canary deployment (10% трафика на v2) для user-service',
        'Включите Prometheus plugin и создайте алерт на error rate > 1%'
      ],
      hint: 'Установите Kong через Helm, создайте Ingress с аннотациями konghq.com/plugins для привязки KongPlugin ресурсов. Canary через отдельный Ingress с canary-weight.',
      expectedOutput: 'curl -H "Authorization: Bearer valid-jwt" api.company.com/api/orders => 200\ncurl api.company.com/api/orders => 401 Unauthorized\ncurl api.company.com/api/users (101 раз) => 429 Rate Limited\nTraffic split: 90% v1, 10% v2 (видно в метриках)\nPrometheus: kong_http_requests_total метрики доступны',
      solution: '# 1. Установка Kong\nhelm install kong kong/ingress -n kong --create-namespace\n\n# 2. Маршрутизация (Ingress)\n# spec.rules[].http.paths для /api/users, /api/orders, /api/payments\n\n# 3. JWT Plugin\n# apiVersion: configuration.konghq.com/v1\n# kind: KongPlugin\n# metadata:\n#   name: jwt-auth\n# plugin: jwt\n# Применить: konghq.com/plugins: jwt-auth на Ingress\n\n# 4. Rate Limiting Plugin\n# kind: KongPlugin\n# plugin: rate-limiting\n# config:\n#   minute: 100\n#   policy: local\n\n# 5. Canary Ingress\n# annotations:\n#   nginx.ingress.kubernetes.io/canary: "true"\n#   nginx.ingress.kubernetes.io/canary-weight: "10"\n\n# 6. Prometheus Plugin (global)\n# kind: KongClusterPlugin\n# plugin: prometheus',
      explanation: 'API Gateway (Kong) централизует cross-cutting concerns: JWT аутентификация проверяет токены до передачи запроса в сервис, rate limiting защищает от перегрузки, canary позволяет постепенно выкатывать новые версии. Prometheus plugin обеспечивает наблюдаемость всего API трафика.'
    }
  ]
}
