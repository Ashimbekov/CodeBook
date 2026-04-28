export default {
  id: 11,
  title: 'GCP: обзор и IAM',
  description: 'Google Cloud Platform: организации, проекты, IAM, сервисные аккаунты, roles и permissions, Cloud Shell.',
  lessons: [
    {
      id: 1,
      title: 'Обзор Google Cloud Platform',
      type: 'theory',
      content: [
        { type: 'text', value: 'Google Cloud Platform (GCP) — облачная платформа Google. Сильные стороны: Big Data, ML/AI, Kubernetes (GKE), глобальная сеть, инновационное ценообразование. Все ресурсы организованы в иерархию: Organization → Folder → Project.' },
        { type: 'heading', value: 'Иерархия ресурсов GCP' },
        { type: 'list', value: [
          'Organization — корневой узел (привязан к Google Workspace или Cloud Identity домену)',
          'Folder — логическая группировка (Department, Team, Environment)',
          'Project — контейнер для ресурсов (отдельный billing, IAM, API)',
          'Resource — конкретный ресурс (VM, bucket, database)'
        ] },
        { type: 'code', language: 'bash', value: '# Иерархия GCP:\n# Organization: mycompany.com\n# ├── Folder: Engineering\n# │   ├── Project: myapp-prod (ID: myapp-prod-123456)\n# │   │   ├── Compute Engine VM\n# │   │   ├── Cloud SQL database\n# │   │   └── GCS bucket\n# │   ├── Project: myapp-staging\n# │   └── Project: myapp-dev\n# └── Folder: Data Science\n#     └── Project: ml-experiments\n\n# Установка gcloud CLI:\ncurl https://sdk.cloud.google.com | bash\ngcloud init\n\n# Основные команды:\ngcloud config set project myapp-prod-123456\ngcloud projects list\ngcloud services list --enabled  # Включённые API\n\n# Включить API (нужно для использования сервиса):\ngcloud services enable compute.googleapis.com\ngcloud services enable container.googleapis.com\ngcloud services enable cloudfunctions.googleapis.com\n\n# Регионы и зоны GCP:\n# Region: europe-west1 (Бельгия), us-central1 (Айова)\n# Zone: europe-west1-b, europe-west1-c\ngcloud compute regions list\ngcloud compute zones list' },
        { type: 'tip', value: 'В GCP каждый сервис нужно включить через API. Проект — основная единица организации. Один проект = один billing аккаунт. Для изоляции окружений используйте отдельные проекты: myapp-dev, myapp-prod.' }
      ]
    },
    {
      id: 2,
      title: 'GCP IAM: роли и разрешения',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCP IAM контролирует кто (identity) имеет какой доступ (role) к какому ресурсу (resource). IAM политики наследуются по иерархии: Organization → Folder → Project → Resource.' },
        { type: 'heading', value: 'Типы ролей' },
        { type: 'list', value: [
          'Basic Roles: Owner, Editor, Viewer — широкие, не рекомендуются для production',
          'Predefined Roles: roles/compute.instanceAdmin, roles/storage.objectViewer — узкие, по сервисам',
          'Custom Roles: набор конкретных permissions для вашей организации'
        ] },
        { type: 'code', language: 'bash', value: '# Назначить роль пользователю:\ngcloud projects add-iam-policy-binding myapp-prod-123456 \\\n  --member="user:developer@mycompany.com" \\\n  --role="roles/compute.instanceAdmin.v1"\n\n# Назначить роль группе:\ngcloud projects add-iam-policy-binding myapp-prod-123456 \\\n  --member="group:developers@mycompany.com" \\\n  --role="roles/container.developer"\n\n# Посмотреть текущие IAM bindings:\ngcloud projects get-iam-policy myapp-prod-123456\n\n# Создать custom role:\ngcloud iam roles create myAppDeployer \\\n  --project=myapp-prod-123456 \\\n  --title="App Deployer" \\\n  --description="Deploy applications" \\\n  --permissions=compute.instances.start,compute.instances.stop,\\\ncontainer.deployments.create,container.deployments.update\n\n# Список predefined ролей:\ngcloud iam roles list --filter="name:roles/compute.*"\n\n# Детали роли:\ngcloud iam roles describe roles/compute.instanceAdmin.v1' },
        { type: 'note', value: 'В GCP IAM-политики наследуются вниз по иерархии. Роль Editor на уровне Organization даёт доступ ко ВСЕМ проектам и ресурсам. Всегда назначайте роли на самом узком уровне (project или resource).' }
      ]
    },
    {
      id: 3,
      title: 'Сервисные аккаунты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Service Account — специальный аккаунт для сервисов и приложений (не людей). Используется для аутентификации между сервисами. Каждый GCP сервис (VM, Cloud Function) может иметь привязанный Service Account.' },
        { type: 'code', language: 'bash', value: '# Создание Service Account:\ngcloud iam service-accounts create my-app-sa \\\n  --display-name="My App Service Account" \\\n  --description="SA for my application"\n\n# Назначить роли:\ngcloud projects add-iam-policy-binding myapp-prod-123456 \\\n  --member="serviceAccount:my-app-sa@myapp-prod-123456.iam.gserviceaccount.com" \\\n  --role="roles/storage.objectViewer"\n\ngcloud projects add-iam-policy-binding myapp-prod-123456 \\\n  --member="serviceAccount:my-app-sa@myapp-prod-123456.iam.gserviceaccount.com" \\\n  --role="roles/cloudsql.client"\n\n# Создать ключ (для внешних приложений):\ngcloud iam service-accounts keys create key.json \\\n  --iam-account=my-app-sa@myapp-prod-123456.iam.gserviceaccount.com\n\n# Использование в приложении:\nexport GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"\npython my_app.py  # Google SDK автоматически использует credentials\n\n# Привязать SA к VM:\ngcloud compute instances create my-vm \\\n  --service-account=my-app-sa@myapp-prod-123456.iam.gserviceaccount.com \\\n  --scopes=cloud-platform\n\n# Workload Identity Federation (без ключей — рекомендуется):\n# Позволяет GitHub Actions, AWS, Azure аутентифицироваться без SA ключей' },
        { type: 'tip', value: 'Избегайте скачивания ключей Service Account (key.json). Используйте привязку SA к ресурсам (VM, Cloud Run) или Workload Identity Federation для CI/CD. Ключи — security risk при утечке.' }
      ]
    },
    {
      id: 4,
      title: 'Cloud Shell и SDK',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cloud Shell — браузерная среда разработки с предустановленным gcloud, kubectl, terraform. 5 GB persistent home directory. Бесплатно. Cloud SDK — набор CLI инструментов для локальной работы.' },
        { type: 'code', language: 'bash', value: '# Cloud Shell — доступен в GCP Console (кнопка >_ в шапке)\n# Предустановлено: gcloud, gsutil, bq, kubectl, docker, terraform, python, node\n\n# gcloud CLI — основной инструмент:\ngcloud compute instances list         # Список VM\ngcloud container clusters list        # Список GKE кластеров\ngcloud functions list                 # Список Cloud Functions\ngcloud run services list              # Список Cloud Run сервисов\n\n# gsutil — работа с Cloud Storage:\ngsutil ls gs://my-bucket/\ngsutil cp file.txt gs://my-bucket/\ngsutil rsync -r ./local gs://my-bucket/remote\n\n# bq — работа с BigQuery:\nbq query "SELECT * FROM dataset.table LIMIT 10"\nbq ls --project_id myapp-prod-123456\n\n# Конфигурации для разных проектов:\ngcloud config configurations create prod\ngcloud config set project myapp-prod-123456\ngcloud config set compute/region europe-west1\n\ngcloud config configurations create dev\ngcloud config set project myapp-dev-123456\n\n# Переключение:\ngcloud config configurations activate prod\ngcloud config configurations list' },
        { type: 'note', value: 'Cloud Shell editor (code.cloudshell.dev) — полноценный VS Code в браузере. Используйте для быстрого редактирования и тестирования без локальной установки. Сессия активна 60 минут, потом отключается (данные в $HOME сохраняются).' }
      ]
    },
    {
      id: 5,
      title: 'Аудит и безопасность GCP',
      type: 'theory',
      content: [
        { type: 'text', value: 'GCP предоставляет Cloud Audit Logs для отслеживания всех действий, Organization Policies для принудительных ограничений, и Security Command Center для обнаружения угроз.' },
        { type: 'code', language: 'bash', value: '# Cloud Audit Logs — кто что делал:\n# Admin Activity Logs — всегда включены (создание/удаление ресурсов)\n# Data Access Logs — нужно включить (чтение данных)\n# System Event Logs — автоматические действия GCP\n\n# Просмотр Audit Logs:\ngcloud logging read \\\n  "logName=projects/myapp-prod-123456/logs/cloudaudit.googleapis.com%2Factivity" \\\n  --limit 10 --format json\n\n# Organization Policy — ограничения на уровне организации:\n# Запретить создание ресурсов вне определённых регионов:\ngcloud resource-manager org-policies set-policy policy.yaml \\\n  --organization=123456789\n\n# policy.yaml:\n# constraint: constraints/gcp.resourceLocations\n# listPolicy:\n#   allowedValues:\n#     - in:europe-west1-locations\n#     - in:europe-west3-locations\n\n# IAM Recommender — рекомендации по уменьшению прав:\ngcloud recommender recommendations list \\\n  --project=myapp-prod-123456 \\\n  --location=global \\\n  --recommender=google.iam.policy.Recommender\n\n# VPC Service Controls — периметр безопасности вокруг ресурсов:\n# Предотвращает exfiltration данных из BigQuery, GCS, BigTable' },
        { type: 'tip', value: 'IAM Recommender анализирует фактическое использование и предлагает убрать неиспользуемые разрешения. Запускайте регулярно для соблюдения принципа наименьших привилегий. Security Command Center (free tier) показывает уязвимости в конфигурации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка GCP проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте и настройте GCP проект с правильной структурой IAM.',
      requirements: [
        'Создайте новый GCP проект через gcloud',
        'Включите необходимые API (Compute, Container, Cloud Functions)',
        'Создайте Service Account для приложения с ролями Storage Viewer и Cloud SQL Client',
        'Назначьте роль Compute Instance Admin пользователю',
        'Создайте custom role с набором permissions для деплоя',
        'Просмотрите Audit Logs проекта'
      ],
      hint: 'gcloud projects create PROJECT_ID. gcloud services enable. gcloud iam service-accounts create. gcloud projects add-iam-policy-binding для назначения ролей.',
      expectedOutput: 'Проект myapp-test создан.\nAPI Compute, Container, CloudFunctions включены.\nService Account my-app-sa создан с ролями.\nПользователю назначена роль Compute Instance Admin.\nCustom role AppDeployer создана.\nAudit Logs показывают все выполненные действия.',
      solution: '# Создание проекта\ngcloud projects create myapp-test-123 --name="My App Test"\ngcloud config set project myapp-test-123\n\n# Включить billing (нужно привязать billing account)\ngcloud billing accounts list\ngcloud billing projects link myapp-test-123 --billing-account=XXXXX\n\n# API\ngcloud services enable compute.googleapis.com\ngcloud services enable container.googleapis.com\ngcloud services enable cloudfunctions.googleapis.com\n\n# Service Account\ngcloud iam service-accounts create my-app-sa --display-name="App SA"\ngcloud projects add-iam-policy-binding myapp-test-123 \\\n  --member="serviceAccount:my-app-sa@myapp-test-123.iam.gserviceaccount.com" \\\n  --role="roles/storage.objectViewer"\ngcloud projects add-iam-policy-binding myapp-test-123 \\\n  --member="serviceAccount:my-app-sa@myapp-test-123.iam.gserviceaccount.com" \\\n  --role="roles/cloudsql.client"\n\n# Назначить роль пользователю\ngcloud projects add-iam-policy-binding myapp-test-123 \\\n  --member="user:dev@mycompany.com" \\\n  --role="roles/compute.instanceAdmin.v1"\n\n# Custom Role\ngcloud iam roles create AppDeployer --project=myapp-test-123 \\\n  --title="App Deployer" \\\n  --permissions=run.services.create,run.services.update,container.deployments.create\n\n# Audit Logs\ngcloud logging read "logName=projects/myapp-test-123/logs/cloudaudit.googleapis.com%2Factivity" --limit 10',
      explanation: 'Правильная настройка GCP проекта: отдельные проекты для окружений, включение только нужных API, Service Account с минимальными правами для приложений, custom roles для специфичных задач. Audit Logs обеспечивают прозрачность.'
    }
  ]
}
