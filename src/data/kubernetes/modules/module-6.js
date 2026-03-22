export default {
  id: 6,
  title: 'ConfigMap и Secrets: конфигурация и секреты',
  description: 'Управление конфигурацией приложений через ConfigMap и чувствительными данными через Secrets',
  lessons: [
    {
      id: 1,
      title: 'ConfigMap: хранение конфигурации',
      type: 'theory',
      content: [
        { type: 'text', value: 'ConfigMap хранит конфигурационные данные в виде пар ключ-значение. Это позволяет отделить конфигурацию от образа контейнера — менять настройки без пересборки образа.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  # Простые значения\n  APP_ENV: "production"\n  APP_PORT: "8080"\n  LOG_LEVEL: "info"\n  # Многострочные значения (файл конфигурации)\n  nginx.conf: |\n    server {\n      listen 80;\n      server_name example.com;\n      location / {\n        proxy_pass http://backend;\n      }\n    }\n  database.properties: |\n    db.host=postgres-service\n    db.port=5432\n    db.name=myapp' },
        { type: 'code', language: 'bash', value: '# Создать ConfigMap из команды\nkubectl create configmap app-config \\\n  --from-literal=APP_ENV=production \\\n  --from-literal=APP_PORT=8080\n\n# Из файла\nkubectl create configmap nginx-config --from-file=nginx.conf\n\n# Из директории\nkubectl create configmap configs --from-file=./config-dir/\n\n# Просмотр\nkubectl get configmap app-config -o yaml' }
      ]
    },
    {
      id: 2,
      title: 'Использование ConfigMap в Pod',
      type: 'theory',
      content: [
        { type: 'text', value: 'ConfigMap можно использовать в Pod двумя способами: как переменные окружения или как файлы через Volume.' },
        { type: 'heading', value: 'Как переменные окружения' },
        { type: 'code', language: 'yaml', value: 'spec:\n  containers:\n  - name: app\n    image: my-app\n    env:\n    # Одна переменная из ConfigMap\n    - name: APP_ENV\n      valueFrom:\n        configMapKeyRef:\n          name: app-config\n          key: APP_ENV\n    # Все ключи ConfigMap как переменные окружения\n    envFrom:\n    - configMapRef:\n        name: app-config' },
        { type: 'heading', value: 'Как Volume (файлы)' },
        { type: 'code', language: 'yaml', value: 'spec:\n  volumes:\n  - name: config-volume\n    configMap:\n      name: app-config\n      # Только определённые ключи как файлы:\n      items:\n      - key: nginx.conf\n        path: nginx.conf\n  containers:\n  - name: nginx\n    image: nginx\n    volumeMounts:\n    - name: config-volume\n      mountPath: /etc/nginx/conf.d\n      readOnly: true' },
        { type: 'tip', value: 'При монтировании ConfigMap как Volume файлы автоматически обновляются при изменении ConfigMap (с задержкой ~1 минуту). Переменные окружения обновляются только при перезапуске Pod.' }
      ]
    },
    {
      id: 3,
      title: 'Secrets: безопасное хранение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secret похож на ConfigMap, но предназначен для хранения чувствительных данных: паролей, токенов, сертификатов. Данные в Secret хранятся в base64 (не шифрование!), поэтому нужно настраивать шифрование at-rest в etcd.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: db-credentials\ntype: Opaque\ndata:\n  # Значения закодированы в base64\n  username: YWRtaW4=      # echo -n "admin" | base64\n  password: cGFzc3dvcmQ=  # echo -n "password" | base64\n# Или использовать stringData (Kubernetes сам кодирует):\n# stringData:\n#   username: admin\n#   password: mypassword' },
        { type: 'code', language: 'bash', value: '# Создать Secret из команды\nkubectl create secret generic db-credentials \\\n  --from-literal=username=admin \\\n  --from-literal=password=mypassword\n\n# TLS Secret\nkubectl create secret tls my-tls \\\n  --cert=tls.crt \\\n  --key=tls.key\n\n# Docker registry Secret\nkubectl create secret docker-registry regcred \\\n  --docker-server=registry.example.com \\\n  --docker-username=user \\\n  --docker-password=pass' },
        { type: 'warning', value: 'base64 — это кодирование, не шифрование! Любой, кто имеет доступ к etcd или может выполнить kubectl get secret, увидит данные. Для продакшена используйте шифрование at-rest и инструменты вроде Vault.' }
      ]
    },
    {
      id: 4,
      title: 'Использование Secrets в Pod',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secrets используются в Pod так же, как ConfigMap: переменные окружения или Volume. Kubernetes рекомендует монтировать как Volume — они автоматически обновляются и не видны в kubectl describe pod.' },
        { type: 'code', language: 'yaml', value: 'spec:\n  containers:\n  - name: app\n    image: my-app\n    # Как переменные окружения (менее безопасно)\n    env:\n    - name: DB_PASSWORD\n      valueFrom:\n        secretKeyRef:\n          name: db-credentials\n          key: password\n    # Все ключи Secret как переменные\n    envFrom:\n    - secretRef:\n        name: db-credentials\n    # Как Volume (более безопасно)\n    volumeMounts:\n    - name: secrets-volume\n      mountPath: /etc/secrets\n      readOnly: true\n  volumes:\n  - name: secrets-volume\n    secret:\n      secretName: db-credentials\n      defaultMode: 0400  # Только чтение владельцем' },
        { type: 'note', value: 'При монтировании Secret как Volume каждый ключ становится файлом. Приложение читает /etc/secrets/password для получения пароля. Это безопаснее переменных — их сложнее случайно залогировать.' }
      ]
    },
    {
      id: 5,
      title: 'Типы Secrets и Immutable ConfigMap',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kubernetes поддерживает несколько типов Secret для разных сценариев. С версии 1.21 ConfigMap и Secret можно сделать неизменяемыми (immutable).' },
        { type: 'heading', value: 'Типы Secrets' },
        { type: 'list', items: [
          'Opaque — произвольные данные (по умолчанию)',
          'kubernetes.io/service-account-token — токен ServiceAccount',
          'kubernetes.io/dockerconfigjson — учётные данные реестра образов',
          'kubernetes.io/tls — TLS сертификат и ключ',
          'kubernetes.io/basic-auth — логин и пароль',
          'kubernetes.io/ssh-auth — SSH ключ'
        ]},
        { type: 'heading', value: 'Immutable ConfigMap и Secret' },
        { type: 'code', language: 'yaml', value: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: stable-config\nimmutable: true  # Нельзя изменить после создания\ndata:\n  config.key: value\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: stable-secret\nimmutable: true\ntype: Opaque\ndata:\n  key: dmFsdWU=' },
        { type: 'tip', value: 'Immutable объекты улучшают производительность кластера при большом количестве ConfigMap/Secret — kubelet не проверяет их обновления. Также предотвращают случайные изменения в продакшене.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Конфигурация через ConfigMap',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте приложение, которое использует ConfigMap для конфигурации nginx и переменных окружения.',
      requirements: [
        'Создать ConfigMap с конфигурацией nginx',
        'Создать Deployment монтирующий ConfigMap как файл',
        'Добавить переменные окружения из ConfigMap',
        'Обновить ConfigMap и проверить применение изменений',
        'Проверить содержимое внутри контейнера'
      ],
      hint: 'Для проверки используйте kubectl exec. После изменения ConfigMap файл в Volume обновится автоматически, но переменные окружения — нет.',
      expectedOutput: 'kubectl exec -it deploy/nginx-configured -- env | grep APP:\nAPP_ENV=production\nAPP_VERSION=1.0.0\n\nkubectl exec -it deploy/nginx-configured -- cat /etc/nginx/conf.d/default.conf:\nserver {\n  listen 80;\n  location / {\n    return 200 "Hello from $hostname";\n    add_header Content-Type text/plain;\n  }\n  location /health {\n    return 200 "OK";\n  }\n}\n\nПосле изменения ConfigMap файл в /etc/nginx/conf.d обновляется автоматически через ~1 минуту.',
      solution: '# configmap.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: nginx-config\ndata:\n  APP_ENV: "production"\n  APP_VERSION: "1.0.0"\n  default.conf: |\n    server {\n      listen 80;\n      location / {\n        return 200 "Hello from $hostname";\n        add_header Content-Type text/plain;\n      }\n      location /health {\n        return 200 "OK";\n      }\n    }\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-configured\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: nginx-configured\n  template:\n    metadata:\n      labels:\n        app: nginx-configured\n    spec:\n      volumes:\n      - name: nginx-conf\n        configMap:\n          name: nginx-config\n          items:\n          - key: default.conf\n            path: default.conf\n      containers:\n      - name: nginx\n        image: nginx:1.21\n        envFrom:\n        - configMapRef:\n            name: nginx-config\n        volumeMounts:\n        - name: nginx-conf\n          mountPath: /etc/nginx/conf.d\n\nkubectl apply -f configmap.yaml\n\n# Проверить переменные\nkubectl exec -it deploy/nginx-configured -- env | grep APP\n\n# Проверить файл конфигурации\nkubectl exec -it deploy/nginx-configured -- cat /etc/nginx/conf.d/default.conf',
      explanation: 'ConfigMap разделяет конфигурацию и образ. Можно хранить файлы конфигурации и переменные вместе. Items позволяют монтировать только нужные ключи. envFrom монтирует все ключи как переменные окружения сразу.'
    },
    {
      id: 7,
      title: 'Практика: Secret для базы данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Secret с учётными данными БД и настройте Deployment для их безопасного использования.',
      requirements: [
        'Создать Secret с паролем и именем пользователя',
        'Смонтировать Secret как Volume',
        'Также добавить отдельные переменные из Secret',
        'Проверить что данные доступны в контейнере',
        'Убедиться что Secret не виден в kubectl describe'
      ],
      hint: 'kubectl describe pod не показывает значения переменных из Secret. kubectl exec -- cat /etc/secrets/password покажет файл с секретом.',
      expectedOutput: 'kubectl get secret db-creds -o yaml показывает данные в base64:\ndata:\n  password: U3VwZXJTZWNyZXQxMjM=\n  username: ZGJhZG1pbg==\n\nkubectl exec app-with-secret -- env | grep DB_USERNAME:\nDB_USERNAME=dbadmin\n\nkubectl exec app-with-secret -- cat /etc/secrets/password:\nSuperSecret123\n\nkubectl describe pod app-with-secret — в секции Env показывает:\nDB_USERNAME: <set to the key username in secret db-creds>  Optional: false\nЗначения скрыты.',
      solution: '# Создать Secret\nkubectl create secret generic db-creds \\\n  --from-literal=username=dbadmin \\\n  --from-literal=password=SuperSecret123 \\\n  --from-literal=host=postgres.example.com\n\n# Просмотр (значения в base64)\nkubectl get secret db-creds -o yaml\n\n# Декодировать\nkubectl get secret db-creds -o jsonpath="{.data.password}" | base64 -d\n\n# pod-with-secret.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: app-with-secret\nspec:\n  volumes:\n  - name: db-secret-volume\n    secret:\n      secretName: db-creds\n      defaultMode: 0400\n  containers:\n  - name: app\n    image: busybox\n    command: [\'sleep\', \'3600\']\n    env:\n    - name: DB_USERNAME\n      valueFrom:\n        secretKeyRef:\n          name: db-creds\n          key: username\n    volumeMounts:\n    - name: db-secret-volume\n      mountPath: /etc/secrets\n      readOnly: true\n\nkubectl apply -f pod-with-secret.yaml\n\n# Проверить переменную\nkubectl exec app-with-secret -- env | grep DB_USERNAME\n\n# Проверить файл\nkubectl exec app-with-secret -- cat /etc/secrets/password\n\n# describe не показывает значения\nkubectl describe pod app-with-secret',
      explanation: 'Secret хранит данные в base64, но они легко декодируются. Монтирование как Volume безопаснее переменных — случайный вывод переменных в логи может раскрыть секрет. defaultMode: 0400 ограничивает доступ к файлу.'
    }
  ]
}
