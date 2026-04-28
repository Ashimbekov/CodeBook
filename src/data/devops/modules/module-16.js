export default {
  id: 16,
  title: 'Terraform: продвинутый',
  description: 'Модули Terraform, workspaces, remote state, provisioners, циклы и условия.',
  lessons: [
    {
      id: 1,
      title: 'Модули Terraform',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модули — переиспользуемые компоненты Terraform. Модуль — это каталог с .tf файлами. Модули позволяют DRY: описать VPC один раз и использовать для dev, staging, production.' },
        { type: 'heading', value: 'Структура модулей' },
        { type: 'code', language: 'bash', value: '# Структура проекта с модулями:\ninfra/\n├── main.tf\n├── variables.tf\n├── outputs.tf\n└── modules/\n    ├── vpc/\n    │   ├── main.tf\n    │   ├── variables.tf\n    │   └── outputs.tf\n    ├── ec2/\n    │   ├── main.tf\n    │   ├── variables.tf\n    │   └── outputs.tf\n    └── rds/\n        ├── main.tf\n        ├── variables.tf\n        └── outputs.tf' },
        { type: 'heading', value: 'Создание и использование модуля' },
        { type: 'code', language: 'hcl', value: '# modules/vpc/variables.tf\nvariable "vpc_cidr" {\n  type    = string\n  default = "10.0.0.0/16"\n}\nvariable "environment" {\n  type = string\n}\n\n# modules/vpc/main.tf\nresource "aws_vpc" "this" {\n  cidr_block = var.vpc_cidr\n  tags       = { Name = "${var.environment}-vpc" }\n}\nresource "aws_subnet" "public" {\n  vpc_id     = aws_vpc.this.id\n  cidr_block = cidrsubnet(var.vpc_cidr, 8, 1)\n  tags       = { Name = "${var.environment}-public" }\n}\n\n# modules/vpc/outputs.tf\noutput "vpc_id" {\n  value = aws_vpc.this.id\n}\noutput "public_subnet_id" {\n  value = aws_subnet.public.id\n}' },
        { type: 'code', language: 'hcl', value: '# main.tf — использование модуля\nmodule "vpc_prod" {\n  source      = "./modules/vpc"\n  vpc_cidr    = "10.0.0.0/16"\n  environment = "production"\n}\n\nmodule "vpc_staging" {\n  source      = "./modules/vpc"\n  vpc_cidr    = "10.1.0.0/16"\n  environment = "staging"\n}\n\n# Ссылка на output модуля\nresource "aws_instance" "web" {\n  subnet_id = module.vpc_prod.public_subnet_id\n}' },
        { type: 'tip', value: 'Terraform Registry (registry.terraform.io) содержит тысячи готовых модулей: VPC, EKS, RDS. Используй проверенные модули вместо написания с нуля: module "vpc" { source = "terraform-aws-modules/vpc/aws" }.' }
      ]
    },
    {
      id: 2,
      title: 'Workspaces',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform Workspaces позволяют использовать одну конфигурацию для разных окружений. Каждый workspace имеет отдельный state. Это проще чем дублировать конфигурацию для dev/staging/prod.' },
        { type: 'heading', value: 'Управление Workspaces' },
        { type: 'code', language: 'bash', value: '# Создание и переключение\nterraform workspace new staging\nterraform workspace new production\nterraform workspace list\n# * default\n#   staging\n#   production\n\nterraform workspace select staging\nterraform workspace show\n# staging' },
        { type: 'heading', value: 'Использование workspace в конфигурации' },
        { type: 'code', language: 'hcl', value: '# Разные параметры для разных окружений\nlocals {\n  env_config = {\n    staging = {\n      instance_type = "t3.micro"\n      min_size      = 1\n      max_size      = 2\n    }\n    production = {\n      instance_type = "t3.medium"\n      min_size      = 2\n      max_size      = 10\n    }\n  }\n  config = local.env_config[terraform.workspace]\n}\n\nresource "aws_instance" "web" {\n  instance_type = local.config.instance_type\n  tags = {\n    Environment = terraform.workspace\n  }\n}\n\n# Remote state с workspaces\nterraform {\n  backend "s3" {\n    bucket = "terraform-state"\n    key    = "infra/terraform.tfstate"\n    region = "us-east-1"\n    # State для каждого workspace хранится отдельно:\n    # env:/staging/infra/terraform.tfstate\n    # env:/production/infra/terraform.tfstate\n  }\n}' },
        { type: 'note', value: 'Для простых случаев workspaces удобны. Для сложных различий между окружениями лучше использовать отдельные каталоги (environments/staging/, environments/production/) с отдельными tfvars файлами.' }
      ]
    },
    {
      id: 3,
      title: 'Циклы и условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform поддерживает циклы (count, for_each) и условия (conditional expressions). Это позволяет создавать динамические конфигурации без дублирования кода.' },
        { type: 'heading', value: 'count и for_each' },
        { type: 'code', language: 'hcl', value: '# count — создать N одинаковых ресурсов\nresource "aws_instance" "web" {\n  count         = 3\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n  tags = {\n    Name = "web-${count.index + 1}"\n  }\n}\n# Создаст: web-1, web-2, web-3\n\n# for_each — создать ресурсы из map/set\nresource "aws_iam_user" "devops" {\n  for_each = toset(["alice", "bob", "charlie"])\n  name     = each.key\n}\n\n# for_each с map\nvariable "instances" {\n  default = {\n    web    = { type = "t3.micro", az = "us-east-1a" }\n    api    = { type = "t3.small", az = "us-east-1b" }\n    worker = { type = "t3.medium", az = "us-east-1c" }\n  }\n}\n\nresource "aws_instance" "app" {\n  for_each      = var.instances\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = each.value.type\n  availability_zone = each.value.az\n  tags = {\n    Name = each.key\n  }\n}' },
        { type: 'heading', value: 'Условия и dynamic blocks' },
        { type: 'code', language: 'hcl', value: '# Условное создание ресурса\nresource "aws_instance" "bastion" {\n  count = var.enable_bastion ? 1 : 0\n  ami   = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n}\n\n# Условные значения\nlocals {\n  instance_type = var.environment == "production" ? "t3.large" : "t3.micro"\n}\n\n# Dynamic blocks — динамические вложенные блоки\nresource "aws_security_group" "web" {\n  name   = "web-sg"\n  vpc_id = aws_vpc.main.id\n\n  dynamic "ingress" {\n    for_each = var.allowed_ports\n    content {\n      from_port   = ingress.value\n      to_port     = ingress.value\n      protocol    = "tcp"\n      cidr_blocks = ["0.0.0.0/0"]\n    }\n  }\n}\n# var.allowed_ports = [80, 443, 8080]\n# Создаст 3 правила ingress автоматически' },
        { type: 'tip', value: 'Используй for_each вместо count когда возможно. При удалении элемента из середины списка count пересоздаёт все последующие ресурсы. for_each привязан к ключу и не имеет этой проблемы.' }
      ]
    },
    {
      id: 4,
      title: 'Terraform в CI/CD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Terraform в CI/CD автоматизирует управление инфраструктурой: plan при PR, apply при merge. Это обеспечивает код-ревью инфраструктурных изменений и автоматический деплой.' },
        { type: 'heading', value: 'GitHub Actions для Terraform' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/terraform.yml\nname: Terraform\non:\n  pull_request:\n    paths: ["infra/**"]\n  push:\n    branches: [main]\n    paths: ["infra/**"]\n\njobs:\n  plan:\n    runs-on: ubuntu-latest\n    if: github.event_name == \'pull_request\'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: hashicorp/setup-terraform@v3\n\n      - name: Terraform Init\n        working-directory: infra\n        run: terraform init\n\n      - name: Terraform Plan\n        working-directory: infra\n        run: terraform plan -no-color -out=tfplan\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n\n      - name: Comment PR with Plan\n        uses: actions/github-script@v7\n        with:\n          script: |\n            const plan = `terraform plan output here`;\n            github.rest.issues.createComment({\n              issue_number: context.issue.number,\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              body: `## Terraform Plan\\n\\`\\`\\`\\n${plan}\\n\\`\\`\\``\n            });\n\n  apply:\n    runs-on: ubuntu-latest\n    if: github.ref == \'refs/heads/main\' && github.event_name == \'push\'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: hashicorp/setup-terraform@v3\n      - run: terraform init\n        working-directory: infra\n      - run: terraform apply -auto-approve\n        working-directory: infra\n        env:\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}' },
        { type: 'warning', value: 'terraform apply -auto-approve в CI должен запускаться ТОЛЬКО для main ветки после code review. Для PR — только terraform plan. Неосторожный apply может удалить production ресурсы.' }
      ]
    },
    {
      id: 5,
      title: 'Best Practices Terraform',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная организация Terraform-проекта критична для масштабирования. Рассмотрим best practices для структуры, безопасности и командной работы.' },
        { type: 'heading', value: 'Структура для больших проектов' },
        { type: 'code', language: 'bash', value: '# Структура по окружениям:\ninfra/\n├── modules/                  # Переиспользуемые модули\n│   ├── vpc/\n│   ├── ecs/\n│   └── rds/\n├── environments/\n│   ├── dev/\n│   │   ├── main.tf\n│   │   ├── backend.tf\n│   │   └── terraform.tfvars\n│   ├── staging/\n│   │   ├── main.tf\n│   │   ├── backend.tf\n│   │   └── terraform.tfvars\n│   └── production/\n│       ├── main.tf\n│       ├── backend.tf\n│       └── terraform.tfvars\n└── global/                   # Общие ресурсы (IAM, Route53)\n    ├── iam/\n    └── dns/' },
        { type: 'heading', value: 'Правила и рекомендации' },
        { type: 'list', value: [
          'Remote state обязателен для командной работы (S3 + DynamoDB)',
          'Всегда запускай terraform plan перед apply',
          'Используй -target только для отладки, не в продакшене',
          'Версионируй провайдеры: version = "~> 5.0"',
          'Используй terraform fmt и terraform validate в CI',
          'Помечай ресурсы тегами: ManagedBy=terraform, Environment, Team',
          'Не редактируй state вручную — используй terraform state команды',
          'Используй модули из Terraform Registry для стандартных компонентов'
        ] },
        { type: 'code', language: 'hcl', value: '# Обязательный .gitignore для Terraform\n# .terraform/\n# *.tfstate\n# *.tfstate.*\n# *.tfvars (если содержит секреты)\n# .terraform.lock.hcl (спорно — некоторые коммитят)\n# crash.log' },
        { type: 'tip', value: 'Используй terraform plan -out=plan.tfplan для сохранения плана и terraform apply plan.tfplan для его применения. Это гарантирует что apply применит ИМЕННО тот план, который вы проверили.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модульная инфраструктура',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте модульную Terraform-конфигурацию с переиспользуемыми модулями для разных окружений.',
      requirements: [
        'Создайте модуль VPC с переменными для CIDR и environment',
        'Создайте модуль EC2 с переменными для instance_type и subnet_id',
        'Используйте for_each для создания нескольких Security Group правил',
        'Создайте конфигурации для staging и production через модули',
        'Добавьте outputs для всех критичных значений',
        'Настройте remote state backend (S3)'
      ],
      hint: 'module "vpc" { source = "./modules/vpc" }. for_each = toset(var.ports). terraform.workspace для условий. backend "s3" для remote state.',
      expectedOutput: 'Модули vpc/ и ec2/ созданы\nStaging: VPC 10.0.0.0/16, t3.micro\nProduction: VPC 10.1.0.0/16, t3.medium\nSecurity Group с динамическими правилами\nOutputs: vpc_id, instance_ip, sg_id\nRemote state в S3',
      solution: '# modules/vpc/main.tf\n# resource "aws_vpc" "this" {\n#   cidr_block = var.vpc_cidr\n#   tags = { Name = "${var.environment}-vpc", Environment = var.environment }\n# }\n# resource "aws_subnet" "public" {\n#   vpc_id     = aws_vpc.this.id\n#   cidr_block = cidrsubnet(var.vpc_cidr, 8, 1)\n# }\n# output "vpc_id" { value = aws_vpc.this.id }\n# output "subnet_id" { value = aws_subnet.public.id }\n\n# modules/ec2/main.tf\n# resource "aws_security_group" "this" {\n#   vpc_id = var.vpc_id\n#   dynamic "ingress" {\n#     for_each = var.allowed_ports\n#     content {\n#       from_port   = ingress.value\n#       to_port     = ingress.value\n#       protocol    = "tcp"\n#       cidr_blocks = ["0.0.0.0/0"]\n#     }\n#   }\n# }\n# resource "aws_instance" "this" {\n#   ami                    = var.ami_id\n#   instance_type          = var.instance_type\n#   subnet_id              = var.subnet_id\n#   vpc_security_group_ids = [aws_security_group.this.id]\n# }\n\n# environments/staging/main.tf\n# module "vpc" {\n#   source      = "../../modules/vpc"\n#   vpc_cidr    = "10.0.0.0/16"\n#   environment = "staging"\n# }\n# module "app" {\n#   source        = "../../modules/ec2"\n#   instance_type = "t3.micro"\n#   vpc_id        = module.vpc.vpc_id\n#   subnet_id     = module.vpc.subnet_id\n#   allowed_ports = [80, 443, 22]\n# }',
      explanation: 'Модули инкапсулируют группы связанных ресурсов. Один модуль VPC создаёт VPC + подсети. Модуль EC2 создаёт инстанс + SG. Разные окружения вызывают одни модули с разными параметрами. for_each в dynamic block создаёт правила SG без дублирования.'
    }
  ]
}
