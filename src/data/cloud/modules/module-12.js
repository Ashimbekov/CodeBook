export default {
  id: 12,
  title: 'GCP Compute Engine и GKE',
  description: 'Виртуальные машины в GCP: Compute Engine, типы машин, persistent disks. Google Kubernetes Engine: кластеры, Autopilot, деплой.',
  lessons: [
    {
      id: 1,
      title: 'Compute Engine: виртуальные машины',
      type: 'theory',
      content: [
        { type: 'text', value: 'Compute Engine — сервис виртуальных машин GCP (аналог EC2). Поддерживает custom machine types (задайте точное количество CPU и RAM), live migration (нулевой даунтайм при обслуживании хоста).' },
        { type: 'code', language: 'bash', value: '# Создание VM:\ngcloud compute instances create my-vm \\\n  --zone=europe-west1-b \\\n  --machine-type=e2-medium \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --boot-disk-size=20GB \\\n  --boot-disk-type=pd-ssd \\\n  --tags=http-server,https-server \\\n  --metadata=startup-script=\'#!/bin/bash\napt-get update && apt-get install -y nginx\'\n\n# Типы машин:\n# e2-medium:   2 vCPU, 4 GB  — general purpose, дешёвый\n# n2-standard-4: 4 vCPU, 16 GB — general purpose, production\n# c2-standard-8: 8 vCPU, 32 GB — compute optimized\n# m2-megamem-416: 416 vCPU, 5.75 TB RAM — memory optimized\n# a2-highgpu-1g: 12 vCPU, 85 GB, 1x A100 GPU — ML training\n\n# Custom Machine Type (любые значения):\ngcloud compute instances create my-vm \\\n  --custom-cpu=6 --custom-memory=24GB\n\n# SSH подключение:\ngcloud compute ssh my-vm --zone=europe-west1-b\n\n# Список VM:\ngcloud compute instances list' },
        { type: 'heading', value: 'Преимущества Compute Engine' },
        { type: 'list', value: [
          'Custom Machine Types — точная настройка CPU/RAM (экономия до 50%)',
          'Live Migration — VM перемещается между хостами без даунтайма',
          'Preemptible/Spot VMs — до 80% дешевле (но могут быть прерваны)',
          'Per-second billing — оплата посекундно (минимум 1 минута)',
          'Sole-tenant nodes — выделенный физический сервер для compliance'
        ] },
        { type: 'tip', value: 'Sustained Use Discounts (SUD) применяются автоматически: чем больше часов VM работает в месяце, тем ниже цена (до 30% скидки). Не нужно ничего заказывать — скидка считается автоматически.' }
      ]
    },
    {
      id: 2,
      title: 'Managed Instance Groups и Auto Scaling',
      type: 'theory',
      content: [
        { type: 'text', value: 'Managed Instance Group (MIG) — группа идентичных VM с автомасштабированием, автовосстановлением и rolling updates. Аналог AWS Auto Scaling Group.' },
        { type: 'code', language: 'bash', value: '# Создание Instance Template:\ngcloud compute instance-templates create my-template \\\n  --machine-type=e2-medium \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --boot-disk-size=20GB \\\n  --tags=http-server \\\n  --metadata=startup-script=\'#!/bin/bash\napt-get update && apt-get install -y nginx\n echo "Hello from $(hostname)" > /var/www/html/index.html\'\n\n# Создание MIG:\ngcloud compute instance-groups managed create my-mig \\\n  --template=my-template \\\n  --size=2 \\\n  --zone=europe-west1-b\n\n# Autoscaling:\ngcloud compute instance-groups managed set-autoscaling my-mig \\\n  --zone=europe-west1-b \\\n  --min-num-replicas=2 \\\n  --max-num-replicas=10 \\\n  --target-cpu-utilization=0.7 \\\n  --cool-down-period=60\n\n# Health Check:\ngcloud compute health-checks create http my-health-check \\\n  --port=80 --request-path=/ --check-interval=10s\n\ngcloud compute instance-groups managed set-named-ports my-mig \\\n  --zone=europe-west1-b --named-ports=http:80\n\n# Rolling Update:\ngcloud compute instance-groups managed rolling-action start-update my-mig \\\n  --version=template=my-template-v2 \\\n  --zone=europe-west1-b \\\n  --max-surge=1 --max-unavailable=0' },
        { type: 'note', value: 'MIG поддерживает Regional MIG — инстансы распределяются по нескольким зонам автоматически. Используйте для production чтобы пережить отказ целой зоны.' }
      ]
    },
    {
      id: 3,
      title: 'GKE: Google Kubernetes Engine',
      type: 'theory',
      content: [
        { type: 'text', value: 'GKE — управляемый Kubernetes от Google (создатели Kubernetes). Два режима: Standard (вы управляете nodes) и Autopilot (Google управляет всем). GKE считается лучшей managed Kubernetes платформой.' },
        { type: 'code', language: 'bash', value: '# GKE Standard — создание кластера:\ngcloud container clusters create my-cluster \\\n  --zone=europe-west1-b \\\n  --num-nodes=3 \\\n  --machine-type=e2-standard-2 \\\n  --enable-autoscaling --min-nodes=2 --max-nodes=10 \\\n  --enable-autorepair \\\n  --enable-autoupgrade\n\n# GKE Autopilot — полностью управляемый:\ngcloud container clusters create-auto my-autopilot \\\n  --region=europe-west1\n# Autopilot: нет node pools, платите только за pods,\n# Google управляет инфраструктурой, безопасностью, обновлениями\n\n# Подключение kubectl:\ngcloud container clusters get-credentials my-cluster \\\n  --zone=europe-west1-b\n\n# Проверка:\nkubectl get nodes\nkubectl get pods --all-namespaces\n\n# GKE Standard vs Autopilot:\n# Standard: $0.10/час за управление + стоимость nodes. Гибкость\n# Autopilot: платите за CPU/RAM pods. Проще, безопаснее, оптимальнее' },
        { type: 'tip', value: 'Для новых проектов рекомендуется GKE Autopilot: нет управления нодами, встроенные best practices безопасности, оплата только за запущенные pods. Standard нужен только для специфичных требований (GPU, Windows nodes, custom OS).' }
      ]
    },
    {
      id: 4,
      title: 'Деплой приложений в GKE',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деплой в GKE использует стандартные Kubernetes манифесты. Google Artifact Registry хранит Docker образы (замена Container Registry).' },
        { type: 'code', language: 'bash', value: '# Artifact Registry (замена Container Registry):\ngcloud artifacts repositories create my-repo \\\n  --repository-format=docker \\\n  --location=europe-west1\n\n# Настроить Docker auth:\ngcloud auth configure-docker europe-west1-docker.pkg.dev\n\n# Build и push:\ndocker build -t europe-west1-docker.pkg.dev/myapp-prod/my-repo/api:v1 .\ndocker push europe-west1-docker.pkg.dev/myapp-prod/my-repo/api:v1' },
        { type: 'code', language: 'yaml', value: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: api\n  template:\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n      - name: api\n        image: europe-west1-docker.pkg.dev/myapp-prod/my-repo/api:v1\n        ports:\n        - containerPort: 8080\n        resources:\n          requests:\n            cpu: "250m"\n            memory: "256Mi"\n          limits:\n            cpu: "500m"\n            memory: "512Mi"\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  type: LoadBalancer\n  selector:\n    app: api\n  ports:\n  - port: 80\n    targetPort: 8080' },
        { type: 'code', language: 'bash', value: '# Деплой:\nkubectl apply -f deployment.yaml\nkubectl get pods\nkubectl get services\n# EXTERNAL-IP появится через 1-2 минуты\n\n# Масштабирование:\nkubectl scale deployment api --replicas=5\n\n# Rolling Update:\nkubectl set image deployment/api api=.../api:v2\nkubectl rollout status deployment/api\nkubectl rollout undo deployment/api  # Откат' },
        { type: 'note', value: 'В GKE Autopilot resources.requests обязательны — по ним рассчитывается стоимость. Используйте Workload Identity для безопасного доступа pods к GCP сервисам вместо ключей Service Account.' }
      ]
    },
    {
      id: 5,
      title: 'GKE: мониторинг и продвинутые возможности',
      type: 'theory',
      content: [
        { type: 'text', value: 'GKE интегрирован с Cloud Monitoring и Cloud Logging. GKE Dashboard показывает метрики кластера, pods, workloads. Config Connector позволяет управлять GCP ресурсами через Kubernetes YAML.' },
        { type: 'code', language: 'bash', value: '# Метрики GKE в Cloud Monitoring:\n# - CPU/Memory utilization per node/pod\n# - Network traffic\n# - Disk I/O\n# - Pod restart count\n# - Container error rate\n\n# Логи GKE:\ngcloud logging read "resource.type=k8s_container AND resource.labels.cluster_name=my-cluster" \\\n  --limit 20 --format json\n\n# HPA (Horizontal Pod Autoscaler):\nkubectl autoscale deployment api --cpu-percent=70 --min=2 --max=20\n\n# VPA (Vertical Pod Autoscaler) — автоматическая настройка ресурсов:\n# GKE анализирует потребление и рекомендует/устанавливает CPU/Memory\n\n# Network Policy — ограничение трафика между pods:\nkubectl apply -f - << EOF\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all\nspec:\n  podSelector: {}\n  policyTypes:\n  - Ingress\n  - Egress\nEOF\n\n# Ingress с Google Cloud Load Balancer:\nkubectl apply -f - << EOF\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: my-ingress\nspec:\n  defaultBackend:\n    service:\n      name: api-service\n      port:\n        number: 80\nEOF' },
        { type: 'tip', value: 'GKE + Cloud Deploy = GitOps pipeline. Cloud Deploy управляет продвижением releases через окружения (dev → staging → prod) с автоматическими approval и rollback.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: деплой в GKE',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте GKE кластер и задеплойте приложение с автомасштабированием.',
      requirements: [
        'Создайте GKE Autopilot кластер',
        'Создайте Artifact Registry репозиторий и загрузите Docker образ',
        'Создайте Kubernetes Deployment с 3 репликами',
        'Создайте Service типа LoadBalancer',
        'Настройте HPA (target CPU 70%, min 2, max 10)',
        'Проверьте доступность через внешний IP'
      ],
      hint: 'gcloud container clusters create-auto для Autopilot. gcloud auth configure-docker для авторизации Docker. kubectl apply -f для деплоя.',
      expectedOutput: 'GKE Autopilot кластер my-cluster создан.\nОбраз загружен в Artifact Registry.\nDeployment api: 3/3 pods Running.\nService api-service: EXTERNAL-IP 34.xx.xx.xx.\nHPA настроен: min=2, max=10, CPU target 70%.\ncurl http://34.xx.xx.xx возвращает ответ приложения.',
      solution: '# GKE Autopilot\ngcloud container clusters create-auto my-cluster --region=europe-west1\ngcloud container clusters get-credentials my-cluster --region=europe-west1\n\n# Artifact Registry\ngcloud artifacts repositories create my-repo --repository-format=docker --location=europe-west1\ngcloud auth configure-docker europe-west1-docker.pkg.dev\ndocker build -t europe-west1-docker.pkg.dev/myproject/my-repo/api:v1 .\ndocker push europe-west1-docker.pkg.dev/myproject/my-repo/api:v1\n\n# Deployment + Service\nkubectl create deployment api --image=europe-west1-docker.pkg.dev/myproject/my-repo/api:v1 --replicas=3\nkubectl expose deployment api --type=LoadBalancer --port=80 --target-port=8080\n\n# HPA\nkubectl autoscale deployment api --cpu-percent=70 --min=2 --max=10\n\n# Проверка\nkubectl get pods\nkubectl get services\nkubectl get hpa\nEXTERNAL_IP=$(kubectl get svc api -o jsonpath=\'{.status.loadBalancer.ingress[0].ip}\')\ncurl http://$EXTERNAL_IP',
      explanation: 'GKE Autopilot — самый простой способ запустить Kubernetes в production. Google управляет нодами, безопасностью, обновлениями. HPA масштабирует pods по метрикам. LoadBalancer Service автоматически создаёт Google Cloud Load Balancer.'
    }
  ]
}
