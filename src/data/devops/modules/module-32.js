export default {
  id: 32,
  title: 'Pulumi: IaC на языках программирования',
  description: 'Pulumi — инструмент Infrastructure as Code, позволяющий описывать инфраструктуру на Python, TypeScript, Go и других языках вместо DSL.',
  lessons: [
    {
      id: 1,
      title: 'Pulumi vs Terraform',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем Pulumi?' },
        { type: 'text', value: 'Pulumi позволяет описывать инфраструктуру на настоящих языках программирования (Python, TypeScript, Go, C#, Java). В отличие от Terraform HCL, вы получаете циклы, условия, функции, классы, тесты и все возможности языка.' },
        { type: 'code', language: 'bash', value: '# Сравнение подходов:\n\n# Terraform (HCL — декларативный DSL):\n# + Простой синтаксис для простых задач\n# + Огромная экосистема провайдеров\n# - Ограниченная логика (count, for_each)\n# - Сложно тестировать\n# - Нет переиспользования через классы/модули\n\n# Pulumi (Python/TypeScript/Go):\n# + Полноценный язык программирования\n# + Циклы, условия, классы, наследование\n# + Unit-тесты для инфраструктуры\n# + Привычные инструменты (IDE, linters, debugger)\n# - Требует знания языка программирования\n# - Меньшая экосистема (но совместим с Terraform providers)' },
        { type: 'heading', value: 'Установка Pulumi' },
        { type: 'code', language: 'bash', value: '# Установка Pulumi CLI\ncurl -fsSL https://get.pulumi.com | sh\n\n# Или через Homebrew\nbrew install pulumi\n\n# Проверка версии\npulumi version\n\n# Логин (бесплатный Pulumi Cloud или local backend)\npulumi login\n# Или локальное хранение state:\npulumi login --local\n\n# Создание нового проекта\nmkdir my-infra && cd my-infra\npulumi new aws-python    # Python + AWS\npulumi new aws-typescript # TypeScript + AWS\npulumi new kubernetes-python # Python + Kubernetes' },
        { type: 'list', items: [
          'Stack — экземпляр инфраструктуры (dev, staging, prod)',
          'Project — набор Pulumi-файлов с описанием ресурсов',
          'Resource — облачный ресурс (VM, bucket, cluster)',
          'Output — выходные значения (IP адрес, URL, ARN)',
          'Provider — плагин для облачного провайдера (AWS, GCP, Azure, K8s)'
        ] },
        { type: 'tip', value: 'Pulumi может импортировать существующий Terraform state и конвертировать HCL в Python/TypeScript. Команда pulumi convert --from terraform упрощает миграцию.' }
      ]
    },
    {
      id: 2,
      title: 'Основы Pulumi (Python)',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Создание инфраструктуры на Python' },
        { type: 'text', value: 'В Pulumi вы описываете инфраструктуру как обычный код. Каждый облачный ресурс — это объект класса. Параметры ресурса — аргументы конструктора. Зависимости определяются автоматически.' },
        { type: 'code', language: 'bash', value: '# __main__.py — AWS инфраструктура на Python\n# import pulumi\n# import pulumi_aws as aws\n#\n# # VPC\n# vpc = aws.ec2.Vpc("main-vpc",\n#     cidr_block="10.0.0.0/16",\n#     enable_dns_hostnames=True,\n#     tags={"Name": "main-vpc", "Environment": "production"}\n# )\n#\n# # Subnet\n# subnet = aws.ec2.Subnet("main-subnet",\n#     vpc_id=vpc.id,\n#     cidr_block="10.0.1.0/24",\n#     availability_zone="us-east-1a",\n#     map_public_ip_on_launch=True,\n# )\n#\n# # Security Group\n# sg = aws.ec2.SecurityGroup("web-sg",\n#     vpc_id=vpc.id,\n#     ingress=[{\n#         "protocol": "tcp",\n#         "from_port": 80,\n#         "to_port": 80,\n#         "cidr_blocks": ["0.0.0.0/0"],\n#     }],\n#     egress=[{\n#         "protocol": "-1",\n#         "from_port": 0,\n#         "to_port": 0,\n#         "cidr_blocks": ["0.0.0.0/0"],\n#     }],\n# )\n#\n# # EC2 Instance\n# server = aws.ec2.Instance("web-server",\n#     instance_type="t3.micro",\n#     ami="ami-0c55b159cbfafe1f0",\n#     subnet_id=subnet.id,\n#     vpc_security_group_ids=[sg.id],\n#     tags={"Name": "web-server"},\n# )\n#\n# # Outputs\n# pulumi.export("vpc_id", vpc.id)\n# pulumi.export("server_ip", server.public_ip)\n# pulumi.export("server_url", server.public_ip.apply(lambda ip: f"http://{ip}"))' },
        { type: 'heading', value: 'Циклы и условия' },
        { type: 'code', language: 'bash', value: '# Преимущество Python — полноценные циклы\n# import pulumi\n# import pulumi_aws as aws\n#\n# config = pulumi.Config()\n# env = pulumi.get_stack()  # dev, staging, prod\n#\n# # Разные настройки для разных окружений\n# settings = {\n#     "dev": {"count": 1, "size": "t3.micro"},\n#     "staging": {"count": 2, "size": "t3.small"},\n#     "prod": {"count": 3, "size": "t3.medium"},\n# }\n#\n# cfg = settings[env]\n#\n# # Создание нескольких серверов в цикле\n# servers = []\n# for i in range(cfg["count"]):\n#     server = aws.ec2.Instance(f"web-{i}",\n#         instance_type=cfg["size"],\n#         ami="ami-0c55b159cbfafe1f0",\n#         tags={"Name": f"web-{env}-{i}"},\n#     )\n#     servers.append(server)\n#\n# # Список IP адресов\n# pulumi.export("server_ips", [s.public_ip for s in servers])' },
        { type: 'code', language: 'bash', value: '# Основные команды Pulumi\npulumi up        # Применить изменения (аналог terraform apply)\npulumi preview   # Показать план (аналог terraform plan)\npulumi destroy   # Удалить все ресурсы\npulumi stack ls  # Список стеков\npulumi stack output  # Просмотр outputs\npulumi refresh   # Синхронизация с реальным состоянием' },
        { type: 'note', value: 'Pulumi автоматически определяет зависимости между ресурсами. Если subnet использует vpc.id, Pulumi создаст VPC перед subnet. Явные зависимости добавляются через opts=pulumi.ResourceOptions(depends_on=[...]).' }
      ]
    },
    {
      id: 3,
      title: 'Stacks и конфигурация',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Stacks — окружения' },
        { type: 'text', value: 'Stack в Pulumi — это изолированный экземпляр инфраструктуры. Каждый stack имеет свой state и конфигурацию. Это аналог Terraform workspaces, но более мощный.' },
        { type: 'code', language: 'bash', value: '# Создание стеков\npulumi stack init dev\npulumi stack init staging\npulumi stack init prod\n\n# Переключение между стеками\npulumi stack select dev\npulumi stack select prod\n\n# Список стеков\npulumi stack ls\n\n# Конфигурация стека\npulumi config set aws:region us-east-1\npulumi config set instanceCount 3\npulumi config set dbPassword my-secret --secret  # шифрованное значение\n\n# Просмотр конфигурации\npulumi config\npulumi config get instanceCount' },
        { type: 'heading', value: 'Использование конфигурации в коде' },
        { type: 'code', language: 'bash', value: '# __main__.py — использование config\n# import pulumi\n#\n# config = pulumi.Config()\n# stack = pulumi.get_stack()\n#\n# # Обязательные параметры\n# instance_count = config.require_int("instanceCount")\n# db_password = config.require_secret("dbPassword")\n#\n# # Необязательные с дефолтами\n# instance_type = config.get("instanceType") or "t3.micro"\n# enable_monitoring = config.get_bool("enableMonitoring") or False\n#\n# # Конфигурация провайдера\n# aws_config = pulumi.Config("aws")\n# region = aws_config.require("region")' },
        { type: 'heading', value: 'Pulumi.yaml и Pulumi.dev.yaml' },
        { type: 'code', language: 'yaml', value: '# Pulumi.yaml — описание проекта\nname: my-infrastructure\nruntime:\n  name: python\n  options:\n    virtualenv: venv\ndescription: Production infrastructure\n\n---\n# Pulumi.dev.yaml — конфигурация для dev стека\nconfig:\n  aws:region: us-east-1\n  my-infrastructure:instanceCount: "1"\n  my-infrastructure:instanceType: t3.micro\n  my-infrastructure:enableMonitoring: "false"\n\n---\n# Pulumi.prod.yaml — конфигурация для prod стека\nconfig:\n  aws:region: us-east-1\n  my-infrastructure:instanceCount: "3"\n  my-infrastructure:instanceType: t3.large\n  my-infrastructure:enableMonitoring: "true"\n  my-infrastructure:dbPassword:\n    secure: AAABADxxxxxxx  # зашифрованное значение' },
        { type: 'tip', value: 'Секреты в Pulumi шифруются автоматически при использовании --secret. По умолчанию используется Pulumi Cloud для шифрования, но можно настроить AWS KMS, Azure Key Vault или passphrase.' }
      ]
    },
    {
      id: 4,
      title: 'State Management',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Управление State' },
        { type: 'text', value: 'State в Pulumi хранит текущее состояние инфраструктуры. По умолчанию state хранится в Pulumi Cloud (бесплатно для 1 пользователя). Альтернативы: S3, Azure Blob, GCS или локальный файл.' },
        { type: 'code', language: 'bash', value: '# Бэкенды для хранения state:\n\n# 1. Pulumi Cloud (по умолчанию)\npulumi login\n\n# 2. AWS S3\npulumi login s3://my-pulumi-state-bucket\n\n# 3. Azure Blob Storage\npulumi login azblob://my-pulumi-container\n\n# 4. Google Cloud Storage\npulumi login gs://my-pulumi-state-bucket\n\n# 5. Локальный файл\npulumi login --local\n# State хранится в ~/.pulumi/' },
        { type: 'heading', value: 'Импорт существующих ресурсов' },
        { type: 'code', language: 'bash', value: '# Импорт существующего ресурса в Pulumi state\npulumi import aws:ec2/instance:Instance my-server i-0123456789abcdef0\n\n# Pulumi сгенерирует код для импортированного ресурса\n# Или в коде:\n# server = aws.ec2.Instance("my-server",\n#     instance_type="t3.micro",\n#     ami="ami-xxx",\n#     opts=pulumi.ResourceOptions(\n#         import_="i-0123456789abcdef0"\n#     )\n# )\n\n# Конвертация из Terraform\npulumi convert --from terraform --language python\n# Генерирует Python код из .tf файлов' },
        { type: 'heading', value: 'Component Resources — переиспользование' },
        { type: 'code', language: 'bash', value: '# Создание переиспользуемого компонента (класс Python)\n# class WebService(pulumi.ComponentResource):\n#     def __init__(self, name, args, opts=None):\n#         super().__init__("custom:WebService", name, {}, opts)\n#\n#         self.instance = aws.ec2.Instance(f"{name}-server",\n#             instance_type=args["instance_type"],\n#             ami=args["ami"],\n#             tags={"Name": name},\n#             opts=pulumi.ResourceOptions(parent=self)\n#         )\n#\n#         self.sg = aws.ec2.SecurityGroup(f"{name}-sg",\n#             ingress=[{"protocol": "tcp", "from_port": 80,\n#                       "to_port": 80, "cidr_blocks": ["0.0.0.0/0"]}],\n#             opts=pulumi.ResourceOptions(parent=self)\n#         )\n#\n#         self.register_outputs({\n#             "ip": self.instance.public_ip,\n#             "sg_id": self.sg.id,\n#         })\n#\n# # Использование компонента\n# api = WebService("api", {"instance_type": "t3.small", "ami": "ami-xxx"})\n# web = WebService("web", {"instance_type": "t3.micro", "ami": "ami-xxx"})\n# pulumi.export("api_ip", api.instance.public_ip)' },
        { type: 'note', value: 'ComponentResource — аналог Terraform модулей, но с полной силой ООП: наследование, композиция, полиморфизм. Это делает код DRY и поддерживаемым.' }
      ]
    },
    {
      id: 5,
      title: 'CI/CD интеграция',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Тестирование инфраструктуры' },
        { type: 'text', value: 'Одно из главных преимуществ Pulumi — возможность писать unit-тесты для инфраструктуры на стандартных фреймворках (pytest, Jest). Тесты проверяют конфигурацию ресурсов без реального создания.' },
        { type: 'code', language: 'bash', value: '# test_infra.py — unit-тесты с pytest\n# import pulumi\n# import pytest\n#\n# class MockMixin:\n#     resources = {}\n#     def __init__(self):\n#         pulumi.runtime.set_mocks(self)\n#     def new_resource(self, args):\n#         self.resources[args.name] = args.inputs\n#         return [args.name + "_id", args.inputs]\n#     def call(self, args):\n#         return {}\n#\n# @pytest.fixture\n# def infra():\n#     mock = MockMixin()\n#     import __main__  # импорт Pulumi кода\n#     return mock\n#\n# @pulumi.runtime.test\n# def test_server_has_tags(infra):\n#     def check_tags(args):\n#         tags = args.get("tags", {})\n#         assert "Name" in tags, "Server must have Name tag"\n#         assert "Environment" in tags, "Server must have Environment tag"\n#     return server.tags.apply(check_tags)\n#\n# @pulumi.runtime.test\n# def test_sg_no_open_ssh(infra):\n#     def check_ingress(args):\n#         for rule in args:\n#             assert not (rule["from_port"] == 22 and\n#                        "0.0.0.0/0" in rule.get("cidr_blocks", [])),\\\n#                 "SSH must not be open to the world"\n#     return sg.ingress.apply(check_ingress)' },
        { type: 'heading', value: 'GitHub Actions интеграция' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/infra.yml\nname: Infrastructure\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  preview:\n    runs-on: ubuntu-latest\n    if: github.event_name == \'pull_request\'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n      - run: pip install -r requirements.txt\n      - uses: pulumi/actions@v5\n        with:\n          command: preview\n          stack-name: dev\n        env:\n          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n\n  deploy:\n    runs-on: ubuntu-latest\n    if: github.ref == \'refs/heads/main\' && github.event_name == \'push\'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n      - run: pip install -r requirements.txt\n      - uses: pulumi/actions@v5\n        with:\n          command: up\n          stack-name: prod\n        env:\n          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}\n          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}' },
        { type: 'heading', value: 'Policy as Code' },
        { type: 'code', language: 'bash', value: '# Pulumi CrossGuard — политики безопасности\n# policy/__main__.py\n# from pulumi_policy import (\n#     EnforcementLevel, PolicyPack, ResourceValidationPolicy\n# )\n#\n# def no_public_s3(args, report_violation):\n#     if args.resource_type == "aws:s3/bucket:Bucket":\n#         acl = args.props.get("acl")\n#         if acl == "public-read" or acl == "public-read-write":\n#             report_violation("S3 buckets must not be public")\n#\n# PolicyPack("security-policies", [\n#     ResourceValidationPolicy(\n#         name="no-public-s3",\n#         description="S3 buckets cannot be public",\n#         validate=no_public_s3,\n#         enforcement_level=EnforcementLevel.MANDATORY,\n#     ),\n# ])\n\n# Применение политик\npulumi up --policy-pack ./policy' },
        { type: 'tip', value: 'Pulumi Deployments позволяет запускать pulumi up из Pulumi Cloud при push в Git, по расписанию или через API. Это GitOps для инфраструктуры без настройки CI/CD.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: IaC с Pulumi',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте инфраструктуру AWS с помощью Pulumi на Python: VPC, EC2 instance, S3 bucket с разными стеками для dev и prod.',
      requirements: [
        'Инициализируйте Pulumi проект с Python runtime',
        'Создайте VPC с subnet и security group',
        'Создайте EC2 instance с тегами Name и Environment',
        'Создайте S3 bucket с lifecycle policy',
        'Настройте разные конфигурации для dev и prod стеков',
        'Напишите unit-тест, проверяющий наличие тегов на EC2'
      ],
      hint: 'Начните с pulumi new aws-python. Используйте pulumi.Config() для чтения конфигурации стека. ComponentResource для переиспользования кода.',
      expectedOutput: 'pulumi preview => 5 resources to create\npulumi up => VPC, Subnet, SG, EC2, S3 created\npulumi stack output server_ip => 54.xx.xx.xx\npytest test_infra.py => all tests passed',
      solution: '# 1. Инициализация\npulumi new aws-python --name my-infra\npulumi stack init dev\npulumi config set aws:region us-east-1\npulumi config set instanceCount 1\npulumi config set instanceType t3.micro\n\n# 2. __main__.py\n# import pulumi\n# import pulumi_aws as aws\n#\n# config = pulumi.Config()\n# stack = pulumi.get_stack()\n# count = config.require_int("instanceCount")\n# inst_type = config.get("instanceType") or "t3.micro"\n#\n# vpc = aws.ec2.Vpc("vpc", cidr_block="10.0.0.0/16",\n#     tags={"Name": f"vpc-{stack}"})\n# subnet = aws.ec2.Subnet("subnet", vpc_id=vpc.id,\n#     cidr_block="10.0.1.0/24")\n# sg = aws.ec2.SecurityGroup("sg", vpc_id=vpc.id,\n#     ingress=[{"protocol":"tcp","from_port":80,\n#              "to_port":80,"cidr_blocks":["0.0.0.0/0"]}])\n# for i in range(count):\n#     aws.ec2.Instance(f"server-{i}",\n#         instance_type=inst_type, ami="ami-xxx",\n#         subnet_id=subnet.id,\n#         vpc_security_group_ids=[sg.id],\n#         tags={"Name":f"web-{stack}-{i}","Environment":stack})\n# bucket = aws.s3.Bucket("data", tags={"Environment":stack})\n\npulumi up --yes',
      explanation: 'Pulumi позволяет использовать Python для описания инфраструктуры. Стеки (dev/prod) с разной конфигурацией создают разные окружения из одного кода. Unit-тесты проверяют корректность конфигурации до деплоя. ComponentResource позволяет создавать переиспользуемые модули.'
    }
  ]
}
