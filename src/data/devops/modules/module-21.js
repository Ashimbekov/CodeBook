export default {
  id: 21,
  title: 'Мониторинг: Prometheus и Grafana',
  description: 'Настройка мониторинга с Prometheus для сбора метрик и Grafana для визуализации. Алертинг и best practices.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен мониторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мониторинг — глаза DevOps-инженера. Без мониторинга вы узнаёте о проблемах от пользователей. С мониторингом — видите проблемы до того, как они повлияют на пользователей.' },
        { type: 'heading', value: 'Четыре золотых сигнала (Google SRE)' },
        { type: 'list', value: [
          'Latency — время ответа (p50, p95, p99)',
          'Traffic — количество запросов в секунду (RPS)',
          'Errors — процент ошибок (5xx, 4xx)',
          'Saturation — загрузка ресурсов (CPU, RAM, диск, сеть)'
        ] },
        { type: 'heading', value: 'Стек мониторинга' },
        { type: 'code', language: 'bash', value: '# Типичный стек мониторинга:\n#\n# Prometheus  — сбор и хранение метрик (time-series DB)\n# Grafana     — визуализация (дашборды)\n# Alertmanager — управление алертами (уведомления)\n# Node Exporter — метрики серверов (CPU, RAM, диск)\n# cAdvisor      — метрики Docker контейнеров\n# Blackbox Exporter — проверка доступности URL\n\n# Альтернативы:\n# Datadog     — SaaS мониторинг (платный, всё включено)\n# New Relic   — APM + мониторинг\n# Victoria Metrics — совместима с Prometheus, эффективнее' },
        { type: 'tip', value: 'Prometheus + Grafana — стандарт open-source мониторинга. Бесплатен, мощный, огромное сообщество. Используется в Kubernetes по умолчанию. Для маленьких проектов может быть проще Datadog.' }
      ]
    },
    {
      id: 2,
      title: 'Prometheus: сбор метрик',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prometheus — time-series база данных для метрик. Он периодически опрашивает (scrape) targets и сохраняет метрики. PromQL — язык запросов для анализа.' },
        { type: 'heading', value: 'Настройка Prometheus' },
        { type: 'code', language: 'yaml', value: '# prometheus.yml\nglobal:\n  scrape_interval: 15s\n  evaluation_interval: 15s\n\nrule_files:\n  - "alert_rules.yml"\n\nalerting:\n  alertmanagers:\n    - static_configs:\n        - targets: ["alertmanager:9093"]\n\nscrape_configs:\n  - job_name: "prometheus"\n    static_configs:\n      - targets: ["localhost:9090"]\n\n  - job_name: "node"\n    static_configs:\n      - targets:\n          - "node-exporter:9100"\n\n  - job_name: "app"\n    static_configs:\n      - targets:\n          - "myapp:8080"\n    metrics_path: "/metrics"\n    scrape_interval: 10s\n\n  - job_name: "docker"\n    static_configs:\n      - targets: ["cadvisor:8080"]' },
        { type: 'heading', value: 'Docker Compose для стека мониторинга' },
        { type: 'code', language: 'yaml', value: '# docker-compose.monitoring.yml\nservices:\n  prometheus:\n    image: prom/prometheus:v2.50.0\n    volumes:\n      - ./prometheus.yml:/etc/prometheus/prometheus.yml\n      - prometheus-data:/prometheus\n    ports:\n      - "9090:9090"\n    command:\n      - "--config.file=/etc/prometheus/prometheus.yml"\n      - "--storage.tsdb.retention.time=30d"\n\n  grafana:\n    image: grafana/grafana:10.3.0\n    volumes:\n      - grafana-data:/var/lib/grafana\n    ports:\n      - "3000:3000"\n    environment:\n      GF_SECURITY_ADMIN_PASSWORD: secret\n\n  node-exporter:\n    image: prom/node-exporter:v1.7.0\n    ports:\n      - "9100:9100"\n    volumes:\n      - /proc:/host/proc:ro\n      - /sys:/host/sys:ro\n\n  alertmanager:\n    image: prom/alertmanager:v0.27.0\n    ports:\n      - "9093:9093"\n    volumes:\n      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml\n\nvolumes:\n  prometheus-data:\n  grafana-data:' },
        { type: 'note', value: 'Prometheus использует pull-модель: он сам ходит за метриками. Это проще чем push-модель (нет нужды в agent-ах). Каждый сервис выставляет /metrics endpoint в формате Prometheus.' }
      ]
    },
    {
      id: 3,
      title: 'PromQL — язык запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'PromQL — мощный язык запросов для анализа метрик. Позволяет фильтровать, агрегировать и вычислять метрики для дашбордов и алертов.' },
        { type: 'heading', value: 'Основные запросы' },
        { type: 'code', language: 'bash', value: '# Типы метрик:\n# Counter   — только растёт (total requests, errors)\n# Gauge     — текущее значение (CPU, memory, temperature)\n# Histogram — распределение (request duration)\n# Summary   — похоже на histogram (percentiles)\n\n# Простые запросы:\nnode_cpu_seconds_total                    # Все CPU метрики\nhttp_requests_total{method="GET"}         # GET запросы\nhttp_requests_total{status=~"5.."}        # 5xx ошибки (regex)\n\n# Rate — скорость изменения counter\nrate(http_requests_total[5m])             # Запросов в секунду за 5 мин\nrate(http_requests_total{status="500"}[5m])  # 500 ошибок/сек\n\n# Агрегация\nsum(rate(http_requests_total[5m]))        # Общий RPS\nsum by (method) (rate(http_requests_total[5m]))  # RPS по методу\navg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) * 100  # Средний CPU %\n\n# Процент ошибок\nsum(rate(http_requests_total{status=~"5.."}[5m]))\n/\nsum(rate(http_requests_total[5m])) * 100\n\n# Percentiles (из histogram)\nhistogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))\n# p95 латентность\n\n# Память\nnode_memory_MemTotal_bytes - node_memory_MemAvailable_bytes  # Используемая RAM\n(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100  # RAM %\n\n# Диск\n(1 - node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100  # Диск %' },
        { type: 'tip', value: 'Ключевые метрики: rate() для counter (RPS, errors/sec), histogram_quantile() для latency (p95, p99), node_* для серверных ресурсов. Всегда используй [5m] или [1m] окно для rate().' }
      ]
    },
    {
      id: 4,
      title: 'Grafana: визуализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grafana — платформа визуализации метрик. Подключается к Prometheus (и другим источникам) и создаёт красивые интерактивные дашборды.' },
        { type: 'heading', value: 'Настройка Grafana' },
        { type: 'code', language: 'bash', value: '# 1. Открыть http://localhost:3000\n# Логин: admin / secret (из docker-compose)\n\n# 2. Добавить Data Source:\n# Configuration -> Data Sources -> Add -> Prometheus\n# URL: http://prometheus:9090\n# Save & Test\n\n# 3. Импортировать готовые дашборды:\n# Dashboards -> Import\n# ID: 1860  — Node Exporter Full\n# ID: 893   — Docker Monitoring\n# ID: 3662  — Prometheus Overview\n# ID: 12740 — Kubernetes Cluster\n\n# 4. Создать свой дашборд:\n# New Dashboard -> Add Panel\n# Query: rate(http_requests_total[5m])\n# Visualization: Time series / Stat / Gauge' },
        { type: 'heading', value: 'Дашборд как код (Provisioning)' },
        { type: 'code', language: 'yaml', value: '# grafana/provisioning/datasources/prometheus.yml\napiVersion: 1\ndatasources:\n  - name: Prometheus\n    type: prometheus\n    access: proxy\n    url: http://prometheus:9090\n    isDefault: true\n\n# grafana/provisioning/dashboards/dashboards.yml\napiVersion: 1\nproviders:\n  - name: default\n    folder: ""\n    type: file\n    options:\n      path: /var/lib/grafana/dashboards\n\n# Docker Compose с provisioning:\n# grafana:\n#   image: grafana/grafana:10.3.0\n#   volumes:\n#     - ./grafana/provisioning:/etc/grafana/provisioning\n#     - ./grafana/dashboards:/var/lib/grafana/dashboards' },
        { type: 'note', value: 'Grafana dashboard provisioning позволяет хранить дашборды в Git и автоматически загружать при старте. Это Infrastructure as Code для мониторинга. Экспорт дашборда: Share -> Export -> Save to file.' }
      ]
    },
    {
      id: 5,
      title: 'Алертинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Алерты уведомляют команду о проблемах ДО того, как их заметят пользователи. Prometheus генерирует алерты, Alertmanager маршрутизирует их в Slack, email, PagerDuty.' },
        { type: 'heading', value: 'Правила алертов Prometheus' },
        { type: 'code', language: 'yaml', value: '# alert_rules.yml\ngroups:\n  - name: application\n    rules:\n      - alert: HighErrorRate\n        expr: |\n          sum(rate(http_requests_total{status=~"5.."}[5m]))\n          / sum(rate(http_requests_total[5m])) > 0.05\n        for: 5m\n        labels:\n          severity: critical\n        annotations:\n          summary: "Высокий процент ошибок (> 5%)"\n          description: "Процент 5xx ошибок: {{ $value | humanizePercentage }}"\n\n      - alert: HighLatency\n        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1\n        for: 5m\n        labels:\n          severity: warning\n        annotations:\n          summary: "Высокая латентность (p95 > 1s)"\n\n  - name: infrastructure\n    rules:\n      - alert: HighCPU\n        expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80\n        for: 10m\n        labels:\n          severity: warning\n\n      - alert: DiskSpaceLow\n        expr: (1 - node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 > 85\n        for: 5m\n        labels:\n          severity: critical' },
        { type: 'heading', value: 'Alertmanager — маршрутизация алертов' },
        { type: 'code', language: 'yaml', value: '# alertmanager.yml\nglobal:\n  slack_api_url: "https://hooks.slack.com/services/XXX"\n\nroute:\n  receiver: slack-default\n  group_by: [alertname, severity]\n  group_wait: 30s\n  group_interval: 5m\n  repeat_interval: 4h\n  routes:\n    - match:\n        severity: critical\n      receiver: slack-critical\n      repeat_interval: 1h\n    - match:\n        severity: warning\n      receiver: slack-warning\n\nreceivers:\n  - name: slack-default\n    slack_configs:\n      - channel: "#alerts"\n        title: "{{ .CommonLabels.alertname }}"\n        text: "{{ .CommonAnnotations.summary }}"\n\n  - name: slack-critical\n    slack_configs:\n      - channel: "#alerts-critical"\n        title: "CRITICAL: {{ .CommonLabels.alertname }}"' },
        { type: 'warning', value: 'Не создавай слишком много алертов — это приведёт к «alert fatigue» (команда начнёт игнорировать). Алерты должны быть actionable: каждый алерт = конкретное действие. Если действия нет — это дашборд, а не алерт.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка мониторинга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните стек мониторинга Prometheus + Grafana и настройте алерты.',
      requirements: [
        'Запустите Prometheus, Grafana и Node Exporter через Docker Compose',
        'Настройте Prometheus для сбора метрик с Node Exporter',
        'Импортируйте дашборд Node Exporter в Grafana (ID: 1860)',
        'Создайте правило алерта для CPU > 80%',
        'Настройте Alertmanager для отправки в Slack (или email)',
        'Напишите PromQL запрос для процента ошибок'
      ],
      hint: 'docker compose up -d для стека. Prometheus: http://localhost:9090. Grafana: http://localhost:3000. PromQL: rate(http_requests_total{status=~"5.."}[5m]).',
      expectedOutput: 'Prometheus собирает метрики с Node Exporter\nGrafana: дашборд с CPU, RAM, Disk в реальном времени\nАлерт HighCPU настроен и тестирован\nAlertmanager маршрутизирует в Slack\nPromQL: процент ошибок вычисляется корректно',
      solution: '# docker-compose.yml для мониторинга:\n# (см. урок 2 — полный docker-compose.monitoring.yml)\n\n# Запуск:\ndocker compose -f docker-compose.monitoring.yml up -d\n\n# Проверка:\n# Prometheus: http://localhost:9090/targets — все UP\n# Grafana: http://localhost:3000 -> Import Dashboard 1860\n\n# alert_rules.yml:\n# groups:\n#   - name: infra\n#     rules:\n#       - alert: HighCPU\n#         expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80\n#         for: 5m\n#         labels: { severity: warning }\n#         annotations: { summary: "CPU > 80%" }\n\n# alertmanager.yml:\n# route:\n#   receiver: slack\n# receivers:\n#   - name: slack\n#     slack_configs:\n#       - api_url: "$SLACK_WEBHOOK"\n#         channel: "#alerts"\n\n# PromQL для процента ошибок:\n# sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100',
      explanation: 'Prometheus scrape node-exporter каждые 15 секунд и хранит метрики. Grafana подключается к Prometheus и визуализирует данные. Alert rules проверяются каждые 15 секунд. При срабатывании (for: 5m = условие истинно 5 минут) алерт отправляется в Alertmanager, который маршрутизирует его в Slack.'
    }
  ]
}
