export default {
  id: 18,
  title: 'Best Practices: probes, resources, anti-affinity, PDB',
  description: 'Лучшие практики production-ready Kubernetes: health checks, ресурсы, распределение Pod, защита от сбоев',
  lessons: [
    {
      id: 1,
      title: 'Health Probes: liveness, readiness, startup',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes использует три типа probes для проверки здоровья контейнеров. Правильная настройка probes критична для надёжности приложений.' },
        { type: 'heading', value: 'Liveness Probe' },
        { type: 'text', value: 'Liveness проверяет, жив ли контейнер. Если проверка провалится — Kubernetes перезапустит контейнер. Используйте для обнаружения deadlock или зависшего процесса.' },
        { type: 'heading', value: 'Readiness Probe' },
        { type: 'text', value: 'Readiness проверяет, готов ли контейнер принимать трафик. Если провалится — Pod удаляется из Endpoints Service. Не перезапускает контейнер! Используйте при долгой инициализации.' },
        { type: 'heading', value: 'Startup Probe' },
        { type: 'text', value: 'Startup Probe даёт приложению время на старт. Пока startup probe не прошла — liveness и readiness отключены. Для медленно стартующих приложений.' },
        { type: 'code', language: 'yaml', value: 'spec:\n  containers:\n  - name: app\n    image: my-app\n    startupProbe:\n      httpGet:\n        path: /health/startup\n        port: 8080\n      failureThreshold: 30  # 30 * 10s = 300s на старт\n      periodSeconds: 10\n    livenessProbe:\n      httpGet:\n        path: /health/live\n        port: 8080\n      initialDelaySeconds: 0  # startup probe уже дала время\n      periodSeconds: 10\n      failureThreshold: 3\n      timeoutSeconds: 5\n    readinessProbe:\n      httpGet:\n        path: /health/ready\n        port: 8080\n      initialDelaySeconds: 5\n      periodSeconds: 5\n      failureThreshold: 3\n      successThreshold: 1' }
      ]
    },
    {
      id: 2,
      title: 'Resources: requests и limits',
      type: 'theory',
      content: [
        { type: 'text', value: 'Requests и limits — обязательные поля для production Pod. Requests используется для планирования (scheduler резервирует ресурсы на узле), limits — максимальное потребление.' },
        { type: 'heading', value: 'QoS классы Pod' },
        { type: 'list', items: [
          'Guaranteed — requests == limits для CPU и RAM. Наивысший приоритет. Первый выбор для критичных сервисов.',
          'Burstable — requests < limits для одного из ресурсов. Могут быть вытеснены при нехватке ресурсов.',
          'BestEffort — нет requests/limits. Первыми вытесняются при нехватке ресурсов.'
        ]},
        { type: 'code', language: 'yaml', value: 'spec:\n  containers:\n  - name: app\n    image: my-app\n    resources:\n      # Requests: минимальные гарантированные ресурсы\n      requests:\n        memory: "256Mi"\n        cpu: "250m"\n      # Limits: максимально допустимые ресурсы\n      limits:\n        memory: "512Mi"\n        cpu: "1000m"\n    # При превышении memory limit - OOMKilled (Pod перезапускается)\n    # При превышении CPU limit - CPU throttling (медленнее, не убивает)' },
        { type: 'tip', value: 'Для CPU limits в продакшене часто рекомендуют НЕ устанавливать limits (только requests). CPU throttling может вызывать непредсказуемые задержки. Memory limit обязателен — без него OOM может убить другие Pod.' }
      ]
    },
    {
      id: 3,
      title: 'Pod Anti-Affinity: распределение Pod',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pod Anti-Affinity гарантирует, что Pod одного приложения распределяются по разным узлам или зонам доступности. Это предотвращает ситуацию, когда все Pod падают при отказе одного узла.' },
        { type: 'code', language: 'yaml', value: 'spec:\n  affinity:\n    podAntiAffinity:\n      # Жёсткое требование: не ставить на узел где уже есть Pod с таким label\n      requiredDuringSchedulingIgnoredDuringExecution:\n      - labelSelector:\n          matchExpressions:\n          - key: app\n            operator: In\n            values: [my-app]\n        topologyKey: kubernetes.io/hostname  # разные узлы\n      # Мягкое требование: предпочтительно разные зоны доступности\n      preferredDuringSchedulingIgnoredDuringExecution:\n      - weight: 100\n        podAffinityTerm:\n          labelSelector:\n            matchExpressions:\n            - key: app\n              operator: In\n              values: [my-app]\n          topologyKey: topology.kubernetes.io/zone  # разные зоны' },
        { type: 'warning', value: 'required anti-affinity: если не хватает узлов — Pod останется в Pending. Для кластера из N узлов не ставьте required anti-affinity с replicas > N.' }
      ]
    },
    {
      id: 4,
      title: 'PodDisruptionBudget: защита при обслуживании',
      type: 'theory',
      content: [
        { type: 'text', value: 'PodDisruptionBudget (PDB) ограничивает количество Pod, которые могут быть недоступны одновременно во время добровольных нарушений (drain узла, rolling update). Защищает от потери кворума.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: my-app-pdb\nspec:\n  # Минимум 2 Pod должны быть доступны в любой момент\n  minAvailable: 2\n  # ИЛИ: максимум 1 Pod может быть недоступен\n  # maxUnavailable: 1\n  # ИЛИ в процентах:\n  # minAvailable: "50%"\n  selector:\n    matchLabels:\n      app: my-app' },
        { type: 'code', language: 'bash', value: '# Проверить PDB\nkubectl get pdb\nkubectl describe pdb my-app-pdb\n\n# При drain узла K8s проверит PDB\nkubectl drain worker-1 --ignore-daemonsets --delete-emptydir-data\n# Если удаление Pod нарушит PDB - drain заблокируется' },
        { type: 'note', value: 'PDB защищает только от добровольных disruption (drain, eviction). Он не защищает от сбоя узла (node failure) — это непроизвольное нарушение.' }
      ]
    },
    {
      id: 5,
      title: 'Дополнительные Best Practices',
      type: 'theory',
      content: [
        { type: 'text', value: 'Собранные лучшие практики для production-ready Kubernetes деплоя.' },
        { type: 'heading', value: 'Безопасность образов' },
        { type: 'list', items: [
          'Никогда не используйте тег latest — только конкретные версии (nginx:1.21.6)',
          'Используйте imagePullPolicy: IfNotPresent для production',
          'Сканируйте образы на уязвимости: Trivy, Snyk, Clair'
        ]},
        { type: 'heading', value: 'Безопасность Pod' },
        { type: 'code', language: 'yaml', value: 'spec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 1000\n    fsGroup: 2000\n  containers:\n  - name: app\n    securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop: [ALL]\n        add: [NET_BIND_SERVICE]  # только если нужно' },
        { type: 'heading', value: 'Graceful shutdown' },
        { type: 'code', language: 'yaml', value: 'spec:\n  terminationGracePeriodSeconds: 60  # время на graceful shutdown\n  containers:\n  - lifecycle:\n      preStop:\n        exec:\n          command: [\'/bin/sh\', \'-c\', \'sleep 5\']  # дать Service обновить Endpoints' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Production-ready Deployment',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полностью настроенный production-ready Deployment со всеми best practices.',
      requirements: [
        'Настроить все три типа probes',
        'Установить resources requests и limits',
        'Добавить pod anti-affinity для распределения',
        'Создать PodDisruptionBudget',
        'Настроить security context',
        'Добавить graceful shutdown через preStop hook'
      ],
      hint: 'Убедитесь что все probes используют разные endpoints. PDB minAvailable должен быть меньше replicas. Security context runAsNonRoot требует чтобы образ имел non-root пользователя.',
      solution: '# production-deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: production-app\n  labels:\n    app: production-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: production-app\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 1\n      maxSurge: 1\n  template:\n    metadata:\n      labels:\n        app: production-app\n    spec:\n      terminationGracePeriodSeconds: 60\n      securityContext:\n        runAsNonRoot: true\n        runAsUser: 101\n        fsGroup: 101\n      affinity:\n        podAntiAffinity:\n          preferredDuringSchedulingIgnoredDuringExecution:\n          - weight: 100\n            podAffinityTerm:\n              labelSelector:\n                matchExpressions:\n                - key: app\n                  operator: In\n                  values: [production-app]\n              topologyKey: kubernetes.io/hostname\n      containers:\n      - name: nginx\n        image: nginx:1.21.6\n        ports:\n        - containerPort: 8080\n        securityContext:\n          allowPrivilegeEscalation: false\n          readOnlyRootFilesystem: false\n          capabilities:\n            drop: [ALL]\n            add: [NET_BIND_SERVICE]\n        resources:\n          requests:\n            memory: "128Mi"\n            cpu: "100m"\n          limits:\n            memory: "256Mi"\n            cpu: "500m"\n        startupProbe:\n          httpGet:\n            path: /\n            port: 80\n          failureThreshold: 10\n          periodSeconds: 5\n        livenessProbe:\n          httpGet:\n            path: /\n            port: 80\n          periodSeconds: 10\n          failureThreshold: 3\n          timeoutSeconds: 5\n        readinessProbe:\n          httpGet:\n            path: /\n            port: 80\n          periodSeconds: 5\n          failureThreshold: 3\n          successThreshold: 1\n        lifecycle:\n          preStop:\n            exec:\n              command: [\'/bin/sh\', \'-c\', \'sleep 10\']\n---\napiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: production-app-pdb\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: production-app\n\nkubectl apply -f production-deployment.yaml\nkubectl get deployment production-app\nkubectl get pdb\nkubectl describe deployment production-app',
      explanation: 'Production-ready Deployment включает: все три probe для корректного управления трафиком, resources для предсказуемого поведения, anti-affinity для HA, PDB для защиты при rolling update, security context для изоляции, preStop hook для graceful shutdown. Это минимальный набор для production.'
    },
    {
      id: 7,
      title: 'Практика: Тестирование надёжности',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проверьте надёжность Deployment через симуляцию отказов и drain узла.',
      requirements: [
        'Симулировать отказ Pod и проверить readiness probe',
        'Выполнить rolling update с неправильным образом',
        'Убедиться что PDB защищает от удаления лишних Pod',
        'Протестировать graceful shutdown',
        'Проверить что anti-affinity работает'
      ],
      hint: 'kubectl drain --dry-run=client покажет что произойдёт без реального drain. Для симуляции медленного старта добавьте sleep в startupProbe endpoint.',
      solution: '# Проверить распределение Pod по узлам\nkubectl get pods -l app=production-app -o wide\n\n# Симуляция плохого readiness (добавить endpoint который возвращает 503)\n# В тесте - просто убьём readiness probe временно\nkubectl exec -it deploy/production-app -- sh -c "mv /usr/share/nginx/html/index.html /tmp/"\n# Pod получит readiness failure и выйдет из Service Endpoints\nkubectl get endpoints production-service\n\n# Вернуть\nkubectl exec -it deploy/production-app -- sh -c "mv /tmp/index.html /usr/share/nginx/html/"\n\n# Rolling update с плохим образом\nkubectl set image deploy/production-app nginx=nginx:broken-tag\n# Новые Pod не запустятся\nkubectl get pods\nkubectl rollout status deploy/production-app\n# Откат\nkubectl rollout undo deploy/production-app\n\n# Проверить PDB при drain\nkubectl drain minikube --dry-run=client --ignore-daemonsets\n\n# Тест graceful shutdown - посмотреть что Pod не убивается мгновенно\nkubectl delete pod <pod-name> &\nkubectl get pods -w\n# Pod остаётся в Terminating на время preStop hook (10 секунд)\n\n# Проверить события\nkubectl describe pod <pod-name>',
      explanation: 'Надёжность проверяется через симуляцию реальных сценариев отказа. Readiness probe мгновенно убирает Pod из балансировки. PDB защищает от удаления слишком многих Pod. preStop hook даёт время завершить активные запросы. Все эти механизмы вместе обеспечивают zero-downtime при обновлениях и обслуживании.'
    }
  ]
}
