export default {
  id: 8,
  title: 'AWS ECS и ECR',
  description: 'Контейнеризация в AWS: ECS (Elastic Container Service), Fargate, ECR (Elastic Container Registry), Task Definitions, Services.',
  lessons: [
    {
      id: 1,
      title: 'ECS: контейнеры в AWS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon ECS (Elastic Container Service) — управляемый сервис оркестрации Docker контейнеров. Два режима запуска: EC2 (свои серверы) и Fargate (serverless). ECS проще Kubernetes, глубоко интегрирован с AWS.' },
        { type: 'heading', value: 'Компоненты ECS' },
        { type: 'list', value: [
          'Cluster — логическая группировка сервисов и задач',
          'Task Definition — описание контейнера (образ, CPU, память, порты, env vars)',
          'Task — запущенный экземпляр Task Definition (один или несколько контейнеров)',
          'Service — поддерживает заданное количество задач, интегрируется с ALB',
          'ECR — реестр Docker образов в AWS'
        ] },
        { type: 'code', language: 'bash', value: '# Создание ECS кластера (Fargate):\naws ecs create-cluster --cluster-name my-cluster\n\n# ECS vs EKS:\n# ECS — проще, глубже интеграция с AWS, бесплатен (платите за Fargate/EC2)\n# EKS — Kubernetes, портабельность, больше гибкости, $0.10/час за control plane\n\n# Fargate vs EC2 launch type:\n# Fargate: serverless, не нужно управлять серверами, дороже на 20-30%\n# EC2: дешевле, полный контроль, нужно управлять инстансами\n\n# Типичная архитектура:\n# ALB -> ECS Service (Fargate) -> Task1, Task2, Task3\n#                                      |\n#                               ECR (Docker images)\n#                               RDS (база данных)\n#                               S3 (файлы)' },
        { type: 'tip', value: 'Для большинства проектов ECS + Fargate — оптимальный выбор. Проще Kubernetes, нет управления серверами, отличная интеграция с AWS сервисами. EKS нужен если требуется портабельность между облаками или уже есть Kubernetes экспертиза.' }
      ]
    },
    {
      id: 2,
      title: 'ECR и Task Definition',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECR (Elastic Container Registry) — управляемый Docker реестр в AWS. Task Definition — JSON описание контейнера (аналог docker-compose.yml).' },
        { type: 'code', language: 'bash', value: '# Создание ECR репозитория:\naws ecr create-repository --repository-name my-app\n\n# Логин в ECR:\naws ecr get-login-password --region eu-central-1 | \\\n  docker login --username AWS --password-stdin \\\n  123456789012.dkr.ecr.eu-central-1.amazonaws.com\n\n# Сборка и push образа:\ndocker build -t my-app .\ndocker tag my-app:latest 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest\ndocker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest\n\n# ECR Lifecycle Policy — удалять старые образы:\naws ecr put-lifecycle-policy --repository-name my-app \\\n  --lifecycle-policy-text \'{\n    "rules": [{\n      "rulePriority": 1,\n      "description": "Keep last 10 images",\n      "selection": {"tagStatus": "any", "countType": "imageCountMoreThan", "countNumber": 10},\n      "action": {"type": "expire"}\n    }]\n  }\'  ' },
        { type: 'code', language: 'json', value: '{\n  "family": "my-app",\n  "networkMode": "awsvpc",\n  "requiresCompatibilities": ["FARGATE"],\n  "cpu": "256",\n  "memory": "512",\n  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",\n  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",\n  "containerDefinitions": [\n    {\n      "name": "app",\n      "image": "123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest",\n      "portMappings": [{"containerPort": 8080, "protocol": "tcp"}],\n      "environment": [\n        {"name": "NODE_ENV", "value": "production"}\n      ],\n      "secrets": [\n        {"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:...:secret:db-password"}\n      ],\n      "logConfiguration": {\n        "logDriver": "awslogs",\n        "options": {\n          "awslogs-group": "/ecs/my-app",\n          "awslogs-region": "eu-central-1",\n          "awslogs-stream-prefix": "ecs"\n        }\n      }\n    }\n  ]\n}' },
        { type: 'note', value: 'Используйте Secrets Manager или SSM Parameter Store для секретов, а не environment variables в Task Definition. Секреты инжектируются при запуске задачи через поле "secrets".' }
      ]
    },
    {
      id: 3,
      title: 'ECS Services и Auto Scaling',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECS Service поддерживает нужное количество задач, перезапускает упавшие, интегрируется с ALB для распределения трафика. Application Auto Scaling масштабирует количество задач по метрикам.' },
        { type: 'code', language: 'bash', value: '# Регистрация Task Definition:\naws ecs register-task-definition --cli-input-json file://task-def.json\n\n# Создание ECS Service:\naws ecs create-service \\\n  --cluster my-cluster \\\n  --service-name my-app-service \\\n  --task-definition my-app:1 \\\n  --desired-count 2 \\\n  --launch-type FARGATE \\\n  --network-configuration \'{\n    "awsvpcConfiguration": {\n      "subnets": ["subnet-priv1", "subnet-priv2"],\n      "securityGroups": ["sg-xxx"],\n      "assignPublicIp": "DISABLED"\n    }\n  }\' \\\n  --load-balancers \'[{\n    "targetGroupArn": "arn:aws:elasticloadbalancing:...:targetgroup/my-tg/xxx",\n    "containerName": "app",\n    "containerPort": 8080\n  }]\'\n\n# Auto Scaling:\naws application-autoscaling register-scalable-target \\\n  --service-namespace ecs \\\n  --resource-id service/my-cluster/my-app-service \\\n  --scalable-dimension ecs:service:DesiredCount \\\n  --min-capacity 2 \\\n  --max-capacity 10\n\naws application-autoscaling put-scaling-policy \\\n  --service-namespace ecs \\\n  --resource-id service/my-cluster/my-app-service \\\n  --scalable-dimension ecs:service:DesiredCount \\\n  --policy-name cpu-scaling \\\n  --policy-type TargetTrackingScaling \\\n  --target-tracking-scaling-policy-configuration \'{\n    "PredefinedMetricSpecification": {\n      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"\n    },\n    "TargetValue": 70.0,\n    "ScaleInCooldown": 300,\n    "ScaleOutCooldown": 60\n  }\'  ' },
        { type: 'tip', value: 'Размещайте задачи Fargate в приватных подсетях без публичного IP. Трафик от ALB → Fargate tasks. Для pull образов из ECR используйте VPC Endpoint или NAT Gateway.' }
      ]
    },
    {
      id: 4,
      title: 'Blue/Green деплой в ECS',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECS поддерживает Rolling Update и Blue/Green деплой через CodeDeploy. Blue/Green создаёт новую версию параллельно и переключает трафик, позволяя мгновенный rollback.' },
        { type: 'code', language: 'bash', value: '# Rolling Update (по умолчанию):\n# ECS заменяет задачи постепенно\n# deployment-configuration: минимум 50% задач работают во время деплоя\naws ecs update-service \\\n  --cluster my-cluster \\\n  --service my-app-service \\\n  --task-definition my-app:2 \\\n  --deployment-configuration \\\n    minimumHealthyPercent=50,maximumPercent=200\n\n# Blue/Green через CodeDeploy:\n# 1. Новые задачи запускаются с новой версией (Green)\n# 2. ALB переключает трафик с Blue на Green\n# 3. Если проблемы — мгновенный rollback на Blue\n\n# Обновление образа (CI/CD pipeline):\n# 1. Build и push нового образа\ndocker build -t my-app:v2 .\ndocker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:v2\n\n# 2. Обновить Task Definition с новым тегом образа\naws ecs register-task-definition --cli-input-json file://task-def-v2.json\n\n# 3. Обновить Service\naws ecs update-service \\\n  --cluster my-cluster \\\n  --service my-app-service \\\n  --task-definition my-app:2 \\\n  --force-new-deployment\n\n# Мониторинг деплоя:\naws ecs describe-services \\\n  --cluster my-cluster \\\n  --services my-app-service \\\n  --query "services[0].deployments"' },
        { type: 'note', value: 'Для production используйте Blue/Green деплой через CodeDeploy с автоматическим rollback при ошибках. Настройте health check на ALB target group — нездоровые задачи автоматически заменяются.' }
      ]
    },
    {
      id: 5,
      title: 'ECS Exec и отладка',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECS Exec позволяет подключаться к работающему контейнеру для отладки (аналог docker exec). CloudWatch Logs собирает логи из контейнеров.' },
        { type: 'code', language: 'bash', value: '# Включить ECS Exec в сервисе:\naws ecs update-service \\\n  --cluster my-cluster \\\n  --service my-app-service \\\n  --enable-execute-command\n\n# Подключиться к контейнеру:\naws ecs execute-command \\\n  --cluster my-cluster \\\n  --task abc123def456 \\\n  --container app \\\n  --interactive \\\n  --command "/bin/bash"\n\n# Логи контейнера:\naws logs tail /ecs/my-app --follow\naws logs filter-log-events \\\n  --log-group-name /ecs/my-app \\\n  --filter-pattern "ERROR"\n\n# Статус задач:\naws ecs list-tasks --cluster my-cluster --service-name my-app-service\naws ecs describe-tasks --cluster my-cluster --tasks arn:aws:ecs:...:task/xxx\n\n# Причина остановки задачи:\naws ecs describe-tasks --cluster my-cluster --tasks xxx \\\n  --query "tasks[0].stoppedReason"\n# "Essential container exited" — проверьте логи\n# "CannotPullContainerError" — проверьте ECR доступ' },
        { type: 'tip', value: 'Для ECS Exec необходимо: 1) Task Role с ssmmessages:* permissions, 2) enableExecuteCommand в сервисе, 3) SSM Agent в контейнере (уже есть в большинстве базовых образов). Используйте только для отладки, не для production доступа.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: деплой приложения в ECS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полный pipeline: ECR → ECS Fargate с ALB и Auto Scaling.',
      requirements: [
        'Создайте ECR репозиторий и загрузите Docker образ',
        'Создайте ECS кластер',
        'Создайте Task Definition для Fargate (256 CPU, 512 Memory)',
        'Создайте ALB с target group',
        'Создайте ECS Service с 2 задачами за ALB',
        'Настройте Auto Scaling от 2 до 6 задач по CPU utilization'
      ],
      hint: 'Task Definition нуждается в executionRoleArn (для pull образа из ECR). Service размещается в приватных подсетях, ALB — в публичных. Target group type: ip (для Fargate).',
      expectedOutput: 'ECR: my-app репозиторий, образ загружен.\nECS кластер my-cluster создан.\nTask Definition my-app:1 зарегистрирован.\nALB my-alb с target group на порт 8080.\nService my-app-service: 2 задачи Running.\nAuto Scaling: min=2, max=6, target CPU 70%.',
      solution: '# ECR\naws ecr create-repository --repository-name my-app\naws ecr get-login-password | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-central-1.amazonaws.com\ndocker build -t my-app . && docker tag my-app:latest 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest\ndocker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest\n\n# ECS Cluster\naws ecs create-cluster --cluster-name my-cluster\n\n# Task Definition\naws ecs register-task-definition --cli-input-json file://task-def.json\n\n# ALB\nALB_ARN=$(aws elbv2 create-load-balancer --name my-alb --subnets subnet-pub1 subnet-pub2 --security-groups sg-alb --query "LoadBalancers[0].LoadBalancerArn" --output text)\nTG_ARN=$(aws elbv2 create-target-group --name my-tg --protocol HTTP --port 8080 --vpc-id vpc-xxx --target-type ip --query "TargetGroups[0].TargetGroupArn" --output text)\naws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN\n\n# Service\naws ecs create-service --cluster my-cluster --service-name my-app-service --task-definition my-app:1 --desired-count 2 --launch-type FARGATE --network-configuration \'{"awsvpcConfiguration":{"subnets":["subnet-priv1","subnet-priv2"],"securityGroups":["sg-app"]}}\' --load-balancers "[{\\"targetGroupArn\\":\\"$TG_ARN\\",\\"containerName\\":\\"app\\",\\"containerPort\\":8080}]"\n\n# Auto Scaling\naws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/my-cluster/my-app-service --scalable-dimension ecs:service:DesiredCount --min-capacity 2 --max-capacity 6\naws application-autoscaling put-scaling-policy --service-namespace ecs --resource-id service/my-cluster/my-app-service --scalable-dimension ecs:service:DesiredCount --policy-name cpu-scaling --policy-type TargetTrackingScaling --target-tracking-scaling-policy-configuration \'{"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"},"TargetValue":70.0}\'',
      explanation: 'ECS Fargate + ALB — production-ready архитектура для контейнеризированных приложений. ALB в публичных подсетях принимает трафик и направляет на Fargate задачи в приватных подсетях. Auto Scaling обеспечивает эластичность при изменении нагрузки.'
    }
  ]
}
