export default {
  id: 19,
  title: 'Практикум: деплой реальных приложений',
  description: 'Практические задания по деплою реальных приложений в Kubernetes: от простых до сложных микросервисных систем',
  lessons: [
    {
      id: 1,
      title: 'Практика: Деплой статического сайта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Задеплойте статический сайт на nginx с кастомной конфигурацией через ConfigMap.',
      requirements: [
        'Создать ConfigMap с HTML контентом',
        'Создать Deployment с nginx монтирующий ConfigMap как volume',
        'Создать Service для доступа к сайту',
        'Создать Ingress для доступа по домену',
        'Проверить доступность сайта'
      ],
      hint: 'HTML файл можно хранить в ConfigMap под ключом index.html. Монтировать в /usr/share/nginx/html/.',
      solution: '# static-site.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: site-content\ndata:\n  index.html: |\n    <!DOCTYPE html>\n    <html>\n    <head><title>My K8s Site</title></head>\n    <body>\n    <h1>Hello from Kubernetes!</h1>\n    <p>Deployed with love using ConfigMap + nginx</p>\n    </body>\n    </html>\n  nginx.conf: |\n    server {\n      listen 80;\n      root /usr/share/nginx/html;\n      index index.html;\n      location / { try_files $uri $uri/ =404; }\n    }\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: static-site\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: static-site\n  template:\n    metadata:\n      labels:\n        app: static-site\n    spec:\n      volumes:\n      - name: site-content\n        configMap:\n          name: site-content\n          items:\n          - key: index.html\n            path: index.html\n      - name: nginx-conf\n        configMap:\n          name: site-content\n          items:\n          - key: nginx.conf\n            path: default.conf\n      containers:\n      - name: nginx\n        image: nginx:1.21\n        ports:\n        - containerPort: 80\n        volumeMounts:\n        - name: site-content\n          mountPath: /usr/share/nginx/html\n        - name: nginx-conf\n          mountPath: /etc/nginx/conf.d\n        resources:\n          requests:\n            cpu: 50m\n            memory: 64Mi\n          limits:\n            cpu: 100m\n            memory: 128Mi\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: static-site\nspec:\n  selector:\n    app: static-site\n  ports:\n  - port: 80\n    targetPort: 80\n\nkubectl apply -f static-site.yaml\nminikube service static-site --url',
      explanation: 'ConfigMap заменяет файловую систему для статического контента. Это позволяет обновлять содержимое сайта без пересборки образа — только обновить ConfigMap и перезапустить Pod (или дождаться автоматического обновления volume).'
    },
    {
      id: 2,
      title: 'Практика: Node.js API с базой данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните Node.js REST API с MongoDB. Используйте Secrets для паролей и ConfigMap для конфигурации.',
      requirements: [
        'Создать StatefulSet для MongoDB с PVC',
        'Создать Secret с паролем MongoDB',
        'Создать Deployment для Node.js API',
        'Связать API с MongoDB через Service DNS',
        'Настроить readiness probe для API'
      ],
      hint: 'Node.js API обращается к MongoDB через Service name: mongodb-service:27017. Используйте переменные окружения для URI подключения.',
      solution: '# mongo-secret.yaml\napiVersion: v1\nkind: Secret\nmetadata:\n  name: mongo-secret\ntype: Opaque\nstringData:\n  MONGO_INITDB_ROOT_USERNAME: admin\n  MONGO_INITDB_ROOT_PASSWORD: mongopassword123\n  MONGO_URI: mongodb://admin:mongopassword123@mongodb-service:27017/myapp?authSource=admin\n---\n# mongodb StatefulSet\napiVersion: v1\nkind: Service\nmetadata:\n  name: mongodb-service\nspec:\n  selector:\n    app: mongodb\n  ports:\n  - port: 27017\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: mongodb\nspec:\n  serviceName: mongodb-service\n  replicas: 1\n  selector:\n    matchLabels:\n      app: mongodb\n  template:\n    metadata:\n      labels:\n        app: mongodb\n    spec:\n      containers:\n      - name: mongodb\n        image: mongo:6\n        envFrom:\n        - secretRef:\n            name: mongo-secret\n        ports:\n        - containerPort: 27017\n        volumeMounts:\n        - name: mongo-data\n          mountPath: /data/db\n        resources:\n          requests:\n            memory: 256Mi\n            cpu: 100m\n          limits:\n            memory: 512Mi\n  volumeClaimTemplates:\n  - metadata:\n      name: mongo-data\n    spec:\n      accessModes: [ReadWriteOnce]\n      resources:\n        requests:\n          storage: 5Gi\n---\n# Node.js API Deployment (используем echo server для симуляции)\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nodejs-api\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: nodejs-api\n  template:\n    metadata:\n      labels:\n        app: nodejs-api\n    spec:\n      containers:\n      - name: api\n        image: hashicorp/http-echo\n        args: [\'-text=API OK (MongoDB: $(MONGO_URI))\']\n        env:\n        - name: MONGO_URI\n          valueFrom:\n            secretKeyRef:\n              name: mongo-secret\n              key: MONGO_URI\n        ports:\n        - containerPort: 5678\n        readinessProbe:\n          httpGet:\n            path: /\n            port: 5678\n          initialDelaySeconds: 5\n          periodSeconds: 5\n        resources:\n          requests:\n            cpu: 100m\n            memory: 128Mi\n\nkubectl apply -f node-app.yaml\nkubectl wait --for=condition=ready pod -l app=mongodb --timeout=120s\nkubectl wait --for=condition=ready pod -l app=nodejs-api --timeout=60s\nkubectl get all',
      explanation: 'Stateful приложение (MongoDB) деплоится как StatefulSet с PVC для постоянства данных. API Deployment подключается к MongoDB через Service DNS имя. Secret хранит чувствительные данные. readiness probe гарантирует что трафик идёт только к готовым Pod.'
    },
    {
      id: 3,
      title: 'Практика: Микросервисное приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разверните систему из трёх микросервисов: frontend, backend API, и кэш Redis. Настройте Ingress для маршрутизации.',
      requirements: [
        'Создать Redis StatefulSet для кэша',
        'Создать backend API Deployment',
        'Создать frontend Deployment',
        'Настроить Ingress с path-based маршрутизацией',
        'Проверить сквозной запрос frontend -> backend -> Redis'
      ],
      hint: 'Backend обращается к Redis через redis-service:6379. Frontend обращается к backend через backend-service. Ingress направляет /api на backend, / на frontend.',
      solution: '# microservices.yaml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: redis\nspec:\n  serviceName: redis-headless\n  replicas: 1\n  selector:\n    matchLabels:\n      app: redis\n  template:\n    metadata:\n      labels:\n        app: redis\n    spec:\n      containers:\n      - name: redis\n        image: redis:7-alpine\n        ports:\n        - containerPort: 6379\n        resources:\n          requests:\n            cpu: 50m\n            memory: 64Mi\n          limits:\n            memory: 128Mi\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: redis-service\nspec:\n  selector:\n    app: redis\n  ports:\n  - port: 6379\n---\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: backend-config\ndata:\n  REDIS_HOST: redis-service\n  REDIS_PORT: "6379"\n  PORT: "3000"\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: backend\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: backend\n  template:\n    metadata:\n      labels:\n        app: backend\n    spec:\n      containers:\n      - name: backend\n        image: hashicorp/http-echo\n        args: [\'-text=Backend: hits=$(redis-cli -h redis-service INCR hits)\']\n        ports:\n        - containerPort: 5678\n        envFrom:\n        - configMapRef:\n            name: backend-config\n        resources:\n          requests:\n            cpu: 100m\n            memory: 64Mi\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend-service\nspec:\n  selector:\n    app: backend\n  ports:\n  - port: 80\n    targetPort: 5678\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: frontend\n  template:\n    metadata:\n      labels:\n        app: frontend\n    spec:\n      containers:\n      - name: frontend\n        image: nginx:1.21-alpine\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            cpu: 50m\n            memory: 32Mi\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-service\nspec:\n  selector:\n    app: frontend\n  ports:\n  - port: 80\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: microservices-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /$2\nspec:\n  ingressClassName: nginx\n  rules:\n  - http:\n      paths:\n      - path: /api(/|$)(.*)\n        pathType: Prefix\n        backend:\n          service:\n            name: backend-service\n            port:\n              number: 80\n      - path: /()(.*)\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend-service\n            port:\n              number: 80\n\nkubectl apply -f microservices.yaml',
      explanation: 'Микросервисная архитектура: каждый сервис независим и масштабируется отдельно. Service DNS обеспечивает discovery. ConfigMap разделяет конфигурацию и код. Ingress объединяет все сервисы за одним IP с path-based маршрутизацией.'
    },
    {
      id: 4,
      title: 'Практика: Blue/Green деплой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Blue/Green стратегию деплоя вручную без простоя.',
      requirements: [
        'Создать Blue версию Deployment',
        'Создать Service указывающий на Blue',
        'Создать Green версию Deployment',
        'Переключить Service на Green без простоя',
        'Откатить на Blue при обнаружении проблем'
      ],
      hint: 'Service переключается изменением selector. В Blue: selector.version=blue, в Green: selector.version=green. Переключение мгновенное и без простоя.',
      solution: '# blue-green.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-blue\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: my-app\n      version: blue\n  template:\n    metadata:\n      labels:\n        app: my-app\n        version: blue\n    spec:\n      containers:\n      - name: app\n        image: hashicorp/http-echo\n        args: [\'-text=Blue version v1.0\']\n        ports:\n        - containerPort: 5678\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: app-service\nspec:\n  selector:\n    app: my-app\n    version: blue  # изначально указывает на Blue\n  ports:\n  - port: 80\n    targetPort: 5678\n\nkubectl apply -f blue-green.yaml\n\n# Проверить текущую версию\nkubectl run test --image=busybox --rm -it --restart=Never -- wget -qO- http://app-service\n# Вывод: Blue version v1.0\n\n# Создать Green Deployment\ncat <<EOF | kubectl apply -f -\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-green\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: my-app\n      version: green\n  template:\n    metadata:\n      labels:\n        app: my-app\n        version: green\n    spec:\n      containers:\n      - name: app\n        image: hashicorp/http-echo\n        args: [\'-text=Green version v2.0\']\n        ports:\n        - containerPort: 5678\nEOF\n\n# Дождаться готовности Green\nkubectl wait --for=condition=available deployment/app-green --timeout=60s\n\n# Переключить трафик на Green (мгновенно!)\nkubectl patch service app-service -p \'{"spec":{"selector":{"version":"green"}}}\'\n\n# Проверить\nkubectl run test --image=busybox --rm -it --restart=Never -- wget -qO- http://app-service\n# Вывод: Green version v2.0\n\n# Если проблема - мгновенный откат на Blue\nkubectl patch service app-service -p \'{"spec":{"selector":{"version":"blue"}}}\'\n\n# После успешной проверки - удалить Blue\nkubectl delete deployment app-blue',
      explanation: 'Blue/Green деплой поддерживает два идентичных окружения. Переключение происходит на уровне Service selector — мгновенно и без простоя. В отличие от rolling update, при Blue/Green сразу переключается 100% трафика. Откат столь же быстрый — один patch команда.'
    },
    {
      id: 5,
      title: 'Практика: Canary деплой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Canary деплой — постепенное перенаправление трафика на новую версию.',
      requirements: [
        'Запустить стабильную версию с 9 репликами',
        'Запустить canary версию с 1 репликой',
        'Убедиться что ~10% трафика идёт на canary',
        'Постепенно увеличить canary до 50%, потом 100%',
        'Полностью переключить на новую версию'
      ],
      hint: 'В Kubernetes canary реализуется через соотношение реплик. 9 stable + 1 canary = 10% на canary. Оба Deployment используют одинаковый label app, поэтому Service балансирует между ними.',
      solution: '# canary-deploy.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-stable\nspec:\n  replicas: 9  # 90% трафика\n  selector:\n    matchLabels:\n      app: canary-app\n      track: stable\n  template:\n    metadata:\n      labels:\n        app: canary-app\n        track: stable\n    spec:\n      containers:\n      - name: app\n        image: hashicorp/http-echo\n        args: [\'-text=Stable v1.0\']\n        ports:\n        - containerPort: 5678\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-canary\nspec:\n  replicas: 1  # 10% трафика\n  selector:\n    matchLabels:\n      app: canary-app\n      track: canary\n  template:\n    metadata:\n      labels:\n        app: canary-app\n        track: canary\n    spec:\n      containers:\n      - name: app\n        image: hashicorp/http-echo\n        args: [\'-text=Canary v2.0\']\n        ports:\n        - containerPort: 5678\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: canary-service\nspec:\n  selector:\n    app: canary-app  # балансирует между stable и canary\n  ports:\n  - port: 80\n    targetPort: 5678\n\nkubectl apply -f canary-deploy.yaml\n\n# Тест: ~10% запросов должны получить canary ответ\nfor i in $(seq 1 20); do\n  kubectl run test-$i --image=busybox --rm --restart=Never -i --quiet -- \\\n    wget -qO- http://canary-service 2>/dev/null\ndone\n\n# Постепенно увеличить canary до 50%\nkubectl scale deployment app-stable --replicas=5\nkubectl scale deployment app-canary --replicas=5\n\n# Полностью на canary\nkubectl scale deployment app-stable --replicas=0\nkubectl scale deployment app-canary --replicas=10\n\n# Удалить старую stable\nkubectl delete deployment app-stable',
      explanation: 'Canary деплой снижает риск: новая версия получает небольшой процент трафика. При проблемах — масштабируем canary до 0. Service балансирует пропорционально количеству Pod (round-robin). Для более точного контроля трафика используйте Istio или nginx annotations.'
    },
    {
      id: 6,
      title: 'Практика: Деплой WordPress с MySQL',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разверните WordPress с MySQL используя PVC, Secrets и всё изученное.',
      requirements: [
        'Создать PVC для MySQL и WordPress',
        'Создать Secrets для MySQL пароля',
        'Развернуть MySQL StatefulSet',
        'Развернуть WordPress Deployment',
        'Настроить доступ через NodePort'
      ],
      hint: 'WordPress ищет MySQL по переменной WORDPRESS_DB_HOST. Используйте имя Service: mysql-service. PVC для WordPress хранит медиафайлы и плагины.',
      solution: '# wordpress.yaml\napiVersion: v1\nkind: Secret\nmetadata:\n  name: mysql-secret\ntype: Opaque\nstringData:\n  MYSQL_ROOT_PASSWORD: rootpassword\n  MYSQL_DATABASE: wordpress\n  MYSQL_USER: wpuser\n  MYSQL_PASSWORD: wppassword\n---\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: mysql-pvc\nspec:\n  accessModes: [ReadWriteOnce]\n  resources:\n    requests:\n      storage: 5Gi\n---\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: wordpress-pvc\nspec:\n  accessModes: [ReadWriteOnce]\n  resources:\n    requests:\n      storage: 2Gi\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: mysql\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: mysql\n  template:\n    metadata:\n      labels:\n        app: mysql\n    spec:\n      volumes:\n      - name: mysql-data\n        persistentVolumeClaim:\n          claimName: mysql-pvc\n      containers:\n      - name: mysql\n        image: mysql:8.0\n        envFrom:\n        - secretRef:\n            name: mysql-secret\n        ports:\n        - containerPort: 3306\n        volumeMounts:\n        - name: mysql-data\n          mountPath: /var/lib/mysql\n        readinessProbe:\n          exec:\n            command: [\'mysqladmin\', \'ping\', \'-h\', \'localhost\']\n          initialDelaySeconds: 20\n          periodSeconds: 10\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: mysql-service\nspec:\n  selector:\n    app: mysql\n  ports:\n  - port: 3306\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: wordpress\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: wordpress\n  template:\n    metadata:\n      labels:\n        app: wordpress\n    spec:\n      volumes:\n      - name: wp-data\n        persistentVolumeClaim:\n          claimName: wordpress-pvc\n      containers:\n      - name: wordpress\n        image: wordpress:6-apache\n        env:\n        - name: WORDPRESS_DB_HOST\n          value: mysql-service:3306\n        - name: WORDPRESS_DB_NAME\n          value: wordpress\n        - name: WORDPRESS_DB_USER\n          valueFrom:\n            secretKeyRef:\n              name: mysql-secret\n              key: MYSQL_USER\n        - name: WORDPRESS_DB_PASSWORD\n          valueFrom:\n            secretKeyRef:\n              name: mysql-secret\n              key: MYSQL_PASSWORD\n        ports:\n        - containerPort: 80\n        volumeMounts:\n        - name: wp-data\n          mountPath: /var/www/html/wp-content\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: wordpress-service\nspec:\n  type: NodePort\n  selector:\n    app: wordpress\n  ports:\n  - port: 80\n    nodePort: 30080\n\nkubectl apply -f wordpress.yaml\nminikube service wordpress-service --url',
      explanation: 'WordPress требует MySQL с постоянными данными. Secrets хранят учётные данные БД. PVC для MySQL хранит данные, для WordPress — медиафайлы и плагины (wp-content). readiness probe для MySQL гарантирует что WordPress не стартует раньше БД.'
    },
    {
      id: 7,
      title: 'Практика: Автомасштабирование с HPA',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте Horizontal Pod Autoscaler и протестируйте автомасштабирование под нагрузкой.',
      requirements: [
        'Включить metrics-server в minikube',
        'Создать Deployment с requests.cpu',
        'Создать HPA с CPU target 50%',
        'Сгенерировать нагрузку на приложение',
        'Наблюдать за автоматическим масштабированием'
      ],
      hint: 'minikube addons enable metrics-server. Для нагрузки используйте kubectl run load-generator --image=busybox -- sh -c "while true; do wget -q -O- http://service; done".',
      solution: '# Включить metrics-server\nminikube addons enable metrics-server\n\n# Дождаться metrics-server\nkubectl wait --for=condition=available deployment/metrics-server \\\n  -n kube-system --timeout=120s\n\n# Deployment для тестирования\ncat <<EOF | kubectl apply -f -\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: php-apache\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: php-apache\n  template:\n    metadata:\n      labels:\n        app: php-apache\n    spec:\n      containers:\n      - name: php-apache\n        image: registry.k8s.io/hpa-example\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            cpu: 200m\n          limits:\n            cpu: 500m\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: php-apache\nspec:\n  selector:\n    app: php-apache\n  ports:\n  - port: 80\nEOF\n\n# Создать HPA\nkubectl autoscale deployment php-apache \\\n  --cpu-percent=50 \\\n  --min=1 \\\n  --max=10\n\n# Или через YAML:\ncat <<EOF | kubectl apply -f -\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: php-apache-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: php-apache\n  minReplicas: 1\n  maxReplicas: 10\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 50\nEOF\n\n# Генерировать нагрузку\nkubectl run load-generator --image=busybox \\\n  -- sh -c "while true; do wget -q -O- http://php-apache; done"\n\n# Наблюдать масштабирование\nwatch kubectl get hpa\nwatch kubectl get pods\n\n# Остановить нагрузку\nkubectl delete pod load-generator\n\n# HPA уменьшит реплики до минимума через 5 минут',
      explanation: 'HPA автоматически масштабирует Deployment на основе метрик. CPU utilization рассчитывается как фактическое использование / requests.cpu. При нагрузке HPA увеличивает реплики, при снижении — уменьшает (с задержкой 5 минут по умолчанию). metrics-server собирает метрики с kubelet.'
    },
    {
      id: 8,
      title: 'Практика: Job пайплайн обработки данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте пайплайн из нескольких Job: скачать данные, обработать, сохранить отчёт.',
      requirements: [
        'Создать PVC для обмена данными между Job',
        'Job 1: загрузить данные в shared PVC',
        'Job 2: обработать данные из PVC (зависит от Job 1)',
        'Job 3: создать отчёт',
        'Проверить результат в общем PVC'
      ],
      hint: 'Job выполняются последовательно вручную или через init контейнеры. Используйте PVC для передачи данных между шагами.',
      solution: '# pipeline.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: pipeline-data\nspec:\n  accessModes: [ReadWriteOnce]\n  resources:\n    requests:\n      storage: 1Gi\n---\n# Step 1: загрузить данные\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: pipeline-step1-download\nspec:\n  ttlSecondsAfterFinished: 300\n  template:\n    spec:\n      restartPolicy: OnFailure\n      volumes:\n      - name: data\n        persistentVolumeClaim:\n          claimName: pipeline-data\n      containers:\n      - name: download\n        image: busybox\n        command:\n        - sh\n        - -c\n        - |\n          echo "Step 1: Downloading data..."\n          for i in $(seq 1 100); do\n            echo "record_$i,value_$((RANDOM % 1000))"\n          done > /data/raw-data.csv\n          echo "Downloaded 100 records"\n          cat /data/raw-data.csv | wc -l\n        volumeMounts:\n        - name: data\n          mountPath: /data\n\nkubectl apply -f pipeline.yaml\nkubectl wait --for=condition=complete job/pipeline-step1-download --timeout=60s\n\n# Step 2: обработать\ncat <<EOF | kubectl apply -f -\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: pipeline-step2-process\nspec:\n  ttlSecondsAfterFinished: 300\n  template:\n    spec:\n      restartPolicy: OnFailure\n      volumes:\n      - name: data\n        persistentVolumeClaim:\n          claimName: pipeline-data\n      containers:\n      - name: process\n        image: busybox\n        command:\n        - sh\n        - -c\n        - |\n          echo "Step 2: Processing..."\n          awk -F, \'{sum += $2} END {print "Total:", sum, "Average:", sum/NR}\' /data/raw-data.csv > /data/stats.txt\n          echo "Processing complete:"\n          cat /data/stats.txt\n        volumeMounts:\n        - name: data\n          mountPath: /data\nEOF\nkubectl wait --for=condition=complete job/pipeline-step2-process --timeout=60s\n\n# Проверить результаты\nkubectl run verify --image=busybox --rm -it --restart=Never \\\n  --overrides=\'{"spec":{"volumes":[{"name":"data","persistentVolumeClaim":{"claimName":"pipeline-data"}}],"containers":[{"name":"verify","image":"busybox","command":["sh","-c","ls -la /data/ && cat /data/stats.txt"],"volumeMounts":[{"name":"data","mountPath":"/data"}]}]}}\' \\\n  -- echo "done"',
      explanation: 'Job пайплайн использует PVC как общее хранилище между шагами. Каждый Job ждёт завершения предыдущего. ttlSecondsAfterFinished автоматически очищает завершённые Job. Этот паттерн подходит для ETL и batch processing задач.'
    },
    {
      id: 9,
      title: 'Практика: Multi-namespace деплой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните одно приложение в трёх namespace (dev, staging, prod) с разными конфигурациями.',
      requirements: [
        'Создать три namespace с разными resource quotas',
        'Задеплоить приложение с разными replicas в каждый namespace',
        'Использовать разные ConfigMap для каждой среды',
        'Проверить изоляцию namespace',
        'Настроить cross-namespace коммуникацию'
      ],
      hint: 'Для каждого namespace создайте отдельный ConfigMap с APP_ENV соответствующим окружению. Для cross-namespace доступа используйте полное DNS имя: service.namespace.svc.cluster.local.',
      solution: '# Создать namespace\nfor ns in dev staging production; do\n  kubectl create namespace $ns\ndone\n\n# ConfigMap для каждой среды\nfor ns in dev staging production; do\n  replicas=1\n  [ "$ns" = "staging" ] && replicas=2\n  [ "$ns" = "production" ] && replicas=3\n\n  cat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\n  namespace: $ns\ndata:\n  APP_ENV: "$ns"\n  LOG_LEVEL: "$([ "$ns" = "production" ] && echo "warn" || echo "debug")"\n  REPLICAS: "$replicas"\nEOF\n\n  cat <<EOF | kubectl apply -f -\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\n  namespace: $ns\nspec:\n  replicas: $replicas\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n      - name: app\n        image: hashicorp/http-echo\n        args: [\'-text=Env: $ns, Replicas: $replicas\']\n        ports:\n        - containerPort: 5678\n        envFrom:\n        - configMapRef:\n            name: app-config\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: app-service\n  namespace: $ns\nspec:\n  selector:\n    app: myapp\n  ports:\n  - port: 80\n    targetPort: 5678\nEOF\ndone\n\n# Проверить\nkubectl get pods -A | grep app\n\n# Cross-namespace обращение\nkubectl run test -n dev --image=busybox --rm -it --restart=Never -- \\\n  wget -qO- http://app-service.production.svc.cluster.local',
      explanation: 'Multi-namespace паттерн обеспечивает изоляцию окружений в одном кластере. ConfigMap с разными значениями для каждого namespace позволяет одному Deployment иметь разную конфигурацию. Cross-namespace DNS: service.namespace.svc.cluster.local работает без NetworkPolicy ограничений.'
    },
    {
      id: 10,
      title: 'Практика: Отладка неработающих Pod',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найдите и исправьте намеренно сломанные манифесты Kubernetes используя инструменты отладки.',
      requirements: [
        'Диагностировать Pod застрявший в ImagePullBackOff',
        'Диагностировать Pod с CrashLoopBackOff',
        'Диагностировать Pod застрявший в Pending',
        'Диагностировать Service не достигающий Pod',
        'Исправить все проблемы'
      ],
      hint: 'kubectl describe pod показывает Events и причину проблемы. kubectl logs показывает логи контейнера. kubectl get events -n default покажет все события namespace.',
      solution: '# Сломанный Pod 1: ImagePullBackOff\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Pod\nmetadata:\n  name: broken-image\nspec:\n  containers:\n  - name: app\n    image: nginx:99.99-nonexistent\nEOF\n\n# Диагностика\nkubectl get pod broken-image\nkubectl describe pod broken-image\n# Events покажут: Failed to pull image\n\n# Исправить\nkubectl set image pod/broken-image app=nginx:1.21\n# Или удалить и создать с правильным образом\nkubectl delete pod broken-image\nkubectl run broken-image --image=nginx:1.21\n\n# Сломанный Pod 2: CrashLoopBackOff\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Pod\nmetadata:\n  name: crashloop-pod\nspec:\n  containers:\n  - name: app\n    image: busybox\n    command: [\'sh\', \'-c\', \'exit 1\']  # всегда падает\nEOF\n\n# Диагностика\nkubectl get pod crashloop-pod\nkubectl logs crashloop-pod\nkubectl logs crashloop-pod --previous\nkubectl describe pod crashloop-pod\n# Исправить\nkubectl delete pod crashloop-pod\nkubectl run crashloop-pod --image=busybox -- sleep 3600\n\n# Сломанный Pod 3: Pending (нет ресурсов или node selector не совпадает)\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pending-pod\nspec:\n  nodeSelector:\n    nonexistent-label: "true"\n  containers:\n  - name: app\n    image: nginx\nEOF\n\nkubectl describe pod pending-pod\n# Events: 0/1 nodes are available: 1 node(s) didn\'t match node selector\nkubectl delete pod pending-pod\n\n# Service не достигает Pod (неверный selector)\ncat <<EOF | kubectl apply -f -\napiVersion: v1\nkind: Pod\nmetadata:\n  name: target-pod\n  labels:\n    app: target\nspec:\n  containers:\n  - name: nginx\n    image: nginx:1.21\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: broken-service\nspec:\n  selector:\n    app: wrong-label  # не совпадает с Pod label!\n  ports:\n  - port: 80\nEOF\n\n# Диагностика\nkubectl get endpoints broken-service\n# Endpoints пустые!\nkubectl describe service broken-service\n# Исправить selector\nkubectl patch service broken-service -p \'{"spec":{"selector":{"app":"target"}}}\'\nkubectl get endpoints broken-service\n# Теперь показывает IP Pod',
      explanation: 'Отладка K8s: kubectl describe показывает Events и детали объекта. kubectl logs показывает вывод контейнера. kubectl get endpoints проверяет Service connectivity. Основные проблемы: неверный образ (ImagePullBackOff), ошибка приложения (CrashLoopBackOff), нет подходящих узлов (Pending), неверный selector (пустые Endpoints).'
    }
  ]
}
