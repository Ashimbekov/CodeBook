export default {
  id: 43,
  title: 'Multi-cloud стратегии',
  description: 'Multi-cloud — использование нескольких облачных провайдеров. Абстракция инфраструктуры, Crossplane, синхронизация данных и избежание vendor lock-in.',
  lessons: [
    {
      id: 1,
      title: 'Multi-cloud архитектура',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем Multi-cloud?' },
        { type: 'text', value: 'Multi-cloud — стратегия использования сервисов нескольких облачных провайдеров (AWS + GCP, AWS + Azure). Причины: избежание vendor lock-in, compliance требования, best-of-breed сервисы, географическое покрытие, переговорная позиция.' },
        { type: 'list', items: [
          'Vendor Lock-in Avoidance — не зависеть от одного провайдера',
          'Best-of-Breed — GKE для Kubernetes, AWS для Lambda, Azure для .NET',
          'Compliance — данные европейских клиентов в европейском облаке',
          'Resilience — отказ одного облака не останавливает бизнес',
          'Cost Optimization — использовать лучшие цены каждого провайдера'
        ] },
        { type: 'heading', value: 'Подходы к Multi-cloud' },
        { type: 'code', language: 'bash', value: '# 1. Cloud-Agnostic (одно приложение на нескольких облаках)\n# + Максимальная переносимость\n# - Сложность, не используем native сервисы\n# Инструменты: Kubernetes, Terraform, Crossplane\n\n# 2. Polyglot Cloud (разные нагрузки в разных облаках)\n# AWS: основная инфраструктура (EC2, EKS, RDS)\n# GCP: ML/Data (BigQuery, Vertex AI)\n# Azure: корпоративные сервисы (AD, Office 365)\n# + Best-of-breed сервисы\n# - Сложность интеграции\n\n# 3. Active-Passive (основной + резервный)\n# Primary: AWS (100% трафика)\n# Secondary: GCP (standby, disaster recovery)\n# + Простая архитектура\n# - Стоимость неиспользуемых ресурсов\n\n# 4. Active-Active (оба облака обслуживают трафик)\n# AWS: 60% трафика (US, EU)\n# GCP: 40% трафика (APAC)\n# + Высокая доступность\n# - Синхронизация данных, сложность' },
        { type: 'warning', value: 'Multi-cloud значительно увеличивает сложность: разные API, разные инструменты, разные модели безопасности. Начинайте multi-cloud только при реальной бизнес-необходимости, а не "на всякий случай".' }
      ]
    },
    {
      id: 2,
      title: 'Слои абстракции',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Абстракция инфраструктуры' },
        { type: 'text', value: 'Для эффективного multi-cloud нужны слои абстракции, скрывающие различия между провайдерами. Kubernetes — главный слой абстракции для compute. Terraform — для инфраструктуры. S3-compatible API — для storage.' },
        { type: 'code', language: 'bash', value: '# Уровни абстракции:\n#\n# Application Layer:\n#   Docker контейнеры — одинаковый runtime везде\n#\n# Orchestration Layer:\n#   Kubernetes — EKS, GKE, AKS используют одни и те же манифесты\n#\n# Infrastructure Layer:\n#   Terraform с модулями для каждого провайдера\n#   Crossplane с композитными ресурсами\n#\n# Storage Layer:\n#   S3-compatible API (MinIO, GCS с interoperability)\n#\n# Networking Layer:\n#   Service Mesh (Istio) для cross-cluster коммуникации\n#\n# Monitoring Layer:\n#   Prometheus + Grafana — единый мониторинг\n#   Thanos — multi-cluster Prometheus' },
        { type: 'heading', value: 'Terraform Multi-cloud' },
        { type: 'code', language: 'bash', value: '# Terraform модули для абстракции\n# modules/kubernetes-cluster/\n#   ├── main.tf\n#   ├── variables.tf\n#   └── providers/\n#       ├── aws.tf    # EKS\n#       ├── gcp.tf    # GKE\n#       └── azure.tf  # AKS\n\n# main.tf\n# variable "provider" {\n#   type = string\n#   validation {\n#     condition = contains(["aws", "gcp", "azure"], var.provider)\n#   }\n# }\n#\n# module "cluster" {\n#   source = "./modules/kubernetes-cluster/providers/${var.provider}"\n#   name   = var.cluster_name\n#   region = var.region\n#   node_count = var.node_count\n# }\n\n# Использование:\n# terraform apply -var="provider=aws" -var="region=us-east-1"\n# terraform apply -var="provider=gcp" -var="region=us-central1"' },
        { type: 'heading', value: 'Единое хранилище конфигураций' },
        { type: 'code', language: 'bash', value: '# Шаблон для multi-cloud GitOps:\n# gitops-repo/\n# ├── clusters/\n# │   ├── aws-prod/\n# │   │   ├── kustomization.yaml\n# │   │   └── cluster-config.yaml\n# │   ├── gcp-prod/\n# │   │   ├── kustomization.yaml\n# │   │   └── cluster-config.yaml\n# │   └── azure-dr/\n# │       ├── kustomization.yaml\n# │       └── cluster-config.yaml\n# ├── apps/\n# │   └── myapp/\n# │       ├── base/           # Общие манифесты\n# │       └── overlays/\n# │           ├── aws/         # AWS-специфичные патчи\n# │           ├── gcp/         # GCP-специфичные патчи\n# │           └── azure/       # Azure-специфичные патчи\n# └── infrastructure/\n#     ├── monitoring/\n#     ├── ingress/\n#     └── service-mesh/' },
        { type: 'tip', value: 'Используйте Kustomize overlays для cloud-специфичных настроек (storage classes, annotations, load balancer types). Base манифесты одинаковы для всех облаков.' }
      ]
    },
    {
      id: 3,
      title: 'Crossplane',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Crossplane — Kubernetes-native Multi-cloud' },
        { type: 'text', value: 'Crossplane — Kubernetes extension для управления облачной инфраструктурой через Kubernetes API. Вместо Terraform CLI вы описываете AWS/GCP/Azure ресурсы как Kubernetes Custom Resources и применяете через kubectl.' },
        { type: 'code', language: 'bash', value: '# Установка Crossplane\nhelm repo add crossplane-stable https://charts.crossplane.io/stable\nhelm install crossplane crossplane-stable/crossplane \\\n  --namespace crossplane-system \\\n  --create-namespace\n\n# Установка провайдеров\nkubectl apply -f - <<EOF\napiVersion: pkg.crossplane.io/v1\nkind: Provider\nmetadata:\n  name: provider-aws\nspec:\n  package: xpkg.upbound.io/upbound/provider-aws-ec2:v1.1.0\n---\napiVersion: pkg.crossplane.io/v1\nkind: Provider\nmetadata:\n  name: provider-gcp\nspec:\n  package: xpkg.upbound.io/upbound/provider-gcp-compute:v1.1.0\nEOF' },
        { type: 'heading', value: 'Управление облачными ресурсами' },
        { type: 'code', language: 'yaml', value: '# AWS RDS через Crossplane (как Kubernetes ресурс!)\napiVersion: rds.aws.upbound.io/v1beta1\nkind: Instance\nmetadata:\n  name: mydb\nspec:\n  forProvider:\n    region: us-east-1\n    engine: postgres\n    engineVersion: \"16\"\n    instanceClass: db.t3.medium\n    allocatedStorage: 50\n    dbName: myapp\n    masterUsername: admin\n    masterPasswordSecretRef:\n      name: db-password\n      key: password\n      namespace: production\n  providerConfigRef:\n    name: aws-config' },
        { type: 'heading', value: 'Composite Resources — абстракция' },
        { type: 'code', language: 'yaml', value: '# CompositeResourceDefinition — ваш API\napiVersion: apiextensions.crossplane.io/v1\nkind: CompositeResourceDefinition\nmetadata:\n  name: databases.platform.company.com\nspec:\n  group: platform.company.com\n  names:\n    kind: Database\n    plural: databases\n  versions:\n    - name: v1\n      served: true\n      referenceable: true\n      schema:\n        openAPIV3Schema:\n          type: object\n          properties:\n            spec:\n              type: object\n              properties:\n                provider:\n                  type: string\n                  enum: [\"aws\", \"gcp\"]\n                size:\n                  type: string\n                  enum: [\"small\", \"medium\", \"large\"]\n                engine:\n                  type: string\n                  default: postgres\n\n---\n# Composition — как создать для AWS\napiVersion: apiextensions.crossplane.io/v1\nkind: Composition\nmetadata:\n  name: database-aws\nspec:\n  compositeTypeRef:\n    apiVersion: platform.company.com/v1\n    kind: Database\n  resources:\n    - name: rds\n      base:\n        apiVersion: rds.aws.upbound.io/v1beta1\n        kind: Instance\n        spec:\n          forProvider:\n            engine: postgres\n            region: us-east-1\n      patches:\n        - fromFieldPath: spec.size\n          toFieldPath: spec.forProvider.instanceClass\n          transforms:\n            - type: map\n              map:\n                small: db.t3.micro\n                medium: db.t3.medium\n                large: db.r5.large' },
        { type: 'code', language: 'yaml', value: '# Использование абстрактного API:\napiVersion: platform.company.com/v1\nkind: Database\nmetadata:\n  name: orders-db\nspec:\n  provider: aws\n  size: medium\n  engine: postgres\n# Crossplane автоматически создаст RDS instance!' },
        { type: 'note', value: 'Crossplane превращает Kubernetes в универсальную control plane. Разработчики запрашивают ресурсы через простой API (Database, Cache, Queue), а платформенная команда определяет реализацию для каждого провайдера.' }
      ]
    },
    {
      id: 4,
      title: 'Синхронизация данных',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Данные в Multi-cloud' },
        { type: 'text', value: 'Синхронизация данных — самая сложная часть multi-cloud. Данные должны быть доступны во всех облаках для active-active конфигурации. Подходы: database replication, event streaming, distributed databases.' },
        { type: 'code', language: 'bash', value: '# Подходы к синхронизации данных:\n#\n# 1. Database Replication (PostgreSQL Logical Replication)\n# AWS RDS Primary -> GCP Cloud SQL Replica\n# + Знакомая технология\n# - Однонаправленная (primary -> replica)\n# - Задержка репликации\n\n# 2. Event Streaming (Kafka MirrorMaker 2)\n# Kafka Cluster (AWS) <-> Kafka Cluster (GCP)\n# + Двунаправленная синхронизация\n# + Event sourcing\n# - Сложность настройки\n\n# 3. Distributed Database\n# CockroachDB, YugabyteDB, Spanner\n# Nodes в разных облаках = одна БД\n# + Автоматическая синхронизация\n# + Multi-region, multi-cloud\n# - Стоимость, сложность\n\n# 4. Object Storage Replication\n# S3 Cross-Region Replication\n# + Для статического контента\n# - Только объектное хранилище' },
        { type: 'heading', value: 'Kafka MirrorMaker 2 для cross-cloud' },
        { type: 'code', language: 'yaml', value: '# Kafka MirrorMaker 2 — репликация между кластерами\napiVersion: kafka.strimzi.io/v1beta2\nkind: KafkaMirrorMaker2\nmetadata:\n  name: cross-cloud-mirror\nspec:\n  version: 3.7.0\n  replicas: 3\n  connectCluster: aws-cluster\n  clusters:\n    - alias: aws-cluster\n      bootstrapServers: kafka-aws.company.com:9092\n      tls:\n        trustedCertificates:\n          - secretName: aws-kafka-ca\n            certificate: ca.crt\n    - alias: gcp-cluster\n      bootstrapServers: kafka-gcp.company.com:9092\n      tls:\n        trustedCertificates:\n          - secretName: gcp-kafka-ca\n            certificate: ca.crt\n  mirrors:\n    - sourceCluster: aws-cluster\n      targetCluster: gcp-cluster\n      sourceConnector:\n        config:\n          replication.factor: 3\n          sync.topic.acls.enabled: false\n      topicsPattern: \"orders.*|payments.*|users.*\"' },
        { type: 'heading', value: 'Cross-cluster Kubernetes Networking' },
        { type: 'code', language: 'bash', value: '# Submariner — cross-cluster networking для Kubernetes\n# Позволяет сервисам в разных кластерах общаться напрямую\n\n# Установка\nsubctl deploy-broker --kubeconfig broker.config\nsubctl join --kubeconfig aws-cluster.config broker-info.subm\nsubctl join --kubeconfig gcp-cluster.config broker-info.subm\n\n# Экспорт сервиса из AWS кластера\nsubctl export service myapp --namespace production\n\n# Доступ из GCP кластера:\n# myapp.production.svc.clusterset.local\n\n# Альтернативы:\n# - Istio Multi-cluster (через east-west gateway)\n# - Cilium Cluster Mesh\n# - Skupper (application-level connectivity)' },
        { type: 'tip', value: 'Для DR (disaster recovery) достаточно async репликации. Для active-active нужна sync или near-sync репликация. Оцените стоимость cross-cloud трафика — это может быть дорого.' }
      ]
    },
    {
      id: 5,
      title: 'Избежание Vendor Lock-in',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стратегии избежания lock-in' },
        { type: 'text', value: 'Vendor lock-in возникает при глубокой зависимости от проприетарных сервисов одного провайдера. Полное избежание невозможно и непрактично — цель в осознанном управлении зависимостями.' },
        { type: 'list', items: [
          'Containers вместо serverless — Docker работает везде, Lambda только в AWS',
          'Kubernetes вместо ECS/Cloud Run — K8s работает на любом облаке',
          'PostgreSQL вместо Aurora/Spanner — стандартная СУБД, переносимая',
          'S3-compatible API — MinIO, GCS interop, Azure Blob S3 adapter',
          'Terraform/Pulumi — IaC с провайдерами для всех облаков',
          'Open standards — OIDC, gRPC, CloudEvents, OCI images'
        ] },
        { type: 'heading', value: 'Cloud-Agnostic Application Architecture' },
        { type: 'code', language: 'bash', value: '# Шаблон cloud-agnostic приложения:\n#\n# 1. Compute: Kubernetes (любой провайдер)\n# 2. Storage: S3 API (AWS S3, GCS, MinIO)\n# 3. Database: PostgreSQL (RDS, Cloud SQL, любой managed)\n# 4. Queue: Kafka/RabbitMQ (managed или self-hosted)\n# 5. Cache: Redis (ElastiCache, Memorystore, self-hosted)\n# 6. Secrets: Vault (интеграция с любым облаком)\n# 7. Monitoring: Prometheus + Grafana (везде)\n# 8. CI/CD: GitHub Actions + ArgoCD (cloud-agnostic)\n\n# Абстракция в коде приложения:\n# import os\n# STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "s3")\n# DB_URL = os.getenv("DATABASE_URL")  # PostgreSQL везде\n# CACHE_URL = os.getenv("CACHE_URL")  # Redis везде' },
        { type: 'heading', value: 'Портфель облачных сервисов' },
        { type: 'code', language: 'bash', value: '# Категоризация сервисов по risk of lock-in:\n#\n# LOW RISK (легко мигрировать):\n# ✅ Kubernetes (EKS/GKE/AKS)\n# ✅ PostgreSQL (RDS/Cloud SQL/Azure DB)\n# ✅ Redis (ElastiCache/Memorystore)\n# ✅ Object Storage (S3/GCS/Azure Blob)\n# ✅ Docker containers\n#\n# MEDIUM RISK:\n# ⚠️ Managed Kafka (MSK/Confluent)\n# ⚠️ Managed Elasticsearch (OpenSearch)\n# ⚠️ Managed monitoring (CloudWatch/Stackdriver)\n# ⚠️ Load Balancers (ALB/GCP LB)\n#\n# HIGH RISK (hard to migrate):\n# 🔴 AWS Lambda / Cloud Functions (serverless)\n# 🔴 DynamoDB / Cloud Spanner (proprietary DB)\n# 🔴 AWS Step Functions (workflow)\n# 🔴 SQS/SNS (proprietary queue)\n# 🔴 Cloud-specific IAM policies' },
        { type: 'tip', value: 'Не избегайте cloud-native сервисов полностью — они часто дешевле и лучше. Осознанно выбирайте: для core бизнес-логики используйте portable решения, для вспомогательных задач — cloud-native.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Multi-cloud Setup',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте multi-cloud архитектуру с Kubernetes кластерами в двух облаках, Crossplane для управления ресурсами и единым мониторингом.',
      requirements: [
        'Создайте Kubernetes кластеры в AWS (EKS) и GCP (GKE)',
        'Установите Crossplane с провайдерами AWS и GCP',
        'Создайте CompositeResourceDefinition "Database" с compositions для AWS и GCP',
        'Настройте единый мониторинг через Thanos (multi-cluster Prometheus)',
        'Настройте cross-cluster networking через Submariner или Istio',
        'Создайте GitOps structure с overlays для каждого облака'
      ],
      hint: 'Crossplane CompositeResourceDefinition определяет API, Composition определяет реализацию для каждого провайдера. Thanos объединяет метрики из нескольких Prometheus.',
      expectedOutput: 'kubectl get clusters => aws-prod (EKS), gcp-prod (GKE)\nkubectl get databases.platform.company.com => orders-db (AWS RDS)\nkubectl get providers => provider-aws Ready, provider-gcp Ready\nThanos Query: метрики из обоих кластеров\nGitOps: apps/myapp/overlays/aws/ и apps/myapp/overlays/gcp/',
      solution: '# 1. Кластеры\neksctl create cluster --name aws-prod --region us-east-1\ngcloud container clusters create gcp-prod --region us-central1\n\n# 2. Crossplane\nhelm install crossplane crossplane-stable/crossplane -n crossplane-system\nkubectl apply -f provider-aws.yaml -f provider-gcp.yaml\n\n# 3. CompositeResourceDefinition\n# kind: CompositeResourceDefinition\n# spec:\n#   group: platform.company.com\n#   names: { kind: Database, plural: databases }\n\n# 4. Compositions\n# database-aws.yaml -> RDS Instance\n# database-gcp.yaml -> Cloud SQL Instance\n\n# 5. Thanos\nhelm install thanos bitnami/thanos\n# Sidecar на Prometheus в каждом кластере\n# Thanos Query объединяет метрики\n\n# 6. GitOps\n# apps/myapp/base/ + overlays/aws/ + overlays/gcp/',
      explanation: 'Multi-cloud обеспечивает resilience и гибкость. Crossplane абстрагирует облачные ресурсы через Kubernetes API. Composite Resources создают единый интерфейс для разработчиков. Thanos объединяет мониторинг. GitOps с overlays управляет cloud-специфичными настройками.'
    }
  ]
}
