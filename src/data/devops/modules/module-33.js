export default {
  id: 33,
  title: 'Container Registry и образы',
  description: 'Типы Container Registry, оптимизация Docker-образов, multi-arch builds, подписание и сканирование образов, кэширование.',
  lessons: [
    {
      id: 1,
      title: 'Типы Container Registry',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Обзор Container Registry' },
        { type: 'text', value: 'Container Registry — хранилище Docker-образов. Выбор registry зависит от облачного провайдера, требований безопасности и интеграции с CI/CD. Каждый крупный облачный провайдер предлагает свой managed registry.' },
        { type: 'code', language: 'bash', value: '# Docker Hub — публичный (по умолчанию)\ndocker push myuser/myapp:v1\n# Image: docker.io/myuser/myapp:v1\n\n# GitHub Container Registry (GHCR)\ndocker login ghcr.io -u USERNAME -p $GITHUB_TOKEN\ndocker push ghcr.io/myorg/myapp:v1\n\n# AWS Elastic Container Registry (ECR)\naws ecr get-login-password --region us-east-1 | \\\n  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com\ndocker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1\n\n# Azure Container Registry (ACR)\naz acr login --name myregistry\ndocker push myregistry.azurecr.io/myapp:v1\n\n# Google Artifact Registry (GAR)\ngcloud auth configure-docker us-central1-docker.pkg.dev\ndocker push us-central1-docker.pkg.dev/project/repo/myapp:v1' },
        { type: 'heading', value: 'Стратегия тегирования' },
        { type: 'code', language: 'bash', value: '# Стратегии тегирования образов:\n\n# 1. Semantic Versioning\ndocker tag myapp:latest myapp:1.2.3\ndocker tag myapp:latest myapp:1.2\ndocker tag myapp:latest myapp:1\n\n# 2. Git SHA (уникальный для каждого коммита)\ndocker tag myapp:latest myapp:$(git rev-parse --short HEAD)\n# myapp:a1b2c3d\n\n# 3. Git SHA + timestamp\ndocker tag myapp:latest myapp:$(date +%Y%m%d)-$(git rev-parse --short HEAD)\n# myapp:20240315-a1b2c3d\n\n# 4. Branch + SHA (для CI/CD)\ndocker tag myapp:latest myapp:main-a1b2c3d\ndocker tag myapp:latest myapp:feature-auth-b4c5d6e\n\n# ВАЖНО: Никогда не используйте только :latest в production!\n# :latest может указывать на разные образы в разное время' },
        { type: 'list', items: [
          'Docker Hub — бесплатный для публичных, 1 приватный репо бесплатно',
          'GHCR — бесплатный для публичных, хорошая интеграция с GitHub Actions',
          'AWS ECR — нативная интеграция с ECS/EKS, lifecycle policies',
          'Azure ACR — интеграция с AKS, geo-replication, Tasks (build в облаке)',
          'Google AR — интеграция с GKE, vulnerability scanning'
        ] },
        { type: 'tip', value: 'Используйте immutable tags в production. Вместо перезаписи myapp:v1, создавайте myapp:v1.1. Включите immutable tag policy в registry для защиты.' }
      ]
    },
    {
      id: 2,
      title: 'Оптимизация образов',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Уменьшение размера образа' },
        { type: 'text', value: 'Оптимизация Docker-образов уменьшает время загрузки, уменьшает attack surface и экономит место в registry. Главные техники: multi-stage builds, минимальные базовые образы, правильный порядок слоёв.' },
        { type: 'code', language: 'dockerfile', value: '# ПЛОХО: 1.2 GB\nFROM ubuntu:22.04\nRUN apt-get update && apt-get install -y python3 python3-pip\nCOPY . /app\nRUN pip3 install -r /app/requirements.txt\nCMD ["python3", "/app/main.py"]\n\n# ХОРОШО: 85 MB (multi-stage + slim)\nFROM python:3.12-slim AS builder\nWORKDIR /build\nCOPY requirements.txt .\nRUN pip install --user --no-cache-dir -r requirements.txt\n\nFROM python:3.12-slim\nRUN groupadd -r app && useradd -r -g app app\nWORKDIR /app\nCOPY --from=builder /root/.local /home/app/.local\nCOPY --chown=app:app . .\nENV PATH=/home/app/.local/bin:$PATH\nUSER app\nCMD ["python", "main.py"]\n\n# ЛУЧШЕ: 25 MB (distroless)\nFROM python:3.12-slim AS builder\nWORKDIR /build\nCOPY requirements.txt .\nRUN pip install --target=/deps --no-cache-dir -r requirements.txt\n\nFROM gcr.io/distroless/python3-debian12\nCOPY --from=builder /deps /deps\nCOPY . /app\nWORKDIR /app\nENV PYTHONPATH=/deps\nCMD ["main.py"]' },
        { type: 'heading', value: 'Оптимизация кэширования слоёв' },
        { type: 'code', language: 'dockerfile', value: '# ПЛОХО: при любом изменении кода пересобирает зависимости\nCOPY . /app\nRUN pip install -r /app/requirements.txt\n\n# ХОРОШО: зависимости кэшируются отдельно\nCOPY requirements.txt /app/\nRUN pip install --no-cache-dir -r /app/requirements.txt\nCOPY . /app\n\n# Для Node.js:\nCOPY package.json package-lock.json ./\nRUN npm ci --production\nCOPY . .\n\n# Для Go:\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .' },
        { type: 'heading', value: '.dockerignore' },
        { type: 'code', language: 'bash', value: '# .dockerignore — исключение файлов из контекста сборки\n.git\n.github\n.vscode\nnode_modules\n__pycache__\n*.pyc\n.env\n.env.*\ndocker-compose*.yml\nDockerfile*\nREADME.md\nLICENSE\ntests/\ndocs/\n*.log\n.coverage\nhtmlcov/' },
        { type: 'note', value: 'Distroless образы от Google не содержат shell, пакетный менеджер и утилиты — только runtime. Это минимизирует attack surface, но усложняет отладку. Для debug используйте distroless :debug вариант.' }
      ]
    },
    {
      id: 3,
      title: 'Multi-arch builds',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Сборка для нескольких архитектур' },
        { type: 'text', value: 'Modern серверы используют amd64 (Intel/AMD) или arm64 (AWS Graviton, Apple M-series). Multi-arch образы позволяют одному тегу работать на любой архитектуре. Docker автоматически выбирает правильный вариант.' },
        { type: 'code', language: 'bash', value: '# Docker Buildx — инструмент для multi-arch builds\n\n# Создание builder с поддержкой нескольких платформ\ndocker buildx create --name multiarch --driver docker-container --use\ndocker buildx inspect --bootstrap\n\n# Сборка и push для amd64 + arm64\ndocker buildx build \\\n  --platform linux/amd64,linux/arm64 \\\n  --tag ghcr.io/myorg/myapp:v1 \\\n  --push .\n\n# Проверка multi-arch manifest\ndocker manifest inspect ghcr.io/myorg/myapp:v1\n\n# Сборка только для текущей платформы (локально)\ndocker buildx build --load -t myapp:test .' },
        { type: 'heading', value: 'CI/CD для multi-arch' },
        { type: 'code', language: 'yaml', value: '# GitHub Actions — multi-arch build\nname: Build Multi-Arch\non:\n  push:\n    tags: ["v*"]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: docker/setup-qemu-action@v3\n\n      - uses: docker/setup-buildx-action@v3\n\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - uses: docker/build-push-action@v5\n        with:\n          context: .\n          platforms: linux/amd64,linux/arm64\n          push: true\n          tags: |\n            ghcr.io/${{ github.repository }}:${{ github.ref_name }}\n            ghcr.io/${{ github.repository }}:latest\n          cache-from: type=gha\n          cache-to: type=gha,mode=max' },
        { type: 'heading', value: 'Conditional builds для разных архитектур' },
        { type: 'code', language: 'dockerfile', value: '# Dockerfile с учётом архитектуры\nFROM --platform=$BUILDPLATFORM golang:1.22 AS builder\n\nARG TARGETARCH\nARG TARGETOS\n\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\n\n# Cross-compilation для целевой архитектуры\nRUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \\\n    go build -ldflags="-s -w" -o /app/server ./cmd/server\n\nFROM gcr.io/distroless/static-debian12\nCOPY --from=builder /app/server /server\nCMD ["/server"]' },
        { type: 'tip', value: 'AWS Graviton (arm64) на 20-40% дешевле и энергоэффективнее amd64. Multi-arch builds позволяют деплоить на Graviton без изменений в Deployment.' }
      ]
    },
    {
      id: 4,
      title: 'Подписание и сканирование',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Сканирование уязвимостей' },
        { type: 'text', value: 'Сканирование Docker-образов выявляет уязвимости (CVE) в базовом образе и зависимостях. Это критически важно для security compliance. Сканирование должно быть частью CI/CD pipeline.' },
        { type: 'code', language: 'bash', value: '# Trivy — самый популярный сканер\n# Установка\ncurl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh\n\n# Сканирование образа\ntrivy image myapp:latest\n\n# Только CRITICAL и HIGH уязвимости\ntrivy image --severity CRITICAL,HIGH myapp:latest\n\n# Fail при обнаружении CRITICAL\ntrivy image --exit-code 1 --severity CRITICAL myapp:latest\n\n# Сканирование Dockerfile\ntrivy config Dockerfile\n\n# Grype — альтернативный сканер от Anchore\ngrype myapp:latest\ngrype myapp:latest --only-fixed  # только те, где есть fix' },
        { type: 'heading', value: 'Подписание образов (Cosign)' },
        { type: 'code', language: 'bash', value: '# Cosign — подписание и верификация образов\n# Установка\ncurl -sSL https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 -o cosign\nchmod +x cosign && sudo mv cosign /usr/local/bin/\n\n# Генерация ключевой пары\ncosign generate-key-pair\n# cosign.key (приватный) + cosign.pub (публичный)\n\n# Подписание образа\ncosign sign --key cosign.key ghcr.io/myorg/myapp:v1\n\n# Верификация подписи\ncosign verify --key cosign.pub ghcr.io/myorg/myapp:v1\n\n# Keyless signing с Sigstore (рекомендуется для OSS)\ncosign sign ghcr.io/myorg/myapp:v1\n# Использует OIDC identity (GitHub, Google)' },
        { type: 'heading', value: 'Admission Controller для верификации' },
        { type: 'code', language: 'yaml', value: '# Kyverno policy — разрешать только подписанные образы\napiVersion: kyverno.io/v1\nkind: ClusterPolicy\nmetadata:\n  name: verify-image-signature\nspec:\n  validationFailureAction: Enforce\n  background: false\n  rules:\n    - name: verify-cosign\n      match:\n        any:\n          - resources:\n              kinds: [\"Pod\"]\n      verifyImages:\n        - imageReferences:\n            - \"ghcr.io/myorg/*\"\n          attestors:\n            - entries:\n                - keys:\n                    publicKeys: |\n                      -----BEGIN PUBLIC KEY-----\n                      MFkwEwYHKoZIzj0CAQY...\n                      -----END PUBLIC KEY-----' },
        { type: 'warning', value: 'Всегда сканируйте образы в CI/CD и блокируйте деплой при обнаружении CRITICAL уязвимостей. Настройте автоматическое пересоздание образов при обнаружении CVE в базовом образе.' }
      ]
    },
    {
      id: 5,
      title: 'Кэширование сборки',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Стратегии кэширования Docker Build' },
        { type: 'text', value: 'Кэширование ускоряет сборку образов в CI/CD. Без кэша каждая сборка начинается с нуля. Docker BuildKit поддерживает несколько бэкендов кэширования: inline, registry, local, GitHub Actions cache.' },
        { type: 'code', language: 'bash', value: '# 1. Registry cache — кэш хранится в registry\ndocker buildx build \\\n  --cache-from type=registry,ref=ghcr.io/myorg/myapp:cache \\\n  --cache-to type=registry,ref=ghcr.io/myorg/myapp:cache,mode=max \\\n  --tag ghcr.io/myorg/myapp:v1 \\\n  --push .\n\n# 2. GitHub Actions cache\ndocker buildx build \\\n  --cache-from type=gha \\\n  --cache-to type=gha,mode=max \\\n  --tag ghcr.io/myorg/myapp:v1 \\\n  --push .\n\n# 3. Local cache\ndocker buildx build \\\n  --cache-from type=local,src=/tmp/.buildx-cache \\\n  --cache-to type=local,dest=/tmp/.buildx-cache-new,mode=max \\\n  --tag myapp:v1 .\n\n# mode=max кэширует все слои (включая промежуточные)' },
        { type: 'heading', value: 'Dockerfile оптимизация для кэша' },
        { type: 'code', language: 'dockerfile', value: '# Оптимизированный Dockerfile для максимального кэширования\nFROM node:20-slim AS deps\nWORKDIR /app\n# Только файлы зависимостей — кэшируются если не менялись\nCOPY package.json package-lock.json ./\nRUN npm ci --production\n\nFROM node:20-slim AS build\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build\n\nFROM node:20-slim AS runtime\nWORKDIR /app\nRUN groupadd -r app && useradd -r -g app app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY --from=build /app/dist ./dist\nCOPY package.json .\nUSER app\nEXPOSE 3000\nCMD ["node", "dist/main.js"]' },
        { type: 'heading', value: 'Lifecycle Policies для Registry' },
        { type: 'code', language: 'bash', value: '# AWS ECR Lifecycle Policy — автоматическая очистка\naws ecr put-lifecycle-policy --repository-name myapp --lifecycle-policy-text \'{\n  "rules": [\n    {\n      "rulePriority": 1,\n      "description": "Keep last 10 tagged images",\n      "selection": {\n        "tagStatus": "tagged",\n        "tagPrefixList": ["v"],\n        "countType": "imageCountMoreThan",\n        "countNumber": 10\n      },\n      "action": { "type": "expire" }\n    },\n    {\n      "rulePriority": 2,\n      "description": "Remove untagged after 7 days",\n      "selection": {\n        "tagStatus": "untagged",\n        "countType": "sinceImagePushed",\n        "countUnit": "days",\n        "countNumber": 7\n      },\n      "action": { "type": "expire" }\n    }\n  ]\n}\'' },
        { type: 'tip', value: 'Registry cache (type=registry) — лучший выбор для CI/CD, потому что кэш доступен из любого runner. GitHub Actions cache ограничен 10GB и доступен только в том же workflow.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация Docker образа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируйте Docker-образ: multi-stage build, минимальный базовый образ, multi-arch сборка, сканирование Trivy и подписание Cosign.',
      requirements: [
        'Создайте multi-stage Dockerfile с разделением зависимостей и кода',
        'Используйте slim или distroless как финальный базовый образ',
        'Добавьте .dockerignore для исключения ненужных файлов',
        'Настройте multi-arch build (amd64 + arm64) через buildx',
        'Просканируйте образ Trivy и исправьте CRITICAL уязвимости',
        'Настройте GitHub Actions workflow с кэшированием сборки'
      ],
      hint: 'Начните с multi-stage build: первый stage для зависимостей, второй для сборки, третий для runtime. Используйте docker buildx build --platform linux/amd64,linux/arm64.',
      expectedOutput: 'docker images myapp => SIZE 85MB (вместо 1.2GB)\ndocker buildx imagetools inspect myapp:v1 => amd64 + arm64\ntrivy image myapp:v1 => 0 CRITICAL vulnerabilities\ncosign verify --key cosign.pub myapp:v1 => Verified OK',
      solution: '# 1. Multi-stage Dockerfile\n# FROM python:3.12-slim AS builder\n# WORKDIR /build\n# COPY requirements.txt .\n# RUN pip install --user --no-cache-dir -r requirements.txt\n#\n# FROM python:3.12-slim\n# RUN groupadd -r app && useradd -r -g app app\n# WORKDIR /app\n# COPY --from=builder /root/.local /home/app/.local\n# COPY --chown=app:app . .\n# ENV PATH=/home/app/.local/bin:$PATH\n# USER app\n# CMD ["python", "main.py"]\n\n# 2. .dockerignore\n# .git node_modules __pycache__ .env tests docs\n\n# 3. Multi-arch build\ndocker buildx create --name multi --use\ndocker buildx build --platform linux/amd64,linux/arm64 \\\n  --tag ghcr.io/myorg/myapp:v1 --push .\n\n# 4. Сканирование\ntrivy image --severity CRITICAL,HIGH ghcr.io/myorg/myapp:v1\n\n# 5. Подписание\ncosign sign --key cosign.key ghcr.io/myorg/myapp:v1',
      explanation: 'Оптимизация Docker-образов включает: multi-stage builds для уменьшения размера, slim/distroless для минимизации attack surface, multi-arch для поддержки arm64 (Graviton), сканирование для обнаружения CVE, подписание для верификации подлинности. Кэширование ускоряет сборку в CI/CD.'
    }
  ]
}
