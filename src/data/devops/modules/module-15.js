export default {
  id: 15,
  title: 'Terraform: основы',
  description: 'Infrastructure as Code с Terraform: провайдеры, ресурсы, состояние, переменные и основные команды.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Terraform и IaC',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform — инструмент Infrastructure as Code (IaC) от HashiCorp. Он позволяет описывать инфраструктуру декларативно в коде и создавать/изменять/удалять ресурсы в облаке автоматически.' },
        { type: 'heading', value: 'Зачем нужен IaC' },
        { type: 'list', value: [
          'Воспроизводимость — одинаковая инфраструктура dev/staging/prod',
          'Версионирование — инфраструктура в Git, код-ревью для изменений',
          'Автоматизация — нет ручной настройки через консоль облака',
          'Документация — код IS документация инфраструктуры',
          'Быстрое восстановление — пересоздание всей инфраструктуры за минуты'
        ] },
        { type: 'heading', value: 'Установка и первые шаги' },
        { type: 'code', language: 'bash', value: '# Установка Terraform\nwget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip\nunzip terraform_1.7.0_linux_amd64.zip\nsudo mv terraform /usr/local/bin/\nterraform version\n\n# Или через пакетный менеджер\nsudo apt install -y gnupg software-properties-common\nwget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg\necho "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list\nsudo apt update && sudo apt install terraform\n\n# Основные команды\nterraform init      # Инициализация (скачивание провайдеров)\nterraform plan      # Предварительный план изменений\nterraform apply     # Применить изменения\nterraform destroy   # Удалить ВСЮ инфраструктуру\nterraform fmt       # Форматирование кода\nterraform validate  # Проверка синтаксиса' },
        { type: 'tip', value: 'Terraform работает с 3000+ провайдерами: AWS, GCP, Azure, Kubernetes, GitHub, Cloudflare и др. Один инструмент для всего — это главное преимущество над CloudFormation (только AWS) и ARM Templates (только Azure).' }
      ]
    },
    {
      id: 2,
      title: 'HCL и первая конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'HCL (HashiCorp Configuration Language) — язык конфигурации Terraform. Файлы имеют расширение .tf. Синтаксис декларативный: описываешь ЧТО хочешь, а не КАК это создать.' },
        { type: 'heading', value: 'Структура проекта Terraform' },
        { type: 'code', language: 'bash', value: '# Типичная структура:\nproject/\n├── main.tf          # Основные ресурсы\n├── variables.tf     # Переменные\n├── outputs.tf       # Выходные значения\n├── providers.tf     # Настройка провайдеров\n├── terraform.tfvars # Значения переменных\n└── .terraform/      # Скачанные провайдеры (в .gitignore!)' },
        { type: 'heading', value: 'Первая конфигурация (AWS)' },
        { type: 'code', language: 'hcl', value: '# providers.tf\nterraform {\n  required_version = ">= 1.5"\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "us-east-1"\n}\n\n# main.tf — создание EC2 инстанса\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"  # Ubuntu 22.04\n  instance_type = "t3.micro"\n\n  tags = {\n    Name        = "web-server"\n    Environment = "production"\n    ManagedBy   = "terraform"\n  }\n}\n\n# outputs.tf\noutput "instance_ip" {\n  value       = aws_instance.web.public_ip\n  description = "Public IP of web server"\n}' },
        { type: 'code', language: 'bash', value: '# Рабочий процесс:\nterraform init      # Скачать провайдер AWS\nterraform plan      # Показать что будет создано\nterraform apply     # Создать ресурсы (спросит подтверждение)\nterraform apply -auto-approve  # Без подтверждения\n\n# Результат:\n# aws_instance.web: Creating...\n# aws_instance.web: Creation complete after 30s [id=i-0abc123def456]\n# Apply complete! Resources: 1 added, 0 changed, 0 destroyed.\n# Outputs:\n#   instance_ip = "54.23.12.45"' },
        { type: 'note', value: 'terraform plan — ОБЯЗАТЕЛЬНЫЙ шаг перед apply. Он показывает что будет создано (+), изменено (~) и удалено (-). Всегда проверяй план перед применением, особенно в продакшене.' }
      ]
    },
    {
      id: 3,
      title: 'Переменные и типы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменные делают конфигурацию переиспользуемой. Terraform поддерживает типы: string, number, bool, list, map, object. Значения задаются через файлы, CLI или переменные окружения.' },
        { type: 'heading', value: 'Определение переменных' },
        { type: 'code', language: 'hcl', value: '# variables.tf\nvariable "region" {\n  type        = string\n  default     = "us-east-1"\n  description = "AWS region"\n}\n\nvariable "instance_type" {\n  type    = string\n  default = "t3.micro"\n}\n\nvariable "environment" {\n  type = string\n  validation {\n    condition     = contains(["dev", "staging", "production"], var.environment)\n    error_message = "Environment must be dev, staging, or production."\n  }\n}\n\nvariable "allowed_ports" {\n  type    = list(number)\n  default = [80, 443, 22]\n}\n\nvariable "tags" {\n  type = map(string)\n  default = {\n    ManagedBy = "terraform"\n    Team      = "devops"\n  }\n}\n\nvariable "db_password" {\n  type      = string\n  sensitive = true  # Не показывать в логах\n}' },
        { type: 'heading', value: 'Использование переменных' },
        { type: 'code', language: 'hcl', value: '# main.tf\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = var.instance_type\n\n  tags = merge(var.tags, {\n    Name        = "web-${var.environment}"\n    Environment = var.environment\n  })\n}\n\n# terraform.tfvars — значения переменных\n# region        = "eu-west-1"\n# environment   = "production"\n# instance_type = "t3.small"\n# allowed_ports = [80, 443]\n\n# Способы задания переменных:\n# 1. terraform.tfvars (автоматически)\n# 2. terraform apply -var="environment=production"\n# 3. terraform apply -var-file="prod.tfvars"\n# 4. export TF_VAR_environment=production' },
        { type: 'warning', value: 'Никогда не коммитьте terraform.tfvars с секретами (db_password) в Git! Используйте sensitive = true для переменных с паролями. Для секретов лучше использовать AWS Secrets Manager или HashiCorp Vault.' }
      ]
    },
    {
      id: 4,
      title: 'State — состояние инфраструктуры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform State (terraform.tfstate) — файл, хранящий текущее состояние инфраструктуры. Terraform сравнивает state с конфигурацией для определения изменений. State — критически важный компонент.' },
        { type: 'heading', value: 'Как работает State' },
        { type: 'code', language: 'bash', value: '# terraform.tfstate — JSON файл:\n# {\n#   "resources": [\n#     {\n#       "type": "aws_instance",\n#       "name": "web",\n#       "instances": [{\n#         "attributes": {\n#           "id": "i-0abc123",\n#           "public_ip": "54.23.12.45",\n#           "instance_type": "t3.micro"\n#         }\n#       }]\n#     }\n#   ]\n# }\n\n# Команды работы с state:\nterraform state list                    # Список ресурсов\nterraform state show aws_instance.web   # Детали ресурса\nterraform state mv aws_instance.web aws_instance.app  # Переименовать\nterraform state rm aws_instance.web     # Удалить из state (не из облака!)\nterraform import aws_instance.web i-0abc123  # Импортировать существующий ресурс' },
        { type: 'heading', value: 'Remote State (для команды)' },
        { type: 'code', language: 'hcl', value: '# backend.tf — хранить state в S3\nterraform {\n  backend "s3" {\n    bucket         = "company-terraform-state"\n    key            = "production/terraform.tfstate"\n    region         = "us-east-1"\n    dynamodb_table = "terraform-locks"  # Блокировка от параллельных изменений\n    encrypt        = true\n  }\n}' },
        { type: 'code', language: 'bash', value: '# Создание S3 bucket и DynamoDB для state:\naws s3 mb s3://company-terraform-state\naws s3api put-bucket-versioning \\\n  --bucket company-terraform-state \\\n  --versioning-configuration Status=Enabled\n\naws dynamodb create-table \\\n  --table-name terraform-locks \\\n  --attribute-definitions AttributeName=LockID,AttributeType=S \\\n  --key-schema AttributeName=LockID,KeyType=HASH \\\n  --billing-mode PAY_PER_REQUEST' },
        { type: 'warning', value: 'НИКОГДА не храни terraform.tfstate в Git! Он содержит секреты (пароли БД, ключи). Всегда используй remote state (S3, GCS, Terraform Cloud) для командной работы. DynamoDB lock предотвращает одновременные изменения.' }
      ]
    },
    {
      id: 5,
      title: 'Data Sources и ресурсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Data Sources позволяют читать данные из облака (существующие ресурсы, AMI, VPC). Resources создают и управляют ресурсами. Зависимости между ресурсами Terraform определяет автоматически.' },
        { type: 'heading', value: 'Data Sources' },
        { type: 'code', language: 'hcl', value: '# Получить последний AMI Ubuntu\ndata "aws_ami" "ubuntu" {\n  most_recent = true\n  owners      = ["099720109477"]  # Canonical\n\n  filter {\n    name   = "name"\n    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]\n  }\n}\n\n# Получить существующий VPC\ndata "aws_vpc" "main" {\n  filter {\n    name   = "tag:Name"\n    values = ["main-vpc"]\n  }\n}\n\n# Использование\nresource "aws_instance" "web" {\n  ami           = data.aws_ami.ubuntu.id\n  instance_type = "t3.micro"\n  subnet_id     = data.aws_vpc.main.id\n}' },
        { type: 'heading', value: 'Полный пример: VPC + EC2 + Security Group' },
        { type: 'code', language: 'hcl', value: '# VPC\nresource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n  tags       = { Name = "main-vpc" }\n}\n\n# Подсеть\nresource "aws_subnet" "public" {\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = "10.0.1.0/24"\n  availability_zone = "us-east-1a"\n  tags              = { Name = "public-subnet" }\n}\n\n# Security Group\nresource "aws_security_group" "web" {\n  name   = "web-sg"\n  vpc_id = aws_vpc.main.id\n\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n\n  ingress {\n    from_port   = 22\n    to_port     = 22\n    protocol    = "tcp"\n    cidr_blocks = ["10.0.0.0/8"]  # Только из VPN\n  }\n\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = "-1"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\n\n# EC2\nresource "aws_instance" "web" {\n  ami                    = data.aws_ami.ubuntu.id\n  instance_type          = "t3.micro"\n  subnet_id              = aws_subnet.public.id\n  vpc_security_group_ids = [aws_security_group.web.id]\n  key_name               = "my-key"\n\n  tags = { Name = "web-server" }\n}' },
        { type: 'tip', value: 'Terraform автоматически определяет зависимости: EC2 ждёт создания VPC, подсети и Security Group. Явные зависимости можно добавить через depends_on = [resource].' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание инфраструктуры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите Terraform-конфигурацию для создания базовой инфраструктуры в AWS.',
      requirements: [
        'Создайте файлы: providers.tf, variables.tf, main.tf, outputs.tf',
        'Определите переменные для region, instance_type, environment',
        'Создайте VPC с публичной подсетью',
        'Создайте Security Group с правилами для SSH и HTTP',
        'Создайте EC2 инстанс в подсети с Security Group',
        'Добавьте outputs для IP-адреса инстанса'
      ],
      hint: 'resource "aws_vpc", "aws_subnet", "aws_security_group", "aws_instance". Используйте ссылки: aws_vpc.main.id, aws_subnet.public.id.',
      expectedOutput: 'terraform plan показывает 4 ресурса к созданию\nterraform apply создаёт VPC, подсеть, SG, EC2\nOutput: instance_ip = "X.X.X.X"\nterraform state list показывает все ресурсы',
      solution: '# providers.tf\n# terraform {\n#   required_providers {\n#     aws = {\n#       source  = "hashicorp/aws"\n#       version = "~> 5.0"\n#     }\n#   }\n# }\n# provider "aws" {\n#   region = var.region\n# }\n\n# variables.tf\n# variable "region" {\n#   default = "us-east-1"\n# }\n# variable "instance_type" {\n#   default = "t3.micro"\n# }\n# variable "environment" {\n#   default = "dev"\n# }\n\n# main.tf\n# resource "aws_vpc" "main" {\n#   cidr_block = "10.0.0.0/16"\n#   tags = { Name = "${var.environment}-vpc" }\n# }\n# resource "aws_subnet" "public" {\n#   vpc_id     = aws_vpc.main.id\n#   cidr_block = "10.0.1.0/24"\n#   tags = { Name = "${var.environment}-public" }\n# }\n# resource "aws_security_group" "web" {\n#   name   = "${var.environment}-web-sg"\n#   vpc_id = aws_vpc.main.id\n#   ingress { from_port=22; to_port=22; protocol="tcp"; cidr_blocks=["0.0.0.0/0"] }\n#   ingress { from_port=80; to_port=80; protocol="tcp"; cidr_blocks=["0.0.0.0/0"] }\n#   egress { from_port=0; to_port=0; protocol="-1"; cidr_blocks=["0.0.0.0/0"] }\n# }\n# resource "aws_instance" "web" {\n#   ami                    = "ami-0c55b159cbfafe1f0"\n#   instance_type          = var.instance_type\n#   subnet_id              = aws_subnet.public.id\n#   vpc_security_group_ids = [aws_security_group.web.id]\n#   tags = { Name = "${var.environment}-web" }\n# }\n\n# outputs.tf\n# output "instance_ip" { value = aws_instance.web.public_ip }\n# output "vpc_id" { value = aws_vpc.main.id }\n\n# Команды:\nterraform init\nterraform plan\nterraform apply -auto-approve\nterraform state list\nterraform output',
      explanation: 'Terraform создаёт ресурсы в правильном порядке: VPC -> Subnet -> Security Group -> EC2. Переменные позволяют менять параметры без изменения кода. Outputs выводят полезные значения. terraform plan показывает план ДО применения.'
    }
  ]
}
