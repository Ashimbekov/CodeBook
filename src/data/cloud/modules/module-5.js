export default {
  id: 5,
  title: 'AWS VPC',
  description: 'Amazon VPC: подсети, маршрутные таблицы, Internet Gateway, NAT Gateway, Security Groups, NACLs, VPC Peering.',
  lessons: [
    {
      id: 1,
      title: 'Основы VPC: виртуальная сеть',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPC (Virtual Private Cloud) — изолированная виртуальная сеть в AWS. Все ресурсы (EC2, RDS, Lambda) размещаются внутри VPC. Каждый аккаунт имеет Default VPC, но для production создают custom VPC.' },
        { type: 'heading', value: 'Компоненты VPC' },
        { type: 'list', value: [
          'VPC — виртуальная сеть с CIDR блоком (например 10.0.0.0/16 = 65536 IP)',
          'Subnet — подсеть внутри VPC, привязана к конкретной AZ',
          'Internet Gateway (IGW) — шлюз для доступа в интернет',
          'Route Table — таблица маршрутизации, определяет куда идёт трафик',
          'NAT Gateway — позволяет приватным подсетям выходить в интернет (но не принимать входящий)',
          'Security Group — файрвол на уровне инстанса',
          'NACL (Network ACL) — файрвол на уровне подсети'
        ] },
        { type: 'code', language: 'bash', value: '# Создание VPC:\naws ec2 create-vpc --cidr-block 10.0.0.0/16 \\\n  --tag-specifications \'ResourceType=vpc,Tags=[{Key=Name,Value=my-vpc}]\'\n\n# Типичная архитектура VPC:\n# VPC: 10.0.0.0/16\n# ├── Public Subnet 1:  10.0.1.0/24 (AZ-a) — веб-серверы, ALB\n# ├── Public Subnet 2:  10.0.2.0/24 (AZ-b) — веб-серверы, ALB\n# ├── Private Subnet 1: 10.0.3.0/24 (AZ-a) — app серверы, БД\n# ├── Private Subnet 2: 10.0.4.0/24 (AZ-b) — app серверы, БД\n# ├── Internet Gateway — для публичных подсетей\n# └── NAT Gateway — для приватных подсетей (выход в интернет)\n\n# CIDR нотация:\n# /16 = 65,536 IP адресов (для VPC)\n# /24 = 256 IP адресов (для подсети, 251 доступен)\n# /28 = 16 IP адресов (минимум для подсети)\n# AWS резервирует 5 IP в каждой подсети (первые 4 и последний)' },
        { type: 'tip', value: 'Планируйте CIDR блоки заранее! VPC CIDR нельзя изменить после создания (можно только добавить дополнительный). Не используйте 172.31.0.0/16 (Default VPC) и 192.168.0.0/16 (домашняя сеть) чтобы избежать конфликтов при VPN подключении.' }
      ]
    },
    {
      id: 2,
      title: 'Подсети и маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Публичная подсеть имеет маршрут к Internet Gateway — ресурсы в ней доступны из интернета. Приватная подсеть не имеет прямого маршрута — только через NAT Gateway для исходящего трафика.' },
        { type: 'code', language: 'bash', value: '# Создание подсетей:\naws ec2 create-subnet --vpc-id vpc-xxx \\\n  --cidr-block 10.0.1.0/24 --availability-zone eu-central-1a \\\n  --tag-specifications \'ResourceType=subnet,Tags=[{Key=Name,Value=public-1a}]\'\n\naws ec2 create-subnet --vpc-id vpc-xxx \\\n  --cidr-block 10.0.3.0/24 --availability-zone eu-central-1a \\\n  --tag-specifications \'ResourceType=subnet,Tags=[{Key=Name,Value=private-1a}]\'\n\n# Internet Gateway:\naws ec2 create-internet-gateway\naws ec2 attach-internet-gateway --internet-gateway-id igw-xxx --vpc-id vpc-xxx\n\n# Route Table для публичной подсети:\naws ec2 create-route-table --vpc-id vpc-xxx\naws ec2 create-route --route-table-id rtb-xxx \\\n  --destination-cidr-block 0.0.0.0/0 \\\n  --gateway-id igw-xxx\naws ec2 associate-route-table --route-table-id rtb-xxx --subnet-id subnet-public\n\n# NAT Gateway (для приватных подсетей):\naws ec2 allocate-address --domain vpc  # Elastic IP для NAT\naws ec2 create-nat-gateway --subnet-id subnet-public \\\n  --allocation-id eipalloc-xxx\n\n# Route Table для приватной подсети:\naws ec2 create-route --route-table-id rtb-private \\\n  --destination-cidr-block 0.0.0.0/0 \\\n  --nat-gateway-id nat-xxx' },
        { type: 'note', value: 'NAT Gateway стоит ~$32/мес + $0.045/GB трафика. Для экономии в dev окружении используйте NAT Instance (EC2 с NAT) или выключайте NAT Gateway в нерабочее время.' }
      ]
    },
    {
      id: 3,
      title: 'Security Groups vs NACLs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Security Groups и NACLs — два уровня файрвола в VPC. Security Group работает на уровне инстанса (stateful), NACL — на уровне подсети (stateless). Используйте оба для defense in depth.' },
        { type: 'heading', value: 'Различия Security Group и NACL' },
        { type: 'list', value: [
          'Security Group: stateful (ответный трафик разрешён автоматически)',
          'NACL: stateless (нужно явно разрешить и входящий, и ответный трафик)',
          'SG: только Allow правила. NACL: Allow и Deny правила',
          'SG: на уровне инстанса (ENI). NACL: на уровне подсети',
          'SG: все правила проверяются. NACL: правила проверяются по порядку (номер)'
        ] },
        { type: 'code', language: 'bash', value: '# NACL — Network Access Control List:\naws ec2 create-network-acl --vpc-id vpc-xxx\n\n# Разрешить HTTP входящий (правило 100):\naws ec2 create-network-acl-entry \\\n  --network-acl-id acl-xxx \\\n  --rule-number 100 \\\n  --protocol tcp \\\n  --port-range From=80,To=80 \\\n  --cidr-block 0.0.0.0/0 \\\n  --rule-action allow \\\n  --ingress\n\n# Разрешить ответный трафик (ephemeral ports):\naws ec2 create-network-acl-entry \\\n  --network-acl-id acl-xxx \\\n  --rule-number 100 \\\n  --protocol tcp \\\n  --port-range From=1024,To=65535 \\\n  --cidr-block 0.0.0.0/0 \\\n  --rule-action allow \\\n  --egress\n\n# Заблокировать конкретный IP (правило 50 — проверяется раньше 100):\naws ec2 create-network-acl-entry \\\n  --network-acl-id acl-xxx \\\n  --rule-number 50 \\\n  --protocol tcp \\\n  --port-range From=80,To=80 \\\n  --cidr-block 203.0.113.50/32 \\\n  --rule-action deny \\\n  --ingress' },
        { type: 'tip', value: 'В большинстве случаев достаточно Security Groups. NACL полезен для блокировки конкретных IP на уровне подсети и для дополнительного слоя защиты (defense in depth).' }
      ]
    },
    {
      id: 4,
      title: 'VPC Peering и VPN',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPC Peering соединяет две VPC напрямую через AWS backbone. VPN и Direct Connect соединяют VPC с on-premise сетью. Transit Gateway упрощает сложные сетевые топологии.' },
        { type: 'code', language: 'bash', value: '# VPC Peering — соединение двух VPC:\naws ec2 create-vpc-peering-connection \\\n  --vpc-id vpc-111 \\\n  --peer-vpc-id vpc-222\n\n# Принять запрос (если VPC в другом аккаунте):\naws ec2 accept-vpc-peering-connection \\\n  --vpc-peering-connection-id pcx-xxx\n\n# Добавить маршруты в обе стороны:\n# В VPC-1 route table:\naws ec2 create-route --route-table-id rtb-vpc1 \\\n  --destination-cidr-block 10.1.0.0/16 \\\n  --vpc-peering-connection-id pcx-xxx\n\n# В VPC-2 route table:\naws ec2 create-route --route-table-id rtb-vpc2 \\\n  --destination-cidr-block 10.0.0.0/16 \\\n  --vpc-peering-connection-id pcx-xxx\n\n# Важно: VPC Peering НЕ транзитивный!\n# VPC-A <-> VPC-B и VPC-B <-> VPC-C\n# НЕ означает VPC-A <-> VPC-C!\n# Для этого используйте Transit Gateway' },
        { type: 'heading', value: 'Способы подключения' },
        { type: 'list', value: [
          'VPC Peering — VPC-to-VPC, бесплатно (платите только за трафик между AZ/регионами)',
          'Site-to-Site VPN — VPC к on-premise через IPsec VPN, ~$36/мес',
          'AWS Direct Connect — выделенный канал 1/10/100 Gbps, от $0.03/GB',
          'Transit Gateway — хаб для соединения множества VPC и on-premise, $0.05/час + трафик',
          'VPC Endpoint — приватный доступ к AWS сервисам без интернета (S3, DynamoDB)'
        ] },
        { type: 'note', value: 'VPC Endpoint экономит деньги и повышает безопасность: трафик к S3 идёт через AWS backbone, а не через интернет. Gateway Endpoint (S3, DynamoDB) бесплатен, Interface Endpoint (все остальные сервисы) — $0.01/час.' }
      ]
    },
    {
      id: 5,
      title: 'VPC Flow Logs и диагностика',
      type: 'theory',
      content: [
        { type: 'text', value: 'VPC Flow Logs записывают информацию о сетевом трафике в VPC. Необходимы для мониторинга, аудита безопасности и диагностики проблем с подключением.' },
        { type: 'code', language: 'bash', value: '# Включить Flow Logs для VPC (в CloudWatch Logs):\naws ec2 create-flow-logs \\\n  --resource-type VPC \\\n  --resource-ids vpc-xxx \\\n  --traffic-type ALL \\\n  --log-destination-type cloud-watch-logs \\\n  --log-group-name /vpc/flow-logs \\\n  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/flowlogs-role\n\n# Формат записи Flow Log:\n# version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status\n# 2 123456789012 eni-xxx 10.0.1.5 10.0.2.10 49152 80 6 10 840 1620000000 1620000060 ACCEPT OK\n# 2 123456789012 eni-xxx 203.0.113.50 10.0.1.5 52000 22 6 5 300 1620000000 1620000060 REJECT OK\n\n# Чтение: IP 203.0.113.50 пытался подключиться по SSH (порт 22)\n# к 10.0.1.5 — трафик REJECT (заблокирован Security Group)\n\n# Диагностика: "Почему инстанс не отвечает?"\n# 1. Проверить Security Group (входящий порт)\n# 2. Проверить NACL (входящий + исходящий)\n# 3. Проверить Route Table (маршрут к IGW)\n# 4. Проверить что инстанс имеет публичный IP или EIP\n# 5. Посмотреть Flow Logs для REJECT записей' },
        { type: 'tip', value: 'Используйте VPC Reachability Analyzer для автоматической диагностики проблем с подключением между ресурсами. Он анализирует маршруты, SG, NACL и показывает где блокируется трафик.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: создание VPC',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте production-ready VPC с публичными и приватными подсетями.',
      requirements: [
        'Создайте VPC с CIDR 10.0.0.0/16',
        'Создайте 2 публичные подсети (10.0.1.0/24, 10.0.2.0/24) в разных AZ',
        'Создайте 2 приватные подсети (10.0.3.0/24, 10.0.4.0/24) в разных AZ',
        'Настройте Internet Gateway и NAT Gateway',
        'Создайте Route Tables для публичных и приватных подсетей',
        'Включите VPC Flow Logs'
      ],
      hint: 'IGW привязывается к VPC. Public route table: 0.0.0.0/0 -> IGW. Private route table: 0.0.0.0/0 -> NAT GW. NAT GW размещается в публичной подсети.',
      expectedOutput: 'VPC vpc-xxx создан (10.0.0.0/16).\nPublic подсети: 10.0.1.0/24 (az-a), 10.0.2.0/24 (az-b).\nPrivate подсети: 10.0.3.0/24 (az-a), 10.0.4.0/24 (az-b).\nIGW igw-xxx привязан к VPC.\nNAT GW nat-xxx в публичной подсети.\nRoute tables настроены. Flow Logs включены.',
      solution: '# VPC\nVPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 \\\n  --query "Vpc.VpcId" --output text)\naws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=prod-vpc\n\n# Подсети\nPUB1=$(aws ec2 create-subnet --vpc-id $VPC_ID \\\n  --cidr-block 10.0.1.0/24 --availability-zone eu-central-1a \\\n  --query "Subnet.SubnetId" --output text)\nPUB2=$(aws ec2 create-subnet --vpc-id $VPC_ID \\\n  --cidr-block 10.0.2.0/24 --availability-zone eu-central-1b \\\n  --query "Subnet.SubnetId" --output text)\nPRIV1=$(aws ec2 create-subnet --vpc-id $VPC_ID \\\n  --cidr-block 10.0.3.0/24 --availability-zone eu-central-1a \\\n  --query "Subnet.SubnetId" --output text)\nPRIV2=$(aws ec2 create-subnet --vpc-id $VPC_ID \\\n  --cidr-block 10.0.4.0/24 --availability-zone eu-central-1b \\\n  --query "Subnet.SubnetId" --output text)\n\n# Internet Gateway\nIGW=$(aws ec2 create-internet-gateway --query "InternetGateway.InternetGatewayId" --output text)\naws ec2 attach-internet-gateway --internet-gateway-id $IGW --vpc-id $VPC_ID\n\n# Public Route Table\nPUB_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query "RouteTable.RouteTableId" --output text)\naws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW\naws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB1\naws ec2 associate-route-table --route-table-id $PUB_RT --subnet-id $PUB2\n\n# NAT Gateway\nEIP=$(aws ec2 allocate-address --domain vpc --query "AllocationId" --output text)\nNAT=$(aws ec2 create-nat-gateway --subnet-id $PUB1 --allocation-id $EIP \\\n  --query "NatGateway.NatGatewayId" --output text)\n\n# Private Route Table\nPRIV_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query "RouteTable.RouteTableId" --output text)\naws ec2 create-route --route-table-id $PRIV_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT\naws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV1\naws ec2 associate-route-table --route-table-id $PRIV_RT --subnet-id $PRIV2\n\n# Flow Logs\naws ec2 create-flow-logs --resource-type VPC --resource-ids $VPC_ID \\\n  --traffic-type ALL --log-destination-type cloud-watch-logs \\\n  --log-group-name /vpc/prod-flow-logs \\\n  --deliver-logs-permission-arn arn:aws:iam::123456789012:role/flowlogs-role',
      explanation: 'Production VPC включает публичные подсети (для ALB, bastion) и приватные (для app серверов, БД) в нескольких AZ. IGW обеспечивает интернет для публичных подсетей. NAT GW позволяет приватным подсетям загружать обновления без прямого доступа из интернета.'
    }
  ]
}
