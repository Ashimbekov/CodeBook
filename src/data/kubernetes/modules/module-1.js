export default {
  id: 1,
  title: 'Введение в контейнеризацию и оркестрацию',
  description: 'Что такое контейнеры, Docker, Kubernetes и зачем нужна оркестрация в современных системах',
  lessons: [
    {
      id: 1,
      title: 'Что такое контейнеры?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контейнер — это изолированная среда выполнения приложения, которая содержит код, зависимости и конфигурацию. В отличие от виртуальных машин, контейнеры используют ядро операционной системы хоста и поэтому намного легче и быстрее.' },
        { type: 'tip', value: 'Представь контейнер как стандартный морской контейнер. Неважно, что внутри — мебель или электроника. Кран, корабль и грузовик работают с ним одинаково. Так же и Docker-контейнер: неважно, какое приложение внутри — запускается везде одинаково.' },
        { type: 'heading', value: 'Проблема "у меня работает"' },
        { type: 'text', value: 'До контейнеров разработчики часто слышали: "На моей машине всё работало!" Причина — различия в версиях библиотек, операционных системах, переменных окружения. Контейнеры решают эту проблему, упаковывая всё необходимое вместе.' },
        { type: 'heading', value: 'Контейнер vs Виртуальная машина' },
        { type: 'list', items: [
          'ВМ включает полную ОС (гигабайты), контейнер — только нужные слои (мегабайты)',
          'ВМ стартует минуты, контейнер — секунды или миллисекунды',
          'ВМ сильно изолирована на уровне железа, контейнер — на уровне процессов ОС',
          'На одном хосте можно запустить сотни контейнеров, но лишь десятки ВМ'
        ]},
        { type: 'note', value: 'Docker — наиболее популярный инструмент для работы с контейнерами. Kubernetes использует контейнеры (не только Docker) как основную единицу развёртывания.' }
      ]
    },
    {
      id: 2,
      title: 'Что такое Kubernetes?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes (K8s) — это платформа оркестрации контейнеров с открытым исходным кодом, разработанная Google и переданная в CNCF. Она автоматизирует развёртывание, масштабирование и управление контейнеризированными приложениями.' },
        { type: 'heading', value: 'Зачем нужна оркестрация?' },
        { type: 'text', value: 'Представь, что у тебя 100 контейнеров на 10 серверах. Вручную следить за тем, чтобы нужное количество контейнеров работало, перезапускать упавшие, распределять нагрузку — невозможно. Kubernetes делает это автоматически.' },
        { type: 'list', items: [
          'Автоматический перезапуск упавших контейнеров',
          'Масштабирование вверх и вниз в зависимости от нагрузки',
          'Распределение контейнеров по серверам с учётом ресурсов',
          'Обновление без простоя (rolling updates)',
          'Балансировка нагрузки и service discovery',
          'Управление конфигурацией и секретами'
        ]},
        { type: 'tip', value: 'Имя "Kubernetes" происходит от греческого слова "κυβερνήτης" — рулевой или кормчий. Логотип K8s — руль корабля. Число 8 в K8s означает 8 букв между "K" и "s".' }
      ]
    },
    {
      id: 3,
      title: 'Архитектура Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кластер Kubernetes состоит из двух типов узлов: Control Plane (мастер-узел) и Worker Nodes (рабочие узлы). Control Plane управляет кластером, Worker Nodes выполняют рабочие нагрузки.' },
        { type: 'heading', value: 'Компоненты Control Plane' },
        { type: 'list', items: [
          'kube-apiserver — API сервер, единственная точка входа для всех операций',
          'etcd — распределённое хранилище ключ-значение, хранит состояние кластера',
          'kube-scheduler — выбирает, на каком узле запустить Pod',
          'kube-controller-manager — следит за состоянием кластера и приводит его к желаемому'
        ]},
        { type: 'heading', value: 'Компоненты Worker Node' },
        { type: 'list', items: [
          'kubelet — агент на каждом узле, запускает контейнеры и следит за ними',
          'kube-proxy — обеспечивает сетевые правила для Service',
          'Container Runtime — движок контейнеров (containerd, CRI-O)'
        ]},
        { type: 'note', value: 'etcd является "источником истины" для всего кластера. Потеря etcd означает потерю состояния кластера, поэтому его обязательно резервируют.' }
      ]
    },
    {
      id: 4,
      title: 'Основные объекты Kubernetes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes управляет объектами. Каждый объект описывает желаемое состояние части системы. Вы декларируете "что должно быть", а Kubernetes сам достигает этого состояния.' },
        { type: 'heading', value: 'Ключевые объекты' },
        { type: 'list', items: [
          'Pod — наименьшая единица развёртывания, содержит один или несколько контейнеров',
          'Deployment — управляет набором подов, обеспечивает обновления и откаты',
          'Service — обеспечивает постоянный сетевой доступ к подам',
          'ConfigMap — хранит конфигурационные данные',
          'Secret — хранит чувствительные данные (пароли, ключи)',
          'PersistentVolume — постоянное хранилище данных',
          'Namespace — логическая изоляция ресурсов внутри кластера'
        ]},
        { type: 'text', value: 'Все объекты описываются в формате YAML и отправляются через kubectl в API-сервер. Kubernetes хранит их в etcd и следит за тем, чтобы реальное состояние совпадало с описанным.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\n  labels:\n    app: my-app\nspec:\n  containers:\n  - name: app\n    image: nginx:1.21\n    ports:\n    - containerPort: 80' }
      ]
    },
    {
      id: 5,
      title: 'Декларативный vs Императивный подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes поддерживает два подхода: императивный (что делать) и декларативный (каким должно быть конечное состояние). В продакшене используется декларативный подход через YAML-манифесты.' },
        { type: 'heading', value: 'Императивный подход' },
        { type: 'code', language: 'bash', value: '# Создать deployment\nkubectl create deployment nginx --image=nginx\n# Масштабировать\nkubectl scale deployment nginx --replicas=3\n# Обновить образ\nkubectl set image deployment/nginx nginx=nginx:1.21' },
        { type: 'heading', value: 'Декларативный подход' },
        { type: 'code', language: 'yaml', value: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.21' },
        { type: 'code', language: 'bash', value: 'kubectl apply -f deployment.yaml' },
        { type: 'tip', value: 'Декларативный подход лучше для продакшена: манифесты хранятся в Git, изменения отслеживаются, легко воспроизвести состояние кластера. Это основа GitOps.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Изучение кластера',
      type: 'practice',
      difficulty: 'easy',
      description: 'Познакомьтесь с базовыми командами kubectl для изучения структуры кластера Kubernetes.',
      requirements: [
        'Получить информацию о кластере',
        'Посмотреть список узлов',
        'Изучить системные поды',
        'Посмотреть доступные API ресурсы'
      ],
      hint: 'Используйте команды kubectl cluster-info, kubectl get nodes и kubectl get pods -n kube-system',
      solution: '# Информация о кластере\nkubectl cluster-info\n\n# Список узлов\nkubectl get nodes\nkubectl get nodes -o wide\n\n# Подробная информация об узле\nkubectl describe node <node-name>\n\n# Системные поды\nkubectl get pods -n kube-system\n\n# Все API ресурсы\nkubectl api-resources\n\n# Версия kubectl и кластера\nkubectl version',
      explanation: 'kubectl — основной инструмент для работы с Kubernetes. Команда get выводит список ресурсов, describe — подробную информацию. Флаг -n указывает namespace, -o wide добавляет дополнительные колонки.'
    },
    {
      id: 7,
      title: 'Практика: Первый Pod',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте первый Pod в Kubernetes двумя способами: императивным и декларативным.',
      requirements: [
        'Создать Pod с nginx императивным способом',
        'Просмотреть статус Pod',
        'Создать YAML-манифест для Pod',
        'Применить манифест и проверить результат',
        'Удалить оба Pod'
      ],
      hint: 'Используйте kubectl run для создания, kubectl get pod и kubectl describe pod для просмотра, kubectl delete pod для удаления.',
      solution: '# Императивный способ\nkubectl run nginx-imperative --image=nginx:1.21\n\n# Проверить статус\nkubectl get pods\nkubectl describe pod nginx-imperative\n\n# Декларативный способ - создать файл pod.yaml:\n# apiVersion: v1\n# kind: Pod\n# metadata:\n#   name: nginx-declarative\n# spec:\n#   containers:\n#   - name: nginx\n#     image: nginx:1.21\n\nkubectl apply -f pod.yaml\nkubectl get pods\n\n# Удалить\nkubectl delete pod nginx-imperative\nkubectl delete -f pod.yaml',
      explanation: 'kubectl run создаёт Pod быстро, но не подходит для продакшена. kubectl apply -f применяет YAML-манифест — это правильный подход. Команда delete удаляет ресурсы по имени или по манифесту.'
    }
  ]
}
