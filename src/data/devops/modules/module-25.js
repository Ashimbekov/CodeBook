export default {
  id: 25,
  title: 'Практический проект: CI/CD Pipeline',
  description: 'Финальный проект: создание полного CI/CD Pipeline от написания кода до деплоя в Kubernetes с мониторингом и безопасностью.',
  lessons: [
    {
      id: 1,
      title: 'Архитектура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'В этом модуле мы создадим полный CI/CD Pipeline для веб-приложения. Этот проект объединяет все навыки курса: Docker, Kubernetes, CI/CD, Terraform, мониторинг, безопасность.' },
        { type: 'heading', value: 'Компоненты проекта' },
        { type: 'code', language: 'bash', value: '# Архитектура проекта:\n#\n# [GitHub Repo]\n#     |\n# [GitHub Actions CI/CD]\n#     ├── Lint + Test\n#     ├── Security Scan (Trivy + gitleaks)\n#     ├── Docker Build + Push (GHCR)\n#     └── Deploy to Kubernetes\n#           |\n# [Kubernetes Cluster]\n#     ├── Deployment (3 реплики)\n#     ├── Service (ClusterIP)\n#     ├── Ingress (Nginx)\n#     ├── ConfigMap + Secret\n#     ├── HPA (autoscaling)\n#     └── PostgreSQL (Helm)\n#           |\n# [Мониторинг]\n#     ├── Prometheus (метрики)\n#     ├── Grafana (дашборды)\n#     └── Alertmanager (алерты)\n#           |\n# [Инфраструктура]\n#     └── Terraform (VPC, EKS/K8s)' },
        { type: 'heading', value: 'Структура репозитория' },
        { type: 'code', language: 'bash', value: '# Структура:\nproject/\n├── app/                       # Код приложения\n│   ├── main.py\n│   ├── requirements.txt\n│   ├── Dockerfile\n│   └── tests/\n├── k8s/                       # Kubernetes манифесты\n│   ├── deployment.yaml\n│   ├── service.yaml\n│   ├── ingress.yaml\n│   ├── configmap.yaml\n│   ├── secret.yaml\n│   └── hpa.yaml\n├── terraform/                 # Инфраструктура\n│   ├── main.tf\n│   ├── variables.tf\n│   └── outputs.tf\n├── monitoring/                # Мониторинг\n│   ├── prometheus.yml\n│   ├── alertmanager.yml\n│   └── grafana/\n├── .github/workflows/         # CI/CD\n│   ├── ci.yml\n│   └── cd.yml\n├── docker-compose.yml         # Локальная разработка\n└── README.md' },
        { type: 'tip', value: 'Начинай с простого и итеративно усложняй: 1) Docker + docker-compose (локально), 2) CI/CD (GitHub Actions), 3) Kubernetes, 4) Мониторинг, 5) Security, 6) Terraform. Не пытайся построить всё сразу.' }
      ]
    },
    {
      id: 2,
      title: 'Приложение и Docker',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первый шаг — контейнеризация приложения. Создаём Python Flask API с endpoints для health check и метрик. Оптимизированный multi-stage Dockerfile.' },
        { type: 'heading', value: 'Приложение' },
        { type: 'code', language: 'bash', value: '# app/main.py\n# from flask import Flask, jsonify\n# from prometheus_client import Counter, Histogram, generate_latest\n# import time\n#\n# app = Flask(__name__)\n#\n# REQUEST_COUNT = Counter("http_requests_total", "Total requests", ["method", "endpoint", "status"])\n# REQUEST_LATENCY = Histogram("http_request_duration_seconds", "Request latency", ["endpoint"])\n#\n# @app.route("/health")\n# def health():\n#     return jsonify({"status": "ok"})\n#\n# @app.route("/ready")\n# def ready():\n#     return jsonify({"status": "ready"})\n#\n# @app.route("/metrics")\n# def metrics():\n#     return generate_latest(), 200, {"Content-Type": "text/plain"}\n#\n# @app.route("/api/data")\n# def get_data():\n#     start = time.time()\n#     data = {"message": "Hello from DevOps Pipeline!"}\n#     REQUEST_LATENCY.labels(endpoint="/api/data").observe(time.time() - start)\n#     REQUEST_COUNT.labels(method="GET", endpoint="/api/data", status="200").inc()\n#     return jsonify(data)' },
        { type: 'heading', value: 'Dockerfile' },
        { type: 'code', language: 'dockerfile', value: '# app/Dockerfile\nFROM python:3.11-slim AS builder\nWORKDIR /build\nCOPY requirements.txt .\nRUN pip install --user --no-cache-dir -r requirements.txt\n\nFROM python:3.11-slim\nRUN groupadd -r appuser && useradd -r -g appuser appuser\nWORKDIR /app\nCOPY --from=builder /root/.local /home/appuser/.local\nCOPY --chown=appuser:appuser . .\nENV PATH=/home/appuser/.local/bin:$PATH\nUSER appuser\nEXPOSE 8080\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD curl -f http://localhost:8080/health || exit 1\nCMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "main:app"]' },
        { type: 'heading', value: 'Docker Compose для разработки' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml\nservices:\n  app:\n    build: ./app\n    ports:\n      - "8080:8080"\n    environment:\n      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp\n    depends_on:\n      db:\n        condition: service_healthy\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    healthcheck:\n      test: pg_isready -U postgres\n      interval: 10s\n\nvolumes:\n  pgdata:' },
        { type: 'note', value: 'Приложение экспортирует /metrics в формате Prometheus — это обязательно для мониторинга в Kubernetes. /health для liveness probe, /ready для readiness probe.' }
      ]
    },
    {
      id: 3,
      title: 'CI/CD Pipeline',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Actions pipeline: линтинг, тестирование, сканирование безопасности, сборка Docker-образа, деплой в Kubernetes.' },
        { type: 'heading', value: 'CI Pipeline' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\nenv:\n  REGISTRY: ghcr.io\n  IMAGE_NAME: ${{ github.repository }}\n\njobs:\n  lint-and-test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env: { POSTGRES_DB: test, POSTGRES_PASSWORD: test }\n        ports: ["5432:5432"]\n        options: --health-cmd pg_isready --health-interval 10s --health-retries 5\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: "3.11", cache: "pip" }\n      - run: pip install -r app/requirements.txt -r app/requirements-dev.txt\n      - run: ruff check app/\n      - run: pytest app/tests/ -v --cov=app --cov-report=xml\n        env: { DATABASE_URL: "postgresql://postgres:test@localhost:5432/test" }\n\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with: { fetch-depth: 0 }\n      - uses: gitleaks/gitleaks-action@v2\n\n  build-and-push:\n    needs: [lint-and-test, security]\n    runs-on: ubuntu-latest\n    if: github.event_name == \'push\'\n    permissions: { contents: read, packages: write }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with:\n          registry: ${{ env.REGISTRY }}\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@v5\n        with:\n          context: ./app\n          push: true\n          tags: |\n            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}\n            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest\n      - name: Trivy Scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}\n          exit-code: "1"\n          severity: "CRITICAL"' },
        { type: 'heading', value: 'CD Pipeline' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/cd.yml\nname: CD\non:\n  workflow_run:\n    workflows: ["CI"]\n    types: [completed]\n    branches: [main]\n\njobs:\n  deploy:\n    if: ${{ github.event.workflow_run.conclusion == \'success\' }}\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Configure kubectl\n        uses: azure/setup-kubectl@v3\n\n      - name: Set kubeconfig\n        run: echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config\n\n      - name: Deploy to Kubernetes\n        run: |\n          export IMAGE=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}\n          envsubst < k8s/deployment.yaml | kubectl apply -f -\n          kubectl apply -f k8s/service.yaml\n          kubectl apply -f k8s/ingress.yaml\n          kubectl apply -f k8s/hpa.yaml\n          kubectl rollout status deployment/myapp -n production --timeout=300s' },
        { type: 'tip', value: 'Разделяй CI и CD: CI запускается на каждый PR и push. CD запускается только после успешного CI на main. Environment: production в GitHub может требовать ручного одобрения.' }
      ]
    },
    {
      id: 4,
      title: 'Kubernetes манифесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes манифесты описывают как приложение работает в кластере: Deployment, Service, Ingress, ConfigMap, Secret, HPA.' },
        { type: 'heading', value: 'Deployment и Service' },
        { type: 'code', language: 'yaml', value: '# k8s/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\n  namespace: production\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 0\n  template:\n    metadata:\n      labels:\n        app: myapp\n      annotations:\n        prometheus.io/scrape: "true"\n        prometheus.io/port: "8080"\n        prometheus.io/path: "/metrics"\n    spec:\n      containers:\n        - name: app\n          image: ${IMAGE}\n          ports:\n            - containerPort: 8080\n          envFrom:\n            - configMapRef:\n                name: app-config\n          env:\n            - name: DB_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: app-secrets\n                  key: db-password\n          resources:\n            requests: { cpu: 250m, memory: 128Mi }\n            limits: { cpu: 500m, memory: 256Mi }\n          readinessProbe:\n            httpGet: { path: /ready, port: 8080 }\n            initialDelaySeconds: 10\n            periodSeconds: 5\n          livenessProbe:\n            httpGet: { path: /health, port: 8080 }\n            initialDelaySeconds: 15\n            periodSeconds: 10\n\n---\n# k8s/service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: myapp\n  namespace: production\nspec:\n  selector:\n    app: myapp\n  ports:\n    - port: 80\n      targetPort: 8080' },
        { type: 'heading', value: 'HPA и Ingress' },
        { type: 'code', language: 'yaml', value: '# k8s/hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: myapp-hpa\n  namespace: production\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: myapp\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70\n\n---\n# k8s/ingress.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-ingress\n  namespace: production\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: app.company.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: myapp\n                port:\n                  number: 80' },
        { type: 'note', value: 'Annotations prometheus.io/scrape: "true" позволяют Prometheus автоматически обнаруживать и собирать метрики с подов. maxUnavailable: 0 гарантирует zero-downtime при обновлении.' }
      ]
    },
    {
      id: 5,
      title: 'Мониторинг и алерты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Финальный компонент — мониторинг. Prometheus собирает метрики приложения, Grafana визуализирует их, Alertmanager уведомляет о проблемах.' },
        { type: 'heading', value: 'Prometheus конфигурация для Kubernetes' },
        { type: 'code', language: 'yaml', value: '# monitoring/prometheus.yml\nglobal:\n  scrape_interval: 15s\n\nscrape_configs:\n  - job_name: "kubernetes-pods"\n    kubernetes_sd_configs:\n      - role: pod\n    relabel_configs:\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]\n        action: keep\n        regex: true\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]\n        action: replace\n        target_label: __metrics_path__\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]\n        action: replace\n        target_label: __address__\n        regex: (.+)\n        replacement: $1' },
        { type: 'heading', value: 'Алерты для проекта' },
        { type: 'code', language: 'yaml', value: '# monitoring/alert_rules.yml\ngroups:\n  - name: myapp\n    rules:\n      - alert: HighErrorRate\n        expr: |\n          sum(rate(http_requests_total{status=~"5.."}[5m]))\n          / sum(rate(http_requests_total[5m])) > 0.01\n        for: 5m\n        labels: { severity: critical }\n        annotations:\n          summary: "Error rate > 1%"\n\n      - alert: HighLatency\n        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5\n        for: 5m\n        labels: { severity: warning }\n        annotations:\n          summary: "p95 latency > 500ms"\n\n      - alert: PodRestarting\n        expr: increase(kube_pod_container_status_restarts_total{namespace="production"}[1h]) > 3\n        labels: { severity: warning }\n        annotations:\n          summary: "Pod {{ $labels.pod }} перезапускается"' },
        { type: 'heading', value: 'SLO дашборд' },
        { type: 'code', language: 'bash', value: '# Grafana Dashboard для SLO:\n# Panel 1: Текущая доступность (gauge)\n# PromQL: sum(rate(http_requests_total{status!~"5.."}[24h])) / sum(rate(http_requests_total[24h])) * 100\n\n# Panel 2: Error Budget оставшийся (gauge)\n# PromQL: 1 - ((1 - (sum(rate(http_requests_total{status!~"5.."}[30d])) / sum(rate(http_requests_total[30d])))) / (1 - 0.999))\n\n# Panel 3: RPS (time series)\n# PromQL: sum(rate(http_requests_total[5m]))\n\n# Panel 4: p95 Latency (time series)\n# PromQL: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))\n\n# Panel 5: Error Rate (time series)\n# PromQL: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100\n\n# Panel 6: Pod Count (stat)\n# PromQL: count(kube_pod_status_phase{namespace="production", phase="Running"})' },
        { type: 'tip', value: 'Для Kubernetes рекомендуется kube-prometheus-stack (Helm chart). Он включает Prometheus, Grafana, Alertmanager, Node Exporter и готовые дашборды. Установка одной командой: helm install monitoring prometheus-community/kube-prometheus-stack.' }
      ]
    },
    {
      id: 6,
      title: 'Чеклист и итоги проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Финальный чеклист проекта. Убедитесь что все компоненты настроены и работают.' },
        { type: 'heading', value: 'Чеклист проекта' },
        { type: 'list', value: [
          'Приложение: Docker multi-stage build, non-root user, healthcheck',
          'CI: Lint + Test + Security Scan автоматически при каждом PR',
          'CD: Автоматический деплой в Kubernetes при merge в main',
          'Kubernetes: Deployment (3 реплики), Service, Ingress, HPA',
          'Безопасность: Trivy + gitleaks в pipeline, Secrets в K8s',
          'Мониторинг: Prometheus + Grafana + Alertmanager',
          'Алерты: Error Rate, Latency, CPU, Pod restarts',
          'SLO: Определены и мониторятся (доступность 99.9%)',
          'Документация: README, runbooks, architecture diagram'
        ] },
        { type: 'heading', value: 'Что дальше?' },
        { type: 'list', value: [
          'GitOps с ArgoCD — автоматическая синхронизация K8s с Git',
          'Service Mesh (Istio) — наблюдаемость, безопасность, трафик между сервисами',
          'Chaos Engineering — тестирование отказоустойчивости (Litmus, Chaos Monkey)',
          'Multi-region деплой — высокая доступность через несколько регионов',
          'FinOps — оптимизация затрат на облако',
          'Platform Engineering — создание внутренней платформы для разработчиков',
          'AI/ML Ops — CI/CD для моделей машинного обучения'
        ] },
        { type: 'tip', value: 'Этот проект — отличное портфолио для собеседования на позицию DevOps/SRE. Развивай его: добавь ArgoCD, настрой multi-environment (dev/staging/prod), реализуй canary deployment, добавь distributed tracing.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полный Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Соберите все компоненты в рабочий CI/CD Pipeline от кода до мониторинга.',
      requirements: [
        'Создайте Docker-образ приложения с /health и /metrics endpoints',
        'Настройте GitHub Actions CI: lint, test, security scan, docker build',
        'Создайте Kubernetes манифесты: Deployment, Service, Ingress, HPA',
        'Настройте Prometheus для сбора метрик приложения',
        'Создайте Grafana дашборд с 4 золотыми сигналами',
        'Настройте алерт на Error Rate > 1%',
        'Определите SLO и вычислите Error Budget'
      ],
      hint: 'Начните с docker-compose для локальной разработки. Затем CI/CD в GitHub Actions. Затем K8s манифесты. Последний шаг — мониторинг. Используйте minikube для тестирования K8s.',
      expectedOutput: 'Docker: образ собирается, /health и /metrics работают\nCI: lint -> test -> security -> build проходят\nK8s: 3 пода running, Service и Ingress работают\nHPA: масштабирование при CPU > 70%\nPrometheus: метрики собираются\nGrafana: дашборд с RPS, latency, errors, saturation\nАлерт: Error Rate > 1% -> Slack уведомление\nSLO: доступность 99.9%, Error Budget: 43.2 мин/месяц',
      solution: '# Полный проект состоит из:\n\n# 1. app/Dockerfile — multi-stage, non-root, healthcheck\n# 2. app/main.py — Flask с /health, /ready, /metrics, /api\n# 3. docker-compose.yml — локальная разработка (app + db)\n# 4. .github/workflows/ci.yml — lint + test + trivy + docker build\n# 5. .github/workflows/cd.yml — deploy to K8s after CI success\n# 6. k8s/deployment.yaml — 3 replicas, probes, resources\n# 7. k8s/service.yaml — ClusterIP\n# 8. k8s/ingress.yaml — nginx ingress\n# 9. k8s/hpa.yaml — autoscaling CPU 70%\n# 10. monitoring/prometheus.yml — scrape config\n# 11. monitoring/alert_rules.yml — error rate, latency alerts\n# 12. monitoring/grafana/ — dashboards as code\n\n# Запуск локально:\ndocker compose up -d\ncurl http://localhost:8080/health\ncurl http://localhost:8080/metrics\n\n# Запуск в K8s:\nkubectl apply -f k8s/\nkubectl get pods -n production\nkubectl rollout status deployment/myapp -n production\n\n# Мониторинг:\nhelm install monitoring prometheus-community/kube-prometheus-stack\n# Grafana: http://localhost:3000\n# Prometheus: http://localhost:9090',
      explanation: 'Полный CI/CD Pipeline включает: контейнеризацию (Docker), автоматическое тестирование и сборку (GitHub Actions), оркестрацию (Kubernetes), безопасность (Trivy, gitleaks), мониторинг (Prometheus, Grafana), алертинг (Alertmanager) и SLO/Error Budgets. Каждый компонент — этап зрелости DevOps-практик.'
    }
  ]
}
