export default {
  id: 41,
  title: 'Incident Management',
  description: 'Процесс реагирования на инциденты: on-call ротации, PagerDuty, постмортемы и SLI/SLO/SLA для обеспечения надёжности сервисов.',
  lessons: [
    {
      id: 1,
      title: 'Процесс реагирования на инциденты',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Incident Response Process' },
        { type: 'text', value: 'Инцидент — это незапланированное событие, снижающее качество сервиса. Процесс реагирования определяет, как команда обнаруживает, координирует и решает инциденты с минимальным влиянием на пользователей.' },
        { type: 'code', language: 'bash', value: '# Фазы Incident Response:\n#\n# 1. DETECTION (обнаружение)\n#    - Мониторинг алерты (Prometheus, Datadog)\n#    - Жалобы пользователей\n#    - Status checks\n#    Цель: узнать о проблеме первым, до пользователей\n#\n# 2. TRIAGE (приоритизация)\n#    - Определить severity (SEV1-SEV4)\n#    - Оценить impact (сколько пользователей затронуто)\n#    - Назначить Incident Commander\n#\n# 3. RESPONSE (реагирование)\n#    - Собрать команду реагирования\n#    - Диагностика и локализация проблемы\n#    - War room (канал в Slack)\n#\n# 4. MITIGATION (смягчение)\n#    - Применить workaround или fix\n#    - Откат к предыдущей версии (если деплой)\n#    - Масштабирование ресурсов\n#\n# 5. RESOLUTION (разрешение)\n#    - Полное исправление root cause\n#    - Проверка всех метрик\n#    - Закрытие инцидента\n#\n# 6. POST-INCIDENT (анализ)\n#    - Postmortem в течение 48 часов\n#    - Action items для предотвращения' },
        { type: 'heading', value: 'Severity Levels' },
        { type: 'list', items: [
          'SEV1 (Critical) — полная недоступность сервиса, потеря данных. Реакция: немедленно, все on-call.',
          'SEV2 (Major) — значительная деградация, большой % пользователей. Реакция: 15 минут, primary on-call.',
          'SEV3 (Minor) — частичная деградация, малый % пользователей. Реакция: 1 час, рабочее время.',
          'SEV4 (Low) — косметические проблемы, workaround существует. Реакция: следующий рабочий день.'
        ] },
        { type: 'tip', value: 'Определите severity до начала расследования. Это определяет уровень мобилизации и время реакции. Лучше начать с SEV1 и понизить, чем пропустить серьёзный инцидент.' }
      ]
    },
    {
      id: 2,
      title: 'On-Call ротация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Организация On-Call' },
        { type: 'text', value: 'On-call — дежурство инженеров для реагирования на инциденты 24/7. Хорошо организованный on-call минимизирует burnout и обеспечивает быстрое реагирование.' },
        { type: 'code', language: 'bash', value: '# Принципы здорового On-Call:\n#\n# 1. Ротация: каждый инженер дежурит не чаще 1 недели в месяц\n# 2. Компенсация: оплата или отгулы за дежурство\n# 3. Runbooks: документация по решению типовых проблем\n# 4. Эскалация: если primary не отвечает за 10 мин -> secondary\n# 5. Порог алертов: не более 2 pageable алертов за ночь (иначе чинить)\n# 6. Handoff: передача смены с описанием текущих проблем\n# 7. Blameless: не наказывать за ошибки, учиться на них\n\n# Расписание ротации:\n# Неделя 1: Alice (primary), Bob (secondary)\n# Неделя 2: Bob (primary), Charlie (secondary)\n# Неделя 3: Charlie (primary), Alice (secondary)\n# ...\n\n# Escalation policy:\n# 0 мин  -> Primary on-call (SMS + phone)\n# 10 мин -> Secondary on-call\n# 20 мин -> Engineering Manager\n# 30 мин -> VP Engineering' },
        { type: 'heading', value: 'Runbooks' },
        { type: 'code', language: 'bash', value: '# Runbook — пошаговая инструкция по решению проблемы\n# Каждый алерт должен иметь ссылку на runbook\n\n# Пример: Runbook для "High Error Rate"\n# ========================================\n# Алерт: ErrorRateHigh (> 1%)\n# Severity: SEV2\n# Service: api-gateway\n#\n# 1. Проверить дашборд:\n#    https://grafana.company.com/d/api-overview\n#\n# 2. Определить источник ошибок:\n#    - Конкретный endpoint?\n#    - Конкретный upstream сервис?\n#    - Все запросы или определённый паттерн?\n#\n# 3. Проверить недавние деплои:\n#    kubectl rollout history deployment/api-gateway -n production\n#    Если деплой был < 1 часа назад -> rollback:\n#    kubectl rollout undo deployment/api-gateway -n production\n#\n# 4. Проверить зависимости:\n#    - Database: kubectl exec pg-0 -- pg_isready\n#    - Redis: kubectl exec redis-0 -- redis-cli ping\n#    - External APIs: curl -s https://ext-api.com/health\n#\n# 5. Проверить ресурсы:\n#    kubectl top pods -n production\n#    Если OOM или CPU throttling -> увеличить resources\n#\n# 6. Эскалация:\n#    Если не решено за 30 мин -> эскалировать в #incident-channel' },
        { type: 'note', value: 'Хороший runbook должен быть понятен инженеру, который впервые видит этот сервис. Включайте ссылки на дашборды, команды для диагностики и чёткие шаги для решения.' }
      ]
    },
    {
      id: 3,
      title: 'PagerDuty и OpsGenie',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Системы управления инцидентами' },
        { type: 'text', value: 'PagerDuty и OpsGenie — SaaS-платформы для управления инцидентами. Они принимают алерты от мониторинга, уведомляют on-call, управляют эскалацией и координируют реагирование.' },
        { type: 'code', language: 'yaml', value: '# Prometheus Alertmanager -> PagerDuty\n# alertmanager.yml\nroute:\n  receiver: default\n  routes:\n    - match:\n        severity: critical\n      receiver: pagerduty-critical\n      group_wait: 30s\n      group_interval: 5m\n      repeat_interval: 4h\n    - match:\n        severity: warning\n      receiver: slack-warnings\n      repeat_interval: 12h\n\nreceivers:\n  - name: default\n    slack_configs:\n      - api_url: https://hooks.slack.com/services/xxx\n        channel: \"#alerts\"\n\n  - name: pagerduty-critical\n    pagerduty_configs:\n      - service_key: your-pagerduty-service-key\n        severity: critical\n        description: \"{{ .GroupLabels.alertname }}: {{ .Annotations.summary }}\"\n        details:\n          firing: \"{{ .Alerts.Firing | len }}\"\n          dashboard: \"https://grafana.company.com/d/overview\"\n\n  - name: slack-warnings\n    slack_configs:\n      - api_url: https://hooks.slack.com/services/xxx\n        channel: \"#alerts-warning\"\n        title: \"{{ .GroupLabels.alertname }}\"\n        text: \"{{ .Annotations.summary }}\"' },
        { type: 'heading', value: 'Интеграция с инструментами' },
        { type: 'code', language: 'bash', value: '# PagerDuty Event API\ncurl -X POST https://events.pagerduty.com/v2/enqueue \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "routing_key": "your-integration-key",\n    "event_action": "trigger",\n    "dedup_key": "api-error-rate-high",\n    "payload": {\n      "summary": "API error rate > 5%",\n      "severity": "critical",\n      "source": "prometheus",\n      "custom_details": {\n        "error_rate": "5.2%",\n        "affected_endpoints": "/api/orders, /api/payments",\n        "runbook": "https://wiki.company.com/runbooks/error-rate"\n      }\n    },\n    "links": [{\n      "href": "https://grafana.company.com/d/api",\n      "text": "Grafana Dashboard"\n    }]\n  }\'\n\n# Resolve инцидент\ncurl -X POST https://events.pagerduty.com/v2/enqueue \\\n  -d \'{\n    "routing_key": "your-integration-key",\n    "event_action": "resolve",\n    "dedup_key": "api-error-rate-high"\n  }\'' },
        { type: 'tip', value: 'Настройте dedup_key для группировки алертов одного инцидента. Без dedup_key каждый алерт создаёт новый инцидент, что вызывает alert fatigue у on-call инженера.' }
      ]
    },
    {
      id: 4,
      title: 'Постмортемы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Blameless Postmortem' },
        { type: 'text', value: 'Постмортем — документ, описывающий инцидент, его причины, timeline и action items. "Blameless" означает, что фокус на системных проблемах, а не на поиске виноватых. Цель — предотвратить повторение.' },
        { type: 'code', language: 'bash', value: '# Шаблон Postmortem:\n#\n# INCIDENT REPORT: [Title]\n# Date: 2024-03-15\n# Duration: 45 minutes\n# Severity: SEV1\n# Author: Alice (Incident Commander)\n#\n# == SUMMARY ==\n# API был недоступен 45 минут из-за исчерпания\n# connection pool PostgreSQL после деплоя v2.3.1.\n# Затронуто ~15,000 пользователей.\n#\n# == IMPACT ==\n# - 100% API запросов возвращали 503\n# - 15,000 активных пользователей затронуты\n# - ~$5,000 потерянного дохода\n# - SLO нарушен: доступность упала до 96.8% (цель 99.9%)\n#\n# == TIMELINE (UTC) ==\n# 14:00 — Деплой v2.3.1 в production\n# 14:05 — Алерт: Error Rate > 1% (автоматический)\n# 14:07 — On-call Alice подтвердила инцидент\n# 14:10 — Создан Slack канал #inc-2024-0315\n# 14:15 — Диагностика: PostgreSQL connection pool exhausted\n# 14:20 — v2.3.1 имеет утечку соединений (не закрывает при ошибке)\n# 14:25 — Rollback к v2.3.0 начат\n# 14:35 — Rollback завершён\n# 14:40 — Connection pool восстановлен\n# 14:45 — Все метрики в норме, инцидент закрыт' },
        { type: 'heading', value: 'Root Cause Analysis' },
        { type: 'code', language: 'bash', value: '# == ROOT CAUSE ==\n# В v2.3.1 был добавлен новый database middleware,\n# который не закрывал соединения при HTTP 4xx ошибках.\n# При нормальном трафике это проявлялось через 5-10 минут,\n# исчерпывая connection pool (max_connections=100).\n#\n# == CONTRIBUTING FACTORS ==\n# 1. Отсутствие integration test для connection lifecycle\n# 2. Staging не имел достаточного трафика для выявления\n# 3. Алерт на connection pool не был настроен\n# 4. Canary deployment не использовался\n#\n# == WHAT WENT WELL ==\n# 1. Алерт на error rate сработал через 5 минут\n# 2. On-call ответил за 2 минуты\n# 3. Rollback выполнен за 10 минут\n# 4. Коммуникация в Slack канале была чёткой\n#\n# == ACTION ITEMS ==\n# [P0] Исправить утечку соединений в middleware (owner: Bob, due: 2024-03-18)\n# [P0] Добавить алерт на pg_stat_activity > 80% (owner: Alice, due: 2024-03-16)\n# [P1] Добавить integration test для connection lifecycle (owner: Charlie)\n# [P1] Внедрить canary deployment для production (owner: DevOps team)\n# [P2] Увеличить connection pool до 200 (owner: DBA team)\n# [P2] Настроить load testing в staging (owner: QA team)' },
        { type: 'warning', value: 'Постмортем должен быть написан в течение 48 часов после инцидента, пока детали свежи. Action items должны иметь owner и deadline. Без action items постмортем бесполезен.' }
      ]
    },
    {
      id: 5,
      title: 'SLI, SLO и SLA',
      type: 'theory',
      content: [
        { type: 'heading', value: 'SLI — Service Level Indicators' },
        { type: 'text', value: 'SLI, SLO и SLA — иерархия обязательств по надёжности сервиса. SLI — метрика, SLO — цель, SLA — контракт с последствиями. Они определяют, насколько надёжен сервис и когда пора инвестировать в надёжность vs фичи.' },
        { type: 'code', language: 'bash', value: '# SLI (Service Level Indicator) — ЧТО измеряем\n# Количественная метрика качества сервиса:\n# - Availability: % успешных запросов (non-5xx / total)\n# - Latency: % запросов быстрее порога (p99 < 500ms)\n# - Throughput: % запросов обработанных (vs dropped)\n# - Error rate: % ошибочных запросов\n\n# SLO (Service Level Objective) — КАКУЮ цель ставим\n# Целевое значение SLI за период:\n# - Availability SLO: 99.9% за 30 дней\n# - Latency SLO: 99% запросов < 200ms за 30 дней\n\n# SLA (Service Level Agreement) — ЧТО будет при нарушении\n# Контракт с клиентом:\n# - "99.9% availability. При нарушении — кредит 10% за каждые 0.1%"\n# - SLA обычно менее строгий чем SLO\n#   SLO: 99.95%, SLA: 99.9% (запас = error budget)' },
        { type: 'heading', value: 'Error Budget' },
        { type: 'code', language: 'bash', value: '# Error Budget = 1 - SLO\n# SLO 99.9% -> Error Budget = 0.1%\n#\n# За 30 дней (43,200 минут):\n# Error Budget = 43,200 * 0.001 = 43.2 минуты downtime\n#\n# Примеры:\n# 99%    -> 7.2 часа downtime в месяц    (432 мин)\n# 99.9%  -> 43.2 минуты в месяц\n# 99.95% -> 21.6 минуты в месяц\n# 99.99% -> 4.32 минуты в месяц\n# 99.999% -> 26 секунд в месяц\n\n# Использование Error Budget:\n# Budget > 50% -> Деплоим фичи, экспериментируем\n# Budget 25-50% -> Осторожный деплой, больше тестирования\n# Budget < 25% -> Фокус на надёжности, заморозка фич\n# Budget = 0% -> Полная заморозка деплоев, только исправления' },
        { type: 'heading', value: 'Prometheus метрики для SLO' },
        { type: 'code', language: 'bash', value: '# Availability SLI (PromQL)\nsum(rate(http_requests_total{status!~"5.."}[30d]))\n/ sum(rate(http_requests_total[30d]))\n# Результат: 0.9987 = 99.87%\n\n# Error Budget remaining\n1 - (\n  (1 - (\n    sum(rate(http_requests_total{status!~\"5..\"}[30d]))\n    / sum(rate(http_requests_total[30d]))\n  )) / (1 - 0.999)  # SLO = 99.9%\n)\n# Результат: 0.87 = 87% бюджета осталось\n\n# Latency SLI (% запросов < 200ms)\nsum(rate(http_request_duration_seconds_bucket{le=\"0.2\"}[30d]))\n/ sum(rate(http_request_duration_seconds_count[30d]))\n\n# Burn rate alert (сколько бюджета сжигаем в час)\n# Если burn rate > 14.4, бюджет кончится за 1 час\n# Если burn rate > 6, бюджет кончится за 5 часов' },
        { type: 'tip', value: 'Начните с 2-3 SLO: availability и latency для главного API. Error Budget определяет баланс между фичами и надёжностью. Когда бюджет заканчивается — вся команда работает над reliability.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Incident Management Setup',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте процесс управления инцидентами: on-call ротацию, алерты с эскалацией, SLO и шаблон постмортема.',
      requirements: [
        'Настройте Alertmanager с маршрутизацией по severity (critical -> PagerDuty, warning -> Slack)',
        'Создайте escalation policy: primary -> secondary -> manager',
        'Определите SLO для API: availability 99.9%, latency p99 < 500ms',
        'Создайте Prometheus записи для Error Budget',
        'Напишите runbook для алерта "High Error Rate"',
        'Создайте шаблон постмортема с обязательными разделами'
      ],
      hint: 'Настройте Alertmanager routes по match severity. SLO через recording rules в Prometheus. Error Budget = 1 - (error_rate / (1 - SLO_target)).',
      expectedOutput: 'Alertmanager routes: critical -> PagerDuty, warning -> Slack\nEscalation: 0min -> primary, 10min -> secondary, 20min -> manager\nSLO dashboard: availability 99.87%, error budget 87% remaining\nRunbook: HighErrorRate -> 6 шагов диагностики\nPostmortem template: Summary, Impact, Timeline, Root Cause, Action Items',
      solution: '# 1. Alertmanager config\n# route:\n#   routes:\n#     - match: { severity: critical }\n#       receiver: pagerduty\n#     - match: { severity: warning }\n#       receiver: slack\n\n# 2. SLO Recording Rules\n# - record: slo:api_availability:ratio_rate30d\n#   expr: sum(rate(http_requests_total{status!~"5.."}[30d])) / sum(rate(http_requests_total[30d]))\n# - record: slo:api_error_budget:ratio\n#   expr: 1 - ((1 - slo:api_availability:ratio_rate30d) / (1 - 0.999))\n\n# 3. Error Budget Alert\n# alert: ErrorBudgetBurnRate\n# expr: slo:api_error_budget:ratio < 0.25\n# labels: { severity: critical }\n# annotations: { summary: "Error budget < 25% remaining" }\n\n# 4. Runbook для HighErrorRate\n# 1. Проверить дашборд\n# 2. Определить endpoint\n# 3. Проверить недавние деплои\n# 4. Проверить зависимости\n# 5. Rollback если деплой\n# 6. Эскалация через 30 мин',
      explanation: 'Incident Management — это процесс, а не инструмент. Alertmanager маршрутизирует алерты по severity. On-call обеспечивает 24/7 реагирование. SLO определяют допустимый уровень надёжности. Error Budget балансирует фичи и надёжность. Постмортемы предотвращают повторение инцидентов.'
    }
  ]
}
