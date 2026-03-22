export default {
  id: 16,
  title: 'Логирование: EFK Stack (Elasticsearch, Fluentd, Kibana)',
  description: 'Централизованный сбор, хранение и анализ логов с EFK стеком в Kubernetes',
  lessons: [
    {
      id: 1,
      title: 'Архитектура EFK в Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'EFK (Elasticsearch + Fluentd + Kibana) — популярный стек для централизованного логирования в Kubernetes. Логи всех контейнеров собираются, хранятся и становятся доступны для поиска и анализа.' },
        { type: 'heading', value: 'Компоненты' },
        { type: 'list', items: [
          'Fluentd — агент сбора логов, работает как DaemonSet на каждом узле',
          'Elasticsearch — распределённое хранилище и поисковый движок для логов',
          'Kibana — веб-интерфейс для поиска и визуализации логов',
          'ECK (Elastic Cloud on Kubernetes) — оператор для управления Elasticsearch и Kibana'
        ]},
        { type: 'text', value: 'Поток данных: Приложение пишет логи в stdout/stderr -> containerd сохраняет в /var/log/containers/ -> Fluentd DaemonSet читает файлы с хоста -> отправляет в Elasticsearch -> Kibana показывает.' },
        { type: 'note', value: 'Альтернативы EFK: ELK (Logstash вместо Fluentd), Loki + Grafana (от Grafana Labs, легче), Vector (быстрее Fluentd). Loki набирает популярность как более лёгкая альтернатива.' }
      ]
    },
    {
      id: 2,
      title: 'Elasticsearch в Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Elasticsearch — stateful приложение. В продакшене используется ECK Operator или Bitnami Helm chart для управления кластером ES.' },
        { type: 'code', language: 'yaml', value: '# Упрощённый Elasticsearch (для разработки)\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: elasticsearch\n  namespace: logging\nspec:\n  serviceName: elasticsearch\n  replicas: 1\n  selector:\n    matchLabels:\n      app: elasticsearch\n  template:\n    metadata:\n      labels:\n        app: elasticsearch\n    spec:\n      containers:\n      - name: elasticsearch\n        image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0\n        env:\n        - name: discovery.type\n          value: single-node\n        - name: xpack.security.enabled\n          value: "false"\n        - name: ES_JAVA_OPTS\n          value: "-Xms512m -Xmx512m"\n        ports:\n        - containerPort: 9200\n        - containerPort: 9300\n        resources:\n          limits:\n            memory: 1Gi\n          requests:\n            memory: 512Mi\n        volumeMounts:\n        - name: es-data\n          mountPath: /usr/share/elasticsearch/data\n  volumeClaimTemplates:\n  - metadata:\n      name: es-data\n    spec:\n      accessModes: [ReadWriteOnce]\n      resources:\n        requests:\n          storage: 10Gi' }
      ]
    },
    {
      id: 3,
      title: 'Fluentd DaemonSet: сбор логов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fluentd работает как DaemonSet — один Pod на каждом узле. Он читает логи контейнеров из /var/log/containers/, парсит их и отправляет в Elasticsearch.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: fluentd\n  namespace: logging\nspec:\n  selector:\n    matchLabels:\n      app: fluentd\n  template:\n    metadata:\n      labels:\n        app: fluentd\n    spec:\n      serviceAccountName: fluentd\n      tolerations:\n      - key: node-role.kubernetes.io/control-plane\n        effect: NoSchedule\n      containers:\n      - name: fluentd\n        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch\n        env:\n        - name: FLUENT_ELASTICSEARCH_HOST\n          value: elasticsearch.logging.svc.cluster.local\n        - name: FLUENT_ELASTICSEARCH_PORT\n          value: "9200"\n        - name: FLUENT_ELASTICSEARCH_SCHEME\n          value: "http"\n        - name: FLUENTD_SYSTEMD_CONF\n          value: disable\n        resources:\n          limits:\n            memory: 500Mi\n          requests:\n            cpu: 100m\n            memory: 200Mi\n        volumeMounts:\n        - name: varlog\n          mountPath: /var/log\n        - name: containers\n          mountPath: /var/lib/docker/containers\n          readOnly: true\n      volumes:\n      - name: varlog\n        hostPath:\n          path: /var/log\n      - name: containers\n        hostPath:\n          path: /var/lib/docker/containers' }
      ]
    },
    {
      id: 4,
      title: 'Kibana и работа с логами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kibana предоставляет веб-интерфейс для поиска и анализа логов. После настройки index pattern можно искать логи, создавать дашборды и алерты.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: kibana\n  namespace: logging\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: kibana\n  template:\n    metadata:\n      labels:\n        app: kibana\n    spec:\n      containers:\n      - name: kibana\n        image: docker.elastic.co/kibana/kibana:8.10.0\n        env:\n        - name: ELASTICSEARCH_HOSTS\n          value: http://elasticsearch:9200\n        ports:\n        - containerPort: 5601\n        resources:\n          limits:\n            memory: 1Gi\n          requests:\n            memory: 512Mi' },
        { type: 'code', language: 'bash', value: '# Открыть Kibana\nkubectl port-forward svc/kibana 5601:5601 -n logging\n# Браузер: http://localhost:5601\n\n# В Kibana:\n# 1. Management -> Stack Management -> Index Patterns\n# 2. Create index pattern: logstash-*\n# 3. Discover -> искать логи\n# 4. KQL: kubernetes.namespace_name: "production" AND log: "error"' },
        { type: 'tip', value: 'Структурированные логи (JSON) лучше неструктурированных. JSON автоматически парсится Fluentd, поля становятся отдельными колонками в Elasticsearch для удобного поиска.' }
      ]
    },
    {
      id: 5,
      title: 'Loki: альтернатива EFK',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grafana Loki — система агрегации логов, разработанная по аналогии с Prometheus. В отличие от Elasticsearch, Loki индексирует только labels, а не содержимое логов. Это делает его дешевле и проще.' },
        { type: 'code', language: 'bash', value: '# Установка Loki + Promtail + Grafana стека\nhelm repo add grafana https://grafana.github.io/helm-charts\nhelm repo update\n\n# Установить Loki stack\nhelm install loki grafana/loki-stack \\\n  --namespace logging \\\n  --create-namespace \\\n  --set grafana.enabled=true \\\n  --set prometheus.enabled=false \\\n  --set promtail.enabled=true\n\n# Открыть Grafana\nkubectl port-forward svc/loki-grafana 3000:80 -n logging\n# Пароль: kubectl get secret loki-grafana -n logging -o jsonpath="{.data.admin-password}" | base64 -d' },
        { type: 'text', value: 'В Grafana с Loki используйте LogQL: {namespace="production"} |= "error" — найти все логи в namespace production содержащие "error". Grafana Explorer показывает логи рядом с метриками.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Развёртывание EFK стека',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разверните упрощённый EFK стек в minikube и настройте сбор логов приложения.',
      requirements: [
        'Создать namespace logging',
        'Развернуть Elasticsearch',
        'Развернуть Kibana',
        'Развернуть Fluentd DaemonSet',
        'Создать тестовое приложение и найти его логи в Kibana'
      ],
      hint: 'minikube может не хватить памяти для полного ES. Используйте ES_JAVA_OPTS: "-Xms256m -Xmx256m" и requests.memory: 512Mi. Для ES нужна sysctl vm.max_map_count=262144.',
      solution: '# Настроить minikube\nminikube start --memory=4096 --cpus=2\n\n# Увеличить vm.max_map_count для Elasticsearch\nminikube ssh -- sudo sysctl -w vm.max_map_count=262144\n\nkubectl create namespace logging\n\n# Elasticsearch Service\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Service\nmetadata:\n  name: elasticsearch\n  namespace: logging\nspec:\n  selector:\n    app: elasticsearch\n  ports:\n  - port: 9200\nEOF\n\n# Kibana Service\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Service\nmetadata:\n  name: kibana\n  namespace: logging\nspec:\n  selector:\n    app: kibana\n  ports:\n  - port: 5601\nEOF\n\n# Применить манифесты ES, Kibana, Fluentd (из предыдущих уроков)\nkubectl apply -f elasticsearch.yaml -n logging\nkubectl apply -f kibana.yaml -n logging\nkubectl apply -f fluentd-daemonset.yaml\n\n# Тестовое приложение\nkubectl run test-app --image=busybox \\\n  -- sh -c \'while true; do echo "{\\\"level\\\": \\\"info\\\", \\\"message\\\": \\\"test log\\\", \\\"timestamp\\\": \\\"$(date -Iseconds)\\\"}"; sleep 5; done\'\n\n# Открыть Kibana\nkubectl port-forward svc/kibana 5601:5601 -n logging &\n\n# Проверить ES\ncurl http://localhost:9200/_cluster/health\ncurl http://localhost:9200/_cat/indices\n\necho "Kibana: http://localhost:5601"',
      explanation: 'EFK стек автоматически собирает логи всех контейнеров в кластере. Fluentd DaemonSet обеспечивает покрытие всех узлов. Kibana позволяет искать логи, строить дашборды, настраивать алерты. Для продакшена используйте ECK Operator для управления Elasticsearch кластером.'
    }
  ]
}
