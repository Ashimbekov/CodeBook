export default {
  id: 15,
  title: 'Практикум: Пайплайны',
  description: 'Практические задачи по созданию CI/CD пайплайнов для реальных сценариев.',
  lessons: [
    {
      id: 1,
      title: 'Задача: CI для Python библиотеки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай GitHub Actions workflow для open source Python библиотеки.',
      requirements: [
        'Matrix тестирование: Python 3.10, 3.11, 3.12 на ubuntu и windows',
        'Кеш pip через setup-python',
        'Coverage репорт через Codecov',
        'Публикация в PyPI при создании тега v*',
        'fail-fast: false для матрицы'
      ],
      expectedOutput: 'git tag v1.0.0 && git push --tags\n-> 6 тестовых jobs (3 Python * 2 OS)\n-> Публикация на PyPI через trusted publishing',
      hint: 'Trusted publishing PyPI не требует токена. Нужен environment pypi и permissions: id-token: write.',
      solution: '# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n    tags: ["v*"]\n  pull_request:\n\njobs:\n  test:\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [ubuntu-latest, windows-latest]\n        python: ["3.10", "3.11", "3.12"]\n    runs-on: ${{ matrix.os }}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python }}\n          cache: pip\n      - run: pip install -e ".[test]"\n      - run: pytest --cov=. --cov-report=xml\n      - uses: codecov/codecov-action@v4\n        if: matrix.os == "ubuntu-latest" && matrix.python == "3.12"\n        with:\n          token: ${{ secrets.CODECOV_TOKEN }}\n\n  publish:\n    if: startsWith(github.ref, "refs/tags/v")\n    needs: test\n    runs-on: ubuntu-latest\n    permissions:\n      id-token: write\n    environment: pypi\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n      - run: pip install build && python -m build\n      - uses: pypa/gh-action-pypi-publish@release/v1',
      explanation: 'Codecov только для ubuntu+py3.12 — нет смысла загружать coverage 6 раз. needs: test в publish гарантирует публикацию только при прохождении всех тестов на всех платформах.'
    },
    {
      id: 2,
      title: 'Задача: Монорепозиторий — selective CI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow для монорепозитория с двумя сервисами: backend (Python) и frontend (Node).',
      requirements: [
        'backend/ изменился -> запускать backend тесты',
        'frontend/ изменился -> запускать frontend тесты',
        'Оба изменились -> оба набора тестов',
        'Использовать paths фильтры в on: push:',
        'Отдельные workflows: backend.yml и frontend.yml'
      ],
      expectedOutput: 'git push с изменением backend/ -> только backend workflow\ngit push с изменением frontend/ -> только frontend workflow\ngit push с изменением обоих -> оба workflow',
      hint: 'paths: ["backend/**", "requirements*.txt"] в on: push: запустит workflow только при изменении указанных путей.',
      solution: '# .github/workflows/backend.yml\nname: Backend CI\non:\n  push:\n    paths:\n      - "backend/**"\n      - "requirements*.txt"\n      - ".github/workflows/backend.yml"\n  pull_request:\n    paths:\n      - "backend/**"\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    defaults:\n      run:\n        working-directory: backend\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r ../requirements.txt\n      - run: pytest\n\n# .github/workflows/frontend.yml\nname: Frontend CI\non:\n  push:\n    paths:\n      - "frontend/**"\n      - ".github/workflows/frontend.yml"\n  pull_request:\n    paths: ["frontend/**"]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    defaults:\n      run:\n        working-directory: frontend\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: {node-version: "20", cache: npm}\n      - run: npm ci\n      - run: npm test',
      explanation: 'defaults: run: working-directory: — не нужно писать cd backend в каждом step. Включай сам workflow файл в paths — если изменил workflow, нужно его протестировать тоже.'
    },
    {
      id: 3,
      title: 'Задача: GitLab CI для Django + Celery',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай .gitlab-ci.yml для Django приложения с Celery.',
      requirements: [
        'Стадии: test, build, deploy',
        'test job: PostgreSQL service, pytest с coverage',
        'lint job: flake8 и black --check параллельно с test',
        'build: сборка Docker образа в GitLab Registry',
        'deploy-staging: при push в develop, вручную',
        'deploy-prod: при merge в main, ручной с environment protection'
      ],
      expectedOutput: 'MR в develop: test + lint параллельно, кнопка deploy-staging\nMR в main: test + lint, build, кнопка deploy-prod с approval',
      hint: 'GitLab services: postgres: image: postgres:15 с переменными POSTGRES_PASSWORD и т.д.',
      solution: '# .gitlab-ci.yml\nstages: [test, build, deploy]\n\nvariables:\n  POSTGRES_DB: testdb\n  POSTGRES_USER: testuser\n  POSTGRES_PASSWORD: testpass\n  DATABASE_URL: postgresql://testuser:testpass@postgres/testdb\n  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"\n\n.python:\n  image: python:3.12-slim\n  cache:\n    key: "$CI_COMMIT_BRANCH"\n    paths: [.cache/pip/]\n  before_script:\n    - pip install -r requirements.txt\n\ntest:\n  extends: .python\n  stage: test\n  services:\n    - postgres:15-alpine\n  script:\n    - python manage.py migrate\n    - pytest --junitxml=junit.xml --cov=. --cov-report=xml\n  artifacts:\n    reports:\n      junit: junit.xml\n      coverage_report: {coverage_format: cobertura, path: coverage.xml}\n    when: always\n\nlint:\n  extends: .python\n  stage: test\n  script:\n    - pip install flake8 black\n    - flake8 . && black . --check\n\nbuild:\n  stage: build\n  image: docker:24\n  services: [docker:24-dind]\n  needs: [test]\n  script:\n    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY\n    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .\n    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA\n\ndeploy-staging:\n  stage: deploy\n  needs: [build]\n  script: echo "Деплой на staging $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "develop"\n      when: manual\n  environment: {name: staging, url: "https://staging.example.com"}\n\ndeploy-prod:\n  stage: deploy\n  needs: [build]\n  script: echo "Деплой на production"\n  rules:\n    - if: $CI_COMMIT_BRANCH == "main"\n      when: manual\n  environment: {name: production, url: "https://example.com"}',
      explanation: 'needs: [build] вместо needs: [test] в deploy jobs — build уже зависит от test, нет нужды дублировать зависимость. services: на уровне test job подключает PostgreSQL только для этого job.'
    },
    {
      id: 4,
      title: 'Задача: Автоматический changelog и versioning',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой автоматическое версионирование по коммитам в стиле Conventional Commits.',
      requirements: [
        'Conventional Commits: feat:, fix:, docs:, BREAKING CHANGE:',
        'Workflow release: при push в main запускает semantic-release',
        'semantic-release автоматически определяет версию и создаёт тег',
        'CHANGELOG.md генерируется автоматически',
        'GitHub Release создаётся с changelog'
      ],
      expectedOutput: 'git commit -m "feat: добавлена авторизация" -> minor версия (1.1.0)\ngit commit -m "fix: исправлен баг входа" -> patch версия (1.1.1)\nBREAKING CHANGE -> major версия (2.0.0)',
      hint: 'npm install @semantic-release/changelog @semantic-release/git. Конфиг в .releaserc.json.',
      solution: '# .releaserc.json\n{\n  "branches": ["main"],\n  "plugins": [\n    "@semantic-release/commit-analyzer",\n    "@semantic-release/release-notes-generator",\n    ["@semantic-release/changelog", {"changelogFile": "CHANGELOG.md"}],\n    "@semantic-release/github",\n    ["@semantic-release/git", {\n      "assets": ["CHANGELOG.md"],\n      "message": "chore(release): ${nextRelease.version} [skip ci]"\n    }]\n  ]\n}\n\n# .github/workflows/release.yml\nname: Release\non:\n  push:\n    branches: [main]\njobs:\n  release:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n      issues: write\n      pull-requests: write\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n          persist-credentials: false\n      - uses: actions/setup-node@v4\n        with: {node-version: "20"}\n      - run: npm install -g semantic-release @semantic-release/changelog @semantic-release/git\n      - run: npx semantic-release\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
      explanation: '[skip ci] в сообщении коммита от semantic-release предотвращает бесконечный цикл запусков. fetch-depth: 0 нужен для анализа всех коммитов с последнего релиза. persist-credentials: false — semantic-release сам управляет аутентификацией.'
    },
    {
      id: 5,
      title: 'Задача: CI для Django с несколькими БД',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай workflow тестирующий Django приложение с SQLite, PostgreSQL и MySQL.',
      requirements: [
        'Matrix: database [sqlite, postgresql, mysql]',
        'Для sqlite: DATABASE_URL=sqlite:///test.db',
        'Для postgresql: service postgres:15',
        'Для mysql: service mysql:8',
        'Кастомный pytest.ini или conftest настраивающий БД из переменной окружения'
      ],
      expectedOutput: 'Запускается 3 параллельных jobs:\n- test (sqlite) - без сервисов\n- test (postgresql) - с postgres service\n- test (mysql) - с mysql service',
      hint: 'Использовать if: matrix.database == "postgresql" для include секции с services. GitHub Actions позволяет services на уровне job — но matrix jobs не могут иметь разные services напрямую. Решение: отдельные jobs.',
      solution: '# .github/workflows/test-databases.yml\nname: DB Tests\non: [push, pull_request]\n\njobs:\n  test-sqlite:\n    runs-on: ubuntu-latest\n    env:\n      DATABASE_URL: sqlite:///test.db\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements.txt\n      - run: pytest\n\n  test-postgres:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:15-alpine\n        env: {POSTGRES_USER: user, POSTGRES_PASSWORD: pass, POSTGRES_DB: testdb}\n        ports: ["5432:5432"]\n        options: --health-cmd pg_isready --health-retries 5\n    env:\n      DATABASE_URL: postgresql://user:pass@localhost:5432/testdb\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements.txt psycopg2-binary\n      - run: pytest\n\n  test-mysql:\n    runs-on: ubuntu-latest\n    services:\n      mysql:\n        image: mysql:8\n        env: {MYSQL_ROOT_PASSWORD: root, MYSQL_DATABASE: testdb}\n        ports: ["3306:3306"]\n        options: --health-cmd "mysqladmin ping" --health-retries 5\n    env:\n      DATABASE_URL: mysql://root:root@127.0.0.1:3306/testdb\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements.txt mysqlclient\n      - run: pytest',
      explanation: 'Services в GitHub Actions — на уровне job, не шага. Поэтому для разных баз нужны отдельные jobs. Это также даёт явное именование в UI. mysql: 127.0.0.1 вместо localhost — MySQL driver может требовать IP.'
    },
    {
      id: 6,
      title: 'Задача: Workflow для review apps',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай workflow развёртывания временного окружения для каждого PR.',
      requirements: [
        'При открытии PR: деплой review app с уникальным URL (pr-{number}.staging.example.com)',
        'При закрытии PR: удаление review app',
        'Комментарий к PR с URL review app',
        'Использовать GitHub environments с динамическим именем',
        'URL добавляется в environment url'
      ],
      expectedOutput: 'PR #42 открыт -> деплой review-pr-42 -> комментарий "Review app: https://pr-42.staging.example.com"\nPR #42 закрыт -> удаление review-pr-42',
      hint: 'on: pull_request: types: [opened, synchronize, reopened, closed]. Для удаления: if: github.event.action == "closed".',
      solution: '# .github/workflows/review-app.yml\nname: Review Apps\non:\n  pull_request:\n    types: [opened, synchronize, reopened, closed]\n\njobs:\n  deploy-review:\n    if: github.event.action != "closed"\n    runs-on: ubuntu-latest\n    permissions:\n      pull-requests: write\n    environment:\n      name: review-pr-${{ github.event.number }}\n      url: https://pr-${{ github.event.number }}.staging.example.com\n    steps:\n      - uses: actions/checkout@v4\n      - name: Деплой review app\n        run: echo "Деплой PR #${{ github.event.number }}"\n      - name: Комментарий к PR\n        uses: actions/github-script@v7\n        with:\n          script: |\n            github.rest.issues.createComment({\n              issue_number: context.issue.number,\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              body: "Review app задеплоен: https://pr-${{ github.event.number }}.staging.example.com"\n            })\n\n  destroy-review:\n    if: github.event.action == "closed"\n    runs-on: ubuntu-latest\n    steps:\n      - name: Удалить review app\n        run: echo "Удаление review app для PR #${{ github.event.number }}"',
      explanation: 'github.event.number — номер PR. github.event.action — тип события. Два отдельных jobs с if условиями — чище чем один job с условными steps. Environment с URL автоматически показывается в интерфейсе PR.'
    },
    {
      id: 7,
      title: 'Задача: Scheduled security scan',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай scheduled workflow для еженедельного сканирования безопасности.',
      requirements: [
        'Расписание: каждый понедельник в 9:00 UTC',
        'Также запускается вручную (workflow_dispatch)',
        'Trivy сканирование production Docker образа',
        'safety check зависимостей Python',
        'bandit SAST сканирование кода',
        'Результаты публикуются как artifacts, уведомление в Slack при нахождении проблем'
      ],
      expectedOutput: 'Каждый понедельник 9:00 -> scan job\nНайдены CRITICAL уязвимости -> Slack уведомление\nВсё чисто -> "No vulnerabilities found"',
      hint: 'continue-on-error: true для scan steps чтобы все сканеры отработали. Финальный step проверяет результаты и отправляет уведомление.',
      solution: '# .github/workflows/security.yml\nname: Security Scan\non:\n  schedule:\n    - cron: "0 9 * * 1"\n  workflow_dispatch:\n\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12"}\n\n      - name: Safety (зависимости)\n        run: pip install safety && safety check -r requirements.txt\n        continue-on-error: true\n        id: safety\n\n      - name: Bandit (SAST)\n        run: pip install bandit && bandit -r src/ -ll -f json -o bandit.json\n        continue-on-error: true\n        id: bandit\n\n      - name: Trivy (Docker)\n        uses: aquasecurity/trivy-action@master\n        with:\n          image-ref: ghcr.io/${{ github.repository }}:latest\n          severity: CRITICAL,HIGH\n          output: trivy.json\n          format: json\n        continue-on-error: true\n        id: trivy\n\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: security-reports\n          path: "*.json"\n\n      - name: Slack уведомление\n        if: steps.safety.outcome == "failure" || steps.trivy.outcome == "failure"\n        run: |\n          curl -s -X POST ${{ secrets.SLACK_WEBHOOK }} \\\n            -H "Content-Type: application/json" \\\n            -d "{\"text\": \":warning: Найдены уязвимости безопасности в ${{ github.repository }}! Проверьте результаты сканирования.\"}"',
      explanation: 'continue-on-error: true + id: для каждого scan step — можно проверить steps.safety.outcome == "failure". Все сканеры отработают даже если первый нашёл проблему. Артефакты сохраняются всегда для анализа.'
    },
    {
      id: 8,
      title: 'Задача: Self-hosted runner настройка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow использующий self-hosted runner с Docker для изолированных тестов.',
      requirements: [
        'Workflow использует runs-on: [self-hosted, linux, docker]',
        'Тесты запускаются внутри Docker контейнера (не на хосте)',
        'После job очищать Docker артефакты: docker system prune -f',
        'Fallback на ubuntu-latest если self-hosted недоступен (через matrix)',
        'Timeout 30 минут для всего job'
      ],
      expectedOutput: 'Если self-hosted runner онлайн: тест запускается на нём\nОчистка Docker после каждого job\ntimeout-minutes: 30',
      hint: 'Для fallback: два отдельных job с if условиями или использовать environment variables для выбора runner.',
      solution: '# .github/workflows/self-hosted.yml\nname: Self-Hosted Tests\non: [push]\n\njobs:\n  test-self-hosted:\n    runs-on: [self-hosted, linux, docker]\n    timeout-minutes: 30\n    container:\n      image: python:3.12-slim\n      options: --user root\n    steps:\n      - uses: actions/checkout@v4\n      - run: |\n          pip install -r requirements.txt\n          pytest --tb=short\n\n    # Очистка после job\n    # Добавить в self-hosted runner конфиг:\n    # RUNNER_CLEANUP_TEMP_DIRECTORY=true\n    # Или в post step:\n      - name: Docker cleanup\n        if: always()\n        run: docker system prune -f || true\n\n  test-fallback:\n    runs-on: ubuntu-latest\n    if: false  # включить если self-hosted недоступен\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: "3.12", cache: pip}\n      - run: pip install -r requirements.txt && pytest',
      explanation: 'container: в job запускает все steps внутри Docker контейнера на self-hosted runner. Это изолирует окружение. timeout-minutes: защита от зависших jobs которые заблокируют runner. docker system prune очищает неиспользуемые образы и контейнеры.'
    },
    {
      id: 9,
      title: 'Задача: Composite Action для деплоя',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай переиспользуемый composite action для SSH деплоя.',
      requirements: [
        '.github/actions/ssh-deploy/action.yml',
        'Inputs: host, username, key, command, working_directory',
        'Outputs: deploy_status (success/failure)',
        'Использует appleboy/ssh-action внутри',
        'Логирует начало и конец деплоя с timestamp',
        'Используется в deploy workflow как uses: ./.github/actions/ssh-deploy'
      ],
      expectedOutput: 'Composite action инкапсулирует SSH логику\nДеплой в workflow: uses: ./.github/actions/ssh-deploy with: host: server.com',
      hint: 'Composite action outputs задаются через echo "deploy_status=success" >> $GITHUB_OUTPUT в run step.',
      solution: '# .github/actions/ssh-deploy/action.yml\nname: SSH Deploy\ndescription: Деплой через SSH\ninputs:\n  host:\n    required: true\n  username:\n    default: ubuntu\n  key:\n    required: true\n  command:\n    required: true\n  working_directory:\n    default: /app\noutputs:\n  deploy_status:\n    description: Статус деплоя\n    value: ${{ steps.deploy.outputs.status }}\n\nruns:\n  using: composite\n  steps:\n    - name: Деплой\n      id: deploy\n      uses: appleboy/ssh-action@v1\n      with:\n        host: ${{ inputs.host }}\n        username: ${{ inputs.username }}\n        key: ${{ inputs.key }}\n        script: |\n          echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Начало деплоя"\n          cd ${{ inputs.working_directory }}\n          ${{ inputs.command }}\n          echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Деплой завершён"\n\n# Использование в workflow:\n# - uses: ./.github/actions/ssh-deploy\n#   with:\n#     host: ${{ secrets.SERVER_HOST }}\n#     key: ${{ secrets.SSH_KEY }}\n#     command: "git pull && docker-compose up -d --build"',
      explanation: 'Composite action — переиспользуемый блок с inputs и outputs. Инкапсулирует SSH логику — workflows используют action не зная деталей. Логирование времени начала и конца — помогает диагностировать медленные деплои.'
    },
    {
      id: 10,
      title: 'Задача: Full Pipeline с DORA метриками',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полный CI/CD pipeline отслеживающий DORA метрики.',
      requirements: [
        'Запись времени начала пайплайна в начале job',
        'Отправка метрики "deployment" при успешном деплое',
        'Отправка метрики "failed_deployment" при провале',
        'Lead time: разница между коммитом и деплоем',
        'Метрики отправляются в простой JSON файл или внешний endpoint',
        'Workflow dispatch для ручного отката (rollback)'
      ],
      expectedOutput: 'Успешный деплой -> метрика {type: "deployment", repo: "...", duration: 180, timestamp: "..."}',
      hint: 'git log --format="%ct" -1 HEAD даёт timestamp последнего коммита в Unix time. $(date +%s) - $COMMIT_TIME = lead time.',
      solution: '# .github/workflows/deploy-metrics.yml\nname: Deploy with Metrics\non:\n  push:\n    branches: [main]\n  workflow_dispatch:\n    inputs:\n      rollback:\n        type: boolean\n        default: false\n        description: "Откатиться к предыдущей версии"\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n        with: {fetch-depth: 2}\n\n      - name: Запись времени начала\n        run: |\n          echo "PIPELINE_START=$(date +%s)" >> $GITHUB_ENV\n          COMMIT_TIME=$(git log --format="%ct" -1 HEAD)\n          echo "COMMIT_TIME=$COMMIT_TIME" >> $GITHUB_ENV\n\n      - name: Деплой или откат\n        run: |\n          if [ "${{ inputs.rollback }}" = "true" ]; then\n            echo "Откат к предыдущей версии"\n          else\n            echo "Деплой ${{ github.sha }}"\n          fi\n\n      - name: Отправить DORA метрику\n        if: always()\n        run: |\n          END=$(date +%s)\n          DURATION=$(( END - PIPELINE_START ))\n          LEAD_TIME=$(( END - COMMIT_TIME ))\n          STATUS="${{ job.status }}"\n          TYPE=$([ "$STATUS" = "success" ] && echo "deployment" || echo "failed_deployment")\n          echo "{\"type\":\"$TYPE\",\"repo\":\"${{ github.repository }}\",\"sha\":\"${{ github.sha }}\",\"duration\":$DURATION,\"lead_time\":$LEAD_TIME,\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"\n          # В реальности: curl -X POST $METRICS_ENDPOINT -d @-',
      explanation: 'git log --format="%ct" даёт Unix timestamp коммита. Lead time = время деплоя - время коммита. Эта метрика показывает насколько быстро изменения попадают в продакшен — ключевая DORA метрика.'
    }
  ]
}
