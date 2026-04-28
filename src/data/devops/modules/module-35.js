export default {
  id: 35,
  title: 'Chaos Engineering',
  description: 'Chaos Engineering — дисциплина экспериментирования с системой для выявления слабых мест и повышения устойчивости к сбоям.',
  lessons: [
    {
      id: 1,
      title: 'Принципы Chaos Engineering',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Chaos Engineering?' },
        { type: 'text', value: 'Chaos Engineering — это практика намеренного внесения сбоев в систему для проверки её устойчивости. Вместо того чтобы ждать сбоя в production, мы создаём контролируемые эксперименты. Принципы были разработаны Netflix для тестирования своей микросервисной архитектуры.' },
        { type: 'list', items: [
          'Постройте гипотезу о поведении системы при сбое',
          'Варьируйте реальные события: отказ сервера, сетевые задержки, исчерпание ресурсов',
          'Запускайте эксперименты в production (после staging)',
          'Автоматизируйте для непрерывного выполнения',
          'Минимизируйте blast radius — ограничивайте масштаб эксперимента'
        ] },
        { type: 'heading', value: 'Научный метод в Chaos Engineering' },
        { type: 'code', language: 'bash', value: '# Процесс Chaos Experiment:\n#\n# 1. STEADY STATE — определите нормальное поведение системы\n#    Метрики: latency p99 < 200ms, error rate < 0.1%, throughput > 1000 rps\n#\n# 2. HYPOTHESIS — сформулируйте гипотезу\n#    "При отказе одного из 3 pods latency не превысит 500ms\n#     и error rate останется ниже 1%"\n#\n# 3. EXPERIMENT — внесите сбой\n#    Убить 1 pod из 3 (kubectl delete pod)\n#\n# 4. OBSERVE — наблюдайте за метриками\n#    Prometheus + Grafana: latency, error rate, throughput\n#\n# 5. ANALYZE — сравните с гипотезой\n#    Latency вырос до 800ms? Гипотеза опровергнута!\n#\n# 6. FIX — исправьте обнаруженные проблемы\n#    Настроить readiness probe, увеличить replicas, добавить retry' },
        { type: 'heading', value: 'Типы экспериментов' },
        { type: 'list', items: [
          'Infrastructure — отказ сервера, диска, сети',
          'Application — отказ сервиса, исчерпание пула соединений',
          'Network — задержки, потеря пакетов, DNS failure',
          'Resource — CPU stress, memory exhaustion, disk full',
          'State — corrupted data, stale cache, split brain'
        ] },
        { type: 'warning', value: 'Всегда начинайте с staging окружения! Определите "abort conditions" — метрики, при достижении которых эксперимент автоматически останавливается. Уведомите команду перед запуском.' }
      ]
    },
    {
      id: 2,
      title: 'Chaos Monkey и инструменты Netflix',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Simian Army от Netflix' },
        { type: 'text', value: 'Netflix создал набор инструментов "Simian Army" для тестирования устойчивости. Chaos Monkey — самый известный: он случайно завершает VM/контейнеры в production для проверки, что система переживает отказы.' },
        { type: 'code', language: 'bash', value: '# Simian Army (Netflix):\n#\n# Chaos Monkey     — убивает случайные инстансы\n# Latency Monkey   — добавляет задержки к API-вызовам\n# Conformity Monkey — проверяет соответствие стандартам\n# Janitor Monkey   — удаляет неиспользуемые ресурсы\n# Security Monkey  — проверяет безопасность конфигураций\n# Chaos Gorilla    — отключает целую Availability Zone\n# Chaos Kong       — отключает целый регион' },
        { type: 'heading', value: 'Kube-monkey для Kubernetes' },
        { type: 'code', language: 'bash', value: '# Установка kube-monkey\nhelm repo add kubemonkey https://asobti.github.io/kube-monkey/charts/repo\nhelm install kube-monkey kubemonkey/kube-monkey \\\n  --namespace kube-system \\\n  --set config.dryRun=false \\\n  --set config.runHour=8 \\\n  --set config.startHour=10 \\\n  --set config.endHour=16 \\\n  --set config.timeZone=Europe/Moscow' },
        { type: 'code', language: 'yaml', value: '# Opt-in: Deployment должен иметь label для участия\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\n  labels:\n    kube-monkey/enabled: \"enabled\"\n    kube-monkey/identifier: \"myapp\"\n    kube-monkey/mtbf: \"2\"            # Mean Time Between Failures (дни)\n    kube-monkey/kill-mode: \"fixed\"\n    kube-monkey/kill-value: \"1\"      # Убить 1 pod за раз\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n        kube-monkey/enabled: \"enabled\"\n        kube-monkey/identifier: \"myapp\"' },
        { type: 'heading', value: 'Простые chaos-эксперименты вручную' },
        { type: 'code', language: 'bash', value: '# Ручные chaos-эксперименты с kubectl:\n\n# 1. Убить случайный pod\nkubectl delete pod $(kubectl get pods -l app=myapp -o name | shuf -n 1)\n\n# 2. Ограничить CPU контейнера\nkubectl patch deployment myapp -p \'{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"cpu":"50m"}}}]}}}}\'\n\n# 3. Убить все pods (проверка recreate)\nkubectl delete pods -l app=myapp --all\n\n# 4. Network partition (через NetworkPolicy)\nkubectl apply -f - <<EOF\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-backend\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  policyTypes: [\"Ingress\"]\n  ingress: []  # запретить весь входящий трафик\nEOF\n\n# 5. Заполнить диск\nkubectl exec myapp-pod -- dd if=/dev/zero of=/tmp/fill bs=1M count=500' },
        { type: 'tip', value: 'kube-monkey работает по расписанию и убивает pods только в рабочие часы. Opt-in через labels гарантирует, что только помеченные Deployments участвуют в экспериментах.' }
      ]
    },
    {
      id: 3,
      title: 'Litmus Chaos',
      type: 'theory',
      content: [
        { type: 'heading', value: 'LitmusChaos — платформа для Kubernetes' },
        { type: 'text', value: 'Litmus — полноценная платформа для Chaos Engineering в Kubernetes. Предоставляет ChaosHub с готовыми экспериментами, управление через CRD, визуальный dashboard и интеграцию с CI/CD.' },
        { type: 'code', language: 'bash', value: '# Установка LitmusChaos\nhelm repo add litmuschaos https://litmuschaos.github.io/litmus-helm/\nhelm install litmus litmuschaos/litmus \\\n  --namespace litmus \\\n  --create-namespace \\\n  --set portal.frontend.service.type=LoadBalancer\n\n# Или через kubectl\nkubectl apply -f https://litmuschaos.github.io/litmus/3.0.0/litmus-3.0.0.yaml\n\n# Доступ к ChaosCenter dashboard\nkubectl get svc -n litmus\n# Default: admin / litmus' },
        { type: 'heading', value: 'Chaos Experiment с Litmus' },
        { type: 'code', language: 'yaml', value: '# ChaosEngine — запуск эксперимента\napiVersion: litmuschaos.io/v1alpha1\nkind: ChaosEngine\nmetadata:\n  name: myapp-chaos\n  namespace: production\nspec:\n  engineState: active\n  appinfo:\n    appns: production\n    applabel: app=myapp\n    appkind: deployment\n  chaosServiceAccount: litmus-admin\n  experiments:\n    - name: pod-delete\n      spec:\n        components:\n          env:\n            - name: TOTAL_CHAOS_DURATION\n              value: \"60\"      # 60 секунд\n            - name: CHAOS_INTERVAL\n              value: \"10\"      # каждые 10 секунд\n            - name: FORCE\n              value: \"false\"\n            - name: PODS_AFFECTED_PERC\n              value: \"50\"      # 50% pods' },
        { type: 'code', language: 'yaml', value: '# Network chaos — задержки и потеря пакетов\napiVersion: litmuschaos.io/v1alpha1\nkind: ChaosEngine\nmetadata:\n  name: network-chaos\nspec:\n  engineState: active\n  appinfo:\n    appns: production\n    applabel: app=myapp\n    appkind: deployment\n  chaosServiceAccount: litmus-admin\n  experiments:\n    - name: pod-network-latency\n      spec:\n        components:\n          env:\n            - name: TOTAL_CHAOS_DURATION\n              value: \"120\"\n            - name: NETWORK_LATENCY\n              value: \"200\"     # 200ms задержка\n            - name: JITTER\n              value: \"50\"      # +-50ms\n            - name: DESTINATION_IPS\n              value: \"10.0.0.0/8\"  # к каким IP добавить\n    - name: pod-network-loss\n      spec:\n        components:\n          env:\n            - name: TOTAL_CHAOS_DURATION\n              value: \"60\"\n            - name: NETWORK_PACKET_LOSS_PERCENTAGE\n              value: \"30\"     # 30% потеря пакетов' },
        { type: 'note', value: 'Litmus ChaosHub содержит 50+ готовых экспериментов: pod-delete, node-drain, disk-fill, cpu-hog, memory-hog, network-latency, dns-chaos и другие.' }
      ]
    },
    {
      id: 4,
      title: 'Steady State Hypothesis',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Определение нормального состояния' },
        { type: 'text', value: 'Steady State Hypothesis (SSH) определяет нормальное поведение системы через измеримые метрики. Перед экспериментом проверяем SSH, вносим сбой, затем снова проверяем. Если SSH не выполняется после эксперимента — обнаружена проблема.' },
        { type: 'code', language: 'yaml', value: '# Пример Steady State Hypothesis:\n# steady_state_hypothesis:\n#   title: "Приложение работает нормально"\n#   probes:\n#     - type: http\n#       name: "Health endpoint returns 200"\n#       provider:\n#         type: http\n#         url: "http://myapp.production/health"\n#         expected_status: 200\n#         timeout: 3\n#\n#     - type: prometheus\n#       name: "Error rate below 1%"\n#       provider:\n#         type: prometheus\n#         url: "http://prometheus:9090"\n#         query: |\n#           sum(rate(http_requests_total{status=~\"5..\",app=\"myapp\"}[5m]))\n#           / sum(rate(http_requests_total{app=\"myapp\"}[5m])) * 100\n#         expected_result:\n#           operator: "<"\n#           value: 1\n#\n#     - type: prometheus\n#       name: "P99 latency below 500ms"\n#       provider:\n#         type: prometheus\n#         url: "http://prometheus:9090"\n#         query: |\n#           histogram_quantile(0.99,\n#             sum(rate(http_request_duration_seconds_bucket{app=\"myapp\"}[5m])) by (le))\n#         expected_result:\n#           operator: "<"\n#           value: 0.5' },
        { type: 'heading', value: 'Chaos Toolkit — декларативные эксперименты' },
        { type: 'code', language: 'bash', value: '# Установка Chaos Toolkit\npip install chaostoolkit chaostoolkit-kubernetes chaostoolkit-prometheus\n\n# Создание эксперимента (experiment.json)\n# {\n#   "title": "Pod deletion resilience",\n#   "description": "Verify app survives pod deletion",\n#   "steady-state-hypothesis": {\n#     "title": "App is healthy",\n#     "probes": [\n#       {\n#         "type": "probe",\n#         "name": "app-responds",\n#         "provider": {\n#           "type": "http",\n#           "url": "http://myapp.production/health"\n#         },\n#         "tolerance": 200\n#       }\n#     ]\n#   },\n#   "method": [\n#     {\n#       "type": "action",\n#       "name": "terminate-pod",\n#       "provider": {\n#         "type": "python",\n#         "module": "chaosk8s.pod.actions",\n#         "func": "terminate_pods",\n#         "arguments": {\n#           "label_selector": "app=myapp",\n#           "ns": "production",\n#           "qty": 1\n#         }\n#       },\n#       "pauses": { "after": 10 }\n#     }\n#   ],\n#   "rollbacks": []\n# }\n\n# Запуск эксперимента\nchaos run experiment.json' },
        { type: 'tip', value: 'Определите SLO-based steady state: доступность 99.9%, p99 latency < 500ms, error rate < 0.1%. Если chaos experiment нарушает SLO — это проблема, требующая исправления.' }
      ]
    },
    {
      id: 5,
      title: 'Game Days',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Организация Game Day' },
        { type: 'text', value: 'Game Day — это спланированное мероприятие, где команда проводит chaos-эксперименты и практикует реагирование на инциденты. Это учебные учения для DevOps/SRE команд, подобно пожарным учениям.' },
        { type: 'code', language: 'bash', value: '# Структура Game Day:\n#\n# 1. ПОДГОТОВКА (за 1-2 недели)\n#    - Определить scope (какие сервисы тестируем)\n#    - Определить эксперименты\n#    - Подготовить rollback план\n#    - Уведомить все команды\n#    - Настроить мониторинг/дашборды\n#\n# 2. ПРОВЕДЕНИЕ (2-4 часа)\n#    - Зафиксировать steady state\n#    - Последовательно вносить сбои\n#    - Наблюдать за метриками\n#    - Практиковать incident response\n#    - Документировать находки\n#\n# 3. REVIEW (после Game Day)\n#    - Обсудить результаты\n#    - Документировать обнаруженные проблемы\n#    - Создать задачи на исправление\n#    - Спланировать следующий Game Day' },
        { type: 'heading', value: 'Примеры сценариев Game Day' },
        { type: 'code', language: 'bash', value: '# Сценарий 1: Отказ зоны доступности\n# - Drain всех нод в одной AZ\n# - Ожидание: автоматический failover на другие AZ\nkubectl drain node-az-a-1 --ignore-daemonsets --delete-emptydir-data\nkubectl drain node-az-a-2 --ignore-daemonsets --delete-emptydir-data\n\n# Сценарий 2: Отказ базы данных\n# - Kill primary PostgreSQL pod\n# - Ожидание: автоматический failover на replica\nkubectl delete pod postgres-primary-0 --grace-period=0 --force\n\n# Сценарий 3: Перегрузка сервиса\n# - Направить 10x нормального трафика\n# - Ожидание: HPA масштабирует pods, rate limiting работает\nkubectl run load-test --image=grafana/k6 --rm -i --restart=Never -- \\\n  run -u 1000 -d 5m http://myapp/api\n\n# Сценарий 4: Certificate expiry\n# - Заменить TLS сертификат на просроченный\n# - Ожидание: мониторинг алертит, cert-manager обновляет\n\n# Сценарий 5: DNS failure\n# - Заблокировать DNS resolution\n# - Ожидание: circuit breaker, graceful degradation' },
        { type: 'heading', value: 'Автоматизация chaos в CI/CD' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions — chaos testing в staging\nname: Chaos Tests\non:\n  schedule:\n    - cron: "0 10 * * 1-5"  # Будни в 10:00\n\njobs:\n  chaos:\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Setup kubectl\n        uses: azure/setup-kubectl@v3\n\n      - name: Configure kubeconfig\n        run: echo "${{ secrets.STAGING_KUBECONFIG }}" | base64 -d > ~/.kube/config\n\n      - name: Run pod-delete experiment\n        run: |\n          chaos run experiments/pod-delete.json\n          if [ $? -ne 0 ]; then\n            echo "::error::Chaos experiment failed!"\n            # Отправить алерт\n            exit 1\n          fi\n\n      - name: Notify Slack\n        if: always()\n        uses: slackapi/slack-github-action@v1\n        with:\n          payload: |\n            {"text": "Chaos test result: ${{ job.status }}"}' },
        { type: 'tip', value: 'Начните с простых экспериментов (pod-delete) в staging. По мере зрелости переходите к более сложным (network chaos, zone failure) в production. Документируйте все эксперименты и результаты.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Chaos Experiment',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спланируйте и проведите chaos-эксперимент для веб-приложения в Kubernetes: определите steady state, внесите сбой, проанализируйте результаты.',
      requirements: [
        'Определите Steady State Hypothesis с конкретными метриками (latency, error rate)',
        'Создайте Litmus ChaosEngine для pod-delete эксперимента',
        'Настройте мониторинг метрик во время эксперимента (Prometheus)',
        'Проведите эксперимент с сетевой задержкой (200ms)',
        'Задокументируйте результаты и обнаруженные проблемы',
        'Создайте GitHub Actions workflow для автоматического запуска'
      ],
      hint: 'Начните с определения SSH через Prometheus queries. Используйте LitmusChaos ChaosEngine для pod-delete. Наблюдайте за метриками через Grafana.',
      expectedOutput: 'SSH before: latency p99=150ms, error_rate=0.05%\nChaos: pod-delete 1/3 pods\nSSH after: latency p99=250ms, error_rate=0.1%\nResult: PASSED — система пережила отказ 1 pod\n\nSSH before: latency p99=150ms\nChaos: network-latency 200ms\nSSH after: latency p99=450ms, timeouts=5%\nResult: FAILED — необходимо увеличить timeout и добавить retry',
      solution: '# 1. Steady State Hypothesis\n# - latency p99 < 300ms\n# - error rate < 0.5%\n# - all pods Running\n\n# 2. Pod-delete ChaosEngine\n# apiVersion: litmuschaos.io/v1alpha1\n# kind: ChaosEngine\n# metadata:\n#   name: myapp-pod-delete\n# spec:\n#   appinfo:\n#     appns: production\n#     applabel: app=myapp\n#   experiments:\n#     - name: pod-delete\n#       spec:\n#         components:\n#           env:\n#             - name: TOTAL_CHAOS_DURATION\n#               value: "60"\n#             - name: PODS_AFFECTED_PERC\n#               value: "30"\n\nkubectl apply -f chaos-engine.yaml\n\n# 3. Наблюдение\n# Prometheus: rate(http_requests_total{status=~"5.."}[1m])\n# Grafana: dashboard с latency, error rate, pod count\n\n# 4. Результаты и исправления\n# - Добавить PodDisruptionBudget (minAvailable: 2)\n# - Увеличить timeout на клиенте\n# - Добавить retry с exponential backoff',
      explanation: 'Chaos Engineering проверяет устойчивость системы через контролируемые эксперименты. Steady State Hypothesis определяет нормальное поведение. Pod-delete тестирует failover, network-latency тестирует timeout/retry логику. Обнаруженные проблемы исправляются, делая систему более устойчивой.'
    }
  ]
}
