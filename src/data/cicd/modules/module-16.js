export default {
  id: 16,
  title: 'Практикум: Полный CI/CD',
  description: 'Финальный практикум: создаём полноценный CI/CD пайплайн для Django E-commerce приложения от кода до продакшена.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Структура репозитория и ветвление',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настрой branch protection rules и стратегию ветвления для CI/CD.',
      requirements: [
        'Создать .github/CODEOWNERS: backend/* @backend-team, frontend/* @frontend-team',
        'Branch protection для main: require PR, require status checks (test, lint), dismiss stale reviews',
        'Настроить Dependabot для pip, github-actions, docker',
        'Создать issue и PR templates',
        'Workflow для валидации PR заголовков (Conventional Commits)'
      ],
      expectedOutput: 'Прямой push в main заблокирован\nPR без прошедших тестов нельзя замержить\nDependabot создаёт еженедельные PR на обновления',
      hint: 'Branch protection настраивается в Settings -> Branches. CODEOWNERS в .github/CODEOWNERS или CODEOWNERS в корне.',
      solution: '# .github/CODEOWNERS\n* @team-leads\nbackend/ @backend-team\nfrontend/ @frontend-team\n.github/ @devops-team\n\n# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: pip\n    directory: /\n    schedule: {interval: weekly}\n  - package-ecosystem: github-actions\n    directory: /\n    schedule: {interval: weekly}\n  - package-ecosystem: docker\n    directory: /\n    schedule: {interval: monthly}\n\n# .github/workflows/pr-title.yml\nname: PR Title Check\non:\n  pull_request:\n    types: [opened, edited, synchronize]\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Проверка заголовка PR\n        uses: amannn/action-semantic-pull-request@v5\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n        with:\n          types: [feat, fix, docs, style, refactor, test, chore, ci]',
      explanation: 'CODEOWNERS автоматически добавляет reviewers при открытии PR. amannn/action-semantic-pull-request проверяет что заголовок соответствует Conventional Commits — это гарантирует возможность автогенерации changelog.'
    },
    {
      id: 2,
      title: 'Задача: Полный CI workflow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай comprehensive CI workflow с тестами, линтингом и security сканированием.',
      requirements: [
        'Jobs параллельно: unit-tests, integration-tests (с PostgreSQL), lint, security',
        'unit-tests: pytest tests/unit/ с coverage',
        'integration-tests: pytest tests/integration/ с PostgreSQL service',
        'lint: pre-commit run --all-files',
        'security: bandit + safety',
        'Все jobs должны пройти для green статуса PR',
        'Artifacts: coverage.xml, junit.xml'
      ],
      expectedOutput: '4 параллельных jobs\nPR видит статусы всех 4 checks\nCoverage репорт в Codecov',
      hint: 'Разделяй тесты на unit и integration через pytest markers или директории. Integration тесты медленнее но нужны.',
      solution: '# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main, develop]\n  pull_request:\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true\n\npermissions:\n  contents: read\n\njobs:\n  unit-tests:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements/testing.txt\n      - run: pytest tests/unit/ --junitxml=junit-unit.xml --cov=src --cov-report=xml\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with: {name: unit-results, path: "*.xml"}\n\n  integration-tests:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:15-alpine\n        env: {POSTGRES_USER: test, POSTGRES_PASSWORD: test, POSTGRES_DB: testdb}\n        ports: ["5432:5432"]\n        options: --health-cmd pg_isready --health-retries 5\n    env:\n      DATABASE_URL: postgresql://test:test@localhost:5432/testdb\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements/testing.txt\n      - run: python manage.py migrate && pytest tests/integration/ --junitxml=junit-integration.xml\n\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - uses: actions/cache@v4\n        with:\n          path: ~/.cache/pre-commit\n          key: pre-commit-${{ hashFiles(".pre-commit-config.yaml") }}\n      - run: pip install pre-commit && pre-commit run --all-files\n\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - run: pip install bandit safety\n      - run: bandit -r src/ -ll && safety check -r requirements.txt',
      explanation: 'Разделение unit и integration тестов позволяет быстро получить результат unit тестов пока integration ещё идут. pre-commit в CI с кешем — первый запуск медленный (создание окружений), следующие — из кеша.'
    },
    {
      id: 3,
      title: 'Задача: Docker build и push в Registry',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай production-ready Docker build workflow с оптимизацией и тегированием.',
      requirements: [
        'Multi-stage Dockerfile: builder + production стадии',
        'Workflow: build при push в main и тегах v*',
        'GHCR как registry',
        'Теги: sha- префикс для main, v* для релизов, latest для main',
        'Trivy сканирование перед пушем',
        'Docker layer кеш через GitHub Actions',
        'Build args: GIT_COMMIT, BUILD_DATE'
      ],
      expectedOutput: 'git push origin main -> ghcr.io/myorg/myapp:sha-abc1234, :latest\ngit tag v2.0.0 -> ghcr.io/myorg/myapp:v2.0.0, :2, :2.0',
      hint: 'docker/metadata-action генерирует все теги автоматически. build-args: GIT_COMMIT=${{ github.sha }}.',
      solution: '# .github/workflows/build.yml\nname: Build\non:\n  push:\n    branches: [main]\n    tags: ["v*"]\n\npermissions:\n  packages: write\n  contents: read\n  security-events: write\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/setup-buildx-action@v3\n      - id: meta\n        uses: docker/metadata-action@v5\n        with:\n          images: ghcr.io/${{ github.repository }}\n          tags: |\n            type=semver,pattern={{version}}\n            type=semver,pattern={{major}}.{{minor}}\n            type=semver,pattern={{major}}\n            type=sha,prefix=sha-\n            type=raw,value=latest,enable=${{ github.ref == "refs/heads/main" }}\n\n      - name: Build (no push) для сканирования\n        uses: docker/build-push-action@v6\n        with:\n          load: true\n          tags: scan-target:latest\n          cache-from: type=gha\n          build-args: |\n            GIT_COMMIT=${{ github.sha }}\n            BUILD_DATE=${{ github.event.head_commit.timestamp }}\n\n      - name: Trivy scan\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: scan-target:latest\n          severity: CRITICAL\n          exit-code: 1\n\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      - uses: docker/build-push-action@v6\n        with:\n          push: true\n          tags: ${{ steps.meta.outputs.tags }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n          build-args: |\n            GIT_COMMIT=${{ github.sha }}\n            BUILD_DATE=${{ github.event.head_commit.timestamp }}',
      explanation: 'Два build вызова: первый load: true для сканирования Trivy, второй push: true после успешного сканирования. Это гарантирует: уязвимый образ не попадёт в registry. build-args позволяют встроить мета-информацию в образ.'
    },
    {
      id: 4,
      title: 'Задача: Staging деплой с E2E тестами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай workflow деплоя на staging с автоматическими E2E тестами после деплоя.',
      requirements: [
        'После деплоя на staging запускать Playwright E2E тесты',
        'E2E тесты: проверка главной страницы, входа, создания заказа',
        'При падении E2E: автоматический откат staging на предыдущую версию',
        'Уведомление в Slack о результате',
        'Артефакты: скриншоты при падении тестов'
      ],
      expectedOutput: 'Деплой staging -> E2E тесты -> OK -> уведомление об успехе\nДеплой staging -> E2E тесты -> FAIL -> откат -> уведомление об откате',
      hint: 'E2E с Playwright: npx playwright test --base-url https://staging.example.com. При failure(): запустить rollback step.',
      solution: '# .github/workflows/staging.yml\nname: Staging Deploy\non:\n  push:\n    branches: [develop]\njobs:\n  deploy-e2e:\n    runs-on: ubuntu-latest\n    environment:\n      name: staging\n      url: https://staging.example.com\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Сохранить текущую версию\n        id: current-version\n        run: echo "version=$(curl -s https://staging.example.com/api/version/ | jq -r .version)" >> $GITHUB_OUTPUT\n\n      - name: Деплой\n        uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.STAGING_HOST }}\n          username: ubuntu\n          key: ${{ secrets.SSH_KEY }}\n          script: |\n            cd /app && git pull origin develop\n            docker-compose -f docker-compose.staging.yml up -d --build\n\n      - name: Ждём готовности\n        run: |\n          for i in $(seq 1 12); do\n            curl -sf https://staging.example.com/health/ && break\n            sleep 5\n          done\n\n      - name: E2E тесты\n        id: e2e\n        run: |\n          npm install @playwright/test\n          npx playwright install chromium --with-deps\n          npx playwright test --base-url https://staging.example.com\n\n      - name: Сохранить скриншоты\n        if: failure() && steps.e2e.outcome == "failure"\n        uses: actions/upload-artifact@v4\n        with:\n          name: playwright-screenshots\n          path: test-results/\n\n      - name: Откат\n        if: failure()\n        uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.STAGING_HOST }}\n          username: ubuntu\n          key: ${{ secrets.SSH_KEY }}\n          script: docker-compose -f docker-compose.staging.yml rollback ${{ steps.current-version.outputs.version }}\n\n      - name: Slack уведомление\n        if: always()\n        run: |\n          STATUS="${{ job.status }}"\n          MSG=$([ "$STATUS" = "success" ] && echo ":white_check_mark: Staging деплой успешен" || echo ":x: Staging деплой упал, откат выполнен")\n          curl -s -X POST ${{ secrets.SLACK_WEBHOOK }} -d "{\"text\":\"$MSG\"}"',
      explanation: 'Сохранение текущей версии до деплоя позволяет откатиться точно к ней. Цикл ожидания готовности (12 * 5s = 1 минута) надёжнее чем sleep 60. steps.e2e.outcome проверяет что откат запускается именно из-за E2E, а не других ошибок.'
    },
    {
      id: 5,
      title: 'Задача: Production деплой с Blue-Green',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй production деплой по стратегии Blue-Green с ручным утверждением.',
      requirements: [
        'Environment production с required reviewers',
        'Workflow: build образ -> запустить blue-green деплой скрипт',
        'Скрипт: запустить green, healthcheck, переключить nginx, остановить blue',
        'При ошибке: немедленный откат на blue',
        'Post-deploy smoke tests через curl',
        'Уведомление в Telegram с версией и временем деплоя'
      ],
      expectedOutput: 'PR в main -> CI passes -> Waiting for approval -> Approved -> Blue-Green deploy\nSmoke tests pass -> "Production updated to v2.1.0"',
      hint: 'workflow_run: triggered on: можно использовать для chain workflows. Или needs: + if: на одном workflow.',
      solution: '# .github/workflows/production.yml\nname: Production Deploy\non:\n  push:\n    branches: [main]\nneedsApproval: true\n\njobs:\n  test:\n    uses: ./.github/workflows/ci.yml  # reusable workflow\n\n  build:\n    needs: test\n    uses: ./.github/workflows/build.yml\n\n  deploy:\n    needs: build\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://example.com\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Blue-Green деплой\n        id: deploy\n        uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.PROD_HOST }}\n          username: ubuntu\n          key: ${{ secrets.PROD_SSH_KEY }}\n          script: |\n            set -e\n            IMAGE=ghcr.io/${{ github.repository }}:sha-${{ github.sha }}\n            CURRENT=$(cat /app/.current 2>/dev/null || echo "blue")\n            [ "$CURRENT" = "blue" ] && NEW="green" PORT=8002 || NEW="blue" PORT=8001\n            docker pull $IMAGE\n            docker run -d --name ${NEW}-app -p ${PORT}:8000 $IMAGE\n            sleep 15\n            curl -sf http://localhost:${PORT}/health/ || (docker stop ${NEW}-app && exit 1)\n            echo $NEW > /app/.current\n            nginx -s reload\n            sleep 5\n            docker stop ${CURRENT}-app && docker rm ${CURRENT}-app\n\n      - name: Smoke tests\n        run: |\n          curl -sf https://example.com/health/ || exit 1\n          curl -sf https://example.com/api/products/ || exit 1\n\n      - name: Telegram уведомление\n        if: always()\n        env:\n          TG_TOKEN: ${{ secrets.TG_TOKEN }}\n          TG_CHAT: ${{ secrets.TG_CHAT }}\n        run: |\n          [ "${{ job.status }}" = "success" ] && ICON="" || ICON=""\n          curl -s -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \\\n            -d "chat_id=${TG_CHAT}&text=${ICON} Production ${{ job.status }}%0AВерсия: sha-${{ github.sha }}%0AАвтор: ${{ github.actor }}&parse_mode=Markdown"',
      explanation: 'Environment: production с required reviewers — workflow встаёт на паузу между build и deploy. Это последний шанс проверить что деплоится. uses: ./.github/workflows/ci.yml — reusable workflow, не дублируем CI логику.'
    },
    {
      id: 6,
      title: 'Задача: Rollback workflow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow для ручного отката production на предыдущую версию.',
      requirements: [
        'workflow_dispatch с input: version (SHA или тег)',
        'Список последних 5 деплоев через GitHub API',
        'Деплой указанной версии через SSH',
        'Обязательное подтверждение через environment',
        'Запись информации об откате в deployment history'
      ],
      expectedOutput: 'workflow_dispatch: version=sha-abc1234\n-> Подтверждение -> Откат на sha-abc1234\n-> Telegram: "Откат выполнен: sha-abc1234 by admin"',
      hint: 'github.event.inputs.version содержит введённое значение. Деплой — тот же скрипт что и обычный, но с другим тегом образа.',
      solution: '# .github/workflows/rollback.yml\nname: Production Rollback\non:\n  workflow_dispatch:\n    inputs:\n      version:\n        description: "SHA или тег для отката (например sha-abc1234 или v2.0.0)"\n        required: true\n      reason:\n        description: "Причина отката"\n        required: true\n\njobs:\n  rollback:\n    runs-on: ubuntu-latest\n    environment:\n      name: production\n      url: https://example.com\n    steps:\n      - name: Логирование отката\n        run: |\n          echo "ROLLBACK: ${{ inputs.version }}"\n          echo "Причина: ${{ inputs.reason }}"\n          echo "Инициатор: ${{ github.actor }}"\n          echo "Время: $(date -u)"\n\n      - name: Откат через SSH\n        uses: appleboy/ssh-action@v1\n        with:\n          host: ${{ secrets.PROD_HOST }}\n          username: ubuntu\n          key: ${{ secrets.PROD_SSH_KEY }}\n          script: |\n            IMAGE=ghcr.io/${{ github.repository }}:${{ inputs.version }}\n            docker pull $IMAGE\n            docker stop current-app || true\n            docker run -d --name current-app -p 8000:8000 $IMAGE\n            sleep 10\n            curl -sf http://localhost:8000/health/ || exit 1\n            nginx -s reload\n\n      - name: Telegram уведомление\n        env:\n          TG_TOKEN: ${{ secrets.TG_TOKEN }}\n          TG_CHAT: ${{ secrets.TG_CHAT }}\n        run: |\n          curl -s -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \\\n            -d "chat_id=${TG_CHAT}&text=Откат выполнен%0AВерсия: ${{ inputs.version }}%0AПричина: ${{ inputs.reason }}%0AИнициатор: ${{ github.actor }}"',
      explanation: 'Rollback workflow — отдельный workflow только для отката. Требует явного указания версии и причины — это создаёт аудит-трейл. Environment с required reviewers — даже откат требует утверждения (на случай паники).'
    },
    {
      id: 7,
      title: 'Задача: Полный мониторинг пайплайна',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь comprehensive мониторинг и отчётность для всех workflow.',
      requirements: [
        'Reusable workflow notify.yml принимает status, message, channel',
        'Все deployment workflows используют notify как вызов после deploy',
        'Dashboard job: еженедельный отчёт о деплоях (количество, среднее время, failures)',
        'Badge в README для статусов CI и Deploy',
        'Retention policy: artifacts 7 дней, logs 30 дней'
      ],
      expectedOutput: 'Каждый деплой отправляет уведомление через reusable notify.yml\nКаждый понедельник: отчёт "7 деплоев, среднее время 4 мин, 0 failures"',
      hint: 'Reusable workflow вызывается через uses: ./.github/workflows/notify.yml with: status: success. Статистику деплоев можно получить через GitHub API.',
      solution: '# .github/workflows/notify.yml (reusable)\nname: Notify\non:\n  workflow_call:\n    inputs:\n      status:\n        type: string\n        required: true\n      message:\n        type: string\n        required: true\n    secrets:\n      TG_TOKEN:\n        required: true\n      TG_CHAT:\n        required: true\n\njobs:\n  notify:\n    runs-on: ubuntu-latest\n    steps:\n      - run: |\n          [ "${{ inputs.status }}" = "success" ] && ICON="" || ICON=""\n          curl -s -X POST "https://api.telegram.org/bot${{ secrets.TG_TOKEN }}/sendMessage" \\\n            -d "chat_id=${{ secrets.TG_CHAT }}&text=${ICON} ${{ inputs.message }}"\n\n# .github/workflows/weekly-report.yml\nname: Weekly Report\non:\n  schedule:\n    - cron: "0 9 * * 1"\njobs:\n  report:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Получить статистику деплоев\n        uses: actions/github-script@v7\n        with:\n          script: |\n            const runs = await github.rest.actions.listWorkflowRuns({\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              workflow_id: "production.yml",\n              per_page: 50\n            });\n            const week = runs.data.workflow_runs.filter(r =>\n              new Date(r.created_at) > new Date(Date.now() - 7*24*60*60*1000)\n            );\n            const success = week.filter(r => r.conclusion === "success").length;\n            console.log(`Деплоев за неделю: ${week.length}, успешных: ${success}`);\n      - uses: ./.github/workflows/notify.yml\n        with:\n          status: success\n          message: "Еженедельный отчёт готов"\n        secrets: inherit',
      explanation: 'secrets: inherit в reusable workflow call — передаёт все secrets родительского workflow. actions/github-script позволяет использовать GitHub API прямо в workflow без отдельного API запроса. listWorkflowRuns — история запусков конкретного workflow.'
    },
    {
      id: 8,
      title: 'Задача: Итоговый пайплайн',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объедини все компоненты в финальный production-ready CI/CD пайплайн.',
      requirements: [
        'Полный пайплайн: CI (тесты + lint + security) -> Build (Docker) -> Deploy Staging -> E2E -> Deploy Production (manual)',
        'Все компоненты из предыдущих задач интегрированы',
        'Dependabot настроен',
        'Branch protection включён',
        'Badges в README',
        'Rollback workflow готов',
        'Мониторинг и уведомления работают'
      ],
      expectedOutput: 'Полный автоматизированный путь кода:\ngit commit -> CI (авто) -> Staging (авто) -> E2E (авто) -> Production (ручное утверждение)',
      hint: 'Используй needs: для цепочки. Reusable workflows для переиспользования. Environment protection для production.',
      solution: '# Итоговая архитектура пайплайна:\n# .github/workflows/\n#   ci.yml           - тесты, линтинг, безопасность\n#   build.yml        - Docker образ, Trivy, GHCR\n#   staging.yml      - деплой staging + E2E\n#   production.yml   - деплой production (manual approval)\n#   rollback.yml     - ручной откат\n#   security-scan.yml- еженедельное сканирование\n#   weekly-report.yml- DORA метрики\n#   pr-title.yml     - Conventional Commits\n# .github/\n#   dependabot.yml\n#   CODEOWNERS\n#   actions/\n#     python-setup/action.yml\n#     ssh-deploy/action.yml\n#   PULL_REQUEST_TEMPLATE.md\n\n# Главный пайплайн: main.yml\nname: Main Pipeline\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main, develop]\n\njobs:\n  ci:\n    uses: ./.github/workflows/ci.yml\n\n  build:\n    needs: ci\n    if: github.ref == "refs/heads/main" || github.ref == "refs/heads/develop"\n    uses: ./.github/workflows/build.yml\n    secrets: inherit\n    permissions:\n      packages: write\n      contents: read\n\n  staging:\n    needs: build\n    if: github.ref == "refs/heads/develop"\n    uses: ./.github/workflows/staging.yml\n    secrets: inherit\n\n  production:\n    needs: build\n    if: github.ref == "refs/heads/main"\n    uses: ./.github/workflows/production.yml\n    secrets: inherit\n\n# README.md badges:\n# ![CI](https://github.com/myorg/myapp/actions/workflows/ci.yml/badge.svg)\n# ![Deploy](https://github.com/myorg/myapp/actions/workflows/production.yml/badge.svg)\n# ![Coverage](https://codecov.io/gh/myorg/myapp/badge.svg)',
      explanation: 'Главный main.yml оркестрирует все reusable workflows. needs: [build] + if: github.ref разделяет staging и production деплои. secrets: inherit передаёт все secrets в reusable workflows. permissions явно указываются для каждого workflow. Это production-ready CI/CD архитектура для реального продукта.'
    }
  ]
}
