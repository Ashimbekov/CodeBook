export default {
  id: 34,
  title: 'Kubernetes Operators',
  description: 'Operator pattern расширяет Kubernetes для автоматизации управления сложными приложениями через Custom Resource Definitions и контроллеры.',
  lessons: [
    {
      id: 1,
      title: 'Operator Pattern',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Kubernetes Operator?' },
        { type: 'text', value: 'Operator — это расширение Kubernetes, которое кодифицирует операционные знания об управлении приложением. Operator автоматизирует задачи, которые обычно выполняет человек: установка, масштабирование, бэкап, обновление, восстановление после сбоев.' },
        { type: 'code', language: 'bash', value: '# Без Operator (ручное управление PostgreSQL):\n# 1. kubectl apply -f postgres-deployment.yaml\n# 2. Настроить replication вручную\n# 3. Настроить бэкапы через cron\n# 4. При сбое — ручное failover\n# 5. Обновление — ручное, с downtime\n\n# С Operator (автоматическое управление):\n# 1. kubectl apply -f postgres-cluster.yaml\n#    (Operator делает всё остальное)\n# - Автоматическая настройка replication\n# - Автоматические бэкапы по расписанию\n# - Автоматический failover при сбое\n# - Rolling update без downtime\n# - Мониторинг и алерты' },
        { type: 'heading', value: 'Компоненты Operator' },
        { type: 'list', items: [
          'Custom Resource Definition (CRD) — определяет новый тип ресурса в Kubernetes API',
          'Custom Resource (CR) — экземпляр CRD, описывающий желаемое состояние',
          'Controller — наблюдает за CR и приводит реальное состояние к желаемому',
          'Reconciliation Loop — цикл: наблюдение -> сравнение -> действие'
        ] },
        { type: 'code', language: 'bash', value: '# Reconciliation Loop (цикл согласования):\n#\n# 1. OBSERVE: Контроллер наблюдает за Custom Resource\n#    (kubectl apply -f postgres-cluster.yaml)\n#\n# 2. DIFF: Сравнивает желаемое состояние (CR) с текущим\n#    (Нужно 3 реплики, есть 2 -> нужно создать ещё 1)\n#\n# 3. ACT: Выполняет действия для приведения к желаемому\n#    (Создаёт новый Pod, настраивает replication)\n#\n# 4. STATUS: Обновляет статус CR\n#    (status.readyReplicas: 3, status.phase: Running)\n#\n# 5. Повторяет цикл при любом изменении' },
        { type: 'tip', value: 'Operator Hub (operatorhub.io) содержит 300+ готовых operators для PostgreSQL, Redis, Kafka, Elasticsearch, Prometheus и других приложений. Перед написанием своего — проверьте, есть ли готовый.' }
      ]
    },
    {
      id: 2,
      title: 'Custom Resource Definitions',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Создание CRD' },
        { type: 'text', value: 'CRD расширяет Kubernetes API новыми типами ресурсов. После создания CRD вы можете использовать kubectl для создания, обновления и удаления Custom Resources так же, как встроенные ресурсы (Pods, Services).' },
        { type: 'code', language: 'yaml', value: '# CRD для PostgreSQL кластера\napiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition\nmetadata:\n  name: postgresclusters.database.example.com\nspec:\n  group: database.example.com\n  versions:\n    - name: v1\n      served: true\n      storage: true\n      schema:\n        openAPIV3Schema:\n          type: object\n          properties:\n            spec:\n              type: object\n              required: [\"replicas\", \"version\"]\n              properties:\n                replicas:\n                  type: integer\n                  minimum: 1\n                  maximum: 10\n                version:\n                  type: string\n                  enum: [\"14\", \"15\", \"16\"]\n                storage:\n                  type: object\n                  properties:\n                    size:\n                      type: string\n                      default: \"10Gi\"\n                backup:\n                  type: object\n                  properties:\n                    schedule:\n                      type: string\n                    retention:\n                      type: integer\n                      default: 7\n            status:\n              type: object\n              properties:\n                phase:\n                  type: string\n                readyReplicas:\n                  type: integer\n      subresources:\n        status: {}\n      additionalPrinterColumns:\n        - name: Replicas\n          type: integer\n          jsonPath: .spec.replicas\n        - name: Version\n          type: string\n          jsonPath: .spec.version\n        - name: Status\n          type: string\n          jsonPath: .status.phase\n  scope: Namespaced\n  names:\n    plural: postgresclusters\n    singular: postgrescluster\n    kind: PostgresCluster\n    shortNames: [\"pg\"]' },
        { type: 'heading', value: 'Custom Resource' },
        { type: 'code', language: 'yaml', value: '# Custom Resource — экземпляр PostgreSQL кластера\napiVersion: database.example.com/v1\nkind: PostgresCluster\nmetadata:\n  name: mydb\n  namespace: production\nspec:\n  replicas: 3\n  version: "16"\n  storage:\n    size: 50Gi\n  backup:\n    schedule: "0 2 * * *"  # каждый день в 2:00\n    retention: 14           # хранить 14 дней' },
        { type: 'code', language: 'bash', value: '# Работа с Custom Resources через kubectl\nkubectl apply -f postgres-cluster.yaml\nkubectl get postgresclusters   # или kubectl get pg\nkubectl describe pg mydb\nkubectl delete pg mydb\n\n# Вывод:\n# NAME   REPLICAS   VERSION   STATUS\n# mydb   3          16        Running' },
        { type: 'note', value: 'OpenAPI v3 Schema в CRD обеспечивает валидацию при создании/обновлении CR. Kubernetes отвергнет CR, не соответствующий схеме (неправильный тип, отсутствие обязательного поля).' }
      ]
    },
    {
      id: 3,
      title: 'Operator SDK',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Создание Operator с Operator SDK' },
        { type: 'text', value: 'Operator SDK от Red Hat упрощает создание operators. Поддерживает три подхода: Go (максимальная гибкость), Ansible (для ops-команд), Helm (для Helm charts). Go-based operators — самый распространённый вариант.' },
        { type: 'code', language: 'bash', value: '# Установка Operator SDK\ncurl -sSL https://github.com/operator-framework/operator-sdk/releases/latest/download/operator-sdk_linux_amd64 -o operator-sdk\nchmod +x operator-sdk && sudo mv operator-sdk /usr/local/bin/\n\n# Создание проекта\nmkdir postgres-operator && cd postgres-operator\noperator-sdk init --domain example.com --repo github.com/myorg/postgres-operator\n\n# Создание API (CRD + Controller)\noperator-sdk create api \\\n  --group database \\\n  --version v1 \\\n  --kind PostgresCluster \\\n  --resource --controller\n\n# Структура проекта:\n# ├── api/v1/\n# │   └── postgrescluster_types.go   # CRD definition\n# ├── controllers/\n# │   └── postgrescluster_controller.go # Controller logic\n# ├── config/\n# │   ├── crd/           # Generated CRD YAML\n# │   ├── rbac/          # RBAC permissions\n# │   └── manager/       # Deployment for operator\n# ├── Dockerfile\n# └── Makefile' },
        { type: 'heading', value: 'Определение типов (Go)' },
        { type: 'code', language: 'bash', value: '// api/v1/postgrescluster_types.go\n// type PostgresClusterSpec struct {\n//     Replicas int32  `json:"replicas"`\n//     Version  string `json:"version"`\n//     Storage  StorageSpec `json:"storage,omitempty"`\n//     Backup   BackupSpec  `json:"backup,omitempty"`\n// }\n//\n// type StorageSpec struct {\n//     Size string `json:"size,omitempty"`\n// }\n//\n// type BackupSpec struct {\n//     Schedule  string `json:"schedule,omitempty"`\n//     Retention int32  `json:"retention,omitempty"`\n// }\n//\n// type PostgresClusterStatus struct {\n//     Phase         string `json:"phase,omitempty"`\n//     ReadyReplicas int32  `json:"readyReplicas,omitempty"`\n// }\n//\n// type PostgresCluster struct {\n//     metav1.TypeMeta   `json:",inline"`\n//     metav1.ObjectMeta `json:"metadata,omitempty"`\n//     Spec   PostgresClusterSpec   `json:"spec,omitempty"`\n//     Status PostgresClusterStatus `json:"status,omitempty"`\n// }' },
        { type: 'code', language: 'bash', value: '# Генерация CRD и RBAC\nmake generate   # Генерирует deepcopy methods\nmake manifests  # Генерирует CRD YAML и RBAC\n\n# Установка CRD в кластер\nmake install\n\n# Запуск оператора локально (для разработки)\nmake run\n\n# Сборка и деплой оператора\nmake docker-build docker-push IMG=ghcr.io/myorg/postgres-operator:v1\nmake deploy IMG=ghcr.io/myorg/postgres-operator:v1' },
        { type: 'tip', value: 'Для быстрого прототипирования используйте Ansible-based operator. Для production с высокой производительностью — Go-based. Helm-based подходит для обёртки существующего Helm chart в operator.' }
      ]
    },
    {
      id: 4,
      title: 'Controller Logic',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Reconcile функция' },
        { type: 'text', value: 'Reconcile — главная функция контроллера. Она вызывается при каждом изменении Custom Resource и приводит реальное состояние к желаемому. Функция должна быть идемпотентной — повторный вызов с теми же параметрами даёт тот же результат.' },
        { type: 'code', language: 'bash', value: '// controllers/postgrescluster_controller.go\n// func (r *PostgresClusterReconciler) Reconcile(ctx context.Context,\n//     req ctrl.Request) (ctrl.Result, error) {\n//\n//     log := log.FromContext(ctx)\n//\n//     // 1. Получить CR\n//     var pg databasev1.PostgresCluster\n//     if err := r.Get(ctx, req.NamespacedName, &pg); err != nil {\n//         return ctrl.Result{}, client.IgnoreNotFound(err)\n//     }\n//\n//     // 2. Создать или обновить StatefulSet\n//     sts := &appsv1.StatefulSet{}\n//     sts.Name = pg.Name\n//     sts.Namespace = pg.Namespace\n//\n//     result, err := ctrl.CreateOrUpdate(ctx, r.Client, sts, func() error {\n//         sts.Spec.Replicas = &pg.Spec.Replicas\n//         sts.Spec.Template.Spec.Containers = []corev1.Container{{\n//             Name:  "postgres",\n//             Image: fmt.Sprintf("postgres:%s", pg.Spec.Version),\n//             Ports: []corev1.ContainerPort{{\n//                 ContainerPort: 5432,\n//             }},\n//         }}\n//         return ctrl.SetControllerReference(&pg, sts, r.Scheme)\n//     })\n//     if err != nil {\n//         return ctrl.Result{}, err\n//     }\n//     log.Info("StatefulSet reconciled", "result", result)\n//\n//     // 3. Обновить статус\n//     pg.Status.ReadyReplicas = sts.Status.ReadyReplicas\n//     pg.Status.Phase = "Running"\n//     if err := r.Status().Update(ctx, &pg); err != nil {\n//         return ctrl.Result{}, err\n//     }\n//\n//     // 4. Requeue через 30 секунд для периодической проверки\n//     return ctrl.Result{RequeueAfter: 30 * time.Second}, nil\n// }' },
        { type: 'heading', value: 'Owner References и Garbage Collection' },
        { type: 'code', language: 'bash', value: '// Owner Reference — связь между CR и созданными ресурсами\n// При удалении CR автоматически удаляются все дочерние ресурсы\n//\n// ctrl.SetControllerReference(&pg, sts, r.Scheme)\n// Это добавляет ownerReference в StatefulSet:\n//\n// ownerReferences:\n//   - apiVersion: database.example.com/v1\n//     kind: PostgresCluster\n//     name: mydb\n//     uid: xxx\n//     controller: true\n//     blockOwnerDeletion: true\n//\n// Теперь kubectl delete pg mydb удалит и StatefulSet\n\n// Finalizers — выполнение cleanup перед удалением\n// const finalizerName = "database.example.com/finalizer"\n//\n// if pg.DeletionTimestamp.IsZero() {\n//     // Добавить finalizer\n//     if !containsString(pg.Finalizers, finalizerName) {\n//         pg.Finalizers = append(pg.Finalizers, finalizerName)\n//         r.Update(ctx, &pg)\n//     }\n// } else {\n//     // Выполнить cleanup (бэкап перед удалением)\n//     if containsString(pg.Finalizers, finalizerName) {\n//         performBackup(pg)\n//         pg.Finalizers = removeString(pg.Finalizers, finalizerName)\n//         r.Update(ctx, &pg)\n//     }\n// }' },
        { type: 'note', value: 'Reconcile должна быть идемпотентной: повторный вызов не создаёт дубликаты ресурсов. CreateOrUpdate проверяет существование ресурса и создаёт или обновляет его.' }
      ]
    },
    {
      id: 5,
      title: 'Lifecycle и зрелость Operator',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Operator Capability Levels' },
        { type: 'text', value: 'Operator Framework определяет 5 уровней зрелости operator. Каждый уровень добавляет автоматизацию. Большинство production operators достигают Level 3-4.' },
        { type: 'list', items: [
          'Level 1: Basic Install — автоматическая установка и конфигурация',
          'Level 2: Seamless Upgrades — автоматическое обновление без downtime',
          'Level 3: Full Lifecycle — бэкап, восстановление, failover',
          'Level 4: Deep Insights — мониторинг, метрики, алерты, логирование',
          'Level 5: Auto Pilot — автоматический тюнинг, авто-масштабирование, самовосстановление'
        ] },
        { type: 'heading', value: 'Популярные production Operators' },
        { type: 'code', language: 'yaml', value: '# CloudNativePG — operator для PostgreSQL\napiVersion: postgresql.cnpg.io/v1\nkind: Cluster\nmetadata:\n  name: mydb\nspec:\n  instances: 3\n  imageName: ghcr.io/cloudnative-pg/postgresql:16\n  storage:\n    size: 50Gi\n    storageClass: gp3\n  backup:\n    barmanObjectStore:\n      destinationPath: s3://my-backups/\n      s3Credentials:\n        accessKeyId:\n          name: s3-creds\n          key: ACCESS_KEY_ID\n        secretAccessKey:\n          name: s3-creds\n          key: SECRET_ACCESS_KEY\n    retentionPolicy: \"30d\"\n  monitoring:\n    enablePodMonitor: true' },
        { type: 'code', language: 'yaml', value: '# Strimzi — operator для Apache Kafka\napiVersion: kafka.strimzi.io/v1beta2\nkind: Kafka\nmetadata:\n  name: my-cluster\nspec:\n  kafka:\n    version: 3.7.0\n    replicas: 3\n    listeners:\n      - name: plain\n        port: 9092\n        type: internal\n        tls: false\n    storage:\n      type: persistent-claim\n      size: 100Gi\n  zookeeper:\n    replicas: 3\n    storage:\n      type: persistent-claim\n      size: 50Gi' },
        { type: 'code', language: 'bash', value: '# Установка operators через OLM (Operator Lifecycle Manager)\n# OLM управляет установкой, обновлением и удалением operators\n\n# Установка OLM\ncurl -sL https://github.com/operator-framework/operator-lifecycle-manager/releases/latest/download/install.sh | bash\n\n# Установка operator из OperatorHub\nkubectl create -f https://operatorhub.io/install/prometheus.yaml\n\n# Список установленных operators\nkubectl get csv -A\nkubectl get subscriptions -A' },
        { type: 'tip', value: 'Перед написанием своего operator проверьте OperatorHub.io — там более 300 готовых operators. CloudNativePG для PostgreSQL, Strimzi для Kafka, ECK для Elasticsearch — все production-ready.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание простого Operator',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте простой Kubernetes Operator с CRD для управления веб-приложением: автоматическое создание Deployment, Service и ConfigMap.',
      requirements: [
        'Создайте CRD WebApp с полями: image, replicas, port, config',
        'Реализуйте контроллер, создающий Deployment при создании CR',
        'Добавьте автоматическое создание Service (ClusterIP)',
        'При обновлении CR (replicas, image) обновите Deployment',
        'Добавьте Owner Reference для автоматической очистки при удалении',
        'Обновляйте status CR (phase, readyReplicas, url)'
      ],
      hint: 'Используйте operator-sdk init + operator-sdk create api. Reconcile функция должна: 1) получить CR, 2) CreateOrUpdate Deployment, 3) CreateOrUpdate Service, 4) обновить Status.',
      expectedOutput: 'kubectl apply -f webapp.yaml => CR создан\nkubectl get webapps => NAME=myapp REPLICAS=3 STATUS=Running\nkubectl get deploy => myapp 3/3\nkubectl get svc => myapp ClusterIP\nkubectl delete webapp myapp => все ресурсы удалены',
      solution: '# 1. Инициализация\noperator-sdk init --domain example.com --repo github.com/myorg/webapp-operator\noperator-sdk create api --group apps --version v1 --kind WebApp --resource --controller\n\n# 2. CRD types (api/v1/webapp_types.go)\n# type WebAppSpec struct {\n#     Image    string `json:"image"`\n#     Replicas int32  `json:"replicas"`\n#     Port     int32  `json:"port"`\n# }\n# type WebAppStatus struct {\n#     Phase         string `json:"phase"`\n#     ReadyReplicas int32  `json:"readyReplicas"`\n# }\n\n# 3. Controller Reconcile:\n# - Get WebApp CR\n# - CreateOrUpdate Deployment (image, replicas, port)\n# - CreateOrUpdate Service (ClusterIP, port)\n# - SetControllerReference for both\n# - Update Status\n\n# 4. Генерация и деплой\nmake generate manifests install\nmake run  # запуск локально\n\n# 5. Тест\nkubectl apply -f config/samples/apps_v1_webapp.yaml\nkubectl get webapps\nkubectl get deploy,svc',
      explanation: 'Kubernetes Operator автоматизирует операционные задачи через контроллер, наблюдающий за Custom Resources. Reconcile loop обеспечивает, что реальное состояние кластера соответствует желаемому, описанному в CR. Owner References обеспечивают автоматическую очистку при удалении CR.'
    }
  ]
}
