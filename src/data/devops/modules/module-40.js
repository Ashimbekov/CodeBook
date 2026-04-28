export default {
  id: 40,
  title: 'DNS, SSL/TLS и сертификаты',
  description: 'DNS обеспечивает разрешение доменных имён. SSL/TLS шифрует трафик. cert-manager автоматизирует управление сертификатами в Kubernetes.',
  lessons: [
    {
      id: 1,
      title: 'Основы DNS',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Как работает DNS' },
        { type: 'text', value: 'DNS (Domain Name System) преобразует доменные имена (api.company.com) в IP-адреса (54.23.100.50). Это распределённая иерархическая система, состоящая из корневых серверов, TLD серверов и авторитетных серверов.' },
        { type: 'code', language: 'bash', value: '# Процесс разрешения DNS:\n# 1. Клиент -> Рекурсивный резолвер (ISP/8.8.8.8)\n# 2. Резолвер -> Корневой DNS (.) -> "Спроси .com NS"\n# 3. Резолвер -> TLD DNS (.com) -> "Спроси company.com NS"\n# 4. Резолвер -> Авторитетный DNS (company.com) -> "54.23.100.50"\n# 5. Резолвер -> Клиент (кэширует результат)\n\n# Инструменты DNS\n# nslookup\nnslookup api.company.com\nnslookup -type=MX company.com\n\n# dig — более подробный\ndig api.company.com\ndig api.company.com +short\ndig api.company.com +trace   # полный путь разрешения\ndig @8.8.8.8 api.company.com # через конкретный DNS\n\n# host\nhost api.company.com\nhost -t CNAME www.company.com' },
        { type: 'heading', value: 'DNS провайдеры' },
        { type: 'code', language: 'bash', value: '# Cloud DNS провайдеры:\n# AWS Route 53       — интеграция с AWS, health checks, failover\n# Cloudflare DNS     — бесплатный, быстрый, DDoS защита\n# GCP Cloud DNS      — интеграция с GCP\n# Azure DNS          — интеграция с Azure\n\n# Route 53 — создание hosted zone\naws route53 create-hosted-zone --name company.com \\\n  --caller-reference "$(date +%s)"\n\n# Cloudflare — через CLI (flarectl)\nflarectl dns create --zone company.com --type A \\\n  --name api --content 54.23.100.50 --ttl 300\n\n# Kubernetes DNS:\n# CoreDNS внутри кластера разрешает:\n# myservice.namespace.svc.cluster.local\n# Pods: pod-ip-address.namespace.pod.cluster.local' },
        { type: 'tip', value: 'Используйте низкий TTL (60-300 сек) при миграции DNS для быстрого переключения. Для стабильных записей TTL 3600-86400 секунд уменьшает количество DNS-запросов.' }
      ]
    },
    {
      id: 2,
      title: 'Типы DNS записей',
      type: 'theory',
      content: [
        { type: 'heading', value: 'DNS Record Types' },
        { type: 'text', value: 'DNS поддерживает различные типы записей для разных задач: A для IPv4, AAAA для IPv6, CNAME для алиасов, MX для почты, TXT для верификации и SPF/DKIM.' },
        { type: 'code', language: 'bash', value: '# Основные типы записей:\n\n# A — доменное имя -> IPv4 адрес\n# api.company.com.  IN  A  54.23.100.50\n\n# AAAA — доменное имя -> IPv6 адрес\n# api.company.com.  IN  AAAA  2001:0db8::1\n\n# CNAME — алиас (псевдоним) на другое имя\n# www.company.com.  IN  CNAME  company.com.\n# app.company.com.  IN  CNAME  my-alb-123.us-east-1.elb.amazonaws.com.\n# НЕЛЬЗЯ использовать CNAME для корневого домена (company.com)\n\n# MX — почтовый сервер\n# company.com.  IN  MX  10  mail1.company.com.\n# company.com.  IN  MX  20  mail2.company.com.\n\n# TXT — текстовая запись (SPF, DKIM, верификация)\n# company.com.  IN  TXT  "v=spf1 include:_spf.google.com ~all"\n\n# NS — Name Server (делегирование DNS)\n# company.com.  IN  NS  ns1.cloudflare.com.\n\n# SRV — сервис discovery\n# _http._tcp.company.com.  IN  SRV  10 60 80 web1.company.com.' },
        { type: 'heading', value: 'Route 53 специальные записи' },
        { type: 'code', language: 'bash', value: '# AWS Route 53 Alias Record — для AWS ресурсов\n# Работает как CNAME, но:\n# + Можно для корневого домена (zone apex)\n# + Бесплатные запросы к AWS ресурсам\n# + Автоматическое обновление IP\n\n# Пример: корневой домен -> ALB\naws route53 change-resource-record-sets --hosted-zone-id Z123 \\\n  --change-batch \'{\n    "Changes": [{\n      "Action": "UPSERT",\n      "ResourceRecordSet": {\n        "Name": "company.com",\n        "Type": "A",\n        "AliasTarget": {\n          "HostedZoneId": "Z35SXDOTRQ7X7K",\n          "DNSName": "my-alb-123.us-east-1.elb.amazonaws.com",\n          "EvaluateTargetHealth": true\n        }\n      }\n    }]\n  }\'\n\n# Routing policies в Route 53:\n# Simple     — один IP или несколько (round-robin)\n# Weighted   — распределение по весам (90/10 canary)\n# Latency    — ближайший регион по latency\n# Failover   — primary/secondary с health check\n# Geolocation — маршрутизация по геолокации пользователя\n# Multivalue  — до 8 IP с health checks' },
        { type: 'note', value: 'ExternalDNS в Kubernetes автоматически создаёт DNS записи при создании Ingress или Service type LoadBalancer. Поддерживает Route 53, Cloudflare, GCP Cloud DNS, Azure DNS.' }
      ]
    },
    {
      id: 3,
      title: 'cert-manager в Kubernetes',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Автоматические TLS сертификаты' },
        { type: 'text', value: 'cert-manager — Kubernetes addon для автоматического получения, обновления и управления TLS сертификатами. Поддерживает Let\'s Encrypt (бесплатные сертификаты), Vault, и коммерческие CA.' },
        { type: 'code', language: 'bash', value: '# Установка cert-manager\nhelm repo add jetstack https://charts.jetstack.io\nhelm install cert-manager jetstack/cert-manager \\\n  --namespace cert-manager \\\n  --create-namespace \\\n  --set installCRDs=true\n\n# Проверка\nkubectl get pods -n cert-manager\nkubectl get crds | grep cert-manager' },
        { type: 'heading', value: 'ClusterIssuer для Let\'s Encrypt' },
        { type: 'code', language: 'yaml', value: '# ClusterIssuer — глобальный для всех namespace\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-prod\nspec:\n  acme:\n    server: https://acme-v02.api.letsencrypt.org/directory\n    email: devops@company.com\n    privateKeySecretRef:\n      name: letsencrypt-prod-key\n    solvers:\n      - http01:\n          ingress:\n            class: nginx\n\n---\n# Staging issuer (для тестирования, без rate limits)\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-staging\nspec:\n  acme:\n    server: https://acme-staging-v02.api.letsencrypt.org/directory\n    email: devops@company.com\n    privateKeySecretRef:\n      name: letsencrypt-staging-key\n    solvers:\n      - http01:\n          ingress:\n            class: nginx' },
        { type: 'heading', value: 'Автоматический TLS для Ingress' },
        { type: 'code', language: 'yaml', value: '# Ingress с автоматическим TLS сертификатом\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-ingress\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - api.company.com\n        - app.company.com\n      secretName: myapp-tls  # cert-manager создаст этот Secret\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: api-service\n                port:\n                  number: 80\n    - host: app.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: app-service\n                port:\n                  number: 80' },
        { type: 'code', language: 'bash', value: '# Проверка сертификата\nkubectl get certificate -A\nkubectl describe certificate myapp-tls\nkubectl get secret myapp-tls\n\n# Вывод:\n# NAME        READY   SECRET      AGE\n# myapp-tls   True    myapp-tls   5m\n\n# cert-manager автоматически обновляет сертификат за 30 дней до истечения' },
        { type: 'tip', value: 'Всегда тестируйте с letsencrypt-staging перед переходом на prod. Let\'s Encrypt имеет rate limits: 50 сертификатов в неделю на домен. Staging не имеет таких ограничений.' }
      ]
    },
    {
      id: 4,
      title: "Let's Encrypt и ACME",
      type: 'theory',
      content: [
        { type: 'heading', value: "Let's Encrypt — бесплатные сертификаты" },
        { type: 'text', value: "Let's Encrypt выдаёт бесплатные DV (Domain Validated) сертификаты через протокол ACME. Два метода проверки: HTTP-01 (файл на веб-сервере) и DNS-01 (TXT запись в DNS). Сертификаты действуют 90 дней и автоматически обновляются cert-manager." },
        { type: 'code', language: 'bash', value: '# HTTP-01 Challenge:\n# 1. cert-manager запрашивает сертификат у Let\'s Encrypt\n# 2. Let\'s Encrypt даёт token\n# 3. cert-manager создаёт Pod/Ingress для ответа на challenge\n# 4. Let\'s Encrypt проверяет http://domain/.well-known/acme-challenge/TOKEN\n# 5. Сертификат выдан!\n\n# DNS-01 Challenge:\n# 1. cert-manager запрашивает сертификат\n# 2. Let\'s Encrypt даёт token\n# 3. cert-manager создаёт TXT запись: _acme-challenge.domain -> token\n# 4. Let\'s Encrypt проверяет DNS запись\n# 5. Сертификат выдан!\n\n# DNS-01 преимущества:\n# + Wildcard сертификаты (*.company.com)\n# + Не нужен публичный HTTP endpoint\n# - Нужен доступ к DNS провайдеру API' },
        { type: 'heading', value: 'DNS-01 Challenge с Route 53' },
        { type: 'code', language: 'yaml', value: '# ClusterIssuer с DNS-01 для wildcard сертификатов\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-dns\nspec:\n  acme:\n    server: https://acme-v02.api.letsencrypt.org/directory\n    email: devops@company.com\n    privateKeySecretRef:\n      name: letsencrypt-dns-key\n    solvers:\n      - dns01:\n          route53:\n            region: us-east-1\n            hostedZoneID: Z1234567890\n        selector:\n          dnsZones:\n            - company.com\n\n---\n# Wildcard Certificate\napiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: wildcard-cert\n  namespace: production\nspec:\n  secretName: wildcard-tls\n  issuerRef:\n    name: letsencrypt-dns\n    kind: ClusterIssuer\n  dnsNames:\n    - company.com\n    - \"*.company.com\"' },
        { type: 'heading', value: 'Мониторинг сертификатов' },
        { type: 'code', language: 'bash', value: '# Проверка срока действия сертификата\nopenssl s_client -connect api.company.com:443 2>/dev/null | \\\n  openssl x509 -noout -dates\n# notBefore=Mar 15 00:00:00 2024 GMT\n# notAfter=Jun 13 23:59:59 2024 GMT\n\n# Prometheus метрики cert-manager\n# certmanager_certificate_expiration_timestamp_seconds\n# certmanager_certificate_ready_status\n\n# Алерт: сертификат истекает через 14 дней\n# alert: CertificateExpiringSoon\n# expr: (certmanager_certificate_expiration_timestamp_seconds - time()) < 1209600\n# labels: { severity: warning }\n# annotations:\n#   summary: "Certificate {{ $labels.name }} expires in < 14 days"' },
        { type: 'warning', value: "Let's Encrypt сертификаты действуют 90 дней. cert-manager обновляет их за 30 дней до истечения. Настройте мониторинг на случай сбоя обновления!" }
      ]
    },
    {
      id: 5,
      title: 'TLS Termination',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стратегии TLS Termination' },
        { type: 'text', value: 'TLS Termination определяет, где расшифровывается HTTPS трафик. Три подхода: termination на балансировщике, passthrough до backend, re-encryption (расшифровка и повторное шифрование).' },
        { type: 'code', language: 'bash', value: '# 1. TLS Termination на Load Balancer (рекомендуется)\n# Client --HTTPS--> [LB/Ingress] --HTTP--> Backend Pod\n# + Простота: сертификат только на LB\n# + Меньше нагрузка на backend\n# + Централизованное управление сертификатами\n# - Трафик внутри кластера не зашифрован\n\n# 2. TLS Passthrough\n# Client --HTTPS--> [LB/Ingress] --HTTPS--> Backend Pod\n# + End-to-end encryption\n# + Backend контролирует TLS\n# - Нет L7 routing (LB не видит HTTP)\n# - Сертификат на каждом backend\n\n# 3. Re-encryption\n# Client --HTTPS--> [LB/Ingress] --HTTPS--> Backend Pod\n#                   (свой cert)    (свой cert)\n# + L7 routing + end-to-end encryption\n# - Двойная TLS обработка (overhead)\n# - Два набора сертификатов' },
        { type: 'heading', value: 'TLS в NGINX Ingress' },
        { type: 'code', language: 'yaml', value: '# 1. TLS Termination (по умолчанию)\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  tls:\n    - hosts: [\"api.company.com\"]\n      secretName: api-tls\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service: { name: myapp, port: { number: 80 } }\n\n---\n# 2. TLS Passthrough\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-passthrough\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-passthrough: \"true\"\nspec:\n  rules:\n    - host: api.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service: { name: myapp, port: { number: 443 } }' },
        { type: 'heading', value: 'TLS конфигурация безопасности' },
        { type: 'code', language: 'yaml', value: '# Безопасная TLS конфигурация для NGINX Ingress\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: nginx-configuration\n  namespace: ingress-nginx\ndata:\n  ssl-protocols: \"TLSv1.2 TLSv1.3\"\n  ssl-ciphers: \"ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384\"\n  ssl-prefer-server-ciphers: \"true\"\n  hsts: \"true\"\n  hsts-max-age: \"31536000\"\n  hsts-include-subdomains: \"true\"\n  hsts-preload: \"true\"' },
        { type: 'tip', value: 'Для Kubernetes с Service Mesh (Istio): используйте mTLS для трафика внутри mesh, а TLS termination на Ingress Gateway для внешнего трафика. Это обеспечивает end-to-end encryption.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: DNS и TLS',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте DNS записи, установите cert-manager и автоматизируйте получение TLS сертификатов от Let\'s Encrypt для Kubernetes Ingress.',
      requirements: [
        'Создайте DNS записи: A для api.company.com, CNAME для www',
        'Установите cert-manager в Kubernetes кластер',
        "Создайте ClusterIssuer для Let's Encrypt (staging и prod)",
        'Настройте Ingress с автоматическим TLS сертификатом',
        'Создайте wildcard сертификат через DNS-01 challenge',
        'Настройте мониторинг срока действия сертификатов'
      ],
      hint: 'Установите cert-manager через Helm с installCRDs=true. Создайте ClusterIssuer с ACME solver. Добавьте аннотацию cert-manager.io/cluster-issuer к Ingress.',
      expectedOutput: 'dig api.company.com => 54.xx.xx.xx\nkubectl get clusterissuer => letsencrypt-prod Ready\nkubectl get certificate => myapp-tls True\ncurl https://api.company.com => 200 (TLS valid)\nopenssl s_client => certificate chain verified',
      solution: '# 1. DNS (Route 53 или Cloudflare)\n# api.company.com A 54.xx.xx.xx\n# www.company.com CNAME company.com\n\n# 2. cert-manager\nhelm install cert-manager jetstack/cert-manager \\\n  -n cert-manager --create-namespace --set installCRDs=true\n\n# 3. ClusterIssuer\n# apiVersion: cert-manager.io/v1\n# kind: ClusterIssuer\n# metadata: { name: letsencrypt-prod }\n# spec:\n#   acme:\n#     server: https://acme-v02.api.letsencrypt.org/directory\n#     email: devops@company.com\n#     solvers:\n#       - http01: { ingress: { class: nginx } }\n\n# 4. Ingress с TLS\n# annotations:\n#   cert-manager.io/cluster-issuer: letsencrypt-prod\n# spec:\n#   tls: [{ hosts: [api.company.com], secretName: api-tls }]\n\nkubectl get certificate api-tls\nkubectl describe certificate api-tls',
      explanation: "DNS преобразует доменные имена в IP-адреса. cert-manager автоматически получает и обновляет TLS сертификаты от Let's Encrypt. HTTP-01 challenge подтверждает владение доменом через HTTP. DNS-01 поддерживает wildcard сертификаты. Мониторинг предупреждает о проблемах с обновлением."
    }
  ]
}
