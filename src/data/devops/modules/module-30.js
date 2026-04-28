export default {
  id: 30,
  title: 'GCP: основы',
  description: 'Google Cloud Platform — облачная платформа от Google. Compute Engine, Cloud Storage, Cloud Functions и Google Kubernetes Engine.',
  lessons: [
    {
      id: 1,
      title: 'Обзор GCP',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Google Cloud Platform' },
        { type: 'text', value: 'GCP — третий по размеру облачный провайдер после AWS и Azure. Сильные стороны: Kubernetes (GKE), BigQuery, AI/ML сервисы, глобальная сеть. GCP использует концепцию проектов (Projects) для организации ресурсов.' },
        { type: 'code', language: 'bash', value: '# Установка Google Cloud SDK\ncurl https://sdk.cloud.google.com | bash\nexec -l $SHELL\n\n# Инициализация\ngcloud init\n\n# Аутентификация\ngcloud auth login\ngcloud auth application-default login\n\n# Установка проекта и региона по умолчанию\ngcloud config set project my-project-id\ngcloud config set compute/region us-central1\ngcloud config set compute/zone us-central1-a\n\n# Просмотр конфигурации\ngcloud config list\n\n# Список проектов\ngcloud projects list' },
        { type: 'heading', value: 'Иерархия ресурсов GCP' },
        { type: 'code', language: 'bash', value: '# Иерархия GCP:\n# Organization (company.com)\n#   └── Folders (Production, Development, Staging)\n#       └── Projects (my-app-prod, my-app-dev)\n#           └── Resources (VMs, Storage, GKE clusters)\n\n# Проект — основная единица организации\ngcloud projects create my-new-project --name="My Project"\ngcloud projects describe my-new-project\n\n# Биллинг\ngcloud billing accounts list\ngcloud billing projects link my-new-project --billing-account=ACCOUNT_ID\n\n# Включение API\ngcloud services enable compute.googleapis.com\ngcloud services enable container.googleapis.com\ngcloud services enable cloudfunctions.googleapis.com\ngcloud services enable storage.googleapis.com\n\n# Список включённых API\ngcloud services list --enabled' },
        { type: 'list', items: [
          'Compute — VMs (Compute Engine), контейнеры (GKE, Cloud Run)',
          'Storage — Cloud Storage, Cloud SQL, Firestore, BigQuery',
          'Networking — VPC, Load Balancer, Cloud CDN, Cloud DNS',
          'AI/ML — Vertex AI, AutoML, Vision/Speech/NLP API',
          'DevOps — Cloud Build, Artifact Registry, Cloud Deploy'
        ] },
        { type: 'tip', value: 'GCP предоставляет $300 бесплатного кредита на 90 дней для новых аккаунтов. Always Free tier включает f1-micro VM, 5GB Cloud Storage и другие ресурсы навсегда.' }
      ]
    },
    {
      id: 2,
      title: 'Compute Engine',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Виртуальные машины' },
        { type: 'text', value: 'Compute Engine — сервис виртуальных машин GCP (аналог AWS EC2). Поддерживает различные типы машин, preemptible/spot VMs для экономии, и live migration для обслуживания без простоев.' },
        { type: 'code', language: 'bash', value: '# Создание VM\ngcloud compute instances create my-vm \\\n  --machine-type=e2-medium \\\n  --zone=us-central1-a \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --boot-disk-size=20GB \\\n  --boot-disk-type=pd-balanced \\\n  --tags=http-server,https-server \\\n  --metadata=startup-script=\'#!/bin/bash\napt-get update && apt-get install -y nginx\nsystemctl start nginx\'\n\n# Типы машин:\n# e2-micro    — 0.25 vCPU, 1GB  (бюджетный)\n# e2-medium   — 2 vCPU, 4GB     (общего назначения)\n# n2-standard-4 — 4 vCPU, 16GB  (production)\n# c2-standard-8 — 8 vCPU, 32GB  (compute-optimized)\n# m2-megamem-416 — 416 vCPU, 5.8TB (memory-optimized)' },
        { type: 'code', language: 'bash', value: '# SSH подключение\ngcloud compute ssh my-vm --zone=us-central1-a\n\n# Список VM\ngcloud compute instances list\n\n# Остановка/запуск\ngcloud compute instances stop my-vm --zone=us-central1-a\ngcloud compute instances start my-vm --zone=us-central1-a\n\n# Firewall правила\ngcloud compute firewall-rules create allow-http \\\n  --allow=tcp:80,tcp:443 \\\n  --target-tags=http-server \\\n  --source-ranges=0.0.0.0/0\n\n# Spot VM (до 91% дешевле, но может быть остановлена)\ngcloud compute instances create spot-vm \\\n  --machine-type=e2-medium \\\n  --provisioning-model=SPOT \\\n  --instance-termination-action=STOP' },
        { type: 'heading', value: 'Instance Groups и Autoscaling' },
        { type: 'code', language: 'bash', value: '# Создание шаблона\ngcloud compute instance-templates create web-template \\\n  --machine-type=e2-medium \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --tags=http-server\n\n# Managed Instance Group с autoscaling\ngcloud compute instance-groups managed create web-group \\\n  --template=web-template \\\n  --size=2 \\\n  --zone=us-central1-a\n\ngcloud compute instance-groups managed set-autoscaling web-group \\\n  --zone=us-central1-a \\\n  --min-num-replicas=2 \\\n  --max-num-replicas=10 \\\n  --target-cpu-utilization=0.7' },
        { type: 'note', value: 'Preemptible/Spot VM идеальны для batch-задач, CI/CD runners, тестирования. Они стоят до 91% дешевле обычных VM, но GCP может их остановить с уведомлением за 30 секунд.' }
      ]
    },
    {
      id: 3,
      title: 'Cloud Storage',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Cloud Storage (аналог S3)' },
        { type: 'text', value: 'Cloud Storage — объектное хранилище GCP для файлов любого размера. Поддерживает разные классы хранения для оптимизации стоимости. Данные хранятся в buckets (вёдрах).' },
        { type: 'code', language: 'bash', value: '# Создание bucket\ngsutil mb -l us-central1 gs://my-app-bucket-unique\n\n# Или через gcloud\ngcloud storage buckets create gs://my-app-bucket-unique \\\n  --location=us-central1 \\\n  --default-storage-class=STANDARD\n\n# Загрузка файлов\ngsutil cp localfile.txt gs://my-app-bucket-unique/\ngsutil cp -r ./my-folder gs://my-app-bucket-unique/\n\n# Скачивание\ngsutil cp gs://my-app-bucket-unique/file.txt ./\n\n# Список файлов\ngsutil ls gs://my-app-bucket-unique/\n\n# Синхронизация директорий\ngsutil rsync -r ./local-dir gs://my-app-bucket-unique/backup/' },
        { type: 'heading', value: 'Классы хранения' },
        { type: 'code', language: 'bash', value: '# Классы хранения (по убыванию стоимости/доступности):\n# Standard  — частый доступ (hot data), самый дорогой\n# Nearline  — доступ раз в месяц, хранение 30+ дней\n# Coldline  — доступ раз в квартал, хранение 90+ дней\n# Archive   — доступ раз в год, хранение 365+ дней (самый дешёвый)\n\n# Lifecycle rules — автоматическое перемещение между классами\ngsutil lifecycle set lifecycle.json gs://my-app-bucket-unique' },
        { type: 'code', language: 'json', value: '{\n  "rule": [\n    {\n      "action": {\n        "type": "SetStorageClass",\n        "storageClass": "NEARLINE"\n      },\n      "condition": {\n        "age": 30\n      }\n    },\n    {\n      "action": {\n        "type": "SetStorageClass",\n        "storageClass": "COLDLINE"\n      },\n      "condition": {\n        "age": 90\n      }\n    },\n    {\n      "action": {\n        "type": "Delete"\n      },\n      "condition": {\n        "age": 365\n      }\n    }\n  ]\n}' },
        { type: 'tip', value: 'Используйте gsutil -m для параллельной загрузки/скачивания больших объёмов данных. Флаг -m включает многопоточность и значительно ускоряет операции.' }
      ]
    },
    {
      id: 4,
      title: 'Cloud Functions',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Serverless с Cloud Functions' },
        { type: 'text', value: 'Cloud Functions — serverless платформа GCP (аналог AWS Lambda). Вы пишете функцию, а GCP автоматически масштабирует и управляет инфраструктурой. Оплата только за время выполнения.' },
        { type: 'code', language: 'bash', value: '# Структура функции (Node.js)\nmkdir my-function && cd my-function\n\n# package.json\n# {\n#   "name": "my-function",\n#   "version": "1.0.0",\n#   "main": "index.js"\n# }' },
        { type: 'code', language: 'bash', value: '# index.js — HTTP функция\n# const functions = require("@google-cloud/functions-framework");\n#\n# functions.http("helloWorld", (req, res) => {\n#   const name = req.query.name || "World";\n#   res.json({\n#     message: `Hello, ${name}!`,\n#     timestamp: new Date().toISOString()\n#   });\n# });\n\n# Деплой HTTP функции\ngcloud functions deploy hello-function \\\n  --gen2 \\\n  --runtime=nodejs20 \\\n  --region=us-central1 \\\n  --source=. \\\n  --entry-point=helloWorld \\\n  --trigger-http \\\n  --allow-unauthenticated \\\n  --memory=256MB \\\n  --timeout=60s' },
        { type: 'heading', value: 'Event-driven функции' },
        { type: 'code', language: 'bash', value: '# Python функция, триггерируемая Cloud Storage\n# main.py:\n# import functions_framework\n#\n# @functions_framework.cloud_event\n# def process_file(cloud_event):\n#     data = cloud_event.data\n#     bucket = data["bucket"]\n#     name = data["name"]\n#     print(f"Processing file: gs://{bucket}/{name}")\n#     # Обработка файла...\n\n# Деплой event-driven функции\ngcloud functions deploy process-upload \\\n  --gen2 \\\n  --runtime=python312 \\\n  --region=us-central1 \\\n  --source=. \\\n  --entry-point=process_file \\\n  --trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \\\n  --trigger-event-filters="bucket=my-app-bucket-unique"' },
        { type: 'code', language: 'bash', value: '# Управление функциями\ngcloud functions list\ngcloud functions describe hello-function --region=us-central1\ngcloud functions logs read hello-function --region=us-central1\n\n# Тестирование\ncurl https://us-central1-my-project.cloudfunctions.net/hello-function?name=DevOps\n\n# Удаление\ngcloud functions delete hello-function --region=us-central1' },
        { type: 'note', value: 'Cloud Functions Gen2 построены на Cloud Run и поддерживают больше runtime, concurrency и больший таймаут (до 60 минут). Всегда используйте Gen2 для новых функций.' }
      ]
    },
    {
      id: 5,
      title: 'GKE: Google Kubernetes Engine',
      type: 'theory',
      content: [
        { type: 'heading', value: 'GKE — managed Kubernetes' },
        { type: 'text', value: 'GKE — один из лучших managed Kubernetes сервисов. Google изобрёл Kubernetes, и GKE отражает этот опыт. GKE Autopilot полностью управляет узлами кластера, а Standard даёт больше контроля.' },
        { type: 'code', language: 'bash', value: '# Создание GKE Autopilot кластера (рекомендуется)\ngcloud container clusters create-auto my-cluster \\\n  --region=us-central1 \\\n  --release-channel=regular\n\n# Создание GKE Standard кластера\ngcloud container clusters create my-cluster \\\n  --region=us-central1 \\\n  --num-nodes=3 \\\n  --machine-type=e2-standard-4 \\\n  --enable-autoscaling \\\n  --min-nodes=2 \\\n  --max-nodes=10 \\\n  --enable-autorepair \\\n  --enable-autoupgrade \\\n  --release-channel=regular' },
        { type: 'code', language: 'bash', value: '# Подключение kubectl к кластеру\ngcloud container clusters get-credentials my-cluster --region=us-central1\n\n# Проверка подключения\nkubectl get nodes\nkubectl cluster-info\n\n# Деплой приложения\nkubectl create deployment nginx --image=nginx:latest --replicas=3\nkubectl expose deployment nginx --type=LoadBalancer --port=80\n\n# GKE автоматически создаст Google Cloud Load Balancer\nkubectl get svc nginx\n# EXTERNAL-IP — публичный IP балансировщика' },
        { type: 'heading', value: 'GKE с Artifact Registry' },
        { type: 'code', language: 'bash', value: '# Создание Docker registry\ngcloud artifacts repositories create my-repo \\\n  --repository-format=docker \\\n  --location=us-central1\n\n# Настройка Docker auth\ngcloud auth configure-docker us-central1-docker.pkg.dev\n\n# Push образа\ndocker build -t us-central1-docker.pkg.dev/my-project/my-repo/myapp:v1 .\ndocker push us-central1-docker.pkg.dev/my-project/my-repo/myapp:v1\n\n# Деплой в GKE\nkubectl set image deployment/myapp \\\n  app=us-central1-docker.pkg.dev/my-project/my-repo/myapp:v1' },
        { type: 'heading', value: 'Масштабирование и обновление' },
        { type: 'code', language: 'bash', value: '# Resize node pool\ngcloud container clusters resize my-cluster \\\n  --node-pool=default-pool \\\n  --num-nodes=5 \\\n  --region=us-central1\n\n# Обновление версии кластера\ngcloud container clusters upgrade my-cluster \\\n  --region=us-central1 \\\n  --master\n\n# Удаление кластера\ngcloud container clusters delete my-cluster --region=us-central1' },
        { type: 'tip', value: 'GKE Autopilot — лучший выбор для большинства задач. Вы платите только за запрошенные ресурсы подов, а Google управляет узлами, безопасностью и обновлениями.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой в GCP',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните приложение в GCP используя Compute Engine, Cloud Storage и GKE.',
      requirements: [
        'Создайте VM с Compute Engine и установите Nginx через startup-script',
        'Создайте Cloud Storage bucket и загрузите файлы с lifecycle policy',
        'Создайте GKE Autopilot кластер',
        'Разверните приложение в GKE с LoadBalancer Service',
        'Настройте Artifact Registry для хранения Docker образов',
        'Проверьте доступность приложения через external IP'
      ],
      hint: 'Используйте gcloud для всех операций. Создайте VM с --metadata=startup-script, GKE с create-auto, и kubectl для деплоя в кластер.',
      expectedOutput: 'gcloud compute instances list => my-vm RUNNING\ngsutil ls gs://my-bucket/ => файлы загружены\ngcloud container clusters list => my-cluster RUNNING\nkubectl get pods => 3/3 Running\nkubectl get svc => EXTERNAL-IP доступен\ncurl http://EXTERNAL-IP => приложение отвечает',
      solution: '# 1. Compute Engine\ngcloud compute instances create web-server \\\n  --machine-type=e2-micro \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --tags=http-server \\\n  --metadata=startup-script="apt-get update && apt-get install -y nginx"\n\ngcloud compute firewall-rules create allow-http \\\n  --allow=tcp:80 --target-tags=http-server\n\n# 2. Cloud Storage\ngsutil mb -l us-central1 gs://my-unique-bucket-12345/\ngsutil cp ./files/* gs://my-unique-bucket-12345/\n\n# 3. GKE\ngcloud container clusters create-auto my-cluster --region=us-central1\ngcloud container clusters get-credentials my-cluster --region=us-central1\n\n# 4. Деплой\nkubectl create deployment myapp --image=nginx --replicas=3\nkubectl expose deployment myapp --type=LoadBalancer --port=80\nkubectl get svc myapp -w  # ждём EXTERNAL-IP',
      explanation: 'GCP предоставляет полный набор сервисов для DevOps: Compute Engine для VM, Cloud Storage для файлов, GKE для контейнеров. gcloud CLI унифицирует управление всеми ресурсами. GKE Autopilot упрощает управление Kubernetes, автоматизируя работу с узлами.'
    }
  ]
}
