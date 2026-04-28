export default {
  id: 2,
  title: 'AWS: обзор и IAM',
  description: 'Создание аккаунта AWS, глобальная инфраструктура регионов и зон доступности, IAM: пользователи, группы, роли, политики.',
  lessons: [
    {
      id: 1,
      title: 'Аккаунт и глобальная инфраструктура AWS',
      type: 'theory',
      content: [
        { type: 'text', value: 'AWS имеет глобальную инфраструктуру из регионов (Regions) и зон доступности (Availability Zones). Регион — географическая область с несколькими изолированными дата-центрами. AZ — один или несколько физических дата-центров в регионе.' },
        { type: 'heading', value: 'Регионы и зоны доступности' },
        { type: 'list', value: [
          'Region: физическая область (eu-central-1 = Франкфурт, us-east-1 = Вирджиния)',
          'Availability Zone (AZ): изолированный дата-центр внутри региона (eu-central-1a, eu-central-1b)',
          'Каждый регион имеет минимум 2-3 AZ, соединённых сетью с низкой задержкой',
          'Edge Location: точки присутствия для CDN (CloudFront) — 400+ по миру'
        ] },
        { type: 'code', language: 'bash', value: '# Структура AWS:\n# AWS Global Infrastructure\n# ├── Region: eu-central-1 (Frankfurt)\n# │   ├── AZ: eu-central-1a (дата-центр 1)\n# │   ├── AZ: eu-central-1b (дата-центр 2)\n# │   └── AZ: eu-central-1c (дата-центр 3)\n# ├── Region: us-east-1 (N. Virginia)\n# │   ├── AZ: us-east-1a\n# │   ├── AZ: us-east-1b\n# │   ├── ... (6 AZ)\n# └── Edge Locations (400+)\n\n# Посмотреть все регионы:\naws ec2 describe-regions --output table\n\n# Посмотреть AZ в текущем регионе:\naws ec2 describe-availability-zones --output table\n\n# Выбор региона:\n# 1. Близость к пользователям (latency)\n# 2. Compliance (данные в определённой стране)\n# 3. Доступность сервисов (не все сервисы есть во всех регионах)\n# 4. Стоимость (us-east-1 обычно дешевле)' },
        { type: 'tip', value: 'Всегда развёртывайте приложение минимум в 2 AZ для отказоустойчивости. Если один дата-центр выйдет из строя, второй продолжит обслуживать запросы.' }
      ]
    },
    {
      id: 2,
      title: 'AWS IAM: пользователи и группы',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM (Identity and Access Management) — сервис управления доступом к ресурсам AWS. Root account имеет полный доступ — его нельзя использовать для повседневной работы. Создавайте IAM пользователей.' },
        { type: 'heading', value: 'Компоненты IAM' },
        { type: 'list', value: [
          'Root Account: создаётся при регистрации, полный доступ. Используйте ТОЛЬКО для начальной настройки',
          'IAM User: учётная запись с credentials (пароль + access keys). Один человек = один user',
          'IAM Group: набор пользователей с общими правами (Developers, Admins, ReadOnly)',
          'IAM Policy: JSON-документ, определяющий разрешения (что можно, что нельзя)',
          'IAM Role: набор разрешений для временного использования сервисами или пользователями'
        ] },
        { type: 'code', language: 'bash', value: '# Создание IAM пользователя:\naws iam create-user --user-name developer1\n\n# Создание группы:\naws iam create-group --group-name Developers\n\n# Добавление пользователя в группу:\naws iam add-user-to-group \\\n  --user-name developer1 \\\n  --group-name Developers\n\n# Привязка политики к группе:\naws iam attach-group-policy \\\n  --group-name Developers \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess\n\n# Создание access keys для CLI:\naws iam create-access-key --user-name developer1\n# {\n#   "AccessKey": {\n#     "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",\n#     "SecretAccessKey": "wJalrXUtnFEMI..."\n#   }\n# }' },
        { type: 'note', value: 'Никогда не используйте root аккаунт для повседневных задач. Включите MFA (Multi-Factor Authentication) на root аккаунте сразу после создания. Храните access keys в безопасности — не коммитьте их в git!' }
      ]
    },
    {
      id: 3,
      title: 'IAM политики (Policies)',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM Policy — JSON-документ, определяющий разрешения. Политики привязываются к пользователям, группам или ролям. Принцип наименьших привилегий (Least Privilege): давайте только необходимые разрешения.' },
        { type: 'code', language: 'json', value: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "AllowS3ReadOnly",\n      "Effect": "Allow",\n      "Action": [\n        "s3:GetObject",\n        "s3:ListBucket"\n      ],\n      "Resource": [\n        "arn:aws:s3:::my-bucket",\n        "arn:aws:s3:::my-bucket/*"\n      ]\n    },\n    {\n      "Sid": "DenyDeleteBucket",\n      "Effect": "Deny",\n      "Action": "s3:DeleteBucket",\n      "Resource": "*"\n    }\n  ]\n}' },
        { type: 'heading', value: 'Элементы политики' },
        { type: 'list', value: [
          'Version: версия языка политик (всегда "2012-10-17")',
          'Statement: массив правил (statements)',
          'Effect: "Allow" или "Deny" (Deny имеет приоритет)',
          'Action: API-действия (s3:GetObject, ec2:RunInstances)',
          'Resource: ARN ресурсов к которым применяется правило',
          'Condition: необязательные условия (IP адрес, время, MFA)'
        ] },
        { type: 'code', language: 'bash', value: '# Типы политик:\n# 1. AWS Managed — созданные AWS (ReadOnlyAccess, AdministratorAccess)\n# 2. Customer Managed — ваши собственные политики\n# 3. Inline — встроенные в конкретного пользователя/группу/роль\n\n# Посмотреть список AWS managed политик:\naws iam list-policies --scope AWS --query "Policies[?starts_with(PolicyName, \'Amazon\')].[PolicyName]" --output table\n\n# Создать собственную политику:\naws iam create-policy \\\n  --policy-name S3ReadOnlyMyBucket \\\n  --policy-document file://policy.json\n\n# Привязать к пользователю:\naws iam attach-user-policy \\\n  --user-name developer1 \\\n  --policy-arn arn:aws:iam::123456789012:policy/S3ReadOnlyMyBucket' },
        { type: 'tip', value: 'Используйте AWS Policy Simulator (policysim.aws.amazon.com) для тестирования политик перед применением. Всегда начинайте с минимальных прав и добавляйте по мере необходимости.' }
      ]
    },
    {
      id: 4,
      title: 'IAM роли (Roles)',
      type: 'theory',
      content: [
        { type: 'text', value: 'IAM Role — набор разрешений, который могут "примерить" (assume) сервисы AWS, пользователи или внешние системы. Роли не имеют постоянных credentials — выдают временные через STS (Security Token Service).' },
        { type: 'heading', value: 'Когда использовать роли' },
        { type: 'list', value: [
          'EC2 инстансу нужен доступ к S3 — привяжите роль к инстансу (Instance Profile)',
          'Lambda функции нужен доступ к DynamoDB — привяжите Execution Role',
          'Cross-account доступ: пользователь из аккаунта A получает доступ к ресурсам аккаунта B',
          'Federation: вход через Google/SAML/OIDC с маппингом на IAM роль'
        ] },
        { type: 'code', language: 'json', value: '// Trust Policy — кто может примерить роль:\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Principal": {\n        "Service": "ec2.amazonaws.com"\n      },\n      "Action": "sts:AssumeRole"\n    }\n  ]\n}\n\n// Это значит: EC2 сервис может примерить эту роль\n// К роли также привязывается Permission Policy\n// (какие действия разрешены)' },
        { type: 'code', language: 'bash', value: '# Создание роли для EC2:\naws iam create-role \\\n  --role-name EC2-S3-Access \\\n  --assume-role-policy-document file://trust-policy.json\n\n# Привязка политики к роли:\naws iam attach-role-policy \\\n  --role-name EC2-S3-Access \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\n\n# Создание Instance Profile (обёртка роли для EC2):\naws iam create-instance-profile \\\n  --instance-profile-name EC2-S3-Profile\n\naws iam add-role-to-instance-profile \\\n  --instance-profile-name EC2-S3-Profile \\\n  --role-name EC2-S3-Access\n\n# Привязка к EC2 инстансу:\naws ec2 associate-iam-instance-profile \\\n  --instance-id i-1234567890abcdef0 \\\n  --iam-instance-profile Name=EC2-S3-Profile' },
        { type: 'note', value: 'Роли — предпочтительный способ предоставления доступа сервисам AWS. Никогда не храните access keys на EC2 инстансах — всегда используйте IAM роли. Временные credentials автоматически ротируются.' }
      ]
    },
    {
      id: 5,
      title: 'Лучшие практики безопасности IAM',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность IAM — фундамент безопасности всей облачной инфраструктуры. Неправильная настройка IAM — причина большинства утечек данных в облаке.' },
        { type: 'heading', value: 'Чеклист безопасности IAM' },
        { type: 'list', value: [
          'Включите MFA на root аккаунте и на всех IAM пользователях',
          'Не используйте root аккаунт для повседневных задач',
          'Принцип наименьших привилегий: давайте только необходимые права',
          'Используйте группы для управления правами, а не индивидуальные политики',
          'Используйте роли для сервисов, а не access keys',
          'Ротируйте access keys каждые 90 дней',
          'Используйте AWS Organizations для multi-account стратегии',
          'Включите CloudTrail для аудита всех API-вызовов'
        ] },
        { type: 'code', language: 'bash', value: '# Проверка безопасности IAM:\n\n# Сгенерировать отчёт по credentials:\naws iam generate-credential-report\naws iam get-credential-report --output text --query Content | base64 -d\n\n# Проверить когда последний раз использовался access key:\naws iam get-access-key-last-used \\\n  --access-key-id AKIAIOSFODNN7EXAMPLE\n\n# Включить MFA на пользователе:\n# 1. Создать виртуальное MFA устройство\naws iam create-virtual-mfa-device \\\n  --virtual-mfa-device-name developer1-mfa \\\n  --outfile qr.png\n\n# 2. Активировать MFA\naws iam enable-mfa-device \\\n  --user-name developer1 \\\n  --serial-number arn:aws:iam::123456789012:mfa/developer1-mfa \\\n  --authentication-code1 123456 \\\n  --authentication-code2 789012\n\n# Политика обязывающая MFA:\n# Condition: { "Bool": { "aws:MultiFactorAuthPresent": "true" } }' },
        { type: 'tip', value: 'Используйте AWS IAM Access Analyzer для автоматического обнаружения ресурсов, доступных из-за пределов вашего аккаунта. Сервис бесплатный и помогает найти слишком широкие политики.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка IAM',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте безопасную структуру IAM для команды разработки.',
      requirements: [
        'Создайте IAM группу Developers с доступом к EC2 и S3',
        'Создайте IAM группу Admins с полным доступом',
        'Создайте пользователя dev1 и добавьте в группу Developers',
        'Создайте собственную IAM политику разрешающую только чтение S3 из определённого bucket',
        'Создайте IAM роль для EC2 с доступом к S3',
        'Сгенерируйте credential report и проверьте настройку MFA'
      ],
      hint: 'Используйте aws iam create-group, aws iam create-user, aws iam create-policy с JSON файлом политики. Для роли нужны trust policy и permission policy.',
      expectedOutput: 'Группа Developers создана с политиками AmazonEC2FullAccess и AmazonS3ReadOnlyAccess.\nГруппа Admins создана с AdministratorAccess.\nПользователь dev1 добавлен в группу Developers.\nПользовательская политика S3ReadMyBucket создана и привязана.\nРоль EC2-S3-Role создана с Instance Profile.\nCredential report показывает статус MFA для всех пользователей.',
      solution: '# Создание групп\naws iam create-group --group-name Developers\naws iam create-group --group-name Admins\n\n# Привязка политик к группам\naws iam attach-group-policy \\\n  --group-name Developers \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess\naws iam attach-group-policy \\\n  --group-name Developers \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\naws iam attach-group-policy \\\n  --group-name Admins \\\n  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess\n\n# Создание пользователя\naws iam create-user --user-name dev1\naws iam add-user-to-group --user-name dev1 --group-name Developers\naws iam create-access-key --user-name dev1\n\n# Собственная политика (сохранить как s3-read-policy.json)\ncat > s3-read-policy.json << \'EOF\'\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:ListBucket"],\n    "Resource": ["arn:aws:s3:::my-app-bucket", "arn:aws:s3:::my-app-bucket/*"]\n  }]\n}\nEOF\n\naws iam create-policy \\\n  --policy-name S3ReadMyBucket \\\n  --policy-document file://s3-read-policy.json\n\n# Роль для EC2\ncat > trust-policy.json << \'EOF\'\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "Service": "ec2.amazonaws.com" },\n    "Action": "sts:AssumeRole"\n  }]\n}\nEOF\n\naws iam create-role --role-name EC2-S3-Role \\\n  --assume-role-policy-document file://trust-policy.json\naws iam attach-role-policy --role-name EC2-S3-Role \\\n  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\n\n# Credential report\naws iam generate-credential-report\naws iam get-credential-report --output text --query Content | base64 -d',
      explanation: 'Правильная структура IAM: группы определяют роли в организации, политики привязываются к группам. Пользователи добавляются в группы и наследуют права. Для сервисов используются IAM роли вместо access keys.'
    }
  ]
}
