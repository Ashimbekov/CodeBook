export default {
  id: 10,
  title: 'AWS CloudWatch и мониторинг',
  description: 'Мониторинг и наблюдаемость: CloudWatch Metrics, Logs, Alarms, Dashboards, X-Ray для трассировки, EventBridge.',
  lessons: [
    {
      id: 1,
      title: 'CloudWatch Metrics и мониторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon CloudWatch — сервис мониторинга и наблюдаемости AWS. Собирает метрики, логи, трассировки. Позволяет настроить алармы и дашборды для контроля здоровья инфраструктуры и приложений.' },
        { type: 'heading', value: 'Компоненты CloudWatch' },
        { type: 'list', value: [
          'Metrics — числовые показатели (CPU, память, запросы, latency)',
          'Logs — текстовые логи из приложений и сервисов',
          'Alarms — оповещения при превышении порогов',
          'Dashboards — визуализация метрик и логов',
          'Events/EventBridge — реакция на изменения состояния',
          'X-Ray — распределённая трассировка запросов'
        ] },
        { type: 'code', language: 'bash', value: '# Встроенные метрики EC2:\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/EC2 \\\n  --metric-name CPUUtilization \\\n  --dimensions Name=InstanceId,Value=i-xxx \\\n  --start-time 2024-01-15T00:00:00Z \\\n  --end-time 2024-01-15T12:00:00Z \\\n  --period 300 \\\n  --statistics Average\n\n# Встроенные метрики по сервисам:\n# AWS/EC2: CPUUtilization, NetworkIn/Out, DiskReadOps\n# AWS/RDS: DatabaseConnections, FreeStorageSpace, ReadLatency\n# AWS/ELB: RequestCount, TargetResponseTime, UnHealthyHostCount\n# AWS/Lambda: Invocations, Duration, Errors, Throttles\n# AWS/S3: BucketSizeBytes, NumberOfObjects\n\n# Custom Metric — своя метрика:\naws cloudwatch put-metric-data \\\n  --namespace MyApp \\\n  --metric-name ActiveUsers \\\n  --value 150 \\\n  --unit Count \\\n  --dimensions Environment=prod,Service=api' },
        { type: 'tip', value: 'EC2 метрики собираются каждые 5 минут (бесплатно) или 1 минуту (Detailed Monitoring, $3.50/инстанс/мес). Для мониторинга RAM и диска установите CloudWatch Agent на EC2.' }
      ]
    },
    {
      id: 2,
      title: 'CloudWatch Logs',
      type: 'theory',
      content: [
        { type: 'text', value: 'CloudWatch Logs собирает, хранит и анализирует логи из EC2, Lambda, ECS, API Gateway и других сервисов. Поддерживает фильтрацию, Insights запросы и экспорт в S3.' },
        { type: 'code', language: 'bash', value: '# Структура CloudWatch Logs:\n# Log Group  → /ecs/my-app (группа логов приложения)\n#   Log Stream → ecs/app/task-id-1 (поток от конкретной задачи)\n#     Log Events → [timestamp, message]\n\n# Просмотр логов:\naws logs tail /ecs/my-app --follow --since 1h\n\n# Фильтрация:\naws logs filter-log-events \\\n  --log-group-name /ecs/my-app \\\n  --filter-pattern "ERROR" \\\n  --start-time $(date -d "1 hour ago" +%s000)\n\n# CloudWatch Logs Insights — SQL-подобные запросы:\naws logs start-query \\\n  --log-group-name /ecs/my-app \\\n  --start-time $(date -d "1 hour ago" +%s) \\\n  --end-time $(date +%s) \\\n  --query-string \'\n    fields @timestamp, @message\n    | filter @message like /ERROR/\n    | stats count(*) as errors by bin(5m)\n    | sort @timestamp desc\n    | limit 20\n  \'\n\n# Retention — срок хранения логов:\naws logs put-retention-policy \\\n  --log-group-name /ecs/my-app \\\n  --retention-in-days 30\n\n# Экспорт в S3 для долгосрочного хранения:\naws logs create-export-task \\\n  --log-group-name /ecs/my-app \\\n  --from $(date -d "7 days ago" +%s000) \\\n  --to $(date +%s000) \\\n  --destination my-logs-bucket \\\n  --destination-prefix logs/ecs' },
        { type: 'note', value: 'По умолчанию логи хранятся вечно! Обязательно настройте retention policy для каждой Log Group. 30 дней для dev, 90 дней для production, экспорт в S3 Glacier для compliance.' }
      ]
    },
    {
      id: 3,
      title: 'CloudWatch Alarms',
      type: 'theory',
      content: [
        { type: 'text', value: 'CloudWatch Alarms отслеживают метрики и отправляют уведомления или выполняют действия при превышении порогов. Можно автоматически масштабировать инфраструктуру или вызывать Lambda.' },
        { type: 'code', language: 'bash', value: '# Создание SNS Topic для уведомлений:\nTOPIC_ARN=$(aws sns create-topic --name alerts --query "TopicArn" --output text)\naws sns subscribe --topic-arn $TOPIC_ARN \\\n  --protocol email --notification-endpoint admin@example.com\n\n# Alarm: CPU > 80% в течение 5 минут\naws cloudwatch put-metric-alarm \\\n  --alarm-name high-cpu \\\n  --metric-name CPUUtilization \\\n  --namespace AWS/EC2 \\\n  --statistic Average \\\n  --period 300 \\\n  --threshold 80 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 2 \\\n  --alarm-actions $TOPIC_ARN \\\n  --dimensions Name=InstanceId,Value=i-xxx\n\n# Alarm: 5xx ошибки > 10 за 5 минут\naws cloudwatch put-metric-alarm \\\n  --alarm-name api-5xx-errors \\\n  --metric-name HTTPCode_Target_5XX_Count \\\n  --namespace AWS/ApplicationELB \\\n  --statistic Sum \\\n  --period 300 \\\n  --threshold 10 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 1 \\\n  --alarm-actions $TOPIC_ARN\n\n# Composite Alarm — объединение нескольких:\naws cloudwatch put-composite-alarm \\\n  --alarm-name critical-alert \\\n  --alarm-rule "ALARM(high-cpu) AND ALARM(api-5xx-errors)" \\\n  --alarm-actions $TOPIC_ARN' },
        { type: 'tip', value: 'Настройте три уровня алармов: Warning (70% CPU), Critical (90% CPU), Emergency (авто-восстановление). Используйте Composite Alarms чтобы избежать alert fatigue — уведомлять только когда несколько условий выполнены одновременно.' }
      ]
    },
    {
      id: 4,
      title: 'CloudWatch Dashboards',
      type: 'theory',
      content: [
        { type: 'text', value: 'CloudWatch Dashboards — настраиваемые панели для визуализации метрик и логов. Создаются через консоль или API. Можно расшарить через URL.' },
        { type: 'code', language: 'json', value: '{\n  "widgets": [\n    {\n      "type": "metric",\n      "x": 0, "y": 0, "width": 12, "height": 6,\n      "properties": {\n        "title": "EC2 CPU Utilization",\n        "metrics": [\n          ["AWS/EC2", "CPUUtilization", "InstanceId", "i-xxx", {"stat": "Average"}]\n        ],\n        "period": 300,\n        "view": "timeSeries"\n      }\n    },\n    {\n      "type": "metric",\n      "x": 12, "y": 0, "width": 12, "height": 6,\n      "properties": {\n        "title": "ALB Request Count & Latency",\n        "metrics": [\n          ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/my-alb/xxx", {"stat": "Sum"}],\n          ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", "app/my-alb/xxx", {"stat": "Average", "yAxis": "right"}]\n        ],\n        "period": 60\n      }\n    },\n    {\n      "type": "log",\n      "x": 0, "y": 6, "width": 24, "height": 6,\n      "properties": {\n        "title": "Recent Errors",\n        "query": "fields @timestamp, @message\\n| filter @message like /ERROR/\\n| sort @timestamp desc\\n| limit 20",\n        "region": "eu-central-1",\n        "stacked": false,\n        "view": "table"\n      }\n    }\n  ]\n}' },
        { type: 'code', language: 'bash', value: '# Создание Dashboard:\naws cloudwatch put-dashboard \\\n  --dashboard-name production \\\n  --dashboard-body file://dashboard.json\n\n# Список dashboards:\naws cloudwatch list-dashboards' },
        { type: 'note', value: 'Dashboard стоит $3/мес за каждый. Free Tier: 3 дашборда с 50 метриками. Создавайте отдельные дашборды: Operations (CPU, Memory, Disk), Application (Requests, Latency, Errors), Business (Users, Orders, Revenue).' }
      ]
    },
    {
      id: 5,
      title: 'AWS X-Ray: трассировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS X-Ray — сервис распределённой трассировки. Отслеживает запросы через микросервисы (API Gateway → Lambda → DynamoDB). Показывает latency, ошибки, зависимости на Service Map.' },
        { type: 'code', language: 'python', value: '# Интеграция X-Ray с Lambda (Python):\nimport json\nfrom aws_xray_sdk.core import xray_recorder\nfrom aws_xray_sdk.core import patch_all\nimport boto3\n\n# Автоматически трассирует все AWS SDK вызовы\npatch_all()\n\ndef lambda_handler(event, context):\n    # X-Ray автоматически создаёт segment для Lambda\n    \n    # Создать subsegment для бизнес-логики:\n    with xray_recorder.in_subsegment("process_order") as subsegment:\n        subsegment.put_annotation("order_id", event.get("orderId"))\n        subsegment.put_metadata("event", event)\n        \n        # Этот вызов автоматически трассируется:\n        dynamodb = boto3.resource("dynamodb")\n        table = dynamodb.Table("Orders")\n        table.put_item(Item={"orderId": event["orderId"]})\n    \n    return {"statusCode": 200}' },
        { type: 'code', language: 'bash', value: '# Включить X-Ray для Lambda:\naws lambda update-function-configuration \\\n  --function-name my-function \\\n  --tracing-config Mode=Active\n\n# Включить X-Ray для API Gateway:\naws apigateway update-stage \\\n  --rest-api-id xxx \\\n  --stage-name prod \\\n  --patch-operations op=replace,path=/tracingEnabled,value=true\n\n# Service Map показывает:\n# Client → API Gateway → Lambda → DynamoDB\n#                           ↘ S3\n# С latency и error rate для каждого звена\n\n# Запрос трассировок:\naws xray get-trace-summaries \\\n  --start-time $(date -d "1 hour ago" +%s) \\\n  --end-time $(date +%s) \\\n  --filter-expression "service(\"my-function\") AND responsetime > 1"' },
        { type: 'tip', value: 'X-Ray помогает найти bottleneck в микросервисной архитектуре. Service Map визуально показывает все зависимости и узкие места. Используйте annotations для фильтрации трассировок по бизнес-данным (user_id, order_id).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: мониторинг инфраструктуры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте мониторинг и алармы для production инфраструктуры.',
      requirements: [
        'Создайте SNS Topic для уведомлений и подпишите email',
        'Настройте Alarm на CPU > 80% для EC2 инстанса',
        'Настройте Alarm на 5xx ошибки > 5 для ALB',
        'Создайте CloudWatch Dashboard с метриками EC2, ALB, Lambda',
        'Настройте retention policy для Log Groups (30 дней)',
        'Включите X-Ray для Lambda функции'
      ],
      hint: 'SNS create-topic + subscribe. put-metric-alarm с --alarm-actions на SNS ARN. put-dashboard с JSON описанием виджетов.',
      expectedOutput: 'SNS Topic alerts создан, email подписан.\nAlarm high-cpu: CPU > 80% → уведомление.\nAlarm api-5xx: 5xx > 5 → уведомление.\nDashboard production создан с 4 виджетами.\nRetention 30 дней для /ecs/my-app.\nX-Ray включён для Lambda.',
      solution: '# SNS\nTOPIC=$(aws sns create-topic --name alerts --query "TopicArn" --output text)\naws sns subscribe --topic-arn $TOPIC --protocol email --notification-endpoint admin@example.com\n\n# CPU Alarm\naws cloudwatch put-metric-alarm \\\n  --alarm-name high-cpu \\\n  --namespace AWS/EC2 --metric-name CPUUtilization \\\n  --dimensions Name=InstanceId,Value=i-xxx \\\n  --statistic Average --period 300 --threshold 80 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 2 --alarm-actions $TOPIC\n\n# 5xx Alarm\naws cloudwatch put-metric-alarm \\\n  --alarm-name api-5xx \\\n  --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count \\\n  --dimensions Name=LoadBalancer,Value=app/my-alb/xxx \\\n  --statistic Sum --period 300 --threshold 5 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 1 --alarm-actions $TOPIC\n\n# Dashboard\naws cloudwatch put-dashboard --dashboard-name production \\\n  --dashboard-body file://dashboard.json\n\n# Log retention\naws logs put-retention-policy --log-group-name /ecs/my-app --retention-in-days 30\n\n# X-Ray\naws lambda update-function-configuration \\\n  --function-name my-function --tracing-config Mode=Active',
      explanation: 'Мониторинг — обязательный компонент production системы. Алармы обеспечивают раннее обнаружение проблем. Dashboard даёт наглядную картину состояния системы. X-Ray помогает отлаживать проблемы производительности в распределённых системах.'
    }
  ]
}
