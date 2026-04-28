export default {
  id: 21,
  title: 'CI/CD для микросервисов',
  description: 'CI/CD пайплайны для микросервисов: mono-repo vs multi-repo, независимый деплой, GitOps, ArgoCD, стратегии деплоя.',
  lessons: [
    {
      id: 1,
      title: 'Mono-repo vs Multi-repo',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основной вопрос: хранить все микросервисы в одном репозитории (mono-repo) или в отдельных (multi-repo). Оба подхода имеют trade-offs.' },
        { type: 'code', language: 'bash', value: '# Mono-repo:\n# shop/\n#   services/\n#     user-service/\n#     order-service/\n#     payment-service/\n#   libs/\n#     common-lib/\n#   infrastructure/\n#     docker-compose.yml\n#     kubernetes/\n\n# Плюсы mono-repo:\n# + Атомарные изменения через несколько сервисов\n# + Общие библиотеки (common-lib) доступны напрямую\n# + Проще рефакторинг (одна IDE, один commit)\n# + Единый CI/CD пайплайн\n# Минусы: большой repo, сложная CI (нужно определять что изменилось)\n\n# Multi-repo:\n# user-service/     (отдельный git repo)\n# order-service/    (отдельный git repo)\n# payment-service/  (отдельный git repo)\n# common-lib/       (отдельный git repo, npm/maven artifact)\n\n# Плюсы multi-repo:\n# + Независимость команд\n# + Простой CI (один repo = один pipeline)\n# + Чёткое владение (team owns repo)\n# + Независимые версии\n# Минусы: сложнее общие библиотеки, cross-cutting changes' },
        { type: 'tip', value: 'Google, Meta используют mono-repo с кастомными инструментами (Bazel). Netflix, Amazon — multi-repo. Для большинства команд multi-repo проще начать, mono-repo выигрывает при тесном взаимодействии сервисов.' }
      ]
    },
    {
      id: 2,
      title: 'CI Pipeline для микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI (Continuous Integration) для микросервиса: сборка, тесты, создание Docker-образа, push в registry, сканирование уязвимостей. Каждый сервис — свой pipeline.' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions — CI для order-service\nname: Order Service CI\non:\n  push:\n    branches: [main]\n    paths: [\"services/order-service/**\"]  # Mono-repo: запуск при изменении\n  pull_request:\n    branches: [main]\n    paths: [\"services/order-service/**\"]\n\nenv:\n  IMAGE: ghcr.io/shop/order-service\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env:\n          POSTGRES_DB: test\n          POSTGRES_PASSWORD: test\n        ports: [5432:5432]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with:\n          java-version: 21\n          distribution: temurin\n      - name: Run tests\n        working-directory: services/order-service\n        run: ./gradlew test\n      - name: Upload test results\n        uses: actions/upload-artifact@v4\n        with:\n          name: test-results\n          path: services/order-service/build/reports/tests/\n\n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build Docker image\n        run: |\n          docker build -t $IMAGE:${{ github.sha }} services/order-service/\n          docker tag $IMAGE:${{ github.sha }} $IMAGE:latest\n      - name: Scan for vulnerabilities\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: ${{ env.IMAGE }}:${{ github.sha }}\n          severity: CRITICAL,HIGH\n      - name: Push to Registry\n        run: |\n          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin\n          docker push $IMAGE:${{ github.sha }}\n          docker push $IMAGE:latest' },
        { type: 'note', value: 'В mono-repo используйте paths filter чтобы CI запускался только при изменении конкретного сервиса. Без этого каждый commit запустит CI для ВСЕХ сервисов.' }
      ]
    },
    {
      id: 3,
      title: 'CD и GitOps с ArgoCD',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitOps — подход где Git является единственным источником правды для состояния инфраструктуры. ArgoCD следит за Git-репозиторием и синхронизирует Kubernetes кластер с описанием в Git.' },
        { type: 'code', language: 'yaml', value: '# ArgoCD Application\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: order-service\n  namespace: argocd\nspec:\n  project: shop\n  source:\n    repoURL: https://github.com/shop/k8s-manifests\n    targetRevision: main\n    path: services/order-service\n    helm:\n      valueFiles:\n        - values-prod.yaml\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: shop\n  syncPolicy:\n    automated:\n      prune: true      # Удалять ресурсы отсутствующие в Git\n      selfHeal: true   # Восстанавливать при ручных изменениях\n    syncOptions:\n      - CreateNamespace=true' },
        { type: 'code', language: 'bash', value: '# GitOps Workflow:\n# 1. Developer: push code -> GitHub (service repo)\n# 2. CI: build -> test -> Docker image -> push to registry\n# 3. CI: update image tag in k8s-manifests repo\n# 4. ArgoCD: detect change in k8s-manifests -> sync -> deploy\n\n# CI обновляет image tag в манифестах:\n- name: Update K8s manifests\n  run: |\n    git clone https://github.com/shop/k8s-manifests\n    cd k8s-manifests\n    # Обновляем tag в values файле\n    yq -i \'.image.tag = \"${{ github.sha }}\"\' services/order-service/values-prod.yaml\n    git add .\n    git commit -m "chore: update order-service to ${{ github.sha }}"\n    git push\n    # ArgoCD автоматически подхватит изменение!' },
        { type: 'tip', value: 'GitOps преимущества: полная история изменений (git log), откат через git revert, PR-based деплой (review перед production), декларативная конфигурация. ArgoCD — самый популярный GitOps инструмент для Kubernetes.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии деплоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стратегии деплоя определяют как новая версия заменяет старую. Rolling Update, Blue-Green, Canary — каждая стратегия имеет свои trade-offs по скорости, безопасности и сложности.' },
        { type: 'code', language: 'yaml', value: '# Rolling Update — постепенная замена\n# Pod 1: v1 -> v2\n# Pod 2: v1 (ждём) -> v2\n# Pod 3: v1 (ждём) -> v2\n# Zero downtime, но обе версии работают одновременно\n\n# Blue-Green — два полных окружения\n# Blue (текущий):  v1 (3 Pods) <- трафик\n# Green (новый):   v2 (3 Pods)\n# Переключение: трафик Blue -> Green мгновенно\n# Откат: трафик Green -> Blue мгновенно\n\n# Canary с Argo Rollouts\napiVersion: argoproj.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: order-service\nspec:\n  replicas: 5\n  strategy:\n    canary:\n      steps:\n        - setWeight: 10    # 10% трафика на новую версию\n        - pause:\n            duration: 5m   # Наблюдаем 5 минут\n        - setWeight: 30    # 30% трафика\n        - pause:\n            duration: 5m\n        - setWeight: 60    # 60% трафика\n        - pause:\n            duration: 5m\n        - setWeight: 100   # 100% — полный деплой\n      # Автоматический откат при ошибках\n      analysis:\n        templates:\n          - templateName: success-rate\n        startingStep: 1\n        args:\n          - name: service\n            value: order-service\n\n---\n# AnalysisTemplate — автоматическая проверка\napiVersion: argoproj.io/v1alpha1\nkind: AnalysisTemplate\nmetadata:\n  name: success-rate\nspec:\n  metrics:\n    - name: success-rate\n      interval: 60s\n      successCondition: result[0] > 0.95  # >95% успешных\n      provider:\n        prometheus:\n          address: http://prometheus:9090\n          query: |\n            sum(rate(http_server_requests_seconds_count{status=~\"2..\",app=\"{{args.service}}\"}[5m]))\n            / sum(rate(http_server_requests_seconds_count{app=\"{{args.service}}\"}[5m]))' },
        { type: 'warning', value: 'Canary с автоматическим анализом — самая безопасная стратегия. При error rate > 5% автоматически откатывает. Но требует: Argo Rollouts, Prometheus метрики, правильные AnalysisTemplates.' }
      ]
    },
    {
      id: 5,
      title: 'Feature Flags',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature Flags позволяют деплоить код без активации функционала. Новая функция скрыта за флагом и включается для определённых пользователей. Разделяет деплой (техническое) от релиза (бизнесовое).' },
        { type: 'code', language: 'java', value: '// Feature Flags с Unleash / LaunchDarkly\n@Service\npublic class OrderService {\n    private final FeatureFlagClient featureFlags;\n\n    public OrderResponse createOrder(CreateOrderRequest request, User user) {\n        Order order = new Order(request);\n\n        // Feature Flag: новый алгоритм расчёта скидки\n        if (featureFlags.isEnabled("new-discount-algorithm\", user.getId())) {\n            order.setDiscount(newDiscountService.calculate(order));\n        } else {\n            order.setDiscount(legacyDiscountService.calculate(order));\n        }\n\n        // Feature Flag: интеграция с новым Payment Provider\n        if (featureFlags.isEnabled(\"stripe-payments\")) {\n            paymentService.processWithStripe(order);\n        } else {\n            paymentService.processWithLegacy(order);\n        }\n\n        return OrderResponse.from(orderRepository.save(order));\n    }\n}\n\n// Типы Feature Flags:\n// Release Flag:   скрыть незавершённую функцию (временный)\n// Experiment Flag: A/B тест (10% пользователей видят новый UI)\n// Ops Flag:        отключить функцию при проблемах (kill switch)\n// Permission Flag: функция для premium пользователей' },
        { type: 'tip', value: 'Feature Flags отделяют деплой от релиза. Деплойте в production каждый день, включайте функции когда готовы. Kill switch: если новая функция вызывает проблемы — выключите флагом за секунды, без rollback.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CI/CD pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте полный CI/CD pipeline для микросервиса: GitHub Actions CI, ArgoCD CD, canary deployment.',
      requirements: [
        'Создайте GitHub Actions workflow: test, build Docker, push to registry',
        'Настройте vulnerability scanning с Trivy',
        'Создайте GitOps репозиторий с Helm values для prod',
        'Настройте ArgoCD Application для автоматического деплоя',
        'Реализуйте Canary deployment с Argo Rollouts',
        'Добавьте автоматический откат при error rate > 5%'
      ],
      hint: 'GitHub Actions: on push -> test -> docker build -> docker push -> update GitOps repo. ArgoCD: sync with GitOps repo. Argo Rollouts: Rollout resource с canary strategy + AnalysisTemplate.',
      expectedOutput: 'Push в main -> GitHub Actions:\n  1. Tests passed (2 min)\n  2. Docker image built and pushed (1 min)\n  3. Trivy: 0 CRITICAL vulnerabilities\n  4. GitOps repo updated with new tag\n\nArgoCD detected change:\n  1. Canary: 10% traffic to v1.3.0\n  2. Analysis: success rate 98% > 95% threshold\n  3. Canary: 30% -> 60% -> 100%\n  4. Deployment complete!\n\nОшибка: success rate 90% < 95%:\n  ArgoCD: automatic rollback to v1.2.0.',
      solution: '# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: ./gradlew test\n  build:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t ghcr.io/shop/order-service:${{ github.sha }} .\n      - uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: ghcr.io/shop/order-service:${{ github.sha }}\n      - run: docker push ghcr.io/shop/order-service:${{ github.sha }}\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    steps:\n      - run: |\n          git clone https://github.com/shop/k8s-manifests\n          cd k8s-manifests\n          yq -i \'.image.tag = "${{ github.sha }}"\' order-service/values.yaml\n          git commit -am "update order-service"\n          git push',
      explanation: 'CI/CD для микросервисов: CI проверяет качество кода (тесты, сканирование), CD доставляет в production. GitOps через ArgoCD гарантирует что состояние кластера = состояние Git. Canary deployment с автоматическим анализом — самый безопасный способ деплоя. Feature Flags дополняют, позволяя включать функции независимо от деплоя.'
    }
  ]
}
