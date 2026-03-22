export default {
  id: 5,
  title: 'Services: ClusterIP, NodePort, LoadBalancer',
  description: 'Сетевое взаимодействие между Pod и внешним миром через Services: типы, селекторы, Endpoints',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны Services?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pod имеет динамический IP-адрес, который меняется при каждом перезапуске. Нельзя напрямую обращаться к Pod по IP. Service — это стабильная точка доступа к набору Pod. Он предоставляет постоянный IP и DNS-имя, независимо от жизненного цикла Pod.' },
        { type: 'text', value: 'Service находит нужные Pod через selector (выбор по labels). Kubernetes создаёт объект Endpoints, который хранит актуальный список IP-адресов Pod для данного Service.' },
        { type: 'code', language: 'bash', value: '# Посмотреть Endpoints\nkubectl get endpoints my-service\nkubectl describe endpoints my-service' },
        { type: 'heading', value: 'Типы Services' },
        { type: 'list', items: [
          'ClusterIP — только внутри кластера (по умолчанию)',
          'NodePort — доступ снаружи через порт узла',
          'LoadBalancer — внешний балансировщик (облако)',
          'ExternalName — CNAME запись для внешнего сервиса',
          'Headless — без ClusterIP, возвращает Pod IP напрямую'
        ]}
      ]
    },
    {
      id: 2,
      title: 'ClusterIP Service',
      type: 'theory',
      content: [
        { type: 'text', value: 'ClusterIP — тип Service по умолчанию. Создаёт виртуальный IP доступный только внутри кластера. Используется для взаимодействия между микросервисами.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: backend-service\nspec:\n  type: ClusterIP  # по умолчанию, можно не указывать\n  selector:\n    app: backend    # выбирает Pod с этим label\n  ports:\n  - protocol: TCP\n    port: 80        # порт Service\n    targetPort: 8080 # порт контейнера\n  # Можно указать несколько портов:\n  # - name: http\n  #   port: 80\n  #   targetPort: 8080\n  # - name: metrics\n  #   port: 9090\n  #   targetPort: 9090' },
        { type: 'text', value: 'DNS-имя Service формируется как: <service-name>.<namespace>.svc.cluster.local. Из того же namespace можно обращаться просто по имени: http://backend-service.' },
        { type: 'tip', value: 'Kubernetes автоматически создаёт DNS-записи для каждого Service. Внутри Pod можно обращаться к другим сервисам по имени: curl http://backend-service/api/v1.' }
      ]
    },
    {
      id: 3,
      title: 'NodePort Service',
      type: 'theory',
      content: [
        { type: 'text', value: 'NodePort открывает порт на каждом узле кластера. Трафик на <NodeIP>:<NodePort> перенаправляется на Service. Диапазон NodePort: 30000-32767 по умолчанию.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: web-nodeport\nspec:\n  type: NodePort\n  selector:\n    app: web\n  ports:\n  - protocol: TCP\n    port: 80          # порт Service (внутри кластера)\n    targetPort: 80    # порт контейнера\n    nodePort: 30080   # порт на узле (30000-32767)\n    # Если не указать nodePort, выберется случайно' },
        { type: 'code', language: 'bash', value: '# Получить URL для minikube\nminikube service web-nodeport --url\n\n# Или вручную\nNODE_IP=$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}")\necho "http://$NODE_IP:30080"' },
        { type: 'warning', value: 'NodePort не рекомендуется для продакшена: ограниченный диапазон портов, неудобен при большом числе сервисов. Используйте Ingress поверх ClusterIP.' }
      ]
    },
    {
      id: 4,
      title: 'LoadBalancer Service',
      type: 'theory',
      content: [
        { type: 'text', value: 'LoadBalancer создаёт внешний балансировщик нагрузки в облачном провайдере (AWS ELB, GCP Load Balancer, Azure LB). Получает внешний IP и перенаправляет трафик в кластер.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: web-lb\n  annotations:\n    # AWS: тип балансировщика\n    service.beta.kubernetes.io/aws-load-balancer-type: nlb\nspec:\n  type: LoadBalancer\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 8080\n  # loadBalancerIP: "1.2.3.4"  # запросить конкретный IP' },
        { type: 'code', language: 'bash', value: '# Дождаться внешнего IP\nkubectl get service web-lb --watch\n\n# Получить EXTERNAL-IP\nkubectl get service web-lb -o jsonpath="{.status.loadBalancer.ingress[0].ip}"' },
        { type: 'note', value: 'В minikube LoadBalancer не получает реальный IP. Используйте minikube tunnel в отдельном терминале, чтобы сервисы типа LoadBalancer получили IP.' }
      ]
    },
    {
      id: 5,
      title: 'Headless Service и ExternalName',
      type: 'theory',
      content: [
        { type: 'text', value: 'Headless Service создаётся когда clusterIP: None. DNS возвращает IP-адреса Pod напрямую. Используется для StatefulSet, баз данных, когда нужно обращаться к конкретному Pod.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: headless-svc\nspec:\n  clusterIP: None  # Headless\n  selector:\n    app: database\n  ports:\n  - port: 5432\n    targetPort: 5432' },
        { type: 'heading', value: 'ExternalName Service' },
        { type: 'text', value: 'ExternalName создаёт CNAME-запись на внешний домен. Используется для доступа к внешним сервисам через стандартный механизм Service Discovery.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: external-db\nspec:\n  type: ExternalName\n  externalName: my-database.example.com\n  # Обращение к external-db внутри кластера\n  # перенаправляется на my-database.example.com' },
        { type: 'tip', value: 'ExternalName полезен при миграции: сначала перенаправляете на внешнюю БД, потом меняете Service на ClusterIP после миграции данных внутрь кластера.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание Services',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Deployment и три типа Services для него. Проверьте доступность через каждый тип.',
      requirements: [
        'Создать Deployment с nginx',
        'Создать ClusterIP Service и проверить доступность изнутри кластера',
        'Создать NodePort Service и получить доступ снаружи',
        'Проверить DNS-разрешение имён Service',
        'Изучить Endpoints'
      ],
      hint: 'Для проверки ClusterIP запустите временный Pod с busybox и используйте curl. kubectl run test --image=busybox -it --rm -- wget -qO- http://my-service',
      solution: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.21\n        ports:\n        - containerPort: 80\n---\n# ClusterIP Service\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-clusterip\nspec:\n  type: ClusterIP\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\n---\n# NodePort Service\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-nodeport\nspec:\n  type: NodePort\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30080\n\n# Применить\nkubectl apply -f deployment.yaml\n\n# Проверить Services\nkubectl get services\nkubectl describe service web-clusterip\n\n# Endpoints\nkubectl get endpoints\n\n# Проверить ClusterIP изнутри кластера\nkubectl run test-pod --image=busybox -it --rm -- wget -qO- http://web-clusterip\n\n# DNS проверка\nkubectl run test-pod --image=busybox -it --rm -- nslookup web-clusterip\n\n# NodePort через minikube\nminikube service web-nodeport --url',
      explanation: 'ClusterIP доступен только внутри кластера — для проверки нужен тестовый Pod. Kubernetes DNS позволяет обращаться к сервисам по имени. Endpoints автоматически обновляются при изменении Pod. NodePort открывает доступ снаружи через порт узла.'
    },
    {
      id: 7,
      title: 'Практика: Межсервисное взаимодействие',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте frontend и backend сервисы, настройте взаимодействие между ними через Service DNS.',
      requirements: [
        'Создать backend Deployment и ClusterIP Service',
        'Создать frontend Deployment',
        'Настроить frontend для обращения к backend по DNS-имени',
        'Проверить цепочку обращений',
        'Изучить как Service балансирует нагрузку'
      ],
      hint: 'Используйте переменную окружения в frontend Pod для адреса backend: value: "http://backend-service". Смотрите логи чтобы увидеть балансировку.',
      solution: '# backend.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: backend\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: backend\n  template:\n    metadata:\n      labels:\n        app: backend\n    spec:\n      containers:\n      - name: backend\n        image: hashicorp/http-echo\n        args:\n        - -text=backend-response\n        ports:\n        - containerPort: 5678\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-service\nspec:\n  selector:\n    app: backend\n  ports:\n  - port: 80\n    targetPort: 5678\n\n# Применить\nkubectl apply -f backend.yaml\n\n# Проверить балансировку (несколько запросов)\nfor i in $(seq 1 10); do\n  kubectl run test-$i --image=busybox --rm -it --restart=Never -- \\\n    wget -qO- http://backend-service\ndone\n\n# Посмотреть на какие Pod приходят запросы\nkubectl logs -l app=backend --prefix=true',
      explanation: 'Kubernetes DNS автоматически разрешает имена Service. Запрос к backend-service автоматически балансируется между всеми Pod с label app: backend. Каждый Service получает стабильное DNS-имя: <service-name>.<namespace>.svc.cluster.local.'
    }
  ]
}
