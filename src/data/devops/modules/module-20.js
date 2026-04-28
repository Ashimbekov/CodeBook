export default {
  id: 20,
  title: 'AWS: продвинутый',
  description: 'Продвинутые сервисы AWS: ECS для контейнеров, Lambda для serverless, CloudFormation для IaC.',
  lessons: [
    {
      id: 1,
      title: 'ECS — контейнеры в AWS',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECS (Elastic Container Service) — сервис для запуска Docker-контейнеров в AWS. Два режима: EC2 (вы управляете серверами) и Fargate (serverless — AWS управляет серверами).' },
        { type: 'heading', value: 'Компоненты ECS' },
        { type: 'code', language: 'bash', value: '# Компоненты ECS:\n# Cluster         — логическая группа сервисов\n# Task Definition — описание контейнера (как Dockerfile)\n# Service         — запускает и поддерживает N задач\n# Task            — запущенный экземпляр Task Definition\n\n# ECS Fargate vs EC2:\n# Fargate — нет серверов, платишь за CPU/RAM контейнера\n# EC2     — сам управляешь EC2 инстансами, больше контроля\n\n# Создание кластера\naws ecs create-cluster --cluster-name production' },
        { type: 'heading', value: 'Task Definition' },
        { type: 'code', language: 'json', value: '{\n  "family": "myapp",\n  "networkMode": "awsvpc",\n  "requiresCompatibilities": ["FARGATE"],\n  "cpu": "256",\n  "memory": "512",\n  "executionRoleArn": "arn:aws:iam::123456:role/ecsTaskExecutionRole",\n  "containerDefinitions": [\n    {\n      "name": "app",\n      "image": "123456.dkr.ecr.us-east-1.amazonaws.com/myapp:latest",\n      "portMappings": [\n        { "containerPort": 8080, "protocol": "tcp" }\n      ],\n      "environment": [\n        { "name": "APP_ENV", "value": "production" }\n      ],\n      "secrets": [\n        { "name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:us-east-1:123456:parameter/db-password" }\n      ],\n      "logConfiguration": {\n        "logDriver": "awslogs",\n        "options": {\n          "awslogs-group": "/ecs/myapp",\n          "awslogs-region": "us-east-1",\n          "awslogs-stream-prefix": "ecs"\n        }\n      },\n      "healthCheck": {\n        "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],\n        "interval": 30,\n        "timeout": 5\n      }\n    }\n  ]\n}' },
        { type: 'tip', value: 'ECS Fargate — лучший выбор для начала: не нужно управлять серверами, платишь только за реально используемые ресурсы. Для сложных случаев или экономии — ECS на EC2 с Spot instances.' }
      ]
    },
    {
      id: 2,
      title: 'Lambda — serverless функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS Lambda запускает код без серверов. Вы загружаете функцию, она автоматически масштабируется от 0 до тысяч параллельных вызовов. Оплата за количество вызовов и время выполнения.' },
        { type: 'heading', value: 'Создание Lambda функции' },
        { type: 'code', language: 'bash', value: '# lambda_function.py\n# import json\n# def lambda_handler(event, context):\n#     name = event.get("name", "World")\n#     return {\n#         "statusCode": 200,\n#         "body": json.dumps({"message": f"Hello, {name}!"})\n#     }\n\n# Создание через CLI\nzip function.zip lambda_function.py\naws lambda create-function \\\n  --function-name hello-world \\\n  --runtime python3.11 \\\n  --handler lambda_function.lambda_handler \\\n  --role arn:aws:iam::123456:role/lambda-role \\\n  --zip-file fileb://function.zip \\\n  --timeout 30 \\\n  --memory-size 128\n\n# Вызов\naws lambda invoke \\\n  --function-name hello-world \\\n  --payload \'{"name": "DevOps"}\' \\\n  output.json\n\n# Обновление кода\naws lambda update-function-code \\\n  --function-name hello-world \\\n  --zip-file fileb://function.zip' },
        { type: 'heading', value: 'Триггеры Lambda' },
        { type: 'code', language: 'bash', value: '# Lambda может быть запущена из:\n# API Gateway   — HTTP эндпойнт (REST API)\n# S3            — при загрузке файла\n# SQS           — из очереди сообщений\n# DynamoDB      — при изменении данных\n# CloudWatch    — по расписанию (cron)\n# EventBridge   — по событиям\n# SNS           — уведомления\n\n# Пример: автоматическая обработка загруженных файлов\n# S3 bucket -> Lambda -> обработка файла -> S3 результат\n\n# Пример: API\n# API Gateway -> Lambda -> DynamoDB\n# POST /users -> lambda_handler -> DynamoDB put_item\n\n# Пример: cron\n# CloudWatch Events (каждый час) -> Lambda -> очистка старых данных' },
        { type: 'note', value: 'Lambda ограничения: максимум 15 минут выполнения, 10 GB RAM, 512 MB /tmp. Для длительных задач используй ECS или Step Functions. Lambda идеальна для: API endpoints, обработка событий, cron задачи.' }
      ]
    },
    {
      id: 3,
      title: 'ECR и CI/CD для контейнеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'ECR (Elastic Container Registry) — приватный Docker registry в AWS. В связке с ECS создаёт полный цикл: build -> push to ECR -> deploy to ECS.' },
        { type: 'heading', value: 'Работа с ECR' },
        { type: 'code', language: 'bash', value: '# Создание репозитория\naws ecr create-repository --repository-name myapp\n\n# Авторизация Docker в ECR\naws ecr get-login-password --region us-east-1 | \\\n  docker login --username AWS --password-stdin 123456.dkr.ecr.us-east-1.amazonaws.com\n\n# Сборка и push\ndocker build -t myapp:latest .\ndocker tag myapp:latest 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:latest\ndocker tag myapp:latest 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:$(git rev-parse --short HEAD)\ndocker push 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:latest\ndocker push 123456.dkr.ecr.us-east-1.amazonaws.com/myapp:$(git rev-parse --short HEAD)\n\n# Lifecycle Policy — автоудаление старых образов\naws ecr put-lifecycle-policy \\\n  --repository-name myapp \\\n  --lifecycle-policy-text \'{\n    "rules": [{\n      "rulePriority": 1,\n      "description": "Keep last 10 images",\n      "selection": {\n        "tagStatus": "any",\n        "countType": "imageCountMoreThan",\n        "countNumber": 10\n      },\n      "action": { "type": "expire" }\n    }]\n  }\'' },
        { type: 'heading', value: 'CI/CD Pipeline для ECS' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions -> ECR -> ECS\n# .github/workflows/deploy.yml\nname: Deploy to ECS\non:\n  push:\n    branches: [main]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Configure AWS\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n\n      - name: Login to ECR\n        uses: aws-actions/amazon-ecr-login@v2\n\n      - name: Build and Push\n        run: |\n          docker build -t $ECR_REGISTRY/myapp:${{ github.sha }} .\n          docker push $ECR_REGISTRY/myapp:${{ github.sha }}\n\n      - name: Deploy to ECS\n        uses: aws-actions/amazon-ecs-deploy-task-definition@v1\n        with:\n          task-definition: task-definition.json\n          service: myapp-service\n          cluster: production\n          wait-for-service-stability: true' },
        { type: 'tip', value: 'ECR lifecycle policy обязательна — без неё registry будет расти бесконечно. Храни только последние 10-20 образов. Для мультирегиональности используй ECR replication.' }
      ]
    },
    {
      id: 4,
      title: 'CloudFormation',
      type: 'theory',
      content: [
        { type: 'text', value: 'CloudFormation — нативный IaC сервис AWS. Описываешь инфраструктуру в YAML/JSON шаблонах, AWS создаёт и управляет ресурсами. Альтернатива Terraform для AWS-only проектов.' },
        { type: 'heading', value: 'Шаблон CloudFormation' },
        { type: 'code', language: 'yaml', value: '# template.yaml\nAWSTemplateFormatVersion: "2010-09-09"\nDescription: Web Application Infrastructure\n\nParameters:\n  Environment:\n    Type: String\n    AllowedValues: [dev, staging, production]\n    Default: dev\n  InstanceType:\n    Type: String\n    Default: t3.micro\n\nResources:\n  WebServer:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: !Ref InstanceType\n      ImageId: ami-0c55b159cbfafe1f0\n      SecurityGroupIds:\n        - !Ref WebSecurityGroup\n      Tags:\n        - Key: Name\n          Value: !Sub "${Environment}-web"\n        - Key: Environment\n          Value: !Ref Environment\n\n  WebSecurityGroup:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Web server security group\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 0.0.0.0/0\n        - IpProtocol: tcp\n          FromPort: 443\n          ToPort: 443\n          CidrIp: 0.0.0.0/0\n\n  AppBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: !Sub "${Environment}-app-assets"\n\nOutputs:\n  WebServerIP:\n    Value: !GetAtt WebServer.PublicIp\n    Description: Public IP of web server' },
        { type: 'code', language: 'bash', value: '# Команды CloudFormation\naws cloudformation create-stack \\\n  --stack-name my-app \\\n  --template-body file://template.yaml \\\n  --parameters ParameterKey=Environment,ParameterValue=production\n\naws cloudformation update-stack \\\n  --stack-name my-app \\\n  --template-body file://template.yaml\n\naws cloudformation describe-stacks --stack-name my-app\naws cloudformation delete-stack --stack-name my-app' },
        { type: 'note', value: 'CloudFormation vs Terraform: CF — нативный AWS, бесплатный, лучше интеграция с AWS. Terraform — мультиоблачный, больше провайдеров, проще синтаксис (HCL vs YAML). Для AWS-only можно использовать оба.' }
      ]
    },
    {
      id: 5,
      title: 'Мониторинг и оптимизация затрат',
      type: 'theory',
      content: [
        { type: 'text', value: 'CloudWatch мониторит ресурсы AWS. Cost Explorer анализирует затраты. Оптимизация затрат — важная задача DevOps: облако может быть очень дорогим без контроля.' },
        { type: 'heading', value: 'CloudWatch' },
        { type: 'code', language: 'bash', value: '# CloudWatch Metrics — метрики ресурсов\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/EC2 \\\n  --metric-name CPUUtilization \\\n  --dimensions Name=InstanceId,Value=i-abc123 \\\n  --start-time 2024-01-01T00:00:00Z \\\n  --end-time 2024-01-02T00:00:00Z \\\n  --period 3600 \\\n  --statistics Average\n\n# CloudWatch Alarms — оповещения\naws cloudwatch put-metric-alarm \\\n  --alarm-name "High-CPU" \\\n  --metric-name CPUUtilization \\\n  --namespace AWS/EC2 \\\n  --dimensions Name=InstanceId,Value=i-abc123 \\\n  --statistic Average \\\n  --period 300 \\\n  --threshold 80 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 2 \\\n  --alarm-actions arn:aws:sns:us-east-1:123456:alerts\n\n# CloudWatch Logs\naws logs create-log-group --log-group-name /app/myapp\naws logs get-log-events \\\n  --log-group-name /app/myapp \\\n  --log-stream-name app-stream' },
        { type: 'heading', value: 'Оптимизация затрат' },
        { type: 'list', value: [
          'Right-sizing: используй подходящий тип инстанса (не переплачивай за лишние ресурсы)',
          'Reserved Instances: до 75% скидка при обязательстве на 1-3 года',
          'Spot Instances: до 90% скидка для прерываемых нагрузок (CI/CD, batch)',
          'Auto Scaling: масштабируй вниз в нерабочее время',
          'S3 Lifecycle: переводи старые данные в Glacier',
          'Удаляй неиспользуемые ресурсы: EBS volumes, Elastic IPs, old snapshots',
          'Используй Cost Explorer и Budgets для контроля'
        ] },
        { type: 'tip', value: 'Настрой AWS Budgets с алертами: получай уведомление когда затраты превысят порог. Это предотвращает неожиданные счета. Используй AWS Cost Explorer для анализа по сервисам.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой в ECS Fargate',
      type: 'practice',
      difficulty: 'hard',
      description: 'Задеплойте контейнерное приложение в AWS ECS Fargate с ECR и мониторингом.',
      requirements: [
        'Создайте ECR репозиторий и запушьте Docker-образ',
        'Создайте ECS кластер и Task Definition',
        'Запустите ECS Service с 2 задачами',
        'Настройте CloudWatch алерм для CPU > 80%',
        'Создайте Application Load Balancer для сервиса',
        'Проверьте логи в CloudWatch'
      ],
      hint: 'aws ecr create-repository. aws ecs create-cluster. Для Fargate: requiresCompatibilities: FARGATE. CloudWatch: put-metric-alarm.',
      expectedOutput: 'ECR: образ myapp:latest запушен\nECS: кластер production, 2 running tasks\nALB: доступ по DNS-имени балансировщика\nCloudWatch: алерм High-CPU настроен\nЛоги доступны в CloudWatch Logs',
      solution: '#!/bin/bash\n# 1. ECR\naws ecr create-repository --repository-name myapp\naws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY\ndocker build -t $ECR_REGISTRY/myapp:latest .\ndocker push $ECR_REGISTRY/myapp:latest\n\n# 2. ECS Cluster\naws ecs create-cluster --cluster-name production\n\n# 3. Task Definition (task-def.json)\n# Зарегистрировать через:\naws ecs register-task-definition --cli-input-json file://task-def.json\n\n# 4. Service\naws ecs create-service \\\n  --cluster production \\\n  --service-name myapp \\\n  --task-definition myapp:1 \\\n  --desired-count 2 \\\n  --launch-type FARGATE \\\n  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc],securityGroups=[sg-abc],assignPublicIp=ENABLED}"\n\n# 5. CloudWatch Alarm\naws cloudwatch put-metric-alarm \\\n  --alarm-name "ECS-High-CPU" \\\n  --namespace AWS/ECS \\\n  --metric-name CPUUtilization \\\n  --dimensions Name=ClusterName,Value=production Name=ServiceName,Value=myapp \\\n  --statistic Average --period 300 --threshold 80 \\\n  --comparison-operator GreaterThanThreshold \\\n  --evaluation-periods 2\n\n# 6. Логи\naws logs get-log-events --log-group-name /ecs/myapp --log-stream-name ecs/app/task-id',
      explanation: 'ECR хранит Docker-образы. ECS Fargate запускает контейнеры без управления серверами. Task Definition описывает контейнер (образ, ресурсы, порты). Service поддерживает desired-count задач. CloudWatch мониторит метрики и отправляет алерты. ALB распределяет трафик между задачами.'
    }
  ]
}
