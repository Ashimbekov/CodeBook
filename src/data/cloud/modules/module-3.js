export default {
  id: 3,
  title: 'AWS EC2',
  description: 'Amazon EC2: типы инстансов, AMI, security groups, key pairs, Elastic IP, Auto Scaling Group, Launch Templates.',
  lessons: [
    {
      id: 1,
      title: 'Основы EC2 и типы инстансов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Amazon EC2 (Elastic Compute Cloud) — сервис виртуальных машин в AWS. Позволяет запускать серверы любого размера за секунды с оплатой по часам или секундам.' },
        { type: 'heading', value: 'Типы инстансов (Instance Types)' },
        { type: 'list', value: [
          't3/t3a — General Purpose с burstable CPU. Дешёвые для лёгких нагрузок (веб, dev)',
          'm5/m6i — General Purpose сбалансированные. Универсальные для production',
          'c5/c6i — Compute Optimized. Для вычислительных задач (обработка данных, ML inference)',
          'r5/r6i — Memory Optimized. Для баз данных, кэшей, in-memory обработки',
          'i3/d2 — Storage Optimized. Для локального высокоскоростного хранилища',
          'p4/g5 — Accelerated Computing (GPU). Для ML training, видеообработки'
        ] },
        { type: 'code', language: 'bash', value: '# Формат именования: t3.medium\n# t  = семейство (тип нагрузки)\n# 3  = поколение (чем больше, тем новее и эффективнее)\n# medium = размер (nano < micro < small < medium < large < xlarge < 2xlarge ...)\n\n# Примеры:\n# t3.micro:   2 vCPU,  1 GB RAM  — $0.0104/час (Free Tier)\n# t3.medium:  2 vCPU,  4 GB RAM  — $0.0416/час\n# m5.large:   2 vCPU,  8 GB RAM  — $0.096/час\n# c5.2xlarge: 8 vCPU, 16 GB RAM  — $0.34/час\n# r5.xlarge:  4 vCPU, 32 GB RAM  — $0.252/час\n\n# Посмотреть доступные типы:\naws ec2 describe-instance-types \\\n  --filters "Name=instance-type,Values=t3.*" \\\n  --query "InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" \\\n  --output table' },
        { type: 'tip', value: 't3.micro входит в Free Tier (750 часов/месяц первые 12 месяцев). Для production используйте m-серию. Для экономии используйте Graviton инстансы (t4g, m6g) — ARM процессоры AWS на 20% дешевле при аналогичной производительности.' }
      ]
    },
    {
      id: 2,
      title: 'AMI и запуск инстансов',
      type: 'theory',
      content: [
        { type: 'text', value: 'AMI (Amazon Machine Image) — шаблон для создания инстанса, содержащий ОС, предустановленное ПО и конфигурацию. AMI можно создавать свои и делиться между аккаунтами.' },
        { type: 'heading', value: 'Типы AMI' },
        { type: 'list', value: [
          'AWS Marketplace AMI — готовые образы с ПО (WordPress, Jenkins, GPU драйверы)',
          'Community AMI — образы от сообщества',
          'Custom AMI — ваши образы с настроенным окружением',
          'Quick Start AMI — Amazon Linux, Ubuntu, Windows Server, Red Hat'
        ] },
        { type: 'code', language: 'bash', value: '# Найти AMI Ubuntu 22.04:\naws ec2 describe-images \\\n  --owners 099720109477 \\\n  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \\\n  --query "sort_by(Images, &CreationDate)[-1].[ImageId,Name]" \\\n  --output text\n# ami-0abcdef1234567890  ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-...\n\n# Запуск EC2 инстанса:\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.micro \\\n  --key-name my-key-pair \\\n  --security-group-ids sg-0123456789abcdef0 \\\n  --subnet-id subnet-0123456789abcdef0 \\\n  --tag-specifications \'ResourceType=instance,Tags=[{Key=Name,Value=my-server}]\' \\\n  --count 1\n\n# Создание собственного AMI из запущенного инстанса:\naws ec2 create-image \\\n  --instance-id i-1234567890abcdef0 \\\n  --name "my-app-v1.0" \\\n  --description "App server with Node.js and Nginx"\n# Используйте для Golden Image: настроили один раз — штампуете копии' },
        { type: 'note', value: 'AMI привязаны к региону. Для использования в другом регионе нужно скопировать AMI: aws ec2 copy-image. AMI хранятся в S3 — за хранение взимается плата.' }
      ]
    },
    {
      id: 3,
      title: 'Security Groups и Key Pairs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Security Group — виртуальный файрвол для EC2 инстансов. Контролирует входящий (inbound) и исходящий (outbound) трафик. Key Pair — SSH-ключ для безопасного подключения к инстансу.' },
        { type: 'code', language: 'bash', value: '# Создание Security Group:\naws ec2 create-security-group \\\n  --group-name web-server-sg \\\n  --description "Security group for web servers" \\\n  --vpc-id vpc-0123456789abcdef0\n\n# Открыть порт 22 (SSH) только с вашего IP:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-0123456789abcdef0 \\\n  --protocol tcp \\\n  --port 22 \\\n  --cidr 203.0.113.0/32\n\n# Открыть порт 80 (HTTP) для всех:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-0123456789abcdef0 \\\n  --protocol tcp \\\n  --port 80 \\\n  --cidr 0.0.0.0/0\n\n# Открыть порт 443 (HTTPS) для всех:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-0123456789abcdef0 \\\n  --protocol tcp \\\n  --port 443 \\\n  --cidr 0.0.0.0/0' },
        { type: 'code', language: 'bash', value: '# Создание Key Pair:\naws ec2 create-key-pair \\\n  --key-name my-key-pair \\\n  --query "KeyMaterial" \\\n  --output text > my-key-pair.pem\n\nchmod 400 my-key-pair.pem\n\n# Подключение к инстансу:\nssh -i my-key-pair.pem ubuntu@ec2-52-90-1-2.compute-1.amazonaws.com\n\n# Или через EC2 Instance Connect (без SSH ключа):\naws ec2-instance-connect send-ssh-public-key \\\n  --instance-id i-1234567890abcdef0 \\\n  --instance-os-user ubuntu \\\n  --ssh-public-key file://~/.ssh/id_rsa.pub' },
        { type: 'list', value: [
          'Security Group: stateful (ответный трафик разрешён автоматически)',
          'По умолчанию: весь входящий заблокирован, весь исходящий разрешён',
          'Можно ссылаться на другие SG как источник (для микросервисов)',
          'Key Pair: ED25519 или RSA. Приватный ключ скачивается только при создании!'
        ] },
        { type: 'tip', value: 'Никогда не открывайте SSH (порт 22) для 0.0.0.0/0 в production. Используйте AWS Systems Manager Session Manager для безопасного подключения без SSH вообще.' }
      ]
    },
    {
      id: 4,
      title: 'Elastic IP и User Data',
      type: 'theory',
      content: [
        { type: 'text', value: 'Elastic IP — статический публичный IP-адрес. По умолчанию при перезапуске EC2 публичный IP меняется. User Data — скрипт, выполняемый при первом запуске инстанса для автоматической настройки.' },
        { type: 'code', language: 'bash', value: '# Выделить Elastic IP:\naws ec2 allocate-address --domain vpc\n# { "PublicIp": "52.90.1.100", "AllocationId": "eipalloc-0123456789abcdef0" }\n\n# Привязать к инстансу:\naws ec2 associate-address \\\n  --instance-id i-1234567890abcdef0 \\\n  --allocation-id eipalloc-0123456789abcdef0\n\n# Важно: Elastic IP бесплатен пока привязан к запущенному инстансу\n# Если IP выделен, но не привязан — $3.65/мес (стимул освобождать неиспользуемые)' },
        { type: 'code', language: 'bash', value: '# User Data — скрипт автоматической настройки при запуске:\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.micro \\\n  --key-name my-key-pair \\\n  --security-group-ids sg-0123456789abcdef0 \\\n  --user-data file://setup.sh\n\n# Пример setup.sh:\n#!/bin/bash\napt-get update -y\napt-get install -y nginx\nsystemctl start nginx\nsystemctl enable nginx\necho "<h1>Hello from $(hostname)</h1>" > /var/www/html/index.html' },
        { type: 'note', value: 'User Data выполняется от root при первом запуске. Логи доступны в /var/log/cloud-init-output.log. Для повторного выполнения используйте cloud-init или пересоздайте инстанс.' }
      ]
    },
    {
      id: 5,
      title: 'Auto Scaling Group',
      type: 'theory',
      content: [
        { type: 'text', value: 'Auto Scaling Group (ASG) автоматически запускает и останавливает инстансы в зависимости от нагрузки. Обеспечивает эластичность и отказоустойчивость. Работает в связке с Load Balancer.' },
        { type: 'heading', value: 'Компоненты Auto Scaling' },
        { type: 'list', value: [
          'Launch Template: шаблон инстанса (AMI, тип, SG, User Data)',
          'Auto Scaling Group: группа инстансов с min/max/desired capacity',
          'Scaling Policy: правила масштабирования (по CPU, запросам, расписанию)',
          'Health Check: проверка здоровья инстансов (EC2 или ELB)'
        ] },
        { type: 'code', language: 'bash', value: '# Создание Launch Template:\naws ec2 create-launch-template \\\n  --launch-template-name my-app-template \\\n  --launch-template-data \'{\n    "ImageId": "ami-0abcdef1234567890",\n    "InstanceType": "t3.micro",\n    "KeyName": "my-key-pair",\n    "SecurityGroupIds": ["sg-0123456789abcdef0"],\n    "UserData": "IyEvYmluL2Jhc2gKYXB0LWdldCB1cGRhdGUgLXk="\n  }\'\n\n# Создание Auto Scaling Group:\naws autoscaling create-auto-scaling-group \\\n  --auto-scaling-group-name my-app-asg \\\n  --launch-template LaunchTemplateName=my-app-template,Version=\'$Latest\' \\\n  --min-size 2 \\\n  --max-size 10 \\\n  --desired-capacity 2 \\\n  --vpc-zone-identifier "subnet-0a1b2c3d,subnet-4e5f6a7b" \\\n  --target-group-arns arn:aws:elasticloadbalancing:...:targetgroup/my-tg/...\n\n# Политика масштабирования по CPU:\naws autoscaling put-scaling-policy \\\n  --auto-scaling-group-name my-app-asg \\\n  --policy-name cpu-scale-out \\\n  --policy-type TargetTrackingScaling \\\n  --target-tracking-configuration \'{\n    "PredefinedMetricSpecification": {\n      "PredefinedMetricType": "ASGAverageCPUUtilization"\n    },\n    "TargetValue": 70.0\n  }\'' },
        { type: 'tip', value: 'ASG + ALB (Application Load Balancer) — стандартный паттерн для production. ASG поддерживает нужное количество инстансов, ALB распределяет трафик. При отказе инстанса ASG автоматически создаст новый.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: запуск и настройка EC2',
      type: 'practice',
      difficulty: 'medium',
      description: 'Запустите EC2 инстанс с веб-сервером и настройте Auto Scaling.',
      requirements: [
        'Создайте Security Group с доступом на порты 22, 80, 443',
        'Создайте Key Pair для SSH доступа',
        'Запустите EC2 инстанс с User Data скриптом установки Nginx',
        'Привяжите Elastic IP к инстансу',
        'Создайте Launch Template и Auto Scaling Group (min=2, max=4)',
        'Настройте scaling policy на основе CPU utilization (target 70%)'
      ],
      hint: 'Используйте t3.micro (Free Tier). User Data должен начинаться с #!/bin/bash. Для ASG укажите минимум 2 subnet в разных AZ.',
      expectedOutput: 'Security Group sg-xxx создан с правилами для SSH, HTTP, HTTPS.\nKey Pair my-key сохранён в my-key.pem.\nEC2 инстанс i-xxx запущен с Nginx (User Data).\nElastic IP 52.90.1.100 привязан к инстансу.\nLaunch Template lt-xxx создан.\nASG my-asg: min=2, max=4, desired=2.\nScaling Policy: target CPU 70%.',
      solution: '# Security Group\nSG_ID=$(aws ec2 create-security-group \\\n  --group-name web-sg --description "Web server" \\\n  --vpc-id vpc-xxx --query "GroupId" --output text)\n\nfor PORT in 22 80 443; do\n  aws ec2 authorize-security-group-ingress \\\n    --group-id $SG_ID --protocol tcp --port $PORT --cidr 0.0.0.0/0\ndone\n\n# Key Pair\naws ec2 create-key-pair --key-name my-key \\\n  --query "KeyMaterial" --output text > my-key.pem\nchmod 400 my-key.pem\n\n# User Data скрипт\ncat > setup.sh << \'SCRIPT\'\n#!/bin/bash\napt-get update -y\napt-get install -y nginx\nsystemctl start nginx\necho "<h1>Hello from $(hostname)</h1>" > /var/www/html/index.html\nSCRIPT\n\n# Запуск EC2\nINSTANCE_ID=$(aws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.micro \\\n  --key-name my-key \\\n  --security-group-ids $SG_ID \\\n  --user-data file://setup.sh \\\n  --tag-specifications \'ResourceType=instance,Tags=[{Key=Name,Value=web-server}]\' \\\n  --query "Instances[0].InstanceId" --output text)\n\n# Elastic IP\nEIP=$(aws ec2 allocate-address --domain vpc --query "AllocationId" --output text)\naws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $EIP\n\n# Launch Template + ASG\naws ec2 create-launch-template \\\n  --launch-template-name web-template \\\n  --launch-template-data "{\\"ImageId\\":\\"ami-0abcdef1234567890\\",\\"InstanceType\\":\\"t3.micro\\",\\"SecurityGroupIds\\":[\\"$SG_ID\\"]}"\n\naws autoscaling create-auto-scaling-group \\\n  --auto-scaling-group-name my-asg \\\n  --launch-template LaunchTemplateName=web-template,Version=\'$Latest\' \\\n  --min-size 2 --max-size 4 --desired-capacity 2 \\\n  --vpc-zone-identifier "subnet-a,subnet-b"\n\naws autoscaling put-scaling-policy \\\n  --auto-scaling-group-name my-asg \\\n  --policy-name cpu-target \\\n  --policy-type TargetTrackingScaling \\\n  --target-tracking-configuration \'{"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"},"TargetValue":70.0}\'',
      explanation: 'EC2 + Security Group + Key Pair — базовый набор для запуска сервера. User Data автоматизирует настройку. Auto Scaling Group обеспечивает отказоустойчивость (min=2 в разных AZ) и эластичность (масштабирование до max=4 при нагрузке).'
    }
  ]
}
