export default {
  id: 1,
  title: 'Введение в Cloud Computing',
  description: 'Основы облачных вычислений: модели обслуживания IaaS/PaaS/SaaS, типы развёртывания public/private/hybrid, преимущества и ключевые концепции.',
  lessons: [
    {
      id: 1,
      title: 'Что такое облачные вычисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Computing (облачные вычисления) — модель предоставления вычислительных ресурсов (серверы, хранилище, сети, ПО) через интернет по требованию (on-demand) с оплатой по факту использования (pay-as-you-go). Вместо покупки и обслуживания собственных серверов вы арендуете ресурсы у облачного провайдера.' },
        { type: 'heading', value: 'Пять характеристик облака (по NIST)' },
        { type: 'list', value: [
          'On-demand self-service — ресурсы выделяются автоматически без участия человека со стороны провайдера',
          'Broad network access — доступ через интернет с любого устройства',
          'Resource pooling — ресурсы провайдера объединены в пул и распределяются между клиентами (multi-tenancy)',
          'Rapid elasticity — быстрое масштабирование вверх и вниз по требованию',
          'Measured service — точный учёт потребления ресурсов и оплата только за использованное'
        ] },
        { type: 'code', language: 'bash', value: '# Традиционная инфраструктура:\n# 1. Купить сервер (2-4 недели на поставку)\n# 2. Установить в дата-центр\n# 3. Настроить ОС, сеть, security\n# 4. Развернуть приложение\n# Итого: недели-месяцы, капитальные затраты (CapEx)\n\n# Облачная инфраструктура:\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.medium \\\n  --count 1\n# Сервер готов через 30-60 секунд!\n# Оплата: $0.042/час (операционные затраты, OpEx)' },
        { type: 'tip', value: 'Cloud Computing — это не просто "чужой компьютер". Это целая экосистема из сотен сервисов: вычисления, хранение, базы данных, AI/ML, IoT, аналитика. Три главных провайдера: AWS (32% рынка), Azure (23%), GCP (11%).' }
      ]
    },
    {
      id: 2,
      title: 'Модели обслуживания: IaaS, PaaS, SaaS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облачные сервисы делятся на три модели в зависимости от уровня абстракции. IaaS — вы управляете ОС и приложениями. PaaS — вы управляете только приложением. SaaS — вы просто используете готовое ПО.' },
        { type: 'heading', value: 'IaaS (Infrastructure as a Service)' },
        { type: 'text', value: 'Провайдер предоставляет виртуальные машины, сети, хранилище. Вы отвечаете за ОС, middleware, приложение. Максимальная гибкость, но больше ответственности.' },
        { type: 'code', language: 'bash', value: '# IaaS примеры:\n# AWS EC2, GCP Compute Engine, Azure VMs\n# Вы получаете: VM с выбранной ОС\n# Вы управляете: ОС, обновления, security patches, приложение\n\n# Пример: создание VM в AWS\naws ec2 run-instances --image-id ami-ubuntu-22 --instance-type t3.medium\n\n# PaaS примеры:\n# AWS Elastic Beanstalk, GCP App Engine, Azure App Service, Heroku\n# Вы получаете: платформу для запуска кода\n# Вы управляете: только код приложения\n\n# Пример: деплой на Heroku (PaaS)\ngit push heroku main  # Всё! Heroku сам настроит сервер\n\n# SaaS примеры:\n# Gmail, Slack, Salesforce, Dropbox\n# Вы получаете: готовое приложение\n# Вы управляете: только данные и настройки' },
        { type: 'heading', value: 'Пирамида ответственности' },
        { type: 'list', value: [
          'On-Premise: вы отвечаете за ВСЁ — от электричества до приложения',
          'IaaS: провайдер отвечает за hardware, сеть, виртуализацию. Вы — за ОС, runtime, данные, приложение',
          'PaaS: провайдер + ОС, runtime, middleware. Вы — за приложение и данные',
          'SaaS: провайдер отвечает за всё. Вы — только за свои данные и конфигурацию'
        ] },
        { type: 'note', value: 'Есть также FaaS (Function as a Service) — подкатегория PaaS для serverless: AWS Lambda, GCP Cloud Functions, Azure Functions. Вы пишете только функции, платите за вызовы.' }
      ]
    },
    {
      id: 3,
      title: 'Типы развёртывания: Public, Private, Hybrid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облако может быть публичным, частным или гибридным в зависимости от того, кто владеет инфраструктурой и кто имеет доступ.' },
        { type: 'heading', value: 'Public Cloud (Публичное облако)' },
        { type: 'text', value: 'Инфраструктура принадлежит провайдеру (AWS, GCP, Azure) и доступна всем клиентам через интернет. Multi-tenancy: ресурсы разделяются между клиентами с изоляцией.' },
        { type: 'heading', value: 'Private Cloud (Частное облако)' },
        { type: 'text', value: 'Инфраструктура принадлежит одной организации. Может быть on-premise или у провайдера. Примеры: VMware vSphere, OpenStack, AWS Outposts.' },
        { type: 'heading', value: 'Hybrid Cloud (Гибридное облако)' },
        { type: 'text', value: 'Комбинация public и private. Критичные данные в private cloud, остальное в public. Связаны VPN или выделенным каналом.' },
        { type: 'list', value: [
          'Public: дешевле, быстрее запуск, глобальное покрытие. Пример: стартапы, веб-приложения',
          'Private: полный контроль, compliance, безопасность. Пример: банки, госструктуры',
          'Hybrid: гибкость, постепенная миграция. Пример: enterprise-компании',
          'Multi-Cloud: использование нескольких провайдеров одновременно (AWS + GCP)'
        ] },
        { type: 'tip', value: 'Большинство крупных компаний используют Hybrid или Multi-Cloud стратегию. Это снижает vendor lock-in и позволяет выбирать лучшие сервисы каждого провайдера.' }
      ]
    },
    {
      id: 4,
      title: 'Преимущества и недостатки облака',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облачные вычисления дают значительные преимущества, но имеют и ограничения. Важно понимать оба аспекта для принятия правильных решений.' },
        { type: 'heading', value: 'Преимущества' },
        { type: 'list', value: [
          'Масштабируемость: увеличение/уменьшение ресурсов за минуты, а не недели',
          'Экономия: нет капитальных затрат, оплата по факту (OpEx вместо CapEx)',
          'Глобальная доступность: дата-центры по всему миру, низкая задержка для пользователей',
          'Высокая доступность: встроенная отказоустойчивость, SLA 99.95-99.999%',
          'Скорость развёртывания: новые среды за минуты вместо месяцев',
          'Инновации: доступ к AI/ML, Big Data, IoT без собственной экспертизы'
        ] },
        { type: 'heading', value: 'Недостатки и риски' },
        { type: 'list', value: [
          'Vendor lock-in: зависимость от провайдера, сложность миграции',
          'Стоимость при большом масштабе: для стабильных нагрузок on-premise может быть дешевле',
          'Compliance: не все данные можно хранить в публичном облаке (персональные данные, 152-ФЗ)',
          'Сетевая зависимость: без интернета нет доступа к ресурсам',
          'Сложность: сотни сервисов, крутая кривая обучения'
        ] },
        { type: 'code', language: 'bash', value: '# Пример экономии: веб-приложение с переменной нагрузкой\n\n# On-Premise: покупка под пиковую нагрузку\n# 10 серверов x $5000 = $50,000 (CapEx)\n# + электричество, охлаждение, админ: $2000/мес\n# Большую часть времени 8 серверов простаивают\n\n# Cloud: Auto Scaling\n# Обычная нагрузка: 2 сервера x $0.04/час = $58/мес\n# Пиковая нагрузка (2 часа/день): 10 серверов = +$48/мес\n# Итого: ~$106/мес vs $2000/мес + амортизация оборудования' },
        { type: 'note', value: 'Правило 80/20: для 80% проектов облако экономически выгоднее. Для 20% с очень стабильной и высокой нагрузкой (Netflix, крупные банки) гибрид или dedicated серверы могут быть дешевле.' }
      ]
    },
    {
      id: 5,
      title: 'Обзор провайдеров: AWS, GCP, Azure',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три ведущих облачных провайдера покрывают более 65% рынка. Каждый имеет свои сильные стороны и экосистему.' },
        { type: 'heading', value: 'AWS (Amazon Web Services)' },
        { type: 'text', value: 'Лидер рынка с 2006 года. Самый широкий набор сервисов (200+). Наибольшая экосистема и сообщество. Сильные стороны: compute, storage, networking, самая развитая инфраструктура.' },
        { type: 'heading', value: 'GCP (Google Cloud Platform)' },
        { type: 'text', value: 'Запущен в 2008. Сильные стороны: Big Data, ML/AI (TensorFlow, Vertex AI), Kubernetes (GKE). Лучшая глобальная сеть. Инновационный подход к ценообразованию.' },
        { type: 'heading', value: 'Azure (Microsoft Azure)' },
        { type: 'text', value: 'Запущен в 2010. Лидер в enterprise сегменте благодаря интеграции с Microsoft 365, Active Directory, Windows Server. Сильные стороны: гибридное облако, .NET, enterprise.' },
        { type: 'code', language: 'bash', value: '# Сравнение ключевых сервисов:\n#\n# Категория      | AWS              | GCP                | Azure\n# --------------|------------------|--------------------|-----------------\n# Compute       | EC2              | Compute Engine     | Virtual Machines\n# Containers    | ECS/EKS          | GKE                | AKS\n# Serverless    | Lambda           | Cloud Functions    | Azure Functions\n# Object Store  | S3               | Cloud Storage      | Blob Storage\n# SQL DB        | RDS/Aurora       | Cloud SQL/Spanner  | SQL Database\n# NoSQL DB      | DynamoDB         | Firestore/Bigtable | Cosmos DB\n# CDN           | CloudFront       | Cloud CDN          | Azure CDN\n# DNS           | Route 53         | Cloud DNS          | Azure DNS\n# IaC           | CloudFormation   | Deployment Manager | ARM/Bicep\n# Monitoring    | CloudWatch       | Cloud Monitoring   | Azure Monitor' },
        { type: 'tip', value: 'Выбор провайдера зависит от задач: стартап/общее — AWS (больше документации, специалистов), Data/ML — GCP, Enterprise/Microsoft стек — Azure. Многие компании используют Multi-Cloud.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CLI облачных провайдеров',
      type: 'practice',
      difficulty: 'easy',
      description: 'Установите и настройте CLI инструменты для работы с облачными провайдерами.',
      requirements: [
        'Установите AWS CLI и настройте профиль через aws configure',
        'Проверьте подключение командой aws sts get-caller-identity',
        'Выведите список регионов AWS командой aws ec2 describe-regions',
        'Установите gcloud CLI и выполните gcloud init',
        'Установите Azure CLI и выполните az login',
        'Сравните вывод aws --version, gcloud --version, az --version'
      ],
      hint: 'AWS CLI устанавливается через pip install awscli или snap. gcloud через Google Cloud SDK. az через apt или brew. Для aws configure понадобятся Access Key ID и Secret Access Key из IAM Console.',
      expectedOutput: '# AWS CLI\naws-cli/2.15.0 Python/3.11.6\n{\n    "UserId": "AIDAEXAMPLE",\n    "Account": "123456789012",\n    "Arn": "arn:aws:iam::123456789012:user/myuser"\n}\n\n# gcloud CLI\nGoogle Cloud SDK 460.0.0\n\n# Azure CLI\nazure-cli 2.56.0',
      solution: '# Установка AWS CLI\ncurl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"\nunzip awscliv2.zip\nsudo ./aws/install\n\n# Настройка AWS CLI\naws configure\n# AWS Access Key ID: AKIAIOSFODNN7EXAMPLE\n# AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n# Default region name: eu-central-1\n# Default output format: json\n\n# Проверка подключения\naws sts get-caller-identity\n\n# Список регионов\naws ec2 describe-regions --query "Regions[].RegionName" --output table\n\n# Установка gcloud\ncurl https://sdk.cloud.google.com | bash\nexec -l $SHELL\ngcloud init\n\n# Установка Azure CLI\ncurl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash\naz login\n\n# Проверка версий\naws --version\ngcloud --version\naz --version',
      explanation: 'CLI инструменты — основной способ взаимодействия с облаком для DevOps инженеров. aws configure сохраняет credentials в ~/.aws/credentials. Каждый провайдер имеет свой CLI с похожей логикой: команда + сервис + действие + параметры.'
    }
  ]
}
