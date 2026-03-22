export default {
  id: 8,
  title: 'Namespaces: изоляция, ResourceQuota, LimitRange',
  description: 'Логическая изоляция ресурсов кластера, управление лимитами и квотами на уровне namespace',
  lessons: [
    {
      id: 1,
      title: 'Что такое Namespace?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Namespace — это механизм логического разделения ресурсов внутри одного кластера. Разные команды, проекты или окружения (dev, staging, prod) могут использовать один кластер, не мешая друг другу.' },
        { type: 'heading', value: 'Встроенные Namespace' },
        { type: 'list', items: [
          'default — пространство по умолчанию для пользовательских ресурсов',
          'kube-system — системные компоненты Kubernetes (kube-dns, kube-proxy, CNI)',
          'kube-public — общедоступные данные, читает любой',
          'kube-node-lease — объекты Lease для heartbeat узлов'
        ]},
        { type: 'code', language: 'bash', value: '# Список namespace\nkubectl get namespaces\n\n# Создать namespace\nkubectl create namespace dev\nkubectl create namespace staging\nkubectl create namespace production\n\n# Ресурсы в конкретном namespace\nkubectl get pods -n dev\nkubectl get all -n staging\n\n# Ресурсы во всех namespace\nkubectl get pods -A\nkubectl get pods --all-namespaces' },
        { type: 'note', value: 'Некоторые ресурсы не принадлежат namespace (cluster-scoped): Node, PersistentVolume, StorageClass, ClusterRole. Для них -n не имеет смысла.' }
      ]
    },
    {
      id: 2,
      title: 'Создание и управление Namespace',
      type: 'theory',
      content: [
        { type: 'text', value: 'Namespace создаётся через YAML или командой. Все ресурсы создаются в namespace по умолчанию, если не указать явно. Сетевой доступ между namespace есть по умолчанию (требует NetworkPolicy для изоляции).' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n  labels:\n    env: production\n    team: backend\n  annotations:\n    contact: team-backend@company.com' },
        { type: 'heading', value: 'Работа с namespace' },
        { type: 'code', language: 'bash', value: '# Создать ресурс в namespace\nkubectl apply -f pod.yaml -n dev\n\n# В манифесте указать namespace\n# metadata:\n#   namespace: dev\n\n# Установить namespace по умолчанию для текущего контекста\nkubectl config set-context --current --namespace=dev\n\n# Удалить namespace (удалит ВСЕ ресурсы внутри!)\nkubectl delete namespace dev\n\n# DNS между namespace\n# <service>.<namespace>.svc.cluster.local\ncurl http://backend-service.production.svc.cluster.local' }
      ]
    },
    {
      id: 3,
      title: 'ResourceQuota: квоты ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'ResourceQuota ограничивает общее количество ресурсов, которые можно использовать в namespace. Это предотвращает ситуацию, когда одна команда потребляет все ресурсы кластера.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: dev-quota\n  namespace: dev\nspec:\n  hard:\n    # Количество объектов\n    pods: "20"\n    services: "10"\n    persistentvolumeclaims: "5"\n    configmaps: "20"\n    secrets: "20"\n    # Вычислительные ресурсы\n    requests.cpu: "4"\n    requests.memory: 8Gi\n    limits.cpu: "8"\n    limits.memory: 16Gi\n    # Хранилище\n    requests.storage: 50Gi' },
        { type: 'code', language: 'bash', value: '# Проверить использование квоты\nkubectl describe resourcequota dev-quota -n dev\nkubectl get resourcequota -n dev' },
        { type: 'warning', value: 'Если ResourceQuota требует cpu/memory requests, то у каждого Pod в namespace ОБЯЗАТЕЛЬНО должны быть указаны requests.cpu и requests.memory, иначе Pod не создастся.' }
      ]
    },
    {
      id: 4,
      title: 'LimitRange: лимиты по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'LimitRange устанавливает значения по умолчанию и ограничения для requests/limits контейнеров в namespace. Помогает обеспечить, что все контейнеры имеют настроенные ресурсы.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: LimitRange\nmetadata:\n  name: dev-limits\n  namespace: dev\nspec:\n  limits:\n  - type: Container\n    default:         # limits по умолчанию\n      cpu: "500m"\n      memory: "256Mi"\n    defaultRequest:  # requests по умолчанию\n      cpu: "100m"\n      memory: "128Mi"\n    max:             # максимальные значения\n      cpu: "2"\n      memory: "1Gi"\n    min:             # минимальные значения\n      cpu: "50m"\n      memory: "64Mi"\n  - type: Pod\n    max:\n      cpu: "4"\n      memory: "2Gi"\n  - type: PersistentVolumeClaim\n    max:\n      storage: "10Gi"\n    min:\n      storage: "1Gi"' },
        { type: 'tip', value: 'LimitRange и ResourceQuota работают вместе: LimitRange задаёт дефолты и ограничения для отдельных контейнеров, ResourceQuota — общие лимиты для namespace.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны использования Namespace',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько распространённых паттернов организации namespace в кластере.' },
        { type: 'heading', value: 'Паттерн 1: По окружению' },
        { type: 'list', items: [
          'dev — разработка, разработчики могут создавать/удалять ресурсы',
          'staging — предпродакшн, только CI/CD имеет доступ',
          'production — продакшн, минимальный доступ, жёсткие квоты'
        ]},
        { type: 'heading', value: 'Паттерн 2: По команде/приложению' },
        { type: 'list', items: [
          'team-backend — все сервисы команды бэкенда',
          'team-frontend — фронтенд сервисы',
          'team-data — сервисы команды данных'
        ]},
        { type: 'heading', value: 'Паттерн 3: По компоненту' },
        { type: 'list', items: [
          'monitoring — Prometheus, Grafana',
          'logging — EFK стек',
          'ingress — Ingress контроллеры'
        ]},
        { type: 'note', value: 'DNS между namespace работает автоматически: из namespace dev можно обратиться к сервису в production через production-service.production.svc.cluster.local. Для изоляции используйте NetworkPolicy.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка namespace с квотами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте namespace для разработки и продакшна с квотами и дефолтными лимитами.',
      requirements: [
        'Создать namespace dev и production',
        'Настроить ResourceQuota для каждого namespace',
        'Настроить LimitRange с дефолтными значениями',
        'Создать Pod без указания ресурсов и убедиться что дефолты применились',
        'Попытаться превысить квоту и увидеть ошибку'
      ],
      hint: 'После создания LimitRange создайте Pod без resources — они автоматически получат дефолтные значения. Превышение квоты даст ошибку: exceeded quota.',
      solution: '# namespaces.yaml\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: dev\n---\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: production\n---\n# Квота для dev\napiVersion: v1\nkind: ResourceQuota\nmetadata:\n  name: dev-quota\n  namespace: dev\nspec:\n  hard:\n    pods: "10"\n    requests.cpu: "2"\n    requests.memory: 4Gi\n    limits.cpu: "4"\n    limits.memory: 8Gi\n---\n# LimitRange для dev\napiVersion: v1\nkind: LimitRange\nmetadata:\n  name: dev-limits\n  namespace: dev\nspec:\n  limits:\n  - type: Container\n    default:\n      cpu: "200m"\n      memory: "128Mi"\n    defaultRequest:\n      cpu: "100m"\n      memory: "64Mi"\n    max:\n      cpu: "1"\n      memory: "512Mi"\n\nkubectl apply -f namespaces.yaml\n\n# Создать Pod без ресурсов - получит дефолты\nkubectl run nginx-default --image=nginx:1.21 -n dev\n\n# Проверить применённые дефолты\nkubectl get pod nginx-default -n dev -o yaml | grep -A 10 resources\n\n# Проверить квоту\nkubectl describe resourcequota dev-quota -n dev\n\n# Попытаться превысить квоту\nfor i in $(seq 1 15); do\n  kubectl run pod-$i --image=nginx -n dev\ndone\n# Получим: exceeded quota: dev-quota',
      explanation: 'ResourceQuota ограничивает суммарные ресурсы namespace. LimitRange устанавливает дефолты для контейнеров без явных ресурсов. Совместное использование обеспечивает предсказуемое потребление ресурсов всеми командами в кластере.'
    }
  ]
}
