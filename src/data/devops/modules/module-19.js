export default {
  id: 19,
  title: 'AWS: основы',
  description: 'Основные сервисы AWS: EC2, S3, RDS, IAM, VPC — знания необходимые каждому DevOps-инженеру.',
  lessons: [
    {
      id: 1,
      title: 'Введение в AWS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon Web Services (AWS) — крупнейший облачный провайдер с 200+ сервисами. AWS используют Netflix, Airbnb, NASA. Знание AWS — обязательное требование для DevOps.' },
        { type: 'heading', value: 'Основные сервисы AWS' },
        { type: 'list', value: [
          'EC2 — виртуальные серверы (compute)',
          'S3 — объектное хранилище (storage)',
          'RDS — управляемые базы данных (database)',
          'IAM — управление доступом (security)',
          'VPC — виртуальная сеть (networking)',
          'ECS/EKS — контейнеры (Docker/Kubernetes)',
          'Lambda — бессерверные функции (serverless)',
          'CloudWatch — мониторинг и логирование',
          'Route53 — DNS',
          'CloudFront — CDN'
        ] },
        { type: 'heading', value: 'AWS CLI' },
        { type: 'code', language: 'bash', value: '# Установка AWS CLI\ncurl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"\nunzip awscliv2.zip\nsudo ./aws/install\n\n# Настройка\naws configure\n# AWS Access Key ID: AKIA...\n# AWS Secret Access Key: ...\n# Default region: us-east-1\n# Default output: json\n\n# Проверка\naws sts get-caller-identity\n# {\n#   "UserId": "AIDAEXAMPLE",\n#   "Account": "123456789012",\n#   "Arn": "arn:aws:iam::123456789012:user/devops"\n# }' },
        { type: 'tip', value: 'Создай отдельного IAM-пользователя для CLI с минимальными правами. Никогда не используй root аккаунт. Включи MFA (Multi-Factor Authentication) для всех пользователей.' }
      ]
    },
    {
      id: 2,
      title: 'EC2 — виртуальные серверы',
      type: 'theory',
      content: [
        { type: 'text', value: 'EC2 (Elastic Compute Cloud) — виртуальные серверы в облаке. Можно запустить сервер за минуты, масштабировать вверх/вниз, платить только за использование.' },
        { type: 'heading', value: 'Типы инстансов' },
        { type: 'code', language: 'bash', value: '# Типы инстансов EC2:\n# t3.micro   — 2 vCPU, 1 GB RAM   (Free Tier, dev/test)\n# t3.small   — 2 vCPU, 2 GB RAM   (легкие приложения)\n# t3.medium  — 2 vCPU, 4 GB RAM   (веб-серверы)\n# m5.large   — 2 vCPU, 8 GB RAM   (general purpose)\n# c5.xlarge  — 4 vCPU, 8 GB RAM   (CPU-intensive)\n# r5.large   — 2 vCPU, 16 GB RAM  (memory-intensive, БД)\n\n# Категории:\n# t — burstable (переменная нагрузка)\n# m — general purpose (сбалансированные)\n# c — compute optimized (CPU)\n# r — memory optimized (RAM)\n# g/p — GPU (ML, графика)\n# i — storage optimized (диски)' },
        { type: 'heading', value: 'Управление EC2' },
        { type: 'code', language: 'bash', value: '# Запуск инстанса\naws ec2 run-instances \\\n  --image-id ami-0c55b159cbfafe1f0 \\\n  --instance-type t3.micro \\\n  --key-name my-key \\\n  --security-group-ids sg-abc123 \\\n  --subnet-id subnet-abc123 \\\n  --tag-specifications \'ResourceType=instance,Tags=[{Key=Name,Value=web-server}]\'\n\n# Список инстансов\naws ec2 describe-instances \\\n  --filters "Name=tag:Name,Values=web-*" \\\n  --query "Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]" \\\n  --output table\n\n# Остановка / запуск / удаление\naws ec2 stop-instances --instance-ids i-abc123\naws ec2 start-instances --instance-ids i-abc123\naws ec2 terminate-instances --instance-ids i-abc123\n\n# SSH подключение\nssh -i ~/.ssh/my-key.pem ubuntu@54.23.12.45' },
        { type: 'note', value: 'EC2 инстансы оплачиваются посекундно (минимум 60 сек). Для экономии: используй Reserved Instances (до 75% скидка) или Spot Instances (до 90% скидка, но могут быть прерваны).' }
      ]
    },
    {
      id: 3,
      title: 'S3 — хранилище объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'S3 (Simple Storage Service) — масштабируемое объектное хранилище. Используется для: бэкапов, статических сайтов, хранения логов, артефактов CI/CD, Terraform state.' },
        { type: 'heading', value: 'Работа с S3' },
        { type: 'code', language: 'bash', value: '# Создание bucket\naws s3 mb s3://my-company-backups\naws s3 mb s3://my-company-backups --region us-east-1\n\n# Загрузка файлов\naws s3 cp backup.tar.gz s3://my-company-backups/\naws s3 cp ./logs/ s3://my-company-backups/logs/ --recursive\n\n# Скачивание\naws s3 cp s3://my-company-backups/backup.tar.gz ./\n\n# Синхронизация (только изменённые файлы)\naws s3 sync ./dist/ s3://my-website/\naws s3 sync s3://my-company-backups/ ./backup/\n\n# Список файлов\naws s3 ls s3://my-company-backups/\naws s3 ls s3://my-company-backups/ --recursive --human-readable\n\n# Удаление\naws s3 rm s3://my-company-backups/old-file.log\naws s3 rm s3://my-company-backups/ --recursive  # Все файлы\naws s3 rb s3://my-company-backups --force        # Удалить bucket' },
        { type: 'heading', value: 'Классы хранения' },
        { type: 'code', language: 'bash', value: '# Классы хранения S3:\n# Standard          — частый доступ ($0.023/GB)\n# Intelligent-Tiering — автоматический выбор класса\n# Standard-IA       — редкий доступ ($0.0125/GB)\n# One Zone-IA       — редкий доступ, одна зона\n# Glacier Instant   — архив, мгновенное извлечение\n# Glacier Flexible  — архив, извлечение за минуты-часы\n# Glacier Deep      — глубокий архив, извлечение за 12ч ($0.00099/GB)\n\n# Жизненный цикл (автоматический переход)\naws s3api put-bucket-lifecycle-configuration \\\n  --bucket my-company-backups \\\n  --lifecycle-configuration \'{\n    "Rules": [{\n      "ID": "MoveToGlacier",\n      "Status": "Enabled",\n      "Transitions": [{\n        "Days": 30,\n        "StorageClass": "GLACIER"\n      }],\n      "Expiration": { "Days": 365 }\n    }]\n  }\'' },
        { type: 'tip', value: 'S3 bucket имена глобально уникальные. Используй convention: company-project-env-purpose (company-myapp-prod-backups). Включай versioning для важных бакетов.' }
      ]
    },
    {
      id: 4,
      title: 'IAM — управление доступом',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM (Identity and Access Management) управляет кто и что может делать в AWS. Правильная настройка IAM — основа безопасности облачной инфраструктуры.' },
        { type: 'heading', value: 'Компоненты IAM' },
        { type: 'code', language: 'bash', value: '# IAM компоненты:\n# User     — человек или сервис (логин + ключи)\n# Group    — группа пользователей (developers, devops)\n# Role     — роль для сервисов AWS (EC2 может обращаться к S3)\n# Policy   — JSON документ с правами доступа\n\n# Создание пользователя\naws iam create-user --user-name deploy-bot\naws iam create-access-key --user-name deploy-bot\n\n# Добавление в группу\naws iam add-user-to-group --user-name deploy-bot --group-name devops\n\n# Прикрепление политики\naws iam attach-user-policy \\\n  --user-name deploy-bot \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess' },
        { type: 'heading', value: 'IAM Policies' },
        { type: 'code', language: 'json', value: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": [\n        "s3:GetObject",\n        "s3:PutObject",\n        "s3:ListBucket"\n      ],\n      "Resource": [\n        "arn:aws:s3:::my-bucket",\n        "arn:aws:s3:::my-bucket/*"\n      ]\n    },\n    {\n      "Effect": "Allow",\n      "Action": [\n        "ec2:DescribeInstances",\n        "ec2:StartInstances",\n        "ec2:StopInstances"\n      ],\n      "Resource": "*",\n      "Condition": {\n        "StringEquals": {\n          "aws:RequestedRegion": "us-east-1"\n        }\n      }\n    }\n  ]\n}' },
        { type: 'warning', value: 'Принцип наименьших привилегий (Least Privilege): давай только те права, которые реально нужны. Никогда не используй AdministratorAccess для сервисных аккаунтов. Регулярно аудируй IAM через AWS IAM Access Analyzer.' }
      ]
    },
    {
      id: 5,
      title: 'VPC и RDS',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPC (Virtual Private Cloud) — изолированная сеть в AWS. RDS (Relational Database Service) — управляемые базы данных. Эти сервисы составляют основу любой облачной инфраструктуры.' },
        { type: 'heading', value: 'VPC — сеть' },
        { type: 'code', language: 'bash', value: '# Компоненты VPC:\n# VPC             — виртуальная сеть (10.0.0.0/16)\n# Subnet          — подсеть (public / private)\n# Internet Gateway — выход в интернет для public подсетей\n# NAT Gateway     — выход в интернет для private подсетей\n# Route Table     — таблицы маршрутизации\n# Security Group  — файрволл для EC2\n# NACL            — файрволл для подсетей\n\n# Типичная архитектура VPC:\n# VPC 10.0.0.0/16\n# ├── Public Subnet 10.0.1.0/24  (AZ-a) — Load Balancer, Bastion\n# ├── Public Subnet 10.0.2.0/24  (AZ-b)\n# ├── Private Subnet 10.0.10.0/24 (AZ-a) — App servers\n# ├── Private Subnet 10.0.20.0/24 (AZ-b) — App servers\n# ├── Private Subnet 10.0.30.0/24 (AZ-a) — Database\n# └── Private Subnet 10.0.40.0/24 (AZ-b) — Database' },
        { type: 'heading', value: 'RDS — базы данных' },
        { type: 'code', language: 'bash', value: '# Поддерживаемые СУБД:\n# PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Aurora\n\n# Создание RDS инстанса\naws rds create-db-instance \\\n  --db-instance-identifier myapp-db \\\n  --db-instance-class db.t3.micro \\\n  --engine postgres \\\n  --engine-version 16.1 \\\n  --master-username admin \\\n  --master-user-password "$DB_PASSWORD" \\\n  --allocated-storage 20 \\\n  --storage-type gp3 \\\n  --vpc-security-group-ids sg-abc123 \\\n  --db-subnet-group-name my-subnet-group \\\n  --multi-az \\\n  --backup-retention-period 7\n\n# Подключение\npsql -h myapp-db.abc123.us-east-1.rds.amazonaws.com \\\n     -U admin -d myapp\n\n# Преимущества RDS (vs самостоятельная установка):\n# - Автоматические бэкапы\n# - Multi-AZ (отказоустойчивость)\n# - Автоматические обновления\n# - Мониторинг из коробки\n# - Шифрование' },
        { type: 'tip', value: 'Базы данных ВСЕГДА размещай в private подсетях (без прямого доступа из интернета). Доступ только через Security Group от application серверов. Multi-AZ обязательно для продакшена.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Развёртывание в AWS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте базовую инфраструктуру в AWS с помощью CLI или Terraform.',
      requirements: [
        'Создайте S3 bucket для бэкапов с versioning',
        'Создайте IAM пользователя с политикой доступа к S3',
        'Опишите VPC с public и private подсетями',
        'Запустите EC2 инстанс в public подсети',
        'Создайте Security Group с правилами для SSH и HTTP',
        'Загрузите файл в S3 и проверьте доступ'
      ],
      hint: 'aws s3 mb для bucket. aws iam create-user для пользователя. Для VPC и EC2 используй Terraform (модуль 15). Security Group: ingress 22, 80, 443.',
      expectedOutput: 'S3 bucket создан с versioning\nIAM пользователь с S3 политикой\nVPC с public/private подсетями\nEC2 запущен, доступен по SSH\nSecurity Group: SSH (22), HTTP (80), HTTPS (443)\nФайл загружен в S3',
      solution: '#!/bin/bash\n# 1. S3 bucket\naws s3 mb s3://mycompany-backups-2024\naws s3api put-bucket-versioning \\\n  --bucket mycompany-backups-2024 \\\n  --versioning-configuration Status=Enabled\n\n# 2. IAM пользователь\naws iam create-user --user-name backup-bot\naws iam put-user-policy --user-name backup-bot \\\n  --policy-name S3BackupAccess \\\n  --policy-document \'{\n    "Version": "2012-10-17",\n    "Statement": [{\n      "Effect": "Allow",\n      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],\n      "Resource": ["arn:aws:s3:::mycompany-backups-2024", "arn:aws:s3:::mycompany-backups-2024/*"]\n    }]\n  }\'\naws iam create-access-key --user-name backup-bot\n\n# 3-5. VPC + EC2 + SG (через Terraform — см. модуль 15)\n# resource "aws_vpc" ... \n# resource "aws_subnet" ...\n# resource "aws_security_group" ...\n# resource "aws_instance" ...\n\n# 6. Загрузка в S3\necho "test backup" > /tmp/test-backup.txt\naws s3 cp /tmp/test-backup.txt s3://mycompany-backups-2024/\naws s3 ls s3://mycompany-backups-2024/',
      explanation: 'S3 versioning сохраняет историю изменений файлов. IAM Policy ограничивает доступ только к конкретному bucket. VPC изолирует ресурсы. Security Group работает как файрволл. EC2 в public подсети доступен из интернета. Принцип наименьших привилегий: backup-bot может только работать с одним bucket.'
    }
  ]
}
