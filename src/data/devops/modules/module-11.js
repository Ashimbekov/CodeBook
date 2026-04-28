export default {
  id: 11,
  title: 'Kubernetes: продвинутый',
  description: 'Продвинутые возможности Kubernetes: ConfigMaps, Secrets, Ingress, Helm, автоскейлинг и хранилища.',
  lessons: [
    {
      id: 1,
      title: 'ConfigMaps и Secrets',
      type: 'theory',
      content: [
        { type: 'text', value: 'ConfigMap хранит конфигурацию (не секреты), Secret — чувствительные данные (пароли, токены, ключи). Оба позволяют отделить конфигурацию от кода образа.' },
        { type: 'heading', value: 'ConfigMap' },
        { type: 'code', language: 'yaml', value: '# configmap.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  APP_ENV: "production"\n  LOG_LEVEL: "info"\n  MAX_CONNECTIONS: "100"\n  nginx.conf: |\n    server {\n      listen 80;\n      location / {\n        proxy_pass http://backend:8080;\n      }\n    }' },
        { type: 'code', language: 'yaml', value: '# Использование ConfigMap в Pod\nspec:\n  containers:\n    - name: app\n      image: myapp:1.0\n      # Как переменные окружения\n      envFrom:\n        - configMapRef:\n            name: app-config\n      # Или отдельные переменные\n      env:\n        - name: LOG_LEVEL\n          valueFrom:\n            configMapKeyRef:\n              name: app-config\n              key: LOG_LEVEL\n      # Как файл (volume mount)\n      volumeMounts:\n        - name: config-volume\n          mountPath: /etc/nginx/nginx.conf\n          subPath: nginx.conf\n  volumes:\n    - name: config-volume\n      configMap:\n        name: app-config' },
        { type: 'heading', value: 'Secrets' },
        { type: 'code', language: 'bash', value: '# Создание Secret\nkubectl create secret generic db-credentials \\\n  --from-literal=username=admin \\\n  --from-literal=password=supersecret\n\nkubectl create secret generic tls-cert \\\n  --from-file=tls.crt=./cert.pem \\\n  --from-file=tls.key=./key.pem' },
        { type: 'code', language: 'yaml', value: '# secret.yaml (значения в base64)\napiVersion: v1\nkind: Secret\nmetadata:\n  name: db-credentials\ntype: Opaque\ndata:\n  username: YWRtaW4=          # echo -n "admin" | base64\n  password: c3VwZXJzZWNyZXQ=  # echo -n "supersecret" | base64\n\n---\n# Использование в Pod\nspec:\n  containers:\n    - name: app\n      env:\n        - name: DB_USERNAME\n          valueFrom:\n            secretKeyRef:\n              name: db-credentials\n              key: username\n        - name: DB_PASSWORD\n          valueFrom:\n            secretKeyRef:\n              name: db-credentials\n              key: password' },
        { type: 'warning', value: 'Kubernetes Secrets закодированы в base64, но НЕ зашифрованы! Любой с доступом к API может их прочитать. Для продакшена используйте: Sealed Secrets, HashiCorp Vault, AWS Secrets Manager или включите encryption at rest в etcd.' }
      ]
    },
    {
      id: 2,
      title: 'Ingress',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ingress управляет внешним HTTP/HTTPS трафиком в кластере. Он предоставляет маршрутизацию по URL, виртуальные хосты, SSL-терминацию — всё что делает reverse proxy (Nginx).' },
        { type: 'heading', value: 'Ingress Controller и Ingress ресурс' },
        { type: 'code', language: 'bash', value: '# Установка Nginx Ingress Controller\n# minikube:\nminikube addons enable ingress\n\n# Или через Helm:\nhelm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx\nhelm install ingress-nginx ingress-nginx/ingress-nginx' },
        { type: 'code', language: 'yaml', value: '# ingress.yaml — маршрутизация по хостам и путям\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: my-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - app.example.com\n      secretName: tls-secret\n  rules:\n    - host: app.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: frontend-service\n                port:\n                  number: 80\n          - path: /api\n            pathType: Prefix\n            backend:\n              service:\n                name: backend-service\n                port:\n                  number: 8080\n    - host: admin.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: admin-service\n                port:\n                  number: 80' },
        { type: 'tip', value: 'Ingress заменяет отдельный Nginx перед кластером. Один LoadBalancer для Ingress Controller обслуживает все домены. Это дешевле чем LoadBalancer для каждого сервиса.' }
      ]
    },
    {
      id: 3,
      title: 'Helm — пакетный менеджер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Helm — пакетный менеджер для Kubernetes. Helm charts — это шаблоны K8s-манифестов с параметрами. Helm упрощает установку, обновление и управление приложениями в K8s.' },
        { type: 'heading', value: 'Основные команды Helm' },
        { type: 'code', language: 'bash', value: '# Установка Helm\ncurl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash\n\n# Добавление репозиториев\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts\nhelm repo update\n\n# Поиск charts\nhelm search repo nginx\nhelm search repo postgresql\n\n# Установка\nhelm install my-nginx bitnami/nginx\nhelm install my-pg bitnami/postgresql --set auth.postgresPassword=secret\nhelm install my-pg bitnami/postgresql -f values.yaml  # Файл параметров\n\n# Список установленных\nhelm list\nhelm list -A                    # Во всех namespaces\n\n# Обновление\nhelm upgrade my-nginx bitnami/nginx --set replicaCount=3\nhelm upgrade my-pg bitnami/postgresql -f values-prod.yaml\n\n# Откат\nhelm rollback my-nginx 1        # К ревизии 1\nhelm history my-nginx            # История ревизий\n\n# Удаление\nhelm uninstall my-nginx' },
        { type: 'heading', value: 'Файл values.yaml' },
        { type: 'code', language: 'yaml', value: '# values.yaml — параметры для chart\nreplicaCount: 3\n\nimage:\n  repository: myapp\n  tag: "1.2.3"\n  pullPolicy: IfNotPresent\n\nservice:\n  type: ClusterIP\n  port: 80\n\ningress:\n  enabled: true\n  hosts:\n    - host: app.example.com\n      paths:\n        - path: /\n          pathType: Prefix\n\nresources:\n  requests:\n    cpu: 250m\n    memory: 128Mi\n  limits:\n    cpu: 500m\n    memory: 256Mi\n\nenv:\n  DATABASE_URL: "postgresql://db:5432/myapp"\n  LOG_LEVEL: "info"' },
        { type: 'note', value: 'Helm charts можно создавать свои: helm create my-chart. Это создаёт шаблонную структуру с templates/, values.yaml и Chart.yaml. Шаблоны используют Go template syntax.' }
      ]
    },
    {
      id: 4,
      title: 'Persistent Volumes и хранилища',
      type: 'theory',
      content: [
        { type: 'text', value: 'PersistentVolume (PV) — ресурс хранения в кластере. PersistentVolumeClaim (PVC) — запрос на хранилище от Pod. StorageClass определяет тип хранилища (SSD, HDD, cloud).' },
        { type: 'heading', value: 'PersistentVolumeClaim' },
        { type: 'code', language: 'yaml', value: '# pvc.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: postgres-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce          # Одна нода может писать\n  resources:\n    requests:\n      storage: 10Gi\n  storageClassName: standard  # gp2 (AWS), pd-standard (GCP)\n\n---\n# Использование в Deployment\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: postgres\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          env:\n            - name: POSTGRES_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: db-credentials\n                  key: password\n          volumeMounts:\n            - name: postgres-storage\n              mountPath: /var/lib/postgresql/data\n      volumes:\n        - name: postgres-storage\n          persistentVolumeClaim:\n            claimName: postgres-pvc' },
        { type: 'heading', value: 'StatefulSet для stateful-приложений' },
        { type: 'code', language: 'yaml', value: '# StatefulSet — для приложений с состоянием (БД, кэш)\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          volumeMounts:\n            - name: data\n              mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:\n    - metadata:\n        name: data\n      spec:\n        accessModes: ["ReadWriteOnce"]\n        resources:\n          requests:\n            storage: 10Gi' },
        { type: 'tip', value: 'StatefulSet гарантирует стабильные имена подов (postgres-0, postgres-1) и стабильное хранилище для каждого пода. Используй StatefulSet для баз данных и кластерных приложений (Kafka, Elasticsearch).' }
      ]
    },
    {
      id: 5,
      title: 'Автоскейлинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes может автоматически масштабировать приложения на основе метрик: CPU, память, пользовательские метрики. Horizontal Pod Autoscaler (HPA) изменяет количество реплик.' },
        { type: 'heading', value: 'Horizontal Pod Autoscaler' },
        { type: 'code', language: 'yaml', value: '# hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: my-app-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: my-app\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70   # Масштабировать при CPU > 70%\n    - type: Resource\n      resource:\n        name: memory\n        target:\n          type: Utilization\n          averageUtilization: 80   # Масштабировать при Memory > 80%' },
        { type: 'code', language: 'bash', value: '# Создание HPA через CLI\nkubectl autoscale deployment my-app \\\n  --min=2 --max=10 --cpu-percent=70\n\n# Просмотр HPA\nkubectl get hpa\n# NAME        REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS\n# my-app-hpa  Deployment/my-app  35%/70%   2         10        3\n\n# Необходим metrics-server\n# minikube:\nminikube addons enable metrics-server\n\n# Проверка метрик\nkubectl top pods\nkubectl top nodes\n\n# Нагрузочное тестирование\nkubectl run load-test --rm -it --image=busybox -- sh\n# while true; do wget -q -O- http://my-app-service; done' },
        { type: 'note', value: 'HPA требует metrics-server в кластере и указания requests в Deployment. Без requests.cpu Kubernetes не может рассчитать процент использования. Масштабирование вниз происходит медленнее (5 минут по умолчанию), чтобы избежать осцилляций.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Полный деплой с Helm',
      type: 'practice',
      difficulty: 'hard',
      description: 'Установите приложение в Kubernetes с помощью Helm, ConfigMap, Secret и Ingress.',
      requirements: [
        'Установите Helm и добавьте репозиторий bitnami',
        'Установите PostgreSQL через Helm с кастомными values',
        'Создайте ConfigMap с конфигурацией приложения',
        'Создайте Secret с паролем БД',
        'Создайте Deployment, Service и Ingress для приложения',
        'Настройте HPA для автоматического масштабирования'
      ],
      hint: 'helm install postgres bitnami/postgresql -f values.yaml. Используйте kubectl create configmap и kubectl create secret. HPA: kubectl autoscale deployment.',
      expectedOutput: 'PostgreSQL установлен через Helm: helm list показывает release\nConfigMap и Secret созданы\nDeployment с 2 репликами запущен\nIngress настроен на app.local\nHPA: min=2, max=5, target CPU=70%',
      solution: '# 1. Helm setup\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\n\n# 2. PostgreSQL\nhelm install postgres bitnami/postgresql \\\n  --set auth.postgresPassword=secret \\\n  --set auth.database=myapp \\\n  --set primary.persistence.size=5Gi \\\n  -n devops-lab --create-namespace\n\n# 3. ConfigMap\nkubectl create configmap app-config \\\n  --from-literal=APP_ENV=production \\\n  --from-literal=LOG_LEVEL=info \\\n  -n devops-lab\n\n# 4. Secret\nkubectl create secret generic app-secrets \\\n  --from-literal=DB_PASSWORD=secret \\\n  -n devops-lab\n\n# 5. Deployment + Service + Ingress\n# kubectl apply -f deployment.yaml -n devops-lab\n# kubectl apply -f service.yaml -n devops-lab\n# kubectl apply -f ingress.yaml -n devops-lab\n\n# 6. HPA\nkubectl autoscale deployment my-app \\\n  --min=2 --max=5 --cpu-percent=70 \\\n  -n devops-lab\n\n# Проверка\nhelm list -n devops-lab\nkubectl get all -n devops-lab\nkubectl get hpa -n devops-lab',
      explanation: 'Helm упрощает установку сложных приложений (PostgreSQL) с правильными defaults. ConfigMap отделяет конфигурацию от образа. Secret хранит чувствительные данные. Ingress маршрутизирует HTTP-трафик. HPA автоматически масштабирует поды при увеличении нагрузки.'
    }
  ]
}
