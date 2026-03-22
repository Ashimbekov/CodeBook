export default {
  id: 10,
  title: 'Docker Registry — реестр образов',
  description: 'Публикация образов в Docker Hub и private registry. Тегирование, push/pull, настройка приватного реестра, аутентификация, Harbor и облачные registry.',
  lessons: [
    {
      id: 1,
      title: 'Docker Hub — публичный реестр',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Hub — официальный публичный реестр образов. Содержит миллионы публичных образов. Бесплатный аккаунт позволяет создавать публичные репозитории и один приватный.' },
        { type: 'code', language: 'bash', value: '# Авторизация в Docker Hub:\ndocker login\n# Username: yourusername\n# Password: yourpassword\n# WARNING! Your password will be stored unencrypted!\n\n# Лучше использовать токен доступа:\n# Docker Hub -> Account Settings -> Security -> New Access Token\ndocker login -u yourusername\n# Password: <вставь токен>\n\n# Для automation (CI/CD):\necho "${DOCKER_TOKEN}" | docker login -u "${DOCKER_USERNAME}" --password-stdin\n\n# Логаут:\ndocker logout\n\n# Именование образов:\n# {username}/{repository}:{tag}\n# yourusername/myapp:latest\n# yourusername/myapp:1.0.0\n# yourusername/myapp:1.0.0-alpine\n\n# Тегирование образа:\ndocker tag myapp:latest yourusername/myapp:latest\ndocker tag myapp:latest yourusername/myapp:1.0.0\n# Один образ может иметь несколько тегов!\n\n# Push в Docker Hub:\ndocker push yourusername/myapp:latest\ndocker push yourusername/myapp:1.0.0\n\n# Pull из Docker Hub:\ndocker pull yourusername/myapp:latest\ndocker pull yourusername/myapp:1.0.0\n\n# Официальные образы (без username):\ndocker pull nginx:latest\ndocker pull postgres:15\ndocker pull node:18-alpine' },
        { type: 'tip', value: 'Для production используй конкретные теги (1.0.0, 1.0.0-alpine), не latest. latest меняется при каждом push и может сломать deployment. Семантическое версионирование: major.minor.patch.' }
      ]
    },
    {
      id: 2,
      title: 'Тегирование и стратегии версионирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное тегирование образов — основа управляемости в production. Используй семантические версии, теги окружений и hash коммитов. latest — удобно для разработки, опасно для production.' },
        { type: 'code', language: 'bash', value: '# Стратегии тегирования:\n\n# 1. Семантическое версионирование:\ndocker tag myapp:build yourusername/myapp:1.2.3\ndocker tag myapp:build yourusername/myapp:1.2\ndocker tag myapp:build yourusername/myapp:1\ndocker tag myapp:build yourusername/myapp:latest\n\n# 2. Git SHA — точная ссылка на коммит:\nGIT_SHA=$(git rev-parse --short HEAD)\ndocker build -t yourusername/myapp:${GIT_SHA} .\ndocker push yourusername/myapp:${GIT_SHA}\n\n# 3. Branch тег:\nBRANCH=$(git rev-parse --abbrev-ref HEAD)\ndocker tag myapp:build yourusername/myapp:${BRANCH}\n# yourusername/myapp:main\n# yourusername/myapp:develop\n\n# 4. Datetime тег:\nDATE=$(date +%Y%m%d-%H%M%S)\ndocker tag myapp:build yourusername/myapp:${DATE}\n\n# 5. Multi-tag push в CI/CD:\ndocker build -t myapp:build .\ndocker tag myapp:build yourusername/myapp:${GIT_SHA}\ndocker tag myapp:build yourusername/myapp:${BRANCH}\ndocker tag myapp:build yourusername/myapp:latest\ndocker push yourusername/myapp --all-tags\n\n# Посмотреть теги образа:\ndocker images yourusername/myapp\n# REPOSITORY           TAG       IMAGE ID       CREATED\n# yourusername/myapp   1.2.3     abc123         2 hours ago\n# yourusername/myapp   latest    abc123         2 hours ago\n# yourusername/myapp   main      abc123         2 hours ago\n\n# Проверить digest (уникальный хэш содержимого):\ndocker inspect yourusername/myapp:1.2.3 --format "{{.RepoDigests}}"' },
        { type: 'note', value: 'Несколько тегов на один образ не занимают дополнительное место — это просто ссылки на один и тот же image ID. Digest (sha256:...) — неизменяемый идентификатор содержимого образа, гарантирует воспроизводимость.' }
      ]
    },
    {
      id: 3,
      title: 'Приватный реестр — Docker Registry',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Distribution (registry:2) — официальный open-source реестр. Поднимается в контейнере за несколько минут. Для production нужен TLS, аутентификация и хранилище (S3/GCS).' },
        { type: 'code', language: 'bash', value: '# Запустить простой реестр локально:\ndocker run -d \\\n  --name registry \\\n  -p 5000:5000 \\\n  -v registry_data:/var/lib/registry \\\n  registry:2\n\n# Push в локальный реестр:\ndocker tag myapp:latest localhost:5000/myapp:latest\ndocker push localhost:5000/myapp:latest\n\n# Pull:\ndocker pull localhost:5000/myapp:latest\n\n# Список образов в реестре:\ncurl http://localhost:5000/v2/_catalog\n# {"repositories":["myapp"]}\n\ncurl http://localhost:5000/v2/myapp/tags/list\n# {"name":"myapp","tags":["latest","1.0.0"]}\n\n# Реестр с аутентификацией (basic auth):\n# Создать файл паролей:\nmkdir -p auth\ndocker run --rm \\\n  --entrypoint htpasswd \\\n  httpd:2 -Bbn admin adminpassword > auth/htpasswd\n\n# Запустить с аутентификацией:\ndocker run -d \\\n  --name registry-auth \\\n  -p 5000:5000 \\\n  -v registry_data:/var/lib/registry \\\n  -v $(pwd)/auth:/auth \\\n  -e REGISTRY_AUTH=htpasswd \\\n  -e REGISTRY_AUTH_HTPASSWD_REALM=Registry \\\n  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \\\n  registry:2\n\n# Логин в приватный реестр:\ndocker login localhost:5000 -u admin -p adminpassword\ndocker push localhost:5000/myapp:latest' },
        { type: 'code', language: 'bash', value: '# TLS для production реестра:\nmkdir -p certs\n# Создать self-signed cert (для тестов):\nopenssl req -newkey rsa:4096 -nodes -sha256 \\\n  -keyout certs/domain.key \\\n  -x509 -days 365 \\\n  -out certs/domain.crt \\\n  -subj "/CN=registry.example.com"\n\n# Запустить с TLS:\ndocker run -d \\\n  --name registry-tls \\\n  -p 443:443 \\\n  -v registry_data:/var/lib/registry \\\n  -v $(pwd)/certs:/certs \\\n  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \\\n  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \\\n  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \\\n  registry:2\n\n# Настроить insecure registry (только для dev, не prod):\n# В /etc/docker/daemon.json:\n# {\n#   "insecure-registries": ["registry.example.com:5000"]\n# }\nsudo systemctl restart docker' }
      ]
    },
    {
      id: 4,
      title: 'Harbor — enterprise приватный реестр',
      type: 'theory',
      content: [
        { type: 'text', value: 'Harbor — CNCF graduated проект для enterprise registry. Добавляет к базовому registry: RBAC, репликацию, сканирование уязвимостей (Trivy), подпись образов, WebUI и API.' },
        { type: 'code', language: 'bash', value: '# Установка Harbor (через docker compose):\n# Скачать installer:\ncurl -L https://github.com/goharbor/harbor/releases/download/v2.10.0/harbor-online-installer-v2.10.0.tgz | tar xz\ncd harbor\n\n# Настроить конфигурацию:\ncp harbor.yml.tmpl harbor.yml\n# Изменить в harbor.yml:\n# hostname: registry.example.com\n# certificate: /your/cert.crt\n# private_key: /your/key.key\n# data_volume: /data\n\n# Установить и запустить:\nsudo ./install.sh\n# Запускает: nginx, registry, core, jobservice, portal, redis, postgres, trivy\n\n# Harbor UI: https://registry.example.com\n# Логин по умолчанию: admin / Harbor12345\n\n# Использование Harbor:\ndocker login registry.example.com -u admin\ndocker tag myapp:latest registry.example.com/myproject/myapp:1.0.0\ndocker push registry.example.com/myproject/myapp:1.0.0\n\n# Harbor возможности:\n# - Проекты (пространства имён)\n# - Пользователи и роли (admin, developer, guest)\n# - Автоматическое сканирование при push (Trivy)\n# - Replication: синхронизация с другими registry\n# - Webhook: уведомления при push\n# - Content Trust: подпись образов' },
        { type: 'note', value: 'Harbor — де-факто стандарт для on-premise enterprise registry. Используется в сотнях крупных компаний. Альтернативы: Nexus Repository (java-ориентированный), JFrog Artifactory (polyglot, платный), Quay (Red Hat).' }
      ]
    },
    {
      id: 5,
      title: 'Облачные registry — ECR, GCR, ACR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Облачные провайдеры предоставляют managed registry: AWS ECR, Google GCR/Artifact Registry, Azure ACR. Они интегрированы с их экосистемой, имеют автоматическое TLS и IAM аутентификацию.' },
        { type: 'code', language: 'bash', value: '# AWS ECR (Elastic Container Registry):\n# Создать репозиторий:\naws ecr create-repository \\\n  --repository-name myapp \\\n  --region us-east-1\n\n# Получить URI реестра:\nAWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nREGION=us-east-1\nECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"\n\n# Авторизоваться (токен действует 12 часов):\naws ecr get-login-password --region ${REGION} | \\\n  docker login --username AWS --password-stdin ${ECR_URI}\n\n# Push:\ndocker tag myapp:latest ${ECR_URI}/myapp:latest\ndocker push ${ECR_URI}/myapp:latest\n\n# Pull:\ndocker pull ${ECR_URI}/myapp:latest\n\n# Google Artifact Registry:\ngcloud auth configure-docker us-central1-docker.pkg.dev\ndocker tag myapp us-central1-docker.pkg.dev/PROJECT/REPO/myapp:latest\ndocker push us-central1-docker.pkg.dev/PROJECT/REPO/myapp:latest\n\n# Azure Container Registry:\naz acr login --name myregistry\ndocker tag myapp myregistry.azurecr.io/myapp:latest\ndocker push myregistry.azurecr.io/myapp:latest\n\n# GitHub Container Registry (ghcr.io):\necho ${GITHUB_TOKEN} | docker login ghcr.io -u USERNAME --password-stdin\ndocker tag myapp ghcr.io/username/myapp:latest\ndocker push ghcr.io/username/myapp:latest' },
        { type: 'tip', value: 'ECR автоматически сканирует образы на уязвимости (через Clair/Trivy). ECR lifecycle policies автоматически удаляют старые образы. ghcr.io хорошо интегрируется с GitHub Actions — бесплатный для публичных репозиториев.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Push/pull образов и настройка реестра',
      type: 'practice',
      difficulty: 'medium',
      description: 'Опубликуй образ в Docker Hub и настрой локальный приватный реестр.',
      requirements: [
        'Собери образ из Dockerfile (можно использовать простой nginx с кастомным index.html)',
        'Тегируй образ правильно: username/myapp:1.0.0 и username/myapp:latest',
        'Запушь образ в Docker Hub (нужен аккаунт) или в локальный registry',
        'Удали локальные образы и убедись что docker pull работает',
        'Запусти локальный registry:2 на порту 5000',
        'Запушь образ в локальный реестр и проверь через API',
        'Настрой .env файл с credentials для безопасного login в CI/CD'
      ],
      hint: 'docker login для авторизации. docker tag для тегирования. docker push для публикации. docker rmi для удаления локального образа. curl http://localhost:5000/v2/_catalog для проверки.',
      expectedOutput: 'docker images | grep myapp:\nREPOSITORY           TAG     IMAGE ID\nyourusername/myapp   1.0.0   abc123\nyourusername/myapp   latest  abc123\n\nПосле удаления и docker pull:\ncurl http://localhost:8080:\n<h1>My Docker App v1.0.0</h1>\n\ncurl http://localhost:5000/v2/_catalog:\n{"repositories":["myapp"]}\n\ncurl http://localhost:5000/v2/myapp/tags/list:\n{"name":"myapp","tags":["1.0.0"]}',
      solution: '# 1. Создать простой Dockerfile:\n# FROM nginx:alpine\n# COPY index.html /usr/share/nginx/html/\n\n# echo "<h1>My Docker App v1.0.0</h1>" > index.html\n\n# 2. Собрать образ:\ndocker build -t myapp:1.0.0 .\ndocker build -t myapp:latest .\n\n# 3. Тегировать для Docker Hub:\nUSERNAME=yourusername\ndocker tag myapp:1.0.0 ${USERNAME}/myapp:1.0.0\ndocker tag myapp:latest ${USERNAME}/myapp:latest\n\ndocker images | grep myapp\n# REPOSITORY         TAG     IMAGE ID\n# yourusername/myapp 1.0.0   abc123\n# yourusername/myapp latest  abc123\n# myapp              1.0.0   abc123\n\n# 4. Push в Docker Hub:\ndocker login -u ${USERNAME}\ndocker push ${USERNAME}/myapp:1.0.0\ndocker push ${USERNAME}/myapp:latest\n\n# 5. Проверить pull:\ndocker rmi ${USERNAME}/myapp:1.0.0 ${USERNAME}/myapp:latest\ndocker pull ${USERNAME}/myapp:1.0.0\ndocker run -d -p 8080:80 ${USERNAME}/myapp:1.0.0\ncurl http://localhost:8080  # My Docker App v1.0.0\n\n# 6. Локальный реестр:\ndocker run -d -p 5000:5000 -v registry_data:/var/lib/registry --name local-registry registry:2\n\ndocker tag myapp:1.0.0 localhost:5000/myapp:1.0.0\ndocker push localhost:5000/myapp:1.0.0\n\n# Проверить API:\ncurl http://localhost:5000/v2/_catalog\n# {"repositories":["myapp"]}\n\ncurl http://localhost:5000/v2/myapp/tags/list\n# {"name":"myapp","tags":["1.0.0"]}\n\n# 7. .env для CI/CD:\n# DOCKER_USERNAME=yourusername\n# DOCKER_TOKEN=dckr_pat_xxxxx\n# В CI: echo "${DOCKER_TOKEN}" | docker login -u "${DOCKER_USERNAME}" --password-stdin',
      explanation: 'Правильный workflow: build -> tag (semver) -> push. Несколько тегов на один образ = разные "пути" к одному содержимому. Локальный registry полезен для корпоративных сетей без интернета и для ускорения pull в CI/CD. Всегда используй --password-stdin вместо -p для безопасности (не попадёт в history).'
    }
  ]
}
