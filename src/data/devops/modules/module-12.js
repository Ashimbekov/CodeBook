export default {
  id: 12,
  title: 'CI/CD: GitHub Actions',
  description: 'Создание CI/CD пайплайнов с GitHub Actions: workflows, jobs, steps, секреты, матричное тестирование и деплой.',
  lessons: [
    {
      id: 1,
      title: 'Основы GitHub Actions',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Actions — встроенная CI/CD платформа GitHub. Позволяет автоматизировать сборку, тестирование и деплой прямо из репозитория. Бесплатно для публичных репозиториев, 2000 минут/месяц для приватных.' },
        { type: 'heading', value: 'Структура Workflow' },
        { type: 'code', language: 'yaml', value: '# .github/workflows/ci.yml\nname: CI Pipeline\n\n# Триггеры — когда запускать\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n  schedule:\n    - cron: "0 2 * * 1"          # Каждый понедельник в 2:00\n  workflow_dispatch:                # Ручной запуск\n\n# Переменные окружения для всего workflow\nenv:\n  REGISTRY: ghcr.io\n  IMAGE_NAME: ${{ github.repository }}\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout код\n        uses: actions/checkout@v4\n\n      - name: Установка Python\n        uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n\n      - name: Установка зависимостей\n        run: |\n          pip install -r requirements.txt\n          pip install pytest\n\n      - name: Запуск тестов\n        run: pytest tests/ -v' },
        { type: 'heading', value: 'Ключевые концепции' },
        { type: 'list', value: [
          'Workflow — весь CI/CD pipeline (YAML-файл)',
          'Event — триггер запуска (push, pull_request, schedule)',
          'Job — набор шагов, запускаемых на одном runner',
          'Step — отдельная задача (run команда или uses action)',
          'Action — переиспользуемый компонент (actions/checkout@v4)',
          'Runner — машина для выполнения (ubuntu-latest, windows-latest, macos-latest)'
        ] },
        { type: 'tip', value: 'Workflow файлы ДОЛЖНЫ быть в .github/workflows/. GitHub автоматически обнаруживает их. Имя файла может быть любым, но рекомендуется: ci.yml, cd.yml, release.yml.' }
      ]
    },
    {
      id: 2,
      title: 'Jobs и Steps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jobs запускаются параллельно по умолчанию. Steps внутри job выполняются последовательно. Можно задать зависимости между jobs через needs.' },
        { type: 'heading', value: 'Многоэтапный pipeline' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm run lint\n\n  test:\n    runs-on: ubuntu-latest\n    needs: lint                   # Запустится после lint\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n\n  build:\n    runs-on: ubuntu-latest\n    needs: test                   # Запустится после test\n    steps:\n      - uses: actions/checkout@v4\n      - name: Build Docker image\n        run: docker build -t myapp:${{ github.sha }} .\n      - name: Push image\n        run: |\n          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin\n          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}\n\n  deploy:\n    runs-on: ubuntu-latest\n    needs: build\n    if: github.ref == \'refs/heads/main\'   # Только для main\n    environment: production              # Требует одобрения\n    steps:\n      - name: Deploy to production\n        run: |\n          echo "Deploying ${{ github.sha }} to production"' },
        { type: 'heading', value: 'Кэширование зависимостей' },
        { type: 'code', language: 'yaml', value: '  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: "npm"             # Автокэширование node_modules\n\n      - run: npm ci\n      - run: npm test\n\n      # Или ручное кэширование\n      - name: Cache pip\n        uses: actions/cache@v4\n        with:\n          path: ~/.cache/pip\n          key: ${{ runner.os }}-pip-${{ hashFiles(\'requirements.txt\') }}\n          restore-keys: |\n            ${{ runner.os }}-pip-' },
        { type: 'tip', value: 'Кэширование зависимостей ускоряет pipeline в 2-5 раз. actions/setup-node@v4 и actions/setup-python@v5 имеют встроенное кэширование — используй параметр cache.' }
      ]
    },
    {
      id: 3,
      title: 'Секреты и переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'GitHub Secrets хранят чувствительные данные (пароли, токены, ключи). Variables хранят несекретные конфигурации. Оба доступны в workflows через ${{ secrets.NAME }} и ${{ vars.NAME }}.' },
        { type: 'heading', value: 'Настройка секретов' },
        { type: 'code', language: 'bash', value: '# GitHub: Settings -> Secrets and Variables -> Actions\n# Добавить секреты:\n# DOCKER_USERNAME — логин Docker Hub\n# DOCKER_PASSWORD — пароль Docker Hub\n# AWS_ACCESS_KEY_ID — AWS ключ\n# AWS_SECRET_ACCESS_KEY — AWS секретный ключ\n# KUBE_CONFIG — содержимое ~/.kube/config\n# SLACK_WEBHOOK — URL для уведомлений\n\n# Через CLI:\ngh secret set DOCKER_PASSWORD --body "my-password"\ngh secret set AWS_ACCESS_KEY_ID < aws-key.txt\ngh secret list' },
        { type: 'heading', value: 'Использование в workflow' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  deploy:\n    runs-on: ubuntu-latest\n    env:\n      ENVIRONMENT: ${{ vars.ENVIRONMENT }}\n    steps:\n      - name: Login to Docker Hub\n        uses: docker/login-action@v3\n        with:\n          username: ${{ secrets.DOCKER_USERNAME }}\n          password: ${{ secrets.DOCKER_PASSWORD }}\n\n      - name: Configure AWS\n        uses: aws-actions/configure-aws-credentials@v4\n        with:\n          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n\n      - name: Deploy\n        run: |\n          echo "Deploying to $ENVIRONMENT"\n          kubectl apply -f k8s/\n        env:\n          KUBECONFIG: ${{ secrets.KUBE_CONFIG }}' },
        { type: 'heading', value: 'Контексты GitHub Actions' },
        { type: 'code', language: 'yaml', value: '# Доступные контексты:\n# ${{ github.sha }}          — полный SHA коммита\n# ${{ github.ref }}          — ветка (refs/heads/main)\n# ${{ github.ref_name }}     — имя ветки (main)\n# ${{ github.actor }}        — кто запустил\n# ${{ github.repository }}   — owner/repo\n# ${{ github.event_name }}   — тип события (push, pull_request)\n# ${{ github.run_number }}   — номер запуска\n# ${{ runner.os }}           — ОС runner (Linux, Windows, macOS)\n# ${{ secrets.GITHUB_TOKEN }} — автоматический токен' },
        { type: 'warning', value: 'Секреты НЕ передаются в workflows из форков (pull_request от внешних контрибьюторов). Это защита от утечки. Используй pull_request_target осторожно — он имеет доступ к секретам.' }
      ]
    },
    {
      id: 4,
      title: 'Матричное тестирование и сервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Matrix strategy запускает job с разными комбинациями параметров. Services запускают контейнеры (БД, кэш) для интеграционных тестов.' },
        { type: 'heading', value: 'Matrix Strategy' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python-version: ["3.10", "3.11", "3.12"]\n        os: [ubuntu-latest, macos-latest]\n        database: [postgres, mysql]\n      fail-fast: false              # Продолжить при ошибке одной комбинации\n    \n    runs-on: ${{ matrix.os }}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n      - run: pip install -r requirements.txt\n      - run: pytest tests/ -v\n        env:\n          DB_TYPE: ${{ matrix.database }}\n\n    # Исключения и дополнения\n    # strategy:\n    #   matrix:\n    #     os: [ubuntu-latest, windows-latest]\n    #     python: ["3.11", "3.12"]\n    #     exclude:\n    #       - os: windows-latest\n    #         python: "3.10"\n    #     include:\n    #       - os: ubuntu-latest\n    #         python: "3.13-dev"' },
        { type: 'heading', value: 'Service Containers' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  integration-test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env:\n          POSTGRES_DB: test_db\n          POSTGRES_PASSWORD: test_pass\n        ports:\n          - 5432:5432\n        options: >-\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n\n      redis:\n        image: redis:7\n        ports:\n          - 6379:6379\n        options: >-\n          --health-cmd "redis-cli ping"\n          --health-interval 10s\n\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install -r requirements.txt\n      - name: Run integration tests\n        run: pytest tests/integration/ -v\n        env:\n          DATABASE_URL: postgresql://postgres:test_pass@localhost:5432/test_db\n          REDIS_URL: redis://localhost:6379' },
        { type: 'note', value: 'Service containers автоматически запускаются перед steps и останавливаются после. Healthcheck гарантирует что сервис готов до начала тестов.' }
      ]
    },
    {
      id: 5,
      title: 'Docker Build и Deploy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типичный CI/CD pipeline: сборка Docker-образа, push в registry, деплой в Kubernetes или cloud. Рассмотрим полный workflow.' },
        { type: 'heading', value: 'Полный CI/CD Pipeline' },
        { type: 'code', language: 'yaml', value: 'name: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\nenv:\n  REGISTRY: ghcr.io\n  IMAGE_NAME: ${{ github.repository }}\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n          cache: "pip"\n      - run: pip install -r requirements.txt -r requirements-dev.txt\n      - run: pytest tests/ -v --cov=app --cov-report=xml\n      - name: Upload coverage\n        uses: codecov/codecov-action@v4\n\n  build-and-push:\n    needs: test\n    runs-on: ubuntu-latest\n    if: github.event_name == \'push\'\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Login to GHCR\n        uses: docker/login-action@v3\n        with:\n          registry: ${{ env.REGISTRY }}\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - name: Build and push\n        uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: |\n            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}\n            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n\n  deploy:\n    needs: build-and-push\n    runs-on: ubuntu-latest\n    if: github.ref == \'refs/heads/main\'\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n      - name: Deploy to Kubernetes\n        run: |\n          kubectl set image deployment/myapp \\\n            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}\n          kubectl rollout status deployment/myapp' },
        { type: 'tip', value: 'docker/build-push-action с cache-from: type=gha использует GitHub Actions cache для Docker слоёв. Это ускоряет сборку образов в 3-10 раз при повторных запусках.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание CI/CD Pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полноценный CI/CD pipeline с GitHub Actions для Python-проекта.',
      requirements: [
        'Создайте workflow файл .github/workflows/ci.yml',
        'Добавьте job для линтинга (flake8 или ruff)',
        'Добавьте job для тестирования с PostgreSQL (service container)',
        'Добавьте матричное тестирование для Python 3.10, 3.11, 3.12',
        'Добавьте job для сборки и push Docker-образа',
        'Добавьте условный деплой только для main ветки'
      ],
      hint: 'services: postgres с health-cmd. strategy: matrix: python-version. if: github.ref == refs/heads/main для условного деплоя.',
      expectedOutput: 'Workflow запускается на push и pull_request\nLint: flake8 проверяет код\nTest: 3 параллельных job (Python 3.10, 3.11, 3.12) с PostgreSQL\nBuild: Docker образ собирается и пушится в GHCR\nDeploy: выполняется только для main ветки',
      solution: '# .github/workflows/ci.yml\n# name: CI/CD\n# on:\n#   push:\n#     branches: [main, develop]\n#   pull_request:\n#     branches: [main]\n#\n# jobs:\n#   lint:\n#     runs-on: ubuntu-latest\n#     steps:\n#       - uses: actions/checkout@v4\n#       - uses: actions/setup-python@v5\n#         with:\n#           python-version: "3.11"\n#       - run: pip install ruff\n#       - run: ruff check .\n#\n#   test:\n#     needs: lint\n#     runs-on: ubuntu-latest\n#     strategy:\n#       matrix:\n#         python-version: ["3.10", "3.11", "3.12"]\n#     services:\n#       postgres:\n#         image: postgres:16\n#         env:\n#           POSTGRES_DB: test_db\n#           POSTGRES_PASSWORD: test\n#         ports: ["5432:5432"]\n#         options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5\n#     steps:\n#       - uses: actions/checkout@v4\n#       - uses: actions/setup-python@v5\n#         with:\n#           python-version: ${{ matrix.python-version }}\n#           cache: pip\n#       - run: pip install -r requirements.txt -r requirements-dev.txt\n#       - run: pytest tests/ -v\n#         env:\n#           DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db\n#\n#   build:\n#     needs: test\n#     runs-on: ubuntu-latest\n#     if: github.event_name == \'push\'\n#     steps:\n#       - uses: actions/checkout@v4\n#       - uses: docker/login-action@v3\n#         with:\n#           registry: ghcr.io\n#           username: ${{ github.actor }}\n#           password: ${{ secrets.GITHUB_TOKEN }}\n#       - uses: docker/build-push-action@v5\n#         with:\n#           push: true\n#           tags: ghcr.io/${{ github.repository }}:${{ github.sha }}\n#\n#   deploy:\n#     needs: build\n#     runs-on: ubuntu-latest\n#     if: github.ref == \'refs/heads/main\'\n#     environment: production\n#     steps:\n#       - run: echo "Deploying ${{ github.sha }}"',
      explanation: 'Pipeline состоит из 4 этапов: lint -> test -> build -> deploy. Matrix создаёт параллельные jobs для каждой версии Python. Service containers запускают PostgreSQL для интеграционных тестов. Условие if фильтрует deploy только для main. Environment: production может требовать ручного одобрения.'
    }
  ]
}
