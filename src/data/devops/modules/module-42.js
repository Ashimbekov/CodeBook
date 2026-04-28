export default {
  id: 42,
  title: 'FinOps: оптимизация затрат',
  description: 'FinOps — практика управления облачными затратами. Right-sizing, Reserved Instances, Savings Plans, мониторинг и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Основы облачных затрат',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Модель ценообразования облака' },
        { type: 'text', value: 'Облачные расходы складываются из вычислений (CPU/RAM), хранения (диски, объектное хранилище), сети (трафик, балансировщики) и сервисов (БД, очереди, мониторинг). Без контроля расходы растут экспоненциально.' },
        { type: 'code', language: 'bash', value: '# Топ категорий облачных расходов:\n#\n# 1. Compute (40-60%) — EC2, EKS nodes, Lambda\n#    - Неиспользуемые/oversized инстансы\n#    - Отсутствие autoscaling\n#    - Постоянно работающие dev/staging окружения\n#\n# 2. Storage (15-25%) — EBS, S3, RDS storage\n#    - Старые снимки и бэкапы\n#    - Неоптимальный тип хранилища\n#    - Отсутствие lifecycle policies\n#\n# 3. Data Transfer (10-20%) — между регионами, в интернет\n#    - Cross-AZ трафик\n#    - Нет CDN для статики\n#\n# 4. Managed Services (10-20%) — RDS, ElastiCache, EKS\n#    - Multi-AZ для dev окружений\n#    - Oversized database instances' },
        { type: 'heading', value: 'FinOps как практика' },
        { type: 'list', items: [
          'Inform — Видимость: кто, сколько и зачем тратит (tagging, reports)',
          'Optimize — Оптимизация: right-sizing, reserved instances, spot',
          'Operate — Управление: бюджеты, алерты, governance, автоматизация'
        ] },
        { type: 'code', language: 'bash', value: '# Быстрые wins для экономии:\n\n# 1. Выключать dev/staging на ночь и выходные (-65%)\n# 2. Right-size oversized инстансы (-30-50%)\n# 3. Использовать Spot/Preemptible для CI/CD (-60-90%)\n# 4. Reserved Instances для production (-40-72%)\n# 5. Удалить неиспользуемые ресурсы (EBS, EIP, snapshots)\n# 6. S3 Lifecycle — перемещать в Glacier (-80%)\n# 7. ARM/Graviton инстансы (-20% при той же производительности)' },
        { type: 'tip', value: 'Начните с тегирования (tagging) всех ресурсов: team, project, environment, owner. Без тегов невозможно определить, кто и зачем тратит деньги.' }
      ]
    },
    {
      id: 2,
      title: 'Right-Sizing',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Оптимизация размера ресурсов' },
        { type: 'text', value: 'Right-sizing — приведение размера ресурсов в соответствие с реальной нагрузкой. По статистике AWS, 40% инстансов oversized (используют < 40% выделенных ресурсов). Уменьшение типа инстанса может сэкономить 30-50%.' },
        { type: 'code', language: 'bash', value: '# Анализ утилизации EC2\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/EC2 \\\n  --metric-name CPUUtilization \\\n  --dimensions Name=InstanceId,Value=i-0123456789 \\\n  --start-time $(date -d "7 days ago" -u +%Y-%m-%dT%H:%M:%S) \\\n  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \\\n  --period 3600 \\\n  --statistics Average Maximum\n\n# AWS Compute Optimizer — автоматические рекомендации\naws compute-optimizer get-ec2-instance-recommendations \\\n  --instance-arns arn:aws:ec2:us-east-1:123456:instance/i-xxx\n\n# Пример right-sizing:\n# Текущий: m5.xlarge (4 vCPU, 16GB) — avg CPU 15%, avg RAM 30%\n# Рекомендация: m5.large (2 vCPU, 8GB) — экономия ~50%\n# Или: t3.large (burstable) — экономия ~60%' },
        { type: 'heading', value: 'Kubernetes Right-Sizing' },
        { type: 'code', language: 'bash', value: '# VPA (Vertical Pod Autoscaler) — рекомендации для K8s\nkubectl get vpa --all-namespaces\n\n# Типичная проблема в Kubernetes:\n# requests: { cpu: 1000m, memory: 1Gi }  # Запрошено\n# Реальное использование: cpu: 150m, memory: 200Mi  # Факт\n# Потери: 850m CPU, 824Mi RAM на каждый pod!\n\n# Инструменты для анализа:\n# Goldilocks — рекомендации resource requests\n# kubectl-cost — стоимость по namespace/deployment\n# Kubecost — полный FinOps для Kubernetes' },
        { type: 'code', language: 'yaml', value: '# VPA для автоматической оптимизации resources\napiVersion: autoscaling.k8s.io/v1\nkind: VerticalPodAutoscaler\nmetadata:\n  name: myapp-vpa\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: myapp\n  updatePolicy:\n    updateMode: \"Off\"  # Только рекомендации (безопасно)\n  resourcePolicy:\n    containerPolicies:\n      - containerName: app\n        minAllowed:\n          cpu: 100m\n          memory: 128Mi\n        maxAllowed:\n          cpu: 2000m\n          memory: 2Gi' },
        { type: 'note', value: 'Начните VPA в режиме "Off" (только рекомендации). Проанализируйте рекомендации, затем вручную обновите requests. Режим "Auto" автоматически перезапускает pods, что может вызвать downtime.' }
      ]
    },
    {
      id: 3,
      title: 'Reserved Instances и Savings Plans',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Committed Use Discounts' },
        { type: 'text', value: 'Reserved Instances (RI) и Savings Plans — это обязательства по использованию ресурсов на 1 или 3 года в обмен на скидки до 72%. Подходят для стабильных baseline нагрузок.' },
        { type: 'code', language: 'bash', value: '# Модели оплаты AWS:\n#\n# On-Demand:        $0.0464/час (m5.large, us-east-1)\n# 1-Year RI (No Upfront):    $0.0292/час (-37%)\n# 1-Year RI (All Upfront):   $0.0270/час (-42%)\n# 3-Year RI (All Upfront):   $0.0174/час (-63%)\n# Savings Plan (1yr):        $0.0293/час (-37%)\n# Spot Instance:             $0.0139/час (-70%)\n#\n# Стратегия:\n# Baseline (постоянная нагрузка) -> Reserved/Savings Plan\n# Пиковая нагрузка -> On-Demand + Autoscaling\n# Batch/CI/CD -> Spot Instances\n# Dev/Test -> Spot + выключение на ночь' },
        { type: 'heading', value: 'Savings Plans vs Reserved Instances' },
        { type: 'code', language: 'bash', value: '# Reserved Instances:\n# + Максимальная скидка (до 72%)\n# - Привязка к конкретному типу инстанса и региону\n# - Сложнее управлять\n\n# Savings Plans:\n# + Гибкость: можно менять тип инстанса и регион\n# + Проще в управлении\n# + Распространяется на EC2, Lambda, Fargate\n# - Скидка чуть меньше чем у RI\n\n# Compute Savings Plan (самый гибкий):\n# Обязательство: $X/час на любые compute ресурсы\naws savingsplans create-savings-plan \\\n  --savings-plan-offering-id xxx \\\n  --commitment 10.00 \\\n  --savings-plan-type ComputeSavingsPlans \\\n  --term-in-years 1\n\n# Анализ покупки\naws ce get-savings-plans-purchase-recommendation \\\n  --savings-plans-type COMPUTE_SP \\\n  --term-in-years ONE_YEAR \\\n  --payment-option NO_UPFRONT \\\n  --lookback-period-in-days SIXTY_DAYS' },
        { type: 'heading', value: 'Spot Instances' },
        { type: 'code', language: 'bash', value: '# Spot Instances — неиспользуемые мощности AWS\n# До 90% дешевле On-Demand\n# НО: могут быть отозваны с уведомлением за 2 минуты\n\n# Kubernetes node pool со Spot Instances\n# EKS:\neksctl create nodegroup \\\n  --cluster my-cluster \\\n  --name spot-pool \\\n  --instance-types m5.large,m5a.large,m5d.large \\\n  --spot \\\n  --nodes-min 2 \\\n  --nodes-max 20\n\n# Karpenter — автоскейлер для K8s с Spot\n# apiVersion: karpenter.sh/v1beta1\n# kind: NodePool\n# spec:\n#   template:\n#     spec:\n#       requirements:\n#         - key: karpenter.sh/capacity-type\n#           operator: In\n#           values: [\"spot\", \"on-demand\"]\n#         - key: node.kubernetes.io/instance-type\n#           operator: In\n#           values: [\"m5.large\", \"m5a.large\", \"c5.large\"]\n#   disruption:\n#     consolidationPolicy: WhenUnderutilized' },
        { type: 'tip', value: 'Стратегия: покройте 70% baseline нагрузки Savings Plans (1 год), оставшиеся 30% — On-Demand/Spot. Для Kubernetes: on-demand nodes для critical workloads, spot для stateless/batch.' }
      ]
    },
    {
      id: 4,
      title: 'Мониторинг затрат',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Инструменты мониторинга затрат' },
        { type: 'text', value: 'Мониторинг затрат в реальном времени позволяет обнаруживать аномалии, прогнозировать расходы и принимать решения на основе данных. Каждый облачный провайдер предоставляет инструменты, плюс есть third-party решения.' },
        { type: 'code', language: 'bash', value: '# AWS Cost Explorer\naws ce get-cost-and-usage \\\n  --time-period Start=2024-03-01,End=2024-03-31 \\\n  --granularity MONTHLY \\\n  --metrics BlendedCost \\\n  --group-by Type=DIMENSION,Key=SERVICE\n\n# Результат:\n# Amazon EC2:              $3,450.00\n# Amazon RDS:              $1,200.00\n# Amazon S3:                 $340.00\n# Amazon EKS:                $219.00\n# Data Transfer:             $180.00\n# Total:                   $5,389.00\n\n# Прогноз на месяц\naws ce get-cost-forecast \\\n  --time-period Start=2024-04-01,End=2024-04-30 \\\n  --granularity MONTHLY \\\n  --metric BLENDED_COST\n\n# Затраты по тегам\naws ce get-cost-and-usage \\\n  --time-period Start=2024-03-01,End=2024-03-31 \\\n  --granularity MONTHLY \\\n  --metrics BlendedCost \\\n  --group-by Type=TAG,Key=team' },
        { type: 'heading', value: 'AWS Budgets и алерты' },
        { type: 'code', language: 'bash', value: '# Создание бюджета с алертом\naws budgets create-budget --account-id 123456789012 \\\n  --budget \'{\n    "BudgetName": "monthly-budget",\n    "BudgetLimit": {"Amount": "5000", "Unit": "USD"},\n    "TimeUnit": "MONTHLY",\n    "BudgetType": "COST"\n  }\' \\\n  --notifications-with-subscribers \'[{\n    "Notification": {\n      "NotificationType": "ACTUAL",\n      "ComparisonOperator": "GREATER_THAN",\n      "Threshold": 80,\n      "ThresholdType": "PERCENTAGE"\n    },\n    "Subscribers": [{\n      "SubscriptionType": "EMAIL",\n      "Address": "devops@company.com"\n    }]\n  },{\n    "Notification": {\n      "NotificationType": "FORECASTED",\n      "ComparisonOperator": "GREATER_THAN",\n      "Threshold": 100,\n      "ThresholdType": "PERCENTAGE"\n    },\n    "Subscribers": [{\n      "SubscriptionType": "SNS",\n      "Address": "arn:aws:sns:us-east-1:123456:budget-alerts"\n    }]\n  }]\'' },
        { type: 'heading', value: 'Kubecost для Kubernetes' },
        { type: 'code', language: 'bash', value: '# Kubecost — мониторинг затрат в Kubernetes\nhelm install kubecost cost-analyzer \\\n  --repo https://kubecost.github.io/cost-analyzer/ \\\n  --namespace kubecost \\\n  --create-namespace\n\n# Kubecost API — затраты по namespace\ncurl http://kubecost:9090/model/allocation \\\n  -d window=30d \\\n  -d aggregate=namespace\n\n# Результат:\n# production:  $2,100/month\n# staging:     $800/month\n# monitoring:  $350/month\n# ci-cd:       $450/month' },
        { type: 'note', value: 'Настройте алерт на anomaly detection: если дневные расходы превышают среднее за 7 дней на 50% — это может быть утечка ресурсов, DDoS или ошибка конфигурации.' }
      ]
    },
    {
      id: 5,
      title: 'FinOps практики',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Автоматизация оптимизации' },
        { type: 'text', value: 'FinOps — это не разовое действие, а непрерывный процесс. Автоматизация выключения dev-окружений, удаления неиспользуемых ресурсов и масштабирования по расписанию обеспечивает постоянную экономию.' },
        { type: 'code', language: 'bash', value: '# 1. Выключение dev/staging на ночь и выходные\n# Kubernetes CronJob для масштабирования\n#!/bin/bash\n# scale-down.sh (22:00 по будням)\nfor deploy in $(kubectl get deploy -n dev -o name); do\n  kubectl scale $deploy --replicas=0 -n dev\ndone\n\n# scale-up.sh (08:00 по будням)\nfor deploy in $(kubectl get deploy -n dev -o name); do\n  kubectl scale $deploy --replicas=1 -n dev\ndone\n\n# Экономия: ~65% на dev/staging окружениях' },
        { type: 'code', language: 'bash', value: '# 2. Автоматическое удаление неиспользуемых ресурсов\n# AWS: неприкреплённые EBS volumes\naws ec2 describe-volumes \\\n  --filters Name=status,Values=available \\\n  --query "Volumes[*].{ID:VolumeId,Size:Size,Created:CreateTime}" \\\n  --output table\n\n# Удалить snapshots старше 30 дней\naws ec2 describe-snapshots --owner-ids self \\\n  --query "Snapshots[?StartTime<\'$(date -d \'30 days ago\' +%Y-%m-%d)\'].SnapshotId" \\\n  --output text | xargs -n 1 aws ec2 delete-snapshot --snapshot-id\n\n# Найти неиспользуемые Elastic IPs\naws ec2 describe-addresses \\\n  --query "Addresses[?AssociationId==null].AllocationId" \\\n  --output text | xargs -n 1 aws ec2 release-address --allocation-id\n\n# 3. S3 Intelligent-Tiering\naws s3api put-bucket-intelligent-tiering-configuration \\\n  --bucket my-bucket \\\n  --id my-config \\\n  --intelligent-tiering-configuration \'{\n    "Id": "my-config",\n    "Status": "Enabled",\n    "Tierings": [\n      {"AccessTier": "ARCHIVE_ACCESS", "Days": 90},\n      {"AccessTier": "DEEP_ARCHIVE_ACCESS", "Days": 180}\n    ]\n  }\'' },
        { type: 'heading', value: 'Tagging Strategy' },
        { type: 'code', language: 'bash', value: '# Обязательные теги для всех ресурсов:\n# team       — владелец (backend, frontend, data)\n# project    — проект (myapp, analytics, platform)\n# environment — окружение (prod, staging, dev)\n# owner      — ответственный (email)\n# cost-center — центр затрат (для бухгалтерии)\n\n# AWS Tag Policy (Organizations)\naws organizations create-policy --name "required-tags" \\\n  --type TAG_POLICY --content \'{\n  "tags": {\n    "team": { "tag_key": { "@@assign": "team" }, "enforced_for": { "@@assign": ["ec2:instance", "rds:db"] } },\n    "environment": { "tag_key": { "@@assign": "environment" }, "tag_value": { "@@assign": ["prod", "staging", "dev"] } }\n  }\n}\'\n\n# Terraform: принудительные теги\n# provider "aws" {\n#   default_tags {\n#     tags = {\n#       team        = var.team\n#       project     = var.project\n#       environment = var.environment\n#       managed_by  = "terraform"\n#     }\n#   }\n# }' },
        { type: 'tip', value: 'Создайте еженедельный FinOps отчёт: топ-5 самых дорогих сервисов, сравнение с прошлым месяцем, неиспользуемые ресурсы, рекомендации по экономии. Распространяйте среди команд.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация облачных затрат',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите аудит облачных затрат и оптимизируйте: right-sizing, выключение dev на ночь, удаление неиспользуемых ресурсов.',
      requirements: [
        'Проанализируйте текущие затраты по сервисам и тегам (aws ce)',
        'Найдите oversized EC2/pods и создайте рекомендации по right-sizing',
        'Настройте автоматическое выключение dev окружения на ночь',
        'Найдите и удалите неиспользуемые ресурсы (EBS volumes, snapshots, EIP)',
        'Создайте AWS Budget с алертом на 80% от лимита',
        'Установите Kubecost и получите отчёт по затратам на namespace'
      ],
      hint: 'Используйте aws ce get-cost-and-usage для анализа. Kubernetes CronJob для автовыключения dev. AWS Compute Optimizer для right-sizing.',
      expectedOutput: 'Cost report: $5,389/month by service\nRight-sizing: 3 instances can be downsized (-$800/month)\nDev shutdown: saves $500/month (65% of dev costs)\nCleanup: 15 unused EBS volumes deleted (-$45/month)\nBudget alert: configured at 80% ($4,000)\nKubecost: namespace costs breakdown available',
      solution: '# 1. Анализ затрат\naws ce get-cost-and-usage --time-period Start=2024-03-01,End=2024-03-31 \\\n  --granularity MONTHLY --metrics BlendedCost --group-by Type=DIMENSION,Key=SERVICE\n\n# 2. Right-sizing\naws compute-optimizer get-ec2-instance-recommendations\n# VPA recommendations в Kubernetes\n\n# 3. Автовыключение dev\n# CronJob: kubectl scale --replicas=0 в 22:00\n# CronJob: kubectl scale --replicas=1 в 08:00\n\n# 4. Cleanup\naws ec2 describe-volumes --filters Name=status,Values=available\n# Удалить неиспользуемые volumes, snapshots, EIPs\n\n# 5. Budget\naws budgets create-budget --budget BudgetLimit={Amount=5000,Unit=USD}\n\n# 6. Kubecost\nhelm install kubecost cost-analyzer --repo https://kubecost.github.io/cost-analyzer/',
      explanation: 'FinOps оптимизация начинается с видимости (куда уходят деньги), затем right-sizing (уменьшение oversized ресурсов), автоматизация (выключение dev, cleanup), и committed discounts (RI/Savings Plans). Непрерывный мониторинг через бюджеты и алерты предотвращает перерасход.'
    }
  ]
}
