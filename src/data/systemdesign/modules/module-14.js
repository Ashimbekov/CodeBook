export default {
  id: 14,
  title: 'Мониторинг и алерты',
  description: 'Observability: метрики, логи, трассировка. SLI, SLO, SLA. Error Budget. Инструменты: Prometheus, Grafana, Jaeger, ELK Stack.',
  lessons: [
    {
      id: 1,
      title: 'Три столпа Observability: метрики, логи, трассировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Observability (наблюдаемость) — способность понять внутреннее состояние системы по внешним сигналам. Три столпа: Metrics, Logs, Traces.' },
        { type: 'heading', value: 'Metrics (Метрики)' },
        { type: 'text', value: 'Числовые значения, агрегированные во времени.\n\nТипы метрик:\n- Counter: монотонно растущее значение (число запросов, ошибок)\n  http_requests_total{method="GET", status="200"} = 1,234,567\n- Gauge: текущее значение (CPU%, активные соединения, размер очереди)\n  active_connections{service="api"} = 342\n- Histogram: распределение значений (время ответа)\n  request_duration_seconds{le="0.1"} = 950  → 95% запросов быстрее 100мс\n\nИнструменты: Prometheus, DataDog, CloudWatch' },
        { type: 'heading', value: 'Logs (Логи)' },
        { type: 'text', value: 'Текстовые записи о событиях в системе.\n\nСтруктурированные логи (JSON):\n  {"timestamp": "2024-01-15T10:30:00Z", "level": "ERROR", "service": "order-service",\n   "trace_id": "abc123", "user_id": "456", "message": "Payment failed",\n   "error": "Connection timeout", "amount": 99.99}\n\nИнструменты: ELK Stack (Elasticsearch + Logstash + Kibana), Loki + Grafana' },
        { type: 'heading', value: 'Traces (Трассировка)' },
        { type: 'text', value: 'Отслеживание пути одного запроса через несколько сервисов.\n\nSpan: один шаг в обработке запроса\nTrace = набор связанных Spans с одним trace_id\n\nPример trace для запроса "создать заказ":\n  [API Gateway: 150мс]\n    [Order Service: 120мс]\n      [DB write: 80мс]\n      [Kafka publish: 15мс]\n      [User Service call: 20мс]\n\nИнструменты: Jaeger, Zipkin, AWS X-Ray' },
        { type: 'tip', value: 'Correlation ID (trace_id): генерировать уникальный ID на входящем запросе и передавать через все сервисы. Логировать этот ID. Потом: grep по trace_id → видим весь путь запроса через все сервисы.' }
      ]
    },
    {
      id: 2,
      title: 'SLI, SLO, SLA: договорённости об уровне сервиса',
      type: 'theory',
      content: [
        { type: 'text', value: 'SLI, SLO, SLA — иерархия договорённостей между командой и пользователями о надёжности.' },
        { type: 'heading', value: 'SLI (Service Level Indicator)' },
        { type: 'text', value: 'Измеримая метрика качества сервиса. Что мы измеряем?\n\nПримеры SLI:\n- Availability: процент успешных запросов\n  SLI = successful_requests / total_requests × 100%\n- Latency: процент запросов быстрее порога\n  SLI = requests_under_100ms / total_requests × 100%\n- Throughput: запросов в секунду\n- Error Rate: процент запросов с ошибками' },
        { type: 'heading', value: 'SLO (Service Level Objective)' },
        { type: 'text', value: 'Целевое значение SLI. Внутреннее обязательство команды.\n\nПримеры SLO:\n- Availability: 99.9% за месяц (не более 43.8 мин простоя)\n- Latency: 95% запросов быстрее 200мс; 99% быстрее 1 сек\n- Error rate: менее 0.1%\n\nSLO = цель. Более амбициозное, чем SLA.' },
        { type: 'heading', value: 'SLA (Service Level Agreement)' },
        { type: 'text', value: 'Юридически обязывающее соглашение с клиентом. Нарушение SLA → компенсация.\n\nПример AWS SLA:\n  Amazon EC2: 99.99% availability\n  Если availability 99.5%–99.99% → 10% кредит\n  Если < 99.5% → 30% кредит\n\nSLA всегда слабее SLO: компания соглашается на 99.9%, а внутренняя цель 99.99%.' },
        { type: 'note', value: 'Google SRE книга: SLO не должен быть 100% — это дорого и требует полного отсутствия деплоев. Обычно SLO = 99.9% или 99.99%. Пространство между 100% и SLO — это Error Budget.' }
      ]
    },
    {
      id: 3,
      title: 'Error Budget: бюджет ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Error Budget — допустимое количество "плохих событий" за период. Это баланс между надёжностью и скоростью разработки.' },
        { type: 'heading', value: 'Расчёт Error Budget' },
        { type: 'text', value: 'SLO = 99.9% availability за 30 дней\nTotal minutes = 30 × 24 × 60 = 43,200 мин\nError Budget = 43,200 × (1 - 0.999) = 43.2 минуты downtime в месяц\n\nЕсли система недоступна 43 минуты за месяц → Error Budget почти исчерпан.\nЕсли ещё один incident → SLO нарушен.' },
        { type: 'heading', value: 'Использование Error Budget' },
        { type: 'text', value: 'Error Budget тратится на:\n- Плановые деплои (даже риск 0.01% = трата бюджета)\n- Инциденты и аварии\n- Эксперименты и feature flags\n\nПравило Google SRE:\n- Если Error Budget > 50% остатка: команда может деплоить freely\n- Если Error Budget < 10% остатка: freeze deployments, фокус на надёжности\n- Если Error Budget = 0: никаких рискованных изменений до конца периода\n\nЭто снимает конфликт между "двигаться быстро" и "быть надёжным".' },
        { type: 'tip', value: 'Error Budget объединяет интересы Dev и Ops. Команда разработки сама заинтересована в надёжности — иначе не смогут деплоить. SRE (Site Reliability Engineering) построен вокруг этой концепции.' }
      ]
    },
    {
      id: 4,
      title: 'Алертинг: умные оповещения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Alert fatigue — усталость от алертов. Если каждый день 100 алертов и 90 ложных — команда перестаёт реагировать. Хороший алертинг — редкий, точный, actionable.' },
        { type: 'heading', value: 'Принципы хорошего алерта' },
        { type: 'list', value: [
          'Actionable: есть чёткое действие при получении алерта',
          'Rare: алерты не "шумят" постоянно',
          'Precise: мало ложных срабатываний',
          'Symptom-based: алерт на симптом (пользователи не могут войти), не причину (CPU 90%)',
          'Severity levels: P1 (разбудить), P2 (исправить завтра), P3 (logging)'
        ]},
        { type: 'heading', value: 'Плохие и хорошие алерты' },
        { type: 'text', value: 'Плохой алерт (причина):\n  CPU > 80% → может и не влиять на пользователей\n  Free disk < 20% → не срочно\n\nХороший алерт (симптом):\n  Error rate > 1% за последние 5 минут → пользователи получают ошибки!\n  p99 latency > 2 сек за последние 5 минут → система тормозит!\n  Payment failure rate > 0.5% → деньги теряются!' },
        { type: 'heading', value: 'Burn Rate алерты для SLO' },
        { type: 'text', value: 'Вместо threshold-алертов → алерты на скорость расхода Error Budget.\n\nBurn Rate = фактический error rate / allowed error rate\nBurn Rate = 1.0 → расходуем Error Budget точно по плану\nBurn Rate = 5.0 → тратим в 5 раз быстрее, за неделю исчерпаем месячный бюджет\n\nАлерт: "Burn Rate > 14.4 за 1 час" → потратим дневной бюджет за 1 час → P1 алерт!' }
      ]
    },
    {
      id: 5,
      title: 'Distributed Tracing: отслеживание запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисной архитектуре один запрос проходит через 5–20 сервисов. Найти проблему без distributed tracing — как искать иголку в стоге сена.' },
        { type: 'heading', value: 'Как работает Distributed Tracing' },
        { type: 'text', value: 'При входящем запросе создаётся trace_id (UUID).\nКаждый сервис:\n1. Читает trace_id из заголовка (X-Trace-Id)\n2. Создаёт span с временными метками\n3. Передаёт trace_id в следующий сервис\n4. Отправляет span данные в трассировочный коллектор\n\nРезультат: в Jaeger/Zipkin видим:\n  Request: trace-id=abc123\n  [Nginx: 0мс – 302мс]\n    [API Gateway: 10мс – 290мс]\n      [User Service: 15мс – 50мс]\n        [DB Query: 20мс – 45мс]\n      [Order Service: 55мс – 280мс]\n        [DB Query 1: 60мс – 100мс]\n        [Kafka Publish: 105мс – 120мс]\n        [Payment Service: 125мс – 270мс] ← ВОТ BOTTLENECK!\n          [External API: 130мс – 265мс]' },
        { type: 'heading', value: 'OpenTelemetry: стандарт трассировки' },
        { type: 'text', value: 'OpenTelemetry (OTel) — vendor-neutral стандарт для метрик, логов, трассировки.\n\nАрхитектура:\n[Services] → [OTel Collector] → [Jaeger/Zipkin (traces)]\n                              → [Prometheus (metrics)]\n                              → [Loki (logs)]\n\nОдна интеграция → данные во все инструменты.' },
        { type: 'note', value: 'Добавление tracing к существующим сервисам: обычно достаточно добавить одну библиотеку (например, opentelemetry-java-agent как java agent). Авто-инструментация перехватывает HTTP вызовы, БД запросы без изменения кода.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Dashboard и Runbook',
      type: 'practice',
      requirements: [
        'Определить Golden Signals (Rate, Errors, Duration, Saturation)',
        'Описать метрики и PromQL запросы для Grafana dashboard',
        'Настроить symptom-based алерты с приоритетами P1/P2/P3',
        'Создать runbook для основного P1 алерта',
        'Описать использование USE метода для инфраструктуры'
      ],
      hint: 'Алерты должны быть symptom-based (пользователи получают ошибки), а не cause-based (CPU 90%). Runbook снижает MTTR: дежурный не думает с чего начать, а следует инструкции. Для SLO используй Burn Rate алерты — они точнее threshold алертов.',
      expectedOutput: 'Grafana dashboard описан: четыре панели по Golden Signals с PromQL запросами. Алерты настроены с приоритетами (P1 — разбудить, P2 — завтра, P3 — logging). Runbook для error rate > 1% содержит пошаговую диагностику. USE метод применён к инфраструктурным метрикам.',
      solution: 'Мониторинг API сервиса (RED + USE методы):\n\nGrafana Dashboard — Golden Signals:\n- Rate (RPS): http_requests_total[rate 1m] — line chart\n- Errors: rate(5xx[5m]) / rate(all[5m]) × 100 — алерт > 1% за 5 мин → P1\n- Duration: histogram_quantile(0.95, request_duration_seconds_bucket[5m]) — алерт p95 > 500 мс → P2, p99 > 2с → P1\n- Saturation: CPU utilization, request queue depth → алерт CPU > 85%\n\nАлерты:\n- P1 (разбудить): Error rate > 1%, p99 latency > 2с, payment failures > 0.5%\n- P2 (исправить завтра): p95 > 500 мс, CPU > 85% sustained\n- P3 (logging): disk < 20%, connection pool usage > 70%\n\nRunbook для "API Error Rate > 1%":\n1. Grafana: какой endpoint ошибается?\n2. Jaeger: найти failed traces за 15 мин\n3. Kibana: grep "ERROR" за 15 мин\n4. Проверить недавние деплои (git log)\n5. Если новый деплой → откатить\n6. Проверить downstream: БД, Redis, внешние API\n7. Не устранено за 15 мин → эскалировать',
      explanation: 'RED метод (Rate, Errors, Duration) — минимально необходимый набор для любого сервиса. Алерты должны быть symptom-based (пользователи получают ошибки), не cause-based (CPU 90%). Runbook снижает MTTR (Mean Time To Resolve) — дежурный не тратит время на диагностику с нуля. Burn Rate алерты эффективнее threshold-алертов для SLO.',
      content: [
        { type: 'text', value: 'Спроектируем мониторинг для API сервиса.' },
        { type: 'heading', value: 'Ключевые метрики для API (RED метод)' },
        { type: 'text', value: 'R — Rate: запросов в секунду\n  http_requests_total[rate 1m]\n  Визуализация: Line chart\n\nE — Errors: процент ошибок\n  rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100\n  Алерт: > 1% за 5 минут → P1\n\nD — Duration: время ответа (percentiles)\n  histogram_quantile(0.95, rate(request_duration_seconds_bucket[5m]))\n  Алерт: p95 > 500мс → P2, p99 > 2с → P1' },
        { type: 'heading', value: 'USE метод для инфраструктуры' },
        { type: 'text', value: 'U — Utilization: загруженность ресурса\n  CPU: avg(rate(cpu_usage[5m])) → алерт > 85% sustained\n\nS — Saturation: насыщение (насколько ресурс перегружен)\n  Request queue depth → алерт > 100\n\nE — Errors: ошибки ресурса\n  Disk errors, network packet loss' },
        { type: 'heading', value: 'Runbook (Плейбук)' },
        { type: 'text', value: 'Для каждого P1/P2 алерта — runbook с инструкциями:\n\nАлерт: API Error Rate > 1%\n1. Проверить Grafana dashboard: какой endpoint ошибается?\n2. Открыть Jaeger: найти failed traces в последние 15 мин\n3. Проверить логи: grep "ERROR" за последние 15 мин в Kibana\n4. Проверить недавние деплои: git log --since="30 minutes ago"\n5. Если новый деплой → откатить\n6. Проверить downstream сервисы: Database? Redis? External API?\n7. Если не устранено за 15 мин → эскалировать L2' },
        { type: 'tip', value: 'Grafana Golden Signals dashboard: четыре панели — Latency, Traffic, Errors, Saturation. Это "Google SRE Golden Signals" — минимально необходимый набор для любого сервиса. Создайте его первым.' }
      ]
    }
  ]
}
