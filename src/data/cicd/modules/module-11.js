export default {
  id: 11,
  title: 'Деплой: стратегии',
  description: 'Blue-Green, Rolling, Canary деплой — минимизируем downtime и риски при обновлении приложений.',
  lessons: [
    {
      id: 1,
      title: 'Проблема downtime при деплое',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наивный деплой: остановить старую версию, запустить новую. Проблема — пользователи видят ошибки во время обновления. Современные стратегии решают это.' },
        { type: 'heading', value: 'Стратегии деплоя' },
        { type: 'list', items: [
          'Recreate — остановить всё, запустить новое (downtime)',
          'Rolling Update — постепенно заменять старые инстансы новыми',
          'Blue-Green — параллельно запустить новую версию, переключить трафик',
          'Canary — направить часть трафика на новую версию',
          'A/B Testing — разные версии для разных групп пользователей'
        ]},
        { type: 'note', value: 'Выбор стратегии зависит от: требований к доступности, возможности откатиться, ресурсов инфраструктуры и сложности приложения.' }
      ]
    },
    {
      id: 2,
      title: 'Blue-Green деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Blue-Green: всегда запущены две идентичные среды — Blue (текущая) и Green (новая). Деплой идёт в Green, затем трафик переключается мгновенно.' },
        { type: 'code', language: 'bash', value: '#!/bin/bash\n# blue-green-deploy.sh\n\nCURRENT=$(docker ps --filter "label=env=production" --format "{{.Names}}" | head -1)\nNEW_COLOR="green"\n[ "$CURRENT" = "green-app" ] && NEW_COLOR="blue"\n\necho "Запуск $NEW_COLOR среды"\ndocker run -d \\\n  --name "${NEW_COLOR}-app" \\\n  --label "env=staging" \\\n  -p 8001:8000 \\\n  myapp:$VERSION\n\necho "Проверка новой версии"\nsleep 10\ncurl -f http://localhost:8001/health/ || { echo "Healthcheck упал!"; docker stop ${NEW_COLOR}-app; exit 1; }\n\necho "Переключение трафика на $NEW_COLOR"\nnginx -s reload  # изменить upstream в nginx конфиге\n\necho "Остановка старой версии"\ndocker stop $CURRENT && docker rm $CURRENT\necho "Blue-Green деплой завершён"' },
        { type: 'tip', value: 'Преимущество Blue-Green: мгновенный откат — просто переключить трафик обратно на Blue. Недостаток: нужно удвоенные ресурсы (два набора серверов).' }
      ]
    },
    {
      id: 3,
      title: 'Rolling Update',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rolling Update постепенно заменяет инстансы по одному (или группами). Kubernetes делает это нативно.' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Deployment с Rolling Update\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 4\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # одновременно создать +1 новый pod\n      maxUnavailable: 0  # ни один старый не останавливается пока новый не готов\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    spec:\n      containers:\n        - name: myapp\n          image: myapp:v2\n          readinessProbe:\n            httpGet:\n              path: /health/\n              port: 8000\n            initialDelaySeconds: 5\n            periodSeconds: 10' },
        { type: 'note', value: 'readinessProbe — Kubernetes не направляет трафик на Pod пока probe не вернёт успех. Это гарантирует: трафик идёт только на полностью готовые инстансы.' }
      ]
    },
    {
      id: 4,
      title: 'Canary деплой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Canary деплой: направляем небольшой процент трафика (5-10%) на новую версию. Если всё хорошо — постепенно увеличиваем до 100%.' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Canary через два Deployment\n# stable-deployment.yaml: 9 реплик с версией v1\n# canary-deployment.yaml: 1 реплика с версией v2\n# -> 10% трафика на v2\n\n# Nginx Ingress для распределения трафика\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: myapp-canary\n  annotations:\n    nginx.ingress.kubernetes.io/canary: "true"\n    nginx.ingress.kubernetes.io/canary-weight: "10"  # 10% на canary\nspec:\n  rules:\n    - host: example.com\n      http:\n        paths:\n          - path: /\n            backend:\n              service:\n                name: myapp-canary\n                port:\n                  number: 80' },
        { type: 'tip', value: 'Canary идеален для критичных изменений. Запустил на 1% — мониторишь ошибки и latency. Если OK — 10%, 25%, 50%, 100%. При проблемах откатить — просто убрать canary.' }
      ]
    },
    {
      id: 5,
      title: 'Деплой через GitHub Actions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Практическая реализация деплоя в GitHub Actions: SSH деплой, kubectl apply, docker-compose update.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  deploy:\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      # kubectl деплой\n      - uses: actions/checkout@v4\n      - uses: azure/setup-kubectl@v4\n\n      - name: Конфигурация kubectl\n        run: |\n          mkdir -p ~/.kube\n          echo "${{ secrets.KUBECONFIG }}" | base64 -d > ~/.kube/config\n\n      - name: Обновить образ\n        run: |\n          kubectl set image deployment/myapp \\\n            myapp=ghcr.io/${{ github.repository }}:${{ github.sha }}\n\n      - name: Ждать rollout\n        run: kubectl rollout status deployment/myapp --timeout=5m\n\n      - name: Откатиться при ошибке\n        if: failure()\n        run: kubectl rollout undo deployment/myapp' },
        { type: 'tip', value: 'kubectl rollout status блокирует выполнение пока деплой не завершится. Без этой команды GitHub Actions job завершится сразу после kubectl set image, не дожидаясь готовности новых подов.' },
        { type: 'list', items: [
          'kubectl set image — обновить образ у существующего Deployment',
          'kubectl apply -f — применить изменения из YAML манифестов',
          'kubectl rollout status — ждать завершения деплоя (блокирующий вызов)',
          'kubectl rollout undo — откатить к предыдущей версии',
          'kubectl rollout history — история деплоев (для выбора версии отката)'
        ]},
        { type: 'note', value: 'KUBECONFIG в secrets должен быть закодирован в base64 для безопасной передачи. Используй минимальные права для сервисного аккаунта — только namespace нужного приложения, только права на update deployments.' }
      ]
    },
    {
      id: 6,
      title: 'Feature flags — деплой без деплоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature flags позволяют включать/выключать фичи без нового деплоя. Код уже в продакшене, но скрыт флагом.' },
        { type: 'code', language: 'bash', value: '# Концепция feature flags\n# flagsmith, LaunchDarkly, unleash — готовые решения\n\n# Django пример с простым флагом в БД:\n# class FeatureFlag(models.Model):\n#     name = models.CharField(max_length=100, unique=True)\n#     is_enabled = models.BooleanField(default=False)\n#\n# if FeatureFlag.objects.filter(name="new_checkout", is_enabled=True).exists():\n#     return new_checkout_view(request)\n# else:\n#     return old_checkout_view(request)\n\n# Преимущества:\n# - Деплой кода отделён от включения фичи\n# - Можно включить для 1% пользователей\n# - Мгновенный откат без нового деплоя\necho "Feature flags — современная практика CD"' },
        { type: 'heading', value: 'Типы feature flags' },
        { type: 'list', items: [
          'Release flags — скрывают незавершённые фичи до готовности',
          'Experiment flags — A/B тестирование для разных групп пользователей',
          'Ops flags — быстрое отключение проблемных функций без деплоя',
          'Permission flags — включение фич для конкретных пользователей или ролей'
        ]},
        { type: 'tip', value: 'Не накапливай feature flags — удаляй их после включения фичи для всех пользователей. Технический долг от старых флагов усложняет код и затрудняет понимание бизнес-логики.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Blue-Green деплой скрипт',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай GitHub Actions workflow с Blue-Green деплоем через docker-compose.',
      requirements: [
        'Два docker-compose файла: docker-compose.blue.yml и docker-compose.green.yml (разные порты: 8001, 8002)',
        'Скрипт определяет текущую активную версию (blue/green)',
        'Деплой в неактивную версию',
        'Healthcheck новой версии перед переключением',
        'Nginx reload для переключения трафика',
        'Откат если healthcheck не прошёл'
      ],
      expectedOutput: 'Текущая: blue (порт 8001)\nЗапуск green (порт 8002)\nHealthcheck green: OK\nPереключение nginx на green\nОстановка blue',
      hint: 'Проверять активную версию можно через curl к обоим портам или через метку в файле .current-version.',
      solution: '# .github/workflows/blue-green.yml\nname: Blue-Green Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n      - uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.SERVER_HOST }}\n          username: ubuntu\n          key: ${{ secrets.SSH_PRIVATE_KEY }}\n          script: |\n            cd /app\n            git pull origin main\n\n            # Определяем текущую версию\n            CURRENT=$(cat .current-version 2>/dev/null || echo "blue")\n            if [ "$CURRENT" = "blue" ]; then NEW="green"; PORT=8002; else NEW="blue"; PORT=8001; fi\n            echo "Деплой в $NEW (порт $PORT)"\n\n            # Запускаем новую версию\n            docker-compose -f docker-compose.$NEW.yml up -d --build\n\n            # Healthcheck\n            sleep 15\n            if curl -f http://localhost:$PORT/health/; then\n              echo "Переключаем на $NEW"\n              echo $NEW > .current-version\n              # Перезагружаем nginx с новым upstream\n              sudo nginx -s reload\n              # Останавливаем старую версию\n              docker-compose -f docker-compose.$CURRENT.yml down\n            else\n              echo "Откат!"\n              docker-compose -f docker-compose.$NEW.yml down\n              exit 1\n            fi',
      explanation: '.current-version файл хранит активную версию на сервере — простой способ без внешних инструментов. cat file 2>/dev/null || echo "blue" — дефолт если файл не существует. Откат автоматический: просто останавливаем новую версию.'
    }
  ]
}
