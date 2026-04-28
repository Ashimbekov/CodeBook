export default {
  id: 26,
  title: 'Helm Charts',
  description: 'Helm — пакетный менеджер для Kubernetes. Создание, настройка и управление Helm Charts для деплоя приложений.',
  lessons: [
    {
      id: 1,
      title: 'Основы Helm',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Helm?' },
        { type: 'text', value: 'Helm — это пакетный менеджер для Kubernetes, аналог apt/yum для Linux. Helm упрощает установку, обновление и управление приложениями в кластере. Chart — это пакет Helm, содержащий все Kubernetes-ресурсы для развёртывания приложения.' },
        { type: 'code', language: 'bash', value: '# Установка Helm\ncurl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash\n\n# Проверка версии\nhelm version\n\n# Добавление репозитория\nhelm repo add stable https://charts.helm.sh/stable\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\n\n# Поиск chart\nhelm search repo nginx\nhelm search hub prometheus' },
        { type: 'heading', value: 'Основные команды' },
        { type: 'code', language: 'bash', value: '# Установка chart\nhelm install my-release bitnami/nginx\n\n# Установка с кастомными значениями\nhelm install my-release bitnami/nginx -f values.yaml\nhelm install my-release bitnami/nginx --set replicaCount=3\n\n# Список установленных releases\nhelm list\nhelm list -A  # все namespace\n\n# Обновление release\nhelm upgrade my-release bitnami/nginx --set replicaCount=5\n\n# Откат к предыдущей версии\nhelm rollback my-release 1\n\n# Удаление release\nhelm uninstall my-release\n\n# Просмотр значений по умолчанию\nhelm show values bitnami/nginx' },
        { type: 'list', items: [
          'Chart — пакет с шаблонами Kubernetes-ресурсов',
          'Release — экземпляр установленного chart в кластере',
          'Repository — хранилище charts (аналог apt-репозитория)',
          'Values — параметры для настройки chart'
        ] },
        { type: 'tip', value: 'Всегда используйте helm show values перед установкой chart, чтобы понять доступные параметры. Флаг --dry-run --debug покажет итоговые манифесты без применения.' }
      ]
    },
    {
      id: 2,
      title: 'Структура Chart',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Создание Chart' },
        { type: 'text', value: 'Helm chart имеет строгую структуру директорий. Команда helm create генерирует шаблон chart со всеми необходимыми файлами.' },
        { type: 'code', language: 'bash', value: '# Создание нового chart\nhelm create myapp\n\n# Структура chart:\nmyapp/\n├── Chart.yaml          # Метаданные chart (имя, версия, описание)\n├── values.yaml         # Значения по умолчанию\n├── charts/             # Зависимости (subchart)\n├── templates/          # Шаблоны Kubernetes-ресурсов\n│   ├── _helpers.tpl    # Вспомогательные шаблоны\n│   ├── deployment.yaml\n│   ├── service.yaml\n│   ├── ingress.yaml\n│   ├── hpa.yaml\n│   ├── serviceaccount.yaml\n│   ├── NOTES.txt       # Сообщение после установки\n│   └── tests/\n│       └── test-connection.yaml\n└── .helmignore         # Файлы для исключения из пакета' },
        { type: 'heading', value: 'Chart.yaml' },
        { type: 'code', language: 'yaml', value: '# Chart.yaml\napiVersion: v2\nname: myapp\ndescription: A Helm chart for MyApp\ntype: application   # application или library\nversion: 0.1.0      # Версия chart\nappVersion: "1.0.0" # Версия приложения\nmaintainers:\n  - name: DevOps Team\n    email: devops@company.com\nkeywords:\n  - myapp\n  - web\nhome: https://github.com/company/myapp\nsources:\n  - https://github.com/company/myapp' },
        { type: 'heading', value: 'values.yaml' },
        { type: 'code', language: 'yaml', value: '# values.yaml — значения по умолчанию\nreplicaCount: 2\n\nimage:\n  repository: ghcr.io/company/myapp\n  pullPolicy: IfNotPresent\n  tag: "latest"\n\nservice:\n  type: ClusterIP\n  port: 80\n\ningress:\n  enabled: true\n  className: nginx\n  hosts:\n    - host: myapp.company.com\n      paths:\n        - path: /\n          pathType: Prefix\n\nresources:\n  limits:\n    cpu: 500m\n    memory: 256Mi\n  requests:\n    cpu: 250m\n    memory: 128Mi\n\nautoscaling:\n  enabled: true\n  minReplicas: 2\n  maxReplicas: 10\n  targetCPUUtilizationPercentage: 70\n\nenv:\n  DATABASE_URL: "postgresql://db:5432/myapp"\n  LOG_LEVEL: "info"' },
        { type: 'note', value: 'Версия chart (version) и версия приложения (appVersion) — разные вещи. Обновляйте version при любом изменении chart, appVersion — при обновлении самого приложения.' }
      ]
    },
    {
      id: 3,
      title: 'Шаблоны и Values',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Шаблонизация в Helm' },
        { type: 'text', value: 'Helm использует Go template engine. Шаблоны позволяют параметризировать Kubernetes-манифесты через values. Двойные фигурные скобки {{ }} обозначают шаблонные выражения.' },
        { type: 'code', language: 'yaml', value: '# templates/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include "myapp.fullname" . }}\n  labels:\n    {{- include "myapp.labels" . | nindent 4 }}\nspec:\n  {{- if not .Values.autoscaling.enabled }}\n  replicas: {{ .Values.replicaCount }}\n  {{- end }}\n  selector:\n    matchLabels:\n      {{- include "myapp.selectorLabels" . | nindent 6 }}\n  template:\n    metadata:\n      labels:\n        {{- include "myapp.selectorLabels" . | nindent 8 }}\n    spec:\n      containers:\n        - name: {{ .Chart.Name }}\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"\n          imagePullPolicy: {{ .Values.image.pullPolicy }}\n          ports:\n            - name: http\n              containerPort: 8080\n          {{- with .Values.resources }}\n          resources:\n            {{- toYaml . | nindent 12 }}\n          {{- end }}\n          env:\n            {{- range $key, $value := .Values.env }}\n            - name: {{ $key }}\n              value: {{ $value | quote }}\n            {{- end }}' },
        { type: 'heading', value: 'Helpers (_helpers.tpl)' },
        { type: 'code', language: 'yaml', value: '# templates/_helpers.tpl\n{{/*\nПолное имя приложения\n*/}}\n{{- define "myapp.fullname" -}}\n{{- if .Values.fullnameOverride }}\n{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}\n{{- else }}\n{{- $name := default .Chart.Name .Values.nameOverride }}\n{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}\n{{- end }}\n{{- end }}\n\n{{/*\nОбщие labels\n*/}}\n{{- define "myapp.labels" -}}\nhelm.sh/chart: {{ include "myapp.chart" . }}\n{{ include "myapp.selectorLabels" . }}\napp.kubernetes.io/version: {{ .Chart.AppVersion | quote }}\napp.kubernetes.io/managed-by: {{ .Release.Service }}\n{{- end }}\n\n{{/*\nSelector labels\n*/}}\n{{- define "myapp.selectorLabels" -}}\napp.kubernetes.io/name: {{ include "myapp.name" . }}\napp.kubernetes.io/instance: {{ .Release.Name }}\n{{- end }}' },
        { type: 'heading', value: 'Условные блоки и циклы' },
        { type: 'code', language: 'yaml', value: '# templates/ingress.yaml — условный ресурс\n{{- if .Values.ingress.enabled -}}\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: {{ include "myapp.fullname" . }}\n  {{- with .Values.ingress.annotations }}\n  annotations:\n    {{- toYaml . | nindent 4 }}\n  {{- end }}\nspec:\n  ingressClassName: {{ .Values.ingress.className }}\n  rules:\n    {{- range .Values.ingress.hosts }}\n    - host: {{ .host | quote }}\n      http:\n        paths:\n          {{- range .paths }}\n          - path: {{ .path }}\n            pathType: {{ .pathType }}\n            backend:\n              service:\n                name: {{ include "myapp.fullname" $ }}\n                port:\n                  number: {{ $.Values.service.port }}\n          {{- end }}\n    {{- end }}\n{{- end }}' },
        { type: 'tip', value: 'Используйте helm template myapp ./myapp для локального рендеринга шаблонов без подключения к кластеру. Это отличный способ отладки.' }
      ]
    },
    {
      id: 4,
      title: 'Зависимости Chart',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Управление зависимостями' },
        { type: 'text', value: 'Helm charts могут зависеть от других charts. Например, ваше приложение зависит от PostgreSQL и Redis. Зависимости объявляются в Chart.yaml и скачиваются в директорию charts/.' },
        { type: 'code', language: 'yaml', value: '# Chart.yaml с зависимостями\napiVersion: v2\nname: myapp\nversion: 0.1.0\nappVersion: "1.0.0"\n\ndependencies:\n  - name: postgresql\n    version: "13.x.x"\n    repository: "https://charts.bitnami.com/bitnami"\n    condition: postgresql.enabled\n  - name: redis\n    version: "18.x.x"\n    repository: "https://charts.bitnami.com/bitnami"\n    condition: redis.enabled\n  - name: common\n    version: "2.x.x"\n    repository: "https://charts.bitnami.com/bitnami"\n    tags:\n      - common' },
        { type: 'code', language: 'bash', value: '# Скачивание зависимостей\nhelm dependency update ./myapp\n\n# Результат: charts/ содержит .tgz файлы\nls myapp/charts/\n# postgresql-13.4.1.tgz  redis-18.6.1.tgz  common-2.13.3.tgz\n\n# Построение зависимостей\nhelm dependency build ./myapp\n\n# Просмотр зависимостей\nhelm dependency list ./myapp' },
        { type: 'heading', value: 'Настройка зависимостей через values' },
        { type: 'code', language: 'yaml', value: '# values.yaml — настройка subchart\npostgresql:\n  enabled: true\n  auth:\n    database: myapp\n    username: myapp\n    password: secret123\n  primary:\n    persistence:\n      size: 10Gi\n    resources:\n      requests:\n        cpu: 250m\n        memory: 256Mi\n\nredis:\n  enabled: true\n  architecture: standalone\n  auth:\n    enabled: true\n    password: redis-secret\n  master:\n    persistence:\n      size: 5Gi' },
        { type: 'heading', value: 'Переопределение values для разных окружений' },
        { type: 'code', language: 'bash', value: '# Файлы values для разных окружений\nvalues-dev.yaml\nvalues-staging.yaml\nvalues-prod.yaml\n\n# Установка с объединением файлов\nhelm install myapp ./myapp \\\n  -f values.yaml \\\n  -f values-prod.yaml \\\n  --namespace production\n\n# values-prod.yaml переопределяет values.yaml\n# Приоритет: values.yaml < values-prod.yaml < --set флаги' },
        { type: 'code', language: 'yaml', value: '# values-prod.yaml\nreplicaCount: 5\n\nimage:\n  tag: "v2.1.0"\n\nresources:\n  limits:\n    cpu: 1000m\n    memory: 512Mi\n  requests:\n    cpu: 500m\n    memory: 256Mi\n\npostgresql:\n  primary:\n    persistence:\n      size: 50Gi\n    resources:\n      requests:\n        cpu: 1000m\n        memory: 1Gi' },
        { type: 'note', value: 'Условие condition: postgresql.enabled позволяет включать/выключать зависимость через values. Это полезно для разработки, где БД может быть локальной.' }
      ]
    },
    {
      id: 5,
      title: 'Helm Hooks и тестирование',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Helm Hooks' },
        { type: 'text', value: 'Hooks позволяют выполнять действия на определённых этапах жизненного цикла release: перед установкой, после обновления, при удалении и т.д. Это полезно для миграций БД, бэкапов, проверок.' },
        { type: 'code', language: 'yaml', value: '# templates/pre-upgrade-job.yaml — миграция БД перед обновлением\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: {{ include "myapp.fullname" . }}-db-migrate\n  annotations:\n    "helm.sh/hook": pre-upgrade,pre-install\n    "helm.sh/hook-weight": "-5"\n    "helm.sh/hook-delete-policy": before-hook-creation\nspec:\n  template:\n    spec:\n      restartPolicy: Never\n      containers:\n        - name: migrate\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n          command: ["python", "manage.py", "migrate"]\n          env:\n            - name: DATABASE_URL\n              valueFrom:\n                secretKeyRef:\n                  name: {{ include "myapp.fullname" . }}-secret\n                  key: database-url\n  backoffLimit: 3' },
        { type: 'list', items: [
          'pre-install — перед установкой ресурсов',
          'post-install — после установки всех ресурсов',
          'pre-upgrade — перед обновлением ресурсов',
          'post-upgrade — после обновления',
          'pre-delete — перед удалением release',
          'post-delete — после удаления',
          'pre-rollback — перед откатом',
          'post-rollback — после отката'
        ] },
        { type: 'heading', value: 'Тестирование Chart' },
        { type: 'code', language: 'yaml', value: '# templates/tests/test-connection.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: "{{ include "myapp.fullname" . }}-test-connection"\n  annotations:\n    "helm.sh/hook": test\nspec:\n  restartPolicy: Never\n  containers:\n    - name: wget\n      image: busybox\n      command: ["wget"]\n      args: ["{{ include \"myapp.fullname\" . }}:{{ .Values.service.port }}/health"]' },
        { type: 'code', language: 'bash', value: '# Запуск тестов\nhelm test my-release\n\n# Линтинг chart\nhelm lint ./myapp\nhelm lint ./myapp -f values-prod.yaml\n\n# Проверка рендеринга шаблонов\nhelm template my-release ./myapp --debug\n\n# Dry-run перед установкой\nhelm install my-release ./myapp --dry-run --debug\n\n# Упаковка chart для публикации\nhelm package ./myapp\n# Результат: myapp-0.1.0.tgz\n\n# Публикация в OCI registry\nhelm push myapp-0.1.0.tgz oci://ghcr.io/company/charts' },
        { type: 'heading', value: 'NOTES.txt — сообщение после установки' },
        { type: 'code', language: 'yaml', value: '# templates/NOTES.txt\n1. Приложение доступно по адресу:\n{{- if .Values.ingress.enabled }}\n  {{- range .Values.ingress.hosts }}\n  http{{ if $.Values.ingress.tls }}s{{ end }}://{{ .host }}\n  {{- end }}\n{{- else }}\n  kubectl port-forward svc/{{ include "myapp.fullname" . }} 8080:{{ .Values.service.port }}\n  Затем откройте http://localhost:8080\n{{- end }}\n\n2. Проверить статус:\n  kubectl get pods -l app.kubernetes.io/instance={{ .Release.Name }}' },
        { type: 'tip', value: 'hook-weight определяет порядок выполнения hooks (меньшие значения выполняются первыми). hook-delete-policy: before-hook-creation удаляет предыдущий Job перед созданием нового.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание Helm Chart',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Helm Chart для веб-приложения с зависимостью от PostgreSQL, настраиваемыми values и pre-upgrade hook для миграций.',
      requirements: [
        'Создайте chart с помощью helm create',
        'Настройте Deployment с параметрами из values.yaml (image, replicas, resources)',
        'Добавьте зависимость PostgreSQL из bitnami репозитория',
        'Создайте pre-upgrade hook для запуска миграций БД',
        'Создайте values-dev.yaml и values-prod.yaml с разными настройками',
        'Проведите линтинг и dry-run установку'
      ],
      hint: 'Начните с helm create myapp, затем отредактируйте values.yaml и шаблоны. Для зависимости добавьте postgresql в Chart.yaml и выполните helm dependency update.',
      expectedOutput: 'helm lint ./myapp => 0 errors\nhelm template myapp ./myapp -f values-prod.yaml => валидные YAML-манифесты\nhelm install myapp ./myapp --dry-run => корректный вывод с NOTES.txt',
      solution: '# 1. Создание chart\nhelm create myapp\n\n# 2. Редактирование Chart.yaml — добавление зависимости\n# dependencies:\n#   - name: postgresql\n#     version: "13.x.x"\n#     repository: "https://charts.bitnami.com/bitnami"\n#     condition: postgresql.enabled\n\n# 3. Обновление values.yaml\n# replicaCount: 2\n# image:\n#   repository: ghcr.io/company/myapp\n#   tag: "1.0.0"\n# postgresql:\n#   enabled: true\n#   auth:\n#     database: myapp\n#     username: myapp\n\n# 4. Создание hook: templates/pre-upgrade-job.yaml\n# apiVersion: batch/v1\n# kind: Job\n# metadata:\n#   name: {{ include "myapp.fullname" . }}-migrate\n#   annotations:\n#     "helm.sh/hook": pre-upgrade,pre-install\n#     "helm.sh/hook-delete-policy": before-hook-creation\n\n# 5. values-prod.yaml\n# replicaCount: 5\n# resources:\n#   limits: { cpu: 1000m, memory: 512Mi }\n\n# 6. Проверка\nhelm dependency update ./myapp\nhelm lint ./myapp\nhelm template myapp ./myapp -f values-prod.yaml\nhelm install myapp ./myapp --dry-run --debug',
      explanation: 'Helm Chart позволяет упаковать все Kubernetes-ресурсы в один пакет с настраиваемыми параметрами. Зависимости автоматически устанавливаются вместе с основным chart. Hooks выполняют задачи на определённых этапах жизненного цикла (например, миграция БД перед обновлением).'
    }
  ]
}
