export default {
  id: 11,
  title: 'StatefulSets: stateful приложения в Kubernetes',
  description: 'Развёртывание stateful приложений (базы данных, брокеры сообщений) с гарантиями порядка и постоянными идентификаторами',
  lessons: [
    {
      id: 1,
      title: 'StatefulSet vs Deployment',
      type: 'theory',
      content: [
        { type: 'text', value: 'StatefulSet предназначен для stateful приложений, которым нужны: постоянные имена Pod (pod-0, pod-1), постоянные тома (каждый Pod свой PVC), упорядоченное развёртывание и масштабирование.' },
        { type: 'heading', value: 'Отличия от Deployment' },
        { type: 'list', items: [
          'Deployment: Pod имеют случайные имена (app-7d9f-abc). StatefulSet: Pod имеют предсказуемые имена (app-0, app-1, app-2)',
          'Deployment: все Pod используют один PVC или не используют. StatefulSet: каждый Pod получает свой PVC через volumeClaimTemplates',
          'Deployment: Pod создаются и удаляются параллельно. StatefulSet: создаётся последовательно (pod-0, потом pod-1...), удаляется в обратном порядке',
          'Deployment: Pod взаимозаменяемы. StatefulSet: Pod имеют уникальные идентификаторы'
        ]},
        { type: 'tip', value: 'StatefulSet используется для: PostgreSQL, MySQL, MongoDB, Kafka, Zookeeper, Elasticsearch, Redis Cluster — любых приложений где важны идентификаторы и данные.' }
      ]
    },
    {
      id: 2,
      title: 'Headless Service для StatefulSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'StatefulSet требует Headless Service (clusterIP: None). Это создаёт DNS-записи для каждого Pod отдельно: <pod-name>.<service-name>.<namespace>.svc.cluster.local.' },
        { type: 'code', language: 'yaml', value: '# Headless Service\napiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-headless\nspec:\n  clusterIP: None       # Headless!\n  selector:\n    app: postgres\n  ports:\n  - port: 5432\n    targetPort: 5432\n---\n# Regular Service для доступа к мастеру\napiVersion: v1\nkind: Service\nmetadata:\n  name: postgres-master\nspec:\n  selector:\n    app: postgres\n    role: master\n  ports:\n  - port: 5432\n    targetPort: 5432' },
        { type: 'text', value: 'Для StatefulSet с 3 репликами DNS записи будут: postgres-0.postgres-headless, postgres-1.postgres-headless, postgres-2.postgres-headless. Pod могут находить друг друга по имени!' }
      ]
    },
    {
      id: 3,
      title: 'volumeClaimTemplates',
      type: 'theory',
      content: [
        { type: 'text', value: 'volumeClaimTemplates автоматически создаёт отдельный PVC для каждого Pod StatefulSet. При удалении StatefulSet PVC не удаляются — данные сохраняются!' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres-headless  # должен совпадать с именем Headless Service\n  replicas: 3\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n      - name: postgres\n        image: postgres:15\n        env:\n        - name: POSTGRES_PASSWORD\n          value: secret\n        volumeMounts:\n        - name: postgres-data\n          mountPath: /var/lib/postgresql/data\n  volumeClaimTemplates:  # шаблон для PVC каждого Pod\n  - metadata:\n      name: postgres-data\n    spec:\n      accessModes: [ReadWriteOnce]\n      storageClassName: standard\n      resources:\n        requests:\n          storage: 10Gi' },
        { type: 'note', value: 'Созданные PVC: postgres-data-postgres-0, postgres-data-postgres-1, postgres-data-postgres-2. При kubectl delete statefulset postgres PVC остаются.' }
      ]
    },
    {
      id: 4,
      title: 'Управление обновлениями StatefulSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'StatefulSet поддерживает две стратегии обновления: RollingUpdate (по умолчанию) и OnDelete. Обновление происходит в обратном порядке: сначала pod-N-1, потом pod-N-2, до pod-0.' },
        { type: 'code', language: 'yaml', value: 'spec:\n  updateStrategy:\n    type: RollingUpdate\n    rollingUpdate:\n      partition: 2  # обновлять только Pod с индексом >= 2\n      # Полезно для Canary: сначала обновить pod-2, проверить, потом всё остальное\n  # type: OnDelete - обновлять только при ручном удалении Pod' },
        { type: 'code', language: 'bash', value: '# Обновление\nkubectl set image statefulset/postgres postgres=postgres:16\nkubectl rollout status statefulset/postgres\n\n# Откат\nkubectl rollout undo statefulset/postgres\n\n# Масштабирование StatefulSet\nkubectl scale statefulset postgres --replicas=5\n# Pod создаётся по порядку: pod-3, потом pod-4\n\n# Уменьшение масштаба\nkubectl scale statefulset postgres --replicas=2\n# Pod удаляются в обратном порядке: pod-4, pod-3, pod-2' }
      ]
    },
    {
      id: 5,
      title: 'Практика: StatefulSet для Redis',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте StatefulSet для Redis с постоянным хранилищем. Проверьте что данные сохраняются между перезапусками.',
      requirements: [
        'Создать Headless Service для Redis',
        'Создать StatefulSet с 1 репликой',
        'Добавить volumeClaimTemplates для данных',
        'Записать данные в Redis',
        'Удалить Pod и проверить что данные сохранились'
      ],
      hint: 'Используйте kubectl exec для работы с redis-cli. После удаления Pod StatefulSet создаст новый с тем же PVC.',
      solution: '# redis-statefulset.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: redis-headless\nspec:\n  clusterIP: None\n  selector:\n    app: redis\n  ports:\n  - port: 6379\n    targetPort: 6379\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: redis\nspec:\n  selector:\n    app: redis\n  ports:\n  - port: 6379\n    targetPort: 6379\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: redis\nspec:\n  serviceName: redis-headless\n  replicas: 1\n  selector:\n    matchLabels:\n      app: redis\n  template:\n    metadata:\n      labels:\n        app: redis\n    spec:\n      containers:\n      - name: redis\n        image: redis:7\n        command: [\'redis-server\', \'--save\', \'60\', \'1\', \'--loglevel\', \'warning\']\n        ports:\n        - containerPort: 6379\n        volumeMounts:\n        - name: redis-data\n          mountPath: /data\n  volumeClaimTemplates:\n  - metadata:\n      name: redis-data\n    spec:\n      accessModes: [ReadWriteOnce]\n      resources:\n        requests:\n          storage: 1Gi\n\nkubectl apply -f redis-statefulset.yaml\n\n# Дождаться запуска\nkubectl wait --for=condition=ready pod/redis-0 --timeout=60s\n\n# Записать данные\nkubectl exec redis-0 -- redis-cli set mykey "Hello Kubernetes"\nkubectl exec redis-0 -- redis-cli set counter 42\n\n# Проверить данные\nkubectl exec redis-0 -- redis-cli get mykey\n\n# Удалить Pod (StatefulSet создаст новый с тем же PVC)\nkubectl delete pod redis-0\n\n# Дождаться восстановления\nkubectl wait --for=condition=ready pod/redis-0 --timeout=60s\n\n# Данные сохранились!\nkubectl exec redis-0 -- redis-cli get mykey\nkubectl exec redis-0 -- redis-cli get counter\n\n# DNS имена\nkubectl run test --image=busybox --rm -it --restart=Never -- nslookup redis-0.redis-headless',
      explanation: 'StatefulSet гарантирует что redis-0 всегда будет использовать один и тот же PVC redis-data-redis-0. Данные сохраняются между перезапусками Pod. Headless Service обеспечивает DNS для прямого обращения к конкретному Pod.'
    },
    {
      id: 6,
      title: 'Практика: Масштабирование StatefulSet',
      type: 'practice',
      difficulty: 'medium',
      description: 'Масштабируйте StatefulSet и наблюдайте за упорядоченным созданием Pod и PVC.',
      requirements: [
        'Масштабировать Redis StatefulSet до 3 реплик',
        'Наблюдать порядок создания Pod',
        'Проверить что каждый Pod получил свой PVC',
        'Уменьшить до 1 реплики и наблюдать порядок удаления',
        'Убедиться что PVC сохранились после удаления Pod'
      ],
      hint: 'Используйте kubectl get pods -w для наблюдения за порядком создания. kubectl get pvc покажет все созданные тома.',
      solution: '# В отдельном терминале наблюдать за Pod\nkubectl get pods -w &\n\n# Масштабировать до 3\nkubectl scale statefulset redis --replicas=3\n# Вывод покажет: redis-0 Running, redis-1 Pending -> Running, redis-2 Pending -> Running\n\n# Проверить PVC\nkubectl get pvc\n# redis-data-redis-0, redis-data-redis-1, redis-data-redis-2\n\n# Проверить DNS имена\nkubectl exec redis-0 -- sh -c "for i in 0 1 2; do nslookup redis-$i.redis-headless; done"\n\n# Уменьшить до 1\nkubectl scale statefulset redis --replicas=1\n# Pod удаляются в обратном порядке: redis-2, redis-1\n\n# PVC сохранились!\nkubectl get pvc\n# Все 3 PVC всё ещё существуют\n\n# Снова масштабировать до 3 - Pod подключатся к существующим PVC\nkubectl scale statefulset redis --replicas=3',
      explanation: 'StatefulSet создаёт Pod строго по порядку (redis-0, redis-1, redis-2) и удаляет в обратном (redis-2, redis-1). Это важно для баз данных, где replica должна подключаться к мастеру (redis-0). PVC сохраняются при масштабировании вниз — при повторном масштабировании Pod подключатся к своим данным.'
    }
  ]
}
