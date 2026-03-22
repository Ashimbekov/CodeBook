export default {
  id: 3,
  title: 'Pods: спецификация, жизненный цикл, multi-container',
  description: 'Подробное изучение Pod — базовой единицы Kubernetes: спецификация, фазы жизненного цикла и паттерны multi-container',
  lessons: [
    {
      id: 1,
      title: 'Анатомия Pod',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pod — это наименьшая развёртываемая единица в Kubernetes. Pod содержит один или несколько контейнеров, которые разделяют сеть и хранилище. Все контейнеры в Pod имеют одинаковый IP-адрес и могут общаться через localhost.' },
        { type: 'heading', value: 'Структура Pod манифеста' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod\n  namespace: default\n  labels:\n    app: my-app\n    version: v1\n  annotations:\n    description: "Пример Pod с полной спецификацией"\nspec:\n  containers:\n  - name: app\n    image: nginx:1.21\n    ports:\n    - containerPort: 80\n      protocol: TCP\n    resources:\n      requests:\n        memory: "64Mi"\n        cpu: "250m"\n      limits:\n        memory: "128Mi"\n        cpu: "500m"\n    env:\n    - name: ENV_VAR\n      value: "production"' },
        { type: 'text', value: 'Labels — метки для поиска и группировки. Annotations — произвольные метаданные для инструментов. Resources — запросы и лимиты CPU/памяти.' },
        { type: 'note', value: 'CPU указывается в "миллиядрах": 250m = 0.25 ядра. Память — в байтах с суффиксами: Mi (мебибайты), Gi (гибибайты).' }
      ]
    },
    {
      id: 2,
      title: 'Жизненный цикл Pod',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pod проходит несколько фаз в своём жизненном цикле. Понимание этих фаз критично для отладки проблем.' },
        { type: 'heading', value: 'Фазы Pod' },
        { type: 'list', items: [
          'Pending — Pod принят кластером, но контейнеры ещё не запущены (скачивается образ, Pod ждёт назначения на узел)',
          'Running — Pod назначен на узел, все контейнеры созданы, хотя бы один работает',
          'Succeeded — все контейнеры завершились успешно (exitCode 0), используется для Jobs',
          'Failed — все контейнеры завершились, хотя бы один с ошибкой',
          'Unknown — состояние Pod неизвестно, обычно из-за проблем связи с узлом'
        ]},
        { type: 'heading', value: 'Состояния контейнеров' },
        { type: 'list', items: [
          'Waiting — ждёт (скачивается образ, ждёт зависимостей)',
          'Running — выполняется',
          'Terminated — завершён (успешно или с ошибкой)'
        ]},
        { type: 'heading', value: 'Политики перезапуска' },
        { type: 'code', language: 'yaml', value: 'spec:\n  restartPolicy: Always   # Всегда перезапускать (по умолчанию)\n  # restartPolicy: OnFailure  # Перезапускать только при ошибке\n  # restartPolicy: Never      # Никогда не перезапускать' },
        { type: 'tip', value: 'Для отладки завершённых Pod используйте kubectl logs <pod-name> --previous для просмотра логов предыдущего контейнера.' }
      ]
    },
    {
      id: 3,
      title: 'Init контейнеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Init контейнеры выполняются до запуска основных контейнеров. Они используются для инициализации: ожидания готовности зависимостей, настройки файловой системы, загрузки конфигурации.' },
        { type: 'text', value: 'Init контейнеры выполняются последовательно. Если init контейнер завершается с ошибкой, Pod перезапускается (согласно restartPolicy). Основные контейнеры запускаются только после успешного завершения всех init контейнеров.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: app-with-init\nspec:\n  initContainers:\n  - name: wait-for-db\n    image: busybox\n    command: [\'sh\', \'-c\', \'until nc -z postgres-service 5432; do echo waiting for postgres; sleep 2; done\']\n  - name: run-migrations\n    image: my-app:latest\n    command: [\'sh\', \'-c\', \'python manage.py migrate\']\n  containers:\n  - name: app\n    image: my-app:latest\n    ports:\n    - containerPort: 8000' },
        { type: 'note', value: 'Init контейнеры могут использовать другие образы, чем основные. Это позволяет использовать инструменты (curl, nc) только для инициализации, не включая их в продакшн образ.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн Sidecar',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sidecar — паттерн, когда в Pod запускается вспомогательный контейнер рядом с основным. Sidecar расширяет функциональность основного приложения, не изменяя его.' },
        { type: 'heading', value: 'Примеры использования Sidecar' },
        { type: 'list', items: [
          'Логирование: Fluentd собирает логи из shared volume и отправляет в Elasticsearch',
          'Proxy: Envoy или Nginx в качестве reverse proxy',
          'Мониторинг: Prometheus exporter для основного приложения',
          'Service Mesh: Istio Envoy proxy (внедряется автоматически)'
        ]},
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: app-with-sidecar\nspec:\n  volumes:\n  - name: log-volume\n    emptyDir: {}\n  containers:\n  - name: app\n    image: my-app:latest\n    volumeMounts:\n    - name: log-volume\n      mountPath: /var/log/app\n  - name: log-shipper\n    image: fluentd:latest\n    volumeMounts:\n    - name: log-volume\n      mountPath: /var/log/app\n      readOnly: true' },
        { type: 'tip', value: 'В Kubernetes 1.29+ появились Sidecar контейнеры как отдельный тип (sidecarContainers в initContainers), которые живут дольше init контейнеров, но стартуют раньше основных.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны Ambassador и Adapter',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо Sidecar, существуют два других важных паттерна multi-container Pod: Ambassador и Adapter.' },
        { type: 'heading', value: 'Ambassador (посол)' },
        { type: 'text', value: 'Ambassador proxy перехватывает сетевые запросы основного контейнера. Например, основное приложение всегда обращается к localhost:5432, а Ambassador решает, к какой базе данных направить запрос (прод, стейджинг, кэш).' },
        { type: 'code', language: 'yaml', value: 'spec:\n  containers:\n  - name: app\n    image: my-app\n    env:\n    - name: DB_HOST\n      value: localhost  # всегда localhost\n    - name: DB_PORT\n      value: "5432"\n  - name: db-ambassador\n    image: haproxy:latest\n    # HAProxy проксирует :5432 -> настоящая БД' },
        { type: 'heading', value: 'Adapter (адаптер)' },
        { type: 'text', value: 'Adapter стандартизирует вывод основного контейнера. Например, преобразует нестандартные логи приложения в формат, понятный Prometheus.' },
        { type: 'note', value: 'Все три паттерна используют shared volumes или localhost для коммуникации, так как контейнеры в Pod разделяют сеть и хранилище.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание Pod со спецификацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Pod с полной спецификацией: несколько переменных окружения, resource limits, и изучите его состояние.',
      requirements: [
        'Создать Pod с образом nginx и настроенными resource limits',
        'Добавить переменные окружения',
        'Добавить liveness probe',
        'Проверить статус и логи Pod',
        'Выполнить команду внутри контейнера'
      ],
      hint: 'Используйте kubectl exec для выполнения команд. kubectl logs для логов. livenessProbe описывается в spec контейнера.',
      solution: '# pod-full.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: nginx-full\n  labels:\n    app: nginx\nspec:\n  containers:\n  - name: nginx\n    image: nginx:1.21\n    ports:\n    - containerPort: 80\n    env:\n    - name: APP_ENV\n      value: "production"\n    - name: APP_PORT\n      value: "80"\n    resources:\n      requests:\n        memory: "64Mi"\n        cpu: "100m"\n      limits:\n        memory: "128Mi"\n        cpu: "200m"\n    livenessProbe:\n      httpGet:\n        path: /\n        port: 80\n      initialDelaySeconds: 10\n      periodSeconds: 5\n\n# Применить\nkubectl apply -f pod-full.yaml\n\n# Проверить\nkubectl get pod nginx-full\nkubectl describe pod nginx-full\n\n# Логи\nkubectl logs nginx-full\n\n# Войти в контейнер\nkubectl exec -it nginx-full -- /bin/bash\n\n# Проверить переменные внутри контейнера\nkubectl exec nginx-full -- env | grep APP',
      explanation: 'Полная спецификация Pod включает metadata с labels, spec с containers. Каждый контейнер может иметь resources (requests гарантирует ресурсы, limits ограничивает). livenessProbe проверяет здоровье контейнера. kubectl exec позволяет запускать команды в работающем контейнере.'
    },
    {
      id: 7,
      title: 'Практика: Multi-container Pod с Sidecar',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Pod с двумя контейнерами: основным nginx и sidecar для логирования через общий Volume.',
      requirements: [
        'Создать Pod с двумя контейнерами',
        'Использовать emptyDir volume для обмена данными',
        'Основной контейнер пишет в /var/log/app',
        'Sidecar читает из /var/log/app',
        'Проверить логи каждого контейнера отдельно'
      ],
      hint: 'В kubectl logs используйте флаг -c для указания имени контейнера. emptyDir создаётся как пустая директория при старте Pod.',
      solution: '# sidecar-pod.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: sidecar-demo\nspec:\n  volumes:\n  - name: shared-logs\n    emptyDir: {}\n  containers:\n  - name: app\n    image: busybox\n    command: [\'sh\', \'-c\', \'while true; do echo "$(date) - app log" >> /var/log/app/app.log; sleep 5; done\']\n    volumeMounts:\n    - name: shared-logs\n      mountPath: /var/log/app\n  - name: log-reader\n    image: busybox\n    command: [\'sh\', \'-c\', \'tail -f /var/log/app/app.log\']\n    volumeMounts:\n    - name: shared-logs\n      mountPath: /var/log/app\n      readOnly: true\n\n# Применить\nkubectl apply -f sidecar-pod.yaml\n\n# Логи основного контейнера\nkubectl logs sidecar-demo -c app\n\n# Логи sidecar\nkubectl logs sidecar-demo -c log-reader\n\n# Follow логов sidecar\nkubectl logs -f sidecar-demo -c log-reader',
      explanation: 'emptyDir создаётся при старте Pod и удаляется при его остановке. Оба контейнера монтируют его в разные или одинаковые пути. readOnly: true в sidecar предотвращает случайную запись. kubectl logs -c <container-name> позволяет смотреть логи конкретного контейнера в multi-container Pod.'
    }
  ]
}
