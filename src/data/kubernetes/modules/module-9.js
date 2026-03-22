export default {
  id: 9,
  title: 'Ingress: nginx, TLS, path-based и host-based маршрутизация',
  description: 'Управление входящим HTTP/HTTPS трафиком с Ingress Controller: маршрутизация, TLS, аннотации',
  lessons: [
    {
      id: 1,
      title: 'Что такое Ingress?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ingress — объект Kubernetes, который управляет внешним доступом к сервисам кластера. Он предоставляет маршрутизацию HTTP/HTTPS, терминацию TLS и виртуальный хостинг. Один Ingress заменяет множество LoadBalancer Service.' },
        { type: 'heading', value: 'Ingress vs Service типа LoadBalancer' },
        { type: 'list', items: [
          'LoadBalancer: один IP на сервис (дорого в облаке), нет HTTP маршрутизации',
          'Ingress: один IP для всех сервисов, маршрутизация по пути и хосту',
          'Ingress: TLS терминация в одном месте',
          'Ingress: переадресация, rate limiting, аутентификация через аннотации'
        ]},
        { type: 'text', value: 'Ingress — это только правила. Для их применения нужен Ingress Controller (nginx, Traefik, HAProxy, Istio Gateway и др.). Сам по себе Ingress объект ничего не делает.' },
        { type: 'code', language: 'bash', value: '# Включить nginx Ingress в minikube\nminikube addons enable ingress\nkubectl get pods -n ingress-nginx\n\n# Установить nginx Ingress через Helm (в обычном кластере)\nhelm upgrade --install ingress-nginx ingress-nginx \\\n  --repo https://kubernetes.github.io/ingress-nginx \\\n  --namespace ingress-nginx --create-namespace' }
      ]
    },
    {
      id: 2,
      title: 'Path-based маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Path-based маршрутизация направляет трафик на разные сервисы в зависимости от пути URL. Все сервисы доступны через один IP и порт.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: path-based-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /\nspec:\n  ingressClassName: nginx\n  rules:\n  - http:\n      paths:\n      - path: /api\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 80\n      - path: /web\n        pathType: Prefix\n        backend:\n          service:\n            name: web-service\n            port:\n              number: 80\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: default-service\n            port:\n              number: 80' },
        { type: 'heading', value: 'Типы pathType' },
        { type: 'list', items: [
          'Exact — точное совпадение пути (/api совпадает только с /api)',
          'Prefix — префиксное совпадение (/api совпадает с /api, /api/v1, /api/users)',
          'ImplementationSpecific — поведение определяет Ingress Controller'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Host-based маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Host-based маршрутизация (virtual hosting) направляет трафик на разные сервисы в зависимости от заголовка Host. Несколько доменов через один IP.' },
        { type: 'code', language: 'yaml', value: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: host-based-ingress\nspec:\n  ingressClassName: nginx\n  rules:\n  - host: api.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 80\n  - host: www.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: web-service\n            port:\n              number: 80\n  - host: admin.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: admin-service\n            port:\n              number: 80' },
        { type: 'tip', value: 'Для локального тестирования добавьте в /etc/hosts: <minikube-ip> api.example.com www.example.com admin.example.com. Получить IP: minikube ip.' }
      ]
    },
    {
      id: 4,
      title: 'TLS/HTTPS в Ingress',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ingress поддерживает TLS терминацию. TLS сертификат хранится в Secret типа kubernetes.io/tls. Ingress Controller расшифровывает HTTPS и передаёт HTTP внутрь кластера.' },
        { type: 'heading', value: 'Создание самоподписанного сертификата (для тестов)' },
        { type: 'code', language: 'bash', value: '# Создать самоподписанный сертификат\nopenssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n  -keyout tls.key -out tls.crt \\\n  -subj "/CN=example.com/O=MyOrg"\n\n# Создать TLS Secret\nkubectl create secret tls example-tls \\\n  --cert=tls.crt \\\n  --key=tls.key' },
        { type: 'heading', value: 'Ingress с TLS' },
        { type: 'code', language: 'yaml', value: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: tls-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"  # HTTP -> HTTPS\nspec:\n  ingressClassName: nginx\n  tls:\n  - hosts:\n    - api.example.com\n    - www.example.com\n    secretName: example-tls  # один сертификат для обоих хостов (SAN)\n  rules:\n  - host: api.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 80' },
        { type: 'note', value: 'Для автоматического получения Let\'s Encrypt сертификатов используйте cert-manager. Он автоматически создаёт и обновляет TLS Secret для Ingress.' }
      ]
    },
    {
      id: 5,
      title: 'Аннотации nginx Ingress',
      type: 'theory',
      content: [
        { type: 'text', value: 'nginx Ingress Controller поддерживает множество аннотаций для тонкой настройки поведения. Аннотации добавляются в metadata.annotations Ingress.' },
        { type: 'code', language: 'yaml', value: 'metadata:\n  annotations:\n    # Rewrite\n    nginx.ingress.kubernetes.io/rewrite-target: /$2\n    # Rate limiting\n    nginx.ingress.kubernetes.io/limit-rps: "10"\n    nginx.ingress.kubernetes.io/limit-connections: "5"\n    # Timeout\n    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"\n    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"\n    # CORS\n    nginx.ingress.kubernetes.io/enable-cors: "true"\n    nginx.ingress.kubernetes.io/cors-allow-origin: "https://example.com"\n    # Basic Auth\n    nginx.ingress.kubernetes.io/auth-type: basic\n    nginx.ingress.kubernetes.io/auth-secret: basic-auth-secret\n    # Whitelist IP\n    nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,192.168.0.0/16"\n    # Размер тела запроса\n    nginx.ingress.kubernetes.io/proxy-body-size: "10m"\n    # WebSocket\n    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"\n    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка Ingress с маршрутизацией',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте несколько сервисов и настройте Ingress с host-based и path-based маршрутизацией.',
      requirements: [
        'Создать два Deployment (frontend и api)',
        'Создать ClusterIP Service для каждого',
        'Создать Ingress с path-based маршрутизацией',
        'Создать Ingress с host-based маршрутизацией',
        'Проверить доступность через curl с правильными заголовками'
      ],
      hint: 'Для тестирования host-based маршрутизации используйте -H "Host: api.example.com" в curl. Для path-based просто укажите правильный путь.',
      expectedOutput: 'curl http://$MINIKUBE_IP/:\nFrontend Response\n\ncurl http://$MINIKUBE_IP/api:\nAPI Response\n\ncurl -H "Host: www.example.com" http://$MINIKUBE_IP/:\nFrontend Response\n\ncurl -H "Host: api.example.com" http://$MINIKUBE_IP/:\nAPI Response\n\nkubectl get ingress:\nNAME           CLASS   HOSTS   ADDRESS        PORTS\npath-ingress   nginx   *       192.168.64.2   80',
      solution: '# services.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: frontend\n  template:\n    metadata:\n      labels:\n        app: frontend\n    spec:\n      containers:\n      - name: frontend\n        image: hashicorp/http-echo\n        args: [\'-text=Frontend Response\']\n        ports:\n        - containerPort: 5678\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend-service\nspec:\n  selector:\n    app: frontend\n  ports:\n  - port: 80\n    targetPort: 5678\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: api\n  template:\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n      - name: api\n        image: hashicorp/http-echo\n        args: [\'-text=API Response\']\n        ports:\n        - containerPort: 5678\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  selector:\n    app: api\n  ports:\n  - port: 80\n    targetPort: 5678\n---\n# Path-based Ingress\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: path-ingress\nspec:\n  ingressClassName: nginx\n  rules:\n  - http:\n      paths:\n      - path: /api\n        pathType: Prefix\n        backend:\n          service:\n            name: api-service\n            port:\n              number: 80\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend-service\n            port:\n              number: 80\n\nkubectl apply -f services.yaml\nMINIKUBE_IP=$(minikube ip)\n\n# Проверить\ncurl http://$MINIKUBE_IP/\ncurl http://$MINIKUBE_IP/api\n\n# Host-based проверка\ncurl -H "Host: www.example.com" http://$MINIKUBE_IP/\ncurl -H "Host: api.example.com" http://$MINIKUBE_IP/',
      explanation: 'Ingress объединяет несколько сервисов за одним IP. Path-based маршрутизация работает по пути URL — удобно для монолитного API. Host-based работает по заголовку Host — удобно для микросервисной архитектуры. nginx Ingress Controller читает правила и настраивает nginx конфигурацию.'
    },
    {
      id: 7,
      title: 'Практика: Ingress с TLS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте HTTPS для Ingress, создав самоподписанный сертификат и настроив TLS Secret.',
      requirements: [
        'Создать самоподписанный сертификат для example.com',
        'Создать TLS Secret',
        'Настроить Ingress с TLS и редиректом HTTP -> HTTPS',
        'Проверить HTTPS доступность',
        'Добавить аннотацию для rate limiting'
      ],
      hint: 'Используйте curl -k для игнорирования самоподписанного сертификата. -v покажет детали TLS рукопожатия.',
      expectedOutput: 'curl -k https://example.com:\nFrontend Response\n\ncurl -v http://example.com:\n< HTTP/1.1 308 Permanent Redirect\n< Location: https://example.com/\n\ncurl -kvI https://example.com 2>&1 | grep -A 5 "SSL":\n* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384\n* Server certificate: CN=example.com, O=Test\n\nRate limiting активен: после 20 RPS возвращает HTTP 429.',
      solution: '# Создать сертификат\nopenssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n  -keyout tls.key -out tls.crt \\\n  -subj "/CN=example.com/O=Test"\n\n# Создать TLS Secret\nkubectl create secret tls example-tls --cert=tls.crt --key=tls.key\n\n# tls-ingress.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: tls-ingress\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\n    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"\n    nginx.ingress.kubernetes.io/limit-rps: "20"\nspec:\n  ingressClassName: nginx\n  tls:\n  - hosts:\n    - example.com\n    secretName: example-tls\n  rules:\n  - host: example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: frontend-service\n            port:\n              number: 80\n\nkubectl apply -f tls-ingress.yaml\n\n# Добавить в /etc/hosts\nMINIKUBE_IP=$(minikube ip)\necho "$MINIKUBE_IP example.com" | sudo tee -a /etc/hosts\n\n# Проверить HTTPS (-k игнорирует самоподписанный сертификат)\ncurl -k https://example.com\n\n# Проверить редирект HTTP -> HTTPS\ncurl -v http://example.com\n\n# Детали сертификата\ncurl -kvI https://example.com 2>&1 | grep -A 5 "SSL"',
      explanation: 'TLS Secret хранит сертификат и ключ. Ingress Controller завершает TLS соединение и передаёт трафик внутрь кластера по HTTP. Аннотация ssl-redirect перенаправляет HTTP на HTTPS. Для продакшена используйте cert-manager для автоматического получения Let\'s Encrypt сертификатов.'
    }
  ]
}
