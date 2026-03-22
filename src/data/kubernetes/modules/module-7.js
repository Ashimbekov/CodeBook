export default {
  id: 7,
  title: 'Volumes: emptyDir, hostPath, PV, PVC, StorageClass',
  description: 'Постоянное хранилище данных в Kubernetes: от временных томов до динамического provisioning',
  lessons: [
    {
      id: 1,
      title: 'emptyDir: временное хранилище',
      type: 'theory',
      content: [
        { type: 'text', value: 'emptyDir создаётся пустым при запуске Pod и удаляется когда Pod удаляется. Существует пока Pod запущен. Идеален для временных файлов и обмена данными между контейнерами в Pod.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: emptydir-demo\nspec:\n  volumes:\n  - name: cache-volume\n    emptyDir: {}  # хранится в RAM при medium: Memory\n  - name: ram-volume\n    emptyDir:\n      medium: Memory  # хранится в tmpfs (RAM)\n      sizeLimit: 128Mi\n  containers:\n  - name: writer\n    image: busybox\n    command: [\'sh\', \'-c\', \'while true; do date >> /cache/log.txt; sleep 1; done\']\n    volumeMounts:\n    - name: cache-volume\n      mountPath: /cache\n  - name: reader\n    image: busybox\n    command: [\'sh\', \'-c\', \'tail -f /data/log.txt\']\n    volumeMounts:\n    - name: cache-volume\n      mountPath: /data' },
        { type: 'list', items: [
          'Используется для обмена файлами между контейнерами в Pod',
          'Для временного кэша или рабочих файлов',
          'medium: Memory — хранение в RAM (быстро, но занимает память)',
          'Данные теряются при удалении Pod (не при рестарте контейнера!)'
        ]}
      ]
    },
    {
      id: 2,
      title: 'hostPath: монтирование директории узла',
      type: 'theory',
      content: [
        { type: 'text', value: 'hostPath монтирует директорию с хост-машины (узла) в контейнер. Данные сохраняются между рестартами Pod, но привязаны к конкретному узлу.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: hostpath-demo\nspec:\n  volumes:\n  - name: host-logs\n    hostPath:\n      path: /var/log/app    # путь на узле\n      type: DirectoryOrCreate  # создать если не существует\n  containers:\n  - name: app\n    image: nginx\n    volumeMounts:\n    - name: host-logs\n      mountPath: /var/log/nginx' },
        { type: 'heading', value: 'Типы hostPath' },
        { type: 'list', items: [
          'Directory — директория должна существовать',
          'DirectoryOrCreate — создать если не существует',
          'File — файл должен существовать',
          'FileOrCreate — создать если не существует',
          'Socket — Unix-сокет должен существовать',
          'CharDevice, BlockDevice — специальные файлы устройств'
        ]},
        { type: 'warning', value: 'hostPath опасен в продакшене: Pod привязывается к конкретному узлу, нет изоляции (контейнер может читать системные файлы). Используйте только для системных DaemonSet (мониторинг, логирование).' }
      ]
    },
    {
      id: 3,
      title: 'PersistentVolume и PersistentVolumeClaim',
      type: 'theory',
      content: [
        { type: 'text', value: 'PersistentVolume (PV) — это кусок хранилища в кластере, созданный администратором или динамически. PersistentVolumeClaim (PVC) — запрос пользователя на хранилище. Абстракция разделяет администраторов и разработчиков.' },
        { type: 'heading', value: 'Создание PV (статически)' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: PersistentVolume\nmetadata:\n  name: my-pv\nspec:\n  capacity:\n    storage: 10Gi\n  accessModes:\n  - ReadWriteOnce    # RWO: один узел читает/пишет\n  # - ReadOnlyMany   # ROX: несколько узлов читают\n  # - ReadWriteMany  # RWX: несколько узлов читают/пишут\n  persistentVolumeReclaimPolicy: Retain  # сохранить данные после удаления PVC\n  storageClassName: standard\n  hostPath:\n    path: /data/my-pv  # для тестирования, в продакшене — NFS, cloud disk' },
        { type: 'heading', value: 'Создание PVC' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: my-pvc\nspec:\n  accessModes:\n  - ReadWriteOnce\n  storageClassName: standard\n  resources:\n    requests:\n      storage: 5Gi  # запрос на 5Gi из PV 10Gi' }
      ]
    },
    {
      id: 4,
      title: 'StorageClass и динамический provisioning',
      type: 'theory',
      content: [
        { type: 'text', value: 'StorageClass позволяет динамически создавать PV при создании PVC. Не нужно заранее создавать PV — Kubernetes создаст хранилище автоматически через provisioner (AWS EBS, GCE PD, NFS и др.).' },
        { type: 'code', language: 'yaml', value: 'apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: fast-ssd\n  annotations:\n    storageclass.kubernetes.io/is-default-class: "true"  # StorageClass по умолчанию\nprovisioner: kubernetes.io/aws-ebs  # или docker.io/hostpath для minikube\nparameters:\n  type: gp3\n  fsType: ext4\nreclaimPolicy: Delete  # удалить PV при удалении PVC\nvolumeBindingMode: WaitForFirstConsumer  # создать только когда Pod будет запланирован' },
        { type: 'heading', value: 'Использование PVC в Pod' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: app-with-storage\nspec:\n  volumes:\n  - name: app-data\n    persistentVolumeClaim:\n      claimName: my-pvc\n  containers:\n  - name: app\n    image: my-app\n    volumeMounts:\n    - name: app-data\n      mountPath: /data' },
        { type: 'tip', value: 'В minikube есть встроенный StorageClass "standard" с provisioner hostpath. Для продакшена используйте cloud-specific provisioner или Rook/Ceph для bare-metal.' }
      ]
    },
    {
      id: 5,
      title: 'Access Modes и Reclaim Policy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Access Modes определяют, как хранилище может быть смонтировано. Reclaim Policy определяет, что произойдёт с PV когда PVC удаляется.' },
        { type: 'heading', value: 'Access Modes' },
        { type: 'list', items: [
          'ReadWriteOnce (RWO) — только один узел читает и пишет. Для большинства баз данных.',
          'ReadOnlyMany (ROX) — несколько узлов только читают. Для статических файлов.',
          'ReadWriteMany (RWX) — несколько узлов читают и пишут. NFS, CephFS, Azure Files.',
          'ReadWriteOncePod (RWOP) — K8s 1.22+, только один Pod читает и пишет'
        ]},
        { type: 'heading', value: 'Reclaim Policy' },
        { type: 'list', items: [
          'Retain — PV остаётся после удаления PVC, данные сохранены, нужна ручная очистка',
          'Delete — PV и данные удаляются автоматически (по умолчанию для динамических PV)',
          'Recycle — устарело, использовало rm -rf на данных'
        ]},
        { type: 'heading', value: 'Жизненный цикл PV' },
        { type: 'list', items: [
          'Available — PV создан, ещё не привязан к PVC',
          'Bound — PV привязан к PVC',
          'Released — PVC удалён, данные ещё на PV (только при Retain)',
          'Failed — автоматическое освобождение не удалось'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Практика: Persistent Storage для базы данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте PostgreSQL с постоянным хранилищем через PVC. Убедитесь что данные сохраняются между перезапусками.',
      requirements: [
        'Создать PVC для данных PostgreSQL',
        'Создать Deployment PostgreSQL с PVC',
        'Создать базу данных и добавить данные',
        'Перезапустить Pod и проверить что данные сохранились',
        'Изучить статус PV и PVC'
      ],
      hint: 'После kubectl delete pod PostgreSQL Deployment создаст новый Pod с тем же PVC. Данные должны сохраниться. Используйте kubectl exec для работы с psql.',
      expectedOutput: 'kubectl get pvc:\nNAME           STATUS   VOLUME            CAPACITY   ACCESS MODES\npostgres-pvc   Bound    pvc-abc123        5Gi        RWO\n\nПосле удаления Pod и создания нового:\nSELECT * FROM test;\n id |    name\n----+------------\n  1 | Kubernetes\n(1 row)\n\nДанные сохранились! PVC привязан к тому же PV после пересоздания Pod.',
      solution: '# postgres-storage.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: postgres-pvc\nspec:\n  accessModes:\n  - ReadWriteOnce\n  resources:\n    requests:\n      storage: 5Gi\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: postgres-secret\ntype: Opaque\nstringData:\n  POSTGRES_PASSWORD: mysecretpassword\n  POSTGRES_DB: myapp\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: postgres\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      volumes:\n      - name: postgres-data\n        persistentVolumeClaim:\n          claimName: postgres-pvc\n      containers:\n      - name: postgres\n        image: postgres:15\n        envFrom:\n        - secretRef:\n            name: postgres-secret\n        volumeMounts:\n        - name: postgres-data\n          mountPath: /var/lib/postgresql/data\n        ports:\n        - containerPort: 5432\n\nkubectl apply -f postgres-storage.yaml\n\n# Дождаться запуска\nkubectl wait --for=condition=ready pod -l app=postgres --timeout=60s\n\n# Создать таблицу и данные\nkubectl exec deploy/postgres -- psql -U postgres -d myapp -c "CREATE TABLE test (id SERIAL, name TEXT);"\nkubectl exec deploy/postgres -- psql -U postgres -d myapp -c "INSERT INTO test (name) VALUES (\'Kubernetes\');"\n\n# Удалить Pod (Deployment создаст новый)\nkubectl delete pod -l app=postgres\n\n# Дождаться нового Pod\nkubectl wait --for=condition=ready pod -l app=postgres --timeout=60s\n\n# Данные сохранились!\nkubectl exec deploy/postgres -- psql -U postgres -d myapp -c "SELECT * FROM test;"\n\n# Статус PVC и PV\nkubectl get pvc\nkubectl get pv',
      explanation: 'PVC обеспечивает постоянное хранение данных независимо от жизненного цикла Pod. Даже если Pod удалён и создан заново (тот же или другой узел), данные в PVC сохраняются. PV — фактическое хранилище, PVC — запрос на его использование.'
    },
    {
      id: 7,
      title: 'Практика: StorageClass и динамическое создание',
      type: 'practice',
      difficulty: 'medium',
      description: 'Исследуйте StorageClass в minikube, создайте PVC и убедитесь в динамическом создании PV.',
      requirements: [
        'Изучить доступные StorageClass',
        'Создать PVC без явного указания StorageClass',
        'Убедиться что PV создался автоматически',
        'Использовать PVC в Pod',
        'Удалить PVC и проверить что PV удалился'
      ],
      hint: 'minikube использует StorageClass standard по умолчанию. kubectl get sc покажет доступные классы. После создания PVC посмотрите kubectl get pv.',
      expectedOutput: 'kubectl get storageclass:\nNAME                 PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE\nstandard (default)   k8s.io/minikube-hostpath   Delete          Immediate\n\nkubectl get pvc dynamic-pvc (после создания Pod):\nNAME          STATUS   VOLUME         CAPACITY\ndynamic-pvc   Bound    pvc-xyz789     1Gi\n\nkubectl get pv:\nNAME          CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS\npvc-xyz789    1Gi        RWO            Delete           Bound\n\nПосле удаления PVC:\nkubectl get pv — PV исчез (ReclaimPolicy: Delete).',
      solution: '# Изучить StorageClass\nkubectl get storageclass\nkubectl describe storageclass standard\n\n# Создать PVC (использует StorageClass по умолчанию)\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: dynamic-pvc\nspec:\n  accessModes:\n  - ReadWriteOnce\n  resources:\n    requests:\n      storage: 1Gi\nEOF\n\n# PVC в Pending пока не подключён Pod\nkubectl get pvc dynamic-pvc\n\n# Использовать в Pod\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Pod\nmetadata:\n  name: storage-test\nspec:\n  volumes:\n  - name: data\n    persistentVolumeClaim:\n      claimName: dynamic-pvc\n  containers:\n  - name: test\n    image: busybox\n    command: [\'sleep\', \'3600\']\n    volumeMounts:\n    - name: data\n      mountPath: /data\nEOF\n\n# PV создался автоматически\nkubectl get pv\nkubectl get pvc\n\n# Записать данные\nkubectl exec storage-test -- sh -c "echo hello > /data/test.txt"\n\n# Удалить Pod и PVC\nkubectl delete pod storage-test\nkubectl delete pvc dynamic-pvc\n\n# PV удалился (ReclaimPolicy: Delete)\nkubectl get pv',
      explanation: 'StorageClass с динамическим provisioner создаёт PV автоматически при создании PVC. volumeBindingMode: WaitForFirstConsumer откладывает создание PV до момента создания Pod — это важно для зонального хранилища. После удаления PVC с политикой Delete данные удаляются.'
    }
  ]
}
