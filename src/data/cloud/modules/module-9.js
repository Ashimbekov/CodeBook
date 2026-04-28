export default {
  id: 9,
  title: 'AWS CloudFormation и CDK',
  description: 'Infrastructure as Code в AWS: CloudFormation шаблоны, стеки, nested stacks, CDK на TypeScript/Python, CDK constructs.',
  lessons: [
    {
      id: 1,
      title: 'Infrastructure as Code и CloudFormation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Infrastructure as Code (IaC) — описание инфраструктуры в виде кода вместо ручной настройки через консоль. AWS CloudFormation — нативный IaC сервис AWS. Шаблон (YAML/JSON) описывает ресурсы, CloudFormation создаёт и управляет ими.' },
        { type: 'heading', value: 'Преимущества IaC' },
        { type: 'list', value: [
          'Воспроизводимость: одинаковая инфраструктура в dev/staging/prod',
          'Версионирование: шаблоны хранятся в git, видна история изменений',
          'Автоматизация: нет ручных действий, нет человеческих ошибок',
          'Документация: шаблон — документация инфраструктуры',
          'Откат: CloudFormation автоматически откатывает при ошибке'
        ] },
        { type: 'code', language: 'yaml', value: '# template.yaml — CloudFormation шаблон\nAWSTemplateFormatVersion: "2010-09-09"\nDescription: "Простая инфраструктура с VPC и EC2"\n\nParameters:\n  EnvironmentName:\n    Type: String\n    Default: dev\n    AllowedValues: [dev, staging, prod]\n  InstanceType:\n    Type: String\n    Default: t3.micro\n\nResources:\n  MyVPC:\n    Type: AWS::EC2::VPC\n    Properties:\n      CidrBlock: 10.0.0.0/16\n      Tags:\n        - Key: Name\n          Value: !Sub "${EnvironmentName}-vpc"\n\n  PublicSubnet:\n    Type: AWS::EC2::Subnet\n    Properties:\n      VpcId: !Ref MyVPC\n      CidrBlock: 10.0.1.0/24\n      AvailabilityZone: !Select [0, !GetAZs ""]\n\n  WebServer:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: !Ref InstanceType\n      ImageId: ami-0abcdef1234567890\n      SubnetId: !Ref PublicSubnet\n      Tags:\n        - Key: Name\n          Value: !Sub "${EnvironmentName}-web"\n\nOutputs:\n  VpcId:\n    Value: !Ref MyVPC\n    Export:\n      Name: !Sub "${EnvironmentName}-VpcId"' },
        { type: 'tip', value: 'Используйте Parameters для переменных (env, instance type), Mappings для статических значений (AMI по регионам), Conditions для условной логики (создавать ресурс только в prod).' }
      ]
    },
    {
      id: 2,
      title: 'CloudFormation: стеки и операции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stack (стек) — набор AWS ресурсов, созданных из одного шаблона. Все ресурсы в стеке управляются как единое целое: создание, обновление, удаление.' },
        { type: 'code', language: 'bash', value: '# Создание стека:\naws cloudformation create-stack \\\n  --stack-name my-app-dev \\\n  --template-body file://template.yaml \\\n  --parameters ParameterKey=EnvironmentName,ParameterValue=dev \\\n  --capabilities CAPABILITY_IAM\n\n# Ожидание завершения:\naws cloudformation wait stack-create-complete --stack-name my-app-dev\n\n# Обновление стека:\naws cloudformation update-stack \\\n  --stack-name my-app-dev \\\n  --template-body file://template-v2.yaml \\\n  --parameters ParameterKey=InstanceType,ParameterValue=t3.small\n\n# Change Set — предварительный просмотр изменений:\naws cloudformation create-change-set \\\n  --stack-name my-app-dev \\\n  --change-set-name my-changes \\\n  --template-body file://template-v2.yaml\n\naws cloudformation describe-change-set \\\n  --stack-name my-app-dev \\\n  --change-set-name my-changes\n# Показывает: какие ресурсы будут Add/Modify/Remove\n\n# Применить Change Set:\naws cloudformation execute-change-set \\\n  --stack-name my-app-dev \\\n  --change-set-name my-changes\n\n# Удаление стека (удалит ВСЕ ресурсы!):\naws cloudformation delete-stack --stack-name my-app-dev\n\n# Статус и события:\naws cloudformation describe-stacks --stack-name my-app-dev\naws cloudformation describe-stack-events --stack-name my-app-dev' },
        { type: 'note', value: 'ВСЕГДА используйте Change Sets перед обновлением production стеков. Некоторые изменения вызывают Replacement ресурса (пересоздание) — это может привести к даунтайму. Change Set покажет это заранее.' }
      ]
    },
    {
      id: 3,
      title: 'CloudFormation: продвинутые возможности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Nested Stacks, Cross-Stack References, Drift Detection и Helper Scripts позволяют управлять сложной инфраструктурой.' },
        { type: 'code', language: 'yaml', value: '# Nested Stack — стек внутри стека:\nResources:\n  NetworkStack:\n    Type: AWS::CloudFormation::Stack\n    Properties:\n      TemplateURL: https://s3.amazonaws.com/my-templates/network.yaml\n      Parameters:\n        EnvironmentName: !Ref EnvironmentName\n\n  DatabaseStack:\n    Type: AWS::CloudFormation::Stack\n    DependsOn: NetworkStack\n    Properties:\n      TemplateURL: https://s3.amazonaws.com/my-templates/database.yaml\n      Parameters:\n        VpcId: !GetAtt NetworkStack.Outputs.VpcId\n        SubnetIds: !GetAtt NetworkStack.Outputs.PrivateSubnetIds\n\n# Conditions — условное создание ресурсов:\nConditions:\n  IsProduction: !Equals [!Ref EnvironmentName, prod]\n\nResources:\n  NATGateway:\n    Type: AWS::EC2::NatGateway\n    Condition: IsProduction  # Создаётся только в prod\n    Properties:\n      SubnetId: !Ref PublicSubnet\n      AllocationId: !GetAtt EIP.AllocationId\n\n# DeletionPolicy — защита от удаления:\n  Database:\n    Type: AWS::RDS::DBInstance\n    DeletionPolicy: Snapshot  # Создаст snapshot перед удалением\n    Properties:\n      Engine: postgres' },
        { type: 'code', language: 'bash', value: '# Drift Detection — найти ручные изменения:\naws cloudformation detect-stack-drift --stack-name my-app-dev\naws cloudformation describe-stack-drift-detection-status \\\n  --stack-drift-detection-id xxx\naws cloudformation describe-stack-resource-drifts \\\n  --stack-name my-app-dev\n# MODIFIED — ресурс изменён вручную\n# DELETED — ресурс удалён вручную\n# IN_SYNC — всё ок' },
        { type: 'tip', value: 'Разбивайте большие шаблоны на Nested Stacks: network, database, compute, monitoring. Используйте DeletionPolicy: Retain для RDS и S3 чтобы данные не удалились при удалении стека.' }
      ]
    },
    {
      id: 4,
      title: 'AWS CDK: инфраструктура на языке программирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS CDK (Cloud Development Kit) — фреймворк для описания инфраструктуры на TypeScript, Python, Java, C#, Go. CDK генерирует CloudFormation шаблоны. Высокоуровневые конструкты значительно сокращают код.' },
        { type: 'code', language: 'bash', value: '# Установка CDK:\nnpm install -g aws-cdk\n\n# Создание проекта:\nmkdir my-cdk-app && cd my-cdk-app\ncdk init app --language typescript\n# или: cdk init app --language python\n\n# Структура проекта:\n# my-cdk-app/\n# ├── bin/my-cdk-app.ts    — entry point\n# ├── lib/my-cdk-app-stack.ts  — определение стека\n# ├── cdk.json             — конфигурация CDK\n# └── package.json\n\n# Основные команды:\ncdk synth      # Сгенерировать CloudFormation шаблон\ncdk diff       # Показать изменения (как Change Set)\ncdk deploy     # Деплой в AWS\ncdk destroy    # Удалить стек\ncdk watch      # Автоматический деплой при изменениях' },
        { type: 'code', language: 'python', value: '# CDK Stack на Python:\nfrom aws_cdk import (\n    Stack,\n    aws_ec2 as ec2,\n    aws_ecs as ecs,\n    aws_ecs_patterns as ecs_patterns,\n    aws_rds as rds,\n    Duration,\n    RemovalPolicy,\n)\nfrom constructs import Construct\n\nclass MyAppStack(Stack):\n    def __init__(self, scope: Construct, id: str, **kwargs):\n        super().__init__(scope, id, **kwargs)\n\n        # VPC с публичными и приватными подсетями\n        vpc = ec2.Vpc(self, "VPC",\n            max_azs=2,\n            nat_gateways=1\n        )\n\n        # ECS Fargate с ALB (всего 5 строк!)\n        service = ecs_patterns.ApplicationLoadBalancedFargateService(\n            self, "WebService",\n            vpc=vpc,\n            cpu=256,\n            memory_limit_mib=512,\n            desired_count=2,\n            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(\n                image=ecs.ContainerImage.from_asset("./docker"),\n            ),\n        )\n\n        # Auto Scaling\n        scaling = service.service.auto_scale_task_count(max_capacity=10)\n        scaling.scale_on_cpu_utilization("CpuScaling",\n            target_utilization_percent=70\n        )\n\n        # RDS PostgreSQL\n        db = rds.DatabaseInstance(self, "Database",\n            engine=rds.DatabaseInstanceEngine.postgres(\n                version=rds.PostgresEngineVersion.VER_15\n            ),\n            instance_type=ec2.InstanceType.of(\n                ec2.InstanceClass.T3, ec2.InstanceSize.MICRO\n            ),\n            vpc=vpc,\n            multi_az=True,\n            removal_policy=RemovalPolicy.SNAPSHOT\n        )' },
        { type: 'tip', value: 'CDK L2 Constructs (высокоуровневые) автоматически настраивают security groups, IAM roles, networking. VPC: 3 строки вместо 50+ в CloudFormation. Fargate Service с ALB: 10 строк вместо 100+.' }
      ]
    },
    {
      id: 5,
      title: 'CDK: Constructs и паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'CDK Constructs бывают трёх уровней: L1 (CfnXxx — прямой маппинг CloudFormation), L2 (высокоуровневые с разумными defaults), L3 (Patterns — готовые архитектурные решения).' },
        { type: 'code', language: 'python', value: '# L1 Construct — прямой маппинг CloudFormation (низкий уровень):\nbucket_l1 = s3.CfnBucket(self, "BucketL1",\n    bucket_name="my-bucket",\n    versioning_configuration=s3.CfnBucket.VersioningConfigurationProperty(\n        status="Enabled"\n    )\n)\n\n# L2 Construct — высокий уровень (рекомендуется):\nbucket_l2 = s3.Bucket(self, "BucketL2",\n    versioned=True,\n    encryption=s3.BucketEncryption.S3_MANAGED,\n    lifecycle_rules=[s3.LifecycleRule(\n        transitions=[s3.Transition(\n            storage_class=s3.StorageClass.INFREQUENT_ACCESS,\n            transition_after=Duration.days(30)\n        )],\n        expiration=Duration.days(365)\n    )],\n    removal_policy=RemovalPolicy.DESTROY,\n    auto_delete_objects=True  # Удалить объекты при удалении стека\n)\n\n# L3 Construct (Pattern) — готовый архитектурный блок:\nfrom aws_cdk import aws_ecs_patterns as patterns\n\n# API на Fargate с ALB, health check, logging — всё из коробки:\napi = patterns.ApplicationLoadBalancedFargateService(\n    self, "API",\n    task_image_options=patterns.ApplicationLoadBalancedTaskImageOptions(\n        image=ecs.ContainerImage.from_asset("./api")\n    ),\n    desired_count=2,\n    public_load_balancer=True\n)\n\n# Scheduled Fargate Task (cron):\ncron_task = patterns.ScheduledFargateTask(\n    self, "CronJob",\n    scheduled_fargate_task_image_options=patterns.ScheduledFargateTaskImageOptions(\n        image=ecs.ContainerImage.from_asset("./cron")\n    ),\n    schedule=events.Schedule.rate(Duration.hours(1))\n)' },
        { type: 'note', value: 'CDK Construct Library содержит сотни готовых конструктов. Construct Hub (constructs.dev) — реестр community конструктов. Создавайте свои конструкты для переиспользования между проектами.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: IaC с CloudFormation и CDK',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте инфраструктуру используя CloudFormation шаблон и CDK.',
      requirements: [
        'Напишите CloudFormation шаблон с VPC, 2 подсетями, Security Group',
        'Добавьте Parameters для EnvironmentName и InstanceType',
        'Задеплойте стек и проверьте через describe-stacks',
        'Создайте CDK проект на Python или TypeScript',
        'Опишите в CDK: VPC + S3 Bucket с lifecycle + Lambda функцию',
        'Сравните количество кода CloudFormation vs CDK'
      ],
      hint: 'Для CloudFormation используйте !Ref и !GetAtt для ссылок между ресурсами. В CDK используйте cdk init --language python, затем опишите ресурсы в Stack классе.',
      expectedOutput: 'CloudFormation стек my-infra создан: VPC, 2 подсети, SG.\nParameters позволяют переключаться между dev/prod.\nCDK проект создан, cdk synth генерирует 200+ строк CloudFormation.\nCDK код: 30 строк Python = 200+ строк YAML.',
      solution: '# CloudFormation (сохранить как infra.yaml)\ncat > infra.yaml << \'EOF\'\nAWSTemplateFormatVersion: "2010-09-09"\nParameters:\n  EnvironmentName:\n    Type: String\n    Default: dev\nResources:\n  VPC:\n    Type: AWS::EC2::VPC\n    Properties:\n      CidrBlock: 10.0.0.0/16\n      Tags: [{Key: Name, Value: !Sub "${EnvironmentName}-vpc"}]\n  PublicSubnet1:\n    Type: AWS::EC2::Subnet\n    Properties:\n      VpcId: !Ref VPC\n      CidrBlock: 10.0.1.0/24\n      AvailabilityZone: !Select [0, !GetAZs ""]\n  PublicSubnet2:\n    Type: AWS::EC2::Subnet\n    Properties:\n      VpcId: !Ref VPC\n      CidrBlock: 10.0.2.0/24\n      AvailabilityZone: !Select [1, !GetAZs ""]\n  WebSG:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Web traffic\n      VpcId: !Ref VPC\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 0.0.0.0/0\nOutputs:\n  VpcId:\n    Value: !Ref VPC\nEOF\n\naws cloudformation create-stack --stack-name my-infra --template-body file://infra.yaml\naws cloudformation describe-stacks --stack-name my-infra\n\n# CDK\ncdk init app --language python\n# Добавить ресурсы в lib/stack.py и запустить:\ncdk synth\ncdk deploy',
      explanation: 'CloudFormation — стабильный, декларативный. CDK — быстрая разработка, IDE автодополнение, циклы и условия на настоящем языке программирования. CDK генерирует CloudFormation под капотом. Для новых проектов рекомендуется CDK.'
    }
  ]
}
