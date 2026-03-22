export default {
  id: 14,
  title: 'Helm: менеджер пакетов для Kubernetes',
  description: 'Управление Kubernetes приложениями через Helm: charts, values, templates, hooks и репозитории',
  lessons: [
    {
      id: 1,
      title: 'Что такое Helm?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Helm — это менеджер пакетов для Kubernetes. Как apt для Ubuntu или pip для Python. Helm упаковывает Kubernetes ресурсы в "чарты" (charts) и управляет их установкой, обновлением и удалением.' },
        { type: 'heading', value: 'Зачем Helm?' },
        { type: 'list', items: [
          'Повторное использование: чарт описывает приложение, installs настраиваются через values',
          'Версионирование: можно откатиться к предыдущей версии release',
          'Шаблонизация: DRY принцип, одни templates, разные values для dev/prod',
          'Зависимости: чарт может зависеть от других чартов (PostgreSQL, Redis)',
          'Комьюнити: Artifact Hub содержит тысячи готовых чартов'
        ]},
        { type: 'code', language: 'bash', value: '# Установка Helm\ncurl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash\n\n# Или через пакетный менеджер\nbrew install helm  # macOS\nchoco install kubernetes-helm  # Windows\n\n# Проверить версию\nhelm version\n\n# Добавить репозиторий\nhelm repo add stable https://charts.helm.sh/stable\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\n\n# Поиск чартов\nhelm search repo nginx\nhelm search hub postgres' }
      ]
    },
    {
      id: 2,
      title: 'Структура Helm Chart',
      type: 'theory',
      content: [
        { type: 'text', value: 'Helm Chart — это директория с определённой структурой файлов. Chart описывает Kubernetes приложение как набор шаблонов и значений.' },
        { type: 'code', language: 'bash', value: 'my-chart/\n  Chart.yaml          # Метаданные чарта (имя, версия, описание)\n  values.yaml         # Значения по умолчанию\n  values.schema.json  # Схема для валидации values (опционально)\n  charts/             # Зависимости (sub-charts)\n  templates/          # Kubernetes YAML шаблоны\n    deployment.yaml\n    service.yaml\n    ingress.yaml\n    configmap.yaml\n    _helpers.tpl        # Вспомогательные шаблоны\n    NOTES.txt          # Инструкции после установки\n  .helmignore         # Исключения (как .gitignore)' },
        { type: 'code', language: 'yaml', value: '# Chart.yaml\napiVersion: v2\nname: my-app\ndescription: My application Helm chart\ntype: application\nversion: 1.0.0        # версия чарта\nappVersion: "2.1.0"   # версия приложения\ndependencies:\n- name: postgresql\n  version: "12.x.x"\n  repository: https://charts.bitnami.com/bitnami\n  condition: postgresql.enabled' }
      ]
    },
    {
      id: 3,
      title: 'Values и шаблоны',
      type: 'theory',
      content: [
        { type: 'text', value: 'values.yaml содержит значения по умолчанию. Шаблоны в templates/ используют синтаксис Go template и функции Helm Sprig.' },
        { type: 'code', language: 'yaml', value: '# values.yaml\nreplicaCount: 2\nimage:\n  repository: nginx\n  tag: "1.21"\n  pullPolicy: IfNotPresent\nservice:\n  type: ClusterIP\n  port: 80\ningress:\n  enabled: false\n  host: myapp.example.com\nresources:\n  limits:\n    cpu: 200m\n    memory: 256Mi\n  requests:\n    cpu: 100m\n    memory: 128Mi\nenv:\n  APP_ENV: production' },
        { type: 'code', language: 'yaml', value: '# templates/deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include "my-app.fullname" . }}\n  labels:\n    {{- include "my-app.labels" . | nindent 4 }}\nspec:\n  replicas: {{ .Values.replicaCount }}\n  selector:\n    matchLabels:\n      {{- include "my-app.selectorLabels" . | nindent 6 }}\n  template:\n    metadata:\n      labels:\n        {{- include "my-app.selectorLabels" . | nindent 8 }}\n    spec:\n      containers:\n      - name: {{ .Chart.Name }}\n        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n        imagePullPolicy: {{ .Values.image.pullPolicy }}\n        ports:\n        - containerPort: {{ .Values.service.port }}\n        {{- if .Values.resources }}\n        resources:\n          {{- toYaml .Values.resources | nindent 10 }}\n        {{- end }}' },
        { type: 'tip', value: 'Используйте helm template . для просмотра итогового YAML без установки в кластер. helm lint . проверяет корректность чарта.' }
      ]
    },
    {
      id: 4,
      title: 'Установка, обновление и откат',
      type: 'theory',
      content: [
        { type: 'text', value: 'helm install создаёт release — конкретный экземпляр установленного чарта. Release имеет имя, версию и хранит историю для возможности отката.' },
        { type: 'code', language: 'bash', value: '# Установка чарта из репозитория\nhelm install my-nginx bitnami/nginx\n\n# Установка с переопределением values\nhelm install my-nginx bitnami/nginx \\\n  --set replicaCount=3 \\\n  --set service.type=NodePort\n\n# Установка с values файлом\nhelm install my-app ./my-chart -f prod-values.yaml\n\n# Установка в namespace\nhelm install my-app ./my-chart -n production --create-namespace\n\n# Список установленных release\nhelm list\nhelm list -A  # все namespace\n\n# Обновление release\nhelm upgrade my-nginx bitnami/nginx --set replicaCount=5\n\n# Установить или обновить (если уже существует)\nhelm upgrade --install my-app ./my-chart -f values.yaml\n\n# История release\nhelm history my-nginx\n\n# Откат\nhelm rollback my-nginx 1  # к ревизии 1\nhelm rollback my-nginx    # к предыдущей\n\n# Удаление\nhelm uninstall my-nginx' }
      ]
    },
    {
      id: 5,
      title: 'Hooks: жизненный цикл Chart',
      type: 'theory',
      content: [
        { type: 'text', value: 'Helm Hooks позволяют выполнять действия в определённые моменты жизненного цикла release: перед установкой, после установки, перед удалением и т.д.' },
        { type: 'list', items: [
          'pre-install — до создания ресурсов (инициализация БД)',
          'post-install — после создания ресурсов (отправка уведомления)',
          'pre-upgrade — до обновления (бэкап)',
          'post-upgrade — после обновления (прогрев кэша)',
          'pre-delete — до удаления (сохранение данных)',
          'post-delete — после удаления (очистка)',
          'pre-rollback, post-rollback — до/после отката'
        ]},
        { type: 'code', language: 'yaml', value: '# templates/db-migrate-job.yaml\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: {{ include "my-app.fullname" . }}-migrate\n  annotations:\n    "helm.sh/hook": pre-upgrade,pre-install\n    "helm.sh/hook-weight": "-5"    # порядок выполнения\n    "helm.sh/hook-delete-policy": hook-succeeded  # удалить после успеха\nspec:\n  template:\n    spec:\n      restartPolicy: OnFailure\n      containers:\n      - name: migrate\n        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n        command: [\'python\', \'manage.py\', \'migrate\']' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание собственного Helm Chart',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Helm Chart для простого веб-приложения с Deployment, Service и Ingress.',
      requirements: [
        'Создать структуру Helm Chart',
        'Написать шаблон Deployment с values',
        'Написать шаблон Service',
        'Добавить conditions для включения/выключения Ingress',
        'Установить chart и проверить работу',
        'Обновить с другими values и откатить'
      ],
      hint: 'helm create my-chart создаёт стартовый шаблон. Изучите его структуру и адаптируйте под своё приложение.',
      expectedOutput: 'helm install my-webapp ./webapp:\nNAME: my-webapp\nLAST DEPLOYED: Thu Mar 21 10:00:00 2026\nSTATUS: deployed\nREVISION: 1\n\nkubectl get all -l app.kubernetes.io/instance=my-webapp:\nNAME                           READY   STATUS\npod/my-webapp-xxx-1            1/1     Running\npod/my-webapp-xxx-2            1/1     Running\n\nhelm history my-webapp:\nREVISION  STATUS     DESCRIPTION\n1         superseded install complete\n2         deployed   Upgrade complete\n\nПосле helm rollback my-webapp 1: replicaCount вернулся к 2.',
      solution: '# Создать структуру чарта\nhelm create webapp\ncd webapp\n\n# Отредактировать values.yaml:\ncat > values.yaml << \'YAML\'\nreplicaCount: 2\nimage:\n  repository: hashicorp/http-echo\n  tag: latest\n  args: [\'-text=Hello from Helm!\']\nservice:\n  type: ClusterIP\n  port: 80\n  targetPort: 5678\ningress:\n  enabled: false\nresources:\n  limits:\n    cpu: 100m\n    memory: 64Mi\nYAML\n\n# Проверить шаблоны\nhelm template ./webapp\n\n# Установить\nhelm install my-webapp ./webapp\n\n# Проверить\nkubectl get all -l app.kubernetes.io/instance=my-webapp\n\n# Обновить с 3 репликами\nhelm upgrade my-webapp ./webapp --set replicaCount=3\n\n# История\nhelm history my-webapp\n\n# Откат\nhelm rollback my-webapp 1\n\n# Установить с prod values\nhelm upgrade --install my-webapp ./webapp \\\n  --set replicaCount=5 \\\n  --set image.tag=v2.0.0 \\\n  --set ingress.enabled=true\n\n# Удалить\nhelm uninstall my-webapp',
      explanation: 'Helm Chart шаблонизирует Kubernetes манифесты, позволяя переиспользовать их с разными конфигурациями. values.yaml содержит дефолты, --set или -f переопределяют для конкретной среды. helm history и helm rollback обеспечивают версионирование deployments.'
    },
    {
      id: 7,
      title: 'Практика: Установка готовых чартов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Установите PostgreSQL и Redis из Bitnami репозитория, настройте их через values.',
      requirements: [
        'Добавить Bitnami репозиторий',
        'Установить PostgreSQL с кастомными values',
        'Установить Redis в режиме standalone',
        'Проверить подключение к обоим сервисам',
        'Обновить и откатить PostgreSQL'
      ],
      hint: 'helm show values bitnami/postgresql покажет все доступные параметры. Используйте helm show chart для метаданных чарта.',
      expectedOutput: 'helm list:\nNAME          NAMESPACE  REVISION  STATUS    CHART\nmy-postgres   default    1         deployed  postgresql-13.x.x\nmy-redis      default    1         deployed  redis-18.x.x\n\nkubectl get pods:\nNAME                         READY   STATUS\nmy-postgres-postgresql-0     1/1     Running\nmy-redis-master-0            1/1     Running\n\nПодключение к PostgreSQL:\npsql -U postgres -d myapp\npsql (15.x)\nType "help" for help.\nmyapp=#',
      solution: '# Добавить репозиторий\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update\n\n# Просмотреть доступные values\nhelm show values bitnami/postgresql | head -50\n\n# Установить PostgreSQL\nhelm install my-postgres bitnami/postgresql \\\n  --set auth.postgresPassword=mysecret \\\n  --set auth.database=myapp \\\n  --set primary.persistence.size=2Gi\n\n# Установить Redis\nhelm install my-redis bitnami/redis \\\n  --set architecture=standalone \\\n  --set auth.enabled=false\n\n# Проверить запуск\nkubectl get pods\nkubectl get pvc\n\n# Подключиться к PostgreSQL\nkubectl exec -it my-postgres-postgresql-0 -- psql -U postgres -d myapp\n\n# Список установленного\nhelm list\nhelm status my-postgres\n\n# Обновить PostgreSQL\nhelm upgrade my-postgres bitnami/postgresql \\\n  --set auth.postgresPassword=mysecret \\\n  --set primary.resources.limits.cpu=200m\n\n# Откат\nhelm rollback my-postgres 1',
      explanation: 'Bitnami предоставляет качественные production-ready чарты. helm show values позволяет увидеть все настраиваемые параметры. Установка через Helm управляет всеми зависимыми ресурсами (StatefulSet, Service, PVC, ConfigMap, Secret) как единым целым.'
    }
  ]
}
