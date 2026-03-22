export default {
  id: 15,
  title: 'Мониторинг: Prometheus и Grafana',
  description: 'Настройка мониторинга кластера и приложений с Prometheus, Grafana и ServiceMonitor',
  lessons: [
    {
      id: 1,
      title: 'Архитектура мониторинга в Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современный мониторинг Kubernetes строится на стеке Prometheus + Grafana. Prometheus собирает метрики, Grafana визуализирует. kube-prometheus-stack — готовый Helm chart с полной настройкой.' },
        { type: 'heading', value: 'Компоненты стека' },
        { type: 'list', items: [
          'Prometheus — сбор и хранение метрик временных рядов',
          'Alertmanager — управление алертами (email, Slack, PagerDuty)',
          'Grafana — визуализация метрик в дашбордах',
          'Node Exporter — метрики узлов (CPU, RAM, диск, сеть)',
          'kube-state-metrics — метрики объектов K8s (Pod, Deployment и т.д.)',
          'Prometheus Operator — управляет Prometheus через CRD'
        ]},
        { type: 'code', language: 'bash', value: '# Установка kube-prometheus-stack\nhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts\nhelm repo update\n\nhelm install monitoring prometheus-community/kube-prometheus-stack \\\n  --namespace monitoring \\\n  --create-namespace \\\n  --set grafana.adminPassword=admin123\n\n# Проверить\nkubectl get pods -n monitoring\nkubectl get servicemonitor -n monitoring' }
      ]
    },
    {
      id: 2,
      title: 'ServiceMonitor: автодискавери метрик',
      type: 'theory',
      content: [
        { type: 'text', value: 'ServiceMonitor — это CRD (Custom Resource Definition) от Prometheus Operator. Он описывает как Prometheus должен scrape метрики с определённого Service. Не нужно вручную редактировать prometheus.yml.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: my-app-monitor\n  namespace: monitoring\n  labels:\n    release: monitoring  # должен совпадать с label selector Prometheus\nspec:\n  selector:\n    matchLabels:\n      app: my-app      # выбирает Service с этим label\n  namespaceSelector:\n    matchNames:\n    - default\n    - production\n  endpoints:\n  - port: metrics      # имя порта в Service\n    interval: 15s      # как часто scrape\n    path: /metrics     # путь к метрикам\n    scheme: http\n    # Если метрики защищены TLS:\n    # scheme: https\n    # tlsConfig:\n    #   insecureSkipVerify: true' },
        { type: 'code', language: 'yaml', value: '# Service должен иметь именованный порт metrics\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app\n  labels:\n    app: my-app\nspec:\n  selector:\n    app: my-app\n  ports:\n  - name: http\n    port: 80\n    targetPort: 8080\n  - name: metrics    # именованный порт для Prometheus\n    port: 9090\n    targetPort: 9090' }
      ]
    },
    {
      id: 3,
      title: 'PrometheusRule: правила алертинга',
      type: 'theory',
      content: [
        { type: 'text', value: 'PrometheusRule — CRD для определения правил алертинга и recording rules. Recording rules предварительно вычисляют дорогие запросы.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: my-app-alerts\n  namespace: monitoring\n  labels:\n    release: monitoring\nspec:\n  groups:\n  - name: my-app.rules\n    interval: 30s\n    rules:\n    # Recording rule: предварительное вычисление\n    - record: job:http_requests_total:rate5m\n      expr: rate(http_requests_total[5m])\n    # Alert: высокий error rate\n    - alert: HighErrorRate\n      expr: |\n        rate(http_requests_total{status=~"5.."}[5m]) /\n        rate(http_requests_total[5m]) > 0.05\n      for: 5m\n      labels:\n        severity: warning\n      annotations:\n        summary: "High error rate on {{ $labels.job }}"\n        description: "Error rate is {{ $value | humanizePercentage }}"' }
      ]
    },
    {
      id: 4,
      title: 'Grafana: создание дашбордов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grafana предоставляет мощный интерфейс для визуализации метрик Prometheus. Дашборды можно создавать вручную или импортировать готовые из grafana.com.' },
        { type: 'code', language: 'bash', value: '# Открыть Grafana\nkubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring\n# Браузер: http://localhost:3000\n# Логин: admin / admin123\n\n# Импортировать популярные дашборды:\n# 315  - Kubernetes Cluster Monitoring\n# 6417 - Kubernetes Pods\n# 1860 - Node Exporter Full\n# 13770 - Cert Manager' },
        { type: 'text', value: 'Grafana as Code: дашборды можно хранить в виде JSON и автоматически загружать через ConfigMap.' },
        { type: 'code', language: 'yaml', value: '# ConfigMap с дашбордом\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: my-dashboard\n  namespace: monitoring\n  labels:\n    grafana_dashboard: "1"  # автоматически загружается в Grafana\ndata:\n  my-dashboard.json: |\n    {\n      "title": "My App Dashboard",\n      "panels": [...]\n    }' }
      ]
    },
    {
      id: 5,
      title: 'Метрики приложения (Prometheus client)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Приложение должно экспортировать метрики в формате Prometheus. Клиентские библиотеки доступны для всех языков.' },
        { type: 'heading', value: 'Типы метрик Prometheus' },
        { type: 'list', items: [
          'Counter — монотонно возрастающий счётчик (запросы, ошибки)',
          'Gauge — значение которое может расти и убывать (активные соединения, размер очереди)',
          'Histogram — распределение значений по bucket (время ответа)',
          'Summary — процентили (P50, P95, P99 времени ответа)'
        ]},
        { type: 'code', language: 'bash', value: '# Базовые PromQL запросы\n# Количество запросов в секунду\nrate(http_requests_total[5m])\n\n# P95 время ответа\nhistogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))\n\n# CPU usage по Pod\nsum(rate(container_cpu_usage_seconds_total{namespace="production"}[5m])) by (pod)\n\n# Memory по Pod\ncontainer_memory_working_set_bytes{namespace="production"}\n\n# Pod restart rate\nrate(kube_pod_container_status_restarts_total[1h])' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Установка и настройка мониторинга',
      type: 'practice',
      difficulty: 'hard',
      description: 'Установите kube-prometheus-stack и настройте мониторинг для тестового приложения.',
      requirements: [
        'Установить kube-prometheus-stack через Helm',
        'Открыть Grafana через port-forward',
        'Открыть Prometheus и выполнить PromQL запросы',
        'Создать ServiceMonitor для тестового приложения',
        'Импортировать готовый дашборд'
      ],
      hint: 'После установки используйте kubectl get pods -n monitoring. Prometheus UI доступен через port-forward на порт 9090. Для ServiceMonitor нужен Service с именованным портом metrics.',
      solution: '# Установка\nhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts\nhelm repo update\n\nhelm install monitoring prometheus-community/kube-prometheus-stack \\\n  --namespace monitoring \\\n  --create-namespace \\\n  --set grafana.adminPassword=admin123 \\\n  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false\n\n# Дождаться запуска\nkubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana \\\n  -n monitoring --timeout=300s\n\n# Port-forward для Grafana\nkubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring &\n\n# Port-forward для Prometheus\nkubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring &\n\n# Тестовое приложение с /metrics\ncat <<EOF | kubectl apply -f -\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: demo-app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: demo-app\n  template:\n    metadata:\n      labels:\n        app: demo-app\n    spec:\n      containers:\n      - name: app\n        image: nginx/nginx-prometheus-exporter:latest\n        args: [\'-nginx.scrape-uri=http://localhost:80/nginx_status\']\n        ports:\n        - name: metrics\n          containerPort: 9113\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: demo-app\n  labels:\n    app: demo-app\nspec:\n  selector:\n    app: demo-app\n  ports:\n  - name: metrics\n    port: 9113\nEOF\n\n# ServiceMonitor\ncat <<EOF | kubectl apply -f -\napiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: demo-app\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: demo-app\n  namespaceSelector:\n    matchNames: [default]\n  endpoints:\n  - port: metrics\n    interval: 15s\nEOF\n\n# PromQL запросы в Prometheus UI (localhost:9090):\n# up\n# rate(prometheus_http_requests_total[5m])\n# kube_pod_status_phase',
      explanation: 'kube-prometheus-stack устанавливает полный стек мониторинга: Prometheus, Alertmanager, Grafana, Node Exporter, kube-state-metrics. ServiceMonitor позволяет Prometheus автоматически обнаруживать новые цели для scraping без перезапуска. Grafana импортирует дашборды с grafana.com по ID.'
    },
    {
      id: 7,
      title: 'Практика: PromQL и алертинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите PromQL запросы для ключевых метрик кластера и создайте правило алертинга.',
      requirements: [
        'Написать запрос для CPU utilization по namespace',
        'Написать запрос для Pod restarts за последний час',
        'Написать запрос для свободного места на диске',
        'Создать PrometheusRule для алерта при высоком использовании памяти',
        'Проверить алерт в Alertmanager'
      ],
      hint: 'Используйте Prometheus UI для тестирования запросов. container_memory_working_set_bytes / container_spec_memory_limit_bytes для % использования памяти.',
      solution: '# PromQL запросы (выполнять в Prometheus UI localhost:9090)\n\n# CPU utilization по namespace\nsum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (namespace)\n\n# Pod restarts за час\nrate(kube_pod_container_status_restarts_total[1h]) * 3600\n\n# Свободное место на диске (%)\n(node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100\n\n# Количество running Pod по namespace\ncount(kube_pod_status_phase{phase="Running"}) by (namespace)\n\n# PrometheusRule для высокого использования памяти\ncat <<EOF | kubectl apply -f -\napiVersion: monitoring.coreos.com/v1\nkind: PrometheusRule\nmetadata:\n  name: memory-alerts\n  namespace: monitoring\n  labels:\n    release: monitoring\nspec:\n  groups:\n  - name: memory.rules\n    rules:\n    - alert: HighMemoryUsage\n      expr: |\n        (container_memory_working_set_bytes{container!="",container!="POD"}\n        / container_spec_memory_limit_bytes{container!="",container!="POD"}) > 0.8\n      for: 5m\n      labels:\n        severity: warning\n      annotations:\n        summary: "High memory usage in {{ $labels.namespace }}/{{ $labels.pod }}"\n        description: "Memory usage is {{ $value | humanizePercentage }}"\n    - alert: PodCrashLooping\n      expr: rate(kube_pod_container_status_restarts_total[15m]) > 0\n      for: 5m\n      labels:\n        severity: critical\n      annotations:\n        summary: "Pod {{ $labels.pod }} is crash looping"\nEOF\n\n# Проверить правила загрузились\nkubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n monitoring\n# Prometheus UI -> Status -> Rules',
      explanation: 'PromQL — мощный язык запросов для Prometheus. rate() вычисляет скорость изменения Counter за период. sum() by() агрегирует метрики по label. PrometheusRule автоматически загружается Prometheus Operator без перезапуска Prometheus.'
    }
  ]
}
