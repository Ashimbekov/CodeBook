export default {
  id: 12,
  title: 'DaemonSets: агенты на каждом узле',
  description: 'Запуск Pod на каждом (или выбранных) узле кластера с DaemonSet, node selectors и tolerations',
  lessons: [
    {
      id: 1,
      title: 'DaemonSet: один Pod на каждом узле',
      type: 'theory',
      content: [
        { type: 'text', value: 'DaemonSet гарантирует, что копия Pod запущена на каждом узле кластера (или на выбранных узлах). При добавлении нового узла Pod автоматически создаётся на нём, при удалении — удаляется.' },
        { type: 'heading', value: 'Когда использовать DaemonSet' },
        { type: 'list', items: [
          'Сбор логов: Fluentd, Filebeat, Logstash на каждом узле',
          'Мониторинг: Node Exporter для Prometheus, Datadog Agent',
          'Сеть: CNI плагины (Calico, Flannel, Weave)',
          'Хранилище: Ceph, GlusterFS, CSI драйверы',
          'Безопасность: Falco, Sysdig, агенты IDS/IPS',
          'Системные сервисы: kube-proxy, Docker daemon'
        ]},
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: node-exporter\n  namespace: monitoring\nspec:\n  selector:\n    matchLabels:\n      app: node-exporter\n  template:\n    metadata:\n      labels:\n        app: node-exporter\n    spec:\n      hostNetwork: true  # использовать сеть хоста\n      hostPID: true      # использовать PID namespace хоста\n      containers:\n      - name: node-exporter\n        image: prom/node-exporter:latest\n        ports:\n        - containerPort: 9100\n          hostPort: 9100\n        volumeMounts:\n        - name: proc\n          mountPath: /host/proc\n          readOnly: true\n        - name: sys\n          mountPath: /host/sys\n          readOnly: true\n      volumes:\n      - name: proc\n        hostPath:\n          path: /proc\n      - name: sys\n        hostPath:\n          path: /sys' }
      ]
    },
    {
      id: 2,
      title: 'Node Selectors: выбор узлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node Selector позволяет запускать Pod только на узлах с определёнными labels. Это полезно когда DaemonSet нужен только на определённых типах узлов (GPU узлы, узлы с SSD и т.д.).' },
        { type: 'code', language: 'yaml', value: 'spec:\n  template:\n    spec:\n      nodeSelector:\n        # Запускать только на узлах с этим label\n        disk-type: ssd\n        kubernetes.io/os: linux\n      containers:\n      - name: app\n        image: my-app' },
        { type: 'code', language: 'bash', value: '# Добавить label узлу\nkubectl label node worker-1 disk-type=ssd\nkubectl label node worker-2 disk-type=hdd\n\n# Посмотреть labels узлов\nkubectl get nodes --show-labels\n\n# Удалить label\nkubectl label node worker-1 disk-type-\n\n# Список встроенных labels узлов\n# kubernetes.io/hostname\n# kubernetes.io/os (linux, windows)\n# kubernetes.io/arch (amd64, arm64)\n# node.kubernetes.io/instance-type (m5.large и т.д. для AWS)' },
        { type: 'heading', value: 'Node Affinity (более гибкий вариант)' },
        { type: 'code', language: 'yaml', value: 'spec:\n  affinity:\n    nodeAffinity:\n      requiredDuringSchedulingIgnoredDuringExecution:\n        nodeSelectorTerms:\n        - matchExpressions:\n          - key: disk-type\n            operator: In\n            values: [ssd, nvme]\n      preferredDuringSchedulingIgnoredDuringExecution:\n      - weight: 1\n        preference:\n          matchExpressions:\n          - key: zone\n            operator: In\n            values: [us-east-1a]' }
      ]
    },
    {
      id: 3,
      title: 'Taints и Tolerations',
      type: 'theory',
      content: [
        { type: 'text', value: 'Taint (зараза) добавляется на узел и "отталкивает" Pod от него. Toleration (допуск) добавляется в Pod и позволяет ему быть размещённым на "заражённом" узле.' },
        { type: 'code', language: 'bash', value: '# Добавить taint на узел\nkubectl taint node worker-1 gpu=true:NoSchedule\n# NoSchedule - новые Pod без toleration не планируются\n# PreferNoSchedule - предпочтительно не планировать\n# NoExecute - удалить уже запущенные Pod без toleration\n\n# Посмотреть taints\nkubectl describe node worker-1 | grep Taint\n\n# Удалить taint\nkubectl taint node worker-1 gpu=true:NoSchedule-' },
        { type: 'code', language: 'yaml', value: 'spec:\n  tolerations:\n  # Допускает узел с taint gpu=true:NoSchedule\n  - key: gpu\n    operator: Equal\n    value: "true"\n    effect: NoSchedule\n  # Допускает любой taint с ключом dedicated\n  - key: dedicated\n    operator: Exists\n    effect: NoSchedule\n  # Допускает все taints\n  - operator: Exists' },
        { type: 'note', value: 'Системные узлы (control-plane) помечены taint node-role.kubernetes.io/control-plane:NoSchedule. Системные Pod (kube-proxy, CNI) имеют toleration на это, поэтому запускаются на мастере.' }
      ]
    },
    {
      id: 4,
      title: 'DaemonSet для сбора логов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реальный пример DaemonSet для Fluentd — сбора логов со всех узлов и отправки в Elasticsearch.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: fluentd\n  namespace: logging\nspec:\n  selector:\n    matchLabels:\n      app: fluentd\n  updateStrategy:\n    type: RollingUpdate\n  template:\n    metadata:\n      labels:\n        app: fluentd\n    spec:\n      serviceAccountName: fluentd\n      tolerations:\n      - key: node-role.kubernetes.io/control-plane\n        effect: NoSchedule\n      containers:\n      - name: fluentd\n        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch\n        env:\n        - name: FLUENT_ELASTICSEARCH_HOST\n          value: elasticsearch-service\n        - name: FLUENT_ELASTICSEARCH_PORT\n          value: "9200"\n        resources:\n          limits:\n            memory: 200Mi\n          requests:\n            cpu: 100m\n            memory: 200Mi\n        volumeMounts:\n        - name: varlog\n          mountPath: /var/log\n        - name: dockercontainerlogdirectory\n          mountPath: /var/lib/docker/containers\n          readOnly: true\n      volumes:\n      - name: varlog\n        hostPath:\n          path: /var/log\n      - name: dockercontainerlogdirectory\n        hostPath:\n          path: /var/lib/docker/containers' }
      ]
    },
    {
      id: 5,
      title: 'Практика: DaemonSet с node selectors',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте DaemonSet для мониторинга узлов и настройте его запуск только на worker узлах.',
      requirements: [
        'Создать DaemonSet с простым мониторинг агентом',
        'Ограничить запуск только на узлах с label type=worker',
        'Добавить toleration для control-plane',
        'Проверить что Pod создался на нужных узлах',
        'Добавить label на узел и убедиться что Pod создался'
      ],
      hint: 'В minikube добавьте label: kubectl label node minikube type=worker. DaemonSet без nodeSelector запустится на всех узлах включая control-plane.',
      solution: '# node-monitor-ds.yaml\napiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: node-monitor\n  labels:\n    app: node-monitor\nspec:\n  selector:\n    matchLabels:\n      app: node-monitor\n  template:\n    metadata:\n      labels:\n        app: node-monitor\n    spec:\n      nodeSelector:\n        type: worker\n      tolerations:\n      - key: node-role.kubernetes.io/control-plane\n        effect: NoSchedule\n      hostPID: false\n      containers:\n      - name: monitor\n        image: busybox\n        command:\n        - sh\n        - -c\n        - |\n          while true; do\n            echo "Node: $NODE_NAME, Time: $(date)"\n            echo "Load: $(cat /host/proc/loadavg)"\n            sleep 30\n          done\n        env:\n        - name: NODE_NAME\n          valueFrom:\n            fieldRef:\n              fieldPath: spec.nodeName\n        resources:\n          limits:\n            cpu: 50m\n            memory: 32Mi\n          requests:\n            cpu: 10m\n            memory: 16Mi\n        volumeMounts:\n        - name: proc\n          mountPath: /host/proc\n          readOnly: true\n      volumes:\n      - name: proc\n        hostPath:\n          path: /proc\n\n# Добавить label на узел\nkubectl label node minikube type=worker\n\nkubectl apply -f node-monitor-ds.yaml\n\n# Проверить\nkubectl get daemonset node-monitor\nkubectl get pods -l app=node-monitor -o wide\n\n# Логи\nkubectl logs -l app=node-monitor\n\n# Удалить label - Pod будет удалён\nkubectl label node minikube type-\nkubectl get pods -l app=node-monitor',
      explanation: 'DaemonSet обеспечивает запуск агента на каждом подходящем узле. nodeSelector ограничивает список узлов по labels. tolerations позволяют Pod запускаться на "заражённых" узлах. Переменная spec.nodeName внедряется как ENV для идентификации узла.'
    },
    {
      id: 6,
      title: 'Практика: Обновление DaemonSet',
      type: 'practice',
      difficulty: 'easy',
      description: 'Обновите DaemonSet и наблюдайте за rolling update на каждом узле.',
      requirements: [
        'Обновить образ в DaemonSet',
        'Наблюдать за rolling update',
        'Проверить статус обновления',
        'Выполнить откат',
        'Изучить разницу между RollingUpdate и OnDelete'
      ],
      hint: 'kubectl rollout status daemonset/node-monitor работает как для Deployment. Стратегия OnDelete обновляет Pod только при их ручном удалении.',
      solution: '# Наблюдать за обновлением\nkubectl get pods -l app=node-monitor -w &\n\n# Обновить образ\nkubectl set image daemonset/node-monitor monitor=alpine:latest\n\n# Статус\nkubectl rollout status daemonset/node-monitor\n\n# История\nkubectl rollout history daemonset/node-monitor\n\n# Откат\nkubectl rollout undo daemonset/node-monitor\n\n# Изменить стратегию на OnDelete\nkubectl patch daemonset node-monitor -p \\\n  \'{"spec":{"updateStrategy":{"type":"OnDelete"}}}\'\n\n# Обновить образ\nkubectl set image daemonset/node-monitor monitor=busybox:latest\n\n# Pod НЕ обновятся автоматически!\nkubectl get pods -l app=node-monitor\n\n# Обновить конкретный Pod вручную\nkubectl delete pod <pod-name>\n# Новый Pod создастся с новым образом\n\n# Вернуть RollingUpdate\nkubectl patch daemonset node-monitor -p \\\n  \'{"spec":{"updateStrategy":{"type":"RollingUpdate"}}}\'',
      explanation: 'DaemonSet поддерживает те же стратегии обновления что Deployment и StatefulSet. RollingUpdate обновляет Pod по одному. OnDelete требует ручного удаления Pod для обновления — полезно для критичных системных компонентов, где нужен ручной контроль обновления.'
    }
  ]
}
