export default {
  id: 4,
  title: 'ReplicaSet и Deployments: rolling-update и rollback',
  description: 'Управление несколькими экземплярами Pod с ReplicaSet, обновления без простоя и откаты с Deployment',
  lessons: [
    {
      id: 1,
      title: 'ReplicaSet: управление репликами',
      type: 'theory',
      content: [
        { type: 'text', value: 'ReplicaSet гарантирует, что указанное количество копий (реплик) Pod работает в любой момент времени. Если Pod упал — ReplicaSet создаст новый. Если Pod лишний — удалит.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: ReplicaSet\nmetadata:\n  name: nginx-rs\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.21\n        ports:\n        - containerPort: 80' },
        { type: 'text', value: 'Поле selector.matchLabels определяет, какие Pod относятся к этому ReplicaSet. ReplicaSet будет управлять любым Pod с лейблом app: nginx — даже созданным вручную!' },
        { type: 'warning', value: 'Напрямую ReplicaSet используется редко. В продакшене всегда используйте Deployment, который создаёт ReplicaSet под капотом и добавляет возможность обновлений и откатов.' }
      ]
    },
    {
      id: 2,
      title: 'Deployment: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Deployment — высокоуровневый объект управления Pod. Он создаёт и управляет ReplicaSet, обеспечивает rolling updates (обновление без простоя) и возможность отката.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\n  labels:\n    app: nginx\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.20\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            memory: "64Mi"\n            cpu: "100m"\n          limits:\n            memory: "128Mi"\n            cpu: "200m"' },
        { type: 'code', language: 'bash', value: '# Применить Deployment\nkubectl apply -f deployment.yaml\n\n# Статус Deployment\nkubectl get deployment nginx-deployment\nkubectl get rs  # ReplicaSet созданный Deployment\nkubectl get pods\n\n# Детали\nkubectl describe deployment nginx-deployment' },
        { type: 'tip', value: 'Deployment хранит историю ReplicaSet. При каждом обновлении создаётся новый RS, старый масштабируется до 0 (но не удаляется). Это позволяет делать откаты.' }
      ]
    },
    {
      id: 3,
      title: 'Rolling Update стратегия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rolling Update — стратегия обновления по умолчанию. Новые Pod создаются постепенно, пока старые удаляются. Приложение остаётся доступным на протяжении всего процесса.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\nspec:\n  replicas: 5\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 1    # Максимум 1 Pod недоступен\n      maxSurge: 2          # Максимум 2 дополнительных Pod\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.21' },
        { type: 'list', items: [
          'maxUnavailable — максимальное количество Pod, которые могут быть недоступны во время обновления (число или процент)',
          'maxSurge — максимальное количество дополнительных Pod сверх желаемого количества (число или процент)',
          'При maxUnavailable: 0 и maxSurge: 1 обновление происходит "один за одним" — самый безопасный вариант'
        ]},
        { type: 'heading', value: 'Recreate стратегия' },
        { type: 'code', language: 'yaml', value: 'spec:\n  strategy:\n    type: Recreate  # Сначала удалить все Pod, потом создать новые\n    # Будет простой! Используется когда нельзя запустить две версии одновременно' }
      ]
    },
    {
      id: 4,
      title: 'Обновление Deployment',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обновить Deployment можно несколькими способами. Kubernetes отслеживает причину обновления через аннотацию kubernetes.io/change-cause.' },
        { type: 'heading', value: 'Способы обновления' },
        { type: 'code', language: 'bash', value: '# Обновить образ (императивно)\nkubectl set image deployment/nginx-deployment nginx=nginx:1.21\n\n# Обновить через редактирование (откроет редактор)\nkubectl edit deployment nginx-deployment\n\n# Обновить через apply (декларативно, рекомендуется)\n# Изменить версию в YAML файле, затем:\nkubectl apply -f deployment.yaml\n\n# Добавить аннотацию о причине изменения\nkubectl annotate deployment nginx-deployment \\\n  kubernetes.io/change-cause="Update to nginx 1.21"\n\n# Следить за прогрессом обновления\nkubectl rollout status deployment/nginx-deployment\n\n# Посмотреть события\nkubectl describe deployment nginx-deployment' },
        { type: 'code', language: 'bash', value: '# Ждать завершения обновления (полезно в CI/CD)\nkubectl rollout status deployment/nginx-deployment --timeout=300s\necho "Exit code: $?"' }
      ]
    },
    {
      id: 5,
      title: 'Rollback: откат обновления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если после обновления что-то пошло не так, Kubernetes позволяет мгновенно откатиться к предыдущей версии. История изменений хранится в ревизиях Deployment.' },
        { type: 'code', language: 'bash', value: '# Просмотр истории обновлений\nkubectl rollout history deployment/nginx-deployment\n\n# Детали конкретной ревизии\nkubectl rollout history deployment/nginx-deployment --revision=2\n\n# Откат к предыдущей ревизии\nkubectl rollout undo deployment/nginx-deployment\n\n# Откат к конкретной ревизии\nkubectl rollout undo deployment/nginx-deployment --to-revision=1\n\n# Следить за откатом\nkubectl rollout status deployment/nginx-deployment' },
        { type: 'text', value: 'Количество хранимых ревизий контролируется полем revisionHistoryLimit (по умолчанию 10).' },
        { type: 'code', language: 'yaml', value: 'spec:\n  revisionHistoryLimit: 5  # Хранить 5 ревизий\n  selector:\n    matchLabels:\n      app: nginx' },
        { type: 'tip', value: 'Всегда аннотируйте обновления с помощью kubernetes.io/change-cause. Это даёт понять историю изменений при rollout history.' }
      ]
    },
    {
      id: 6,
      title: 'Масштабирование и Pause/Resume',
      type: 'theory',
      content: [
        { type: 'text', value: 'Масштабирование Deployment позволяет изменять количество реплик. Pause/Resume позволяет накопить несколько изменений и применить их разом (одно обновление вместо нескольких).' },
        { type: 'code', language: 'bash', value: '# Масштабирование\nkubectl scale deployment nginx-deployment --replicas=5\n\n# Автомасштабирование (HPA)\nkubectl autoscale deployment nginx-deployment --min=2 --max=10 --cpu-percent=80\n\n# Пауза обновления (накапливаем изменения)\nkubectl rollout pause deployment/nginx-deployment\n\n# Несколько изменений пока на паузе\nkubectl set image deployment/nginx-deployment nginx=nginx:1.22\nkubectl set resources deployment/nginx-deployment -c=nginx \\\n  --limits=cpu=200m,memory=256Mi\n\n# Возобновить - применится одно обновление\nkubectl rollout resume deployment/nginx-deployment' },
        { type: 'note', value: 'kubectl rollout pause/resume полезен в скриптах CI/CD, когда нужно сделать несколько изменений Deployment без промежуточных обновлений.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Deployment с rolling update',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Deployment, обновите его и выполните rollback при симуляции проблемы.',
      requirements: [
        'Создать Deployment с 3 репликами nginx:1.20',
        'Настроить стратегию rolling update',
        'Обновить до nginx:1.21 и наблюдать процесс',
        'Обновить до несуществующего образа (симуляция ошибки)',
        'Выполнить rollback к рабочей версии'
      ],
      hint: 'Используйте kubectl rollout status для наблюдения. При ошибочном образе Pod застрянет в ImagePullBackOff, используйте rollout undo.',
      expectedOutput: 'kubectl rollout status deployment/web-app:\nWaiting for deployment "web-app" rollout to finish: 1 out of 3 new replicas have been updated...\ndeployment "web-app" successfully rolled out\n\nПосле обновления до несуществующего образа:\nkubectl get pods:\nNAME              READY   STATUS             RESTARTS\nweb-app-xxx-1     1/1     Running            0\nweb-app-xxx-2     1/1     Running            0\nweb-app-yyy-1     0/1     ImagePullBackOff   0\n\nПосле rollout undo:\ndeployment "web-app" successfully rolled out\n\nkubectl rollout history deployment/web-app:\nREVISION  CHANGE-CAUSE\n1         Initial deployment nginx:1.20\n2         Update to nginx:1.21\n3         <none>',
      solution: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\n  annotations:\n    kubernetes.io/change-cause: "Initial deployment nginx:1.20"\nspec:\n  replicas: 3\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 1\n      maxSurge: 1\n  selector:\n    matchLabels:\n      app: web-app\n  template:\n    metadata:\n      labels:\n        app: web-app\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.20\n        ports:\n        - containerPort: 80\n\nkubectl apply -f deployment.yaml\nkubectl rollout status deployment/web-app\n\n# Обновление до 1.21\nkubectl set image deployment/web-app nginx=nginx:1.21\nkubectl annotate deployment web-app kubernetes.io/change-cause="Update to nginx:1.21" --overwrite\nkubectl rollout status deployment/web-app\n\n# Сломанное обновление\nkubectl set image deployment/web-app nginx=nginx:99.99-broken\nkubectl rollout status deployment/web-app\nkubectl get pods  # ImagePullBackOff\n\n# Откат\nkubectl rollout undo deployment/web-app\nkubectl rollout history deployment/web-app\nkubectl rollout status deployment/web-app',
      explanation: 'Rolling update позволяет обновлять без простоя. При ошибочном образе новые Pod не могут запуститься, но старые остаются работать. rollout undo мгновенно откатывает к предыдущей рабочей версии. История ревизий помогает понять историю изменений.'
    },
    {
      id: 8,
      title: 'Практика: Масштабирование и мониторинг',
      type: 'practice',
      difficulty: 'easy',
      description: 'Масштабируйте Deployment вручную и настройте Horizontal Pod Autoscaler.',
      requirements: [
        'Масштабировать Deployment до 5 реплик',
        'Уменьшить до 2 реплик',
        'Создать HPA с автомасштабированием',
        'Посмотреть состояние HPA',
        'Просмотреть историю обновлений'
      ],
      hint: 'kubectl scale для ручного масштабирования, kubectl autoscale для HPA. kubectl get hpa показывает состояние автомасштабирования.',
      expectedOutput: 'kubectl scale deployment web-app --replicas=5:\ndeployment.apps/web-app scaled\n\nkubectl get deployment web-app:\nNAME      READY   UP-TO-DATE   AVAILABLE\nweb-app   5/5     5            5\n\nkubectl get hpa:\nNAME      REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS\nweb-app   Deployment/web-app 15%/70%   2         10        2\n\nkubectl rollout history deployment/web-app показывает 3 ревизии.',
      solution: '# Ручное масштабирование\nkubectl scale deployment web-app --replicas=5\nkubectl get pods -l app=web-app\nkubectl get deployment web-app\n\n# Уменьшить\nkubectl scale deployment web-app --replicas=2\nkubectl get pods -l app=web-app\n\n# Автомасштабирование (требует metrics-server)\nkubectl autoscale deployment web-app \\\n  --min=2 \\\n  --max=10 \\\n  --cpu-percent=70\n\n# Состояние HPA\nkubectl get hpa\nkubectl describe hpa web-app\n\n# История\nkubectl rollout history deployment/web-app',
      explanation: 'kubectl scale немедленно изменяет количество реплик. HPA (Horizontal Pod Autoscaler) автоматически масштабирует в зависимости от метрик. Для HPA необходим metrics-server (в minikube: minikube addons enable metrics-server).'
    }
  ]
}
