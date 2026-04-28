export default {
  id: 20,
  title: 'Multi-Cloud стратегия',
  description: 'Multi-Cloud подход: преимущества и недостатки, уровни абстракции, Terraform для мульти-облачного управления, избежание vendor lock-in.',
  lessons: [
    {
      id: 1,
      title: 'Зачем Multi-Cloud',
      type: 'theory',
      content: [
        { type: 'text', value: 'Multi-Cloud — использование нескольких облачных провайдеров одновременно. Позволяет выбирать лучшие сервисы каждого провайдера, снижает зависимость от одного поставщика и повышает отказоустойчивость.' },
        { type: 'heading', value: 'Преимущества Multi-Cloud' },
        { type: 'list', value: [
          'Best of breed — лучшие сервисы каждого провайдера (BigQuery от GCP, Active Directory от Azure)',
          'Снижение vendor lock-in — возможность миграции между провайдерами',
          'Compliance — данные в определённых регионах (где у одного провайдера нет ЦОД)',
          'Отказоустойчивость — выживание при сбое одного провайдера (редко, но бывает)',
          'Переговорная позиция — конкуренция между провайдерами за ваш бюджет'
        ] },
        { type: 'heading', value: 'Недостатки Multi-Cloud' },
        { type: 'list', value: [
          'Сложность — нужна экспертиза в нескольких облаках, больше инструментов',
          'Стоимость — egress traffic между облаками дорогой, дублирование инфраструктуры',
          'Согласованность — разные API, CLI, IAM модели, networking',
          'Потеря глубоких интеграций — managed сервисы работают лучше в рамках одного облака',
          'Команда — нужны специалисты по каждому облаку'
        ] },
        { type: 'code', language: 'bash', value: '# Типичные Multi-Cloud сценарии:\n#\n# 1. Primary + DR: AWS (primary) + GCP (disaster recovery)\n# 2. Best of breed: AWS (compute) + GCP (BigQuery/ML) + Azure (AD)\n# 3. Compliance: AWS (US data) + Azure (EU data, Azure Germany)\n# 4. Acquisition: компания A на AWS, компания B на Azure\n#\n# Реалистичный подход: "Cloud-Smart" вместо "Multi-Cloud-Everything"\n# - Основное облако для 80% нагрузок\n# - Второе облако для специфичных сервисов\n# - Terraform/Pulumi для общего IaC\n# - Kubernetes (EKS/GKE/AKS) как слой портабельности' },
        { type: 'tip', value: 'Не делайте Multi-Cloud ради Multi-Cloud. Начните с одного провайдера, освойте его. Добавляйте второй только когда есть конкретная причина (compliance, лучший сервис, DR). Kubernetes + Terraform — ключевые инструменты портабельности.' }
      ]
    },
    {
      id: 2,
      title: 'Terraform: Multi-Cloud IaC',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform (HashiCorp) — единый IaC инструмент для всех провайдеров. Декларативный язык HCL описывает инфраструктуру. Terraform plan показывает изменения, apply — применяет. State файл отслеживает состояние.' },
        { type: 'code', language: 'hcl', value: '# main.tf — Terraform конфигурация\nterraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n    google = {\n      source  = "hashicorp/google"\n      version = "~> 5.0"\n    }\n  }\n  backend "s3" {\n    bucket = "my-terraform-state"\n    key    = "infrastructure/terraform.tfstate"\n    region = "eu-central-1"\n  }\n}\n\nprovider "aws" {\n  region = "eu-central-1"\n}\n\nprovider "google" {\n  project = "my-gcp-project"\n  region  = "europe-west1"\n}\n\n# AWS EC2 Instance\nresource "aws_instance" "web" {\n  ami           = "ami-0abcdef1234567890"\n  instance_type = "t3.micro"\n  tags = { Name = "web-server" }\n}\n\n# GCP Compute Instance\nresource "google_compute_instance" "app" {\n  name         = "app-server"\n  machine_type = "e2-medium"\n  zone         = "europe-west1-b"\n  boot_disk {\n    initialize_params { image = "ubuntu-os-cloud/ubuntu-2204-lts" }\n  }\n  network_interface { network = "default" }\n}' },
        { type: 'code', language: 'bash', value: '# Terraform workflow:\nterraform init     # Скачать провайдеры\nterraform plan     # Показать изменения\nterraform apply    # Применить изменения\nterraform destroy  # Удалить всю инфраструктуру\n\n# Terraform state:\nterraform state list              # Список ресурсов\nterraform state show aws_instance.web  # Детали ресурса\nterraform import aws_instance.web i-xxx  # Импорт существующего ресурса' },
        { type: 'note', value: 'Terraform state файл содержит чувствительные данные (пароли, ключи). Никогда не храните в git. Используйте remote backend: S3 + DynamoDB (AWS), GCS (GCP), Azure Blob Storage. Включите state locking для предотвращения конфликтов.' }
      ]
    },
    {
      id: 3,
      title: 'Terraform: модули и переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform модули позволяют создавать переиспользуемые компоненты инфраструктуры. Переменные параметризуют конфигурацию. Outputs экспортируют значения между модулями.' },
        { type: 'code', language: 'hcl', value: '# variables.tf\nvariable "environment" {\n  type        = string\n  description = "Environment name"\n  validation {\n    condition     = contains(["dev", "staging", "prod"], var.environment)\n    error_message = "Environment must be dev, staging, or prod"\n  }\n}\n\nvariable "instance_type" {\n  type    = string\n  default = "t3.micro"\n}\n\n# terraform.tfvars (значения переменных)\nenvironment   = "prod"\ninstance_type = "t3.small"\n\n# Использование модуля:\nmodule "vpc" {\n  source      = "./modules/vpc"\n  environment = var.environment\n  cidr_block  = "10.0.0.0/16"\n}\n\nmodule "web_server" {\n  source        = "./modules/ec2"\n  environment   = var.environment\n  instance_type = var.instance_type\n  subnet_id     = module.vpc.public_subnet_id\n  vpc_id        = module.vpc.vpc_id\n}\n\n# modules/vpc/main.tf\nresource "aws_vpc" "main" {\n  cidr_block = var.cidr_block\n  tags = { Name = "${var.environment}-vpc" }\n}\n\n# modules/vpc/outputs.tf\noutput "vpc_id" { value = aws_vpc.main.id }\noutput "public_subnet_id" { value = aws_subnet.public.id }' },
        { type: 'tip', value: 'Terraform Registry (registry.terraform.io) содержит тысячи готовых модулей. Модуль terraform-aws-modules/vpc/aws создаёт production-ready VPC одной строкой. Используйте готовые модули вместо написания с нуля.' }
      ]
    },
    {
      id: 4,
      title: 'Слои абстракции для портабельности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для снижения vendor lock-in используйте слои абстракции: Kubernetes (compute), Terraform (IaC), cloud-agnostic сервисы (PostgreSQL вместо Aurora, Redis вместо ElastiCache). Но не абстрагируйте всё — теряете преимущества managed сервисов.' },
        { type: 'heading', value: 'Стратегии портабельности' },
        { type: 'list', value: [
          'Kubernetes: EKS/GKE/AKS — одинаковые манифесты на всех облаках',
          'Terraform: один язык для всех провайдеров, модули для абстракции',
          'Docker: контейнеры запускаются в любом облаке',
          'Open source БД: PostgreSQL, MongoDB, Redis вместо проприетарных',
          'S3-compatible API: MinIO, GCS (совместимый режим)',
          'OpenTelemetry: единый стандарт мониторинга для всех облаков'
        ] },
        { type: 'code', language: 'hcl', value: '# Абстракция через Terraform модули:\n# Один модуль — разные провайдеры:\n\n# modules/kubernetes/main.tf\nvariable "provider" { type = string }\n\nresource "aws_eks_cluster" "this" {\n  count = var.provider == "aws" ? 1 : 0\n  name  = "my-cluster"\n  # ... AWS-specific config\n}\n\nresource "google_container_cluster" "this" {\n  count = var.provider == "gcp" ? 1 : 0\n  name  = "my-cluster"\n  # ... GCP-specific config\n}\n\n# Использование:\nmodule "k8s" {\n  source   = "./modules/kubernetes"\n  provider = "aws"  # или "gcp"\n}\n\n# Более реалистичный подход:\n# Отдельные модули для каждого провайдера,\n# общий Kubernetes deployment YAML' },
        { type: 'note', value: 'Золотое правило: абстрагируйте compute (Kubernetes) и IaC (Terraform), но используйте managed сервисы провайдера для баз данных, очередей и кэшей. Стоимость портабельности БД (например, вместо DynamoDB — self-managed Cassandra) обычно превышает пользу.' }
      ]
    },
    {
      id: 5,
      title: 'Crossplane и Pulumi',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо Terraform существуют альтернативные инструменты для Multi-Cloud: Crossplane (управление облаком через Kubernetes API), Pulumi (IaC на обычных языках программирования).' },
        { type: 'code', language: 'yaml', value: '# Crossplane — управление облаком через Kubernetes:\n# S3 bucket как Kubernetes ресурс:\napiVersion: s3.aws.upbound.io/v1beta1\nkind: Bucket\nmetadata:\n  name: my-bucket\nspec:\n  forProvider:\n    region: eu-central-1\n    tags:\n      Environment: production\n  providerConfigRef:\n    name: aws-provider' },
        { type: 'code', language: 'python', value: '# Pulumi — IaC на Python (или TypeScript, Go, C#):\nimport pulumi\nimport pulumi_aws as aws\nimport pulumi_gcp as gcp\n\n# AWS S3\nbucket = aws.s3.Bucket("my-bucket",\n    versioning=aws.s3.BucketVersioningArgs(\n        enabled=True\n    ),\n    tags={"Environment": "prod"}\n)\n\n# GCP Cloud Storage\ngcs_bucket = gcp.storage.Bucket("my-gcs-bucket",\n    location="EU",\n    versioning=gcp.storage.BucketVersioningArgs(\n        enabled=True\n    )\n)\n\n# Pulumi позволяет использовать циклы, условия, функции\n# как в обычном программировании (в отличие от HCL)\nfor i in range(3):\n    aws.ec2.Instance(f"web-{i}",\n        ami="ami-xxx",\n        instance_type="t3.micro",\n        tags={"Name": f"web-{i}"}\n    )\n\npulumi.export("bucket_url", bucket.bucket_regional_domain_name)\npulumi.export("gcs_url", gcs_bucket.url)' },
        { type: 'tip', value: 'Terraform — самый популярный и зрелый выбор для IaC. Pulumi — если команда предпочитает TypeScript/Python вместо HCL. Crossplane — если используете Kubernetes как platform и хотите управлять всем через kubectl.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Multi-Cloud с Terraform',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Multi-Cloud инфраструктуру с Terraform: ресурсы в AWS и GCP.',
      requirements: [
        'Инициализируйте Terraform проект с провайдерами AWS и GCP',
        'Создайте S3 bucket в AWS и Cloud Storage bucket в GCP',
        'Используйте переменные для environment name',
        'Создайте Terraform модуль для переиспользуемого компонента',
        'Настройте remote backend для state в S3',
        'Выполните terraform plan и проанализируйте изменения'
      ],
      hint: 'terraform init скачает провайдеры. Используйте variable blocks для параметризации. Module — директория с main.tf, variables.tf, outputs.tf.',
      expectedOutput: 'Terraform init: провайдеры AWS и GCP скачаны.\nterraform plan показывает: 2 to add (S3 + GCS bucket).\nПеременная environment = "dev".\nМодуль storage создан и используется.\nRemote backend в S3 настроен.',
      solution: '# Структура проекта:\nmkdir -p multi-cloud/{modules/storage}\ncd multi-cloud\n\n# main.tf\ncat > main.tf << \'EOF\'\nterraform {\n  required_providers {\n    aws    = { source = "hashicorp/aws", version = "~> 5.0" }\n    google = { source = "hashicorp/google", version = "~> 5.0" }\n  }\n}\nprovider "aws" { region = "eu-central-1" }\nprovider "google" { project = "my-project" region = "europe-west1" }\n\nvariable "environment" { default = "dev" }\n\nmodule "storage" {\n  source      = "./modules/storage"\n  environment = var.environment\n}\nEOF\n\n# modules/storage/main.tf\ncat > modules/storage/main.tf << \'EOF\'\nvariable "environment" { type = string }\n\nresource "aws_s3_bucket" "data" {\n  bucket = "myapp-${var.environment}-data"\n  tags   = { Environment = var.environment }\n}\n\nresource "google_storage_bucket" "data" {\n  name     = "myapp-${var.environment}-gcs-data"\n  location = "EU"\n  labels   = { environment = var.environment }\n}\n\noutput "s3_arn" { value = aws_s3_bucket.data.arn }\noutput "gcs_url" { value = google_storage_bucket.data.url }\nEOF\n\nterraform init\nterraform plan -var="environment=dev"',
      explanation: 'Terraform позволяет управлять ресурсами в нескольких облаках из единой конфигурации. Модули обеспечивают переиспользование. Remote backend в S3 позволяет команде работать с одним state. terraform plan предотвращает неожиданные изменения.'
    }
  ]
}
