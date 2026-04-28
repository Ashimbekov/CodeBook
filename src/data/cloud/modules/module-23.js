export default {
  id: 23,
  title: 'Cost Optimization',
  description: 'Оптимизация облачных расходов: модели ценообразования, Reserved Instances, Spot, Savings Plans, FinOps, right-sizing.',
  lessons: [
    {
      id: 1,
      title: 'Модели ценообразования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облачные провайдеры предлагают несколько моделей ценообразования. Правильный выбор может сэкономить 30-70% расходов.' },
        { type: 'heading', value: 'Модели оплаты' },
        { type: 'list', value: [
          'On-Demand — оплата по часам/секундам, без обязательств. Для непредсказуемых нагрузок',
          'Reserved Instances (RI) — предоплата за 1-3 года, скидка 30-72%. Для стабильных нагрузок',
          'Savings Plans — обязательство на $/час за 1-3 года, скидка до 72%. Гибче RI',
          'Spot Instances — неиспользуемые мощности со скидкой 60-90%. Могут быть прерваны',
          'Free Tier — бесплатные ресурсы для экспериментов (12 месяцев или навсегда)'
        ] },
        { type: 'code', language: 'bash', value: '# Сравнение стоимости EC2 m5.large (Linux, eu-central-1):\n#\n# On-Demand:           $0.096/час = $70/мес\n# 1-year RI (no upfront): $0.060/час = $44/мес (скидка 37%)\n# 1-year RI (all upfront): $0.056/час = $41/мес (скидка 42%)\n# 3-year RI (all upfront): $0.036/час = $26/мес (скидка 63%)\n# Savings Plan 1-year:  $0.058/час = $42/мес (скидка 40%)\n# Spot Instance:        $0.029/час = $21/мес (скидка 70%)\n\n# AWS Savings Plans:\naws savingsplans create-savings-plan \\\n  --savings-plan-type ComputeSavingsPlans \\\n  --commitment 10.00 \\\n  --term-in-years 1 \\\n  --payment-option NoUpfront\n# Обязуетесь тратить $10/час на compute (EC2, Lambda, Fargate)\n# Скидка применяется автоматически\n\n# GCP Committed Use Discounts (CUD):\n# 1 год: скидка до 37%\n# 3 года: скидка до 55%\n# + Sustained Use Discounts автоматически (до 30%)\n\n# Azure Reserved Instances:\naz reservations reservation-order purchase \\\n  --sku Standard_D2s_v3 \\\n  --location westeurope \\\n  --term P1Y \\\n  --billing-scope-id /subscriptions/xxx' },
        { type: 'tip', value: 'Правило: 70% стабильных нагрузок покрывайте RI/Savings Plans. 20% переменных — On-Demand. 10% batch/fault-tolerant — Spot. Savings Plans гибче RI: автоматически применяются к EC2, Lambda, Fargate.' }
      ]
    },
    {
      id: 2,
      title: 'Spot Instances и экономия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spot Instances — неиспользуемые мощности AWS со скидкой до 90%. Могут быть прерваны с уведомлением за 2 минуты. Идеальны для fault-tolerant нагрузок.' },
        { type: 'heading', value: 'Подходящие нагрузки для Spot' },
        { type: 'list', value: [
          'CI/CD runners (GitHub Actions self-hosted, Jenkins agents)',
          'Batch processing (ETL, обработка данных, рендеринг)',
          'ML training (можно сохранять checkpoints и продолжить)',
          'Dev/Test окружения (допустимы прерывания)',
          'Web workloads (за ALB с ASG mix: On-Demand + Spot)'
        ] },
        { type: 'code', language: 'bash', value: '# Spot Instance в ASG (mixed instances):\naws autoscaling create-auto-scaling-group \\\n  --auto-scaling-group-name my-asg \\\n  --mixed-instances-policy \'{\n    "LaunchTemplate": {\n      "LaunchTemplateSpecification": {\n        "LaunchTemplateName": "my-template",\n        "Version": "$Latest"\n      },\n      "Overrides": [\n        {"InstanceType": "m5.large"},\n        {"InstanceType": "m5a.large"},\n        {"InstanceType": "m4.large"},\n        {"InstanceType": "r5.large"}\n      ]\n    },\n    "InstancesDistribution": {\n      "OnDemandBaseCapacity": 2,\n      "OnDemandPercentageAboveBaseCapacity": 30,\n      "SpotAllocationStrategy": "capacity-optimized"\n    }\n  }\' \\\n  --min-size 2 --max-size 20 --desired-capacity 4\n\n# Пояснение:\n# Первые 2 инстанса — On-Demand (стабильная база)\n# 30% сверх базы — On-Demand, 70% — Spot\n# capacity-optimized — выбирает пул с наименьшей вероятностью прерывания\n# 4 разных типа инстансов — больше доступных Spot пулов\n\n# GCP Spot VMs (Preemptible):\ngcloud compute instances create my-spot \\\n  --provisioning-model=SPOT \\\n  --instance-termination-action=STOP\n\n# Azure Spot VMs:\naz vm create --name my-spot --priority Spot \\\n  --eviction-policy Deallocate --max-price 0.05' },
        { type: 'tip', value: 'Spot Instances: используйте capacity-optimized стратегию и несколько типов инстансов (m5, m5a, m4, r5) для максимальной доступности. Spot Fleet с 4+ типами инстансов снижает вероятность прерывания до минимума.' }
      ]
    },
    {
      id: 3,
      title: 'Right-Sizing и оптимизация ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Right-Sizing — выбор оптимального размера ресурсов на основе реального потребления. По статистике 40% облачных ресурсов oversized (используется <50% выделенных мощностей).' },
        { type: 'code', language: 'bash', value: '# AWS Compute Optimizer — рекомендации по right-sizing:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --query "instanceRecommendations[].{Instance:instanceArn,Current:currentInstanceType,Recommended:recommendationOptions[0].instanceType,Savings:recommendationOptions[0].estimatedMonthlySavings.value}" \\\n  --output table\n\n# Пример вывода:\n# Instance    | Current      | Recommended  | Savings\n# i-xxx...    | m5.xlarge    | m5.large     | $48.00\n# i-yyy...    | r5.2xlarge   | r5.xlarge    | $126.00\n# Итого экономия: $174/мес = $2088/год!\n\n# CloudWatch метрики для анализа:\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/EC2 \\\n  --metric-name CPUUtilization \\\n  --dimensions Name=InstanceId,Value=i-xxx \\\n  --start-time $(date -d "7 days ago" +%Y-%m-%dT%H:%M:%S) \\\n  --end-time $(date +%Y-%m-%dT%H:%M:%S) \\\n  --period 3600 \\\n  --statistics Average Maximum\n\n# Если средний CPU < 20% и макс < 50% за неделю — уменьшайте!\n\n# Удаление неиспользуемых ресурсов:\n# Elastic IPs без привязки: $3.65/мес каждый\n# EBS volumes без привязки: от $0.10/GB/мес\n# Старые snapshots: накапливаются и стоят\n# Неиспользуемые NAT Gateways: $32/мес\n# Idle load balancers: $16/мес' },
        { type: 'note', value: 'Запускайте Compute Optimizer и Trusted Advisor ежемесячно. Автоматизируйте выключение dev/test ресурсов на ночь и выходные (Instance Scheduler). Это может сэкономить 65% стоимости dev окружений.' }
      ]
    },
    {
      id: 4,
      title: 'FinOps: финансовое управление облаком',
      type: 'theory',
      content: [
        { type: 'text', value: 'FinOps (Cloud Financial Operations) — практика управления облачными расходами с участием engineering, finance и бизнеса. Ключевые принципы: visibility, optimization, operation.' },
        { type: 'heading', value: 'FinOps практики' },
        { type: 'list', value: [
          'Tagging Strategy — все ресурсы помечены тегами (team, project, environment, cost-center)',
          'Cost Allocation — распределение расходов по командам/проектам через теги',
          'Budget Alerts — оповещения при приближении к бюджету (50%, 80%, 100%)',
          'Showback/Chargeback — показать командам их расходы (или выставить счёт)',
          'Anomaly Detection — автоматическое обнаружение аномальных расходов',
          'Unit Economics — стоимость на пользователя/транзакцию/API вызов'
        ] },
        { type: 'code', language: 'bash', value: '# AWS Cost Explorer API:\naws ce get-cost-and-usage \\\n  --time-period Start=2024-01-01,End=2024-01-31 \\\n  --granularity MONTHLY \\\n  --metrics BlendedCost \\\n  --group-by Type=TAG,Key=Team\n\n# Бюджет с оповещениями:\naws budgets create-budget \\\n  --account-id 123456789012 \\\n  --budget \'{\n    "BudgetName": "monthly-budget",\n    "BudgetLimit": {"Amount": "1000", "Unit": "USD"},\n    "TimeUnit": "MONTHLY",\n    "BudgetType": "COST"\n  }\' \\\n  --notifications-with-subscribers \'[{\n    "Notification": {\n      "NotificationType": "ACTUAL",\n      "ComparisonOperator": "GREATER_THAN",\n      "Threshold": 80\n    },\n    "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "admin@company.com"}]\n  }]\'\n\n# Cost Anomaly Detection:\naws ce create-anomaly-monitor \\\n  --anomaly-monitor \'{\n    "MonitorName": "cost-anomaly",\n    "MonitorType": "DIMENSIONAL",\n    "MonitorDimension": "SERVICE"\n  }\'\n\n# Обязательная стратегия тегирования:\n# Environment: dev/staging/prod\n# Team: platform/backend/data\n# Project: myapp/analytics/ml\n# CostCenter: CC-1234' },
        { type: 'tip', value: 'Начните FinOps с тегирования. Без тегов невозможно понять кто и зачем тратит деньги. Используйте AWS Organizations Tag Policies для принудительного тегирования. Unit economics ($/ на пользователя) — лучшая метрика для бизнеса.' }
      ]
    },
    {
      id: 5,
      title: 'Инструменты оптимизации стоимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый провайдер предоставляет инструменты для анализа и оптимизации расходов. Существуют также сторонние платформы для Multi-Cloud FinOps.' },
        { type: 'code', language: 'bash', value: '# AWS:\n# Cost Explorer — визуализация расходов\n# Budgets — бюджеты и оповещения\n# Compute Optimizer — right-sizing рекомендации\n# Trusted Advisor — best practices (включая cost optimization)\n# Savings Plans/RI Recommendations\n# Cost Anomaly Detection\n\n# GCP:\n# Billing Reports — визуализация\n# Budgets & Alerts\n# Recommender — right-sizing, idle resources\n# Committed Use Discounts analysis\n# Active Assist — AI рекомендации\n\n# Azure:\n# Cost Management + Billing\n# Azure Advisor — рекомендации\n# Reserved Instances advisor\n# Azure Hybrid Benefit (лицензии Windows)\n\n# Multi-Cloud / сторонние:\n# Infracost — стоимость Terraform изменений в PR\n# Kubecost — стоимость Kubernetes workloads\n# CloudHealth (VMware) — Multi-Cloud FinOps\n# Spot.io (NetApp) — автоматическая Spot оптимизация\n\n# Infracost — показать стоимость в PR:\n# infracost diff --path=.\n# Monthly cost will increase by $45 (+12%)\n# ├── aws_instance.web: +$35\n# └── aws_rds_instance.db: +$10' },
        { type: 'list', value: [
          'Регулярный аудит: ежемесячный review расходов с командами',
          'Автоматизация: выключение dev ресурсов на ночь (Lambda + EventBridge)',
          'Serverless: Lambda/Fargate вместо постоянно работающих EC2 для переменных нагрузок',
          'Graviton: ARM инстансы на 20% дешевле при аналогичной производительности',
          'Data transfer: минимизируйте cross-region и internet egress трафик'
        ] },
        { type: 'note', value: 'Data transfer — скрытый расход в облаке. Внутри AZ — бесплатно. Между AZ — $0.01/GB. Между регионами — $0.02/GB. Из облака в интернет — $0.09/GB. Используйте VPC Endpoints и CloudFront для оптимизации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: оптимизация облачных расходов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проанализируйте расходы и примените оптимизации для снижения стоимости.',
      requirements: [
        'Настройте AWS Budget с оповещением на 80% от $500/мес',
        'Запустите Compute Optimizer и проанализируйте рекомендации',
        'Найдите неиспользуемые Elastic IPs и EBS volumes',
        'Рассчитайте экономию от перехода на Savings Plans',
        'Настройте автоматическое выключение dev инстансов на ночь',
        'Внедрите обязательную стратегию тегирования'
      ],
      hint: 'aws budgets create-budget для бюджета. aws compute-optimizer для рекомендаций. aws ec2 describe-addresses --filter "Name=association-id,Values=" для неиспользуемых EIP.',
      expectedOutput: 'Budget $500/мес с оповещением на 80% создан.\nCompute Optimizer: 3 инстанса можно уменьшить (экономия $120/мес).\n2 неиспользуемых EIP ($7.30/мес) и 5 EBS volumes ($15/мес).\nSavings Plans: экономия $200/мес при 1-year commitment.\nDev инстансы выключаются в 20:00, включаются в 08:00.\nТеги: Environment, Team, Project обязательны.',
      solution: '# Budget\naws budgets create-budget --account-id 123456789012 \\\n  --budget \'{"BudgetName":"monthly","BudgetLimit":{"Amount":"500","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}\' \\\n  --notifications-with-subscribers \'[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"admin@company.com"}]}]\'\n\n# Right-sizing\naws compute-optimizer get-ec2-instance-recommendations --output table\n\n# Неиспользуемые EIPs\naws ec2 describe-addresses --query "Addresses[?AssociationId==null].{IP:PublicIp,AllocationId:AllocationId}" --output table\n\n# Неиспользуемые EBS\naws ec2 describe-volumes --filters "Name=status,Values=available" --query "Volumes[].{ID:VolumeId,Size:Size,Created:CreateTime}" --output table\n\n# Savings Plans рекомендации\naws savingsplans describe-savings-plans-offering-rates --query "searchResults[0]"\n\n# Auto stop/start (через EventBridge + Lambda или Instance Scheduler)\n# Tag: AutoStop=true на dev инстансах\n# EventBridge: cron(0 20 ? * MON-FRI *) → Lambda stop\n# EventBridge: cron(0 8 ? * MON-FRI *) → Lambda start',
      explanation: 'Оптимизация стоимости — непрерывный процесс. Budget alerts предотвращают перерасход. Right-sizing и удаление неиспользуемых ресурсов дают быструю экономию. Savings Plans — долгосрочная экономия для стабильных нагрузок. Автоматизация dev/test — до 65% экономии.'
    }
  ]
}
