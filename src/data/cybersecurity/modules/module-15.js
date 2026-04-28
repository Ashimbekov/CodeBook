export default {
  id: 15,
  title: 'Cloud Security',
  description: 'IAM, шифрование данных, VPC security, модель общей ответственности, безопасность AWS/GCP/Azure.',
  lessons: [
    {
      id: 1,
      title: 'Модель общей ответственности',
      type: 'theory',
      content: [
        { type: 'text', value: 'В облаке безопасность разделена между провайдером и клиентом. Провайдер защищает инфраструктуру (физические серверы, сеть, гипервизор). Клиент — свои данные, конфигурацию, доступ, приложения.' },
        { type: 'heading', value: 'Что защищает облачный провайдер' },
        { type: 'list', value: [
          'Физическая безопасность дата-центров',
          'Гипервизор и аппаратное обеспечение',
          'Сетевая инфраструктура',
          'Managed сервисы (RDS, S3 — частично)'
        ]},
        { type: 'heading', value: 'Что защищает клиент' },
        { type: 'list', value: [
          'IAM: кто имеет доступ и с какими правами',
          'Данные: шифрование at rest и in transit',
          'Сетевая конфигурация: Security Groups, VPC, NACLs',
          'Конфигурация сервисов: публичные S3 бакеты, открытые БД',
          'Приложения: код, зависимости, секреты',
          'Операционная система: патчи, конфигурация (для EC2/VM)'
        ]},
        { type: 'code', language: 'bash', value: '# Частые ошибки конфигурации облака:\n\n# 1. Публичный S3 бакет\naws s3api get-bucket-acl --bucket my-bucket\n# Grantee: AllUsers — ПУБЛИЧНЫЙ ДОСТУП!\n\n# 2. Security Group: открыт 0.0.0.0/0 для SSH\naws ec2 describe-security-groups --query \\\n  "SecurityGroups[*].{Name:GroupName, Rules:IpPermissions[?FromPort==\\`22\\`]}"\n\n# 3. IAM пользователь с AdministratorAccess\naws iam list-attached-user-policies --user-name developer\n# PolicyName: AdministratorAccess — СЛИШКОМ МНОГО ПРАВ!\n\n# 4. Незашифрованные EBS тома\naws ec2 describe-volumes --query \\\n  "Volumes[?Encrypted==\\`false\\`].{ID:VolumeId,Size:Size}"' },
        { type: 'warning', value: 'Более 90% облачных взломов — из-за ошибок конфигурации клиента, не уязвимостей провайдера. Публичные S3 бакеты, широкие IAM права, открытые Security Groups — основные причины инцидентов.' }
      ]
    },
    {
      id: 2,
      title: 'IAM: Identity and Access Management',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM — система управления доступом в облаке. Принцип наименьших привилегий критичен: каждый пользователь и сервис получает минимально необходимые права. IAM роли предпочтительнее IAM пользователей.' },
        { type: 'code', language: 'javascript', value: '// === AWS IAM Policy: принцип наименьших привилегий ===\n\n// ПЛОХО: полный доступ к S3\nconst badPolicy = {\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": "s3:*",\n    "Resource": "*"\n  }]\n};\n\n// ХОРОШО: минимальные права\nconst goodPolicy = {\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": [\n      "s3:GetObject",\n      "s3:PutObject"\n    ],\n    "Resource": "arn:aws:s3:::my-app-uploads/*",  // Конкретный бакет!\n    "Condition": {\n      "StringEquals": {\n        "s3:x-amz-server-side-encryption": "aws:kms"  // Только шифрованные!\n      }\n    }\n  }]\n};\n\n// === IAM Roles для EC2 (вместо access keys) ===\n// EC2 получает временные credentials через Instance Profile\n// Не нужно хранить AWS_ACCESS_KEY_ID в коде или env!\n\n// === AWS Organizations: SCP (Service Control Policies) ===\n// Ограничение на уровне организации\nconst scp = {\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Deny",\n    "Action": [\n      "ec2:RunInstances"\n    ],\n    "Resource": "*",\n    "Condition": {\n      "StringNotEquals": {\n        "ec2:Region": ["eu-central-1", "eu-west-1"]\n      }\n    }\n  }]\n  // Запретить создание EC2 вне EU регионов\n};' },
        { type: 'tip', value: 'Используйте IAM роли вместо IAM пользователей с ключами доступа. Роли выдают временные credentials (STS). Для разработчиков — AWS SSO вместо IAM пользователей. Регулярно ревьюйте неиспользуемые права через IAM Access Analyzer.' }
      ]
    },
    {
      id: 3,
      title: 'VPC и сетевая безопасность облака',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPC (Virtual Private Cloud) — изолированная сеть в облаке. Security Groups (stateful) и NACLs (stateless) контролируют трафик. Правильная сегментация: public/private subnets, NAT Gateway, VPC Endpoints.' },
        { type: 'code', language: 'yaml', value: '# === Terraform: безопасная VPC архитектура ===\n\n# Архитектура:\n# Internet -> ALB (public subnet) -> App (private subnet) -> DB (private subnet)\n# Нет прямого доступа из интернета к App и DB!\n\n# VPC\n# resource "aws_vpc" "main" {\n#   cidr_block           = "10.0.0.0/16"\n#   enable_dns_support   = true\n#   enable_dns_hostnames = true\n# }\n\n# Public Subnet (ALB, NAT Gateway)\n# resource "aws_subnet" "public" {\n#   vpc_id     = aws_vpc.main.id\n#   cidr_block = "10.0.1.0/24"\n#   map_public_ip_on_launch = true\n# }\n\n# Private Subnet (App servers)\n# resource "aws_subnet" "private_app" {\n#   vpc_id     = aws_vpc.main.id\n#   cidr_block = "10.0.10.0/24"\n#   map_public_ip_on_launch = false  # НЕТ публичных IP!\n# }\n\n# Private Subnet (Database)\n# resource "aws_subnet" "private_db" {\n#   vpc_id     = aws_vpc.main.id\n#   cidr_block = "10.0.20.0/24"\n#   map_public_ip_on_launch = false\n# }\n\n# Security Group: ALB\n# Ingress: 80, 443 from 0.0.0.0/0\n# Egress: 8080 to App SG only\n\n# Security Group: App\n# Ingress: 8080 from ALB SG only\n# Egress: 5432 to DB SG only, 443 to 0.0.0.0/0 (API calls)\n\n# Security Group: DB\n# Ingress: 5432 from App SG only\n# Egress: NONE (база не инициирует соединений)' },
        { type: 'tip', value: 'Базы данных всегда в private subnet без публичного IP. Используйте VPC Endpoints для доступа к AWS сервисам (S3, SQS) без выхода в интернет. Включите VPC Flow Logs для мониторинга сетевого трафика.' }
      ]
    },
    {
      id: 4,
      title: 'Шифрование данных в облаке',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шифрование данных: at rest (в хранилище), in transit (при передаче), in use (при обработке). AWS KMS, GCP Cloud KMS, Azure Key Vault — управляемые сервисы шифрования.' },
        { type: 'code', language: 'bash', value: '# === Шифрование At Rest ===\n\n# S3: шифрование по умолчанию\naws s3api put-bucket-encryption --bucket my-bucket \\\n  --server-side-encryption-configuration \'{\n    "Rules": [{\n      "ApplyServerSideEncryptionByDefault": {\n        "SSEAlgorithm": "aws:kms",\n        "KMSMasterKeyID": "arn:aws:kms:eu-central-1:123:key/abc"\n      },\n      "BucketKeyEnabled": true\n    }]\n  }\'\n\n# S3: блокировка публичного доступа\naws s3api put-public-access-block --bucket my-bucket \\\n  --public-access-block-configuration \\\n  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\n\n# RDS: шифрование\naws rds create-db-instance \\\n  --storage-encrypted \\\n  --kms-key-id arn:aws:kms:...\n\n# EBS: шифрование по умолчанию для региона\naws ec2 enable-ebs-encryption-by-default\n\n# === Шифрование In Transit ===\n# ALB: только HTTPS\n# aws elbv2 create-listener --protocol HTTPS --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06\n\n# RDS: SSL/TLS соединения\n# PGSSLMODE=verify-full\n# rds-combined-ca-bundle.pem\n\n# === KMS Key Policy ===\n# Разделение: кто управляет ключом и кто использует\n# Admin: может управлять, НЕ может шифровать\n# App: может шифровать/дешифровать, НЕ может управлять' },
        { type: 'warning', value: 'Включите шифрование для ВСЕХ хранилищ: S3, EBS, RDS, DynamoDB, ElastiCache. Заблокируйте публичный доступ к S3 на уровне аккаунта. Используйте Customer Managed Keys (CMK) для контроля над шифрованием.' }
      ]
    },
    {
      id: 5,
      title: 'Cloud Security Posture Management',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSPM (Cloud Security Posture Management) — инструменты для непрерывного мониторинга и исправления ошибок конфигурации облака. AWS Security Hub, GCP Security Command Center, Azure Defender, а также open-source: Prowler, ScoutSuite.' },
        { type: 'code', language: 'bash', value: '# === Prowler: аудит безопасности AWS ===\npip install prowler\n\n# Полный аудит\nprowler aws\n\n# Конкретные проверки\nprowler aws --checks iam_no_root_access_key s3_bucket_public_access\n\n# Пример вывода:\n# FAIL: IAM root account has access keys\n# FAIL: S3 bucket my-data-bucket has public access\n# PASS: CloudTrail is enabled in all regions\n# PASS: EBS default encryption is enabled\n\n# === AWS Security Hub ===\naws securityhub get-findings --query \\\n  "Findings[?Severity.Label==\'CRITICAL\'].{Title:Title,Resource:Resources[0].Id}"\n\n# === Checkov: IaC security scanning ===\npip install checkov\n\n# Сканирование Terraform\ncheckov -d ./terraform/\n\n# Пример:\n# FAILED: CKV_AWS_145: S3 bucket encryption not enabled\n# FAILED: CKV_AWS_18: S3 bucket access logging not enabled\n# PASSED: CKV_AWS_20: S3 bucket does not allow public ACL\n\n# === tfsec: Terraform security scanner ===\ntfsec ./terraform/\n# WARNING: Security group rule allows egress to 0.0.0.0/0\n# CRITICAL: RDS instance not encrypted' },
        { type: 'tip', value: 'Используйте Prowler/ScoutSuite для регулярного аудита. Checkov/tfsec — для сканирования IaC до деплоя. AWS Config Rules — для непрерывного мониторинга compliance. Интегрируйте все инструменты в CI/CD.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Аудит безопасности облачной инфраструктуры',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите аудит безопасности облачной инфраструктуры: IAM, сетевая конфигурация, шифрование и публичный доступ.',
      requirements: [
        'Проверьте IAM политики на избыточные права (wildcards, Admin)',
        'Найдите Security Groups с открытым 0.0.0.0/0 на чувствительных портах',
        'Проверьте шифрование всех хранилищ (S3, EBS, RDS)',
        'Найдите публично доступные ресурсы (S3 бакеты, RDS)',
        'Создайте Terraform конфигурацию с security best practices'
      ],
      hint: 'Используйте aws cli для проверок, Prowler для автоматического аудита, Checkov для IaC. Ищите: wildcard permissions, 0.0.0.0/0 в SG, unencrypted storage.',
      expectedOutput: 'IAM: 2 пользователя с AdministratorAccess (исправить!)\nSecurity Groups: SSH(22) открыт для 0.0.0.0/0 (ограничить IP)\nШифрование: 3 EBS тома без шифрования, 1 S3 бакет без SSE\nПубличный доступ: 1 S3 бакет публичный, 1 RDS с public access\nТерраform: исправленная конфигурация с шифрованием и private subnets',
      solution: '#!/bin/bash\n# Скрипт аудита безопасности AWS\n\necho "=== 1. IAM Audit ==="\n# Пользователи с AdministratorAccess\nfor user in $(aws iam list-users --query "Users[*].UserName" --output text); do\n  policies=$(aws iam list-attached-user-policies --user-name $user \\\n    --query "AttachedPolicies[?PolicyName==\'AdministratorAccess\'].PolicyName" --output text)\n  if [ -n "$policies" ]; then\n    echo "WARN: $user has AdministratorAccess!"\n  fi\ndone\n\necho ""\necho "=== 2. Security Groups Audit ==="\n# SG с 0.0.0.0/0 на чувствительных портах\naws ec2 describe-security-groups --query \\\n  "SecurityGroups[].{Name:GroupName,Rules:IpPermissions[?contains(IpRanges[].CidrIp,\'0.0.0.0/0\')]}" \\\n  --output table\n\necho ""\necho "=== 3. Encryption Audit ==="\n# Незашифрованные EBS тома\naws ec2 describe-volumes --query \\\n  "Volumes[?Encrypted==\\`false\\`].{ID:VolumeId,Size:Size}" --output table\n\n# S3 бакеты без шифрования\nfor bucket in $(aws s3api list-buckets --query "Buckets[].Name" --output text); do\n  enc=$(aws s3api get-bucket-encryption --bucket $bucket 2>/dev/null)\n  if [ $? -ne 0 ]; then\n    echo "WARN: $bucket has no encryption!"\n  fi\ndone\n\necho ""\necho "=== 4. Public Access Audit ==="\n# Публичные S3 бакеты\nfor bucket in $(aws s3api list-buckets --query "Buckets[].Name" --output text); do\n  public=$(aws s3api get-public-access-block --bucket $bucket 2>/dev/null)\n  if [ $? -ne 0 ]; then\n    echo "WARN: $bucket may be public!"\n  fi\ndone\n\necho ""\necho "=== Аудит завершён ==="',
      explanation: 'Аудит облачной безопасности охватывает: IAM (избыточные права, неиспользуемые ключи), сеть (открытые Security Groups, публичные ресурсы), шифрование (at rest и in transit), публичный доступ (S3, RDS). Автоматизируйте проверки с Prowler и включите в CI/CD.'
    }
  ]
}
