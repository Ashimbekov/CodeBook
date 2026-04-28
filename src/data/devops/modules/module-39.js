export default {
  id: 39,
  title: 'Load Balancing и CDN',
  description: 'Балансировка нагрузки распределяет трафик между серверами. CDN ускоряет доставку контента пользователям по всему миру.',
  lessons: [
    {
      id: 1,
      title: 'Алгоритмы балансировки',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Алгоритмы Load Balancing' },
        { type: 'text', value: 'Load Balancer распределяет входящий трафик между несколькими серверами для повышения доступности и производительности. Выбор алгоритма зависит от характера нагрузки и требований приложения.' },
        { type: 'list', items: [
          'Round Robin — запросы по очереди каждому серверу (самый простой)',
          'Weighted Round Robin — серверы с весами (мощный сервер получает больше)',
          'Least Connections — запрос к серверу с наименьшим числом активных соединений',
          'IP Hash — клиент всегда попадает на один сервер (session affinity)',
          'Least Response Time — запрос к самому быстрому серверу',
          'Random — случайный выбор (хорошо при большом числе серверов)'
        ] },
        { type: 'heading', value: 'Уровни балансировки' },
        { type: 'code', language: 'bash', value: '# L4 (Transport Layer) — TCP/UDP\n# + Быстрый, низкий overhead\n# + Не анализирует содержимое (payload)\n# - Не может маршрутизировать по URL/headers\n# Примеры: AWS NLB, HAProxy (TCP mode)\n\n# L7 (Application Layer) — HTTP/HTTPS\n# + Маршрутизация по URL, headers, cookies\n# + SSL termination\n# + Content-based routing\n# - Выше latency (анализ HTTP)\n# Примеры: AWS ALB, NGINX, HAProxy (HTTP mode)\n\n# DNS-based Load Balancing\n# + Глобальная балансировка между регионами\n# + Не требует единой точки входа\n# - Зависит от TTL DNS записей\n# - Нет health checks на уровне запроса\n# Примеры: Route 53, CloudFlare, Cloud DNS' },
        { type: 'heading', value: 'Типы балансировщиков' },
        { type: 'code', language: 'bash', value: '# Software Load Balancers:\n# NGINX        — HTTP/TCP/UDP, самый популярный\n# HAProxy      — HTTP/TCP, очень высокая производительность\n# Envoy        — HTTP/gRPC, cloud-native\n# Traefik      — HTTP, автоматический service discovery\n\n# Cloud Load Balancers:\n# AWS ALB     — Layer 7, HTTP/HTTPS/gRPC\n# AWS NLB     — Layer 4, TCP/UDP, ultra-low latency\n# AWS CLB     — Classic (устаревший)\n# GCP LB      — Global HTTP(S), TCP/SSL, Network\n# Azure LB    — Layer 4, Standard/Basic' },
        { type: 'tip', value: 'Для веб-приложений используйте L7 (ALB/NGINX). Для TCP-сервисов (БД, Redis) — L4 (NLB/HAProxy TCP). Для глобальной балансировки между регионами — DNS + Anycast.' }
      ]
    },
    {
      id: 2,
      title: 'HAProxy',
      type: 'theory',
      content: [
        { type: 'heading', value: 'HAProxy — высокопроизводительный балансировщик' },
        { type: 'text', value: 'HAProxy — open-source load balancer и reverse proxy. Используется в production крупнейшими компаниями (GitHub, Stack Overflow, Reddit). Поддерживает L4 и L7 балансировку с встроенными health checks.' },
        { type: 'code', language: 'bash', value: '# /etc/haproxy/haproxy.cfg\n# global\n#     daemon\n#     maxconn 50000\n#     log stdout format raw local0\n#     stats socket /var/run/haproxy.sock mode 660 level admin\n#\n# defaults\n#     mode http\n#     timeout connect 5s\n#     timeout client 30s\n#     timeout server 30s\n#     option httplog\n#     option dontlognull\n#     option forwardfor\n#     retries 3\n#\n# frontend http-in\n#     bind *:80\n#     bind *:443 ssl crt /etc/ssl/certs/cert.pem\n#     redirect scheme https if !{ ssl_fc }\n#\n#     # Маршрутизация по URL\n#     acl is_api path_beg /api\n#     acl is_static path_beg /static\n#\n#     use_backend api-servers if is_api\n#     use_backend static-servers if is_static\n#     default_backend web-servers\n#\n# backend web-servers\n#     balance roundrobin\n#     option httpchk GET /health\n#     http-check expect status 200\n#     server web1 10.0.1.10:8080 check inter 5s fall 3 rise 2\n#     server web2 10.0.1.11:8080 check inter 5s fall 3 rise 2\n#     server web3 10.0.1.12:8080 check inter 5s fall 3 rise 2\n#\n# backend api-servers\n#     balance leastconn\n#     option httpchk GET /api/health\n#     server api1 10.0.2.10:3000 check weight 3\n#     server api2 10.0.2.11:3000 check weight 2\n#     server api3 10.0.2.12:3000 check weight 1\n#\n# listen stats\n#     bind *:8404\n#     stats enable\n#     stats uri /stats\n#     stats refresh 10s' },
        { type: 'heading', value: 'HAProxy в Kubernetes' },
        { type: 'code', language: 'yaml', value: '# HAProxy как Kubernetes Deployment\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: haproxy\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: haproxy\n  template:\n    metadata:\n      labels:\n        app: haproxy\n    spec:\n      containers:\n        - name: haproxy\n          image: haproxy:2.9-alpine\n          ports:\n            - containerPort: 80\n            - containerPort: 443\n            - containerPort: 8404\n          volumeMounts:\n            - name: config\n              mountPath: /usr/local/etc/haproxy/haproxy.cfg\n              subPath: haproxy.cfg\n          livenessProbe:\n            httpGet:\n              path: /stats\n              port: 8404\n      volumes:\n        - name: config\n          configMap:\n            name: haproxy-config' },
        { type: 'note', value: 'HAProxy stats page (порт 8404) показывает в реальном времени: количество соединений, throughput, health status серверов, ошибки. Включайте её для мониторинга.' }
      ]
    },
    {
      id: 3,
      title: 'AWS ALB и NLB',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Application Load Balancer (ALB)' },
        { type: 'text', value: 'AWS ALB работает на Layer 7 (HTTP/HTTPS) и предоставляет продвинутую маршрутизацию по URL path, host, headers, query strings. Интеграция с WAF, Cognito, и EKS через AWS Load Balancer Controller.' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Ingress с AWS ALB\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-ingress\n  annotations:\n    kubernetes.io/ingress.class: alb\n    alb.ingress.kubernetes.io/scheme: internet-facing\n    alb.ingress.kubernetes.io/target-type: ip\n    alb.ingress.kubernetes.io/listen-ports: \'[{\"HTTPS\":443}]\'\n    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:123456:certificate/xxx\n    alb.ingress.kubernetes.io/healthcheck-path: /health\n    alb.ingress.kubernetes.io/healthcheck-interval-seconds: \"15\"\n    alb.ingress.kubernetes.io/success-codes: \"200\"\n    alb.ingress.kubernetes.io/wafv2-acl-arn: arn:aws:wafv2:...\nspec:\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /api/v1\n            pathType: Prefix\n            backend:\n              service:\n                name: api-v1\n                port:\n                  number: 80\n          - path: /api/v2\n            pathType: Prefix\n            backend:\n              service:\n                name: api-v2\n                port:\n                  number: 80' },
        { type: 'heading', value: 'Network Load Balancer (NLB)' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Service с AWS NLB\napiVersion: v1\nkind: Service\nmetadata:\n  name: myapp-nlb\n  annotations:\n    service.beta.kubernetes.io/aws-load-balancer-type: external\n    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip\n    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing\n    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: \"true\"\n    service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: HTTP\n    service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /health\nspec:\n  type: LoadBalancer\n  selector:\n    app: myapp\n  ports:\n    - port: 443\n      targetPort: 8080\n      protocol: TCP' },
        { type: 'code', language: 'bash', value: '# ALB vs NLB:\n# ALB (Layer 7):\n# + URL/Host/Header routing\n# + WebSocket support\n# + WAF integration\n# + Authentication (Cognito, OIDC)\n# - Выше latency (~1-5ms)\n# Стоимость: ~$20/мес + $0.008/LCU-час\n\n# NLB (Layer 4):\n# + Ultra-low latency (<100us)\n# + Миллионы запросов/сек\n# + Static IP / Elastic IP\n# + TCP/UDP/TLS passthrough\n# - Нет content-based routing\n# Стоимость: ~$20/мес + $0.006/NLCU-час' },
        { type: 'tip', value: 'Для Kubernetes в AWS используйте AWS Load Balancer Controller. Он автоматически создаёт ALB для Ingress и NLB для Service type LoadBalancer с аннотациями.' }
      ]
    },
    {
      id: 4,
      title: 'CDN: Content Delivery Network',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Как работает CDN' },
        { type: 'text', value: 'CDN — глобальная сеть серверов (edge locations), кэширующих контент ближе к пользователям. CDN ускоряет загрузку статического контента (изображения, CSS, JS), снижает нагрузку на origin-сервер и защищает от DDoS.' },
        { type: 'code', language: 'bash', value: '# Без CDN:\n# User (Tokyo) -> Origin Server (US-East) = ~200ms latency\n\n# С CDN:\n# User (Tokyo) -> CDN Edge (Tokyo) = ~20ms latency\n#                 (кэш) или\n# User (Tokyo) -> CDN Edge (Tokyo) -> Origin (US-East)\n#                 (cache miss, первый запрос)\n\n# CDN провайдеры:\n# CloudFront (AWS)  — интеграция с S3, ALB, Lambda@Edge\n# Cloudflare        — бесплатный tier, DDoS защита, Workers\n# Fastly            — Varnish-based, VCL конфигурация\n# Akamai            — enterprise, самая большая сеть' },
        { type: 'heading', value: 'AWS CloudFront' },
        { type: 'code', language: 'bash', value: '# Создание CloudFront Distribution через CLI\naws cloudfront create-distribution \\\n  --distribution-config \'{\n    "CallerReference": "my-dist-2024",\n    "Origins": {\n      "Quantity": 1,\n      "Items": [{\n        "Id": "S3-my-bucket",\n        "DomainName": "my-bucket.s3.amazonaws.com",\n        "S3OriginConfig": {\n          "OriginAccessIdentity": ""\n        }\n      }]\n    },\n    "DefaultCacheBehavior": {\n      "TargetOriginId": "S3-my-bucket",\n      "ViewerProtocolPolicy": "redirect-to-https",\n      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",\n      "Compress": true,\n      "AllowedMethods": {\n        "Quantity": 2,\n        "Items": ["GET", "HEAD"]\n      }\n    },\n    "Enabled": true,\n    "Comment": "My CDN Distribution"\n  }\'' },
        { type: 'heading', value: 'Terraform конфигурация CloudFront' },
        { type: 'code', language: 'bash', value: '# resource "aws_cloudfront_distribution" "cdn" {\n#   enabled = true\n#\n#   origin {\n#     domain_name = aws_s3_bucket.static.bucket_regional_domain_name\n#     origin_id   = "S3-static"\n#\n#     s3_origin_config {\n#       origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path\n#     }\n#   }\n#\n#   origin {\n#     domain_name = "api.company.com"\n#     origin_id   = "API"\n#\n#     custom_origin_config {\n#       http_port              = 80\n#       https_port             = 443\n#       origin_protocol_policy = "https-only"\n#       origin_ssl_protocols   = ["TLSv1.2"]\n#     }\n#   }\n#\n#   default_cache_behavior {\n#     target_origin_id       = "S3-static"\n#     viewer_protocol_policy = "redirect-to-https"\n#     cached_methods         = ["GET", "HEAD"]\n#     allowed_methods        = ["GET", "HEAD"]\n#     compress               = true\n#     default_ttl            = 86400   # 1 день\n#     max_ttl                = 604800  # 7 дней\n#   }\n#\n#   ordered_cache_behavior {\n#     path_pattern           = "/api/*"\n#     target_origin_id       = "API"\n#     viewer_protocol_policy = "https-only"\n#     cached_methods         = ["GET", "HEAD"]\n#     allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]\n#     default_ttl            = 0  # Не кэшировать API\n#   }\n# }' },
        { type: 'note', value: 'Cache invalidation — самая сложная часть CDN. Используйте versioned URLs (style.v2.css) вместо invalidation. Если нужна инвалидация: aws cloudfront create-invalidation --paths "/*".' }
      ]
    },
    {
      id: 5,
      title: 'Health Checks',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Health Checks для балансировки' },
        { type: 'text', value: 'Health checks позволяют балансировщику определять работоспособность серверов и направлять трафик только на здоровые инстансы. Типы: TCP (порт открыт), HTTP (возвращает 200), custom (сложная проверка).' },
        { type: 'code', language: 'bash', value: '# Типы health checks:\n\n# 1. Liveness — сервер жив? (перезапустить если нет)\n# GET /healthz -> 200 OK\n# Проверяет: процесс работает, не зависший\n\n# 2. Readiness — сервер готов принимать трафик?\n# GET /ready -> 200 OK\n# Проверяет: БД подключена, кэш прогрет, зависимости доступны\n\n# 3. Startup — сервер запустился?\n# GET /startup -> 200 OK\n# Проверяет: инициализация завершена (для медленных startup)\n\n# Пример endpoint в Python (Flask):\n# @app.route("/healthz")\n# def liveness():\n#     return {"status": "alive"}, 200\n#\n# @app.route("/ready")\n# def readiness():\n#     try:\n#         db.execute("SELECT 1")\n#         redis.ping()\n#         return {"status": "ready"}, 200\n#     except Exception as e:\n#         return {"status": "not ready", "error": str(e)}, 503' },
        { type: 'heading', value: 'Health Checks в Kubernetes' },
        { type: 'code', language: 'yaml', value: '# Pod с тремя типами health checks\napiVersion: v1\nkind: Pod\nmetadata:\n  name: myapp\nspec:\n  containers:\n    - name: app\n      image: myapp:v1\n      ports:\n        - containerPort: 8080\n      startupProbe:\n        httpGet:\n          path: /startup\n          port: 8080\n        failureThreshold: 30     # 30 * 10s = 5 min для запуска\n        periodSeconds: 10\n      livenessProbe:\n        httpGet:\n          path: /healthz\n          port: 8080\n        initialDelaySeconds: 0\n        periodSeconds: 10\n        failureThreshold: 3      # 3 неудачи = restart\n        timeoutSeconds: 3\n      readinessProbe:\n        httpGet:\n          path: /ready\n          port: 8080\n        initialDelaySeconds: 0\n        periodSeconds: 5\n        failureThreshold: 3      # 3 неудачи = убрать из Service\n        successThreshold: 1' },
        { type: 'heading', value: 'Global Health Checks (Route 53)' },
        { type: 'code', language: 'bash', value: '# AWS Route 53 Health Check — глобальный мониторинг\naws route53 create-health-check --caller-reference "$(date +%s)" \\\n  --health-check-config \'{\n    "IPAddress": "54.xxx.xxx.xxx",\n    "Port": 443,\n    "Type": "HTTPS",\n    "ResourcePath": "/health",\n    "FullyQualifiedDomainName": "api.company.com",\n    "RequestInterval": 30,\n    "FailureThreshold": 3,\n    "Regions": ["us-east-1", "eu-west-1", "ap-southeast-1"]\n  }\'\n\n# DNS Failover — автоматическое переключение при сбое\n# Primary: api.company.com -> ALB us-east-1 (с health check)\n# Secondary: api.company.com -> ALB eu-west-1 (failover)' },
        { type: 'tip', value: 'Readiness probe важнее liveness probe. Неправильный liveness probe может вызвать cascading restart (все pods перезапускаются). Readiness просто убирает pod из балансировки без перезапуска.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Load Balancing и CDN',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте балансировку нагрузки с health checks и CDN для веб-приложения.',
      requirements: [
        'Настройте NGINX Ingress с weighted canary deployment (90/10)',
        'Добавьте health checks (liveness, readiness, startup) к Deployment',
        'Настройте rate limiting через NGINX Ingress annotations',
        'Создайте CloudFront Distribution для статических файлов из S3',
        'Настройте DNS failover между двумя регионами',
        'Создайте алерт на failed health checks'
      ],
      hint: 'NGINX canary через аннотации canary-weight. Health checks через livenessProbe/readinessProbe в Pod spec. CloudFront через aws cloudfront create-distribution.',
      expectedOutput: 'kubectl get ingress => stable + canary configured\nkubectl describe pod => Liveness/Readiness/Startup probes OK\ncurl with rate limit => 429 after limit\nCloudFront: static files served from edge location\nDNS failover: automatic switch on health check failure',
      solution: '# 1. Canary Ingress\n# nginx.ingress.kubernetes.io/canary: "true"\n# nginx.ingress.kubernetes.io/canary-weight: "10"\n\n# 2. Health Checks в Deployment\n# livenessProbe: httpGet /healthz\n# readinessProbe: httpGet /ready\n# startupProbe: httpGet /startup\n\n# 3. Rate Limiting\n# nginx.ingress.kubernetes.io/limit-rps: "50"\n\n# 4. CloudFront\naws cloudfront create-distribution \\\n  --origin-domain-name my-bucket.s3.amazonaws.com\n\n# 5. DNS Failover\n# Route 53 Health Check + Failover routing policy\n\n# 6. Алерт\n# alert: HealthCheckFailed\n# expr: up{job="myapp"} == 0\n# for: 2m',
      explanation: 'Load Balancing распределяет трафик между серверами. Health checks обеспечивают, что трафик идёт только на здоровые инстансы. CDN кэширует статический контент на edge locations ближе к пользователям. DNS failover обеспечивает доступность при отказе региона.'
    }
  ]
}
